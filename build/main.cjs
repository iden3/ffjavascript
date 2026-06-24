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

// Computed lazily on first worker creation, NOT at module load: a SES
// hardened realm (which runs single-threaded) has no Blob/btoa/URL.createObjectURL, and
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

    // Force single-thread when no Worker is available. Covers SES hardened realms
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
// 'code' is base64 of the wasm-opt -Oz optimized wasm; the rest are
// pointer offsets / field moduli.
const code$1 = "AGFzbQEAAAABsQETYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgB39/f39/f38AYAN/f38Bf2AIf39/f39/f38AYAR/f39/AX9gCn9/f39/f39/f38AYAV/f39/fwF/YAd/f39/f39/AX9gCX9/f39/f39/fwF/YAt/f39/f39/f39/fwF/YAx/f39/fn9/f39/f38AYAt/f39+f39/f39/fwACDwEDZW52Bm1lbW9yeQIAGQOkAqICAAUCBQYGCQkBAAADAQIBAQAAAQAAAAACAgAFAQMEAQEDAAICAQEAAAEAAAAAAgIABQEDBAEBAwACAQAAAgICBQUAAAAGBgYAAAEBAQAAAQEBAAAAAAACAgEAAQAAAAABAQEBAQsACAQACAQDAwADAgAABAcHAQEHAAMMBAMCBQABAQABAQAAAwICBAMAAgICBQUAAAAGBgYAAAEBAQAAAQEBAAAAAAACAgEAAAAAAAEBAQEBAAgEAAgEAwMBAAMAAAQHBwEBBwEAAwAABAcHAQEHAQEEBAQEBAACAgUFAAEAAQEAAgYAAwIEAwACAgUFAAEBAAEBAAAAAAYAAwICBAMAAgAAAAADAwEAAAAAAAAAAAAAAAAAAAkNDg8QARESCgoHsiWrAghpbnRfY29weQAACGludF96ZXJvAAEHaW50X29uZQADCmludF9pc1plcm8AAgZpbnRfZXEABAdpbnRfZ3RlAAUHaW50X2FkZAAGB2ludF9zdWIABwdpbnRfbXVsAAgKaW50X3NxdWFyZQAJDWludF9zcXVhcmVPbGQACgdpbnRfZGl2AAsOaW50X2ludmVyc2VNb2QADAhmMW1fY29weQAACGYxbV96ZXJvAAEKZjFtX2lzWmVybwACBmYxbV9lcQAEB2YxbV9hZGQADgdmMW1fc3ViAA8HZjFtX25lZwAQDmYxbV9pc05lZ2F0aXZlABcJZjFtX2lzT25lAA0IZjFtX3NpZ24AGAtmMW1fbVJlZHVjdAARB2YxbV9tdWwAEgpmMW1fc3F1YXJlABMNZjFtX3NxdWFyZU9sZAAUEmYxbV9mcm9tTW9udGdvbWVyeQAWEGYxbV90b01vbnRnb21lcnkAFQtmMW1faW52ZXJzZQAZB2YxbV9vbmUAGghmMW1fbG9hZAAbD2YxbV90aW1lc1NjYWxhcgAcB2YxbV9leHAAIBBmMW1fYmF0Y2hJbnZlcnNlAB0IZjFtX3NxcnQAIQxmMW1faXNTcXVhcmUAIhVmMW1fYmF0Y2hUb01vbnRnb21lcnkAHhdmMW1fYmF0Y2hGcm9tTW9udGdvbWVyeQAfCGZybV9jb3B5AAAIZnJtX3plcm8AAQpmcm1faXNaZXJvAAIGZnJtX2VxAAQHZnJtX2FkZAAkB2ZybV9zdWIAJQdmcm1fbmVnACYOZnJtX2lzTmVnYXRpdmUALQlmcm1faXNPbmUAIwhmcm1fc2lnbgAuC2ZybV9tUmVkdWN0ACcHZnJtX211bAAoCmZybV9zcXVhcmUAKQ1mcm1fc3F1YXJlT2xkACoSZnJtX2Zyb21Nb250Z29tZXJ5ACwQZnJtX3RvTW9udGdvbWVyeQArC2ZybV9pbnZlcnNlAC8HZnJtX29uZQAwCGZybV9sb2FkADEPZnJtX3RpbWVzU2NhbGFyADIHZnJtX2V4cAA2EGZybV9iYXRjaEludmVyc2UAMwhmcm1fc3FydAA3DGZybV9pc1NxdWFyZQA4FWZybV9iYXRjaFRvTW9udGdvbWVyeQA0F2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5ADUGZnJfYWRkACQGZnJfc3ViACUGZnJfbmVnACYGZnJfbXVsADkJZnJfc3F1YXJlADoKZnJfaW52ZXJzZQA7DWZyX2lzTmVnYXRpdmUAPAdmcl9jb3B5AAAHZnJfemVybwABBmZyX29uZQAwCWZyX2lzWmVybwACBWZyX2VxAAQMZzFtX211bHRpZXhwAGcSZzFtX211bHRpZXhwX2NodW5rAGYSZzFtX211bHRpZXhwQWZmaW5lAGoYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAGkKZzFtX2lzWmVybwA+EGcxbV9pc1plcm9BZmZpbmUAPQZnMW1fZXEARgtnMW1fZXFNaXhlZABFDGcxbV9lcUFmZmluZQBECGcxbV9jb3B5AEIOZzFtX2NvcHlBZmZpbmUAQQhnMW1femVybwBADmcxbV96ZXJvQWZmaW5lAD8KZzFtX2RvdWJsZQBIEGcxbV9kb3VibGVBZmZpbmUARwdnMW1fYWRkAEsMZzFtX2FkZE1peGVkAEoNZzFtX2FkZEFmZmluZQBJB2cxbV9uZWcATQ1nMW1fbmVnQWZmaW5lAEwHZzFtX3N1YgBQDGcxbV9zdWJNaXhlZABPDWcxbV9zdWJBZmZpbmUAThJnMW1fZnJvbU1vbnRnb21lcnkAUhhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUAURBnMW1fdG9Nb250Z29tZXJ5AFQWZzFtX3RvTW9udGdvbWVyeUFmZmluZQBTD2cxbV90aW1lc1NjYWxhcgBrFWcxbV90aW1lc1NjYWxhckFmZmluZQBsDWcxbV9ub3JtYWxpemUAWQpnMW1fTEVNdG9VAFsKZzFtX0xFTXRvQwBcCmcxbV9VdG9MRU0AXQpnMW1fQ3RvTEVNAF4PZzFtX2JhdGNoTEVNdG9VAF8PZzFtX2JhdGNoTEVNdG9DAGAPZzFtX2JhdGNoVXRvTEVNAGEPZzFtX2JhdGNoQ3RvTEVNAGIMZzFtX3RvQWZmaW5lAFUOZzFtX3RvSmFjb2JpYW4AQxFnMW1fYmF0Y2hUb0FmZmluZQBYE2cxbV9iYXRjaFRvSmFjb2JpYW4AYwtnMW1faW5DdXJ2ZQBXEWcxbV9pbkN1cnZlQWZmaW5lAFYXZnJtX19yZXZlcnNlUGVybXV0YXRpb24AbQdmcm1fZmZ0AHAIZnJtX2lmZnQAcQpmcm1fcmF3ZmZ0AG4LZnJtX2ZmdEpvaW4Acg5mcm1fZmZ0Sm9pbkV4dABzEWZybV9mZnRKb2luRXh0SW52AHQKZnJtX2ZmdE1peAB1DGZybV9mZnRGaW5hbAB2HWZybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAHcIcG9sX3plcm8AeA9wb2xfY29uc3RydWN0TEMAeQxxYXBfYnVpbGRBQkMAegtxYXBfam9pbkFCQwB7DHFhcF9iYXRjaEFkZAB8CmYybV9pc1plcm8APQlmMm1faXNPbmUAfQhmMm1femVybwA/B2YybV9vbmUAfghmMm1fY29weQB/B2YybV9tdWwAgAEIZjJtX211bDEAgQEKZjJtX3NxdWFyZQCCAQdmMm1fYWRkAIMBB2YybV9zdWIAhAEHZjJtX25lZwCFAQhmMm1fc2lnbgCIAQ1mMm1fY29uanVnYXRlAEwSZjJtX2Zyb21Nb250Z29tZXJ5AFEQZjJtX3RvTW9udGdvbWVyeQBTBmYybV9lcQBEC2YybV9pbnZlcnNlAIYBB2YybV9leHAAiwEPZjJtX3RpbWVzU2NhbGFyAIcBEGYybV9iYXRjaEludmVyc2UAigEIZjJtX3NxcnQAjAEMZjJtX2lzU3F1YXJlAI0BDmYybV9pc05lZ2F0aXZlAIkBDGcybV9tdWx0aWV4cAC2ARJnMm1fbXVsdGlleHBfY2h1bmsAtQESZzJtX211bHRpZXhwQWZmaW5lALkBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawC4AQpnMm1faXNaZXJvAI8BEGcybV9pc1plcm9BZmZpbmUAjgEGZzJtX2VxAJcBC2cybV9lcU1peGVkAJYBDGcybV9lcUFmZmluZQCVAQhnMm1fY29weQCTAQ5nMm1fY29weUFmZmluZQCSAQhnMm1femVybwCRAQ5nMm1femVyb0FmZmluZQCQAQpnMm1fZG91YmxlAJkBEGcybV9kb3VibGVBZmZpbmUAmAEHZzJtX2FkZACcAQxnMm1fYWRkTWl4ZWQAmwENZzJtX2FkZEFmZmluZQCaAQdnMm1fbmVnAJ4BDWcybV9uZWdBZmZpbmUAnQEHZzJtX3N1YgChAQxnMm1fc3ViTWl4ZWQAoAENZzJtX3N1YkFmZmluZQCfARJnMm1fZnJvbU1vbnRnb21lcnkAowEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAKIBEGcybV90b01vbnRnb21lcnkApQEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQCkAQ9nMm1fdGltZXNTY2FsYXIAugEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lALsBDWcybV9ub3JtYWxpemUAqgEKZzJtX0xFTXRvVQCrAQpnMm1fTEVNdG9DAKwBCmcybV9VdG9MRU0ArQEKZzJtX0N0b0xFTQCuAQ9nMm1fYmF0Y2hMRU10b1UArwEPZzJtX2JhdGNoTEVNdG9DALABD2cybV9iYXRjaFV0b0xFTQCxAQ9nMm1fYmF0Y2hDdG9MRU0AsgEMZzJtX3RvQWZmaW5lAKYBDmcybV90b0phY29iaWFuAJQBEWcybV9iYXRjaFRvQWZmaW5lAKkBE2cybV9iYXRjaFRvSmFjb2JpYW4AswELZzJtX2luQ3VydmUAqAERZzJtX2luQ3VydmVBZmZpbmUApwELZzFtX3RpbWVzRnIAvAEXZzFtX19yZXZlcnNlUGVybXV0YXRpb24AvQEHZzFtX2ZmdAC/AQhnMW1faWZmdADAAQpnMW1fcmF3ZmZ0AL4BC2cxbV9mZnRKb2luAMEBDmcxbV9mZnRKb2luRXh0AMIBEWcxbV9mZnRKb2luRXh0SW52AMMBCmcxbV9mZnRNaXgAxAEMZzFtX2ZmdEZpbmFsAMUBHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAMYBC2cybV90aW1lc0ZyAMcBF2cybV9fcmV2ZXJzZVBlcm11dGF0aW9uAMgBB2cybV9mZnQAygEIZzJtX2lmZnQAywEKZzJtX3Jhd2ZmdADJAQtnMm1fZmZ0Sm9pbgDMAQ5nMm1fZmZ0Sm9pbkV4dADNARFnMm1fZmZ0Sm9pbkV4dEludgDOAQpnMm1fZmZ0TWl4AM8BDGcybV9mZnRGaW5hbADQAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDRARFnMW1fdGltZXNGckFmZmluZQDSARFnMm1fdGltZXNGckFmZmluZQDTARFmcm1fYmF0Y2hBcHBseUtleQDUARFnMW1fYmF0Y2hBcHBseUtleQDVARZnMW1fYmF0Y2hBcHBseUtleU1peGVkANYBEWcybV9iYXRjaEFwcGx5S2V5ANcBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA2AEKZjZtX2lzWmVybwDaAQlmNm1faXNPbmUA2wEIZjZtX3plcm8A3AEHZjZtX29uZQDdAQhmNm1fY29weQDeAQdmNm1fbXVsAN8BCmY2bV9zcXVhcmUA4AEHZjZtX2FkZADhAQdmNm1fc3ViAOIBB2Y2bV9uZWcA4wEIZjZtX3NpZ24A5AESZjZtX2Zyb21Nb250Z29tZXJ5AKMBEGY2bV90b01vbnRnb21lcnkApQEGZjZtX2VxAOUBC2Y2bV9pbnZlcnNlAOYBB2Y2bV9leHAA6gEPZjZtX3RpbWVzU2NhbGFyAOcBEGY2bV9iYXRjaEludmVyc2UA6QEOZjZtX2lzTmVnYXRpdmUA6AEKZnRtX2lzWmVybwDsAQlmdG1faXNPbmUA7QEIZnRtX3plcm8A7gEHZnRtX29uZQDvAQhmdG1fY29weQDwAQdmdG1fbXVsAPEBCGZ0bV9tdWwxAPIBCmZ0bV9zcXVhcmUA8wEHZnRtX2FkZAD0AQdmdG1fc3ViAPUBB2Z0bV9uZWcA9gEIZnRtX3NpZ24A/QENZnRtX2Nvbmp1Z2F0ZQD3ARJmdG1fZnJvbU1vbnRnb21lcnkA+QEQZnRtX3RvTW9udGdvbWVyeQD4AQZmdG1fZXEA+gELZnRtX2ludmVyc2UA+wEHZnRtX2V4cACAAg9mdG1fdGltZXNTY2FsYXIA/AEQZnRtX2JhdGNoSW52ZXJzZQD/AQhmdG1fc3FydACBAgxmdG1faXNTcXVhcmUAggIOZnRtX2lzTmVnYXRpdmUA/gEUYm4xMjhfX2Zyb2Jlbml1c01hcDAAigIUYm4xMjhfX2Zyb2Jlbml1c01hcDEAiwIUYm4xMjhfX2Zyb2Jlbml1c01hcDIAjAIUYm4xMjhfX2Zyb2Jlbml1c01hcDMAjQIUYm4xMjhfX2Zyb2Jlbml1c01hcDQAjgIUYm4xMjhfX2Zyb2Jlbml1c01hcDUAjwIUYm4xMjhfX2Zyb2Jlbml1c01hcDYAkAIUYm4xMjhfX2Zyb2Jlbml1c01hcDcAkQIUYm4xMjhfX2Zyb2Jlbml1c01hcDgAkgIUYm4xMjhfX2Zyb2Jlbml1c01hcDkAkwIQYm4xMjhfcGFpcmluZ0VxMQCYAhBibjEyOF9wYWlyaW5nRXEyAJkCEGJuMTI4X3BhaXJpbmdFcTMAmgIQYm4xMjhfcGFpcmluZ0VxNACbAhBibjEyOF9wYWlyaW5nRXE1AJwCDWJuMTI4X3BhaXJpbmcAnQIPYm4xMjhfcHJlcGFyZUcxAIQCD2JuMTI4X3ByZXBhcmVHMgCGAhBibjEyOF9taWxsZXJMb29wAIkCGWJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb24AlwIcYm4xMjhfZmluYWxFeHBvbmVudGlhdGlvbk9sZACUAg9ibjEyOF9fbXVsQnkwMjQAhwISYm4xMjhfX211bEJ5MDI0T2xkAIgCF2JuMTI4X19jeWNsb3RvbWljU3F1YXJlAJUCF2JuMTI4X19jeWNsb3RvbWljRXhwX3cwAJYCCuLTAqICKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAssACAAKQMYUAR+IAApAxBQBH4gACkDCFAEfiAAKQMABUIBCwVCAQsFQgELUAseACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxgLQAAgACkDGCABKQMYUQR/IAApAxAgASkDEFEEfyAAKQMIIAEpAwhRBH8gACkDACABKQMAUQVBAAsFQQALBUEACwtzACAAKQMYIAEpAxhUBH9BAAUgACkDGCABKQMYVgR/QQEFIAApAxAgASkDEFQEf0EABSAAKQMQIAEpAxBWBH9BAQUgACkDCCABKQMIVAR/QQAFIAApAwggASkDCFYEf0EBBSAAKQMAIAEpAwBaCwsLCwsLC8QBAQF+IAIgADUCACABNQIAfCIDPgIAIAIgADUCBCABNQIEfCADQiCIfCIDPgIEIAIgADUCCCABNQIIfCADQiCIfCIDPgIIIAIgADUCDCABNQIMfCADQiCIfCIDPgIMIAIgADUCECABNQIQfCADQiCIfCIDPgIQIAIgADUCFCABNQIUfCADQiCIfCIDPgIUIAIgADUCGCABNQIYfCADQiCIfCIDPgIYIAIgADUCHCABNQIcfCADQiCIfCIDPgIcIANCIIinC/wBAQF+IAIgADUCACABNQIAfSIDQv////8Pgz4CACACIAA1AgQgATUCBH0gA0Igh3wiA0L/////D4M+AgQgAiAANQIIIAE1Agh9IANCIId8IgNC/////w+DPgIIIAIgADUCDCABNQIMfSADQiCHfCIDQv////8Pgz4CDCACIAA1AhAgATUCEH0gA0Igh3wiA0L/////D4M+AhAgAiAANQIUIAE1AhR9IANCIId8IgNC/////w+DPgIUIAIgADUCGCABNQIYfSADQiCHfCIDQv////8Pgz4CGCACIAA1AhwgATUCHH0gA0Igh3wiA0L/////D4M+AhwgA0Igh6cL3QwBF34gADUCACIDIAE1AgAiB34iBEIgiCEGIAIgBD4CACAANQIEIgQgB34gAyABNQIEIgV+IAZC/////w+DfCIIQv////8Pg3wiD0IgiCAIQiCIIAZCIIh8fCELIAIgDz4CBCAANQIIIgYgB34gBCAFfiADIAE1AggiCH4gC0L/////D4N8Ig9C/////w+DfCIMQv////8Pg3wiEEIgiCAPQiCIIAtCIIh8IAxCIIh8fCEMIAIgED4CCCAANQIMIgsgB34gBSAGfiAEIAh+IAMgATUCDCIPfiAMQv////8Pg3wiEEL/////D4N8Ig1C/////w+DfCIRQv////8Pg3wiCUIgiCAQQiCIIAxCIIh8IA1CIIh8IBFCIIh8fCENIAIgCT4CDCAANQIQIgwgB34gBSALfiAGIAh+IAQgD34gAyABNQIQIhB+IA1C/////w+DfCIRQv////8Pg3wiCUL/////D4N8IhJC/////w+DfCIKQv////8Pg3wiDkIgiCARQiCIIA1CIIh8IAlCIIh8IBJCIIh8IApCIIh8fCEJIAIgDj4CECAANQIUIg0gB34gBSAMfiAIIAt+IAYgD34gBCAQfiADIAE1AhQiEX4gCUL/////D4N8IhJC/////w+DfCIKQv////8Pg3wiDkL/////D4N8IhNC/////w+DfCIUQv////8Pg3wiFUIgiCASQiCIIAlCIIh8IApCIIh8IA5CIIh8IBNCIIh8IBRCIIh8fCEKIAIgFT4CFCAANQIYIgkgB34gBSANfiAIIAx+IAsgD34gBiAQfiAEIBF+IAMgATUCGCISfiAKQv////8Pg3wiDkL/////D4N8IhNC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhZC/////w+DfCIXQv////8Pg3wiGEIgiCAOQiCIIApCIIh8IBNCIIh8IBRCIIh8IBVCIIh8IBZCIIh8IBdCIIh8fCEOIAIgGD4CGCAHIAA1AhwiB34gBSAJfiAIIA1+IAwgD34gCyAQfiAGIBF+IAQgEn4gAyABNQIcIgp+IA5C/////w+DfCIDQv////8Pg3wiE0L/////D4N8IhRC/////w+DfCIVQv////8Pg3wiFkL/////D4N8IhdC/////w+DfCIYQv////8Pg3wiGUIgiCADQiCIIA5CIIh8IBNCIIh8IBRCIIh8IBVCIIh8IBZCIIh8IBdCIIh8IBhCIIh8fCEDIAIgGT4CHCAFIAd+IAggCX4gDSAPfiAMIBB+IAsgEX4gBiASfiAEIAp+IANC/////w+DfCIEQv////8Pg3wiBUL/////D4N8Ig5C/////w+DfCITQv////8Pg3wiFEL/////D4N8IhVC/////w+DfCIWQiCIIARCIIggA0IgiHwgBUIgiHwgDkIgiHwgE0IgiHwgFEIgiHwgFUIgiHx8IQMgAiAWPgIgIAcgCH4gCSAPfiANIBB+IAwgEX4gCyASfiAGIAp+IANC/////w+DfCIEQv////8Pg3wiBUL/////D4N8IgZC/////w+DfCIIQv////8Pg3wiDkL/////D4N8IhNCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAIQiCIfCAOQiCIfHwhAyACIBM+AiQgByAPfiAJIBB+IA0gEX4gDCASfiAKIAt+IANC/////w+DfCIEQv////8Pg3wiBUL/////D4N8IgZC/////w+DfCIIQv////8Pg3wiC0IgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8IAhCIIh8fCEDIAIgCz4CKCAHIBB+IAkgEX4gDSASfiAKIAx+IANC/////w+DfCIEQv////8Pg3wiBUL/////D4N8IgZC/////w+DfCIIQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHx8IQMgAiAIPgIsIAcgEX4gCSASfiAKIA1+IANC/////w+DfCIEQv////8Pg3wiBUL/////D4N8IgZCIIggBEIgiCADQiCIfCAFQiCIfHwhAyACIAY+AjAgByASfiAJIAp+IANC/////w+DfCIEQv////8Pg3wiBUIgiCAEQiCIIANCIIh8fCEDIAIgBT4CNCAHIAp+IANC/////w+DfCIHQiCIIANCIIh8IQMgAiAHPgI4IAIgAz4CPAusCwETfiABIAA1AgAiBCAEfiICPgIAIAEgADUCBCIDIAR+IgpC/////w+DQgGGIgZC/////w+DIAJCIIgiB0L/////D4N8Igg+AgQgASADIAN+IAA1AggiAiAEfiIFQv////8Pg0IBhiIJQv////8Pg3wiC0L/////D4MgCkIgiEIBhiAGQiCIfCAIQiCIfCAHQiCIfCIGQv////8Pg3wiBz4CCCABIAIgA34gADUCDCIKIAR+IghC/////w+DfCIMQv////8Pg0IBhiINQv////8PgyAFQiCIQgGGIAlCIIh8IAtCIIh8IAdCIIh8IAZCIIh8IgdC/////w+DfCIFPgIMIAEgAiACfiADIAp+IAA1AhAiBiAEfiIJQv////8Pg3wiC0L/////D4NCAYYiDkL/////D4N8Ig9C/////w+DIAxCIIggCEIgiHxCAYYgDUIgiHwgBUIgiHwgB0IgiHwiCEL/////D4N8IgU+AhAgASACIAp+IAMgBn4gADUCFCIHIAR+IgxC/////w+DfCINQv////8Pg3wiEEL/////D4NCAYYiEUL/////D4MgC0IgiCAJQiCIfEIBhiAOQiCIfCAPQiCIfCAFQiCIfCAIQiCIfCIFQv////8Pg3wiCT4CFCABIAogCn4gAiAGfiADIAd+IAA1AhgiCCAEfiILQv////8Pg3wiDkL/////D4N8Ig9C/////w+DQgGGIhJC/////w+DfCITQv////8PgyANQiCIIAxCIIh8IBBCIIh8QgGGIBFCIIh8IAlCIIh8IAVCIIh8IgVC/////w+DfCIJPgIYIAEgBiAKfiACIAd+IAMgCH4gBCAANQIcIgR+IgxC/////w+DfCINQv////8Pg3wiEEL/////D4N8IhFC/////w+DQgGGIhRC/////w+DIA5CIIggC0IgiHwgD0IgiHxCAYYgEkIgiHwgE0IgiHwgCUIgiHwgBUIgiHwiBUL/////D4N8Igk+AhwgASAGIAZ+IAcgCn4gAiAIfiADIAR+IgNC/////w+DfCILQv////8Pg3wiDkL/////D4NCAYYiD0L/////D4N8IhJC/////w+DIA1CIIggDEIgiHwgEEIgiHwgEUIgiHxCAYYgFEIgiHwgCUIgiHwgBUIgiHwiBUL/////D4N8Igk+AiAgASAGIAd+IAggCn4gAiAEfiICQv////8Pg3wiDEL/////D4N8Ig1C/////w+DQgGGIhBC/////w+DIAtCIIggA0IgiHwgDkIgiHxCAYYgD0IgiHwgEkIgiHwgCUIgiHwgBUIgiHwiA0L/////D4N8IgU+AiQgASAHIAd+IAYgCH4gBCAKfiIKQv////8Pg3wiCUL/////D4NCAYYiC0L/////D4N8Ig5C/////w+DIAxCIIggAkIgiHwgDUIgiHxCAYYgEEIgiHwgBUIgiHwgA0IgiHwiA0L/////D4N8IgI+AiggASAHIAh+IAQgBn4iBkL/////D4N8IgVC/////w+DQgGGIgxC/////w+DIAlCIIggCkIgiHxCAYYgC0IgiHwgDkIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AiwgASAIIAh+IAQgB34iCkL/////D4NCAYYiB0L/////D4N8IglC/////w+DIAVCIIggBkIgiHxCAYYgDEIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AjAgASAEIAh+IgZC/////w+DQgGGIghC/////w+DIApCIIhCAYYgB0IgiHwgCUIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AjQgASAEIAR+IgRC/////w+DIAZCIIhCAYYgCEIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AjggASACQiCIIARCIIh8IANCIIh8PgI8CwoAIAAgACABEAgL4wMCA34BfyAAIANB6AAgAxsiBxAAIAFBKBAAIAJByAAgAhsiAxABQYgBEAFBHyEAQR8hAQNAIAFBKGotAAAgAUEDRnJFBEAgAUEBayEBDAELCyABQSVqNQAAQgF8IgZCAVEEQEIAQgCAGgsDQAJAA0AgACAHai0AACAAQQdGckUEQCAAQQFrIQAMAQsLIAAgB2pBB2spAAAgBoAhBCAAIAFrQQRrIQIDQCAEQoCAgIBwg1AgAkEATnFFBEAgBEIIiCEEIAJBAWohAgwBCwsgBFAEQCAHQSgQBUUNAUIBIQRBACECC0GoAUEoNQAAIAR+IgU+AABBrAFBLDUAACAEfiAFQiCIfCIFPgAAQbABQTA1AAAgBH4gBUIgiHwiBT4AAEG0AUE0NQAAIAR+IAVCIIh8IgU+AABBuAFBODUAACAEfiAFQiCIfCIFPgAAQbwBQTw1AAAgBH4gBUIgiHwiBT4AAEHAAUHAADUAACAEfiAFQiCIfCIFPgAAQcQBQcQANQAAIAR+IAVCIIh8PgAAIAdBqAEgAmsgBxAHGiACIANqIgIgAjUAACAEfCIEPgAAIARCIIghBANAIARQRQRAIAJBBGoiAjUAACAEfCEEIAIgBD4AACAEQiCIIQQMAQsLDAELCwv/AQEJf0HIASEDQcgBEAFB6AEhCCABQegBEABBiAIhCUGIAhADQagCIQYgAEGoAhAAQegCIQpByAMhBANAIAYQAkUEQCAIIAZByAIgChALQcgCIAlBiAMQCCAHBH8gBQR/QYgDIAMQBQR/QYgDIAMgBBAHGkEABSADQYgDIAQQBxpBAQsFQYgDIAMgBBAGGkEBCwUgBQR/QYgDIAMgBBAGGkEABSADQYgDEAUEfyADQYgDIAQQBxpBAAVBiAMgAyAEEAcaQQELCwsgAyAJIQMgBCEJIQQgBSEHIQUgCCAGIQggCiEGIQoMAQsLIAcEQCABIAMgAhAHGgUgAyACEAALCwkAIABBqAQQBAssACAAIAEgAhAGBEAgAkHoAyACEAcaBSACQegDEAUEQCACQegDIAIQBxoLCwsXACAAIAEgAhAHBEAgAkHoAyACEAYaCwsLAEHIBCAAIAEQDwvQDwECfiAAIAA1AgAgADUCAEKJx5mkDn5C/////w+DIgNB6AM1AgB+fCICPgIAIAAgADUCBCACQiCIfEHsAzUCACADfnwiAj4CBCAAIAA1AgggAkIgiHxB8AM1AgAgA358IgI+AgggACAANQIMIAJCIIh8QfQDNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEH4AzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB/AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QYAENQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGEBDUCACADfnwiAz4CHEGIBiADQiCIPgIAIAAgADUCBCAANQIEQonHmaQOfkL/////D4MiA0HoAzUCAH58IgI+AgQgACAANQIIIAJCIIh8QewDNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEHwAzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB9AM1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfgDNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH8AzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBgAQ1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYQENQIAIAN+fCIDPgIgQYwGIANCIIg+AgAgACAANQIIIAA1AghCiceZpA5+Qv////8PgyIDQegDNQIAfnwiAj4CCCAAIAA1AgwgAkIgiHxB7AM1AgAgA358IgI+AgwgACAANQIQIAJCIIh8QfADNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEH0AzUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB+AM1AgAgA358IgI+AhggACAANQIcIAJCIIh8QfwDNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGABDUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBhAQ1AgAgA358IgM+AiRBkAYgA0IgiD4CACAAIAA1AgwgADUCDEKJx5mkDn5C/////w+DIgNB6AM1AgB+fCICPgIMIAAgADUCECACQiCIfEHsAzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB8AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfQDNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEH4AzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB/AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QYAENQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGEBDUCACADfnwiAz4CKEGUBiADQiCIPgIAIAAgADUCECAANQIQQonHmaQOfkL/////D4MiA0HoAzUCAH58IgI+AhAgACAANQIUIAJCIIh8QewDNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHwAzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB9AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfgDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH8AzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBgAQ1AgAgA358IgI+AiggACAANQIsIAJCIIh8QYQENQIAIAN+fCIDPgIsQZgGIANCIIg+AgAgACAANQIUIAA1AhRCiceZpA5+Qv////8PgyIDQegDNQIAfnwiAj4CFCAAIAA1AhggAkIgiHxB7AM1AgAgA358IgI+AhggACAANQIcIAJCIIh8QfADNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH0AzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB+AM1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfwDNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGABDUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBhAQ1AgAgA358IgM+AjBBnAYgA0IgiD4CACAAIAA1AhggADUCGEKJx5mkDn5C/////w+DIgNB6AM1AgB+fCICPgIYIAAgADUCHCACQiCIfEHsAzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB8AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfQDNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH4AzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB/AM1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QYAENQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEGEBDUCACADfnwiAz4CNEGgBiADQiCIPgIAIAAgADUCHCAANQIcQonHmaQOfkL/////D4MiA0HoAzUCAH58IgI+AhwgACAANQIgIAJCIIh8QewDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHwAzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB9AM1AgAgA358IgI+AiggACAANQIsIAJCIIh8QfgDNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEH8AzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBgAQ1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QYQENQIAIAN+fCIDPgI4QaQGIANCIIg+AgBBiAYgAEEgaiABEA4LKQAgACABIAJB6ANCiceZpA5BhARBgARB/ANB+ANB9ANB8ANB7AMQngILJwAgACABQegDQonHmaQOQYQEQYAEQfwDQfgDQfQDQfADQewDEJ8CCwoAIAAgACABEBILCwAgAEGIBCABEBILFQAgAEGIChAAQagKEAFBiAogARARCxEAIABByAoQFkHICkGIBRAFCyMAIAAQAgRAQQAPCyAAQegKEBZB6ApBiAUQBQRAQX8PC0EBCxcAIAAgARAWIAFB6AMgARAMIAEgARAVCwkAQagEIAAQAAu8AQECfyACEAFBICEDA0AgASADTwRAIANBIEYEQEGICxAaBUGIC0GIBEGICxASCyAAQYgLQagLEBIgAkGoCyACEA4gAEEgaiEAIANBIGohAwwBCwsgAUEfcSIERQRADwtBqAsQAUEAIQEDQCABIARGRQRAIAEgAC0AADoAqAsgAEEBaiEAIAFBAWohAQwBCwsgA0EgRgRAQYgLEBoFQYgLQYgEQYgLEBILQagLQYgLQagLEBIgAkGoCyACEA4LHAAgASACQcgLEBtByAtByAsQFSAAQcgLIAMQEgvgAQECf0EAQQAoAgAiBSACQQFqQQV0ajYCACAFEBogBUEgaiEFA0AgAiAGRwRAIAAQAgRAIAVBIGsgBRAABSAAIAVBIGsgBRASCyAAIAFqIQAgBUEgaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQSBrIgUgBRAZA0AgBgRAIAAQAgRAIAUgBUEgaxAAIAIQAQUgBUEgayIDQegLEAAgBSAAIAMQEiAFQegLIAIQEgsgACABayEAIAIgBGshAiAFQSBrIQUgBkEBayEGDAELC0EAIAU2AgALLQEBfwNAIAEgA0ZFBEAgACACEBUgAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhAWIABBIGohACACQSBqIQIgA0EBaiEDDAELCwuXAgAgAkUEQCADEBoPCyAAQYgMEAAgAxAaA0AgAkEBayICIAFqLQAAIQAgAyADEBMgAEGAAU8EQCADQYgMIAMQEiAAQYABayEACyADIAMQEyAAQcAATwRAIANBiAwgAxASIABBQGohAAsgAyADEBMgAEEgTwRAIANBiAwgAxASIABBIGshAAsgAyADEBMgAEEQTwRAIANBiAwgAxASIABBEGshAAsgAyADEBMgAEEITwRAIANBiAwgAxASIABBCGshAAsgAyADEBMgAEEETwRAIANBiAwgAxASIABBBGshAAsgAyADEBMgAEECTwRAIANBiAwgAxASIABBAmshAAsgAyADEBMgAARAIANBiAwgAxASCyACDQALC9UBAQF/IAAQAgRAIAEQAQ8LQQEhAkHIBUGoDBAAIABBqAVBIEHIDBAgIABB6AVBIEHoDBAgA0BByAxBqAQQBEUEQEHIDEGIDRATQQEhAANAQYgNQagEEARFBEBBiA1BiA0QEyAAQQFqIQAMAQsLQagMQagNEAAgAiAAa0EBayECA0AgAgRAQagNQagNEBMgAkEBayECDAELCyAAIQJBqA1BqAwQE0HIDEGoDEHIDBASQegMQagNQegMEBIMAQsLQegMEBcEQEHoDCABEBAFQegMIAEQAAsLIAAgABACBEBBAQ8LIABB6ARBIEHIDRAgQcgNQagEEAQLCQAgAEGoDhAECywAIAAgASACEAYEQCACQegNIAIQBxoFIAJB6A0QBQRAIAJB6A0gAhAHGgsLCxcAIAAgASACEAcEQCACQegNIAIQBhoLCwsAQcgOIAAgARAlC9APAQJ+IAAgADUCACAANQIAQv////8OfkL/////D4MiA0HoDTUCAH58IgI+AgAgACAANQIEIAJCIIh8QewNNQIAIAN+fCICPgIEIAAgADUCCCACQiCIfEHwDTUCACADfnwiAj4CCCAAIAA1AgwgAkIgiHxB9A01AgAgA358IgI+AgwgACAANQIQIAJCIIh8QfgNNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEH8DTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxBgA41AgAgA358IgI+AhggACAANQIcIAJCIIh8QYQONQIAIAN+fCIDPgIcQYgQIANCIIg+AgAgACAANQIEIAA1AgRC/////w5+Qv////8PgyIDQegNNQIAfnwiAj4CBCAAIAA1AgggAkIgiHxB7A01AgAgA358IgI+AgggACAANQIMIAJCIIh8QfANNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEH0DTUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB+A01AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfwNNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGADjUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBhA41AgAgA358IgM+AiBBjBAgA0IgiD4CACAAIAA1AgggADUCCEL/////Dn5C/////w+DIgNB6A01AgB+fCICPgIIIAAgADUCDCACQiCIfEHsDTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB8A01AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfQNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH4DTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB/A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYAONQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGEDjUCACADfnwiAz4CJEGQECADQiCIPgIAIAAgADUCDCAANQIMQv////8OfkL/////D4MiA0HoDTUCAH58IgI+AgwgACAANQIQIAJCIIh8QewNNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEHwDTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB9A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfgNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH8DTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBgA41AgAgA358IgI+AiQgACAANQIoIAJCIIh8QYQONQIAIAN+fCIDPgIoQZQQIANCIIg+AgAgACAANQIQIAA1AhBC/////w5+Qv////8PgyIDQegNNQIAfnwiAj4CECAAIAA1AhQgAkIgiHxB7A01AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfANNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEH0DTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB+A01AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfwNNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGADjUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxBhA41AgAgA358IgM+AixBmBAgA0IgiD4CACAAIAA1AhQgADUCFEL/////Dn5C/////w+DIgNB6A01AgB+fCICPgIUIAAgADUCGCACQiCIfEHsDTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB8A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfQNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH4DTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB/A01AgAgA358IgI+AiggACAANQIsIAJCIIh8QYAONQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGEDjUCACADfnwiAz4CMEGcECADQiCIPgIAIAAgADUCGCAANQIYQv////8OfkL/////D4MiA0HoDTUCAH58IgI+AhggACAANQIcIAJCIIh8QewNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEHwDTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB9A01AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfgNNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEH8DTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBgA41AgAgA358IgI+AjAgACAANQI0IAJCIIh8QYQONQIAIAN+fCIDPgI0QaAQIANCIIg+AgAgACAANQIcIAA1AhxC/////w5+Qv////8PgyIDQegNNQIAfnwiAj4CHCAAIAA1AiAgAkIgiHxB7A01AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfANNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH0DTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB+A01AgAgA358IgI+AiwgACAANQIwIAJCIIh8QfwNNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEGADjUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxBhA41AgAgA358IgM+AjhBpBAgA0IgiD4CAEGIECAAQSBqIAEQJAspACAAIAEgAkHoDUL/////DkGEDkGADkH8DUH4DUH0DUHwDUHsDRCeAgsnACAAIAFB6A1C/////w5BhA5BgA5B/A1B+A1B9A1B8A1B7A0QnwILCgAgACAAIAEQKAsLACAAQYgOIAEQKAsVACAAQYgUEABBqBQQAUGIFCABECcLEQAgAEHIFBAsQcgUQYgPEAULIwAgABACBEBBAA8LIABB6BQQLEHoFEGIDxAFBEBBfw8LQQELFwAgACABECwgAUHoDSABEAwgASABECsLCQBBqA4gABAAC7wBAQJ/IAIQAUEgIQMDQCABIANPBEAgA0EgRgRAQYgVEDAFQYgVQYgOQYgVECgLIABBiBVBqBUQKCACQagVIAIQJCAAQSBqIQAgA0EgaiEDDAELCyABQR9xIgRFBEAPC0GoFRABQQAhAQNAIAEgBEZFBEAgASAALQAAOgCoFSAAQQFqIQAgAUEBaiEBDAELCyADQSBGBEBBiBUQMAVBiBVBiA5BiBUQKAtBqBVBiBVBqBUQKCACQagVIAIQJAscACABIAJByBUQMUHIFUHIFRArIABByBUgAxAoC+ABAQJ/QQBBACgCACIFIAJBAWpBBXRqNgIAIAUQMCAFQSBqIQUDQCACIAZHBEAgABACBEAgBUEgayAFEAAFIAAgBUEgayAFECgLIAAgAWohACAFQSBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBIGsiBSAFEC8DQCAGBEAgABACBEAgBSAFQSBrEAAgAhABBSAFQSBrIgNB6BUQACAFIAAgAxAoIAVB6BUgAhAoCyAAIAFrIQAgAiAEayECIAVBIGshBSAGQQFrIQYMAQsLQQAgBTYCAAstAQF/A0AgASADRkUEQCAAIAIQKyAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLLQEBfwNAIAEgA0ZFBEAgACACECwgAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLC5cCACACRQRAIAMQMA8LIABBiBYQACADEDADQCACQQFrIgIgAWotAAAhACADIAMQKSAAQYABTwRAIANBiBYgAxAoIABBgAFrIQALIAMgAxApIABBwABPBEAgA0GIFiADECggAEFAaiEACyADIAMQKSAAQSBPBEAgA0GIFiADECggAEEgayEACyADIAMQKSAAQRBPBEAgA0GIFiADECggAEEQayEACyADIAMQKSAAQQhPBEAgA0GIFiADECggAEEIayEACyADIAMQKSAAQQRPBEAgA0GIFiADECggAEEEayEACyADIAMQKSAAQQJPBEAgA0GIFiADECggAEECayEACyADIAMQKSAABEAgA0GIFiADECgLIAINAAsL1QEBAX8gABACBEAgARABDwtBHCECQcgPQagWEAAgAEGoD0EgQcgWEDYgAEHoD0EgQegWEDYDQEHIFkGoDhAERQRAQcgWQYgXEClBASEAA0BBiBdBqA4QBEUEQEGIF0GIFxApIABBAWohAAwBCwtBqBZBqBcQACACIABrQQFrIQIDQCACBEBBqBdBqBcQKSACQQFrIQIMAQsLIAAhAkGoF0GoFhApQcgWQagWQcgWEChB6BZBqBdB6BYQKAwBCwtB6BYQLQRAQegWIAEQJgVB6BYgARAACwsgACAAEAIEQEEBDwsgAEHoDkEgQcgXEDZByBdBqA4QBAsVACAAIAFB6BcQKEHoF0GIDiACECgLCgAgACAAIAEQOQsLACAAQegNIAEQDAsJACAAQYgPEAULDgAgABACIABBIGoQAnELCQAgAEFAaxACCw0AIAAQASAAQSBqEAELFAAgABABIABBIGoQGiAAQUBrEAELUgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOAt6ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWAsnACAAED0EQCABEEAFIAFBQGsQGiAAQSBqIAFBIGoQACAAIAEQAAsLFQAgACABEAQgAEEgaiABQSBqEARxC3EBAX8gABA+BEAgARA9DwsgARA9BEBBAA8LIABBQGsiAhANBEAgACABEEQPCyACQagYEBMgAUGoGEHIGBASIAJBqBhB6BgQEiABQSBqQegYQYgZEBIgAEHIGBAEBEAgAEEgakGIGRAEBEBBAQ8LC0EAC6sBAQJ/IAAQPgRAIAEQPg8LIAEQPgRAQQAPCyAAQUBrIgIQDQRAIAEgABBFDwsgAUFAayIDEA0EQCAAIAEQRQ8LIAJBqBkQEyADQcgZEBMgAEHIGUHoGRASIAFBqBlBiBoQEiACQagZQagaEBIgA0HIGUHIGhASIABBIGpByBpB6BoQEiABQSBqQagaQYgbEBJB6BlBiBoQBARAQegaQYgbEAQEQEEBDwsLQQAL2wEBAX8gABA9BEAgACABEEMPCyAAQagbEBMgAEEgaiICQcgbEBNByBtB6BsQEyAAQcgbQYgcEA5BiBxBiBwQE0GIHEGoG0GIHBAPQYgcQegbQYgcEA9BiBxBiBxBiBwQDkGoG0GoG0GoHBAOQagcQagbQagcEA4gAiACIAFBQGsQDkGoHCABEBMgAUGIHCABEA8gAUGIHCABEA9B6BtB6BtByBwQDkHIHEHIHEHIHBAOQcgcQcgcQcgcEA5BiBwgASABQSBqIgAQDyAAQagcIAAQEiAAQcgcIAAQDwv8AQEBfyAAED4EQCAAIAEQQg8LIABBQGsQDQRAIAAgARBHDwsgAEHoHBATIABBIGoiAkGIHRATQYgdQagdEBMgAEGIHUHIHRAOQcgdQcgdEBNByB1B6BxByB0QD0HIHUGoHUHIHRAPQcgdQcgdQcgdEA5B6BxB6BxB6B0QDkHoHUHoHEHoHRAOQegdQYgeEBMgAiAAQUBrQageEBJByB1ByB0gARAOQYgeIAEgARAPQagdQagdQcgeEA5ByB5ByB5ByB4QDkHIHkHIHkHIHhAOQcgdIAEgAUEgaiIAEA8gAEHoHSAAEBIgAEHIHiAAEA9BqB5BqB4gAUFAaxAOC4sCACAAED0EQCABIAIQQSACQUBrEBoPCyABED0EQCAAIAIQQSACQUBrEBoPCyAAIAEQBARAIABBIGogAUEgahAEBEAgASACEEcPCwsgASAAQegeEA8gAUEgaiAAQSBqIgFBqB8QD0HoHkGIHxATQYgfQYgfQcgfEA5ByB9ByB9ByB8QDkHoHkHIH0HoHxASQagfQagfQYggEA4gAEHIH0HIIBASQYggQaggEBNByCBByCBB6CAQDkGoIEHoHyACEA8gAkHoICACEA8gAUHoH0GIIRASQYghQYghQYghEA5ByCAgAiACQSBqIgAQDyAAQYggIAAQEiAAQYghIAAQD0HoHkHoHiACQUBrEA4L2gIBAX8gABA+BEAgASACEEEgAkFAaxAaDwsgARA9BEAgACACEEIPCyAAQUBrIgMQDQRAIAAgASACEEkPCyADQaghEBMgAUGoIUHIIRASIANBqCFB6CEQEiABQSBqQeghQYgiEBIgAEHIIRAEBEAgAEEgakGIIhAEBEAgASACEEcPCwtByCEgAEGoIhAPQYgiIABBIGoiAUHoIhAPQagiQcgiEBNByCJByCJBiCMQDkGII0GII0GIIxAOQagiQYgjQagjEBJB6CJB6CJByCMQDiAAQYgjQYgkEBJByCNB6CMQE0GIJEGIJEGoJBAOQegjQagjIAIQDyACQagkIAIQDyABQagjQcgkEBJByCRByCRByCQQDkGIJCACIAJBIGoiABAPIABByCMgABASIABByCQgABAPIANBqCIgAkFAayIAEA4gACAAEBMgAEGoISAAEA8gAEHIIiAAEA8LiwMBAn8gABA+BEAgASACEEIPCyABED4EQCAAIAIQQg8LIABBQGsiAxANBEAgASAAIAIQSg8LIAFBQGsiBBANBEAgACABIAIQSg8LIANB6CQQEyAEQYglEBMgAEGIJUGoJRASIAFB6CRByCUQEiADQegkQeglEBIgBEGIJUGIJhASIABBIGpBiCZBqCYQEiABQSBqQeglQcgmEBJBqCVByCUQBARAQagmQcgmEAQEQCAAIAIQSA8LC0HIJUGoJUHoJhAPQcgmQagmQYgnEA9B6CZB6CZBqCcQDkGoJ0GoJxATQegmQagnQcgnEBJBiCdBiCdB6CcQDkGoJUGoJ0GoKBASQegnQYgoEBNBqChBqChByCgQDkGIKEHIJyACEA8gAkHIKCACEA9BqCZByCdB6CgQEkHoKEHoKEHoKBAOQagoIAIgAkEgaiIAEA8gAEHoJyAAEBIgAEHoKCAAEA8gAyAEIAJBQGsiABAOIAAgABATIABB6CQgABAPIABBiCUgABAPIABB6CYgABASCxQAIAAgARAAIABBIGogAUEgahAQCyAAIAAgARAAIABBIGogAUEgahAQIABBQGsgAUFAaxAACxIAIAFBiCkQTCAAQYgpIAIQSQsSACABQegpEEwgAEHoKSACEEoLEgAgAUHIKhBNIABByCogAhBLCxQAIAAgARAWIABBIGogAUEgahAWCyAAIAAgARAWIABBIGogAUEgahAWIABBQGsgAUFAaxAWCxQAIAAgARAVIABBIGogAUEgahAVCyAAIAAgARAVIABBIGogAUEgahAVIABBQGsgAUFAaxAVC0oAIAAQPgRAIAEQASABQSBqEAEFIABBQGtBqCsQGUGoK0HIKxATQagrQcgrQegrEBIgAEHIKyABEBIgAEEgakHoKyABQSBqEBILCzAAIABBIGpBiCwQEyAAQagsEBMgAEGoLEGoLBASQagsQYgYQagsEA5BiCxBqCwQBAsOACAAQcgsEFVByCwQVguUAQEDf0EAQQAoAgAiBCABQQV0ajYCACAAQUBrQeAAIAEgBEEgEB0gBCEDA0AgASAFRwRAIAMQAgRAIAIQASACQSBqEAEFIAMgAEEgakGILRASIAMgAxATIAMgACACEBIgA0GILSACQSBqEBILIABB4ABqIQAgAkFAayECIANBIGohAyAFQQFqIQUMAQsLQQAgBDYCAAtKACAAED4EQCABEEAFIABBQGtBqC0QGUGoLUHILRATQagtQcgtQegtEBIgAEHILSABEBIgAEEgakHoLSABQSBqEBIgAUFAaxAaCwsyACABIAJqQQFrIQEDQCABIAJIRQRAIAEgAC0AADoAACABQQFrIQEgAEEBaiEADAELCwsqACAAED0EQCABED8PCyAAQYguEFFBiC5BICABEFpBqC5BICABQSBqEFoLQQAgABA9BEAgARABIAFBwAA6AAAPCyAAQcguEBZByC5BICABEFogAEEgahAYQX9GBEAgASABLQAAQYABcjoAAAsLLwAgAC0AAEHAAHEEQCABED8PCyAAQSBB6C4QWiAAQSBqQSBBiC8QWkHoLiABEFMLrgEBAn8gAC0AACICQcAAcQRAIAEQPw8LIAJBgAFxIQMgAEHILxAAQcgvIAJBP3E6AABByC9BIEGoLxBaQagvIAEQFSABQcgvEBMgAUHIL0HILxASQcgvQYgYQcgvEA5ByC9ByC8QIUHIL0GoLxAQQcgvEBhBf0YEQCADBEBByC8gAUEgahAABUHILyABQSBqEBALBSADBEBByC8gAUEgahAQBUHILyABQSBqEAALCwstAQF/A0AgASAD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EH5B6OAAQejgABCFASAAQYjfAEEgQajfABCLAUGo3wBB6N8AEIIBIABB6N8AQejfABCAAUHo3wBBqOAAEExBqOAAQejfAEGo4AAQgAFBqOAAQejgABBEBEBBAA8LQQELDgAgABA9IABBQGsQPXELCgAgAEGAAWoQPQsNACAAED8gAEFAaxA/CxUAIAAQPyAAQUBrEH4gAEGAAWoQPwuiAQAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4C4ICACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAELKgAgABCOAQRAIAEQkQEFIAFBgAFqEH4gAEFAayABQUBrEH8gACABEH8LCxUAIAAgARBEIABBQGsgAUFAaxBEcQuDAQEBfyAAEI8BBEAgARCOAQ8LIAEQjgEEQEEADwsgAEGAAWoiAhB9BEAgACABEJUBDwsgAkHo4QAQggEgAUHo4QBBqOIAEIABIAJB6OEAQejiABCAASABQUBrQejiAEGo4wAQgAEgAEGo4gAQRARAIABBQGtBqOMAEEQEQEEBDwsLQQALzAEBAn8gABCPAQRAIAEQjwEPCyABEI8BBEBBAA8LIABBgAFqIgIQfQRAIAEgABCWAQ8LIAFBgAFqIgMQfQRAIAAgARCWAQ8LIAJB6OMAEIIBIANBqOQAEIIBIABBqOQAQejkABCAASABQejjAEGo5QAQgAEgAkHo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qIEBQaiAASACEIQBIAJBqIIBIAIQhAFB6P0AQaiAAUHoggEQgAFB6IIBQeiCAUHoggEQgwFB6IEBIAIgAkFAayIAEIQBIABB6IABIAAQgAEgAEHoggEgABCEASADIAQgAkGAAWoiABCDASAAIAAQggEgAEHo+gAgABCEASAAQaj7ACAAEIQBIABB6P4AIAAQgAELFQAgACABEH8gAEFAayABQUBrEIUBCyMAIAAgARB/IABBQGsgAUFAaxCFASAAQYABaiABQYABahB/CxYAIAFBqIMBEJ0BIABBqIMBIAIQmgELFgAgAUHohAEQnQEgAEHohAEgAhCbAQsWACABQaiGARCeASAAQaiGASACEJwBCxQAIAAgARBRIABBQGsgAUFAaxBRCyIAIAAgARBRIABBQGsgAUFAaxBRIABBgAFqIAFBgAFqEFELFAAgACABEFMgAEFAayABQUBrEFMLIgAgACABEFMgAEFAayABQUBrEFMgAEGAAWogAUGAAWoQUwtZACAAEI8BBEAgARA/IAFBQGsQPwUgAEGAAWpB6IcBEIYBQeiHAUGoiAEQggFB6IcBQaiIAUHoiAEQgAEgAEGoiAEgARCAASAAQUBrQeiIASABQUBrEIABCws9ACAAQUBrQaiJARCCASAAQeiJARCCASAAQeiJAUHoiQEQgAFB6IkBQajhAEHoiQEQgwFBqIkBQeiJARBECxIAIABBqIoBEKYBQaiKARCnAQueAQEDf0EAQQAoAgAiBCABQQZ0ajYCACAAQYABakHAASABIARBwAAQigEgBCEDA0AgASAFRwRAIAMQPQRAIAIQPyACQUBrED8FIAMgAEFAa0GoiwEQgAEgAyADEIIBIAMgACACEIABIANBqIsBIAJBQGsQgAELIABBwAFqIQAgAkGAAWohAiADQUBrIQMgBUEBaiEFDAELC0EAIAQ2AgALWwAgABCPAQRAIAEQkQEFIABBgAFqQeiLARCGAUHoiwFBqIwBEIIBQeiLAUGojAFB6IwBEIABIABBqIwBIAEQgAEgAEFAa0HojAEgAUFAaxCAASABQYABahB+CwsyACAAEI4BBEAgARCQAQ8LIABBqI0BEKIBQaiNAUHAACABEFpB6I0BQcAAIAFBQGsQWgtGACAAEI4BBEAgARA/IAFBwAA6AAAPCyAAQaiOARBRQaiOAUHAACABEFogAEFAaxCIAUF/RgRAIAEgAS0AAEGAAXI6AAALCzYAIAAtAABBwABxBEAgARCQAQ8LIABBwABB6I4BEFogAEFAa0HAAEGojwEQWkHojgEgARCkAQvMAQECfyAALQAAIgJBwABxBEAgARCQAQ8LIAJBgAFxIQMgAEGokAEQf0GokAEgAkE/cToAAEGokAFBwABB6I8BEFpB6I8BIAEQUyABQaiQARCCASABQaiQAUGokAEQgAFBqJABQajhAEGokAEQgwFBqJABQaiQARCMAUGokAFB6I8BEIUBQaiQARCIAUF/RgRAIAMEQEGokAEgAUFAaxB/BUGokAEgAUFAaxCFAQsFIAMEQEGokAEgAUFAaxCFAQVBqJABIAFBQGsQfwsLCzABAX8DQCABIANGRQRAIAAgAhCrASAAQYABaiEAIAJBgAFqIQIgA0EBaiEDDAELCwsvAQF/A0AgASADRkUEQCAAIAIQrAEgAEGAAWohACACQUBrIQIgA0EBaiEDDAELCwswAQF/A0AgASADRkUEQCAAIAIQrQEgAEGAAWohACACQYABaiECIANBAWohAwwBCwsLTAEBfyAAIAFBAWsiA0EGdGohACACIANBB3RqIQJBACEDA0AgASADRkUEQCAAIAIQrgEgAEFAaiEAIAJBgAFrIQIgA0EBaiEDDAELCwtOAQF/IAAgAUEBayIDQQd0aiEAIAIgA0HAAWxqIQJBACEDA0AgASADRkUEQCAAIAIQlAEgAEGAAWshACACQcABayECIANBAWohAwwBCwsLhQEBA38gAUEBRgRADwsgACEDIABBASABQQFrdEHAAWxqIgRBwAFrIQIDQCACIANGRQRAIAMgBCADEJwBIAIgBCACEJwBIANBwAFqIQMgBEHAAWohBAwBCwsgACABQQFrIgEQtAEDQCABBEAgAiACEJkBIAFBAWshAQwBCwsgACACIAAQnAELqAEBA38gA0UEQCAGEJEBDwtBAEEAKAIAIghBASAFdCIJQcABbGo2AgADQCAHIAlGRQRAIAggB0HAAWxqEJEBIAdBAWohBwwBCwsgASACIANsaiEDA0AgASADRwRAIAEgAiAEIAUQZCIHBEAgCCAHQQFrQcABbGoiByAAIAcQnAELIAEgAmohASAAQcABaiEADAELCyAIIAUQtAEgCCAGEJMBQQAgCDYCAAuD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EJcCQfCOBSAKEPoBCysAIABBkMwCEFkgAUHQzQIQhgJBkMwCQdDNAkHwlAUQiQJB8JQFIAIQlwILuhgBK34gADUCACINIAE1AgAiEn4iDEL/////D4MgBH5C/////w+DIhMgAzUCACIWfiAMQv////8Pg3xCIIggDEIgiHwhFSANIAE1AggiDH4gCzUCACIPIBN+IAA1AgQiDiASfiANIAE1AgQiEH4gFUL/////D4N8IhdC/////w+DfCIYQv////8Pg3wiEUL/////D4MgBH5C/////w+DIhQgFn4gEUL/////D4N8QiCIIBdCIIggFUIgiHwgGEIgiHwgEUIgiHx8IiJC/////w+DfCEnIAwgDn4gDSABNQIMIhV+IAo1AgAiESATfiAPIBR+IAA1AggiFyASfiAOIBB+ICdC/////w+DfCIoQv////8Pg3wiGkL/////D4N8IhtC/////w+DfCIcQv////8PgyAEfkL/////D4MiGCAWfiAcQv////8Pg3xCIIggJ0IgiCAiQiCIfCAoQiCIfCAaQiCIfCAbQiCIfCAcQiCIfHwiKUL/////D4N8IipC/////w+DfCEaIAwgF34gDiAVfiANIAE1AhAiJ34gCTUCACIcIBN+IBEgFH4gDyAYfiAANQIMIiIgEn4gECAXfiAaQv////8Pg3wiHUL/////D4N8Ih5C/////w+DfCIjQv////8Pg3wiJEL/////D4N8IhtC/////w+DIAR+Qv////8PgyIoIBZ+IBtC/////w+DfEIgiCAqQiCIIClCIIh8IBpCIIh8IB1CIIh8IB5CIIh8ICNCIIh8ICRCIIh8IBtCIIh8fCIjQv////8Pg3wiJEL/////D4N8Ih9C/////w+DfCEdIAwgIn4gFSAXfiAOICd+IA0gATUCFCIafiAINQIAIhsgE34gFCAcfiARIBh+IA8gKH4gADUCECIpIBJ+IBAgIn4gHUL/////D4N8IiBC/////w+DfCIlQv////8Pg3wiGUL/////D4N8IiFC/////w+DfCImQv////8Pg3wiHkL/////D4MgBH5C/////w+DIiogFn4gHkL/////D4N8QiCIICRCIIggI0IgiHwgH0IgiHwgHUIgiHwgIEIgiHwgJUIgiHwgGUIgiHwgIUIgiHwgJkIgiHwgHkIgiHx8IiVC/////w+DfCIZQv////8Pg3wiIUL/////D4N8IiZC/////w+DfCEfIAwgKX4gFSAifiAXICd+IA4gGn4gDSABNQIYIh1+IAc1AgAiHiATfiAUIBt+IBggHH4gESAofiAPICp+IAA1AhQiIyASfiAQICl+IB9C/////w+DfCIrQv////8Pg3wiLEL/////D4N8Ii1C/////w+DfCIuQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIgQv////8PgyAEfkL/////D4MiJCAWfiAgQv////8Pg3xCIIggGUIgiCAlQiCIfCAhQiCIfCAmQiCIfCAfQiCIfCArQiCIfCAsQiCIfCAtQiCIfCAuQiCIfCAvQiCIfCAwQiCIfCAgQiCIfHwiJkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiLUL/////D4N8Ii5C/////w+DfCEZIAwgI34gFSApfiAiICd+IBcgGn4gDiAdfiANIAE1AhwiH34gBjUCACINIBN+IBQgHn4gGCAbfiAcICh+IBEgKn4gDyAkfiAANQIYIiAgEn4gECAjfiAZQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUL/////D4N8IiFC/////w+DIAR+Qv////8PgyIlIBZ+ICFC/////w+DfEIgiCArQiCIICZCIIh8ICxCIIh8IC1CIIh8IC5CIIh8IBlCIIh8IC9CIIh8IDBCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IDRCIIh8IDVCIIh8ICFCIIh8fCIhQv////8Pg3wiJkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiLUL/////D4N8Ii5C/////w+DfCEZIAwgIH4gFSAjfiAnICl+IBogIn4gFyAdfiAOIB9+IBYgEyAFNQIAIhN+IA0gFH4gGCAefiAbICh+IBwgKn4gESAkfiAPICV+IBIgADUCHCISfiAQICB+IBlC/////w+DfCIvQv////8Pg3wiMEL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1Qv////8Pg3wiNkL/////D4N8Ig5C/////w+DIAR+Qv////8PgyIWfiAOQv////8Pg3xCIIggJkIgiCAhQiCIfCArQiCIfCAsQiCIfCAtQiCIfCAuQiCIfCAZQiCIfCAvQiCIfCAwQiCIfCAxQiCIfCAyQiCIfCAzQiCIfCA0QiCIfCA1QiCIfCA2QiCIfCAOQiCIfHwiGUL/////D4N8IiFC/////w+DfCImQv////8Pg3wiK0L/////D4N8IixC/////w+DfCItQv////8Pg3whDiATIBR+IA0gGH4gHiAofiAbICp+IBwgJH4gESAlfiAPIBZ+IBAgEn4gDkL/////D4N8Ig9C/////w+DfCIQQv////8Pg3wiFEL/////D4N8Ii5C/////w+DfCIvQv////8Pg3wiMEL/////D4N8IjFC/////w+DfCIyQiCIICFCIIggGUIgiHwgJkIgiHwgK0IgiHwgLEIgiHwgLUIgiHwgDkIgiHwgD0IgiHwgEEIgiHwgFEIgiHwgLkIgiHwgL0IgiHwgMEIgiHwgMUIgiHx8IQ8gAiAyPgIAIBMgGH4gDSAofiAeICp+IBsgJH4gHCAlfiARIBZ+IAwgEn4gFSAgfiAjICd+IBogKX4gHSAifiAXIB9+IA9C/////w+DfCIMQv////8Pg3wiDkL/////D4N8IhBC/////w+DfCIUQv////8Pg3wiEUL/////D4N8IhdC/////w+DfCIYQv////8Pg3wiGUL/////D4N8IiFC/////w+DfCImQv////8Pg3wiK0L/////D4N8IixCIIggDEIgiCAPQiCIfCAOQiCIfCAQQiCIfCAUQiCIfCARQiCIfCAXQiCIfCAYQiCIfCAZQiCIfCAhQiCIfCAmQiCIfCArQiCIfHwhDCACICw+AgQgEyAofiANICp+IB4gJH4gGyAlfiAWIBx+IBIgFX4gICAnfiAaICN+IB0gKX4gHyAifiAMQv////8Pg3wiD0L/////D4N8Ig5C/////w+DfCIQQv////8Pg3wiFEL/////D4N8IhVC/////w+DfCIRQv////8Pg3wiF0L/////D4N8IhhC/////w+DfCIcQv////8Pg3wiIkIgiCAPQiCIIAxCIIh8IA5CIIh8IBBCIIh8IBRCIIh8IBVCIIh8IBFCIIh8IBdCIIh8IBhCIIh8IBxCIIh8fCEMIAIgIj4CCCATICp+IA0gJH4gHiAlfiAWIBt+IBIgJ34gGiAgfiAdICN+IB8gKX4gDEL/////D4N8Ig9C/////w+DfCIOQv////8Pg3wiEEL/////D4N8IhRC/////w+DfCIVQv////8Pg3wiEUL/////D4N8IhdC/////w+DfCIYQiCIIA9CIIggDEIgiHwgDkIgiHwgEEIgiHwgFEIgiHwgFUIgiHwgEUIgiHwgF0IgiHx8IQwgAiAYPgIMIBMgJH4gDSAlfiAWIB5+IBIgGn4gHSAgfiAfICN+IAxC/////w+DfCIPQv////8Pg3wiDkL/////D4N8IhBC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhFCIIggD0IgiCAMQiCIfCAOQiCIfCAQQiCIfCAUQiCIfCAVQiCIfHwhDCACIBE+AhAgEyAlfiANIBZ+IBIgHX4gHyAgfiAMQv////8Pg3wiDUL/////D4N8Ig9C/////w+DfCIOQv////8Pg3wiEEIgiCANQiCIIAxCIIh8IA9CIIh8IA5CIIh8fCENIAIgED4CFCATIBZ+IBIgH34gDUL/////D4N8IhJC/////w+DfCITQiCIIBJCIIggDUIgiHx8IQ0gAiATPgIYIAIgDT4CHCANQiCIpwRAIAIgAyACEAcaBSACIAMQBQRAIAIgAyACEAcaCwsLmxcBI34gADUCACIQIBB+IgtC/////w+DIAN+Qv////8PgyIVIAI1AgAiFn4gC0L/////D4N8QiCIIAtCIIh8IQ0gCjUCACISIBV+IAA1AgQiCyAQfiIOQv////8Pg0IBhiIRQv////8PgyANQv////8Pg3wiD0L/////D4N8IgxC/////w+DIAN+Qv////8PgyITIBZ+IAxC/////w+DfEIgiCAOQiCIQgGGIBFCIIh8IA9CIIh8IA1CIIh8IAxCIIh8fCEMIAk1AgAiGCAVfiASIBN+IAsgC34gADUCCCINIBB+IhFC/////w+DQgGGIg9C/////w+DfCIZQv////8PgyAMQv////8Pg3wiHUL/////D4N8IhpC/////w+DfCIOQv////8PgyADfkL/////D4MiGyAWfiAOQv////8Pg3xCIIggEUIgiEIBhiAPQiCIfCAZQiCIfCAdQiCIfCAMQiCIfCAaQiCIfCAOQiCIfHwhDiAINQIAIhkgFX4gEyAYfiASIBt+IAsgDX4gADUCDCIMIBB+Ig9C/////w+DfCIaQv////8Pg0IBhiIeQv////8PgyAOQv////8Pg3wiH0L/////D4N8IiBC/////w+DfCIXQv////8Pg3wiEUL/////D4MgA35C/////w+DIh0gFn4gEUL/////D4N8QiCIIBpCIIggD0IgiHxCAYYgHkIgiHwgH0IgiHwgDkIgiHwgIEIgiHwgF0IgiHwgEUIgiHx8IREgBzUCACIaIBV+IBMgGX4gGCAbfiASIB1+IA0gDX4gCyAMfiAANQIQIg4gEH4iH0L/////D4N8IiBC/////w+DQgGGIhdC/////w+DfCIhQv////8PgyARQv////8Pg3wiFEL/////D4N8IhxC/////w+DfCIiQv////8Pg3wiI0L/////D4N8Ig9C/////w+DIAN+Qv////8PgyIeIBZ+IA9C/////w+DfEIgiCAgQiCIIB9CIIh8QgGGIBdCIIh8ICFCIIh8IBRCIIh8IBFCIIh8IBxCIIh8ICJCIIh8ICNCIIh8IA9CIIh8fCEPIAY1AgAiHyAVfiATIBp+IBkgG34gGCAdfiASIB5+IAwgDX4gCyAOfiAANQIUIhEgEH4iIUL/////D4N8IhRC/////w+DfCIcQv////8Pg0IBhiIiQv////8PgyAPQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIlQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIXQv////8PgyADfkL/////D4MiICAWfiAXQv////8Pg3xCIIggFEIgiCAhQiCIfCAcQiCIfEIBhiAiQiCIfCAjQiCIfCAPQiCIfCAkQiCIfCAlQiCIfCAmQiCIfCAnQiCIfCAXQiCIfHwhFCAFNQIAIhcgFX4gEyAffiAaIBt+IBkgHX4gGCAefiASICB+IAwgDH4gDSAOfiALIBF+IAA1AhgiDyAQfiIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DQgGGIiVC/////w+DfCImQv////8PgyAUQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiHEL/////D4MgA35C/////w+DIiEgFn4gHEL/////D4N8QiCIICNCIIggIkIgiHwgJEIgiHxCAYYgJUIgiHwgJkIgiHwgJ0IgiHwgFEIgiHwgKEIgiHwgKUIgiHwgKkIgiHwgK0IgiHwgLEIgiHwgHEIgiHx8IRQgFiAVIAQ1AgAiFX4gEyAXfiAbIB9+IBogHX4gGSAefiAYICB+IBIgIX4gDCAOfiANIBF+IAsgD34gECAANQIcIhB+IiJC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IiVC/////w+DQgGGIiZC/////w+DIBRC/////w+DfCInQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg3wiK0L/////D4N8IixC/////w+DfCItQv////8Pg3wiHEL/////D4MgA35C/////w+DIhZ+IBxC/////w+DfEIgiCAjQiCIICJCIIh8ICRCIIh8ICVCIIh8QgGGICZCIIh8ICdCIIh8IBRCIIh8IChCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IC1CIIh8IBxCIIh8fCEUIAEgEyAVfiAXIBt+IB0gH34gGiAefiAZICB+IBggIX4gEiAWfiAOIA5+IAwgEX4gDSAPfiALIBB+IgtC/////w+DfCISQv////8Pg3wiE0L/////D4NCAYYiHEL/////D4N8IiJC/////w+DIBRC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IiVC/////w+DfCImQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg3wiKj4CACABIBUgG34gFyAdfiAeIB9+IBogIH4gGSAhfiAWIBh+IA4gEX4gDCAPfiANIBB+Ig1C/////w+DfCIYQv////8Pg3wiG0L/////D4NCAYYiK0L/////D4MgEkIgiCALQiCIfCATQiCIfEIBhiAcQiCIfCAiQiCIfCAjQiCIfCAUQiCIfCAkQiCIfCAlQiCIfCAmQiCIfCAnQiCIfCAoQiCIfCApQiCIfCAqQiCIfCILQv////8Pg3wiEkL/////D4N8IhNC/////w+DfCIUQv////8Pg3wiHEL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJD4CBCABIBUgHX4gFyAefiAfICB+IBogIX4gFiAZfiARIBF+IA4gD34gDCAQfiIMQv////8Pg3wiGUL/////D4NCAYYiHUL/////D4N8IiVC/////w+DIBhCIIggDUIgiHwgG0IgiHxCAYYgK0IgiHwgEkIgiHwgC0IgiHwgE0IgiHwgFEIgiHwgHEIgiHwgIkIgiHwgI0IgiHwgJEIgiHwiC0L/////D4N8Ig1C/////w+DfCISQv////8Pg3wiE0L/////D4N8IhhC/////w+DfCIbQv////8Pg3wiFD4CCCABIBUgHn4gFyAgfiAfICF+IBYgGn4gDyARfiAOIBB+Ig5C/////w+DfCIaQv////8Pg0IBhiIeQv////8PgyAZQiCIIAxCIIh8QgGGIB1CIIh8ICVCIIh8IA1CIIh8IAtCIIh8IBJCIIh8IBNCIIh8IBhCIIh8IBtCIIh8IBRCIIh8IgtC/////w+DfCINQv////8Pg3wiDEL/////D4N8IhJC/////w+DfCITQv////8Pg3wiGD4CDCABIBUgIH4gFyAhfiAWIB9+IA8gD34gECARfiIRQv////8Pg0IBhiIbQv////8Pg3wiGUL/////D4MgGkIgiCAOQiCIfEIBhiAeQiCIfCANQiCIfCALQiCIfCAMQiCIfCASQiCIfCATQiCIfCAYQiCIfCILQv////8Pg3wiDUL/////D4N8IgxC/////w+DfCIOQv////8Pg3wiEj4CECABIBUgIX4gFiAXfiAPIBB+Ig9C/////w+DQgGGIhNC/////w+DIBFCIIhCAYYgG0IgiHwgGUIgiHwgDUIgiHwgC0IgiHwgDEIgiHwgDkIgiHwgEkIgiHwiC0L/////D4N8Ig1C/////w+DfCIMQv////8Pg3wiDj4CFCABIBUgFn4gECAQfiIQQv////8PgyAPQiCIQgGGIBNCIIh8IA1CIIh8IAtCIIh8IAxCIIh8IA5CIIh8IgtC/////w+DfCINQv////8Pg3wiDD4CGCABIA1CIIggEEIgiHwgC0IgiHwgDEIgiHwiED4CHCAQQiCIpwRAIAEgAiABEAcaBSABIAIQBQRAIAEgAiABEAcaCwsLXgAgACAHIAEQgAEgAEFAayAGIAFBQGsQgAEgAEGAAWogBSABQYABahCAASAAQcABaiAEIAFBwAFqEIABIABBgAJqIAMgAUGAAmoQgAEgAEHAAmogAiABQcACahCAAQvgAQEBfyAAIAEQACAAQSBqIAFBIGoQECABIAcgARCAASAAQUBrIAFBQGsi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";
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
// e.g. a SES hardened realm that has not endowed atob/Buffer. The fallback keeps the
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
    // SES hardened realm or any host without a base64 primitive.
    return decodePureJs(b64);
}

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a SES hardened-profile realm) throws at module load.
let curve_bn128 = null;

async function buildBn128(singleThread, plugins) {
    if ((!singleThread) && (curve_bn128)) return curve_bn128;

    let bn128wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: statically imported (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES
        // hardened realms alike. Regenerate the vendored module with `npm run gen-wasm`.
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
// 'code' is base64 of the wasm-opt -Oz optimized wasm; the rest are
// pointer offsets / field moduli.
const code = "AGFzbQEAAAABmQESYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgA39/fwF/YAd/f39/f39/AGACf34AYAh/f39/f39/fwBgBH9/f38Bf2AKf39/f39/f39/fwBgBX9/f39/AX9gB39/f39/f38Bf2AJf39/f39/f39/AX9gC39/f39/f39/f39/AX8CDwEDZW52Bm1lbW9yeQIAGQO1ArMCAAUCBQYGCAgBAAAKAwECAQEAAAEAAAAAAgIABQEDBAEBAwACAAUCBQYGCAgBAAADAQIBAQAAAQAAAAACAgAFAQMEAQEDAAIBAAACAgIFBQAAAAYGBgAAAQEBAAABAQEAAAAAAAICAQABAAAAAAEBAQEBDAAJBAAJBAMDAAMCAAAEBwcBAQcAAw0EAwIFAAEBAAEBAAADAgIEAwACAgIFBQAAAAYGBgAAAQEBAAABAQEAAAAAAAICAQAAAAAAAQEBAQEACQQACQQDAwEAAwAABAcHAQEHAQADAAAEBwcBAQcBAQQEBAQEAAICBQUAAQABAQACBgADAgQDAAICBQUAAQEAAQEAAAAABgADAgIEAwACAQMEAQAAAAAAAAAAAAACAgICAAABAAAAAAgODxARAQoLCwe/J70CCWludHFfY29weQAACWludHFfemVybwABCGludHFfb25lAAMLaW50cV9pc1plcm8AAgdpbnRxX2VxAAQIaW50cV9ndGUABQhpbnRxX2FkZAAGCGludHFfc3ViAAcIaW50cV9tdWwACAtpbnRxX3NxdWFyZQAJDmludHFfc3F1YXJlT2xkAAoIaW50cV9kaXYADA9pbnRxX2ludmVyc2VNb2QADQhmMW1fY29weQAACGYxbV96ZXJvAAEKZjFtX2lzWmVybwACBmYxbV9lcQAEB2YxbV9hZGQADwdmMW1fc3ViABAHZjFtX25lZwARDmYxbV9pc05lZ2F0aXZlABgJZjFtX2lzT25lAA4IZjFtX3NpZ24AGQtmMW1fbVJlZHVjdAASB2YxbV9tdWwAEwpmMW1fc3F1YXJlABQNZjFtX3NxdWFyZU9sZAAVEmYxbV9mcm9tTW9udGdvbWVyeQAXEGYxbV90b01vbnRnb21lcnkAFgtmMW1faW52ZXJzZQAaB2YxbV9vbmUAGwhmMW1fbG9hZAAcD2YxbV90aW1lc1NjYWxhcgAdB2YxbV9leHAAIRBmMW1fYmF0Y2hJbnZlcnNlAB4IZjFtX3NxcnQAIgxmMW1faXNTcXVhcmUAIxVmMW1fYmF0Y2hUb01vbnRnb21lcnkAHxdmMW1fYmF0Y2hGcm9tTW9udGdvbWVyeQAgCWludHJfY29weQAkCWludHJfemVybwAlCGludHJfb25lACcLaW50cl9pc1plcm8AJgdpbnRyX2VxACgIaW50cl9ndGUAKQhpbnRyX2FkZAAqCGludHJfc3ViACsIaW50cl9tdWwALAtpbnRyX3NxdWFyZQAtDmludHJfc3F1YXJlT2xkAC4IaW50cl9kaXYALw9pbnRyX2ludmVyc2VNb2QAMAhmcm1fY29weQAkCGZybV96ZXJvACUKZnJtX2lzWmVybwAmBmZybV9lcQAoB2ZybV9hZGQAMgdmcm1fc3ViADMHZnJtX25lZwA0DmZybV9pc05lZ2F0aXZlADsJZnJtX2lzT25lADEIZnJtX3NpZ24APAtmcm1fbVJlZHVjdAA1B2ZybV9tdWwANgpmcm1fc3F1YXJlADcNZnJtX3NxdWFyZU9sZAA4EmZybV9mcm9tTW9udGdvbWVyeQA6EGZybV90b01vbnRnb21lcnkAOQtmcm1faW52ZXJzZQA9B2ZybV9vbmUAPghmcm1fbG9hZAA/D2ZybV90aW1lc1NjYWxhcgBAB2ZybV9leHAARBBmcm1fYmF0Y2hJbnZlcnNlAEEIZnJtX3NxcnQARQxmcm1faXNTcXVhcmUARhVmcm1fYmF0Y2hUb01vbnRnb21lcnkAQhdmcm1fYmF0Y2hGcm9tTW9udGdvbWVyeQBDBmZyX2FkZAAyBmZyX3N1YgAzBmZyX25lZwA0BmZyX211bABHCWZyX3NxdWFyZQBICmZyX2ludmVyc2UASQ1mcl9pc05lZ2F0aXZlAEoHZnJfY29weQAkB2ZyX3plcm8AJQZmcl9vbmUAPglmcl9pc1plcm8AJgVmcl9lcQAoDGcxbV9tdWx0aWV4cAB1EmcxbV9tdWx0aWV4cF9jaHVuawB0EmcxbV9tdWx0aWV4cEFmZmluZQB4GGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawB3CmcxbV9pc1plcm8ATBBnMW1faXNaZXJvQWZmaW5lAEsGZzFtX2VxAFQLZzFtX2VxTWl4ZWQAUwxnMW1fZXFBZmZpbmUAUghnMW1fY29weQBQDmcxbV9jb3B5QWZmaW5lAE8IZzFtX3plcm8ATg5nMW1femVyb0FmZmluZQBNCmcxbV9kb3VibGUAVhBnMW1fZG91YmxlQWZmaW5lAFUHZzFtX2FkZABZDGcxbV9hZGRNaXhlZABYDWcxbV9hZGRBZmZpbmUAVwdnMW1fbmVnAFsNZzFtX25lZ0FmZmluZQBaB2cxbV9zdWIAXgxnMW1fc3ViTWl4ZWQAXQ1nMW1fc3ViQWZmaW5lAFwSZzFtX2Zyb21Nb250Z29tZXJ5AGAYZzFtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAF8QZzFtX3RvTW9udGdvbWVyeQBiFmcxbV90b01vbnRnb21lcnlBZmZpbmUAYQ9nMW1fdGltZXNTY2FsYXIAeRVnMW1fdGltZXNTY2FsYXJBZmZpbmUAeg1nMW1fbm9ybWFsaXplAGcKZzFtX0xFTXRvVQBpCmcxbV9MRU10b0MAagpnMW1fVXRvTEVNAGsKZzFtX0N0b0xFTQBsD2cxbV9iYXRjaExFTXRvVQBtD2cxbV9iYXRjaExFTXRvQwBuD2cxbV9iYXRjaFV0b0xFTQBvD2cxbV9iYXRjaEN0b0xFTQBwDGcxbV90b0FmZmluZQBjDmcxbV90b0phY29iaWFuAFERZzFtX2JhdGNoVG9BZmZpbmUAZhNnMW1fYmF0Y2hUb0phY29iaWFuAHELZzFtX2luQ3VydmUAZRFnMW1faW5DdXJ2ZUFmZmluZQBkF2ZybV9fcmV2ZXJzZVBlcm11dGF0aW9uAHsHZnJtX2ZmdAB+CGZybV9pZmZ0AH8KZnJtX3Jhd2ZmdAB8C2ZybV9mZnRKb2luAIABDmZybV9mZnRKb2luRXh0AIEBEWZybV9mZnRKb2luRXh0SW52AIIBCmZybV9mZnRNaXgAgwEMZnJtX2ZmdEZpbmFsAIQBHWZybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAIUBCHBvbF96ZXJvAIYBD3BvbF9jb25zdHJ1Y3RMQwCHAQxxYXBfYnVpbGRBQkMAiAELcWFwX2pvaW5BQkMAiQEMcWFwX2JhdGNoQWRkAIoBCmYybV9pc1plcm8ASwlmMm1faXNPbmUAiwEIZjJtX3plcm8ATQdmMm1fb25lAIwBCGYybV9jb3B5AI0BB2YybV9tdWwAjgEIZjJtX211bDEAjwEKZjJtX3NxdWFyZQCQAQdmMm1fYWRkAJEBB2YybV9zdWIAkgEHZjJtX25lZwCTAQhmMm1fc2lnbgCWAQ1mMm1fY29uanVnYXRlAFoSZjJtX2Zyb21Nb250Z29tZXJ5AF8QZjJtX3RvTW9udGdvbWVyeQBhBmYybV9lcQBSC2YybV9pbnZlcnNlAJQBB2YybV9leHAAmQEPZjJtX3RpbWVzU2NhbGFyAJUBEGYybV9iYXRjaEludmVyc2UAmAEIZjJtX3NxcnQAmgEMZjJtX2lzU3F1YXJlAJsBDmYybV9pc05lZ2F0aXZlAJcBDGcybV9tdWx0aWV4cADEARJnMm1fbXVsdGlleHBfY2h1bmsAwwESZzJtX211bHRpZXhwQWZmaW5lAMcBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawDGAQpnMm1faXNaZXJvAJ0BEGcybV9pc1plcm9BZmZpbmUAnAEGZzJtX2VxAKUBC2cybV9lcU1peGVkAKQBDGcybV9lcUFmZmluZQCjAQhnMm1fY29weQChAQ5nMm1fY29weUFmZmluZQCgAQhnMm1femVybwCfAQ5nMm1femVyb0FmZmluZQCeAQpnMm1fZG91YmxlAKcBEGcybV9kb3VibGVBZmZpbmUApgEHZzJtX2FkZACqAQxnMm1fYWRkTWl4ZWQAqQENZzJtX2FkZEFmZmluZQCoAQdnMm1fbmVnAKwBDWcybV9uZWdBZmZpbmUAqwEHZzJtX3N1YgCvAQxnMm1fc3ViTWl4ZWQArgENZzJtX3N1YkFmZmluZQCtARJnMm1fZnJvbU1vbnRnb21lcnkAsQEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lALABEGcybV90b01vbnRnb21lcnkAswEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQCyAQ9nMm1fdGltZXNTY2FsYXIAyAEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lAMkBDWcybV9ub3JtYWxpemUAuAEKZzJtX0xFTXRvVQC5AQpnMm1fTEVNdG9DALoBCmcybV9VdG9MRU0AuwEKZzJtX0N0b0xFTQC8AQ9nMm1fYmF0Y2hMRU10b1UAvQEPZzJtX2JhdGNoTEVNdG9DAL4BD2cybV9iYXRjaFV0b0xFTQC/AQ9nMm1fYmF0Y2hDdG9MRU0AwAEMZzJtX3RvQWZmaW5lALQBDmcybV90b0phY29iaWFuAKIBEWcybV9iYXRjaFRvQWZmaW5lALcBE2cybV9iYXRjaFRvSmFjb2JpYW4AwQELZzJtX2luQ3VydmUAtgERZzJtX2luQ3VydmVBZmZpbmUAtQELZzFtX3RpbWVzRnIAygEXZzFtX19yZXZlcnNlUGVybXV0YXRpb24AywEHZzFtX2ZmdADNAQhnMW1faWZmdADOAQpnMW1fcmF3ZmZ0AMwBC2cxbV9mZnRKb2luAM8BDmcxbV9mZnRKb2luRXh0ANABEWcxbV9mZnRKb2luRXh0SW52ANEBCmcxbV9mZnRNaXgA0gEMZzFtX2ZmdEZpbmFsANMBHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uANQBC2cybV90aW1lc0ZyANUBF2cybV9fcmV2ZXJzZVBlcm11dGF0aW9uANYBB2cybV9mZnQA2AEIZzJtX2lmZnQA2QEKZzJtX3Jhd2ZmdADXAQtnMm1fZmZ0Sm9pbgDaAQ5nMm1fZmZ0Sm9pbkV4dADbARFnMm1fZmZ0Sm9pbkV4dEludgDcAQpnMm1fZmZ0TWl4AN0BDGcybV9mZnRGaW5hbADeAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDfARFnMW1fdGltZXNGckFmZmluZQDgARFnMm1fdGltZXNGckFmZmluZQDhARFmcm1fYmF0Y2hBcHBseUtleQDiARFnMW1fYmF0Y2hBcHBseUtleQDjARZnMW1fYmF0Y2hBcHBseUtleU1peGVkAOQBEWcybV9iYXRjaEFwcGx5S2V5AOUBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA5gEKZjZtX2lzWmVybwDoAQlmNm1faXNPbmUA6QEIZjZtX3plcm8A6gEHZjZtX29uZQDrAQhmNm1fY29weQDsAQdmNm1fbXVsAO0BCmY2bV9zcXVhcmUA7gEHZjZtX2FkZADvAQdmNm1fc3ViAPABB2Y2bV9uZWcA8QEIZjZtX3NpZ24A8gESZjZtX2Zyb21Nb250Z29tZXJ5ALEBEGY2bV90b01vbnRnb21lcnkAswEGZjZtX2VxAPMBC2Y2bV9pbnZlcnNlAPQBB2Y2bV9leHAA+AEPZjZtX3RpbWVzU2NhbGFyAPUBEGY2bV9iYXRjaEludmVyc2UA9wEOZjZtX2lzTmVnYXRpdmUA9gEKZnRtX2lzWmVybwD6AQlmdG1faXNPbmUA+wEIZnRtX3plcm8A/AEHZnRtX29uZQD9AQhmdG1fY29weQD+AQdmdG1fbXVsAP8BCGZ0bV9tdWwxAIACCmZ0bV9zcXVhcmUAgQIHZnRtX2FkZACCAgdmdG1fc3ViAIMCB2Z0bV9uZWcAhAIIZnRtX3NpZ24AiwINZnRtX2Nvbmp1Z2F0ZQCFAhJmdG1fZnJvbU1vbnRnb21lcnkAhwIQZnRtX3RvTW9udGdvbWVyeQCGAgZmdG1fZXEAiAILZnRtX2ludmVyc2UAiQIHZnRtX2V4cACOAg9mdG1fdGltZXNTY2FsYXIAigIQZnRtX2JhdGNoSW52ZXJzZQCNAghmdG1fc3FydACPAgxmdG1faXNTcXVhcmUAkAIOZnRtX2lzTmVnYXRpdmUAjAIRZnRtX2Zyb2Jlbml1c01hcDAAlQIRZnRtX2Zyb2Jlbml1c01hcDEAlgIRZnRtX2Zyb2Jlbml1c01hcDIAlwIRZnRtX2Zyb2Jlbml1c01hcDMAmAIRZnRtX2Zyb2Jlbml1c01hcDQAmQIRZnRtX2Zyb2Jlbml1c01hcDUAmgIRZnRtX2Zyb2Jlbml1c01hcDYAmwIRZnRtX2Zyb2Jlbml1c01hcDcAnAIRZnRtX2Zyb2Jlbml1c01hcDgAnQIRZnRtX2Zyb2Jlbml1c01hcDkAngITYmxzMTIzODFfcGFpcmluZ0VxMQCqAhNibHMxMjM4MV9wYWlyaW5nRXEyAKsCE2JsczEyMzgxX3BhaXJpbmdFcTMArAITYmxzMTIzODFfcGFpcmluZ0VxNACtAhNibHMxMjM4MV9wYWlyaW5nRXE1AK4CEGJsczEyMzgxX3BhaXJpbmcArwISYmxzMTIzODFfcHJlcGFyZUcxAKMCEmJsczEyMzgxX3ByZXBhcmVHMgCkAhNibHMxMjM4MV9taWxsZXJMb29wAKUCHGJsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb24AqQIfYmxzMTIzODFfZmluYWxFeHBvbmVudGlhdGlvbk9sZACmAhpibHMxMjM4MV9fY3ljbG90b21pY1NxdWFyZQCnAhpibHMxMjM4MV9fY3ljbG90b21pY0V4cF93MACoAghmNm1fbXVsMQCRAglmNm1fbXVsMDEAkgIKZnRtX211bDAxNACTAhFnMW1faW5Hcm91cEFmZmluZQCfAgtnMW1faW5Hcm91cACgAhFnMm1faW5Hcm91cEFmZmluZQChAgtnMm1faW5Hcm91cACiAgrdkgSzAj4AIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoCwkAIABCABCwAgtEACAAKQMoUAR+IAApAyBQBH4gACkDGFAEfiAAKQMQUAR+IAApAwhQBH4gACkDAAVCAQsFQgELBUIBCwVCAQsFQgELUAsJACAAQgEQsAILYgAgACkDKCABKQMoUQR/IAApAyAgASkDIFEEfyAAKQMYIAEpAxhRBH8gACkDECABKQMQUQR/IAApAwggASkDCFEEfyAAKQMAIAEpAwBRBUEACwVBAAsFQQALBUEACwVBAAsLtwEAIAApAyggASkDKFQEf0EABSAAKQMoIAEpAyhWBH9BAQUgACkDICABKQMgVAR/QQAFIAApAyAgASkDIFYEf0EBBSAAKQMYIAEpAxhUBH9BAAUgACkDGCABKQMYVgR/QQEFIAApAxAgASkDEFQEf0EABSAAKQMQIAEpAxBWBH9BAQUgACkDCCABKQMIVAR/QQAFIAApAwggASkDCFYEf0EBBSAAKQMAIAEpAwBaCwsLCwsLCwsLCwukAgEBfiACIAA1AgAgATUCAHwiAz4CACACIAA1AgQgATUCBHwgA0IgiHwiAz4CBCACIAA1AgggATUCCHwgA0IgiHwiAz4CCCACIAA1AgwgATUCDHwgA0IgiHwiAz4CDCACIAA1AhAgATUCEHwgA0IgiHwiAz4CECACIAA1AhQgATUCFHwgA0IgiHwiAz4CFCACIAA1AhggATUCGHwgA0IgiHwiAz4CGCACIAA1AhwgATUCHHwgA0IgiHwiAz4CHCACIAA1AiAgATUCIHwgA0IgiHwiAz4CICACIAA1AiQgATUCJHwgA0IgiHwiAz4CJCACIAA1AiggATUCKHwgA0IgiHwiAz4CKCACIAA1AiwgATUCLHwgA0IgiHwiAz4CLCADQiCIpwv4AgEBfiACIAA1AgAgATUCAH0iA0L/////D4M+AgAgAiAANQIEIAE1AgR9IANCIId8IgNC/////w+DPgIEIAIgADUCCCABNQIIfSADQiCHfCIDQv////8Pgz4CCCACIAA1AgwgATUCDH0gA0Igh3wiA0L/////D4M+AgwgAiAANQIQIAE1AhB9IANCIId8IgNC/////w+DPgIQIAIgADUCFCABNQIUfSADQiCHfCIDQv////8Pgz4CFCACIAA1AhggATUCGH0gA0Igh3wiA0L/////D4M+AhggAiAANQIcIAE1Ahx9IANCIId8IgNC/////w+DPgIcIAIgADUCICABNQIgfSADQiCHfCIDQv////8Pgz4CICACIAA1AiQgATUCJH0gA0Igh3wiA0L/////D4M+AiQgAiAANQIoIAE1Aih9IANCIId8IgNC/////w+DPgIoIAIgADUCLCABNQIsfSADQiCHfCIDQv////8Pgz4CLCADQiCHpwuFGwEjfiAANQIAIgMgATUCACIIfiIEQiCIIQYgAiAEPgIAIAA1AgQiBCAIfiADIAE1AgQiBX4gBkL/////D4N8IgdC/////w+DfCIKQiCIIAdCIIggBkIgiHx8IQkgAiAKPgIEIAA1AggiBiAIfiAEIAV+IAMgATUCCCIHfiAJQv////8Pg3wiCkL/////D4N8IgtC/////w+DfCITQiCIIApCIIggCUIgiHwgC0IgiHx8IQsgAiATPgIIIAA1AgwiCSAIfiAFIAZ+IAQgB34gAyABNQIMIgp+IAtC/////w+DfCITQv////8Pg3wiF0L/////D4N8IhlC/////w+DfCIQQiCIIBNCIIggC0IgiHwgF0IgiHwgGUIgiHx8IRcgAiAQPgIMIAA1AhAiCyAIfiAFIAl+IAYgB34gBCAKfiADIAE1AhAiE34gF0L/////D4N8IhlC/////w+DfCIQQv////8Pg3wiGkL/////D4N8IhFC/////w+DfCIUQiCIIBlCIIggF0IgiHwgEEIgiHwgGkIgiHwgEUIgiHx8IRAgAiAUPgIQIAA1AhQiFyAIfiAFIAt+IAcgCX4gBiAKfiAEIBN+IAMgATUCFCIZfiAQQv////8Pg3wiGkL/////D4N8IhFC/////w+DfCIUQv////8Pg3wiEkL/////D4N8IhVC/////w+DfCIMQiCIIBpCIIggEEIgiHwgEUIgiHwgFEIgiHwgEkIgiHwgFUIgiHx8IREgAiAMPgIUIAA1AhgiECAIfiAFIBd+IAcgC34gCSAKfiAGIBN+IAQgGX4gAyABNQIYIhp+IBFC/////w+DfCIUQv////8Pg3wiEkL/////D4N8IhVC/////w+DfCIMQv////8Pg3wiFkL/////D4N8Ig1C/////w+DfCIPQiCIIBRCIIggEUIgiHwgEkIgiHwgFUIgiHwgDEIgiHwgFkIgiHwgDUIgiHx8IRIgAiAPPgIYIAA1AhwiESAIfiAFIBB+IAcgF34gCiALfiAJIBN+IAYgGX4gBCAafiADIAE1AhwiFH4gEkL/////D4N8IhVC/////w+DfCIMQv////8Pg3wiFkL/////D4N8Ig1C/////w+DfCIPQv////8Pg3wiDkL/////D4N8IhhC/////w+DfCIbQiCIIBVCIIggEkIgiHwgDEIgiHwgFkIgiHwgDUIgiHwgD0IgiHwgDkIgiHwgGEIgiHx8IQwgAiAbPgIcIAA1AiAiEiAIfiAFIBF+IAcgEH4gCiAXfiALIBN+IAkgGX4gBiAafiAEIBR+IAMgATUCICIVfiAMQv////8Pg3wiFkL/////D4N8Ig1C/////w+DfCIPQv////8Pg3wiDkL/////D4N8IhhC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQiCIIBZCIIggDEIgiHwgDUIgiHwgD0IgiHwgDkIgiHwgGEIgiHwgG0IgiHwgHEIgiHwgHUIgiHx8IQ0gAiAePgIgIAA1AiQiDCAIfiAFIBJ+IAcgEX4gCiAQfiATIBd+IAsgGX4gCSAafiAGIBR+IAQgFX4gAyABNQIkIhZ+IA1C/////w+DfCIPQv////8Pg3wiDkL/////D4N8IhhC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiH0L/////D4N8IiBC/////w+DfCIhQiCIIA9CIIggDUIgiHwgDkIgiHwgGEIgiHwgG0IgiHwgHEIgiHwgHUIgiHwgHkIgiHwgH0IgiHwgIEIgiHx8IQ4gAiAhPgIkIAA1AigiDSAIfiAFIAx+IAcgEn4gCiARfiAQIBN+IBcgGX4gCyAafiAJIBR+IAYgFX4gBCAWfiADIAE1AigiD34gDkL/////D4N8IhhC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiH0L/////D4N8IiBC/////w+DfCIhQv////8Pg3wiIkL/////D4N8IiNC/////w+DfCIkQiCIIBhCIIggDkIgiHwgG0IgiHwgHEIgiHwgHUIgiHwgHkIgiHwgH0IgiHwgIEIgiHwgIUIgiHwgIkIgiHwgI0IgiHx8IRggAiAkPgIoIAggADUCLCIIfiAFIA1+IAcgDH4gCiASfiARIBN+IBAgGX4gFyAafiALIBR+IAkgFX4gBiAWfiAEIA9+IAMgATUCLCIOfiAYQv////8Pg3wiA0L/////D4N8IhtC/////w+DfCIcQv////8Pg3wiHUL/////D4N8Ih5C/////w+DfCIfQv////8Pg3wiIEL/////D4N8IiFC/////w+DfCIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIlQiCIIANCIIggGEIgiHwgG0IgiHwgHEIgiHwgHUIgiHwgHkIgiHwgH0IgiHwgIEIgiHwgIUIgiHwgIkIgiHwgI0IgiHwgJEIgiHx8IQMgAiAlPgIsIAUgCH4gByANfiAKIAx+IBIgE34gESAZfiAQIBp+IBQgF34gCyAVfiAJIBZ+IAYgD34gBCAOfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIYQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIdQv////8Pg3wiHkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiIUL/////D4N8IiJCIIggBEIgiCADQiCIfCAFQiCIfCAYQiCIfCAbQiCIfCAcQiCIfCAdQiCIfCAeQiCIfCAfQiCIfCAgQiCIfCAhQiCIfHwhAyACICI+AjAgByAIfiAKIA1+IAwgE34gEiAZfiARIBp+IBAgFH4gFSAXfiALIBZ+IAkgD34gBiAOfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IhhC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiH0IgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8IAdCIIh8IBhCIIh8IBtCIIh8IBxCIIh8IB1CIIh8IB5CIIh8fCEDIAIgHz4CNCAIIAp+IA0gE34gDCAZfiASIBp+IBEgFH4gECAVfiAWIBd+IAsgD34gCSAOfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiGEL/////D4N8IhtC/////w+DfCIcQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgB0IgiHwgCUIgiHwgCkIgiHwgGEIgiHwgG0IgiHx8IQMgAiAcPgI4IAggE34gDSAZfiAMIBp+IBIgFH4gESAVfiAQIBZ+IA8gF34gCyAOfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiC0L/////D4N8IhNCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAHQiCIfCAJQiCIfCAKQiCIfCALQiCIfHwhAyACIBM+AjwgCCAZfiANIBp+IAwgFH4gEiAVfiARIBZ+IA8gEH4gDiAXfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiC0IgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8IAdCIIh8IAlCIIh8IApCIIh8fCEDIAIgCz4CQCAIIBp+IA0gFH4gDCAVfiASIBZ+IA8gEX4gDiAQfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgB0IgiHwgCUIgiHx8IQMgAiAKPgJEIAggFH4gDSAVfiAMIBZ+IA8gEn4gDiARfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IglCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAHQiCIfHwhAyACIAk+AkggCCAVfiANIBZ+IAwgD34gDiASfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiB0IgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8fCEDIAIgBz4CTCAIIBZ+IA0gD34gDCAOfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQiCIIARCIIggA0IgiHwgBUIgiHx8IQMgAiAGPgJQIAggD34gDSAOfiADQv////8Pg3wiBEL/////D4N8IgVCIIggBEIgiCADQiCIfHwhAyACIAU+AlQgCCAOfiADQv////8Pg3wiCEIgiCADQiCIfCEDIAIgCD4CWCACIAM+AlwLshUBG34gASAANQIAIgQgBH4iAj4CACABIAA1AgQiAyAEfiIJQv////8Pg0IBhiIFQv////8PgyACQiCIIgZC/////w+DfCIHPgIEIAEgAyADfiAANQIIIgIgBH4iCEL/////D4NCAYYiCkL/////D4N8Ig1C/////w+DIAlCIIhCAYYgBUIgiHwgB0IgiHwgBkIgiHwiBUL/////D4N8IgY+AgggASACIAN+IAA1AgwiCSAEfiIHQv////8Pg3wiC0L/////D4NCAYYiDEL/////D4MgCEIgiEIBhiAKQiCIfCANQiCIfCAGQiCIfCAFQiCIfCIGQv////8Pg3wiCD4CDCABIAIgAn4gAyAJfiAANQIQIgUgBH4iCkL/////D4N8Ig1C/////w+DQgGGIg5C/////w+DfCIPQv////8PgyALQiCIIAdCIIh8QgGGIAxCIIh8IAhCIIh8IAZCIIh8IgdC/////w+DfCIIPgIQIAEgAiAJfiADIAV+IAA1AhQiBiAEfiILQv////8Pg3wiDEL/////D4N8IhBC/////w+DQgGGIhFC/////w+DIA1CIIggCkIgiHxCAYYgDkIgiHwgD0IgiHwgCEIgiHwgB0IgiHwiCEL/////D4N8Igo+AhQgASAJIAl+IAIgBX4gAyAGfiAANQIYIgcgBH4iDUL/////D4N8Ig5C/////w+DfCIPQv////8Pg0IBhiISQv////8Pg3wiE0L/////D4MgDEIgiCALQiCIfCAQQiCIfEIBhiARQiCIfCAKQiCIfCAIQiCIfCIKQv////8Pg3wiCz4CGCABIAUgCX4gAiAGfiADIAd+IAA1AhwiCCAEfiIMQv////8Pg3wiEEL/////D4N8IhFC/////w+DfCIUQv////8Pg0IBhiIVQv////8PgyAOQiCIIA1CIIh8IA9CIIh8QgGGIBJCIIh8IBNCIIh8IAtCIIh8IApCIIh8Ig1C/////w+DfCILPgIcIAEgBSAFfiAGIAl+IAIgB34gAyAIfiAANQIgIgogBH4iDkL/////D4N8Ig9C/////w+DfCISQv////8Pg3wiE0L/////D4NCAYYiFkL/////D4N8IhdC/////w+DIBBCIIggDEIgiHwgEUIgiHwgFEIgiHxCAYYgFUIgiHwgC0IgiHwgDUIgiHwiC0L/////D4N8Igw+AiAgASAFIAZ+IAcgCX4gAiAIfiADIAp+IAA1AiQiDSAEfiIQQv////8Pg3wiEUL/////D4N8IhRC/////w+DfCIVQv////8Pg3wiGEL/////D4NCAYYiGUL/////D4MgD0IgiCAOQiCIfCASQiCIfCATQiCIfEIBhiAWQiCIfCAXQiCIfCAMQiCIfCALQiCIfCIMQv////8Pg3wiDj4CJCABIAYgBn4gBSAHfiAIIAl+IAIgCn4gAyANfiAANQIoIgsgBH4iD0L/////D4N8IhJC/////w+DfCITQv////8Pg3wiFkL/////D4N8IhdC/////w+DQgGGIhpC/////w+DfCIbQv////8PgyARQiCIIBBCIIh8IBRCIIh8IBVCIIh8IBhCIIh8QgGGIBlCIIh8IA5CIIh8IAxCIIh8IgxC/////w+DfCIOPgIoIAEgBiAHfiAFIAh+IAkgCn4gAiANfiADIAt+IAQgADUCLCIEfiIQQv////8Pg3wiEUL/////D4N8IhRC/////w+DfCIVQv////8Pg3wiGEL/////D4N8IhlC/////w+DQgGGIhxC/////w+DIBJCIIggD0IgiHwgE0IgiHwgFkIgiHwgF0IgiHxCAYYgGkIgiHwgG0IgiHwgDkIgiHwgDEIgiHwiDEL/////D4N8Ig4+AiwgASAHIAd+IAYgCH4gBSAKfiAJIA1+IAIgC34gAyAEfiIDQv////8Pg3wiD0L/////D4N8IhJC/////w+DfCITQv////8Pg3wiFkL/////D4NCAYYiF0L/////D4N8IhpC/////w+DIBFCIIggEEIgiHwgFEIgiHwgFUIgiHwgGEIgiHwgGUIgiHxCAYYgHEIgiHwgDkIgiHwgDEIgiHwiDEL/////D4N8Ig4+AjAgASAHIAh+IAYgCn4gBSANfiAJIAt+IAIgBH4iAkL/////D4N8IhBC/////w+DfCIRQv////8Pg3wiFEL/////D4N8IhVC/////w+DQgGGIhhC/////w+DIA9CIIggA0IgiHwgEkIgiHwgE0IgiHwgFkIgiHxCAYYgF0IgiHwgGkIgiHwgDkIgiHwgDEIgiHwiA0L/////D4N8Igw+AjQgASAIIAh+IAcgCn4gBiANfiAFIAt+IAQgCX4iCUL/////D4N8Ig5C/////w+DfCIPQv////8Pg3wiEkL/////D4NCAYYiE0L/////D4N8IhZC/////w+DIBBCIIggAkIgiHwgEUIgiHwgFEIgiHwgFUIgiHxCAYYgGEIgiHwgDEIgiHwgA0IgiHwiA0L/////D4N8IgI+AjggASAIIAp+IAcgDX4gBiALfiAEIAV+IgVC/////w+DfCIMQv////8Pg3wiEEL/////D4N8IhFC/////w+DQgGGIhRC/////w+DIA5CIIggCUIgiHwgD0IgiHwgEkIgiHxCAYYgE0IgiHwgFkIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AjwgASAKIAp+IAggDX4gByALfiAEIAZ+IglC/////w+DfCIGQv////8Pg3wiDkL/////D4NCAYYiD0L/////D4N8IhJC/////w+DIAxCIIggBUIgiHwgEEIgiHwgEUIgiHxCAYYgFEIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AkAgASAKIA1+IAggC34gBCAHfiIFQv////8Pg3wiB0L/////D4N8IgxC/////w+DQgGGIhBC/////w+DIAZCIIggCUIgiHwgDkIgiHxCAYYgD0IgiHwgEkIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AkQgASANIA1+IAogC34gBCAIfiIJQv////8Pg3wiBkL/////D4NCAYYiCEL/////D4N8Ig5C/////w+DIAdCIIggBUIgiHwgDEIgiHxCAYYgEEIgiHwgAkIgiHwgA0IgiHwiA0L/////D4N8IgI+AkggASALIA1+IAQgCn4iBUL/////D4N8IgdC/////w+DQgGGIgpC/////w+DIAZCIIggCUIgiHxCAYYgCEIgiHwgDkIgiHwgAkIg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BTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB6AU1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QewFNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEHwBTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB9AU1AgAgA358IgM+AjBB/AggA0IgiD4CACAAIAA1AgggADUCCEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIIIAAgADUCDCACQiCIfEHMBTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB0AU1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QdQFNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHYBTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB3AU1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QeAFNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHkBTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB6AU1AgAgA358IgI+AiggACAANQIsIAJCIIh8QewFNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEHwBTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxB9AU1AgAgA358IgM+AjRBgAkgA0IgiD4CACAAIAA1AgwgADUCDEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIMIAAgADUCECACQiCIfEHMBTUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB0AU1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QdQFNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEHYBTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB3AU1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QeAFNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEHkBTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB6AU1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QewFNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEHwBTUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxB9AU1AgAgA358IgM+AjhBhAkgA0IgiD4CACAAIAA1AhAgADUCEEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIQIAAgADUCFCACQiCIfEHMBTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB0AU1AgAgA358IgI+AhggACAANQIcIAJCIIh8QdQFNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEHYBTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB3AU1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QeAFNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEHkBTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB6AU1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QewFNQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEHwBTUCACADfnwiAj4COCAAIAA1AjwgAkIgiHxB9AU1AgAgA358IgM+AjxBiAkgA0IgiD4CACAAIAA1AhQgADUCFEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIUIAAgADUCGCACQiCIfEHMBTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB0AU1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QdQFNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHYBTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB3AU1AgAgA358IgI+AiggACAANQIsIAJCIIh8QeAFNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEHkBTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxB6AU1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QewFNQIAIAN+fCICPgI4IAAgADUCPCACQiCIfEHwBTUCACADfnwiAj4CPCAAIAA1AkAgAkIgiHxB9AU1AgAgA358IgM+AkBBjAkgA0IgiD4CACAAIAA1AhggADUCGEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIYIAAgADUCHCACQiCIfEHMBTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB0AU1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QdQFNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEHYBTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB3AU1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QeAFNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEHkBTUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxB6AU1AgAgA358IgI+AjggACAANQI8IAJCIIh8QewFNQIAIAN+fCICPgI8IAAgADUCQCACQiCIfEHwBTUCACADfnwiAj4CQCAAIAA1AkQgAkIgiHxB9AU1AgAgA358IgM+AkRBkAkgA0IgiD4CACAAIAA1AhwgADUCHEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIcIAAgADUCICACQiCIfEHMBTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB0AU1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QdQFNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEHYBTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB3AU1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QeAFNQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEHkBTUCACADfnwiAj4COCAAIAA1AjwgAkIgiHxB6AU1AgAgA358IgI+AjwgACAANQJAIAJCIIh8QewFNQIAIAN+fCICPgJAIAAgADUCRCACQiCIfEHwBTUCACADfnwiAj4CRCAAIAA1AkggAkIgiHxB9AU1AgAgA358IgM+AkhBlAkgA0IgiD4CACAAIAA1AiAgADUCIEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIgIAAgADUCJCACQiCIfEHMBTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB0AU1AgAgA358IgI+AiggACAANQIsIAJCIIh8QdQFNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEHYBTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxB3AU1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QeAFNQIAIAN+fCICPgI4IAAgADUCPCACQiCIfEHkBTUCACADfnwiAj4CPCAAIAA1AkAgAkIgiHxB6AU1AgAgA358IgI+AkAgACAANQJEIAJCIIh8QewFNQIAIAN+fCICPgJEIAAgADUCSCACQiCIfEHwBTUCACADfnwiAj4CSCAAIAA1AkwgAkIgiHxB9AU1AgAgA358IgM+AkxBmAkgA0IgiD4CACAAIAA1AiQgADUCJEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIkIAAgADUCKCACQiCIfEHMBTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB0AU1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QdQFNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEHYBTUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxB3AU1AgAgA358IgI+AjggACAANQI8IAJCIIh8QeAFNQIAIAN+fCICPgI8IAAgADUCQCACQiCIfEHkBTUCACADfnwiAj4CQCAAIAA1AkQgAkIgiHxB6AU1AgAgA358IgI+AkQgACAANQJIIAJCIIh8QewFNQIAIAN+fCICPgJIIAAgADUCTCACQiCIfEHwBTUCACADfnwiAj4CTCAAIAA1AlAgAkIgiHxB9AU1AgAgA358IgM+AlBBnAkgA0IgiD4CACAAIAA1AiggADUCKEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIoIAAgADUCLCACQiCIfEHMBTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB0AU1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QdQFNQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEHYBTUCACADfnwiAj4COCAAIAA1AjwgAkIgiHxB3AU1AgAgA358IgI+AjwgACAANQJAIAJCIIh8QeAFNQIAIAN+fCICPgJAIAAgADUCRCACQiCIfEHkBTUCACADfnwiAj4CRCAAIAA1AkggAkIgiHxB6AU1AgAgA358IgI+AkggACAANQJMIAJCIIh8QewFNQIAIAN+fCICPgJMIAAgADUCUCACQiCIfEHwBTUCACADfnwiAj4CUCAAIAA1AlQgAkIgiHxB9AU1AgAgA358IgM+AlRBoAkgA0IgiD4CACAAIAA1AiwgADUCLEL9//P/D35C/////w+DIgNByAU1AgB+fCICPgIsIAAgADUCMCACQiCIfEHMBTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxB0AU1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QdQFNQIAIAN+fCICPgI4IAAgADUCPCACQiCIfEHYBTUCACADfnwiAj4CPCAAIAA1AkAgAkIgiHxB3AU1AgAgA358IgI+AkAgACAANQJEIAJCIIh8QeAFNQIAIAN+fCICPgJEIAAgADUCSCACQiCIfEHkBTUCACADfnwiAj4CSCAAIAA1AkwgAkIgiHxB6AU1AgAgA358IgI+AkwgACAANQJQIAJCIIh8QewFNQIAIAN+fCICPgJQIAAgADUCVCACQiCIfEHwBTUCACADfnwiAj4CVCAAIAA1AlggAkIgiHxB9AU1AgAgA358IgM+AlhBpAkgA0IgiD4CAEH4CCAAQTBqIAEQDwvtNAFDfiAANQIAIgYgATUCACINfiIDQv////8Pg0L9//P/D35C/////w+DIg5ByAU1AgAiEH4gA0L/////D4N8QiCIIANCIIh8IQogBiABNQIIIgN+QcwFNQIAIgUgDn4gADUCBCIEIA1+IAYgATUCBCIHfiAKQv////8Pg3wiC0L/////D4N8IgxC/////w+DfCIIQv////8Pg0L9//P/D35C/////w+DIgkgEH4gCEL/////D4N8QiCIIAtCIIggCkIgiHwgDEIgiHwgCEIgiHx8IhJC/////w+DfCERIAMgBH4gBiABNQIMIgp+QdAFNQIAIgggDn4gBSAJfiAANQIIIgsgDX4gBCAHfiARQv////8Pg3wiE0L/////D4N8IhhC/////w+DfCIUQv////8Pg3wiD0L/////D4NC/f/z/w9+Qv////8PgyIMIBB+IA9C/////w+DfEIgiCARQiCIIBJCIIh8IBNCIIh8IBhCIIh8IBRCIIh8IA9CIIh8fCIpQv////8Pg3wiKkL/////D4N8IRggAyALfiAEIAp+IAYgATUCECIRfkHUBTUCACIPIA5+IAggCX4gBSAMfiAANQIMIhIgDX4gByALfiAYQv////8Pg3wiJEL/////D4N8IiVC/////w+DfCIrQv////8Pg3wiLEL/////D4N8IhRC/////w+DQv3/8/8PfkL/////D4MiEyAQfiAUQv////8Pg3xCIIggKkIgiCApQiCIfCAYQiCIfCAkQiCIfCAlQiCIfCArQiCIfCAsQiCIfCAUQiCIfHwiK0L/////D4N8IixC/////w+DfCImQv////8Pg3whJCADIBJ+IAogC34gBCARfiAGIAE1AhQiGH5B2AU1AgAiFCAOfiAJIA9+IAggDH4gBSATfiAANQIQIikgDX4gByASfiAkQv////8Pg3wiJ0L/////D4N8Ii1C/////w+DfCIuQv////8Pg3wiGUL/////D4N8IhpC/////w+DfCIlQv////8Pg0L9//P/D35C/////w+DIiogEH4gJUL/////D4N8QiCIICxCIIggK0IgiHwgJkIgiHwgJEIgiHwgJ0IgiHwgLUIgiHwgLkIgiHwgGUIgiHwgGkIgiHwgJUIgiHx8Ii1C/////w+DfCIuQv////8Pg3wiGUL/////D4N8IhpC/////w+DfCEmIAMgKX4gCiASfiALIBF+IAQgGH4gBiABNQIYIiR+QdwFNQIAIiUgDn4gCSAUfiAMIA9+IAggE34gBSAqfiAANQIUIisgDX4gByApfiAmQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiJ0L/////D4NC/f/z/w9+Qv////8PgyIsIBB+ICdC/////w+DfEIgiCAuQiCIIC1CIIh8IBlCIIh8IBpCIIh8ICZCIIh8IC9CIIh8IDBCIIh8IBtCIIh8IBxCIIh8IB9CIIh8ICBCIIh8ICdCIIh8fCIvQv////8Pg3wiMEL/////D4N8IhtC/////w+DfCIcQv////8Pg3wiH0L/////D4N8IRkgAyArfiAKICl+IBEgEn4gCyAYfiAEICR+IAYgATUCHCImfkHgBTUCACInIA5+IAkgJX4gDCAUfiAPIBN+IAggKn4gBSAsfiAANQIYIi0gDX4gByArfiAZQv////8Pg3wiIEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiIUL/////D4N8IiJC/////w+DfCIVQv////8Pg3wiFkL/////D4N8IhpC/////w+DQv3/8/8PfkL/////D4MiLiAQfiAaQv////8Pg3xCIIggMEIgiCAvQiCIfCAbQiCIfCAcQiCIfCAfQiCIfCAZQiCIfCAgQiCIfCAdQiCIfCAeQiCIfCAhQiCIfCAiQiCIfCAVQiCIfCAWQiCIfCAaQiCIfHwiH0L/////D4N8IiBC/////w+DfCIdQv////8Pg3wiHkL/////D4N8IiFC/////w+DfCIiQv////8Pg3whGyADIC1+IAogK34gESApfiASIBh+IAsgJH4gBCAmfiAGIAE1AiAiGX5B5AU1AgAiGiAOfiAJICd+IAwgJX4gEyAUfiAPICp+IAggLH4gBSAufiAANQIcIi8gDX4gByAtfiAbQv////8Pg3wiFUL/////D4N8IhZC/////w+DfCIjQv////8Pg3wiF0L/////D4N8IihC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCIcQv////8Pg0L9//P/D35C/////w+DIjAgEH4gHEL/////D4N8QiCIICBCIIggH0IgiHwgHUIgiHwgHkIgiHwgIUIgiHwgIkIgiHwgG0IgiHwgFUIgiHwgFkIgiHwgI0IgiHwgF0IgiHwgKEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwgHEIgiHx8IiFC/////w+DfCIiQv////8Pg3wiFUL/////D4N8IhZC/////w+DfCIjQv////8Pg3wiF0L/////D4N8IihC/////w+DfCEdIAMgL34gCiAtfiARICt+IBggKX4gEiAkfiALICZ+IAQgGX4gBiABNQIkIht+QegFNQIAIhwgDn4gCSAafiAMICd+IBMgJX4gFCAqfiAPICx+IAggLn4gBSAwfiAANQIgIh8gDX4gByAvfiAdQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCI2Qv////8Pg3wiN0L/////D4N8IjhC/////w+DfCI5Qv////8Pg3wiHkL/////D4NC/f/z/w9+Qv////8PgyIgIBB+IB5C/////w+DfEIgiCAiQiCIICFCIIh8IBVCIIh8IBZCIIh8ICNCIIh8IBdCIIh8IChCIIh8IB1CIIh8IDFCIIh8IDJCIIh8IDNCIIh8IDRCIIh8IDVCIIh8IDZCIIh8IDdCIIh8IDhCIIh8IDlCIIh8IB5CIIh8fCIjQv////8Pg3wiF0L/////D4N8IihC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUL/////D4N8IRUgAyAffiAKIC9+IBEgLX4gGCArfiAkICl+IBIgJn4gCyAZfiAEIBt+IAYgATUCKCIdfkHsBTUCACIeIA5+IAkgHH4gDCAafiATICd+ICUgKn4gFCAsfiAPIC5+IAggMH4gBSAgfiAANQIkIiEgDX4gByAffiAVQv////8Pg3wiNkL/////D4N8IjdC/////w+DfCI4Qv////8Pg3wiOUL/////D4N8IjpC/////w+DfCI7Qv////8Pg3wiPEL/////D4N8Ij1C/////w+DfCI+Qv////8Pg3wiP0L/////D4N8IhZC/////w+DQv3/8/8PfkL/////D4MiIiAQfiAWQv////8Pg3xCIIggF0IgiCAjQiCIfCAoQiCIfCAxQiCIfCAyQiCIfCAzQiCIfCA0QiCIfCA1QiCIfCAVQiCIfCA2QiCIfCA3QiCIfCA4QiCIfCA5QiCIfCA6QiCIfCA7QiCIfCA8QiCIfCA9QiCIfCA+QiCIfCA/QiCIfCAWQiCIfHwiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCI2Qv////8Pg3wiN0L/////D4N8IjhC/////w+DfCI5Qv////8Pg3whFyADICF+IAogH34gESAvfiAYIC1+ICQgK34gJiApfiASIBl+IAsgG34gBCAdfiAGIAE1AiwiFX5B8AU1AgAiBiAOfiAJIB5+IAwgHH4gEyAafiAnICp+ICUgLH4gFCAufiAPIDB+IAggIH4gBSAifiAANQIoIhYgDX4gByAhfiAXQv////8Pg3wiOkL/////D4N8IjtC/////w+DfCI8Qv////8Pg3wiPUL/////D4N8Ij5C/////w+DfCI/Qv////8Pg3wiQEL/////D4N8IkFC/////w+DfCJCQv////8Pg3wiQ0L/////D4N8IkRC/////w+DfCIoQv////8Pg0L9//P/D35C/////w+DIiMgEH4gKEL/////D4N8QiCIIDJCIIggMUIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgNkIgiHwgN0IgiHwgOEIgiHwgOUIgiHwgF0IgiHwgOkIgiHwgO0IgiHwgPEIgiHwgPUIgiHwgPkIgiHwgP0IgiHwgQEIgiHwgQUIgiHwgQkIgiHwgQ0IgiHwgREIgiHwgKEIgiHx8IihC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUL/////D4N8IjZC/////w+DfCI3Qv////8Pg3wiOEL/////D4N8IjlC/////w+DfCEXIAMgFn4gCiAhfiARIB9+IBggL34gJCAtfiAmICt+IBkgKX4gEiAbfiALIB1+IAQgFX4gECAOQfQFNQIAIg5+IAYgCX4gDCAefiATIBx+IBogKn4gJyAsfiAlIC5+IBQgMH4gDyAgfiAIICJ+IAUgI34gDSAANQIsIg1+IAcgFn4gF0L/////D4N8IjpC/////w+DfCI7Qv////8Pg3wiPEL/////D4N8Ij1C/////w+DfCI+Qv////8Pg3wiP0L/////D4N8IkBC/////w+DfCJBQv////8Pg3wiQkL/////D4N8IkNC/////w+DfCJEQv////8Pg3wiRUL/////D4N8IgRC/////w+DQv3/8/8PfkL/////D4MiEH4gBEL/////D4N8QiCIIDFCIIggKEIgiHwgMkIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgNkIgiHwgN0IgiHwgOEIgiHwgOUIgiHwgF0IgiHwgOkIgiHwgO0IgiHwgPEIgiHwgPUIgiHwgPkIgiHwgP0IgiHwgQEIgiHwgQUIgiHwgQkIgiHwgQ0IgiHwgREIgiHwgRUIgiHwgBEIgiHx8IhdC/////w+DfCIoQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCI2Qv////8Pg3wiN0L/////D4N8IjhC/////w+DfCEEIAkgDn4gBiAMfiATIB5+IBwgKn4gGiAsfiAnIC5+ICUgMH4gFCAgfiAPICJ+IAggI34gBSAQfiAHIA1+IARC/////w+DfCIFQv////8Pg3wiB0L/////D4N8IglC/////w+DfCI5Qv////8Pg3wiOkL/////D4N8IjtC/////w+DfCI8Qv////8Pg3wiPUL/////D4N8Ij5C/////w+DfCI/Qv////8Pg3wiQEL/////D4N8IkFCIIggKEIgiCAXQiCIfCAxQiCIfCAyQiCIfCAzQiCIfCA0QiCIfCA1QiCIfCA2QiCIfCA3QiCIfCA4QiCIfCAEQiCIfCAFQiCIfCAHQiCIfCAJQiCIfCA5QiCIfCA6QiCIfCA7QiCIfCA8QiCIfCA9QiCIfCA+QiCIfCA/QiCIfCBAQiCIfHwhBSACIEE+AgAgDCAOfiAGIBN+IB4gKn4gHCAsfiAaIC5+ICcgMH4gICAlfiAUICJ+IA8gI34gCCAQfiADIA1+IAogFn4gESAhfiAYIB9+ICQgL34gJiAtfiAZICt+IBsgKX4gEiAdfiALIBV+IAVC/////w+DfCIDQv////8Pg3wiBEL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCEL/////D4N8IgtC/////w+DfCIMQv////8Pg3wiF0L/////D4N8IihC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUL/////D4N8IjZC/////w+DfCI3Qv////8Pg3wiOEL/////D4N8IjlC/////w+DfCI6Qv////8Pg3wiO0IgiCADQiCIIAVCIIh8IARCIIh8IAdCIIh8IAlCIIh8IAhCIIh8IAtCIIh8IAxCIIh8IBdCIIh8IChCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IDRCIIh8IDVCIIh8IDZCIIh8IDdCIIh8IDhCIIh8IDlCIIh8IDpCIIh8fCEDIAIgOz4CBCAOIBN+IAYgKn4gHiAsfiAcIC5+IBogMH4gICAnfiAiICV+IBQgI34gDyAQfiAKIA1+IBEgFn4gGCAhfiAfICR+ICYgL34gGSAtfiAbICt+IB0gKX4gEiAVfiADQv////8Pg3wiBUL/////D4N8IgRC/////w+DfCIHQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCIIQv////8Pg3wiC0L/////D4N8IgxC/////w+DfCIPQv////8Pg3wiEkL/////D4N8IhNC/////w+DfCIXQv////8Pg3wiKEL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1QiCIIAVCIIggA0IgiHwgBEIgiHwgB0IgiHwgCUIgiHwgCkIgiHwgCEIgiHwgC0IgiHwgDEIgiHwgD0IgiHwgEkIgiHwgE0IgiHwgF0IgiHwgKEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwgNEIgiHx8IQMgAiA1PgIIIA4gKn4gBiAsfiAeIC5+IBwgMH4gGiAgfiAiICd+ICMgJX4gECAUfiANIBF+IBYgGH4gISAkfiAfICZ+IBkgL34gGyAtfiAdICt+IBUgKX4gA0L/////D4N8IgVC/////w+DfCIEQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiCEL/////D4N8IgtC/////w+DfCIMQv////8Pg3wiEUL/////D4N8Ig9C/////w+DfCISQv////8Pg3wiE0L/////D4N8IhRC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IhdCIIggBUIgiCADQiCIfCAEQiCIfCAHQiCIfCAJQiCIfCAKQiCIfCAIQiCIfCALQiCIfCAMQiCIfCARQiCIfCAPQiCIfCASQiCIfCATQiCIfCAUQiCIfCApQiCIfCAqQiCIfHwhAyACIBc+AgwgDiAsfiAGIC5+IB4gMH4gHCAgfiAaICJ+ICMgJ34gECAlfiANIBh+IBYgJH4gISAmfiAZIB9+IBsgL34gHSAtfiAVICt+IANC/////w+DfCIFQv////8Pg3wiBEL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IghC/////w+DfCILQv////8Pg3wiDEL/////D4N8IhFC/////w+DfCIPQv////8Pg3wiEkL/////D4N8IhNC/////w+DfCIYQv////8Pg3wiFEIgiCAFQiCIIANCIIh8IARCIIh8IAdCIIh8IAlCIIh8IApCIIh8IAhCIIh8IAtCIIh8IAxCIIh8IBFCIIh8IA9CIIh8IBJCIIh8IBNCIIh8IBhCIIh8fCEDIAIgFD4CECAOIC5+IAYgMH4gHiAgfiAcICJ+IBogI34gECAnfiANICR+IBYgJn4gGSAhfiAbIB9+IB0gL34gFSAtfiADQv////8Pg3wiBUL/////D4N8IgRC/////w+DfCIHQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCIIQv////8Pg3wiC0L/////D4N8IgxC/////w+DfCIRQv////8Pg3wiD0L/////D4N8IhJC/////w+DfCITQiCIIAVCIIggA0IgiHwgBEIgiHwgB0IgiHwgCUIgiHwgCkIgiHwgCEIgiHwgC0IgiHwgDEIgiHwgEUIgiHwgD0IgiHwgEkIgiHx8IQMgAiATPgIUIA4gMH4gBiAgfiAeICJ+IBwgI34gECAafiANICZ+IBYgGX4gGyAhfiAdIB9+IBUgL34gA0L/////D4N8IgVC/////w+DfCIEQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiCEL/////D4N8IgtC/////w+DfCIMQv////8Pg3wiEUL/////D4N8Ig9CIIggBUIgiCADQiCIfCAEQiCIfCAHQiCIfCAJQiCIfCAKQiCIfCAIQiCIfCALQiCIfCAMQiCIfCARQiCIfHwhAyACIA8+AhggDiAgfiAGICJ+IB4gI34gECAcfiANIBl+IBYgG34gHSAhfiAVIB9+IANC/////w+DfCIFQv////8Pg3wiBEL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IghC/////w+DfCILQv////8Pg3wiDEIgiCAFQiCIIANCIIh8IARCIIh8IAdCIIh8IAlCIIh8IApCIIh8IAhCIIh8IAtCIIh8fCEDIAIgDD4CHCAOICJ+IAYgI34gECAefiANIBt+IBYgHX4gFSAhfiADQv////8Pg3wiBUL/////D4N8IgRC/////w+DfCIHQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCIIQiCIIAVCIIggA0IgiHwgBEIgiHwgB0IgiHwgCUIgiHwgCkIgiHx8IQMgAiAIPgIgIA4gI34gBiAQfiANIB1+IBUgFn4gA0L/////D4N8IgZC/////w+DfCIFQv////8Pg3wiBEL/////D4N8IgdCIIggBkIgiCADQiCIfCAFQiCIfCAEQiCIfHwhBiACIAc+AiQgDiAQfiANIBV+IAZC/////w+DfCINQv////8Pg3wiDkIgiCANQiCIIAZCIIh8fCEGIAIgDj4CKCACIAY+AiwgBkIgiKcEQCACQcgFIAIQBxoFIAJByAUQBQRAIAJByAUgAhAHGgsLC7QvATV+IAA1AgAiCiAKfiICQv////8Pg0L9//P/D35C/////w+DIg9ByAU1AgAiEH4gAkL/////D4N8QiCIIAJCIIh8IQRBzAU1AgAiDSAPfiAANQIEIgIgCn4iBUL/////D4NCAYYiBkL/////D4MgBEL/////D4N8IgdC/////w+DfCIDQv////8Pg0L9//P/D35C/////w+DIg4gEH4gA0L/////D4N8QiCIIAVCIIhCAYYgBkIgiHwgB0IgiHwgBEIgiHwgA0IgiHx8IQNB0AU1AgAiESAPfiANIA5+IAIgAn4gADUCCCIEIAp+IgZC/////w+DQgGGIgdC/////w+DfCILQv////8PgyADQv////8Pg3wiCEL/////D4N8IglC/////w+DfCIFQv////8Pg0L9//P/D35C/////w+DIhMgEH4gBUL/////D4N8QiCIIAZCIIhCAYYgB0IgiHwgC0IgiHwgCEIgiHwgA0IgiHwgCUIgiHwgBUIgiHx8IQVB1AU1AgAiFSAPfiAOIBF+IA0gE34gAiAEfiAANQIMIgMgCn4iB0L/////D4N8IgtC/////w+DQgGGIghC/////w+DIAVC/////w+DfCIJQv////8Pg3wiDEL/////D4N8IhhC/////w+DfCIGQv////8Pg0L9//P/D35C/////w+DIhkgEH4gBkL/////D4N8QiCIIAtCIIggB0IgiHxCAYYgCEIgiHwgCUIgiHwgBUIgiHwgDEIgiHwgGEIgiHwgBkIgiHx8IQZB2AU1AgAiGCAPfiAOIBV+IBEgE34gDSAZfiAEIAR+IAIgA34gADUCECIFIAp+IgtC/////w+DfCIIQv////8Pg0IBhiIJQv////8Pg3wiDEL/////D4MgBkL/////D4N8IhpC/////w+DfCIgQv////8Pg3wiIUL/////D4N8IiJC/////w+DfCIHQv////8Pg0L9//P/D35C/////w+DIiMgEH4gB0L/////D4N8QiCIIAhCIIggC0IgiHxCAYYgCUIgiHwgDEIgiHwgGkIgiHwgBkIgiHwgIEIgiHwgIUIgiHwgIkIgiHwgB0IgiHx8IQdB3AU1AgAiGiAPfiAOIBh+IBMgFX4gESAZfiANICN+IAMgBH4gAiAFfiAANQIUIgYgCn4iCEL/////D4N8IglC/////w+DfCIMQv////8Pg0IBhiIhQv////8PgyAHQv////8Pg3wiIkL/////D4N8IiRC/////w+DfCIlQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCILQv////8Pg0L9//P/D35C/////w+DIiAgEH4gC0L/////D4N8QiCIIAlCIIggCEIgiHwgDEIgiHxCAYYgIUIgiHwgIkIgiHwgB0IgiHwgJEIgiHwgJUIgiHwgG0IgiHwgHEIgiHwgC0IgiHx8IQtB4AU1AgAiISAPfiAOIBp+IBMgGH4gFSAZfiARICN+IA0gIH4gAyADfiAEIAV+IAIgBn4gADUCGCIHIAp+IglC/////w+DfCIMQv////8Pg3wiJEL/////D4NCAYYiJUL/////D4N8IhtC/////w+DIAtC/////w+DfCIcQv////8Pg3wiHUL/////D4N8Ih5C/////w+DfCIUQv////8Pg3wiFkL/////D4N8IhJC/////w+DfCIIQv////8Pg0L9//P/D35C/////w+DIiIgEH4gCEL/////D4N8QiCIIAxCIIggCUIgiHwgJEIgiHxCAYYgJUIgiHwgG0IgiHwgHEIgiHwgC0IgiHwgHUIgiHwgHkIgiHwgFEIgiHwgFkIgiHwgEkIgiHwgCEIgiHx8IQhB5AU1AgAiJCAPfiAOICF+IBMgGn4gGCAZfiAVICN+IBEgIH4gDSAifiADIAV+IAQgBn4gAiAHfiAANQIcIgsgCn4iDEL/////D4N8IhtC/////w+DfCIcQv////8Pg3wiHUL/////D4NCAYYiHkL/////D4MgCEL/////D4N8IhRC/////w+DfCIWQv////8Pg3wiEkL/////D4N8IhdC/////w+DfCIfQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIJQv////8Pg0L9//P/D35C/////w+DIiUgEH4gCUL/////D4N8QiCIIBtCIIggDEIgiHwgHEIgiHwgHUIgiHxCAYYgHkIgiHwgFEIgiHwgCEIgiHwgFkIgiHwgEkIgiHwgF0IgiHwgH0IgiHwgJkIgiHwgJ0IgiHwgCUIgiHx8IQlB6AU1AgAiGyAPfiAOICR+IBMgIX4gGSAafiAYICN+IBUgIH4gESAifiANICV+IAUgBX4gAyAGfiAEIAd+IAIgC34gADUCICIIIAp+Ih1C/////w+DfCIeQv////8Pg3wiFEL/////D4N8IhZC/////w+DQgGGIhJC/////w+DfCIXQv////8PgyAJQv////8Pg3wiH0L/////D4N8IiZC/////w+DfCInQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg3wiK0L/////D4N8IixC/////w+DfCIMQv////8Pg0L9//P/D35C/////w+DIhwgEH4gDEL/////D4N8QiCIIB5CIIggHUIgiHwgFEIgiHwgFkIgiHxCAYYgEkIgiHwgF0IgiHwgH0IgiHwgCUIgiHwgJkIgiHwgJ0IgiHwgKEIgiHwgKUIgiHwgKkIgiHwgK0IgiHwgLEIgiHwgDEIgiHx8IQxB7AU1AgAiHSAPfiAOIBt+IBMgJH4gGSAhfiAaICN+IBggIH4gFSAifiARICV+IA0gHH4gBSAGfiADIAd+IAQgC34gAiAIfiAANQIkIgkgCn4iFkL/////D4N8IhJC/////w+DfCIXQv////8Pg3wiH0L/////D4N8IiZC/////w+DQgGGIidC/////w+DIAxC/////w+DfCIoQv////8Pg3wiKUL/////D4N8IipC/////w+DfCIrQv////8Pg3wiLEL/////D4N8Ii1C/////w+DfCIuQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIUQv////8Pg0L9//P/D35C/////w+DIh4gEH4gFEL/////D4N8QiCIIBJCIIggFkIgiHwgF0IgiHwgH0IgiHwgJkIgiHxCAYYgJ0IgiHwgKEIgiHwgDEIgiHwgKUIgiHwgKkIgiHwgK0IgiHwgLEIgiHwgLUIgiHwgLkIgiHwgL0IgiHwgMEIgiHwgFEIgiHx8IRJB8AU1AgAiFCAPfiAOIB1+IBMgG34gGSAkfiAhICN+IBogIH4gGCAifiAVICV+IBEgHH4gDSAefiAGIAZ+IAUgB34gAyALfiAEIAh+IAIgCX4gADUCKCIMIAp+Ih9C/////w+DfCImQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg0IBhiIqQv////8Pg3wiK0L/////D4MgEkL/////D4N8IixC/////w+DfCItQv////8Pg3wiLkL/////D4N8Ii9C/////w+DfCIwQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCIXQv////8Pg0L9//P/D35C/////w+DIhYgEH4gF0L/////D4N8QiCIICZCIIggH0IgiHwgJ0IgiHwgKEIgiHwgKUIgiHxCAYYgKkIgiHwgK0IgiHwgLEIgiHwgEkIgiHwgLUIgiHwgLkIgiHwgL0IgiHwgMEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgF0IgiHx8IRIgECAPQfQFNQIAIg9+IA4gFH4gEyAdfiAZIBt+ICMgJH4gICAhfiAaICJ+IBggJX4gFSAcfiARIB5+IA0gFn4gBiAHfiAFIAt+IAMgCH4gBCAJfiACIAx+IAogADUCLCIKfiIfQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUL/////D4N8IipC/////w+DQgGGIitC/////w+DIBJC/////w+DfCIsQv////8Pg3wiLUL/////D4N8Ii5C/////w+DfCIvQv////8Pg3wiMEL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1Qv////8Pg3wiNkL/////D4N8IhdC/////w+DQv3/8/8PfkL/////D4MiEH4gF0L/////D4N8QiCIICZCIIggH0IgiHwgJ0IgiHwgKEIgiHwgKUIgiHwgKkIgiHxCAYYgK0IgiHwgLEIgiHwgEkIgiHwgLUIgiHwgLkIgiHwgL0IgiHwgMEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgNkIgiHwgF0IgiHx8IRIgASAOIA9+IBMgFH4gGSAdfiAbICN+ICAgJH4gISAifiAaICV+IBggHH4gFSAefiARIBZ+IA0gEH4gByAHfiAGIAt+IAUgCH4gAyAJfiAEIAx+IAIgCn4iAkL/////D4N8Ig1C/////w+DfCIOQv////8Pg3wiF0L/////D4N8Ih9C/////w+DQgGGIiZC/////w+DfCInQv////8PgyASQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg3wiK0L/////D4N8IixC/////w+DfCItQv////8Pg3wiLkL/////D4N8Ii9C/////w+DfCIwQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzPgIAIAEgDyATfiAUIBl+IB0gI34gGyAgfiAiICR+ICEgJX4gGiAcfiAYIB5+IBUgFn4gECARfiAHIAt+IAYgCH4gBSAJfiADIAx+IAQgCn4iBEL/////D4N8IhFC/////w+DfCITQv////8Pg3wiNEL/////D4N8IjVC/////w+DQgGGIjZC/////w+DIA1CIIggAkIgiHwgDkIgiHwgF0IgiHwgH0IgiHxCAYYgJkIgiHwgJ0IgiHwgKEIgiHwgEkIgiHwgKUIgiHwgKkIgiHwgK0IgiHwgLEIgiHwgLUIgiHwgLkIgiHwgL0IgiHwgMEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwiAkL/////D4N8Ig1C/////w+DfCIOQv////8Pg3wiEkL/////D4N8IhdC/////w+DfCIfQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUL/////D4N8IipC/////w+DfCIrPgIEIAEgDyAZfiAUICN+IB0gIH4gGyAifiAkICV+IBwgIX4gGiAefiAWIBh+IBAgFX4gCyALfiAHIAh+IAYgCX4gBSAMfiADIAp+IgNC/////w+DfCIVQv////8Pg3wiGUL/////D4N8IixC/////w+DQgGGIi1C/////w+DfCIuQv////8PgyARQiCIIARCIIh8IBNCIIh8IDRCIIh8IDVCIIh8QgGGIDZCIIh8IA1CIIh8IAJCIIh8IA5CIIh8IBJCIIh8IBdCIIh8IB9CIIh8ICZCIIh8ICdCIIh8IChCIIh8IClCIIh8ICpCIIh8ICtCIIh8IgJC/////w+DfCIEQv////8Pg3wiDUL/////D4N8Ig5C/////w+DfCIRQv////8Pg3wiE0L/////D4N8IhJC/////w+DfCIXQv////8Pg3wiH0L/////D4N8IiZC/////w+DfCInPgIIIAEgDyAjfiAUICB+IB0gIn4gGyAlfiAcICR+IB4gIX4gFiAafiAQIBh+IAggC34gByAJfiAGIAx+IAUgCn4iBUL/////D4N8IhhC/////w+DfCIjQv////8Pg3wiKEL/////D4NCAYYiKUL/////D4MgFUIgiCADQiCIfCAZQiCIfCAsQiCIfEIBhiAtQiCIfCAuQiCIfCAEQiCIfCACQiCIfCANQiCIfCAOQiCIfCARQiCIfCATQiCIfCASQiCIfCAXQiCIfCAfQiCIfCAmQiCIfCAnQiCIfCICQv////8Pg3wiBEL/////D4N8IgNC/////w+DfCINQv////8Pg3wiDkL/////D4N8IhFC/////w+DfCITQv////8Pg3wiFUL/////D4N8IhlC/////w+DfCISPgIMIAEgDyAgfiAUICJ+IB0gJX4gGyAcfiAeICR+IBYgIX4gECAafiAIIAh+IAkgC34gByAMfiAGIAp+IgZC/////w+DfCIaQv////8Pg3wiIEL/////D4NCAYYiF0L/////D4N8Ih9C/////w+DIBhCIIggBUIgiHwgI0IgiHwgKEIgiHxCAYYgKUIgiHwgBEIgiHwgAkIgiHwgA0IgiHwgDUIgiHwgDkIgiHwgEUIgiHwgE0IgiHwgFUIgiHwgGUIgiHwgEkIgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiBUL/////D4N8Ig1C/////w+DfCIOQv////8Pg3wiEUL/////D4N8IhNC/////w+DfCIVPgIQIAEgDyAifiAUICV+IBwgHX4gGyAefiAWICR+IBAgIX4gCCAJfiALIAx+IAcgCn4iB0L/////D4N8IhlC/////w+DfCIYQv////8Pg0IBhiIjQv////8PgyAaQiCIIAZCIIh8ICBCIIh8QgGGIBdCIIh8IB9CIIh8IARCIIh8IAJCIIh8IANCIIh8IAVCIIh8IA1CIIh8IA5CIIh8IBFCIIh8IBNCIIh8IBVCIIh8IgJC/////w+DfCIEQv////8Pg3wiA0L/////D4N8IgVC/////w+DfCIGQv////8Pg3wiDUL/////D4N8Ig5C/////w+DfCIRPgIUIAEgDyAlfiAUIBx+IB0gHn4gFiAbfiAQICR+IAkgCX4gCCAMfiAKIAt+IgtC/////w+DfCITQv////8Pg0IBhiIVQv////8Pg3wiGkL/////D4MgGUIgiCAHQiCIfCAYQiCIfEIBhiAjQiCIfCAEQiCIfCACQiCIfCADQiCIfCAFQiCIfCAGQiCIfCANQiCIfCAOQiCIfCARQiCIfCICQv////8Pg3wiBEL/////D4N8IgNC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCINPgIYIAEgDyAcfiAUIB5+IBYgHX4gECAbfiAJIAx+IAggCn4iCEL/////D4N8Ig5C/////w+DQgGGIhFC/////w+DIBNCIIggC0IgiHxCAYYgFUIgiHwgGkIgiHwgBEIgiHwgAkIgiHwgA0IgiHwgBUIgiHwgBkIgiHwgB0IgiHwgDUIgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiBUL/////D4N8IgZC/////w+DfCIHPgIcIAEgDyAefiAUIBZ+IBAgHX4gDCAMfiAJIAp+IgtC/////w+DQgGGIglC/////w+DfCIN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cwAgACkDGCABKQMYVAR/QQAFIAApAxggASkDGFYEf0EBBSAAKQMQIAEpAxBUBH9BAAUgACkDECABKQMQVgR/QQEFIAApAwggASkDCFQEf0EABSAAKQMIIAEpAwhWBH9BAQUgACkDACABKQMAWgsLCwsLCwvEAQEBfiACIAA1AgAgATUCAHwiAz4CACACIAA1AgQgATUCBHwgA0IgiHwiAz4CBCACIAA1AgggATUCCHwgA0IgiHwiAz4CCCACIAA1AgwgATUCDHwgA0IgiHwiAz4CDCACIAA1AhAgATUCEHwgA0IgiHwiAz4CECACIAA1AhQgATUCFHwgA0IgiHwiAz4CFCACIAA1AhggATUCGHwgA0IgiHwiAz4CGCACIAA1AhwgATUCHHwgA0IgiHwiAz4CHCADQiCIpwv8AQEBfiACIAA1AgAgATUCAH0iA0L/////D4M+AgAgAiAANQIEIAE1AgR9IANCIId8IgNC/////w+DPgIEIAIgADUCCCABNQIIfSADQiCHfCIDQv////8Pgz4CCCACIAA1AgwgATUCDH0gA0Igh3wiA0L/////D4M+AgwgAiAANQIQIAE1AhB9IANCIId8IgNC/////w+DPgIQIAIgADUCFCABNQIUfSADQiCHfCIDQv////8Pgz4CFCACIAA1AhggATUCGH0gA0Igh3wiA0L/////D4M+AhggAiAANQIcIAE1Ahx9IANCIId8IgNC/////w+DPgIcIANCIIenC90MARd+IAA1AgAiAyABNQIAIgd+IgRCIIghBiACIAQ+AgAgADUCBCIEIAd+IAMgATUCBCIFfiAGQv////8Pg3wiCEL/////D4N8Ig9CIIggCEIgiCAGQiCIfHwhCyACIA8+AgQgADUCCCIGIAd+IAQgBX4gAyABNQIIIgh+IAtC/////w+DfCIPQv////8Pg3wiDEL/////D4N8IhBCIIggD0IgiCALQiCIfCAMQiCIfHwhDCACIBA+AgggADUCDCILIAd+IAUgBn4gBCAIfiADIAE1AgwiD34gDEL/////D4N8IhBC/////w+DfCINQv////8Pg3wiEUL/////D4N8IglCIIggEEIgiCAMQiCIfCANQiCIfCARQiCIfHwhDSACIAk+AgwgADUCECIMIAd+IAUgC34gBiAIfiAEIA9+IAMgATUCECIQfiANQv////8Pg3wiEUL/////D4N8IglC/////w+DfCISQv////8Pg3wiCkL/////D4N8Ig5CIIggEUIgiCANQiCIfCAJQiCIfCASQiCIfCAKQiCIfHwhCSACIA4+AhAgADUCFCINIAd+IAUgDH4gCCALfiAGIA9+IAQgEH4gAyABNQIUIhF+IAlC/////w+DfCISQv////8Pg3wiCkL/////D4N8Ig5C/////w+DfCITQv////8Pg3wiFEL/////D4N8IhVCIIggEkIgiCAJQiCIfCAKQiCIfCAOQiCIfCATQiCIfCAUQiCIfHwhCiACIBU+AhQgADUCGCIJIAd+IAUgDX4gCCAMfiALIA9+IAYgEH4gBCARfiADIAE1AhgiEn4gCkL/////D4N8Ig5C/////w+DfCITQv////8Pg3wiFEL/////D4N8IhVC/////w+DfCIWQv////8Pg3wiF0L/////D4N8IhhCIIggDkIgiCAKQiCIfCATQiCIfCAUQiCIfCAVQiCIfCAWQiCIfCAXQiCIfHwhDiACIBg+AhggByAANQIcIgd+IAUgCX4gCCANfiAMIA9+IAsgEH4gBiARfiAEIBJ+IAMgATUCHCIKfiAOQv////8Pg3wiA0L/////D4N8IhNC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhZC/////w+DfCIXQv////8Pg3wiGEL/////D4N8IhlCIIggA0IgiCAOQiCIfCATQiCIfCAUQiCIfCAVQiCIfCAWQiCIfCAXQiCIfCAYQiCIfHwhAyACIBk+AhwgBSAHfiAIIAl+IA0gD34gDCAQfiALIBF+IAYgEn4gBCAKfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIOQv////8Pg3wiE0L/////D4N8IhRC/////w+DfCIVQv////8Pg3wiFkIgiCAEQiCIIANCIIh8IAVCIIh8IA5CIIh8IBNCIIh8IBRCIIh8IBVCIIh8fCEDIAIgFj4CICAHIAh+IAkgD34gDSAQfiAMIBF+IAsgEn4gBiAKfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiCEL/////D4N8Ig5C/////w+DfCITQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgCEIgiHwgDkIgiHx8IQMgAiATPgIkIAcgD34gCSAQfiANIBF+IAwgEn4gCiALfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiCEL/////D4N8IgtCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAIQiCIfHwhAyACIAs+AiggByAQfiAJIBF+IA0gEn4gCiAMfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiCEIgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8fCEDIAIgCD4CLCAHIBF+IAkgEn4gCiANfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQiCIIARCIIggA0IgiHwgBUIgiHx8IQMgAiAGPgIwIAcgEn4gCSAKfiADQv////8Pg3wiBEL/////D4N8IgVCIIggBEIgiCADQiCIfHwhAyACIAU+AjQgByAKfiADQv////8Pg3wiB0IgiCADQiCIfCEDIAIgBz4COCACIAM+AjwLrAsBE34gASAANQIAIgQgBH4iAj4CACABIAA1AgQiAyAEfiIKQv////8Pg0IBhiIGQv////8PgyACQiCIIgdC/////w+DfCIIPgIEIAEgAyADfiAANQIIIgIgBH4iBUL/////D4NCAYYiCUL/////D4N8IgtC/////w+DIApCIIhCAYYgBkIgiHwgCEIgiHwgB0IgiHwiBkL/////D4N8Igc+AgggASACIAN+IAA1AgwiCiAEfiIIQv////8Pg3wiDEL/////D4NCAYYiDUL/////D4MgBUIgiEIBhiAJQiCIfCALQiCIfCAHQiCIfCAGQiCIfCIHQv////8Pg3wiBT4CDCABIAIgAn4gAyAKfiAANQIQIgYgBH4iCUL/////D4N8IgtC/////w+DQgGGIg5C/////w+DfCIPQv////8PgyAMQiCIIAhCIIh8QgGGIA1CIIh8IAVCIIh8IAdCIIh8IghC/////w+DfCIFPgIQIAEgAiAKfiADIAZ+IAA1AhQiByAEfiIMQv////8Pg3wiDUL/////D4N8IhBC/////w+DQgGGIhFC/////w+DIAtCIIggCUIgiHxCAYYgDkIgiHwgD0IgiHwgBUIgiHwgCEIgiHwiBUL/////D4N8Igk+AhQgASAKIAp+IAIgBn4gAyAHfiAANQIYIgggBH4iC0L/////D4N8Ig5C/////w+DfCIPQv////8Pg0IBhiISQv////8Pg3wiE0L/////D4MgDUIgiCAMQiCIfCAQQiCIfEIBhiARQiCIfCAJQiCIfCAFQiCIfCIFQv////8Pg3wiCT4CGCABIAYgCn4gAiAHfiADIAh+IAQgADUCHCIEfiIMQv////8Pg3wiDUL/////D4N8IhBC/////w+DfCIRQv////8Pg0IBhiIUQv////8PgyAOQiCIIAtCIIh8IA9CIIh8QgGGIBJCIIh8IBNCIIh8IAlCIIh8IAVCIIh8IgVC/////w+DfCIJPgIcIAEgBiAGfiAHIAp+IAIgCH4gAyAEfiIDQv////8Pg3wiC0L/////D4N8Ig5C/////w+DQgGGIg9C/////w+DfCISQv////8PgyANQiCIIAxCIIh8IBBCIIh8IBFCIIh8QgGGIBRCIIh8IAlCIIh8IAVCIIh8IgVC/////w+DfCIJPgIgIAEgBiAHfiAIIAp+IAIgBH4iAkL/////D4N8IgxC/////w+DfCINQv////8Pg0IBhiIQQv////8PgyALQiCIIANCIIh8IA5CIIh8QgGGIA9CIIh8IBJCIIh8IAlCIIh8IAVCIIh8IgNC/////w+DfCIFPgIkIAEgByAHfiAGIAh+IAQgCn4iCkL/////D4N8IglC/////w+DQgGGIgtC/////w+DfCIOQv////8PgyAMQiCIIAJCIIh8IA1CIIh8QgGGIBBCIIh8IAVCIIh8IANCIIh8IgNC/////w+DfCICPgIoIAEgByAIfiAEIAZ+IgZC/////w+DfCIFQv////8Pg0IBhiIMQv////8PgyAJQiCIIApCIIh8QgGGIAtCIIh8IA5CIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgIsIAEgCCAIfiAEIAd+IgpC/////w+DQgGGIgdC/////w+DfCIJQv////8PgyAFQiCIIAZCIIh8QgGGIAxCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgIwIAEgBCAIfiIGQv////8Pg0IBhiIIQv////8PgyAKQiCIQgGGIAdCIIh8IAlCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgI0IAEgBCAEfiIEQv////8PgyAGQiCIQgGGIAhCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgI4IAEgAkIgiCAEQiCIfCADQiCIfD4CPAsKACAAIAAgARAsC7IDAgN+AX8gACADQYgYIAMbIgcQJCABQcgXECQgAkHoFyACGyIDECVBqBgQJUEfIQBBHyEBA0AgAUHIF2otAAAgAUEDRnJFBEAgAUEBayEBDAELCyABQcUXajUAAEIBfCIGQgFRBEBCAEIAgBoLA0ACQANAIAAgB2otAAAgAEEHRnJFBEAgAEEBayEADAELCyAAIAdqQQdrKQAAIAaAIQQgACABa0EEayECA0AgBEKAgICAcINQIAJBAE5xRQRAIARCCIghBCACQQFqIQIMAQsLIARQBEAgB0HIFxApRQ0BQgEhBEEAIQILQcgYQcgXNQAAIAR+IgU+AABBzBhBzBc1AAAgBH4gBUIgiHwiBT4AAEHQGEHQFzUAACAEfiAFQiCIfCIFPgAAQdQYQdQXNQAAIAR+IAVCIIh8IgU+AABB2BhB2Bc1AAAgBH4gBUIgiHwiBT4AAEHcGEHcFzUAACAEfiAFQiCIfCIFPgAAQeAYQeAXNQAAIAR+IAVCIIh8IgU+AABB5BhB5Bc1AAAgBH4gBUIgiHw+AAAgB0HIGCACayAHECsaIAIgA2ogBBALDAELCwv/AQEJf0HoGCEDQegYECVBiBkhCCABQYgZECRBqBkhCUGoGRAnQcgZIQYgAEHIGRAkQYgaIQpB6BohBANAIAYQJkUEQCAIIAZB6BkgChAvQegZIAlBqBoQLCAHBH8gBQR/QagaIAMQKQR/QagaIAMgBBArGkEABSADQagaIAQQKxpBAQsFQagaIAMgBBAqGkEBCwUgBQR/QagaIAMgBBAqGkEABSADQagaECkEfyADQagaIAQQKxpBAAVBqBogAyAEECsaQQELCwsgAyAJIQMgBCEJIQQgBSEHIQUgCCAGIQggCiEGIQoMAQsLIAcEQCABIAMgAhArGgUgAyACECQLCwkAIABByBsQKAssACAAIAEgAhAqBEAgAkGIGyACECsaBSACQYgbECkEQCACQYgbIAIQKxoLCwsXACAAIAEgAhArBEAgAkGIGyACECoaCwsLAEHoGyAAIAEQMwvQDwECfiAAIAA1AgAgADUCAEL/////D35C/////w+DIgNBiBs1AgB+fCICPgIAIAAgADUCBCACQiCIfEGMGzUCACADfnwiAj4CBCAAIAA1AgggAkIgiHxBkBs1AgAgA358IgI+AgggACAANQIMIAJCIIh8QZQbNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEGYGzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxBnBs1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QaAbNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGkGzUCACADfnwiAz4CHEGoHSADQiCIPgIAIAAgADUCBCAANQIEQv////8PfkL/////D4MiA0GIGzUCAH58IgI+AgQgACAANQIIIAJCIIh8QYwbNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEGQGzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxBlBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZgbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGcGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBoBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QaQbNQIAIAN+fCIDPgIgQawdIANCIIg+AgAgACAANQIIIAA1AghC/////w9+Qv////8PgyIDQYgbNQIAfnwiAj4CCCAAIAA1AgwgAkIgiHxBjBs1AgAgA358IgI+AgwgACAANQIQIAJCIIh8QZAbNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEGUGzUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxBmBs1AgAgA358IgI+AhggACAANQIcIAJCIIh8QZwbNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGgGzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBpBs1AgAgA358IgM+AiRBsB0gA0IgiD4CACAAIAA1AgwgADUCDEL/////D35C/////w+DIgNBiBs1AgB+fCICPgIMIAAgADUCECACQiCIfEGMGzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxBkBs1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QZQbNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGYGzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBnBs1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QaAbNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGkGzUCACADfnwiAz4CKEG0HSADQiCIPgIAIAAgADUCECAANQIQQv////8PfkL/////D4MiA0GIGzUCAH58IgI+AhAgACAANQIUIAJCIIh8QYwbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGQGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBlBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZgbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGcGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBoBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QaQbNQIAIAN+fCIDPgIsQbgdIANCIIg+AgAgACAANQIUIAA1AhRC/////w9+Qv////8PgyIDQYgbNQIAfnwiAj4CFCAAIAA1AhggAkIgiHxBjBs1AgAgA358IgI+AhggACAANQIcIAJCIIh8QZAbNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGUGzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBmBs1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QZwbNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGgGzUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBpBs1AgAgA358IgM+AjBBvB0gA0IgiD4CACAAIAA1AhggADUCGEL/////D35C/////w+DIgNBiBs1AgB+fCICPgIYIAAgADUCHCACQiCIfEGMGzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBkBs1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QZQbNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGYGzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxBnBs1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QaAbNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEGkGzUCACADfnwiAz4CNEHAHSADQiCIPgIAIAAgADUCHCAANQIcQv////8PfkL/////D4MiA0GIGzUCAH58IgI+AhwgACAANQIgIAJCIIh8QYwbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGQGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBlBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QZgbNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGcGzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBoBs1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QaQbNQIAIAN+fCIDPgI4QcQdIANCIIg+AgBBqB0gAEEgaiABEDIL5RgBK34gADUCACIEIAE1AgAiCX4iA0L/////D4NC/////w9+Qv////8PgyIKQYgbNQIAIg1+IANC/////w+DfEIgiCADQiCIfCEMIAQgATUCCCIDfkGMGzUCACIGIAp+IAA1AgQiBSAJfiAEIAE1AgQiB34gDEL/////D4N8Ig5C/////w+DfCIPQv////8Pg3wiCEL/////D4NC/////w9+Qv////8PgyILIA1+IAhC/////w+DfEIgiCAOQiCIIAxCIIh8IA9CIIh8IAhCIIh8fCIZQv////8Pg3whHiADIAV+IAQgATUCDCIMfkGQGzUCACIIIAp+IAYgC34gADUCCCIOIAl+IAUgB34gHkL/////D4N8Ih9C/////w+DfCIRQv////8Pg3wiEkL/////D4N8IhNC/////w+DQv////8PfkL/////D4MiDyANfiATQv////8Pg3xCIIggHkIgiCAZQiCIfCAfQiCIfCARQiCIfCASQiCIfCATQiCIfHwiIEL/////D4N8IiFC/////w+DfCERIAMgDn4gBSAMfiAEIAE1AhAiHn5BlBs1AgAiEyAKfiAIIAt+IAYgD34gADUCDCIZIAl+IAcgDn4gEUL/////D4N8IhRC/////w+DfCIVQv////8Pg3wiGkL/////D4N8IhtC/////w+DfCISQv////8Pg0L/////D35C/////w+DIh8gDX4gEkL/////D4N8QiCIICFCIIggIEIgiHwgEUIgiHwgFEIgiHwgFUIgiHwgGkIgiHwgG0IgiHwgEkIgiHx8IhpC/////w+DfCIbQv////8Pg3wiFkL/////D4N8IRQgAyAZfiAMIA5+IAUgHn4gBCABNQIUIhF+QZgbNQIAIhIgCn4gCyATfiAIIA9+IAYgH34gADUCECIgIAl+IAcgGX4gFEL/////D4N8IhdC/////w+DfCIcQv////8Pg3wiEEL/////D4N8IhhC/////w+DfCIdQv////8Pg3wiFUL/////D4NC/////w9+Qv////8PgyIhIA1+IBVC/////w+DfEIgiCAbQiCIIBpCIIh8IBZCIIh8IBRCIIh8IBdCIIh8IBxCIIh8IBBCIIh8IBhCIIh8IB1CIIh8IBVCIIh8fCIcQv////8Pg3wiEEL/////D4N8IhhC/////w+DfCIdQv////8Pg3whFiADICB+IAwgGX4gDiAefiAFIBF+IAQgATUCGCIUfkGcGzUCACIVIAp+IAsgEn4gDyATfiAIIB9+IAYgIX4gADUCFCIaIAl+IAcgIH4gFkL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IiVC/////w+DfCImQv////8Pg3wiJ0L/////D4N8IhdC/////w+DQv////8PfkL/////D4MiGyANfiAXQv////8Pg3xCIIggEEIgiCAcQiCIfCAYQiCIfCAdQiCIfCAWQiCIfCAiQiCIfCAjQiCIfCAkQiCIfCAlQiCIfCAmQiCIfCAnQiCIfCAXQiCIfHwiHUL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IiVC/////w+DfCEQIAMgGn4gDCAgfiAZIB5+IA4gEX4gBSAUfiAEIAE1AhwiFn5BoBs1AgAiBCAKfiALIBV+IA8gEn4gEyAffiAIICF+IAYgG34gADUCGCIXIAl+IAcgGn4gEEL/////D4N8IiZC/////w+DfCInQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg3wiK0L/////D4N8IixC/////w+DfCIYQv////8Pg0L/////D35C/////w+DIhwgDX4gGEL/////D4N8QiCIICJCIIggHUIgiHwgI0IgiHwgJEIgiHwgJUIgiHwgEEIgiHwgJkIgiHwgJ0IgiHwgKEIgiHwgKUIgiHwgKkIgiHwgK0IgiHwgLEIgiHwgGEIgiHx8IhhC/////w+DfCIdQv////8Pg3wiIkL/////D4N8IiNC/////w+DfCIkQv////8Pg3wiJUL/////D4N8IRAgAyAXfiAMIBp+IB4gIH4gESAZfiAOIBR+IAUgFn4gDSAKQaQbNQIAIgp+IAQgC34gDyAVfiASIB9+IBMgIX4gCCAbfiAGIBx+IAkgADUCHCIJfiAHIBd+IBBC/////w+DfCImQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiLUL/////D4N8IgVC/////w+DQv////8PfkL/////D4MiDX4gBUL/////D4N8QiCIIB1CIIggGEIgiHwgIkIgiHwgI0IgiHwgJEIgiHwgJUIgiHwgEEIgiHwgJkIgiHwgJ0IgiHwgKEIgiHwgKUIgiHwgKkIgiHwgK0IgiHwgLEIgiHwgLUIgiHwgBUIgiHx8IhBC/////w+DfCIYQv////8Pg3wiHUL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IQUgCiALfiAEIA9+IBUgH34gEiAhfiATIBt+IAggHH4gBiANfiAHIAl+IAVC/////w+DfCIGQv////8Pg3wiB0L/////D4N8IgtC/////w+DfCIlQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUIgiCAYQiCIIBBCIIh8IB1CIIh8ICJCIIh8ICNCIIh8ICRCIIh8IAVCIIh8IAZCIIh8IAdCIIh8IAtCIIh8ICVCIIh8ICZCIIh8ICdCIIh8IChCIIh8fCEGIAIgKT4CACAKIA9+IAQgH34gFSAhfiASIBt+IBMgHH4gCCANfiADIAl+IAwgF34gGiAefiARICB+IBQgGX4gDiAWfiAGQv////8Pg3wiA0L/////D4N8IgVC/////w+DfCIHQv////8Pg3wiC0L/////D4N8IghC/////w+DfCIOQv////8Pg3wiD0L/////D4N8IhBC/////w+DfCIYQv////8Pg3wiHUL/////D4N8IiJC/////w+DfCIjQiCIIANCIIggBkIgiHwgBUIgiHwgB0IgiHwgC0IgiHwgCEIgiHwgDkIgiHwgD0IgiHwgEEIgiHwgGEIgiHwgHUIgiHwgIkIgiHx8IQMgAiAjPgIEIAogH34gBCAhfiAVIBt+IBIgHH4gDSATfiAJIAx+IBcgHn4gESAafiAUICB+IBYgGX4gA0L/////D4N8IgZC/////w+DfCIFQv////8Pg3wiB0L/////D4N8IgtC/////w+DfCIMQv////8Pg3wiCEL/////D4N8Ig5C/////w+DfCIPQv////8Pg3wiE0L/////D4N8IhlCIIggBkIgiCADQiCIfCAFQiCIfCAHQiCIfCALQiCIfCAMQiCIfCAIQiCIfCAOQiCIfCAPQiCIfCATQiCIfHwhAyACIBk+AgggCiAhfiAEIBt+IBUgHH4gDSASfiAJIB5+IBEgF34gFCAafiAWICB+IANC/////w+DfCIGQv////8Pg3wiBUL/////D4N8IgdC/////w+DfCILQv////8Pg3wiDEL/////D4N8IghC/////w+DfCIOQv////8Pg3wiD0IgiCAGQiCIIANCIIh8IAVCIIh8IAdCIIh8IAtCIIh8IAxCIIh8IAhCIIh8IA5CIIh8fCEDIAIgDz4CDCAKIBt+IAQgHH4gDSAVfiAJIBF+IBQgF34gFiAafiADQv////8Pg3wiBkL/////D4N8IgVC/////w+DfCIHQv////8Pg3wiC0L/////D4N8IgxC/////w+DfCIIQiCIIAZCIIggA0IgiHwgBUIgiHwgB0IgiHwgC0IgiHwgDEIgiHx8IQMgAiAIPgIQIAogHH4gBCANfiAJIBR+IBYgF34gA0L/////D4N8IgRC/////w+DfCIGQv////8Pg3wiBUL/////D4N8IgdCIIggBEIgiCADQiCIfCAGQiCIfCAFQiCIfHwhBCACIAc+AhQgCiANfiAJIBZ+IARC/////w+DfCIJQv////8Pg3wiCkIgiCAJQiCIIARCIIh8fCEEIAIgCj4CGCACIAQ+AhwgBEIgiKcEQCACQYgbIAIQKxoFIAJBiBsQKQRAIAJBiBsgAhArGgsLC8YXASN+IAA1AgAiByAHfiICQv////8Pg0L/////D35C/////w+DIgxBiBs1AgAiDX4gAkL/////D4N8QiCIIAJCIIh8IQRBjBs1AgAiCSAMfiAANQIEIgIgB34iBUL/////D4NCAYYiCEL/////D4MgBEL/////D4N8IgZC/////w+DfCIDQv////8Pg0L/////D35C/////w+DIgogDX4gA0L/////D4N8QiCIIAVCIIhCAYYgCEIgiHwgBkIgiHwgBEIgiHwgA0IgiHx8IQNBkBs1AgAiDyAMfiAJIAp+IAIgAn4gADUCCCIEIAd+IghC/////w+DQgGGIgZC/////w+DfCIQQv////8PgyADQv////8Pg3wiFEL/////D4N8IhFC/////w+DfCIFQv////8Pg0L/////D35C/////w+DIhIgDX4gBUL/////D4N8QiCIIAhCIIhCAYYgBkIgiHwgEEIgiHwgFEIgiHwgA0IgiHwgEUIgiHwgBUIgiHx8IQVBlBs1AgAiECAMfiAKIA9+IAkgEn4gAiAEfiAANQIMIgMgB34iBkL/////D4N8IhFC/////w+DQgGGIhVC/////w+DIAVC/////w+DfCIWQv////8Pg3wiF0L/////D4N8Ig5C/////w+DfCIIQv////8Pg0L/////D35C/////w+DIhQgDX4gCEL/////D4N8QiCIIBFCIIggBkIgiHxCAYYgFUIgiHwgFkIgiHwgBUIgiHwgF0IgiHwgDkIgiHwgCEIgiHx8IQhBmBs1AgAiESAMfiAKIBB+IA8gEn4gCSAUfiAEIAR+IAIgA34gADUCECIFIAd+IhZC/////w+DfCIXQv////8Pg0IBhiIOQv////8Pg3wiGEL/////D4MgCEL/////D4N8IgtC/////w+DfCITQv////8Pg3wiGUL/////D4N8IhpC/////w+DfCIGQv////8Pg0L/////D35C/////w+DIhUgDX4gBkL/////D4N8QiCIIBdCIIggFkIgiHxCAYYgDkIgiHwgGEIgiHwgC0IgiHwgCEIgiHwgE0IgiHwgGUIgiHwgGkIgiHwgBkIgiHx8IQZBnBs1AgAiFiAMfiAKIBF+IBAgEn4gDyAUfiAJIBV+IAMgBH4gAiAFfiAANQIUIgggB34iGEL/////D4N8IgtC/////w+DfCITQv////8Pg0IBhiIZQv////8PgyAGQv////8Pg3wiGkL/////D4N8IhtC/////w+DfCIcQv////8Pg3wiHUL/////D4N8Ih5C/////w+DfCIOQv////8Pg0L/////D35C/////w+DIhcgDX4gDkL/////D4N8QiCIIAtCIIggGEIgiHwgE0IgiHxCAYYgGUIgiHwgGkIgiHwgBkIgiHwgG0IgiHwgHEIgiHwgHUIgiHwgHkIgiHwgDkIgiHx8IQtBoBs1AgAiDiAMfiAKIBZ+IBEgEn4gECAUfiAPIBV+IAkgF34gAyADfiAEIAV+IAIgCH4gADUCGCIGIAd+IhlC/////w+DfCIaQv////8Pg3wiG0L/////D4NCAYYiHEL/////D4N8Ih1C/////w+DIAtC/////w+DfCIeQv////8Pg3wiH0L/////D4N8IiBC/////w+DfCIhQv////8Pg3wiIkL/////D4N8IiNC/////w+DfCITQv////8Pg0L/////D35C/////w+DIhggDX4gE0L/////D4N8QiCIIBpCIIggGUIgiHwgG0IgiHxCAYYgHEIgiHwgHUIgiHwgHkIgiHwgC0IgiHwgH0IgiHwgIEIgiHwgIUIgiHwgIkIgiHwgI0IgiHwgE0IgiHx8IQsgDSAMQaQbNQIAIgx+IAogDn4gEiAWfiARIBR+IBAgFX4gDyAXfiAJIBh+IAMgBX4gBCAIfiACIAZ+IAcgADUCHCIHfiIZQv////8Pg3wiGkL/////D4N8IhtC/////w+DfCIcQv////8Pg0IBhiIdQv////8PgyALQv////8Pg3wiHkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiIUL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IhNC/////w+DQv////8PfkL/////D4MiDX4gE0L/////D4N8QiCIIBpCIIggGUIgiHwgG0IgiHwgHEIgiHxCAYYgHUIgiHwgHkIgiHwgC0IgiHwgH0IgiHwgIEIgiHwgIUIgiHwgIkIgiHwgI0IgiHwgJEIgiHwgE0IgiHx8IQsgASAKIAx+IA4gEn4gFCAWfiARIBV+IBAgF34gDyAYfiAJIA1+IAUgBX4gAyAIfiAEIAZ+IAIgB34iAkL/////D4N8IglC/////w+DfCIKQv////8Pg0IBhiITQv////8Pg3wiGUL/////D4MgC0L/////D4N8IhpC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiH0L/////D4N8IiBC/////w+DfCIhPgIAIAEgDCASfiAOIBR+IBUgFn4gESAXfiAQIBh+IA0gD34gBSAIfiADIAZ+IAQgB34iBEL/////D4N8Ig9C/////w+DfCISQv////8Pg0IBhiIiQv////8PgyAJQiCIIAJCIIh8IApCIIh8QgGGIBNCIIh8IBlCIIh8IBpCIIh8IAtCIIh8IBtCIIh8IBxCIIh8IB1CIIh8IB5CIIh8IB9CIIh8ICBCIIh8ICFCIIh8IgJC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IgtC/////w+DfCITQv////8Pg3wiGUL/////D4N8IhpC/////w+DfCIbPgIEIAEgDCAUfiAOIBV+IBYgF34gESAYfiANIBB+IAggCH4gBSAGfiADIAd+IgNC/////w+DfCIQQv////8Pg0IBhiIUQv////8Pg3wiHEL/////D4MgD0IgiCAEQiCIfCASQiCIfEIBhiAiQiCIfCAJQiCIfCACQiCIfCAKQiCIfCALQiCIfCATQiCIfCAZQiCIfCAaQiCIfCAbQiCIfCICQv////8Pg3wiBEL/////D4N8IglC/////w+DfCIKQv////8Pg3wiD0L/////D4N8IhJC/////w+DfCILPgIIIAEgDCAVfiAOIBd+IBYgGH4gDSARfiAGIAh+IAUgB34iBUL/////D4N8IhFC/////w+DQgGGIhVC/////w+DIBBCIIggA0IgiHxCAYYgFEIgiHwgHEIgiHwgBEIgiHwgAkIgiHwgCUIgiHwgCkIgiHwgD0IgiHwgEkIgiHwgC0IgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCIPPgIMIAEgDCAXfiAOIBh+IA0gFn4gBiAGfiAHIAh+IghC/////w+DQgGGIhJC/////w+DfCIQQv////8PgyARQiCIIAVCIIh8QgGGIBVCIIh8IARCIIh8IAJCIIh8IANCIIh8IAlCIIh8IApCIIh8IA9CIIh8IgJC/////w+DfCIEQv////8Pg3wiA0L/////D4N8IgVC/////w+DfCIJPgIQIAEgDCAYfiANIA5+IAYgB34iBkL/////D4NCAYYiCkL/////D4MgCEIgiEIBhiASQiCIfCAQQiCIfCAEQiCIfCACQiCIfCADQiCIfCAFQiCIfCAJQiCIfCICQv////8Pg3wiBEL/////D4N8IgNC/////w+DfCIFPgIUIAEgDCANfiAHIAd+IgdC/////w+DIAZCIIhCAYYgCkIgiHwgBEIgiHwgAkIgiHwgA0IgiHwgBUIgiHwiAkL/////D4N8IgRC/////w+DfCIDPgIYIAEgBEIgiCAHQiCIfCACQiCIfCADQiCIfCIHPgIcIAdCIIinBEAgAUGIGyABECsaBSABQYgbECkEQCABQYgbIAEQKxoLCwsKACAAIAAgARA2CwsAIABBqBsgARA2CxUAIABBqCEQJEHIIRAlQaghIAEQNQsRACAAQeghEDpB6CFBqBwQKQsjACAAECYEQEEADwsgAEGIIhA6QYgiQagcECkEQEF/DwtBAQsXACAAIAEQOiABQYgbIAEQMCABIAEQOQsJAEHIGyAAECQLvAEBAn8gAhAlQSAhAwNAIAEgA08EQCADQSBGBEBBqCIQPgVBqCJBqBtBqCIQNgsgAEGoIkHIIhA2IAJByCIgAhAyIABBIGohACADQSBqIQMMAQsLIAFBH3EiBEUEQA8LQcgiECVBACEBA0AgASAERkUEQCABIAAtAAA6AMgiIABBAWohACABQQFqIQEMAQsLIANBIEYEQEGoIhA+BUGoIkGoG0GoIhA2C0HIIkGoIkHIIhA2IAJByCIgAhAyCxwAIAEgAkHoIhA/QegiQegiEDkgAEHoIiADEDYL4AEBAn9BAEEAKAIAIgUgAkEBakEFdGo2AgAgBRA+IAVBIGohBQNAIAIgBkcEQCAAECYEQCAFQSBrIAUQJAUgACAFQSBrIAUQNgsgACABaiEAIAVBIGohBSAGQQFqIQYMAQsLIAAgAWshACADIAJBAWsgBGxqIQIgBUEgayIFIAUQPQNAIAYEQCAAECYEQCAFIAVBIGsQJCACECUFIAVBIGsiA0GIIxAkIAUgACADEDYgBUGIIyACEDYLIAAgAWshACACIARrIQIgBUEgayEFIAZBAWshBgwBCwtBACAFNgIACy0BAX8DQCABIANGRQRAIAAgAhA5IABBIGohACACQSBqIQIgA0EBaiEDDAELCwstAQF/A0AgASADRkUEQCAAIAIQOiAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLlwIAIAJFBEAgAxA+DwsgAEGoIxAkIAMQPgNAIAJBAWsiAiABai0AACEAIAMgAxA3IABBgAFPBEAgA0GoIyADEDYgAEGAAWshAAsgAyADEDcgAEHAAE8EQCADQagjIAMQNiAAQUBqIQALIAMgAxA3IABBIE8EQCADQagjIAMQNiAAQSBrIQALIAMgAxA3IABBEE8EQCADQagjIAMQNiAAQRBrIQALIAMgAxA3IABBCE8EQCADQagjIAMQNiAAQQhrIQALIAMgAxA3IABBBE8EQCADQagjIAMQNiAAQQRrIQALIAMgAxA3IABBAk8EQCADQagjIAMQNiAAQQJrIQALIAMgAxA3IAAEQCADQagjIAMQNgsgAg0ACwvVAQEBfyAAECYEQCABECUPC0EgIQJB6BxByCMQJCAAQcgcQSBB6CMQRCAAQYgdQSBBiCQQRANAQegjQcgbEChFBEBB6CNBqCQQN0EBIQADQEGoJEHIGxAoRQRAQagkQagkEDcgAEEBaiEADAELC0HII0HIJBAkIAIgAGtBAWshAgNAIAIEQEHIJEHIJBA3IAJBAWshAgwBCwsgACECQcgkQcgjEDdB6CNByCNB6CMQNkGIJEHIJEGIJBA2DAELC0GIJBA7BEBBiCQgARA0BUGIJCABECQLCyAAIAAQJgRAQQEPCyAAQYgcQSBB6CQQREHoJEHIGxAoCxUAIAAgAUGIJRA2QYglQagbIAIQNgsKACAAIAAgARBHCwsAIABBiBsgARAwCwkAIABBqBwQKQsOACAAEAIgAEEwahACcQsKACAAQeAAahACCw0AIAAQASAAQTBqEAELFQAgABABIABBMGoQGyAAQeAAahABC3oAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYC7oBACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAELKAAgABBLBEAgARBOBSABQeAAahAbIABBMGogAUEwahAAIAAgARAACwsVACAAIAEQBCAAQTBqIAFBMGoQBHELcgEBfyAAEEwEQCABEEsPCyABEEsEQEEADwsgAEHgAGoiAhAOBEAgACABEFIPCyACQdglEBQgAUHYJUGIJhATIAJB2CVB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AwRAQcjIACABQTBqEAAFQcjIACABQTBqEBELBSADBEBByMgAIAFBMGoQEQVByMgAIAFBMGoQAAsLCy8BAX8DQCABIANGRQRAIAAgAhBpIABB4ABqIQAgAkHgAGohAiADQQFqIQMMAQsLCy4BAX8DQCABIANGRQRAIAAgAhBqIABB4ABqIQAgAkEwaiECIANBAWohAwwBCwsLLwEBfwNAIAEgA0ZFBEAgACACEGsgAEHgAGohACACQeAAaiECIANBAWohAwwBCwsLTAEBfyAAIAFBAWsiA0EwbGohACACIANB4ABsaiECQQAhAwNAIAEgA0ZFBEAgACACEGwgAEEwayEAIAJB4ABrIQIgA0EBaiEDDAELCwtOAQF/IAAgAUEBayIDQeAAbGohACACIANBkAFsaiECQQAhAwNAIAEgA0ZFBEAgACACEFEgAEHgAGshACACQZABayECIANBAWohAwwBCwsLNQAgAUEDdCACayIBIANIBH9BASABdEEBawVBASADdEEBawsgACACQQN2aigAACACQQdxdnELgAEBA38gAUEBRgRADwsgACEDIABBASABQQFrdEGQAWxqIgRBkAFrIQIDQCACIANGRQRAIAMgBCADEFkgAiAEIAIQWSADQZABaiEDIARBkAFqIQQMAQsLIAAgAUEBayIBEHMDQCABBEAgAiACEFYgAUEBayEBDAELCyAAIAIgABBZC6MBAQN/IANFBEAgBhBODwtBAEEAKAIAIghBASAFdCIJQZABbGo2AgADQCAHIAlGRQRAIAggB0GQAWxqEE4gB0EBaiEHDAELCyABIAIgA2xqIQMDQCABIANHBEAgASACIAQgBRByIgcEQCAIIAdBAWtBkAFsaiIHIAAgBxBZCyABIAJqIQEgAEGQAWohAAwBCwsgCCAFEHMgCCAGEFBBACAINgIAC30BA38gBBBOIANFBEAPCyADZy0AiEoiBSACQQN0QQFrIAVubCEGA0AgBkEATgRAIAQQTEUEQEEAIQcDQCAFIAdGRQRAIAQgBBBWIAdBAWohBwwBCwsLIAAgASACIAMgBiAFQfjIABB0IARB+MgAIAQQWSAGIAVrIQYMAQsLC4ABAQN/IAFBAUYEQA8LIAAhAyAAQQEgAUEBa3RBkAFsaiIEQZABayECA0AgAiADRkUEQCADIAQgAxBZIAIgBCACEFkg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EIwBIABB4ABqEE0gAEHAAWoQTQsnACAAIAEQjQEgAEHgAGogAUHgAGoQjQEgAEHAAWogAUHAAWoQjQELswIBBH8gACABQajVAhCOASAAQeAAaiIDIAFB4ABqIgRBiNYCEI4BIABBwAFqIgUgAUHAAWoiBkHo1gIQjgEgACADQcjXAhCRASABIARBqNgCEJEBIAAgBUGI2QIQkQEgASAGQejZAhCRASADIAVByNoCEJEBIAQgBkGo2wIQkQFBqNUCQYjWAkGI3AIQkQFBqNUCQejWAkHo3AIQkQFBiNYCQejWAkHI3QIQkQFByNoCQajbAiACEI4BIAJByN0CIAIQkgEgAiACEOcBQajVAiACIAIQkQFByNcCQajYAiACQeAAaiIAEI4BIABBiNwCIAAQkgFB6NYCQajeAhDnASAAQajeAiAAEJEBQYjZAkHo2QIgAkHAAWoiABCOASAAQejcAiAAEJIBIABBiNYCIAAQkQEL2wEBAX8gAEGI3wIQkAEgACAAQeAAaiICQejfAhCOAUHo3wJB6N8CQcjgAhCRASAAIAJBqOECEJIBQajhAiAAQcABaiIAQajhAhCRAUGo4QJBqOECEJABIAIgAEGI4gIQjgFBiOICQYjiAkHo4gIQkQEgAEHI4wIQkAFB6OICIAEQ5wFBiN8CIAEgARCRAUHI4wIgAUHgAGoiABDnAUHI4AIgACAAEJEBQYjfAkHI4wIgAUHAAWoiABCRAUHo4gIgACAAEJIBQajhAiAAIAAQkQFByOACIAAgABCRAQs1ACAAIAEgAhCRASAAQeAAaiABQeAAaiACQeAAahCRASAAQcABaiABQcABaiACQcABahCRAQs1ACAAIAEgAhCSASAAQeAAaiABQeAAaiACQeAAahCSASAAQcABaiABQcABaiACQcABahCSAQsnACAAIAEQkwEgAEHgAGogAUHgAGoQkwEgAEHAAWogAUHAAWoQkwELKwEBfyAAQcABahCWASIBBEAgAQ8LIABB4ABqEJYBIgEEQCABDwsgABCWAQsmACAAIAEQUiAAQeAAaiABQeAAahBScSAAQcABaiABQcABahBScQuZAgECfyAAQajkAhCQASAAQeAAaiICQYjlAhCQASAAQcABaiIDQejlAhCQASAAIAJByOYCEI4BIAAgA0Go5wIQjgEgAiADQYjoAhCOAUGI6AJB6OgCEOcBQajkAkHo6AJB6OgCEJIBQejlAkHI6QIQ5wFByOkCQcjmAkHI6QIQkgFBiOUCQajnAkGo6gIQkgEgA0HI6QJBiOsCEI4BIAJBqOoCQejrAhCOAUGI6wJB6OsCQYjrAhCRAUGI6wJBiOsCEOcBIABB6OgCQejrAhCOAUHo6wJBiOsCQYjrAhCRAUGI6wJBiOsCEJQBQYjrAkHo6AIgARCOAUGI6wJByOkCIAFB4ABqEI4BQYjrAkGo6gIgAUHAAWoQjgELMwAgACABIAIgAxCVASAAQeAAaiABIAIgA0HgAGoQlQEgAEHAAWogASACIANBwAFqEJUBCykAIABBwAFqEEsEQCAAIABB4ABqIgAgABBLGxCXAQ8LIABBwAFqEJcBC/YBAQJ/QQBBACgCACIFIAJBAWpBoAJsajYCACAFEOsBIAVBoAJqIQUDQCACIAZHBEAgABDoAQRAIAVBoAJrIAUQ7AEFIAAgBUGgAmsgBRDtAQsgACABaiEAIAVBoAJqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBoAJrIgUgBRD0AQNAIAYEQCAAEOgBBEAgBSAFQaACaxDsASACEOoBBSAFQaACayIDQcjsAhDsASAFIAAgAxDtASAFQcjsAiACEO0BCyAAIAFrIQAgAiAEayECIAVBoAJrIQUgBkEBayEGDAELC0EAIAU2AgALswIAIAJFBEAgAxDrAQ8LIABB6O4CEOwBIAMQ6wEDQCACQQFrIgIgAWotAAAhACADIAMQ7gEgAEGAAU8EQCADQejuAiADEO0BIABBgAFrIQALIAMgAxDuASAAQcAATwRAIANB6O4CIAMQ7QEgAEFAaiEACyADIAMQ7gEgAEEgTwRAIANB6O4CIAMQ7QEgAEEgayEACyADIAMQ7gEgAEEQTwRAIANB6O4CIAMQ7QEgAEEQayEACyADIAMQ7gEgAEEITwRAIANB6O4CIAMQ7QEgAEEIayEACyADIAMQ7gEgAEEETwRAIANB6O4CIAMQ7QEgAEEEayEACyADIAMQ7gEgAEECTwRAIANB6O4CIAMQ7QEgAEECayEACyADIAMQ7gEgAARAIANB6O4CIAMQ7QELIAINAAsLMgAgAEGI8QIQjQEgAEHAAWogARDnASAAQeAAaiABQcABahCNAUGI8QIgAUHgAGoQjQELEQAgABDoASAAQaACahDoAXELEQAgABDpASAAQaACahDoAXELEAAgABDqASAAQaACahDqAQsQACAAEOsBIABBoAJqEOoBCxgAIAAgARDsASAAQaACaiABQaACahDsAQt9AQJ/IAAgAUHo8QIQ7QEgAEGgAmoiAyABQaACaiIEQYj0AhDtASAAIANBqPYCEO8BIAEgBEHI+AIQ7wFBqPYCQcj4AkGo9gIQ7QFBiPQCIAIQ+QFB6PECIAIgAhDvAUHo8QJBiPQCIAJBoAJqIgAQ7wFBqPYCIAAgABDwAQscACAAIAEgAhDtASAAQaACaiABIAJBoAJqEO0BC3kBAX8gACAAQaACaiICQej6AhDtASAAIAJBiP0CEO8BIAJBqP8CEPkBIABBqP8CQaj/AhDvAUHo+gJByIEDEPkBQciBA0Ho+gJByIEDEO8BQYj9AkGo/wIgARDtASABQciBAyABEPABQej6AkHo+gIgAUGgAmoQ7wELIAAgACABIAIQ7wEgAEGgAmogAUGgAmogAkGgAmoQ7wELIAAgACABIAIQ8AEgAEGgAmogAUGgAmogAkGgAmoQ8AELGAAgACABEPEBIABBoAJqIAFBoAJqEPEBCxgAIAAgARDsASAAQaACaiABQaACahDxAQsYACAAIAEQswEgAEGgAmogAUGgAmoQswELGAAgACABELEBIABBoAJqIAFBoAJqELEBCxkAIAAgARDzASAAQaACaiABQaACahDzAXELZAEBfyAAQeiDAxDuASAAQaACaiICQYiGAxDuAUGIhgNBqIgDEPkBQeiDA0GoiANBqIgDEPABQaiIA0HIigMQ9AEgAEHIigMgARDtASACQciKAyABQaACaiIAEO0BIAAgABDxAQsgACAAIAEgAiADEPUBIABBoAJqIAEgAiADQaACahD1AQsaAQF/IABBoAJqEPIBIgEEQCABDwsgABDyAQsdACAAQaACahDoAQRAIAAQ9gEPCyAAQaACahD2AQv2AQECf0EAQQAoAgAiBSACQQFqQcAEbGo2AgAgBRD9ASAFQcAEaiEFA0AgAiAGRwRAIAAQ+gEEQCAFQcAEayAFEP4BBSAAIAVBwARrIAUQ/wELIAAgAWohACAFQcAEaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQcAEayIFIAUQiQIDQCAGBEAgABD6AQRAIAUgBUHABGsQ/gEgAhD8AQUgBUHABGsiA0HojAMQ/gEgBSAAIAMQ/wEgBUHojAMgAhD/AQsgACABayEAIAIgBGshAiAFQcAEayEFIAZBAWshBgwBCwtBACAFNgIAC7MCACACRQRAIAMQ/QEPCyAAQaiRAxD+ASADEP0BA0AgAkEBayICIAFqLQAAIQAgAyADEIECIABBgAFPBEAgA0GokQMgAxD/ASAAQYABayEACyADIAMQgQIgAEHAAE8EQCADQaiRAyADEP8BIABBQGohAAsgAyADEIECIABBIE8EQCADQaiRAyADEP8BIABBIGshAAsgAyADEIECIABBEE8EQCADQaiRAyADEP8BIABBEGshAAsgAyADEIECIABBCE8EQCADQaiRAyADEP8BIABBCGshAAsgAyADEIECIABBBE8EQCADQaiRAyADEP8BIABBBGshAAsgAyADEIECIABBAk8EQCADQaiRAyADEP8BIABBAmshAAsgAyADEIECIAAEQCADQaiRAyADEP8BCyACDQALC9EBAEHopwMQ/QFB6KcDQeinAxCEAiAAQeiVA0GgAkGomgMQjgJBqJoDQeieAxCBAiAAQeieA0HongMQ/wFB6J4DQaijAxCFAkGoowNB6J4DQaijAxD/AUGoowNB6KcDEIgCBEAAC0GomgMgAEGorAMQ/wFB6J4DQeinAxCIAgRAQeinAxDqAUGIqgMQ6wFB6KcDQaisAyABEP8BBUHosAMQ/QFB6LADQeieA0HosAMQggJB6LADQYiYA0GgAkHosAMQjgJB6LADQaisAyABEP8BCwtpAEGIxQMQ/QFBiMUDQYjFAxCEAiAAQai1A0GgAkHItwMQjgJByLcDQYi8AxCBAiAAQYi8A0GIvAMQ/wFBiLwDQcjAAxCFAkHIwANBiLwDQcjAAxD/AUHIwANBiMUDEIgCBEBBAA8LQQELaAEBfyAAIABB4ABqIgNBiMoDEJEBIAMgAEHAAWpB6MoDEJEBIAMgASACQcABaiIAEI4BQejKAyABIAIQjgEgAiAAIAIQkgEgAiACEOcBQYjKAyABIAJB4ABqIgEQjgEgASAAIAEQkgELwgEBAX8gACABQcjLAxCOASAAQeAAaiIEIAJBqMwDEI4BIAAgBEGIzQMQkQEgACAAQcABaiIAQejNAxCRASAEIAAgAxCRASADIAIgAxCOASADQajMAyADEJIBIAMgAxDnASADQcjLAyADEJEBIAEgAiADQeAAaiIAEJEBIABBiM0DIAAQjgEgAEHIywMgABCSASAAQajMAyAAEJIBQejNAyABIANBwAFqIgAQjgEgAEHIywMgABCSASAAQajMAyAAEJEBC3oBAX8gACABIAJByM4DEJICIABBoAJqIgUgA0Ho0AMQkQIgAiADQYjTAxCRASAFIAAgBEGgAmoiABDvASAAIAFBiNMDIAAQkgIgAEHIzgMgABDwASAAQejQAyAAEPABQejQAyAEEOwBIAQgBBD5ASAEQcjOAyAEEO8BC1EBAX8gASAAQTBqIgNB6NMDEBMgAUEwaiADQZjUAxATIAFB4ABqIABByNQDEBMgAUGQAWogAEH41AMQEyACIAFBwAFqQcjUA0Ho0wMgAhCTAgshACAAIAFBiPsEQaj6BEHI+QRB6PgEQYj4BEGo9wQQsQILIQAgACABQcj/BEHo/gRBiP4EQaj9BEHI/ARB6PsEELICCyEAIAAgAUGIhAVBqIMFQciCBUHogQVBiIEFQaiABRCxAgshACAAIAFByIgFQeiHBUGIhwVBqIYFQciFBUHohAUQsgILIQAgACABQYiNBUGojAVByIsFQeiKBUGIigVBqIkFELECCyEAIAAgAUHIkQVB6JAFQYiQBUGojwVByI4FQeiNBRCyAgshACAAIAFBiJYFQaiVBUHIlAVB6JMFQYiTBUGokgUQsQILIQAgACABQciaBUHomQVBiJkFQaiYBUHIlwVB6JYFELICCyEAIAAgAUGInwVBqJ4FQcidBUHonAVBiJwFQaibBRCxAgshACAAIAFByKMFQeiiBUGIogVBqKEFQcigBUHonwUQsgILhAEBAX8gABBLBEBBAQ8LIAAQZEUEQEEADwsgAEGopAVBmKUFEBMgAEEwaiIBQcilBRAAIABB2KQFQaimBRATIAFB2KYFEABBmKUFQZilBRBVQZilBSAAQZilBRBdQZilBUGopgVBmKUFEF1BmKUFQYilBUEQQZilBRB5QZilBUGopgUQUwsRACAAQYinBRBjQYinBRCfAguzAgAgABCcAQRAQQEPCyAAELUBRQRAQQAPCyAAQeinBUGQqgUQjgEgAEHgAGpB6KcFQfCqBRCOAUGQqgVByKgFQdCr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sSQY/////wAAAAABpAEA/VtCrPonXvb3J8bMt4Ji1qxYEgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYiYAwugAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqLUDC6ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIyQMLQAAAAAAAAAAAAAAAAAAAAAAB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";
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
// globalThis (e.g. a SES hardened-profile realm) throws at module load.
let curve_bls12381 = null;

async function buildBls12381(singleThread, plugins) {
    if ((!singleThread) && (curve_bls12381)) return curve_bls12381;

    const bls12381wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: static import (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES
        // hardened realms alike. Also avoids recompiling the wasm on every load.
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
