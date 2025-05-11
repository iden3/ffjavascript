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

    //    tm.pTmp0 = tm.alloc(curve.G2.F.n8*3);
    //    tm.pTmp1 = tm.alloc(curve.G2.F.n8*3);

    if (singleThread) {
        tm.code = wasm.code;
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

        let concurrency = 4;
        if (process.browser) {
            if (typeof navigator === "object" && navigator.hardwareConcurrency) {
                concurrency = navigator.hardwareConcurrency;
            }
        } else {
            concurrency = os.cpus().length;
        }

        if(concurrency === 0){
            concurrency = 4;
        }

        // Limit to 64 threads for memory reasons.
        if (concurrency>64) concurrency=64;
        tm.concurrency = concurrency;

        // for (let i = 0; i<concurrency; i++) {
        //
        //     tm.workers[i] = new Worker(workerSource);
        //
        //     tm.workers[i].addEventListener("message", getOnMsg(i));
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
        // await Promise.all(initPromises);

        tm.workerInitFunction = async function (i) {
            //const copyCode = wasm.code.slice();
            return tm.postAction(i, [{
                cmd: "INIT",
                init: MEM_SIZE,
                code: wasmModule
            }], []);
        };
    }
    return tm;
}

export class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
        this.workerInitFunction = null;
    }

    startWorker() {
        let i = this.workers.length;
        let worker = new Worker(workerSource);
        worker.addEventListener("message", this.getOnMsg(i));
        this.workers[i] = worker;
        this.working[i] = false;
        this.initialized[i] = false;
        if (this.workerInitFunction) {
            this.workerInitFunction(i).then(() => {
                this.initialized[i] = true;
                this.processWorks();
            }).catch((e) => {
                console.error("Error initializing worker", i, e);
                this.initialized[i] = false;
                this.working[i] = false;
            });
        }
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

    postAction(workerId, e, transfers, _deferred) {
        if (this.working[workerId]) {
            throw new Error("Posting a job to a working worker");
        }
        this.working[workerId] = true;

        this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
        this.workers[workerId].postMessage(e, transfers);

        return this.pendingDeferreds[workerId].promise;
    }

    processWorks() {
        //console.log("Processing work");
        //console.log("Workers length: ", this.workers.length);
        for (let i=0; (i<this.workers.length)&&(this.actionQueue.length > 0); i++) {
            if (this.initialized[i] && !this.working[i]) {
                const work = this.actionQueue.shift();
                this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }
        if (this.actionQueue.length > 0 && this.workers.length < this.concurrency) {
            const startNum = Math.min(this.actionQueue.length, this.concurrency - this.workers.length);
            for (let i=0; i<startNum; i++) {
                this.startWorker();
            }
        }

        // if (this.actionQueue.length === 0 && this.workers.length > 0) {
        //     for (let i=0; i<this.workers.length; i++) {
        //         if (this.working[i] || !this.initialized[i]) {
        //             return;
        //         }
        //     }
        //     let tm = this;
        //     console.log("### Scheduling termination ###");
        //     sleep(100).then(() => {
        //         if (tm.actionQueue.length === 0 && this.workers.length > 0) {
        //             for (let i=0; i<tm.workers.length; i++) {
        //                 if (tm.working[i] || !this.initialized[i]) {
        //                     return;
        //                 }
        //             }
        //             console.log("### Running scheduled termination ###");
        //             tm.terminate();
        //         }
        //     });
        // }
    }

    queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            this.actionQueue.push({
                data: actionData,
                transfers: transfers,
                deferred: d
            });
            this.processWorks();
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

    getOnMsg(i) {
        let tm = this;
        return function(e) {
            let data;
            if ((e)&&(e.data)) {
                data = e.data;
            } else {
                data = e;
            }

            tm.working[i]=false;
            tm.pendingDeferreds[i].resolve(data);
            tm.processWorks();
        };
    }


    async terminate() {
        //console.log("Terminating workers in thread manager");
        //console.log("Workers", this.workers);
        for (let i=0; i<this.workers.length; i++) {
            this.workers[i].postMessage([{cmd: "TERMINATE"}]);
        }
        await sleep(200);
        // console.log("Termination messages sent");
        // for (let i=0; i<this.workers.length; i++) {
        //     this.workers[i].terminate();
        // }
        // this.workers = [];
        // this.working = [];
        // console.log("Pending deferreds", this.pendingDeferreds);
        // for (let i=0; i<this.pendingDeferreds.length; i++) {
        //     this.pendingDeferreds[i].reject("Worker terminated");
        // }
        // this.pendingDeferreds = [];
        // this.initialized = [];
    }

}
