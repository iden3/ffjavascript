import * as chai from "chai";
import buildBn128 from "../src/bn128.js";
import buildBls12381 from "../src/bls12381.js";

const assert = chai.assert;

// isValid() has zero test coverage anywhere else in this repo, yet it is the
// function that guards against an off-curve/invalid-curve point sneaking in
// from untrusted, deserialized input (a proof, a verification key). This
// covers both curves, both groups, and both valid and deliberately corrupted
// points.
describe("curve point validation (isValid)", function () {
    this.timeout(60000);

    const curves = [];

    before(async () => {
        curves.push({ name: "bn128", curve: await buildBn128() });
        curves.push({ name: "bls12381", curve: await buildBls12381() });
    });

    after(async () => {
        for (const { curve } of curves) await curve.terminate();
    });

    function corruptPoint(G, P) {
        // Flip a byte of the x coordinate (first limb) -- moves the point
        // off the curve for essentially any nonzero point.
        const bad = new Uint8Array(P);
        bad[0] ^= 0xFF;
        return bad;
    }

    it("accepts the group identity for G1 and G2 on both curves", () => {
        for (const { curve } of curves) {
            assert(curve.G1.isValid(curve.G1.zero));
            assert(curve.G2.isValid(curve.G2.zero));
        }
    });

    it("accepts the generator for G1 and G2 on both curves", () => {
        for (const { curve } of curves) {
            assert(curve.G1.isValid(curve.G1.g));
            assert(curve.G2.isValid(curve.G2.g));
        }
    });

    it("accepts an arbitrary scalar multiple of the generator", () => {
        for (const { curve } of curves) {
            const k = curve.Fr.e(123456789);
            assert(curve.G1.isValid(curve.G1.timesFr(curve.G1.g, k)));
            assert(curve.G2.isValid(curve.G2.timesFr(curve.G2.g, k)));
        }
    });

    it("rejects a point with a corrupted (off-curve) x coordinate", () => {
        for (const { curve } of curves) {
            const k = curve.Fr.e(42);
            const P1 = curve.G1.timesFr(curve.G1.g, k);
            const P2 = curve.G2.timesFr(curve.G2.g, k);
            assert.isFalse(curve.G1.isValid(corruptPoint(curve.G1, P1)));
            assert.isFalse(curve.G2.isValid(corruptPoint(curve.G2, P2)));
        }
    });
});
