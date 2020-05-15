
const assert = require("assert");

const supportsNativeBigInt = typeof BigInt === "function";

let Scalar;
if (supportsNativeBigInt) {
    Scalar = require("./scalar_native.js");
} else {
    Scalar = require("./scalar_bigint.js");
}


// Returns a buffer with Little Endian Representation
Scalar.__proto__.toRprLE = function rprBE(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new Uint32Array(buff, o, n8/4);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v[i] = parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16);
    for (let i=l; i<v.length; i++) v[i] = 0;
};

// Returns a buffer with Big Endian Representation
Scalar.__proto__.toRprBE = function rprLEM(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new DataView(buff, o, n8);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v.setUint32(n8-i*4 -4, parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16), false);
    for (let i=0; i<n8/4-l; i++) v[i] = 0;
};

// Pases a buffer with Little Endian Representation
Scalar.__proto__.fromRprLE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    const v = new Uint32Array(buff, o, n8/4);
    const a = new Array(n8/4);
    v.forEach( (ch,i) => a[a.length-i-1] = ch.toString(16).padStart(8,"0") );
    return Scalar.fromString(a.join(""), 16);
};

// Pases a buffer with Big Endian Representation
Scalar.__proto__.fromRprBE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    const v = new DataView(buff, o, n8);
    const a = new Array(n8/4);
    for (let i=0; i<n8/4; i++) {
        a[i] = v.getUint32(i*4, false).toString(16).padStart(8, "0");
    }
    return Scalar.fromString(a.join(""), 16);
};

module.exports = Scalar;



