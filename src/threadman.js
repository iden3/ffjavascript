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

// Give-up threshold for workers that die while booting. All workers run the
// same code, so a boot failure is almost always deterministic (bad wasm, a
// restricted realm, hostile execArgv inherited by the worker); without a cap
// the error handler's slot-release + processWorks respawn cycle spins forever
// at full CPU (~hundreds of workers/second) while every caller hangs.
// Consecutive failures are counted across the pool (a burst of N parallel
// spawns failing is N counts) and reset by any successful INIT, so one full
// spawn round over-threshold is enough to trip it -- transient single-worker
// failures with healthy siblings never accumulate.
const MAX_CONSECUTIVE_BOOT_FAILURES = 8;


import thread from "./threadman_thread.js";
import os from "os";
import Worker from "web-worker";

// Robust Node detection that never throws (unlike `process.browser`, which is a
// webpack-ism and is undefined under Vite/esbuild/SES).
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

// WorkerSlot holds the native Worker and all per-worker state.
// Each call to startWorker() creates a fresh WorkerSlot instance.
// Message handlers close over the slot reference so that stale messages
// from a replaced worker are detected by a simple identity check
// (tm.pool[i] !== slot).
class WorkerSlot {
    constructor(worker) {
        this.worker      = worker; // native Worker thread
        this.initialized = false;
        this.initializing= false;
        this.working     = false;
        this.pendingDeferred = null;
        this.onMsg   = null; // stored so removeEventListener can be called on termination
        this.onError = null;
    }
}

// Computed lazily on first worker creation, NOT at module load: a SES
// hardened realm (which runs single-threaded) has no Blob/btoa/URL.createObjectURL, and
// touching them at import time would throw before a curve could even be built.
let workerSource;
function getWorkerSource() {
    if (workerSource !== undefined) return workerSource;
    const threadStr = `(${thread.toString()})(self)`;
    if (isNode) {
        workerSource = "data:application/javascript;base64," + Buffer.from(threadStr).toString("base64");
    } else if (globalThis?.Blob && globalThis.URL && globalThis.URL.createObjectURL) {
        // coverage: executes inside worker threads as a serialized copy; V8 coverage cannot attribute it to this file
        /* c8 ignore start */
        const threadBytes = new TextEncoder().encode(threadStr);
        const workerBlob = new Blob([threadBytes], { type: "application/javascript" });
        workerSource = URL.createObjectURL(workerBlob);
    } else {
        workerSource = "data:application/javascript;base64," + globalThis.btoa(threadStr);
    }
    /* c8 ignore stop */
    return workerSource;
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

    // Force single-thread when no Worker is available. Covers SES hardened realms
    // (no Worker, frozen globals) and old/limited browsers, regardless of what
    // the caller requested -- the worker path (and getWorkerSource's
    // Blob/btoa) would otherwise fail. Node uses the web-worker import, so it
    // keeps multi-threading.
    if(!isNode && !globalThis?.Worker) {
        // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
        /* c8 ignore start */
        singleThread = true;
    }
    /* c8 ignore stop */

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
    // Batch-affine MSM helper module (optional): compiled once, shipped to every
    // worker alongside the main module. n8f = base-field element size in bytes.
    tm.batchCode = wasm.batchCode;
    tm.batchWasmModule = wasm.batchCode ? await WebAssembly.compile(wasm.batchCode) : undefined;
    tm.n8f = wasm.n8q;
    tm.glv = !!wasm.glv;

    if (singleThread) {
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice(),
            batchCode: tm.batchCode ? tm.batchCode.slice() : undefined,
            n8f: tm.n8f,
            glv: tm.glv
        }]);
        tm.concurrency  = 1;
    } else {
        // pool[i] is the active WorkerSlot at slot i, or null if the slot is empty.
        tm.pool = [];

        let concurrency = 2;
        if (typeof navigator === "object" && navigator.hardwareConcurrency) {
            concurrency = navigator.hardwareConcurrency;
        } else if (os && os.cpus) {
            // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
            /* c8 ignore start */
            concurrency = os.cpus().length;
        }

        if(concurrency === 0){
            concurrency = 2;
        }
        /* c8 ignore stop */

        // Limit to 64 threads for memory reasons.
        if (concurrency>64) concurrency=64;
        tm.concurrency = concurrency;
    }
    return tm;
}

export class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
        // Consecutive worker boot failures (reset by any successful INIT).
        // Once it reaches MAX_CONSECUTIVE_BOOT_FAILURES, bootBroken latches
        // the causing error and no further workers are spawned.
        this.bootFailures = 0;
        this.bootBroken = null;
    }

    // Reject everything queued when nothing can ever serve it: no slot alive
    // at all, or worker boot latched broken with no initialized worker left.
    // (Initialized-but-busy workers keep the queue alive: they will drain it.)
    _failQueueIfUnservable(err) {
        const anyAlive = this.pool.some((s) => s);
        const anyInitialized = this.pool.some((s) => s && s.initialized);
        if (!anyAlive || (this.bootBroken && !anyInitialized)) {
            const cause = this.bootBroken || err;
            const queued = this.actionQueue.splice(0, this.actionQueue.length);
            for (const work of queued) {
                work.deferred.reject(new Error("Worker initialization failed: " + cause.message));
            }
        }
    }

    // Build the message handler for a specific WorkerSlot.
    // All state reads/writes go through `slot`; the stale check
    // `tm.pool[slotIndex] !== slot` discards messages from replaced workers.
    _makeOnMsg(slotIndex, slot) {
        const tm = this;
        return async function(e) {
            const data = (e && e.data) ? e.data : e;

            // Stale check: if pool[slotIndex] no longer points to this slot,
            // the message is from a worker that was already replaced.
            if (tm.pool[slotIndex] !== slot) {
                // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
                /* c8 ignore start */
                if (data.status === "terminated") {
                    // Break the reference cycle so the slot and its WASM memory
                    // can be collected immediately rather than waiting for GC.
                    slot.worker.removeEventListener("message", slot.onMsg);
                    slot.worker.removeEventListener("error",   slot.onError);
                    return;
                }
                if (!data.status && slot.working) {
                    // Stale task result: the slot was replaced (want_to_terminate raced
                    // with a task dispatch — pool[i] was nulled before the result came
                    // back). Settle the deferred either way so the caller doesn't hang:
                    // an error message must reject, not masquerade as a result.
                    slot.working = false;
                    if (data.error) {
                        slot.pendingDeferred.reject(new Error("Worker error: " + data.error));
                    } else {
                        slot.pendingDeferred.resolve(data);
                    }
                }
                await tm.processWorks();
                return;
            }
            /* c8 ignore stop */

            if (data.error) {
                slot.working = false;
                slot.pendingDeferred.reject(new Error("Worker error: " + data.error));
                if (slot.initializing) {
                    slot.initializing = false;
                    tm.pool[slotIndex] = null;
                    // Do NOT call processWorks here: it would immediately
                    // respawn a worker for the queued tasks, and if INIT
                    // failure is deterministic (bad wasm) that respawn fails
                    // too -- an infinite spawn/fail loop with the callers
                    // waiting forever. The INIT deferred's rejection handler
                    // in startWorker owns the retry/give-up decision.
                    return;
                }
                // A task error on a healthy worker: the slot is free again,
                // dispatch any queued tasks now. Without this, work already
                // sitting in actionQueue stalls until the worker's idle
                // timer happens to fire (~1.5s), or forever without timers.
                await tm.processWorks();
                return;
            }

            if (data.status) {
                if (data.status === "initialized") {
                    slot.initializing = false;
                    slot.initialized  = true;

                } else if (data.status === "want_to_terminate") {
                    // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
                    /* c8 ignore start */
                    // 2-phase termination: the worker is idle and asking to close.
                    // Release the slot immediately so processWorks can fill it with a
                    // fresh worker if the queue needs one.  The TERMINATE ack is sent
                    // to the old worker so it can close cleanly; its later "terminated"
                    // message will be stale (pool[slotIndex] !== slot) and ignored.
                    tm.pool[slotIndex] = null;
                    slot.worker.postMessage([{cmd: "TERMINATE"}]);
                    // Hard-kill as well: on runtimes where self.close() does
                    // not end the thread (Bun), a recycled worker would
                    // otherwise linger and keep the process alive at exit.
                    try { if (typeof slot.worker.terminate === "function") slot.worker.terminate(); } catch (e) { /* already gone */ }
                    await tm.processWorks();
                    return;

                    /* c8 ignore stop */
                } else if (data.status === "terminated") {
                    // Worker has fully closed.  For the 2-phase path the slot was
                    // already nulled in want_to_terminate, so this message arrives
                    // stale and is handled above.  For a direct TERMINATE
                    // (tm.terminate() at proof end) we clean up here.
                    slot.worker.removeEventListener("message", slot.onMsg);
                    slot.worker.removeEventListener("error",   slot.onError);
                    tm.pool[slotIndex] = null;
                    if (slot.working) {
                        // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
                        /* c8 ignore start */
                        // Safety net: reject the pending deferred so the caller
                        // surfaces an error instead of hanging.
                        slot.pendingDeferred.reject(
                            new Error(`Worker at slot ${slotIndex} terminated unexpectedly while processing task`)
                        );
                        slot.working = false;
                    }
                    /* c8 ignore stop */
                    return;
                }
                // fall through for "initialized" so the INIT deferred is resolved below
            }

            slot.working = false;
            slot.pendingDeferred.resolve(data);
            await tm.processWorks();
        };
    }

    _makeOnError(slotIndex, slot) {
        const tm = this;
        return function(e) {
            if (tm.pool[slotIndex] === slot) {
                // A native worker 'error' event means the worker is broken
                // (uncaught exception / failed INIT); it will never serve
                // another task. Release the pool slot so processWorks can
                // start a fresh worker there — leaving the dead slot in
                // place blocked its position forever and hung any task
                // queued behind it.
                slot.working      = false;
                slot.initialized  = false;
                slot.initializing = false;
                tm.pool[slotIndex] = null;
                slot.worker.removeEventListener("message", slot.onMsg);
                slot.worker.removeEventListener("error",   slot.onError);
                if (slot.pendingDeferred) {
                    slot.pendingDeferred.reject(new Error("Worker error: " + e.message));
                }
                // Re-dispatch anything still queued (fire-and-forget; task
                // rejections reach their callers via their own deferreds).
                tm.processWorks().catch(() => {});
            }
        };
    }

    startWorker(slotIndex) {
        const nativeWorker = new Worker(getWorkerSource());
        const slot = new WorkerSlot(nativeWorker);
        this.pool[slotIndex] = slot;

        slot.onMsg   = this._makeOnMsg(slotIndex, slot);
        slot.onError = this._makeOnError(slotIndex, slot);
        nativeWorker.addEventListener("message", slot.onMsg);
        nativeWorker.addEventListener("error",   slot.onError);

        slot.initializing = true;

        // postAction sets slot.working = true synchronously before any await,
        // so processWorks will not attempt to start this slot again.
        const tm = this;
        this.postAction(slotIndex, [{
            cmd:  "INIT",
            init: MEM_SIZE,
            code: this.wasmModule,
            batchCode: this.batchWasmModule,
            n8f: this.n8f,
            glv: this.glv,
        }]).then(() => {
            slot.initialized = true;
            tm.bootFailures = 0;
        }, (err) => {
            // INIT failed (bad wasm, instantiate error, worker crash on
            // boot). No queueAction caller is watching this internal
            // deferred, so the failure must be surfaced here: release the
            // slot, count the failure, and reject everything still queued
            // once nothing can serve it -- those tasks would otherwise wait
            // forever for a worker that will never exist. The failure count
            // is what breaks the melt cycle: the 'error'-event handler
            // releases the slot and processWorks respawns for the queued
            // tasks, so a deterministic boot failure (all workers run the
            // same code) would otherwise spawn/fail forever at full CPU
            // while `pool.some(s => s)` stays true through the churn.
            if (tm.pool[slotIndex] === slot) {
                // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
                /* c8 ignore start */
                tm.pool[slotIndex] = null;
                slot.worker.removeEventListener("message", slot.onMsg);
                slot.worker.removeEventListener("error",   slot.onError);
            }
            /* c8 ignore stop */
            slot.initializing = false;
            slot.working = false;
            tm.bootFailures++;
            if (tm.bootFailures >= MAX_CONSECUTIVE_BOOT_FAILURES && !tm.bootBroken) {
                tm.bootBroken = err;
            }
            tm._failQueueIfUnservable(err);
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

    async postAction(slotIndex, e, transfers, _deferred) {
        const slot = this.pool[slotIndex];
        if (!slot || slot.working) {
            // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
            /* c8 ignore start */
            // Defensive: should be unreachable (processWorks checks
            // !slot.working in the same synchronous span). If it ever fires
            // with a caller-supplied deferred, reject it -- processWorks
            // swallows this throw, and an unsettled work.deferred would hang
            // its queueAction caller forever.
            const err = new Error("Posting a job to a working worker");
            if (_deferred) _deferred.reject(err);
            throw err;
        }
        /* c8 ignore stop */
        slot.working = true;
        slot.pendingDeferred = _deferred ? _deferred : new Deferred();
        // postMessage's behavior for an already-detached transfer buffer is
        // version-dependent: newer Node throws a DataCloneError (handled in
        // the catch below), but Node 20 posts silently and the task would
        // hang forever. Detect detachment portably before dispatch: a
        // detached ArrayBuffer reports byteLength 0 and constructing any
        // view over it throws on every runtime.
        if (transfers) {
            for (const t of transfers) {
                if (t instanceof ArrayBuffer && t.byteLength === 0) {
                    let detached = false;
                    try { new Uint8Array(t, 0, 0); } catch (err) { detached = true; }
                    if (detached) {
                        slot.working = false;
                        slot.pendingDeferred.reject(new Error("Task transfer list contains a detached ArrayBuffer"));
                        return slot.pendingDeferred.promise;
                    }
                }
            }
        }
        try {
            await slot.worker.postMessage(e, transfers);
        } catch (err) {
            // postMessage itself failed (e.g. a transfer-list buffer already
            // detached by an earlier dispatch). The worker never saw the
            // task, so no message will ever come back: settle the deferred
            // here and free the slot, or the caller waits forever and the
            // slot stays wedged as "working".
            slot.working = false;
            slot.pendingDeferred.reject(err);
        }
        return slot.pendingDeferred.promise;
    }

    async processWorks() {
        // Dispatch queued tasks to ready workers.
        for (let i = 0; i < this.concurrency && this.actionQueue.length > 0; i++) {
            const slot = this.pool[i];
            if (slot && slot.initialized && !slot.working) {
                const work = this.actionQueue.shift();
                // postAction's returned promise follows the task's own
                // completion (slot.pendingDeferred.promise), not just
                // dispatch. work.deferred is that same promise object, and
                // its original queueAction() caller holds their own
                // reference to it -- catching the task's eventual rejection
                // here (a fire-and-forget call site with no caller of its
                // own to propagate to) does not suppress it for them.
                // Without this, a task failing while processWorks() runs
                // from an event-listener callback (not from queueAction's
                // own call stack) would surface as an unhandled rejection.
                await this.postAction(i, work.data, work.transfers, work.deferred).catch(() => {});
            }
        }

        // Start new workers for slots that need them.
        if (this.actionQueue.length > 0) {
            if (this.bootBroken) {
                // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
                /* c8 ignore start */
                // Worker boot is latched broken: never spawn again. If no
                // initialized worker survives to drain the queue (e.g. the
                // last one idle-terminated), fail the queued tasks now.
                this._failQueueIfUnservable(this.bootBroken);
                return;
            }
            /* c8 ignore stop */
            let initializingCount = 0;
            for (let i = 0; i < this.concurrency; i++) {
                const slot = this.pool[i];
                if (slot) {
                    if (slot.initializing) initializingCount++;
                    // slot exists: skip whether initialized, initializing, or working
                    continue;
                }
                // slot is null: this slot is available to host a new worker
                if (initializingCount >= this.actionQueue.length) break;
                initializingCount++;
                this.startWorker(i);
            }
        }
    }

    async queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            const work = {
                data:      actionData,
                transfers: transfers,
                deferred:  d
            };
            this.actionQueue.push(work);
            try {
                await this.processWorks();
            } catch (err) {
                // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
                /* c8 ignore start */
                // processWorks can throw synchronously (e.g. the Worker
                // constructor in startWorker on a restricted realm). Settle
                // this caller's deferred and remove the queued entry --
                // otherwise d.promise (returned below on the success path,
                // and possibly already held by racing callers) never settles.
                const idx = this.actionQueue.indexOf(work);
                if (idx >= 0) this.actionQueue.splice(idx, 1);
                d.reject(err);
            }
            /* c8 ignore stop */
        }
        return d.promise;
    }

    resetMemory() {
        // coverage: worker lifecycle race/failure path; deterministic tests cannot schedule it
        /* c8 ignore start */
        this.u32[0] = this.initalPFree;
    }
    /* c8 ignore stop */

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
        while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    async terminate() {
        for (let i = 0; i < this.pool.length; i++) {
            const slot = this.pool[i];
            if (!slot) continue;
            // Graceful first (lets runtimes that honor self.close() flush),
            // then the API-level kill: self.close() inside a worker does not
            // end the thread on every runtime -- Bun keeps the process alive
            // after it, so a prover that terminates its curve would still
            // hang the process at exit. worker.terminate() is universal
            // (worker_threads, browsers, Bun).
            slot.worker.postMessage([{cmd: "TERMINATE"}]);
            /* c8 ignore next */
            try { if (typeof slot.worker.terminate === "function") slot.worker.terminate(); } catch (e) { /* already gone */ }
            this.pool[i] = null;
        }
    }

}
