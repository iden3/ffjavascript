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
// 'code' is base64 of the wasm-opt -Oz optimized wasm; the rest are
// pointer offsets / field moduli.
const code$2 = "AGFzbQEAAAABpwESYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgCH9/f39/f39/AGADf39/AX9gBH9/f38Bf2AKf39/f39/f39/fwBgBX9/f39/AX9gB39/f39/f38Bf2AJf39/f39/f39/AX9gC39/f39/f39/f39/AX9gDH9/f39+f39/f39/fwBgC39/f35/f39/f39/AAIPAQNlbnYGbWVtb3J5AgAZA6ECnwIABQIFBgYJCQEAAAMBAgEBAAABAAAAAAICAAUBAwQBAQMAAgIBAQAAAQAAAAACAgAFAQMEAQEDAAIBAAACAgIFBQAAAAYGBgAAAQEBAAABAQEAAAAAAAICAQABAAAAAAEBAQEBCgcIBAgEAwMAAwIAAAQHBwEBBwADCwQDAgUAAQEAAQEAAAMCAgQDAAICAgUFAAAABgYGAAABAQEAAAEBAQAAAAAAAgIBAAAAAAABAQEBAQgECAQDAwEAAwAABAcHAQEHAQADAAAEBwcBAQcBAQQEBAQEAAICBQUAAQABAQACBgADAgQDAAICBQUAAQEAAQEAAAAABgADAgIEAwACAAAAAAMDAQAAAAAAAAAAAAAAAAAACQwNDg8BEBEICAexJasCCGludF9jb3B5AAAIaW50X3plcm8AAQdpbnRfb25lAAMKaW50X2lzWmVybwACBmludF9lcQAEB2ludF9ndGUABQdpbnRfYWRkAAYHaW50X3N1YgAHB2ludF9tdWwACAppbnRfc3F1YXJlAAkNaW50X3NxdWFyZU9sZAAKB2ludF9kaXYACw5pbnRfaW52ZXJzZU1vZAAMCGYxbV9jb3B5AAAIZjFtX3plcm8AAQpmMW1faXNaZXJvAAIGZjFtX2VxAAQHZjFtX2FkZAAOB2YxbV9zdWIADwdmMW1fbmVnABAOZjFtX2lzTmVnYXRpdmUAFwlmMW1faXNPbmUADQhmMW1fc2lnbgAYC2YxbV9tUmVkdWN0ABEHZjFtX211bAASCmYxbV9zcXVhcmUAEw1mMW1fc3F1YXJlT2xkABQSZjFtX2Zyb21Nb250Z29tZXJ5ABYQZjFtX3RvTW9udGdvbWVyeQAVC2YxbV9pbnZlcnNlABkHZjFtX29uZQAaCGYxbV9sb2FkABsPZjFtX3RpbWVzU2NhbGFyABwHZjFtX2V4cAAgEGYxbV9iYXRjaEludmVyc2UAHQhmMW1fc3FydAAhDGYxbV9pc1NxdWFyZQAiFWYxbV9iYXRjaFRvTW9udGdvbWVyeQAeF2YxbV9iYXRjaEZyb21Nb250Z29tZXJ5AB8IZnJtX2NvcHkAAAhmcm1femVybwABCmZybV9pc1plcm8AAgZmcm1fZXEABAdmcm1fYWRkACQHZnJtX3N1YgAlB2ZybV9uZWcAJg5mcm1faXNOZWdhdGl2ZQAtCWZybV9pc09uZQAjCGZybV9zaWduAC4LZnJtX21SZWR1Y3QAJwdmcm1fbXVsACgKZnJtX3NxdWFyZQApDWZybV9zcXVhcmVPbGQAKhJmcm1fZnJvbU1vbnRnb21lcnkALBBmcm1fdG9Nb250Z29tZXJ5ACsLZnJtX2ludmVyc2UALwdmcm1fb25lADAIZnJtX2xvYWQAMQ9mcm1fdGltZXNTY2FsYXIAMgdmcm1fZXhwADYQZnJtX2JhdGNoSW52ZXJzZQAzCGZybV9zcXJ0ADcMZnJtX2lzU3F1YXJlADgVZnJtX2JhdGNoVG9Nb250Z29tZXJ5ADQXZnJtX2JhdGNoRnJvbU1vbnRnb21lcnkANQZmcl9hZGQAJAZmcl9zdWIAJQZmcl9uZWcAJgZmcl9tdWwAOQlmcl9zcXVhcmUAOgpmcl9pbnZlcnNlADsNZnJfaXNOZWdhdGl2ZQA8B2ZyX2NvcHkAAAdmcl96ZXJvAAEGZnJfb25lADAJZnJfaXNaZXJvAAIFZnJfZXEABAxnMW1fbXVsdGlleHAAZxJnMW1fbXVsdGlleHBfY2h1bmsAZhJnMW1fbXVsdGlleHBBZmZpbmUAaRhnMW1fbXVsdGlleHBBZmZpbmVfY2h1bmsAaApnMW1faXNaZXJvAD4QZzFtX2lzWmVyb0FmZmluZQA9BmcxbV9lcQBGC2cxbV9lcU1peGVkAEUMZzFtX2VxQWZmaW5lAEQIZzFtX2NvcHkAQg5nMW1fY29weUFmZmluZQBBCGcxbV96ZXJvAEAOZzFtX3plcm9BZmZpbmUAPwpnMW1fZG91YmxlAEgQZzFtX2RvdWJsZUFmZmluZQBHB2cxbV9hZGQASwxnMW1fYWRkTWl4ZWQASg1nMW1fYWRkQWZmaW5lAEkHZzFtX25lZwBNDWcxbV9uZWdBZmZpbmUATAdnMW1fc3ViAFAMZzFtX3N1Yk1peGVkAE8NZzFtX3N1YkFmZmluZQBOEmcxbV9mcm9tTW9udGdvbWVyeQBSGGcxbV9mcm9tTW9udGdvbWVyeUFmZmluZQBREGcxbV90b01vbnRnb21lcnkAVBZnMW1fdG9Nb250Z29tZXJ5QWZmaW5lAFMPZzFtX3RpbWVzU2NhbGFyAGoVZzFtX3RpbWVzU2NhbGFyQWZmaW5lAGsNZzFtX25vcm1hbGl6ZQBZCmcxbV9MRU10b1UAWwpnMW1fTEVNdG9DAFwKZzFtX1V0b0xFTQBdCmcxbV9DdG9MRU0AXg9nMW1fYmF0Y2hMRU10b1UAXw9nMW1fYmF0Y2hMRU10b0MAYA9nMW1fYmF0Y2hVdG9MRU0AYQ9nMW1fYmF0Y2hDdG9MRU0AYgxnMW1fdG9BZmZpbmUAVQ5nMW1fdG9KYWNvYmlhbgBDEWcxbV9iYXRjaFRvQWZmaW5lAFgTZzFtX2JhdGNoVG9KYWNvYmlhbgBjC2cxbV9pbkN1cnZlAFcRZzFtX2luQ3VydmVBZmZpbmUAVhdmcm1fX3JldmVyc2VQZXJtdXRhdGlvbgBsB2ZybV9mZnQAbwhmcm1faWZmdABwCmZybV9yYXdmZnQAbQtmcm1fZmZ0Sm9pbgBxDmZybV9mZnRKb2luRXh0AHIRZnJtX2ZmdEpvaW5FeHRJbnYAcwpmcm1fZmZ0TWl4AHQMZnJtX2ZmdEZpbmFsAHUdZnJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24Adghwb2xfemVybwB3D3BvbF9jb25zdHJ1Y3RMQwB4DHFhcF9idWlsZEFCQwB5C3FhcF9qb2luQUJDAHoMcWFwX2JhdGNoQWRkAHsKZjJtX2lzWmVybwA9CWYybV9pc09uZQB8CGYybV96ZXJvAD8HZjJtX29uZQB9CGYybV9jb3B5AH4HZjJtX211bAB/CGYybV9tdWwxAIABCmYybV9zcXVhcmUAgQEHZjJtX2FkZACCAQdmMm1fc3ViAIMBB2YybV9uZWcAhAEIZjJtX3NpZ24AhwENZjJtX2Nvbmp1Z2F0ZQBMEmYybV9mcm9tTW9udGdvbWVyeQBREGYybV90b01vbnRnb21lcnkAUwZmMm1fZXEARAtmMm1faW52ZXJzZQCFAQdmMm1fZXhwAIoBD2YybV90aW1lc1NjYWxhcgCGARBmMm1fYmF0Y2hJbnZlcnNlAIkBCGYybV9zcXJ0AIsBDGYybV9pc1NxdWFyZQCMAQ5mMm1faXNOZWdhdGl2ZQCIAQxnMm1fbXVsdGlleHAAtAESZzJtX211bHRpZXhwX2NodW5rALMBEmcybV9tdWx0aWV4cEFmZmluZQC2ARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsAtQEKZzJtX2lzWmVybwCOARBnMm1faXNaZXJvQWZmaW5lAI0BBmcybV9lcQCWAQtnMm1fZXFNaXhlZACVAQxnMm1fZXFBZmZpbmUAlAEIZzJtX2NvcHkAkgEOZzJtX2NvcHlBZmZpbmUAkQEIZzJtX3plcm8AkAEOZzJtX3plcm9BZmZpbmUAjwEKZzJtX2RvdWJsZQCYARBnMm1fZG91YmxlQWZmaW5lAJcBB2cybV9hZGQAmwEMZzJtX2FkZE1peGVkAJoBDWcybV9hZGRBZmZpbmUAmQEHZzJtX25lZwCdAQ1nMm1fbmVnQWZmaW5lAJwBB2cybV9zdWIAoAEMZzJtX3N1Yk1peGVkAJ8BDWcybV9zdWJBZmZpbmUAngESZzJtX2Zyb21Nb250Z29tZXJ5AKIBGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQChARBnMm1fdG9Nb250Z29tZXJ5AKQBFmcybV90b01vbnRnb21lcnlBZmZpbmUAowEPZzJtX3RpbWVzU2NhbGFyALcBFWcybV90aW1lc1NjYWxhckFmZmluZQC4AQ1nMm1fbm9ybWFsaXplAKkBCmcybV9MRU10b1UAqgEKZzJtX0xFTXRvQwCrAQpnMm1fVXRvTEVNAKwBCmcybV9DdG9MRU0ArQEPZzJtX2JhdGNoTEVNdG9VAK4BD2cybV9iYXRjaExFTXRvQwCvAQ9nMm1fYmF0Y2hVdG9MRU0AsAEPZzJtX2JhdGNoQ3RvTEVNALEBDGcybV90b0FmZmluZQClAQ5nMm1fdG9KYWNvYmlhbgCTARFnMm1fYmF0Y2hUb0FmZmluZQCoARNnMm1fYmF0Y2hUb0phY29iaWFuALIBC2cybV9pbkN1cnZlAKcBEWcybV9pbkN1cnZlQWZmaW5lAKYBC2cxbV90aW1lc0ZyALkBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uALoBB2cxbV9mZnQAvAEIZzFtX2lmZnQAvQEKZzFtX3Jhd2ZmdAC7AQtnMW1fZmZ0Sm9pbgC+AQ5nMW1fZmZ0Sm9pbkV4dAC/ARFnMW1fZmZ0Sm9pbkV4dEludgDAAQpnMW1fZmZ0TWl4AMEBDGcxbV9mZnRGaW5hbADCAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDDAQtnMm1fdGltZXNGcgDEARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDFAQdnMm1fZmZ0AMcBCGcybV9pZmZ0AMgBCmcybV9yYXdmZnQAxgELZzJtX2ZmdEpvaW4AyQEOZzJtX2ZmdEpvaW5FeHQAygERZzJtX2ZmdEpvaW5FeHRJbnYAywEKZzJtX2ZmdE1peADMAQxnMm1fZmZ0RmluYWwAzQEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24AzgERZzFtX3RpbWVzRnJBZmZpbmUAzwERZzJtX3RpbWVzRnJBZmZpbmUA0AERZnJtX2JhdGNoQXBwbHlLZXkA0QERZzFtX2JhdGNoQXBwbHlLZXkA0gEWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZADTARFnMm1fYmF0Y2hBcHBseUtleQDUARZnMm1fYmF0Y2hBcHBseUtleU1peGVkANUBCmY2bV9pc1plcm8A1wEJZjZtX2lzT25lANgBCGY2bV96ZXJvANkBB2Y2bV9vbmUA2gEIZjZtX2NvcHkA2wEHZjZtX211bADcAQpmNm1fc3F1YXJlAN0BB2Y2bV9hZGQA3gEHZjZtX3N1YgDfAQdmNm1fbmVnAOABCGY2bV9zaWduAOEBEmY2bV9mcm9tTW9udGdvbWVyeQCiARBmNm1fdG9Nb250Z29tZXJ5AKQBBmY2bV9lcQDiAQtmNm1faW52ZXJzZQDjAQdmNm1fZXhwAOcBD2Y2bV90aW1lc1NjYWxhcgDkARBmNm1fYmF0Y2hJbnZlcnNlAOYBDmY2bV9pc05lZ2F0aXZlAOUBCmZ0bV9pc1plcm8A6QEJZnRtX2lzT25lAOoBCGZ0bV96ZXJvAOsBB2Z0bV9vbmUA7AEIZnRtX2NvcHkA7QEHZnRtX211bADuAQhmdG1fbXVsMQDvAQpmdG1fc3F1YXJlAPABB2Z0bV9hZGQA8QEHZnRtX3N1YgDyAQdmdG1fbmVnAPMBCGZ0bV9zaWduAPoBDWZ0bV9jb25qdWdhdGUA9AESZnRtX2Zyb21Nb250Z29tZXJ5APYBEGZ0bV90b01vbnRnb21lcnkA9QEGZnRtX2VxAPcBC2Z0bV9pbnZlcnNlAPgBB2Z0bV9leHAA/QEPZnRtX3RpbWVzU2NhbGFyAPkBEGZ0bV9iYXRjaEludmVyc2UA/AEIZnRtX3NxcnQA/gEMZnRtX2lzU3F1YXJlAP8BDmZ0bV9pc05lZ2F0aXZlAPsBFGJuMTI4X19mcm9iZW5pdXNNYXAwAIcCFGJuMTI4X19mcm9iZW5pdXNNYXAxAIgCFGJuMTI4X19mcm9iZW5pdXNNYXAyAIkCFGJuMTI4X19mcm9iZW5pdXNNYXAzAIoCFGJuMTI4X19mcm9iZW5pdXNNYXA0AIsCFGJuMTI4X19mcm9iZW5pdXNNYXA1AIwCFGJuMTI4X19mcm9iZW5pdXNNYXA2AI0CFGJuMTI4X19mcm9iZW5pdXNNYXA3AI4CFGJuMTI4X19mcm9iZW5pdXNNYXA4AI8CFGJuMTI4X19mcm9iZW5pdXNNYXA5AJACEGJuMTI4X3BhaXJpbmdFcTEAlQIQYm4xMjhfcGFpcmluZ0VxMgCWAhBibjEyOF9wYWlyaW5nRXEzAJcCEGJuMTI4X3BhaXJpbmdFcTQAmAIQYm4xMjhfcGFpcmluZ0VxNQCZAg1ibjEyOF9wYWlyaW5nAJoCD2JuMTI4X3ByZXBhcmVHMQCBAg9ibjEyOF9wcmVwYXJlRzIAgwIQYm4xMjhfbWlsbGVyTG9vcACGAhlibjEyOF9maW5hbEV4cG9uZW50aWF0aW9uAJQCHGJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAkQIPYm4xMjhfX211bEJ5MDI0AIQCEmJuMTI4X19tdWxCeTAyNE9sZACFAhdibjEyOF9fY3ljbG90b21pY1NxdWFyZQCSAhdibjEyOF9fY3ljbG90b21pY0V4cF93MACTAgro1gKfAioAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGAseACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxgLLAAgACkDGFAEfiAAKQMQUAR+IAApAwhQBH4gACkDAAVCAQsFQgELBUIBC1ALHgAgAEIBNwMAIABCADcDCCAAQgA3AxAgAEIANwMYC0AAIAApAxggASkDGFEEfyAAKQMQIAEpAxBRBH8gACkDCCABKQMIUQR/IAApAwAgASkDAFEFQQALBUEACwVBAAsLcwAgACkDGCABKQMYVAR/QQAFIAApAxggASkDGFYEf0EBBSAAKQMQIAEpAxBUBH9BAAUgACkDECABKQMQVgR/QQEFIAApAwggASkDCFQEf0EABSAAKQMIIAEpAwhWBH9BAQUgACkDACABKQMAWgsLCwsLCwvEAQEBfiACIAA1AgAgATUCAHwiAz4CACACIAA1AgQgATUCBHwgA0IgiHwiAz4CBCACIAA1AgggATUCCHwgA0IgiHwiAz4CCCACIAA1AgwgATUCDHwgA0IgiHwiAz4CDCACIAA1AhAgATUCEHwgA0IgiHwiAz4CECACIAA1AhQgATUCFHwgA0IgiHwiAz4CFCACIAA1AhggATUCGHwgA0IgiHwiAz4CGCACIAA1AhwgATUCHHwgA0IgiHwiAz4CHCADQiCIpwv8AQEBfiACIAA1AgAgATUCAH0iA0L/////D4M+AgAgAiAANQIEIAE1AgR9IANCIId8IgNC/////w+DPgIEIAIgADUCCCABNQIIfSADQiCHfCIDQv////8Pgz4CCCACIAA1AgwgATUCDH0gA0Igh3wiA0L/////D4M+AgwgAiAANQIQIAE1AhB9IANCIId8IgNC/////w+DPgIQIAIgADUCFCABNQIUfSADQiCHfCIDQv////8Pgz4CFCACIAA1AhggATUCGH0gA0Igh3wiA0L/////D4M+AhggAiAANQIcIAE1Ahx9IANCIId8IgNC/////w+DPgIcIANCIIenC90MARd+IAA1AgAiAyABNQIAIgd+IgRCIIghBiACIAQ+AgAgADUCBCIEIAd+IAMgATUCBCIFfiAGQv////8Pg3wiCEL/////D4N8Ig9CIIggCEIgiCAGQiCIfHwhCyACIA8+AgQgADUCCCIGIAd+IAQgBX4gAyABNQIIIgh+IAtC/////w+DfCIPQv////8Pg3wiDEL/////D4N8IhBCIIggD0IgiCALQiCIfCAMQiCIfHwhDCACIBA+AgggADUCDCILIAd+IAUgBn4gBCAIfiADIAE1AgwiD34gDEL/////D4N8IhBC/////w+DfCINQv////8Pg3wiEUL/////D4N8IglCIIggEEIgiCAMQiCIfCANQiCIfCARQiCIfHwhDSACIAk+AgwgADUCECIMIAd+IAUgC34gBiAIfiAEIA9+IAMgATUCECIQfiANQv////8Pg3wiEUL/////D4N8IglC/////w+DfCISQv////8Pg3wiCkL/////D4N8Ig5CIIggEUIgiCANQiCIfCAJQiCIfCASQiCIfCAKQiCIfHwhCSACIA4+AhAgADUCFCINIAd+IAUgDH4gCCALfiAGIA9+IAQgEH4gAyABNQIUIhF+IAlC/////w+DfCISQv////8Pg3wiCkL/////D4N8Ig5C/////w+DfCITQv////8Pg3wiFEL/////D4N8IhVCIIggEkIgiCAJQiCIfCAKQiCIfCAOQiCIfCATQiCIfCAUQiCIfHwhCiACIBU+AhQgADUCGCIJIAd+IAUgDX4gCCAMfiALIA9+IAYgEH4gBCARfiADIAE1AhgiEn4gCkL/////D4N8Ig5C/////w+DfCITQv////8Pg3wiFEL/////D4N8IhVC/////w+DfCIWQv////8Pg3wiF0L/////D4N8IhhCIIggDkIgiCAKQiCIfCATQiCIfCAUQiCIfCAVQiCIfCAWQiCIfCAXQiCIfHwhDiACIBg+AhggByAANQIcIgd+IAUgCX4gCCANfiAMIA9+IAsgEH4gBiARfiAEIBJ+IAMgATUCHCIKfiAOQv////8Pg3wiA0L/////D4N8IhNC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhZC/////w+DfCIXQv////8Pg3wiGEL/////D4N8IhlCIIggA0IgiCAOQiCIfCATQiCIfCAUQiCIfCAVQiCIfCAWQiCIfCAXQiCIfCAYQiCIfHwhAyACIBk+AhwgBSAHfiAIIAl+IA0gD34gDCAQfiALIBF+IAYgEn4gBCAKfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIOQv////8Pg3wiE0L/////D4N8IhRC/////w+DfCIVQv////8Pg3wiFkIgiCAEQiCIIANCIIh8IAVCIIh8IA5CIIh8IBNCIIh8IBRCIIh8IBVCIIh8fCEDIAIgFj4CICAHIAh+IAkgD34gDSAQfiAMIBF+IAsgEn4gBiAKfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiCEL/////D4N8Ig5C/////w+DfCITQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgCEIgiHwgDkIgiHx8IQMgAiATPgIkIAcgD34gCSAQfiANIBF+IAwgEn4gCiALfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiCEL/////D4N8IgtCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAIQiCIfHwhAyACIAs+AiggByAQfiAJIBF+IA0gEn4gCiAMfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQv////8Pg3wiCEIgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8fCEDIAIgCD4CLCAHIBF+IAkgEn4gCiANfiADQv////8Pg3wiBEL/////D4N8IgVC/////w+DfCIGQiCIIARCIIggA0IgiHwgBUIgiHx8IQMgAiAGPgIwIAcgEn4gCSAKfiADQv////8Pg3wiBEL/////D4N8IgVCIIggBEIgiCADQiCIfHwhAyACIAU+AjQgByAKfiADQv////8Pg3wiB0IgiCADQiCIfCEDIAIgBz4COCACIAM+AjwLrAsBE34gASAANQIAIgQgBH4iAj4CACABIAA1AgQiAyAEfiIKQv////8Pg0IBhiIGQv////8PgyACQiCIIgdC/////w+DfCIIPgIEIAEgAyADfiAANQIIIgIgBH4iBUL/////D4NCAYYiCUL/////D4N8IgtC/////w+DIApCIIhCAYYgBkIgiHwgCEIgiHwgB0IgiHwiBkL/////D4N8Igc+AgggASACIAN+IAA1AgwiCiAEfiIIQv////8Pg3wiDEL/////D4NCAYYiDUL/////D4MgBUIgiEIBhiAJQiCIfCALQiCIfCAHQiCIfCAGQiCIfCIHQv////8Pg3wiBT4CDCABIAIgAn4gAyAKfiAANQIQIgYgBH4iCUL/////D4N8IgtC/////w+DQgGGIg5C/////w+DfCIPQv////8PgyAMQiCIIAhCIIh8QgGGIA1CIIh8IAVCIIh8IAdCIIh8IghC/////w+DfCIFPgIQIAEgAiAKfiADIAZ+IAA1AhQiByAEfiIMQv////8Pg3wiDUL/////D4N8IhBC/////w+DQgGGIhFC/////w+DIAtCIIggCUIgiHxCAYYgDkIgiHwgD0IgiHwgBUIgiHwgCEIgiHwiBUL/////D4N8Igk+AhQgASAKIAp+IAIgBn4gAyAHfiAANQIYIgggBH4iC0L/////D4N8Ig5C/////w+DfCIPQv////8Pg0IBhiISQv////8Pg3wiE0L/////D4MgDUIgiCAMQiCIfCAQQiCIfEIBhiARQiCIfCAJQiCIfCAFQiCIfCIFQv////8Pg3wiCT4CGCABIAYgCn4gAiAHfiADIAh+IAQgADUCHCIEfiIMQv////8Pg3wiDUL/////D4N8IhBC/////w+DfCIRQv////8Pg0IBhiIUQv////8PgyAOQiCIIAtCIIh8IA9CIIh8QgGGIBJCIIh8IBNCIIh8IAlCIIh8IAVCIIh8IgVC/////w+DfCIJPgIcIAEgBiAGfiAHIAp+IAIgCH4gAyAEfiIDQv////8Pg3wiC0L/////D4N8Ig5C/////w+DQgGGIg9C/////w+DfCISQv////8PgyANQiCIIAxCIIh8IBBCIIh8IBFCIIh8QgGGIBRCIIh8IAlCIIh8IAVCIIh8IgVC/////w+DfCIJPgIgIAEgBiAHfiAIIAp+IAIgBH4iAkL/////D4N8IgxC/////w+DfCINQv////8Pg0IBhiIQQv////8PgyALQiCIIANCIIh8IA5CIIh8QgGGIA9CIIh8IBJCIIh8IAlCIIh8IAVCIIh8IgNC/////w+DfCIFPgIkIAEgByAHfiAGIAh+IAQgCn4iCkL/////D4N8IglC/////w+DQgGGIgtC/////w+DfCIOQv////8PgyAMQiCIIAJCIIh8IA1CIIh8QgGGIBBCIIh8IAVCIIh8IANCIIh8IgNC/////w+DfCICPgIoIAEgByAIfiAEIAZ+IgZC/////w+DfCIFQv////8Pg0IBhiIMQv////8PgyAJQiCIIApCIIh8QgGGIAtCIIh8IA5CIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgIsIAEgCCAIfiAEIAd+IgpC/////w+DQgGGIgdC/////w+DfCIJQv////8PgyAFQiCIIAZCIIh8QgGGIAxCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgIwIAEgBCAI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AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfADNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH0AzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB+AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfwDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGABDUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBhAQ1AgAgA358IgM+AihBlAYgA0IgiD4CACAAIAA1AhAgADUCEEKJx5mkDn5C/////w+DIgNB6AM1AgB+fCICPgIQIAAgADUCFCACQiCIfEHsAzUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB8AM1AgAgA358IgI+AhggACAANQIcIAJCIIh8QfQDNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH4AzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB/AM1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QYAENQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGEBDUCACADfnwiAz4CLEGYBiADQiCIPgIAIAAgADUCFCAANQIUQonHmaQOfkL/////D4MiA0HoAzUCAH58IgI+AhQgACAANQIYIAJCIIh8QewDNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEHwAzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB9AM1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfgDNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH8AzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxBgAQ1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QYQENQIAIAN+fCIDPgIwQZwGIANCIIg+AgAgACAANQIYIAA1AhhCiceZpA5+Qv////8PgyIDQegDNQIAfnwiAj4CGCAAIAA1AhwgAkIgiHxB7AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfADNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH0AzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB+AM1AgAgA358IgI+AiggACAANQIsIAJCIIh8QfwDNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGABDUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBhAQ1AgAgA358IgM+AjRBoAYgA0IgiD4CACAAIAA1AhwgADUCHEKJx5mkDn5C/////w+DIgNB6AM1AgB+fCICPgIcIAAgADUCICACQiCIfEHsAzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB8AM1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfQDNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEH4AzUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB/AM1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QYAENQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEGEBDUCACADfnwiAz4COEGkBiADQiCIPgIAQYgGIABBIGogARAOCykAIAAgASACQegDQonHmaQOQYQEQYAEQfwDQfgDQfQDQfADQewDEJsCCycAIAAgAUHoA0KJx5mkDkGEBEGABEH8A0H4A0H0A0HwA0HsAxCcAgsKACAAIAAgARASCwsAIABBiAQgARASCxUAIABBiAoQAEGoChABQYgKIAEQEQsRACAAQcgKEBZByApBiAUQBQsjACAAEAIEQEEADwsgAEHoChAWQegKQYgFEAUEQEF/DwtBAQsXACAAIAEQFiABQegDIAEQDCABIAEQFQsJAEGoBCAAEAALvAEBAn8gAhABQSAhAwNAIAEgA08EQCADQSBGBEBBiAsQGgVBiAtBiARBiAsQEgsgAEGIC0GoCxASIAJBqAsgAhAOIABBIGohACADQSBqIQMMAQsLIAFBH3EiBEUEQA8LQagLEAFBACEBA0AgASAERkUEQCABIAAtAAA6AKgLIABBAWohACABQQFqIQEMAQsLIANBIEYEQEGICxAaBUGIC0GIBEGICxASC0GoC0GIC0GoCxASIAJBqAsgAhAOCxwAIAEgAkHICxAbQcgLQcgLEBUgAEHICyADEBIL4AEBAn9BAEEAKAIAIgUgAkEBakEFdGo2AgAgBRAaIAVBIGohBQNAIAIgBkcEQCAAEAIEQCAFQSBrIAUQAAUgACAFQSBrIAUQEgsgACABaiEAIAVBIGohBSAGQQFqIQYMAQsLIAAgAWshACADIAJBAWsgBGxqIQIgBUEgayIFIAUQGQNAIAYEQCAAEAIEQCAFIAVBIGsQACACEAEFIAVBIGsiA0HoCxAAIAUgACADEBIgBUHoCyACEBILIAAgAWshACACIARrIQIgBUEgayEFIAZBAWshBgwBCwtBACAFNgIACy0BAX8DQCABIANGRQRAIAAgAhAVIABBIGohACACQSBqIQIgA0EBaiEDDAELCwstAQF/A0AgASADRkUEQCAAIAIQFiAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLlwIAIAJFBEAgAxAaDwsgAEGIDBAAIAMQGgNAIAJBAWsiAiABai0AACEAIAMgAxATIABBgAFPBEAgA0GIDCADEBIgAEGAAWshAAsgAyADEBMgAEHAAE8EQCADQYgMIAMQEiAAQUBqIQALIAMgAxATIABBIE8EQCADQYgMIAMQEiAAQSBrIQALIAMgAxATIABBEE8EQCADQYgMIAMQEiAAQRBrIQALIAMgAxATIABBCE8EQCADQYgMIAMQEiAAQQhrIQALIAMgAxATIABBBE8EQCADQYgMIAMQEiAAQQRrIQALIAMgAxATIABBAk8EQCADQYgMIAMQEiAAQQJrIQALIAMgAxATIAAEQCADQYgMIAMQEgsgAg0ACwvVAQEBfyAAEAIEQCABEAEPC0EBIQJByAVBqAwQACAAQagFQSBByAwQICAAQegFQSBB6AwQIANAQcgMQagEEARFBEBByAxBiA0QE0EBIQADQEGIDUGoBBAERQRAQYgNQYgNEBMgAEEBaiEADAELC0GoDEGoDRAAIAIgAGtBAWshAgNAIAIEQEGoDUGoDRATIAJBAWshAgwBCwsgACECQagNQagMEBNByAxBqAxByAwQEkHoDEGoDUHoDBASDAELC0HoDBAXBEBB6AwgARAQBUHoDCABEAALCyAAIAAQAgRAQQEPCyAAQegEQSBByA0QIEHIDUGoBBAECwkAIABBqA4QBAssACAAIAEgAhAGBEAgAkHoDSACEAcaBSACQegNEAUEQCACQegNIAIQBxoLCwsXACAAIAEgAhAHBEAgAkHoDSACEAYaCwsLAEHIDiAAIAEQJQvQDwECfiAAIAA1AgAgADUCAEL/////Dn5C/////w+DIgNB6A01AgB+fCICPgIAIAAgADUCBCACQiCIfEHsDTUCACADfnwiAj4CBCAAIAA1AgggAkIgiHxB8A01AgAgA358IgI+AgggACAANQIMIAJCIIh8QfQNNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEH4DTUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB/A01AgAgA358IgI+AhQgACAANQIYIAJCIIh8QYAONQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGEDjUCACADfnwiAz4CHEGIECADQiCIPgIAIAAgADUCBCAANQIEQv////8OfkL/////D4MiA0HoDTUCAH58IgI+AgQgACAANQIIIAJCIIh8QewNNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEHwDTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB9A01AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfgNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH8DTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBgA41AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYQONQIAIAN+fCIDPgIgQYwQIANCIIg+AgAgACAANQIIIAA1AghC/////w5+Qv////8PgyIDQegNNQIAfnwiAj4CCCAAIAA1AgwgAkIgiHxB7A01AgAgA358IgI+AgwgACAANQIQIAJCIIh8QfANNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEH0DTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB+A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfwNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGADjUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBhA41AgAgA358IgM+AiRBkBAgA0IgiD4CACAAIAA1AgwgADUCDEL/////Dn5C/////w+DIgNB6A01AgB+fCICPgIMIAAgADUCECACQiCIfEHsDTUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB8A01AgAgA358IgI+AhQgACAANQIYIAJCIIh8QfQNNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEH4DTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB/A01AgAgA358IgI+AiAgACAANQIkIAJCIIh8QYAONQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGEDjUCACADfnwiAz4CKEGUECADQiCIPgIAIAAgADUCECAANQIQQv////8OfkL/////D4MiA0HoDTUCAH58IgI+AhAgACAANQIUIAJCIIh8QewNNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHwDTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB9A01AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfgNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH8DTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBgA41AgAgA358IgI+AiggACAANQIsIAJCIIh8QYQONQIAIAN+fCIDPgIsQZgQIANCIIg+AgAgACAANQIUIAA1AhRC/////w5+Qv////8PgyIDQegNNQIAfnwiAj4CFCAAIAA1AhggAkIgiHxB7A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfANNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH0DTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB+A01AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfwNNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGADjUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBhA41AgAgA358IgM+AjBBnBAgA0IgiD4CACAAIAA1AhggADUCGEL/////Dn5C/////w+DIgNB6A01AgB+fCICPgIYIAAgADUCHCACQiCIfEHsDTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB8A01AgAgA358IgI+AiAgACAANQIkIAJCIIh8QfQNNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEH4DTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB/A01AgAgA358IgI+AiwgACAANQIwIAJCIIh8QYAONQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEGEDjUCACADfnwiAz4CNEGgECADQiCIPgIAIAAgADUCHCAANQIcQv////8OfkL/////D4MiA0HoDTUCAH58IgI+AhwgACAANQIgIAJCIIh8QewNNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHwDTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB9A01AgAgA358IgI+AiggACAANQIsIAJCIIh8QfgNNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEH8DTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBgA41AgAgA358IgI+AjQgACAANQI4IAJCIIh8QYQONQIAIAN+fCIDPgI4QaQQIANCIIg+AgBBiBAgAEEgaiABECQLKQAgACABIAJB6A1C/////w5BhA5BgA5B/A1B+A1B9A1B8A1B7A0QmwILJwAgACABQegNQv////8OQYQOQYAOQfwNQfgNQfQNQfANQewNEJwCCwoAIAAgACABECgLCwAgAEGIDiABECgLFQAgAEGIFBAAQagUEAFBiBQgARAnCxEAIABByBQQLEHIFEGIDxAFCyMAIAAQAgRAQQAPCyAAQegUECxB6BRBiA8QBQRAQX8PC0EBCxcAIAAgARAsIAFB6A0gARAMIAEgARArCwkAQagOIAAQAAu8AQECfyACEAFBICEDA0AgASADTwRAIANBIEYEQEGIFRAwBUGIFUGIDkGIFRAoCyAAQYgVQagVECggAkGoFSACECQgAEEgaiEAIANBIGohAwwBCwsgAUEfcSIERQRADwtBqBUQAUEAIQEDQCABIARGRQRAIAEgAC0AADoAqBUgAEEBaiEAIAFBAWohAQwBCwsgA0EgRgRAQYgVEDAFQYgVQYgOQYgVECgLQagVQYgVQagVECggAkGoFSACECQLHAAgASACQcgVEDFByBVByBUQKyAAQcgVIAMQKAvgAQECf0EAQQAoAgAiBSACQQFqQQV0ajYCACAFEDAgBUEgaiEFA0AgAiAGRwRAIAAQAgRAIAVBIGsgBRAABSAAIAVBIGsgBRAoCyAAIAFqIQAgBUEgaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQSBrIgUgBRAvA0AgBgRAIAAQAgRAIAUgBUEgaxAAIAIQAQUgBUEgayIDQegVEAAgBSAAIAMQKCAFQegVIAIQKAsgACABayEAIAIgBGshAiAFQSBrIQUgBkEBayEGDAELC0EAIAU2AgALLQEBfwNAIAEgA0ZFBEAgACACECsgAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhAsIABBIGohACACQSBqIQIgA0EBaiEDDAELCwuXAgAgAkUEQCADEDAPCyAAQYgWEAAgAxAwA0AgAkEBayICIAFqLQAAIQAgAyADECkgAEGAAU8EQCADQYgWIAMQKCAAQYABayEACyADIAMQKSAAQcAATwRAIANBiBYgAxAoIABBQGohAAsgAyADECkgAEEgTwRAIANBiBYgAxAoIABBIGshAAsgAyADECkgAEEQTwRAIANBiBYgAxAoIABBEGshAAsgAyADECkgAEEITwRAIANBiBYgAxAoIABBCGshAAsgAyADECkgAEEETwRAIANBiBYgAxAoIABBBGshAAsgAyADECkgAEECTwRAIANBiBYgAxAoIABBAmshAAsgAyADECkgAARAIANBiBYgAxAoCyACDQALC9UBAQF/IAAQAgRAIAEQAQ8LQRwhAkHID0GoFhAAIABBqA9BIEHIFhA2IABB6A9BIEHoFhA2A0BByBZBqA4QBEUEQEHIFkGIFxApQQEhAANAQYgXQagOEARFBEBBiBdBiBcQKSAAQQFqIQAMAQsLQagWQagXEAAgAiAAa0EBayECA0AgAgRAQagXQagXECkgAkEBayECDAELCyAAIQJBqBdBqBYQKUHIFkGoFkHIFhAoQegWQagXQegWECgMAQsLQegWEC0EQEHoFiABECYFQegWIAEQAAsLIAAgABACBEBBAQ8LIABB6A5BIEHIFxA2QcgXQagOEAQLFQAgACABQegXEChB6BdBiA4gAhAoCwoAIAAgACABEDkLCwAgAEHoDSABEAwLCQAgAEGIDxAFCw4AIAAQAiAAQSBqEAJxCwkAIABBQGsQAgsNACAAEAEgAEEgahABCxQAIAAQASAAQSBqEBogAEFAaxABC1IAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzgLegAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1gLJwAgABA9BEAgARBABSABQUBrEBogAEEgaiABQSBqEAAgACABEAALCxUAIAAgARAEIABBIGogAUEgahAEcQtxAQF/IAAQPgRAIAEQPQ8LIAEQPQRAQQAPCyAAQUBrIgIQDQRAIAAgARBEDwsgAkGoGBATIAFBqBhByBgQEiACQagY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CxIAIAFByCoQTSAAQcgqIAIQSwsUACAAIAEQFiAAQSBqIAFBIGoQFgsgACAAIAEQFiAAQSBqIAFBIGoQFiAAQUBrIAFBQGsQFgsUACAAIAEQFSAAQSBqIAFBIGoQFQsgACAAIAEQFSAAQSBqIAFBIGoQFSAAQUBrIAFBQGsQFQtKACAAED4EQCABEAEgAUEgahABBSAAQUBrQagrEBlBqCtByCsQE0GoK0HIK0HoKxASIABByCsgARASIABBIGpB6CsgAUEgahASCwswACAAQSBqQYgsEBMgAEGoLBATIABBqCxBqCwQEkGoLEGIGEGoLBAOQYgsQagsEAQLDgAgAEHILBBVQcgsEFYLlAEBA39BAEEAKAIAIgQgAUEFdGo2AgAgAEFAa0HgACABIARBIBAdIAQhAwNAIAEgBUcEQCADEAIEQCACEAEgAkEgahABBSADIABBIGpBiC0QEiADIAMQEyADIAAgAhASIANBiC0gAkEgahASCyAAQeAAaiEAIAJBQGshAiADQSBqIQMgBUEBaiEFDAELC0EAIAQ2AgALSgAgABA+BEAgARBABSAAQUBrQagtEBlBqC1ByC0QE0GoLUHILUHoLRASIABByC0gARASIABBIGpB6C0gAUEgahASIAFBQGsQGgsLMgAgASACakEBayEBA0AgASACSEUEQCABIAAtAAA6AAAgAUEBayEBIABBAWohAAwBCwsLKgAgABA9BEAgARA/DwsgAEGILhBRQYguQSAgARBaQaguQSAgAUEgahBaC0EAIAAQPQRAIAEQASABQcAAOgAADwsgAEHILhAWQcguQSAgARBaIABBIGoQGEF/RgRAIAEgAS0AAEGAAXI6AAALCy8AIAAtAABBwABxBEAgARA/DwsgAEEgQeguEFogAEEgakEgQYgvEFpB6C4gARBTC64BAQJ/IAAtAAAiAkHAAHEEQCABED8PCyACQYABcSEDIABByC8QAEHILyACQT9xOgAAQcgvQSBBqC8QWkGoLyABEBUgAUHILxATIAFByC9ByC8QEkHIL0GIGEHILxAOQcgvQcgvECFByC9BqC8QEEHILxAYQX9GBEAgAwRAQcgvIAFBIGoQAAVByC8gAUEgahAQCwUgAwRAQcgvIAFBIGoQEAVByC8gAUEgahAACwsLLQEBfwNAIAEgA0ZFBEAgACACEFsgAEFAayEAIAJBQGshAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhBcIABBQGshACACQSBqIQIgA0EBaiEDDAELCwstAQF/A0AgASADRkUEQCAAIAIQXSAAQUBrIQAgAkFAayECIANBAWohAwwBCwsLSgEBfyAAIAFBAWsiA0EFdGohACACIANBBnRqIQJBACEDA0AgASADRkUEQCAAIAIQXiAAQSBrIQAgAkFAaiECIANBAWohAwwBCwsLTAEBfyAAIAFBAWsiA0EGdGohACACIANB4ABsaiECQQAhAwNAIAEgA0ZFBEAgACACEEMgAEFAaiEAIAJB4ABrIQIgA0EBaiEDDAELCws1ACABQQN0IAJrIgEgA0gEf0EBIAF0QQFrBUEBIAN0QQFrCyAAIAJBA3ZqKAAAIAJBB3F2cQuHAQEFf0EBIANBAWt0IQggAUEDdCEJIARBAWohCgNAIAIgB0ZFBEBBACEGQQAhBANAIAQgCkZFBEAgBSACIARsIAdqaiAGOgAAIAggBiADIARsIgYgCUgEfyAAIAEgBiADEGQFQQALakwhBiAEQQFqIQQMAQsLIAAgAWohACAHQQFqIQcMAQsLC8sCAQZ/IARFBEAgBxBADwtBASAGdCEMIAJBA3QhDSAFIAZsIQtBAEEAKAIAIglBASAGQQFrdCIKQeAAbGo2AgADQCAIIApGRQRAIAkgCEHgAGxqEEAgCEEBaiEIDAELCyADIAQgBWxqIQVBACEIA0AgBCAIRwRAIAsgDUgEfyABIAIgCyAGEGQFQQALIAUtAABqIgMgCk4EQCADIAxrIQMLIANBAEoEQCAJIANBAWtB4ABsaiIDIAAgAxBLBSADQQBIBEAgCUF/IANrQeAAbGoiAyAAIAMQUAsLIAEgAmohASAFQQFqIQUgAEHgAGohACAIQQFqIQgMAQsLIAkgCkEBa0HgAGxqIgAgBxBCIABB6C8QQiAAQeAAayEAA0AgACAJSUUEQEHoLyAAQegvEEsgB0HoLyAHEEsgAEHgAGshAAwBCwtBACAJNgIAC7cBAQR/IAQQQCADRQRADwsgA2ctAKgxIgVBAkkEQEECIQULQQBBACgCACIHIAJBA3RBAWsgBW5BAWoiBkEBaiADbGpBA2pBfHE2AgAgASACIAMgBSAGIAcQZQNAIAZBAE4EQCAEED5FBEBBACEIA0AgBSAIRkUEQCAEIAQQSCAIQQFqIQgMAQsLCyAAIAEgAiAHIAMgBiAFQcgwEGYgBEHIMCAEEEsgBkEBayEGDAELC0EAIAc2AgALygIBBn8gBEUEQCAHEEAPC0EBIAZ0IQwgAkEDdCENIAUgBmwhC0EAQQAoAgAiCUEBIAZBAWt0IgpB4ABsajYCAANAIAggCkZFBEAgCSAIQeAAbGoQQCAIQQFqIQgMAQsLIAMgBCAFbGohBUEAIQgDQCAEIAhHBEAgCyANSAR/IAEgAiALIAYQZAVBAAsgBS0AAGoiAyAKTgRAIAMgDGshAwsgA0EASgRAIAkgA0EBa0HgAGxqIgMgACADEEoFIANBAEgEQCAJQX8gA2tB4ABsaiIDIAAgAxBPCwsgASACaiEBIAVBAWohBSAAQUBrIQAgCEEBaiEIDAELCyAJIApBAWtB4ABsaiIAIAcQQiAAQcgxEEIgAEHgAGshAANAIAAgCUlFBEBByDEgAEHIMRBLIAdByDEgBxBLIABB4ABrIQAMAQsLQQAgCTYCAAu3AQEEfyAEEEAgA0UEQA8LIANnLQCIMyIFQQJJBEBBAiEFC0EAQQAoAgAiByACQQN0QQFrIAVuQQFqIgZBAWogA2xqQQNqQXxxNgIAIAEgAiADIAUgBiAHEGUDQCAGQQBOBEAgBBA+RQRAQQAhCANAIAUgCEZFBEAgBCAEEEggCEEBaiEIDAELCwsgACABIAIgByADIAYgBUGoMhBoIARBqDIgBBBLIAZBAWshBgwBCwtBACAHNgIAC9MDAQZ/IAJFBEAgAxBADwtBACgCACIHIQRBACACQQN0IgkgB0EgampBeHE2AgBBASEGIAEoAgBBAXEhBUEAIQIDQCAGIAlGRQRAIAEgBkEDdkF8cWooAgAgBnZBAXEhCCAFBH8gCAR/IAIEQEEAIQUgBEEBOgAABUEAIQUgBEH/AToAAAsgBEEBaiEEQQEFIAIEf0EAIQUgBEH/AToAACAEQQFqIQRBAQVBACEFIARBAToAACAEQQFqIQRBAAsLBSAIBH8gAgR/QQAhBSAEQQA6AAAgBEEBaiEEQQEFQQEhBSAEQQA6AAAgBEEBaiEEQQALBSACBEBBASEFBUEAIQULIARBADoAACAEQQFqIQRBAAsLIQIgBkEBaiEGDAELCyAFBH8gAgR/IARB/wE6AAAgBEEBaiIBQQA6AAAgAUEBaiIBQQE6AAAgAUEBagUgBEEBOgAAIARBAWoLBSACBH8gBEEAOgAAIARBAWoiAUEBOgAAIAFBAWoFIAQLC0EBayEEIABBqDMQQiADEEADQCADIAMQSCAELQAAIgAEQCAAQQFGBEAgA0GoMyADEEsFIANBqDMgAxBQCwsgBCAHRkUEQCAEQQFrIQQMAQsLQQAgBzYCAAvTAwEGfyACRQRAIAMQQA8LQQAoAgAiByEEQQAgAkEDdCIJIAdBIGpqQXhxNgIAQQEhBiABKAIAQQFxIQVBACECA0AgBiAJRkUEQCABIAZBA3ZBfHFqKAIAIAZ2QQFxIQggBQR/IAgEfyACBEBBACEFIARBAToAAAVBACEFIARB/wE6AAALIARBAWohBEEBBSACBH9BACEFIARB/wE6AAAgBEEBaiEEQQEFQQAhBSAEQQE6AAAgBEEBaiEEQQALCwUgCAR/IAIEf0EAIQUgBEEAOgAAIARBAWohBEEBBUEBIQUgBEEAOgAAIARBAWohBEEACwUgAgRAQQEhBQVBACEFCyAEQQA6AAAgBEEBaiEEQQALCyECIAZBAWohBgwBCwsgBQR/IAIEfyAEQf8BOgAAIARBAWoiAUEAOgAAIAFBAWoiAUEBOgAAIAFBAWoFIARBAToAACAEQQFqCwUgAgR/IARBADoAACAEQQFqIgFBAToAACABQQFqBSAECwtBAWshBCAAQYg0EEEgAxBAA0AgAyADEEggBC0AACIABEAgAEEBRgRAIANBiDQgAxBKBSADQYg0IAMQTwsLIAQgB0ZFBEAgBEEBayEEDAELC0EAIAc2AgALiQEBBH9BASABdCEEA0AgAiAERwRAIAJB/wFxLQDIUUEYdCACQQh2Qf8BcS0AyFFBEHRqIAJBGHYtAMhRIAJBEHZB/wFxLQDIUUEIdGpqIAF3IgMgAksEQCAAIAJBBXRqIgVByNMAEAAgACADQQV0aiIDIAUQAEHI0wAgAxAACyACQQFqIQIMAQsLC4ADAQl/IAAgARBsQQEgAXQhCkEBIQQDQCABIARPBEBBASAEdCEHIARBBXRByDRqIQtBACEFA0AgBSAKSQRAQYjUABAwIAdBAXYhCEEAIQYDQCAGIAhJBEAgACAFIAZqQQV0aiIJIAhBBXRqIgxBiNQAQajUABAoIAlByNQAEABByNQAQajUACAJECRByNQAQajUACAMECVBiNQAIAtBiNQAECggBkEBaiEGDAELCyAFIAdqIQUMAQsLIARBAWohBAwBCwsgAxAjIAJFcUUEQEEBIQVBASABdCIHQQF2IQYDQCAFIAZJBEAgACAFQQV0aiEBIAAgByAFa0EFdGohBCACBEAgAxAjBEAgAUHo0wAQACAEIAEQAEHo0wAgBBAABSABQejTABAAIAQgAyABEChB6NMAIAMgBBAoCwUgAxAjRQRAIAEgAyABECggBCADIAQQKAsLIAVBAWohBQwBCwsgAxAjRQRAIAAgAyAAECggACAGQQV0aiIAIAMgABAoCwsLOgECfyAAQQF2IQIDQCACBEAgAkEBdiECIAFBAWohAQwBCwsgAEEBIAF0RwRAAAsgAUEcSwRAAAsgAQsaACABEG4hAUHo1AAQMCAAIAFBAEHo1AAQbQsXACAAIAEQbiIAQQEgAEEFdEHoO2oQbQtsAQJ/IANBiNUAEABBACEDA0AgAiADRkUEQCABIANBBXQiBWoiBkGI1QBBqNUAECggACAFaiIFQcjVABAAQcjVAEGo1QAgBRAkQcjVAEGo1QAgBhAlQYjVACAEQYjVABAoIANBAWohAwwBCwsLeAECfyAFQQV0QYjDAGohByADQejVABAAQQAhBQNAIAIgBUZFBEAgACAFQQV0IgNqIgYgASADaiIDQYjWABAkIAMgByADECggBiADIAMQJCADQejVACADEChBiNYAIAYQAEHo1QAgBEHo1QAQKCAFQQFqIQUMAQsLC48BAQN/IAVBBXQiBUGIwwBqIQggBUGoygBqIQcgA0Go1gAQAEEAIQUDQCACIAVGRQRAIAEgBUEFdCIDaiIGQajWAEHI1gAQKCAAIANqIgNByNYAIAYQJSAGIAcgBhAoIAMgCCADEChByNYAIAMgAxAlIAMgByADEChBqNYAIARBqNYAECggBUEBaiEFDAELCwuqAQEHfyABIAJ2IQRBASACdCIFQQF2IgZBBXQhByACQQV0Qcg0aiEIQQAhAQNAIAEgBEZFBEBB6NYAEDBBACECA0AgAiAGRkUEQCAAIAEgBWwgAmpBBXRqIgMgB2oiCUHo1gBBiNcAECggA0Go1wAQAEGo1wBBiNcAIAMQJEGo1wBBiNcAIAkQJUHo1gAgCEHo1gAQKCACQQFqIQIMAQsLIAFBAWohAQwBCwsLbAEEfyABQQF2IQQgAUEBcQRAIAAgBEEFdGoiAyACIAMQKAtBACEDA0AgAyAET0UEQCAAIAFBAWsgA2tBBXRqIgUgAkHI1wAQKCAAIANBBXRqIgYgAiAFEChByNcAIAYQACADQQFqIQMMAQsLC4kBAQN/IAVBBXQiBUGIwwBqIQcgBUGoygBqIQggA0Ho1wAQAEEAIQMDQCACIANGRQRAIAAgA0EFdCIFaiIGIAdBiNgAECggASAFaiIFQYjYAEGI2AAQJSAGIAUgBRAlQYjYACAIIAYQKCAFQejXACAFEChB6NcAIARB6NcAECggA0EBaiEDDAELCwslACAAIAFBBXRqIQEDQCAAIAFGRQRAIAAQASAAQSBqIQAMAQsLC3QBBH8DQCACIARGRQRAIAAoAgAhByAAQQRqIQBBACEFA0AgBSAHRkUEQCADIAAoAgBBBXRqIQYgASAAQQRqIgBBqNgAEChBqNgAIAYgBhAkIABBIGohACAFQQFqIQUMAQsLIAFBIGohASAEQQFqIQQMAQsLC5kCAQR/IAQhCyADIgogB0EFdGohDQNAIAogDUZFBEAgChABIAsQASAKQSBqIQogC0EgaiELDAELCyAAIAFBLGxqIQsDQCAAIAtHBEAgACgCCCIBIAggCWpPIAEgCElyBEAgAEEsaiEADAILIAAoAgAiCgRAIApBAUYEQCAEIQwFIABBLGohAAsFIAMhDAsgACgCBCIKIAYgB2pPIAYgCktyRQRAIAIgASAIa0EFdGogAEEMakHI2AAQKCAMIAogBmtBBXRqIgxByNgAIAwQJAsgAEEsaiEADAELCyAEIQsgBSEAIAMiCiAHQQV0aiEBA0AgASAKRkUEQCAKIAsgABAoIApBIGohCiALQSBqIQsgAEEgaiEADAELCwtKACAAIANBBXRqIQMDQCAAIANGRQRAIAAgAUHo2AAQKEHo2AAgAiAEECUgAEEgaiEAIAFBIGohASACQSBqIQIgBEEgaiEEDAELCws3ACAAIAJBBXRqIQIDQCAAIAJGRQRAIAAgASADECQgAEEgaiEAIAFBIGohASADQSBqIQMMAQsLCw4AIAAQDSAAQSBqEAJxCw0AIAAQGiAAQSBqEAELFAAgACABEAAgAEEgaiABQSBqEAALcQECfyAAIAFBiNkAEBIgAEEgaiIDIAFBIGoiBEGo2QAQEiAAIANByNkAEA4gASAEQejZABAOQcjZAEHo2QBByNkAEBJBqNkAIAIQEEGI2QAgAiACEA5BiNkAQajZACACQSBqIgAQDkHI2QAgACAAEA8LGAAgACABIAIQEiAAQSBqIAEgAkEgahASC24BAX8gACAAQSBqIgJBiNoAEBIgACACQajaABAOIAJByNoAEBAgAEHI2gBByNoAEA5BiNoAQejaABAQQejaAEGI2gBB6NoAEA5BqNoAQcjaACABEBIgAUHo2gAgARAPQYjaAEGI2gAgAUEgahAOCxsAIAAgASACEA4gAEEgaiABQSBqIAJBIGoQDgsbACAAIAEgAhAPIABBIGogAUEgaiACQSBqEA8LFAAgACABEBAgAEEgaiABQSBqEBALWgEBfyAAQYjbABATIABBIGoiAkGo2wAQE0Go2wBByNsAEBBBiNsAQcjbAEHI2wAQD0HI2wBB6NsAEBkgAEHo2wAgARASIAJB6NsAIAFBIGoiABASIAAgABAQCxwAIAAgASACIAMQHCAAQSBqIAEgAiADQSBqEBwLFwEBfyAAQSBqEBgiAQRAIAEPCyAAEBgLGAAgAEEgahACBEAgABAXDwsgAEEgahAXC+MBAQJ/QQBBACgCACIFIAJBAWpBBnRqNgIAIAUQfSAFQUBrIQUDQCACIAZHBEAgABA9BEAgBUFAaiAFEH4FIAAgBUFAaiAFEH8LIAAgAWohACAFQUBrIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBQGoiBSAFEIUBA0AgBgRAIAAQPQRAIAUgBUFAahB+IAIQPwUgBUFAaiIDQYjcABB+IAUgACADEH8gBUGI3AAgAhB/CyAAIAFrIQAgAiAEayECIAVBQGohBSAGQQFrIQYMAQsLQQAgBTYCAAuoAgAgAkUEQCADEH0PCyAAQcjcABB+IAMQfQNAIAJBAWsiAiABai0AACEAIAMgAxCBASAAQYABTwRAIANByNwAIAMQfyAAQYABayEACyADIAMQgQEgAEHAAE8EQCADQcjcACADEH8gAEFAaiEACyADIAMQgQEgAEEgTwRAIANByNwAIAMQfyAAQSBrIQALIAMgAxCBASAAQRBPBEAgA0HI3AAgAxB/IABBEGshAAsgAyADEIEBIABBCE8EQCADQcjcACADEH8gAEEIayEACyADIAMQgQEgAEEETwRAIANByNwAIAMQfyAAQQRrIQALIAMgAxCBASAAQQJPBEAgA0HI3AAgAxB/IABBAmshAAsgAyADEIEBIAAEQCADQcjcACADEH8LIAINAAsLwwEAQYjfABB9QYjfAEGI3wAQhAEgAEGI3QBBIEHI3QAQigFByN0AQYjeABCBASAAQYjeAEGI3gAQf0GI3gBByN4AEExByN4AQYjeAEHI3gAQf0HI3gBBiN8AEEQEQAALQcjdACAAQcjfABB/QYjeAEGI3wAQRARAQYjfABABQajfABAaQYjfAEHI3wAgARB/BUGI4AAQfUGI4ABBiN4AQYjgABCCAUGI4ABBqN0AQSBBiOAAEIoBQYjgAEHI3wAgARB/CwtjAEGo4gAQfUGo4gBBqOIAEIQBIABByOAAQSBB6OAAEIoBQejgAEGo4QAQgQEgAEGo4QBBqOEAEH9BqOEAQejhABBMQejhAEGo4QBB6OEAEH9B6OEAQajiABBEBEBBAA8LQQELDgAgABA9IABBQGsQPXELCgAgAEGAAWoQPQsNACAAED8gAEFAaxA/CxUAIAAQPyAAQUBrEH0gAEGAAWoQPwuiAQAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4C4ICACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAELKgAgABCNAQRAIAEQkAEF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QGtB6IwBEH8gAyADEIEBIAMgACACEH8gA0HojAEgAkFAaxB/CyAAQcABaiEAIAJBgAFqIQIgA0FAayEDIAVBAWohBQwBCwtBACAENgIAC1gAIAAQjgEEQCABEJABBSAAQYABakGojQEQhQFBqI0BQeiNARCBAUGojQFB6I0BQaiOARB/IABB6I0BIAEQfyAAQUBrQaiOASABQUBrEH8gAUGAAWoQfQsLMgAgABCNAQRAIAEQjwEPCyAAQeiOARChAUHojgFBwAAgARBaQaiPAUHAACABQUBrEFoLRgAgABCNAQRAIAEQPyABQcAAOgAADwsgAEHojwEQUUHojwFBwAAgARBaIABBQGsQhwFBf0YEQCABIAEtAABBgAFyOgAACws2ACAALQAAQcAAcQRAIAEQjwEPCyAAQcAAQaiQARBaIABBQGtBwABB6JABEFpBqJABIAEQowELywEBAn8gAC0AACICQcAAcQRAIAEQjwEPCyACQYABcSEDIABB6JEBEH5B6JEBIAJBP3E6AABB6JEBQcAAQaiRARBaQaiRASABEFMgAUHokQEQgQEgAUHokQFB6JEBEH9B6JEBQejiAEHokQEQggFB6JEBQeiRARCLAUHokQFBqJEBEIQBQeiRARCHAUF/RgRAIAMEQEHokQEgAUFAaxB+BUHokQEgAUFAaxCEAQsFIAMEQEHokQEgAUFAaxCEAQVB6JEBIAFBQGsQfgsLCzABAX8DQCABIANGRQRAIAAgAhCqASAAQYABaiEAIAJBgAFqIQIgA0EBaiEDDAELCwsvAQF/A0AgASADRkUEQCAAIAIQqwEgAEGAAWohACACQUBrIQIgA0EBaiEDDAELCwswAQF/A0AgASADRkUEQCAAIAIQrAEgAEGAAWohACACQYABaiECIANBAWohAwwBCwsLTAEBfyAAIAFBAWsiA0EGdGohACACIANBB3RqIQJBACEDA0AgASADRkUEQCAAIAIQrQEgAEFAaiEAIAJBgAFrIQIgA0EBaiEDDAELCwtOAQF/IAAgAUEBayIDQQd0aiEAIAIgA0HAAWxqIQJBACEDA0AgASADRkUEQCAAIAIQkwEgAEGAAWshACACQcABayECIANBAWohAwwBCwsL1wIBBn8gBEUEQCAHEJABDwtBASAGdCEMIAJBA3QhDSAFIAZsIQtBAEEAKAIAIglB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CX8gACABEMUBQQEgAXQhCkEBIQQDQCABIARPBEBBASAEdCEHIARBBXRByMUBaiELQQAhBQNAIAUgCkkEQEHI5wEQMCAHQQF2IQhBACEGA0AgBiAISQRAIAAgBSAGakHAAWxqIgkgCEHAAWxqIgxByOcBQejnARDEASAJQajpARCSAUGo6QFB6OcBIAkQmwFBqOkBQejnASAMEKABQcjnASALQcjnARAoIAZBAWohBgwBCwsgBSAHaiEFDAELCyAEQQFqIQQMAQsLIAMQIyACRXFFBEBBASEFQQEgAXQiB0EBdiEGA0AgBSAGSQRAIAAgBUHAAWxqIQEgACAHIAVrQcABbGohBCACBEAgAxAjBEAgAUGI5gEQkgEgBCABEJIBQYjmASAEEJIBBSABQYjmARCSASAEIAMgARDEAUGI5gEgAyAEEMQBCwUgAxAjRQRAIAEgAyABEMQBIAQgAyAEEMQBCwsgBUEBaiEFDAELCyADECNFBEAgACADIAAQxAEgACAGQcABbGoiACADIAAQxAELCwsbACABEG4hAUHo6gEQMCAAIAFBAEHo6gEQxgELGQAgACABEG4iAEEBIABBBXRB6MwBahDGAQtxAQJ/IANBiOsBEABBACEDA0AgAiADRkUEQCABIANBwAFsIgVqIgZBiOsBQajrARDEASAAIAVqIgVB6OwBEJIBQejsAUGo6wEgBRCbAUHo7AFBqOsBIAYQoAFBiOsBIARBiOsBECggA0EBaiEDDAELCwt+AQJ/IAVBBXRBiNQBaiEHIANBqO4BEABBACEFA0AgAiAFRkUEQCAAIAVBwAFsIgNqIgYgASADaiIDQcjuARCbASADIAcgAxDEASAGIAMgAxCbASADQajuASADEMQBQcjuASAGEJIBQajuASAEQajuARAoIAVBAWohBQwBCwsLlgEBA38gBUEFdCIFQYjUAWohCCAFQajbAWohByADQYjwARAAQQAhBQNAIAIgBUZFBEAgASAFQcABbCIDaiIGQYjwAUGo8AEQxAEgACADaiIDQajwASAGEKABIAYgByAGEMQBIAMgCCADEMQBQajwASADIAMQoAEgAyAHIAMQxAFBiPABIARBiPABECggBUEBaiEFDAELCwuxAQEHfyABIAJ2IQRBASACdCIFQQF2IgZBwAFsIQcgAkEFdEHIxQFqIQhBACEBA0Ag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IAAQ2gEgAEHAAWoQ2QELGAAgACABENsBIABBwAFqIAFBwAFqENsBC30BAn8gACABQciVAhDcASAAQcABaiIDIAFBwAFqIgRBiJcCENwBIAAgA0HImAIQ3gEgASAEQYiaAhDeAUHImAJBiJoCQciYAhDcAUGIlwIgAhDoAUHIlQIgAiACEN4BQciVAkGIlwIgAkHAAWoiABDeAUHImAIgACAAEN8BCxwAIAAgASACENwBIABBwAFqIAEgAkHAAWoQ3AELeQEBfyAAIABBwAFqIgJByJsCENwBIAAgAkGInQIQ3gEgAkHIngIQ6AEgAEHIngJByJ4CEN4BQcibAkGIoAIQ6AFBiKACQcibAkGIoAIQ3gFBiJ0CQcieAiABENwBIAFBiKACIAEQ3wFByJsCQcibAiABQcABahDeAQsgACAAIAEgAhDeASAAQcABaiABQcABaiACQcABahDeAQsgACAAIAEgAhDfASAAQcABaiABQcABaiACQcABahDfAQsYACAAIAEQ4AEgAEHAAWogAUHAAWoQ4AELGAAgACABENsBIABBwAFqIAFBwAFqEOABCxgAIAAgARCkASAAQcABaiABQcABahCkAQsYACAAIAEQogEgAEHAAWogAUHAAWoQogELGQAgACABEOIBIABBwAFqIAFBwAFqEOIBcQtkAQF/IABByKECEN0BIABBwAFqIgJBiKMCEN0BQYijAkHIpAIQ6AFByKECQcikAkHIpAIQ3wFByKQCQYimAhDjASAAQYimAiABENwBIAJBiKYCIAFBwAFqIgAQ3AEgACAAEOABCyAAIAAgASACIAMQ5AEgAEHAAWogASACIANBwAFqEOQBCxoBAX8gAEHAAWoQ4QEiAQRAIAEPCyAAEOEBCx0AIABBwAFqENcBBEAgABDlAQ8LIABBwAFqEOUBC/YBAQJ/QQBBACgCACIFIAJBAWpBgANsajYCACAFEOwBIAVBgANqIQUDQCACIAZHBEAgABDpAQRAIAVBgANrIAUQ7QEFIAAgBUGAA2sgBRDuAQsgACABaiEAIAVBgANqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBgANrIgUgBRD4AQNAIAYEQCAAEOkBBEAgBSAFQYADaxDtASACEOsBBSAFQYADayIDQcinAhDtASAFIAAgAxDuASAFQcin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D4N8Ih1C/////w+DfCIeQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIbQv////8PgyAEfkL/////D4MiKCAWfiAbQv////8Pg3xCIIggKkIgiCApQiCIfCAaQiCIfCAdQiCIfCAeQiCIfCAjQiCIfCAkQiCIfCAbQiCIfHwiI0L/////D4N8IiRC/////w+DfCIfQv////8Pg3whHSAMICJ+IBUgF34gDiAnfiANIAE1AhQiGn4gCDUCACIbIBN+IBQgHH4gESAYfiAPICh+IAA1AhAiKSASfiAQICJ+IB1C/////w+DfCIgQv////8Pg3wiJUL/////D4N8IhlC/////w+DfCIhQv////8Pg3wiJkL/////D4N8Ih5C/////w+DIAR+Qv////8PgyIqIBZ+IB5C/////w+DfEIgiCAkQiCIICNCIIh8IB9CIIh8IB1CIIh8ICBCIIh8ICVCIIh8IBlCIIh8ICFCIIh8ICZCIIh8IB5CIIh8fCIlQv////8Pg3wiGUL/////D4N8IiFC/////w+DfCImQv////8Pg3whHyAMICl+IBUgIn4gFyAnfiAOIBp+IA0gATUCGCIdfiAHNQIAIh4gE34gFCAbfiAYIBx+IBEgKH4gDyAqfiAANQIUIiMgEn4gECApfiAfQv////8Pg3wiK0L/////D4N8IixC/////w+DfCItQv////8Pg3wiLkL/////D4N8Ii9C/////w+DfCIwQv////8Pg3wiIEL/////D4MgBH5C/////w+DIiQgFn4gIEL/////D4N8QiCIIBlCIIggJUIgiHwgIUIgiHwgJkIgiHwgH0IgiHwgK0IgiHwgLEIgiHwgLUIgiHwgLkIgiHwgL0IgiHwgMEIgiHwgIEIgiHx8IiZC/////w+DfCIrQv////8Pg3wiLEL/////D4N8Ii1C/////w+DfCIuQv////8Pg3whGSAMICN+IBUgKX4gIiAnfiAXIBp+IA4gHX4gDSABNQIcIh9+IAY1AgAiDSATfiAUIB5+IBggG34gHCAofiARICp+IA8gJH4gADUCGCIgIBJ+IBAgI34gGUL/////D4N8Ii9C/////w+DfCIwQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCIhQv////8PgyAEfkL/////D4MiJSAWfiAhQv////8Pg3xCIIggK0IgiCAmQiCIfCAsQiCIfCAtQiCIfCAuQiCIfCAZQiCIfCAvQiCIfCAwQiCIfCAxQiCIfCAyQiCIfCAzQiCIfCA0QiCIfCA1QiCIfCAhQiCIfHwiIUL/////D4N8IiZC/////w+DfCIrQv////8Pg3wiLEL/////D4N8Ii1C/////w+DfCIuQv////8Pg3whGSAMICB+IBUgI34gJyApfiAaICJ+IBcgHX4gDiAffiAWIBMgBTUCACITfiANIBR+IBggHn4gGyAofiAcICp+IBEgJH4gDyAlfiASIAA1AhwiEn4gECAgfiAZQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUL/////D4N8IjZC/////w+DfCIOQv////8PgyAEfkL/////D4MiFn4gDkL/////D4N8QiCIICZCIIggIUIgiHwgK0IgiHwgLEIgiHwgLUIgiHwgLkIgiHwgGUIgiHwgL0IgiHwgMEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgNkIgiHwgDkIgiHx8IhlC/////w+DfCIhQv////8Pg3wiJkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiLUL/////D4N8IQ4gEyAUfiANIBh+IB4gKH4gGyAqfiAcICR+IBEgJX4gDyAWfiAQIBJ+IA5C/////w+DfCIPQv////8Pg3wiEEL/////D4N8IhRC/////w+DfCIuQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIxQv////8Pg3wiMkIgiCAhQiCIIBlCIIh8ICZCIIh8ICtCIIh8ICxCIIh8IC1CIIh8IA5CIIh8IA9CIIh8IBBCIIh8IBRCIIh8IC5CIIh8IC9CIIh8IDBCIIh8IDFCIIh8fCEPIAIgMj4CACATIBh+IA0gKH4gHiAqfiAbICR+IBwgJX4gESAWfiAMIBJ+IBUgIH4gIyAnfiAaICl+IB0gIn4gFyAffiAPQv////8Pg3wiDEL/////D4N8Ig5C/////w+DfCIQQv////8Pg3wiFEL/////D4N8IhFC/////w+DfCIXQv////8Pg3wiGEL/////D4N8IhlC/////w+DfCIhQv////8Pg3wiJkL/////D4N8IitC/////w+DfCIsQiCIIAxCIIggD0IgiHwgDkIgiHwgEEIgiHwgFEIgiHwgEUIgiHwgF0IgiHwgGEIgiHwgGUIgiHwgIUIgiHwgJkIgiHwgK0IgiHx8IQwgAiAsPgIEIBMgKH4gDSAqfiAeICR+IBsgJX4gFiAcfiASIBV+ICAgJ34gGiAjfiAdICl+IB8gIn4gDEL/////D4N8Ig9C/////w+DfCIOQv////8Pg3wiEEL/////D4N8IhRC/////w+DfCIVQv////8Pg3wiEUL/////D4N8IhdC/////w+DfCIYQv////8Pg3wiHEL/////D4N8IiJCIIggD0IgiCAMQiCIfCAOQiCIfCAQQiCIfCAUQiCIfCAVQiCIfCARQiCIfCAXQiCIfCAYQiCIfCAcQiCIfHwhDCACICI+AgggEyAqfiANICR+IB4gJX4gFiAbfiASICd+IBogIH4gHSAjfiAfICl+IAxC/////w+DfCIPQv////8Pg3wiDkL/////D4N8IhBC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhFC/////w+DfCIXQv////8Pg3wiGEIgiCAPQiCIIAxCIIh8IA5CIIh8IBBCIIh8IBRCIIh8IBVCIIh8IBFCIIh8IBdCIIh8fCEMIAIgGD4CDCATICR+IA0gJX4gFiAefiASIBp+IB0gIH4gHyAjfiAMQv////8Pg3wiD0L/////D4N8Ig5C/////w+DfCIQQv////8Pg3wiFEL/////D4N8IhVC/////w+DfCIRQiCIIA9CIIggDEIgiHwgDkIgiHwgEEIgiHwgFEIgiHwgFUIgiHx8IQwgAiARPgIQIBMgJX4gDSAWfiASIB1+IB8gIH4gDEL/////D4N8Ig1C/////w+DfCIPQv////8Pg3wiDkL/////D4N8IhBCIIggDUIgiCAMQiCIfCAPQiCIfCAOQiCIfHwhDSACIBA+AhQgEyAWfiASIB9+IA1C/////w+DfCISQv////8Pg3wiE0IgiCASQiCIIA1CIIh8fCENIAIgEz4CGCACIA0+AhwgDUIgiKcEQCACIAMgAhAHGgUgAiADEAUEQCACIAMgAhAHGgsLC5sXASN+IAA1AgAiECAQfiILQv////8PgyADfkL/////D4MiFSACNQIAIhZ+IAtC/////w+DfEIgiCALQiCIfCENIAo1AgAiEiAVfiAANQIEIgsgEH4iDkL/////D4NCAYYiEUL/////D4MgDUL/////D4N8Ig9C/////w+DfCIMQv////8PgyADfkL/////D4MiEyAWfiAMQv////8Pg3xCIIggDkIgiEIBhiARQiCIfCAPQiCIfCANQiCIfCAMQiCIfHwhDCAJNQIAIhggFX4gEiATfiALIAt+IAA1AggiDSAQfiIRQv////8Pg0IBhiIPQv////8Pg3wiGUL/////D4MgDEL/////D4N8Ih1C/////w+DfCIaQv////8Pg3wiDkL/////D4MgA35C/////w+DIhsgFn4gDkL/////D4N8QiCIIBFCIIhCAYYgD0IgiHwgGUIgiHwgHUIgiHwgDEIgiHwgGkIgiHwgDkIgiHx8IQ4gCDUCACIZIBV+IBMgGH4gEiAbfiALIA1+IAA1AgwiDCAQfiIPQv////8Pg3wiGkL/////D4NCAYYiHkL/////D4MgDkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiF0L/////D4N8IhFC/////w+DIAN+Qv////8PgyIdIBZ+IBFC/////w+DfEIgiCAaQiCIIA9CIIh8QgGGIB5CIIh8IB9CIIh8IA5CIIh8ICBCIIh8IBdCIIh8IBFCIIh8fCERIAc1AgAiGiAVfiATIBl+IBggG34gEiAdfiANIA1+IAsgDH4gADUCECIOIBB+Ih9C/////w+DfCIgQv////8Pg0IBhiIXQv////8Pg3wiIUL/////D4MgEUL/////D4N8IhRC/////w+DfCIcQv////8Pg3wiIkL/////D4N8IiNC/////w+DfCIPQv////8PgyADfkL/////D4MiHiAWfiAPQv////8Pg3xCIIggIEIgiCAfQiCIfEIBhiAXQiCIfCAhQiCIfCAUQiCIfCARQiCIfCAcQiCIfCAiQiCIfCAjQiCIfCAPQiCIfHwhDyAGNQIAIh8gFX4gEyAafiAZIBt+IBggHX4gEiAefiAMIA1+IAsgDn4gADUCFCIRIBB+IiFC/////w+DfCIUQv////8Pg3wiHEL/////D4NCAYYiIkL/////D4MgD0L/////D4N8IiNC/////w+DfCIkQv////8Pg3wiJUL/////D4N8IiZC/////w+DfCInQv////8Pg3wiF0L/////D4MgA35C/////w+DIiAgFn4gF0L/////D4N8QiCIIBRCIIggIUIgiHwgHEIgiHxCAYYgIkIgiHwgI0IgiHwgD0IgiHwgJEIgiHwgJUIgiHwgJkIgiHwgJ0IgiHwgF0IgiHx8IRQgBTUCACIXIBV+IBMgH34gGiAbfiAZIB1+IBggHn4gEiAgfiAMIAx+IA0gDn4gCyARfiAANQIYIg8gEH4iIkL/////D4N8IiNC/////w+DfCIkQv////8Pg0IBhiIlQv////8Pg3wiJkL/////D4MgFEL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUL/////D4N8IipC/////w+DfCIrQv////8Pg3wiLEL/////D4N8IhxC/////w+DIAN+Qv////8PgyIhIBZ+IBxC/////w+DfEIgiCAjQiCIICJCIIh8ICRCIIh8QgGGICVCIIh8ICZCIIh8ICdCIIh8IBRCIIh8IChCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IBxCIIh8fCEUIBYgFSAENQIAIhV+IBMgF34gGyAffiAaIB1+IBkgHn4gGCAgfiASICF+IAwgDn4gDSARfiALIA9+IBAgADUCHCIQfiIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIlQv////8Pg0IBhiImQv////8PgyAUQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiLUL/////D4N8IhxC/////w+DIAN+Qv////8PgyIWfiAcQv////8Pg3xCIIggI0IgiCAiQiCIfCAkQiCIfCAlQiCIfEIBhiAmQiCIfCAnQiCIfCAUQiCIfCAoQiCIfCApQiCIfCAqQiCIfCArQiCIfCAsQiCIfCAtQiCIfCAcQiCIfHwhFCABIBMgFX4gFyAbfiAdIB9+IBogHn4gGSAgfiAYICF+IBIgFn4gDiAOfiAMIBF+IA0gD34gCyAQfiILQv////8Pg3wiEkL/////D4N8IhNC/////w+DQgGGIhxC/////w+DfCIiQv////8PgyAUQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIlQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUL/////D4N8Iio+AgAgASAVIBt+IBcgHX4gHiAffiAaICB+IBkgIX4gFiAYfiAOIBF+IAwgD34gDSAQfiINQv////8Pg3wiGEL/////D4N8IhtC/////w+DQgGGIitC/////w+DIBJCIIggC0IgiHwgE0IgiHxCAYYgHEIgiHwgIkIgiHwgI0IgiHwgFEIgiHwgJEIgiHwgJUIgiHwgJkIgiHwgJ0IgiHwgKEIgiHwgKUIgiHwgKkIgiHwiC0L/////D4N8IhJC/////w+DfCITQv////8Pg3wiFEL/////D4N8IhxC/////w+DfCIiQv////8Pg3wiI0L/////D4N8IiQ+AgQgASAVIB1+IBcgHn4gHyAgfiAaICF+IBYgGX4gESARfiAOIA9+IAwgEH4iDEL/////D4N8IhlC/////w+DQgGGIh1C/////w+DfCIlQv////8PgyAYQiCIIA1CIIh8IBtCIIh8QgGGICtCIIh8IBJCIIh8IAtCIIh8IBNCIIh8IBRCIIh8IBxCIIh8ICJCIIh8ICNCIIh8ICRCIIh8IgtC/////w+DfCINQv////8Pg3wiEkL/////D4N8IhNC/////w+DfCIYQv////8Pg3wiG0L/////D4N8IhQ+AgggASAVIB5+IBcgIH4gHyAhfiAWIBp+IA8gEX4gDiAQfiIOQv////8Pg3wiGkL/////D4NCAYYiHkL/////D4MgGUIgiCAMQiCIfEIBhiAdQiCIfCAlQiCIfCANQiCIfCALQiCIfCASQiCIfCATQiCIfCAYQiCIfCAbQiCIfCAUQiCIfCILQv////8Pg3wiDUL/////D4N8IgxC/////w+DfCISQv////8Pg3wiE0L/////D4N8Ihg+AgwgASAVICB+IBcgIX4gFiAffiAPIA9+IBAgEX4iEUL/////D4NCAYYiG0L/////D4N8IhlC/////w+DIBpCIIggDkIgiHxCAYYgHkIgiHwgDUIgiHwgC0IgiHwgDEIgiHwgEkIgiHwgE0IgiHwgGEIgiHwiC0L/////D4N8Ig1C/////w+DfCIMQv////8Pg3wiDkL/////D4N8IhI+AhAgASAVICF+IBYgF34gDyAQfiIPQv////8P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";
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
// 'code' is base64 of the wasm-opt -Oz optimized wasm; the rest are
// pointer offsets / field moduli.
const code = "AGFzbQEAAAABjwERYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgCH9/f39/f39/AGADf39/AX9gAn9+AGAEf39/fwF/YAp/f39/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIPAQNlbnYGbWVtb3J5AgAZA7ICsAIABQIFBgYJCQEAAAoDAQIBAQAAAQAAAAACAgAFAQMEAQEDAAIABQIFBgYJCQEAAAMBAgEBAAABAAAAAAICAAUBAwQBAQMAAgEAAAICAgUFAAAABgYGAAABAQEAAAEBAQAAAAAAAgIBAAEAAAAAAQEBAQELBwgECAQDAwADAgAABAcHAQEHAAMMBAMCBQABAQABAQAAAwICBAMAAgICBQUAAAAGBgYAAAEBAQAAAQEBAAAAAAACAgEAAAAAAAEBAQEBCAQIBAMDAQADAAAEBwcBAQcBAAMAAAQHBwEBBwEBBAQEBAQAAgIFBQABAAEBAAIGAAMCBAMAAgIFBQABAQABAQAAAAAGAAMCAgQDAAIBAwQBAAAAAAAAAAAAAAICAgIAAAEAAAAACQ0ODxABCggIB74nvQIJaW50cV9jb3B5AAAJaW50cV96ZXJvAAEIaW50cV9vbmUAAwtpbnRxX2lzWmVybwACB2ludHFfZXEABAhpbnRxX2d0ZQAFCGludHFfYWRkAAYIaW50cV9zdWIABwhpbnRxX211bAAIC2ludHFfc3F1YXJlAAkOaW50cV9zcXVhcmVPbGQACghpbnRxX2RpdgAMD2ludHFfaW52ZXJzZU1vZAANCGYxbV9jb3B5AAAIZjFtX3plcm8AAQpmMW1faXNaZXJvAAIGZjFtX2VxAAQHZjFtX2FkZAAPB2YxbV9zdWIAEAdmMW1fbmVnABEOZjFtX2lzTmVnYXRpdmUAGAlmMW1faXNPbmUADghmMW1fc2lnbgAZC2YxbV9tUmVkdWN0ABIHZjFtX211bAATCmYxbV9zcXVhcmUAFA1mMW1fc3F1YXJlT2xkABUSZjFtX2Zyb21Nb250Z29tZXJ5ABcQZjFtX3RvTW9udGdvbWVyeQAWC2YxbV9pbnZlcnNlABoHZjFtX29uZQAbCGYxbV9sb2FkABwPZjFtX3RpbWVzU2NhbGFyAB0HZjFtX2V4cAAhEGYxbV9iYXRjaEludmVyc2UAHghmMW1fc3FydAAiDGYxbV9pc1NxdWFyZQAjFWYxbV9iYXRjaFRvTW9udGdvbWVyeQAfF2YxbV9iYXRjaEZyb21Nb250Z29tZXJ5ACAJaW50cl9jb3B5ACQJaW50cl96ZXJvACUIaW50cl9vbmUAJwtpbnRyX2lzWmVybwAmB2ludHJfZXEAKAhpbnRyX2d0ZQApCGludHJfYWRkACoIaW50cl9zdWIAKwhpbnRyX211bAAsC2ludHJfc3F1YXJlAC0OaW50cl9zcXVhcmVPbGQALghpbnRyX2RpdgAvD2ludHJfaW52ZXJzZU1vZAAwCGZybV9jb3B5ACQIZnJtX3plcm8AJQpmcm1faXNaZXJvACYGZnJtX2VxACgHZnJtX2FkZAAyB2ZybV9zdWIAMwdmcm1fbmVnADQOZnJtX2lzTmVnYXRpdmUAOwlmcm1faXNPbmUAMQhmcm1fc2lnbgA8C2ZybV9tUmVkdWN0ADUHZnJtX211bAA2CmZybV9zcXVhcmUANw1mcm1fc3F1YXJlT2xkADgSZnJtX2Zyb21Nb250Z29tZXJ5ADoQZnJtX3RvTW9udGdvbWVyeQA5C2ZybV9pbnZlcnNlAD0HZnJtX29uZQA+CGZybV9sb2FkAD8PZnJtX3RpbWVzU2NhbGFyAEAHZnJtX2V4cABEEGZybV9iYXRjaEludmVyc2UAQQhmcm1fc3FydABFDGZybV9pc1NxdWFyZQBGFWZybV9iYXRjaFRvTW9udGdvbWVyeQBCF2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5AEMGZnJfYWRkADIGZnJfc3ViADMGZnJfbmVnADQGZnJfbXVsAEcJZnJfc3F1YXJlAEgKZnJfaW52ZXJzZQBJDWZyX2lzTmVnYXRpdmUASgdmcl9jb3B5ACQHZnJfemVybwAlBmZyX29uZQA+CWZyX2lzWmVybwAmBWZyX2VxACgMZzFtX211bHRpZXhwAHUSZzFtX211bHRpZXhwX2NodW5rAHQSZzFtX211bHRpZXhwQWZmaW5lAHcYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAHYKZzFtX2lzWmVybwBMEGcxbV9pc1plcm9BZmZpbmUASwZnMW1fZXEAVAtnMW1fZXFNaXhlZABTDGcxbV9lcUFmZmluZQBSCGcxbV9jb3B5AFAOZzFtX2NvcHlBZmZpbmUATwhnMW1femVybwBODmcxbV96ZXJvQWZmaW5lAE0KZzFtX2RvdWJsZQBWEGcxbV9kb3VibGVBZmZpbmUAVQdnMW1fYWRkAFkMZzFtX2FkZE1peGVkAFgNZzFtX2FkZEFmZmluZQBXB2cxbV9uZWcAWw1nMW1fbmVnQWZmaW5lAFoHZzFtX3N1YgBeDGcxbV9zdWJNaXhlZABdDWcxbV9zdWJBZmZpbmUAXBJnMW1fZnJvbU1vbnRnb21lcnkAYBhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUAXxBnMW1fdG9Nb250Z29tZXJ5AGIWZzFtX3RvTW9udGdvbWVyeUFmZmluZQBhD2cxbV90aW1lc1NjYWxhcgB4FWcxbV90aW1lc1NjYWxhckFmZmluZQB5DWcxbV9ub3JtYWxpemUAZwpnMW1fTEVNdG9VAGkKZzFtX0xFTXRvQwBqCmcxbV9VdG9MRU0AawpnMW1fQ3RvTEVNAGwPZzFtX2JhdGNoTEVNdG9VAG0PZzFtX2JhdGNoTEVNdG9DAG4PZzFtX2JhdGNoVXRvTEVNAG8PZzFtX2JhdGNoQ3RvTEVNAHAMZzFtX3RvQWZmaW5lAGMOZzFtX3RvSmFjb2JpYW4AURFnMW1fYmF0Y2hUb0FmZmluZQBmE2cxbV9iYXRjaFRvSmFjb2JpYW4AcQtnMW1faW5DdXJ2ZQBlEWcxbV9pbkN1cnZlQWZmaW5lAGQXZnJtX19yZXZlcnNlUGVybXV0YXRpb24Aegdmcm1fZmZ0AH0IZnJtX2lmZnQAfgpmcm1fcmF3ZmZ0AHsLZnJtX2ZmdEpvaW4Afw5mcm1fZmZ0Sm9pbkV4dACAARFmcm1fZmZ0Sm9pbkV4dEludgCBAQpmcm1fZmZ0TWl4AIIBDGZybV9mZnRGaW5hbACDAR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgCEAQhwb2xfemVybwCFAQ9wb2xfY29uc3RydWN0TEMAhgEMcWFwX2J1aWxkQUJDAIcBC3FhcF9qb2luQUJDAIgBDHFhcF9iYXRjaEFkZACJAQpmMm1faXNaZXJvAEsJZjJtX2lzT25lAIoBCGYybV96ZXJvAE0HZjJtX29uZQCLAQhmMm1fY29weQCMAQdmMm1fbXVsAI0BCGYybV9tdWwxAI4BCmYybV9zcXVhcmUAjwEHZjJtX2FkZACQAQdmMm1fc3ViAJEBB2YybV9uZWcAkgEIZjJtX3NpZ24AlQENZjJtX2Nvbmp1Z2F0ZQBaEmYybV9mcm9tTW9udGdvbWVyeQBfEGYybV90b01vbnRnb21lcnkAYQZmMm1fZXEAUgtmMm1faW52ZXJzZQCTAQdmMm1fZXhwAJgBD2YybV90aW1lc1NjYWxhcgCUARBmMm1fYmF0Y2hJbnZlcnNlAJcBCGYybV9zcXJ0AJkBDGYybV9pc1NxdWFyZQCaAQ5mMm1faXNOZWdhdGl2ZQCWAQxnMm1fbXVsdGlleHAAwgESZzJtX211bHRpZXhwX2NodW5rAMEBEmcybV9tdWx0aWV4cEFmZmluZQDEARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsAwwEKZzJtX2lzWmVybwCcARBnMm1faXNaZXJvQWZmaW5lAJsBBmcybV9lcQCkAQtnMm1fZXFNaXhlZACjAQxnMm1fZXFBZmZpbmUAogEIZzJtX2NvcHkAoAEOZzJtX2NvcHlBZmZpbmUAnwEIZzJtX3plcm8AngEOZzJtX3plcm9BZmZpbmUAnQEKZzJtX2RvdWJsZQCmARBnMm1fZG91YmxlQWZmaW5lAKUBB2cybV9hZGQAqQEMZzJtX2FkZE1peGVkAKgBDWcybV9hZGRBZmZpbmUApwEHZzJtX25lZwCrAQ1nMm1fbmVnQWZmaW5lAKoBB2cybV9zdWIArgEMZzJtX3N1Yk1peGVkAK0BDWcybV9zdWJBZmZpbmUArAESZzJtX2Zyb21Nb250Z29tZXJ5ALABGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQCvARBnMm1fdG9Nb250Z29tZXJ5ALIBFmcybV90b01vbnRnb21lcnlBZmZpbmUAsQEPZzJtX3RpbWVzU2NhbGFyAMUBFWcybV90aW1lc1NjYWxhckFmZmluZQDGAQ1nMm1fbm9ybWFsaXplALcBCmcybV9MRU10b1UAuAEKZzJtX0xFTXRvQwC5AQpnMm1fVXRvTEVNALoBCmcybV9DdG9MRU0AuwEPZzJtX2JhdGNoTEVNdG9VALwBD2cybV9iYXRjaExFTXRvQwC9AQ9nMm1fYmF0Y2hVdG9MRU0AvgEPZzJtX2JhdGNoQ3RvTEVNAL8BDGcybV90b0FmZmluZQCzAQ5nMm1fdG9KYWNvYmlhbgChARFnMm1fYmF0Y2hUb0FmZmluZQC2ARNnMm1fYmF0Y2hUb0phY29iaWFuAMABC2cybV9pbkN1cnZlALUBEWcybV9pbkN1cnZlQWZmaW5lALQBC2cxbV90aW1lc0ZyAMcBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uAMgBB2cxbV9mZnQAygEIZzFtX2lmZnQAywEKZzFtX3Jhd2ZmdADJAQtnMW1fZmZ0Sm9pbgDMAQ5nMW1fZmZ0Sm9pbkV4dADNARFnMW1fZmZ0Sm9pbkV4dEludgDOAQpnMW1fZmZ0TWl4AM8BDGcxbV9mZnRGaW5hbADQAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDRAQtnMm1fdGltZXNGcgDSARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDTAQdnMm1fZmZ0ANUBCGcybV9pZmZ0ANYBCmcybV9yYXdmZnQA1AELZzJtX2ZmdEpvaW4A1wEOZzJtX2ZmdEpvaW5FeHQA2AERZzJtX2ZmdEpvaW5FeHRJbnYA2QEKZzJtX2ZmdE1peADaAQxnMm1fZmZ0RmluYWwA2wEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A3AERZzFtX3RpbWVzRnJBZmZpbmUA3QERZzJtX3RpbWVzRnJBZmZpbmUA3gERZnJtX2JhdGNoQXBwbHlLZXkA3wERZzFtX2JhdGNoQXBwbHlLZXkA4AEWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZADhARFnMm1fYmF0Y2hBcHBseUtleQDiARZnMm1fYmF0Y2hBcHBseUtleU1peGVkAOMBCmY2bV9pc1plcm8A5QEJZjZtX2lzT25lAOYBCGY2bV96ZXJvAOcBB2Y2bV9vbmUA6AEIZjZtX2NvcHkA6QEHZjZtX211bADqAQpmNm1fc3F1YXJlAOsBB2Y2bV9hZGQA7AEHZjZtX3N1YgDtAQdmNm1fbmVnAO4BCGY2bV9zaWduAO8BEmY2bV9mcm9tTW9udGdvbWVyeQCwARBmNm1fdG9Nb250Z29tZXJ5ALIBBmY2bV9lcQDwAQtmNm1faW52ZXJzZQDxAQdmNm1fZXhwAPUBD2Y2bV90aW1lc1NjYWxhcgDyARBmNm1fYmF0Y2hJbnZlcnNlAPQBDmY2bV9pc05lZ2F0aXZlAPMBCmZ0bV9pc1plcm8A9wEJZnRtX2lzT25lAPgBCGZ0bV96ZXJvAPkBB2Z0bV9vbmUA+gEIZnRtX2NvcHkA+wEHZnRtX211bAD8AQhmdG1fbXVsMQD9AQpmdG1fc3F1YXJlAP4BB2Z0bV9hZGQA/wEHZnRtX3N1YgCAAgdmdG1fbmVnAIECCGZ0bV9zaWduAIgCDWZ0bV9jb25qdWdhdGUAggISZnRtX2Zyb21Nb250Z29tZXJ5AIQCEGZ0bV90b01vbnRnb21lcnkAgwIGZnRtX2VxAIUCC2Z0bV9pbnZlcnNlAIYCB2Z0bV9leHAAiwIPZnRtX3RpbWVzU2NhbGFyAIcCEGZ0bV9iYXRjaEludmVyc2UAigIIZnRtX3NxcnQAjAIMZnRtX2lzU3F1YXJlAI0CDmZ0bV9pc05lZ2F0aXZlAIkCEWZ0bV9mcm9iZW5pdXNNYXAwAJICEWZ0bV9mcm9iZW5pdXNNYXAxAJMCEWZ0bV9mcm9iZW5pdXNNYXAyAJQCEWZ0bV9mcm9iZW5pdXNNYXAzAJUCEWZ0bV9mcm9iZW5pdXNNYXA0AJYCEWZ0bV9mcm9iZW5pdXNNYXA1AJcCEWZ0bV9mcm9iZW5pdXNNYXA2AJgCEWZ0bV9mcm9iZW5pdXNNYXA3AJkCEWZ0bV9mcm9iZW5pdXNNYXA4AJoCEWZ0bV9mcm9iZW5pdXNNYXA5AJsCE2JsczEyMzgxX3BhaXJpbmdFcTEApwITYmxzMTIzODFfcGFpcmluZ0VxMgCoAhNibHMxMjM4MV9wYWlyaW5nRXEzAKkCE2JsczEyMzgxX3BhaXJpbmdFcTQAqgITYmxzMTIzODFfcGFpcmluZ0VxNQCrAhBibHMxMjM4MV9wYWlyaW5nAKwCEmJsczEyMzgxX3ByZXBhcmVHMQCgAhJibHMxMjM4MV9wcmVwYXJlRzIAoQITYmxzMTIzODFfbWlsbGVyTG9vcACiAhxibHMxMjM4MV9maW5hbEV4cG9uZW50aWF0aW9uAKYCH2JsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAowIaYmxzMTIzODFfX2N5Y2xvdG9taWNTcXVhcmUApAIaYmxzMTIzODFfX2N5Y2xvdG9taWNFeHBfdzAApQIIZjZtX211bDEAjgIJZjZtX211bDAxAI8CCmZ0bV9tdWwwMTQAkAIRZzFtX2luR3JvdXBBZmZpbmUAnAILZzFtX2luR3JvdXAAnQIRZzJtX2luR3JvdXBBZmZpbmUAngILZzJtX2luR3JvdXAAnwIK/JYEsAI+ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKAsJACAAQgAQrQILRAAgACkDKFAEfiAAKQMgUAR+IAApAxhQBH4gACkDEFAEfiAAKQMIUAR+IAApAwAFQgELBUIBCwVCAQsFQgELBUIBC1ALCQAgAEIBEK0CC2IAIAApAyggASkDKFEEfyAAKQMgIAEpAyBRBH8gACkDGCABKQMYUQR/IAApAxAgASkDEFEEfyAAKQMIIAEpAwhRBH8gACkDACABKQMAUQVBAAsFQQALBUEACwVBAAsFQQALC7cBACAAKQMoIAEpAyhUBH9BAAUgACkDKCABKQMoVgR/QQEFIAApAyAgASkDIFQEf0EABSAAKQMgIAEpAyBWBH9BAQUgACkDGCABKQMYVAR/QQAFIAApAxggASkDGFYEf0EBBSAAKQMQIAEpAxBUBH9BAAUgACkDECABKQMQVgR/QQEFIAApAwggASkDCFQEf0EABSAAKQMIIAEpAwhWBH9BAQUgACkDACABKQMAWgsLCwsLCwsLCwsLpAIBAX4gAiAANQIAIAE1AgB8IgM+AgAgAiAANQIEIAE1AgR8IANCIIh8IgM+AgQgAiAANQIIIAE1Agh8IANCIIh8IgM+AgggAiAANQIMIAE1Agx8IANCIIh8IgM+AgwgAiAANQIQIAE1AhB8IANCIIh8IgM+AhAgAiAANQIUIAE1AhR8IANCIIh8IgM+AhQgAiAANQIYIAE1Ahh8IANCIIh8IgM+AhggAiAANQIcIAE1Ahx8IANCIIh8IgM+AhwgAiAANQIgIAE1AiB8IANCIIh8IgM+AiAgAiAANQIkIAE1AiR8IANCIIh8IgM+AiQgAiAANQIoIAE1Aih8IANCIIh8IgM+AiggAiAANQIsIAE1Aix8IANCIIh8IgM+AiwgA0IgiKcL+AIBAX4gAiAANQIAIAE1AgB9IgNC/////w+DPgIAIAIgADUCBCABNQIEfSADQiCHfCIDQv////8Pgz4CBCACIAA1AgggATUCCH0gA0Igh3wiA0L/////D4M+AgggAiAANQIMIAE1Agx9IANCIId8IgNC/////w+DPgIMIAIgADUCECABNQIQfSADQiCHfCIDQv////8Pgz4CECACIAA1AhQgATUCFH0gA0Igh3wiA0L/////D4M+AhQgAiAANQIYIAE1Ahh9IANCIId8IgNC/////w+DPgIYIAIgADUCHCABNQIcfSADQiCHfCIDQv////8Pgz4CHCACIAA1AiAgATUCIH0gA0Igh3wiA0L/////D4M+AiAgAiAANQIkIAE1AiR9IANCIId8IgNC/////w+DPgIkIAIgADUCKCABNQIofSADQiCHfCIDQv////8Pgz4CKCACIAA1AiwgATUCLH0gA0Igh3wiA0L/////D4M+AiwgA0Igh6cLhRsBI34gADUCACIDIAE1AgAiCH4iBEIgiCEGIAIgBD4CACAANQIEIgQgCH4gAyABNQIEIgV+IAZC/////w+DfCIHQv////8Pg3wiCkIgiCAHQiCIIAZCIIh8fCEJIAIgCj4CBCAANQIIIgYgCH4gBCAFfiADIAE1AggiB34gCUL/////D4N8IgpC/////w+DfCILQv////8Pg3wiE0IgiCAKQiCIIAlCIIh8IAtCIIh8fCELIAIgEz4CCCAANQIMIgkgCH4gBSAGfiAEIAd+IAMgATUCDCIKfiALQv////8Pg3wiE0L/////D4N8IhdC/////w+DfCIZQv////8Pg3wiEEIgiCATQiCIIAtCIIh8IBdCIIh8IBlCIIh8fCEXIAIgED4CDCAANQIQIgsgCH4gBSAJfiAGIAd+IAQgCn4gAyABNQIQIhN+IBdC/////w+DfCIZQv////8Pg3wiEEL/////D4N8IhpC/////w+DfCIRQv////8Pg3wiFEIgiCAZQiCIIBdCIIh8IBBCIIh8IBpCIIh8IBFCIIh8fCEQIAIgFD4CECAANQIUIhcgCH4gBSALfiAHIAl+IAYgCn4gBCATfiADIAE1AhQiGX4gEEL/////D4N8IhpC/////w+DfCIRQv////8Pg3wiFEL/////D4N8IhJC/////w+DfCIVQv////8Pg3wiDEIgiCAaQiCIIBBCIIh8IBFCIIh8IBRCIIh8IBJCIIh8IBVCIIh8fCERIAIgDD4CFCAANQIYIhAgCH4gBSAXfiAHIAt+IAkgCn4gBiATfiAEIBl+IAMgATUCGCIafiARQv////8Pg3wiFEL/////D4N8IhJC/////w+DfCIVQv////8Pg3wiDEL/////D4N8IhZC/////w+DfCINQv////8Pg3wiD0IgiCAUQiCIIBFCIIh8IBJCIIh8IBVCIIh8IAxCIIh8IBZCIIh8IA1CIIh8fCESIAIgDz4CGCAANQIcIhEgCH4gBSAQfiAHIBd+IAogC34gCSATfiAGIBl+IAQgGn4gAyABNQIcIhR+IBJC/////w+DfCIVQv////8Pg3wiDEL/////D4N8IhZC/////w+DfCINQv////8Pg3wiD0L/////D4N8Ig5C/////w+DfCIYQv////8Pg3wiG0IgiCAVQiCIIBJCIIh8IAxCIIh8IBZCIIh8IA1CIIh8IA9CIIh8IA5CIIh8IBhCIIh8fCEMIAIgGz4CHCAANQIgIhIgCH4gBSARfiAHIBB+IAogF34gCyATfiAJIBl+IAYgGn4gBCAUfiADIAE1AiAiFX4gDEL/////D4N8IhZC/////w+DfCINQv////8Pg3wiD0L/////D4N8Ig5C/////w+DfCIYQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIdQv////8Pg3wiHkIgiCAWQiCIIAxCIIh8IA1CIIh8IA9CIIh8IA5CIIh8IBhCIIh8IBtCIIh8IBxCIIh8IB1CIIh8fCENIAIgHj4CICAANQIkIgwgCH4gBSASfiAHIBF+IAogEH4gEyAXfiALIBl+IAkgGn4gBiAUfiAEIBV+IAMgATUCJCIWfiANQv////8Pg3wiD0L/////D4N8Ig5C/////w+DfCIYQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIdQv////8Pg3wiHkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiIUIgiCAPQiCIIA1CIIh8IA5CIIh8IBhCIIh8IBtCIIh8IBxCIIh8IB1CIIh8IB5CIIh8IB9CIIh8ICBCIIh8fCEOIAIgIT4CJCAANQIoIg0gCH4gBSAMfiAHIBJ+IAogEX4gECATfiAXIBl+IAsgGn4gCSAUfiAGIBV+IAQgFn4gAyABNQIoIg9+IA5C/////w+DfCIYQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIdQv////8Pg3wiHkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiIUL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJEIgiCAYQiCIIA5CIIh8IBtCIIh8IBxCIIh8IB1CIIh8IB5CIIh8IB9CIIh8ICBCIIh8ICFCIIh8ICJCIIh8ICNCIIh8fCEYIAIgJD4CKCAIIAA1AiwiCH4gBSANfiAHIAx+IAogEn4gESATfiAQIBl+IBcgGn4gCyAUfiAJIBV+IAYgFn4gBCAPfiADIAE1AiwiDn4gGEL/////D4N8IgNC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiH0L/////D4N8IiBC/////w+DfCIhQv////8Pg3wiIkL/////D4N8IiNC/////w+DfCIkQv////8Pg3wiJUIgiCADQiCIIBhCIIh8IBtCIIh8IBxCIIh8IB1CIIh8IB5CIIh8IB9CIIh8ICBCIIh8ICFCIIh8ICJCIIh8ICNCIIh8ICRCIIh8fCEDIAIgJT4CLCAFIAh+IAcgDX4gCiAMfiASIBN+IBEgGX4gECAafiAUIBd+IAsgFX4gCSAWfiAGIA9+IAQgDn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiGEL/////D4N8IhtC/////w+DfCIcQv////8Pg3wiHUL/////D4N8Ih5C/////w+DfCIfQv////8Pg3wiIEL/////D4N8IiFC/////w+DfCIiQiCIIARCIIggA0IgiHwgBUIgiHwgGEIgiHwgG0IgiHwgHEIgiHwgHUIgiHwgHkIgiHwgH0IgiHwgIEIgiHwgIUIgiHx8IQMgAiAiPgIwIAcgCH4gCiANfiAMIBN+IBIgGX4gESAafiAQIBR+IBUgF34gCyAWfiAJIA9+IAYgDn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCIYQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIdQv////8Pg3wiHkL/////D4N8Ih9CIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAHQiCIfCAYQiCIfCAbQiCIfCAcQiCIfCAdQiCIfCAeQiCIfHwhAyACIB8+AjQgCCAKfiANIBN+IAwgGX4gEiAafiARIBR+IBAgFX4gFiAXfiALIA9+IAkgDn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IhhC/////w+DfCIbQv////8Pg3wiHEIgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8IAdCIIh8IAlCIIh8IApCIIh8IBhCIIh8IBtCIIh8fCEDIAIgHD4COCAIIBN+IA0gGX4gDCAafiASIBR+IBEgFX4gECAWfiAPIBd+IAsgDn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IgtC/////w+DfCITQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgB0IgiHwgCUIgiHwgCkIgiHwgC0IgiHx8IQMgAiATPgI8IAggGX4gDSAafiAMIBR+IBIgFX4gESAWfiAPIBB+IA4gF34gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IgtCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfCAHQiCIfCAJQiCIfCAKQiCIfHwhAyACIAs+AkAgCCAafiANIBR+IAwgFX4gEiAWfiAPIBF+IA4gEH4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkIgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8IAdCIIh8IAlCIIh8fCEDIAIgCj4CRCAIIBR+IA0gFX4gDCAWfiAPIBJ+IA4gEX4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCIJQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgB0IgiHx8IQMgAiAJPgJIIAggFX4gDSAWfiAMIA9+IA4gEn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IgdCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfHwhAyACIAc+AkwgCCAWfiANIA9+IAwgDn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkIgiCAEQiCIIANCIIh8IAVCIIh8fCEDIAIgBj4CUCAIIA9+IA0gDn4gA0L/////D4N8IgRC/////w+DfCIFQiCIIARCIIggA0IgiHx8IQMgAiAFPgJUIAggDn4gA0L/////D4N8IghCIIggA0IgiHwhAyACIAg+AlggAiADPgJcC7IVARt+IAEgADUCACIEIAR+IgI+AgAgASAANQIEIgMgBH4iCUL/////D4NCAYYiBUL/////D4MgAkIgiCIGQv////8Pg3wiBz4CBCABIAMgA34gADUCCCICIAR+IghC/////w+DQgGGIgpC/////w+DfCINQv////8PgyAJQiCIQgGGIAVCIIh8IAdCIIh8IAZCIIh8IgVC/////w+DfCIGPgIIIAEgAiADfiAANQIMIgkgBH4iB0L/////D4N8IgtC/////w+DQgGGIgxC/////w+DIAhCIIhCAYYgCkIgiHwgDUIgiHwgBkIgiHwgBUIgiHwiBkL/////D4N8Igg+AgwgASACIAJ+IAMgCX4gADUCECIFIAR+IgpC/////w+DfCINQv////8Pg0IBhiIOQv////8Pg3wiD0L/////D4MgC0IgiCAHQiCIfEIBhiAMQiCIfCAIQiCIfCAGQiCIfCIHQv////8Pg3wiCD4CECABIAIgCX4gAyAFfiAANQIUIgYgBH4iC0L/////D4N8IgxC/////w+DfCIQQv////8Pg0IBhiIRQv////8PgyANQiCIIApCIIh8QgGGIA5CIIh8IA9CIIh8IAhCIIh8IAdCIIh8IghC/////w+DfCIKPgIUIAEgCSAJfiACIAV+IAMgBn4gADUCGCIHIAR+Ig1C/////w+DfCIOQv////8Pg3wiD0L/////D4NCAYYiEkL/////D4N8IhNC/////w+DIAxCIIggC0IgiHwgEEIgiHxCAYYgEUIgiHwgCkIgiHwgCEIgiHwiCkL/////D4N8Igs+AhggASAFIAl+IAIgBn4gAyAHfiAANQIcIgggBH4iDEL/////D4N8IhBC/////w+DfCIRQv////8Pg3wiFEL/////D4NCAYYiFUL/////D4MgDkIgiCANQiCIfCAPQiCIfEIBhiASQiCIfCATQiCIfCALQiCIfCAKQiCIfCINQv////8Pg3wiCz4CHCABIAUgBX4gBiAJfiACIAd+IAMgCH4gADUCICIKIAR+Ig5C/////w+DfCIPQv////8Pg3wiEkL/////D4N8IhNC/////w+DQgGGIhZC/////w+DfCIXQv////8PgyAQQiCIIAxCIIh8IBFCIIh8IBRCIIh8QgGGIBVCIIh8IAtCIIh8IA1CIIh8IgtC/////w+DfCIMPgIgIAEgBSAGfiAHIAl+IAIgCH4gAyAKfiAANQIkIg0gBH4iEEL/////D4N8IhFC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhhC/////w+DQgGGIhlC/////w+DIA9CIIggDkIgiHwgEkIgiHwgE0IgiHxCAYYgFkIgiHwgF0IgiHwgDEIgiHwgC0IgiHwiDEL/////D4N8Ig4+AiQgASAGIAZ+IAUgB34gCCAJfiACIAp+IAMgDX4gADUCKCILIAR+Ig9C/////w+DfCISQv////8Pg3wiE0L/////D4N8IhZC/////w+DfCIXQv////8Pg0IBhiIaQv////8Pg3wiG0L/////D4MgEUIgiCAQQiCIfCAUQiCIfCAVQiCIfCAYQiCIfEIBhiAZQiCIfCAOQiCIfCAMQiCIfCIMQv////8Pg3wiDj4CKCABIAYgB34gBSAIfiAJIAp+IAIgDX4gAyALfiAEIAA1AiwiBH4iEEL/////D4N8IhFC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhhC/////w+DfCIZQv////8Pg0IBhiIcQv////8PgyASQiCIIA9CIIh8IBNCIIh8IBZCIIh8IBdCIIh8QgGGIBpCIIh8IBtCIIh8IA5CIIh8IAxCIIh8IgxC/////w+DfCIOPgIsIAEgByAHfiAGIAh+IAUgCn4gCSANfiACIAt+IAMgBH4iA0L/////D4N8Ig9C/////w+DfCISQv////8Pg3wiE0L/////D4N8IhZC/////w+DQgGGIhdC/////w+DfCIaQv////8PgyARQiCIIBBCIIh8IBRCIIh8IBVCIIh8IBhCIIh8IBlCIIh8QgGGIBxCIIh8IA5CIIh8IAxCIIh8IgxC/////w+DfCIOPgIwIAEgByAIfiAGIAp+IAUgDX4gCSALfiACIAR+IgJC/////w+DfCIQQv////8Pg3wiEUL/////D4N8IhRC/////w+DfCIVQv////8Pg0IBhiIYQv////8PgyAPQiCIIANCIIh8IBJCIIh8IBNCIIh8IBZCIIh8QgGGIBdCIIh8IBpCIIh8IA5CIIh8IAxCIIh8IgNC/////w+DfCIMPgI0IAEgCCAIfiAHIAp+IAYgDX4gBSALfiAEIAl+IglC/////w+DfCIOQv////8Pg3wiD0L/////D4N8IhJC/////w+DQgGGIhNC/////w+DfCIWQv////8PgyAQQiCIIAJCIIh8IBFCIIh8IBRCIIh8IBVCIIh8QgGGIBhCIIh8IAxCIIh8IANCIIh8IgNC/////w+DfCICPgI4IAEgCCAKfiAHIA1+IAYgC34gBCAFfiIFQv////8Pg3wiDEL/////D4N8IhBC/////w+DfCIRQv////8Pg0IBhiIUQv////8PgyAOQiCIIAlCIIh8IA9CIIh8IBJCIIh8QgGGIBNCIIh8IBZCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgI8IAEgCiAKfiAIIA1+IAcgC34gBCAGfiIJQv////8Pg3wiBkL/////D4N8Ig5C/////w+DQgGGIg9C/////w+DfCISQv////8PgyAMQiCIIAVCIIh8IBBCIIh8IBFCIIh8QgGGIBRCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgJAIAEgCiANfiAIIAt+IAQgB34iBUL/////D4N8IgdC/////w+DfCIMQv////8Pg0IBhiIQQv////8PgyAGQiCIIAlCIIh8IA5CIIh8QgGGIA9CIIh8IBJCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgJEIAEgDSANfiAKIAt+IAQgCH4iCUL/////D4N8IgZC/////w+DQgGGIghC/////w+DfCIOQv////8PgyAHQiCIIAVCIIh8IAxCIIh8QgGGIBBCIIh8IAJCIIh8IANCIIh8IgNC/////w+DfCICPgJIIAEgCyANfiAEIAp+IgVC/////w+DfCIHQv////8Pg0IBhiIKQv////8PgyAGQiCIIAlCIIh8QgGGIAhCIIh8IA5CIIh8IAJCIIh8IANCIIh8IgNC////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ACAANQJMIAJCIIh8QegFNQIAIAN+fCICPgJMIAAgADUCUCACQiCIfEHsBTUCACADfnwiAj4CUCAAIAA1AlQgAkIgiHxB8AU1AgAgA358IgI+AlQgACAANQJYIAJCIIh8QfQFNQIAIAN+fCIDPgJYQaQJIANCIIg+AgBB+AggAEEwaiABEA8L7TQBQ34gADUCACIGIAE1AgAiDX4iA0L/////D4NC/f/z/w9+Qv////8PgyIOQcgFNQIAIhB+IANC/////w+DfEIgiCADQiCIfCEKIAYgATUCCCIDfkHMBTUCACIFIA5+IAA1AgQiBCANfiAGIAE1AgQiB34gCkL/////D4N8IgtC/////w+DfCIMQv////8Pg3wiCEL/////D4NC/f/z/w9+Qv////8PgyIJIBB+IAhC/////w+DfEIgiCALQiCIIApCIIh8IAxCIIh8IAhCIIh8fCISQv////8Pg3whESADIAR+IAYgATUCDCIKfkHQBTUCACIIIA5+IAUgCX4gADUCCCILIA1+IAQgB34gEUL/////D4N8IhNC/////w+DfCIYQv////8Pg3wiFEL/////D4N8Ig9C/////w+DQv3/8/8PfkL/////D4MiDCAQfiAPQv////8Pg3xCIIggEUIgiCASQiCIfCATQiCIfCAYQiCIfCAUQiCIfCAPQiCIfHwiKUL/////D4N8IipC/////w+DfCEYIAMgC34gBCAKfiAGIAE1AhAiEX5B1AU1AgAiDyAOfiAIIAl+IAUgDH4gADUCDCISIA1+IAcgC34gGEL/////D4N8IiRC/////w+DfCIlQv////8Pg3wiK0L/////D4N8IixC/////w+DfCIUQv////8Pg0L9//P/D35C/////w+DIhMgEH4gFEL/////D4N8QiCIICpCIIggKUIgiHwgGEIgiHwgJEIgiHwgJUIgiHwgK0IgiHwgLEIgiHwgFEIgiHx8IitC/////w+DfCIsQv////8Pg3wiJkL/////D4N8ISQgAyASfiAKIAt+IAQgEX4gBiABNQIUIhh+QdgFNQIAIhQgDn4gCSAPfiAIIAx+IAUgE34gADUCECIpIA1+IAcgEn4gJEL/////D4N8IidC/////w+DfCItQv////8Pg3wiLkL/////D4N8IhlC/////w+DfCIaQv////8Pg3wiJUL/////D4NC/f/z/w9+Qv////8PgyIqIBB+ICVC/////w+DfEIgiCAsQiCIICtCIIh8ICZCIIh8ICRCIIh8ICdCIIh8IC1CIIh8IC5CIIh8IBlCIIh8IBpCIIh8ICVCIIh8fCItQv////8Pg3wiLkL/////D4N8IhlC/////w+DfCIaQv////8Pg3whJiADICl+IAogEn4gCyARfiAEIBh+IAYgATUCGCIkfkHcBTUCACIlIA5+IAkgFH4gDCAPfiAIIBN+IAUgKn4gADUCFCIrIA1+IAcgKX4gJkL/////D4N8Ii9C/////w+DfCIwQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIfQv////8Pg3wiIEL/////D4N8IidC/////w+DQv3/8/8PfkL/////D4MiLCAQfiAnQv////8Pg3xCIIggLkIgiCAtQiCIfCAZQiCIfCAaQiCIfCAmQiCIfCAvQiCIfCAwQiCIfCAbQiCIfCAcQiCIfCAfQiCIfCAgQiCIfCAnQiCIfHwiL0L/////D4N8IjBC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih9C/////w+DfCEZIAMgK34gCiApfiARIBJ+IAsgGH4gBCAkfiAGIAE1AhwiJn5B4AU1AgAiJyAOfiAJICV+IAwgFH4gDyATfiAIICp+IAUgLH4gADUCGCItIA1+IAcgK34gGUL/////D4N8IiBC/////w+DfCIdQv////8Pg3wiHkL/////D4N8IiFC/////w+DfCIiQv////8Pg3wiFUL/////D4N8IhZC/////w+DfCIaQv////8Pg0L9//P/D35C/////w+DIi4gEH4gGkL/////D4N8QiCIIDBCIIggL0IgiHwgG0IgiHwgHEIgiHwgH0IgiHwgGUIgiHwgIEIgiHwgHUIgiHwgHkIgiHwgIUIgiHwgIkIgiHwgFUIgiHwgFkIgiHwgGkIgiHx8Ih9C/////w+DfCIgQv////8Pg3wiHUL/////D4N8Ih5C/////w+DfCIhQv////8Pg3wiIkL/////D4N8IRsgAyAtfiAKICt+IBEgKX4gEiAYfiALICR+IAQgJn4gBiABNQIgIhl+QeQFNQIAIhogDn4gCSAnfiAMICV+IBMgFH4gDyAqfiAIICx+IAUgLn4gADUCHCIvIA1+IAcgLX4gG0L/////D4N8IhVC/////w+DfCIWQv////8Pg3wiI0L/////D4N8IhdC/////w+DfCIoQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiHEL/////D4NC/f/z/w9+Qv////8PgyIwIBB+IBxC/////w+DfEIgiCAgQiCIIB9CIIh8IB1CIIh8IB5CIIh8ICFCIIh8ICJCIIh8IBtCIIh8IBVCIIh8IBZCIIh8ICNCIIh8IBdCIIh8IChCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IBxCIIh8fCIhQv////8Pg3wiIkL/////D4N8IhVC/////w+DfCIWQv////8Pg3wiI0L/////D4N8IhdC/////w+DfCIoQv////8Pg3whHSADIC9+IAogLX4gESArfiAYICl+IBIgJH4gCyAmfiAEIBl+IAYgATUCJCIbfkHoBTUCACIcIA5+IAkgGn4gDCAnfiATICV+IBQgKn4gDyAsfiAIIC5+IAUgMH4gADUCICIfIA1+IAcgL34gHUL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1Qv////8Pg3wiNkL/////D4N8IjdC/////w+DfCI4Qv////8Pg3wiOUL/////D4N8Ih5C/////w+DQv3/8/8PfkL/////D4MiICAQfiAeQv////8Pg3xCIIggIkIgiCAhQiCIfCAVQiCIfCAWQiCIfCAjQiCIfCAXQiCIfCAoQiCIfCAdQiCIfCAxQiCIfCAyQiCIfCAzQiCIfCA0QiCIfCA1QiCIfCA2QiCIfCA3QiCIfCA4QiCIfCA5QiCIfCAeQiCIfHwiI0L/////D4N8IhdC/////w+DfCIoQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCEVIAMgH34gCiAvfiARIC1+IBggK34gJCApfiASICZ+IAsgGX4gBCAbfiAGIAE1AigiHX5B7AU1AgAiHiAOfiAJIBx+IAwgGn4gEyAnfiAlICp+IBQgLH4gDyAufiAIIDB+IAUgIH4gADUCJCIhIA1+IAcgH34gFUL/////D4N8IjZC/////w+DfCI3Qv////8Pg3wiOEL/////D4N8IjlC/////w+DfCI6Qv////8Pg3wiO0L/////D4N8IjxC/////w+DfCI9Qv////8Pg3wiPkL/////D4N8Ij9C/////w+DfCIWQv////8Pg0L9//P/D35C/////w+DIiIgEH4gFkL/////D4N8QiCIIBdCIIggI0IgiHwgKEIgiHwgMUIgiHwgMkIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgFUIgiHwgNkIgiHwgN0IgiHwgOEIgiHwgOUIgiHwgOkIgiHwgO0IgiHwgPEIgiHwgPUIgiHwgPkIgiHwgP0IgiHwgFkIgiHx8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1Qv////8Pg3wiNkL/////D4N8IjdC/////w+DfCI4Qv////8Pg3wiOUL/////D4N8IRcgAyAhfiAKIB9+IBEgL34gGCAtfiAkICt+ICYgKX4gEiAZfiALIBt+IAQgHX4gBiABNQIsIhV+QfAFNQIAIgYgDn4gCSAefiAMIBx+IBMgGn4gJyAqfiAlICx+IBQgLn4gDyAwfiAIICB+IAUgIn4gADUCKCIWIA1+IAcgIX4gF0L/////D4N8IjpC/////w+DfCI7Qv////8Pg3wiPEL/////D4N8Ij1C/////w+DfCI+Qv////8Pg3wiP0L/////D4N8IkBC/////w+DfCJBQv////8Pg3wiQkL/////D4N8IkNC/////w+DfCJEQv////8Pg3wiKEL/////D4NC/f/z/w9+Qv////8PgyIjIBB+IChC/////w+DfEIgiCAyQiCIIDFCIIh8IDNCIIh8IDRCIIh8IDVCIIh8IDZCIIh8IDdCIIh8IDhCIIh8IDlCIIh8IBdCIIh8IDpCIIh8IDtCIIh8IDxCIIh8ID1CIIh8ID5CIIh8ID9CIIh8IEBCIIh8IEFCIIh8IEJCIIh8IENCIIh8IERCIIh8IChCIIh8fCIoQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCI2Qv////8Pg3wiN0L/////D4N8IjhC/////w+DfCI5Qv////8Pg3whFyADIBZ+IAogIX4gESAffiAYIC9+ICQgLX4gJiArfiAZICl+IBIgG34gCyAdfiAEIBV+IBAgDkH0BTUCACIOfiAGIAl+IAwgHn4gEyAcfiAaICp+ICcgLH4gJSAufiAUIDB+IA8gIH4gCCAifiAFICN+IA0gADUCLCINfiAHIBZ+IBdC/////w+DfCI6Qv////8Pg3wiO0L/////D4N8IjxC/////w+DfCI9Qv////8Pg3wiPkL/////D4N8Ij9C/////w+DfCJAQv////8Pg3wiQUL/////D4N8IkJC/////w+DfCJDQv////8Pg3wiREL/////D4N8IkVC/////w+DfCIEQv////8Pg0L9//P/D35C/////w+DIhB+IARC/////w+DfEIgiCAxQiCIIChCIIh8IDJCIIh8IDNCIIh8IDRCIIh8IDVCIIh8IDZCIIh8IDdCIIh8IDhCIIh8IDlCIIh8IBdCIIh8IDpCIIh8IDtCIIh8IDxCIIh8ID1CIIh8ID5CIIh8ID9CIIh8IEBCIIh8IEFCIIh8IEJCIIh8IENCIIh8IERCIIh8IEVCIIh8IARCIIh8fCIXQv////8Pg3wiKEL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1Qv////8Pg3wiNkL/////D4N8IjdC/////w+DfCI4Qv////8Pg3whBCAJIA5+IAYgDH4gEyAefiAcICp+IBogLH4gJyAufiAlIDB+IBQgIH4gDyAifiAIICN+IAUgEH4gByANfiAEQv////8Pg3wiBUL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiOUL/////D4N8IjpC/////w+DfCI7Qv////8Pg3wiPEL/////D4N8Ij1C/////w+DfCI+Qv////8Pg3wiP0L/////D4N8IkBC/////w+DfCJBQiCIIChCIIggF0IgiHwgMUIgiHwgMkIgiHwgM0IgiHwgNEIgiHwgNUIgiHwgNkIgiHwgN0IgiHwgOEIgiHwgBEIgiHwgBUIgiHwgB0IgiHwgCUIgiHwgOUIgiHwgOkIgiHwgO0IgiHwgPEIgiHwgPUIgiHwgPkIgiHwgP0IgiHwgQEIgiHx8IQUgAiBBPgIAIAwgDn4gBiATfiAeICp+IBwgLH4gGiAufiAnIDB+ICAgJX4gFCAifiAPICN+IAggEH4gAyANfiAKIBZ+IBEgIX4gGCAffiAkIC9+ICYgLX4gGSArfiAbICl+IBIgHX4gCyAVfiAFQv////8Pg3wiA0L/////D4N8IgRC/////w+DfCIHQv////8Pg3wiCUL/////D4N8IghC/////w+DfCILQv////8Pg3wiDEL/////D4N8IhdC/////w+DfCIoQv////8Pg3wiMUL/////D4N8IjJC/////w+DfCIzQv////8Pg3wiNEL/////D4N8IjVC/////w+DfCI2Qv////8Pg3wiN0L/////D4N8IjhC/////w+DfCI5Qv////8Pg3wiOkL/////D4N8IjtCIIggA0IgiCAFQiCIfCAEQiCIfCAHQiCIfCAJQiCIfCAIQiCIfCALQiCIfCAMQiCIfCAXQiCIfCAoQiCIfCAxQiCIfCAyQiCIfCAzQiCIfCA0QiCIfCA1QiCIfCA2QiCIfCA3QiCIfCA4QiCIfCA5QiCIfCA6QiCIfHwhAyACIDs+AgQgDiATfiAGICp+IB4gLH4gHCAufiAaIDB+ICAgJ34gIiAlfiAUICN+IA8gEH4gCiANfiARIBZ+IBggIX4gHyAkfiAmIC9+IBkgLX4gGyArfiAdICl+IBIgFX4gA0L/////D4N8IgVC/////w+DfCIEQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiCEL/////D4N8IgtC/////w+DfCIMQv////8Pg3wiD0L/////D4N8IhJC/////w+DfCITQv////8Pg3wiF0L/////D4N8IihC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUIgiCAFQiCIIANCIIh8IARCIIh8IAdCIIh8IAlCIIh8IApCIIh8IAhCIIh8IAtCIIh8IAxCIIh8IA9CIIh8IBJCIIh8IBNCIIh8IBdCIIh8IChCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IDRCIIh8fCEDIAIgNT4CCCAOICp+IAYgLH4gHiAufiAcIDB+IBogIH4gIiAnfiAjICV+IBAgFH4gDSARfiAWIBh+ICEgJH4gHyAmfiAZIC9+IBsgLX4gHSArfiAVICl+IANC/////w+DfCIFQv////8Pg3wiBEL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IghC/////w+DfCILQv////8Pg3wiDEL/////D4N8IhFC/////w+DfCIPQv////8Pg3wiEkL/////D4N8IhNC/////w+DfCIUQv////8Pg3wiKUL/////D4N8IipC/////w+DfCIXQiCIIAVCIIggA0IgiHwgBEIgiHwgB0IgiHwgCUIgiHwgCkIgiHwgCEIgiHwgC0IgiHwgDEIgiHwgEUIgiHwgD0IgiHwgEkIgiHwgE0IgiHwgFEIgiHwgKUIgiHwgKkIgiHx8IQMgAiAXPgIMIA4gLH4gBiAufiAeIDB+IBwgIH4gGiAifiAjICd+IBAgJX4gDSAYfiAWICR+ICEgJn4gGSAffiAbIC9+IB0gLX4gFSArfiADQv////8Pg3wiBUL/////D4N8IgRC/////w+DfCIHQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCIIQv////8Pg3wiC0L/////D4N8IgxC/////w+DfCIRQv////8Pg3wiD0L/////D4N8IhJC/////w+DfCITQv////8Pg3wiGEL/////D4N8IhRCIIggBUIgiCADQiCIfCAEQiCIfCAHQiCIfCAJQiCIfCAKQiCIfCAIQiCIfCALQiCIfCAMQiCIfCARQiCIfCAPQiCIfCASQiCIfCATQiCIfCAYQiCIfHwhAyACIBQ+AhAgDiAufiAGIDB+IB4gIH4gHCAifiAaICN+IBAgJ34gDSAkfiAWICZ+IBkgIX4gGyAffiAdIC9+IBUgLX4gA0L/////D4N8IgVC/////w+DfCIEQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiCEL/////D4N8IgtC/////w+DfCIMQv////8Pg3wiEUL/////D4N8Ig9C/////w+DfCISQv////8Pg3wiE0IgiCAFQiCIIANCIIh8IARCIIh8IAdCIIh8IAlCIIh8IApCIIh8IAhCIIh8IAtCIIh8IAxCIIh8IBFCIIh8IA9CIIh8IBJCIIh8fCEDIAIgEz4CFCAOIDB+IAYgIH4gHiAifiAcICN+IBAgGn4gDSAmfiAWIBl+IBsgIX4gHSAffiAVIC9+IANC/////w+DfCIFQv////8Pg3wiBEL/////D4N8IgdC/////w+DfCIJQv////8Pg3wiCkL/////D4N8IghC/////w+DfCILQv////8Pg3wiDEL/////D4N8IhFC/////w+DfCIPQiCIIAVCIIggA0IgiHwgBEIgiHwgB0IgiHwgCUIgiHwgCkIgiHwgCEIgiHwgC0IgiHwgDEIgiHwgEUIgiHx8IQMgAiAPPgIYIA4gIH4gBiAifiAeICN+IBAgHH4gDSAZfiAWIBt+IB0gIX4gFSAffiADQv////8Pg3wiBUL/////D4N8IgRC/////w+DfCIHQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCIIQv////8Pg3wiC0L/////D4N8IgxCIIggBUIgiCADQiCIfCAEQiCIfCAHQiCIfCAJQiCIfCAKQiCIfCAIQiCIfCALQiCIfHwhAyACIAw+AhwgDiAifiAGICN+IBAgHn4gDSAbfiAWIB1+IBUgIX4gA0L/////D4N8IgVC/////w+DfCIEQv////8Pg3wiB0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiCEIgiCAFQiCIIANCIIh8IARCIIh8IAdCIIh8IAlCIIh8IApCIIh8fCEDIAIgCD4CICAOICN+IAYgEH4gDSAdfiAVIBZ+IANC/////w+DfCIGQv////8Pg3wiBUL/////D4N8IgRC/////w+DfCIHQiCIIAZCIIggA0IgiHwgBUIgiHwgBEIgiHx8IQYgAiAHPgIkIA4gEH4gDSAVfiAGQv////8Pg3wiDUL/////D4N8Ig5CIIggDUIgiCAGQiCIfHwhBiACIA4+AiggAiAGPgIsIAZCIIinBEAgAkHIBSACEAcaBSACQcgFEAUEQCACQcgFIAIQBxoLCwu0LwE1fiAANQIAIgogCn4iAkL/////D4NC/f/z/w9+Qv////8PgyIPQcgFNQIAIhB+IAJC/////w+DfEIgiCACQiCIfCEEQcwFNQIAIg0gD34gADUCBCICIAp+IgVC/////w+DQgGGIgZC/////w+DIARC/////w+DfCIHQv////8Pg3wiA0L/////D4NC/f/z/w9+Qv////8PgyIOIBB+IANC/////w+DfEIgiCAFQiCIQgGGIAZCIIh8IAdCIIh8IARCIIh8IANCIIh8fCEDQdAFNQIAIhEgD34gDSAOfiACIAJ+IAA1AggiBCAKfiIGQv////8Pg0IBhiIHQv////8Pg3wiC0L/////D4MgA0L/////D4N8IghC/////w+DfCIJQv////8Pg3wiBUL/////D4NC/f/z/w9+Qv////8PgyITIBB+IAVC/////w+DfEIgiCAGQiCIQgGGIAdCIIh8IAtCIIh8IAhCIIh8IANCIIh8IAlCIIh8IAVCIIh8fCEFQdQFNQIAIhUgD34gDiARfiANIBN+IAIgBH4gADUCDCIDIAp+IgdC/////w+DfCILQv////8Pg0IBhiIIQv////8PgyAFQv////8Pg3wiCUL/////D4N8IgxC/////w+DfCIYQv////8Pg3wiBkL/////D4NC/f/z/w9+Qv////8PgyIZIBB+IAZC/////w+DfEIgiCALQiCIIAdCIIh8QgGGIAhCIIh8IAlCIIh8IAVCIIh8IAxCIIh8IBhCIIh8IAZCIIh8fCEGQdgFNQIAIhggD34gDiAVfiARIBN+IA0gGX4gBCAEfiACIAN+IAA1AhAiBSAKfiILQv////8Pg3wiCEL/////D4NCAYYiCUL/////D4N8IgxC/////w+DIAZC/////w+DfCIaQv////8Pg3wiIEL/////D4N8IiFC/////w+DfCIiQv////8Pg3wiB0L/////D4NC/f/z/w9+Qv////8PgyIjIBB+IAdC/////w+DfEIgiCAIQiCIIAtCIIh8QgGGIAlCIIh8IAxCIIh8IBpCIIh8IAZCIIh8ICBCIIh8ICFCIIh8ICJCIIh8IAdCIIh8fCEHQdwFNQIAIhogD34gDiAYfiATIBV+IBEgGX4gDSAjfiADIAR+IAIgBX4gADUCFCIGIAp+IghC/////w+DfCIJQv////8Pg3wiDEL/////D4NCAYYiIUL/////D4MgB0L/////D4N8IiJC/////w+DfCIkQv////8Pg3wiJUL/////D4N8IhtC/////w+DfCIcQv////8Pg3wiC0L/////D4NC/f/z/w9+Qv////8PgyIgIBB+IAtC/////w+DfEIgiCAJQiCIIAhCIIh8IAxCIIh8QgGGICFCIIh8ICJCIIh8IAdCIIh8ICRCIIh8ICVCIIh8IBtCIIh8IBxCIIh8IAtCIIh8fCELQeAFNQIAIiEgD34gDiAafiATIBh+IBUgGX4gESAjfiANICB+IAMgA34gBCAFfiACIAZ+IAA1AhgiByAKfiIJQv////8Pg3wiDEL/////D4N8IiRC/////w+DQgGGIiVC/////w+DfCIbQv////8PgyALQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiFEL/////D4N8IhZC/////w+DfCISQv////8Pg3wiCEL/////D4NC/f/z/w9+Qv////8PgyIiIBB+IAhC/////w+DfEIgiCAMQiCIIAlCIIh8ICRCIIh8QgGGICVCIIh8IBtCIIh8IBxCIIh8IAtCIIh8IB1CIIh8IB5CIIh8IBRCIIh8IBZCIIh8IBJCIIh8IAhCIIh8fCEIQeQFNQIAIiQgD34gDiAhfiATIBp+IBggGX4gFSAjfiARICB+IA0gIn4gAyAFfiAEIAZ+IAIgB34gADUCHCILIAp+IgxC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DQgGGIh5C/////w+DIAhC/////w+DfCIUQv////8Pg3wiFkL/////D4N8IhJC/////w+DfCIXQv////8Pg3wiH0L/////D4N8IiZC/////w+DfCInQv////8Pg3wiCUL/////D4NC/f/z/w9+Qv////8PgyIlIBB+IAlC/////w+DfEIgiCAbQiCIIAxCIIh8IBxCIIh8IB1CIIh8QgGGIB5CIIh8IBRCIIh8IAhCIIh8IBZCIIh8IBJCIIh8IBdCIIh8IB9CIIh8ICZCIIh8ICdCIIh8IAlCIIh8fCEJQegFNQIAIhsgD34gDiAkfiATICF+IBkgGn4gGCAjfiAVICB+IBEgIn4gDSAlfiAFIAV+IAMgBn4gBCAHfiACIAt+IAA1AiAiCCAKfiIdQv////8Pg3wiHkL/////D4N8IhRC/////w+DfCIWQv////8Pg0IBhiISQv////8Pg3wiF0L/////D4MgCUL/////D4N8Ih9C/////w+DfCImQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiDEL/////D4NC/f/z/w9+Qv////8PgyIcIBB+IAxC/////w+DfEIgiCAeQiCIIB1CIIh8IBRCIIh8IBZCIIh8QgGGIBJCIIh8IBdCIIh8IB9CIIh8IAlCIIh8ICZCIIh8ICdCIIh8IChCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IAxCIIh8fCEMQewFNQIAIh0gD34gDiAbfiATICR+IBkgIX4gGiAjfiAYICB+IBUgIn4gESAlfiANIBx+IAUgBn4gAyAHfiAEIAt+IAIgCH4gADUCJCIJIAp+IhZC/////w+DfCISQv////8Pg3wiF0L/////D4N8Ih9C/////w+DfCImQv////8Pg0IBhiInQv////8PgyAMQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg3wiK0L/////D4N8IixC/////w+DfCItQv////8Pg3wiLkL/////D4N8Ii9C/////w+DfCIwQv////8Pg3wiFEL/////D4NC/f/z/w9+Qv////8PgyIeIBB+IBRC/////w+DfEIgiCASQiCIIBZCIIh8IBdCIIh8IB9CIIh8ICZCIIh8QgGGICdCIIh8IChCIIh8IAxCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IC1CIIh8IC5CIIh8IC9CIIh8IDBCIIh8IBRCIIh8fCESQfAFNQIAIhQgD34gDiAdfiATIBt+IBkgJH4gISAjfiAaICB+IBggIn4gFSAlfiARIBx+IA0gHn4gBiAGfiAFIAd+IAMgC34gBCAIfiACIAl+IAA1AigiDCAKfiIfQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUL/////D4NCAYYiKkL/////D4N8IitC/////w+DIBJC/////w+DfCIsQv////8Pg3wiLUL/////D4N8Ii5C/////w+DfCIvQv////8Pg3wiMEL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiM0L/////D4N8IjRC/////w+DfCI1Qv////8Pg3wiF0L/////D4NC/f/z/w9+Qv////8PgyIWIBB+IBdC/////w+DfEIgiCAmQiCIIB9CIIh8ICdCIIh8IChCIIh8IClCIIh8QgGGICpCIIh8ICtCIIh8ICxCIIh8IBJCIIh8IC1CIIh8IC5CIIh8IC9CIIh8IDBCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IDRCIIh8IDVCIIh8IBdCIIh8fCESIBAgD0H0BTUCACIPfiAOIBR+IBMgHX4gGSAbfiAjICR+ICAgIX4gGiAifiAYICV+IBUgHH4gESAefiANIBZ+IAYgB34gBSALfiADIAh+IAQgCX4gAiAMfiAKIAA1AiwiCn4iH0L/////D4N8IiZC/////w+DfCInQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg0IBhiIrQv////8PgyASQv////8Pg3wiLEL/////D4N8Ii1C/////w+DfCIuQv////8Pg3wiL0L/////D4N8IjBC/////w+DfCIxQv////8Pg3wiMkL/////D4N8IjNC/////w+DfCI0Qv////8Pg3wiNUL/////D4N8IjZC/////w+DfCIXQv////8Pg0L9//P/D35C/////w+DIhB+IBdC/////w+DfEIgiCAmQiCIIB9CIIh8ICdCIIh8IChCIIh8IClCIIh8ICpCIIh8QgGGICtCIIh8ICxCIIh8IBJCIIh8IC1CIIh8IC5CIIh8IC9CIIh8IDBCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IDRCIIh8IDVCIIh8IDZCIIh8IBdCIIh8fCESIAEgDiAPfiATIBR+IBkgHX4gGyAjfiAgICR+ICEgIn4gGiAlfiAYIBx+IBUgHn4gESAWfiANIBB+IAcgB34gBiALfiAFIAh+IAMgCX4gBCAMfiACIAp+IgJC/////w+DfCINQv////8Pg3wiDkL/////D4N8IhdC/////w+DfCIfQv////8Pg0IBhiImQv////8Pg3wiJ0L/////D4MgEkL/////D4N8IihC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiLUL/////D4N8Ii5C/////w+DfCIvQv////8Pg3wiMEL/////D4N8IjFC/////w+DfCIyQv////8Pg3wiMz4CACABIA8gE34gFCAZfiAdICN+IBsgIH4gIiAkfiAhICV+IBogHH4gGCAefiAVIBZ+IBAgEX4gByALfiAGIAh+IAUgCX4gAyAMfiAEIAp+IgRC/////w+DfCIRQv////8Pg3wiE0L/////D4N8IjRC/////w+DfCI1Qv////8Pg0IBhiI2Qv////8PgyANQiCIIAJCIIh8IA5CIIh8IBdCIIh8IB9CIIh8QgGGICZCIIh8ICdCIIh8IChCIIh8IBJCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IC1CIIh8IC5CIIh8IC9CIIh8IDBCIIh8IDFCIIh8IDJCIIh8IDNCIIh8IgJC/////w+DfCINQv////8Pg3wiDkL/////D4N8IhJC/////w+DfCIXQv////8Pg3wiH0L/////D4N8IiZC/////w+DfCInQv////8Pg3wiKEL/////D4N8IilC/////w+DfCIqQv////8Pg3wiKz4CBCABIA8gGX4gFCAjfiAdICB+IBsgIn4gJCAlfiAcICF+IBogHn4gFiAYfiAQIBV+IAsgC34gByAIfiAGIAl+IAUgDH4gAyAKfiIDQv////8Pg3wiFUL/////D4N8IhlC/////w+DfCIsQv////8Pg0IBhiItQv////8Pg3wiLkL/////D4MgEUIgiCAEQiCIfCATQiCIfCA0QiCIfCA1QiCIfEIBhiA2QiCIfCANQiCIfCACQiCIfCAOQiCIfCASQiCIfCAXQiCIfCAfQiCIfCAmQiCIfCAnQiCIfCAoQiCIfCApQiCIfCAqQiCIfCArQiCIfCICQv////8Pg3wiBEL/////D4N8Ig1C/////w+DfCIOQv////8Pg3wiEUL/////D4N8IhNC/////w+DfCISQv////8Pg3wiF0L/////D4N8Ih9C/////w+DfCImQv////8Pg3wiJz4CCCABIA8gI34gFCAgfiAdICJ+IBsgJX4gHCAkfiAeICF+IBYgGn4gECAYfiAIIAt+IAcgCX4gBiAMfiAFIAp+IgVC/////w+DfCIYQv////8Pg3wiI0L/////D4N8IihC/////w+DQgGGIilC/////w+DIBVCIIggA0IgiHwgGUIgiHwgLEIgiHxCAYYgLUIgiHwgLkIgiHwgBEIgiHwgAkIgiHwgDUIgiHwgDkIgiHwgEUIgiHwgE0IgiHwgEkIgiHwgF0IgiHwgH0IgiHwgJkIgiHwgJ0IgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiDUL/////D4N8Ig5C/////w+DfCIRQv////8Pg3wiE0L/////D4N8IhVC/////w+DfCIZQv////8Pg3wiEj4CDCABIA8gIH4gFCAifiAdICV+IBsgHH4gHiAkfiAWICF+IBAgGn4gCCAIfiAJIAt+IAcgDH4gBiAKfiIGQv////8Pg3wiGkL/////D4N8IiBC/////w+DQgGGIhdC/////w+DfCIfQv////8PgyAYQiCIIAVCIIh8ICNCIIh8IChCIIh8QgGGIClCIIh8IARCIIh8IAJCIIh8IANCIIh8IA1CIIh8IA5CIIh8IBFCIIh8IBNCIIh8IBVCIIh8IBlCIIh8IBJCIIh8IgJC/////w+DfCIEQv////8Pg3wiA0L/////D4N8IgVC/////w+DfCINQv////8Pg3wiDkL/////D4N8IhFC/////w+DfCITQv////8Pg3wiFT4CECABIA8gIn4gFCAlfiAcIB1+IBsgHn4gFiAkfiAQICF+IAggCX4gCyAMfiAHIAp+IgdC/////w+DfCIZQv////8Pg3wiGEL/////D4NCAYYiI0L/////D4MgGkIgiCAGQiCIfCAgQiCIfEIBhiAXQiCIfCAfQiCIfCAEQiCIfCACQiCIfCADQiCIfCAFQiCIfCANQiCIfCAOQiCIfCARQiCIfCATQiCIfCAVQiCIfCICQv////8Pg3wiBEL/////D4N8IgNC/////w+DfCIFQv////8Pg3wiBkL/////D4N8Ig1C/////w+DfCIOQv////8Pg3wiET4CFCABIA8gJX4gFCAcfiAdIB5+IBYgG34gECAkfiAJIAl+IAggDH4gCiALfiILQv////8Pg3wiE0L/////D4NCAYYiFUL/////D4N8IhpC/////w+DIBlCIIggB0IgiHwgGEIgiHxCAYYgI0IgiHwgBEIgiHwgAkIgiHwgA0IgiHwgBUIgiHwgBkIgiHwgDUIgiHwgDkIgiHwgEUIgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiBUL/////D4N8IgZC/////w+DfCIHQv////8Pg3wiDT4CGCABIA8gHH4gFCAefiAWIB1+IBAgG34gCSAMfiAIIAp+IghC/////w+DfCIOQv////8Pg0IBhiIRQv////8PgyATQiCIIAtCIIh8QgGGIBVCIIh8IBpCIIh8IARCIIh8IAJCIIh8IANCIIh8IAVCIIh8IAZCIIh8IAdCIIh8IA1CIIh8IgJC/////w+DfCIEQv////8Pg3wiA0L/////D4N8IgVC/////w+DfCIGQv////8Pg3wiBz4CHCABIA8gHn4gFCAWfiAQIB1+IAwgDH4gCSAKfiILQv////8Pg0IBhiIJQv////8Pg3wiDUL/////D4MgDkIgiCAIQiCIfEIBhiARQiCIfCAEQiCIfCACQiCIfCADQiCIfCAFQiCIfCAGQiCIfCAHQiCIfCICQv////8Pg3wiBEL/////D4N8IgNC/////w+DfCIFQv////8Pg3wiBj4CICABIA8gFn4gECAUfiAKIAx+IgdC/////w+DQgGGIghC/////w+DIAtCIIhCAYYgCUIgiHwgDUIgiHwgBEIgiHwgAkIgiHwgA0IgiHwgBUIgiHwgBkIgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiBT4CJCABIA8gEH4gCiAKfiIKQv////8PgyAHQiCIQgGGIAhCIIh8IARCIIh8IAJCIIh8IANCIIh8IAVCIIh8IgJC/////w+DfCIEQv////8Pg3wiAz4CKCABIARCIIggCkIgiHwgAkIgiHwgA0IgiHwiCj4CLCAKQiCIpwRAIAFByAUgARAHGgUgAUHIBRAFBEAgAUHIBSABEAcaCwsLCgAgACAAIAEQEwsLACAAQfgFIAEQEwsVACAAQfgREABBqBIQAUH4ESABEBILEQAgAEHYEhAXQdgSQbgHEAULIwAgABACBEBBAA8LIABBiBMQF0GIE0G4BxAFBEBBfw8LQQELFwAgACABEBcgAUHIBSABEA0gASABEBYLCQBBqAYgABAAC7wBAQJ/IAIQAUEwIQMDQCABIANPBEAgA0EwRgRAQbgTEBsFQbgTQfgFQbgTEBMLIABBuBNB6BMQEyACQegTIAIQDyAAQTBqIQAgA0EwaiEDDAELCyABQTBwIgRFBEAPC0HoExABQQAhAQNAIAEgBEZFBEAgASAALQAAOgDoEyAAQQFqIQAgAUEBaiEBDAELCyADQTBGBEBBuBMQGwVBuBNB+AVBuBMQEwtB6BNBuBNB6BMQEyACQegTIAIQDwscACABIAJBmBQQHEGYFEGYFBAWIABBmBQgAxATC+ABAQJ/QQBBACgCACIFIAJBAWpBMGxqNgIAIAUQGyAFQTBqIQUDQCACIAZHBEAgABACBEAgBUEwayAFEAAFIAAgBUEwayAFEBMLIAAgAWohACAFQTBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBMGsiBSAFEBoDQCAGBEAgABACBEAgBSAFQTBrEAAgAhABBSAFQTBrIgNByBQQACAFIAAgAxATIAVByBQgAhATCyAAIAFrIQAgAiAEayECIAVBMGshBSAGQQFrIQYMAQsLQQAgBTYCAAstAQF/A0AgASADRkUEQCAAIAIQFiAAQTBqIQAgAkEwaiECIANBAWohAwwBCwsLLQEBfwNAIAEgA0ZFBEAgACACEBcgAEEwaiEAIAJBMGohAiADQQFqIQMMAQsLC5cCACACRQRAIAMQGw8LIABB+BQQACADEBsDQCACQQFrIgIgAWotAAAhACADIAMQFCAAQYABTwRAIANB+BQgAxATIABBgAFrIQALIAMgAxAUIABBwABPBEAgA0H4FCADEBMgAEFAaiEACyADIAMQFCAAQSBPBEAgA0H4FCADEBMgAEEgayEACyADIAMQFCAAQRBPBEAgA0H4FCADEBMgAEEQayEACyADIAMQFCAAQQhPBEAgA0H4FCADEBMgAEEIayEACyADIAMQFCAAQQRPBEAgA0H4FCADEBMgAEEEayEACyADIAMQFCAAQQJPBEAgA0H4FCADEBMgAEECayEACyADIAMQFCAABEAgA0H4FCADEBMLIAINAAsL1QEBAX8gABACBEAgARABDwtBASECQZgIQagVEAAgAEHoB0EwQdgVECEgAEHICEEwQYgWECEDQEHYFUGoBhAERQRAQdgVQbgWEBRBASEAA0BBuBZBqAYQBEUEQEG4FkG4FhAUIABBAWohAAwBCwtBqBVB6BYQACACIABrQQFrIQIDQCACBEBB6BZB6BYQFCACQQFrIQIMAQsLIAAhAkHoFkGoFRAUQdgVQagVQdgVEBNBiBZB6BZBiBYQEwwBCwtBiBYQGARAQYgWIAEQEQVBiBYgARAACwsgACAAEAIEQEEBDwsgAEGIB0EwQZgXECFBmBdBqAYQBAsqACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxgLHgAgAEIANwMAIABCADcDCCAAQgA3AxAgAEIANwMYCywAIAApAxhQBH4gACkDEFAEfiAAKQMIUAR+IAApAwAFQgELBUIBCwVCAQtQCx4AIABCATcDACAAQgA3AwggAEIANwMQIABCADcDGAtAACAAKQMYIAEpAxhRBH8gACkDECABKQMQUQR/IAApAwggASkDCFEEfyAAKQMAIAEpAwBRBUEACwVBAAsFQQALC3MAIAApAxggASkDGFQEf0EABSAAKQMYIAEpAxhWBH9BAQUgACkDECABKQMQVAR/QQAFIAApAxAgASkDEFYEf0EBBSAAKQMIIAEpAwhUBH9BAAUgACkDCCABKQMIVgR/QQEFIAApAwAgASkDAFoLCwsLCwsLxAEBAX4gAiAANQIAIAE1AgB8IgM+AgAgAiAANQIEIAE1AgR8IANCIIh8IgM+AgQgAiAANQIIIAE1Agh8IANCIIh8IgM+AgggAiAANQIMIAE1Agx8IANCIIh8IgM+AgwgAiAANQIQIAE1AhB8IANCIIh8IgM+AhAgAiAANQIUIAE1AhR8IANCIIh8IgM+AhQgAiAANQIYIAE1Ahh8IANCIIh8IgM+AhggAiAANQIcIAE1Ahx8IANCIIh8IgM+AhwgA0IgiKcL/AEBAX4gAiAANQIAIAE1AgB9IgNC/////w+DPgIAIAIgADUCBCABNQIEfSADQiCHfCIDQv////8Pgz4CBCACIAA1AgggATUCCH0gA0Igh3wiA0L/////D4M+AgggAiAANQIMIAE1Agx9IANCIId8IgNC/////w+DPgIMIAIgADUCECABNQIQfSADQiCHfCIDQv////8Pgz4CECACIAA1AhQgATUCFH0gA0Igh3wiA0L/////D4M+AhQgAiAANQIYIAE1Ahh9IANCIId8IgNC/////w+DPgIYIAIgADUCHCABNQIcfSADQiCHfCIDQv////8Pgz4CHCADQiCHpwvdDAEXfiAANQIAIgMgATUCACIHfiIEQiCIIQYgAiAEPgIAIAA1AgQiBCAHfiADIAE1AgQiBX4gBkL/////D4N8IghC/////w+DfCIPQiCIIAhCIIggBkIgiHx8IQsgAiAPPgIEIAA1AggiBiAHfiAEIAV+IAMgATUCCCIIfiALQv////8Pg3wiD0L/////D4N8IgxC/////w+DfCIQQiCIIA9CIIggC0IgiHwgDEIgiHx8IQwgAiAQPgIIIAA1AgwiCyAHfiAFIAZ+IAQgCH4gAyABNQIMIg9+IAxC/////w+DfCIQQv////8Pg3wiDUL/////D4N8IhFC/////w+DfCIJQiCIIBBCIIggDEIgiHwgDUIgiHwgEUIgiHx8IQ0gAiAJPgIMIAA1AhAiDCAHfiAFIAt+IAYgCH4gBCAPfiADIAE1AhAiEH4gDUL/////D4N8IhFC/////w+DfCIJQv////8Pg3wiEkL/////D4N8IgpC/////w+DfCIOQiCIIBFCIIggDUIgiHwgCUIgiHwgEkIgiHwgCkIgiHx8IQkgAiAOPgIQIAA1AhQiDSAHfiAFIAx+IAggC34gBiAPfiAEIBB+IAMgATUCFCIRfiAJQv////8Pg3wiEkL/////D4N8IgpC/////w+DfCIOQv////8Pg3wiE0L/////D4N8IhRC/////w+DfCIVQiCIIBJCIIggCUIgiHwgCkIgiHwgDkIgiHwgE0IgiHwgFEIgiHx8IQogAiAVPgIUIAA1AhgiCSAHfiAFIA1+IAggDH4gCyAPfiAGIBB+IAQgEX4gAyABNQIYIhJ+IApC/////w+DfCIOQv////8Pg3wiE0L/////D4N8IhRC/////w+DfCIVQv////8Pg3wiFkL/////D4N8IhdC/////w+DfCIYQiCIIA5CIIggCkIgiHwgE0IgiHwgFEIgiHwgFUIgiHwgFkIgiHwgF0IgiHx8IQ4gAiAYPgIYIAcgADUCHCIHfiAFIAl+IAggDX4gDCAPfiALIBB+IAYgEX4gBCASfiADIAE1AhwiCn4gDkL/////D4N8IgNC/////w+DfCITQv////8Pg3wiFEL/////D4N8IhVC/////w+DfCIWQv////8Pg3wiF0L/////D4N8IhhC/////w+DfCIZQiCIIANCIIggDkIgiHwgE0IgiHwgFEIgiHwgFUIgiHwgFkIgiHwgF0IgiHwgGEIgiHx8IQMgAiAZPgIcIAUgB34gCCAJfiANIA9+IAwgEH4gCyARfiAGIBJ+IAQgCn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiDkL/////D4N8IhNC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhZCIIggBEIgiCADQiCIfCAFQiCIfCAOQiCIfCATQiCIfCAUQiCIfCAVQiCIfHwhAyACIBY+AiAgByAIfiAJIA9+IA0gEH4gDCARfiALIBJ+IAYgCn4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IghC/////w+DfCIOQv////8Pg3wiE0IgiCAEQiCIIANCIIh8IAVCIIh8IAZCIIh8IAhCIIh8IA5CIIh8fCEDIAIgEz4CJCAHIA9+IAkgEH4gDSARfiAMIBJ+IAogC34gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IghC/////w+DfCILQiCIIARCIIggA0IgiHwgBUIgiHwgBkIgiHwgCEIgiHx8IQMgAiALPgIoIAcgEH4gCSARfiANIBJ+IAogDH4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkL/////D4N8IghCIIggBEIgiCADQiCIfCAFQiCIfCAGQiCIfHwhAyACIAg+AiwgByARfiAJIBJ+IAogDX4gA0L/////D4N8IgRC/////w+DfCIFQv////8Pg3wiBkIgiCAEQiCIIANCIIh8IAVCIIh8fCEDIAIgBj4CMCAHIBJ+IAkgCn4gA0L/////D4N8IgRC/////w+DfCIFQiCIIARCIIggA0IgiHx8IQMgAiAFPgI0IAcgCn4gA0L/////D4N8IgdCIIggA0IgiHwhAyACIAc+AjggAiADPgI8C6wLARN+IAEgADUCACIEIAR+IgI+AgAgASAANQIEIgMgBH4iCkL/////D4NCAYYiBkL/////D4MgAkIgiCIHQv////8Pg3wiCD4CBCABIAMgA34gADUCCCICIAR+IgVC/////w+DQgGGIglC/////w+DfCILQv////8PgyAKQiCIQgGGIAZCIIh8IAhCIIh8IAdCIIh8IgZC/////w+DfCIHPgIIIAEgAiADfiAANQIMIgogBH4iCEL/////D4N8IgxC/////w+DQgGGIg1C/////w+DIAVCIIhCAYYgCUIgiHwgC0IgiHwgB0IgiHwgBkIgiHwiB0L/////D4N8IgU+AgwgASACIAJ+IAMgCn4gADUCECIGIAR+IglC/////w+DfCILQv////8Pg0IBhiIOQv////8Pg3wiD0L/////D4MgDEIgiCAIQiCIfEIBhiANQiCIfCAFQiCIfCAHQiCIfCIIQv////8Pg3wiBT4CECABIAIgCn4gAyAGfiAANQIUIgcgBH4iDEL/////D4N8Ig1C/////w+DfCIQQv////8Pg0IBhiIRQv////8PgyALQiCIIAlCIIh8QgGGIA5CIIh8IA9CIIh8IAVCIIh8IAhCIIh8IgVC/////w+DfCIJPgIUIAEgCiAKfiACIAZ+IAMgB34gADUCGCIIIAR+IgtC/////w+DfCIOQv////8Pg3wiD0L/////D4NCAYYiEkL/////D4N8IhNC/////w+DIA1CIIggDEIgiHwgEEIgiHxCAYYgEUIgiHwgCUIgiHwgBUIgiHwiBUL/////D4N8Igk+AhggASAGIAp+IAIgB34gAyAIfiAEIAA1AhwiBH4iDEL/////D4N8Ig1C/////w+DfCIQQv////8Pg3wiEUL/////D4NCAYYiFEL/////D4MgDkIgiCALQiCIfCAPQiCIfEIBhiASQiCIfCATQiCIfCAJQiCIfCAFQiCIfCIFQv////8Pg3wiCT4CHCABIAYgBn4gByAKfiACIAh+IAMgBH4iA0L/////D4N8IgtC/////w+DfCIOQv////8Pg0IBhiIPQv////8Pg3wiEkL/////D4MgDUIgiCAMQiCIfCAQQiCIfCARQiCIfEIBhiAUQiCIfCAJQiCIfCAFQiCIfCIFQv////8Pg3wiCT4CICABIAYgB34gCCAKfiACIAR+IgJC/////w+DfCIMQv////8Pg3wiDUL/////D4NCAYYiEEL/////D4MgC0IgiCADQiCIfCAOQiCIfEIBhiAPQiCIfCASQiCIfCAJQiCIfCAFQiCIfCIDQv////8Pg3wiBT4CJCABIAcgB34gBiAIfiAEIAp+IgpC/////w+DfCIJQv////8Pg0IBhiILQv////8Pg3wiDkL/////D4MgDEIgiCACQiCIfCANQiCIfEIBhiAQQiCIfCAFQiCIfCADQiCIfCIDQv////8Pg3wiAj4CKCABIAcgCH4gBCAGfiIGQv////8Pg3wiBUL/////D4NCAYYiDEL/////D4MgCUIgiCAKQiCIfEIBhiALQiCIfCAOQiCIfCACQiCIfCADQiCIfCIDQv////8Pg3wiAj4CLCABIAggCH4gBCAHfiIKQv////8Pg0IBhiIHQv////8Pg3wiCUL/////D4MgBUIgiCAGQiCIfEIBhiAMQiCIfCACQiCIfCADQiCIfCIDQv////8Pg3wiAj4CMCABIAQgCH4iBkL/////D4NCAYYiCEL/////D4MgCkIgiEIBhiAHQiCIfCAJQiCIfCACQiCIfCADQiCIfCIDQv////8Pg3wiAj4CNCABIAQgBH4iBEL/////D4MgBkIgiEIBhiAIQiCIfCACQiCIfCADQiCIfCIDQv////8Pg3wiAj4COCABIAJCIIggBEIgiHwgA0IgiHw+AjwLCgAgACAAIAEQLAuyAwIDfgF/IAAgA0GIGCADGyIHECQgAUHIFxAkIAJB6BcgAhsiAxAlQagYECVBHyEAQR8hAQNAIAFByBdqLQAAIAFBA0ZyRQRAIAFBAWshAQwBCwsgAUHFF2o1AABCAXwiBkIBUQRAQgBCAIAaCwNAAkADQCAAIAdqLQAAIABBB0ZyRQRAIABBAWshAAwBCwsgACAHakEHaykAACAGgCEEIAAgAWtBBGshAgNAIARCgICAgHCDUCACQQBOcUUEQCAEQgiIIQQgAkEBaiECDAELCyAEUARAIAdByBcQKUUNAUIBIQRBACECC0HIGEHIFzUAACAEfiIFPgAAQcwYQcwXNQAAIAR+IAVCIIh8IgU+AABB0BhB0Bc1AAAgBH4gBUIgiHwiBT4AAEHUGEHUFzUAACAEfiAFQiCIfCIFPgAAQdgYQdgXNQAAIAR+IAVCIIh8IgU+AABB3BhB3Bc1AAAgBH4gBUIgiHwiBT4AAEHgGEHgFzUAACAEfiAFQiCIfCIFPgAAQeQYQeQXNQAAIAR+IAVCIIh8PgAAIAdByBggAmsgBxArGiACIANqIAQQCwwBCwsL/wEBCX9B6BghA0HoGBAlQYgZIQggAUGIGRAkQagZIQlBqBkQJ0HIGSEGIABByBkQJEGIGiEKQegaIQQDQCAGECZFBEAgCCAGQegZIAoQL0HoGSAJQagaECwgBwR/IAUEf0GoGiADECkEf0GoGiADIAQQKxpBAAUgA0GoGiAEECsaQQELBUGoGiADIAQQKhpBAQsFIAUEf0GoGiADIAQQKhpBAAUgA0GoGhApBH8gA0GoGiAEECsaQQAFQagaIAMgBBArGkEBCwsLIAMgCSEDIAQhCSEEIAUhByEFIAggBiEIIAohBiEKDAELCyAHBEAgASADIAIQKxoFIAMgAhAkCwsJACAAQcgbECgLLAAgACABIAIQKgRAIAJBiBsgAhArGgUgAkGIGxApBEAgAkGIGyACECsaCwsLFwAgACABIAIQKwRAIAJBiBsgAhAqGgsLCwBB6BsgACABEDML0A8BAn4gACAANQIAIAA1AgBC/////w9+Qv////8PgyIDQYgbNQIAfnwiAj4CACAAIAA1AgQgAkIgiHxBjBs1AgAgA358IgI+AgQgACAANQIIIAJCIIh8QZAbNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEGUGzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxBmBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZwbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGgGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBpBs1AgAgA358IgM+AhxBqB0gA0IgiD4CACAAIAA1AgQgADUCBEL/////D35C/////w+DIgNBiBs1AgB+fCICPgIEIAAgADUCCCACQiCIfEGMGzUCACADfnwiAj4CCCAAIAA1AgwgAkIgiHxBkBs1AgAgA358IgI+AgwgACAANQIQIAJCIIh8QZQbNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEGYGzUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxBnBs1AgAgA358IgI+AhggACAANQIcIAJCIIh8QaAbNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGkGzUCACADfnwiAz4CIEGsHSADQiCIPgIAIAAgADUCCCAANQIIQv////8PfkL/////D4MiA0GIGzUCAH58IgI+AgggACAANQIMIAJCIIh8QYwbNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEGQGzUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxBlBs1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QZgbNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGcGzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBoBs1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QaQbNQIAIAN+fCIDPgIkQbAdIANCIIg+AgAgACAANQIMIAA1AgxC/////w9+Qv////8PgyIDQYgbNQIAfnwiAj4CDCAAIAA1AhAgAkIgiHxBjBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZAbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGUGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBmBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZwbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGgGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBpBs1AgAgA358IgM+AihBtB0gA0IgiD4CACAAIAA1AhAgADUCEEL/////D35C/////w+DIgNBiBs1AgB+fCICPgIQIAAgADUCFCACQiCIfEGMGzUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxBkBs1AgAgA358IgI+AhggACAANQIcIAJCIIh8QZQbNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGYGzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBnBs1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QaAbNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGkGzUCACADfnwiAz4CLEG4HSADQiCIPgIAIAAgADUCFCAANQIUQv////8PfkL/////D4MiA0GIGzUCAH58IgI+AhQgACAANQIYIAJCIIh8QYwbNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEGQGzUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxBlBs1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QZgbNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEGcGzUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxBoBs1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QaQbNQIAIAN+fCIDPgIwQbwdIANCIIg+AgAgACAANQIYIAA1AhhC/////w9+Qv////8PgyIDQYgbNQIAfnwiAj4CGCAAIAA1AhwgAkIgiHxBjBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZAbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGUGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBmBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QZwbNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGgGzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBpBs1AgAgA358IgM+AjRBwB0gA0IgiD4CACAAIAA1AhwgADUCHEL/////D35C/////w+DIgNBiBs1AgB+fCICPgIcIAAgADUCICACQiCIfEGMGzUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBkBs1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QZQbNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGYGzUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBnBs1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QaAbNQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEGkGzUCACADfnwiAz4COEHEHSADQiCIPgIAQagdIABBIGogARAyC+UYASt+IAA1AgAiBCABNQIAIgl+IgNC/////w+DQv////8PfkL/////D4MiCkGIGzUCACINfiADQv////8Pg3xCIIggA0IgiHwhDCAEIAE1AggiA35BjBs1AgAiBiAKfiAANQIEIgUgCX4gBCABNQIEIgd+IAxC/////w+DfCIOQv////8Pg3wiD0L/////D4N8IghC/////w+DQv////8PfkL/////D4MiCyANfiAIQv////8Pg3xCIIggDkIgiCAMQiCIfCAPQiCIfCAIQiCIfHwiGUL/////D4N8IR4gAyAFfiAEIAE1AgwiDH5BkBs1AgAiCCAKfiAGIAt+IAA1AggiDiAJfiAFIAd+IB5C/////w+DfCIfQv////8Pg3wiEUL/////D4N8IhJC/////w+DfCITQv////8Pg0L/////D35C/////w+DIg8gDX4gE0L/////D4N8QiCIIB5CIIggGUIgiHwgH0IgiHwgEUIgiHwgEkIgiHwgE0IgiHx8IiBC/////w+DfCIhQv////8Pg3whESADIA5+IAUgDH4gBCABNQIQIh5+QZQbNQIAIhMgCn4gCCALfiAGIA9+IAA1AgwiGSAJfiAHIA5+IBFC/////w+DfCIUQv////8Pg3wiFUL/////D4N8IhpC/////w+DfCIbQv////8Pg3wiEkL/////D4NC/////w9+Qv////8PgyIfIA1+IBJC/////w+DfEIgiCAhQiCIICBCIIh8IBFCIIh8IBRCIIh8IBVCIIh8IBpCIIh8IBtCIIh8IBJCIIh8fCIaQv////8Pg3wiG0L/////D4N8IhZC/////w+DfCEUIAMgGX4gDCAOfiAFIB5+IAQgATUCFCIRfkGYGzUCACISIAp+IAsgE34gCCAPfiAGIB9+IAA1AhAiICAJfiAHIBl+IBRC/////w+DfCIXQv////8Pg3wiHEL/////D4N8IhBC/////w+DfCIYQv////8Pg3wiHUL/////D4N8IhVC/////w+DQv////8PfkL/////D4MiISANfiAVQv////8Pg3xCIIggG0IgiCAaQiCIfCAWQiCIfCAUQiCIfCAXQiCIfCAcQiCIfCAQQiCIfCAYQiCIfCAdQiCIfCAVQiCIfHwiHEL/////D4N8IhBC/////w+DfCIYQv////8Pg3wiHUL/////D4N8IRYgAyAgfiAMIBl+IA4gHn4gBSARfiAEIAE1AhgiFH5BnBs1AgAiFSAKfiALIBJ+IA8gE34gCCAffiAGICF+IAA1AhQiGiAJfiAHICB+IBZC/////w+DfCIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIlQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIXQv////8Pg0L/////D35C/////w+DIhsgDX4gF0L/////D4N8QiCIIBBCIIggHEIgiHwgGEIgiHwgHUIgiHwgFkIgiHwgIkIgiHwgI0IgiHwgJEIgiHwgJUIgiHwgJkIgiHwgJ0IgiHwgF0IgiHx8Ih1C/////w+DfCIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCIlQv////8Pg3whECADIBp+IAwgIH4gGSAefiAOIBF+IAUgFH4gBCABNQIcIhZ+QaAbNQIAIgQgCn4gCyAVfiAPIBJ+IBMgH34gCCAhfiAGIBt+IAA1AhgiFyAJfiAHIBp+IBBC/////w+DfCImQv////8Pg3wiJ0L/////D4N8IihC/////w+DfCIpQv////8Pg3wiKkL/////D4N8IitC/////w+DfCIsQv////8Pg3wiGEL/////D4NC/////w9+Qv////8PgyIcIA1+IBhC/////w+DfEIgiCAiQiCIIB1CIIh8ICNCIIh8ICRCIIh8ICVCIIh8IBBCIIh8ICZCIIh8ICdCIIh8IChCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IBhCIIh8fCIYQv////8Pg3wiHUL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiJEL/////D4N8IiVC/////w+DfCEQIAMgF34gDCAafiAeICB+IBEgGX4gDiAUfiAFIBZ+IA0gCkGkGzUCACIKfiAEIAt+IA8gFX4gEiAffiATICF+IAggG34gBiAcfiAJIAA1AhwiCX4gByAXfiAQQv////8Pg3wiJkL/////D4N8IidC/////w+DfCIoQv////8Pg3wiKUL/////D4N8IipC/////w+DfCIrQv////8Pg3wiLEL/////D4N8Ii1C/////w+DfCIFQv////8Pg0L/////D35C/////w+DIg1+IAVC/////w+DfEIgiCAdQiCIIBhCIIh8ICJCIIh8ICNCIIh8ICRCIIh8ICVCIIh8IBBCIIh8ICZCIIh8ICdCIIh8IChCIIh8IClCIIh8ICpCIIh8ICtCIIh8ICxCIIh8IC1CIIh8IAVCIIh8fCIQQv////8Pg3wiGEL/////D4N8Ih1C/////w+DfCIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCEFIAogC34gBCAPfiAVIB9+IBIgIX4gEyAbfiAIIBx+IAYgDX4gByAJfiAFQv////8Pg3wiBkL/////D4N8IgdC/////w+DfCILQv////8Pg3wiJUL/////D4N8IiZC/////w+DfCInQv////8Pg3wiKEL/////D4N8IilCIIggGEIgiCAQQiCIfCAdQiCIfCAiQiCIfCAjQiCIfCAkQiCIfCAFQiCIfCAGQiCIfCAHQiCIfCALQiCIfCAlQiCIfCAmQiCIfCAnQiCIfCAoQiCIfHwhBiACICk+AgAgCiAPfiAEIB9+IBUgIX4gEiAbfiATIBx+IAggDX4gAyAJfiAMIBd+IBogHn4gESAgfiAUIBl+IA4gFn4gBkL/////D4N8IgNC/////w+DfCIFQv////8Pg3wiB0L/////D4N8IgtC/////w+DfCIIQv////8Pg3wiDkL/////D4N8Ig9C/////w+DfCIQQv////8Pg3wiGEL/////D4N8Ih1C/////w+DfCIiQv////8Pg3wiI0IgiCADQiCIIAZCIIh8IAVCIIh8IAdCIIh8IAtCIIh8IAhCIIh8IA5CIIh8IA9CIIh8IBBCIIh8IBhCIIh8IB1CIIh8ICJCIIh8fCEDIAIgIz4CBCAKIB9+IAQgIX4gFSAbfiASIBx+IA0gE34gCSAMfiAXIB5+IBEgGn4gFCAgfiAWIBl+IANC/////w+DfCIGQv////8Pg3wiBUL/////D4N8IgdC/////w+DfCILQv////8Pg3wiDEL/////D4N8IghC/////w+DfCIOQv////8Pg3wiD0L/////D4N8IhNC/////w+DfCIZQiCIIAZCIIggA0IgiHwgBUIgiHwgB0IgiHwgC0IgiHwgDEIgiHwgCEIgiHwgDkIgiHwgD0IgiHwgE0IgiHx8IQMgAiAZPgIIIAogIX4gBCAbfiAVIBx+IA0gEn4gCSAefiARIBd+IBQgGn4gFiAgfiADQv////8Pg3wiBkL/////D4N8IgVC/////w+DfCIHQv////8Pg3wiC0L/////D4N8IgxC/////w+DfCIIQv////8Pg3wiDkL/////D4N8Ig9CIIggBkIgiCADQiCIfCAFQiCIfCAHQiCIfCALQiCIfCAMQiCIfCAIQiCIfCAOQiCIfHwhAyACIA8+AgwgCiAbfiAEIBx+IA0gFX4gCSARfiAUIBd+IBYgGn4gA0L/////D4N8IgZC/////w+DfCIFQv////8Pg3wiB0L/////D4N8IgtC/////w+DfCIMQv////8Pg3wiCEIgiCAGQiCIIANCIIh8IAVCIIh8IAdCIIh8IAtCIIh8IAxCIIh8fCEDIAIgCD4CECAKIBx+IAQgDX4gCSAUfiAWIBd+IANC/////w+DfCIEQv////8Pg3wiBkL/////D4N8IgVC/////w+DfCIHQiCIIARCIIggA0IgiHwgBkIgiHwgBUIgiHx8IQQgAiAHPgIUIAogDX4gCSAWfiAEQv////8Pg3wiCUL/////D4N8IgpCIIggCUIgiCAEQiCIfHwhBCACIAo+AhggAiAEPgIcIARCIIinBEAgAkGIGyACECsaBSACQYgbECkEQCACQYgbIAIQKxoLCwvGFwEjfiAANQIAIgcgB34iAkL/////D4NC/////w9+Qv////8PgyIMQYgbNQIAIg1+IAJC/////w+DfEIgiCACQiCIfCEEQYwbNQIAIgkgDH4gADUCBCICIAd+IgVC/////w+DQgGGIghC/////w+DIARC/////w+DfCIGQv////8Pg3wiA0L/////D4NC/////w9+Qv////8PgyIKIA1+IANC/////w+DfEIgiCAFQiCIQgGGIAhCIIh8IAZCIIh8IARCIIh8IANCIIh8fCEDQZAbNQIAIg8gDH4gCSAKfiACIAJ+IAA1AggiBCAHfiIIQv////8Pg0IBhiIGQv////8Pg3wiEEL/////D4MgA0L/////D4N8IhRC/////w+DfCIRQv////8Pg3wiBUL/////D4NC/////w9+Qv////8PgyISIA1+IAVC/////w+DfEIgiCAIQiCIQgGGIAZCIIh8IBBCIIh8IBRCIIh8IANCIIh8IBFCIIh8IAVCIIh8fCEFQZQbNQIAIhAgDH4gCiAPfiAJIBJ+IAIgBH4gADUCDCIDIAd+IgZC/////w+DfCIRQv////8Pg0IBhiIVQv////8PgyAFQv////8Pg3wiFkL/////D4N8IhdC/////w+DfCIOQv////8Pg3wiCEL/////D4NC/////w9+Qv////8PgyIUIA1+IAhC/////w+DfEIgiCARQiCIIAZCIIh8QgGGIBVCIIh8IBZCIIh8IAVCIIh8IBdCIIh8IA5CIIh8IAhCIIh8fCEIQZgbNQIAIhEgDH4gCiAQfiAPIBJ+IAkgFH4gBCAEfiACIAN+IAA1AhAiBSAHfiIWQv////8Pg3wiF0L/////D4NCAYYiDkL/////D4N8IhhC/////w+DIAhC/////w+DfCILQv////8Pg3wiE0L/////D4N8IhlC/////w+DfCIaQv////8Pg3wiBkL/////D4NC/////w9+Qv////8PgyIVIA1+IAZC/////w+DfEIgiCAXQiCIIBZCIIh8QgGGIA5CIIh8IBhCIIh8IAtCIIh8IAhCIIh8IBNCIIh8IBlCIIh8IBpCIIh8IAZCIIh8fCEGQZwbNQIAIhYgDH4gCiARfiAQIBJ+IA8gFH4gCSAVfiADIAR+IAIgBX4gADUCFCIIIAd+IhhC/////w+DfCILQv////8Pg3wiE0L/////D4NCAYYiGUL/////D4MgBkL/////D4N8IhpC/////w+DfCIbQv////8Pg3wiHEL/////D4N8Ih1C/////w+DfCIeQv////8Pg3wiDkL/////D4NC/////w9+Qv////8PgyIXIA1+IA5C/////w+DfEIgiCALQiCIIBhCIIh8IBNCIIh8QgGGIBlCIIh8IBpCIIh8IAZCIIh8IBtCIIh8IBxCIIh8IB1CIIh8IB5CIIh8IA5CIIh8fCELQaAbNQIAIg4gDH4gCiAWfiARIBJ+IBAgFH4gDyAVfiAJIBd+IAMgA34gBCAFfiACIAh+IAA1AhgiBiAHfiIZQv////8Pg3wiGkL/////D4N8IhtC/////w+DQgGGIhxC/////w+DfCIdQv////8PgyALQv////8Pg3wiHkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiIUL/////D4N8IiJC/////w+DfCIjQv////8Pg3wiE0L/////D4NC/////w9+Qv////8PgyIYIA1+IBNC/////w+DfEIgiCAaQiCIIBlCIIh8IBtCIIh8QgGGIBxCIIh8IB1CIIh8IB5CIIh8IAtCIIh8IB9CIIh8ICBCIIh8ICFCIIh8ICJCIIh8ICNCIIh8IBNCIIh8fCELIA0gDEGkGzUCACIMfiAKIA5+IBIgFn4gESAUfiAQIBV+IA8gF34gCSAYfiADIAV+IAQgCH4gAiAGfiAHIAA1AhwiB34iGUL/////D4N8IhpC/////w+DfCIbQv////8Pg3wiHEL/////D4NCAYYiHUL/////D4MgC0L/////D4N8Ih5C/////w+DfCIfQv////8Pg3wiIEL/////D4N8IiFC/////w+DfCIiQv////8Pg3wiI0L/////D4N8IiRC/////w+DfCITQv////8Pg0L/////D35C/////w+DIg1+IBNC/////w+DfEIgiCAaQiCIIBlCIIh8IBtCIIh8IBxCIIh8QgGGIB1CIIh8IB5CIIh8IAtCIIh8IB9CIIh8ICBCIIh8ICFCIIh8ICJCIIh8ICNCIIh8ICRCIIh8IBNCIIh8fCELIAEgCiAMfiAOIBJ+IBQgFn4gESAVfiAQIBd+IA8gGH4gCSANfiAFIAV+IAMgCH4gBCAGfiACIAd+IgJC/////w+DfCIJQv////8Pg3wiCkL/////D4NCAYYiE0L/////D4N8IhlC/////w+DIAtC/////w+DfCIaQv////8Pg3wiG0L/////D4N8IhxC/////w+DfCIdQv////8Pg3wiHkL/////D4N8Ih9C/////w+DfCIgQv////8Pg3wiIT4CACABIAwgEn4gDiAUfiAVIBZ+IBEgF34gECAYfiANIA9+IAUgCH4gAyAGfiAEIAd+IgRC/////w+DfCIPQv////8Pg3wiEkL/////D4NCAYYiIkL/////D4MgCUIgiCACQiCIfCAKQiCIfEIBhiATQiCIfCAZQiCIfCAaQiCIfCALQiCIfCAbQiCIfCAcQiCIfCAdQiCIfCAeQiCIfCAfQiCIfCAgQiCIfCAhQiCIfCICQv////8Pg3wiCUL/////D4N8IgpC/////w+DfCILQv////8Pg3wiE0L/////D4N8IhlC/////w+DfCIaQv////8Pg3wiGz4CBCABIAwgFH4gDiAVfiAWIBd+IBEgGH4gDSAQfiAIIAh+IAUgBn4gAyAHfiIDQv////8Pg3wiEEL/////D4NCAYYiFEL/////D4N8IhxC/////w+DIA9CIIggBEIgiHwgEkIgiHxCAYYgIkIgiHwgCUIgiHwgAkIgiHwgCkIgiHwgC0IgiHwgE0IgiHwgGUIgiHwgGkIgiHwgG0IgiHwiAkL/////D4N8IgRC/////w+DfCIJQv////8Pg3wiCkL/////D4N8Ig9C/////w+DfCISQv////8Pg3wiCz4CCCABIAwgFX4gDiAXfiAWIBh+IA0gEX4gBiAIfiAFIAd+IgVC/////w+DfCIRQv////8Pg0IBhiIVQv////8PgyAQQiCIIANCIIh8QgGGIBRCIIh8IBxCIIh8IARCIIh8IAJCIIh8IAlCIIh8IApCIIh8IA9CIIh8IBJCIIh8IAtCIIh8IgJC/////w+DfCIEQv////8Pg3wiA0L/////D4N8IglC/////w+DfCIKQv////8Pg3wiDz4CDCABIAwgF34gDiAYfiANIBZ+IAYgBn4gByAIfiIIQv////8Pg0IBhiISQv////8Pg3wiEEL/////D4MgEUIgiCAFQiCIfEIBhiAVQiCIfCAEQiCIfCACQiCIfCADQiCIfCAJQiCIfCAKQiCIfCAPQiCIfCICQv////8Pg3wiBEL/////D4N8IgNC/////w+DfCIFQv////8Pg3wiCT4CECABIAwgGH4gDSAOfiAGIAd+IgZC/////w+DQgGGIgpC/////w+DIAhCIIhCAYYgEkIgiHwgEEIgiHwgBEIgiHwgAkIgiHwgA0IgiHwgBUIgiHwgCUIgiHwiAkL/////D4N8IgRC/////w+DfCIDQv////8Pg3wiBT4CFCABIAwgDX4gByAHfiIHQv////8PgyAGQiCIQgGGIApCIIh8IARCIIh8IAJCIIh8IANCIIh8IAVCIIh8IgJC/////w+DfCIEQv////8Pg3wiAz4CGCABIARCIIggB0IgiHwgAkIgiHwgA0IgiHwiBz4CHCAHQiCIpwRAIAFBiBsgARArGgUgAUGIGxApBEAgAUGIGyABECsaCwsLCgAgACAAIAEQNgsLACAAQagbIAEQNgsVACAAQaghECRByCEQJUGoISABEDULEQAgAEHoIRA6QeghQagcECkLIwAgABAmBEBBAA8LIABBiCIQOkGIIkGoHBApBEBBfw8LQQELFwAgACABEDogAUGIGyABEDAgASABEDkLCQBByBsgABAkC7wBAQJ/IAIQJUEgIQMDQCABIANPBEAgA0EgRgRAQagiED4FQagiQagbQagiEDYLIABBqCJByCIQNiACQcgiIAIQMiAAQSBqIQAgA0EgaiEDDAELCyABQR9xIgRFBEAPC0HIIhAlQQAhAQNAIAEgBEZFBEAgASAALQAAOgDIIiAAQQFqIQAgAUEBaiEBDAELCyADQSBGBEBBqCIQPgVBqCJBqBtBqCIQNgtByCJBqCJByCIQNiACQcgiIAIQMgscACABIAJB6CIQP0HoIkHoIhA5IABB6CIgAxA2C+ABAQJ/QQBBACgCACIFIAJBAWpBBXRqNgIAIAUQPiAFQSBqIQUDQCACIAZHBEAgABAmBEAgBUEgayAFECQFIAAgBUEgayAFEDYLIAAgAWohACAFQSBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBIGsiBSAFED0DQCAGBEAgABAmBEAgBSAFQSBrECQgAhAlBSAFQSBrIgNBiCMQJCAFIAAgAxA2IAVBiCMgAhA2CyAAIAFrIQAgAiAEayECIAVBIGshBSAGQQFrIQYMAQsLQQAgBTYCAAstAQF/A0AgASADRkUEQCAAIAIQOSAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLLQEBfwNAIAEgA0ZFBEAgACACEDogAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLC5cCACACRQRAIAMQPg8LIABBqCMQJCADED4DQCACQQFrIgIgAWotAAAhACADIAMQNyAAQYABTwRAIANBqCMgAxA2IABBgAFrIQALIAMgAxA3IABBwABPBEAgA0GoIyADEDYgAEFAaiEACyADIAMQNyAAQSBPBEAgA0GoIyADEDYgAEEgayEACyADIAMQNyAAQRBPBEAgA0GoIyADEDYgAEEQayEACyADIAMQNyAAQQhPBEAgA0GoIyADEDYgAEEIayEACyADIAMQNyAAQQRPBEAgA0GoIyADEDYgAEEEayEACyADIAMQNyAAQQJPBEAgA0GoIyADEDYgAEECayEACyADIAMQNyAABEAgA0GoIyADEDYLIAINAAsL1QEBAX8gABAmBEAgARAlDwtBICECQegcQcgjECQgAEHIHEEgQegjEEQgAEGIHUEgQYgkEEQDQEHoI0HIGxAoRQRAQegjQagkEDdBASEAA0BBqCRByBsQKEUEQEGoJEGoJBA3IABBAWohAAwBCwtByCNByCQQJCACIABrQQFrIQIDQCACBEBByCRByCQQNyACQQFrIQIMAQsLIAAhAkHIJEHIIxA3QegjQcgjQegjEDZBiCRByCRBiCQQNgwBCwtBiCQQOwRAQYgkIAEQNAVBiCQgARAkCwsgACAAECYEQEEBDwsgAEGIHEEgQegkEERB6CRByBsQKAsVACAAIAFBiCUQNkGIJUGoGyACEDYLCgAgACAAIAEQRwsLACAAQYgbIAEQMAsJACAAQagcECkLDgAgABACIABBMGoQAnELCgAgAEHgAGoQAgsNACAAEAEgAEEwahABCxUAIAAQASAAQTBqEBsgAEHgAGoQAQt6ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWAu6AQAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBCygAIAAQSwRAIAEQTgUgAUHgAGoQGyAAQTBqIAFBMGoQACAAIAEQAAsLFQAgACABEAQgAEEwaiABQTBqEARxC3IBAX8gABBMBEAgARBLDwsgARBLBEBBAA8LIABB4ABqIgIQDgRAIAAgARBSDwsgAkHYJRAUIAFB2CVBiCYQEyACQdglQbgmEBMgAUEwakG4JkHo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IAMgAxCPASAAQcAATwRAIANByP0AIAMQjQEgAEFAaiEACyADIAMQjwEgAEEgTwRAIANByP0AIAMQjQEgAEEgayEACyADIAMQjwEgAEEQTwRAIANByP0AIAMQjQEgAEEQayEACyADIAMQjwEgAEEITwRAIANByP0AIAMQjQEgAEEIayEACyADIAMQjwEgAEEETwRAIANByP0AIAMQjQEgAEEEayEACyADIAMQjwEgAEECTwRAIANByP0AIAMQjQEgAEECayEACyADIAMQjwEgAARAIANByP0AIAMQjQELIAINAAsLygEAQaiBARCLAUGogQFBqIEBEJIBIABBqP4AQTBBiP8AEJgBQYj/AEHo/wAQjwEgAEHo/wBB6P8AEI0BQej/AEHIgAEQWkHIgAFB6P8AQciAARCNAUHIgAFBqIEBEFIEQAALQYj/ACAAQYiCARCNAUHo/wBBqIEBEFIEQEGogQEQAUHYgQEQG0GogQFBiIIBIAEQjQEFQeiCARCLAUHoggFB6P8AQeiCARCQAUHoggFB2P4AQTBB6IIBEJgBQeiCAUGIggEgARCNAQsLZgBBmIYBEIsBQZiGAUGYhgEQkgEgAEHIgwFBMEH4gwEQmAFB+IMBQdiEARCPASAAQdiEAUHYhAEQjQFB2IQBQbiFARBaQbiFAUHYhAFBuIUBEI0BQbiFAUGYhgEQUgRAQQAPC0EBCw8AIAAQSyAAQeAAahBLcQsKACAAQcABahBLCw4AIAAQTSAAQeAAahBNCxcAIAAQTSAAQeAAahCLASAAQcABahBNC4ICACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAELkgMAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYIAEgACkDYDcDYCABIAApA2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeCABIAApA4ABNwOAASABIAApA4gBNwOIASABIAApA5ABNwOQASABIAApA5gBNwOYASABIAApA6ABNwOgASABIAApA6gBNwOoASABIAApA7ABNwOwASABIAApA7gBNwO4ASABIAApA8ABNwPAASABIAApA8gBNwPIASABIAApA9ABNwPQASABIAApA9gBNwPYASABIAApA+ABNwPgASABIAApA+gBNwPoASABIAApA/ABNwPwASABIAApA/gBNwP4ASABIAApA4ACNwOAAiABIAApA4gCNwOIAiABIAApA5ACNwOQAiABIAApA5gCNwOYAgsvACAAEJsBBEAgARCeAQUgAUHAAWoQiwEgAEHgAGogAUHgAGoQjAEgACABEIwBCwsXACAAIAEQUiAAQeAAaiABQeAAahBScQuGAQEBfyAAEJwBBEAgARCbAQ8LIAEQmwEEQEEADwsgAEHAAWoiAhCKAQRAIAAgARCiAQ8LIAJB2IcBEI8BIAFB2IcBQbiIARCNASACQdiHAUGYiQEQjQEgAUHgAGpBmIkBQfiJARCNASAAQbiIARBSBEAgAEHgAGpB+IkBEFIEQEEBDwsLQQAL0AEBAn8gABCcAQRAIAEQnAEPCyABEJwBBEBBAA8LIABBwAFqIgIQigEEQCABIAAQowEPCyABQcABaiIDEIoBBEAgACABEKMBDwsgAkHYigEQjwEgA0G4iwEQjwEgAEG4iwFBmIwBEI0BIAFB2IoBQfiMARCNASACQdiKAUHYjQEQjQEgA0G4iwFBuI4BEI0BIABB4ABqQbiOAUGYjwEQjQEgAUHgAGpB2I0BQfiPARCNAUGYjAFB+IwBEFIEQEGYjwFB+I8BEFIEQEEBDwsLQQALmgIBAX8gABCbAQRAIAAgARChAQ8LIABB2JABEI8BIABB4ABqIgJBuJEBEI8BQbiRAUGYkgEQjwEgAEG4kQFB+JIBEJABQfiSAUH4kgEQjwFB+JIBQdiQAUH4kgEQkQFB+JIBQZiSAUH4kgEQkQFB+JIBQfiS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IABBMGogAUEwahARIAEgByABEI0BIABB4ABqIAFB4ABqIggQACAAQZABaiABQZABahARIAggBiAIEI0BIABBwAFqIAFBwAFqIggQACAAQfABaiABQfABahARIAggBSAIEI0BIABBoAJqIAFBoAJqIggQACAAQdACaiABQdACahARIAggBCAIEI0BIABBgANqIAFBgANqIggQACAAQbADaiABQbADahARIAggAyAIEI0BIABB4ANqIAFB4ANqIggQACAAQZAEaiABQZAEahARIAggAiAIEI0BCwvcwAF7AEEACwQYkwEAAEEICyABAAAA//////5b/v8CpL1TBdihCQjYOTNIfZ0pU6ftcwBByAULMKuq//////65//9Tsf7/qx4k9rD2oNIwZ78ShfOES3dk16xLQ7anG0ua5n856hEBGgBB+AULMEYXNBw0H9/08QTRCabmdgrVtpVMbEfljcCDnZOpiOtnLZUZtYU+eZqq48qS5Y+YEQBBqAYLMP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQBB2AYLMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiAcLMFXV////f//c//+pWP//VQ8Se1h7UGmYs1+JwnnCpTuya9alIdvTjSVN878c9YgADQBBuAcLMFbV////f//c//+pWP//VQ8Se1h7UGmYs1+JwnnCpTuya9alIdvTjSVN878c9YgADQBB6AcLMFXV////f//c//+pWP//VQ8Se1h7UGmYs1+JwnnCpTuya9alIdvTjSVN878c9YgADQBBmAgLMK6q/P////VD/f9H7fL/tzJpnemiSTroB3q7MoMx86jsacD0oB6NFO8GAv8+JrMKBABByAgLMKvq////v3/u//9UrP//qgeJPaw9qDTM2a9E4Tzh0h3ZNevSkO3pxpKm+V+OekSABgBBiBsLIAEAAAD//////lv+/wKkvVMF2KEJCNg5M0h9nSlTp+1zAEGoGwsgbZzy85DpmckjXJKHy+1sK485VHKWFNMFEf9Zn9nZSAcAQcgbCyD+////AQAAAAJIAwD6t4RY9U+87O9PjJlvBcWsWbEkGABB6BsLIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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//8AAAAAAaQBAP1bQqz6J1729yfGzLeCYtasWBIMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAQZjsAQugCMn///82AAAANzxaAFvDQQLbljruRZaS/nwVKg8iDfEXnPr//2MFAABkFdgI1N+3lUiDjxOsdC/cy6YIq7MD5hJ31vL/iCkNAIntMZh6vxd8G0qF9O+cCVo4yvwk1QXMZo0Y/Isk5wN0wZO820tUSPuWRJUsS29Pr1PwhWd6xXAnjMbBxGSerwOgGQ+JyKbGmBJWwsYgELyMmQXJpsmEdWI6MthzObmpoYFO06hdId0mtXSe28ZKh4DriiZAv5pKNfIa1pTr2RHGezJ0gOGXkOoGH4HCA9m6kJaa7Qi0qNcCRt7ECnpsFU2srBw5Lo9hm969qrF9/i1p/meSI3XiiCO29ns85ZNZ4rZXl8GMDABdzyxXPklC+/wF+zNc619gD+FvhsNEniIWcNak8WivzI4DTfatckhXs7+Gn59XXEQCh6wInKRdaYSNlp5xppukwbfs2bQEKlpM88a35Ek/P1KKWvm//2gr2XqjDoWm8q8QbUnkO4Gs5WQ03XgcsM8nGruzyBLKhH5Jn9yufgAio8WzhbGXz7lXsObB5kBzDxYNPTJB9lZazV9E8xhKDa9HH5FYjGy9veiH3k0rzj3N+2HL4IglqwuyTN+sB1ROTvldtt2PFXpkjWzU2MWDEt0bbRDQwqwx9OCP1kp18mh5QAMVc7CIrQ7It1De89L9zrUxpsQOa64pE33TAjg1CMw7n0Sev2hnuEIqOT1XfVR0ED73bok681X041/w/8Qxv6ykqvcFWKcjxVcBr8w3ENe+c76gP5b3cTXC0IGbi2ZPPCiR4/mSXRnQiwiv8wwuosJXN81s4HEaXTi7G+Iz6wfcRacOqfjYfh/j4+saWO8v3wvZc3Q25pvZJleDY8yJr/74mc3ef6WA/TpT372cOV4ZJb4LbRk/r1PRtbuTPTvKbRkuP4BF95yaNQM/xWBv+WdUxTQQSHPs3lwHSR0EynGaHJLC6h4ZDvMaDk18a+DreGSfG6ThtMoorfQR1VT/YeotltL/26UyaRZM7h2/8GkzWXZxnZhPaA6c3PfFWXpmohM8wRNEA/GQwgkPD5UAOU9OaJ5u9mumrMX5TloUcfSexJzaSpyZsQh0Tf9DyVfrthVxdPDmvh0pD1ZNihAEO4Cjuwvmw3jWGLCSqYQd04e2D3Dqoll/lpxxS+ryt4Ng6yWyHfNjwUra2fUFskytVv1mOTCUH78UqEL4KR8Pl73oocmGGGXrkbQ5KN5Qp3Wj2WCScYvRSYm9GnEULXnT0G7brawSRr54Baq1R43TCncNEQjZjm0+lozn2+OzvP7CYBOkm+Zw7rDHlQT+RYYEEQQ5IvCFwEwVaWV0HYVRPCMOO3RCd7jgJaHspCHov1EpEwY4FgdVKV++CaHB81vOUVAakJi0JrDOY2p1uIKLYTPCXABBuPQBC6AIVlVVVf////+pkqmqrMLTN646wVsFkCYiMP5oxoxvnkKENEiDsBM7sY92QBowbwsB41KBdhmbZP2p1r8Q+gHSUuI/BgqcGmVF+/9xgIMqUNiiqKhx7F1dyrSDtHvSCOBkJwOgdavC90ApyAe13Ym/oSjDtRchoFqD8U4oBztbB0szRdczz6/njCJFaMdD0UlbWXc7Ogyyis11tiyRLjD0DcA+KOf8SSzKFKwkPiiyABLDnqrkpodD1lKjIhDnzq4M/U3nxwjGRGViOVgSagRJLN6ujVewx7ShbN1fcmwiWFQXSRdPypXa5qmEiVwNhE3HlJSfW9qK2vuqMSWduH+YO4srRiMpWVSC7jYXzJwJBtmstdpux3n4ATegVN7ZKOoE5kyjybS56EymQTac0jgeNGlHQLLoAafOuXbLNpL+Tjk25VVBxpdlYFikQhe1Le9dKCgmXd7QDInQ4oeqJdzZMJ3t1WvE0xeq/JAWMIVVGGAM2qo3WDr7Yw4D26r1OrVJUAJ5aaVCYEu3fzsB98gDs5nidfSSXc/wYGOvzdYiZQQcuQCQ2+WfK7nyegR8CNXUUdXuJDMb30nVvSY5aL3nBKeEpu38bnlfX8bveFKJ84qg7EO4gJfOiw33n8YqhLQ2gOWxT7oUGw+Hg5RZJdaSUqghHgcfRmKaaxm8AlKi4h5Z3Gnh/DU5Lo4mfU0+JJHadclUhkmLHnAf7+haykT3XK/Q8f0//6kCjyijiZlAccEaLuUavXHSjXvsPsOuc5IshbyWMESTLI8utYZD5Y2QdEPxI363P1E81/pR0ss3/UDpw5CvbfkzlCUuXMwgwUT0/UvzPj4/hXG1Defw0VShFBQRQLOQ0ASASIBwnpXLbNkhqdZuBHs/29byNDLFfwceVzNGAlCUQJVZFhs+Ub8BtE53wpI5gLgMUZcF03zfKGLnkVxztR+vr2fzj/37iuSxbb4QxY2OB6GZqXmRE3A+RMmIfh52UUWBIokLx4106SPSg5E0e+G4N40gNAyMKBIzWJIOw+Ul1T7lF8nKG2j/SKfmyIdIFn9zRBW7wL2Onmo/sH/kdGiBVl6Pgn2472MgId8zTKYcBR4yTzDDhq9dNCCsC2Nd55WR5jtf8fluKgHFdFOowxn9TDub/3xV/n8d8Re0vOhfo3K1XBi5WqS4ef3+++1LBk/7SX7WPI+2sk+EDcfAYcTDbZt1uxSMKjzDqejk7UHVosK+rOeNw7G8brWtAnvgSTjSjNXQWD0teoJe3V9QZKTNcIVCRP9yAfgal+Bt3Tj8LlxJuSvwi5RjHXLkFkbcoJkGA7jXmrgDUjnU/O3JLi8GZlwoB6u67ValZ6LQS1hlHHAyJHNQTLSkAP+d54WFB+/tmO+dxEd3gzjCJ2w2FrMURDNSVNNHQyFeAEHY/AELgAIAgEDAIKBg4BCQUNAwsHDwCIhIyCioaOgYmFjYOLh4+ASERMQkpGTkFJRU1DS0dPQMjEzMLKxs7BycXNw8vHz8AoJCwiKiYuISklLSMrJy8gqKSsoqqmrqGppa2jq6evoGhkbGJqZm5haWVtY2tnb2Do5Ozi6ubu4enl7ePr5+/gGBQcEhoWHhEZFR0TGxcfEJiUnJKalp6RmZWdk5uXn5BYVFxSWlZeUVlVXVNbV19Q2NTc0trW3tHZ1d3T29ff0Dg0PDI6Nj4xOTU9Mzs3PzC4tLyyura+sbm1vbO7t7+weHR8cnp2fnF5dX1ze3d/cPj0/PL69v7x+fX98/v3//AEGYjgILoAj+////AQAAAAJIAwD6t4RY9U+87O9PjJlvBcWsWbEkGAMAAAD9/////BP7/wjsOPsPiOUcGIitmdh32Hz59chbsc+JqnRWsPP+uQZgQAEvByZ6ZiW/DZrOdINZLQXkLE0JEL3TabYwkadhoLJ/qfvkqCZLs88IRPMsev8G7KQ1H4kSCgsCoMIliCEIfX9xHJfYxRrYytw5R8FB4+6pe2BPNNEcI6NgZMXuX/JPqRTElW6bVIBQNh2d3QZFnwl0UhzMQCd1sJWbHXzL6FImWrDIXQOZQ1ziAQ8QFz1nX5vGY1OtJvO8YWPDXpqB3PDPmZdjHNmr8AS+lRAi8ubJIPZJrEJTEU3IwcpyJXEWzoVi/NyGR1fs1WR5FZYXSJrAQlc0+FN3MzW6lHdQrhZQzPhJPBolF7by2wXhONDfNhvza+c2Pd2AuFT8G0nK2ohy8vbFWzXimt0Euxw4mckJptIkZRbNnJIt9eM/RgSrsXP6vQ54/fYXJuYyO3ecUA5Ib1fH4feX67G8EF/pcdorZzOqJ2AsLu5OgVJE8xcSb6/lOSwzH5qf3Jhl8qjQTtLHssNwFmaBEhEGHuIiuofw3TwCOAZMpS/8l19Da6uU01udCIeWewGuFIX077AAnWBaODmUqRDlCK4q0vPwNcOwuJpue2DL+axkLbbWBqniCvXVY3QJbk/nVBWQXytA1wqFUfuBzy+t+uAs2ffZVY/PWZwN1WB1Ab1jt/ZkM6vnnsEvGr/lVHarw9yRLyRZdH3tzicoeeQcD3zcCni+euQk15INTAE7xmeULsFi5BpDb9ZxRV1fUfr96WBTzvcN5MwVYY7TDZ4F+sKAc2PbueJhLVoNENrd9qZPp7F2gyzUa1vDO1oRFIrcB/bGnK14yQwIrFZ/ssc+w4Mnjo/z+V0ChKpgXcnTtSGmbwQJD0+7LqecDeaBbOWk/OID+McLRCwAe/UGTPlpuEivREJYpmCCpQshQWjIvw/owebLT0+GNE7qZB+PUS2/ko+poRZk6aoih0ncRNuoEQbQgUf5f3UIAbuBfSCRyrOeJDd8UVWsVzEHQ1L1Gi4cVN4r7MMDYNF5lqbUBOjwNqVVQui8DDXek29xWnmeW3LouzE2RagrQm6gu4xmU+D2V0goD5x5zZcDRAv8Vnmm3icyrxivSTb78bJM0fOscrqmpglNZ/2js3niHkvybSlMtRPcpifY0pVEeUUQ1jRqhJa1o7hAX2c8iLou1tBz4H+ZXX4iio3/GejDvEHgT5KsiywZIRob6vQnRTuOumQ4AC1PntkY5PS/BnHf6TiVnvtHbyNE7en9304vBbxRJtCqNn3Ag3Ow1PCHZx9PbwiJLHRg9Rdjv2gpp1hjfPQXDFxtq5zlcUv9PenhHAXVHUcwsm0Najs6dJDpDj8AQbiWAgugCP7///8BAAAAAkgDAPq3hFj1T7zs70+MmW8FxaxZsSQY/////wAAAAABpAEA/VtCrPonXvb3J8bMt4Ji1qxYEgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAABB2J4CC6AIyf///zYAAAA3PFoAW8NBAtuWOu5FlpL+fBUqDyIN8Rec+v//YwUAAGQV2AjU37eVSIOPE6x0L9zLpgirswPmEnfW8v+IKQ0Aie0xmHq/F3wbSoX075wJWjjK/CTVBcxmjRj8iyTnA3TBk7zbS1RI+5ZElSxLb0+vU/CFZ3rFcCeMxsHEZJ6vA6AZD4nIpsaYElbCxiAQvIyZBcmmyYR1Yjoy2HM5uamhgU7TqF0h3Sa1dJ7bxkqHgOuKJkC/mko18hrWlOvZEcZ7MnSA4ZeQ6gYfgcID2bqQlprtCLSo1wJG3sQKemwVTaysHDkuj2Gb3r2qsX3+LWn+Z5IjdeKII7b2ezzlk1nitleXwYwMAF3PLFc+SUL7/AX7M1zrX2AP4W+Gw0SeIhZw1qTxaK/MjgNN9q1ySFezv4afn1dcRAKHrAicpF1phI2WnnGmm6TBt+zZtAQqWkzzxrfkST8/Uopa+b//aCvZeqMOhabyrxBtSeQ7gazlZDTdeBywzycau7PIEsqEfkmf3K5+ACKjxbOFsZfPuVew5sHmQHMPFg09MkH2VlrNX0TzGEoNr0cfkViMbL296IfeTSvOPc37YcvgiCWrC7JM36wHVE5O+V223Y8VemSNbNTYxYMS3RttENDCrDH04I/WSnXyaHlAAxVzsIitDsi3UN7z0v3OtTGmxA5rrikTfdMCODUIzDufRJ6/aGe4Qio5PVd9VHQQPvduiTrzVfTjX/D/xDG/rKSq9wVYpyPFVwGvzDcQ175zvqA/lvdxNcLQgZuLZk88KJHj+ZJdGdCLCK/zDC6iwlc3zWzgcRpdOLsb4jPrB9xFpw6p+Nh+H+Pj6xpY7y/fC9lzdDbmm9kmV4NjzImv/viZzd5/pYD9OlPfvZw5XhklvgttGT+vU9G1u5M9O8ptGS4/gEX3nJo1Az/FYG/5Z1TFNBBIc+zeXAdJHQTKcZocksLqHhkO8xoOTXxr4Ot4ZJ8bpOG0yiit9BHVVP9h6i2W0v/bpTJpFkzuHb/waTNZdnGdmE9oDpzc98VZemaiEzzBE0QD8ZDCCQ8PlQA5T05onm72a6asxflOWhRx9J7EnNpKnJmxCHRN/0PJV+u2FXF08Oa+HSkPVk2KEAQ7gKO7C+bDeNYYsJKphB3Th7YPcOqiWX+WnHFL6vK3g2DrJbId82PBStrZ9QWyTK1W/WY5MJQfvxSoQvgpHw+XveihyYYYZeuRtDko3lCndaPZYJJxi9FJib0acRQtedPQbtutrBJGvngFqrVHjdMKdw0RCNmObT6WjOfb47O8/sJgE6Sb5nDusMeVBP5FhgQRBDki8IXATBVpZXQdhVE8Iw47dEJ3uOAloeykIei/USkTBjgWB1UpX74JocHzW85RUBqQmLQmsM5janW4gothM8JcAEH4pgILoAhWVVVV/////6mSqaqswtM3rjrBWwWQJiIw/mjGjG+eQoQ0SIOwEzuxj3ZAGjBvCwHjUoF2GZtk/anWvxD6AdJS4j8GCpwaZUX7/3GAgypQ2KKoqHHsXV3KtIO0e9II4GQnA6B1q8L3QCnIB7Xdib+hKMO1FyGgWoPxTigHO1sHSzNF1zPPr+eMIkVox0PRSVtZdzs6DLKKzXW2LJEuMPQNwD4o5/xJLMoUrCQ+KLIAEsOequSmh0PWUqMiEOfOrgz9TefHCMZEZWI5WBJqBEks3q6NV7DHtKFs3V9ybCJYVBdJF0/KldrmqYSJXA2ETceUlJ9b2ora+6oxJZ24f5g7iytGIylZVILuNhfMnAkG2ay12m7HefgBN6BU3tko6gTmTKPJtLnoTKZBNpzSOB40aUdAsugBp865dss2kv5OOTblVUHGl2VgWKRCF7Ut710oKCZd3tAMidDih6ol3Nkwne3Va8TTF6r8kBYwhVUYYAzaqjdYOvtjDgPbqvU6tUlQAnlppUJgS7d/OwH3yAOzmeJ19JJdz/BgY6/N1iJlBBy5AJDb5Z8rufJ6BHwI1dRR1e4kMxvfSdW9JjlovecEp4Sm7fxueV9fxu94UonziqDsQ7iAl86LDfefxiqEtDaA5bFPuhQbD4eDlFkl1pJSqCEeBx9GYpprGbwCUqLiHlncaeH8NTkujiZ9TT4kkdp1yVSGSYsecB/v6FrKRPdcr9Dx/T//qQKPKKOJmUBxwRou5Rq9cdKNe+w+w65zkiyFvJYwRJMsjy61hkPljZB0Q/Ejfrc/UTzX+lHSyzf9QOnDkK9t+TOUJS5czCDBRPT9S/M+Pj+FcbUN5/DRVKEUFBFAs5DQBIBIgHCelcts2SGp1m4Eez/b1vI0MsV/Bx5XM0YCUJRAlVkWGz5RvwG0TnfCkjmAuAxRlwXTfN8oYueRXHO1H6+vZ/OP/fuK5LFtvhDFjY4HoZmpeZETcD5EyYh+HnZRRYEiiQvHjXTpI9KDkTR74bg3jSA0DIwoEjNYkg7D5SXVPuUXycobaP9Ip+bIh0gWf3NEFbvAvY6eaj+wf+R0aIFWXo+CfbjvYyAh3zNMphwFHjJPMMOGr100IKwLY13nlZHmO1/x+W4qAcV0U6jDGf1MO5v/fFX+fx3xF7S86F+jcrVcGLlapLh5/f777UsGT/tJftY8j7ayT4QNx8BhxMNtm3W7FIwqPMOp6OTtQdWiwr6s543Dsbxuta0Ce+BJONKM1dBYPS16gl7dX1BkpM1whUJE/3IB+BqX4G3dOPwuXEm5K/CLlGMdcuQWRtygmQYDuNeauANSOdT87ckuLwZmXCgHq7rtVqVnotBLWGUccDIkc1BMtKQA/53nhYUH7+2Y753ER3eDOMInbDYWsxREM1JU00dDIV4AQZivAguAAgCAQMAgoGDgEJBQ0DCwcPAIiEjIKKho6BiYWNg4uHj4BIRExCSkZOQUlFTUNLR09AyMTMwsrGzsHJxc3Dy8fPwCgkLCIqJi4hKSUtIysnLyCopKyiqqauoamlraOrp6+gaGRsYmpmbmFpZW1ja2dvYOjk7OLq5u7h6eXt4+vn7+AYFBwSGhYeERkVHRMbFx8QmJSckpqWnpGZlZ2Tm5efkFhUXFJaVl5RWVVdU1tXX1DY1NzS2tbe0dnV3dPb19/QODQ8Mjo2PjE5NT0zOzc/MLi0vLK6tr6xubW9s7u3v7B4dHxyenZ+cXl1fXN7d39w+PT88vr2/vH59f3z+/f/8AQdjPAguQARYMU/2Qh7Nc9f92mWf8F3jBoTsUx5VPFUfn0PPNaq7wQPTbIcxuzu11+wueQXcBEnEi5wzVk6y6jv0YeRpjIozOJQdXE19Z3ZRRQFApWKxRwFkArT+MHA5qoghQ/D68C/3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQBB6NACC5ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEH40QILoAIQCpQCoo/y9RqWtIcm+/WzgOUqPrWTqKHprjwanZmUmGs2Yxhjt2dv17xQQ5KRgQUG9iOedcCppcNgzbydxaCqBniG4hh+sTtns0GFzLYaG0eFFfIO7bbC8+1gcwkqkhFKTElg+ApzTFqcNl4f+nxZWmMKqmyF5udfSQ1u6bXvu6Il7/B1qdMH5dqAfo79gwBdsGTfkvzArdxhFCsKJ6oYoOvkO2qsrYY6oz3JTlxJee3KPKRQWBfn8hveY6HCKwv9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQZjUAgugAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBuNYCC8AE/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEH42gILYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172Ff3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQBByJwDC6ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHongMLoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYi8AwugAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqNADC0AAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAABAAABAAEBAEGI/gQLYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6P4EC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQcj/BAtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGogAULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiIEFC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeiBBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIggULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqIMFC2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAQYiEBQtgw0V1huTJDYnVpYUyUyLzKix+mzBmCIhQJBCIfowbDaJokNviT/DkFDqFZBU/beUUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHohAULYGXUGbNSlQgHE4MKtZJfacaPIhfRzDzol+4p3LLKrlujTc6qXeqT4xzrZvuwDyLyCEbW5Uytavay7HxJ/GugQliU05kl1JVIz9DoqEC6nBvBid6g5csTOC6vf4SI2u8OEQBByIUFC2DaD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw7aD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw4AQaiGBQtgP+S8DfU82IKPAZ3fUz6BooHhZTylyvDGlf5QjVLPJXVrinn0UO2FSr3u+Gz9oB0XbMZC8grDJjdw/rbRqsEqfKIUS7r7B0CgKRQ0ZjJ8Ue9rItJOZbqVAN33hszscOMCAEGIhwULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6IcFC2DoZIp5GzbxMCpazn6r3bjz93cVxjrKqBabAv10+C9qwm4ccGBmtzY2YGEbJKukGwUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQciIBQtgcfBxhuTJA83Spc0fRiKrXZUbhdOvQnBYnsu6Ab4Oto7SUNCDbn35A0GHY1RlIPAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGoiQULYDq6jXkbNvvsLFqGkbjdAMGO2isj8Y/ADiFHyvHGPMHVBFx7v0cqIkdZXxzlhPEQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiIoFC2Cuqvz////1Q/3/R+3y/7cyaZ3pokk66Ad6uzKDMfOo7GnA9KAejRTvBgL/PiazCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeiKBQtgw0V1huTJDYnVpYUyUyLzKix+mzBmCIhQJBCIfowbDaJokNviT/DkFDqFZBU/beUUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIiwULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqIwFC2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAQYiNBQtgrqr8////9UP9/0ft8v+3Mmmd6aJJOugHersygzHzqOxpwPSgHo0U7wYC/z4mswoEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHojQULYNGaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVC9oPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDgBByI4FC2DRmlylXVgvPoOBwYY9IZRCMjdii8hEKDgYPhAZ/SqtkrnwfKxPTnkdyF6CffyS1QvRmlylXVgvPoOBwYY9IZRCMjdii8hEKDgYPhAZ/SqtkrnwfKxPTnkdyF6CffyS1QsAQaiPBQtg2g+jWqKnz3t8fpIqwd4X3PG+TmvYjQgvp9R02ocgytEdvM6WZlmiLdKH/bvtfisO0ZpcpV1YLz6DgcGGPSGUQjI3YovIRCg4GD4QGf0qrZK58HysT055Hchegn38ktULAEGIkAULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6JAFC2Bx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQciRBQtg6GSKeRs28TAqWs5+q9248/d3FcY6yqgWmwL9dPgvasJuHHBgZrc2NmBhGySrpBsFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGokgULYOhkinkbNvEwKlrOfqvduPP3dxXGOsqoFpsC/XT4L2rCbhxwYGa3NjZgYRskq6QbBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiJMFC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeiTBQtgcfBxhuTJA83Spc0fRiKrXZUbhdOvQnBYnsu6Ab4Oto7SUNCDbn35A0GHY1RlIPAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIlAULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqJUFC2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADoZIp5GzbxMCpazn6r3bjz93cVxjrKqBabAv10+C9qwm4ccGBmtzY2YGEbJKukGwUAQYiWBQtgOrqNeRs2++wsWoaRuN0AwY7aKyPxj8AOIUfK8cY8wdUEXHu/RyoiR1lfHOWE8RABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHolgULYGzGQvIKwyY3cP620arBKnyiFEu6+wdAoCkUNGYyfFHvayLSTmW6lQDd94bM7HDjAj/kvA31PNiCjwGd31M+gaKB4WU8pcrwxpX+UI1SzyV1a4p59FDthUq97vhs/aAdFwBByJcFC2DaD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw7aD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw4AQaiYBQtgRtblTK1q9rLsfEn8a6BCWJTTmSXUlUjP0OioQLqcG8GJ3qDlyxM4Lq9/hIja7w4RZdQZs1KVCAcTgwq1kl9pxo8iF9HMPOiX7incssquW6NNzqpd6pPjHOtm+7APIvIIAEGImQULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6JkFC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQciaBQtg/f8CAAAACXYCAAzECwD067pYx1NXmEhfRVdScFNYzndt7FailxoHXJPkgPrDXvYVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGomwULYK6q/P////VD/f9H7fL/tzJpnemiSTroB3q7MoMx86jsacD0oB6NFO8GAv8+JrMKBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiJwFC2Cuqvz////1Q/3/R+3y/7cyaZ3pokk66Ad6uzKDMfOo7GnA9KAejRTvBgL/PiazCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeicBQtgrqr8////9UP9/0ft8v+3Mmmd6aJJOugHersygzHzqOxpwPSgHo0U7wYC/z4mswoEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHInQULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqJ4FC2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABx8HGG5MkDzdKlzR9GIqtdlRuF069CcFiey7oBvg62jtJQ0INuffkDQYdjVGUg8BgAQYifBQtgw0V1huTJDYnVpYUyUyLzKix+mzBmCIhQJBCIfowbDaJokNviT/DkFDqFZBU/beUUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHonwULYEbW5Uytavay7HxJ/GugQliU05kl1JVIz9DoqEC6nBvBid6g5csTOC6vf4SI2u8OEWXUGbNSlQgHE4MKtZJfacaPIhfRzDzol+4p3LLKrlujTc6qXeqT4xzrZvuwDyLyCABByKAFC2DRmlylXVgvPoOBwYY9IZRCMjdii8hEKDgYPhAZ/SqtkrnwfKxPTnkdyF6CffyS1QvRmlylXVgvPoOBwYY9IZRCMjdii8hEKDgYPhAZ/SqtkrnwfKxPTnkdyF6CffyS1QsAQaihBQtgbMZC8grDJjdw/rbRqsEqfKIUS7r7B0CgKRQ0ZjJ8Ue9rItJOZbqVAN33hszscOMCP+S8DfU82IKPAZ3fUz6BooHhZTylyvDGlf5QjVLPJXVrinn0UO2FSr3u+Gz9oB0XAEGIogULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB6KIFC2DoZIp5GzbxMCpazn6r3bjz93cVxjrKqBabAv10+C9qwm4ccGBmtzY2YGEbJKukGwUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQcijBQtgcfBxhuTJA83Spc0fRiKrXZUbhdOvQnBYnsu6Ab4Oto7SUNCDbn35A0GHY1RlIPAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGopAULYHHwcYbkyQPN0qXNH0Yiq12VG4XTr0JwWJ7LugG+DraO0lDQg259+QNBh2NUZSDwGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBiKUFC2D9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQeilBQtg6GSKeRs28TAqWs5+q9248/d3FcY6yqgWmwL9dPgvasJuHHBgZrc2NmBhGySrpBsFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHIpgULYP3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqKcFC2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/wIAAAAJdgIADMQLAPTruljHU1eYSF9FV1JwU1jOd23sVqKXGgdck+SA+sNe9hUAQYioBQtgrqr8////9UP9/0ft8v+3Mmmd6aJJOugHersygzHzqOxpwPSgHo0U7wYC/z4mswoEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHoqAULYNoPo1qip897fH6SKsHeF9zxvk5r2I0IL6fUdNqHIMrRHbzOlmZZoi3Sh/277X4rDtGaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVCwBByKkFC2DaD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw7aD6NaoqfPe3x+kirB3hfc8b5Oa9iNCC+n1HTahyDK0R28zpZmWaIt0of9u+1+Kw4AQaiqBQtg0ZpcpV1YLz6DgcGGPSGUQjI3YovIRCg4GD4QGf0qrZK58HysT055Hchegn38ktUL2g+jWqKnz3t8fpIqwd4X3PG+TmvYjQgvp9R02ocgytEdvM6WZlmiLdKH/bvtfisOAEGIqwULMHHwcYbkyQPN0qXNH0Yiq12VG4XTr0JwWJ7LugG+DraO0lDQg259+QNBh2NUZSDwGABBuKsFCzDoZIp5GzbxMCpazn6r3bjz93cVxjrKqBabAv10+C9qwm4ccGBmtzY2YGEbJKukGwUAQeirBQsQVVVVVQAAAABW4VVVAIxsOQBByK4FC2BUVQEAAAAEGAEAsDoFAFCFbyc8JXy1PGMCtesx7NEibqJM0fImYZHTlmUAGle4+xdXVf7////6of7/o3b5/1uZtM500SQd9AO9XZnBmHlU9jRgelCPRop3A4F/H5NZBQIAQaivBQswcfBxhuTJA83Spc0fRiKrXZUbhdOvQnBYnsu6Ab4Oto7SUNCDbn35A0GHY1RlIPAYAEHYrwULYNGaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVC9GaXKVdWC8+g4HBhj0hlEIyN2KLyEQoOBg+EBn9Kq2SufB8rE9OeR3IXoJ9/JLVCwBBuLAFCwgAAAEAAAAB0gBB8MUFC6AEEHX1XbW5vMAk+4vmMIb5JYn01fvI+wZEoJEh0ZGEL45pgG8KZXGdPoCrTB0BL2wiGZFIF0d89mfXkoXYG4g/rx0W0u6e5GcaGLKuaXiMt+W8ez8EFJNT9q4acPI3JfZzKi1i6RDJ8a/UqcqSNDGDYhk9qL7CPi8uc6ovsJ/nx6ThG5bXf2NJbEV3gejciugIF5k5Nno/3jU2nHUxfJ8dnLAgqE7CE576fVcDpEdpxT+3zlz83LbBpKa8ZnA2gb0bdSfGC++jGAQQ4PmpcZu/SRcLtn0JkRJRHI8w5cZFg0nC162dsSOIbSyVVtXtTACSlfE+wD7sa0yt5kwEIK0fCo2UFc0JMV3F0As/LMBGTzM5V8A062JaO6V2Fh1BOEVyNDRG0FobehIpAVvIxXSkYV6W74YojvyNQxKfRe8vU5YSBMHNaXHuQCqyS7eOpkCcC01o9JCHESUfwNTIk8JrWRISYSd/g2QQ5N0kvxD7fwfzASvNC1efxJNGN0zyWwwatjrHmzWlDTXdrNfkkw1n0la2Gm64mZDTDSuOl0iBMhmIDms4FPQTsaSaDWPi3KAHGDN1k7vnJ6lvRkmtaKpH4/TqbxDW0AocDw86/4Pucshcg2CmuUNOB5ruz+n136rAqa3ex4yOaTAsPzWrdjcH0UM63LoXhYQXqRSNP6G6Y3PQB0V9P3uX1JMB7okKHGpJwKm94bclyNy1He4CAAAAAABBkNAFC0EAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAABAAABAP8AAQ==";
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

        const f = module.addFunction(prefix+"_mul");
        f.addParam("x", "i32");
        f.addParam("y", "i32");
        f.addParam("r", "i32");
        f.addLocal("c0", "i64");
        f.addLocal("c1", "i64");
        f.addLocal("np32", "i64");


        for (let i=0;i<n32; i++) {
            f.addLocal("x"+i, "i64");
            f.addLocal("y"+i, "i64");
            f.addLocal("m"+i, "i64");
            f.addLocal("q"+i, "i64");
        }

        const c = f.getCodeBuilder();

        const np32 = Number(0x100000000n - modInv$2(q, 0x100000000n));

        f.addCode(c.setLocal("np32", c.i64_const(np32)));


        const loadX = [];
        const loadY = [];
        const loadQ = [];
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

        function mulqm(i, j) {
            let Q,M;
            if (!loadQ[i]) {
                Q = c.teeLocal("q"+i, c.i64_load32_u(c.i32_const(0), pq+i*4 ));
                loadQ[i] = true;
            } else {
                Q = c.getLocal("q"+i);
            }
            M = c.getLocal("m"+j);

            return c.i64_mul( Q, M );
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


            for (let i=Math.max(1, k-n32+1); (i<=k)&&(i<n32); i++) {
                const j= k-i;

                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulqm(i,j)
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
            if (k<n32) {
                f.addCode(
                    c.setLocal(
                        "m"+k,
                        c.i64_and(
                            c.i64_mul(
                                c.i64_and(
                                    c.getLocal(c0),
                                    c.i64_const(0xFFFFFFFF)
                                ),
                                c.getLocal("np32")
                            ),
                            c.i64_const("0xFFFFFFFF")
                        )
                    )
                );


                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulqm(0,k)
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


            if (k>=n32) {
                f.addCode(
                    c.i64_store32(
                        c.getLocal("r"),
                        (k-n32)*4,
                        c.getLocal(c0)
                    )
                );
            }
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
                n32*4-4,
                c.getLocal(c0)
            )
        );

        f.addCode(
            c.if(
                c.i32_wrap_i64(c.getLocal(c1)),
                c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                c.if(
                    c.call(intPrefix+"_gte", c.getLocal("r"), c.i32_const(pq)  ),
                    c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                )
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
        f.addLocal("np32", "i64");


        for (let i=0;i<n32; i++) {
            f.addLocal("x"+i, "i64");
            f.addLocal("m"+i, "i64");
            f.addLocal("q"+i, "i64");
        }

        const c = f.getCodeBuilder();

        const np32 = Number(0x100000000n - modInv$2(q, 0x100000000n));

        f.addCode(c.setLocal("np32", c.i64_const(np32)));


        const loadX = [];
        const loadQ = [];
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

        function mulqm(i, j) {
            let Q,M;
            if (!loadQ[i]) {
                Q = c.teeLocal("q"+i, c.i64_load32_u(c.i32_const(0), pq+i*4 ));
                loadQ[i] = true;
            } else {
                Q = c.getLocal("q"+i);
            }
            M = c.getLocal("m"+j);

            return c.i64_mul( Q, M );
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


            for (let i=Math.max(1, k-n32+1); (i<=k)&&(i<n32); i++) {
                const j= k-i;

                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulqm(i,j)
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
            if (k<n32) {
                f.addCode(
                    c.setLocal(
                        "m"+k,
                        c.i64_and(
                            c.i64_mul(
                                c.i64_and(
                                    c.getLocal(c0),
                                    c.i64_const(0xFFFFFFFF)
                                ),
                                c.getLocal("np32")
                            ),
                            c.i64_const("0xFFFFFFFF")
                        )
                    )
                );


                f.addCode(
                    c.setLocal(c0,
                        c.i64_add(
                            c.i64_and(
                                c.getLocal(c0),
                                c.i64_const(0xFFFFFFFF)
                            ),
                            mulqm(0,k)
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

            if (k>=n32) {
                f.addCode(
                    c.i64_store32(
                        c.getLocal("r"),
                        (k-n32)*4,
                        c.getLocal(c0)
                    )
                );
            }
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
                n32*4-4,
                c.getLocal(c0_old)
            )
        );

        f.addCode(
            c.if(
                c.i32_wrap_i64(c.getLocal(c1_old)),
                c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                c.if(
                    c.call(intPrefix+"_gte", c.getLocal("r"), c.i32_const(pq)  ),
                    c.drop(c.call(intPrefix+"_sub", c.getLocal("r"), c.i32_const(pq), c.getLocal("r"))),
                )
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
