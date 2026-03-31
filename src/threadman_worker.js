/**
 * Standalone worker entry-point for Node.js (worker_threads).
 *
 * This file is compiled by rollup into build/threadman_worker.cjs and loaded
 * by workerpool when running in Node.js multi-thread mode.
 *
 * workerpool detects that it is inside a worker_threads worker via parentPort
 * and calls worker.register() to expose the methods to the pool.
 */
import workerpool from "workerpool";
import thread from "./threadman_thread.js";

const runTaskFn = thread();

workerpool.worker({
    runTask(task) {
        const result = runTaskFn(task);
        // INIT path: runTaskFn returns a Promise — let workerpool await it.
        if (result instanceof Promise) return result;
        // Non-INIT path: transfer output Uint8Arrays zero-copy to the main thread.
        if (result.length === 0) return result;
        return new workerpool.Transfer(result, result.map(b => b.buffer));
    }
});
