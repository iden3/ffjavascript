type ScalarInput = bigint | number | string;

const hexLen = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4];

export function fromString(s: ScalarInput, radix?: number): bigint | undefined {
  if (!radix || radix == 10) {
    return BigInt(s);
  } else if (radix == 16) {
    const str = typeof s === "string" ? s : s.toString();
    if (str.slice(0, 2) == "0x") {
      return BigInt(str);
    } else {
      return BigInt("0x" + str);
    }
  }
}

export const e = fromString;

export function fromArray(a: number[], radix: number): bigint {
  let acc = BigInt(0);
  const r = BigInt(radix);
  for (let i = 0; i < a.length; i++) {
    acc = acc * r + BigInt(a[i]!);
  }
  return acc;
}

export function bitLength(a: bigint): number {
  const aS = a.toString(16);
  const lead = aS[0]!;
  return (aS.length - 1) * 4 + hexLen[parseInt(lead, 16)]!;
}

export function isNegative(a: ScalarInput): boolean {
  return BigInt(a) < BigInt(0);
}

export function isZero(a: ScalarInput): boolean {
  return !a;
}

export function shiftLeft(a: ScalarInput, n: ScalarInput): bigint {
  return BigInt(a) << BigInt(n);
}

export function shiftRight(a: ScalarInput, n: ScalarInput): bigint {
  return BigInt(a) >> BigInt(n);
}

export const shl = shiftLeft;
export const shr = shiftRight;

export function isOdd(a: ScalarInput): boolean {
  return (BigInt(a) & BigInt(1)) == BigInt(1);
}

export function naf(n: ScalarInput): number[] {
  let E = BigInt(n);
  const res: number[] = [];
  while (E) {
    if (E & BigInt(1)) {
      const z = 2 - Number(E % BigInt(4));
      res.push(z);
      E = E - BigInt(z);
    } else {
      res.push(0);
    }
    E = E >> BigInt(1);
  }
  return res;
}

export function bits(n: ScalarInput): number[] {
  let E = BigInt(n);
  const res: number[] = [];
  while (E) {
    if (E & BigInt(1)) {
      res.push(1);
    } else {
      res.push(0);
    }
    E = E >> BigInt(1);
  }
  return res;
}

export function toNumber(s: bigint): number {
  if (s > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Number too big");
  }
  return Number(s);
}

export function toArray(s: ScalarInput, radix: number): number[] {
  const res: number[] = [];
  let rem = BigInt(s);
  const r = BigInt(radix);
  while (rem) {
    res.unshift(Number(rem % r));
    rem = rem / r;
  }
  return res;
}

export function add(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) + BigInt(b);
}

export function sub(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) - BigInt(b);
}

export function neg(a: ScalarInput): bigint {
  return -BigInt(a);
}

export function mul(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) * BigInt(b);
}

export function square(a: ScalarInput): bigint {
  return BigInt(a) * BigInt(a);
}

export function pow(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) ** BigInt(b);
}

export function exp(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) ** BigInt(b);
}

export function abs(a: ScalarInput): bigint {
  return BigInt(a) >= 0 ? BigInt(a) : -BigInt(a);
}

export function div(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) / BigInt(b);
}

export function mod(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) % BigInt(b);
}

export function eq(a: ScalarInput, b: ScalarInput): boolean {
  return BigInt(a) == BigInt(b);
}

export function neq(a: ScalarInput, b: ScalarInput): boolean {
  return BigInt(a) != BigInt(b);
}

export function lt(a: ScalarInput, b: ScalarInput): boolean {
  return BigInt(a) < BigInt(b);
}

export function gt(a: ScalarInput, b: ScalarInput): boolean {
  return BigInt(a) > BigInt(b);
}

export function leq(a: ScalarInput, b: ScalarInput): boolean {
  return BigInt(a) <= BigInt(b);
}

export function geq(a: ScalarInput, b: ScalarInput): boolean {
  return BigInt(a) >= BigInt(b);
}

export function band(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) & BigInt(b);
}

export function bor(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) | BigInt(b);
}

export function bxor(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) ^ BigInt(b);
}

export function land(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) && BigInt(b);
}

export function lor(a: ScalarInput, b: ScalarInput): bigint {
  return BigInt(a) || BigInt(b);
}

export function lnot(a: ScalarInput): boolean {
  return !BigInt(a);
}

// Returns a buffer with Little Endian Representation
export function toRprLE(buff: Uint8Array, o: number, e: bigint, n8: number): void {
  const s = "0000000" + e.toString(16);
  const v = new Uint32Array(buff.buffer, o, n8 / 4);
  const l = (((s.length - 7) * 4 - 1) >> 5) + 1; // Number of 32bit words;
  for (let i = 0; i < l; i++) v[i] = parseInt(s.substring(s.length - 8 * i - 8, s.length - 8 * i), 16);
  for (let i = l; i < v.length; i++) v[i] = 0;
  for (let i = v.length * 4; i < n8; i++) buff[i] = toNumber(band(shiftRight(e, i * 8), 0xff));
}

// Returns a buffer with Big Endian Representation
export function toRprBE(buff: Uint8Array, o: number, e: bigint, n8: number): void {
  const s = "0000000" + e.toString(16);
  const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
  const l = (((s.length - 7) * 4 - 1) >> 5) + 1; // Number of 32bit words;
  for (let i = 0; i < l; i++) v.setUint32(n8 - i * 4 - 4, parseInt(s.substring(s.length - 8 * i - 8, s.length - 8 * i), 16), false);
  for (let i = 0; i < n8 / 4 - l; i++) v.setUint32(i * 4, 0, false);
}

// Parses a buffer with Little Endian Representation
export function fromRprLE(buff: Uint8Array, o?: number, n8?: number): bigint {
  n8 = n8 || buff.byteLength;
  o = o || 0;
  const v = new Uint32Array(buff.buffer, o, n8 / 4);
  const a = new Array(n8 / 4);
  v.forEach((ch, i) => (a[a.length - i - 1] = ch.toString(16).padStart(8, "0")));
  return fromString(a.join(""), 16)!;
}

// Parses a buffer with Big Endian Representation
export function fromRprBE(buff: Uint8Array, o?: number, n8?: number): bigint {
  n8 = n8 || buff.byteLength;
  o = o || 0;
  const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
  const a = new Array(n8 / 4);
  for (let i = 0; i < n8 / 4; i++) {
    a[i] = v
      .getUint32(i * 4, false)
      .toString(16)
      .padStart(8, "0");
  }
  return fromString(a.join(""), 16)!;
}

export function toString(a: bigint, radix?: number): string {
  return a.toString(radix);
}

export function toLEBuff(a: bigint): Uint8Array {
  const buff = new Uint8Array(Math.floor((bitLength(a) - 1) / 8) + 1);
  toRprLE(buff, 0, a, buff.byteLength);
  return buff;
}

export const zero = e(0)!;
export const one = e(1)!;
