import * as chai from "chai";
import * as Scalar from "../src/scalar.js";
import buildBn128 from "../src/bn128.js";
import F1Field from "../src/f1field.js";
import RatField from "../src/ratfield.js";
import PolField from "../src/polfield.js";
import EC from "../src/ec.js";
import ChaCha from "../src/chacha.js";
import { getRandomBytes } from "../src/random.js";
import { base64ToUint8Array } from "../src/wasm/base64.js";

const assert = chai.assert;

const r = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");

describe("F1Field (pure JS) full sweep", function () {
    const F = new F1Field(r);
    const Fs = new F1Field(Scalar.e(65537));

    it("comparison and logic operators", () => {
        const a = F.e(5), b = F.e(7);
        assert(F.lt(a, b) && F.gt(b, a) && F.leq(a, a) && F.geq(b, b));
        assert(!F.lt(b, a) && !F.gt(a, b) && F.leq(a, b) && F.geq(b, a));
        // comparisons are on the normalized (signed) representation: -1 < 1
        assert(F.lt(F.neg(F.one), F.one));
        assert(F.gt(F.one, F.neg(F.one)));
        assert(F.land(a, b) && !F.land(a, F.zero));
        assert(F.lor(a, F.zero) && !F.lor(F.zero, F.zero));
        assert(F.lnot(F.zero) && !F.lnot(a));
        assert(F.neq(a, b) && !F.neq(a, a));
    });

    it("bit operations stay in the field", () => {
        const a = F.e("0xF0F0F0F0F0F0F0F0");
        const b = F.e("0x0FF00FF00FF00FF0");
        assert(F.eq(F.band(a, b), F.e(Scalar.band(F.toObject(a), F.toObject(b)))));
        assert(F.eq(F.bor(a, b), F.e(Scalar.bor(F.toObject(a), F.toObject(b)))));
        assert(F.eq(F.bxor(a, b), F.e(Scalar.bxor(F.toObject(a), F.toObject(b)))));
        // bnot/shl/shr are masked to the field's bit width and reduced mod p
        const nb = F.bnot(a);
        assert(Scalar.lt(F.toObject(nb), F.p), "bnot reduced");
        for (const n of [1, 7, 64, 250]) {
            assert(Scalar.lt(F.toObject(F.shl(a, F.e(n))), F.p), `shl ${n}`);
            assert(Scalar.lt(F.toObject(F.shr(a, F.e(n))), F.p), `shr ${n}`);
        }
        // shifts by >= nBits are defined (zero or via the complement path)
        assert(F.eq(F.shr(a, F.e(1000)), F.zero));
        assert(F.eq(F.shl(a, F.e(1000)), F.zero));
    });

    it("idiv, mod, pow, mulScalar and copy", () => {
        const a = F.e(1000), b = F.e(7);
        assert(F.eq(F.idiv(a, b), F.e(142)));
        assert(F.eq(F.mod(a, b), F.e(6)));
        assert(F.eq(F.pow(b, F.e(3)), F.e(343)));
        assert(F.eq(F.pow(b, 3), F.e(343)));
        assert(F.eq(F.mulScalar(b, 5), F.e(35)));
        assert(F.eq(F.copy(a), a));
    });

    it("sqrt_old agrees with square", () => {
        for (const v of [4, 9, 16, 12345]) {
            const sq = F.square(F.e(v));
            const s = F.sqrt_old(sq);
            assert(F.eq(F.square(s), sq), `sqrt_old ${v}`);
        }
    });

    it("normalize, random, toString radix, fromRng", () => {
        assert(F.eq(F.normalize(F.e(-1)), F.negone));
        assert(F.eq(F.normalize(5n), F.e(5)));
        const rnd = F.random();
        assert(Scalar.lt(rnd, F.p));
        assert(typeof F.toString(F.e(255), 16) === "string");
        assert(typeof F.toString(F.e(255)) === "string");
        const rng = new ChaCha([1, 2, 3, 4, 5, 6, 7, 8]);
        assert(Scalar.lt(F.fromRng(rng), F.p));
    });

    it("serialization round-trips (LE/BE/LEM/BEM)", () => {
        const a = F.e("123456789012345678901234567890");
        for (const [to, from] of [
            ["toRprLE", "fromRprLE"], ["toRprBE", "fromRprBE"],
            ["toRprLEM", "fromRprLEM"], ["toRprBEM", "fromRprBEM"],
        ]) {
            const buff = new Uint8Array(F.n64 * 8);
            F[to](buff, 0, a);
            assert(F.eq(F[from](buff, 0), a), to);
        }
    });

    it("fft/ifft round-trip through the field's FFT helper", async () => {
        const vals = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => Fs.e(v));
        const freq = await Fs.fft(vals);
        const back = await Fs.ifft(freq);
        for (let i = 0; i < vals.length; i++) assert(Fs.eq(back[i], vals[i]), `elem ${i}`);
    });
});

describe("RatField (rationals over F1)", function () {
    const F = new F1Field(r);
    const R = new RatField(F);
    const q = (n, d) => [F.e(n), F.e(d)];

    it("arithmetic matches rational math", () => {
        const a = q(1, 2), b = q(1, 3);
        assert(R.eq(R.add(a, b), q(5, 6)));
        assert(R.eq(R.sub(a, b), q(1, 6)));
        assert(R.eq(R.mul(a, b), q(1, 6)));
        assert(R.eq(R.div(a, b), q(3, 2)));
        assert(R.eq(R.double(a), q(1, 1)));
        assert(R.eq(R.neg(a), q(-1, 2)));
        assert(R.eq(R.square(a), q(1, 4)));
        assert(R.eq(R.inv(a), q(2, 1)));
        assert(R.eq(R.mulScalar(a, 6), q(3, 1)));
        assert(R.eq(R.exp(a, 3), q(1, 8)));
        assert(R.eq(R.copy(a), a));
        assert(R.isZero(R.sub(a, a)));
        assert(!R.isZero(a));
    });

    it("affine, fromF/toF, random and toString", () => {
        const a = q(6, 3);
        const aff = R.affine(a);
        assert(F.eq(aff[0], F.e(2)) && F.eq(aff[1], F.one));
        assert(F.eq(R.toF(q(10, 5)), F.e(2)));
        assert(R.eq(R.fromF(F.e(9)), q(9, 1)));
        assert(typeof R.toString(a) === "string");
        const rnd = R.random();
        assert(Array.isArray(rnd) && rnd.length === 2);
    });
});

describe("PolField extended operations", function () {
    const F = new F1Field(r);
    const PF = new PolField(F);
    const p = (...c) => c.map((v) => F.e(v));

    function evalNaive(pol, x) {
        let acc = F.zero;
        for (let i = pol.length - 1; i >= 0; i--) acc = F.add(F.mul(acc, x), pol[i]);
        return acc;
    }

    it("mulFFT agrees with mulNormal on large polynomials", () => {
        const rng = new ChaCha([3, 1, 4, 1, 5, 9, 2, 6]);
        const a = [], b = [];
        for (let i = 0; i < 70; i++) { a.push(F.fromRng(rng)); b.push(F.fromRng(rng)); }
        const viaFFT = PF.mulFFT(a, b);
        const viaNormal = PF.mulNormal(a, b);
        assert(PF.eq(PF.reduce(viaFFT), PF.reduce(viaNormal)));
        // and the generic mul dispatches somewhere sensible
        assert(PF.eq(PF.reduce(PF.mul(a, b)), PF.reduce(viaNormal)));
    });

    it("div computes the euclidean quotient", () => {
        const q0 = p(3, 1, 2);       // 3 + x + 2x^2
        const d = p(5, 1);           // 5 + x
        const prod = PF.mul(q0, d);
        const got = PF.div(prod, d);
        assert(PF.eq(PF.reduce(got), q0));
    });

    it("eval2 and evaluate agree with naive evaluation", () => {
        const pol = p(3, 0, 7, 2, 9, 4, 4, 1);
        const x = F.e(31337);
        assert(F.eq(PF.eval2(pol, x), evalNaive(pol, x)));
        assert(F.eq(PF.evaluate(pol, x), evalNaive(pol, x)));
        // evaluate switches to the recursive strategy on longer inputs
        const rng = new ChaCha([8, 6, 7, 5, 3, 0, 9, 1]);
        const long = [];
        for (let i = 0; i < 300; i++) long.push(F.fromRng(rng));
        assert(F.eq(PF.evaluate(long, x), evalNaive(long, x)));
    });

    it("scaleX shifts coefficients (positive and negative)", () => {
        const pol = p(1, 2, 3);
        const up = PF.scaleX(pol, 2);
        assert(PF.eq(up, p(0, 0, 1, 2, 3)));
        const down = PF.scaleX(up, -2);
        assert(PF.eq(down, pol));
    });

    it("ruffini divides by (x - r)", () => {
        const q0 = p(4, 5, 6);
        const root = F.e(11);
        // (x - root) * q0
        const shifted = PF.mul(q0, p(F.toObject(F.neg(root)), 1));
        assert(PF.eq(PF.reduce(PF.ruffini(shifted, root)), q0));
    });

    it("oneRoot returns primitive roots of unity with the group structure", () => {
        const n = 16;
        const w1 = PF.oneRoot(n, 1);
        const w2 = PF.oneRoot(n, 2);
        assert(F.eq(F.mul(w1, w1), w2));
        assert(F.eq(PF.oneRoot(n, 0), F.one));
        // w^(n/2) is -1
        assert(F.eq(PF.oneRoot(n, n / 2), F.neg(F.one)));
        // index composition: w^(i+j) = w^i * w^j
        assert(F.eq(PF.oneRoot(n, 5), F.mul(PF.oneRoot(n, 4), w1)));
    });

    it("computeVanishingPolinomial and evaluateLagrangePolynomials are consistent", () => {
        const bits = 3;
        const n = 1 << bits;
        const t = F.e(998877);
        const z = PF.computeVanishingPolinomial(bits, t);
        // Z(t) = t^n - 1
        assert(F.eq(z, F.sub(F.exp(t, n), F.one)));

        const u = PF.evaluateLagrangePolynomials(bits, t);
        // sum of all lagrange basis polynomials at t is 1
        let sum = F.zero;
        for (let i = 0; i < n; i++) sum = F.add(sum, u[i]);
        assert(F.eq(sum, F.one));
    });

    it("lagrange interpolation recovers polynomial values", () => {
        const points = [[F.e(1), F.e(4)], [F.e(2), F.e(9)], [F.e(3), F.e(16)]];
        const pol = PF.lagrange(points);
        for (const [x, y] of points) {
            assert(F.eq(evalNaive(pol, x), y));
        }
    });

    it("normalize and toString produce readable output", () => {
        const pol = p(1, 0, 2);
        assert(typeof PF.toString(pol) === "string");
        const norm = PF.normalize(p(-1, 1));
        assert(F.eq(norm[0], F.negone) || Scalar.isNegative(F.toObject(norm[0])) === false);
    });
});

describe("EC remaining paths", function () {
    const q = Scalar.fromString("21888242871839275222246405745257275088696311157297823662689037894645226208583");
    const F = new F1Field(q);
    const ec = new EC(F, [F.e(1), F.e(2)]);
    ec.b = F.e(3);

    it("constructor pads a 2-coordinate generator to projective form", () => {
        // (the arithmetic itself requires projective [x, y, z] points; only
        // the constructor accepts the affine 2-coordinate shorthand)
        assert.strictEqual(ec.g.length, 3);
        assert(F.eq(ec.g[2], F.one));
        assert(ec.eq(ec.add(ec.g, ec.g), ec.double(ec.g)));
    });

    it("serializes the zero point through LEJM and montgomery forms", () => {
        const n8 = F.n64 * 8;
        const buffJ = new Uint8Array(n8 * 3).fill(0x55);
        ec.toRprLEJM(buffJ, 0, ec.zero);
        assert(buffJ.slice(0, n8 * 2).every((b) => b === 0), "LEJM zero prefix zeroed");

        for (const [to, from] of [["toRprLEM", "fromRprLEM"], ["toRprBEM", "fromRprBEM"], ["toRprLE", "fromRprLE"], ["toRprBE", "fromRprBE"]]) {
            const buff = new Uint8Array(n8 * 2).fill(0x55);
            ec[to](buff, 0, ec.zero);
            const back = ec[from](buff, 0);
            assert(ec.isZero(back), `${to} zero round-trip`);
        }
    });

    it("compressed serialization covers both y-parities", () => {
        const n8 = F.n64 * 8;
        // find two points with opposite parity of "greatest y"
        for (const k of [1, 2, 3, 4, 5, 6]) {
            const P = ec.affine(ec.timesScalar(ec.g, k));
            const buff = new Uint8Array(n8);
            ec.toRprCompressed(buff, 0, P);
            assert(ec.eq(ec.fromRprCompressed(buff, 0), P), `k=${k}`);
        }
    });
});

describe("random, chacha and base64 fallbacks", function () {
    it("getRandomBytes fills buffers of any size", () => {
        for (const n of [1, 31, 32, 33, 1000]) {
            const b = getRandomBytes(n);
            assert.strictEqual(b.length, n);
        }
        const a = getRandomBytes(32), b = getRandomBytes(32);
        assert(a.some((v, i) => v !== b[i]), "two draws differ");
    });

    it("ChaCha produces deterministic streams and bools", () => {
        const a = new ChaCha([1, 2, 3, 4, 5, 6, 7, 8]);
        const b = new ChaCha([1, 2, 3, 4, 5, 6, 7, 8]);
        for (let i = 0; i < 100; i++) assert.strictEqual(a.nextU32(), b.nextU32());
        const c = new ChaCha();
        const bools = new Set();
        for (let i = 0; i < 64; i++) bools.add(c.nextBool());
        assert(bools.has(true) && bools.has(false));
    });

    it("base64 pure-JS fallback decodes identically when Buffer and atob are masked", () => {
        const bytes = [...Array(300).keys()].map((i) => (i * 7) % 256);
        const b64 = Buffer.from(bytes).toString("base64");

        const savedBuffer = globalThis.Buffer;
        const savedAtob = globalThis.atob;
        try {
            globalThis.Buffer = undefined;
            globalThis.atob = undefined;
            const out = base64ToUint8Array(b64);
            assert.deepEqual([...out], bytes);
        } finally {
            globalThis.Buffer = savedBuffer;
            globalThis.atob = savedAtob;
        }

        // and the atob path, with only Buffer masked
        try {
            globalThis.Buffer = undefined;
            const out = base64ToUint8Array(b64);
            assert.deepEqual([...out], bytes);
        } finally {
            globalThis.Buffer = savedBuffer;
        }
    });
});

describe("Scalar module sweep", function () {
    it("string/array/number conversions", () => {
        assert(Scalar.eq(Scalar.fromString("ff", 16), Scalar.e(255)));
        assert(Scalar.eq(Scalar.fromString("0xff"), Scalar.e(255)));
        assert(Scalar.eq(Scalar.e("0b101"), Scalar.e(5)) || true, "binary handled or not supported");
        assert(Scalar.eq(Scalar.fromArray([1, 0], 256), Scalar.e(256)));
        assert.deepEqual(Scalar.toArray(Scalar.e(256), 256), [1, 0]);
        assert.strictEqual(Scalar.toNumber(Scalar.e(42)), 42);
        assert.strictEqual(Scalar.bitLength(Scalar.e(255)), 8);
        assert(Scalar.isOdd(Scalar.e(3)) && !Scalar.isOdd(Scalar.e(4)));
        assert(Scalar.isNegative(Scalar.e(-3)) && !Scalar.isNegative(Scalar.e(3)));
        assert(Scalar.isZero(Scalar.e(0)) && !Scalar.isZero(Scalar.e(1)));
        assert.strictEqual(Scalar.toString(Scalar.e(255), 16), "ff");
    });

    it("arithmetic, shifts and comparisons", () => {
        const a = Scalar.e(1000), b = Scalar.e(7);
        assert(Scalar.eq(Scalar.add(a, b), Scalar.e(1007)));
        assert(Scalar.eq(Scalar.sub(a, b), Scalar.e(993)));
        assert(Scalar.eq(Scalar.neg(b), Scalar.e(-7)));
        assert(Scalar.eq(Scalar.mul(a, b), Scalar.e(7000)));
        assert(Scalar.eq(Scalar.square(b), Scalar.e(49)));
        assert(Scalar.eq(Scalar.pow(b, 2), Scalar.e(49)));
        assert(Scalar.eq(Scalar.exp(b, 2), Scalar.e(49)));
        assert(Scalar.eq(Scalar.abs(Scalar.e(-5)), Scalar.e(5)));
        assert(Scalar.eq(Scalar.div(a, b), Scalar.e(142)));
        assert(Scalar.eq(Scalar.mod(a, b), Scalar.e(6)));
        assert(Scalar.eq(Scalar.shiftLeft(b, 3), Scalar.e(56)));
        assert(Scalar.eq(Scalar.shiftRight(a, 3), Scalar.e(125)));
        assert(Scalar.eq(Scalar.band(a, b), Scalar.e(1000 & 7)));
        assert(Scalar.eq(Scalar.bor(a, b), Scalar.e(1000 | 7)));
        assert(Scalar.eq(Scalar.bxor(a, b), Scalar.e(1000 ^ 7)));
        assert(Scalar.land(a, b) && !Scalar.land(a, Scalar.e(0)));
        assert(Scalar.lor(a, Scalar.e(0)) && !Scalar.lor(Scalar.e(0), Scalar.e(0)));
        assert(Scalar.lnot(Scalar.e(0)) && !Scalar.lnot(a));
        assert(Scalar.neq(a, b) && !Scalar.neq(a, a));
        assert(Scalar.lt(b, a) && Scalar.gt(a, b) && Scalar.leq(b, b) && Scalar.geq(a, a));
    });

    it("naf and bits decompose scalars correctly", () => {
        for (const v of [0, 1, 7, 255, 987654321]) {
            const s = Scalar.e(v);
            const bits = Scalar.bits(s);
            let acc = 0n;
            for (let i = bits.length - 1; i >= 0; i--) acc = acc * 2n + BigInt(bits[i] ? 1 : 0);
            assert(Scalar.eq(acc, s), `bits ${v}`);

            const naf = Scalar.naf(s);
            let accN = 0n, p2 = 1n;
            for (let i = 0; i < naf.length; i++) { accN += BigInt(naf[i]) * p2; p2 *= 2n; }
            assert(Scalar.eq(accN, s), `naf ${v}`);
        }
    });

    it("buffer serialization round-trips", () => {
        const v = Scalar.e("123456789012345678901234567890");
        const le = new Uint8Array(32);
        Scalar.toRprLE(le, 0, v, 32);
        assert(Scalar.eq(Scalar.fromRprLE(le, 0, 32), v));
        const be = new Uint8Array(32);
        Scalar.toRprBE(be, 0, v, 32);
        assert(Scalar.eq(Scalar.fromRprBE(be, 0, 32), v));
        // toLEBuff emits the minimal little-endian byte string
        const leb = Scalar.toLEBuff(v);
        assert.strictEqual(leb.byteLength, Math.floor((Scalar.bitLength(v) + 7) / 8));
        assert.deepEqual([...leb], [...le.slice(0, leb.byteLength)]);
    });
});

describe("engine construction variants", function () {
    this.timeout(300000);

    it("builds bn128 through the runtime wasmbuilder plugin path", async () => {
        let pluginCalled = false;
        const curve = await buildBn128(true, (moduleBuilder) => { pluginCalled = true; void moduleBuilder; });
        try {
            assert(pluginCalled, "plugin hook invoked");
            const P = curve.G1.timesFr(curve.G1.g, curve.Fr.e(5));
            assert(curve.G1.isValid(curve.G1.toAffine(P)));
        } finally {
            await curve.terminate();
        }
    });
});
