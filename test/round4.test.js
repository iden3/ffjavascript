import { assert } from "vitest";
import buildBn128 from "../src/bn128.js";
import buildBls12381 from "../src/bls12381.js";
import * as Scalar from "../src/scalar.js";
import * as utils from "../src/utils.js";
import F1Field from "../src/f1field.js";
import PolField from "../src/polfield.js";
import ChaCha from "../src/chacha.js";


describe("wasm curve mixed-representation dispatch", function () {

    let curve, Fr, G1;
    beforeAll(async () => { curve = await buildBn128(); Fr = curve.Fr; G1 = curve.G1; });
    afterAll(async () => { await curve.terminate(); });

    it("add/sub accept every jacobian/affine combination and reject bad sizes", () => {
        const Pj = G1.timesFr(G1.g, Fr.e(7));      // jacobian
        const Qj = G1.timesFr(G1.g, Fr.e(11));
        const Pa = G1.toAffine(Pj);
        const Qa = G1.toAffine(Qj);
        const expected = G1.add(Pj, Qj);

        assert(G1.eq(G1.add(Pj, Qa), expected), "jac+aff");
        assert(G1.eq(G1.add(Pa, Qj), expected), "aff+jac");
        assert(G1.eq(G1.add(Pa, Qa), expected), "aff+aff");

        const expSub = G1.sub(Pj, Qj);
        assert(G1.eq(G1.sub(Pj, Qa), expSub), "jac-aff");
        assert(G1.eq(G1.sub(Pa, Qj), expSub), "aff-jac");
        assert(G1.eq(G1.sub(Pa, Qa), expSub), "aff-aff");

        const bad = new Uint8Array(7);
        assert.throws(() => G1.add(bad, Qj), /invalid point size/);
        assert.throws(() => G1.add(Pj, bad), /invalid point size/);
        assert.throws(() => G1.add(Pa, bad), /invalid point size/);
        assert.throws(() => G1.sub(bad, Qj), /invalid point size/);
        assert.throws(() => G1.sub(Pj, bad), /invalid point size/);
        assert.throws(() => G1.sub(Pa, bad), /invalid point size/);
    });

    it("neg/double/isZero/eq/toAffine/toJacobian on affine inputs and the zero point", () => {
        const Pj = G1.timesFr(G1.g, Fr.e(13));
        const Pa = G1.toAffine(Pj);

        assert(G1.eq(G1.neg(Pa), G1.neg(Pj)), "neg affine");
        assert(G1.eq(G1.double(Pa), G1.double(Pj)), "double affine");
        assert(!G1.isZero(Pa), "isZero affine");
        assert(G1.isZero(G1.zeroAffine), "zero affine");

        // eq across representations
        assert(G1.eq(Pa, Pj) && G1.eq(Pj, Pa) && G1.eq(Pa, Pa));
        assert.throws(() => G1.eq(new Uint8Array(5), Pj), /invalid point size/);

        // toAffine of an affine point and of zero
        assert(G1.eq(G1.toAffine(Pa), Pa));
        const zAff = G1.toAffine(G1.zero);
        assert(G1.isZero(zAff));
        // toJacobian of a jacobian point is a pass-through
        assert(G1.eq(G1.toJacobian(Pj), Pj));
        assert(G1.isZero(G1.toJacobian(G1.zeroAffine)));

        // timesScalar/timesFr with affine bases
        assert(G1.eq(G1.timesScalar(Pa, Scalar.e(3)), G1.timesScalar(Pj, Scalar.e(3))));
        assert(G1.eq(G1.timesFr(Pa, Fr.e(3)), G1.timesFr(Pj, Fr.e(3))));

        // x()/y() on a jacobian input normalize first
        assert(G1.F.eq(G1.x(Pj), G1.x(Pa)));
        assert(G1.F.eq(G1.y(Pj), G1.y(Pa)));

        // string forms of zero and nonzero
        assert(typeof G1.toString(G1.zero) === "string");
        assert(typeof G1.toString(Pa, 16) === "string");

        // LEM serialization of the zero point round-trips
        const sG = G1.F.n8 * 2;
        const buff = new Uint8Array(sG);
        G1.toRprLEM(buff, 0, G1.zero);
        assert(G1.isZero(G1.fromRprLEM(buff, 0)));
    });

    it("multiExp variants: jacobian bases, empty input, batch modes, trivial scalars", async () => {
        const n = 128;
        const rng = new ChaCha([5, 4, 3, 2, 1, 0, 9, 8]);
        const sG = G1.F.n8 * 2;

        const basesAff = new Uint8Array(n * sG);
        const basesJac = new Uint8Array(n * G1.F.n8 * 3);
        const scalars = new Uint8Array(n * 32);
        const trivialScalars = new Uint8Array(n * 32); // all 0/1
        let expected = G1.zero;
        for (let i = 0; i < n; i++) {
            const k = Fr.fromRng(rng);
            const P = G1.timesFr(G1.g, k);
            basesAff.set(G1.toAffine(P), i * sG);
            basesJac.set(G1.toJacobian(P), i * G1.F.n8 * 3);
            const s = Scalar.e(i * 7 + 1);
            Scalar.toRprLE(scalars, i * 32, s, 32);
            trivialScalars[i * 32] = i % 2;
            expected = G1.add(expected, G1.timesScalar(P, s));
        }

        const viaAffine = await G1.multiExpAffine(basesAff, scalars);
        assert(G1.eq(viaAffine, expected), "multiExpAffine");

        const viaJac = await G1.multiExp(basesJac, scalars);
        assert(G1.eq(viaJac, expected), "multiExp (jacobian)");

        // empty input returns zero
        const empty = await G1.multiExpAffine(new Uint8Array(0), new Uint8Array(0));
        assert(G1.isZero(empty), "empty multiexp");

        // batch-mode auto with mostly-trivial scalars takes the sampling path
        const logLines = [];
        const logger = { debug: (m) => logLines.push(m), info() {}, warn() {}, error() {} };
        const trivialRes = await G1.multiExpAffine(basesAff, trivialScalars, logger, "trivial", { batch: "auto" });
        let expTrivial = G1.zero;
        for (let i = 0; i < n; i++) {
            if (i % 2) expTrivial = G1.add(expTrivial, G1.fromRprLEM(basesAff.slice(i * sG, (i + 1) * sG), 0));
        }
        assert(G1.eq(trivialRes, expTrivial), "trivial-scalar multiexp");

        for (const batch of ["enabled", "disabled"]) {
            const res = await G1.multiExpAffine(basesAff, scalars, logger, `batch-${batch}`, { batch });
            assert(G1.eq(res, expected), `batch=${batch}`);
        }
    });

    it("G2.batchApplyKey covers the jacobian G2 path", async () => {
        const G2 = curve.G2;
        const ks = [3, 5, 7, 9];
        const sG = G2.F.n8 * 3;
        const buff = new Uint8Array(ks.length * sG);
        ks.forEach((k, i) => buff.set(G2.toJacobian(G2.timesFr(G2.g, Fr.e(k))), i * sG));

        const first = Fr.e(2), inc = Fr.e(5);
        const out = await G2.batchApplyKey(buff, first, inc, "jacobian", "jacobian");
        let t = first;
        for (let i = 0; i < ks.length; i++) {
            const expected = G2.timesFr(G2.timesFr(G2.g, Fr.e(ks[i])), t);
            assert(G2.eq(out.slice(i * sG, (i + 1) * sG), expected), `G2 ${i}`);
            t = Fr.mul(t, inc);
        }
    });

    it("Fr.batchInverse inverts buffers, arrays and BigBuffers", async () => {
        const { default: BigBuffer } = await import("../src/bigbuffer.js");
        const vals = [2, 3, 5, 7, 11, 13, 17, 19].map((v) => Fr.e(v));

        // array input -> array output
        const invArr = await Fr.batchInverse(vals);
        for (let i = 0; i < vals.length; i++) {
            assert(Fr.eq(Fr.mul(invArr[i], vals[i]), Fr.one), `array ${i}`);
        }

        // flat buffer input
        const buff = new Uint8Array(vals.length * Fr.n8);
        vals.forEach((v, i) => buff.set(v, i * Fr.n8));
        const invBuff = await Fr.batchInverse(buff);
        for (let i = 0; i < vals.length; i++) {
            assert(Fr.eq(Fr.mul(invBuff.slice(i * Fr.n8, (i + 1) * Fr.n8), vals[i]), Fr.one), `buff ${i}`);
        }

        // BigBuffer input
        const big = new BigBuffer(buff.byteLength);
        big.set(buff, 0);
        const invBig = await Fr.batchInverse(big);
        for (let i = 0; i < vals.length; i++) {
            assert(Fr.eq(Fr.mul(invBig.slice(i * Fr.n8, (i + 1) * Fr.n8), vals[i]), Fr.one), `bigbuff ${i}`);
        }
    });

    it("wasm F2/F6 field extras: e-from-array, isSquare/sqrt, exp, toString radix", () => {
        const F2 = curve.F2, F6 = curve.F6;

        const a2 = F2.e([12345n, 678n]);
        assert(typeof F2.toString(a2, 16) === "string");
        assert.throws(() => F2.e([1n]), /invalid F2/);
        const sq2 = F2.square(a2);
        assert(F2.isSquare(sq2));
        const s2 = F2.sqrt(sq2);
        assert(F2.eq(F2.square(s2), sq2));
        assert(F2.eq(F2.exp(a2, Scalar.e(4)), F2.square(F2.square(a2))));

        const a6 = F6.e([[1n, 2n], [3n, 4n], [5n, 6n]]);
        assert(typeof F6.toString(a6) === "string");
        assert(F6.eq(F6.exp(a6, Scalar.e(2)), F6.square(a6)));
        assert.throws(() => F6.e([1n]), /invalid/i);
    });
});

describe("single-thread engine covers the inline thread paths", function () {

    it("runs fft, multiexp and batch ops through the in-process task runner", async () => {
        const curve = await buildBn128(true);
        try {
            const Fr = curve.Fr, G1 = curve.G1;
            const n = 16;
            const buff = new Uint8Array(n * Fr.n8);
            for (let i = 0; i < n; i++) buff.set(Fr.e(i * 3 + 1), i * Fr.n8);

            const freq = await Fr.fft(buff);
            const back = await Fr.ifft(freq);
            assert.deepEqual([...back], [...buff]);

            const sG = G1.F.n8 * 2;
            const bases = new Uint8Array(4 * sG);
            const scalars = new Uint8Array(4 * 32);
            let expected = G1.zero;
            for (let i = 0; i < 4; i++) {
                const P = G1.timesFr(G1.g, Fr.e(i + 2));
                bases.set(G1.toAffine(P), i * sG);
                Scalar.toRprLE(scalars, i * 32, Scalar.e(i + 1), 32);
                expected = G1.add(expected, G1.timesScalar(P, Scalar.e(i + 1)));
            }
            const msm = await G1.multiExpAffine(bases, scalars);
            assert(G1.eq(msm, expected));

            const conv = await Fr.batchFromMontgomery(buff);
            const backConv = await Fr.batchToMontgomery(conv);
            assert.deepEqual([...backConv], [...buff]);

            const applied = await Fr.batchApplyKey(buff, Fr.e(1), Fr.e(2));
            assert.strictEqual(applied.byteLength, buff.byteLength);

            // direct task with a transfer list through the inline queue
            const res = await curve.tm.queueAction([
                { cmd: "ALLOCSET", var: 0, buff: Fr.e(9) },
                { cmd: "ALLOC", var: 1, len: Fr.n8 },
                { cmd: "CALL", fnName: "frm_square", params: [{ var: 0 }, { var: 1 }] },
                { cmd: "GET", out: 0, var: 1, len: Fr.n8 },
            ], [Fr.e(9).buffer]);
            assert(Fr.eq(res[0], Fr.e(81)));
        } finally {
            await curve.terminate();
        }
    });
});

describe("PolField fft2/ifft2 and division edges", function () {
    const r = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
    const F = new F1Field(r);
    const PF = new PolField(F);

    it("fft2/ifft2 round-trip and agree with fft/ifft", async () => {
        const rng = new ChaCha([1, 1, 2, 3, 5, 8, 13, 21]);
        const p = [];
        for (let i = 0; i < 8; i++) p.push(F.fromRng(rng));

        // note: fft/fft2 may alias their input when its length is already a
        // power of two (extend() returns the array itself and __bitReverse
        // mutates in place) -- hand each call its own copy
        const f1 = PF.fft(p.slice());
        const f2 = PF.fft2(p.slice());
        assert.strictEqual(f1.length, f2.length);
        for (let i = 0; i < f1.length; i++) assert(F.eq(f1[i], f2[i]), `fft2 ${i}`);

        const b1 = PF.ifft(f1.slice());
        const b2 = PF.ifft2(f2.slice());
        for (let i = 0; i < p.length; i++) {
            assert(F.eq(b1[i], p[i]), `ifft ${i}`);
            assert(F.eq(b2[i], p[i]), `ifft2 ${i}`);
        }
    });

    it("oneRoot rejects an out-of-range index", () => {
        assert.throws(() => PF.oneRoot(16, 16), /lower than/);
    });

    it("div handles divisor degree > dividend degree and exact single-term division", () => {
        const p1 = [F.e(1), F.e(2)];
        const p2 = [F.e(1), F.e(2), F.e(3), F.e(4)];
        const q = PF.div(p1, p2);
        assert(PF.eq(PF.reduce(q), []), "quotient is zero");

        // large-degree division exercises the reciprocal (Newton) path
        const rng = new ChaCha([7, 7, 7, 7, 1, 2, 3, 4]);
        const num = [], den = [];
        for (let i = 0; i < 40; i++) num.push(F.fromRng(rng));
        for (let i = 0; i < 9; i++) den.push(F.fromRng(rng));
        const quot = PF.div(num, den);
        // num = quot*den + rem with deg(rem) < deg(den)
        const recon = PF.add(PF.mul(quot, den), PF.sub(num, PF.mul(quot, den)));
        assert(PF.eq(PF.reduce(recon), PF.reduce(num)));
        const rem = PF.reduce(PF.sub(num, PF.mul(quot, den)));
        assert(rem.length < den.length, "remainder degree");
    });

    it("toString renders negative coefficients", () => {
        const s = PF.toString([F.neg(F.e(3)), F.e(2), F.neg(F.e(1))]);
        assert(typeof s === "string" && s.length > 0);
    });
});

describe("fsqrt edge paths", function () {
    it("F2 sqrt (alg9) returns null for a quadratic non-residue", async () => {
        const { default: F2Field } = await import("../src/f2field.js");
        const q = Scalar.fromString("21888242871839275222246405745257275088696311157297823662689037894645226208583");
        const F1 = new F1Field(q);
        const F2 = new F2Field(F1, F1.negone);

        // find a deterministic non-square by Euler's criterion in Fq2
        const power = Scalar.div(Scalar.sub(Scalar.mul(q, q), 1n), 2n);
        const rng = new ChaCha([6, 6, 6, 6, 6, 6, 6, 6]);
        let nonSquare = null;
        for (let i = 0; i < 20 && !nonSquare; i++) {
            const cand = F2.fromRng(rng);
            if (!F2.eq(F2.exp(cand, power), F2.one)) nonSquare = cand;
        }
        assert(nonSquare, "found a non-residue");
        assert.strictEqual(F2.sqrt(nonSquare), null);
    });

    it("F1 sqrt returns null for non-residues near the prime", () => {
        const F = new F1Field(Scalar.e(17)); // tonelli-shanks branch
        // 3 is a non-residue mod 17
        assert.strictEqual(F.sqrt(F.e(3)), null);
    });
});

describe("utils leftover branches", function () {
    it("int2buff rejects values that do not fit", () => {
        assert.throws(() => utils.leInt2Buff(Scalar.e(256), 1), /does not fit/i);
        assert.throws(() => utils.beInt2Buff(Scalar.e(256), 1), /does not fit/i);
    });

    it("stringifyBigInts handles Fr-element Uint8Arrays and plain numbers", () => {
        assert.strictEqual(utils.stringifyBigInts(42), 42);
        // a Uint8Array is interpreted as a little-endian integer
        const u8 = utils.leInt2Buff(7n, 32);
        const s = utils.stringifyBigInts(u8);
        assert(Scalar.eq(Scalar.e(s), 7n));
        assert.strictEqual(utils.unstringifyBigInts("0x10"), 16n);
    });
});

describe("bls12381 runtime plugin build", function () {

    it("builds bls12381 through the wasmbuilder plugin path", async () => {
        let pluginCalled = false;
        const curve = await buildBls12381(true, (mb) => { pluginCalled = true; void mb; });
        try {
            assert(pluginCalled);
            const P = curve.G1.timesFr(curve.G1.g, curve.Fr.e(5));
            assert(curve.G1.isValid(curve.G1.toAffine(P)));
        } finally {
            await curve.terminate();
        }
    });
});
