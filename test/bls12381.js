import { assert } from "vitest";
import buildBls12381 from "../src/bls12381.js";


// Mirrors the multiexp-option coverage in test/bn128.js (multiExpAffine
// batching modes, GLV/GLS endomorphism options). bn128 already exercised
// these; bls12-381 only had indirect coverage via the SES lockdown harness
// (test/ses/lockdown.mjs), which builds single-threaded and only checks
// batch/no-endo/plain agreement at one size. This file adds the same
// per-option agreement checks bn128 has, multi-threaded, at the sizes used
// elsewhere in the suite.
//
// Note: per src/bls12381.js, the batch module's GLV path only carries
// bls12-381 G1 constants -- GLS (G2 4-dim decomposition) is bn254-only and
// the wasm falls through internally for bls G2 sizes. So the G2 "gls" test
// below still asserts agreement, but is confirming the fallthrough is a
// harmless no-op rather than exercising a distinct decomposition path.
describe("bls12381", async function () {

    let bls12381;
    beforeAll(async () => {
        bls12381 = await buildBls12381();
    });
    afterAll(async () => {
        bls12381.terminate();
    });

    async function checkChunkedMatches(G, Fr, N) {
        const sG = G.F.n8 * 2;
        const scalars = new Uint8Array(N * Fr.n8);
        const bases = new Uint8Array(N * sG);
        for (let i = 0; i < N; i++) {
            const num = Fr.e(i + 1);
            scalars.set(Fr.fromMontgomery(num), i * Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
        }
        const expected = await G.multiExpAffine(bases, scalars, null, "ref");
        const reader = async (off, len) => bases.slice(off, off + len);
        const got = await G.multiExpAffineChunked(reader, bases.byteLength, scalars, null, "chunked");
        assert(G.eq(expected, got));
    }

    it("multiExpAffineChunked (G1) matches multiExpAffine", async () => {
        await checkChunkedMatches(bls12381.G1, bls12381.Fr, 1 << 14);
    });

    it("multiExpAffineChunked (G2) matches multiExpAffine", async () => {
        await checkChunkedMatches(bls12381.G2, bls12381.Fr, 1 << 13);
    });

    it("multiexp batching modes (auto/enabled/disabled) agree", async () => {
        const G = bls12381.G1, Fr = bls12381.Fr;
        const N = 1 << 12;
        const sG = G.F.n8 * 2;
        const scalars = new Uint8Array(N * Fr.n8);
        const bases = new Uint8Array(N * sG);
        for (let i = 0; i < N; i++) {
            const num = Fr.e(i * 7 + 3);
            scalars.set(Fr.fromMontgomery(num), i * Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
        }
        const rAuto = await G.multiExpAffine(bases, scalars, null, "auto", { batch: "auto" });
        const rOn   = await G.multiExpAffine(bases, scalars, null, "on",   { batch: "enabled" });
        const rOff  = await G.multiExpAffine(bases, scalars, null, "off",  { batch: "disabled" });
        const rDef  = await G.multiExpAffine(bases, scalars, null, "def");
        assert(G.eq(rAuto, rOn));
        assert(G.eq(rAuto, rOff));
        assert(G.eq(rAuto, rDef));
    });

    it("G1 glv option (endomorphism auto/disabled) agrees", async () => {
        const G = bls12381.G1, Fr = bls12381.Fr;
        const N = 1 << 11;
        const sG = G.F.n8 * 2;
        const scalars = new Uint8Array(N * Fr.n8);
        const bases = new Uint8Array(N * sG);
        for (let i = 0; i < N; i++) {
            const num = Fr.e(i * 13 + 7);
            scalars.set(Fr.fromMontgomery(num), i * Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
        }
        const rAuto = await G.multiExpAffine(bases, scalars, null, "glv",   { batch: "enabled" });
        const rNo   = await G.multiExpAffine(bases, scalars, null, "noglv", { batch: "enabled", glv: "disabled" });
        assert(G.eq(rAuto, rNo));
    });

    it("G2 gls option (bn254-only path falls through cleanly for bls12-381)", async () => {
        const G = bls12381.G2, Fr = bls12381.Fr;
        const N = 1 << 10;
        const sG = G.F.n8 * 2;
        const scalars = new Uint8Array(N * Fr.n8);
        const bases = new Uint8Array(N * sG);
        for (let i = 0; i < N; i++) {
            const num = Fr.e(i * 11 + 5);
            scalars.set(Fr.fromMontgomery(num), i * Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
        }
        const rGls = await G.multiExpAffine(bases, scalars, null, "gls",   { batch: "enabled" });
        const rNo  = await G.multiExpAffine(bases, scalars, null, "nogls", { batch: "enabled", gls: "disabled" });
        const rOff = await G.multiExpAffine(bases, scalars, null, "plain", { batch: "disabled", gls: "disabled" });
        assert(G.eq(rGls, rNo));
        assert(G.eq(rGls, rOff));
    });
});
