/*
    Copyright 2019 0KIMS association.

    This file is part of wasmsnark (Web Assembly zkSnark Prover).

    wasmsnark is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmsnark is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
*/

// const MEM_SIZE = 1000;  // Memory size in 64K Pages (512Mb)
const MEM_SIZE = 25;  // Memory size in 64K Pages (1600Kb)

import thread from "./threadman_thread.js";
import workerpool from "workerpool";
import {
    getConcurrency,
    getWorkerType,
    supportsWorkers,
    getWorkerSource,
} from "#threadman-platform";


export default async function buildThreadManager(wasm, singleThread) {
    const tm = new ThreadManager();

    tm.memory = new WebAssembly.Memory({ initial: MEM_SIZE });
    tm.u8 = new Uint8Array(tm.memory.buffer);
    tm.u32 = new Uint32Array(tm.memory.buffer);

    const wasmModule = await WebAssembly.compile(wasm.code);

    tm.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": tm.memory
        }
    });

    if (!supportsWorkers()) {
        singleThread = true;
    }

    tm.singleThread = singleThread;
    tm.initalPFree = tm.u32[0];   // Save the Pointer to free space.
    tm.pq = wasm.pq;
    tm.pr = wasm.pr;
    tm.pG1gen = wasm.pG1gen;
    tm.pG1zero = wasm.pG1zero;
    tm.pG2gen = wasm.pG2gen;
    tm.pG2zero = wasm.pG2zero;
    tm.pOneT = wasm.pOneT;

    tm.code = wasm.code;
    tm.wasmModule = wasmModule;

    if (singleThread) {
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice()
        }]);
        tm.concurrency = 1;
    } else {
        const rawConcurrency = getConcurrency();
        const concurrency = Math.min(Math.max(rawConcurrency, 2), 64);

        tm.concurrency = concurrency;

        tm.pool = workerpool.pool(getWorkerSource(), {
            maxWorkers: concurrency,
            workerType: getWorkerType(),
        });

        // Eagerly initialise all workers with the already-compiled
        // WebAssembly.Module.  Passing the module instead of raw bytes avoids
        // copying concurrency × wasmSize bytes and re-compiling in each worker.
        // WebAssembly.Module is structured-cloned by the workers channel.
        const initPromises = [];
        for (let i = 0; i < concurrency; i++) {
            initPromises.push(
                tm.pool.exec("runTask", [[{
                    cmd: "INIT",
                    init: MEM_SIZE,
                    code: tm.wasmModule
                }]])
            );
        }
        await Promise.all(initPromises);
    }

    return tm;
}

export class ThreadManager {
    constructor() {
        this.oldPFree = 0;
    }

    startSyncOp() {
        if (this.oldPFree !== 0) throw new Error("Sync operation in progress");
        this.oldPFree = this.u32[0];
    }

    endSyncOp() {
        if (this.oldPFree === 0) throw new Error("No sync operation in progress");
        this.u32[0] = this.oldPFree;
        this.oldPFree = 0;
    }

    async queueAction(actionData, transfers) {
        if (this.singleThread) {
            return this.taskManager(actionData);
        }

        // Callers pass only consumed input buffers in `transfers`; those
        // ArrayBuffers are transferred zero-copy to the worker thread.
        return this.pool.exec("runTask", [actionData], { transfer: transfers });
    }

    resetMemory() {
        this.u32[0] = this.initalPFree;
    }

    allocBuff(buff) {
        const pointer = this.alloc(buff.byteLength);
        this.setBuff(pointer, buff);
        return pointer;
    }

    getBuff(pointer, length) {
        return this.u8.slice(pointer, pointer + length);
    }

    setBuff(pointer, buffer) {
        this.u8.set(new Uint8Array(buffer), pointer);
    }

    alloc(length) {
        // Branchless 4-byte alignment: same result as the alignment loop.
        this.u32[0] = (this.u32[0] + 3) & ~3;
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    async terminate() {
        if (this.pool) {
            await this.pool.terminate(true);
        }
    }
}
