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
const FFT = require("./fft");
const {log2, buffReverseBits} = require("./utils");

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


const pTSizes = [
    1 ,  1,  1,  1,    2,  3,  4,  5,
    6 ,  7,  7,  8,    9, 10, 11, 12,
    13, 13, 14, 15,   16, 16, 17, 17,
    17, 17, 17, 17,   17, 17, 17, 17
];


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
        await engine.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: wasm.code
        }]);
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
        engine.concurrency = concurrency;

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
            initPromises.push(engine.postAction(i, [{
                cmd: "INIT",
                init: MEM_SIZE,
                code: copyCode
            }], [copyCode]));
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
            this.workers[i].postMessage([{cmd: "TERMINATE"}]);
        }
    }


    async batchApplyKey(groupName, buff, first, inc, inType, outType) {
        inType = inType || "affine";
        outType = outType || "affine";
        const self = this;
        const G = self.curve[groupName];
        const Fr = self.curve.Fr;
        let fnName, fnAffine;
        let sGin, sGmid, sGout;
        if (groupName == "G1") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g1m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g1m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g1m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "G2") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g2m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g2m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g2m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "Fr") {
            fnName = "frm_batchApplyKey";
            sGin = G.n8;
            sGmid = G.n8;
            sGout = G.n8;
        } else {
            throw new Error("Invalid group: " + groupName);
        }
        const nPoints = Math.floor(buff.byteLength / sGin);
        const pointsPerChunk = Math.floor(nPoints/self.concurrency);
        const opPromises = [];
        const bInc = new Uint8Array(Fr.n8);
        Fr.toRprLEM(bInc, 0, inc);
        let t = Fr.e(first);
        for (let i=0; i<self.concurrency; i++) {
            let n;
            if (i< self.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;
            const bFirst = new Uint8Array(Fr.n8);
            Fr.toRprLEM(bFirst, 0, t);

            const task = [];

            task.push({
                cmd: "ALLOCSET",
                var: 0,
                buff: buff.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin)
            });
            task.push({cmd: "ALLOCSET", var: 1, buff: bFirst});
            task.push({cmd: "ALLOCSET", var: 2, buff: bInc});
            task.push({cmd: "ALLOC", var: 3, len: n*Math.max(sGmid, sGout)});
            task.push({
                cmd: "CALL",
                fnName: fnName,
                params: [
                    {var: 0},
                    {val: n},
                    {var: 1},
                    {var: 2},
                    {var:3}
                ]
            });
            if (fnAffine) {
                task.push({
                    cmd: "CALL",
                    fnName: fnAffine,
                    params: [
                        {var: 3},
                        {val: n},
                        {var: 3},
                    ]
                });
            }
            task.push({cmd: "GET", out: 0, var: 3, len: n*sGout});

            opPromises.push(self.queueAction(task));
            t = Fr.mul(t, Fr.pow(inc, n));
        }

        const result = await Promise.all(opPromises);

        const outBuff = new Uint8Array(nPoints*sGout);
        let p=0;
        for (let i=0; i<result.length; i++) {
            outBuff.set(result[i][0], p);
            p += result[i][0].byteLength;
        }

        return outBuff;
    }

    array2bufferG(Gs, arr) {
        const self = this;
        const G = self.curve[Gs];
        const sG = G.F.n8*2;

        const buff = new Uint8Array(sG*arr.length);

        for (let i=0; i<arr.length; i++) {
            G.toRprLEM(buff, i*sG, arr[i]);
        }

        return buff;
    }

    buffer2arrayG(Gs, buff) {
        const self = this;
        const G = self.curve[Gs];
        const sG = G.F.n8*2;

        const n= buff.length / sG;
        const arr = new Array(n);
        for (let i=0; i<n; i++) {
            const P = G.fromRprLEM(buff, i*sG);
            arr[i] = P;
        }
        return arr;
    }


    async fft(groupName, buff, inverse, inType, outType, log) {
        inType = inType || "affine";
        outType = outType || "affine";
        const self = this;
        const MAX_BITS_THREAD = 12;
        const G = self.curve[groupName];
        const Fr = self.curve.Fr;
        const PFr = new FFT(G, self.curve.Fr, G.mulScalar.bind(G));

        let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnName, fnFFTMix, fnFFTJoin, fnFFTFinal;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnName = "g1m_ifft";
                fnFFTFinal = "g1m_fftFinal";
            } else {
                fnName = "g1m_fft";
            }
            fnFFTJoin = "g1m_fftJoin";
            fnFFTMix = "g1m_fftMix";

            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g1m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }

        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnName = "g2m_ifft";
                fnFFTFinal = "g2m_fftFinal";
            } else {
                fnName = "g2m_fft";
            }
            fnFFTJoin = "g2m_fftJoin";
            fnFFTMix = "g2m_fftMix";
            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g2m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = G.n8;
            sMid = G.n8;
            sOut = G.n8;
            if (inverse) {
                fnName = "frm_ifft";
                fnFFTFinal = "frm_fftFinal";
            } else {
                fnName = "frm_fft";
            }
            fnFFTMix = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        }



        let returnArray = false;
        if (Array.isArray(buff)) {
            buff = self.array2bufferG(groupName, buff);
            returnArray = true;
        }

        const nPoints = buff.byteLength / sIn;
        const bits = log2(nPoints);

        assert( (1 << bits) == nPoints, "fft must be multiple of 2" );

        let bInv;
        if (inverse) {
            bInv = new Uint8Array(Fr.n8);
            Fr.toRprLEM(bInv, 0, Fr.inv(Fr.e(nPoints)));
        }



        let buffOut;
        if (nPoints <= (1 << MAX_BITS_THREAD)) {
            const task = [];
            task.push({cmd: "ALLOC", var: 0, len: sMid*nPoints});
            task.push({cmd: "SET", var: 0, buff: buff});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: nPoints}, {var: 0}]});
            }
            task.push({cmd: "CALL", fnName:fnName, params: [{var:0}, {val: nPoints}]});
            if (fnMid2Out) {
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: nPoints}, {var: 0}]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: sOut*nPoints});

            const res = await self.queueAction(task);
            buffOut = res[0];
        } else {

            buffReverseBits(buff, sIn);

            let chunks;
            const pointsInChunk = 1 << MAX_BITS_THREAD;
            const chunkSize = pointsInChunk * sIn;
            const nChunks = nPoints / pointsInChunk;

            const promises = [];
            for (let i = 0; i< nChunks; i++) {
                const task = [];
                task.push({cmd: "ALLOC", var: 0, len: sMid*pointsInChunk});
                const buffChunk = buff.slice( (pointsInChunk * i)*sIn, (pointsInChunk * (i+1))*sIn);
                task.push({cmd: "SET", var: 0, buff: buffChunk});
                if (fnIn2Mid) {
                    task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                }
                for (let j=1; j<=MAX_BITS_THREAD;j++) {
                    task.push({cmd: "CALL", fnName:fnFFTMix, params: [{var:0}, {val: pointsInChunk}, {val: j}]});
                }
                task.push({cmd: "GET", out:0, var: 0, len: sMid*pointsInChunk});
                promises.push(self.queueAction(task).then( (r) => {
                    if (log) log(`fft: ${i}/${nChunks}`);
                    return r;
                }));
            }

            chunks = await Promise.all(promises);
            for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

            for (let i = MAX_BITS_THREAD+1;   i<=bits; i++) {
                if (log) log(`${i}/${bits}`);
                const nGroups = 1 << (bits - i);
                const nChunksPerGroup = nChunks / nGroups;
                const opPromises = [];
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const bFirst = new Uint8Array(Fr.n8);
                        Fr.toRprLEM(bFirst, 0, Fr.pow( PFr.w[i], k*pointsInChunk));
                        const bInc = new Uint8Array(Fr.n8);
                        Fr.toRprLEM(bInc, 0, PFr.w[i]);
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                        const task = [];
                        task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                        task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                        task.push({cmd: "ALLOCSET", var: 2, buff: bFirst});
                        task.push({cmd: "ALLOCSET", var: 3, buff: bInc});
                        task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                            {var: 0},
                            {var: 1},
                            {val: pointsInChunk},
                            {var: 2},
                            {var: 3}
                        ]});
                        if (i==bits) {
                            if (fnFFTFinal) {
                                task.push({cmd: "ALLOCSET", var: 4, buff: bInv});
                                task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                    {var: 0},
                                    {val: pointsInChunk},
                                    {var: 4},
                                ]});
                                task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                    {var: 1},
                                    {val: pointsInChunk},
                                    {var: 4},
                                ]});
                            }
                            if (fnMid2Out) {
                                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: pointsInChunk}, {var: 1}]});
                            }
                            task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
                            task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sOut});
                        } else {
                            task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sMid});
                            task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sMid});
                        }
                        opPromises.push(self.queueAction(task));
                    }
                }

                const res = await Promise.all(opPromises);
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                        const resChunk = res.shift();
                        chunks[o1] = resChunk[0];
                        chunks[o2] = resChunk[1];
                    }
                }
            }

            buffOut = new Uint8Array(nPoints * sOut);
            if (inverse) {
                buffOut.set(chunks[0].slice((pointsInChunk-1)*sOut));
                let p= sOut;
                for (let i=nChunks-1; i>0; i--) {
                    buffOut.set(chunks[i], p);
                    p += chunkSize;
                    delete chunks[i];  // Liberate mem
                }
                buffOut.set(chunks[0].slice(0, (pointsInChunk-1)*sOut), p);
                delete chunks[nChunks-1];
            } else {
                for (let i=0; i<nChunks; i++) {
                    buffOut.set(chunks[i], pointsInChunk*sOut*i);
                    delete chunks[i];
                }
                return buffOut;
            }
        }

        if (returnArray) {
            const arr = self.buffer2arrayG(groupName, buffOut);
            return arr;
        } else {
            return buffOut;
        }
    }

    async multiExp(groupName, buffBases, buffScalars, inType) {
        inType = inType || "affine";
        const self = this;
        const G = self.curve[groupName];
        let sGIn;
        let fnName;
        if (groupName == "G1") {
            if (inType == "affine") {
                fnName = "g1m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g1m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                fnName = "g2m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g2m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        }
        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        assert( sScalar * nPoints == buffScalars.byteLength, "Scalar size does not match");

        const bitChunkSize = pTSizes[log2(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [
                {cmd: "ALLOCSET", var: 0, buff: buffBases},
                {cmd: "ALLOCSET", var: 1, buff: buffScalars},
                {cmd: "ALLOC", var: 2, len: G.F.n8*3},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: sScalar},
                    {val: nPoints},
                    {val: i*bitChunkSize},
                    {val: Math.min(sScalar*8 - i*bitChunkSize, bitChunkSize)},
                    {var: 2}
                ]},
                {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
            ];
            opPromises.push(
                self.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            if (!G.isZero(res)) {
                for (let j=0; j<bitChunkSize; j++) res = G.double(res);
            }
            const P = G.fromRprLEJM(result[i][0], 0);
            res = G.add(res, P);
        }

        return res;
    }

/*
    async multiExpAffine(groupName, buffBases, buffScalars) {
        const self = this;
        const G = self.curve[groupName];
        const sBase = G.F.n8*2;
        const nPoints = Math.floor(buffBases.byteLength / sBase);
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        assert( nPoints * sBase === buffBases.byteLength);
        assert( nPoints * sScalar === buffScalars.byteLength);
        const pointsPerChunk = Math.floor(nPoints/self.concurrency);
        const opPromises = [];
        let fnName;
        if (groupName == "G1") {
            fnName = "g1m_multiexpAffine";
        } else if (groupName == "G2") {
            fnName = "g2m_multiexpAffine";
        }
        for (let i=0; i<self.concurrency; i++) {
            let n;
            if (i< self.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const buffBasesChunk = buffBases.slice(i*pointsPerChunk*sBase, i*pointsPerChunk*sBase + n*sBase);
            const buffScalarsChunk = buffScalars.slice(i*pointsPerChunk*sScalar, i*pointsPerChunk*sScalar + n*sScalar);
            const task = [
                {cmd: "ALLOCSET", var: 0, buff: buffBasesChunk},
                {cmd: "ALLOCSET", var: 1, buff: buffScalarsChunk},
                {cmd: "ALLOC", var: 2, len: G.F.n8*3},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: sScalar},
                    {val: n},
                    {var: 2}
                ]},
                {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
            ];
            opPromises.push(
                self.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=0; i<result.length; i++) {
            const P = G.fromRprLEJM(result[i][0], 0);
            res = G.add(res, P);
        }

        return res;
    }
*/

    async batchConvert(fnName, buffIn, sIn, sOut) {
        const self = this;
        const nPoints = Math.floor(buffIn.byteLength / sIn);
        assert( nPoints * sIn === buffIn.byteLength);
        const pointsPerChunk = Math.floor(nPoints/self.concurrency);
        const opPromises = [];
        for (let i=0; i<self.concurrency; i++) {
            let n;
            if (i< self.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const buffChunk = buffIn.slice(i*pointsPerChunk*sIn, i*pointsPerChunk*sIn + n*sIn);
            const task = [
                {cmd: "ALLOCSET", var: 0, buff:buffChunk},
                {cmd: "ALLOC", var: 1, len:sOut * n},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: n},
                    {var: 1}
                ]},
                {cmd: "GET", out: 0, var: 1, len:sOut * n},
            ];
            opPromises.push(
                self.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        const fullBuffOut = new Uint8Array(nPoints*sOut);
        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    }

    async pairingEq() {
        const self = this;
        const buffCt = new Uint8Array(self.curve.Gt.n8);
        let nEqs;
        if ((arguments.length % 2) == 1) {
            self.curve.Gt.toRprLEM(buffCt, 0, arguments[arguments.length-1]);
            nEqs = (arguments.length -1) /2;
        } else {
            self.curve.Gt.toRprLEM(buffCt, 0, self.curve.Gt.one);
            nEqs = arguments.length /2;
        }

        const opPromises = [];
        for (let i=0; i<nEqs; i++) {

            const task = [];

            const g1Buff = new Uint8Array(self.curve.G1.F.n8*3);
            self.curve.G1.toRprLEJM(g1Buff, 0, arguments[i*2]);
            task.push({cmd: "ALLOCSET", var: 0, buff: g1Buff});
            task.push({cmd: "ALLOC", var: 1, len: self.curve.PrePSize});

            const g2Buff = new Uint8Array(self.curve.G2.F.n8*3);
            self.curve.G2.toRprLEJM(g2Buff, 0, arguments[i*2+1]);
            task.push({cmd: "ALLOCSET", var: 2, buff: g2Buff});
            task.push({cmd: "ALLOC", var: 3, len: self.curve.PreQSize});

            task.push({cmd: "ALLOC", var: 4, len: self.curve.Gt.n8});

            task.push({cmd: "CALL", fnName: self.curve.name + "_prepareG1", params: [
                {var: 0},
                {var: 1}
            ]});

            task.push({cmd: "CALL", fnName: self.curve.name + "_prepareG2", params: [
                {var: 2},
                {var: 3}
            ]});

            task.push({cmd: "CALL", fnName: self.curve.name + "_millerLoop", params: [
                {var: 1},
                {var: 3},
                {var: 4}
            ]});

            task.push({cmd: "GET", out: 0, var: 4, len: self.curve.Gt.n8});

            opPromises.push(
                self.queueAction(task)
            );

        }


        const result = await Promise.all(opPromises);

        const oldAlloc = self.u32[0];
        const pRes = self.alloc(self.curve.Gt.n8);
        self.instance.exports.ftm_one(pRes);

        for (let i=0; i<result.length; i++) {
            const pMR = self.allocBuff(result[i][0]);
            self.instance.exports.ftm_mul(pRes, pMR, pRes);
        }
        self.instance.exports[self.curve.name + "_finalExponentiation"](pRes, pRes);

        const pCt = self.allocBuff(buffCt);

        const r = !!self.instance.exports.ftm_eq(pRes, pCt);

        self.u32[0] = oldAlloc;

        return r;
    }


    async fftMix(groupName, buff) {
        const self = this;
        const G = self.curve[groupName];
        const Fr = self.curve.Fr;
        const PFr = self.curve.PFr;
        const sG = G.F.n8*3;
        let fnName, fnFFTJoin;
        if (groupName == "G1") {
            fnName = "g1m_fftMix";
            fnFFTJoin = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftMix";
            fnFFTJoin = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        } else {
            assert(false);
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        const power = log2(nPoints);

        let nChunks = 1 << log2(self.concurrency);

        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;

        const powerChunk = log2(pointsPerChunk);

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            for (let j=1; j<=powerChunk; j++) {
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: pointsPerChunk},
                    {val: j}
                ]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            opPromises.push(
                self.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        const chunks = [];
        for (let i=0; i<result.length; i++) chunks[i] = result[i][0];


        for (let i = powerChunk+1; i<=power; i++) {
            const nGroups = 1 << (power - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const bFirst = new Uint8Array(Fr.n8);
                    Fr.toRprLEM(bFirst, 0, Fr.pow( PFr.w[i], k*pointsPerChunk));
                    const bInc = new Uint8Array(Fr.n8);
                    Fr.toRprLEM(bInc, 0, PFr.w[i]);
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: bFirst});
                    task.push({cmd: "ALLOCSET", var: 3, buff: bInc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsPerChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                    task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                    opPromises.push(self.queueAction(task));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }


        const fullBuffOut = new Uint8Array(nPoints*sG);
        let p =0;
        for (let i=0; i<nChunks; i++) {
            fullBuffOut.set(chunks[i], p);
            p+=chunks[i].byteLength;
        }

        return fullBuffOut;
    }

    async fftJoin(groupName, buff1, buff2, first, inc) {
        const self = this;
        const G = self.curve[groupName];
        const Fr = self.curve.Fr;
        const sG = G.F.n8*3;
        let fnName;
        if (groupName == "G1") {
            fnName = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftJoin";
        } else {
            assert(false);
        }

        assert (buff1.byteLength == buff2.byteLength);
        const nPoints = Math.floor(buff1.byteLength / sG);
        assert (nPoints == 1 << log2(nPoints));

        let nChunks = 1 << log2(self.concurrency);
        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;

        const bInc = new Uint8Array(self.curve.Fr.n8);
        self.curve.Fr.toRprLEM(bInc, 0, inc);

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];
            const bFirstChunk = new Uint8Array(self.curve.Fr.n8);
            Fr.toRprLEM(bFirstChunk, 0, Fr.mul(first, Fr.pow(inc, i*pointsPerChunk)));
            const b1 = buff1.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            const b2 = buff2.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b1});
            task.push({cmd: "ALLOCSET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: bFirstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: bInc});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: pointsPerChunk},
                {var: 2},
                {var: 3}
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
            opPromises.push(
                self.queueAction(task)
            );

        }


        const result = await Promise.all(opPromises);

        const fullBuffOut1 = new Uint8Array(nPoints*sG);
        const fullBuffOut2 = new Uint8Array(nPoints*sG);
        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    }

    async fftFinal(groupName, buff, factor) {
        const self = this;
        const G = self.curve[groupName];
        const sG = G.F.n8*3;
        const sGout = G.F.n8*2;
        let fnName, fnToAffine;
        if (groupName == "G1") {
            fnName = "g1m_fftFinal";
            fnToAffine = "g1m_batchToAffine";
        } else if (groupName == "G2") {
            fnName = "g2m_fftFinal";
            fnToAffine = "g2m_batchToAffine";
        } else {
            assert(false);
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        assert (nPoints == 1 << log2(nPoints));

        const pointsPerChunk = Math.floor(nPoints / self.concurrency);

        const bFactor = new Uint8Array(self.curve.Fr.n8);
        self.curve.Fr.toRprLEM(bFactor, 0, factor);

        const opPromises = [];
        for (let i=0; i<self.concurrency; i++) {
            let n;
            if (i< self.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, (i*pointsPerChunk+n)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            task.push({cmd: "ALLOCSET", var: 1, buff: bFactor});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {val: n},
                {var: 1},
            ]});
            task.push({cmd: "CALL", fnName: fnToAffine, params: [
                {var: 0},
                {val: n},
                {var: 0},
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: n*sGout});
            opPromises.push(
                self.queueAction(task)
            );

        }

        const result = await Promise.all(opPromises);

        const fullBuffOut = new Uint8Array(nPoints*sGout);
        let p =0;
        for (let i=result.length-1; i>=0; i--) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    }

}




module.exports = buildEngine;
