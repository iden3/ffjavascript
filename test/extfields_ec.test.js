import * as chai from "chai";
import * as Scalar from "../src/scalar.js";
import buildBn128 from "../src/bn128.js";
import F1Field from "../src/f1field.js";
import F2Field from "../src/f2field.js";
import F3Field from "../src/f3field.js";
import EC from "../src/ec.js";
import ChaCha from "../src/chacha.js";

const assert = chai.assert;

// bn128 base field prime
const q = Scalar.fromString("21888242871839275222246405745257275088696311157297823662689037894645226208583");

function checkFieldAxioms(F, sample) {
    const a = sample(), b = sample(), c = sample();

    assert(F.eq(F.add(a, b), F.add(b, a)), "add commutes");
    assert(F.eq(F.mul(a, b), F.mul(b, a)), "mul commutes");
    assert(F.eq(F.add(F.add(a, b), c), F.add(a, F.add(b, c))), "add associates");
    assert(F.eq(F.mul(F.mul(a, b), c), F.mul(a, F.mul(b, c))), "mul associates");
    assert(F.eq(F.mul(a, F.add(b, c)), F.add(F.mul(a, b), F.mul(a, c))), "distributes");
    assert(F.eq(F.sub(a, b), F.neg(F.sub(b, a))), "sub/neg consistent");
    assert(F.eq(F.double(a), F.add(a, a)), "double");
    assert(F.eq(F.square(a), F.mul(a, a)), "square");
    assert(F.isZero(F.sub(a, a)), "a-a is zero");
    if (!F.isZero(a)) {
        assert(F.eq(F.mul(a, F.inv(a)), F.one), "a * a^-1 = 1");
        assert(F.eq(F.div(b, a), F.mul(b, F.inv(a))), "div = mul inv");
    }
    assert(F.eq(F.mulScalar(a, 3), F.add(F.add(a, a), a)), "mulScalar");
    assert(F.eq(F.exp(a, 5), F.mul(F.square(F.square(a)), a)), "exp 5");
    assert(F.neq(a, F.add(a, F.one)), "neq");
}

describe("F2Field", function () {
    this.timeout(60000);

    // bn128's Fq2: nonResidue = -1
    const F1 = new F1Field(q);
    const F2 = new F2Field(F1, F1.negone);
    const rng = new ChaCha([1, 2, 3, 4, 5, 6, 7, 8]);
    const sample = () => F2.fromRng(rng);

    it("satisfies the field axioms", () => {
        for (let i = 0; i < 5; i++) checkFieldAxioms(F2, sample);
    });

    it("copy, conjugate and pow behave", () => {
        const a = sample();
        const ca = F2.copy(a);
        assert(F2.eq(ca, a));

        // conj(a) * a = norm(a), an element with zero imaginary part
        const n = F2.mul(a, F2.conjugate(a));
        assert(F1.isZero(n[1]), "norm is in the base field");

        assert(F2.eq(F2.pow(a, 3), F2.mul(F2.square(a), a)));
    });

    it("orders elements consistently (gt/lt/geq/leq)", () => {
        const a = sample();
        const b = F2.add(a, F2.one);
        assert.strictEqual(F2.gt(a, a), false);
        assert.strictEqual(F2.geq(a, a), true);
        assert.strictEqual(F2.leq(a, a), true);
        assert.strictEqual(F2.lt(a, b) || F2.gt(a, b), true);
        assert.strictEqual(F2.lt(a, b), !F2.geq(a, b));
    });

    it("random and toString produce usable values", () => {
        const r = F2.random();
        assert(Array.isArray(r) && r.length === 2);
        assert(typeof F2.toString(sample()) === "string");
    });

    it("serializes through LE/BE/LEM/BEM round-trips", () => {
        const a = sample();
        const n8 = F1.n64 * 8 * 2;
        for (const [to, from] of [
            ["toRprLE", "fromRprLE"], ["toRprBE", "fromRprBE"],
            ["toRprLEM", "fromRprLEM"], ["toRprBEM", "fromRprBEM"],
        ]) {
            const buff = new Uint8Array(n8);
            F2[to](buff, 0, a);
            assert(F2.eq(F2[from](buff, 0), a), to);
        }
    });

    it("computes square roots (alg9, q % 4 == 3 tower)", () => {
        const a = sample();
        const sq = F2.square(a);
        const s = F2.sqrt(sq);
        assert(s !== null);
        assert(F2.eq(F2.square(s), sq));
    });

    it("alg10 (p % 4 == 1 tower) is an unimplemented stub that throws", () => {
        const F17 = new F1Field(Scalar.e(17));
        // 3 is not a quadratic residue mod 17
        const F289 = new F2Field(F17, F17.e(3));
        const a = F289.square(F289.fromRng(new ChaCha([9, 8, 7, 6, 5, 4, 3, 2])));
        assert.throws(() => F289.sqrt(a), /Sqrt alg 10 not implemented/);
    });
});

describe("F3Field", function () {
    this.timeout(60000);

    // 2 is not a cube mod 7 (cubes mod 7 are {1, 6})
    const F1 = new F1Field(Scalar.e(7));
    const F3 = new F3Field(F1, F1.e(2));
    const rng = new ChaCha([2, 4, 6, 8, 10, 12, 14, 16]);
    const sample = () => F3.fromRng(rng);

    it("satisfies the field axioms", () => {
        for (let i = 0; i < 10; i++) checkFieldAxioms(F3, sample);
    });

    it("orders, copies and stringifies", () => {
        const a = sample();
        assert(F3.eq(F3.copy(a), a));
        assert.strictEqual(F3.geq(a, a), true);
        assert.strictEqual(F3.leq(a, a), true);
        assert.strictEqual(F3.gt(a, a), false);
        assert.strictEqual(F3.lt(a, a), false);
        assert(typeof F3.toString(a) === "string");
        const r = F3.random();
        assert(Array.isArray(r) && r.length === 3);
    });

    it("serializes through LE/BE/LEM/BEM round-trips", () => {
        const a = sample();
        const n8 = F1.n64 * 8 * 3;
        for (const [to, from] of [
            ["toRprLE", "fromRprLE"], ["toRprBE", "fromRprBE"],
            ["toRprLEM", "fromRprLEM"], ["toRprBEM", "fromRprBEM"],
        ]) {
            const buff = new Uint8Array(n8);
            F3[to](buff, 0, a);
            assert(F3.eq(F3[from](buff, 0), a), to);
        }
    });
});

describe("EC (pure JS curve) vs the wasm bn128 oracle", function () {
    this.timeout(120000);

    let bn128;
    const F = new F1Field(q);
    const ec = new EC(F, [F.e(1), F.e(2)]);
    ec.b = F.e(3); // y^2 = x^3 + 3, needed by fromRng

    before(async () => {
        bn128 = await buildBn128(true);
    });
    after(async () => {
        bn128.terminate();
    });

    function oracleAffine(k) {
        const P = bn128.G1.timesScalar(bn128.G1.g, Scalar.e(k));
        return bn128.G1.toObject(bn128.G1.toAffine(P)); // [x, y, 1n]
    }

    function ecAffine(p) {
        const a = ec.affine(p);
        return [a[0], a[1]];
    }

    it("matches wasm scalar multiplication for assorted scalars", () => {
        for (const k of [1, 2, 3, 7, 1234567, "18318288193812091"]) {
            const expected = oracleAffine(k);
            const got = ecAffine(ec.mulScalar(ec.g, Scalar.e(k)));
            assert(F.eq(got[0], expected[0]) && F.eq(got[1], expected[1]), `k=${k}`);
        }
    });

    it("group laws: add/double/neg/sub/eq/isZero", () => {
        const g = ec.g;
        const g2 = ec.double(g);
        const g3 = ec.add(g2, g);

        assert(ec.eq(ec.add(g, g), g2));
        assert(ec.eq(ec.timesScalar(g, 3), g3));
        assert(ec.eq(ec.sub(g3, g), g2));
        assert(ec.isZero(ec.sub(g, g)));
        assert(ec.isZero(ec.add(g, ec.neg(g))));
        assert(!ec.eq(g, g2));
        // adding zero is identity
        assert(ec.eq(ec.add(g, ec.zero), g));
        assert(ec.eq(ec.add(ec.zero, g), g));
        assert(ec.eq(ec.double(ec.zero), ec.zero));
        assert(ec.isZero(ec.affine(ec.zero)) || ec.eq(ec.affine(ec.zero), ec.zero));
        assert(typeof ec.toString(g) === "string");
    });

    it("multiAffine normalizes a batch to the same coordinates as affine", () => {
        const pts = [ec.g, ec.double(ec.g), ec.timesScalar(ec.g, 5), ec.zero];
        const single = pts.map((p) => ec.affine(p));
        const batch = pts.map((p) => [p[0], p[1], p[2]]);
        ec.multiAffine(batch);
        for (let i = 0; i < pts.length; i++) {
            assert(ec.eq(batch[i], single[i]), `point ${i}`);
        }
    });

    it("serializes through every representation round-trip", () => {
        const p = ec.affine(ec.timesScalar(ec.g, 98765));
        const n8 = F.n64 * 8 * 2;
        for (const [to, from] of [
            ["toRprLE", "fromRprLE"], ["toRprBE", "fromRprBE"],
            ["toRprLEM", "fromRprLEM"],
            ["toRprBEM", "fromRprBEM"],
            ["toRprUncompressed", "fromRprUncompressed"],
        ]) {
            const buff = new Uint8Array(n8);
            ec[to](buff, 0, p);
            assert(ec.eq(ec[from](buff, 0), p), to);
        }

        // LEJM carries three montgomery coordinates (x, y, z)
        const buffJ = new Uint8Array((n8 / 2) * 3);
        ec.toRprLEJM(buffJ, 0, p);
        assert(ec.eq(ec.fromRprLEJM(buffJ, 0), p), "LEJM");

        const buffC = new Uint8Array(n8 / 2);
        ec.toRprCompressed(buffC, 0, p);
        assert(ec.eq(ec.fromRprCompressed(buffC, 0), p), "compressed");
    });

    it("serializes the zero point as zero-filled bytes (regression: the fill went to a copy)", () => {
        const n8x2 = F.n64 * 8 * 2;
        for (const to of ["toRprLE", "toRprBE", "toRprLEM", "toRprBEM"]) {
            const buff = new Uint8Array(n8x2).fill(0xAA);
            ec[to](buff, 0, ec.zero);
            assert(buff.every((b) => b === 0), `${to} zero point must zero the buffer`);
        }
        // and through a subarray view with a nonzero byteOffset
        const backing = new Uint8Array(n8x2 + 16).fill(0xAA);
        ec.toRprLE(backing.subarray(16), 0, ec.zero);
        assert(backing.subarray(16).every((b) => b === 0));
        assert(backing.subarray(0, 16).every((b) => b === 0xAA), "bytes before the view untouched");
    });

    it("reads the zero point back from every serialized form", () => {
        const n8 = F.n64 * 8;
        for (const [to, from, size] of [
            ["toRprLEM", "fromRprLEM", 2], ["toRprBEM", "fromRprBEM", 2],
            ["toRprLEJM", "fromRprLEJM", 3],
            ["toRprUncompressed", "fromRprUncompressed", 2],
        ]) {
            const buff = new Uint8Array(n8 * size);
            ec[to](buff, 0, ec.zero);
            assert(ec.isZero(ec[from](buff, 0)), `${from} of zero`);
        }
        const buffC = new Uint8Array(n8);
        ec.toRprCompressed(buffC, 0, ec.zero);
        assert(ec.isZero(ec.fromRprCompressed(buffC, 0)), "compressed zero");
    });

    it("fromRng samples valid curve points", () => {
        const rng = new ChaCha([11, 22, 33, 44, 55, 66, 77, 88]);
        for (let i = 0; i < 3; i++) {
            const p = ec.fromRng(rng);
            // on curve: y^2 = x^3 + 3
            const y2 = F.square(p[1]);
            const x3b = F.add(F.mul(F.square(p[0]), p[0]), F.e(3));
            assert(F.eq(y2, x3b), `point ${i} on curve`);
        }
    });
});

describe("fsqrt algorithm selection by prime shape", function () {
    const cases = [
        ["shanks (p % 4 == 3)", 7],
        ["tonelli-shanks (p % 16 == 1)", 17],
    ];

    for (const [name, p] of cases) {
        it(`computes square roots with ${name}, p=${p}`, () => {
            const F = new F1Field(Scalar.e(p));
            let squares = 0, nonSquares = 0;
            for (let x = 1; x < p; x++) {
                const sq = F.e(x);
                const s = F.sqrt(sq);
                if (s === null) {
                    nonSquares++;
                    // Euler's criterion confirms it is a non-residue
                    assert(!F.eq(F.pow(sq, (BigInt(p) - 1n) / 2n), F.one), `x=${x} wrongly rejected`);
                } else {
                    squares++;
                    assert(F.eq(F.square(s), sq), `sqrt(${x})^2 == ${x}`);
                }
            }
            // exactly (p-1)/2 squares among nonzero elements
            assert.strictEqual(squares, (p - 1) / 2);
            assert.strictEqual(nonSquares, (p - 1) / 2);
        });
    }

    it("atkin (p % 8 == 5) and kong (p % 16 == 9) are unimplemented stubs that throw", () => {
        const F13 = new F1Field(Scalar.e(13));
        assert.throws(() => F13.sqrt(F13.e(4)), /Sqrt alg 3 not implemented/);
        const F41 = new F1Field(Scalar.e(41));
        assert.throws(() => F41.sqrt(F41.e(4)), /Sqrt alg 4 not implemented/);
    });

    it("sqrt of zero is zero and sqrt on bn128's Fr (2-adicity 28) works", () => {
        const F = new F1Field(Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617"));
        assert(F.eq(F.sqrt(F.zero), F.zero));
        const a = F.e(12345);
        const s = F.sqrt(F.square(a));
        assert(F.eq(F.square(s), F.square(a)));
    });
});
