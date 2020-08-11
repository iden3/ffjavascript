import {log2, buffReverseBits} from "./utils.js";

export default function buildFFT(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = G.tm;
    async function _fft(buff, inverse, inType, outType, logger) {

        inType = inType || "affine";
        outType = outType || "affine";
        const MAX_BITS_THREAD = 12;

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
            buff = curve.array2buffer(buff, sIn);
            returnArray = true;
        }

        const nPoints = buff.byteLength / sIn;
        const bits = log2(nPoints);

        if  ((1 << bits) != nPoints) {
            throw new Error("fft must be multiple of 2" );
        }

        let inv;
        if (inverse) {
            inv = Fr.inv(Fr.e(nPoints));
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

            const res = await tm.queueAction(task);
            buffOut = res[0];
        } else {

            buffReverseBits(buff, sIn);

            let chunks;
            const pointsInChunk = 1 << MAX_BITS_THREAD;
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
                promises.push(tm.queueAction(task).then( (r) => {
                    if (logger) logger.debug(`fft: ${i}/${nChunks}`);
                    return r;
                }));
            }

            chunks = await Promise.all(promises);
            for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

            for (let i = MAX_BITS_THREAD+1;   i<=bits; i++) {
                if (logger) logger.debug(`fft join ${i}/${bits}`);
                const nGroups = 1 << (bits - i);
                const nChunksPerGroup = nChunks / nGroups;
                const opPromises = [];
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const first = Fr.exp( Fr.w[i], k*pointsInChunk);
                        const inc = Fr.w[i];
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                        const task = [];
                        task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                        task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                        task.push({cmd: "ALLOCSET", var: 2, buff: first});
                        task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                        task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                            {var: 0},
                            {var: 1},
                            {val: pointsInChunk},
                            {var: 2},
                            {var: 3}
                        ]});
                        if (i==bits) {
                            if (fnFFTFinal) {
                                task.push({cmd: "ALLOCSET", var: 4, buff: inv});
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
                        opPromises.push(tm.queueAction(task));
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
                    p += pointsInChunk*sOut;
                    delete chunks[i];  // Liberate mem
                }
                buffOut.set(chunks[0].slice(0, (pointsInChunk-1)*sOut), p);
                delete chunks[0];
            } else {
                for (let i=0; i<nChunks; i++) {
                    buffOut.set(chunks[i], pointsInChunk*sOut*i);
                    delete chunks[i];
                }
            }
        }

        if (returnArray) {
            return curve.buffer2array(buffOut, sOut);
        } else {
            return buffOut;
        }
    }

    G.fft = async function(buff, inType, outType, logger) {
        return await _fft(buff, false, inType, outType, logger);
    };

    G.ifft = async function(buff, inType, outType, logger) {
        return await _fft(buff, true, inType, outType, logger);
    };

    G.fftMix = async function fftMix(buff) {
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
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        const power = log2(nPoints);

        let nChunks = 1 << log2(tm.concurrency);

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
                tm.queueAction(task)
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
                    const first = Fr.exp( Fr.w[i], k*pointsPerChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsPerChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                    task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                    opPromises.push(tm.queueAction(task));
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
    };

    G.fftJoin = async function fftJoin(buff1, buff2, first, inc) {
        const sG = G.F.n8*3;
        let fnName;
        if (groupName == "G1") {
            fnName = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sG);
        if (nPoints != 1 << log2(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let nChunks = 1 << log2(tm.concurrency);
        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;


        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];

            const firstChunk = Fr.mul(first, Fr.exp(inc, i*pointsPerChunk));
            const b1 = buff1.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            const b2 = buff2.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b1});
            task.push({cmd: "ALLOCSET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
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
                tm.queueAction(task)
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
    };

    G.fftFinal =  async function fftFinal(buff, factor) {
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
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        if (nPoints != 1 << log2(nPoints)) {
            throw new Error("Invalid number of points");
        }

        const pointsPerChunk = Math.floor(nPoints / tm.concurrency);

        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, (i*pointsPerChunk+n)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            task.push({cmd: "ALLOCSET", var: 1, buff: factor});
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
                tm.queueAction(task)
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
    };
}
