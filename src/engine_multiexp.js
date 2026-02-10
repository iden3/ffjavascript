import { log2 } from "./utils.js";

const pTSizes = [
    1 ,  1,  1,  1,    2,  3,  4,  5,
    6 ,  7,  7,  8,    9, 10, 11, 12,
    13, 13, 14, 15,   16, 16, 17, 17,
    17, 17, 17, 17,   17, 17, 17, 17
];

export default function buildMultiexp(curve, groupName) {
    const G = curve[groupName];
    const tm = G.tm;

    async function _multiExpChunk(buffBases, buffScalars, inType, logger, logText) {
        if ( ! (buffBases instanceof Uint8Array) ) {
            if (logger) logger.error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
            throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
        }
        if ( ! (buffScalars instanceof Uint8Array) ) {
            if (logger) logger.error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
            throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
        }
        inType = inType || "affine";

        let sGIn;
        let fnName;
        if (groupName === "G1") {
            if (inType === "affine") {
                fnName = "g1m_multiexpAffine";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g1m_multiexp";
                sGIn = G.F.n8*3;
            }
        } else if (groupName === "G2") {
            if (inType === "affine") {
                fnName = "g2m_multiexpAffine";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g2m_multiexp";
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }
        const nPoints = Math.floor(buffBases.byteLength / sGIn);

        if (nPoints === 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints !== buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2(nPoints)];

        const opPromises = [];

        const task = [
            {cmd: "ALLOCSET", var: 0, buff: buffBases},
            {cmd: "ALLOCSET", var: 1, buff: buffScalars},
            {cmd: "ALLOC", var: 2, len: G.F.n8*3},
            {cmd: "CALL", fnName: fnName, params: [
                {var: 0}, //pBases
                {var: 1}, // pScalars
                {val: sScalar}, // scalarSize
                {val: nPoints}, // nPoints
                {var: 2} // pr
            ]},
            {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
        ];
        opPromises.push(
            // transfer ownership of the buffers to the worker thread
            G.tm.queueAction(task, [buffBases.buffer, buffScalars.buffer])
        );

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            if (!G.isZero(res)) {
                for (let j=0; j<bitChunkSize; j++) res = G.double(res);
            }
            res = G.add(res, result[i][0]);
        }

        return res;
    }

    async function _multiExp(buffBases, buffScalars, inType, logger, logText) {
        const MAX_CHUNK_SIZE = 1 << 22;
        const MIN_CHUNK_SIZE = 1 << 12;
        let sGIn;

        if (groupName === "G1") {
            if (inType === "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else if (groupName === "G2") {
            if (inType === "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        if (nPoints === 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints !== buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        let result = [];
        const opPromises = [];
        const bitChunkSize = pTSizes[log2(nPoints)];
        let nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        if (groupName === "G2") {
            // G2 has bigger points, so we reduce chunk size to optimize memory usage
            nChunks *= 2;
        }

        let chunkSize;
        //chunkSize = Math.floor(nPoints / tm.concurrency) + 1;

        console.log("nChunks_0", nChunks);

        // make nChunks multiple of tm.concurrency for optimal load balancing
        nChunks = (Math.floor((nChunks-1) / tm.concurrency) + 1) * tm.concurrency;
        chunkSize = Math.floor(nPoints / nChunks) + 1;

        if (chunkSize>MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize<MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;

        console.log("nChunks", nChunks);
        console.log("effective nChunks", nPoints / chunkSize);

        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`Multiexp start: ${logText}: ${i}/${nPoints}`);
            const n = Math.min(nPoints - i, chunkSize);

            const buffBasesChunk = buffBases.slice(i*sGIn, (i+n)*sGIn);
            const buffScalarsChunk = buffScalars.slice(i*sScalar, (i+n)*sScalar);

            opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType, logger, logText).then((r) => {
                if (logger) logger.debug(`Multiexp end: ${logText}: ${i}/${nPoints}`);
                return r;
            }));
        }

        result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            res = G.add(res, result[i]);
        }

        return res;
    }

    G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
    };
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return _multiExp(buffBases, buffScalars, "affine", logger, logText);
    };
}
