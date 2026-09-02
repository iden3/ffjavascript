import buildThreadManager from "../src/threadman.js";
import * as bn128wasmPrebuilt from "../src/wasm/bn128_wasm.js";
import { base64ToUint8Array } from "../src/wasm/base64.js";

// Regression for the idle-request / task-dispatch crossing race.
//
// A worker's idle timer posts "want_to_terminate" while a task dispatch to
// the same slot is already in flight the other way. The main-thread handler
// tore the slot down unconditionally -- including a hard worker.terminate()
// (added for Bun's lingering-thread problem) -- killing the worker with the
// crossed task aboard. The task's deferred then never settled: observed in
// the wild as a bls12381 chunked-multiexp test timing out after 600s on a
// slow CI runner, where inter-chunk dispatch gaps exceeded the 1500ms idle
// timeout mid-multiexp.
//
// The test shrinks the idle timeout to 25ms and dispatches trivial tasks
// timed to straddle it, so the crossing happens within a few hundred
// iterations; every task is raced against a 5s guard so a regression fails
// fast instead of hanging the suite.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe("threadman idle-termination vs dispatch race", function () {
    it("a task dispatched as the worker asks to idle out always settles", async () => {
        const wasm = {
            code: base64ToUint8Array(bn128wasmPrebuilt.code),
            pq: bn128wasmPrebuilt.pq, pr: bn128wasmPrebuilt.pq,
            pG1gen: bn128wasmPrebuilt.pG1gen, pG1zero: bn128wasmPrebuilt.pG1zero,
            pG2gen: bn128wasmPrebuilt.pG2gen, pG2zero: bn128wasmPrebuilt.pG2zero,
            pOneT: bn128wasmPrebuilt.pOneT, n8q: 32,
        };
        const IDLE_MS = 25;
        const tm = await buildThreadManager(wasm, false, { terminationTimeout: IDLE_MS });
        try {
            const task = () => [{ cmd: "ALLOC", var: 0, len: 32 }];
            // warm one worker up
            await tm.queueAction(task());
            for (let i = 0; i < 300; i++) {
                // straddle the idle timer: sometimes just before it fires,
                // sometimes exactly as its message crosses our dispatch
                await sleep(IDLE_MS - 3 + (i % 7));
                await Promise.race([
                    tm.queueAction(task()),
                    sleep(5000).then(() => {
                        throw new Error(`iteration ${i}: task deferred never settled ` +
                            "(want_to_terminate raced the dispatch and the worker was torn down with the task aboard)");
                    }),
                ]);
            }
        } finally {
            await tm.terminate();
        }
    }, 120000);
});
