import assert from "assert";
import F1Field from "../src/f1field.js";
import * as Scalar from "../src/scalar.js";

// Regression for the random-hang bug: the Tonelli-Shanks init searched for a
// quadratic non-residue with `while (c0 != 1)`, which also accepted the
// degenerate draw c = 0 (c0 = 0), leaving sqrt_z = 0 -- the next sqrt() that
// entered the correction loop then spun forever. On F(17) that draw happens
// with probability 1/17 per field construction, which is exactly the rate at
// which the whole suite (and CI) used to hang. Constructing the field many
// times makes a regression show up as a fast assertion failure, never a hang.
// (Runner-agnostic file: plain describe/it + node assert, no hooks.)

describe("fsqrt tonelli-shanks initialization", function () {
    it("never accepts a degenerate non-residue candidate (z != 0, z^t == -1)", () => {
        for (let i = 0; i < 300; i++) {
            const F = new F1Field(Scalar.e(17));
            assert(!F.isZero(F.sqrt_z), `construction ${i}: sqrt_z is zero`);
            const c0 = F.pow(F.sqrt_z, 2 ** (F.sqrt_s - 1));
            assert(F.eq(c0, F.negone), `construction ${i}: z is not a non-residue root`);
        }
    });

    it("sqrt terminates and is correct on F(17) across repeated constructions", () => {
        for (let i = 0; i < 50; i++) {
            const F = new F1Field(Scalar.e(17));
            let squares = 0;
            for (let x = 1; x < 17; x++) {
                const s = F.sqrt(F.e(x));
                if (s !== null) {
                    squares++;
                    assert(F.eq(F.square(s), F.e(x)));
                }
            }
            assert.strictEqual(squares, 8);
        }
    });
});
