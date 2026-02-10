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

// const MEM_SIZE = 1000;  // Memory size in 64K Pakes (512Mb)
const MEM_SIZE = 25;  // Memory size in 64K Pakes (1600Kb)


import thread from "./threadman_thread.js";
import os from "os";
import Worker from "web-worker";

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let workerSource;

const threadStr = `(${thread.toString()})(self)`;
if(process.browser) {
    if(globalThis?.Blob) {
        const threadBytes= new TextEncoder().encode(threadStr);
        const workerBlob = new Blob([threadBytes], { type: "application/javascript" }) ;
        workerSource = URL.createObjectURL(workerBlob);
    } else {
        workerSource = "data:application/javascript;base64," + globalThis.btoa(threadStr);
    }
} else {  
    workerSource = "data:application/javascript;base64," + Buffer.from(threadStr).toString("base64");
}



export default async function buildThreadManager(wasm, singleThread) {
    const tm = new ThreadManager();

    tm.memory = new WebAssembly.Memory({initial:MEM_SIZE});
    tm.u8 = new Uint8Array(tm.memory.buffer);
    tm.u32 = new Uint32Array(tm.memory.buffer);

    const wasmModule = await WebAssembly.compile(wasm.code);

    tm.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": tm.memory
        }
    });
    
    if(process.browser && !globalThis?.Worker) {
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

    //    tm.pTmp0 = tm.alloc(curve.G2.F.n8*3);
    //    tm.pTmp1 = tm.alloc(curve.G2.F.n8*3);

    if (singleThread) {
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice()
        }]);
        tm.concurrency  = 1;
    } else {
        tm.workers = [];
        tm.pendingDeferreds = [];
        tm.working = [];
        tm.initialized = [];
        tm.initializing = [];
        tm.terminating = [];

        let concurrency = 2;
        if (process.browser) {
            if (typeof navigator === "object" && navigator.hardwareConcurrency) {
                concurrency = navigator.hardwareConcurrency;
            }
        } else {
            concurrency = os.cpus().length;
        }

        if(concurrency === 0){
            concurrency = 2;
        }

        //concurrency = 10; // For testing

        // Limit to 64 threads for memory reasons.
        if (concurrency>64) concurrency=64;
        tm.concurrency = concurrency;

        // for (let i = 0; i<1; i++) {
        //
        //     tm.workers[i] = new Worker(workerSource);
        //
        //     tm.workers[i].addEventListener("message", getOnMsg(i));
        //     //tm.workers[i].addEventListener("error", getOnError(i));
        //
        //     tm.working[i]=false;
        // }
        //
        // const initPromises = [];
        // for (let i=0; i<tm.workers.length;i++) {
        //     const copyCode = wasm.code.slice();
        //     initPromises.push(tm.postAction(i, [{
        //         cmd: "INIT",
        //         init: MEM_SIZE,
        //         code: copyCode
        //     }], [copyCode.buffer]));
        // }
        //
        // // for (let i=0; i<tm.workers.length;i++) {
        // //     //const copyCode = wasm.code.slice();
        // //     initPromises.push(tm.postAction(i, [{
        // //         cmd: "INIT",
        // //         init: MEM_SIZE,
        // //         code: wasmModule
        // //     }]//, [copyCode.buffer]
        // //     ));
        // // }
        //
        // await Promise.all(initPromises);

        // const initPromises = [];
        // for (let i = 0; i < tm.concurrency; i++) {
        //     initPromises.push(tm.startWorker(i));
        // }
        // await Promise.all(initPromises);

    }
    return tm;



}

export class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
    }

    getOnMsg(i) {
        const tm = this;
        return async function(e) {
            let data;
            if ((e)&&(e.data)) {
                data = e.data;
            } else {
                data = e;
            }

            // handle errors
            if (data.error) {
                tm.working[i]=false;
                tm.pendingDeferreds[i].reject("Worker error: " + data.error);
                if (tm.initializing[i]) {
                    tm.initializing[i]=false;
                    tm.workers[i]=null;
                } else {
                    //tm.workers[i].postMessage([{cmd: "TERMINATE"}]);
                }
                throw new Error("Worker error: " + data.error);
            }

            // handle status messages
            if (data.status) {
                if (data.status === "initialized") {
                    // Initialization successful message
                    tm.initializing[i]=false;
                    tm.initialized[i]=true;
                } else if (data.status === "graceful_termination") {
                    // Graceful termination message
                    console.log(`Worker ${i} is going to terminate gracefully.`);
                    tm.initialized[i]=false;
                    tm.initializing[i]=false;
                    tm.working[i]=false;
                    tm.workers[i]=null;
                } else if (data.status === "terminated") {
                    // Termination successful message
                    tm.initialized[i]=false;
                    tm.initializing[i]=false;
                    tm.workers[i]=null;
                    tm.working[i]=null;
                    return;
                }
                //return;
            }

            tm.working[i]=false;
            tm.pendingDeferreds[i].resolve(data);
            await tm.processWorks();
        };
    }

    getOnError(i) {
        const tm = this;
        return function(e) {
            console.log("error event in worker:", e);
            tm.working[i]=false;
            tm.initialized[i]=false;

            tm.pendingDeferreds[i].reject(e.message);
            throw new Error("Worker error: " + e.message);
        };
    }

    startWorker(i){
        this.workers[i] = new Worker(workerSource);

        this.workers[i].addEventListener("message", this.getOnMsg(i));
        this.workers[i].addEventListener("error", this.getOnError(i));

        //this.working[i]=true;
        this.initializing[i] = true;

        // const copyCode = this.code.slice();
        // await this.postAction(i, [{
        //     cmd: "INIT",
        //     init: MEM_SIZE,
        //     code: copyCode
        // }], [copyCode.buffer]);

        //     //const copyCode = wasm.code.slice();
        this.postAction(i, [{
            cmd: "INIT",
            init: MEM_SIZE,
            code: this.wasmModule
        }]).then(() => {
            this.initialized[i] = true;
        });
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

    async postAction(workerId, e, transfers, _deferred) {
        if (this.working[workerId]) {
            throw new Error("Posting a job to a working worker");
        }
        this.working[workerId] = true;

        this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
        await this.workers[workerId].postMessage(e, transfers);

        return this.pendingDeferreds[workerId].promise;
    }

    async processWorks() {

        //console.log("this.actionQueue.length:", this.actionQueue.length);

        for (let i=0; (i<this.concurrency)&&(this.actionQueue.length > 0); i++) {
            if (this.workers[i] && this.initialized[i] && !this.working[i]) {
                const work = this.actionQueue.shift();
                await this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }

        // Initialize more workers if needed
        if (this.actionQueue.length > 0) {
            // Find a worker that is not initialized yet
            let initializingCount = 0;
            for (let i=0; i<this.concurrency; i++) {
                initializingCount += this.initializing[i];
                if (this.initialized[i]) continue;
                if (this.initializing[i]) continue;
                if (initializingCount >= this.actionQueue.length) break;

                // Initialize this worker
                console.log(`Worker ${i} not initialized yet. Initializing...`);
                initializingCount++;
                await this.startWorker(i);
                //this.startWorker(i);
            }
        }
    }

    async queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            // Wait if queue is too large
            // while (this.actionQueue.length >= this.concurrency * 2) {
            //     await sleep(10);
            // }
            this.actionQueue.push({
                data: actionData,
                transfers: transfers,
                deferred: d
            });
            await this.processWorks();
        }
        return d.promise;
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
        return this.u8.slice(pointer, pointer+ length);
    }

    setBuff(pointer, buffer) {
        this.u8.set(new Uint8Array(buffer), pointer);
    }

    alloc(length) {
        while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    async terminate() {
        //console.log("terminate!!!");
        for (let i=0; i<this.workers.length; i++) {
            this.workers[i].postMessage([{cmd: "TERMINATE"}]);
        }
        // Give some time to the workers to terminate
        //await sleep(200);
    }

}
