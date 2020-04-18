/* global BigInt */
const assert = require("assert");
const hexLen = [ 0, 1, 2, 2, 3, 3, 3, 3, 4 ,4 ,4 ,4 ,4 ,4 ,4 ,4];

module.exports.fromString = function fromString(s, radix) {
    if ((!radix)||(radix==10)) {
        return BigInt(s);
    } else if (radix==16) {
        return BigInt("0x"+s);
    }
};

module.exports.fromArray = function fromArray(a, radix) {
    let acc =0n;
    radix = BigInt(radix);
    for (let i=0; i<a.length; i++) {
        acc = acc*radix + BigInt(a[i]);
    }
    return acc;
};

module.exports.bitLength = function (a) {
    const aS =a.toString(16);
    return (aS.length-1)*4 +hexLen[aS[0]];
};

module.exports.isNegative = function (a) {
    return BigInt(a) < 0n;
};

module.exports.isZero = function (a) {
    return !a;
};

module.exports.shiftLeft = function (a, n) {
    return BigInt(a) << BigInt(n);
};

module.exports.shiftRight = function (a, n) {
    return BigInt(a) >> BigInt(n);
};

module.exports.shl = module.exports.shiftLeft;
module.exports.shr = module.exports.shiftRight;

module.exports.isOdd = function (a) {
    return (BigInt(a) & 1n) == 1n;
};


module.exports.naf = function naf(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & 1n) {
            const z = 2 - Number(E % 4n);
            res.push( z );
            E = E - BigInt(z);
        } else {
            res.push( 0 );
        }
        E = E >> 1n;
    }
    return res;
};


module.exports.bits = function naf(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & 1n) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E >> 1n;
    }
    return res;
};

module.exports.toNumber = function(s) {
    assert(s<0x100000000n);
    return Number(s);
};

module.exports.toArray = function(s, radix) {
    const res = [];
    let rem = BigInt(s);
    radix = BigInt(radix);
    while (rem) {
        res.unshift( Number(rem % radix));
        rem = rem / radix;
    }
    return res;
};


module.exports.e = function(a) {
    return BigInt(a);
};

module.exports.add = function(a, b) {
    return BigInt(a) + BigInt(b);
};

module.exports.sub = function(a, b) {
    return BigInt(a) - BigInt(b);
};

module.exports.neg = function(a) {
    return -BigInt(a);
};

module.exports.mul = function(a, b) {
    return BigInt(a) * BigInt(b);
};

module.exports.square = function(a) {
    return BigInt(a) * BigInt(a);
};

module.exports.div = function(a, b) {
    return BigInt(a) / BigInt(b);
};

module.exports.mod = function(a, b) {
    return BigInt(a) % BigInt(b);
};

module.exports.eq = function(a, b) {
    return BigInt(a) == BigInt(b);
};

module.exports.neq = function(a, b) {
    return BigInt(a) != BigInt(b);
};

module.exports.lt = function(a, b) {
    return BigInt(a) < BigInt(b);
};

module.exports.gt = function(a, b) {
    return BigInt(a) > BigInt(b);
};

module.exports.leq = function(a, b) {
    return BigInt(a) <= BigInt(b);
};

module.exports.geq = function(a, b) {
    return BigInt(a) >= BigInt(b);
};

module.exports.band = function(a, b) {
    return BigInt(a) & BigInt(b);
};

module.exports.bor = function(a, b) {
    return BigInt(a) | BigInt(b);
};

module.exports.bxor = function(a, b) {
    return BigInt(a) ^ BigInt(b);
};

module.exports.band = function(a, b) {
    return BigInt(a) && BigInt(b);
};

module.exports.bor = function(a, b) {
    return BigInt(a) || BigInt(b);
};

module.exports.bnot = function(a) {
    return !BigInt(a);
};

