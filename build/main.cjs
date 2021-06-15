'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bigInt = require('big-integer');
var crypto = require('crypto');
var wasmcurves = require('wasmcurves');
var os = require('os');
var Worker = require('web-worker');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var bigInt__default = /*#__PURE__*/_interopDefaultLegacy(bigInt);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var wasmcurves__default = /*#__PURE__*/_interopDefaultLegacy(wasmcurves);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var Worker__default = /*#__PURE__*/_interopDefaultLegacy(Worker);

/* global BigInt */
const hexLen = [ 0, 1, 2, 2, 3, 3, 3, 3, 4 ,4 ,4 ,4 ,4 ,4 ,4 ,4];

function fromString(s, radix) {
    if ((!radix)||(radix==10)) {
        return BigInt(s);
    } else if (radix==16) {
        if (s.slice(0,2) == "0x") {
            return BigInt(s);
        } else {
            return BigInt("0x"+s);
        }
    }
}

const e = fromString;

function fromArray(a, radix) {
    let acc =0n;
    radix = BigInt(radix);
    for (let i=0; i<a.length; i++) {
        acc = acc*radix + BigInt(a[i]);
    }
    return acc;
}

function bitLength(a) {
    const aS =a.toString(16);
    return (aS.length-1)*4 +hexLen[parseInt(aS[0], 16)];
}

function isNegative(a) {
    return BigInt(a) < 0n;
}

function isZero(a) {
    return !a;
}

function shiftLeft(a, n) {
    return BigInt(a) << BigInt(n);
}

function shiftRight(a, n) {
    return BigInt(a) >> BigInt(n);
}

const shl = shiftLeft;
const shr = shiftRight;

function isOdd(a) {
    return (BigInt(a) & 1n) == 1n;
}


function naf(n) {
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
}


function bits(n) {
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
}

function toNumber(s) {
    if (s>BigInt(Number.MAX_SAFE_INTEGER )) {
        throw new Error("Number too big");
    }
    return Number(s);
}

function toArray(s, radix) {
    const res = [];
    let rem = BigInt(s);
    radix = BigInt(radix);
    while (rem) {
        res.unshift( Number(rem % radix));
        rem = rem / radix;
    }
    return res;
}


function add(a, b) {
    return BigInt(a) + BigInt(b);
}

function sub(a, b) {
    return BigInt(a) - BigInt(b);
}

function neg(a) {
    return -BigInt(a);
}

function mul(a, b) {
    return BigInt(a) * BigInt(b);
}

function square(a) {
    return BigInt(a) * BigInt(a);
}

function pow(a, b) {
    return BigInt(a) ** BigInt(b);
}

function exp(a, b) {
    return BigInt(a) ** BigInt(b);
}

function abs(a) {
    return BigInt(a) >= 0 ? BigInt(a) : -BigInt(a);
}

function div(a, b) {
    return BigInt(a) / BigInt(b);
}

function mod(a, b) {
    return BigInt(a) % BigInt(b);
}

function eq(a, b) {
    return BigInt(a) == BigInt(b);
}

function neq(a, b) {
    return BigInt(a) != BigInt(b);
}

function lt(a, b) {
    return BigInt(a) < BigInt(b);
}

function gt(a, b) {
    return BigInt(a) > BigInt(b);
}

function leq(a, b) {
    return BigInt(a) <= BigInt(b);
}

function geq(a, b) {
    return BigInt(a) >= BigInt(b);
}

function band(a, b) {
    return BigInt(a) & BigInt(b);
}

function bor(a, b) {
    return BigInt(a) | BigInt(b);
}

function bxor(a, b) {
    return BigInt(a) ^ BigInt(b);
}

function land(a, b) {
    return BigInt(a) && BigInt(b);
}

function lor(a, b) {
    return BigInt(a) || BigInt(b);
}

function lnot(a) {
    return !BigInt(a);
}

var Scalar_native = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromString: fromString,
    e: e,
    fromArray: fromArray,
    bitLength: bitLength,
    isNegative: isNegative,
    isZero: isZero,
    shiftLeft: shiftLeft,
    shiftRight: shiftRight,
    shl: shl,
    shr: shr,
    isOdd: isOdd,
    naf: naf,
    bits: bits,
    toNumber: toNumber,
    toArray: toArray,
    add: add,
    sub: sub,
    neg: neg,
    mul: mul,
    square: square,
    pow: pow,
    exp: exp,
    abs: abs,
    div: div,
    mod: mod,
    eq: eq,
    neq: neq,
    lt: lt,
    gt: gt,
    leq: leq,
    geq: geq,
    band: band,
    bor: bor,
    bxor: bxor,
    land: land,
    lor: lor,
    lnot: lnot
});

function fromString$1(s, radix) {
    if (typeof s == "string") {
        if (s.slice(0,2) == "0x") {
            return bigInt__default['default'](s.slice(2), 16);
        } else {
            return bigInt__default['default'](s,radix);
        }
    } else {
        return bigInt__default['default'](s, radix);
    }
}

const e$1 = fromString$1;

function fromArray$1(a, radix) {
    return bigInt__default['default'].fromArray(a, radix);
}

function bitLength$1(a) {
    return bigInt__default['default'](a).bitLength();
}

function isNegative$1(a) {
    return bigInt__default['default'](a).isNegative();
}

function isZero$1(a) {
    return bigInt__default['default'](a).isZero();
}

function shiftLeft$1(a, n) {
    return bigInt__default['default'](a).shiftLeft(n);
}

function shiftRight$1(a, n) {
    return bigInt__default['default'](a).shiftRight(n);
}

const shl$1 = shiftLeft$1;
const shr$1 = shiftRight$1;

function isOdd$1(a) {
    return bigInt__default['default'](a).isOdd();
}


function naf$1(n) {
    let E = bigInt__default['default'](n);
    const res = [];
    while (E.gt(bigInt__default['default'].zero)) {
        if (E.isOdd()) {
            const z = 2 - E.mod(4).toJSNumber();
            res.push( z );
            E = E.minus(z);
        } else {
            res.push( 0 );
        }
        E = E.shiftRight(1);
    }
    return res;
}

function bits$1(n) {
    let E = bigInt__default['default'](n);
    const res = [];
    while (E.gt(bigInt__default['default'].zero)) {
        if (E.isOdd()) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E.shiftRight(1);
    }
    return res;
}

function toNumber$1(s) {
    if (!s.lt(bigInt__default['default']("9007199254740992", 10))) {
        throw new Error("Number too big");
    }
    return s.toJSNumber();
}

function toArray$1(s, radix) {
    return bigInt__default['default'](s).toArray(radix);
}

function add$1(a, b) {
    return bigInt__default['default'](a).add(bigInt__default['default'](b));
}

function sub$1(a, b) {
    return bigInt__default['default'](a).minus(bigInt__default['default'](b));
}

function neg$1(a) {
    return bigInt__default['default'].zero.minus(bigInt__default['default'](a));
}

function mul$1(a, b) {
    return bigInt__default['default'](a).times(bigInt__default['default'](b));
}

function square$1(a) {
    return bigInt__default['default'](a).square();
}

function pow$1(a, b) {
    return bigInt__default['default'](a).pow(bigInt__default['default'](b));
}

function exp$1(a, b) {
    return bigInt__default['default'](a).pow(bigInt__default['default'](b));
}

function abs$1(a) {
    return bigInt__default['default'](a).abs();
}

function div$1(a, b) {
    return bigInt__default['default'](a).divide(bigInt__default['default'](b));
}

function mod$1(a, b) {
    return bigInt__default['default'](a).mod(bigInt__default['default'](b));
}

function eq$1(a, b) {
    return bigInt__default['default'](a).eq(bigInt__default['default'](b));
}

function neq$1(a, b) {
    return bigInt__default['default'](a).neq(bigInt__default['default'](b));
}

function lt$1(a, b) {
    return bigInt__default['default'](a).lt(bigInt__default['default'](b));
}

function gt$1(a, b) {
    return bigInt__default['default'](a).gt(bigInt__default['default'](b));
}

function leq$1(a, b) {
    return bigInt__default['default'](a).leq(bigInt__default['default'](b));
}

function geq$1(a, b) {
    return bigInt__default['default'](a).geq(bigInt__default['default'](b));
}

function band$1(a, b) {
    return bigInt__default['default'](a).and(bigInt__default['default'](b));
}

function bor$1(a, b) {
    return bigInt__default['default'](a).or(bigInt__default['default'](b));
}

function bxor$1(a, b) {
    return bigInt__default['default'](a).xor(bigInt__default['default'](b));
}

function land$1(a, b) {
    return (!bigInt__default['default'](a).isZero()) && (!bigInt__default['default'](b).isZero());
}

function lor$1(a, b) {
    return (!bigInt__default['default'](a).isZero()) || (!bigInt__default['default'](b).isZero());
}

function lnot$1(a) {
    return bigInt__default['default'](a).isZero();
}

var Scalar_bigint = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromString: fromString$1,
    e: e$1,
    fromArray: fromArray$1,
    bitLength: bitLength$1,
    isNegative: isNegative$1,
    isZero: isZero$1,
    shiftLeft: shiftLeft$1,
    shiftRight: shiftRight$1,
    shl: shl$1,
    shr: shr$1,
    isOdd: isOdd$1,
    naf: naf$1,
    bits: bits$1,
    toNumber: toNumber$1,
    toArray: toArray$1,
    add: add$1,
    sub: sub$1,
    neg: neg$1,
    mul: mul$1,
    square: square$1,
    pow: pow$1,
    exp: exp$1,
    abs: abs$1,
    div: div$1,
    mod: mod$1,
    eq: eq$1,
    neq: neq$1,
    lt: lt$1,
    gt: gt$1,
    leq: leq$1,
    geq: geq$1,
    band: band$1,
    bor: bor$1,
    bxor: bxor$1,
    land: land$1,
    lor: lor$1,
    lnot: lnot$1
});

const supportsNativeBigInt = typeof BigInt === "function";

let Scalar = {};
if (supportsNativeBigInt) {
    Object.assign(Scalar, Scalar_native);
} else {
    Object.assign(Scalar, Scalar_bigint);
}


// Returns a buffer with Little Endian Representation
Scalar.toRprLE = function rprBE(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new Uint32Array(buff.buffer, o, n8/4);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v[i] = parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16);
    for (let i=l; i<v.length; i++) v[i] = 0;
    for (let i=v.length*4; i<n8; i++) buff[i] = Scalar.toNumber(Scalar.band(Scalar.shiftRight(e, i*8), 0xFF));
};

// Returns a buffer with Big Endian Representation
Scalar.toRprBE = function rprLEM(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v.setUint32(n8-i*4 -4, parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16), false);
    for (let i=0; i<n8/4-l; i++) v[i] = 0;
};

// Pases a buffer with Little Endian Representation
Scalar.fromRprLE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    o = o || 0;
    const v = new Uint32Array(buff.buffer, o, n8/4);
    const a = new Array(n8/4);
    v.forEach( (ch,i) => a[a.length-i-1] = ch.toString(16).padStart(8,"0") );
    return Scalar.fromString(a.join(""), 16);
};

// Pases a buffer with Big Endian Representation
Scalar.fromRprBE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    o = o || 0;
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const a = new Array(n8/4);
    for (let i=0; i<n8/4; i++) {
        a[i] = v.getUint32(i*4, false).toString(16).padStart(8, "0");
    }
    return Scalar.fromString(a.join(""), 16);
};

Scalar.toString = function toString(a, radix) {
    return a.toString(radix);
};

Scalar.toLEBuff = function toLEBuff(a) {
    const buff = new Uint8Array(Math.floor((Scalar.bitLength(a) - 1) / 8) +1);
    Scalar.toRprLE(buff, 0, a, buff.byteLength);
    return buff;
};


Scalar.zero = Scalar.e(0);
Scalar.one = Scalar.e(1);

let {
    toRprLE,
    toRprBE,
    fromRprLE,
    fromRprBE,
    toString,
    toLEBuff,
    zero,
    one,
    fromString: fromString$2,
    e: e$2,
    fromArray: fromArray$2,
    bitLength: bitLength$2,
    isNegative: isNegative$2,
    isZero: isZero$2,
    shiftLeft: shiftLeft$2,
    shiftRight: shiftRight$2,
    shl: shl$2,
    shr: shr$2,
    isOdd: isOdd$2,
    naf: naf$2,
    bits: bits$2,
    toNumber: toNumber$2,
    toArray: toArray$2,
    add: add$2,
    sub: sub$2,
    neg: neg$2,
    mul: mul$2,
    square: square$2,
    pow: pow$2,
    exp: exp$2,
    abs: abs$2,
    div: div$2,
    mod: mod$2,
    eq: eq$2,
    neq: neq$2,
    lt: lt$2,
    gt: gt$2,
    leq: leq$2,
    geq: geq$2,
    band: band$2,
    bor: bor$2,
    bxor: bxor$2,
    land: land$2,
    lor: lor$2,
    lnot: lnot$2,
} = Scalar;

var _Scalar = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toRprLE: toRprLE,
    toRprBE: toRprBE,
    fromRprLE: fromRprLE,
    fromRprBE: fromRprBE,
    toString: toString,
    toLEBuff: toLEBuff,
    zero: zero,
    one: one,
    fromString: fromString$2,
    e: e$2,
    fromArray: fromArray$2,
    bitLength: bitLength$2,
    isNegative: isNegative$2,
    isZero: isZero$2,
    shiftLeft: shiftLeft$2,
    shiftRight: shiftRight$2,
    shl: shl$2,
    shr: shr$2,
    isOdd: isOdd$2,
    naf: naf$2,
    bits: bits$2,
    toNumber: toNumber$2,
    toArray: toArray$2,
    add: add$2,
    sub: sub$2,
    neg: neg$2,
    mul: mul$2,
    square: square$2,
    pow: pow$2,
    exp: exp$2,
    abs: abs$2,
    div: div$2,
    mod: mod$2,
    eq: eq$2,
    neq: neq$2,
    lt: lt$2,
    gt: gt$2,
    leq: leq$2,
    geq: geq$2,
    band: band$2,
    bor: bor$2,
    bxor: bxor$2,
    land: land$2,
    lor: lor$2,
    lnot: lnot$2
});

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

/*
    This library does operations on polynomials with coefficients in a field F.

    A polynomial P(x) = p0 + p1 * x + p2 * x^2 + ... + pn * x^n  is represented
    by the array [ p0, p1, p2, ... , pn ].
 */

class PolField {
    constructor (F) {
        this.F = F;

        let rem = F.sqrt_t;
        let s = F.sqrt_s;

        const five = this.F.add(this.F.add(this.F.two, this.F.two), this.F.one);

        this.w = new Array(s+1);
        this.wi = new Array(s+1);
        this.w[s] = this.F.pow(five, rem);
        this.wi[s] = this.F.inv(this.w[s]);

        let n=s-1;
        while (n>=0) {
            this.w[n] = this.F.square(this.w[n+1]);
            this.wi[n] = this.F.square(this.wi[n+1]);
            n--;
        }


        this.roots = [];
/*        for (let i=0; i<16; i++) {
            let r = this.F.one;
            n = 1 << i;
            const rootsi = new Array(n);
            for (let j=0; j<n; j++) {
                rootsi[j] = r;
                r = this.F.mul(r, this.w[i]);
            }

            this.roots.push(rootsi);
        }
    */
        this._setRoots(15);
    }

    _setRoots(n) {
        if (n > this.F.sqrt_s) n = this.s;
        for (let i=n; (i>=0) && (!this.roots[i]); i--) {
            let r = this.F.one;
            const nroots = 1 << i;
            const rootsi = new Array(nroots);
            for (let j=0; j<nroots; j++) {
                rootsi[j] = r;
                r = this.F.mul(r, this.w[i]);
            }
            this.roots[i] = rootsi;
        }
    }

    add(a, b) {
        const m = Math.max(a.length, b.length);
        const res = new Array(m);
        for (let i=0; i<m; i++) {
            res[i] = this.F.add(a[i] || this.F.zero, b[i] || this.F.zero);
        }
        return this.reduce(res);
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        const m = Math.max(a.length, b.length);
        const res = new Array(m);
        for (let i=0; i<m; i++) {
            res[i] = this.F.sub(a[i] || this.F.zero, b[i] || this.F.zero);
        }
        return this.reduce(res);
    }

    mulScalar(p, b) {
        if (this.F.eq(b, this.F.zero)) return [];
        if (this.F.eq(b, this.F.one)) return p;
        const res = new Array(p.length);
        for (let i=0; i<p.length; i++) {
            res[i] = this.F.mul(p[i], b);
        }
        return res;
    }



    mul(a, b) {
        if (a.length == 0) return [];
        if (b.length == 0) return [];
        if (a.length == 1) return this.mulScalar(b, a[0]);
        if (b.length == 1) return this.mulScalar(a, b[0]);

        if (b.length > a.length) {
            [b, a] = [a, b];
        }

        if ((b.length <= 2) || (b.length < log2(a.length))) {
            return this.mulNormal(a,b);
        } else {
            return this.mulFFT(a,b);
        }
    }

    mulNormal(a, b) {
        let res = [];
        for (let i=0; i<b.length; i++) {
            res = this.add(res, this.scaleX(this.mulScalar(a, b[i]), i) );
        }
        return res;
    }

    mulFFT(a,b) {
        const longestN = Math.max(a.length, b.length);
        const bitsResult = log2(longestN-1)+2;
        this._setRoots(bitsResult);

        const m = 1 << bitsResult;
        const ea = this.extend(a,m);
        const eb = this.extend(b,m);

        const ta = __fft(this, ea, bitsResult, 0, 1);
        const tb = __fft(this, eb, bitsResult, 0, 1);

        const tres = new Array(m);

        for (let i=0; i<m; i++) {
            tres[i] = this.F.mul(ta[i], tb[i]);
        }

        const res = __fft(this, tres, bitsResult, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return this.reduce(resn);
    }



    square(a) {
        return this.mul(a,a);
    }

    scaleX(p, n) {
        if (n==0) {
            return p;
        } else if (n>0) {
            const z = new Array(n).fill(this.F.zero);
            return z.concat(p);
        } else {
            if (-n >= p.length) return [];
            return p.slice(-n);
        }
    }

    eval2(p, x) {
        let v = this.F.zero;
        let ix = this.F.one;
        for (let i=0; i<p.length; i++) {
            v = this.F.add(v, this.F.mul(p[i], ix));
            ix = this.F.mul(ix, x);
        }
        return v;
    }

    eval(p,x) {
        const F = this.F;
        if (p.length == 0) return F.zero;
        const m = this._next2Power(p.length);
        const ep = this.extend(p, m);

        return _eval(ep, x, 0, 1, m);

        function _eval(p, x, offset, step, n) {
            if (n==1) return p[offset];
            const newX = F.square(x);
            const res= F.add(
                _eval(p, newX, offset, step << 1, n >> 1),
                F.mul(
                    x,
                    _eval(p, newX, offset+step , step << 1, n >> 1)));
            return res;
        }
    }

    lagrange(points) {
        let roots = [this.F.one];
        for (let i=0; i<points.length; i++) {
            roots = this.mul(roots, [this.F.neg(points[i][0]), this.F.one]);
        }

        let sum = [];
        for (let i=0; i<points.length; i++) {
            let mpol = this.ruffini(roots, points[i][0]);
            const factor =
                this.F.mul(
                    this.F.inv(this.eval(mpol, points[i][0])),
                    points[i][1]);
            mpol = this.mulScalar(mpol, factor);
            sum = this.add(sum, mpol);
        }
        return sum;
    }


    fft(p) {
        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res = __fft(this, ep, bits, 0, 1);
        return res;
    }

    fft2(p) {
        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res = __fft2(this, ep, bits);
        return res;
    }


    ifft(p) {

        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res =  __fft(this, ep, bits, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }


    ifft2(p) {

        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res =  __fft2(this, ep, bits);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }

    _fft(pall, bits, offset, step) {

        const n = 1 << bits;
        if (n==1) {
            return [ pall[offset] ];
        }

        const ndiv2 = n >> 1;
        const p1 = this._fft(pall, bits-1, offset, step*2);
        const p2 = this._fft(pall, bits-1, offset+step, step*2);

        const out = new Array(n);

        let m= this.F.one;
        for (let i=0; i<ndiv2; i++) {
            out[i] = this.F.add(p1[i], this.F.mul(m, p2[i]));
            out[i+ndiv2] = this.F.sub(p1[i], this.F.mul(m, p2[i]));
            m = this.F.mul(m, this.w[bits]);
        }

        return out;
    }

    extend(p, e) {
        if (e == p.length) return p;
        const z = new Array(e-p.length).fill(this.F.zero);

        return p.concat(z);
    }

    reduce(p) {
        if (p.length == 0) return p;
        if (! this.F.eq(p[p.length-1], this.F.zero) ) return p;
        let i=p.length-1;
        while( i>0 && this.F.eq(p[i], this.F.zero) ) i--;
        return p.slice(0, i+1);
    }

    eq(a, b) {
        const pa = this.reduce(a);
        const pb = this.reduce(b);

        if (pa.length != pb.length) return false;
        for (let i=0; i<pb.length; i++) {
            if (!this.F.eq(pa[i], pb[i])) return false;
        }

        return true;
    }

    ruffini(p, r) {
        const res = new Array(p.length-1);
        res[res.length-1] = p[p.length-1];
        for (let i = res.length-2; i>=0; i--) {
            res[i] = this.F.add(this.F.mul(res[i+1], r), p[i+1]);
        }
        return res;
    }

    _next2Power(v) {
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        v++;
        return v;
    }

    toString(p) {
        const ap = this.normalize(p);
        let S = "";
        for (let i=ap.length-1; i>=0; i--) {
            if (!this.F.eq(p[i], this.F.zero)) {
                if (S!="") S += " + ";
                S = S + p[i].toString(10);
                if (i>0) {
                    S = S + "x";
                    if (i>1) {
                        S = S + "^" +i;
                    }
                }
            }
        }
        return S;
    }

    normalize(p) {
        const res  = new Array(p.length);
        for (let i=0; i<p.length; i++) {
            res[i] = this.F.normalize(p[i]);
        }
        return res;
    }


    _reciprocal(p, bits) {
        const k = 1 << bits;
        if (k==1) {
            return [ this.F.inv(p[0]) ];
        }
        const np = this.scaleX(p, -k/2);
        const q = this._reciprocal(np, bits-1);
        const a = this.scaleX(this.double(q), 3*k/2-2);
        const b = this.mul( this.square(q), p);

        return this.scaleX(this.sub(a,b),   -(k-2));
    }

    // divides x^m / v
    _div2(m, v) {
        const kbits = log2(v.length-1)+1;
        const k = 1 << kbits;

        const scaleV = k - v.length;

        // rec = x^(k - 2) / v* x^scaleV =>
        // rec = x^(k-2-scaleV)/ v
        //
        // res = x^m/v = x^(m + (2*k-2 - scaleV) - (2*k-2 - scaleV)) /v =>
        // res = rec * x^(m - (2*k-2 - scaleV)) =>
        // res = rec * x^(m - 2*k + 2 + scaleV)

        const rec = this._reciprocal(this.scaleX(v, scaleV), kbits);
        const res = this.scaleX(rec, m - 2*k + 2 + scaleV);

        return res;
    }

    div(_u, _v) {
        if (_u.length < _v.length) return [];
        const kbits = log2(_v.length-1)+1;
        const k = 1 << kbits;

        const u = this.scaleX(_u, k-_v.length);
        const v = this.scaleX(_v, k-_v.length);

        const n = v.length-1;
        let m = u.length-1;

        const s = this._reciprocal(v, kbits);
        let t;
        if (m>2*n) {
            t = this.sub(this.scaleX([this.F.one], 2*n), this.mul(s, v));
        }

        let q = [];
        let rem = u;
        let us, ut;
        let finish = false;

        while (!finish) {
            us = this.mul(rem, s);
            q = this.add(q, this.scaleX(us, -2*n));

            if ( m > 2*n ) {
                ut = this.mul(rem, t);
                rem = this.scaleX(ut, -2*n);
                m = rem.length-1;
            } else {
                finish = true;
            }
        }

        return q;
    }


    // returns the ith nth-root of one
    oneRoot(n, i) {
        let nbits = log2(n-1)+1;
        let res = this.F.one;
        let r = i;

        if(i>=n) {
            throw new Error("Given 'i' should be lower than 'n'");
        }
        else if (1<<nbits !== n) {
            throw new Error(`Internal errlr: ${n} should equal ${1<<nbits}`);
        }

        while (r>0) {
            if (r & 1 == 1) {
                res = this.F.mul(res, this.w[nbits]);
            }
            r = r >> 1;
            nbits --;
        }
        return res;
    }

    computeVanishingPolinomial(bits, t) {
        const m = 1 << bits;
        return this.F.sub(this.F.pow(t, m), this.F.one);
    }

    evaluateLagrangePolynomials(bits, t) {
        const m= 1 << bits;
        const tm = this.F.pow(t, m);
        const u= new Array(m).fill(this.F.zero);
        this._setRoots(bits);
        const omega = this.w[bits];

        if (this.F.eq(tm, this.F.one)) {
            for (let i = 0; i < m; i++) {
                if (this.F.eq(this.roots[bits][0],t)) { // i.e., t equals omega^i
                    u[i] = this.F.one;
                    return u;
                }
            }
        }

        const z = this.F.sub(tm, this.F.one);
        //        let l = this.F.mul(z,  this.F.pow(this.F.twoinv, m));
        let l = this.F.mul(z,  this.F.inv(this.F.e(m)));
        for (let i = 0; i < m; i++) {
            u[i] = this.F.mul(l, this.F.inv(this.F.sub(t,this.roots[bits][i])));
            l = this.F.mul(l, omega);
        }

        return u;
    }

    log2(V) {
        return log2(V);
    }
}

function log2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
}


function __fft(PF, pall, bits, offset, step) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[offset] ];
    } else if (n==2) {
        return [
            PF.F.add(pall[offset], pall[offset + step]),
            PF.F.sub(pall[offset], pall[offset + step])];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft(PF, pall, bits-1, offset, step*2);
    const p2 = __fft(PF, pall, bits-1, offset+step, step*2);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
        out[i+ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
    }

    return out;
}


function __fft2(PF, pall, bits) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[0] ];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft2(PF, pall.slice(0, ndiv2), bits-1);
    const p2 = __fft2(PF, pall.slice(ndiv2), bits-1);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
        out[i+ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
    }

    return out;
}

const _revTable = [];
for (let i=0; i<256; i++) {
    _revTable[i] = _revSlow(i, 8);
}

function _revSlow(idx, bits) {
    let res =0;
    let a = idx;
    for (let i=0; i<bits; i++) {
        res <<= 1;
        res = res | (a &1);
        a >>=1;
    }
    return res;
}

function rev(idx, bits) {
    return (
        _revTable[idx >>> 24] |
        (_revTable[(idx >>> 16) & 0xFF] << 8) |
        (_revTable[(idx >>> 8) & 0xFF] << 16) |
        (_revTable[idx & 0xFF] << 24)
    ) >>> (32-bits);
}

function __bitReverse(p, bits) {
    for (let k=0; k<p.length; k++) {
        const r = rev(k, bits);
        if (r>k) {
            const tmp= p[k];
            p[k] = p[r];
            p[r] = tmp;
        }
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/


function mulScalar(F, base, e) {
    let res;

    if (isZero$2(e)) return F.zero;

    const n = naf$2(e);

    if (n[n.length-1] == 1) {
        res = base;
    } else if (n[n.length-1] == -1) {
        res = F.neg(base);
    } else {
        throw new Error("invlaud NAF");
    }

    for (let i=n.length-2; i>=0; i--) {

        res = F.double(res);

        if (n[i] == 1) {
            res = F.add(res, base);
        } else if (n[i] == -1) {
            res = F.sub(res, base);
        }
    }

    return res;
}


/*
exports.mulScalar = (F, base, e) =>{
    let res = F.zero;
    let rem = bigInt(e);
    let exp = base;

    while (! rem.eq(bigInt.zero)) {
        if (rem.and(bigInt.one).eq(bigInt.one)) {
            res = F.add(res, exp);
        }
        exp = F.double(exp);
        rem = rem.shiftRight(1);
    }

    return res;
};
*/


function exp$3(F, base, e) {

    if (isZero$2(e)) return F.one;

    const n = bits$2(e);

    if (n.legth==0) return F.one;

    let res = base;

    for (let i=n.length-2; i>=0; i--) {

        res = F.square(res);

        if (n[i]) {
            res = F.mul(res, base);
        }
    }

    return res;
}

// Check here: https://eprint.iacr.org/2012/685.pdf

function buildSqrt (F) {
    if ((F.m % 2) == 1) {
        if (eq$2(mod$2(F.p, 4), 1 )) {
            if (eq$2(mod$2(F.p, 8), 1 )) {
                if (eq$2(mod$2(F.p, 16), 1 )) {
                    // alg7_muller(F);
                    alg5_tonelliShanks(F);
                } else if (eq$2(mod$2(F.p, 16), 9 )) {
                    alg4_kong(F);
                } else {
                    throw new Error("Field withot sqrt");
                }
            } else if (eq$2(mod$2(F.p, 8), 5 )) {
                alg3_atkin(F);
            } else {
                throw new Error("Field withot sqrt");
            }
        } else if (eq$2(mod$2(F.p, 4), 3 )) {
            alg2_shanks(F);
        }
    } else {
        const pm2mod4 = mod$2(pow$2(F.p, F.m/2), 4);
        if (pm2mod4 == 1) {
            alg10_adj(F);
        } else if (pm2mod4 == 3) {
            alg9_adj(F);
        } else {
            alg8_complex(F);
        }

    }
}


function alg5_tonelliShanks(F) {
    F.sqrt_q = pow$2(F.p, F.m);

    F.sqrt_s = 0;
    F.sqrt_t = sub$2(F.sqrt_q, 1);

    while (!isOdd$2(F.sqrt_t)) {
        F.sqrt_s = F.sqrt_s + 1;
        F.sqrt_t = div$2(F.sqrt_t, 2);
    }

    let c0 = F.one;

    while (F.eq(c0, F.one)) {
        const c = F.random();
        F.sqrt_z = F.pow(c, F.sqrt_t);
        c0 = F.pow(F.sqrt_z, 2 ** (F.sqrt_s-1) );
    }

    F.sqrt_tm1d2 = div$2(sub$2(F.sqrt_t, 1),2);

    F.sqrt = function(a) {
        const F=this;
        if (F.isZero(a)) return F.zero;
        let w = F.pow(a, F.sqrt_tm1d2);
        const a0 = F.pow( F.mul(F.square(w), a), 2 ** (F.sqrt_s-1) );
        if (F.eq(a0, F.negone)) return null;

        let v = F.sqrt_s;
        let x = F.mul(a, w);
        let b = F.mul(x, w);
        let z = F.sqrt_z;
        while (!F.eq(b, F.one)) {
            let b2k = F.square(b);
            let k=1;
            while (!F.eq(b2k, F.one)) {
                b2k = F.square(b2k);
                k++;
            }

            w = z;
            for (let i=0; i<v-k-1; i++) {
                w = F.square(w);
            }
            z = F.square(w);
            b = F.mul(b, z);
            x = F.mul(x, w);
            v = k;
        }
        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}

function alg4_kong(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 4 not implemented");
    };
}

function alg3_atkin(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 3 not implemented");
    };
}

function alg2_shanks(F) {

    F.sqrt_q = pow$2(F.p, F.m);
    F.sqrt_e1 = div$2( sub$2(F.sqrt_q, 3) , 4);

    F.sqrt = function(a) {
        if (this.isZero(a)) return this.zero;

        // Test that have solution
        const a1 = this.pow(a, this.sqrt_e1);

        const a0 = this.mul(this.square(a1), a);

        if ( this.eq(a0, this.negone) ) return null;

        const x = this.mul(a1, a);

        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}

function alg10_adj(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 10 not implemented");
    };
}

function alg9_adj(F) {
    F.sqrt_q = pow$2(F.p, F.m/2);
    F.sqrt_e34 = div$2( sub$2(F.sqrt_q, 3) , 4);
    F.sqrt_e12 = div$2( sub$2(F.sqrt_q, 1) , 2);

    F.frobenius = function(n, x) {
        if ((n%2) == 1) {
            return F.conjugate(x);
        } else {
            return x;
        }
    };

    F.sqrt = function(a) {
        const F = this;
        const a1 = F.pow(a, F.sqrt_e34);
        const alfa = F.mul(F.square(a1), a);
        const a0 = F.mul(F.frobenius(1, alfa), alfa);
        if (F.eq(a0, F.negone)) return null;
        const x0 = F.mul(a1, a);
        let x;
        if (F.eq(alfa, F.negone)) {
            x = F.mul(x0, [F.F.zero, F.F.one]);
        } else {
            const b = F.pow(F.add(F.one, alfa), F.sqrt_e12);
            x = F.mul(b, x0);
        }
        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}


function alg8_complex(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 8 not implemented");
    };
}

function quarterRound(st, a, b, c, d) {

    st[a] = (st[a] + st[b]) >>> 0;
    st[d] = (st[d] ^ st[a]) >>> 0;
    st[d] = ((st[d] << 16) | ((st[d]>>>16) & 0xFFFF)) >>> 0;

    st[c] = (st[c] + st[d]) >>> 0;
    st[b] = (st[b] ^ st[c]) >>> 0;
    st[b] = ((st[b] << 12) | ((st[b]>>>20) & 0xFFF)) >>> 0;

    st[a] = (st[a] + st[b]) >>> 0;
    st[d] = (st[d] ^ st[a]) >>> 0;
    st[d] = ((st[d] << 8) | ((st[d]>>>24) & 0xFF)) >>> 0;

    st[c] = (st[c] + st[d]) >>> 0;
    st[b] = (st[b] ^ st[c]) >>> 0;
    st[b] = ((st[b] << 7) | ((st[b]>>>25) & 0x7F)) >>> 0;
}

function doubleRound(st) {
    quarterRound(st, 0, 4, 8,12);
    quarterRound(st, 1, 5, 9,13);
    quarterRound(st, 2, 6,10,14);
    quarterRound(st, 3, 7,11,15);

    quarterRound(st, 0, 5,10,15);
    quarterRound(st, 1, 6,11,12);
    quarterRound(st, 2, 7, 8,13);
    quarterRound(st, 3, 4, 9,14);
}

class ChaCha {

    constructor(seed) {
        seed = seed || [0,0,0,0,0,0,0,0];
        this.state = [
            0x61707865,
            0x3320646E,
            0x79622D32,
            0x6B206574,
            seed[0],
            seed[1],
            seed[2],
            seed[3],
            seed[4],
            seed[5],
            seed[6],
            seed[7],
            0,
            0,
            0,
            0
        ];
        this.idx = 16;
        this.buff = new Array(16);
    }

    nextU32() {
        if (this.idx == 16) this.update();
        return this.buff[this.idx++];
    }

    nextU64() {
        return add$2(mul$2(this.nextU32(), 0x100000000), this.nextU32());
    }

    nextBool() {
        return (this.nextU32() & 1) == 1;
    }

    update() {
        // Copy the state
        for (let i=0; i<16; i++) this.buff[i] = this.state[i];

        // Apply the rounds
        for (let i=0; i<10; i++) doubleRound(this.buff);

        // Add to the initial
        for (let i=0; i<16; i++) this.buff[i] = (this.buff[i] + this.state[i]) >>> 0;

        this.idx = 0;

        this.state[12] = (this.state[12] + 1) >>> 0;
        if (this.state[12] != 0) return;
        this.state[13] = (this.state[13] + 1) >>> 0;
        if (this.state[13] != 0) return;
        this.state[14] = (this.state[14] + 1) >>> 0;
        if (this.state[14] != 0) return;
        this.state[15] = (this.state[15] + 1) >>> 0;
    }
}

/* global window */

function getRandomBytes(n) {
    let array = new Uint8Array(n);
    if (typeof window !== "undefined") { // Browser
        if (typeof window.crypto !== "undefined") { // Supported
            window.crypto.getRandomValues(array);
        } else { // fallback
            for (let i=0; i<n; i++) {
                array[i] = (Math.random()*4294967296)>>>0;
            }
        }
    }
    else { // NodeJS
        crypto__default['default'].randomFillSync(array);
    }
    return array;
}

function getRandomSeed() {
    const arr = getRandomBytes(32);
    const arrV = new Uint32Array(arr.buffer);
    const seed = [];
    for (let i=0; i<8; i++) {
        seed.push(arrV[i]);
    }
    return seed;
}

let threadRng = null;

function getThreadRng() {
    if (threadRng) return threadRng;
    threadRng = new ChaCha(getRandomSeed());
    return threadRng;
}

/* global BigInt */

class ZqField {
    constructor(p) {
        this.type="F1";
        this.one = 1n;
        this.zero = 0n;
        this.p = BigInt(p);
        this.m = 1;
        this.negone = this.p-1n;
        this.two = 2n;
        this.half = this.p >> 1n;
        this.bitLength = bitLength$2(this.p);
        this.mask = (1n << BigInt(this.bitLength)) - 1n;

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = this.e(1n << BigInt(this.n64*64));
        this.Ri = this.inv(this.R);

        const e = this.negone >> 1n;
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.nqr + 1n;
            r = this.pow(this.nqr, e);
        }


        this.s = 0;
        this.t = this.negone;

        while ((this.t & 1n) == 0n) {
            this.s = this.s + 1;
            this.t = this.t >> 1n;
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);
    }

    e(a,b) {
        let res;
        if (!b) {
            res = BigInt(a);
        } else if (b==16) {
            res = BigInt("0x"+a);
        }
        if (res < 0) {
            let nres = -res;
            if (nres >= this.p) nres = nres % this.p;
            return this.p - nres;
        } else {
            return (res>= this.p) ? res%this.p : res;
        }

    }

    add(a, b) {
        const res = a + b;
        return res >= this.p ? res-this.p : res;
    }

    sub(a, b) {
        return (a >= b) ? a-b : this.p-b+a;
    }

    neg(a) {
        return a ? this.p-a : a;
    }

    mul(a, b) {
        return (a*b)%this.p;
    }

    mulScalar(base, s) {
        return (base * this.e(s)) % this.p;
    }

    square(a) {
        return (a*a) % this.p;
    }

    eq(a, b) {
        return a==b;
    }

    neq(a, b) {
        return a!=b;
    }

    lt(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa < bb;
    }

    gt(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa > bb;
    }

    leq(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa <= bb;
    }

    geq(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa >= bb;
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    idiv(a, b) {
        if (!b) throw new Error("Division by zero");
        return a / b;
    }

    inv(a) {
        if (!a) throw new Error("Division by zero");

        let t = 0n;
        let r = this.p;
        let newt = 1n;
        let newr = a % this.p;
        while (newr) {
            let q = r/newr;
            [t, newt] = [newt, t-q*newt];
            [r, newr] = [newr, r-q*newr];
        }
        if (t<0n) t += this.p;
        return t;
    }

    mod(a, b) {
        return a % b;
    }

    pow(b, e) {
        return exp$3(this, b, e);
    }

    exp(b, e) {
        return exp$3(this, b, e);
    }

    band(a, b) {
        const res =  ((a & b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bor(a, b) {
        const res =  ((a | b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bxor(a, b) {
        const res =  ((a ^ b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bnot(a) {
        const res = a ^ this.mask;
        return res >= this.p ? res-this.p : res;
    }

    shl(a, b) {
        if (Number(b) < this.bitLength) {
            const res = (a << b) & this.mask;
            return res >= this.p ? res-this.p : res;
        } else {
            const nb = this.p - b;
            if (Number(nb) < this.bitLength) {
                return a >> nb;
            } else {
                return 0n;
            }
        }
    }

    shr(a, b) {
        if (Number(b) < this.bitLength) {
            return a >> b;
        } else {
            const nb = this.p - b;
            if (Number(nb) < this.bitLength) {
                const res = (a << nb) & this.mask;
                return res >= this.p ? res-this.p : res;
            } else {
                return 0;
            }
        }
    }

    land(a, b) {
        return (a && b) ? 1n : 0n;
    }

    lor(a, b) {
        return (a || b) ? 1n : 0n;
    }

    lnot(a) {
        return (a) ? 0n : 1n;
    }

    sqrt_old(n) {

        if (n == 0n) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone >> this.one);
        if ( res != 1n ) return null;

        let m = this.s;
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one) >> 1n );

        while ( t != 1n ) {
            let sq = this.square(t);
            let i = 1;
            while (sq != 1n ) {
                i++;
                sq = this.square(sq);
            }

            // b = c ^ m-i-1
            let b = c;
            for (let j=0; j< m-i-1; j ++) b = this.square(b);

            m = i;
            c = this.square(b);
            t = this.mul(t, c);
            r = this.mul(r, b);
        }

        if (r > (this.p >> 1n)) {
            r = this.neg(r);
        }

        return r;
    }

    normalize(a, b) {
        a = BigInt(a,b);
        if (a < 0) {
            let na = -a;
            if (na >= this.p) na = na % this.p;
            return this.p - na;
        } else {
            return (a>= this.p) ? a%this.p : a;
        }
    }

    random() {
        const nBytes = (this.bitLength*2 / 8);
        let res =0n;
        for (let i=0; i<nBytes; i++) {
            res = (res << 8n) + BigInt(getRandomBytes(1)[0]);
        }
        return res % this.p;
    }

    toString(a, base) {
        let vs;
        if (a > this.half) {
            const v = this.p-a;
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }
        return vs;
    }

    isZero(a) {
        return a == 0n;
    }

    fromRng(rng) {
        let v;
        do {
            v=0n;
            for (let i=0; i<this.n64; i++) {
                v += rng.nextU64() << BigInt(64 *i);
            }
            v &= this.mask;
        } while (v >= this.p);
        v = (v * this.Ri) % this.p;   // Convert from montgomery
        return v;
    }

}

class ZqField$1 {
    constructor(p) {
        this.type="F1";
        this.one = bigInt__default['default'].one;
        this.zero = bigInt__default['default'].zero;
        this.p = bigInt__default['default'](p);
        this.m = 1;
        this.negone = this.p.minus(bigInt__default['default'].one);
        this.two = bigInt__default['default'](2);
        this.half = this.p.shiftRight(1);
        this.bitLength = this.p.bitLength();
        this.mask = bigInt__default['default'].one.shiftLeft(this.bitLength).minus(bigInt__default['default'].one);

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = bigInt__default['default'].one.shiftLeft(this.n64*64);
        this.Ri = this.inv(this.R);

        const e = this.negone.shiftRight(this.one);
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!r.equals(this.negone)) {
            this.nqr = this.nqr.add(this.one);
            r = this.pow(this.nqr, e);
        }

        this.s = this.zero;
        this.t = this.negone;

        while (!this.t.isOdd()) {
            this.s = this.s.add(this.one);
            this.t = this.t.shiftRight(this.one);
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);
    }

    e(a,b) {

        const res = bigInt__default['default'](a,b);

        return this.normalize(res);

    }

    add(a, b) {
        let res = a.add(b);
        if (res.geq(this.p)) {
            res = res.minus(this.p);
        }
        return res;
    }

    sub(a, b) {
        if (a.geq(b)) {
            return a.minus(b);
        } else {
            return this.p.minus(b.minus(a));
        }
    }

    neg(a) {
        if (a.isZero()) return a;
        return this.p.minus(a);
    }

    mul(a, b) {
        return a.times(b).mod(this.p);
    }

    mulScalar(base, s) {
        return base.times(bigInt__default['default'](s)).mod(this.p);
    }

    square(a) {
        return a.square().mod(this.p);
    }

    eq(a, b) {
        return a.eq(b);
    }

    neq(a, b) {
        return a.neq(b);
    }

    lt(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.lt(bb);
    }

    gt(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.gt(bb);
    }

    leq(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.leq(bb);
    }

    geq(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.geq(bb);
    }

    div(a, b) {
        if (b.isZero()) throw new Error("Division by zero");
        return a.times(b.modInv(this.p)).mod(this.p);
    }

    idiv(a, b) {
        if (b.isZero()) throw new Error("Division by zero");
        return a.divide(b);
    }

    inv(a) {
        if (a.isZero()) throw new Error("Division by zero");
        return a.modInv(this.p);
    }

    mod(a, b) {
        return a.mod(b);
    }

    pow(a, b) {
        return a.modPow(b, this.p);
    }

    exp(a, b) {
        return a.modPow(b, this.p);
    }

    band(a, b) {
        return a.and(b).and(this.mask).mod(this.p);
    }

    bor(a, b) {
        return a.or(b).and(this.mask).mod(this.p);
    }

    bxor(a, b) {
        return a.xor(b).and(this.mask).mod(this.p);
    }

    bnot(a) {
        return a.xor(this.mask).mod(this.p);
    }

    shl(a, b) {
        if (b.lt(this.bitLength)) {
            return a.shiftLeft(b).and(this.mask).mod(this.p);
        } else {
            const nb = this.p.minus(b);
            if (nb.lt(this.bitLength)) {
                return this.shr(a, nb);
            } else {
                return bigInt__default['default'].zero;
            }
        }
    }

    shr(a, b) {
        if (b.lt(this.bitLength)) {
            return a.shiftRight(b);
        } else {
            const nb = this.p.minus(b);
            if (nb.lt(this.bitLength)) {
                return this.shl(a, nb);
            } else {
                return bigInt__default['default'].zero;
            }
        }
    }

    land(a, b) {
        return (a.isZero() || b.isZero()) ? bigInt__default['default'].zero : bigInt__default['default'].one;
    }

    lor(a, b) {
        return (a.isZero() && b.isZero()) ? bigInt__default['default'].zero : bigInt__default['default'].one;
    }

    lnot(a) {
        return a.isZero() ? bigInt__default['default'].one : bigInt__default['default'].zero;
    }

    sqrt_old(n) {

        if (n.equals(this.zero)) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone.shiftRight(this.one));
        if (!res.equals(this.one)) return null;

        let m = parseInt(this.s);
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one).shiftRight(this.one) );

        while (!t.equals(this.one)) {
            let sq = this.square(t);
            let i = 1;
            while (!sq.equals(this.one)) {
                i++;
                sq = this.square(sq);
            }

            // b = c ^ m-i-1
            let b = c;
            for (let j=0; j< m-i-1; j ++) b = this.square(b);

            m = i;
            c = this.square(b);
            t = this.mul(t, c);
            r = this.mul(r, b);
        }

        if (r.greater(this.p.shiftRight(this.one))) {
            r = this.neg(r);
        }

        return r;
    }

    normalize(a) {
        a = bigInt__default['default'](a);
        if (a.isNegative()) {
            return this.p.minus(a.abs().mod(this.p));
        } else {
            return a.mod(this.p);
        }
    }

    random() {
        let res = bigInt__default['default'](0);
        let n = bigInt__default['default'](this.p.square());
        while (!n.isZero()) {
            res = res.shiftLeft(8).add(bigInt__default['default'](getRandomBytes(1)[0]));
            n = n.shiftRight(8);
        }
        return res.mod(this.p);
    }

    toString(a, base) {
        let vs;
        if (!a.lesserOrEquals(this.p.shiftRight(bigInt__default['default'](1)))) {
            const v = this.p.minus(a);
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }

        return vs;
    }

    isZero(a) {
        return a.isZero();
    }

    fromRng(rng) {
        let v;
        do {
            v = bigInt__default['default'](0);
            for (let i=0; i<this.n64; i++) {
                v = v.add(v, rng.nextU64().shiftLeft(64*i));
            }
            v = v.and(this.mask);
        } while (v.geq(this.p));
        v = v.times(this.Ri).mod(this.q);
        return v;
    }


}

const supportsNativeBigInt$1 = typeof BigInt === "function";
let _F1Field;
if (supportsNativeBigInt$1) {
    _F1Field = ZqField;
} else {
    _F1Field = ZqField$1;
}

class F1Field extends _F1Field {

    // Returns a buffer with Little Endian Representation
    toRprLE(buff, o, e) {
        toRprLE(buff, o, e, this.n64*8);
    }

    // Returns a buffer with Big Endian Representation
    toRprBE(buff, o, e) {
        toRprBE(buff, o, e, this.n64*8);
    }

    // Returns a buffer with Big Endian Montgomery Representation
    toRprBEM(buff, o, e) {
        return this.toRprBE(buff, o, this.mul(this.R, e));
    }

    toRprLEM(buff, o, e) {
        return this.toRprLE(buff, o, this.mul(this.R, e));
    }


    // Pases a buffer with Little Endian Representation
    fromRprLE(buff, o) {
        return fromRprLE(buff, o, this.n8);
    }

    // Pases a buffer with Big Endian Representation
    fromRprBE(buff, o) {
        return fromRprBE(buff, o, this.n8);
    }

    fromRprLEM(buff, o) {
        return this.mul(this.fromRprLE(buff, o), this.Ri);
    }

    fromRprBEM(buff, o) {
        return this.mul(this.fromRprBE(buff, o), this.Ri);
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

class F2Field {
    constructor(F, nonResidue) {
        this.type="F2";
        this.F = F;
        this.zero = [this.F.zero, this.F.zero];
        this.one = [this.F.one, this.F.zero];
        this.negone = this.neg(this.one);
        this.nonResidue = nonResidue;
        this.m = F.m*2;
        this.p = F.p;
        this.n64 = F.n64*2;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;

        buildSqrt(this);
    }

    _mulByNonResidue(a) {
        return this.F.mul(this.nonResidue, a);
    }

    copy(a) {
        return [this.F.copy(a[0]), this.F.copy(a[1])];
    }

    add(a, b) {
        return [
            this.F.add(a[0], b[0]),
            this.F.add(a[1], b[1])
        ];
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        return [
            this.F.sub(a[0], b[0]),
            this.F.sub(a[1], b[1])
        ];
    }

    neg(a) {
        return this.sub(this.zero, a);
    }

    conjugate(a) {
        return [
            a[0],
            this.F.neg(a[1])
        ];
    }

    mul(a, b) {
        const aA = this.F.mul(a[0] , b[0]);
        const bB = this.F.mul(a[1] , b[1]);

        return [
            this.F.add( aA , this._mulByNonResidue(bB)),
            this.F.sub(
                this.F.mul(
                    this.F.add(a[0], a[1]),
                    this.F.add(b[0], b[1])),
                this.F.add(aA, bB))];
    }

    inv(a) {
        const t0 = this.F.square(a[0]);
        const t1 = this.F.square(a[1]);
        const t2 = this.F.sub(t0, this._mulByNonResidue(t1));
        const t3 = this.F.inv(t2);
        return [
            this.F.mul(a[0], t3),
            this.F.neg(this.F.mul( a[1], t3)) ];
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    square(a) {
        const ab = this.F.mul(a[0] , a[1]);

        /*
        [
            (a + b) * (a + non_residue * b) - ab - non_residue * ab,
            ab + ab
        ];
        */

        return [
            this.F.sub(
                this.F.mul(
                    this.F.add(a[0], a[1]) ,
                    this.F.add(
                        a[0] ,
                        this._mulByNonResidue(a[1]))),
                this.F.add(
                    ab,
                    this._mulByNonResidue(ab))),
            this.F.add(ab, ab)
        ];
    }

    isZero(a) {
        return this.F.isZero(a[0]) && this.F.isZero(a[1]);
    }

    eq(a, b) {
        return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]);
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    pow(base, e) {
        return exp$3(this, base, e);
    }

    exp(base, e) {
        return exp$3(this, base, e);
    }

    toString(a) {
        return `[ ${this.F.toString(a[0])} , ${this.F.toString(a[1])} ]`;
    }

    fromRng(rng) {
        const c0 = this.F.fromRng(rng);
        const c1 = this.F.fromRng(rng);
        return [c0, c1];
    }

    gt(a, b) {
        if (this.F.gt(a[0], b[0])) return true;
        if (this.F.gt(b[0], a[0])) return false;
        if (this.F.gt(a[1], b[1])) return true;
        return false;
    }

    geq(a, b) {
        return this.gt(a, b) || this.eq(a, b);
    }

    lt(a, b) {
        return !this.geq(a,b);
    }

    leq(a, b) {
        return !this.gt(a,b);
    }

    neq(a, b) {
        return !this.eq(a,b);
    }

    random() {
        return [this.F.random(), this.F.random()];
    }


    toRprLE(buff, o, e) {
        this.F.toRprLE(buff, o, e[0]);
        this.F.toRprLE(buff, o+this.F.n8, e[1]);
    }

    toRprBE(buff, o, e) {
        this.F.toRprBE(buff, o, e[1]);
        this.F.toRprBE(buff, o+this.F.n8, e[0]);
    }

    toRprLEM(buff, o, e) {
        this.F.toRprLEM(buff, o, e[0]);
        this.F.toRprLEM(buff, o+this.F.n8, e[1]);
    }


    toRprBEM(buff, o, e) {
        this.F.toRprBEM(buff, o, e[1]);
        this.F.toRprBEM(buff, o+this.F.n8, e[0]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLE(buff, o);
        const c1 = this.F.fromRprLE(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const c1 = this.F.fromRprBE(buff, o);
        const c0 = this.F.fromRprBE(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLEM(buff, o);
        const c1 = this.F.fromRprLEM(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const c1 = this.F.fromRprBEM(buff, o);
        const c0 = this.F.fromRprBEM(buff, o+this.F.n8);
        return [c0, c1];
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

class F3Field {
    constructor(F, nonResidue) {
        this.type="F3";
        this.F = F;
        this.zero = [this.F.zero, this.F.zero, this.F.zero];
        this.one = [this.F.one, this.F.zero, this.F.zero];
        this.negone = this.neg(this.one);
        this.nonResidue = nonResidue;
        this.m = F.m*3;
        this.p = F.p;
        this.n64 = F.n64*3;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
    }

    _mulByNonResidue(a) {
        return this.F.mul(this.nonResidue, a);
    }

    copy(a) {
        return [this.F.copy(a[0]), this.F.copy(a[1]), this.F.copy(a[2])];
    }

    add(a, b) {
        return [
            this.F.add(a[0], b[0]),
            this.F.add(a[1], b[1]),
            this.F.add(a[2], b[2])
        ];
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        return [
            this.F.sub(a[0], b[0]),
            this.F.sub(a[1], b[1]),
            this.F.sub(a[2], b[2])
        ];
    }

    neg(a) {
        return this.sub(this.zero, a);
    }

    mul(a, b) {

        const aA = this.F.mul(a[0] , b[0]);
        const bB = this.F.mul(a[1] , b[1]);
        const cC = this.F.mul(a[2] , b[2]);

        return [
            this.F.add(
                aA,
                this._mulByNonResidue(
                    this.F.sub(
                        this.F.mul(
                            this.F.add(a[1], a[2]),
                            this.F.add(b[1], b[2])),
                        this.F.add(bB, cC)))),    // aA + non_residue*((b+c)*(B+C)-bB-cC),

            this.F.add(
                this.F.sub(
                    this.F.mul(
                        this.F.add(a[0], a[1]),
                        this.F.add(b[0], b[1])),
                    this.F.add(aA, bB)),
                this._mulByNonResidue( cC)),   // (a+b)*(A+B)-aA-bB+non_residue*cC

            this.F.add(
                this.F.sub(
                    this.F.mul(
                        this.F.add(a[0], a[2]),
                        this.F.add(b[0], b[2])),
                    this.F.add(aA, cC)),
                bB)];                           // (a+c)*(A+C)-aA+bB-cC)
    }

    inv(a) {
        const t0 = this.F.square(a[0]);             // t0 = a^2 ;
        const t1 = this.F.square(a[1]);             // t1 = b^2 ;
        const t2 = this.F.square(a[2]);             // t2 = c^2;
        const t3 = this.F.mul(a[0],a[1]);           // t3 = ab
        const t4 = this.F.mul(a[0],a[2]);           // t4 = ac
        const t5 = this.F.mul(a[1],a[2]);           // t5 = bc;
        // c0 = t0 - non_residue * t5;
        const c0 = this.F.sub(t0, this._mulByNonResidue(t5));
        // c1 = non_residue * t2 - t3;
        const c1 = this.F.sub(this._mulByNonResidue(t2), t3);
        const c2 = this.F.sub(t1, t4);              // c2 = t1-t4

        // t6 = (a * c0 + non_residue * (c * c1 + b * c2)).inv();
        const t6 =
            this.F.inv(
                this.F.add(
                    this.F.mul(a[0], c0),
                    this._mulByNonResidue(
                        this.F.add(
                            this.F.mul(a[2], c1),
                            this.F.mul(a[1], c2)))));

        return [
            this.F.mul(t6, c0),         // t6*c0
            this.F.mul(t6, c1),         // t6*c1
            this.F.mul(t6, c2)];        // t6*c2
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    square(a) {
        const s0 = this.F.square(a[0]);                   // s0 = a^2
        const ab = this.F.mul(a[0], a[1]);                // ab = a*b
        const s1 = this.F.add(ab, ab);                    // s1 = 2ab;
        const s2 = this.F.square(
            this.F.add(this.F.sub(a[0],a[1]), a[2]));     // s2 = (a - b + c)^2;
        const bc = this.F.mul(a[1],a[2]);                 // bc = b*c
        const s3 = this.F.add(bc, bc);                    // s3 = 2*bc
        const s4 = this.F.square(a[2]);                   // s4 = c^2


        return [
            this.F.add(
                s0,
                this._mulByNonResidue(s3)),           // s0 + non_residue * s3,
            this.F.add(
                s1,
                this._mulByNonResidue(s4)),           // s1 + non_residue * s4,
            this.F.sub(
                this.F.add( this.F.add(s1, s2) , s3 ),
                this.F.add(s0, s4))];                      // s1 + s2 + s3 - s0 - s4
    }

    isZero(a) {
        return this.F.isZero(a[0]) && this.F.isZero(a[1]) && this.F.isZero(a[2]);
    }

    eq(a, b) {
        return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]) && this.F.eq(a[2], b[2]);
    }

    affine(a) {
        return [this.F.affine(a[0]), this.F.affine(a[1]), this.F.affine(a[2])];
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    pow(base, e) {
        return exp$3(this, base, e);
    }

    exp(base, e) {
        return exp$3(this, base, e);
    }

    toString(a) {
        return `[ ${this.F.toString(a[0])} , ${this.F.toString(a[1])}, ${this.F.toString(a[2])} ]`;
    }

    fromRng(rng) {
        const c0 = this.F.fromRng(rng);
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        return [c0, c1, c2];
    }

    gt(a, b) {
        if (this.F.gt(a[0], b[0])) return true;
        if (this.F.gt(b[0], a[0])) return false;
        if (this.F.gt(a[1], b[1])) return true;
        if (this.F.gt(b[1], a[1])) return false;
        if (this.F.gt(a[2], b[2])) return true;
        return false;
    }


    geq(a, b) {
        return this.gt(a, b) || this.eq(a, b);
    }

    lt(a, b) {
        return !this.geq(a,b);
    }

    leq(a, b) {
        return !this.gt(a,b);
    }

    neq(a, b) {
        return !this.eq(a,b);
    }

    random() {
        return [this.F.random(), this.F.random(), this.F.random()];
    }


    toRprLE(buff, o, e) {
        this.F.toRprLE(buff, o, e[0]);
        this.F.toRprLE(buff, o+this.F.n8, e[1]);
        this.F.toRprLE(buff, o+this.F.n8*2, e[2]);
    }

    toRprBE(buff, o, e) {
        this.F.toRprBE(buff, o, e[2]);
        this.F.toRprBE(buff, o+this.F.n8, e[1]);
        this.F.toRprBE(buff, o+this.F.n8*2, e[0]);
    }

    toRprLEM(buff, o, e) {
        this.F.toRprLEM(buff, o, e[0]);
        this.F.toRprLEM(buff, o+this.F.n8, e[1]);
        this.F.toRprLEM(buff, o+this.F.n8*2, e[2]);
    }


    toRprBEM(buff, o, e) {
        this.F.toRprBEM(buff, o, e[2]);
        this.F.toRprBEM(buff, o+this.F.n8, e[1]);
        this.F.toRprBEM(buff, o+this.F.n8*2, e[0]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLE(buff, o);
        const c1 = this.F.fromRprLE(buff, o+this.n8);
        const c2 = this.F.fromRprLE(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const c2 = this.F.fromRprBE(buff, o);
        const c1 = this.F.fromRprBE(buff, o+this.n8);
        const c0 = this.F.fromRprBE(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLEM(buff, o);
        const c1 = this.F.fromRprLEM(buff, o+this.n8);
        const c2 = this.F.fromRprLEM(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const c2 = this.F.fromRprBEM(buff, o);
        const c1 = this.F.fromRprBEM(buff, o+this.n8);
        const c0 = this.F.fromRprBEM(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/


function isGreatest(F, a) {
    if (Array.isArray(a)) {
        for (let i=a.length-1; i>=0; i--) {
            if (!F.F.isZero(a[i])) {
                return isGreatest(F.F, a[i]);
            }
        }
        return 0;
    } else {
        const na = F.neg(a);
        return gt$2(a, na);
    }
}


class EC {

    constructor(F, g) {
        this.F = F;
        this.g = g;
        if (this.g.length == 2) this.g[2] = this.F.one;
        this.zero = [this.F.zero, this.F.one, this.F.zero];
    }

    add(p1, p2) {

        const F = this.F;

        if (this.eq(p1, this.zero)) return p2;
        if (this.eq(p2, this.zero)) return p1;

        const res = new Array(3);

        const Z1Z1 = F.square( p1[2] );
        const Z2Z2 = F.square( p2[2] );

        const U1 = F.mul( p1[0] , Z2Z2 );     // U1 = X1  * Z2Z2
        const U2 = F.mul( p2[0] , Z1Z1 );     // U2 = X2  * Z1Z1

        const Z1_cubed = F.mul( p1[2] , Z1Z1);
        const Z2_cubed = F.mul( p2[2] , Z2Z2);

        const S1 = F.mul( p1[1] , Z2_cubed);  // S1 = Y1 * Z2 * Z2Z2
        const S2 = F.mul( p2[1] , Z1_cubed);  // S2 = Y2 * Z1 * Z1Z1

        if (F.eq(U1,U2) && F.eq(S1,S2)) {
            return this.double(p1);
        }

        const H = F.sub( U2 , U1 );                    // H = U2-U1

        const S2_minus_S1 = F.sub( S2 , S1 );

        const I = F.square( F.add(H,H) );         // I = (2 * H)^2
        const J = F.mul( H , I );                      // J = H * I

        const r = F.add( S2_minus_S1 , S2_minus_S1 );  // r = 2 * (S2-S1)
        const V = F.mul( U1 , I );                     // V = U1 * I

        res[0] =
            F.sub(
                F.sub( F.square(r) , J ),
                F.add( V , V ));                       // X3 = r^2 - J - 2 * V

        const S1_J = F.mul( S1 , J );

        res[1] =
            F.sub(
                F.mul( r , F.sub(V,res[0])),
                F.add( S1_J,S1_J ));                   // Y3 = r * (V-X3)-2 S1 J

        res[2] =
            F.mul(
                H,
                F.sub(
                    F.square( F.add(p1[2],p2[2]) ),
                    F.add( Z1Z1 , Z2Z2 )));            // Z3 = ((Z1+Z2)^2-Z1Z1-Z2Z2) * H

        return res;
    }

    neg(p) {
        return [p[0], this.F.neg(p[1]), p[2]];
    }

    sub(a, b) {
        return this.add(a, this.neg(b));
    }

    double(p) {
        const F = this.F;

        const res = new Array(3);

        if (this.eq(p, this.zero)) return p;

        const A = F.square( p[0] );                    // A = X1^2
        const B = F.square( p[1] );                    // B = Y1^2
        const C = F.square( B );                       // C = B^2

        let D =
            F.sub(
                F.square( F.add(p[0] , B )),
                F.add( A , C));
        D = F.add(D,D);                    // D = 2 * ((X1 + B)^2 - A - C)

        const E = F.add( F.add(A,A), A);          // E = 3 * A
        const FF =F.square( E );                       // F = E^2

        res[0] = F.sub( FF , F.add(D,D) );         // X3 = F - 2 D

        let eightC = F.add( C , C );
        eightC = F.add( eightC , eightC );
        eightC = F.add( eightC , eightC );

        res[1] =
            F.sub(
                F.mul(
                    E,
                    F.sub( D, res[0] )),
                eightC);                                    // Y3 = E * (D - X3) - 8 * C

        const Y1Z1 = F.mul( p[1] , p[2] );
        res[2] = F.add( Y1Z1 , Y1Z1 );                 // Z3 = 2 * Y1 * Z1

        return res;
    }

    timesScalar(base, e) {
        return mulScalar(this, base, e);
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    affine(p) {
        const F = this.F;
        if (this.isZero(p)) {
            return this.zero;
        } else if (F.eq(p[2], F.one)) {
            return p;
        } else {
            const Z_inv = F.inv(p[2]);
            const Z2_inv = F.square(Z_inv);
            const Z3_inv = F.mul(Z2_inv, Z_inv);

            const res = new Array(3);
            res[0] = F.mul(p[0],Z2_inv);
            res[1] = F.mul(p[1],Z3_inv);
            res[2] = F.one;

            return res;
        }
    }

    multiAffine(arr) {
        const keys = Object.keys(arr);
        const F = this.F;
        const accMul = new Array(keys.length+1);
        accMul[0] = F.one;
        for (let i = 0; i< keys.length; i++) {
            if (F.eq(arr[keys[i]][2], F.zero)) {
                accMul[i+1] = accMul[i];
            } else {
                accMul[i+1] = F.mul(accMul[i], arr[keys[i]][2]);
            }
        }

        accMul[keys.length] = F.inv(accMul[keys.length]);

        for (let i = keys.length-1; i>=0; i--) {
            if (F.eq(arr[keys[i]][2], F.zero)) {
                accMul[i] = accMul[i+1];
                arr[keys[i]] = this.zero;
            } else {
                const Z_inv = F.mul(accMul[i], accMul[i+1]);
                accMul[i] = F.mul(arr[keys[i]][2], accMul[i+1]);

                const Z2_inv = F.square(Z_inv);
                const Z3_inv = F.mul(Z2_inv, Z_inv);

                arr[keys[i]][0] = F.mul(arr[keys[i]][0],Z2_inv);
                arr[keys[i]][1] = F.mul(arr[keys[i]][1],Z3_inv);
                arr[keys[i]][2] = F.one;
            }
        }

    }

    eq(p1, p2) {
        const F = this.F;

        if (this.F.eq(p1[2], this.F.zero)) return this.F.eq(p2[2], this.F.zero);
        if (this.F.eq(p2[2], this.F.zero)) return false;

        const Z1Z1 = F.square( p1[2] );
        const Z2Z2 = F.square( p2[2] );

        const U1 = F.mul( p1[0] , Z2Z2 );
        const U2 = F.mul( p2[0] , Z1Z1 );

        const Z1_cubed = F.mul( p1[2] , Z1Z1);
        const Z2_cubed = F.mul( p2[2] , Z2Z2);

        const S1 = F.mul( p1[1] , Z2_cubed);
        const S2 = F.mul( p2[1] , Z1_cubed);

        return (F.eq(U1,U2) && F.eq(S1,S2));
    }

    isZero(p) {
        return this.F.isZero(p[2]);
    }

    toString(p) {
        const cp = this.affine(p);
        return `[ ${this.F.toString(cp[0])} , ${this.F.toString(cp[1])} ]`;
    }

    fromRng(rng) {
        const F = this.F;
        let P = [];
        let greatest;
        do {
            P[0] = F.fromRng(rng);
            greatest = rng.nextBool();
            const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
            P[1] = F.sqrt(x3b);
        } while ((P[1] == null)||(F.isZero[P]));

        const s = isGreatest(F, P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);
        P[2] = F.one;

        if (this.cofactor) {
            P = this.mulScalar(P, this.cofactor);
        }

        P = this.affine(P);

        return P;

    }

    toRprLE(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLE(buff, o, p[0]);
        this.F.toRprLE(buff, o+this.F.n8, p[1]);
    }

    toRprBE(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprBE(buff, o, p[0]);
        this.F.toRprBE(buff, o+this.F.n8, p[1]);
    }

    toRprLEM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLEM(buff, o, p[0]);
        this.F.toRprLEM(buff, o+this.F.n8, p[1]);
    }

    toRprLEJM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLEM(buff, o, p[0]);
        this.F.toRprLEM(buff, o+this.F.n8, p[1]);
        this.F.toRprLEM(buff, o+2*this.F.n8, p[2]);
    }


    toRprBEM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprBEM(buff, o, p[0]);
        this.F.toRprBEM(buff, o+this.F.n8, p[1]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLE(buff, o);
        const y = this.F.fromRprLE(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const x = this.F.fromRprBE(buff, o);
        const y = this.F.fromRprBE(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLEM(buff, o);
        const y = this.F.fromRprLEM(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprLEJM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLEM(buff, o);
        const y = this.F.fromRprLEM(buff, o+this.F.n8);
        const z = this.F.fromRprLEM(buff, o+this.F.n8*2);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, z];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprBEM(buff, o);
        const y = this.F.fromRprBEM(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprCompressed(buff, o) {
        const F = this.F;
        const v = new Uint8Array(buff.buffer, o, F.n8);
        if (v[0] & 0x40) return this.zero;
        const P = new Array(3);

        const greatest = ((v[0] & 0x80) != 0);
        v[0] = v[0] & 0x7F;
        P[0] = F.fromRprBE(buff, o);
        if (greatest) v[0] = v[0] | 0x80;  // set back again the old value

        const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
        P[1] = F.sqrt(x3b);

        if (P[1] === null) {
            throw new Error("Invalid Point!");
        }

        const s = isGreatest(F, P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);
        P[2] = F.one;

        return P;
    }

    toRprCompressed(buff, o, p) {
        p = this.affine(p);
        const v = new Uint8Array(buff.buffer, o, this.F.n8);
        if (this.isZero(p)) {
            v.fill(0);
            v[0] = 0x40;
            return;
        }
        this.F.toRprBE(buff, o, p[0]);

        if (isGreatest(this.F, p[1])) {
            v[0] = v[0] | 0x80;
        }
    }


    fromRprUncompressed(buff, o) {
        if (buff[0] & 0x40) return this.zero;

        return this.fromRprBE(buff, o);
    }

    toRprUncompressed(buff, o, p) {
        this.toRprBE(buff, o, p);

        if (this.isZero(p)) {
            buff[o] = buff[o] | 0x40;
        }
    }


}

/* global BigInt */

function stringifyBigInts(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (o instanceof Uint8Array) {
        return fromRprLE(o, 0);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = stringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int(buff) {
    let res = 0n;
    let i = buff.length;
    let offset = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i>0) {
        if (i >= 4) {
            i -= 4;
            res += BigInt(buffV.getUint32(i)) << BigInt(offset*8);
            offset += 4;
        } else if (i >= 2) {
            i -= 2;
            res += BigInt(buffV.getUint16(i)) << BigInt(offset*8);
            offset += 2;
        } else {
            i -= 1;
            res += BigInt(buffV.getUint8(i)) << BigInt(offset*8);
            offset += 1;
        }
    }
    return res;
}

function beInt2Buff(n, len) {
    let r = n;
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = len;
    while (o > 0) {
        if (o-4 >= 0) {
            o -= 4;
            buffV.setUint32(o, Number(r & 0xFFFFFFFFn));
            r = r >> 32n;
        } else if (o-2 >= 0) {
            o -= 2;
            buffV.setUint16(o, Number(r & 0xFFFFn));
            r = r >> 16n;
        } else {
            o -= 1;
            buffV.setUint8(o, Number(r & 0xFFn));
            r = r >> 8n;
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}


function leBuff2int(buff) {
    let res = 0n;
    let i = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i<buff.length) {
        if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint32(i, true)) << BigInt( i*8);
            i += 4;
        } else if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint16(i, true)) << BigInt( i*8);
            i += 2;
        } else {
            res += BigInt(buffV.getUint8(i, true)) << BigInt( i*8);
            i += 1;
        }
    }
    return res;
}

function leInt2Buff(n, len) {
    let r = n;
    if (typeof len === "undefined") {
        len = Math.floor((bitLength$2(n) - 1) / 8) +1;
        if (len==0) len = 1;
    }
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = 0;
    while (o < len) {
        if (o+4 <= len) {
            buffV.setUint32(o, Number(r & 0xFFFFFFFFn), true );
            o += 4;
            r = r >> 32n;
        } else if (o+2 <= len) {
            buffV.setUint16(Number(o, r & 0xFFFFn), true );
            o += 2;
            r = r >> 16n;
        } else {
            buffV.setUint8(Number(o, r & 0xFFn), true );
            o += 1;
            r = r >> 8n;
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

var utils_native = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringifyBigInts: stringifyBigInts,
    unstringifyBigInts: unstringifyBigInts,
    beBuff2int: beBuff2int,
    beInt2Buff: beInt2Buff,
    leBuff2int: leBuff2int,
    leInt2Buff: leInt2Buff
});

function stringifyBigInts$1(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts$1);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = stringifyBigInts$1(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts$1(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return bigInt__default['default'](o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts$1);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts$1(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int$1(buff) {
    let res = bigInt__default['default'].zero;
    for (let i=0; i<buff.length; i++) {
        const n = bigInt__default['default'](buff[buff.length - i - 1]);
        res = res.add(n.shiftLeft(i*8));
    }
    return res;
}

function beInt2Buff$1(n, len) {
    let r = n;
    let o =len-1;
    const buff = new Uint8Array(len);
    while ((r.gt(bigInt__default['default'].zero))&&(o>=0)) {
        let c = Number(r.and(bigInt__default['default']("255")));
        buff[o] = c;
        o--;
        r = r.shiftRight(8);
    }
    if (!r.eq(bigInt__default['default'].zero)) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}


function leBuff2int$1 (buff) {
    let res = bigInt__default['default'].zero;
    for (let i=0; i<buff.length; i++) {
        const n = bigInt__default['default'](buff[i]);
        res = res.add(n.shiftLeft(i*8));
    }
    return res;
}

function leInt2Buff$1(n, len) {
    let r = n;
    let o =0;
    const buff = new Uint8Array(len);
    while ((r.gt(bigInt__default['default'].zero))&&(o<buff.length)) {
        let c = Number(r.and(bigInt__default['default'](255)));
        buff[o] = c;
        o++;
        r = r.shiftRight(8);
    }
    if (!r.eq(bigInt__default['default'].zero)) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

var utils_bigint = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringifyBigInts: stringifyBigInts$1,
    unstringifyBigInts: unstringifyBigInts$1,
    beBuff2int: beBuff2int$1,
    beInt2Buff: beInt2Buff$1,
    leBuff2int: leBuff2int$1,
    leInt2Buff: leInt2Buff$1
});

let utils = {};

const supportsNativeBigInt$2 = typeof BigInt === "function";
if (supportsNativeBigInt$2) {
    Object.assign(utils, utils_native);
} else {
    Object.assign(utils, utils_bigint);
}


const _revTable$1 = [];
for (let i=0; i<256; i++) {
    _revTable$1[i] = _revSlow$1(i, 8);
}

function _revSlow$1(idx, bits) {
    let res =0;
    let a = idx;
    for (let i=0; i<bits; i++) {
        res <<= 1;
        res = res | (a &1);
        a >>=1;
    }
    return res;
}

utils.bitReverse = function bitReverse(idx, bits) {
    return (
        _revTable$1[idx >>> 24] |
        (_revTable$1[(idx >>> 16) & 0xFF] << 8) |
        (_revTable$1[(idx >>> 8) & 0xFF] << 16) |
        (_revTable$1[idx & 0xFF] << 24)
    ) >>> (32-bits);
};


utils.log2 = function log2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
};

utils.buffReverseBits = function buffReverseBits(buff, eSize) {
    const n = buff.byteLength /eSize;
    const bits = utils.log2(n);
    if (n != (1 << bits)) {
        throw new Error("Invalid number of pointers");
    }
    for (let i=0; i<n; i++) {
        const r = utils.bitReverse(i,bits);
        if (i>r) {
            const tmp = buff.slice(i*eSize, (i+1)*eSize);
            buff.set( buff.slice(r*eSize, (r+1)*eSize), i*eSize);
            buff.set(tmp, r*eSize);
        }
    }
};

let {
    bitReverse,
    log2: log2$1,
    buffReverseBits,
    stringifyBigInts: stringifyBigInts$2,
    unstringifyBigInts: unstringifyBigInts$2,
    beBuff2int: beBuff2int$2,
    beInt2Buff: beInt2Buff$2,
    leBuff2int: leBuff2int$2,
    leInt2Buff: leInt2Buff$2,
} = utils;

var _utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bitReverse: bitReverse,
    log2: log2$1,
    buffReverseBits: buffReverseBits,
    stringifyBigInts: stringifyBigInts$2,
    unstringifyBigInts: unstringifyBigInts$2,
    beBuff2int: beBuff2int$2,
    beInt2Buff: beInt2Buff$2,
    leBuff2int: leBuff2int$2,
    leInt2Buff: leInt2Buff$2
});

const PAGE_SIZE = 1<<30;

class BigBuffer {

    constructor(size) {
        this.buffers = [];
        this.byteLength = size;
        for (let i=0; i<size; i+= PAGE_SIZE) {
            const n = Math.min(size-i, PAGE_SIZE);
            this.buffers.push(new Uint8Array(n));
        }

    }

    slice(fr, to) {
        if ( to === undefined ) to = this.byteLength;
        if ( fr === undefined ) fr = 0;
        const len = to-fr;

        const firstPage = Math.floor(fr / PAGE_SIZE);
        const lastPage = Math.floor((fr+len-1) / PAGE_SIZE);

        if ((firstPage == lastPage)||(len==0))
            return this.buffers[firstPage].slice(fr%PAGE_SIZE, fr%PAGE_SIZE + len);

        let buff;

        let p = firstPage;
        let o = fr % PAGE_SIZE;
        // Remaining bytes to read
        let r = len;
        while (r>0) {
            // bytes to copy from this page
            const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
            const srcView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset+o, l);
            if (l == len) return srcView.slice();
            if (!buff) {
                if (len <= PAGE_SIZE) {
                    buff = new Uint8Array(len);
                } else {
                    buff = new BigBuffer(len);
                }
            }
            buff.set(srcView, len-r);
            r = r-l;
            p ++;
            o = 0;
        }

        return buff;
    }

    set(buff, offset) {
        if (offset === undefined) offset = 0;

        const len = buff.byteLength;

        if (len==0) return;

        const firstPage = Math.floor(offset / PAGE_SIZE);
        const lastPage = Math.floor((offset+len-1) / PAGE_SIZE);

        if (firstPage == lastPage) {
            if ((buff instanceof BigBuffer)&&(buff.buffers.length==1)) {
                return this.buffers[firstPage].set(buff.buffers[0], offset % PAGE_SIZE);
            } else {
                return this.buffers[firstPage].set(buff, offset % PAGE_SIZE);
            }

        }


        let p = firstPage;
        let o = offset % PAGE_SIZE;
        let r = len;
        while (r>0) {
            const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
            const srcView = buff.slice( len -r, len -r+l);
            const dstView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset + o, l);
            dstView.set(srcView);
            r = r-l;
            p ++;
            o = 0;
        }

    }
}

function buildBatchConvert(tm, fnName, sIn, sOut) {
    return async function batchConvert(buffIn) {
        const nPoints = Math.floor(buffIn.byteLength / sIn);
        if ( nPoints * sIn !== buffIn.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const buffChunk = buffIn.slice(i*pointsPerChunk*sIn, i*pointsPerChunk*sIn + n*sIn);
            const task = [
                {cmd: "ALLOCSET", var: 0, buff:buffChunk},
                {cmd: "ALLOC", var: 1, len:sOut * n},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: n},
                    {var: 1}
                ]},
                {cmd: "GET", out: 0, var: 1, len:sOut * n},
            ];
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buffIn instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };
}

class WasmField1 {

    constructor(tm, prefix, n8, p) {
        this.tm = tm;
        this.prefix = prefix;

        this.p = p;
        this.n8 = n8;
        this.type = "F1";
        this.m = 1;

        this.half = shiftRight$2(p, one);
        this.bitLength = bitLength$2(p);
        this.mask = sub$2(shiftLeft$2(one, this.bitLength), one);

        this.pOp1 = tm.alloc(n8);
        this.pOp2 = tm.alloc(n8);
        this.pOp3 = tm.alloc(n8);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = this.tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = this.tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

        this.n64 = Math.floor(n8/8);
        this.n32 = Math.floor(n8/4);

        if(this.n64*8 != this.n8) {
            throw new Error("n8 must be a multiple of 8");
        }

        this.half = shiftRight$2(this.p, one);
        this.nqr = this.two;
        let r = this.exp(this.nqr, this.half);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.add(this.nqr, this.one);
            r = this.exp(this.nqr, this.half);
        }

        this.shift = this.mul(this.nqr, this.nqr);
        this.shiftInv = this.inv(this.shift);

        this.s = 0;
        let t = sub$2(this.p, one);

        while ( !isOdd$2(t) ) {
            this.s = this.s + 1;
            t = shiftRight$2(t, one);
        }

        this.w = [];
        this.w[this.s] = this.exp(this.nqr, t);

        for (let i= this.s-1; i>=0; i--) {
            this.w[i] = this.square(this.w[i+1]);
        }

        if (!this.eq(this.w[0], this.one)) {
            throw new Error("Error calculating roots of unity");
        }

        this.batchToMontgomery = buildBatchConvert(tm, prefix + "_batchToMontgomery", this.n8, this.n8);
        this.batchFromMontgomery = buildBatchConvert(tm, prefix + "_batchFromMontgomery", this.n8, this.n8);
    }


    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }


    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        let ra = e$2(a, b);
        if (isNegative$2(ra)) {
            ra = neg$2(ra);
            if (gt$2(ra, this.p)) {
                ra = mod$2(ra, this.p);
            }
            ra = sub$2(this.p, ra);
        } else {
            if (gt$2(ra, this.p)) {
                ra = mod$2(ra, this.p);
            }
        }
        const buff = leInt2Buff$2(ra, this.n8);
        return this.toMontgomery(buff);
    }

    toString(a, radix) {
        const an = this.fromMontgomery(a);
        const s = fromRprLE(an, 0);
        return toString(s, radix);
    }

    fromRng(rng) {
        let v;
        const buff = new Uint8Array(this.n8);
        do {
            v = zero;
            for (let i=0; i<this.n64; i++) {
                v = add$2(v,  shiftLeft$2(rng.nextU64(), 64*i));
            }
            v = band$2(v, this.mask);
        } while (geq$2(v, this.p));
        toRprLE(buff, 0, v, this.n8);
        return buff;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const an = this.fromMontgomery(a);
        return fromRprLE(an, 0);
    }

    fromObject(a) {
        const buff = new Uint8Array(this.n8);
        toRprLE(buff, 0, a, this.n8);
        return this.toMontgomery(buff);
    }

    toRprLE(buff, offset, a) {
        buff.set(this.fromMontgomery(a), offset);
    }

    toRprBE(buff, offset, a) {
        const buff2 = this.fromMontgomery(a);
        for (let i=0; i<this.n8/2; i++) {
            const aux = buff2[i];
            buff2[i] = buff2[this.n8-1-i];
            buff2[this.n8-1-i] = aux;
        }
        buff.set(buff2, offset);
    }

    fromRprLE(buff, offset) {
        offset = offset || 0;
        const res = buff.slice(offset, offset + this.n8);
        return this.toMontgomery(res);
    }

    async batchInverse(buffIn) {
        const sIn = this.n8;
        const sOut = this.n8;
        const nPoints = Math.floor(buffIn.byteLength / sIn);
        if ( nPoints * sIn !== buffIn.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const pointsPerChunk = Math.floor(nPoints/this.tm.concurrency);
        const opPromises = [];
        for (let i=0; i<this.tm.concurrency; i++) {
            let n;
            if (i< this.tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const buffChunk = buffIn.slice(i*pointsPerChunk*sIn, i*pointsPerChunk*sIn + n*sIn);
            const task = [
                {cmd: "ALLOCSET", var: 0, buff:buffChunk},
                {cmd: "ALLOC", var: 1, len:sOut * n},
                {cmd: "CALL", fnName: this.prefix + "_batchInverse", params: [
                    {var: 0},
                    {val: sIn},
                    {val: n},
                    {var: 1},
                    {val: sOut},
                ]},
                {cmd: "GET", out: 0, var: 1, len:sOut * n},
            ];
            opPromises.push(
                this.tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buffIn instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };

}

class WasmField2 {

    constructor(tm, prefix, F) {
        this.tm = tm;
        this.prefix = prefix;

        this.F = F;
        this.type = "F2";
        this.m = F.m * 2;
        this.n8 = this.F.n8*2;
        this.n32 = this.F.n32*2;
        this.n64 = this.F.n64*2;

        this.pOp1 = tm.alloc(F.n8*2);
        this.pOp2 = tm.alloc(F.n8*2);
        this.pOp3 = tm.alloc(F.n8*2);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }

    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    mul1(a,b) {
        return this.op2("_mul1", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        if ((Array.isArray(a)) && (a.length == 2)) {
            const c1 = this.F.e(a[0], b);
            const c2 = this.F.e(a[1], b);
            const res = new Uint8Array(this.F.n8*2);
            res.set(c1);
            res.set(c2, this.F.n8*2);
            return res;
        } else {
            throw new Error("invalid F2");
        }
    }

    toString(a, radix) {
        const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
        const s2 = this.F.toString(a.slice(this.F.n8), radix);
        return `[${s1}, ${s2}]`;
    }

    fromRng(rng) {
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        const res = new Uint8Array(this.F.n8*2);
        res.set(c1);
        res.set(c2, this.F.n8);
        return res;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const c1 = this.F.toObject(a.slice(0, this.F.n8));
        const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        return [c1, c2];
    }

    fromObject(a) {
        const buff = new Uint8Array(this.F.n8*2);
        const b1 = this.F.fromObject(a[0]);
        const b2 = this.F.fromObject(a[1]);
        buff.set(b1);
        buff.set(b2, this.F.n8);
        return buff;
    }

    c1(a) {
        return a.slice(0, this.F.n8);
    }

    c2(a) {
        return a.slice(this.F.n8);
    }

}

class WasmField3 {

    constructor(tm, prefix, F) {
        this.tm = tm;
        this.prefix = prefix;

        this.F = F;
        this.type = "F3";
        this.m = F.m * 3;
        this.n8 = this.F.n8*3;
        this.n32 = this.F.n32*3;
        this.n64 = this.F.n64*3;

        this.pOp1 = tm.alloc(F.n8*3);
        this.pOp2 = tm.alloc(F.n8*3);
        this.pOp3 = tm.alloc(F.n8*3);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }


    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.getBuff(this.pOp3, this.n8);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        if ((Array.isArray(a)) && (a.length == 3)) {
            const c1 = this.F.e(a[0], b);
            const c2 = this.F.e(a[1], b);
            const c3 = this.F.e(a[2], b);
            const res = new Uint8Array(this.F.n8*3);
            res.set(c1);
            res.set(c2, this.F.n8);
            res.set(c3, this.F.n8*2);
            return res;
        } else {
            throw new Error("invalid F3");
        }
    }

    toString(a, radix) {
        const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
        const s2 = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
        const s3 = this.F.toString(a.slice(this.F.n8*2), radix);
        return `[${s1}, ${s2}, ${s3}]`;
    }

    fromRng(rng) {
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        const c3 = this.F.fromRng(rng);
        const res = new Uint8Array(this.F.n8*3);
        res.set(c1);
        res.set(c2, this.F.n8);
        res.set(c3, this.F.n8*2);
        return res;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const c1 = this.F.toObject(a.slice(0, this.F.n8));
        const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        const c3 = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
        return [c1, c2, c3];
    }

    fromObject(a) {
        const buff = new Uint8Array(this.F.n8*3);
        const b1 = this.F.fromObject(a[0]);
        const b2 = this.F.fromObject(a[1]);
        const b3 = this.F.fromObject(a[2]);
        buff.set(b1);
        buff.set(b2, this.F.n8);
        buff.set(b3, this.F.n8*2);
        return buff;
    }

    c1(a) {
        return a.slice(0, this.F.n8);
    }

    c2(a) {
        return a.slice(this.F.n8, this.F.n8*2);
    }

    c3(a) {
        return a.slice(this.F.n8*2);
    }

}

class WasmCurve {

    constructor(tm, prefix, F, pGen, pGb, cofactor) {
        this.tm = tm;
        this.prefix = prefix;
        this.F = F;

        this.pOp1 = tm.alloc(F.n8*3);
        this.pOp2 = tm.alloc(F.n8*3);
        this.pOp3 = tm.alloc(F.n8*3);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = this.tm.getBuff(this.pOp1, F.n8*3);
        this.tm.instance.exports[prefix + "_zeroAffine"](this.pOp1);
        this.zeroAffine = this.tm.getBuff(this.pOp1, F.n8*2);
        this.one = this.tm.getBuff(pGen, F.n8*3);
        this.g = this.one;
        this.oneAffine = this.tm.getBuff(pGen, F.n8*2);
        this.gAffine = this.oneAffine;
        this.b = this.tm.getBuff(pGb, F.n8);

        if (cofactor) {
            this.cofactor = toLEBuff(cofactor);
        }

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

        this.batchLEMtoC = buildBatchConvert(tm, prefix + "_batchLEMtoC", F.n8*2, F.n8);
        this.batchLEMtoU = buildBatchConvert(tm, prefix + "_batchLEMtoU", F.n8*2, F.n8*2);
        this.batchCtoLEM = buildBatchConvert(tm, prefix + "_batchCtoLEM", F.n8, F.n8*2);
        this.batchUtoLEM = buildBatchConvert(tm, prefix + "_batchUtoLEM", F.n8*2, F.n8*2);
        this.batchToJacobian = buildBatchConvert(tm, prefix + "_batchToJacobian", F.n8*2, F.n8*3);
        this.batchToAffine = buildBatchConvert(tm, prefix + "_batchToAffine", F.n8*3, F.n8*2);
    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    op2bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    op1Affine(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*2);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_add", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_addMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_addMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_addAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    sub(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_sub", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_subMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_subMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_subAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    neg(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1("_neg", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1Affine("_negAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    double(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1("_double", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1("_doubleAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    isZero(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1Bool("_isZero", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1Bool("_isZeroAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    timesScalar(a, s) {
        if (!(s instanceof Uint8Array)) {
            s = toLEBuff(e$2(s));
        }
        let fnName;
        if (a.byteLength == this.F.n8*3) {
            fnName = this.prefix + "_timesScalar";
        } else if (a.byteLength == this.F.n8*2) {
            fnName = this.prefix + "_timesScalarAffine";
        } else {
            throw new Error("invalid point size");
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, s);
        this.tm.instance.exports[fnName](this.pOp1, this.pOp2, s.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    timesFr(a, s) {
        let fnName;
        if (a.byteLength == this.F.n8*3) {
            fnName = this.prefix + "_timesFr";
        } else if (a.byteLength == this.F.n8*2) {
            fnName = this.prefix + "_timesFrAffine";
        } else {
            throw new Error("invalid point size");
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, s);
        this.tm.instance.exports[fnName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    eq(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2bool("_eq", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2bool("_eqMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2bool("_eqMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2bool("_eqAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    toAffine(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1Affine("_toAffine", a);
        } else if (a.byteLength == this.F.n8*2) {
            return a;
        } else {
            throw new Error("invalid point size");
        }
    }

    toJacobian(a) {
        if (a.byteLength == this.F.n8*3) {
            return a;
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1("_toJacobian", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    toRprUncompressed(arr, offset, a) {
        this.tm.setBuff(this.pOp1, a);
        if (a.byteLength == this.F.n8*3) {
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
        } else if (a.byteLength != this.F.n8*2) {
            throw new Error("invalid point size");
        }
        this.tm.instance.exports[this.prefix + "_LEMtoU"](this.pOp1, this.pOp1);
        const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
        arr.set(res, offset);
    }

    fromRprUncompressed(arr, offset) {
        const buff = arr.slice(offset, offset + this.F.n8*2);
        this.tm.setBuff(this.pOp1, buff);
        this.tm.instance.exports[this.prefix + "_UtoLEM"](this.pOp1, this.pOp1);
        return this.tm.getBuff(this.pOp1, this.F.n8*2);
    }

    toRprCompressed(arr, offset, a) {
        this.tm.setBuff(this.pOp1, a);
        if (a.byteLength == this.F.n8*3) {
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
        } else if (a.byteLength != this.F.n8*2) {
            throw new Error("invalid point size");
        }
        this.tm.instance.exports[this.prefix + "_LEMtoC"](this.pOp1, this.pOp1);
        const res = this.tm.getBuff(this.pOp1, this.F.n8);
        arr.set(res, offset);
    }

    fromRprCompressed(arr, offset) {
        const buff = arr.slice(offset, offset + this.F.n8);
        this.tm.setBuff(this.pOp1, buff);
        this.tm.instance.exports[this.prefix + "_CtoLEM"](this.pOp1, this.pOp2);
        return this.tm.getBuff(this.pOp2, this.F.n8*2);
    }

    toUncompressed(a) {
        const buff = new Uint8Array(this.F.n8*2);
        this.toRprUncompressed(buff, 0, a);
        return buff;
    }

    toRprLEM(arr, offset, a) {
        if (a.byteLength == this.F.n8*2) {
            arr.set(a, offset);
            return;
        } else if (a.byteLength == this.F.n8*3) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
            const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
            arr.set(res, offset);
        } else {
            throw new Error("invalid point size");
        }
    }

    fromRprLEM(arr, offset) {
        offset = offset || 0;
        return arr.slice(offset, offset+this.F.n8*2);
    }

    toString(a, radix) {
        if (a.byteLength == this.F.n8*3) {
            const x = this.F.toString(a.slice(0, this.F.n8), radix);
            const y = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
            const z = this.F.toString(a.slice(this.F.n8*2), radix);
            return `[ ${x}, ${y}, ${z} ]`;
        } else if (a.byteLength == this.F.n8*2) {
            const x = this.F.toString(a.slice(0, this.F.n8), radix);
            const y = this.F.toString(a.slice(this.F.n8), radix);
            return `[ ${x}, ${y} ]`;
        } else {
            throw new Error("invalid point size");
        }
    }

    isValid(a) {
        if (this.isZero(a)) return true;
        const F = this.F;
        const aa = this.toAffine(a);
        const x = aa.slice(0, this.F.n8);
        const y = aa.slice(this.F.n8, this.F.n8*2);
        const x3b = F.add(F.mul(F.square(x),x), this.b);
        const y2 = F.square(y);
        return F.eq(x3b, y2);
    }

    fromRng(rng) {
        const F = this.F;
        let P = [];
        let greatest;
        let x3b;
        do {
            P[0] = F.fromRng(rng);
            greatest = rng.nextBool();
            x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
        } while (!F.isSquare(x3b));

        P[1] = F.sqrt(x3b);

        const s = F.isNegative(P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);

        let Pbuff = new Uint8Array(this.F.n8*2);
        Pbuff.set(P[0]);
        Pbuff.set(P[1], this.F.n8);

        if (this.cofactor) {
            Pbuff = this.timesScalar(Pbuff, this.cofactor);
        }

        return Pbuff;
    }



    toObject(a) {
        if (this.isZero(a)) {
            return [
                this.F.toObject(this.F.zero),
                this.F.toObject(this.F.one),
                this.F.toObject(this.F.zero),
            ];
        }
        const x = this.F.toObject(a.slice(0, this.F.n8));
        const y = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        let z;
        if (a.byteLength == this.F.n8*3) {
            z = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
        } else {
            z = this.F.toObject(this.F.one);
        }
        return [x, y, z];
    }

    fromObject(a) {
        const x = this.F.fromObject(a[0]);
        const y = this.F.fromObject(a[1]);
        let z;
        if (a.length==3) {
            z = this.F.fromObject(a[2]);
        } else {
            z = this.F.one;
        }
        if (this.F.isZero(z, this.F.one)) {
            return this.zeroAffine;
        } else if (this.F.eq(z, this.F.one)) {
            const buff = new Uint8Array(this.F.n8*2);
            buff.set(x);
            buff.set(y, this.F.n8);
            return buff;
        } else {
            const buff = new Uint8Array(this.F.n8*3);
            buff.set(x);
            buff.set(y, this.F.n8);
            buff.set(z, this.F.n8*2);
            return buff;
        }
    }

    e(a) {
        if (a instanceof Uint8Array) return a;
        return this.fromObject(a);
    }

    x(a) {
        const tmp = this.toAffine(a);
        return tmp.slice(0, this.F.n8);
    }

    y(a) {
        const tmp = this.toAffine(a);
        return tmp.slice(this.F.n8);
    }

}

/* global WebAssembly */

function thread(self) {
    const MAXMEM = 32767;
    let instance;
    let memory;

    if (self) {
        self.onmessage = function(e) {
            let data;
            if (e.data) {
                data = e.data;
            } else {
                data = e;
            }

            if (data[0].cmd == "INIT") {
                init(data[0]).then(function() {
                    self.postMessage(data.result);
                });
            } else if (data[0].cmd == "TERMINATE") {
                process.exit();
            } else {
                const res = runTask(data);
                self.postMessage(res);
            }
        };
    } else {
        console.warn(`No self defined for thread`);
    }


    async function init(data) {
        console.debug(`init`);
        const code = new Uint8Array(data.code);
        const wasmModule = await WebAssembly.compile(code);
        console.debug(`compiled ${data.init}`);
        memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});

        instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            },
            imports: {
                reportProgress: val => reportProgress(val)
            },
        });
    }



    function alloc(length) {
        const u32 = new Uint32Array(memory.buffer, 0, 1);
        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers
        const res = u32[0];
        u32[0] += length;
        if (u32[0] + length > memory.buffer.byteLength) {
            const currentPages = memory.buffer.byteLength / 0x10000;
            let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;
            if (requiredPages>MAXMEM) requiredPages=MAXMEM;
            memory.grow(requiredPages-currentPages);
        }
        return res;
    }

    function allocBuffer(buffer) {
        const p = alloc(buffer.byteLength);
        setBuffer(p, buffer);
        return p;
    }

    function getBuffer(pointer, length) {
        const u8 = new Uint8Array(memory.buffer);
        return new Uint8Array(u8.buffer, u8.byteOffset + pointer, length);
    }

    function setBuffer(pointer, buffer) {
        const u8 = new Uint8Array(memory.buffer);
        u8.set(new Uint8Array(buffer), pointer);
    }

    function runTask(task) {
        if (task[0].cmd == "INIT") {
            return init(task[0]);
        }
        const ctx = {
            vars: [],
            out: []
        };
        const u32a = new Uint32Array(memory.buffer, 0, 1);
        const oldAlloc = u32a[0];
        for (let i=0; i<task.length; i++) {
            switch (task[i].cmd) {
            case "ALLOCSET":
                ctx.vars[task[i].var] = allocBuffer(task[i].buff);
                break;
            case "ALLOC":
                ctx.vars[task[i].var] = alloc(task[i].len);
                break;
            case "SET":
                setBuffer(ctx.vars[task[i].var], task[i].buff);
                break;
            case "CALL": {                
                const params = [];
                for (let j=0; j<task[i].params.length; j++) {
                    const p = task[i].params[j];
                    if (typeof p.var !== "undefined") {
                        params.push(ctx.vars[p.var] + (p.offset || 0));
                    } else if (typeof p.val != "undefined") {
                        params.push(p.val);
                    }
                }
                instance.exports[task[i].fnName](...params);
                break;
            }
            case "GET":
                ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
                break;
            default:
                throw new Error("Invalid cmd");
            }
        }
        const u32b = new Uint32Array(memory.buffer, 0, 1);
        u32b[0] = oldAlloc;
        return ctx.out;
    }

    function reportProgress(count) {
        self.postMessage({ type: 'progress', data: count });
    }

    return runTask;
}

/* global window, navigator, Blob, Worker, WebAssembly */
/*
    Copyright 2019 0KIMS association.

    This file is part of wasmsnark (Web Assembly zkSnark Prover).

    wasmsnark is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmsnark is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
*/

// const MEM_SIZE = 1000;  // Memory size in 64K Pakes (512Mb)
const MEM_SIZE = 25;  // Memory size in 64K Pakes (1600Kb)

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function base64ToArrayBuffer(base64) {
    if (process.browser) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    } else {
        return new Uint8Array(Buffer.from(base64, "base64"));
    }
}

function stringToBase64(str) {
    if (process.browser) {
        return window.btoa(str);
    } else {
        return Buffer.from(str).toString("base64");
    }
}

const pm = thread.toString();
console.debug(`postMsg: ${pm}`);
const threadSource = stringToBase64("(" + pm + ")(self)");
const workerSource = "data:application/javascript;base64," + threadSource;



async function buildThreadManager(wasm, singleThread) {
    const tm = new ThreadManager();

    tm.memory = new WebAssembly.Memory({initial:MEM_SIZE});
    tm.u8 = new Uint8Array(tm.memory.buffer);
    tm.u32 = new Uint32Array(tm.memory.buffer);

    const wasmModule = await WebAssembly.compile(base64ToArrayBuffer(wasm.code));


    tm.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": tm.memory
        },
        imports: {
            reportProgress: val => console.debug(`progress: ${val}`)
        }
    });

    tm.singleThread = singleThread;
    tm.initalPFree = tm.u32[0];   // Save the Pointer to free space.
    tm.pq = wasm.pq;
    tm.pr = wasm.pr;
    tm.pG1gen = wasm.pG1gen;
    tm.pG1zero = wasm.pG1zero;
    tm.pG2gen = wasm.pG2gen;
    tm.pG2zero = wasm.pG2zero;
    tm.pOneT = wasm.pOneT;

    //    tm.pTmp0 = tm.alloc(curve.G2.F.n8*3);
    //    tm.pTmp1 = tm.alloc(curve.G2.F.n8*3);


    if (singleThread) {
        tm.code = base64ToArrayBuffer(wasm.code);
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice()
        }]);
        tm.concurrency  = 1;
    } else {
        tm.workers = [];
        tm.pendingDeferreds = [];
        tm.working = [];
        tm.progress = [];

        let concurrency;

        if ((typeof(navigator) === "object") && navigator.hardwareConcurrency) {
            concurrency = navigator.hardwareConcurrency;
        } else {
            concurrency = os__default['default'].cpus().length;
        }
        // Limit to 64 threads for memory reasons.
        if (concurrency>64) concurrency=64;
        tm.concurrency = concurrency;

        for (let i = 0; i<concurrency; i++) {

            //tm.workers[i] = new Worker('data:,postMessage("hello")');

            tm.workers[i] = new Worker__default['default'](workerSource);

            tm.workers[i].addEventListener("message", getOnMsg(i));

            tm.working[i]=false;

            tm.progress[i] = 0;
        }

        const initPromises = [];
        for (let i=0; i<tm.workers.length;i++) {
            const copyCode = base64ToArrayBuffer(wasm.code).slice();
            initPromises.push(tm.postAction(i, [{
                cmd: "INIT",
                init: MEM_SIZE,
                code: copyCode
            }], [copyCode.buffer]));
        }

        await Promise.all(initPromises);

    }
    return tm;

    function getOnMsg(i) {
        return function(e) {
            let data;
            if ((e)&&(e.data)) {
                if (e.data.type) { // interim progress 
                    //console.log(`Message ${e.data.type} ${e.data.data}`);
                    tm.progress[i] = e.data.data;
                    aggregateProgress();
                    return;
                } else { // result
                    data = e.data;
                }
            } else {
                data = e;
            }

            tm.working[i]=false;
            tm.pendingDeferreds[i].resolve(data);
            tm.processWorks();
        };
    }

    function aggregateProgress() {
        if (!tm.singleThread) {
            const p = tm.progress.reduce((tot, val) => tot+=val );
            console.debug(`Compute progress: ${p}`);
            if (tm.progressCallback) {
                tm.progressCallback(p);
            }
        }
    }

}

class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
    }

    startSyncOp() {
        if (this.oldPFree != 0) throw new Error("Sync operation in progress");
        this.oldPFree = this.u32[0];
    }

    endSyncOp() {
        if (this.oldPFree == 0) throw new Error("No sync operation in progress");
        this.u32[0] = this.oldPFree;
        this.oldPFree = 0;
    }

    postAction(workerId, e, transfers, _deferred) {
        if (this.working[workerId]) {
            throw new Error("Posting a job to a working worker");
        }
        this.working[workerId] = true;

        this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
        this.workers[workerId].postMessage(e, transfers);

        return this.pendingDeferreds[workerId].promise;
    }

    processWorks() {
        for (let i=0; (i<this.workers.length)&&(this.actionQueue.length > 0); i++) {
            if (this.working[i] == false) {
                const work = this.actionQueue.shift();
                this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }
    }

    queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            this.actionQueue.push({
                data: actionData,
                transfers: transfers,
                deferred: d
            });
            this.processWorks();
        }
        return d.promise;
    }

    resetMemory() {
        this.u32[0] = this.initalPFree;
    }

    allocBuff(buff) {
        const pointer = this.alloc(buff.byteLength);
        this.setBuff(pointer, buff);
        return pointer;
    }

    getBuff(pointer, length) {
        return this.u8.slice(pointer, pointer+ length);
    }

    setBuff(pointer, buffer) {
        this.u8.set(new Uint8Array(buffer), pointer);
    }

    alloc(length) {
        while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    async terminate() {
        for (let i=0; i<this.workers.length; i++) {
            this.workers[i].postMessage([{cmd: "TERMINATE"}]);
        }
        await sleep(200);
    }

}

function buildBatchApplyKey(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = curve.tm;

    curve[groupName].batchApplyKey = async function(buff, first, inc, inType, outType, progress) {
        inType = inType || "affine";
        outType = outType || "affine";
        let fnName, fnAffine;
        let sGin, sGmid, sGout;
        if (groupName == "G1") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g1m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g1m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g1m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "G2") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g2m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g2m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g2m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "Fr") {
            fnName = "frm_batchApplyKey";
            sGin = G.n8;
            sGmid = G.n8;
            sGout = G.n8;
        } else {
            throw new Error("Invalid group: " + groupName);
        }
        const nPoints = Math.floor(buff.byteLength / sGin);
        const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
        if (progress) {
            tm.progressCallback = progress.progressCallback;
        }
        const opPromises = [];
        inc = Fr.e(inc);
        let t = Fr.e(first);
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const task = [];

            task.push({
                cmd: "ALLOCSET",
                var: 0,
                buff: buff.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin)
            });
            task.push({cmd: "ALLOCSET", var: 1, buff: t});
            task.push({cmd: "ALLOCSET", var: 2, buff: inc});
            task.push({cmd: "ALLOC", var: 3, len: n*Math.max(sGmid, sGout)});
            task.push({
                cmd: "CALL",
                fnName: fnName,
                params: [
                    {var: 0},
                    {val: n},
                    {var: 1},
                    {var: 2},
                    {var:3}
                ]
            });
            if (fnAffine) {
                task.push({
                    cmd: "CALL",
                    fnName: fnAffine,
                    params: [
                        {var: 3},
                        {val: n},
                        {var: 3},
                    ]
                });
            }
            task.push({cmd: "GET", out: 0, var: 3, len: n*sGout});

            opPromises.push(tm.queueAction(task));
            t = Fr.mul(t, Fr.exp(inc, n));
        }

        const result = await Promise.all(opPromises);

        if (progress.progressCallback) progress.progressCallback({type: "end-chunk", count: nPoints});

        let outBuff;
        if (buff instanceof BigBuffer) {
            outBuff = new BigBuffer(nPoints*sGout);
        } else {
            outBuff = new Uint8Array(nPoints*sGout);
        }

        let p=0;
        for (let i=0; i<result.length; i++) {
            outBuff.set(result[i][0], p);
            p += result[i][0].byteLength;
        }

        return outBuff;
    };
}

function buildPairing(curve) {
    const tm = curve.tm;
    curve.pairing = function pairing(a, b) {

        tm.startSyncOp();
        const pA = tm.allocBuff(curve.G1.toJacobian(a));
        const pB = tm.allocBuff(curve.G2.toJacobian(b));
        const pRes = tm.alloc(curve.Gt.n8);
        tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);

        const res = tm.getBuff(pRes, curve.Gt.n8);

        tm.endSyncOp();
        return res;
    };

    curve.pairingEq = async function pairingEq() {
        let  buffCt;
        let nEqs;
        if ((arguments.length % 2) == 1) {
            buffCt = arguments[arguments.length-1];
            nEqs = (arguments.length -1) /2;
        } else {
            buffCt = curve.Gt.one;
            nEqs = arguments.length /2;
        }

        const opPromises = [];
        for (let i=0; i<nEqs; i++) {

            const task = [];

            const g1Buff = curve.G1.toJacobian(arguments[i*2]);
            task.push({cmd: "ALLOCSET", var: 0, buff: g1Buff});
            task.push({cmd: "ALLOC", var: 1, len: curve.prePSize});

            const g2Buff = curve.G2.toJacobian(arguments[i*2 +1]);
            task.push({cmd: "ALLOCSET", var: 2, buff: g2Buff});
            task.push({cmd: "ALLOC", var: 3, len: curve.preQSize});

            task.push({cmd: "ALLOC", var: 4, len: curve.Gt.n8});

            task.push({cmd: "CALL", fnName: curve.name + "_prepareG1", params: [
                {var: 0},
                {var: 1}
            ]});

            task.push({cmd: "CALL", fnName: curve.name + "_prepareG2", params: [
                {var: 2},
                {var: 3}
            ]});

            task.push({cmd: "CALL", fnName: curve.name + "_millerLoop", params: [
                {var: 1},
                {var: 3},
                {var: 4}
            ]});

            task.push({cmd: "GET", out: 0, var: 4, len: curve.Gt.n8});

            opPromises.push(
                tm.queueAction(task)
            );
        }


        const result = await Promise.all(opPromises);

        tm.startSyncOp();
        const pRes = tm.alloc(curve.Gt.n8);
        tm.instance.exports.ftm_one(pRes);

        for (let i=0; i<result.length; i++) {
            const pMR = tm.allocBuff(result[i][0]);
            tm.instance.exports.ftm_mul(pRes, pMR, pRes);
        }
        tm.instance.exports[curve.name + "_finalExponentiation"](pRes, pRes);

        const pCt = tm.allocBuff(buffCt);

        const r = !!tm.instance.exports.ftm_eq(pRes, pCt);

        tm.endSyncOp();

        return r;
    };

    curve.prepareG1 = function(p) {
        this.tm.startSyncOp();
        const pP = this.tm.allocBuff(p);
        const pPrepP = this.tm.alloc(this.prePSize);
        this.tm.instance.exports[this.name + "_prepareG1"](pP, pPrepP);
        const res = this.tm.getBuff(pPrepP, this.prePSize);
        this.tm.endSyncOp();
        return res;
    };

    curve.prepareG2 = function(q) {
        this.tm.startSyncOp();
        const pQ = this.tm.allocBuff(q);
        const pPrepQ = this.tm.alloc(this.preQSize);
        this.tm.instance.exports[this.name + "_prepareG2"](pQ, pPrepQ);
        const res = this.tm.getBuff(pPrepQ, this.preQSize);
        this.tm.endSyncOp();
        return res;
    };

    curve.millerLoop = function(preP, preQ) {
        this.tm.startSyncOp();
        const pPreP = this.tm.allocBuff(preP);
        const pPreQ = this.tm.allocBuff(preQ);
        const pRes = this.tm.alloc(this.Gt.n8);
        this.tm.instance.exports[this.name + "_millerLoop"](pPreP, pPreQ, pRes);
        const res = this.tm.getBuff(pRes, this.Gt.n8);
        this.tm.endSyncOp();
        return res;
    };

    curve.finalExponentiation = function(a) {
        this.tm.startSyncOp();
        const pA = this.tm.allocBuff(a);
        const pRes = this.tm.alloc(this.Gt.n8);
        this.tm.instance.exports[this.name + "_finalExponentiation"](pA, pRes);
        const res = this.tm.getBuff(pRes, this.Gt.n8);
        this.tm.endSyncOp();
        return res;
    };

}

const pTSizes = [
    1 ,  1,  1,  1,    2,  3,  4,  5,
    6 ,  7,  7,  8,    9, 10, 11, 12,
    13, 13, 14, 15,   16, 16, 17, 17,
    17, 17, 17, 17,   17, 17, 17, 17
];

function buildMultiexp(curve, groupName) {
    const G = curve[groupName];
    const tm = G.tm;
    async function _multiExpChunk(buffBases, buffScalars, inType, logger, logText) {
        if ( ! (buffBases instanceof Uint8Array) ) {
            if (logger) logger.error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
            throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
        }
        if ( ! (buffScalars instanceof Uint8Array) ) {
            if (logger) logger.error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
            throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
        }
        inType = inType || "affine";

        let sGIn;
        let fnName;
        if (groupName == "G1") {
            if (inType == "affine") {
                fnName = "g1m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g1m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                fnName = "g2m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g2m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }
        const nPoints = Math.floor(buffBases.byteLength / sGIn);

        if (nPoints == 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints != buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2$1(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [
                {cmd: "ALLOCSET", var: 0, buff: buffBases},
                {cmd: "ALLOCSET", var: 1, buff: buffScalars},
                {cmd: "ALLOC", var: 2, len: G.F.n8*3},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: sScalar},
                    {val: nPoints},
                    {val: i*bitChunkSize},
                    {val: Math.min(sScalar*8 - i*bitChunkSize, bitChunkSize)},
                    {var: 2}
                ]},
                {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
            ];
            opPromises.push(
                G.tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            if (!G.isZero(res)) {
                for (let j=0; j<bitChunkSize; j++) res = G.double(res);
            }
            res = G.add(res, result[i][0]);
        }

        return res;
    }

    async function _multiExp(buffBases, buffScalars, inType, logger, logText) {
        const MAX_CHUNK_SIZE = 1 << 22;
        const MIN_CHUNK_SIZE = 1 << 10;
        let sGIn;

        if (groupName == "G1") {
            if (inType == "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints != buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2$1(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        let chunkSize;
        chunkSize = Math.floor(nPoints / (tm.concurrency /nChunks));
        if (chunkSize>MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize<MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;

        const opPromises = [];
        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`Multiexp start: ${logText}: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, chunkSize);
            const buffBasesChunk = buffBases.slice(i*sGIn, (i+n)*sGIn);
            const buffScalarsChunk = buffScalars.slice(i*sScalar, (i+n)*sScalar);
            opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType, logger, logText).then( (r) => {
                if (logger) logger.debug(`Multiexp end: ${logText}: ${i}/${nPoints}`);
                return r;
            }));
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            res = G.add(res, result[i]);
        }

        return res;
    }

    G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return await _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
    };
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return await _multiExp(buffBases, buffScalars, "affine", logger, logText);
    };
}

function buildFFT(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = G.tm;
    async function _fft(buff, inverse, inType, outType, logger, loggerTxt) {

        inType = inType || "affine";
        outType = outType || "affine";
        const MAX_BITS_THREAD = 14;

        let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnFFTMix, fnFFTJoin, fnFFTFinal;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnFFTFinal = "g1m_fftFinal";
            }
            fnFFTJoin = "g1m_fftJoin";
            fnFFTMix = "g1m_fftMix";

            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g1m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }

        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnFFTFinal = "g2m_fftFinal";
            }
            fnFFTJoin = "g2m_fftJoin";
            fnFFTMix = "g2m_fftMix";
            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g2m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = G.n8;
            sMid = G.n8;
            sOut = G.n8;
            if (inverse) {
                fnFFTFinal = "frm_fftFinal";
            }
            fnFFTMix = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        }


        let returnArray = false;
        if (Array.isArray(buff)) {
            buff = curve.array2buffer(buff, sIn);
            returnArray = true;
        } else {
            buff = buff.slice(0, buff.byteLength);
        }

        const nPoints = buff.byteLength / sIn;
        const bits = log2$1(nPoints);

        if  ((1 << bits) != nPoints) {
            throw new Error("fft must be multiple of 2" );
        }

        if (bits == Fr.s +1) {
            let buffOut;

            if (inverse) {
                buffOut =  await _fftExtInv(buff, inType, outType, logger, loggerTxt);
            } else {
                buffOut =  await _fftExt(buff, inType, outType, logger, loggerTxt);
            }

            if (returnArray) {
                return curve.buffer2array(buffOut, sOut);
            } else {
                return buffOut;
            }
        }

        let inv;
        if (inverse) {
            inv = Fr.inv(Fr.e(nPoints));
        }

        let buffOut;

        buffReverseBits(buff, sIn);

        let chunks;
        let pointsInChunk = Math.min(1 << MAX_BITS_THREAD, nPoints);
        let nChunks = nPoints / pointsInChunk;

        while ((nChunks < tm.concurrency)&&(pointsInChunk>=16)) {
            nChunks *= 2;
            pointsInChunk /= 2;
        }

        const l2Chunk = log2$1(pointsInChunk);

        const promises = [];
        for (let i = 0; i< nChunks; i++) {
            if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix start: ${i}/${nChunks}`);
            const task = [];
            task.push({cmd: "ALLOC", var: 0, len: sMid*pointsInChunk});
            const buffChunk = buff.slice( (pointsInChunk * i)*sIn, (pointsInChunk * (i+1))*sIn);
            task.push({cmd: "SET", var: 0, buff: buffChunk});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
            }
            for (let j=1; j<=l2Chunk;j++) {
                task.push({cmd: "CALL", fnName:fnFFTMix, params: [{var:0}, {val: pointsInChunk}, {val: j}]});
            }

            if (l2Chunk==bits) {
                if (fnFFTFinal) {
                    task.push({cmd: "ALLOCSET", var: 1, buff: inv});
                    task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                        {var: 0},
                        {val: pointsInChunk},
                        {var: 1},
                    ]});
                }
                if (fnMid2Out) {
                    task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                }
                task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
            } else {
                task.push({cmd: "GET", out:0, var: 0, len: sMid*pointsInChunk});
            }
            promises.push(tm.queueAction(task).then( (r) => {
                if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix end: ${i}/${nChunks}`);
                return r;
            }));
        }

        chunks = await Promise.all(promises);
        for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

        for (let i = l2Chunk+1;   i<=bits; i++) {
            if (logger) logger.debug(`${loggerTxt}: fft  ${bits}  join: ${i}/${bits}`);
            const nGroups = 1 << (bits - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const first = Fr.exp( Fr.w[i], k*pointsInChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsInChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    if (i==bits) {
                        if (fnFFTFinal) {
                            task.push({cmd: "ALLOCSET", var: 4, buff: inv});
                            task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                {var: 0},
                                {val: pointsInChunk},
                                {var: 4},
                            ]});
                            task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                {var: 1},
                                {val: pointsInChunk},
                                {var: 4},
                            ]});
                        }
                        if (fnMid2Out) {
                            task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                            task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: pointsInChunk}, {var: 1}]});
                        }
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sOut});
                    } else {
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sMid});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sMid});
                    }
                    opPromises.push(tm.queueAction(task).then( (r) => {
                        if (logger) logger.debug(`${loggerTxt}: fft ${bits} join  ${i}/${bits}  ${j+1}/${nGroups} ${k}/${nChunksPerGroup/2}`);
                        return r;
                    }));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }

        if (buff instanceof BigBuffer) {
            buffOut = new BigBuffer(nPoints*sOut);
        } else {
            buffOut = new Uint8Array(nPoints*sOut);
        }
        if (inverse) {
            buffOut.set(chunks[0].slice((pointsInChunk-1)*sOut));
            let p= sOut;
            for (let i=nChunks-1; i>0; i--) {
                buffOut.set(chunks[i], p);
                p += pointsInChunk*sOut;
                delete chunks[i];  // Liberate mem
            }
            buffOut.set(chunks[0].slice(0, (pointsInChunk-1)*sOut), p);
            delete chunks[0];
        } else {
            for (let i=0; i<nChunks; i++) {
                buffOut.set(chunks[i], pointsInChunk*sOut*i);
                delete chunks[i];
            }
        }

        if (returnArray) {
            return curve.buffer2array(buffOut, sOut);
        } else {
            return buffOut;
        }
    }

    async function _fftExt(buff, inType, outType, logger, loggerTxt) {
        let b1, b2;
        b1 = buff.slice( 0 , buff.byteLength/2);
        b2 = buff.slice( buff.byteLength/2, buff.byteLength);

        const promises = [];

        [b1, b2] = await _fftJoinExt(b1, b2, "fftJoinExt", Fr.one, Fr.shift, inType, "jacobian", logger, loggerTxt);

        promises.push( _fft(b1, false, "jacobian", outType, logger, loggerTxt));
        promises.push( _fft(b2, false, "jacobian", outType, logger, loggerTxt));

        const res1 = await Promise.all(promises);

        let buffOut;
        if (res1[0].byteLength > (1<<28)) {
            buffOut = new BigBuffer(res1[0].byteLength*2);
        } else {
            buffOut = new Uint8Array(res1[0].byteLength*2);
        }

        buffOut.set(res1[0]);
        buffOut.set(res1[1], res1[0].byteLength);

        return buffOut;
    }

    async function _fftExtInv(buff, inType, outType, logger, loggerTxt) {
        let b1, b2;
        b1 = buff.slice( 0 , buff.byteLength/2);
        b2 = buff.slice( buff.byteLength/2, buff.byteLength);

        const promises = [];

        promises.push( _fft(b1, true, inType, "jacobian", logger, loggerTxt));
        promises.push( _fft(b2, true, inType, "jacobian", logger, loggerTxt));

        [b1, b2] = await Promise.all(promises);

        const res1 = await _fftJoinExt(b1, b2, "fftJoinExtInv", Fr.one, Fr.shiftInv, "jacobian", outType, logger, loggerTxt);

        let buffOut;
        if (res1[0].byteLength > (1<<28)) {
            buffOut = new BigBuffer(res1[0].byteLength*2);
        } else {
            buffOut = new Uint8Array(res1[0].byteLength*2);
        }

        buffOut.set(res1[0]);
        buffOut.set(res1[1], res1[0].byteLength);

        return buffOut;
    }


    async function _fftJoinExt(buff1, buff2, fn, first, inc, inType, outType, logger, loggerTxt) {
        const MAX_CHUNK_SIZE = 1<<16;
        const MIN_CHUNK_SIZE = 1<<4;

        let fnName;
        let fnIn2Mid, fnMid2Out;
        let sOut, sIn, sMid;

        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            fnName = "g1m_"+fn;
            if (outType == "affine") {
                fnMid2Out = "g1m_batchToAffine";
                sOut = G.F.n8*2;
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            fnName = "g2m_"+fn;
            sMid = G.F.n8*3;
            if (outType == "affine") {
                fnMid2Out = "g2m_batchToAffine";
                sOut = G.F.n8*2;
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = Fr.n8;
            sOut = Fr.n8;
            sMid = Fr.n8;
            fnName = "frm_" + fn;
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sIn);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let chunkSize = Math.floor(nPoints /tm.concurrency);
        if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
        if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;

        const opPromises = [];

        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`${loggerTxt}: fftJoinExt Start: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, chunkSize);

            const firstChunk = Fr.mul(first, Fr.exp( inc, i));
            const task = [];

            const b1 = buff1.slice(i*sIn, (i+n)*sIn);
            const b2 = buff2.slice(i*sIn, (i+n)*sIn);

            task.push({cmd: "ALLOC", var: 0, len: sMid*n});
            task.push({cmd: "SET", var: 0, buff: b1});
            task.push({cmd: "ALLOC", var: 1, len: sMid*n});
            task.push({cmd: "SET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: n}, {var: 0}]});
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:1}, {val: n}, {var: 1}]});
            }
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: n},
                {var: 2},
                {var: 3},
                {val: Fr.s},
            ]});
            if (fnMid2Out) {
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: n}, {var: 0}]});
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: n}, {var: 1}]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: n*sOut});
            task.push({cmd: "GET", out: 1, var: 1, len: n*sOut});
            opPromises.push(
                tm.queueAction(task).then( (r) => {
                    if (logger) logger.debug(`${loggerTxt}: fftJoinExt End: ${i}/${nPoints}`);
                    return r;
                })
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut1;
        let fullBuffOut2;
        if (nPoints * sOut > 1<<28) {
            fullBuffOut1 = new BigBuffer(nPoints*sOut);
            fullBuffOut2 = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut1 = new Uint8Array(nPoints*sOut);
            fullBuffOut2 = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    }


    G.fft = async function(buff, inType, outType, logger, loggerTxt) {
        return await _fft(buff, false, inType, outType, logger, loggerTxt);
    };

    G.ifft = async function(buff, inType, outType, logger, loggerTxt) {
        return await _fft(buff, true, inType, outType, logger, loggerTxt);
    };

    G.lagrangeEvaluations = async function (buff, inType, outType, logger, loggerTxt) {
        inType = inType || "affine";
        outType = outType || "affine";

        let sIn;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
            } else {
                sIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
            } else {
                sIn = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = Fr.n8;
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = buff.byteLength /sIn;
        const bits = log2$1(nPoints);

        if ((2 ** bits)*sIn != buff.byteLength) {
            if (logger) logger.error("lagrangeEvaluations iinvalid input size");
            throw new Error("lagrangeEvaluations invalid Input size");
        }

        if (bits <= Fr.s) {
            return await G.ifft(buff, inType, outType, logger, loggerTxt);
        }

        if (bits > Fr.s+1) {
            if (logger) logger.error("lagrangeEvaluations input too big");
            throw new Error("lagrangeEvaluations input too big");
        }

        let t0 = buff.slice(0, buff.byteLength/2);
        let t1 = buff.slice(buff.byteLength/2, buff.byteLength);


        const shiftToSmallM = Fr.exp(Fr.shift, nPoints/2);
        const sConst = Fr.inv( Fr.sub(Fr.one, shiftToSmallM));

        [t0, t1] = await _fftJoinExt(t0, t1, "prepareLagrangeEvaluation", sConst, Fr.shiftInv, inType, "jacobian", logger, loggerTxt + " prep");

        const promises = [];

        promises.push( _fft(t0, true, "jacobian", outType, logger, loggerTxt + " t0"));
        promises.push( _fft(t1, true, "jacobian", outType, logger, loggerTxt + " t1"));

        [t0, t1] = await Promise.all(promises);

        let buffOut;
        if (t0.byteLength > (1<<28)) {
            buffOut = new BigBuffer(t0.byteLength*2);
        } else {
            buffOut = new Uint8Array(t0.byteLength*2);
        }

        buffOut.set(t0);
        buffOut.set(t1, t0.byteLength);

        return buffOut;
    };

    G.fftMix = async function fftMix(buff) {
        const sG = G.F.n8*3;
        let fnName, fnFFTJoin;
        if (groupName == "G1") {
            fnName = "g1m_fftMix";
            fnFFTJoin = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftMix";
            fnFFTJoin = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        const power = log2$1(nPoints);

        let nChunks = 1 << log2$1(tm.concurrency);

        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;

        const powerChunk = log2$1(pointsPerChunk);

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            for (let j=1; j<=powerChunk; j++) {
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: pointsPerChunk},
                    {val: j}
                ]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        const chunks = [];
        for (let i=0; i<result.length; i++) chunks[i] = result[i][0];


        for (let i = powerChunk+1; i<=power; i++) {
            const nGroups = 1 << (power - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const first = Fr.exp( Fr.w[i], k*pointsPerChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsPerChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                    task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                    opPromises.push(tm.queueAction(task));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }

        let fullBuffOut;
        if (buff instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sG);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sG);
        }
        let p =0;
        for (let i=0; i<nChunks; i++) {
            fullBuffOut.set(chunks[i], p);
            p+=chunks[i].byteLength;
        }

        return fullBuffOut;
    };

    G.fftJoin = async function fftJoin(buff1, buff2, first, inc) {
        const sG = G.F.n8*3;
        let fnName;
        if (groupName == "G1") {
            fnName = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sG);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let nChunks = 1 << log2$1(tm.concurrency);
        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;


        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];

            const firstChunk = Fr.mul(first, Fr.exp(inc, i*pointsPerChunk));
            const b1 = buff1.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            const b2 = buff2.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b1});
            task.push({cmd: "ALLOCSET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: pointsPerChunk},
                {var: 2},
                {var: 3}
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
            opPromises.push(
                tm.queueAction(task)
            );

        }


        const result = await Promise.all(opPromises);

        let fullBuffOut1;
        let fullBuffOut2;
        if (buff1 instanceof BigBuffer) {
            fullBuffOut1 = new BigBuffer(nPoints*sG);
            fullBuffOut2 = new BigBuffer(nPoints*sG);
        } else {
            fullBuffOut1 = new Uint8Array(nPoints*sG);
            fullBuffOut2 = new Uint8Array(nPoints*sG);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    };



    G.fftFinal =  async function fftFinal(buff, factor) {
        const sG = G.F.n8*3;
        const sGout = G.F.n8*2;
        let fnName, fnToAffine;
        if (groupName == "G1") {
            fnName = "g1m_fftFinal";
            fnToAffine = "g1m_batchToAffine";
        } else if (groupName == "G2") {
            fnName = "g2m_fftFinal";
            fnToAffine = "g2m_batchToAffine";
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        const pointsPerChunk = Math.floor(nPoints / tm.concurrency);

        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, (i*pointsPerChunk+n)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            task.push({cmd: "ALLOCSET", var: 1, buff: factor});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {val: n},
                {var: 1},
            ]});
            task.push({cmd: "CALL", fnName: fnToAffine, params: [
                {var: 0},
                {val: n},
                {var: 0},
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: n*sGout});
            opPromises.push(
                tm.queueAction(task)
            );

        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buff instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sGout);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sGout);
        }

        let p =0;
        for (let i=result.length-1; i>=0; i--) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };
}

async function buildEngine(params) {

    const tm = await buildThreadManager(params.wasm, params.singleThread);


    const curve = {};

    curve.q = e$2(params.wasm.q);
    curve.r = e$2(params.wasm.r);
    curve.name = params.name;
    curve.tm = tm;
    curve.prePSize = params.wasm.prePSize;
    curve.preQSize = params.wasm.preQSize;
    curve.Fr = new WasmField1(tm, "frm", params.n8r, params.r);
    curve.F1 = new WasmField1(tm, "f1m", params.n8q, params.q);
    curve.F2 = new WasmField2(tm, "f2m", curve.F1);
    curve.G1 = new WasmCurve(tm, "g1m", curve.F1, params.wasm.pG1gen, params.wasm.pG1b, params.cofactorG1);
    curve.G2 = new WasmCurve(tm, "g2m", curve.F2, params.wasm.pG2gen, params.wasm.pG2b, params.cofactorG2);
    curve.F6 = new WasmField3(tm, "f6m", curve.F2);
    curve.F12 = new WasmField2(tm, "ftm", curve.F6);

    curve.Gt = curve.F12;

    buildBatchApplyKey(curve, "G1");
    buildBatchApplyKey(curve, "G2");
    buildBatchApplyKey(curve, "Fr");

    buildMultiexp(curve, "G1");
    buildMultiexp(curve, "G2");

    buildFFT(curve, "G1");
    buildFFT(curve, "G2");
    buildFFT(curve, "Fr");

    buildPairing(curve);

    curve.array2buffer = function(arr, sG) {
        const buff = new Uint8Array(sG*arr.length);

        for (let i=0; i<arr.length; i++) {
            buff.set(arr[i], i*sG);
        }

        return buff;
    };

    curve.buffer2array = function(buff , sG) {
        const n= buff.byteLength / sG;
        const arr = new Array(n);
        for (let i=0; i<n; i++) {
            arr[i] = buff.slice(i*sG, i*sG+sG);
        }
        return arr;
    };

    return curve;
}

global.curve_bn128 = null;

async function buildBn128(singleThread) {

    if ((!singleThread)&&(global.curve_bn128)) return global.curve_bn128;
    const params = {
        name: "bn128",
        wasm: wasmcurves__default['default'].bn128_wasm,
        q: e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
        r: e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
        n8q: 32,
        n8r: 32,
        cofactorG2: e$2("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function() {
        if (!params.singleThread) {
            global.curve_bn128 = null;
            await this.tm.terminate();
        }
    };

    if (!singleThread) {
        global.curve_bn128 = curve;
    }

    return curve;
}

global.curve_bls12381 = null;

async function buildBls12381(singleThread) {

    if ((!singleThread)&&(global.curve_bls12381)) return global.curve_bls12381;
    const params = {
        name: "bls12381",
        wasm: wasmcurves__default['default'].bls12381_wasm,
        q: e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16),
        r: e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16),
        n8q: 48,
        n8r: 32,
        cofactorG1: e$2("0x396c8c005555e1568c00aaab0000aaab", 16),
        cofactorG2: e$2("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function() {
        if (!params.singleThread) {
            global.curve_bls12381 = null;
            await this.tm.terminate();
        }
    };

    return curve;
}

const bls12381r = e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
const bn128r = e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617");

const bls12381q = e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16);
const bn128q = e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583");

async function getCurveFromR(r, singleThread) {
    let curve;
    if (eq$2(r, bn128r)) {
        curve = await buildBn128(singleThread);
    } else if (eq$2(r, bls12381r)) {
        curve = await buildBn128(singleThread);
    } else {
        throw new Error(`Curve not supported: ${toString(r)}`);
    }
    return curve;
}

async function getCurveFromQ(q, singleThread) {
    let curve;
    if (eq$2(q, bn128q)) {
        curve = await buildBn128(singleThread);
    } else if (eq$2(q, bls12381q)) {
        curve = await buildBn128(singleThread);
    } else {
        throw new Error(`Curve not supported: ${toString(q)}`);
    }
    return curve;
}

async function getCurveFromName(name, singleThread) {
    let curve;
    const normName = normalizeName(name);
    if (["BN128", "BN254", "ALTBN128"].indexOf(normName) >= 0) {
        curve = await buildBn128(singleThread);
    } else if (["BLS12381"].indexOf(normName) >= 0) {
        curve = await buildBn128(singleThread);
    } else {
        throw new Error(`Curve not supported: ${name}`);
    }
    return curve;

    function normalizeName(n) {
        return n.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
    }

}

const Scalar$1=_Scalar;
const utils$1 = _utils;

exports.BigBuffer = BigBuffer;
exports.ChaCha = ChaCha;
exports.EC = EC;
exports.F1Field = F1Field;
exports.F2Field = F2Field;
exports.F3Field = F3Field;
exports.PolField = PolField;
exports.Scalar = Scalar$1;
exports.ZqField = F1Field;
exports.buildBls12381 = buildBls12381;
exports.buildBn128 = buildBn128;
exports.getCurveFromName = getCurveFromName;
exports.getCurveFromQ = getCurveFromQ;
exports.getCurveFromR = getCurveFromR;
exports.utils = utils$1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5janMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zY2FsYXJfbmF0aXZlLmpzIiwiLi4vc3JjL3NjYWxhcl9iaWdpbnQuanMiLCIuLi9zcmMvc2NhbGFyLmpzIiwiLi4vc3JjL3BvbGZpZWxkLmpzIiwiLi4vc3JjL2Z1dGlscy5qcyIsIi4uL3NyYy9mc3FydC5qcyIsIi4uL3NyYy9jaGFjaGEuanMiLCIuLi9zcmMvcmFuZG9tLmpzIiwiLi4vc3JjL2YxZmllbGRfbmF0aXZlLmpzIiwiLi4vc3JjL2YxZmllbGRfYmlnaW50LmpzIiwiLi4vc3JjL2YxZmllbGQuanMiLCIuLi9zcmMvZjJmaWVsZC5qcyIsIi4uL3NyYy9mM2ZpZWxkLmpzIiwiLi4vc3JjL2VjLmpzIiwiLi4vc3JjL3V0aWxzX25hdGl2ZS5qcyIsIi4uL3NyYy91dGlsc19iaWdpbnQuanMiLCIuLi9zcmMvdXRpbHMuanMiLCIuLi9zcmMvYmlnYnVmZmVyLmpzIiwiLi4vc3JjL2VuZ2luZV9iYXRjaGNvbnZlcnQuanMiLCIuLi9zcmMvd2FzbV9maWVsZDEuanMiLCIuLi9zcmMvd2FzbV9maWVsZDIuanMiLCIuLi9zcmMvd2FzbV9maWVsZDMuanMiLCIuLi9zcmMvd2FzbV9jdXJ2ZS5qcyIsIi4uL3NyYy90aHJlYWRtYW5fdGhyZWFkLmpzIiwiLi4vc3JjL3RocmVhZG1hbi5qcyIsIi4uL3NyYy9lbmdpbmVfYXBwbHlrZXkuanMiLCIuLi9zcmMvZW5naW5lX3BhaXJpbmcuanMiLCIuLi9zcmMvZW5naW5lX211bHRpZXhwLmpzIiwiLi4vc3JjL2VuZ2luZV9mZnQuanMiLCIuLi9zcmMvZW5naW5lLmpzIiwiLi4vc3JjL2JuMTI4LmpzIiwiLi4vc3JjL2JsczEyMzgxLmpzIiwiLi4vc3JjL2N1cnZlcy5qcyIsIi4uL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIEJpZ0ludCAqL1xuY29uc3QgaGV4TGVuID0gWyAwLCAxLCAyLCAyLCAzLCAzLCAzLCAzLCA0ICw0ICw0ICw0ICw0ICw0ICw0ICw0XTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21TdHJpbmcocywgcmFkaXgpIHtcbiAgICBpZiAoKCFyYWRpeCl8fChyYWRpeD09MTApKSB7XG4gICAgICAgIHJldHVybiBCaWdJbnQocyk7XG4gICAgfSBlbHNlIGlmIChyYWRpeD09MTYpIHtcbiAgICAgICAgaWYgKHMuc2xpY2UoMCwyKSA9PSBcIjB4XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBCaWdJbnQocyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gQmlnSW50KFwiMHhcIitzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGUgPSBmcm9tU3RyaW5nO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUFycmF5KGEsIHJhZGl4KSB7XG4gICAgbGV0IGFjYyA9MG47XG4gICAgcmFkaXggPSBCaWdJbnQocmFkaXgpO1xuICAgIGZvciAobGV0IGk9MDsgaTxhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjYyA9IGFjYypyYWRpeCArIEJpZ0ludChhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpdExlbmd0aChhKSB7XG4gICAgY29uc3QgYVMgPWEudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiAoYVMubGVuZ3RoLTEpKjQgK2hleExlbltwYXJzZUludChhU1swXSwgMTYpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmVnYXRpdmUoYSkge1xuICAgIHJldHVybiBCaWdJbnQoYSkgPCAwbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzWmVybyhhKSB7XG4gICAgcmV0dXJuICFhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hpZnRMZWZ0KGEsIG4pIHtcbiAgICByZXR1cm4gQmlnSW50KGEpIDw8IEJpZ0ludChuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoaWZ0UmlnaHQoYSwgbikge1xuICAgIHJldHVybiBCaWdJbnQoYSkgPj4gQmlnSW50KG4pO1xufVxuXG5leHBvcnQgY29uc3Qgc2hsID0gc2hpZnRMZWZ0O1xuZXhwb3J0IGNvbnN0IHNociA9IHNoaWZ0UmlnaHQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09kZChhKSB7XG4gICAgcmV0dXJuIChCaWdJbnQoYSkgJiAxbikgPT0gMW47XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG5hZihuKSB7XG4gICAgbGV0IEUgPSBCaWdJbnQobik7XG4gICAgY29uc3QgcmVzID0gW107XG4gICAgd2hpbGUgKEUpIHtcbiAgICAgICAgaWYgKEUgJiAxbikge1xuICAgICAgICAgICAgY29uc3QgeiA9IDIgLSBOdW1iZXIoRSAlIDRuKTtcbiAgICAgICAgICAgIHJlcy5wdXNoKCB6ICk7XG4gICAgICAgICAgICBFID0gRSAtIEJpZ0ludCh6KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKCAwICk7XG4gICAgICAgIH1cbiAgICAgICAgRSA9IEUgPj4gMW47XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpdHMobikge1xuICAgIGxldCBFID0gQmlnSW50KG4pO1xuICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgIHdoaWxlIChFKSB7XG4gICAgICAgIGlmIChFICYgMW4pIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLnB1c2goIDAgKTtcbiAgICAgICAgfVxuICAgICAgICBFID0gRSA+PiAxbjtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvTnVtYmVyKHMpIHtcbiAgICBpZiAocz5CaWdJbnQoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOdW1iZXIgdG9vIGJpZ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIE51bWJlcihzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkocywgcmFkaXgpIHtcbiAgICBjb25zdCByZXMgPSBbXTtcbiAgICBsZXQgcmVtID0gQmlnSW50KHMpO1xuICAgIHJhZGl4ID0gQmlnSW50KHJhZGl4KTtcbiAgICB3aGlsZSAocmVtKSB7XG4gICAgICAgIHJlcy51bnNoaWZ0KCBOdW1iZXIocmVtICUgcmFkaXgpKTtcbiAgICAgICAgcmVtID0gcmVtIC8gcmFkaXg7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZChhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSArIEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YihhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSAtIEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lZyhhKSB7XG4gICAgcmV0dXJuIC1CaWdJbnQoYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtdWwoYSwgYikge1xuICAgIHJldHVybiBCaWdJbnQoYSkgKiBCaWdJbnQoYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcXVhcmUoYSkge1xuICAgIHJldHVybiBCaWdJbnQoYSkgKiBCaWdJbnQoYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3coYSwgYikge1xuICAgIHJldHVybiBCaWdJbnQoYSkgKiogQmlnSW50KGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwKGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpICoqIEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFicyhhKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSA+PSAwID8gQmlnSW50KGEpIDogLUJpZ0ludChhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpdihhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSAvIEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vZChhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSAlIEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxKGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpID09IEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lcShhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSAhPSBCaWdJbnQoYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsdChhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSA8IEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGd0KGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpID4gQmlnSW50KGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVxKGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpIDw9IEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlcShhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSA+PSBCaWdJbnQoYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYW5kKGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpICYgQmlnSW50KGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9yKGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpIHwgQmlnSW50KGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnhvcihhLCBiKSB7XG4gICAgcmV0dXJuIEJpZ0ludChhKSBeIEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhbmQoYSwgYikge1xuICAgIHJldHVybiBCaWdJbnQoYSkgJiYgQmlnSW50KGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9yKGEsIGIpIHtcbiAgICByZXR1cm4gQmlnSW50KGEpIHx8IEJpZ0ludChiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxub3QoYSkge1xuICAgIHJldHVybiAhQmlnSW50KGEpO1xufVxuXG4iLCJpbXBvcnQgYmlnSW50IGZyb20gXCJiaWctaW50ZWdlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVN0cmluZyhzLCByYWRpeCkge1xuICAgIGlmICh0eXBlb2YgcyA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGlmIChzLnNsaWNlKDAsMikgPT0gXCIweFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYmlnSW50KHMuc2xpY2UoMiksIDE2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBiaWdJbnQocyxyYWRpeCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYmlnSW50KHMsIHJhZGl4KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBlID0gZnJvbVN0cmluZztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21BcnJheShhLCByYWRpeCkge1xuICAgIHJldHVybiBiaWdJbnQuZnJvbUFycmF5KGEsIHJhZGl4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpdExlbmd0aChhKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5iaXRMZW5ndGgoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmVnYXRpdmUoYSkge1xuICAgIHJldHVybiBiaWdJbnQoYSkuaXNOZWdhdGl2ZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNaZXJvKGEpIHtcbiAgICByZXR1cm4gYmlnSW50KGEpLmlzWmVybygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hpZnRMZWZ0KGEsIG4pIHtcbiAgICByZXR1cm4gYmlnSW50KGEpLnNoaWZ0TGVmdChuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoaWZ0UmlnaHQoYSwgbikge1xuICAgIHJldHVybiBiaWdJbnQoYSkuc2hpZnRSaWdodChuKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNobCA9IHNoaWZ0TGVmdDtcbmV4cG9ydCBjb25zdCBzaHIgPSBzaGlmdFJpZ2h0O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNPZGQoYSkge1xuICAgIHJldHVybiBiaWdJbnQoYSkuaXNPZGQoKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbmFmKG4pIHtcbiAgICBsZXQgRSA9IGJpZ0ludChuKTtcbiAgICBjb25zdCByZXMgPSBbXTtcbiAgICB3aGlsZSAoRS5ndChiaWdJbnQuemVybykpIHtcbiAgICAgICAgaWYgKEUuaXNPZGQoKSkge1xuICAgICAgICAgICAgY29uc3QgeiA9IDIgLSBFLm1vZCg0KS50b0pTTnVtYmVyKCk7XG4gICAgICAgICAgICByZXMucHVzaCggeiApO1xuICAgICAgICAgICAgRSA9IEUubWludXMoeik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMucHVzaCggMCApO1xuICAgICAgICB9XG4gICAgICAgIEUgPSBFLnNoaWZ0UmlnaHQoMSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaXRzKG4pIHtcbiAgICBsZXQgRSA9IGJpZ0ludChuKTtcbiAgICBjb25zdCByZXMgPSBbXTtcbiAgICB3aGlsZSAoRS5ndChiaWdJbnQuemVybykpIHtcbiAgICAgICAgaWYgKEUuaXNPZGQoKSkge1xuICAgICAgICAgICAgcmVzLnB1c2goMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMucHVzaCggMCApO1xuICAgICAgICB9XG4gICAgICAgIEUgPSBFLnNoaWZ0UmlnaHQoMSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b051bWJlcihzKSB7XG4gICAgaWYgKCFzLmx0KGJpZ0ludChcIjkwMDcxOTkyNTQ3NDA5OTJcIiwgMTApKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOdW1iZXIgdG9vIGJpZ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHMudG9KU051bWJlcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShzLCByYWRpeCkge1xuICAgIHJldHVybiBiaWdJbnQocykudG9BcnJheShyYWRpeCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGQoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkuYWRkKGJpZ0ludChiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWIoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkubWludXMoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lZyhhKSB7XG4gICAgcmV0dXJuIGJpZ0ludC56ZXJvLm1pbnVzKGJpZ0ludChhKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtdWwoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkudGltZXMoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNxdWFyZShhKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5zcXVhcmUoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvdyhhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5wb3coYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cChhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5wb3coYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFicyhhKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5hYnMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpdihhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5kaXZpZGUoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vZChhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5tb2QoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxKGEsIGIpIHtcbiAgICByZXR1cm4gYmlnSW50KGEpLmVxKGJpZ0ludChiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXEoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkubmVxKGJpZ0ludChiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsdChhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5sdChiaWdJbnQoYikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3QoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkuZ3QoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlcShhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5sZXEoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlcShhLCBiKSB7XG4gICAgcmV0dXJuIGJpZ0ludChhKS5nZXEoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhbmQoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkuYW5kKGJpZ0ludChiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBib3IoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkub3IoYmlnSW50KGIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ4b3IoYSwgYikge1xuICAgIHJldHVybiBiaWdJbnQoYSkueG9yKGJpZ0ludChiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYW5kKGEsIGIpIHtcbiAgICByZXR1cm4gKCFiaWdJbnQoYSkuaXNaZXJvKCkpICYmICghYmlnSW50KGIpLmlzWmVybygpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvcihhLCBiKSB7XG4gICAgcmV0dXJuICghYmlnSW50KGEpLmlzWmVybygpKSB8fCAoIWJpZ0ludChiKS5pc1plcm8oKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsbm90KGEpIHtcbiAgICByZXR1cm4gYmlnSW50KGEpLmlzWmVybygpO1xufVxuXG5cbiIsIlxuaW1wb3J0ICogYXMgU2NhbGFyX25hdGl2ZSBmcm9tIFwiLi9zY2FsYXJfbmF0aXZlLmpzXCI7XG5pbXBvcnQgKiBhcyBTY2FsYXJfYmlnaW50IGZyb20gXCIuL3NjYWxhcl9iaWdpbnQuanNcIjtcblxuY29uc3Qgc3VwcG9ydHNOYXRpdmVCaWdJbnQgPSB0eXBlb2YgQmlnSW50ID09PSBcImZ1bmN0aW9uXCI7XG5cbmxldCBTY2FsYXIgPSB7fTtcbmlmIChzdXBwb3J0c05hdGl2ZUJpZ0ludCkge1xuICAgIE9iamVjdC5hc3NpZ24oU2NhbGFyLCBTY2FsYXJfbmF0aXZlKTtcbn0gZWxzZSB7XG4gICAgT2JqZWN0LmFzc2lnbihTY2FsYXIsIFNjYWxhcl9iaWdpbnQpO1xufVxuXG5cbi8vIFJldHVybnMgYSBidWZmZXIgd2l0aCBMaXR0bGUgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG5TY2FsYXIudG9ScHJMRSA9IGZ1bmN0aW9uIHJwckJFKGJ1ZmYsIG8sIGUsIG44KSB7XG4gICAgY29uc3QgcyA9IFwiMDAwMDAwMFwiICsgZS50b1N0cmluZygxNik7XG4gICAgY29uc3QgdiA9IG5ldyBVaW50MzJBcnJheShidWZmLmJ1ZmZlciwgbywgbjgvNCk7XG4gICAgY29uc3QgbCA9ICgoKHMubGVuZ3RoLTcpKjQgLSAxKSA+PiA1KSsxOyAgICAvLyBOdW1iZXIgb2YgMzJiaXQgd29yZHM7XG4gICAgZm9yIChsZXQgaT0wOyBpPGw7IGkrKykgdltpXSA9IHBhcnNlSW50KHMuc3Vic3RyaW5nKHMubGVuZ3RoLTgqaS04LCBzLmxlbmd0aC04KmkpLCAxNik7XG4gICAgZm9yIChsZXQgaT1sOyBpPHYubGVuZ3RoOyBpKyspIHZbaV0gPSAwO1xuICAgIGZvciAobGV0IGk9di5sZW5ndGgqNDsgaTxuODsgaSsrKSBidWZmW2ldID0gU2NhbGFyLnRvTnVtYmVyKFNjYWxhci5iYW5kKFNjYWxhci5zaGlmdFJpZ2h0KGUsIGkqOCksIDB4RkYpKTtcbn07XG5cbi8vIFJldHVybnMgYSBidWZmZXIgd2l0aCBCaWcgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG5TY2FsYXIudG9ScHJCRSA9IGZ1bmN0aW9uIHJwckxFTShidWZmLCBvLCBlLCBuOCkge1xuICAgIGNvbnN0IHMgPSBcIjAwMDAwMDBcIiArIGUudG9TdHJpbmcoMTYpO1xuICAgIGNvbnN0IHYgPSBuZXcgRGF0YVZpZXcoYnVmZi5idWZmZXIsIGJ1ZmYuYnl0ZU9mZnNldCArIG8sIG44KTtcbiAgICBjb25zdCBsID0gKCgocy5sZW5ndGgtNykqNCAtIDEpID4+IDUpKzE7ICAgIC8vIE51bWJlciBvZiAzMmJpdCB3b3JkcztcbiAgICBmb3IgKGxldCBpPTA7IGk8bDsgaSsrKSB2LnNldFVpbnQzMihuOC1pKjQgLTQsIHBhcnNlSW50KHMuc3Vic3RyaW5nKHMubGVuZ3RoLTgqaS04LCBzLmxlbmd0aC04KmkpLCAxNiksIGZhbHNlKTtcbiAgICBmb3IgKGxldCBpPTA7IGk8bjgvNC1sOyBpKyspIHZbaV0gPSAwO1xufTtcblxuLy8gUGFzZXMgYSBidWZmZXIgd2l0aCBMaXR0bGUgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG5TY2FsYXIuZnJvbVJwckxFID0gZnVuY3Rpb24gcnByTEVNKGJ1ZmYsIG8sIG44KSB7XG4gICAgbjggPSBuOCB8fCBidWZmLmJ5dGVMZW5ndGg7XG4gICAgbyA9IG8gfHwgMDtcbiAgICBjb25zdCB2ID0gbmV3IFVpbnQzMkFycmF5KGJ1ZmYuYnVmZmVyLCBvLCBuOC80KTtcbiAgICBjb25zdCBhID0gbmV3IEFycmF5KG44LzQpO1xuICAgIHYuZm9yRWFjaCggKGNoLGkpID0+IGFbYS5sZW5ndGgtaS0xXSA9IGNoLnRvU3RyaW5nKDE2KS5wYWRTdGFydCg4LFwiMFwiKSApO1xuICAgIHJldHVybiBTY2FsYXIuZnJvbVN0cmluZyhhLmpvaW4oXCJcIiksIDE2KTtcbn07XG5cbi8vIFBhc2VzIGEgYnVmZmVyIHdpdGggQmlnIEVuZGlhbiBSZXByZXNlbnRhdGlvblxuU2NhbGFyLmZyb21ScHJCRSA9IGZ1bmN0aW9uIHJwckxFTShidWZmLCBvLCBuOCkge1xuICAgIG44ID0gbjggfHwgYnVmZi5ieXRlTGVuZ3RoO1xuICAgIG8gPSBvIHx8IDA7XG4gICAgY29uc3QgdiA9IG5ldyBEYXRhVmlldyhidWZmLmJ1ZmZlciwgYnVmZi5ieXRlT2Zmc2V0ICsgbywgbjgpO1xuICAgIGNvbnN0IGEgPSBuZXcgQXJyYXkobjgvNCk7XG4gICAgZm9yIChsZXQgaT0wOyBpPG44LzQ7IGkrKykge1xuICAgICAgICBhW2ldID0gdi5nZXRVaW50MzIoaSo0LCBmYWxzZSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDgsIFwiMFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIFNjYWxhci5mcm9tU3RyaW5nKGEuam9pbihcIlwiKSwgMTYpO1xufTtcblxuU2NhbGFyLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoYSwgcmFkaXgpIHtcbiAgICByZXR1cm4gYS50b1N0cmluZyhyYWRpeCk7XG59O1xuXG5TY2FsYXIudG9MRUJ1ZmYgPSBmdW5jdGlvbiB0b0xFQnVmZihhKSB7XG4gICAgY29uc3QgYnVmZiA9IG5ldyBVaW50OEFycmF5KE1hdGguZmxvb3IoKFNjYWxhci5iaXRMZW5ndGgoYSkgLSAxKSAvIDgpICsxKTtcbiAgICBTY2FsYXIudG9ScHJMRShidWZmLCAwLCBhLCBidWZmLmJ5dGVMZW5ndGgpO1xuICAgIHJldHVybiBidWZmO1xufTtcblxuXG5TY2FsYXIuemVybyA9IFNjYWxhci5lKDApO1xuU2NhbGFyLm9uZSA9IFNjYWxhci5lKDEpO1xuXG5leHBvcnQgbGV0IHtcbiAgICB0b1JwckxFLFxuICAgIHRvUnByQkUsXG4gICAgZnJvbVJwckxFLFxuICAgIGZyb21ScHJCRSxcbiAgICB0b1N0cmluZyxcbiAgICB0b0xFQnVmZixcbiAgICB6ZXJvLFxuICAgIG9uZSxcbiAgICBmcm9tU3RyaW5nLFxuICAgIGUsXG4gICAgZnJvbUFycmF5LFxuICAgIGJpdExlbmd0aCxcbiAgICBpc05lZ2F0aXZlLFxuICAgIGlzWmVybyxcbiAgICBzaGlmdExlZnQsXG4gICAgc2hpZnRSaWdodCxcbiAgICBzaGwsXG4gICAgc2hyLFxuICAgIGlzT2RkLFxuICAgIG5hZixcbiAgICBiaXRzLFxuICAgIHRvTnVtYmVyLFxuICAgIHRvQXJyYXksXG4gICAgYWRkLFxuICAgIHN1YixcbiAgICBuZWcsXG4gICAgbXVsLFxuICAgIHNxdWFyZSxcbiAgICBwb3csXG4gICAgZXhwLFxuICAgIGFicyxcbiAgICBkaXYsXG4gICAgbW9kLFxuICAgIGVxLFxuICAgIG5lcSxcbiAgICBsdCxcbiAgICBndCxcbiAgICBsZXEsXG4gICAgZ2VxLFxuICAgIGJhbmQsXG4gICAgYm9yLFxuICAgIGJ4b3IsXG4gICAgbGFuZCxcbiAgICBsb3IsXG4gICAgbG5vdCxcbn0gPSBTY2FsYXI7XG5cblxuXG5cblxuIiwiLypcbiAgICBDb3B5cmlnaHQgMjAxOCAwa2ltcyBhc3NvY2lhdGlvbi5cblxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHNuYXJranMuXG5cbiAgICBzbmFya2pzIGlzIGEgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gICAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICAgIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKVxuICAgIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgc25hcmtqcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWVxuICAgIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvclxuICAgIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nIHdpdGhcbiAgICBzbmFya2pzLiBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuLypcbiAgICBUaGlzIGxpYnJhcnkgZG9lcyBvcGVyYXRpb25zIG9uIHBvbHlub21pYWxzIHdpdGggY29lZmZpY2llbnRzIGluIGEgZmllbGQgRi5cblxuICAgIEEgcG9seW5vbWlhbCBQKHgpID0gcDAgKyBwMSAqIHggKyBwMiAqIHheMiArIC4uLiArIHBuICogeF5uICBpcyByZXByZXNlbnRlZFxuICAgIGJ5IHRoZSBhcnJheSBbIHAwLCBwMSwgcDIsIC4uLiAsIHBuIF0uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9sRmllbGQge1xuICAgIGNvbnN0cnVjdG9yIChGKSB7XG4gICAgICAgIHRoaXMuRiA9IEY7XG5cbiAgICAgICAgbGV0IHJlbSA9IEYuc3FydF90O1xuICAgICAgICBsZXQgcyA9IEYuc3FydF9zO1xuXG4gICAgICAgIGNvbnN0IGZpdmUgPSB0aGlzLkYuYWRkKHRoaXMuRi5hZGQodGhpcy5GLnR3bywgdGhpcy5GLnR3byksIHRoaXMuRi5vbmUpO1xuXG4gICAgICAgIHRoaXMudyA9IG5ldyBBcnJheShzKzEpO1xuICAgICAgICB0aGlzLndpID0gbmV3IEFycmF5KHMrMSk7XG4gICAgICAgIHRoaXMud1tzXSA9IHRoaXMuRi5wb3coZml2ZSwgcmVtKTtcbiAgICAgICAgdGhpcy53aVtzXSA9IHRoaXMuRi5pbnYodGhpcy53W3NdKTtcblxuICAgICAgICBsZXQgbj1zLTE7XG4gICAgICAgIHdoaWxlIChuPj0wKSB7XG4gICAgICAgICAgICB0aGlzLndbbl0gPSB0aGlzLkYuc3F1YXJlKHRoaXMud1tuKzFdKTtcbiAgICAgICAgICAgIHRoaXMud2lbbl0gPSB0aGlzLkYuc3F1YXJlKHRoaXMud2lbbisxXSk7XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMucm9vdHMgPSBbXTtcbi8qICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTY7IGkrKykge1xuICAgICAgICAgICAgbGV0IHIgPSB0aGlzLkYub25lO1xuICAgICAgICAgICAgbiA9IDEgPDwgaTtcbiAgICAgICAgICAgIGNvbnN0IHJvb3RzaSA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxuOyBqKyspIHtcbiAgICAgICAgICAgICAgICByb290c2lbal0gPSByO1xuICAgICAgICAgICAgICAgIHIgPSB0aGlzLkYubXVsKHIsIHRoaXMud1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucm9vdHMucHVzaChyb290c2kpO1xuICAgICAgICB9XG4gICAgKi9cbiAgICAgICAgdGhpcy5fc2V0Um9vdHMoMTUpO1xuICAgIH1cblxuICAgIF9zZXRSb290cyhuKSB7XG4gICAgICAgIGlmIChuID4gdGhpcy5GLnNxcnRfcykgbiA9IHRoaXMucztcbiAgICAgICAgZm9yIChsZXQgaT1uOyAoaT49MCkgJiYgKCF0aGlzLnJvb3RzW2ldKTsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgciA9IHRoaXMuRi5vbmU7XG4gICAgICAgICAgICBjb25zdCBucm9vdHMgPSAxIDw8IGk7XG4gICAgICAgICAgICBjb25zdCByb290c2kgPSBuZXcgQXJyYXkobnJvb3RzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxucm9vdHM7IGorKykge1xuICAgICAgICAgICAgICAgIHJvb3RzaVtqXSA9IHI7XG4gICAgICAgICAgICAgICAgciA9IHRoaXMuRi5tdWwociwgdGhpcy53W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucm9vdHNbaV0gPSByb290c2k7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGQoYSwgYikge1xuICAgICAgICBjb25zdCBtID0gTWF0aC5tYXgoYS5sZW5ndGgsIGIubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IEFycmF5KG0pO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8bTsgaSsrKSB7XG4gICAgICAgICAgICByZXNbaV0gPSB0aGlzLkYuYWRkKGFbaV0gfHwgdGhpcy5GLnplcm8sIGJbaV0gfHwgdGhpcy5GLnplcm8pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZShyZXMpO1xuICAgIH1cblxuICAgIGRvdWJsZShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhLGEpO1xuICAgIH1cblxuICAgIHN1YihhLCBiKSB7XG4gICAgICAgIGNvbnN0IG0gPSBNYXRoLm1heChhLmxlbmd0aCwgYi5sZW5ndGgpO1xuICAgICAgICBjb25zdCByZXMgPSBuZXcgQXJyYXkobSk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxtOyBpKyspIHtcbiAgICAgICAgICAgIHJlc1tpXSA9IHRoaXMuRi5zdWIoYVtpXSB8fCB0aGlzLkYuemVybywgYltpXSB8fCB0aGlzLkYuemVybyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlKHJlcyk7XG4gICAgfVxuXG4gICAgbXVsU2NhbGFyKHAsIGIpIHtcbiAgICAgICAgaWYgKHRoaXMuRi5lcShiLCB0aGlzLkYuemVybykpIHJldHVybiBbXTtcbiAgICAgICAgaWYgKHRoaXMuRi5lcShiLCB0aGlzLkYub25lKSkgcmV0dXJuIHA7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBBcnJheShwLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXNbaV0gPSB0aGlzLkYubXVsKHBbaV0sIGIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG5cblxuICAgIG11bChhLCBiKSB7XG4gICAgICAgIGlmIChhLmxlbmd0aCA9PSAwKSByZXR1cm4gW107XG4gICAgICAgIGlmIChiLmxlbmd0aCA9PSAwKSByZXR1cm4gW107XG4gICAgICAgIGlmIChhLmxlbmd0aCA9PSAxKSByZXR1cm4gdGhpcy5tdWxTY2FsYXIoYiwgYVswXSk7XG4gICAgICAgIGlmIChiLmxlbmd0aCA9PSAxKSByZXR1cm4gdGhpcy5tdWxTY2FsYXIoYSwgYlswXSk7XG5cbiAgICAgICAgaWYgKGIubGVuZ3RoID4gYS5sZW5ndGgpIHtcbiAgICAgICAgICAgIFtiLCBhXSA9IFthLCBiXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoYi5sZW5ndGggPD0gMikgfHwgKGIubGVuZ3RoIDwgbG9nMihhLmxlbmd0aCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWxOb3JtYWwoYSxiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bEZGVChhLGIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbXVsTm9ybWFsKGEsIGIpIHtcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8Yi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzID0gdGhpcy5hZGQocmVzLCB0aGlzLnNjYWxlWCh0aGlzLm11bFNjYWxhcihhLCBiW2ldKSwgaSkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIG11bEZGVChhLGIpIHtcbiAgICAgICAgY29uc3QgbG9uZ2VzdE4gPSBNYXRoLm1heChhLmxlbmd0aCwgYi5sZW5ndGgpO1xuICAgICAgICBjb25zdCBiaXRzUmVzdWx0ID0gbG9nMihsb25nZXN0Ti0xKSsyO1xuICAgICAgICB0aGlzLl9zZXRSb290cyhiaXRzUmVzdWx0KTtcblxuICAgICAgICBjb25zdCBtID0gMSA8PCBiaXRzUmVzdWx0O1xuICAgICAgICBjb25zdCBlYSA9IHRoaXMuZXh0ZW5kKGEsbSk7XG4gICAgICAgIGNvbnN0IGViID0gdGhpcy5leHRlbmQoYixtKTtcblxuICAgICAgICBjb25zdCB0YSA9IF9fZmZ0KHRoaXMsIGVhLCBiaXRzUmVzdWx0LCAwLCAxLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHRiID0gX19mZnQodGhpcywgZWIsIGJpdHNSZXN1bHQsIDAsIDEsIGZhbHNlKTtcblxuICAgICAgICBjb25zdCB0cmVzID0gbmV3IEFycmF5KG0pO1xuXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxtOyBpKyspIHtcbiAgICAgICAgICAgIHRyZXNbaV0gPSB0aGlzLkYubXVsKHRhW2ldLCB0YltpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXMgPSBfX2ZmdCh0aGlzLCB0cmVzLCBiaXRzUmVzdWx0LCAwLCAxLCB0cnVlKTtcblxuICAgICAgICBjb25zdCB0d29pbnZtID0gdGhpcy5GLmludiggdGhpcy5GLm11bFNjYWxhcih0aGlzLkYub25lLCBtKSApO1xuICAgICAgICBjb25zdCByZXNuID0gbmV3IEFycmF5KG0pO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8bTsgaSsrKSB7XG4gICAgICAgICAgICByZXNuW2ldID0gdGhpcy5GLm11bChyZXNbKG0taSklbV0sIHR3b2ludm0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlKHJlc24pO1xuICAgIH1cblxuXG5cbiAgICBzcXVhcmUoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWwoYSxhKTtcbiAgICB9XG5cbiAgICBzY2FsZVgocCwgbikge1xuICAgICAgICBpZiAobj09MCkge1xuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH0gZWxzZSBpZiAobj4wKSB7XG4gICAgICAgICAgICBjb25zdCB6ID0gbmV3IEFycmF5KG4pLmZpbGwodGhpcy5GLnplcm8pO1xuICAgICAgICAgICAgcmV0dXJuIHouY29uY2F0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKC1uID49IHAubGVuZ3RoKSByZXR1cm4gW107XG4gICAgICAgICAgICByZXR1cm4gcC5zbGljZSgtbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBldmFsMihwLCB4KSB7XG4gICAgICAgIGxldCB2ID0gdGhpcy5GLnplcm87XG4gICAgICAgIGxldCBpeCA9IHRoaXMuRi5vbmU7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ID0gdGhpcy5GLmFkZCh2LCB0aGlzLkYubXVsKHBbaV0sIGl4KSk7XG4gICAgICAgICAgICBpeCA9IHRoaXMuRi5tdWwoaXgsIHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxuICAgIGV2YWwocCx4KSB7XG4gICAgICAgIGNvbnN0IEYgPSB0aGlzLkY7XG4gICAgICAgIGlmIChwLmxlbmd0aCA9PSAwKSByZXR1cm4gRi56ZXJvO1xuICAgICAgICBjb25zdCBtID0gdGhpcy5fbmV4dDJQb3dlcihwLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGVwID0gdGhpcy5leHRlbmQocCwgbSk7XG5cbiAgICAgICAgcmV0dXJuIF9ldmFsKGVwLCB4LCAwLCAxLCBtKTtcblxuICAgICAgICBmdW5jdGlvbiBfZXZhbChwLCB4LCBvZmZzZXQsIHN0ZXAsIG4pIHtcbiAgICAgICAgICAgIGlmIChuPT0xKSByZXR1cm4gcFtvZmZzZXRdO1xuICAgICAgICAgICAgY29uc3QgbmV3WCA9IEYuc3F1YXJlKHgpO1xuICAgICAgICAgICAgY29uc3QgcmVzPSBGLmFkZChcbiAgICAgICAgICAgICAgICBfZXZhbChwLCBuZXdYLCBvZmZzZXQsIHN0ZXAgPDwgMSwgbiA+PiAxKSxcbiAgICAgICAgICAgICAgICBGLm11bChcbiAgICAgICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICAgICAgX2V2YWwocCwgbmV3WCwgb2Zmc2V0K3N0ZXAgLCBzdGVwIDw8IDEsIG4gPj4gMSkpKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsYWdyYW5nZShwb2ludHMpIHtcbiAgICAgICAgbGV0IHJvb3RzID0gW3RoaXMuRi5vbmVdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8cG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByb290cyA9IHRoaXMubXVsKHJvb3RzLCBbdGhpcy5GLm5lZyhwb2ludHNbaV1bMF0pLCB0aGlzLkYub25lXSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3VtID0gW107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBtcG9sID0gdGhpcy5ydWZmaW5pKHJvb3RzLCBwb2ludHNbaV1bMF0pO1xuICAgICAgICAgICAgY29uc3QgZmFjdG9yID1cbiAgICAgICAgICAgICAgICB0aGlzLkYubXVsKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkYuaW52KHRoaXMuZXZhbChtcG9sLCBwb2ludHNbaV1bMF0pKSxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldWzFdKTtcbiAgICAgICAgICAgIG1wb2wgPSB0aGlzLm11bFNjYWxhcihtcG9sLCBmYWN0b3IpO1xuICAgICAgICAgICAgc3VtID0gdGhpcy5hZGQoc3VtLCBtcG9sKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuXG4gICAgZmZ0KHApIHtcbiAgICAgICAgaWYgKHAubGVuZ3RoIDw9IDEpIHJldHVybiBwO1xuICAgICAgICBjb25zdCBiaXRzID0gbG9nMihwLmxlbmd0aC0xKSsxO1xuICAgICAgICB0aGlzLl9zZXRSb290cyhiaXRzKTtcblxuICAgICAgICBjb25zdCBtID0gMSA8PCBiaXRzO1xuICAgICAgICBjb25zdCBlcCA9IHRoaXMuZXh0ZW5kKHAsIG0pO1xuICAgICAgICBjb25zdCByZXMgPSBfX2ZmdCh0aGlzLCBlcCwgYml0cywgMCwgMSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZmZ0MihwKSB7XG4gICAgICAgIGlmIChwLmxlbmd0aCA8PSAxKSByZXR1cm4gcDtcbiAgICAgICAgY29uc3QgYml0cyA9IGxvZzIocC5sZW5ndGgtMSkrMTtcbiAgICAgICAgdGhpcy5fc2V0Um9vdHMoYml0cyk7XG5cbiAgICAgICAgY29uc3QgbSA9IDEgPDwgYml0cztcbiAgICAgICAgY29uc3QgZXAgPSB0aGlzLmV4dGVuZChwLCBtKTtcbiAgICAgICAgX19iaXRSZXZlcnNlKGVwLCBiaXRzKTtcbiAgICAgICAgY29uc3QgcmVzID0gX19mZnQyKHRoaXMsIGVwLCBiaXRzKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cblxuICAgIGlmZnQocCkge1xuXG4gICAgICAgIGlmIChwLmxlbmd0aCA8PSAxKSByZXR1cm4gcDtcbiAgICAgICAgY29uc3QgYml0cyA9IGxvZzIocC5sZW5ndGgtMSkrMTtcbiAgICAgICAgdGhpcy5fc2V0Um9vdHMoYml0cyk7XG4gICAgICAgIGNvbnN0IG0gPSAxIDw8IGJpdHM7XG4gICAgICAgIGNvbnN0IGVwID0gdGhpcy5leHRlbmQocCwgbSk7XG4gICAgICAgIGNvbnN0IHJlcyA9ICBfX2ZmdCh0aGlzLCBlcCwgYml0cywgMCwgMSk7XG5cbiAgICAgICAgY29uc3QgdHdvaW52bSA9IHRoaXMuRi5pbnYoIHRoaXMuRi5tdWxTY2FsYXIodGhpcy5GLm9uZSwgbSkgKTtcbiAgICAgICAgY29uc3QgcmVzbiA9IG5ldyBBcnJheShtKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPG07IGkrKykge1xuICAgICAgICAgICAgcmVzbltpXSA9IHRoaXMuRi5tdWwocmVzWyhtLWkpJW1dLCB0d29pbnZtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNuO1xuXG4gICAgfVxuXG5cbiAgICBpZmZ0MihwKSB7XG5cbiAgICAgICAgaWYgKHAubGVuZ3RoIDw9IDEpIHJldHVybiBwO1xuICAgICAgICBjb25zdCBiaXRzID0gbG9nMihwLmxlbmd0aC0xKSsxO1xuICAgICAgICB0aGlzLl9zZXRSb290cyhiaXRzKTtcbiAgICAgICAgY29uc3QgbSA9IDEgPDwgYml0cztcbiAgICAgICAgY29uc3QgZXAgPSB0aGlzLmV4dGVuZChwLCBtKTtcbiAgICAgICAgX19iaXRSZXZlcnNlKGVwLCBiaXRzKTtcbiAgICAgICAgY29uc3QgcmVzID0gIF9fZmZ0Mih0aGlzLCBlcCwgYml0cywgMCwgMSk7XG5cbiAgICAgICAgY29uc3QgdHdvaW52bSA9IHRoaXMuRi5pbnYoIHRoaXMuRi5tdWxTY2FsYXIodGhpcy5GLm9uZSwgbSkgKTtcbiAgICAgICAgY29uc3QgcmVzbiA9IG5ldyBBcnJheShtKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPG07IGkrKykge1xuICAgICAgICAgICAgcmVzbltpXSA9IHRoaXMuRi5tdWwocmVzWyhtLWkpJW1dLCB0d29pbnZtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNuO1xuXG4gICAgfVxuXG4gICAgX2ZmdChwYWxsLCBiaXRzLCBvZmZzZXQsIHN0ZXApIHtcblxuICAgICAgICBjb25zdCBuID0gMSA8PCBiaXRzO1xuICAgICAgICBpZiAobj09MSkge1xuICAgICAgICAgICAgcmV0dXJuIFsgcGFsbFtvZmZzZXRdIF07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZGl2MiA9IG4gPj4gMTtcbiAgICAgICAgY29uc3QgcDEgPSB0aGlzLl9mZnQocGFsbCwgYml0cy0xLCBvZmZzZXQsIHN0ZXAqMik7XG4gICAgICAgIGNvbnN0IHAyID0gdGhpcy5fZmZ0KHBhbGwsIGJpdHMtMSwgb2Zmc2V0K3N0ZXAsIHN0ZXAqMik7XG5cbiAgICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KG4pO1xuXG4gICAgICAgIGxldCBtPSB0aGlzLkYub25lO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8bmRpdjI7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gdGhpcy5GLmFkZChwMVtpXSwgdGhpcy5GLm11bChtLCBwMltpXSkpO1xuICAgICAgICAgICAgb3V0W2krbmRpdjJdID0gdGhpcy5GLnN1YihwMVtpXSwgdGhpcy5GLm11bChtLCBwMltpXSkpO1xuICAgICAgICAgICAgbSA9IHRoaXMuRi5tdWwobSwgdGhpcy53W2JpdHNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgZXh0ZW5kKHAsIGUpIHtcbiAgICAgICAgaWYgKGUgPT0gcC5sZW5ndGgpIHJldHVybiBwO1xuICAgICAgICBjb25zdCB6ID0gbmV3IEFycmF5KGUtcC5sZW5ndGgpLmZpbGwodGhpcy5GLnplcm8pO1xuXG4gICAgICAgIHJldHVybiBwLmNvbmNhdCh6KTtcbiAgICB9XG5cbiAgICByZWR1Y2UocCkge1xuICAgICAgICBpZiAocC5sZW5ndGggPT0gMCkgcmV0dXJuIHA7XG4gICAgICAgIGlmICghIHRoaXMuRi5lcShwW3AubGVuZ3RoLTFdLCB0aGlzLkYuemVybykgKSByZXR1cm4gcDtcbiAgICAgICAgbGV0IGk9cC5sZW5ndGgtMTtcbiAgICAgICAgd2hpbGUoIGk+MCAmJiB0aGlzLkYuZXEocFtpXSwgdGhpcy5GLnplcm8pICkgaS0tO1xuICAgICAgICByZXR1cm4gcC5zbGljZSgwLCBpKzEpO1xuICAgIH1cblxuICAgIGVxKGEsIGIpIHtcbiAgICAgICAgY29uc3QgcGEgPSB0aGlzLnJlZHVjZShhKTtcbiAgICAgICAgY29uc3QgcGIgPSB0aGlzLnJlZHVjZShiKTtcblxuICAgICAgICBpZiAocGEubGVuZ3RoICE9IHBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8cGIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5GLmVxKHBhW2ldLCBwYltpXSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJ1ZmZpbmkocCwgcikge1xuICAgICAgICBjb25zdCByZXMgPSBuZXcgQXJyYXkocC5sZW5ndGgtMSk7XG4gICAgICAgIHJlc1tyZXMubGVuZ3RoLTFdID0gcFtwLmxlbmd0aC0xXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHJlcy5sZW5ndGgtMjsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICByZXNbaV0gPSB0aGlzLkYuYWRkKHRoaXMuRi5tdWwocmVzW2krMV0sIHIpLCBwW2krMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX25leHQyUG93ZXIodikge1xuICAgICAgICB2LS07XG4gICAgICAgIHYgfD0gdiA+PiAxO1xuICAgICAgICB2IHw9IHYgPj4gMjtcbiAgICAgICAgdiB8PSB2ID4+IDQ7XG4gICAgICAgIHYgfD0gdiA+PiA4O1xuICAgICAgICB2IHw9IHYgPj4gMTY7XG4gICAgICAgIHYrKztcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcocCkge1xuICAgICAgICBjb25zdCBhcCA9IHRoaXMubm9ybWFsaXplKHApO1xuICAgICAgICBsZXQgUyA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGk9YXAubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLkYuZXEocFtpXSwgdGhpcy5GLnplcm8pKSB7XG4gICAgICAgICAgICAgICAgaWYgKFMhPVwiXCIpIFMgKz0gXCIgKyBcIjtcbiAgICAgICAgICAgICAgICBTID0gUyArIHBbaV0udG9TdHJpbmcoMTApO1xuICAgICAgICAgICAgICAgIGlmIChpPjApIHtcbiAgICAgICAgICAgICAgICAgICAgUyA9IFMgKyBcInhcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGk+MSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUyA9IFMgKyBcIl5cIiAraTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUztcbiAgICB9XG5cbiAgICBub3JtYWxpemUocCkge1xuICAgICAgICBjb25zdCByZXMgID0gbmV3IEFycmF5KHAubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc1tpXSA9IHRoaXMuRi5ub3JtYWxpemUocFtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cblxuICAgIF9yZWNpcHJvY2FsKHAsIGJpdHMpIHtcbiAgICAgICAgY29uc3QgayA9IDEgPDwgYml0cztcbiAgICAgICAgaWYgKGs9PTEpIHtcbiAgICAgICAgICAgIHJldHVybiBbIHRoaXMuRi5pbnYocFswXSkgXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBucCA9IHRoaXMuc2NhbGVYKHAsIC1rLzIpO1xuICAgICAgICBjb25zdCBxID0gdGhpcy5fcmVjaXByb2NhbChucCwgYml0cy0xKTtcbiAgICAgICAgY29uc3QgYSA9IHRoaXMuc2NhbGVYKHRoaXMuZG91YmxlKHEpLCAzKmsvMi0yKTtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMubXVsKCB0aGlzLnNxdWFyZShxKSwgcCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVYKHRoaXMuc3ViKGEsYiksICAgLShrLTIpKTtcbiAgICB9XG5cbiAgICAvLyBkaXZpZGVzIHhebSAvIHZcbiAgICBfZGl2MihtLCB2KSB7XG4gICAgICAgIGNvbnN0IGtiaXRzID0gbG9nMih2Lmxlbmd0aC0xKSsxO1xuICAgICAgICBjb25zdCBrID0gMSA8PCBrYml0cztcblxuICAgICAgICBjb25zdCBzY2FsZVYgPSBrIC0gdi5sZW5ndGg7XG5cbiAgICAgICAgLy8gcmVjID0geF4oayAtIDIpIC8gdiogeF5zY2FsZVYgPT5cbiAgICAgICAgLy8gcmVjID0geF4oay0yLXNjYWxlVikvIHZcbiAgICAgICAgLy9cbiAgICAgICAgLy8gcmVzID0geF5tL3YgPSB4XihtICsgKDIqay0yIC0gc2NhbGVWKSAtICgyKmstMiAtIHNjYWxlVikpIC92ID0+XG4gICAgICAgIC8vIHJlcyA9IHJlYyAqIHheKG0gLSAoMiprLTIgLSBzY2FsZVYpKSA9PlxuICAgICAgICAvLyByZXMgPSByZWMgKiB4XihtIC0gMiprICsgMiArIHNjYWxlVilcblxuICAgICAgICBjb25zdCByZWMgPSB0aGlzLl9yZWNpcHJvY2FsKHRoaXMuc2NhbGVYKHYsIHNjYWxlViksIGtiaXRzKTtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5zY2FsZVgocmVjLCBtIC0gMiprICsgMiArIHNjYWxlVik7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBkaXYoX3UsIF92KSB7XG4gICAgICAgIGlmIChfdS5sZW5ndGggPCBfdi5sZW5ndGgpIHJldHVybiBbXTtcbiAgICAgICAgY29uc3Qga2JpdHMgPSBsb2cyKF92Lmxlbmd0aC0xKSsxO1xuICAgICAgICBjb25zdCBrID0gMSA8PCBrYml0cztcblxuICAgICAgICBjb25zdCB1ID0gdGhpcy5zY2FsZVgoX3UsIGstX3YubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgdiA9IHRoaXMuc2NhbGVYKF92LCBrLV92Lmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgbiA9IHYubGVuZ3RoLTE7XG4gICAgICAgIGxldCBtID0gdS5sZW5ndGgtMTtcblxuICAgICAgICBjb25zdCBzID0gdGhpcy5fcmVjaXByb2NhbCh2LCBrYml0cyk7XG4gICAgICAgIGxldCB0O1xuICAgICAgICBpZiAobT4yKm4pIHtcbiAgICAgICAgICAgIHQgPSB0aGlzLnN1Yih0aGlzLnNjYWxlWChbdGhpcy5GLm9uZV0sIDIqbiksIHRoaXMubXVsKHMsIHYpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBxID0gW107XG4gICAgICAgIGxldCByZW0gPSB1O1xuICAgICAgICBsZXQgdXMsIHV0O1xuICAgICAgICBsZXQgZmluaXNoID0gZmFsc2U7XG5cbiAgICAgICAgd2hpbGUgKCFmaW5pc2gpIHtcbiAgICAgICAgICAgIHVzID0gdGhpcy5tdWwocmVtLCBzKTtcbiAgICAgICAgICAgIHEgPSB0aGlzLmFkZChxLCB0aGlzLnNjYWxlWCh1cywgLTIqbikpO1xuXG4gICAgICAgICAgICBpZiAoIG0gPiAyKm4gKSB7XG4gICAgICAgICAgICAgICAgdXQgPSB0aGlzLm11bChyZW0sIHQpO1xuICAgICAgICAgICAgICAgIHJlbSA9IHRoaXMuc2NhbGVYKHV0LCAtMipuKTtcbiAgICAgICAgICAgICAgICBtID0gcmVtLmxlbmd0aC0xO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaW5pc2ggPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfVxuXG5cbiAgICAvLyByZXR1cm5zIHRoZSBpdGggbnRoLXJvb3Qgb2Ygb25lXG4gICAgb25lUm9vdChuLCBpKSB7XG4gICAgICAgIGxldCBuYml0cyA9IGxvZzIobi0xKSsxO1xuICAgICAgICBsZXQgcmVzID0gdGhpcy5GLm9uZTtcbiAgICAgICAgbGV0IHIgPSBpO1xuXG4gICAgICAgIGlmKGk+PW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdpdmVuICdpJyBzaG91bGQgYmUgbG93ZXIgdGhhbiAnbidcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoMTw8bmJpdHMgIT09IG4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWwgZXJybHI6ICR7bn0gc2hvdWxkIGVxdWFsICR7MTw8bmJpdHN9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAocj4wKSB7XG4gICAgICAgICAgICBpZiAociAmIDEgPT0gMSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMuRi5tdWwocmVzLCB0aGlzLndbbmJpdHNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHIgPSByID4+IDE7XG4gICAgICAgICAgICBuYml0cyAtLTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGNvbXB1dGVWYW5pc2hpbmdQb2xpbm9taWFsKGJpdHMsIHQpIHtcbiAgICAgICAgY29uc3QgbSA9IDEgPDwgYml0cztcbiAgICAgICAgcmV0dXJuIHRoaXMuRi5zdWIodGhpcy5GLnBvdyh0LCBtKSwgdGhpcy5GLm9uZSk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGVMYWdyYW5nZVBvbHlub21pYWxzKGJpdHMsIHQpIHtcbiAgICAgICAgY29uc3QgbT0gMSA8PCBiaXRzO1xuICAgICAgICBjb25zdCB0bSA9IHRoaXMuRi5wb3codCwgbSk7XG4gICAgICAgIGNvbnN0IHU9IG5ldyBBcnJheShtKS5maWxsKHRoaXMuRi56ZXJvKTtcbiAgICAgICAgdGhpcy5fc2V0Um9vdHMoYml0cyk7XG4gICAgICAgIGNvbnN0IG9tZWdhID0gdGhpcy53W2JpdHNdO1xuXG4gICAgICAgIGlmICh0aGlzLkYuZXEodG0sIHRoaXMuRi5vbmUpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLkYuZXEodGhpcy5yb290c1tiaXRzXVswXSx0KSkgeyAvLyBpLmUuLCB0IGVxdWFscyBvbWVnYV5pXG4gICAgICAgICAgICAgICAgICAgIHVbaV0gPSB0aGlzLkYub25lO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB6ID0gdGhpcy5GLnN1Yih0bSwgdGhpcy5GLm9uZSk7XG4gICAgICAgIC8vICAgICAgICBsZXQgbCA9IHRoaXMuRi5tdWwoeiwgIHRoaXMuRi5wb3codGhpcy5GLnR3b2ludiwgbSkpO1xuICAgICAgICBsZXQgbCA9IHRoaXMuRi5tdWwoeiwgIHRoaXMuRi5pbnYodGhpcy5GLmUobSkpKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICAgIHVbaV0gPSB0aGlzLkYubXVsKGwsIHRoaXMuRi5pbnYodGhpcy5GLnN1Yih0LHRoaXMucm9vdHNbYml0c11baV0pKSk7XG4gICAgICAgICAgICBsID0gdGhpcy5GLm11bChsLCBvbWVnYSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdTtcbiAgICB9XG5cbiAgICBsb2cyKFYpIHtcbiAgICAgICAgcmV0dXJuIGxvZzIoVik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2cyKCBWIClcbntcbiAgICByZXR1cm4oICggKCBWICYgMHhGRkZGMDAwMCApICE9PSAwID8gKCBWICY9IDB4RkZGRjAwMDAsIDE2ICkgOiAwICkgfCAoICggViAmIDB4RkYwMEZGMDAgKSAhPT0gMCA/ICggViAmPSAweEZGMDBGRjAwLCA4ICkgOiAwICkgfCAoICggViAmIDB4RjBGMEYwRjAgKSAhPT0gMCA/ICggViAmPSAweEYwRjBGMEYwLCA0ICkgOiAwICkgfCAoICggViAmIDB4Q0NDQ0NDQ0MgKSAhPT0gMCA/ICggViAmPSAweENDQ0NDQ0NDLCAyICkgOiAwICkgfCAoICggViAmIDB4QUFBQUFBQUEgKSAhPT0gMCApICk7XG59XG5cblxuZnVuY3Rpb24gX19mZnQoUEYsIHBhbGwsIGJpdHMsIG9mZnNldCwgc3RlcCkge1xuXG4gICAgY29uc3QgbiA9IDEgPDwgYml0cztcbiAgICBpZiAobj09MSkge1xuICAgICAgICByZXR1cm4gWyBwYWxsW29mZnNldF0gXTtcbiAgICB9IGVsc2UgaWYgKG49PTIpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIFBGLkYuYWRkKHBhbGxbb2Zmc2V0XSwgcGFsbFtvZmZzZXQgKyBzdGVwXSksXG4gICAgICAgICAgICBQRi5GLnN1YihwYWxsW29mZnNldF0sIHBhbGxbb2Zmc2V0ICsgc3RlcF0pXTtcbiAgICB9XG5cbiAgICBjb25zdCBuZGl2MiA9IG4gPj4gMTtcbiAgICBjb25zdCBwMSA9IF9fZmZ0KFBGLCBwYWxsLCBiaXRzLTEsIG9mZnNldCwgc3RlcCoyKTtcbiAgICBjb25zdCBwMiA9IF9fZmZ0KFBGLCBwYWxsLCBiaXRzLTEsIG9mZnNldCtzdGVwLCBzdGVwKjIpO1xuXG4gICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KG4pO1xuXG4gICAgZm9yIChsZXQgaT0wOyBpPG5kaXYyOyBpKyspIHtcbiAgICAgICAgb3V0W2ldID0gUEYuRi5hZGQocDFbaV0sIFBGLkYubXVsKFBGLnJvb3RzW2JpdHNdW2ldLCBwMltpXSkpO1xuICAgICAgICBvdXRbaStuZGl2Ml0gPSBQRi5GLnN1YihwMVtpXSwgUEYuRi5tdWwoUEYucm9vdHNbYml0c11baV0sIHAyW2ldKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbn1cblxuXG5mdW5jdGlvbiBfX2ZmdDIoUEYsIHBhbGwsIGJpdHMpIHtcblxuICAgIGNvbnN0IG4gPSAxIDw8IGJpdHM7XG4gICAgaWYgKG49PTEpIHtcbiAgICAgICAgcmV0dXJuIFsgcGFsbFswXSBdO1xuICAgIH1cblxuICAgIGNvbnN0IG5kaXYyID0gbiA+PiAxO1xuICAgIGNvbnN0IHAxID0gX19mZnQyKFBGLCBwYWxsLnNsaWNlKDAsIG5kaXYyKSwgYml0cy0xKTtcbiAgICBjb25zdCBwMiA9IF9fZmZ0MihQRiwgcGFsbC5zbGljZShuZGl2MiksIGJpdHMtMSk7XG5cbiAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkobik7XG5cbiAgICBmb3IgKGxldCBpPTA7IGk8bmRpdjI7IGkrKykge1xuICAgICAgICBvdXRbaV0gPSBQRi5GLmFkZChwMVtpXSwgUEYuRi5tdWwoUEYucm9vdHNbYml0c11baV0sIHAyW2ldKSk7XG4gICAgICAgIG91dFtpK25kaXYyXSA9IFBGLkYuc3ViKHAxW2ldLCBQRi5GLm11bChQRi5yb290c1tiaXRzXVtpXSwgcDJbaV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xufVxuXG5jb25zdCBfcmV2VGFibGUgPSBbXTtcbmZvciAobGV0IGk9MDsgaTwyNTY7IGkrKykge1xuICAgIF9yZXZUYWJsZVtpXSA9IF9yZXZTbG93KGksIDgpO1xufVxuXG5mdW5jdGlvbiBfcmV2U2xvdyhpZHgsIGJpdHMpIHtcbiAgICBsZXQgcmVzID0wO1xuICAgIGxldCBhID0gaWR4O1xuICAgIGZvciAobGV0IGk9MDsgaTxiaXRzOyBpKyspIHtcbiAgICAgICAgcmVzIDw8PSAxO1xuICAgICAgICByZXMgPSByZXMgfCAoYSAmMSk7XG4gICAgICAgIGEgPj49MTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gcmV2KGlkeCwgYml0cykge1xuICAgIHJldHVybiAoXG4gICAgICAgIF9yZXZUYWJsZVtpZHggPj4+IDI0XSB8XG4gICAgICAgIChfcmV2VGFibGVbKGlkeCA+Pj4gMTYpICYgMHhGRl0gPDwgOCkgfFxuICAgICAgICAoX3JldlRhYmxlWyhpZHggPj4+IDgpICYgMHhGRl0gPDwgMTYpIHxcbiAgICAgICAgKF9yZXZUYWJsZVtpZHggJiAweEZGXSA8PCAyNClcbiAgICApID4+PiAoMzItYml0cyk7XG59XG5cbmZ1bmN0aW9uIF9fYml0UmV2ZXJzZShwLCBiaXRzKSB7XG4gICAgZm9yIChsZXQgaz0wOyBrPHAubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgY29uc3QgciA9IHJldihrLCBiaXRzKTtcbiAgICAgICAgaWYgKHI+aykge1xuICAgICAgICAgICAgY29uc3QgdG1wPSBwW2tdO1xuICAgICAgICAgICAgcFtrXSA9IHBbcl07XG4gICAgICAgICAgICBwW3JdID0gdG1wO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuIiwiLypcbiAgICBDb3B5cmlnaHQgMjAxOCAwa2ltcyBhc3NvY2lhdGlvbi5cblxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHNuYXJranMuXG5cbiAgICBzbmFya2pzIGlzIGEgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gICAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICAgIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKVxuICAgIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgc25hcmtqcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWVxuICAgIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvclxuICAgIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nIHdpdGhcbiAgICBzbmFya2pzLiBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuaW1wb3J0ICogYXMgU2NhbGFyIGZyb20gXCIuL3NjYWxhci5qc1wiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBtdWxTY2FsYXIoRiwgYmFzZSwgZSkge1xuICAgIGxldCByZXM7XG5cbiAgICBpZiAoU2NhbGFyLmlzWmVybyhlKSkgcmV0dXJuIEYuemVybztcblxuICAgIGNvbnN0IG4gPSBTY2FsYXIubmFmKGUpO1xuXG4gICAgaWYgKG5bbi5sZW5ndGgtMV0gPT0gMSkge1xuICAgICAgICByZXMgPSBiYXNlO1xuICAgIH0gZWxzZSBpZiAobltuLmxlbmd0aC0xXSA9PSAtMSkge1xuICAgICAgICByZXMgPSBGLm5lZyhiYXNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZsYXVkIE5BRlwiKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpPW4ubGVuZ3RoLTI7IGk+PTA7IGktLSkge1xuXG4gICAgICAgIHJlcyA9IEYuZG91YmxlKHJlcyk7XG5cbiAgICAgICAgaWYgKG5baV0gPT0gMSkge1xuICAgICAgICAgICAgcmVzID0gRi5hZGQocmVzLCBiYXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChuW2ldID09IC0xKSB7XG4gICAgICAgICAgICByZXMgPSBGLnN1YihyZXMsIGJhc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuXG4vKlxuZXhwb3J0cy5tdWxTY2FsYXIgPSAoRiwgYmFzZSwgZSkgPT57XG4gICAgbGV0IHJlcyA9IEYuemVybztcbiAgICBsZXQgcmVtID0gYmlnSW50KGUpO1xuICAgIGxldCBleHAgPSBiYXNlO1xuXG4gICAgd2hpbGUgKCEgcmVtLmVxKGJpZ0ludC56ZXJvKSkge1xuICAgICAgICBpZiAocmVtLmFuZChiaWdJbnQub25lKS5lcShiaWdJbnQub25lKSkge1xuICAgICAgICAgICAgcmVzID0gRi5hZGQocmVzLCBleHApO1xuICAgICAgICB9XG4gICAgICAgIGV4cCA9IEYuZG91YmxlKGV4cCk7XG4gICAgICAgIHJlbSA9IHJlbS5zaGlmdFJpZ2h0KDEpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG59O1xuKi9cblxuXG5leHBvcnQgZnVuY3Rpb24gZXhwKEYsIGJhc2UsIGUpIHtcblxuICAgIGlmIChTY2FsYXIuaXNaZXJvKGUpKSByZXR1cm4gRi5vbmU7XG5cbiAgICBjb25zdCBuID0gU2NhbGFyLmJpdHMoZSk7XG5cbiAgICBpZiAobi5sZWd0aD09MCkgcmV0dXJuIEYub25lO1xuXG4gICAgbGV0IHJlcyA9IGJhc2U7XG5cbiAgICBmb3IgKGxldCBpPW4ubGVuZ3RoLTI7IGk+PTA7IGktLSkge1xuXG4gICAgICAgIHJlcyA9IEYuc3F1YXJlKHJlcyk7XG5cbiAgICAgICAgaWYgKG5baV0pIHtcbiAgICAgICAgICAgIHJlcyA9IEYubXVsKHJlcywgYmFzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufVxuXG5cbiIsImltcG9ydCAqIGFzIFNjYWxhciBmcm9tIFwiLi9zY2FsYXIuanNcIjtcbi8vIENoZWNrIGhlcmU6IGh0dHBzOi8vZXByaW50LmlhY3Iub3JnLzIwMTIvNjg1LnBkZlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZFNxcnQgKEYpIHtcbiAgICBpZiAoKEYubSAlIDIpID09IDEpIHtcbiAgICAgICAgaWYgKFNjYWxhci5lcShTY2FsYXIubW9kKEYucCwgNCksIDEgKSkge1xuICAgICAgICAgICAgaWYgKFNjYWxhci5lcShTY2FsYXIubW9kKEYucCwgOCksIDEgKSkge1xuICAgICAgICAgICAgICAgIGlmIChTY2FsYXIuZXEoU2NhbGFyLm1vZChGLnAsIDE2KSwgMSApKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsZzdfbXVsbGVyKEYpO1xuICAgICAgICAgICAgICAgICAgICBhbGc1X3RvbmVsbGlTaGFua3MoRik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChTY2FsYXIuZXEoU2NhbGFyLm1vZChGLnAsIDE2KSwgOSApKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZzRfa29uZyhGKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGaWVsZCB3aXRob3Qgc3FydFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFNjYWxhci5lcShTY2FsYXIubW9kKEYucCwgOCksIDUgKSkge1xuICAgICAgICAgICAgICAgIGFsZzNfYXRraW4oRik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZpZWxkIHdpdGhvdCBzcXJ0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFNjYWxhci5lcShTY2FsYXIubW9kKEYucCwgNCksIDMgKSkge1xuICAgICAgICAgICAgYWxnMl9zaGFua3MoRik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwbTJtb2Q0ID0gU2NhbGFyLm1vZChTY2FsYXIucG93KEYucCwgRi5tLzIpLCA0KTtcbiAgICAgICAgaWYgKHBtMm1vZDQgPT0gMSkge1xuICAgICAgICAgICAgYWxnMTBfYWRqKEYpO1xuICAgICAgICB9IGVsc2UgaWYgKHBtMm1vZDQgPT0gMykge1xuICAgICAgICAgICAgYWxnOV9hZGooRik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGc4X2NvbXBsZXgoRik7XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBhbGc1X3RvbmVsbGlTaGFua3MoRikge1xuICAgIEYuc3FydF9xID0gU2NhbGFyLnBvdyhGLnAsIEYubSk7XG5cbiAgICBGLnNxcnRfcyA9IDA7XG4gICAgRi5zcXJ0X3QgPSBTY2FsYXIuc3ViKEYuc3FydF9xLCAxKTtcblxuICAgIHdoaWxlICghU2NhbGFyLmlzT2RkKEYuc3FydF90KSkge1xuICAgICAgICBGLnNxcnRfcyA9IEYuc3FydF9zICsgMTtcbiAgICAgICAgRi5zcXJ0X3QgPSBTY2FsYXIuZGl2KEYuc3FydF90LCAyKTtcbiAgICB9XG5cbiAgICBsZXQgYzAgPSBGLm9uZTtcblxuICAgIHdoaWxlIChGLmVxKGMwLCBGLm9uZSkpIHtcbiAgICAgICAgY29uc3QgYyA9IEYucmFuZG9tKCk7XG4gICAgICAgIEYuc3FydF96ID0gRi5wb3coYywgRi5zcXJ0X3QpO1xuICAgICAgICBjMCA9IEYucG93KEYuc3FydF96LCAyICoqIChGLnNxcnRfcy0xKSApO1xuICAgIH1cblxuICAgIEYuc3FydF90bTFkMiA9IFNjYWxhci5kaXYoU2NhbGFyLnN1YihGLnNxcnRfdCwgMSksMik7XG5cbiAgICBGLnNxcnQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGNvbnN0IEY9dGhpcztcbiAgICAgICAgaWYgKEYuaXNaZXJvKGEpKSByZXR1cm4gRi56ZXJvO1xuICAgICAgICBsZXQgdyA9IEYucG93KGEsIEYuc3FydF90bTFkMik7XG4gICAgICAgIGNvbnN0IGEwID0gRi5wb3coIEYubXVsKEYuc3F1YXJlKHcpLCBhKSwgMiAqKiAoRi5zcXJ0X3MtMSkgKTtcbiAgICAgICAgaWYgKEYuZXEoYTAsIEYubmVnb25lKSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IHYgPSBGLnNxcnRfcztcbiAgICAgICAgbGV0IHggPSBGLm11bChhLCB3KTtcbiAgICAgICAgbGV0IGIgPSBGLm11bCh4LCB3KTtcbiAgICAgICAgbGV0IHogPSBGLnNxcnRfejtcbiAgICAgICAgd2hpbGUgKCFGLmVxKGIsIEYub25lKSkge1xuICAgICAgICAgICAgbGV0IGIyayA9IEYuc3F1YXJlKGIpO1xuICAgICAgICAgICAgbGV0IGs9MTtcbiAgICAgICAgICAgIHdoaWxlICghRi5lcShiMmssIEYub25lKSkge1xuICAgICAgICAgICAgICAgIGIyayA9IEYuc3F1YXJlKGIyayk7XG4gICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ID0gejtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTx2LWstMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdyA9IEYuc3F1YXJlKHcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeiA9IEYuc3F1YXJlKHcpO1xuICAgICAgICAgICAgYiA9IEYubXVsKGIsIHopO1xuICAgICAgICAgICAgeCA9IEYubXVsKHgsIHcpO1xuICAgICAgICAgICAgdiA9IGs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEYuZ2VxKHgsIEYuemVybykgPyB4IDogRi5uZWcoeCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWxnNF9rb25nKEYpIHtcbiAgICBGLnNxcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3FydCBhbGcgNCBub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWxnM19hdGtpbihGKSB7XG4gICAgRi5zcXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNxcnQgYWxnIDMgbm90IGltcGxlbWVudGVkXCIpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFsZzJfc2hhbmtzKEYpIHtcblxuICAgIEYuc3FydF9xID0gU2NhbGFyLnBvdyhGLnAsIEYubSk7XG4gICAgRi5zcXJ0X2UxID0gU2NhbGFyLmRpdiggU2NhbGFyLnN1YihGLnNxcnRfcSwgMykgLCA0KTtcblxuICAgIEYuc3FydCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNaZXJvKGEpKSByZXR1cm4gdGhpcy56ZXJvO1xuXG4gICAgICAgIC8vIFRlc3QgdGhhdCBoYXZlIHNvbHV0aW9uXG4gICAgICAgIGNvbnN0IGExID0gdGhpcy5wb3coYSwgdGhpcy5zcXJ0X2UxKTtcblxuICAgICAgICBjb25zdCBhMCA9IHRoaXMubXVsKHRoaXMuc3F1YXJlKGExKSwgYSk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmVxKGEwLCB0aGlzLm5lZ29uZSkgKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCB4ID0gdGhpcy5tdWwoYTEsIGEpO1xuXG4gICAgICAgIHJldHVybiBGLmdlcSh4LCBGLnplcm8pID8geCA6IEYubmVnKHgpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFsZzEwX2FkaihGKSB7XG4gICAgRi5zcXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNxcnQgYWxnIDEwIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhbGc5X2FkaihGKSB7XG4gICAgRi5zcXJ0X3EgPSBTY2FsYXIucG93KEYucCwgRi5tLzIpO1xuICAgIEYuc3FydF9lMzQgPSBTY2FsYXIuZGl2KCBTY2FsYXIuc3ViKEYuc3FydF9xLCAzKSAsIDQpO1xuICAgIEYuc3FydF9lMTIgPSBTY2FsYXIuZGl2KCBTY2FsYXIuc3ViKEYuc3FydF9xLCAxKSAsIDIpO1xuXG4gICAgRi5mcm9iZW5pdXMgPSBmdW5jdGlvbihuLCB4KSB7XG4gICAgICAgIGlmICgobiUyKSA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gRi5jb25qdWdhdGUoeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGLnNxcnQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGNvbnN0IEYgPSB0aGlzO1xuICAgICAgICBjb25zdCBhMSA9IEYucG93KGEsIEYuc3FydF9lMzQpO1xuICAgICAgICBjb25zdCBhbGZhID0gRi5tdWwoRi5zcXVhcmUoYTEpLCBhKTtcbiAgICAgICAgY29uc3QgYTAgPSBGLm11bChGLmZyb2Jlbml1cygxLCBhbGZhKSwgYWxmYSk7XG4gICAgICAgIGlmIChGLmVxKGEwLCBGLm5lZ29uZSkpIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCB4MCA9IEYubXVsKGExLCBhKTtcbiAgICAgICAgbGV0IHg7XG4gICAgICAgIGlmIChGLmVxKGFsZmEsIEYubmVnb25lKSkge1xuICAgICAgICAgICAgeCA9IEYubXVsKHgwLCBbRi5GLnplcm8sIEYuRi5vbmVdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBGLnBvdyhGLmFkZChGLm9uZSwgYWxmYSksIEYuc3FydF9lMTIpO1xuICAgICAgICAgICAgeCA9IEYubXVsKGIsIHgwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRi5nZXEoeCwgRi56ZXJvKSA/IHggOiBGLm5lZyh4KTtcbiAgICB9O1xufVxuXG5cbmZ1bmN0aW9uIGFsZzhfY29tcGxleChGKSB7XG4gICAgRi5zcXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNxcnQgYWxnIDggbm90IGltcGxlbWVudGVkXCIpO1xuICAgIH07XG59XG4iLCJcblxuaW1wb3J0ICogYXMgU2NhbGFyIGZyb20gXCIuL3NjYWxhci5qc1wiO1xuXG5cbmZ1bmN0aW9uIHF1YXJ0ZXJSb3VuZChzdCwgYSwgYiwgYywgZCkge1xuXG4gICAgc3RbYV0gPSAoc3RbYV0gKyBzdFtiXSkgPj4+IDA7XG4gICAgc3RbZF0gPSAoc3RbZF0gXiBzdFthXSkgPj4+IDA7XG4gICAgc3RbZF0gPSAoKHN0W2RdIDw8IDE2KSB8ICgoc3RbZF0+Pj4xNikgJiAweEZGRkYpKSA+Pj4gMDtcblxuICAgIHN0W2NdID0gKHN0W2NdICsgc3RbZF0pID4+PiAwO1xuICAgIHN0W2JdID0gKHN0W2JdIF4gc3RbY10pID4+PiAwO1xuICAgIHN0W2JdID0gKChzdFtiXSA8PCAxMikgfCAoKHN0W2JdPj4+MjApICYgMHhGRkYpKSA+Pj4gMDtcblxuICAgIHN0W2FdID0gKHN0W2FdICsgc3RbYl0pID4+PiAwO1xuICAgIHN0W2RdID0gKHN0W2RdIF4gc3RbYV0pID4+PiAwO1xuICAgIHN0W2RdID0gKChzdFtkXSA8PCA4KSB8ICgoc3RbZF0+Pj4yNCkgJiAweEZGKSkgPj4+IDA7XG5cbiAgICBzdFtjXSA9IChzdFtjXSArIHN0W2RdKSA+Pj4gMDtcbiAgICBzdFtiXSA9IChzdFtiXSBeIHN0W2NdKSA+Pj4gMDtcbiAgICBzdFtiXSA9ICgoc3RbYl0gPDwgNykgfCAoKHN0W2JdPj4+MjUpICYgMHg3RikpID4+PiAwO1xufVxuXG5mdW5jdGlvbiBkb3VibGVSb3VuZChzdCkge1xuICAgIHF1YXJ0ZXJSb3VuZChzdCwgMCwgNCwgOCwxMik7XG4gICAgcXVhcnRlclJvdW5kKHN0LCAxLCA1LCA5LDEzKTtcbiAgICBxdWFydGVyUm91bmQoc3QsIDIsIDYsMTAsMTQpO1xuICAgIHF1YXJ0ZXJSb3VuZChzdCwgMywgNywxMSwxNSk7XG5cbiAgICBxdWFydGVyUm91bmQoc3QsIDAsIDUsMTAsMTUpO1xuICAgIHF1YXJ0ZXJSb3VuZChzdCwgMSwgNiwxMSwxMik7XG4gICAgcXVhcnRlclJvdW5kKHN0LCAyLCA3LCA4LDEzKTtcbiAgICBxdWFydGVyUm91bmQoc3QsIDMsIDQsIDksMTQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFDaGEge1xuXG4gICAgY29uc3RydWN0b3Ioc2VlZCkge1xuICAgICAgICBzZWVkID0gc2VlZCB8fCBbMCwwLDAsMCwwLDAsMCwwXTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFtcbiAgICAgICAgICAgIDB4NjE3MDc4NjUsXG4gICAgICAgICAgICAweDMzMjA2NDZFLFxuICAgICAgICAgICAgMHg3OTYyMkQzMixcbiAgICAgICAgICAgIDB4NkIyMDY1NzQsXG4gICAgICAgICAgICBzZWVkWzBdLFxuICAgICAgICAgICAgc2VlZFsxXSxcbiAgICAgICAgICAgIHNlZWRbMl0sXG4gICAgICAgICAgICBzZWVkWzNdLFxuICAgICAgICAgICAgc2VlZFs0XSxcbiAgICAgICAgICAgIHNlZWRbNV0sXG4gICAgICAgICAgICBzZWVkWzZdLFxuICAgICAgICAgICAgc2VlZFs3XSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5pZHggPSAxNjtcbiAgICAgICAgdGhpcy5idWZmID0gbmV3IEFycmF5KDE2KTtcbiAgICB9XG5cbiAgICBuZXh0VTMyKCkge1xuICAgICAgICBpZiAodGhpcy5pZHggPT0gMTYpIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZbdGhpcy5pZHgrK107XG4gICAgfVxuXG4gICAgbmV4dFU2NCgpIHtcbiAgICAgICAgcmV0dXJuIFNjYWxhci5hZGQoU2NhbGFyLm11bCh0aGlzLm5leHRVMzIoKSwgMHgxMDAwMDAwMDApLCB0aGlzLm5leHRVMzIoKSk7XG4gICAgfVxuXG4gICAgbmV4dEJvb2woKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5uZXh0VTMyKCkgJiAxKSA9PSAxO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgLy8gQ29weSB0aGUgc3RhdGVcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDE2OyBpKyspIHRoaXMuYnVmZltpXSA9IHRoaXMuc3RhdGVbaV07XG5cbiAgICAgICAgLy8gQXBwbHkgdGhlIHJvdW5kc1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTA7IGkrKykgZG91YmxlUm91bmQodGhpcy5idWZmKTtcblxuICAgICAgICAvLyBBZGQgdG8gdGhlIGluaXRpYWxcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDE2OyBpKyspIHRoaXMuYnVmZltpXSA9ICh0aGlzLmJ1ZmZbaV0gKyB0aGlzLnN0YXRlW2ldKSA+Pj4gMDtcblxuICAgICAgICB0aGlzLmlkeCA9IDA7XG5cbiAgICAgICAgdGhpcy5zdGF0ZVsxMl0gPSAodGhpcy5zdGF0ZVsxMl0gKyAxKSA+Pj4gMDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVbMTJdICE9IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5zdGF0ZVsxM10gPSAodGhpcy5zdGF0ZVsxM10gKyAxKSA+Pj4gMDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVbMTNdICE9IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5zdGF0ZVsxNF0gPSAodGhpcy5zdGF0ZVsxNF0gKyAxKSA+Pj4gMDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVbMTRdICE9IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5zdGF0ZVsxNV0gPSAodGhpcy5zdGF0ZVsxNV0gKyAxKSA+Pj4gMDtcbiAgICB9XG59XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5pbXBvcnQgQ2hhQ2hhIGZyb20gXCIuL2NoYWNoYS5qc1wiO1xuaW1wb3J0IGNyeXB0byBmcm9tIFwiY3J5cHRvXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21CeXRlcyhuKSB7XG4gICAgbGV0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkobik7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQnJvd3NlclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5jcnlwdG8gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gU3VwcG9ydGVkXG4gICAgICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnJheSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZhbGxiYWNrXG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8bjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSAoTWF0aC5yYW5kb20oKSo0Mjk0OTY3Mjk2KT4+PjA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7IC8vIE5vZGVKU1xuICAgICAgICBjcnlwdG8ucmFuZG9tRmlsbFN5bmMoYXJyYXkpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21TZWVkKCkge1xuICAgIGNvbnN0IGFyciA9IGdldFJhbmRvbUJ5dGVzKDMyKTtcbiAgICBjb25zdCBhcnJWID0gbmV3IFVpbnQzMkFycmF5KGFyci5idWZmZXIpO1xuICAgIGNvbnN0IHNlZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpPTA7IGk8ODsgaSsrKSB7XG4gICAgICAgIHNlZWQucHVzaChhcnJWW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlZWQ7XG59XG5cbmxldCB0aHJlYWRSbmcgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhyZWFkUm5nKCkge1xuICAgIGlmICh0aHJlYWRSbmcpIHJldHVybiB0aHJlYWRSbmc7XG4gICAgdGhyZWFkUm5nID0gbmV3IENoYUNoYShnZXRSYW5kb21TZWVkKCkpO1xuICAgIHJldHVybiB0aHJlYWRSbmc7XG59XG4iLCIvKiBnbG9iYWwgQmlnSW50ICovXG5pbXBvcnQgKiBhcyBTY2FsYXIgZnJvbSBcIi4vc2NhbGFyLmpzXCI7XG5pbXBvcnQgKiBhcyBmdXRpbHMgZnJvbSBcIi4vZnV0aWxzLmpzXCI7XG5pbXBvcnQgYnVpbGRTcXJ0IGZyb20gXCIuL2ZzcXJ0LmpzXCI7XG5pbXBvcnQge2dldFJhbmRvbUJ5dGVzfSBmcm9tIFwiLi9yYW5kb20uanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWnFGaWVsZCB7XG4gICAgY29uc3RydWN0b3IocCkge1xuICAgICAgICB0aGlzLnR5cGU9XCJGMVwiO1xuICAgICAgICB0aGlzLm9uZSA9IDFuO1xuICAgICAgICB0aGlzLnplcm8gPSAwbjtcbiAgICAgICAgdGhpcy5wID0gQmlnSW50KHApO1xuICAgICAgICB0aGlzLm0gPSAxO1xuICAgICAgICB0aGlzLm5lZ29uZSA9IHRoaXMucC0xbjtcbiAgICAgICAgdGhpcy50d28gPSAybjtcbiAgICAgICAgdGhpcy5oYWxmID0gdGhpcy5wID4+IDFuO1xuICAgICAgICB0aGlzLmJpdExlbmd0aCA9IFNjYWxhci5iaXRMZW5ndGgodGhpcy5wKTtcbiAgICAgICAgdGhpcy5tYXNrID0gKDFuIDw8IEJpZ0ludCh0aGlzLmJpdExlbmd0aCkpIC0gMW47XG5cbiAgICAgICAgdGhpcy5uNjQgPSBNYXRoLmZsb29yKCh0aGlzLmJpdExlbmd0aCAtIDEpIC8gNjQpKzE7XG4gICAgICAgIHRoaXMubjMyID0gdGhpcy5uNjQqMjtcbiAgICAgICAgdGhpcy5uOCA9IHRoaXMubjY0Kjg7XG4gICAgICAgIHRoaXMuUiA9IHRoaXMuZSgxbiA8PCBCaWdJbnQodGhpcy5uNjQqNjQpKTtcbiAgICAgICAgdGhpcy5SaSA9IHRoaXMuaW52KHRoaXMuUik7XG5cbiAgICAgICAgY29uc3QgZSA9IHRoaXMubmVnb25lID4+IDFuO1xuICAgICAgICB0aGlzLm5xciA9IHRoaXMudHdvO1xuICAgICAgICBsZXQgciA9IHRoaXMucG93KHRoaXMubnFyLCBlKTtcbiAgICAgICAgd2hpbGUgKCF0aGlzLmVxKHIsIHRoaXMubmVnb25lKSkge1xuICAgICAgICAgICAgdGhpcy5ucXIgPSB0aGlzLm5xciArIDFuO1xuICAgICAgICAgICAgciA9IHRoaXMucG93KHRoaXMubnFyLCBlKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5zID0gMDtcbiAgICAgICAgdGhpcy50ID0gdGhpcy5uZWdvbmU7XG5cbiAgICAgICAgd2hpbGUgKCh0aGlzLnQgJiAxbikgPT0gMG4pIHtcbiAgICAgICAgICAgIHRoaXMucyA9IHRoaXMucyArIDE7XG4gICAgICAgICAgICB0aGlzLnQgPSB0aGlzLnQgPj4gMW47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5xcl90b190ID0gdGhpcy5wb3codGhpcy5ucXIsIHRoaXMudCk7XG5cbiAgICAgICAgYnVpbGRTcXJ0KHRoaXMpO1xuICAgIH1cblxuICAgIGUoYSxiKSB7XG4gICAgICAgIGxldCByZXM7XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgcmVzID0gQmlnSW50KGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGI9PTE2KSB7XG4gICAgICAgICAgICByZXMgPSBCaWdJbnQoXCIweFwiK2EpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXMgPCAwKSB7XG4gICAgICAgICAgICBsZXQgbnJlcyA9IC1yZXM7XG4gICAgICAgICAgICBpZiAobnJlcyA+PSB0aGlzLnApIG5yZXMgPSBucmVzICUgdGhpcy5wO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucCAtIG5yZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKHJlcz49IHRoaXMucCkgPyByZXMldGhpcy5wIDogcmVzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhZGQoYSwgYikge1xuICAgICAgICBjb25zdCByZXMgPSBhICsgYjtcbiAgICAgICAgcmV0dXJuIHJlcyA+PSB0aGlzLnAgPyByZXMtdGhpcy5wIDogcmVzO1xuICAgIH1cblxuICAgIHN1YihhLCBiKSB7XG4gICAgICAgIHJldHVybiAoYSA+PSBiKSA/IGEtYiA6IHRoaXMucC1iK2E7XG4gICAgfVxuXG4gICAgbmVnKGEpIHtcbiAgICAgICAgcmV0dXJuIGEgPyB0aGlzLnAtYSA6IGE7XG4gICAgfVxuXG4gICAgbXVsKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhKmIpJXRoaXMucDtcbiAgICB9XG5cbiAgICBtdWxTY2FsYXIoYmFzZSwgcykge1xuICAgICAgICByZXR1cm4gKGJhc2UgKiB0aGlzLmUocykpICUgdGhpcy5wO1xuICAgIH1cblxuICAgIHNxdWFyZShhKSB7XG4gICAgICAgIHJldHVybiAoYSphKSAlIHRoaXMucDtcbiAgICB9XG5cbiAgICBlcShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhPT1iO1xuICAgIH1cblxuICAgIG5lcShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIT1iO1xuICAgIH1cblxuICAgIGx0KGEsIGIpIHtcbiAgICAgICAgY29uc3QgYWEgPSAoYSA+IHRoaXMuaGFsZikgPyBhIC0gdGhpcy5wIDogYTtcbiAgICAgICAgY29uc3QgYmIgPSAoYiA+IHRoaXMuaGFsZikgPyBiIC0gdGhpcy5wIDogYjtcbiAgICAgICAgcmV0dXJuIGFhIDwgYmI7XG4gICAgfVxuXG4gICAgZ3QoYSwgYikge1xuICAgICAgICBjb25zdCBhYSA9IChhID4gdGhpcy5oYWxmKSA/IGEgLSB0aGlzLnAgOiBhO1xuICAgICAgICBjb25zdCBiYiA9IChiID4gdGhpcy5oYWxmKSA/IGIgLSB0aGlzLnAgOiBiO1xuICAgICAgICByZXR1cm4gYWEgPiBiYjtcbiAgICB9XG5cbiAgICBsZXEoYSwgYikge1xuICAgICAgICBjb25zdCBhYSA9IChhID4gdGhpcy5oYWxmKSA/IGEgLSB0aGlzLnAgOiBhO1xuICAgICAgICBjb25zdCBiYiA9IChiID4gdGhpcy5oYWxmKSA/IGIgLSB0aGlzLnAgOiBiO1xuICAgICAgICByZXR1cm4gYWEgPD0gYmI7XG4gICAgfVxuXG4gICAgZ2VxKGEsIGIpIHtcbiAgICAgICAgY29uc3QgYWEgPSAoYSA+IHRoaXMuaGFsZikgPyBhIC0gdGhpcy5wIDogYTtcbiAgICAgICAgY29uc3QgYmIgPSAoYiA+IHRoaXMuaGFsZikgPyBiIC0gdGhpcy5wIDogYjtcbiAgICAgICAgcmV0dXJuIGFhID49IGJiO1xuICAgIH1cblxuICAgIGRpdihhLCBiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bChhLCB0aGlzLmludihiKSk7XG4gICAgfVxuXG4gICAgaWRpdihhLCBiKSB7XG4gICAgICAgIGlmICghYikgdGhyb3cgbmV3IEVycm9yKFwiRGl2aXNpb24gYnkgemVyb1wiKTtcbiAgICAgICAgcmV0dXJuIGEgLyBiO1xuICAgIH1cblxuICAgIGludihhKSB7XG4gICAgICAgIGlmICghYSkgdGhyb3cgbmV3IEVycm9yKFwiRGl2aXNpb24gYnkgemVyb1wiKTtcblxuICAgICAgICBsZXQgdCA9IDBuO1xuICAgICAgICBsZXQgciA9IHRoaXMucDtcbiAgICAgICAgbGV0IG5ld3QgPSAxbjtcbiAgICAgICAgbGV0IG5ld3IgPSBhICUgdGhpcy5wO1xuICAgICAgICB3aGlsZSAobmV3cikge1xuICAgICAgICAgICAgbGV0IHEgPSByL25ld3I7XG4gICAgICAgICAgICBbdCwgbmV3dF0gPSBbbmV3dCwgdC1xKm5ld3RdO1xuICAgICAgICAgICAgW3IsIG5ld3JdID0gW25ld3IsIHItcSpuZXdyXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodDwwbikgdCArPSB0aGlzLnA7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH1cblxuICAgIG1vZChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhICUgYjtcbiAgICB9XG5cbiAgICBwb3coYiwgZSkge1xuICAgICAgICByZXR1cm4gZnV0aWxzLmV4cCh0aGlzLCBiLCBlKTtcbiAgICB9XG5cbiAgICBleHAoYiwgZSkge1xuICAgICAgICByZXR1cm4gZnV0aWxzLmV4cCh0aGlzLCBiLCBlKTtcbiAgICB9XG5cbiAgICBiYW5kKGEsIGIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gICgoYSAmIGIpICYgdGhpcy5tYXNrKTtcbiAgICAgICAgcmV0dXJuIHJlcyA+PSB0aGlzLnAgPyByZXMtdGhpcy5wIDogcmVzO1xuICAgIH1cblxuICAgIGJvcihhLCBiKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9ICAoKGEgfCBiKSAmIHRoaXMubWFzayk7XG4gICAgICAgIHJldHVybiByZXMgPj0gdGhpcy5wID8gcmVzLXRoaXMucCA6IHJlcztcbiAgICB9XG5cbiAgICBieG9yKGEsIGIpIHtcbiAgICAgICAgY29uc3QgcmVzID0gICgoYSBeIGIpICYgdGhpcy5tYXNrKTtcbiAgICAgICAgcmV0dXJuIHJlcyA+PSB0aGlzLnAgPyByZXMtdGhpcy5wIDogcmVzO1xuICAgIH1cblxuICAgIGJub3QoYSkge1xuICAgICAgICBjb25zdCByZXMgPSBhIF4gdGhpcy5tYXNrO1xuICAgICAgICByZXR1cm4gcmVzID49IHRoaXMucCA/IHJlcy10aGlzLnAgOiByZXM7XG4gICAgfVxuXG4gICAgc2hsKGEsIGIpIHtcbiAgICAgICAgaWYgKE51bWJlcihiKSA8IHRoaXMuYml0TGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSAoYSA8PCBiKSAmIHRoaXMubWFzaztcbiAgICAgICAgICAgIHJldHVybiByZXMgPj0gdGhpcy5wID8gcmVzLXRoaXMucCA6IHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5iID0gdGhpcy5wIC0gYjtcbiAgICAgICAgICAgIGlmIChOdW1iZXIobmIpIDwgdGhpcy5iaXRMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSA+PiBuYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hyKGEsIGIpIHtcbiAgICAgICAgaWYgKE51bWJlcihiKSA8IHRoaXMuYml0TGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gYSA+PiBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbmIgPSB0aGlzLnAgLSBiO1xuICAgICAgICAgICAgaWYgKE51bWJlcihuYikgPCB0aGlzLmJpdExlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IChhIDw8IG5iKSAmIHRoaXMubWFzaztcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzID49IHRoaXMucCA/IHJlcy10aGlzLnAgOiByZXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGFuZChhLCBiKSB7XG4gICAgICAgIHJldHVybiAoYSAmJiBiKSA/IDFuIDogMG47XG4gICAgfVxuXG4gICAgbG9yKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhIHx8IGIpID8gMW4gOiAwbjtcbiAgICB9XG5cbiAgICBsbm90KGEpIHtcbiAgICAgICAgcmV0dXJuIChhKSA/IDBuIDogMW47XG4gICAgfVxuXG4gICAgc3FydF9vbGQobikge1xuXG4gICAgICAgIGlmIChuID09IDBuKSByZXR1cm4gdGhpcy56ZXJvO1xuXG4gICAgICAgIC8vIFRlc3QgdGhhdCBoYXZlIHNvbHV0aW9uXG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMucG93KG4sIHRoaXMubmVnb25lID4+IHRoaXMub25lKTtcbiAgICAgICAgaWYgKCByZXMgIT0gMW4gKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgbSA9IHRoaXMucztcbiAgICAgICAgbGV0IGMgPSB0aGlzLm5xcl90b190O1xuICAgICAgICBsZXQgdCA9IHRoaXMucG93KG4sIHRoaXMudCk7XG4gICAgICAgIGxldCByID0gdGhpcy5wb3cobiwgdGhpcy5hZGQodGhpcy50LCB0aGlzLm9uZSkgPj4gMW4gKTtcblxuICAgICAgICB3aGlsZSAoIHQgIT0gMW4gKSB7XG4gICAgICAgICAgICBsZXQgc3EgPSB0aGlzLnNxdWFyZSh0KTtcbiAgICAgICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgICAgIHdoaWxlIChzcSAhPSAxbiApIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgc3EgPSB0aGlzLnNxdWFyZShzcSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGIgPSBjIF4gbS1pLTFcbiAgICAgICAgICAgIGxldCBiID0gYztcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajwgbS1pLTE7IGogKyspIGIgPSB0aGlzLnNxdWFyZShiKTtcblxuICAgICAgICAgICAgbSA9IGk7XG4gICAgICAgICAgICBjID0gdGhpcy5zcXVhcmUoYik7XG4gICAgICAgICAgICB0ID0gdGhpcy5tdWwodCwgYyk7XG4gICAgICAgICAgICByID0gdGhpcy5tdWwociwgYik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAociA+ICh0aGlzLnAgPj4gMW4pKSB7XG4gICAgICAgICAgICByID0gdGhpcy5uZWcocik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBub3JtYWxpemUoYSwgYikge1xuICAgICAgICBhID0gQmlnSW50KGEsYik7XG4gICAgICAgIGlmIChhIDwgMCkge1xuICAgICAgICAgICAgbGV0IG5hID0gLWE7XG4gICAgICAgICAgICBpZiAobmEgPj0gdGhpcy5wKSBuYSA9IG5hICUgdGhpcy5wO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucCAtIG5hO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChhPj0gdGhpcy5wKSA/IGEldGhpcy5wIDogYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgbkJ5dGVzID0gKHRoaXMuYml0TGVuZ3RoKjIgLyA4KTtcbiAgICAgICAgbGV0IHJlcyA9MG47XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxuQnl0ZXM7IGkrKykge1xuICAgICAgICAgICAgcmVzID0gKHJlcyA8PCA4bikgKyBCaWdJbnQoZ2V0UmFuZG9tQnl0ZXMoMSlbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXMgJSB0aGlzLnA7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoYSwgYmFzZSkge1xuICAgICAgICBsZXQgdnM7XG4gICAgICAgIGlmIChhID4gdGhpcy5oYWxmKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5wLWE7XG4gICAgICAgICAgICB2cyA9IFwiLVwiK3YudG9TdHJpbmcoYmFzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2cyA9IGEudG9TdHJpbmcoYmFzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZzO1xuICAgIH1cblxuICAgIGlzWmVybyhhKSB7XG4gICAgICAgIHJldHVybiBhID09IDBuO1xuICAgIH1cblxuICAgIGZyb21Sbmcocm5nKSB7XG4gICAgICAgIGxldCB2O1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICB2PTBuO1xuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMubjY0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2ICs9IHJuZy5uZXh0VTY0KCkgPDwgQmlnSW50KDY0ICppKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHYgJj0gdGhpcy5tYXNrO1xuICAgICAgICB9IHdoaWxlICh2ID49IHRoaXMucCk7XG4gICAgICAgIHYgPSAodiAqIHRoaXMuUmkpICUgdGhpcy5wOyAgIC8vIENvbnZlcnQgZnJvbSBtb250Z29tZXJ5XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgYmlnSW50IGZyb20gXCJiaWctaW50ZWdlclwiO1xuaW1wb3J0IGJ1aWxkU3FydCBmcm9tIFwiLi9mc3FydC5qc1wiO1xuaW1wb3J0IHtnZXRSYW5kb21CeXRlc30gZnJvbSBcIi4vcmFuZG9tLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFpxRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKHApIHtcbiAgICAgICAgdGhpcy50eXBlPVwiRjFcIjtcbiAgICAgICAgdGhpcy5vbmUgPSBiaWdJbnQub25lO1xuICAgICAgICB0aGlzLnplcm8gPSBiaWdJbnQuemVybztcbiAgICAgICAgdGhpcy5wID0gYmlnSW50KHApO1xuICAgICAgICB0aGlzLm0gPSAxO1xuICAgICAgICB0aGlzLm5lZ29uZSA9IHRoaXMucC5taW51cyhiaWdJbnQub25lKTtcbiAgICAgICAgdGhpcy50d28gPSBiaWdJbnQoMik7XG4gICAgICAgIHRoaXMuaGFsZiA9IHRoaXMucC5zaGlmdFJpZ2h0KDEpO1xuICAgICAgICB0aGlzLmJpdExlbmd0aCA9IHRoaXMucC5iaXRMZW5ndGgoKTtcbiAgICAgICAgdGhpcy5tYXNrID0gYmlnSW50Lm9uZS5zaGlmdExlZnQodGhpcy5iaXRMZW5ndGgpLm1pbnVzKGJpZ0ludC5vbmUpO1xuXG4gICAgICAgIHRoaXMubjY0ID0gTWF0aC5mbG9vcigodGhpcy5iaXRMZW5ndGggLSAxKSAvIDY0KSsxO1xuICAgICAgICB0aGlzLm4zMiA9IHRoaXMubjY0KjI7XG4gICAgICAgIHRoaXMubjggPSB0aGlzLm42NCo4O1xuICAgICAgICB0aGlzLlIgPSBiaWdJbnQub25lLnNoaWZ0TGVmdCh0aGlzLm42NCo2NCk7XG4gICAgICAgIHRoaXMuUmkgPSB0aGlzLmludih0aGlzLlIpO1xuXG4gICAgICAgIGNvbnN0IGUgPSB0aGlzLm5lZ29uZS5zaGlmdFJpZ2h0KHRoaXMub25lKTtcbiAgICAgICAgdGhpcy5ucXIgPSB0aGlzLnR3bztcbiAgICAgICAgbGV0IHIgPSB0aGlzLnBvdyh0aGlzLm5xciwgZSk7XG4gICAgICAgIHdoaWxlICghci5lcXVhbHModGhpcy5uZWdvbmUpKSB7XG4gICAgICAgICAgICB0aGlzLm5xciA9IHRoaXMubnFyLmFkZCh0aGlzLm9uZSk7XG4gICAgICAgICAgICByID0gdGhpcy5wb3codGhpcy5ucXIsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zID0gdGhpcy56ZXJvO1xuICAgICAgICB0aGlzLnQgPSB0aGlzLm5lZ29uZTtcblxuICAgICAgICB3aGlsZSAoIXRoaXMudC5pc09kZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnMgPSB0aGlzLnMuYWRkKHRoaXMub25lKTtcbiAgICAgICAgICAgIHRoaXMudCA9IHRoaXMudC5zaGlmdFJpZ2h0KHRoaXMub25lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubnFyX3RvX3QgPSB0aGlzLnBvdyh0aGlzLm5xciwgdGhpcy50KTtcblxuICAgICAgICBidWlsZFNxcnQodGhpcyk7XG4gICAgfVxuXG4gICAgZShhLGIpIHtcblxuICAgICAgICBjb25zdCByZXMgPSBiaWdJbnQoYSxiKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUocmVzKTtcblxuICAgIH1cblxuICAgIGFkZChhLCBiKSB7XG4gICAgICAgIGxldCByZXMgPSBhLmFkZChiKTtcbiAgICAgICAgaWYgKHJlcy5nZXEodGhpcy5wKSkge1xuICAgICAgICAgICAgcmVzID0gcmVzLm1pbnVzKHRoaXMucCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBzdWIoYSwgYikge1xuICAgICAgICBpZiAoYS5nZXEoYikpIHtcbiAgICAgICAgICAgIHJldHVybiBhLm1pbnVzKGIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucC5taW51cyhiLm1pbnVzKGEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5lZyhhKSB7XG4gICAgICAgIGlmIChhLmlzWmVybygpKSByZXR1cm4gYTtcbiAgICAgICAgcmV0dXJuIHRoaXMucC5taW51cyhhKTtcbiAgICB9XG5cbiAgICBtdWwoYSwgYikge1xuICAgICAgICByZXR1cm4gYS50aW1lcyhiKS5tb2QodGhpcy5wKTtcbiAgICB9XG5cbiAgICBtdWxTY2FsYXIoYmFzZSwgcykge1xuICAgICAgICByZXR1cm4gYmFzZS50aW1lcyhiaWdJbnQocykpLm1vZCh0aGlzLnApO1xuICAgIH1cblxuICAgIHNxdWFyZShhKSB7XG4gICAgICAgIHJldHVybiBhLnNxdWFyZSgpLm1vZCh0aGlzLnApO1xuICAgIH1cblxuICAgIGVxKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuZXEoYik7XG4gICAgfVxuXG4gICAgbmVxKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEubmVxKGIpO1xuICAgIH1cblxuICAgIGx0KGEsIGIpIHtcbiAgICAgICAgY29uc3QgYWEgPSBhLmd0KHRoaXMuaGFsZikgPyBhLm1pbnVzKHRoaXMucCkgOiBhO1xuICAgICAgICBjb25zdCBiYiA9IGIuZ3QodGhpcy5oYWxmKSA/IGIubWludXModGhpcy5wKSA6IGI7XG4gICAgICAgIHJldHVybiBhYS5sdChiYik7XG4gICAgfVxuXG4gICAgZ3QoYSwgYikge1xuICAgICAgICBjb25zdCBhYSA9IGEuZ3QodGhpcy5oYWxmKSA/IGEubWludXModGhpcy5wKSA6IGE7XG4gICAgICAgIGNvbnN0IGJiID0gYi5ndCh0aGlzLmhhbGYpID8gYi5taW51cyh0aGlzLnApIDogYjtcbiAgICAgICAgcmV0dXJuIGFhLmd0KGJiKTtcbiAgICB9XG5cbiAgICBsZXEoYSwgYikge1xuICAgICAgICBjb25zdCBhYSA9IGEuZ3QodGhpcy5oYWxmKSA/IGEubWludXModGhpcy5wKSA6IGE7XG4gICAgICAgIGNvbnN0IGJiID0gYi5ndCh0aGlzLmhhbGYpID8gYi5taW51cyh0aGlzLnApIDogYjtcbiAgICAgICAgcmV0dXJuIGFhLmxlcShiYik7XG4gICAgfVxuXG4gICAgZ2VxKGEsIGIpIHtcbiAgICAgICAgY29uc3QgYWEgPSBhLmd0KHRoaXMuaGFsZikgPyBhLm1pbnVzKHRoaXMucCkgOiBhO1xuICAgICAgICBjb25zdCBiYiA9IGIuZ3QodGhpcy5oYWxmKSA/IGIubWludXModGhpcy5wKSA6IGI7XG4gICAgICAgIHJldHVybiBhYS5nZXEoYmIpO1xuICAgIH1cblxuICAgIGRpdihhLCBiKSB7XG4gICAgICAgIGlmIChiLmlzWmVybygpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXZpc2lvbiBieSB6ZXJvXCIpO1xuICAgICAgICByZXR1cm4gYS50aW1lcyhiLm1vZEludih0aGlzLnApKS5tb2QodGhpcy5wKTtcbiAgICB9XG5cbiAgICBpZGl2KGEsIGIpIHtcbiAgICAgICAgaWYgKGIuaXNaZXJvKCkpIHRocm93IG5ldyBFcnJvcihcIkRpdmlzaW9uIGJ5IHplcm9cIik7XG4gICAgICAgIHJldHVybiBhLmRpdmlkZShiKTtcbiAgICB9XG5cbiAgICBpbnYoYSkge1xuICAgICAgICBpZiAoYS5pc1plcm8oKSkgdGhyb3cgbmV3IEVycm9yKFwiRGl2aXNpb24gYnkgemVyb1wiKTtcbiAgICAgICAgcmV0dXJuIGEubW9kSW52KHRoaXMucCk7XG4gICAgfVxuXG4gICAgbW9kKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEubW9kKGIpO1xuICAgIH1cblxuICAgIHBvdyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLm1vZFBvdyhiLCB0aGlzLnApO1xuICAgIH1cblxuICAgIGV4cChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLm1vZFBvdyhiLCB0aGlzLnApO1xuICAgIH1cblxuICAgIGJhbmQoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5hbmQoYikuYW5kKHRoaXMubWFzaykubW9kKHRoaXMucCk7XG4gICAgfVxuXG4gICAgYm9yKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEub3IoYikuYW5kKHRoaXMubWFzaykubW9kKHRoaXMucCk7XG4gICAgfVxuXG4gICAgYnhvcihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnhvcihiKS5hbmQodGhpcy5tYXNrKS5tb2QodGhpcy5wKTtcbiAgICB9XG5cbiAgICBibm90KGEpIHtcbiAgICAgICAgcmV0dXJuIGEueG9yKHRoaXMubWFzaykubW9kKHRoaXMucCk7XG4gICAgfVxuXG4gICAgc2hsKGEsIGIpIHtcbiAgICAgICAgaWYgKGIubHQodGhpcy5iaXRMZW5ndGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5zaGlmdExlZnQoYikuYW5kKHRoaXMubWFzaykubW9kKHRoaXMucCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuYiA9IHRoaXMucC5taW51cyhiKTtcbiAgICAgICAgICAgIGlmIChuYi5sdCh0aGlzLmJpdExlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaHIoYSwgbmIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlnSW50Lnplcm87XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaHIoYSwgYikge1xuICAgICAgICBpZiAoYi5sdCh0aGlzLmJpdExlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnNoaWZ0UmlnaHQoYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuYiA9IHRoaXMucC5taW51cyhiKTtcbiAgICAgICAgICAgIGlmIChuYi5sdCh0aGlzLmJpdExlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaGwoYSwgbmIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlnSW50Lnplcm87XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsYW5kKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhLmlzWmVybygpIHx8IGIuaXNaZXJvKCkpID8gYmlnSW50Lnplcm8gOiBiaWdJbnQub25lO1xuICAgIH1cblxuICAgIGxvcihhLCBiKSB7XG4gICAgICAgIHJldHVybiAoYS5pc1plcm8oKSAmJiBiLmlzWmVybygpKSA/IGJpZ0ludC56ZXJvIDogYmlnSW50Lm9uZTtcbiAgICB9XG5cbiAgICBsbm90KGEpIHtcbiAgICAgICAgcmV0dXJuIGEuaXNaZXJvKCkgPyBiaWdJbnQub25lIDogYmlnSW50Lnplcm87XG4gICAgfVxuXG4gICAgc3FydF9vbGQobikge1xuXG4gICAgICAgIGlmIChuLmVxdWFscyh0aGlzLnplcm8pKSByZXR1cm4gdGhpcy56ZXJvO1xuXG4gICAgICAgIC8vIFRlc3QgdGhhdCBoYXZlIHNvbHV0aW9uXG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMucG93KG4sIHRoaXMubmVnb25lLnNoaWZ0UmlnaHQodGhpcy5vbmUpKTtcbiAgICAgICAgaWYgKCFyZXMuZXF1YWxzKHRoaXMub25lKSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IG0gPSBwYXJzZUludCh0aGlzLnMpO1xuICAgICAgICBsZXQgYyA9IHRoaXMubnFyX3RvX3Q7XG4gICAgICAgIGxldCB0ID0gdGhpcy5wb3cobiwgdGhpcy50KTtcbiAgICAgICAgbGV0IHIgPSB0aGlzLnBvdyhuLCB0aGlzLmFkZCh0aGlzLnQsIHRoaXMub25lKS5zaGlmdFJpZ2h0KHRoaXMub25lKSApO1xuXG4gICAgICAgIHdoaWxlICghdC5lcXVhbHModGhpcy5vbmUpKSB7XG4gICAgICAgICAgICBsZXQgc3EgPSB0aGlzLnNxdWFyZSh0KTtcbiAgICAgICAgICAgIGxldCBpID0gMTtcbiAgICAgICAgICAgIHdoaWxlICghc3EuZXF1YWxzKHRoaXMub25lKSkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBzcSA9IHRoaXMuc3F1YXJlKHNxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYiA9IGMgXiBtLWktMVxuICAgICAgICAgICAgbGV0IGIgPSBjO1xuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPCBtLWktMTsgaiArKykgYiA9IHRoaXMuc3F1YXJlKGIpO1xuXG4gICAgICAgICAgICBtID0gaTtcbiAgICAgICAgICAgIGMgPSB0aGlzLnNxdWFyZShiKTtcbiAgICAgICAgICAgIHQgPSB0aGlzLm11bCh0LCBjKTtcbiAgICAgICAgICAgIHIgPSB0aGlzLm11bChyLCBiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyLmdyZWF0ZXIodGhpcy5wLnNoaWZ0UmlnaHQodGhpcy5vbmUpKSkge1xuICAgICAgICAgICAgciA9IHRoaXMubmVnKHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKGEpIHtcbiAgICAgICAgYSA9IGJpZ0ludChhKTtcbiAgICAgICAgaWYgKGEuaXNOZWdhdGl2ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wLm1pbnVzKGEuYWJzKCkubW9kKHRoaXMucCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGEubW9kKHRoaXMucCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByYW5kb20oKSB7XG4gICAgICAgIGxldCByZXMgPSBiaWdJbnQoMCk7XG4gICAgICAgIGxldCBuID0gYmlnSW50KHRoaXMucC5zcXVhcmUoKSk7XG4gICAgICAgIHdoaWxlICghbi5pc1plcm8oKSkge1xuICAgICAgICAgICAgcmVzID0gcmVzLnNoaWZ0TGVmdCg4KS5hZGQoYmlnSW50KGdldFJhbmRvbUJ5dGVzKDEpWzBdKSk7XG4gICAgICAgICAgICBuID0gbi5zaGlmdFJpZ2h0KDgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXMubW9kKHRoaXMucCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoYSwgYmFzZSkge1xuICAgICAgICBsZXQgdnM7XG4gICAgICAgIGlmICghYS5sZXNzZXJPckVxdWFscyh0aGlzLnAuc2hpZnRSaWdodChiaWdJbnQoMSkpKSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMucC5taW51cyhhKTtcbiAgICAgICAgICAgIHZzID0gXCItXCIrdi50b1N0cmluZyhiYXNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZzID0gYS50b1N0cmluZyhiYXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2cztcbiAgICB9XG5cbiAgICBpc1plcm8oYSkge1xuICAgICAgICByZXR1cm4gYS5pc1plcm8oKTtcbiAgICB9XG5cbiAgICBmcm9tUm5nKHJuZykge1xuICAgICAgICBsZXQgdjtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgdiA9IGJpZ0ludCgwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLm42NDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdiA9IHYuYWRkKHYsIHJuZy5uZXh0VTY0KCkuc2hpZnRMZWZ0KDY0KmkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHYgPSB2LmFuZCh0aGlzLm1hc2spO1xuICAgICAgICB9IHdoaWxlICh2LmdlcSh0aGlzLnApKTtcbiAgICAgICAgdiA9IHYudGltZXModGhpcy5SaSkubW9kKHRoaXMucSk7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxuXG59XG5cbiIsImltcG9ydCAqIGFzIFNjYWxhciBmcm9tIFwiLi9zY2FsYXIuanNcIjtcblxuaW1wb3J0IEYxRmllbGRfbmF0aXZlIGZyb20gXCIuL2YxZmllbGRfbmF0aXZlLmpzXCI7XG5pbXBvcnQgRjFGaWVsZF9iaWdpbnQgZnJvbSBcIi4vZjFmaWVsZF9iaWdpbnQuanNcIjtcblxuY29uc3Qgc3VwcG9ydHNOYXRpdmVCaWdJbnQgPSB0eXBlb2YgQmlnSW50ID09PSBcImZ1bmN0aW9uXCI7XG5sZXQgX0YxRmllbGQ7XG5pZiAoc3VwcG9ydHNOYXRpdmVCaWdJbnQpIHtcbiAgICBfRjFGaWVsZCA9IEYxRmllbGRfbmF0aXZlO1xufSBlbHNlIHtcbiAgICBfRjFGaWVsZCA9IEYxRmllbGRfYmlnaW50O1xufVxuXG5leHBvcnQgZGVmYXVsdCAgY2xhc3MgRjFGaWVsZCBleHRlbmRzIF9GMUZpZWxkIHtcblxuICAgIC8vIFJldHVybnMgYSBidWZmZXIgd2l0aCBMaXR0bGUgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG4gICAgdG9ScHJMRShidWZmLCBvLCBlKSB7XG4gICAgICAgIFNjYWxhci50b1JwckxFKGJ1ZmYsIG8sIGUsIHRoaXMubjY0KjgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYSBidWZmZXIgd2l0aCBCaWcgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG4gICAgdG9ScHJCRShidWZmLCBvLCBlKSB7XG4gICAgICAgIFNjYWxhci50b1JwckJFKGJ1ZmYsIG8sIGUsIHRoaXMubjY0KjgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYSBidWZmZXIgd2l0aCBCaWcgRW5kaWFuIE1vbnRnb21lcnkgUmVwcmVzZW50YXRpb25cbiAgICB0b1JwckJFTShidWZmLCBvLCBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvUnByQkUoYnVmZiwgbywgdGhpcy5tdWwodGhpcy5SLCBlKSk7XG4gICAgfVxuXG4gICAgdG9ScHJMRU0oYnVmZiwgbywgZSkge1xuICAgICAgICByZXR1cm4gdGhpcy50b1JwckxFKGJ1ZmYsIG8sIHRoaXMubXVsKHRoaXMuUiwgZSkpO1xuICAgIH1cblxuXG4gICAgLy8gUGFzZXMgYSBidWZmZXIgd2l0aCBMaXR0bGUgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG4gICAgZnJvbVJwckxFKGJ1ZmYsIG8pIHtcbiAgICAgICAgcmV0dXJuIFNjYWxhci5mcm9tUnByTEUoYnVmZiwgbywgdGhpcy5uOCk7XG4gICAgfVxuXG4gICAgLy8gUGFzZXMgYSBidWZmZXIgd2l0aCBCaWcgRW5kaWFuIFJlcHJlc2VudGF0aW9uXG4gICAgZnJvbVJwckJFKGJ1ZmYsIG8pIHtcbiAgICAgICAgcmV0dXJuIFNjYWxhci5mcm9tUnByQkUoYnVmZiwgbywgdGhpcy5uOCk7XG4gICAgfVxuXG4gICAgZnJvbVJwckxFTShidWZmLCBvKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bCh0aGlzLmZyb21ScHJMRShidWZmLCBvKSwgdGhpcy5SaSk7XG4gICAgfVxuXG4gICAgZnJvbVJwckJFTShidWZmLCBvKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bCh0aGlzLmZyb21ScHJCRShidWZmLCBvKSwgdGhpcy5SaSk7XG4gICAgfVxuXG59XG5cbiIsIi8qXG4gICAgQ29weXJpZ2h0IDIwMTggMGtpbXMgYXNzb2NpYXRpb24uXG5cbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBzbmFya2pzLlxuXG4gICAgc25hcmtqcyBpcyBhIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICAgIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAgICBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbilcbiAgICBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIHNuYXJranMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFlcbiAgICBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3JcbiAgICBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZyB3aXRoXG4gICAgc25hcmtqcy4gSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG5cbmltcG9ydCAqIGFzIGZVdGlscyBmcm9tIFwiLi9mdXRpbHMuanNcIjtcbmltcG9ydCBidWlsZFNxcnQgZnJvbSBcIi4vZnNxcnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRjJGaWVsZCB7XG4gICAgY29uc3RydWN0b3IoRiwgbm9uUmVzaWR1ZSkge1xuICAgICAgICB0aGlzLnR5cGU9XCJGMlwiO1xuICAgICAgICB0aGlzLkYgPSBGO1xuICAgICAgICB0aGlzLnplcm8gPSBbdGhpcy5GLnplcm8sIHRoaXMuRi56ZXJvXTtcbiAgICAgICAgdGhpcy5vbmUgPSBbdGhpcy5GLm9uZSwgdGhpcy5GLnplcm9dO1xuICAgICAgICB0aGlzLm5lZ29uZSA9IHRoaXMubmVnKHRoaXMub25lKTtcbiAgICAgICAgdGhpcy5ub25SZXNpZHVlID0gbm9uUmVzaWR1ZTtcbiAgICAgICAgdGhpcy5tID0gRi5tKjI7XG4gICAgICAgIHRoaXMucCA9IEYucDtcbiAgICAgICAgdGhpcy5uNjQgPSBGLm42NCoyO1xuICAgICAgICB0aGlzLm4zMiA9IHRoaXMubjY0KjI7XG4gICAgICAgIHRoaXMubjggPSB0aGlzLm42NCo4O1xuXG4gICAgICAgIGJ1aWxkU3FydCh0aGlzKTtcbiAgICB9XG5cbiAgICBfbXVsQnlOb25SZXNpZHVlKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRi5tdWwodGhpcy5ub25SZXNpZHVlLCBhKTtcbiAgICB9XG5cbiAgICBjb3B5KGEpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLkYuY29weShhWzBdKSwgdGhpcy5GLmNvcHkoYVsxXSldO1xuICAgIH1cblxuICAgIGFkZChhLCBiKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLkYuYWRkKGFbMF0sIGJbMF0pLFxuICAgICAgICAgICAgdGhpcy5GLmFkZChhWzFdLCBiWzFdKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGRvdWJsZShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhLGEpO1xuICAgIH1cblxuICAgIHN1YihhLCBiKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLkYuc3ViKGFbMF0sIGJbMF0pLFxuICAgICAgICAgICAgdGhpcy5GLnN1YihhWzFdLCBiWzFdKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIG5lZyhhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0aGlzLnplcm8sIGEpO1xuICAgIH1cblxuICAgIGNvbmp1Z2F0ZShhKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBhWzBdLFxuICAgICAgICAgICAgdGhpcy5GLm5lZyhhWzFdKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIG11bChhLCBiKSB7XG4gICAgICAgIGNvbnN0IGFBID0gdGhpcy5GLm11bChhWzBdICwgYlswXSk7XG4gICAgICAgIGNvbnN0IGJCID0gdGhpcy5GLm11bChhWzFdICwgYlsxXSk7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXMuRi5hZGQoIGFBICwgdGhpcy5fbXVsQnlOb25SZXNpZHVlKGJCKSksXG4gICAgICAgICAgICB0aGlzLkYuc3ViKFxuICAgICAgICAgICAgICAgIHRoaXMuRi5tdWwoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoYVswXSwgYVsxXSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoYlswXSwgYlsxXSkpLFxuICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoYUEsIGJCKSldO1xuICAgIH1cblxuICAgIGludihhKSB7XG4gICAgICAgIGNvbnN0IHQwID0gdGhpcy5GLnNxdWFyZShhWzBdKTtcbiAgICAgICAgY29uc3QgdDEgPSB0aGlzLkYuc3F1YXJlKGFbMV0pO1xuICAgICAgICBjb25zdCB0MiA9IHRoaXMuRi5zdWIodDAsIHRoaXMuX211bEJ5Tm9uUmVzaWR1ZSh0MSkpO1xuICAgICAgICBjb25zdCB0MyA9IHRoaXMuRi5pbnYodDIpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5GLm11bChhWzBdLCB0MyksXG4gICAgICAgICAgICB0aGlzLkYubmVnKHRoaXMuRi5tdWwoIGFbMV0sIHQzKSkgXTtcbiAgICB9XG5cbiAgICBkaXYoYSwgYikge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWwoYSwgdGhpcy5pbnYoYikpO1xuICAgIH1cblxuICAgIHNxdWFyZShhKSB7XG4gICAgICAgIGNvbnN0IGFiID0gdGhpcy5GLm11bChhWzBdICwgYVsxXSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgW1xuICAgICAgICAgICAgKGEgKyBiKSAqIChhICsgbm9uX3Jlc2lkdWUgKiBiKSAtIGFiIC0gbm9uX3Jlc2lkdWUgKiBhYixcbiAgICAgICAgICAgIGFiICsgYWJcbiAgICAgICAgXTtcbiAgICAgICAgKi9cblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5GLnN1YihcbiAgICAgICAgICAgICAgICB0aGlzLkYubXVsKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkYuYWRkKGFbMF0sIGFbMV0pICxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5GLmFkZChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFbMF0gLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbXVsQnlOb25SZXNpZHVlKGFbMV0pKSksXG4gICAgICAgICAgICAgICAgdGhpcy5GLmFkZChcbiAgICAgICAgICAgICAgICAgICAgYWIsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX211bEJ5Tm9uUmVzaWR1ZShhYikpKSxcbiAgICAgICAgICAgIHRoaXMuRi5hZGQoYWIsIGFiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGlzWmVybyhhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkYuaXNaZXJvKGFbMF0pICYmIHRoaXMuRi5pc1plcm8oYVsxXSk7XG4gICAgfVxuXG4gICAgZXEoYSwgYikge1xuICAgICAgICByZXR1cm4gdGhpcy5GLmVxKGFbMF0sIGJbMF0pICYmIHRoaXMuRi5lcShhWzFdLCBiWzFdKTtcbiAgICB9XG5cbiAgICBtdWxTY2FsYXIoYmFzZSwgZSkge1xuICAgICAgICByZXR1cm4gZlV0aWxzLm11bFNjYWxhcih0aGlzLCBiYXNlLCBlKTtcbiAgICB9XG5cbiAgICBwb3coYmFzZSwgZSkge1xuICAgICAgICByZXR1cm4gZlV0aWxzLmV4cCh0aGlzLCBiYXNlLCBlKTtcbiAgICB9XG5cbiAgICBleHAoYmFzZSwgZSkge1xuICAgICAgICByZXR1cm4gZlV0aWxzLmV4cCh0aGlzLCBiYXNlLCBlKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZyhhKSB7XG4gICAgICAgIHJldHVybiBgWyAke3RoaXMuRi50b1N0cmluZyhhWzBdKX0gLCAke3RoaXMuRi50b1N0cmluZyhhWzFdKX0gXWA7XG4gICAgfVxuXG4gICAgZnJvbVJuZyhybmcpIHtcbiAgICAgICAgY29uc3QgYzAgPSB0aGlzLkYuZnJvbVJuZyhybmcpO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5mcm9tUm5nKHJuZyk7XG4gICAgICAgIHJldHVybiBbYzAsIGMxXTtcbiAgICB9XG5cbiAgICBndChhLCBiKSB7XG4gICAgICAgIGlmICh0aGlzLkYuZ3QoYVswXSwgYlswXSkpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodGhpcy5GLmd0KGJbMF0sIGFbMF0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLkYuZ3QoYVsxXSwgYlsxXSkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2VxKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3QoYSwgYikgfHwgdGhpcy5lcShhLCBiKTtcbiAgICB9XG5cbiAgICBsdChhLCBiKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5nZXEoYSxiKTtcbiAgICB9XG5cbiAgICBsZXEoYSwgYikge1xuICAgICAgICByZXR1cm4gIXRoaXMuZ3QoYSxiKTtcbiAgICB9XG5cbiAgICBuZXEoYSwgYikge1xuICAgICAgICByZXR1cm4gIXRoaXMuZXEoYSxiKTtcbiAgICB9XG5cbiAgICByYW5kb20oKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5GLnJhbmRvbSgpLCB0aGlzLkYucmFuZG9tKCldO1xuICAgIH1cblxuXG4gICAgdG9ScHJMRShidWZmLCBvLCBlKSB7XG4gICAgICAgIHRoaXMuRi50b1JwckxFKGJ1ZmYsIG8sIGVbMF0pO1xuICAgICAgICB0aGlzLkYudG9ScHJMRShidWZmLCBvK3RoaXMuRi5uOCwgZVsxXSk7XG4gICAgfVxuXG4gICAgdG9ScHJCRShidWZmLCBvLCBlKSB7XG4gICAgICAgIHRoaXMuRi50b1JwckJFKGJ1ZmYsIG8sIGVbMV0pO1xuICAgICAgICB0aGlzLkYudG9ScHJCRShidWZmLCBvK3RoaXMuRi5uOCwgZVswXSk7XG4gICAgfVxuXG4gICAgdG9ScHJMRU0oYnVmZiwgbywgZSkge1xuICAgICAgICB0aGlzLkYudG9ScHJMRU0oYnVmZiwgbywgZVswXSk7XG4gICAgICAgIHRoaXMuRi50b1JwckxFTShidWZmLCBvK3RoaXMuRi5uOCwgZVsxXSk7XG4gICAgfVxuXG5cbiAgICB0b1JwckJFTShidWZmLCBvLCBlKSB7XG4gICAgICAgIHRoaXMuRi50b1JwckJFTShidWZmLCBvLCBlWzFdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByQkVNKGJ1ZmYsIG8rdGhpcy5GLm44LCBlWzBdKTtcbiAgICB9XG5cbiAgICBmcm9tUnByTEUoYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCBjMCA9IHRoaXMuRi5mcm9tUnByTEUoYnVmZiwgbyk7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5GLmZyb21ScHJMRShidWZmLCBvK3RoaXMuRi5uOCk7XG4gICAgICAgIHJldHVybiBbYzAsIGMxXTtcbiAgICB9XG5cbiAgICBmcm9tUnByQkUoYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5mcm9tUnByQkUoYnVmZiwgbyk7XG4gICAgICAgIGNvbnN0IGMwID0gdGhpcy5GLmZyb21ScHJCRShidWZmLCBvK3RoaXMuRi5uOCk7XG4gICAgICAgIHJldHVybiBbYzAsIGMxXTtcbiAgICB9XG5cbiAgICBmcm9tUnByTEVNKGJ1ZmYsIG8pIHtcbiAgICAgICAgbyA9IG8gfHwgMDtcbiAgICAgICAgY29uc3QgYzAgPSB0aGlzLkYuZnJvbVJwckxFTShidWZmLCBvKTtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLkYuZnJvbVJwckxFTShidWZmLCBvK3RoaXMuRi5uOCk7XG4gICAgICAgIHJldHVybiBbYzAsIGMxXTtcbiAgICB9XG5cbiAgICBmcm9tUnByQkVNKGJ1ZmYsIG8pIHtcbiAgICAgICAgbyA9IG8gfHwgMDtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLkYuZnJvbVJwckJFTShidWZmLCBvKTtcbiAgICAgICAgY29uc3QgYzAgPSB0aGlzLkYuZnJvbVJwckJFTShidWZmLCBvK3RoaXMuRi5uOCk7XG4gICAgICAgIHJldHVybiBbYzAsIGMxXTtcbiAgICB9XG5cbn1cblxuIiwiLypcbiAgICBDb3B5cmlnaHQgMjAxOCAwa2ltcyBhc3NvY2lhdGlvbi5cblxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHNuYXJranMuXG5cbiAgICBzbmFya2pzIGlzIGEgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gICAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICAgIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKVxuICAgIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgc25hcmtqcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWVxuICAgIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvclxuICAgIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nIHdpdGhcbiAgICBzbmFya2pzLiBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuaW1wb3J0ICogYXMgZlV0aWxzIGZyb20gXCIuL2Z1dGlscy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGM0ZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcihGLCBub25SZXNpZHVlKSB7XG4gICAgICAgIHRoaXMudHlwZT1cIkYzXCI7XG4gICAgICAgIHRoaXMuRiA9IEY7XG4gICAgICAgIHRoaXMuemVybyA9IFt0aGlzLkYuemVybywgdGhpcy5GLnplcm8sIHRoaXMuRi56ZXJvXTtcbiAgICAgICAgdGhpcy5vbmUgPSBbdGhpcy5GLm9uZSwgdGhpcy5GLnplcm8sIHRoaXMuRi56ZXJvXTtcbiAgICAgICAgdGhpcy5uZWdvbmUgPSB0aGlzLm5lZyh0aGlzLm9uZSk7XG4gICAgICAgIHRoaXMubm9uUmVzaWR1ZSA9IG5vblJlc2lkdWU7XG4gICAgICAgIHRoaXMubSA9IEYubSozO1xuICAgICAgICB0aGlzLnAgPSBGLnA7XG4gICAgICAgIHRoaXMubjY0ID0gRi5uNjQqMztcbiAgICAgICAgdGhpcy5uMzIgPSB0aGlzLm42NCoyO1xuICAgICAgICB0aGlzLm44ID0gdGhpcy5uNjQqODtcbiAgICB9XG5cbiAgICBfbXVsQnlOb25SZXNpZHVlKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRi5tdWwodGhpcy5ub25SZXNpZHVlLCBhKTtcbiAgICB9XG5cbiAgICBjb3B5KGEpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLkYuY29weShhWzBdKSwgdGhpcy5GLmNvcHkoYVsxXSksIHRoaXMuRi5jb3B5KGFbMl0pXTtcbiAgICB9XG5cbiAgICBhZGQoYSwgYikge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5GLmFkZChhWzBdLCBiWzBdKSxcbiAgICAgICAgICAgIHRoaXMuRi5hZGQoYVsxXSwgYlsxXSksXG4gICAgICAgICAgICB0aGlzLkYuYWRkKGFbMl0sIGJbMl0pXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZG91YmxlKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGEsYSk7XG4gICAgfVxuXG4gICAgc3ViKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXMuRi5zdWIoYVswXSwgYlswXSksXG4gICAgICAgICAgICB0aGlzLkYuc3ViKGFbMV0sIGJbMV0pLFxuICAgICAgICAgICAgdGhpcy5GLnN1YihhWzJdLCBiWzJdKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIG5lZyhhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0aGlzLnplcm8sIGEpO1xuICAgIH1cblxuICAgIG11bChhLCBiKSB7XG5cbiAgICAgICAgY29uc3QgYUEgPSB0aGlzLkYubXVsKGFbMF0gLCBiWzBdKTtcbiAgICAgICAgY29uc3QgYkIgPSB0aGlzLkYubXVsKGFbMV0gLCBiWzFdKTtcbiAgICAgICAgY29uc3QgY0MgPSB0aGlzLkYubXVsKGFbMl0gLCBiWzJdKTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5GLmFkZChcbiAgICAgICAgICAgICAgICBhQSxcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWxCeU5vblJlc2lkdWUoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRi5zdWIoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkYubXVsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoYVsxXSwgYVsyXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5GLmFkZChiWzFdLCBiWzJdKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkYuYWRkKGJCLCBjQykpKSksICAgIC8vIGFBICsgbm9uX3Jlc2lkdWUqKChiK2MpKihCK0MpLWJCLWNDKSxcblxuICAgICAgICAgICAgdGhpcy5GLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLkYuc3ViKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkYubXVsKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5GLmFkZChhWzBdLCBhWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoYlswXSwgYlsxXSkpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLkYuYWRkKGFBLCBiQikpLFxuICAgICAgICAgICAgICAgIHRoaXMuX211bEJ5Tm9uUmVzaWR1ZSggY0MpKSwgICAvLyAoYStiKSooQStCKS1hQS1iQitub25fcmVzaWR1ZSpjQ1xuXG4gICAgICAgICAgICB0aGlzLkYuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuRi5zdWIoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRi5tdWwoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkYuYWRkKGFbMF0sIGFbMl0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5GLmFkZChiWzBdLCBiWzJdKSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoYUEsIGNDKSksXG4gICAgICAgICAgICAgICAgYkIpXTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoYStjKSooQStDKS1hQStiQi1jQylcbiAgICB9XG5cbiAgICBpbnYoYSkge1xuICAgICAgICBjb25zdCB0MCA9IHRoaXMuRi5zcXVhcmUoYVswXSk7ICAgICAgICAgICAgIC8vIHQwID0gYV4yIDtcbiAgICAgICAgY29uc3QgdDEgPSB0aGlzLkYuc3F1YXJlKGFbMV0pOyAgICAgICAgICAgICAvLyB0MSA9IGJeMiA7XG4gICAgICAgIGNvbnN0IHQyID0gdGhpcy5GLnNxdWFyZShhWzJdKTsgICAgICAgICAgICAgLy8gdDIgPSBjXjI7XG4gICAgICAgIGNvbnN0IHQzID0gdGhpcy5GLm11bChhWzBdLGFbMV0pOyAgICAgICAgICAgLy8gdDMgPSBhYlxuICAgICAgICBjb25zdCB0NCA9IHRoaXMuRi5tdWwoYVswXSxhWzJdKTsgICAgICAgICAgIC8vIHQ0ID0gYWNcbiAgICAgICAgY29uc3QgdDUgPSB0aGlzLkYubXVsKGFbMV0sYVsyXSk7ICAgICAgICAgICAvLyB0NSA9IGJjO1xuICAgICAgICAvLyBjMCA9IHQwIC0gbm9uX3Jlc2lkdWUgKiB0NTtcbiAgICAgICAgY29uc3QgYzAgPSB0aGlzLkYuc3ViKHQwLCB0aGlzLl9tdWxCeU5vblJlc2lkdWUodDUpKTtcbiAgICAgICAgLy8gYzEgPSBub25fcmVzaWR1ZSAqIHQyIC0gdDM7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5GLnN1Yih0aGlzLl9tdWxCeU5vblJlc2lkdWUodDIpLCB0Myk7XG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5GLnN1Yih0MSwgdDQpOyAgICAgICAgICAgICAgLy8gYzIgPSB0MS10NFxuXG4gICAgICAgIC8vIHQ2ID0gKGEgKiBjMCArIG5vbl9yZXNpZHVlICogKGMgKiBjMSArIGIgKiBjMikpLmludigpO1xuICAgICAgICBjb25zdCB0NiA9XG4gICAgICAgICAgICB0aGlzLkYuaW52KFxuICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRi5tdWwoYVswXSwgYzApLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tdWxCeU5vblJlc2lkdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkYuYWRkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRi5tdWwoYVsyXSwgYzEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRi5tdWwoYVsxXSwgYzIpKSkpKTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5GLm11bCh0NiwgYzApLCAgICAgICAgIC8vIHQ2KmMwXG4gICAgICAgICAgICB0aGlzLkYubXVsKHQ2LCBjMSksICAgICAgICAgLy8gdDYqYzFcbiAgICAgICAgICAgIHRoaXMuRi5tdWwodDYsIGMyKV07ICAgICAgICAvLyB0NipjMlxuICAgIH1cblxuICAgIGRpdihhLCBiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bChhLCB0aGlzLmludihiKSk7XG4gICAgfVxuXG4gICAgc3F1YXJlKGEpIHtcbiAgICAgICAgY29uc3QgczAgPSB0aGlzLkYuc3F1YXJlKGFbMF0pOyAgICAgICAgICAgICAgICAgICAvLyBzMCA9IGFeMlxuICAgICAgICBjb25zdCBhYiA9IHRoaXMuRi5tdWwoYVswXSwgYVsxXSk7ICAgICAgICAgICAgICAgIC8vIGFiID0gYSpiXG4gICAgICAgIGNvbnN0IHMxID0gdGhpcy5GLmFkZChhYiwgYWIpOyAgICAgICAgICAgICAgICAgICAgLy8gczEgPSAyYWI7XG4gICAgICAgIGNvbnN0IHMyID0gdGhpcy5GLnNxdWFyZShcbiAgICAgICAgICAgIHRoaXMuRi5hZGQodGhpcy5GLnN1YihhWzBdLGFbMV0pLCBhWzJdKSk7ICAgICAvLyBzMiA9IChhIC0gYiArIGMpXjI7XG4gICAgICAgIGNvbnN0IGJjID0gdGhpcy5GLm11bChhWzFdLGFbMl0pOyAgICAgICAgICAgICAgICAgLy8gYmMgPSBiKmNcbiAgICAgICAgY29uc3QgczMgPSB0aGlzLkYuYWRkKGJjLCBiYyk7ICAgICAgICAgICAgICAgICAgICAvLyBzMyA9IDIqYmNcbiAgICAgICAgY29uc3QgczQgPSB0aGlzLkYuc3F1YXJlKGFbMl0pOyAgICAgICAgICAgICAgICAgICAvLyBzNCA9IGNeMlxuXG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXMuRi5hZGQoXG4gICAgICAgICAgICAgICAgczAsXG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsQnlOb25SZXNpZHVlKHMzKSksICAgICAgICAgICAvLyBzMCArIG5vbl9yZXNpZHVlICogczMsXG4gICAgICAgICAgICB0aGlzLkYuYWRkKFxuICAgICAgICAgICAgICAgIHMxLFxuICAgICAgICAgICAgICAgIHRoaXMuX211bEJ5Tm9uUmVzaWR1ZShzNCkpLCAgICAgICAgICAgLy8gczEgKyBub25fcmVzaWR1ZSAqIHM0LFxuICAgICAgICAgICAgdGhpcy5GLnN1YihcbiAgICAgICAgICAgICAgICB0aGlzLkYuYWRkKCB0aGlzLkYuYWRkKHMxLCBzMikgLCBzMyApLFxuICAgICAgICAgICAgICAgIHRoaXMuRi5hZGQoczAsIHM0KSldOyAgICAgICAgICAgICAgICAgICAgICAvLyBzMSArIHMyICsgczMgLSBzMCAtIHM0XG4gICAgfVxuXG4gICAgaXNaZXJvKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRi5pc1plcm8oYVswXSkgJiYgdGhpcy5GLmlzWmVybyhhWzFdKSAmJiB0aGlzLkYuaXNaZXJvKGFbMl0pO1xuICAgIH1cblxuICAgIGVxKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRi5lcShhWzBdLCBiWzBdKSAmJiB0aGlzLkYuZXEoYVsxXSwgYlsxXSkgJiYgdGhpcy5GLmVxKGFbMl0sIGJbMl0pO1xuICAgIH1cblxuICAgIGFmZmluZShhKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5GLmFmZmluZShhWzBdKSwgdGhpcy5GLmFmZmluZShhWzFdKSwgdGhpcy5GLmFmZmluZShhWzJdKV07XG4gICAgfVxuXG4gICAgbXVsU2NhbGFyKGJhc2UsIGUpIHtcbiAgICAgICAgcmV0dXJuIGZVdGlscy5tdWxTY2FsYXIodGhpcywgYmFzZSwgZSk7XG4gICAgfVxuXG4gICAgcG93KGJhc2UsIGUpIHtcbiAgICAgICAgcmV0dXJuIGZVdGlscy5leHAodGhpcywgYmFzZSwgZSk7XG4gICAgfVxuXG4gICAgZXhwKGJhc2UsIGUpIHtcbiAgICAgICAgcmV0dXJuIGZVdGlscy5leHAodGhpcywgYmFzZSwgZSk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoYSkge1xuICAgICAgICByZXR1cm4gYFsgJHt0aGlzLkYudG9TdHJpbmcoYVswXSl9ICwgJHt0aGlzLkYudG9TdHJpbmcoYVsxXSl9LCAke3RoaXMuRi50b1N0cmluZyhhWzJdKX0gXWA7XG4gICAgfVxuXG4gICAgZnJvbVJuZyhybmcpIHtcbiAgICAgICAgY29uc3QgYzAgPSB0aGlzLkYuZnJvbVJuZyhybmcpO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5mcm9tUm5nKHJuZyk7XG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5GLmZyb21Sbmcocm5nKTtcbiAgICAgICAgcmV0dXJuIFtjMCwgYzEsIGMyXTtcbiAgICB9XG5cbiAgICBndChhLCBiKSB7XG4gICAgICAgIGlmICh0aGlzLkYuZ3QoYVswXSwgYlswXSkpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodGhpcy5GLmd0KGJbMF0sIGFbMF0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLkYuZ3QoYVsxXSwgYlsxXSkpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodGhpcy5GLmd0KGJbMV0sIGFbMV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLkYuZ3QoYVsyXSwgYlsyXSkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICBnZXEoYSwgYikge1xuICAgICAgICByZXR1cm4gdGhpcy5ndChhLCBiKSB8fCB0aGlzLmVxKGEsIGIpO1xuICAgIH1cblxuICAgIGx0KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmdlcShhLGIpO1xuICAgIH1cblxuICAgIGxlcShhLCBiKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5ndChhLGIpO1xuICAgIH1cblxuICAgIG5lcShhLCBiKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5lcShhLGIpO1xuICAgIH1cblxuICAgIHJhbmRvbSgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLkYucmFuZG9tKCksIHRoaXMuRi5yYW5kb20oKSwgdGhpcy5GLnJhbmRvbSgpXTtcbiAgICB9XG5cblxuICAgIHRvUnByTEUoYnVmZiwgbywgZSkge1xuICAgICAgICB0aGlzLkYudG9ScHJMRShidWZmLCBvLCBlWzBdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByTEUoYnVmZiwgbyt0aGlzLkYubjgsIGVbMV0pO1xuICAgICAgICB0aGlzLkYudG9ScHJMRShidWZmLCBvK3RoaXMuRi5uOCoyLCBlWzJdKTtcbiAgICB9XG5cbiAgICB0b1JwckJFKGJ1ZmYsIG8sIGUpIHtcbiAgICAgICAgdGhpcy5GLnRvUnByQkUoYnVmZiwgbywgZVsyXSk7XG4gICAgICAgIHRoaXMuRi50b1JwckJFKGJ1ZmYsIG8rdGhpcy5GLm44LCBlWzFdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByQkUoYnVmZiwgbyt0aGlzLkYubjgqMiwgZVswXSk7XG4gICAgfVxuXG4gICAgdG9ScHJMRU0oYnVmZiwgbywgZSkge1xuICAgICAgICB0aGlzLkYudG9ScHJMRU0oYnVmZiwgbywgZVswXSk7XG4gICAgICAgIHRoaXMuRi50b1JwckxFTShidWZmLCBvK3RoaXMuRi5uOCwgZVsxXSk7XG4gICAgICAgIHRoaXMuRi50b1JwckxFTShidWZmLCBvK3RoaXMuRi5uOCoyLCBlWzJdKTtcbiAgICB9XG5cblxuICAgIHRvUnByQkVNKGJ1ZmYsIG8sIGUpIHtcbiAgICAgICAgdGhpcy5GLnRvUnByQkVNKGJ1ZmYsIG8sIGVbMl0pO1xuICAgICAgICB0aGlzLkYudG9ScHJCRU0oYnVmZiwgbyt0aGlzLkYubjgsIGVbMV0pO1xuICAgICAgICB0aGlzLkYudG9ScHJCRU0oYnVmZiwgbyt0aGlzLkYubjgqMiwgZVswXSk7XG4gICAgfVxuXG4gICAgZnJvbVJwckxFKGJ1ZmYsIG8pIHtcbiAgICAgICAgbyA9IG8gfHwgMDtcbiAgICAgICAgY29uc3QgYzAgPSB0aGlzLkYuZnJvbVJwckxFKGJ1ZmYsIG8pO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5mcm9tUnByTEUoYnVmZiwgbyt0aGlzLm44KTtcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLkYuZnJvbVJwckxFKGJ1ZmYsIG8rdGhpcy5uOCoyKTtcbiAgICAgICAgcmV0dXJuIFtjMCwgYzEsIGMyXTtcbiAgICB9XG5cbiAgICBmcm9tUnByQkUoYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCBjMiA9IHRoaXMuRi5mcm9tUnByQkUoYnVmZiwgbyk7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5GLmZyb21ScHJCRShidWZmLCBvK3RoaXMubjgpO1xuICAgICAgICBjb25zdCBjMCA9IHRoaXMuRi5mcm9tUnByQkUoYnVmZiwgbyt0aGlzLm44KjIpO1xuICAgICAgICByZXR1cm4gW2MwLCBjMSwgYzJdO1xuICAgIH1cblxuICAgIGZyb21ScHJMRU0oYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCBjMCA9IHRoaXMuRi5mcm9tUnByTEVNKGJ1ZmYsIG8pO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5mcm9tUnByTEVNKGJ1ZmYsIG8rdGhpcy5uOCk7XG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5GLmZyb21ScHJMRU0oYnVmZiwgbyt0aGlzLm44KjIpO1xuICAgICAgICByZXR1cm4gW2MwLCBjMSwgYzJdO1xuICAgIH1cblxuICAgIGZyb21ScHJCRU0oYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCBjMiA9IHRoaXMuRi5mcm9tUnByQkVNKGJ1ZmYsIG8pO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5mcm9tUnByQkVNKGJ1ZmYsIG8rdGhpcy5uOCk7XG4gICAgICAgIGNvbnN0IGMwID0gdGhpcy5GLmZyb21ScHJCRU0oYnVmZiwgbyt0aGlzLm44KjIpO1xuICAgICAgICByZXR1cm4gW2MwLCBjMSwgYzJdO1xuICAgIH1cblxufVxuIiwiLypcbiAgICBDb3B5cmlnaHQgMjAxOCAwa2ltcyBhc3NvY2lhdGlvbi5cblxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHNuYXJranMuXG5cbiAgICBzbmFya2pzIGlzIGEgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gICAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICAgIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKVxuICAgIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgc25hcmtqcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWVxuICAgIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvclxuICAgIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nIHdpdGhcbiAgICBzbmFya2pzLiBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuXG5cbmltcG9ydCAqIGFzIGZVdGlscyBmcm9tIFwiLi9mdXRpbHMuanNcIjtcbmltcG9ydCAqIGFzIFNjYWxhciBmcm9tIFwiLi9zY2FsYXIuanNcIjtcblxuXG5mdW5jdGlvbiBpc0dyZWF0ZXN0KEYsIGEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuICAgICAgICBmb3IgKGxldCBpPWEubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgaWYgKCFGLkYuaXNaZXJvKGFbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzR3JlYXRlc3QoRi5GLCBhW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuYSA9IEYubmVnKGEpO1xuICAgICAgICByZXR1cm4gU2NhbGFyLmd0KGEsIG5hKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRUMge1xuXG4gICAgY29uc3RydWN0b3IoRiwgZykge1xuICAgICAgICB0aGlzLkYgPSBGO1xuICAgICAgICB0aGlzLmcgPSBnO1xuICAgICAgICBpZiAodGhpcy5nLmxlbmd0aCA9PSAyKSB0aGlzLmdbMl0gPSB0aGlzLkYub25lO1xuICAgICAgICB0aGlzLnplcm8gPSBbdGhpcy5GLnplcm8sIHRoaXMuRi5vbmUsIHRoaXMuRi56ZXJvXTtcbiAgICB9XG5cbiAgICBhZGQocDEsIHAyKSB7XG5cbiAgICAgICAgY29uc3QgRiA9IHRoaXMuRjtcblxuICAgICAgICBpZiAodGhpcy5lcShwMSwgdGhpcy56ZXJvKSkgcmV0dXJuIHAyO1xuICAgICAgICBpZiAodGhpcy5lcShwMiwgdGhpcy56ZXJvKSkgcmV0dXJuIHAxO1xuXG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBBcnJheSgzKTtcblxuICAgICAgICBjb25zdCBaMVoxID0gRi5zcXVhcmUoIHAxWzJdICk7XG4gICAgICAgIGNvbnN0IFoyWjIgPSBGLnNxdWFyZSggcDJbMl0gKTtcblxuICAgICAgICBjb25zdCBVMSA9IEYubXVsKCBwMVswXSAsIFoyWjIgKTsgICAgIC8vIFUxID0gWDEgICogWjJaMlxuICAgICAgICBjb25zdCBVMiA9IEYubXVsKCBwMlswXSAsIFoxWjEgKTsgICAgIC8vIFUyID0gWDIgICogWjFaMVxuXG4gICAgICAgIGNvbnN0IFoxX2N1YmVkID0gRi5tdWwoIHAxWzJdICwgWjFaMSk7XG4gICAgICAgIGNvbnN0IFoyX2N1YmVkID0gRi5tdWwoIHAyWzJdICwgWjJaMik7XG5cbiAgICAgICAgY29uc3QgUzEgPSBGLm11bCggcDFbMV0gLCBaMl9jdWJlZCk7ICAvLyBTMSA9IFkxICogWjIgKiBaMloyXG4gICAgICAgIGNvbnN0IFMyID0gRi5tdWwoIHAyWzFdICwgWjFfY3ViZWQpOyAgLy8gUzIgPSBZMiAqIFoxICogWjFaMVxuXG4gICAgICAgIGlmIChGLmVxKFUxLFUyKSAmJiBGLmVxKFMxLFMyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG91YmxlKHAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEggPSBGLnN1YiggVTIgLCBVMSApOyAgICAgICAgICAgICAgICAgICAgLy8gSCA9IFUyLVUxXG5cbiAgICAgICAgY29uc3QgUzJfbWludXNfUzEgPSBGLnN1YiggUzIgLCBTMSApO1xuXG4gICAgICAgIGNvbnN0IEkgPSBGLnNxdWFyZSggRi5hZGQoSCxIKSApOyAgICAgICAgIC8vIEkgPSAoMiAqIEgpXjJcbiAgICAgICAgY29uc3QgSiA9IEYubXVsKCBIICwgSSApOyAgICAgICAgICAgICAgICAgICAgICAvLyBKID0gSCAqIElcblxuICAgICAgICBjb25zdCByID0gRi5hZGQoIFMyX21pbnVzX1MxICwgUzJfbWludXNfUzEgKTsgIC8vIHIgPSAyICogKFMyLVMxKVxuICAgICAgICBjb25zdCBWID0gRi5tdWwoIFUxICwgSSApOyAgICAgICAgICAgICAgICAgICAgIC8vIFYgPSBVMSAqIElcblxuICAgICAgICByZXNbMF0gPVxuICAgICAgICAgICAgRi5zdWIoXG4gICAgICAgICAgICAgICAgRi5zdWIoIEYuc3F1YXJlKHIpICwgSiApLFxuICAgICAgICAgICAgICAgIEYuYWRkKCBWICwgViApKTsgICAgICAgICAgICAgICAgICAgICAgIC8vIFgzID0gcl4yIC0gSiAtIDIgKiBWXG5cbiAgICAgICAgY29uc3QgUzFfSiA9IEYubXVsKCBTMSAsIEogKTtcblxuICAgICAgICByZXNbMV0gPVxuICAgICAgICAgICAgRi5zdWIoXG4gICAgICAgICAgICAgICAgRi5tdWwoIHIgLCBGLnN1YihWLHJlc1swXSkpLFxuICAgICAgICAgICAgICAgIEYuYWRkKCBTMV9KLFMxX0ogKSk7ICAgICAgICAgICAgICAgICAgIC8vIFkzID0gciAqIChWLVgzKS0yIFMxIEpcblxuICAgICAgICByZXNbMl0gPVxuICAgICAgICAgICAgRi5tdWwoXG4gICAgICAgICAgICAgICAgSCxcbiAgICAgICAgICAgICAgICBGLnN1YihcbiAgICAgICAgICAgICAgICAgICAgRi5zcXVhcmUoIEYuYWRkKHAxWzJdLHAyWzJdKSApLFxuICAgICAgICAgICAgICAgICAgICBGLmFkZCggWjFaMSAsIFoyWjIgKSkpOyAgICAgICAgICAgIC8vIFozID0gKChaMStaMileMi1aMVoxLVoyWjIpICogSFxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgbmVnKHApIHtcbiAgICAgICAgcmV0dXJuIFtwWzBdLCB0aGlzLkYubmVnKHBbMV0pLCBwWzJdXTtcbiAgICB9XG5cbiAgICBzdWIoYSwgYikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoYSwgdGhpcy5uZWcoYikpO1xuICAgIH1cblxuICAgIGRvdWJsZShwKSB7XG4gICAgICAgIGNvbnN0IEYgPSB0aGlzLkY7XG5cbiAgICAgICAgY29uc3QgcmVzID0gbmV3IEFycmF5KDMpO1xuXG4gICAgICAgIGlmICh0aGlzLmVxKHAsIHRoaXMuemVybykpIHJldHVybiBwO1xuXG4gICAgICAgIGNvbnN0IEEgPSBGLnNxdWFyZSggcFswXSApOyAgICAgICAgICAgICAgICAgICAgLy8gQSA9IFgxXjJcbiAgICAgICAgY29uc3QgQiA9IEYuc3F1YXJlKCBwWzFdICk7ICAgICAgICAgICAgICAgICAgICAvLyBCID0gWTFeMlxuICAgICAgICBjb25zdCBDID0gRi5zcXVhcmUoIEIgKTsgICAgICAgICAgICAgICAgICAgICAgIC8vIEMgPSBCXjJcblxuICAgICAgICBsZXQgRCA9XG4gICAgICAgICAgICBGLnN1YihcbiAgICAgICAgICAgICAgICBGLnNxdWFyZSggRi5hZGQocFswXSAsIEIgKSksXG4gICAgICAgICAgICAgICAgRi5hZGQoIEEgLCBDKSk7XG4gICAgICAgIEQgPSBGLmFkZChELEQpOyAgICAgICAgICAgICAgICAgICAgLy8gRCA9IDIgKiAoKFgxICsgQileMiAtIEEgLSBDKVxuXG4gICAgICAgIGNvbnN0IEUgPSBGLmFkZCggRi5hZGQoQSxBKSwgQSk7ICAgICAgICAgIC8vIEUgPSAzICogQVxuICAgICAgICBjb25zdCBGRiA9Ri5zcXVhcmUoIEUgKTsgICAgICAgICAgICAgICAgICAgICAgIC8vIEYgPSBFXjJcblxuICAgICAgICByZXNbMF0gPSBGLnN1YiggRkYgLCBGLmFkZChELEQpICk7ICAgICAgICAgLy8gWDMgPSBGIC0gMiBEXG5cbiAgICAgICAgbGV0IGVpZ2h0QyA9IEYuYWRkKCBDICwgQyApO1xuICAgICAgICBlaWdodEMgPSBGLmFkZCggZWlnaHRDICwgZWlnaHRDICk7XG4gICAgICAgIGVpZ2h0QyA9IEYuYWRkKCBlaWdodEMgLCBlaWdodEMgKTtcblxuICAgICAgICByZXNbMV0gPVxuICAgICAgICAgICAgRi5zdWIoXG4gICAgICAgICAgICAgICAgRi5tdWwoXG4gICAgICAgICAgICAgICAgICAgIEUsXG4gICAgICAgICAgICAgICAgICAgIEYuc3ViKCBELCByZXNbMF0gKSksXG4gICAgICAgICAgICAgICAgZWlnaHRDKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBZMyA9IEUgKiAoRCAtIFgzKSAtIDggKiBDXG5cbiAgICAgICAgY29uc3QgWTFaMSA9IEYubXVsKCBwWzFdICwgcFsyXSApO1xuICAgICAgICByZXNbMl0gPSBGLmFkZCggWTFaMSAsIFkxWjEgKTsgICAgICAgICAgICAgICAgIC8vIFozID0gMiAqIFkxICogWjFcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHRpbWVzU2NhbGFyKGJhc2UsIGUpIHtcbiAgICAgICAgcmV0dXJuIGZVdGlscy5tdWxTY2FsYXIodGhpcywgYmFzZSwgZSk7XG4gICAgfVxuXG4gICAgbXVsU2NhbGFyKGJhc2UsIGUpIHtcbiAgICAgICAgcmV0dXJuIGZVdGlscy5tdWxTY2FsYXIodGhpcywgYmFzZSwgZSk7XG4gICAgfVxuXG4gICAgYWZmaW5lKHApIHtcbiAgICAgICAgY29uc3QgRiA9IHRoaXMuRjtcbiAgICAgICAgaWYgKHRoaXMuaXNaZXJvKHApKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy56ZXJvO1xuICAgICAgICB9IGVsc2UgaWYgKEYuZXEocFsyXSwgRi5vbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IFpfaW52ID0gRi5pbnYocFsyXSk7XG4gICAgICAgICAgICBjb25zdCBaMl9pbnYgPSBGLnNxdWFyZShaX2ludik7XG4gICAgICAgICAgICBjb25zdCBaM19pbnYgPSBGLm11bChaMl9pbnYsIFpfaW52KTtcblxuICAgICAgICAgICAgY29uc3QgcmVzID0gbmV3IEFycmF5KDMpO1xuICAgICAgICAgICAgcmVzWzBdID0gRi5tdWwocFswXSxaMl9pbnYpO1xuICAgICAgICAgICAgcmVzWzFdID0gRi5tdWwocFsxXSxaM19pbnYpO1xuICAgICAgICAgICAgcmVzWzJdID0gRi5vbmU7XG5cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtdWx0aUFmZmluZShhcnIpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgICAgIGNvbnN0IEYgPSB0aGlzLkY7XG4gICAgICAgIGNvbnN0IGFjY011bCA9IG5ldyBBcnJheShrZXlzLmxlbmd0aCsxKTtcbiAgICAgICAgYWNjTXVsWzBdID0gRi5vbmU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoRi5lcShhcnJba2V5c1tpXV1bMl0sIEYuemVybykpIHtcbiAgICAgICAgICAgICAgICBhY2NNdWxbaSsxXSA9IGFjY011bFtpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWNjTXVsW2krMV0gPSBGLm11bChhY2NNdWxbaV0sIGFycltrZXlzW2ldXVsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhY2NNdWxba2V5cy5sZW5ndGhdID0gRi5pbnYoYWNjTXVsW2tleXMubGVuZ3RoXSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IGtleXMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICAgICAgaWYgKEYuZXEoYXJyW2tleXNbaV1dWzJdLCBGLnplcm8pKSB7XG4gICAgICAgICAgICAgICAgYWNjTXVsW2ldID0gYWNjTXVsW2krMV07XG4gICAgICAgICAgICAgICAgYXJyW2tleXNbaV1dID0gdGhpcy56ZXJvO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBaX2ludiA9IEYubXVsKGFjY011bFtpXSwgYWNjTXVsW2krMV0pO1xuICAgICAgICAgICAgICAgIGFjY011bFtpXSA9IEYubXVsKGFycltrZXlzW2ldXVsyXSwgYWNjTXVsW2krMV0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgWjJfaW52ID0gRi5zcXVhcmUoWl9pbnYpO1xuICAgICAgICAgICAgICAgIGNvbnN0IFozX2ludiA9IEYubXVsKFoyX2ludiwgWl9pbnYpO1xuXG4gICAgICAgICAgICAgICAgYXJyW2tleXNbaV1dWzBdID0gRi5tdWwoYXJyW2tleXNbaV1dWzBdLFoyX2ludik7XG4gICAgICAgICAgICAgICAgYXJyW2tleXNbaV1dWzFdID0gRi5tdWwoYXJyW2tleXNbaV1dWzFdLFozX2ludik7XG4gICAgICAgICAgICAgICAgYXJyW2tleXNbaV1dWzJdID0gRi5vbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGVxKHAxLCBwMikge1xuICAgICAgICBjb25zdCBGID0gdGhpcy5GO1xuXG4gICAgICAgIGlmICh0aGlzLkYuZXEocDFbMl0sIHRoaXMuRi56ZXJvKSkgcmV0dXJuIHRoaXMuRi5lcShwMlsyXSwgdGhpcy5GLnplcm8pO1xuICAgICAgICBpZiAodGhpcy5GLmVxKHAyWzJdLCB0aGlzLkYuemVybykpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBaMVoxID0gRi5zcXVhcmUoIHAxWzJdICk7XG4gICAgICAgIGNvbnN0IFoyWjIgPSBGLnNxdWFyZSggcDJbMl0gKTtcblxuICAgICAgICBjb25zdCBVMSA9IEYubXVsKCBwMVswXSAsIFoyWjIgKTtcbiAgICAgICAgY29uc3QgVTIgPSBGLm11bCggcDJbMF0gLCBaMVoxICk7XG5cbiAgICAgICAgY29uc3QgWjFfY3ViZWQgPSBGLm11bCggcDFbMl0gLCBaMVoxKTtcbiAgICAgICAgY29uc3QgWjJfY3ViZWQgPSBGLm11bCggcDJbMl0gLCBaMloyKTtcblxuICAgICAgICBjb25zdCBTMSA9IEYubXVsKCBwMVsxXSAsIFoyX2N1YmVkKTtcbiAgICAgICAgY29uc3QgUzIgPSBGLm11bCggcDJbMV0gLCBaMV9jdWJlZCk7XG5cbiAgICAgICAgcmV0dXJuIChGLmVxKFUxLFUyKSAmJiBGLmVxKFMxLFMyKSk7XG4gICAgfVxuXG4gICAgaXNaZXJvKHApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRi5pc1plcm8ocFsyXSk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcocCkge1xuICAgICAgICBjb25zdCBjcCA9IHRoaXMuYWZmaW5lKHApO1xuICAgICAgICByZXR1cm4gYFsgJHt0aGlzLkYudG9TdHJpbmcoY3BbMF0pfSAsICR7dGhpcy5GLnRvU3RyaW5nKGNwWzFdKX0gXWA7XG4gICAgfVxuXG4gICAgZnJvbVJuZyhybmcpIHtcbiAgICAgICAgY29uc3QgRiA9IHRoaXMuRjtcbiAgICAgICAgbGV0IFAgPSBbXTtcbiAgICAgICAgbGV0IGdyZWF0ZXN0O1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBQWzBdID0gRi5mcm9tUm5nKHJuZyk7XG4gICAgICAgICAgICBncmVhdGVzdCA9IHJuZy5uZXh0Qm9vbCgpO1xuICAgICAgICAgICAgY29uc3QgeDNiID0gRi5hZGQoRi5tdWwoRi5zcXVhcmUoUFswXSksIFBbMF0pLCB0aGlzLmIpO1xuICAgICAgICAgICAgUFsxXSA9IEYuc3FydCh4M2IpO1xuICAgICAgICB9IHdoaWxlICgoUFsxXSA9PSBudWxsKXx8KEYuaXNaZXJvW1BdKSk7XG5cbiAgICAgICAgY29uc3QgcyA9IGlzR3JlYXRlc3QoRiwgUFsxXSk7XG4gICAgICAgIGlmIChncmVhdGVzdCBeIHMpIFBbMV0gPSBGLm5lZyhQWzFdKTtcbiAgICAgICAgUFsyXSA9IEYub25lO1xuXG4gICAgICAgIGlmICh0aGlzLmNvZmFjdG9yKSB7XG4gICAgICAgICAgICBQID0gdGhpcy5tdWxTY2FsYXIoUCwgdGhpcy5jb2ZhY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICBQID0gdGhpcy5hZmZpbmUoUCk7XG5cbiAgICAgICAgcmV0dXJuIFA7XG5cbiAgICB9XG5cbiAgICB0b1JwckxFKGJ1ZmYsIG8sIHApIHtcbiAgICAgICAgcCA9IHRoaXMuYWZmaW5lKHApO1xuICAgICAgICBpZiAodGhpcy5pc1plcm8ocCkpIHtcbiAgICAgICAgICAgIGNvbnN0IEJ1ZmZWID0gbmV3IFVpbnQ4QXJyYXkoYnVmZiwgbywgdGhpcy5GLm44KjIpO1xuICAgICAgICAgICAgQnVmZlYuZmlsbCgwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkYudG9ScHJMRShidWZmLCBvLCBwWzBdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByTEUoYnVmZiwgbyt0aGlzLkYubjgsIHBbMV0pO1xuICAgIH1cblxuICAgIHRvUnByQkUoYnVmZiwgbywgcCkge1xuICAgICAgICBwID0gdGhpcy5hZmZpbmUocCk7XG4gICAgICAgIGlmICh0aGlzLmlzWmVybyhwKSkge1xuICAgICAgICAgICAgY29uc3QgQnVmZlYgPSBuZXcgVWludDhBcnJheShidWZmLCBvLCB0aGlzLkYubjgqMik7XG4gICAgICAgICAgICBCdWZmVi5maWxsKDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuRi50b1JwckJFKGJ1ZmYsIG8sIHBbMF0pO1xuICAgICAgICB0aGlzLkYudG9ScHJCRShidWZmLCBvK3RoaXMuRi5uOCwgcFsxXSk7XG4gICAgfVxuXG4gICAgdG9ScHJMRU0oYnVmZiwgbywgcCkge1xuICAgICAgICBwID0gdGhpcy5hZmZpbmUocCk7XG4gICAgICAgIGlmICh0aGlzLmlzWmVybyhwKSkge1xuICAgICAgICAgICAgY29uc3QgQnVmZlYgPSBuZXcgVWludDhBcnJheShidWZmLCBvLCB0aGlzLkYubjgqMik7XG4gICAgICAgICAgICBCdWZmVi5maWxsKDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuRi50b1JwckxFTShidWZmLCBvLCBwWzBdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByTEVNKGJ1ZmYsIG8rdGhpcy5GLm44LCBwWzFdKTtcbiAgICB9XG5cbiAgICB0b1JwckxFSk0oYnVmZiwgbywgcCkge1xuICAgICAgICBwID0gdGhpcy5hZmZpbmUocCk7XG4gICAgICAgIGlmICh0aGlzLmlzWmVybyhwKSkge1xuICAgICAgICAgICAgY29uc3QgQnVmZlYgPSBuZXcgVWludDhBcnJheShidWZmLCBvLCB0aGlzLkYubjgqMik7XG4gICAgICAgICAgICBCdWZmVi5maWxsKDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuRi50b1JwckxFTShidWZmLCBvLCBwWzBdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByTEVNKGJ1ZmYsIG8rdGhpcy5GLm44LCBwWzFdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByTEVNKGJ1ZmYsIG8rMip0aGlzLkYubjgsIHBbMl0pO1xuICAgIH1cblxuXG4gICAgdG9ScHJCRU0oYnVmZiwgbywgcCkge1xuICAgICAgICBwID0gdGhpcy5hZmZpbmUocCk7XG4gICAgICAgIGlmICh0aGlzLmlzWmVybyhwKSkge1xuICAgICAgICAgICAgY29uc3QgQnVmZlYgPSBuZXcgVWludDhBcnJheShidWZmLCBvLCB0aGlzLkYubjgqMik7XG4gICAgICAgICAgICBCdWZmVi5maWxsKDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuRi50b1JwckJFTShidWZmLCBvLCBwWzBdKTtcbiAgICAgICAgdGhpcy5GLnRvUnByQkVNKGJ1ZmYsIG8rdGhpcy5GLm44LCBwWzFdKTtcbiAgICB9XG5cbiAgICBmcm9tUnByTEUoYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5GLmZyb21ScHJMRShidWZmLCBvKTtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuRi5mcm9tUnByTEUoYnVmZiwgbyt0aGlzLkYubjgpO1xuICAgICAgICBpZiAodGhpcy5GLmlzWmVybyh4KSAmJiB0aGlzLkYuaXNaZXJvKHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy56ZXJvO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbeCwgeSwgdGhpcy5GLm9uZV07XG4gICAgfVxuXG4gICAgZnJvbVJwckJFKGJ1ZmYsIG8pIHtcbiAgICAgICAgbyA9IG8gfHwgMDtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuRi5mcm9tUnByQkUoYnVmZiwgbyk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLkYuZnJvbVJwckJFKGJ1ZmYsIG8rdGhpcy5GLm44KTtcbiAgICAgICAgaWYgKHRoaXMuRi5pc1plcm8oeCkgJiYgdGhpcy5GLmlzWmVybyh5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuemVybztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3gsIHksIHRoaXMuRi5vbmVdO1xuICAgIH1cblxuICAgIGZyb21ScHJMRU0oYnVmZiwgbykge1xuICAgICAgICBvID0gbyB8fCAwO1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5GLmZyb21ScHJMRU0oYnVmZiwgbyk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLkYuZnJvbVJwckxFTShidWZmLCBvK3RoaXMuRi5uOCk7XG4gICAgICAgIGlmICh0aGlzLkYuaXNaZXJvKHgpICYmIHRoaXMuRi5pc1plcm8oeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnplcm87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt4LCB5LCB0aGlzLkYub25lXTtcbiAgICB9XG5cbiAgICBmcm9tUnByTEVKTShidWZmLCBvKSB7XG4gICAgICAgIG8gPSBvIHx8IDA7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLkYuZnJvbVJwckxFTShidWZmLCBvKTtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuRi5mcm9tUnByTEVNKGJ1ZmYsIG8rdGhpcy5GLm44KTtcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuRi5mcm9tUnByTEVNKGJ1ZmYsIG8rdGhpcy5GLm44KjIpO1xuICAgICAgICBpZiAodGhpcy5GLmlzWmVybyh4KSAmJiB0aGlzLkYuaXNaZXJvKHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy56ZXJvO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbeCwgeSwgel07XG4gICAgfVxuXG4gICAgZnJvbVJwckJFTShidWZmLCBvKSB7XG4gICAgICAgIG8gPSBvIHx8IDA7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLkYuZnJvbVJwckJFTShidWZmLCBvKTtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuRi5mcm9tUnByQkVNKGJ1ZmYsIG8rdGhpcy5GLm44KTtcbiAgICAgICAgaWYgKHRoaXMuRi5pc1plcm8oeCkgJiYgdGhpcy5GLmlzWmVybyh5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuemVybztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3gsIHksIHRoaXMuRi5vbmVdO1xuICAgIH1cblxuICAgIGZyb21ScHJDb21wcmVzc2VkKGJ1ZmYsIG8pIHtcbiAgICAgICAgY29uc3QgRiA9IHRoaXMuRjtcbiAgICAgICAgY29uc3QgdiA9IG5ldyBVaW50OEFycmF5KGJ1ZmYuYnVmZmVyLCBvLCBGLm44KTtcbiAgICAgICAgaWYgKHZbMF0gJiAweDQwKSByZXR1cm4gdGhpcy56ZXJvO1xuICAgICAgICBjb25zdCBQID0gbmV3IEFycmF5KDMpO1xuXG4gICAgICAgIGNvbnN0IGdyZWF0ZXN0ID0gKCh2WzBdICYgMHg4MCkgIT0gMCk7XG4gICAgICAgIHZbMF0gPSB2WzBdICYgMHg3RjtcbiAgICAgICAgUFswXSA9IEYuZnJvbVJwckJFKGJ1ZmYsIG8pO1xuICAgICAgICBpZiAoZ3JlYXRlc3QpIHZbMF0gPSB2WzBdIHwgMHg4MDsgIC8vIHNldCBiYWNrIGFnYWluIHRoZSBvbGQgdmFsdWVcblxuICAgICAgICBjb25zdCB4M2IgPSBGLmFkZChGLm11bChGLnNxdWFyZShQWzBdKSwgUFswXSksIHRoaXMuYik7XG4gICAgICAgIFBbMV0gPSBGLnNxcnQoeDNiKTtcblxuICAgICAgICBpZiAoUFsxXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBQb2ludCFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzID0gaXNHcmVhdGVzdChGLCBQWzFdKTtcbiAgICAgICAgaWYgKGdyZWF0ZXN0IF4gcykgUFsxXSA9IEYubmVnKFBbMV0pO1xuICAgICAgICBQWzJdID0gRi5vbmU7XG5cbiAgICAgICAgcmV0dXJuIFA7XG4gICAgfVxuXG4gICAgdG9ScHJDb21wcmVzc2VkKGJ1ZmYsIG8sIHApIHtcbiAgICAgICAgcCA9IHRoaXMuYWZmaW5lKHApO1xuICAgICAgICBjb25zdCB2ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZi5idWZmZXIsIG8sIHRoaXMuRi5uOCk7XG4gICAgICAgIGlmICh0aGlzLmlzWmVybyhwKSkge1xuICAgICAgICAgICAgdi5maWxsKDApO1xuICAgICAgICAgICAgdlswXSA9IDB4NDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5GLnRvUnByQkUoYnVmZiwgbywgcFswXSk7XG5cbiAgICAgICAgaWYgKGlzR3JlYXRlc3QodGhpcy5GLCBwWzFdKSkge1xuICAgICAgICAgICAgdlswXSA9IHZbMF0gfCAweDgwO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmcm9tUnByVW5jb21wcmVzc2VkKGJ1ZmYsIG8pIHtcbiAgICAgICAgaWYgKGJ1ZmZbMF0gJiAweDQwKSByZXR1cm4gdGhpcy56ZXJvO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21ScHJCRShidWZmLCBvKTtcbiAgICB9XG5cbiAgICB0b1JwclVuY29tcHJlc3NlZChidWZmLCBvLCBwKSB7XG4gICAgICAgIHRoaXMudG9ScHJCRShidWZmLCBvLCBwKTtcblxuICAgICAgICBpZiAodGhpcy5pc1plcm8ocCkpIHtcbiAgICAgICAgICAgIGJ1ZmZbb10gPSBidWZmW29dIHwgMHg0MDtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5cblxuIiwiLyogZ2xvYmFsIEJpZ0ludCAqL1xuaW1wb3J0ICogYXMgU2NhbGFyIGZyb20gXCIuL3NjYWxhci5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5QmlnSW50cyhvKSB7XG4gICAgaWYgKCh0eXBlb2YobykgPT0gXCJiaWdpbnRcIikgfHwgby5lcSAhPT0gdW5kZWZpbmVkKSAge1xuICAgICAgICByZXR1cm4gby50b1N0cmluZygxMCk7XG4gICAgfSBlbHNlIGlmIChvIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICByZXR1cm4gU2NhbGFyLmZyb21ScHJMRShvLCAwKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkobykpIHtcbiAgICAgICAgcmV0dXJuIG8ubWFwKHN0cmluZ2lmeUJpZ0ludHMpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG8gPT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCByZXMgPSB7fTtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG8pO1xuICAgICAgICBrZXlzLmZvckVhY2goIChrKSA9PiB7XG4gICAgICAgICAgICByZXNba10gPSBzdHJpbmdpZnlCaWdJbnRzKG9ba10pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbztcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnN0cmluZ2lmeUJpZ0ludHMobykge1xuICAgIGlmICgodHlwZW9mKG8pID09IFwic3RyaW5nXCIpICYmICgvXlswLTldKyQvLnRlc3QobykgKSkgIHtcbiAgICAgICAgcmV0dXJuIEJpZ0ludChvKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkobykpIHtcbiAgICAgICAgcmV0dXJuIG8ubWFwKHVuc3RyaW5naWZ5QmlnSW50cyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChvPT09bnVsbCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobyk7XG4gICAgICAgIGtleXMuZm9yRWFjaCggKGspID0+IHtcbiAgICAgICAgICAgIHJlc1trXSA9IHVuc3RyaW5naWZ5QmlnSW50cyhvW2tdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG87XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmVCdWZmMmludChidWZmKSB7XG4gICAgbGV0IHJlcyA9IDBuO1xuICAgIGxldCBpID0gYnVmZi5sZW5ndGg7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgY29uc3QgYnVmZlYgPSBuZXcgRGF0YVZpZXcoYnVmZi5idWZmZXIsIGJ1ZmYuYnl0ZU9mZnNldCwgYnVmZi5ieXRlTGVuZ3RoKTtcbiAgICB3aGlsZSAoaT4wKSB7XG4gICAgICAgIGlmIChpID49IDQpIHtcbiAgICAgICAgICAgIGkgLT0gNDtcbiAgICAgICAgICAgIHJlcyArPSBCaWdJbnQoYnVmZlYuZ2V0VWludDMyKGkpKSA8PCBCaWdJbnQob2Zmc2V0KjgpO1xuICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA+PSAyKSB7XG4gICAgICAgICAgICBpIC09IDI7XG4gICAgICAgICAgICByZXMgKz0gQmlnSW50KGJ1ZmZWLmdldFVpbnQxNihpKSkgPDwgQmlnSW50KG9mZnNldCo4KTtcbiAgICAgICAgICAgIG9mZnNldCArPSAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgcmVzICs9IEJpZ0ludChidWZmVi5nZXRVaW50OChpKSkgPDwgQmlnSW50KG9mZnNldCo4KTtcbiAgICAgICAgICAgIG9mZnNldCArPSAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiZUludDJCdWZmKG4sIGxlbikge1xuICAgIGxldCByID0gbjtcbiAgICBjb25zdCBidWZmID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICBjb25zdCBidWZmViA9IG5ldyBEYXRhVmlldyhidWZmLmJ1ZmZlcik7XG4gICAgbGV0IG8gPSBsZW47XG4gICAgd2hpbGUgKG8gPiAwKSB7XG4gICAgICAgIGlmIChvLTQgPj0gMCkge1xuICAgICAgICAgICAgbyAtPSA0O1xuICAgICAgICAgICAgYnVmZlYuc2V0VWludDMyKG8sIE51bWJlcihyICYgMHhGRkZGRkZGRm4pKTtcbiAgICAgICAgICAgIHIgPSByID4+IDMybjtcbiAgICAgICAgfSBlbHNlIGlmIChvLTIgPj0gMCkge1xuICAgICAgICAgICAgbyAtPSAyO1xuICAgICAgICAgICAgYnVmZlYuc2V0VWludDE2KG8sIE51bWJlcihyICYgMHhGRkZGbikpO1xuICAgICAgICAgICAgciA9IHIgPj4gMTZuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbyAtPSAxO1xuICAgICAgICAgICAgYnVmZlYuc2V0VWludDgobywgTnVtYmVyKHIgJiAweEZGbikpO1xuICAgICAgICAgICAgciA9IHIgPj4gOG47XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTnVtYmVyIGRvZXMgbm90IGZpdCBpbiB0aGlzIGxlbmd0aFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmY7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGxlQnVmZjJpbnQoYnVmZikge1xuICAgIGxldCByZXMgPSAwbjtcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3QgYnVmZlYgPSBuZXcgRGF0YVZpZXcoYnVmZi5idWZmZXIsIGJ1ZmYuYnl0ZU9mZnNldCwgYnVmZi5ieXRlTGVuZ3RoKTtcbiAgICB3aGlsZSAoaTxidWZmLmxlbmd0aCkge1xuICAgICAgICBpZiAoaSArIDQgPD0gYnVmZi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcyArPSBCaWdJbnQoYnVmZlYuZ2V0VWludDMyKGksIHRydWUpKSA8PCBCaWdJbnQoIGkqOCk7XG4gICAgICAgICAgICBpICs9IDQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDQgPD0gYnVmZi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcyArPSBCaWdJbnQoYnVmZlYuZ2V0VWludDE2KGksIHRydWUpKSA8PCBCaWdJbnQoIGkqOCk7XG4gICAgICAgICAgICBpICs9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgKz0gQmlnSW50KGJ1ZmZWLmdldFVpbnQ4KGksIHRydWUpKSA8PCBCaWdJbnQoIGkqOCk7XG4gICAgICAgICAgICBpICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlSW50MkJ1ZmYobiwgbGVuKSB7XG4gICAgbGV0IHIgPSBuO1xuICAgIGlmICh0eXBlb2YgbGVuID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGxlbiA9IE1hdGguZmxvb3IoKFNjYWxhci5iaXRMZW5ndGgobikgLSAxKSAvIDgpICsxO1xuICAgICAgICBpZiAobGVuPT0wKSBsZW4gPSAxO1xuICAgIH1cbiAgICBjb25zdCBidWZmID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICBjb25zdCBidWZmViA9IG5ldyBEYXRhVmlldyhidWZmLmJ1ZmZlcik7XG4gICAgbGV0IG8gPSAwO1xuICAgIHdoaWxlIChvIDwgbGVuKSB7XG4gICAgICAgIGlmIChvKzQgPD0gbGVuKSB7XG4gICAgICAgICAgICBidWZmVi5zZXRVaW50MzIobywgTnVtYmVyKHIgJiAweEZGRkZGRkZGbiksIHRydWUgKTtcbiAgICAgICAgICAgIG8gKz0gNDtcbiAgICAgICAgICAgIHIgPSByID4+IDMybjtcbiAgICAgICAgfSBlbHNlIGlmIChvKzIgPD0gbGVuKSB7XG4gICAgICAgICAgICBidWZmVi5zZXRVaW50MTYoTnVtYmVyKG8sIHIgJiAweEZGRkZuKSwgdHJ1ZSApO1xuICAgICAgICAgICAgbyArPSAyO1xuICAgICAgICAgICAgciA9IHIgPj4gMTZuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVmZlYuc2V0VWludDgoTnVtYmVyKG8sIHIgJiAweEZGbiksIHRydWUgKTtcbiAgICAgICAgICAgIG8gKz0gMTtcbiAgICAgICAgICAgIHIgPSByID4+IDhuO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk51bWJlciBkb2VzIG5vdCBmaXQgaW4gdGhpcyBsZW5ndGhcIik7XG4gICAgfVxuICAgIHJldHVybiBidWZmO1xufVxuIiwiaW1wb3J0IGJpZ0ludCBmcm9tIFwiYmlnLWludGVnZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeUJpZ0ludHMobykge1xuICAgIGlmICgodHlwZW9mKG8pID09IFwiYmlnaW50XCIpIHx8IG8uZXEgIT09IHVuZGVmaW5lZCkgIHtcbiAgICAgICAgcmV0dXJuIG8udG9TdHJpbmcoMTApO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvKSkge1xuICAgICAgICByZXR1cm4gby5tYXAoc3RyaW5naWZ5QmlnSW50cyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobyk7XG4gICAgICAgIGtleXMuZm9yRWFjaCggKGspID0+IHtcbiAgICAgICAgICAgIHJlc1trXSA9IHN0cmluZ2lmeUJpZ0ludHMob1trXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuc3RyaW5naWZ5QmlnSW50cyhvKSB7XG4gICAgaWYgKCh0eXBlb2YobykgPT0gXCJzdHJpbmdcIikgJiYgKC9eWzAtOV0rJC8udGVzdChvKSApKSAge1xuICAgICAgICByZXR1cm4gYmlnSW50KG8pO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvKSkge1xuICAgICAgICByZXR1cm4gby5tYXAodW5zdHJpbmdpZnlCaWdJbnRzKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3QgcmVzID0ge307XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKCAoaykgPT4ge1xuICAgICAgICAgICAgcmVzW2tdID0gdW5zdHJpbmdpZnlCaWdJbnRzKG9ba10pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbztcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiZUJ1ZmYyaW50KGJ1ZmYpIHtcbiAgICBsZXQgcmVzID0gYmlnSW50Lnplcm87XG4gICAgZm9yIChsZXQgaT0wOyBpPGJ1ZmYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbiA9IGJpZ0ludChidWZmW2J1ZmYubGVuZ3RoIC0gaSAtIDFdKTtcbiAgICAgICAgcmVzID0gcmVzLmFkZChuLnNoaWZ0TGVmdChpKjgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJlSW50MkJ1ZmYobiwgbGVuKSB7XG4gICAgbGV0IHIgPSBuO1xuICAgIGxldCBvID1sZW4tMTtcbiAgICBjb25zdCBidWZmID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICB3aGlsZSAoKHIuZ3QoYmlnSW50Lnplcm8pKSYmKG8+PTApKSB7XG4gICAgICAgIGxldCBjID0gTnVtYmVyKHIuYW5kKGJpZ0ludChcIjI1NVwiKSkpO1xuICAgICAgICBidWZmW29dID0gYztcbiAgICAgICAgby0tO1xuICAgICAgICByID0gci5zaGlmdFJpZ2h0KDgpO1xuICAgIH1cbiAgICBpZiAoIXIuZXEoYmlnSW50Lnplcm8pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk51bWJlciBkb2VzIG5vdCBmaXQgaW4gdGhpcyBsZW5ndGhcIik7XG4gICAgfVxuICAgIHJldHVybiBidWZmO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBsZUJ1ZmYyaW50IChidWZmKSB7XG4gICAgbGV0IHJlcyA9IGJpZ0ludC56ZXJvO1xuICAgIGZvciAobGV0IGk9MDsgaTxidWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG4gPSBiaWdJbnQoYnVmZltpXSk7XG4gICAgICAgIHJlcyA9IHJlcy5hZGQobi5zaGlmdExlZnQoaSo4KSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsZUludDJCdWZmKG4sIGxlbikge1xuICAgIGxldCByID0gbjtcbiAgICBsZXQgbyA9MDtcbiAgICBjb25zdCBidWZmID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICB3aGlsZSAoKHIuZ3QoYmlnSW50Lnplcm8pKSYmKG88YnVmZi5sZW5ndGgpKSB7XG4gICAgICAgIGxldCBjID0gTnVtYmVyKHIuYW5kKGJpZ0ludCgyNTUpKSk7XG4gICAgICAgIGJ1ZmZbb10gPSBjO1xuICAgICAgICBvKys7XG4gICAgICAgIHIgPSByLnNoaWZ0UmlnaHQoOCk7XG4gICAgfVxuICAgIGlmICghci5lcShiaWdJbnQuemVybykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTnVtYmVyIGRvZXMgbm90IGZpdCBpbiB0aGlzIGxlbmd0aFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmY7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsc19uYXRpdmUgZnJvbSBcIi4vdXRpbHNfbmF0aXZlLmpzXCI7XG5pbXBvcnQgKiBhcyB1dGlsc19iaWdpbnQgZnJvbSBcIi4vdXRpbHNfYmlnaW50LmpzXCI7XG5cbmxldCB1dGlscyA9IHt9O1xuXG5jb25zdCBzdXBwb3J0c05hdGl2ZUJpZ0ludCA9IHR5cGVvZiBCaWdJbnQgPT09IFwiZnVuY3Rpb25cIjtcbmlmIChzdXBwb3J0c05hdGl2ZUJpZ0ludCkge1xuICAgIE9iamVjdC5hc3NpZ24odXRpbHMsIHV0aWxzX25hdGl2ZSk7XG59IGVsc2Uge1xuICAgIE9iamVjdC5hc3NpZ24odXRpbHMsIHV0aWxzX2JpZ2ludCk7XG59XG5cblxuY29uc3QgX3JldlRhYmxlID0gW107XG5mb3IgKGxldCBpPTA7IGk8MjU2OyBpKyspIHtcbiAgICBfcmV2VGFibGVbaV0gPSBfcmV2U2xvdyhpLCA4KTtcbn1cblxuZnVuY3Rpb24gX3JldlNsb3coaWR4LCBiaXRzKSB7XG4gICAgbGV0IHJlcyA9MDtcbiAgICBsZXQgYSA9IGlkeDtcbiAgICBmb3IgKGxldCBpPTA7IGk8Yml0czsgaSsrKSB7XG4gICAgICAgIHJlcyA8PD0gMTtcbiAgICAgICAgcmVzID0gcmVzIHwgKGEgJjEpO1xuICAgICAgICBhID4+PTE7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbnV0aWxzLmJpdFJldmVyc2UgPSBmdW5jdGlvbiBiaXRSZXZlcnNlKGlkeCwgYml0cykge1xuICAgIHJldHVybiAoXG4gICAgICAgIF9yZXZUYWJsZVtpZHggPj4+IDI0XSB8XG4gICAgICAgIChfcmV2VGFibGVbKGlkeCA+Pj4gMTYpICYgMHhGRl0gPDwgOCkgfFxuICAgICAgICAoX3JldlRhYmxlWyhpZHggPj4+IDgpICYgMHhGRl0gPDwgMTYpIHxcbiAgICAgICAgKF9yZXZUYWJsZVtpZHggJiAweEZGXSA8PCAyNClcbiAgICApID4+PiAoMzItYml0cyk7XG59O1xuXG5cbnV0aWxzLmxvZzIgPSBmdW5jdGlvbiBsb2cyKCBWIClcbntcbiAgICByZXR1cm4oICggKCBWICYgMHhGRkZGMDAwMCApICE9PSAwID8gKCBWICY9IDB4RkZGRjAwMDAsIDE2ICkgOiAwICkgfCAoICggViAmIDB4RkYwMEZGMDAgKSAhPT0gMCA/ICggViAmPSAweEZGMDBGRjAwLCA4ICkgOiAwICkgfCAoICggViAmIDB4RjBGMEYwRjAgKSAhPT0gMCA/ICggViAmPSAweEYwRjBGMEYwLCA0ICkgOiAwICkgfCAoICggViAmIDB4Q0NDQ0NDQ0MgKSAhPT0gMCA/ICggViAmPSAweENDQ0NDQ0NDLCAyICkgOiAwICkgfCAoICggViAmIDB4QUFBQUFBQUEgKSAhPT0gMCApICk7XG59O1xuXG51dGlscy5idWZmUmV2ZXJzZUJpdHMgPSBmdW5jdGlvbiBidWZmUmV2ZXJzZUJpdHMoYnVmZiwgZVNpemUpIHtcbiAgICBjb25zdCBuID0gYnVmZi5ieXRlTGVuZ3RoIC9lU2l6ZTtcbiAgICBjb25zdCBiaXRzID0gdXRpbHMubG9nMihuKTtcbiAgICBpZiAobiAhPSAoMSA8PCBiaXRzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG51bWJlciBvZiBwb2ludGVyc1wiKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaT0wOyBpPG47IGkrKykge1xuICAgICAgICBjb25zdCByID0gdXRpbHMuYml0UmV2ZXJzZShpLGJpdHMpO1xuICAgICAgICBpZiAoaT5yKSB7XG4gICAgICAgICAgICBjb25zdCB0bXAgPSBidWZmLnNsaWNlKGkqZVNpemUsIChpKzEpKmVTaXplKTtcbiAgICAgICAgICAgIGJ1ZmYuc2V0KCBidWZmLnNsaWNlKHIqZVNpemUsIChyKzEpKmVTaXplKSwgaSplU2l6ZSk7XG4gICAgICAgICAgICBidWZmLnNldCh0bXAsIHIqZVNpemUpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGxldCB7XG4gICAgYml0UmV2ZXJzZSxcbiAgICBsb2cyLFxuICAgIGJ1ZmZSZXZlcnNlQml0cyxcbiAgICBzdHJpbmdpZnlCaWdJbnRzLFxuICAgIHVuc3RyaW5naWZ5QmlnSW50cyxcbiAgICBiZUJ1ZmYyaW50LFxuICAgIGJlSW50MkJ1ZmYsXG4gICAgbGVCdWZmMmludCxcbiAgICBsZUludDJCdWZmLFxufSA9IHV0aWxzO1xuXG4iLCJcbmNvbnN0IFBBR0VfU0laRSA9IDE8PDMwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaWdCdWZmZXIge1xuXG4gICAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gc2l6ZTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHNpemU7IGkrPSBQQUdFX1NJWkUpIHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBNYXRoLm1pbihzaXplLWksIFBBR0VfU0laRSk7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcnMucHVzaChuZXcgVWludDhBcnJheShuKSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHNsaWNlKGZyLCB0bykge1xuICAgICAgICBpZiAoIHRvID09PSB1bmRlZmluZWQgKSB0byA9IHRoaXMuYnl0ZUxlbmd0aDtcbiAgICAgICAgaWYgKCBmciA9PT0gdW5kZWZpbmVkICkgZnIgPSAwO1xuICAgICAgICBjb25zdCBsZW4gPSB0by1mcjtcblxuICAgICAgICBjb25zdCBmaXJzdFBhZ2UgPSBNYXRoLmZsb29yKGZyIC8gUEFHRV9TSVpFKTtcbiAgICAgICAgY29uc3QgbGFzdFBhZ2UgPSBNYXRoLmZsb29yKChmcitsZW4tMSkgLyBQQUdFX1NJWkUpO1xuXG4gICAgICAgIGlmICgoZmlyc3RQYWdlID09IGxhc3RQYWdlKXx8KGxlbj09MCkpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJzW2ZpcnN0UGFnZV0uc2xpY2UoZnIlUEFHRV9TSVpFLCBmciVQQUdFX1NJWkUgKyBsZW4pO1xuXG4gICAgICAgIGxldCBidWZmO1xuXG4gICAgICAgIGxldCBwID0gZmlyc3RQYWdlO1xuICAgICAgICBsZXQgbyA9IGZyICUgUEFHRV9TSVpFO1xuICAgICAgICAvLyBSZW1haW5pbmcgYnl0ZXMgdG8gcmVhZFxuICAgICAgICBsZXQgciA9IGxlbjtcbiAgICAgICAgd2hpbGUgKHI+MCkge1xuICAgICAgICAgICAgLy8gYnl0ZXMgdG8gY29weSBmcm9tIHRoaXMgcGFnZVxuICAgICAgICAgICAgY29uc3QgbCA9IChvK3IgPiBQQUdFX1NJWkUpID8gKFBBR0VfU0laRSAtbykgOiByO1xuICAgICAgICAgICAgY29uc3Qgc3JjVmlldyA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyc1twXS5idWZmZXIsIHRoaXMuYnVmZmVyc1twXS5ieXRlT2Zmc2V0K28sIGwpO1xuICAgICAgICAgICAgaWYgKGwgPT0gbGVuKSByZXR1cm4gc3JjVmlldy5zbGljZSgpO1xuICAgICAgICAgICAgaWYgKCFidWZmKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxlbiA8PSBQQUdFX1NJWkUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZiA9IG5ldyBVaW50OEFycmF5KGxlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZiA9IG5ldyBCaWdCdWZmZXIobGVuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWZmLnNldChzcmNWaWV3LCBsZW4tcik7XG4gICAgICAgICAgICByID0gci1sO1xuICAgICAgICAgICAgcCArKztcbiAgICAgICAgICAgIG8gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1ZmY7XG4gICAgfVxuXG4gICAgc2V0KGJ1ZmYsIG9mZnNldCkge1xuICAgICAgICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIG9mZnNldCA9IDA7XG5cbiAgICAgICAgY29uc3QgbGVuID0gYnVmZi5ieXRlTGVuZ3RoO1xuXG4gICAgICAgIGlmIChsZW49PTApIHJldHVybjtcblxuICAgICAgICBjb25zdCBmaXJzdFBhZ2UgPSBNYXRoLmZsb29yKG9mZnNldCAvIFBBR0VfU0laRSk7XG4gICAgICAgIGNvbnN0IGxhc3RQYWdlID0gTWF0aC5mbG9vcigob2Zmc2V0K2xlbi0xKSAvIFBBR0VfU0laRSk7XG5cbiAgICAgICAgaWYgKGZpcnN0UGFnZSA9PSBsYXN0UGFnZSkge1xuICAgICAgICAgICAgaWYgKChidWZmIGluc3RhbmNlb2YgQmlnQnVmZmVyKSYmKGJ1ZmYuYnVmZmVycy5sZW5ndGg9PTEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyc1tmaXJzdFBhZ2VdLnNldChidWZmLmJ1ZmZlcnNbMF0sIG9mZnNldCAlIFBBR0VfU0laRSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlcnNbZmlyc3RQYWdlXS5zZXQoYnVmZiwgb2Zmc2V0ICUgUEFHRV9TSVpFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgcCA9IGZpcnN0UGFnZTtcbiAgICAgICAgbGV0IG8gPSBvZmZzZXQgJSBQQUdFX1NJWkU7XG4gICAgICAgIGxldCByID0gbGVuO1xuICAgICAgICB3aGlsZSAocj4wKSB7XG4gICAgICAgICAgICBjb25zdCBsID0gKG8rciA+IFBBR0VfU0laRSkgPyAoUEFHRV9TSVpFIC1vKSA6IHI7XG4gICAgICAgICAgICBjb25zdCBzcmNWaWV3ID0gYnVmZi5zbGljZSggbGVuIC1yLCBsZW4gLXIrbCk7XG4gICAgICAgICAgICBjb25zdCBkc3RWaWV3ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5idWZmZXJzW3BdLmJ1ZmZlciwgdGhpcy5idWZmZXJzW3BdLmJ5dGVPZmZzZXQgKyBvLCBsKTtcbiAgICAgICAgICAgIGRzdFZpZXcuc2V0KHNyY1ZpZXcpO1xuICAgICAgICAgICAgciA9IHItbDtcbiAgICAgICAgICAgIHAgKys7XG4gICAgICAgICAgICBvID0gMDtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuIiwiaW1wb3J0IEJpZ0J1ZmZlciBmcm9tIFwiLi9iaWdidWZmZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRCYXRjaENvbnZlcnQodG0sIGZuTmFtZSwgc0luLCBzT3V0KSB7XG4gICAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGJhdGNoQ29udmVydChidWZmSW4pIHtcbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZkluLmJ5dGVMZW5ndGggLyBzSW4pO1xuICAgICAgICBpZiAoIG5Qb2ludHMgKiBzSW4gIT09IGJ1ZmZJbi5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJ1ZmZlciBzaXplXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50c1BlckNodW5rID0gTWF0aC5mbG9vcihuUG9pbnRzL3RtLmNvbmN1cnJlbmN5KTtcbiAgICAgICAgY29uc3Qgb3BQcm9taXNlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dG0uY29uY3VycmVuY3k7IGkrKykge1xuICAgICAgICAgICAgbGV0IG47XG4gICAgICAgICAgICBpZiAoaTwgdG0uY29uY3VycmVuY3ktMSkge1xuICAgICAgICAgICAgICAgIG4gPSBwb2ludHNQZXJDaHVuaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbiA9IG5Qb2ludHMgLSBpKnBvaW50c1BlckNodW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG49PTApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjb25zdCBidWZmQ2h1bmsgPSBidWZmSW4uc2xpY2UoaSpwb2ludHNQZXJDaHVuaypzSW4sIGkqcG9pbnRzUGVyQ2h1bmsqc0luICsgbipzSW4pO1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IFtcbiAgICAgICAgICAgICAgICB7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMCwgYnVmZjpidWZmQ2h1bmt9LFxuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQUxMT0NcIiwgdmFyOiAxLCBsZW46c091dCAqIG59LFxuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IGZuTmFtZSwgcGFyYW1zOiBbXG4gICAgICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgICAgICB7dmFsOiBufSxcbiAgICAgICAgICAgICAgICAgICAge3ZhcjogMX1cbiAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICB7Y21kOiBcIkdFVFwiLCBvdXQ6IDAsIHZhcjogMSwgbGVuOnNPdXQgKiBufSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBvcFByb21pc2VzLnB1c2goXG4gICAgICAgICAgICAgICAgdG0ucXVldWVBY3Rpb24odGFzaylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBQcm9taXNlLmFsbChvcFByb21pc2VzKTtcblxuICAgICAgICBsZXQgZnVsbEJ1ZmZPdXQ7XG4gICAgICAgIGlmIChidWZmSW4gaW5zdGFuY2VvZiBCaWdCdWZmZXIpIHtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0ID0gbmV3IEJpZ0J1ZmZlcihuUG9pbnRzKnNPdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQgPSBuZXcgVWludDhBcnJheShuUG9pbnRzKnNPdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHAgPTA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxyZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0LnNldChyZXN1bHRbaV1bMF0sIHApO1xuICAgICAgICAgICAgcCs9cmVzdWx0W2ldWzBdLmJ5dGVMZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVsbEJ1ZmZPdXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCAqIGFzIFNjYWxhciBmcm9tIFwiLi9zY2FsYXIuanNcIjtcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuL3V0aWxzLmpzXCI7XG5pbXBvcnQgeyBnZXRUaHJlYWRSbmcgfSBmcm9tIFwiLi9yYW5kb20uanNcIjtcbmltcG9ydCBidWlsZEJhdGNoQ29udmVydCBmcm9tIFwiLi9lbmdpbmVfYmF0Y2hjb252ZXJ0LmpzXCI7XG5pbXBvcnQgQmlnQnVmZmVyIGZyb20gXCIuL2JpZ2J1ZmZlci5qc1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhc21GaWVsZDEge1xuXG4gICAgY29uc3RydWN0b3IodG0sIHByZWZpeCwgbjgsIHApIHtcbiAgICAgICAgdGhpcy50bSA9IHRtO1xuICAgICAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcblxuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLm44ID0gbjg7XG4gICAgICAgIHRoaXMudHlwZSA9IFwiRjFcIjtcbiAgICAgICAgdGhpcy5tID0gMTtcblxuICAgICAgICB0aGlzLmhhbGYgPSBTY2FsYXIuc2hpZnRSaWdodChwLCBTY2FsYXIub25lKTtcbiAgICAgICAgdGhpcy5iaXRMZW5ndGggPSBTY2FsYXIuYml0TGVuZ3RoKHApO1xuICAgICAgICB0aGlzLm1hc2sgPSBTY2FsYXIuc3ViKFNjYWxhci5zaGlmdExlZnQoU2NhbGFyLm9uZSwgdGhpcy5iaXRMZW5ndGgpLCBTY2FsYXIub25lKTtcblxuICAgICAgICB0aGlzLnBPcDEgPSB0bS5hbGxvYyhuOCk7XG4gICAgICAgIHRoaXMucE9wMiA9IHRtLmFsbG9jKG44KTtcbiAgICAgICAgdGhpcy5wT3AzID0gdG0uYWxsb2MobjgpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbcHJlZml4ICsgXCJfemVyb1wiXSh0aGlzLnBPcDEpO1xuICAgICAgICB0aGlzLnplcm8gPSB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AxLCB0aGlzLm44KTtcbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3ByZWZpeCArIFwiX29uZVwiXSh0aGlzLnBPcDEpO1xuICAgICAgICB0aGlzLm9uZSA9IHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDEsIHRoaXMubjgpO1xuXG4gICAgICAgIHRoaXMubmVnb25lID0gdGhpcy5uZWcodGhpcy5vbmUpO1xuICAgICAgICB0aGlzLnR3byA9IHRoaXMuYWRkKHRoaXMub25lLCB0aGlzLm9uZSk7XG5cbiAgICAgICAgdGhpcy5uNjQgPSBNYXRoLmZsb29yKG44LzgpO1xuICAgICAgICB0aGlzLm4zMiA9IE1hdGguZmxvb3IobjgvNCk7XG5cbiAgICAgICAgaWYodGhpcy5uNjQqOCAhPSB0aGlzLm44KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJuOCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgOFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFsZiA9IFNjYWxhci5zaGlmdFJpZ2h0KHRoaXMucCwgU2NhbGFyLm9uZSk7XG4gICAgICAgIHRoaXMubnFyID0gdGhpcy50d287XG4gICAgICAgIGxldCByID0gdGhpcy5leHAodGhpcy5ucXIsIHRoaXMuaGFsZik7XG4gICAgICAgIHdoaWxlICghdGhpcy5lcShyLCB0aGlzLm5lZ29uZSkpIHtcbiAgICAgICAgICAgIHRoaXMubnFyID0gdGhpcy5hZGQodGhpcy5ucXIsIHRoaXMub25lKTtcbiAgICAgICAgICAgIHIgPSB0aGlzLmV4cCh0aGlzLm5xciwgdGhpcy5oYWxmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hpZnQgPSB0aGlzLm11bCh0aGlzLm5xciwgdGhpcy5ucXIpO1xuICAgICAgICB0aGlzLnNoaWZ0SW52ID0gdGhpcy5pbnYodGhpcy5zaGlmdCk7XG5cbiAgICAgICAgdGhpcy5zID0gMDtcbiAgICAgICAgbGV0IHQgPSBTY2FsYXIuc3ViKHRoaXMucCwgU2NhbGFyLm9uZSk7XG5cbiAgICAgICAgd2hpbGUgKCAhU2NhbGFyLmlzT2RkKHQpICkge1xuICAgICAgICAgICAgdGhpcy5zID0gdGhpcy5zICsgMTtcbiAgICAgICAgICAgIHQgPSBTY2FsYXIuc2hpZnRSaWdodCh0LCBTY2FsYXIub25lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudyA9IFtdO1xuICAgICAgICB0aGlzLndbdGhpcy5zXSA9IHRoaXMuZXhwKHRoaXMubnFyLCB0KTtcblxuICAgICAgICBmb3IgKGxldCBpPSB0aGlzLnMtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICB0aGlzLndbaV0gPSB0aGlzLnNxdWFyZSh0aGlzLndbaSsxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZXEodGhpcy53WzBdLCB0aGlzLm9uZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yIGNhbGN1bGF0aW5nIHJvb3RzIG9mIHVuaXR5XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYXRjaFRvTW9udGdvbWVyeSA9IGJ1aWxkQmF0Y2hDb252ZXJ0KHRtLCBwcmVmaXggKyBcIl9iYXRjaFRvTW9udGdvbWVyeVwiLCB0aGlzLm44LCB0aGlzLm44KTtcbiAgICAgICAgdGhpcy5iYXRjaEZyb21Nb250Z29tZXJ5ID0gYnVpbGRCYXRjaENvbnZlcnQodG0sIHByZWZpeCArIFwiX2JhdGNoRnJvbU1vbnRnb21lcnlcIiwgdGhpcy5uOCwgdGhpcy5uOCk7XG4gICAgfVxuXG5cbiAgICBvcDIob3BOYW1lLCBhLCBiKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AyLCBiKTtcbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgb3BOYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMiwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMubjgpO1xuICAgIH1cblxuICAgIG9wMkJvb2wob3BOYW1lLCBhLCBiKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AyLCBiKTtcbiAgICAgICAgcmV0dXJuICEhdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgb3BOYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMik7XG4gICAgfVxuXG4gICAgb3AxKG9wTmFtZSwgYSkge1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AxLCBhKTtcbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgb3BOYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMyk7XG4gICAgICAgIHJldHVybiB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AzLCB0aGlzLm44KTtcbiAgICB9XG5cbiAgICBvcDFCb29sKG9wTmFtZSwgYSkge1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AxLCBhKTtcbiAgICAgICAgcmV0dXJuICEhdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgb3BOYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMyk7XG4gICAgfVxuXG4gICAgYWRkKGEsYikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfYWRkXCIsIGEsIGIpO1xuICAgIH1cblxuXG4gICAgZXEoYSxiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMkJvb2woXCJfZXFcIiwgYSwgYik7XG4gICAgfVxuXG4gICAgaXNaZXJvKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxQm9vbChcIl9pc1plcm9cIiwgYSk7XG4gICAgfVxuXG4gICAgc3ViKGEsYikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfc3ViXCIsIGEsIGIpO1xuICAgIH1cblxuICAgIG5lZyhhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9uZWdcIiwgYSk7XG4gICAgfVxuXG4gICAgaW52KGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX2ludmVyc2VcIiwgYSk7XG4gICAgfVxuXG4gICAgdG9Nb250Z29tZXJ5KGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX3RvTW9udGdvbWVyeVwiLCBhKTtcbiAgICB9XG5cbiAgICBmcm9tTW9udGdvbWVyeShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9mcm9tTW9udGdvbWVyeVwiLCBhKTtcbiAgICB9XG5cbiAgICBtdWwoYSxiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMihcIl9tdWxcIiwgYSwgYik7XG4gICAgfVxuXG4gICAgZGl2KGEsIGIpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl9pbnZlcnNlXCJdKHRoaXMucE9wMiwgdGhpcy5wT3AyKTtcbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgXCJfbXVsXCJdKHRoaXMucE9wMSwgdGhpcy5wT3AyLCB0aGlzLnBPcDMpO1xuICAgICAgICByZXR1cm4gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMywgdGhpcy5uOCk7XG4gICAgfVxuXG4gICAgc3F1YXJlKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX3NxdWFyZVwiLCBhKTtcbiAgICB9XG5cbiAgICBpc1NxdWFyZShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMUJvb2woXCJfaXNTcXVhcmVcIiwgYSk7XG4gICAgfVxuXG4gICAgc3FydChhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9zcXJ0XCIsIGEpO1xuICAgIH1cblxuICAgIGV4cChhLCBiKSB7XG4gICAgICAgIGlmICghKGIgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgICAgICAgYiA9IFNjYWxhci50b0xFQnVmZihTY2FsYXIuZShiKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl9leHBcIl0odGhpcy5wT3AxLCB0aGlzLnBPcDIsIGIuYnl0ZUxlbmd0aCwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMubjgpO1xuICAgIH1cblxuICAgIGlzTmVnYXRpdmUoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDFCb29sKFwiX2lzTmVnYXRpdmVcIiwgYSk7XG4gICAgfVxuXG4gICAgZShhLCBiKSB7XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgVWludDhBcnJheSkgcmV0dXJuIGE7XG4gICAgICAgIGxldCByYSA9IFNjYWxhci5lKGEsIGIpO1xuICAgICAgICBpZiAoU2NhbGFyLmlzTmVnYXRpdmUocmEpKSB7XG4gICAgICAgICAgICByYSA9IFNjYWxhci5uZWcocmEpO1xuICAgICAgICAgICAgaWYgKFNjYWxhci5ndChyYSwgdGhpcy5wKSkge1xuICAgICAgICAgICAgICAgIHJhID0gU2NhbGFyLm1vZChyYSwgdGhpcy5wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhID0gU2NhbGFyLnN1Yih0aGlzLnAsIHJhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChTY2FsYXIuZ3QocmEsIHRoaXMucCkpIHtcbiAgICAgICAgICAgICAgICByYSA9IFNjYWxhci5tb2QocmEsIHRoaXMucCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYnVmZiA9IHV0aWxzLmxlSW50MkJ1ZmYocmEsIHRoaXMubjgpO1xuICAgICAgICByZXR1cm4gdGhpcy50b01vbnRnb21lcnkoYnVmZik7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoYSwgcmFkaXgpIHtcbiAgICAgICAgY29uc3QgYW4gPSB0aGlzLmZyb21Nb250Z29tZXJ5KGEpO1xuICAgICAgICBjb25zdCBzID0gU2NhbGFyLmZyb21ScHJMRShhbiwgMCk7XG4gICAgICAgIHJldHVybiBTY2FsYXIudG9TdHJpbmcocywgcmFkaXgpO1xuICAgIH1cblxuICAgIGZyb21Sbmcocm5nKSB7XG4gICAgICAgIGxldCB2O1xuICAgICAgICBjb25zdCBidWZmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5uOCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIHYgPSBTY2FsYXIuemVybztcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLm42NDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdiA9IFNjYWxhci5hZGQodiwgIFNjYWxhci5zaGlmdExlZnQocm5nLm5leHRVNjQoKSwgNjQqaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdiA9IFNjYWxhci5iYW5kKHYsIHRoaXMubWFzayk7XG4gICAgICAgIH0gd2hpbGUgKFNjYWxhci5nZXEodiwgdGhpcy5wKSk7XG4gICAgICAgIFNjYWxhci50b1JwckxFKGJ1ZmYsIDAsIHYsIHRoaXMubjgpO1xuICAgICAgICByZXR1cm4gYnVmZjtcbiAgICB9XG5cbiAgICByYW5kb20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21SbmcoZ2V0VGhyZWFkUm5nKCkpO1xuICAgIH1cblxuICAgIHRvT2JqZWN0KGEpIHtcbiAgICAgICAgY29uc3QgYW4gPSB0aGlzLmZyb21Nb250Z29tZXJ5KGEpO1xuICAgICAgICByZXR1cm4gU2NhbGFyLmZyb21ScHJMRShhbiwgMCk7XG4gICAgfVxuXG4gICAgZnJvbU9iamVjdChhKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmYgPSBuZXcgVWludDhBcnJheSh0aGlzLm44KTtcbiAgICAgICAgU2NhbGFyLnRvUnByTEUoYnVmZiwgMCwgYSwgdGhpcy5uOCk7XG4gICAgICAgIHJldHVybiB0aGlzLnRvTW9udGdvbWVyeShidWZmKTtcbiAgICB9XG5cbiAgICB0b1JwckxFKGJ1ZmYsIG9mZnNldCwgYSkge1xuICAgICAgICBidWZmLnNldCh0aGlzLmZyb21Nb250Z29tZXJ5KGEpLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIHRvUnByQkUoYnVmZiwgb2Zmc2V0LCBhKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmYyID0gdGhpcy5mcm9tTW9udGdvbWVyeShhKTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMubjgvMjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhdXggPSBidWZmMltpXTtcbiAgICAgICAgICAgIGJ1ZmYyW2ldID0gYnVmZjJbdGhpcy5uOC0xLWldO1xuICAgICAgICAgICAgYnVmZjJbdGhpcy5uOC0xLWldID0gYXV4O1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmYuc2V0KGJ1ZmYyLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGZyb21ScHJMRShidWZmLCBvZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG4gICAgICAgIGNvbnN0IHJlcyA9IGJ1ZmYuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0aGlzLm44KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9Nb250Z29tZXJ5KHJlcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgYmF0Y2hJbnZlcnNlKGJ1ZmZJbikge1xuICAgICAgICBjb25zdCBzSW4gPSB0aGlzLm44O1xuICAgICAgICBjb25zdCBzT3V0ID0gdGhpcy5uODtcbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZkluLmJ5dGVMZW5ndGggLyBzSW4pO1xuICAgICAgICBpZiAoIG5Qb2ludHMgKiBzSW4gIT09IGJ1ZmZJbi5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJ1ZmZlciBzaXplXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50c1BlckNodW5rID0gTWF0aC5mbG9vcihuUG9pbnRzL3RoaXMudG0uY29uY3VycmVuY3kpO1xuICAgICAgICBjb25zdCBvcFByb21pc2VzID0gW107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLnRtLmNvbmN1cnJlbmN5OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuO1xuICAgICAgICAgICAgaWYgKGk8IHRoaXMudG0uY29uY3VycmVuY3ktMSkge1xuICAgICAgICAgICAgICAgIG4gPSBwb2ludHNQZXJDaHVuaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbiA9IG5Qb2ludHMgLSBpKnBvaW50c1BlckNodW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG49PTApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjb25zdCBidWZmQ2h1bmsgPSBidWZmSW4uc2xpY2UoaSpwb2ludHNQZXJDaHVuaypzSW4sIGkqcG9pbnRzUGVyQ2h1bmsqc0luICsgbipzSW4pO1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IFtcbiAgICAgICAgICAgICAgICB7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMCwgYnVmZjpidWZmQ2h1bmt9LFxuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQUxMT0NcIiwgdmFyOiAxLCBsZW46c091dCAqIG59LFxuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IHRoaXMucHJlZml4ICsgXCJfYmF0Y2hJbnZlcnNlXCIsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgICAgICB7dmFyOiAwfSxcbiAgICAgICAgICAgICAgICAgICAge3ZhbDogc0lufSxcbiAgICAgICAgICAgICAgICAgICAge3ZhbDogbn0sXG4gICAgICAgICAgICAgICAgICAgIHt2YXI6IDF9LFxuICAgICAgICAgICAgICAgICAgICB7dmFsOiBzT3V0fSxcbiAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICB7Y21kOiBcIkdFVFwiLCBvdXQ6IDAsIHZhcjogMSwgbGVuOnNPdXQgKiBufSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBvcFByb21pc2VzLnB1c2goXG4gICAgICAgICAgICAgICAgdGhpcy50bS5xdWV1ZUFjdGlvbih0YXNrKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKG9wUHJvbWlzZXMpO1xuXG4gICAgICAgIGxldCBmdWxsQnVmZk91dDtcbiAgICAgICAgaWYgKGJ1ZmZJbiBpbnN0YW5jZW9mIEJpZ0J1ZmZlcikge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKG5Qb2ludHMqc091dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmdWxsQnVmZk91dCA9IG5ldyBVaW50OEFycmF5KG5Qb2ludHMqc091dCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcCA9MDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQuc2V0KHJlc3VsdFtpXVswXSwgcCk7XG4gICAgICAgICAgICBwKz1yZXN1bHRbaV1bMF0uYnl0ZUxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdWxsQnVmZk91dDtcbiAgICB9O1xuXG59XG5cblxuIiwiaW1wb3J0IHsgZ2V0VGhyZWFkUm5nIH0gZnJvbSBcIi4vcmFuZG9tLmpzXCI7XG5pbXBvcnQgKiBhcyBTY2FsYXIgZnJvbSBcIi4vc2NhbGFyLmpzXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FzbUZpZWxkMiB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0bSwgcHJlZml4LCBGKSB7XG4gICAgICAgIHRoaXMudG0gPSB0bTtcbiAgICAgICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG5cbiAgICAgICAgdGhpcy5GID0gRjtcbiAgICAgICAgdGhpcy50eXBlID0gXCJGMlwiO1xuICAgICAgICB0aGlzLm0gPSBGLm0gKiAyO1xuICAgICAgICB0aGlzLm44ID0gdGhpcy5GLm44KjI7XG4gICAgICAgIHRoaXMubjMyID0gdGhpcy5GLm4zMioyO1xuICAgICAgICB0aGlzLm42NCA9IHRoaXMuRi5uNjQqMjtcblxuICAgICAgICB0aGlzLnBPcDEgPSB0bS5hbGxvYyhGLm44KjIpO1xuICAgICAgICB0aGlzLnBPcDIgPSB0bS5hbGxvYyhGLm44KjIpO1xuICAgICAgICB0aGlzLnBPcDMgPSB0bS5hbGxvYyhGLm44KjIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbcHJlZml4ICsgXCJfemVyb1wiXSh0aGlzLnBPcDEpO1xuICAgICAgICB0aGlzLnplcm8gPSB0bS5nZXRCdWZmKHRoaXMucE9wMSwgdGhpcy5uOCk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1twcmVmaXggKyBcIl9vbmVcIl0odGhpcy5wT3AxKTtcbiAgICAgICAgdGhpcy5vbmUgPSB0bS5nZXRCdWZmKHRoaXMucE9wMSwgdGhpcy5uOCk7XG5cbiAgICAgICAgdGhpcy5uZWdvbmUgPSB0aGlzLm5lZyh0aGlzLm9uZSk7XG4gICAgICAgIHRoaXMudHdvID0gdGhpcy5hZGQodGhpcy5vbmUsIHRoaXMub25lKTtcblxuICAgIH1cblxuICAgIG9wMihvcE5hbWUsIGEsIGIpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AyLCB0aGlzLnBPcDMpO1xuICAgICAgICByZXR1cm4gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMywgdGhpcy5uOCk7XG4gICAgfVxuXG4gICAgb3AyQm9vbChvcE5hbWUsIGEsIGIpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICByZXR1cm4gISF0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AyKTtcbiAgICB9XG5cbiAgICBvcDEob3BOYW1lLCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMubjgpO1xuICAgIH1cblxuICAgIG9wMUJvb2wob3BOYW1lLCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICByZXR1cm4gISF0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AzKTtcbiAgICB9XG5cbiAgICBhZGQoYSxiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMihcIl9hZGRcIiwgYSwgYik7XG4gICAgfVxuXG4gICAgZXEoYSxiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMkJvb2woXCJfZXFcIiwgYSwgYik7XG4gICAgfVxuXG4gICAgaXNaZXJvKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxQm9vbChcIl9pc1plcm9cIiwgYSk7XG4gICAgfVxuXG4gICAgc3ViKGEsYikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfc3ViXCIsIGEsIGIpO1xuICAgIH1cblxuICAgIG5lZyhhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9uZWdcIiwgYSk7XG4gICAgfVxuXG4gICAgaW52KGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX2ludmVyc2VcIiwgYSk7XG4gICAgfVxuXG4gICAgaXNOZWdhdGl2ZShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMUJvb2woXCJfaXNOZWdhdGl2ZVwiLCBhKTtcbiAgICB9XG5cbiAgICB0b01vbnRnb21lcnkoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDEoXCJfdG9Nb250Z29tZXJ5XCIsIGEpO1xuICAgIH1cblxuICAgIGZyb21Nb250Z29tZXJ5KGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX2Zyb21Nb250Z29tZXJ5XCIsIGEpO1xuICAgIH1cblxuICAgIG11bChhLGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AyKFwiX211bFwiLCBhLCBiKTtcbiAgICB9XG5cbiAgICBtdWwxKGEsYikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfbXVsMVwiLCBhLCBiKTtcbiAgICB9XG5cbiAgICBkaXYoYSwgYikge1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AxLCBhKTtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMiwgYik7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLnByZWZpeCArIFwiX2ludmVyc2VcIl0odGhpcy5wT3AyLCB0aGlzLnBPcDIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl9tdWxcIl0odGhpcy5wT3AxLCB0aGlzLnBPcDIsIHRoaXMucE9wMyk7XG4gICAgICAgIHJldHVybiB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AzLCB0aGlzLm44KTtcbiAgICB9XG5cbiAgICBzcXVhcmUoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDEoXCJfc3F1YXJlXCIsIGEpO1xuICAgIH1cblxuICAgIGlzU3F1YXJlKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxQm9vbChcIl9pc1NxdWFyZVwiLCBhKTtcbiAgICB9XG5cbiAgICBzcXJ0KGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX3NxcnRcIiwgYSk7XG4gICAgfVxuXG4gICAgZXhwKGEsIGIpIHtcbiAgICAgICAgaWYgKCEoYiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKSB7XG4gICAgICAgICAgICBiID0gU2NhbGFyLnRvTEVCdWZmKFNjYWxhci5lKGIpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AxLCBhKTtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMiwgYik7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLnByZWZpeCArIFwiX2V4cFwiXSh0aGlzLnBPcDEsIHRoaXMucE9wMiwgYi5ieXRlTGVuZ3RoLCB0aGlzLnBPcDMpO1xuICAgICAgICByZXR1cm4gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMywgdGhpcy5uOCk7XG4gICAgfVxuXG4gICAgZShhLCBiKSB7XG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgVWludDhBcnJheSkgcmV0dXJuIGE7XG4gICAgICAgIGlmICgoQXJyYXkuaXNBcnJheShhKSkgJiYgKGEubGVuZ3RoID09IDIpKSB7XG4gICAgICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi5lKGFbMF0sIGIpO1xuICAgICAgICAgICAgY29uc3QgYzIgPSB0aGlzLkYuZShhWzFdLCBiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KHRoaXMuRi5uOCoyKTtcbiAgICAgICAgICAgIHJlcy5zZXQoYzEpO1xuICAgICAgICAgICAgcmVzLnNldChjMiwgdGhpcy5GLm44KjIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgRjJcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1N0cmluZyhhLCByYWRpeCkge1xuICAgICAgICBjb25zdCBzMSA9IHRoaXMuRi50b1N0cmluZyhhLnNsaWNlKDAsIHRoaXMuRi5uOCksIHJhZGl4KTtcbiAgICAgICAgY29uc3QgczIgPSB0aGlzLkYudG9TdHJpbmcoYS5zbGljZSh0aGlzLkYubjgpLCByYWRpeCk7XG4gICAgICAgIHJldHVybiBgWyR7czF9LCAke3MyfV1gO1xuICAgIH1cblxuICAgIGZyb21Sbmcocm5nKSB7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5GLmZyb21Sbmcocm5nKTtcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLkYuZnJvbVJuZyhybmcpO1xuICAgICAgICBjb25zdCByZXMgPSBuZXcgVWludDhBcnJheSh0aGlzLkYubjgqMik7XG4gICAgICAgIHJlcy5zZXQoYzEpO1xuICAgICAgICByZXMuc2V0KGMyLCB0aGlzLkYubjgpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHJhbmRvbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVJuZyhnZXRUaHJlYWRSbmcoKSk7XG4gICAgfVxuXG4gICAgdG9PYmplY3QoYSkge1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuRi50b09iamVjdChhLnNsaWNlKDAsIHRoaXMuRi5uOCkpO1xuICAgICAgICBjb25zdCBjMiA9IHRoaXMuRi50b09iamVjdChhLnNsaWNlKHRoaXMuRi5uOCwgdGhpcy5GLm44KjIpKTtcbiAgICAgICAgcmV0dXJuIFtjMSwgYzJdO1xuICAgIH1cblxuICAgIGZyb21PYmplY3QoYSkge1xuICAgICAgICBjb25zdCBidWZmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5GLm44KjIpO1xuICAgICAgICBjb25zdCBiMSA9IHRoaXMuRi5mcm9tT2JqZWN0KGFbMF0pO1xuICAgICAgICBjb25zdCBiMiA9IHRoaXMuRi5mcm9tT2JqZWN0KGFbMV0pO1xuICAgICAgICBidWZmLnNldChiMSk7XG4gICAgICAgIGJ1ZmYuc2V0KGIyLCB0aGlzLkYubjgpO1xuICAgICAgICByZXR1cm4gYnVmZjtcbiAgICB9XG5cbiAgICBjMShhKSB7XG4gICAgICAgIHJldHVybiBhLnNsaWNlKDAsIHRoaXMuRi5uOCk7XG4gICAgfVxuXG4gICAgYzIoYSkge1xuICAgICAgICByZXR1cm4gYS5zbGljZSh0aGlzLkYubjgpO1xuICAgIH1cblxufVxuXG4iLCJcblxuaW1wb3J0IHsgZ2V0VGhyZWFkUm5nIH0gZnJvbSBcIi4vcmFuZG9tLmpzXCI7XG5pbXBvcnQgKiBhcyBTY2FsYXIgZnJvbSBcIi4vc2NhbGFyLmpzXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FzbUZpZWxkMyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0bSwgcHJlZml4LCBGKSB7XG4gICAgICAgIHRoaXMudG0gPSB0bTtcbiAgICAgICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG5cbiAgICAgICAgdGhpcy5GID0gRjtcbiAgICAgICAgdGhpcy50eXBlID0gXCJGM1wiO1xuICAgICAgICB0aGlzLm0gPSBGLm0gKiAzO1xuICAgICAgICB0aGlzLm44ID0gdGhpcy5GLm44KjM7XG4gICAgICAgIHRoaXMubjMyID0gdGhpcy5GLm4zMiozO1xuICAgICAgICB0aGlzLm42NCA9IHRoaXMuRi5uNjQqMztcblxuICAgICAgICB0aGlzLnBPcDEgPSB0bS5hbGxvYyhGLm44KjMpO1xuICAgICAgICB0aGlzLnBPcDIgPSB0bS5hbGxvYyhGLm44KjMpO1xuICAgICAgICB0aGlzLnBPcDMgPSB0bS5hbGxvYyhGLm44KjMpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbcHJlZml4ICsgXCJfemVyb1wiXSh0aGlzLnBPcDEpO1xuICAgICAgICB0aGlzLnplcm8gPSB0bS5nZXRCdWZmKHRoaXMucE9wMSwgdGhpcy5uOCk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1twcmVmaXggKyBcIl9vbmVcIl0odGhpcy5wT3AxKTtcbiAgICAgICAgdGhpcy5vbmUgPSB0bS5nZXRCdWZmKHRoaXMucE9wMSwgdGhpcy5uOCk7XG5cbiAgICAgICAgdGhpcy5uZWdvbmUgPSB0aGlzLm5lZyh0aGlzLm9uZSk7XG4gICAgICAgIHRoaXMudHdvID0gdGhpcy5hZGQodGhpcy5vbmUsIHRoaXMub25lKTtcblxuICAgIH1cblxuICAgIG9wMihvcE5hbWUsIGEsIGIpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AyLCB0aGlzLnBPcDMpO1xuICAgICAgICByZXR1cm4gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMywgdGhpcy5uOCk7XG4gICAgfVxuXG4gICAgb3AyQm9vbChvcE5hbWUsIGEsIGIpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICByZXR1cm4gISF0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AyKTtcbiAgICB9XG5cbiAgICBvcDEob3BOYW1lLCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMubjgpO1xuICAgIH1cblxuICAgIG9wMUJvb2wob3BOYW1lLCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICByZXR1cm4gISF0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AzKTtcbiAgICB9XG5cblxuICAgIGVxKGEsYikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDJCb29sKFwiX2VxXCIsIGEsIGIpO1xuICAgIH1cblxuICAgIGlzWmVybyhhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMUJvb2woXCJfaXNaZXJvXCIsIGEpO1xuICAgIH1cblxuICAgIGFkZChhLGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AyKFwiX2FkZFwiLCBhLCBiKTtcbiAgICB9XG5cbiAgICBzdWIoYSxiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMihcIl9zdWJcIiwgYSwgYik7XG4gICAgfVxuXG4gICAgbmVnKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX25lZ1wiLCBhKTtcbiAgICB9XG5cbiAgICBpbnYoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDEoXCJfaW52ZXJzZVwiLCBhKTtcbiAgICB9XG5cbiAgICBpc05lZ2F0aXZlKGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3AxQm9vbChcIl9pc05lZ2F0aXZlXCIsIGEpO1xuICAgIH1cblxuICAgIHRvTW9udGdvbWVyeShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMShcIl90b01vbnRnb21lcnlcIiwgYSk7XG4gICAgfVxuXG4gICAgZnJvbU1vbnRnb21lcnkoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDEoXCJfZnJvbU1vbnRnb21lcnlcIiwgYSk7XG4gICAgfVxuXG4gICAgbXVsKGEsYikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfbXVsXCIsIGEsIGIpO1xuICAgIH1cblxuICAgIGRpdihhLCBiKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AyLCBiKTtcbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgXCJfaW52ZXJzZVwiXSh0aGlzLnBPcDIsIHRoaXMucE9wMik7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLnByZWZpeCArIFwiX211bFwiXSh0aGlzLnBPcDEsIHRoaXMucE9wMiwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMubjgpO1xuICAgIH1cblxuICAgIHNxdWFyZShhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9zcXVhcmVcIiwgYSk7XG4gICAgfVxuXG4gICAgaXNTcXVhcmUoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDFCb29sKFwiX2lzU3F1YXJlXCIsIGEpO1xuICAgIH1cblxuICAgIHNxcnQoYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcDEoXCJfc3FydFwiLCBhKTtcbiAgICB9XG5cbiAgICBleHAoYSwgYikge1xuICAgICAgICBpZiAoIShiIGluc3RhbmNlb2YgVWludDhBcnJheSkpIHtcbiAgICAgICAgICAgIGIgPSBTY2FsYXIudG9MRUJ1ZmYoU2NhbGFyLmUoYikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AyLCBiKTtcbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgXCJfZXhwXCJdKHRoaXMucE9wMSwgdGhpcy5wT3AyLCBiLmJ5dGVMZW5ndGgsIHRoaXMucE9wMyk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEJ1ZmYodGhpcy5wT3AzLCB0aGlzLm44KTtcbiAgICB9XG5cbiAgICBlKGEsIGIpIHtcbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSByZXR1cm4gYTtcbiAgICAgICAgaWYgKChBcnJheS5pc0FycmF5KGEpKSAmJiAoYS5sZW5ndGggPT0gMykpIHtcbiAgICAgICAgICAgIGNvbnN0IGMxID0gdGhpcy5GLmUoYVswXSwgYik7XG4gICAgICAgICAgICBjb25zdCBjMiA9IHRoaXMuRi5lKGFbMV0sIGIpO1xuICAgICAgICAgICAgY29uc3QgYzMgPSB0aGlzLkYuZShhWzJdLCBiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KHRoaXMuRi5uOCozKTtcbiAgICAgICAgICAgIHJlcy5zZXQoYzEpO1xuICAgICAgICAgICAgcmVzLnNldChjMiwgdGhpcy5GLm44KTtcbiAgICAgICAgICAgIHJlcy5zZXQoYzMsIHRoaXMuRi5uOCoyKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIEYzXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoYSwgcmFkaXgpIHtcbiAgICAgICAgY29uc3QgczEgPSB0aGlzLkYudG9TdHJpbmcoYS5zbGljZSgwLCB0aGlzLkYubjgpLCByYWRpeCk7XG4gICAgICAgIGNvbnN0IHMyID0gdGhpcy5GLnRvU3RyaW5nKGEuc2xpY2UodGhpcy5GLm44LCB0aGlzLkYubjgqMiksIHJhZGl4KTtcbiAgICAgICAgY29uc3QgczMgPSB0aGlzLkYudG9TdHJpbmcoYS5zbGljZSh0aGlzLkYubjgqMiksIHJhZGl4KTtcbiAgICAgICAgcmV0dXJuIGBbJHtzMX0sICR7czJ9LCAke3MzfV1gO1xuICAgIH1cblxuICAgIGZyb21Sbmcocm5nKSB7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5GLmZyb21Sbmcocm5nKTtcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLkYuZnJvbVJuZyhybmcpO1xuICAgICAgICBjb25zdCBjMyA9IHRoaXMuRi5mcm9tUm5nKHJuZyk7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KHRoaXMuRi5uOCozKTtcbiAgICAgICAgcmVzLnNldChjMSk7XG4gICAgICAgIHJlcy5zZXQoYzIsIHRoaXMuRi5uOCk7XG4gICAgICAgIHJlcy5zZXQoYzMsIHRoaXMuRi5uOCoyKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICByYW5kb20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21SbmcoZ2V0VGhyZWFkUm5nKCkpO1xuICAgIH1cblxuICAgIHRvT2JqZWN0KGEpIHtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLkYudG9PYmplY3QoYS5zbGljZSgwLCB0aGlzLkYubjgpKTtcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLkYudG9PYmplY3QoYS5zbGljZSh0aGlzLkYubjgsIHRoaXMuRi5uOCoyKSk7XG4gICAgICAgIGNvbnN0IGMzID0gdGhpcy5GLnRvT2JqZWN0KGEuc2xpY2UodGhpcy5GLm44KjIsIHRoaXMuRi5uOCozKSk7XG4gICAgICAgIHJldHVybiBbYzEsIGMyLCBjM107XG4gICAgfVxuXG4gICAgZnJvbU9iamVjdChhKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmYgPSBuZXcgVWludDhBcnJheSh0aGlzLkYubjgqMyk7XG4gICAgICAgIGNvbnN0IGIxID0gdGhpcy5GLmZyb21PYmplY3QoYVswXSk7XG4gICAgICAgIGNvbnN0IGIyID0gdGhpcy5GLmZyb21PYmplY3QoYVsxXSk7XG4gICAgICAgIGNvbnN0IGIzID0gdGhpcy5GLmZyb21PYmplY3QoYVsyXSk7XG4gICAgICAgIGJ1ZmYuc2V0KGIxKTtcbiAgICAgICAgYnVmZi5zZXQoYjIsIHRoaXMuRi5uOCk7XG4gICAgICAgIGJ1ZmYuc2V0KGIzLCB0aGlzLkYubjgqMik7XG4gICAgICAgIHJldHVybiBidWZmO1xuICAgIH1cblxuICAgIGMxKGEpIHtcbiAgICAgICAgcmV0dXJuIGEuc2xpY2UoMCwgdGhpcy5GLm44KTtcbiAgICB9XG5cbiAgICBjMihhKSB7XG4gICAgICAgIHJldHVybiBhLnNsaWNlKHRoaXMuRi5uOCwgdGhpcy5GLm44KjIpO1xuICAgIH1cblxuICAgIGMzKGEpIHtcbiAgICAgICAgcmV0dXJuIGEuc2xpY2UodGhpcy5GLm44KjIpO1xuICAgIH1cblxufVxuXG5cbiIsIlxuXG5pbXBvcnQgKiBhcyBTY2FsYXIgZnJvbSBcIi4vc2NhbGFyLmpzXCI7XG5pbXBvcnQgYnVpbGRCYXRjaENvbnZlcnQgZnJvbSBcIi4vZW5naW5lX2JhdGNoY29udmVydC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXNtQ3VydmUge1xuXG4gICAgY29uc3RydWN0b3IodG0sIHByZWZpeCwgRiwgcEdlbiwgcEdiLCBjb2ZhY3Rvcikge1xuICAgICAgICB0aGlzLnRtID0gdG07XG4gICAgICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgICAgICB0aGlzLkYgPSBGO1xuXG4gICAgICAgIHRoaXMucE9wMSA9IHRtLmFsbG9jKEYubjgqMyk7XG4gICAgICAgIHRoaXMucE9wMiA9IHRtLmFsbG9jKEYubjgqMyk7XG4gICAgICAgIHRoaXMucE9wMyA9IHRtLmFsbG9jKEYubjgqMyk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1twcmVmaXggKyBcIl96ZXJvXCJdKHRoaXMucE9wMSk7XG4gICAgICAgIHRoaXMuemVybyA9IHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDEsIEYubjgqMyk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1twcmVmaXggKyBcIl96ZXJvQWZmaW5lXCJdKHRoaXMucE9wMSk7XG4gICAgICAgIHRoaXMuemVyb0FmZmluZSA9IHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDEsIEYubjgqMik7XG4gICAgICAgIHRoaXMub25lID0gdGhpcy50bS5nZXRCdWZmKHBHZW4sIEYubjgqMyk7XG4gICAgICAgIHRoaXMuZyA9IHRoaXMub25lO1xuICAgICAgICB0aGlzLm9uZUFmZmluZSA9IHRoaXMudG0uZ2V0QnVmZihwR2VuLCBGLm44KjIpO1xuICAgICAgICB0aGlzLmdBZmZpbmUgPSB0aGlzLm9uZUFmZmluZTtcbiAgICAgICAgdGhpcy5iID0gdGhpcy50bS5nZXRCdWZmKHBHYiwgRi5uOCk7XG5cbiAgICAgICAgaWYgKGNvZmFjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvZmFjdG9yID0gU2NhbGFyLnRvTEVCdWZmKGNvZmFjdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmVnb25lID0gdGhpcy5uZWcodGhpcy5vbmUpO1xuICAgICAgICB0aGlzLnR3byA9IHRoaXMuYWRkKHRoaXMub25lLCB0aGlzLm9uZSk7XG5cbiAgICAgICAgdGhpcy5iYXRjaExFTXRvQyA9IGJ1aWxkQmF0Y2hDb252ZXJ0KHRtLCBwcmVmaXggKyBcIl9iYXRjaExFTXRvQ1wiLCBGLm44KjIsIEYubjgpO1xuICAgICAgICB0aGlzLmJhdGNoTEVNdG9VID0gYnVpbGRCYXRjaENvbnZlcnQodG0sIHByZWZpeCArIFwiX2JhdGNoTEVNdG9VXCIsIEYubjgqMiwgRi5uOCoyKTtcbiAgICAgICAgdGhpcy5iYXRjaEN0b0xFTSA9IGJ1aWxkQmF0Y2hDb252ZXJ0KHRtLCBwcmVmaXggKyBcIl9iYXRjaEN0b0xFTVwiLCBGLm44LCBGLm44KjIpO1xuICAgICAgICB0aGlzLmJhdGNoVXRvTEVNID0gYnVpbGRCYXRjaENvbnZlcnQodG0sIHByZWZpeCArIFwiX2JhdGNoVXRvTEVNXCIsIEYubjgqMiwgRi5uOCoyKTtcbiAgICAgICAgdGhpcy5iYXRjaFRvSmFjb2JpYW4gPSBidWlsZEJhdGNoQ29udmVydCh0bSwgcHJlZml4ICsgXCJfYmF0Y2hUb0phY29iaWFuXCIsIEYubjgqMiwgRi5uOCozKTtcbiAgICAgICAgdGhpcy5iYXRjaFRvQWZmaW5lID0gYnVpbGRCYXRjaENvbnZlcnQodG0sIHByZWZpeCArIFwiX2JhdGNoVG9BZmZpbmVcIiwgRi5uOCozLCBGLm44KjIpO1xuICAgIH1cblxuICAgIG9wMihvcE5hbWUsIGEsIGIpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIGIpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AyLCB0aGlzLnBPcDMpO1xuICAgICAgICByZXR1cm4gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMywgdGhpcy5GLm44KjMpO1xuICAgIH1cblxuICAgIG9wMmJvb2wob3BOYW1lLCBhLCBiKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AyLCBiKTtcbiAgICAgICAgcmV0dXJuICEhdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgb3BOYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMiwgdGhpcy5wT3AzKTtcbiAgICB9XG5cbiAgICBvcDEob3BOYW1lLCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMuRi5uOCozKTtcbiAgICB9XG5cbiAgICBvcDFBZmZpbmUob3BOYW1lLCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBvcE5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMuRi5uOCoyKTtcbiAgICB9XG5cbiAgICBvcDFCb29sKG9wTmFtZSwgYSkge1xuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AxLCBhKTtcbiAgICAgICAgcmV0dXJuICEhdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgb3BOYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMyk7XG4gICAgfVxuXG4gICAgYWRkKGEsYikge1xuICAgICAgICBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICBpZiAoYi5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3AyKFwiX2FkZFwiLCBhLCBiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCoyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3AyKFwiX2FkZE1peGVkXCIsIGEsIGIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBvaW50IHNpemVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCoyKSB7XG4gICAgICAgICAgICBpZiAoYi5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3AyKFwiX2FkZE1peGVkXCIsIGIsIGEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfYWRkQWZmaW5lXCIsIGEsIGIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBvaW50IHNpemVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBvaW50IHNpemVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdWIoYSxiKSB7XG4gICAgICAgIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgIGlmIChiLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfc3ViXCIsIGEsIGIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfc3ViTWl4ZWRcIiwgYSwgYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgIGlmIChiLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcDIoXCJfc3ViTWl4ZWRcIiwgYiwgYSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGIuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMihcIl9zdWJBZmZpbmVcIiwgYSwgYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5lZyhhKSB7XG4gICAgICAgIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9uZWdcIiwgYSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCoyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcDFBZmZpbmUoXCJfbmVnQWZmaW5lXCIsIGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBwb2ludCBzaXplXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZG91YmxlKGEpIHtcbiAgICAgICAgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3AxKFwiX2RvdWJsZVwiLCBhKTtcbiAgICAgICAgfSBlbHNlIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMShcIl9kb3VibGVBZmZpbmVcIiwgYSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBvaW50IHNpemVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1plcm8oYSkge1xuICAgICAgICBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcDFCb29sKFwiX2lzWmVyb1wiLCBhKTtcbiAgICAgICAgfSBlbHNlIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMUJvb2woXCJfaXNaZXJvQWZmaW5lXCIsIGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBwb2ludCBzaXplXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGltZXNTY2FsYXIoYSwgcykge1xuICAgICAgICBpZiAoIShzIGluc3RhbmNlb2YgVWludDhBcnJheSkpIHtcbiAgICAgICAgICAgIHMgPSBTY2FsYXIudG9MRUJ1ZmYoU2NhbGFyLmUocykpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmbk5hbWU7XG4gICAgICAgIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IHRoaXMucHJlZml4ICsgXCJfdGltZXNTY2FsYXJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IHRoaXMucHJlZml4ICsgXCJfdGltZXNTY2FsYXJBZmZpbmVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRtLnNldEJ1ZmYodGhpcy5wT3AxLCBhKTtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMiwgcyk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1tmbk5hbWVdKHRoaXMucE9wMSwgdGhpcy5wT3AyLCBzLmJ5dGVMZW5ndGgsIHRoaXMucE9wMyk7XG4gICAgICAgIHJldHVybiB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AzLCB0aGlzLkYubjgqMyk7XG4gICAgfVxuXG4gICAgdGltZXNGcihhLCBzKSB7XG4gICAgICAgIGxldCBmbk5hbWU7XG4gICAgICAgIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IHRoaXMucHJlZml4ICsgXCJfdGltZXNGclwiO1xuICAgICAgICB9IGVsc2UgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMikge1xuICAgICAgICAgICAgZm5OYW1lID0gdGhpcy5wcmVmaXggKyBcIl90aW1lc0ZyQWZmaW5lXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBvaW50IHNpemVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDIsIHMpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbZm5OYW1lXSh0aGlzLnBPcDEsIHRoaXMucE9wMiwgdGhpcy5wT3AzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG0uZ2V0QnVmZih0aGlzLnBPcDMsIHRoaXMuRi5uOCozKTtcbiAgICB9XG5cbiAgICBlcShhLGIpIHtcbiAgICAgICAgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMykge1xuICAgICAgICAgICAgaWYgKGIuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMmJvb2woXCJfZXFcIiwgYSwgYik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGIuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMmJvb2woXCJfZXFNaXhlZFwiLCBhLCBiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBwb2ludCBzaXplXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMikge1xuICAgICAgICAgICAgaWYgKGIuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMmJvb2woXCJfZXFNaXhlZFwiLCBiLCBhKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYi5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCoyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3AyYm9vbChcIl9lcUFmZmluZVwiLCBhLCBiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBwb2ludCBzaXplXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBwb2ludCBzaXplXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9BZmZpbmUoYSkge1xuICAgICAgICBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcDFBZmZpbmUoXCJfdG9BZmZpbmVcIiwgYSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCoyKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvSmFjb2JpYW4oYSkge1xuICAgICAgICBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfSBlbHNlIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wMShcIl90b0phY29iaWFuXCIsIGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBwb2ludCBzaXplXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9ScHJVbmNvbXByZXNzZWQoYXJyLCBvZmZzZXQsIGEpIHtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLnByZWZpeCArIFwiX3RvQWZmaW5lXCJdKHRoaXMucE9wMSwgdGhpcy5wT3AxKTtcbiAgICAgICAgfSBlbHNlIGlmIChhLmJ5dGVMZW5ndGggIT0gdGhpcy5GLm44KjIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl9MRU10b1VcIl0odGhpcy5wT3AxLCB0aGlzLnBPcDEpO1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AxLCB0aGlzLkYubjgqMik7XG4gICAgICAgIGFyci5zZXQocmVzLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGZyb21ScHJVbmNvbXByZXNzZWQoYXJyLCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgYnVmZiA9IGFyci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRoaXMuRi5uOCoyKTtcbiAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYnVmZik7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLnByZWZpeCArIFwiX1V0b0xFTVwiXSh0aGlzLnBPcDEsIHRoaXMucE9wMSk7XG4gICAgICAgIHJldHVybiB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AxLCB0aGlzLkYubjgqMik7XG4gICAgfVxuXG4gICAgdG9ScHJDb21wcmVzc2VkKGFyciwgb2Zmc2V0LCBhKSB7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGEpO1xuICAgICAgICBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl90b0FmZmluZVwiXSh0aGlzLnBPcDEsIHRoaXMucE9wMSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5ieXRlTGVuZ3RoICE9IHRoaXMuRi5uOCoyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHBvaW50IHNpemVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50bS5pbnN0YW5jZS5leHBvcnRzW3RoaXMucHJlZml4ICsgXCJfTEVNdG9DXCJdKHRoaXMucE9wMSwgdGhpcy5wT3AxKTtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMSwgdGhpcy5GLm44KTtcbiAgICAgICAgYXJyLnNldChyZXMsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgZnJvbVJwckNvbXByZXNzZWQoYXJyLCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgYnVmZiA9IGFyci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRoaXMuRi5uOCk7XG4gICAgICAgIHRoaXMudG0uc2V0QnVmZih0aGlzLnBPcDEsIGJ1ZmYpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl9DdG9MRU1cIl0odGhpcy5wT3AxLCB0aGlzLnBPcDIpO1xuICAgICAgICByZXR1cm4gdGhpcy50bS5nZXRCdWZmKHRoaXMucE9wMiwgdGhpcy5GLm44KjIpO1xuICAgIH1cblxuICAgIHRvVW5jb21wcmVzc2VkKGEpIHtcbiAgICAgICAgY29uc3QgYnVmZiA9IG5ldyBVaW50OEFycmF5KHRoaXMuRi5uOCoyKTtcbiAgICAgICAgdGhpcy50b1JwclVuY29tcHJlc3NlZChidWZmLCAwLCBhKTtcbiAgICAgICAgcmV0dXJuIGJ1ZmY7XG4gICAgfVxuXG4gICAgdG9ScHJMRU0oYXJyLCBvZmZzZXQsIGEpIHtcbiAgICAgICAgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMikge1xuICAgICAgICAgICAgYXJyLnNldChhLCBvZmZzZXQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMykge1xuICAgICAgICAgICAgdGhpcy50bS5zZXRCdWZmKHRoaXMucE9wMSwgYSk7XG4gICAgICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5wcmVmaXggKyBcIl90b0FmZmluZVwiXSh0aGlzLnBPcDEsIHRoaXMucE9wMSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSB0aGlzLnRtLmdldEJ1ZmYodGhpcy5wT3AxLCB0aGlzLkYubjgqMik7XG4gICAgICAgICAgICBhcnIuc2V0KHJlcywgb2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZyb21ScHJMRU0oYXJyLCBvZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG4gICAgICAgIHJldHVybiBhcnIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQrdGhpcy5GLm44KjIpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKGEsIHJhZGl4KSB7XG4gICAgICAgIGlmIChhLmJ5dGVMZW5ndGggPT0gdGhpcy5GLm44KjMpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLkYudG9TdHJpbmcoYS5zbGljZSgwLCB0aGlzLkYubjgpLCByYWRpeCk7XG4gICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5GLnRvU3RyaW5nKGEuc2xpY2UodGhpcy5GLm44LCB0aGlzLkYubjgqMiksIHJhZGl4KTtcbiAgICAgICAgICAgIGNvbnN0IHogPSB0aGlzLkYudG9TdHJpbmcoYS5zbGljZSh0aGlzLkYubjgqMiksIHJhZGl4KTtcbiAgICAgICAgICAgIHJldHVybiBgWyAke3h9LCAke3l9LCAke3p9IF1gO1xuICAgICAgICB9IGVsc2UgaWYgKGEuYnl0ZUxlbmd0aCA9PSB0aGlzLkYubjgqMikge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuRi50b1N0cmluZyhhLnNsaWNlKDAsIHRoaXMuRi5uOCksIHJhZGl4KTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLkYudG9TdHJpbmcoYS5zbGljZSh0aGlzLkYubjgpLCByYWRpeCk7XG4gICAgICAgICAgICByZXR1cm4gYFsgJHt4fSwgJHt5fSBdYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcG9pbnQgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzVmFsaWQoYSkge1xuICAgICAgICBpZiAodGhpcy5pc1plcm8oYSkpIHJldHVybiB0cnVlO1xuICAgICAgICBjb25zdCBGID0gdGhpcy5GO1xuICAgICAgICBjb25zdCBhYSA9IHRoaXMudG9BZmZpbmUoYSk7XG4gICAgICAgIGNvbnN0IHggPSBhYS5zbGljZSgwLCB0aGlzLkYubjgpO1xuICAgICAgICBjb25zdCB5ID0gYWEuc2xpY2UodGhpcy5GLm44LCB0aGlzLkYubjgqMik7XG4gICAgICAgIGNvbnN0IHgzYiA9IEYuYWRkKEYubXVsKEYuc3F1YXJlKHgpLHgpLCB0aGlzLmIpO1xuICAgICAgICBjb25zdCB5MiA9IEYuc3F1YXJlKHkpO1xuICAgICAgICByZXR1cm4gRi5lcSh4M2IsIHkyKTtcbiAgICB9XG5cbiAgICBmcm9tUm5nKHJuZykge1xuICAgICAgICBjb25zdCBGID0gdGhpcy5GO1xuICAgICAgICBsZXQgUCA9IFtdO1xuICAgICAgICBsZXQgZ3JlYXRlc3Q7XG4gICAgICAgIGxldCB4M2I7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIFBbMF0gPSBGLmZyb21Sbmcocm5nKTtcbiAgICAgICAgICAgIGdyZWF0ZXN0ID0gcm5nLm5leHRCb29sKCk7XG4gICAgICAgICAgICB4M2IgPSBGLmFkZChGLm11bChGLnNxdWFyZShQWzBdKSwgUFswXSksIHRoaXMuYik7XG4gICAgICAgIH0gd2hpbGUgKCFGLmlzU3F1YXJlKHgzYikpO1xuXG4gICAgICAgIFBbMV0gPSBGLnNxcnQoeDNiKTtcblxuICAgICAgICBjb25zdCBzID0gRi5pc05lZ2F0aXZlKFBbMV0pO1xuICAgICAgICBpZiAoZ3JlYXRlc3QgXiBzKSBQWzFdID0gRi5uZWcoUFsxXSk7XG5cbiAgICAgICAgbGV0IFBidWZmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5GLm44KjIpO1xuICAgICAgICBQYnVmZi5zZXQoUFswXSk7XG4gICAgICAgIFBidWZmLnNldChQWzFdLCB0aGlzLkYubjgpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvZmFjdG9yKSB7XG4gICAgICAgICAgICBQYnVmZiA9IHRoaXMudGltZXNTY2FsYXIoUGJ1ZmYsIHRoaXMuY29mYWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFBidWZmO1xuICAgIH1cblxuXG5cbiAgICB0b09iamVjdChhKSB7XG4gICAgICAgIGlmICh0aGlzLmlzWmVybyhhKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB0aGlzLkYudG9PYmplY3QodGhpcy5GLnplcm8pLFxuICAgICAgICAgICAgICAgIHRoaXMuRi50b09iamVjdCh0aGlzLkYub25lKSxcbiAgICAgICAgICAgICAgICB0aGlzLkYudG9PYmplY3QodGhpcy5GLnplcm8pLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB4ID0gdGhpcy5GLnRvT2JqZWN0KGEuc2xpY2UoMCwgdGhpcy5GLm44KSk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLkYudG9PYmplY3QoYS5zbGljZSh0aGlzLkYubjgsIHRoaXMuRi5uOCoyKSk7XG4gICAgICAgIGxldCB6O1xuICAgICAgICBpZiAoYS5ieXRlTGVuZ3RoID09IHRoaXMuRi5uOCozKSB7XG4gICAgICAgICAgICB6ID0gdGhpcy5GLnRvT2JqZWN0KGEuc2xpY2UodGhpcy5GLm44KjIsIHRoaXMuRi5uOCozKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB6ID0gdGhpcy5GLnRvT2JqZWN0KHRoaXMuRi5vbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbeCwgeSwgel07XG4gICAgfVxuXG4gICAgZnJvbU9iamVjdChhKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLkYuZnJvbU9iamVjdChhWzBdKTtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuRi5mcm9tT2JqZWN0KGFbMV0pO1xuICAgICAgICBsZXQgejtcbiAgICAgICAgaWYgKGEubGVuZ3RoPT0zKSB7XG4gICAgICAgICAgICB6ID0gdGhpcy5GLmZyb21PYmplY3QoYVsyXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB6ID0gdGhpcy5GLm9uZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5GLmlzWmVybyh6LCB0aGlzLkYub25lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuemVyb0FmZmluZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLkYuZXEoeiwgdGhpcy5GLm9uZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmYgPSBuZXcgVWludDhBcnJheSh0aGlzLkYubjgqMik7XG4gICAgICAgICAgICBidWZmLnNldCh4KTtcbiAgICAgICAgICAgIGJ1ZmYuc2V0KHksIHRoaXMuRi5uOCk7XG4gICAgICAgICAgICByZXR1cm4gYnVmZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmYgPSBuZXcgVWludDhBcnJheSh0aGlzLkYubjgqMyk7XG4gICAgICAgICAgICBidWZmLnNldCh4KTtcbiAgICAgICAgICAgIGJ1ZmYuc2V0KHksIHRoaXMuRi5uOCk7XG4gICAgICAgICAgICBidWZmLnNldCh6LCB0aGlzLkYubjgqMik7XG4gICAgICAgICAgICByZXR1cm4gYnVmZjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGUoYSkge1xuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHJldHVybiBhO1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0KGEpO1xuICAgIH1cblxuICAgIHgoYSkge1xuICAgICAgICBjb25zdCB0bXAgPSB0aGlzLnRvQWZmaW5lKGEpO1xuICAgICAgICByZXR1cm4gdG1wLnNsaWNlKDAsIHRoaXMuRi5uOCk7XG4gICAgfVxuXG4gICAgeShhKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IHRoaXMudG9BZmZpbmUoYSk7XG4gICAgICAgIHJldHVybiB0bXAuc2xpY2UodGhpcy5GLm44KTtcbiAgICB9XG5cbn1cblxuXG4iLCIvKiBnbG9iYWwgV2ViQXNzZW1ibHkgKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGhyZWFkKHNlbGYpIHtcbiAgICBjb25zdCBNQVhNRU0gPSAzMjc2NztcbiAgICBsZXQgaW5zdGFuY2U7XG4gICAgbGV0IG1lbW9yeTtcblxuICAgIGlmIChzZWxmKSB7XG4gICAgICAgIHNlbGYub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZiAoZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGUuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhWzBdLmNtZCA9PSBcIklOSVRcIikge1xuICAgICAgICAgICAgICAgIGluaXQoZGF0YVswXSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShkYXRhLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGFbMF0uY21kID09IFwiVEVSTUlOQVRFXCIpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gcnVuVGFzayhkYXRhKTtcbiAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBObyBzZWxmIGRlZmluZWQgZm9yIHRocmVhZGApO1xuICAgIH1cblxuXG4gICAgYXN5bmMgZnVuY3Rpb24gaW5pdChkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoYGluaXRgKTtcbiAgICAgICAgY29uc3QgY29kZSA9IG5ldyBVaW50OEFycmF5KGRhdGEuY29kZSk7XG4gICAgICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBhd2FpdCBXZWJBc3NlbWJseS5jb21waWxlKGNvZGUpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKGBjb21waWxlZCAke2RhdGEuaW5pdH1gKTtcbiAgICAgICAgbWVtb3J5ID0gbmV3IFdlYkFzc2VtYmx5Lk1lbW9yeSh7aW5pdGlhbDpkYXRhLmluaXQsIG1heGltdW06IE1BWE1FTX0pO1xuXG4gICAgICAgIGluc3RhbmNlID0gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUod2FzbU1vZHVsZSwge1xuICAgICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICAgICAgXCJtZW1vcnlcIjogbWVtb3J5XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgICAgIHJlcG9ydFByb2dyZXNzOiB2YWwgPT4gcmVwb3J0UHJvZ3Jlc3ModmFsKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuICAgIGZ1bmN0aW9uIGFsbG9jKGxlbmd0aCkge1xuICAgICAgICBjb25zdCB1MzIgPSBuZXcgVWludDMyQXJyYXkobWVtb3J5LmJ1ZmZlciwgMCwgMSk7XG4gICAgICAgIHdoaWxlICh1MzJbMF0gJiAzKSB1MzJbMF0rKzsgIC8vIFJldHVybiBhbHdheXMgYWxpZ25lZCBwb2ludGVyc1xuICAgICAgICBjb25zdCByZXMgPSB1MzJbMF07XG4gICAgICAgIHUzMlswXSArPSBsZW5ndGg7XG4gICAgICAgIGlmICh1MzJbMF0gKyBsZW5ndGggPiBtZW1vcnkuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlcyA9IG1lbW9yeS5idWZmZXIuYnl0ZUxlbmd0aCAvIDB4MTAwMDA7XG4gICAgICAgICAgICBsZXQgcmVxdWlyZWRQYWdlcyA9IE1hdGguZmxvb3IoKHUzMlswXSArIGxlbmd0aCkgLyAweDEwMDAwKSsxO1xuICAgICAgICAgICAgaWYgKHJlcXVpcmVkUGFnZXM+TUFYTUVNKSByZXF1aXJlZFBhZ2VzPU1BWE1FTTtcbiAgICAgICAgICAgIG1lbW9yeS5ncm93KHJlcXVpcmVkUGFnZXMtY3VycmVudFBhZ2VzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFsbG9jQnVmZmVyKGJ1ZmZlcikge1xuICAgICAgICBjb25zdCBwID0gYWxsb2MoYnVmZmVyLmJ5dGVMZW5ndGgpO1xuICAgICAgICBzZXRCdWZmZXIocCwgYnVmZmVyKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QnVmZmVyKHBvaW50ZXIsIGxlbmd0aCkge1xuICAgICAgICBjb25zdCB1OCA9IG5ldyBVaW50OEFycmF5KG1lbW9yeS5idWZmZXIpO1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodTguYnVmZmVyLCB1OC5ieXRlT2Zmc2V0ICsgcG9pbnRlciwgbGVuZ3RoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRCdWZmZXIocG9pbnRlciwgYnVmZmVyKSB7XG4gICAgICAgIGNvbnN0IHU4ID0gbmV3IFVpbnQ4QXJyYXkobWVtb3J5LmJ1ZmZlcik7XG4gICAgICAgIHU4LnNldChuZXcgVWludDhBcnJheShidWZmZXIpLCBwb2ludGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5UYXNrKHRhc2spIHtcbiAgICAgICAgaWYgKHRhc2tbMF0uY21kID09IFwiSU5JVFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdCh0YXNrWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICB2YXJzOiBbXSxcbiAgICAgICAgICAgIG91dDogW11cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdTMyYSA9IG5ldyBVaW50MzJBcnJheShtZW1vcnkuYnVmZmVyLCAwLCAxKTtcbiAgICAgICAgY29uc3Qgb2xkQWxsb2MgPSB1MzJhWzBdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dGFzay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3dpdGNoICh0YXNrW2ldLmNtZCkge1xuICAgICAgICAgICAgY2FzZSBcIkFMTE9DU0VUXCI6XG4gICAgICAgICAgICAgICAgY3R4LnZhcnNbdGFza1tpXS52YXJdID0gYWxsb2NCdWZmZXIodGFza1tpXS5idWZmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJBTExPQ1wiOlxuICAgICAgICAgICAgICAgIGN0eC52YXJzW3Rhc2tbaV0udmFyXSA9IGFsbG9jKHRhc2tbaV0ubGVuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJTRVRcIjpcbiAgICAgICAgICAgICAgICBzZXRCdWZmZXIoY3R4LnZhcnNbdGFza1tpXS52YXJdLCB0YXNrW2ldLmJ1ZmYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNBTExcIjogeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8dGFza1tpXS5wYXJhbXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IHRhc2tbaV0ucGFyYW1zW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHAudmFyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChjdHgudmFyc1twLnZhcl0gKyAocC5vZmZzZXQgfHwgMCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwLnZhbCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChwLnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuZXhwb3J0c1t0YXNrW2ldLmZuTmFtZV0oLi4ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJHRVRcIjpcbiAgICAgICAgICAgICAgICBjdHgub3V0W3Rhc2tbaV0ub3V0XSA9IGdldEJ1ZmZlcihjdHgudmFyc1t0YXNrW2ldLnZhcl0sIHRhc2tbaV0ubGVuKS5zbGljZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNtZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1MzJiID0gbmV3IFVpbnQzMkFycmF5KG1lbW9yeS5idWZmZXIsIDAsIDEpO1xuICAgICAgICB1MzJiWzBdID0gb2xkQWxsb2M7XG4gICAgICAgIHJldHVybiBjdHgub3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydFByb2dyZXNzKGNvdW50KSB7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyB0eXBlOiAncHJvZ3Jlc3MnLCBkYXRhOiBjb3VudCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnVuVGFzaztcbn1cbiIsIi8qIGdsb2JhbCB3aW5kb3csIG5hdmlnYXRvciwgQmxvYiwgV29ya2VyLCBXZWJBc3NlbWJseSAqL1xuLypcbiAgICBDb3B5cmlnaHQgMjAxOSAwS0lNUyBhc3NvY2lhdGlvbi5cblxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHdhc21zbmFyayAoV2ViIEFzc2VtYmx5IHprU25hcmsgUHJvdmVyKS5cblxuICAgIHdhc21zbmFyayBpcyBhIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbiAgICB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIHdhc21zbmFyayBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICAgIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWVxuICAgIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBHZW5lcmFsIFB1YmxpY1xuICAgIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCB3YXNtc25hcmsuIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuXG4vLyBjb25zdCBNRU1fU0laRSA9IDEwMDA7ICAvLyBNZW1vcnkgc2l6ZSBpbiA2NEsgUGFrZXMgKDUxMk1iKVxuY29uc3QgTUVNX1NJWkUgPSAyNTsgIC8vIE1lbW9yeSBzaXplIGluIDY0SyBQYWtlcyAoMTYwMEtiKVxuXG5cbmltcG9ydCB0aHJlYWQgZnJvbSBcIi4vdGhyZWFkbWFuX3RocmVhZC5qc1wiO1xuaW1wb3J0IG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0IFdvcmtlciBmcm9tIFwid2ViLXdvcmtlclwiO1xuXG5jbGFzcyBEZWZlcnJlZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkge1xuICAgIGlmIChwcm9jZXNzLmJyb3dzZXIpIHtcbiAgICAgICAgdmFyIGJpbmFyeV9zdHJpbmcgPSB3aW5kb3cuYXRvYihiYXNlNjQpO1xuICAgICAgICB2YXIgbGVuID0gYmluYXJ5X3N0cmluZy5sZW5ndGg7XG4gICAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGJ5dGVzW2ldID0gYmluYXJ5X3N0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBieXRlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoQnVmZmVyLmZyb20oYmFzZTY0LCBcImJhc2U2NFwiKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdHJpbmdUb0Jhc2U2NChzdHIpIHtcbiAgICBpZiAocHJvY2Vzcy5icm93c2VyKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuYnRvYShzdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBCdWZmZXIuZnJvbShzdHIpLnRvU3RyaW5nKFwiYmFzZTY0XCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcG9zdE1zZyhzZWxmKSB7XG4gICAgaWYgKHNlbGYpIHtcbiAgICAgICAgc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgICAgIGlmIChlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZS5kYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGFbMF0uY21kID09IFwiSU5JVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlbGYucG9zdE1lc3NhZ2UoJ3JlY2VpdmVkIElOSVQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YVswXS5jbWQgPT0gXCJURVJNSU5BVEVcIikge1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY29uc3QgcG0gPSB0aHJlYWQudG9TdHJpbmcoKTtcbmNvbnNvbGUuZGVidWcoYHBvc3RNc2c6ICR7cG19YCk7XG5jb25zdCB0aHJlYWRTb3VyY2UgPSBzdHJpbmdUb0Jhc2U2NChcIihcIiArIHBtICsgXCIpKHNlbGYpXCIpO1xuY29uc3Qgd29ya2VyU291cmNlID0gXCJkYXRhOmFwcGxpY2F0aW9uL2phdmFzY3JpcHQ7YmFzZTY0LFwiICsgdGhyZWFkU291cmNlO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYnVpbGRUaHJlYWRNYW5hZ2VyKHdhc20sIHNpbmdsZVRocmVhZCkge1xuICAgIGNvbnN0IHRtID0gbmV3IFRocmVhZE1hbmFnZXIoKTtcblxuICAgIHRtLm1lbW9yeSA9IG5ldyBXZWJBc3NlbWJseS5NZW1vcnkoe2luaXRpYWw6TUVNX1NJWkV9KTtcbiAgICB0bS51OCA9IG5ldyBVaW50OEFycmF5KHRtLm1lbW9yeS5idWZmZXIpO1xuICAgIHRtLnUzMiA9IG5ldyBVaW50MzJBcnJheSh0bS5tZW1vcnkuYnVmZmVyKTtcblxuICAgIGNvbnN0IHdhc21Nb2R1bGUgPSBhd2FpdCBXZWJBc3NlbWJseS5jb21waWxlKGJhc2U2NFRvQXJyYXlCdWZmZXIod2FzbS5jb2RlKSk7XG5cblxuICAgIHRtLmluc3RhbmNlID0gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUod2FzbU1vZHVsZSwge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIFwibWVtb3J5XCI6IHRtLm1lbW9yeVxuICAgICAgICB9LFxuICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICByZXBvcnRQcm9ncmVzczogdmFsID0+IGNvbnNvbGUuZGVidWcoYHByb2dyZXNzOiAke3ZhbH1gKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0bS5zaW5nbGVUaHJlYWQgPSBzaW5nbGVUaHJlYWQ7XG4gICAgdG0uaW5pdGFsUEZyZWUgPSB0bS51MzJbMF07ICAgLy8gU2F2ZSB0aGUgUG9pbnRlciB0byBmcmVlIHNwYWNlLlxuICAgIHRtLnBxID0gd2FzbS5wcTtcbiAgICB0bS5wciA9IHdhc20ucHI7XG4gICAgdG0ucEcxZ2VuID0gd2FzbS5wRzFnZW47XG4gICAgdG0ucEcxemVybyA9IHdhc20ucEcxemVybztcbiAgICB0bS5wRzJnZW4gPSB3YXNtLnBHMmdlbjtcbiAgICB0bS5wRzJ6ZXJvID0gd2FzbS5wRzJ6ZXJvO1xuICAgIHRtLnBPbmVUID0gd2FzbS5wT25lVDtcblxuICAgIC8vICAgIHRtLnBUbXAwID0gdG0uYWxsb2MoY3VydmUuRzIuRi5uOCozKTtcbiAgICAvLyAgICB0bS5wVG1wMSA9IHRtLmFsbG9jKGN1cnZlLkcyLkYubjgqMyk7XG5cblxuICAgIGlmIChzaW5nbGVUaHJlYWQpIHtcbiAgICAgICAgdG0uY29kZSA9IGJhc2U2NFRvQXJyYXlCdWZmZXIod2FzbS5jb2RlKTtcbiAgICAgICAgdG0udGFza01hbmFnZXIgPSB0aHJlYWQoKTtcbiAgICAgICAgYXdhaXQgdG0udGFza01hbmFnZXIoW3tcbiAgICAgICAgICAgIGNtZDogXCJJTklUXCIsXG4gICAgICAgICAgICBpbml0OiBNRU1fU0laRSxcbiAgICAgICAgICAgIGNvZGU6IHRtLmNvZGUuc2xpY2UoKVxuICAgICAgICB9XSk7XG4gICAgICAgIHRtLmNvbmN1cnJlbmN5ICA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG0ud29ya2VycyA9IFtdO1xuICAgICAgICB0bS5wZW5kaW5nRGVmZXJyZWRzID0gW107XG4gICAgICAgIHRtLndvcmtpbmcgPSBbXTtcbiAgICAgICAgdG0ucHJvZ3Jlc3MgPSBbXTtcblxuICAgICAgICBsZXQgY29uY3VycmVuY3k7XG5cbiAgICAgICAgaWYgKCh0eXBlb2YobmF2aWdhdG9yKSA9PT0gXCJvYmplY3RcIikgJiYgbmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3kpIHtcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5ID0gbmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3k7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25jdXJyZW5jeSA9IG9zLmNwdXMoKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGltaXQgdG8gNjQgdGhyZWFkcyBmb3IgbWVtb3J5IHJlYXNvbnMuXG4gICAgICAgIGlmIChjb25jdXJyZW5jeT42NCkgY29uY3VycmVuY3k9NjQ7XG4gICAgICAgIHRtLmNvbmN1cnJlbmN5ID0gY29uY3VycmVuY3k7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8Y29uY3VycmVuY3k7IGkrKykge1xuXG4gICAgICAgICAgICAvL3RtLndvcmtlcnNbaV0gPSBuZXcgV29ya2VyKCdkYXRhOixwb3N0TWVzc2FnZShcImhlbGxvXCIpJyk7XG5cbiAgICAgICAgICAgIHRtLndvcmtlcnNbaV0gPSBuZXcgV29ya2VyKHdvcmtlclNvdXJjZSk7XG5cbiAgICAgICAgICAgIHRtLndvcmtlcnNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZ2V0T25Nc2coaSkpO1xuXG4gICAgICAgICAgICB0bS53b3JraW5nW2ldPWZhbHNlO1xuXG4gICAgICAgICAgICB0bS5wcm9ncmVzc1tpXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbml0UHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRtLndvcmtlcnMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgY29uc3QgY29weUNvZGUgPSBiYXNlNjRUb0FycmF5QnVmZmVyKHdhc20uY29kZSkuc2xpY2UoKTtcbiAgICAgICAgICAgIGluaXRQcm9taXNlcy5wdXNoKHRtLnBvc3RBY3Rpb24oaSwgW3tcbiAgICAgICAgICAgICAgICBjbWQ6IFwiSU5JVFwiLFxuICAgICAgICAgICAgICAgIGluaXQ6IE1FTV9TSVpFLFxuICAgICAgICAgICAgICAgIGNvZGU6IGNvcHlDb2RlXG4gICAgICAgICAgICB9XSwgW2NvcHlDb2RlLmJ1ZmZlcl0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGluaXRQcm9taXNlcyk7XG5cbiAgICB9XG4gICAgcmV0dXJuIHRtO1xuXG4gICAgZnVuY3Rpb24gZ2V0T25Nc2coaSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZiAoKGUpJiYoZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmRhdGEudHlwZSkgeyAvLyBpbnRlcmltIHByb2dyZXNzIFxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBNZXNzYWdlICR7ZS5kYXRhLnR5cGV9ICR7ZS5kYXRhLmRhdGF9YCk7XG4gICAgICAgICAgICAgICAgICAgIHRtLnByb2dyZXNzW2ldID0gZS5kYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGUuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0bS53b3JraW5nW2ldPWZhbHNlO1xuICAgICAgICAgICAgdG0ucGVuZGluZ0RlZmVycmVkc1tpXS5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgdG0ucHJvY2Vzc1dvcmtzKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWdncmVnYXRlUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGlmICghdG0uc2luZ2xlVGhyZWFkKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gdG0ucHJvZ3Jlc3MucmVkdWNlKCh0b3QsIHZhbCkgPT4gdG90Kz12YWwgKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYENvbXB1dGUgcHJvZ3Jlc3M6ICR7cH1gKTtcbiAgICAgICAgICAgIGlmICh0bS5wcm9ncmVzc0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdG0ucHJvZ3Jlc3NDYWxsYmFjayhwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5jbGFzcyBUaHJlYWRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25RdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLm9sZFBGcmVlID0gMDtcbiAgICB9XG5cbiAgICBzdGFydFN5bmNPcCgpIHtcbiAgICAgICAgaWYgKHRoaXMub2xkUEZyZWUgIT0gMCkgdGhyb3cgbmV3IEVycm9yKFwiU3luYyBvcGVyYXRpb24gaW4gcHJvZ3Jlc3NcIik7XG4gICAgICAgIHRoaXMub2xkUEZyZWUgPSB0aGlzLnUzMlswXTtcbiAgICB9XG5cbiAgICBlbmRTeW5jT3AoKSB7XG4gICAgICAgIGlmICh0aGlzLm9sZFBGcmVlID09IDApIHRocm93IG5ldyBFcnJvcihcIk5vIHN5bmMgb3BlcmF0aW9uIGluIHByb2dyZXNzXCIpO1xuICAgICAgICB0aGlzLnUzMlswXSA9IHRoaXMub2xkUEZyZWU7XG4gICAgICAgIHRoaXMub2xkUEZyZWUgPSAwO1xuICAgIH1cblxuICAgIHBvc3RBY3Rpb24od29ya2VySWQsIGUsIHRyYW5zZmVycywgX2RlZmVycmVkKSB7XG4gICAgICAgIGlmICh0aGlzLndvcmtpbmdbd29ya2VySWRdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb3N0aW5nIGEgam9iIHRvIGEgd29ya2luZyB3b3JrZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53b3JraW5nW3dvcmtlcklkXSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nRGVmZXJyZWRzW3dvcmtlcklkXSA9IF9kZWZlcnJlZCA/IF9kZWZlcnJlZCA6IG5ldyBEZWZlcnJlZCgpO1xuICAgICAgICB0aGlzLndvcmtlcnNbd29ya2VySWRdLnBvc3RNZXNzYWdlKGUsIHRyYW5zZmVycyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ0RlZmVycmVkc1t3b3JrZXJJZF0ucHJvbWlzZTtcbiAgICB9XG5cbiAgICBwcm9jZXNzV29ya3MoKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgKGk8dGhpcy53b3JrZXJzLmxlbmd0aCkmJih0aGlzLmFjdGlvblF1ZXVlLmxlbmd0aCA+IDApOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndvcmtpbmdbaV0gPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JrID0gdGhpcy5hY3Rpb25RdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucG9zdEFjdGlvbihpLCB3b3JrLmRhdGEsIHdvcmsudHJhbnNmZXJzLCB3b3JrLmRlZmVycmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHF1ZXVlQWN0aW9uKGFjdGlvbkRhdGEsIHRyYW5zZmVycykge1xuICAgICAgICBjb25zdCBkID0gbmV3IERlZmVycmVkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2luZ2xlVGhyZWFkKSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSB0aGlzLnRhc2tNYW5hZ2VyKGFjdGlvbkRhdGEpO1xuICAgICAgICAgICAgZC5yZXNvbHZlKHJlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFjdGlvblF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgICAgIGRhdGE6IGFjdGlvbkRhdGEsXG4gICAgICAgICAgICAgICAgdHJhbnNmZXJzOiB0cmFuc2ZlcnMsXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQ6IGRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzV29ya3MoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZC5wcm9taXNlO1xuICAgIH1cblxuICAgIHJlc2V0TWVtb3J5KCkge1xuICAgICAgICB0aGlzLnUzMlswXSA9IHRoaXMuaW5pdGFsUEZyZWU7XG4gICAgfVxuXG4gICAgYWxsb2NCdWZmKGJ1ZmYpIHtcbiAgICAgICAgY29uc3QgcG9pbnRlciA9IHRoaXMuYWxsb2MoYnVmZi5ieXRlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zZXRCdWZmKHBvaW50ZXIsIGJ1ZmYpO1xuICAgICAgICByZXR1cm4gcG9pbnRlcjtcbiAgICB9XG5cbiAgICBnZXRCdWZmKHBvaW50ZXIsIGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy51OC5zbGljZShwb2ludGVyLCBwb2ludGVyKyBsZW5ndGgpO1xuICAgIH1cblxuICAgIHNldEJ1ZmYocG9pbnRlciwgYnVmZmVyKSB7XG4gICAgICAgIHRoaXMudTguc2V0KG5ldyBVaW50OEFycmF5KGJ1ZmZlciksIHBvaW50ZXIpO1xuICAgIH1cblxuICAgIGFsbG9jKGxlbmd0aCkge1xuICAgICAgICB3aGlsZSAodGhpcy51MzJbMF0gJiAzKSB0aGlzLnUzMlswXSsrOyAgLy8gUmV0dXJuIGFsd2F5cyBhbGlnbmVkIHBvaW50ZXJzXG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMudTMyWzBdO1xuICAgICAgICB0aGlzLnUzMlswXSArPSBsZW5ndGg7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgdGVybWluYXRlKCkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dGhpcy53b3JrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLndvcmtlcnNbaV0ucG9zdE1lc3NhZ2UoW3tjbWQ6IFwiVEVSTUlOQVRFXCJ9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgc2xlZXAoMjAwKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCBCaWdCdWZmZXIgZnJvbSBcIi4vYmlnYnVmZmVyLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkQmF0Y2hBcHBseUtleShjdXJ2ZSwgZ3JvdXBOYW1lKSB7XG4gICAgY29uc3QgRyA9IGN1cnZlW2dyb3VwTmFtZV07XG4gICAgY29uc3QgRnIgPSBjdXJ2ZS5GcjtcbiAgICBjb25zdCB0bSA9IGN1cnZlLnRtO1xuXG4gICAgY3VydmVbZ3JvdXBOYW1lXS5iYXRjaEFwcGx5S2V5ID0gYXN5bmMgZnVuY3Rpb24oYnVmZiwgZmlyc3QsIGluYywgaW5UeXBlLCBvdXRUeXBlLCBwcm9ncmVzcykge1xuICAgICAgICBpblR5cGUgPSBpblR5cGUgfHwgXCJhZmZpbmVcIjtcbiAgICAgICAgb3V0VHlwZSA9IG91dFR5cGUgfHwgXCJhZmZpbmVcIjtcbiAgICAgICAgbGV0IGZuTmFtZSwgZm5BZmZpbmU7XG4gICAgICAgIGxldCBzR2luLCBzR21pZCwgc0dvdXQ7XG4gICAgICAgIGlmIChncm91cE5hbWUgPT0gXCJHMVwiKSB7XG4gICAgICAgICAgICBpZiAoaW5UeXBlID09IFwiamFjb2JpYW5cIikge1xuICAgICAgICAgICAgICAgIHNHaW4gPSBHLkYubjgqMztcbiAgICAgICAgICAgICAgICBmbk5hbWUgPSBcImcxbV9iYXRjaEFwcGx5S2V5XCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNHaW4gPSBHLkYubjgqMjtcbiAgICAgICAgICAgICAgICBmbk5hbWUgPSBcImcxbV9iYXRjaEFwcGx5S2V5TWl4ZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNHbWlkID0gRy5GLm44KjM7XG4gICAgICAgICAgICBpZiAob3V0VHlwZSA9PSBcImphY29iaWFuXCIpIHtcbiAgICAgICAgICAgICAgICBzR291dCA9IEcuRi5uOCozO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbkFmZmluZSA9IFwiZzFtX2JhdGNoVG9BZmZpbmVcIjtcbiAgICAgICAgICAgICAgICBzR291dCA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSA9PSBcIkcyXCIpIHtcbiAgICAgICAgICAgIGlmIChpblR5cGUgPT0gXCJqYWNvYmlhblwiKSB7XG4gICAgICAgICAgICAgICAgc0dpbiA9IEcuRi5uOCozO1xuICAgICAgICAgICAgICAgIGZuTmFtZSA9IFwiZzJtX2JhdGNoQXBwbHlLZXlcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc0dpbiA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgICAgIGZuTmFtZSA9IFwiZzJtX2JhdGNoQXBwbHlLZXlNaXhlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc0dtaWQgPSBHLkYubjgqMztcbiAgICAgICAgICAgIGlmIChvdXRUeXBlID09IFwiamFjb2JpYW5cIikge1xuICAgICAgICAgICAgICAgIHNHb3V0ID0gRy5GLm44KjM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZuQWZmaW5lID0gXCJnMm1fYmF0Y2hUb0FmZmluZVwiO1xuICAgICAgICAgICAgICAgIHNHb3V0ID0gRy5GLm44KjI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lID09IFwiRnJcIikge1xuICAgICAgICAgICAgZm5OYW1lID0gXCJmcm1fYmF0Y2hBcHBseUtleVwiO1xuICAgICAgICAgICAgc0dpbiA9IEcubjg7XG4gICAgICAgICAgICBzR21pZCA9IEcubjg7XG4gICAgICAgICAgICBzR291dCA9IEcubjg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGdyb3VwOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZi5ieXRlTGVuZ3RoIC8gc0dpbik7XG4gICAgICAgIGNvbnN0IHBvaW50c1BlckNodW5rID0gTWF0aC5mbG9vcihuUG9pbnRzL3RtLmNvbmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKHByb2dyZXNzKSB7XG4gICAgICAgICAgICB0bS5wcm9ncmVzc0NhbGxiYWNrID0gcHJvZ3Jlc3MucHJvZ3Jlc3NDYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcFByb21pc2VzID0gW107XG4gICAgICAgIGluYyA9IEZyLmUoaW5jKTtcbiAgICAgICAgbGV0IHQgPSBGci5lKGZpcnN0KTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRtLmNvbmN1cnJlbmN5OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuO1xuICAgICAgICAgICAgaWYgKGk8IHRtLmNvbmN1cnJlbmN5LTEpIHtcbiAgICAgICAgICAgICAgICBuID0gcG9pbnRzUGVyQ2h1bms7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4gPSBuUG9pbnRzIC0gaSpwb2ludHNQZXJDaHVuaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuPT0wKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgdGFzayA9IFtdO1xuXG4gICAgICAgICAgICB0YXNrLnB1c2goe1xuICAgICAgICAgICAgICAgIGNtZDogXCJBTExPQ1NFVFwiLFxuICAgICAgICAgICAgICAgIHZhcjogMCxcbiAgICAgICAgICAgICAgICBidWZmOiBidWZmLnNsaWNlKGkqcG9pbnRzUGVyQ2h1bmsqc0dpbiwgaSpwb2ludHNQZXJDaHVuaypzR2luICsgbipzR2luKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1NFVFwiLCB2YXI6IDEsIGJ1ZmY6IHR9KTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMiwgYnVmZjogaW5jfSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1wiLCB2YXI6IDMsIGxlbjogbipNYXRoLm1heChzR21pZCwgc0dvdXQpfSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe1xuICAgICAgICAgICAgICAgIGNtZDogXCJDQUxMXCIsXG4gICAgICAgICAgICAgICAgZm5OYW1lOiBmbk5hbWUsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBbXG4gICAgICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgICAgICB7dmFsOiBufSxcbiAgICAgICAgICAgICAgICAgICAge3ZhcjogMX0sXG4gICAgICAgICAgICAgICAgICAgIHt2YXI6IDJ9LFxuICAgICAgICAgICAgICAgICAgICB7dmFyOjN9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZm5BZmZpbmUpIHtcbiAgICAgICAgICAgICAgICB0YXNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjbWQ6IFwiQ0FMTFwiLFxuICAgICAgICAgICAgICAgICAgICBmbk5hbWU6IGZuQWZmaW5lLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YXI6IDN9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhbDogbn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAzfSxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMCwgdmFyOiAzLCBsZW46IG4qc0dvdXR9KTtcblxuICAgICAgICAgICAgb3BQcm9taXNlcy5wdXNoKHRtLnF1ZXVlQWN0aW9uKHRhc2spKTtcbiAgICAgICAgICAgIHQgPSBGci5tdWwodCwgRnIuZXhwKGluYywgbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5hbGwob3BQcm9taXNlcyk7XG5cbiAgICAgICAgaWYgKHByb2dyZXNzLnByb2dyZXNzQ2FsbGJhY2spIHByb2dyZXNzLnByb2dyZXNzQ2FsbGJhY2soe3R5cGU6IFwiZW5kLWNodW5rXCIsIGNvdW50OiBuUG9pbnRzfSk7XG5cbiAgICAgICAgbGV0IG91dEJ1ZmY7XG4gICAgICAgIGlmIChidWZmIGluc3RhbmNlb2YgQmlnQnVmZmVyKSB7XG4gICAgICAgICAgICBvdXRCdWZmID0gbmV3IEJpZ0J1ZmZlcihuUG9pbnRzKnNHb3V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dEJ1ZmYgPSBuZXcgVWludDhBcnJheShuUG9pbnRzKnNHb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwPTA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxyZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG91dEJ1ZmYuc2V0KHJlc3VsdFtpXVswXSwgcCk7XG4gICAgICAgICAgICBwICs9IHJlc3VsdFtpXVswXS5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dEJ1ZmY7XG4gICAgfTtcbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRQYWlyaW5nKGN1cnZlKSB7XG4gICAgY29uc3QgdG0gPSBjdXJ2ZS50bTtcbiAgICBjdXJ2ZS5wYWlyaW5nID0gZnVuY3Rpb24gcGFpcmluZyhhLCBiKSB7XG5cbiAgICAgICAgdG0uc3RhcnRTeW5jT3AoKTtcbiAgICAgICAgY29uc3QgcEEgPSB0bS5hbGxvY0J1ZmYoY3VydmUuRzEudG9KYWNvYmlhbihhKSk7XG4gICAgICAgIGNvbnN0IHBCID0gdG0uYWxsb2NCdWZmKGN1cnZlLkcyLnRvSmFjb2JpYW4oYikpO1xuICAgICAgICBjb25zdCBwUmVzID0gdG0uYWxsb2MoY3VydmUuR3QubjgpO1xuICAgICAgICB0bS5pbnN0YW5jZS5leHBvcnRzW2N1cnZlLm5hbWUgKyBcIl9wYWlyaW5nXCJdKHBBLCBwQiwgcFJlcyk7XG5cbiAgICAgICAgY29uc3QgcmVzID0gdG0uZ2V0QnVmZihwUmVzLCBjdXJ2ZS5HdC5uOCk7XG5cbiAgICAgICAgdG0uZW5kU3luY09wKCk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcblxuICAgIGN1cnZlLnBhaXJpbmdFcSA9IGFzeW5jIGZ1bmN0aW9uIHBhaXJpbmdFcSgpIHtcbiAgICAgICAgbGV0ICBidWZmQ3Q7XG4gICAgICAgIGxldCBuRXFzO1xuICAgICAgICBpZiAoKGFyZ3VtZW50cy5sZW5ndGggJSAyKSA9PSAxKSB7XG4gICAgICAgICAgICBidWZmQ3QgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIG5FcXMgPSAoYXJndW1lbnRzLmxlbmd0aCAtMSkgLzI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWZmQ3QgPSBjdXJ2ZS5HdC5vbmU7XG4gICAgICAgICAgICBuRXFzID0gYXJndW1lbnRzLmxlbmd0aCAvMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9wUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPG5FcXM7IGkrKykge1xuXG4gICAgICAgICAgICBjb25zdCB0YXNrID0gW107XG5cbiAgICAgICAgICAgIGNvbnN0IGcxQnVmZiA9IGN1cnZlLkcxLnRvSmFjb2JpYW4oYXJndW1lbnRzW2kqMl0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAwLCBidWZmOiBnMUJ1ZmZ9KTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DXCIsIHZhcjogMSwgbGVuOiBjdXJ2ZS5wcmVQU2l6ZX0pO1xuXG4gICAgICAgICAgICBjb25zdCBnMkJ1ZmYgPSBjdXJ2ZS5HMi50b0phY29iaWFuKGFyZ3VtZW50c1tpKjIgKzFdKTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMiwgYnVmZjogZzJCdWZmfSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1wiLCB2YXI6IDMsIGxlbjogY3VydmUucHJlUVNpemV9KTtcblxuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NcIiwgdmFyOiA0LCBsZW46IGN1cnZlLkd0Lm44fSk7XG5cbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBjdXJ2ZS5uYW1lICsgXCJfcHJlcGFyZUcxXCIsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgIHt2YXI6IDF9XG4gICAgICAgICAgICBdfSk7XG5cbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBjdXJ2ZS5uYW1lICsgXCJfcHJlcGFyZUcyXCIsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgIHt2YXI6IDJ9LFxuICAgICAgICAgICAgICAgIHt2YXI6IDN9XG4gICAgICAgICAgICBdfSk7XG5cbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBjdXJ2ZS5uYW1lICsgXCJfbWlsbGVyTG9vcFwiLCBwYXJhbXM6IFtcbiAgICAgICAgICAgICAgICB7dmFyOiAxfSxcbiAgICAgICAgICAgICAgICB7dmFyOiAzfSxcbiAgICAgICAgICAgICAgICB7dmFyOiA0fVxuICAgICAgICAgICAgXX0pO1xuXG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJHRVRcIiwgb3V0OiAwLCB2YXI6IDQsIGxlbjogY3VydmUuR3Qubjh9KTtcblxuICAgICAgICAgICAgb3BQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgIHRtLnF1ZXVlQWN0aW9uKHRhc2spXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBQcm9taXNlLmFsbChvcFByb21pc2VzKTtcblxuICAgICAgICB0bS5zdGFydFN5bmNPcCgpO1xuICAgICAgICBjb25zdCBwUmVzID0gdG0uYWxsb2MoY3VydmUuR3QubjgpO1xuICAgICAgICB0bS5pbnN0YW5jZS5leHBvcnRzLmZ0bV9vbmUocFJlcyk7XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcE1SID0gdG0uYWxsb2NCdWZmKHJlc3VsdFtpXVswXSk7XG4gICAgICAgICAgICB0bS5pbnN0YW5jZS5leHBvcnRzLmZ0bV9tdWwocFJlcywgcE1SLCBwUmVzKTtcbiAgICAgICAgfVxuICAgICAgICB0bS5pbnN0YW5jZS5leHBvcnRzW2N1cnZlLm5hbWUgKyBcIl9maW5hbEV4cG9uZW50aWF0aW9uXCJdKHBSZXMsIHBSZXMpO1xuXG4gICAgICAgIGNvbnN0IHBDdCA9IHRtLmFsbG9jQnVmZihidWZmQ3QpO1xuXG4gICAgICAgIGNvbnN0IHIgPSAhIXRtLmluc3RhbmNlLmV4cG9ydHMuZnRtX2VxKHBSZXMsIHBDdCk7XG5cbiAgICAgICAgdG0uZW5kU3luY09wKCk7XG5cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfTtcblxuICAgIGN1cnZlLnByZXBhcmVHMSA9IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgdGhpcy50bS5zdGFydFN5bmNPcCgpO1xuICAgICAgICBjb25zdCBwUCA9IHRoaXMudG0uYWxsb2NCdWZmKHApO1xuICAgICAgICBjb25zdCBwUHJlcFAgPSB0aGlzLnRtLmFsbG9jKHRoaXMucHJlUFNpemUpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5uYW1lICsgXCJfcHJlcGFyZUcxXCJdKHBQLCBwUHJlcFApO1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnRtLmdldEJ1ZmYocFByZXBQLCB0aGlzLnByZVBTaXplKTtcbiAgICAgICAgdGhpcy50bS5lbmRTeW5jT3AoKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuXG4gICAgY3VydmUucHJlcGFyZUcyID0gZnVuY3Rpb24ocSkge1xuICAgICAgICB0aGlzLnRtLnN0YXJ0U3luY09wKCk7XG4gICAgICAgIGNvbnN0IHBRID0gdGhpcy50bS5hbGxvY0J1ZmYocSk7XG4gICAgICAgIGNvbnN0IHBQcmVwUSA9IHRoaXMudG0uYWxsb2ModGhpcy5wcmVRU2l6ZSk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLm5hbWUgKyBcIl9wcmVwYXJlRzJcIl0ocFEsIHBQcmVwUSk7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMudG0uZ2V0QnVmZihwUHJlcFEsIHRoaXMucHJlUVNpemUpO1xuICAgICAgICB0aGlzLnRtLmVuZFN5bmNPcCgpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH07XG5cbiAgICBjdXJ2ZS5taWxsZXJMb29wID0gZnVuY3Rpb24ocHJlUCwgcHJlUSkge1xuICAgICAgICB0aGlzLnRtLnN0YXJ0U3luY09wKCk7XG4gICAgICAgIGNvbnN0IHBQcmVQID0gdGhpcy50bS5hbGxvY0J1ZmYocHJlUCk7XG4gICAgICAgIGNvbnN0IHBQcmVRID0gdGhpcy50bS5hbGxvY0J1ZmYocHJlUSk7XG4gICAgICAgIGNvbnN0IHBSZXMgPSB0aGlzLnRtLmFsbG9jKHRoaXMuR3QubjgpO1xuICAgICAgICB0aGlzLnRtLmluc3RhbmNlLmV4cG9ydHNbdGhpcy5uYW1lICsgXCJfbWlsbGVyTG9vcFwiXShwUHJlUCwgcFByZVEsIHBSZXMpO1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnRtLmdldEJ1ZmYocFJlcywgdGhpcy5HdC5uOCk7XG4gICAgICAgIHRoaXMudG0uZW5kU3luY09wKCk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcblxuICAgIGN1cnZlLmZpbmFsRXhwb25lbnRpYXRpb24gPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIHRoaXMudG0uc3RhcnRTeW5jT3AoKTtcbiAgICAgICAgY29uc3QgcEEgPSB0aGlzLnRtLmFsbG9jQnVmZihhKTtcbiAgICAgICAgY29uc3QgcFJlcyA9IHRoaXMudG0uYWxsb2ModGhpcy5HdC5uOCk7XG4gICAgICAgIHRoaXMudG0uaW5zdGFuY2UuZXhwb3J0c1t0aGlzLm5hbWUgKyBcIl9maW5hbEV4cG9uZW50aWF0aW9uXCJdKHBBLCBwUmVzKTtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy50bS5nZXRCdWZmKHBSZXMsIHRoaXMuR3QubjgpO1xuICAgICAgICB0aGlzLnRtLmVuZFN5bmNPcCgpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH07XG5cbn1cbiIsImltcG9ydCB7IGxvZzIgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5jb25zdCBwVFNpemVzID0gW1xuICAgIDEgLCAgMSwgIDEsICAxLCAgICAyLCAgMywgIDQsICA1LFxuICAgIDYgLCAgNywgIDcsICA4LCAgICA5LCAxMCwgMTEsIDEyLFxuICAgIDEzLCAxMywgMTQsIDE1LCAgIDE2LCAxNiwgMTcsIDE3LFxuICAgIDE3LCAxNywgMTcsIDE3LCAgIDE3LCAxNywgMTcsIDE3XG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZE11bHRpZXhwKGN1cnZlLCBncm91cE5hbWUpIHtcbiAgICBjb25zdCBHID0gY3VydmVbZ3JvdXBOYW1lXTtcbiAgICBjb25zdCB0bSA9IEcudG07XG4gICAgYXN5bmMgZnVuY3Rpb24gX211bHRpRXhwQ2h1bmsoYnVmZkJhc2VzLCBidWZmU2NhbGFycywgaW5UeXBlLCBsb2dnZXIsIGxvZ1RleHQpIHtcbiAgICAgICAgaWYgKCAhIChidWZmQmFzZXMgaW5zdGFuY2VvZiBVaW50OEFycmF5KSApIHtcbiAgICAgICAgICAgIGlmIChsb2dnZXIpIGxvZ2dlci5lcnJvcihgJHtsb2dUZXh0fSBfbXVsdGlFeHBDaHVuayBidWZmQmFzZXMgaXMgbm90IFVpbnQ4QXJyYXlgKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtsb2dUZXh0fSBfbXVsdGlFeHBDaHVuayBidWZmQmFzZXMgaXMgbm90IFVpbnQ4QXJyYXlgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICEgKGJ1ZmZTY2FsYXJzIGluc3RhbmNlb2YgVWludDhBcnJheSkgKSB7XG4gICAgICAgICAgICBpZiAobG9nZ2VyKSBsb2dnZXIuZXJyb3IoYCR7bG9nVGV4dH0gX211bHRpRXhwQ2h1bmsgYnVmZlNjYWxhcnMgaXMgbm90IFVpbnQ4QXJyYXlgKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtsb2dUZXh0fSBfbXVsdGlFeHBDaHVuayBidWZmU2NhbGFycyBpcyBub3QgVWludDhBcnJheWApO1xuICAgICAgICB9XG4gICAgICAgIGluVHlwZSA9IGluVHlwZSB8fCBcImFmZmluZVwiO1xuXG4gICAgICAgIGxldCBzR0luO1xuICAgICAgICBsZXQgZm5OYW1lO1xuICAgICAgICBpZiAoZ3JvdXBOYW1lID09IFwiRzFcIikge1xuICAgICAgICAgICAgaWYgKGluVHlwZSA9PSBcImFmZmluZVwiKSB7XG4gICAgICAgICAgICAgICAgZm5OYW1lID0gXCJnMW1fbXVsdGlleHBBZmZpbmVfY2h1bmtcIjtcbiAgICAgICAgICAgICAgICBzR0luID0gRy5GLm44KjI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZuTmFtZSA9IFwiZzFtX211bHRpZXhwX2NodW5rXCI7XG4gICAgICAgICAgICAgICAgc0dJbiA9IEcuRi5uOCozO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSA9PSBcIkcyXCIpIHtcbiAgICAgICAgICAgIGlmIChpblR5cGUgPT0gXCJhZmZpbmVcIikge1xuICAgICAgICAgICAgICAgIGZuTmFtZSA9IFwiZzJtX211bHRpZXhwQWZmaW5lX2NodW5rXCI7XG4gICAgICAgICAgICAgICAgc0dJbiA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbk5hbWUgPSBcImcybV9tdWx0aWV4cF9jaHVua1wiO1xuICAgICAgICAgICAgICAgIHNHSW4gPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZ3JvdXBcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZkJhc2VzLmJ5dGVMZW5ndGggLyBzR0luKTtcblxuICAgICAgICBpZiAoblBvaW50cyA9PSAwKSByZXR1cm4gRy56ZXJvO1xuICAgICAgICBjb25zdCBzU2NhbGFyID0gTWF0aC5mbG9vcihidWZmU2NhbGFycy5ieXRlTGVuZ3RoIC8gblBvaW50cyk7XG4gICAgICAgIGlmKCBzU2NhbGFyICogblBvaW50cyAhPSBidWZmU2NhbGFycy5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTY2FsYXIgc2l6ZSBkb2VzIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJpdENodW5rU2l6ZSA9IHBUU2l6ZXNbbG9nMihuUG9pbnRzKV07XG4gICAgICAgIGNvbnN0IG5DaHVua3MgPSBNYXRoLmZsb29yKChzU2NhbGFyKjggLSAxKSAvIGJpdENodW5rU2l6ZSkgKzE7XG5cbiAgICAgICAgY29uc3Qgb3BQcm9taXNlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8bkNodW5rczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0YXNrID0gW1xuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAwLCBidWZmOiBidWZmQmFzZXN9LFxuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAxLCBidWZmOiBidWZmU2NhbGFyc30sXG4gICAgICAgICAgICAgICAge2NtZDogXCJBTExPQ1wiLCB2YXI6IDIsIGxlbjogRy5GLm44KjN9LFxuICAgICAgICAgICAgICAgIHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IGZuTmFtZSwgcGFyYW1zOiBbXG4gICAgICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgICAgICB7dmFyOiAxfSxcbiAgICAgICAgICAgICAgICAgICAge3ZhbDogc1NjYWxhcn0sXG4gICAgICAgICAgICAgICAgICAgIHt2YWw6IG5Qb2ludHN9LFxuICAgICAgICAgICAgICAgICAgICB7dmFsOiBpKmJpdENodW5rU2l6ZX0sXG4gICAgICAgICAgICAgICAgICAgIHt2YWw6IE1hdGgubWluKHNTY2FsYXIqOCAtIGkqYml0Q2h1bmtTaXplLCBiaXRDaHVua1NpemUpfSxcbiAgICAgICAgICAgICAgICAgICAge3ZhcjogMn1cbiAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICB7Y21kOiBcIkdFVFwiLCBvdXQ6IDAsIHZhcjogMiwgbGVuOiBHLkYubjgqM31cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBvcFByb21pc2VzLnB1c2goXG4gICAgICAgICAgICAgICAgRy50bS5xdWV1ZUFjdGlvbih0YXNrKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKG9wUHJvbWlzZXMpO1xuXG4gICAgICAgIGxldCByZXMgPSBHLnplcm87XG4gICAgICAgIGZvciAobGV0IGk9cmVzdWx0Lmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICghRy5pc1plcm8ocmVzKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxiaXRDaHVua1NpemU7IGorKykgcmVzID0gRy5kb3VibGUocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcyA9IEcuYWRkKHJlcywgcmVzdWx0W2ldWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gX211bHRpRXhwKGJ1ZmZCYXNlcywgYnVmZlNjYWxhcnMsIGluVHlwZSwgbG9nZ2VyLCBsb2dUZXh0KSB7XG4gICAgICAgIGNvbnN0IE1BWF9DSFVOS19TSVpFID0gMSA8PCAyMjtcbiAgICAgICAgY29uc3QgTUlOX0NIVU5LX1NJWkUgPSAxIDw8IDEwO1xuICAgICAgICBsZXQgc0dJbjtcblxuICAgICAgICBpZiAoZ3JvdXBOYW1lID09IFwiRzFcIikge1xuICAgICAgICAgICAgaWYgKGluVHlwZSA9PSBcImFmZmluZVwiKSB7XG4gICAgICAgICAgICAgICAgc0dJbiA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzR0luID0gRy5GLm44KjM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lID09IFwiRzJcIikge1xuICAgICAgICAgICAgaWYgKGluVHlwZSA9PSBcImFmZmluZVwiKSB7XG4gICAgICAgICAgICAgICAgc0dJbiA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzR0luID0gRy5GLm44KjM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGdyb3VwXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZkJhc2VzLmJ5dGVMZW5ndGggLyBzR0luKTtcbiAgICAgICAgY29uc3Qgc1NjYWxhciA9IE1hdGguZmxvb3IoYnVmZlNjYWxhcnMuYnl0ZUxlbmd0aCAvIG5Qb2ludHMpO1xuICAgICAgICBpZiggc1NjYWxhciAqIG5Qb2ludHMgIT0gYnVmZlNjYWxhcnMuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NhbGFyIHNpemUgZG9lcyBub3QgbWF0Y2hcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiaXRDaHVua1NpemUgPSBwVFNpemVzW2xvZzIoblBvaW50cyldO1xuICAgICAgICBjb25zdCBuQ2h1bmtzID0gTWF0aC5mbG9vcigoc1NjYWxhcio4IC0gMSkgLyBiaXRDaHVua1NpemUpICsxO1xuXG4gICAgICAgIGxldCBjaHVua1NpemU7XG4gICAgICAgIGNodW5rU2l6ZSA9IE1hdGguZmxvb3IoblBvaW50cyAvICh0bS5jb25jdXJyZW5jeSAvbkNodW5rcykpO1xuICAgICAgICBpZiAoY2h1bmtTaXplPk1BWF9DSFVOS19TSVpFKSBjaHVua1NpemUgPSBNQVhfQ0hVTktfU0laRTtcbiAgICAgICAgaWYgKGNodW5rU2l6ZTxNSU5fQ0hVTktfU0laRSkgY2h1bmtTaXplID0gTUlOX0NIVU5LX1NJWkU7XG5cbiAgICAgICAgY29uc3Qgb3BQcm9taXNlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8blBvaW50czsgaSArPSBjaHVua1NpemUpIHtcbiAgICAgICAgICAgIGlmIChsb2dnZXIpIGxvZ2dlci5kZWJ1ZyhgTXVsdGlleHAgc3RhcnQ6ICR7bG9nVGV4dH06ICR7aX0vJHtuUG9pbnRzfWApO1xuICAgICAgICAgICAgY29uc3Qgbj0gTWF0aC5taW4oblBvaW50cyAtIGksIGNodW5rU2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBidWZmQmFzZXNDaHVuayA9IGJ1ZmZCYXNlcy5zbGljZShpKnNHSW4sIChpK24pKnNHSW4pO1xuICAgICAgICAgICAgY29uc3QgYnVmZlNjYWxhcnNDaHVuayA9IGJ1ZmZTY2FsYXJzLnNsaWNlKGkqc1NjYWxhciwgKGkrbikqc1NjYWxhcik7XG4gICAgICAgICAgICBvcFByb21pc2VzLnB1c2goX211bHRpRXhwQ2h1bmsoYnVmZkJhc2VzQ2h1bmssIGJ1ZmZTY2FsYXJzQ2h1bmssIGluVHlwZSwgbG9nZ2VyLCBsb2dUZXh0KS50aGVuKCAocikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsb2dnZXIpIGxvZ2dlci5kZWJ1ZyhgTXVsdGlleHAgZW5kOiAke2xvZ1RleHR9OiAke2l9LyR7blBvaW50c31gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKG9wUHJvbWlzZXMpO1xuXG4gICAgICAgIGxldCByZXMgPSBHLnplcm87XG4gICAgICAgIGZvciAobGV0IGk9cmVzdWx0Lmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICAgIHJlcyA9IEcuYWRkKHJlcywgcmVzdWx0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgRy5tdWx0aUV4cCA9IGFzeW5jIGZ1bmN0aW9uIG11bHRpRXhwQWZmaW5lKGJ1ZmZCYXNlcywgYnVmZlNjYWxhcnMsIGxvZ2dlciwgbG9nVGV4dCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgX211bHRpRXhwKGJ1ZmZCYXNlcywgYnVmZlNjYWxhcnMsIFwiamFjb2JpYW5cIiwgbG9nZ2VyLCBsb2dUZXh0KTtcbiAgICB9O1xuICAgIEcubXVsdGlFeHBBZmZpbmUgPSBhc3luYyBmdW5jdGlvbiBtdWx0aUV4cEFmZmluZShidWZmQmFzZXMsIGJ1ZmZTY2FsYXJzLCBsb2dnZXIsIGxvZ1RleHQpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IF9tdWx0aUV4cChidWZmQmFzZXMsIGJ1ZmZTY2FsYXJzLCBcImFmZmluZVwiLCBsb2dnZXIsIGxvZ1RleHQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQge2xvZzIsIGJ1ZmZSZXZlcnNlQml0c30gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmltcG9ydCBCaWdCdWZmZXIgZnJvbSBcIi4vYmlnYnVmZmVyLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkRkZUKGN1cnZlLCBncm91cE5hbWUpIHtcbiAgICBjb25zdCBHID0gY3VydmVbZ3JvdXBOYW1lXTtcbiAgICBjb25zdCBGciA9IGN1cnZlLkZyO1xuICAgIGNvbnN0IHRtID0gRy50bTtcbiAgICBhc3luYyBmdW5jdGlvbiBfZmZ0KGJ1ZmYsIGludmVyc2UsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpIHtcblxuICAgICAgICBpblR5cGUgPSBpblR5cGUgfHwgXCJhZmZpbmVcIjtcbiAgICAgICAgb3V0VHlwZSA9IG91dFR5cGUgfHwgXCJhZmZpbmVcIjtcbiAgICAgICAgY29uc3QgTUFYX0JJVFNfVEhSRUFEID0gMTQ7XG5cbiAgICAgICAgbGV0IHNJbiwgc01pZCwgc091dCwgZm5JbjJNaWQsIGZuTWlkMk91dCwgZm5GRlRNaXgsIGZuRkZUSm9pbiwgZm5GRlRGaW5hbDtcbiAgICAgICAgaWYgKGdyb3VwTmFtZSA9PSBcIkcxXCIpIHtcbiAgICAgICAgICAgIGlmIChpblR5cGUgPT0gXCJhZmZpbmVcIikge1xuICAgICAgICAgICAgICAgIHNJbiA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgICAgIGZuSW4yTWlkID0gXCJnMW1fYmF0Y2hUb0phY29iaWFuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNJbiA9IEcuRi5uOCozO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc01pZCA9IEcuRi5uOCozO1xuICAgICAgICAgICAgaWYgKGludmVyc2UpIHtcbiAgICAgICAgICAgICAgICBmbkZGVEZpbmFsID0gXCJnMW1fZmZ0RmluYWxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZuRkZUSm9pbiA9IFwiZzFtX2ZmdEpvaW5cIjtcbiAgICAgICAgICAgIGZuRkZUTWl4ID0gXCJnMW1fZmZ0TWl4XCI7XG5cbiAgICAgICAgICAgIGlmIChvdXRUeXBlID09IFwiYWZmaW5lXCIpIHtcbiAgICAgICAgICAgICAgICBzT3V0ID0gRy5GLm44KjI7XG4gICAgICAgICAgICAgICAgZm5NaWQyT3V0ID0gXCJnMW1fYmF0Y2hUb0FmZmluZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzT3V0ID0gRy5GLm44KjM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgPT0gXCJHMlwiKSB7XG4gICAgICAgICAgICBpZiAoaW5UeXBlID09IFwiYWZmaW5lXCIpIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMjtcbiAgICAgICAgICAgICAgICBmbkluMk1pZCA9IFwiZzJtX2JhdGNoVG9KYWNvYmlhblwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNNaWQgPSBHLkYubjgqMztcbiAgICAgICAgICAgIGlmIChpbnZlcnNlKSB7XG4gICAgICAgICAgICAgICAgZm5GRlRGaW5hbCA9IFwiZzJtX2ZmdEZpbmFsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbkZGVEpvaW4gPSBcImcybV9mZnRKb2luXCI7XG4gICAgICAgICAgICBmbkZGVE1peCA9IFwiZzJtX2ZmdE1peFwiO1xuICAgICAgICAgICAgaWYgKG91dFR5cGUgPT0gXCJhZmZpbmVcIikge1xuICAgICAgICAgICAgICAgIHNPdXQgPSBHLkYubjgqMjtcbiAgICAgICAgICAgICAgICBmbk1pZDJPdXQgPSBcImcybV9iYXRjaFRvQWZmaW5lXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNPdXQgPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgPT0gXCJGclwiKSB7XG4gICAgICAgICAgICBzSW4gPSBHLm44O1xuICAgICAgICAgICAgc01pZCA9IEcubjg7XG4gICAgICAgICAgICBzT3V0ID0gRy5uODtcbiAgICAgICAgICAgIGlmIChpbnZlcnNlKSB7XG4gICAgICAgICAgICAgICAgZm5GRlRGaW5hbCA9IFwiZnJtX2ZmdEZpbmFsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbkZGVE1peCA9IFwiZnJtX2ZmdE1peFwiO1xuICAgICAgICAgICAgZm5GRlRKb2luID0gXCJmcm1fZmZ0Sm9pblwiO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgcmV0dXJuQXJyYXkgPSBmYWxzZTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVmZikpIHtcbiAgICAgICAgICAgIGJ1ZmYgPSBjdXJ2ZS5hcnJheTJidWZmZXIoYnVmZiwgc0luKTtcbiAgICAgICAgICAgIHJldHVybkFycmF5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1ZmYgPSBidWZmLnNsaWNlKDAsIGJ1ZmYuYnl0ZUxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuUG9pbnRzID0gYnVmZi5ieXRlTGVuZ3RoIC8gc0luO1xuICAgICAgICBjb25zdCBiaXRzID0gbG9nMihuUG9pbnRzKTtcblxuICAgICAgICBpZiAgKCgxIDw8IGJpdHMpICE9IG5Qb2ludHMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImZmdCBtdXN0IGJlIG11bHRpcGxlIG9mIDJcIiApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpdHMgPT0gRnIucyArMSkge1xuICAgICAgICAgICAgbGV0IGJ1ZmZPdXQ7XG5cbiAgICAgICAgICAgIGlmIChpbnZlcnNlKSB7XG4gICAgICAgICAgICAgICAgYnVmZk91dCA9ICBhd2FpdCBfZmZ0RXh0SW52KGJ1ZmYsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidWZmT3V0ID0gIGF3YWl0IF9mZnRFeHQoYnVmZiwgaW5UeXBlLCBvdXRUeXBlLCBsb2dnZXIsIGxvZ2dlclR4dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXR1cm5BcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJ2ZS5idWZmZXIyYXJyYXkoYnVmZk91dCwgc091dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWZmT3V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGludjtcbiAgICAgICAgaWYgKGludmVyc2UpIHtcbiAgICAgICAgICAgIGludiA9IEZyLmludihGci5lKG5Qb2ludHMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBidWZmT3V0O1xuXG4gICAgICAgIGJ1ZmZSZXZlcnNlQml0cyhidWZmLCBzSW4pO1xuXG4gICAgICAgIGxldCBjaHVua3M7XG4gICAgICAgIGxldCBwb2ludHNJbkNodW5rID0gTWF0aC5taW4oMSA8PCBNQVhfQklUU19USFJFQUQsIG5Qb2ludHMpO1xuICAgICAgICBsZXQgbkNodW5rcyA9IG5Qb2ludHMgLyBwb2ludHNJbkNodW5rO1xuXG4gICAgICAgIHdoaWxlICgobkNodW5rcyA8IHRtLmNvbmN1cnJlbmN5KSYmKHBvaW50c0luQ2h1bms+PTE2KSkge1xuICAgICAgICAgICAgbkNodW5rcyAqPSAyO1xuICAgICAgICAgICAgcG9pbnRzSW5DaHVuayAvPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbDJDaHVuayA9IGxvZzIocG9pbnRzSW5DaHVuayk7XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8IG5DaHVua3M7IGkrKykge1xuICAgICAgICAgICAgaWYgKGxvZ2dlcikgbG9nZ2VyLmRlYnVnKGAke2xvZ2dlclR4dH06IGZmdCAke2JpdHN9IG1peCBzdGFydDogJHtpfS8ke25DaHVua3N9YCk7XG4gICAgICAgICAgICBjb25zdCB0YXNrID0gW107XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1wiLCB2YXI6IDAsIGxlbjogc01pZCpwb2ludHNJbkNodW5rfSk7XG4gICAgICAgICAgICBjb25zdCBidWZmQ2h1bmsgPSBidWZmLnNsaWNlKCAocG9pbnRzSW5DaHVuayAqIGkpKnNJbiwgKHBvaW50c0luQ2h1bmsgKiAoaSsxKSkqc0luKTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIlNFVFwiLCB2YXI6IDAsIGJ1ZmY6IGJ1ZmZDaHVua30pO1xuICAgICAgICAgICAgaWYgKGZuSW4yTWlkKSB7XG4gICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6Zm5JbjJNaWQsIHBhcmFtczogW3t2YXI6MH0sIHt2YWw6IHBvaW50c0luQ2h1bmt9LCB7dmFyOiAwfV19KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGo9MTsgajw9bDJDaHVuaztqKyspIHtcbiAgICAgICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJDQUxMXCIsIGZuTmFtZTpmbkZGVE1peCwgcGFyYW1zOiBbe3ZhcjowfSwge3ZhbDogcG9pbnRzSW5DaHVua30sIHt2YWw6IGp9XX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobDJDaHVuaz09Yml0cykge1xuICAgICAgICAgICAgICAgIGlmIChmbkZGVEZpbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMSwgYnVmZjogaW52fSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBmbkZGVEZpbmFsLCAgcGFyYW1zOltcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhbDogcG9pbnRzSW5DaHVua30sXG4gICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAxfSxcbiAgICAgICAgICAgICAgICAgICAgXX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZm5NaWQyT3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOmZuTWlkMk91dCwgcGFyYW1zOiBbe3ZhcjowfSwge3ZhbDogcG9pbnRzSW5DaHVua30sIHt2YXI6IDB9XX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJHRVRcIiwgb3V0OiAwLCB2YXI6IDAsIGxlbjogcG9pbnRzSW5DaHVuaypzT3V0fSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkdFVFwiLCBvdXQ6MCwgdmFyOiAwLCBsZW46IHNNaWQqcG9pbnRzSW5DaHVua30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh0bS5xdWV1ZUFjdGlvbih0YXNrKS50aGVuKCAocikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsb2dnZXIpIGxvZ2dlci5kZWJ1ZyhgJHtsb2dnZXJUeHR9OiBmZnQgJHtiaXRzfSBtaXggZW5kOiAke2l9LyR7bkNodW5rc31gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNodW5rcyA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8IG5DaHVua3M7IGkrKykgY2h1bmtzW2ldID0gY2h1bmtzW2ldWzBdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBsMkNodW5rKzE7ICAgaTw9Yml0czsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobG9nZ2VyKSBsb2dnZXIuZGVidWcoYCR7bG9nZ2VyVHh0fTogZmZ0ICAke2JpdHN9ICBqb2luOiAke2l9LyR7Yml0c31gKTtcbiAgICAgICAgICAgIGNvbnN0IG5Hcm91cHMgPSAxIDw8IChiaXRzIC0gaSk7XG4gICAgICAgICAgICBjb25zdCBuQ2h1bmtzUGVyR3JvdXAgPSBuQ2h1bmtzIC8gbkdyb3VwcztcbiAgICAgICAgICAgIGNvbnN0IG9wUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxuR3JvdXBzOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrPTA7IGsgPG5DaHVua3NQZXJHcm91cC8yOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBGci5leHAoIEZyLndbaV0sIGsqcG9pbnRzSW5DaHVuayk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluYyA9IEZyLndbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xID0gaipuQ2h1bmtzUGVyR3JvdXAgKyBrO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvMiA9IGoqbkNodW5rc1Blckdyb3VwICsgayArIG5DaHVua3NQZXJHcm91cC8yO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAwLCBidWZmOiBjaHVua3NbbzFdfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMSwgYnVmZjogY2h1bmtzW28yXX0pO1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1NFVFwiLCB2YXI6IDIsIGJ1ZmY6IGZpcnN0fSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMywgYnVmZjogaW5jfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBmbkZGVEpvaW4sICBwYXJhbXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAge3ZhcjogMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAxfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YWw6IHBvaW50c0luQ2h1bmt9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhcjogMn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAzfVxuICAgICAgICAgICAgICAgICAgICBdfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpPT1iaXRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm5GRlRGaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogNCwgYnVmZjogaW52fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IGZuRkZURmluYWwsICBwYXJhbXM6W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3ZhbDogcG9pbnRzSW5DaHVua30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2YXI6IDR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJDQUxMXCIsIGZuTmFtZTogZm5GRlRGaW5hbCwgIHBhcmFtczpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2YXI6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dmFsOiBwb2ludHNJbkNodW5rfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3ZhcjogNH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZuTWlkMk91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOmZuTWlkMk91dCwgcGFyYW1zOiBbe3ZhcjowfSwge3ZhbDogcG9pbnRzSW5DaHVua30sIHt2YXI6IDB9XX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOmZuTWlkMk91dCwgcGFyYW1zOiBbe3ZhcjoxfSwge3ZhbDogcG9pbnRzSW5DaHVua30sIHt2YXI6IDF9XX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMCwgdmFyOiAwLCBsZW46IHBvaW50c0luQ2h1bmsqc091dH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMSwgdmFyOiAxLCBsZW46IHBvaW50c0luQ2h1bmsqc091dH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMCwgdmFyOiAwLCBsZW46IHBvaW50c0luQ2h1bmsqc01pZH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMSwgdmFyOiAxLCBsZW46IHBvaW50c0luQ2h1bmsqc01pZH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wUHJvbWlzZXMucHVzaCh0bS5xdWV1ZUFjdGlvbih0YXNrKS50aGVuKCAocikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2dlcikgbG9nZ2VyLmRlYnVnKGAke2xvZ2dlclR4dH06IGZmdCAke2JpdHN9IGpvaW4gICR7aX0vJHtiaXRzfSAgJHtqKzF9LyR7bkdyb3Vwc30gJHtrfS8ke25DaHVua3NQZXJHcm91cC8yfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IFByb21pc2UuYWxsKG9wUHJvbWlzZXMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPG5Hcm91cHM7IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8bkNodW5rc1Blckdyb3VwLzI7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvMSA9IGoqbkNodW5rc1Blckdyb3VwICsgaztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzIgPSBqKm5DaHVua3NQZXJHcm91cCArIGsgKyBuQ2h1bmtzUGVyR3JvdXAvMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzQ2h1bmsgPSByZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtzW28xXSA9IHJlc0NodW5rWzBdO1xuICAgICAgICAgICAgICAgICAgICBjaHVua3NbbzJdID0gcmVzQ2h1bmtbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ1ZmYgaW5zdGFuY2VvZiBCaWdCdWZmZXIpIHtcbiAgICAgICAgICAgIGJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKG5Qb2ludHMqc091dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWZmT3V0ID0gbmV3IFVpbnQ4QXJyYXkoblBvaW50cypzT3V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW52ZXJzZSkge1xuICAgICAgICAgICAgYnVmZk91dC5zZXQoY2h1bmtzWzBdLnNsaWNlKChwb2ludHNJbkNodW5rLTEpKnNPdXQpKTtcbiAgICAgICAgICAgIGxldCBwPSBzT3V0O1xuICAgICAgICAgICAgZm9yIChsZXQgaT1uQ2h1bmtzLTE7IGk+MDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgYnVmZk91dC5zZXQoY2h1bmtzW2ldLCBwKTtcbiAgICAgICAgICAgICAgICBwICs9IHBvaW50c0luQ2h1bmsqc091dDtcbiAgICAgICAgICAgICAgICBkZWxldGUgY2h1bmtzW2ldOyAgLy8gTGliZXJhdGUgbWVtXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWZmT3V0LnNldChjaHVua3NbMF0uc2xpY2UoMCwgKHBvaW50c0luQ2h1bmstMSkqc091dCksIHApO1xuICAgICAgICAgICAgZGVsZXRlIGNodW5rc1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTxuQ2h1bmtzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBidWZmT3V0LnNldChjaHVua3NbaV0sIHBvaW50c0luQ2h1bmsqc091dCppKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgY2h1bmtzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybkFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VydmUuYnVmZmVyMmFycmF5KGJ1ZmZPdXQsIHNPdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZPdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBfZmZ0RXh0KGJ1ZmYsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpIHtcbiAgICAgICAgbGV0IGIxLCBiMjtcbiAgICAgICAgYjEgPSBidWZmLnNsaWNlKCAwICwgYnVmZi5ieXRlTGVuZ3RoLzIpO1xuICAgICAgICBiMiA9IGJ1ZmYuc2xpY2UoIGJ1ZmYuYnl0ZUxlbmd0aC8yLCBidWZmLmJ5dGVMZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICAgICAgW2IxLCBiMl0gPSBhd2FpdCBfZmZ0Sm9pbkV4dChiMSwgYjIsIFwiZmZ0Sm9pbkV4dFwiLCBGci5vbmUsIEZyLnNoaWZ0LCBpblR5cGUsIFwiamFjb2JpYW5cIiwgbG9nZ2VyLCBsb2dnZXJUeHQpO1xuXG4gICAgICAgIHByb21pc2VzLnB1c2goIF9mZnQoYjEsIGZhbHNlLCBcImphY29iaWFuXCIsIG91dFR5cGUsIGxvZ2dlciwgbG9nZ2VyVHh0KSk7XG4gICAgICAgIHByb21pc2VzLnB1c2goIF9mZnQoYjIsIGZhbHNlLCBcImphY29iaWFuXCIsIG91dFR5cGUsIGxvZ2dlciwgbG9nZ2VyVHh0KSk7XG5cbiAgICAgICAgY29uc3QgcmVzMSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcblxuICAgICAgICBsZXQgYnVmZk91dDtcbiAgICAgICAgaWYgKHJlczFbMF0uYnl0ZUxlbmd0aCA+ICgxPDwyOCkpIHtcbiAgICAgICAgICAgIGJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKHJlczFbMF0uYnl0ZUxlbmd0aCoyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1ZmZPdXQgPSBuZXcgVWludDhBcnJheShyZXMxWzBdLmJ5dGVMZW5ndGgqMik7XG4gICAgICAgIH1cblxuICAgICAgICBidWZmT3V0LnNldChyZXMxWzBdKTtcbiAgICAgICAgYnVmZk91dC5zZXQocmVzMVsxXSwgcmVzMVswXS5ieXRlTGVuZ3RoKTtcblxuICAgICAgICByZXR1cm4gYnVmZk91dDtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBfZmZ0RXh0SW52KGJ1ZmYsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpIHtcbiAgICAgICAgbGV0IGIxLCBiMjtcbiAgICAgICAgYjEgPSBidWZmLnNsaWNlKCAwICwgYnVmZi5ieXRlTGVuZ3RoLzIpO1xuICAgICAgICBiMiA9IGJ1ZmYuc2xpY2UoIGJ1ZmYuYnl0ZUxlbmd0aC8yLCBidWZmLmJ5dGVMZW5ndGgpO1xuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICAgICAgcHJvbWlzZXMucHVzaCggX2ZmdChiMSwgdHJ1ZSwgaW5UeXBlLCBcImphY29iaWFuXCIsIGxvZ2dlciwgbG9nZ2VyVHh0KSk7XG4gICAgICAgIHByb21pc2VzLnB1c2goIF9mZnQoYjIsIHRydWUsIGluVHlwZSwgXCJqYWNvYmlhblwiLCBsb2dnZXIsIGxvZ2dlclR4dCkpO1xuXG4gICAgICAgIFtiMSwgYjJdID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXG4gICAgICAgIGNvbnN0IHJlczEgPSBhd2FpdCBfZmZ0Sm9pbkV4dChiMSwgYjIsIFwiZmZ0Sm9pbkV4dEludlwiLCBGci5vbmUsIEZyLnNoaWZ0SW52LCBcImphY29iaWFuXCIsIG91dFR5cGUsIGxvZ2dlciwgbG9nZ2VyVHh0KTtcblxuICAgICAgICBsZXQgYnVmZk91dDtcbiAgICAgICAgaWYgKHJlczFbMF0uYnl0ZUxlbmd0aCA+ICgxPDwyOCkpIHtcbiAgICAgICAgICAgIGJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKHJlczFbMF0uYnl0ZUxlbmd0aCoyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1ZmZPdXQgPSBuZXcgVWludDhBcnJheShyZXMxWzBdLmJ5dGVMZW5ndGgqMik7XG4gICAgICAgIH1cblxuICAgICAgICBidWZmT3V0LnNldChyZXMxWzBdKTtcbiAgICAgICAgYnVmZk91dC5zZXQocmVzMVsxXSwgcmVzMVswXS5ieXRlTGVuZ3RoKTtcblxuICAgICAgICByZXR1cm4gYnVmZk91dDtcbiAgICB9XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIF9mZnRKb2luRXh0KGJ1ZmYxLCBidWZmMiwgZm4sIGZpcnN0LCBpbmMsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpIHtcbiAgICAgICAgY29uc3QgTUFYX0NIVU5LX1NJWkUgPSAxPDwxNjtcbiAgICAgICAgY29uc3QgTUlOX0NIVU5LX1NJWkUgPSAxPDw0O1xuXG4gICAgICAgIGxldCBmbk5hbWU7XG4gICAgICAgIGxldCBmbkluMk1pZCwgZm5NaWQyT3V0O1xuICAgICAgICBsZXQgc091dCwgc0luLCBzTWlkO1xuXG4gICAgICAgIGlmIChncm91cE5hbWUgPT0gXCJHMVwiKSB7XG4gICAgICAgICAgICBpZiAoaW5UeXBlID09IFwiYWZmaW5lXCIpIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMjtcbiAgICAgICAgICAgICAgICBmbkluMk1pZCA9IFwiZzFtX2JhdGNoVG9KYWNvYmlhblwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNNaWQgPSBHLkYubjgqMztcbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZzFtX1wiK2ZuO1xuICAgICAgICAgICAgaWYgKG91dFR5cGUgPT0gXCJhZmZpbmVcIikge1xuICAgICAgICAgICAgICAgIGZuTWlkMk91dCA9IFwiZzFtX2JhdGNoVG9BZmZpbmVcIjtcbiAgICAgICAgICAgICAgICBzT3V0ID0gRy5GLm44KjI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNPdXQgPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgPT0gXCJHMlwiKSB7XG4gICAgICAgICAgICBpZiAoaW5UeXBlID09IFwiYWZmaW5lXCIpIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMjtcbiAgICAgICAgICAgICAgICBmbkluMk1pZCA9IFwiZzJtX2JhdGNoVG9KYWNvYmlhblwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZzJtX1wiK2ZuO1xuICAgICAgICAgICAgc01pZCA9IEcuRi5uOCozO1xuICAgICAgICAgICAgaWYgKG91dFR5cGUgPT0gXCJhZmZpbmVcIikge1xuICAgICAgICAgICAgICAgIGZuTWlkMk91dCA9IFwiZzJtX2JhdGNoVG9BZmZpbmVcIjtcbiAgICAgICAgICAgICAgICBzT3V0ID0gRy5GLm44KjI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNPdXQgPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgPT0gXCJGclwiKSB7XG4gICAgICAgICAgICBzSW4gPSBGci5uODtcbiAgICAgICAgICAgIHNPdXQgPSBGci5uODtcbiAgICAgICAgICAgIHNNaWQgPSBGci5uODtcbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZnJtX1wiICsgZm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGdyb3VwXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ1ZmYxLmJ5dGVMZW5ndGggIT0gYnVmZjIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBidWZmZXIgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuUG9pbnRzID0gTWF0aC5mbG9vcihidWZmMS5ieXRlTGVuZ3RoIC8gc0luKTtcbiAgICAgICAgaWYgKG5Qb2ludHMgIT0gMSA8PCBsb2cyKG5Qb2ludHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG51bWJlciBvZiBwb2ludHNcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2h1bmtTaXplID0gTWF0aC5mbG9vcihuUG9pbnRzIC90bS5jb25jdXJyZW5jeSk7XG4gICAgICAgIGlmIChjaHVua1NpemUgPCBNSU5fQ0hVTktfU0laRSkgY2h1bmtTaXplID0gTUlOX0NIVU5LX1NJWkU7XG4gICAgICAgIGlmIChjaHVua1NpemUgPiBNQVhfQ0hVTktfU0laRSkgY2h1bmtTaXplID0gTUFYX0NIVU5LX1NJWkU7XG5cbiAgICAgICAgY29uc3Qgb3BQcm9taXNlcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxuUG9pbnRzOyBpICs9IGNodW5rU2l6ZSkge1xuICAgICAgICAgICAgaWYgKGxvZ2dlcikgbG9nZ2VyLmRlYnVnKGAke2xvZ2dlclR4dH06IGZmdEpvaW5FeHQgU3RhcnQ6ICR7aX0vJHtuUG9pbnRzfWApO1xuICAgICAgICAgICAgY29uc3Qgbj0gTWF0aC5taW4oblBvaW50cyAtIGksIGNodW5rU2l6ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2h1bmsgPSBGci5tdWwoZmlyc3QsIEZyLmV4cCggaW5jLCBpKSk7XG4gICAgICAgICAgICBjb25zdCB0YXNrID0gW107XG5cbiAgICAgICAgICAgIGNvbnN0IGIxID0gYnVmZjEuc2xpY2UoaSpzSW4sIChpK24pKnNJbik7XG4gICAgICAgICAgICBjb25zdCBiMiA9IGJ1ZmYyLnNsaWNlKGkqc0luLCAoaStuKSpzSW4pO1xuXG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1wiLCB2YXI6IDAsIGxlbjogc01pZCpufSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJTRVRcIiwgdmFyOiAwLCBidWZmOiBiMX0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NcIiwgdmFyOiAxLCBsZW46IHNNaWQqbn0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiU0VUXCIsIHZhcjogMSwgYnVmZjogYjJ9KTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMiwgYnVmZjogZmlyc3RDaHVua30pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAzLCBidWZmOiBpbmN9KTtcbiAgICAgICAgICAgIGlmIChmbkluMk1pZCkge1xuICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOmZuSW4yTWlkLCBwYXJhbXM6IFt7dmFyOjB9LCB7dmFsOiBufSwge3ZhcjogMH1dfSk7XG4gICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6Zm5JbjJNaWQsIHBhcmFtczogW3t2YXI6MX0sIHt2YWw6IG59LCB7dmFyOiAxfV19KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBmbk5hbWUsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgIHt2YXI6IDF9LFxuICAgICAgICAgICAgICAgIHt2YWw6IG59LFxuICAgICAgICAgICAgICAgIHt2YXI6IDJ9LFxuICAgICAgICAgICAgICAgIHt2YXI6IDN9LFxuICAgICAgICAgICAgICAgIHt2YWw6IEZyLnN9LFxuICAgICAgICAgICAgXX0pO1xuICAgICAgICAgICAgaWYgKGZuTWlkMk91dCkge1xuICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOmZuTWlkMk91dCwgcGFyYW1zOiBbe3ZhcjowfSwge3ZhbDogbn0sIHt2YXI6IDB9XX0pO1xuICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOmZuTWlkMk91dCwgcGFyYW1zOiBbe3ZhcjoxfSwge3ZhbDogbn0sIHt2YXI6IDF9XX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMCwgdmFyOiAwLCBsZW46IG4qc091dH0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMSwgdmFyOiAxLCBsZW46IG4qc091dH0pO1xuICAgICAgICAgICAgb3BQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgIHRtLnF1ZXVlQWN0aW9uKHRhc2spLnRoZW4oIChyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dnZXIpIGxvZ2dlci5kZWJ1ZyhgJHtsb2dnZXJUeHR9OiBmZnRKb2luRXh0IEVuZDogJHtpfS8ke25Qb2ludHN9YCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5hbGwob3BQcm9taXNlcyk7XG5cbiAgICAgICAgbGV0IGZ1bGxCdWZmT3V0MTtcbiAgICAgICAgbGV0IGZ1bGxCdWZmT3V0MjtcbiAgICAgICAgaWYgKG5Qb2ludHMgKiBzT3V0ID4gMTw8MjgpIHtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MSA9IG5ldyBCaWdCdWZmZXIoblBvaW50cypzT3V0KTtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MiA9IG5ldyBCaWdCdWZmZXIoblBvaW50cypzT3V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MSA9IG5ldyBVaW50OEFycmF5KG5Qb2ludHMqc091dCk7XG4gICAgICAgICAgICBmdWxsQnVmZk91dDIgPSBuZXcgVWludDhBcnJheShuUG9pbnRzKnNPdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHAgPTA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxyZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MS5zZXQocmVzdWx0W2ldWzBdLCBwKTtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0Mi5zZXQocmVzdWx0W2ldWzFdLCBwKTtcbiAgICAgICAgICAgIHArPXJlc3VsdFtpXVswXS5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtmdWxsQnVmZk91dDEsIGZ1bGxCdWZmT3V0Ml07XG4gICAgfVxuXG5cbiAgICBHLmZmdCA9IGFzeW5jIGZ1bmN0aW9uKGJ1ZmYsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IF9mZnQoYnVmZiwgZmFsc2UsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpO1xuICAgIH07XG5cbiAgICBHLmlmZnQgPSBhc3luYyBmdW5jdGlvbihidWZmLCBpblR5cGUsIG91dFR5cGUsIGxvZ2dlciwgbG9nZ2VyVHh0KSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBfZmZ0KGJ1ZmYsIHRydWUsIGluVHlwZSwgb3V0VHlwZSwgbG9nZ2VyLCBsb2dnZXJUeHQpO1xuICAgIH07XG5cbiAgICBHLmxhZ3JhbmdlRXZhbHVhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoYnVmZiwgaW5UeXBlLCBvdXRUeXBlLCBsb2dnZXIsIGxvZ2dlclR4dCkge1xuICAgICAgICBpblR5cGUgPSBpblR5cGUgfHwgXCJhZmZpbmVcIjtcbiAgICAgICAgb3V0VHlwZSA9IG91dFR5cGUgfHwgXCJhZmZpbmVcIjtcblxuICAgICAgICBsZXQgc0luO1xuICAgICAgICBpZiAoZ3JvdXBOYW1lID09IFwiRzFcIikge1xuICAgICAgICAgICAgaWYgKGluVHlwZSA9PSBcImFmZmluZVwiKSB7XG4gICAgICAgICAgICAgICAgc0luID0gRy5GLm44KjI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNJbiA9IEcuRi5uOCozO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSA9PSBcIkcyXCIpIHtcbiAgICAgICAgICAgIGlmIChpblR5cGUgPT0gXCJhZmZpbmVcIikge1xuICAgICAgICAgICAgICAgIHNJbiA9IEcuRi5uOCoyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzSW4gPSBHLkYubjgqMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgPT0gXCJGclwiKSB7XG4gICAgICAgICAgICBzSW4gPSBGci5uODtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZ3JvdXBcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuUG9pbnRzID0gYnVmZi5ieXRlTGVuZ3RoIC9zSW47XG4gICAgICAgIGNvbnN0IGJpdHMgPSBsb2cyKG5Qb2ludHMpO1xuXG4gICAgICAgIGlmICgoMiAqKiBiaXRzKSpzSW4gIT0gYnVmZi5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobG9nZ2VyKSBsb2dnZXIuZXJyb3IoXCJsYWdyYW5nZUV2YWx1YXRpb25zIGlpbnZhbGlkIGlucHV0IHNpemVcIik7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJsYWdyYW5nZUV2YWx1YXRpb25zIGludmFsaWQgSW5wdXQgc2l6ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaXRzIDw9IEZyLnMpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBHLmlmZnQoYnVmZiwgaW5UeXBlLCBvdXRUeXBlLCBsb2dnZXIsIGxvZ2dlclR4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYml0cyA+IEZyLnMrMSkge1xuICAgICAgICAgICAgaWYgKGxvZ2dlcikgbG9nZ2VyLmVycm9yKFwibGFncmFuZ2VFdmFsdWF0aW9ucyBpbnB1dCB0b28gYmlnXCIpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibGFncmFuZ2VFdmFsdWF0aW9ucyBpbnB1dCB0b28gYmlnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHQwID0gYnVmZi5zbGljZSgwLCBidWZmLmJ5dGVMZW5ndGgvMik7XG4gICAgICAgIGxldCB0MSA9IGJ1ZmYuc2xpY2UoYnVmZi5ieXRlTGVuZ3RoLzIsIGJ1ZmYuYnl0ZUxlbmd0aCk7XG5cblxuICAgICAgICBjb25zdCBzaGlmdFRvU21hbGxNID0gRnIuZXhwKEZyLnNoaWZ0LCBuUG9pbnRzLzIpO1xuICAgICAgICBjb25zdCBzQ29uc3QgPSBGci5pbnYoIEZyLnN1YihGci5vbmUsIHNoaWZ0VG9TbWFsbE0pKTtcblxuICAgICAgICBbdDAsIHQxXSA9IGF3YWl0IF9mZnRKb2luRXh0KHQwLCB0MSwgXCJwcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uXCIsIHNDb25zdCwgRnIuc2hpZnRJbnYsIGluVHlwZSwgXCJqYWNvYmlhblwiLCBsb2dnZXIsIGxvZ2dlclR4dCArIFwiIHByZXBcIik7XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICBwcm9taXNlcy5wdXNoKCBfZmZ0KHQwLCB0cnVlLCBcImphY29iaWFuXCIsIG91dFR5cGUsIGxvZ2dlciwgbG9nZ2VyVHh0ICsgXCIgdDBcIikpO1xuICAgICAgICBwcm9taXNlcy5wdXNoKCBfZmZ0KHQxLCB0cnVlLCBcImphY29iaWFuXCIsIG91dFR5cGUsIGxvZ2dlciwgbG9nZ2VyVHh0ICsgXCIgdDFcIikpO1xuXG4gICAgICAgIFt0MCwgdDFdID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXG4gICAgICAgIGxldCBidWZmT3V0O1xuICAgICAgICBpZiAodDAuYnl0ZUxlbmd0aCA+ICgxPDwyOCkpIHtcbiAgICAgICAgICAgIGJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKHQwLmJ5dGVMZW5ndGgqMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWZmT3V0ID0gbmV3IFVpbnQ4QXJyYXkodDAuYnl0ZUxlbmd0aCoyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1ZmZPdXQuc2V0KHQwKTtcbiAgICAgICAgYnVmZk91dC5zZXQodDEsIHQwLmJ5dGVMZW5ndGgpO1xuXG4gICAgICAgIHJldHVybiBidWZmT3V0O1xuICAgIH07XG5cbiAgICBHLmZmdE1peCA9IGFzeW5jIGZ1bmN0aW9uIGZmdE1peChidWZmKSB7XG4gICAgICAgIGNvbnN0IHNHID0gRy5GLm44KjM7XG4gICAgICAgIGxldCBmbk5hbWUsIGZuRkZUSm9pbjtcbiAgICAgICAgaWYgKGdyb3VwTmFtZSA9PSBcIkcxXCIpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZzFtX2ZmdE1peFwiO1xuICAgICAgICAgICAgZm5GRlRKb2luID0gXCJnMW1fZmZ0Sm9pblwiO1xuICAgICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSA9PSBcIkcyXCIpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZzJtX2ZmdE1peFwiO1xuICAgICAgICAgICAgZm5GRlRKb2luID0gXCJnMm1fZmZ0Sm9pblwiO1xuICAgICAgICB9IGVsc2UgaWYgKGdyb3VwTmFtZSA9PSBcIkZyXCIpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZnJtX2ZmdE1peFwiO1xuICAgICAgICAgICAgZm5GRlRKb2luID0gXCJmcm1fZmZ0Sm9pblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBncm91cFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5Qb2ludHMgPSBNYXRoLmZsb29yKGJ1ZmYuYnl0ZUxlbmd0aCAvIHNHKTtcbiAgICAgICAgY29uc3QgcG93ZXIgPSBsb2cyKG5Qb2ludHMpO1xuXG4gICAgICAgIGxldCBuQ2h1bmtzID0gMSA8PCBsb2cyKHRtLmNvbmN1cnJlbmN5KTtcblxuICAgICAgICBpZiAoblBvaW50cyA8PSBuQ2h1bmtzKjIpIG5DaHVua3MgPSAxO1xuXG4gICAgICAgIGNvbnN0IHBvaW50c1BlckNodW5rID0gblBvaW50cyAvIG5DaHVua3M7XG5cbiAgICAgICAgY29uc3QgcG93ZXJDaHVuayA9IGxvZzIocG9pbnRzUGVyQ2h1bmspO1xuXG4gICAgICAgIGNvbnN0IG9wUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPG5DaHVua3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IFtdO1xuICAgICAgICAgICAgY29uc3QgYiA9IGJ1ZmYuc2xpY2UoKGkqIHBvaW50c1BlckNodW5rKSpzRywgKChpKzEpKiBwb2ludHNQZXJDaHVuaykqc0cpO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAwLCBidWZmOiBifSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqPTE7IGo8PXBvd2VyQ2h1bms7IGorKykge1xuICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBmbk5hbWUsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgICAgICB7dmFyOiAwfSxcbiAgICAgICAgICAgICAgICAgICAge3ZhbDogcG9pbnRzUGVyQ2h1bmt9LFxuICAgICAgICAgICAgICAgICAgICB7dmFsOiBqfVxuICAgICAgICAgICAgICAgIF19KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkdFVFwiLCBvdXQ6IDAsIHZhcjogMCwgbGVuOiBwb2ludHNQZXJDaHVuaypzR30pO1xuICAgICAgICAgICAgb3BQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgIHRtLnF1ZXVlQWN0aW9uKHRhc2spXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5hbGwob3BQcm9taXNlcyk7XG5cbiAgICAgICAgY29uc3QgY2h1bmtzID0gW107XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxyZXN1bHQubGVuZ3RoOyBpKyspIGNodW5rc1tpXSA9IHJlc3VsdFtpXVswXTtcblxuXG4gICAgICAgIGZvciAobGV0IGkgPSBwb3dlckNodW5rKzE7IGk8PXBvd2VyOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5Hcm91cHMgPSAxIDw8IChwb3dlciAtIGkpO1xuICAgICAgICAgICAgY29uc3QgbkNodW5rc1Blckdyb3VwID0gbkNodW5rcyAvIG5Hcm91cHM7XG4gICAgICAgICAgICBjb25zdCBvcFByb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8bkdyb3VwczsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaz0wOyBrIDxuQ2h1bmtzUGVyR3JvdXAvMjsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gRnIuZXhwKCBGci53W2ldLCBrKnBvaW50c1BlckNodW5rKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5jID0gRnIud1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEgPSBqKm5DaHVua3NQZXJHcm91cCArIGs7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8yID0gaipuQ2h1bmtzUGVyR3JvdXAgKyBrICsgbkNodW5rc1Blckdyb3VwLzI7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1NFVFwiLCB2YXI6IDAsIGJ1ZmY6IGNodW5rc1tvMV19KTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAxLCBidWZmOiBjaHVua3NbbzJdfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMiwgYnVmZjogZmlyc3R9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAzLCBidWZmOiBpbmN9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IGZuRkZUSm9pbiwgIHBhcmFtczpbXG4gICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YXI6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhbDogcG9pbnRzUGVyQ2h1bmt9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhcjogMn0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7dmFyOiAzfVxuICAgICAgICAgICAgICAgICAgICBdfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkdFVFwiLCBvdXQ6IDAsIHZhcjogMCwgbGVuOiBwb2ludHNQZXJDaHVuaypzR30pO1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJHRVRcIiwgb3V0OiAxLCB2YXI6IDEsIGxlbjogcG9pbnRzUGVyQ2h1bmsqc0d9KTtcbiAgICAgICAgICAgICAgICAgICAgb3BQcm9taXNlcy5wdXNoKHRtLnF1ZXVlQWN0aW9uKHRhc2spKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IFByb21pc2UuYWxsKG9wUHJvbWlzZXMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPG5Hcm91cHM7IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGs9MDsgayA8bkNodW5rc1Blckdyb3VwLzI7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvMSA9IGoqbkNodW5rc1Blckdyb3VwICsgaztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzIgPSBqKm5DaHVua3NQZXJHcm91cCArIGsgKyBuQ2h1bmtzUGVyR3JvdXAvMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzQ2h1bmsgPSByZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2h1bmtzW28xXSA9IHJlc0NodW5rWzBdO1xuICAgICAgICAgICAgICAgICAgICBjaHVua3NbbzJdID0gcmVzQ2h1bmtbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZ1bGxCdWZmT3V0O1xuICAgICAgICBpZiAoYnVmZiBpbnN0YW5jZW9mIEJpZ0J1ZmZlcikge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKG5Qb2ludHMqc0cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQgPSBuZXcgVWludDhBcnJheShuUG9pbnRzKnNHKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcCA9MDtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPG5DaHVua3M7IGkrKykge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQuc2V0KGNodW5rc1tpXSwgcCk7XG4gICAgICAgICAgICBwKz1jaHVua3NbaV0uYnl0ZUxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdWxsQnVmZk91dDtcbiAgICB9O1xuXG4gICAgRy5mZnRKb2luID0gYXN5bmMgZnVuY3Rpb24gZmZ0Sm9pbihidWZmMSwgYnVmZjIsIGZpcnN0LCBpbmMpIHtcbiAgICAgICAgY29uc3Qgc0cgPSBHLkYubjgqMztcbiAgICAgICAgbGV0IGZuTmFtZTtcbiAgICAgICAgaWYgKGdyb3VwTmFtZSA9PSBcIkcxXCIpIHtcbiAgICAgICAgICAgIGZuTmFtZSA9IFwiZzFtX2ZmdEpvaW5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChncm91cE5hbWUgPT0gXCJHMlwiKSB7XG4gICAgICAgICAgICBmbk5hbWUgPSBcImcybV9mZnRKb2luXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lID09IFwiRnJcIikge1xuICAgICAgICAgICAgZm5OYW1lID0gXCJmcm1fZmZ0Sm9pblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBncm91cFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChidWZmMS5ieXRlTGVuZ3RoICE9IGJ1ZmYyLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYnVmZmVyIHNpemVcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZjEuYnl0ZUxlbmd0aCAvIHNHKTtcbiAgICAgICAgaWYgKG5Qb2ludHMgIT0gMSA8PCBsb2cyKG5Qb2ludHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG51bWJlciBvZiBwb2ludHNcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbkNodW5rcyA9IDEgPDwgbG9nMih0bS5jb25jdXJyZW5jeSk7XG4gICAgICAgIGlmIChuUG9pbnRzIDw9IG5DaHVua3MqMikgbkNodW5rcyA9IDE7XG5cbiAgICAgICAgY29uc3QgcG9pbnRzUGVyQ2h1bmsgPSBuUG9pbnRzIC8gbkNodW5rcztcblxuXG4gICAgICAgIGNvbnN0IG9wUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPG5DaHVua3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IFtdO1xuXG4gICAgICAgICAgICBjb25zdCBmaXJzdENodW5rID0gRnIubXVsKGZpcnN0LCBGci5leHAoaW5jLCBpKnBvaW50c1BlckNodW5rKSk7XG4gICAgICAgICAgICBjb25zdCBiMSA9IGJ1ZmYxLnNsaWNlKChpKiBwb2ludHNQZXJDaHVuaykqc0csICgoaSsxKSogcG9pbnRzUGVyQ2h1bmspKnNHKTtcbiAgICAgICAgICAgIGNvbnN0IGIyID0gYnVmZjIuc2xpY2UoKGkqIHBvaW50c1BlckNodW5rKSpzRywgKChpKzEpKiBwb2ludHNQZXJDaHVuaykqc0cpO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAwLCBidWZmOiBiMX0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAxLCBidWZmOiBiMn0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAyLCBidWZmOiBmaXJzdENodW5rfSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJBTExPQ1NFVFwiLCB2YXI6IDMsIGJ1ZmY6IGluY30pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IGZuTmFtZSwgcGFyYW1zOiBbXG4gICAgICAgICAgICAgICAge3ZhcjogMH0sXG4gICAgICAgICAgICAgICAge3ZhcjogMX0sXG4gICAgICAgICAgICAgICAge3ZhbDogcG9pbnRzUGVyQ2h1bmt9LFxuICAgICAgICAgICAgICAgIHt2YXI6IDJ9LFxuICAgICAgICAgICAgICAgIHt2YXI6IDN9XG4gICAgICAgICAgICBdfSk7XG4gICAgICAgICAgICB0YXNrLnB1c2goe2NtZDogXCJHRVRcIiwgb3V0OiAwLCB2YXI6IDAsIGxlbjogcG9pbnRzUGVyQ2h1bmsqc0d9KTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkdFVFwiLCBvdXQ6IDEsIHZhcjogMSwgbGVuOiBwb2ludHNQZXJDaHVuaypzR30pO1xuICAgICAgICAgICAgb3BQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgIHRtLnF1ZXVlQWN0aW9uKHRhc2spXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKG9wUHJvbWlzZXMpO1xuXG4gICAgICAgIGxldCBmdWxsQnVmZk91dDE7XG4gICAgICAgIGxldCBmdWxsQnVmZk91dDI7XG4gICAgICAgIGlmIChidWZmMSBpbnN0YW5jZW9mIEJpZ0J1ZmZlcikge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQxID0gbmV3IEJpZ0J1ZmZlcihuUG9pbnRzKnNHKTtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MiA9IG5ldyBCaWdCdWZmZXIoblBvaW50cypzRyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmdWxsQnVmZk91dDEgPSBuZXcgVWludDhBcnJheShuUG9pbnRzKnNHKTtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MiA9IG5ldyBVaW50OEFycmF5KG5Qb2ludHMqc0cpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHAgPTA7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxyZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0MS5zZXQocmVzdWx0W2ldWzBdLCBwKTtcbiAgICAgICAgICAgIGZ1bGxCdWZmT3V0Mi5zZXQocmVzdWx0W2ldWzFdLCBwKTtcbiAgICAgICAgICAgIHArPXJlc3VsdFtpXVswXS5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtmdWxsQnVmZk91dDEsIGZ1bGxCdWZmT3V0Ml07XG4gICAgfTtcblxuXG5cbiAgICBHLmZmdEZpbmFsID0gIGFzeW5jIGZ1bmN0aW9uIGZmdEZpbmFsKGJ1ZmYsIGZhY3Rvcikge1xuICAgICAgICBjb25zdCBzRyA9IEcuRi5uOCozO1xuICAgICAgICBjb25zdCBzR291dCA9IEcuRi5uOCoyO1xuICAgICAgICBsZXQgZm5OYW1lLCBmblRvQWZmaW5lO1xuICAgICAgICBpZiAoZ3JvdXBOYW1lID09IFwiRzFcIikge1xuICAgICAgICAgICAgZm5OYW1lID0gXCJnMW1fZmZ0RmluYWxcIjtcbiAgICAgICAgICAgIGZuVG9BZmZpbmUgPSBcImcxbV9iYXRjaFRvQWZmaW5lXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBOYW1lID09IFwiRzJcIikge1xuICAgICAgICAgICAgZm5OYW1lID0gXCJnMm1fZmZ0RmluYWxcIjtcbiAgICAgICAgICAgIGZuVG9BZmZpbmUgPSBcImcybV9iYXRjaFRvQWZmaW5lXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGdyb3VwXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoYnVmZi5ieXRlTGVuZ3RoIC8gc0cpO1xuICAgICAgICBpZiAoblBvaW50cyAhPSAxIDw8IGxvZzIoblBvaW50cykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbnVtYmVyIG9mIHBvaW50c1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50c1BlckNodW5rID0gTWF0aC5mbG9vcihuUG9pbnRzIC8gdG0uY29uY3VycmVuY3kpO1xuXG4gICAgICAgIGNvbnN0IG9wUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRtLmNvbmN1cnJlbmN5OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuO1xuICAgICAgICAgICAgaWYgKGk8IHRtLmNvbmN1cnJlbmN5LTEpIHtcbiAgICAgICAgICAgICAgICBuID0gcG9pbnRzUGVyQ2h1bms7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4gPSBuUG9pbnRzIC0gaSpwb2ludHNQZXJDaHVuaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuPT0wKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBidWZmLnNsaWNlKChpKiBwb2ludHNQZXJDaHVuaykqc0csIChpKnBvaW50c1BlckNodW5rK24pKnNHKTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkFMTE9DU0VUXCIsIHZhcjogMCwgYnVmZjogYn0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQUxMT0NTRVRcIiwgdmFyOiAxLCBidWZmOiBmYWN0b3J9KTtcbiAgICAgICAgICAgIHRhc2sucHVzaCh7Y21kOiBcIkNBTExcIiwgZm5OYW1lOiBmbk5hbWUsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgIHt2YWw6IG59LFxuICAgICAgICAgICAgICAgIHt2YXI6IDF9LFxuICAgICAgICAgICAgXX0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiQ0FMTFwiLCBmbk5hbWU6IGZuVG9BZmZpbmUsIHBhcmFtczogW1xuICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgICAgIHt2YWw6IG59LFxuICAgICAgICAgICAgICAgIHt2YXI6IDB9LFxuICAgICAgICAgICAgXX0pO1xuICAgICAgICAgICAgdGFzay5wdXNoKHtjbWQ6IFwiR0VUXCIsIG91dDogMCwgdmFyOiAwLCBsZW46IG4qc0dvdXR9KTtcbiAgICAgICAgICAgIG9wUHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICB0bS5xdWV1ZUFjdGlvbih0YXNrKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5hbGwob3BQcm9taXNlcyk7XG5cbiAgICAgICAgbGV0IGZ1bGxCdWZmT3V0O1xuICAgICAgICBpZiAoYnVmZiBpbnN0YW5jZW9mIEJpZ0J1ZmZlcikge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQgPSBuZXcgQmlnQnVmZmVyKG5Qb2ludHMqc0dvdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVsbEJ1ZmZPdXQgPSBuZXcgVWludDhBcnJheShuUG9pbnRzKnNHb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwID0wO1xuICAgICAgICBmb3IgKGxldCBpPXJlc3VsdC5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgICBmdWxsQnVmZk91dC5zZXQocmVzdWx0W2ldWzBdLCBwKTtcbiAgICAgICAgICAgIHArPXJlc3VsdFtpXVswXS5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bGxCdWZmT3V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgV2FzbUZpZWxkMSBmcm9tIFwiLi93YXNtX2ZpZWxkMS5qc1wiO1xuaW1wb3J0IFdhc21GaWVsZDIgZnJvbSBcIi4vd2FzbV9maWVsZDIuanNcIjtcbmltcG9ydCBXYXNtRmllbGQzIGZyb20gXCIuL3dhc21fZmllbGQzLmpzXCI7XG5pbXBvcnQgV2FzbUN1cnZlIGZyb20gXCIuL3dhc21fY3VydmUuanNcIjtcbmltcG9ydCBidWlsZFRocmVhZE1hbmFnZXIgZnJvbSBcIi4vdGhyZWFkbWFuLmpzXCI7XG5pbXBvcnQgKiBhcyBTY2FsYXIgZnJvbSBcIi4vc2NhbGFyLmpzXCI7XG5pbXBvcnQgYnVpbGRCYXRjaEFwcGx5S2V5IGZyb20gXCIuL2VuZ2luZV9hcHBseWtleS5qc1wiO1xuaW1wb3J0IGJ1aWxkUGFpcmluZyBmcm9tIFwiLi9lbmdpbmVfcGFpcmluZy5qc1wiO1xuaW1wb3J0IGJ1aWxkTXVsdGlFeHAgZnJvbSBcIi4vZW5naW5lX211bHRpZXhwLmpzXCI7XG5pbXBvcnQgYnVpbGRGRlQgZnJvbSBcIi4vZW5naW5lX2ZmdC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBidWlsZEVuZ2luZShwYXJhbXMpIHtcblxuICAgIGNvbnN0IHRtID0gYXdhaXQgYnVpbGRUaHJlYWRNYW5hZ2VyKHBhcmFtcy53YXNtLCBwYXJhbXMuc2luZ2xlVGhyZWFkKTtcblxuXG4gICAgY29uc3QgY3VydmUgPSB7fTtcblxuICAgIGN1cnZlLnEgPSBTY2FsYXIuZShwYXJhbXMud2FzbS5xKTtcbiAgICBjdXJ2ZS5yID0gU2NhbGFyLmUocGFyYW1zLndhc20ucik7XG4gICAgY3VydmUubmFtZSA9IHBhcmFtcy5uYW1lO1xuICAgIGN1cnZlLnRtID0gdG07XG4gICAgY3VydmUucHJlUFNpemUgPSBwYXJhbXMud2FzbS5wcmVQU2l6ZTtcbiAgICBjdXJ2ZS5wcmVRU2l6ZSA9IHBhcmFtcy53YXNtLnByZVFTaXplO1xuICAgIGN1cnZlLkZyID0gbmV3IFdhc21GaWVsZDEodG0sIFwiZnJtXCIsIHBhcmFtcy5uOHIsIHBhcmFtcy5yKTtcbiAgICBjdXJ2ZS5GMSA9IG5ldyBXYXNtRmllbGQxKHRtLCBcImYxbVwiLCBwYXJhbXMubjhxLCBwYXJhbXMucSk7XG4gICAgY3VydmUuRjIgPSBuZXcgV2FzbUZpZWxkMih0bSwgXCJmMm1cIiwgY3VydmUuRjEpO1xuICAgIGN1cnZlLkcxID0gbmV3IFdhc21DdXJ2ZSh0bSwgXCJnMW1cIiwgY3VydmUuRjEsIHBhcmFtcy53YXNtLnBHMWdlbiwgcGFyYW1zLndhc20ucEcxYiwgcGFyYW1zLmNvZmFjdG9yRzEpO1xuICAgIGN1cnZlLkcyID0gbmV3IFdhc21DdXJ2ZSh0bSwgXCJnMm1cIiwgY3VydmUuRjIsIHBhcmFtcy53YXNtLnBHMmdlbiwgcGFyYW1zLndhc20ucEcyYiwgcGFyYW1zLmNvZmFjdG9yRzIpO1xuICAgIGN1cnZlLkY2ID0gbmV3IFdhc21GaWVsZDModG0sIFwiZjZtXCIsIGN1cnZlLkYyKTtcbiAgICBjdXJ2ZS5GMTIgPSBuZXcgV2FzbUZpZWxkMih0bSwgXCJmdG1cIiwgY3VydmUuRjYpO1xuXG4gICAgY3VydmUuR3QgPSBjdXJ2ZS5GMTI7XG5cbiAgICBidWlsZEJhdGNoQXBwbHlLZXkoY3VydmUsIFwiRzFcIik7XG4gICAgYnVpbGRCYXRjaEFwcGx5S2V5KGN1cnZlLCBcIkcyXCIpO1xuICAgIGJ1aWxkQmF0Y2hBcHBseUtleShjdXJ2ZSwgXCJGclwiKTtcblxuICAgIGJ1aWxkTXVsdGlFeHAoY3VydmUsIFwiRzFcIik7XG4gICAgYnVpbGRNdWx0aUV4cChjdXJ2ZSwgXCJHMlwiKTtcblxuICAgIGJ1aWxkRkZUKGN1cnZlLCBcIkcxXCIpO1xuICAgIGJ1aWxkRkZUKGN1cnZlLCBcIkcyXCIpO1xuICAgIGJ1aWxkRkZUKGN1cnZlLCBcIkZyXCIpO1xuXG4gICAgYnVpbGRQYWlyaW5nKGN1cnZlKTtcblxuICAgIGN1cnZlLmFycmF5MmJ1ZmZlciA9IGZ1bmN0aW9uKGFyciwgc0cpIHtcbiAgICAgICAgY29uc3QgYnVmZiA9IG5ldyBVaW50OEFycmF5KHNHKmFyci5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJ1ZmYuc2V0KGFycltpXSwgaSpzRyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVmZjtcbiAgICB9O1xuXG4gICAgY3VydmUuYnVmZmVyMmFycmF5ID0gZnVuY3Rpb24oYnVmZiAsIHNHKSB7XG4gICAgICAgIGNvbnN0IG49IGJ1ZmYuYnl0ZUxlbmd0aCAvIHNHO1xuICAgICAgICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobik7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgICAgIGFycltpXSA9IGJ1ZmYuc2xpY2UoaSpzRywgaSpzRytzRyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGN1cnZlO1xufVxuXG5cbiIsImltcG9ydCB3YXNtY3VydmVzIGZyb20gXCJ3YXNtY3VydmVzXCI7XG5pbXBvcnQgYnVpbGRFbmdpbmUgZnJvbSBcIi4vZW5naW5lLmpzXCI7XG5pbXBvcnQgKiBhcyBTY2FsYXIgZnJvbSBcIi4vc2NhbGFyLmpzXCI7XG5cbmdsb2JhbC5jdXJ2ZV9ibjEyOCA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkQm4xMjgoc2luZ2xlVGhyZWFkKSB7XG5cbiAgICBpZiAoKCFzaW5nbGVUaHJlYWQpJiYoZ2xvYmFsLmN1cnZlX2JuMTI4KSkgcmV0dXJuIGdsb2JhbC5jdXJ2ZV9ibjEyODtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIG5hbWU6IFwiYm4xMjhcIixcbiAgICAgICAgd2FzbTogd2FzbWN1cnZlcy5ibjEyOF93YXNtLFxuICAgICAgICBxOiBTY2FsYXIuZShcIjIxODg4MjQyODcxODM5Mjc1MjIyMjQ2NDA1NzQ1MjU3Mjc1MDg4Njk2MzExMTU3Mjk3ODIzNjYyNjg5MDM3ODk0NjQ1MjI2MjA4NTgzXCIpLFxuICAgICAgICByOiBTY2FsYXIuZShcIjIxODg4MjQyODcxODM5Mjc1MjIyMjQ2NDA1NzQ1MjU3Mjc1MDg4NTQ4MzY0NDAwNDE2MDM0MzQzNjk4MjA0MTg2NTc1ODA4NDk1NjE3XCIpLFxuICAgICAgICBuOHE6IDMyLFxuICAgICAgICBuOHI6IDMyLFxuICAgICAgICBjb2ZhY3RvckcyOiBTY2FsYXIuZShcIjMwNjQ0ZTcyZTEzMWEwMjliODUwNDViNjgxODE1ODVlMDZjZWVjZGE1NzJhMjQ4OTM0NWYyMjk5YzBmOWZhOGRcIiwgMTYpLFxuICAgICAgICBzaW5nbGVUaHJlYWQ6IHNpbmdsZVRocmVhZCA/IHRydWUgOiBmYWxzZVxuICAgIH07XG5cbiAgICBjb25zdCBjdXJ2ZSA9IGF3YWl0IGJ1aWxkRW5naW5lKHBhcmFtcyk7XG4gICAgY3VydmUudGVybWluYXRlID0gYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghcGFyYW1zLnNpbmdsZVRocmVhZCkge1xuICAgICAgICAgICAgZ2xvYmFsLmN1cnZlX2JuMTI4ID0gbnVsbDtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudG0udGVybWluYXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFzaW5nbGVUaHJlYWQpIHtcbiAgICAgICAgZ2xvYmFsLmN1cnZlX2JuMTI4ID0gY3VydmU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnZlO1xufVxuXG4iLCJpbXBvcnQgd2FzbWN1cnZlcyBmcm9tIFwid2FzbWN1cnZlc1wiO1xuaW1wb3J0IGJ1aWxkRW5naW5lIGZyb20gXCIuL2VuZ2luZS5qc1wiO1xuaW1wb3J0ICogYXMgU2NhbGFyIGZyb20gXCIuL3NjYWxhci5qc1wiO1xuXG5nbG9iYWwuY3VydmVfYmxzMTIzODEgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBidWlsZEJsczEyMzgxKHNpbmdsZVRocmVhZCkge1xuXG4gICAgaWYgKCghc2luZ2xlVGhyZWFkKSYmKGdsb2JhbC5jdXJ2ZV9ibHMxMjM4MSkpIHJldHVybiBnbG9iYWwuY3VydmVfYmxzMTIzODE7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBuYW1lOiBcImJsczEyMzgxXCIsXG4gICAgICAgIHdhc206IHdhc21jdXJ2ZXMuYmxzMTIzODFfd2FzbSxcbiAgICAgICAgcTogU2NhbGFyLmUoXCIxYTAxMTFlYTM5N2ZlNjlhNGIxYmE3YjY0MzRiYWNkNzY0Nzc0Yjg0ZjM4NTEyYmY2NzMwZDJhMGY2YjBmNjI0MWVhYmZmZmViMTUzZmZmZmI5ZmVmZmZmZmZmZmFhYWJcIiwgMTYpLFxuICAgICAgICByOiBTY2FsYXIuZShcIjczZWRhNzUzMjk5ZDdkNDgzMzM5ZDgwODA5YTFkODA1NTNiZGE0MDJmZmZlNWJmZWZmZmZmZmZmMDAwMDAwMDFcIiwgMTYpLFxuICAgICAgICBuOHE6IDQ4LFxuICAgICAgICBuOHI6IDMyLFxuICAgICAgICBjb2ZhY3RvckcxOiBTY2FsYXIuZShcIjB4Mzk2YzhjMDA1NTU1ZTE1NjhjMDBhYWFiMDAwMGFhYWJcIiwgMTYpLFxuICAgICAgICBjb2ZhY3RvckcyOiBTY2FsYXIuZShcIjB4NWQ1NDNhOTU0MTRlN2YxMDkxZDUwNzkyODc2YTIwMmNkOTFkZTQ1NDcwODVhYmFhNjhhMjA1YjJlNWE3ZGRmYTYyOGYxY2I0ZDllODJlZjIxNTM3ZTI5M2E2NjkxYWUxNjE2ZWM2ZTc4NmYwYzcwY2YxYzM4ZTMxYzcyMzhlNVwiLCAxNiksXG4gICAgICAgIHNpbmdsZVRocmVhZDogc2luZ2xlVGhyZWFkID8gdHJ1ZSA6IGZhbHNlXG4gICAgfTtcblxuICAgIGNvbnN0IGN1cnZlID0gYXdhaXQgYnVpbGRFbmdpbmUocGFyYW1zKTtcbiAgICBjdXJ2ZS50ZXJtaW5hdGUgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFwYXJhbXMuc2luZ2xlVGhyZWFkKSB7XG4gICAgICAgICAgICBnbG9iYWwuY3VydmVfYmxzMTIzODEgPSBudWxsO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy50bS50ZXJtaW5hdGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gY3VydmU7XG59XG5cbiIsImltcG9ydCAqIGFzIFNjYWxhciBmcm9tIFwiLi9zY2FsYXIuanNcIjtcbmltcG9ydCB7ZGVmYXVsdCBhcyBidWlsZEJuMTI4fSBmcm9tIFwiLi9ibjEyOC5qc1wiO1xuaW1wb3J0IHtkZWZhdWx0IGFzIGJ1aWxkQmxzMTIzODF9IGZyb20gXCIuL2JuMTI4LmpzXCI7XG5cbmNvbnN0IGJsczEyMzgxciA9IFNjYWxhci5lKFwiNzNlZGE3NTMyOTlkN2Q0ODMzMzlkODA4MDlhMWQ4MDU1M2JkYTQwMmZmZmU1YmZlZmZmZmZmZmYwMDAwMDAwMVwiLCAxNik7XG5jb25zdCBibjEyOHIgPSBTY2FsYXIuZShcIjIxODg4MjQyODcxODM5Mjc1MjIyMjQ2NDA1NzQ1MjU3Mjc1MDg4NTQ4MzY0NDAwNDE2MDM0MzQzNjk4MjA0MTg2NTc1ODA4NDk1NjE3XCIpO1xuXG5jb25zdCBibHMxMjM4MXEgPSBTY2FsYXIuZShcIjFhMDExMWVhMzk3ZmU2OWE0YjFiYTdiNjQzNGJhY2Q3NjQ3NzRiODRmMzg1MTJiZjY3MzBkMmEwZjZiMGY2MjQxZWFiZmZmZWIxNTNmZmZmYjlmZWZmZmZmZmZmYWFhYlwiLCAxNik7XG5jb25zdCBibjEyOHEgPSBTY2FsYXIuZShcIjIxODg4MjQyODcxODM5Mjc1MjIyMjQ2NDA1NzQ1MjU3Mjc1MDg4Njk2MzExMTU3Mjk3ODIzNjYyNjg5MDM3ODk0NjQ1MjI2MjA4NTgzXCIpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VydmVGcm9tUihyLCBzaW5nbGVUaHJlYWQpIHtcbiAgICBsZXQgY3VydmU7XG4gICAgaWYgKFNjYWxhci5lcShyLCBibjEyOHIpKSB7XG4gICAgICAgIGN1cnZlID0gYXdhaXQgYnVpbGRCbjEyOChzaW5nbGVUaHJlYWQpO1xuICAgIH0gZWxzZSBpZiAoU2NhbGFyLmVxKHIsIGJsczEyMzgxcikpIHtcbiAgICAgICAgY3VydmUgPSBhd2FpdCBidWlsZEJsczEyMzgxKHNpbmdsZVRocmVhZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDdXJ2ZSBub3Qgc3VwcG9ydGVkOiAke1NjYWxhci50b1N0cmluZyhyKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnZlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VydmVGcm9tUShxLCBzaW5nbGVUaHJlYWQpIHtcbiAgICBsZXQgY3VydmU7XG4gICAgaWYgKFNjYWxhci5lcShxLCBibjEyOHEpKSB7XG4gICAgICAgIGN1cnZlID0gYXdhaXQgYnVpbGRCbjEyOChzaW5nbGVUaHJlYWQpO1xuICAgIH0gZWxzZSBpZiAoU2NhbGFyLmVxKHEsIGJsczEyMzgxcSkpIHtcbiAgICAgICAgY3VydmUgPSBhd2FpdCBidWlsZEJsczEyMzgxKHNpbmdsZVRocmVhZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDdXJ2ZSBub3Qgc3VwcG9ydGVkOiAke1NjYWxhci50b1N0cmluZyhxKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnZlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VydmVGcm9tTmFtZShuYW1lLCBzaW5nbGVUaHJlYWQpIHtcbiAgICBsZXQgY3VydmU7XG4gICAgY29uc3Qgbm9ybU5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpO1xuICAgIGlmIChbXCJCTjEyOFwiLCBcIkJOMjU0XCIsIFwiQUxUQk4xMjhcIl0uaW5kZXhPZihub3JtTmFtZSkgPj0gMCkge1xuICAgICAgICBjdXJ2ZSA9IGF3YWl0IGJ1aWxkQm4xMjgoc2luZ2xlVGhyZWFkKTtcbiAgICB9IGVsc2UgaWYgKFtcIkJMUzEyMzgxXCJdLmluZGV4T2Yobm9ybU5hbWUpID49IDApIHtcbiAgICAgICAgY3VydmUgPSBhd2FpdCBidWlsZEJsczEyMzgxKHNpbmdsZVRocmVhZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDdXJ2ZSBub3Qgc3VwcG9ydGVkOiAke25hbWV9YCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJ2ZTtcblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobikge1xuICAgICAgICByZXR1cm4gbi50b1VwcGVyQ2FzZSgpLm1hdGNoKC9bQS1aYS16MC05XSsvZykuam9pbihcIlwiKTtcbiAgICB9XG5cbn1cbiIsIlxuaW1wb3J0ICogYXMgX1NjYWxhciAgZnJvbSBcIi4vc3JjL3NjYWxhci5qc1wiO1xuZXhwb3J0IGNvbnN0IFNjYWxhcj1fU2NhbGFyO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgUG9sRmllbGR9IGZyb20gXCIuL3NyYy9wb2xmaWVsZC5qc1wiO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEYxRmllbGR9IGZyb20gXCIuL3NyYy9mMWZpZWxkLmpzXCI7XG5leHBvcnQge2RlZmF1bHQgYXMgRjJGaWVsZH0gZnJvbSBcIi4vc3JjL2YyZmllbGQuanNcIjtcbmV4cG9ydCB7ZGVmYXVsdCBhcyBGM0ZpZWxkfSBmcm9tIFwiLi9zcmMvZjNmaWVsZC5qc1wiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgWnFGaWVsZH0gZnJvbSBcIi4vc3JjL2YxZmllbGQuanNcIjtcblxuZXhwb3J0IHtkZWZhdWx0IGFzIEVDfSBmcm9tIFwiLi9zcmMvZWMuanNcIjtcblxuZXhwb3J0IHtkZWZhdWx0IGFzIGJ1aWxkQm4xMjh9IGZyb20gXCIuL3NyYy9ibjEyOC5qc1wiO1xuZXhwb3J0IHtkZWZhdWx0IGFzIGJ1aWxkQmxzMTIzODF9IGZyb20gXCIuL3NyYy9ibHMxMjM4MS5qc1wiO1xuXG5pbXBvcnQgKiBhcyBfdXRpbHMgZnJvbSBcIi4vc3JjL3V0aWxzLmpzXCI7XG5leHBvcnQgY29uc3QgdXRpbHMgPSBfdXRpbHM7XG5leHBvcnQge2RlZmF1bHQgYXMgQ2hhQ2hhfSBmcm9tIFwiLi9zcmMvY2hhY2hhLmpzXCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBCaWdCdWZmZXJ9IGZyb20gXCIuL3NyYy9iaWdidWZmZXIuanNcIjtcblxuZXhwb3J0IHtnZXRDdXJ2ZUZyb21SLCBnZXRDdXJ2ZUZyb21RLCBnZXRDdXJ2ZUZyb21OYW1lfSBmcm9tIFwiLi9zcmMvY3VydmVzLmpzXCI7XG5cbiJdLCJuYW1lcyI6WyJmcm9tU3RyaW5nIiwiYmlnSW50IiwiZSIsImZyb21BcnJheSIsImJpdExlbmd0aCIsImlzTmVnYXRpdmUiLCJpc1plcm8iLCJzaGlmdExlZnQiLCJzaGlmdFJpZ2h0Iiwic2hsIiwic2hyIiwiaXNPZGQiLCJuYWYiLCJiaXRzIiwidG9OdW1iZXIiLCJ0b0FycmF5IiwiYWRkIiwic3ViIiwibmVnIiwibXVsIiwic3F1YXJlIiwicG93IiwiZXhwIiwiYWJzIiwiZGl2IiwibW9kIiwiZXEiLCJuZXEiLCJsdCIsImd0IiwibGVxIiwiZ2VxIiwiYmFuZCIsImJvciIsImJ4b3IiLCJsYW5kIiwibG9yIiwibG5vdCIsIlNjYWxhci5pc1plcm8iLCJTY2FsYXIubmFmIiwiU2NhbGFyLmJpdHMiLCJTY2FsYXIuZXEiLCJTY2FsYXIubW9kIiwiU2NhbGFyLnBvdyIsIlNjYWxhci5zdWIiLCJTY2FsYXIuaXNPZGQiLCJTY2FsYXIuZGl2IiwiU2NhbGFyLmFkZCIsIlNjYWxhci5tdWwiLCJjcnlwdG8iLCJTY2FsYXIuYml0TGVuZ3RoIiwiZnV0aWxzLmV4cCIsIlpxRmllbGQiLCJzdXBwb3J0c05hdGl2ZUJpZ0ludCIsIkYxRmllbGRfbmF0aXZlIiwiRjFGaWVsZF9iaWdpbnQiLCJTY2FsYXIudG9ScHJMRSIsIlNjYWxhci50b1JwckJFIiwiU2NhbGFyLmZyb21ScHJMRSIsIlNjYWxhci5mcm9tUnByQkUiLCJmVXRpbHMubXVsU2NhbGFyIiwiZlV0aWxzLmV4cCIsIlNjYWxhci5ndCIsInN0cmluZ2lmeUJpZ0ludHMiLCJ1bnN0cmluZ2lmeUJpZ0ludHMiLCJiZUJ1ZmYyaW50IiwiYmVJbnQyQnVmZiIsImxlQnVmZjJpbnQiLCJsZUludDJCdWZmIiwiX3JldlRhYmxlIiwiX3JldlNsb3ciLCJsb2cyIiwiU2NhbGFyLnNoaWZ0UmlnaHQiLCJTY2FsYXIub25lIiwiU2NhbGFyLnNoaWZ0TGVmdCIsIlNjYWxhci50b0xFQnVmZiIsIlNjYWxhci5lIiwiU2NhbGFyLmlzTmVnYXRpdmUiLCJTY2FsYXIubmVnIiwidXRpbHMubGVJbnQyQnVmZiIsIlNjYWxhci50b1N0cmluZyIsIlNjYWxhci56ZXJvIiwiU2NhbGFyLmJhbmQiLCJTY2FsYXIuZ2VxIiwib3MiLCJXb3JrZXIiLCJidWlsZE11bHRpRXhwIiwid2FzbWN1cnZlcyIsImJ1aWxkQmxzMTIzODEiLCJTY2FsYXIiLCJ1dGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pFO0FBQ08sU0FBUyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNyQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDL0IsUUFBUSxPQUFPLE1BQU0sQ0FBQyxDQUFD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O0FBQ08sU0FBU29CLEtBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzFCLElBQUksT0FBT3BCLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQSwwQkFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUNEO0FBQ08sU0FBU3FCLEtBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzFCLElBQUksT0FBT3JCLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQSwwQkFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUNEO0FBQ08sU0FBU3NCLEtBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDdkIsSUFBSSxPQUFPdEIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBQ0Q7QUFDTyxTQUFTdUIsS0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPdkIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBQ0Q7QUFDTyxTQUFTd0IsS0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPeEIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTeUIsSUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsSUFBSSxPQUFPekIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTMEIsS0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPMUIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTMkIsSUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsSUFBSSxPQUFPM0IsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTNEIsSUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsSUFBSSxPQUFPNUIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTNkIsS0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPN0IsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTOEIsS0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPOUIsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTK0IsTUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDM0IsSUFBSSxPQUFPL0IsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTZ0MsS0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxPQUFPaEMsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTaUMsTUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDM0IsSUFBSSxPQUFPakMsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDTyxTQUFTa0MsTUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDM0IsSUFBSSxPQUFPLENBQUMsQ0FBQ2xDLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQ0EsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFDRDtBQUNPLFNBQVNtQyxLQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMxQixJQUFJLE9BQU8sQ0FBQyxDQUFDbkMsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDQSwwQkFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUNEO0FBQ08sU0FBU29DLE1BQUksQ0FBQyxDQUFDLEVBQUU7QUFDeEIsSUFBSSxPQUFPcEMsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNLQSxNQUFNLG9CQUFvQixHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsQ0FBQztBQUMxRDtBQUNBLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixJQUFJLG9CQUFvQixFQUFFO0FBQzFCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDekMsQ0FBQyxNQUFNO0FBQ1AsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDaEQsSUFBSSxNQUFNLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QyxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0YsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUcsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0FBQ2pELElBQUksTUFBTSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekMsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25ILElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDaEQsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNmLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQzdFLElBQUksT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDaEQsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNmLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLENB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25IVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSxRQUFRLENBQUM7QUFDOUIsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQjtBQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUMzQixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDekI7QUFDQSxRQUFRLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRjtBQUNBLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsUUFBUSxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDckIsWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBWSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUNoQixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRTtBQUNqQixRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZELFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDL0IsWUFBWSxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFlBQVksTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0MsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3pDLGdCQUFnQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxhQUFhO0FBQ2IsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNuQyxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQyxRQUFRLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUUsU0FBUztBQUNULFFBQVEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLFFBQVEsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxRSxTQUFTO0FBQ1QsUUFBUSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNwQixRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDakQsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFFBQVEsTUFBTSxHQUFHLEdBQUcsSUFB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQztBQUNBLFFBQVEsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFRLENBQUMsQ0FBQztBQUM1RCxRQUFRLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBUSxDQUFDLENBQUM7QUFDNUQ7QUFDQSxRQUFRLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hDLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQyxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBTyxDQUFDLENBQUM7QUFDOUQ7QUFDQSxRQUFRLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdEUsUUFBUSxNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMs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QU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hFO0FBQ0EsUUFBUSxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQztBQUNBLFFBQVEsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDMUIsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFD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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQixRQUFRLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDN0I7QUFDQSxRQUFRLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEUsUUFBUSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDM0Q7QUFDQSxRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQ25CLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDaEIsUUFBUSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUM3QyxRQUFRLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDN0I7QUFDQSxRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0MsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3QixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzNCO0FBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQ2QsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ25CLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FB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LFFBQVEsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFJLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELElBQUksTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRDtBQUNBLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0I7QUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRSxL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O0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0EsU0FBUyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUU7QUFDL0IsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHQSxLQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEM7QUFDQSxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBR0MsS0FBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkM7QUFDQSxJQUFJLE9BQU8sQ0FBQ0MsT0FBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNwQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEMsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHQyxLQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDbkI7QUFDQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzVCLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzdCLFFBQVEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDakQsS0FBSztBQUNMO0FBQ0EsSUFBSSxDQUFDLENBQUMsVUFBVSxH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Q3hCLFFBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RELEtBQUssQ0FBQztBQUNOLENBQUM7QUFDRDtBQUNBLFNBQVMsVUFBVSxDQUFDLENBQUMsRUFBRTtBQUN2QixJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsV0FBVztBQUN4QixRQUFRLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0RCxLQUFLLENBQUM7QUFDTixDQUFDO0FBQ0Q7QUFDQSxTQUFTLFdBQVcsQ0FBQyxDQUFDLEVBQUU7QUFDeEI7QUFDQSxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUdELEtBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUdHLEtBQVUsRUFBRUYsS0FBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekQ7QUFDQSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLEVBQUU7QUFDekIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzdDO0FBQ0E7QUFDQSxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QztBQUNBLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLElBQUksQ0FBQztBQUNwRDtBQUNBLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdB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QUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0IsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsS0FBSyxDQUFDO0FBQ04sQ0FBQztBQUNEO0FBQ0E7QUFDQSxTQUFTLFlBQVksQ0FBQyxDQUFDLEVBQUU7QUFDekIsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLFdBQVc7QUFDeEIsUUFBUSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsS0FBSyxDQUFDO0FBQ047O0FDaEtBLFNBQVMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEM7QUFDQSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1RDtBQUNBLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNEO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekQ7QUFDQSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFdBQVcsQ0FBQyxFQUFFLEVBQUU7QUFDekIsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLElBQUksWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqQyxJQUFJLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDO0FBQ0EsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLElBQUksWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqQyxJQUFJLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFDRDtBQUNlLE1BQU0sTUFBTSxDQUFDO0FBQzVCO0FBQ0EsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDckIsWUFBWSxVQUFVO0FBQ3RCLFlBQVksVUFBVTtBQUN0QixZQUFZLFVBQVU7QUFDdEIsWUFBWSxVQUFVO0FBQ3RCLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuQixZQUFZLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkIsWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25CLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuQixZQUFZLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkIsWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25CLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuQixZQUFZLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkIsWUFBWSxDQUFDO0FBQ2IsWUFBWSxDQUFDO0FBQ2IsWUFBWSxDQUFDO0FBQ2IsWUFBWSxDQUFDO0FBQ2IsU0FBUyxDQUFDO0FBQ1YsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLEdBQUc7QUFDZCxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzFDLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxHQUFHO0FBQ2QsUUFBUSxPQUFPRyxLQUFVLENBQUNDLEtBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDbkYsS0FBSztBQUNMO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sR0FBRztBQUNiO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RDtBQUNBO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEQ7QUFDQTtBQUNBLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRjtBQUNBLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDckI7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEQsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU87QUFDeEMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUs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R0FBRyxHQUFHLENBQUMsRUFBRTtBQUNyQixZQUFZLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQzVCLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckQsWUFBWSxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLFNBQVMsTUFBTTtBQUNmLFlBQVksT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyRCxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLFFBQVEsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDaEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ1gsUUFBUSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1QixLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZCLFFBQVEsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzlCLEtBQUs7QUFDTDtBQUNBLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixRQUFRLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNiLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxRQUFRLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN2QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2IsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDeEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxRQUFRLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUN4QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2YsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwRCxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDWCxRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3BEO0FBQ0EsUUFBUSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBUSxPQUFPLElBQUksRUFBRTtBQUNyQixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDM0IsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxTQUFTO0FBQ1QsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBUSxPQUFPLENBQUMsQ0FBQztBQUNqQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBT0MsS0FBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBT0EsS0FBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNmLFFBQVEsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxRQUFRLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2hELEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0MsUUFBUSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNoRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2YsUUFBUSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFFBQVEsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDaEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ1osUUFBUSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNsQyxRQUFRLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2hELEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDeEMsWUFBWSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztBQUM3QyxZQUFZLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3BELFNBQVMsTUFBTTtBQUNmLFlBQVksTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQzdDLGdCQUFnQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0IsYUFBYSxNQUFNO0FBQ25CLGdCQUFnQixPQUFPLEVBQUUsQ0FBQztBQUMxQixhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDeEMsWUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsU0FBUyxNQUFNO0FBQ2YsWUFBWSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFZLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDN0MsZ0JBQWdCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2xELGdCQUFnQixPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN4RCxhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNmLFFBQVEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNaLFFBQVEsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQzdCLEtBQUs7QUFDTDtBQUNBLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNoQjtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztBQUN0QztBQUNBO0FBQ0EsUUFBUSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxRQUFRLEtBQUssR0FBRyxJQUFJLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQztBQUNyQztBQUNBLFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN2QixRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDOUIsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO0FBQy9EO0FBQ0EsUUFBUSxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUc7QUFDMUIsWUFBWSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFlBQVksT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHO0FBQzlCLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztBQUNwQixnQkFBZ0IsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsYUFBYTtBQUNiO0FBQ0E7QUFDQSxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RDtBQUNBLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQixZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMs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QUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBR0EsMEJBQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DO0FBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDNUIsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkMsWUFBWSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDM0IsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0I7QUFDQSxRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO0FBQ2hDLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRDtBQUNBLFFBQVEsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLEtBQUs7QUFDTDtBQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDWDtBQUNBLFFBQVEsTUFBTSxHQUFHLEdBQUdBLDBCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDO0FBQ0EsUUFBUSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkM7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFFBQVEsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM3QixZQUFZLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxTQUFTO0FBQ1QsUUFBUSxPQUFPLEdBQUcsQ0FBQztBQUNuQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEIsWUFBWSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsU0FBUyxNQUFNO0FBQ2YsWUFBWSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QyxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ1gsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNqQyxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN2QixRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQ0EsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLEtBQUs7QUFDTDtBQUNBLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixRQUFRLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNiLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCLEtBQUs7QUFDTDtBQUNBLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekQsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekQsUUFBUSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1RCxRQUFRLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNmLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVELFFBQVEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNYLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVELFFBQVEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNmLFFBQVEsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFD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QUksUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pCLFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDdkIsUUFBUSxPQUFPQyxTQUFnQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN2QixRQUFRLE9BQU9DLFNBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN4QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN4QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQsS0FBSztBQUNMO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ2UsTUFBTSxPQUFPLENBQUM7QUFDN0Is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QUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNYLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RCxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLFFBQVEsT0FBTztBQUNmLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNoQyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDaEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxD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USxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLEtBQUs7QUFDTDtBQUNBLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQy9DLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDaEQsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztBQUMvQyxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNiLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDZCxRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcs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QUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNlLE1BQU0sT0FBTyxDQUFDO0FBQzdCLElBQUksV0FBVyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUU7QUFDL0IsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxRCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUNyQyxRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QixRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdB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QUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDL0MsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNoRCxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQy9DLFFBQVEsT0FBTyxLQUFLLENBQUM7QUFDckIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTDtBQUNBLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDYixRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2QsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNkLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNuRSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3hCLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN4QixRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDdkIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFFBQVEsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDNUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN2QixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25CLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckQsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsUUFBUSxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1QixLQUFLO0FBQ0w7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QUFDLENBQUMsR0FBRyxDQUFDO0FBQ3ZELFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0QsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNoQjtBQUNBLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN6QjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDOUMsUUFBUSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUM5QztBQUNBLFFBQVEsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakM7QUFDQSxRQUFRLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdkMsUUFBUSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3ZDO0FBQ0EsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUN6QyxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO0FBQ3pDO0FBQ0EsUUFBUSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM5QyxRQUFRLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUM1QyxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQzVDO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3hDLFlBQVksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLFNBQVM7QUFDVDtBQUNBLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDbkM7QUFDQSxRQUFRLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBQzdDO0FBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDekMsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNqQztBQUNBLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsV0FBVyxFQUFFLENBQUM7QUFDckQsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFF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LENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEYsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ3hEO0FBQ0EsUUFBUSxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3ZDLFFBQVEsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN2QztBQUNBLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDekMsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUN6QztBQUNBLFFBQVEsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDOUMsUUFBUSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM5QztBQUNBLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7QUFDNUMsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUM1QztBQUNBLFFBQVEsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFD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QyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6QixRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzVCLFlBQVksTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFZLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVCxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDdkIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RCxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbEQsWUFBWSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDN0IsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZCLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkIsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEQsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2xELFlBQVksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzdCLFNBQVM7QUFDVCxRQUFRLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN4QixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25CLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNsRCxZQUFZLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztBQUM3QixTQUFTO0FBQ1QsUUFBUSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDekIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2xELFlBQVksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzdCLFNBQVM7QUFDVCxRQUFRLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLEtBQUs7QUFDTDtBQUNBLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDeEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbEQsWUFBWSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDN0IsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDL0IsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztBQUMxQyxRQUFRLE1BQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CO0FBQ0EsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDOUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwQyxRQUFRLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pDO0FBQ0EsUUFBUSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQjtBQUNBLFFBQVEsSUFB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Q0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQixJQUFJQSxXQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUdDLFVBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUNEO0FBQ0EsU0FBU0EsVUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDN0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDZixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNoQixJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2xCLFFBQVEsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2YsS0FBSztBQUNMLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBQ0Q7QUFDQSxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDbEQsSUFBSSxPQUFPO0FBQ1gsUUFBUUQsV0FBUyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDN0IsU0FBU0EsV0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsU0FBU0EsV0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0MsU0FBU0EsV0FBUyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDckMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLEVBQUUsQ0FBQztBQUM3QjtBQUNBLElBQUksUUFBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLFVBQVUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsVUFBVSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLFVBQVUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsVUFBVSxPQUFPLENBQUMsRUFBRSxHQUFHO0FBQzVSLENBQUMsQ0FBQztBQUNGO0FBQ0EsS0FBSyxDQUFDLGVBQWUsR0FBRyxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzlELElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7QUFDckMsSUFBSSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO0FBQzFCLFFBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RELEtBQUs7QUFDTCxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUIsUUFBUSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNqQixZQUFZLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekQsWUFBWSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pFLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxJQUFJO0FBQ1gsSUFBSSxVQUFVO0FBQ2QsVUFBSUUsTUFBSTtBQUNSLElBQUksZUFBZTtBQUNuQixzQkFBSVIsa0JBQWdCO0FBQ3BCLHdCQUFJQyxvQkFBa0I7QUFDdEIsZ0JBQUlDLFlBQVU7QUFDZCxnQkFBSUMsWUFBVTtBQUNkLGdCQUFJQyxZQUFVO0FBQ2QsZ0JBQUlDLFlBQVU7QUFDZCxDQUFDLEdBQUcsS0FBSzs7Ozs7Ozs7Ozs7Ozs7O0FDckVULE1BQU0sU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDeEI7QUFDZSxNQUFNLFNBQVMsQ0FBQztBQUMvQjtBQUNBLElBQUksV0FBVyxDQUFDLElBQUksRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQzFCLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDL0IsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUU7QUFDN0MsWUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEQsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDbEIsUUFBUSxLQUFLLEVBQUUsS0FBSyxTQUFTLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDckQsUUFBUSxLQUFLLEVBQUUsS0FBSyxTQUFTLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2QyxRQUFRLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDMUI7QUFDQSxRQUFRLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ3JELFFBQVEsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDO0FBQzVEO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLFlBQVksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDbkY7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDO0FBQ2pCO0FBQ0EsUUFBUSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDMUIsUUFBUSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO0FBQy9CO0FBQ0EsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDcEIsUUFBUSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDcEI7QUFDQSxZQUFZLE1BQU0sQ0FBQyxHQUFH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TyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMxQixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEYsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUNuQixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3RSxRQUFRLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FB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QUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3RCxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsRDtBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hGLFFBQVEsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMxQixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEYsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUNuQixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3RSxRQUFRLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxPQUFPLENBQUMsQ0FBQyxJ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QUFDTDtBQUNBLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNoQixRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRCxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRSxRQUFRLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDVixRQUFRLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDVixRQUFRLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLEtBQUs7QUFDTDtBQUNBOztBQ2xMZSxNQUFNLFVBQVUsQ0FBQztBQUNoQztBQUNBLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQy9CLFFBQVEsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUM3QjtBQUNBLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN6QixRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEM7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0QsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEQ7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RixRQUFRLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFRLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RGLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7QUFDbkIsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0UsUUFBUSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFD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UUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RyxRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ1osUUFBUSxJQUFJLENBQUMsWUFBWSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ25ELFlBQVksTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFlBQVksTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFlBQVksTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFlBQVksTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFlBQVksT0FBTyxHQUFHLENBQUM7QUFDdkIsU0FBUyxNQUFNO0FBQ2YsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFDLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRSxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0UsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLFFBQVEsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNqQixRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxRQUFRLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQ25CLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsUUFBUSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUM1QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDaEIsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDNUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsUUFBUSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFRLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ1YsUUFBUSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsS0FBSztBQUNMO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ1YsUUFBUSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ1YsUUFBUSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsS0FBSztBQUNMO0FBQ0E7O0FDOUxlLE1BQU0sU0FBUyxDQUFDO0FBQy9CO0FBQ0EsSUFBSSxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDcEQsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQzdCLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkI7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRSxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdELFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMxQixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUM7QUFDQSxRQUFRLElBQUksUUFBUSxFQUFFO0FBQ3RCLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBR0QsUUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLGNBQWMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEYsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUYsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRixRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUYsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEYsUUFBUSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDMUIsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFRLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJ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LElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUN6QyxZQUFZLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEUsWUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlFLFlBQVksTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRSxZQUFZLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxQyxTQUFTLE1BQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoRCxZQUFZLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEUsWUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVB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QyxDQUFDLENBQUM7QUFDbkUsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUNkLFFBQVEsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUN6QyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFNBQVMsTUFBTTtBQUNmLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUMsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsUUFBUSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQ2QsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQ3pCLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFNBQVMsTUFBTTtBQUNmLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzNCLFNBQVM7QUFDVCxRQUFRLElB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RUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDN0IsUUFBUSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkQsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM3QixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JELEtBQUs7QUFDTDtBQUNBLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNsQixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzlDLFFBQVEsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDO0FBQzlCLFFBQVEsT0FBTyxHQUFHLENBQUM7QUFDbkIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFNBQVMsR0FBRztBQUN0QixRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRCxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELFNBQVM7QUFDVCxRQUFRLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxD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QSxZQUFZLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM1QjtBQUNBLFlBQVksTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ25FO0FBQ0EsWUFBWSxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ25FO0FBQ0EsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEU7QUFDQSxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMs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RSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxSCw0QkFBNEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxSCx5QkFBeUI7QUFDekIsd0JBQXdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDekYsd0JBQXdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDekYscUJBQXFCLE1BQU07QUFDM0Isd0JBQXdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDekYsd0JBQXdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDekYscUJBQXFCO0FBQ3JCLG9CQUFvQixVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLO0FBQ3RFLHdCQUF3QixJQUFJLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlJLHdCQUF3QixPQUFPLENBQUMsQ0FBQztBQUNqQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7QUFDeEIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBLFlBQVksTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RELFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekQsb0JBQW9CLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELG9CQUFvQixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFvQixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakQsb0JBQW9CLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0Msb0JBQW9CLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksSUFBSSxZQUFZLFNBQVMsRUFBRTtBQUN2QyxZQUFZLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsU0FBUyxNQUFNO0FBQ2YsWUFBWSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25ELFNBQVM7QUFDVCxRQUFRLElBQUksT0FBTyxFQUFFO0FBQ3JCLFlBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLFlBQVksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO0FBQ3hCLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsZ0JBQWdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFDLGdCQUFnQixDQUFDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQztBQUN4QyxnQkFBZ0IsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsYUFBYTtBQUNiLFlBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkUsWUFBWSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixTQUFTLE1BQU07QUFDZixZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUMsZ0JBQWdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0QsZ0JBQWdCLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksV0FBVyxFQUFFO0FBQ3pCLFlBQVksT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxTQUFTLE1BQU07QUFDZixZQUFZLE9BQU8sT0FBTyxDQUFDO0FBQzNCLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLGVBQWUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDckUsUUFBUSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDbkIsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3RDtBQUNBLFFBQVEsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQzVCO0FBQ0EsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDcEg7QUFDQSxRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNoRixRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNoRjtBQUNBLFFBQVEsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pEO0FBQ0EsUUFBUSxJQUFJLE9BQU8sQ0FBQztBQUNwQixRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDMUMsWUFBWSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxTQUFTLE1BQU07QUFDZixZQUFZLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRDtBQUNBLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMO0FBQ0EsSUFBSSxlQUFlLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ3hFLFFBQVEsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25CLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0Q7QUFDQSxRQUFRLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUM1QjtBQUNBLFFBQVEsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzlFLFFBQVEsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzlFO0FBQ0EsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLE1BQU0sSUFBSSxHQUFHLE1BQU0sV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3SDtBQUNBLFFBQVEsSUFBSSxPQUFPLENBQUM7QUFDcEIsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzFDLFlBQVksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsU0FBUyxNQUFNO0FBQ2YsWUFBWSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsUUFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQ7QUFDQSxRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxlQUFlLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUNqRyxRQUFRLE1BQU0sY0FBYyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDckMsUUFBUSxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLE1BQU0sQ0FBQztBQUNuQixRQUFRLElBQUksUUFBUSxFQUFFLFNBQVMsQ0FBQztBQUNoQyxRQUFRLElBQUksSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7QUFDNUI7QUFDQSxRQUFRLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtBQUMvQixZQUFZLElBQUksTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUNwQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixnQkFBZ0IsUUFBUSxHQUFHLHFCQUFxQixDQUFDO0FBQ2pELGFBQWEsTUFBTTtBQUNuQixnQkFBZ0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixhQUFhO0FBQ2IsWUFBWSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQVksTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDL0IsWUFBWSxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDckMsZ0JBQWdCLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztBQUNoRCxnQkFBZ0IsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsYUFBYTtBQUNiLFNBQVMsTUFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDdEMsWUFBWSxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDcEMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsZ0JBQWdCLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQztBQUNqRCxhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsYUFBYTtBQUNiLFlBQVksTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDL0IsWUFBWSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQVksSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQ3JDLGdCQUFnQixTQUFTLEdBQUcsbUJBQW1CLENBQUM7QUFDaEQsZ0JBQWdCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsYUFBYSxNQUFNO0FBQ25CLGdCQUFnQixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLGFBQWE7QUFDYixTQUFTLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3RDLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDeEIsWUFBWSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUN6QixZQUFZLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3pCLFlBQVksTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakMsU0FBUyxNQUFNO0FBQ2YsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdDLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDbEQsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDbkQsU0FBUztBQUNULFFBQVEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzNELFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJQSxNQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDM0MsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDeEQsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLFNBQVMsR0FBRyxjQUFjLEVBQUUsU0FBUyxHQUFHLGNBQWMsQ0FBQztBQUNuRSxRQUFRLElBQUksU0FBUyxHQUFHLGNBQWMsRUFBRSxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ25FO0FBQ0EsUUFBUSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDOUI7QUFDQSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRTtBQUNqRCxZQUFZLElBQUksTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RixZQUFZLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN0RDtBQUNBLFlBQVksTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxZQUFZLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM1QjtBQUNBLFlBQVksTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNyRCxZQUFZLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckQ7QUFDQSxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVELFlBQVksSUFBSSxRQUFRLEVBQUU7QUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakcsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakcsYUFBYTtBQUNiLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDNUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4QixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEIsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4QixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNCLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDaEIsWUFBWSxJQUFJLFNBQVMsRUFBRTtBQUMzQixnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRyxhQUFhO0FBQ2IsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqRSxZQUFZLFVBQVUsQ0FBQyxJQUFJO0FBQzNCLGdCQUFnQixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSztBQUNsRCxvQkFBb0IsSUFBSSxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlGLG9CQUFvQixPQUFPLENBQUMsQ0FBQztBQUM3QixpQkFBaUIsQ0FBQztBQUNsQixhQUFhLENBQUM7QUFDZCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyRDtBQUNBLFFBQVEsSUFBSSxZQUFZLENBQUM7QUFDekIsUUFBUSxJQUFJLFlBQVksQ0FBQztBQUN6QixRQUFRLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFO0FBQ3BDLFlBQVksWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RCxZQUFZLFlBQVksR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQsU0FBUyxNQUFNO0FBQ2YsWUFBWSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hELFlBQVksWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqQixRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFlBQVksWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsWUFBWSxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QyxZQUFZLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1QyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxlQUFlLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDckUsUUFBUSxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDM0UsS0FBSyxDQUFDO0FBQ047QUFDQSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsZUFBZSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ3RFLFFBQVEsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFFLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxDQUFDLENBQUMsbUJBQW1CLEdBQUcsZ0JBQWdCLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDdEYsUUFBUSxNQUFNLEdBQUcsTUFBTSxJQUFJLFFBQVEsQ0FBQztBQUNwQyxRQUFRLE9BQU8sR0FBRyxPQUFPLElBQUksUUFBUSxDQUFDO0FBQ3RDO0FBQ0EsUUFBUSxJQUFJLEdBQUcsQ0FBQztBQUNoQixRQUFRLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtBQUMvQixZQUFZLElBQUksTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUNwQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsYUFBYTtBQUNiLFNBQVMsTUFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDdEMsWUFBWSxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDcEMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsYUFBYSxNQUFNO0FBQ25CLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLGFBQWE7QUFDYixTQUFTLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3RDLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDeEIsU0FBUyxNQUFNO0FBQ2YsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdDLFNBQVM7QUFDVDtBQUNBLFFBQVEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUM7QUFDN0MsUUFBUSxNQUFNLElBQUksR0FBR0EsTUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNoRCxZQUFZLElBQUksTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUNoRixZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztBQUN0RSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsWUFBWSxPQUFPLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDMUUsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMzQixZQUFZLElBQUksTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUMxRSxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUNqRSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEQsUUFBUSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRTtBQUNBO0FBQ0EsUUFBUSxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELFFBQVEsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUM5RDtBQUNBLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsTUFBTSxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDaEo7QUFDQSxRQUFRLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUM1QjtBQUNBLFFBQVEsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RixRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkY7QUFDQSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxPQUFPLENBQUM7QUFDcEIsUUFBUSxJQUFJLEVBQUUsQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ3JDLFlBQVksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsU0FBUyxNQUFNO0FBQ2YsWUFBWSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEIsUUFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkM7QUFDQSxRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLGVBQWUsTUFBTSxDQUFDLElBQUksRUFBRTtBQUMzQyxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixRQUFRLElBQUksTUFBTSxFQUFFLFNBQVMsQ0FBQztBQUM5QixRQUFRLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtBQUMvQixZQUFZLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFDbEMsWUFBWSxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQ3RDLFNBQVMsTUFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDdEMsWUFBWSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFlBQVksU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUN0QyxTQUFTLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3RDLFlBQVksTUFBTSxHQUFHLFlBQVksQ0FBQztBQUNsQyxZQUFZLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFDdEMsU0FBUyxNQUFNO0FBQ2YsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdDLFNBQVM7QUFDVDtBQUNBLFFBQVEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsTUFBTSxLQUFLLEdBQUdBLE1BQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQztBQUNBLFFBQVEsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJQSxNQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsUUFBUSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDOUM7QUFDQSxRQUFRLE1BQU0sY0FBYyxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDakQ7QUFDQSxRQUFRLE1BQU0sVUFBVSxHQUFHQSxNQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEQ7QUFDQSxRQUFRLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM5QixRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEMsWUFBWSxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7QUFDNUIsWUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQ2hFLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDNUIsb0JBQW9CLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQztBQUN6QyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUNwQixhQUFhO0FBQ2IsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQVksVUFBVSxDQUFDLElBQUk7QUFDM0IsZ0JBQWdCLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBQ3BDLGFBQWEsQ0FBQztBQUNkLFNBQVM7QUFDVDtBQUNBLFFBQVEsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JEO0FBQ0EsUUFBUSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFO0FBQ0E7QUFDQSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELFlBQVksTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3QyxZQUFZLE1BQU0sZUFBZSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdEQsWUFBWSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDbEMsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6RCxvQkFBb0IsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyRSxvQkFBb0IsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxvQkFBb0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDckQsb0JBQW9CLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDekU7QUFDQSxvQkFBb0IsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3BDLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNFLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNFLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN2RSx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDaEMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQztBQUM3Qyx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDaEMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BGLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BGLG9CQUFvQixVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRCxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0EsWUFBWSxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEQsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6RCxvQkFBb0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDckQsb0JBQW9CLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDekUsb0JBQW9CLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqRCxvQkFBb0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxvQkFBb0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFDeEIsUUFBUSxJQUFJLElBQUksWUFBWSxTQUFTLEVBQUU7QUFDdkMsWUFBWSxXQUFXLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFNBQVMsTUFBTTtBQUNmLFlBQVksV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyRCxTQUFTO0FBQ1QsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLFlBQVksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNwQyxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE9BQU8sV0FBVyxDQUFDO0FBQzNCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLGVBQWUsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUNqRSxRQUFRLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixRQUFRLElBQUksTUFBTSxDQUFDO0FBQ25CLFFBQVEsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQy9CLFlBQVksTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUNuQyxTQUFTLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3RDLFlBQVksTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUNuQyxTQUFTLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3RDLFlBQVksTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUNuQyxTQUFTLE1BQU07QUFDZixZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0MsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUNsRCxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNuRCxTQUFTO0FBQ1QsUUFBUSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDMUQsUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUlBLE1BQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMzQyxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN4RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSUEsTUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNoRCxRQUFRLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUM5QztBQUNBLFFBQVEsTUFBTSxjQUFjLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUNqRDtBQUNBO0FBQ0EsUUFBUSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDOUIsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLFlBQVksTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzVCO0FBQ0EsWUFBWSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUM1RSxZQUFZLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdkYsWUFBWSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZGLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0QsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1RCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxN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QztBQUMxRTtBQUNBO0FBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDckI7QUFDQSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUdLLEdBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxDQUFDLENBQUMsR0FBR0EsR0FBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDN0IsSUFBSSxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNsQixJQUFJLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzFDLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxJQUFJLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMs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
