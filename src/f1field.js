const supportsNativeBigInt = typeof BigInt === "function";
if (supportsNativeBigInt) {
    module.exports = require("./f1field_native");
} else {
    module.exports = require("./f1field_bigint");
}
