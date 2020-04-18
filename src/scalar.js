

const supportsNativeBigInt = typeof BigInt === "function";
if (supportsNativeBigInt) {
    module.exports = require("./scalar_native.js");
} else {
    module.exports = require("./scalar_bigint.js");
}

