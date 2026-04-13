console.log("node cjs");
const require_threadman_thread = require("./threadman_thread.cjs");
let workerpool = require("workerpool");
workerpool = require_threadman_thread.__toESM(workerpool, 1);
//#region src/threadman_worker.js
/**
* Standalone worker entry-point for Node.js (worker_threads).
*
* This file is compiled by rollup into build/threadman_worker.cjs and loaded
* by workerpool when running in Node.js multi-thread mode.
*
* workerpool detects that it is inside a worker_threads worker via parentPort
* and calls worker.register() to expose the methods to the pool.
*/
var runTaskFn = require_threadman_thread.thread();
workerpool.default.worker({ runTask(task) {
	const result = runTaskFn(task);
	if (result instanceof Promise) return result;
	if (result.length === 0) return result;
	return new workerpool.default.Transfer(result, result.map((b) => b.buffer));
} });
//#endregion
