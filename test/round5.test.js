import * as chai from "chai";
import buildBn128 from "../src/bn128.js";
import * as Scalar from "../src/scalar.js";
import * as utils from "../src/utils.js";
import F1Field from "../src/f1field.js";
import ChaCha from "../src/chacha.js";
import { getCurveFromName, getCurveFromQ, getCurveFromR } from "../src/curves.js";
import { getRandomBytes } from "../src/random.js";
import nodeCrypto from "crypto";

const assert = chai.assert;

describe("wasm curve invalid-input guards and zero serialization", function () {
    this.timeout(120000);

    let curve, Fr, G1;
    before(async () => { curve = await buildBn128(); Fr = curve.Fr; G1 = curve.G1; });
    after(async () => { await curve.terminate(); });

    it("every unary/scalar op rejects a malformed point size", () => {
        const bad = new Uint8Array(7);
        for (const op of ["neg", "double", "isZero", "toAffine", "toJacobian", "x", "y"]) {
            assert.throws(() => G1[op](bad), /invalid point size/i, op);
        }
        assert.throws(() => G1.timesScalar(bad, Scalar.e(3)), /invalid point size/i);
        assert.throws(() => G1.timesFr(bad, Fr.e(3)), /invalid point size/i);
        assert.throws(() => G1.eq(G1.g, bad), /invalid point size/i);
        // toString of a jacobian point normalizes first
        assert(typeof G1.toString(G1.timesFr(G1.g, Fr.e(3))) === "string");
    });

    it("chunked fftMix/fftJoin/fftFinal paths engage above the per-chunk limit", async () => {
        // 256 jacobian points: nChunks = 2^log2(concurrency) > 1, so the
        // exported helpers take their multi-chunk task paths.
        const n = 256;
        const bits = 8;
        const sG = G1.F.n8 * 3;
        const rng = new ChaCha([2, 2, 2, 2, 2, 2, 2, 2]);

        const natural = new Uint8Array(n * sG);
        for (let i = 0; i < n; i++) natural.set(G1.toJacobian(G1.timesFr(G1.g, Fr.fromRng(rng))), i * sG);

        const oracle = await G1.fft(natural, "jacobian", "jacobian");

        const rev = new Uint8Array(natural);
        utils.buffReverseBits(rev, sG);
        let b1 = rev.slice(0, (n / 2) * sG);
        let b2 = rev.slice((n / 2) * sG);
        b1 = await G1.fftMix(b1);
        b2 = await G1.fftMix(b2);
        [b1, b2] = await G1.fftJoin(b1, b2, Fr.one, Fr.w[bits]);

        const mirror = new Uint8Array(n * sG);
        mirror.set(b1, 0);
        mirror.set(b2, (n / 2) * sG);
        for (const i of [0, 1, n / 2, n - 1]) {
            assert(G1.eq(mirror.slice(i * sG, (i + 1) * sG), oracle.slice(i * sG, (i + 1) * sG)), `point ${i}`);
        }

        // chunked fftFinal (nPoints > concurrency)
        const factor = Fr.e(7);
        const out = await G1.fftFinal(natural, factor);
        assert.strictEqual(out.byteLength, n * G1.F.n8 * 2);
    });

    it("multiExpAffine batch=auto samples trivial scalars on a large input", async () => {
        const n = 2048;
        const sG = G1.F.n8 * 2;
        const bases = new Uint8Array(n * sG);
        const trivial = new Uint8Array(n * 32);
        const rng = new ChaCha([4, 4, 4, 4, 4, 4, 4, 4]);
        let expected = G1.zero;
        for (let i = 0; i < n; i++) {
            const P = G1.timesFr(G1.g, Fr.fromRng(rng));
            bases.set(G1.toAffine(P), i * sG);
            trivial[i * 32] = i % 2;
            if (i % 2) expected = G1.add(expected, P);
        }
        const res = await G1.multiExpAffine(bases, trivial, undefined, "trivial-large", { batch: "auto" });
        assert(G1.eq(res, expected));
    });

    it("batch=auto over-cache-budget bases trigger the trivial-scalar sampling", async () => {
        // Tile a handful of real points to exceed AUTO_BATCH_MAX_BASES_BYTES
        // cheaply; scalars are all 0/1 so the expected sum stays computable.
        const sG = G1.F.n8 * 2;
        const distinct = [];
        for (let k = 1; k <= 8; k++) distinct.push(G1.toAffine(G1.timesFr(G1.g, Fr.e(k))));

        const n = 1 << 17; // 8 MiB of bases
        const bases = new Uint8Array(n * sG);
        const scalars = new Uint8Array(n * 32);
        let expected = G1.zero;
        for (let i = 0; i < n; i++) {
            const P = distinct[i % 8];
            bases.set(P, i * sG);
            if (i % 3 === 0) {
                scalars[i * 32] = 1;
                expected = G1.add(expected, P);
            }
        }
        const res = await G1.multiExpAffine(bases, scalars, undefined, "sampled", { batch: "auto" });
        assert(G1.eq(res, expected));
    });

    it("G2.batchApplyKey converts between affine and jacobian representations", async () => {
        const G2 = curve.G2;
        const ks = [2, 4, 6, 8];
        const sIn = G2.F.n8 * 2;
        const sOut = G2.F.n8 * 3;
        const buff = new Uint8Array(ks.length * sIn);
        ks.forEach((k, i) => buff.set(G2.toAffine(G2.timesFr(G2.g, Fr.e(k))), i * sIn));

        const first = Fr.e(3), inc = Fr.e(2);
        const out = await G2.batchApplyKey(buff, first, inc, "affine", "jacobian");
        let t = first;
        for (let i = 0; i < ks.length; i++) {
            const expected = G2.timesFr(G2.timesFr(G2.g, Fr.e(ks[i])), t);
            assert(G2.eq(out.slice(i * sOut, (i + 1) * sOut), expected), `G2 ${i}`);
            t = Fr.mul(t, inc);
        }

        // Fr batchApplyKey with array input
        const arr = [Fr.e(5), Fr.e(6)];
        const outFr = await Fr.batchApplyKey(utils.array2buffer(arr, Fr.n8), Fr.e(1), Fr.e(10));
        assert(Fr.eq(outFr.slice(0, Fr.n8), Fr.e(5)));
        assert(Fr.eq(outFr.slice(Fr.n8, Fr.n8 * 2), Fr.e(60)));
    });

    it("wasm F2 montgomery conversions and mul1", () => {
        const F2 = curve.F2;
        const a = F2.e([1234n, 5678n]);
        const m = F2.toMontgomery(a);
        assert(F2.eq(F2.fromMontgomery(m), a));

        // mul1 multiplies by a base-field element
        const c = curve.F1.e(3);
        const viaMul1 = F2.mul1(a, c);
        const viaMul = F2.mul(a, F2.e([3n, 0n]));
        assert(F2.eq(viaMul1, viaMul));

        assert(F2.isNegative(F2.neg(F2.e([1n, 0n]))) !== F2.isNegative(F2.e([1n, 0n])));
    });

    it("wasm F6 montgomery conversions and eq/isZero across ops", () => {
        const F6 = curve.F6;
        const a = F6.e([[1n, 2n], [3n, 4n], [5n, 6n]]);
        const m = F6.toMontgomery(a);
        assert(F6.eq(F6.fromMontgomery(m), a));
        assert(F6.isZero(F6.sub(a, a)));
        assert(!F6.isZero(a));
        assert(F6.isNegative(F6.neg(a)) !== F6.isNegative(a));
    });
});

describe("exported FFT helpers for Fr and G2", function () {
    this.timeout(120000);

    let curve, Fr;
    before(async () => { curve = await buildBn128(); Fr = curve.Fr; });
    after(async () => { await curve.terminate(); });

    // NOTE: Fr.fftMix/fftJoin exist but compute sizes as G.F.n8*3 (three
    // point coordinates), which is meaningless for the scalar field -- the Fr
    // variants are dead code and are c8-ignored at the source.

    it("G2.fftMix/fftJoin/fftFinal run on the G2 group", async () => {
        const G2 = curve.G2;
        const n = 8, bits = 3;
        const sG = G2.F.n8 * 3;
        const natural = new Uint8Array(n * sG);
        for (let i = 0; i < n; i++) natural.set(G2.toJacobian(G2.timesFr(G2.g, Fr.e(i + 1))), i * sG);

        const oracle = await G2.fft(natural, "jacobian", "jacobian");

        const rev = new Uint8Array(natural);
        utils.buffReverseBits(rev, sG);
        let b1 = rev.slice(0, (n / 2) * sG);
        let b2 = rev.slice((n / 2) * sG);
        b1 = await G2.fftMix(b1);
        b2 = await G2.fftMix(b2);
        [b1, b2] = await G2.fftJoin(b1, b2, Fr.one, Fr.w[bits]);

        const mirror = new Uint8Array(n * sG);
        mirror.set(b1, 0);
        mirror.set(b2, (n / 2) * sG);
        for (let i = 0; i < n; i++) {
            assert(G2.eq(mirror.slice(i * sG, (i + 1) * sG), oracle.slice(i * sG, (i + 1) * sG)), `G2 point ${i}`);
        }

        const out = await G2.fftFinal(natural, Fr.e(2));
        assert.strictEqual(out.byteLength, n * G2.F.n8 * 2);
    });

    it("zeroAffine conversions round-trip", () => {
        const G1 = curve.G1;
        assert(G1.isZero(G1.toAffine(G1.zeroAffine)));
        assert(G1.isZero(G1.toJacobian(G1.zeroAffine)));
        assert(G1.isZero(G1.neg(G1.zeroAffine)));
    });
});

describe("last-mile engine edges", function () {
    this.timeout(120000);

    let curve, Fr, G1;
    before(async () => { curve = await buildBn128(); Fr = curve.Fr; G1 = curve.G1; });
    after(async () => { await curve.terminate(); });

    it("Fr.lagrangeEvaluations delegates to ifft for field elements", async () => {
        const n = 8;
        const buff = new Uint8Array(n * Fr.n8);
        for (let i = 0; i < n; i++) buff.set(Fr.e(i + 1), i * Fr.n8);
        const coefs = await Fr.lagrangeEvaluations(buff, "", "", undefined, "fr-le");
        const back = await Fr.fft(coefs);
        assert.deepEqual([...back], [...buff]);
    });

    it("fftJoin/fftFinal reject non-power-of-two point counts", async () => {
        const sG = G1.F.n8 * 3;
        const three = new Uint8Array(3 * sG);
        for (let i = 0; i < 3; i++) three.set(G1.timesFr(G1.g, Fr.e(i + 1)), i * sG);
        let threw = false;
        try { await G1.fftJoin(three, three, Fr.one, Fr.w[2]); } catch (e) { threw = true; }
        assert(threw, "fftJoin non-pow2");
        threw = false;
        try { await G1.fftFinal(three, Fr.one); } catch (e) { threw = true; }
        assert(threw, "fftFinal non-pow2");
    });

    it("batch converters reject misaligned buffers", async () => {
        let threw = false;
        try { await Fr.batchToMontgomery(new Uint8Array(3)); } catch (e) { threw = true; }
        assert(threw);
    });

    it("G2.batchApplyKey affine-to-affine output path", async () => {
        const G2 = curve.G2;
        const sIn = G2.F.n8 * 2;
        const buff = new Uint8Array(2 * sIn);
        buff.set(G2.toAffine(G2.timesFr(G2.g, Fr.e(3))), 0);
        buff.set(G2.toAffine(G2.timesFr(G2.g, Fr.e(4))), sIn);
        const out = await G2.batchApplyKey(buff, Fr.e(1), Fr.e(2), "affine", "affine");
        assert(G2.eq(out.slice(0, sIn), G2.timesFr(G2.g, Fr.e(3))));
        assert(G2.eq(out.slice(sIn), G2.timesFr(G2.g, Fr.e(8))));
    });

    it("pairingEq accepts a precomputed Ct argument (odd arity)", async () => {
        const G2 = curve.G2;
        const p1 = G1.timesFr(G1.g, Fr.e(3));
        const q1 = G2.g;
        const p2 = G1.neg(G1.g);
        const q2 = G2.timesFr(G2.g, Fr.e(3));
        // e(3G1, G2) * e(-G1, 3G2) == 1, expressed with an explicit Gt one
        const ok = await curve.pairingEq(p1, q1, p2, q2, curve.Gt.one);
        assert.strictEqual(ok, true);
    });

    it("wasm Fr.e normalizes values beyond ±p", () => {
        const pPlus1 = 21888242871839275222246405745257275088548364400416034343698204186575808495618n;
        assert(Fr.eq(Fr.e(pPlus1), Fr.e(1)));
        assert(Fr.eq(Fr.e(-pPlus1), Fr.e(-1)));
    });

    it("utils: leInt2Buff auto-length and unstringifyFElements pass-through", () => {
        const b = utils.leInt2Buff(5n);
        assert.strictEqual(b.byteLength, 1);
        assert.strictEqual(b[0], 5);
        const z = utils.leInt2Buff(0n);
        assert.strictEqual(z.byteLength, 1);
        assert.strictEqual(utils.unstringifyFElements(Fr, 42), 42);
    });
});

describe("curves resolve bls12381 too", function () {
    this.timeout(300000);

    it("by name, q and r", async () => {
        const c = await getCurveFromName("bls12-381", true);
        try {
            assert.strictEqual(c.name, "bls12381");
            const byQ = await getCurveFromQ(c.q, true);
            assert.strictEqual(byQ.name, "bls12381");
            const byR = await getCurveFromR(c.r, true);
            assert.strictEqual(byR.name, "bls12381");
        } finally {
            await c.terminate();
        }
    });
});

describe("F1Field shift edge cases", function () {
    const F = new F1Field(Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617"));

    it("shl and shr with negative shifts delegate to each other", () => {
        const a = F.e("0xF0F0");
        assert(F.eq(F.shl(a, F.neg(F.e(4))), F.shr(a, F.e(4))));
        assert(F.eq(F.shr(a, F.neg(F.e(4))), F.shl(a, F.e(4))));
        // shifts with negative magnitude beyond nBits are zero
        assert(F.eq(F.shr(a, F.neg(F.e(1000))), F.zero));
        assert(F.eq(F.shl(a, F.neg(F.e(1000))), F.zero));
    });

    it("e() parses strings with explicit radix", () => {
        assert(F.eq(F.e("ff", 16), F.e(255)));
    });
});

describe("random fallback paths", function () {
    it("uses Web Crypto when randomFillSync is masked, and Math.random as last resort", function () {
        const original = nodeCrypto.randomFillSync;
        const webDesc = Object.getOwnPropertyDescriptor(globalThis, "crypto");
        try {
            nodeCrypto.randomFillSync = undefined;
        } catch {
            this.skip();
        }
        try {
            const a = getRandomBytes(70000); // spans two Web Crypto windows
            assert.strictEqual(a.length, 70000);
            assert(a.subarray(65536).some((b) => b !== 0));

            if (webDesc && webDesc.configurable) {
                Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
                const b = getRandomBytes(64); // insecure Math.random fallback
                assert.strictEqual(b.length, 64);
                assert(b.some((v) => v !== 0));
            }
        } finally {
            nodeCrypto.randomFillSync = original;
            if (webDesc) Object.defineProperty(globalThis, "crypto", webDesc);
        }
    });
});
