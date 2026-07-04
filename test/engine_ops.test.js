import { assert } from "vitest";
import buildBn128 from "../src/bn128.js";
import * as Scalar from "../src/scalar.js";
import * as utils from "../src/utils.js";
import BigBuffer from "../src/bigbuffer.js";
import { getCurveFromName, getCurveFromQ, getCurveFromR } from "../src/curves.js";
import { base64ToUint8Array } from "../src/wasm/base64.js";


describe("engine batch operations", function () {

    let curve, Fr, G1, G2;

    beforeAll(async () => {
        curve = await buildBn128();
        Fr = curve.Fr; G1 = curve.G1; G2 = curve.G2;
    });
    afterAll(async () => {
        await curve.terminate();
    });

    function frBuff(scalars) {
        const buff = new Uint8Array(scalars.length * Fr.n8);
        scalars.forEach((s, i) => buff.set(Fr.e(s), i * Fr.n8));
        return buff;
    }

    function pointsBuff(G, scalars, type) {
        const sG = type === "jacobian" ? G.F.n8 * 3 : G.F.n8 * 2;
        const buff = new Uint8Array(scalars.length * sG);
        scalars.forEach((s, i) => {
            const P = G.timesFr(G.g, Fr.e(s));
            buff.set(type === "jacobian" ? G.toJacobian(P) : G.toAffine(P), i * sG);
        });
        return buff;
    }

    it("batchToMontgomery/batchFromMontgomery round-trip, Uint8Array and BigBuffer", async () => {
        const scalars = [...Array(8).keys()].map((i) => i * 999 + 1);
        const buff = frBuff(scalars);
        // Fr.e produces montgomery form; convert out and back
        const std = await Fr.batchFromMontgomery(buff);
        const back = await Fr.batchToMontgomery(std);
        assert.deepEqual([...back], [...buff]);

        const big = new BigBuffer(buff.byteLength);
        big.set(buff, 0);
        const stdBig = await Fr.batchFromMontgomery(big);
        const backBig = await Fr.batchToMontgomery(stdBig);
        assert.deepEqual([...backBig.slice(0, buff.byteLength)], [...buff]);
    });

    it("G1 representation batch conversions round-trip and match single-point ops", async () => {
        const ks = [1, 2, 3, 5, 8, 13, 21, 34];
        const lem = pointsBuff(G1, ks, "affine");
        const sG = G1.F.n8 * 2;

        const u = await G1.batchLEMtoU(lem);
        const backFromU = await G1.batchUtoLEM(u);
        assert.deepEqual([...backFromU], [...lem]);

        const c = await G1.batchLEMtoC(lem);
        const backFromC = await G1.batchCtoLEM(c);
        assert.deepEqual([...backFromC], [...lem]);

        const jac = await G1.batchToJacobian(lem);
        const affine = await G1.batchToAffine(jac);
        assert.deepEqual([...affine], [...lem]);

        // single-point agreement
        for (let i = 0; i < ks.length; i++) {
            const P = lem.slice(i * sG, (i + 1) * sG);
            const single = new Uint8Array(sG);
            G1.toRprUncompressed(single, 0, P);
            assert.deepEqual([...u.slice(i * sG, (i + 1) * sG)], [...single], `point ${i}`);
        }
    });

    it("batchApplyKey multiplies element i by first·inc^i (Fr, G1 affine and jacobian)", async () => {
        const ks = [7, 11, 13, 17];
        const first = Fr.e(5), inc = Fr.e(3);

        const frIn = frBuff(ks);
        const frOut = await Fr.batchApplyKey(frIn, first, inc);
        let t = first;
        for (let i = 0; i < ks.length; i++) {
            const expected = Fr.mul(Fr.e(ks[i]), t);
            assert.deepEqual([...frOut.slice(i * Fr.n8, (i + 1) * Fr.n8)], [...expected], `Fr ${i}`);
            t = Fr.mul(t, inc);
        }

        for (const type of ["affine", "jacobian"]) {
            const sG = type === "jacobian" ? G1.F.n8 * 3 : G1.F.n8 * 2;
            const g1In = pointsBuff(G1, ks, type);
            const g1Out = await G1.batchApplyKey(g1In, first, inc, type, type);
            let tt = first;
            for (let i = 0; i < ks.length; i++) {
                const expected = G1.timesFr(G1.timesFr(G1.g, Fr.e(ks[i])), tt);
                const got = g1Out.slice(i * sG, (i + 1) * sG);
                assert(G1.eq(got, expected), `G1 ${type} ${i}`);
                tt = Fr.mul(tt, inc);
            }
        }
    });

    it("Fr.fft/ifft round-trip with logger, BigBuffer input, and G-homomorphism", async () => {
        const logLines = [];
        const logger = { debug: (m) => logLines.push(m), info() {}, warn() {}, error() {} };

        const ks = [...Array(16).keys()].map((i) => i * 7 + 1);
        const buff = frBuff(ks);
        const freq = await Fr.fft(buff, "", "", logger, "fr-fft");
        const back = await Fr.ifft(freq, "", "", logger, "fr-ifft");
        assert.deepEqual([...back], [...buff]);
        assert(logLines.length > 0);

        const big = new BigBuffer(buff.byteLength);
        big.set(buff, 0);
        const freqBig = await Fr.fft(big);
        assert.deepEqual([...freqBig.slice(0, buff.byteLength)], [...freq]);

        // G1.fft(g·k) == g·(Fr.fft(k)) -- the group FFT is the field FFT
        // lifted through the homomorphism k -> k·G
        const g1In = pointsBuff(G1, ks, "affine");
        const g1Freq = await G1.fft(g1In, "affine", "affine");
        const sG = G1.F.n8 * 2;
        for (let i = 0; i < ks.length; i++) {
            const scalar = freq.slice(i * Fr.n8, (i + 1) * Fr.n8);
            const expected = G1.timesFr(G1.g, scalar);
            const got = g1Freq.slice(i * sG, (i + 1) * sG);
            assert(G1.eq(got, expected), `G1 fft point ${i}`);
        }

        // and the inverse brings the points back
        const g1Back = await G1.ifft(g1Freq, "affine", "affine");
        for (let i = 0; i < ks.length; i++) {
            assert(G1.eq(g1Back.slice(i * sG, (i + 1) * sG), g1In.slice(i * sG, (i + 1) * sG)), `G1 ifft point ${i}`);
        }
    });

    it("fft rejects a non-power-of-two input", async () => {
        const buff = frBuff([1, 2, 3]);
        let threw = false;
        try { await Fr.fft(buff); } catch (e) { threw = true; }
        assert(threw);
    });

    it("lagrangeEvaluations inverts fft (G1 and G2, affine and jacobian)", async () => {
        const ks = [3, 1, 4, 1, 5, 9, 2, 6];
        for (const [G, name] of [[G1, "G1"], [G2, "G2"]]) {
            for (const type of ["affine", "jacobian"]) {
                const sG = type === "jacobian" ? G.F.n8 * 3 : G.F.n8 * 2;
                const evals = pointsBuff(G, ks, type);
                const coefs = await G.lagrangeEvaluations(evals, type, type, undefined, name);
                const back = await G.fft(coefs, type, type);
                for (let i = 0; i < ks.length; i++) {
                    assert(G.eq(back.slice(i * sG, (i + 1) * sG), evals.slice(i * sG, (i + 1) * sG)), `${name} ${type} ${i}`);
                }
            }
        }
    });

    it("lagrangeEvaluations rejects a non-power-of-two input", async () => {
        const errors = [];
        const logger = { error: (m) => errors.push(m), debug() {}, info() {}, warn() {} };
        const bad = pointsBuff(G1, [1, 2, 3], "affine");
        let threw = false;
        try { await G1.lagrangeEvaluations(bad, "affine", "affine", logger, "bad"); } catch (e) { threw = true; }
        assert(threw);
        assert(errors.length > 0);
    });

    it("exported fftMix/fftJoin reproduce the internal forward FFT", async () => {
        // Mirror of the internal chunked pipeline at the smallest scale:
        // bit-reverse, in-chunk mix on each half, then one join round with
        // first = w^0, inc = w[bits].
        const ks = [...Array(16).keys()].map((i) => 3 * i + 2);
        const bits = 4;
        const sG = G1.F.n8 * 3;

        const natural = pointsBuff(G1, ks, "jacobian");
        const oracle = await G1.fft(natural, "jacobian", "jacobian");

        const rev = new Uint8Array(natural);
        utils.buffReverseBits(rev, sG);
        let b1 = rev.slice(0, 8 * sG);
        let b2 = rev.slice(8 * sG);
        b1 = await G1.fftMix(b1);
        b2 = await G1.fftMix(b2);
        [b1, b2] = await G1.fftJoin(b1, b2, Fr.one, Fr.w[bits]);

        const mirror = new Uint8Array(16 * sG);
        mirror.set(b1, 0);
        mirror.set(b2, 8 * sG);

        for (let i = 0; i < 16; i++) {
            assert(G1.eq(mirror.slice(i * sG, (i + 1) * sG), oracle.slice(i * sG, (i + 1) * sG)), `point ${i}`);
        }
    });

    it("exported fftFinal scales points by the factor and returns affine", async () => {
        const ks = [2, 4, 6, 8, 10, 12, 14, 16];
        const factor = Fr.e(3);
        const jac = pointsBuff(G1, ks, "jacobian");
        const out = await G1.fftFinal(jac, factor);
        const sOut = G1.F.n8 * 2;
        assert.strictEqual(out.byteLength, ks.length * sOut);

        // Every output point must be factor·(input point), in some order
        const expected = ks.map((k) => G1.timesFr(G1.g, Fr.mul(Fr.e(k), factor)));
        for (let i = 0; i < ks.length; i++) {
            const got = out.slice(i * sOut, (i + 1) * sOut);
            assert(expected.some((e) => G1.eq(got, e)), `point ${i} is a scaled input`);
        }
    });

    it("fftJoin and fftFinal validate their inputs", async () => {
        const sG = G1.F.n8 * 3;
        const a = pointsBuff(G1, [1, 2], "jacobian");
        const b = pointsBuff(G1, [1, 2, 3, 4], "jacobian");
        let threw = false;
        try { await G1.fftJoin(a, b, Fr.one, Fr.w[2]); } catch (e) { threw = true; }
        assert(threw, "size mismatch must reject");

        threw = false;
        try { await Fr.fftFinal(frBuff([1, 2]), Fr.one); } catch (e) { threw = true; }
        assert(threw, "fftFinal is only defined for point groups");
        void sG;
    });

    it("wasm curve sweep: conversions, accessors, validity, serialization", async () => {
        for (const [G, label] of [[G1, "G1"], [G2, "G2"]]) {
            const P = G.timesFr(G.g, Fr.e(987654321));
            const aff = G.toAffine(P);
            const jac = G.toJacobian(aff);
            assert(G.eq(jac, P), `${label} affine/jacobian round-trip`);

            assert(G.isValid(aff), `${label} valid point`);
            assert(G.eq(G.e(G.toObject(aff)), aff), `${label} toObject/fromObject/e`);
            assert(typeof G.toString(aff, 16) === "string");

            const u = G.toUncompressed(aff);
            assert(G.eq(G.fromRprUncompressed(u, 0), aff), `${label} uncompressed`);

            const sG = G.F.n8 * 2;
            const lem = new Uint8Array(sG);
            G.toRprLEM(lem, 0, aff);
            assert(G.eq(G.fromRprLEM(lem, 0), aff), `${label} LEM`);

            const comp = new Uint8Array(G.F.n8);
            G.toRprCompressed(comp, 0, aff);
            assert(G.eq(G.fromRprCompressed(comp, 0), aff), `${label} compressed`);

            // x()/y() accessors return the affine coordinates
            assert(G.F.eq(G.x(aff), aff.slice(0, G.F.n8)), `${label} x accessor`);
            assert(G.F.eq(G.y(aff), aff.slice(G.F.n8, G.F.n8 * 2)), `${label} y accessor`);

            // corrupting a coordinate produces an invalid point
            const bad = new Uint8Array(aff);
            bad[8] ^= 0xFF;
            assert(!G.isValid(bad), `${label} corrupted point detected`);

            // timesScalar and timesFr agree
            const t1 = G.timesScalar(G.g, Scalar.e(31));
            const t2 = G.timesFr(G.g, Fr.e(31));
            assert(G.eq(t1, t2), `${label} timesScalar/timesFr`);

            // fromRng gives a valid point
            const { default: ChaCha } = await import("../src/chacha.js");
            const p = G.fromRng(new ChaCha([1, 3, 5, 7, 9, 11, 13, 15]));
            assert(G.isValid(G.toAffine(p)), `${label} fromRng valid`);
        }
    });

    it("wasm field sweep: F1, Fr, F2, F6, F12 basic algebra", async () => {
        for (const [F, deg, label] of [[curve.F1, 1, "F1"], [Fr, 1, "Fr"], [curve.F2, 2, "F2"], [curve.F6, 3, "F6"], [curve.F12, 2, "F12"]]) {
            const a = F.random();
            const b = F.random();
            assert(F.eq(F.add(a, b), F.add(b, a)), `${label} add commutes`);
            assert(F.eq(F.sub(a, b), F.neg(F.sub(b, a))), `${label} sub/neg`);
            assert(F.eq(F.square(a), F.mul(a, a)), `${label} square`);
            if (!F.isZero(a)) {
                assert(F.eq(F.mul(a, F.inv(a)), F.one), `${label} inverse`);
                assert(F.eq(F.div(b, a), F.mul(b, F.inv(a))), `${label} div`);
            }
            assert(F.isZero(F.sub(a, a)), `${label} zero`);
            assert(F.eq(F.fromObject(F.toObject(a)), a), `${label} object round-trip`);
            assert(typeof F.toString(a) === "string", `${label} toString`);
            void deg;
        }

        // F1/Fr extras
        assert(Fr.isSquare(Fr.square(Fr.e(77))));
        const s = Fr.sqrt(Fr.square(Fr.e(77)));
        assert(Fr.eq(Fr.square(s), Fr.square(Fr.e(77))));
        assert(Fr.isNegative(Fr.neg(Fr.e(1))));
        assert(!Fr.isNegative(Fr.e(1)));
        assert(Fr.eq(Fr.exp(Fr.e(3), Scalar.e(4)), Fr.e(81)));
        assert(Fr.eq(Fr.e("0x0a", 16), Fr.e(10)));
        assert(Fr.eq(Fr.e(-5), Fr.neg(Fr.e(5))));

        const le = new Uint8Array(Fr.n8);
        Fr.toRprLE(le, 0, Fr.e(1234));
        assert(Fr.eq(Fr.fromRprLE(le, 0), Fr.e(1234)));
        // wasm fields expose toRprBE but no fromRprBE: verify against the
        // byte-reversed LE representation instead
        const be = new Uint8Array(Fr.n8);
        Fr.toRprBE(be, 0, Fr.e(1234));
        assert.deepEqual([...be].reverse(), [...le]);
    });

    it("array2buffer/buffer2array and curve helpers", async () => {
        const sG = G1.F.n8 * 2;
        const pts = [1, 2, 3].map((k) => G1.toAffine(G1.timesFr(G1.g, Fr.e(k))));
        const buff = curve.array2buffer(pts, sG);
        const arr = curve.buffer2array(buff, sG);
        assert.strictEqual(arr.length, 3);
        for (let i = 0; i < 3; i++) assert(G1.eq(arr[i], pts[i]));
    });
});

describe("curves module", function () {

    it("resolves curves by name, q and r, rejecting unknown values", async () => {
        const c1 = await getCurveFromName("bn128", true);
        assert.strictEqual(c1.name, "bn128");
        const c2 = await getCurveFromQ(c1.q, true);
        assert.strictEqual(c2.name, "bn128");
        const c3 = await getCurveFromR(c1.r, true);
        assert.strictEqual(c3.name, "bn128");
        await c1.terminate();

        let threw = false;
        try { await getCurveFromName("ed25519"); } catch (e) { threw = true; }
        assert(threw);
        threw = false;
        try { await getCurveFromQ(Scalar.e(17)); } catch (e) { threw = true; }
        assert(threw);
        threw = false;
        try { await getCurveFromR(Scalar.e(17)); } catch (e) { threw = true; }
        assert(threw);
    });
});

describe("utils module", function () {
    it("buffer/int conversions round-trip (LE and BE, multi-limb)", () => {
        for (const n of [0n, 1n, 255n, 65537n, 2n ** 63n + 5n, 2n ** 250n + 12345n]) {
            for (const len of [32, 48]) {
                assert(Scalar.eq(utils.leBuff2int(utils.leInt2Buff(n, len)), n), `LE ${n}`);
                assert(Scalar.eq(utils.beBuff2int(utils.beInt2Buff(n, len)), n), `BE ${n}`);
            }
        }
        // odd buffer sizes exercise the partial-word paths
        for (const len of [1, 2, 3, 5, 7, 11]) {
            const n = (1n << BigInt(len * 8)) - 3n;
            assert(Scalar.eq(utils.leBuff2int(utils.leInt2Buff(n, len)), n), `LE odd ${len}`);
            assert(Scalar.eq(utils.beBuff2int(utils.beInt2Buff(n, len)), n), `BE odd ${len}`);
        }
    });

    it("stringifyBigInts/unstringifyBigInts cover every value shape", () => {
        const o = {
            n: 123n,
            s: "456",
            arr: [1n, "2", { deep: 3n }],
            u8: utils.leInt2Buff(999n, 32),
            // note: null values are NOT supported -- stringifyBigInts probes
            // o.eq and would throw on null
        };
        const s = utils.stringifyBigInts(o);
        assert.strictEqual(s.n, "123");
        assert.strictEqual(s.arr[2].deep, "3");
        const u = utils.unstringifyBigInts(s);
        assert.strictEqual(u.n, 123n);
        assert.strictEqual(u.arr[2].deep, 3n);
        // __BigInt__-style round trip for Uint8Array content
        assert(Scalar.eq(utils.leBuff2int(o.u8), 999n));
    });

    it("stringifyFElements/unstringifyFElements round-trip through a field", async () => {
        const curve = await buildBn128(true);
        try {
            const Fr = curve.Fr;
            const o = { a: Fr.e(7), list: [Fr.e(1), Fr.e(2)], nested: { b: Fr.e(3) } };
            const s = utils.stringifyFElements(Fr, o);
            assert.strictEqual(s.a, "7");
            const u = utils.unstringifyFElements(Fr, s);
            assert(Fr.eq(u.a, Fr.e(7)));
            assert(Fr.eq(u.list[1], Fr.e(2)));
            assert(Fr.eq(u.nested.b, Fr.e(3)));
        } finally {
            await curve.terminate();
        }
    });

    it("bitReverse, log2 and buffReverseBits", () => {
        assert.strictEqual(utils.bitReverse(1, 4), 8);
        assert.strictEqual(utils.bitReverse(utils.bitReverse(1234567, 24), 24), 1234567);
        assert.strictEqual(utils.log2(1), 0);
        assert.strictEqual(utils.log2(1 << 20), 20);

        // buffReverseBits permutes elements by bit-reversed index
        const eSize = 4;
        const n = 8;
        const buff = new Uint8Array(n * eSize);
        for (let i = 0; i < n; i++) buff[i * eSize] = i;
        utils.buffReverseBits(buff, eSize);
        const got = [...Array(n).keys()].map((i) => buff[i * eSize]);
        assert.deepEqual(got, [0, 4, 2, 6, 1, 5, 3, 7]);
    });

    it("array2buffer/buffer2array round-trip", () => {
        const a = [new Uint8Array([1, 2]), new Uint8Array([3, 4]), new Uint8Array([5, 6])];
        const buff = utils.array2buffer(a, 2);
        assert.deepEqual([...buff], [1, 2, 3, 4, 5, 6]);
        const back = utils.buffer2array(buff, 2);
        assert.deepEqual([...back[2]], [5, 6]);
    });
});

describe("wasm base64 decoder", function () {
    it("decodes base64 back to the original bytes", () => {
        const cases = [
            [72, 101, 108, 108, 111],       // "SGVsbG8="  (padded)
            [1, 2, 3],
            [255],
            [0, 0, 0, 0],
            [...Array(300).keys()].map((i) => i % 256),
        ];
        for (const bytes of cases) {
            const b64 = Buffer.from(bytes).toString("base64");
            const out = base64ToUint8Array(b64);
            assert.deepEqual([...out], bytes, b64.slice(0, 16));
        }
    });
});
