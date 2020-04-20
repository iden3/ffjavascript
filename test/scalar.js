const assert = require("assert");

const ScalarN = require("../src/scalar_native.js");
const ScalarB = require("../src/scalar_bigint.js");

describe("Basic scalar convertions", () => {
    it("Should convertion Native", () => {
        assert(ScalarN.eq(ScalarN.e("0x12"), 18));
        assert(ScalarN.eq(ScalarN.e("0x12", 16), 18));
        assert(ScalarN.eq(ScalarN.e("12", 16), 18));
        assert(ScalarN.eq(ScalarN.e("18"), 18));
        assert(ScalarN.eq(ScalarN.e("18", 10), 18));
        assert(ScalarN.eq(ScalarN.e(18, 10), 18));
        assert(ScalarN.eq(ScalarN.e(18n, 10), 18));
        assert(ScalarN.eq(ScalarN.e(0x12, 10), 18));
        assert(ScalarN.eq(ScalarN.e(0x12n, 10), 18));

    });
    it("Should convertion BigInt", () => {
        assert(ScalarB.eq(ScalarB.e("0x12"), 18));
        assert(ScalarB.eq(ScalarB.e("0x12", 16), 18));
        assert(ScalarB.eq(ScalarB.e("12", 16), 18));
        assert(ScalarB.eq(ScalarB.e("18"), 18));
        assert(ScalarB.eq(ScalarB.e("18", 10), 18));
        assert(ScalarB.eq(ScalarB.e(18, 10), 18));
        assert(ScalarB.eq(ScalarB.e(18n, 10), 18));
        assert(ScalarB.eq(ScalarB.e(0x12, 10), 18));
        assert(ScalarB.eq(ScalarB.e(0x12n, 10), 18));
    });
});
