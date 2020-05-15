/* global navigator, Blob, Worker, WebAssembly */
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

const MEM_SIZE = 4096;  // Memory size in 64K Pakes (256Mb)


const assert = require("assert");
const thread = require("./engine_thread");

const inBrowser = (typeof window !== "undefined");
let NodeWorker;
let NodeCrypto;
if (!inBrowser) {
    NodeWorker = require("worker_threads").Worker;
    NodeCrypto = require("crypto");
}

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}


async function buildEngine(curve, wasm, singleThread) {
    const engine = new Engine();

    engine.curve = curve;

    engine.memory = new WebAssembly.Memory({initial:MEM_SIZE});
    engine.u8 = new Uint8Array(engine.memory.buffer);
    engine.u32 = new Uint32Array(engine.memory.buffer);

    const wasmModule = await WebAssembly.compile(wasm.code);

    engine.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": engine.memory
        }
    });

    engine.singleThread = singleThread;
    engine.initalPFree = engine.u32[0];   // Save the Pointer to free space.
    engine.pq = wasm.pq;
    engine.pr = wasm.pr;
    engine.pG1gen = wasm.pG1gen;
    engine.pG1zero = wasm.pG1zero;
    engine.pG2gen = wasm.pG2gen;
    engine.pG2zero = wasm.pG2zero;
    engine.pOneT = wasm.pOneT;

    engine.pTmp0 = engine.alloc(curve.G2.F.n8*3);
    engine.pTmp1 = engine.alloc(curve.G2.F.n8*3);


    if (singleThread) {
        engine.code = wasm.code;
        engine.taskManager = thread();
        await engine.taskManager({
            command: "INIT",
            init: MEM_SIZE,
            code: wasm.code
        });
        engine.concurrency  = 1;
    } else {
        engine.workers = [];
        engine.pendingDeferreds = [];
        engine.working = [];

        let concurrency;

        if ((typeof(navigator) === "object") && navigator.hardwareConcurrency) {
            concurrency = navigator.hardwareConcurrency;
        } else {
            concurrency = 8;
        }

        for (let i = 0; i<concurrency; i++) {

            if (inBrowser) {
                const blob = new Blob(["(", thread.toString(), ")(self);"], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);

                engine.workers[i] = new Worker(url);

                engine.workers[i].onmessage = getOnMsg(i);

            } else {
                engine.workers[i] = new NodeWorker("(" + thread.toString()+ ")(require('worker_threads').parentPort);", {eval: true});

                engine.workers[i].on("message", getOnMsg(i));
            }

            engine.working[i]=false;
        }

        const initPromises = [];
        for (let i=0; i<engine.workers.length;i++) {
            const copyCode = wasm.code.buffer.slice(0);
            initPromises.push(engine.postAction(i, {
                command: "INIT",
                init: MEM_SIZE,
                code: copyCode

            }, [copyCode]));
        }

        await Promise.all(initPromises);

    }
    return engine;

    function getOnMsg(i) {
        return function(e) {
            let data;
            if ((e)&&(e.data)) {
                data = e.data;
            } else {
                data = e;
            }

            engine.working[i]=false;
            engine.pendingDeferreds[i].resolve(data);
            engine.processWorks();
        };
    }

}

class Engine {
    constructor() {
        this.actionQueue = [];
    }

    postAction(workerId, e, transfers, _deferred) {
        assert(this.working[workerId] == false);
        this.working[workerId] = true;

        this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
        this.workers[workerId].postMessage(e, transfers);

        return this.pendingDeferreds[workerId].promise;
    }

    processWorks() {
        for (let i=0; (i<this.workers.length)&&(this.actionQueue.length > 0); i++) {
            if (this.working[i] == false) {
                const work = this.actionQueue.shift();
                this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }
    }

    queueAction(actionData, transfers) {
        if (this.singleThread) {
            const res = this.taskManager(actionData);
            return res[0];
        } else {
            const d = new Deferred();
            this.actionQueue.push({
                data: actionData,
                transfers: transfers,
                deferred: d
            });
            this.processWorks();
            return d.promise;
        }
    }

    resetMemory() {
        this.u32[0] = this.initalPFree;
    }

    allocG1(P) {
        const pointer = this.alloc(this.curve.G1.F.n8*3);
        if (P) this.setG1(pointer, P);
        return pointer;
    }

    allocG2(P) {
        const pointer = this.alloc(this.curve.G2.F.n8*3);
        if (P) this.setG2(pointer, P);
        return pointer;
    }

    allocF1(e) {
        const pointer = this.alloc(this.curve.F1.n8);
        if (e) this.setF1(pointer, e);
        return pointer;
    }

    allocF2(e) {
        const pointer = this.alloc(this.curve.F2.n8);
        if (e) this.setF2(pointer, e);
        return pointer;
    }

    allocFr(e) {
        const pointer = this.alloc(this.curve.Fr.n8);
        if (e) this.setFr(pointer, e);
        return pointer;
    }

    setG1(pointer, point) {
        this.curve.G1.toRprLE(this.memory, pointer, point);
        this.instance.g1m_toMontgomery(pointer, pointer);
    }

    setG2(pointer, point) {
        this.curve.G2.toRprLE(this.memory, pointer, point);
        this.instance.g2m_toMontgomery(pointer, pointer);
    }

    setF1(pointer, element) {
        this.curve.F2.toRprLE(this.memory, pointer, element);
        this.instance.f1m_toMontgomery(pointer, pointer);
    }

    setF2(pointer, element) {
        this.curve.F1.toRprLE(this.memory, pointer, element);
        this.instance.f2m_toMontgomery(pointer, pointer);
    }

    setFr(pointer, element) {
        this.curve.Fr.toRprLE(this.memory, pointer, element);
        this.instance.frm_toMontgomery(pointer, pointer);
    }

    getG1(pointer) {
        this.instance.g1m_fromMontgomery(pointer, this.pTmp1);
        return this.curve.G1.fromRprLE(this.memory, this.pTmp1);
    }

    getG2(pointer) {
        this.instance.g2m_fromMontgomery(pointer, this.pTmp1);
        return this.curve.G2.fromRprLE(this.memory, this.pTmp1);
    }

    getF1(pointer) {
        this.instance.f1m_fromMontgomery(pointer, this.pTmp1);
        return this.curve.F1.fromRprLE(this.memory, this.pTmp1);
    }

    getF2(pointer) {
        this.instance.f2m_fromMontgomery(pointer, this.pTmp1);
        return this.curve.F2.fromRprLE(this.memory, this.pTmp1);
    }

    getFt(pointer) {
        this.instance.frm_fromMontgomery(pointer, this.pTmp1);
        return this.curve.Frm.fromRprLE(this.memory, this.pTmp1);
    }

    allocBuff(buff) {
        const pointer = this.alloc(buff.byteLength);
        this.setBuffer(pointer, buff);
        return pointer;
    }

    getBuffer(pointer, length) {
        return new Uint8Array(this.u8.buffer, this.u8.byteOffset + pointer, length);
    }

    setBuffer(pointer, buffer) {
        this.u8.set(new Uint8Array(buffer), pointer);
    }

    alloc(length) {
        while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    terminate() {
        for (let i=0; i<this.workers.length; i++) {
            this.workers[i].postMessage({command: "TERMINATE"});
        }
    }


    async batchApplyKey(Gs, buff, first, inc) {
        const self = this;
        const G = self.curve[Gs];
        const Fr = self.curve.Fr;
        const sG = G.F.n8*2;
        const nPoints = Math.floor(buff.byteLength / sG);
        const pointsPerChunk = Math.floor(nPoints/self.concurrency);
        const opPromises = [];
        const bInc = new Uint8Array(Fr.n8);
        Fr.toRprLEM(bInc.buffer, 0, inc);
        let t = Fr.e(first);
        for (let i=0; i<self.concurrency; i++) {
            const n = Math.min(nPoints - i, pointsPerChunk);
            if (n==0) continue;
            const bFirst = new Uint8Array(Fr.n8);
            Fr.toRprLEM(bFirst.buffer, 0, t);

            opPromises.push(
                self.queueAction({
                    command: "BATCH_APPLY_KEY",
                    Gs: Gs,
                    buff: buff.slice(i*pointsPerChunk*sG, i*pointsPerChunk*sG + n*sG),
                    first: bFirst,
                    inc: bInc,
                    n: n
                })
            );
            t = Fr.mul(t, Fr.pow(inc, n));
        }

        const result = await Promise.all(opPromises);

        const outBuff = new Uint8Array(buff.byteLength);
        for (let i=0; i<self.concurrency; i++) {
            const n = Math.min(nPoints - i, pointsPerChunk);
            if (n==0) continue;
            outBuff.set(result[i], i*pointsPerChunk*sG);
        }

        return outBuff;
    }


    async batchConvert(Gs, fr, to, fullBuffIn) {
        const self = this;
        const G = self.curve[Gs];
        let sGin;
        if (["LEM", "U"].indexOf(fr)>=0) {
            sGin = G.F.n8*2;
        } else if (["C"].indexOf(fr)>=0) {
            sGin = G.F.n8;
        } else {
            throw new Error("Invaid convertion format: "+fr);
        }
        let sGout;
        if (["LEM", "U"].indexOf(fr)>=0) {
            sGout = G.F.n8*2;
        } else if (["C"].indexOf(fr)>=0) {
            sGout = G.F.n8;
        } else {
            throw new Error("Invaid convertion format: "+fr);
        }
        const nPoints = Math.floor(fullBuffIn.byteLength / sGin);
        const pointsPerChunk = Math.floor(nPoints/self.concurrency);
        const opPromises = [];
        for (let i=0; i<self.concurrency; i++) {
            const n = Math.min(nPoints - i, pointsPerChunk);
            if (n==0) continue;

            opPromises.push(
                self.queueAction({
                    command: "BATCH_CONVERT",
                    Gs: Gs,
                    fr: fr,
                    sGin: sGin,
                    sGout: sGout,
                    to: to,
                    buff: fullBuffIn.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin),
                    n: n
                })
            );
        }

        const result = await Promise.all(opPromises);

        const fullBuffOut = new Uint8Array(nPoints*sGout);
        for (let i=0; i<self.concurrency; i++) {
            const n = Math.min(nPoints - i, pointsPerChunk);
            if (n==0) continue;
            fullBuffOut.set(result[i], i*pointsPerChunk*sGout);
        }

        return fullBuffOut;
    }
}




module.exports = buildEngine;
