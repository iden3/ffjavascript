
export default function thread(self) {
    const MAXMEM = 32767;
    let instance;
    let memory;
    let batchFns = null;   // batch-affine MSM entry points (per-group wrappers)
    let terminationTimeout = 1500; // milliseconds
    let terminationTimer;

    // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
    /* c8 ignore start */
    if (self) {
        self.onmessage = function(e) {
            let data;
            if (e.data) {
                data = e.data;
            } else {
                data = e;
            }

            try {
                if (data[0].cmd === "INIT") {
                    init(data[0]).then(function() {
                        self.postMessage({status: "initialized"});
                        // Start idle timer only after init completes so it never
                        // fires during async WASM compilation.
                        scheduleTermination();
                    }, function(err) {
                        // init is async, so the surrounding try/catch cannot
                        // see its failure. Without this handler an INIT error
                        // (bad wasm, instantiate failure) died as an unhandled
                        // rejection inside the worker and the main thread
                        // waited forever for an "initialized" that never came.
                        self.postMessage({error: err.message});
                    });
                    return; // skip the scheduleTermination() call at the bottom
                } else if (data[0].cmd === "TERMINATE") {
                    terminate();
                } else {
                    let terminateAfterTask = false;
                    if (data[data.length-1].cmd === "TERMINATE") {
                        terminateAfterTask = true;
                        data.pop();
                    }
                    const res = runTask(data);
                    let transfers = [];
                    for (let i=0; i<res.length; i++) {
                        if (res[i] instanceof Uint8Array) {
                            transfers.push(res[i].buffer);
                        }
                    }
                    self.postMessage(res, transfers);
                    if (terminateAfterTask) {
                        terminate();
                    }
                }
            } catch (err) {
                // Catch any error and send it back to main thread
                self.postMessage({error: err.message});
            }
            scheduleTermination();
        };
    }
    /* c8 ignore stop */

    async function init(data) {
        let wasmModule;
        if (data.code instanceof WebAssembly.Module) {
            // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
            /* c8 ignore start */
            wasmModule = data.code;
            /* c8 ignore stop */
        } else {
            const code = new Uint8Array(data.code);
            wasmModule = await WebAssembly.compile(code);
        }
        memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});

        instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            }
        });

        // Optional batch-affine MSM helper module. It is curve-independent:
        // it imports the base-field/group ops from the main instance and works
        // on the same memory, so one binary serves G1 (f1m/g1m) and, over the
        // quadratic extension, G2 (f2m/g2m). Instantiated once per group.
        if (data.batchCode) {
            let batchModule;
            if (data.batchCode instanceof WebAssembly.Module) {
                // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
                /* c8 ignore start */
                batchModule = data.batchCode;
                /* c8 ignore stop */
            } else {
                batchModule = await WebAssembly.compile(new Uint8Array(data.batchCode));
            }
            const ex = instance.exports;
            const mkBatch = async (f, g, conj) => (await WebAssembly.instantiate(batchModule, {
                env: { "memory": memory },
                curve: {
                    f_mul: ex[f + "_mul"], f_square: ex[f + "_square"], f_add: ex[f + "_add"],
                    f_sub: ex[f + "_sub"], f_neg: ex[f + "_neg"], f_inverse: ex[f + "_inverse"],
                    f_isZero: ex[f + "_isZero"], f_conj: ex[conj],
                    g_add: ex[g + "_add"], g_addMixed: ex[g + "_addMixed"],
                    g_double: ex[g + "_double"], g_zero: ex[g + "_zero"], g_isZero: ex[g + "_isZero"],
                },
            })).exports;
            const n8f = data.n8f;
            batchFns = {};
            if (ex.f1m_mul && ex.g1m_addMixed) {
                // f_conj is only used by the G2 GLS path; wire a harmless copy for G1
                const b = await mkBatch("f1m", "g1m", "f1m_copy");
                // GLV path (bn254 G1 endomorphism) when the curve advertises it;
                // the wasm falls back internally for unexpected sizes.
                const useGlv = data.glv && b.multiexpAffineGLV;
                const fn = useGlv ? b.multiexpAffineGLV : b.multiexpAffine;
                batchFns["g1m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => fn(pB, pS, sS, n, pr, n8f);
                // NoGlv variant, selectable per call ({glv: "disabled"} option)
                batchFns["g1m_multiexpAffineBatchNoGlv"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f);
            }
            if (ex.f2m_mul && ex.g2m_addMixed) {
                const b = await mkBatch("f2m", "g2m", "f2m_conjugate");
                // GLS (bn254 G2 endomorphism) when the curve advertises it; the
                // wasm gates internally on chunk size and falls back to batch.
                // The NoGls variant is selectable per call ({gls:false} option).
                const useGls = data.glv && b.multiexpAffineGLS;
                const fn2 = useGls ? b.multiexpAffineGLS : b.multiexpAffine;
                batchFns["g2m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => fn2(pB, pS, sS, n, pr, n8f * 2);
                batchFns["g2m_multiexpAffineBatchNoGls"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f * 2);
            }
        }

        if (data.terminationTimeout) {
            // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
            /* c8 ignore start */
            terminationTimeout = data.terminationTimeout;
        }
        /* c8 ignore stop */
    }



    // Reverse the low `bits` of a 32-bit integer (O(1) bit-twiddle).
    function rev32(x) {
        x = ((x & 0x55555555) << 1) | ((x >>> 1) & 0x55555555);
        x = ((x & 0x33333333) << 2) | ((x >>> 2) & 0x33333333);
        x = ((x & 0x0f0f0f0f) << 4) | ((x >>> 4) & 0x0f0f0f0f);
        x = ((x & 0x00ff00ff) << 8) | ((x >>> 8) & 0x00ff00ff);
        x = (x << 16) | (x >>> 16);
        return x >>> 0;
    }

    // In-place bit-reversal permutation of fixed-size (sIn-byte) elements.
    // Works for any element size, like the old pure-JS buffReverseBits. When
    // the elements are 4-byte aligned it swaps Uint32Array lanes (no BigInt
    // boxing, no allocation); otherwise it falls back to a byte-wise swap with
    // a single reused temp buffer. Either way it touches no WASM linear memory.
    function reverseInPlace(u8, sIn, bits) {
        const n = u8.byteLength / sIn;
        const shift = 32 - bits;
        if (((sIn & 3) === 0) && ((u8.byteOffset & 3) === 0)) {
            const lanes = sIn >>> 2;
            const u32 = new Uint32Array(u8.buffer, u8.byteOffset, u8.byteLength >>> 2);
            for (let i = 0; i < n; i++) {
                const ri = rev32(i) >>> shift;
                if (i < ri) {
                    let a = i * lanes;
                    let b = ri * lanes;
                    for (let l = 0; l < lanes; l++) {
                        const t = u32[a + l];
                        u32[a + l] = u32[b + l];
                        u32[b + l] = t;
                    }
                }
            }
        } else {
            // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
            /* c8 ignore start */
            const tmp = new Uint8Array(sIn);   // one reused temp, not one per swap
            for (let i = 0; i < n; i++) {
                const ri = rev32(i) >>> shift;
                if (i < ri) {
                    const ao = i * sIn;
                    const bo = ri * sIn;
                    tmp.set(u8.subarray(ao, ao + sIn));
                    u8.copyWithin(ao, bo, bo + sIn);
                    u8.set(tmp, bo);
                }
            }
        }
        /* c8 ignore stop */
    }

    function alloc(length) {
        const u32 = new Uint32Array(memory.buffer, 0, 1);
        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers
        const res = u32[0];
        u32[0] += length;
        if (u32[0] + length > memory.buffer.byteLength) {
            // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
            /* c8 ignore start */
            const currentPages = memory.buffer.byteLength / 0x10000;
            let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;
            if (requiredPages>MAXMEM) requiredPages=MAXMEM;
            memory.grow(requiredPages-currentPages);
        }
        /* c8 ignore stop */
        return res;
    }

    function allocBuffer(buffer) {
        const p = alloc(buffer.byteLength);
        setBuffer(p, buffer);
        return p;
    }

    function getBuffer(pointer, length) {
        return new Uint8Array(memory.buffer, pointer, length);
    }

    function setBuffer(pointer, buffer) {
        const u8 = new Uint8Array(memory.buffer);
        u8.set(new Uint8Array(buffer), pointer);
    }

    function runTask(task) {
        clearTimeout(terminationTimer);
        if (task[0].cmd === "INIT") {
            return init(task[0]);
        }
        const ctx = {
            vars: [],
            out: []
        };
        const u32a = new Uint32Array(memory.buffer, 0, 1);
        const oldAlloc = u32a[0];
        for (let i=0; i<task.length; i++) {
            switch (task[i].cmd) {
            case "REVERSE": {
                // Reverse the transferred buffer in place and hand it straight
                // back. No SharedArrayBuffer and no WASM memory: the buffer is
                // transferred in and out (zero copy) and reversed where it lies.
                const t = task[i];
                reverseInPlace(t.src, t.sIn, t.bits);
                ctx.out[0] = t.src;
                break;
            }
            case "ALLOCSET":
                ctx.vars[task[i].var] = allocBuffer(task[i].buff);
                break;
            case "ALLOC":
                ctx.vars[task[i].var] = alloc(task[i].len);
                break;
            case "SET":
                setBuffer(ctx.vars[task[i].var], task[i].buff);
                break;
            case "CALL": {
                const params = [];
                for (let j=0; j<task[i].params.length; j++) {
                    const p = task[i].params[j];
                    if (typeof p.var !== "undefined") {
                        params.push(ctx.vars[p.var] + (p.offset || 0));
                    } else if (typeof p.val != "undefined") {
                        params.push(p.val);
                    }
                }
                {
                    const fname = task[i].fnName;
                    let fn = batchFns ? batchFns[fname] : undefined;
                    if (!fn) {
                        fn = instance.exports[fname];
                        // graceful fallback: "...Batch[NoGls|NoGlv]" -> plain
                        // in-module variant when the batch module is unavailable
                        // (same 5-arg signature)
                        if (!fn) {
                            // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
                            /* c8 ignore start */
                            const base = fname.replace(/Batch(NoGls|NoGlv)?$/, "");
                            fn = instance.exports[base];
                        }
                        /* c8 ignore stop */
                    }
                    fn(...params);
                }
                break;
            }
            case "GET":
                ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
                break;
            default:
                // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
                /* c8 ignore start */
                throw new Error("Invalid cmd");
                /* c8 ignore stop */
            }
        }
        const u32b = new Uint32Array(memory.buffer, 0, 1);
        u32b[0] = oldAlloc;

        return ctx.out;
    }

    function scheduleTermination() {
        // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
        /* c8 ignore start */
        clearTimeout(terminationTimer);
        if (terminationTimeout > 0) {
            terminationTimer = setTimeout(() => {
                // 2-phase termination: notify main thread first; close only after
                // it acks with TERMINATE. This prevents the race where the main
                // thread dispatches a task to a worker that has already closed.
                if (self) self.postMessage({status: "want_to_terminate"});
            }, terminationTimeout);
        }
    }

    function terminate() {
        clearTimeout(terminationTimer);
        if (self) {
            self.postMessage({status: "terminated"});
            self.close();
        }
    }
    /* c8 ignore stop */

    return runTask;
}
