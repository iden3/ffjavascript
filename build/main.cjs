'use strict';

var crypto = require('crypto');
var os = require('os');
var Worker = require('web-worker');

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
    let acc =BigInt(0);
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
    return BigInt(a) < BigInt(0);
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
    return (BigInt(a) & BigInt(1)) == BigInt(1);
}


function naf(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & BigInt(1)) {
            const z = 2 - Number(E % BigInt(4));
            res.push( z );
            E = E - BigInt(z);
        } else {
            res.push( 0 );
        }
        E = E >> BigInt(1);
    }
    return res;
}


function bits(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & BigInt(1)) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E >> BigInt(1);
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

function exp$1(a, b) {
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

// Returns a buffer with Little Endian Representation
function toRprLE(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new Uint32Array(buff.buffer, buff.byteOffset + o, n8/4);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v[i] = parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16);
    for (let i=l; i<v.length; i++) v[i] = 0;
    for (let i=v.length*4; i<n8; i++) buff[i] = toNumber(band(shiftRight(e, i*8), 0xFF));
}

// Returns a buffer with Big Endian Representation
function toRprBE(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v.setUint32(n8-i*4 -4, parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16), false);
    for (let i=0; i<n8/4-l; i++) v[i] = 0;
}

// Pases a buffer with Little Endian Representation
function fromRprLE(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    o = o || 0;
    const v = new Uint32Array(buff.buffer, buff.byteOffset + o, n8/4);
    const a = new Array(n8/4);
    v.forEach( (ch,i) => a[a.length-i-1] = ch.toString(16).padStart(8,"0") );
    return fromString(a.join(""), 16);
}

// Pases a buffer with Big Endian Representation
function fromRprBE(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    o = o || 0;
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const a = new Array(n8/4);
    for (let i=0; i<n8/4; i++) {
        a[i] = v.getUint32(i*4, false).toString(16).padStart(8, "0");
    }
    return fromString(a.join(""), 16);
}

function toString(a, radix) {
    return a.toString(radix);
}

function toLEBuff(a) {
    const buff = new Uint8Array(Math.floor((bitLength(a) - 1) / 8) +1);
    toRprLE(buff, 0, a, buff.byteLength);
    return buff;
}

const zero = e(0);
const one = e(1);

var _Scalar = /*#__PURE__*/Object.freeze({
    __proto__: null,
    abs: abs,
    add: add,
    band: band,
    bitLength: bitLength,
    bits: bits,
    bor: bor,
    bxor: bxor,
    div: div,
    e: e,
    eq: eq,
    exp: exp$1,
    fromArray: fromArray,
    fromRprBE: fromRprBE,
    fromRprLE: fromRprLE,
    fromString: fromString,
    geq: geq,
    gt: gt,
    isNegative: isNegative,
    isOdd: isOdd,
    isZero: isZero,
    land: land,
    leq: leq,
    lnot: lnot,
    lor: lor,
    lt: lt,
    mod: mod,
    mul: mul,
    naf: naf,
    neg: neg,
    neq: neq,
    one: one,
    pow: pow,
    shiftLeft: shiftLeft,
    shiftRight: shiftRight,
    shl: shl,
    shr: shr,
    square: square,
    sub: sub,
    toArray: toArray,
    toLEBuff: toLEBuff,
    toNumber: toNumber,
    toRprBE: toRprBE,
    toRprLE: toRprLE,
    toString: toString,
    zero: zero
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

        if ((b.length <= 2) || (b.length < log2$2(a.length))) {
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
        const bitsResult = log2$2(longestN-1)+2;
        this._setRoots(bitsResult);

        const m = 1 << bitsResult;
        const ea = this.extend(a,m);
        const eb = this.extend(b,m);

        const ta = __fft$1(this, ea, bitsResult, 0, 1);
        const tb = __fft$1(this, eb, bitsResult, 0, 1);

        const tres = new Array(m);

        for (let i=0; i<m; i++) {
            tres[i] = this.F.mul(ta[i], tb[i]);
        }

        const res = __fft$1(this, tres, bitsResult, 0, 1);

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

    evaluate(p,x) {
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
                    this.F.inv(this.evaluate(mpol, points[i][0])),
                    points[i][1]);
            mpol = this.mulScalar(mpol, factor);
            sum = this.add(sum, mpol);
        }
        return sum;
    }


    fft(p) {
        if (p.length <= 1) return p;
        const bits = log2$2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res = __fft$1(this, ep, bits, 0, 1);
        return res;
    }

    fft2(p) {
        if (p.length <= 1) return p;
        const bits = log2$2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res = __fft2(this, ep, bits);
        return res;
    }


    ifft(p) {

        if (p.length <= 1) return p;
        const bits = log2$2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res =  __fft$1(this, ep, bits, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }


    ifft2(p) {

        if (p.length <= 1) return p;
        const bits = log2$2(p.length-1)+1;
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
        const kbits = log2$2(v.length-1)+1;
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
        const kbits = log2$2(_v.length-1)+1;
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
        let nbits = log2$2(n-1)+1;
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
        return log2$2(V);
    }
}

function log2$2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
}


function __fft$1(PF, pall, bits, offset, step) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[offset] ];
    } else if (n==2) {
        return [
            PF.F.add(pall[offset], pall[offset + step]),
            PF.F.sub(pall[offset], pall[offset + step])];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft$1(PF, pall, bits-1, offset, step*2);
    const p2 = __fft$1(PF, pall, bits-1, offset+step, step*2);

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

function rev(idx, bits) {
    return (
        _revTable$1[idx >>> 24] |
        (_revTable$1[(idx >>> 16) & 0xFF] << 8) |
        (_revTable$1[(idx >>> 8) & 0xFF] << 16) |
        (_revTable$1[idx & 0xFF] << 24)
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

    if (isZero(e)) return F.zero;

    const n = naf(e);

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


function exp(F, base, e) {

    if (isZero(e)) return F.one;

    const n = bits(e);

    if (n.length==0) return F.one;

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
        if (eq(mod(F.p, 4), 1 )) {
            if (eq(mod(F.p, 8), 1 )) {
                if (eq(mod(F.p, 16), 1 )) {
                    // alg7_muller(F);
                    alg5_tonelliShanks(F);
                } else if (eq(mod(F.p, 16), 9 )) {
                    alg4_kong(F);
                } else {
                    throw new Error("Field withot sqrt");
                }
            } else if (eq(mod(F.p, 8), 5 )) {
                alg3_atkin(F);
            } else {
                throw new Error("Field withot sqrt");
            }
        } else if (eq(mod(F.p, 4), 3 )) {
            alg2_shanks(F);
        }
    } else {
        const pm2mod4 = mod(pow(F.p, F.m/2), 4);
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
    F.sqrt_q = pow(F.p, F.m);

    F.sqrt_s = 0;
    F.sqrt_t = sub(F.sqrt_q, 1);

    while (!isOdd(F.sqrt_t)) {
        F.sqrt_s = F.sqrt_s + 1;
        F.sqrt_t = div(F.sqrt_t, 2);
    }

    let c0 = F.one;

    while (F.eq(c0, F.one)) {
        const c = F.random();
        F.sqrt_z = F.pow(c, F.sqrt_t);
        c0 = F.pow(F.sqrt_z, 2 ** (F.sqrt_s-1) );
    }

    F.sqrt_tm1d2 = div(sub(F.sqrt_t, 1),2);

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

    F.sqrt_q = pow(F.p, F.m);
    F.sqrt_e1 = div( sub(F.sqrt_q, 3) , 4);

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
    F.sqrt_q = pow(F.p, F.m/2);
    F.sqrt_e34 = div( sub(F.sqrt_q, 3) , 4);
    F.sqrt_e12 = div( sub(F.sqrt_q, 1) , 2);

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
        return add(mul(this.nextU32(), 0x100000000), this.nextU32());
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

function getRandomBytes(n) {
    let array = new Uint8Array(n);
    // Feature-detect rather than rely on `process.browser` (undefined under
    // Vite/esbuild/SES -> ReferenceError). Prefer Node crypto (no per-call size
    // limit); fall back to Web Crypto chunked to its 65536-byte cap.
    if (crypto && crypto.randomFillSync) { // Node
        crypto.randomFillSync(array);
    } else if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
        for (let i = 0; i < n; i += 65536) {
            globalThis.crypto.getRandomValues(array.subarray(i, Math.min(i + 65536, n)));
        }
    } else { // insecure last resort
        for (let i=0; i<n; i++) {
            array[i] = (Math.random()*4294967296)>>>0;
        }
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

class FFT {
    constructor (G, F, opMulGF) {
        this.F = F;
        this.G = G;
        this.opMulGF = opMulGF;

        let rem = F.sqrt_t || F.t;
        let s = F.sqrt_s || F.s;

        let nqr = F.one;
        while (F.eq(F.pow(nqr, F.half), F.one)) nqr = F.add(nqr, F.one);

        this.w = new Array(s+1);
        this.wi = new Array(s+1);
        this.w[s] = this.F.pow(nqr, rem);
        this.wi[s] = this.F.inv(this.w[s]);

        let n=s-1;
        while (n>=0) {
            this.w[n] = this.F.square(this.w[n+1]);
            this.wi[n] = this.F.square(this.wi[n+1]);
            n--;
        }


        this.roots = [];
        /*
        for (let i=0; i<16; i++) {
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
        this._setRoots(Math.min(s, 15));
    }

    _setRoots(n) {
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

    fft(p) {
        if (p.length <= 1) return p;
        const bits = log2$1(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        if (p.length != m) {
            throw new Error("Size must be multiple of 2");
        }
        const res = __fft(this, p, bits, 0, 1);
        return res;
    }

    ifft(p) {

        if (p.length <= 1) return p;
        const bits = log2$1(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        if (p.length != m) {
            throw new Error("Size must be multiple of 2");
        }
        const res =  __fft(this, p, bits, 0, 1);
        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.opMulGF(res[(m-i)%m], twoinvm);
        }

        return resn;
    }


}

function log2$1( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
}


function __fft(PF, pall, bits, offset, step) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[offset] ];
    } else if (n==2) {
        return [
            PF.G.add(pall[offset], pall[offset + step]),
            PF.G.sub(pall[offset], pall[offset + step])];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft(PF, pall, bits-1, offset, step*2);
    const p2 = __fft(PF, pall, bits-1, offset+step, step*2);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.G.add(p1[i], PF.opMulGF(p2[i], PF.roots[bits][i]));
        out[i+ndiv2] = PF.G.sub(p1[i], PF.opMulGF(p2[i], PF.roots[bits][i]));
    }

    return out;
}

/* global BigInt */

class ZqField {
    constructor(p) {
        this.type="F1";
        this.one = BigInt(1);
        this.zero = BigInt(0);
        this.p = BigInt(p);
        this.m = 1;
        this.negone = this.p-this.one;
        this.two = BigInt(2);
        this.half = this.p >> this.one;
        this.bitLength = bitLength(this.p);
        this.mask = (this.one << BigInt(this.bitLength)) - this.one;

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = this.e(this.one << BigInt(this.n64*64));
        this.Ri = this.inv(this.R);

        const e = this.negone >> this.one;
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.nqr + this.one;
            r = this.pow(this.nqr, e);
        }


        this.s = 0;
        this.t = this.negone;

        while ((this.t & this.one) == this.zero) {
            this.s = this.s + 1;
            this.t = this.t >> this.one;
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);

        this.FFT = new FFT(this, this, this.mul.bind(this));

        this.fft = this.FFT.fft.bind(this.FFT);
        this.ifft = this.FFT.ifft.bind(this.FFT);
        this.w = this.FFT.w;
        this.wi = this.FFT.wi; 
    
        this.shift = this.square(this.nqr);
        this.k = this.exp(this.nqr, 2**this.s);
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

        let t = this.zero;
        let r = this.p;
        let newt = this.one;
        let newr = a % this.p;
        while (newr) {
            let q = r/newr;
            [t, newt] = [newt, t-q*newt];
            [r, newr] = [newr, r-q*newr];
        }
        if (t<this.zero) t += this.p;
        return t;
    }

    mod(a, b) {
        return a % b;
    }

    pow(b, e) {
        return exp(this, b, e);
    }

    exp(b, e) {
        return exp(this, b, e);
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
                return this.zero;
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
        return (a && b) ? this.one : this.zero;
    }

    lor(a, b) {
        return (a || b) ? this.one : this.zero;
    }

    lnot(a) {
        return (a) ? this.zero : this.one;
    }

    sqrt_old(n) {

        if (n == this.zero) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone >> this.one);
        if ( res != this.one ) return null;

        let m = this.s;
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one) >> this.one );

        while ( t != this.one ) {
            let sq = this.square(t);
            let i = 1;
            while (sq != this.one ) {
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

        if (r > (this.p >> this.one)) {
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
        let res =this.zero;
        for (let i=0; i<nBytes; i++) {
            res = (res << BigInt(8)) + BigInt(getRandomBytes(1)[0]);
        }
        return res % this.p;
    }

    toString(a, base) {
        base = base || 10;
        let vs;
        if ((a > this.half)&&(base == 10)) {
            const v = this.p-a;
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }
        return vs;
    }

    isZero(a) {
        return a == this.zero;
    }

    fromRng(rng) {
        let v;
        do {
            v=this.zero;
            for (let i=0; i<this.n64; i++) {
                v += rng.nextU64() << BigInt(64 *i);
            }
            v &= this.mask;
        } while (v >= this.p);
        v = (v * this.Ri) % this.p;   // Convert from montgomery
        return v;
    }

    fft(a) {
        return this.FFT.fft(a);
    }

    ifft(a) {
        return this.FFT.ifft(a);
    }

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

    toObject(a) {
        return a;
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
        return exp(this, base, e);
    }

    exp(base, e) {
        return exp(this, base, e);
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

    toObject(a) {
        return a;
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
        return exp(this, base, e);
    }

    exp(base, e) {
        return exp(this, base, e);
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

    toObject(a) {
        return a;
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
        return gt(a, na);
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
    if (typeof o == "bigint" || o.eq !== undefined) {
        return o.toString(10);
    } else if (o instanceof Uint8Array) {
        return fromRprLE(o, 0);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = stringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts(o) {
    if (typeof o == "string" && /^[0-9]+$/.test(o)) {
        return BigInt(o);
    } else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o === null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int(buff) {
    let res = BigInt(0);
    let i = buff.length;
    let offset = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i > 0) {
        if (i >= 4) {
            i -= 4;
            res += BigInt(buffV.getUint32(i)) << BigInt(offset * 8);
            offset += 4;
        } else if (i >= 2) {
            i -= 2;
            res += BigInt(buffV.getUint16(i)) << BigInt(offset * 8);
            offset += 2;
        } else {
            i -= 1;
            res += BigInt(buffV.getUint8(i)) << BigInt(offset * 8);
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
        if (o - 4 >= 0) {
            o -= 4;
            buffV.setUint32(o, Number(r & BigInt(0xffffffff)));
            r = r >> BigInt(32);
        } else if (o - 2 >= 0) {
            o -= 2;
            buffV.setUint16(o, Number(r & BigInt(0xffff)));
            r = r >> BigInt(16);
        } else {
            o -= 1;
            buffV.setUint8(o, Number(r & BigInt(0xff)));
            r = r >> BigInt(8);
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

function leBuff2int(buff) {
    let res = BigInt(0);
    let i = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i < buff.length) {
        if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint32(i, true)) << BigInt(i * 8);
            i += 4;
        } else if (i + 2 <= buff.length) {
            res += BigInt(buffV.getUint16(i, true)) << BigInt(i * 8);
            i += 2;
        } else {
            res += BigInt(buffV.getUint8(i, true)) << BigInt(i * 8);
            i += 1;
        }
    }
    return res;
}

function leInt2Buff(n, len) {
    let r = n;
    if (typeof len === "undefined") {
        len = Math.floor((bitLength(n) - 1) / 8) + 1;
        if (len == 0) len = 1;
    }
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = 0;
    while (o < len) {
        if (o + 4 <= len) {
            buffV.setUint32(o, Number(r & BigInt(0xffffffff)), true);
            o += 4;
            r = r >> BigInt(32);
        } else if (o + 2 <= len) {
            buffV.setUint16(o, Number(r & BigInt(0xffff)), true);
            o += 2;
            r = r >> BigInt(16);
        } else {
            buffV.setUint8(o, Number(r & BigInt(0xff)), true);
            o += 1;
            r = r >> BigInt(8);
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

function stringifyFElements(F, o) {
    if (typeof o == "bigint" || o.eq !== undefined) {
        return o.toString(10);
    } else if (o instanceof Uint8Array) {
        return F.toString(F.e(o));
    } else if (Array.isArray(o)) {
        return o.map(stringifyFElements.bind(this, F));
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = stringifyFElements(F, o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyFElements(F, o) {
    if (typeof o == "string" && /^[0-9]+$/.test(o)) {
        return F.e(o);
    } else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) {
        return F.e(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyFElements.bind(this, F));
    } else if (typeof o == "object") {
        if (o === null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = unstringifyFElements(F, o[k]);
        });
        return res;
    } else {
        return o;
    }
}

const _revTable = [];
for (let i = 0; i < 256; i++) {
    _revTable[i] = _revSlow(i, 8);
}

function _revSlow(idx, bits) {
    let res = 0;
    let a = idx;
    for (let i = 0; i < bits; i++) {
        res <<= 1;
        res = res | (a & 1);
        a >>= 1;
    }
    return res;
}

function bitReverse(idx, bits) {
    return (
        (_revTable[idx >>> 24] |
        (_revTable[(idx >>> 16) & 0xff] << 8) |
        (_revTable[(idx >>> 8) & 0xff] << 16) |
        (_revTable[idx & 0xff] << 24)) >>>
        (32 - bits)
    );
}

function log2(V) {
    return (
        ((V & 0xffff0000) !== 0 ? ((V &= 0xffff0000), 16) : 0) |
        ((V & 0xff00ff00) !== 0 ? ((V &= 0xff00ff00), 8) : 0) |
        ((V & 0xf0f0f0f0) !== 0 ? ((V &= 0xf0f0f0f0), 4) : 0) |
        ((V & 0xcccccccc) !== 0 ? ((V &= 0xcccccccc), 2) : 0) |
        ((V & 0xaaaaaaaa) !== 0)
    );
}

function buffReverseBits(buff, eSize) {
    const n = buff.byteLength / eSize;
    const bits = log2(n);
    if (n != 1 << bits) {
        throw new Error("Invalid number of pointers");
    }
    for (let i = 0; i < n; i++) {
        const r = bitReverse(i, bits);
        if (i > r) {
            const tmp = buff.slice(i * eSize, (i + 1) * eSize);
            buff.set(buff.slice(r * eSize, (r + 1) * eSize), i * eSize);
            buff.set(tmp, r * eSize);
        }
    }
}

function array2buffer(arr, sG) {
    const buff = new Uint8Array(sG * arr.length);

    for (let i = 0; i < arr.length; i++) {
        buff.set(arr[i], i * sG);
    }

    return buff;
}

function buffer2array(buff, sG) {
    const n = buff.byteLength / sG;
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = buff.slice(i * sG, i * sG + sG);
    }
    return arr;
}

var _utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    array2buffer: array2buffer,
    beBuff2int: beBuff2int,
    beInt2Buff: beInt2Buff,
    bitReverse: bitReverse,
    buffReverseBits: buffReverseBits,
    buffer2array: buffer2array,
    leBuff2int: leBuff2int,
    leInt2Buff: leInt2Buff,
    log2: log2,
    stringifyBigInts: stringifyBigInts,
    stringifyFElements: stringifyFElements,
    unstringifyBigInts: unstringifyBigInts,
    unstringifyFElements: unstringifyFElements
});

const PAGE_SIZE = ( typeof Buffer !== "undefined" && Buffer.constants && Buffer.constants.MAX_LENGTH ) ? Buffer.constants.MAX_LENGTH : (1 << 30);

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
                tm.queueAction(task, [buffChunk.buffer])
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

        this.half = shiftRight(p, one);
        this.bitLength = bitLength(p);
        this.mask = sub(shiftLeft(one, this.bitLength), one);

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

        this.half = shiftRight(this.p, one);
        this.nqr = this.two;
        let r = this.exp(this.nqr, this.half);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.add(this.nqr, this.one);
            r = this.exp(this.nqr, this.half);
        }

        this.shift = this.mul(this.nqr, this.nqr);
        this.shiftInv = this.inv(this.shift);

        this.s = 0;
        let t = sub(this.p, one);

        while ( !isOdd(t) ) {
            this.s = this.s + 1;
            t = shiftRight(t, one);
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
            b = toLEBuff(e(b));
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
        let ra = e(a, b);
        if (isNegative(ra)) {
            ra = neg(ra);
            if (gt(ra, this.p)) {
                ra = mod(ra, this.p);
            }
            ra = sub(this.p, ra);
        } else {
            if (gt(ra, this.p)) {
                ra = mod(ra, this.p);
            }
        }
        const buff = leInt2Buff(ra, this.n8);
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
                v = add(v,  shiftLeft(rng.nextU64(), 64*i));
            }
            v = band(v, this.mask);
        } while (geq(v, this.p));
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
        let returnArray = false;
        const sIn = this.n8;
        const sOut = this.n8;

        if (Array.isArray(buffIn)) {
            buffIn = array2buffer(buffIn, sIn );
            returnArray = true;
        } else {
            buffIn = buffIn.slice(0, buffIn.byteLength);
        }

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
                this.tm.queueAction(task, [buffChunk.buffer])
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

        if (returnArray) {
            return buffer2array(fullBuffOut, sOut);
        } else {
            return fullBuffOut;
        }

    }

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
            b = toLEBuff(e(b));
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
            b = toLEBuff(e(b));
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
            s = toLEBuff(e(s));
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
    let terminationTimeout = 1500; // milliseconds
    let terminationTimer;

    if (self) {
        self.onmessage = function(e) {
            let data;
            if (e.data) {
                data = e.data;
            } else {
                data = e;
            }

            try {
                if (data[0].cmd === "INIT") {
                    init(data[0]).then(function() {
                        self.postMessage({status: "initialized"});
                        // Start idle timer only after init completes so it never
                        // fires during async WASM compilation.
                        scheduleTermination();
                    });
                    return; // skip the scheduleTermination() call at the bottom
                } else if (data[0].cmd === "TERMINATE") {
                    terminate();
                } else {
                    let terminateAfterTask = false;
                    if (data[data.length-1].cmd === "TERMINATE") {
                        terminateAfterTask = true;
                        data.pop();
                    }
                    const res = runTask(data);
                    let transfers = [];
                    for (let i=0; i<res.length; i++) {
                        if (res[i] instanceof Uint8Array) {
                            transfers.push(res[i].buffer);
                        }
                    }
                    self.postMessage(res, transfers);
                    if (terminateAfterTask) {
                        terminate();
                    }
                }
            } catch (err) {
                // Catch any error and send it back to main thread
                self.postMessage({error: err.message});
            }
            scheduleTermination();
        };
    }

    async function init(data) {
        let wasmModule;
        if (data.code instanceof WebAssembly.Module) {
            console.log("Using precompiled WebAssembly.Module");
            wasmModule = data.code;
        } else {
            console.log("Compiling WebAssembly.Module");
            const code = new Uint8Array(data.code);
            wasmModule = await WebAssembly.compile(code);
        }
        memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});

        console.log("Initialized thread with memory", memory.buffer.byteLength / 1024 / 1024, "MB");

        instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            }
        });

        if (data.terminationTimeout) {
            terminationTimeout = data.terminationTimeout;
        }
    }



    // Reverse the low `bits` of a 32-bit integer (O(1) bit-twiddle).
    function rev32(x) {
        x = ((x & 0x55555555) << 1) | ((x >>> 1) & 0x55555555);
        x = ((x & 0x33333333) << 2) | ((x >>> 2) & 0x33333333);
        x = ((x & 0x0f0f0f0f) << 4) | ((x >>> 4) & 0x0f0f0f0f);
        x = ((x & 0x00ff00ff) << 8) | ((x >>> 8) & 0x00ff00ff);
        x = (x << 16) | (x >>> 16);
        return x >>> 0;
    }

    // In-place bit-reversal permutation of fixed-size (sIn-byte) elements.
    // Works for any element size, like the old pure-JS buffReverseBits. When
    // the elements are 4-byte aligned it swaps Uint32Array lanes (no BigInt
    // boxing, no allocation); otherwise it falls back to a byte-wise swap with
    // a single reused temp buffer. Either way it touches no WASM linear memory.
    function reverseInPlace(u8, sIn, bits) {
        const n = u8.byteLength / sIn;
        const shift = 32 - bits;
        if (((sIn & 3) === 0) && ((u8.byteOffset & 3) === 0)) {
            const lanes = sIn >>> 2;
            const u32 = new Uint32Array(u8.buffer, u8.byteOffset, u8.byteLength >>> 2);
            for (let i = 0; i < n; i++) {
                const ri = rev32(i) >>> shift;
                if (i < ri) {
                    let a = i * lanes;
                    let b = ri * lanes;
                    for (let l = 0; l < lanes; l++) {
                        const t = u32[a + l];
                        u32[a + l] = u32[b + l];
                        u32[b + l] = t;
                    }
                }
            }
        } else {
            const tmp = new Uint8Array(sIn);   // one reused temp, not one per swap
            for (let i = 0; i < n; i++) {
                const ri = rev32(i) >>> shift;
                if (i < ri) {
                    const ao = i * sIn;
                    const bo = ri * sIn;
                    tmp.set(u8.subarray(ao, ao + sIn));
                    u8.copyWithin(ao, bo, bo + sIn);
                    u8.set(tmp, bo);
                }
            }
        }
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
            console.log("Growing memory to", memory.buffer.byteLength / 1024 / 1024, "MB");
        }
        return res;
    }

    function allocBuffer(buffer) {
        const p = alloc(buffer.byteLength);
        setBuffer(p, buffer);
        return p;
    }

    function getBuffer(pointer, length) {
        return new Uint8Array(memory.buffer, pointer, length);
    }

    function setBuffer(pointer, buffer) {
        const u8 = new Uint8Array(memory.buffer);
        u8.set(new Uint8Array(buffer), pointer);
    }

    function runTask(task) {
        clearTimeout(terminationTimer);
        if (task[0].cmd === "INIT") {
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
            case "REVERSE": {
                // Reverse the transferred buffer in place and hand it straight
                // back. No SharedArrayBuffer and no WASM memory: the buffer is
                // transferred in and out (zero copy) and reversed where it lies.
                const t = task[i];
                reverseInPlace(t.src, t.sIn, t.bits);
                ctx.out[0] = t.src;
                break;
            }
            case "ALLOCSET":
                if (task[i].len / 1024 / 1024 > 25) {
                    console.log("tasks", task);
                    //console.trace();
                }
                ctx.vars[task[i].var] = allocBuffer(task[i].buff);
                break;
            case "ALLOC":
                if (task[i].len / 1024 / 1024 > 25) {
                    console.log("tasks", task);
                    //console.trace();
                }
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

    function scheduleTermination() {
        clearTimeout(terminationTimer);
        if (terminationTimeout > 0) {
            terminationTimer = setTimeout(() => {
                if (self) self.postMessage({status: "want_to_terminate"});
            }, terminationTimeout);
        }
    }

    function terminate() {
        clearTimeout(terminationTimer);
        if (self) {
            console.log("TERMINATE");
            self.postMessage({status: "terminated"});
            self.close();
        }
    }

    return runTask;
}

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

// Robust Node detection that never throws (unlike `process.browser`, which is a
// webpack-ism and is undefined under Vite/esbuild/SES).
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

// WorkerSlot holds the native Worker and all per-worker state.
// Each call to startWorker() creates a fresh WorkerSlot instance.
// Message handlers close over the slot reference so that stale messages
// from a replaced worker are detected by a simple identity check
// (tm.pool[i] !== slot).
class WorkerSlot {
    constructor(worker) {
        this.worker      = worker; // native Worker thread
        this.initialized = false;
        this.initializing= false;
        this.working     = false;
        this.pendingDeferred = null;
        this.onMsg   = null; // stored so removeEventListener can be called on termination
        this.onError = null;
    }
}

// Computed lazily on first worker creation, NOT at module load: a SES/Snap
// realm (which runs single-threaded) has no Blob/btoa/URL.createObjectURL, and
// touching them at import time would throw before a curve could even be built.
let workerSource;
function getWorkerSource() {
    if (workerSource !== undefined) return workerSource;
    const threadStr = `(${thread.toString()})(self)`;
    if (isNode) {
        workerSource = "data:application/javascript;base64," + Buffer.from(threadStr).toString("base64");
    } else if (globalThis?.Blob && globalThis.URL && globalThis.URL.createObjectURL) {
        const threadBytes = new TextEncoder().encode(threadStr);
        const workerBlob = new Blob([threadBytes], { type: "application/javascript" });
        workerSource = URL.createObjectURL(workerBlob);
    } else {
        workerSource = "data:application/javascript;base64," + globalThis.btoa(threadStr);
    }
    return workerSource;
}



async function buildThreadManager(wasm, singleThread) {
    const tm = new ThreadManager();

    tm.memory = new WebAssembly.Memory({initial:MEM_SIZE});
    tm.u8 = new Uint8Array(tm.memory.buffer);
    tm.u32 = new Uint32Array(tm.memory.buffer);

    const wasmModule = await WebAssembly.compile(wasm.code);

    tm.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": tm.memory
        }
    });

    // Force single-thread when no Worker is available. Covers SES/Snap realms
    // (no Worker, frozen globals) and old/limited browsers, regardless of what
    // the caller requested -- the worker path (and getWorkerSource's
    // Blob/btoa) would otherwise fail. Node uses the web-worker import, so it
    // keeps multi-threading.
    if(!isNode && !globalThis?.Worker) {
        singleThread = true;
    }

    tm.singleThread = singleThread;
    tm.initalPFree = tm.u32[0];   // Save the Pointer to free space.
    tm.pq = wasm.pq;
    tm.pr = wasm.pr;
    tm.pG1gen = wasm.pG1gen;
    tm.pG1zero = wasm.pG1zero;
    tm.pG2gen = wasm.pG2gen;
    tm.pG2zero = wasm.pG2zero;
    tm.pOneT = wasm.pOneT;

    tm.code = wasm.code;
    tm.wasmModule = wasmModule;

    if (singleThread) {
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice()
        }]);
        tm.concurrency  = 1;
    } else {
        // pool[i] is the active WorkerSlot at slot i, or null if the slot is empty.
        tm.pool = [];

        let concurrency = 2;
        if (typeof navigator === "object" && navigator.hardwareConcurrency) {
            concurrency = navigator.hardwareConcurrency;
        } else if (os && os.cpus) {
            concurrency = os.cpus().length;
        }

        if(concurrency === 0){
            concurrency = 2;
        }

        // Limit to 64 threads for memory reasons.
        if (concurrency>64) concurrency=64;
        tm.concurrency = concurrency;
    }
    return tm;
}

class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
    }

    // Build the message handler for a specific WorkerSlot.
    // All state reads/writes go through `slot`; the stale check
    // `tm.pool[slotIndex] !== slot` discards messages from replaced workers.
    _makeOnMsg(slotIndex, slot) {
        const tm = this;
        return async function(e) {
            const data = (e && e.data) ? e.data : e;

            // Stale check: if pool[slotIndex] no longer points to this slot,
            // the message is from a worker that was already replaced.
            if (tm.pool[slotIndex] !== slot) {
                if (data.status === "terminated") {
                    // Break the reference cycle so the slot and its WASM memory
                    // can be collected immediately rather than waiting for GC.
                    slot.worker.removeEventListener("message", slot.onMsg);
                    slot.worker.removeEventListener("error",   slot.onError);
                    return;
                }
                if (!data.status && slot.working) {
                    // Stale task result: the slot was replaced (want_to_terminate raced
                    // with a task dispatch — pool[i] was nulled before the result came
                    // back). The result is still valid; resolve so the caller doesn't hang.
                    slot.working = false;
                    slot.pendingDeferred.resolve(data);
                }
                await tm.processWorks();
                return;
            }

            if (data.error) {
                slot.working = false;
                slot.pendingDeferred.reject(new Error("Worker error: " + data.error));
                if (slot.initializing) {
                    slot.initializing = false;
                    tm.pool[slotIndex] = null;
                }
                throw new Error("Worker error: " + data.error);
            }

            if (data.status) {
                if (data.status === "initialized") {
                    slot.initializing = false;
                    slot.initialized  = true;

                } else if (data.status === "want_to_terminate") {
                    // 2-phase termination: the worker is idle and asking to close.
                    // Release the slot immediately so processWorks can fill it with a
                    // fresh worker if the queue needs one.  The TERMINATE ack is sent
                    // to the old worker so it can close cleanly; its later "terminated"
                    // message will be stale (pool[slotIndex] !== slot) and ignored.
                    tm.pool[slotIndex] = null;
                    slot.worker.postMessage([{cmd: "TERMINATE"}]);
                    await tm.processWorks();
                    return;

                } else if (data.status === "terminated") {
                    // Worker has fully closed.  For the 2-phase path the slot was
                    // already nulled in want_to_terminate, so this message arrives
                    // stale and is handled above.  For a direct TERMINATE
                    // (tm.terminate() at proof end) we clean up here.
                    slot.worker.removeEventListener("message", slot.onMsg);
                    slot.worker.removeEventListener("error",   slot.onError);
                    tm.pool[slotIndex] = null;
                    if (slot.working) {
                        // Safety net: reject the pending deferred so the caller
                        // surfaces an error instead of hanging.
                        slot.pendingDeferred.reject(
                            new Error(`Worker at slot ${slotIndex} terminated unexpectedly while processing task`)
                        );
                        slot.working = false;
                    }
                    return;
                }
                // fall through for "initialized" so the INIT deferred is resolved below
            }

            slot.working = false;
            slot.pendingDeferred.resolve(data);
            await tm.processWorks();
        };
    }

    _makeOnError(slotIndex, slot) {
        const tm = this;
        return function(e) {
            if (tm.pool[slotIndex] === slot) {
                slot.working     = false;
                slot.initialized = false;
                if (slot.pendingDeferred) {
                    slot.pendingDeferred.reject(new Error("Worker error: " + e.message));
                }
            }
            throw new Error("Worker error: " + e.message);
        };
    }

    startWorker(slotIndex) {
        const nativeWorker = new Worker(getWorkerSource());
        const slot = new WorkerSlot(nativeWorker);
        this.pool[slotIndex] = slot;

        slot.onMsg   = this._makeOnMsg(slotIndex, slot);
        slot.onError = this._makeOnError(slotIndex, slot);
        nativeWorker.addEventListener("message", slot.onMsg);
        nativeWorker.addEventListener("error",   slot.onError);

        slot.initializing = true;

        // postAction sets slot.working = true synchronously before any await,
        // so processWorks will not attempt to start this slot again.
        this.postAction(slotIndex, [{
            cmd:  "INIT",
            init: MEM_SIZE,
            code: this.wasmModule,
        }]).then(() => {
            slot.initialized = true;
        });
    }

    startSyncOp() {
        if (this.oldPFree !== 0) throw new Error("Sync operation in progress");
        this.oldPFree = this.u32[0];
    }

    endSyncOp() {
        if (this.oldPFree === 0) throw new Error("No sync operation in progress");
        this.u32[0] = this.oldPFree;
        this.oldPFree = 0;
    }

    async postAction(slotIndex, e, transfers, _deferred) {
        const slot = this.pool[slotIndex];
        if (!slot || slot.working) {
            throw new Error("Posting a job to a working worker");
        }
        slot.working = true;
        slot.pendingDeferred = _deferred ? _deferred : new Deferred();
        await slot.worker.postMessage(e, transfers);
        return slot.pendingDeferred.promise;
    }

    async processWorks() {
        // Dispatch queued tasks to ready workers.
        for (let i = 0; i < this.concurrency && this.actionQueue.length > 0; i++) {
            const slot = this.pool[i];
            if (slot && slot.initialized && !slot.working) {
                const work = this.actionQueue.shift();
                await this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }

        // Start new workers for slots that need them.
        if (this.actionQueue.length > 0) {
            let initializingCount = 0;
            for (let i = 0; i < this.concurrency; i++) {
                const slot = this.pool[i];
                if (slot) {
                    if (slot.initializing) initializingCount++;
                    // slot exists: skip whether initialized, initializing, or working
                    continue;
                }
                // slot is null: this slot is available to host a new worker
                if (initializingCount >= this.actionQueue.length) break;
                initializingCount++;
                this.startWorker(i);
            }
        }
    }

    async queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            this.actionQueue.push({
                data:      actionData,
                transfers: transfers,
                deferred:  d
            });
            await this.processWorks();
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
        return this.u8.slice(pointer, pointer + length);
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
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i]) {
                this.pool[i].worker.postMessage([{cmd: "TERMINATE"}]);
            }
        }
    }

}

function buildBatchApplyKey(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = curve.tm;

    curve[groupName].batchApplyKey = async function(buff, first, inc, inType, outType) {
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

            const b = buff.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin);

            task.push({
                cmd: "ALLOCSET",
                var: 0,
                buff: b
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

            opPromises.push(tm.queueAction(task, [b.buffer]));
            t = Fr.mul(t, Fr.exp(inc, n));
        }

        const result = await Promise.all(opPromises);

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

            // Do NOT transfer g1Buff/g2Buff: toJacobian() returns its argument
            // unchanged when the point is already in jacobian form, so these may
            // alias caller-owned buffers (e.g. curve.G1.g / curve.G2.g).
            // Transferring would detach them on the main thread. They are single
            // points, so the structured-clone copy is negligible.
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
        if (groupName === "G1") {
            if (inType === "affine") {
                fnName = "g1m_multiexpAffine";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g1m_multiexp";
                sGIn = G.F.n8*3;
            }
        } else if (groupName === "G2") {
            if (inType === "affine") {
                fnName = "g2m_multiexpAffine";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g2m_multiexp";
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }
        const nPoints = Math.floor(buffBases.byteLength / sGIn);

        if (nPoints === 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints !== buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2(nPoints)];

        const opPromises = [];

        const task = [
            {cmd: "ALLOCSET", var: 0, buff: buffBases},
            {cmd: "ALLOCSET", var: 1, buff: buffScalars},
            {cmd: "ALLOC", var: 2, len: G.F.n8*3},
            {cmd: "CALL", fnName: fnName, params: [
                {var: 0}, //pBases
                {var: 1}, // pScalars
                {val: sScalar}, // scalarSize
                {val: nPoints}, // nPoints
                {var: 2} // pr
            ]},
            {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
        ];
        opPromises.push(
            // transfer ownership of the buffers to the worker thread
            G.tm.queueAction(task, [buffBases.buffer, buffScalars.buffer])
        );

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
        const MIN_CHUNK_SIZE = 1 << 12;
        let sGIn;

        if (groupName === "G1") {
            if (inType === "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else if (groupName === "G2") {
            if (inType === "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        if (nPoints === 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints !== buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        let result = [];
        const opPromises = [];
        const bitChunkSize = pTSizes[log2(nPoints)];
        let nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        if (groupName === "G2") {
            // G2 has bigger points, so we reduce chunk size to optimize memory usage
            nChunks *= 2;
        }

        let chunkSize;
        //chunkSize = Math.floor(nPoints / tm.concurrency) + 1;

        // make nChunks multiple of tm.concurrency for optimal load balancing
        nChunks = (Math.floor((nChunks-1) / tm.concurrency) + 1) * tm.concurrency;
        chunkSize = Math.floor(nPoints / nChunks) + 1;

        if (chunkSize>MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize<MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;

        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`Multiexp start: ${logText}: ${i}/${nPoints}`);
            const n = Math.min(nPoints - i, chunkSize);

            const buffBasesChunk = buffBases.slice(i*sGIn, (i+n)*sGIn);
            const buffScalarsChunk = buffScalars.slice(i*sScalar, (i+n)*sScalar);

            opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType, logger, logText).then((r) => {
                if (logger) logger.debug(`Multiexp end: ${logText}: ${i}/${nPoints}`);
                return r;
            }));
        }

        result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            res = G.add(res, result[i]);
        }

        return res;
    }

    G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
    };
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return _multiExp(buffBases, buffScalars, "affine", logger, logText);
    };
}

function buildFFT(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = G.tm;

    // In-place bit-reversal permutation in a worker. The buffer is transferred
    // in, reversed where it lies via plain typed-array lane swaps (no WASM
    // linear memory grown, nothing allocated), and transferred back. Both
    // transfers are pointer moves, so this is zero-copy. The swap is
    // memory-bandwidth bound, so a single worker is as fast as splitting across
    // many — which is why no SharedArrayBuffer is needed (only concurrent
    // multi-worker access to one buffer would require that).
    async function _reversePermutation(buff, sIn, bits) {
        const res = await tm.queueAction(
            [{cmd: "REVERSE", src: buff, sIn, bits}],
            [buff.buffer]   // transfer in; reversed in place and transferred back
        );
        return res[0];
    }

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
            buff = array2buffer(buff, sIn);
            returnArray = true;
        } else {
            buff = buff.slice(0, buff.byteLength);
        }

        const nPoints = buff.byteLength / sIn;
        const bits = log2(nPoints);

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
                return buffer2array(buffOut, sOut);
            } else {
                return buffOut;
            }
        }

        let inv;
        if (inverse) {
            inv = Fr.inv(Fr.e(nPoints));
        }

        let buffOut;

        // Bit-reversal permutation. Like the old pure-JS buffReverseBits, this is
        // just a permutation of fixed-size (sIn-byte) elements and works for any
        // element size, so it covers Fr, G1 and G2 alike. Reversed in place in a
        // worker via typed-array swaps — no WASM linear memory grown, nothing
        // allocated. (The previous WASM __reversePermutation swapped n8g-sized
        // elements rather than sIn-sized ones, which was wrong whenever
        // sIn != n8g, e.g. affine-input G1/G2 FFTs.)
        buff = await _reversePermutation(buff, sIn, bits);

        let chunks;
        let pointsInChunk = Math.min(1 << MAX_BITS_THREAD, nPoints);
        let nChunks = nPoints / pointsInChunk;

        while ((nChunks < tm.concurrency)&&(pointsInChunk>=16)) {
            nChunks *= 2;
            pointsInChunk /= 2;
        }

        const l2Chunk = log2(pointsInChunk);

        const promises = [];
        if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix start: ${nChunks}`);
        for (let i = 0; i< nChunks; i++) {
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
            promises.push(tm.queueAction(task, [buffChunk.buffer]));
        }

        chunks = await Promise.all(promises);
        if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix end: ${nChunks}`);
        for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

        for (let i = l2Chunk+1;   i<=bits; i++) {
            if (logger) logger.debug(`${loggerTxt}: fft ${bits} join: ${i}/${bits}`);
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
                    opPromises.push(tm.queueAction(task, [chunks[o1].buffer, chunks[o2].buffer, first.buffer ]));
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
            return buffer2array(buffOut, sOut);
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
        if (nPoints != 1 << log2(nPoints)) {
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
                tm.queueAction(task, [b1.buffer, b2.buffer, firstChunk.buffer]).then((r) => {
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
        const bits = log2(nPoints);

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
        const power = log2(nPoints);

        let nChunks = 1 << log2(tm.concurrency);

        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;

        const powerChunk = log2(pointsPerChunk);

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
                tm.queueAction(task, [b.buffer])
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
                    opPromises.push(tm.queueAction(task, [chunks[o1].buffer, chunks[o2].buffer, first.buffer]));
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
        if (nPoints != 1 << log2(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let nChunks = 1 << log2(tm.concurrency);
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
                tm.queueAction(task, [b1.buffer, b2.buffer, firstChunk.buffer])
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
        if (nPoints != 1 << log2(nPoints)) {
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
                tm.queueAction(task, [b.buffer])
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

    curve.q = e(params.wasm.q.toString());
    curve.r = e(params.wasm.r.toString());
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

// AUTO-GENERATED from wasmcurves/build/bn128_wasm.js — do not edit.
// Regenerate with: npm run gen-wasm
// 'code' is base64 of the raw (uncompressed) wasm; the rest are pointer
// offsets / field moduli.
const code$1 = "AGFzbQEAAAABlAESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCn9/f39/f39/f38AYAV/f39/fwF/YAd/f39/f39/AX9gCX9/f39/f39/fwF/YAt/f39/f39/f39/fwF/Ag8BA2VudgZtZW1vcnkCABkDwQK/AgABAgEDAwQEBQAABgcIBQIFBQAABQAAAAACAgABBQgJBQUFCAgICAACAgUFAAAFAAAAAAICAAEFCAkFBQUICAgIAAIFAAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAICBQAFAAAAAAUFBQUFCgALCQoACwkICAMACAgCAAAJDAwFBQwACA0JCAICAQEABQUABQUAAAAAAwAIAgIJCAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAICBQAFAAAAAAUFBQUFCgALCQoACwkICAUDAAgIAgAACQwMBQUMBQMACAgCAAAJDAwFBQwFBQkJCQkJAAICAQEABQAFBQACAAADAAgCCQgAAgIBAQAFBQAFBQAAAAADAAgCAgkIAAIFAAAAAAgIBQAAAAAAAAAAAAAAAAAAAAAEDg8QEQUHxSWrAghpbnRfY29weQAACGludF96ZXJvAAEHaW50X29uZQADCmludF9pc1plcm8AAgZpbnRfZXEABAdpbnRfZ3RlAAUHaW50X2FkZAAGB2ludF9zdWIABwdpbnRfbXVsAAgKaW50X3NxdWFyZQAJDWludF9zcXVhcmVPbGQACgdpbnRfZGl2AA0OaW50X2ludmVyc2VNb2QADghmMW1fY29weQAACGYxbV96ZXJvAAEKZjFtX2lzWmVybwACBmYxbV9lcQAEB2YxbV9hZGQAEAdmMW1fc3ViABEHZjFtX25lZwASDmYxbV9pc05lZ2F0aXZlABkJZjFtX2lzT25lAA8IZjFtX3NpZ24AGgtmMW1fbVJlZHVjdAATB2YxbV9tdWwAFApmMW1fc3F1YXJlABUNZjFtX3NxdWFyZU9sZAAWEmYxbV9mcm9tTW9udGdvbWVyeQAYEGYxbV90b01vbnRnb21lcnkAFwtmMW1faW52ZXJzZQAbB2YxbV9vbmUAHAhmMW1fbG9hZAAdD2YxbV90aW1lc1NjYWxhcgAeB2YxbV9leHAAJhBmMW1fYmF0Y2hJbnZlcnNlAB8IZjFtX3NxcnQAJwxmMW1faXNTcXVhcmUAKBVmMW1fYmF0Y2hUb01vbnRnb21lcnkAIBdmMW1fYmF0Y2hGcm9tTW9udGdvbWVyeQAhCGZybV9jb3B5AAAIZnJtX3plcm8AAQpmcm1faXNaZXJvAAIGZnJtX2VxAAQHZnJtX2FkZAAqB2ZybV9zdWIAKwdmcm1fbmVnACwOZnJtX2lzTmVnYXRpdmUAMwlmcm1faXNPbmUAKQhmcm1fc2lnbgA0C2ZybV9tUmVkdWN0AC0HZnJtX211bAAuCmZybV9zcXVhcmUALw1mcm1fc3F1YXJlT2xkADASZnJtX2Zyb21Nb250Z29tZXJ5ADIQZnJtX3RvTW9udGdvbWVyeQAxC2ZybV9pbnZlcnNlADUHZnJtX29uZQA2CGZybV9sb2FkADcPZnJtX3RpbWVzU2NhbGFyADgHZnJtX2V4cABAEGZybV9iYXRjaEludmVyc2UAOQhmcm1fc3FydABBDGZybV9pc1NxdWFyZQBCFWZybV9iYXRjaFRvTW9udGdvbWVyeQA6F2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5ADsGZnJfYWRkACoGZnJfc3ViACsGZnJfbmVnACwGZnJfbXVsAEMJZnJfc3F1YXJlAEQKZnJfaW52ZXJzZQBFDWZyX2lzTmVnYXRpdmUARgdmcl9jb3B5AAAHZnJfemVybwABBmZyX29uZQA2CWZyX2lzWmVybwACBWZyX2VxAAQMZzFtX211bHRpZXhwAHESZzFtX211bHRpZXhwX2NodW5rAHASZzFtX211bHRpZXhwQWZmaW5lAHUYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAHQKZzFtX2lzWmVybwBIEGcxbV9pc1plcm9BZmZpbmUARwZnMW1fZXEAUAtnMW1fZXFNaXhlZABPDGcxbV9lcUFmZmluZQBOCGcxbV9jb3B5AEwOZzFtX2NvcHlBZmZpbmUASwhnMW1femVybwBKDmcxbV96ZXJvQWZmaW5lAEkKZzFtX2RvdWJsZQBSEGcxbV9kb3VibGVBZmZpbmUAUQdnMW1fYWRkAFUMZzFtX2FkZE1peGVkAFQNZzFtX2FkZEFmZmluZQBTB2cxbV9uZWcAVw1nMW1fbmVnQWZmaW5lAFYHZzFtX3N1YgBaDGcxbV9zdWJNaXhlZABZDWcxbV9zdWJBZmZpbmUAWBJnMW1fZnJvbU1vbnRnb21lcnkAXBhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUAWxBnMW1fdG9Nb250Z29tZXJ5AF4WZzFtX3RvTW9udGdvbWVyeUFmZmluZQBdD2cxbV90aW1lc1NjYWxhcgB2FWcxbV90aW1lc1NjYWxhckFmZmluZQB3DWcxbV9ub3JtYWxpemUAYwpnMW1fTEVNdG9VAGUKZzFtX0xFTXRvQwBmCmcxbV9VdG9MRU0AZwpnMW1fQ3RvTEVNAGgPZzFtX2JhdGNoTEVNdG9VAGkPZzFtX2JhdGNoTEVNdG9DAGoPZzFtX2JhdGNoVXRvTEVNAGsPZzFtX2JhdGNoQ3RvTEVNAGwMZzFtX3RvQWZmaW5lAF8OZzFtX3RvSmFjb2JpYW4ATRFnMW1fYmF0Y2hUb0FmZmluZQBiE2cxbV9iYXRjaFRvSmFjb2JpYW4AbQtnMW1faW5DdXJ2ZQBhEWcxbV9pbkN1cnZlQWZmaW5lAGAXZnJtX19yZXZlcnNlUGVybXV0YXRpb24AeQdmcm1fZmZ0AH0IZnJtX2lmZnQAfgpmcm1fcmF3ZmZ0AHsLZnJtX2ZmdEpvaW4Afw5mcm1fZmZ0Sm9pbkV4dACAARFmcm1fZmZ0Sm9pbkV4dEludgCBAQpmcm1fZmZ0TWl4AIIBDGZybV9mZnRGaW5hbACDAR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgCEAQhwb2xfemVybwCFAQ9wb2xfY29uc3RydWN0TEMAhgEMcWFwX2J1aWxkQUJDAIcBC3FhcF9qb2luQUJDAIgBDHFhcF9iYXRjaEFkZACJAQpmMm1faXNaZXJvAIoBCWYybV9pc09uZQCLAQhmMm1femVybwCMAQdmMm1fb25lAI0BCGYybV9jb3B5AI4BB2YybV9tdWwAjwEIZjJtX211bDEAkAEKZjJtX3NxdWFyZQCRAQdmMm1fYWRkAJIBB2YybV9zdWIAkwEHZjJtX25lZwCUAQhmMm1fc2lnbgCbAQ1mMm1fY29uanVnYXRlAJUBEmYybV9mcm9tTW9udGdvbWVyeQCXARBmMm1fdG9Nb250Z29tZXJ5AJYBBmYybV9lcQCYAQtmMm1faW52ZXJzZQCZAQdmMm1fZXhwAJ4BD2YybV90aW1lc1NjYWxhcgCaARBmMm1fYmF0Y2hJbnZlcnNlAJ0BCGYybV9zcXJ0AJ8BDGYybV9pc1NxdWFyZQCgAQ5mMm1faXNOZWdhdGl2ZQCcAQxnMm1fbXVsdGlleHAAywESZzJtX211bHRpZXhwX2NodW5rAMoBEmcybV9tdWx0aWV4cEFmZmluZQDPARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsAzgEKZzJtX2lzWmVybwCiARBnMm1faXNaZXJvQWZmaW5lAKEBBmcybV9lcQCqAQtnMm1fZXFNaXhlZACpAQxnMm1fZXFBZmZpbmUAqAEIZzJtX2NvcHkApgEOZzJtX2NvcHlBZmZpbmUApQEIZzJtX3plcm8ApAEOZzJtX3plcm9BZmZpbmUAowEKZzJtX2RvdWJsZQCsARBnMm1fZG91YmxlQWZmaW5lAKsBB2cybV9hZGQArwEMZzJtX2FkZE1peGVkAK4BDWcybV9hZGRBZmZpbmUArQEHZzJtX25lZwCxAQ1nMm1fbmVnQWZmaW5lALABB2cybV9zdWIAtAEMZzJtX3N1Yk1peGVkALMBDWcybV9zdWJBZmZpbmUAsgESZzJtX2Zyb21Nb250Z29tZXJ5ALYBGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQC1ARBnMm1fdG9Nb250Z29tZXJ5ALgBFmcybV90b01vbnRnb21lcnlBZmZpbmUAtwEPZzJtX3RpbWVzU2NhbGFyANABFWcybV90aW1lc1NjYWxhckFmZmluZQDRAQ1nMm1fbm9ybWFsaXplAL0BCmcybV9MRU10b1UAvwEKZzJtX0xFTXRvQwDAAQpnMm1fVXRvTEVNAMEBCmcybV9DdG9MRU0AwgEPZzJtX2JhdGNoTEVNdG9VAMMBD2cybV9iYXRjaExFTXRvQwDEAQ9nMm1fYmF0Y2hVdG9MRU0AxQEPZzJtX2JhdGNoQ3RvTEVNAMYBDGcybV90b0FmZmluZQC5AQ5nMm1fdG9KYWNvYmlhbgCnARFnMm1fYmF0Y2hUb0FmZmluZQC8ARNnMm1fYmF0Y2hUb0phY29iaWFuAMcBC2cybV9pbkN1cnZlALsBEWcybV9pbkN1cnZlQWZmaW5lALoBC2cxbV90aW1lc0ZyANIBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uANQBB2cxbV9mZnQA2AEIZzFtX2lmZnQA2QEKZzFtX3Jhd2ZmdADWAQtnMW1fZmZ0Sm9pbgDaAQ5nMW1fZmZ0Sm9pbkV4dADbARFnMW1fZmZ0Sm9pbkV4dEludgDcAQpnMW1fZmZ0TWl4AN0BDGcxbV9mZnRGaW5hbADeAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDfAQtnMm1fdGltZXNGcgDgARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDiAQdnMm1fZmZ0AOYBCGcybV9pZmZ0AOcBCmcybV9yYXdmZnQA5AELZzJtX2ZmdEpvaW4A6AEOZzJtX2ZmdEpvaW5FeHQA6QERZzJtX2ZmdEpvaW5FeHRJbnYA6gEKZzJtX2ZmdE1peADrAQxnMm1fZmZ0RmluYWwA7AEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A7QERZzFtX3RpbWVzRnJBZmZpbmUA7gERZzJtX3RpbWVzRnJBZmZpbmUA7wERZnJtX2JhdGNoQXBwbHlLZXkA8AERZzFtX2JhdGNoQXBwbHlLZXkA8QEWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZADyARFnMm1fYmF0Y2hBcHBseUtleQDzARZnMm1fYmF0Y2hBcHBseUtleU1peGVkAPQBCmY2bV9pc1plcm8A9gEJZjZtX2lzT25lAPcBCGY2bV96ZXJvAPgBB2Y2bV9vbmUA+QEIZjZtX2NvcHkA+gEHZjZtX211bAD7AQpmNm1fc3F1YXJlAPwBB2Y2bV9hZGQA/QEHZjZtX3N1YgD+AQdmNm1fbmVnAP8BCGY2bV9zaWduAIACEmY2bV9mcm9tTW9udGdvbWVyeQCCAhBmNm1fdG9Nb250Z29tZXJ5AIECBmY2bV9lcQCDAgtmNm1faW52ZXJzZQCEAgdmNm1fZXhwAIgCD2Y2bV90aW1lc1NjYWxhcgCFAhBmNm1fYmF0Y2hJbnZlcnNlAIcCDmY2bV9pc05lZ2F0aXZlAIYCCmZ0bV9pc1plcm8AigIJZnRtX2lzT25lAIsCCGZ0bV96ZXJvAIwCB2Z0bV9vbmUAjQIIZnRtX2NvcHkAjgIHZnRtX211bACPAghmdG1fbXVsMQCQAgpmdG1fc3F1YXJlAJECB2Z0bV9hZGQAkgIHZnRtX3N1YgCTAgdmdG1fbmVnAJQCCGZ0bV9zaWduAJsCDWZ0bV9jb25qdWdhdGUAlQISZnRtX2Zyb21Nb250Z29tZXJ5AJcCEGZ0bV90b01vbnRnb21lcnkAlgIGZnRtX2VxAJgCC2Z0bV9pbnZlcnNlAJkCB2Z0bV9leHAAngIPZnRtX3RpbWVzU2NhbGFyAJoCEGZ0bV9iYXRjaEludmVyc2UAnQIIZnRtX3NxcnQAnwIMZnRtX2lzU3F1YXJlAKACDmZ0bV9pc05lZ2F0aXZlAJwCFGJuMTI4X19mcm9iZW5pdXNNYXAwAKkCFGJuMTI4X19mcm9iZW5pdXNNYXAxAKoCFGJuMTI4X19mcm9iZW5pdXNNYXAyAKsCFGJuMTI4X19mcm9iZW5pdXNNYXAzAKwCFGJuMTI4X19mcm9iZW5pdXNNYXA0AK0CFGJuMTI4X19mcm9iZW5pdXNNYXA1AK4CFGJuMTI4X19mcm9iZW5pdXNNYXA2AK8CFGJuMTI4X19mcm9iZW5pdXNNYXA3ALACFGJuMTI4X19mcm9iZW5pdXNNYXA4ALECFGJuMTI4X19mcm9iZW5pdXNNYXA5ALICEGJuMTI4X3BhaXJpbmdFcTEAuQIQYm4xMjhfcGFpcmluZ0VxMgC6AhBibjEyOF9wYWlyaW5nRXEzALsCEGJuMTI4X3BhaXJpbmdFcTQAvAIQYm4xMjhfcGFpcmluZ0VxNQC9Ag1ibjEyOF9wYWlyaW5nAL4CD2JuMTI4X3ByZXBhcmVHMQCjAg9ibjEyOF9wcmVwYXJlRzIApQIQYm4xMjhfbWlsbGVyTG9vcACoAhlibjEyOF9maW5hbEV4cG9uZW50aWF0aW9uALgCHGJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAswIPYm4xMjhfX211bEJ5MDI0AKYCEmJuMTI4X19tdWxCeTAyNE9sZACnAhdibjEyOF9fY3ljbG90b21pY1NxdWFyZQC1AhdibjEyOF9fY3ljbG90b21pY0V4cF93MAC2Agr93wO/AioAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGAseACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxgLMwAgACkDGFAEQCAAKQMQUARAIAApAwhQBEAgACkDAFAPBUEADwsFQQAPCwVBAA8LQQAPCx4AIABCATcDACAAQgA3AwggAEIANwMQIABCADcDGAtHACAAKQMYIAEpAxhRBEAgACkDECABKQMQUQRAIAApAwggASkDCFEEQCAAKQMAIAEpAwBRDwVBAA8LBUEADwsFQQAPC0EADwt9ACAAKQMYIAEpAxhUBEBBAA8FIAApAxggASkDGFYEQEEBDwUgACkDECABKQMQVARAQQAPBSAAKQMQIAEpAxBWBEBBAQ8FIAApAwggASkDCFQEQEEADwUgACkDCCABKQMIVgRAQQEPBSAAKQMAIAEpAwBaDwsLCwsLC0EADwvUAQEBfiAANQIAIAE1AgB8IQMgAiADPgIAIAA1AgQgATUCBHwgA0IgiHwhAyACIAM+AgQgADUCCCABNQIIfCADQiCIfCEDIAIgAz4CCCAANQIMIAE1Agx8IANCIIh8IQMgAiADPgIMIAA1AhAgATUCEHwgA0IgiHwhAyACIAM+AhAgADUCFCABNQIUfCADQiCIfCEDIAIgAz4CFCAANQIYIAE1Ahh8IANCIIh8IQMgAiADPgIYIAA1AhwgATUCHHwgA0IgiHwhAyACIAM+AhwgA0IgiKcLjAIBAX4gADUCACABNQIAfSEDIAIgA0L/////D4M+AgAgADUCBCABNQIEfSADQiCHfCEDIAIgA0L/////D4M+AgQgADUCCCABNQIIfSADQiCHfCEDIAIgA0L/////D4M+AgggADUCDCABNQIMfSADQiCHfCEDIAIgA0L/////D4M+AgwgADUCECABNQIQfSADQiCHfCEDIAIgA0L/////D4M+AhAgADUCFCABNQIUfSADQiCHfCEDIAIgA0L/////D4M+AhQgADUCGCABNQIYfSADQiCHfCEDIAIgA0L/////D4M+AhggADUCHCABNQIcfSADQiCHfCEDIAIgA0L/////D4M+AhwgA0Igh6cLjxASAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+IANC/////w+DIAA1AgAiBSABNQIAIgZ+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIAUgATUCBCIIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIHIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIAUgATUCCCIKfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIJIAZ+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIAUgATUCDCIMfnwhBCADIARCIIh8IQMgBEL/////D4MgByAKfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCILIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIAUgATUCECIOfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECINIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIAUgATUCFCIQfnwhBCADIARCIIh8IQMgBEL/////D4MgByAOfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIPIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DIAUgATUCGCISfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIRIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIARC/////w+DIAUgATUCHCIUfnwhBCADIARCIIh8IQMgBEL/////D4MgByASfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgESAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCITIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DIAcgFH58IQMgBCADQiCIfCEEIANC/////w+DIAkgEn58IQMgBCADQiCIfCEEIANC/////w+DIAsgEH58IQMgBCADQiCIfCEEIANC/////w+DIA0gDn58IQMgBCADQiCIfCEEIANC/////w+DIA8gDH58IQMgBCADQiCIfCEEIANC/////w+DIBEgCn58IQMgBCADQiCIfCEEIANC/////w+DIBMgCH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgCyASfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAKfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyALIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyARIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyATIAx+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIARC/////w+DIA0gFH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gEn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgDn58IQQgAyAEQiCIfCEDIAIgBD4CLCADQiCIIQQgA0L/////D4MgDyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESASfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAQfnwhAyAEIANCIIh8IQQgAiADPgIwIARCIIghAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBJ+fCEEIAMgBEIgiHwhAyACIAQ+AjQgA0IgiCEEIANC/////w+DIBMgFH58IQMgBCADQiCIfCEEIAIgAz4COCAEQiCIIQMgAiAEPgI8C4wSDAF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiBiAGfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgQiB358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCCCIIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIMIgl+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhAiCn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAggCH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCFCILfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIYIgx+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAJIAl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhwiDX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAggC358IQIgAyACQiCIfCEDIAJC/////w+DIAkgCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAggDH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAggDX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAogC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAkgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAogDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAsgC358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAsgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAwgDH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAwgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjggAyEEIARCIIghBSABIAQ+AjwLCgAgACAAIAEQCAu2AQEBfiAANQAAIAF+IQMgAiADPgAAIAA1AAQgAX4gA0IgiHwhAyACIAM+AAQgADUACCABfiADQiCIfCEDIAIgAz4ACCAANQAMIAF+IANCIIh8IQMgAiADPgAMIAA1ABAgAX4gA0IgiHwhAyACIAM+ABAgADUAFCABfiADQiCIfCEDIAIgAz4AFCAANQAYIAF+IANCIIh8IQMgAiADPgAYIAA1ABwgAX4gA0IgiHwhAyACIAM+ABwLTgIBfgF/IAAhAyADNQAAIAF8IQIgAyACPgAAIAJCIIghAgJAA0AgAlANASADQQRqIQMgAzUAACACfCECIAMgAj4AACAC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NQIEIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QegDNQIIIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QegDNQIMIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QegDNQIQIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QegDNQIUIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QegDNQIYIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QegDNQIcIAR+fCEDIAAgAz4COEGIBiADQiCIPgIcQYgGIABBIGogARAQC74fIwF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5CiceZpA4hBSADQv////8PgyAANQIAIgYgATUCACIHfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIQggA0L/////D4NBADUC6AMiCSAIfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCBCILfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIKIAd+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLsAyINIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhDCAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIIIg9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIg4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AvADIhEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEQIANC/////w+DIAkgEH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgwiE358IQQgAyAEQiCIfCEDIARC/////w+DIAogD358IQQgAyAEQiCIfCEDIARC/////w+DIA4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgwiEiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC9AMiFSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRQgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCECIXfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECIWIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQL4AyIZIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhGCADQv////8PgyAJIBh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIUIht+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIhogB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gGH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AvwDIh0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEcIARC/////w+DIAkgHH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhgiH358IQMgBCADQiCIfCEEIANC/////w+DIAogG358IQMgBCADQiCIfCEEIANC/////w+DIA4gF358IQMgBCADQiCIfCEEIANC/////w+DIBIgE358IQMgBCADQiCIfCEEIANC/////w+DIBYgD358IQMgBCADQiCIfCEEIANC/////w+DIBogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhgiHiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCgAQiISAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DISAgA0L/////D4MgCSAgfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCHCIjfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAffnwhBCADIARCIIh8IQMgBEL/////D4MgDiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgFiATfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgHiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCIiIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKEBCIlIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhJCAEQv////8PgyAJICR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgCiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgEiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAMfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAOICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBB+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIBIgI358IQMgBCADQiCIfCEEIANC/////w+DIBYgH358IQMgBCADQiCIfCEEIANC/////w+DIBogG358IQMgBCADQiCIfCEEIANC/////w+DIB4gF358IQMgBCADQiCIfCEEIANC/////w+DICIgE358IQMgBCADQiCIfCEEIANC/////w+DIBUgJH58IQMgBCADQiCIfCEEIANC/////w+DIBkgIH58IQMgBCADQiCIfCEEIANC/////w+DIB0gHH58IQMgBCADQiCIfCEEIANC/////w+DICEgGH58IQMgBCADQiCIfCEEIANC/////w+DICUgFH58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgFiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAffnwhBCADIARCIIh8IQMgBEL/////D4MgHiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgISAcfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAYfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAaICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAdICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBx+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIB4gI358IQQgAyAEQiCIfCEDIARC/////w+DICIgH358IQQgAyAEQiCIfCEDIARC/////w+DICEgJH58IQQgAyAEQiCIfCEDIARC/////w+DICUgIH58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgIiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAkfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyACIAQ+AhwgA6cEQCACQegDIAIQBxoFIAJB6AMQBQRAIAJB6AMgAhAHGgsLC7shHQF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5CiceZpA4hBkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQggAkL/////D4NBADUC6AMiCSAIfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCBCIKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DQQA1AuwDIgwgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyELIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AggiDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLwAyIPIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhDiACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIMIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC9AMiEiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIREgAkL/////D4MgCSARfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCECITfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gDn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AvgDIhUgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEUIAJC/////w+DIAkgFH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhQiFn58IQIgAyACQiCIfCEDIAJC/////w+DIAogE358IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8PgyASIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAVIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQL8AyIYIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFyACQv////8PgyAJIBd+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIYIhl+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyANIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCgAQiGyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRogAkL/////D4MgCSAafnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCHCIcfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgECATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgGn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gF358IQIgAyACQiCIfCEDIAJC/////w+DIBIgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBggDn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AoQEIh4gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEdIAJC/////w+DIAkgHX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKIBx+fCECIAMgAkIgiHwhAyACQv////8PgyANIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyATIBN+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiALfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBl+fCECIAMgAkIgiHwhAyACQv////8PgyATIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAOfnwhAiADIAJCIIh8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQIBx+fCECIAMgAkIgiHwhAyACQv////8PgyATIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAWIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgEiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiARfnwhAiADIAJCIIh8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyATIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAWIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgFSAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAUfnwhAiADIAJCIIh8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAWIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAZIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAXfnwhAiADIAJCIIh8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAZIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAafnwhAiADIAJCIIh8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAcIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgHiAdfnwhAiADIAJCIIh8IQMgASACPgIYIAMhBCAEQiCIIQUgASAEPgIcIAWnBEAgAUHoAyABEAcaBSABQegDEAUEQCABQegDIAEQBxoLCwsKACAAIAAgARAUCwsAIABBiAQgARAUCxUAIABBiAoQAEGoChABQYgKIAEQEwsRACAAQcgKEBhByApBiAUQBQskACAAEAIEQEEADwsgAEHoChAYQegKQYgFEAUEQEF/DwtBAQ8LFwAgACABEBggAUHoAyABEA4gASABEBcLCQBBqAQgABAAC8sBBAF/AX8BfwF/IAIQAUEgIQUgACEDAkADQCAFIAFLDQEgBUEgRgRAQYgLEBwFQYgLQYgEQYgLEBQLIANBiAtBqAsQFCACQagLIAIQECADQSBqIQMgBUEgaiEFDAALCyABQSBwIQQgBEUEQA8LQagLEAFBACEGAkADQCAGIARGDQEgBiADLQAAOgCoCyADQQFqIQMgBkEBaiEGDAALCyAFQSBGBEBBiAsQHAVBiAtBiARBiAsQFAtBqAtBiAtBqAsQFCACQagLIAIQEAscACABIAJByAsQHUHIC0HICxAXIABByAsgAxAUC/gBBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakEgbGo2AgAgBRAcIAAhBiAFQSBqIQVBACEIAkADQCAIIAJGDQEgBhACBEAgBUEgayAFEAAFIAYgBUEgayAFEBQLIAYgAWohBiAFQSBqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUEgayEFIAMgAkEBayAEbGohByAFIAUQGwJAA0AgCEUNASAGEAIEQCAFIAVBIGsQACAHEAEFIAVBIGtB6AsQACAFIAYgBUEgaxAUIAVB6AsgBxAUCyAGIAFrIQYgByAEayEHIAVBIGshBSAIQQFrIQgMAAsLQQAgBTYCAAs+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAXIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCws+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAYIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCws+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRASIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCwtNBAF/AX8BfwF/IAAhBSABIQYgAyEHQQAhBAJAA0AgBCACRg0BIAUgBiAHEBAgBUEgaiEFIAZBIGohBiAHQSBqIQcgBEEBaiEEDAALCwtNBAF/AX8BfwF/IAAhBSABIQYgAyEHQQAhBAJAA0AgBCACRg0BIAUgBiAHEBEgBUEgaiEFIAZBIGohBiAHQSBqIQcgBEEBaiEEDAALCwtNBAF/AX8BfwF/IAAhBSABIQYgAyEHQQAhBAJAA0AgBCACRg0BIAUgBiAHEBQgBUEgaiEFIAZBIGohBiAHQSBqIQcgBEEBaiEEDAALCwuyAgIBfwF/IAJFBEAgAxAcDwsgAEGIDBAAIAMQHCACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADEBUgBUGAAU8EQCAFQYABayEFIANBiAwgAxAUCyADIAMQFSAFQcAATwRAIAVBwABrIQUgA0GIDCADEBQLIAMgAxAVIAVBIE8EQCAFQSBrIQUgA0GIDCADEBQLIAMgAxAVIAVBEE8EQCAFQRBrIQUgA0GIDCADEBQLIAMgAxAVIAVBCE8EQCAFQQhrIQUgA0GIDCADEBQLIAMgAxAVIAVBBE8EQCAFQQRrIQUgA0GIDCADEBQLIAMgAxAVIAVBAk8EQCAFQQJrIQUgA0GIDCADEBQLIAMgAxAVIAVBAU8EQCAFQQFrIQUgA0GIDCADEBQLIARFDQEMAAsLC94BAwF/AX8BfyAAEAIEQCABEAEPC0EBIQJByAVBqAwQACAAQagFQSBByAwQJiAAQegFQSBB6AwQJgJAA0BByAxBqAQQBA0BQcgMQYgNEBVBASEDAkADQEGIDUGoBBAEDQFBiA1BiA0QFSADQQFqIQMMAAsLQagMQagNEAAgAiADa0EBayEEAkADQCAERQ0BQagNQagNEBUgBEEBayEEDAALCyADIQJBqA1BqAwQFUHIDEGoDEHIDBAUQegMQagNQegMEBQMAAsLQegMEBkEQEHoDCABEBIFQegMIAEQAAsLIAAgABACBEBBAQ8LIABB6ARBIEHIDRAmQcgNQagEEAQLCgAgAEGoDhAEDwssACAAIAEgAhAGBEAgAkHoDSACEAcaBSACQegNEAUEQCACQegNIAIQBxoLCwsXACAAIAEgAhAHBEAgAkHoDSACEAYaCwsLAEHIDiAAIAEQKwucEQMBfgF+AX5C/////w4hAkIAIQMgADUCACACfkL/////D4MhBCAANQIAIANCIIh8QegNNQIAIAR+fCEDIAAgAz4CACAANQIEIANCIIh8QegNNQIEIAR+fCEDIAAgAz4CBCAANQIIIANCIIh8QegNNQIIIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QegNNQIMIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QegNNQIQIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QegNNQIUIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QegNNQIYIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QegNNQIcIAR+fCEDIAAgAz4CHEGIECADQiCIPgIAQgAhAyAANQIEIAJ+Qv////8PgyEEIAA1AgQgA0IgiHxB6A01AgAgBH58IQMgACADPgIEIAA1AgggA0IgiHxB6A01AgQgBH58IQMgACADPgIIIAA1AgwgA0IgiHxB6A01AgggBH58IQMgACADPgIMIAA1AhAgA0IgiHxB6A01AgwgBH58IQMgACADPgIQIAA1AhQgA0IgiHxB6A01AhAgBH58IQMgACADPgIUIAA1AhggA0IgiHxB6A01AhQgBH58IQMgACADPgIYIAA1AhwgA0IgiHxB6A01AhggBH58IQMgACADPgIcIAA1AiAgA0IgiHxB6A01AhwgBH58IQMgACADPgIgQYgQIANCIIg+AgRCACED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fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIEIgt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgogB358IQQgAyAEQiCIfCEDIARC/////w+DQQA1AuwNIg0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEMIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AggiD358IQMgBCADQiCIfCEEIANC/////w+DIAogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiDiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC8A0iESAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRAgA0L/////D4MgCSAQfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCDCITfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgDiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCISIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQL0DSIVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhFCAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIQIhd+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIhYgB358IQMgBCADQiCIfCEEIANC/////w+DIA0gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AvgNIhkgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEYIANC/////w+DIAkgGH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhQiG358IQQgAyAEQiCIfCEDIARC/////w+DIAogF358IQQgAyAEQiCIfCEDIARC/////w+DIA4gE358IQQgAyAEQiCIfCEDIARC/////w+DIBIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBYgC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiGiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC/A0iHSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRwgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCGCIffnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIeIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKADiIhIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhICADQv////8PgyAJICB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIcIiN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIiIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gEH58IQQgAyAEQiCIfCEDIARC/////w+DICEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AoQOIiUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEkIARC/////w+DIAkgJH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAKICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIA4gI358IQQgAyAEQiCIfCEDIARC/////w+DIBIgH358IQQgAyAEQiCIfCEDIARC/////w+DIBYgG358IQQgAyAEQiCIfCEDIARC/////w+DIBogF358IQQgAyAEQiCIfCEDIARC/////w+DIB4gE358IQQgAyAEQiCIfCEDIARC/////w+DICIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgEiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgAiADPgIIIARCIIghAyAEQv////8PgyAWICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIBogI358IQMgBCADQiCIfCEEIANC/////w+DIB4gH358IQMgBCADQiCIfCEEIANC/////w+DICIgG358IQMgBCADQiCIfCEEIANC/////w+DIB0gJH58IQMgBCADQiCIfCEEIANC/////w+DICEgIH58IQMgBCADQiCIfCEEIANC/////w+DICUgHH58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgHiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAffnwhBCADIARCIIh8IQMgBEL/////D4MgISAkfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAgfnwhBCADIARCIIh8IQMgAiAEPgIUIANCIIghBCADQv////8PgyAiICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICR+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIAIgBD4CHCADpwRAIAJB6A0gAhAHGgUgAkHoDRAFBEAgAkHoDSACEAcaCwsLuyEdAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL/////DiEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQLoDSIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUC7A0iDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AvANIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQL0DSISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC+A0iFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AvwNIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKADiIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUChA4iHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogHH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gGX58IQIgAyACQiCIfCEDIAJC/////w+DIBAgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBMgE358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBp+fCECIAMgAkIgiHwhAyACQv////8PgyASIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAbIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAeIAt+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBAgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBMgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBYgFn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyASIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBF+fCECIAMgAkIgiHwhAyABIAI+AgggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBMgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBYgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAVIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBR+fCECIAMgAkIgiHwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBYgHH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBkgGX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAYIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBd+fCECIAMgAkIgiHwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBkgHH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAbIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBp+fCECIAMgAkIgiHwhAyABIAI+AhQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBwgHH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAeIB1+fCECIAMgAkIgiHwhAyABIAI+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IAQQDwRAIAAgASACEFQPCyADQegkEBUgBEGIJRAVIABBiCVBqCUQFCABQegkQcglEBQgA0HoJEHoJRAUIARBiCVBiCYQFCAAQSBqQYgmQagmEBQgAUEgakHoJUHIJhAUQaglQcglEAQEQEGoJkHIJhAEBEAgACACEFIPCwtByCVBqCVB6CYQEUHIJkGoJkGIJxARQegmQegmQagnEBBBqCdBqCcQFUHoJkGoJ0HIJxAUQYgnQYgnQegnEBBBqCVBqCdBqCgQFEHoJ0GIKBAVQagoQagoQcgoEBBBiChByCcgAhARIAJByCggAhARQagmQcgnQegoEBRB6ChB6ChB6CgQEEGoKCACIAJBIGoQESACQSBqQegnIAJBIGoQFCACQSBqQegoIAJBIGoQESADIAQgAkHAAGoQECACQcAAaiACQcAAahAVIAJBwABqQegkIAJBwABqEBEgAkHAAGpBiCUgAkHAAGoQESACQcAAakHoJiACQcAAahAUCxQAIAAgARAAIABBIGogAUEgahASCyIAIAAgARAAIABBIGogAUEgahASIABBwABqIAFBwABqEAALEgAgAUGIKRBWIABBiCkgAhBTCxIAIAFB6CkQViAAQegpIAIQVAsSACABQcgqEFcgAEHIKiACEFULFAAgACABEBggAEEgaiABQSBqEBgLIgAgACABEBggAEEgaiABQSBqEBggAEHAAGogAUHAAGoQGAsUACAAIAEQFyAAQSBqIAFBIGoQFwsiACAAIAEQFyAAQSBqIAFBIGoQFyAAQcAAaiABQcAAahAXC0sAIAAQSARAIAEQASABQSBqEAEFIABBwABqQagrEBtBqCtByCsQFUGoK0HIK0HoKxAUIABByCsgARAUIABBIGpB6CsgAUEgahAUCwsxACAAQSBqQYgsEBUgAEGoLBAVIABBqCxBqCwQFEGoLEGIGEGoLBAQQYgsQagsEAQPCw8AIABByCwQX0HILBBgDwuuAQUBfwF/AX8BfwF/QQAoAgAhA0EAIAMgAUEgbGo2AgAgAEHAAGpB4AAgASADQSAQHyAAIQQgAyEFIAIhBkEAIQcCQANAIAcgAUYNASAFEAIEQCAGEAEgBkEgahABBSAFIARBIGpBiC0QFCAFIAUQFSAFIAQgBhAUIAVBiC0gBkEgahAUCyAEQeAAaiEEIAZBwABqIQYgBUEg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IGohCAwACwsLTAQBfwF/AX8BfyAAIQQgASEFIAMhBiAAIAJBIGxqIQcCQANAIAQgB0YNASAEIAUgBhAqIARBIGohBCAFQSBqIQUgBkEgaiEGDAALCwsOACAAEAIgAEEgahACcQsPACAAEA8gAEEgahACcQ8LDQAgABABIABBIGoQAQsNACAAEBwgAEEgahABCxQAIAAgARAAIABBIGogAUEgahAAC3UAIAAgAUHI1wAQFCAAQSBqIAFBIGpB6NcAEBQgACAAQSBqQYjYABAQIAEgAUEgakGo2AAQEEGI2ABBqNgAQYjYABAUQejXACACEBJByNcAIAIgAhAQQcjXAEHo1wAgAkEgahAQQYjYACACQSBqIAJBIGoQEQsYACAAIAEgAhAUIABBIGogASACQSBqEBQLcAAgACAAQSBqQcjYABAUIAAgAEEgakHo2AAQECAAQSBqQYjZABASIABBiNkAQYjZABAQQcjYAEGo2QAQEkGo2QBByNgAQajZABAQQejYAEGI2QAgARAUIAFBqNkAIAEQEUHI2ABByNgAIAFBIGoQEAsbACAAIAEgAhAQIABBIGogAUEgaiACQSBqEBALGwAgACABIAIQESAAQSBqIAFBIGogAkEgahARCxQAIAAgARASIABBIGogAUEgahASCxQAIAAgARAAIABBIGogAUEgahASCxQAIAAgARAXIABBIGogAUEgahAXCxQAIAAgARAYIABBIGogAUEgahAYCxUAIAAgARAEIABBIGogAUEgahAEcQtdACAAQcjZABAVIABBIGpB6NkAEBVB6NkAQYjaABASQcjZAEGI2gBBiNoAEBFBiNoAQajaABAbIABBqNoAIAEQFCAAQSBqQajaACABQSBqEBQgAUEgaiABQSBqEBILHAAgACABIAIgAxAeIABBIGogASACIANBIGoQHgsaAQF/IABBIGoQGiEBIAEEQCABDwsgABAaDwsZACAAQSBqEAIEQCAAEBkPCyAAQSBqEBkPC48CBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakHAAGxqNgIAIAUQjQEgACEGIAVBwABqIQVBACEIAkADQCAIIAJGDQEgBhCKAQRAIAVBwABrIAUQjgEFIAYgBUHAAGsgBRCPAQsgBiABaiEGIAVBwABqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUHAAGshBSADIAJBAWsgBGxqIQcgBSAFEJkBAkADQCAIRQ0BIAYQigEEQCAFIAVBwABrEI4BIAcQjAEFIAVBwABrQcjaABCOASAFIAYgBUHAAGsQjwEgBUHI2gAgBxCPAQsgBiABayEGIAcgBGshByAFQcAAayEFIAhBAWshCAwACwtBACAFNgIAC84CAgF/AX8gAkUEQCADEI0BDwsgAEGI2wAQjgEgAxCNASACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADEJEBIAVBgAFPBEAgBUGAAWshBSADQYjbACADEI8BCyADIAMQkQEgBUHAAE8EQCAFQcAAayEFIANBiNsAIAMQjwELIAMgAxCRASAFQSBPBEAgBUEgayEFIANBiNsAIAMQjwELIAMgAxCRASAFQRBPBEAgBUEQayEFIANBiNsAIAMQjwELIAMgAxCRASAFQQhPBEAgBUEIayEFIANBiNsAIAMQjwELIAMgAxCRASAFQQRPBEAgBUEEayEFIANBiNsAIAMQjwELIAMgAxCRASAFQQJPBEAgBUECayEFIANBiNsAIAMQjwELIAMgAxCRASAFQQFPBEAgBUEBayEFIANBiNsAIAMQjwELIARFDQEMAAsLC80BAEHI3QAQjQFByN0AQcjdABCUASAAQcjbAEEgQYjcABCeAUGI3ABByNwAEJEBIABByNwAQcjcABCPAUHI3ABBiN0AEJUBQYjdAEHI3ABBiN0AEI8BQYjdAEHI3QAQmAEEQAALQYjcACAAQYjeABCPAUHI3ABByN0AEJgBBEBByN0AEAFB6N0AEBxByN0AQYjeACABEI8BBUHI3gAQjQFByN4AQcjcAEHI3gAQkgFByN4AQejbAEEgQcjeABCeAUHI3gBBiN4AIAEQjwELC2kAQejgABCNAUHo4ABB6OAAEJQBIABBiN8AQSBBqN8AEJ4BQajfAEHo3wAQkQEgAEHo3wBB6N8AEI8BQejfAEGo4AAQlQFBqOAAQejfAEGo4AAQjwFBqOAAQejgABCYAQRAQQAPC0EBDwsRACAAEIoBIABBwABqEIoBcQsLACAAQYABahCKAQsQACAAEIwBIABBwABqEIwBCxkAIAAQjAEgAEHAAGoQjQEgAEGAAWoQjAELogEAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYIAEgACkDYDcDYCABIAApA2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeAuCAgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBIAEgACkDkAE3A5ABIAEgACkDmAE3A5gBIAEgACkDoAE3A6ABIAEgACkDqAE3A6gBIAEgACkDsAE3A7ABIAEgACkDuAE3A7gBCy8AIAAQoQEEQCABEKQBBSABQYABahCNASAAQcAAaiABQcAAahCOASAAIAEQjgELCxwBAX8gACABEJgBIABBwABqIAFBwABqEJgBcQ8LiwEBAX8gAEGAAWohAiAAEKIBBEAgARChAQ8LIAEQoQEEQEEADwsgAhCLAQRAIAAgARCoAQ8LIAJB6OEAEJEBIAFB6OEAQajiABCPASACQejhAEHo4gAQjwEgAUHAAGpB6OIAQajjABCPASAAQajiABCYAQRAIABBwABqQajjABCYAQRAQQEPCwtBAA8L2QECAX8BfyAAQYABaiECIAFBgAFqIQMgABCiAQRAIAEQogEPCyABEKIBBEBBAA8LIAIQiwEEQCABIAAQqQEPCyADEIsBBEAgACABEKkBDwsgAkHo4wAQkQEgA0Go5AAQkQEgAEGo5ABB6OQAEI8BIAFB6OMAQajlABCPASACQejjAEHo5QAQjwEgA0Go5ABBqOYAEI8BIABBwABqQajmAEHo5gAQjwEgAUHAAGpB6OUAQajnABCPAUHo5ABBqOUAEJgBBEBB6OYAQajnABCYAQRAQQEPCwtBAA8LrAIAIAAQoQEEQCAAIAEQpwEPCyAAQejnABCRASAAQcAAakGo6AAQkQFBqOgAQejoABCRASAAQajoAEGo6QAQkgFBqOkAQajpABCRAUGo6QBB6OcAQajpABCTAUGo6QBB6OgAQajpABCTAUGo6QBBqOkAQajpABCSAUHo5wBB6OcAQejpABCSAUHo6QBB6OcAQejpABCSASAAQcAAaiAAQcAAaiABQYABahCSAUHo6QAgARCRASABQajpACABEJMBIAFBqOkAIAEQkwFB6OgAQejoAEGo6gAQkgFBqOoAQajqAEGo6gAQkgFBqOoAQajqAEGo6gAQkgFBqOkAIAEgAUHAAGoQkwEgAUHAAGpB6OkAIAFBwABqEI8BIAFBwABqQajqACABQcAAahCTAQvUAgAgABCiAQRAIAAgARCmAQ8LIABBgAFqEIsBBEAgACABEKsBDw8LIABB6OoAEJEBIABBwABqQajrABCRAUGo6wBB6OsAEJEBIABBqOsAQajsABCSAUGo7ABBqOwAEJEBQajsAEHo6gBBqOwAEJMBQajsAEHo6wBBqOwAEJMBQajsAEGo7ABBqOwAEJIBQejqAEHo6gBB6OwAEJIBQejsAEHo6gBB6OwAEJIBQejsAEGo7QAQkQEgAEHAAGogAEGAAWpB6O0AEI8BQajsAEGo7AAgARCSAUGo7QAgASABEJMBQejrAEHo6wBBqO4AEJIBQajuAEGo7gBBqO4AEJIBQajuAEGo7gBBqO4AEJIBQajsACABIAFBwABqEJMBIAFBwABqQejsACABQcAAahCPASABQcAAakGo7gAgAUHAAGoQkwFB6O0AQejtACABQYABahCSAQvsAgEBfyAAQYABaiEDIAAQoQEEQCABIAIQpQEgAkGAAWoQjQEPCyABEKEBBEAgACACEKUBIAJBgAFqEI0BDwsgACABEJgBBEAgAEHAAGogAUHAAGoQmAEEQCABIAIQqwEPCwsgASAAQejuABCTASABQcAAaiAAQcAAakHo7wAQkwFB6O4AQajvABCRAUGo7wBBqO8AQajwABCSAUGo8ABBqPAAQajwABCSAUHo7gBBqPAAQejwABCPAUHo7wBB6O8AQajxABCSASAAQajwAEGo8gAQjwFBqPEAQejxABCRAUGo8gBBqPIAQejyABCSAUHo8QBB6PAAIAIQkwEgAkHo8gAgAhCTASAAQcAAakHo8ABBqPMAEI8BQajzAEGo8wBBqPMAEJIBQajyACACIAJBwABqEJMBIAJBwABqQajxACACQcAAahCPASACQcAAakGo8wAgAkHAAGoQkwFB6O4AQejuACACQYABahCSAQvcAwEBfyAAQYABaiEDIAAQogEEQCABIAIQpQEgAkGAAWoQjQEPCyABEKEBBEAgACACEKYBDwsgAxCLAQRAIAAgASACEK0BDwsgA0Ho8wAQkQEgAUHo8wBBqPQAEI8BIANB6PMAQej0ABCPASABQcAAakHo9ABBqPUAEI8BIABBqPQAEJgBBEAgAEHAAGpBqPUAEJgBBEAgASACEKsBDwsLQaj0ACAAQej1ABCTAUGo9QAgAEHAAGpB6PYAEJMBQej1AEGo9gAQkQFBqPYAQaj2AEGo9wAQkgFBqPcAQaj3AEGo9wAQkgFB6PUAQaj3AEHo9wAQjwFB6PYAQej2AEGo+AAQkgEgAEGo9wBBqPkAEI8BQaj4AEHo+AAQkQFBqPkAQaj5AEHo+QAQkgFB6PgAQej3ACACEJMBIAJB6PkAIAIQkwEgAEHAAGpB6PcAQaj6ABCPAUGo+gBBqPoAQaj6ABCSAUGo+QAgAiACQcAAahCTASACQcAAakGo+AAgAkHAAGoQjwEgAkHAAGpBqPoAIAJBwABqEJMBIANB6PUAIAJBgAFqEJIBIAJBgAFqIAJBgAFqEJEBIAJBgAFqQejzACACQYABahCTASACQYABakGo9gAgAkGAAWoQkwELpQQCAX8BfyAAQYABaiEDIAFBgAFqIQQgABCiAQRAIAEgAhCmAQ8LIAEQogEEQCAAIAIQpgEPCyADEIsBBEAgASAAIAIQrgEPCyAEEIsBBEAgACABIAIQrgEPCyADQej6ABCRASAEQaj7ABCRASAAQaj7AEHo+wAQjwEgAUHo+gBBqPwAEI8BIANB6PoAQej8ABCPASAEQaj7AEGo/QAQjwEgAEHAAGpBqP0AQej9ABCPASABQcAAakHo/ABBqP4AEI8BQej7AEGo/AAQmAEEQEHo/QBBqP4AEJgBBEAgACACEKwBDwsLQaj8AEHo+wBB6P4AEJMBQaj+AEHo/QBBqP8AEJMBQej+AEHo/gBB6P8AEJIBQej/AEHo/wAQkQFB6P4AQej/AEGogAEQjwFBqP8AQaj/AEHogAEQkgFB6PsAQej/AEHogQEQjwFB6IABQaiBARCRAUHogQFB6IEBQaiCARCSAUGogQFBqIABIAIQkwEgAkGoggEgAhCTAUHo/QBBqIABQeiCARCPAUHoggFB6IIBQeiCARCSAUHogQEgAiACQcAAahCTASACQcAAakHogAEgAkHAAGoQjwEgAkHAAGpB6IIBIAJBwABqEJMBIAMgBCACQYABahCSASACQYABaiACQYABahCRASACQYABakHo+gAgAkGAAWoQkwEgAkGAAWpBqPsAIAJBgAFqEJMBIAJBgAFqQej+ACACQYABahCPAQsYACAAIAEQjgEgAEHAAGogAUHAAGoQlAELJwAgACABEI4BIABBwABqIAFBwABqEJQBIABBgAFqIAFBgAFqEI4BCxYAIAFBqIMBELABIABBqIMBIAIQrQELFgAgAUHohAEQsAEgAEHohAEgAhCuAQsWACABQaiGARCxASAAQaiGASACEK8BCxgAIAAgARCXASAAQcAAaiABQcAAahCXAQsnACAAIAEQlwEgAEHAAGogAUHAAGoQlwEgAEGAAWogAUGAAWoQlwELGAAgACABEJYBIABBwABqIAFBwABqEJYBCycAIAAgARCWASAAQcAAaiABQcAAahCWASAAQYABaiABQYABahCWAQteACAAEKIBBEAgARCMASABQcAAahCMAQUgAEGAAWpB6IcBEJkBQeiHAUGoiAEQkQFB6IcBQaiIAUHoiAEQjwEgAEGoiAEgARCPASAAQcAAakHoiAEgAUHAAGoQjwELC0AAIABBwABqQaiJARCRASAAQeiJARCRASAAQeiJAUHoiQEQjwFB6IkBQajhAEHoiQEQkgFBqIkBQeiJARCYAQ8LEwAgAEGoigEQuQFBqIoBELoBDwu+AQUBfwF/AX8BfwF/QQAoAgAhA0EAIAMgAUHAAGxqNgIAIABBgAFqQcABIAEgA0HAABCdASAAIQQgAyEFIAIhBkEAIQcCQANAIAcgAUYNASAFEIoBBEAgBhCMASAGQcAAahCMAQUgBSAEQcAAakGoiwEQjwEgBSAFEJEBIAUgBCAGEI8BIAVBqIsBIAZBwABqEI8BCyAEQcABaiEEIAZBgAFqIQYgBUHAAGohBSAHQQFqIQcMAAsLQQAgAzYCAAteACAAEKIBBEAgARCkAQUgAEGAAWpB6IsBEJkBQeiLAUGojAEQkQFB6IsBQaiMAUHojAEQjwEgAEGojAEgARCPASAAQcAAakHojAEgAUHAAGoQjwEgAUGAAWoQjQELCzsCAX8BfyACIAFqQQFr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IAEQjwEgAEHAAGpBkIcEIAFBwABqEI8BIABBgAFqQdCHBCABQYABahCPASAAQcABakGQiAQgAUHAAWoQjwEgAEGAAmpB0IgEIAFBgAJqEI8BIABBwAJqQZCJBCABQcACahCPAQuKAgAgACABEAAgAEEgaiABQSBqEBIgAUHQiQQgARCPASAAQcAAaiABQcAAahAAIABB4ABqIAFB4ABqEBIgAUHAAGpBkIoEIAFBwABqEI8BIABBgAFqIAFBgAFqEAAgAEGgAWogAUGgAWoQEiABQYABakHQigQgAUGAAWoQjwEgAEHAAWogAUHAAWoQACAAQeABaiABQeABahASIAFBwAFqQZCLBCABQcABahCPASAAQYACaiABQYACahAAIABBoAJqIAFBoAJqEBIgAUGAAmpB0IsEIAFBgAJqEI8BIABBwAJqIAFBwAJqEAAgAEHgAmogAUHgAmoQEiABQcACakGQjAQgAUHAAmoQjwELbAAgAEHQjAQgARCPASAAQcAAakGQjQQgAUHAAGoQjwEgAEGAAWpB0I0EIAFBgAFqEI8BIABBwAFqQZCOBCABQcABahCPASAAQYACakHQjgQgAUGAAmoQjwEgAEHAAmpBkI8EIAFBwAJqEI8BC4oCACAAIAEQACAAQSBqIAFBIGoQEiABQdCPBCABEI8BIABBwABqIAFBwABqEAAgAEHgAGogAUHgAGoQEiABQcAAakGQkAQgAUHAAGoQjwEgAEGAAWogAUGAAWoQACAAQaABaiABQaABahASIAFBgAFqQdCQBCABQYABahCPASAAQcABaiABQcABahAAIABB4AFqIAFB4AFqEBIgAUHAAWpBkJEEIAFBwAFqEI8BIABBgAJqIAFBgAJqEAAgAEGgAmogAUGgAmoQEiABQYACakHQkQQgAUGAAmoQjwEgAEHAAmogAUHAAmoQACAAQeACaiABQeACahASIAFBwAJqQZCSBCABQcACahCPAQtsACAAQdCSBCABEI8BIABBwABqQZCTBCABQcAAahCPASAAQYABakHQkwQgAUGAAWoQjwEgAEHAAWpBkJQEIAFBwAFqEI8BIABBgAJqQdCUBCABQYACahCPASAAQcACakGQlQQgAUHAAmoQjwELigIAIAAgARAAIABBIGogAUEgahASIAFB0JUEIAEQjwEgAEHAAGogAUHAAGoQ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";
const pq$1 = 488;
const pG1gen$1 = 31432;
const pG1zero$1 = 31528;
const pG1b$1 = 3080;
const pG2gen$1 = 31624;
const pG2zero$1 = 31816;
const pG2b$1 = 12456;
const pOneT$1 = 32008;
const prePSize$1 = 192;
const preQSize$1 = 19776;
const q$1 = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
const r$1 = "21888242871839275222246405745257275088548364400416034343698204186575808495617";

// base64 -> Uint8Array, used once at curve load to decode the vendored wasm.
//
// Prefer the platform decoder (Buffer in Node, atob in browsers/extensions) for
// speed, and fall back to a pure-JS implementation only where neither exists --
// e.g. a SES/Snap realm that has not endowed atob/Buffer. The fallback keeps the
// curve loadable everywhere without depending on any host base64 primitive.

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let LOOKUP;

function decodePureJs(b64) {
    if (!LOOKUP) {
        LOOKUP = new Uint8Array(256);
        for (let i = 0; i < CHARS.length; i++) LOOKUP[CHARS.charCodeAt(i)] = i;
    }
    const len = b64.length;
    let pad = 0;
    if (len > 0 && b64[len - 1] === "=") pad++;
    if (len > 1 && b64[len - 2] === "=") pad++;
    const outLen = ((len * 3) >> 2) - pad;
    const out = new Uint8Array(outLen);
    let o = 0;
    for (let i = 0; i < len; i += 4) {
        const a = LOOKUP[b64.charCodeAt(i)];
        const b = LOOKUP[b64.charCodeAt(i + 1)];
        const c = LOOKUP[b64.charCodeAt(i + 2)];
        const d = LOOKUP[b64.charCodeAt(i + 3)];
        if (o < outLen) out[o++] = (a << 2) | (b >> 4);
        if (o < outLen) out[o++] = ((b & 15) << 4) | (c >> 2);
        if (o < outLen) out[o++] = ((c & 3) << 6) | d;
    }
    return out;
}

function base64ToUint8Array(b64) {
    if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
        // Node (and Node-compatible runtimes) — fastest.
        return new Uint8Array(Buffer.from(b64, "base64"));
    }
    if (typeof atob === "function") {
        // Browsers, extensions, modern Node, Deno.
        const bin = atob(b64);
        const out = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
        return out;
    }
    // SES/Snap or any host without a base64 primitive.
    return decodePureJs(b64);
}

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a MetaMask Snap / SES lockdown realm) throws at module load.
let curve_bn128 = null;

async function buildBn128(singleThread, plugins) {
    if ((!singleThread) && (curve_bn128)) return curve_bn128;

    let bn128wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: statically imported (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES/Snap
        // realms alike. Regenerate the vendored module with `npm run gen-wasm`.
        bn128wasm.code = base64ToUint8Array(code$1);
        bn128wasm.pq = pq$1;
        bn128wasm.pr = pq$1;
        bn128wasm.pG1gen = pG1gen$1;
        bn128wasm.pG1zero = pG1zero$1;
        bn128wasm.pG1b = pG1b$1;
        bn128wasm.pG2gen = pG2gen$1;
        bn128wasm.pG2zero = pG2zero$1;
        bn128wasm.pG2b = pG2b$1;
        bn128wasm.pOneT = pOneT$1;
        bn128wasm.prePSize = prePSize$1;
        bn128wasm.preQSize = preQSize$1;
        bn128wasm.n8q = 32;
        bn128wasm.n8r = 32;
        bn128wasm.q = q$1;
        bn128wasm.r = r$1;
    } else {
        // Custom-plugin build path: builds the wasm at runtime, so it needs the
        // wasm toolchain. Kept as a dynamic import so wasmbuilder/wasmcurves stay
        // OPTIONAL dependencies (only required when a caller passes `plugins`).
        const { ModuleBuilder } = await import('wasmbuilder');
        const { buildBn128: buildBn128wasm } = await import('wasmcurves');

        const moduleBuilder = new ModuleBuilder();
        moduleBuilder.setMemory(25);
        buildBn128wasm(moduleBuilder);

        if (plugins) plugins(moduleBuilder);

        bn128wasm.code = moduleBuilder.build();
        bn128wasm.pq = moduleBuilder.modules.f1m.pq;
        bn128wasm.pr = moduleBuilder.modules.frm.pq;
        bn128wasm.pG1gen = moduleBuilder.modules.bn128.pG1gen;
        bn128wasm.pG1zero = moduleBuilder.modules.bn128.pG1zero;
        bn128wasm.pG1b = moduleBuilder.modules.bn128.pG1b;
        bn128wasm.pG2gen = moduleBuilder.modules.bn128.pG2gen;
        bn128wasm.pG2zero = moduleBuilder.modules.bn128.pG2zero;
        bn128wasm.pG2b = moduleBuilder.modules.bn128.pG2b;
        bn128wasm.pOneT = moduleBuilder.modules.bn128.pOneT;
        bn128wasm.prePSize = moduleBuilder.modules.bn128.prePSize;
        bn128wasm.preQSize = moduleBuilder.modules.bn128.preQSize;
        bn128wasm.n8q = 32;
        bn128wasm.n8r = 32;
        bn128wasm.q = moduleBuilder.modules.bn128.q;
        bn128wasm.r = moduleBuilder.modules.bn128.r;
    }

    const params = {
        name: "bn128",
        wasm: bn128wasm,
        q: e("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
        r: e("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
        n8q: 32,
        n8r: 32,
        cofactorG2: e("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function () {
        if (!params.singleThread) {
            curve_bn128 = null;
            await this.tm.terminate();
        }
    };

    if (!singleThread) {
        curve_bn128 = curve;
    }

    return curve;
}

// AUTO-GENERATED from wasmcurves/build/bls12381_wasm.js — do not edit.
// Regenerate with: npm run gen-wasm
// 'code' is base64 of the raw (uncompressed) wasm; the rest are pointer
// offsets / field moduli.
const code = "AGFzbQEAAAABlAESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCn9/f39/f39/f38AYAV/f39/fwF/YAd/f39/f39/AX9gCX9/f39/f39/fwF/YAt/f39/f39/f39/fwF/Ag8BA2VudgZtZW1vcnkCABkD0wLRAgABAgEDAwQEBQAABgcIBQIFBQAABQAAAAACAgABBQgJBQUFCAgICAACAAECAQMDBAQFAAAGBwgFAgUFAAAFAAAAAAICAAEFCAkFBQUICAgIAAIFAAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAICBQAFAAAAAAUFBQUFCgALCQoACwkICAMACAgCAAAJDAwFBQwACA0JCAICAQEABQUABQUAAAAAAwAIAgIJCAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAICBQAFAAAAAAUFBQUFCgALCQoACwkICAUDAAgIAgAACQwMBQUMBQMACAgCAAAJDAwFBQwFBQkJCQkJAAICAQEABQAFBQACAAADAAgCCQgAAgIBAQAFBQAFBQAAAAADAAgCAgkIAAIFCAkFAAAAAAAAAAAAAAICAgIFAAAABQAAAAAEDg8QEQUHzie9AglpbnRxX2NvcHkAAAlpbnRxX3plcm8AAQhpbnRxX29uZQADC2ludHFfaXNaZXJvAAIHaW50cV9lcQAECGludHFfZ3RlAAUIaW50cV9hZGQABghpbnRxX3N1YgAHCGludHFfbXVsAAgLaW50cV9zcXVhcmUACQ5pbnRxX3NxdWFyZU9sZAAKCGludHFfZGl2AA0PaW50cV9pbnZlcnNlTW9kAA4IZjFtX2NvcHkAAAhmMW1femVybwABCmYxbV9pc1plcm8AAgZmMW1fZXEABAdmMW1fYWRkABAHZjFtX3N1YgARB2YxbV9uZWcAEg5mMW1faXNOZWdhdGl2ZQAZCWYxbV9pc09uZQAPCGYxbV9zaWduABoLZjFtX21SZWR1Y3QAEwdmMW1fbXVsABQKZjFtX3NxdWFyZQAVDWYxbV9zcXVhcmVPbGQAFhJmMW1fZnJvbU1vbnRnb21lcnkAGBBmMW1fdG9Nb250Z29tZXJ5ABcLZjFtX2ludmVyc2UAGwdmMW1fb25lABwIZjFtX2xvYWQAHQ9mMW1fdGltZXNTY2FsYXIAHgdmMW1fZXhwACYQZjFtX2JhdGNoSW52ZXJzZQAfCGYxbV9zcXJ0ACcMZjFtX2lzU3F1YXJlACgVZjFtX2JhdGNoVG9Nb250Z29tZXJ5ACAXZjFtX2JhdGNoRnJvbU1vbnRnb21lcnkAIQlpbnRyX2NvcHkAKQlpbnRyX3plcm8AKghpbnRyX29uZQAsC2ludHJfaXNaZXJvACsHaW50cl9lcQAtCGludHJfZ3RlAC4IaW50cl9hZGQALwhpbnRyX3N1YgAwCGludHJfbXVsADELaW50cl9zcXVhcmUAMg5pbnRyX3NxdWFyZU9sZAAzCGludHJfZGl2ADYPaW50cl9pbnZlcnNlTW9kADcIZnJtX2NvcHkAKQhmcm1femVybwAqCmZybV9pc1plcm8AKwZmcm1fZXEALQdmcm1fYWRkADkHZnJtX3N1YgA6B2ZybV9uZWcAOw5mcm1faXNOZWdhdGl2ZQBCCWZybV9pc09uZQA4CGZybV9zaWduAEMLZnJtX21SZWR1Y3QAPAdmcm1fbXVsAD0KZnJtX3NxdWFyZQA+DWZybV9zcXVhcmVPbGQAPxJmcm1fZnJvbU1vbnRnb21lcnkAQRBmcm1fdG9Nb250Z29tZXJ5AEALZnJtX2ludmVyc2UARAdmcm1fb25lAEUIZnJtX2xvYWQARg9mcm1fdGltZXNTY2FsYXIARwdmcm1fZXhwAE8QZnJtX2JhdGNoSW52ZXJzZQBICGZybV9zcXJ0AFAMZnJtX2lzU3F1YXJlAFEVZnJtX2JhdGNoVG9Nb250Z29tZXJ5AEkXZnJtX2JhdGNoRnJvbU1vbnRnb21lcnkASgZmcl9hZGQAOQZmcl9zdWIAOgZmcl9uZWcAOwZmcl9tdWwAUglmcl9zcXVhcmUAUwpmcl9pbnZlcnNlAFQNZnJfaXNOZWdhdGl2ZQBVB2ZyX2NvcHkAKQdmcl96ZXJvACoGZnJfb25lAEUJZnJfaXNaZXJvACsFZnJfZXEALQxnMW1fbXVsdGlleHAAgAESZzFtX211bHRpZXhwX2NodW5rAH8SZzFtX211bHRpZXhwQWZmaW5lAIQBGGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawCDAQpnMW1faXNaZXJvAFcQZzFtX2lzWmVyb0FmZmluZQBWBmcxbV9lcQBfC2cxbV9lcU1peGVkAF4MZzFtX2VxQWZmaW5lAF0IZzFtX2NvcHkAWw5nMW1fY29weUFmZmluZQBaCGcxbV96ZXJvAFkOZzFtX3plcm9BZmZpbmUAWApnMW1fZG91YmxlAGEQZzFtX2RvdWJsZUFmZmluZQBgB2cxbV9hZGQAZAxnMW1fYWRkTWl4ZWQAYw1nMW1fYWRkQWZmaW5lAGIHZzFtX25lZwBmDWcxbV9uZWdBZmZpbmUAZQdnMW1fc3ViAGkMZzFtX3N1Yk1peGVkAGgNZzFtX3N1YkFmZmluZQBnEmcxbV9mcm9tTW9udGdvbWVyeQBrGGcxbV9mcm9tTW9udGdvbWVyeUFmZmluZQBqEGcxbV90b01vbnRnb21lcnkAbRZnMW1fdG9Nb250Z29tZXJ5QWZmaW5lAGwPZzFtX3RpbWVzU2NhbGFyAIUBFWcxbV90aW1lc1NjYWxhckFmZmluZQCGAQ1nMW1fbm9ybWFsaXplAHIKZzFtX0xFTXRvVQB0CmcxbV9MRU10b0MAdQpnMW1fVXRvTEVNAHYKZzFtX0N0b0xFTQB3D2cxbV9iYXRjaExFTXRvVQB4D2cxbV9iYXRjaExFTXRvQwB5D2cxbV9iYXRjaFV0b0xFTQB6D2cxbV9iYXRjaEN0b0xFTQB7DGcxbV90b0FmZmluZQBuDmcxbV90b0phY29iaWFuAFwRZzFtX2JhdGNoVG9BZmZpbmUAcRNnMW1fYmF0Y2hUb0phY29iaWFuAHwLZzFtX2luQ3VydmUAcBFnMW1faW5DdXJ2ZUFmZmluZQBvF2ZybV9fcmV2ZXJzZVBlcm11dGF0aW9uAIgBB2ZybV9mZnQAjAEIZnJtX2lmZnQAjQEKZnJtX3Jhd2ZmdACKAQtmcm1fZmZ0Sm9pbgCOAQ5mcm1fZmZ0Sm9pbkV4dACPARFmcm1fZmZ0Sm9pbkV4dEludgCQAQpmcm1fZmZ0TWl4AJEBDGZybV9mZnRGaW5hbACSAR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgCTAQhwb2xfemVybwCUAQ9wb2xfY29uc3RydWN0TEMAlQEMcWFwX2J1aWxkQUJDAJYBC3FhcF9qb2luQUJDAJcBDHFhcF9iYXRjaEFkZACYAQpmMm1faXNaZXJvAJkBCWYybV9pc09uZQCaAQhmMm1femVybwCbAQdmMm1fb25lAJwBCGYybV9jb3B5AJ0BB2YybV9tdWwAngEIZjJtX211bDEAnwEKZjJtX3NxdWFyZQCgAQdmMm1fYWRkAKEBB2YybV9zdWIAogEHZjJtX25lZwCjAQhmMm1fc2lnbgCqAQ1mMm1fY29uanVnYXRlAKQBEmYybV9mcm9tTW9udGdvbWVyeQCmARBmMm1fdG9Nb250Z29tZXJ5AKUBBmYybV9lcQCnAQtmMm1faW52ZXJzZQCoAQdmMm1fZXhwAK0BD2YybV90aW1lc1NjYWxhcgCpARBmMm1fYmF0Y2hJbnZlcnNlAKwBCGYybV9zcXJ0AK4BDGYybV9pc1NxdWFyZQCvAQ5mMm1faXNOZWdhdGl2ZQCrAQxnMm1fbXVsdGlleHAA2gESZzJtX211bHRpZXhwX2NodW5rANkBEmcybV9tdWx0aWV4cEFmZmluZQDeARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsA3QEKZzJtX2lzWmVybwCxARBnMm1faXNaZXJvQWZmaW5lALABBmcybV9lcQC5AQtnMm1fZXFNaXhlZAC4AQxnMm1fZXFBZmZpbmUAtwEIZzJtX2NvcHkAtQEOZzJtX2NvcHlBZmZpbmUAtAEIZzJtX3plcm8AswEOZzJtX3plcm9BZmZpbmUAsgEKZzJtX2RvdWJsZQC7ARBnMm1fZG91YmxlQWZmaW5lALoBB2cybV9hZGQAvgEMZzJtX2FkZE1peGVkAL0BDWcybV9hZGRBZmZpbmUAvAEHZzJtX25lZwDAAQ1nMm1fbmVnQWZmaW5lAL8BB2cybV9zdWIAwwEMZzJtX3N1Yk1peGVkAMIBDWcybV9zdWJBZmZpbmUAwQESZzJtX2Zyb21Nb250Z29tZXJ5AMUBGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQDEARBnMm1fdG9Nb250Z29tZXJ5AMcBFmcybV90b01vbnRnb21lcnlBZmZpbmUAxgEPZzJtX3RpbWVzU2NhbGFyAN8BFWcybV90aW1lc1NjYWxhckFmZmluZQDgAQ1nMm1fbm9ybWFsaXplAMwBCmcybV9MRU10b1UAzgEKZzJtX0xFTXRvQwDPAQpnMm1fVXRvTEVNANABCmcybV9DdG9MRU0A0QEPZzJtX2JhdGNoTEVNdG9VANIBD2cybV9iYXRjaExFTXRvQwDTAQ9nMm1fYmF0Y2hVdG9MRU0A1AEPZzJtX2JhdGNoQ3RvTEVNANUBDGcybV90b0FmZmluZQDIAQ5nMm1fdG9KYWNvYmlhbgC2ARFnMm1fYmF0Y2hUb0FmZmluZQDLARNnMm1fYmF0Y2hUb0phY29iaWFuANYBC2cybV9pbkN1cnZlAMoBEWcybV9pbkN1cnZlQWZmaW5lAMkBC2cxbV90aW1lc0ZyAOEBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uAOMBB2cxbV9mZnQA5wEIZzFtX2lmZnQA6AEKZzFtX3Jhd2ZmdADlAQtnMW1fZmZ0Sm9pbgDpAQ5nMW1fZmZ0Sm9pbkV4dADqARFnMW1fZmZ0Sm9pbkV4dEludgDrAQpnMW1fZmZ0TWl4AOwBDGcxbV9mZnRGaW5hbADtAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDuAQtnMm1fdGltZXNGcgDvARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDxAQdnMm1fZmZ0APUBCGcybV9pZmZ0APYBCmcybV9yYXdmZnQA8wELZzJtX2ZmdEpvaW4A9wEOZzJtX2ZmdEpvaW5FeHQA+AERZzJtX2ZmdEpvaW5FeHRJbnYA+QEKZzJtX2ZmdE1peAD6AQxnMm1fZmZ0RmluYWwA+wEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A/AERZzFtX3RpbWVzRnJBZmZpbmUA/QERZzJtX3RpbWVzRnJBZmZpbmUA/gERZnJtX2JhdGNoQXBwbHlLZXkA/wERZzFtX2JhdGNoQXBwbHlLZXkAgAIWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZACBAhFnMm1fYmF0Y2hBcHBseUtleQCCAhZnMm1fYmF0Y2hBcHBseUtleU1peGVkAIMCCmY2bV9pc1plcm8AhQIJZjZtX2lzT25lAIYCCGY2bV96ZXJvAIcCB2Y2bV9vbmUAiAIIZjZtX2NvcHkAiQIHZjZtX211bACKAgpmNm1fc3F1YXJlAIsCB2Y2bV9hZGQAjAIHZjZtX3N1YgCNAgdmNm1fbmVnAI4CCGY2bV9zaWduAI8CEmY2bV9mcm9tTW9udGdvbWVyeQCRAhBmNm1fdG9Nb250Z29tZXJ5AJACBmY2bV9lcQCSAgtmNm1faW52ZXJzZQCTAgdmNm1fZXhwAJcCD2Y2bV90aW1lc1NjYWxhcgCUAhBmNm1fYmF0Y2hJbnZlcnNlAJYCDmY2bV9pc05lZ2F0aXZlAJUCCmZ0bV9pc1plcm8AmQIJZnRtX2lzT25lAJoCCGZ0bV96ZXJvAJsCB2Z0bV9vbmUAnAIIZnRtX2NvcHkAnQIHZnRtX211bACeAghmdG1fbXVsMQCfAgpmdG1fc3F1YXJlAKACB2Z0bV9hZGQAoQIHZnRtX3N1YgCiAgdmdG1fbmVnAKMCCGZ0bV9zaWduAKoCDWZ0bV9jb25qdWdhdGUApAISZnRtX2Zyb21Nb250Z29tZXJ5AKYCEGZ0bV90b01vbnRnb21lcnkApQIGZnRtX2VxAKcCC2Z0bV9pbnZlcnNlAKgCB2Z0bV9leHAArQIPZnRtX3RpbWVzU2NhbGFyAKkCEGZ0bV9iYXRjaEludmVyc2UArAIIZnRtX3NxcnQArgIMZnRtX2lzU3F1YXJlAK8CDmZ0bV9pc05lZ2F0aXZlAKsCEWZ0bV9mcm9iZW5pdXNNYXAwALQCEWZ0bV9mcm9iZW5pdXNNYXAxALUCEWZ0bV9mcm9iZW5pdXNNYXAyALYCEWZ0bV9mcm9iZW5pdXNNYXAzALcCEWZ0bV9mcm9iZW5pdXNNYXA0ALgCEWZ0bV9mcm9iZW5pdXNNYXA1ALkCEWZ0bV9mcm9iZW5pdXNNYXA2ALoCEWZ0bV9mcm9iZW5pdXNNYXA3ALsCEWZ0bV9mcm9iZW5pdXNNYXA4ALwCEWZ0bV9mcm9iZW5pdXNNYXA5AL0CE2JsczEyMzgxX3BhaXJpbmdFcTEAywITYmxzMTIzODFfcGFpcmluZ0VxMgDMAhNibHMxMjM4MV9wYWlyaW5nRXEzAM0CE2JsczEyMzgxX3BhaXJpbmdFcTQAzgITYmxzMTIzODFfcGFpcmluZ0VxNQDPAhBibHMxMjM4MV9wYWlyaW5nANACEmJsczEyMzgxX3ByZXBhcmVHMQDEAhJibHMxMjM4MV9wcmVwYXJlRzIAxQITYmxzMTIzODFfbWlsbGVyTG9vcADGAhxibHMxMjM4MV9maW5hbEV4cG9uZW50aWF0aW9uAMoCH2JsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAxwIaYmxzMTIzODFfX2N5Y2xvdG9taWNTcXVhcmUAyAIaYmxzMTIzODFfX2N5Y2xvdG9taWNFeHBfdzAAyQIIZjZtX211bDEAsAIJZjZtX211bDAxALECCmZ0bV9tdWwwMTQAsgIRZzFtX2luR3JvdXBBZmZpbmUAvgILZzFtX2luR3JvdXAAvwIRZzJtX2luR3JvdXBBZmZpbmUAwAILZzJtX2luR3JvdXAAwQIKwJUF0QI+ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKAssACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxggAEIANwMgIABCADcDKAtNACAAKQMoUARAIAApAyBQBEAgACkDGFAEQCAAKQMQUARAIAApAwhQBEAgACkDAFAPBUEADwsFQQAPCwVBAA8LBUEADwsFQQAPC0EADwssACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxggAEIANwMgIABCADcDKAtrACAAKQMoIAEpAyhRBEAgACkDICABKQMgUQRAIAApAxggASkDGFEEQCAAKQMQIAEpAxBRBEAgACkDCCABKQMIUQRAIAApAwAgASkDAFEPBUEADwsFQQAPCwVBAA8LBUEADwsFQQAPC0EADwvFAQAgACkDKCABKQMoVARAQQAPBSAAKQMoIAEpAyhWBEBBAQ8FIAApAyAgASkDIFQEQEEADwUgACkDICABKQMgVgRAQQEPBSAAKQMYIAEpAxhUBEBBAA8FIAApAxggASkDGFYEQEEBDwUgACkDECABKQMQVARAQQAPBSAAKQMQIAEpAxBWBEBBAQ8FIAApAwggASkDCFQEQEEADwUgACkDCCABKQMIVgRAQQEPBSAAKQMAIAEpAwBaDwsLCwsLCwsLCwtBAA8LvAIBAX4gADUCACABNQIAfCEDIAIgAz4CACAANQIEIAE1AgR8IANCIIh8IQMgAiADPgIEIAA1AgggATUCCHwgA0IgiHwhAyACIAM+AgggADUCDCABNQIMfCADQiCIfCEDIAIgAz4CDCAANQIQIAE1AhB8IANCIIh8IQMgAiADPgIQIAA1AhQgATUCFHwgA0IgiHwhAyACIAM+AhQgADUCGCABNQIYfCADQiCIfCEDIAIgAz4CGCAANQIcIAE1Ahx8IANCIIh8IQMgAiADPgIcIAA1AiAgATUCIHwgA0IgiHwhAyACIAM+AiAgADUCJCABNQIkfCADQiCIfCEDIAIgAz4CJCAANQIoIAE1Aih8IANCIIh8IQMgAiADPgIoIAA1AiwgATUCLHwgA0IgiHwhAyACIAM+AiwgA0IgiKcLkAMBAX4gADUCACABNQIAfSEDIAIgA0L/////D4M+AgAgADUCBCABNQIEfSADQiCHfCEDIAIgA0L/////D4M+AgQgADUCCCABNQIIfSADQiCHfCEDIAIgA0L/////D4M+AgggADUCDCABNQIMfSADQiCHfCEDIAIgA0L/////D4M+AgwgADUCECABNQIQfSADQiCHfCEDIAIgA0L/////D4M+AhAgADUCFCABNQIUfSADQiCHfCEDIAIgA0L/////D4M+AhQgADUCGCABNQIYfSADQiCHfCEDIAIgA0L/////D4M+AhggADUCHCABNQIcfSADQiCHfCEDIAIgA0L/////D4M+AhwgADUCICABNQIgfSADQiCHfCEDIAIgA0L/////D4M+AiAgADUCJCABNQIkfSADQiCHfCEDIAIgA0L/////D4M+AiQgADUCKCABNQIofSADQiCHfCEDIAIgA0L/////D4M+AiggADUCLCABNQIsfSADQiCHfCEDIAIgA0L/////D4M+AiwgA0Igh6cLpyIaAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfiADQv////8PgyAANQIAIgUgATUCACIGfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAFIAE1AgQiCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiByAGfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyAFIAE1AggiCn58IQMgBCADQiCIfCEEIANC/////w+DIAcgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiCSAGfnwhAyAEIANCIIh8IQQgAiADPgIIIARCIIghAyAEQv////8PgyAFIAE1AgwiDH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgCn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgwiCyAGfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAFIAE1AhAiDn58IQMgBCADQiCIfCEEIANC/////w+DIAcgDH58IQMgBCADQiCIfCEEIANC/////w+DIAkgCn58IQMgBCADQiCIfCEEIANC/////w+DIAsgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiDSAGfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAFIAE1AhQiEH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgDn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgCn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiDyAGfnwhBCADIARCIIh8IQMgAiAEPgIUIANCIIghBCADQv////8PgyAFIAE1AhgiEn58IQMgBCADQiCIfCEEIANC/////w+DIAcgEH58IQMgBCADQiCIfCEEIANC/////w+DIAkgDn58IQMgBCADQiCIfCEEIANC/////w+DIAsgDH58IQMgBCADQiCIfCEEIANC/////w+DIA0gCn58IQMgBCADQiCIfCEEIANC/////w+DIA8gCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AhgiESAGfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyAEQv////8PgyAFIAE1AhwiFH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgEn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgEH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgDn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gDH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gCn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiEyAGfnwhBCADIARCIIh8IQMgAiAEPgIcIANCIIghBCADQv////8PgyAFIAE1AiAiFn58IQMgBCADQiCIfCEEIANC/////w+DIAcgFH58IQMgBCADQiCIfCEEIANC/////w+DIAkgEn58IQMgBCADQiCIfCEEIANC/////w+DIAsgEH58IQMgBCADQiCIfCEEIANC/////w+DIA0gDn58IQMgBCADQiCIfCEEIANC/////w+DIA8gDH58IQMgBCADQiCIfCEEIANC/////w+DIBEgCn58IQMgBCADQiCIfCEEIANC/////w+DIBMgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AiAiFSAGfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAFIAE1AiQiGH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgFn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgEn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gDn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgCn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AiQiFyAGfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyAFIAE1AigiGn58IQMgBCADQiCIfCEEIANC/////w+DIAcgGH58IQMgBCADQiCIfCEEIANC/////w+DIAkgFn58IQMgBCADQiCIfCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIANC/////w+DIBUgCn58IQMgBCADQiCIfCEEIANC/////w+DIBcgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AigiGSAGfnwhAyAEIANCIIh8IQQgAiADPgIoIARCIIghAyAEQv////8PgyAFIAE1AiwiHH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgGn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgGH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgFn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gFH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gEn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgDn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgDH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgCn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AiwiGyAGfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAHIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIAh+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIAkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgGn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gGH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gFn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgDn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgDH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgCn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgCyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAafnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAMfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyAEQv////8PgyANIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIA5+fCEEIAMgBEIgiHwhAyACIAQ+AjwgA0IgiCEEIANC/////w+DIA8gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGn58IQMgBCADQiCIfCEEIANC/////w+DIBMgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFn58IQMgBCADQiCIfCEEIANC/////w+DIBcgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEn58IQMgBCADQiCIfCEEIANC/////w+DIBsgEH58IQMgBCADQiCIfCEEIAIgAz4CQCAEQiCIIQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAafnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgGyASfnwhBCADIARCIIh8IQMgAiAEPgJEIANCIIghBCADQv////8PgyATIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIBR+fCEDIAQgA0IgiHwhBCACIAM+AkggBEIgiCEDIARC/////w+DIBUgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgGn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgFn58IQQgAyAEQiCIfCEDIAIgBD4CTCADQiCIIQQgA0L/////D4MgFyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAafnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAYfnwhAyAEIANCIIh8IQQgAiADPgJQIARCIIghAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIBp+fCEEIAMgBEIgiHwhAyACIAQ+AlQgA0IgiCEEIANC/////w+DIBsgHH58IQMgBCADQiCIfCEEIAIgAz4CWCAEQiCIIQMgAiAEPgJcC84gEAF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIgIg5+fCECIAMgAkIgiHwhAyACQv////8PgyAHIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIgIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AiQiD358IQIgAyACQiCIfCEDIAJC/////w+DIAcgDn58IQIgAyACQiCIfCEDIAJC/////w+DIAggDX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAogC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCKCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIsIhF+fCECIAMgAkIgiHwhAyACQv////8PgyAHIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAIIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8PgyALIAx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIsIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAIIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAJIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA5+fCECIAMgAkIgiHwhAyACQv////8PgyALIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAMIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIwIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAIIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAJIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA9+fCECIAMgAkIgiHwhAyACQv////8PgyALIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAMIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgI0IAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8PgyALIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgI4IAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKIBF+fCECIAMgAkIgiHwhAyACQv////8PgyALIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAMIA9+fCECIAMgAkIgiHwhAyACQv////8PgyANIA5+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgI8IAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyALIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAMIBB+fCECIAMgAkIgiHwhAyACQv////8PgyANIA9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAOIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAOIA9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAOIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAPIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAOIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQIBF+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyARIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJYIAMhBCAEQiCIIQUgASAEPgJcCwoAIAAgACABEAgLkgIBAX4gADUAACABfiEDIAIgAz4AACAANQAEIAF+IANCIIh8IQMgAiADPgAEIAA1AAggAX4gA0IgiHwhAyACIAM+AAggADUADCABfiADQiCIfCEDIAIgAz4ADCAANQAQIAF+IANCIIh8IQMgAiADPgAQIAA1ABQgAX4gA0IgiHwhAyACIAM+ABQgADUAGCABfiADQiCIfCEDIAIgAz4AGCAANQAcIAF+IANCIIh8IQMgAiADPgAcIAA1ACAgAX4gA0IgiHwhAyACIAM+ACAgADUAJCABfiADQiCIfCEDIAIgAz4AJCAANQAoIAF+IANCIIh8IQMgAiADPgAoIAA1ACwgAX4gA0IgiHwhAyACIAM+ACwLTgIBfgF/IAAhAyADNQAAIAF8IQIgAyACPgAAIAJCIIghAgJAA0AgAlANASADQQRqIQMgAzUAACACfCECIAMgAj4AACACQiCIIQIMAAsLC6sCBwF/AX8BfwF/AX4BfgF/IAIEQCACIQUFQdgAIQULIAMEQCADIQQFQYgBIQQLIAAgBBAAIAFBKBAAIAUQAUG4ARABQS8hBkEvIQcCQANAQSggB2otAAAgB0EDRnINASAHQQFrIQcMAAsLQSggB2pBA2s1AABCAXwhCCAIQgFRBEBCAEIAgBoLAkADQAJAA0AgBCAGai0AACAGQQdGcg0BIAZBAWshBgwACwsgBCAGakEHaykAACEJIAkgCIAhCSAGIAdrQQRrIQoCQANAIAlCgICAgHCDUCAKQQBOcQ0BIAlCCIghCSAKQQFqIQoMAAsLIAlQBEAgBEEoEAVFDQJCASEJQQAhCgtBKCAJQegBEAsgBEHoASAKayAEEAcaIAUgCmogCRAMDAALCwu1AgsBfwF/AX8BfwF/AX8BfwF/AX8BfwF/QZgCIQNBmAIQAUEAIQtByAIhBSABQcgCEABB+AIhBEH4AhADQQAhDEGoAyEIIABBqAMQAEHYAyEGQYgEIQdBmAUhCgJAA0AgCBACDQEgBSAIIAYgBxANIAYgBEG4BBAIIAsEQCAMBEBBuAQgAxAFBEBBuAQgAyAKEAcaQQAhDQUgA0G4BCAKEAcaQQEhDQsFQbgEIAMgChAGGkEBIQ0LBSAMBEBBuAQgAyAKEAYaQQAhDQUgA0G4BBAFBEAgA0G4BCAKEAcaQQAhDQVBuAQgAyAKEAcaQQEhDQsLCyADIQkgBCEDIAohBCAJIQogDCELIA0hDCAFIQkgCCEFIAchCCAJIQcMAAsLIAsEQCABIAMgAhAHGgUgAyACEAALCwoAIABBqAYQBA8LLAAgACABIAIQBgRAIAJByAUgAhAHGgUgAkHIBRAFBEAgAkHIBSACEAcaCwsLFwAgACABIAIQBwRAIAJByAUgAhAGGgsLCwBB2AYgACABEBEL/CQDAX4BfgF+Qv3/8/8PIQJCACEDIAA1AgAgAn5C/////w+DIQQgADUCACADQiCIfEHIBTUCACAEfnwhAyAAIAM+AgAgADUCBCADQiCIfEHIBTUCBCAEfnwhAyAAIAM+AgQgADUCCCADQiCIfEHIBTUCCCAEfnwhAyAAIAM+AgggADUCDCADQiCIfEHIBTUCDCAEfnwhAyAAIAM+AgwgADUCECADQiCIfEHIBTUCECAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIBTUCFCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIBTUCGCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIBTUCHCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIBTUCICAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIBTUCJCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIBTUCKCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIBTUCLCAEfnwhAyAAIAM+AixB+AggA0IgiD4CAEIAIQMgADUCBCACfkL/////D4MhBCAANQIEIANCIIh8QcgFNQIAIAR+fCEDIAAgAz4CBCAANQIIIANCIIh8QcgFNQIEIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QcgFNQIIIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QcgFNQIMIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgFNQIQIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgFNQIUIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgFNQIYIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgFNQIcIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgFNQIgIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgFNQIkIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgFNQIoIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgFNQIsIAR+fCEDIAAgAz4CMEH4CCADQiCIPgIEQgAhAyAANQIIIAJ+Qv////8PgyEEIAA1AgggA0IgiHxByAU1AgAgBH58IQMgACADPgIIIAA1AgwgA0IgiHxByAU1AgQgBH58IQMgACADPgIMIAA1AhAgA0IgiHxByAU1AgggBH58IQMgACADPgIQIAA1AhQgA0IgiHxByAU1AgwgBH58IQMgACADPgIUIAA1AhggA0IgiHxByAU1AhAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByAU1AhQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxByAU1AhggBH58IQMgACADPgIgIAA1AiQgA0IgiHxByAU1AhwgBH58IQMgACADPgIkIAA1AiggA0IgiHxByAU1AiAgBH58IQMgACADPgIoIAA1AiwgA0IgiHxByAU1AiQgBH58IQMgACADPgIsIAA1AjAgA0IgiHxByAU1AiggBH58IQMgACADPgIwIAA1AjQgA0IgiHxByAU1AiwgBH58IQMgACADPgI0QfgIIANCIIg+AghCACEDIAA1AgwgAn5C/////w+DIQQgADUCDCADQiCIfEHIBTUCACAEfnwhAyAAIAM+AgwgADUCECADQiCIfEHIBTUCBCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIBTUCCCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIBTUCDCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIBTUCECAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIBTUCFCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIBTUCGCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIBTUCHCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIBTUCICAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEHIBTUCJCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEHIBTUCKCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEHIBTUCLCAEfnwhAyAAIAM+AjhB+AggA0IgiD4CDEIAIQMgADUCECACfkL/////D4MhBCAANQIQIANCIIh8QcgFNQIAIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgFNQIEIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgFNQIIIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgFNQIMIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgFNQIQIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgFNQIUIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgFNQIYIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgFNQIcIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgFNQIgIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QcgFNQIkIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QcgFNQIoIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QcgFNQIsIAR+fCEDIAAgAz4CPEH4CCADQiCIPgIQQgAhAyAANQIUIAJ+Qv////8PgyEEIAA1AhQgA0IgiHxByAU1AgAgBH58IQMgACADPgIUIAA1AhggA0IgiHxByAU1AgQgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByAU1AgggBH58IQMgACADPgIcIAA1AiAgA0IgiHxByAU1AgwgBH58IQMgACADPgIgIAA1AiQgA0IgiHxByAU1AhAgBH58IQMgACADPgIkIAA1AiggA0IgiHxByAU1AhQgBH58IQMgACADPgIoIAA1AiwgA0IgiHxByAU1AhggBH58IQMgACADPgIsIAA1AjAgA0IgiHxByAU1AhwgBH58IQMgACADPgIwIAA1AjQgA0IgiHxByAU1AiAgBH58IQMgACADPgI0IAA1AjggA0IgiHxByAU1AiQgBH58IQMgACADPgI4IAA1AjwgA0IgiHxByAU1AiggBH58IQMgACADPgI8IAA1AkAgA0IgiHxByAU1AiwgBH58IQMgACADPgJAQfgIIANCIIg+AhRCACEDIAA1AhggAn5C/////w+DIQQgADUCGCADQiCIfEHIBTUCACAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIBTUCBCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIBTUCCCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIBTUCDCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIBTUCECAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIBTUCFCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEHIBTUCGCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEHIBTUCHCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEHIBTUCICAEfnwhAyAAIAM+AjggADUCPCADQiCIfEHIBTUCJCAEfnwhAyAAIAM+AjwgADUCQCADQiCIfEHIBTUCKCAEfnwhAyAAIAM+AkAgADUCRCADQiCIfEHIBTUCLCAEfnwhAyAAIAM+AkRB+AggA0IgiD4CGEIAIQMgADUCHCACfkL/////D4MhBCAANQIcIANCIIh8QcgFNQIAIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgFNQIEIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgFNQIIIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgFNQIMIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgFNQIQIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgFNQIUIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QcgFNQIYIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QcgFNQIcIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QcgFNQIgIAR+fCEDIAAgAz4CPCAANQJAIANCIIh8QcgFNQIkIAR+fCEDIAAgAz4CQCAANQJEIANCIIh8QcgFNQIoIAR+fCEDIAAgAz4CRCAANQJIIANCIIh8QcgFNQIsIAR+fCEDIAAgAz4CSEH4CCADQiCIPgIcQgAhAyAANQIgIAJ+Qv////8PgyEEIAA1AiAgA0IgiHxByAU1AgAgBH58IQMgACADPgIgIAA1AiQgA0IgiHxByAU1AgQgBH58IQMgACADPgIkIAA1AiggA0IgiHxByAU1AgggBH58IQMgACADPgIoIAA1AiwgA0IgiHxByAU1AgwgBH58IQMgACADPgIsIAA1AjAgA0IgiHxByAU1AhAgBH58IQMgACADPgIwIAA1AjQgA0IgiHxByAU1AhQgBH58IQMgACADPgI0IAA1AjggA0IgiHxByAU1AhggBH58IQMgACADPgI4IAA1AjwgA0IgiHxByAU1AhwgBH58IQMgACADPgI8IAA1AkAgA0IgiHxByAU1AiAgBH58IQMgACADPgJAIAA1AkQgA0IgiHxByAU1AiQgBH58IQMgACADPgJEIAA1AkggA0IgiHxByAU1AiggBH58IQMgACADPgJIIAA1AkwgA0IgiHxByAU1AiwgBH58IQMgACADPgJMQfgIIANCIIg+AiBCACEDIAA1AiQgAn5C/////w+DIQQgADUCJCADQiCIfEHIBTUCACAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIBTUCBCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIBTUCCCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEHIBTUCDCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEHIBTUCECAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEHIBTUCFCAEfnwhAyAAIAM+AjggADUCPCADQiCIfEHIBTUCGCAEfnwhAyAAIAM+AjwgADUCQCADQiCIfEHIBTUCHCAEfnwhAyAAIAM+AkAgADUCRCADQiCIfEHIBTUCICAEfnwhAyAAIAM+AkQgADUCSCADQiCIfEHIBTUCJCAEfnwhAyAAIAM+AkggADUCTCADQiCIfEHIBTUCKCAEfnwhAyAAIAM+AkwgADUCUCADQiCIfEHIBTUCLCAEfnwhAyAAIAM+AlBB+AggA0IgiD4CJEIAIQMgADUCKCACfkL/////D4MhBCAANQIoIANCIIh8QcgFNQIAIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgFNQIEIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgFNQIIIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QcgFNQIMIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QcgFNQIQIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QcgFNQIUIAR+fCEDIAAgAz4CPCAANQJAIANCIIh8QcgFNQIYIAR+fCEDIAAgAz4CQCAANQJEIANCIIh8QcgFNQIcIAR+fCEDIAAgAz4CRCAANQJIIANCIIh8QcgFNQIgIAR+fCEDIAAgAz4CSCAANQJMIANCIIh8QcgFNQIkIAR+fCEDIAAgAz4CTCAANQJQIANCIIh8QcgFNQIoIAR+fCEDIAAgAz4CUCAANQJUIANCIIh8QcgFNQIsIAR+fCEDIAAgAz4CVEH4CCADQiCIPgIoQgAhAyAANQIsIAJ+Qv////8PgyEEIAA1AiwgA0IgiHxByAU1AgAgBH58IQMgACADPgIsIAA1AjAgA0IgiHxByAU1AgQgBH58IQMgACADPgIwIAA1AjQgA0IgiHxByAU1AgggBH58IQMgACADPgI0IAA1AjggA0IgiHxByAU1AgwgBH58IQMgACADPgI4IAA1AjwgA0IgiHxByAU1AhAgBH58IQMgACADPgI8IAA1AkAgA0IgiHxByAU1AhQgBH58IQMgACADPgJAIAA1AkQgA0IgiHxByAU1AhggBH58IQMgACADPgJEIAA1AkggA0IgiHxByAU1AhwgBH58IQMgACADPgJIIAA1AkwgA0IgiHxByAU1AiAgBH58IQMgACADPgJMIAA1AlAgA0IgiHxByAU1AiQgBH58IQMgACADPgJQIAA1AlQgA0IgiHxByAU1AiggBH58IQMgACADPgJUIAA1AlggA0IgiHxByAU1AiwgBH58IQMgACADPgJYQfgIIANCIIg+AixB+AggAEEwaiABEBALpkMzAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv3/8/8PIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AsgFIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCzAUiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLQBSIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtQFIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC2AUiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLcBSIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AuAFIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC5AUiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCICInfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgEiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCICImIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLoBSIpIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhKCADQv////8PgyAJICh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIkIit+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIkIiogB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gKH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIARC/////w+DICkgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AuwFIi0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEsIARC/////w+DIAkgLH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AigiL358IQMgBCADQiCIfCEEIANC/////w+DIAogK358IQMgBCADQiCIfCEEIANC/////w+DIA4gJ358IQMgBCADQiCIfCEEIANC/////w+DIBIgI358IQMgBCADQiCIfCEEIANC/////w+DIBYgH358IQMgBCADQiCIfCEEIANC/////w+DIBogG358IQMgBCADQiCIfCEEIANC/////w+DIB4gF358IQMgBCADQiCIfCEEIANC/////w+DICIgE358IQMgBCADQiCIfCEEIANC/////w+DICYgD358IQMgBCADQiCIfCEEIANC/////w+DICogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AigiLiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAofnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC8AUiMSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DITAgA0L/////D4MgCSAwfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCLCIzfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgDiArfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgFiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAffnwhBCADIARCIIh8IQMgBEL/////D4MgHiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgJiATfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgLiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCLCIyIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQL0BSI1IAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhNCAEQv////8PgyAJIDR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgCiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgMiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgESAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAMfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAOIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1IBB+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIBIgM358IQMgBCADQiCIfCEEIANC/////w+DIBYgL358IQMgBCADQiCIfCEEIANC/////w+DIBogK358IQMgBCADQiCIfCEEIANC/////w+DIB4gJ358IQMgBCADQiCIfCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICYgH358IQMgBCADQiCIfCEEIANC/////w+DICogG358IQMgBCADQiCIfCEEIANC/////w+DIC4gF358IQMgBCADQiCIfCEEIANC/////w+DIDIgE358IQMgBCADQiCIfCEEIANC/////w+DIBUgNH58IQMgBCADQiCIfCEEIANC/////w+DIBkgMH58IQMgBCADQiCIfCEEIANC/////w+DIB0gLH58IQMgBCADQiCIfCEEIANC/////w+DICEgKH58IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIANC/////w+DICkgIH58IQMgBCADQiCIfCEEIANC/////w+DIC0gHH58IQMgBCADQiCIfCEEIANC/////w+DIDEgGH58IQMgBCADQiCIfCEEIANC/////w+DIDUgFH58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgFiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgHiArfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgJiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAffnwhBCADIARCIIh8IQMgBEL/////D4MgLiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgGSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgHSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgISAsfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAofnwhBCADIARCIIh8IQMgBEL/////D4MgKSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAYfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAaIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAmICd+fCEDIAQgA0IgiHwhBCADQv////8PgyAqICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAyIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICx+fCEDIAQgA0IgiHwhBCADQv////8PgyApICh+fCEDIAQgA0IgiHwhBCADQv////8PgyAtICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAxICB+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IBx+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIB4gM358IQQgAyAEQiCIfCEDIARC/////w+DICIgL358IQQgAyAEQiCIfCEDIARC/////w+DICYgK358IQQgAyAEQiCIfCEDIARC/////w+DICogJ358IQQgAyAEQiCIfCEDIARC/////w+DIC4gI358IQQgAyAEQiCIfCEDIARC/////w+DIDIgH358IQQgAyAEQiCIfCEDIARC/////w+DICEgNH58IQQgAyAEQiCIfCEDIARC/////w+DICUgMH58IQQgAyAEQiCIfCEDIARC/////w+DICkgLH58IQQgAyAEQiCIfCEDIARC/////w+DIC0gKH58IQQgAyAEQiCIfCEDIARC/////w+DIDEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgIH58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgIiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgMiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAkfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyAEQv////8PgyAmIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1ICh+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DICogM358IQMgBCADQiCIfCEEIANC/////w+DIC4gL358IQMgBCADQiCIfCEEIANC/////w+DIDIgK358IQMgBCADQiCIfCEEIANC/////w+DIC0gNH58IQMgBCADQiCIfCEEIANC/////w+DIDEgMH58IQMgBCADQiCIfCEEIANC/////w+DIDUgLH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgLiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgMSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgNSAwfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyAyIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IDR+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIAIgBD4CLCADpwRAIAJByAUgAhAHGgUgAkHIBRAFBEAgAkHIBSACEAcaCwsLzUEpAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL9//P/DyEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQLIBSIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUCzAUiDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtAFIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLUBSISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC2AUiFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtwFIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLgBSIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC5AUiHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCICIffnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AugFIiEgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEgIAJC/////w+DIAkgIH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiQiIn58IQIgAyACQiCIfCEDIAJC/////w+DIAogH358IQIgAyACQiCIfCEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMICB+fCECIAMgAkIgiHwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAhIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLsBSIkIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhIyACQv////8PgyAJICN+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIoIiV+fCECIAMgAkIgiHwhAyACQv////8PgyAKICJ+fCECIAMgAkIgiHwhAyACQv////8PgyANIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBx+fCECIAMgAkIgiHwhAyACQv////8PgyATIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAWIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC8AUiJyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DISYgAkL/////D4MgCSAmfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCLCIofnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAifnwhAiADIAJCIIh8IQMgAkL/////D4MgECAffnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgJn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gI358IQIgAyACQiCIfCEDIAJC/////w+DIBIgIH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAJC/////w+DICEgEX58IQIgAyACQiCIfCEDIAJC/////w+DICQgDn58IQIgAyACQiCIfCEDIAJC/////w+DICcgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AvQFIiogCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEpIAJC/////w+DIAkgKX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKICh+fCECIAMgAkIgiHwhAyACQv////8PgyANICV+fCECIAMgAkIgiHwhAyACQv////8PgyAQICJ+fCECIAMgAkIgiHwhAyACQv////8PgyATIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAWIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAZIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiALfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANICh+fCECIAMgAkIgiHwhAyACQv////8PgyAQICV+fCECIAMgAkIgiHwhAyACQv////8PgyATICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAWIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAZIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgISAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAOfnwhAiADIAJCIIh8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQICh+fCECIAMgAkIgiHwhAyACQv////8PgyATICV+fCECIAMgAkIgiHwhAyACQv////8PgyAWICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAZIB9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAcIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgEiApfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAafnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiARfnwhAiADIAJCIIh8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyATICh+fCECIAMgAkIgiHwhAyACQv////8PgyAWICV+fCECIAMgAkIgiHwhAyACQv////8PgyAZICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAcIB9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgFSApfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAUfnwhAiADIAJCIIh8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAWICh+fCECIAMgAkIgiHwhAyACQv////8PgyAZICV+fCECIAMgAkIgiHwhAyACQv////8PgyAcICJ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAfIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAXfnwhAiADIAJCIIh8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAZICh+fCECIAMgAkIgiHwhAyACQv////8PgyAcICV+fCECIAMgAkIgiHwhAyACQv////8PgyAfICJ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAafnwhAiADIAJCIIh8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAcICh+fCECIAMgAkIgiHwhAyACQv////8PgyAfICV+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAiICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgHiApfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAdfnwhAiADIAJCIIh8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAfICh+fCECIAMgAkIgiHwhAyACQv////8PgyAiICV+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgISApfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAgfnwhAiADIAJCIIh8IQMgASACPgIcIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAiICh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAlICV+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgJCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAjfnwhAiADIAJCIIh8IQMgASACPgIgIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAlICh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgJyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAmfnwhAiADIAJCIIh8IQMgASACPgIkIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAoICh+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgKiApfnwhAiADIAJCIIh8IQMgASACPgIoIAMhBCAEQiCIIQUgASAEPgIsIAWnBEAgAUHIBSABEAcaBSABQcgFEAUEQCABQcgFIAEQBxoLCwsKACAAIAAgARAUCwsAIABB+AUgARAUCxUAIABB+BEQAEGoEhABQfgRIAEQEwsRACAAQdgSEBhB2BJBuAcQBQskACAAEAIEQEEADwsgAEGIExAYQYgTQbgHEAUEQEF/DwtBAQ8LFwAgACABEBggAUHIBSABEA4gASABEBcLCQBBqAYgABAAC8sBBAF/AX8BfwF/IAIQAUEwIQUgACEDAkADQCAFIAFLDQEgBUEwRgRAQbgTEBwFQbgTQfgFQbgTEBQLIANBuBNB6BMQFCACQegTIAIQECADQTBqIQMgBUEwaiEFDAALCyABQTBwIQQgBEUEQA8LQegTEAFBACEGAkADQCAGIARGDQEgBiADLQAAOgDoEyADQQFqIQMgBkEBaiEGDAALCyAFQTBGBEBBuBMQHAVBuBNB+AVBuBMQFAtB6BNBuBNB6BMQFCACQegTIAIQEAscACABIAJBmBQQHUGYFEGYFBAXIABBmBQgAxAUC/gBBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakEwbGo2AgAgBRAcIAAhBiAFQTBqIQVBACEIAkADQCAIIAJGDQEgBhACBEAgBUEwayAFEAAFIAYgBUEwayAF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IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCADQiCHpwuPEBIBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4gA0L/////D4MgADUCACIFIAE1AgAiBn58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgBSABNQIEIgh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgcgBn58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgBSABNQIIIgp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIgkgBn58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgBSABNQIMIgx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIgsgBn58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgBSABNQIQIg5+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIg0gBn58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgBSABNQIUIhB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIg8gBn58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgBSABNQIYIhJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIhEgBn58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgBSABNQIcIhR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIhMgBn58IQQgAyAEQiCIfCEDIAIgBD4CHCADQiCIIQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIAp+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIAIgAz4CKCAEQiCIIQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyACIAQ+AjwLjBIMAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CLCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCyANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CMCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDCANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CNCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwh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PgIUQgAhAyAANQIYIAJ+Qv////8PgyEEIAA1AhggA0IgiHxBiBs1AgAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxBiBs1AgQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxBiBs1AgggBH58IQMgACADPgIgIAA1AiQgA0IgiHxBiBs1AgwgBH58IQMgACADPgIkIAA1AiggA0IgiHxBiBs1AhAgBH58IQMgACADPgIoIAA1AiwgA0IgiHxBiBs1AhQgBH58IQMgACADPgIsIAA1AjAgA0IgiHxBiBs1AhggBH58IQMgACADPgIwIAA1AjQgA0IgiHxBiBs1AhwgBH58IQMgACADPgI0QagdIANCIIg+AhhCACEDIAA1AhwgAn5C/////w+DIQQgADUCHCADQiCIfEGIGzUCACAEfnwhAyAAIAM+AhwgADUCICADQiCIfEGIGzUCBCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEGIGzUCCCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEGIGzUCDCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEGIGzUCECAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEGIGzUCFCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEGIGzUCGCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEGIGzUCHCAEfnwhAyAAIAM+AjhBqB0gA0IgiD4CHEGoHSAAQSBqIAEQOQu+HyMBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8PIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AogbIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCjBsiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKQGyIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApQbIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCmBsiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKcGyIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AqAbIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCpBsiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gJH58IQMgBCADQiCIfCEEIANC/////w+DIBEgIH58IQMgBCADQiCIfCEEIANC/////w+DIBUgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGH58IQMgBCADQiCIfCEEIANC/////w+DIB0gFH58IQMgBCADQiCIfCEEIANC/////w+DICEgEH58IQMgBCADQiCIfCEEIANC/////w+DICUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESAkfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgISAUfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gIH58IQQgAyAEQiCIfCEDIARC/////w+DICEgHH58IQQgAyAEQiCIfCEDIARC/////w+DICUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgAiAEPgIcIAOnBEAgAkGIGyACEDAaBSACQYgbEC4EQCACQYgbIAIQMBoLCwu7IR0BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8PIQZCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgcgB358IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEIIAJC/////w+DQQA1AogbIgkgCH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgQiCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8Pg0EANQKMGyIMIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIIIg1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCkBsiDyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQ4gAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCDCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApQbIhIgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyERIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhAiE358IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIA5+fCECIAMgAkIgiHwhAyACQv////8PgyASIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKYGyIVIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFCACQv////8PgyAJIBR+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIUIhZ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBN+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCnBsiGCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRcgAkL/////D4MgCSAXfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCGCIZfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgF358IQIgAyACQiCIfCEDIAJC/////w+DIA8gFH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBggC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqAbIhsgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEaIAJC/////w+DIAkgGn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhwiHH58IQIgAyACQiCIfCEDIAJC/////w+DIAogGX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gFn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBd+fCECIAMgAkIgiHwhAyACQv////8PgyASIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAYIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAbIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKkGyIeIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhHSACQv////8PgyAJIB1+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gHX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgF358IQIgAyACQiCIfCEDIAJC/////w+DIBggFH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBsgHX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gGn58IQIgAyACQiCIfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHCAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIB4gHX58IQIgAyACQiCIfCEDIAEgAj4CGCADIQQgBEIgiCEFIAEgBD4CHCAFpwRAIAFBiBsgARAwGgUgAUGIGxAuBEAgAUGIGyABEDAaCwsLCgAgACAAIAEQPQsLACAAQagbIAEQPQsVACAAQaghEClByCEQKkGoISABEDwLEQAgAEHoIRBBQeghQagcEC4LJAAgABArBEBBAA8LIABBiCIQQUGIIkGoHBAuBEBBfw8LQQEPCxcAIAAgARBBIAFBiBsgARA3IAEgARBACwkAQcgbIAAQKQvLAQQBfwF/AX8BfyACECpBICEFIAAhAwJAA0AgBSABSw0BIAVBIEYEQEGoIhBFBUGoIkGoG0GoIhA9CyADQagiQcgiED0gAkHIIiACEDkgA0EgaiEDIAVBIGohBQwACwsgAUEgcCEEIARFBEAPC0HIIhAqQQAhBgJAA0AgBiAERg0BIAYgAy0AADoAyCIgA0EBaiEDIAZBAWohBgwACwsgBUEgRgRAQagiEEUFQagiQagbQagiED0LQcgiQagiQcgiED0gAkHIIiACEDkLHAAgASACQegiEEZB6CJB6CIQQCAAQegiIAMQPQv4AQQBfwF/AX8Bf0EAKAIAIQVBACAFIAJBAWpBIGxqNgIAIAUQRSAAIQYgBUEgaiEFQQAhCAJAA0AgCCACRg0BIAYQKwRAIAVBIGsgBRApBSAGIAVBIGsgBRA9CyAGIAFqIQYgBUEgaiEFIAhBAWohCAwACwsgBiABayEGIAVBIGshBSADIAJBAWsgBGxqIQcgBSAFEEQCQANAIAhFDQEgBhArBEAgBSAFQSBrECkgBxAqBSAFQSBrQYgjECkgBSAGIAVBIGsQPSAFQYgjIAcQPQsgBiABayEGIAcgBGshByAFQSBrIQUgCEEBayEIDAALC0EAIAU2AgALPgMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQQCAEQSBqIQQgBUEgaiEFIANBAWohAwwACwsLPgMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQQSAEQSBqIQQgBUEgaiEFIANBAWohAwwACwsLPgMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQOyAEQSBqIQQgBUEgaiEFIANBAWohAwwACwsLTQQBfwF/AX8BfyAAIQUgASEGIAMhB0EAIQQCQANAIAQgAkYNASAFIAYgBxA5IAVBIGohBSAGQSBqIQYgB0EgaiEHIARBAWohBAwACwsLTQQBfwF/AX8BfyAAIQUgASEGIAMhB0EAIQQCQANAIAQgAkYNASAFIAYgBxA6IAVBIGohBSAGQSBqIQYgB0EgaiEHIARBAWohBAwACwsLTQQBfwF/AX8BfyAAIQUgASEGIAMhB0EAIQQCQANAIAQgAkYNASAFIAYgBxA9IAVBIGohBSAGQSBqIQYgB0EgaiEHIARBAWohBAwACwsLsgICAX8BfyACRQRAIAMQRQ8LIABBqCMQKSADEEUgAiEEAkADQCAEQQFrIQQgASAEai0AACEFIAMgAxA+IAVBgAFPBEAgBUGAAWshBSADQagjIAMQPQsgAyADED4gBUHAAE8EQCAFQcAAayEFIANBqCMgAxA9CyADIAMQPiAFQSBPBEAgBUEgayEFIANBqCMgAxA9CyADIAMQPiAFQRBPBEAgBUEQayEFIANBqCMgAxA9CyADIAMQPiAFQQhPBEAgBUEIayEFIANBqCMgAxA9CyADIAMQPiAFQQRPBEAgBUEEayEFIANBqCMgAxA9CyADIAMQPiAFQQJPBEAgBUECayEFIANBqCMgAxA9CyADIAMQPiAFQQFPBEAgBUEBayEFIANBqCMgAxA9CyAERQ0BDAALCwveAQMBfwF/AX8gABArBEAgARAqDwtBICECQegcQcgjECkgAEHIHEEgQegjEE8gAEGIHUEgQYgkEE8CQANAQegjQcgbEC0NAUHoI0GoJBA+QQEhAwJAA0BBqCRByBsQLQ0BQagkQagkED4gA0EBaiEDDAALC0HII0HIJBApIAIgA2tBAWshBAJAA0AgBEUNAUHIJEHIJBA+IARBAWshBAwACwsgAyECQcgkQcgjED5B6CNByCNB6CMQPUGIJEHIJEGIJBA9DAALC0GIJBBCBEBBiCQgARA7BUGIJCABECkLCyAAIAAQKwRAQQEPCyAAQYgcQSBB6CQQT0HoJEHIGxAtCxUAIAAgAUGIJRA9QYglQagbIAIQPQsKACAAIAAgARBSCwsAIABBiBsgARA3CwkAIABBqBwQLgsOACAAEAIgAEEwahACcQsKACAAQeAAahACCw0AIAAQASAAQTBqEAELFQAgABABIABBMGoQHCAAQeAAahABC3oAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYC7oBACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAA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NwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBIAEgACkDkAE3A5ABIAEgACkDmAE3A5gBIAEgACkDoAE3A6ABIAEgACkDqAE3A6gBIAEgACkDsAE3A7ABIAEgACkDuAE3A7gBC5IDACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAEgASAAKQPAATcDwAEgASAAKQPIATcDyAEgASAAKQPQATcD0AEgASAAKQPYATcD2AEgASAAKQPgATcD4AEgASAAKQPoATcD6AEgASAAKQPwATcD8AEgASAAKQP4ATcD+AEgASAAKQOAAjcDgAIgASAAKQOIAjcDiAIgASAAKQOQAjcDkAIgASAAKQOYAjcDmAILLwAgABCwAQRAIAEQswEFIAFBwAFqEJwBIABB4ABqIAFB4ABqEJ0BIAAgARCdAQsLHAEBfyAAIAEQpwEgAEHgAGogAUHgAGoQpwFxDwuLAQEBfyAAQcABaiECIAAQsQEEQCABELABDwsgARCwAQRAQQAPCyACEJoBBEAgACABELcBDwsgAkG4hQEQoAEgAUG4hQFBmIYBEJ4BIAJBuIUBQfiGARCeASABQeAAakH4hgFB2IcBEJ4BIABBmIYBEKcBBEAgAEHgAGpB2IcBEKcBBEBBAQ8LC0EADwvZAQIBfwF/IABBwAFqIQIgAUHAAWohAyAAELEBBEAgARCxAQ8LIAEQsQEEQEEADwsgAhCaAQRAIAEgABC4AQ8LIAMQmgEEQCAAIAEQuAEPCyACQbiIARCgASADQZiJARCgASAAQZiJAUH4iQEQngEgAUG4iAFB2IoBEJ4BIAJBuIgBQbiLARCeASADQZiJAUGYjAEQngEgAEHgAGpBmIwBQfiMARCeASABQeAAakG4iwFB2I0BEJ4BQfiJAUHYigEQpwEEQEH4jAFB2I0BEKcBBEBBAQ8LC0EADwusAgAgABCwAQRAIAAgARC2AQ8LIABBuI4BEKABIABB4ABqQZiPARCgAUGYjwFB+I8BEKABIABBmI8BQdiQARChAUHYkAFB2JABEKABQdiQAUG4jgFB2JABEKIBQdiQAUH4jwFB2JABEKIBQdiQAUHYkAFB2JABEKEBQbiOAUG4jgFBuJEBEKEBQbiRAUG4jgFBuJEBEKEBIABB4ABqIABB4ABqIAFBwAFqEKEBQbiRASABEKABIAFB2JABIAEQogEgAUHYkAEgARCiAUH4jwFB+I8BQZiSARChAUGYkgFBmJIBQZiSARChAUGYkgFBmJIBQZiSARChAUHYkAEgASABQeAAahCiASABQeAAakG4kQEgAUHgAGoQngEgAUHgAGpBmJIBIAFB4ABqEKIBC9QCACAAELEBBEAgACABELUBDwsgAEHAAWoQmgEEQCAAIAEQugEPDwsgAEH4kgEQoAEgAEHgAGpB2JMBEKABQdiTAUG4lAEQoAEgAEHYkwFBmJUBEKEBQZiVAUGYlQEQoAFBmJUBQfiSAUGYlQEQogFBmJUBQbiUAUGYlQEQogFBmJUBQZiVAUGYlQEQoQFB+JIBQfiSAUH4lQEQoQFB+JUBQfiSAUH4lQEQoQFB+JUBQdiWARCgASAAQeAAaiAAQcABakG4lwEQngFBmJUBQZiVASABEKEBQdiWASABIAEQogFBuJQBQbiUAUGYmAEQoQFBmJgBQZiYAUGYmAEQoQFBmJgBQZiYAUGYmAEQoQFBmJUBIAEgAUHgAGoQogEgAUHgAGpB+JUBIAFB4ABqEJ4BIAFB4ABqQZiYASABQeAAahCiAUG4lwFBuJcBIAFBwAFqEKEBC+wCAQF/IABBwAFqIQMgABCwAQRAIAEgAhC0ASACQcABahCcAQ8LIAEQsAEEQCAAIAIQtAEgAkHAAWoQnAEPCyAAIAEQpwEEQCAAQeAAaiABQeAAahCnAQRAIAEgAhC6AQ8LCyABIABB+JgBEKIBIAFB4ABqIABB4ABqQbiaARCiAUH4mAFB2JkBEKABQdiZAUHYmQFBmJsBEKEBQZibAUGYmwFBmJsBEKEBQfiYAUGYmwFB+JsBEJ4BQbiaAUG4mgFB2JwBEKEBIABBmJsBQZieARCeAUHYnAFBuJ0BEKABQZieAUGYngFB+J4BEKEBQbidAUH4mwEgAhCiASACQfieASACEKIBIABB4ABqQfibAUHYnwEQngFB2J8BQdifAUHYnwEQoQFBmJ4BIAIgAkHgAGoQogEgAkHgAGpB2JwBIAJB4ABqEJ4BIAJB4ABqQdifASACQeAAahCiAUH4mAFB+JgBIAJBwAFqEKEBC9wDAQF/IABBwAFqIQMgABCxAQRAIAEgAhC0ASACQcABahCcAQ8LIAEQsAEEQCAAIAIQtQEPCyADEJoBBEAgACABIAIQvAEPCyADQbigARCgASABQbigAUGYoQEQngEgA0G4oAFB+KEBEJ4BIAFB4ABqQfihAUHYogEQngEgAEGYoQEQpwEEQCAAQeAAakHYogEQpwEEQCABIAIQugEPCwtBmKEBIABBuKMBEKIBQdiiASAAQeAAakH4pAEQogFBuKMBQZikARCgAUGYpAFBmKQBQdilARChAUHYpQFB2KUBQdilARChAUG4owFB2KUBQbimARCeAUH4pAFB+KQBQZinARChASAAQdilAUHYqAEQngFBmKcBQfinARCgAUHYqAFB2KgBQbipARChAUH4pwFBuKYBIAIQogEgAkG4qQEgAhCiASAAQeAAakG4pgFBmKoBEJ4BQZiqAUGYqgFBmKoBEKEBQdioASACIAJB4ABqEKIBIAJB4ABqQZinASACQeAAahCeASACQeAAakGYqgEgAkHgAGoQogEgA0G4owEgAkHAAWoQoQEgAkHAAWogAkHAAWoQoAEgAkHAAWpBuKABIAJBwAFqEKIBIAJBwAFqQZikASACQcABahCiAQulBAIBfwF/IABBwAFqIQMgAUHAAWohBCAAELEBBEAgASACELUBDwsgARCxAQRAIAAgAhC1AQ8LIAMQmgEEQCABIAAgAhC9AQ8LIAQQmgEEQCAAIAEgAhC9AQ8LIANB+KoBEKABIARB2KsBEKABIABB2KsBQbisARCeASABQfiqAUGYrQEQngEgA0H4qgFB+K0BEJ4BIARB2KsBQdiuARCeASAAQeAAakHYrgFBuK8BEJ4BIAFB4ABqQfitAUGYsAEQngFBuKwBQZitARCnAQRAQbivAUGYsAEQpwEEQCAAIAIQuwEPCwtBmK0BQbisAUH4sAEQogFBmLABQbivAUHYsQEQogFB+LABQfiwAUG4sgEQoQFBuLIBQbiyARCgAUH4sAFBuLIBQZizARCeAUHYsQFB2LEBQfizARChAUG4rAFBuLIBQbi1ARCeAUH4swFB2LQBEKABQbi1AUG4tQFBmLYBEKEBQdi0AUGYswEgAhCiASACQZi2ASACEKIBQbivAUGYswFB+LYBEJ4BQfi2AUH4tgFB+LYBEKEBQbi1ASACIAJB4ABqEKIBIAJB4ABqQfizASACQeAAahCeASACQeAAakH4tgEgAkHgAGoQogEgAyAEIAJBwAFqEKEBIAJBwAFqIAJBwAFqEKABIAJBwAFqQfiqASACQcABahCiASACQcABakHYqwEgAkHAAWoQogEgAkHAAWpB+LABIAJBwAFqEJ4BCxgAIAAgARCdASAAQeAAaiABQeAAahCjAQsnACAAIAEQnQEgAEHgAGogAUHgAGoQowEgAEHAAWogAUHAAWoQnQELFgAgAUHYtwEQvwEgAEHYtwEgAhC8AQsWACABQfi5ARC/ASAAQfi5ASACEL0BCxYAIAFBmLwBEMABIABBmLwBIAIQvgELGAAgACABEKYBIABB4ABqIAFB4ABqEKYBCycAIAAgARCmASAAQeAAaiABQeAAahCmASAAQcABaiABQcABahCmAQsYACAAIAEQpQEgAEHgAGogAUHgAGoQpQELJwAgACABEKUBIABB4ABqIAFB4ABqEKUBIABBwAFqIAFBwAFqEKUBC14AIAAQsQEEQCABEJsBIAFB4ABqEJsBBSAAQcABakG4vgEQqAFBuL4BQZi/ARCgAUG4vgFBmL8BQfi/ARCeASAAQZi/ASABEJ4BIABB4ABqQfi/ASABQeAAahCeAQsLQAAgAEHgAGpB2MABEKABIABBuMEBEKABIABBuMEBQbjBARCeAUG4wQFB2IQBQbjBARChAUHYwAFBuMEBEKcBDwsTACAAQZjCARDIAUGYwgEQyQEPC74BBQF/AX8BfwF/AX9BACgCACEDQQAgAyABQeAAbGo2AgAgAEHAAWpBoAIgASADQeAAEKwBIAAhBCADIQUgAiEGQQAhBwJAA0AgByABRg0BIAUQmQEEQCAGEJsBIAZB4ABqEJsBBSAFIARB4ABqQdjDARCeASAFIAUQoAEgBSAEIAYQngEgBUHYwwEgBkHgAGoQngELIARBoAJqIQQgBkHAAWohBiAFQeAAaiEFIAdBAWohBwwACwtBACADNgIAC14AIAAQsQEEQCABELMBBSAAQcABakG4xAEQqAFBuMQBQZjFARCgAUG4xAFBmMUBQfjFARCeASAAQZjFASABEJ4BIABB4ABqQfjFASABQeAAahCeASABQcABahCcAQsLOwIBfwF/IAIgAWpBAWshAyAAIQQCQANAIAMgAkgNASADIAQtAAA6AAAgA0EBayEDIARBAWohBAwACwsLNQAgABCwAQRAIAEQsgEPCyAAQdjGARDEAUHYxgFB4AAgARDNAUG4xwFB4AAgAUHgAGoQzQELSgAgABCwAQRAIAEQmwEgAUHAADoAAA8LIABBmMgBEKYBQZjIAUHgACABEM0BIABB4ABqEKoBQX9GBEAgASABLQAAQYABcjoAAAsLOQAgAC0AAEHAAHEEQCABELIBDwsgAEHgAEH4yAEQzQEgAEHgAGpB4ABB2MkBEM0BQfjIASABEMYBC9kBAgF/AX8gAC0AACECIAJBwABxBEAgARCyAQ8LIAJBgAFxIQMgAEGYywEQnQFBmMsBIAJBP3E6AABBmMsBQeAAQbjKARDNAUG4ygEgARClASABQZjLARCgASABQZjLAUGYywEQngFBmMsBQdiEAUGYywEQoQFBmMsBQZjLARCuAUGYywFBuMoBEKMBQZjLARCqAUF/RgRAIAMEQEGYywEgAUHgAGoQnQEFQZjLASABQeAAahCjAQsFIAMEQEGYywEgAUHgAGoQowEFQZjLASABQeAAahCdAQsLC0EDAX8BfwF/IAAhBCACIQVBACEDAkADQCADIAFGDQEgBCAFEM4BIARBwAFqIQQgBUHAAWohBSADQQFqIQMMAAsLC0EDAX8BfwF/IAAhBCACIQVBACEDAkADQCADIAFGDQEgBCAFEM8BIARBwAFqIQQgBUHgAGohBSADQQFqIQMMAAsLC0EDAX8BfwF/IAAhBCACIQVBACEDAkADQCADIAFGDQEgBCAFENABIARBwAFqIQQgBUHAAWohBSADQQFqIQMMAAsLC1UDAX8BfwF/IAAgAUEBa0HgAGxqIQQgAiABQQFrQcABbGohBUEAIQMCQANAIAMgAUYNASAEIAUQ0QEgBEHgAGshBCAFQcABayEFIANBAWohAwwACwsLVQMBfwF/AX8gACABQQFrQcABbGohBCACIAFBAWtBoAJsaiEFQQAhAwJAA0AgAyABRg0BIAQgBRC2ASAEQcABayEEIAVBoAJrIQUgA0EBaiEDDAALCwtBAgF/AX8gAUEIbCACayEEIAMgBEoEQEEBIAR0QQFrIQUFQQEgA3RBAWshBQsgACACQQN2aigAACACQQdxdiAFcQuaAQQBfwF/AX8BfyABQQFGBEAPC0EBIAFBAWt0IQIgACEDIAAgAkGgAmxqIQQgBEGgAmshBQJAA0AgAyAFRg0BIAMgBCADEL4BIAUgBCAFEL4BIANBoAJqIQMgBEGgAmohBAwACwsgACABQQFrENgBIAFBAWshAQJAA0AgAUUNASAFIAUQuwEgAUEBayEBDAALCyAAIAUgABC+AQvSAQoBfwF/AX8BfwF/AX8BfwF/AX8BfyADRQRAIAYQswEPC0EBIAV0IQ1BACgCACEOQQAgDiANQaACbGo2AgBBACEMAkADQCAMIA1GDQEgDiAMQaACbGoQswEgDEEBaiEMDAALCyAAIQogASEIIAEgAyACbGohCQJAA0AgCCAJRg0BIAggAiAEIAUQ1wEhDyAPBEAgDiAPQQFrQaACbGohECAQIAogEBC+AQsgCCACaiEIIApBoAJqIQoMAAsLIA4gBRDYASAOIAYQtQFBACAONgIAC6gBDAF/AX8BfwF/AX8BfwF/AX8BfwF/AX8BfyAEELMBIANFBEAPCyADZy0AmM4BIQUgAkEDdEEBayAFbkEBaiEGIAZBAWsgBWwhCgJAA0AgCkEASA0BIAQQsQFFBEBBACEMAkADQCAMIAVGDQEgBCAEELsBIAxBAWohDAwACwsLIAAgASACIAMgCiAFQfjLARDZASAEQfjLASAEEL4BIAogBWshCgwACwsLQQIBfwF/IAFBCGwgAmshBCADIARKBEBBASAEdEEBayEFBUEBIAN0QQFrIQULIAAgAkEDdmooAAAgAkEHcXYgBXELmgEEAX8BfwF/AX8gAUEBRgRADwtBASABQQFrdCECIAAhAyAAIAJBoAJsaiEEIARBoAJrIQUCQANAIAMgBUYNASADIAQgAxC+ASAFIAQgBRC+ASADQaACaiEDIARBoAJqIQQMAAsLIAAgAUEBaxDcASABQQFrIQECQANAIAFFDQEgBSAFELsBIAFBAWshAQwACwsgACAFIAAQvgEL0gEKAX8BfwF/AX8BfwF/AX8BfwF/AX8gA0UEQCAGELMBDwtBASAFdCENQQAoAgAhDkEAIA4gDUGgAmxqNgIAQQAhDAJAA0AgDCANRg0BIA4gDEGgAmxqELMBIAxBAWohDAwACwsgACEKIAEhCCABIAMgAmxqIQkCQANAIAggCUYNASAIIAIgBCAFENsBIQ8gDwRAIA4gD0EBa0GgAmxqIRAgECAKIBAQvQELIAggAmohCCAKQcABaiEKDAALCyAOIAUQ3AEgDiAGELUBQQAgDjYCAAuoAQwBfwF/AX8BfwF/AX8BfwF/AX8BfwF/AX8gBBCzASADRQRADwsgA2ctANjQASEFIAJBA3RBAWsgBW5BAWohBiAGQQFrIAVsIQoCQANAIApBAEgNASAEELEBRQRAQQAhDAJAA0AgDCAFRg0BIAQgBBC7ASAMQQFqIQwMAAsLCyAAIAEgAiADIAogBUG4zgEQ3QEgBEG4zgEgBBC+ASAKIAVrIQoMAAsLC7QEBwF/AX8BfwF/AX8BfwF/IAJFBEAgAxCzAQ8LIAJBA3QhBUEAKAIAIQQgBCEKQQAgBEEgaiAFakF4cTYCAEEBIQYgAUEAQQN2QXxxaigCAEEAQR9xdkEBcSEHQQAhCQJAA0AgBiAFRg0BIAEgBkEDdkF8cWooAgAgBkEfcXZBAXEhCCAHBEAgCARAIAkEQEEAIQdBASEJIApBAToAACAKQQFqIQoFQQAhB0EBIQkgCkH/AToAACAKQQFqIQoLBSAJBEBBACEHQQEhCSAKQf8BOgAAIApBAWohCgVBACEHQQAhCSAKQQE6AAAgCkEBaiEKCwsFIAgEQCAJBEBBACEHQQEhCSAKQQA6AAAgCkEBaiEKBUEBIQdBACEJIApBADoAACAKQQFqIQoLBSAJBEBBASEHQQAhCSAKQQA6AAAgCkEBaiEKBUEAIQdBACEJIApBADoAACAKQQFqIQoLCwsgBkEBaiEGDAALCyAHBEAgCQRAIApB/wE6AAAgCkEBaiEKIApBADoAACAKQQFqIQogCkEBOgAAIApBAWohCgUgCkEBOgAAIApBAWohCgsFIAkEQCAKQQA6AAAgCkEBaiEKIApBAToAACAKQQFqIQoLCyAKQQFrIQogAEH40AEQtQEgAxCzAQJAA0AgAyADELsBIAotAAAhCCAIBEAgCEEBRgRAIANB+NABIAMQvgEFIANB+NABIAMQwwELCyAEIApGDQEgCkEBayEKDAALC0EAIAQ2AgALtAQHAX8BfwF/AX8BfwF/AX8gAkUEQCADELMBDwsgAkEDdCEFQQAoAgAhBCAEIQpBACAEQSBqIAVqQXhxNgIAQQEhBiABQQBBA3ZBfHFqKAIAQQBBH3F2QQFxIQdBACEJAkADQCAGIAVGDQEgASAGQQN2QXxxaigCACAGQR9xdkEBcSEIIAcEQCAIBEAgCQRAQQAhB0EBIQkgCkEBOgAAIApBAWohCgVBACEHQQEhCSAKQf8BOgAAIApBAWohCgsFIAkEQEEAIQdBASEJIApB/wE6AAAgCkEBaiEKBUEAIQdBACEJIApBAToAACAKQQFqIQoLCwUgCARAIAkEQEEAIQdBASEJIApBADoAACAKQQFqIQoFQQEhB0EAIQkgCkEAOgAAIApBAWohCgsFIAkEQEEBIQdBACEJIApBADoAACAKQQFqIQoFQQAhB0EAIQkgCkEAOgAAIApBAWohCgsLCyAGQQFqIQYMAAsLIAcEQCAJBEAgCkH/AToAACAKQQFqIQogCkEAOgAAIApBAWohCiAKQQE6AAAgCkEBaiEKBSAKQQE6AAAgCkEBaiEKCwUgCQRAIApBADoAACAKQQFqIQogCkEBOgAAIApBAWohCgsLIApBAWshCiAAQZjTARC0ASADELMBAkADQCADIAMQuwEgCi0AACEIIAgEQCAIQQFGBEAgA0GY0wEgAxC9AQUgA0GY0wEgAxDCAQsLIAQgCkYNASAKQQFrIQoMAAsLQQAgBDYCAAsXACABQdjUARBBIABB2NQBQSAgAhCFAQtGACAAQf8BcS0A+PUBQRh0IABBCHZB/wFxLQD49QFBEHRqIABBEHZB/wFxLQD49QFBCHQgAEEYdkH/AXEtAPj1AWpqIAF3C2oFAX8BfwF/AX8Bf0EBIAF0IQJBACEDAkADQCADIAJGDQEgACADQZABbGohBSADIAEQ4gEhBCAAIARBkAFsaiEGIAMgBEkEQCAFQfj3ARBbIAYgBRBbQfj3ASAGEFsLIANBAWohAwwACwsL4wEHAX8BfwF/AX8BfwF/AX8gAkUgAxA4cQRADwtBASABdCEEIARBAWshCEEBIQcgBEEBdiEFAkADQCAHIAVPDQEgACAHQZABbGohCSAAIAQgB2tBkAFsaiEKIAIEQCADEDgEQCAJQYj5ARBbIAogCRBbQYj5ASAKEFsFIAlBiPkBEFsgCiADIAkQ4QFBiPkBIAMgChDhAQsFIAMQOARABSAJIAMgCRDhASAKIAMgChDhAQsLIAdBAWohBwwACwsgAxA4BEAFIAAgAyAAEOEBIAAgBUGQAWxqIQogCiADIAoQ4QELC+0BCQF/AX8BfwF/AX8BfwF/AX8BfyAAIAEQ4wFBASABdCEJQQEhBAJAA0AgBCABSw0BQQEgBHQhB0H41AEgBEEgbGohCkEAIQUCQANAIAUgCU8NAUGY+gEQRSAHQQF2IQhBACEGAkADQCAGIAhPDQEgACAFIAZqQZABbGohCyALIAhBkAFsaiEMIAxBmPoBQbj6ARDhASALQcj7ARBbQcj7AUG4+gEgCxBkQcj7AUG4+gEgDBBpQZj6ASAKQZj6ARA9IAZBAWohBgwACwsgBSAHaiEFDAALCyAEQQFqIQQMAAsLIAAgASACIAMQ5AELQwIBfwF/IABBAXYhAkEAIQECQANAIAJFDQEgAkEBdiECIAFBAWohAQwACwsgAEEBIAF0RwRAAAsgAUEgSwRAAAsgAQseAQF/IAEQ5gEhAkHY/AEQRSAAIAJBAEHY/AEQ5QELJAIBfwF/IAEQ5gEhAkGY3QEgAkEgbGohAyAAIAJBASADEOUBC3kDAX8BfwF/IANB+PwBEClBACEHAkADQCAHIAJGDQEgACAHQZABbGohBSABIAdBkAFsaiEGIAZB+PwBQZj9ARDhASAFQaj+ARBbQaj+AUGY/QEgBRBkQaj+AUGY/QEgBhBpQfj8ASAEQfj8ARA9IAdBAWohBwwACwsLiAEEAX8BfwF/AX9BuOUBIAVBIGxqIQkgA0G4/wEQKUEAIQgCQANAIAggAkYNASAAIAhBkAFsaiEGIAEgCEGQAWxqIQcgBiAHQdj/ARBkIAcgCSAHEOEBIAYgByAHEGQgB0G4/wEgBxDhAUHY/wEgBhBbQbj/ASAEQbj/ARA9IAhBAWohCAwACwsLpAEFAX8BfwF/AX8Bf0G45QEgBUEgbGohCUHY7QEgBUEgbGohCiADQeiAAhApQQAhCAJAA0AgCCACRg0BIAAgCEGQAWxqIQYgASAIQZABbGohByAHQeiAAkGIgQIQ4QEgBkGIgQIgBxBpIAcgCiAHEOEBIAYgCSAGEOEBQYiBAiAGIAYQaSAGIAogBhDhAUHogAIgBEHogAIQPSAIQQFqIQgMAAsLC8gBCQF/AX8BfwF/AX8BfwF/AX8Bf0EBIAJ0IQQgBEEBdiEFIAEgAnYhAyAFQZABbCEGQfjUASACQSBsaiELQQAhCQJAA0AgCSADRg0BQZiCAhBFQQAhCgJAA0AgCiAFRg0BIAAgCSAEbCAKakGQAWxqIQcgByAGaiEIIAhBmIICQbiCAhDhASAHQciDAhBbQciDAkG4ggIgBxBkQciDAkG4ggIgCBBpQZiCAiALQZiCAhA9IApBAWohCgwACwsgCUEBaiEJDAALCwuCAQQBfwF/AX8BfyABQQF2IQYgAUEBcQRAIAAgBkGQAWxqIAIgACAGQZABbGoQ4QELQQAhBQJAA0AgBSAGTw0BIAAgBUGQAWxqIQMgACABQQFrIAVrQZABbGohBCAEIAJB2IQCEOEBIAMgAiAEEOEBQdiEAiADEFsgBUEBaiEFDAALCwudAQUBfwF/AX8BfwF/QbjlASAFQSBsaiEJQdjtASAFQSBsaiEKIANB6IUCEClBACEIAkADQCAIIAJGDQEgACAIQZABbGohBiABIAhBkAFsaiEHIAYgCUGIhgIQ4QEgB0GIhgJBiIYCEGkgBiAHIAcQaUGIhgIgCiAGEOEBIAdB6IUCIAcQ4QFB6IUCIARB6IUCED0gCEEBaiEIDAALCwsXACABQZiHAhBBIABBmIcCQSAgAhDfAQtGACAAQf8BcS0AuKgCQRh0IABBCHZB/wFxLQC4qAJBEHRqIABBEHZB/wFxLQC4qAJBCHQgAEEYdkH/AXEtALioAmpqIAF3C20FAX8BfwF/AX8Bf0EBIAF0IQJBACEDAkADQCADIAJGDQEgACADQaACbGohBSADIAEQ8AEhBCAAIARBoAJsaiEGIAMgBEkEQCAFQbiqAhC1ASAGIAUQtQFBuKoCIAYQtQELIANBAWohAwwACwsL5wEHAX8BfwF/AX8BfwF/AX8gAkUgAxA4cQRADwtBASABdCEEIARBAWshCEEBIQcgBEEBdiEFAkADQCAHIAVPDQEgACAHQaACbGohCSAAIAQgB2tBoAJsaiEKIAIEQCADEDgEQCAJQdisAhC1ASAKIAkQtQFB2KwCIAoQtQEFIAlB2KwCELUBIAogAyAJEO8BQdisAiADIAoQ7wELBSADEDgEQAUgCSADIAkQ7wEgCiADIAoQ7wELCyAHQQFqIQcMAAsLIAMQOARABSAAIAMgABDvASAAIAVBoAJsaiEKIAogAyAKEO8BCwvwAQkBfwF/AX8BfwF/AX8BfwF/AX8gACABEPEBQQEgAXQhCUEBIQQCQANAIAQgAUsNAUEBIAR0IQdBuIcCIARBIGxqIQpBACEFAkADQCAFIAlPDQFB+K4CEEUgB0EBdiEIQQAhBgJAA0AgBiAITw0BIAAgBSAGakGgAmxqIQsgCyAIQaACbGohDCAMQfiuAkGYrwIQ7wEgC0G4sQIQtQFBuLECQZivAiALEL4BQbixAkGYrwIgDBDDAUH4rgIgCkH4rgIQPSAGQQFqIQYMAAsLIAUgB2ohBQwACwsgBEEBaiEEDAALCyAAIAEgAiADEPIBC0MCAX8BfyAAQQF2IQJBACEBAkADQCACRQ0BIAJBAXYhAiABQQFqIQEMAAsLIABBASABdEcEQAALIAFBIEsEQAALIAELHgEBfyABEPQBIQJB2LMCEEUgACACQQBB2LMCEPMBCyQCAX8BfyABEPQBIQJB2I8CIAJBIGxqIQMgACACQQEgAxDzAQt8AwF/AX8BfyADQfizAhApQQAhBwJAA0AgByACRg0BIAAgB0GgAmxqIQUgASAHQaACbGohBiAGQfizAkGYtAIQ7wEgBUG4tgIQtQFBuLYCQZi0AiAFEL4BQbi2AkGYtAIgBhDDAUH4swIgBEH4swIQPSAHQQFqIQcMAAsLC4sBBAF/AX8BfwF/QfiXAiAFQSBsaiEJIANB2LgCEClBACEIAkADQCAIIAJGDQEgACAIQaACbGohBiABIAhBoAJsaiEHIAYgB0H4uAIQvgEgByAJIAcQ7wEgBiAHIAcQvgEgB0HYuAIgBxDvAUH4uAIgBhC1AUHYuAIgBEHYuAIQPSAIQQFqIQgMAAsLC6YBBQF/AX8BfwF/AX9B+JcCIAVBIGxqIQlBmKACIAVBIGxqIQogA0GYuwIQKUEAIQgCQANAIAggAkYNASAAIAhBoAJsaiEGIAEgCEGgAmxqIQcgB0GYuwJBuLsCEO8BIAZBuLsCIAcQwwEgByAKIAcQ7wEgBiAJIAYQ7wFBuLsCIAYgBhDDASAGIAogBhDvAUGYuwIgBEGYuwIQPSAIQQFqIQgMAAsLC8sBCQF/AX8BfwF/AX8BfwF/AX8Bf0EBIAJ0IQQgBEEBdiEFIAEgAnYhAyAFQaACbCEGQbiHAiACQSBsaiELQQAhCQJAA0AgCSADRg0BQdi9AhBFQQAhCgJAA0AgCiAFRg0BIAAgCSAEbCAKakGgAmxqIQcgByAGaiEIIAhB2L0CQfi9AhDvASAHQZjAAhC1AUGYwAJB+L0CIAcQvgFBmMACQfi9AiAIEMMBQdi9AiALQdi9AhA9IApBAWohCgwACwsgCUEBaiEJDAALCwuDAQQBfwF/AX8BfyABQQF2IQYgAUEBcQRAIAAgBkGgAmxqIAIgACAGQaACbGoQ7wELQQAhBQJAA0AgBSAGTw0BIAAgBUGgAmxqIQMgACABQQFrIAVrQaACbGohBCAEIAJBuMICEO8BIAMgAiAEEO8BQbjCAiADELUBIAVBAWohBQwACwsLnwEFAX8BfwF/AX8Bf0H4lwIgBUEgbGohCUGYoAIgBUEgbGohCiADQdjEAhApQQAhCAJAA0AgCCACRg0BIAAgCEGgAmxqIQYgASAIQaACbGohByAGIAlB+MQCEO8BIAdB+MQCQfjEAhDDASAGIAcgBxDDAUH4xAIgCiAGEO8BIAdB2MQCIAcQ7wFB2MQCIARB2MQCED0gCEEBaiEIDAALCwsXACABQZjHAhBBIABBmMcCQSAgAhCGAQsXACABQbjHAhBBIABBuMcCQSAgAhDgAQtYBAF/AX8BfwF/IAAhByAEIQggAkHYxwIQKUEAIQYCQANAIAYgAUYNASAHQdjHAiAIED0gB0EgaiEHIAhBIGohCEHYxwIgA0HYxwIQPSAGQQFqIQYMAAsLC1sEAX8BfwF/AX8gACEHIAQhCCACQfjHAhApQQAhBgJAA0AgBiABRg0BIAdB+McCIAgQ4QEgB0GQAWohByAIQZABaiEIQfjHAiADQfjHAhA9IAZBAWohBgwACwsLWwQBfwF/AX8BfyAAIQcgBCEIIAJBmMgCEClBACEGAkADQCAGIAFGDQEgB0GYyAIgCBD9ASAHQeAAaiEHIAhBkAFqIQhBmMgCIANBmMgCED0gBkEBaiEGDAALCwtbBAF/AX8BfwF/IAAhByAEIQggAkG4yAIQKUEAIQYCQANAIAYgAUYNASAHQbjIAiAIEO8BIAdBoAJqIQcgCEGgAmohCEG4yAIgA0G4yAIQPSAGQQFqIQYMAAsLC1sEAX8BfwF/AX8gACEHIAQhCCACQdjIAhApQQAhBgJAA0AgBiABRg0BIAdB2MgCIAgQ/gEgB0HAAWohByAIQaACaiEIQdjIAiADQdjIAhA9IAZBAWohBgwACwsLJQAgAEH41AIQACAAIABBMGogARARQfjUAiAAQTBqIAFBMGoQEAsbACAAEJkBIABB4ABqEJkBcSAAQcABahCZAXELHAAgABCaASAAQeAAahCZAXEgAEHAAWoQmQFxDwsZACAAEJsBIABB4ABqEJsBIABBwAFqEJsBCxkAIAAQnAEgAEHgAGoQmwEgAEHAAWoQmwELJwAgACABEJ0BIABB4ABqIAFB4ABqEJ0BIABBwAFqIAFBwAFqEJ0BC+UCACAAIAFBqNUCEJ4BIABB4ABqIAFB4ABqQYjWAhCeASAAQcABaiABQcABakHo1gIQngEgACAAQeAAakHI1wIQoQEgASABQeAAakGo2AIQoQEgACAAQcABakGI2QIQoQEgASABQcABakHo2QIQoQEgAEHgAGogAEHAAWpByNoCEKEBIAFB4ABqIAFBwAFqQajbAhChAUGo1QJBiNYCQYjcAhChAUGo1QJB6NYCQejcAhChAUGI1gJB6NYCQcjdAhChAUHI2gJBqNsCIAIQngEgAkHI3QIgAhCiASACIAIQhAJBqNUCIAIgAhChAUHI1wJBqNgCIAJB4ABqEJ4BIAJB4ABqQYjcAiACQeAAahCiAUHo1gJBqN4CEIQCIAJB4ABqQajeAiACQeAAahChAUGI2QJB6NkCIAJBwAFqEJ4BIAJBwAFqQejcAiACQcABahCiASACQcABakGI1gIgAkHAAWoQoQELgQIAIABBiN8CEKABIAAgAEHgAGpB6N8CEJ4BQejfAkHo3wJByOACEKEBIAAgAEHgAGpBqOECEKIBQajhAiAAQcABakGo4QIQoQFBqOECQajhAhCgASAAQeAAaiAAQcABakGI4gIQngFBiOICQYjiAkHo4gIQoQEgAEHAAWpByOMCEKABQejiAiABEIQCQYjfAiABIAEQoQFByOMCIAFB4ABqEIQCQcjgAiABQeAAaiABQeAAahChAUGI3wJByOMCIAFBwAFqEKEBQejiAiABQcABaiABQcABahCiAUGo4QIgAUHAAWogAUHAAWoQoQFByOACIAFBwAFqIAFBwAFqEKEBCzUAIAAgASACEKEBIABB4ABqIAFB4ABqIAJB4ABqEKEBIABBwAFqIAFBwAFqIAJBwAFqEKEBCzUAIAAgASACEKIBIABB4ABqIAFB4ABqIAJB4ABqEKIBIABBwAFqIAFBwAFqIAJBwAFqEKIBCycAIAAgARCjASAAQeAAaiABQeAAahCjASAAQcABaiABQcABahCjAQswAQF/IABBwAFqEKoBIQEgAQRAIAEPCyAAQeAAahCqASEBIAEEQCABDwsgABCqAQ8LJwAgACABEKUBIABB4ABqIAFB4ABqEKUBIABBwAFqIAFBwAFqEKUBCycAIAAgARCmASAAQeAAaiABQeAAahCmASAAQcABaiABQcABahCmAQspACAAIAEQpwEgAEHgAGogAUHgAGoQpwFxIABBwAFqIAFBwAFqEKcBcQurAgAgAEGo5AIQoAEgAEHgAGpBiOUCEKABIABBwAFqQejlAhCgASAAIABB4ABqQcjmAhCeASAAIABBwAFqQajnAhCeASAAQeAAaiAAQcABakGI6AIQngFBiOgCQejoAhCEAkGo5AJB6OgCQejoAhCiAUHo5QJByOkCEIQCQcjpAkHI5gJByOkCEKIBQYjlAkGo5wJBqOoCEKIBIABBwAFqQcjpAkGI6wIQngEgAEHgAGpBqOoCQejrAhCeAUGI6wJB6OsCQYjrAhChAUGI6wJBiOsCEIQCIABB6OgCQejrAhCeAUHo6wJBiOsCQYjrAhChAUGI6wJBiOsCEKgBQYjrAkHo6AIgARCeAUGI6wJByOkCIAFB4ABqEJ4BQYjrAkGo6gIgAUHAAWoQngELMwAgACABIAIgAxCpASAAQeAAaiABIAIgA0HgAGoQqQEgAEHAAWogASACIANBwAFqEKkBCzUAIABBwAFqEJkBBEAgAEHgAGoQmQEEQCAAEKsBDwUgAEHgAGoQqwEPCwsgAEHAAWoQqwEPC48CBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakGgAmxqNgIAIAUQiAIgACEGIAVBoAJqIQVBACEIAkADQCAIIAJGDQEgBhCFAgRAIAVBoAJrIAUQiQIFIAYgBUGgAmsgBRCKAgsgBiABaiEGIAVBoAJqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUGgAmshBSADIAJBAWsgBGxqIQcgBSAFEJMCAkADQCAIRQ0BIAYQhQIEQCAFIAVBoAJrEIkCIAcQhwIFIAVBoAJrQcjsAhCJAiAFIAYgBUGgAmsQigIgBUHI7AIgBxCKAgsgBiABayEGIAcgBGshByAFQaACayEFIAhBAWshCAwACwtBACAFNgIAC84CAgF/AX8gAkUEQCADEIgCDwsgAEHo7gIQiQIgAxCIAiACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADEIsCIAVBgAFPBEAgBUGAAWshBSADQejuAiADEIoCCyADIAMQiwIgBUHAAE8EQCAFQcAAayEFIANB6O4CIAMQigILIAMgAxCLAiAFQSBPBEAgBUEgayEFIANB6O4CIAMQigILIAMgAxCLAiAFQRBPBEAgBUEQayEFIANB6O4CIAMQigILIAMgAxCLAiAFQQhPBEAgBUEIayEFIANB6O4CIAMQigILIAMgAxCLAiAFQQRPBEAgBUEEayEFIANB6O4CIAMQigILIAMgAxCLAiAFQQJPBEAgBUECayEFIANB6O4CIAMQigILIAMgAxCLAiAFQQFPBEAgBUEBayEFIANB6O4CIAMQigILIARFDQEMAAsLCzIAIABBiPECEJ0BIABBwAFqIAEQhAIgAEHgAGogAUHAAWoQnQFBiPECIAFB4ABqEJ0BCxEAIAAQhQIgAEGgAmoQhQJxCxIAIAAQhgIgAEGgAmoQhQJxDwsQACAAEIcCIABBoAJqEIcCCxAAIAAQiAIgAEGgAmoQhwILGAAgACABEIkCIABBoAJqIAFBoAJqEIkCC4UBACAAIAFB6PECEIoCIABBoAJqIAFBoAJqQYj0AhCKAiAAIABBoAJqQaj2AhCMAiABIAFBoAJqQcj4AhCMAkGo9gJByPgCQaj2AhCKAkGI9AIgAhCYAkHo8QIgAiACEIwCQejxAkGI9AIgAkGgAmoQjAJBqPYCIAJBoAJqIAJBoAJqEI0CCxwAIAAgASACEIoCIABBoAJqIAEgAkGgAmoQigILfQAgACAAQaACakHo+gIQigIgACAAQaACakGI/QIQjAIgAEGgAmpBqP8CEJgCIABBqP8CQaj/AhCMAkHo+gJByIEDEJgCQciBA0Ho+gJByIEDEIwCQYj9AkGo/wIgARCKAiABQciBAyABEI0CQej6AkHo+gIgAUGgAmoQjAILIAAgACABIAIQjAIgAEGgAmogAUGgAmogAkGgAmoQjAILIAAgACABIAIQjQIgAEGgAmogAUGgAmogAkGgAmoQjQILGAAgACABEI4CIABBoAJqIAFBoAJqEI4CCxgAIAAgARCJAiAAQaACaiABQaACahCOAgsYACAAIAEQkAIgAEGgAmogAUGgAmoQkAILGAAgACABEJECIABBoAJqIAFBoAJqEJECCxkAIAAgARCSAiAAQaACaiABQaACahCSAnELagAgAEHogwMQiwIgAEGgAmpBiIYDEIsCQYiGA0GoiAMQmAJB6IMDQaiIA0GoiAMQjQJBqIgDQciKAxCTAiAAQciKAyABEIoCIABBoAJqQciKAyABQaACahCKAiABQaACaiABQaACahCOAgsgACAAIAEgAiADEJQCIABBoAJqIAEgAiADQaACahCUAgsdAQF/IABBoAJqEI8CIQEgAQRAIAEPCyAAEI8CDwseACAAQaACahCFAgRAIAAQlQIPCyAAQaACahCVAg8LjwIEAX8BfwF/AX9BACgCACEFQQAgBSACQQFqQcAEbGo2AgAgBRCcAiAAIQYgBUHABGohBUEAIQgCQANAIAggAkYNASAGEJkCBEAgBUHABGsgBRCdAgUgBiAFQcAEayAFEJ4CCyAGIAFqIQYgBUHABGohBSAIQQFqIQgMAAsLIAYgAWshBiAFQcAEayEFIAMgAkEBayAEbGohByAFIAUQqAICQANAIAhFDQEgBhCZAgRAIAUgBUHABGsQnQIgBxCbAgUgBUHABGtB6IwDEJ0CIAUgBiAFQcAEaxCeAiAFQeiMAyAHEJ4CCyAGIAFrIQYgByAEayEHIAVBwARrIQUgCEEBayEIDAALC0EAIAU2AgALzgICAX8BfyACRQRAIAMQnAIPCyAAQaiRAxCdAiADEJwCIAIhBAJAA0AgBEEBayEEIAEgBGotAAAhBSADIAMQoAIgBUGAAU8EQCAFQYABayEFIANBqJEDIAMQngILIAMgAxCgAiAFQcAATwRAIAVBwABrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBIE8EQCAFQSBrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBEE8EQCAFQRBrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBCE8EQCAFQQhrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBBE8EQCAFQQRrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBAk8EQCAFQQJrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBAU8EQCAFQQFrIQUgA0GokQMgAxCeAgsgBEUNAQwACwsL0QEAQeinAxCcAkHopwNB6KcDEKMCIABB6JUDQaACQaiaAxCtAkGomgNB6J4DEKACIABB6J4DQeieAxCeAkHongNBqKMDEKQCQaijA0HongNBqKMDEJ4CQaijA0HopwMQpwIEQAALQaiaAyAAQaisAxCeAkHongNB6KcDEKcCBEBB6KcDEIcCQYiqAxCIAkHopwNBqKwDIAEQngIFQeiwAxCcAkHosANB6J4DQeiwAxChAkHosANBiJgDQaACQeiwAxCtAkHosANBqKwDIAEQngILC2oAQYjFAxCcAkGIxQNBiMUDEKMCIABBqLUDQaACQci3AxCtAkHItwNBiLwDEKACIABBiLwDQYi8AxCeAkGIvANByMADEKQCQcjAA0GIvANByMADEJ4CQcjAA0GIxQMQpwIEQEEADwtBAQ8LeAAgACAAQeAAakGIygMQoQEgAEHgAGogAEHAAWpB6MoDEKEBIABB4ABqIAEgAkHAAWoQngFB6MoDIAEgAhCeASACIAJBwAFqIAIQogEgAiACEIQCQYjKAyABIAJB4ABqEJ4BIAJB4ABqIAJBwAFqIAJB4ABqEKIBC+wBACAAIAFByMsDEJ4BIABB4ABqIAJBqMwDEJ4BIAAgAEHgAGpBiM0DEKEBIAAgAEHAAWpB6M0DEKEBIABB4ABqIABBwAFqIAMQoQEgAyACIAMQngEgA0GozAMgAxCiASADIAMQhAIgA0HIywMgAxChASABIAIgA0HgAGoQoQEgA0HgAGpBiM0DIANB4ABqEJ4BIANB4ABqQcjLAyADQeAAahCiASADQeAAakGozAMgA0HgAGoQogFB6M0DIAEgA0HAAWoQngEgA0HAAWpByMsDIANBwAFqEKIBIANBwAFqQajMAyADQcABahChAQuQAQAgACABIAJByM4DELECIABBoAJqIANB6NADELACIAIgA0GI0wMQoQEgAEGgAmogACAEQaACahCMAiAEQaACaiABQYjTAyAEQaACahCxAiAEQaACakHIzgMgBEGgAmoQjQIgBEGgAmpB6NADIARBoAJqEI0CQejQAyAEEIkCIAQgBBCYAiAEQcjOAyAEEIwCC1AAIAEgAEEwakHo0wMQFCABQTBqIABBMGpBmNQDEBQgAUHgAGogAEHI1AMQFCABQZABaiAAQfjUAxAUIAIgAUHAAWpByNQDQejTAyACELICC2wAIABBqPcEIAEQngEgAEHgAGpBiPgEIAFB4ABqEJ4BIABBwAFqQej4BCABQcABahCeASAAQaACakHI+QQgAUGgAmoQngEgAEGAA2pBqPoEIAFBgANqEJ4BIABB4ANqQYj7BCABQeADahCeAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUHo+wQgARCeASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpByPwEIAFB4ABqEJ4BIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakGo/QQgAUHAAWoQngEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQYj+BCABQaACahCeASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pB6P4EIAFBgANqEJ4BIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakHI/wQgAUHgA2oQngELbAAgAEGogAUgARCeASAAQeAAakGIgQUgAUHgAGoQngEgAEHAAWpB6IEFIAFBwAFqEJ4BIABBoAJqQciCBSABQaACahCeASAAQYADakGogwUgAUGAA2oQngEgAEHgA2pBiIQFIAFB4ANqEJ4BC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQeiEBSABEJ4BIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakHIhQUgAUHgAGoQngEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQaiGBSABQcABahCeASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpBiIcFIAFBoAJqEJ4BIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakHohwUgAUGAA2oQngEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQciIBSABQeADahCeAQtsACAAQaiJBSABEJ4BIABB4ABqQYiKBSABQeAAahCeASAAQcABakHoigUgAUHAAWoQngEgAEGgAmpByIsFIAFBoAJqEJ4BIABBgANqQaiMBSABQYADahCeASAAQeADakGIjQUgAUHgA2oQngELigIAIAAgARAAIABBMGogAUEwahASIAFB6I0FIAEQngEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahASIAFB4ABqQciOBSABQeAAahCeASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBIgAUHAAWpBqI8FIAFBwAFqEJ4BIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQEiABQaACakGIkAUgAUGgAmoQngEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahASIAFBgANqQeiQBSABQYADahCeASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBIgAUHgA2pByJEFIAFB4ANqEJ4BC2wAIABBqJIFIAEQngEgAEHgAGpBiJMFIAFB4ABqEJ4BIABBwAFqQeiTBSABQcABahCeASAAQaACakHIlAUgAUGgAmoQngEgAEGAA2pBqJUFIAFBgANqEJ4BIABB4ANqQYiWBSABQeADahCeAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUHolgUgARCeASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpByJcFIAFB4ABqEJ4BIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakGomAUgAUHAAWoQngEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQYiZBSABQaACahCeASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pB6JkFIAFBgANqEJ4BIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakHImgUgAUHgA2oQngELbAAgAEGomwUgARCeASAAQeAAakGInAUgAUHgAGoQngEgAEHAAWpB6JwFIAFBwAFqEJ4BIABBoAJqQcidBSABQaACahCeASAAQYADakGongUgAUGAA2oQngEgAEHgA2pBiJ8FIAFB4ANqEJ4BC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQeifBSABEJ4BIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakHIoAUgAUHgAGoQngEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQaihBSABQcABahCeASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpBiKIFIAFBoAJqEJ4BIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakHoogUgAUGAA2oQngEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQcijBSABQeADahCeAQuFAQAgABBWBEBBAQ8LIAAQb0UEQEEADwsgAEGopAVBmKUFEBQgAEEwakHIpQUQACAAQdikBUGopgUQFCAAQTBqQdimBRAAQZilBUGYpQUQYEGYpQUgAEGYpQUQaEGYpQVBqKYFQZilBRBoQZilBUGIpQVBEEGYpQUQhQFBmKUFQaimBRBeDwsSACAAQYinBRBuQYinBRC+Ag8LtAIAIAAQsAEEQEEBDwsgABDJAUUEQEEADwsgAEHopwVBkKoFEJ4BIABB4ABqQeinBUHwqgUQngFBkKoFQcioBUHQqwUQnwFB8KoFQbCsBRCjAUGQqgVBkK0FEKMBQfCqBUH4qAVB8K0FEJ4BQdCrBUGArAVB4KkFEBFB0KsFQYCsBUGArAUQEEHgqQVB0KsFEABBsKwFQeCsBUHgqQUQEUGwrAVB4KwFQeCsBRAQQeCpBUGwrAUQAEGQrQVBwK0FQeCpBRAQQZCtBUHArQVBwK0FEBFB4KkFQZCtBRAAQaCuBUHwrQVB4KkFEBFB8K0FQaCuBUGgrgUQEEHgqQVB8K0FEABB0K4FEJwBQZCtBUHYqQVBCEGQrQUQ3wFBkK0FQdCrBUGQrQUQvQFBkK0FIAAQuAEPCxMAIABBsK8FEMgBQbCvBRDAAg8L2AQAIABBwAFqQfCwBRCgASABQeAAakHQsQUQoAFB8LAFIAFBkLMFEJ4BIAFB4ABqIABBwAFqIAJB4ABqEKEBIAJB4ABqIAJB4ABqEKABIAJB4ABqQdCxBSACQeAAahCiASACQeAAakHwsAUgAkHgAGoQogEgAkHgAGpB8LAFIAJB4ABqEJ4BQZCzBSAAQfCzBRCiAUHwswVB0LQFEKABQdC0BUHQtAVBsLUFEKEBQbC1BUGwtQVBsLUFEKEBQbC1BUHwswVBkLYFEJ4BIAJB4ABqIABB4ABqQfC2BRCiAUHwtgUgAEHgAGpB8LYFEKIBQfC2BSABIAJBwAFqEJ4BQbC1BSAAQdC3BRCeAUHwtgUgABCgASAAQZC2BSAAEKIBIABB0LcFIAAQogEgAEHQtwUgABCiASAAQcABakHwswUgAEHAAWoQoQEgAEHAAWogAEHAAWoQoAEgAEHAAWpB8LAFIABBwAFqEKIBIABBwAFqQdC0BSAAQcABahCiASABQeAAaiAAQcABaiACEKEBQdC3BSAAQbC4BRCiAUGwuAVB8LYFQbC4BRCeASAAQeAAakGQtgVBkLMFEJ4BQZCzBUGQswVBkLMFEKEBQbC4BUGQswUgAEHgAGoQogEgAiACEKABIAJB0LEFIAIQogEgAEHAAWpBsLIFEKABIAJBsLIFIAIQogEgAkHAAWogAkHAAWogAkHAAWoQoQEgAkHAAWogAiACQcABahCiASAAQcABaiAAQcABaiACEKEBQfC2BUHwtgUQowFB8LYFQfC2BSACQeAAahChAQuyBAAgACABEKABIABB4ABqQfC5BRCgAUHwuQVB0LoFEKABQfC5BSAAIAFB4ABqEKEBIAFB4ABqIAFB4ABqEKABIAFB4ABqIAEgAUHgAGoQogEgAUHgAGpB0LoFIAFB4ABqEKIBIAFB4ABqIAFB4ABqIAFB4ABqEKEBIAEgAUGwuwUQoQFBsLsFIAFBsLsFEKEBIABBsLsFIAFBwAFqEKEBQbC7BUGQvAUQoAEgAEHAAWpBkLkFEKABQZC8BSABQeAAaiAAEKIBIAAgAUHgAGogABCiASAAQcABaiAAQeAAaiAAQcABahChASAAQcABaiAAQcABahCgASAAQcABakHwuQUgAEHAAWoQogEgAEHAAWpBkLkFIABBwAFqEKIBIAFB4ABqIAAgAEHgAGoQogEgAEHgAGpBsLsFIABB4ABqEJ4BQdC6BUHQugVB0LoFEKEBQdC6BUHQugVB0LoFEKEBQdC6BUHQugVB0LoFEKEBIABB4ABqQdC6BSAAQeAAahCiAUGwuwVBkLkFIAFB4ABqEJ4BIAFB4ABqIAFB4ABqIAFB4ABqEKEBIAFB4ABqIAFB4ABqEKMBIAFBwAFqIAFBwAFqEKABIAFBwAFqIAEgAUHAAWoQogEgAUHAAWpBkLwFIAFBwAFqEKIBQfC5BUHwuQVB8LkFEKEBQfC5BUHwuQVB8LkFEKEBIAFBwAFqQfC5BSABQcABahCiASAAQcABakGQuQUgARCeASABIAEgARChAQsIACAAIAEQcgttAgF/AX8gACABEMwBIAEQsQEEQA8LIAFB8LwFELUBIAFBoAJqIQJBPiEDAkADQEHwvAUgAhDDAiACQaACaiECIAMsAMjJAwRAQfC8BSABIAIQwgIgAkGgAmohAgsgA0UNASADQQFrIQMMAAsLC4ABAgF/AX8gAhCcAiAAEFcEQA8LIAEQVwRADwsgAUGgAmohA0E+IQQCQANAIAAgAyACELMCIANBoAJqIQMgBCwAyMkDBEAgACADIAIQswIgA0GgAmohAwsgAiACEKACIARBAUYNASAEQQFrIQQMAAsLIAAgAyACELMCIAIgAhCkAgsQACAAQZC/BUGgBCABEK0CC+wFACAAIABBgANqQfDHBRCeASAAQYADakGwwwUQhAIgAEGwwwVBsMMFEKEBIAAgAEGAA2pB0MgFEKEBQdDIBUGwwwVBsMMFEJ4BQfDHBUHQyAUQhAJB8McFQdDIBUHQyAUQoQFBsMMFQdDIBUGwwwUQogFB8McFQfDHBUGQxAUQoQEgAEGgAmogAEHAAWpB8McFEJ4BIABBwAFqQfDEBRCEAiAAQaACakHwxAVB8MQFEKEBIABBoAJqIABBwAFqQdDIBRChAUHQyAVB8MQFQfDEBRCeAUHwxwVB0MgFEIQCQfDHBUHQyAVB0MgFEKEBQfDEBUHQyAVB8MQFEKIBQfDHBUHwxwVB0MUFEKEBIABB4ABqIABB4ANqQfDHBRCeASAAQeADakGwxgUQhAIgAEHgAGpBsMYFQbDGBRChASAAQeAAaiAAQeADakHQyAUQoQFB0MgFQbDGBUGwxgUQngFB8McFQdDIBRCEAkHwxwVB0MgFQdDIBRChAUGwxgVB0MgFQbDGBRCiAUHwxwVB8McFQZDHBRChAUGwwwUgACABEKIBIAEgASABEKEBQbDDBSABIAEQoQFBkMQFIABBgANqIAFBgANqEKEBIAFBgANqIAFBgANqIAFBgANqEKEBQZDEBSABQYADaiABQYADahChAUGQxwVBmNQCQdDIBRCeAUHQyAUgAEGgAmogAUGgAmoQoQEgAUGgAmogAUGgAmogAUGgAmoQoQFB0MgFIAFBoAJqIAFBoAJqEKEBQbDGBSAAQcABaiABQcABahCiASABQcABaiABQcABaiABQcABahChAUGwxgUgAUHAAWogAUHAAWoQoQFB8MQFIABB4ABqIAFB4ABqEKIBIAFB4ABqIAFB4ABqIAFB4ABqEKEBQfDEBSABQeAAaiABQeAAahChAUHQxQUgAEHgA2ogAUHgA2oQoQEgAUHgA2ogAUHgA2ogAUHgA2oQoQFB0MUFIAFB4ANqIAFB4ANqEKEBC40BAgF/AX8gAEH4yQUQpAIgARCcAkHAACwAsMkFIgIEQCACQQFGBEAgASAAIAEQngIFIAFB+MkFIAEQngILC0E/IQMCQANAIAEgARDIAiADLACwyQUiAgRAIAJBAUYEQCABIAAgARCeAgUgAUH4yQUgARCeAgsLIANFDQEgA0EBayEDDAALCyABIAEQpAIL6wIAIABBuM4FELoCIABB+NIFEKgCQbjOBUH40gVBuNcFEJ4CQbjXBUH40gUQnQJBuNcFQbjXBRC2AkG41wVB+NIFQbjXBRCeAkG41wVB+NIFEMgCQfjSBUH40gUQpAJBuNcFQfjbBRDJAkH42wVBuOAFEMgCQfjSBUH42wVB+OQFEJ4CQfjkBUH40gUQyQJB+NIFQbjOBRDJAkG4zgVBuOkFEMkCQbjpBUG44AVBuOkFEJ4CQbjpBUG44AUQyQJB+OQFQfjkBRCkAkG44AVB+OQFQbjgBRCeAkG44AVBuNcFQbjgBRCeAkG41wVB+OQFEKQCQfjSBUG41wVB+NIFEJ4CQfjSBUH40gUQtwJBuOkFQfjkBUG46QUQngJBuOkFQbjpBRC1AkH42wVBuM4FQfjbBRCeAkH42wVB+NsFELYCQfjbBUH40gVB+NsFEJ4CQfjbBUG46QVB+NsFEJ4CQfjbBUG44AUgARCeAgtpAEH47QUQnAIgAEGo1QMQxAIgAUHI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuPIFEMYCQfjtBUG48gVB+O0FEJ4CQfjtBUH47QUQygJB+O0FIAIQpwILtQEAQfj2BRCcAiAAQajVAxDEAiABQcjXAxDFAkGo1QMQvgJFBEBBAA8LQcjXAxDAAkUEQEEADwtBqNUDQcjXA0G4+wUQxgJB+PYFQbj7BUH49gUQngIgAkGo1QMQxAIgA0HI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuPsFEMYCQfj2BUG4+wVB+PYFEJ4CQfj2BUH49gUQygJB+PYFIAQQpwILgQIAQfj/BRCcAiAAQajVAxDEAiABQcjXAxDFAkGo1QMQvgJFBEBBAA8LQcjXAxDAAkUEQEEADwtBqNUDQcjXA0G4hAYQxgJB+P8FQbiEBkH4/wUQngIgAkGo1QMQxAIgA0HI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuIQGEMYCQfj/BUG4hAZB+P8FEJ4CIARBqNUDEMQCIAVByNcDEMUCQajVAxC+AkUEQEEADwtByNcDEMACRQRAQQAPC0Go1QNByNcDQbiEBhDGAkH4/wVBuIQGQfj/BRCeAkH4/wVB+P8FEMoCQfj/BSAGEKcCC80CAEH4iAYQnAIgAEGo1QMQxAIgAUHI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuI0GEMYCQfiIBkG4jQZB+IgGEJ4CIAJBqNUDEMQCIANByNcDEMUCQajVAxC+AkUEQEEADwtByNcDEMACRQRAQQAPC0Go1QNByNcDQbiNBhDGAkH4iAZBuI0GQfiIBhCeAiAEQajVAxDEAiAFQcjXAxDFAkGo1QMQvgJFBEBBAA8LQcjXAxDAAkUEQEEADwtBqNUDQcjXA0G4jQYQxgJB+IgGQbiNBkH4iAYQngIgBkGo1QMQxAIgB0HI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuI0GEMYCQfiIBkG4jQZB+IgGEJ4CQfiIBkH4iAYQygJB+IgGIAgQpwILmQMAQfiRBhCcAiAAQajVAxDEAiABQcjXAxDFAkGo1QMQvgJFBEBBAA8LQcjXAxDAAkUEQEEADwtBqNUDQcjXA0G4lgYQxgJB+JEGQbiWBkH4kQYQngIgAkGo1QMQxAIgA0HI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuJYGEMYCQfiRBkG4lgZB+JEGEJ4CIARBqNUDEMQCIAVByNcDEMUCQajVAxC+AkUEQEEADwtByNcDEMACRQRAQQAPC0Go1QNByNcDQbiWBhDGAkH4kQZBuJYGQfiRBhCeAiAGQajVAxDEAiAHQcjXAxDFAkGo1QMQvgJFBEBBAA8LQcjXAxDAAkUEQEEADwtBqNUDQcjXA0G4lgYQxgJB+JEGQbiWBkH4kQYQngIgCEGo1QMQxAIgCUHI1wMQxQJBqNUDEL4CRQRAQQAPC0HI1wMQwAJFBEBBAA8LQajVA0HI1wNBuJYGEMYCQfiRBkG4lgZB+JEGEJ4CQfiRBkH4kQYQygJB+JEGIAoQpwILLAAgAEGo1QMQxAIgAUHI1wMQxQJBqNUDQcjXA0H4mgYQxgJB+JoGIAIQygILC9zAAXsAQQALBLiPAQAAQQgLIAEAAAD//////lv+/wKkvVMF2KEJCNg5M0h9nSlTp+1zAEHIBQswq6r//////rn//1Ox/v+rHiT2sPag0jBnvxKF84RLd2TXrEtDtqcbS5rmfznqEQEaAEH4BQswRhc0HDQf3/TxBNEJpuZ2CtW2lUxsR+WNwIOdk6mI62ctlRm1hT55mqrjypLlj5gRAEGoBgsw/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAEHYBgswAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGIBwswVdX///9//9z//6lY//9VDxJ7WHtQaZizX4nCecKlO7Jr1qUh29ONJU3zvxz1iAANAEG4BwswVtX///9//9z//6lY//9VDxJ7WHtQaZizX4nCecKlO7Jr1qUh29ONJU3zvxz1iAANAEHoBwswVdX///9//9z//6lY//9VDxJ7WHtQaZizX4nCecKlO7Jr1qUh29ONJU3zvxz1iAANAEGYCAswrqr8////9UP9/0ft8v+3Mmmd6aJJOugHersygzHzqOxpwPSgHo0U7wYC/z4mswoEAEHICAswq+r///+/f+7//1Ss//+qB4k9rD2oNMzZr0ThPOHSHdk169KQ7enGkqb5X456RIAGAEGIGwsgAQAAAP/////+W/7/AqS9UwXYoQkI2DkzSH2dKVOn7XMAQagbCyBtnPLzkOmZySNckofL7WwrjzlUcpYU0wUR/1mf2dlIBwBByBsLIP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQYAEHoGwsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYgcCyAAAACA////f/8t/38B0t6pAuzQBATsnBmkvs6UqdP2OQBBqBwLIAEAAID///9//y3/fwHS3qkC7NAEBOycGaS+zpSp0/Y5AEHIHAsg//////5b/v8CpL1TBdihCQjYOTNIfZ0pU6ftcwAAAAAAQegcCyB89BcMXG2rnOVxS/096eEcBdUdRzCybQ1qOzp0kOkOPwBBiB0LIAAAAID/Lf9/AdLeqQLs0AQE7JwZpL7OlKnT9jkAAAAAAEGoJQsw8/8MAAAAJ6oKADT8MgDMU3+ACmt66Y9H1yS65r5+07Evq3i/O3PJjn7egz1RRdYJAEGIygALIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEG4ywALIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEHIzQALoAj+////AQAAAAJIAwD6t4RY9U+87O9PjJlvBcWsWbEkGAMAAAD9/////BP7/wjsOPsPiOUcGIitmdh32Hz59chbsc+JqnRWsPP+uQZgQAEvByZ6ZiW/DZrOdINZLQXkLE0JEL3TabYwkadhoLJ/qfvkqCZLs88IRPMsev8G7KQ1H4kSCgsCoMIliCEIfX9xHJfYxRrYytw5R8FB4+6pe2BPNNEcI6NgZMXuX/JPqRTElW6bVIBQNh2d3QZFnwl0UhzMQCd1sJWbHXzL6FImWrDIXQOZQ1ziAQ8QFz1nX5vGY1OtJvO8YWPDXpqB3PDPmZdjHNmr8AS+lRAi8ubJIPZJrEJTEU3IwcpyJXEWzoVi/NyGR1fs1WR5FZYXSJrAQlc0+FN3MzW6lHdQrhZQzPhJPBolF7by2wXhONDfNhvza+c2Pd2AuFT8G0nK2ohy8vbFWzXimt0Euxw4mckJptIkZRbNnJIt9eM/RgSrsXP6vQ54/fYXJuYyO3ecUA5Ib1fH4feX67G8EF/pcdorZzOqJ2AsLu5OgVJE8xcSb6/lOSwzH5qf3Jhl8qjQTtLHssNwFmaBEhEGHuIiuofw3TwCOAZMpS/8l19Da6uU01udCIeWewGuFIX077AAnWBaODmUqRDlCK4q0vPwNcOwuJpue2DL+axkLbbWBqniCvXVY3QJbk/nVBWQXytA1wqFUfuBzy+t+uAs2ffZVY/PWZwN1WB1Ab1jt/ZkM6vnnsEvGr/lVHarw9yRLyRZdH3tzicoeeQcD3zcCni+euQk15INTAE7xmeULsFi5BpDb9ZxRV1fUfr96WBTzvcN5MwVYY7TDZ4F+sKAc2PbueJhLVoNENrd9qZPp7F2gyzUa1vDO1oRFIrcB/bGnK14yQwIrFZ/ssc+w4Mnjo/z+V0ChKpgXcnTtSGmbwQJD0+7LqecDeaBbOWk/OID+McLRCwAe/UGTPlpuEivREJYpmCCpQshQWjIvw/owebLT0+GNE7qZB+PUS2/ko+poRZk6aoih0ncRNuoEQbQgUf5f3UIAbuBfSCRyrOeJDd8UVWsVzEHQ1L1Gi4cVN4r7MMDYNF5lqbUBOjwNqVVQui8DDXek29xWnmeW3LouzE2RagrQm6gu4xmU+D2V0goD5x5zZcDRAv8Vnmm3icyrxivSTb78bJM0fOscrqmpglNZ/2js3niHkvybSlMtRPcpifY0pVEeUUQ1jRqhJa1o7hAX2c8iLou1tBz4H+ZXX4iio3/GejDvEHgT5KsiywZIRob6vQnRTuOumQ4AC1PntkY5PS/BnHf6TiVnvtHbyNE7en9304vBbxRJtCqNn3Ag3Ow1PCHZx9PbwiJLHRg9Rdjv2gpp1hjfPQXDFxtq5zlcUv9PenhHAXVHUcwsm0Najs6dJDpDj8AQejVAAugCP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQY/////wAAAAABpAEA/VtCrPonXvb3J8bMt4Ji1qxYEgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAABBiN4AC6AIyf///zYAAAA3PFoAW8NBAtuWOu5FlpL+fBUqDyIN8Rec+v//YwUAAGQV2AjU37eVSIOPE6x0L9zLpgirswPmEnfW8v+IKQ0Aie0xmHq/F3wbSoX075wJWjjK/CTVBcxmjRj8iyTnA3TBk7zbS1RI+5ZElSxLb0+vU/CFZ3rFcCeMxsHEZJ6vA6AZD4nIpsaYElbCxiAQvIyZBcmmyYR1Yjoy2HM5uamhgU7TqF0h3Sa1dJ7bxkqHgOuKJkC/mko18hrWlOvZEcZ7MnSA4ZeQ6gYfgcID2bqQlprtCLSo1wJG3sQKemwVTaysHDkuj2Gb3r2qsX3+LWn+Z5IjdeKII7b2ezzlk1nitleXwYwMAF3PLFc+SUL7/AX7M1zrX2AP4W+Gw0SeIhZw1qTxaK/MjgNN9q1ySFezv4afn1dcRAKHrAicpF1phI2WnnGmm6TBt+zZtAQqWkzzxrfkST8/Uopa+b//aCvZeqMOhabyrxBtSeQ7gazlZDTdeBywzycau7PIEsqEfkmf3K5+ACKjxbOFsZfPuVew5sHmQHMPFg09MkH2VlrNX0TzGEoNr0cfkViMbL296IfeTSvOPc37YcvgiCWrC7JM36wHVE5O+V223Y8VemSNbNTYxYMS3RttENDCrDH04I/WSnXyaHlAAxVzsIitDsi3UN7z0v3OtTGmxA5rrikTfdMCODUIzDufRJ6/aGe4Qio5PVd9VHQQPvduiTrzVfTjX/D/xDG/rKSq9wVYpyPFVwGvzDcQ175zvqA/lvdxNcLQgZuLZk88KJHj+ZJdGdCLCK/zDC6iwlc3zWzgcRpdOLsb4jPrB9xFpw6p+Nh+H+Pj6xpY7y/fC9lzdDbmm9kmV4NjzImv/viZzd5/pYD9OlPfvZw5XhklvgttGT+vU9G1u5M9O8ptGS4/gEX3nJo1Az/FYG/5Z1TFNBBIc+zeXAdJHQTKcZocksLqHhkO8xoOTXxr4Ot4ZJ8bpOG0yiit9BHVVP9h6i2W0v/bpTJpFkzuHb/waTNZdnGdmE9oDpzc98VZemaiEzzBE0QD8ZDCCQ8PlQA5T05onm72a6asxflOWhRx9J7EnNpKnJmxCHRN/0PJV+u2FXF08Oa+HSkPVk2KEAQ7gKO7C+bDeNYYsJKphB3Th7YPcOqiWX+WnHFL6vK3g2DrJbId82PBStrZ9QWyTK1W/WY5MJQfvxSoQvgpHw+XveihyYYYZeuRtDko3lCndaPZYJJxi9FJib0acRQtedPQbtutrBJGvngFqrVHjdMKdw0RCNmObT6WjOfb47O8/sJgE6Sb5nDusMeVBP5FhgQRBDki8IXATBVpZXQdhVE8Iw47dEJ3uOAloeykIei/USkTBjgWB1UpX74JocHzW85RUBqQmLQmsM5janW4gothM8JcAEGo5gALoAhWVVVV/////6mSqaqswtM3rjrBWwWQJiIw/mjGjG+eQoQ0SIOwEzuxj3ZAGjBvCwHjUoF2GZtk/anWvxD6AdJS4j8GCpwaZUX7/3GAgypQ2KKoqHHsXV3KtIO0e9II4GQnA6B1q8L3QCnIB7Xdib+hKMO1FyGgWoPxTigHO1sHSzNF1zPPr+eMIkVox0PRSVtZdzs6DLKKzXW2LJEuMPQNwD4o5/xJLMoUrCQ+KLIAEsOequSmh0PWUqMiEOfOrgz9TefHCMZEZWI5WBJqBEks3q6NV7DHtKFs3V9ybCJYVBdJF0/KldrmqYSJXA2ETceUlJ9b2ora+6oxJZ24f5g7iytGIylZVILuNhfMnAkG2ay12m7HefgBN6BU3tko6gTmTKPJtLnoTKZBNpzSOB40aUdAsugBp865dss2kv5OOTblVUHGl2VgWKRCF7Ut710oKCZd3tAMidDih6ol3Nkwne3Va8TTF6r8kBYwhVUYYAzaqjdYOvtjDgPbqvU6tUlQAnlppUJgS7d/OwH3yAOzmeJ19JJdz/BgY6/N1iJlBBy5AJDb5Z8rufJ6BHwI1dRR1e4kMxvfSdW9JjlovecEp4Sm7fxueV9fxu94UonziqDsQ7iAl86LDfefxiqEtDaA5bFPuhQbD4eDlFkl1pJSqCEeBx9GYpprGbwCUqLiHlncaeH8NTkujiZ9TT4kkdp1yVSGSYsecB/v6FrKRPdcr9Dx/T//qQKPKKOJmUBxwRou5Rq9cdKNe+w+w65zkiyFvJYwRJMsjy61hkPljZB0Q/Ejfrc/UTzX+lHSyzf9QOnDkK9t+TOUJS5czCDBRPT9S/M+Pj+FcbUN5/DRVKEUFBFAs5DQBIBIgHCelcts2SGp1m4Eez/b1vI0MsV/Bx5XM0YCUJRAlVkWGz5RvwG0TnfCkjmAuAxRlwXTfN8oYueRXHO1H6+vZ/OP/fuK5LFtvhDFjY4HoZmpeZETcD5EyYh+HnZRRYEiiQvHjXTpI9KDkTR74bg3jSA0DIwoEjNYkg7D5SXVPuUXycobaP9Ip+bIh0gWf3NEFbvAvY6eaj+wf+R0aIFWXo+CfbjvYyAh3zNMphwFHjJPMMOGr100IKwLY13nlZHmO1/x+W4qAcV0U6jDGf1MO5v/fFX+fx3xF7S86F+jcrVcGLlapLh5/f777UsGT/tJftY8j7ayT4QNx8BhxMNtm3W7FIwqPMOp6OTtQdWiwr6s543Dsbxuta0Ce+BJONKM1dBYPS16gl7dX1BkpM1whUJE/3IB+BqX4G3dOPwuXEm5K/CLlGMdcuQWRtygmQYDuNeauANSOdT87ckuLwZmXCgHq7rtVqVnotBLWGUccDIkc1BMtKQA/53nhYUH7+2Y753ER3eDOMInbDYWsxREM1JU00dDIV4AQcjuAAuAAgCAQMAgoGDgEJBQ0DCwcPAIiEjIKKho6BiYWNg4uHj4BIRExCSkZOQUlFTUNLR09AyMTMwsrGzsHJxc3Dy8fPwCgkLCIqJi4hKSUtIysnLyCopKyiqqauoamlraOrp6+gaGRsYmpmbmFpZW1ja2dvYOjk7OLq5u7h6eXt4+vn7+AYFBwSGhYeERkVHRMbFx8QmJSckpqWnpGZlZ2Tm5efkFhUXFJaVl5RWVVdU1tXX1DY1NzS2tbe0dnV3dPb19/QODQ8Mjo2PjE5NT0zOzc/MLi0vLK6tr6xubW9s7u3v7B4dHxyenZ+cXl1fXN7d39w+PT88vr2/vH59f3z+/f/8AQYj8AAswqur///+/f+7//1Ss//+qB4k9rD2oNMzZr0ThPOHSHdk169KQ7enGkqb5X456RIAGAEG4/AALMFXV////f//c//+pWP//VQ8Se1h7UGmYs1+JwnnCpTuya9alIdvTjSVN878c9YgADQBBqIEBCzCq6v///79/7v//VKz//6oHiT2sPag0zNmvROE84dId2TXr0pDt6caSpvlfjnpEgAYAQdiEAQtg8/8MAAAAJ6oKADT8MgDMU3+ACmt66Y9H1yS65r5+07Evq3i/O3PJjn7egz1RRdYJ8/8MAAAAJ6oKADT8MgDMU3+ACmt66Y9H1yS65r5+07Evq3i/O3PJjn7egz1RRdYJAEGYzgELIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEHY0AELIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEH41AELoAj+////AQAAAAJIAwD6t4RY9U+87O9PjJlvBcWsWbEkGAMAAAD9/////BP7/wjsOPsPiOUcGIitmdh32Hz59chbsc+JqnRWsPP+uQZgQAEvByZ6ZiW/DZrOdINZLQXkLE0JEL3TabYwkadhoLJ/qfvkqCZLs88IRPMsev8G7KQ1H4kSCgsCoMIliCEIfX9xHJfYxRrYytw5R8FB4+6pe2BPNNEcI6NgZMXuX/JPqRTElW6bVIBQNh2d3QZFnwl0UhzMQCd1sJWbHXzL6FImWrDIXQOZQ1ziAQ8QFz1nX5vGY1OtJvO8YWPDXpqB3PDPmZdjHNmr8AS+lRAi8ubJIPZJrEJTEU3IwcpyJXEWzoVi/NyGR1fs1WR5FZYXSJrAQlc0+FN3MzW6lHdQrhZQzPhJPBolF7by2wXhONDfNhvza+c2Pd2AuFT8G0nK2ohy8vbFWzXimt0Euxw4mckJptIkZRbNnJIt9eM/RgSrsXP6vQ54/fYXJuYyO3ecUA5Ib1fH4feX67G8EF/pcdorZzOqJ2AsLu5OgVJE8xcSb6/lOSwzH5qf3Jhl8qjQTtLHssNwFmaBEhEGHuIiuofw3TwCOAZMpS/8l19Da6uU01udCIeWewGuFIX077AAnWBaODmUqRDlCK4q0vPwNcOwuJpue2DL+axkLbbWBqniCvXVY3QJbk/nVBWQXytA1wqFUfuBzy+t+uAs2ffZVY/PWZwN1WB1Ab1jt/ZkM6vnnsEvGr/lVHarw9yRLyRZdH3tzicoeeQcD3zcCni+euQk15INTAE7xmeULsFi5BpDb9ZxRV1fUfr96WBTzvcN5MwVYY7TDZ4F+sKAc2PbueJhLVoNENrd9qZPp7F2gyzUa1vDO1oRFIrcB/bGnK14yQwIrFZ/ssc+w4Mnjo/z+V0ChKpgXcnTtSGmbwQJD0+7LqecDeaBbOWk/OID+McLRCwAe/UGTPlpuEivREJYpmCCpQshQWjIvw/owebLT0+GNE7qZB+PUS2/ko+poRZk6aoih0ncRNuoEQbQgUf5f3UIAbuBfSCRyrOeJDd8UVWsVzEHQ1L1Gi4cVN4r7MMDYNF5lqbUBOjwNqVVQui8DDXek29xWnmeW3LouzE2RagrQm6gu4xmU+D2V0goD5x5zZcDRAv8Vnmm3icyrxivSTb78bJM0fOscrqmpglNZ/2js3niHkvybSlMtRPcpifY0pVEeUUQ1jRqhJa1o7hAX2c8iLou1tBz4H+ZXX4iio3/GejDvEHgT5KsiywZIRob6vQnRTuOumQ4AC1PntkY5PS/BnHf6TiVnvtHbyNE7en9304vBbxRJtCqNn3Ag3Ow1PCHZx9PbwiJLHRg9Rdjv2gpp1hjfPQXDFxtq5zlcUv9PenhHAXVHUcwsm0Najs6dJDpDj8AQZjdAQugCP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQY/////wAAAAABpAEA/VtCrPonXvb3J8bMt4Ji1qxYEgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAABBuOUBC6AIyf///zYAAAA3PFoAW8NBAtuWOu5FlpL+fBUqDyIN8Rec+v//YwUAAGQV2AjU37eVSIOPE6x0L9zLpgirswPmEnfW8v+IKQ0Aie0xmHq/F3wbSoX075wJWjjK/CTVBcxmjRj8iyTnA3TBk7zbS1RI+5ZElSxLb0+vU/CFZ3rFcCeMxsHEZJ6vA6AZD4nIpsaYElbCxiAQvIyZBcmmyYR1Yjoy2HM5uamhgU7TqF0h3Sa1dJ7bxkqHgOuKJkC/mko18hrWlOvZEcZ7MnSA4ZeQ6gYfgcID2bqQlprtCLSo1wJG3sQKemwVTaysHDkuj2Gb3r2qsX3+LWn+Z5IjdeKII7b2ezzlk1nitleXwYwMAF3PLFc+SUL7/AX7M1zrX2AP4W+Gw0SeIhZw1qTxaK/MjgNN9q1ySFezv4afn1dcRAKHrAicpF1phI2WnnGmm6TBt+zZtAQqWkzzxrfkST8/Uopa+b//aCvZeqMOhabyrxBtSeQ7gazlZDTdeBywzycau7PIEsqEfkmf3K5+ACKjxbOFsZfPuVew5sHmQHMPFg09MkH2VlrNX0TzGEoNr0cfkViMbL296IfeTSvOPc37YcvgiCWrC7JM36wHVE5O+V223Y8VemSNbNTYxYMS3RttENDCrDH04I/WSnXyaHlAAxVzsIitDsi3UN7z0v3OtTGmxA5rrikTfdMCODUIzDufRJ6/aGe4Qio5PVd9VHQQPvduiTrzVfTjX/D/xDG/rKSq9wVYpyPFVwGvzDcQ175zvqA/lvdxNcLQgZuLZk88KJHj+ZJdGdCLCK/zDC6iwlc3zWzgcRpdOLsb4jPrB9xFpw6p+Nh+H+Pj6xpY7y/fC9lzdDbmm9kmV4NjzImv/viZzd5/pYD9OlPfvZw5XhklvgttGT+vU9G1u5M9O8ptGS4/gEX3nJo1Az/FYG/5Z1TFNBBIc+zeXAdJHQTKcZocksLqHhkO8xoOTXxr4Ot4ZJ8bpOG0yiit9BHVVP9h6i2W0v/bpTJpFkzuHb/waTNZdnGdmE9oDpzc98VZemaiEzzBE0QD8ZDCCQ8PlQA5T05onm72a6asxflOWhRx9J7EnNpKnJmxCHRN/0PJV+u2FXF08Oa+HSkPVk2KEAQ7gKO7C+bDeNYYsJKphB3Th7YPcOqiWX+WnHFL6vK3g2DrJbId82PBStrZ9QWyTK1W/WY5MJQfvxSoQvgpHw+XveihyYYYZeuRtDko3lCndaPZYJJxi9FJib0acRQtedPQbtutrBJGvngFqrVHjdMKdw0RCNmObT6WjOfb47O8/sJgE6Sb5nDusMeVBP5FhgQRBDki8IXATBVpZXQdhVE8Iw47dEJ3uOAloeykIei/USkTBjgWB1UpX74JocHzW85RUBqQmLQmsM5janW4gothM8JcAEHY7QELoAhWVVVV/////6mSqaqswtM3rjrBWwWQJiIw/mjGjG+eQoQ0SIOwEzuxj3ZAGjBvCwHjUoF2GZtk/anWvxD6AdJS4j8GCpwaZUX7/3GAgypQ2KKoqHHsXV3KtIO0e9II4GQnA6B1q8L3QCnIB7Xdib+hKMO1FyGgWoPxTigHO1sHSzNF1zPPr+eMIkVox0PRSVtZdzs6DLKKzXW2LJEuMPQNwD4o5/xJLMoUrCQ+KLIAEsOequSmh0PWUqMiEOfOrgz9TefHCMZEZWI5WBJqBEks3q6NV7DHtKFs3V9ybCJYVBdJF0/KldrmqYSJXA2ETceUlJ9b2ora+6oxJZ24f5g7iytGIylZVILuNhfMnAkG2ay12m7HefgBN6BU3tko6gTmTKPJtLnoTKZBNpzSOB40aUdAsugBp865dss2kv5OOTblVUHGl2VgWKRCF7Ut710oKCZd3tAMidDih6ol3Nkwne3Va8TTF6r8kBYwhVUYYAzaqjdYOvtjDgPbqvU6tUlQAnlppUJgS7d/OwH3yAOzmeJ19JJdz/BgY6/N1iJlBBy5AJDb5Z8rufJ6BHwI1dRR1e4kMxvfSdW9JjlovecEp4Sm7fxueV9fxu94UonziqDsQ7iAl86LDfefxiqEtDaA5bFPuhQbD4eDlFkl1pJSqCEeBx9GYpprGbwCUqLiHlncaeH8NTkujiZ9TT4kkdp1yVSGSYsecB/v6FrKRPdcr9Dx/T//qQKPKKOJmUBxwRou5Rq9cdKNe+w+w65zkiyFvJYwRJMsjy61hkPljZB0Q/Ejfrc/UTzX+lHSyzf9QOnDkK9t+TOUJS5czCDBRPT9S/M+Pj+FcbUN5/DRVKEUFBFAs5DQBIBIgHCelcts2SGp1m4Eez/b1vI0MsV/Bx5XM0YCUJRAlVkWGz5RvwG0TnfCkjmAuAxRlwXTfN8oYueRXHO1H6+vZ/OP/fuK5LFtvhDFjY4HoZmpeZETcD5EyYh+HnZRRYEiiQvHjXTpI9KDkTR74bg3jSA0DIwoEjNYkg7D5SXVPuUXycobaP9Ip+bIh0gWf3NEFbvAvY6eaj+wf+R0aIFWXo+CfbjvYyAh3zNMphwFHjJPMMOGr100IKwLY13nlZHmO1/x+W4qAcV0U6jDGf1MO5v/fFX+fx3xF7S86F+jcrVcGLlapLh5/f777UsGT/tJftY8j7ayT4QNx8BhxMNtm3W7FIwqPMOp6OTtQdWiwr6s543Dsbxuta0Ce+BJONKM1dBYPS16gl7dX1BkpM1whUJE/3IB+BqX4G3dOPwuXEm5K/CLlGMdcuQWRtygmQYDuNeauANSOdT87ckuLwZmXCgHq7rtVqVnotBLWGUccDIkc1BMtKQA/53nhYUH7+2Y753ER3eDOMInbDYWsxREM1JU00dDIV4AQfj1AQuAAgCAQMAgoGDgEJBQ0DCwcPAIiEjIKKho6BiYWNg4uHj4BIRExCSkZOQUlFTUNLR09AyMTMwsrGzsHJxc3Dy8fPwCgkLCIqJi4hKSUtIysnLyCopKyiqqauoamlraOrp6+gaGRsYmpmbmFpZW1ja2dvYOjk7OLq5u7h6eXt4+vn7+AYFBwSGhYeERkVHRMbFx8QmJSckpqWnpGZlZ2Tm5efkFhUXFJaVl5RWVVdU1tXX1DY1NzS2tbe0dnV3dPb19/QODQ8Mjo2PjE5NT0zOzc/MLi0vLK6tr6xubW9s7u3v7B4dHxyenZ+cXl1fXN7d39w+PT88vr2/vH59f3z+/f/8AQbiHAgugCP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQYAwAAAP3////8E/v/COw4+w+I5RwYiK2Z2HfYfPn1yFuxz4mqdFaw8/65BmBAAS8HJnpmJb8Nms50g1ktBeQsTQkQvdNptjCRp2Ggsn+p++SoJkuzzwhE8yx6/wbspDUfiRIKCwKgwiWIIQh9f3Ecl9jFGtjK3DlHwUHj7ql7YE800Rwjo2Bkxe5f8k+pFMSVbptUgFA2HZ3dBkWfCXRSHMxAJ3WwlZsdfMvoUiZasMhdA5lDXOIBDxAXPWdfm8ZjU60m87xhY8NemoHc8M+Zl2Mc2avwBL6VECLy5skg9kmsQlMRTcjBynIlcRbOhWL83IZHV+zVZHkVlhdImsBCVzT4U3czNbqUd1CuFlDM+Ek8GiUXtvLbBeE40N82G/Nr5zY93YC4VPwbScraiHLy9sVbNeKa3QS7HDiZyQmm0iRlFs2cki314z9GBKuxc/q9Dnj99hcm5jI7d5xQDkhvV8fh95frsbwQX+lx2itnM6onYCwu7k6BUkTzFxJvr+U5LDMfmp/cmGXyqNBO0seyw3AWZoESEQYe4iK6h/DdPAI4BkylL/yXX0Nrq5TTW50Ih5Z7Aa4UhfTvsACdYFo4OZSpEOUIrirS8/A1w7C4mm57YMv5rGQtttYGqeIK9dVjdAluT+dUFZBfK0DXCoVR+4HPL6364CzZ99lVj89ZnA3VYHUBvWO39mQzq+eewS8av+VUdqvD3JEvJFl0fe3OJyh55BwPfNwKeL565CTXkg1MATvGZ5QuwWLkGkNv1nFFXV9R+v3pYFPO9w3kzBVhjtMNngX6woBzY9u54mEtWg0Q2t32pk+nsXaDLNRrW8M7WhEUitwH9sacrXjJDAisVn+yxz7DgyeOj/P5XQKEqmBdydO1IaZvBAkPT7sup5wN5oFs5aT84gP4xwtELAB79QZM+Wm4SK9EQlimYIKlCyFBaMi/D+jB5stPT4Y0TupkH49RLb+Sj6mhFmTpqiKHSdxE26gRBtCBR/l/dQgBu4F9IJHKs54kN3xRVaxXMQdDUvUaLhxU3ivswwNg0XmWptQE6PA2pVVC6LwMNd6Tb3FaeZ5bcui7MTZFqCtCbqC7jGZT4PZXSCgPnHnNlwNEC/xWeabeJzKvGK9JNvvxskzR86xyuqamCU1n/aOzeeIeS/JtKUy1E9ymJ9jSlUR5RRDWNGqElrWjuEBfZzyIui7W0HPgf5ldfiKKjf8Z6MO8QeBPkqyLLBkhGhvq9CdFO466ZDgALU+e2Rjk9L8Gcd/pOJWe+0dvI0Tt6f3fTi8FvFEm0Ko2fcCDc7DU8IdnH09vCIksdGD1F2O/aCmnWGN89BcMXG2rnOVxS/096eEcBdUdRzCybQ1qOzp0kOkOPwBB2I8CC6AI/v///wEAAAACSAMA+reEWPVPvOzvT4yZbwXFrFmxJBj/////AAAAAAGkAQD9W0Ks+ide9vcnxsy3gmLWrFgSDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAEH4lwILoAjJ////NgAAADc8WgBbw0EC25Y67kWWkv58FSoPIg3xF5z6//9jBQAAZBXYCNTft5VIg48TrHQv3MumCKuzA+YSd9by/4gpDQCJ7TGYer8XfBtKhfTvnAlaOMr8JNUFzGaNGPyLJOcDdMGTvNtLVEj7lkSVLEtvT69T8IVnesVwJ4zGwcRknq8DoBkPicimxpgSVsLGIBC8jJkFyabJhHViOjLYczm5qaGBTtOoXSHdJrV0ntvGSoeA64omQL+aSjXyGtaU69kRxnsydIDhl5DqBh+BwgPZupCWmu0ItKjXAkbexAp6bBVNrKwcOS6PYZvevaqxff4taf5nkiN14ogjtvZ7POWTWeK2V5fBjAwAXc8sVz5JQvv8BfszXOtfYA/hb4bDRJ4iFnDWpPFor8yOA032rXJIV7O/hp+fV1xEAoesCJykXWmEjZaecaabpMG37Nm0BCpaTPPGt+RJPz9Silr5v/9oK9l6ow6FpvKvEG1J5DuBrOVkNN14HLDPJxq7s8gSyoR+SZ/crn4AIqPFs4Wxl8+5V7DmweZAcw8WDT0yQfZWWs1fRPMYSg2vRx+RWIxsvb3oh95NK849zfthy+CIJasLskzfrAdUTk75XbbdjxV6ZI1s1NjFgxLdG20Q0MKsMfTgj9ZKdfJoeUADFXOwiK0OyLdQ3vPS/c61MabEDmuuKRN90wI4NQjMO59Enr9oZ7hCKjk9V31UdBA+926JOvNV9ONf8P/EMb+spKr3BVinI8VXAa/MNxDXvnO+oD+W93E1wtCBm4tmTzwokeP5kl0Z0IsIr/MMLqLCVzfNbOBxGl04uxviM+sH3EWnDqn42H4f4+PrGljvL98L2XN0Nuab2SZXg2PMia/++JnN3n+lgP06U9+9nDleGSW+C20ZP69T0bW7kz07ym0ZLj+ARfecmjUDP8Vgb/lnVMU0EEhz7N5cB0kdBMpxmhySwuoeGQ7zGg5NfGvg63hknxuk4bTKKK30EdVU/2HqLZbS/9ulMmkWTO4dv/BpM1l2cZ2YT2gOnNz3xVl6ZqITPMETRAPxkMIJDw+VADlPTmiebvZrpqzF+U5aFHH0nsSc2kqcmbEIdE3/Q8lX67YVcXTw5r4dKQ9WTYoQBDuAo7sL5sN41hiwkqmEHdOHtg9w6qJZf5accUvq8reDYOslsh3zY8FK2tn1BbJMrVb9ZjkwlB+/FKhC+CkfD5e96KHJhhhl65G0OSjeUKd1o9lgknGL0UmJvRpxFC1509Bu262sEka+eAWqtUeN0wp3DREI2Y5tPpaM59vjs7z+wmATpJvmcO6wx5UE/kWGBBEEOSLwhcBMFWlldB2FUTwjDjt0Qne44CWh7KQh6L9RKRMGOBYHVSlfvgmhwfNbzlFQGpCYtCawzmNqdbiCi2EzwlwAQZigAgugCFZVVVX/////qZKpqqzC0zeuOsFbBZAmIjD+aMaMb55ChDRIg7ATO7GPdkAaMG8LAeNSgXYZm2T9qda/EPoB0lLiPwYKnBplRfv/cYCDKlDYoqiocexdXcq0g7R70gjgZCcDoHWrwvdAKcgHtd2Jv6Eow7UXIaBag/FOKAc7WwdLM0XXM8+v54wiRWjHQ9FJW1l3OzoMsorNdbYskS4w9A3APijn/EksyhSsJD4osgASw56q5KaHQ9ZSoyIQ586uDP1N58cIxkRlYjlYEmoESSzero1XsMe0oWzdX3JsIlhUF0kXT8qV2uaphIlcDYRNx5SUn1vaitr7qjElnbh/mDuLK0YjKVlUgu42F8ycCQbZrLXabsd5+AE3oFTe2SjqBOZMo8m0uehMpkE2nNI4HjRpR0Cy6AGnzrl2yzaS/k45NuVVQcaXZWBYpEIXtS3vXSgoJl3e0AyJ0OKHqiXc2TCd7dVrxNMXqvyQFjCFVRhgDNqqN1g6+2MOA9uq9Tq1SVACeWmlQmBLt387AffIA7OZ4nX0kl3P8GBjr83WImUEHLkAkNvlnyu58noEfAjV1FHV7iQzG99J1b0mOWi95wSnhKbt/G55X1/G73hSifOKoOxDuICXzosN95/GKoS0NoDlsU+6FBsPh4OUWSXWklKoIR4HH0ZimmsZvAJSouIeWdxp4fw1OS6OJn1NPiSR2nXJVIZJix5wH+/oWspE91yv0PH9P/+pAo8oo4mZQHHBGi7lGr1x0o177D7DrnOSLIW8ljBEkyyPLrWGQ+WNkHRD8SN+tz9RPNf6UdLLN/1A6cOQr235M5QlLlzMIMFE9P1L8z4+P4VxtQ3n8NFUoRQUEUCzkNAEgEiAcJ6Vy2zZIanWbgR7P9vW8jQyxX8HHlczRgJQlECVWRYbPlG/AbROd8KSOYC4DFGXBdN83yhi55Fcc7Ufr69n84/9+4rksW2+EMWNjgehmal5kRNwPkTJiH4edlFFgSKJC8eNdOkj0oORNHvhuDeNIDQMjCgSM1iSDsPlJdU+5RfJyhto/0in5siHSBZ/c0QVu8C9jp5qP7B/5HRogVZej4J9uO9jICHfM0ymHAUeMk8ww4avXTQgrAtjXeeVkeY7X/H5bioBxXRTqMMZ/Uw7m/98Vf5/HfEXtLzoX6NytVwYuVqkuHn9/vvtSwZP+0l+1jyPtrJPhA3HwGHEw22bdbsUjCo8w6no5O1B1aLCvqznjcOxvG61rQJ74Ek40ozV0Fg9LXqCXt1fUGSkzXCFQkT/cgH4Gpfgbd04/C5cSbkr8IuUYx1y5BZG3KCZBgO415q4A1I51PztyS4vBmZcKAeruu1WpWei0EtYZRxwMiRzUEy0pAD/neeFhQfv7ZjvncRHd4M4widsNhazFEQzUlTTR0MhXgBBuKgCC4ACAIBAwCCgYOAQkFDQMLBw8AiISMgoqGjoGJhY2Di4ePgEhETEJKRk5BSUVNQ0tHT0DIxMzCysbOwcnFzcPLx8/AKCQsIiomLiEpJS0jKycvIKikrKKqpq6hqaWto6unr6BoZGxiamZuYWllbWNrZ29g6OTs4urm7uHp5e3j6+fv4BgUHBIaFh4RGRUdExsXHxCYlJySmpaekZmVnZObl5+QWFRcUlpWXlFZVV1TW1dfUNjU3NLa1t7R2dXd09vX39A4NDwyOjY+MTk1PTM7Nz8wuLS8srq2vrG5tb2zu7e/sHh0fHJ6dn5xeXV9c3t3f3D49Pzy+vb+8fn1/fP79//wBB+MgCC5ABFgxT/ZCHs1z1/3aZZ/wXeMGhOxTHlU8VR+fQ881qrvBA9NshzG7O7XX7C55BdwEScSLnDNWTrLqO/Rh5GmMijM4lB1cTX1ndlFFAUClYrFHAWQCtP4wcDmqiCFD8PrwL/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAEGIygILkAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQZjLAgugAhAKlAKij/L1Gpa0hyb79bOA5So+tZOooemuPBqdmZSYazZjGGO3Z2/XvFBDkpGBBQb2I551wKmlw2DNvJ3FoKoGeIbiGH6xO2ezQYXMthobR4UV8g7ttsLz7WBzCSqSEUpMSWD4CnNMWpw2Xh/6fFlaYwqqbIXm519JDW7pte+7oiXv8HWp0wfl2oB+jv2DAF2wZN+S/MCt3GEUKwonqhig6+Q7aqythjqjPclOXEl57co8pFBYF+fyG95jocIrC/3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBuM0CC6ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHYzwILwAT9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQZjUAgtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYV/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAEHolQMLoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYiYAwugAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqLUDC6ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIyQMLQAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAEAAAEAAQEAQaj3BAtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGI+AQLYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6PgEC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQcj5BAtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGo+gQLYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiPsEC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQej7BAtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHI/AQLYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHwcYbkyQPN0qXNH0Yiq12VG4XTr0JwWJ7LugG+DraO0lDQg259+QNBh2NUZSDwGABBqP0EC2DDRXWG5MkNidWlhTJTIvMqLH6bMGYIiFAkEIh+jBsNomiQ2+JP8OQUOoVkFT9t5RQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYj+BAtgZdQZs1KVCAcTgwq1kl9pxo8iF9HMPOiX7incssquW6NNzqpd6pPjHOtm+7APIvIIRtblTK1q9rLsfEn8a6BCWJTTmSXUlUjP0OioQLqcG8GJ3qDlyxM4Lq9/hIja7w4RAEHo/gQLYNoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDtoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDgBByP8EC2A/5LwN9TzYgo8Bnd9TPoGigeFlPKXK8MaV/lCNUs8ldWuKefRQ7YVKve74bP2gHRdsxkLyCsMmN3D+ttGqwSp8ohRLuvsHQKApFDRmMnxR72si0k5lupUA3feGzOxw4wIAQaiABQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGIgQULYOhkinkbNvEwKlrOfqvduPP3dxXGOsqoFpsC/XT4L2rCbhxwYGa3NjZgYRskq6QbBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6IEFC2Bx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQciCBQtgOrqNeRs2++wsWoaRuN0AwY7aKyPxj8AOIUfK8cY8wdUEXHu/RyoiR1lfHOWE8RABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGogwULYK6q/P////VD/f9H7fL/tzJpnemiSTroB3q7MoMx86jsacD0oB6NFO8GAv8+JrMKBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiIQFC2DDRXWG5MkNidWlhTJTIvMqLH6bMGYIiFAkEIh+jBsNomiQ2+JP8OQUOoVkFT9t5RQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeiEBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIhQULYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQBBqIYFC2Cuqvz////1Q/3/R+3y/7cyaZ3pokk66Ad6uzKDMfOo7GnA9KAejRTvBgL/PiazCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYiHBQtg0ZpcpV1YLz6DgcGGPSGUQjI3YovIRCg4GD4QGf0qrZK58HysT055Hchegn38ktUL2g+jWqKnz3t8fpIqwd4X3PG+TmvYjQgvp9R02ocgytEdvM6WZlmiLdKH/bvtfisOAEHohwULYNGaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVC9GaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVCwBByIgFC2DaD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw7RmlylXVgvPoOBwYY9IZRCMjdii8hEKDgYPhAZ/SqtkrnwfKxPTnkdyF6CffyS1QsAQaiJBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGIigULYHHwcYbkyQPN0qXNH0Yiq12VG4XTr0JwWJ7LugG+DraO0lDQg259+QNBh2NUZSDwGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6IoFC2DoZIp5GzbxMCpazn6r3bjz93cVxjrKqBabAv10+C9qwm4ccGBmtzY2YGEbJKukGwUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQciLBQtg6GSKeRs28TAqWs5+q9248/d3FcY6yqgWmwL9dPgvasJuHHBgZrc2NmBhGySrpBsFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGojAULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiI0FC2Bx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeiNBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIjgULYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOhkinkbNvEwKlrOfqvduPP3dxXGOsqoFpsC/XT4L2rCbhxwYGa3NjZgYRskq6QbBQBBqI8FC2A6uo15Gzb77CxahpG43QDBjtorI/GPwA4hR8rxxjzB1QRce79HKiJHWV8c5YTxEAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYiQBQtgbMZC8grDJjdw/rbRqsEqfKIUS7r7B0CgKRQ0ZjJ8Ue9rItJOZbqVAN33hszscOMCP+S8DfU82IKPAZ3fUz6BooHhZTylyvDGlf5QjVLPJXVrinn0UO2FSr3u+Gz9oB0XAEHokAULYNoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDtoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDgBByJEFC2BG1uVMrWr2sux8SfxroEJYlNOZJdSVSM/Q6KhAupwbwYneoOXLEzgur3+EiNrvDhFl1BmzUpUIBxODCrWSX2nGjyIX0cw86JfuKdyyyq5bo03Oql3qk+Mc62b7sA8i8ggAQaiSBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGIkwULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6JMFC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQciUBQtgrqr8////9UP9/0ft8v+3Mmmd6aJJOugHersygzHzqOxpwPSgHo0U7wYC/z4mswoEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGolQULYK6q/P////VD/f9H7fL/tzJpnemiSTroB3q7MoMx86jsacD0oB6NFO8GAv8+JrMKBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiJYFC2Cuqvz////1Q/3/R+3y/7cyaZ3pokk66Ad6uzKDMfOo7GnA9KAejRTvBgL/PiazCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeiWBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIlwULYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHwcYbkyQPN0qXNH0Yiq12VG4XTr0JwWJ7LugG+DraO0lDQg259+QNBh2NUZSDwGABBqJgFC2DDRXWG5MkNidWlhTJTIvMqLH6bMGYIiFAkEIh+jBsNomiQ2+JP8OQUOoVkFT9t5RQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYiZBQtgRtblTK1q9rLsfEn8a6BCWJTTmSXUlUjP0OioQLqcG8GJ3qDlyxM4Lq9/hIja7w4RZdQZs1KVCAcTgwq1kl9pxo8iF9HMPOiX7incssquW6NNzqpd6pPjHOtm+7APIvIIAEHomQULYNGaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVC9GaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVCwBByJoFC2BsxkLyCsMmN3D+ttGqwSp8ohRLuvsHQKApFDRmMnxR72si0k5lupUA3feGzOxw4wI/5LwN9TzYgo8Bnd9TPoGigeFlPKXK8MaV/lCNUs8ldWuKefRQ7YVKve74bP2gHRcAQaibBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGInAULYOhkinkbNvEwKlrOfqvduPP3dxXGOsqoFpsC/XT4L2rCbhxwYGa3NjZgYRskq6QbBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6JwFC2Bx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQcidBQtgcfBxhuTJA83Spc0fRiKrXZUbhdOvQnBYnsu6Ab4Oto7SUNCDbn35A0GHY1RlIPAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGongULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiJ8FC2DoZIp5GzbxMCpazn6r3bjz93cVxjrKqBabAv10+C9qwm4ccGBmtzY2YGEbJKukGwUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeifBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIoAULYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQBBqKEFC2Cuqvz////1Q/3/R+3y/7cyaZ3pokk66Ad6uzKDMfOo7GnA9KAejRTvBgL/PiazCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYiiBQtg2g+jWqKnz3t8fpIqwd4X3PG+TmvYjQgvp9R02ocgytEdvM6WZlmiLdKH/bvtfisO0ZpcpV1YLz6DgcGGPSGUQjI3YovIRCg4GD4QGf0qrZK58HysT055Hchegn38ktULAEHoogULYNoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDtoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDgBByKMFC2DRmlylXVgvPoOBwYY9IZRCMjdii8hEKDgYPhAZ/SqtkrnwfKxPTnkdyF6CffyS1QvaD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw4AQaikBQswcfBxhuTJA83Spc0fRiKrXZUbhdOvQnBYnsu6Ab4Oto7SUNCDbn35A0GHY1RlIPAYAEHYpAULMOhkinkbNvEwKlrOfqvduPP3dxXGOsqoFpsC/XT4L2rCbhxwYGa3NjZgYRskq6QbBQBBiKUFCxBVVVVVAAAAAFbhVVUAjGw5AEHopwULYFRVAQAAAAQYAQCwOgUAUIVvJzwlfLU8YwK16zHs0SJuokzR8iZhkdOWZQAaV7j7F1dV/v////qh/v+jdvn/W5m0znTRJB30A71dmcGYeVT2NGB6UI9GincDgX8fk1kFAgBByKgFCzBx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAQfioBQtg0ZpcpV1YLz6DgcGGPSGUQjI3YovIRCg4GD4QGf0qrZK58HysT055Hchegn38ktUL0ZpcpV1YLz6DgcGGPSGUQjI3YovIRCg4GD4QGf0qrZK58HysT055Hchegn38ktULAEHYqQULCAAAAQAAAAHSAEGQvwULoAQQdfVdtbm8wCT7i+YwhvklifTV+8j7BkSgkSHRkYQvjmmAbwplcZ0+gKtMHQEvbCIZkUgXR3z2Z9eShdgbiD+vHRbS7p7kZxoYsq5peIy35bx7PwQUk1P2rhpw8jcl9nMqLWLpEMnxr9SpypI0MYNiGT2ovsI+Ly5zqi+wn+fHpOEbltd/Y0lsRXeB6NyK6AgXmTk2ej/eNTacdTF8nx2csCCoTsITnvp9VwOkR2nFP7fOXPzctsGkprxmcDaBvRt1J8YL76MYBBDg+alxm79JFwu2fQmRElEcjzDlxkWDScLXrZ2xI4htLJVW1e1MAJKV8T7APuxrTK3mTAQgrR8KjZQVzQkxXcXQCz8swEZPMzlXwDTrYlo7pXYWHUE4RXI0NEbQWht6EikBW8jFdKRhXpbvhiiO/I1DEp9F7y9TlhIEwc1pce5AKrJLt46mQJwLTWj0kIcRJR/A1MiTwmtZEhJhJ3+DZBDk3SS/EPt/B/MBK80LV5/Ek0Y3TPJbDBq2OsebNaUNNd2s1+STDWfSVrYabriZkNMNK46XSIEyGYgOazgU9BOxpJoNY+LcoAcYM3WTu+cnqW9GSa1oqkfj9OpvENbQChwPDzr/g+5yyFyDYKa5Q04Hmu7P6fXfqsCprd7HjI5pMCw/Nat2NwfRQzrcuheFhBepFI0/obpjc9AHRX0/e5fUkwHuiQocaknAqb3htyXI3LUd7gIAAAAAAEGwyQULQQAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAEAAAEA/wAB";
const pq = 712;
const pr = 3464;
const pG1gen = 42104;
const pG1zero = 42248;
const pG1b = 4776;
const pG2gen = 42392;
const pG2zero = 42680;
const pG2b = 16984;
const pOneT = 42968;
const prePSize = 288;
const preQSize = 20448;
const q = "4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559787";
const r = "52435875175126190479447740508185965837690552500527637822603658699938581184513";

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a MetaMask Snap / SES lockdown realm) throws at module load.
let curve_bls12381 = null;

async function buildBls12381(singleThread, plugins) {
    if ((!singleThread) && (curve_bls12381)) return curve_bls12381;

    const bls12381wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: static import (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES/Snap
        // realms alike. Also avoids recompiling the wasm on every load.
        // Regenerate the vendored module with `npm run gen-wasm`.
        bls12381wasm.code = base64ToUint8Array(code);
        bls12381wasm.pq = pq;
        bls12381wasm.pr = pr;
        bls12381wasm.pG1gen = pG1gen;
        bls12381wasm.pG1zero = pG1zero;
        bls12381wasm.pG1b = pG1b;
        bls12381wasm.pG2gen = pG2gen;
        bls12381wasm.pG2zero = pG2zero;
        bls12381wasm.pG2b = pG2b;
        bls12381wasm.pOneT = pOneT;
        bls12381wasm.prePSize = prePSize;
        bls12381wasm.preQSize = preQSize;
        bls12381wasm.n8q = 48;
        bls12381wasm.n8r = 32;
        bls12381wasm.q = q;
        bls12381wasm.r = r;
    } else {
        // Custom-plugin build path: builds the wasm at runtime, so it needs the
        // wasm toolchain. Kept as a dynamic import so wasmbuilder/wasmcurves stay
        // OPTIONAL dependencies (only required when a caller passes `plugins`).
        const { ModuleBuilder } = await import('wasmbuilder');
        const { buildBls12381: buildBls12381wasm } = await import('wasmcurves');

        const moduleBuilder = new ModuleBuilder();
        moduleBuilder.setMemory(25);
        buildBls12381wasm(moduleBuilder);

        if (plugins) plugins(moduleBuilder);

        bls12381wasm.code = moduleBuilder.build();
        bls12381wasm.pq = moduleBuilder.modules.f1m.pq;
        bls12381wasm.pr = moduleBuilder.modules.frm.pq;
        bls12381wasm.pG1gen = moduleBuilder.modules.bls12381.pG1gen;
        bls12381wasm.pG1zero = moduleBuilder.modules.bls12381.pG1zero;
        bls12381wasm.pG1b = moduleBuilder.modules.bls12381.pG1b;
        bls12381wasm.pG2gen = moduleBuilder.modules.bls12381.pG2gen;
        bls12381wasm.pG2zero = moduleBuilder.modules.bls12381.pG2zero;
        bls12381wasm.pG2b = moduleBuilder.modules.bls12381.pG2b;
        bls12381wasm.pOneT = moduleBuilder.modules.bls12381.pOneT;
        bls12381wasm.prePSize = moduleBuilder.modules.bls12381.prePSize;
        bls12381wasm.preQSize = moduleBuilder.modules.bls12381.preQSize;
        bls12381wasm.n8q = 48;
        bls12381wasm.n8r = 32;
        bls12381wasm.q = moduleBuilder.modules.bls12381.q;
        bls12381wasm.r = moduleBuilder.modules.bls12381.r;
    }


    const params = {
        name: "bls12381",
        wasm: bls12381wasm,
        q: e("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16),
        r: e("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16),
        n8q: 48,
        n8r: 32,
        cofactorG1: e("0x396c8c005555e1568c00aaab0000aaab", 16),
        cofactorG2: e("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function () {
        if (!params.singleThread) {
            curve_bls12381 = null;
            await this.tm.terminate();
        }
    };

    if (!singleThread) {
        curve_bls12381 = curve;
    }

    return curve;
}

const bls12381r = e("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
const bn128r = e("21888242871839275222246405745257275088548364400416034343698204186575808495617");

const bls12381q = e("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16);
const bn128q = e("21888242871839275222246405745257275088696311157297823662689037894645226208583");

async function getCurveFromR(r, singleThread, plugins) {
    let curve;
    if (eq(r, bn128r)) {
        curve = await buildBn128(singleThread, plugins);
    } else if (eq(r, bls12381r)) {
        curve = await buildBls12381(singleThread, plugins);
    } else {
        throw new Error(`Curve not supported: ${toString(r)}`);
    }
    return curve;
}

async function getCurveFromQ(q, singleThread, plugins) {
    let curve;
    if (eq(q, bn128q)) {
        curve = await buildBn128(singleThread, plugins);
    } else if (eq(q, bls12381q)) {
        curve = await buildBls12381(singleThread, plugins);
    } else {
        throw new Error(`Curve not supported: ${toString(q, 16)}`);
    }
    return curve;
}

async function getCurveFromName(name, singleThread, plugins) {
    let curve;
    const normName = normalizeName(name);
    if (["BN128", "BN254", "ALTBN128"].indexOf(normName) >= 0) {
        curve = await buildBn128(singleThread, plugins);
    } else if (["BLS12381"].indexOf(normName) >= 0) {
        curve = await buildBls12381(singleThread, plugins);
    } else {
        throw new Error(`Curve not supported: ${name}`);
    }
    return curve;

    function normalizeName(n) {
        return n.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
    }

}

const Scalar=_Scalar;
const utils = _utils;

exports.BigBuffer = BigBuffer;
exports.ChaCha = ChaCha;
exports.EC = EC;
exports.F1Field = ZqField;
exports.F2Field = F2Field;
exports.F3Field = F3Field;
exports.PolField = PolField;
exports.Scalar = Scalar;
exports.ZqField = ZqField;
exports.buildBls12381 = buildBls12381;
exports.buildBn128 = buildBn128;
exports.getCurveFromName = getCurveFromName;
exports.getCurveFromQ = getCurveFromQ;
exports.getCurveFromR = getCurveFromR;
exports.utils = utils;
