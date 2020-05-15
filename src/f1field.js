const Scalar = require("./scalar");
const assert = require("assert");

const supportsNativeBigInt = typeof BigInt === "function";

let F1Field;
if (supportsNativeBigInt) {
    F1Field = require("./f1field_native");
} else {
    F1Field = require("./f1field_bigint");
}


// Returns a buffer with Little Endian Representation
F1Field.prototype.toRprLE = function toRprLE(buff, o, e) {
    Scalar.toRprLE(buff, o, e, this.n64*8);
};

// Returns a buffer with Big Endian Representation
F1Field.prototype.toRprBE = function toRprBE(buff, o, e) {
    Scalar.toRprBE(buff, o, e, this.n64*8);
};

// Returns a buffer with Big Endian Montgomery Representation
F1Field.prototype.toRprBEM = function toRprBEM(buff, o, e) {
    return this.toRprBE(buff, o, this.mul(this.R, e));
};

F1Field.prototype.toRprLEM = function toRprLEM(buff, o, e) {
    return this.toRprLE(buff, o, this.mul(this.R, e));
};


// Pases a buffer with Little Endian Representation
F1Field.prototype.fromRprLE = function fromRprLE(buff, o) {
    return Scalar.fromRprLE(buff, o, this.n8);
};

// Pases a buffer with Big Endian Representation
F1Field.prototype.fromRprBE = function fromRprBE(buff, o) {
    return Scalar.fromRprBE(buff, o, this.n8);
};

F1Field.prototype.fromRprLEM = function fromRprLEM(buff, o) {
    return this.mul(this.fromRprLE(buff, o), this.Ri);
};

F1Field.prototype.fromRprBEM = function fromRprBEM(buff, o) {
    return this.mul(this.fromRprBE(buff, o), this.Ri);
};


module.exports = F1Field;
