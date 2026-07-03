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

    const MAX_CHUNK_SIZE = 1 << 22;
    const MIN_CHUNK_SIZE = 1 << 12;

    // Byte size of one input point: affine = 2 coordinates, jacobian = 3.
    function pointSize(inType) {
        return inType === "affine" ? G.F.n8*2 : G.F.n8*3;
    }

    // Batch-affine "auto" threshold: use the batch module when a chunk's bases
    // fit comfortably in a per-worker share of the last-level cache. Measured
    // (20 cores, bn128): clear win up to ~1-2 MiB of bases per chunk (+10% on a
    // full 2^16 prove), parity but extra scratch memory at ~6 MiB chunks --
    // under full worker concurrency the fill phase is bandwidth-bound, so the
    // fewer-multiplications advantage only materializes while the random-access
    // set stays cache-resident.
    const AUTO_BATCH_MAX_BASES_BYTES = 1 << 21;

    // Resolve the batching mode: "auto" (default) | "enabled" | "disabled".
    // Accepts booleans as aliases. FF_NO_BATCH=1 force-disables globally
    // (benchmark escape hatch).
    function batchModeOf(options) {
        if (typeof process !== "undefined" && process.env && process.env.FF_NO_BATCH) return "disabled";
        const m = options ? options.batch : undefined;
        if (m === true || m === "enabled") return "enabled";
        if (m === false || m === "disabled") return "disabled";
        return "auto";
    }

    // options.gls === false disables the G2 GLS endomorphism path (the batch
    // module then runs its generic bucket accumulation). Default on.
    function glsOf(options) {
        return !(options && options.gls === false);
    }

    // WASM export name for this group + input representation. Affine input
    // routes to the batch-affine MSM module ("...Batch") depending on the
    // batching mode; the worker falls back to the plain in-module variant
    // when the batch module is absent.
    function fnNameFor(inType, basesBytes, batchMode, glsOn) {
        const g = groupName === "G1" ? "g1m" : "g2m";
        if (inType !== "affine") return `${g}_multiexp`;
        const useBatch = batchMode === "enabled" ||
            (batchMode === "auto" && basesBytes <= AUTO_BATCH_MAX_BASES_BYTES);
        if (!useBatch) return `${g}_multiexpAffine`;
        const noGls = (groupName === "G2" && !glsOn) ? "NoGls" : "";
        return `${g}_multiexpAffineBatch${noGls}`;
    }

    // Points per chunk. nChunks is derived from the scalar bit-width and rounded up
    // to a multiple of the worker count for even load balancing (G2 points are
    // larger, so we halve the chunk / double the count). Clamped to a sane range.
    function chunkSizeFor(nPoints, sScalar) {
        const bitChunkSize = pTSizes[log2(nPoints)];
        let nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) + 1;
        if (groupName === "G2") nChunks *= 2;
        nChunks = (Math.floor((nChunks-1) / tm.concurrency) + 1) * tm.concurrency;
        let chunkSize = Math.floor(nPoints / nChunks) + 1;
        if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
        return chunkSize;
    }

    // Run the multiexp of one chunk on a worker; returns the partial point.
    async function _multiExpChunk(buffBases, buffScalars, inType, batchMode, glsOn, logText) {
        if (!(buffBases instanceof Uint8Array)) throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
        if (!(buffScalars instanceof Uint8Array)) throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
        const sGIn = pointSize(inType);
        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        if (nPoints === 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if (sScalar * nPoints !== buffScalars.byteLength) throw new Error(`${logText} Scalar size does not match`);

        const task = [
            {cmd: "ALLOCSET", var: 0, buff: buffBases},
            {cmd: "ALLOCSET", var: 1, buff: buffScalars},
            {cmd: "ALLOC",    var: 2, len: G.F.n8*3},
            {cmd: "CALL", fnName: fnNameFor(inType, buffBases.byteLength, batchMode, glsOn), params: [
                {var: 0}, {var: 1}, {val: sScalar}, {val: nPoints}, {var: 2}
            ]},
            {cmd: "GET", out: 0, var: 2, len: G.F.n8*3},
        ];
        // transfer the chunk buffers to the worker (zero-copy); one GET -> one point
        const out = await tm.queueAction(task, [buffBases.buffer, buffScalars.buffer]);
        return out[0];
    }

    // Shared driver. `getChunk(byteOffset, byteLength)` supplies each bases chunk --
    // a synchronous slice of an in-memory buffer, or an async sub-range read. At most
    // `maxInFlight` chunks are sourced at once (Infinity = dispatch them all). The
    // point set is partitioned across chunks, so the full multiexp is the sum of the
    // per-chunk multiexps.
    async function _multiExpDispatch(getChunk, buffScalars, nPoints, sGIn, sScalar, inType, maxInFlight, batchMode, glsOn, logger, logText) {
        if (nPoints === 0) return G.zero;
        const chunkSize = chunkSizeFor(nPoints, sScalar);
        const inFlight = new Set();
        const partials = [];

        for (let off = 0; off < nPoints; off += chunkSize) {
            const n = Math.min(nPoints - off, chunkSize);
            const at = off;
            // Backpressure: block until a slot frees (Promise.race also surfaces a
            // failed chunk promptly). With maxInFlight = Infinity this never blocks.
            while (inFlight.size >= maxInFlight) await Promise.race(inFlight);
            if (logger) logger.debug(`Multiexp start: ${logText}: ${at}/${nPoints}`);
            const op = (async () => {
                const basesChunk = await getChunk(at*sGIn, n*sGIn);
                const scalarsChunk = buffScalars.slice(at*sScalar, (at+n)*sScalar);
                const r = await _multiExpChunk(basesChunk, scalarsChunk, inType, batchMode, glsOn, logText);
                if (logger) logger.debug(`Multiexp end: ${logText}: ${at}/${nPoints}`);
                return r;
            })();
            // settle-either-way cleanup so a rejected chunk can't wedge the set
            const slot = op.finally(() => inFlight.delete(slot));
            inFlight.add(slot);
            partials.push(slot);
        }

        const result = await Promise.all(partials);
        let res = G.zero;
        for (let i = result.length-1; i >= 0; i--) res = G.add(res, result[i]);
        return res;
    }

    // Derive nPoints/sScalar and validate before dispatching.
    function geometry(totalBasesBytes, buffScalars, inType) {
        const sGIn = pointSize(inType);
        const nPoints = Math.floor(totalBasesBytes / sGIn);
        let sScalar = 0;
        if (nPoints > 0) {
            sScalar = Math.floor(buffScalars.byteLength / nPoints);
            if (sScalar * nPoints !== buffScalars.byteLength) throw new Error("Scalar size does not match");
        }
        return { sGIn, nPoints, sScalar };
    }

    // multiexp over an in-memory bases buffer (sliced per chunk, all dispatched at once).
    async function _multiExp(buffBases, buffScalars, inType, batchMode, glsOn, logger, logText) {
        const { sGIn, nPoints, sScalar } = geometry(buffBases.byteLength, buffScalars, inType);
        const getChunk = (off, len) => buffBases.slice(off, off + len);
        return _multiExpDispatch(getChunk, buffScalars, nPoints, sGIn, sScalar, inType, Infinity, batchMode, glsOn, logger, logText);
    }

    G.multiExp = async function multiExp(buffBases, buffScalars, logger, logText) {
        return _multiExp(buffBases, buffScalars, "jacobian", "disabled", true, logger, logText);
    };
    // options.batch: "auto" (default) | "enabled" | "disabled" -- see batchModeOf.
    // options.gls: false disables the G2 endomorphism path.
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText, options) {
        return _multiExp(buffBases, buffScalars, "affine", batchModeOf(options), glsOf(options), logger, logText);
    };

    // Streaming affine multiexp: bases are produced chunk-by-chunk by `basesReader`
    // (e.g. a direct sub-range file read) instead of being read whole and sliced --
    // no main-thread slice copy, and the full section never sits in RAM (reads are
    // bounded to a few in-flight chunks). Result is identical to multiExpAffine.
    G.multiExpAffineChunked = async function multiExpAffineChunked(basesReader, totalBasesBytes, buffScalars, logger, logText, options) {
        if (typeof basesReader !== "function") {
            throw new Error(`${logText || "multiExpAffineChunked"}: basesReader must be a function (byteOffset, byteLength) => Promise<Uint8Array>`);
        }
        const { sGIn, nPoints, sScalar } = geometry(totalBasesBytes, buffScalars, "affine");
        return _multiExpDispatch(basesReader, buffScalars, nPoints, sGIn, sScalar, "affine", tm.concurrency + 2, batchModeOf(options), glsOf(options), logger, logText);
    };
}
