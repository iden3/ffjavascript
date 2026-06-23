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

let workerSource;

const threadStr = `(${"function thread(self) {\n    const MAXMEM = 32767;\n    let instance;\n    let memory;\n    let terminationTimeout = 1500; // milliseconds\n    let terminationTimer;\n    let wantToTerminate = false;\n\n    if (self) {\n        self.onmessage = function(e) {\n            let data;\n            if (e.data) {\n                data = e.data;\n            } else {\n                data = e;\n            }\n\n            try {\n                if (data[0].cmd === \"INIT\") {\n                    init(data[0]).then(function() {\n                        self.postMessage({status: \"initialized\"});\n                        // Start idle timer only after init completes so it never\n                        // fires during async WASM compilation.\n                        scheduleTermination();\n                    });\n                    return; // skip the scheduleTermination() call at the bottom\n                } else if (data[0].cmd === \"TERMINATE\") {\n                    terminate();\n                } else {\n                    let terminateAfterTask = false;\n                    if (data[data.length-1].cmd === \"TERMINATE\") {\n                        terminateAfterTask = true;\n                        data.pop();\n                    }\n                    const res = runTask(data);\n                    let transfers = [];\n                    for (let i=0; i<res.length; i++) {\n                        if (res[i] instanceof Uint8Array) {\n                            transfers.push(res[i].buffer);\n                        }\n                    }\n                    self.postMessage(res, transfers);\n                    if (terminateAfterTask) {\n                        terminate();\n                    }\n                }\n            } catch (err) {\n                // Catch any error and send it back to main thread\n                self.postMessage({error: err.message});\n            }\n            scheduleTermination();\n        };\n    }\n\n    async function init(data) {\n        let wasmModule;\n        if (data.code instanceof WebAssembly.Module) {\n            console.log(\"Using precompiled WebAssembly.Module\");\n            wasmModule = data.code;\n        } else {\n            console.log(\"Compiling WebAssembly.Module\");\n            const code = new Uint8Array(data.code);\n            wasmModule = await WebAssembly.compile(code);\n        }\n        memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});\n\n        console.log(\"Initialized thread with memory\", memory.buffer.byteLength / 1024 / 1024, \"MB\");\n\n        instance = await WebAssembly.instantiate(wasmModule, {\n            env: {\n                \"memory\": memory\n            }\n        });\n\n        if (data.terminationTimeout) {\n            terminationTimeout = data.terminationTimeout;\n        }\n    }\n\n\n\n    // Reverse the low `bits` of a 32-bit integer (O(1) bit-twiddle).\n    function rev32(x) {\n        x = ((x & 0x55555555) << 1) | ((x >>> 1) & 0x55555555);\n        x = ((x & 0x33333333) << 2) | ((x >>> 2) & 0x33333333);\n        x = ((x & 0x0f0f0f0f) << 4) | ((x >>> 4) & 0x0f0f0f0f);\n        x = ((x & 0x00ff00ff) << 8) | ((x >>> 8) & 0x00ff00ff);\n        x = (x << 16) | (x >>> 16);\n        return x >>> 0;\n    }\n\n    // In-place bit-reversal permutation of fixed-size (sIn-byte) elements.\n    // Works for any element size, like the old pure-JS buffReverseBits. When\n    // the elements are 4-byte aligned it swaps Uint32Array lanes (no BigInt\n    // boxing, no allocation); otherwise it falls back to a byte-wise swap with\n    // a single reused temp buffer. Either way it touches no WASM linear memory.\n    function reverseInPlace(u8, sIn, bits) {\n        const n = u8.byteLength / sIn;\n        const shift = 32 - bits;\n        if (((sIn & 3) === 0) && ((u8.byteOffset & 3) === 0)) {\n            const lanes = sIn >>> 2;\n            const u32 = new Uint32Array(u8.buffer, u8.byteOffset, u8.byteLength >>> 2);\n            for (let i = 0; i < n; i++) {\n                const ri = rev32(i) >>> shift;\n                if (i < ri) {\n                    let a = i * lanes;\n                    let b = ri * lanes;\n                    for (let l = 0; l < lanes; l++) {\n                        const t = u32[a + l];\n                        u32[a + l] = u32[b + l];\n                        u32[b + l] = t;\n                    }\n                }\n            }\n        } else {\n            const tmp = new Uint8Array(sIn);   // one reused temp, not one per swap\n            for (let i = 0; i < n; i++) {\n                const ri = rev32(i) >>> shift;\n                if (i < ri) {\n                    const ao = i * sIn;\n                    const bo = ri * sIn;\n                    tmp.set(u8.subarray(ao, ao + sIn));\n                    u8.copyWithin(ao, bo, bo + sIn);\n                    u8.set(tmp, bo);\n                }\n            }\n        }\n    }\n\n    function alloc(length) {\n        const u32 = new Uint32Array(memory.buffer, 0, 1);\n        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers\n        const res = u32[0];\n        u32[0] += length;\n        if (u32[0] + length > memory.buffer.byteLength) {\n            const currentPages = memory.buffer.byteLength / 0x10000;\n            let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;\n            if (requiredPages>MAXMEM) requiredPages=MAXMEM;\n            memory.grow(requiredPages-currentPages);\n            console.log(\"Growing memory to\", memory.buffer.byteLength / 1024 / 1024, \"MB\");\n        }\n        return res;\n    }\n\n    function allocBuffer(buffer) {\n        const p = alloc(buffer.byteLength);\n        setBuffer(p, buffer);\n        return p;\n    }\n\n    function getBuffer(pointer, length) {\n        return new Uint8Array(memory.buffer, pointer, length);\n    }\n\n    function setBuffer(pointer, buffer) {\n        const u8 = new Uint8Array(memory.buffer);\n        u8.set(new Uint8Array(buffer), pointer);\n    }\n\n    function runTask(task) {\n        clearTimeout(terminationTimer);\n        wantToTerminate = false;\n        if (task[0].cmd === \"INIT\") {\n            return init(task[0]);\n        }\n        const ctx = {\n            vars: [],\n            out: []\n        };\n        const u32a = new Uint32Array(memory.buffer, 0, 1);\n        const oldAlloc = u32a[0];\n        for (let i=0; i<task.length; i++) {\n            switch (task[i].cmd) {\n            case \"REVERSE\": {\n                // Reverse the transferred buffer in place and hand it straight\n                // back. No SharedArrayBuffer and no WASM memory: the buffer is\n                // transferred in and out (zero copy) and reversed where it lies.\n                const t = task[i];\n                reverseInPlace(t.src, t.sIn, t.bits);\n                ctx.out[0] = t.src;\n                break;\n            }\n            case \"ALLOCSET\":\n                if (task[i].len / 1024 / 1024 > 25) {\n                    console.log(\"tasks\", task);\n                    //console.trace();\n                }\n                ctx.vars[task[i].var] = allocBuffer(task[i].buff);\n                break;\n            case \"ALLOC\":\n                if (task[i].len / 1024 / 1024 > 25) {\n                    console.log(\"tasks\", task);\n                    //console.trace();\n                }\n                ctx.vars[task[i].var] = alloc(task[i].len);\n                break;\n            case \"SET\":\n                setBuffer(ctx.vars[task[i].var], task[i].buff);\n                break;\n            case \"CALL\": {\n                const params = [];\n                for (let j=0; j<task[i].params.length; j++) {\n                    const p = task[i].params[j];\n                    if (typeof p.var !== \"undefined\") {\n                        params.push(ctx.vars[p.var] + (p.offset || 0));\n                    } else if (typeof p.val != \"undefined\") {\n                        params.push(p.val);\n                    }\n                }\n                instance.exports[task[i].fnName](...params);\n                break;\n            }\n            case \"GET\":\n                ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();\n                break;\n            default:\n                throw new Error(\"Invalid cmd\");\n            }\n        }\n        const u32b = new Uint32Array(memory.buffer, 0, 1);\n        u32b[0] = oldAlloc;\n\n        return ctx.out;\n    }\n\n    function scheduleTermination() {\n        clearTimeout(terminationTimer);\n        if (terminationTimeout > 0) {\n            terminationTimer = setTimeout(() => {\n                // 2-phase termination: notify main thread first; close only after\n                // it acks with TERMINATE. This prevents the race where the main\n                // thread dispatches a task to a worker that has already closed.\n                wantToTerminate = true;\n                if (self) self.postMessage({status: \"want_to_terminate\"});\n            }, terminationTimeout);\n        }\n    }\n\n    function terminate() {\n        clearTimeout(terminationTimer);\n        if (self) {\n            console.log(\"TERMINATE\");\n            self.postMessage({status: \"terminated\"});\n            self.close();\n        }\n    }\n\n    return runTask;\n}"})(self)`;
if (isNode) {
    workerSource = "data:application/javascript;base64," + Buffer.from(threadStr).toString("base64");
} else if (globalThis?.Blob && globalThis.URL && globalThis.URL.createObjectURL) {
    const threadBytes = new TextEncoder().encode(threadStr);
    const workerBlob = new Blob([threadBytes], { type: "application/javascript" });
    workerSource = URL.createObjectURL(workerBlob);
} else {
    workerSource = "data:application/javascript;base64," + globalThis.btoa(threadStr);
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
        const nativeWorker = new Worker(workerSource);
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

// Pure-JS base64 -> Uint8Array. Uses neither atob nor Buffer, so it resolves the
// same in Node, browsers, extensions, and SES/Snap realms. Used once at curve
// load to decode the vendored (uncompressed) wasm bytes.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const LOOKUP = new Uint8Array(256);
for (let i = 0; i < CHARS.length; i++) LOOKUP[CHARS.charCodeAt(i)] = i;

function base64ToUint8Array(b64) {
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

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a MetaMask Snap / SES lockdown realm) throws at module load.
let curve_bn128 = null;

async function buildBn128$1(singleThread, plugins) {
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

    //console.log("bn128wasm:", bn128wasm);

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
const code = "AGFzbQEAAAABlAESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCn9/f39/f39/f38AYAV/f39/fwF/YAd/f39/f39/AX9gCX9/f39/f39/fwF/YAt/f39/f39/f39/fwF/Ag8BA2VudgZtZW1vcnkCABkD0wLRAgABAgEDAwQEBQAABgcIBQIFBQAABQAAAAACAgABBQgJBQUFCAgICAACAAECAQMDBAQFAAAGBwgFAgUFAAAFAAAAAAICAAEFCAkFBQUICAgIAAIFAAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAICBQAFAAAAAAUFBQUFCgALCQoACwkICAMACAgCAAAJDAwFBQwACA0JCAICAQEABQUABQUAAAAAAwAIAgIJCAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAICBQAFAAAAAAUFBQUFCgALCQoACwkICAUDAAgIAgAACQwMBQUMBQMACAgCAAAJDAwFBQwFBQkJCQkJAAICAQEABQAFBQACAAADAAgCCQgAAgIBAQAFBQAFBQAAAAADAAgCAgkIAAIFCAkFAAAAAAAAAAAAAAICAgIFAAAABQAAAAAEDg8QEQUHzie9AglpbnRxX2NvcHkAAAlpbnRxX3plcm8AAQhpbnRxX29uZQADC2ludHFfaXNaZXJvAAIHaW50cV9lcQAECGludHFfZ3RlAAUIaW50cV9hZGQABghpbnRxX3N1YgAHCGludHFfbXVsAAgLaW50cV9zcXVhcmUACQ5pbnRxX3NxdWFyZU9sZAAKCGludHFfZGl2AA0PaW50cV9pbnZlcnNlTW9kAA4IZjFtX2NvcHkAAAhmMW1femVybwABCmYxbV9pc1plcm8AAgZmMW1fZXEABAdmMW1fYWRkABAHZjFtX3N1YgARB2YxbV9uZWcAEg5mMW1faXNOZWdhdGl2ZQAZCWYxbV9pc09uZQAPCGYxbV9zaWduABoLZjFtX21SZWR1Y3QAEwdmMW1fbXVsABQKZjFtX3NxdWFyZQAVDWYxbV9zcXVhcmVPbGQAFhJmMW1fZnJvbU1vbnRnb21lcnkAGBBmMW1fdG9Nb250Z29tZXJ5ABcLZjFtX2ludmVyc2UAGwdmMW1fb25lABwIZjFtX2xvYWQAHQ9mMW1fdGltZXNTY2FsYXIAHgdmMW1fZXhwACYQZjFtX2JhdGNoSW52ZXJzZQAfCGYxbV9zcXJ0ACcMZjFtX2lzU3F1YXJlACgVZjFtX2JhdGNoVG9Nb250Z29tZXJ5ACAXZjFtX2JhdGNoRnJvbU1vbnRnb21lcnkAIQlpbnRyX2NvcHkAKQlpbnRyX3plcm8AKghpbnRyX29uZQAsC2ludHJfaXNaZXJvACsHaW50cl9lcQAtCGludHJfZ3RlAC4IaW50cl9hZGQALwhpbnRyX3N1YgAwCGludHJfbXVsADELaW50cl9zcXVhcmUAMg5pbnRyX3NxdWFyZU9sZAAzCGludHJfZGl2ADYPaW50cl9pbnZlcnNlTW9kADcIZnJtX2NvcHkAKQhmcm1femVybwAqCmZybV9pc1plcm8AKwZmcm1fZXEALQdmcm1fYWRkADkHZnJtX3N1YgA6B2ZybV9uZWcAOw5mcm1faXNOZWdhdGl2ZQBCCWZybV9pc09uZQA4CGZybV9zaWduAEMLZnJtX21SZWR1Y3QAPAdmcm1fbXVsAD0KZnJtX3NxdWFyZQA+DWZybV9zcXVhcmVPbGQAPxJmcm1fZnJvbU1vbnRnb21lcnkAQRBmcm1fdG9Nb250Z29tZXJ5AEALZnJtX2ludmVyc2UARAdmcm1fb25lAEUIZnJtX2xvYWQARg9mcm1fdGltZXNTY2FsYXIARwdmcm1fZXhwAE8QZnJtX2JhdGNoSW52ZXJzZQBICGZybV9zcXJ0AFAMZnJtX2lzU3F1YXJlAFEVZnJtX2JhdGNoVG9Nb250Z29tZXJ5AEkXZnJtX2JhdGNoRnJvbU1vbnRnb21lcnkASgZmcl9hZGQAOQZmcl9zdWIAOgZmcl9uZWcAOwZmcl9tdWwAUglmcl9zcXVhcmUAUwpmcl9pbnZlcnNlAFQNZnJfaXNOZWdhdGl2ZQBVB2ZyX2NvcHkAKQdmcl96ZXJvACoGZnJfb25lAEUJZnJfaXNaZXJvACsFZnJfZXEALQxnMW1fbXVsdGlleHAAgAESZzFtX211bHRpZXhwX2NodW5rAH8SZzFtX211bHRpZXhwQWZmaW5lAIQBGGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawCDAQpnMW1faXNaZXJvAFcQZzFtX2lzWmVyb0FmZmluZQBWBmcxbV9lcQBfC2cxbV9lcU1peGVkAF4MZzFtX2VxQWZmaW5lAF0IZzFtX2NvcHkAWw5nMW1fY29weUFmZmluZQBaCGcxbV96ZXJvAFkOZzFtX3plcm9BZmZpbmUAWApnMW1fZG91YmxlAGEQZzFtX2RvdWJsZUFmZmluZQBgB2cxbV9hZGQAZAxnMW1fYWRkTWl4ZWQAYw1nMW1fYWRkQWZmaW5lAGIHZzFtX25lZwBmDWcxbV9uZWdBZmZpbmUAZQdnMW1fc3ViAGkMZzFtX3N1Yk1peGVkAGgNZzFtX3N1YkFmZmluZQBnEmcxbV9mcm9tTW9udGdvbWVyeQBrGGcxbV9mcm9tTW9udGdvbWVyeUFmZmluZQBqEGcxbV90b01vbnRnb21lcnkAbRZnMW1fdG9Nb250Z29tZXJ5QWZmaW5lAGwPZzFtX3RpbWVzU2NhbGFyAIUBFWcxbV90aW1lc1NjYWxhckFmZmluZQCGAQ1nMW1fbm9ybWFsaXplAHIKZzFtX0xFTXRvVQB0CmcxbV9MRU10b0MAdQpnMW1fVXRvTEVNAHYKZzFtX0N0b0xFTQB3D2cxbV9iYXRjaExFTXRvVQB4D2cxbV9iYXRjaExFTXRvQwB5D2cxbV9iYXRjaFV0b0xFTQB6D2cxbV9iYXRjaEN0b0xFTQB7DGcxbV90b0FmZmluZQBuDmcxbV90b0phY29iaWFuAFwRZzFtX2JhdGNoVG9BZmZpbmUAcRNnMW1fYmF0Y2hUb0phY29iaWFuAHwLZzFtX2luQ3VydmUAcBFnMW1faW5DdXJ2ZUFmZmluZQBvF2ZybV9fcmV2ZXJzZVBlcm11dGF0aW9uAIgBB2ZybV9mZnQAjAEIZnJtX2lmZnQAjQEKZnJtX3Jhd2ZmdACKAQtmcm1fZmZ0Sm9pbgCOAQ5mcm1fZmZ0Sm9pbkV4dACPARFmcm1fZmZ0Sm9pbkV4dEludgCQAQpmcm1fZmZ0TWl4AJEBDGZybV9mZnRGaW5hbACSAR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgCTAQhwb2xfemVybwCUAQ9wb2xfY29uc3RydWN0TEMAlQEMcWFwX2J1aWxkQUJDAJYBC3FhcF9qb2luQUJDAJcBDHFhcF9iYXRjaEFkZACYAQpmMm1faXNaZXJvAJkBCWYybV9pc09uZQCaAQhmMm1femVybwCbAQdmMm1fb25lAJwBCGYybV9jb3B5AJ0BB2YybV9tdWwAngEIZjJtX211bDEAnwEKZjJtX3NxdWFyZQCgAQdmMm1fYWRkAKEBB2YybV9zdWIAogEHZjJtX25lZwCjAQhmMm1fc2lnbgCqAQ1mMm1fY29uanVnYXRlAKQBEmYybV9mcm9tTW9udGdvbWVyeQCmARBmMm1fdG9Nb250Z29tZXJ5AKUBBmYybV9lcQCnAQtmMm1faW52ZXJzZQCoAQdmMm1fZXhwAK0BD2YybV90aW1lc1NjYWxhcgCpARBmMm1fYmF0Y2hJbnZlcnNlAKwBCGYybV9zcXJ0AK4BDGYybV9pc1NxdWFyZQCvAQ5mMm1faXNOZWdhdGl2ZQCrAQxnMm1fbXVsdGlleHAA2gESZzJtX211bHRpZXhwX2NodW5rANkBEmcybV9tdWx0aWV4cEFmZmluZQDeARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsA3QEKZzJtX2lzWmVybwCxARBnMm1faXNaZXJvQWZmaW5lALABBmcybV9lcQC5AQtnMm1fZXFNaXhlZAC4AQxnMm1fZXFBZmZpbmUAtwEIZzJtX2NvcHkAtQEOZzJtX2NvcHlBZmZpbmUAtAEIZzJtX3plcm8AswEOZzJtX3plcm9BZmZpbmUAsgEKZzJtX2RvdWJsZQC7ARBnMm1fZG91YmxlQWZmaW5lALoBB2cybV9hZGQAvgEMZzJtX2FkZE1peGVkAL0BDWcybV9hZGRBZmZpbmUAvAEHZzJtX25lZwDAAQ1nMm1fbmVnQWZmaW5lAL8BB2cybV9zdWIAwwEMZzJtX3N1Yk1peGVkAMIBDWcybV9zdWJBZmZpbmUAwQESZzJtX2Zyb21Nb250Z29tZXJ5AMUBGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQDEARBnMm1fdG9Nb250Z29tZXJ5AMcBFmcybV90b01vbnRnb21lcnlBZmZpbmUAxgEPZzJtX3RpbWVzU2NhbGFyAN8BFWcybV90aW1lc1NjYWxhckFmZmluZQDgAQ1nMm1fbm9ybWFsaXplAMwBCmcybV9MRU10b1UAzgEKZzJtX0xFTXRvQwDPAQpnMm1fVXRvTEVNANABCmcybV9DdG9MRU0A0QEPZzJtX2JhdGNoTEVNdG9VANIBD2cybV9iYXRjaExFTXRvQwDTAQ9nMm1fYmF0Y2hVdG9MRU0A1AEPZzJtX2JhdGNoQ3RvTEVNANUBDGcybV90b0FmZmluZQDIAQ5nMm1fdG9KYWNvYmlhbgC2ARFnMm1fYmF0Y2hUb0FmZmluZQDLARNnMm1fYmF0Y2hUb0phY29iaWFuANYBC2cybV9pbkN1cnZlAMoBEWcybV9pbkN1cnZlQWZmaW5lAMkBC2cxbV90aW1lc0ZyAOEBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uAOMBB2cxbV9mZnQA5wEIZzFtX2lmZnQA6AEKZzFtX3Jhd2ZmdADlAQtnMW1fZmZ0Sm9pbgDpAQ5nMW1fZmZ0Sm9pbkV4dADqARFnMW1fZmZ0Sm9pbkV4dEludgDrAQpnMW1fZmZ0TWl4AOwBDGcxbV9mZnRGaW5hbADtAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDuAQtnMm1fdGltZXNGcgDvARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDxAQdnMm1fZmZ0APUBCGcybV9pZmZ0APYBCmcybV9yYXdmZnQA8wELZzJtX2ZmdEpvaW4A9wEOZzJtX2ZmdEpvaW5FeHQA+AERZzJtX2ZmdEpvaW5FeHRJbnYA+QEKZzJtX2ZmdE1peAD6AQxnMm1fZmZ0RmluYWwA+wEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A/AERZzFtX3RpbWVzRnJBZmZpbmUA/QERZzJtX3RpbWVzRnJBZmZpbmUA/gERZnJtX2JhdGNoQXBwbHlLZXkA/wERZzFtX2JhdGNoQXBwbHlLZXkAgAIWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZACBAhFnMm1fYmF0Y2hBcHBseUtleQCCAhZnMm1fYmF0Y2hBcHBseUtleU1peGVkAIMCCmY2bV9pc1plcm8AhQIJZjZtX2lzT25lAIYCCGY2bV96ZXJvAIcCB2Y2bV9vbmUAiAIIZjZtX2NvcHkAiQIHZjZtX211bACKAgpmNm1fc3F1YXJlAIsCB2Y2bV9hZGQAjAIHZjZtX3N1YgCNAgdmNm1fbmVnAI4CCGY2bV9zaWduAI8CEmY2bV9mcm9tTW9udGdvbWVyeQCRAhBmNm1fdG9Nb250Z29tZXJ5AJACBmY2bV9lcQCSAgtmNm1faW52ZXJzZQCTAgdmNm1fZXhwAJcCD2Y2bV90aW1lc1NjYWxhcgCUAhBmNm1fYmF0Y2hJbnZlcnNlAJYCDmY2bV9pc05lZ2F0aXZlAJUCCmZ0bV9pc1plcm8AmQIJZnRtX2lzT25lAJoCCGZ0bV96ZXJvAJsCB2Z0bV9vbmUAnAIIZnRtX2NvcHkAnQIHZnRtX211bACeAghmdG1fbXVsMQCfAgpmdG1fc3F1YXJlAKACB2Z0bV9hZGQAoQIHZnRtX3N1YgCiAgdmdG1fbmVnAKMCCGZ0bV9zaWduAKoCDWZ0bV9jb25qdWdhdGUApAISZnRtX2Zyb21Nb250Z29tZXJ5AKYCEGZ0bV90b01vbnRnb21lcnkApQIGZnRtX2VxAKcCC2Z0bV9pbnZlcnNlAKgCB2Z0bV9leHAArQIPZnRtX3RpbWVzU2NhbGFyAKkCEGZ0bV9iYXRjaEludmVyc2UArAIIZnRtX3NxcnQArgIMZnRtX2lzU3F1YXJlAK8CDmZ0bV9pc05lZ2F0aXZlAKsCEWZ0bV9mcm9iZW5pdXNNYXAwALQCEWZ0bV9mcm9iZW5pdXNNYXAxALUCEWZ0bV9mcm9iZW5pdXNNYXAyALYCEWZ0bV9mcm9iZW5pdXNNYXAzALcCEWZ0bV9mcm9iZW5pdXNNYXA0ALgCEWZ0bV9mcm9iZW5pdXNNYXA1ALkCEWZ0bV9mcm9iZW5pdXNNYXA2ALoCEWZ0bV9mcm9iZW5pdXNNYXA3ALsCEWZ0bV9mcm9iZW5pdXNNYXA4ALwCEWZ0bV9mcm9iZW5pdXNNYXA5AL0CE2JsczEyMzgxX3BhaXJpbmdFcTEAywITYmxzMTIzODFfcGFpcmluZ0VxMgDMAhNibHMxMjM4MV9wYWlyaW5nRXEzAM0CE2JsczEyMzgxX3BhaXJpbmdFcTQAzgITYmxzMTIzODFfcGFpcmluZ0VxNQDPAhBibHMxMjM4MV9wYWlyaW5nANACEmJsczEyMzgxX3ByZXBhcmVHMQDEAhJibHMxMjM4MV9wcmVwYXJlRzIAxQITYmxzMTIzODFfbWlsbGVyTG9vcADGAhxibHMxMjM4MV9maW5hbEV4cG9uZW50aWF0aW9uAMoCH2JsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAxwIaYmxzMTIzODFfX2N5Y2xvdG9taWNTcXVhcmUAyAIaYmxzMTIzODFfX2N5Y2xvdG9taWNFeHBfdzAAyQIIZjZtX211bDEAsAIJZjZtX211bDAxALECCmZ0bV9tdWwwMTQAsgIRZzFtX2luR3JvdXBBZmZpbmUAvgILZzFtX2luR3JvdXAAvwIRZzJtX2luR3JvdXBBZmZpbmUAwAILZzJtX2luR3JvdXAAwQIKwJUF0QI+ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKAssACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxggAEIANwMgIABCADcDKAtNACAAKQMoUARAIAApAyBQBEAgACkDGFAEQCAAKQMQUARAIAApAwhQBEAgACkDAFAPBUEADwsFQQAPCwVBAA8LBUEADwsFQQAPC0EADwssACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxggAEIANwMgIABCADcDKAtrACAAKQMoIAEpAyhRBEAgACkDICABKQMgUQRAIAApAxggASkDGFEEQCAAKQMQIAEpAxBRBEAgACkDCCABKQMIUQRAIAApAwAgASkDAFEPBUEADwsFQQAPCwVBAA8LBUEADwsFQQAPC0EADwvFAQAgACkDKCABKQMoVARAQQAPBSAAKQMoIAEpAyhWBEBBAQ8FIAApAyAgASkDIFQEQEEADwUgACkDICABKQMgVgRAQQEPBSAAKQMYIAEpAxhUBEBBAA8FIAApAxggASkDGFYEQEEBDwUgACkDECABKQMQVARAQQAPBSAAKQMQIAEpAxBWBEBBAQ8FIAApAwggASkDCFQEQEEADwUgACkDCCABKQMIVgRAQQEPBSAAKQMAIAEpAwBaDwsLCwsLCwsLCwtBAA8LvAIBAX4gADUCACABNQIAfCEDIAIgAz4CACAANQIEIAE1AgR8IANCIIh8IQMgAiADPgIEIAA1AgggATUCCHwgA0IgiHwhAyACIAM+AgggADUCDCABNQIMfCADQiCIfCEDIAIgAz4CDCAANQIQIAE1AhB8IANCIIh8IQMgAiADPgIQIAA1AhQgATUCFHwgA0IgiHwhAyACIAM+AhQgADUCGCABNQIYfCADQiCIfCEDIAIgAz4CGCAANQIcIAE1Ahx8IANCIIh8IQMgAiADPgIcIAA1AiAgATUCIHwgA0IgiHwhAyACIAM+AiAgADUCJCABNQIkfCADQiCIfCEDIAIgAz4CJCAANQIoIAE1Aih8IANCIIh8IQMgAiADPgIoIAA1AiwgATUCLHwgA0IgiHwhAyACIAM+AiwgA0IgiKcLkAMBAX4gADUCACABNQIAfSEDIAIgA0L/////D4M+AgAgADUCBCABNQIEfSADQiCHfCEDIAIgA0L/////D4M+AgQgADUCCCABNQIIfSADQiCHfCEDIAIgA0L/////D4M+AgggADUCDCABNQIMfSADQiCHfCEDIAIgA0L/////D4M+AgwgADUCECABNQIQfSADQiCHfCEDIAIgA0L/////D4M+AhAgADUCFCABNQIUfSADQiCHfCEDIAIgA0L/////D4M+AhQgADUCGCABNQIYfSADQiCHfCEDIAIgA0L/////D4M+AhggADUCHCABNQIcfSADQiCHfCEDIAIgA0L/////D4M+AhwgADUCICABNQIgfSADQiCHfCEDIAIgA0L/////D4M+AiAgADUCJCABNQIkfSADQiCHfCEDIAIgA0L/////D4M+AiQgADUCKCABNQIofSADQiCHfCEDIAIgA0L/////D4M+AiggADUCLCABNQIsfSADQiCHfCEDIAIgA0L/////D4M+AiwgA0Igh6cLpyIaAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfiADQv////8PgyAANQIAIgUgATUCACIGfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAFIAE1AgQiCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiByAGfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyAFIAE1AggiCn58IQMgBCADQiCIfCEEIANC/////w+DIAcgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiCSAGfnwhAyAEIANCIIh8IQQgAiADPgIIIARCIIghAyAEQv////8PgyAFIAE1AgwiDH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgCn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgwiCyAGfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAFIAE1AhAiDn58IQMgBCADQiCIfCEEIANC/////w+DIAcgDH58IQMgBCADQiCIfCEEIANC/////w+DIAkgCn58IQMgBCADQiCIfCEEIANC/////w+DIAsgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiDSAGfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAFIAE1AhQiEH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgDn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgCn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiDyAGfnwhBCADIARCIIh8IQMgAiAEPgIUIANCIIghBCADQv////8PgyAFIAE1AhgiEn58IQMgBCADQiCIfCEEIANC/////w+DIAcgEH58IQMgBCADQiCIfCEEIANC/////w+DIAkgDn58IQMgBCADQiCIfCEEIANC/////w+DIAsgDH58IQMgBCADQiCIfCEEIANC/////w+DIA0gCn58IQMgBCADQiCIfCEEIANC/////w+DIA8gCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AhgiESAGfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyAEQv////8PgyAFIAE1AhwiFH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgEn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgEH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgDn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gDH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gCn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiEyAGfnwhBCADIARCIIh8IQMgAiAEPgIcIANCIIghBCADQv////8PgyAFIAE1AiAiFn58IQMgBCADQiCIfCEEIANC/////w+DIAcgFH58IQMgBCADQiCIfCEEIANC/////w+DIAkgEn58IQMgBCADQiCIfCEEIANC/////w+DIAsgEH58IQMgBCADQiCIfCEEIANC/////w+DIA0gDn58IQMgBCADQiCIfCEEIANC/////w+DIA8gDH58IQMgBCADQiCIfCEEIANC/////w+DIBEgCn58IQMgBCADQiCIfCEEIANC/////w+DIBMgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AiAiFSAGfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAFIAE1AiQiGH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgFn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgEn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gDn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgCn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AiQiFyAGfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyAFIAE1AigiGn58IQMgBCADQiCIfCEEIANC/////w+DIAcgGH58IQMgBCADQiCIfCEEIANC/////w+DIAkgFn58IQMgBCADQiCIfCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIANC/////w+DIBUgCn58IQMgBCADQiCIfCEEIANC/////w+DIBcgCH58IQMgBCADQiCIfCEEIANC/////w+DIAA1AigiGSAGfnwhAyAEIANCIIh8IQQgAiADPgIoIARCIIghAyAEQv////8PgyAFIAE1AiwiHH58IQQgAyAEQiCIfCEDIARC/////w+DIAcgGn58IQQgAyAEQiCIfCEDIARC/////w+DIAkgGH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgFn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gFH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gEn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgDn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgDH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgCn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAA1AiwiGyAGfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAHIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIAh+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIAkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIAsgGn58IQQgAyAEQiCIfCEDIARC/////w+DIA0gGH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gFn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgDn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgDH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgCn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgCyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAafnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAMfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyAEQv////8PgyANIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIA5+fCEEIAMgBEIgiHwhAyACIAQ+AjwgA0IgiCEEIANC/////w+DIA8gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGn58IQMgBCADQiCIfCEEIANC/////w+DIBMgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFn58IQMgBCADQiCIfCEEIANC/////w+DIBcgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEn58IQMgBCADQiCIfCEEIANC/////w+DIBsgEH58IQMgBCADQiCIfCEEIAIgAz4CQCAEQiCIIQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAafnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgGyASfnwhBCADIARCIIh8IQMgAiAEPgJEIANCIIghBCADQv////8PgyATIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIBR+fCEDIAQgA0IgiHwhBCACIAM+AkggBEIgiCEDIARC/////w+DIBUgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgGn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgFn58IQQgAyAEQiCIfCEDIAIgBD4CTCADQiCIIQQgA0L/////D4MgFyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAafnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAYfnwhAyAEIANCIIh8IQQgAiADPgJQIARCIIghAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIBp+fCEEIAMgBEIgiHwhAyACIAQ+AlQgA0IgiCEEIANC/////w+DIBsgHH58IQMgBCADQiCIfCEEIAIgAz4CWCAEQiCIIQMgAiAEPgJcC84gEAF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIgIg5+fCECIAMgAkIgiHwhAyACQv////8PgyAHIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIgIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AiQiD358IQIgAyACQiCIfCEDIAJC/////w+DIAcgDn58IQIgAyACQiCIfCEDIAJC/////w+DIAggDX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAogC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCKCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIsIhF+fCECIAMgAkIgiHwhAyACQv////8PgyAHIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAIIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8PgyALIAx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIsIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAIIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAJIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA5+fCECIAMgAkIgiHwhAyACQv////8PgyALIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAMIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIwIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAIIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAJIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA9+fCECIAMgAkIgiHwhAyACQv////8PgyALIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAMIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgI0IAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8PgyALIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgI4IAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKIBF+fCECIAMgAkIgiHwhAyACQv////8PgyALIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAMIA9+fCECIAMgAkIgiHwhAyACQv////8PgyANIA5+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgI8IAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyALIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAMIBB+fCECIAMgAkIgiHwhAyACQv////8PgyANIA9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAOIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAOIA9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAOIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAPIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAOIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQIBF+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgJUIAMhBCAEQiCI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IIh8QcgFNQIgIAR+fCEDIAAgAz4CSCAANQJMIANCIIh8QcgFNQIkIAR+fCEDIAAgAz4CTCAANQJQIANCIIh8QcgFNQIoIAR+fCEDIAAgAz4CUCAANQJUIANCIIh8QcgFNQIsIAR+fCEDIAAgAz4CVEH4CCADQiCIPgIoQgAhAyAANQIsIAJ+Qv////8PgyEEIAA1AiwgA0IgiHxByAU1AgAgBH58IQMgACADPgIsIAA1AjAgA0IgiHxByAU1AgQgBH58IQMgACADPgIwIAA1AjQgA0IgiHxByAU1AgggBH58IQMgACADPgI0IAA1AjggA0IgiHxByAU1AgwgBH58IQMgACADPgI4IAA1AjwgA0IgiHxByAU1AhAgBH58IQMgACADPgI8IAA1AkAgA0IgiHxByAU1AhQgBH58IQMgACADPgJAIAA1AkQgA0IgiHxByAU1AhggBH58IQMgACADPgJEIAA1AkggA0IgiHxByAU1AhwgBH58IQMgACADPgJIIAA1AkwgA0IgiHxByAU1AiAgBH58IQMgACADPgJMIAA1AlAgA0IgiHxByAU1AiQgBH58IQMgACADPgJQIAA1AlQgA0IgiHxByAU1AiggBH58IQMgACADPgJUIAA1AlggA0IgiHxByAU1AiwgBH58IQMgACADPgJYQfgIIANCIIg+AixB+AggAEEwaiABEBALpkMzAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv3/8/8PIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AsgFIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCzAUiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLQBSIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtQFIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC2AUiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLcBSIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AuAFIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC5AUiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCICInfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgEiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCICImIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLoBSIpIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhKCADQv////8PgyAJICh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIkIit+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIkIiogB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gKH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIARC/////w+DICkgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AuwFIi0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEsIARC/////w+DIAkgLH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AigiL358IQMgBCADQiCIfCEEIANC/////w+DIAogK358IQMgBCADQiCIfCEEIANC/////w+DIA4gJ358IQMgBCADQiCIfCEEIANC/////w+DIBIgI358IQMgBCADQiCIfCEEIANC/////w+DIBYgH358IQMgBCADQiCIfCEEIANC/////w+DIBogG358IQMgBCADQiCIfCEEIANC/////w+DIB4gF358IQMgBCADQiCIfCEEIANC/////w+DICIgE358IQMgBCADQiCIfCEEIANC/////w+DICYgD358IQMgBCADQiCIfCEEIANC/////w+DICogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AigiLiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAofnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC8AUiMSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DITAgA0L/////D4MgCSAwfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCLCIzfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgDiArfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgFiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAffnwhBCADIARCIIh8IQMgBEL/////D4MgHiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgJiATfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgLiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCLCIyIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQL0BSI1IAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhNCAEQv////8PgyAJIDR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgCiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgMiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgESAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAMfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAOIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1IBB+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIBIgM358IQMgBCADQiCIfCEEIANC/////w+DIBYgL358IQMgBCADQiCIfCEEIANC/////w+DIBogK358IQMgBCADQiCIfCEEIANC/////w+DIB4gJ358IQMgBCADQiCIfCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICYgH358IQMgBCADQiCIfCEEIANC/////w+DICogG358IQMgBCADQiCIfCEEIANC/////w+DIC4gF358IQMgBCADQiCIfCEEIANC/////w+DIDIgE358IQMgBCADQiCIfCEEIANC/////w+DIBUgNH58IQMgBCADQiCIfCEEIANC/////w+DIBkgMH58IQMgBCADQiCIfCEEIANC/////w+DIB0gLH58IQMgBCADQiCIfCEEIANC/////w+DICEgKH58IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIANC/////w+DICkgIH58IQMgBCADQiCIfCEEIANC/////w+DIC0gHH58IQMgBCADQiCIfCEEIANC/////w+DIDEgGH58IQMgBCADQiCIfCEEIANC/////w+DIDUgFH58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgFiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgHiArfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgJiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAffnwhBCADIARCIIh8IQMgBEL/////D4MgLiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgGSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgHSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgISAsfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAofnwhBCADIARCIIh8IQMgBEL/////D4MgKSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAYfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAaIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAmICd+fCEDIAQgA0IgiHwhBCADQv////8PgyAqICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAyIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICx+fCEDIAQgA0IgiHwhBCADQv////8PgyApICh+fCEDIAQgA0IgiHwhBCADQv////8PgyAtICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAxICB+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IBx+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIB4gM358IQQgAyAEQiCIfCEDIARC/////w+DICIgL358IQQgAyAEQiCIfCEDIARC/////w+DICYgK358IQQgAyAEQiCIfCEDIARC/////w+DICogJ358IQQgAyAEQiCIfCEDIARC/////w+DIC4gI358IQQgAyAEQiCIfCEDIARC/////w+DIDIgH358IQQgAyAEQiCIfCEDIARC/////w+DICEgNH58IQQgAyAEQiCIfCEDIARC/////w+DICUgMH58IQQgAyAEQiCIfCEDIARC/////w+DICkgLH58IQQgAyAEQiCIfCEDIARC/////w+DIC0gKH58IQQgAyAEQiCIfCEDIARC/////w+DIDEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgIH58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgIiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgMiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAkfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyAEQv////8PgyAmIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1ICh+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DICogM358IQMgBCADQiCIfCEEIANC/////w+DIC4gL358IQMgBCADQiCIfCEEIANC/////w+DIDIgK358IQMgBCADQiCIfCEEIANC/////w+DIC0gNH58IQMgBCADQiCIfCEEIANC/////w+DIDEgMH58IQMgBCADQiCIfCEEIANC/////w+DIDUgLH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgLiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgMSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgNSAwfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyAyIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IDR+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIAIgBD4CLCADpwRAIAJByAUgAhAHGgUgAkHIBRAFBEAgAkHIBSACEAcaCwsLzUEpAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL9//P/DyEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQLIBSIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUCzAUiDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtAFIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLUBSISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC2AUiFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtwFIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLgBSIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC5AUiHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCICIffnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AugFIiEgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEgIAJC/////w+DIAkgIH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiQiIn58IQIgAyACQiCIfCEDIAJC/////w+DIAogH358IQIgAyACQiCIfCEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMICB+fCECIAMgAkIgiHwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAhIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLsBSIkIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhIyACQv////8PgyAJICN+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIoIiV+fCECIAMgAkIgiHwhAyACQv////8PgyAKICJ+fCECIAMgAkIgiHwhAyACQv////8PgyANIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBx+fCECIAMgAkIgiHwhAyACQv////8PgyATIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAWIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC8AUiJyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DISYgAkL/////D4MgCSAmfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCLCIofnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAifnwhAiADIAJCIIh8IQMgAkL/////D4MgECAffnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgJn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gI358IQIgAyACQiCIfCEDIAJC/////w+DIBIgIH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAJC/////w+DICEgEX58IQIgAyACQiCIfCEDIAJC/////w+DICQgDn58IQIgAyACQiCIfCEDIAJC/////w+DICcgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AvQFIiogCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEpIAJC/////w+DIAkgKX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKICh+fCECIAMgAkIgiHwhAyACQv////8PgyANICV+fCECIAMgAkIgiHwhAyACQv////8PgyAQICJ+fCECIAMgAkIgiHwhAyACQv////8PgyATIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAWIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAZIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiALfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANICh+fCECIAMgAkIgiHwhAyACQv////8PgyAQICV+fCECIAMgAkIgiHwhAyACQv////8PgyATICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAWIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAZIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgISAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAOfnwhAiADIAJCIIh8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQICh+fCECIAMgAkIgiHwhAyACQv////8PgyATICV+fCECIAMgAkIgiHwhAyACQv////8PgyAWICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAZIB9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAcIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgEiApfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAafnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiARfnwhAiADIAJCIIh8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyATICh+fCECIAMgAkIgiHwhAyACQv////8PgyAWICV+fCECIAMgAkIgiHwhAyACQv////8PgyAZICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAcIB9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgFSApfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAUfnwhAiADIAJCIIh8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAWICh+fCECIAMgAkIgiHwhAyACQv////8PgyAZICV+fCECIAMgAkIgiHwhAyACQv////8PgyAcICJ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAfIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAXfnwhAiADIAJCIIh8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAZICh+fCECIAMgAkIgiHwhAyACQv////8PgyAcICV+fCECIAMgAkIgiHwhAyACQv////8PgyAfICJ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAafnwhAiADIAJCIIh8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAcICh+fCECIAMgAkIgiHwhAyACQv////8PgyAfICV+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAiICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgHiApfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAdfnwhAiADIAJCIIh8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAfICh+fCECIAMgAkIgiHwhAyACQv////8PgyAiICV+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgISApfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAgfnwhAiADIAJCIIh8IQMgASACPgIcIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAiICh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAlICV+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgJCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAjfnwhAiADIAJCIIh8IQMgASACPgIgIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAlICh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgJyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAmfnwhAiADIAJCIIh8IQMgASACPgIkIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAoICh+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgKiApfnwhAiADIAJCIIh8IQMgASACPgIoIAMhBCAEQiCIIQUgASAEPgIsIAWnBEAgAUHIBSABEAcaBSABQcgFEAUEQCABQcgFIAEQBxoLCwsKACAAIAAgARAUCwsAIABB+AUgARAUCxUAIABB+BEQAEGoEhABQfgRIAEQEwsRACAAQdgSEBhB2BJBuAcQBQskACAAEAIEQEEADwsgAEGIExAYQYgTQbgHEAUEQEF/DwtBAQ8LFwAgACABEBggAUHIBSABEA4gASABEBcLCQBBqAYgABAAC8sBBAF/AX8BfwF/IAIQAUEwIQUgACEDAkADQCAFIAFLDQEgBUEwRgRAQbgTEBwFQbgTQfgFQbgTEBQLIANBuBNB6BMQFCACQegTIAIQECADQTBqIQMgBUEwaiEFDAALCyABQTBwIQQgBEUEQA8LQegTEAFBACEGAkADQCAGIARGDQEgBiADLQAAOgDoEyADQQFqIQMgBkEBaiEGDAALCyAFQTBGBEBBuBMQHAVBuBNB+AVBuBMQFAtB6BNBuBNB6BMQFCACQegTIAIQEAscACABIAJBmBQQHUGYFEGYFBAXIABBmBQgAxAUC/gBBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakEwbGo2AgAgBRAcIAAhBiAFQTBqIQVBACEIAkADQCAIIAJGDQEgBhACBEAgBUEwayAFEAAFIAYgBUEwayAF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IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCADQiCHpwuPEBIBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4gA0L/////D4MgADUCACIFIAE1AgAiBn58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgBSABNQIEIgh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgcgBn58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgBSABNQIIIgp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIgkgBn58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgBSABNQIMIgx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIgsgBn58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgBSABNQIQIg5+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIg0gBn58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgBSABNQIUIhB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIg8gBn58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgBSABNQIYIhJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIhEgBn58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgBSABNQIcIhR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIhMgBn58IQQgAyAEQiCIfCEDIAIgBD4CHCADQiCIIQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIAp+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIAIgAz4CKCAEQiCIIQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyACIAQ+AjwLjBIMAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CLCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCyANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CMCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDCANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CNCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwh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PgIUQgAhAyAANQIYIAJ+Qv////8PgyEEIAA1AhggA0IgiHxBiBs1AgAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxBiBs1AgQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxBiBs1AgggBH58IQMgACADPgIgIAA1AiQgA0IgiHxBiBs1AgwgBH58IQMgACADPgIkIAA1AiggA0IgiHxBiBs1AhAgBH58IQMgACADPgIoIAA1AiwgA0IgiHxBiBs1AhQgBH58IQMgACADPgIsIAA1AjAgA0IgiHxBiBs1AhggBH58IQMgACADPgIwIAA1AjQgA0IgiHxBiBs1AhwgBH58IQMgACADPgI0QagdIANCIIg+AhhCACEDIAA1AhwgAn5C/////w+DIQQgADUCHCADQiCIfEGIGzUCACAEfnwhAyAAIAM+AhwgADUCICADQiCIfEGIGzUCBCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEGIGzUCCCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEGIGzUCDCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEGIGzUCECAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEGIGzUCFCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEGIGzUCGCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEGIGzUCHCAEfnwhAyAAIAM+AjhBqB0gA0IgiD4CHEGoHSAAQSBqIAEQOQu+HyMBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8PIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AogbIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCjBsiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKQGyIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApQbIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCmBsiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKcGyIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AqAbIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCpBsiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gJH58IQMgBCADQiCIfCEEIANC/////w+DIBEgIH58IQMgBCADQiCIfCEEIANC/////w+DIBUgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGH58IQMgBCADQiCIfCEEIANC/////w+DIB0gFH58IQMgBCADQiCIfCEEIANC/////w+DICEgEH58IQMgBCADQiCIfCEEIANC/////w+DICUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESAkfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgISAUfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gIH58IQQgAyAEQiCIfCEDIARC/////w+DICEgHH58IQQgAyAEQiCIfCEDIARC/////w+DICUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgAiAEPgIcIAOnBEAgAkGIGyACEDAaBSACQYgbEC4EQCACQYgbIAIQMBoLCwu7IR0BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8PIQZCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgcgB358IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEIIAJC/////w+DQQA1AogbIgkgCH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgQiCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8Pg0EANQKMGyIMIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIIIg1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCkBsiDyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQ4gAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCDCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApQbIhIgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyERIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhAiE358IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIA5+fCECIAMgAkIgiHwhAyACQv////8PgyASIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKYGyIVIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFCACQv////8PgyAJIBR+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIUIhZ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBN+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCnBsiGCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRcgAkL/////D4MgCSAXfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCGCIZfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgF358IQIgAyACQiCIfCEDIAJC/////w+DIA8gFH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBggC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqAbIhsgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEaIAJC/////w+DIAkgGn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhwiHH58IQIgAyACQiCIfCEDIAJC/////w+DIAogGX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gFn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBd+fCECIAMgAkIgiHwhAyACQv////8PgyASIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAYIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAbIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKkGyIeIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhHSACQv////8PgyAJIB1+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gHX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgF358IQIgAyACQiCIfCEDIAJC/////w+DIBggFH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBsgHX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gGn58IQIgAyACQiCIfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHCAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIB4gHX58IQIgAyACQiCIfCEDIAEgAj4CGCADIQQgBEIgiCEFIAEgBD4CHCAFpwRAIAFBiBsgARAwGgUgAUGIGxAuBEAgAUGIGyABEDAaCwsLCgAgACAAIAEQPQsLACAAQagbIAEQPQsVACAAQaghEClByCEQKkGoISABEDwLEQAgAEHoIRBBQeghQagcEC4LJAAgABArBEBBAA8LIABBiCIQQUGIIkGoHBAuBEBBfw8LQQEPCxcAIAAgARBBIAFBiBsgARA3IAEgARBACwkAQcgbIAAQKQvLAQQBfwF/AX8BfyACECpBICEFIAAhAwJAA0AgBSABSw0BIAVBIEYEQEGoIhBFBUGoIkGoG0GoIhA9CyADQagiQcgiED0gAkHIIiACEDkgA0EgaiEDIAVBIGohBQwACwsgAUEgcCEEIARFBEAPC0HIIhAqQQAhBgJAA0AgBiAERg0BIAYgAy0AADoAyCIgA0EBaiEDIAZBAWohBgwACwsgBUEgRgRAQagiEEUFQagiQagbQagiED0LQcgiQagiQcgiED0gAkHIIiACEDkLHAAgASACQegiEEZB6CJB6CIQQCAAQegiIAMQPQv4AQQBfwF/AX8Bf0EAKAIAIQVBACAFIAJBAWpBIGxqNgIAIAUQRSAAIQYgBUEgaiEFQQAhCAJAA0AgCCACRg0BIAYQKwRAIAVBIGsgBRApBSAGIAVBIGsgBRA9CyAGIAFqIQYgBUEgaiEFIAhBAWohCAwACwsgBiABayEGIAVBIGshBSADIAJBAWsgBGxqIQcgBSAFEEQCQANAIAhFDQEgBhArBEAgBSAFQSBrECkgBxAqBSAFQSBrQYgjECkgBSAGIAVBIGsQPSAFQYgjIAcQPQsgBiABayEGIAcgBGshByAFQSBrIQUgCEEBayEIDAALC0EAIAU2AgALPgMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQQCAEQSBqIQQgBUEgaiEFIANBAWohAwwACwsLPgMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQQSAEQSBqIQQgBUEgaiEFIANBAWohAwwACwsLPgMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQOyAEQSBqIQQgBUEgaiEFIANBAWohAwwACwsLTQQBfwF/AX8BfyAAIQUgASEGIAMhB0EAIQQCQANAIAQgAkYNASAFIAYgBxA5IAVBIGohBSAGQSBqIQYgB0EgaiEHIARBAWohBAwACwsLTQQBfwF/AX8BfyAAIQUgASEGIAMhB0EAIQQCQANAIAQgAkYNASAFIAYgBxA6IAVBIGohBSAGQSBqIQYgB0EgaiEHIARBAWohBAwACwsLTQQBfwF/AX8BfyAAIQUgASEGIAMhB0EAIQQCQANAIAQgAkYNASAFIAYgBxA9IAVBIGohBSAGQSBqIQYgB0EgaiEHIARBAWohBAwACwsLsgICAX8BfyACRQRAIAMQRQ8LIABBqCMQKSADEEUgAiEEAkADQCAEQQFrIQQgASAEai0AACEFIAMgAxA+IAVBgAFPBEAgBUGAAWshBSADQagjIAMQPQsgAyADED4gBUHAAE8EQCAFQcAAayEFIANBqCMgAxA9CyADIAMQPiAFQSBPBEAgBUEgayEFIANBqCMgAxA9CyADIAMQPiAFQRBPBEAgBUEQayEFIANBqCMgAxA9CyADIAMQPiAFQQhPBEAgBUEIayEFIANBqCMgAxA9CyADIAMQPiAFQQRPBEAgBUEEayEFIANBqCMgAxA9CyADIAMQPiAFQQJPBEAgBUECayEFIANBqCMgAxA9CyADIAMQPiAFQQFPBEAgBUEBayEFIANBqCMgAxA9CyAERQ0BDAALCwveAQMBfwF/AX8gABArBEAgARAqDwtBICECQegcQcgjECkgAEHIHEEgQegjEE8gAEGIHUEgQYgkEE8CQANAQegjQcgbEC0NAUHoI0GoJBA+QQEhAwJAA0BBqCRByBsQLQ0BQagkQagkED4gA0EBaiEDDAALC0HII0HIJBApIAIgA2tBAWshBAJAA0AgBEUNAUHIJEHIJBA+IARBAWshBAwACwsgAyECQcgkQcgjED5B6CNByCNB6CMQPUGIJEHIJEGIJBA9DAALC0GIJBBCBEBBiCQgARA7BUGIJCABECkLCyAAIAAQKwRAQQEPCyAAQYgcQSBB6CQQT0HoJEHIGxAtCxUAIAAgAUGIJRA9QYglQagbIAIQPQsKACAAIAAgARBSCwsAIABBiBsgARA3CwkAIABBqBwQLgsOACAAEAIgAEEwahACcQsKACAAQeAAahACCw0AIAAQASAAQTBqEAELFQAgABABIABBMGoQHCAAQeAAahABC3oAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYC7oBACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAA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NwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBIAEgACkDkAE3A5ABIAEgACkDmAE3A5gBIAEgACkDoAE3A6ABIAEgACkDqAE3A6gBIAEgACkDsAE3A7ABIAEgACkDuAE3A7gBC5IDACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAEgASAAKQPAATcDwAEgASAAKQPIATcDyAEgASAAKQPQATcD0AEgASAAKQPYATcD2AEgASAAKQPgATcD4AEgASAAKQPoATcD6AEgASAAKQPwATcD8AEgASAAKQP4ATcD+AEgASAAKQOAAjcDgAIgASAAKQOIAjcDiAIgASAAKQOQAjcDkAIgASAAKQOYAjcDmAILLwAgABCwAQRAIAEQswEFIAFBwAFqEJwBIABB4ABqIAFB4ABqEJ0BIAAgARCdAQsLHAEBfyAAIAEQpwEgAEHgAGogAUHgAGoQpwFxDwuLAQEBfyAAQcABaiECIAAQsQEEQCABELABDwsgARCwAQRAQQAPCyACEJoBBEAgACABELcBDwsgAkG4hQEQoAEgAUG4hQFBmIYBEJ4BIAJBuIUBQfiGARCeASABQeAAakH4hgFB2IcBEJ4BIABBmIYBEKcBBEAgAEHgAGpB2IcBEKcBBEBBAQ8LC0EADwvZAQIBfwF/IABBwAFqIQIgAUHAAWohAyAAELEBBEAgARCxAQ8LIAEQsQEEQEEADwsgAhCaAQRAIAEg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yIEDEJgCQciBA0Ho+gJByIEDEIwCQYj9AkGo/wIgARCKAiABQciBAyABEI0CQej6AkHo+gIgAUGgAmoQjAILIAAgACABIAIQjAIgAEGgAmogAUGgAmogAkGgAmoQjAILIAAgACABIAIQjQIgAEGgAmogAUGgAmogAkGgAmoQjQILGAAgACABEI4CIABBoAJqIAFBoAJqEI4CCxgAIAAgARCJAiAAQaACaiABQaACahCOAgsYACAAIAEQkAIgAEGgAmogAUGgAmoQkAILGAAgACABEJECIABBoAJqIAFBoAJqEJECCxkAIAAgARCSAiAAQaACaiABQaACahCSAnELagAgAEHogwMQiwIgAEGgAmpBiIYDEIsCQYiGA0GoiAMQmAJB6IMDQaiIA0GoiAMQjQJBqIgDQciKAxCTAiAAQciKAyABEIoCIABBoAJqQciKAyABQaACahCKAiABQaACaiABQaACahCOAgsgACAAIAEgAiADEJQCIABBoAJqIAEgAiADQaACahCUAgsdAQF/IABBoAJqEI8CIQEgAQRAIAEPCyAAEI8CDwseACAAQaACahCFAgRAIAAQlQIPCyAAQaACahCVAg8LjwIEAX8BfwF/AX9BACgCACEFQQAgBSACQQFqQcAEbGo2AgAgBRCcAiAAIQYgBUHABGohBUEAIQgCQANAIAggAkYNASAGEJkCBEAgBUHABGsgBRCdAgUgBiAFQcAEayAFEJ4CCyAGIAFqIQYgBUHABGohBSAIQQFqIQgMAAsLIAYgAWshBiAFQcAEayEFIAMgAkEBayAEbGohByAFIAUQqAICQANAIAhFDQEgBhCZAgRAIAUgBUHABGsQnQIgBxCbAgUgBUHABGtB6IwDEJ0CIAUgBiAFQcAEaxCeAiAFQeiMAyAHEJ4CCyAGIAFrIQYgByAEayEHIAVBwARrIQUgCEEBayEIDAALC0EAIAU2AgALzgICAX8BfyACRQRAIAMQnAIPCyAAQaiRAxCdAiADEJwCIAIhBAJAA0AgBEEBayEEIAEgBGotAAAhBSADIAMQoAIgBUGAAU8EQCAFQYABayEFIANBqJEDIAMQngILIAMgAxCgAiAFQcAATwRAIAVBwABrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBIE8EQCAFQSBrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBEE8EQCAFQRBrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBCE8EQCAFQQhrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBBE8EQCAFQQRrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBAk8EQCAFQQJrIQUgA0GokQMgAxCeAgsgAyADEKACIAVBAU8EQCAFQQFrIQUgA0GokQMgAxCeAgsgBEUNAQwACwsL0QEAQeinAxCcAkHopwNB6KcDEKMCIABB6JUDQaACQaiaAxCtAkGomgNB6J4DEKACIABB6J4DQeieAxCeAkHongNBqKMDEKQCQaijA0HongNBqKMDEJ4CQaijA0HopwMQpwIEQAALQaiaAyAAQaisAxCeAkHongNB6KcDEKcCBEBB6KcDEIcCQYiqAxCIAkHopwNBqKwDIAEQngIFQeiwAxCcAkHosANB6J4DQeiwAxChAkHosANBiJgDQaACQeiwAxCtAkHosANBqKwDIAEQngILC2oAQYjFAxCcAkGIxQNBiMUDEKMCIABBqLUDQaACQci3AxCtAkHItwNBiLwDEKACIABBiLwDQYi8AxCeAkGIvANByMADEKQCQcjAA0GIvANByMADEJ4CQcjAA0GIxQMQpwIEQEEADwtBAQ8LeAAgACAAQeAAakGIygMQoQEgAEHgAGogAEHAAWpB6MoDEKEBIABB4ABqIAEgAkHAAWoQngFB6MoDIAEgAhCeASACIAJBwAFqIAIQogEgAiACEIQCQYjKAyABIAJB4ABqEJ4BIAJB4ABqIAJBwAFqIAJB4ABqEKIBC+wBACAAIAFByMsDEJ4BIABB4ABqIAJBqMwDEJ4BIAAgAEHgAGpBiM0DEKEBIAAgAEHAAWpB6M0DEKEBIABB4ABqIABBwAFqIAMQoQEgAyACIAMQngEgA0GozAMgAxCiASADIAMQhAIgA0HIywMgAxChASABIAIgA0HgAGoQoQEgA0HgAGpBiM0DIANB4ABqEJ4BIANB4ABqQcjLAyADQeAAahCiASADQeAAakGozAMgA0HgAGoQogFB6M0DIAEgA0HAAWoQngEgA0HAAWpByMsDIANBwAFqEKIBIANBwAFqQajMAyADQcABahChAQuQAQAgACABIAJByM4DELECIABBoAJqIANB6NADELACIAIgA0GI0wMQoQEgAEGgAmogACAEQaACahCMAiAEQaACaiABQYjTAyAEQaACahCxAiAEQaACakHIzgMgBEGgAmoQjQIgBEGgAmpB6NADIARBoAJqEI0CQejQAyAEEIkCIAQgBBCYAiAEQcjOAyAEEIwCC1AAIAEgAEEwakHo0wMQFCABQTBqIABBMGpBmNQDEBQgAUHgAGogAEHI1AMQFCABQZABaiAAQfjUAxAUIAIgAUHAAWpByNQDQejTAyACELICC2wAIABBqPcEIAEQngEgAEHgAGpBiPgEIAFB4ABqEJ4BIABBwAFqQej4BCABQcABahCeASAAQaACakHI+QQgAUGgAmoQngEgAEGAA2pBqPoEIAFBgANqEJ4BIABB4ANqQYj7BCABQeADahCeAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUHo+wQgARCeASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpByPwEIAFB4ABqEJ4BIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakGo/QQgAUHAAWoQngEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQYj+BCABQaACahCeASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pB6P4EIAFBgANqEJ4BIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakHI/wQgAUHgA2oQngELbAAgAEGogAUgARCeASAAQeAAakGIgQUgAUHgAGoQngEgAEHAAWpB6IEFIAFBwAFqEJ4BIABBoAJqQciCBSABQaACahCeASAAQYADakGogwUgAUGAA2oQngEgAEHgA2pBiIQFIAFB4ANqEJ4BC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQeiEBSABEJ4BIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakHIhQUgAUHgAGoQngEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQaiGBSABQcABahCeASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpBiIcFIAFBoAJqEJ4BIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakHohwUgAUGAA2oQngEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQciIBSABQeADahCeAQtsACAAQaiJBSABEJ4BIABB4ABqQYiKBSABQeAAahCeASAAQcABakHoigUgAUHAAWoQngEgAEGgAmpByIsFIAFBoAJqEJ4BIABBgANqQaiMBSABQYADahCeASAAQeADakGIjQUgAUHgA2oQngELigIAIAAgARAAIABBMGogAUEwahASIAFB6I0FIAEQngEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahASIAFB4ABqQciOBSABQeAAahCeASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBIgAUHAAWpBqI8FIAFBwAFqEJ4BIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQEiABQaACakGIkAUgAUGgAmoQngEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahASIAFBgANqQeiQBSABQYADahCeASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBIgAUHgA2pByJEFIAFB4ANqEJ4BC2wAIABBqJIFIAEQngEgAEHgAGpBiJMFIAFB4ABqEJ4BIABBwAFqQeiTBSABQcABahCeASAAQaACakHIlAUgAUGgAmoQngEgAEGAA2pBqJUFIAFBgANqEJ4BIABB4ANqQYiWBSABQeADahCeAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUHolgUgARCeASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpByJcFIAFB4ABqEJ4BIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakGomAUgAUHAAWoQngEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQYiZBSABQaACahCeASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pB6JkFIAFBgANqEJ4BIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakHImgUgAUHgA2oQngELbAAgAEGomwUgARCeASAAQeAAakGInAUgAUHgAGoQngEgAEHAAWpB6JwFIAFBwAFqEJ4BIABBoAJqQcidBSABQaACahCeASAAQYADakGongUgAUGAA2oQngEgAEHgA2pBiJ8FIAFB4ANqEJ4BC4oCACAAIAEQACAAQTBq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";
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

async function buildBls12381$1(singleThread, plugins) {
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

var build_multiexp = function buildMultiexp(module, prefix, fnName, opAdd, n8b) {

    const n64g = module.modules[prefix].n64;
    const n8g = n64g*8;

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

    function buildMutiexpChunk() {
        const f = module.addFunction(fnName + "_chunk");
        f.addParam("pBases", "i32");
        f.addParam("pScalars", "i32");
        f.addParam("scalarSize", "i32");  // Number of points
        f.addParam("n", "i32");  // Number of points
        f.addParam("startBit", "i32");  // bit where it starts the chunk
        f.addParam("chunkSize", "i32");  // bit where it starts the chunk
        f.addParam("pr", "i32");
        f.addLocal("nChunks", "i32");
        f.addLocal("itScalar", "i32");
        f.addLocal("endScalar", "i32");
        f.addLocal("itBase", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        f.addLocal("nTable", "i32");
        f.addLocal("pTable", "i32");
        f.addLocal("idx", "i32");
        f.addLocal("pIdxTable", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.if(
                c.i32_eqz(c.getLocal("n")),
                [
                    ...c.call(prefix + "_zero", c.getLocal("pr")),
                    ...c.ret([])
                ]
            ),

            // Allocate memory

            c.setLocal(
                "nTable",
                c.i32_shl(
                    c.i32_const(1),
                    c.getLocal("chunkSize")
                )
            ),
            c.setLocal("pTable", c.i32_load( c.i32_const(0) )),
            c.i32_store(
                c.i32_const(0),
                c.i32_add(
                    c.getLocal("pTable"),
                    c.i32_mul(
                        c.getLocal("nTable"),
                        c.i32_const(n8g)
                    )
                )
            ),

            // Reset Table
            c.setLocal("j", c.i32_const(0)),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("j"),
                        c.getLocal("nTable")
                    )
                ),

                c.call(
                    prefix + "_zero",
                    c.i32_add(
                        c.getLocal("pTable"),
                        c.i32_mul(
                            c.getLocal("j"),
                            c.i32_const(n8g)
                        )
                    )
                ),

                c.setLocal("j", c.i32_add(c.getLocal("j"), c.i32_const(1))),
                c.br(0)
            )),

            // Distribute elements
            c.setLocal("itBase", c.getLocal("pBases")),
            c.setLocal("itScalar", c.getLocal("pScalars")),
            c.setLocal("endScalar",
                c.i32_add(
                    c.getLocal("pScalars"),
                    c.i32_mul(
                        c.getLocal("n"),
                        c.getLocal("scalarSize")
                    )
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("itScalar"),
                        c.getLocal("endScalar")
                    )
                ),

                c.setLocal(
                    "idx",
                    c.call(fnName + "_getChunk",
                        c.getLocal("itScalar"),
                        c.getLocal("scalarSize"),
                        c.getLocal("startBit"),
                        c.getLocal("chunkSize")
                    )
                ),

                c.if(
                    c.getLocal("idx"),
                    [
                        ...c.setLocal(
                            "pIdxTable",
                            c.i32_add(
                                c.getLocal("pTable"),
                                c.i32_mul(
                                    c.i32_sub(
                                        c.getLocal("idx"),
                                        c.i32_const(1)
                                    ),
                                    c.i32_const(n8g)
                                )
                            )
                        ),
                        ...c.call(
                            opAdd,
                            c.getLocal("pIdxTable"),
                            c.getLocal("itBase"),
                            c.getLocal("pIdxTable"),
                        )
                    ]
                ),

                c.setLocal("itScalar", c.i32_add(c.getLocal("itScalar"), c.getLocal("scalarSize"))),
                c.setLocal("itBase", c.i32_add(c.getLocal("itBase"), c.i32_const(n8b))),
                c.br(0)
            )),

            c.call(fnName + "_reduceTable", c.getLocal("pTable"), c.getLocal("chunkSize")),
            c.call(
                prefix + "_copy",
                c.getLocal("pTable"),
                c.getLocal("pr")
            ),


            c.i32_store(
                c.i32_const(0),
                c.getLocal("pTable")
            )

        );
    }

    function buildMultiexp() {
        const f = module.addFunction(fnName);
        f.addParam("pBases", "i32");
        f.addParam("pScalars", "i32");
        f.addParam("scalarSize", "i32");  // Number of points
        f.addParam("n", "i32");  // Number of points
        f.addParam("pr", "i32");
        f.addLocal("chunkSize", "i32");
        f.addLocal("nChunks", "i32");
        f.addLocal("itScalar", "i32");
        f.addLocal("endScalar", "i32");
        f.addLocal("itBase", "i32");
        f.addLocal("itBit", "i32");
        f.addLocal("i", "i32");
        f.addLocal("j", "i32");
        f.addLocal("nTable", "i32");
        f.addLocal("pTable", "i32");
        f.addLocal("idx", "i32");
        f.addLocal("pIdxTable", "i32");

        const c = f.getCodeBuilder();

        const aux = c.i32_const(module.alloc(n8g));

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


            // Allocate memory

            c.setLocal(
                "itBit",
                c.i32_mul(
                    c.i32_sub(
                        c.getLocal("nChunks"),
                        c.i32_const(1)
                    ),
                    c.getLocal("chunkSize")
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_lt_s(
                        c.getLocal("itBit"),
                        c.i32_const(0)
                    )
                ),

                // Double nChunk times
                c.if(
                    c.i32_eqz(c.call(prefix + "_isZero", c.getLocal("pr"))),
                    [
                        ...c.setLocal("j", c.i32_const(0)),
                        ...c.block(c.loop(
                            c.br_if(
                                1,
                                c.i32_eq(
                                    c.getLocal("j"),
                                    c.getLocal("chunkSize")
                                )
                            ),

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
                    c.getLocal("n"),
                    c.getLocal("itBit"),
                    c.getLocal("chunkSize"),
                    aux
                ),

                c.call(
                    prefix + "_add",
                    c.getLocal("pr"),
                    aux,
                    c.getLocal("pr")
                ),
                c.setLocal("itBit", c.i32_sub(c.getLocal("itBit"), c.getLocal("chunkSize"))),
                c.br(0)
            ))
        );
    }

    function buildReduceTable() {
        const f = module.addFunction(fnName + "_reduceTable");
        f.addParam("pTable", "i32");
        f.addParam("p", "i32");  // Number of bits of the table
        f.addLocal("half", "i32");
        f.addLocal("it1", "i32");
        f.addLocal("it2", "i32");
        f.addLocal("pAcc", "i32");

        const c = f.getCodeBuilder();

        f.addCode(
            c.if(
                c.i32_eq(c.getLocal("p"), c.i32_const(1)),
                c.ret([])
            ),
            c.setLocal(
                "half",
                c.i32_shl(
                    c.i32_const(1),
                    c.i32_sub(
                        c.getLocal("p"),
                        c.i32_const(1)
                    )
                )
            ),

            c.setLocal("it1", c.getLocal("pTable")),
            c.setLocal(
                "it2",
                c.i32_add(
                    c.getLocal("pTable"),
                    c.i32_mul(
                        c.getLocal("half"),
                        c.i32_const(n8g)
                    )
                )
            ),
            c.setLocal("pAcc",
                c.i32_sub(
                    c.getLocal("it2"),
                    c.i32_const(n8g)
                )
            ),
            c.block(c.loop(
                c.br_if(
                    1,
                    c.i32_eq(
                        c.getLocal("it1"),
                        c.getLocal("pAcc")
                    )
                ),
                c.call(
                    prefix + "_add",
                    c.getLocal("it1"),
                    c.getLocal("it2"),
                    c.getLocal("it1")
                ),
                c.call(
                    prefix + "_add",
                    c.getLocal("pAcc"),
                    c.getLocal("it2"),
                    c.getLocal("pAcc")
                ),
                c.setLocal("it1", c.i32_add(c.getLocal("it1"), c.i32_const(n8g))),
                c.setLocal("it2", c.i32_add(c.getLocal("it2"), c.i32_const(n8g))),
                c.br(0)
            )),

            c.call(
                fnName + "_reduceTable",
                c.getLocal("pTable"),
                c.i32_sub(
                    c.getLocal("p"),
                    c.i32_const(1)
                )
            ),

            c.setLocal("p", c.i32_sub(c.getLocal("p"), c.i32_const(1))),
            c.block(c.loop(
                c.br_if(1, c.i32_eqz(c.getLocal("p"))),
                c.call(prefix + "_double", c.getLocal("pAcc"), c.getLocal("pAcc")),
                c.setLocal("p", c.i32_sub(c.getLocal("p"), c.i32_const(1))),
                c.br(0)
            )),

            c.call(prefix + "_add", c.getLocal("pTable"), c.getLocal("pAcc"), c.getLocal("pTable"))
        );
    }

    buildGetChunk();
    buildReduceTable();
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

    buildMultiexp(module, prefix, prefix + "_multiexp", prefix + "_add", n8*3);
    buildMultiexp(module, prefix, prefix + "_multiexpAffine", prefix + "_addMixed", n8*2);

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
