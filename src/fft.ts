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

export interface FFTField {
  sqrt_t?: bigint;
  t: bigint;
  sqrt_s?: number;
  s: number;
  one: bigint;
  half: bigint;
  eq(a: bigint, b: bigint): boolean;
  pow(b: bigint, e: bigint | number): bigint;
  add(a: bigint, b: bigint): bigint;
  inv(a: bigint): bigint;
  square(a: bigint): bigint;
  mul(a: bigint, b: bigint): bigint;
  mulScalar(base: bigint, s: bigint | number | string): bigint;
}

export interface FFTGroup {
  add(a: bigint, b: bigint): bigint;
  sub(a: bigint, b: bigint): bigint;
}

export type OpMulGF = (a: bigint, b: bigint) => bigint;

export default class FFT {
  F: FFTField;
  G: FFTGroup;
  opMulGF: OpMulGF;
  w: bigint[];
  wi: bigint[];
  roots: bigint[][];

  constructor(G: FFTGroup, F: FFTField, opMulGF: OpMulGF) {
    this.F = F;
    this.G = G;
    this.opMulGF = opMulGF;

    const rem = F.sqrt_t || F.t;
    const s = F.sqrt_s ?? F.s;

    let nqr = F.one;
    while (F.eq(F.pow(nqr, F.half), F.one)) nqr = F.add(nqr, F.one);

    this.w = new Array(s + 1);
    this.wi = new Array(s + 1);
    this.w[s] = this.F.pow(nqr, rem);
    this.wi[s] = this.F.inv(this.w[s]);

    let n = s - 1;
    while (n >= 0) {
      this.w[n] = this.F.square(this.w[n + 1]!);
      this.wi[n] = this.F.square(this.wi[n + 1]!);
      n--;
    }

    this.roots = [];
    this._setRoots(Math.min(s, 15));
  }

  _setRoots(n: number): void {
    for (let i = n; i >= 0 && !this.roots[i]; i--) {
      let r = this.F.one;
      const nroots = 1 << i;
      const rootsi = new Array(nroots);
      for (let j = 0; j < nroots; j++) {
        rootsi[j] = r;
        r = this.F.mul(r, this.w[i]!);
      }

      this.roots[i] = rootsi;
    }
  }

  fft(p: bigint[]): bigint[] {
    if (p.length <= 1) return p;
    const bits = log2(p.length - 1) + 1;
    this._setRoots(bits);

    const m = 1 << bits;
    if (p.length != m) {
      throw new Error("Size must be multiple of 2");
    }
    const res = __fft(this, p, bits, 0, 1);
    return res;
  }

  ifft(p: bigint[]): bigint[] {
    if (p.length <= 1) return p;
    const bits = log2(p.length - 1) + 1;
    this._setRoots(bits);
    const m = 1 << bits;
    if (p.length != m) {
      throw new Error("Size must be multiple of 2");
    }
    const res = __fft(this, p, bits, 0, 1);
    const twoinvm = this.F.inv(this.F.mulScalar(this.F.one, m));
    const resn = new Array(m);
    for (let i = 0; i < m; i++) {
      resn[i] = this.opMulGF(res[(m - i) % m]!, twoinvm);
    }

    return resn;
  }
}

function log2(V: number): number {
  return (
    ((V & 0xffff0000) !== 0 ? ((V &= 0xffff0000), 16) : 0) |
    ((V & 0xff00ff00) !== 0 ? ((V &= 0xff00ff00), 8) : 0) |
    ((V & 0xf0f0f0f0) !== 0 ? ((V &= 0xf0f0f0f0), 4) : 0) |
    ((V & 0xcccccccc) !== 0 ? ((V &= 0xcccccccc), 2) : 0) |
    ((V & 0xaaaaaaaa) !== 0 ? 1 : 0)
  );
}

function __fft(PF: FFT, pall: bigint[], bits: number, offset: number, step: number): bigint[] {
  const n = 1 << bits;
  if (n == 1) {
    return [pall[offset]!];
  } else if (n == 2) {
    return [PF.G.add(pall[offset]!, pall[offset + step]!), PF.G.sub(pall[offset]!, pall[offset + step]!)];
  }

  const ndiv2 = n >> 1;
  const p1 = __fft(PF, pall, bits - 1, offset, step * 2);
  const p2 = __fft(PF, pall, bits - 1, offset + step, step * 2);

  const out = new Array(n);

  for (let i = 0; i < ndiv2; i++) {
    out[i] = PF.G.add(p1[i]!, PF.opMulGF(p2[i]!, PF.roots[bits]![i]!));
    out[i + ndiv2] = PF.G.sub(p1[i]!, PF.opMulGF(p2[i]!, PF.roots[bits]![i]!));
  }

  return out;
}
