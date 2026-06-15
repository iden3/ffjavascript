/**
 * Worker task logic used by workerpool.
 *
 * This module exports a plain function that encapsulates all wasm helper
 * utilities (alloc, runTask, init).  The function can be:
 *   1. Called directly in single-thread mode (returns the runTask function).
 *   2. Stringified and embedded into a workerpool worker script for
 *      multi-thread mode (browser or Node.js).
 *
 * The exported function accepts no arguments when used as factory and returns
 * the runTask function, which can then be registered with workerpool.worker().
 */
export default function thread() {
    const MAXMEM = 32767;
    let instance;
    let memory;

    // Lazily cached typed-array views over wasm memory.
    // Invalidated automatically when memory.grow() replaces memory.buffer.
    let _u32 = null;
    let _u8  = null;

    function getU32() {
        if (_u32 === null || _u32.buffer !== memory.buffer) {
            _u32 = new Uint32Array(memory.buffer, 0, 1);
        }
        return _u32;
    }

    function getU8() {
        if (_u8 === null || _u8.buffer !== memory.buffer) {
            _u8 = new Uint8Array(memory.buffer);
        }
        return _u8;
    }

    async function init(data) {
        let wasmModule;
        if (data.code instanceof WebAssembly.Module) {
            wasmModule = data.code;
        } else {
            wasmModule = await WebAssembly.compile(new Uint8Array(data.code));
        }
        memory = new WebAssembly.Memory({initial: data.init, maximum: MAXMEM});
        // Reset cached views — new memory means new backing buffer.
        _u32 = null;
        _u8  = null;
        instance = await WebAssembly.instantiate(wasmModule, {env: {memory}});
    }

    function alloc(length) {
        const u32 = getU32();
        // Align to 4 bytes with a branchless bitmask instead of a loop.
        u32[0] = (u32[0] + 3) & ~3;
        const res = u32[0];
        u32[0] += length;
        if (u32[0] + length > memory.buffer.byteLength) {
            const currentPages = memory.buffer.byteLength / 0x10000;
            let requiredPages = Math.floor((u32[0] + length) / 0x10000) + 1;
            if (requiredPages > MAXMEM) requiredPages = MAXMEM;
            memory.grow(requiredPages - currentPages);
            // memory.buffer changed — cached views are now stale.
        }
        return res;
    }

    function allocBuffer(buffer) {
        const src = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        const p = alloc(src.byteLength);
        // getU8() handles re-creation if alloc() triggered a grow.
        getU8().set(src, p);
        return p;
    }

    function getBuffer(pointer, length) {
        return new Uint8Array(memory.buffer, pointer, length);
    }

    function setBuffer(pointer, buffer) {
        getU8().set(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer), pointer);
    }

    function runTask(task) {
        if (task[0].cmd === "INIT") {
            // INIT is the only async path — return a Promise so workerpool
            // can await it; all other tasks execute synchronously to prevent
            // concurrent execution of tasks within the same worker.
            return init(task[0]);
        }
        const vars = [];
        const out  = [];
        const oldAlloc = getU32()[0];
        for (let i = 0; i < task.length; i++) {
            const step = task[i];
            switch (step.cmd) {
            case "ALLOCSET":
                vars[step.var] = allocBuffer(step.buff);
                break;
            case "ALLOC":
                vars[step.var] = alloc(step.len);
                break;
            case "SET":
                setBuffer(vars[step.var], step.buff);
                break;
            case "CALL": {
                const paramDefs = step.params;
                const params = new Array(paramDefs.length);
                for (let j = 0; j < paramDefs.length; j++) {
                    const p = paramDefs[j];
                    params[j] = p.var !== undefined
                        ? vars[p.var] + (p.offset || 0)
                        : p.val;
                }
                instance.exports[step.fnName](...params);
                break;
            }
            case "GET":
                out[step.out] = getBuffer(vars[step.var], step.len).slice();
                break;
            default:
                throw new Error("Invalid cmd: " + step.cmd);
            }
        }
        // Reclaim task-local allocations. getU32() handles a post-grow buffer.
        getU32()[0] = oldAlloc;
        return out;
    }

    return runTask;
}
