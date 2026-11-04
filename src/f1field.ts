import FFT from "./fft";
import buildSqrt from "./fsqrt";
import * as futils from "./futils";
import { getRandomBytes } from "./random";
import * as Scalar from "./scalar";

export default class ZqField {
  type: string;
  one: bigint;
  zero: bigint;
  p: bigint;
  m: number;
  negone: bigint;
  two: bigint;
  half: bigint;
  bitLength: number;
  mask: bigint;
  n64: number;
  n32: number;
  n8: number;
  R: bigint;
  Ri: bigint;
  nqr: bigint;
  s: number;
  t: bigint;
  nqr_to_t: bigint;
  FFT: FFT;
  w: bigint[];
  wi: bigint[];
  shift: bigint;
  k: bigint;

  // sqrt-related properties (set by buildSqrt)
  sqrt_q?: bigint;
  sqrt_s?: number;
  sqrt_t?: bigint;
  sqrt_z?: bigint;
  sqrt_tm1d2?: bigint;
  sqrt_e1?: bigint;
  sqrt_e34?: bigint;
  sqrt_e12?: bigint;
  sqrt?: (this: ZqField, a: bigint) => bigint | null;
  frobenius?: (n: number, x: bigint) => bigint;

  constructor(p: bigint | number | string) {
    this.type = "F1";
    this.one = BigInt(1);
    this.zero = BigInt(0);
    this.p = BigInt(p);
    this.m = 1;
    this.negone = this.p - this.one;
    this.two = BigInt(2);
    this.half = this.p >> this.one;
    this.bitLength = Scalar.bitLength(this.p);
    this.mask = (this.one << BigInt(this.bitLength)) - this.one;

    this.n64 = Math.floor((this.bitLength - 1) / 64) + 1;
    this.n32 = this.n64 * 2;
    this.n8 = this.n64 * 8;
    this.R = this.e(this.one << BigInt(this.n64 * 64));
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

    this.w = this.FFT.w;
    this.wi = this.FFT.wi;

    this.shift = this.square(this.nqr);
    this.k = this.exp(this.nqr, 2 ** this.s);
  }

  e(a: bigint | number | string, b?: number): bigint {
    let res: bigint;
    if (!b) {
      res = BigInt(a);
    } else if (b == 16) {
      res = BigInt("0x" + a);
    } else {
      res = BigInt(a);
    }
    if (res < 0) {
      let nres = -res;
      if (nres >= this.p) nres = nres % this.p;
      return this.p - nres;
    } else {
      return res >= this.p ? res % this.p : res;
    }
  }

  add(a: bigint, b: bigint): bigint {
    const res = a + b;
    return res >= this.p ? res - this.p : res;
  }

  sub(a: bigint, b: bigint): bigint {
    return a >= b ? a - b : this.p - b + a;
  }

  neg(a: bigint): bigint {
    return a ? this.p - a : a;
  }

  mul(a: bigint, b: bigint): bigint {
    return (a * b) % this.p;
  }

  mulScalar(base: bigint, s: bigint | number | string): bigint {
    return (base * this.e(s)) % this.p;
  }

  square(a: bigint): bigint {
    return (a * a) % this.p;
  }

  eq(a: bigint, b: bigint): boolean {
    return a == b;
  }

  neq(a: bigint, b: bigint): boolean {
    return a != b;
  }

  lt(a: bigint, b: bigint): boolean {
    const aa = a > this.half ? a - this.p : a;
    const bb = b > this.half ? b - this.p : b;
    return aa < bb;
  }

  gt(a: bigint, b: bigint): boolean {
    const aa = a > this.half ? a - this.p : a;
    const bb = b > this.half ? b - this.p : b;
    return aa > bb;
  }

  leq(a: bigint, b: bigint): boolean {
    const aa = a > this.half ? a - this.p : a;
    const bb = b > this.half ? b - this.p : b;
    return aa <= bb;
  }

  geq(a: bigint, b: bigint): boolean {
    const aa = a > this.half ? a - this.p : a;
    const bb = b > this.half ? b - this.p : b;
    return aa >= bb;
  }

  div(a: bigint, b: bigint): bigint {
    return this.mul(a, this.inv(b));
  }

  idiv(a: bigint, b: bigint): bigint {
    if (!b) throw new Error("Division by zero");
    return a / b;
  }

  inv(a: bigint): bigint {
    if (!a) throw new Error("Division by zero");

    let t = this.zero;
    let r = this.p;
    let newt = this.one;
    let newr = a % this.p;
    while (newr) {
      const q = r / newr;
      [t, newt] = [newt, t - q * newt];
      [r, newr] = [newr, r - q * newr];
    }
    if (t < this.zero) t += this.p;
    return t;
  }

  mod(a: bigint, b: bigint): bigint {
    return a % b;
  }

  pow(b: bigint, e: bigint | number): bigint {
    return futils.exp(this, b, e);
  }

  exp(b: bigint, e: bigint | number): bigint {
    return futils.exp(this, b, e);
  }

  band(a: bigint, b: bigint): bigint {
    const res = a & b & this.mask;
    return res >= this.p ? res - this.p : res;
  }

  bor(a: bigint, b: bigint): bigint {
    const res = (a | b) & this.mask;
    return res >= this.p ? res - this.p : res;
  }

  bxor(a: bigint, b: bigint): bigint {
    const res = (a ^ b) & this.mask;
    return res >= this.p ? res - this.p : res;
  }

  bnot(a: bigint): bigint {
    const res = a ^ this.mask;
    return res >= this.p ? res - this.p : res;
  }

  shl(a: bigint, b: bigint): bigint {
    if (Number(b) < this.bitLength) {
      const res = (a << b) & this.mask;
      return res >= this.p ? res - this.p : res;
    } else {
      const nb = this.p - b;
      if (Number(nb) < this.bitLength) {
        return a >> nb;
      } else {
        return this.zero;
      }
    }
  }

  shr(a: bigint, b: bigint): bigint {
    if (Number(b) < this.bitLength) {
      return a >> b;
    } else {
      const nb = this.p - b;
      if (Number(nb) < this.bitLength) {
        const res = (a << nb) & this.mask;
        return res >= this.p ? res - this.p : res;
      } else {
        return this.zero;
      }
    }
  }

  land(a: bigint, b: bigint): bigint {
    return a && b ? this.one : this.zero;
  }

  lor(a: bigint, b: bigint): bigint {
    return a || b ? this.one : this.zero;
  }

  lnot(a: bigint): bigint {
    return a ? this.zero : this.one;
  }

  sqrt_old(n: bigint): bigint | null {
    if (n == this.zero) return this.zero;

    // Test that have solution
    const res = this.pow(n, this.negone >> this.one);
    if (res != this.one) return null;

    let m = this.s;
    let c = this.nqr_to_t;
    let t = this.pow(n, this.t);
    let r = this.pow(n, this.add(this.t, this.one) >> this.one);

    while (t != this.one) {
      let sq = this.square(t);
      let i = 1;
      while (sq != this.one) {
        i++;
        sq = this.square(sq);
      }

      // b = c ^ m-i-1
      let b = c;
      for (let j = 0; j < m - i - 1; j++) b = this.square(b);

      m = i;
      c = this.square(b);
      t = this.mul(t, c);
      r = this.mul(r, b);
    }

    if (r > this.p >> this.one) {
      r = this.neg(r);
    }

    return r;
  }

  normalize(a: bigint | number): bigint {
    const v = BigInt(a);
    if (v < 0) {
      let na = -v;
      if (na >= this.p) na = na % this.p;
      return this.p - na;
    } else {
      return v >= this.p ? v % this.p : v;
    }
  }

  random(): bigint {
    const nBytes = (this.bitLength * 2) / 8;
    let res = this.zero;
    for (let i = 0; i < nBytes; i++) {
      res = (res << BigInt(8)) + BigInt(getRandomBytes(1)[0]!);
    }
    return res % this.p;
  }

  toString(a: bigint, base?: number): string {
    base = base || 10;
    let vs: string;
    if (a > this.half && base == 10) {
      const v = this.p - a;
      vs = "-" + v.toString(base);
    } else {
      vs = a.toString(base);
    }
    return vs;
  }

  isZero(a: bigint): boolean {
    return a == this.zero;
  }

  fromRng(rng: { nextU64(): bigint }): bigint {
    let v: bigint;
    do {
      v = this.zero;
      for (let i = 0; i < this.n64; i++) {
        v += rng.nextU64() << BigInt(64 * i);
      }
      v &= this.mask;
    } while (v >= this.p);
    v = (v * this.Ri) % this.p; // Convert from montgomery
    return v;
  }

  fft(a: bigint[]): bigint[] {
    return this.FFT.fft(a);
  }

  ifft(a: bigint[]): bigint[] {
    return this.FFT.ifft(a);
  }

  // Returns a buffer with Little Endian Representation
  toRprLE(buff: Uint8Array, o: number, e: bigint): void {
    Scalar.toRprLE(buff, o, e, this.n64 * 8);
  }

  // Returns a buffer with Big Endian Representation
  toRprBE(buff: Uint8Array, o: number, e: bigint): void {
    Scalar.toRprBE(buff, o, e, this.n64 * 8);
  }

  // Returns a buffer with Big Endian Montgomery Representation
  toRprBEM(buff: Uint8Array, o: number, e: bigint): void {
    return this.toRprBE(buff, o, this.mul(this.R, e));
  }

  toRprLEM(buff: Uint8Array, o: number, e: bigint): void {
    return this.toRprLE(buff, o, this.mul(this.R, e));
  }

  // Parses a buffer with Little Endian Representation
  fromRprLE(buff: Uint8Array, o: number): bigint {
    return Scalar.fromRprLE(buff, o, this.n8);
  }

  // Parses a buffer with Big Endian Representation
  fromRprBE(buff: Uint8Array, o: number): bigint {
    return Scalar.fromRprBE(buff, o, this.n8);
  }

  fromRprLEM(buff: Uint8Array, o: number): bigint {
    return this.mul(this.fromRprLE(buff, o), this.Ri);
  }

  fromRprBEM(buff: Uint8Array, o: number): bigint {
    return this.mul(this.fromRprBE(buff, o), this.Ri);
  }

  toObject(a: bigint): bigint {
    return a;
  }
}
