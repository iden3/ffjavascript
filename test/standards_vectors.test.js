import * as chai from "chai";
import buildBn128 from "../src/bn128.js";
import buildBls12381 from "../src/bls12381.js";
import * as Scalar from "../src/scalar.js";
import ChaCha from "../src/chacha.js";

const assert = chai.assert;

// Cross-validation against external references:
//  - ChaCha against RFC 8439 (the block function is standard ChaCha20)
//  - BLS12-381 parameters against the IETF CFRG pairing-friendly-curves draft
//  - bn254/bls12-381 group arithmetic against an independent affine
//    reference implementation written here in raw BigInt math (the same
//    role arkworks/gnark vectors would play: an implementation that shares
//    no code with the wasm under test). Every embedded constant is first
//    self-validated (curve equation, subgroup order) before being compared
//    to the library, so a mistyped vector fails loudly as inconsistent
//    rather than silently blessing the implementation.

// ---------- independent affine EC reference over a generic field ----------

function makeFp(p) {
    const mod = (a) => ((a % p) + p) % p;
    const F = {
        add: (a, b) => mod(a + b),
        sub: (a, b) => mod(a - b),
        mul: (a, b) => mod(a * b),
        neg: (a) => mod(-a),
        eq: (a, b) => mod(a) === mod(b),
        isZero: (a) => mod(a) === 0n,
        e: (a) => mod(a),
    };
    F.exp = (a, e) => {
        let res = 1n, base = mod(a);
        while (e > 0n) {
            if (e & 1n) res = F.mul(res, base);
            base = F.mul(base, base);
            e >>= 1n;
        }
        return res;
    };
    F.inv = (a) => F.exp(a, p - 2n);
    return F;
}

function makeFp2(Fp, nonResidue) {
    // elements are [c0, c1] representing c0 + c1*u with u^2 = nonResidue
    const F = {
        add: (a, b) => [Fp.add(a[0], b[0]), Fp.add(a[1], b[1])],
        sub: (a, b) => [Fp.sub(a[0], b[0]), Fp.sub(a[1], b[1])],
        neg: (a) => [Fp.neg(a[0]), Fp.neg(a[1])],
        eq: (a, b) => Fp.eq(a[0], b[0]) && Fp.eq(a[1], b[1]),
        isZero: (a) => Fp.isZero(a[0]) && Fp.isZero(a[1]),
        e: (a) => [Fp.e(a[0]), Fp.e(a[1])],
        mul: (a, b) => [
            Fp.add(Fp.mul(a[0], b[0]), Fp.mul(nonResidue, Fp.mul(a[1], b[1]))),
            Fp.add(Fp.mul(a[0], b[1]), Fp.mul(a[1], b[0])),
        ],
    };
    F.square = (a) => F.mul(a, a);
    F.inv = (a) => {
        // 1/(c0 + c1 u) = (c0 - c1 u) / (c0^2 - nr*c1^2)
        const t = Fp.inv(Fp.sub(Fp.mul(a[0], a[0]), Fp.mul(nonResidue, Fp.mul(a[1], a[1]))));
        return [Fp.mul(a[0], t), Fp.neg(Fp.mul(a[1], t))];
    };
    F.mulScalar = (a, k) => [Fp.mul(a[0], k), Fp.mul(a[1], k)];
    return F;
}

// affine short-Weierstrass y^2 = x^3 + b over any of the field objects above
function makeCurve(F, b) {
    const C = {};
    C.isOnCurve = ([x, y]) => {
        const y2 = F.mul(y, y);
        const rhs = F.add(F.mul(F.mul(x, x), x), b);
        return F.eq(y2, rhs);
    };
    C.double = (P) => {
        if (P === null) return null;
        const [x, y] = P;
        if (F.isZero(y)) return null;
        // lambda = 3x^2 / 2y
        const num = F.mulScalar ? F.mulScalar(F.mul(x, x), 3n) : F.mul(F.e(3n), F.mul(x, x));
        const den = F.mulScalar ? F.mulScalar(y, 2n) : F.mul(F.e(2n), y);
        const l = F.mul(num, F.inv(den));
        const x3 = F.sub(F.sub(F.mul(l, l), x), x);
        const y3 = F.sub(F.mul(l, F.sub(x, x3)), y);
        return [x3, y3];
    };
    C.add = (P, Q) => {
        if (P === null) return Q;
        if (Q === null) return P;
        const [x1, y1] = P, [x2, y2] = Q;
        if (F.eq(x1, x2)) {
            if (F.eq(y1, y2)) return C.double(P);
            return null; // P + (-P)
        }
        const l = F.mul(F.sub(y2, y1), F.inv(F.sub(x2, x1)));
        const x3 = F.sub(F.sub(F.mul(l, l), x1), x2);
        const y3 = F.sub(F.mul(l, F.sub(x1, x3)), y1);
        return [x3, y3];
    };
    C.mul = (P, k) => {
        let res = null, base = P;
        while (k > 0n) {
            if (k & 1n) res = C.add(res, base);
            base = C.double(base);
            k >>= 1n;
        }
        return res;
    };
    return C;
}

// scalar test set: small, structured and large values
const SCALARS = [1n, 2n, 3n, 5n, 7n, 31337n, 0x1234567890abcdef1234567890abcdefn];

describe("RFC 8439: the ChaCha rng is standard ChaCha20", function () {
    it("quarter round matches the RFC 8439 §2.1.1 test vector", () => {
        // reimplement the quarter round independently from the RFC pseudocode
        const rotl = (v, n) => ((v << n) | (v >>> (32 - n))) >>> 0;
        const st = new Uint32Array([0x11111111, 0x01020304, 0x9b8d6f43, 0x01234567]);
        const qr = (s, a, b, c, d) => {
            s[a] = (s[a] + s[b]) >>> 0; s[d] = rotl((s[d] ^ s[a]) >>> 0, 16);
            s[c] = (s[c] + s[d]) >>> 0; s[b] = rotl((s[b] ^ s[c]) >>> 0, 12);
            s[a] = (s[a] + s[b]) >>> 0; s[d] = rotl((s[d] ^ s[a]) >>> 0, 8);
            s[c] = (s[c] + s[d]) >>> 0; s[b] = rotl((s[b] ^ s[c]) >>> 0, 7);
        };
        qr(st, 0, 1, 2, 3);
        assert.deepEqual([...st].map((v) => v >>> 0),
            [0xea2a92f4, 0xcb1cf8ce, 0x4581472e, 0x5881c4bb]);
    });

    it("block function matches an independent RFC implementation on the §2.3.2 state", () => {
        // reference ChaCha20 block written from the RFC pseudocode
        const rotl = (v, n) => ((v << n) | (v >>> (32 - n))) >>> 0;
        function refBlock(state16) {
            const w = Uint32Array.from(state16);
            const qr = (s, a, b, c, d) => {
                s[a] = (s[a] + s[b]) >>> 0; s[d] = rotl((s[d] ^ s[a]) >>> 0, 16);
                s[c] = (s[c] + s[d]) >>> 0; s[b] = rotl((s[b] ^ s[c]) >>> 0, 12);
                s[a] = (s[a] + s[b]) >>> 0; s[d] = rotl((s[d] ^ s[a]) >>> 0, 8);
                s[c] = (s[c] + s[d]) >>> 0; s[b] = rotl((s[b] ^ s[c]) >>> 0, 7);
            };
            for (let i = 0; i < 10; i++) {
                qr(w, 0, 4, 8, 12); qr(w, 1, 5, 9, 13); qr(w, 2, 6, 10, 14); qr(w, 3, 7, 11, 15);
                qr(w, 0, 5, 10, 15); qr(w, 1, 6, 11, 12); qr(w, 2, 7, 8, 13); qr(w, 3, 4, 9, 14);
            }
            return [...w].map((v, i) => (v + state16[i]) >>> 0);
        }

        // RFC 8439 §2.3.2: key 00 01 .. 1f, counter 1, nonce 000000090000004a00000000
        const key = [0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c,
            0x13121110, 0x17161514, 0x1b1a1918, 0x1f1e1d1c];
        const rng = new ChaCha(key);
        rng.state[12] = 1;
        rng.state[13] = 0x09000000;
        rng.state[14] = 0x4a000000;
        rng.state[15] = 0x00000000;

        const expected = refBlock(rng.state);
        const got = [];
        for (let i = 0; i < 16; i++) got.push(rng.nextU32() >>> 0);
        assert.deepEqual(got, expected);

        // anchor from the RFC's printed keystream block: first word e4e7f110
        assert.strictEqual(got[0], 0xe4e7f110);
    });
});

describe("bn254 group arithmetic vs an independent BigInt reference", function () {
    this.timeout(300000);

    const q = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;
    const r = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

    let curve;
    before(async () => { curve = await buildBn128(); });
    after(async () => { await curve.terminate(); });

    it("G1 scalar multiples match the affine reference implementation", () => {
        const Fp = makeFp(q);
        const E = makeCurve(Fp, 3n);
        const G = [1n, 2n];
        assert(E.isOnCurve(G), "reference generator on curve");

        for (const k of [...SCALARS, r - 1n]) {
            const ref = E.mul(G, k);
            const got = curve.G1.toObject(curve.G1.toAffine(curve.G1.timesScalar(curve.G1.g, k)));
            assert.strictEqual(got[0], ref[0], `k=${k} x`);
            assert.strictEqual(got[1], ref[1], `k=${k} y`);
        }

        // the subgroup order annihilates the generator
        assert(curve.G1.isZero(curve.G1.timesScalar(curve.G1.g, r)));
    });

    it("G2 scalar multiples match the affine reference over Fp2", () => {
        const Fp = makeFp(q);
        const F2 = makeFp2(Fp, Fp.neg(1n)); // u^2 = -1
        // twist: y^2 = x^3 + 3/(9+u), derived here rather than embedded
        const b2 = F2.mul(F2.e([3n, 0n]), F2.inv(F2.e([9n, 1n])));
        const E2 = makeCurve(F2, b2);

        const gObj = curve.G2.toObject(curve.G2.toAffine(curve.G2.g));
        const G = [[gObj[0][0], gObj[0][1]], [gObj[1][0], gObj[1][1]]];
        assert(E2.isOnCurve(G), "library G2 generator satisfies the twist equation independently");

        for (const k of SCALARS) {
            const ref = E2.mul(G, k);
            const got = curve.G2.toObject(curve.G2.toAffine(curve.G2.timesScalar(curve.G2.g, k)));
            assert.deepEqual(got[0], ref[0], `k=${k} x`);
            assert.deepEqual(got[1], ref[1], `k=${k} y`);
        }

        assert(curve.G2.isZero(curve.G2.timesScalar(curve.G2.g, r)));
    });

    it("wasm field arithmetic matches BigInt modular arithmetic", () => {
        const Fr = curve.Fr;
        const mod = (a, p) => ((a % p) + p) % p;
        const powm = (a, e, p) => {
            let res = 1n, b = mod(a, p);
            while (e > 0n) { if (e & 1n) res = (res * b) % p; b = (b * b) % p; e >>= 1n; }
            return res;
        };

        const a = 0x1234567890abcdef1234567890abcdef1234567890abcdefn;
        const b = 0xfedcba0987654321fedcba0987654321fedcba0987654321n;

        assert.strictEqual(Fr.toObject(Fr.mul(Fr.e(a), Fr.e(b))), mod(a * b, r));
        assert.strictEqual(Fr.toObject(Fr.add(Fr.e(a), Fr.e(b))), mod(a + b, r));
        assert.strictEqual(Fr.toObject(Fr.sub(Fr.e(a), Fr.e(b))), mod(a - b, r));
        assert.strictEqual(Fr.toObject(Fr.inv(Fr.e(a))), powm(a, r - 2n, r));
        assert.strictEqual(Fr.toObject(Fr.exp(Fr.e(a), Scalar.e(65537))), powm(a, 65537n, r));

        const F1 = curve.F1;
        assert.strictEqual(F1.toObject(F1.mul(F1.e(a), F1.e(b))), mod(a * b, q));
        assert.strictEqual(F1.toObject(F1.inv(F1.e(a))), powm(a, q - 2n, q));
    });
});

describe("BLS12-381 parameters vs the IETF CFRG pairing-friendly-curves draft", function () {
    this.timeout(600000);

    // Draft-irtf-cfrg-pairing-friendly-curves §4.2.1 (also the zkcrypto spec)
    const p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
    const rOrder = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
    const g1x = 0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bbn;
    const g1y = 0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1n;

    let curve;
    before(async () => { curve = await buildBls12381(true); });
    after(async () => { await curve.terminate(); });

    it("field modulus and group order match the draft", () => {
        assert.strictEqual(curve.q, p);
        assert.strictEqual(curve.r, rOrder);
    });

    it("the G1 generator matches the draft's coordinates (self-validated on-curve)", () => {
        // first prove the embedded constants are internally consistent:
        // y^2 = x^3 + 4 over Fp
        const Fp = makeFp(p);
        const E = makeCurve(Fp, 4n);
        assert(E.isOnCurve([g1x, g1y]), "draft coordinates satisfy the curve equation");

        const g = curve.G1.toObject(curve.G1.toAffine(curve.G1.g));
        assert.strictEqual(g[0], g1x, "generator x");
        assert.strictEqual(g[1], g1y, "generator y");

        assert(curve.G1.isZero(curve.G1.timesScalar(curve.G1.g, rOrder)), "r annihilates G1");
    });

    it("G1 scalar multiples match the affine reference implementation", () => {
        const Fp = makeFp(p);
        const E = makeCurve(Fp, 4n);
        const G = [g1x, g1y];
        for (const k of SCALARS) {
            const ref = E.mul(G, k);
            const got = curve.G1.toObject(curve.G1.toAffine(curve.G1.timesScalar(curve.G1.g, k)));
            assert.strictEqual(got[0], ref[0], `k=${k} x`);
            assert.strictEqual(got[1], ref[1], `k=${k} y`);
        }
    });

    it("the G2 generator satisfies the twist equation and r annihilates it", () => {
        const Fp = makeFp(p);
        const F2 = makeFp2(Fp, Fp.neg(1n)); // u^2 = -1
        // M-twist: y^2 = x^3 + 4(u+1)
        const b2 = F2.e([4n, 4n]);
        const E2 = makeCurve(F2, b2);

        const gObj = curve.G2.toObject(curve.G2.toAffine(curve.G2.g));
        const G = [[gObj[0][0], gObj[0][1]], [gObj[1][0], gObj[1][1]]];
        assert(E2.isOnCurve(G), "G2 generator on the twist");

        for (const k of SCALARS.slice(0, 4)) {
            const ref = E2.mul(G, k);
            const got = curve.G2.toObject(curve.G2.toAffine(curve.G2.timesScalar(curve.G2.g, k)));
            assert.deepEqual(got[0], ref[0], `k=${k} x`);
            assert.deepEqual(got[1], ref[1], `k=${k} y`);
        }

        assert(curve.G2.isZero(curve.G2.timesScalar(curve.G2.g, rOrder)), "r annihilates G2");
    });

    it("pairing is bilinear and nondegenerate (mathematical invariants)", async () => {
        const { G1, G2, Fr, Gt } = curve;
        const a = Fr.e(6), b = Fr.e(7);
        const lhs = curve.pairing(G1.timesFr(G1.g, a), G2.timesFr(G2.g, b));
        const rhs = curve.pairing(G1.timesFr(G1.g, Fr.mul(a, b)), G2.g);
        assert(Gt.eq(lhs, rhs), "e(aG1, bG2) == e(abG1, G2)");
        assert(!Gt.eq(lhs, Gt.one), "nondegenerate");
    });
});
