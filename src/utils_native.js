/* global BigInt */
const assert = require("assert");

module.exports.stringifyBigInts = function stringifyBigInts(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        for (let k in o) {
            res[k] = stringifyBigInts(o[k]);
        }
        return res;
    } else {
        return o;
    }
};

module.exports.unstringifyBigInts = function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        for (let k in o) {
            res[k] = unstringifyBigInts(o[k]);
        }
        return res;
    } else {
        return o;
    }
};

module.exports.beBuff2int = function beBuff2int(buff) {
    let res = 0n;
    let i = buff.length;
    while (i>0) {
        if (i >= 4) {
            i -= 4;
            res += BigInt(buff.readUInt32BE(i)) << BigInt( i*8);
        } else if (i >= 2) {
            i -= 2;
            res += BigInt(buff.readUInt16BE(i)) << BigInt( i*8);
        } else {
            i -= 1;
            res += BigInt(buff.readUInt8(i)) << BigInt( i*8);
        }
    }
    return res;
};

module.exports.beInt2Buff = function beInt2Buff(n, len) {
    let r = n;
    const buff = Buffer.alloc(len);
    let o = len;
    while (o > 0) {
        if (o-4 >= 0) {
            o -= 4;
            buff.writeUInt32BE(Number(r & 0xFFFFFFFFn), o);
            r = r >> 32n;
        } else if (o-2 >= 0) {
            o -= 2;
            buff.writeUInt16BE(Number(r & 0xFFFFn), o);
            r = r >> 16n;
        } else {
            o -= 1;
            buff.writeUInt8(Number(r & 0xFFn),o );
            r = r >> 8n;
        }
    }
    assert(r == 0n);
    return buff;
};


module.exports.leBuff2int = function leBuff2int(buff) {
    let res = 0n;
    let i = 0;
    while (i<buff.length) {
        if (i + 4 <= buff.length) {
            res += BigInt(buff.readUInt32LE(i)) << BigInt( i*8);
            i += 4;
        } else if (i + 4 <= buff.length) {
            res += BigInt(buff.readUInt16LE(i)) << BigInt( i*8);
            i += 2;
        } else {
            res += BigInt(buff.readUInt8(i)) << BigInt( i*8);
            i += 1;
        }
    }
    return res;
};

module.exports.leInt2Buff = function leInt2Buff(n, len) {
    let r = n;
    const buff = Buffer.alloc(len);
    let o = 0;
    while (o < len) {
        if (o+4 <= len) {
            buff.writeUInt32LE(Number(r & 0xFFFFFFFFn), o );
            o += 4;
            r = r >> 32n;
        } else if (o+2 <= len) {
            buff.writeUInt16LE(Number(r & 0xFFFFn), o );
            o += 2;
            r = r >> 16n;
        } else {
            buff.writeUInt8(Number(r & 0xFFn), o );
            o += 1;
            r = r >> 8n;
        }
    }
    assert(r == 0n);
    return buff;
};
