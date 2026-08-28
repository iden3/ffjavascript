import { assert } from "vitest";
import buildThreadManager from "../src/threadman.js";
import buildBn128 from "../src/bn128.js";
import * as bn128wasmPrebuilt from "../src/wasm/bn128_wasm.js";
import { base64ToUint8Array } from "../src/wasm/base64.js";

// Memory-retention checks on the worker lifecycle. Each idle-churn cycle
// spawns a worker (own wasm Memory), lets it idle out (want_to_terminate ->
// hard terminate) and replaces the slot -- if slots/listeners/wasm memories
// were retained, RSS would climb by ~1.6MB (MEM_SIZE pages) per cycle.
// Assertions are trend-based with generous slack: they catch unbounded
// growth, not allocator noise.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rssMB = () => process.memoryUsage().rss / 1048576;

describe("threadman memory retention", function () {
    it("worker idle churn does not accumulate slots/memories", async () => {
        const wasm = {
            code: base64ToUint8Array(bn128wasmPrebuilt.code),
            pq: bn128wasmPrebuilt.pq, pr: bn128wasmPrebuilt.pq,
            pG1gen: bn128wasmPrebuilt.pG1gen, pG1zero: bn128wasmPrebuilt.pG1zero,
            pG2gen: bn128wasmPrebuilt.pG2gen, pG2zero: bn128wasmPrebuilt.pG2zero,
            pOneT: bn128wasmPrebuilt.pOneT, n8q: 32,
        };
        const tm = await buildThreadManager(wasm, false, { terminationTimeout: 20 });
        try {
            const cycle = async () => {
                await tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }]);
                await sleep(45); // let the worker idle out and die
            };
            for (let i = 0; i < 30; i++) await cycle(); // warmup
            if (globalThis.gc) globalThis.gc();
            const base = rssMB();
            for (let i = 0; i < 150; i++) await cycle();
            if (globalThis.gc) globalThis.gc();
            await sleep(200);
            const grown = rssMB() - base;
            // 150 churn cycles x 1.6MB wasm memory each = 240MB if retained
            assert(grown < 60, `RSS grew ${grown.toFixed(1)}MB over 150 worker churn cycles`);
        } finally {
            await tm.terminate();
        }
    }, 120000);

    it("repeated G2 multiexps on one curve do not accumulate", async () => {
        const curve = await buildBn128(true); // fresh, uncached instance path
        try {
            const G = curve.G2, Fr = curve.Fr;
            const N = 1 << 8;
            const sG = G.F.n8 * 2;
            const scalars = new Uint8Array(N * Fr.n8);
            const bases = new Uint8Array(N * sG);
            for (let i = 0; i < N; i++) {
                const num = Fr.e(i + 1);
                scalars.set(Fr.fromMontgomery(num), i * Fr.n8);
                bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
            }
            for (let i = 0; i < 5; i++) await G.multiExpAffine(bases, scalars); // warmup
            if (globalThis.gc) globalThis.gc();
            const base = rssMB();
            for (let i = 0; i < 60; i++) await G.multiExpAffine(bases, scalars);
            if (globalThis.gc) globalThis.gc();
            await sleep(100);
            const grown = rssMB() - base;
            assert(grown < 40, `RSS grew ${grown.toFixed(1)}MB over 60 G2 multiexps`);
        } finally {
            await curve.terminate();
        }
    }, 120000);
});
