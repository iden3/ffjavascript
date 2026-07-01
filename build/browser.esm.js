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

function bitLength$6(a) {
    const aS =a.toString(16);
    return (aS.length-1)*4 +hexLen[parseInt(aS[0], 16)];
}

function isNegative$4(a) {
    return BigInt(a) < BigInt(0);
}

function isZero$1(a) {
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

function isOdd$5(a) {
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

function toNumber$1(s) {
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

function square$2(a) {
    return BigInt(a) * BigInt(a);
}

function pow(a, b) {
    return BigInt(a) ** BigInt(b);
}

function exp$1(a, b) {
    return BigInt(a) ** BigInt(b);
}

function abs$1(a) {
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
    for (let i=v.length*4; i<n8; i++) buff[i] = toNumber$1(band(shiftRight(e, i*8), 0xFF));
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
    const buff = new Uint8Array(Math.floor((bitLength$6(a) - 1) / 8) +1);
    toRprLE(buff, 0, a, buff.byteLength);
    return buff;
}

const zero = e(0);
const one = e(1);

var _Scalar = /*#__PURE__*/Object.freeze({
    __proto__: null,
    abs: abs$1,
    add: add,
    band: band,
    bitLength: bitLength$6,
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
    isNegative: isNegative$4,
    isOdd: isOdd$5,
    isZero: isZero$1,
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
    square: square$2,
    sub: sub,
    toArray: toArray,
    toLEBuff: toLEBuff,
    toNumber: toNumber$1,
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

    if (isZero$1(e)) return F.zero;

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

    if (isZero$1(e)) return F.one;

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

    while (!isOdd$5(F.sqrt_t)) {
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

var os = {};

function getRandomBytes(n) {
    let array = new Uint8Array(n);
    // Feature-detect rather than rely on `true` (undefined under
    // Vite/esbuild/SES -> ReferenceError). Prefer Node crypto (no per-call size
    // limit); fall back to Web Crypto chunked to its 65536-byte cap.
    if (os && os.randomFillSync) { // Node
        os.randomFillSync(array);
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
        this.bitLength = bitLength$6(this.p);
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
        len = Math.floor((bitLength$6(n) - 1) / 8) + 1;
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

// 1 GiB page size: a deliberately conservative, fragmentation-friendly page -- not
// the engine's max single-buffer length (~8 GiB+), which would defeat paging and
// risk OOM on the multi-GiB G1/G2 buffers large circuits produce.
const PAGE_SIZE = 1 << 30;

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
        this.bitLength = bitLength$6(p);
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

        while ( !isOdd$5(t) ) {
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
        if (isNegative$4(ra)) {
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
    let batchFns = null;   // batch-affine MSM entry points (per-group wrappers)
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

        // Optional batch-affine MSM helper module. It is curve-independent:
        // it imports the base-field/group ops from the main instance and works
        // on the same memory, so one binary serves G1 (f1m/g1m) and, over the
        // quadratic extension, G2 (f2m/g2m). Instantiated once per group.
        if (data.batchCode) {
            let batchModule;
            if (data.batchCode instanceof WebAssembly.Module) {
                batchModule = data.batchCode;
            } else {
                batchModule = await WebAssembly.compile(new Uint8Array(data.batchCode));
            }
            const ex = instance.exports;
            const mkBatch = async (f, g) => (await WebAssembly.instantiate(batchModule, {
                env: { "memory": memory },
                curve: {
                    f_mul: ex[f + "_mul"], f_square: ex[f + "_square"], f_add: ex[f + "_add"],
                    f_sub: ex[f + "_sub"], f_neg: ex[f + "_neg"], f_inverse: ex[f + "_inverse"],
                    f_isZero: ex[f + "_isZero"], g_add: ex[g + "_add"], g_addMixed: ex[g + "_addMixed"],
                    g_double: ex[g + "_double"], g_zero: ex[g + "_zero"], g_isZero: ex[g + "_isZero"],
                },
            })).exports;
            const n8f = data.n8f;
            batchFns = {};
            if (ex.f1m_mul && ex.g1m_addMixed) {
                const b = await mkBatch("f1m", "g1m");
                batchFns["g1m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f);
            }
            if (ex.f2m_mul && ex.g2m_addMixed) {
                const b = await mkBatch("f2m", "g2m");
                batchFns["g2m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f * 2);
            }
        }

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
                {
                    const fname = task[i].fnName;
                    let fn = batchFns ? batchFns[fname] : undefined;
                    if (!fn) {
                        fn = instance.exports[fname];
                        // graceful fallback: "...Batch" -> plain variant when the
                        // batch module is unavailable (same 5-arg signature)
                        if (!fn && fname.endsWith("Batch")) fn = instance.exports[fname.slice(0, -5)];
                    }
                    fn(...params);
                }
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

// Robust Node detection that never throws (unlike `true`, which is a
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
    const threadStr = `(${"function thread(self) {\n    const MAXMEM = 32767;\n    let instance;\n    let memory;\n    let batchFns = null;   // batch-affine MSM entry points (per-group wrappers)\n    let terminationTimeout = 1500; // milliseconds\n    let terminationTimer;\n    let wantToTerminate = false;\n\n    if (self) {\n        self.onmessage = function(e) {\n            let data;\n            if (e.data) {\n                data = e.data;\n            } else {\n                data = e;\n            }\n\n            try {\n                if (data[0].cmd === \"INIT\") {\n                    init(data[0]).then(function() {\n                        self.postMessage({status: \"initialized\"});\n                        // Start idle timer only after init completes so it never\n                        // fires during async WASM compilation.\n                        scheduleTermination();\n                    });\n                    return; // skip the scheduleTermination() call at the bottom\n                } else if (data[0].cmd === \"TERMINATE\") {\n                    terminate();\n                } else {\n                    let terminateAfterTask = false;\n                    if (data[data.length-1].cmd === \"TERMINATE\") {\n                        terminateAfterTask = true;\n                        data.pop();\n                    }\n                    const res = runTask(data);\n                    let transfers = [];\n                    for (let i=0; i<res.length; i++) {\n                        if (res[i] instanceof Uint8Array) {\n                            transfers.push(res[i].buffer);\n                        }\n                    }\n                    self.postMessage(res, transfers);\n                    if (terminateAfterTask) {\n                        terminate();\n                    }\n                }\n            } catch (err) {\n                // Catch any error and send it back to main thread\n                self.postMessage({error: err.message});\n            }\n            scheduleTermination();\n        };\n    }\n\n    async function init(data) {\n        let wasmModule;\n        if (data.code instanceof WebAssembly.Module) {\n            console.log(\"Using precompiled WebAssembly.Module\");\n            wasmModule = data.code;\n        } else {\n            console.log(\"Compiling WebAssembly.Module\");\n            const code = new Uint8Array(data.code);\n            wasmModule = await WebAssembly.compile(code);\n        }\n        memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});\n\n        console.log(\"Initialized thread with memory\", memory.buffer.byteLength / 1024 / 1024, \"MB\");\n\n        instance = await WebAssembly.instantiate(wasmModule, {\n            env: {\n                \"memory\": memory\n            }\n        });\n\n        // Optional batch-affine MSM helper module. It is curve-independent:\n        // it imports the base-field/group ops from the main instance and works\n        // on the same memory, so one binary serves G1 (f1m/g1m) and, over the\n        // quadratic extension, G2 (f2m/g2m). Instantiated once per group.\n        if (data.batchCode) {\n            let batchModule;\n            if (data.batchCode instanceof WebAssembly.Module) {\n                batchModule = data.batchCode;\n            } else {\n                batchModule = await WebAssembly.compile(new Uint8Array(data.batchCode));\n            }\n            const ex = instance.exports;\n            const mkBatch = async (f, g) => (await WebAssembly.instantiate(batchModule, {\n                env: { \"memory\": memory },\n                curve: {\n                    f_mul: ex[f + \"_mul\"], f_square: ex[f + \"_square\"], f_add: ex[f + \"_add\"],\n                    f_sub: ex[f + \"_sub\"], f_neg: ex[f + \"_neg\"], f_inverse: ex[f + \"_inverse\"],\n                    f_isZero: ex[f + \"_isZero\"], g_add: ex[g + \"_add\"], g_addMixed: ex[g + \"_addMixed\"],\n                    g_double: ex[g + \"_double\"], g_zero: ex[g + \"_zero\"], g_isZero: ex[g + \"_isZero\"],\n                },\n            })).exports;\n            const n8f = data.n8f;\n            batchFns = {};\n            if (ex.f1m_mul && ex.g1m_addMixed) {\n                const b = await mkBatch(\"f1m\", \"g1m\");\n                batchFns[\"g1m_multiexpAffineBatch\"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f);\n            }\n            if (ex.f2m_mul && ex.g2m_addMixed) {\n                const b = await mkBatch(\"f2m\", \"g2m\");\n                batchFns[\"g2m_multiexpAffineBatch\"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f * 2);\n            }\n        }\n\n        if (data.terminationTimeout) {\n            terminationTimeout = data.terminationTimeout;\n        }\n    }\n\n\n\n    // Reverse the low `bits` of a 32-bit integer (O(1) bit-twiddle).\n    function rev32(x) {\n        x = ((x & 0x55555555) << 1) | ((x >>> 1) & 0x55555555);\n        x = ((x & 0x33333333) << 2) | ((x >>> 2) & 0x33333333);\n        x = ((x & 0x0f0f0f0f) << 4) | ((x >>> 4) & 0x0f0f0f0f);\n        x = ((x & 0x00ff00ff) << 8) | ((x >>> 8) & 0x00ff00ff);\n        x = (x << 16) | (x >>> 16);\n        return x >>> 0;\n    }\n\n    // In-place bit-reversal permutation of fixed-size (sIn-byte) elements.\n    // Works for any element size, like the old pure-JS buffReverseBits. When\n    // the elements are 4-byte aligned it swaps Uint32Array lanes (no BigInt\n    // boxing, no allocation); otherwise it falls back to a byte-wise swap with\n    // a single reused temp buffer. Either way it touches no WASM linear memory.\n    function reverseInPlace(u8, sIn, bits) {\n        const n = u8.byteLength / sIn;\n        const shift = 32 - bits;\n        if (((sIn & 3) === 0) && ((u8.byteOffset & 3) === 0)) {\n            const lanes = sIn >>> 2;\n            const u32 = new Uint32Array(u8.buffer, u8.byteOffset, u8.byteLength >>> 2);\n            for (let i = 0; i < n; i++) {\n                const ri = rev32(i) >>> shift;\n                if (i < ri) {\n                    let a = i * lanes;\n                    let b = ri * lanes;\n                    for (let l = 0; l < lanes; l++) {\n                        const t = u32[a + l];\n                        u32[a + l] = u32[b + l];\n                        u32[b + l] = t;\n                    }\n                }\n            }\n        } else {\n            const tmp = new Uint8Array(sIn);   // one reused temp, not one per swap\n            for (let i = 0; i < n; i++) {\n                const ri = rev32(i) >>> shift;\n                if (i < ri) {\n                    const ao = i * sIn;\n                    const bo = ri * sIn;\n                    tmp.set(u8.subarray(ao, ao + sIn));\n                    u8.copyWithin(ao, bo, bo + sIn);\n                    u8.set(tmp, bo);\n                }\n            }\n        }\n    }\n\n    function alloc(length) {\n        const u32 = new Uint32Array(memory.buffer, 0, 1);\n        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers\n        const res = u32[0];\n        u32[0] += length;\n        if (u32[0] + length > memory.buffer.byteLength) {\n            const currentPages = memory.buffer.byteLength / 0x10000;\n            let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;\n            if (requiredPages>MAXMEM) requiredPages=MAXMEM;\n            memory.grow(requiredPages-currentPages);\n            console.log(\"Growing memory to\", memory.buffer.byteLength / 1024 / 1024, \"MB\");\n        }\n        return res;\n    }\n\n    function allocBuffer(buffer) {\n        const p = alloc(buffer.byteLength);\n        setBuffer(p, buffer);\n        return p;\n    }\n\n    function getBuffer(pointer, length) {\n        return new Uint8Array(memory.buffer, pointer, length);\n    }\n\n    function setBuffer(pointer, buffer) {\n        const u8 = new Uint8Array(memory.buffer);\n        u8.set(new Uint8Array(buffer), pointer);\n    }\n\n    function runTask(task) {\n        clearTimeout(terminationTimer);\n        wantToTerminate = false;\n        if (task[0].cmd === \"INIT\") {\n            return init(task[0]);\n        }\n        const ctx = {\n            vars: [],\n            out: []\n        };\n        const u32a = new Uint32Array(memory.buffer, 0, 1);\n        const oldAlloc = u32a[0];\n        for (let i=0; i<task.length; i++) {\n            switch (task[i].cmd) {\n            case \"REVERSE\": {\n                // Reverse the transferred buffer in place and hand it straight\n                // back. No SharedArrayBuffer and no WASM memory: the buffer is\n                // transferred in and out (zero copy) and reversed where it lies.\n                const t = task[i];\n                reverseInPlace(t.src, t.sIn, t.bits);\n                ctx.out[0] = t.src;\n                break;\n            }\n            case \"ALLOCSET\":\n                if (task[i].len / 1024 / 1024 > 25) {\n                    console.log(\"tasks\", task);\n                    //console.trace();\n                }\n                ctx.vars[task[i].var] = allocBuffer(task[i].buff);\n                break;\n            case \"ALLOC\":\n                if (task[i].len / 1024 / 1024 > 25) {\n                    console.log(\"tasks\", task);\n                    //console.trace();\n                }\n                ctx.vars[task[i].var] = alloc(task[i].len);\n                break;\n            case \"SET\":\n                setBuffer(ctx.vars[task[i].var], task[i].buff);\n                break;\n            case \"CALL\": {\n                const params = [];\n                for (let j=0; j<task[i].params.length; j++) {\n                    const p = task[i].params[j];\n                    if (typeof p.var !== \"undefined\") {\n                        params.push(ctx.vars[p.var] + (p.offset || 0));\n                    } else if (typeof p.val != \"undefined\") {\n                        params.push(p.val);\n                    }\n                }\n                {\n                    const fname = task[i].fnName;\n                    let fn = batchFns ? batchFns[fname] : undefined;\n                    if (!fn) {\n                        fn = instance.exports[fname];\n                        // graceful fallback: \"...Batch\" -> plain variant when the\n                        // batch module is unavailable (same 5-arg signature)\n                        if (!fn && fname.endsWith(\"Batch\")) fn = instance.exports[fname.slice(0, -5)];\n                    }\n                    fn(...params);\n                }\n                break;\n            }\n            case \"GET\":\n                ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();\n                break;\n            default:\n                throw new Error(\"Invalid cmd\");\n            }\n        }\n        const u32b = new Uint32Array(memory.buffer, 0, 1);\n        u32b[0] = oldAlloc;\n\n        return ctx.out;\n    }\n\n    function scheduleTermination() {\n        clearTimeout(terminationTimer);\n        if (terminationTimeout > 0) {\n            terminationTimer = setTimeout(() => {\n                // 2-phase termination: notify main thread first; close only after\n                // it acks with TERMINATE. This prevents the race where the main\n                // thread dispatches a task to a worker that has already closed.\n                wantToTerminate = true;\n                if (self) self.postMessage({status: \"want_to_terminate\"});\n            }, terminationTimeout);\n        }\n    }\n\n    function terminate() {\n        clearTimeout(terminationTimer);\n        if (self) {\n            console.log(\"TERMINATE\");\n            self.postMessage({status: \"terminated\"});\n            self.close();\n        }\n    }\n\n    return runTask;\n}"})(self)`;
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
    // Batch-affine MSM helper module (optional): compiled once, shipped to every
    // worker alongside the main module. n8f = base-field element size in bytes.
    tm.batchCode = wasm.batchCode;
    tm.batchWasmModule = wasm.batchCode ? await WebAssembly.compile(wasm.batchCode) : undefined;
    tm.n8f = wasm.n8q;

    if (singleThread) {
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice(),
            batchCode: tm.batchCode ? tm.batchCode.slice() : undefined,
            n8f: tm.n8f
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
            batchCode: this.batchWasmModule,
            n8f: this.n8f,
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
            // unreplaced when the point is already in jacobian form, so these may
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

function buildMultiexp$1(curve, groupName) {
    const G = curve[groupName];
    const tm = G.tm;

    const MAX_CHUNK_SIZE = 1 << 22;
    const MIN_CHUNK_SIZE = 1 << 12;

    // Byte size of one input point: affine = 2 coordinates, jacobian = 3.
    function pointSize(inType) {
        return inType === "affine" ? G.F.n8*2 : G.F.n8*3;
    }

    // Batch-affine "auto" threshold: use the batch module when a chunk's bases
    // fit comfortably in a per-worker share of the last-level cache. Measured
    // (20 cores, bn128): clear win up to ~1-2 MiB of bases per chunk (+10% on a
    // full 2^16 prove), parity but extra scratch memory at ~6 MiB chunks --
    // under full worker concurrency the fill phase is bandwidth-bound, so the
    // fewer-multiplications advantage only materializes while the random-access
    // set stays cache-resident.
    const AUTO_BATCH_MAX_BASES_BYTES = 1 << 21;

    // Resolve the batching mode: "auto" (default) | "enabled" | "disabled".
    // Accepts booleans as aliases. FF_NO_BATCH=1 force-disables globally
    // (benchmark escape hatch).
    function batchModeOf(options) {
        if (typeof process !== "undefined" && process.env && process.env.FF_NO_BATCH) return "disabled";
        const m = options ? options.batch : undefined;
        if (m === true || m === "enabled") return "enabled";
        if (m === false || m === "disabled") return "disabled";
        return "auto";
    }

    // WASM export name for this group + input representation. Affine input
    // routes to the batch-affine MSM module ("...Batch") depending on the
    // batching mode; the worker falls back to the plain in-module variant
    // when the batch module is absent.
    function fnNameFor(inType, basesBytes, batchMode) {
        const g = groupName === "G1" ? "g1m" : "g2m";
        if (inType !== "affine") return `${g}_multiexp`;
        const useBatch = batchMode === "enabled" ||
            (batchMode === "auto" && basesBytes <= AUTO_BATCH_MAX_BASES_BYTES);
        return `${g}_multiexpAffine${useBatch ? "Batch" : ""}`;
    }

    // Points per chunk. nChunks is derived from the scalar bit-width and rounded up
    // to a multiple of the worker count for even load balancing (G2 points are
    // larger, so we halve the chunk / double the count). Clamped to a sane range.
    function chunkSizeFor(nPoints, sScalar) {
        const bitChunkSize = pTSizes[log2(nPoints)];
        let nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) + 1;
        if (groupName === "G2") nChunks *= 2;
        nChunks = (Math.floor((nChunks-1) / tm.concurrency) + 1) * tm.concurrency;
        let chunkSize = Math.floor(nPoints / nChunks) + 1;
        if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
        return chunkSize;
    }

    // Run the multiexp of one chunk on a worker; returns the partial point.
    async function _multiExpChunk(buffBases, buffScalars, inType, batchMode, logText) {
        if (!(buffBases instanceof Uint8Array)) throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
        if (!(buffScalars instanceof Uint8Array)) throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
        const sGIn = pointSize(inType);
        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        if (nPoints === 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if (sScalar * nPoints !== buffScalars.byteLength) throw new Error(`${logText} Scalar size does not match`);

        const task = [
            {cmd: "ALLOCSET", var: 0, buff: buffBases},
            {cmd: "ALLOCSET", var: 1, buff: buffScalars},
            {cmd: "ALLOC",    var: 2, len: G.F.n8*3},
            {cmd: "CALL", fnName: fnNameFor(inType, buffBases.byteLength, batchMode), params: [
                {var: 0}, {var: 1}, {val: sScalar}, {val: nPoints}, {var: 2}
            ]},
            {cmd: "GET", out: 0, var: 2, len: G.F.n8*3},
        ];
        // transfer the chunk buffers to the worker (zero-copy); one GET -> one point
        const out = await tm.queueAction(task, [buffBases.buffer, buffScalars.buffer]);
        return out[0];
    }

    // Shared driver. `getChunk(byteOffset, byteLength)` supplies each bases chunk --
    // a synchronous slice of an in-memory buffer, or an async sub-range read. At most
    // `maxInFlight` chunks are sourced at once (Infinity = dispatch them all). The
    // point set is partitioned across chunks, so the full multiexp is the sum of the
    // per-chunk multiexps.
    async function _multiExpDispatch(getChunk, buffScalars, nPoints, sGIn, sScalar, inType, maxInFlight, batchMode, logger, logText) {
        if (nPoints === 0) return G.zero;
        const chunkSize = chunkSizeFor(nPoints, sScalar);
        const inFlight = new Set();
        const partials = [];

        for (let off = 0; off < nPoints; off += chunkSize) {
            const n = Math.min(nPoints - off, chunkSize);
            const at = off;
            // Backpressure: block until a slot frees (Promise.race also surfaces a
            // failed chunk promptly). With maxInFlight = Infinity this never blocks.
            while (inFlight.size >= maxInFlight) await Promise.race(inFlight);
            if (logger) logger.debug(`Multiexp start: ${logText}: ${at}/${nPoints}`);
            const op = (async () => {
                const basesChunk = await getChunk(at*sGIn, n*sGIn);
                const scalarsChunk = buffScalars.slice(at*sScalar, (at+n)*sScalar);
                const r = await _multiExpChunk(basesChunk, scalarsChunk, inType, batchMode, logText);
                if (logger) logger.debug(`Multiexp end: ${logText}: ${at}/${nPoints}`);
                return r;
            })();
            // settle-either-way cleanup so a rejected chunk can't wedge the set
            const slot = op.finally(() => inFlight.delete(slot));
            inFlight.add(slot);
            partials.push(slot);
        }

        const result = await Promise.all(partials);
        let res = G.zero;
        for (let i = result.length-1; i >= 0; i--) res = G.add(res, result[i]);
        return res;
    }

    // Derive nPoints/sScalar and validate before dispatching.
    function geometry(totalBasesBytes, buffScalars, inType) {
        const sGIn = pointSize(inType);
        const nPoints = Math.floor(totalBasesBytes / sGIn);
        let sScalar = 0;
        if (nPoints > 0) {
            sScalar = Math.floor(buffScalars.byteLength / nPoints);
            if (sScalar * nPoints !== buffScalars.byteLength) throw new Error("Scalar size does not match");
        }
        return { sGIn, nPoints, sScalar };
    }

    // multiexp over an in-memory bases buffer (sliced per chunk, all dispatched at once).
    async function _multiExp(buffBases, buffScalars, inType, batchMode, logger, logText) {
        const { sGIn, nPoints, sScalar } = geometry(buffBases.byteLength, buffScalars, inType);
        const getChunk = (off, len) => buffBases.slice(off, off + len);
        return _multiExpDispatch(getChunk, buffScalars, nPoints, sGIn, sScalar, inType, Infinity, batchMode, logger, logText);
    }

    G.multiExp = async function multiExp(buffBases, buffScalars, logger, logText) {
        return _multiExp(buffBases, buffScalars, "jacobian", "disabled", logger, logText);
    };
    // options.batch: "auto" (default) | "enabled" | "disabled" -- see batchModeOf.
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText, options) {
        return _multiExp(buffBases, buffScalars, "affine", batchModeOf(options), logger, logText);
    };

    // Streaming affine multiexp: bases are produced chunk-by-chunk by `basesReader`
    // (e.g. a direct sub-range file read) instead of being read whole and sliced --
    // no main-thread slice copy, and the full section never sits in RAM (reads are
    // bounded to a few in-flight chunks). Result is identical to multiExpAffine.
    G.multiExpAffineChunked = async function multiExpAffineChunked(basesReader, totalBasesBytes, buffScalars, logger, logText, options) {
        if (typeof basesReader !== "function") {
            throw new Error(`${logText || "multiExpAffineChunked"}: basesReader must be a function (byteOffset, byteLength) => Promise<Uint8Array>`);
        }
        const { sGIn, nPoints, sScalar } = geometry(totalBasesBytes, buffScalars, "affine");
        return _multiExpDispatch(basesReader, buffScalars, nPoints, sGIn, sScalar, "affine", tm.concurrency + 2, batchModeOf(options), logger, logText);
    };
}

function buildFFT$2(curve, groupName) {
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

    // `consume`: when true the caller cedes ownership of `buff` -- we skip the
    // defensive full-copy below and reverse/transfer the caller's buffer in place
    // (its backing ArrayBuffer is detached as a result). Only pass it when the
    // input is discarded right after the call (e.g. the groth16 IFFT->applyKey->FFT
    // pipeline). Default false preserves the input.
    async function _fft(buff, inverse, inType, outType, logger, loggerTxt, consume) {

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
        } else if (!consume || !ArrayBuffer.isView(buff)) {
            // Defensive copy: the bit-reversal runs in place and chunks are
            // transferred, so without consume we must not touch the caller's buffer.
            // It also flattens a BigBuffer (no single .buffer to transfer) to a
            // Uint8Array, so consume can only be honoured for an ArrayBuffer view.
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


    G.fft = async function(buff, inType, outType, logger, loggerTxt, consume) {
        return await _fft(buff, false, inType, outType, logger, loggerTxt, consume);
    };

    G.ifft = async function(buff, inType, outType, logger, loggerTxt, consume) {
        return await _fft(buff, true, inType, outType, logger, loggerTxt, consume);
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

    buildMultiexp$1(curve, "G1");
    buildMultiexp$1(curve, "G2");

    buildFFT$2(curve, "G1");
    buildFFT$2(curve, "G2");
    buildFFT$2(curve, "Fr");

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
// 'code' is base64 of the wasm-opt -O2 optimized wasm; the rest are
// pointer offsets / field moduli.
const code$2 = "AGFzbQEAAAABigEQYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgCH9/f39/f39/AGADf39/AX9gBH9/f38Bf2AKf39/f39/f39/fwBgBX9/f39/AX9gB39/f39/f38Bf2AJf39/f39/f39/AX9gC39/f39/f39/f39/AX8CDwEDZW52Bm1lbW9yeQIAGQObApkCAAUCBQYGCQkBAAADAQIBAQAAAQAAAAICAAUBAwQBAQMAAgIBAQAAAQAAAAICAAUBAwQBAQMAAgEAAAICAgUFAAAABgYGAAABAQEAAAEBAQAAAAAAAgIBAAEAAAAAAQEBAQEKBwgECAQDAwADAgAABAcHAQEHAAMLBAMCBQABAQABAQAAAwICBAMAAgICBQUAAAAGBgYAAAEBAQAAAQEBAAAAAAACAgEAAAAAAAEBAQEBCAQIBAMDAQADAAAEBwcBAQcBAAMAAAQHBwEBBwEBBAQEBAQAAgIFBQABAAEBAAIGAAMCBAMAAgIFBQABAQABAQAAAAAGAAMCAgQDAAIAAAAAAwMBAAAAAAAAAAAAAAAAAAAJDA0ODwEHryWrAghpbnRfY29weQAACGludF96ZXJvAAEHaW50X29uZQADCmludF9pc1plcm8AAgZpbnRfZXEABAdpbnRfZ3RlAAUHaW50X2FkZAAGB2ludF9zdWIABwdpbnRfbXVsAAgKaW50X3NxdWFyZQAJDWludF9zcXVhcmVPbGQACgdpbnRfZGl2AAsOaW50X2ludmVyc2VNb2QADAhmMW1fY29weQAACGYxbV96ZXJvAAEKZjFtX2lzWmVybwACBmYxbV9lcQAEB2YxbV9hZGQADgdmMW1fc3ViAA8HZjFtX25lZwAQDmYxbV9pc05lZ2F0aXZlABYJZjFtX2lzT25lAA0IZjFtX3NpZ24AFwtmMW1fbVJlZHVjdAARB2YxbV9tdWwAEgpmMW1fc3F1YXJlABMNZjFtX3NxdWFyZU9sZAATEmYxbV9mcm9tTW9udGdvbWVyeQAVEGYxbV90b01vbnRnb21lcnkAFAtmMW1faW52ZXJzZQAYB2YxbV9vbmUAGQhmMW1fbG9hZAAaD2YxbV90aW1lc1NjYWxhcgAbB2YxbV9leHAAHxBmMW1fYmF0Y2hJbnZlcnNlABwIZjFtX3NxcnQAIAxmMW1faXNTcXVhcmUAIRVmMW1fYmF0Y2hUb01vbnRnb21lcnkAHRdmMW1fYmF0Y2hGcm9tTW9udGdvbWVyeQAeCGZybV9jb3B5AAAIZnJtX3plcm8AAQpmcm1faXNaZXJvAAIGZnJtX2VxAAQHZnJtX2FkZAAjB2ZybV9zdWIAJAdmcm1fbmVnACUOZnJtX2lzTmVnYXRpdmUAKwlmcm1faXNPbmUAIghmcm1fc2lnbgAsC2ZybV9tUmVkdWN0ACYHZnJtX211bAAnCmZybV9zcXVhcmUAKA1mcm1fc3F1YXJlT2xkACgSZnJtX2Zyb21Nb250Z29tZXJ5ACoQZnJtX3RvTW9udGdvbWVyeQApC2ZybV9pbnZlcnNlAC0HZnJtX29uZQAuCGZybV9sb2FkAC8PZnJtX3RpbWVzU2NhbGFyADAHZnJtX2V4cAA0EGZybV9iYXRjaEludmVyc2UAMQhmcm1fc3FydAA1DGZybV9pc1NxdWFyZQA2FWZybV9iYXRjaFRvTW9udGdvbWVyeQAyF2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5ADMGZnJfYWRkACMGZnJfc3ViACQGZnJfbmVnACUGZnJfbXVsADcJZnJfc3F1YXJlADgKZnJfaW52ZXJzZQA5DWZyX2lzTmVnYXRpdmUAOgdmcl9jb3B5AAAHZnJfemVybwABBmZyX29uZQAuCWZyX2lzWmVybwACBWZyX2VxAAQMZzFtX211bHRpZXhwAGUSZzFtX211bHRpZXhwX2NodW5rAGQSZzFtX211bHRpZXhwQWZmaW5lAGcYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAGYKZzFtX2lzWmVybwA8EGcxbV9pc1plcm9BZmZpbmUAOwZnMW1fZXEARAtnMW1fZXFNaXhlZABDDGcxbV9lcUFmZmluZQBCCGcxbV9jb3B5AEAOZzFtX2NvcHlBZmZpbmUAPwhnMW1femVybwA+DmcxbV96ZXJvQWZmaW5lAD0KZzFtX2RvdWJsZQBGEGcxbV9kb3VibGVBZmZpbmUARQdnMW1fYWRkAEkMZzFtX2FkZE1peGVkAEgNZzFtX2FkZEFmZmluZQBHB2cxbV9uZWcASw1nMW1fbmVnQWZmaW5lAEoHZzFtX3N1YgBODGcxbV9zdWJNaXhlZABNDWcxbV9zdWJBZmZpbmUATBJnMW1fZnJvbU1vbnRnb21lcnkAUBhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUATxBnMW1fdG9Nb250Z29tZXJ5AFIWZzFtX3RvTW9udGdvbWVyeUFmZmluZQBRD2cxbV90aW1lc1NjYWxhcgBoFWcxbV90aW1lc1NjYWxhckFmZmluZQBpDWcxbV9ub3JtYWxpemUAVwpnMW1fTEVNdG9VAFkKZzFtX0xFTXRvQwBaCmcxbV9VdG9MRU0AWwpnMW1fQ3RvTEVNAFwPZzFtX2JhdGNoTEVNdG9VAF0PZzFtX2JhdGNoTEVNdG9DAF4PZzFtX2JhdGNoVXRvTEVNAF8PZzFtX2JhdGNoQ3RvTEVNAGAMZzFtX3RvQWZmaW5lAFMOZzFtX3RvSmFjb2JpYW4AQRFnMW1fYmF0Y2hUb0FmZmluZQBWE2cxbV9iYXRjaFRvSmFjb2JpYW4AYQtnMW1faW5DdXJ2ZQBVEWcxbV9pbkN1cnZlQWZmaW5lAFQXZnJtX19yZXZlcnNlUGVybXV0YXRpb24Aagdmcm1fZmZ0AG0IZnJtX2lmZnQAbgpmcm1fcmF3ZmZ0AGsLZnJtX2ZmdEpvaW4Abw5mcm1fZmZ0Sm9pbkV4dABwEWZybV9mZnRKb2luRXh0SW52AHEKZnJtX2ZmdE1peAByDGZybV9mZnRGaW5hbABzHWZybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAHQIcG9sX3plcm8AdQ9wb2xfY29uc3RydWN0TEMAdgxxYXBfYnVpbGRBQkMAdwtxYXBfam9pbkFCQwB4DHFhcF9iYXRjaEFkZAB5CmYybV9pc1plcm8AOwlmMm1faXNPbmUAeghmMm1femVybwA9B2YybV9vbmUAewhmMm1fY29weQB8B2YybV9tdWwAfQhmMm1fbXVsMQB+CmYybV9zcXVhcmUAfwdmMm1fYWRkAIABB2YybV9zdWIAgQEHZjJtX25lZwCCAQhmMm1fc2lnbgCFAQ1mMm1fY29uanVnYXRlAEoSZjJtX2Zyb21Nb250Z29tZXJ5AE8QZjJtX3RvTW9udGdvbWVyeQBRBmYybV9lcQBCC2YybV9pbnZlcnNlAIMBB2YybV9leHAAiAEPZjJtX3RpbWVzU2NhbGFyAIQBEGYybV9iYXRjaEludmVyc2UAhwEIZjJtX3NxcnQAiQEMZjJtX2lzU3F1YXJlAIoBDmYybV9pc05lZ2F0aXZlAIYBDGcybV9tdWx0aWV4cACyARJnMm1fbXVsdGlleHBfY2h1bmsAsQESZzJtX211bHRpZXhwQWZmaW5lALQBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawCzAQpnMm1faXNaZXJvAIwBEGcybV9pc1plcm9BZmZpbmUAiwEGZzJtX2VxAJQBC2cybV9lcU1peGVkAJMBDGcybV9lcUFmZmluZQCSAQhnMm1fY29weQCQAQ5nMm1fY29weUFmZmluZQCPAQhnMm1femVybwCOAQ5nMm1femVyb0FmZmluZQCNAQpnMm1fZG91YmxlAJYBEGcybV9kb3VibGVBZmZpbmUAlQEHZzJtX2FkZACZAQxnMm1fYWRkTWl4ZWQAmAENZzJtX2FkZEFmZmluZQCXAQdnMm1fbmVnAJsBDWcybV9uZWdBZmZpbmUAmgEHZzJtX3N1YgCeAQxnMm1fc3ViTWl4ZWQAnQENZzJtX3N1YkFmZmluZQCcARJnMm1fZnJvbU1vbnRnb21lcnkAoAEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAJ8BEGcybV90b01vbnRnb21lcnkAogEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQChAQ9nMm1fdGltZXNTY2FsYXIAtQEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lALYBDWcybV9ub3JtYWxpemUApwEKZzJtX0xFTXRvVQCoAQpnMm1fTEVNdG9DAKkBCmcybV9VdG9MRU0AqgEKZzJtX0N0b0xFTQCrAQ9nMm1fYmF0Y2hMRU10b1UArAEPZzJtX2JhdGNoTEVNdG9DAK0BD2cybV9iYXRjaFV0b0xFTQCuAQ9nMm1fYmF0Y2hDdG9MRU0ArwEMZzJtX3RvQWZmaW5lAKMBDmcybV90b0phY29iaWFuAJEBEWcybV9iYXRjaFRvQWZmaW5lAKYBE2cybV9iYXRjaFRvSmFjb2JpYW4AsAELZzJtX2luQ3VydmUApQERZzJtX2luQ3VydmVBZmZpbmUApAELZzFtX3RpbWVzRnIAtwEXZzFtX19yZXZlcnNlUGVybXV0YXRpb24AuAEHZzFtX2ZmdAC6AQhnMW1faWZmdAC7AQpnMW1fcmF3ZmZ0ALkBC2cxbV9mZnRKb2luALwBDmcxbV9mZnRKb2luRXh0AL0BEWcxbV9mZnRKb2luRXh0SW52AL4BCmcxbV9mZnRNaXgAvwEMZzFtX2ZmdEZpbmFsAMABHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAMEBC2cybV90aW1lc0ZyAMIBF2cybV9fcmV2ZXJzZVBlcm11dGF0aW9uAMMBB2cybV9mZnQAxQEIZzJtX2lmZnQAxgEKZzJtX3Jhd2ZmdADEAQtnMm1fZmZ0Sm9pbgDHAQ5nMm1fZmZ0Sm9pbkV4dADIARFnMm1fZmZ0Sm9pbkV4dEludgDJAQpnMm1fZmZ0TWl4AMoBDGcybV9mZnRGaW5hbADLAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDMARFnMW1fdGltZXNGckFmZmluZQDNARFnMm1fdGltZXNGckFmZmluZQDOARFmcm1fYmF0Y2hBcHBseUtleQDPARFnMW1fYmF0Y2hBcHBseUtleQDQARZnMW1fYmF0Y2hBcHBseUtleU1peGVkANEBEWcybV9iYXRjaEFwcGx5S2V5ANIBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA0wEKZjZtX2lzWmVybwDVAQlmNm1faXNPbmUA1gEIZjZtX3plcm8A1wEHZjZtX29uZQDYAQhmNm1fY29weQDZAQdmNm1fbXVsANoBCmY2bV9zcXVhcmUA2wEHZjZtX2FkZADcAQdmNm1fc3ViAN0BB2Y2bV9uZWcA3gEIZjZtX3NpZ24A3wESZjZtX2Zyb21Nb250Z29tZXJ5AKABEGY2bV90b01vbnRnb21lcnkAogEGZjZtX2VxAOABC2Y2bV9pbnZlcnNlAOEBB2Y2bV9leHAA5QEPZjZtX3RpbWVzU2NhbGFyAOIBEGY2bV9iYXRjaEludmVyc2UA5AEOZjZtX2lzTmVnYXRpdmUA4wEKZnRtX2lzWmVybwDnAQlmdG1faXNPbmUA6AEIZnRtX3plcm8A6QEHZnRtX29uZQDqAQhmdG1fY29weQDrAQdmdG1fbXVsAOwBCGZ0bV9tdWwxAO0BCmZ0bV9zcXVhcmUA7gEHZnRtX2FkZADvAQdmdG1fc3ViAPABB2Z0bV9uZWcA8QEIZnRtX3NpZ24A+AENZnRtX2Nvbmp1Z2F0ZQDyARJmdG1fZnJvbU1vbnRnb21lcnkA9AEQZnRtX3RvTW9udGdvbWVyeQDzAQZmdG1fZXEA9QELZnRtX2ludmVyc2UA9gEHZnRtX2V4cAD7AQ9mdG1fdGltZXNTY2FsYXIA9wEQZnRtX2JhdGNoSW52ZXJzZQD6AQhmdG1fc3FydAD8AQxmdG1faXNTcXVhcmUA/QEOZnRtX2lzTmVnYXRpdmUA+QEUYm4xMjhfX2Zyb2Jlbml1c01hcDAAhQIUYm4xMjhfX2Zyb2Jlbml1c01hcDEAhgIUYm4xMjhfX2Zyb2Jlbml1c01hcDIAhwIUYm4xMjhfX2Zyb2Jlbml1c01hcDMAiAIUYm4xMjhfX2Zyb2Jlbml1c01hcDQAiQIUYm4xMjhfX2Zyb2Jlbml1c01hcDUAigIUYm4xMjhfX2Zyb2Jlbml1c01hcDYAiwIUYm4xMjhfX2Zyb2Jlbml1c01hcDcAjAIUYm4xMjhfX2Zyb2Jlbml1c01hcDgAjQIUYm4xMjhfX2Zyb2Jlbml1c01hcDkAjgIQYm4xMjhfcGFpcmluZ0VxMQCTAhBibjEyOF9wYWlyaW5nRXEyAJQCEGJuMTI4X3BhaXJpbmdFcTMAlQIQYm4xMjhfcGFpcmluZ0VxNACWAhBibjEyOF9wYWlyaW5nRXE1AJcCDWJuMTI4X3BhaXJpbmcAmAIPYm4xMjhfcHJlcGFyZUcxAP8BD2JuMTI4X3ByZXBhcmVHMgCBAhBibjEyOF9taWxsZXJMb29wAIQCGWJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb24AkgIcYm4xMjhfZmluYWxFeHBvbmVudGlhdGlvbk9sZACPAg9ibjEyOF9fbXVsQnkwMjQAggISYm4xMjhfX211bEJ5MDI0T2xkAIMCF2JuMTI4X19jeWNsb3RvbWljU3F1YXJlAJACF2JuMTI4X19jeWNsb3RvbWljRXhwX3cwAJECCsv1ApkCKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAssACAAKQMYUAR+IAApAxBQBH4gACkDCFAEfiAAKQMABUIBCwVCAQsFQgELUAseACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxgLQAAgACkDGCABKQMYUQR/IAApAxAgASkDEFEEfyAAKQMIIAEpAwhRBH8gACkDACABKQMAUQVBAAsFQQALBUEACwtzACAAKQMYIAEpAxhUBH9BAAUgACkDGCABKQMYVgR/QQEFIAApAxAgASkDEFQEf0EABSAAKQMQIAEpAxBWBH9BAQUgACkDCCABKQMIVAR/QQAFIAApAwggASkDCFYEf0EBBSAAKQMAIAEpAwBaCwsLCwsLC8QBAQF+IAIgADUCACABNQIAfCIDPgIAIAIgADUCBCABNQIEfCADQiCIfCIDPgIEIAIgADUCCCABNQIIfCADQiCIfCIDPgIIIAIgADUCDCABNQIMfCADQiCIfCIDPgIMIAIgADUCECABNQIQfCADQiCIfCIDPgIQIAIgADUCFCABNQIUfCADQiCIfCIDPgIUIAIgADUCGCABNQIYfCADQiCIfCIDPgIYIAIgADUCHCABNQIcfCADQiCIfCIDPgIcIANCIIinC/wBAQF+IAIgADUCACABNQIAfSIDQv////8Pgz4CACACIAA1AgQgATUCBH0gA0Igh3wiA0L/////D4M+AgQgAiAANQIIIAE1Agh9IANCIId8IgNC/////w+DPgIIIAIgADUCDCABNQIMfSADQiCHfCIDQv////8Pgz4CDCACIAA1AhAgATUCEH0gA0Igh3wiA0L/////D4M+AhAgAiAANQIUIAE1AhR9IANCIId8IgNC/////w+DPgIUIAIgADUCGCABNQIYfSADQiCHfCIDQv////8Pgz4CGCACIAA1AhwgATUCHH0gA0Igh3wiA0L/////D4M+AhwgA0Igh6cL5g4BEX4gBCAANQIAIgUgATUCACIGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AgAgBEIgiCEDIAMgBSABNQIEIgd+IARC/////w+DfCIEQiCIfCEDIAMgADUCBCIIIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CBCADQiCIIQQgBCAFIAE1AggiCX4gA0L/////D4N8IgNCIIh8IQQgBCAHIAh+IANC/////w+DfCIDQiCIfCEEIAQgADUCCCIKIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CCCAEQiCIIQMgAyAFIAE1AgwiC34gBEL/////D4N8IgRCIIh8IQMgAyAIIAl+IARC/////w+DfCIEQiCIfCEDIAMgByAKfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AgwiDCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AgwgA0IgiCEEIAQgBSABNQIQIg1+IANC/////w+DfCIDQiCIfCEEIAQgCCALfiADQv////8Pg3wiA0IgiHwhBCAEIAkgCn4gA0L/////D4N8IgNCIIh8IQQgBCAHIAx+IANC/////w+DfCIDQiCIfCEEIAQgADUCECIOIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CECAEQiCIIQMgAyAFIAE1AhQiD34gBEL/////D4N8IgRCIIh8IQMgAyAIIA1+IARC/////w+DfCIEQiCIfCEDIAMgCiALfiAEQv////8Pg3wiBEIgiHwhAyADIAkgDH4gBEL/////D4N8IgRCIIh8IQMgAyAHIA5+IARC/////w+DfCIEQiCIfCEDIAMgADUCFCIQIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CFCADQiCIIQQgBCAFIAE1AhgiEX4gA0L/////D4N8IgNCIIh8IQQgBCAIIA9+IANC/////w+DfCIDQiCIfCEEIAQgCiANfiADQv////8Pg3wiA0IgiHwhBCAEIAsgDH4gA0L/////D4N8IgNCIIh8IQQgBCAJIA5+IANC/////w+DfCIDQiCIfCEEIAQgByAQfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AhgiEiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AhggBEIgiCEDIAMgBSABNQIcIhN+IARC/////w+DfCIEQiCIfCEDIAMgCCARfiAEQv////8Pg3wiBEIgiHwhAyADIAogD34gBEL/////D4N8IgRCIIh8IQMgAyAMIA1+IARC/////w+DfCIEQiCIfCEDIAMgCyAOfiAEQv////8Pg3wiBEIgiHwhAyADIAkgEH4gBEL/////D4N8IgRCIIh8IQMgAyAHIBJ+IARC/////w+DfCIEQiCIfCEDIAMgADUCHCIFIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CHCADQiCIIQQgBCAIIBN+IANC/////w+DfCIDQiCIfCEEIAQgCiARfiADQv////8Pg3wiA0IgiHwhBCAEIAwgD34gA0L/////D4N8IgNCIIh8IQQgBCANIA5+IANC/////w+DfCIDQiCIfCEEIAQgCyAQfiADQv////8Pg3wiA0IgiHwhBCAEIAkgEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAd+IANC/////w+DfCIDQiCIfCEEIAIgAz4CICAEQiCIIQMgAyAKIBN+IARC/////w+DfCIEQiCIfCEDIAMgDCARfiAEQv////8Pg3wiBEIgiHwhAyADIA4gD34gBEL/////D4N8IgRCIIh8IQMgAyANIBB+IARC/////w+DfCIEQiCIfCEDIAMgCyASfiAEQv////8Pg3wiBEIgiHwhAyADIAUgCX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgIkIANCIIghBCAEIAwgE34gA0L/////D4N8IgNCIIh8IQQgBCAOIBF+IANC/////w+DfCIDQiCIfCEEIAQgDyAQfiADQv////8Pg3wiA0IgiHwhBCAEIA0gEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAt+IANC/////w+DfCIDQiCIfCEEIAIgAz4CKCAEQiCIIQMgAyAOIBN+IARC/////w+DfCIEQiCIfCEDIAMgECARfiAEQv////8Pg3wiBEIgiHwhAyADIA8gEn4gBEL/////D4N8IgRCIIh8IQMgAyAFIA1+IARC/////w+DfCIEQiCIfCEDIAIgBD4CLCADQiCIIQQgBCAQIBN+IANC/////w+DfCIDQiCIfCEEIAQgESASfiADQv////8Pg3wiA0IgiHwhBCAEIAUgD34gA0L/////D4N8IgNCIIh8IQQgAiADPgIwIARCIIghAyADIBIgE34gBEL/////D4N8IgRCIIh8IQMgAyAFIBF+IARC/////w+DfCIEQiCIfCEDIAIgBD4CNCADQiCIIQQgBCAFIBN+IANC/////w+DfCIDQiCIfCEEIAIgAz4COCACIAQ+AjwLzg0BDH4gAyAANQIAIgYgBn4gAkL/////D4N8IgJCIIh8IQMgASACPgIAIAMiBEIgiCEFIAA1AgQiByAGfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgQgAyIEQiCIIQUgADUCCCIIIAZ+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAcgB34gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgggAyIEQiCIIQUgADUCDCIJIAZ+IgJCIIghAyADIAcgCH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgwgAyIEQiCIIQUgADUCECIKIAZ+IgJCIIghAyADIAcgCX4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAIIAh+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIQIAMiBEIgiCEFIAA1AhQiCyAGfiICQiCIIQMgAyAHIAp+IAJC/////w+DfCICQiCIfCEDIAMgCCAJfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CFCADIgRCIIghBSAANQIYIgwgBn4iAkIgiCEDIAMgByALfiACQv////8Pg3wiAkIgiHwhAyADIAggCn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAJIAl+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIYIAMiBEIgiCEFIAA1AhwiDSAGfiICQiCIIQMgAyAHIAx+IAJC/////w+DfCICQiCIfCEDIAMgCCALfiACQv////8Pg3wiAkIgiHwhAyADIAkgCn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhwgAyIEQiCIIQUgByANfiICQiCIIQMgAyAIIAx+IAJC/////w+DfCICQiCIfCEDIAMgCSALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAogCn4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiAgAyIEQiCIIQUgCCANfiICQiCIIQMgAyAJIAx+IAJC/////w+DfCICQiCIfCEDIAMgCiALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CJCADIgRCIIghBSAJIA1+IgJCIIghAyADIAogDH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyALIAt+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIoIAMiBEIgiCEFIAogDX4iAkIgiCEDIAMgCyAMfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CLCADIgRCIIghBSALIA1+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAwgDH4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjAgAyIEQiCIIQUgDCANfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjQgAyIEQiCIIQVCACECQgAhAyADIA0gDX4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjggASADPgI8CwoAIAAgACABEAgL5AMCA34BfyAAIANB6AAgAxsiAxAAIAFBKBAAIAJByAAgAhsiBxABQYgBEAFBHyEAQR8hAQNAIAFBKGotAAAgAUEDRnJFBEAgAUEBayEBDAELCyABQSVqNQAAQgF8IgZCAVEEQEIAQgCAGgsDQAJAA0AgACADai0AACAAQQdGckUEQCAAQQFrIQAMAQsLIAAgA2pBB2spAAAgBoAhBCAAIAFrQQRrIQIDQCAEQoCAgIBwg1AgAkEATnFFBEAgBEIIiCEEIAJBAWohAgwBCwsgBFAEQCADQSgQBUUNAUIBIQRBACECC0GoAUEoNQAAIAR+IgU+AABBrAFBLDUAACAEfiAFQiCIfCIFPgAAQbABQTA1AAAgBH4gBUIgiHwiBT4AAEG0AUE0NQAAIAR+IAVCIIh8IgU+AABBuAFBODUAACAEfiAFQiCIfCIFPgAAQbwBQTw1AAAgBH4gBUIgiHwiBT4AAEHAAUHAADUAACAEfiAFQiCIfCIFPgAAQcQBQcQANQAAIAR+IAVCIIh8PgAAIANBqAEgAmsgAxAHGiACIAdqIgIgAjUAACAEfCIEPgAAIARCIIghBANAIARCAFIEQCACQQRqIgI1AAAgBHwhBCACIAQ+AAAgBEIgiCEEDAELCwwBCwsLjgIBCn9ByAEhA0HIARABQegBIQggAUHoARAAQYgCIQlBiAIQA0GoAiEGIABBqAIQAEHIAiELQegCIQpByAMhBANAIAYQAkUEQCAIIAYgCyAKEAsgCyAJQYgDEAggBwR/IAUEf0GIAyADEAUEf0GIAyADIAQQBxpBAAUgA0GIAyAEEAcaQQELBUGIAyADIAQQBhpBAQsFIAUEf0GIAyADIAQQBhpBAAUgA0GIAxAFBH8gA0GIAyAEEAcaQQAFQYgDIAMgBBAHGkEBCwsLIQwgAyEAIAkhAyAEIQkgACEEIAUhByAMIQUgCCEAIAYhCCAKIQYgACEKDAELCyAHBEAgASADIAIQBxoFIAMgAhAACwsJACAAQagEEAQLLAAgACABIAIQBgRAIAJB6AMgAhAHGgUgAkHoAxAFBEAgAkHoAyACEAcaCwsLFwAgACABIAIQBwRAIAJB6AMgAhAGGgsLCwBByAQgACABEA8Ltg8BA34gACAANQIAQonHmaQOIgQgADUCAH5C/////w+DIgNB6AM1AgB+fCICPgIAIAAgADUCBCACQiCIfEHsAzUCACADfnwiAj4CBCAAIAA1AgggAkIgiHxB8AM1AgAgA358IgI+AgggACAANQIMIAJCIIh8QfQDNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEH4AzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB/AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QYAENQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGEBDUCACADfnwiAj4CHEGIBiACQiCIPgIAIAAgADUCBCAANQIEIAR+Qv////8PgyIDQegDNQIAfnwiAj4CBCAAIAA1AgggAkIgiHxB7AM1AgAgA358IgI+AgggACAANQIMIAJCIIh8QfADNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEH0AzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB+AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfwDNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGABDUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBhAQ1AgAgA358IgI+AiBBjAYgAkIgiD4CACAAIAA1AgggADUCCCAEfkL/////D4MiA0HoAzUCAH58IgI+AgggACAANQIMIAJCIIh8QewDNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEHwAzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB9AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfgDNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEH8AzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBgAQ1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QYQENQIAIAN+fCICPgIkQZAGIAJCIIg+AgAgACAANQIMIAA1AgwgBH5C/////w+DIgNB6AM1AgB+fCICPgIMIAAgADUCECACQiCIfEHsAzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB8AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfQDNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEH4AzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB/AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QYAENQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGEBDUCACADfnwiAj4CKEGUBiACQiCIPgIAIAAgADUCECAANQIQIAR+Qv////8PgyIDQegDNQIAfnwiAj4CECAAIAA1AhQgAkIgiHxB7AM1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfADNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEH0AzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB+AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfwDNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGABDUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxBhAQ1AgAgA358IgI+AixBmAYgAkIgiD4CACAAIAA1AhQgADUCFCAEfkL/////D4MiA0HoAzUCAH58IgI+AhQgACAANQIYIAJCIIh8QewDNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEHwAzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB9AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfgDNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH8AzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxBgAQ1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QYQENQIAIAN+fCICPgIwQZwGIAJCIIg+AgAgACAANQIYIAA1AhggBH5C/////w+DIgNB6AM1AgB+fCICPgIYIAAgADUCHCACQiCIfEHsAzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB8AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfQDNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH4AzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB/AM1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QYAENQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEGEBDUCACADfnwiAj4CNEGgBiACQiCIPgIAIAAgADUCHCAANQIcIAR+Qv////8PgyIDQegDNQIAfnwiAj4CHCAAIAA1AiAgAkIgiHxB7AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfADNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH0AzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB+AM1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QfwDNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEGABDUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxBhAQ1AgAgA358IgI+AjhBpAYgAkIgiD4CAEGIBiAAQSBqIAEQDguAHwEUfiAFIAE1AgAiBCAANQIAIg9+fCIDQv////8PgyEFIAYgADUCBCIQIAR+fCADQiCIfCIDQv////8PgyEGIAcgADUCCCIRIAR+fCADQiCIfCIDQv////8PgyEHIAggADUCDCISIAR+fCADQiCIfCIDQv////8PgyEIIAkgADUCECITIAR+fCADQiCIfCIDQv////8PgyEJIAogADUCFCIUIAR+fCADQiCIfCIDQv////8PgyEKIAsgADUCGCIVIAR+fCADQiCIfCIDQv////8PgyELIAwgADUCHCIWIAR+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSAOIANCIIh8IQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AgQiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AggiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AgwiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AhAiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AhQiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AhgiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AhwiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gAiAFIAVCiceZpA5+Qv////8PgyIEQsf688MNfnxCIIggBiAEQpaYguEDfnx8IgNC/////w+DPgIAIAIgByAEQo2Vx8MGfnwgA0IgiHwiA0L/////D4M+AgQgAiAIIARCkdWFvAl+fCADQiCIfCIDQv////8Pgz4CCCACIAkgBELdsIWMCH58IANCIIh8IgNC/////w+DPgIMIAIgCiAEQraLwcILfnwgA0IgiHwiA0L/////D4M+AhAgAiALIARCqcDGiQ5+fCADQiCIfCIDQv////8Pgz4CFCACIAwgBELynJGDA358IANCIIh8IgNC/////w+DPgIYIAIgDSADQiCIfCIDQv////8Pgz4CHCAOIANCIIh8pwRAIAJB6AMgAhAHGgUgAkHoAxAFBEAgAkHoAyACEAcaCwsLCgAgACAAIAEQEgsLACAAQYgEIAEQEgsVACAAQYgKEABBqAoQAUGICiABEBELEQAgAEHIChAVQcgKQYgFEAULIwAgABACBEBBAA8LIABB6AoQFUHoCkGIBRAFBEBBfw8LQQELFwAgACABEBUgAUHoAyABEAwgASABEBQLCQBBqAQgABAAC7wBAQJ/IAIQAUEgIQMDQCABIANPBEAgA0EgRgRAQYgLEBkFQYgLQYgEQYgLEBILIABBiAtBqAsQEiACQagLIAIQDiAAQSBqIQAgA0EgaiEDDAELCyABQR9xIgRFBEAPC0GoCxABQQAhAQNAIAEgBEZFBEAgASAALQAAOgCoCyAAQQFqIQAgAUEBaiEBDAELCyADQSBGBEBBiAsQGQVBiAtBiARBiAsQEgtBqAtBiAtBqAsQEiACQagLIAIQDgscACABIAJByAsQGkHIC0HICxAUIABByAsgAxASC+EBAQJ/QQBBACgCACIFIAJBAWpBBXRqNgIAIAUQGSAFQSBqIQUDQCACIAZHBEAgABACBEAgBUEgayAFEAAFIAAgBUEgayAFEBILIAAgAWohACAFQSBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBIGsiBSAFEBgDQCAGBEAgABACBEAgBSAFQSBrEAAgAhABBSAFQSBrQegLEAAgBSAAIAVBIGsQEiAFQegLIAIQEgsgACABayEAIAIgBGshAiAFQSBrIQUgBkEBayEGDAELC0EAIAU2AgALLQEBfwNAIAEgA0ZFBEAgACACEBQgAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhAVIABBIGohACACQSBqIQIgA0EBaiEDDAELCwuXAgAgAkUEQCADEBkPCyAAQYgMEAAgAxAZA0AgAkEBayICIAFqLQAAIQAgAyADEBMgAEGAAU8EQCADQYgMIAMQEiAAQYABayEACyADIAMQEyAAQcAATwRAIANBiAwgAxASIABBQGohAAsgAyADEBMgAEEgTwRAIANBiAwgAxASIABBIGshAAsgAyADEBMgAEEQTwRAIANBiAwgAxASIABBEGshAAsgAyADEBMgAEEITwRAIANBiAwgAxASIABBCGshAAsgAyADEBMgAEEETwRAIANBiAwgAxASIABBBGshAAsgAyADEBMgAEECTwRAIANBiAwgAxASIABBAmshAAsgAyADEBMgAARAIANBiAwgAxASCyACDQALC9UBAQF/IAAQAgRAIAEQAQ8LQQEhAkHIBUGoDBAAIABBqAVBIEHIDBAfIABB6AVBIEHoDBAfA0BByAxBqAQQBEUEQEHIDEGIDRATQQEhAANAQYgNQagEEARFBEBBiA1BiA0QEyAAQQFqIQAMAQsLQagMQagNEAAgAiAAa0EBayECA0AgAgRAQagNQagNEBMgAkEBayECDAELCyAAIQJBqA1BqAwQE0HIDEGoDEHIDBASQegMQagNQegMEBIMAQsLQegMEBYEQEHoDCABEBAFQegMIAEQAAsLIAAgABACBEBBAQ8LIABB6ARBIEHIDRAfQcgNQagEEAQLCQAgAEGoDhAECywAIAAgASACEAYEQCACQegNIAIQBxoFIAJB6A0QBQRAIAJB6A0gAhAHGgsLCxcAIAAgASACEAcEQCACQegNIAIQBhoLCwsAQcgOIAAgARAkC7YPAQN+IAAgADUCAEL/////DiIEIAA1AgB+Qv////8PgyIDQegNNQIAfnwiAj4CACAAIAA1AgQgAkIgiHxB7A01AgAgA358IgI+AgQgACAANQIIIAJCIIh8QfANNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEH0DTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB+A01AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfwNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGADjUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBhA41AgAgA358IgI+AhxBiBAgAkIgiD4CACAAIAA1AgQgADUCBCAEfkL/////D4MiA0HoDTUCAH58IgI+AgQgACAANQIIIAJCIIh8QewNNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEHwDTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB9A01AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfgNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH8DTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBgA41AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYQONQIAIAN+fCICPgIgQYwQIAJCIIg+AgAgACAANQIIIAA1AgggBH5C/////w+DIgNB6A01AgB+fCICPgIIIAAgADUCDCACQiCIfEHsDTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB8A01AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfQNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH4DTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB/A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYAONQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGEDjUCACADfnwiAj4CJEGQECACQiCIPgIAIAAgADUCDCAANQIMIAR+Qv////8PgyIDQegNNQIAfnwiAj4CDCAAIAA1AhAgAkIgiHxB7A01AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfANNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH0DTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB+A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfwNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGADjUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBhA41AgAgA358IgI+AihBlBAgAkIgiD4CACAAIAA1AhAgADUCECAEfkL/////D4MiA0HoDTUCAH58IgI+AhAgACAANQIUIAJCIIh8QewNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHwDTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB9A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfgNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH8DTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBgA41AgAgA358IgI+AiggACAANQIsIAJCIIh8QYQONQIAIAN+fCICPgIsQZgQIAJCIIg+AgAgACAANQIUIAA1AhQgBH5C/////w+DIgNB6A01AgB+fCICPgIUIAAgADUCGCACQiCIfEHsDTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB8A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfQNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH4DTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB/A01AgAgA358IgI+AiggACAANQIsIAJCIIh8QYAONQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGEDjUCACADfnwiAj4CMEGcECACQiCIPgIAIAAgADUCGCAANQIYIAR+Qv////8PgyIDQegNNQIAfnwiAj4CGCAAIAA1AhwgAkIgiHxB7A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfANNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH0DTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB+A01AgAgA358IgI+AiggACAANQIsIAJCIIh8QfwNNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGADjUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBhA41AgAgA358IgI+AjRBoBAgAkIgiD4CACAAIAA1AhwgADUCHCAEfkL/////D4MiA0HoDTUCAH58IgI+AhwgACAANQIgIAJCIIh8QewNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHwDTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB9A01AgAgA358IgI+AiggACAANQIsIAJCIIh8QfgNNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEH8DTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBgA41AgAgA358IgI+AjQgACAANQI4IAJCIIh8QYQONQIAIAN+fCICPgI4QaQQIAJCIIg+AgBBiBAgAEEgaiABECMLgB8BFH4gBSABNQIAIgQgADUCACIPfnwiA0L/////D4MhBSAGIAA1AgQiECAEfnwgA0IgiHwiA0L/////D4MhBiAHIAA1AggiESAEfnwgA0IgiHwiA0L/////D4MhByAIIAA1AgwiEiAEfnwgA0IgiHwiA0L/////D4MhCCAJIAA1AhAiEyAEfnwgA0IgiHwiA0L/////D4MhCSAKIAA1AhQiFCAEfnwgA0IgiHwiA0L/////D4MhCiALIAA1AhgiFSAEfnwgA0IgiHwiA0L/////D4MhCyAMIAA1AhwiFiAEfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gDiADQiCIfCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIEIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIIIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIMIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIQIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIUIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIYIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIcIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAIgBSAFQv////8OfkL/////D4MiBEKBgICAD358QiCIIAYgBEKT64efBH58fCIDQv////8Pgz4CACACIAcgBEKR4eXNB358IANCIIh8IgNC/////w+DPgIEIAIgCCAEQsjQz8ECfnwgA0IgiHwiA0L/////D4M+AgggAiAJIARC3bCFjAh+fCADQiCIfCIDQv////8Pgz4CDCACIAogBEK2i8HCC358IANCIIh8IgNC/////w+DPgIQIAIgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4M+AhQgAiAMIARC8pyRgwN+fCADQiCIfCIDQv////8Pgz4CGCACIA0gA0IgiHwiA0L/////D4M+AhwgDiADQiCIfKcEQCACQegNIAIQBxoFIAJB6A0QBQRAIAJB6A0gAhAHGgsLCwoAIAAgACABECcLCwAgAEGIDiABECcLFQAgAEGIFBAAQagUEAFBiBQgARAmCxEAIABByBQQKkHIFEGIDxAFCyMAIAAQAgRAQQAPCyAAQegUECpB6BRBiA8QBQRAQX8PC0EBCxcAIAAgARAqIAFB6A0gARAMIAEgARApCwkAQagOIAAQAAu8AQECfyACEAFBICEDA0AgASADTwRAIANBIEYEQEGIFRAuBUGIFUGIDkGIFRAnCyAAQYgVQagVECcgAkGoFSACECMgAEEgaiEAIANBIGohAwwBCwsgAUEfcSIERQRADwtBqBUQAUEAIQEDQCABIARGRQRAIAEgAC0AADoAqBUgAEEBaiEAIAFBAWohAQwBCwsgA0EgRgRAQYgVEC4FQYgVQYgOQYgVECcLQagVQYgVQagVECcgAkGoFSACECMLHAAgASACQcgVEC9ByBVByBUQKSAAQcgVIAMQJwvhAQECf0EAQQAoAgAiBSACQQFqQQV0ajYCACAFEC4gBUEgaiEFA0AgAiAGRwRAIAAQAgRAIAVBIGsgBRAABSAAIAVBIGsgBRAnCyAAIAFqIQAgBUEgaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQSBrIgUgBRAtA0AgBgRAIAAQAgRAIAUgBUEgaxAAIAIQAQUgBUEga0HoFRAAIAUgACAFQSBrECcgBUHoFSACECcLIAAgAWshACACIARrIQIgBUEgayEFIAZBAWshBgwBCwtBACAFNgIACy0BAX8DQCABIANGRQRAIAAgAhApIABBIGohACACQSBqIQIgA0EBaiEDDAELCwstAQF/A0AgASADRkUEQCAAIAIQKiAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLlwIAIAJFBEAgAxAuDwsgAEGIFhAAIAMQLgNAIAJBAWsiAiABai0AACEAIAMgAxAoIABBgAFPBEAgA0GIFiADECcgAEGAAWshAAsgAyADECggAEHAAE8EQCADQYgWIAMQJyAAQUBqIQALIAMgAxAoIABBIE8EQCADQYgWIAMQJyAAQSBrIQALIAMgAxAoIABBEE8EQCADQYgWIAMQJyAAQRBrIQALIAMgAxAoIABBCE8EQCADQYgWIAMQJyAAQQhrIQALIAMgAxAoIABBBE8EQCADQYgWIAMQJyAAQQRrIQALIAMgAxAoIABBAk8EQCADQYgWIAMQJyAAQQJrIQALIAMgAxAoIAAEQCADQYgWIAMQJwsgAg0ACwvVAQEBfyAAEAIEQCABEAEPC0EcIQJByA9BqBYQACAAQagPQSBByBYQNCAAQegPQSBB6BYQNANAQcgWQagOEARFBEBByBZBiBcQKEEBIQADQEGIF0GoDhAERQRAQYgXQYgXECggAEEBaiEADAELC0GoFkGoFxAAIAIgAGtBAWshAgNAIAIEQEGoF0GoFxAoIAJBAWshAgwBCwsgACECQagXQagWEChByBZBqBZByBYQJ0HoFkGoF0HoFhAnDAELC0HoFhArBEBB6BYgARAlBUHoFiABEAALCyAAIAAQAgRAQQEPCyAAQegOQSBByBcQNEHIF0GoDhAECxUAIAAgAUHoFxAnQegXQYgOIAIQJwsKACAAIAAgARA3CwsAIABB6A0gARAMCwkAIABBiA8QBQsOACAAEAIgAEEgahACcQsJACAAQUBrEAILDQAgABABIABBIGoQAQsUACAAEAEgAEEgahAZIABBQGsQAQtSACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4C3oAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNA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QagoQcgoEA5BiChByCcgAhAPIAJByCggAhAPQagmQcgnQegoEBJB6ChB6ChB6CgQDkGoKCACIAJBIGoQDyACQSBqQegnIAJBIGoQEiACQSBqQegoIAJBIGoQDyADIAQgAkFAaxAOIAJBQGsgAkFAaxATIAJBQGtB6CQgAkFAaxAPIAJBQGtBiCUgAkFAaxAPIAJBQGtB6CYgAkFAaxASCxQAIAAgARAAIABBIGogAUEgahAQCyAAIAAgARAAIABBIGogAUEgahAQIABBQGsgAUFAaxAACxIAIAFBiCkQSiAAQYgpIAIQRwsSACABQegpEEogAEHoKSACEEgLEgAgAUHIKhBLIABByCogAhBJCxQAIAAgARAVIABBIGogAUEgahAVCyAAIAAgARAVIABBIGogAUEgahAVIABBQGsgAUFAaxAVCxQAIAAgARAUIABBIGogAUEgahAUCyAAIAAgARAUIABBIGogAUEgahAUIABBQGsgAUFAaxAUC0oAIAAQPARAIAEQASABQSBqEAEFIABBQGtBqCsQGEGoK0HIKxATQagrQcgrQegrEBIgAEHIKyABEBIgAEEgakHoKyABQSBqEBILCzAAIABBIGpBiCwQEyAAQagsEBMgAEGoLEGoLBASQagsQYgYQagsEA5BiCxBqCwQBAsOACAAQcgsEFNByCwQVAuUAQEDf0EAQQAoAgAiBCABQQV0ajYCACAAQUBrQeAAIAEgBEEgEBwgBCEDA0AgASAFRwRAIAMQAgRAIAIQASACQSBqEAEFIAMgAEEgakGILRASIAMgAxATIAMgACACEBIgA0GILSACQSBqEBILIABB4ABqIQAgAkFAayECIANBIGohAyAFQQFqIQUMAQsLQQAgBDYCAAtKACAAEDwEQCABED4FIABBQGtBqC0QGEGoLUHILRATQagtQcgtQegtEBIgAEHILSABEBIgAEEgakHoLSABQSBqEBIgAUFAaxAZCwsyACABIAJqQQFrIQEDQCABIAJIRQRAIAEgAC0AADoAACABQQFrIQEgAEEBaiEADAELCwsqACAAEDsEQCABED0PCyAAQYguEE9BiC5BICABEFhBqC5BICABQSBqEFgLQQAgABA7BEAgARABIAFBwAA6AAAPCyAAQcguEBVByC5BICABEFggAEEgahAXQX9GBEAgASABLQAAQYABcjoA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ASAIa0EFdGogAEEMakHI2AAQJyANIAogBmtBBXRqIg1ByNgAIA0QIyAAQSxqIQAMAgsACwsgBCELIAUhACADIgogB0EFdGohDANAIAogDEZFBEAgCiALIAAQJyAKQSBqIQogC0EgaiELIABBIGohAAwBCwsLSgAgACADQQV0aiEDA0AgACADRkUEQCAAIAFB6NgAECdB6NgAIAIgBBAkIABBIGohACABQSBqIQEgAkEgaiECIARBIGohBAwBCwsLNwAgACACQQV0aiECA0AgACACRkUEQCAAIAEgAxAjIABBIGohACABQSBqIQEgA0EgaiEDDAELCwsOACAAEA0gAEEgahACcQsNACAAEBkgAEEgahABCxQAIAAgARAAIABBIGogAUEgahAAC3UAIAAgAUGI2QAQEiAAQSBqIAFBIGpBqNkAEBIgACAAQSBqQcjZABAOIAEgAUEgakHo2QAQDkHI2QBB6NkAQcjZABASQajZACACEBBBiNkAIAIgAhAOQYjZAEGo2QAgAkEgahAOQcjZACACQSBqIAJBIGoQDwsYACAAIAEgAhASIABBIGogASACQSBqEBILcAAgACAAQSBqQYjaABASIAAgAEEgakGo2gAQDiAAQSBqQcjaABAQIABByNoAQcjaABAOQYjaAEHo2gAQEEHo2gBBiNoAQejaABAOQajaAEHI2gAgARASIAFB6NoAIAEQD0GI2gBBiNoAIAFBIGoQDgsbACAAIAEgAhAOIABBIGogAUEgaiACQSBqEA4LGwAgACABIAIQDyAAQSBqIAFBIGogAkEgahAPCxQAIAAgARAQIABBIGogAUEgahAQC10AIABBiNsAEBMgAEEgakGo2wAQE0Go2wBByNsAEBBBiNsAQcjbAEHI2wAQD0HI2wBB6NsAEBggAEHo2wAgARASIABBIGpB6NsAIAFBIGoQEiABQSBqIAFBIGoQEAscACAAIAEgAiADEBsgAEEgaiABIAIgA0EgahAbCxcBAX8gAEEgahAXIgEEQCABDwsgABAXCxgAIABBIGoQAgRAIAAQFg8LIABBIGoQFgvkAQECf0EAQQAoAgAiBSACQQFqQQZ0ajYCACAFEHsgBUFAayEFA0AgAiAGRwRAIAAQOwRAIAVBQGogBRB8BSAAIAVBQGogBRB9CyAAIAFqIQAgBUFAayEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQUBqIgUgBRCDAQNAIAYEQCAAEDsEQCAFIAVBQGoQfCACED0FIAVBQGpBiNwAEHwgBSAAIAVBQGoQfSAFQYjcACACEH0LIAAgAWshACACIARrIQIgBUFAaiEFIAZBAWshBgwBCwtBACAFNgIAC6ACACACRQRAIAMQew8LIABByNwAEHwgAxB7A0AgAkEBayICIAFqLQAAIQAgAyADEH8gAEGAAU8EQCADQcjcACADEH0gAEGAAWshAAsgAyADEH8gAEHAAE8EQCADQcjcACADEH0gAEFAaiEACyADIAMQfyAAQSBPBEAgA0HI3AAgAxB9IABBIGshAAsgAyADEH8gAEEQTwRAIANByNwAIAMQfSAAQRBrIQALIAMgAxB/IABBCE8EQCADQcjcACADEH0gAEEIayEACyADIAMQfyAAQQRPBEAgA0HI3AAgAxB9IABBBGshAAsgAyADEH8gAEECTwRAIANByNwAIAMQfSAAQQJrIQALIAMgAxB/IAAEQCADQcjcACADEH0LIAINAAsLwgEAQYjfABB7QYjfAEGI3wAQggEgAEGI3QBBIEHI3QAQiAFByN0AQYjeABB/IABBiN4AQYjeABB9QYjeAEHI3gAQSkHI3gBBiN4AQcjeABB9QcjeAEGI3wAQQgRAAAtByN0AIABByN8AEH1BiN4AQYjfABBCBEBBiN8AEAFBqN8AEBlBiN8AQcjfACABEH0FQYjgABB7QYjgAEGI3gBBiOAAEIABQYjgAEGo3QBBIEGI4AAQiAFBiOAAQcjfACABEH0LC2IAQajiABB7QajiAEGo4gAQggEgAEHI4ABBIEHo4AAQiAFB6OAAQajhABB/IABBqOEAQajhABB9QajhAEHo4QAQSkHo4QBBqOEAQejhABB9QejhAEGo4gAQQgRAQQAPC0EBCw4AIAAQOyAAQUBrEDtxCwoAIABBgAFqEDsLDQAgABA9IABBQGsQPQsVACAAED0gAEFAaxB7IABBgAFqED0LogEAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNY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IABBQGtBiIsCEIEBQYiLAiAAQYABakGIiwIQgAFBiIsCQYiLAhB/IABBQGsgAEGAAWpByIsCEH1ByIsCQciLAkGIjAIQgAEgAEGAAWpByIwCEH9BiIwCIAEQ1AFByIkCIAEgARCAAUHIjAIgAUFAaxDUAUHIigIgAUFAayABQUBrEIABQciJAkHIjAIgAUGAAWoQgAFBiIwCIAFBgAFqIAFBgAFqEIEBQYiLAiABQYABaiABQYABahCAAUHIigIgAUGAAWogAUGAAWoQgAELMgAgACABIAIQgAEgAEFAayABQUBrIAJBQGsQgAEgAEGAAWogAUGAAWogAkGAAWoQgAELMgAgACABIAIQgQEgAEFAayABQUBrIAJBQGsQgQEgAEGAAWogAUGAAWogAkGAAWoQgQELJQAgACABEIIBIABBQGsgAUFAaxCCASAAQYABaiABQYABahCCAQsqAQF/IABBgAFqEIUBIgEEQCABDwsgAEFAaxCFASIBBEAgAQ8LIAAQhQELJAAgACABEEIgAEFAayABQUBrEEJxIABBgAFqIAFBgAFqEEJxC5oCACAAQYiNAhB/IABBQGtByI0CEH8gAEGAAWpBiI4CEH8gACAAQUBrQciOAhB9IAAgAEGAAWpBiI8CEH0gAEFAayAAQYABakHIjwIQfUHIjwJBiJACENQBQYiNAkGIkAJBiJACEIEBQYiOAkHIkAIQ1AFByJACQciOAkHIkAIQgQFByI0CQYiPAkGIkQIQgQEgAEGAAWpByJACQciRAhB9IABBQGtBiJECQYiSAhB9QciRAkGIkgJByJECEIABQciRAkHIkQIQ1AEgAEGIkAJBiJICEH1BiJICQciRAkHIkQIQgAFByJECQciRAhCDAUHIkQJBiJACIAEQfUHIkQJByJACIAFBQGsQfUHIkQJBiJECIAFBgAFqEH0LMQAgACABIAIgAxCEASAAQUBrIAEgAiADQUBrEIQBIABBgAFqIAEgAiADQYABahCEAQspACAAQYABahA7BEAgACAAQUBrIABBQGsQOxsQhgEPCyAAQYABahCGAQv4AQECf0EAQQAoAgAiBSACQQFqQcABbGo2AgAgBRDYASAFQcABaiEFA0AgAiAGRwRAIAAQ1QEEQCAFQcABayAFENkBBSAAIAVBwAFrIAUQ2gELIAAgAWohACAFQcABaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQcABayIFIAUQ4QEDQCAGBEAgABDVAQRAIAUgBUHAAWsQ2QEgAhDXAQUgBUHAAWtByJICENkBIAUgACAFQcABaxDaASAFQciSAiACENoBCyAAIAFrIQAgAiAEayECIAVBwAFrIQUgBkEBayEGDAELC0EAIAU2AgALswIAIAJFBEAgAxDYAQ8LIABBiJQCENkBIAMQ2AEDQCACQQFrIgIgAWotAAAhACADIAMQ2wEgAEGAAU8EQCADQYiUAiADENoBIABBgAFrIQALIAMgAxDbASAAQcAATwRAIANBiJQCIAMQ2gEgAEFAaiEACyADIAMQ2wEgAEEgTwRAIANBiJQCIAMQ2gEgAEEgayEACyADIAMQ2wEgAEEQTwRAIANBiJQCIAMQ2gEgAEEQayEACyADIAMQ2wEgAEEITwRAIANBiJQCIAMQ2gEgAEEIayEACyADIAMQ2wEgAEEETwRAIANBiJQCIAMQ2gEgAEEEayEACyADIAMQ2wEgAEECTwRAIANBiJQCIAMQ2gEgAEECayEACyADIAMQ2wEgAARAIANBiJQCIAMQ2gELIAINAAsLJgBByIECIABBgAFqIAEQfSAAIAFBQGsQfCAAQUBrIAFBgAFqEHwLEQAgABDVASAAQcABahDVAXELEQAgABDWASAAQcABahDVAXELEAAgABDXASAAQcABahDXAQsQACAAENgBIABBwAFqENcBCxgAIAAgARDZASAAQcABaiABQcABahDZAQuFAQAgACABQciVAhDaASAAQcABaiABQcABakGIlwIQ2gEgACAAQcABakHImAIQ3AEgASABQcABakGImgIQ3AFByJgCQYiaAkHImAIQ2gFBiJcCIAIQ5gFByJUCIAIgAhDcAUHIlQJBiJcCIAJBwAFqENwBQciYAiACQcABaiACQcABahDdAQscACAAIAEgAhDaASAAQcABaiABIAJBwAFqENoBC30AIAAgAEHAAWpByJsCENoBIAAgAEHAAWpBiJ0CENwBIABBwAFqQcieAhDmASAAQcieAkHIngIQ3AFByJsCQYigAhDmAUGIoAJByJsCQYigAhDcAUGInQJByJ4CIAEQ2gEgAUGIoAIgARDdAUHImwJByJsCIAFBwAFqENwBCyAAIAAgASACENwBIABB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";
const pq$1 = 488;
const pG1gen$1 = 32008;
const pG1zero$1 = 32104;
const pG1b$1 = 3080;
const pG2gen$1 = 32200;
const pG2zero$1 = 32392;
const pG2b$1 = 12648;
const pOneT$1 = 32584;
const prePSize$1 = 192;
const preQSize$1 = 19776;
const q$1 = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
const r$1 = "21888242871839275222246405745257275088548364400416034343698204186575808495617";

// AUTO-GENERATED from wasmcurves/build/msm_batch.wasm — do not edit.
// Regenerate with: npm run gen-wasm
// Batch-affine MSM module; links against the main curve module at runtime.
const code$1 = "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";

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

async function buildBn128$1(singleThread, plugins) {
    if ((!singleThread) && (curve_bn128)) return curve_bn128;

    let bn128wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: statically imported (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES
        // hardened realms alike. Regenerate the vendored module with `npm run gen-wasm`.
        bn128wasm.code = base64ToUint8Array(code$2);
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
        const { ModuleBuilder } = await Promise.resolve().then(function () { return main; });
        const { buildBn128: buildBn128wasm } = await Promise.resolve().then(function () { return index; });

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

    // Batch-affine MSM helper module (curve-independent; links against the
    // main module's exports + memory at runtime in each worker).
    bn128wasm.batchCode = base64ToUint8Array(code$1);

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
// 'code' is base64 of the wasm-opt -O2 optimized wasm; the rest are
// pointer offsets / field moduli.
const code = "AGFzbQEAAAABjwERYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgA39/fwF/YAh/f39/f39/fwBgAn9+AGAEf39/fwF/YAp/f39/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIPAQNlbnYGbWVtb3J5AgAZA60CqwIABQIFBgYICAEAAAoDAQIBAQAAAQAAAAICAAUBAwQBAQMAAgAFAgUGBggIAQAAAwECAQEAAAEAAAACAgAFAQMEAQEDAAIBAAACAgIFBQAAAAYGBgAAAQEBAAABAQEAAAAAAAICAQABAAAAAAEBAQEBCwcJBAkEAwMAAwIAAAQHBwEBBwADDAQDAgUAAQEAAQEAAAMCAgQDAAICAgUFAAAABgYGAAABAQEAAAEBAQAAAAAAAgIBAAAAAAABAQEBAQkECQQDAwEAAwAABAcHAQEHAQADAAAEBwcBAQcBAQQEBAQEAAICBQUAAQABAQACBgADAgQDAAICBQUAAQEAAQEAAAAABgADAgIEAwACAQMEAQAAAAAAAAAAAAACAgICAAABAAAAAAgNDg8QAQe8J70CCWludHFfY29weQAACWludHFfemVybwABCGludHFfb25lAAMLaW50cV9pc1plcm8AAgdpbnRxX2VxAAQIaW50cV9ndGUABQhpbnRxX2FkZAAGCGludHFfc3ViAAcIaW50cV9tdWwACAtpbnRxX3NxdWFyZQAJDmludHFfc3F1YXJlT2xkAAoIaW50cV9kaXYADA9pbnRxX2ludmVyc2VNb2QADQhmMW1fY29weQAACGYxbV96ZXJvAAEKZjFtX2lzWmVybwACBmYxbV9lcQAEB2YxbV9hZGQADwdmMW1fc3ViABAHZjFtX25lZwARDmYxbV9pc05lZ2F0aXZlABcJZjFtX2lzT25lAA4IZjFtX3NpZ24AGAtmMW1fbVJlZHVjdAASB2YxbV9tdWwAEwpmMW1fc3F1YXJlABQNZjFtX3NxdWFyZU9sZAAUEmYxbV9mcm9tTW9udGdvbWVyeQAWEGYxbV90b01vbnRnb21lcnkAFQtmMW1faW52ZXJzZQAZB2YxbV9vbmUAGghmMW1fbG9hZAAbD2YxbV90aW1lc1NjYWxhcgAcB2YxbV9leHAAIBBmMW1fYmF0Y2hJbnZlcnNlAB0IZjFtX3NxcnQAIQxmMW1faXNTcXVhcmUAIhVmMW1fYmF0Y2hUb01vbnRnb21lcnkAHhdmMW1fYmF0Y2hGcm9tTW9udGdvbWVyeQAfCWludHJfY29weQAjCWludHJfemVybwAkCGludHJfb25lACYLaW50cl9pc1plcm8AJQdpbnRyX2VxACcIaW50cl9ndGUAKAhpbnRyX2FkZAApCGludHJfc3ViACoIaW50cl9tdWwAKwtpbnRyX3NxdWFyZQAsDmludHJfc3F1YXJlT2xkAC0IaW50cl9kaXYALg9pbnRyX2ludmVyc2VNb2QALwhmcm1fY29weQAjCGZybV96ZXJvACQKZnJtX2lzWmVybwAlBmZybV9lcQAnB2ZybV9hZGQAMQdmcm1fc3ViADIHZnJtX25lZwAzDmZybV9pc05lZ2F0aXZlADkJZnJtX2lzT25lADAIZnJtX3NpZ24AOgtmcm1fbVJlZHVjdAA0B2ZybV9tdWwANQpmcm1fc3F1YXJlADYNZnJtX3NxdWFyZU9sZAA2EmZybV9mcm9tTW9udGdvbWVyeQA4EGZybV90b01vbnRnb21lcnkANwtmcm1faW52ZXJzZQA7B2ZybV9vbmUAPAhmcm1fbG9hZAA9D2ZybV90aW1lc1NjYWxhcgA+B2ZybV9leHAAQhBmcm1fYmF0Y2hJbnZlcnNlAD8IZnJtX3NxcnQAQwxmcm1faXNTcXVhcmUARBVmcm1fYmF0Y2hUb01vbnRnb21lcnkAQBdmcm1fYmF0Y2hGcm9tTW9udGdvbWVyeQBBBmZyX2FkZAAxBmZyX3N1YgAyBmZyX25lZwAzBmZyX211bABFCWZyX3NxdWFyZQBGCmZyX2ludmVyc2UARw1mcl9pc05lZ2F0aXZlAEgHZnJfY29weQAjB2ZyX3plcm8AJAZmcl9vbmUAPAlmcl9pc1plcm8AJQVmcl9lcQAnDGcxbV9tdWx0aWV4cABzEmcxbV9tdWx0aWV4cF9jaHVuawByEmcxbV9tdWx0aWV4cEFmZmluZQB1GGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawB0CmcxbV9pc1plcm8AShBnMW1faXNaZXJvQWZmaW5lAEkGZzFtX2VxAFILZzFtX2VxTWl4ZWQAUQxnMW1fZXFBZmZpbmUAUAhnMW1fY29weQBODmcxbV9jb3B5QWZmaW5lAE0IZzFtX3plcm8ATA5nMW1femVyb0FmZmluZQBLCmcxbV9kb3VibGUAVBBnMW1fZG91YmxlQWZmaW5lAFMHZzFtX2FkZABXDGcxbV9hZGRNaXhlZABWDWcxbV9hZGRBZmZpbmUAVQdnMW1fbmVnAFkNZzFtX25lZ0FmZmluZQBYB2cxbV9zdWIAXAxnMW1fc3ViTWl4ZWQAWw1nMW1fc3ViQWZmaW5lAFoSZzFtX2Zyb21Nb250Z29tZXJ5AF4YZzFtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAF0QZzFtX3RvTW9udGdvbWVyeQBgFmcxbV90b01vbnRnb21lcnlBZmZpbmUAXw9nMW1fdGltZXNTY2FsYXIAdhVnMW1fdGltZXNTY2FsYXJBZmZpbmUAdw1nMW1fbm9ybWFsaXplAGUKZzFtX0xFTXRvVQBnCmcxbV9MRU10b0MAaApnMW1fVXRvTEVNAGkKZzFtX0N0b0xFTQBqD2cxbV9iYXRjaExFTXRvVQBrD2cxbV9iYXRjaExFTXRvQwBsD2cxbV9iYXRjaFV0b0xFTQBtD2cxbV9iYXRjaEN0b0xFTQBuDGcxbV90b0FmZmluZQBhDmcxbV90b0phY29iaWFuAE8RZzFtX2JhdGNoVG9BZmZpbmUAZBNnMW1fYmF0Y2hUb0phY29iaWFuAG8LZzFtX2luQ3VydmUAYxFnMW1faW5DdXJ2ZUFmZmluZQBiF2ZybV9fcmV2ZXJzZVBlcm11dGF0aW9uAHgHZnJtX2ZmdAB7CGZybV9pZmZ0AHwKZnJtX3Jhd2ZmdAB5C2ZybV9mZnRKb2luAH0OZnJtX2ZmdEpvaW5FeHQAfhFmcm1fZmZ0Sm9pbkV4dEludgB/CmZybV9mZnRNaXgAgAEMZnJtX2ZmdEZpbmFsAIEBHWZybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAIIBCHBvbF96ZXJvAIMBD3BvbF9jb25zdHJ1Y3RMQwCEAQxxYXBfYnVpbGRBQkMAhQELcWFwX2pvaW5BQkMAhgEMcWFwX2JhdGNoQWRkAIcBCmYybV9pc1plcm8ASQlmMm1faXNPbmUAiAEIZjJtX3plcm8ASwdmMm1fb25lAIkBCGYybV9jb3B5AIoBB2YybV9tdWwAiwEIZjJtX211bDEAjAEKZjJtX3NxdWFyZQCNAQdmMm1fYWRkAI4BB2YybV9zdWIAjwEHZjJtX25lZwCQAQhmMm1fc2lnbgCTAQ1mMm1fY29uanVnYXRlAFgSZjJtX2Zyb21Nb250Z29tZXJ5AF0QZjJtX3RvTW9udGdvbWVyeQBfBmYybV9lcQBQC2YybV9pbnZlcnNlAJEBB2YybV9leHAAlgEPZjJtX3RpbWVzU2NhbGFyAJIBEGYybV9iYXRjaEludmVyc2UAlQEIZjJtX3NxcnQAlwEMZjJtX2lzU3F1YXJlAJgBDmYybV9pc05lZ2F0aXZlAJQBDGcybV9tdWx0aWV4cADAARJnMm1fbXVsdGlleHBfY2h1bmsAvwESZzJtX211bHRpZXhwQWZmaW5lAMIBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawDBAQpnMm1faXNaZXJvAJoBEGcybV9pc1plcm9BZmZpbmUAmQEGZzJtX2VxAKIBC2cybV9lcU1peGVkAKEBDGcybV9lcUFmZmluZQCgAQhnMm1fY29weQCeAQ5nMm1fY29weUFmZmluZQCdAQhnMm1femVybwCcAQ5nMm1femVyb0FmZmluZQCbAQpnMm1fZG91YmxlAKQBEGcybV9kb3VibGVBZmZpbmUAowEHZzJtX2FkZACnAQxnMm1fYWRkTWl4ZWQApgENZzJtX2FkZEFmZmluZQClAQdnMm1fbmVnAKkBDWcybV9uZWdBZmZpbmUAqAEHZzJtX3N1YgCsAQxnMm1fc3ViTWl4ZWQAqwENZzJtX3N1YkFmZmluZQCqARJnMm1fZnJvbU1vbnRnb21lcnkArgEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAK0BEGcybV90b01vbnRnb21lcnkAsAEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQCvAQ9nMm1fdGltZXNTY2FsYXIAwwEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lAMQBDWcybV9ub3JtYWxpemUAtQEKZzJtX0xFTXRvVQC2AQpnMm1fTEVNdG9DALcBCmcybV9VdG9MRU0AuAEKZzJtX0N0b0xFTQC5AQ9nMm1fYmF0Y2hMRU10b1UAugEPZzJtX2JhdGNoTEVNdG9DALsBD2cybV9iYXRjaFV0b0xFTQC8AQ9nMm1fYmF0Y2hDdG9MRU0AvQEMZzJtX3RvQWZmaW5lALEBDmcybV90b0phY29iaWFuAJ8BEWcybV9iYXRjaFRvQWZmaW5lALQBE2cybV9iYXRjaFRvSmFjb2JpYW4AvgELZzJtX2luQ3VydmUAswERZzJtX2luQ3VydmVBZmZpbmUAsgELZzFtX3RpbWVzRnIAxQEXZzFtX19yZXZlcnNlUGVybXV0YXRpb24AxgEHZzFtX2ZmdADIAQhnMW1faWZmdADJAQpnMW1fcmF3ZmZ0AMcBC2cxbV9mZnRKb2luAMoBDmcxbV9mZnRKb2luRXh0AMsBEWcxbV9mZnRKb2luRXh0SW52AMwBCmcxbV9mZnRNaXgAzQEMZzFtX2ZmdEZpbmFsAM4BHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAM8BC2cybV90aW1lc0ZyANABF2cybV9fcmV2ZXJzZVBlcm11dGF0aW9uANEBB2cybV9mZnQA0wEIZzJtX2lmZnQA1AEKZzJtX3Jhd2ZmdADSAQtnMm1fZmZ0Sm9pbgDVAQ5nMm1fZmZ0Sm9pbkV4dADWARFnMm1fZmZ0Sm9pbkV4dEludgDXAQpnMm1fZmZ0TWl4ANgBDGcybV9mZnRGaW5hbADZAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDaARFnMW1fdGltZXNGckFmZmluZQDbARFnMm1fdGltZXNGckFmZmluZQDcARFmcm1fYmF0Y2hBcHBseUtleQDdARFnMW1fYmF0Y2hBcHBseUtleQDeARZnMW1fYmF0Y2hBcHBseUtleU1peGVkAN8BEWcybV9iYXRjaEFwcGx5S2V5AOABFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA4QEKZjZtX2lzWmVybwDjAQlmNm1faXNPbmUA5AEIZjZtX3plcm8A5QEHZjZtX29uZQDmAQhmNm1fY29weQDnAQdmNm1fbXVsAOgBCmY2bV9zcXVhcmUA6QEHZjZtX2FkZADqAQdmNm1fc3ViAOsBB2Y2bV9uZWcA7AEIZjZtX3NpZ24A7QESZjZtX2Zyb21Nb250Z29tZXJ5AK4BEGY2bV90b01vbnRnb21lcnkAsAEGZjZtX2VxAO4BC2Y2bV9pbnZlcnNlAO8BB2Y2bV9leHAA8wEPZjZtX3RpbWVzU2NhbGFyAPABEGY2bV9iYXRjaEludmVyc2UA8gEOZjZtX2lzTmVnYXRpdmUA8QEKZnRtX2lzWmVybwD1AQlmdG1faXNPbmUA9gEIZnRtX3plcm8A9wEHZnRtX29uZQD4AQhmdG1fY29weQD5AQdmdG1fbXVsAPoBCGZ0bV9tdWwxAPsBCmZ0bV9zcXVhcmUA/AEHZnRtX2FkZAD9AQdmdG1fc3ViAP4BB2Z0bV9uZWcA/wEIZnRtX3NpZ24AhgINZnRtX2Nvbmp1Z2F0ZQCAAhJmdG1fZnJvbU1vbnRnb21lcnkAggIQZnRtX3RvTW9udGdvbWVyeQCBAgZmdG1fZXEAgwILZnRtX2ludmVyc2UAhAIHZnRtX2V4cACJAg9mdG1fdGltZXNTY2FsYXIAhQIQZnRtX2JhdGNoSW52ZXJzZQCIAghmdG1fc3FydACKAgxmdG1faXNTcXVhcmUAiwIOZnRtX2lzTmVnYXRpdmUAhwIRZnRtX2Zyb2Jlbml1c01hcDAAkAIRZnRtX2Zyb2Jlbml1c01hcDEAkQIRZnRtX2Zyb2Jlbml1c01hcDIAkgIRZnRtX2Zyb2Jlbml1c01hcDMAkwIRZnRtX2Zyb2Jlbml1c01hcDQAlAIRZnRtX2Zyb2Jlbml1c01hcDUAlQIRZnRtX2Zyb2Jlbml1c01hcDYAlgIRZnRtX2Zyb2Jlbml1c01hcDcAlwIRZnRtX2Zyb2Jlbml1c01hcDgAmAIRZnRtX2Zyb2Jlbml1c01hcDkAmQITYmxzMTIzODFfcGFpcmluZ0VxMQClAhNibHMxMjM4MV9wYWlyaW5nRXEyAKYCE2JsczEyMzgxX3BhaXJpbmdFcTMApwITYmxzMTIzODFfcGFpcmluZ0VxNACoAhNibHMxMjM4MV9wYWlyaW5nRXE1AKkCEGJsczEyMzgxX3BhaXJpbmcAqgISYmxzMTIzODFfcHJlcGFyZUcxAJ4CEmJsczEyMzgxX3ByZXBhcmVHMgCfAhNibHMxMjM4MV9taWxsZXJMb29wAKACHGJsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb24ApAIfYmxzMTIzODFfZmluYWxFeHBvbmVudGlhdGlvbk9sZAChAhpibHMxMjM4MV9fY3ljbG90b21pY1NxdWFyZQCiAhpibHMxMjM4MV9fY3ljbG90b21pY0V4cF93MACjAghmNm1fbXVsMQCMAglmNm1fbXVsMDEAjQIKZnRtX211bDAxNACOAhFnMW1faW5Hcm91cEFmZmluZQCaAgtnMW1faW5Hcm91cACbAhFnMm1faW5Hcm91cEFmZmluZQCcAgtnMm1faW5Hcm91cACdAgrJgQSrAj4AIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoCywAIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGCAAQgA3AyAgAEIANwMoC0QAIAApAyhQBH4gACkDIFAEfiAAKQMYUAR+IAApAxBQBH4gACkDCFAEfiAAKQMABUIBCwVCAQsFQgELBUIBCwVCAQtQCywAIABCATcDACAAQgA3AwggAEIANwMQIABCADcDGCAAQgA3AyAgAEIANwMoC2IAIAApAyggASkDKFEEfyAAKQMgIAEpAyBRBH8gACkDGCABKQMYUQR/IAApAxAgASkDEFEEfyAAKQMIIAEpAwhRBH8gACkDACABKQMAUQVBAAsFQQALBUEACwVBAAsFQQALC7cBACAAKQMoIAEpAyhUBH9BAAUgACkDKCABKQMoVgR/QQEFIAApAyAgASkDIFQEf0EABSAAKQMgIAEpAyBWBH9BAQUgACkDGCABKQMYVAR/QQAFIAApAxggASkDGFYEf0EBBSAAKQMQIAEpAxBUBH9BAAUgACkDECABKQMQVgR/QQEFIAApAwggASkDCFQEf0EABSAAKQMIIAEpAwhWBH9BAQUgACkDACABKQMAWgsLCwsLCwsLCwsLpAIBAX4gAiAANQIAIAE1AgB8IgM+AgAgAiAANQIEIAE1AgR8IANCIIh8IgM+AgQgAiAANQIIIAE1Agh8IANCIIh8IgM+AgggAiAANQIMIAE1Agx8IANCIIh8IgM+AgwgAiAANQIQIAE1AhB8IANCIIh8IgM+AhAgAiAANQIUIAE1AhR8IANCIIh8IgM+AhQgAiAANQIYIAE1Ahh8IANCIIh8IgM+AhggAiAANQIcIAE1Ahx8IANCIIh8IgM+AhwgAiAANQIgIAE1AiB8IANCIIh8IgM+AiAgAiAANQIkIAE1AiR8IANCIIh8IgM+AiQgAiAANQIoIAE1Aih8IANCIIh8IgM+AiggAiAANQIsIAE1Aix8IANCIIh8IgM+AiwgA0IgiKcL+AIBAX4gAiAANQIAIAE1AgB9IgNC/////w+DPgIAIAIgADUCBCABNQIEfSADQiCHfCIDQv////8Pgz4CBCACIAA1AgggATUCCH0gA0Igh3wiA0L/////D4M+AgggAiAANQIMIAE1Agx9IANCIId8IgNC/////w+DPgIMIAIgADUCECABNQIQfSADQiCHfCIDQv////8Pgz4CECACIAA1AhQgATUCFH0gA0Igh3wiA0L/////D4M+AhQgAiAANQIYIAE1Ahh9IANCIId8IgNC/////w+DPgIYIAIgADUCHCABNQIcfSADQiCHfCIDQv////8Pgz4CHCACIAA1AiAgATUCIH0gA0Igh3wiA0L/////D4M+AiAgAiAANQIkIAE1AiR9IANCIId8IgNC/////w+DPgIkIAIgADUCKCABNQIofSADQiCHfCIDQv////8Pgz4CKCACIAA1AiwgATUCLH0gA0Igh3wiA0L/////D4M+AiwgA0Igh6cLzh8BGX4gBCAANQIAIgUgATUCACIGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AgAgBEIgiCEDIAMgBSABNQIEIgd+IARC/////w+DfCIEQiCIfCEDIAMgADUCBCIIIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CBCADQiCIIQQgBCAFIAE1AggiCX4gA0L/////D4N8IgNCIIh8IQQgBCAHIAh+IANC/////w+DfCIDQiCIfCEEIAQgADUCCCIKIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CCCAEQiCIIQMgAyAFIAE1AgwiC34gBEL/////D4N8IgRCIIh8IQMgAyAIIAl+IARC/////w+DfCIEQiCIfCEDIAMgByAKfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AgwiDCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AgwgA0IgiCEEIAQgBSABNQIQIg1+IANC/////w+DfCIDQiCIfCEEIAQgCCALfiADQv////8Pg3wiA0IgiHwhBCAEIAkgCn4gA0L/////D4N8IgNCIIh8IQQgBCAHIAx+IANC/////w+DfCIDQiCIfCEEIAQgADUCECIOIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CECAEQiCIIQMgAyAFIAE1AhQiD34gBEL/////D4N8IgRCIIh8IQMgAyAIIA1+IARC/////w+DfCIEQiCIfCEDIAMgCiALfiAEQv////8Pg3wiBEIgiHwhAyADIAkgDH4gBEL/////D4N8IgRCIIh8IQMgAyAHIA5+IARC/////w+DfCIEQiCIfCEDIAMgADUCFCIQIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CFCADQiCIIQQgBCAFIAE1AhgiEX4gA0L/////D4N8IgNCIIh8IQQgBCAIIA9+IANC/////w+DfCIDQiCIfCEEIAQgCiANfiADQv////8Pg3wiA0IgiHwhBCAEIAsgDH4gA0L/////D4N8IgNCIIh8IQQgBCAJIA5+IANC/////w+DfCIDQiCIfCEEIAQgByAQfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AhgiEiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AhggBEIgiCEDIAMgBSABNQIcIhN+IARC/////w+DfCIEQiCIfCEDIAMgCCARfiAEQv////8Pg3wiBEIgiHwhAyADIAogD34gBEL/////D4N8IgRCIIh8IQMgAyAMIA1+IARC/////w+DfCIEQiCIfCEDIAMgCyAOfiAEQv////8Pg3wiBEIgiHwhAyADIAkgEH4gBEL/////D4N8IgRCIIh8IQMgAyAHIBJ+IARC/////w+DfCIEQiCIfCEDIAMgADUCHCIUIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CHCADQiCIIQQgBCAFIAE1AiAiFX4gA0L/////D4N8IgNCIIh8IQQgBCAIIBN+IANC/////w+DfCIDQiCIfCEEIAQgCiARfiADQv////8Pg3wiA0IgiHwhBCAEIAwgD34gA0L/////D4N8IgNCIIh8IQQgBCANIA5+IANC/////w+DfCIDQiCIfCEEIAQgCyAQfiADQv////8Pg3wiA0IgiHwhBCAEIAkgEn4gA0L/////D4N8IgNCIIh8IQQgBCAHIBR+IANC/////w+DfCIDQiCIfCEEIAQgADUCICIWIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CICAEQiCIIQMgAyAFIAE1AiQiF34gBEL/////D4N8IgRCIIh8IQMgAyAIIBV+IARC/////w+DfCIEQiCIfCEDIAMgCiATfiAEQv////8Pg3wiBEIgiHwhAyADIAwgEX4gBEL/////D4N8IgRCIIh8IQMgAyAOIA9+IARC/////w+DfCIEQiCIfCEDIAMgDSAQfiAEQv////8Pg3wiBEIgiHwhAyADIAsgEn4gBEL/////D4N8IgRCIIh8IQMgAyAJIBR+IARC/////w+DfCIEQiCIfCEDIAMgByAWfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AiQiGCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AiQgA0IgiCEEIAQgBSABNQIoIhl+IANC/////w+DfCIDQiCIfCEEIAQgCCAXfiADQv////8Pg3wiA0IgiHwhBCAEIAogFX4gA0L/////D4N8IgNCIIh8IQQgBCAMIBN+IANC/////w+DfCIDQiCIfCEEIAQgDiARfiADQv////8Pg3wiA0IgiHwhBCAEIA8gEH4gA0L/////D4N8IgNCIIh8IQQgBCANIBJ+IANC/////w+DfCIDQiCIfCEEIAQgCyAUfiADQv////8Pg3wiA0IgiHwhBCAEIAkgFn4gA0L/////D4N8IgNCIIh8IQQgBCAHIBh+IANC/////w+DfCIDQiCIfCEEIAQgADUCKCIaIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CKCAEQiCIIQMgAyAFIAE1AiwiG34gBEL/////D4N8IgRCIIh8IQMgAyAIIBl+IARC/////w+DfCIEQiCIfCEDIAMgCiAXfiAEQv////8Pg3wiBEIgiHwhAyADIAwgFX4gBEL/////D4N8IgRCIIh8IQMgAyAOIBN+IARC/////w+DfCIEQiCIfCEDIAMgECARfiAEQv////8Pg3wiBEIgiHwhAyADIA8gEn4gBEL/////D4N8IgRCIIh8IQMgAyANIBR+IARC/////w+DfCIEQiCIfCEDIAMgCyAWfiAEQv////8Pg3wiBEIgiHwhAyADIAkgGH4gBEL/////D4N8IgRCIIh8IQMgAyAHIBp+IARC/////w+DfCIEQiCIfCEDIAMgADUCLCIFIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CLCADQiCIIQQgBCAIIBt+IANC/////w+DfCIDQiCIfCEEIAQgCiAZfiADQv////8Pg3wiA0IgiHwhBCAEIAwgF34gA0L/////D4N8IgNCIIh8IQQgBCAOIBV+IANC/////w+DfCIDQiCIfCEEIAQgECATfiADQv////8Pg3wiA0IgiHwhBCAEIBEgEn4gA0L/////D4N8IgNCIIh8IQQgBCAPIBR+IANC/////w+DfCIDQiCIfCEEIAQgDSAWfiADQv////8Pg3wiA0IgiHwhBCAEIAsgGH4gA0L/////D4N8IgNCIIh8IQQgBCAJIBp+IANC/////w+DfCIDQiCIfCEEIAQgBSAHfiADQv////8Pg3wiA0IgiHwhBCACIAM+AjAgBEIgiCEDIAMgCiAbfiAEQv////8Pg3wiBEIgiHwhAyADIAwgGX4gBEL/////D4N8IgRCIIh8IQMgAyAOIBd+IARC/////w+DfCIEQiCIfCEDIAMgECAVfiAEQv////8Pg3wiBEIgiHwhAyADIBIgE34gBEL/////D4N8IgRCIIh8IQMgAyARIBR+IARC/////w+DfCIEQiCIfCEDIAMgDyAWfiAEQv////8Pg3wiBEIgiHwhAyADIA0gGH4gBEL/////D4N8IgRCIIh8IQMgAyALIBp+IARC/////w+DfCIEQiCIfCEDIAMgBSAJfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AjQgA0IgiCEEIAQgDCAbfiADQv////8Pg3wiA0IgiHwhBCAEIA4gGX4gA0L/////D4N8IgNCIIh8IQQgBCAQIBd+IANC/////w+DfCIDQiCIfCEEIAQgEiAVfiADQv////8Pg3wiA0IgiHwhBCAEIBMgFH4gA0L/////D4N8IgNCIIh8IQQgBCARIBZ+IANC/////w+DfCIDQiCIfCEEIAQgDyAYfiADQv////8Pg3wiA0IgiHwhBCAEIA0gGn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAt+IANC/////w+DfCIDQiCIfCEEIAIgAz4COCAEQiCIIQMgAyAOIBt+IARC/////w+DfCIEQiCIfCEDIAMgECAZfiAEQv////8Pg3wiBEIgiHwhAyADIBIgF34gBEL/////D4N8IgRCIIh8IQMgAyAUIBV+IARC/////w+DfCIEQiCIfCEDIAMgEyAWfiAEQv////8Pg3wiBEIgiHwhAyADIBEgGH4gBEL/////D4N8IgRCIIh8IQMgAyAPIBp+IARC/////w+DfCIEQiCIfCEDIAMgBSANfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AjwgA0IgiCEEIAQgECAbfiADQv////8Pg3wiA0IgiHwhBCAEIBIgGX4gA0L/////D4N8IgNCIIh8IQQgBCAUIBd+IANC/////w+DfCIDQiCIfCEEIAQgFSAWfiADQv////8Pg3wiA0IgiHwhBCAEIBMgGH4gA0L/////D4N8IgNCIIh8IQQgBCARIBp+IANC/////w+DfCIDQiCIfCEEIAQgBSAPfiADQv////8Pg3wiA0IgiHwhBCACIAM+AkAgBEIgiCEDIAMgEiAbfiAEQv////8Pg3wiBEIgiHwhAyADIBQgGX4gBEL/////D4N8IgRCIIh8IQMgAyAWIBd+IARC/////w+DfCIEQiCIfCEDIAMgFSAYfiAEQv////8Pg3wiBEIgiHwhAyADIBMgGn4gBEL/////D4N8IgRCIIh8IQMgAyAFIBF+IARC/////w+DfCIEQiCIfCEDIAIgBD4CRCADQiCIIQQgBCAUIBt+IANC/////w+DfCIDQiCIfCEEIAQgFiAZfiADQv////8Pg3wiA0IgiHwhBCAEIBcgGH4gA0L/////D4N8IgNCIIh8IQQgBCAVIBp+IANC/////w+DfCIDQiCIfCEEIAQgBSATfiADQv////8Pg3wiA0IgiHwhBCACIAM+AkggBEIgiCEDIAMgFiAbfiAEQv////8Pg3wiBEIgiHwhAyADIBggGX4gBEL/////D4N8IgRCIIh8IQMgAyAXIBp+IARC/////w+DfCIEQiCIfCEDIAMgBSAVfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AkwgA0IgiCEEIAQgGCAbfiADQv////8Pg3wiA0IgiHwhBCAEIBkgGn4gA0L/////D4N8IgNCIIh8IQQgBCAFIBd+IANC/////w+DfCIDQiCIfCEEIAIgAz4CUCAEQiCIIQMgAyAaIBt+IARC/////w+DfCIEQiCIfCEDIAMgBSAZfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AlQgA0IgiCEEIAQgBSAbfiADQv////8Pg3wiA0IgiHwhBCACIAM+AlggAiAEPgJcC7wZARB+IAMgADUCACIGIAZ+IAJC/////w+DfCICQiCIfCEDIAEgAj4CACADIgRCIIghBSAANQIEIgcgBn4iAkIgiEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIEIAMiBEIgiCEFIAA1AggiCCAGfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAHIAd+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIIIAMiBEIgiCEFIAA1AgwiCSAGfiICQiCIIQMgAyAHIAh+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIMIAMiBEIgiCEFIAA1AhAiCiAGfiICQiCIIQMgAyAHIAl+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCCAIfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CECADIgRCIIghBSAANQIUIgsgBn4iAkIgiCEDIAMgByAKfiACQv////8Pg3wiAkIgiHwhAyADIAggCX4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhQgAyIEQiCIIQUgADUCGCIMIAZ+IgJCIIghAyADIAcgC34gAkL/////D4N8IgJCIIh8IQMgAyAIIAp+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCSAJfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CGCADIgRCIIghBSAANQIcIg0gBn4iAkIgiCEDIAMgByAMfiACQv////8Pg3wiAkIgiHwhAyADIAggC34gAkL/////D4N8IgJCIIh8IQMgAyAJIAp+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIcIAMiBEIgiCEFIAA1AiAiDiAGfiICQiCIIQMgAyAHIA1+IAJC/////w+DfCICQiCIfCEDIAMgCCAMfiACQv////8Pg3wiAkIgiHwhAyADIAkgC34gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAKIAp+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIgIAMiBEIgiCEFIAA1AiQiDyAGfiICQiCIIQMgAyAHIA5+IAJC/////w+DfCICQiCIfCEDIAMgCCANfiACQv////8Pg3wiAkIgiHwhAyADIAkgDH4gAkL/////D4N8IgJCIIh8IQMgAyAKIAt+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIkIAMiBEIgiCEFIAA1AigiECAGfiICQiCIIQMgAyAHIA9+IAJC/////w+DfCICQiCIfCEDIAMgCCAOfiACQv////8Pg3wiAkIgiHwhAyADIAkgDX4gAkL/////D4N8IgJCIIh8IQMgAyAKIAx+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCyALfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CKCADIgRCIIghBSAANQIsIhEgBn4iAkIgiCEDIAMgByAQfiACQv////8Pg3wiAkIgiHwhAyADIAggD34gAkL/////D4N8IgJCIIh8IQMgAyAJIA5+IAJC/////w+DfCICQiCIfCEDIAMgCiANfiACQv////8Pg3wiAkIgiHwhAyADIAsgDH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiwgAyIEQiCIIQUgByARfiICQiCIIQMgAyAIIBB+IAJC/////w+DfCICQiCIfCEDIAMgCSAPfiACQv////8Pg3wiAkIgiHwhAyADIAogDn4gAkL/////D4N8IgJCIIh8IQMgAyALIA1+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgDCAMfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CMCADIgRCIIghBSAIIBF+IgJCIIghAyADIAkgEH4gAkL/////D4N8IgJCIIh8IQMgAyAKIA9+IAJC/////w+DfCICQiCIfCEDIAMgCyAOfiACQv////8Pg3wiAkIgiHwhAyADIAwgDX4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjQgAyIEQiCIIQUgCSARfiICQiCIIQMgAyAKIBB+IAJC/////w+DfCICQiCIfCEDIAMgCyAPfiACQv////8Pg3wiAkIgiHwhAyADIAwgDn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyANIA1+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgI4IAMiBEIgiCEFIAogEX4iAkIgiCEDIAMgCyAQfiACQv////8Pg3wiAkIgiHwhAyADIAwgD34gAkL/////D4N8IgJCIIh8IQMgAyANIA5+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgI8IAMiBEIgiCEFIAsgEX4iAkIgiCEDIAMgDCAQfiACQv////8Pg3wiAkIgiHwhAyADIA0gD34gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAOIA5+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgJAIAMiBEIgiCEFIAwgEX4iAkIgiCEDIAMgDSAQfiACQv////8Pg3wiAkIgiHwhAyADIA4gD34gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AkQgAyIEQiCIIQUgDSARfiICQiCIIQMgAyAOIBB+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgDyAPfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CSCADIgRCIIghBSAOIBF+IgJCIIghAyADIA8gEH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AkwgAyIEQiCIIQUgDyARfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAQIBB+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgJQIAMiBEIgiCEFIBAgEX4iAkIgiEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgJUIAMiBEIgiCEFQgAhAkIAIQMgAyARIBF+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgJYIAEgAz4CXAsKACAAIAAgARAIC0EAIAAgADUAACABfCIBPgAAIAFCIIghAQNAIAFQRQRAIABBBGoiADUAACABfCEBIAAgAT4AACABQiCIIQEMAQsLC4QEAgN+AX8gACADQYgBIAMbIgMQACABQSgQACACQdgAIAIbIgcQAUG4ARABQS8hAEEvIQEDQCABQShqLQAAIAFBA0ZyRQRAIAFBAWshAQwBCwsgAUElajUAAEIBfCIGQgFRBEBCAEIAgBoLA0ACQANAIAAgA2otAAAgAEEHRnJFBEAgAEEBayEADAELCyAAIANqQQdrKQAAIAaAIQUgACABa0EEayECA0AgBUKAgICAcINQIAJBAE5xRQRAIAVCCIghBSACQQFqIQIMAQsLIAVQBEAgA0EoEAVFDQFCASEFQQAhAgtB6AFBKDUAACAFfiIEPgAAQewBQSw1AAAgBX4gBEIgiHwiBD4AAEHwAUEwNQAAIAV+IARCIIh8IgQ+AABB9AFBNDUAACAF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CSACQiCIPgIAIAAgADUCLCAANQIsIAR+Qv////8PgyIDQcgFNQIAfnwiAj4CLCAAIAA1AjAgAkIgiHxBzAU1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QdAFNQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEHUBTUCACADfnwiAj4COCAAIAA1AjwgAkIgiHxB2AU1AgAgA358IgI+AjwgACAANQJAIAJCIIh8QdwFNQIAIAN+fCICPgJAIAAgADUCRCACQiCIfEHgBTUCACADfnwiAj4CRCAAIAA1AkggAkIgiHxB5AU1AgAgA358IgI+AkggACAANQJMIAJCIIh8QegFNQIAIAN+fCICPgJMIAAgADUCUCACQiCIfEHsBTUCACADfnwiAj4CUCAAIAA1AlQgAkIgiHxB8AU1AgAgA358IgI+AlQgACAANQJYIAJCIIh8QfQFNQIAIAN+fCICPgJYQaQJIAJCIIg+AgBB+AggAEEwaiABEA8LzEIBHH4gBSABNQIAIgQgADUCACITfnwiA0L/////D4MhBSAGIAA1AgQiFCAEfnwgA0IgiHwiA0L/////D4MhBiAHIAA1AggiFSAEfnwgA0IgiHwiA0L/////D4MhByAIIAA1AgwiFiAEfnwgA0IgiHwiA0L/////D4MhCCAJIAA1AhAiFyAEfnwgA0IgiHwiA0L/////D4MhCSAKIAA1AhQiGCAEfnwgA0IgiHwiA0L/////D4MhCiALIAA1AhgiGSAEfnwgA0IgiHwiA0L/////D4MhCyAMIAA1AhwiGiAEfnwgA0IgiHwiA0L/////D4MhDCANIAA1AiAiGyAEfnwgA0IgiHwiA0L/////D4MhDSAOIAA1AiQiHCAEfnwgA0IgiHwiA0L/////D4MhDiAPIAA1AigiHSAEfnwgA0IgiHwiA0L/////D4MhDyAQIAA1AiwiHiAEfnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgEiADQiCIfCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AgQiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AggiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AgwiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AhAiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AhQiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AhgiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AhwiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AiAiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AiQiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AigiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwiA0L/////D4MhECASIANCIIh8IREgBSATIAE1AiwiBH58IgNC/////w+DIQUgBiAEIBR+fCADQiCIfCIDQv////8PgyEGIAcgBCAVfnwgA0IgiHwiA0L/////D4MhByAIIAQgFn58IANCIIh8IgNC/////w+DIQggCSAEIBd+fCADQiCIfCIDQv////8PgyEJIAogBCAYfnwgA0IgiHwiA0L/////D4MhCiALIAQgGX58IANCIIh8IgNC/////w+DIQsgDCAEIBp+fCADQiCIfCIDQv////8PgyEMIA0gBCAbfnwgA0IgiHwiA0L/////D4MhDSAOIAQgHH58IANCIIh8IgNC/////w+DIQ4gDyAEIB1+fCADQiCIfCIDQv////8PgyEPIBAgBCAefnwgA0IgiHwiA0L/////D4MhECARIANCIIh8IgNC/////w+DIREgA0IgiCESIAIgBSAFQv3/8/8PfkL/////D4MiBEKr1f7/D358QiCIIAYgBEL///vPC358fCIDQv////8Pgz4CACACIAcgBEL//8+KC358IANCIIh8IgNC/////w+DPgIEIAIgCCAEQv7/r/UBfnwgA0IgiHwiA0L/////D4M+AgggAiAJIARCpOzDtQ9+fCADQiCIfCIDQv////8Pgz4CDCACIAogBEKgpcO5Bn58IANCIIh8IgNC/////w+DPgIQIAIgCyAEQr+llJwPfnwgA0IgiHwiA0L/////D4M+AhQgAiAMIARChJfdowZ+fCADQiCIfCIDQv////8Pgz4CGCACIA0gBELX2a6aBH58IANCIIh8IgNC/////w+DPgIcIAIgDiAEQrbP7tgEfnwgA0IgiHwiA0L/////D4M+AiAgAiAPIARCms3/ywN+fCADQiCIfCIDQv////8Pgz4CJCACIBAgBELqo4TQAX58IANCIIh8IgNC/////w+DPgIoIAIgESADQiCIfCIDQv////8Pgz4CLCASIANCIIh8pwRAIAJByAUgAhAHGgUgAkHIBRAFBEAgAkHIBSACEAcaCwsLCgAgACAAIAEQEwsLACAAQfgFIAEQEwsVACAAQfgREABBqBIQAUH4ESABEBILEQAgAEHYEhAWQdgSQbgHEAULIwAgABACBEBBAA8LIABBiBMQFkGIE0G4BxAFBEBBfw8LQQELFwAgACABEBYgAUHIBSABEA0gASABEBULCQBBqAYgABAAC7wBAQJ/IAIQAUEwIQMDQCABIANPBEAgA0EwRgRAQbgTEBoFQbgTQfgFQbgTEBMLIABBuBNB6BMQEyACQegTIAIQDyAAQTBqIQAgA0EwaiEDDAELCyABQTBwIgRFBEAPC0HoExABQQAhAQNAIAEgBEZFBEAgASAALQAAOgDoEyAAQQFqIQAgAUEBaiEBDAELCyADQTBGBEBBuBMQGgVBuBNB+AVBuBMQEwtB6BNBuBNB6BMQEyACQegTIAIQDwscACABIAJBmBQQG0GYFEGYFBAVIABBmBQgAxATC+EBAQJ/QQBBACgCACIFIAJBAWpBMGxqNgIAIAUQGiAFQTBqIQUDQCACIAZHBEAgABACBEAgBUEwayAFEAAFIAAgBUEwayAFEBMLIAAgAWohACAFQTBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBMGsiBSAFEBkDQCAGBEAgABACBEAgBSAFQTBrEAAgAhABBSAFQTBrQcgUEAAgBSAAIAVBMGsQEyAFQcgUIAIQEwsgACABayEAIAIgBGshAiAFQTBrIQUgBkEBayEGDAELC0EAIAU2AgALLQEBfwNAIAEgA0ZFBEAgACACEBUgAEEwaiEAIAJBMGohAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhAWIABBMGohACACQTBqIQIgA0EBaiEDDAELCwuXAgAgAkUEQCADEBoPCyAAQfgUEAAgAxAaA0AgAkEBayICIAFqLQAAIQAgAyADEBQgAEGAAU8EQCADQfgUIAMQEyAAQYABayEACyADIAMQFCAAQcAATwRAIANB+BQgAxATIABBQGohAAsgAyADEBQgAEEgTwRAIANB+BQgAxATIABBIGshAAsgAyADEBQgAEEQTwRAIANB+BQgAxATIABBEGshAAsgAyADEBQgAEEITwRAIANB+BQgAxATIABBCGshAAsgAyADEBQgAEEETwRAIANB+BQgAxATIABBBGshAAsgAyADEBQgAEECTwRAIANB+BQgAxATIABBAmshAAsgAyADEBQgAARAIANB+BQgAxATCyACDQALC9UBAQF/IAAQAgRAIAEQAQ8LQQEhAkGYCEGoFRAAIABB6AdBMEHYFRAgIABByAhBMEGIFhAgA0BB2BVBqAYQBEUEQEHYFUG4FhAUQQEhAANAQbgWQagGEARFBEBBuBZBuBYQFCAAQQFqIQAMAQsLQagVQegWEAAgAiAAa0EBayECA0AgAgRAQegWQegWEBQgAkEBayECDAELCyAAIQJB6BZBqBUQFEHYFUGoFUHYFRATQYgWQegWQYgWEBMMAQsLQYgWEBcEQEGIFiABEBEFQYgWIAEQAAsLIAAgABACBEBBAQ8LIABBiAdBMEGYFxAgQZgXQagGEAQLKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAssACAAKQMYUAR+IAApAxBQBH4gACkDCFAEfiAAKQMABUIBCwVCAQsFQgELUAseACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxgLQAAgACkDGCABKQMYUQR/IAApAxAgASkDEFEEfyAAKQMIIAEpAwhRBH8gACkDACABKQMAUQVBAAsFQQALBUEACwtzACAAKQMYIAEpAxhUBH9BAAUgACkDGCABKQMYVgR/QQEFIAApAxAgASkDEFQEf0EABSAAKQMQIAEpAxBWBH9BAQUgACkDCCABKQMIVAR/QQAFIAApAwggASkDCFYEf0EBBSAAKQMAIAEpAwBaCwsLCwsLC8QBAQF+IAIgADUCACABNQIAfCIDPgIAIAIgADUCBCABNQIEfCADQiCIfCIDPgIEIAIgADUCCCABNQIIfCADQiCIfCIDPgIIIAIgADUCDCABNQIMfCADQiCIfCIDPgIMIAIgADUCECABNQIQfCADQiCIfCIDPgIQIAIgADUCFCABNQIUfCADQiCIfCIDPgIUIAIgADUCGCABNQIYfCADQiCIfCIDPgIYIAIgADUCHCABNQIcfCADQiCIfCIDPgIcIANCIIinC/wBAQF+IAIgADUCACABNQIAfSIDQv////8Pgz4CACACIAA1AgQgATUCBH0gA0Igh3wiA0L/////D4M+AgQgAiAANQIIIAE1Agh9IANCIId8IgNC/////w+DPgIIIAIgADUCDCABNQIMfSADQiCHfCIDQv////8Pgz4CDCACIAA1AhAgATUCEH0gA0Igh3wiA0L/////D4M+AhAgAiAANQIUIAE1AhR9IANCIId8IgNC/////w+DPgIUIAIgADUCGCABNQIYfSADQiCHfCIDQv////8Pgz4CGCACIAA1AhwgATUCHH0gA0Igh3wiA0L/////D4M+AhwgA0Igh6cL5g4BEX4gBCAANQIAIgUgATUCACIGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AgAgBEIgiCEDIAMgBSABNQIEIgd+IARC/////w+DfCIEQiCIfCEDIAMgADUCBCIIIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CBCADQiCIIQQgBCAFIAE1AggiCX4gA0L/////D4N8IgNCIIh8IQQgBCAHIAh+IANC/////w+DfCIDQiCIfCEEIAQgADUCCCIKIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CCCAEQiCIIQMgAyAFIAE1AgwiC34gBEL/////D4N8IgRCIIh8IQMgAyAIIAl+IARC/////w+DfCIEQiCIfCEDIAMgByAKfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AgwiDCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AgwgA0IgiCEEIAQgBSABNQIQIg1+IANC/////w+DfCIDQiCIfCEEIAQgCCALfiADQv////8Pg3wiA0IgiHwhBCAEIAkgCn4gA0L/////D4N8IgNCIIh8IQQgBCAHIAx+IANC/////w+DfCIDQiCIfCEEIAQgADUCECIOIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CECAEQiCIIQMgAyAFIAE1AhQiD34gBEL/////D4N8IgRCIIh8IQMgAyAIIA1+IARC/////w+DfCIEQiCIfCEDIAMgCiALfiAEQv////8Pg3wiBEIgiHwhAyADIAkgDH4gBEL/////D4N8IgRCIIh8IQMgAyAHIA5+IARC/////w+DfCIEQiCIfCEDIAMgADUCFCIQIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CFCADQiCIIQQgBCAFIAE1AhgiEX4gA0L/////D4N8IgNCIIh8IQQgBCAIIA9+IANC/////w+DfCIDQiCIfCEEIAQgCiANfiADQv////8Pg3wiA0IgiHwhBCAEIAsgDH4gA0L/////D4N8IgNCIIh8IQQgBCAJIA5+IANC/////w+DfCIDQiCIfCEEIAQgByAQfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AhgiEiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AhggBEIgiCEDIAMgBSABNQIcIhN+IARC/////w+DfCIEQiCIfCEDIAMgCCARfiAEQv////8Pg3wiBEIgiHwhAyADIAogD34gBEL/////D4N8IgRCIIh8IQMgAyAMIA1+IARC/////w+DfCIEQiCIfCEDIAMgCyAOfiAEQv////8Pg3wiBEIgiHwhAyADIAkgEH4gBEL/////D4N8IgRCIIh8IQMgAyAHIBJ+IARC/////w+DfCIEQiCIfCEDIAMgADUCHCIFIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CHCADQiCIIQQgBCAIIBN+IANC/////w+DfCIDQiCIfCEEIAQgCiARfiADQv////8Pg3wiA0IgiHwhBCAEIAwgD34gA0L/////D4N8IgNCIIh8IQQgBCANIA5+IANC/////w+DfCIDQiCIfCEEIAQgCyAQfiADQv////8Pg3wiA0IgiHwhBCAEIAkgEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAd+IANC/////w+DfCIDQiCIfCEEIAIgAz4CICAEQiCIIQMgAyAKIBN+IARC/////w+DfCIEQiCIfCEDIAMgDCARfiAEQv////8Pg3wiBEIgiHwhAyADIA4gD34gBEL/////D4N8IgRCIIh8IQMgAyANIBB+IARC/////w+DfCIEQiCIfCEDIAMgCyASfiAEQv////8Pg3wiBEIgiHwhAyADIAUgCX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgIkIANCIIghBCAEIAwgE34gA0L/////D4N8IgNCIIh8IQQgBCAOIBF+IANC/////w+DfCIDQiCIfCEEIAQgDyAQfiADQv////8Pg3wiA0IgiHwhBCAEIA0gEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAt+IANC/////w+DfCIDQiCIfCEEIAIgAz4CKCAEQiCIIQMgAyAOIBN+IARC/////w+DfCIEQiCIfCEDIAMgECARfiAEQv////8Pg3wiBEIgiHwhAyADIA8gEn4gBEL/////D4N8IgRCIIh8IQMgAyAFIA1+IARC/////w+DfCIEQiCIfCEDIAIgBD4CLCADQiCIIQQgBCAQIBN+IANC/////w+DfCIDQiCIfCEEIAQgESASfiADQv////8Pg3wiA0IgiHwhBCAEIAUgD34gA0L/////D4N8IgNCIIh8IQQgAiADPgIwIARCIIghAyADIBIgE34gBEL/////D4N8IgRCIIh8IQMgAyAFIBF+IARC/////w+DfCIEQiCIfCEDIAIgBD4CNCADQiCIIQQgBCAFIBN+IANC/////w+DfCIDQiCIfCEEIAIgAz4COCACIAQ+AjwLzg0BDH4gAyAANQIAIgYgBn4gAkL/////D4N8IgJCIIh8IQMgASACPgIAIAMiBEIgiCEFIAA1AgQiByAGfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgQgAyIEQiCIIQUgADUCCCIIIAZ+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAcgB34gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgggAyIEQiCIIQUgADUCDCIJIAZ+IgJCIIghAyADIAcgCH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgwgAyIEQiCIIQUgADUCECIKIAZ+IgJCIIghAyADIAcgCX4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAIIAh+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIQIAMiBEIgiCEFIAA1AhQiCyAGfiICQiCIIQMgAyAHIAp+IAJC/////w+DfCICQiCIfCEDIAMgCCAJfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CFCADIgRCIIghBSAANQIYIgwgBn4iAkIgiCEDIAMgByALfiACQv////8Pg3wiAkIgiHwhAyADIAggCn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAJIAl+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIYIAMiBEIgiCEFIAA1AhwiDSAGfiICQiCIIQMgAyAHIAx+IAJC/////w+DfCICQiCIfCEDIAMgCCALfiACQv////8Pg3wiAkIgiHwhAyADIAkgCn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhwgAyIEQiCIIQUgByANfiICQiCIIQMgAyAIIAx+IAJC/////w+DfCICQiCIfCEDIAMgCSALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAogCn4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiAgAyIEQiCIIQUgCCANfiICQiCIIQMgAyAJIAx+IAJC/////w+DfCICQiCIfCEDIAMgCiALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CJCADIgRCIIghBSAJIA1+IgJCIIghAyADIAogDH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyALIAt+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIoIAMiBEIgiCEFIAogDX4iAkIgiCEDIAMgCyAMfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CLCADIgRCIIghBSALIA1+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAwgDH4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjAgAyIEQiCIIQUgDCANfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMg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IAJCIIh8QYwbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGQGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBlBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QZgbNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGcGzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBoBs1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QaQbNQIAIAN+fCICPgI4QcQdIAJCIIg+AgBBqB0gAEEgaiABEDELyB4BFH4gBSABNQIAIgQgADUCACIPfnwiA0L/////D4MhBSAGIAA1AgQiECAEfnwgA0IgiHwiA0L/////D4MhBiAHIAA1AggiESAEfnwgA0IgiHwiA0L/////D4MhByAIIAA1AgwiEiAEfnwgA0IgiHwiA0L/////D4MhCCAJIAA1AhAiEyAEfnwgA0IgiHwiA0L/////D4MhCSAKIAA1AhQiFCAEfnwgA0IgiHwiA0L/////D4MhCiALIAA1AhgiFSAEfnwgA0IgiHwiA0L/////D4MhCyAMIAA1AhwiFiAEfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gDiADQiCIfCEOIAUgBUL/////D35C/////w+DIgR8QiCIIAYgBEL/////D358fCIDQv////8PgyEFIAcgBEL+t/n/D358IANCIIh8IgNC/////w+DIQYgCCAEQoLI9p0FfnwgA0IgiHwiA0L/////D4MhByAJIARChbCHzQB+fCADQiCIfCIDQv////8PgyEIIAogBEKIsOeZA358IANCIIh8IgNC/////w+DIQkgCyAEQsj69cwCfnwgA0IgiHwiA0L/////D4MhCiAMIARC0862nwd+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AgQiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCIDQv////8PgyEMIA4gA0IgiHwhDSAFIA8gATUCCCIEfnwiA0L/////D4MhBSAGIAQgEH58IANCIIh8IgNC/////w+DIQYgByAEIBF+fCADQiCIfCIDQv////8PgyEHIAggBCASfnwgA0IgiHwiA0L/////D4MhCCAJIAQgE358IANCIIh8IgNC/////w+DIQkgCiAEIBR+fCADQiCIfCIDQv////8PgyEKIAsgBCAVfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFn58IANCIIh8IgNC/////w+DIQwgDSADQiCIfCIDQv////8PgyENIANCIIghDiAFIAVC/////w9+Qv////8PgyIEfEIgiCAGIARC/////w9+fHwiA0L/////D4MhBSAHIARC/rf5/w9+fCADQiCIfCIDQv////8PgyEGIAggBEKCyPadBX58IANCIIh8IgNC/////w+DIQcgCSAEQoWwh80AfnwgA0IgiHwiA0L/////D4MhCCAKIARCiLDnmQN+fCADQiCIfCIDQv////8PgyEJIAsgBELI+vXMAn58IANCIIh8IgNC/////w+DIQogDCAEQtPOtp8HfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIMIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////D35C/////w+DIgR8QiCIIAYgBEL/////D358fCIDQv////8PgyEFIAcgBEL+t/n/D358IANCIIh8IgNC/////w+DIQYgCCAEQoLI9p0FfnwgA0IgiHwiA0L/////D4MhByAJIARChbCHzQB+fCADQiCIfCIDQv////8PgyEIIAogBEKIsOeZA358IANCIIh8IgNC/////w+DIQkgCyAEQsj69cwCfnwgA0IgiHwiA0L/////D4MhCiAMIARC0862nwd+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AhAiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCIDQv////8PgyEMIA4gA0IgiHwhDSAFIA8gATUCFCIEfnwiA0L/////D4MhBSAGIAQgEH58IANCIIh8IgNC/////w+DIQYgByAEIBF+fCADQiCIfCIDQv////8PgyEHIAggBCASfnwgA0IgiHwiA0L/////D4MhCCAJIAQgE358IANCIIh8IgNC/////w+DIQkgCiAEIBR+fCADQiCIfCIDQv////8PgyEKIAsgBCAVfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFn58IANCIIh8IgNC/////w+DIQwgDSADQiCIfCIDQv////8PgyENIANCIIghDiAFIAVC/////w9+Qv////8PgyIEfEIgiCAGIARC/////w9+fHwiA0L/////D4MhBSAHIARC/rf5/w9+fCADQiCIfCIDQv////8PgyEGIAggBEKCyPadBX58IANCIIh8IgNC/////w+DIQcgCSAEQoWwh80AfnwgA0IgiHwiA0L/////D4MhCCAKIARCiLDnmQN+fCADQiCIfCIDQv////8PgyEJIAsgBELI+vXMAn58IANCIIh8IgNC/////w+DIQogDCAEQtPOtp8HfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IgNC/////w+DIQwgDiADQiCIfCENIAUgDyABNQIYIgR+fCIDQv////8PgyEFIAYgBCAQfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEX58IANCIIh8IgNC/////w+DIQcgCCAEIBJ+fCADQiCIfCIDQv////8PgyEIIAkgBCATfnwgA0IgiHwiA0L/////D4MhCSAKIAQgFH58IANCIIh8IgNC/////w+DIQogCyAEIBV+fCADQiCIfCIDQv////8PgyELIAwgBCAWfnwgA0IgiHwiA0L/////D4MhDCANIANCIIh8IgNC/////w+DIQ0gA0IgiCEOIAUgBUL/////D35C/////w+DIgR8QiCIIAYgBEL/////D358fCIDQv////8PgyEFIAcgBEL+t/n/D358IANCIIh8IgNC/////w+DIQYgCCAEQoLI9p0FfnwgA0IgiHwiA0L/////D4MhByAJIARChbCHzQB+fCADQiCIfCIDQv////8PgyEIIAogBEKIsOeZA358IANCIIh8IgNC/////w+DIQkgCyAEQsj69cwCfnwgA0IgiHwiA0L/////D4MhCiAMIARC0862nwd+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwiA0L/////D4MhDCAOIANCIIh8IQ0gBSAPIAE1AhwiBH58IgNC/////w+DIQUgBiAEIBB+fCADQiCIfCIDQv////8PgyEGIAcgBCARfnwgA0IgiHwiA0L/////D4MhByAIIAQgEn58IANCIIh8IgNC/////w+DIQggCSAEIBN+fCADQiCIfCIDQv////8PgyEJIAogBCAUfnwgA0IgiHwiA0L/////D4MhCiALIAQgFX58IANCIIh8IgNC/////w+DIQsgDCAEIBZ+fCADQiCIfCIDQv////8PgyEMIA0gA0IgiHwiA0L/////D4MhDSADQiCIIQ4gAiAFIAVC/////w9+Qv////8PgyIEfEIgiCAGIARC/////w9+fHwiA0L/////D4M+AgAgAiAHIARC/rf5/w9+fCADQiCIfCIDQv////8Pgz4CBCACIAggBEKCyPadBX58IANCIIh8IgNC/////w+DPgIIIAIgCSAEQoWwh80AfnwgA0IgiHwiA0L/////D4M+AgwgAiAKIARCiLDnmQN+fCADQiCIfCIDQv////8Pgz4CECACIAsgBELI+vXMAn58IANCIIh8IgNC/////w+DPgIUIAIgDCAEQtPOtp8HfnwgA0IgiHwiA0L/////D4M+AhggAiANIANCIIh8IgNC/////w+DPgIcIA4gA0IgiHynBEAgAkGIGyACECoaBSACQYgbECgEQCACQYgbIAIQKhoLCwsKACAAIAAgARA1CwsAIABBqBsgARA1CxUAIABBqCEQI0HIIRAkQaghIAEQNAsRACAAQeghEDhB6CFBqBwQKAsjACAAECUEQEEADwsgAEGIIhA4QYgiQagcECgEQEF/DwtBAQsXACAAIAEQOCABQYgbIAEQLyABIAEQNwsJAEHIGyAAECMLvAEBAn8gAhAkQSAhAwNAIAEgA08EQCADQSBGBEBBqCIQPAVBqCJBqBtBqCIQNQsgAEGoIkHIIhA1IAJByCIgAhAxIABBIGohACADQSBqIQMMAQsLIAFBH3EiBEUEQA8LQcgiECRBACEBA0AgASAERkUEQCABIAAtAAA6AMgiIABBAWohACABQQFqIQEMAQsLIANBIEYEQEGoIhA8BUGoIkGoG0GoIhA1C0HIIkGoIkHIIhA1IAJByCIgAhAxCxwAIAEgAkHoIhA9QegiQegiEDcgAEHoIiADEDUL4QEBAn9BAEEAKAIAIgUgAkEBakEF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ACADEIsBCyACDQALC8oBAEGogQEQiQFBqIEBQaiBARCQASAAQaj+AEEwQYj/ABCWAUGI/wBB6P8AEI0BIABB6P8AQej/ABCLAUHo/wBByIABEFhByIABQej/AEHIgAEQiwFByIABQaiBARBQBEAAC0GI/wAgAEGIggEQiwFB6P8AQaiBARBQBEBBqIEBEAFB2IEBEBpBqIEBQYiCASABEIsBBUHoggEQiQFB6IIBQej/AEHoggEQjgFB6IIBQdj+AEEwQeiCARCWAUHoggFBiIIBIAEQiwELC2YAQZiGARCJAUGYhgFBmIYBEJABIABByIMBQTBB+IMBEJYBQfiDAUHYhAEQjQEgAEHYhAFB2IQBEIsBQdiEAUG4hQEQWEG4hQFB2IQBQbiFARCLAUG4hQFBmIYBEFAEQEEADwtBAQsPACAAEEkgAEHgAGoQSXELCgAgAEHAAWoQSQsOACAAEEsgAEHgAGoQSwsXACAAEEsgAEHgAGoQiQEgAEHAAWoQSwuCAgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBIAEgACkDkAE3A5ABIAEgACkDmAE3A5gBIAEgACkDoAE3A6ABIAEgACkDqAE3A6gBIAEgACkDsAE3A7ABIAEgACkDuAE3A7gBC5IDACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4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AGogAEHgAGoQSRsQlAEPCyAAQcABahCUAQv4AQECf0EAQQAoAgAiBSACQQFqQaACbGo2AgAgBRDmASAFQaACaiEFA0AgAiAGRwRAIAAQ4wEEQCAFQaACayAFEOcBBSAAIAVBoAJrIAUQ6AELIAAgAWohACAFQaACaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQaACayIFIAUQ7wEDQCAGBEAgABDjAQRAIAUgBUGgAmsQ5wEgAhDlAQUgBUGgAmtBqPMCEOcBIAUgACAFQaACaxDoASAFQajzAiACEOgBCyAAIAFrIQAgAiAEayECIAVBoAJrIQUgBkEBayEGDAELC0EAIAU2AgALswIAIAJFBEAgAxDmAQ8LIABByPUCEOcBIAMQ5gEDQCACQQFrIgIgAWotAAAhACADIAMQ6QEgAEGAAU8EQCADQcj1AiADEOgBIABBgAFrIQALIAMgAxDpASAAQcAATwRAIANByPUCIAMQ6AEgAEFAaiEACyADIAMQ6QEgAEEgTwRAIANByPUCIAMQ6AEgAEEgayEACyADIAMQ6QEgAEEQTwRAIANByPUCIAMQ6AEgAEEQayEACyADIAMQ6QEgAEEITwRAIANByPUCIAMQ6AEgAEEIayEACyADIAMQ6QEgAEEETwRAIANByPUCIAMQ6AEgAEEEayEACyADIAMQ6QEgAEECTwRAIANByPUCIAMQ6AEgAEECayEACyADIAMQ6QEgAARAIANByPUCIAMQ6AELIAINAAsLMgAgAEHo9wIQigEgAEHAAWogARDiASAAQeAAaiABQcABahCKAUHo9wIgAUHgAGoQigELEQAgABDjASAAQaACahDjAXELEQAgABDkASAAQaACahDjAXELEAAgABDlASAAQaACahDlAQsQACAAEOYBIABBoAJqEOUBCxgAIAAgARDnASAAQaACaiABQaACahDnAQuFAQAgACABQcj4AhDoASAAQaACaiABQaACakHo+gIQ6AEgACAAQaACakGI/QIQ6gEgASABQaACakGo/wIQ6gFBiP0CQaj/AkGI/QIQ6AFB6PoCIAIQ9AFByPgCIAIgAhDqAUHI+AJB6PoCIAJBoAJqEOoBQYj9AiACQaACaiACQaACahDrAQscACAAIAEgAhDoASAAQaACaiABIAJBoAJqEOgBC30AIAAg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ahDqASAEQaACaiABQejZAyAEQaACahCNAiAEQaACakGo1QMgBEGgAmoQ6wEgBEGgAmpByNcDIARBoAJqEOsBQcjXAyAEEOcBIAQgBBD0ASAEQajVAyAEEOoBC1AAIAEgAEEwakHI2gMQEyABQTBqIABBMGpB+NoDEBMgAUHgAGogAEGo2wMQEyABQZABaiAAQdjbAxATIAIgAUHAAWpBqNsDQcjaAyACEI4CC2wAIABBiP4EIAEQiwEgAEHgAGpB6P4EIAFB4ABqEIsBIABBwAFqQcj/BCABQcABahCLASAAQaACakGogAUgAUGgAmoQiwEgAEGAA2pBiIEFIAFBgANqEIsBIABB4ANqQeiBBSABQeADahCLAQuKAgAgACABEAAgAEEwaiABQTBqEBEgAUHIggUgARCLASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBEgAUHgAGpBqIMFIAFB4ABqEIsBIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQESABQcABakGIhAUgAUHAAWoQiwEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahARIAFBoAJqQeiEBSABQaACahCLASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBEgAUGAA2pByIUFIAFBgANqEIsBIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQESABQeADakGohgUgAUHgA2oQiwELbAAgAEGIhwUgARCLASAAQeAAakHohwUgAUHgAGoQiwEgAEHAAWpByIgFIAFBwAFqEIsBIABBoAJqQaiJBSABQaACahCLASAAQYADakGIigUgAUGAA2oQiwEgAEHgA2pB6IoFIAFB4ANqEIsBC4oCACAAIAEQACAAQTBqIAFBMGoQESABQciLBSABEIsBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQESABQeAAakGojAUgAUHgAGoQiwEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahARIAFBwAFqQYiNBSABQcABahCLASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBEgAUGgAmpB6I0FIAFBoAJqEIsBIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQESABQYADakHIjgUgAUGAA2oQiwEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahARIAFB4ANqQaiPBSABQeADahCLAQtsACAAQYiQBSABEIsBIABB4ABqQeiQBSABQeAAahCLASAAQcABakHIkQUgAUHAAWoQiwEgAEGgAmpBqJIFIAFBoAJqEIsBIABBgANqQYiTBSABQYADahCLASAAQeADakHokwUgAUHgA2oQiwELigIAIAAgARAAIABBMGogAUEwahARIAFByJQFIAEQiwEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahARIAFB4ABqQaiVBSABQeAAahCLASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBEgAUHAAWpBiJYFIAFBwAFqEIsBIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQESABQaACakHolgUgAUGgAmoQiwEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahARIAFBgANqQciXBSABQYADahCLASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBEgAUHgA2pBqJgFIAFB4ANqEIsBC2wAIABBiJkFIAEQiwEgAEHgAGpB6JkFIAFB4ABqEIsBIABBwAFqQciaBSABQcABahCLASAAQaACakGomwUgAUGgAmoQiwEgAEGAA2pBiJwFIAFBgANqEIsBIABB4ANqQeicBSABQeADahCLAQuKAgAgACABEAAgAEEwaiABQTBqEBEgAUHInQUgARCLASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBEgAUHgAGpBqJ4FIAFB4ABqEIsBIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQESABQcABakGInwUgAUHAAWoQiwEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahARIAFBoAJqQeifBSABQaACahCLASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBEgAUGAA2pByKAFIAFBgANqEIsBIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQESABQeADakGooQUgAUHgA2oQiwELbAAgAEGIogUgARCLASAAQeAAakHoogUgAUHgAGoQiwEgAEHAAWpByKMFIAFBwAFqEIsBIABBoAJqQaikBSABQaACahCLASAAQYADakGIpQUgAUGAA2oQiwEgAEHgA2pB6KUFIAFB4ANqEIsBC4oCACAAIAEQACAAQTBqIAFBMGoQESABQcimBSABEIsBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQESABQeAAakGopwUgAUHgAGoQiwEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahARIAFBwAFqQYioBSABQcABahCLASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBEgAUGgAmpB6KgFIAFBoAJqEIsBIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQESABQYADakHIqQUgAUGAA2oQiwEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahARIAFB4ANqQaiqBSABQeADahCLAQuDAQAgABBJBEBBAQ8LIAAQYkUEQEEADwsgAEGIqwVB+KsFEBMgAEEwakGorAUQACAAQbirBUGIrQUQEyAAQTBqQbitBRAAQfirBUH4qwUQU0H4qwUgAEH4qwUQW0H4qwVBiK0FQfirBRBbQfirBUHoqwVBEEH4qwUQdkH4qwVBiK0FEFELEQAgAEHorQUQYUHorQUQmgILswIAIAAQmQEEQEEBDwsgABCyAUUEQEEADwsgAEHIrgVB8LAFEIsBIABB4ABqQciuBUHQsQUQiwFB8LAFQaivBUGwsgUQjAFB0LEFQZCzBRCQAUHwsAVB8LMFEJABQdCxBUHYrwVB0LQFEIsBQbCyBUHgsgVBwLAFEBBBsLIFQeCyBUHgsgUQD0HAsAVBsLIFEABBkLMFQcCzBUHAsAUQEEGQswVBwLMFQcCzBRAPQcCwBUGQswUQAEHwswVBoLQFQcCwBRAPQfCzBUGgtAVBoLQFEBBBwLAFQfCzBRAAQYC1BUHQtAVBwLAFEBBB0LQFQYC1BUGAtQUQD0HAsAVB0LQFEABBsLUFEIkBQfCzBUG4sAVBCEHwswUQwwFB8LMFQbCyBUHwswUQpgFB8LMFIAAQoQELEgAgAEGQtgUQsQFBkLYFEJwCCwgAIAAgARBlC7YJAQF/IAAgARC1ASABEJoBBEAPCyABQdDDBRCeASABQaACaiEAQT4hAgNAQdDDBSAAEI0BQbDEBUHQwAUQjQFB0MAFQbDBBRCNAUHQwAVB0MMFIABB4ABqEI4BIABB4ABqIABB4ABqEI0BIABB4ABqIAAgAEHgAGoQjwEgAEHgAGpBsMEFIABB4ABqEI8BIABB4ABqIABB4ABqIABB4ABqEI4BIAAgAEGQwgUQjgFBkMIFIABBkMIFEI4BQdDDBUGQwgUgAEHAAWoQjgFBkMIFQfDCBRCNAUGQxQVB8L8FEI0BQfDCBSAAQeAAakHQwwUQjwFB0MMFIABB4ABqQdDDBRCPAUGQxQVBsMQFQZDFBRCOAUGQxQVBkMUFEI0BQZDFBUHQwAVBkMUFEI8BQZDFBUHwvwVBkMUFEI8BIABB4ABqQdDDBUGwxAUQjwFBsMQFQZDCBUGwxAUQiwFBsMEFQbDBBUGwwQUQjgFBsMEFQbDBBUGwwQUQjgFBsMEFQbDBBUGwwQUQjgFBsMQFQbDBBUGwxAUQjwFBkMIFQfC/BSAAQeAAahCLASAAQeAAaiAAQeAAaiAAQeAAahCOASAAQeAAaiAAQeAAahCQASAAQcABaiAAQcABahCNASAAQcABaiAAIABBwAFqEI8BIABBwAFqQfDCBSAAQcABahCPAUHQwAVB0MAFQdDABRCOAUHQwAVB0MAFQdDABRCOASAAQcABakHQwAUgAEHAAWoQjwFBkMUFQfC/BSAAEIsBIAAgACAAEI4BIABBoAJqIQAgAiwAqNADBEBBkMUFQdC3BRCNASABQeAAakGwuAUQjQFB0LcFIAFB8LkFEIsBIAFB4ABqQZDFBSAAQeAAahCOASAAQeAAaiAAQeAAahCNASAAQeAAakGwuAUgAEHgAGoQjwEgAEHgAGpB0LcFIABB4ABqEI8BIABB4ABqQdC3BSAAQeAAahCLAUHwuQVB0MMFQdC6BRCPAUHQugVBsLsFEI0BQbC7BUGwuwVBkLwFEI4BQZC8BUGQvAVBkLwFEI4BQZC8BUHQugVB8LwFEIsBIABB4ABqQbDEBUHQvQUQjwFB0L0FQbDEBUHQvQUQjwFB0L0FIAEgAEHAAWoQiwFBkLwFQdDDBUGwvgUQiwFB0L0FQdDDBRCNAUHQwwVB8LwFQdDDBRCPAUHQwwVBsL4FQdDDBRCPAUHQwwVBsL4FQdDDBRCPAUGQxQVB0LoFQZDFBRCOAUGQxQVBkMUFEI0BQZDFBUHQtwVBkMUFEI8BQZDFBUGwuwVBkMUFEI8BIAFB4ABqQZDFBSAAEI4BQbC+BUHQwwVBkL8FEI8BQZC/BUHQvQVBkL8FEIsBQbDEBUHwvAVB8LkFEIsBQfC5BUHwuQVB8LkFEI4BQZC/BUHwuQVBsMQFEI8BIAAgABCNASAAQbC4BSAAEI8BQZDFBUGQuQUQjQEgAEGQuQUgABCPASAAQcABaiAAQcABaiAAQcABahCOASAAQcABaiAAIABBwAFqEI8BQZDFBUGQxQUgABCOAUHQvQVB0L0FEJABQdC9BUHQvQUgAEHgAGoQjgEgAEGgAmohAAsgAgRAIAJBAWshAgwBCwsLfQEBfyACEPgBIAAQSgRADwsgARBKBEAPCyABQaACaiEBQT4hAwNAIAAgASACEI8CIAFBoAJqIQEgAywAqNADBEAgACABIAIQjwIgAUGgAmohAQsgAiACEPwBIANBAUZFBEAgA0EBayEDDAELCyAAIAEgAhCPAiACIAIQgAILEAAgAEHwxQVBoAQgARCJAgvsBQAgACAAQYADakHQzgUQiwEgAEGAA2pBkMoFEOIBIABBkMoFQZDKBRCOASAAIABBgANqQbDPBRCOAUGwzwVBkMoFQZDKBRCLAUHQzgVBsM8FEOIBQdDOBUGwzwVBsM8FEI4BQZDKBUGwzwVBkMoFEI8BQdDOBUHQzgVB8MoFEI4BIABBoAJqIABBwAFqQdDOBRCLASAAQcABakHQywUQ4gEgAEGgAmpB0MsFQdDLBRCOASAAQaACaiAAQcABakGwzwUQjgFBsM8FQdDLBUHQywUQiwFB0M4FQbDPBRDiAUHQzgVBsM8FQbDPBRCOAUHQywVBsM8FQdDLBRCPAUHQzgVB0M4FQbDMBRCOASAAQeAAaiAAQeADakHQzgUQiwEgAEHgA2pBkM0FEOIBIABB4ABqQZDNBUGQzQUQjgEgAEHgAGogAEHgA2pBsM8FEI4BQbDPBUGQzQVBkM0FEIsBQdDOBUGwzwUQ4gFB0M4FQbDPBUGwzwUQjgFBkM0FQbDPBUGQzQUQjwFB0M4FQdDOBUHwzQUQjgFBkMoFIAAgARCPASABIAEgARCOAUGQygUgASABEI4BQfDKBSAAQYADaiABQYADahCOASABQYADaiABQYADaiABQYADahCOAUHwygUgAUGAA2ogAUGAA2oQjgFB8M0FQfjaAkGwzwUQiwFBsM8FIABBoAJqIAFBoAJqEI4BIAFBoAJqIAFBoAJqIAFBoAJqEI4BQbDPBSABQaACaiABQaACahCOAUGQzQUgAEHAAWogAUHAAWoQjwEgAUHAAWogAUHAAWogAUHAAWoQjgFBkM0FIAFBwAFqIAFBwAFqEI4BQdDLBSAAQeAAaiABQeAAahCPASABQeAAaiABQeAAaiABQeAAahCOAUHQywUgAUHgAGogAUHgAGoQjgFBsMwFIABB4ANqIAFB4ANqEI4BIAFB4ANqIAFB4ANqIAFB4ANqEI4BQbDMBSABQeADaiABQeADahCOAQuHAQECfyAAQdjQBRCAAiABEPgBQdDQBSwAACIDBEAgA0EBRgRAIAEgACABEPoBBSABQdjQBSABEPoBCwtBPyECA0AgASABEKICIAIsAJDQBSIDBEAgA0EBRgRAIAEgACABEPoBBSABQdjQBSABEPoBCwsgAgRAIAJBAWshAgwBCwsgASABEIACC+sCACAAQZjVBRCWAiAAQdjZBRCEAkGY1QVB2NkFQZjeBRD6AUGY3gVB2NkFEPkBQZjeBUGY3gUQkgJBmN4FQdjZBUGY3gUQ+gFBmN4FQdjZBRCiAkHY2QVB2NkFEIACQZjeBUHY4gUQowJB2OIFQZjnBRCiAkHY2QVB2OIFQdjrBRD6AUHY6wVB2NkFEKMCQdjZBUGY1QUQowJBmNUFQZjwBRCjAkGY8AVBmOcFQZjwBRD6AUGY8AVBmOcFEKMCQdjrBUHY6wUQgAJBmOcFQdjrBUGY5wUQ+gFBmOcFQZjeBUGY5wUQ+gFBmN4FQdjrBRCAAkHY2QVBmN4FQdjZBRD6AUHY2QVB2NkFEJMCQZjwBUHY6wVBmPAFEPoBQZjwBUGY8AUQkQJB2OIFQZjVBUHY4gUQ+gFB2OIFQdjiBRCSAkHY4gVB2NkFQdjiBRD6AUHY4gVBmPAFQdjiBRD6AUHY4gVBmOcFIAEQ+gELaABB2PQFEPgBIABBiNwDEGUgAUGo3gMQnwJBiNwDEJoCRQRAQQAPC0Go3gMQnAJFBEBBAA8LQYjcA0Go3gNBmPkFEKACQdj0BUGY+QVB2PQFEPoBQdj0BUHY9AUQpAJB2PQFIAIQgwILswEAQdj9BRD4ASAAQYjcAxBlIAFBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZiCBhCgAkHY/QVBmIIGQdj9BRD6ASACQYjcAxBlIANBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZiCBhCgAkHY/QVBmIIGQdj9BRD6AUHY/QVB2P0FEKQCQdj9BSAEEIMCC/4BAEHYhgYQ+AEgAEGI3AMQZSABQajeAxCfAkGI3AMQmgJFBEBBAA8LQajeAxCcAkUEQEEADwtBiNwDQajeA0GYiwYQoAJB2IYGQZiLBkHYhgYQ+gEgAkGI3AMQZSADQajeAxCfAkGI3AMQmgJFBEBBAA8LQajeAxCcAkUEQEEADwtBiNwDQajeA0GYiwYQoAJB2IYGQZiLBkHYhgYQ+gEgBEGI3AMQZSAFQajeAxCfAkGI3AMQmgJFBEBBAA8LQajeAxCcAkUEQEEADwtBiNwDQajeA0GYiwYQoAJB2IYGQZiLBkHYhgYQ+gFB2IYGQdiGBhCkAkHYhgYgBhCDAgvJAgBB2I8GEPgBIABBiNwDEGUgAUGo3gMQnwJBiNwDEJoCRQRAQQAPC0Go3gMQnAJFBEBBAA8LQYjcA0Go3gNBmJQGEKACQdiPBkGYlAZB2I8GEPoBIAJBiNwDEGUgA0Go3gMQnwJBiNwDEJoCRQRAQQAPC0Go3gMQnAJFBEBBAA8LQYjcA0Go3gNBmJQGEKACQdiPBkGYlAZB2I8GEPoBIARBiNwDEGUgBUGo3gMQnwJBiNwDEJoCRQRAQQAPC0Go3gMQnAJFBEBBAA8LQYjcA0Go3gNBmJQGEKACQdiPBkGYlAZB2I8GEPoBIAZBiNwDEGUgB0Go3gMQnwJBiNwDEJoCRQRAQQAPC0Go3gMQnAJFBEBBAA8LQYjcA0Go3gNBmJQGEKACQdiPBkGYlAZB2I8GEPoBQdiPBkHYjwYQpAJB2I8GIAgQgwILlAMAQdiYBhD4ASAAQYjcAxBlIAFBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZidBhCgAkHYmAZBmJ0GQdiYBhD6ASACQYjcAxBlIANBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZidBhCgAkHYmAZBmJ0GQdiYBhD6ASAEQYjcAxBlIAVBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZidBhCgAkHYmAZBmJ0GQdiYBhD6ASAGQYjcAxBlIAdBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZidBhCgAkHYmAZBmJ0GQdiYBhD6ASAIQYjcAxBlIAlBqN4DEJ8CQYjcAxCaAkUEQEEADwtBqN4DEJwCRQRAQQAPC0GI3ANBqN4DQZidBhCgAkHYmAZBmJ0GQdiYBhD6AUHYmAZB2JgGEKQCQdiYBiAKEIMCCysAIABBiNwDEGUgAUGo3gMQnwJBiNwDQajeA0HYoQYQoAJB2KEGIAIQpAILC9zAAXsAQQALBBiTAQAAQQgLIAEAAAD//////lv+/wKkvVMF2KEJCNg5M0h9nSlTp+1zAEHIBQswq6r//////rn//1Ox/v+rHiT2sPag0jBnvxKF84RLd2TXrEtDtqcbS5rmfznqEQEaAEH4BQswRhc0HDQf3/TxBNEJpuZ2CtW2lUxsR+WNwIOdk6mI62ctlRm1hT55mqrjypLlj5gRAEGoBgsw/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAEHYBgswAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGIBwswVdX///9//9z//6lY//9VDxJ7WHtQaZizX4nCecKlO7Jr1qUh29ONJU3zvxz1iAANAEG4BwswVtX///9//9z//6lY//9VDxJ7WHtQaZizX4nCecKlO7Jr1qUh29ONJU3zvxz1iAANAEHoBwswVdX///9//9z//6lY//9VDxJ7WHtQaZizX4nCecKlO7Jr1qUh29ONJU3zvxz1iAANAEGYCAswrqr8////9UP9/0ft8v+3Mmmd6aJJOugHersygzHzqOxpwPSgHo0U7wYC/z4mswoEAEHICAswq+r///+/f+7//1Ss//+qB4k9rD2oNMzZr0ThPOHSHdk169KQ7enGkqb5X456RIAGAEGIGwsgAQAAAP/////+W/7/AqS9UwXYoQkI2DkzSH2dKVOn7XMAQagbCyBtnPLzkOmZySNckofL7WwrjzlUcpYU0wUR/1mf2dlIBwBByBsLIP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQYAEHoGwsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYgcCyAAAACA////f/8t/38B0t6pAuzQBATsnBmkvs6UqdP2OQBBqBwLIAEAAID///9//y3/fwHS3qkC7NAEBOycGaS+zpSp0/Y5AEHIHAsg//////5b/v8CpL1TBdihCQjYOTNIfZ0pU6ftcwAAAAAAQegcCyB89BcMXG2rnOVxS/096eEcBdUdRzCybQ1qOzp0kOkOPwBBiB0LIAAAAID/Lf9/AdLeqQLs0AQE7JwZpL7OlKnT9jkAAAAAAEGoJQsw8/8MAAAAJ6oKADT8MgDMU3+ACmt66Y9H1yS65r5+07Evq3i/O3PJjn7egz1RRdYJAEGYywALIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEHYzQALIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEHozwALoAj+////AQAAAAJIAwD6t4RY9U+87O9PjJlvBcWsWbEkGAMAAAD9/////BP7/wjsOPsPiOUcGIitmdh32Hz59chbsc+JqnRWsPP+uQZgQAEvByZ6ZiW/DZrOdINZLQXkLE0JEL3TabYwkadhoLJ/qfvkqCZLs88IRPMsev8G7KQ1H4kSCgsCoMIliCEIfX9xHJfYxRrYytw5R8FB4+6pe2BPNNEcI6NgZMXuX/JPqRTElW6bVIBQNh2d3QZFnwl0UhzMQCd1sJWbHXzL6FImWrDIXQOZQ1ziAQ8QFz1nX5vGY1OtJvO8YWPDXpqB3PDPmZdjHNmr8AS+lRAi8ubJIPZJrEJTEU3IwcpyJXEWzoVi/NyGR1fs1WR5FZYXSJrAQlc0+FN3MzW6lHdQrhZQzPhJPBolF7by2wXhONDfNhvza+c2Pd2AuFT8G0nK2ohy8vbFWzXimt0Euxw4mckJptIkZRbNnJIt9eM/RgSrsXP6vQ54/fYXJuYyO3ecUA5Ib1fH4feX67G8EF/pcdorZzOqJ2AsLu5OgVJE8xcSb6/lOSwzH5qf3Jhl8qjQTtLHssNwFmaBEhEGHuIiuofw3TwCOAZMpS/8l19Da6uU01udCIeWewGuFIX077AAnWBaODmUqRDlCK4q0vPwNcOwuJpue2DL+axkLbbWBqniCvXVY3QJbk/nVBWQXytA1wqFUfuBzy+t+uAs2ffZVY/PWZwN1WB1Ab1jt/ZkM6vnnsEvGr/lVHarw9yRLyRZdH3tzicoeeQcD3zcCni+euQk15INTAE7xmeULsFi5BpDb9ZxRV1fUfr96WBTzvcN5MwVYY7TDZ4F+sKAc2PbueJhLVoNENrd9qZPp7F2gyzUa1vDO1oRFIrcB/bGnK14yQwIrFZ/ssc+w4Mnjo/z+V0ChKpgXcnTtSGmbwQJD0+7LqecDeaBbOWk/OID+McLRCwAe/UGTPlpuEivREJYpmCCpQshQWjIvw/owebLT0+GNE7qZB+PUS2/ko+poRZk6aoih0ncRNuoEQbQgUf5f3UIAbuBfSCRyrOeJDd8UVWsVzEHQ1L1Gi4cVN4r7MMDYNF5lqbUBOjwNqVVQui8DDXek29xWnmeW3LouzE2RagrQm6gu4xmU+D2V0goD5x5zZcDRAv8Vnmm3icyrxivSTb78bJM0fOscrqmpglNZ/2js3niHkvybSlMtRPcpifY0pVEeUUQ1jRqhJa1o7hAX2c8iLou1tBz4H+ZXX4iio3/GejDvEHgT5KsiywZIRob6vQnRTuOumQ4AC1PntkY5PS/BnHf6TiVnvtHbyNE7en9304vBbxRJtCqNn3Ag3Ow1PCHZx9PbwiJLHRg9Rdjv2gpp1hjfPQXDFxtq5zlcUv9PenhHAXVHUcwsm0Najs6dJDpDj8AQYjYAAugCP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQY/////wAAAAABpAEA/VtCrPonXvb3J8bMt4Ji1qxYEgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAABBqOAAC6AIyf///zYAAAA3PFoAW8NBAtuWOu5FlpL+fBUqDyIN8Rec+v//YwUAAGQV2AjU37eVSIOPE6x0L9zLpgirswPmEnfW8v+IKQ0Aie0xmHq/F3wbSoX075wJWjjK/CTVBcxmjRj8iyTnA3TBk7zbS1RI+5ZElSxLb0+vU/CFZ3rFcCeMxsHEZJ6vA6AZD4nIpsaYElbCxiAQvIyZBcmmyYR1Yjoy2HM5uamhgU7TqF0h3Sa1dJ7bxkqHgOuKJkC/mko18hrWlOvZEcZ7MnSA4ZeQ6gYfgcID2bqQlprtCLSo1wJG3sQKemwVTaysHDkuj2Gb3r2qsX3+LWn+Z5IjdeKII7b2ezzlk1nitleXwYwMAF3PLFc+SUL7/AX7M1zrX2AP4W+Gw0SeIhZw1qTxaK/MjgNN9q1ySFezv4afn1dcRAKHrAicpF1phI2WnnGmm6TBt+zZtAQqWkzzxrfkST8/Uopa+b//aCvZeqMOhabyrxBtSeQ7gazlZDTdeBywzycau7PIEsqEfkmf3K5+ACKjxbOFsZfPuVew5sHmQHMPFg09MkH2VlrNX0TzGEoNr0cfkViMbL296IfeTSvOPc37YcvgiCWrC7JM36wHVE5O+V223Y8VemSNbNTYxYMS3RttENDCrDH04I/WSnXyaHlAAxVzsIitDsi3UN7z0v3OtTGmxA5rrikTfdMCODUIzDufRJ6/aGe4Qio5PVd9VHQQPvduiTrzVfTjX/D/xDG/rKSq9wVYpyPFVwGvzDcQ175zvqA/lvdxNcLQgZuLZk88KJHj+ZJdGdCLCK/zDC6iwlc3zWzgcRpdOLsb4jPrB9xFpw6p+Nh+H+Pj6xpY7y/fC9lzdDbmm9kmV4NjzImv/viZzd5/pYD9OlPfvZw5XhklvgttGT+vU9G1u5M9O8ptGS4/gEX3nJo1Az/FYG/5Z1TFNBBIc+zeXAdJHQTKcZocksLqHhkO8xoOTXxr4Ot4ZJ8bpOG0yiit9BHVVP9h6i2W0v/bpTJpFkzuHb/waTNZdnGdmE9oDpzc98VZemaiEzzBE0QD8ZDCCQ8PlQA5T05onm72a6asxflOWhRx9J7EnNpKnJmxCHRN/0PJV+u2FXF08Oa+HSkPVk2KEAQ7gKO7C+bDeNYYsJKphB3Th7YPcOqiWX+WnHFL6vK3g2DrJbId82PBStrZ9QWyTK1W/WY5MJQfvxSoQvgpHw+XveihyYYYZeuRtDko3lCndaPZYJJxi9FJib0acRQtedPQbtutrBJGvngFqrVHjdMKdw0RCNmObT6WjOfb47O8/sJgE6Sb5nDusMeVBP5FhgQRBDki8IXATBVpZXQdhVE8Iw47dEJ3uOAloeykIei/USkTBjgWB1UpX74JocHzW85RUBqQmLQmsM5janW4gothM8JcAEHI6AALoAhWVVVV/////6mSqaqswtM3rjrBWwWQJiIw/mjGjG+eQoQ0SIOwEzuxj3ZAGjBvCwHjUoF2GZtk/anWvxD6AdJS4j8GCpwaZUX7/3GAgypQ2KKoqHHsXV3KtIO0e9II4GQnA6B1q8L3QCnIB7Xdib+hKMO1FyGgWoPxTigHO1sHSzNF1zPPr+eMIkVox0PRSVtZdzs6DLKKzXW2LJEuMPQNwD4o5/xJLMoUrCQ+KLIAEsOequSmh0PWUqMiEOfOrgz9TefHCMZEZWI5WBJqBEks3q6NV7DHtKFs3V9ybCJYVBdJF0/KldrmqYSJXA2ETceUlJ9b2ora+6oxJZ24f5g7iytGIylZVILuNhfMnAkG2ay12m7HefgBN6BU3tko6gTmTKPJtLnoTKZBNpzSOB40aUdAsugBp865dss2kv5OOTblVUHGl2VgWKRCF7Ut710oKCZd3tAMidDih6ol3Nkwne3Va8TTF6r8kBYwhVUYYAzaqjdYOvtjDgPbqvU6tUlQAnlppUJgS7d/OwH3yAOzmeJ19JJdz/BgY6/N1iJlBBy5AJDb5Z8rufJ6BHwI1dRR1e4kMxvfSdW9JjlovecEp4Sm7fxueV9fxu94UonziqDsQ7iAl86LDfefxiqEtDaA5bFPuhQbD4eDlFkl1pJSqCEeBx9GYpprGbwCUqLiHlncaeH8NTkujiZ9TT4kkdp1yVSGSYsecB/v6FrKRPdcr9Dx/T//qQKPKKOJmUBxwRou5Rq9cdKNe+w+w65zkiyFvJYwRJMsjy61hkPljZB0Q/Ejfrc/UTzX+lHSyzf9QOnDkK9t+TOUJS5czCDBRPT9S/M+Pj+FcbUN5/DRVKEUFBFAs5DQBIBIgHCelcts2SGp1m4Eez/b1vI0MsV/Bx5XM0YCUJRAlVkWGz5RvwG0TnfCkjmAuAxRlwXTfN8oYueRXHO1H6+vZ/OP/fuK5LFtvhDFjY4HoZmpeZETcD5EyYh+HnZRRYEiiQvHjXTpI9KDkTR74bg3jSA0DIwoEjNYkg7D5SXVPuUXycobaP9Ip+bIh0gWf3NEFbvAvY6eaj+wf+R0aIFWXo+CfbjvYyAh3zNMphwFHjJPMMOGr100IKwLY13nlZHmO1/x+W4qAcV0U6jDGf1MO5v/fFX+fx3xF7S86F+jcrVcGLlapLh5/f777UsGT/tJftY8j7ayT4QNx8BhxMNtm3W7FIwqPMOp6OTtQdWiwr6s543Dsbxuta0Ce+BJONKM1dBYPS16gl7dX1BkpM1whUJE/3IB+BqX4G3dOPwuXEm5K/CLlGMdcuQWRtygmQYDuNeauANSOdT87ckuLwZmXCgHq7rtVqVnotBLWGUccDIkc1BMtKQA/53nhYUH7+2Y753ER3eDOMInbDYWsxREM1JU00dDIV4AQejwAAuAAgCAQMAgoGDgEJBQ0DCwcPAIiEjIKKho6BiYWNg4uHj4BIRExCSkZOQUlFTUNLR09AyMTMwsrGzsHJxc3Dy8fPwCgkLCIqJi4hKSUtIysnLyCopKyiqqauoamlraOrp6+gaGRsYmpmbmFpZW1ja2dvYOjk7OLq5u7h6eXt4+vn7+AYFBwSGhYeERkVHRMbFx8QmJSckpqWnpGZlZ2Tm5efkFhUXFJaVl5RWVVdU1tXX1DY1NzS2tbe0dnV3dPb19/QODQ8Mjo2PjE5NT0zOzc/MLi0vLK6tr6xubW9s7u3v7B4dHxyenZ+cXl1fXN7d39w+PT88vr2/vH59f3z+/f/8AQaj+AAswqur///+/f+7//1Ss//+qB4k9rD2oNMzZr0ThPOHSHdk169KQ7enGkqb5X456RIAGAEHY/gALMFXV////f//c//+pWP//VQ8Se1h7UGmYs1+JwnnCpTuya9alIdvTjSVN878c9YgADQBByIMBCzCq6v///79/7v//VKz//6oHiT2sPag0zNmvROE84dId2TXr0pDt6caSpvlfjnpEgAYAQfiGAQtg8/8MAAAAJ6oKADT8MgDMU3+ACmt66Y9H1yS65r5+07Evq3i/O3PJjn7egz1RRdYJ8/8MAAAAJ6oKADT8MgDMU3+ACmt66Y9H1yS65r5+07Evq3i/O3PJjn7egz1RRdYJAEHY0gELIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEG41wELIBEREREREREREREQEA8ODQ0MCwoJCAcHBgUEAwIBAQEBAEHY2wELoAj+////AQAAAAJIAwD6t4RY9U+87O9PjJlvBcWsWbEkGAMAAAD9/////BP7/wjsOPsPiOUcGIitmdh32Hz59chbsc+JqnRWsPP+uQZgQAEvByZ6ZiW/DZrOdINZLQXkLE0JEL3TabYwkadhoLJ/qfvkqCZLs88IRPMsev8G7KQ1H4kSCgsCoMIliCEIfX9xHJfYxRrYytw5R8FB4+6pe2BPNNEcI6NgZMXuX/JPqRTElW6bVIBQNh2d3QZFnwl0UhzMQCd1sJWbHXzL6FImWrDIXQOZQ1ziAQ8QFz1nX5vGY1OtJvO8YWPDXpqB3PDPmZdjHNmr8AS+lRAi8ubJIPZJrEJTEU3IwcpyJXEWzoVi/NyGR1fs1WR5FZYXSJrAQlc0+FN3MzW6lHdQrhZQzPhJPBolF7by2wXhONDfNhvza+c2Pd2AuFT8G0nK2ohy8vbFWzXimt0Euxw4mckJptIkZRbNnJIt9eM/RgSrsXP6vQ54/fYXJuYyO3ecUA5Ib1fH4feX67G8EF/pcdorZzOqJ2AsLu5OgVJE8xcSb6/lOSwzH5qf3Jhl8qjQTtLHssNwFmaBEhEGHuIiuofw3TwCOAZMpS/8l19Da6uU01udCIeWewGuFIX077AAnWBaODmUqRDlCK4q0vPwNcOwuJpue2DL+axkLbbWBqniCvXVY3QJbk/nVBWQXytA1wqFUfuBzy+t+uAs2ffZVY/PWZwN1WB1Ab1jt/ZkM6vnnsEvGr/lVHarw9yRLyRZdH3tzicoeeQcD3zcCni+euQk15INTAE7xmeULsFi5BpDb9ZxRV1fUfr96WBTzvcN5MwVYY7TDZ4F+sKAc2PbueJhLVoNENrd9qZPp7F2gyzUa1vDO1oRFIrcB/bGnK14yQwIrFZ/ssc+w4Mnjo/z+V0ChKpgXcnTtSGmbwQJD0+7LqecDeaBbOWk/OID+McLRCwAe/UGTPlpuEivREJYpmCCpQshQWjIvw/owebLT0+GNE7qZB+PUS2/ko+poRZk6aoih0ncRNuoEQbQgUf5f3UIAbuBfSCRyrOeJDd8UVWsVzEHQ1L1Gi4cVN4r7MMDYNF5lqbUBOjwNqVVQui8DDXek29xWnmeW3LouzE2RagrQm6gu4xmU+D2V0goD5x5zZcDRAv8Vnmm3icyrxivSTb78bJM0fOscrqmpglNZ/2js3niHkvybSlMtRPcpifY0pVEeUUQ1jRqhJa1o7hAX2c8iLou1tBz4H+ZXX4iio3/GejDvEHgT5KsiywZIRob6vQnRTuOumQ4AC1PntkY5PS/BnHf6TiVnvtHbyNE7en9304vBbxRJtCqNn3Ag3Ow1PCHZx9PbwiJLHRg9Rdjv2gpp1hjfPQXDFxtq5zlcUv9PenhHAXVHUcwsm0Najs6dJDpDj8AQfjjAQugCP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQY/////wAAAAABpAEA/VtCrPonXvb3J8bMt4Ji1qxYEgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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rFgSDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAA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";
const pq = 712;
const pr = 3464;
const pG1gen = 42968;
const pG1zero = 43112;
const pG1b = 4776;
const pG2gen = 43256;
const pG2zero = 43544;
const pG2b = 17272;
const pOneT = 43832;
const prePSize = 288;
const preQSize = 20448;
const q = "4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559787";
const r = "52435875175126190479447740508185965837690552500527637822603658699938581184513";

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a SES hardened-profile realm) throws at module load.
let curve_bls12381 = null;

async function buildBls12381$1(singleThread, plugins) {
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
        const { ModuleBuilder } = await Promise.resolve().then(function () { return main; });
        const { buildBls12381: buildBls12381wasm } = await Promise.resolve().then(function () { return index; });

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


    // Batch-affine MSM helper module (curve-independent; links against the
    // main module's exports + memory at runtime in each worker).
    bls12381wasm.batchCode = base64ToUint8Array(code$1);

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
        curve = await buildBn128$1(singleThread, plugins);
    } else if (eq(r, bls12381r)) {
        curve = await buildBls12381$1(singleThread, plugins);
    } else {
        throw new Error(`Curve not supported: ${toString(r)}`);
    }
    return curve;
}

async function getCurveFromQ(q, singleThread, plugins) {
    let curve;
    if (eq(q, bn128q)) {
        curve = await buildBn128$1(singleThread, plugins);
    } else if (eq(q, bls12381q)) {
        curve = await buildBls12381$1(singleThread, plugins);
    } else {
        throw new Error(`Curve not supported: ${toString(q, 16)}`);
    }
    return curve;
}

async function getCurveFromName(name, singleThread, plugins) {
    let curve;
    const normName = normalizeName(name);
    if (["BN128", "BN254", "ALTBN128"].indexOf(normName) >= 0) {
        curve = await buildBn128$1(singleThread, plugins);
    } else if (["BLS12381"].indexOf(normName) >= 0) {
        curve = await buildBls12381$1(singleThread, plugins);
    } else {
        throw new Error(`Curve not supported: ${name}`);
    }
    return curve;

    function normalizeName(n) {
        return n.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
    }

}

const Scalar=_Scalar;
const utils$6 = _utils;

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmbuilder

    wasmbuilder is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmbuilder is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmbuilder. If not, see <https://www.gnu.org/licenses/>.
*/

function toNumber(n) {
    return BigInt(n);
}

function isNegative$3(n) {
    return n < 0n;
}

function isZero(n) {
    return n === 0n;
}

function bitLength$5(n) {
    if (isNegative$3(n)) {
        return n.toString(2).length - 1; // discard the - sign
    } else {
        return n.toString(2).length;
    }
}

function u32(n) {
    const b = [];
    const v = toNumber(n);
    b.push(Number(v & 0xFFn));
    b.push(Number(v >> 8n & 0xFFn));
    b.push(Number(v >> 16n & 0xFFn));
    b.push(Number(v >> 24n & 0xFFn));
    return b;
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                0x80 | ((charcode>>12) & 0x3f),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function string(str) {
    const bytes = toUTF8Array(str);
    return [ ...varuint32(bytes.length), ...bytes ];
}

function varuint(n) {
    const code = [];
    let v = toNumber(n);
    if (isNegative$3(v)) throw new Error("Number cannot be negative");
    while (!isZero(v)) {
        code.push(Number(v & 0x7Fn));
        v = v >> 7n;
    }
    if (code.length==0) code.push(0);
    for (let i=0; i<code.length-1; i++) {
        code[i] = code[i] | 0x80;
    }
    return code;
}

function varint(_n) {
    let n, sign;
    const bits = bitLength$5(_n);
    if (_n<0) {
        sign = true;
        n = (1n << BigInt(bits)) + _n;
    } else {
        sign = false;
        n = toNumber(_n);
    }
    const paddingBits = 7 - (bits % 7);

    const padding = ((1n << BigInt(paddingBits)) - 1n) << BigInt(bits);
    const paddingMask = ((1 << (7 - paddingBits))-1) | 0x80;

    const code = varuint(n + padding);

    if (!sign) {
        code[code.length-1] = code[code.length-1] & paddingMask;
    }

    return code;
}

function varint32(n) {
    let v = toNumber(n);
    if (v > 0xFFFFFFFFn) throw new Error("Number too big");
    if (v > 0x7FFFFFFFn) v = v - 0x100000000n;
    // bigInt("-80000000", 16) as base10
    if (v < -2147483648n) throw new Error("Number too small");
    return varint(v);
}

function varint64(n) {
    let v = toNumber(n);
    if (v > 0xFFFFFFFFFFFFFFFFn) throw new Error("Number too big");
    if (v > 0x7FFFFFFFFFFFFFFFn) v = v - 0x10000000000000000n;
    // bigInt("-8000000000000000", 16) as base10
    if (v < -9223372036854775808n) throw new Error("Number too small");
    return varint(v);
}

function varuint32(n) {
    let v = toNumber(n);
    if (v > 0xFFFFFFFFn) throw new Error("Number too big");
    return varuint(v);
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ("0" + (byte & 0xFF).toString(16)).slice(-2);
    }).join("");
}

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmbuilder

    wasmbuilder is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmbuilder is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmbuilder. If not, see <https://www.gnu.org/licenses/>.
*/


class CodeBuilder {
    constructor(func) {
        this.func = func;
        this.functionName = func.functionName;
        this.module = func.module;
    }

    setLocal(localName, valCode) {
        const idx = this.func.localIdxByName[localName];
        if (idx === undefined)
            throw new Error(`Local Variable not defined: Function: ${this.functionName} local: ${localName} `);
        return [...valCode, 0x21, ...varuint32( idx )];
    }

    teeLocal(localName, valCode) {
        const idx = this.func.localIdxByName[localName];
        if (idx === undefined)
            throw new Error(`Local Variable not defined: Function: ${this.functionName} local: ${localName} `);
        return [...valCode, 0x22, ...varuint32( idx )];
    }

    getLocal(localName) {
        const idx = this.func.localIdxByName[localName];
        if (idx === undefined)
            throw new Error(`Local Variable not defined: Function: ${this.functionName} local: ${localName} `);
        return [0x20, ...varuint32( idx )];
    }

    i64_load8_s(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 0 : _align;  // 8 bits alignment by default
        return [...idxCode, 0x30, align, ...varuint32(offset)];
    }

    i64_load8_u(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 0 : _align;  // 8 bits alignment by default
        return [...idxCode, 0x31, align, ...varuint32(offset)];
    }

    i64_load16_s(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 1 : _align;  // 16 bits alignment by default
        return [...idxCode, 0x32, align, ...varuint32(offset)];
    }

    i64_load16_u(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 1 : _align;  // 16 bits alignment by default
        return [...idxCode, 0x33, align, ...varuint32(offset)];
    }

    i64_load32_s(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 2 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x34, align, ...varuint32(offset)];
    }

    i64_load32_u(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 2 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x35, align, ...varuint32(offset)];
    }

    i64_load(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 3 : _align;  // 64 bits alignment by default
        return [...idxCode, 0x29, align, ...varuint32(offset)];
    }


    i64_store(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 3;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 3;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x37, align, ...varuint32(offset)];
    }

    i64_store32(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 2;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 2;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x3e, align, ...varuint32(offset)];
    }


    i64_store16(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 1;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 1;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x3d, align, ...varuint32(offset)];
    }


    i64_store8(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 0;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 0;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x3c, align, ...varuint32(offset)];
    }

    i32_load8_s(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 0 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x2c, align, ...varuint32(offset)];
    }

    i32_load8_u(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 0 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x2d, align, ...varuint32(offset)];
    }

    i32_load16_s(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 1 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x2e, align, ...varuint32(offset)];
    }

    i32_load16_u(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 1 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x2f, align, ...varuint32(offset)];
    }

    i32_load(idxCode, _offset, _align) {
        const offset = _offset || 0;
        const align = (_align === undefined) ? 2 : _align;  // 32 bits alignment by default
        return [...idxCode, 0x28, align, ...varuint32(offset)];
    }

    i32_store(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 2;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 2;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x36, align, ...varuint32(offset)];
    }


    i32_store16(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 1;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 1;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x3b, align, ...varuint32(offset)];
    }

    i32_store8(idxCode, _offset, _align, _codeVal) {
        let offset, align, codeVal;
        if (Array.isArray(_offset)) {
            offset = 0;
            align = 0;
            codeVal = _offset;
        } else if (Array.isArray(_align)) {
            offset = _offset;
            align = 0;
            codeVal = _align;
        } else if (Array.isArray(_codeVal)) {
            offset = _offset;
            align = _align;
            codeVal = _codeVal;
        }
        return [...idxCode, ...codeVal, 0x3a, align, ...varuint32(offset)];
    }

    call(fnName, ...args) {
        const idx = this.module.functionIdxByName[fnName];
        if (idx === undefined)
            throw new Error(`Function not defined: Function: ${fnName}`);
        return [...[].concat(...args), 0x10, ...varuint32(idx)];
    }

    call_indirect(fnIdx, ...args) {
        return [...[].concat(...args), ...fnIdx, 0x11, 0, 0];
    }

    if(condCode, thenCode, elseCode) {
        if (elseCode) {
            return [...condCode, 0x04, 0x40, ...thenCode, 0x05, ...elseCode, 0x0b];
        } else {
            return [...condCode, 0x04, 0x40, ...thenCode, 0x0b];
        }
    }

    block(bCode) { return [0x02, 0x40, ...bCode, 0x0b]; }
    loop(...args) {
        return [0x03, 0x40, ...[].concat(...[...args]), 0x0b];
    }
    br_if(relPath, condCode) { return [...condCode, 0x0d, ...varuint32(relPath)]; }
    br(relPath) { return [0x0c, ...varuint32(relPath)]; }
    ret(rCode) { return [...rCode, 0x0f]; }
    drop(dCode) { return [...dCode,  0x1a]; }

    i64_const(num) { return [0x42, ...varint64(num)]; }
    i32_const(num) { return [0x41, ...varint32(num)]; }


    i64_eqz(opcode) { return [...opcode, 0x50]; }
    i64_eq(op1code, op2code) { return [...op1code, ...op2code, 0x51]; }
    i64_ne(op1code, op2code) { return [...op1code, ...op2code, 0x52]; }
    i64_lt_s(op1code, op2code) { return [...op1code, ...op2code, 0x53]; }
    i64_lt_u(op1code, op2code) { return [...op1code, ...op2code, 0x54]; }
    i64_gt_s(op1code, op2code) { return [...op1code, ...op2code, 0x55]; }
    i64_gt_u(op1code, op2code) { return [...op1code, ...op2code, 0x56]; }
    i64_le_s(op1code, op2code) { return [...op1code, ...op2code, 0x57]; }
    i64_le_u(op1code, op2code) { return [...op1code, ...op2code, 0x58]; }
    i64_ge_s(op1code, op2code) { return [...op1code, ...op2code, 0x59]; }
    i64_ge_u(op1code, op2code) { return [...op1code, ...op2code, 0x5a]; }
    i64_add(op1code, op2code) { return [...op1code, ...op2code, 0x7c]; }
    i64_sub(op1code, op2code) { return [...op1code, ...op2code, 0x7d]; }
    i64_mul(op1code, op2code) { return [...op1code, ...op2code, 0x7e]; }
    i64_div_s(op1code, op2code) { return [...op1code, ...op2code, 0x7f]; }
    i64_div_u(op1code, op2code) { return [...op1code, ...op2code, 0x80]; }
    i64_rem_s(op1code, op2code) { return [...op1code, ...op2code, 0x81]; }
    i64_rem_u(op1code, op2code) { return [...op1code, ...op2code, 0x82]; }
    i64_and(op1code, op2code) { return [...op1code, ...op2code, 0x83]; }
    i64_or(op1code, op2code) { return [...op1code, ...op2code, 0x84]; }
    i64_xor(op1code, op2code) { return [...op1code, ...op2code, 0x85]; }
    i64_shl(op1code, op2code) { return [...op1code, ...op2code, 0x86]; }
    i64_shr_s(op1code, op2code) { return [...op1code, ...op2code, 0x87]; }
    i64_shr_u(op1code, op2code) { return [...op1code, ...op2code, 0x88]; }
    i64_extend_i32_s(op1code) { return [...op1code, 0xac]; }
    i64_extend_i32_u(op1code) { return [...op1code, 0xad]; }
    i64_clz(op1code) { return [...op1code, 0x79]; }
    i64_ctz(op1code) { return [...op1code, 0x7a]; }

    i32_eqz(op1code) { return [...op1code, 0x45]; }
    i32_eq(op1code, op2code) { return [...op1code, ...op2code, 0x46]; }
    i32_ne(op1code, op2code) { return [...op1code, ...op2code, 0x47]; }
    i32_lt_s(op1code, op2code) { return [...op1code, ...op2code, 0x48]; }
    i32_lt_u(op1code, op2code) { return [...op1code, ...op2code, 0x49]; }
    i32_gt_s(op1code, op2code) { return [...op1code, ...op2code, 0x4a]; }
    i32_gt_u(op1code, op2code) { return [...op1code, ...op2code, 0x4b]; }
    i32_le_s(op1code, op2code) { return [...op1code, ...op2code, 0x4c]; }
    i32_le_u(op1code, op2code) { return [...op1code, ...op2code, 0x4d]; }
    i32_ge_s(op1code, op2code) { return [...op1code, ...op2code, 0x4e]; }
    i32_ge_u(op1code, op2code) { return [...op1code, ...op2code, 0x4f]; }
    i32_add(op1code, op2code) { return [...op1code, ...op2code, 0x6a]; }
    i32_sub(op1code, op2code) { return [...op1code, ...op2code, 0x6b]; }
    i32_mul(op1code, op2code) { return [...op1code, ...op2code, 0x6c]; }
    i32_div_s(op1code, op2code) { return [...op1code, ...op2code, 0x6d]; }
    i32_div_u(op1code, op2code) { return [...op1code, ...op2code, 0x6e]; }
    i32_rem_s(op1code, op2code) { return [...op1code, ...op2code, 0x6f]; }
    i32_rem_u(op1code, op2code) { return [...op1code, ...op2code, 0x70]; }
    i32_and(op1code, op2code) { return [...op1code, ...op2code, 0x71]; }
    i32_or(op1code, op2code) { return [...op1code, ...op2code, 0x72]; }
    i32_xor(op1code, op2code) { return [...op1code, ...op2code, 0x73]; }
    i32_shl(op1code, op2code) { return [...op1code, ...op2code, 0x74]; }
    i32_shr_s(op1code, op2code) { return [...op1code, ...op2code, 0x75]; }
    i32_shr_u(op1code, op2code) { return [...op1code, ...op2code, 0x76]; }
    i32_rotl(op1code, op2code) { return [...op1code, ...op2code, 0x77]; }
    i32_rotr(op1code, op2code) { return [...op1code, ...op2code, 0x78]; }
    i32_wrap_i64(op1code) { return [...op1code, 0xa7]; }
    i32_clz(op1code) { return [...op1code, 0x67]; }
    i32_ctz(op1code) { return [...op1code, 0x68]; }

    unreachable() { return [ 0x0 ]; }

    current_memory() { return [ 0x3f, 0]; }

    comment() { return []; }
}

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmbuilder

    wasmbuilder is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmbuilder is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmbuilder. If not, see <https://www.gnu.org/licenses/>.
*/


const typeCodes = {
    "i32": 0x7f,
    "i64": 0x7e,
    "f32": 0x7d,
    "f64": 0x7c,
    "anyfunc": 0x70,
    "func": 0x60,
    "emptyblock": 0x40
};


class FunctionBuilder {

    constructor (module, fnName, fnType, moduleName, fieldName) {
        if (fnType == "import") {
            this.fnType = "import";
            this.moduleName = moduleName;
            this.fieldName = fieldName;
        } else if (fnType == "internal") {
            this.fnType = "internal";
        } else {
            throw new Error("Invalid function fnType: " + fnType);
        }
        this.module = module;
        this.fnName = fnName;
        this.params = [];
        this.locals = [];
        this.localIdxByName = {};
        this.code = [];
        this.returnType = null;
        this.nextLocal =0;
    }

    addParam(paramName, paramType) {
        if (this.localIdxByName[paramName])
            throw new Error(`param already exists. Function: ${this.fnName}, Param: ${paramName} `);
        const idx = this.nextLocal++;
        this.localIdxByName[paramName] = idx;
        this.params.push({
            type: paramType
        });
    }

    addLocal(localName, localType, _length) {
        const length = _length || 1;
        if (this.localIdxByName[localName])
            throw new Error(`local already exists. Function: ${this.fnName}, Param: ${localName} `);
        const idx = this.nextLocal++;
        this.localIdxByName[localName] = idx;
        this.locals.push({
            type: localType,
            length: length
        });
    }

    setReturnType(returnType) {
        if (this.returnType)
            throw new Error(`returnType already defined. Function: ${this.fnName}`);
        this.returnType = returnType;
    }

    getSignature() {
        const params = [...varuint32(this.params.length), ...this.params.map((p) => typeCodes[p.type])];
        const returns = this.returnType ? [0x01, typeCodes[this.returnType]] : [0];
        return [0x60, ...params, ...returns];
    }

    getBody() {
        const locals = this.locals.map((l) => [
            ...varuint32(l.length),
            typeCodes[l.type]
        ]);

        const body = [
            ...varuint32(this.locals.length),
            ...[].concat(...locals),
            ...this.code,
            0x0b
        ];
        return [
            ...varuint32(body.length),
            ...body
        ];
    }

    addCode(...code) {
        this.code.push(...[].concat(...[...code]));
    }

    getCodeBuilder() {
        return new CodeBuilder(this);
    }
}

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmbuilder

    wasmbuilder is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmbuilder is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmbuilder. If not, see <https://www.gnu.org/licenses/>.
*/


class ModuleBuilder {

    constructor() {
        this.functions = [];
        this.functionIdxByName = {};
        this.nImportFunctions = 0;
        this.nInternalFunctions =0;
        this.memory = {
            pagesSize: 1,
            moduleName: "env",
            fieldName: "memory"
        };
        this.free = 8;
        this.datas = [];
        this.modules = {};
        this.exports = [];
        this.functionsTable = [];
    }

    build() {
        this._setSignatures();
        return new Uint8Array([
            ...u32(0x6d736100),
            ...u32(1),
            ...this._buildType(),
            ...this._buildImport(),
            ...this._buildFunctionDeclarations(),
            ...this._buildFunctionsTable(),
            ...this._buildExports(),
            ...this._buildElements(),
            ...this._buildCode(),
            ...this._buildData()
        ]);
    }

    addFunction(fnName) {
        if (typeof(this.functionIdxByName[fnName]) !== "undefined")
            throw new Error(`Function already defined: ${fnName}`);

        const idx = this.functions.length;
        this.functionIdxByName[fnName] = idx;

        this.functions.push(new FunctionBuilder(this, fnName, "internal"));

        this.nInternalFunctions++;
        return this.functions[idx];
    }

    addIimportFunction(fnName, moduleName, _fieldName) {
        if (typeof(this.functionIdxByName[fnName]) !== "undefined")
            throw new Error(`Function already defined: ${fnName}`);

        if (  (this.functions.length>0)
            &&(this.functions[this.functions.length-1].type == "internal"))
            throw new Error(`Import functions must be declared before internal: ${fnName}`);

        let fieldName = _fieldName || fnName;

        const idx = this.functions.length;
        this.functionIdxByName[fnName] = idx;

        this.functions.push(new FunctionBuilder(this, fnName, "import", moduleName, fieldName));

        this.nImportFunctions ++;
        return this.functions[idx];
    }

    setMemory(pagesSize, moduleName, fieldName) {
        this.memory = {
            pagesSize: pagesSize,
            moduleName: moduleName || "env",
            fieldName: fieldName || "memory"
        };
    }

    exportFunction(fnName, _exportName) {
        const exportName = _exportName || fnName;
        if (typeof(this.functionIdxByName[fnName]) === "undefined")
            throw new Error(`Function not defined: ${fnName}`);
        const idx = this.functionIdxByName[fnName];
        if (exportName != fnName) {
            this.functionIdxByName[exportName] = idx;
        }
        this.exports.push({
            exportName: exportName,
            idx: idx
        });
    }

    addFunctionToTable(fnName) {
        const idx = this.functionIdxByName[fnName];
        this.functionsTable.push(idx);
    }

    addData(offset, bytes) {
        this.datas.push({
            offset: offset,
            bytes: bytes
        });
    }

    alloc(a, b) {
        let size;
        let bytes;
        if ((Array.isArray(a) || ArrayBuffer.isView(a)) && (typeof(b) === "undefined")) {
            size = a.length;
            bytes = a;
        } else {
            size = a;
            bytes = b;
        }
        size = (((size-1)>>3) +1)<<3;       // Align to 64 bits.
        const p = this.free;
        this.free += size;
        if (bytes) {
            this.addData(p, bytes);
        }
        return p;
    }

    allocString(s) {
        const encoder = new globalThis.TextEncoder();
        const uint8array = encoder.encode(s);
        return this.alloc([...uint8array, 0]);
    }

    _setSignatures() {
        this.signatures = [];
        const signatureIdxByName = {};
        if (this.functionsTable.length>0) {
            const signature = this.functions[this.functionsTable[0]].getSignature();
            const signatureName = "s_"+toHexString(signature);
            signatureIdxByName[signatureName] = 0;
            this.signatures.push(signature);
        }
        for (let i=0; i<this.functions.length; i++) {
            const signature = this.functions[i].getSignature();
            const signatureName = "s_"+toHexString(signature);
            if (typeof(signatureIdxByName[signatureName]) === "undefined") {
                signatureIdxByName[signatureName] = this.signatures.length;
                this.signatures.push(signature);
            }

            this.functions[i].signatureIdx = signatureIdxByName[signatureName];
        }

    }

    _buildSection(sectionType, section) {
        return [sectionType, ...varuint32(section.length), ...section];
    }

    _buildType() {
        return this._buildSection(
            0x01,
            [
                ...varuint32(this.signatures.length),
                ...[].concat(...this.signatures)
            ]
        );
    }

    _buildImport() {
        const entries = [];
        entries.push([
            ...string(this.memory.moduleName),
            ...string(this.memory.fieldName),
            0x02,
            0x00,   //Flags no init valua
            ...varuint32(this.memory.pagesSize)
        ]);
        for (let i=0; i< this.nImportFunctions; i++) {
            entries.push([
                ...string(this.functions[i].moduleName),
                ...string(this.functions[i].fieldName),
                0x00,
                ...varuint32(this.functions[i].signatureIdx)
            ]);
        }
        return this._buildSection(
            0x02,
            varuint32(entries.length).concat(...entries)
        );
    }

    _buildFunctionDeclarations() {
        const entries = [];
        for (let i=this.nImportFunctions; i< this.nImportFunctions + this.nInternalFunctions; i++) {
            entries.push(...varuint32(this.functions[i].signatureIdx));
        }
        return this._buildSection(
            0x03,
            [
                ...varuint32(entries.length),
                ...[...entries]
            ]
        );
    }

    _buildFunctionsTable() {
        if (this.functionsTable.length == 0) return [];
        return this._buildSection(
            0x04,
            [
                ...varuint32(1),
                0x70, 0, ...varuint32(this.functionsTable.length)
            ]
        );
    }

    _buildElements() {
        if (this.functionsTable.length == 0) return [];
        const entries = [];
        for (let i=0; i<this.functionsTable.length; i++) {
            entries.push(...varuint32(this.functionsTable[i]));
        }
        return this._buildSection(
            0x09,
            [
                ...varuint32(1),      // 1 entry
                ...varuint32(0),      // Table (0 in MVP)
                0x41,                       // offset 0
                ...varint32(0),
                0x0b,
                ...varuint32(this.functionsTable.length), // Number of elements
                ...[...entries]
            ]
        );
    }

    _buildExports() {
        const entries = [];
        for (let i=0; i< this.exports.length; i++) {
            entries.push([
                ...string(this.exports[i].exportName),
                0x00,
                ...varuint32(this.exports[i].idx)
            ]);
        }
        return this._buildSection(
            0x07,
            varuint32(entries.length).concat(...entries)
        );
    }

    _buildCode() {
        const entries = [];
        for (let i=this.nImportFunctions; i< this.nImportFunctions + this.nInternalFunctions; i++) {
            entries.push(this.functions[i].getBody());
        }
        return this._buildSection(
            0x0a,
            varuint32(entries.length).concat(...entries)
        );
    }

    _buildData() {
        const entries = [];
        entries.push([
            0x00,
            0x41,
            0x00,
            0x0b,
            0x04,
            ...u32(this.free)
        ]);
        for (let i=0; i< this.datas.length; i++) {
            entries.push([
                0x00,
                0x41,
                ...varint32(this.datas[i].offset),
                0x0b,
                ...varuint32(this.datas[i].bytes.length),
                ...this.datas[i].bytes,
            ]);
        }
        return this._buildSection(
            0x0b,
            varuint32(entries.length).concat(...entries)
        );
    }

}

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmbuilder

    wasmbuilder is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmbuilder is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmbuilder. If not, see <https://www.gnu.org/licenses/>.
*/

var main = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ModuleBuilder: ModuleBuilder
});

var utils$5 = {};

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

utils$5.bigInt2BytesLE = function bigInt2BytesLE(_a, len) {
    const b = Array(len);
    let v = BigInt(_a);
    for (let i=0; i<len; i++) {
        b[i] = Number(v & 0xFFn);
        v = v >> 8n;
    }
    return b;
};

utils$5.bigInt2U32LE = function bigInt2BytesLE(_a, len) {
    const b = Array(len);
    let v = BigInt(_a);
    for (let i=0; i<len; i++) {
        b[i] = Number(v & 0xFFFFFFFFn);
        v = v >> 32n;
    }
    return b;
};

utils$5.isOcamNum = function(a) {
    if (!Array.isArray(a)) return false;
    if (a.length != 3) return false;
    if (typeof a[0] !== "number") return false;
    if (typeof a[1] !== "number") return false;
    if (!Array.isArray(a[2])) return false;
    return true;
};

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

var build_int = function buildInt(module, n64, _prefix) {

    const prefix = _prefix || "int";
    if (module.modules[prefix]) return prefix;  // already builded
    module.modules[prefix] = {};

    const n32 = n64*2;
    const n8 = n64*8;

    function buildCopy() {
        const f = module.addFunction(prefix+"_copy");
        f.addParam("px", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        for (let i=0; i<n64; i++) {
            f.addCode(
                c.i64_store(
                    c.getLocal("pr"),
                    i*8,
                    c.i64_load(
                        c.getLocal("px"),
                        i*8
                    )
                )
            );
        }
    }

    function buildZero() {
        const f = module.addFunction(prefix+"_zero");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        for (let i=0; i<n64; i++) {
            f.addCode(
                c.i64_store(
                    c.getLocal("pr"),
                    i*8,
                    c.i64_const(0)
                )
            );
        }
    }

    function buildOne() {
        const f = module.addFunction(prefix+"_one");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.i64_store(
                c.getLocal("pr"),
                0,
                c.i64_const(1)
            )
        );
        for (let i=1; i<n64; i++) {
            f.addCode(
                c.i64_store(
                    c.getLocal("pr"),
                    i*8,
                    c.i64_const(0)
                )
            );
        }
    }

    function buildIsZero() {
        const f = module.addFunction(prefix+"_isZero");
        f.addParam("px", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        function getCompCode(n) {
            if (n==0) {
                return  c.ret(c.i64_eqz(
                    c.i64_load(c.getLocal("px"))
                ));
            }
            return c.if(
                c.i64_eqz(
                    c.i64_load(c.getLocal("px"), n*8 )
                ),
                getCompCode(n-1),
                c.ret(c.i32_const(0))
            );
        }

        f.addCode(getCompCode(n64-1));
        f.addCode(c.ret(c.i32_const(0)));
    }

    function buildEq() {
        const f = module.addFunction(prefix+"_eq");
        f.addParam("px", "i32");
        f.addParam("py", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        function getCompCode(n) {
            if (n==0) {
                return  c.ret(c.i64_eq(
                    c.i64_load(c.getLocal("px")),
                    c.i64_load(c.getLocal("py"))
                ));
            }
            return c.if(
                c.i64_eq(
                    c.i64_load(c.getLocal("px"), n*8 ),
                    c.i64_load(c.getLocal("py"), n*8 )
                ),
                getCompCode(n-1),
                c.ret(c.i32_const(0))
            );
        }

        f.addCode(getCompCode(n64-1));
        f.addCode(c.ret(c.i32_const(0)));
    }



    function buildGte() {
        const f = module.addFunction(prefix+"_gte");
        f.addParam("px", "i32");
        f.addParam("py", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        function getCompCode(n) {
            if (n==0) {
                return  c.ret(c.i64_ge_u(
                    c.i64_load(c.getLocal("px")),
                    c.i64_load(c.getLocal("py"))
                ));
            }
            return c.if(
                c.i64_lt_u(
                    c.i64_load(c.getLocal("px"), n*8 ),
                    c.i64_load(c.getLocal("py"), n*8 )
                ),
                c.ret(c.i32_const(0)),
                c.if(
                    c.i64_gt_u(
                        c.i64_load(c.getLocal("px"), n*8 ),
                        c.i64_load(c.getLocal("py"), n*8 )
                    ),
                    c.ret(c.i32_const(1)),
                    getCompCode(n-1)
                )
            );
        }

        f.addCode(getCompCode(n64-1));
        f.addCode(c.ret(c.i32_const(0)));
    }



    function buildAdd() {

        const f = module.addFunction(prefix+"_add");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");
        f.setReturnType("i32");
        f.addLocal("c", "i64");

        const c = f.getCodeBuilder();

        f.addCode(c.setLocal(
            "c",
            c.i64_add(
                c.i64_load32_u(c.getLocal("x")),
                c.i64_load32_u(c.getLocal("y"))
            )
        ));

        f.addCode(c.i64_store32(
            c.getLocal("r"),
            c.getLocal("c"),
        ));

        for (let i=1; i<n32; i++) {
            f.addCode(c.setLocal( "c",
                c.i64_add(
                    c.i64_add(
                        c.i64_load32_u(c.getLocal("x"), 4*i),
                        c.i64_load32_u(c.getLocal("y"), 4*i)
                    ),
                    c.i64_shr_u (c.getLocal("c"), c.i64_const(32))
                )
            ));

            f.addCode(c.i64_store32(
                c.getLocal("r"),
                i*4,
                c.getLocal("c")
            ));
        }

        f.addCode(c.i32_wrap_i64(c.i64_shr_u (c.getLocal("c"), c.i64_const(32))));
    }


    function buildSub() {

        const f = module.addFunction(prefix+"_sub");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");
        f.setReturnType("i32");
        f.addLocal("c", "i64");

        const c = f.getCodeBuilder();

        f.addCode(c.setLocal(
            "c",
            c.i64_sub(
                c.i64_load32_u(c.getLocal("x")),
                c.i64_load32_u(c.getLocal("y"))
            )
        ));

        f.addCode(c.i64_store32(
            c.getLocal("r"),
            c.i64_and(
                c.getLocal("c"),
                c.i64_const("0xFFFFFFFF")
            )
        ));

        for (let i=1; i<n32; i++) {
            f.addCode(c.setLocal( "c",
                c.i64_add(
                    c.i64_sub(
                        c.i64_load32_u(c.getLocal("x"), 4*i),
                        c.i64_load32_u(c.getLocal("y"), 4*i)
                    ),
                    c.i64_shr_s (c.getLocal("c"), c.i64_const(32))
                )
            ));

            f.addCode(c.i64_store32(
                c.getLocal("r"),
                i*4,
                c.i64_and( c.getLocal("c"), c.i64_const("0xFFFFFFFF"))
            ));
        }

        f.addCode(c.i32_wrap_i64 ( c.i64_shr_s (c.getLocal("c"), c.i64_const(32))));
    }


    function buildMul() {

        const f = module.addFunction(prefix+"_mul");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");
        f.addLocal("c0", "i64");
        f.addLocal("c1", "i64");


        for (let i=0;i<n32; i++) {
            f.addLocal("x"+i, "i64");
            f.addLocal("y"+i, "i64");
        }

        const c = f.getCodeBuilder();

        const loadX = [];
        const loadY = [];
        function mulij(i, j) {
            let X,Y;
            if (!loadX[i]) {
                X = c.teeLocal("x"+i, c.i64_load32_u( c.getLocal("x"), i*4));
                loadX[i] = true;
            } else {
                X = c.getLocal("x"+i);
            }
            if (!loadY[j]) {
                Y = c.teeLocal("y"+j, c.i64_load32_u( c.getLocal("y"), j*4));
                loadY[j] = true;
            } else {
                Y = c.getLocal("y"+j);
            }

            return c.i64_mul( X, Y );
        }

        let c0 = "c0";
        let c1 = "c1";

        for (let k=0; k<n32*2-1; k++) {
            for (let i=Math.max(0, k-n32+1); (i<=k)&&(i<n32); i++) {
                const j= k-i;

                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulij(i,j)
                        )
                    )
                );

                f.addCode(
                    c.setLocal(c1,
                        c.i64_add(
                            c.getLocal(c1),
                            c.i64_shr_u(
                                c.getLocal(c0),
                                c.i64_const(32)
                            )
                        )
                    )
                );

            }

            f.addCode(
                c.i64_store32(
                    c.getLocal("r"),
                    k*4,
                    c.getLocal(c0)
                )
            );
            [c0, c1] = [c1, c0];
            f.addCode(
                c.setLocal(c1,
                    c.i64_shr_u(
                        c.getLocal(c0),
                        c.i64_const(32)
                    )
                )
            );
        }
        f.addCode(
            c.i64_store32(
                c.getLocal("r"),
                n32*4*2-4,
                c.getLocal(c0)
            )
        );

    }



    function buildSquare() {

        const f = module.addFunction(prefix+"_square");
        f.addParam("x", "i32");
        f.addParam("r", "i32");
        f.addLocal("c0", "i64");
        f.addLocal("c1", "i64");
        f.addLocal("c0_old", "i64");
        f.addLocal("c1_old", "i64");


        for (let i=0;i<n32; i++) {
            f.addLocal("x"+i, "i64");
        }

        const c = f.getCodeBuilder();

        const loadX = [];
        function mulij(i, j) {
            let X,Y;
            if (!loadX[i]) {
                X = c.teeLocal("x"+i, c.i64_load32_u( c.getLocal("x"), i*4));
                loadX[i] = true;
            } else {
                X = c.getLocal("x"+i);
            }
            if (!loadX[j]) {
                Y = c.teeLocal("x"+j, c.i64_load32_u( c.getLocal("x"), j*4));
                loadX[j] = true;
            } else {
                Y = c.getLocal("x"+j);
            }

            return c.i64_mul( X, Y );
        }

        let c0 = "c0";
        let c1 = "c1";
        let c0_old = "c0_old";
        let c1_old = "c1_old";

        for (let k=0; k<n32*2-1; k++) {
            f.addCode(
                c.setLocal(c0, c.i64_const(0)),
                c.setLocal(c1, c.i64_const(0)),
            );

            for (let i=Math.max(0, k-n32+1); (i<((k+1)>>1) )&&(i<n32); i++) {
                const j= k-i;

                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulij(i,j)
                        )
                    )
                );

                f.addCode(
                    c.setLocal(c1,
                        c.i64_add(
                            c.getLocal(c1),
                            c.i64_shr_u(
                                c.getLocal(c0),
                                c.i64_const(32)
                            )
                        )
                    )
                );
            }

            // Multiply by 2
            f.addCode(
                c.setLocal(c0,
                    c.i64_shl(
                        c.i64_and(
                            c.getLocal(c0),
                            c.i64_const(0xFFFFFFFF)
                        ),
                        c.i64_const(1)
                    )
                )
            );

            f.addCode(
                c.setLocal(c1,
                    c.i64_add(
                        c.i64_shl(
                            c.getLocal(c1),
                            c.i64_const(1)
                        ),
                        c.i64_shr_u(
                            c.getLocal(c0),
                            c.i64_const(32)
                        )
                    )
                )
            );

            if (k%2 == 0) {
                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulij(k>>1, k>>1)
                        )
                    )
                );

                f.addCode(
                    c.setLocal(c1,
                        c.i64_add(
                            c.getLocal(c1),
                            c.i64_shr_u(
                                c.getLocal(c0),
                                c.i64_const(32)
                            )
                        )
                    )
                );
            }

            // Add the old carry

            if (k>0) {
                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            c.i64_and(
                                c.getLocal(c0_old),
                                c.i64_const(0xFFFFFFFF)
                            ),
                        )
                    )
                );

                f.addCode(
                    c.setLocal(c1,
                        c.i64_add(
                            c.i64_add(
                                c.getLocal(c1),
                                c.i64_shr_u(
                                    c.getLocal(c0),
                                    c.i64_const(32)
                                )
                            ),
                            c.getLocal(c1_old)
                        )
                    )
                );
            }

            f.addCode(
                c.i64_store32(
                    c.getLocal("r"),
                    k*4,
                    c.getLocal(c0)
                )
            );

            f.addCode(
                c.setLocal(
                    c0_old,
                    c.getLocal(c1)
                ),
                c.setLocal(
                    c1_old,
                    c.i64_shr_u(
                        c.getLocal(c0_old),
                        c.i64_const(32)
                    )
                )
            );

        }
        f.addCode(
            c.i64_store32(
                c.getLocal("r"),
                n32*4*2-4,
                c.getLocal(c0_old)
            )
        );

    }


    function buildSquareOld() {
        const f = module.addFunction(prefix+"_squareOld");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(prefix + "_mul", c.getLocal("x"), c.getLocal("x"), c.getLocal("r")));
    }

    function _buildMul1() {
        const f = module.addFunction(prefix+"__mul1");
        f.addParam("px", "i32");
        f.addParam("y", "i64");
        f.addParam("pr", "i32");
        f.addLocal("c", "i64");

        const c = f.getCodeBuilder();

        f.addCode(c.setLocal(
            "c",
            c.i64_mul(
                c.i64_load32_u(c.getLocal("px"), 0, 0),
                c.getLocal("y")
            )
        ));

        f.addCode(c.i64_store32(
            c.getLocal("pr"),
            0,
            0,
            c.getLocal("c"),
        ));

        for (let i=1; i<n32; i++) {
            f.addCode(c.setLocal( "c",
                c.i64_add(
                    c.i64_mul(
                        c.i64_load32_u(c.getLocal("px"), 4*i, 0),
                        c.getLocal("y")
                    ),
                    c.i64_shr_u (c.getLocal("c"), c.i64_const(32))
                )
            ));

            f.addCode(c.i64_store32(
                c.getLocal("pr"),
                i*4,
                0,
                c.getLocal("c")
            ));
        }
    }

    function _buildAdd1() {
        const f = module.addFunction(prefix+"__add1");
        f.addParam("x", "i32");
        f.addParam("y", "i64");
        f.addLocal("c", "i64");
        f.addLocal("px", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.setLocal("px", c.getLocal("x")));

        f.addCode(c.setLocal(
            "c",
            c.i64_add(
                c.i64_load32_u(c.getLocal("px"), 0, 0),
                c.getLocal("y")
            )
        ));

        f.addCode(c.i64_store32(
            c.getLocal("px"),
            0,
            0,
            c.getLocal("c"),
        ));

        f.addCode(c.setLocal(
            "c",
            c.i64_shr_u(
                c.getLocal("c"),
                c.i64_const(32)
            )
        ));

        f.addCode(c.block(c.loop(
            c.br_if(
                1,
                c.i64_eqz(c.getLocal("c"))
            ),
            c.setLocal(
                "px",
                c.i32_add(
                    c.getLocal("px"),
                    c.i32_const(4)
                )
            ),

            c.setLocal(
                "c",
                c.i64_add(
                    c.i64_load32_u(c.getLocal("px"), 0, 0),
                    c.getLocal("c")
                )
            ),

            c.i64_store32(
                c.getLocal("px"),
                0,
                0,
                c.getLocal("c"),
            ),

            c.setLocal(
                "c",
                c.i64_shr_u(
                    c.getLocal("c"),
                    c.i64_const(32)
                )
            ),

            c.br(0)
        )));
    }


    function buildDiv() {
        _buildMul1();
        _buildAdd1();

        const f = module.addFunction(prefix+"_div");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("c", "i32");
        f.addParam("r", "i32");
        f.addLocal("rr", "i32");
        f.addLocal("cc", "i32");
        f.addLocal("eX", "i32");
        f.addLocal("eY", "i32");
        f.addLocal("sy", "i64");
        f.addLocal("sx", "i64");
        f.addLocal("ec", "i32");

        const c = f.getCodeBuilder();

        const Y = c.i32_const(module.alloc(n8));
        const Caux = c.i32_const(module.alloc(n8));
        const Raux = c.i32_const(module.alloc(n8));
        const C = c.getLocal("cc");
        const R = c.getLocal("rr");
        const pr1 = module.alloc(n8*2);
        const R1 = c.i32_const(pr1);
        const R2 = c.i32_const(pr1+n8);

        // Ic c is 0 then store it in an auxiliary buffer
        f.addCode(c.if(
            c.getLocal("c"),
            c.setLocal("cc", c.getLocal("c")),
            c.setLocal("cc", Caux)
        ));

        // Ic r is 0 then store it in an auxiliary buffer
        f.addCode(c.if(
            c.getLocal("r"),
            c.setLocal("rr", c.getLocal("r")),
            c.setLocal("rr", Raux)
        ));

        // Copy
        f.addCode(c.call(prefix + "_copy", c.getLocal("x"), R));
        f.addCode(c.call(prefix + "_copy", c.getLocal("y"), Y));
        f.addCode(c.call(prefix + "_zero", C));
        f.addCode(c.call(prefix + "_zero", R1));


        f.addCode(c.setLocal("eX", c.i32_const(n8-1)));
        f.addCode(c.setLocal("eY", c.i32_const(n8-1)));

        // while (eY>3)&&(Y[eY]==0) ey--;
        f.addCode(c.block(c.loop(
            c.br_if(
                1,
                c.i32_or(
                    c.i32_load8_u(
                        c.i32_add(Y , c.getLocal("eY")),
                        0,
                        0
                    ),
                    c.i32_eq(
                        c.getLocal("eY"),
                        c.i32_const(3)
                    )
                )
            ),
            c.setLocal("eY", c.i32_sub(c.getLocal("eY"), c.i32_const(1))),
            c.br(0)
        )));

        f.addCode(
            c.setLocal(
                "sy",
                c.i64_add(
                    c.i64_load32_u(
                        c.i32_sub(
                            c.i32_add( Y, c.getLocal("eY")),
                            c.i32_const(3)
                        ),
                        0,
                        0
                    ),
                    c.i64_const(1)
                )
            )
        );

        // Force a divide by 0 if quotien is 0
        f.addCode(
            c.if(
                c.i64_eq(
                    c.getLocal("sy"),
                    c.i64_const(1)
                ),
                c.drop(c.i64_div_u(c.i64_const(0), c.i64_const(0)))
            )
        );

        f.addCode(c.block(c.loop(

            // while (eX>7)&&(Y[eX]==0) ex--;
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_or(
                        c.i32_load8_u(
                            c.i32_add(R , c.getLocal("eX")),
                            0,
                            0
                        ),
                        c.i32_eq(
                            c.getLocal("eX"),
                            c.i32_const(7)
                        )
                    )
                ),
                c.setLocal("eX", c.i32_sub(c.getLocal("eX"), c.i32_const(1))),
                c.br(0)
            )),

            c.setLocal(
                "sx",
                c.i64_load(
                    c.i32_sub(
                        c.i32_add( R, c.getLocal("eX")),
                        c.i32_const(7)
                    ),
                    0,
                    0
                )
            ),

            c.setLocal(
                "sx",
                c.i64_div_u(
                    c.getLocal("sx"),
                    c.getLocal("sy")
                )
            ),
            c.setLocal(
                "ec",
                c.i32_sub(
                    c.i32_sub(
                        c.getLocal("eX"),
                        c.getLocal("eY")
                    ),
                    c.i32_const(4)
                )
            ),

            // While greater than 32 bits or ec is neg, shr and inc exp
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_and(
                        c.i64_eqz(
                            c.i64_and(
                                c.getLocal("sx"),
                                c.i64_const("0xFFFFFFFF00000000")
                            )
                        ),
                        c.i32_ge_s(
                            c.getLocal("ec"),
                            c.i32_const(0)
                        )
                    )
                ),

                c.setLocal(
                    "sx",
                    c.i64_shr_u(
                        c.getLocal("sx"),
                        c.i64_const(8)
                    )
                ),

                c.setLocal(
                    "ec",
                    c.i32_add(
                        c.getLocal("ec"),
                        c.i32_const(1)
                    )
                ),
                c.br(0)
            )),

            c.if(
                c.i64_eqz(c.getLocal("sx")),
                [
                    ...c.br_if(
                        2,
                        c.i32_eqz(c.call(prefix + "_gte", R, Y))
                    ),
                    ...c.setLocal("sx", c.i64_const(1)),
                    ...c.setLocal("ec", c.i32_const(0))
                ]
            ),

            c.call(prefix + "__mul1", Y, c.getLocal("sx"), R2),
            c.drop(c.call(
                prefix + "_sub",
                R,
                c.i32_sub(R2, c.getLocal("ec")),
                R
            )),
            c.call(
                prefix + "__add1",
                c.i32_add(C, c.getLocal("ec")),
                c.getLocal("sx")
            ),
            c.br(0)
        )));
    }

    function buildInverseMod() {

        const f = module.addFunction(prefix+"_inverseMod");
        f.addParam("px", "i32");
        f.addParam("pm", "i32");
        f.addParam("pr", "i32");
        f.addLocal("t", "i32");
        f.addLocal("newt", "i32");
        f.addLocal("r", "i32");
        f.addLocal("qq", "i32");
        f.addLocal("qr", "i32");
        f.addLocal("newr", "i32");
        f.addLocal("swp", "i32");
        f.addLocal("x", "i32");
        f.addLocal("signt", "i32");
        f.addLocal("signnewt", "i32");
        f.addLocal("signx", "i32");

        const c = f.getCodeBuilder();

        const aux1 = c.i32_const(module.alloc(n8));
        const aux2 = c.i32_const(module.alloc(n8));
        const aux3 = c.i32_const(module.alloc(n8));
        const aux4 = c.i32_const(module.alloc(n8));
        const aux5 = c.i32_const(module.alloc(n8));
        const aux6 = c.i32_const(module.alloc(n8));
        const mulBuff = c.i32_const(module.alloc(n8*2));
        const aux7 = c.i32_const(module.alloc(n8));

        f.addCode(
            c.setLocal("t", aux1),
            c.call(prefix + "_zero", aux1),
            c.setLocal("signt", c.i32_const(0)),
        );

        f.addCode(
            c.setLocal("r", aux2),
            c.call(prefix + "_copy", c.getLocal("pm"), aux2)
        );

        f.addCode(
            c.setLocal("newt", aux3),
            c.call(prefix + "_one", aux3),
            c.setLocal("signnewt", c.i32_const(0)),
        );

        f.addCode(
            c.setLocal("newr", aux4),
            c.call(prefix + "_copy", c.getLocal("px"), aux4)
        );




        f.addCode(c.setLocal("qq", aux5));
        f.addCode(c.setLocal("qr", aux6));
        f.addCode(c.setLocal("x", aux7));

        f.addCode(c.block(c.loop(
            c.br_if(
                1,
                c.call(prefix + "_isZero", c.getLocal("newr") )
            ),
            c.call(prefix + "_div", c.getLocal("r"), c.getLocal("newr"), c.getLocal("qq"), c.getLocal("qr")),

            c.call(prefix + "_mul", c.getLocal("qq"), c.getLocal("newt"), mulBuff),

            c.if(
                c.getLocal("signt"),
                c.if(
                    c.getLocal("signnewt"),
                    c.if (
                        c.call(prefix + "_gte", mulBuff, c.getLocal("t")),
                        [
                            ...c.drop(c.call(prefix + "_sub", mulBuff, c.getLocal("t"), c.getLocal("x"))),
                            ...c.setLocal("signx", c.i32_const(0))
                        ],
                        [
                            ...c.drop(c.call(prefix + "_sub", c.getLocal("t"), mulBuff, c.getLocal("x"))),
                            ...c.setLocal("signx", c.i32_const(1))
                        ],
                    ),
                    [
                        ...c.drop(c.call(prefix + "_add", mulBuff, c.getLocal("t"), c.getLocal("x"))),
                        ...c.setLocal("signx", c.i32_const(1))
                    ]
                ),
                c.if(
                    c.getLocal("signnewt"),
                    [
                        ...c.drop(c.call(prefix + "_add", mulBuff, c.getLocal("t"), c.getLocal("x"))),
                        ...c.setLocal("signx", c.i32_const(0))
                    ],
                    c.if (
                        c.call(prefix + "_gte", c.getLocal("t"), mulBuff),
                        [
                            ...c.drop(c.call(prefix + "_sub", c.getLocal("t"), mulBuff, c.getLocal("x"))),
                            ...c.setLocal("signx", c.i32_const(0))
                        ],
                        [
                            ...c.drop(c.call(prefix + "_sub", mulBuff, c.getLocal("t"), c.getLocal("x"))),
                            ...c.setLocal("signx", c.i32_const(1))
                        ]
                    )
                )
            ),

            c.setLocal("swp", c.getLocal("t")),
            c.setLocal("t", c.getLocal("newt")),
            c.setLocal("newt", c.getLocal("x")),
            c.setLocal("x", c.getLocal("swp")),

            c.setLocal("signt", c.getLocal("signnewt")),
            c.setLocal("signnewt", c.getLocal("signx")),

            c.setLocal("swp", c.getLocal("r")),
            c.setLocal("r", c.getLocal("newr")),
            c.setLocal("newr", c.getLocal("qr")),
            c.setLocal("qr", c.getLocal("swp")),

            c.br(0)
        )));

        f.addCode(c.if(
            c.getLocal("signt"),
            c.drop(c.call(prefix + "_sub", c.getLocal("pm"), c.getLocal("t"), c.getLocal("pr"))),
            c.call(prefix + "_copy", c.getLocal("t"), c.getLocal("pr"))
        ));
    }


    buildCopy();
    buildZero();
    buildIsZero();
    buildOne();
    buildEq();
    buildGte();
    buildAdd();
    buildSub();
    buildMul();
    buildSquare();
    buildSquareOld();
    buildDiv();
    buildInverseMod();
    module.exportFunction(prefix+"_copy");
    module.exportFunction(prefix+"_zero");
    module.exportFunction(prefix+"_one");
    module.exportFunction(prefix+"_isZero");
    module.exportFunction(prefix+"_eq");
    module.exportFunction(prefix+"_gte");
    module.exportFunction(prefix+"_add");
    module.exportFunction(prefix+"_sub");
    module.exportFunction(prefix+"_mul");
    module.exportFunction(prefix+"_square");
    module.exportFunction(prefix+"_squareOld");
    module.exportFunction(prefix+"_div");
    module.exportFunction(prefix+"_inverseMod");

    return prefix;
};

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

var build_timesscalar = function buildTimesScalar(module, fnName, elementLen, opAB, opAA, opCopy, opInit) {

    const f = module.addFunction(fnName);
    f.addParam("base", "i32");
    f.addParam("scalar", "i32");
    f.addParam("scalarLength", "i32");
    f.addParam("r", "i32");
    f.addLocal("i", "i32");
    f.addLocal("b", "i32");

    const c = f.getCodeBuilder();

    const aux = c.i32_const(module.alloc(elementLen));

    f.addCode(
        c.if(
            c.i32_eqz(c.getLocal("scalarLength")),
            [
                ...c.call(opInit, c.getLocal("r")),
                ...c.ret([])
            ]
        )
    );
    f.addCode(c.call(opCopy, c.getLocal("base"), aux));
    f.addCode(c.call(opInit, c.getLocal("r")));
    f.addCode(c.setLocal("i", c.getLocal("scalarLength")));
    f.addCode(c.block(c.loop(
        c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),

        c.setLocal(
            "b",
            c.i32_load8_u(
                c.i32_add(
                    c.getLocal("scalar"),
                    c.getLocal("i")
                )
            )
        ),
        ...innerLoop(),
        c.br_if(1, c.i32_eqz ( c.getLocal("i") )),
        c.br(0)
    )));


    function innerLoop() {
        const code = [];
        for (let i=0; i<8; i++) {
            code.push(
                ...c.call(opAA, c.getLocal("r"), c.getLocal("r")),
                ...c.if(
                    c.i32_ge_u( c.getLocal("b"), c.i32_const(0x80 >> i)),
                    [
                        ...c.setLocal(
                            "b",
                            c.i32_sub(
                                c.getLocal("b"),
                                c.i32_const(0x80 >> i)
                            )
                        ),
                        ...c.call(opAB, c.getLocal("r"),aux, c.getLocal("r"))
                    ]
                )
            );
        }
        return code;
    }

};

var build_batchinverse = buildBatchInverse$3;

function buildBatchInverse$3(module, prefix) {


    const n8 = module.modules[prefix].n64*8;

    const f = module.addFunction(prefix+"_batchInverse");
    f.addParam("pIn", "i32");
    f.addParam("inStep", "i32");
    f.addParam("n", "i32");
    f.addParam("pOut", "i32");
    f.addParam("outStep", "i32");
    f.addLocal("itAux", "i32");
    f.addLocal("itIn", "i32");
    f.addLocal("itOut","i32");
    f.addLocal("i","i32");

    const c = f.getCodeBuilder();

    const AUX = c.i32_const(module.alloc(n8));


    // Alloc Working space for accumulated umltiplications
    f.addCode(
        c.setLocal("itAux", c.i32_load( c.i32_const(0) )),
        c.i32_store(
            c.i32_const(0),
            c.i32_add(
                c.getLocal("itAux"),
                c.i32_mul(
                    c.i32_add(
                        c.getLocal("n"),
                        c.i32_const(1)
                    ),
                    c.i32_const(n8)
                )
            )
        )
    );

    f.addCode(

        // aux[0] = a;
        c.call(prefix+"_one", c.getLocal("itAux")),
        // for (i=0;i<n;i++) aux[i] = aux[i-1]*in[i]
        c.setLocal("itIn", c.getLocal("pIn")),
        c.setLocal("itAux", c.i32_add(c.getLocal("itAux"), c.i32_const(n8))),
        c.setLocal("i", c.i32_const(0)),

        c.block(c.loop(
            c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),
            c.if(
                c.call(prefix+"_isZero", c.getLocal("itIn")),
                c.call(
                    prefix + "_copy",
                    c.i32_sub(c.getLocal("itAux"), c.i32_const(n8)),
                    c.getLocal("itAux")
                ),
                c.call(
                    prefix+"_mul",
                    c.getLocal("itIn"),
                    c.i32_sub(c.getLocal("itAux"), c.i32_const(n8)),
                    c.getLocal("itAux")
                )
            ),
            c.setLocal("itIn", c.i32_add(c.getLocal("itIn"), c.getLocal("inStep"))),
            c.setLocal("itAux", c.i32_add(c.getLocal("itAux"), c.i32_const(n8))),
            c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
            c.br(0)
        )),

        // point to the last
        c.setLocal("itIn", c.i32_sub(c.getLocal("itIn"), c.getLocal("inStep"))),
        c.setLocal("itAux", c.i32_sub(c.getLocal("itAux"), c.i32_const(n8))),
        // itOut = pOut + (n-1)*stepOut   // Point to the last
        c.setLocal(
            "itOut",
            c.i32_add(
                c.getLocal("pOut"),
                c.i32_mul(
                    c.i32_sub(c.getLocal("n"), c.i32_const(1)),
                    c.getLocal("outStep"),
                )
            )
        ),

        // aux[n-1] = 1/aux[n-1]
        c.call(prefix+"_inverse", c.getLocal("itAux"), c.getLocal("itAux") ),

        c.block(c.loop(
            c.br_if(1, c.i32_eqz( c.getLocal("i"))),
            c.if(
                c.call(prefix+"_isZero", c.getLocal("itIn")),
                [
                    ...c.call(
                        prefix + "_copy",
                        c.getLocal("itAux"),
                        c.i32_sub(c.getLocal("itAux"), c.i32_const(n8)),
                    ),
                    ...c.call(
                        prefix + "_zero",
                        c.getLocal("itOut")
                    )
                ],[
                    ...c.call(prefix + "_copy", c.i32_sub(c.getLocal("itAux"), c.i32_const(n8)), AUX),
                    ...c.call(
                        prefix+"_mul",
                        c.getLocal("itAux"),
                        c.getLocal("itIn"),
                        c.i32_sub(c.getLocal("itAux"), c.i32_const(n8)),
                    ),
                    ...c.call(
                        prefix+"_mul",
                        c.getLocal("itAux"),
                        AUX,
                        c.getLocal("itOut")
                    )
                ]
            ),
            c.setLocal("itIn", c.i32_sub(c.getLocal("itIn"), c.getLocal("inStep"))),
            c.setLocal("itOut", c.i32_sub(c.getLocal("itOut"), c.getLocal("outStep"))),
            c.setLocal("itAux", c.i32_sub(c.getLocal("itAux"), c.i32_const(n8))),
            c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
            c.br(0)
        ))

    );


    // Recover Old memory
    f.addCode(
        c.i32_store(
            c.i32_const(0),
            c.getLocal("itAux")
        )
    );

}

var build_batchconvertion = buildBatchConvertion$3;

function buildBatchConvertion$3(module, fnName, internalFnName, sizeIn, sizeOut, reverse) {
    if (typeof reverse === "undefined") {
        // Set the reverse in a way that allows to use the same buffer as in/out.
        if (sizeIn < sizeOut) {
            reverse = true;
        } else {
            reverse = false;
        }
    }

    const f = module.addFunction(fnName);
    f.addParam("pIn", "i32");
    f.addParam("n", "i32");
    f.addParam("pOut", "i32");
    f.addLocal("i", "i32");
    f.addLocal("itIn", "i32");
    f.addLocal("itOut", "i32");

    const c = f.getCodeBuilder();

    if (reverse) {
        f.addCode(
            c.setLocal("itIn",
                c.i32_add(
                    c.getLocal("pIn"),
                    c.i32_mul(
                        c.i32_sub(
                            c.getLocal("n"),
                            c.i32_const(1)
                        ),
                        c.i32_const(sizeIn)
                    )
                )
            ),
            c.setLocal("itOut",
                c.i32_add(
                    c.getLocal("pOut"),
                    c.i32_mul(
                        c.i32_sub(
                            c.getLocal("n"),
                            c.i32_const(1)
                        ),
                        c.i32_const(sizeOut)
                    )
                )
            ),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),

                c.call(internalFnName, c.getLocal("itIn"), c.getLocal("itOut")),

                c.setLocal("itIn", c.i32_sub(c.getLocal("itIn"), c.i32_const(sizeIn))),
                c.setLocal("itOut", c.i32_sub(c.getLocal("itOut"), c.i32_const(sizeOut))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),
        );
    } else {
        f.addCode(
            c.setLocal("itIn", c.getLocal("pIn")),
            c.setLocal("itOut", c.getLocal("pOut")),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),

                c.call(internalFnName, c.getLocal("itIn"), c.getLocal("itOut")),

                c.setLocal("itIn", c.i32_add(c.getLocal("itIn"), c.i32_const(sizeIn))),
                c.setLocal("itOut", c.i32_add(c.getLocal("itOut"), c.i32_const(sizeOut))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),
        );
    }
}

var build_batchop = buildBatchConvertion$2;

function buildBatchConvertion$2(module, fnName, internalFnName, sizeIn, sizeOut, reverse) {
    if (typeof reverse === "undefined") {
        // Set the reverse in a way that allows to use the same buffer as in/out.
        if (sizeIn < sizeOut) {
            reverse = true;
        } else {
            reverse = false;
        }
    }

    const f = module.addFunction(fnName);
    f.addParam("pIn1", "i32");
    f.addParam("pIn2", "i32");
    f.addParam("n", "i32");
    f.addParam("pOut", "i32");
    f.addLocal("i", "i32");
    f.addLocal("itIn1", "i32");
    f.addLocal("itIn2", "i32");
    f.addLocal("itOut", "i32");

    const c = f.getCodeBuilder();

    if (reverse) {
        f.addCode(
            c.setLocal("itIn1",
                c.i32_add(
                    c.getLocal("pIn1"),
                    c.i32_mul(
                        c.i32_sub(
                            c.getLocal("n"),
                            c.i32_const(1)
                        ),
                        c.i32_const(sizeIn)
                    )
                )
            ),
            c.setLocal("itIn2",
                c.i32_add(
                    c.getLocal("pIn2"),
                    c.i32_mul(
                        c.i32_sub(
                            c.getLocal("n"),
                            c.i32_const(1)
                        ),
                        c.i32_const(sizeIn)
                    )
                )
            ),
            c.setLocal("itOut",
                c.i32_add(
                    c.getLocal("pOut"),
                    c.i32_mul(
                        c.i32_sub(
                            c.getLocal("n"),
                            c.i32_const(1)
                        ),
                        c.i32_const(sizeOut)
                    )
                )
            ),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),

                c.call(internalFnName, c.getLocal("itIn1"), c.getLocal("itIn2"), c.getLocal("itOut")),

                c.setLocal("itIn1", c.i32_sub(c.getLocal("itIn1"), c.i32_const(sizeIn))),
                c.setLocal("itIn2", c.i32_sub(c.getLocal("itIn2"), c.i32_const(sizeIn))),
                c.setLocal("itOut", c.i32_sub(c.getLocal("itOut"), c.i32_const(sizeOut))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),
        );
    } else {
        f.addCode(
            c.setLocal("itIn1", c.getLocal("pIn1")),
            c.setLocal("itIn2", c.getLocal("pIn2")),
            c.setLocal("itOut", c.getLocal("pOut")),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),

                c.call(internalFnName, c.getLocal("itIn1"), c.getLocal("itIn2"), c.getLocal("itOut")),

                c.setLocal("itIn1", c.i32_add(c.getLocal("itIn1"), c.i32_const(sizeIn))),
                c.setLocal("itIn2", c.i32_add(c.getLocal("itIn2"), c.i32_const(sizeIn))),
                c.setLocal("itOut", c.i32_add(c.getLocal("itOut"), c.i32_const(sizeOut))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),
        );
    }
}

var bigint = {};

// Many of these utilities are from the `big-integer` library,
// but adjusted to only work with native BigInt type
// Ref https://github.com/peterolson/BigInteger.js/blob/e5d2154d3c417069c51e7116bafc3b91d0b9fe41/BigInteger.js
// Originally licensed The Unlicense

function compare(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}

function square$1(n) {
    return n * n;
}

function isOdd$4(n) {
    return n % 2n !== 0n;
}

function isEven(n) {
    return n % 2n === 0n;
}

function isNegative$2(n) {
    return n < 0n;
}

function isPositive(n) {
    return n > 0n;
}

function bitLength$4(n) {
    if (isNegative$2(n)) {
        return n.toString(2).length - 1; // discard the - sign
    } else {
        return n.toString(2).length;
    }
}

function abs(n) {
    return n < 0n ? -n : n;
}

function isUnit(n) {
    return abs(n) === 1n;
}

function modInv$3(a, n) {
    var t = 0n, newT = 1n, r = n, newR = abs(a), q, lastT, lastR;
    while (newR !== 0n) {
        q = r / newR;
        lastT = t;
        lastR = r;
        t = newT;
        r = newR;
        newT = lastT - (q * newT);
        newR = lastR - (q * newR);
    }
    if (!isUnit(r)) throw new Error(a.toString() + " and " + n.toString() + " are not co-prime");
    if (compare(t, 0n) === -1) {
        t = t + n;
    }
    if (isNegative$2(a)) {
        return -t;
    }
    return t;
}

function modPow$2(n, exp, mod) {
    if (mod === 0n) throw new Error("Cannot take modPow with modulus 0");
    var r = 1n,
        base = n % mod;
    if (isNegative$2(exp)) {
        exp = exp * -1n;
        base = modInv$3(base, mod);
    }
    while (isPositive(exp)) {
        if (base === 0n) return 0n;
        if (isOdd$4(exp)) r = r * base % mod;
        exp = exp / 2n;
        base = square$1(base) % mod;
    }
    return r;
}

function compareAbs(a, b) {
    a = a >= 0n ? a : -a;
    b = b >= 0n ? b : -b;
    return a === b ? 0 : a > b ? 1 : -1;
}

function isDivisibleBy(a, n) {
    if (n === 0n) return false;
    if (isUnit(n)) return true;
    if (compareAbs(n, 2n) === 0) return isEven(a);
    return a % n === 0n;
}

function isBasicPrime(v) {
    var n = abs(v);
    if (isUnit(n)) return false;
    if (n === 2n || n === 3n || n === 5n) return true;
    if (isEven(n) || isDivisibleBy(n, 3n) || isDivisibleBy(n, 5n)) return false;
    if (n < 49n) return true;
    // we don't know if it's prime: let the other functions figure it out
}

function prev(n) {
    return n - 1n;
}

function isKnownPrime(v) {
    let n = abs(v);
    switch (n) {
        case 21888242871839275222246405745257275088696311157297823662689037894645226208583n:
        case 21888242871839275222246405745257275088548364400416034343698204186575808495617n:
        case 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn:
        case 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n:
        case 41898490967918953402344214791240637128170709919953949071783502921025352812571106773058893763790338921418070971888458477323173057491593855069696241854796396165721416325350064441470418137846398469611935719059908164220784476160001n:
            return true;
    }
    return false;
}

function millerRabinTest(n, a) {
    var nPrev = prev(n),
        b = nPrev,
        r = 0,
        d, i, x;
    while (isEven(b)) b = b / 2n, r++;
    next: for (i = 0; i < a.length; i++) {
        if (n < a[i]) continue;
        x = modPow$2(BigInt(a[i]), b, n);
        if (isUnit(x) || x === nPrev) continue;
        for (d = r - 1; d != 0; d--) {
            x = square$1(x) % n;
            if (isUnit(x)) return false;
            if (x === nPrev) continue next;
        }
        return false;
    }
    return true;
}

function isPrime$1(p) {
    let isPrime;
    isPrime = isKnownPrime(p);
    if (isPrime !== undefined) return isPrime;
    isPrime = isBasicPrime(p);
    if (isPrime !== undefined) return isPrime;
    var n = abs(p);
    var bits = bitLength$4(n);
    if (bits <= 64)
        return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
    var logN = Math.log(2) * Number(bits);
    var t = Math.ceil(logN);
    for (var a = [], i = 0; i < t; i++) {
        a.push(BigInt(i + 2));
    }
    return millerRabinTest(n, a);
}

bigint.bitLength = bitLength$4;
bigint.isOdd = isOdd$4;
bigint.isNegative = isNegative$2;
bigint.abs = abs;
bigint.isUnit = isUnit;
bigint.compare = compare;
bigint.modInv = modInv$3;
bigint.modPow = modPow$2;
bigint.isPrime = isPrime$1;
bigint.square = square$1;

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

const buildInt = build_int;
const utils$4 = utils$5;
const buildExp$2 = build_timesscalar;
const buildBatchInverse$2 = build_batchinverse;
const buildBatchConvertion$1 = build_batchconvertion;
const buildBatchOp = build_batchop;
const { bitLength: bitLength$3, modInv: modInv$2, modPow: modPow$1, isPrime, isOdd: isOdd$3, square } = bigint;

var build_f1m = function buildF1m(module, _q, _prefix, _intPrefix) {
    const q = BigInt(_q);
    const n64 = Math.floor((bitLength$3(q - 1n) - 1)/64) +1;
    const n32 = n64*2;
    const n8 = n64*8;

    const prefix = _prefix || "f1m";
    if (module.modules[prefix]) return prefix;  // already builded

    const intPrefix = buildInt(module, n64, _intPrefix);
    const pq = module.alloc(n8, utils$4.bigInt2BytesLE(q, n8));

    const pR2 = module.alloc(utils$4.bigInt2BytesLE(square(1n << BigInt(n64*64)) % q, n8));
    const pOne = module.alloc(utils$4.bigInt2BytesLE((1n << BigInt(n64*64)) % q, n8));
    const pZero = module.alloc(utils$4.bigInt2BytesLE(0n, n8));
    const _minusOne = q - 1n;
    const _e = _minusOne >> 1n; // e = (p-1)/2
    const pe = module.alloc(n8, utils$4.bigInt2BytesLE(_e, n8));

    const _ePlusOne = _e + 1n; // e = (p-1)/2
    const pePlusOne = module.alloc(n8, utils$4.bigInt2BytesLE(_ePlusOne, n8));

    module.modules[prefix] = {
        pq: pq,
        pR2: pR2,
        n64: n64,
        q: q,
        pOne: pOne,
        pZero: pZero,
        pePlusOne: pePlusOne
    };

    function buildOne() {
        const f = module.addFunction(prefix+"_one");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(intPrefix + "_copy", c.i32_const(pOne), c.getLocal("pr")));
    }

    function buildAdd() {
        const f = module.addFunction(prefix+"_add");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.if(
                c.call(intPrefix+"_add", c.getLocal("x"),  c.getLocal("y"), c.getLocal("r")),
                c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                c.if(
                    c.call(intPrefix+"_gte", c.getLocal("r"), c.i32_const(pq)  ),
                    c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                )
            )
        );
    }

    function buildSub() {
        const f = module.addFunction(prefix+"_sub");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.if(
                c.call(intPrefix+"_sub", c.getLocal("x"),  c.getLocal("y"), c.getLocal("r")),
                c.drop(c.call(intPrefix+"_add", c.getLocal("r"),  c.i32_const(pq), c.getLocal("r")))
            )
        );
    }

    function buildNeg() {
        const f = module.addFunction(prefix+"_neg");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(prefix + "_sub", c.i32_const(pZero), c.getLocal("x"), c.getLocal("r"))
        );
    }


    function buildIsNegative() {
        const f = module.addFunction(prefix+"_isNegative");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8));

        f.addCode(
            c.call(prefix + "_fromMontgomery", c.getLocal("x"), AUX),
            c.call(intPrefix + "_gte", AUX, c.i32_const(pePlusOne) )
        );
    }

    function buildSign() {
        const f = module.addFunction(prefix+"_sign");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if (
                c.call(intPrefix + "_isZero", c.getLocal("x")),
                c.ret(c.i32_const(0))
            ),
            c.call(prefix + "_fromMontgomery", c.getLocal("x"), AUX),
            c.if(
                c.call(intPrefix + "_gte", AUX, c.i32_const(pePlusOne)),
                c.ret(c.i32_const(-1))
            ),
            c.ret(c.i32_const(1))
        );
    }


    function buildMReduct() {
        const carries = module.alloc(n32*n32*8);

        const f = module.addFunction(prefix+"_mReduct");
        f.addParam("t", "i32");
        f.addParam("r", "i32");
        f.addLocal("np32", "i64");
        f.addLocal("c", "i64");
        f.addLocal("m", "i64");

        const c = f.getCodeBuilder();

        const np32 = Number(0x100000000n - modInv$2(q, 0x100000000n));

        f.addCode(c.setLocal("np32", c.i64_const(np32)));

        for (let i=0; i<n32; i++) {
            f.addCode(c.setLocal("c", c.i64_const(0)));

            f.addCode(
                c.setLocal(
                    "m",
                    c.i64_and(
                        c.i64_mul(
                            c.i64_load32_u(c.getLocal("t"), i*4),
                            c.getLocal("np32")
                        ),
                        c.i64_const("0xFFFFFFFF")
                    )
                )
            );

            for (let j=0; j<n32; j++) {

                f.addCode(
                    c.setLocal("c",
                        c.i64_add(
                            c.i64_add(
                                c.i64_load32_u(c.getLocal("t"), (i+j)*4),
                                c.i64_shr_u(c.getLocal("c"), c.i64_const(32))
                            ),
                            c.i64_mul(
                                c.i64_load32_u(c.i32_const(pq), j*4),
                                c.getLocal("m")
                            )
                        )
                    )
                );

                f.addCode(
                    c.i64_store32(
                        c.getLocal("t"),
                        (i+j)*4,
                        c.getLocal("c")
                    )
                );
            }

            f.addCode(
                c.i64_store32(
                    c.i32_const(carries),
                    i*4,
                    c.i64_shr_u(c.getLocal("c"), c.i64_const(32))
                )
            );
        }

        f.addCode(
            c.call(
                prefix+"_add",
                c.i32_const(carries),
                c.i32_add(
                    c.getLocal("t"),
                    c.i32_const(n32*4)
                ),
                c.getLocal("r")
            )
        );
    }



    function buildMul() {

        // Montgomery multiplication, CIOS (coarsely integrated operand
        // scanning): for each y-limb, one multiply-accumulate pass over the
        // x-limbs followed by one reduction pass, all in i64 locals with a
        // single running carry. Replaces the previous product-scanning form
        // (dual c0/c1 accumulators): same 32-bit limbs, same R = 2^(32*n32),
        // bit-identical results, ~20% faster (shorter dependency chain per
        // product and q-limbs as immediates instead of loads).
        const f = module.addFunction(prefix+"_mul");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");
        f.addLocal("yi", "i64");
        f.addLocal("m", "i64");
        f.addLocal("cc", "i64");
        f.addLocal("s", "i64");

        for (let i=0;i<n32; i++) f.addLocal("x"+i, "i64");
        for (let j=0;j<=n32+1; j++) f.addLocal("t"+j, "i64");

        const c = f.getCodeBuilder();

        const np32 = Number(0x100000000n - modInv$2(q, 0x100000000n));
        const qLimbs = [];
        for (let j=0; j<n32; j++) qLimbs.push(Number((q >> BigInt(32*j)) & 0xFFFFFFFFn));
        const MASK32 = 0xFFFFFFFF;

        // x limbs are reused n32 times: load them once into locals
        for (let i=0;i<n32; i++) {
            f.addCode(c.setLocal("x"+i, c.i64_load32_u(c.getLocal("x"), i*4)));
        }

        for (let i=0;i<n32; i++) {
            f.addCode(c.setLocal("yi", c.i64_load32_u(c.getLocal("y"), i*4)));

            // t += x * y_i   (t_j and carry stay < 2^32, so each step fits i64)
            f.addCode(
                c.setLocal("s", c.i64_add(
                    c.getLocal("t0"),
                    c.i64_mul(c.getLocal("x0"), c.getLocal("yi"))
                )),
                c.setLocal("t0", c.i64_and(c.getLocal("s"), c.i64_const(MASK32))),
                c.setLocal("cc", c.i64_shr_u(c.getLocal("s"), c.i64_const(32)))
            );
            for (let j=1;j<n32;j++) {
                f.addCode(
                    c.setLocal("s", c.i64_add(
                        c.i64_add(
                            c.getLocal("t"+j),
                            c.i64_mul(c.getLocal("x"+j), c.getLocal("yi"))
                        ),
                        c.getLocal("cc")
                    )),
                    c.setLocal("t"+j, c.i64_and(c.getLocal("s"), c.i64_const(MASK32))),
                    c.setLocal("cc", c.i64_shr_u(c.getLocal("s"), c.i64_const(32)))
                );
            }
            f.addCode(
                c.setLocal("s", c.i64_add(c.getLocal("t"+n32), c.getLocal("cc"))),
                c.setLocal("t"+n32, c.i64_and(c.getLocal("s"), c.i64_const(MASK32))),
                c.setLocal("t"+(n32+1), c.i64_add(
                    c.getLocal("t"+(n32+1)),
                    c.i64_shr_u(c.getLocal("s"), c.i64_const(32))
                ))
            );

            // m = t0 * (-q^-1 mod 2^32) mod 2^32; then t = (t + m*q) >> 32
            f.addCode(
                c.setLocal("m", c.i64_and(
                    c.i64_mul(c.getLocal("t0"), c.i64_const(np32)),
                    c.i64_const(MASK32)
                )),
                c.setLocal("s", c.i64_add(
                    c.getLocal("t0"),
                    c.i64_mul(c.getLocal("m"), c.i64_const(qLimbs[0]))
                )),
                c.setLocal("cc", c.i64_shr_u(c.getLocal("s"), c.i64_const(32)))
            );
            for (let j=1;j<n32;j++) {
                f.addCode(
                    c.setLocal("s", c.i64_add(
                        c.i64_add(
                            c.getLocal("t"+j),
                            c.i64_mul(c.getLocal("m"), c.i64_const(qLimbs[j]))
                        ),
                        c.getLocal("cc")
                    )),
                    c.setLocal("t"+(j-1), c.i64_and(c.getLocal("s"), c.i64_const(MASK32))),
                    c.setLocal("cc", c.i64_shr_u(c.getLocal("s"), c.i64_const(32)))
                );
            }
            f.addCode(
                c.setLocal("s", c.i64_add(c.getLocal("t"+n32), c.getLocal("cc"))),
                c.setLocal("t"+(n32-1), c.i64_and(c.getLocal("s"), c.i64_const(MASK32))),
                c.setLocal("t"+n32, c.i64_add(
                    c.getLocal("t"+(n32+1)),
                    c.i64_shr_u(c.getLocal("s"), c.i64_const(32))
                )),
                c.setLocal("t"+(n32+1), c.i64_const(0))
            );
        }

        for (let j=0;j<n32;j++) {
            f.addCode(c.i64_store32(c.getLocal("r"), j*4, c.getLocal("t"+j)));
        }

        // t < 2q is guaranteed, so a single conditional subtraction suffices
        // (t_n32 nonzero means the 2^(32*n32) bit is set -> definitely >= q).
        f.addCode(
            c.if(
                c.i32_wrap_i64(c.getLocal("t"+n32)),
                c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                c.if(
                    c.call(intPrefix+"_gte", c.getLocal("r"), c.i32_const(pq)  ),
                    c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                )
            )
        );
    }


    function buildSquare() {

        // Delegates to the CIOS Montgomery _mul. The previous dedicated
        // product-scanning square (doubled cross products, dual-carry column
        // accumulators) computed 22% fewer partial products but measured ~28%
        // SLOWER than mul(x,x) on the CIOS form (78.8 vs 61.6 ns) -- the
        // column-accumulator dependency chains cost more than the saved
        // multiplies. A dedicated CIOS square with the doubling trick would
        // save at most ~10% over mul(x,x); not worth the extra codegen.
        const f = module.addFunction(prefix+"_square");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(prefix + "_mul", c.getLocal("x"), c.getLocal("x"), c.getLocal("r")));
    }


    function buildSquareOld() {
        const f = module.addFunction(prefix+"_squareOld");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(prefix + "_mul", c.getLocal("x"), c.getLocal("x"), c.getLocal("r")));
    }

    function buildToMontgomery() {
        const f = module.addFunction(prefix+"_toMontgomery");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();
        f.addCode(c.call(prefix+"_mul", c.getLocal("x"), c.i32_const(pR2), c.getLocal("r")));
    }

    function buildFromMontgomery() {

        const pAux2 = module.alloc(n8*2);

        const f = module.addFunction(prefix+"_fromMontgomery");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();
        f.addCode(c.call(intPrefix + "_copy", c.getLocal("x"), c.i32_const(pAux2) ));
        f.addCode(c.call(intPrefix + "_zero", c.i32_const(pAux2 + n8) ));
        f.addCode(c.call(prefix+"_mReduct", c.i32_const(pAux2), c.getLocal("r")));
    }

    function buildInverse() {

        const f = module.addFunction(prefix+ "_inverse");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();
        f.addCode(c.call(prefix + "_fromMontgomery", c.getLocal("x"), c.getLocal("r")));
        f.addCode(c.call(intPrefix + "_inverseMod", c.getLocal("r"), c.i32_const(pq), c.getLocal("r")));
        f.addCode(c.call(prefix + "_toMontgomery", c.getLocal("r"), c.getLocal("r")));
    }

    // Calculate various valuse needed for sqrt


    let _nqr = 2n;
    if (isPrime(q)) {
        while (modPow$1(_nqr, _e, q) !== _minusOne) _nqr = _nqr + 1n;
    }

    let s2 = 0;
    let _t = _minusOne;

    while ((!isOdd$3(_t))&&(_t !== 0n)) {
        s2++;
        _t = _t >> 1n;
    }
    const pt = module.alloc(n8, utils$4.bigInt2BytesLE(_t, n8));

    const _nqrToT = modPow$1(_nqr, _t, q);
    const pNqrToT = module.alloc(utils$4.bigInt2BytesLE((_nqrToT << BigInt(n64*64)) % q, n8));

    const _tPlusOneOver2 = (_t + 1n) >> 1n;
    const ptPlusOneOver2 = module.alloc(n8, utils$4.bigInt2BytesLE(_tPlusOneOver2, n8));

    function buildSqrt() {

        const f = module.addFunction(prefix+ "_sqrt");
        f.addParam("n", "i32");
        f.addParam("r", "i32");
        f.addLocal("m", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");

        const c = f.getCodeBuilder();

        const ONE = c.i32_const(pOne);
        const C = c.i32_const(module.alloc(n8));
        const T = c.i32_const(module.alloc(n8));
        const R = c.i32_const(module.alloc(n8));
        const SQ = c.i32_const(module.alloc(n8));
        const B = c.i32_const(module.alloc(n8));

        f.addCode(

            // If (n==0) return 0
            c.if(
                c.call(prefix + "_isZero", c.getLocal("n")),
                c.ret(
                    c.call(prefix + "_zero", c.getLocal("r"))
                )
            ),

            c.setLocal("m", c.i32_const(s2)),
            c.call(prefix + "_copy", c.i32_const(pNqrToT), C),
            c.call(prefix + "_exp", c.getLocal("n"), c.i32_const(pt), c.i32_const(n8), T),
            c.call(prefix + "_exp", c.getLocal("n"), c.i32_const(ptPlusOneOver2), c.i32_const(n8), R),

            c.block(c.loop(
                c.br_if(1, c.call(prefix + "_eq", T, ONE)),

                c.call(prefix + "_square", T, SQ),
                c.setLocal("i", c.i32_const(1)),
                c.block(c.loop(
                    c.br_if(1, c.call(prefix + "_eq", SQ, ONE)),
                    c.call(prefix + "_square", SQ, SQ),
                    c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                    c.br(0)
                )),

                c.call(prefix + "_copy", C, B),
                c.setLocal("j", c.i32_sub(c.i32_sub( c.getLocal("m"), c.getLocal("i")), c.i32_const(1)) ),
                c.block(c.loop(
                    c.br_if(1, c.i32_eqz(c.getLocal("j"))),
                    c.call(prefix + "_square", B, B),
                    c.setLocal("j", c.i32_sub(c.getLocal("j"), c.i32_const(1))),
                    c.br(0)
                )),

                c.setLocal("m", c.getLocal("i")),
                c.call(prefix + "_square", B, C),
                c.call(prefix + "_mul", T, C, T),
                c.call(prefix + "_mul", R, B, R),

                c.br(0)
            )),

            c.if(
                c.call(prefix + "_isNegative", R),
                c.call(prefix + "_neg", R, c.getLocal("r")),
                c.call(prefix + "_copy", R, c.getLocal("r")),
            )
        );
    }

    function buildIsSquare() {
        const f = module.addFunction(prefix+"_isSquare");
        f.addParam("n", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const ONE = c.i32_const(pOne);
        const AUX = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("n")),
                c.ret(c.i32_const(1))
            ),
            c.call(prefix + "_exp", c.getLocal("n"), c.i32_const(pe), c.i32_const(n8), AUX),
            c.call(prefix + "_eq", AUX, ONE)
        );
    }


    function buildLoad() {
        const f = module.addFunction(prefix+"_load");
        f.addParam("scalar", "i32");
        f.addParam("scalarLen", "i32");
        f.addParam("r", "i32");
        f.addLocal("p", "i32");
        f.addLocal("l", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        const c = f.getCodeBuilder();

        const R = c.i32_const(module.alloc(n8));
        const pAux = module.alloc(n8);
        const AUX = c.i32_const(pAux);

        f.addCode(
            c.call(intPrefix + "_zero", c.getLocal("r")),
            c.setLocal("i", c.i32_const(n8)),
            c.setLocal("p", c.getLocal("scalar")),
            c.block(c.loop(
                c.br_if(1, c.i32_gt_u(c.getLocal("i"), c.getLocal("scalarLen"))),

                c.if(
                    c.i32_eq(c.getLocal("i"), c.i32_const(n8)),
                    c.call(prefix + "_one", R),
                    c.call(prefix + "_mul", R, c.i32_const(pR2), R)
                ),
                c.call(prefix + "_mul", c.getLocal("p"), R, AUX),
                c.call(prefix + "_add", c.getLocal("r"), AUX, c.getLocal("r")),

                c.setLocal("p", c.i32_add(c.getLocal("p"), c.i32_const(n8))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(n8))),
                c.br(0)
            )),

            c.setLocal("l", c.i32_rem_u( c.getLocal("scalarLen"), c.i32_const(n8))),
            c.if(c.i32_eqz(c.getLocal("l")), c.ret([])),
            c.call(intPrefix + "_zero", AUX),
            c.setLocal("j", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq(c.getLocal("j"), c.getLocal("l"))),

                c.i32_store8(
                    c.getLocal("j"),
                    pAux,
                    c.i32_load8_u(c.getLocal("p")),
                ),
                c.setLocal("p", c.i32_add(c.getLocal("p"), c.i32_const(1))),
                c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                c.br(0)
            )),

            c.if(
                c.i32_eq(c.getLocal("i"), c.i32_const(n8)),
                c.call(prefix + "_one", R),
                c.call(prefix + "_mul", R, c.i32_const(pR2), R)
            ),
            c.call(prefix + "_mul", AUX, R, AUX),
            c.call(prefix + "_add", c.getLocal("r"), AUX, c.getLocal("r")),
        );
    }

    function buildTimesScalar() {
        const f = module.addFunction(prefix+"_timesScalar");
        f.addParam("x", "i32");
        f.addParam("scalar", "i32");
        f.addParam("scalarLen", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8));

        f.addCode(
            c.call(prefix + "_load", c.getLocal("scalar"), c.getLocal("scalarLen"), AUX),
            c.call(prefix + "_toMontgomery", AUX, AUX),
            c.call(prefix + "_mul", c.getLocal("x"), AUX, c.getLocal("r")),
        );
    }

    function buildIsOne() {
        const f = module.addFunction(prefix+"_isOne");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();
        f.addCode(
            c.ret(c.call(intPrefix + "_eq", c.getLocal("x"), c.i32_const(pOne)))
        );
    }


    module.exportFunction(intPrefix + "_copy", prefix+"_copy");
    module.exportFunction(intPrefix + "_zero", prefix+"_zero");
    module.exportFunction(intPrefix + "_isZero", prefix+"_isZero");
    module.exportFunction(intPrefix + "_eq", prefix+"_eq");

    buildIsOne();
    buildAdd();
    buildSub();
    buildNeg();
    buildMReduct();
    buildMul();
    buildSquare();
    buildSquareOld();
    buildToMontgomery();
    buildFromMontgomery();
    buildIsNegative();
    buildSign();
    buildInverse();
    buildOne();
    buildLoad();
    buildTimesScalar();
    buildBatchInverse$2(module, prefix);
    buildBatchConvertion$1(module, prefix + "_batchToMontgomery", prefix + "_toMontgomery", n8, n8);
    buildBatchConvertion$1(module, prefix + "_batchFromMontgomery", prefix + "_fromMontgomery", n8, n8);
    buildBatchConvertion$1(module, prefix + "_batchNeg", prefix + "_neg", n8, n8);
    buildBatchOp(module, prefix + "_batchAdd", prefix + "_add", n8, n8);
    buildBatchOp(module, prefix + "_batchSub", prefix + "_sub", n8, n8);
    buildBatchOp(module, prefix + "_batchMul", prefix + "_mul", n8, n8);

    module.exportFunction(prefix + "_add");
    module.exportFunction(prefix + "_sub");
    module.exportFunction(prefix + "_neg");
    module.exportFunction(prefix + "_isNegative");
    module.exportFunction(prefix + "_isOne");
    module.exportFunction(prefix + "_sign");
    module.exportFunction(prefix + "_mReduct");
    module.exportFunction(prefix + "_mul");
    module.exportFunction(prefix + "_square");
    module.exportFunction(prefix + "_squareOld");
    module.exportFunction(prefix + "_fromMontgomery");
    module.exportFunction(prefix + "_toMontgomery");
    module.exportFunction(prefix + "_inverse");
    module.exportFunction(prefix + "_one");
    module.exportFunction(prefix + "_load");
    module.exportFunction(prefix + "_timesScalar");
    buildExp$2(
        module,
        prefix + "_exp",
        n8,
        prefix + "_mul",
        prefix + "_square",
        intPrefix + "_copy",
        prefix + "_one",
    );
    module.exportFunction(prefix + "_exp");
    module.exportFunction(prefix + "_batchInverse");
    if (isPrime(q)) {
        buildSqrt();
        buildIsSquare();
        module.exportFunction(prefix + "_sqrt");
        module.exportFunction(prefix + "_isSquare");
    }
    module.exportFunction(prefix + "_batchToMontgomery");
    module.exportFunction(prefix + "_batchFromMontgomery");
    // console.log(module.functionIdxByName);

    return prefix;
};

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

const buildF1m$2 =build_f1m;
const { bitLength: bitLength$2 } = bigint;

var build_f1 = function buildF1(module, _q, _prefix, _f1mPrefix, _intPrefix) {

    const q = BigInt(_q);
    const n64 = Math.floor((bitLength$2(q - 1n) - 1)/64) +1;
    const n8 = n64*8;

    const prefix = _prefix || "f1";
    if (module.modules[prefix]) return prefix;  // already builded
    module.modules[prefix] = {
        n64: n64
    };

    const intPrefix = _intPrefix || "int";
    const f1mPrefix = buildF1m$2(module, q, _f1mPrefix, intPrefix);


    const pR2 =     module.modules[f1mPrefix].pR2;
    const pq =     module.modules[f1mPrefix].pq;
    const pePlusOne = module.modules[f1mPrefix].pePlusOne;

    function buildMul() {
        const pAux1 = module.alloc(n8);

        const f = module.addFunction(prefix+ "_mul");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();
        f.addCode(c.call(f1mPrefix + "_mul", c.getLocal("x"), c.getLocal("y"), c.i32_const(pAux1)));
        f.addCode(c.call(f1mPrefix + "_mul", c.i32_const(pAux1), c.i32_const(pR2), c.getLocal("r")));
    }

    function buildSquare() {
        const f = module.addFunction(prefix+"_square");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(prefix + "_mul", c.getLocal("x"), c.getLocal("x"), c.getLocal("r")));
    }


    function buildInverse() {

        const f = module.addFunction(prefix+ "_inverse");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();
        f.addCode(c.call(intPrefix + "_inverseMod", c.getLocal("x"), c.i32_const(pq), c.getLocal("r")));
    }

    function buildIsNegative() {
        const f = module.addFunction(prefix+"_isNegative");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(intPrefix + "_gte", c.getLocal("x"), c.i32_const(pePlusOne) )
        );
    }


    buildMul();
    buildSquare();
    buildInverse();
    buildIsNegative();
    module.exportFunction(f1mPrefix + "_add", prefix + "_add");
    module.exportFunction(f1mPrefix + "_sub", prefix + "_sub");
    module.exportFunction(f1mPrefix + "_neg", prefix + "_neg");
    module.exportFunction(prefix + "_mul");
    module.exportFunction(prefix + "_square");
    module.exportFunction(prefix + "_inverse");
    module.exportFunction(prefix + "_isNegative");
    module.exportFunction(f1mPrefix + "_copy", prefix+"_copy");
    module.exportFunction(f1mPrefix + "_zero", prefix+"_zero");
    module.exportFunction(f1mPrefix + "_one", prefix+"_one");
    module.exportFunction(f1mPrefix + "_isZero", prefix+"_isZero");
    module.exportFunction(f1mPrefix + "_eq", prefix+"_eq");

    return prefix;
};

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

const buildExp$1 = build_timesscalar;
const buildBatchInverse$1 = build_batchinverse;
const utils$3 = utils$5;

var build_f2m = function buildF2m(module, mulNonResidueFn, prefix, f1mPrefix) {

    if (module.modules[prefix]) return prefix;  // already builded

    const f1n8 = module.modules[f1mPrefix].n64*8;
    const q = module.modules[f1mPrefix].q;

    module.modules[prefix] = {
        n64: module.modules[f1mPrefix].n64*2
    };

    function buildAdd() {
        const f = module.addFunction(prefix+"_add");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_add", x0, y0, r0),
            c.call(f1mPrefix+"_add", x1, y1, r1),
        );
    }

    function buildTimesScalar() {
        const f = module.addFunction(prefix+"_timesScalar");
        f.addParam("x", "i32");
        f.addParam("scalar", "i32");
        f.addParam("scalarLen", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_timesScalar", x0, c.getLocal("scalar"), c.getLocal("scalarLen"), r0),
            c.call(f1mPrefix+"_timesScalar", x1, c.getLocal("scalar"), c.getLocal("scalarLen"), r1),
        );
    }

    function buildSub() {
        const f = module.addFunction(prefix+"_sub");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_sub", x0, y0, r0),
            c.call(f1mPrefix+"_sub", x1, y1, r1),
        );
    }

    function buildNeg() {
        const f = module.addFunction(prefix+"_neg");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_neg", x0, r0),
            c.call(f1mPrefix+"_neg", x1, r1),
        );
    }

    function buildConjugate() {
        const f = module.addFunction(prefix+"_conjugate");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_copy", x0, r0),
            c.call(f1mPrefix+"_neg", x1, r1),
        );
    }


    function buildIsNegative() {
        const f = module.addFunction(prefix+"_isNegative");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));

        f.addCode(
            c.if(
                c.call(f1mPrefix+"_isZero", x1),
                c.ret(c.call(f1mPrefix+"_isNegative", x0))
            ),
            c.ret(c.call(f1mPrefix+"_isNegative", x1))
        );
    }

    function buildMul() {
        const f = module.addFunction(prefix+"_mul");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        const A = c.i32_const(module.alloc(f1n8));
        const B = c.i32_const(module.alloc(f1n8));
        const C = c.i32_const(module.alloc(f1n8));
        const D = c.i32_const(module.alloc(f1n8));


        f.addCode(
            c.call(f1mPrefix + "_mul", x0, y0, A),             // A = x0*y0
            c.call(f1mPrefix + "_mul", x1, y1, B),             // B = x1*y1

            c.call(f1mPrefix + "_add", x0, x1, C),             // C = x0 + x1
            c.call(f1mPrefix + "_add", y0, y1, D),             // D = y0 + y1
            c.call(f1mPrefix + "_mul", C, D, C),               // C = (x0 + x1)*(y0 + y1) = x0*y0+x0*y1+x1*y0+x1*y1

            //  c.call(f1mPrefix + "_mul", B, c.i32_const(pNonResidue), r0),  // r0 = nr*(x1*y1)
            c.call(mulNonResidueFn, B, r0),  // r0 = nr*(x1*y1)
            c.call(f1mPrefix + "_add", A, r0, r0),             // r0 = x0*y0 + nr*(x1*y1)
            c.call(f1mPrefix + "_add", A, B, r1),             // r1 = x0*y0+x1*y1
            c.call(f1mPrefix + "_sub", C, r1, r1)              // r1 = x0*y0+x0*y1+x1*y0+x1*y1 - x0*y0+x1*y1 = x0*y1+x1*y0
        );

    }

    function buildMul1() {
        const f = module.addFunction(prefix+"_mul1");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const y = c.getLocal("y");
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));


        f.addCode(
            c.call(f1mPrefix + "_mul", x0, y, r0),             // A = x0*y
            c.call(f1mPrefix + "_mul", x1, y, r1),             // B = x1*y
        );
    }

    function buildSquare() {
        const f = module.addFunction(prefix+"_square");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        const AB = c.i32_const(module.alloc(f1n8));
        const APB = c.i32_const(module.alloc(f1n8));
        const APNB = c.i32_const(module.alloc(f1n8));
        const ABPNAB = c.i32_const(module.alloc(f1n8));


        f.addCode(
            // AB = x0*y1
            c.call(f1mPrefix + "_mul", x0, x1, AB),

            // APB = x0+y1
            c.call(f1mPrefix + "_add", x0, x1, APB),

            // APBN0 = x0 + nr*x1
            c.call(mulNonResidueFn, x1, APNB),
            c.call(f1mPrefix + "_add", x0, APNB, APNB),

            // ABPNAB = ab + nr*ab
            c.call(mulNonResidueFn, AB, ABPNAB),
            c.call(f1mPrefix + "_add", ABPNAB, AB, ABPNAB),

            // r0 = APB * APNB - ABPNAB
            c.call(f1mPrefix + "_mul", APB, APNB, r0),
            c.call(f1mPrefix + "_sub", r0, ABPNAB, r0),

            // r1 = AB + AB
            c.call(f1mPrefix + "_add", AB, AB, r1),
        );

    }


    function buildToMontgomery() {
        const f = module.addFunction(prefix+"_toMontgomery");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_toMontgomery", x0, r0),
            c.call(f1mPrefix+"_toMontgomery", x1, r1)
        );
    }

    function buildFromMontgomery() {
        const f = module.addFunction(prefix+"_fromMontgomery");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_fromMontgomery", x0, r0),
            c.call(f1mPrefix+"_fromMontgomery", x1, r1)
        );
    }

    function buildCopy() {
        const f = module.addFunction(prefix+"_copy");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_copy", x0, r0),
            c.call(f1mPrefix+"_copy", x1, r1)
        );
    }

    function buildZero() {
        const f = module.addFunction(prefix+"_zero");
        f.addParam("x", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_zero", x0),
            c.call(f1mPrefix+"_zero", x1)
        );
    }

    function buildOne() {
        const f = module.addFunction(prefix+"_one");
        f.addParam("x", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_one", x0),
            c.call(f1mPrefix+"_zero", x1)
        );
    }

    function buildEq() {
        const f = module.addFunction(prefix+"_eq");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));

        f.addCode(
            c.i32_and(
                c.call(f1mPrefix+"_eq", x0, y0),
                c.call(f1mPrefix+"_eq", x1, y1)
            )
        );
    }

    function buildIsZero() {
        const f = module.addFunction(prefix+"_isZero");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));

        f.addCode(
            c.i32_and(
                c.call(f1mPrefix+"_isZero", x0),
                c.call(f1mPrefix+"_isZero", x1)
            )
        );
    }

    function buildInverse() {
        const f = module.addFunction(prefix+"_inverse");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));

        const t0 = c.i32_const(module.alloc(f1n8));
        const t1 = c.i32_const(module.alloc(f1n8));
        const t2 = c.i32_const(module.alloc(f1n8));
        const t3 = c.i32_const(module.alloc(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_square", x0, t0),
            c.call(f1mPrefix+"_square", x1, t1),
            // c.call(f1mPrefix+"_mul", t1, c.i32_const(pNonResidue), t2),
            c.call(mulNonResidueFn, t1, t2),

            c.call(f1mPrefix+"_sub", t0, t2, t2),
            c.call(f1mPrefix+"_inverse", t2, t3),

            c.call(f1mPrefix+"_mul", x0, t3, r0),
            c.call(f1mPrefix+"_mul", x1, t3, r1),
            c.call(f1mPrefix+"_neg", r1, r1),
        );
    }


    function buildSign() {
        const f = module.addFunction(prefix+"_sign");
        f.addParam("x", "i32");
        f.addLocal("s", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));

        f.addCode(
            c.setLocal("s" , c.call( f1mPrefix + "_sign", x1)),
            c.if(
                c.getLocal("s"),
                c.ret(c.getLocal("s"))
            ),
            c.ret(c.call( f1mPrefix + "_sign", x0))
        );
    }

    function buildIsOne() {
        const f = module.addFunction(prefix+"_isOne");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));

        f.addCode(
            c.ret(c.i32_and(
                c.call(f1mPrefix + "_isOne", x0),
                c.call(f1mPrefix + "_isZero", x1),
            ))
        );
    }


    // Check here: https://eprint.iacr.org/2012/685.pdf
    // Alg 9adj
    function buildSqrt() {

        const f = module.addFunction(prefix+"_sqrt");
        f.addParam("a", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        // BigInt can't take `undefined` so we use `|| 0`
        const e34 = c.i32_const(module.alloc(utils$3.bigInt2BytesLE((BigInt(q || 0) - 3n) / 4n, f1n8 )));
        // BigInt can't take `undefined` so we use `|| 0`
        const e12 = c.i32_const(module.alloc(utils$3.bigInt2BytesLE((BigInt(q || 0) - 1n) / 2n, f1n8 )));

        const a = c.getLocal("a");
        const a1 = c.i32_const(module.alloc(f1n8*2));
        const alpha = c.i32_const(module.alloc(f1n8*2));
        const a0 = c.i32_const(module.alloc(f1n8*2));
        const pn1 = module.alloc(f1n8*2);
        const n1 = c.i32_const(pn1);
        const n1a = c.i32_const(pn1);
        const n1b = c.i32_const(pn1+f1n8);
        const x0 = c.i32_const(module.alloc(f1n8*2));
        const b = c.i32_const(module.alloc(f1n8*2));

        f.addCode(

            c.call(prefix + "_one", n1),
            c.call(prefix + "_neg", n1, n1),

            // const a1 = F.pow(a, F.sqrt_e34);
            c.call(prefix + "_exp", a, e34, c.i32_const(f1n8), a1),

            // const a1 = F.pow(a, F.sqrt_e34);
            c.call(prefix + "_square", a1, alpha),
            c.call(prefix + "_mul", a, alpha, alpha),

            // const a0 = F.mul(F.frobenius(1, alfa), alfa);
            c.call(prefix + "_conjugate", alpha, a0),
            c.call(prefix + "_mul", a0, alpha, a0),

            // if (F.eq(a0, F.negone)) return null;
            c.if(c.call(prefix + "_eq",a0,n1), c.unreachable() ),

            // const x0 = F.mul(a1, a);
            c.call(prefix + "_mul", a1, a, x0),

            // if (F.eq(alfa, F.negone)) {
            c.if(
                c.call(prefix + "_eq", alpha, n1),
                [
                    // x = F.mul(x0, [F.F.zero, F.F.one]);
                    ...c.call(f1mPrefix + "_zero", n1a),
                    ...c.call(f1mPrefix + "_one", n1b),
                    ...c.call(prefix + "_mul", n1, x0, c.getLocal("pr")),
                ],
                [
                    // const b = F.pow(F.add(F.one, alfa), F.sqrt_e12);
                    ...c.call(prefix + "_one", b),
                    ...c.call(prefix + "_add", b, alpha, b),
                    ...c.call(prefix + "_exp", b, e12, c.i32_const(f1n8), b),

                    // x = F.mul(b, x0);
                    ...c.call(prefix + "_mul", b, x0, c.getLocal("pr")),
                ]
            )
        );

    }


    function buildIsSquare() {

        const f = module.addFunction(prefix+"_isSquare");
        f.addParam("a", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        // BigInt can't take `undefined` so we use `|| 0`
        const e34 = c.i32_const(module.alloc(utils$3.bigInt2BytesLE((BigInt(q || 0) - 3n) / 4n, f1n8 )));

        const a = c.getLocal("a");
        const a1 = c.i32_const(module.alloc(f1n8*2));
        const alpha = c.i32_const(module.alloc(f1n8*2));
        const a0 = c.i32_const(module.alloc(f1n8*2));
        const pn1 = module.alloc(f1n8*2);
        const n1 = c.i32_const(pn1);

        f.addCode(

            c.call(prefix + "_one", n1),
            c.call(prefix + "_neg", n1, n1),

            // const a1 = F.pow(a, F.sqrt_e34);
            c.call(prefix + "_exp", a, e34, c.i32_const(f1n8), a1),

            // const a1 = F.pow(a, F.sqrt_e34);
            c.call(prefix + "_square", a1, alpha),
            c.call(prefix + "_mul", a, alpha, alpha),

            // const a0 = F.mul(F.frobenius(1, alfa), alfa);
            c.call(prefix + "_conjugate", alpha, a0),
            c.call(prefix + "_mul", a0, alpha, a0),

            // if (F.eq(a0, F.negone)) return null;
            c.if(
                c.call(
                    prefix + "_eq",
                    a0,
                    n1
                ),
                c.ret(c.i32_const(0))
            ),
            c.ret(c.i32_const(1))
        );

    }


    buildIsZero();
    buildIsOne();
    buildZero();
    buildOne();
    buildCopy();
    buildMul();
    buildMul1();
    buildSquare();
    buildAdd();
    buildSub();
    buildNeg();
    buildConjugate();
    buildToMontgomery();
    buildFromMontgomery();
    buildEq();
    buildInverse();
    buildTimesScalar();
    buildSign();
    buildIsNegative();

    module.exportFunction(prefix + "_isZero");
    module.exportFunction(prefix + "_isOne");
    module.exportFunction(prefix + "_zero");
    module.exportFunction(prefix + "_one");
    module.exportFunction(prefix + "_copy");
    module.exportFunction(prefix + "_mul");
    module.exportFunction(prefix + "_mul1");
    module.exportFunction(prefix + "_square");
    module.exportFunction(prefix + "_add");
    module.exportFunction(prefix + "_sub");
    module.exportFunction(prefix + "_neg");
    module.exportFunction(prefix + "_sign");
    module.exportFunction(prefix + "_conjugate");
    module.exportFunction(prefix + "_fromMontgomery");
    module.exportFunction(prefix + "_toMontgomery");
    module.exportFunction(prefix + "_eq");
    module.exportFunction(prefix + "_inverse");
    buildBatchInverse$1(module, prefix);
    buildExp$1(
        module,
        prefix + "_exp",
        f1n8*2,
        prefix + "_mul",
        prefix + "_square",
        prefix + "_copy",
        prefix + "_one",
    );
    buildSqrt();
    buildIsSquare();

    module.exportFunction(prefix + "_exp");
    module.exportFunction(prefix + "_timesScalar");
    module.exportFunction(prefix + "_batchInverse");
    module.exportFunction(prefix + "_sqrt");
    module.exportFunction(prefix + "_isSquare");
    module.exportFunction(prefix + "_isNegative");


    return prefix;
};

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

const buildExp = build_timesscalar;
const buildBatchInverse = build_batchinverse;

var build_f3m = function buildF3m(module, mulNonResidueFn, prefix, f1mPrefix) {

    if (module.modules[prefix]) return prefix;  // already builded

    const f1n8 = module.modules[f1mPrefix].n64*8;
    module.modules[prefix] = {
        n64: module.modules[f1mPrefix].n64*3
    };

    function buildAdd() {
        const f = module.addFunction(prefix+"_add");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));
        const y2 = c.i32_add(c.getLocal("y"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_add", x0, y0, r0),
            c.call(f1mPrefix+"_add", x1, y1, r1),
            c.call(f1mPrefix+"_add", x2, y2, r2),
        );
    }

    function buildTimesScalar() {
        const f = module.addFunction(prefix+"_timesScalar");
        f.addParam("x", "i32");
        f.addParam("scalar", "i32");
        f.addParam("scalarLen", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_timesScalar", x0, c.getLocal("scalar"), c.getLocal("scalarLen"), r0),
            c.call(f1mPrefix+"_timesScalar", x1, c.getLocal("scalar"), c.getLocal("scalarLen"), r1),
            c.call(f1mPrefix+"_timesScalar", x2, c.getLocal("scalar"), c.getLocal("scalarLen"), r2),
        );
    }


    function buildSub() {
        const f = module.addFunction(prefix+"_sub");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));
        const y2 = c.i32_add(c.getLocal("y"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_sub", x0, y0, r0),
            c.call(f1mPrefix+"_sub", x1, y1, r1),
            c.call(f1mPrefix+"_sub", x2, y2, r2),
        );
    }

    function buildNeg() {
        const f = module.addFunction(prefix+"_neg");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_neg", x0, r0),
            c.call(f1mPrefix+"_neg", x1, r1),
            c.call(f1mPrefix+"_neg", x2, r2),
        );
    }

    function buildIsNegative() {
        const f = module.addFunction(prefix+"_isNegative");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));

        f.addCode(
            c.if(
                c.call(f1mPrefix+"_isZero", x2),
                c.if(
                    c.call(f1mPrefix+"_isZero", x1),
                    c.ret(c.call(f1mPrefix+"_isNegative", x0)),
                    c.ret(c.call(f1mPrefix+"_isNegative", x1))
                )
            ),
            c.ret(c.call(f1mPrefix+"_isNegative", x2))
        );
    }


    function buildMul() {
        const f = module.addFunction(prefix+"_mul");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");

        const cd = f.getCodeBuilder();

        const a = cd.getLocal("x");
        const b = cd.i32_add(cd.getLocal("x"), cd.i32_const(f1n8));
        const c = cd.i32_add(cd.getLocal("x"), cd.i32_const(2*f1n8));
        const A = cd.getLocal("y");
        const B = cd.i32_add(cd.getLocal("y"), cd.i32_const(f1n8));
        const C = cd.i32_add(cd.getLocal("y"), cd.i32_const(2*f1n8));
        const r0 = cd.getLocal("r");
        const r1 = cd.i32_add(cd.getLocal("r"), cd.i32_const(f1n8));
        const r2 = cd.i32_add(cd.getLocal("r"), cd.i32_const(2*f1n8));

        const aA = cd.i32_const(module.alloc(f1n8));
        const bB = cd.i32_const(module.alloc(f1n8));
        const cC = cd.i32_const(module.alloc(f1n8));
        const a_b = cd.i32_const(module.alloc(f1n8));
        const A_B = cd.i32_const(module.alloc(f1n8));
        const a_c = cd.i32_const(module.alloc(f1n8));
        const A_C = cd.i32_const(module.alloc(f1n8));
        const b_c = cd.i32_const(module.alloc(f1n8));
        const B_C = cd.i32_const(module.alloc(f1n8));
        const aA_bB = cd.i32_const(module.alloc(f1n8));
        const aA_cC = cd.i32_const(module.alloc(f1n8));
        const bB_cC = cd.i32_const(module.alloc(f1n8));
        const AUX = cd.i32_const(module.alloc(f1n8));


        f.addCode(
            cd.call(f1mPrefix + "_mul", a, A, aA),
            cd.call(f1mPrefix + "_mul", b, B, bB),
            cd.call(f1mPrefix + "_mul", c, C, cC),

            cd.call(f1mPrefix + "_add", a, b, a_b),
            cd.call(f1mPrefix + "_add", A, B, A_B),
            cd.call(f1mPrefix + "_add", a, c, a_c),
            cd.call(f1mPrefix + "_add", A, C, A_C),
            cd.call(f1mPrefix + "_add", b, c, b_c),
            cd.call(f1mPrefix + "_add", B, C, B_C),

            cd.call(f1mPrefix + "_add", aA, bB, aA_bB),
            cd.call(f1mPrefix + "_add", aA, cC, aA_cC),
            cd.call(f1mPrefix + "_add", bB, cC, bB_cC),

            cd.call(f1mPrefix + "_mul", b_c, B_C, r0),
            cd.call(f1mPrefix + "_sub", r0, bB_cC, r0),
            cd.call(mulNonResidueFn, r0, r0),
            cd.call(f1mPrefix + "_add", aA, r0, r0),

            cd.call(f1mPrefix + "_mul", a_b, A_B, r1),
            cd.call(f1mPrefix + "_sub", r1, aA_bB, r1),
            cd.call(mulNonResidueFn, cC, AUX),
            cd.call(f1mPrefix + "_add", r1, AUX, r1),

            cd.call(f1mPrefix + "_mul", a_c, A_C, r2),
            cd.call(f1mPrefix + "_sub", r2, aA_cC, r2),
            cd.call(f1mPrefix + "_add", r2, bB, r2),
        );

    }

    function buildSquare() {
        const f = module.addFunction(prefix+"_square");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const A = c.getLocal("x");
        const B = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const C = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        const s0 = c.i32_const(module.alloc(f1n8));
        const ab = c.i32_const(module.alloc(f1n8));
        const s1 = c.i32_const(module.alloc(f1n8));
        const s2 = c.i32_const(module.alloc(f1n8));
        const bc = c.i32_const(module.alloc(f1n8));
        const s3 = c.i32_const(module.alloc(f1n8));
        const s4 = c.i32_const(module.alloc(f1n8));


        f.addCode(

            c.call(f1mPrefix + "_square", A, s0),
            c.call(f1mPrefix + "_mul", A, B, ab),
            c.call(f1mPrefix + "_add", ab, ab, s1),

            c.call(f1mPrefix + "_sub", A, B, s2),
            c.call(f1mPrefix + "_add", s2, C, s2),
            c.call(f1mPrefix + "_square", s2, s2),

            c.call(f1mPrefix + "_mul", B, C, bc),
            c.call(f1mPrefix + "_add", bc, bc, s3),

            c.call(f1mPrefix + "_square", C, s4),

            c.call(mulNonResidueFn, s3, r0),
            c.call(f1mPrefix + "_add", s0, r0, r0),

            c.call(mulNonResidueFn, s4, r1),
            c.call(f1mPrefix + "_add", s1, r1, r1),

            c.call(f1mPrefix + "_add", s0, s4, r2),
            c.call(f1mPrefix + "_sub", s3, r2, r2),
            c.call(f1mPrefix + "_add", s2, r2, r2),
            c.call(f1mPrefix + "_add", s1, r2, r2),
        );

    }


    function buildToMontgomery() {
        const f = module.addFunction(prefix+"_toMontgomery");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_toMontgomery", x0, r0),
            c.call(f1mPrefix+"_toMontgomery", x1, r1),
            c.call(f1mPrefix+"_toMontgomery", x2, r2)
        );
    }

    function buildFromMontgomery() {
        const f = module.addFunction(prefix+"_fromMontgomery");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_fromMontgomery", x0, r0),
            c.call(f1mPrefix+"_fromMontgomery", x1, r1),
            c.call(f1mPrefix+"_fromMontgomery", x2, r2)
        );
    }

    function buildCopy() {
        const f = module.addFunction(prefix+"_copy");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_copy", x0, r0),
            c.call(f1mPrefix+"_copy", x1, r1),
            c.call(f1mPrefix+"_copy", x2, r2),
        );
    }

    function buildZero() {
        const f = module.addFunction(prefix+"_zero");
        f.addParam("x", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_zero", x0),
            c.call(f1mPrefix+"_zero", x1),
            c.call(f1mPrefix+"_zero", x2),
        );
    }

    function buildOne() {
        const f = module.addFunction(prefix+"_one");
        f.addParam("x", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));

        f.addCode(
            c.call(f1mPrefix+"_one", x0),
            c.call(f1mPrefix+"_zero", x1),
            c.call(f1mPrefix+"_zero", x2),
        );
    }

    function buildEq() {
        const f = module.addFunction(prefix+"_eq");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const y0 = c.getLocal("y");
        const y1 = c.i32_add(c.getLocal("y"), c.i32_const(f1n8));
        const y2 = c.i32_add(c.getLocal("y"), c.i32_const(2*f1n8));

        f.addCode(
            c.i32_and(
                c.i32_and(
                    c.call(f1mPrefix+"_eq", x0, y0),
                    c.call(f1mPrefix+"_eq", x1, y1),
                ),
                c.call(f1mPrefix+"_eq", x2, y2)
            )
        );
    }

    function buildIsZero() {
        const f = module.addFunction(prefix+"_isZero");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));

        f.addCode(
            c.i32_and(
                c.i32_and(
                    c.call(f1mPrefix+"_isZero", x0),
                    c.call(f1mPrefix+"_isZero", x1)
                ),
                c.call(f1mPrefix+"_isZero", x2)
            )
        );
    }

    function buildInverse() {
        const f = module.addFunction(prefix+"_inverse");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));
        const r0 = c.getLocal("r");
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(f1n8));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(2*f1n8));

        const t0 = c.i32_const(module.alloc(f1n8));
        const t1 = c.i32_const(module.alloc(f1n8));
        const t2 = c.i32_const(module.alloc(f1n8));
        const t3 = c.i32_const(module.alloc(f1n8));
        const t4 = c.i32_const(module.alloc(f1n8));
        const t5 = c.i32_const(module.alloc(f1n8));
        const c0 = c.i32_const(module.alloc(f1n8));
        const c1 = c.i32_const(module.alloc(f1n8));
        const c2 = c.i32_const(module.alloc(f1n8));
        const t6 = c.i32_const(module.alloc(f1n8));
        const AUX = c.i32_const(module.alloc(f1n8));

        f.addCode(
            c.call(f1mPrefix+"_square", x0, t0),
            c.call(f1mPrefix+"_square", x1, t1),
            c.call(f1mPrefix+"_square", x2, t2),
            c.call(f1mPrefix+"_mul", x0, x1, t3),
            c.call(f1mPrefix+"_mul", x0, x2, t4),
            c.call(f1mPrefix+"_mul", x1, x2, t5),

            c.call(mulNonResidueFn, t5, c0),
            c.call(f1mPrefix+"_sub", t0, c0, c0),

            c.call(mulNonResidueFn, t2, c1),
            c.call(f1mPrefix+"_sub", c1, t3, c1),

            c.call(f1mPrefix+"_sub", t1, t4, c2),

            c.call(f1mPrefix+"_mul", x2, c1, t6),
            c.call(f1mPrefix+"_mul", x1, c2, AUX),
            c.call(f1mPrefix+"_add", t6, AUX, t6),
            c.call(mulNonResidueFn, t6, t6),
            c.call(f1mPrefix+"_mul", x0, c0, AUX),
            c.call(f1mPrefix+"_add", AUX, t6, t6),

            c.call(f1mPrefix+"_inverse", t6, t6),

            c.call(f1mPrefix+"_mul", t6, c0, r0),
            c.call(f1mPrefix+"_mul", t6, c1, r1),
            c.call(f1mPrefix+"_mul", t6, c2, r2)
        );
    }


    function buildSign() {
        const f = module.addFunction(prefix+"_sign");
        f.addParam("x", "i32");
        f.addLocal("s", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(2*f1n8));

        f.addCode(
            c.setLocal("s" , c.call( f1mPrefix + "_sign", x2)),
            c.if(
                c.getLocal("s"),
                c.ret(c.getLocal("s"))
            ),
            c.setLocal("s" , c.call( f1mPrefix + "_sign", x1)),
            c.if(
                c.getLocal("s"),
                c.ret(c.getLocal("s"))
            ),
            c.ret(c.call( f1mPrefix + "_sign", x0))
        );
    }

    function buildIsOne() {
        const f = module.addFunction(prefix+"_isOne");
        f.addParam("x", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(f1n8*2));

        f.addCode(
            c.ret(
                c.i32_and(
                    c.i32_and(
                        c.call(f1mPrefix + "_isOne", x0),
                        c.call(f1mPrefix + "_isZero", x1)
                    ),
                    c.call(f1mPrefix + "_isZero", x2)
                )
            )
        );
    }

    buildIsZero();
    buildIsOne();
    buildZero();
    buildOne();
    buildCopy();
    buildMul();
    buildSquare();
    buildAdd();
    buildSub();
    buildNeg();
    buildSign();
    buildToMontgomery();
    buildFromMontgomery();
    buildEq();
    buildInverse();
    buildTimesScalar();
    buildIsNegative();

    module.exportFunction(prefix + "_isZero");
    module.exportFunction(prefix + "_isOne");
    module.exportFunction(prefix + "_zero");
    module.exportFunction(prefix + "_one");
    module.exportFunction(prefix + "_copy");
    module.exportFunction(prefix + "_mul");
    module.exportFunction(prefix + "_square");
    module.exportFunction(prefix + "_add");
    module.exportFunction(prefix + "_sub");
    module.exportFunction(prefix + "_neg");
    module.exportFunction(prefix + "_sign");
    module.exportFunction(prefix + "_fromMontgomery");
    module.exportFunction(prefix + "_toMontgomery");
    module.exportFunction(prefix + "_eq");
    module.exportFunction(prefix + "_inverse");
    buildBatchInverse(module, prefix);
    buildExp(
        module,
        prefix + "_exp",
        f1n8*3,
        prefix + "_mul",
        prefix + "_square",
        prefix + "_copy",
        prefix + "_one"
    );
    module.exportFunction(prefix + "_exp");
    module.exportFunction(prefix + "_timesScalar");
    module.exportFunction(prefix + "_batchInverse");
    module.exportFunction(prefix + "_isNegative");

    return prefix;
};

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

var build_timesscalarnaf = function buildTimesScalarNAF(module, fnName, elementLen, opAB, opAA, opAmB, opCopy, opInit) {

    const f = module.addFunction(fnName);
    f.addParam("base", "i32");
    f.addParam("scalar", "i32");
    f.addParam("scalarLength", "i32");
    f.addParam("r", "i32");
    f.addLocal("old0", "i32");
    f.addLocal("nbits", "i32");
    f.addLocal("i", "i32");
    f.addLocal("last", "i32");
    f.addLocal("cur", "i32");
    f.addLocal("carry", "i32");
    f.addLocal("p", "i32");

    const c = f.getCodeBuilder();

    const aux = c.i32_const(module.alloc(elementLen));

    function getBit(IDX) {
        return c.i32_and(
            c.i32_shr_u(
                c.i32_load(
                    c.i32_add(
                        c.getLocal("scalar"),
                        c.i32_and(
                            c.i32_shr_u(
                                IDX,
                                c.i32_const(3)
                            ),
                            c.i32_const(0xFFFFFFFC)
                        )
                    )
                ),
                c.i32_and(
                    IDX,
                    c.i32_const(0x1F)
                )
            ),
            c.i32_const(1)
        );
    }

    function pushBit(b) {
        return [
            ...c.i32_store8(
                c.getLocal("p"),
                c.i32_const(b)
            ),
            ...c.setLocal(
                "p",
                c.i32_add(
                    c.getLocal("p"),
                    c.i32_const(1)
                )
            )
        ];
    }

    f.addCode(
        c.if(
            c.i32_eqz(c.getLocal("scalarLength")),
            [
                ...c.call(opInit, c.getLocal("r")),
                ...c.ret([])
            ]
        ),
        c.setLocal("nbits", c.i32_shl(c.getLocal("scalarLength"), c.i32_const(3))),
        c.setLocal("old0", c.i32_load(c.i32_const(0))),
        c.setLocal("p", c.getLocal("old0")),
        c.i32_store(
            c.i32_const(0),
            c.i32_and(
                c.i32_add(
                    c.i32_add(
                        c.getLocal("old0"),
                        c.i32_const(32)
                    ),
                    c.getLocal("nbits")
                ),
                c.i32_const(0xFFFFFFF8)
            )
        ),
        c.setLocal("i", c.i32_const(1)),

        c.setLocal("last",getBit(c.i32_const(0))),
        c.setLocal("carry",c.i32_const(0)),

        c.block(c.loop(
            c.br_if(1, c.i32_eq( c.getLocal("i"), c.getLocal("nbits"))),

            c.setLocal("cur", getBit(c.getLocal("i"))),
            c.if( c.getLocal("last"),
                c.if( c.getLocal("cur"),
                    c.if(c.getLocal("carry"),
                        [
                            ...c.setLocal("last", c.i32_const(0)),
                            ...c.setLocal("carry", c.i32_const(1)),
                            ...pushBit(1)
                        ]
                        ,
                        [
                            ...c.setLocal("last", c.i32_const(0)),
                            ...c.setLocal("carry", c.i32_const(1)),
                            ...pushBit(255)
                        ],
                    ),
                    c.if(c.getLocal("carry"),
                        [
                            ...c.setLocal("last", c.i32_const(0)),
                            ...c.setLocal("carry", c.i32_const(1)),
                            ...pushBit(255)
                        ]
                        ,
                        [
                            ...c.setLocal("last", c.i32_const(0)),
                            ...c.setLocal("carry", c.i32_const(0)),
                            ...pushBit(1)
                        ],
                    ),
                ),
                c.if( c.getLocal("cur"),
                    c.if(c.getLocal("carry"),
                        [
                            ...c.setLocal("last", c.i32_const(0)),
                            ...c.setLocal("carry", c.i32_const(1)),
                            ...pushBit(0)
                        ]
                        ,
                        [
                            ...c.setLocal("last", c.i32_const(1)),
                            ...c.setLocal("carry", c.i32_const(0)),
                            ...pushBit(0)
                        ],
                    ),
                    c.if(c.getLocal("carry"),
                        [
                            ...c.setLocal("last", c.i32_const(1)),
                            ...c.setLocal("carry", c.i32_const(0)),
                            ...pushBit(0)
                        ]
                        ,
                        [
                            ...c.setLocal("last", c.i32_const(0)),
                            ...c.setLocal("carry", c.i32_const(0)),
                            ...pushBit(0)
                        ],
                    ),
                )
            ),
            c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
            c.br(0)
        )),

        c.if( c.getLocal("last"),
            c.if(c.getLocal("carry"),
                [
                    ...pushBit(255),
                    ...pushBit(0),
                    ...pushBit(1)
                ]
                ,
                [
                    ...pushBit(1)
                ],
            ),
            c.if(c.getLocal("carry"),
                [
                    ...pushBit(0),
                    ...pushBit(1)
                ]
            ),
        ),

        c.setLocal("p", c.i32_sub(c.getLocal("p"), c.i32_const(1))),

        // p already points to the last bit

        c.call(opCopy, c.getLocal("base"), aux),

        c.call(opInit, c.getLocal("r")),

        c.block(c.loop(


            c.call(opAA, c.getLocal("r"), c.getLocal("r")),


            c.setLocal("cur",
                c.i32_load8_u(
                    c.getLocal("p")
                )
            ),

            c.if(
                c.getLocal("cur"),
                c.if(
                    c.i32_eq(c.getLocal("cur"), c.i32_const(1)),
                    c.call(opAB,  c.getLocal("r"), aux, c.getLocal("r")),
                    c.call(opAmB, c.getLocal("r"), aux, c.getLocal("r")),
                )
            ),

            c.br_if(1, c.i32_eq( c.getLocal("old0"), c.getLocal("p"))),
            c.setLocal("p", c.i32_sub(c.getLocal("p"), c.i32_const(1))),
            c.br(0)

        )),

        c.i32_store( c.i32_const(0), c.getLocal("old0"))

    );

};

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

// Multi-scalar multiplication (Pippenger bucket method) with SIGNED-DIGIT
// windowing. Each scalar is recoded so every c-bit window digit lies in
// [-2^(c-1), 2^(c-1)-1] (with carry propagation). Because point negation is
// free on the curve, a digit -m is handled by subtracting the base, so only
// 2^(c-1) buckets are needed per window instead of 2^c-1 -- halving the
// bucket-reduction cost and the bucket memory.
var build_multiexp = function buildMultiexp(module, prefix, fnName, opAdd, opSub, n8b) {

    const n64g = module.modules[prefix].n64;
    const n8g = n64g*8;

    // Scratch used by the running-sum reduction and the per-window result.
    const accReduce = module.alloc(n8g);
    const aux = module.alloc(n8g);

    // Extract the raw (unsigned) c-bit window starting at `startBit`.
    function buildGetChunk() {
        const f = module.addFunction(fnName + "_getChunk");
        f.addParam("pScalar", "i32");
        f.addParam("scalarSize", "i32");  // Number of bytes of the scalar
        f.addParam("startBit", "i32");  // Bit to start extract
        f.addParam("chunkSize", "i32");  // Chunk size in bits
        f.addLocal("bitsToEnd", "i32");
        f.addLocal("mask", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal("bitsToEnd",
                c.i32_sub(
                    c.i32_mul(
                        c.getLocal("scalarSize"),
                        c.i32_const(8)
                    ),
                    c.getLocal("startBit")
                )
            ),
            c.if(
                c.i32_gt_s(
                    c.getLocal("chunkSize"),
                    c.getLocal("bitsToEnd")
                ),
                c.setLocal(
                    "mask",
                    c.i32_sub(
                        c.i32_shl(
                            c.i32_const(1),
                            c.getLocal("bitsToEnd")
                        ),
                        c.i32_const(1)
                    )
                ),
                c.setLocal(
                    "mask",
                    c.i32_sub(
                        c.i32_shl(
                            c.i32_const(1),
                            c.getLocal("chunkSize")
                        ),
                        c.i32_const(1)
                    )
                )
            ),
            c.i32_and(
                c.i32_shr_u(
                    c.i32_load(
                        c.i32_add(
                            c.getLocal("pScalar"),
                            c.i32_shr_u(
                                c.getLocal("startBit"),
                                c.i32_const(3)
                            )
                        ),
                        0,  // offset
                        0   // align to byte.
                    ),
                    c.i32_and(
                        c.getLocal("startBit"),
                        c.i32_const(0x7)
                    )
                ),
                c.getLocal("mask")
            )
        );
    }

    // Recode pass: for every scalar, compute the signed-digit carry that flows
    // INTO each window (LSB->MSB) and store it as one byte per (window, point),
    // column-major: pCarry[windowIdx*n + pointIdx]. Storing only the 1-bit carry
    // (not the full digit) keeps the scratch buffer tiny; the actual signed
    // digit is reconstructed in _chunk from raw-window + carry. There are
    // (nChunks+1) windows: the extra top window absorbs the final carry so
    // arbitrary scalarSize-byte scalars (not just sub-group elements) work.
    function buildRecode() {
        const f = module.addFunction(fnName + "_recode");
        f.addParam("pScalars", "i32");
        f.addParam("scalarSize", "i32");
        f.addParam("n", "i32");
        f.addParam("chunkSize", "i32");   // c
        f.addParam("nChunks", "i32");     // number of "real" windows
        f.addParam("pCarry", "i32");      // output buffer (1 byte/window/point)
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        f.addLocal("nWin", "i32");        // nChunks + 1
        f.addLocal("itScalar", "i32");
        f.addLocal("carry", "i32");
        f.addLocal("raw", "i32");
        f.addLocal("half", "i32");        // 2^(c-1)
        f.addLocal("scalarBits", "i32");
        f.addLocal("startBit", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal("half", c.i32_shl(c.i32_const(1), c.i32_sub(c.getLocal("chunkSize"), c.i32_const(1)))),
            c.setLocal("scalarBits", c.i32_shl(c.getLocal("scalarSize"), c.i32_const(3))),
            c.setLocal("nWin", c.i32_add(c.getLocal("nChunks"), c.i32_const(1))),
            c.setLocal("itScalar", c.getLocal("pScalars")),

            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq(c.getLocal("i"), c.getLocal("n"))),

                c.setLocal("carry", c.i32_const(0)),
                c.setLocal("j", c.i32_const(0)),
                c.block(c.loop(
                    c.br_if(1, c.i32_eq(c.getLocal("j"), c.getLocal("nWin"))),

                    // store carry-INTO-window j (before updating it)
                    c.i32_store8(
                        c.i32_add(
                            c.getLocal("pCarry"),
                            c.i32_add(
                                c.i32_mul(c.getLocal("j"), c.getLocal("n")),
                                c.getLocal("i")
                            )
                        ),
                        c.getLocal("carry")
                    ),

                    c.setLocal("startBit", c.i32_mul(c.getLocal("j"), c.getLocal("chunkSize"))),
                    c.if(
                        c.i32_lt_s(c.getLocal("startBit"), c.getLocal("scalarBits")),
                        c.setLocal("raw",
                            c.call(fnName + "_getChunk",
                                c.getLocal("itScalar"),
                                c.getLocal("scalarSize"),
                                c.getLocal("startBit"),
                                c.getLocal("chunkSize")
                            )
                        ),
                        c.setLocal("raw", c.i32_const(0))
                    ),
                    // carry_out = (raw + carry) >= 2^(c-1) ? 1 : 0
                    c.if(
                        c.i32_ge_s(
                            c.i32_add(c.getLocal("raw"), c.getLocal("carry")),
                            c.getLocal("half")
                        ),
                        c.setLocal("carry", c.i32_const(1)),
                        c.setLocal("carry", c.i32_const(0))
                    ),

                    c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                    c.br(0)
                )),

                c.setLocal("itScalar", c.i32_add(c.getLocal("itScalar"), c.getLocal("scalarSize"))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }

    // Process one window: reconstruct each point's signed digit from its raw
    // window value plus the stored carry, distribute into 2^(c-1) signed
    // buckets (subtracting for negative digits), then reduce with the
    // running-sum trick into pr.
    function buildMutiexpChunk() {
        const f = module.addFunction(fnName + "_chunk");
        f.addParam("pBases", "i32");
        f.addParam("pScalars", "i32");
        f.addParam("scalarSize", "i32");
        f.addParam("pCarry", "i32");
        f.addParam("n", "i32");           // Number of points
        f.addParam("windowIdx", "i32");   // which window
        f.addParam("chunkSize", "i32");   // c
        f.addParam("pr", "i32");
        f.addLocal("itBase", "i32");
        f.addLocal("itScalar", "i32");
        f.addLocal("itCarry", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        f.addLocal("nTable", "i32");      // 2^(c-1)  (also == half)
        f.addLocal("full", "i32");        // 2^c
        f.addLocal("scalarBits", "i32");
        f.addLocal("startBit", "i32");
        f.addLocal("pTable", "i32");
        f.addLocal("raw", "i32");
        f.addLocal("d", "i32");
        f.addLocal("pIdxTable", "i32");
        f.addLocal("itB", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.if(
                c.i32_eqz(c.getLocal("n")),
                [
                    ...c.call(prefix + "_zero", c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),

            // nTable = half = 2^(chunkSize-1) ; full = 2^chunkSize
            c.setLocal(
                "nTable",
                c.i32_shl(c.i32_const(1), c.i32_sub(c.getLocal("chunkSize"), c.i32_const(1)))
            ),
            c.setLocal("full", c.i32_shl(c.i32_const(1), c.getLocal("chunkSize"))),
            c.setLocal("scalarBits", c.i32_shl(c.getLocal("scalarSize"), c.i32_const(3))),
            c.setLocal("startBit", c.i32_mul(c.getLocal("windowIdx"), c.getLocal("chunkSize"))),

            // Allocate bucket table from the bump allocator
            c.setLocal("pTable", c.i32_load( c.i32_const(0) )),
            c.i32_store(
                c.i32_const(0),
                c.i32_add(
                    c.getLocal("pTable"),
                    c.i32_mul(c.getLocal("nTable"), c.i32_const(n8g))
                )
            ),

            // Reset Table
            c.setLocal("j", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq(c.getLocal("j"), c.getLocal("nTable"))),
                c.call(
                    prefix + "_zero",
                    c.i32_add(
                        c.getLocal("pTable"),
                        c.i32_mul(c.getLocal("j"), c.i32_const(n8g))
                    )
                ),
                c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                c.br(0)
            )),

            // Distribute points into signed buckets
            c.setLocal("itBase", c.getLocal("pBases")),
            c.setLocal("itScalar", c.getLocal("pScalars")),
            // itCarry = pCarry + windowIdx*n
            c.setLocal(
                "itCarry",
                c.i32_add(
                    c.getLocal("pCarry"),
                    c.i32_mul(c.getLocal("windowIdx"), c.getLocal("n"))
                )
            ),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq(c.getLocal("i"), c.getLocal("n"))),

                // raw window (0 beyond the scalar bits, e.g. the guard window)
                c.if(
                    c.i32_lt_s(c.getLocal("startBit"), c.getLocal("scalarBits")),
                    c.setLocal("raw",
                        c.call(fnName + "_getChunk",
                            c.getLocal("itScalar"),
                            c.getLocal("scalarSize"),
                            c.getLocal("startBit"),
                            c.getLocal("chunkSize")
                        )
                    ),
                    c.setLocal("raw", c.i32_const(0))
                ),
                // d = raw + carry ; if d >= 2^(c-1): d -= 2^c
                c.setLocal("d", c.i32_add(c.getLocal("raw"), c.i32_load8_u(c.getLocal("itCarry")))),
                c.if(
                    c.i32_ge_s(c.getLocal("d"), c.getLocal("nTable")),
                    c.setLocal("d", c.i32_sub(c.getLocal("d"), c.getLocal("full")))
                ),

                c.if(
                    c.i32_gt_s(c.getLocal("d"), c.i32_const(0)),
                    // positive digit m=d -> bucket[d-1] += base
                    [
                        ...c.setLocal(
                            "pIdxTable",
                            c.i32_add(
                                c.getLocal("pTable"),
                                c.i32_mul(
                                    c.i32_sub(c.getLocal("d"), c.i32_const(1)),
                                    c.i32_const(n8g)
                                )
                            )
                        ),
                        ...c.call(opAdd, c.getLocal("pIdxTable"), c.getLocal("itBase"), c.getLocal("pIdxTable"))
                    ],
                    // else if d < 0 -> bucket[-d-1] -= base
                    c.if(
                        c.i32_lt_s(c.getLocal("d"), c.i32_const(0)),
                        [
                            ...c.setLocal(
                                "pIdxTable",
                                c.i32_add(
                                    c.getLocal("pTable"),
                                    c.i32_mul(
                                        // -d-1  ==  (-1) - d
                                        c.i32_sub(c.i32_const(-1), c.getLocal("d")),
                                        c.i32_const(n8g)
                                    )
                                )
                            ),
                            ...c.call(opSub, c.getLocal("pIdxTable"), c.getLocal("itBase"), c.getLocal("pIdxTable"))
                        ]
                    )
                ),

                c.setLocal("itScalar", c.i32_add(c.getLocal("itScalar"), c.getLocal("scalarSize"))),
                c.setLocal("itCarry", c.i32_add(c.getLocal("itCarry"), c.i32_const(1))),
                c.setLocal("itBase", c.i32_add(c.getLocal("itBase"), c.i32_const(n8b))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),

            // Running-sum reduction over all 2^(c-1) buckets:
            //   pr = sum_{m=1}^{nTable} m * bucket[m-1]
            // itB walks from bucket[nTable-1] down. pr and accReduce start at the top.
            c.setLocal(
                "itB",
                c.i32_add(
                    c.getLocal("pTable"),
                    c.i32_mul(
                        c.i32_sub(c.getLocal("nTable"), c.i32_const(1)),
                        c.i32_const(n8g)
                    )
                )
            ),
            c.call(prefix + "_copy", c.getLocal("itB"), c.getLocal("pr")),
            c.call(prefix + "_copy", c.getLocal("itB"), c.i32_const(accReduce)),
            c.setLocal("itB", c.i32_sub(c.getLocal("itB"), c.i32_const(n8g))),
            c.block(c.loop(
                c.br_if(1, c.i32_lt_u(c.getLocal("itB"), c.getLocal("pTable"))),
                c.call(prefix + "_add", c.i32_const(accReduce), c.getLocal("itB"), c.i32_const(accReduce)),
                c.call(prefix + "_add", c.getLocal("pr"), c.i32_const(accReduce), c.getLocal("pr")),
                c.setLocal("itB", c.i32_sub(c.getLocal("itB"), c.i32_const(n8g))),
                c.br(0)
            )),

            // Free bucket table
            c.i32_store(c.i32_const(0), c.getLocal("pTable"))
        );
    }

    function buildMultiexp() {
        const f = module.addFunction(fnName);
        f.addParam("pBases", "i32");
        f.addParam("pScalars", "i32");
        f.addParam("scalarSize", "i32");
        f.addParam("n", "i32");  // Number of points
        f.addParam("pr", "i32");
        f.addLocal("chunkSize", "i32");
        f.addLocal("nChunks", "i32");
        f.addLocal("nWin", "i32");
        f.addLocal("pCarry", "i32");
        f.addLocal("savedFree", "i32");
        f.addLocal("windowIdx", "i32");
        f.addLocal("j", "i32");

        const c = f.getCodeBuilder();

        const pTSizes = module.alloc([
            17, 17, 17, 17,   17, 17, 17, 17,
            17, 17, 16, 16,   15, 14, 13, 13,
            12, 11, 10,  9,    8,  7,  7,  6,
            5 ,  4,  3,  2,    1,  1,  1,  1
        ]);

        f.addCode(
            c.call(prefix + "_zero", c.getLocal("pr")),
            c.if(
                c.i32_eqz(c.getLocal("n")),
                c.ret([])
            ),
            c.setLocal("chunkSize", c.i32_load8_u( c.i32_clz(c.getLocal("n")),  pTSizes )),
            // Signed windowing needs c >= 2: at c=1 the digit range [-2^(c-1), 2^(c-1)-1]
            // collapses to {-1, 0}, which cannot represent positive scalars.
            c.if(
                c.i32_lt_s(c.getLocal("chunkSize"), c.i32_const(2)),
                c.setLocal("chunkSize", c.i32_const(2))
            ),
            c.setLocal(
                "nChunks",
                c.i32_add(
                    c.i32_div_u(
                        c.i32_sub(
                            c.i32_shl(
                                c.getLocal("scalarSize"),
                                c.i32_const(3)
                            ),
                            c.i32_const(1)
                        ),
                        c.getLocal("chunkSize")
                    ),
                    c.i32_const(1)
                )
            ),
            c.setLocal("nWin", c.i32_add(c.getLocal("nChunks"), c.i32_const(1))),

            // Allocate the carry buffer: nWin * n bytes (1 byte per window/point).
            // Bump up to a 4-byte boundary so later point allocations stay aligned.
            c.setLocal("savedFree", c.i32_load(c.i32_const(0))),
            c.setLocal("pCarry", c.getLocal("savedFree")),
            c.i32_store(
                c.i32_const(0),
                c.i32_and(
                    c.i32_add(
                        c.i32_add(
                            c.getLocal("savedFree"),
                            c.i32_mul(c.getLocal("nWin"), c.getLocal("n"))
                        ),
                        c.i32_const(3)
                    ),
                    c.i32_const(-4)
                )
            ),

            c.call(fnName + "_recode",
                c.getLocal("pScalars"),
                c.getLocal("scalarSize"),
                c.getLocal("n"),
                c.getLocal("chunkSize"),
                c.getLocal("nChunks"),
                c.getLocal("pCarry")
            ),

            // Horner over windows, highest (the carry-guard window) first.
            c.setLocal("windowIdx", c.getLocal("nChunks")),
            c.block(c.loop(
                c.br_if(1, c.i32_lt_s(c.getLocal("windowIdx"), c.i32_const(0))),

                // Double pr chunkSize times (skip while pr is still zero)
                c.if(
                    c.i32_eqz(c.call(prefix + "_isZero", c.getLocal("pr"))),
                    [
                        ...c.setLocal("j", c.i32_const(0)),
                        ...c.block(c.loop(
                            c.br_if(1, c.i32_eq(c.getLocal("j"), c.getLocal("chunkSize"))),
                            c.call(prefix + "_double", c.getLocal("pr"), c.getLocal("pr")),
                            c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                            c.br(0)
                        ))
                    ]
                ),

                c.call(
                    fnName + "_chunk",
                    c.getLocal("pBases"),
                    c.getLocal("pScalars"),
                    c.getLocal("scalarSize"),
                    c.getLocal("pCarry"),
                    c.getLocal("n"),
                    c.getLocal("windowIdx"),
                    c.getLocal("chunkSize"),
                    c.i32_const(aux)
                ),
                c.call(
                    prefix + "_add",
                    c.getLocal("pr"),
                    c.i32_const(aux),
                    c.getLocal("pr")
                ),

                c.setLocal("windowIdx", c.i32_sub(c.getLocal("windowIdx"), c.i32_const(1))),
                c.br(0)
            )),

            // Free the digit buffer
            c.i32_store(c.i32_const(0), c.getLocal("savedFree"))
        );
    }

    buildGetChunk();
    buildRecode();
    buildMutiexpChunk();
    buildMultiexp();

    module.exportFunction(fnName);
    module.exportFunction(fnName +"_chunk");


};

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

const buildTimesScalarNAF = build_timesscalarnaf;
//const buildTimesScalar = require("./build_timesscalar");
const buildBatchConvertion = build_batchconvertion;
const buildMultiexp = build_multiexp;

var build_curve_jacobian_a0 = function buildCurve(module, prefix, prefixField, pB) {


    const n64 = module.modules[prefixField].n64;
    const n8 = n64*8;

    if (module.modules[prefix]) return prefix;  // already builded
    module.modules[prefix] = {
        n64: n64*3
    };

    function buildIsZero() {
        const f = module.addFunction(prefix + "_isZero");
        f.addParam("p1", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_isZero",
            c.i32_add(
                c.getLocal("p1"),
                c.i32_const(n8*2)
            )
        ));
    }
    function buildIsZeroAffine() {
        const f = module.addFunction(prefix + "_isZeroAffine");
        f.addParam("p1", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.i32_and(
                c.call(
                    prefixField + "_isZero",
                    c.getLocal("p1")
                ),
                c.call(
                    prefixField + "_isZero",
                    c.i32_add(
                        c.getLocal("p1"),
                        c.i32_const(n8)
                    )
                )
            )
        );
    }

    function buildCopy() {
        const f = module.addFunction(prefix + "_copy");
        f.addParam("ps", "i32");
        f.addParam("pd", "i32");

        const c = f.getCodeBuilder();

        for (let i=0; i<n64*3; i++) {
            f.addCode(
                c.i64_store(
                    c.getLocal("pd"),
                    i*8,
                    c.i64_load(
                        c.getLocal("ps"),
                        i*8
                    )
                )
            );
        }
    }


    function buildCopyAffine() {
        const f = module.addFunction(prefix + "_copyAffine");
        f.addParam("ps", "i32");
        f.addParam("pd", "i32");

        const c = f.getCodeBuilder();

        for (let i=0; i<n64*2; i++) {
            f.addCode(
                c.i64_store(
                    c.getLocal("pd"),
                    i*8,
                    c.i64_load(
                        c.getLocal("ps"),
                        i*8
                    )
                )
            );
        }

    }


    function buildZero() {
        const f = module.addFunction(prefix + "_zero");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_zero",
            c.getLocal("pr")
        ));

        f.addCode(c.call(
            prefixField + "_one",
            c.i32_add(
                c.getLocal("pr"),
                c.i32_const(n8)
            )
        ));

        f.addCode(c.call(
            prefixField + "_zero",
            c.i32_add(
                c.getLocal("pr"),
                c.i32_const(n8*2)
            )
        ));
    }


    function buildZeroAffine() {
        const f = module.addFunction(prefix + "_zeroAffine");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_zero",
            c.getLocal("pr")
        ));

        f.addCode(c.call(
            prefixField + "_zero",
            c.i32_add(
                c.getLocal("pr"),
                c.i32_const(n8)
            )
        ));
    }

    function buildEq() {
        const f = module.addFunction(prefix + "_eq");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.setReturnType("i32");
        f.addLocal("z1", "i32");
        f.addLocal("z2", "i32");

        const c = f.getCodeBuilder();

        const x1 = c.getLocal("p1");
        const y1 = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        f.addCode(c.setLocal("z1", c.i32_add(c.getLocal("p1"), c.i32_const(n8*2))));
        const z1 = c.getLocal("z1");
        const x2 = c.getLocal("p2");
        const y2 = c.i32_add(c.getLocal("p2"), c.i32_const(n8));
        f.addCode(c.setLocal("z2", c.i32_add(c.getLocal("p2"), c.i32_const(n8*2))));
        const z2 = c.getLocal("z2");

        const Z1Z1 = c.i32_const(module.alloc(n8));
        const Z2Z2 = c.i32_const(module.alloc(n8));
        const U1 = c.i32_const(module.alloc(n8));
        const U2 = c.i32_const(module.alloc(n8));
        const Z1_cubed = c.i32_const(module.alloc(n8));
        const Z2_cubed = c.i32_const(module.alloc(n8));
        const S1 = c.i32_const(module.alloc(n8));
        const S2 = c.i32_const(module.alloc(n8));


        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                c.ret( c.call(prefix + "_isZero", c.getLocal("p2"))),
            ),
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p2")),
                c.ret(c.i32_const(0))
            ),
            c.if(
                c.call(prefixField + "_isOne", z1),
                c.ret(c.call(prefix + "_eqMixed", c.getLocal("p2"), c.getLocal("p1")))
            ),
            c.if(
                c.call(prefixField + "_isOne", z2),
                c.ret(c.call(prefix + "_eqMixed", c.getLocal("p1"), c.getLocal("p2")))
            ),

            c.call(prefixField + "_square", z1, Z1Z1),
            c.call(prefixField + "_square", z2, Z2Z2),
            c.call(prefixField + "_mul", x1, Z2Z2, U1),
            c.call(prefixField + "_mul", x2, Z1Z1, U2),
            c.call(prefixField + "_mul", z1, Z1Z1, Z1_cubed),
            c.call(prefixField + "_mul", z2, Z2Z2, Z2_cubed),
            c.call(prefixField + "_mul", y1, Z2_cubed, S1),
            c.call(prefixField + "_mul", y2, Z1_cubed, S2),

            c.if(
                c.call(prefixField + "_eq", U1, U2),
                c.if(
                    c.call(prefixField + "_eq", S1, S2),
                    c.ret(c.i32_const(1))
                )
            ),
            c.ret(c.i32_const(0))
        );
    }


    function buildEqMixed() {
        const f = module.addFunction(prefix + "_eqMixed");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.setReturnType("i32");
        f.addLocal("z1", "i32");

        const c = f.getCodeBuilder();

        const x1 = c.getLocal("p1");
        const y1 = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        f.addCode(c.setLocal("z1", c.i32_add(c.getLocal("p1"), c.i32_const(n8*2))));
        const z1 = c.getLocal("z1");
        const x2 = c.getLocal("p2");
        const y2 = c.i32_add(c.getLocal("p2"), c.i32_const(n8));

        const Z1Z1 = c.i32_const(module.alloc(n8));
        const U2 = c.i32_const(module.alloc(n8));
        const Z1_cubed = c.i32_const(module.alloc(n8));
        const S2 = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                c.ret( c.call(prefix + "_isZeroAffine", c.getLocal("p2"))),
            ),
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("p2")),
                c.ret(c.i32_const(0))
            ),
            c.if(
                c.call(prefixField + "_isOne", z1),
                c.ret(c.call(prefix + "_eqAffine", c.getLocal("p1"), c.getLocal("p2")))
            ),
            c.call(prefixField + "_square", z1, Z1Z1),
            c.call(prefixField + "_mul", x2, Z1Z1, U2),
            c.call(prefixField + "_mul", z1, Z1Z1, Z1_cubed),
            c.call(prefixField + "_mul", y2, Z1_cubed, S2),

            c.if(
                c.call(prefixField + "_eq", x1, U2),
                c.if(
                    c.call(prefixField + "_eq", y1, S2),
                    c.ret(c.i32_const(1))
                )
            ),
            c.ret(c.i32_const(0))
        );
    }

    function buildDouble() {
        const f = module.addFunction(prefix + "_double");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const z = c.i32_add(c.getLocal("p1"), c.i32_const(n8*2));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        const A = c.i32_const(module.alloc(n8));
        const B = c.i32_const(module.alloc(n8));
        const C = c.i32_const(module.alloc(n8));
        const D = c.i32_const(module.alloc(n8));
        const E = c.i32_const(module.alloc(n8));
        const F = c.i32_const(module.alloc(n8));
        const G = c.i32_const(module.alloc(n8));
        const eightC = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                [
                    ...c.call(prefix + "_copy", c.getLocal("p1"), c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefixField + "_isOne", z),
                [
                    ...c.ret(c.call(prefix + "_doubleAffine", c.getLocal("p1"), c.getLocal("pr"))),
                    ...c.ret([])
                ]
            ),

            c.call(prefixField + "_square", x, A),
            c.call(prefixField + "_square", y, B),
            c.call(prefixField + "_square", B, C),

            c.call(prefixField + "_add", x, B, D),
            c.call(prefixField + "_square", D, D),
            c.call(prefixField + "_sub", D, A, D),
            c.call(prefixField + "_sub", D, C, D),
            c.call(prefixField + "_add", D, D, D),

            c.call(prefixField + "_add", A, A, E),
            c.call(prefixField + "_add", E, A, E),
            c.call(prefixField + "_square", E, F),

            c.call(prefixField + "_mul", y, z, G),

            c.call(prefixField + "_add", D, D, x3),
            c.call(prefixField + "_sub", F, x3, x3),

            c.call(prefixField + "_add", C, C, eightC),
            c.call(prefixField + "_add", eightC, eightC, eightC),
            c.call(prefixField + "_add", eightC, eightC, eightC),

            c.call(prefixField + "_sub", D, x3, y3),
            c.call(prefixField + "_mul", y3, E, y3),
            c.call(prefixField + "_sub", y3, eightC, y3),

            c.call(prefixField + "_add", G, G, z3),
        );
    }


    function buildDoubleAffine() {
        const f = module.addFunction(prefix + "_doubleAffine");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        const XX = c.i32_const(module.alloc(n8));
        const YY = c.i32_const(module.alloc(n8));
        const YYYY = c.i32_const(module.alloc(n8));
        const S = c.i32_const(module.alloc(n8));
        const M = c.i32_const(module.alloc(n8));
        const eightYYYY = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("p1")),
                [
                    ...c.call(prefix + "_toJacobian", c.getLocal("p1"), c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),

            // XX = X1^2
            c.call(prefixField + "_square", x, XX),

            // YY = Y1^2
            c.call(prefixField + "_square", y, YY),

            // YYYY = YY^2
            c.call(prefixField + "_square", YY, YYYY),

            // S = 2*((X1+YY)^2-XX-YYYY)
            c.call(prefixField + "_add", x, YY, S),
            c.call(prefixField + "_square", S, S),
            c.call(prefixField + "_sub", S, XX, S),
            c.call(prefixField + "_sub", S, YYYY, S),
            c.call(prefixField + "_add", S, S, S),

            // M = 3*XX+a  (Hera a=0)
            c.call(prefixField + "_add", XX, XX, M),
            c.call(prefixField + "_add", M, XX, M),

            // Z3 = 2*Y1
            c.call(prefixField + "_add", y, y, z3),

            // T = M^2-2*S
            // X3 = T
            c.call(prefixField + "_square", M, x3),
            c.call(prefixField + "_sub", x3, S, x3),
            c.call(prefixField + "_sub", x3, S, x3),

            // Y3 = M*(S-T)-8*YYYY
            c.call(prefixField + "_add", YYYY, YYYY, eightYYYY),
            c.call(prefixField + "_add", eightYYYY, eightYYYY, eightYYYY),
            c.call(prefixField + "_add", eightYYYY, eightYYYY, eightYYYY),
            c.call(prefixField + "_sub", S, x3, y3),
            c.call(prefixField + "_mul", y3, M, y3),
            c.call(prefixField + "_sub", y3, eightYYYY, y3),
        );
    }


    function buildEqAffine() {
        const f = module.addFunction(prefix + "_eqAffine");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.setReturnType("i32");
        f.addLocal("z1", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.ret(c.i32_and(
                c.call(
                    prefixField + "_eq",
                    c.getLocal("p1"),
                    c.getLocal("p2")
                ),
                c.call(
                    prefixField + "_eq",
                    c.i32_add(c.getLocal("p1"), c.i32_const(n8)),
                    c.i32_add(c.getLocal("p2"), c.i32_const(n8))
                )
            ))
        );
    }

    function buildToMontgomery() {
        const f = module.addFunction(prefix + "_toMontgomery");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_toMontgomery",
            c.getLocal("p1"),
            c.getLocal("pr")
        ));
        for (let i=1; i<3; i++) {
            f.addCode(c.call(
                prefixField + "_toMontgomery",
                c.i32_add(c.getLocal("p1"), c.i32_const(i*n8)),
                c.i32_add(c.getLocal("pr"), c.i32_const(i*n8))
            ));
        }
    }

    function buildToMontgomeryAffine() {
        const f = module.addFunction(prefix + "_toMontgomeryAffine");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_toMontgomery",
            c.getLocal("p1"),
            c.getLocal("pr")
        ));
        for (let i=1; i<2; i++) {
            f.addCode(c.call(
                prefixField + "_toMontgomery",
                c.i32_add(c.getLocal("p1"), c.i32_const(i*n8)),
                c.i32_add(c.getLocal("pr"), c.i32_const(i*n8))
            ));
        }
    }

    function buildFromMontgomery() {
        const f = module.addFunction(prefix + "_fromMontgomery");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_fromMontgomery",
            c.getLocal("p1"),
            c.getLocal("pr")
        ));
        for (let i=1; i<3; i++) {
            f.addCode(c.call(
                prefixField + "_fromMontgomery",
                c.i32_add(c.getLocal("p1"), c.i32_const(i*n8)),
                c.i32_add(c.getLocal("pr"), c.i32_const(i*n8))
            ));
        }
    }


    function buildFromMontgomeryAffine() {
        const f = module.addFunction(prefix + "_fromMontgomeryAffine");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(c.call(
            prefixField + "_fromMontgomery",
            c.getLocal("p1"),
            c.getLocal("pr")
        ));
        for (let i=1; i<2; i++) {
            f.addCode(c.call(
                prefixField + "_fromMontgomery",
                c.i32_add(c.getLocal("p1"), c.i32_const(i*n8)),
                c.i32_add(c.getLocal("pr"), c.i32_const(i*n8))
            ));
        }
    }

    function buildAdd() {

        const f = module.addFunction(prefix + "_add");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.addParam("pr", "i32");
        f.addLocal("z1", "i32");
        f.addLocal("z2", "i32");

        const c = f.getCodeBuilder();

        const x1 = c.getLocal("p1");
        const y1 = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        f.addCode(c.setLocal("z1", c.i32_add(c.getLocal("p1"), c.i32_const(n8*2))));
        const z1 = c.getLocal("z1");
        const x2 = c.getLocal("p2");
        const y2 = c.i32_add(c.getLocal("p2"), c.i32_const(n8));
        f.addCode(c.setLocal("z2", c.i32_add(c.getLocal("p2"), c.i32_const(n8*2))));
        const z2 = c.getLocal("z2");
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        const Z1Z1 = c.i32_const(module.alloc(n8));
        const Z2Z2 = c.i32_const(module.alloc(n8));
        const U1 = c.i32_const(module.alloc(n8));
        const U2 = c.i32_const(module.alloc(n8));
        const Z1_cubed = c.i32_const(module.alloc(n8));
        const Z2_cubed = c.i32_const(module.alloc(n8));
        const S1 = c.i32_const(module.alloc(n8));
        const S2 = c.i32_const(module.alloc(n8));
        const H = c.i32_const(module.alloc(n8));
        const S2_minus_S1 = c.i32_const(module.alloc(n8));
        const I = c.i32_const(module.alloc(n8));
        const J = c.i32_const(module.alloc(n8));
        const r = c.i32_const(module.alloc(n8));
        const r2 = c.i32_const(module.alloc(n8));
        const V = c.i32_const(module.alloc(n8));
        const V2 = c.i32_const(module.alloc(n8));
        const S1_J2 = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                [
                    ...c.call(prefix + "_copy", c.getLocal("p2"), c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p2")),
                [
                    ...c.call(prefix + "_copy", c.getLocal("p1"), c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefixField + "_isOne", z1),
                [
                    ...c.call(prefix + "_addMixed", x2, x1, x3),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefixField + "_isOne", z2),
                [
                    ...c.call(prefix + "_addMixed", x1, x2, x3),
                    ...c.ret([])
                ]
            ),
            c.call(prefixField + "_square", z1, Z1Z1),
            c.call(prefixField + "_square", z2, Z2Z2),
            c.call(prefixField + "_mul", x1, Z2Z2, U1),
            c.call(prefixField + "_mul", x2, Z1Z1, U2),
            c.call(prefixField + "_mul", z1, Z1Z1, Z1_cubed),
            c.call(prefixField + "_mul", z2, Z2Z2, Z2_cubed),
            c.call(prefixField + "_mul", y1, Z2_cubed, S1),
            c.call(prefixField + "_mul", y2, Z1_cubed, S2),

            c.if(
                c.call(prefixField + "_eq", U1, U2),
                c.if(
                    c.call(prefixField + "_eq", S1, S2),
                    [
                        ...c.call(prefix + "_double", c.getLocal("p1"), c.getLocal("pr")),
                        ...c.ret([])
                    ]
                )
            ),

            c.call(prefixField + "_sub", U2, U1, H),
            c.call(prefixField + "_sub", S2, S1, S2_minus_S1),
            c.call(prefixField + "_add", H, H, I),
            c.call(prefixField + "_square", I, I),
            c.call(prefixField + "_mul", H, I, J),
            c.call(prefixField + "_add", S2_minus_S1, S2_minus_S1, r),
            c.call(prefixField + "_mul", U1, I, V),
            c.call(prefixField + "_square", r, r2),
            c.call(prefixField + "_add", V, V, V2),

            c.call(prefixField + "_sub", r2, J, x3),
            c.call(prefixField + "_sub", x3, V2, x3),

            c.call(prefixField + "_mul", S1, J, S1_J2),
            c.call(prefixField + "_add", S1_J2, S1_J2, S1_J2),

            c.call(prefixField + "_sub", V, x3, y3),
            c.call(prefixField + "_mul", y3, r, y3),
            c.call(prefixField + "_sub", y3, S1_J2, y3),

            c.call(prefixField + "_add", z1, z2, z3),
            c.call(prefixField + "_square", z3, z3),
            c.call(prefixField + "_sub", z3, Z1Z1, z3),
            c.call(prefixField + "_sub", z3, Z2Z2, z3),
            c.call(prefixField + "_mul", z3, H, z3),
        );

    }


    function buildAddMixed() {

        const f = module.addFunction(prefix + "_addMixed");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.addParam("pr", "i32");
        f.addLocal("z1", "i32");

        const c = f.getCodeBuilder();

        const x1 = c.getLocal("p1");
        const y1 = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        f.addCode(c.setLocal("z1", c.i32_add(c.getLocal("p1"), c.i32_const(n8*2))));
        const z1 = c.getLocal("z1");
        const x2 = c.getLocal("p2");
        const y2 = c.i32_add(c.getLocal("p2"), c.i32_const(n8));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        const Z1Z1 = c.i32_const(module.alloc(n8));
        const U2 = c.i32_const(module.alloc(n8));
        const Z1_cubed = c.i32_const(module.alloc(n8));
        const S2 = c.i32_const(module.alloc(n8));
        const H = c.i32_const(module.alloc(n8));
        const HH = c.i32_const(module.alloc(n8));
        const S2_minus_y1 = c.i32_const(module.alloc(n8));
        const I = c.i32_const(module.alloc(n8));
        const J = c.i32_const(module.alloc(n8));
        const r = c.i32_const(module.alloc(n8));
        const r2 = c.i32_const(module.alloc(n8));
        const V = c.i32_const(module.alloc(n8));
        const V2 = c.i32_const(module.alloc(n8));
        const y1_J2 = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                [
                    ...c.call(prefix + "_copyAffine", c.getLocal("p2"), c.getLocal("pr")),
                    ...c.call(prefixField + "_one", c.i32_add(c.getLocal("pr") , c.i32_const(n8*2))),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("p2")),
                [
                    ...c.call(prefix + "_copy", c.getLocal("p1"), c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefixField + "_isOne", z1),
                [
                    ...c.call(prefix + "_addAffine", x1, x2, x3),
                    ...c.ret([])
                ]
            ),
            c.call(prefixField + "_square", z1, Z1Z1),
            c.call(prefixField + "_mul", x2, Z1Z1, U2),
            c.call(prefixField + "_mul", z1, Z1Z1, Z1_cubed),
            c.call(prefixField + "_mul", y2, Z1_cubed, S2),

            c.if(
                c.call(prefixField + "_eq", x1, U2),
                c.if(
                    c.call(prefixField + "_eq", y1, S2),
                    [
                        ...c.call(prefix + "_doubleAffine", c.getLocal("p2"), c.getLocal("pr")),
                        ...c.ret([])
                    ]
                )
            ),

            c.call(prefixField + "_sub", U2, x1, H),
            c.call(prefixField + "_sub", S2, y1, S2_minus_y1),
            c.call(prefixField + "_square", H, HH),
            c.call(prefixField + "_add", HH , HH, I),
            c.call(prefixField + "_add", I , I, I),
            c.call(prefixField + "_mul", H, I, J),
            c.call(prefixField + "_add", S2_minus_y1, S2_minus_y1, r),
            c.call(prefixField + "_mul", x1, I, V),
            c.call(prefixField + "_square", r, r2),
            c.call(prefixField + "_add", V, V, V2),

            c.call(prefixField + "_sub", r2, J, x3),
            c.call(prefixField + "_sub", x3, V2, x3),

            c.call(prefixField + "_mul", y1, J, y1_J2),
            c.call(prefixField + "_add", y1_J2, y1_J2, y1_J2),

            c.call(prefixField + "_sub", V, x3, y3),
            c.call(prefixField + "_mul", y3, r, y3),
            c.call(prefixField + "_sub", y3, y1_J2, y3),

            c.call(prefixField + "_add", z1, H, z3),
            c.call(prefixField + "_square", z3, z3),
            c.call(prefixField + "_sub", z3, Z1Z1, z3),
            c.call(prefixField + "_sub", z3, HH, z3),
        );
    }


    function buildAddAffine() {

        const f = module.addFunction(prefix + "_addAffine");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.addParam("pr", "i32");
        f.addLocal("z1", "i32");

        const c = f.getCodeBuilder();

        const x1 = c.getLocal("p1");
        const y1 = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        f.addCode(c.setLocal("z1", c.i32_add(c.getLocal("p1"), c.i32_const(n8*2))));
        const x2 = c.getLocal("p2");
        const y2 = c.i32_add(c.getLocal("p2"), c.i32_const(n8));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        const H = c.i32_const(module.alloc(n8));
        const HH = c.i32_const(module.alloc(n8));
        const y2_minus_y1 = c.i32_const(module.alloc(n8));
        const I = c.i32_const(module.alloc(n8));
        const J = c.i32_const(module.alloc(n8));
        const r = c.i32_const(module.alloc(n8));
        const r2 = c.i32_const(module.alloc(n8));
        const V = c.i32_const(module.alloc(n8));
        const V2 = c.i32_const(module.alloc(n8));
        const y1_J2 = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("p1")),
                [
                    ...c.call(prefix + "_copyAffine", c.getLocal("p2"), c.getLocal("pr")),
                    ...c.call(prefixField + "_one", c.i32_add(c.getLocal("pr") , c.i32_const(n8*2))),
                    ...c.ret([])
                ]
            ),
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("p2")),
                [
                    ...c.call(prefix + "_copyAffine", c.getLocal("p1"), c.getLocal("pr")),
                    ...c.call(prefixField + "_one", c.i32_add(c.getLocal("pr") , c.i32_const(n8*2))),
                    ...c.ret([])
                ]
            ),


            c.if(
                c.call(prefixField + "_eq", x1, x2),
                c.if(
                    c.call(prefixField + "_eq", y1, y2),
                    [
                        ...c.call(prefix + "_doubleAffine", c.getLocal("p2"), c.getLocal("pr")),
                        ...c.ret([])
                    ]
                )
            ),

            c.call(prefixField + "_sub", x2, x1, H),
            c.call(prefixField + "_sub", y2, y1, y2_minus_y1),
            c.call(prefixField + "_square", H, HH),
            c.call(prefixField + "_add", HH , HH, I),
            c.call(prefixField + "_add", I , I, I),
            c.call(prefixField + "_mul", H, I, J),
            c.call(prefixField + "_add", y2_minus_y1, y2_minus_y1, r),
            c.call(prefixField + "_mul", x1, I, V),
            c.call(prefixField + "_square", r, r2),
            c.call(prefixField + "_add", V, V, V2),

            c.call(prefixField + "_sub", r2, J, x3),
            c.call(prefixField + "_sub", x3, V2, x3),

            c.call(prefixField + "_mul", y1, J, y1_J2),
            c.call(prefixField + "_add", y1_J2, y1_J2, y1_J2),

            c.call(prefixField + "_sub", V, x3, y3),
            c.call(prefixField + "_mul", y3, r, y3),
            c.call(prefixField + "_sub", y3, y1_J2, y3),

            c.call(prefixField + "_add", H, H, z3),
        );
    }

    function buildNeg() {
        const f = module.addFunction(prefix + "_neg");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const z = c.i32_add(c.getLocal("p1"), c.i32_const(n8*2));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        f.addCode(
            c.call(prefixField + "_copy", x, x3),
            c.call(prefixField + "_neg", y, y3),
            c.call(prefixField + "_copy", z, z3)
        );
    }


    function buildNegAffine() {
        const f = module.addFunction(prefix + "_negAffine");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));

        f.addCode(
            c.call(prefixField + "_copy", x, x3),
            c.call(prefixField + "_neg", y, y3),
        );
    }


    function buildSub() {
        const f = module.addFunction(prefix + "_sub");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8*3));

        f.addCode(
            c.call(prefix + "_neg", c.getLocal("p2"), AUX),
            c.call(prefix + "_add", c.getLocal("p1"), AUX, c.getLocal("pr")),
        );
    }

    function buildSubMixed() {
        const f = module.addFunction(prefix + "_subMixed");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8*3));

        f.addCode(
            c.call(prefix + "_negAffine", c.getLocal("p2"), AUX),
            c.call(prefix + "_addMixed", c.getLocal("p1"), AUX, c.getLocal("pr")),
        );
    }


    function buildSubAffine() {
        const f = module.addFunction(prefix + "_subAffine");
        f.addParam("p1", "i32");
        f.addParam("p2", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8*3));

        f.addCode(
            c.call(prefix + "_negAffine", c.getLocal("p2"), AUX),
            c.call(prefix + "_addAffine", c.getLocal("p1"), AUX, c.getLocal("pr")),
        );
    }

    // This sets Z to One
    function buildNormalize() {
        const f = module.addFunction(prefix + "_normalize");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const z = c.i32_add(c.getLocal("p1"), c.i32_const(n8*2));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));


        const Z_inv = c.i32_const(module.alloc(n8));
        const Z2_inv = c.i32_const(module.alloc(n8));
        const Z3_inv = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                c.call(prefix + "_zero", c.getLocal("pr")),
                [
                    ...c.call(prefixField + "_inverse", z, Z_inv),
                    ...c.call(prefixField + "_square", Z_inv, Z2_inv),
                    ...c.call(prefixField + "_mul", Z_inv, Z2_inv, Z3_inv),
                    ...c.call(prefixField + "_mul", x, Z2_inv, x3),
                    ...c.call(prefixField + "_mul", y, Z3_inv, y3),
                    ...c.call(prefixField + "_one", z3),
                ]
            )
        );
    }


    // Does not set Z.
    function buildToAffine() {
        const f = module.addFunction(prefix + "_toAffine");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const z = c.i32_add(c.getLocal("p1"), c.i32_const(n8*2));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));


        const Z_inv = c.i32_const(module.alloc(n8));
        const Z2_inv = c.i32_const(module.alloc(n8));
        const Z3_inv = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZero", c.getLocal("p1")),
                [
                    ...c.call(prefixField + "_zero", x3),
                    ...c.call(prefixField + "_zero", y3),
                ],
                [
                    ...c.call(prefixField + "_inverse", z, Z_inv),
                    ...c.call(prefixField + "_square", Z_inv, Z2_inv),
                    ...c.call(prefixField + "_mul", Z_inv, Z2_inv, Z3_inv),
                    ...c.call(prefixField + "_mul", x, Z2_inv, x3),
                    ...c.call(prefixField + "_mul", y, Z3_inv, y3),
                ]
            )
        );
    }


    function buildToJacobian() {
        const f = module.addFunction(prefix + "_toJacobian");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(n8));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(n8*2));

        f.addCode(
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("p1")),
                c.call(prefix + "_zero", c.getLocal("pr")),
                [
                    ...c.call(prefixField + "_one", z3),
                    ...c.call(prefixField + "_copy", y, y3),
                    ...c.call(prefixField + "_copy", x, x3)
                ]
            )
        );
    }

    function buildBatchToAffine() {
        const f = module.addFunction(prefix + "_batchToAffine");
        f.addParam("pIn", "i32");
        f.addParam("n", "i32");
        f.addParam("pOut", "i32");
        f.addLocal("pAux", "i32");
        f.addLocal("itIn", "i32");
        f.addLocal("itAux", "i32");
        f.addLocal("itOut", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const tmp = c.i32_const(module.alloc(n8));

        f.addCode(
            c.setLocal("pAux", c.i32_load( c.i32_const(0) )),
            c.i32_store(
                c.i32_const(0),
                c.i32_add(
                    c.getLocal("pAux"),
                    c.i32_mul(c.getLocal("n"), c.i32_const(n8))
                )
            ),

            c.call(
                prefixField + "_batchInverse",
                c.i32_add(c.getLocal("pIn"), c.i32_const(n8*2)),
                c.i32_const(n8*3),
                c.getLocal("n"),
                c.getLocal("pAux"),
                c.i32_const(n8)
            ),

            c.setLocal("itIn", c.getLocal("pIn")),
            c.setLocal("itAux", c.getLocal("pAux")),
            c.setLocal("itOut", c.getLocal("pOut")),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),

                c.if(
                    c.call(prefixField + "_isZero", c.getLocal("itAux")),
                    [
                        ...c.call(prefixField + "_zero", c.getLocal("itOut")),
                        ...c.call(prefixField + "_zero", c.i32_add(c.getLocal("itOut"), c.i32_const(n8)))
                    ],
                    [
                        ...c.call(
                            prefixField+"_mul",
                            c.getLocal("itAux"),
                            c.i32_add(c.getLocal("itIn"), c.i32_const(n8)),
                            tmp,
                        ),
                        ...c.call(
                            prefixField+"_square",
                            c.getLocal("itAux"),
                            c.getLocal("itAux")
                        ),
                        ...c.call(
                            prefixField+"_mul",
                            c.getLocal("itAux"),
                            c.getLocal("itIn"),
                            c.getLocal("itOut"),
                        ),
                        ...c.call(
                            prefixField+"_mul",
                            c.getLocal("itAux"),
                            tmp,
                            c.i32_add(c.getLocal("itOut"), c.i32_const(n8)),
                        ),
                    ]
                ),

                c.setLocal("itIn", c.i32_add(c.getLocal("itIn"), c.i32_const(n8*3))),
                c.setLocal("itOut", c.i32_add(c.getLocal("itOut"), c.i32_const(n8*2))),
                c.setLocal("itAux", c.i32_add(c.getLocal("itAux"), c.i32_const(n8))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),
            c.i32_store(
                c.i32_const(0),
                c.getLocal("pAux")
            )
        );
    }


    // This function is private and does not allow to OVERLAP buffers.
    function buildReverseBytes() {
        const f = module.addFunction(prefix + "__reverseBytes");
        f.addParam("pIn", "i32");
        f.addParam("n", "i32");
        f.addParam("pOut", "i32");
        f.addLocal("itOut", "i32");
        f.addLocal("itIn", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal(
                "itOut",
                c.i32_sub(
                    c.i32_add(
                        c.getLocal("pOut"),
                        c.getLocal("n")
                    ),
                    c.i32_const(1)
                )
            ),
            c.setLocal(
                "itIn",
                c.getLocal("pIn")
            ),
            c.block(c.loop(
                c.br_if(1, c.i32_lt_s( c.getLocal("itOut"), c.getLocal("pOut") )),
                c.i32_store8(
                    c.getLocal("itOut"),
                    c.i32_load8_u(c.getLocal("itIn")),
                ),
                c.setLocal("itOut", c.i32_sub(c.getLocal("itOut"), c.i32_const(1))),
                c.setLocal("itIn", c.i32_add(c.getLocal("itIn"), c.i32_const(1))),
                c.br(0)
            )),
        );

    }

    function buildLEMtoC() {
        const f = module.addFunction(prefix + "_LEMtoC");
        f.addParam("pIn", "i32");
        f.addParam("pOut", "i32");

        const c = f.getCodeBuilder();

        const tmp = c.i32_const(module.alloc(n8));

        f.addCode(
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("pIn")),
                [
                    ...c.call(prefixField + "_zero", c.getLocal("pOut")),
                    ...c.i32_store8(
                        c.getLocal("pOut"),
                        c.i32_const(0x40)
                    ),
                    ...c.ret([])
                ]
            ),
            c.call(prefixField + "_fromMontgomery", c.getLocal("pIn"), tmp),
            c.call(prefix + "__reverseBytes", tmp, c.i32_const(n8), c.getLocal("pOut")),
            c.if(
                c.i32_eq(
                    c.call(prefixField + "_sign", c.i32_add(c.getLocal("pIn"), c.i32_const(n8))),
                    c.i32_const(-1)
                ),
                c.i32_store8(
                    c.getLocal("pOut"),
                    c.i32_or(
                        c.i32_load8_u(c.getLocal("pOut")),
                        c.i32_const(0x80)
                    )
                )
            ),
        );
    }

    function buildLEMtoU() {
        const f = module.addFunction(prefix + "_LEMtoU");
        f.addParam("pIn", "i32");
        f.addParam("pOut", "i32");

        const c = f.getCodeBuilder();

        const pTmp = module.alloc(n8*2);
        const tmp = c.i32_const(pTmp);
        const tmpX = c.i32_const(pTmp);
        const tmpY = c.i32_const(pTmp + n8);

        f.addCode(
            c.if(
                c.call(prefix + "_isZeroAffine", c.getLocal("pIn")),
                [
                    ...c.call(prefix + "_zeroAffine", c.getLocal("pOut")),
                    ...c.ret([])
                ]
            ),

            c.call(prefix + "_fromMontgomeryAffine", c.getLocal("pIn"), tmp),

            c.call(prefix + "__reverseBytes", tmpX, c.i32_const(n8), c.getLocal("pOut")),
            c.call(prefix + "__reverseBytes", tmpY, c.i32_const(n8), c.i32_add(c.getLocal("pOut"), c.i32_const(n8))),
        );
    }

    function buildUtoLEM() {
        const f = module.addFunction(prefix + "_UtoLEM");
        f.addParam("pIn", "i32");
        f.addParam("pOut", "i32");

        const c = f.getCodeBuilder();

        const pTmp = module.alloc(n8*2);
        const tmp = c.i32_const(pTmp);
        const tmpX = c.i32_const(pTmp);
        const tmpY = c.i32_const(pTmp + n8);

        f.addCode(
            c.if(
                c.i32_and(c.i32_load8_u(c.getLocal("pIn")), c.i32_const(0x40)),
                [
                    ...c.call(prefix + "_zeroAffine", c.getLocal("pOut")),
                    ...c.ret([])
                ]
            ),
            c.call(prefix + "__reverseBytes", c.getLocal("pIn"), c.i32_const(n8), tmpX),
            c.call(prefix + "__reverseBytes", c.i32_add(c.getLocal("pIn"), c.i32_const(n8)), c.i32_const(n8), tmpY),
            c.call(prefix + "_toMontgomeryAffine", tmp,  c.getLocal("pOut"))
        );
    }

    function buildCtoLEM() {
        const f = module.addFunction(prefix + "_CtoLEM");
        f.addParam("pIn", "i32");
        f.addParam("pOut", "i32");
        f.addLocal("firstByte", "i32");
        f.addLocal("greatest", "i32");

        const c = f.getCodeBuilder();

        const pTmp = module.alloc(n8*2);
        const tmpX = c.i32_const(pTmp);
        const tmpY = c.i32_const(pTmp + n8);

        f.addCode(
            c.setLocal("firstByte", c.i32_load8_u(c.getLocal("pIn"))),
            c.if(
                c.i32_and(
                    c.getLocal("firstByte"),
                    c.i32_const(0x40)
                ),
                [
                    ...c.call(prefix + "_zeroAffine", c.getLocal("pOut")),
                    ...c.ret([])
                ]
            ),
            c.setLocal(
                "greatest",
                c.i32_and(
                    c.getLocal("firstByte"),
                    c.i32_const(0x80)
                )
            ),

            c.call(prefixField + "_copy", c.getLocal("pIn"), tmpY),
            c.i32_store8(tmpY, c.i32_and(c.getLocal("firstByte"), c.i32_const(0x3F))),
            c.call(prefix + "__reverseBytes", tmpY, c.i32_const(n8), tmpX),
            c.call(prefixField + "_toMontgomery", tmpX, c.getLocal("pOut")),

            c.call(prefixField + "_square", c.getLocal("pOut"), tmpY),
            c.call(prefixField + "_mul", c.getLocal("pOut"), tmpY,  tmpY),
            c.call(prefixField + "_add", tmpY, c.i32_const(pB),  tmpY),

            c.call(prefixField + "_sqrt", tmpY, tmpY),
            c.call(prefixField + "_neg", tmpY, tmpX),

            c.if(
                c.i32_eq(
                    c.call(prefixField + "_sign", tmpY),
                    c.i32_const(-1)
                ),
                c.if(
                    c.getLocal("greatest"),
                    c.call(prefixField + "_copy", tmpY, c.i32_add(c.getLocal("pOut"), c.i32_const(n8))),
                    c.call(prefixField + "_neg", tmpY, c.i32_add(c.getLocal("pOut"), c.i32_const(n8)))
                ),
                c.if(
                    c.getLocal("greatest"),
                    c.call(prefixField + "_neg", tmpY, c.i32_add(c.getLocal("pOut"), c.i32_const(n8))),
                    c.call(prefixField + "_copy", tmpY, c.i32_add(c.getLocal("pOut"), c.i32_const(n8)))
                ),
            )

        );
    }

    function buildInCurveAffine() {
        const f = module.addFunction(prefix + "_inCurveAffine");
        f.addParam("pIn", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("pIn");
        const y = c.i32_add(c.getLocal("pIn"), c.i32_const(n8));

        const y2 = c.i32_const(module.alloc(n8));
        const x3b = c.i32_const(module.alloc(n8));

        f.addCode(
            c.call(prefixField + "_square", y, y2),
            c.call(prefixField + "_square", x, x3b),
            c.call(prefixField + "_mul", x, x3b, x3b),
            c.call(prefixField + "_add", x3b, c.i32_const(pB), x3b),

            c.ret(
                c.call(prefixField + "_eq", y2, x3b)
            )
        );
    }

    function buildInCurve() {
        const f = module.addFunction(prefix + "_inCurve");
        f.addParam("pIn", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const aux = c.i32_const(module.alloc(n8*2));

        f.addCode(
            c.call(prefix + "_toAffine", c.getLocal("pIn"), aux),

            c.ret(
                c.call(prefix + "_inCurveAffine", aux),
            )
        );
    }

    buildIsZeroAffine();
    buildIsZero();
    buildZeroAffine();
    buildZero();
    buildCopyAffine();
    buildCopy();
    buildToJacobian();
    buildEqAffine();
    buildEqMixed();
    buildEq();
    buildDoubleAffine();
    buildDouble();
    buildAddAffine();
    buildAddMixed();
    buildAdd();
    buildNegAffine();
    buildNeg();
    buildSubAffine();
    buildSubMixed();
    buildSub();
    buildFromMontgomeryAffine();
    buildFromMontgomery();
    buildToMontgomeryAffine();
    buildToMontgomery();
    buildToAffine();
    buildInCurveAffine();
    buildInCurve();

    buildBatchToAffine();

    buildNormalize();


    buildReverseBytes();

    buildLEMtoU();
    buildLEMtoC();
    buildUtoLEM();
    buildCtoLEM();

    buildBatchConvertion(module, prefix + "_batchLEMtoU", prefix + "_LEMtoU", n8*2, n8*2);
    buildBatchConvertion(module, prefix + "_batchLEMtoC", prefix + "_LEMtoC", n8*2, n8);
    buildBatchConvertion(module, prefix + "_batchUtoLEM", prefix + "_UtoLEM", n8*2, n8*2);
    buildBatchConvertion(module, prefix + "_batchCtoLEM", prefix + "_CtoLEM", n8, n8*2, true);

    buildBatchConvertion(module, prefix + "_batchToJacobian", prefix + "_toJacobian", n8*2, n8*3, true);

    buildMultiexp(module, prefix, prefix + "_multiexp", prefix + "_add", prefix + "_sub", n8*3);
    buildMultiexp(module, prefix, prefix + "_multiexpAffine", prefix + "_addMixed", prefix + "_subMixed", n8*2);

    /*
    buildTimesScalar(
        module,
        prefix + "_timesScalarOld",
        n8*3,
        prefix + "_add",
        prefix + "_double",
        prefix + "_copy",
        prefix + "_zero",
    );
    */
    buildTimesScalarNAF(
        module,
        prefix + "_timesScalar",
        n8*3,
        prefix + "_add",
        prefix + "_double",
        prefix + "_sub",
        prefix + "_copy",
        prefix + "_zero"
    );

    buildTimesScalarNAF(
        module,
        prefix + "_timesScalarAffine",
        n8*2,
        prefix + "_addMixed",
        prefix + "_double",
        prefix + "_subMixed",
        prefix + "_copyAffine",
        prefix + "_zero"
    );

    module.exportFunction(prefix + "_isZero");
    module.exportFunction(prefix + "_isZeroAffine");

    module.exportFunction(prefix + "_eq");
    module.exportFunction(prefix + "_eqMixed");
    module.exportFunction(prefix + "_eqAffine");

    module.exportFunction(prefix + "_copy");
    module.exportFunction(prefix + "_copyAffine");

    module.exportFunction(prefix + "_zero");
    module.exportFunction(prefix + "_zeroAffine");

    module.exportFunction(prefix + "_double");
    module.exportFunction(prefix + "_doubleAffine");

    module.exportFunction(prefix + "_add");
    module.exportFunction(prefix + "_addMixed");
    module.exportFunction(prefix + "_addAffine");

    module.exportFunction(prefix + "_neg");
    module.exportFunction(prefix + "_negAffine");

    module.exportFunction(prefix + "_sub");
    module.exportFunction(prefix + "_subMixed");
    module.exportFunction(prefix + "_subAffine");

    module.exportFunction(prefix + "_fromMontgomery");
    module.exportFunction(prefix + "_fromMontgomeryAffine");

    module.exportFunction(prefix + "_toMontgomery");
    module.exportFunction(prefix + "_toMontgomeryAffine");

    module.exportFunction(prefix + "_timesScalar");
    module.exportFunction(prefix + "_timesScalarAffine");

    module.exportFunction(prefix + "_normalize");

    // Convertion functions
    module.exportFunction(prefix + "_LEMtoU");
    module.exportFunction(prefix + "_LEMtoC");
    module.exportFunction(prefix + "_UtoLEM");
    module.exportFunction(prefix + "_CtoLEM");

    module.exportFunction(prefix + "_batchLEMtoU");
    module.exportFunction(prefix + "_batchLEMtoC");
    module.exportFunction(prefix + "_batchUtoLEM");
    module.exportFunction(prefix + "_batchCtoLEM");

    module.exportFunction(prefix + "_toAffine");
    module.exportFunction(prefix + "_toJacobian");

    module.exportFunction(prefix + "_batchToAffine");
    module.exportFunction(prefix + "_batchToJacobian");

    module.exportFunction(prefix + "_inCurve");
    module.exportFunction(prefix + "_inCurveAffine");

    /*
    buildG1MulScalar(module, zq);
    module.exportFunction("g1MulScalar");
    */

    return prefix;
};

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

const { isOdd: isOdd$2, modInv: modInv$1, modPow } = bigint;
const utils$2 = utils$5;

var build_fft = function buildFFT(module, prefix, gPrefix, fPrefix, opGtimesF) {

    const n64f = module.modules[fPrefix].n64;
    const n8f = n64f*8;

    const n64g = module.modules[gPrefix].n64;
    const n8g = n64g*8;

    const q = module.modules[fPrefix].q;

    let rem = q - 1n;
    let maxBits = 0;
    while (!isOdd$2(rem)) {
        maxBits ++;
        rem = rem >> 1n;
    }

    let nr = 2n;

    while ( modPow(nr, q >> 1n, q) === 1n ) nr = nr + 1n;

    // console.log(nr);

    const w = new Array(maxBits+1);
    w[maxBits] = modPow(nr, rem, q);

    let n=maxBits-1;
    while (n>=0) {
        w[n] = modPow(w[n+1], 2n, q);
        n--;
    }

    const bytes = [];
    const R = (1n << BigInt(n8f*8)) % q;

    for (let i=0; i<w.length; i++) {
        const m = w[i] * R % q;
        bytes.push(...utils$2.bigInt2BytesLE(m, n8f));
    }

    const ROOTs = module.alloc(bytes);

    const i2 = new Array(maxBits+1);
    i2[0] = 1n;

    for (let i=1; i<=maxBits; i++) {
        i2[i] = i2[i-1] * 2n;
    }

    const bytesi2 =[];
    for (let i=0; i<=maxBits; i++) {
        const m = modInv$1(i2[i], q) * R % q;
        bytesi2.push(...utils$2.bigInt2BytesLE(m, n8f));
    }

    const INV2 = module.alloc(bytesi2);

    const shift = modPow(nr, 2n, q);
    const bytesShiftToSmallM =[];
    const bytesSConst =[];
    for (let i=0; i<=maxBits; i++) {
        const shiftToSmallM = modPow(shift, 2n ** BigInt(i), q);
        const sConst = modInv$1(q + 1n - shiftToSmallM, q);
        bytesShiftToSmallM.push(...utils$2.bigInt2BytesLE(shiftToSmallM * R % q, n8f));
        bytesSConst.push(...utils$2.bigInt2BytesLE(sConst * R % q, n8f));
    }

    const SHIFT_TO_M = module.alloc( bytesShiftToSmallM  );
    const SCONST = module.alloc( bytesSConst  );

    function rev(x) {
        let r=0;
        for (let i=0; i<8; i++) {
            if (x & (1 << i)) {
                r = r | (0x80 >> i);
            }
        }
        return r;
    }

    const rtable = Array(256);
    for (let i=0; i<256; i++) {
        rtable[i] = rev(i);
    }

    const REVTABLE = module.alloc(rtable);


    function buildLog2() {
        const f = module.addFunction(prefix+"__log2");
        f.addParam("n", "i32");
        f.setReturnType("i32");
        f.addLocal("bits", "i32");
        f.addLocal("aux", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal(
                "aux",
                c.i32_shr_u(
                    c.getLocal("n"),
                    c.i32_const(1)
                )
            )
        );
        f.addCode(c.setLocal("bits", c.i32_const(0)));

        f.addCode(c.block(c.loop(
            c.br_if(
                1,
                c.i32_eqz(c.getLocal("aux"))
            ),

            c.setLocal(
                "aux",
                c.i32_shr_u(
                    c.getLocal("aux"),
                    c.i32_const(1)
                )
            ),

            c.setLocal(
                "bits",
                c.i32_add(
                    c.getLocal("bits"),
                    c.i32_const(1)
                )
            ),

            c.br(0)
        )));

        f.addCode(c.if(
            c.i32_ne(
                c.getLocal("n"),
                c.i32_shl(
                    c.i32_const(1),
                    c.getLocal("bits")
                )
            ),
            c.unreachable()
        ));

        f.addCode(c.if(
            c.i32_gt_u(
                c.getLocal("bits"),
                c.i32_const(maxBits)
            ),
            c.unreachable()
        ));

        f.addCode(c.getLocal("bits"));
    }

    function buildFFT() {
        const f = module.addFunction(prefix+"_fft");
        f.addParam("px", "i32");
        f.addParam("n", "i32");

        f.addLocal("bits", "i32");

        const c = f.getCodeBuilder();

        const One = c.i32_const(module.alloc(n8f));

        f.addCode(
            c.setLocal(
                "bits",
                c.call(
                    prefix + "__log2",
                    c.getLocal("n")
                )
            ),
            c.call(fPrefix + "_one", One),
            c.call(
                prefix+"_rawfft",
                c.getLocal("px"),
                c.getLocal("bits"),
                c.i32_const(0),
                One
            )
        );

    }

    function buildIFFT() {
        const f = module.addFunction(prefix+"_ifft");
        f.addParam("px", "i32");
        f.addParam("n", "i32");
        f.addLocal("bits", "i32");
        f.addLocal("pInv2", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal(
                "bits",
                c.call(
                    prefix + "__log2",
                    c.getLocal("n")
                )
            ),
            c.setLocal(
                "pInv2",
                c.i32_add(
                    c.i32_const(INV2),
                    c.i32_mul(
                        c.getLocal("bits"),
                        c.i32_const(n8f)
                    )
                )
            ),

            c.call(
                prefix+"_rawfft",
                c.getLocal("px"),
                c.getLocal("bits"),
                c.i32_const(1),
                c.getLocal("pInv2")
            ),
        );
    }

    function buildRawFFT() {
        const f = module.addFunction(prefix+"_rawfft");
        f.addParam("px", "i32");
        f.addParam("bits", "i32"); // 2 power
        f.addParam("reverse", "i32");
        f.addParam("mulFactor", "i32");

        f.addLocal("s", "i32");
        f.addLocal("k", "i32");
        f.addLocal("j", "i32");
        f.addLocal("m", "i32");
        f.addLocal("mdiv2", "i32");
        f.addLocal("n", "i32");
        f.addLocal("pwm", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");

        const c = f.getCodeBuilder();

        const W = c.i32_const(module.alloc(n8f));
        const T = c.i32_const(module.alloc(n8g));
        const U = c.i32_const(module.alloc(n8g));

        f.addCode(
            c.call(prefix + "__reversePermutation", c.getLocal("px"), c.getLocal("bits")),
            c.setLocal("n", c.i32_shl(c.i32_const(1), c.getLocal("bits"))),
            c.setLocal("s", c.i32_const(1)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_gt_u(
                        c.getLocal("s"),
                        c.getLocal("bits")
                    )
                ),
                c.setLocal("m", c.i32_shl(c.i32_const(1), c.getLocal("s"))),
                c.setLocal("pwm",
                    c.i32_add(
                        c.i32_const(ROOTs),
                        c.i32_mul(
                            c.getLocal("s"),
                            c.i32_const(n8f)
                        )
                    )
                ),
                c.setLocal("k", c.i32_const(0)),
                c.block(c.loop(
                    c.br_if(
                        1,
                        c.i32_ge_u(
                            c.getLocal("k"),
                            c.getLocal("n")
                        )
                    ),

                    c.call(fPrefix + "_one", W),

                    c.setLocal("mdiv2", c.i32_shr_u(c.getLocal("m"), c.i32_const(1)) ),
                    c.setLocal("j", c.i32_const(0)),
                    c.block(c.loop(
                        c.br_if(
                            1,
                            c.i32_ge_u(
                                c.getLocal("j"),
                                c.getLocal("mdiv2")
                            )
                        ),

                        c.setLocal(
                            "idx1",
                            c.i32_add(
                                c.getLocal("px"),
                                c.i32_mul(
                                    c.i32_add(
                                        c.getLocal("k"),
                                        c.getLocal("j")
                                    ),
                                    c.i32_const(n8g)
                                )
                            )
                        ),

                        c.setLocal(
                            "idx2",
                            c.i32_add(
                                c.getLocal("idx1"),
                                c.i32_mul(
                                    c.getLocal("mdiv2"),
                                    c.i32_const(n8g)
                                )
                            )
                        ),

                        c.call(
                            opGtimesF,
                            c.getLocal("idx2"),
                            W,
                            T
                        ),

                        c.call(
                            gPrefix + "_copy",
                            c.getLocal("idx1"),
                            U
                        ),

                        c.call(
                            gPrefix + "_add",
                            U,
                            T,
                            c.getLocal("idx1"),
                        ),

                        c.call(
                            gPrefix + "_sub",
                            U,
                            T,
                            c.getLocal("idx2"),
                        ),

                        c.call(
                            fPrefix + "_mul",
                            W,
                            c.getLocal("pwm"),
                            W,
                        ),

                        c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                        c.br(0)
                    )),

                    c.setLocal("k", c.i32_add(c.getLocal("k"), c.getLocal("m"))),
                    c.br(0)
                )),

                c.setLocal("s", c.i32_add(c.getLocal("s"), c.i32_const(1))),
                c.br(0)
            )),
            c.call(
                prefix + "__fftFinal",
                c.getLocal("px"),
                c.getLocal("bits"),
                c.getLocal("reverse"),
                c.getLocal("mulFactor")
            )
        );
    }


    function buildFinalInverse() {
        const f = module.addFunction(prefix+"__fftFinal");
        f.addParam("px", "i32");
        f.addParam("bits", "i32");
        f.addParam("reverse", "i32");
        f.addParam("mulFactor", "i32");
        f.addLocal("n", "i32");
        f.addLocal("ndiv2", "i32");
        f.addLocal("pInv2", "i32");
        f.addLocal("i", "i32");
        f.addLocal("mask", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");

        const c = f.getCodeBuilder();

        const T = c.i32_const(module.alloc(n8g));

        f.addCode(
            c.if(
                c.i32_and(
                    c.i32_eqz(c.getLocal("reverse")),
                    c.call(fPrefix + "_isOne", c.getLocal("mulFactor"))
                ),
                c.ret([])
            ),
            c.setLocal("n", c.i32_shl( c.i32_const(1), c.getLocal("bits"))),

            c.setLocal("mask", c.i32_sub( c.getLocal("n") , c.i32_const(1))),
            c.setLocal("i", c.i32_const(1)),
            c.setLocal(
                "ndiv2",
                c.i32_shr_u(
                    c.getLocal("n"),
                    c.i32_const(1)
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_ge_u(
                        c.getLocal("i"),
                        c.getLocal("ndiv2")
                    )
                ),

                c.setLocal("idx1",
                    c.i32_add(
                        c.getLocal("px"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal("idx2",
                    c.i32_add(
                        c.getLocal("px"),
                        c.i32_mul(
                            c.i32_sub(
                                c.getLocal("n"),
                                c.getLocal("i")
                            ),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.if(
                    c.getLocal("reverse"),
                    c.if(
                        c.call(fPrefix + "_isOne", c.getLocal("mulFactor")),
                        [
                            ...c.call(gPrefix + "_copy", c.getLocal("idx1"), T),
                            ...c.call(gPrefix + "_copy", c.getLocal("idx2") , c.getLocal("idx1") ),
                            ...c.call(gPrefix + "_copy", T , c.getLocal("idx2")),
                        ],
                        [
                            ...c.call(gPrefix + "_copy", c.getLocal("idx1"), T),
                            ...c.call(opGtimesF , c.getLocal("idx2") , c.getLocal("mulFactor"), c.getLocal("idx1") ),
                            ...c.call(opGtimesF , T , c.getLocal("mulFactor"), c.getLocal("idx2")),
                        ]
                    ),
                    c.if(
                        c.call(fPrefix + "_isOne", c.getLocal("mulFactor")),
                        [
                            // Do nothing (It should not be here)
                        ],
                        [
                            ...c.call(opGtimesF , c.getLocal("idx1") , c.getLocal("mulFactor"), c.getLocal("idx1") ),
                            ...c.call(opGtimesF , c.getLocal("idx2") , c.getLocal("mulFactor"), c.getLocal("idx2")),
                        ]
                    )
                ),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),

                c.br(0)
            )),

            c.if(
                c.call(fPrefix + "_isOne", c.getLocal("mulFactor")),
                [
                    // Do nothing (It should not be here)
                ],
                [
                    ...c.call(opGtimesF, c.getLocal("px") , c.getLocal("mulFactor"), c.getLocal("px")),
                    ...c.setLocal("idx2",
                        c.i32_add(
                            c.getLocal("px"),
                            c.i32_mul(
                                c.getLocal("ndiv2"),
                                c.i32_const(n8g)
                            )
                        )
                    ),
                    ...c.call(opGtimesF, c.getLocal("idx2"),c.getLocal("mulFactor"), c.getLocal("idx2"))
                ]
            )
        );
    }

    function buildReversePermutation() {
        const f = module.addFunction(prefix+"__reversePermutation");
        f.addParam("px", "i32");
        f.addParam("bits", "i32");
        f.addLocal("n", "i32");
        f.addLocal("i", "i32");
        f.addLocal("ri", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");

        const c = f.getCodeBuilder();

        const T = c.i32_const(module.alloc(n8g));

        f.addCode(
            c.setLocal("n", c.i32_shl( c.i32_const(1), c.getLocal("bits"))),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("n")
                    )
                ),

                c.setLocal("idx1",
                    c.i32_add(
                        c.getLocal("px"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal("ri", c.call(prefix + "__rev", c.getLocal("i"), c.getLocal("bits"))),

                c.setLocal("idx2",
                    c.i32_add(
                        c.getLocal("px"),
                        c.i32_mul(
                            c.getLocal("ri"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.if(
                    c.i32_lt_u(
                        c.getLocal("i"),
                        c.getLocal("ri")
                    ),
                    [
                        ...c.call(gPrefix + "_copy", c.getLocal("idx1"), T),
                        ...c.call(gPrefix + "_copy", c.getLocal("idx2") , c.getLocal("idx1")),
                        ...c.call(gPrefix + "_copy", T , c.getLocal("idx2"))
                    ]
                ),

                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),

                c.br(0)
            ))
        );
    }

    function buildRev() {
        const f = module.addFunction(prefix+"__rev");
        f.addParam("x", "i32");
        f.addParam("bits", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.i32_rotl(
                c.i32_add(
                    c.i32_add(
                        c.i32_shl(
                            c.i32_load8_u(
                                c.i32_and(
                                    c.getLocal("x"),
                                    c.i32_const(0xFF)
                                ),
                                REVTABLE,
                                0
                            ),
                            c.i32_const(24)
                        ),
                        c.i32_shl(
                            c.i32_load8_u(
                                c.i32_and(
                                    c.i32_shr_u(
                                        c.getLocal("x"),
                                        c.i32_const(8)
                                    ),
                                    c.i32_const(0xFF)
                                ),
                                REVTABLE,
                                0
                            ),
                            c.i32_const(16)
                        ),
                    ),
                    c.i32_add(
                        c.i32_shl(
                            c.i32_load8_u(
                                c.i32_and(
                                    c.i32_shr_u(
                                        c.getLocal("x"),
                                        c.i32_const(16)
                                    ),
                                    c.i32_const(0xFF)
                                ),
                                REVTABLE,
                                0
                            ),
                            c.i32_const(8)
                        ),
                        c.i32_load8_u(
                            c.i32_and(
                                c.i32_shr_u(
                                    c.getLocal("x"),
                                    c.i32_const(24)
                                ),
                                c.i32_const(0xFF)
                            ),
                            REVTABLE,
                            0
                        ),
                    )
                ),
                c.getLocal("bits")
            )
        );
    }


    function buildFFTJoin() {
        const f = module.addFunction(prefix+"_fftJoin");
        f.addParam("pBuff1", "i32");
        f.addParam("pBuff2", "i32");
        f.addParam("n", "i32");
        f.addParam("first", "i32");
        f.addParam("inc", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const W = c.i32_const(module.alloc(n8f));
        const T = c.i32_const(module.alloc(n8g));
        const U = c.i32_const(module.alloc(n8g));

        f.addCode(
            c.call( fPrefix + "_copy", c.getLocal("first"), W),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("n")
                    )
                ),

                c.setLocal(
                    "idx1",
                    c.i32_add(
                        c.getLocal("pBuff1"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal(
                    "idx2",
                    c.i32_add(
                        c.getLocal("pBuff2"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    W,
                    T
                ),

                c.call(
                    gPrefix + "_copy",
                    c.getLocal("idx1"),
                    U
                ),

                c.call(
                    gPrefix + "_add",
                    U,
                    T,
                    c.getLocal("idx1"),
                ),

                c.call(
                    gPrefix + "_sub",
                    U,
                    T,
                    c.getLocal("idx2"),
                ),

                c.call(
                    fPrefix + "_mul",
                    W,
                    c.getLocal("inc"),
                    W,
                ),

                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }


    function buildFFTJoinExt() {
        const f = module.addFunction(prefix+"_fftJoinExt");
        f.addParam("pBuff1", "i32");
        f.addParam("pBuff2", "i32");
        f.addParam("n", "i32");
        f.addParam("first", "i32");
        f.addParam("inc", "i32");
        f.addParam("totalBits", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");
        f.addLocal("i", "i32");
        f.addLocal("pShiftToM", "i32");

        const c = f.getCodeBuilder();

        const W = c.i32_const(module.alloc(n8f));
        const U = c.i32_const(module.alloc(n8g));

        f.addCode(

            c.setLocal("pShiftToM",
                c.i32_add(
                    c.i32_const(SHIFT_TO_M),
                    c.i32_mul(
                        c.getLocal("totalBits"),
                        c.i32_const(n8f)
                    )
                )
            ),


            c.call( fPrefix + "_copy", c.getLocal("first"), W),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("n")
                    )
                ),

                c.setLocal(
                    "idx1",
                    c.i32_add(
                        c.getLocal("pBuff1"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal(
                    "idx2",
                    c.i32_add(
                        c.getLocal("pBuff2"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.call(
                    gPrefix + "_add",
                    c.getLocal("idx1"),
                    c.getLocal("idx2"),
                    U
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    c.getLocal("pShiftToM"),
                    c.getLocal("idx2")
                ),

                c.call(
                    gPrefix + "_add",
                    c.getLocal("idx1"),
                    c.getLocal("idx2"),
                    c.getLocal("idx2")
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    W,
                    c.getLocal("idx2"),
                ),

                c.call(
                    gPrefix + "_copy",
                    U,
                    c.getLocal("idx1")
                ),

                c.call(
                    fPrefix + "_mul",
                    W,
                    c.getLocal("inc"),
                    W
                ),

                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }

    function buildFFTJoinExtInv() {
        const f = module.addFunction(prefix+"_fftJoinExtInv");
        f.addParam("pBuff1", "i32");
        f.addParam("pBuff2", "i32");
        f.addParam("n", "i32");
        f.addParam("first", "i32");
        f.addParam("inc", "i32");
        f.addParam("totalBits", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");
        f.addLocal("i", "i32");
        f.addLocal("pShiftToM", "i32");
        f.addLocal("pSConst", "i32");

        const c = f.getCodeBuilder();

        const W = c.i32_const(module.alloc(n8f));
        const U = c.i32_const(module.alloc(n8g));

        f.addCode(

            c.setLocal("pShiftToM",
                c.i32_add(
                    c.i32_const(SHIFT_TO_M),
                    c.i32_mul(
                        c.getLocal("totalBits"),
                        c.i32_const(n8f)
                    )
                )
            ),
            c.setLocal("pSConst",
                c.i32_add(
                    c.i32_const(SCONST),
                    c.i32_mul(
                        c.getLocal("totalBits"),
                        c.i32_const(n8f)
                    )
                )
            ),


            c.call( fPrefix + "_copy", c.getLocal("first"), W),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("n")
                    )
                ),

                c.setLocal(
                    "idx1",
                    c.i32_add(
                        c.getLocal("pBuff1"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal(
                    "idx2",
                    c.i32_add(
                        c.getLocal("pBuff2"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    W,
                    U
                ),

                c.call(
                    gPrefix + "_sub",
                    c.getLocal("idx1"),
                    U,
                    c.getLocal("idx2"),
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    c.getLocal("pSConst"),
                    c.getLocal("idx2")
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx1"),
                    c.getLocal("pShiftToM"),
                    c.getLocal("idx1")
                ),

                c.call(
                    gPrefix + "_sub",
                    U,
                    c.getLocal("idx1"),
                    c.getLocal("idx1")
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx1"),
                    c.getLocal("pSConst"),
                    c.getLocal("idx1")
                ),

                c.call(
                    fPrefix + "_mul",
                    W,
                    c.getLocal("inc"),
                    W
                ),

                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }



    function buildPrepareLagrangeEvaluation() {
        const f = module.addFunction(prefix+"_prepareLagrangeEvaluation");
        f.addParam("pBuff1", "i32");
        f.addParam("pBuff2", "i32");
        f.addParam("n", "i32");
        f.addParam("first", "i32");
        f.addParam("inc", "i32");
        f.addParam("totalBits", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");
        f.addLocal("i", "i32");
        f.addLocal("pShiftToM", "i32");
        f.addLocal("pSConst", "i32");

        const c = f.getCodeBuilder();

        const W = c.i32_const(module.alloc(n8f));
        const U = c.i32_const(module.alloc(n8g));

        f.addCode(

            c.setLocal("pShiftToM",
                c.i32_add(
                    c.i32_const(SHIFT_TO_M),
                    c.i32_mul(
                        c.getLocal("totalBits"),
                        c.i32_const(n8f)
                    )
                )
            ),
            c.setLocal("pSConst",
                c.i32_add(
                    c.i32_const(SCONST),
                    c.i32_mul(
                        c.getLocal("totalBits"),
                        c.i32_const(n8f)
                    )
                )
            ),


            c.call( fPrefix + "_copy", c.getLocal("first"), W),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("n")
                    )
                ),

                c.setLocal(
                    "idx1",
                    c.i32_add(
                        c.getLocal("pBuff1"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal(
                    "idx2",
                    c.i32_add(
                        c.getLocal("pBuff2"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),


                c.call(
                    opGtimesF,
                    c.getLocal("idx1"),
                    c.getLocal("pShiftToM"),
                    U
                ),

                c.call(
                    gPrefix + "_sub",
                    c.getLocal("idx2"),
                    U,
                    U
                ),

                c.call(
                    gPrefix + "_sub",
                    c.getLocal("idx1"),
                    c.getLocal("idx2"),
                    c.getLocal("idx2"),
                ),

                c.call(
                    opGtimesF,
                    U,
                    c.getLocal("pSConst"),
                    c.getLocal("idx1"),
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    W,
                    c.getLocal("idx2"),
                ),

                c.call(
                    fPrefix + "_mul",
                    W,
                    c.getLocal("inc"),
                    W
                ),

                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }

    function buildFFTMix() {
        const f = module.addFunction(prefix+"_fftMix");
        f.addParam("pBuff", "i32");
        f.addParam("n", "i32");
        f.addParam("exp", "i32");
        f.addLocal("nGroups", "i32");
        f.addLocal("nPerGroup", "i32");
        f.addLocal("nPerGroupDiv2", "i32");
        f.addLocal("pairOffset", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        f.addLocal("pwm", "i32");

        const c = f.getCodeBuilder();

        const W = c.i32_const(module.alloc(n8f));
        const T = c.i32_const(module.alloc(n8g));
        const U = c.i32_const(module.alloc(n8g));

        f.addCode(
            c.setLocal("nPerGroup", c.i32_shl(c.i32_const(1), c.getLocal("exp"))),
            c.setLocal("nPerGroupDiv2", c.i32_shr_u(c.getLocal("nPerGroup"), c.i32_const(1))),
            c.setLocal("nGroups", c.i32_shr_u(c.getLocal("n"), c.getLocal("exp"))),
            c.setLocal("pairOffset", c.i32_mul(c.getLocal("nPerGroupDiv2"), c.i32_const(n8g))),
            c.setLocal("pwm",
                c.i32_add(
                    c.i32_const(ROOTs),
                    c.i32_mul(
                        c.getLocal("exp"),
                        c.i32_const(n8f)
                    )
                )
            ),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("nGroups")
                    )
                ),
                c.call( fPrefix + "_one", W),
                c.setLocal("j", c.i32_const(0)),
                c.block(c.loop(
                    c.br_if(
                        1,
                        c.i32_eq(
                            c.getLocal("j"),
                            c.getLocal("nPerGroupDiv2")
                        )
                    ),

                    c.setLocal(
                        "idx1",
                        c.i32_add(
                            c.getLocal("pBuff"),
                            c.i32_mul(
                                c.i32_add(
                                    c.i32_mul(
                                        c.getLocal("i"),
                                        c.getLocal("nPerGroup")
                                    ),
                                    c.getLocal("j")
                                ),
                                c.i32_const(n8g)
                            )
                        )
                    ),

                    c.setLocal(
                        "idx2",
                        c.i32_add(
                            c.getLocal("idx1"),
                            c.getLocal("pairOffset")
                        )
                    ),

                    c.call(
                        opGtimesF,
                        c.getLocal("idx2"),
                        W,
                        T
                    ),

                    c.call(
                        gPrefix + "_copy",
                        c.getLocal("idx1"),
                        U
                    ),

                    c.call(
                        gPrefix + "_add",
                        U,
                        T,
                        c.getLocal("idx1"),
                    ),

                    c.call(
                        gPrefix + "_sub",
                        U,
                        T,
                        c.getLocal("idx2"),
                    ),

                    c.call(
                        fPrefix + "_mul",
                        W,
                        c.getLocal("pwm"),
                        W,
                    ),
                    c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                    c.br(0)
                )),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }


    // Reverse all and multiply by factor
    function buildFFTFinal() {
        const f = module.addFunction(prefix+"_fftFinal");
        f.addParam("pBuff", "i32");
        f.addParam("n", "i32");
        f.addParam("factor", "i32");
        f.addLocal("idx1", "i32");
        f.addLocal("idx2", "i32");
        f.addLocal("i", "i32");
        f.addLocal("ndiv2", "i32");

        const c = f.getCodeBuilder();

        const T = c.i32_const(module.alloc(n8g));

        f.addCode(
            c.setLocal("ndiv2", c.i32_shr_u(c.getLocal("n"), c.i32_const(1))),
            c.if(
                c.i32_and(
                    c.getLocal("n"),
                    c.i32_const(1)
                ),
                c.call(
                    opGtimesF,
                    c.i32_add(
                        c.getLocal("pBuff"),
                        c.i32_mul(
                            c.getLocal("ndiv2"),
                            c.i32_const(n8g)
                        )
                    ),
                    c.getLocal("factor"),
                    c.i32_add(
                        c.getLocal("pBuff"),
                        c.i32_mul(
                            c.getLocal("ndiv2"),
                            c.i32_const(n8g)
                        )
                    ),
                ),
            ),
            c.setLocal("i", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_ge_u(
                        c.getLocal("i"),
                        c.getLocal("ndiv2")
                    )
                ),

                c.setLocal(
                    "idx1",
                    c.i32_add(
                        c.getLocal("pBuff"),
                        c.i32_mul(
                            c.getLocal("i"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal(
                    "idx2",
                    c.i32_add(
                        c.getLocal("pBuff"),
                        c.i32_mul(
                            c.i32_sub(
                                c.i32_sub(
                                    c.getLocal("n"),
                                    c.i32_const(1)
                                ),
                                c.getLocal("i")
                            ),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx2"),
                    c.getLocal("factor"),
                    T
                ),

                c.call(
                    opGtimesF,
                    c.getLocal("idx1"),
                    c.getLocal("factor"),
                    c.getLocal("idx2"),
                ),

                c.call(
                    gPrefix + "_copy",
                    T,
                    c.getLocal("idx1"),
                ),

                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }

    buildRev();
    buildReversePermutation();
    buildFinalInverse();
    buildRawFFT();
    buildLog2();
    buildFFT();
    buildIFFT();
    buildFFTJoin();
    buildFFTJoinExt();
    buildFFTJoinExtInv();
    buildFFTMix();
    buildFFTFinal();
    buildPrepareLagrangeEvaluation();

    module.exportFunction(prefix+"__reversePermutation");
    module.exportFunction(prefix+"_fft");
    module.exportFunction(prefix+"_ifft");
    module.exportFunction(prefix+"_rawfft");
    module.exportFunction(prefix+"_fftJoin");
    module.exportFunction(prefix+"_fftJoinExt");
    module.exportFunction(prefix+"_fftJoinExtInv");
    module.exportFunction(prefix+"_fftMix");
    module.exportFunction(prefix+"_fftFinal");
    module.exportFunction(prefix+"_prepareLagrangeEvaluation");

};

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

var build_pol = function buildPol(module, prefix, prefixField) {

    const n64 = module.modules[prefixField].n64;
    const n8 = n64*8;


    function buildZero() {
        const f = module.addFunction(prefix+"_zero");
        f.addParam("px", "i32");
        f.addParam("n", "i32");
        f.addLocal("lastp", "i32");
        f.addLocal("p", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal("p", c.getLocal("px")),
            c.setLocal(
                "lastp",
                c.i32_add(
                    c.getLocal("px"),
                    c.i32_mul(
                        c.getLocal("n"),
                        c.i32_const(n8)
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("p"),
                        c.getLocal("lastp")
                    )
                ),
                c.call(prefixField + "_zero", c.getLocal("p")),
                c.setLocal("p", c.i32_add(c.getLocal("p"), c.i32_const(n8))),
                c.br(0)
            ))
        );
    }

    function buildConstructLC() {
        const f = module.addFunction(prefix+"_constructLC");
        f.addParam("ppolynomials", "i32");
        f.addParam("psignals", "i32");
        f.addParam("nSignals", "i32");
        f.addParam("pres", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        f.addLocal("pp", "i32");
        f.addLocal("ps", "i32");
        f.addLocal("pd", "i32");
        f.addLocal("ncoefs", "i32");

        const c = f.getCodeBuilder();

        const aux = c.i32_const(module.alloc(n8));

        f.addCode(
            c.setLocal("i", c.i32_const(0)),
            c.setLocal("pp", c.getLocal("ppolynomials")),
            c.setLocal("ps", c.getLocal("psignals")),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("i"),
                        c.getLocal("nSignals")
                    )
                ),

                c.setLocal("ncoefs", c.i32_load(c.getLocal("pp"))),
                c.setLocal("pp", c.i32_add(c.getLocal("pp"), c.i32_const(4))),

                c.setLocal("j", c.i32_const(0)),
                c.block(c.loop(
                    c.br_if(
                        1,
                        c.i32_eq(
                            c.getLocal("j"),
                            c.getLocal("ncoefs")
                        )
                    ),

                    c.setLocal(
                        "pd",
                        c.i32_add(
                            c.getLocal("pres"),
                            c.i32_mul(
                                c.i32_load(c.getLocal("pp")),
                                c.i32_const(n8)
                            )
                        )
                    ),

                    c.setLocal("pp", c.i32_add(c.getLocal("pp"), c.i32_const(4))),


                    c.call(
                        prefixField + "_mul",
                        c.getLocal("ps"),
                        c.getLocal("pp"),
                        aux
                    ),

                    c.call(
                        prefixField + "_add",
                        aux,
                        c.getLocal("pd"),
                        c.getLocal("pd")
                    ),

                    c.setLocal("pp", c.i32_add(c.getLocal("pp"), c.i32_const(n8))),
                    c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                    c.br(0)
                )),

                c.setLocal("ps", c.i32_add(c.getLocal("ps"), c.i32_const(n8))),
                c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );

    }

    buildZero();
    buildConstructLC();


    module.exportFunction(prefix + "_zero");
    module.exportFunction(prefix + "_constructLC");

    return prefix;




};

var build_qap = function buildQAP(module, prefix, prefixField) {

    const n64 = module.modules[prefixField].n64;
    const n8 = n64*8;


    function buildBuildABC() {
        const f = module.addFunction(prefix+"_buildABC");
        f.addParam("pCoefs", "i32");
        f.addParam("nCoefs", "i32");
        f.addParam("pWitness", "i32");
        f.addParam("pA", "i32");
        f.addParam("pB", "i32");
        f.addParam("pC", "i32");
        f.addParam("offsetOut", "i32");
        f.addParam("nOut", "i32");
        f.addParam("offsetWitness", "i32");
        f.addParam("nWitness", "i32");
        f.addLocal("it", "i32");
        f.addLocal("ita", "i32");
        f.addLocal("itb", "i32");
        f.addLocal("last", "i32");
        f.addLocal("m", "i32");
        f.addLocal("c", "i32");
        f.addLocal("s", "i32");
        f.addLocal("pOut", "i32");

        const c = f.getCodeBuilder();

        const aux = c.i32_const(module.alloc(n8));

        f.addCode(

            // Set output a and b to 0
            c.setLocal("ita", c.getLocal("pA")),
            c.setLocal("itb", c.getLocal("pB")),
            c.setLocal(
                "last",
                c.i32_add(
                    c.getLocal("pA"),
                    c.i32_mul(
                        c.getLocal("nOut"),
                        c.i32_const(n8)
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("ita"),
                        c.getLocal("last")
                    )
                ),
                c.call(prefixField + "_zero", c.getLocal("ita")),
                c.call(prefixField + "_zero", c.getLocal("itb")),
                c.setLocal("ita", c.i32_add(c.getLocal("ita"), c.i32_const(n8))),
                c.setLocal("itb", c.i32_add(c.getLocal("itb"), c.i32_const(n8))),
                c.br(0)
            )),


            c.setLocal("it", c.getLocal("pCoefs")),
            c.setLocal(
                "last",
                c.i32_add(
                    c.getLocal("pCoefs"),
                    c.i32_mul(
                        c.getLocal("nCoefs"),
                        c.i32_const(n8+12)
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("it"),
                        c.getLocal("last")
                    )
                ),
                c.setLocal(
                    "s",
                    c.i32_load(c.getLocal("it"), 8)
                ),
                c.if(
                    c.i32_or(
                        c.i32_lt_u(
                            c.getLocal("s"),
                            c.getLocal("offsetWitness"),
                        ),
                        c.i32_ge_u(
                            c.getLocal("s"),
                            c.i32_add(
                                c.getLocal("offsetWitness"),
                                c.getLocal("nWitness"),
                            )
                        )
                    ),
                    [
                        ...c.setLocal("it", c.i32_add(c.getLocal("it"), c.i32_const(n8+12))),
                        ...c.br(1)
                    ]
                ),

                c.setLocal(
                    "m",
                    c.i32_load(c.getLocal("it"))
                ),
                c.if(
                    c.i32_eq(c.getLocal("m"), c.i32_const(0)),
                    c.setLocal("pOut", c.getLocal("pA")),
                    c.if(
                        c.i32_eq(c.getLocal("m"), c.i32_const(1)),
                        c.setLocal("pOut", c.getLocal("pB")),
                        [
                            ...c.setLocal("it", c.i32_add(c.getLocal("it"), c.i32_const(n8+12))),
                            ...c.br(1)
                        ]
                    )
                ),
                c.setLocal(
                    "c",
                    c.i32_load(c.getLocal("it"), 4)
                ),
                c.if(
                    c.i32_or(
                        c.i32_lt_u(
                            c.getLocal("c"),
                            c.getLocal("offsetOut"),
                        ),
                        c.i32_ge_u(
                            c.getLocal("c"),
                            c.i32_add(
                                c.getLocal("offsetOut"),
                                c.getLocal("nOut"),
                            )
                        )
                    ),
                    [
                        ...c.setLocal("it", c.i32_add(c.getLocal("it"), c.i32_const(n8+12))),
                        ...c.br(1)
                    ]
                ),
                c.setLocal(
                    "pOut",
                    c.i32_add(
                        c.getLocal("pOut"),
                        c.i32_mul(
                            c.i32_sub(
                                c.getLocal("c"),
                                c.getLocal("offsetOut")
                            ),
                            c.i32_const(n8)
                        )
                    )
                ),
                c.call(
                    prefixField + "_mul",
                    c.i32_add(
                        c.getLocal("pWitness"),
                        c.i32_mul(
                            c.i32_sub(c.getLocal("s"), c.getLocal("offsetWitness")),
                            c.i32_const(n8)
                        )
                    ),
                    c.i32_add( c.getLocal("it"), c.i32_const(12)),
                    aux
                ),
                c.call(
                    prefixField + "_add",
                    c.getLocal("pOut"),
                    aux,
                    c.getLocal("pOut"),
                ),
                c.setLocal("it", c.i32_add(c.getLocal("it"), c.i32_const(n8+12))),
                c.br(0)
            )),

            c.setLocal("ita", c.getLocal("pA")),
            c.setLocal("itb", c.getLocal("pB")),
            c.setLocal("it", c.getLocal("pC")),
            c.setLocal(
                "last",
                c.i32_add(
                    c.getLocal("pA"),
                    c.i32_mul(
                        c.getLocal("nOut"),
                        c.i32_const(n8)
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("ita"),
                        c.getLocal("last")
                    )
                ),
                c.call(
                    prefixField + "_mul",
                    c.getLocal("ita"),
                    c.getLocal("itb"),
                    c.getLocal("it")
                ),
                c.setLocal("ita", c.i32_add(c.getLocal("ita"), c.i32_const(n8))),
                c.setLocal("itb", c.i32_add(c.getLocal("itb"), c.i32_const(n8))),
                c.setLocal("it", c.i32_add(c.getLocal("it"), c.i32_const(n8))),
                c.br(0)
            )),

        );
    }

    function buildJoinABC() {
        const f = module.addFunction(prefix+"_joinABC");
        f.addParam("pA", "i32");
        f.addParam("pB", "i32");
        f.addParam("pC", "i32");
        f.addParam("n", "i32");
        f.addParam("pP", "i32");
        f.addLocal("ita", "i32");
        f.addLocal("itb", "i32");
        f.addLocal("itc", "i32");
        f.addLocal("itp", "i32");
        f.addLocal("last", "i32");

        const c = f.getCodeBuilder();

        const aux = c.i32_const(module.alloc(n8));

        f.addCode(
            c.setLocal("ita", c.getLocal("pA")),
            c.setLocal("itb", c.getLocal("pB")),
            c.setLocal("itc", c.getLocal("pC")),
            c.setLocal("itp", c.getLocal("pP")),
            c.setLocal(
                "last",
                c.i32_add(
                    c.getLocal("pA"),
                    c.i32_mul(
                        c.getLocal("n"),
                        c.i32_const(n8)
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("ita"),
                        c.getLocal("last")
                    )
                ),
                c.call(
                    prefixField + "_mul",
                    c.getLocal("ita"),
                    c.getLocal("itb"),
                    aux
                ),
                c.call(
                    prefixField + "_sub",
                    aux,
                    c.getLocal("itc"),
                    c.getLocal("itp"),
                ),
                c.setLocal("ita", c.i32_add(c.getLocal("ita"), c.i32_const(n8))),
                c.setLocal("itb", c.i32_add(c.getLocal("itb"), c.i32_const(n8))),
                c.setLocal("itc", c.i32_add(c.getLocal("itc"), c.i32_const(n8))),
                c.setLocal("itp", c.i32_add(c.getLocal("itp"), c.i32_const(n8))),
                c.br(0)
            ))
        );
    }

    function buildBatchAdd() {
        const f = module.addFunction(prefix+"_batchAdd");
        f.addParam("pa", "i32");
        f.addParam("pb", "i32");
        f.addParam("n", "i32");
        f.addParam("pr", "i32");
        f.addLocal("ita", "i32");
        f.addLocal("itb", "i32");
        f.addLocal("itr", "i32");
        f.addLocal("last", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.setLocal("ita", c.getLocal("pa")),
            c.setLocal("itb", c.getLocal("pb")),
            c.setLocal("itr", c.getLocal("pr")),
            c.setLocal(
                "last",
                c.i32_add(
                    c.getLocal("pa"),
                    c.i32_mul(
                        c.getLocal("n"),
                        c.i32_const(n8)
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("ita"),
                        c.getLocal("last")
                    )
                ),
                c.call(
                    prefixField + "_add",
                    c.getLocal("ita"),
                    c.getLocal("itb"),
                    c.getLocal("itr"),
                ),
                c.setLocal("ita", c.i32_add(c.getLocal("ita"), c.i32_const(n8))),
                c.setLocal("itb", c.i32_add(c.getLocal("itb"), c.i32_const(n8))),
                c.setLocal("itr", c.i32_add(c.getLocal("itr"), c.i32_const(n8))),
                c.br(0)
            ))
        );
    }

    buildBuildABC();
    buildJoinABC();
    buildBatchAdd();

    module.exportFunction(prefix + "_buildABC");
    module.exportFunction(prefix + "_joinABC");
    module.exportFunction(prefix + "_batchAdd");

    return prefix;

};

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

var build_applykey = function buildApplyKey(module, fnName, gPrefix, frPrefix, sizeGIn, sizeGOut, sizeF, opGtimesF) {

    const f = module.addFunction(fnName);
    f.addParam("pIn", "i32");
    f.addParam("n", "i32");
    f.addParam("pFirst", "i32");
    f.addParam("pInc", "i32");
    f.addParam("pOut", "i32");
    f.addLocal("pOldFree", "i32");
    f.addLocal("i", "i32");
    f.addLocal("pFrom", "i32");
    f.addLocal("pTo", "i32");

    const c = f.getCodeBuilder();

    const t = c.i32_const(module.alloc(sizeF));

    f.addCode(
        c.setLocal("pFrom", c.getLocal("pIn")),
        c.setLocal("pTo", c.getLocal("pOut")),
    );

    // t = first
    f.addCode(
        c.call(
            frPrefix + "_copy",
            c.getLocal("pFirst"),
            t
        )
    );
    f.addCode(
        c.setLocal("i", c.i32_const(0)),
        c.block(c.loop(
            c.br_if(1, c.i32_eq ( c.getLocal("i"), c.getLocal("n") )),

            c.call(
                opGtimesF,
                c.getLocal("pFrom"),
                t,
                c.getLocal("pTo")
            ),
            c.setLocal("pFrom", c.i32_add(c.getLocal("pFrom"), c.i32_const(sizeGIn))),
            c.setLocal("pTo", c.i32_add(c.getLocal("pTo"), c.i32_const(sizeGOut))),

            // t = t* inc
            c.call(
                frPrefix + "_mul",
                t,
                c.getLocal("pInc"),
                t
            ),
            c.setLocal("i", c.i32_add(c.getLocal("i"), c.i32_const(1))),
            c.br(0)
        ))
    );

    module.exportFunction(fnName);

};

const utils$1 = utils$5;

const buildF1m$1 =build_f1m;
const buildF1$1 =build_f1;
const buildF2m$1 =build_f2m;
const buildF3m$1 =build_f3m;
const buildCurve$1 =build_curve_jacobian_a0;
const buildFFT$1 = build_fft;
const buildPol$1 = build_pol;
const buildQAP$1 = build_qap;
const buildApplyKey$1 = build_applykey;
const { bitLength: bitLength$1, modInv, isOdd: isOdd$1, isNegative: isNegative$1 } = bigint;

var build_bn128 = function buildBN128(module, _prefix) {

    const prefix = _prefix || "bn128";

    if (module.modules[prefix]) return prefix;  // already builded

    const q = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;
    const r = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;


    const n64 = Math.floor((bitLength$1(q - 1n) - 1)/64) +1;
    const n8 = n64*8;
    const frsize = n8;
    const f1size = n8;
    const f2size = f1size * 2;
    const ftsize = f1size * 12;

    const pr = module.alloc(utils$1.bigInt2BytesLE( r, frsize ));

    const f1mPrefix = buildF1m$1(module, q, "f1m");
    buildF1$1(module, r, "fr", "frm");

    const pG1b = module.alloc(utils$1.bigInt2BytesLE( toMontgomery(3n), f1size ));
    const g1mPrefix = buildCurve$1(module, "g1m", "f1m", pG1b);

    buildFFT$1(module, "frm", "frm", "frm", "frm_mul");

    buildPol$1(module, "pol", "frm");
    buildQAP$1(module, "qap", "frm");

    const f2mPrefix = buildF2m$1(module, "f1m_neg", "f2m", "f1m");
    const pG2b = module.alloc([
        ...utils$1.bigInt2BytesLE( toMontgomery(19485874751759354771024239261021720505790618469301721065564631296452457478373n), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(266929791119991161246907387137283842545076965332900288569378510910307636690n), f1size )
    ]);
    const g2mPrefix = buildCurve$1(module, "g2m", "f2m", pG2b);


    function buildGTimesFr(fnName, opMul) {
        const f = module.addFunction(fnName);
        f.addParam("pG", "i32");
        f.addParam("pFr", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8));

        f.addCode(
            c.call("frm_fromMontgomery", c.getLocal("pFr"), AUX),
            c.call(
                opMul,
                c.getLocal("pG"),
                AUX,
                c.i32_const(n8),
                c.getLocal("pr")
            )
        );

        module.exportFunction(fnName);
    }
    buildGTimesFr("g1m_timesFr", "g1m_timesScalar");
    buildFFT$1(module, "g1m", "g1m", "frm", "g1m_timesFr");

    buildGTimesFr("g2m_timesFr", "g2m_timesScalar");
    buildFFT$1(module, "g2m", "g2m", "frm", "g2m_timesFr");

    buildGTimesFr("g1m_timesFrAffine", "g1m_timesScalarAffine");
    buildGTimesFr("g2m_timesFrAffine", "g2m_timesScalarAffine");

    buildApplyKey$1(module, "frm_batchApplyKey", "fmr", "frm", n8, n8, n8, "frm_mul");
    buildApplyKey$1(module, "g1m_batchApplyKey", "g1m", "frm", n8*3, n8*3, n8, "g1m_timesFr");
    buildApplyKey$1(module, "g1m_batchApplyKeyMixed", "g1m", "frm", n8*2, n8*3, n8, "g1m_timesFrAffine");
    buildApplyKey$1(module, "g2m_batchApplyKey", "g2m", "frm", n8*2*3, n8*3*2, n8, "g2m_timesFr");
    buildApplyKey$1(module, "g2m_batchApplyKeyMixed", "g2m", "frm", n8*2*2, n8*3*2, n8, "g2m_timesFrAffine");

    function toMontgomery(a) {
        return BigInt(a) * ( 1n << BigInt(f1size*8)) % q;
    }

    const G1gen = [
        1n,
        2n,
        1n
    ];

    const pG1gen = module.alloc(
        [
            ...utils$1.bigInt2BytesLE( toMontgomery(G1gen[0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G1gen[1]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G1gen[2]), f1size ),
        ]
    );

    const G1zero = [
        0n,
        1n,
        0n
    ];

    const pG1zero = module.alloc(
        [
            ...utils$1.bigInt2BytesLE( toMontgomery(G1zero[0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G1zero[1]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G1zero[2]), f1size )
        ]
    );

    const G2gen = [
        [
            10857046999023057135944570762232829481370756359578518086990519993285655852781n,
            11559732032986387107991004021392285783925812861821192530917403151452391805634n,
        ],[
            8495653923123431417604973247489272438418190587263600148770280649306958101930n,
            4082367875863433681332203403145435568316851327593401208105741076214120093531n,
        ],[
            1n,
            0n,
        ]
    ];

    const pG2gen = module.alloc(
        [
            ...utils$1.bigInt2BytesLE( toMontgomery(G2gen[0][0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2gen[0][1]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2gen[1][0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2gen[1][1]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2gen[2][0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2gen[2][1]), f1size ),
        ]
    );

    const G2zero = [
        [
            0n,
            0n,
        ],[
            1n,
            0n,
        ],[
            0n,
            0n,
        ]
    ];

    const pG2zero = module.alloc(
        [
            ...utils$1.bigInt2BytesLE( toMontgomery(G2zero[0][0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2zero[0][1]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2zero[1][0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2zero[1][1]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2zero[2][0]), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery(G2zero[2][1]), f1size ),
        ]
    );

    const pOneT = module.alloc([
        ...utils$1.bigInt2BytesLE( toMontgomery(1), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(0), f1size ),
    ]);

    const pNonResidueF6 = module.alloc([
        ...utils$1.bigInt2BytesLE( toMontgomery(9), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(1), f1size ),
    ]);

    const pTwoInv = module.alloc([
        ...utils$1.bigInt2BytesLE( toMontgomery(  modInv(2n, q)), f1size ),
        ...utils$1.bigInt2BytesLE( 0n, f1size )
    ]);

    const pAltBn128Twist = pNonResidueF6;

    const pTwistCoefB = module.alloc([
        ...utils$1.bigInt2BytesLE( toMontgomery(19485874751759354771024239261021720505790618469301721065564631296452457478373n), f1size ),
        ...utils$1.bigInt2BytesLE( toMontgomery(266929791119991161246907387137283842545076965332900288569378510910307636690n), f1size ),
    ]);

    function build_mulNR6() {
        const f = module.addFunction(prefix + "_mulNR6");
        f.addParam("x", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(
                f2mPrefix + "_mul",
                c.i32_const(pNonResidueF6),
                c.getLocal("x"),
                c.getLocal("pr")
            )
        );
    }
    build_mulNR6();

    const f6mPrefix = buildF3m$1(module, prefix+"_mulNR6", "f6m", "f2m");

    function build_mulNR12() {
        const f = module.addFunction(prefix + "_mulNR12");
        f.addParam("x", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(
                f2mPrefix + "_mul",
                c.i32_const(pNonResidueF6),
                c.i32_add(c.getLocal("x"), c.i32_const(n8*4)),
                c.getLocal("pr")
            ),
            c.call(
                f2mPrefix + "_copy",
                c.getLocal("x"),
                c.i32_add(c.getLocal("pr"), c.i32_const(n8*2)),
            ),
            c.call(
                f2mPrefix + "_copy",
                c.i32_add(c.getLocal("x"), c.i32_const(n8*2)),
                c.i32_add(c.getLocal("pr"), c.i32_const(n8*4)),
            )
        );
    }
    build_mulNR12();

    const ftmPrefix = buildF2m$1(module, prefix+"_mulNR12", "ftm", f6mPrefix);


    const ateLoopCount = 29793968203157093288n;
    const ateLoopBitBytes = bits(ateLoopCount);
    const pAteLoopBitBytes = module.alloc(ateLoopBitBytes);

    const ateCoefSize = 3 * f2size;
    const ateNDblCoefs = ateLoopBitBytes.length-1;
    const ateNAddCoefs = ateLoopBitBytes.reduce((acc, b) =>  acc + ( b!=0 ? 1 : 0)   ,0);
    const ateNCoefs = ateNAddCoefs + ateNDblCoefs + 1;
    const prePSize = 3*2*n8;
    const preQSize = 3*n8*2 + ateNCoefs*ateCoefSize;


    module.modules[prefix] = {
        n64: n64,
        pG1gen: pG1gen,
        pG1zero: pG1zero,
        pG1b: pG1b,
        pG2gen: pG2gen,
        pG2zero: pG2zero,
        pG2b: pG2b,
        pq: module.modules["f1m"].pq,
        pr: pr,
        pOneT: pOneT,
        prePSize: prePSize,
        preQSize: preQSize,
        r: r.toString(),
        q: q.toString()
    };

    // console.log("PrePSize: " +prePSize);
    // console.log("PreQSize: " +preQSize);

    const finalExpZ = 4965661367192848881n;

    function naf(n) {
        let E = n;
        const res = [];
        while (E > 0n) {
            if (isOdd$1(E)) {
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
        let E = n;
        const res = [];
        while (E > 0n) {
            if (isOdd$1(E)) {
                res.push( 1 );
            } else {
                res.push( 0 );
            }
            E = E >> 1n;
        }
        return res;
    }

    function buildPrepareG1() {
        const f = module.addFunction(prefix+ "_prepareG1");
        f.addParam("pP", "i32");
        f.addParam("ppreP", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(g1mPrefix + "_normalize", c.getLocal("pP"), c.getLocal("ppreP")),  // TODO Remove if already in affine
        );
    }

    function buildPrepAddStep() {
        const f = module.addFunction(prefix+ "_prepAddStep");
        f.addParam("pQ", "i32");
        f.addParam("pR", "i32");
        f.addParam("pCoef", "i32");

        const c = f.getCodeBuilder();

        const X2  = c.getLocal("pQ");
        const Y2  = c.i32_add(c.getLocal("pQ"), c.i32_const(f2size));

        const X1  = c.getLocal("pR");
        const Y1  = c.i32_add(c.getLocal("pR"), c.i32_const(f2size));
        const Z1  = c.i32_add(c.getLocal("pR"), c.i32_const(2*f2size));

        const ELL_0  = c.getLocal("pCoef");
        const ELL_VW = c.i32_add(c.getLocal("pCoef"), c.i32_const(f2size));
        const ELL_VV  = c.i32_add(c.getLocal("pCoef"), c.i32_const(2*f2size));

        const D = ELL_VW;
        const E = c.i32_const(module.alloc(f2size));
        const F = c.i32_const(module.alloc(f2size));
        const G = c.i32_const(module.alloc(f2size));
        const H = c.i32_const(module.alloc(f2size));
        const I = c.i32_const(module.alloc(f2size));
        const J = c.i32_const(module.alloc(f2size));
        const AUX = c.i32_const(module.alloc(f2size));

        f.addCode(
            // D = X1 - X2*Z1
            c.call(f2mPrefix + "_mul", X2, Z1, D),
            c.call(f2mPrefix + "_sub", X1, D, D),

            // E = Y1 - Y2*Z1
            c.call(f2mPrefix + "_mul", Y2, Z1, E),
            c.call(f2mPrefix + "_sub", Y1, E, E),

            // F = D^2
            c.call(f2mPrefix + "_square", D, F),

            // G = E^2
            c.call(f2mPrefix + "_square", E, G),

            // H = D*F
            c.call(f2mPrefix + "_mul", D, F, H),

            // I = X1 * F
            c.call(f2mPrefix + "_mul", X1, F, I),

            // J = H + Z1*G - (I+I)
            c.call(f2mPrefix + "_add", I, I, AUX),
            c.call(f2mPrefix + "_mul", Z1, G, J),
            c.call(f2mPrefix + "_add", H, J, J),
            c.call(f2mPrefix + "_sub", J, AUX, J),


            // X3 (X1) = D*J
            c.call(f2mPrefix + "_mul", D, J, X1),

            // Y3 (Y1) = E*(I-J)-(H*Y1)
            c.call(f2mPrefix + "_mul", H, Y1, Y1),
            c.call(f2mPrefix + "_sub", I, J, AUX),
            c.call(f2mPrefix + "_mul", E, AUX, AUX),
            c.call(f2mPrefix + "_sub", AUX, Y1, Y1),

            // Z3 (Z1) = Z1*H
            c.call(f2mPrefix + "_mul", Z1, H, Z1),

            // ell_0 = xi * (E * X2 - D * Y2)
            c.call(f2mPrefix + "_mul", D, Y2, AUX),
            c.call(f2mPrefix + "_mul", E, X2, ELL_0),
            c.call(f2mPrefix + "_sub", ELL_0, AUX, ELL_0),
            c.call(f2mPrefix + "_mul", ELL_0, c.i32_const(pAltBn128Twist), ELL_0),


            // ell_VV = - E (later: * xP)
            c.call(f2mPrefix + "_neg", E, ELL_VV),

            // ell_VW = D (later: * yP    )
            // Already assigned

        );
    }



    function buildPrepDoubleStep() {
        const f = module.addFunction(prefix+ "_prepDblStep");
        f.addParam("pR", "i32");
        f.addParam("pCoef", "i32");

        const c = f.getCodeBuilder();

        const X1  = c.getLocal("pR");
        const Y1  = c.i32_add(c.getLocal("pR"), c.i32_const(f2size));
        const Z1  = c.i32_add(c.getLocal("pR"), c.i32_const(2*f2size));

        const ELL_0  = c.getLocal("pCoef");
        const ELL_VW = c.i32_add(c.getLocal("pCoef"), c.i32_const(f2size));
        const ELL_VV  = c.i32_add(c.getLocal("pCoef"), c.i32_const(2*f2size));

        const A = c.i32_const(module.alloc(f2size));
        const B = c.i32_const(module.alloc(f2size));
        const C = c.i32_const(module.alloc(f2size));
        const D = c.i32_const(module.alloc(f2size));
        const E = c.i32_const(module.alloc(f2size));
        const F = c.i32_const(module.alloc(f2size));
        const G = c.i32_const(module.alloc(f2size));
        const H = c.i32_const(module.alloc(f2size));
        const I = c.i32_const(module.alloc(f2size));
        const J = c.i32_const(module.alloc(f2size));
        const E2 = c.i32_const(module.alloc(f2size));
        const AUX = c.i32_const(module.alloc(f2size));

        f.addCode(

            // A = X1 * Y1 / 2
            c.call(f2mPrefix + "_mul", Y1, c.i32_const(pTwoInv), A),
            c.call(f2mPrefix + "_mul", X1, A, A),

            // B = Y1^2
            c.call(f2mPrefix + "_square", Y1, B),

            // C = Z1^2
            c.call(f2mPrefix + "_square", Z1, C),

            // D = 3 * C
            c.call(f2mPrefix + "_add", C, C, D),
            c.call(f2mPrefix + "_add", D, C, D),

            // E = twist_b * D
            c.call(f2mPrefix + "_mul", c.i32_const(pTwistCoefB), D, E),

            // F = 3 * E
            c.call(f2mPrefix + "_add", E, E, F),
            c.call(f2mPrefix + "_add", E, F, F),

            // G = (B+F)/2
            c.call(f2mPrefix + "_add", B, F, G),
            c.call(f2mPrefix + "_mul", G, c.i32_const(pTwoInv), G),

            // H = (Y1+Z1)^2-(B+C)
            c.call(f2mPrefix + "_add", B, C, AUX),
            c.call(f2mPrefix + "_add", Y1, Z1, H),
            c.call(f2mPrefix + "_square", H, H),
            c.call(f2mPrefix + "_sub", H, AUX, H),

            // I = E-B
            c.call(f2mPrefix + "_sub", E, B, I),

            // J = X1^2
            c.call(f2mPrefix + "_square", X1, J),

            // E_squared = E^2
            c.call(f2mPrefix + "_square", E, E2),

            // X3 (X1) = A * (B-F)
            c.call(f2mPrefix + "_sub", B, F, AUX),
            c.call(f2mPrefix + "_mul", A, AUX, X1),

            // Y3 (Y1) = G^2 - 3*E^2
            c.call(f2mPrefix + "_add", E2, E2, AUX),
            c.call(f2mPrefix + "_add", E2, AUX, AUX),
            c.call(f2mPrefix + "_square", G, Y1),
            c.call(f2mPrefix + "_sub", Y1, AUX, Y1),

            // Z3 (Z1) = B * H
            c.call(f2mPrefix + "_mul", B, H, Z1),

            // ell_0 = xi * I
            c.call(f2mPrefix + "_mul", c.i32_const(pAltBn128Twist), I, ELL_0),

            // ell_VW = - H (later: * yP)
            c.call(f2mPrefix + "_neg", H, ELL_VW),

            // ell_VV = 3*J (later: * xP)
            c.call(f2mPrefix + "_add", J, J, ELL_VV),
            c.call(f2mPrefix + "_add", J, ELL_VV, ELL_VV),

        );
    }

    function buildMulByQ() {
        const f = module.addFunction(prefix + "_mulByQ");
        f.addParam("p1", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("p1");
        const y = c.i32_add(c.getLocal("p1"), c.i32_const(f2size));
        const z = c.i32_add(c.getLocal("p1"), c.i32_const(f2size*2));
        const x3 = c.getLocal("pr");
        const y3 = c.i32_add(c.getLocal("pr"), c.i32_const(f2size));
        const z3 = c.i32_add(c.getLocal("pr"), c.i32_const(f2size*2));

        const MulByQX = c.i32_const(module.alloc([
            ...utils$1.bigInt2BytesLE( toMontgomery("21575463638280843010398324269430826099269044274347216827212613867836435027261"), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery("10307601595873709700152284273816112264069230130616436755625194854815875713954"), f1size ),
        ]));

        const MulByQY = c.i32_const(module.alloc([
            ...utils$1.bigInt2BytesLE( toMontgomery("2821565182194536844548159561693502659359617185244120367078079554186484126554"), f1size ),
            ...utils$1.bigInt2BytesLE( toMontgomery("3505843767911556378687030309984248845540243509899259641013678093033130930403"), f1size ),
        ]));

        f.addCode(
            // The frobeniusMap(1) in this field, is the conjugate
            c.call(f2mPrefix + "_conjugate", x, x3),
            c.call(f2mPrefix + "_mul", MulByQX, x3, x3),
            c.call(f2mPrefix + "_conjugate", y, y3),
            c.call(f2mPrefix + "_mul", MulByQY, y3, y3),
            c.call(f2mPrefix + "_conjugate", z, z3),
        );
    }


    function buildPrepareG2() {
        buildMulByQ();
        const f = module.addFunction(prefix+ "_prepareG2");
        f.addParam("pQ", "i32");
        f.addParam("ppreQ", "i32");
        f.addLocal("pCoef", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const QX = c.getLocal("pQ");

        const pR = module.alloc(f2size*3);
        const R = c.i32_const(pR);
        const RX = c.i32_const(pR);
        const RY = c.i32_const(pR+f2size);
        const RZ = c.i32_const(pR+2*f2size);

        const cQX = c.i32_add( c.getLocal("ppreQ"), c.i32_const(0));
        const cQY = c.i32_add( c.getLocal("ppreQ"), c.i32_const(f2size));

        const pQ1 = module.alloc(f2size*3);
        const Q1 = c.i32_const(pQ1);

        const pQ2 = module.alloc(f2size*3);
        const Q2 = c.i32_const(pQ2);
        const Q2Y = c.i32_const(pQ2 + f2size);

        f.addCode(
            c.call(g2mPrefix + "_normalize", QX, cQX),  // TODO Remove if already in affine
            c.call(f2mPrefix + "_copy", cQX, RX),
            c.call(f2mPrefix + "_copy", cQY, RY),
            c.call(f2mPrefix + "_one", RZ),
        );

        f.addCode(
            c.setLocal("pCoef", c.i32_add( c.getLocal("ppreQ"), c.i32_const(f2size*3))),
            c.setLocal("i", c.i32_const(ateLoopBitBytes.length-2)),
            c.block(c.loop(

                c.call(prefix + "_prepDblStep", R, c.getLocal("pCoef")),
                c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

                c.if(
                    c.i32_load8_s(c.getLocal("i"), pAteLoopBitBytes),
                    [
                        ...c.call(prefix + "_prepAddStep", cQX, R, c.getLocal("pCoef")),
                        ...c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),
                    ]
                ),
                c.br_if(1, c.i32_eqz ( c.getLocal("i") )),
                c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );

        f.addCode(
            c.call(prefix + "_mulByQ", cQX, Q1),
            c.call(prefix + "_mulByQ", Q1, Q2)
        );

        f.addCode(
            c.call(f2mPrefix + "_neg", Q2Y, Q2Y),

            c.call(prefix + "_prepAddStep", Q1, R, c.getLocal("pCoef")),
            c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

            c.call(prefix + "_prepAddStep", Q2, R, c.getLocal("pCoef")),
            c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),
        );
    }

    function buildMulBy024Old() {
        const f = module.addFunction(prefix+ "__mulBy024Old");
        f.addParam("pEll0", "i32");
        f.addParam("pEllVW", "i32");
        f.addParam("pEllVV", "i32");
        f.addParam("pR", "i32");            // Result in F12

        const c = f.getCodeBuilder();

        const x0  = c.getLocal("pEll0");
        const x2  = c.getLocal("pEllVV");
        const x4  = c.getLocal("pEllVW");

        const z0  = c.getLocal("pR");

        const pAUX12 = module.alloc(ftsize);
        const AUX12 = c.i32_const(pAUX12);
        const AUX12_0 = c.i32_const(pAUX12);
        const AUX12_2 = c.i32_const(pAUX12+f2size);
        const AUX12_4 = c.i32_const(pAUX12+f2size*2);
        const AUX12_6 = c.i32_const(pAUX12+f2size*3);
        const AUX12_8 = c.i32_const(pAUX12+f2size*4);
        const AUX12_10 = c.i32_const(pAUX12+f2size*5);

        f.addCode(

            c.call(f2mPrefix + "_copy", x0, AUX12_0),
            c.call(f2mPrefix + "_zero", AUX12_2),
            c.call(f2mPrefix + "_copy", x2, AUX12_4),
            c.call(f2mPrefix + "_zero", AUX12_6),
            c.call(f2mPrefix + "_copy", x4, AUX12_8),
            c.call(f2mPrefix + "_zero", AUX12_10),
            c.call(ftmPrefix + "_mul", AUX12, z0, z0),
        );
    }

    function buildMulBy024() {
        const f = module.addFunction(prefix+ "__mulBy024");
        f.addParam("pEll0", "i32");
        f.addParam("pEllVW", "i32");
        f.addParam("pEllVV", "i32");
        f.addParam("pR", "i32");            // Result in F12

        const c = f.getCodeBuilder();

        const x0  = c.getLocal("pEll0");
        const x2  = c.getLocal("pEllVV");
        const x4  = c.getLocal("pEllVW");

        const z0  = c.getLocal("pR");
        const z1  = c.i32_add(c.getLocal("pR"), c.i32_const(2*n8));
        const z2  = c.i32_add(c.getLocal("pR"), c.i32_const(4*n8));
        const z3  = c.i32_add(c.getLocal("pR"), c.i32_const(6*n8));
        const z4  = c.i32_add(c.getLocal("pR"), c.i32_const(8*n8));
        const z5  = c.i32_add(c.getLocal("pR"), c.i32_const(10*n8));

        const t0 = c.i32_const(module.alloc(f2size));
        const t1 = c.i32_const(module.alloc(f2size));
        const t2 = c.i32_const(module.alloc(f2size));
        const s0 = c.i32_const(module.alloc(f2size));
        const T3 = c.i32_const(module.alloc(f2size));
        const T4 = c.i32_const(module.alloc(f2size));
        const D0 = c.i32_const(module.alloc(f2size));
        const D2 = c.i32_const(module.alloc(f2size));
        const D4 = c.i32_const(module.alloc(f2size));
        const S1 = c.i32_const(module.alloc(f2size));
        const AUX = c.i32_const(module.alloc(f2size));

        f.addCode(

            // D0 = z0 * x0;
            c.call(f2mPrefix + "_mul", z0, x0, D0),
            // D2 = z2 * x2;
            c.call(f2mPrefix + "_mul", z2, x2, D2),
            // D4 = z4 * x4;
            c.call(f2mPrefix + "_mul", z4, x4, D4),
            // t2 = z0 + z4;
            c.call(f2mPrefix + "_add", z0, z4, t2),
            // t1 = z0 + z2;
            c.call(f2mPrefix + "_add", z0, z2, t1),
            // s0 = z1 + z3 + z5;
            c.call(f2mPrefix + "_add", z1, z3, s0),
            c.call(f2mPrefix + "_add", s0, z5, s0),


            // For z.a_.a_ = z0.
            // S1 = z1 * x2;
            c.call(f2mPrefix + "_mul", z1, x2, S1),
            // T3 = S1 + D4;
            c.call(f2mPrefix + "_add", S1, D4, T3),
            // T4 = my_Fp6::non_residue * T3 + D0;
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), T3, T4),
            c.call(f2mPrefix + "_add", T4, D0, z0),
            // z0 = T4;

            // For z.a_.b_ = z1
            // T3 = z5 * x4;
            c.call(f2mPrefix + "_mul", z5, x4, T3),
            // S1 = S1 + T3;
            c.call(f2mPrefix + "_add", S1, T3, S1),
            // T3 = T3 + D2;
            c.call(f2mPrefix + "_add", T3, D2, T3),
            // T4 = my_Fp6::non_residue * T3;
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), T3, T4),
            // T3 = z1 * x0;
            c.call(f2mPrefix + "_mul", z1, x0, T3),
            // S1 = S1 + T3;
            c.call(f2mPrefix + "_add", S1, T3, S1),
            // T4 = T4 + T3;
            c.call(f2mPrefix + "_add", T4, T3, z1),
            // z1 = T4;



            // For z.a_.c_ = z2
            // t0 = x0 + x2;
            c.call(f2mPrefix + "_add", x0, x2, t0),
            // T3 = t1 * t0 - D0 - D2;
            c.call(f2mPrefix + "_mul", t1, t0, T3),
            c.call(f2mPrefix + "_add", D0, D2, AUX),
            c.call(f2mPrefix + "_sub", T3, AUX, T3),
            // T4 = z3 * x4;
            c.call(f2mPrefix + "_mul", z3, x4, T4),
            // S1 = S1 + T4;
            c.call(f2mPrefix + "_add", S1, T4, S1),


            // For z.b_.a_ = z3 (z3 needs z2)
            // t0 = z2 + z4;
            c.call(f2mPrefix + "_add", z2, z4, t0),
            // T3 = T3 + T4;
            // z2 = T3;
            c.call(f2mPrefix + "_add", T3, T4, z2),
            // t1 = x2 + x4;
            c.call(f2mPrefix + "_add", x2, x4, t1),
            // T3 = t0 * t1 - D2 - D4;
            c.call(f2mPrefix + "_mul", t1, t0, T3),
            c.call(f2mPrefix + "_add", D2, D4, AUX),
            c.call(f2mPrefix + "_sub", T3, AUX, T3),
            // T4 = my_Fp6::non_residue * T3;
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), T3, T4),
            // T3 = z3 * x0;
            c.call(f2mPrefix + "_mul", z3, x0, T3),
            // S1 = S1 + T3;
            c.call(f2mPrefix + "_add", S1, T3, S1),
            // T4 = T4 + T3;
            c.call(f2mPrefix + "_add", T4, T3, z3),
            // z3 = T4;

            // For z.b_.b_ = z4
            // T3 = z5 * x2;
            c.call(f2mPrefix + "_mul", z5, x2, T3),
            // S1 = S1 + T3;
            c.call(f2mPrefix + "_add", S1, T3, S1),
            // T4 = my_Fp6::non_residue * T3;
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), T3, T4),
            // t0 = x0 + x4;
            c.call(f2mPrefix + "_add", x0, x4, t0),
            // T3 = t2 * t0 - D0 - D4;
            c.call(f2mPrefix + "_mul", t2, t0, T3),
            c.call(f2mPrefix + "_add", D0, D4, AUX),
            c.call(f2mPrefix + "_sub", T3, AUX, T3),
            // T4 = T4 + T3;
            c.call(f2mPrefix + "_add", T4, T3, z4),
            // z4 = T4;

            // For z.b_.c_ = z5.
            // t0 = x0 + x2 + x4;
            c.call(f2mPrefix + "_add", x0, x2, t0),
            c.call(f2mPrefix + "_add", t0, x4, t0),
            // T3 = s0 * t0 - S1;
            c.call(f2mPrefix + "_mul", s0, t0, T3),
            c.call(f2mPrefix + "_sub", T3, S1, z5),
            // z5 = T3;

        );
    }


    function buildMillerLoop() {
        const f = module.addFunction(prefix+ "_millerLoop");
        f.addParam("ppreP", "i32");
        f.addParam("ppreQ", "i32");
        f.addParam("r", "i32");
        f.addLocal("pCoef", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const preP_PX = c.getLocal("ppreP");
        const preP_PY = c.i32_add(c.getLocal("ppreP"), c.i32_const(f1size));

        const ELL_0  = c.getLocal("pCoef");
        const ELL_VW = c.i32_add(c.getLocal("pCoef"), c.i32_const(f2size));
        const ELL_VV  = c.i32_add(c.getLocal("pCoef"), c.i32_const(2*f2size));


        const pVW = module.alloc(f2size);
        const VW = c.i32_const(pVW);
        const pVV = module.alloc(f2size);
        const VV = c.i32_const(pVV);

        const F = c.getLocal("r");


        f.addCode(
            c.call(ftmPrefix + "_one", F),

            c.setLocal("pCoef", c.i32_add( c.getLocal("ppreQ"), c.i32_const(f2size*3))),

            c.setLocal("i", c.i32_const(ateLoopBitBytes.length-2)),
            c.block(c.loop(


                c.call(ftmPrefix + "_square", F, F),

                c.call(f2mPrefix + "_mul1", ELL_VW,preP_PY, VW),
                c.call(f2mPrefix + "_mul1", ELL_VV, preP_PX, VV),
                c.call(prefix + "__mulBy024", ELL_0, VW, VV, F),
                c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

                c.if(
                    c.i32_load8_s(c.getLocal("i"), pAteLoopBitBytes),
                    [
                        ...c.call(f2mPrefix + "_mul1", ELL_VW, preP_PY, VW),
                        ...c.call(f2mPrefix + "_mul1", ELL_VV, preP_PX, VV),

                        ...c.call(prefix + "__mulBy024", ELL_0, VW, VV, F),
                        ...c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

                    ]
                ),
                c.br_if(1, c.i32_eqz ( c.getLocal("i") )),
                c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))

        );

        f.addCode(
            c.call(f2mPrefix + "_mul1", ELL_VW, preP_PY, VW),
            c.call(f2mPrefix + "_mul1", ELL_VV, preP_PX, VV),
            c.call(prefix + "__mulBy024", ELL_0, VW, VV, F),
            c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

            c.call(f2mPrefix + "_mul1", ELL_VW, preP_PY, VW),
            c.call(f2mPrefix + "_mul1", ELL_VV, preP_PX, VV),
            c.call(prefix + "__mulBy024", ELL_0, VW, VV, F),
            c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

        );

    }


    function buildFrobeniusMap(n) {
        const F12 = [
            [
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
            ],
            [
                [1n, 0n],
                [8376118865763821496583973867626364092589906065868298776909617916018768340080n, 16469823323077808223889137241176536799009286646108169935659301613961712198316n],
                [21888242871839275220042445260109153167277707414472061641714758635765020556617n, 0n],
                [11697423496358154304825782922584725312912383441159505038794027105778954184319n, 303847389135065887422783454877609941456349188919719272345083954437860409601n],
                [21888242871839275220042445260109153167277707414472061641714758635765020556616n, 0n],
                [3321304630594332808241809054958361220322477375291206261884409189760185844239n, 5722266937896532885780051958958348231143373700109372999374820235121374419868n],
                [21888242871839275222246405745257275088696311157297823662689037894645226208582n, 0n],
                [13512124006075453725662431877630910996106405091429524885779419978626457868503n, 5418419548761466998357268504080738289687024511189653727029736280683514010267n],
                [2203960485148121921418603742825762020974279258880205651966n, 0n],
                [10190819375481120917420622822672549775783927716138318623895010788866272024264n, 21584395482704209334823622290379665147239961968378104390343953940207365798982n],
                [2203960485148121921418603742825762020974279258880205651967n, 0n],
                [18566938241244942414004596690298913868373833782006617400804628704885040364344n, 16165975933942742336466353786298926857552937457188450663314217659523851788715n],
            ]
        ];

        const F6 = [
            [
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
            ],
            [
                [1n, 0n],
                [21575463638280843010398324269430826099269044274347216827212613867836435027261n, 10307601595873709700152284273816112264069230130616436755625194854815875713954n],
                [21888242871839275220042445260109153167277707414472061641714758635765020556616n, 0n],
                [3772000881919853776433695186713858239009073593817195771773381919316419345261n, 2236595495967245188281701248203181795121068902605861227855261137820944008926n],
                [2203960485148121921418603742825762020974279258880205651966n, 0n],
                [18429021223477853657660792034369865839114504446431234726392080002137598044644n, 9344045779998320333812420223237981029506012124075525679208581902008406485703n],
            ],
            [
                [1n, 0n],
                [2581911344467009335267311115468803099551665605076196740867805258568234346338n, 19937756971775647987995932169929341994314640652964949448313374472400716661030n],
                [2203960485148121921418603742825762020974279258880205651966n, 0n],
                [5324479202449903542726783395506214481928257762400643279780343368557297135718n, 16208900380737693084919495127334387981393726419856888799917914180988844123039n],
                [21888242871839275220042445260109153167277707414472061641714758635765020556616n, 0n],
                [13981852324922362344252311234282257507216387789820983642040889267519694726527n, 7629828391165209371577384193250820201684255241773809077146787135900891633097n],
            ]
        ];

        const f = module.addFunction(prefix+ "__frobeniusMap"+n);
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        for (let i=0; i<6; i++) {
            const X = (i==0) ? c.getLocal("x") : c.i32_add(c.getLocal("x"), c.i32_const(i*f2size));
            const Xc0 = X;
            const Xc1 = c.i32_add(c.getLocal("x"), c.i32_const(i*f2size + f1size));
            const R = (i==0) ? c.getLocal("r") : c.i32_add(c.getLocal("r"), c.i32_const(i*f2size));
            const Rc0 = R;
            const Rc1 = c.i32_add(c.getLocal("r"), c.i32_const(i*f2size + f1size));
            const coef = mul2(F12[Math.floor(i/3)][n%12] , F6[i%3][n%6]);
            const pCoef = module.alloc([
                ...utils$1.bigInt2BytesLE(toMontgomery(coef[0]), 32),
                ...utils$1.bigInt2BytesLE(toMontgomery(coef[1]), 32),
            ]);
            if (n%2 == 1) {
                f.addCode(
                    c.call(f1mPrefix + "_copy", Xc0, Rc0),
                    c.call(f1mPrefix + "_neg", Xc1, Rc1),
                    c.call(f2mPrefix + "_mul", R, c.i32_const(pCoef), R),
                );
            } else {
                f.addCode(c.call(f2mPrefix + "_mul", X, c.i32_const(pCoef), R));
            }
        }

        function mul2(a, b) {
            const ac0 = BigInt(a[0]);
            const ac1 = BigInt(a[1]);
            const bc0 = BigInt(b[0]);
            const bc1 = BigInt(b[1]);
            const res = [
                (ac0 * bc0 - (  ac1 * bc1)  ) % q,
                (ac0 * bc1 + (  ac1 * bc0)  ) % q,
            ];
            if (isNegative$1(res[0])) res[0] = res[0] + q;
            return res;
        }

    }



    function buildFinalExponentiationFirstChunk() {

        const f = module.addFunction(prefix+ "__finalExponentiationFirstChunk");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const elt = c.getLocal("x");
        const eltC0 = elt;
        const eltC1 = c.i32_add(elt, c.i32_const(n8*6));
        const r = c.getLocal("r");
        const pA = module.alloc(ftsize);
        const A = c.i32_const(pA);
        const Ac0 = A;
        const Ac1 = c.i32_const(pA + n8*6);
        const B = c.i32_const(module.alloc(ftsize));
        const C = c.i32_const(module.alloc(ftsize));
        const D = c.i32_const(module.alloc(ftsize));

        f.addCode(
            // const alt_bn128_Fq12 A = alt_bn128_Fq12(elt.c0,-elt.c1);
            c.call(f6mPrefix + "_copy", eltC0, Ac0),
            c.call(f6mPrefix + "_neg", eltC1, Ac1),

            // const alt_bn128_Fq12 B = elt.inverse();
            c.call(ftmPrefix + "_inverse", elt, B),

            // const alt_bn128_Fq12 C = A * B;
            c.call(ftmPrefix + "_mul", A, B, C),
            // const alt_bn128_Fq12 D = C.Frobenius_map(2);
            c.call(prefix + "__frobeniusMap2", C, D),
            // const alt_bn128_Fq12 result = D * C;
            c.call(ftmPrefix + "_mul", C, D, r),
        );
    }

    function buildCyclotomicSquare() {
        const f = module.addFunction(prefix+ "__cyclotomicSquare");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x4 = c.i32_add(c.getLocal("x"), c.i32_const(f2size));
        const x3 = c.i32_add(c.getLocal("x"), c.i32_const(2*f2size));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(3*f2size));
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(4*f2size));
        const x5 = c.i32_add(c.getLocal("x"), c.i32_const(5*f2size));

        const r0 = c.getLocal("r");
        const r4 = c.i32_add(c.getLocal("r"), c.i32_const(f2size));
        const r3 = c.i32_add(c.getLocal("r"), c.i32_const(2*f2size));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(3*f2size));
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(4*f2size));
        const r5 = c.i32_add(c.getLocal("r"), c.i32_const(5*f2size));

        const t0 = c.i32_const(module.alloc(f2size));
        const t1 = c.i32_const(module.alloc(f2size));
        const t2 = c.i32_const(module.alloc(f2size));
        const t3 = c.i32_const(module.alloc(f2size));
        const t4 = c.i32_const(module.alloc(f2size));
        const t5 = c.i32_const(module.alloc(f2size));
        const tmp = c.i32_const(module.alloc(f2size));
        const AUX = c.i32_const(module.alloc(f2size));


        f.addCode(
            //    // t0 + t1*y = (z0 + z1*y)^2 = a^2
            //    tmp = z0 * z1;
            //    t0 = (z0 + z1) * (z0 + my_Fp6::non_residue * z1) - tmp - my_Fp6::non_residue * tmp;
            //    t1 = tmp + tmp;
            c.call(f2mPrefix + "_mul", x0, x1, tmp),
            c.call(f2mPrefix + "_mul", x1, c.i32_const(pNonResidueF6), t0),
            c.call(f2mPrefix + "_add", x0, t0, t0),
            c.call(f2mPrefix + "_add", x0, x1, AUX),
            c.call(f2mPrefix + "_mul", AUX, t0, t0),
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), tmp, AUX),
            c.call(f2mPrefix + "_add", tmp, AUX, AUX),
            c.call(f2mPrefix + "_sub", t0, AUX, t0),
            c.call(f2mPrefix + "_add", tmp, tmp, t1),

            //  // t2 + t3*y = (z2 + z3*y)^2 = b^2
            //  tmp = z2 * z3;
            //  t2 = (z2 + z3) * (z2 + my_Fp6::non_residue * z3) - tmp - my_Fp6::non_residue * tmp;
            //  t3 = tmp + tmp;
            c.call(f2mPrefix + "_mul", x2, x3, tmp),
            c.call(f2mPrefix + "_mul", x3, c.i32_const(pNonResidueF6), t2),
            c.call(f2mPrefix + "_add", x2, t2, t2),
            c.call(f2mPrefix + "_add", x2, x3, AUX),
            c.call(f2mPrefix + "_mul", AUX, t2, t2),
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), tmp, AUX),
            c.call(f2mPrefix + "_add", tmp, AUX, AUX),
            c.call(f2mPrefix + "_sub", t2, AUX, t2),
            c.call(f2mPrefix + "_add", tmp, tmp, t3),

            //  // t4 + t5*y = (z4 + z5*y)^2 = c^2
            //  tmp = z4 * z5;
            //  t4 = (z4 + z5) * (z4 + my_Fp6::non_residue * z5) - tmp - my_Fp6::non_residue * tmp;
            //  t5 = tmp + tmp;
            c.call(f2mPrefix + "_mul", x4, x5, tmp),
            c.call(f2mPrefix + "_mul", x5, c.i32_const(pNonResidueF6), t4),
            c.call(f2mPrefix + "_add", x4, t4, t4),
            c.call(f2mPrefix + "_add", x4, x5, AUX),
            c.call(f2mPrefix + "_mul", AUX, t4, t4),
            c.call(f2mPrefix + "_mul", c.i32_const(pNonResidueF6), tmp, AUX),
            c.call(f2mPrefix + "_add", tmp, AUX, AUX),
            c.call(f2mPrefix + "_sub", t4, AUX, t4),
            c.call(f2mPrefix + "_add", tmp, tmp, t5),

            // For A
            // z0 = 3 * t0 - 2 * z0
            c.call(f2mPrefix + "_sub", t0, x0, r0),
            c.call(f2mPrefix + "_add", r0, r0, r0),
            c.call(f2mPrefix + "_add", t0, r0, r0),
            // z1 = 3 * t1 + 2 * z1
            c.call(f2mPrefix + "_add", t1, x1, r1),
            c.call(f2mPrefix + "_add", r1, r1, r1),
            c.call(f2mPrefix + "_add", t1, r1, r1),

            // For B
            // z2 = 3 * (xi * t5) + 2 * z2
            c.call(f2mPrefix + "_mul", t5, c.i32_const(pAltBn128Twist), AUX),
            c.call(f2mPrefix + "_add", AUX, x2, r2),
            c.call(f2mPrefix + "_add", r2, r2, r2),
            c.call(f2mPrefix + "_add", AUX, r2, r2),
            // z3 = 3 * t4 - 2 * z3
            c.call(f2mPrefix + "_sub", t4, x3, r3),
            c.call(f2mPrefix + "_add", r3, r3, r3),
            c.call(f2mPrefix + "_add", t4, r3, r3),

            // For C
            // z4 = 3 * t2 - 2 * z4
            c.call(f2mPrefix + "_sub", t2, x4, r4),
            c.call(f2mPrefix + "_add", r4, r4, r4),
            c.call(f2mPrefix + "_add", t2, r4, r4),
            // z5 = 3 * t3 + 2 * z5
            c.call(f2mPrefix + "_add", t3, x5, r5),
            c.call(f2mPrefix + "_add", r5, r5, r5),
            c.call(f2mPrefix + "_add", t3, r5, r5),

        );
    }


    function buildCyclotomicExp(exponent, fnName) {
        const exponentNafBytes = naf(exponent).map( (b) => (b==-1 ? 0xFF: b) );
        const pExponentNafBytes = module.alloc(exponentNafBytes);

        const f = module.addFunction(prefix+ "__cyclotomicExp_"+fnName);
        f.addParam("x", "i32");
        f.addParam("r", "i32");
        f.addLocal("bit", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("x");

        const res = c.getLocal("r");

        const inverse = c.i32_const(module.alloc(ftsize));


        f.addCode(
            c.call(ftmPrefix + "_conjugate", x, inverse),
            c.call(ftmPrefix + "_one", res),

            c.if(
                c.teeLocal("bit", c.i32_load8_s(c.i32_const(exponentNafBytes.length-1), pExponentNafBytes)),
                c.if(
                    c.i32_eq(
                        c.getLocal("bit"),
                        c.i32_const(1)
                    ),
                    c.call(ftmPrefix + "_mul", res, x, res),
                    c.call(ftmPrefix + "_mul", res, inverse, res),
                )
            ),

            c.setLocal("i", c.i32_const(exponentNafBytes.length-2)),
            c.block(c.loop(
                c.call(prefix + "__cyclotomicSquare", res, res),
                c.if(
                    c.teeLocal("bit", c.i32_load8_s(c.getLocal("i"), pExponentNafBytes)),
                    c.if(
                        c.i32_eq(
                            c.getLocal("bit"),
                            c.i32_const(1)
                        ),
                        c.call(ftmPrefix + "_mul", res, x, res),
                        c.call(ftmPrefix + "_mul", res, inverse, res),
                    )
                ),
                c.br_if(1, c.i32_eqz ( c.getLocal("i") )),
                c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }



    function buildFinalExponentiationLastChunk() {
        buildCyclotomicSquare();
        buildCyclotomicExp(finalExpZ, "w0");

        const f = module.addFunction(prefix+ "__finalExponentiationLastChunk");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const elt = c.getLocal("x");
        const result = c.getLocal("r");
        const A = c.i32_const(module.alloc(ftsize));
        const B = c.i32_const(module.alloc(ftsize));
        const C = c.i32_const(module.alloc(ftsize));
        const D = c.i32_const(module.alloc(ftsize));
        const E = c.i32_const(module.alloc(ftsize));
        const F = c.i32_const(module.alloc(ftsize));
        const G = c.i32_const(module.alloc(ftsize));
        const H = c.i32_const(module.alloc(ftsize));
        const I = c.i32_const(module.alloc(ftsize));
        const J = c.i32_const(module.alloc(ftsize));
        const K = c.i32_const(module.alloc(ftsize));
        const L = c.i32_const(module.alloc(ftsize));
        const M = c.i32_const(module.alloc(ftsize));
        const N = c.i32_const(module.alloc(ftsize));
        const O = c.i32_const(module.alloc(ftsize));
        const P = c.i32_const(module.alloc(ftsize));
        const Q = c.i32_const(module.alloc(ftsize));
        const R = c.i32_const(module.alloc(ftsize));
        const S = c.i32_const(module.alloc(ftsize));
        const T = c.i32_const(module.alloc(ftsize));
        const U = c.i32_const(module.alloc(ftsize));

        f.addCode(


            // A = exp_by_neg_z(elt)  // = elt^(-z)
            c.call(prefix + "__cyclotomicExp_w0", elt, A),
            c.call(ftmPrefix + "_conjugate", A, A),
            // B = A^2                // = elt^(-2*z)
            c.call(prefix + "__cyclotomicSquare", A, B),
            // C = B^2                // = elt^(-4*z)
            c.call(prefix + "__cyclotomicSquare", B, C),
            // D = C * B              // = elt^(-6*z)
            c.call(ftmPrefix + "_mul", C, B, D),
            // E = exp_by_neg_z(D)    // = elt^(6*z^2)
            c.call(prefix + "__cyclotomicExp_w0", D, E),
            c.call(ftmPrefix + "_conjugate", E, E),
            // F = E^2                // = elt^(12*z^2)
            c.call(prefix + "__cyclotomicSquare", E, F),
            // G = epx_by_neg_z(F)    // = elt^(-12*z^3)
            c.call(prefix + "__cyclotomicExp_w0", F, G),
            c.call(ftmPrefix + "_conjugate", G, G),
            // H = conj(D)            // = elt^(6*z)
            c.call(ftmPrefix + "_conjugate", D, H),
            // I = conj(G)            // = elt^(12*z^3)
            c.call(ftmPrefix + "_conjugate", G, I),
            // J = I * E              // = elt^(12*z^3 + 6*z^2)
            c.call(ftmPrefix + "_mul", I, E, J),
            // K = J * H              // = elt^(12*z^3 + 6*z^2 + 6*z)
            c.call(ftmPrefix + "_mul", J, H, K),
            // L = K * B              // = elt^(12*z^3 + 6*z^2 + 4*z)
            c.call(ftmPrefix + "_mul", K, B, L),
            // M = K * E              // = elt^(12*z^3 + 12*z^2 + 6*z)
            c.call(ftmPrefix + "_mul", K, E, M),

            // N = M * elt            // = elt^(12*z^3 + 12*z^2 + 6*z + 1)
            c.call(ftmPrefix + "_mul", M, elt, N),

            // O = L.Frobenius_map(1) // = elt^(q*(12*z^3 + 6*z^2 + 4*z))
            c.call(prefix + "__frobeniusMap1", L, O),
            // P = O * N              // = elt^(q*(12*z^3 + 6*z^2 + 4*z) * (12*z^3 + 12*z^2 + 6*z + 1))
            c.call(ftmPrefix + "_mul", O, N, P),
            // Q = K.Frobenius_map(2) // = elt^(q^2 * (12*z^3 + 6*z^2 + 6*z))
            c.call(prefix + "__frobeniusMap2", K, Q),
            // R = Q * P              // = elt^(q^2 * (12*z^3 + 6*z^2 + 6*z) + q*(12*z^3 + 6*z^2 + 4*z) * (12*z^3 + 12*z^2 + 6*z + 1))
            c.call(ftmPrefix + "_mul", Q, P, R),
            // S = conj(elt)          // = elt^(-1)
            c.call(ftmPrefix + "_conjugate", elt, S),
            // T = S * L              // = elt^(12*z^3 + 6*z^2 + 4*z - 1)
            c.call(ftmPrefix + "_mul", S, L, T),
            // U = T.Frobenius_map(3) // = elt^(q^3(12*z^3 + 6*z^2 + 4*z - 1))
            c.call(prefix + "__frobeniusMap3", T, U),
            // V = U * R              // = elt^(q^3(12*z^3 + 6*z^2 + 4*z - 1) + q^2 * (12*z^3 + 6*z^2 + 6*z) + q*(12*z^3 + 6*z^2 + 4*z) * (12*z^3 + 12*z^2 + 6*z + 1))
            c.call(ftmPrefix + "_mul", U, R, result),
            // result = V
        );
    }


    function buildFinalExponentiation() {
        buildFinalExponentiationFirstChunk();
        buildFinalExponentiationLastChunk();
        const f = module.addFunction(prefix+ "_finalExponentiation");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const elt = c.getLocal("x");
        const result = c.getLocal("r");
        const eltToFirstChunk = c.i32_const(module.alloc(ftsize));

        f.addCode(
            c.call(prefix + "__finalExponentiationFirstChunk", elt, eltToFirstChunk ),
            c.call(prefix + "__finalExponentiationLastChunk", eltToFirstChunk, result )
        );
    }


    function buildFinalExponentiationOld() {
        const f = module.addFunction(prefix+ "_finalExponentiationOld");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const exponent = 552484233613224096312617126783173147097382103762957654188882734314196910839907541213974502761540629817009608548654680343627701153829446747810907373256841551006201639677726139946029199968412598804882391702273019083653272047566316584365559776493027495458238373902875937659943504873220554161550525926302303331747463515644711876653177129578303191095900909191624817826566688241804408081892785725967931714097716709526092261278071952560171111444072049229123565057483750161460024353346284167282452756217662335528813519139808291170539072125381230815729071544861602750936964829313608137325426383735122175229541155376346436093930287402089517426973178917569713384748081827255472576937471496195752727188261435633271238710131736096299798168852925540549342330775279877006784354801422249722573783561685179618816480037695005515426162362431072245638324744480n;

        const pExponent = module.alloc(utils$1.bigInt2BytesLE( exponent, 352 ));

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(ftmPrefix + "_exp", c.getLocal("x"), c.i32_const(pExponent), c.i32_const(352), c.getLocal("r")),
        );
    }




    const pPreP = module.alloc(prePSize);
    const pPreQ = module.alloc(preQSize);

    function buildPairingEquation(nPairings) {

        const f = module.addFunction(prefix+ "_pairingEq"+nPairings);
        for (let i=0; i<nPairings; i++) {
            f.addParam("p_"+i, "i32");
            f.addParam("q_"+i, "i32");
        }
        f.addParam("c", "i32");
        f.setReturnType("i32");


        const c = f.getCodeBuilder();

        const resT = c.i32_const(module.alloc(ftsize));
        const auxT = c.i32_const(module.alloc(ftsize));

        f.addCode(c.call(ftmPrefix + "_one", resT ));

        for (let i=0; i<nPairings; i++) {

            f.addCode(c.call(prefix + "_prepareG1", c.getLocal("p_"+i), c.i32_const(pPreP) ));
            f.addCode(c.call(prefix + "_prepareG2", c.getLocal("q_"+i), c.i32_const(pPreQ) ));
            f.addCode(c.call(prefix + "_millerLoop", c.i32_const(pPreP), c.i32_const(pPreQ), auxT ));

            f.addCode(c.call(ftmPrefix + "_mul", resT, auxT, resT ));
        }

        f.addCode(c.call(prefix + "_finalExponentiation", resT, resT ));

        f.addCode(c.call(ftmPrefix + "_eq", resT, c.getLocal("c")));
    }


    function buildPairing() {

        const f = module.addFunction(prefix+ "_pairing");
        f.addParam("p", "i32");
        f.addParam("q", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const resT = c.i32_const(module.alloc(ftsize));

        f.addCode(c.call(prefix + "_prepareG1", c.getLocal("p"), c.i32_const(pPreP) ));
        f.addCode(c.call(prefix + "_prepareG2", c.getLocal("q"), c.i32_const(pPreQ) ));
        f.addCode(c.call(prefix + "_millerLoop", c.i32_const(pPreP), c.i32_const(pPreQ), resT ));
        f.addCode(c.call(prefix + "_finalExponentiation", resT, c.getLocal("r") ));
    }


    buildPrepAddStep();
    buildPrepDoubleStep();

    buildPrepareG1();
    buildPrepareG2();

    buildMulBy024();
    buildMulBy024Old();
    buildMillerLoop();


    for (let i=0; i<10; i++) {
        buildFrobeniusMap(i);
        module.exportFunction(prefix + "__frobeniusMap"+i);
    }

    buildFinalExponentiationOld();
    buildFinalExponentiation();

    for (let i=1; i<=5; i++) {
        buildPairingEquation(i);
        module.exportFunction(prefix + "_pairingEq"+i);
    }

    buildPairing();

    module.exportFunction(prefix + "_pairing");

    module.exportFunction(prefix + "_prepareG1");
    module.exportFunction(prefix + "_prepareG2");
    module.exportFunction(prefix + "_millerLoop");
    module.exportFunction(prefix + "_finalExponentiation");
    module.exportFunction(prefix + "_finalExponentiationOld");
    module.exportFunction(prefix + "__mulBy024");
    module.exportFunction(prefix + "__mulBy024Old");
    module.exportFunction(prefix + "__cyclotomicSquare");
    module.exportFunction(prefix + "__cyclotomicExp_w0");

    // console.log(module.functionIdxByName);

};

const utils = utils$5;

const buildF1m =build_f1m;
const buildF1 =build_f1;
const buildF2m =build_f2m;
const buildF3m =build_f3m;
const buildCurve =build_curve_jacobian_a0;
const buildFFT = build_fft;
const buildPol = build_pol;
const buildQAP = build_qap;
const buildApplyKey = build_applykey;
const { bitLength, isOdd, isNegative } = bigint;

// Definition here: https://electriccoin.co/blog/new-snark-curve/

var build_bls12381 = function buildBLS12381(module, _prefix) {

    const prefix = _prefix || "bls12381";

    if (module.modules[prefix]) return prefix;  // already builded

    const q = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
    const r = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;

    const n64q = Math.floor((bitLength(q - 1n) - 1)/64) +1;
    const n8q = n64q*8;
    const f1size = n8q;
    const f2size = f1size * 2;
    const ftsize = f1size * 12;

    const n64r = Math.floor((bitLength(r - 1n) - 1)/64) +1;
    const n8r = n64r*8;
    const frsize = n8r;


    const pr = module.alloc(utils.bigInt2BytesLE( r, frsize ));

    const f1mPrefix = buildF1m(module, q, "f1m", "intq");
    buildF1(module, r, "fr", "frm", "intr");
    const pG1b = module.alloc(utils.bigInt2BytesLE( toMontgomery(4n), f1size ));
    const g1mPrefix = buildCurve(module, "g1m", "f1m", pG1b);

    buildFFT(module, "frm", "frm", "frm", "frm_mul");

    buildPol(module, "pol", "frm");
    buildQAP(module, "qap", "frm");

    const f2mPrefix = buildF2m(module, "f1m_neg", "f2m", "f1m");
    const pG2b = module.alloc([
        ...utils.bigInt2BytesLE( toMontgomery(4n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(4n), f1size )
    ]);
    const g2mPrefix = buildCurve(module, "g2m", "f2m", pG2b);


    function buildGTimesFr(fnName, opMul) {
        const f = module.addFunction(fnName);
        f.addParam("pG", "i32");
        f.addParam("pFr", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const AUX = c.i32_const(module.alloc(n8r));

        f.addCode(
            c.call("frm_fromMontgomery", c.getLocal("pFr"), AUX),
            c.call(
                opMul,
                c.getLocal("pG"),
                AUX,
                c.i32_const(n8r),
                c.getLocal("pr")
            )
        );

        module.exportFunction(fnName);
    }
    buildGTimesFr("g1m_timesFr", "g1m_timesScalar");
    buildFFT(module, "g1m", "g1m", "frm", "g1m_timesFr");

    buildGTimesFr("g2m_timesFr", "g2m_timesScalar");
    buildFFT(module, "g2m", "g2m", "frm", "g2m_timesFr");

    buildGTimesFr("g1m_timesFrAffine", "g1m_timesScalarAffine");
    buildGTimesFr("g2m_timesFrAffine", "g2m_timesScalarAffine");

    buildApplyKey(module, "frm_batchApplyKey", "fmr", "frm", n8r, n8r, n8r, "frm_mul");
    buildApplyKey(module, "g1m_batchApplyKey", "g1m", "frm", n8q*3, n8q*3, n8r, "g1m_timesFr");
    buildApplyKey(module, "g1m_batchApplyKeyMixed", "g1m", "frm", n8q*2, n8q*3, n8r, "g1m_timesFrAffine");
    buildApplyKey(module, "g2m_batchApplyKey", "g2m", "frm", n8q*2*3, n8q*3*2, n8r, "g2m_timesFr");
    buildApplyKey(module, "g2m_batchApplyKeyMixed", "g2m", "frm", n8q*2*2, n8q*3*2, n8r, "g2m_timesFrAffine");


    function toMontgomery(a) {
        return BigInt(a) * (1n << BigInt(f1size*8)) % q;
    }

    const G1gen = [
        3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n,
        1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n,
        1n
    ];

    const pG1gen = module.alloc(
        [
            ...utils.bigInt2BytesLE( toMontgomery(G1gen[0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G1gen[1]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G1gen[2]), f1size ),
        ]
    );

    const G1zero = [
        0n,
        1n,
        0n
    ];

    const pG1zero = module.alloc(
        [
            ...utils.bigInt2BytesLE( toMontgomery(G1zero[0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G1zero[1]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G1zero[2]), f1size )
        ]
    );

    const G2gen = [
        [
            352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160n,
            3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758n,
        ],[
            1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905n,
            927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582n,
        ],[
            1n,
            0n,
        ]
    ];

    const pG2gen = module.alloc(
        [
            ...utils.bigInt2BytesLE( toMontgomery(G2gen[0][0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2gen[0][1]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2gen[1][0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2gen[1][1]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2gen[2][0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2gen[2][1]), f1size ),
        ]
    );

    const G2zero = [
        [
            0n,
            0n,
        ],[
            1n,
            0n,
        ],[
            0n,
            0n,
        ]
    ];

    const pG2zero = module.alloc(
        [
            ...utils.bigInt2BytesLE( toMontgomery(G2zero[0][0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2zero[0][1]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2zero[1][0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2zero[1][1]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2zero[2][0]), f1size ),
            ...utils.bigInt2BytesLE( toMontgomery(G2zero[2][1]), f1size ),
        ]
    );

    const pOneT = module.alloc([
        ...utils.bigInt2BytesLE( toMontgomery(1n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(0n), f1size ),
    ]);

    const pBls12381Twist =  module.alloc([
        ...utils.bigInt2BytesLE( toMontgomery(1n), f1size ),
        ...utils.bigInt2BytesLE( toMontgomery(1n), f1size ),
    ]);

    function build_mulNR2() {
        const f = module.addFunction(f2mPrefix + "_mulNR");
        f.addParam("x", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const x0c = c.i32_const(module.alloc(f1size));
        const x0 = c.getLocal("x");
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(f1size));
        const r0 = c.getLocal("pr");
        const r1 = c.i32_add(c.getLocal("pr"), c.i32_const(f1size));

        f.addCode(
            c.call(f1mPrefix+"_copy", x0, x0c),
            c.call(f1mPrefix+"_sub", x0, x1, r0),
            c.call(f1mPrefix+"_add", x0c, x1, r1),
        );
    }
    build_mulNR2();

    const f6mPrefix = buildF3m(module, f2mPrefix+"_mulNR", "f6m", "f2m");

    function build_mulNR6() {
        const f = module.addFunction(f6mPrefix + "_mulNR");
        f.addParam("x", "i32");
        f.addParam("pr", "i32");

        const c = f.getCodeBuilder();

        const c0copy = c.i32_const(module.alloc(f1size*2));

        f.addCode(
            c.call(
                f2mPrefix + "_copy",
                c.getLocal("x"),
                c0copy
            ),
            c.call(
                f2mPrefix + "_mulNR",
                c.i32_add(c.getLocal("x"), c.i32_const(n8q*4)),
                c.getLocal("pr")
            ),
            c.call(
                f2mPrefix + "_copy",
                c.i32_add(c.getLocal("x"), c.i32_const(n8q*2)),
                c.i32_add(c.getLocal("pr"), c.i32_const(n8q*4)),
            ),
            c.call(
                f2mPrefix + "_copy",
                c0copy,
                c.i32_add(c.getLocal("pr"), c.i32_const(n8q*2)),
            ),
        );
    }
    build_mulNR6();

    const ftmPrefix = buildF2m(module, f6mPrefix+"_mulNR", "ftm", f6mPrefix);

    const ateLoopCount = 0xd201000000010000n;
    const ateLoopBitBytes = bits(ateLoopCount);
    const pAteLoopBitBytes = module.alloc(ateLoopBitBytes);

    const ateCoefSize = 3 * f2size;
    const ateNDblCoefs = ateLoopBitBytes.length-1;
    const ateNAddCoefs = ateLoopBitBytes.reduce((acc, b) =>  acc + ( b!=0 ? 1 : 0)   ,0);
    const ateNCoefs = ateNAddCoefs + ateNDblCoefs + 1;
    const prePSize = 3*2*n8q;
    const preQSize = 3*n8q*2 + ateNCoefs*ateCoefSize;
    const finalExpIsNegative = true;

    const finalExpZ = 15132376222941642752n;


    module.modules[prefix] = {
        n64q: n64q,
        n64r: n64r,
        n8q: n8q,
        n8r: n8r,
        pG1gen: pG1gen,
        pG1zero: pG1zero,
        pG1b: pG1b,
        pG2gen: pG2gen,
        pG2zero: pG2zero,
        pG2b: pG2b,
        pq: module.modules["f1m"].pq,
        pr: pr,
        pOneT: pOneT,
        r: r,
        q: q,
        prePSize: prePSize,
        preQSize: preQSize
    };


    function naf(n) {
        let E = n;
        const res = [];
        while (E > 0n) {
            if (isOdd(E)) {
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
        let E = n;
        const res = [];
        while (E > 0n) {
            if (isOdd(E)) {
                res.push( 1 );
            } else {
                res.push( 0 );
            }
            E = E >> 1n;
        }
        return res;
    }

    function buildPrepareG1() {
        const f = module.addFunction(prefix+ "_prepareG1");
        f.addParam("pP", "i32");
        f.addParam("ppreP", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(g1mPrefix + "_normalize", c.getLocal("pP"), c.getLocal("ppreP")),  // TODO Remove if already in affine
        );
    }



    function buildPrepDoubleStep() {
        const f = module.addFunction(prefix+ "_prepDblStep");
        f.addParam("R", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const Rx  = c.getLocal("R");
        const Ry  = c.i32_add(c.getLocal("R"), c.i32_const(2*n8q));
        const Rz  = c.i32_add(c.getLocal("R"), c.i32_const(4*n8q));

        const t0  = c.getLocal("r");
        const t3  = c.i32_add(c.getLocal("r"), c.i32_const(2*n8q));
        const t6  = c.i32_add(c.getLocal("r"), c.i32_const(4*n8q));


        const zsquared = c.i32_const(module.alloc(f2size));
        const t1 = c.i32_const(module.alloc(f2size));
        const t2 = c.i32_const(module.alloc(f2size));
        const t4 = c.i32_const(module.alloc(f2size));
        const t5 = c.i32_const(module.alloc(f2size));

        f.addCode(

            // tmp0 = r.x.square();
            c.call(f2mPrefix + "_square", Rx, t0),

            // tmp1 = r.y.square();
            c.call(f2mPrefix + "_square", Ry, t1),

            // tmp2 = tmp1.square();
            c.call(f2mPrefix + "_square", t1, t2),

            // tmp3 = (tmp1 + r.x).square() - tmp0 - tmp2;
            c.call(f2mPrefix + "_add", t1, Rx, t3),
            c.call(f2mPrefix + "_square", t3, t3),
            c.call(f2mPrefix + "_sub", t3, t0, t3),
            c.call(f2mPrefix + "_sub", t3, t2, t3),

            // tmp3 = tmp3 + tmp3;
            c.call(f2mPrefix + "_add", t3, t3, t3),

            // tmp4 = tmp0 + tmp0 + tmp0;
            c.call(f2mPrefix + "_add", t0, t0, t4),
            c.call(f2mPrefix + "_add", t4, t0, t4),

            // tmp6 = r.x + tmp4;
            c.call(f2mPrefix + "_add", Rx, t4, t6),

            // tmp5 = tmp4.square();
            c.call(f2mPrefix + "_square", t4, t5),

            // zsquared = r.z.square();
            c.call(f2mPrefix + "_square", Rz, zsquared),

            // r.x = tmp5 - tmp3 - tmp3;
            c.call(f2mPrefix + "_sub", t5, t3, Rx),
            c.call(f2mPrefix + "_sub", Rx, t3, Rx),

            // r.z = (r.z + r.y).square() - tmp1 - zsquared;
            c.call(f2mPrefix + "_add", Rz, Ry, Rz),
            c.call(f2mPrefix + "_square", Rz, Rz),
            c.call(f2mPrefix + "_sub", Rz, t1, Rz),
            c.call(f2mPrefix + "_sub", Rz, zsquared, Rz),

            // r.y = (tmp3 - r.x) * tmp4;
            c.call(f2mPrefix + "_sub", t3, Rx, Ry),
            c.call(f2mPrefix + "_mul", Ry, t4, Ry),

            // tmp2 = tmp2 + tmp2;
            c.call(f2mPrefix + "_add", t2, t2, t2),

            // tmp2 = tmp2 + tmp2;
            c.call(f2mPrefix + "_add", t2, t2, t2),

            // tmp2 = tmp2 + tmp2;
            c.call(f2mPrefix + "_add", t2, t2, t2),

            // r.y -= tmp2;
            c.call(f2mPrefix + "_sub", Ry, t2, Ry),

            // tmp3 = tmp4 * zsquared;
            c.call(f2mPrefix + "_mul", t4, zsquared, t3),

            // tmp3 = tmp3 + tmp3;
            c.call(f2mPrefix + "_add", t3, t3, t3),

            // tmp3 = -tmp3;
            c.call(f2mPrefix + "_neg", t3, t3),

            // tmp6 = tmp6.square() - tmp0 - tmp5;
            c.call(f2mPrefix + "_square", t6, t6),
            c.call(f2mPrefix + "_sub", t6, t0, t6),
            c.call(f2mPrefix + "_sub", t6, t5, t6),

            // tmp1 = tmp1 + tmp1;
            c.call(f2mPrefix + "_add", t1, t1, t1),

            // tmp1 = tmp1 + tmp1;
            c.call(f2mPrefix + "_add", t1, t1, t1),

            // tmp6 = tmp6 - tmp1;
            c.call(f2mPrefix + "_sub", t6, t1, t6),

            // tmp0 = r.z * zsquared;
            c.call(f2mPrefix + "_mul", Rz, zsquared, t0),

            // tmp0 = tmp0 + tmp0;
            c.call(f2mPrefix + "_add", t0, t0, t0),

        );
    }

    function buildPrepAddStep() {
        const f = module.addFunction(prefix+ "_prepAddStep");
        f.addParam("R", "i32");
        f.addParam("Q", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const Rx  = c.getLocal("R");
        const Ry  = c.i32_add(c.getLocal("R"), c.i32_const(2*n8q));
        const Rz  = c.i32_add(c.getLocal("R"), c.i32_const(4*n8q));

        const Qx  = c.getLocal("Q");
        const Qy  = c.i32_add(c.getLocal("Q"), c.i32_const(2*n8q));

        const t10  = c.getLocal("r");
        const t1  = c.i32_add(c.getLocal("r"), c.i32_const(2*n8q));
        const t9  = c.i32_add(c.getLocal("r"), c.i32_const(4*n8q));

        const zsquared = c.i32_const(module.alloc(f2size));
        const ysquared = c.i32_const(module.alloc(f2size));
        const ztsquared = c.i32_const(module.alloc(f2size));
        const t0 = c.i32_const(module.alloc(f2size));
        const t2 = c.i32_const(module.alloc(f2size));
        const t3 = c.i32_const(module.alloc(f2size));
        const t4 = c.i32_const(module.alloc(f2size));
        const t5 = c.i32_const(module.alloc(f2size));
        const t6 = c.i32_const(module.alloc(f2size));
        const t7 = c.i32_const(module.alloc(f2size));
        const t8 = c.i32_const(module.alloc(f2size));

        f.addCode(

            // zsquared = r.z.square();
            c.call(f2mPrefix + "_square", Rz, zsquared),

            // ysquared = q.y.square();
            c.call(f2mPrefix + "_square", Qy, ysquared),

            // t0 = zsquared * q.x;
            c.call(f2mPrefix + "_mul", zsquared, Qx, t0),

            // t1 = ((q.y + r.z).square() - ysquared - zsquared) * zsquared;
            c.call(f2mPrefix + "_add", Qy, Rz, t1),
            c.call(f2mPrefix + "_square", t1, t1),
            c.call(f2mPrefix + "_sub", t1, ysquared, t1),
            c.call(f2mPrefix + "_sub", t1, zsquared, t1),
            c.call(f2mPrefix + "_mul", t1, zsquared, t1),

            // t2 = t0 - r.x;
            c.call(f2mPrefix + "_sub", t0, Rx, t2),

            // t3 = t2.square();
            c.call(f2mPrefix + "_square", t2, t3),

            // t4 = t3 + t3;
            c.call(f2mPrefix + "_add", t3, t3, t4),

            // t4 = t4 + t4;
            c.call(f2mPrefix + "_add", t4, t4, t4),

            // t5 = t4 * t2;
            c.call(f2mPrefix + "_mul", t4, t2, t5),

            // t6 = t1 - r.y - r.y;
            c.call(f2mPrefix + "_sub", t1, Ry, t6),
            c.call(f2mPrefix + "_sub", t6, Ry, t6),

            // t9 = t6 * q.x;
            c.call(f2mPrefix + "_mul", t6, Qx, t9),

            // t7 = t4 * r.x;
            c.call(f2mPrefix + "_mul", t4, Rx, t7),

            // r.x = t6.square() - t5 - t7 - t7;
            c.call(f2mPrefix + "_square", t6, Rx),
            c.call(f2mPrefix + "_sub", Rx, t5, Rx),
            c.call(f2mPrefix + "_sub", Rx, t7, Rx),
            c.call(f2mPrefix + "_sub", Rx, t7, Rx),

            // r.z = (r.z + t2).square() - zsquared - t3;
            c.call(f2mPrefix + "_add", Rz, t2, Rz),
            c.call(f2mPrefix + "_square", Rz, Rz),
            c.call(f2mPrefix + "_sub", Rz, zsquared, Rz),
            c.call(f2mPrefix + "_sub", Rz, t3, Rz),

            // t10 = q.y + r.z;
            c.call(f2mPrefix + "_add", Qy, Rz, t10),

            // t8 = (t7 - r.x) * t6;
            c.call(f2mPrefix + "_sub", t7, Rx, t8),
            c.call(f2mPrefix + "_mul", t8, t6, t8),

            // t0 = r.y * t5;
            c.call(f2mPrefix + "_mul", Ry, t5, t0),

            // t0 = t0 + t0;
            c.call(f2mPrefix + "_add", t0, t0, t0),

            // r.y = t8 - t0;
            c.call(f2mPrefix + "_sub", t8, t0, Ry),

            // t10 = t10.square() - ysquared;
            c.call(f2mPrefix + "_square", t10, t10),
            c.call(f2mPrefix + "_sub", t10, ysquared, t10),

            // ztsquared = r.z.square();
            c.call(f2mPrefix + "_square", Rz, ztsquared),

            // t10 = t10 - ztsquared;
            c.call(f2mPrefix + "_sub", t10, ztsquared, t10),

            // t9 = t9 + t9 - t10;
            c.call(f2mPrefix + "_add", t9, t9, t9),
            c.call(f2mPrefix + "_sub", t9, t10, t9),

            // t10 = r.z + r.z;
            c.call(f2mPrefix + "_add", Rz, Rz, t10),

            // t6 = -t6;
            c.call(f2mPrefix + "_neg", t6, t6),

            // t1 = t6 + t6;
            c.call(f2mPrefix + "_add", t6, t6, t1),
        );
    }


    function buildPrepareG2() {
        const f = module.addFunction(prefix+ "_prepareG2");
        f.addParam("pQ", "i32");
        f.addParam("ppreQ", "i32");
        f.addLocal("pCoef", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();


        const Q = c.getLocal("pQ");

        const pR = module.alloc(f2size*3);
        const R = c.i32_const(pR);

        const base = c.getLocal("ppreQ");

        f.addCode(
            c.call(g2mPrefix + "_normalize", Q, base),
            c.if(
                c.call(g2mPrefix + "_isZero", base),
                c.ret([])
            ),
            c.call(g2mPrefix + "_copy", base, R),
            c.setLocal("pCoef", c.i32_add(c.getLocal("ppreQ"), c.i32_const(f2size*3))),
        );

        f.addCode(
            c.setLocal("i", c.i32_const(ateLoopBitBytes.length-2)),
            c.block(c.loop(

                c.call(prefix + "_prepDblStep", R, c.getLocal("pCoef")),
                c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

                c.if(
                    c.i32_load8_s(c.getLocal("i"), pAteLoopBitBytes),
                    [
                        ...c.call(prefix + "_prepAddStep", R, base, c.getLocal("pCoef")),
                        ...c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),
                    ]
                ),
                c.br_if(1, c.i32_eqz ( c.getLocal("i") )),
                c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );
    }


    function buildF6Mul1() {
        const f = module.addFunction(f6mPrefix+ "_mul1");
        f.addParam("pA", "i32");    // F6
        f.addParam("pC1", "i32");   // F2
        f.addParam("pR", "i32");    // F6

        const c = f.getCodeBuilder();

        const A_c0 = c.getLocal("pA");
        const A_c1 = c.i32_add(c.getLocal("pA"), c.i32_const(f1size*2));
        const A_c2 = c.i32_add(c.getLocal("pA"), c.i32_const(f1size*4));

        const c1  = c.getLocal("pC1");

        const t1 = c.getLocal("pR");
        const t2 = c.i32_add(c.getLocal("pR"), c.i32_const(f1size*2));
        const b_b = c.i32_add(c.getLocal("pR"), c.i32_const(f1size*4));

        const Ac0_Ac1 = c.i32_const(module.alloc(f1size*2));
        const Ac1_Ac2 = c.i32_const(module.alloc(f1size*2));

        f.addCode(

            c.call(f2mPrefix + "_add", A_c0, A_c1, Ac0_Ac1),
            c.call(f2mPrefix + "_add", A_c1, A_c2, Ac1_Ac2),

            // let b_b = self.c1 * c1;
            c.call(f2mPrefix + "_mul", A_c1, c1, b_b),

            // let t1 = (self.c1 + self.c2) * c1 - b_b;
            c.call(f2mPrefix + "_mul", Ac1_Ac2, c1, t1),
            c.call(f2mPrefix + "_sub", t1, b_b, t1),

            // let t1 = t1.mul_by_nonresidue();
            c.call(f2mPrefix + "_mulNR", t1, t1),

            // let t2 = (self.c0 + self.c1) * c1 - b_b;
            c.call(f2mPrefix + "_mul", Ac0_Ac1, c1, t2),
            c.call(f2mPrefix + "_sub", t2, b_b, t2),
        );
    }
    buildF6Mul1();

    function buildF6Mul01() {
        const f = module.addFunction(f6mPrefix+ "_mul01");
        f.addParam("pA", "i32");    // F6
        f.addParam("pC0", "i32");   // F2
        f.addParam("pC1", "i32");   // F2
        f.addParam("pR", "i32");    // F6

        const c = f.getCodeBuilder();

        const A_c0 = c.getLocal("pA");
        const A_c1 = c.i32_add(c.getLocal("pA"), c.i32_const(f1size*2));
        const A_c2 = c.i32_add(c.getLocal("pA"), c.i32_const(f1size*4));

        const c0  = c.getLocal("pC0");
        const c1  = c.getLocal("pC1");

        const t1 = c.getLocal("pR");
        const t2 = c.i32_add(c.getLocal("pR"), c.i32_const(f1size*2));
        const t3 = c.i32_add(c.getLocal("pR"), c.i32_const(f1size*4));

        const a_a = c.i32_const(module.alloc(f1size*2));
        const b_b = c.i32_const(module.alloc(f1size*2));
        const Ac0_Ac1 = c.i32_const(module.alloc(f1size*2));
        const Ac0_Ac2 = c.i32_const(module.alloc(f1size*2));

        f.addCode(
            // let a_a = self.c0 * c0;
            c.call(f2mPrefix + "_mul", A_c0, c0, a_a),

            // let b_b = self.c1 * c1;
            c.call(f2mPrefix + "_mul", A_c1, c1, b_b),


            c.call(f2mPrefix + "_add", A_c0, A_c1, Ac0_Ac1),
            c.call(f2mPrefix + "_add", A_c0, A_c2, Ac0_Ac2),

            // let t1 = (self.c1 + self.c2) * c1 - b_b;
            c.call(f2mPrefix + "_add", A_c1, A_c2, t1),
            c.call(f2mPrefix + "_mul", t1, c1, t1),
            c.call(f2mPrefix + "_sub", t1, b_b, t1),

            // let t1 = t1.mul_by_nonresidue() + a_a;
            c.call(f2mPrefix + "_mulNR", t1, t1),
            c.call(f2mPrefix + "_add", t1, a_a, t1),

            // let t2 = (c0 + c1) * (self.c0 + self.c1) - a_a - b_b;
            c.call(f2mPrefix + "_add", c0, c1, t2),
            c.call(f2mPrefix + "_mul", t2, Ac0_Ac1, t2),
            c.call(f2mPrefix + "_sub", t2, a_a, t2),
            c.call(f2mPrefix + "_sub", t2, b_b, t2),

            // let t3 = (self.c0 + self.c2) * c0 - a_a + b_b;
            c.call(f2mPrefix + "_mul", Ac0_Ac2, c0, t3),
            c.call(f2mPrefix + "_sub", t3, a_a, t3),
            c.call(f2mPrefix + "_add", t3, b_b, t3),


        );
    }
    buildF6Mul01();


    function buildF12Mul014() {

        const f = module.addFunction(ftmPrefix+ "_mul014");
        f.addParam("pA", "i32");    // F12
        f.addParam("pC0", "i32");   // F2
        f.addParam("pC1", "i32");   // F2
        f.addParam("pC4", "i32");   // F2
        f.addParam("pR", "i32");    // F12

        const c = f.getCodeBuilder();


        const A_c0 = c.getLocal("pA");
        const A_c1 = c.i32_add(c.getLocal("pA"), c.i32_const(f1size*6));

        const c0  = c.getLocal("pC0");
        const c1  = c.getLocal("pC1");
        const c4  = c.getLocal("pC4");

        const aa = c.i32_const(module.alloc(f1size*6));
        const bb = c.i32_const(module.alloc(f1size*6));
        const o = c.i32_const(module.alloc(f1size*2));

        const R_c0 = c.getLocal("pR");
        const R_c1 = c.i32_add(c.getLocal("pR"), c.i32_const(f1size*6));

        f.addCode(
            // let aa = self.c0.mul_by_01(c0, c1);
            c.call(f6mPrefix + "_mul01", A_c0, c0, c1, aa),

            // let bb = self.c1.mul_by_1(c4);
            c.call(f6mPrefix + "_mul1", A_c1, c4, bb),

            // let o = c1 + c4;
            c.call(f2mPrefix + "_add", c1, c4, o),

            // let c1 = self.c1 + self.c0;
            c.call(f6mPrefix + "_add", A_c1, A_c0, R_c1),

            // let c1 = c1.mul_by_01(c0, &o);
            c.call(f6mPrefix + "_mul01", R_c1, c0, o, R_c1),

            // let c1 = c1 - aa - bb;
            c.call(f6mPrefix + "_sub", R_c1, aa, R_c1),
            c.call(f6mPrefix + "_sub", R_c1, bb, R_c1),

            // let c0 = bb;
            c.call(f6mPrefix + "_copy", bb, R_c0),

            // let c0 = c0.mul_by_nonresidue();
            c.call(f6mPrefix + "_mulNR", R_c0, R_c0),

            // let c0 = c0 + aa;
            c.call(f6mPrefix + "_add", R_c0, aa, R_c0),
        );
    }
    buildF12Mul014();


    function buildELL() {
        const f = module.addFunction(prefix+ "_ell");
        f.addParam("pP", "i32");
        f.addParam("pCoefs", "i32");
        f.addParam("pF", "i32");

        const c = f.getCodeBuilder();

        const Px  = c.getLocal("pP");
        const Py  = c.i32_add(c.getLocal("pP"), c.i32_const(n8q));

        const F  = c.getLocal("pF");

        const coef0_0  = c.getLocal("pCoefs");
        const coef0_1  = c.i32_add(c.getLocal("pCoefs"), c.i32_const(f1size));
        const coef1_0  = c.i32_add(c.getLocal("pCoefs"), c.i32_const(f1size*2));
        const coef1_1  = c.i32_add(c.getLocal("pCoefs"), c.i32_const(f1size*3));
        const coef2  = c.i32_add(c.getLocal("pCoefs"), c.i32_const(f1size*4));

        const pc0 = module.alloc(f1size*2);
        const c0  = c.i32_const(pc0);
        const c0_c0 = c.i32_const(pc0);
        const c0_c1 = c.i32_const(pc0+f1size);

        const pc1 = module.alloc(f1size*2);
        const c1  = c.i32_const(pc1);
        const c1_c0 = c.i32_const(pc1);
        const c1_c1 = c.i32_const(pc1+f1size);
        f.addCode(
            //     let mut c0 = coeffs.0;
            //     let mut c1 = coeffs.1;
            //
            //    c0.c0 *= p.y;
            //    c0.c1 *= p.y;
            //
            //    c1.c0 *= p.x;
            //    c1.c1 *= p.x;
            //
            //     f.mul_by_014(&coeffs.2, &c1, &c0)

            c.call(f1mPrefix + "_mul", coef0_0, Py, c0_c0),
            c.call(f1mPrefix + "_mul", coef0_1, Py, c0_c1),
            c.call(f1mPrefix + "_mul", coef1_0, Px, c1_c0),
            c.call(f1mPrefix + "_mul", coef1_1, Px, c1_c1),

            c.call(ftmPrefix + "_mul014", F, coef2, c1, c0, F),

        );

    }
    buildELL();

    function buildMillerLoop() {
        const f = module.addFunction(prefix+ "_millerLoop");
        f.addParam("ppreP", "i32");
        f.addParam("ppreQ", "i32");
        f.addParam("r", "i32");
        f.addLocal("pCoef", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const preP = c.getLocal("ppreP");

        const coefs  = c.getLocal("pCoef");

        const F = c.getLocal("r");


        f.addCode(
            c.call(ftmPrefix + "_one", F),

            c.if(
                c.call(g1mPrefix + "_isZero", preP),
                c.ret([])
            ),
            c.if(
                c.call(g1mPrefix + "_isZero", c.getLocal("ppreQ")),
                c.ret([])
            ),
            c.setLocal("pCoef", c.i32_add( c.getLocal("ppreQ"), c.i32_const(f2size*3))),

            c.setLocal("i", c.i32_const(ateLoopBitBytes.length-2)),
            c.block(c.loop(


                c.call(prefix + "_ell", preP, coefs,  F),
                c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),

                c.if(
                    c.i32_load8_s(c.getLocal("i"), pAteLoopBitBytes),
                    [
                        ...c.call(prefix + "_ell", preP, coefs,  F),
                        ...c.setLocal("pCoef", c.i32_add(c.getLocal("pCoef"), c.i32_const(ateCoefSize))),
                    ]
                ),
                c.call(ftmPrefix + "_square", F, F),

                c.br_if(1, c.i32_eq ( c.getLocal("i"), c.i32_const(1) )),
                c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            )),
            c.call(prefix + "_ell", preP, coefs,  F),

        );


        {
            f.addCode(
                c.call(ftmPrefix + "_conjugate", F, F),
            );
        }
    }


    function buildFrobeniusMap(n) {
        const F12 = [
            [
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
            ],
            [
                [1n, 0n],
                [3850754370037169011952147076051364057158807420970682438676050522613628423219637725072182697113062777891589506424760n, 151655185184498381465642749684540099398075398968325446656007613510403227271200139370504932015952886146304766135027n],
                [793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620351n, 0n],
                [2973677408986561043442465346520108879172042883009249989176415018091420807192182638567116318576472649347015917690530n, 1028732146235106349975324479215795277384839936929757896155643118032610843298655225875571310552543014690878354869257n],
                [793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620350n, 0n],
                [3125332594171059424908108096204648978570118281977575435832422631601824034463382777937621250592425535493320683825557n, 877076961050607968509681729531255177986764537961432449499635504522207616027455086505066378536590128544573588734230n],
                [4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559786n, 0n],
                [151655185184498381465642749684540099398075398968325446656007613510403227271200139370504932015952886146304766135027n, 3850754370037169011952147076051364057158807420970682438676050522613628423219637725072182697113062777891589506424760n],
                [4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939436n, 0n],
                [1028732146235106349975324479215795277384839936929757896155643118032610843298655225875571310552543014690878354869257n, 2973677408986561043442465346520108879172042883009249989176415018091420807192182638567116318576472649347015917690530n],
                [4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939437n, 0n],
                [877076961050607968509681729531255177986764537961432449499635504522207616027455086505066378536590128544573588734230n, 3125332594171059424908108096204648978570118281977575435832422631601824034463382777937621250592425535493320683825557n],
            ]
        ];

        const F6 = [
            [
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
                [1n, 0n],
            ],
            [
                [1n, 0n],
                [0n, 4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939436n],
                [793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620350n, 0n],
                [0n, 1n],
                [4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939436n, 0n],
                [0n, 793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620350n],
            ],
            [
                [1n, 0n],
                [4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939437n, 0n],
                [4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939436n, 0n],
                [4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559786n, 0n],
                [793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620350n, 0n],
                [793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620351n, 0n],
            ]
        ];

        const f = module.addFunction(ftmPrefix + "_frobeniusMap"+n);
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        for (let i=0; i<6; i++) {
            const X = (i==0) ? c.getLocal("x") : c.i32_add(c.getLocal("x"), c.i32_const(i*f2size));
            const Xc0 = X;
            const Xc1 = c.i32_add(c.getLocal("x"), c.i32_const(i*f2size + f1size));
            const R = (i==0) ? c.getLocal("r") : c.i32_add(c.getLocal("r"), c.i32_const(i*f2size));
            const Rc0 = R;
            const Rc1 = c.i32_add(c.getLocal("r"), c.i32_const(i*f2size + f1size));
            const coef = mul2(F12[Math.floor(i/3)][n%12] , F6[i%3][n%6]);
            const pCoef = module.alloc([
                ...utils.bigInt2BytesLE(toMontgomery(coef[0]), n8q),
                ...utils.bigInt2BytesLE(toMontgomery(coef[1]), n8q),
            ]);
            if (n%2 == 1) {
                f.addCode(
                    c.call(f1mPrefix + "_copy", Xc0, Rc0),
                    c.call(f1mPrefix + "_neg", Xc1, Rc1),
                    c.call(f2mPrefix + "_mul", R, c.i32_const(pCoef), R),
                );
            } else {
                f.addCode(c.call(f2mPrefix + "_mul", X, c.i32_const(pCoef), R));
            }
        }

        function mul2(a, b) {
            const ac0 = a[0];
            const ac1 = a[1];
            const bc0 = b[0];
            const bc1 = b[1];
            const res = [
                (ac0 * bc0 - (ac1 * bc1)) % q,
                (ac0 * bc1 + (ac1 * bc0)) % q,
            ];
            if (isNegative(res[0])) res[0] = res[0] + q;
            return res;
        }

    }


    function buildCyclotomicSquare() {
        const f = module.addFunction(prefix+ "__cyclotomicSquare");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const x0 = c.getLocal("x");
        const x4 = c.i32_add(c.getLocal("x"), c.i32_const(f2size));
        const x3 = c.i32_add(c.getLocal("x"), c.i32_const(2*f2size));
        const x2 = c.i32_add(c.getLocal("x"), c.i32_const(3*f2size));
        const x1 = c.i32_add(c.getLocal("x"), c.i32_const(4*f2size));
        const x5 = c.i32_add(c.getLocal("x"), c.i32_const(5*f2size));

        const r0 = c.getLocal("r");
        const r4 = c.i32_add(c.getLocal("r"), c.i32_const(f2size));
        const r3 = c.i32_add(c.getLocal("r"), c.i32_const(2*f2size));
        const r2 = c.i32_add(c.getLocal("r"), c.i32_const(3*f2size));
        const r1 = c.i32_add(c.getLocal("r"), c.i32_const(4*f2size));
        const r5 = c.i32_add(c.getLocal("r"), c.i32_const(5*f2size));

        const t0 = c.i32_const(module.alloc(f2size));
        const t1 = c.i32_const(module.alloc(f2size));
        const t2 = c.i32_const(module.alloc(f2size));
        const t3 = c.i32_const(module.alloc(f2size));
        const t4 = c.i32_const(module.alloc(f2size));
        const t5 = c.i32_const(module.alloc(f2size));
        const tmp = c.i32_const(module.alloc(f2size));
        const AUX = c.i32_const(module.alloc(f2size));


        f.addCode(
            //    // t0 + t1*y = (z0 + z1*y)^2 = a^2
            //    tmp = z0 * z1;
            //    t0 = (z0 + z1) * (z0 + my_Fp6::non_residue * z1) - tmp - my_Fp6::non_residue * tmp;
            //    t1 = tmp + tmp;
            c.call(f2mPrefix + "_mul", x0, x1, tmp),
            c.call(f2mPrefix + "_mulNR", x1, t0),
            c.call(f2mPrefix + "_add", x0, t0, t0),
            c.call(f2mPrefix + "_add", x0, x1, AUX),
            c.call(f2mPrefix + "_mul", AUX, t0, t0),
            c.call(f2mPrefix + "_mulNR", tmp, AUX),
            c.call(f2mPrefix + "_add", tmp, AUX, AUX),
            c.call(f2mPrefix + "_sub", t0, AUX, t0),
            c.call(f2mPrefix + "_add", tmp, tmp, t1),

            //  // t2 + t3*y = (z2 + z3*y)^2 = b^2
            //  tmp = z2 * z3;
            //  t2 = (z2 + z3) * (z2 + my_Fp6::non_residue * z3) - tmp - my_Fp6::non_residue * tmp;
            //  t3 = tmp + tmp;
            c.call(f2mPrefix + "_mul", x2, x3, tmp),
            c.call(f2mPrefix + "_mulNR", x3, t2),
            c.call(f2mPrefix + "_add", x2, t2, t2),
            c.call(f2mPrefix + "_add", x2, x3, AUX),
            c.call(f2mPrefix + "_mul", AUX, t2, t2),
            c.call(f2mPrefix + "_mulNR", tmp, AUX),
            c.call(f2mPrefix + "_add", tmp, AUX, AUX),
            c.call(f2mPrefix + "_sub", t2, AUX, t2),
            c.call(f2mPrefix + "_add", tmp, tmp, t3),

            //  // t4 + t5*y = (z4 + z5*y)^2 = c^2
            //  tmp = z4 * z5;
            //  t4 = (z4 + z5) * (z4 + my_Fp6::non_residue * z5) - tmp - my_Fp6::non_residue * tmp;
            //  t5 = tmp + tmp;
            c.call(f2mPrefix + "_mul", x4, x5, tmp),
            c.call(f2mPrefix + "_mulNR", x5, t4),
            c.call(f2mPrefix + "_add", x4, t4, t4),
            c.call(f2mPrefix + "_add", x4, x5, AUX),
            c.call(f2mPrefix + "_mul", AUX, t4, t4),
            c.call(f2mPrefix + "_mulNR", tmp, AUX),
            c.call(f2mPrefix + "_add", tmp, AUX, AUX),
            c.call(f2mPrefix + "_sub", t4, AUX, t4),
            c.call(f2mPrefix + "_add", tmp, tmp, t5),

            // For A
            // z0 = 3 * t0 - 2 * z0
            c.call(f2mPrefix + "_sub", t0, x0, r0),
            c.call(f2mPrefix + "_add", r0, r0, r0),
            c.call(f2mPrefix + "_add", t0, r0, r0),
            // z1 = 3 * t1 + 2 * z1
            c.call(f2mPrefix + "_add", t1, x1, r1),
            c.call(f2mPrefix + "_add", r1, r1, r1),
            c.call(f2mPrefix + "_add", t1, r1, r1),

            // For B
            // z2 = 3 * (xi * t5) + 2 * z2
            c.call(f2mPrefix + "_mul", t5, c.i32_const(pBls12381Twist), AUX),
            c.call(f2mPrefix + "_add", AUX, x2, r2),
            c.call(f2mPrefix + "_add", r2, r2, r2),
            c.call(f2mPrefix + "_add", AUX, r2, r2),
            // z3 = 3 * t4 - 2 * z3
            c.call(f2mPrefix + "_sub", t4, x3, r3),
            c.call(f2mPrefix + "_add", r3, r3, r3),
            c.call(f2mPrefix + "_add", t4, r3, r3),

            // For C
            // z4 = 3 * t2 - 2 * z4
            c.call(f2mPrefix + "_sub", t2, x4, r4),
            c.call(f2mPrefix + "_add", r4, r4, r4),
            c.call(f2mPrefix + "_add", t2, r4, r4),
            // z5 = 3 * t3 + 2 * z5
            c.call(f2mPrefix + "_add", t3, x5, r5),
            c.call(f2mPrefix + "_add", r5, r5, r5),
            c.call(f2mPrefix + "_add", t3, r5, r5),

        );
    }


    function buildCyclotomicExp(exponent, isExpNegative, fnName) {
        const exponentNafBytes = naf(exponent).map( (b) => (b==-1 ? 0xFF: b) );
        const pExponentNafBytes = module.alloc(exponentNafBytes);
        // const pExponent = module.alloc(utils.bigInt2BytesLE(exponent, n8));

        const f = module.addFunction(prefix+ "__cyclotomicExp_"+fnName);
        f.addParam("x", "i32");
        f.addParam("r", "i32");
        f.addLocal("bit", "i32");
        f.addLocal("i", "i32");

        const c = f.getCodeBuilder();

        const x = c.getLocal("x");

        const res = c.getLocal("r");

        const inverse = c.i32_const(module.alloc(ftsize));


        f.addCode(
            c.call(ftmPrefix + "_conjugate", x, inverse),
            c.call(ftmPrefix + "_one", res),

            c.if(
                c.teeLocal("bit", c.i32_load8_s(c.i32_const(exponentNafBytes.length-1), pExponentNafBytes)),
                c.if(
                    c.i32_eq(
                        c.getLocal("bit"),
                        c.i32_const(1)
                    ),
                    c.call(ftmPrefix + "_mul", res, x, res),
                    c.call(ftmPrefix + "_mul", res, inverse, res),
                )
            ),

            c.setLocal("i", c.i32_const(exponentNafBytes.length-2)),
            c.block(c.loop(
                c.call(prefix + "__cyclotomicSquare", res, res),
                c.if(
                    c.teeLocal("bit", c.i32_load8_s(c.getLocal("i"), pExponentNafBytes)),
                    c.if(
                        c.i32_eq(
                            c.getLocal("bit"),
                            c.i32_const(1)
                        ),
                        c.call(ftmPrefix + "_mul", res, x, res),
                        c.call(ftmPrefix + "_mul", res, inverse, res),
                    )
                ),
                c.br_if(1, c.i32_eqz ( c.getLocal("i") )),
                c.setLocal("i", c.i32_sub(c.getLocal("i"), c.i32_const(1))),
                c.br(0)
            ))
        );

        if (isExpNegative) {
            f.addCode(
                c.call(ftmPrefix + "_conjugate", res, res),
            );
        }

    }

    function buildFinalExponentiation() {
        buildCyclotomicSquare();
        buildCyclotomicExp(finalExpZ, finalExpIsNegative, "w0");

        const f = module.addFunction(prefix+ "_finalExponentiation");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const elt = c.getLocal("x");
        const res = c.getLocal("r");
        const t0 = c.i32_const(module.alloc(ftsize));
        const t1 = c.i32_const(module.alloc(ftsize));
        const t2 = c.i32_const(module.alloc(ftsize));
        const t3 = c.i32_const(module.alloc(ftsize));
        const t4 = c.i32_const(module.alloc(ftsize));
        const t5 = c.i32_const(module.alloc(ftsize));
        const t6 = c.i32_const(module.alloc(ftsize));

        f.addCode(

            // let mut t0 = f.frobenius_map(6)
            c.call(ftmPrefix + "_frobeniusMap6", elt, t0),

            // let t1 = f.invert()
            c.call(ftmPrefix + "_inverse", elt, t1),

            // let mut t2 = t0 * t1;
            c.call(ftmPrefix + "_mul", t0, t1, t2),

            // t1 = t2.clone();
            c.call(ftmPrefix + "_copy", t2, t1),

            // t2 = t2.frobenius_map().frobenius_map();
            c.call(ftmPrefix + "_frobeniusMap2", t2, t2),

            // t2 *= t1;
            c.call(ftmPrefix + "_mul", t2, t1, t2),


            // t1 = cyclotomic_square(t2).conjugate();
            c.call(prefix + "__cyclotomicSquare", t2, t1),
            c.call(ftmPrefix + "_conjugate", t1, t1),

            // let mut t3 = cycolotomic_exp(t2);
            c.call(prefix + "__cyclotomicExp_w0", t2, t3),

            // let mut t4 = cyclotomic_square(t3);
            c.call(prefix + "__cyclotomicSquare", t3, t4),

            // let mut t5 = t1 * t3;
            c.call(ftmPrefix + "_mul", t1, t3, t5),

            // t1 = cycolotomic_exp(t5);
            c.call(prefix + "__cyclotomicExp_w0", t5, t1),

            // t0 = cycolotomic_exp(t1);
            c.call(prefix + "__cyclotomicExp_w0", t1, t0),

            // let mut t6 = cycolotomic_exp(t0);
            c.call(prefix + "__cyclotomicExp_w0", t0, t6),

            // t6 *= t4;
            c.call(ftmPrefix + "_mul", t6, t4, t6),

            // t4 = cycolotomic_exp(t6);
            c.call(prefix + "__cyclotomicExp_w0", t6, t4),

            // t5 = t5.conjugate();
            c.call(ftmPrefix + "_conjugate", t5, t5),

            // t4 *= t5 * t2;
            c.call(ftmPrefix + "_mul", t4, t5, t4),
            c.call(ftmPrefix + "_mul", t4, t2, t4),

            // t5 = t2.conjugate();
            c.call(ftmPrefix + "_conjugate", t2, t5),

            // t1 *= t2;
            c.call(ftmPrefix + "_mul", t1, t2, t1),

            // t1 = t1.frobenius_map().frobenius_map().frobenius_map();
            c.call(ftmPrefix + "_frobeniusMap3", t1, t1),

            // t6 *= t5;
            c.call(ftmPrefix + "_mul", t6, t5, t6),

            // t6 = t6.frobenius_map();
            c.call(ftmPrefix + "_frobeniusMap1", t6, t6),

            // t3 *= t0;
            c.call(ftmPrefix + "_mul", t3, t0, t3),

            // t3 = t3.frobenius_map().frobenius_map();
            c.call(ftmPrefix + "_frobeniusMap2", t3, t3),

            // t3 *= t1;
            c.call(ftmPrefix + "_mul", t3, t1, t3),

            // t3 *= t6;
            c.call(ftmPrefix + "_mul", t3, t6, t3),

            // f = t3 * t4;
            c.call(ftmPrefix + "_mul", t3, t4, res),

        );
    }


    function buildFinalExponentiationOld() {
        const f = module.addFunction(prefix+ "_finalExponentiationOld");
        f.addParam("x", "i32");
        f.addParam("r", "i32");

        const exponent = 322277361516934140462891564586510139908379969514828494218366688025288661041104682794998680497580008899973249814104447692778988208376779573819485263026159588510513834876303014016798809919343532899164848730280942609956670917565618115867287399623286813270357901731510188149934363360381614501334086825442271920079363289954510565375378443704372994881406797882676971082200626541916413184642520269678897559532260949334760604962086348898118982248842634379637598665468817769075878555493752214492790122785850202957575200176084204422751485957336465472324810982833638490904279282696134323072515220044451592646885410572234451732790590013479358343841220074174848221722017083597872017638514103174122784843925578370430843522959600095676285723737049438346544753168912974976791528535276317256904336520179281145394686565050419250614107803233314658825463117900250701199181529205942363159325765991819433914303908860460720581408201373164047773794825411011922305820065611121544561808414055302212057471395719432072209245600258134364584636810093520285711072578721435517884103526483832733289802426157301542744476740008494780363354305116978805620671467071400711358839553375340724899735460480144599782014906586543813292157922220645089192130209334926661588737007768565838519456601560804957985667880395221049249803753582637708560n;

        const pExponent = module.alloc(utils.bigInt2BytesLE( exponent, 544 ));

        const c = f.getCodeBuilder();

        f.addCode(
            c.call(ftmPrefix + "_exp", c.getLocal("x"), c.i32_const(pExponent), c.i32_const(544), c.getLocal("r")),
        );
    }


    const pPreP = module.alloc(prePSize);
    const pPreQ = module.alloc(preQSize);

    function buildPairingEquation(nPairings) {

        const f = module.addFunction(prefix+ "_pairingEq"+nPairings);
        for (let i=0; i<nPairings; i++) {
            f.addParam("p_"+i, "i32");
            f.addParam("q_"+i, "i32");
        }
        f.addParam("c", "i32");
        f.setReturnType("i32");


        const c = f.getCodeBuilder();

        const resT = c.i32_const(module.alloc(ftsize));
        const auxT = c.i32_const(module.alloc(ftsize));

        f.addCode(c.call(ftmPrefix + "_one", resT ));

        for (let i=0; i<nPairings; i++) {

            f.addCode(c.call(prefix + "_prepareG1", c.getLocal("p_"+i), c.i32_const(pPreP) ));
            f.addCode(c.call(prefix + "_prepareG2", c.getLocal("q_"+i), c.i32_const(pPreQ) ));

            // Checks
            f.addCode(
                c.if(
                    c.i32_eqz(c.call(g1mPrefix + "_inGroupAffine", c.i32_const(pPreP))),
                    c.ret(c.i32_const(0))
                ),
                c.if(
                    c.i32_eqz(c.call(g2mPrefix + "_inGroupAffine", c.i32_const(pPreQ))),
                    c.ret(c.i32_const(0))
                )
            );

            f.addCode(c.call(prefix + "_millerLoop", c.i32_const(pPreP), c.i32_const(pPreQ), auxT ));

            f.addCode(c.call(ftmPrefix + "_mul", resT, auxT, resT ));
        }

        f.addCode(c.call(prefix + "_finalExponentiation", resT, resT ));

        f.addCode(c.call(ftmPrefix + "_eq", resT, c.getLocal("c")));
    }


    function buildPairing() {

        const f = module.addFunction(prefix+ "_pairing");
        f.addParam("p", "i32");
        f.addParam("q", "i32");
        f.addParam("r", "i32");

        const c = f.getCodeBuilder();

        const resT = c.i32_const(module.alloc(ftsize));

        f.addCode(c.call(prefix + "_prepareG1", c.getLocal("p"), c.i32_const(pPreP) ));
        f.addCode(c.call(prefix + "_prepareG2", c.getLocal("q"), c.i32_const(pPreQ) ));
        f.addCode(c.call(prefix + "_millerLoop", c.i32_const(pPreP), c.i32_const(pPreQ), resT ));
        f.addCode(c.call(prefix + "_finalExponentiation", resT, c.getLocal("r") ));
    }


    function buildInGroupG2() {
        const f = module.addFunction(g2mPrefix+ "_inGroupAffine");
        f.addParam("p", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const WINV = [
            2001204777610833696708894912867952078278441409969503942666029068062015825245418932221343814564507832018947136279894n,
            2001204777610833696708894912867952078278441409969503942666029068062015825245418932221343814564507832018947136279893n
        ];

        const FROB2X = 4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939436n;
        const FROB3Y = [
            2973677408986561043442465346520108879172042883009249989176415018091420807192182638567116318576472649347015917690530n,
            2973677408986561043442465346520108879172042883009249989176415018091420807192182638567116318576472649347015917690530n
        ];

        const wInv = c.i32_const(module.alloc([
            ...utils.bigInt2BytesLE(toMontgomery(WINV[0]), n8q),
            ...utils.bigInt2BytesLE(toMontgomery(WINV[1]), n8q),
        ]));

        const frob2X = c.i32_const(module.alloc(utils.bigInt2BytesLE(toMontgomery(FROB2X), n8q)));
        const frob3Y = c.i32_const(module.alloc([
            ...utils.bigInt2BytesLE(toMontgomery(FROB3Y[0]), n8q),
            ...utils.bigInt2BytesLE(toMontgomery(FROB3Y[1]), n8q),
        ]));

        const z = c.i32_const(module.alloc(utils.bigInt2BytesLE(finalExpZ, 8)));

        const px = c.getLocal("p");
        const py = c.i32_add(c.getLocal("p"), c.i32_const(f2size));

        const aux = c.i32_const(module.alloc(f1size));

        const x_winv = c.i32_const(module.alloc(f2size));
        const y_winv = c.i32_const(module.alloc(f2size));
        const pf2 = module.alloc(f2size*2);
        const f2 = c.i32_const(pf2);
        const f2x = c.i32_const(pf2);
        const f2x_c1 = c.i32_const(pf2);
        const f2x_c2 = c.i32_const(pf2+f1size);
        const f2y = c.i32_const(pf2+f2size);
        const f2y_c1 = c.i32_const(pf2+f2size);
        const f2y_c2 = c.i32_const(pf2+f2size+f1size);
        const pf3 = module.alloc(f2size*3);
        const f3 = c.i32_const(pf3);
        const f3x = c.i32_const(pf3);
        const f3x_c1 = c.i32_const(pf3);
        const f3x_c2 = c.i32_const(pf3+f1size);
        const f3y = c.i32_const(pf3+f2size);
        const f3y_c1 = c.i32_const(pf3+f2size);
        const f3y_c2 = c.i32_const(pf3+f2size+f1size);
        const f3z = c.i32_const(pf3+f2size*2);


        f.addCode(
            c.if(
                c.call(g2mPrefix + "_isZeroAffine", c.getLocal("p")),
                c.ret( c.i32_const(1)),
            ),
            c.if(
                c.i32_eqz(c.call(g2mPrefix + "_inCurveAffine", c.getLocal("p"))),
                c.ret( c.i32_const(0)),
            ),
            c.call(f2mPrefix + "_mul", px, wInv, x_winv),
            c.call(f2mPrefix + "_mul", py, wInv, y_winv),

            c.call(f2mPrefix + "_mul1", x_winv, frob2X, f2x),
            c.call(f2mPrefix + "_neg", y_winv, f2y),

            c.call(f2mPrefix + "_neg", x_winv, f3x),
            c.call(f2mPrefix + "_mul", y_winv, frob3Y, f3y),

            c.call(f1mPrefix + "_sub", f2x_c1, f2x_c2, aux),
            c.call(f1mPrefix + "_add", f2x_c1, f2x_c2, f2x_c2),
            c.call(f1mPrefix + "_copy", aux, f2x_c1),

            c.call(f1mPrefix + "_sub", f2y_c1, f2y_c2, aux),
            c.call(f1mPrefix + "_add", f2y_c1, f2y_c2, f2y_c2),
            c.call(f1mPrefix + "_copy", aux, f2y_c1),

            c.call(f1mPrefix + "_add", f3x_c1, f3x_c2, aux),
            c.call(f1mPrefix + "_sub", f3x_c1, f3x_c2, f3x_c2),
            c.call(f1mPrefix + "_copy", aux, f3x_c1),

            c.call(f1mPrefix + "_sub", f3y_c2, f3y_c1, aux),
            c.call(f1mPrefix + "_add", f3y_c1, f3y_c2, f3y_c2),
            c.call(f1mPrefix + "_copy", aux, f3y_c1),

            c.call(f2mPrefix + "_one", f3z),

            c.call(g2mPrefix + "_timesScalar", f3, z, c.i32_const(8), f3),
            c.call(g2mPrefix + "_addMixed", f3, f2, f3),

            c.ret(
                c.call(g2mPrefix + "_eqMixed", f3, c.getLocal("p"))
            )
        );

        const fInGroup = module.addFunction(g2mPrefix + "_inGroup");
        fInGroup.addParam("pIn", "i32");
        fInGroup.setReturnType("i32");

        const c2 = fInGroup.getCodeBuilder();

        const aux2 = c2.i32_const(module.alloc(f2size*2));

        fInGroup.addCode(
            c2.call(g2mPrefix + "_toAffine", c2.getLocal("pIn"), aux2),

            c2.ret(
                c2.call(g2mPrefix + "_inGroupAffine", aux2),
            )
        );

    }

    function buildInGroupG1() {
        const f = module.addFunction(g1mPrefix+ "_inGroupAffine");
        f.addParam("p", "i32");
        f.setReturnType("i32");

        const c = f.getCodeBuilder();

        const BETA = 4002409555221667392624310435006688643935503118305586438271171395842971157480381377015405980053539358417135540939436n;
        const BETA2 = 793479390729215512621379701633421447060886740281060493010456487427281649075476305620758731620350n;
        const Z2M1D3 = (finalExpZ * finalExpZ - 1n) / 3n;

        const beta = c.i32_const(module.alloc(utils.bigInt2BytesLE(toMontgomery(BETA), n8q)));
        const beta2 = c.i32_const(module.alloc(utils.bigInt2BytesLE(toMontgomery(BETA2), n8q)));

        const z2m1d3 = c.i32_const(module.alloc(utils.bigInt2BytesLE(Z2M1D3, 16)));


        const px = c.getLocal("p");
        const py = c.i32_add(c.getLocal("p"), c.i32_const(f1size));

        const psp = module.alloc(f1size*3);
        const sp = c.i32_const(psp);
        const spx = c.i32_const(psp);
        const spy = c.i32_const(psp+f1size);

        const ps2p = module.alloc(f1size*2);
        const s2p = c.i32_const(ps2p);
        const s2px = c.i32_const(ps2p);
        const s2py = c.i32_const(ps2p+f1size);

        f.addCode(
            c.if(
                c.call(g1mPrefix + "_isZeroAffine", c.getLocal("p")),
                c.ret( c.i32_const(1)),
            ),
            c.if(
                c.i32_eqz(c.call(g1mPrefix + "_inCurveAffine", c.getLocal("p"))),
                c.ret( c.i32_const(0)),
            ),

            c.call(f1mPrefix + "_mul", px, beta, spx),
            c.call(f1mPrefix + "_copy", py, spy),

            c.call(f1mPrefix + "_mul", px, beta2, s2px),
            c.call(f1mPrefix + "_copy", py, s2py),


            c.call(g1mPrefix + "_doubleAffine", sp, sp),
            c.call(g1mPrefix + "_subMixed", sp, c.getLocal("p"), sp),
            c.call(g1mPrefix + "_subMixed", sp, s2p, sp),

            c.call(g1mPrefix + "_timesScalar", sp, z2m1d3, c.i32_const(16), sp),

            c.ret(
                c.call(g1mPrefix + "_eqMixed", sp, s2p)
            )

        );

        const fInGroup = module.addFunction(g1mPrefix + "_inGroup");
        fInGroup.addParam("pIn", "i32");
        fInGroup.setReturnType("i32");

        const c2 = fInGroup.getCodeBuilder();

        const aux2 = c2.i32_const(module.alloc(f1size*2));

        fInGroup.addCode(
            c2.call(g1mPrefix + "_toAffine", c2.getLocal("pIn"), aux2),

            c2.ret(
                c2.call(g1mPrefix + "_inGroupAffine", aux2),
            )
        );
    }

    for (let i=0; i<10; i++) {
        buildFrobeniusMap(i);
        module.exportFunction(ftmPrefix + "_frobeniusMap"+i);
    }


    buildInGroupG1();
    buildInGroupG2();

    buildPrepAddStep();
    buildPrepDoubleStep();

    buildPrepareG1();
    buildPrepareG2();

    buildMillerLoop();

    buildFinalExponentiationOld();
    buildFinalExponentiation();

    for (let i=1; i<=5; i++) {
        buildPairingEquation(i);
        module.exportFunction(prefix + "_pairingEq"+i);
    }

    buildPairing();

    module.exportFunction(prefix + "_pairing");


    module.exportFunction(prefix + "_prepareG1");
    module.exportFunction(prefix + "_prepareG2");
    module.exportFunction(prefix + "_millerLoop");
    module.exportFunction(prefix + "_finalExponentiation");
    module.exportFunction(prefix + "_finalExponentiationOld");
    module.exportFunction(prefix + "__cyclotomicSquare");
    module.exportFunction(prefix + "__cyclotomicExp_w0");

    module.exportFunction(f6mPrefix + "_mul1");
    module.exportFunction(f6mPrefix + "_mul01");
    module.exportFunction(ftmPrefix + "_mul014");

    module.exportFunction(g1mPrefix + "_inGroupAffine");
    module.exportFunction(g1mPrefix + "_inGroup");
    module.exportFunction(g2mPrefix + "_inGroupAffine");
    module.exportFunction(g2mPrefix + "_inGroup");

    // console.log(module.functionIdxByName);
};

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
// module.exports.bls12381_wasm = require("./build/bls12381_wasm.js");
// module.exports.mnt6753_wasm = require("./build/mnt6753_wasm.js");

var buildBn128 = build_bn128;
var buildBls12381 = build_bls12381;

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    buildBls12381: buildBls12381,
    buildBn128: buildBn128
});

export { BigBuffer, ChaCha, EC, ZqField as F1Field, F2Field, F3Field, PolField, Scalar, ZqField, buildBls12381$1 as buildBls12381, buildBn128$1 as buildBn128, getCurveFromName, getCurveFromQ, getCurveFromR, utils$6 as utils };
