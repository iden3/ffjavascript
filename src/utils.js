
const supportsNativeBigInt = typeof BigInt === "function";
if (supportsNativeBigInt) {
    module.exports = require("./utils_native.js");
} else {
    module.exports = require("./utils_bigint.js");
}

