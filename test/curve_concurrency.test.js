import { assert } from "vitest";
import buildBn128 from "../src/bn128.js";
import buildThreadManager from "../src/threadman.js";
import * as bn128wasmPrebuilt from "../src/wasm/bn128_wasm.js";
import { base64ToUint8Array } from "../src/wasm/base64.js";

// Races reachable through the shared-curve-singleton pattern that
// groth16.verify (and every snarkjs entry point) relies on.

describe("curve singleton and termination concurrency", function () {

    // Pre-fix, two concurrent first builds each constructed a full curve +
    // worker pool and returned DIFFERENT objects (the loser's pool idled out
    // eventually, but identity assumptions and double resource usage stood).
    // This must run before anything else in this file builds bn128.
    it("concurrent first builds share one curve object", async () => {
        const [a, b, c] = await Promise.all([buildBn128(), buildBn128(), buildBn128()]);
        assert.strictEqual(a, b);
        assert.strictEqual(b, c);
        await a.terminate();
    });

    it("terminate() rejects a task in flight instead of hanging it", async () => {
        const wasm = {
            code: base64ToUint8Array(bn128wasmPrebuilt.code),
            pq: bn128wasmPrebuilt.pq, pr: bn128wasmPrebuilt.pr,
            pG1gen: bn128wasmPrebuilt.pG1gen, pG1zero: bn128wasmPrebuilt.pG1zero,
            pG2gen: bn128wasmPrebuilt.pG2gen, pG2zero: bn128wasmPrebuilt.pG2zero,
            pOneT: bn128wasmPrebuilt.pOneT, n8q: 32,
        };
        const tm = await buildThreadManager(wasm, false);
        // warm a worker so the task is dispatched (in flight), not queued
        await tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }]);
        const inFlight = tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }]);
        const guard = new Promise((res) => setTimeout(() => res("HUNG"), 5000));
        await tm.terminate();
        const outcome = await Promise.race([
            inFlight.then(() => "resolved", (e) => e.message),
            guard,
        ]);
        // Either the worker managed to answer before dying (resolved) or the
        // deferred was rejected by terminate() -- but never a hang.
        assert.notStrictEqual(outcome, "HUNG");
        if (outcome !== "resolved") {
            assert.match(outcome, /terminated while a task was in flight/);
        }
    });

    it("terminate() rejects queued (undispatched) tasks", async () => {
        const wasm = {
            code: base64ToUint8Array(bn128wasmPrebuilt.code),
            pq: bn128wasmPrebuilt.pq, pr: bn128wasmPrebuilt.pr,
            pG1gen: bn128wasmPrebuilt.pG1gen, pG1zero: bn128wasmPrebuilt.pG1zero,
            pG2gen: bn128wasmPrebuilt.pG2gen, pG2zero: bn128wasmPrebuilt.pG2zero,
            pOneT: bn128wasmPrebuilt.pOneT, n8q: 32,
        };
        const tm = await buildThreadManager(wasm, false);
        await tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }]); // one live worker
        // saturate every slot, then queue more than can be dispatched
        const tasks = [];
        for (let i = 0; i < tm.concurrency + 4; i++) {
            tasks.push(tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }]));
        }
        await tm.terminate();
        const results = await Promise.race([
            Promise.allSettled(tasks),
            new Promise((res) => setTimeout(() => res("HUNG"), 5000)),
        ]);
        assert.notStrictEqual(results, "HUNG");
        for (const r of results) {
            if (r.status === "rejected") {
                assert.match(r.reason.message, /terminated/);
            }
        }
    });
});
