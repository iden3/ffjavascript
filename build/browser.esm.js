//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region src/scalar.js
var scalar_exports = /* @__PURE__ */ __exportAll({
	abs: () => abs,
	add: () => add,
	band: () => band,
	bitLength: () => bitLength,
	bits: () => bits,
	bor: () => bor,
	bxor: () => bxor,
	div: () => div,
	e: () => e,
	eq: () => eq,
	exp: () => exp$1,
	fromArray: () => fromArray,
	fromRprBE: () => fromRprBE,
	fromRprLE: () => fromRprLE,
	fromString: () => fromString,
	geq: () => geq,
	gt: () => gt,
	isNegative: () => isNegative,
	isOdd: () => isOdd,
	isZero: () => isZero,
	land: () => land,
	leq: () => leq,
	lnot: () => lnot,
	lor: () => lor,
	lt: () => lt,
	mod: () => mod,
	mul: () => mul,
	naf: () => naf,
	neg: () => neg,
	neq: () => neq,
	one: () => one,
	pow: () => pow,
	shiftLeft: () => shiftLeft,
	shiftRight: () => shiftRight,
	shl: () => shl,
	shr: () => shr,
	square: () => square,
	sub: () => sub,
	toArray: () => toArray,
	toLEBuff: () => toLEBuff,
	toNumber: () => toNumber,
	toRprBE: () => toRprBE,
	toRprLE: () => toRprLE,
	toString: () => toString,
	zero: () => zero
});
var hexLen = [
	0,
	1,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4
];
function fromString(s, radix) {
	if (!radix || radix == 10) return BigInt(s);
	else if (radix == 16) if (s.slice(0, 2) == "0x") return BigInt(s);
	else return BigInt("0x" + s);
}
var e = fromString;
function fromArray(a, radix) {
	let acc = BigInt(0);
	radix = BigInt(radix);
	for (let i = 0; i < a.length; i++) acc = acc * radix + BigInt(a[i]);
	return acc;
}
function bitLength(a) {
	const aS = a.toString(16);
	return (aS.length - 1) * 4 + hexLen[parseInt(aS[0], 16)];
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
var shl = shiftLeft;
var shr = shiftRight;
function isOdd(a) {
	return (BigInt(a) & BigInt(1)) == BigInt(1);
}
function naf(n) {
	let E = BigInt(n);
	const res = [];
	while (E) {
		if (E & BigInt(1)) {
			const z = 2 - Number(E % BigInt(4));
			res.push(z);
			E = E - BigInt(z);
		} else res.push(0);
		E = E >> BigInt(1);
	}
	return res;
}
function bits(n) {
	let E = BigInt(n);
	const res = [];
	while (E) {
		if (E & BigInt(1)) res.push(1);
		else res.push(0);
		E = E >> BigInt(1);
	}
	return res;
}
function toNumber(s) {
	if (s > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("Number too big");
	return Number(s);
}
function toArray(s, radix) {
	const res = [];
	let rem = BigInt(s);
	radix = BigInt(radix);
	while (rem) {
		res.unshift(Number(rem % radix));
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
function toRprLE(buff, o, e, n8) {
	const s = "0000000" + e.toString(16);
	const v = new Uint32Array(buff.buffer, buff.byteOffset + o, n8 / 4);
	const l = ((s.length - 7) * 4 - 1 >> 5) + 1;
	for (let i = 0; i < l; i++) v[i] = parseInt(s.substring(s.length - 8 * i - 8, s.length - 8 * i), 16);
	for (let i = l; i < v.length; i++) v[i] = 0;
	for (let i = v.length * 4; i < n8; i++) buff[i] = toNumber(band(shiftRight(e, i * 8), 255));
}
function toRprBE(buff, o, e, n8) {
	const s = "0000000" + e.toString(16);
	const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
	const l = ((s.length - 7) * 4 - 1 >> 5) + 1;
	for (let i = 0; i < l; i++) v.setUint32(n8 - i * 4 - 4, parseInt(s.substring(s.length - 8 * i - 8, s.length - 8 * i), 16), false);
	for (let i = 0; i < n8 / 4 - l; i++) v[i] = 0;
}
function fromRprLE(buff, o, n8) {
	n8 = n8 || buff.byteLength;
	o = o || 0;
	const v = new Uint32Array(buff.buffer, buff.byteOffset + o, n8 / 4);
	const a = new Array(n8 / 4);
	v.forEach((ch, i) => a[a.length - i - 1] = ch.toString(16).padStart(8, "0"));
	return fromString(a.join(""), 16);
}
function fromRprBE(buff, o, n8) {
	n8 = n8 || buff.byteLength;
	o = o || 0;
	const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
	const a = new Array(n8 / 4);
	for (let i = 0; i < n8 / 4; i++) a[i] = v.getUint32(i * 4, false).toString(16).padStart(8, "0");
	return fromString(a.join(""), 16);
}
function toString(a, radix) {
	return a.toString(radix);
}
function toLEBuff(a) {
	const buff = new Uint8Array(Math.floor((bitLength(a) - 1) / 8) + 1);
	toRprLE(buff, 0, a, buff.byteLength);
	return buff;
}
var zero = e(0);
var one = e(1);
//#endregion
//#region src/polfield.js
var PolField = class {
	constructor(F) {
		this.F = F;
		let rem = F.sqrt_t;
		let s = F.sqrt_s;
		const five = this.F.add(this.F.add(this.F.two, this.F.two), this.F.one);
		this.w = new Array(s + 1);
		this.wi = new Array(s + 1);
		this.w[s] = this.F.pow(five, rem);
		this.wi[s] = this.F.inv(this.w[s]);
		let n = s - 1;
		while (n >= 0) {
			this.w[n] = this.F.square(this.w[n + 1]);
			this.wi[n] = this.F.square(this.wi[n + 1]);
			n--;
		}
		this.roots = [];
		this._setRoots(15);
	}
	_setRoots(n) {
		if (n > this.F.sqrt_s) n = this.s;
		for (let i = n; i >= 0 && !this.roots[i]; i--) {
			let r = this.F.one;
			const nroots = 1 << i;
			const rootsi = new Array(nroots);
			for (let j = 0; j < nroots; j++) {
				rootsi[j] = r;
				r = this.F.mul(r, this.w[i]);
			}
			this.roots[i] = rootsi;
		}
	}
	add(a, b) {
		const m = Math.max(a.length, b.length);
		const res = new Array(m);
		for (let i = 0; i < m; i++) res[i] = this.F.add(a[i] || this.F.zero, b[i] || this.F.zero);
		return this.reduce(res);
	}
	double(a) {
		return this.add(a, a);
	}
	sub(a, b) {
		const m = Math.max(a.length, b.length);
		const res = new Array(m);
		for (let i = 0; i < m; i++) res[i] = this.F.sub(a[i] || this.F.zero, b[i] || this.F.zero);
		return this.reduce(res);
	}
	mulScalar(p, b) {
		if (this.F.eq(b, this.F.zero)) return [];
		if (this.F.eq(b, this.F.one)) return p;
		const res = new Array(p.length);
		for (let i = 0; i < p.length; i++) res[i] = this.F.mul(p[i], b);
		return res;
	}
	mul(a, b) {
		if (a.length == 0) return [];
		if (b.length == 0) return [];
		if (a.length == 1) return this.mulScalar(b, a[0]);
		if (b.length == 1) return this.mulScalar(a, b[0]);
		if (b.length > a.length) [b, a] = [a, b];
		if (b.length <= 2 || b.length < log2$2(a.length)) return this.mulNormal(a, b);
		else return this.mulFFT(a, b);
	}
	mulNormal(a, b) {
		let res = [];
		for (let i = 0; i < b.length; i++) res = this.add(res, this.scaleX(this.mulScalar(a, b[i]), i));
		return res;
	}
	mulFFT(a, b) {
		const bitsResult = log2$2(Math.max(a.length, b.length) - 1) + 2;
		this._setRoots(bitsResult);
		const m = 1 << bitsResult;
		const ea = this.extend(a, m);
		const eb = this.extend(b, m);
		const ta = __fft$1(this, ea, bitsResult, 0, 1, false);
		const tb = __fft$1(this, eb, bitsResult, 0, 1, false);
		const tres = new Array(m);
		for (let i = 0; i < m; i++) tres[i] = this.F.mul(ta[i], tb[i]);
		const res = __fft$1(this, tres, bitsResult, 0, 1, true);
		const twoinvm = this.F.inv(this.F.mulScalar(this.F.one, m));
		const resn = new Array(m);
		for (let i = 0; i < m; i++) resn[i] = this.F.mul(res[(m - i) % m], twoinvm);
		return this.reduce(resn);
	}
	square(a) {
		return this.mul(a, a);
	}
	scaleX(p, n) {
		if (n == 0) return p;
		else if (n > 0) return new Array(n).fill(this.F.zero).concat(p);
		else {
			if (-n >= p.length) return [];
			return p.slice(-n);
		}
	}
	eval2(p, x) {
		let v = this.F.zero;
		let ix = this.F.one;
		for (let i = 0; i < p.length; i++) {
			v = this.F.add(v, this.F.mul(p[i], ix));
			ix = this.F.mul(ix, x);
		}
		return v;
	}
	evaluate(p, x) {
		const F = this.F;
		if (p.length == 0) return F.zero;
		const m = this._next2Power(p.length);
		return _eval(this.extend(p, m), x, 0, 1, m);
		function _eval(p, x, offset, step, n) {
			if (n == 1) return p[offset];
			const newX = F.square(x);
			return F.add(_eval(p, newX, offset, step << 1, n >> 1), F.mul(x, _eval(p, newX, offset + step, step << 1, n >> 1)));
		}
	}
	lagrange(points) {
		let roots = [this.F.one];
		for (let i = 0; i < points.length; i++) roots = this.mul(roots, [this.F.neg(points[i][0]), this.F.one]);
		let sum = [];
		for (let i = 0; i < points.length; i++) {
			let mpol = this.ruffini(roots, points[i][0]);
			const factor = this.F.mul(this.F.inv(this.evaluate(mpol, points[i][0])), points[i][1]);
			mpol = this.mulScalar(mpol, factor);
			sum = this.add(sum, mpol);
		}
		return sum;
	}
	fft(p) {
		if (p.length <= 1) return p;
		const bits = log2$2(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		const ep = this.extend(p, m);
		return __fft$1(this, ep, bits, 0, 1);
	}
	fft2(p) {
		if (p.length <= 1) return p;
		const bits = log2$2(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		const ep = this.extend(p, m);
		__bitReverse(ep, bits);
		return __fft2(this, ep, bits);
	}
	ifft(p) {
		if (p.length <= 1) return p;
		const bits = log2$2(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		const ep = this.extend(p, m);
		const res = __fft$1(this, ep, bits, 0, 1);
		const twoinvm = this.F.inv(this.F.mulScalar(this.F.one, m));
		const resn = new Array(m);
		for (let i = 0; i < m; i++) resn[i] = this.F.mul(res[(m - i) % m], twoinvm);
		return resn;
	}
	ifft2(p) {
		if (p.length <= 1) return p;
		const bits = log2$2(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		const ep = this.extend(p, m);
		__bitReverse(ep, bits);
		const res = __fft2(this, ep, bits, 0, 1);
		const twoinvm = this.F.inv(this.F.mulScalar(this.F.one, m));
		const resn = new Array(m);
		for (let i = 0; i < m; i++) resn[i] = this.F.mul(res[(m - i) % m], twoinvm);
		return resn;
	}
	_fft(pall, bits, offset, step) {
		/* c8 ignore start */
		const n = 1 << bits;
		if (n == 1) return [pall[offset]];
		const ndiv2 = n >> 1;
		const p1 = this._fft(pall, bits - 1, offset, step * 2);
		const p2 = this._fft(pall, bits - 1, offset + step, step * 2);
		const out = new Array(n);
		let m = this.F.one;
		for (let i = 0; i < ndiv2; i++) {
			out[i] = this.F.add(p1[i], this.F.mul(m, p2[i]));
			out[i + ndiv2] = this.F.sub(p1[i], this.F.mul(m, p2[i]));
			m = this.F.mul(m, this.w[bits]);
		}
		return out;
	}
	/* c8 ignore stop */
	extend(p, e) {
		if (e == p.length) return p;
		const z = new Array(e - p.length).fill(this.F.zero);
		return p.concat(z);
	}
	reduce(p) {
		if (p.length == 0) return p;
		if (!this.F.eq(p[p.length - 1], this.F.zero)) return p;
		let i = p.length - 1;
		while (i > 0 && this.F.eq(p[i], this.F.zero)) i--;
		return p.slice(0, i + 1);
	}
	eq(a, b) {
		const pa = this.reduce(a);
		const pb = this.reduce(b);
		if (pa.length != pb.length) return false;
		for (let i = 0; i < pb.length; i++) if (!this.F.eq(pa[i], pb[i])) return false;
		return true;
	}
	ruffini(p, r) {
		const res = new Array(p.length - 1);
		res[res.length - 1] = p[p.length - 1];
		for (let i = res.length - 2; i >= 0; i--) res[i] = this.F.add(this.F.mul(res[i + 1], r), p[i + 1]);
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
		for (let i = ap.length - 1; i >= 0; i--) if (!this.F.eq(p[i], this.F.zero)) {
			if (S != "") S += " + ";
			S = S + p[i].toString(10);
			if (i > 0) {
				S = S + "x";
				if (i > 1) S = S + "^" + i;
			}
		}
		return S;
	}
	normalize(p) {
		const res = new Array(p.length);
		for (let i = 0; i < p.length; i++) res[i] = this.F.normalize(p[i]);
		return res;
	}
	_reciprocal(p, bits) {
		const k = 1 << bits;
		if (k == 1) return [this.F.inv(p[0])];
		const np = this.scaleX(p, -k / 2);
		const q = this._reciprocal(np, bits - 1);
		const a = this.scaleX(this.double(q), 3 * k / 2 - 2);
		const b = this.mul(this.square(q), p);
		return this.scaleX(this.sub(a, b), -(k - 2));
	}
	_div2(m, v) {
		const kbits = log2$2(v.length - 1) + 1;
		const k = 1 << kbits;
		const scaleV = k - v.length;
		const rec = this._reciprocal(this.scaleX(v, scaleV), kbits);
		return this.scaleX(rec, m - 2 * k + 2 + scaleV);
	}
	div(_u, _v) {
		if (_u.length < _v.length) return [];
		const kbits = log2$2(_v.length - 1) + 1;
		const k = 1 << kbits;
		const u = this.scaleX(_u, k - _v.length);
		const v = this.scaleX(_v, k - _v.length);
		const n = v.length - 1;
		let m = u.length - 1;
		const s = this._reciprocal(v, kbits);
		let t;
		if (m > 2 * n) t = this.sub(this.scaleX([this.F.one], 2 * n), this.mul(s, v));
		let q = [];
		let rem = u;
		let us, ut;
		let finish = false;
		while (!finish) {
			us = this.mul(rem, s);
			q = this.add(q, this.scaleX(us, -2 * n));
			if (m > 2 * n) {
				ut = this.mul(rem, t);
				rem = this.scaleX(ut, -2 * n);
				m = rem.length - 1;
			} else finish = true;
		}
		return q;
	}
	oneRoot(n, i) {
		let nbits = log2$2(n - 1) + 1;
		let res = this.F.one;
		let r = i;
		if (i >= n) throw new Error("Given 'i' should be lower than 'n'");
		else if (1 << nbits !== n)
 /* c8 ignore start */
		throw new Error(`Internal errlr: ${n} should equal ${1 << nbits}`);
		/* c8 ignore stop */
		while (r > 0) {
			if (r & true) res = this.F.mul(res, this.w[nbits]);
			r = r >> 1;
			nbits--;
		}
		return res;
	}
	computeVanishingPolinomial(bits, t) {
		const m = 1 << bits;
		return this.F.sub(this.F.pow(t, m), this.F.one);
	}
	evaluateLagrangePolynomials(bits, t) {
		const m = 1 << bits;
		const tm = this.F.pow(t, m);
		const u = new Array(m).fill(this.F.zero);
		this._setRoots(bits);
		const omega = this.w[bits];
		if (this.F.eq(tm, this.F.one)) {
			/* c8 ignore start */
			for (let i = 0; i < m; i++) if (this.F.eq(this.roots[bits][0], t)) {
				u[i] = this.F.one;
				return u;
			}
		}
		/* c8 ignore stop */
		const z = this.F.sub(tm, this.F.one);
		let l = this.F.mul(z, this.F.inv(this.F.e(m)));
		for (let i = 0; i < m; i++) {
			u[i] = this.F.mul(l, this.F.inv(this.F.sub(t, this.roots[bits][i])));
			l = this.F.mul(l, omega);
		}
		return u;
	}
	log2(V) {
		/* c8 ignore start */
		return log2$2(V);
	}
};
function log2$2(V) {
	return ((V & 4294901760) !== 0 ? (V &= 4294901760, 16) : 0) | ((V & 4278255360) !== 0 ? (V &= 4278255360, 8) : 0) | ((V & 4042322160) !== 0 ? (V &= 4042322160, 4) : 0) | ((V & 3435973836) !== 0 ? (V &= 3435973836, 2) : 0) | (V & 2863311530) !== 0;
}
function __fft$1(PF, pall, bits, offset, step) {
	const n = 1 << bits;
	if (n == 1)
 /* c8 ignore start */
	return [pall[offset]];
	else if (n == 2) return [PF.F.add(pall[offset], pall[offset + step]), PF.F.sub(pall[offset], pall[offset + step])];
	const ndiv2 = n >> 1;
	const p1 = __fft$1(PF, pall, bits - 1, offset, step * 2);
	const p2 = __fft$1(PF, pall, bits - 1, offset + step, step * 2);
	const out = new Array(n);
	for (let i = 0; i < ndiv2; i++) {
		out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
		out[i + ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
	}
	return out;
}
function __fft2(PF, pall, bits) {
	const n = 1 << bits;
	if (n == 1) return [pall[0]];
	const ndiv2 = n >> 1;
	const p1 = __fft2(PF, pall.slice(0, ndiv2), bits - 1);
	const p2 = __fft2(PF, pall.slice(ndiv2), bits - 1);
	const out = new Array(n);
	for (let i = 0; i < ndiv2; i++) {
		out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
		out[i + ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
	}
	return out;
}
var _revTable$1 = [];
for (let i = 0; i < 256; i++) _revTable$1[i] = _revSlow$1(i, 8);
function _revSlow$1(idx, bits) {
	let res = 0;
	let a = idx;
	for (let i = 0; i < bits; i++) {
		res <<= 1;
		res = res | a & 1;
		a >>= 1;
	}
	return res;
}
function rev(idx, bits) {
	return (_revTable$1[idx >>> 24] | _revTable$1[idx >>> 16 & 255] << 8 | _revTable$1[idx >>> 8 & 255] << 16 | _revTable$1[idx & 255] << 24) >>> 32 - bits;
}
function __bitReverse(p, bits) {
	for (let k = 0; k < p.length; k++) {
		const r = rev(k, bits);
		if (r > k) {
			const tmp = p[k];
			p[k] = p[r];
			p[r] = tmp;
		}
	}
}
//#endregion
//#region src/futils.js
function mulScalar(F, base, e) {
	let res;
	if (isZero(e)) return F.zero;
	const n = naf(e);
	if (n[n.length - 1] == 1) res = base;
	else if (n[n.length - 1] == -1)
 /* c8 ignore start */
	res = F.neg(base);
	else throw new Error("invlaud NAF");
	/* c8 ignore stop */
	for (let i = n.length - 2; i >= 0; i--) {
		res = F.double(res);
		if (n[i] == 1) res = F.add(res, base);
		else if (n[i] == -1) res = F.sub(res, base);
	}
	return res;
}
function exp(F, base, e) {
	if (isZero(e)) return F.one;
	const n = bits(e);
	if (n.length == 0) return F.one;
	let res = base;
	for (let i = n.length - 2; i >= 0; i--) {
		res = F.square(res);
		if (n[i]) res = F.mul(res, base);
	}
	return res;
}
//#endregion
//#region src/fsqrt.js
function buildSqrt(F) {
	if (F.m % 2 == 1) {
		if (eq(mod(F.p, 4), 1)) if (eq(mod(F.p, 8), 1)) if (eq(mod(F.p, 16), 1)) alg5_tonelliShanks(F);
		else if (eq(mod(F.p, 16), 9)) alg4_kong(F);
		else
 /* c8 ignore start */
		throw new Error("Field withot sqrt");
		else if (eq(mod(F.p, 8), 5)) alg3_atkin(F);
		else
 /* c8 ignore start */
		throw new Error("Field withot sqrt");
		else if (eq(mod(F.p, 4), 3)) alg2_shanks(F);
	} else {
		const pm2mod4 = mod(pow(F.p, F.m / 2), 4);
		if (pm2mod4 == 1) alg10_adj(F);
		else if (pm2mod4 == 3) alg9_adj(F);
		else
 /* c8 ignore start */
		alg8_complex(F);
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
	while (!F.eq(c0, F.negone)) {
		const c = F.random();
		F.sqrt_z = F.pow(c, F.sqrt_t);
		c0 = F.pow(F.sqrt_z, 2 ** (F.sqrt_s - 1));
	}
	F.sqrt_tm1d2 = div(sub(F.sqrt_t, 1), 2);
	F.sqrt = function(a) {
		const F = this;
		if (F.isZero(a)) return F.zero;
		let w = F.pow(a, F.sqrt_tm1d2);
		const a0 = F.pow(F.mul(F.square(w), a), 2 ** (F.sqrt_s - 1));
		if (F.eq(a0, F.negone)) return null;
		let v = F.sqrt_s;
		let x = F.mul(a, w);
		let b = F.mul(x, w);
		let z = F.sqrt_z;
		while (!F.eq(b, F.one)) {
			let b2k = F.square(b);
			let k = 1;
			while (!F.eq(b2k, F.one)) {
				b2k = F.square(b2k);
				k++;
			}
			w = z;
			for (let i = 0; i < v - k - 1; i++) w = F.square(w);
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
	F.sqrt_e1 = div(sub(F.sqrt_q, 3), 4);
	F.sqrt = function(a) {
		if (this.isZero(a)) return this.zero;
		const a1 = this.pow(a, this.sqrt_e1);
		const a0 = this.mul(this.square(a1), a);
		if (this.eq(a0, this.negone)) return null;
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
	F.sqrt_q = pow(F.p, F.m / 2);
	F.sqrt_e34 = div(sub(F.sqrt_q, 3), 4);
	F.sqrt_e12 = div(sub(F.sqrt_q, 1), 2);
	F.frobenius = function(n, x) {
		if (n % 2 == 1)
 /* c8 ignore start */
		return F.conjugate(x);
		else return x;
	};
	/* c8 ignore stop */
	F.sqrt = function(a) {
		const F = this;
		const a1 = F.pow(a, F.sqrt_e34);
		const alfa = F.mul(F.square(a1), a);
		const a0 = F.mul(F.frobenius(1, alfa), alfa);
		if (F.eq(a0, F.negone)) return null;
		const x0 = F.mul(a1, a);
		/* c8 ignore start */
		let x;
		if (F.eq(alfa, F.negone)) x = F.mul(x0, [F.F.zero, F.F.one]);
		else {
			/* c8 ignore stop */
			const b = F.pow(F.add(F.one, alfa), F.sqrt_e12);
			x = F.mul(b, x0);
		}
		return F.geq(x, F.zero) ? x : F.neg(x);
	};
}
/* c8 ignore start */
function alg8_complex(F) {
	F.sqrt = function() {
		throw new Error("Sqrt alg 8 not implemented");
	};
}
/* c8 ignore stop */
//#endregion
//#region src/chacha.js
function quarterRound(st, a, b, c, d) {
	st[a] = st[a] + st[b] >>> 0;
	st[d] = (st[d] ^ st[a]) >>> 0;
	st[d] = (st[d] << 16 | st[d] >>> 16 & 65535) >>> 0;
	st[c] = st[c] + st[d] >>> 0;
	st[b] = (st[b] ^ st[c]) >>> 0;
	st[b] = (st[b] << 12 | st[b] >>> 20 & 4095) >>> 0;
	st[a] = st[a] + st[b] >>> 0;
	st[d] = (st[d] ^ st[a]) >>> 0;
	st[d] = (st[d] << 8 | st[d] >>> 24 & 255) >>> 0;
	st[c] = st[c] + st[d] >>> 0;
	st[b] = (st[b] ^ st[c]) >>> 0;
	st[b] = (st[b] << 7 | st[b] >>> 25 & 127) >>> 0;
}
function doubleRound(st) {
	quarterRound(st, 0, 4, 8, 12);
	quarterRound(st, 1, 5, 9, 13);
	quarterRound(st, 2, 6, 10, 14);
	quarterRound(st, 3, 7, 11, 15);
	quarterRound(st, 0, 5, 10, 15);
	quarterRound(st, 1, 6, 11, 12);
	quarterRound(st, 2, 7, 8, 13);
	quarterRound(st, 3, 4, 9, 14);
}
var ChaCha = class {
	constructor(seed) {
		seed = seed || [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		];
		this.state = [
			1634760805,
			857760878,
			2036477234,
			1797285236,
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
		return add(mul(this.nextU32(), 4294967296), this.nextU32());
	}
	nextBool() {
		return (this.nextU32() & 1) == 1;
	}
	update() {
		for (let i = 0; i < 16; i++) this.buff[i] = this.state[i];
		for (let i = 0; i < 10; i++) doubleRound(this.buff);
		for (let i = 0; i < 16; i++) this.buff[i] = this.buff[i] + this.state[i] >>> 0;
		this.idx = 0;
		this.state[12] = this.state[12] + 1 >>> 0;
		if (this.state[12] != 0) return;
		/* c8 ignore start */
		this.state[13] = this.state[13] + 1 >>> 0;
		if (this.state[13] != 0) return;
		this.state[14] = this.state[14] + 1 >>> 0;
		if (this.state[14] != 0) return;
		this.state[15] = this.state[15] + 1 >>> 0;
		/* c8 ignore stop */
	}
};
//#endregion
//#region src/random.js
var import___vite_browser_external = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
})))(), 1);
function getRandomBytes(n) {
	let array = new Uint8Array(n);
	if (import___vite_browser_external.default && import___vite_browser_external.default.randomFillSync) import___vite_browser_external.default.randomFillSync(array);
	else if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) for (let i = 0; i < n; i += 65536) globalThis.crypto.getRandomValues(array.subarray(i, Math.min(i + 65536, n)));
	else for (let i = 0; i < n; i++) array[i] = Math.random() * 4294967296 >>> 0;
	return array;
}
function getRandomSeed() {
	const arr = getRandomBytes(32);
	const arrV = new Uint32Array(arr.buffer);
	const seed = [];
	for (let i = 0; i < 8; i++) seed.push(arrV[i]);
	return seed;
}
var threadRng = null;
function getThreadRng() {
	if (threadRng) return threadRng;
	threadRng = new ChaCha(getRandomSeed());
	return threadRng;
}
//#endregion
//#region src/fft.js
var FFT = class {
	constructor(G, F, opMulGF) {
		this.F = F;
		this.G = G;
		this.opMulGF = opMulGF;
		let rem = F.sqrt_t || F.t;
		let s = F.sqrt_s || F.s;
		let nqr = F.one;
		while (F.eq(F.pow(nqr, F.half), F.one)) nqr = F.add(nqr, F.one);
		this.w = new Array(s + 1);
		this.wi = new Array(s + 1);
		this.w[s] = this.F.pow(nqr, rem);
		this.wi[s] = this.F.inv(this.w[s]);
		let n = s - 1;
		while (n >= 0) {
			this.w[n] = this.F.square(this.w[n + 1]);
			this.wi[n] = this.F.square(this.wi[n + 1]);
			n--;
		}
		this.roots = [];
		this._setRoots(Math.min(s, 15));
	}
	_setRoots(n) {
		for (let i = n; i >= 0 && !this.roots[i]; i--) {
			let r = this.F.one;
			const nroots = 1 << i;
			const rootsi = new Array(nroots);
			for (let j = 0; j < nroots; j++) {
				rootsi[j] = r;
				r = this.F.mul(r, this.w[i]);
			}
			this.roots[i] = rootsi;
		}
	}
	fft(p) {
		if (p.length <= 1) return p;
		const bits = log2$1(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		if (p.length != m)
 /* c8 ignore start */
		throw new Error("Size must be multiple of 2");
		return __fft(this, p, bits, 0, 1);
	}
	ifft(p) {
		if (p.length <= 1) return p;
		const bits = log2$1(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		if (p.length != m)
 /* c8 ignore start */
		throw new Error("Size must be multiple of 2");
		/* c8 ignore stop */
		const res = __fft(this, p, bits, 0, 1);
		const twoinvm = this.F.inv(this.F.mulScalar(this.F.one, m));
		const resn = new Array(m);
		for (let i = 0; i < m; i++) resn[i] = this.opMulGF(res[(m - i) % m], twoinvm);
		return resn;
	}
};
function log2$1(V) {
	return ((V & 4294901760) !== 0 ? (V &= 4294901760, 16) : 0) | ((V & 4278255360) !== 0 ? (V &= 4278255360, 8) : 0) | ((V & 4042322160) !== 0 ? (V &= 4042322160, 4) : 0) | ((V & 3435973836) !== 0 ? (V &= 3435973836, 2) : 0) | (V & 2863311530) !== 0;
}
function __fft(PF, pall, bits, offset, step) {
	const n = 1 << bits;
	if (n == 1)
 /* c8 ignore start */
	return [pall[offset]];
	else if (n == 2) return [PF.G.add(pall[offset], pall[offset + step]), PF.G.sub(pall[offset], pall[offset + step])];
	const ndiv2 = n >> 1;
	const p1 = __fft(PF, pall, bits - 1, offset, step * 2);
	const p2 = __fft(PF, pall, bits - 1, offset + step, step * 2);
	const out = new Array(n);
	for (let i = 0; i < ndiv2; i++) {
		out[i] = PF.G.add(p1[i], PF.opMulGF(p2[i], PF.roots[bits][i]));
		out[i + ndiv2] = PF.G.sub(p1[i], PF.opMulGF(p2[i], PF.roots[bits][i]));
	}
	return out;
}
//#endregion
//#region src/f1field.js
var ZqField = class {
	constructor(p) {
		this.type = "F1";
		this.one = BigInt(1);
		this.zero = BigInt(0);
		this.p = BigInt(p);
		this.m = 1;
		this.negone = this.p - this.one;
		this.two = BigInt(2);
		this.half = this.p >> this.one;
		this.bitLength = bitLength(this.p);
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
		this.fft = this.FFT.fft.bind(this.FFT);
		this.ifft = this.FFT.ifft.bind(this.FFT);
		this.w = this.FFT.w;
		this.wi = this.FFT.wi;
		this.shift = this.square(this.nqr);
		this.k = this.exp(this.nqr, 2 ** this.s);
	}
	e(a, b) {
		let res;
		if (!b) res = BigInt(a);
		else if (b == 16) res = BigInt("0x" + a);
		if (res < 0) {
			let nres = -res;
			if (nres >= this.p) nres = nres % this.p;
			return this.p - nres;
		} else return res >= this.p ? res % this.p : res;
	}
	add(a, b) {
		const res = a + b;
		return res >= this.p ? res - this.p : res;
	}
	sub(a, b) {
		return a >= b ? a - b : this.p - b + a;
	}
	neg(a) {
		return a ? this.p - a : a;
	}
	mul(a, b) {
		return a * b % this.p;
	}
	mulScalar(base, s) {
		return base * this.e(s) % this.p;
	}
	copy(a) {
		return a;
	}
	square(a) {
		return a * a % this.p;
	}
	eq(a, b) {
		return a == b;
	}
	neq(a, b) {
		return a != b;
	}
	lt(a, b) {
		return (a > this.half ? a - this.p : a) < (b > this.half ? b - this.p : b);
	}
	gt(a, b) {
		return (a > this.half ? a - this.p : a) > (b > this.half ? b - this.p : b);
	}
	leq(a, b) {
		return (a > this.half ? a - this.p : a) <= (b > this.half ? b - this.p : b);
	}
	geq(a, b) {
		return (a > this.half ? a - this.p : a) >= (b > this.half ? b - this.p : b);
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
			let q = r / newr;
			[t, newt] = [newt, t - q * newt];
			[r, newr] = [newr, r - q * newr];
		}
		if (t < this.zero) t += this.p;
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
		const res = a & b & this.mask;
		return res >= this.p ? res - this.p : res;
	}
	bor(a, b) {
		const res = (a | b) & this.mask;
		return res >= this.p ? res - this.p : res;
	}
	bxor(a, b) {
		const res = (a ^ b) & this.mask;
		return res >= this.p ? res - this.p : res;
	}
	bnot(a) {
		const res = a ^ this.mask;
		return res >= this.p ? res - this.p : res;
	}
	shl(a, b) {
		if (Number(b) < this.bitLength) {
			const res = a << b & this.mask;
			return res >= this.p ? res - this.p : res;
		} else {
			const nb = this.p - b;
			if (Number(nb) < this.bitLength) return a >> nb;
			else return this.zero;
		}
	}
	shr(a, b) {
		if (Number(b) < this.bitLength) return a >> b;
		else {
			const nb = this.p - b;
			if (Number(nb) < this.bitLength) {
				const res = a << nb & this.mask;
				return res >= this.p ? res - this.p : res;
			} else return 0;
		}
	}
	land(a, b) {
		return a && b ? this.one : this.zero;
	}
	lor(a, b) {
		return a || b ? this.one : this.zero;
	}
	lnot(a) {
		return a ? this.zero : this.one;
	}
	sqrt_old(n) {
		if (n == this.zero) return this.zero;
		if (this.pow(n, this.negone >> this.one) != this.one) return null;
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
			let b = c;
			for (let j = 0; j < m - i - 1; j++) b = this.square(b);
			m = i;
			c = this.square(b);
			t = this.mul(t, c);
			r = this.mul(r, b);
		}
		if (r > this.p >> this.one) r = this.neg(r);
		return r;
	}
	normalize(a, b) {
		a = BigInt(a, b);
		if (a < 0) {
			let na = -a;
			if (na >= this.p) na = na % this.p;
			return this.p - na;
		} else return a >= this.p ? a % this.p : a;
	}
	random() {
		const nBytes = this.bitLength * 2 / 8;
		let res = this.zero;
		for (let i = 0; i < nBytes; i++) res = (res << BigInt(8)) + BigInt(getRandomBytes(1)[0]);
		return res % this.p;
	}
	toString(a, base) {
		base = base || 10;
		let vs;
		if (a > this.half && base == 10) vs = "-" + (this.p - a).toString(base);
		else vs = a.toString(base);
		return vs;
	}
	isZero(a) {
		return a == this.zero;
	}
	fromRng(rng) {
		let v;
		do {
			v = this.zero;
			for (let i = 0; i < this.n64; i++) v += rng.nextU64() << BigInt(64 * i);
			v &= this.mask;
		} while (v >= this.p);
		v = v * this.Ri % this.p;
		return v;
	}
	fft(a) {
		return this.FFT.fft(a);
	}
	ifft(a) {
		return this.FFT.ifft(a);
	}
	toRprLE(buff, o, e) {
		toRprLE(buff, o, e, this.n64 * 8);
	}
	toRprBE(buff, o, e) {
		toRprBE(buff, o, e, this.n64 * 8);
	}
	toRprBEM(buff, o, e) {
		return this.toRprBE(buff, o, this.mul(this.R, e));
	}
	toRprLEM(buff, o, e) {
		return this.toRprLE(buff, o, this.mul(this.R, e));
	}
	fromRprLE(buff, o) {
		return fromRprLE(buff, o, this.n8);
	}
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
};
//#endregion
//#region src/f2field.js
var F2Field = class {
	constructor(F, nonResidue) {
		this.type = "F2";
		this.F = F;
		this.zero = [this.F.zero, this.F.zero];
		this.one = [this.F.one, this.F.zero];
		this.negone = this.neg(this.one);
		this.nonResidue = nonResidue;
		this.m = F.m * 2;
		this.p = F.p;
		this.n64 = F.n64 * 2;
		this.n32 = this.n64 * 2;
		this.n8 = this.n64 * 8;
		buildSqrt(this);
	}
	_mulByNonResidue(a) {
		return this.F.mul(this.nonResidue, a);
	}
	copy(a) {
		return [this.F.copy(a[0]), this.F.copy(a[1])];
	}
	add(a, b) {
		return [this.F.add(a[0], b[0]), this.F.add(a[1], b[1])];
	}
	double(a) {
		return this.add(a, a);
	}
	sub(a, b) {
		return [this.F.sub(a[0], b[0]), this.F.sub(a[1], b[1])];
	}
	neg(a) {
		return this.sub(this.zero, a);
	}
	conjugate(a) {
		return [a[0], this.F.neg(a[1])];
	}
	mul(a, b) {
		const aA = this.F.mul(a[0], b[0]);
		const bB = this.F.mul(a[1], b[1]);
		return [this.F.add(aA, this._mulByNonResidue(bB)), this.F.sub(this.F.mul(this.F.add(a[0], a[1]), this.F.add(b[0], b[1])), this.F.add(aA, bB))];
	}
	inv(a) {
		const t0 = this.F.square(a[0]);
		const t1 = this.F.square(a[1]);
		const t2 = this.F.sub(t0, this._mulByNonResidue(t1));
		const t3 = this.F.inv(t2);
		return [this.F.mul(a[0], t3), this.F.neg(this.F.mul(a[1], t3))];
	}
	div(a, b) {
		return this.mul(a, this.inv(b));
	}
	square(a) {
		const ab = this.F.mul(a[0], a[1]);
		return [this.F.sub(this.F.mul(this.F.add(a[0], a[1]), this.F.add(a[0], this._mulByNonResidue(a[1]))), this.F.add(ab, this._mulByNonResidue(ab))), this.F.add(ab, ab)];
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
		return [this.F.fromRng(rng), this.F.fromRng(rng)];
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
		return !this.geq(a, b);
	}
	leq(a, b) {
		return !this.gt(a, b);
	}
	neq(a, b) {
		return !this.eq(a, b);
	}
	random() {
		return [this.F.random(), this.F.random()];
	}
	toRprLE(buff, o, e) {
		this.F.toRprLE(buff, o, e[0]);
		this.F.toRprLE(buff, o + this.F.n8, e[1]);
	}
	toRprBE(buff, o, e) {
		this.F.toRprBE(buff, o, e[1]);
		this.F.toRprBE(buff, o + this.F.n8, e[0]);
	}
	toRprLEM(buff, o, e) {
		this.F.toRprLEM(buff, o, e[0]);
		this.F.toRprLEM(buff, o + this.F.n8, e[1]);
	}
	toRprBEM(buff, o, e) {
		this.F.toRprBEM(buff, o, e[1]);
		this.F.toRprBEM(buff, o + this.F.n8, e[0]);
	}
	fromRprLE(buff, o) {
		o = o || 0;
		return [this.F.fromRprLE(buff, o), this.F.fromRprLE(buff, o + this.F.n8)];
	}
	fromRprBE(buff, o) {
		o = o || 0;
		const c1 = this.F.fromRprBE(buff, o);
		return [this.F.fromRprBE(buff, o + this.F.n8), c1];
	}
	fromRprLEM(buff, o) {
		o = o || 0;
		return [this.F.fromRprLEM(buff, o), this.F.fromRprLEM(buff, o + this.F.n8)];
	}
	fromRprBEM(buff, o) {
		o = o || 0;
		const c1 = this.F.fromRprBEM(buff, o);
		return [this.F.fromRprBEM(buff, o + this.F.n8), c1];
	}
	toObject(a) {
		return a;
	}
};
//#endregion
//#region src/f3field.js
var F3Field = class {
	constructor(F, nonResidue) {
		this.type = "F3";
		this.F = F;
		this.zero = [
			this.F.zero,
			this.F.zero,
			this.F.zero
		];
		this.one = [
			this.F.one,
			this.F.zero,
			this.F.zero
		];
		this.negone = this.neg(this.one);
		this.nonResidue = nonResidue;
		this.m = F.m * 3;
		this.p = F.p;
		this.n64 = F.n64 * 3;
		this.n32 = this.n64 * 2;
		this.n8 = this.n64 * 8;
	}
	_mulByNonResidue(a) {
		return this.F.mul(this.nonResidue, a);
	}
	copy(a) {
		return [
			this.F.copy(a[0]),
			this.F.copy(a[1]),
			this.F.copy(a[2])
		];
	}
	add(a, b) {
		return [
			this.F.add(a[0], b[0]),
			this.F.add(a[1], b[1]),
			this.F.add(a[2], b[2])
		];
	}
	double(a) {
		return this.add(a, a);
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
		const aA = this.F.mul(a[0], b[0]);
		const bB = this.F.mul(a[1], b[1]);
		const cC = this.F.mul(a[2], b[2]);
		return [
			this.F.add(aA, this._mulByNonResidue(this.F.sub(this.F.mul(this.F.add(a[1], a[2]), this.F.add(b[1], b[2])), this.F.add(bB, cC)))),
			this.F.add(this.F.sub(this.F.mul(this.F.add(a[0], a[1]), this.F.add(b[0], b[1])), this.F.add(aA, bB)), this._mulByNonResidue(cC)),
			this.F.add(this.F.sub(this.F.mul(this.F.add(a[0], a[2]), this.F.add(b[0], b[2])), this.F.add(aA, cC)), bB)
		];
	}
	inv(a) {
		const t0 = this.F.square(a[0]);
		const t1 = this.F.square(a[1]);
		const t2 = this.F.square(a[2]);
		const t3 = this.F.mul(a[0], a[1]);
		const t4 = this.F.mul(a[0], a[2]);
		const t5 = this.F.mul(a[1], a[2]);
		const c0 = this.F.sub(t0, this._mulByNonResidue(t5));
		const c1 = this.F.sub(this._mulByNonResidue(t2), t3);
		const c2 = this.F.sub(t1, t4);
		const t6 = this.F.inv(this.F.add(this.F.mul(a[0], c0), this._mulByNonResidue(this.F.add(this.F.mul(a[2], c1), this.F.mul(a[1], c2)))));
		return [
			this.F.mul(t6, c0),
			this.F.mul(t6, c1),
			this.F.mul(t6, c2)
		];
	}
	div(a, b) {
		return this.mul(a, this.inv(b));
	}
	square(a) {
		const s0 = this.F.square(a[0]);
		const ab = this.F.mul(a[0], a[1]);
		const s1 = this.F.add(ab, ab);
		const s2 = this.F.square(this.F.add(this.F.sub(a[0], a[1]), a[2]));
		const bc = this.F.mul(a[1], a[2]);
		const s3 = this.F.add(bc, bc);
		const s4 = this.F.square(a[2]);
		return [
			this.F.add(s0, this._mulByNonResidue(s3)),
			this.F.add(s1, this._mulByNonResidue(s4)),
			this.F.sub(this.F.add(this.F.add(s1, s2), s3), this.F.add(s0, s4))
		];
	}
	isZero(a) {
		return this.F.isZero(a[0]) && this.F.isZero(a[1]) && this.F.isZero(a[2]);
	}
	eq(a, b) {
		return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]) && this.F.eq(a[2], b[2]);
	}
	affine(a) {
		return [
			this.F.affine(a[0]),
			this.F.affine(a[1]),
			this.F.affine(a[2])
		];
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
		return [
			this.F.fromRng(rng),
			this.F.fromRng(rng),
			this.F.fromRng(rng)
		];
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
		return !this.geq(a, b);
	}
	leq(a, b) {
		return !this.gt(a, b);
	}
	neq(a, b) {
		return !this.eq(a, b);
	}
	random() {
		return [
			this.F.random(),
			this.F.random(),
			this.F.random()
		];
	}
	toRprLE(buff, o, e) {
		this.F.toRprLE(buff, o, e[0]);
		this.F.toRprLE(buff, o + this.F.n8, e[1]);
		this.F.toRprLE(buff, o + this.F.n8 * 2, e[2]);
	}
	toRprBE(buff, o, e) {
		this.F.toRprBE(buff, o, e[2]);
		this.F.toRprBE(buff, o + this.F.n8, e[1]);
		this.F.toRprBE(buff, o + this.F.n8 * 2, e[0]);
	}
	toRprLEM(buff, o, e) {
		this.F.toRprLEM(buff, o, e[0]);
		this.F.toRprLEM(buff, o + this.F.n8, e[1]);
		this.F.toRprLEM(buff, o + this.F.n8 * 2, e[2]);
	}
	toRprBEM(buff, o, e) {
		this.F.toRprBEM(buff, o, e[2]);
		this.F.toRprBEM(buff, o + this.F.n8, e[1]);
		this.F.toRprBEM(buff, o + this.F.n8 * 2, e[0]);
	}
	fromRprLE(buff, o) {
		o = o || 0;
		return [
			this.F.fromRprLE(buff, o),
			this.F.fromRprLE(buff, o + this.F.n8),
			this.F.fromRprLE(buff, o + this.F.n8 * 2)
		];
	}
	fromRprBE(buff, o) {
		o = o || 0;
		const c2 = this.F.fromRprBE(buff, o);
		const c1 = this.F.fromRprBE(buff, o + this.F.n8);
		return [
			this.F.fromRprBE(buff, o + this.F.n8 * 2),
			c1,
			c2
		];
	}
	fromRprLEM(buff, o) {
		o = o || 0;
		return [
			this.F.fromRprLEM(buff, o),
			this.F.fromRprLEM(buff, o + this.F.n8),
			this.F.fromRprLEM(buff, o + this.F.n8 * 2)
		];
	}
	fromRprBEM(buff, o) {
		o = o || 0;
		const c2 = this.F.fromRprBEM(buff, o);
		const c1 = this.F.fromRprBEM(buff, o + this.F.n8);
		return [
			this.F.fromRprBEM(buff, o + this.F.n8 * 2),
			c1,
			c2
		];
	}
	toObject(a) {
		return a;
	}
};
//#endregion
//#region src/ec.js
function isGreatest(F, a) {
	/* c8 ignore start */
	if (Array.isArray(a)) {
		for (let i = a.length - 1; i >= 0; i--) if (!F.F.isZero(a[i])) return isGreatest(F.F, a[i]);
		return 0;
	} else return gt(a, F.neg(a));
}
var EC = class {
	constructor(F, g) {
		this.F = F;
		this.g = g;
		if (this.g.length == 2) this.g[2] = this.F.one;
		this.zero = [
			this.F.zero,
			this.F.one,
			this.F.zero
		];
	}
	add(p1, p2) {
		const F = this.F;
		if (this.eq(p1, this.zero)) return p2;
		if (this.eq(p2, this.zero)) return p1;
		const res = new Array(3);
		const Z1Z1 = F.square(p1[2]);
		const Z2Z2 = F.square(p2[2]);
		const U1 = F.mul(p1[0], Z2Z2);
		const U2 = F.mul(p2[0], Z1Z1);
		const Z1_cubed = F.mul(p1[2], Z1Z1);
		const Z2_cubed = F.mul(p2[2], Z2Z2);
		const S1 = F.mul(p1[1], Z2_cubed);
		const S2 = F.mul(p2[1], Z1_cubed);
		if (F.eq(U1, U2) && F.eq(S1, S2)) return this.double(p1);
		const H = F.sub(U2, U1);
		const S2_minus_S1 = F.sub(S2, S1);
		const I = F.square(F.add(H, H));
		const J = F.mul(H, I);
		const r = F.add(S2_minus_S1, S2_minus_S1);
		const V = F.mul(U1, I);
		res[0] = F.sub(F.sub(F.square(r), J), F.add(V, V));
		const S1_J = F.mul(S1, J);
		res[1] = F.sub(F.mul(r, F.sub(V, res[0])), F.add(S1_J, S1_J));
		res[2] = F.mul(H, F.sub(F.square(F.add(p1[2], p2[2])), F.add(Z1Z1, Z2Z2)));
		return res;
	}
	neg(p) {
		return [
			p[0],
			this.F.neg(p[1]),
			p[2]
		];
	}
	sub(a, b) {
		return this.add(a, this.neg(b));
	}
	double(p) {
		const F = this.F;
		const res = new Array(3);
		if (this.eq(p, this.zero)) return p;
		const A = F.square(p[0]);
		const B = F.square(p[1]);
		const C = F.square(B);
		let D = F.sub(F.square(F.add(p[0], B)), F.add(A, C));
		D = F.add(D, D);
		const E = F.add(F.add(A, A), A);
		const FF = F.square(E);
		res[0] = F.sub(FF, F.add(D, D));
		let eightC = F.add(C, C);
		eightC = F.add(eightC, eightC);
		eightC = F.add(eightC, eightC);
		res[1] = F.sub(F.mul(E, F.sub(D, res[0])), eightC);
		const Y1Z1 = F.mul(p[1], p[2]);
		res[2] = F.add(Y1Z1, Y1Z1);
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
		if (this.isZero(p)) return this.zero;
		else if (F.eq(p[2], F.one)) return p;
		else {
			const Z_inv = F.inv(p[2]);
			const Z2_inv = F.square(Z_inv);
			const Z3_inv = F.mul(Z2_inv, Z_inv);
			const res = new Array(3);
			res[0] = F.mul(p[0], Z2_inv);
			res[1] = F.mul(p[1], Z3_inv);
			res[2] = F.one;
			return res;
		}
	}
	multiAffine(arr) {
		const keys = Object.keys(arr);
		const F = this.F;
		const accMul = new Array(keys.length + 1);
		accMul[0] = F.one;
		for (let i = 0; i < keys.length; i++) if (F.eq(arr[keys[i]][2], F.zero)) accMul[i + 1] = accMul[i];
		else accMul[i + 1] = F.mul(accMul[i], arr[keys[i]][2]);
		accMul[keys.length] = F.inv(accMul[keys.length]);
		for (let i = keys.length - 1; i >= 0; i--) if (F.eq(arr[keys[i]][2], F.zero)) {
			accMul[i] = accMul[i + 1];
			arr[keys[i]] = this.zero;
		} else {
			const Z_inv = F.mul(accMul[i], accMul[i + 1]);
			accMul[i] = F.mul(arr[keys[i]][2], accMul[i + 1]);
			const Z2_inv = F.square(Z_inv);
			const Z3_inv = F.mul(Z2_inv, Z_inv);
			arr[keys[i]][0] = F.mul(arr[keys[i]][0], Z2_inv);
			arr[keys[i]][1] = F.mul(arr[keys[i]][1], Z3_inv);
			arr[keys[i]][2] = F.one;
		}
	}
	eq(p1, p2) {
		const F = this.F;
		if (this.F.eq(p1[2], this.F.zero)) return this.F.eq(p2[2], this.F.zero);
		if (this.F.eq(p2[2], this.F.zero)) return false;
		const Z1Z1 = F.square(p1[2]);
		const Z2Z2 = F.square(p2[2]);
		const U1 = F.mul(p1[0], Z2Z2);
		const U2 = F.mul(p2[0], Z1Z1);
		const Z1_cubed = F.mul(p1[2], Z1Z1);
		const Z2_cubed = F.mul(p2[2], Z2Z2);
		const S1 = F.mul(p1[1], Z2_cubed);
		const S2 = F.mul(p2[1], Z1_cubed);
		return F.eq(U1, U2) && F.eq(S1, S2);
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
		} while (P[1] == null || F.isZero[P]);
		const s = isGreatest(F, P[1]);
		if (greatest ^ s) P[1] = F.neg(P[1]);
		P[2] = F.one;
		/* c8 ignore start */
		if (this.cofactor) P = this.mulScalar(P, this.cofactor);
		/* c8 ignore stop */
		P = this.affine(P);
		return P;
	}
	toRprLE(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff.buffer, buff.byteOffset + o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprLE(buff, o, p[0]);
		this.F.toRprLE(buff, o + this.F.n8, p[1]);
	}
	toRprBE(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff.buffer, buff.byteOffset + o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprBE(buff, o, p[0]);
		this.F.toRprBE(buff, o + this.F.n8, p[1]);
	}
	toRprLEM(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff.buffer, buff.byteOffset + o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprLEM(buff, o, p[0]);
		this.F.toRprLEM(buff, o + this.F.n8, p[1]);
	}
	toRprLEJM(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff.buffer, buff.byteOffset + o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprLEM(buff, o, p[0]);
		this.F.toRprLEM(buff, o + this.F.n8, p[1]);
		this.F.toRprLEM(buff, o + 2 * this.F.n8, p[2]);
	}
	toRprBEM(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff.buffer, buff.byteOffset + o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprBEM(buff, o, p[0]);
		this.F.toRprBEM(buff, o + this.F.n8, p[1]);
	}
	fromRprLE(buff, o) {
		o = o || 0;
		const x = this.F.fromRprLE(buff, o);
		const y = this.F.fromRprLE(buff, o + this.F.n8);
		if (this.F.isZero(x) && this.F.isZero(y)) return this.zero;
		return [
			x,
			y,
			this.F.one
		];
	}
	fromRprBE(buff, o) {
		o = o || 0;
		const x = this.F.fromRprBE(buff, o);
		const y = this.F.fromRprBE(buff, o + this.F.n8);
		if (this.F.isZero(x) && this.F.isZero(y)) return this.zero;
		return [
			x,
			y,
			this.F.one
		];
	}
	fromRprLEM(buff, o) {
		o = o || 0;
		const x = this.F.fromRprLEM(buff, o);
		const y = this.F.fromRprLEM(buff, o + this.F.n8);
		if (this.F.isZero(x) && this.F.isZero(y)) return this.zero;
		return [
			x,
			y,
			this.F.one
		];
	}
	fromRprLEJM(buff, o) {
		o = o || 0;
		const x = this.F.fromRprLEM(buff, o);
		const y = this.F.fromRprLEM(buff, o + this.F.n8);
		const z = this.F.fromRprLEM(buff, o + this.F.n8 * 2);
		if (this.F.isZero(x) && this.F.isZero(y)) return this.zero;
		return [
			x,
			y,
			z
		];
	}
	fromRprBEM(buff, o) {
		o = o || 0;
		const x = this.F.fromRprBEM(buff, o);
		const y = this.F.fromRprBEM(buff, o + this.F.n8);
		if (this.F.isZero(x) && this.F.isZero(y)) return this.zero;
		return [
			x,
			y,
			this.F.one
		];
	}
	fromRprCompressed(buff, o) {
		const F = this.F;
		const v = new Uint8Array(buff.buffer, buff.byteOffset + o, F.n8);
		if (v[0] & 64) return this.zero;
		const P = new Array(3);
		const greatest = (v[0] & 128) != 0;
		v[0] = v[0] & 127;
		P[0] = F.fromRprBE(buff, o);
		if (greatest) v[0] = v[0] | 128;
		const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
		P[1] = F.sqrt(x3b);
		/* c8 ignore start */
		if (P[1] === null) throw new Error("Invalid Point!");
		if (greatest ^ isGreatest(F, P[1])) P[1] = F.neg(P[1]);
		P[2] = F.one;
		return P;
	}
	toRprCompressed(buff, o, p) {
		p = this.affine(p);
		const v = new Uint8Array(buff.buffer, buff.byteOffset + o, this.F.n8);
		if (this.isZero(p)) {
			v.fill(0);
			v[0] = 64;
			return;
		}
		this.F.toRprBE(buff, o, p[0]);
		if (isGreatest(this.F, p[1])) v[0] = v[0] | 128;
	}
	fromRprUncompressed(buff, o) {
		if (buff[0] & 64) return this.zero;
		return this.fromRprBE(buff, o);
	}
	toRprUncompressed(buff, o, p) {
		this.toRprBE(buff, o, p);
		if (this.isZero(p)) buff[o] = buff[o] | 64;
	}
};
//#endregion
//#region src/utils.js
var utils_exports = /* @__PURE__ */ __exportAll({
	array2buffer: () => array2buffer,
	beBuff2int: () => beBuff2int,
	beInt2Buff: () => beInt2Buff,
	bitReverse: () => bitReverse,
	buffReverseBits: () => buffReverseBits,
	buffer2array: () => buffer2array,
	leBuff2int: () => leBuff2int,
	leInt2Buff: () => leInt2Buff,
	log2: () => log2,
	stringifyBigInts: () => stringifyBigInts,
	stringifyFElements: () => stringifyFElements,
	unstringifyBigInts: () => unstringifyBigInts,
	unstringifyFElements: () => unstringifyFElements
});
function stringifyBigInts(o) {
	if (typeof o == "bigint" || o.eq !== void 0) return o.toString(10);
	else if (o instanceof Uint8Array) return fromRprLE(o, 0);
	else if (Array.isArray(o)) return o.map(stringifyBigInts);
	else if (typeof o == "object") {
		const res = {};
		Object.keys(o).forEach((k) => {
			res[k] = stringifyBigInts(o[k]);
		});
		return res;
	} else return o;
}
function unstringifyBigInts(o) {
	if (typeof o == "string" && /^[0-9]+$/.test(o)) return BigInt(o);
	else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) return BigInt(o);
	else if (Array.isArray(o)) return o.map(unstringifyBigInts);
	else if (typeof o == "object") {
		if (o === null) return null;
		const res = {};
		Object.keys(o).forEach((k) => {
			res[k] = unstringifyBigInts(o[k]);
		});
		return res;
	} else return o;
}
function beBuff2int(buff) {
	let res = BigInt(0);
	let i = buff.length;
	let offset = 0;
	const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
	while (i > 0) if (i >= 4) {
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
	return res;
}
function beInt2Buff(n, len) {
	let r = n;
	const buff = new Uint8Array(len);
	const buffV = new DataView(buff.buffer);
	let o = len;
	while (o > 0) if (o - 4 >= 0) {
		o -= 4;
		buffV.setUint32(o, Number(r & BigInt(4294967295)));
		r = r >> BigInt(32);
	} else if (o - 2 >= 0) {
		o -= 2;
		buffV.setUint16(o, Number(r & BigInt(65535)));
		r = r >> BigInt(16);
	} else {
		o -= 1;
		buffV.setUint8(o, Number(r & BigInt(255)));
		r = r >> BigInt(8);
	}
	if (r) throw new Error("Number does not fit in this length");
	return buff;
}
function leBuff2int(buff) {
	let res = BigInt(0);
	let i = 0;
	const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
	while (i < buff.length) if (i + 4 <= buff.length) {
		res += BigInt(buffV.getUint32(i, true)) << BigInt(i * 8);
		i += 4;
	} else if (i + 2 <= buff.length) {
		res += BigInt(buffV.getUint16(i, true)) << BigInt(i * 8);
		i += 2;
	} else {
		res += BigInt(buffV.getUint8(i, true)) << BigInt(i * 8);
		i += 1;
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
	while (o < len) if (o + 4 <= len) {
		buffV.setUint32(o, Number(r & BigInt(4294967295)), true);
		o += 4;
		r = r >> BigInt(32);
	} else if (o + 2 <= len) {
		buffV.setUint16(o, Number(r & BigInt(65535)), true);
		o += 2;
		r = r >> BigInt(16);
	} else {
		buffV.setUint8(o, Number(r & BigInt(255)), true);
		o += 1;
		r = r >> BigInt(8);
	}
	if (r) throw new Error("Number does not fit in this length");
	return buff;
}
function stringifyFElements(F, o) {
	if (typeof o == "bigint" || o.eq !== void 0) return o.toString(10);
	else if (o instanceof Uint8Array) return F.toString(F.e(o));
	else if (Array.isArray(o)) return o.map(stringifyFElements.bind(this, F));
	else if (typeof o == "object") {
		const res = {};
		Object.keys(o).forEach((k) => {
			res[k] = stringifyFElements(F, o[k]);
		});
		return res;
	} else return o;
}
function unstringifyFElements(F, o) {
	if (typeof o == "string" && /^[0-9]+$/.test(o)) return F.e(o);
	else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) return F.e(o);
	else if (Array.isArray(o)) return o.map(unstringifyFElements.bind(this, F));
	else if (typeof o == "object") {
		if (o === null) return null;
		const res = {};
		Object.keys(o).forEach((k) => {
			res[k] = unstringifyFElements(F, o[k]);
		});
		return res;
	} else return o;
}
var _revTable = [];
for (let i = 0; i < 256; i++) _revTable[i] = _revSlow(i, 8);
function _revSlow(idx, bits) {
	let res = 0;
	let a = idx;
	for (let i = 0; i < bits; i++) {
		res <<= 1;
		res = res | a & 1;
		a >>= 1;
	}
	return res;
}
function bitReverse(idx, bits) {
	return (_revTable[idx >>> 24] | _revTable[idx >>> 16 & 255] << 8 | _revTable[idx >>> 8 & 255] << 16 | _revTable[idx & 255] << 24) >>> 32 - bits;
}
function log2(V) {
	return ((V & 4294901760) !== 0 ? (V &= 4294901760, 16) : 0) | ((V & 4278255360) !== 0 ? (V &= 4278255360, 8) : 0) | ((V & 4042322160) !== 0 ? (V &= 4042322160, 4) : 0) | ((V & 3435973836) !== 0 ? (V &= 3435973836, 2) : 0) | (V & 2863311530) !== 0;
}
function buffReverseBits(buff, eSize) {
	const n = buff.byteLength / eSize;
	const bits = log2(n);
	if (n != 1 << bits)
 /* c8 ignore start */
	throw new Error("Invalid number of pointers");
	/* c8 ignore stop */
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
	for (let i = 0; i < arr.length; i++) buff.set(arr[i], i * sG);
	return buff;
}
function buffer2array(buff, sG) {
	const n = buff.byteLength / sG;
	const arr = new Array(n);
	for (let i = 0; i < n; i++) arr[i] = buff.slice(i * sG, i * sG + sG);
	return arr;
}
//#endregion
//#region src/bigbuffer.js
var PAGE_SIZE = 1 << 30;
var BigBuffer = class BigBuffer {
	constructor(size) {
		this.buffers = [];
		this.byteLength = size;
		for (let i = 0; i < size; i += PAGE_SIZE) {
			const n = Math.min(size - i, PAGE_SIZE);
			this.buffers.push(new Uint8Array(n));
		}
	}
	slice(fr, to) {
		if (to === void 0) to = this.byteLength;
		if (fr === void 0) fr = 0;
		const len = to - fr;
		const firstPage = Math.floor(fr / PAGE_SIZE);
		if (firstPage == Math.floor((fr + len - 1) / PAGE_SIZE) || len == 0) return this.buffers[firstPage].slice(fr % PAGE_SIZE, fr % PAGE_SIZE + len);
		let buff;
		let p = firstPage;
		let o = fr % PAGE_SIZE;
		let r = len;
		while (r > 0) {
			const l = o + r > PAGE_SIZE ? PAGE_SIZE - o : r;
			const srcView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset + o, l);
			if (l == len) return srcView.slice();
			if (!buff) if (len <= PAGE_SIZE) buff = new Uint8Array(len);
			else buff = new BigBuffer(len);
			buff.set(srcView, len - r);
			r = r - l;
			p++;
			o = 0;
		}
		return buff;
	}
	set(buff, offset) {
		if (offset === void 0) offset = 0;
		const len = buff.byteLength;
		if (len == 0) return;
		const firstPage = Math.floor(offset / PAGE_SIZE);
		if (firstPage == Math.floor((offset + len - 1) / PAGE_SIZE)) if (buff instanceof BigBuffer && buff.buffers.length == 1)
 /* c8 ignore start */
		return this.buffers[firstPage].set(buff.buffers[0], offset % PAGE_SIZE);
		else return this.buffers[firstPage].set(buff, offset % PAGE_SIZE);
		let p = firstPage;
		let o = offset % PAGE_SIZE;
		let r = len;
		while (r > 0) {
			const l = o + r > PAGE_SIZE ? PAGE_SIZE - o : r;
			const srcView = buff.slice(len - r, len - r + l);
			new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset + o, l).set(srcView);
			r = r - l;
			p++;
			o = 0;
		}
	}
};
//#endregion
//#region src/engine_batchconvert.js
function buildBatchConvert(tm, fnName, sIn, sOut) {
	return async function batchConvert(buffIn) {
		const nPoints = Math.floor(buffIn.byteLength / sIn);
		if (nPoints * sIn !== buffIn.byteLength) throw new Error("Invalid buffer size");
		const pointsPerChunk = Math.floor(nPoints / tm.concurrency);
		const opPromises = [];
		for (let i = 0; i < tm.concurrency; i++) {
			let n;
			if (i < tm.concurrency - 1) n = pointsPerChunk;
			else n = nPoints - i * pointsPerChunk;
			if (n == 0) continue;
			const buffChunk = buffIn.slice(i * pointsPerChunk * sIn, i * pointsPerChunk * sIn + n * sIn);
			const task = [
				{
					cmd: "ALLOCSET",
					var: 0,
					buff: buffChunk
				},
				{
					cmd: "ALLOC",
					var: 1,
					len: sOut * n
				},
				{
					cmd: "CALL",
					fnName,
					params: [
						{ var: 0 },
						{ val: n },
						{ var: 1 }
					]
				},
				{
					cmd: "GET",
					out: 0,
					var: 1,
					len: sOut * n
				}
			];
			opPromises.push(tm.queueAction(task, [buffChunk.buffer]));
		}
		const result = await Promise.all(opPromises);
		let fullBuffOut;
		if (buffIn instanceof BigBuffer) fullBuffOut = new BigBuffer(nPoints * sOut);
		else fullBuffOut = new Uint8Array(nPoints * sOut);
		let p = 0;
		for (let i = 0; i < result.length; i++) {
			fullBuffOut.set(result[i][0], p);
			p += result[i][0].byteLength;
		}
		return fullBuffOut;
	};
}
//#endregion
//#region src/wasm_field1.js
var WasmField1 = class {
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
		this.n64 = Math.floor(n8 / 8);
		this.n32 = Math.floor(n8 / 4);
		if (this.n64 * 8 != this.n8)
 /* c8 ignore start */
		throw new Error("n8 must be a multiple of 8");
		/* c8 ignore stop */
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
		while (!isOdd(t)) {
			this.s = this.s + 1;
			t = shiftRight(t, one);
		}
		this.w = [];
		this.w[this.s] = this.exp(this.nqr, t);
		for (let i = this.s - 1; i >= 0; i--) this.w[i] = this.square(this.w[i + 1]);
		/* c8 ignore start */
		if (!this.eq(this.w[0], this.one)) throw new Error("Error calculating roots of unity");
		/* c8 ignore stop */
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
	add(a, b) {
		return this.op2("_add", a, b);
	}
	eq(a, b) {
		return this.op2Bool("_eq", a, b);
	}
	isZero(a) {
		return this.op1Bool("_isZero", a);
	}
	sub(a, b) {
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
	mul(a, b) {
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
		if (!(b instanceof Uint8Array)) b = toLEBuff(e(b));
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
			if (gt(ra, this.p)) ra = mod(ra, this.p);
			ra = sub(this.p, ra);
		} else if (gt(ra, this.p)) ra = mod(ra, this.p);
		const buff = leInt2Buff(ra, this.n8);
		return this.toMontgomery(buff);
	}
	toString(a, radix) {
		return toString(fromRprLE(this.fromMontgomery(a), 0), radix);
	}
	fromRng(rng) {
		let v;
		const buff = new Uint8Array(this.n8);
		do {
			v = zero;
			for (let i = 0; i < this.n64; i++) v = add(v, shiftLeft(rng.nextU64(), 64 * i));
			v = band(v, this.mask);
		} while (geq(v, this.p));
		toRprLE(buff, 0, v, this.n8);
		return buff;
	}
	random() {
		return this.fromRng(getThreadRng());
	}
	toObject(a) {
		return fromRprLE(this.fromMontgomery(a), 0);
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
		for (let i = 0; i < this.n8 / 2; i++) {
			const aux = buff2[i];
			buff2[i] = buff2[this.n8 - 1 - i];
			buff2[this.n8 - 1 - i] = aux;
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
			buffIn = array2buffer(buffIn, sIn);
			returnArray = true;
		} else buffIn = buffIn.slice(0, buffIn.byteLength);
		const nPoints = Math.floor(buffIn.byteLength / sIn);
		if (nPoints * sIn !== buffIn.byteLength)
 /* c8 ignore start */
		throw new Error("Invalid buffer size");
		/* c8 ignore stop */
		const pointsPerChunk = Math.floor(nPoints / this.tm.concurrency);
		const opPromises = [];
		for (let i = 0; i < this.tm.concurrency; i++) {
			let n;
			if (i < this.tm.concurrency - 1) n = pointsPerChunk;
			else n = nPoints - i * pointsPerChunk;
			if (n == 0) continue;
			const buffChunk = buffIn.slice(i * pointsPerChunk * sIn, i * pointsPerChunk * sIn + n * sIn);
			const task = [
				{
					cmd: "ALLOCSET",
					var: 0,
					buff: buffChunk
				},
				{
					cmd: "ALLOC",
					var: 1,
					len: sOut * n
				},
				{
					cmd: "CALL",
					fnName: this.prefix + "_batchInverse",
					params: [
						{ var: 0 },
						{ val: sIn },
						{ val: n },
						{ var: 1 },
						{ val: sOut }
					]
				},
				{
					cmd: "GET",
					out: 0,
					var: 1,
					len: sOut * n
				}
			];
			opPromises.push(this.tm.queueAction(task, [buffChunk.buffer]));
		}
		const result = await Promise.all(opPromises);
		let fullBuffOut;
		if (buffIn instanceof BigBuffer)
 /* c8 ignore start */
		fullBuffOut = new BigBuffer(nPoints * sOut);
		else fullBuffOut = new Uint8Array(nPoints * sOut);
		let p = 0;
		for (let i = 0; i < result.length; i++) {
			fullBuffOut.set(result[i][0], p);
			p += result[i][0].byteLength;
		}
		if (returnArray) return buffer2array(fullBuffOut, sOut);
		else return fullBuffOut;
	}
};
//#endregion
//#region src/wasm_field2.js
var WasmField2 = class {
	constructor(tm, prefix, F) {
		this.tm = tm;
		this.prefix = prefix;
		this.F = F;
		this.type = "F2";
		this.m = F.m * 2;
		this.n8 = this.F.n8 * 2;
		this.n32 = this.F.n32 * 2;
		this.n64 = this.F.n64 * 2;
		this.pOp1 = tm.alloc(F.n8 * 2);
		this.pOp2 = tm.alloc(F.n8 * 2);
		this.pOp3 = tm.alloc(F.n8 * 2);
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
	add(a, b) {
		return this.op2("_add", a, b);
	}
	eq(a, b) {
		return this.op2Bool("_eq", a, b);
	}
	isZero(a) {
		return this.op1Bool("_isZero", a);
	}
	sub(a, b) {
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
	mul(a, b) {
		return this.op2("_mul", a, b);
	}
	mul1(a, b) {
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
		if (!(b instanceof Uint8Array)) b = toLEBuff(e(b));
		this.tm.setBuff(this.pOp1, a);
		this.tm.setBuff(this.pOp2, b);
		this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.n8);
	}
	e(a, b) {
		if (a instanceof Uint8Array) return a;
		if (Array.isArray(a) && a.length == 2) {
			const c1 = this.F.e(a[0], b);
			const c2 = this.F.e(a[1], b);
			const res = new Uint8Array(this.F.n8 * 2);
			res.set(c1);
			res.set(c2, this.F.n8);
			return res;
		} else throw new Error("invalid F2");
	}
	toString(a, radix) {
		return `[${this.F.toString(a.slice(0, this.F.n8), radix)}, ${this.F.toString(a.slice(this.F.n8), radix)}]`;
	}
	fromRng(rng) {
		const c1 = this.F.fromRng(rng);
		const c2 = this.F.fromRng(rng);
		const res = new Uint8Array(this.F.n8 * 2);
		res.set(c1);
		res.set(c2, this.F.n8);
		return res;
	}
	random() {
		return this.fromRng(getThreadRng());
	}
	toObject(a) {
		return [this.F.toObject(a.slice(0, this.F.n8)), this.F.toObject(a.slice(this.F.n8, this.F.n8 * 2))];
	}
	fromObject(a) {
		const buff = new Uint8Array(this.F.n8 * 2);
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
};
//#endregion
//#region src/wasm_field3.js
var WasmField3 = class {
	constructor(tm, prefix, F) {
		this.tm = tm;
		this.prefix = prefix;
		this.F = F;
		this.type = "F3";
		this.m = F.m * 3;
		this.n8 = this.F.n8 * 3;
		this.n32 = this.F.n32 * 3;
		this.n64 = this.F.n64 * 3;
		this.pOp1 = tm.alloc(F.n8 * 3);
		this.pOp2 = tm.alloc(F.n8 * 3);
		this.pOp3 = tm.alloc(F.n8 * 3);
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
	eq(a, b) {
		return this.op2Bool("_eq", a, b);
	}
	isZero(a) {
		return this.op1Bool("_isZero", a);
	}
	add(a, b) {
		return this.op2("_add", a, b);
	}
	sub(a, b) {
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
	mul(a, b) {
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
	/* c8 ignore start */
	isSquare(a) {
		return this.op1Bool("_isSquare", a);
	}
	sqrt(a) {
		return this.op1("_sqrt", a);
	}
	/* c8 ignore stop */
	exp(a, b) {
		if (!(b instanceof Uint8Array)) b = toLEBuff(e(b));
		this.tm.setBuff(this.pOp1, a);
		this.tm.setBuff(this.pOp2, b);
		this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.n8);
	}
	e(a, b) {
		if (a instanceof Uint8Array) return a;
		if (Array.isArray(a) && a.length == 3) {
			const c1 = this.F.e(a[0], b);
			const c2 = this.F.e(a[1], b);
			const c3 = this.F.e(a[2], b);
			const res = new Uint8Array(this.F.n8 * 3);
			res.set(c1);
			res.set(c2, this.F.n8);
			res.set(c3, this.F.n8 * 2);
			return res;
		} else throw new Error("invalid F3");
	}
	toString(a, radix) {
		return `[${this.F.toString(a.slice(0, this.F.n8), radix)}, ${this.F.toString(a.slice(this.F.n8, this.F.n8 * 2), radix)}, ${this.F.toString(a.slice(this.F.n8 * 2), radix)}]`;
	}
	fromRng(rng) {
		const c1 = this.F.fromRng(rng);
		const c2 = this.F.fromRng(rng);
		const c3 = this.F.fromRng(rng);
		const res = new Uint8Array(this.F.n8 * 3);
		res.set(c1);
		res.set(c2, this.F.n8);
		res.set(c3, this.F.n8 * 2);
		return res;
	}
	random() {
		return this.fromRng(getThreadRng());
	}
	toObject(a) {
		return [
			this.F.toObject(a.slice(0, this.F.n8)),
			this.F.toObject(a.slice(this.F.n8, this.F.n8 * 2)),
			this.F.toObject(a.slice(this.F.n8 * 2, this.F.n8 * 3))
		];
	}
	fromObject(a) {
		const buff = new Uint8Array(this.F.n8 * 3);
		const b1 = this.F.fromObject(a[0]);
		const b2 = this.F.fromObject(a[1]);
		const b3 = this.F.fromObject(a[2]);
		buff.set(b1);
		buff.set(b2, this.F.n8);
		buff.set(b3, this.F.n8 * 2);
		return buff;
	}
	c1(a) {
		return a.slice(0, this.F.n8);
	}
	c2(a) {
		return a.slice(this.F.n8, this.F.n8 * 2);
	}
	c3(a) {
		return a.slice(this.F.n8 * 2);
	}
};
//#endregion
//#region src/wasm_curve.js
var WasmCurve = class {
	constructor(tm, prefix, F, pGen, pGb, cofactor) {
		this.tm = tm;
		this.prefix = prefix;
		this.F = F;
		this.pOp1 = tm.alloc(F.n8 * 3);
		this.pOp2 = tm.alloc(F.n8 * 3);
		this.pOp3 = tm.alloc(F.n8 * 3);
		this.tm.instance.exports[prefix + "_zero"](this.pOp1);
		this.zero = this.tm.getBuff(this.pOp1, F.n8 * 3);
		this.tm.instance.exports[prefix + "_zeroAffine"](this.pOp1);
		this.zeroAffine = this.tm.getBuff(this.pOp1, F.n8 * 2);
		this.one = this.tm.getBuff(pGen, F.n8 * 3);
		this.g = this.one;
		this.oneAffine = this.tm.getBuff(pGen, F.n8 * 2);
		this.gAffine = this.oneAffine;
		this.b = this.tm.getBuff(pGb, F.n8);
		if (cofactor) this.cofactor = toLEBuff(cofactor);
		this.negone = this.neg(this.one);
		this.two = this.add(this.one, this.one);
		this.batchLEMtoC = buildBatchConvert(tm, prefix + "_batchLEMtoC", F.n8 * 2, F.n8);
		this.batchLEMtoU = buildBatchConvert(tm, prefix + "_batchLEMtoU", F.n8 * 2, F.n8 * 2);
		this.batchCtoLEM = buildBatchConvert(tm, prefix + "_batchCtoLEM", F.n8, F.n8 * 2);
		this.batchUtoLEM = buildBatchConvert(tm, prefix + "_batchUtoLEM", F.n8 * 2, F.n8 * 2);
		this.batchToJacobian = buildBatchConvert(tm, prefix + "_batchToJacobian", F.n8 * 2, F.n8 * 3);
		this.batchToAffine = buildBatchConvert(tm, prefix + "_batchToAffine", F.n8 * 3, F.n8 * 2);
	}
	op2(opName, a, b) {
		this.tm.setBuff(this.pOp1, a);
		this.tm.setBuff(this.pOp2, b);
		this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.F.n8 * 3);
	}
	op2bool(opName, a, b) {
		this.tm.setBuff(this.pOp1, a);
		this.tm.setBuff(this.pOp2, b);
		return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
	}
	op1(opName, a) {
		this.tm.setBuff(this.pOp1, a);
		this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.F.n8 * 3);
	}
	op1Affine(opName, a) {
		this.tm.setBuff(this.pOp1, a);
		this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.F.n8 * 2);
	}
	op1Bool(opName, a) {
		this.tm.setBuff(this.pOp1, a);
		return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
	}
	add(a, b) {
		if (a.byteLength == this.F.n8 * 3) if (b.byteLength == this.F.n8 * 3) return this.op2("_add", a, b);
		else if (b.byteLength == this.F.n8 * 2) return this.op2("_addMixed", a, b);
		else throw new Error("invalid point size");
		else if (a.byteLength == this.F.n8 * 2) if (b.byteLength == this.F.n8 * 3) return this.op2("_addMixed", b, a);
		else if (b.byteLength == this.F.n8 * 2) return this.op2("_addAffine", a, b);
		else throw new Error("invalid point size");
		else throw new Error("invalid point size");
	}
	sub(a, b) {
		if (a.byteLength == this.F.n8 * 3) if (b.byteLength == this.F.n8 * 3) return this.op2("_sub", a, b);
		else if (b.byteLength == this.F.n8 * 2) return this.op2("_subMixed", a, b);
		else throw new Error("invalid point size");
		else if (a.byteLength == this.F.n8 * 2) if (b.byteLength == this.F.n8 * 3) return this.neg(this.op2("_subMixed", b, a));
		else if (b.byteLength == this.F.n8 * 2) return this.op2("_subAffine", a, b);
		else throw new Error("invalid point size");
		else throw new Error("invalid point size");
	}
	neg(a) {
		if (a.byteLength == this.F.n8 * 3) return this.op1("_neg", a);
		else if (a.byteLength == this.F.n8 * 2) return this.op1Affine("_negAffine", a);
		else throw new Error("invalid point size");
	}
	double(a) {
		if (a.byteLength == this.F.n8 * 3) return this.op1("_double", a);
		else if (a.byteLength == this.F.n8 * 2) return this.op1("_doubleAffine", a);
		else throw new Error("invalid point size");
	}
	isZero(a) {
		if (a.byteLength == this.F.n8 * 3) return this.op1Bool("_isZero", a);
		else if (a.byteLength == this.F.n8 * 2) return this.op1Bool("_isZeroAffine", a);
		else throw new Error("invalid point size");
	}
	timesScalar(a, s) {
		if (!(s instanceof Uint8Array)) s = toLEBuff(e(s));
		let fnName;
		if (a.byteLength == this.F.n8 * 3) fnName = this.prefix + "_timesScalar";
		else if (a.byteLength == this.F.n8 * 2) fnName = this.prefix + "_timesScalarAffine";
		else throw new Error("invalid point size");
		this.tm.setBuff(this.pOp1, a);
		this.tm.setBuff(this.pOp2, s);
		this.tm.instance.exports[fnName](this.pOp1, this.pOp2, s.byteLength, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.F.n8 * 3);
	}
	timesFr(a, s) {
		let fnName;
		if (a.byteLength == this.F.n8 * 3) fnName = this.prefix + "_timesFr";
		else if (a.byteLength == this.F.n8 * 2) fnName = this.prefix + "_timesFrAffine";
		else throw new Error("invalid point size");
		this.tm.setBuff(this.pOp1, a);
		this.tm.setBuff(this.pOp2, s);
		this.tm.instance.exports[fnName](this.pOp1, this.pOp2, this.pOp3);
		return this.tm.getBuff(this.pOp3, this.F.n8 * 3);
	}
	eq(a, b) {
		if (a.byteLength == this.F.n8 * 3) if (b.byteLength == this.F.n8 * 3) return this.op2bool("_eq", a, b);
		else if (b.byteLength == this.F.n8 * 2) return this.op2bool("_eqMixed", a, b);
		else throw new Error("invalid point size");
		else if (a.byteLength == this.F.n8 * 2) if (b.byteLength == this.F.n8 * 3) return this.op2bool("_eqMixed", b, a);
		else if (b.byteLength == this.F.n8 * 2) return this.op2bool("_eqAffine", a, b);
		else throw new Error("invalid point size");
		else throw new Error("invalid point size");
	}
	toAffine(a) {
		if (a.byteLength == this.F.n8 * 3) return this.op1Affine("_toAffine", a);
		else if (a.byteLength == this.F.n8 * 2) return a;
		else throw new Error("invalid point size");
	}
	toJacobian(a) {
		if (a.byteLength == this.F.n8 * 3) return a;
		else if (a.byteLength == this.F.n8 * 2) return this.op1("_toJacobian", a);
		else throw new Error("invalid point size");
	}
	toRprUncompressed(arr, offset, a) {
		this.tm.setBuff(this.pOp1, a);
		if (a.byteLength == this.F.n8 * 3) this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
		else if (a.byteLength != this.F.n8 * 2) throw new Error("invalid point size");
		this.tm.instance.exports[this.prefix + "_LEMtoU"](this.pOp1, this.pOp1);
		const res = this.tm.getBuff(this.pOp1, this.F.n8 * 2);
		arr.set(res, offset);
	}
	fromRprUncompressed(arr, offset) {
		const buff = arr.slice(offset, offset + this.F.n8 * 2);
		this.tm.setBuff(this.pOp1, buff);
		this.tm.instance.exports[this.prefix + "_UtoLEM"](this.pOp1, this.pOp1);
		return this.tm.getBuff(this.pOp1, this.F.n8 * 2);
	}
	toRprCompressed(arr, offset, a) {
		this.tm.setBuff(this.pOp1, a);
		if (a.byteLength == this.F.n8 * 3) this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
		else if (a.byteLength != this.F.n8 * 2) throw new Error("invalid point size");
		this.tm.instance.exports[this.prefix + "_LEMtoC"](this.pOp1, this.pOp1);
		const res = this.tm.getBuff(this.pOp1, this.F.n8);
		arr.set(res, offset);
	}
	fromRprCompressed(arr, offset) {
		const buff = arr.slice(offset, offset + this.F.n8);
		this.tm.setBuff(this.pOp1, buff);
		this.tm.instance.exports[this.prefix + "_CtoLEM"](this.pOp1, this.pOp2);
		return this.tm.getBuff(this.pOp2, this.F.n8 * 2);
	}
	toUncompressed(a) {
		const buff = new Uint8Array(this.F.n8 * 2);
		this.toRprUncompressed(buff, 0, a);
		return buff;
	}
	toRprLEM(arr, offset, a) {
		if (a.byteLength == this.F.n8 * 2) {
			arr.set(a, offset);
			return;
		} else if (a.byteLength == this.F.n8 * 3) {
			this.tm.setBuff(this.pOp1, a);
			this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
			const res = this.tm.getBuff(this.pOp1, this.F.n8 * 2);
			arr.set(res, offset);
		} else throw new Error("invalid point size");
	}
	fromRprLEM(arr, offset) {
		offset = offset || 0;
		return arr.slice(offset, offset + this.F.n8 * 2);
	}
	toString(a, radix) {
		if (a.byteLength == this.F.n8 * 3) return `[ ${this.F.toString(a.slice(0, this.F.n8), radix)}, ${this.F.toString(a.slice(this.F.n8, this.F.n8 * 2), radix)}, ${this.F.toString(a.slice(this.F.n8 * 2), radix)} ]`;
		else if (a.byteLength == this.F.n8 * 2) return `[ ${this.F.toString(a.slice(0, this.F.n8), radix)}, ${this.F.toString(a.slice(this.F.n8), radix)} ]`;
		else throw new Error("invalid point size");
	}
	isValid(a) {
		if (this.isZero(a)) return true;
		const F = this.F;
		const aa = this.toAffine(a);
		const x = aa.slice(0, this.F.n8);
		const y = aa.slice(this.F.n8, this.F.n8 * 2);
		const x3b = F.add(F.mul(F.square(x), x), this.b);
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
		let Pbuff = new Uint8Array(this.F.n8 * 2);
		Pbuff.set(P[0]);
		Pbuff.set(P[1], this.F.n8);
		if (this.cofactor) Pbuff = this.timesScalar(Pbuff, this.cofactor);
		return Pbuff;
	}
	toObject(a) {
		if (this.isZero(a)) return [
			this.F.toObject(this.F.zero),
			this.F.toObject(this.F.one),
			this.F.toObject(this.F.zero)
		];
		const x = this.F.toObject(a.slice(0, this.F.n8));
		const y = this.F.toObject(a.slice(this.F.n8, this.F.n8 * 2));
		let z;
		if (a.byteLength == this.F.n8 * 3) z = this.F.toObject(a.slice(this.F.n8 * 2, this.F.n8 * 3));
		else z = this.F.toObject(this.F.one);
		return [
			x,
			y,
			z
		];
	}
	fromObject(a) {
		const x = this.F.fromObject(a[0]);
		const y = this.F.fromObject(a[1]);
		let z;
		if (a.length == 3) z = this.F.fromObject(a[2]);
		else z = this.F.one;
		if (this.F.isZero(z, this.F.one)) return this.zeroAffine;
		else if (this.F.eq(z, this.F.one)) {
			const buff = new Uint8Array(this.F.n8 * 2);
			buff.set(x);
			buff.set(y, this.F.n8);
			return buff;
		} else {
			const buff = new Uint8Array(this.F.n8 * 3);
			buff.set(x);
			buff.set(y, this.F.n8);
			buff.set(z, this.F.n8 * 2);
			return buff;
		}
	}
	e(a) {
		if (a instanceof Uint8Array) return a;
		return this.fromObject(a);
	}
	x(a) {
		return this.toAffine(a).slice(0, this.F.n8);
	}
	y(a) {
		return this.toAffine(a).slice(this.F.n8);
	}
};
//#endregion
//#region src/threadman_thread.js
function thread(self) {
	const MAXMEM = 32767;
	let instance;
	let memory;
	let batchFns = null;
	let terminationTimeout = 1500;
	let terminationTimer;
	/* c8 ignore start */
	if (self) self.onmessage = function(e) {
		let data;
		if (e.data) data = e.data;
		else data = e;
		try {
			if (data[0].cmd === "INIT") {
				init(data[0]).then(function() {
					self.postMessage({ status: "initialized" });
					scheduleTermination();
				}, function(err) {
					self.postMessage({ error: err.message });
				});
				return;
			} else if (data[0].cmd === "TERMINATE") terminate();
			else {
				let terminateAfterTask = false;
				if (data[data.length - 1].cmd === "TERMINATE") {
					terminateAfterTask = true;
					data.pop();
				}
				const res = runTask(data);
				let transfers = [];
				for (let i = 0; i < res.length; i++) if (res[i] instanceof Uint8Array) transfers.push(res[i].buffer);
				self.postMessage(res, transfers);
				if (terminateAfterTask) terminate();
			}
		} catch (err) {
			self.postMessage({ error: err.message });
		}
		scheduleTermination();
	};
	/* c8 ignore stop */
	async function init(data) {
		let wasmModule;
		if (data.code instanceof WebAssembly.Module)
 /* c8 ignore start */
		wasmModule = data.code;
		else {
			const code = new Uint8Array(data.code);
			wasmModule = await WebAssembly.compile(code);
		}
		memory = new WebAssembly.Memory({
			initial: data.init,
			maximum: MAXMEM
		});
		instance = await WebAssembly.instantiate(wasmModule, { env: { "memory": memory } });
		if (data.batchCode) {
			let batchModule;
			if (data.batchCode instanceof WebAssembly.Module)
 /* c8 ignore start */
			batchModule = data.batchCode;
			else batchModule = await WebAssembly.compile(new Uint8Array(data.batchCode));
			const ex = instance.exports;
			const mkBatch = async (f, g, conj) => (await WebAssembly.instantiate(batchModule, {
				env: { "memory": memory },
				curve: {
					f_mul: ex[f + "_mul"],
					f_square: ex[f + "_square"],
					f_add: ex[f + "_add"],
					f_sub: ex[f + "_sub"],
					f_neg: ex[f + "_neg"],
					f_inverse: ex[f + "_inverse"],
					f_isZero: ex[f + "_isZero"],
					f_conj: ex[conj],
					g_add: ex[g + "_add"],
					g_addMixed: ex[g + "_addMixed"],
					g_double: ex[g + "_double"],
					g_zero: ex[g + "_zero"],
					g_isZero: ex[g + "_isZero"]
				}
			})).exports;
			const n8f = data.n8f;
			batchFns = {};
			if (ex.f1m_mul && ex.g1m_addMixed) {
				const b = await mkBatch("f1m", "g1m", "f1m_copy");
				const fn = data.glv && b.multiexpAffineGLV ? b.multiexpAffineGLV : b.multiexpAffine;
				batchFns["g1m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => fn(pB, pS, sS, n, pr, n8f);
				batchFns["g1m_multiexpAffineBatchNoGlv"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f);
			}
			if (ex.f2m_mul && ex.g2m_addMixed) {
				const b = await mkBatch("f2m", "g2m", "f2m_conjugate");
				const fn2 = data.glv && b.multiexpAffineGLS ? b.multiexpAffineGLS : b.multiexpAffine;
				batchFns["g2m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => fn2(pB, pS, sS, n, pr, n8f * 2);
				batchFns["g2m_multiexpAffineBatchNoGls"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f * 2);
			}
		}
		if (data.terminationTimeout)
 /* c8 ignore start */
		terminationTimeout = data.terminationTimeout;
		/* c8 ignore stop */
	}
	function rev32(x) {
		x = (x & 1431655765) << 1 | x >>> 1 & 1431655765;
		x = (x & 858993459) << 2 | x >>> 2 & 858993459;
		x = (x & 252645135) << 4 | x >>> 4 & 252645135;
		x = (x & 16711935) << 8 | x >>> 8 & 16711935;
		x = x << 16 | x >>> 16;
		return x >>> 0;
	}
	function reverseInPlace(u8, sIn, bits) {
		const n = u8.byteLength / sIn;
		const shift = 32 - bits;
		if ((sIn & 3) === 0 && (u8.byteOffset & 3) === 0) {
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
			/* c8 ignore start */
			const tmp = new Uint8Array(sIn);
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
		/* c8 ignore stop */
	}
	function alloc(length) {
		const u32 = new Uint32Array(memory.buffer, 0, 1);
		while (u32[0] & 3) u32[0]++;
		const res = u32[0];
		u32[0] += length;
		if (u32[0] + length > memory.buffer.byteLength) {
			/* c8 ignore start */
			const currentPages = memory.buffer.byteLength / 65536;
			let requiredPages = Math.floor((u32[0] + length) / 65536) + 1;
			if (requiredPages > MAXMEM) requiredPages = MAXMEM;
			memory.grow(requiredPages - currentPages);
		}
		/* c8 ignore stop */
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
		new Uint8Array(memory.buffer).set(new Uint8Array(buffer), pointer);
	}
	function runTask(task) {
		clearTimeout(terminationTimer);
		if (task[0].cmd === "INIT") return init(task[0]);
		const ctx = {
			vars: [],
			out: []
		};
		const oldAlloc = new Uint32Array(memory.buffer, 0, 1)[0];
		for (let i = 0; i < task.length; i++) switch (task[i].cmd) {
			case "REVERSE": {
				const t = task[i];
				reverseInPlace(t.src, t.sIn, t.bits);
				ctx.out[0] = t.src;
				break;
			}
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
				for (let j = 0; j < task[i].params.length; j++) {
					const p = task[i].params[j];
					if (typeof p.var !== "undefined") params.push(ctx.vars[p.var] + (p.offset || 0));
					else if (typeof p.val != "undefined") params.push(p.val);
				}
				{
					const fname = task[i].fnName;
					let fn = batchFns ? batchFns[fname] : void 0;
					if (!fn) {
						fn = instance.exports[fname];
						if (!fn) {
							/* c8 ignore start */
							const base = fname.replace(/Batch(NoGls|NoGlv)?$/, "");
							fn = instance.exports[base];
						}
					}
					fn(...params);
				}
				break;
			}
			case "GET":
				ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
				break;
			default:
 /* c8 ignore start */
			throw new Error("Invalid cmd");
		}
		const u32b = new Uint32Array(memory.buffer, 0, 1);
		u32b[0] = oldAlloc;
		return ctx.out;
	}
	function scheduleTermination() {
		/* c8 ignore start */
		clearTimeout(terminationTimer);
		if (terminationTimeout > 0) terminationTimer = setTimeout(() => {
			if (self) self.postMessage({ status: "want_to_terminate" });
		}, terminationTimeout);
	}
	function terminate() {
		clearTimeout(terminationTimer);
		if (self) {
			self.postMessage({ status: "terminated" });
			self.close();
		}
	}
	/* c8 ignore stop */
	return runTask;
}
//#endregion
//#region src/threadman.js
var MEM_SIZE = 25;
var MAX_CONSECUTIVE_BOOT_FAILURES = 8;
var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
var Deferred = class {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
};
function unrefWorker(worker) {
	/* c8 ignore next */
	if (typeof worker.unref === "function") {
		worker.unref();
		return;
	}
	for (const sym of Object.getOwnPropertySymbols(worker)) {
		const native = worker[sym];
		if (native && typeof native.unref === "function") {
			native.unref();
			return;
		}
	}
}
var WorkerSlot = class {
	constructor(worker) {
		this.worker = worker;
		this.initialized = false;
		this.initializing = false;
		this.working = false;
		this.pendingDeferred = null;
		this.onMsg = null;
		this.onError = null;
	}
};
var workerSource;
function getWorkerSource() {
	if (workerSource !== void 0) return workerSource;
	const threadStr = `(function thread(self) {
	const MAXMEM = 32767;
	let instance;
	let memory;
	let batchFns = null;
	let terminationTimeout = 1500;
	let terminationTimer;
	/* c8 ignore start */
	if (self) self.onmessage = function(e) {
		let data;
		if (e.data) data = e.data;
		else data = e;
		try {
			if (data[0].cmd === "INIT") {
				init(data[0]).then(function() {
					self.postMessage({ status: "initialized" });
					scheduleTermination();
				}, function(err) {
					self.postMessage({ error: err.message });
				});
				return;
			} else if (data[0].cmd === "TERMINATE") terminate();
			else {
				let terminateAfterTask = false;
				if (data[data.length - 1].cmd === "TERMINATE") {
					terminateAfterTask = true;
					data.pop();
				}
				const res = runTask(data);
				let transfers = [];
				for (let i = 0; i < res.length; i++) if (res[i] instanceof Uint8Array) transfers.push(res[i].buffer);
				self.postMessage(res, transfers);
				if (terminateAfterTask) terminate();
			}
		} catch (err) {
			self.postMessage({ error: err.message });
		}
		scheduleTermination();
	};
	/* c8 ignore stop */
	async function init(data) {
		let wasmModule;
		if (data.code instanceof WebAssembly.Module)
 /* c8 ignore start */
		wasmModule = data.code;
		else {
			const code = new Uint8Array(data.code);
			wasmModule = await WebAssembly.compile(code);
		}
		memory = new WebAssembly.Memory({
			initial: data.init,
			maximum: MAXMEM
		});
		instance = await WebAssembly.instantiate(wasmModule, { env: { "memory": memory } });
		if (data.batchCode) {
			let batchModule;
			if (data.batchCode instanceof WebAssembly.Module)
 /* c8 ignore start */
			batchModule = data.batchCode;
			else batchModule = await WebAssembly.compile(new Uint8Array(data.batchCode));
			const ex = instance.exports;
			const mkBatch = async (f, g, conj) => (await WebAssembly.instantiate(batchModule, {
				env: { "memory": memory },
				curve: {
					f_mul: ex[f + "_mul"],
					f_square: ex[f + "_square"],
					f_add: ex[f + "_add"],
					f_sub: ex[f + "_sub"],
					f_neg: ex[f + "_neg"],
					f_inverse: ex[f + "_inverse"],
					f_isZero: ex[f + "_isZero"],
					f_conj: ex[conj],
					g_add: ex[g + "_add"],
					g_addMixed: ex[g + "_addMixed"],
					g_double: ex[g + "_double"],
					g_zero: ex[g + "_zero"],
					g_isZero: ex[g + "_isZero"]
				}
			})).exports;
			const n8f = data.n8f;
			batchFns = {};
			if (ex.f1m_mul && ex.g1m_addMixed) {
				const b = await mkBatch("f1m", "g1m", "f1m_copy");
				const fn = data.glv && b.multiexpAffineGLV ? b.multiexpAffineGLV : b.multiexpAffine;
				batchFns["g1m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => fn(pB, pS, sS, n, pr, n8f);
				batchFns["g1m_multiexpAffineBatchNoGlv"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f);
			}
			if (ex.f2m_mul && ex.g2m_addMixed) {
				const b = await mkBatch("f2m", "g2m", "f2m_conjugate");
				const fn2 = data.glv && b.multiexpAffineGLS ? b.multiexpAffineGLS : b.multiexpAffine;
				batchFns["g2m_multiexpAffineBatch"] = (pB, pS, sS, n, pr) => fn2(pB, pS, sS, n, pr, n8f * 2);
				batchFns["g2m_multiexpAffineBatchNoGls"] = (pB, pS, sS, n, pr) => b.multiexpAffine(pB, pS, sS, n, pr, n8f * 2);
			}
		}
		if (data.terminationTimeout)
 /* c8 ignore start */
		terminationTimeout = data.terminationTimeout;
		/* c8 ignore stop */
	}
	function rev32(x) {
		x = (x & 1431655765) << 1 | x >>> 1 & 1431655765;
		x = (x & 858993459) << 2 | x >>> 2 & 858993459;
		x = (x & 252645135) << 4 | x >>> 4 & 252645135;
		x = (x & 16711935) << 8 | x >>> 8 & 16711935;
		x = x << 16 | x >>> 16;
		return x >>> 0;
	}
	function reverseInPlace(u8, sIn, bits) {
		const n = u8.byteLength / sIn;
		const shift = 32 - bits;
		if ((sIn & 3) === 0 && (u8.byteOffset & 3) === 0) {
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
			/* c8 ignore start */
			const tmp = new Uint8Array(sIn);
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
		/* c8 ignore stop */
	}
	function alloc(length) {
		const u32 = new Uint32Array(memory.buffer, 0, 1);
		while (u32[0] & 3) u32[0]++;
		const res = u32[0];
		u32[0] += length;
		if (u32[0] + length > memory.buffer.byteLength) {
			/* c8 ignore start */
			const currentPages = memory.buffer.byteLength / 65536;
			let requiredPages = Math.floor((u32[0] + length) / 65536) + 1;
			if (requiredPages > MAXMEM) requiredPages = MAXMEM;
			memory.grow(requiredPages - currentPages);
		}
		/* c8 ignore stop */
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
		new Uint8Array(memory.buffer).set(new Uint8Array(buffer), pointer);
	}
	function runTask(task) {
		clearTimeout(terminationTimer);
		if (task[0].cmd === "INIT") return init(task[0]);
		const ctx = {
			vars: [],
			out: []
		};
		const oldAlloc = new Uint32Array(memory.buffer, 0, 1)[0];
		for (let i = 0; i < task.length; i++) switch (task[i].cmd) {
			case "REVERSE": {
				const t = task[i];
				reverseInPlace(t.src, t.sIn, t.bits);
				ctx.out[0] = t.src;
				break;
			}
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
				for (let j = 0; j < task[i].params.length; j++) {
					const p = task[i].params[j];
					if (typeof p.var !== "undefined") params.push(ctx.vars[p.var] + (p.offset || 0));
					else if (typeof p.val != "undefined") params.push(p.val);
				}
				{
					const fname = task[i].fnName;
					let fn = batchFns ? batchFns[fname] : void 0;
					if (!fn) {
						fn = instance.exports[fname];
						if (!fn) {
							/* c8 ignore start */
							const base = fname.replace(/Batch(NoGls|NoGlv)?\$/, "");
							fn = instance.exports[base];
						}
					}
					fn(...params);
				}
				break;
			}
			case "GET":
				ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
				break;
			default:
 /* c8 ignore start */
			throw new Error("Invalid cmd");
		}
		const u32b = new Uint32Array(memory.buffer, 0, 1);
		u32b[0] = oldAlloc;
		return ctx.out;
	}
	function scheduleTermination() {
		/* c8 ignore start */
		clearTimeout(terminationTimer);
		if (terminationTimeout > 0) terminationTimer = setTimeout(() => {
			if (self) self.postMessage({ status: "want_to_terminate" });
		}, terminationTimeout);
	}
	function terminate() {
		clearTimeout(terminationTimer);
		if (self) {
			self.postMessage({ status: "terminated" });
			self.close();
		}
	}
	/* c8 ignore stop */
	return runTask;
})(self)`;
	if (isNode) workerSource = "data:application/javascript;base64," + Buffer.from(threadStr).toString("base64");
	else if (globalThis?.Blob && globalThis.URL && globalThis.URL.createObjectURL) {
		/* c8 ignore start */
		const threadBytes = new TextEncoder().encode(threadStr);
		const workerBlob = new Blob([threadBytes], { type: "application/javascript" });
		workerSource = URL.createObjectURL(workerBlob);
	} else workerSource = "data:application/javascript;base64," + globalThis.btoa(threadStr);
	/* c8 ignore stop */
	return workerSource;
}
async function buildThreadManager(wasm, singleThread) {
	const tm = new ThreadManager();
	tm.memory = new WebAssembly.Memory({ initial: MEM_SIZE });
	tm.u8 = new Uint8Array(tm.memory.buffer);
	tm.u32 = new Uint32Array(tm.memory.buffer);
	const wasmModule = await WebAssembly.compile(wasm.code);
	tm.instance = await WebAssembly.instantiate(wasmModule, { env: { "memory": tm.memory } });
	if (!isNode && !globalThis?.Worker)
 /* c8 ignore start */
	singleThread = true;
	/* c8 ignore stop */
	tm.singleThread = singleThread;
	tm.initalPFree = tm.u32[0];
	tm.pq = wasm.pq;
	tm.pr = wasm.pr;
	tm.pG1gen = wasm.pG1gen;
	tm.pG1zero = wasm.pG1zero;
	tm.pG2gen = wasm.pG2gen;
	tm.pG2zero = wasm.pG2zero;
	tm.pOneT = wasm.pOneT;
	tm.code = wasm.code;
	tm.wasmModule = wasmModule;
	tm.batchCode = wasm.batchCode;
	tm.batchWasmModule = wasm.batchCode ? await WebAssembly.compile(wasm.batchCode) : void 0;
	tm.n8f = wasm.n8q;
	tm.glv = !!wasm.glv;
	if (singleThread) {
		tm.taskManager = thread();
		await tm.taskManager([{
			cmd: "INIT",
			init: MEM_SIZE,
			code: tm.code.slice(),
			batchCode: tm.batchCode ? tm.batchCode.slice() : void 0,
			n8f: tm.n8f,
			glv: tm.glv
		}]);
		tm.concurrency = 1;
	} else {
		tm.pool = [];
		let concurrency = 2;
		if (typeof navigator === "object" && navigator.hardwareConcurrency) concurrency = navigator.hardwareConcurrency;
		else if (import___vite_browser_external.default && import___vite_browser_external.default.cpus)
 /* c8 ignore start */
		concurrency = import___vite_browser_external.default.cpus().length;
		if (concurrency === 0) concurrency = 2;
		/* c8 ignore stop */
		if (concurrency > 64) concurrency = 64;
		tm.concurrency = concurrency;
	}
	return tm;
}
var ThreadManager = class {
	constructor() {
		this.actionQueue = [];
		this.oldPFree = 0;
		this.bootFailures = 0;
		this.bootBroken = null;
	}
	_failQueueIfUnservable(err) {
		const anyAlive = this.pool.some((s) => s);
		const anyInitialized = this.pool.some((s) => s && s.initialized);
		if (!anyAlive || this.bootBroken && !anyInitialized) {
			const cause = this.bootBroken || err;
			const queued = this.actionQueue.splice(0, this.actionQueue.length);
			for (const work of queued) work.deferred.reject(/* @__PURE__ */ new Error("Worker initialization failed: " + cause.message));
		}
	}
	_makeOnMsg(slotIndex, slot) {
		const tm = this;
		return async function(e) {
			const data = e && e.data ? e.data : e;
			if (tm.pool[slotIndex] !== slot) {
				/* c8 ignore start */
				if (data.status === "terminated") {
					slot.worker.removeEventListener("message", slot.onMsg);
					slot.worker.removeEventListener("error", slot.onError);
					return;
				}
				if (!data.status && slot.working) {
					slot.working = false;
					if (data.error) slot.pendingDeferred.reject(/* @__PURE__ */ new Error("Worker error: " + data.error));
					else slot.pendingDeferred.resolve(data);
				}
				await tm.processWorks();
				return;
			}
			/* c8 ignore stop */
			if (data.error) {
				slot.working = false;
				slot.pendingDeferred.reject(/* @__PURE__ */ new Error("Worker error: " + data.error));
				if (slot.initializing) {
					slot.initializing = false;
					tm.pool[slotIndex] = null;
					return;
				}
				await tm.processWorks();
				return;
			}
			if (data.status) {
				if (data.status === "initialized") {
					slot.initializing = false;
					slot.initialized = true;
				} else if (data.status === "want_to_terminate") {
					/* c8 ignore start */
					tm.pool[slotIndex] = null;
					slot.worker.postMessage([{ cmd: "TERMINATE" }]);
					try {
						if (typeof slot.worker.terminate === "function") slot.worker.terminate();
					} catch (e) {}
					unrefWorker(slot.worker);
					await tm.processWorks();
					return;
				} else if (data.status === "terminated") {
					slot.worker.removeEventListener("message", slot.onMsg);
					slot.worker.removeEventListener("error", slot.onError);
					tm.pool[slotIndex] = null;
					if (slot.working) {
						/* c8 ignore start */
						slot.pendingDeferred.reject(/* @__PURE__ */ new Error(`Worker at slot ${slotIndex} terminated unexpectedly while processing task`));
						slot.working = false;
					}
					/* c8 ignore stop */
					return;
				}
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
				slot.working = false;
				slot.initialized = false;
				slot.initializing = false;
				tm.pool[slotIndex] = null;
				slot.worker.removeEventListener("message", slot.onMsg);
				slot.worker.removeEventListener("error", slot.onError);
				if (slot.pendingDeferred) slot.pendingDeferred.reject(/* @__PURE__ */ new Error("Worker error: " + e.message));
				tm.processWorks().catch(() => {});
			}
		};
	}
	startWorker(slotIndex) {
		const nativeWorker = new Worker(getWorkerSource());
		const slot = new WorkerSlot(nativeWorker);
		this.pool[slotIndex] = slot;
		slot.onMsg = this._makeOnMsg(slotIndex, slot);
		slot.onError = this._makeOnError(slotIndex, slot);
		nativeWorker.addEventListener("message", slot.onMsg);
		nativeWorker.addEventListener("error", slot.onError);
		slot.initializing = true;
		const tm = this;
		this.postAction(slotIndex, [{
			cmd: "INIT",
			init: MEM_SIZE,
			code: this.wasmModule,
			batchCode: this.batchWasmModule,
			n8f: this.n8f,
			glv: this.glv
		}]).then(() => {
			slot.initialized = true;
			tm.bootFailures = 0;
		}, (err) => {
			if (tm.pool[slotIndex] === slot) {
				/* c8 ignore start */
				tm.pool[slotIndex] = null;
				slot.worker.removeEventListener("message", slot.onMsg);
				slot.worker.removeEventListener("error", slot.onError);
			}
			/* c8 ignore stop */
			slot.initializing = false;
			slot.working = false;
			tm.bootFailures++;
			if (tm.bootFailures >= MAX_CONSECUTIVE_BOOT_FAILURES && !tm.bootBroken) tm.bootBroken = err;
			tm._failQueueIfUnservable(err);
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
			/* c8 ignore start */
			const err = /* @__PURE__ */ new Error("Posting a job to a working worker");
			if (_deferred) _deferred.reject(err);
			throw err;
		}
		/* c8 ignore stop */
		slot.working = true;
		slot.pendingDeferred = _deferred ? _deferred : new Deferred();
		if (transfers) {
			for (const t of transfers) if (t instanceof ArrayBuffer && t.byteLength === 0) {
				let detached = false;
				try {
					new Uint8Array(t, 0, 0);
				} catch (err) {
					detached = true;
				}
				if (detached) {
					slot.working = false;
					slot.pendingDeferred.reject(/* @__PURE__ */ new Error("Task transfer list contains a detached ArrayBuffer"));
					return slot.pendingDeferred.promise;
				}
			}
		}
		try {
			await slot.worker.postMessage(e, transfers);
		} catch (err) {
			slot.working = false;
			slot.pendingDeferred.reject(err);
		}
		return slot.pendingDeferred.promise;
	}
	async processWorks() {
		for (let i = 0; i < this.concurrency && this.actionQueue.length > 0; i++) {
			const slot = this.pool[i];
			if (slot && slot.initialized && !slot.working) {
				const work = this.actionQueue.shift();
				await this.postAction(i, work.data, work.transfers, work.deferred).catch(() => {});
			}
		}
		if (this.actionQueue.length > 0) {
			if (this.bootBroken) {
				/* c8 ignore start */
				this._failQueueIfUnservable(this.bootBroken);
				return;
			}
			/* c8 ignore stop */
			let initializingCount = 0;
			for (let i = 0; i < this.concurrency; i++) {
				const slot = this.pool[i];
				if (slot) {
					if (slot.initializing) initializingCount++;
					continue;
				}
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
			const work = {
				data: actionData,
				transfers,
				deferred: d
			};
			this.actionQueue.push(work);
			try {
				await this.processWorks();
			} catch (err) {
				/* c8 ignore start */
				const idx = this.actionQueue.indexOf(work);
				if (idx >= 0) this.actionQueue.splice(idx, 1);
				d.reject(err);
			}
		}
		return d.promise;
	}
	resetMemory() {
		/* c8 ignore start */
		this.u32[0] = this.initalPFree;
	}
	/* c8 ignore stop */
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
		while (this.u32[0] & 3) this.u32[0]++;
		const res = this.u32[0];
		this.u32[0] += length;
		return res;
	}
	async terminate() {
		for (let i = 0; i < this.pool.length; i++) {
			const slot = this.pool[i];
			if (!slot) continue;
			slot.worker.postMessage([{ cmd: "TERMINATE" }]);
			/* c8 ignore next */
			try {
				if (typeof slot.worker.terminate === "function") slot.worker.terminate();
			} catch (e) {}
			unrefWorker(slot.worker);
			this.pool[i] = null;
		}
	}
};
//#endregion
//#region src/engine_applykey.js
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
				sGin = G.F.n8 * 3;
				fnName = "g1m_batchApplyKey";
			} else {
				sGin = G.F.n8 * 2;
				fnName = "g1m_batchApplyKeyMixed";
			}
			sGmid = G.F.n8 * 3;
			if (outType == "jacobian") sGout = G.F.n8 * 3;
			else {
				fnAffine = "g1m_batchToAffine";
				sGout = G.F.n8 * 2;
			}
		} else if (groupName == "G2") {
			if (inType == "jacobian") {
				sGin = G.F.n8 * 3;
				fnName = "g2m_batchApplyKey";
			} else {
				sGin = G.F.n8 * 2;
				fnName = "g2m_batchApplyKeyMixed";
			}
			sGmid = G.F.n8 * 3;
			if (outType == "jacobian") sGout = G.F.n8 * 3;
			else {
				fnAffine = "g2m_batchToAffine";
				sGout = G.F.n8 * 2;
			}
		} else if (groupName == "Fr") {
			fnName = "frm_batchApplyKey";
			sGin = G.n8;
			sGmid = G.n8;
			sGout = G.n8;
		} else
 /* c8 ignore start */
		throw new Error("Invalid group: " + groupName);
		/* c8 ignore stop */
		const nPoints = Math.floor(buff.byteLength / sGin);
		const pointsPerChunk = Math.floor(nPoints / tm.concurrency);
		const opPromises = [];
		inc = Fr.e(inc);
		let t = Fr.e(first);
		for (let i = 0; i < tm.concurrency; i++) {
			let n;
			if (i < tm.concurrency - 1) n = pointsPerChunk;
			else n = nPoints - i * pointsPerChunk;
			if (n == 0) continue;
			const task = [];
			const b = buff.slice(i * pointsPerChunk * sGin, i * pointsPerChunk * sGin + n * sGin);
			task.push({
				cmd: "ALLOCSET",
				var: 0,
				buff: b
			});
			task.push({
				cmd: "ALLOCSET",
				var: 1,
				buff: t
			});
			task.push({
				cmd: "ALLOCSET",
				var: 2,
				buff: inc
			});
			task.push({
				cmd: "ALLOC",
				var: 3,
				len: n * Math.max(sGmid, sGout)
			});
			task.push({
				cmd: "CALL",
				fnName,
				params: [
					{ var: 0 },
					{ val: n },
					{ var: 1 },
					{ var: 2 },
					{ var: 3 }
				]
			});
			if (fnAffine) task.push({
				cmd: "CALL",
				fnName: fnAffine,
				params: [
					{ var: 3 },
					{ val: n },
					{ var: 3 }
				]
			});
			task.push({
				cmd: "GET",
				out: 0,
				var: 3,
				len: n * sGout
			});
			opPromises.push(tm.queueAction(task, [b.buffer]));
			t = Fr.mul(t, Fr.exp(inc, n));
		}
		const result = await Promise.all(opPromises);
		let outBuff;
		if (buff instanceof BigBuffer)
 /* c8 ignore start */
		outBuff = new BigBuffer(nPoints * sGout);
		else outBuff = new Uint8Array(nPoints * sGout);
		let p = 0;
		for (let i = 0; i < result.length; i++) {
			outBuff.set(result[i][0], p);
			p += result[i][0].byteLength;
		}
		return outBuff;
	};
}
//#endregion
//#region src/engine_pairing.js
function buildPairing(curve) {
	const tm = curve.tm;
	curve.pairing = function pairing(a, b) {
		tm.startSyncOp();
		try {
			const pA = tm.allocBuff(curve.G1.toJacobian(a));
			const pB = tm.allocBuff(curve.G2.toJacobian(b));
			const pRes = tm.alloc(curve.Gt.n8);
			tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);
			return tm.getBuff(pRes, curve.Gt.n8);
		} finally {
			tm.endSyncOp();
		}
	};
	curve.pairingEq = async function pairingEq() {
		let buffCt;
		let nEqs;
		if (arguments.length % 2 == 1) {
			buffCt = arguments[arguments.length - 1];
			nEqs = (arguments.length - 1) / 2;
		} else {
			buffCt = curve.Gt.one;
			nEqs = arguments.length / 2;
		}
		const opPromises = [];
		for (let i = 0; i < nEqs; i++) {
			const task = [];
			const g1Buff = curve.G1.toJacobian(arguments[i * 2]);
			task.push({
				cmd: "ALLOCSET",
				var: 0,
				buff: g1Buff
			});
			task.push({
				cmd: "ALLOC",
				var: 1,
				len: curve.prePSize
			});
			const g2Buff = curve.G2.toJacobian(arguments[i * 2 + 1]);
			task.push({
				cmd: "ALLOCSET",
				var: 2,
				buff: g2Buff
			});
			task.push({
				cmd: "ALLOC",
				var: 3,
				len: curve.preQSize
			});
			task.push({
				cmd: "ALLOC",
				var: 4,
				len: curve.Gt.n8
			});
			task.push({
				cmd: "CALL",
				fnName: curve.name + "_prepareG1",
				params: [{ var: 0 }, { var: 1 }]
			});
			task.push({
				cmd: "CALL",
				fnName: curve.name + "_prepareG2",
				params: [{ var: 2 }, { var: 3 }]
			});
			task.push({
				cmd: "CALL",
				fnName: curve.name + "_millerLoop",
				params: [
					{ var: 1 },
					{ var: 3 },
					{ var: 4 }
				]
			});
			task.push({
				cmd: "GET",
				out: 0,
				var: 4,
				len: curve.Gt.n8
			});
			opPromises.push(tm.queueAction(task));
		}
		const result = await Promise.all(opPromises);
		tm.startSyncOp();
		try {
			const pRes = tm.alloc(curve.Gt.n8);
			tm.instance.exports.ftm_one(pRes);
			for (let i = 0; i < result.length; i++) {
				const pMR = tm.allocBuff(result[i][0]);
				tm.instance.exports.ftm_mul(pRes, pMR, pRes);
			}
			tm.instance.exports[curve.name + "_finalExponentiation"](pRes, pRes);
			const pCt = tm.allocBuff(buffCt);
			return !!tm.instance.exports.ftm_eq(pRes, pCt);
		} finally {
			tm.endSyncOp();
		}
	};
	curve.prepareG1 = function(p) {
		this.tm.startSyncOp();
		try {
			const pP = this.tm.allocBuff(p);
			const pPrepP = this.tm.alloc(this.prePSize);
			this.tm.instance.exports[this.name + "_prepareG1"](pP, pPrepP);
			return this.tm.getBuff(pPrepP, this.prePSize);
		} finally {
			this.tm.endSyncOp();
		}
	};
	curve.prepareG2 = function(q) {
		this.tm.startSyncOp();
		try {
			const pQ = this.tm.allocBuff(q);
			const pPrepQ = this.tm.alloc(this.preQSize);
			this.tm.instance.exports[this.name + "_prepareG2"](pQ, pPrepQ);
			return this.tm.getBuff(pPrepQ, this.preQSize);
		} finally {
			this.tm.endSyncOp();
		}
	};
	curve.millerLoop = function(preP, preQ) {
		this.tm.startSyncOp();
		try {
			const pPreP = this.tm.allocBuff(preP);
			const pPreQ = this.tm.allocBuff(preQ);
			const pRes = this.tm.alloc(this.Gt.n8);
			this.tm.instance.exports[this.name + "_millerLoop"](pPreP, pPreQ, pRes);
			return this.tm.getBuff(pRes, this.Gt.n8);
		} finally {
			this.tm.endSyncOp();
		}
	};
	curve.finalExponentiation = function(a) {
		this.tm.startSyncOp();
		try {
			const pA = this.tm.allocBuff(a);
			const pRes = this.tm.alloc(this.Gt.n8);
			this.tm.instance.exports[this.name + "_finalExponentiation"](pA, pRes);
			return this.tm.getBuff(pRes, this.Gt.n8);
		} finally {
			this.tm.endSyncOp();
		}
	};
}
//#endregion
//#region src/engine_multiexp.js
var pTSizes = [
	1,
	1,
	1,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	13,
	14,
	15,
	16,
	16,
	17,
	17,
	17,
	17,
	17,
	17,
	17,
	17,
	17,
	17
];
function buildMultiexp(curve, groupName) {
	const G = curve[groupName];
	const tm = G.tm;
	const MAX_CHUNK_SIZE = 1 << 22;
	const MIN_CHUNK_SIZE = 4096;
	function pointSize(inType) {
		return inType === "affine" ? G.F.n8 * 2 : G.F.n8 * 3;
	}
	const AUTO_BATCH_MAX_BASES_BYTES = 1 << 21;
	function batchModeOf(options) {
		const m = options ? options.batch : void 0;
		if (m === true || m === "enabled") return "enabled";
		if (m === false || m === "disabled") return "disabled";
		return "auto";
	}
	function endoOf(options) {
		const v = options ? groupName === "G1" ? options.glv : options.gls : void 0;
		if (v === false || v === "disabled") return "disabled";
		return "auto";
	}
	function trivialFraction(buffScalars, nPoints, sScalar) {
		const nSamples = Math.min(64, nPoints);
		const step = Math.floor(nPoints / nSamples) || 1;
		let trivial = 0;
		for (let s = 0; s < nSamples; s++) {
			const o = s * step * sScalar;
			let top = 0;
			for (let k = sScalar - 1; k >= 1; k--) if (buffScalars[o + k] !== 0) {
				top = k;
				break;
			}
			if (top === 0 && buffScalars[o] <= 1) trivial++;
		}
		return trivial / nSamples;
	}
	function fnNameFor(inType, basesBytes, batchMode, endoMode, scalarsChunk, nPoints, sScalar) {
		const g = groupName === "G1" ? "g1m" : "g2m";
		if (inType !== "affine") return `${g}_multiexp`;
		let useBatch = batchMode === "enabled" || batchMode === "auto" && basesBytes <= AUTO_BATCH_MAX_BASES_BYTES;
		if (!useBatch && batchMode === "auto" && scalarsChunk) useBatch = trivialFraction(scalarsChunk, nPoints, sScalar) >= .5;
		if (!useBatch) return `${g}_multiexpAffine`;
		return `${g}_multiexpAffineBatch${endoMode === "disabled" ? groupName === "G1" ? "NoGlv" : "NoGls" : ""}`;
	}
	function chunkSizeFor(nPoints, sScalar) {
		const bitChunkSize = pTSizes[log2(nPoints)];
		let nChunks = Math.floor((sScalar * 8 - 1) / bitChunkSize) + 1;
		if (groupName === "G2") nChunks *= 2;
		nChunks = (Math.floor((nChunks - 1) / tm.concurrency) + 1) * tm.concurrency;
		let chunkSize = Math.floor(nPoints / nChunks) + 1;
		if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
		if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
		return chunkSize;
	}
	async function _multiExpChunk(buffBases, buffScalars, inType, batchMode, endoMode, logText) {
		if (!(buffBases instanceof Uint8Array)) throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
		if (!(buffScalars instanceof Uint8Array)) throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
		const sGIn = pointSize(inType);
		const nPoints = Math.floor(buffBases.byteLength / sGIn);
		if (nPoints === 0) return G.zero;
		const sScalar = Math.floor(buffScalars.byteLength / nPoints);
		if (sScalar * nPoints !== buffScalars.byteLength) throw new Error(`${logText} Scalar size does not match`);
		const task = [
			{
				cmd: "ALLOCSET",
				var: 0,
				buff: buffBases
			},
			{
				cmd: "ALLOCSET",
				var: 1,
				buff: buffScalars
			},
			{
				cmd: "ALLOC",
				var: 2,
				len: G.F.n8 * 3
			},
			{
				cmd: "CALL",
				fnName: fnNameFor(inType, buffBases.byteLength, batchMode, endoMode, buffScalars, nPoints, sScalar),
				params: [
					{ var: 0 },
					{ var: 1 },
					{ val: sScalar },
					{ val: nPoints },
					{ var: 2 }
				]
			},
			{
				cmd: "GET",
				out: 0,
				var: 2,
				len: G.F.n8 * 3
			}
		];
		return (await tm.queueAction(task, [buffBases.buffer, buffScalars.buffer]))[0];
	}
	async function _multiExpDispatch(getChunk, buffScalars, nPoints, sGIn, sScalar, inType, maxInFlight, batchMode, endoMode, logger, logText) {
		if (nPoints === 0) return G.zero;
		const chunkSize = chunkSizeFor(nPoints, sScalar);
		const inFlight = /* @__PURE__ */ new Set();
		const partials = [];
		try {
			for (let off = 0; off < nPoints; off += chunkSize) {
				const n = Math.min(nPoints - off, chunkSize);
				const at = off;
				while (inFlight.size >= maxInFlight) await Promise.race(inFlight);
				if (logger) logger.debug(`Multiexp start: ${logText}: ${at}/${nPoints}`);
				const slot = (async () => {
					const r = await _multiExpChunk(await getChunk(at * sGIn, n * sGIn), buffScalars.slice(at * sScalar, (at + n) * sScalar), inType, batchMode, endoMode, logText);
					if (logger) logger.debug(`Multiexp end: ${logText}: ${at}/${nPoints}`);
					return r;
				})().finally(() => inFlight.delete(slot));
				inFlight.add(slot);
				partials.push(slot);
			}
			const result = await Promise.all(partials);
			let res = G.zero;
			for (let i = result.length - 1; i >= 0; i--) res = G.add(res, result[i]);
			return res;
		} catch (err) {
			await Promise.allSettled(partials);
			throw err;
		}
	}
	function geometry(totalBasesBytes, buffScalars, inType) {
		const sGIn = pointSize(inType);
		const nPoints = Math.floor(totalBasesBytes / sGIn);
		let sScalar = 0;
		if (nPoints > 0) {
			sScalar = Math.floor(buffScalars.byteLength / nPoints);
			if (sScalar * nPoints !== buffScalars.byteLength) throw new Error("Scalar size does not match");
		}
		return {
			sGIn,
			nPoints,
			sScalar
		};
	}
	async function _multiExp(buffBases, buffScalars, inType, batchMode, endoMode, logger, logText) {
		const { sGIn, nPoints, sScalar } = geometry(buffBases.byteLength, buffScalars, inType);
		const getChunk = (off, len) => buffBases.slice(off, off + len);
		return _multiExpDispatch(getChunk, buffScalars, nPoints, sGIn, sScalar, inType, Infinity, batchMode, endoMode, logger, logText);
	}
	G.multiExp = async function multiExp(buffBases, buffScalars, logger, logText) {
		return _multiExp(buffBases, buffScalars, "jacobian", "disabled", "auto", logger, logText);
	};
	G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText, options) {
		return _multiExp(buffBases, buffScalars, "affine", batchModeOf(options), endoOf(options), logger, logText);
	};
	G.multiExpAffineChunked = async function multiExpAffineChunked(basesReader, totalBasesBytes, buffScalars, logger, logText, options) {
		if (typeof basesReader !== "function") throw new Error(`${logText || "multiExpAffineChunked"}: basesReader must be a function (byteOffset, byteLength) => Promise<Uint8Array>`);
		const { sGIn, nPoints, sScalar } = geometry(totalBasesBytes, buffScalars, "affine");
		return _multiExpDispatch(basesReader, buffScalars, nPoints, sGIn, sScalar, "affine", tm.concurrency + 2, batchModeOf(options), endoOf(options), logger, logText);
	};
}
//#endregion
//#region src/engine_fft.js
function buildFFT(curve, groupName) {
	const G = curve[groupName];
	const Fr = curve.Fr;
	const tm = G.tm;
	async function _reversePermutation(buff, sIn, bits) {
		return (await tm.queueAction([{
			cmd: "REVERSE",
			src: buff,
			sIn,
			bits
		}], [buff.buffer]))[0];
	}
	async function _fft(buff, inverse, inType, outType, logger, loggerTxt, consume) {
		inType = inType || "affine";
		outType = outType || "affine";
		const MAX_BITS_THREAD = 14;
		let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnFFTMix, fnFFTJoin, fnFFTFinal;
		if (groupName == "G1") {
			if (inType == "affine") {
				sIn = G.F.n8 * 2;
				fnIn2Mid = "g1m_batchToJacobian";
			} else sIn = G.F.n8 * 3;
			sMid = G.F.n8 * 3;
			if (inverse) fnFFTFinal = "g1m_fftFinal";
			fnFFTJoin = "g1m_fftJoin";
			fnFFTMix = "g1m_fftMix";
			if (outType == "affine") {
				sOut = G.F.n8 * 2;
				fnMid2Out = "g1m_batchToAffine";
			} else sOut = G.F.n8 * 3;
		} else if (groupName == "G2") {
			if (inType == "affine") {
				sIn = G.F.n8 * 2;
				fnIn2Mid = "g2m_batchToJacobian";
			} else sIn = G.F.n8 * 3;
			sMid = G.F.n8 * 3;
			if (inverse) fnFFTFinal = "g2m_fftFinal";
			fnFFTJoin = "g2m_fftJoin";
			fnFFTMix = "g2m_fftMix";
			if (outType == "affine") {
				sOut = G.F.n8 * 2;
				fnMid2Out = "g2m_batchToAffine";
			} else sOut = G.F.n8 * 3;
		} else if (groupName == "Fr") {
			sIn = G.n8;
			sMid = G.n8;
			sOut = G.n8;
			if (inverse) fnFFTFinal = "frm_fftFinal";
			fnFFTMix = "frm_fftMix";
			fnFFTJoin = "frm_fftJoin";
		}
		let returnArray = false;
		if (Array.isArray(buff)) {
			buff = array2buffer(buff, sIn);
			returnArray = true;
		} else if (!consume || !ArrayBuffer.isView(buff)) buff = buff.slice(0, buff.byteLength);
		const nPoints = buff.byteLength / sIn;
		const bits = log2(nPoints);
		if (1 << bits != nPoints) throw new Error("fft must be multiple of 2");
		/* c8 ignore start */
		if (bits == Fr.s + 1) {
			let buffOut;
			if (inverse) buffOut = await _fftExtInv(buff, inType, outType, logger, loggerTxt);
			else buffOut = await _fftExt(buff, inType, outType, logger, loggerTxt);
			if (returnArray) return buffer2array(buffOut, sOut);
			else return buffOut;
		}
		/* c8 ignore stop */
		let inv;
		if (inverse) inv = Fr.inv(Fr.e(nPoints));
		let buffOut;
		buff = await _reversePermutation(buff, sIn, bits);
		let chunks;
		let pointsInChunk = Math.min(1 << MAX_BITS_THREAD, nPoints);
		let nChunks = nPoints / pointsInChunk;
		while (nChunks < tm.concurrency && pointsInChunk >= 16) {
			nChunks *= 2;
			pointsInChunk /= 2;
		}
		const l2Chunk = log2(pointsInChunk);
		const promises = [];
		if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix start: ${nChunks}`);
		for (let i = 0; i < nChunks; i++) {
			const task = [];
			task.push({
				cmd: "ALLOC",
				var: 0,
				len: sMid * pointsInChunk
			});
			const buffChunk = buff.slice(pointsInChunk * i * sIn, pointsInChunk * (i + 1) * sIn);
			task.push({
				cmd: "SET",
				var: 0,
				buff: buffChunk
			});
			if (fnIn2Mid) task.push({
				cmd: "CALL",
				fnName: fnIn2Mid,
				params: [
					{ var: 0 },
					{ val: pointsInChunk },
					{ var: 0 }
				]
			});
			for (let j = 1; j <= l2Chunk; j++) task.push({
				cmd: "CALL",
				fnName: fnFFTMix,
				params: [
					{ var: 0 },
					{ val: pointsInChunk },
					{ val: j }
				]
			});
			if (l2Chunk == bits) {
				if (fnFFTFinal) {
					task.push({
						cmd: "ALLOCSET",
						var: 1,
						buff: inv
					});
					task.push({
						cmd: "CALL",
						fnName: fnFFTFinal,
						params: [
							{ var: 0 },
							{ val: pointsInChunk },
							{ var: 1 }
						]
					});
				}
				if (fnMid2Out) task.push({
					cmd: "CALL",
					fnName: fnMid2Out,
					params: [
						{ var: 0 },
						{ val: pointsInChunk },
						{ var: 0 }
					]
				});
				task.push({
					cmd: "GET",
					out: 0,
					var: 0,
					len: pointsInChunk * sOut
				});
			} else task.push({
				cmd: "GET",
				out: 0,
				var: 0,
				len: sMid * pointsInChunk
			});
			promises.push(tm.queueAction(task, [buffChunk.buffer]));
		}
		chunks = await Promise.all(promises);
		if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix end: ${nChunks}`);
		for (let i = 0; i < nChunks; i++) chunks[i] = chunks[i][0];
		for (let i = l2Chunk + 1; i <= bits; i++) {
			if (logger) logger.debug(`${loggerTxt}: fft ${bits} join: ${i}/${bits}`);
			const nGroups = 1 << bits - i;
			const nChunksPerGroup = nChunks / nGroups;
			const opPromises = [];
			for (let j = 0; j < nGroups; j++) for (let k = 0; k < nChunksPerGroup / 2; k++) {
				const first = Fr.exp(Fr.w[i], k * pointsInChunk);
				const inc = Fr.w[i];
				const o1 = j * nChunksPerGroup + k;
				const o2 = j * nChunksPerGroup + k + nChunksPerGroup / 2;
				const task = [];
				task.push({
					cmd: "ALLOCSET",
					var: 0,
					buff: chunks[o1]
				});
				task.push({
					cmd: "ALLOCSET",
					var: 1,
					buff: chunks[o2]
				});
				task.push({
					cmd: "ALLOCSET",
					var: 2,
					buff: first
				});
				task.push({
					cmd: "ALLOCSET",
					var: 3,
					buff: inc
				});
				task.push({
					cmd: "CALL",
					fnName: fnFFTJoin,
					params: [
						{ var: 0 },
						{ var: 1 },
						{ val: pointsInChunk },
						{ var: 2 },
						{ var: 3 }
					]
				});
				if (i == bits) {
					if (fnFFTFinal) {
						task.push({
							cmd: "ALLOCSET",
							var: 4,
							buff: inv
						});
						task.push({
							cmd: "CALL",
							fnName: fnFFTFinal,
							params: [
								{ var: 0 },
								{ val: pointsInChunk },
								{ var: 4 }
							]
						});
						task.push({
							cmd: "CALL",
							fnName: fnFFTFinal,
							params: [
								{ var: 1 },
								{ val: pointsInChunk },
								{ var: 4 }
							]
						});
					}
					if (fnMid2Out) {
						task.push({
							cmd: "CALL",
							fnName: fnMid2Out,
							params: [
								{ var: 0 },
								{ val: pointsInChunk },
								{ var: 0 }
							]
						});
						task.push({
							cmd: "CALL",
							fnName: fnMid2Out,
							params: [
								{ var: 1 },
								{ val: pointsInChunk },
								{ var: 1 }
							]
						});
					}
					task.push({
						cmd: "GET",
						out: 0,
						var: 0,
						len: pointsInChunk * sOut
					});
					task.push({
						cmd: "GET",
						out: 1,
						var: 1,
						len: pointsInChunk * sOut
					});
				} else {
					task.push({
						cmd: "GET",
						out: 0,
						var: 0,
						len: pointsInChunk * sMid
					});
					task.push({
						cmd: "GET",
						out: 1,
						var: 1,
						len: pointsInChunk * sMid
					});
				}
				opPromises.push(tm.queueAction(task, [
					chunks[o1].buffer,
					chunks[o2].buffer,
					first.buffer
				]));
			}
			const res = await Promise.all(opPromises);
			for (let j = 0; j < nGroups; j++) for (let k = 0; k < nChunksPerGroup / 2; k++) {
				const o1 = j * nChunksPerGroup + k;
				const o2 = j * nChunksPerGroup + k + nChunksPerGroup / 2;
				const resChunk = res.shift();
				chunks[o1] = resChunk[0];
				chunks[o2] = resChunk[1];
			}
		}
		if (buff instanceof BigBuffer)
 /* c8 ignore start */
		buffOut = new BigBuffer(nPoints * sOut);
		else buffOut = new Uint8Array(nPoints * sOut);
		if (inverse) {
			buffOut.set(chunks[0].slice((pointsInChunk - 1) * sOut));
			let p = sOut;
			for (let i = nChunks - 1; i > 0; i--) {
				buffOut.set(chunks[i], p);
				p += pointsInChunk * sOut;
				delete chunks[i];
			}
			buffOut.set(chunks[0].slice(0, (pointsInChunk - 1) * sOut), p);
			delete chunks[0];
		} else for (let i = 0; i < nChunks; i++) {
			buffOut.set(chunks[i], pointsInChunk * sOut * i);
			delete chunks[i];
		}
		if (returnArray) return buffer2array(buffOut, sOut);
		else return buffOut;
	}
	/* c8 ignore start */
	async function _fftExt(buff, inType, outType, logger, loggerTxt) {
		let b1, b2;
		b1 = buff.slice(0, buff.byteLength / 2);
		b2 = buff.slice(buff.byteLength / 2, buff.byteLength);
		const promises = [];
		[b1, b2] = await _fftJoinExt(b1, b2, "fftJoinExt", Fr.one, Fr.shift, inType, "jacobian", logger, loggerTxt);
		promises.push(_fft(b1, false, "jacobian", outType, logger, loggerTxt));
		promises.push(_fft(b2, false, "jacobian", outType, logger, loggerTxt));
		const res1 = await Promise.all(promises);
		let buffOut;
		if (res1[0].byteLength > 1 << 28) buffOut = new BigBuffer(res1[0].byteLength * 2);
		else buffOut = new Uint8Array(res1[0].byteLength * 2);
		buffOut.set(res1[0]);
		buffOut.set(res1[1], res1[0].byteLength);
		return buffOut;
	}
	/* c8 ignore stop */
	/* c8 ignore start */
	async function _fftExtInv(buff, inType, outType, logger, loggerTxt) {
		let b1, b2;
		b1 = buff.slice(0, buff.byteLength / 2);
		b2 = buff.slice(buff.byteLength / 2, buff.byteLength);
		const promises = [];
		promises.push(_fft(b1, true, inType, "jacobian", logger, loggerTxt));
		promises.push(_fft(b2, true, inType, "jacobian", logger, loggerTxt));
		[b1, b2] = await Promise.all(promises);
		const res1 = await _fftJoinExt(b1, b2, "fftJoinExtInv", Fr.one, Fr.shiftInv, "jacobian", outType, logger, loggerTxt);
		let buffOut;
		if (res1[0].byteLength > 1 << 28) buffOut = new BigBuffer(res1[0].byteLength * 2);
		else buffOut = new Uint8Array(res1[0].byteLength * 2);
		buffOut.set(res1[0]);
		buffOut.set(res1[1], res1[0].byteLength);
		return buffOut;
	}
	/* c8 ignore stop */
	/* c8 ignore start */
	async function _fftJoinExt(buff1, buff2, fn, first, inc, inType, outType, logger, loggerTxt) {
		const MAX_CHUNK_SIZE = 65536;
		const MIN_CHUNK_SIZE = 16;
		let fnName;
		let fnIn2Mid, fnMid2Out;
		let sOut, sIn, sMid;
		if (groupName == "G1") {
			if (inType == "affine") {
				sIn = G.F.n8 * 2;
				fnIn2Mid = "g1m_batchToJacobian";
			} else sIn = G.F.n8 * 3;
			sMid = G.F.n8 * 3;
			fnName = "g1m_" + fn;
			if (outType == "affine") {
				fnMid2Out = "g1m_batchToAffine";
				sOut = G.F.n8 * 2;
			} else sOut = G.F.n8 * 3;
		} else if (groupName == "G2") {
			if (inType == "affine") {
				sIn = G.F.n8 * 2;
				fnIn2Mid = "g2m_batchToJacobian";
			} else sIn = G.F.n8 * 3;
			fnName = "g2m_" + fn;
			sMid = G.F.n8 * 3;
			if (outType == "affine") {
				fnMid2Out = "g2m_batchToAffine";
				sOut = G.F.n8 * 2;
			} else sOut = G.F.n8 * 3;
		} else if (groupName == "Fr") {
			sIn = Fr.n8;
			sOut = Fr.n8;
			sMid = Fr.n8;
			fnName = "frm_" + fn;
		} else throw new Error("Invalid group");
		if (buff1.byteLength != buff2.byteLength) throw new Error("Invalid buffer size");
		const nPoints = Math.floor(buff1.byteLength / sIn);
		if (nPoints != 1 << log2(nPoints)) throw new Error("Invalid number of points");
		let chunkSize = Math.floor(nPoints / tm.concurrency);
		if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
		if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
		const opPromises = [];
		for (let i = 0; i < nPoints; i += chunkSize) {
			if (logger) logger.debug(`${loggerTxt}: fftJoinExt Start: ${i}/${nPoints}`);
			const n = Math.min(nPoints - i, chunkSize);
			const firstChunk = Fr.mul(first, Fr.exp(inc, i));
			const task = [];
			const b1 = buff1.slice(i * sIn, (i + n) * sIn);
			const b2 = buff2.slice(i * sIn, (i + n) * sIn);
			task.push({
				cmd: "ALLOC",
				var: 0,
				len: sMid * n
			});
			task.push({
				cmd: "SET",
				var: 0,
				buff: b1
			});
			task.push({
				cmd: "ALLOC",
				var: 1,
				len: sMid * n
			});
			task.push({
				cmd: "SET",
				var: 1,
				buff: b2
			});
			task.push({
				cmd: "ALLOCSET",
				var: 2,
				buff: firstChunk
			});
			task.push({
				cmd: "ALLOCSET",
				var: 3,
				buff: inc
			});
			if (fnIn2Mid) {
				task.push({
					cmd: "CALL",
					fnName: fnIn2Mid,
					params: [
						{ var: 0 },
						{ val: n },
						{ var: 0 }
					]
				});
				task.push({
					cmd: "CALL",
					fnName: fnIn2Mid,
					params: [
						{ var: 1 },
						{ val: n },
						{ var: 1 }
					]
				});
			}
			task.push({
				cmd: "CALL",
				fnName,
				params: [
					{ var: 0 },
					{ var: 1 },
					{ val: n },
					{ var: 2 },
					{ var: 3 },
					{ val: Fr.s }
				]
			});
			if (fnMid2Out) {
				task.push({
					cmd: "CALL",
					fnName: fnMid2Out,
					params: [
						{ var: 0 },
						{ val: n },
						{ var: 0 }
					]
				});
				task.push({
					cmd: "CALL",
					fnName: fnMid2Out,
					params: [
						{ var: 1 },
						{ val: n },
						{ var: 1 }
					]
				});
			}
			task.push({
				cmd: "GET",
				out: 0,
				var: 0,
				len: n * sOut
			});
			task.push({
				cmd: "GET",
				out: 1,
				var: 1,
				len: n * sOut
			});
			opPromises.push(tm.queueAction(task, [
				b1.buffer,
				b2.buffer,
				firstChunk.buffer
			]).then((r) => {
				if (logger) logger.debug(`${loggerTxt}: fftJoinExt End: ${i}/${nPoints}`);
				return r;
			}));
		}
		const result = await Promise.all(opPromises);
		let fullBuffOut1;
		let fullBuffOut2;
		if (nPoints * sOut > 1 << 28) {
			fullBuffOut1 = new BigBuffer(nPoints * sOut);
			fullBuffOut2 = new BigBuffer(nPoints * sOut);
		} else {
			fullBuffOut1 = new Uint8Array(nPoints * sOut);
			fullBuffOut2 = new Uint8Array(nPoints * sOut);
		}
		let p = 0;
		for (let i = 0; i < result.length; i++) {
			fullBuffOut1.set(result[i][0], p);
			fullBuffOut2.set(result[i][1], p);
			p += result[i][0].byteLength;
		}
		return [fullBuffOut1, fullBuffOut2];
	}
	/* c8 ignore stop */
	G.fft = async function(buff, inType, outType, logger, loggerTxt, consume) {
		return await _fft(buff, false, inType, outType, logger, loggerTxt, consume);
	};
	G.ifft = async function(buff, inType, outType, logger, loggerTxt, consume) {
		return await _fft(buff, true, inType, outType, logger, loggerTxt, consume);
	};
	G.lagrangeEvaluations = async function(buff, inType, outType, logger, loggerTxt) {
		inType = inType || "affine";
		outType = outType || "affine";
		let sIn;
		if (groupName == "G1") if (inType == "affine") sIn = G.F.n8 * 2;
		else sIn = G.F.n8 * 3;
		else if (groupName == "G2") if (inType == "affine") sIn = G.F.n8 * 2;
		else sIn = G.F.n8 * 3;
		else if (groupName == "Fr")
 /* c8 ignore start */
		sIn = Fr.n8;
		else throw new Error("Invalid group");
		/* c8 ignore stop */
		const nPoints = buff.byteLength / sIn;
		const bits = log2(nPoints);
		if (2 ** bits * sIn != buff.byteLength) {
			if (logger) logger.error("lagrangeEvaluations iinvalid input size");
			throw new Error("lagrangeEvaluations invalid Input size");
		}
		if (bits <= Fr.s) return await G.ifft(buff, inType, outType, logger, loggerTxt);
		/* c8 ignore start */
		if (bits > Fr.s + 1) {
			if (logger) logger.error("lagrangeEvaluations input too big");
			throw new Error("lagrangeEvaluations input too big");
		}
		let t0 = buff.slice(0, buff.byteLength / 2);
		let t1 = buff.slice(buff.byteLength / 2, buff.byteLength);
		const shiftToSmallM = Fr.exp(Fr.shift, nPoints / 2);
		const sConst = Fr.inv(Fr.sub(Fr.one, shiftToSmallM));
		[t0, t1] = await _fftJoinExt(t0, t1, "prepareLagrangeEvaluation", sConst, Fr.shiftInv, inType, "jacobian", logger, loggerTxt + " prep");
		const promises = [];
		promises.push(_fft(t0, true, "jacobian", outType, logger, loggerTxt + " t0"));
		promises.push(_fft(t1, true, "jacobian", outType, logger, loggerTxt + " t1"));
		[t0, t1] = await Promise.all(promises);
		let buffOut;
		if (t0.byteLength > 1 << 28) buffOut = new BigBuffer(t0.byteLength * 2);
		else buffOut = new Uint8Array(t0.byteLength * 2);
		buffOut.set(t0);
		buffOut.set(t1, t0.byteLength);
		return buffOut;
		/* c8 ignore stop */
	};
	G.fftMix = async function fftMix(buff) {
		const sG = G.F.n8 * 3;
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
		} else throw new Error("Invalid group");
		/* c8 ignore stop */
		const nPoints = Math.floor(buff.byteLength / sG);
		const power = log2(nPoints);
		let nChunks = 1 << log2(tm.concurrency);
		if (nPoints <= nChunks * 2) nChunks = 1;
		const pointsPerChunk = nPoints / nChunks;
		const powerChunk = log2(pointsPerChunk);
		const opPromises = [];
		for (let i = 0; i < nChunks; i++) {
			const task = [];
			const b = buff.slice(i * pointsPerChunk * sG, (i + 1) * pointsPerChunk * sG);
			task.push({
				cmd: "ALLOCSET",
				var: 0,
				buff: b
			});
			for (let j = 1; j <= powerChunk; j++) task.push({
				cmd: "CALL",
				fnName,
				params: [
					{ var: 0 },
					{ val: pointsPerChunk },
					{ val: j }
				]
			});
			task.push({
				cmd: "GET",
				out: 0,
				var: 0,
				len: pointsPerChunk * sG
			});
			opPromises.push(tm.queueAction(task, [b.buffer]));
		}
		const result = await Promise.all(opPromises);
		const chunks = [];
		for (let i = 0; i < result.length; i++) chunks[i] = result[i][0];
		for (let i = powerChunk + 1; i <= power; i++) {
			const nGroups = 1 << power - i;
			const nChunksPerGroup = nChunks / nGroups;
			const opPromises = [];
			for (let j = 0; j < nGroups; j++) for (let k = 0; k < nChunksPerGroup / 2; k++) {
				const first = Fr.exp(Fr.w[i], k * pointsPerChunk);
				const inc = Fr.w[i];
				const o1 = j * nChunksPerGroup + k;
				const o2 = j * nChunksPerGroup + k + nChunksPerGroup / 2;
				const task = [];
				task.push({
					cmd: "ALLOCSET",
					var: 0,
					buff: chunks[o1]
				});
				task.push({
					cmd: "ALLOCSET",
					var: 1,
					buff: chunks[o2]
				});
				task.push({
					cmd: "ALLOCSET",
					var: 2,
					buff: first
				});
				task.push({
					cmd: "ALLOCSET",
					var: 3,
					buff: inc
				});
				task.push({
					cmd: "CALL",
					fnName: fnFFTJoin,
					params: [
						{ var: 0 },
						{ var: 1 },
						{ val: pointsPerChunk },
						{ var: 2 },
						{ var: 3 }
					]
				});
				task.push({
					cmd: "GET",
					out: 0,
					var: 0,
					len: pointsPerChunk * sG
				});
				task.push({
					cmd: "GET",
					out: 1,
					var: 1,
					len: pointsPerChunk * sG
				});
				opPromises.push(tm.queueAction(task, [
					chunks[o1].buffer,
					chunks[o2].buffer,
					first.buffer
				]));
			}
			const res = await Promise.all(opPromises);
			for (let j = 0; j < nGroups; j++) for (let k = 0; k < nChunksPerGroup / 2; k++) {
				const o1 = j * nChunksPerGroup + k;
				const o2 = j * nChunksPerGroup + k + nChunksPerGroup / 2;
				const resChunk = res.shift();
				chunks[o1] = resChunk[0];
				chunks[o2] = resChunk[1];
			}
		}
		let fullBuffOut;
		if (buff instanceof BigBuffer)
 /* c8 ignore start */
		fullBuffOut = new BigBuffer(nPoints * sG);
		else fullBuffOut = new Uint8Array(nPoints * sG);
		let p = 0;
		for (let i = 0; i < nChunks; i++) {
			fullBuffOut.set(chunks[i], p);
			p += chunks[i].byteLength;
		}
		return fullBuffOut;
	};
	G.fftJoin = async function fftJoin(buff1, buff2, first, inc) {
		const sG = G.F.n8 * 3;
		let fnName;
		if (groupName == "G1") fnName = "g1m_fftJoin";
		else if (groupName == "G2") fnName = "g2m_fftJoin";
		else if (groupName == "Fr") fnName = "frm_fftJoin";
		else throw new Error("Invalid group");
		/* c8 ignore stop */
		if (buff1.byteLength != buff2.byteLength) throw new Error("Invalid buffer size");
		const nPoints = Math.floor(buff1.byteLength / sG);
		if (nPoints != 1 << log2(nPoints)) throw new Error("Invalid number of points");
		let nChunks = 1 << log2(tm.concurrency);
		if (nPoints <= nChunks * 2) nChunks = 1;
		const pointsPerChunk = nPoints / nChunks;
		const opPromises = [];
		for (let i = 0; i < nChunks; i++) {
			const task = [];
			const firstChunk = Fr.mul(first, Fr.exp(inc, i * pointsPerChunk));
			const b1 = buff1.slice(i * pointsPerChunk * sG, (i + 1) * pointsPerChunk * sG);
			const b2 = buff2.slice(i * pointsPerChunk * sG, (i + 1) * pointsPerChunk * sG);
			task.push({
				cmd: "ALLOCSET",
				var: 0,
				buff: b1
			});
			task.push({
				cmd: "ALLOCSET",
				var: 1,
				buff: b2
			});
			task.push({
				cmd: "ALLOCSET",
				var: 2,
				buff: firstChunk
			});
			task.push({
				cmd: "ALLOCSET",
				var: 3,
				buff: inc
			});
			task.push({
				cmd: "CALL",
				fnName,
				params: [
					{ var: 0 },
					{ var: 1 },
					{ val: pointsPerChunk },
					{ var: 2 },
					{ var: 3 }
				]
			});
			task.push({
				cmd: "GET",
				out: 0,
				var: 0,
				len: pointsPerChunk * sG
			});
			task.push({
				cmd: "GET",
				out: 1,
				var: 1,
				len: pointsPerChunk * sG
			});
			opPromises.push(tm.queueAction(task, [
				b1.buffer,
				b2.buffer,
				firstChunk.buffer
			]));
		}
		const result = await Promise.all(opPromises);
		let fullBuffOut1;
		let fullBuffOut2;
		if (buff1 instanceof BigBuffer) {
			/* c8 ignore start */
			fullBuffOut1 = new BigBuffer(nPoints * sG);
			fullBuffOut2 = new BigBuffer(nPoints * sG);
		} else {
			fullBuffOut1 = new Uint8Array(nPoints * sG);
			fullBuffOut2 = new Uint8Array(nPoints * sG);
		}
		let p = 0;
		for (let i = 0; i < result.length; i++) {
			fullBuffOut1.set(result[i][0], p);
			fullBuffOut2.set(result[i][1], p);
			p += result[i][0].byteLength;
		}
		return [fullBuffOut1, fullBuffOut2];
	};
	G.fftFinal = async function fftFinal(buff, factor) {
		const sG = G.F.n8 * 3;
		const sGout = G.F.n8 * 2;
		let fnName, fnToAffine;
		if (groupName == "G1") {
			fnName = "g1m_fftFinal";
			fnToAffine = "g1m_batchToAffine";
		} else if (groupName == "G2") {
			fnName = "g2m_fftFinal";
			fnToAffine = "g2m_batchToAffine";
		} else throw new Error("Invalid group");
		/* c8 ignore stop */
		const nPoints = Math.floor(buff.byteLength / sG);
		if (nPoints != 1 << log2(nPoints)) throw new Error("Invalid number of points");
		const pointsPerChunk = Math.floor(nPoints / tm.concurrency);
		const opPromises = [];
		for (let i = 0; i < tm.concurrency; i++) {
			let n;
			if (i < tm.concurrency - 1) n = pointsPerChunk;
			else n = nPoints - i * pointsPerChunk;
			if (n == 0) continue;
			const task = [];
			const b = buff.slice(i * pointsPerChunk * sG, (i * pointsPerChunk + n) * sG);
			task.push({
				cmd: "ALLOCSET",
				var: 0,
				buff: b
			});
			task.push({
				cmd: "ALLOCSET",
				var: 1,
				buff: factor
			});
			task.push({
				cmd: "CALL",
				fnName,
				params: [
					{ var: 0 },
					{ val: n },
					{ var: 1 }
				]
			});
			task.push({
				cmd: "CALL",
				fnName: fnToAffine,
				params: [
					{ var: 0 },
					{ val: n },
					{ var: 0 }
				]
			});
			task.push({
				cmd: "GET",
				out: 0,
				var: 0,
				len: n * sGout
			});
			opPromises.push(tm.queueAction(task, [b.buffer]));
		}
		const result = await Promise.all(opPromises);
		let fullBuffOut;
		if (buff instanceof BigBuffer)
 /* c8 ignore start */
		fullBuffOut = new BigBuffer(nPoints * sGout);
		else fullBuffOut = new Uint8Array(nPoints * sGout);
		let p = 0;
		for (let i = result.length - 1; i >= 0; i--) {
			fullBuffOut.set(result[i][0], p);
			p += result[i][0].byteLength;
		}
		return fullBuffOut;
	};
}
//#endregion
//#region src/engine.js
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
		const buff = new Uint8Array(sG * arr.length);
		for (let i = 0; i < arr.length; i++) buff.set(arr[i], i * sG);
		return buff;
	};
	curve.buffer2array = function(buff, sG) {
		const n = buff.byteLength / sG;
		const arr = new Array(n);
		for (let i = 0; i < n; i++) arr[i] = buff.slice(i * sG, i * sG + sG);
		return arr;
	};
	return curve;
}
//#endregion
//#region src/wasm/bn128_wasm.js
var code$2 = "AGFzbQEAAAABigEQYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgCH9/f39/f39/AGADf39/AX9gBH9/f38Bf2AKf39/f39/f39/fwBgBX9/f39/AX9gB39/f39/f38Bf2AJf39/f39/f39/AX9gC39/f39/f39/f39/AX8CDwEDZW52Bm1lbW9yeQIAGQOdApsCAAUCBQYGCQkBAAADAQIBAQAAAQAAAAACAgAFAQMEAQEDAAICAQEAAAEAAAAAAgIABQEDBAEBAwACAQAAAgICBQUAAAAGBgYAAAEBAQAAAQEBAAAAAAACAgEAAQAAAAABAQEBAQoHCAQIBAMDAAMCAAAEBwcBAQcAAwsEAwIFAAEBAAEBAAADAgIEAwACAgIFBQAAAAYGBgAAAQEBAAABAQEAAAAAAAICAQAAAAAAAQEBAQEIBAgEAwMBAAMAAAQHBwEBBwEAAwAABAcHAQEHAQEEBAQEBAACAgUFAAEAAQEAAgYAAwIEAwACAgUFAAEBAAEBAAAAAAYAAwICBAMAAgAAAAADAwEAAAAAAAAAAAAAAAAAAAkMDQ4PAQexJasCCGludF9jb3B5AAAIaW50X3plcm8AAQdpbnRfb25lAAMKaW50X2lzWmVybwACBmludF9lcQAEB2ludF9ndGUABQdpbnRfYWRkAAYHaW50X3N1YgAHB2ludF9tdWwACAppbnRfc3F1YXJlAAkNaW50X3NxdWFyZU9sZAAKB2ludF9kaXYACw5pbnRfaW52ZXJzZU1vZAAMCGYxbV9jb3B5AAAIZjFtX3plcm8AAQpmMW1faXNaZXJvAAIGZjFtX2VxAAQHZjFtX2FkZAAOB2YxbV9zdWIADwdmMW1fbmVnABAOZjFtX2lzTmVnYXRpdmUAFwlmMW1faXNPbmUADQhmMW1fc2lnbgAYC2YxbV9tUmVkdWN0ABEHZjFtX211bAASCmYxbV9zcXVhcmUAEw1mMW1fc3F1YXJlT2xkABQSZjFtX2Zyb21Nb250Z29tZXJ5ABYQZjFtX3RvTW9udGdvbWVyeQAVC2YxbV9pbnZlcnNlABkHZjFtX29uZQAaCGYxbV9sb2FkABsPZjFtX3RpbWVzU2NhbGFyABwHZjFtX2V4cAAgEGYxbV9iYXRjaEludmVyc2UAHQhmMW1fc3FydAAhDGYxbV9pc1NxdWFyZQAiFWYxbV9iYXRjaFRvTW9udGdvbWVyeQAeF2YxbV9iYXRjaEZyb21Nb250Z29tZXJ5AB8IZnJtX2NvcHkAAAhmcm1femVybwABCmZybV9pc1plcm8AAgZmcm1fZXEABAdmcm1fYWRkACQHZnJtX3N1YgAlB2ZybV9uZWcAJg5mcm1faXNOZWdhdGl2ZQAtCWZybV9pc09uZQAjCGZybV9zaWduAC4LZnJtX21SZWR1Y3QAJwdmcm1fbXVsACgKZnJtX3NxdWFyZQApDWZybV9zcXVhcmVPbGQAKhJmcm1fZnJvbU1vbnRnb21lcnkALBBmcm1fdG9Nb250Z29tZXJ5ACsLZnJtX2ludmVyc2UALwdmcm1fb25lADAIZnJtX2xvYWQAMQ9mcm1fdGltZXNTY2FsYXIAMgdmcm1fZXhwADYQZnJtX2JhdGNoSW52ZXJzZQAzCGZybV9zcXJ0ADcMZnJtX2lzU3F1YXJlADgVZnJtX2JhdGNoVG9Nb250Z29tZXJ5ADQXZnJtX2JhdGNoRnJvbU1vbnRnb21lcnkANQZmcl9hZGQAJAZmcl9zdWIAJQZmcl9uZWcAJgZmcl9tdWwAOQlmcl9zcXVhcmUAOgpmcl9pbnZlcnNlADsNZnJfaXNOZWdhdGl2ZQA8B2ZyX2NvcHkAAAdmcl96ZXJvAAEGZnJfb25lADAJZnJfaXNaZXJvAAIFZnJfZXEABAxnMW1fbXVsdGlleHAAZxJnMW1fbXVsdGlleHBfY2h1bmsAZhJnMW1fbXVsdGlleHBBZmZpbmUAaRhnMW1fbXVsdGlleHBBZmZpbmVfY2h1bmsAaApnMW1faXNaZXJvAD4QZzFtX2lzWmVyb0FmZmluZQA9BmcxbV9lcQBGC2cxbV9lcU1peGVkAEUMZzFtX2VxQWZmaW5lAEQIZzFtX2NvcHkAQg5nMW1fY29weUFmZmluZQBBCGcxbV96ZXJvAEAOZzFtX3plcm9BZmZpbmUAPwpnMW1fZG91YmxlAEgQZzFtX2RvdWJsZUFmZmluZQBHB2cxbV9hZGQASwxnMW1fYWRkTWl4ZWQASg1nMW1fYWRkQWZmaW5lAEkHZzFtX25lZwBNDWcxbV9uZWdBZmZpbmUATAdnMW1fc3ViAFAMZzFtX3N1Yk1peGVkAE8NZzFtX3N1YkFmZmluZQBOEmcxbV9mcm9tTW9udGdvbWVyeQBSGGcxbV9mcm9tTW9udGdvbWVyeUFmZmluZQBREGcxbV90b01vbnRnb21lcnkAVBZnMW1fdG9Nb250Z29tZXJ5QWZmaW5lAFMPZzFtX3RpbWVzU2NhbGFyAGoVZzFtX3RpbWVzU2NhbGFyQWZmaW5lAGsNZzFtX25vcm1hbGl6ZQBZCmcxbV9MRU10b1UAWwpnMW1fTEVNdG9DAFwKZzFtX1V0b0xFTQBdCmcxbV9DdG9MRU0AXg9nMW1fYmF0Y2hMRU10b1UAXw9nMW1fYmF0Y2hMRU10b0MAYA9nMW1fYmF0Y2hVdG9MRU0AYQ9nMW1fYmF0Y2hDdG9MRU0AYgxnMW1fdG9BZmZpbmUAVQ5nMW1fdG9KYWNvYmlhbgBDEWcxbV9iYXRjaFRvQWZmaW5lAFgTZzFtX2JhdGNoVG9KYWNvYmlhbgBjC2cxbV9pbkN1cnZlAFcRZzFtX2luQ3VydmVBZmZpbmUAVhdmcm1fX3JldmVyc2VQZXJtdXRhdGlvbgBsB2ZybV9mZnQAbwhmcm1faWZmdABwCmZybV9yYXdmZnQAbQtmcm1fZmZ0Sm9pbgBxDmZybV9mZnRKb2luRXh0AHIRZnJtX2ZmdEpvaW5FeHRJbnYAcwpmcm1fZmZ0TWl4AHQMZnJtX2ZmdEZpbmFsAHUdZnJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24Adghwb2xfemVybwB3D3BvbF9jb25zdHJ1Y3RMQwB4DHFhcF9idWlsZEFCQwB5C3FhcF9qb2luQUJDAHoMcWFwX2JhdGNoQWRkAHsKZjJtX2lzWmVybwA9CWYybV9pc09uZQB8CGYybV96ZXJvAD8HZjJtX29uZQB9CGYybV9jb3B5AH4HZjJtX211bAB/CGYybV9tdWwxAIABCmYybV9zcXVhcmUAgQEHZjJtX2FkZACCAQdmMm1fc3ViAIMBB2YybV9uZWcAhAEIZjJtX3NpZ24AhwENZjJtX2Nvbmp1Z2F0ZQBMEmYybV9mcm9tTW9udGdvbWVyeQBREGYybV90b01vbnRnb21lcnkAUwZmMm1fZXEARAtmMm1faW52ZXJzZQCFAQdmMm1fZXhwAIoBD2YybV90aW1lc1NjYWxhcgCGARBmMm1fYmF0Y2hJbnZlcnNlAIkBCGYybV9zcXJ0AIsBDGYybV9pc1NxdWFyZQCMAQ5mMm1faXNOZWdhdGl2ZQCIAQxnMm1fbXVsdGlleHAAtAESZzJtX211bHRpZXhwX2NodW5rALMBEmcybV9tdWx0aWV4cEFmZmluZQC2ARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsAtQEKZzJtX2lzWmVybwCOARBnMm1faXNaZXJvQWZmaW5lAI0BBmcybV9lcQCWAQtnMm1fZXFNaXhlZACVAQxnMm1fZXFBZmZpbmUAlAEIZzJtX2NvcHkAkgEOZzJtX2NvcHlBZmZpbmUAkQEIZzJtX3plcm8AkAEOZzJtX3plcm9BZmZpbmUAjwEKZzJtX2RvdWJsZQCYARBnMm1fZG91YmxlQWZmaW5lAJcBB2cybV9hZGQAmwEMZzJtX2FkZE1peGVkAJoBDWcybV9hZGRBZmZpbmUAmQEHZzJtX25lZwCdAQ1nMm1fbmVnQWZmaW5lAJwBB2cybV9zdWIAoAEMZzJtX3N1Yk1peGVkAJ8BDWcybV9zdWJBZmZpbmUAngESZzJtX2Zyb21Nb250Z29tZXJ5AKIBGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQChARBnMm1fdG9Nb250Z29tZXJ5AKQBFmcybV90b01vbnRnb21lcnlBZmZpbmUAowEPZzJtX3RpbWVzU2NhbGFyALcBFWcybV90aW1lc1NjYWxhckFmZmluZQC4AQ1nMm1fbm9ybWFsaXplAKkBCmcybV9MRU10b1UAqgEKZzJtX0xFTXRvQwCrAQpnMm1fVXRvTEVNAKwBCmcybV9DdG9MRU0ArQEPZzJtX2JhdGNoTEVNdG9VAK4BD2cybV9iYXRjaExFTXRvQwCvAQ9nMm1fYmF0Y2hVdG9MRU0AsAEPZzJtX2JhdGNoQ3RvTEVNALEBDGcybV90b0FmZmluZQClAQ5nMm1fdG9KYWNvYmlhbgCTARFnMm1fYmF0Y2hUb0FmZmluZQCoARNnMm1fYmF0Y2hUb0phY29iaWFuALIBC2cybV9pbkN1cnZlAKcBEWcybV9pbkN1cnZlQWZmaW5lAKYBC2cxbV90aW1lc0ZyALkBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uALoBB2cxbV9mZnQAvAEIZzFtX2lmZnQAvQEKZzFtX3Jhd2ZmdAC7AQtnMW1fZmZ0Sm9pbgC+AQ5nMW1fZmZ0Sm9pbkV4dAC/ARFnMW1fZmZ0Sm9pbkV4dEludgDAAQpnMW1fZmZ0TWl4AMEBDGcxbV9mZnRGaW5hbADCAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDDAQtnMm1fdGltZXNGcgDEARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDFAQdnMm1fZmZ0AMcBCGcybV9pZmZ0AMgBCmcybV9yYXdmZnQAxgELZzJtX2ZmdEpvaW4AyQEOZzJtX2ZmdEpvaW5FeHQAygERZzJtX2ZmdEpvaW5FeHRJbnYAywEKZzJtX2ZmdE1peADMAQxnMm1fZmZ0RmluYWwAzQEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24AzgERZzFtX3RpbWVzRnJBZmZpbmUAzwERZzJtX3RpbWVzRnJBZmZpbmUA0AERZnJtX2JhdGNoQXBwbHlLZXkA0QERZzFtX2JhdGNoQXBwbHlLZXkA0gEWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZADTARFnMm1fYmF0Y2hBcHBseUtleQDUARZnMm1fYmF0Y2hBcHBseUtleU1peGVkANUBCmY2bV9pc1plcm8A1wEJZjZtX2lzT25lANgBCGY2bV96ZXJvANkBB2Y2bV9vbmUA2gEIZjZtX2NvcHkA2wEHZjZtX211bADcAQpmNm1fc3F1YXJlAN0BB2Y2bV9hZGQA3gEHZjZtX3N1YgDfAQdmNm1fbmVnAOABCGY2bV9zaWduAOEBEmY2bV9mcm9tTW9udGdvbWVyeQCiARBmNm1fdG9Nb250Z29tZXJ5AKQBBmY2bV9lcQDiAQtmNm1faW52ZXJzZQDjAQdmNm1fZXhwAOcBD2Y2bV90aW1lc1NjYWxhcgDkARBmNm1fYmF0Y2hJbnZlcnNlAOYBDmY2bV9pc05lZ2F0aXZlAOUBCmZ0bV9pc1plcm8A6QEJZnRtX2lzT25lAOoBCGZ0bV96ZXJvAOsBB2Z0bV9vbmUA7AEIZnRtX2NvcHkA7QEHZnRtX211bADuAQhmdG1fbXVsMQDvAQpmdG1fc3F1YXJlAPABB2Z0bV9hZGQA8QEHZnRtX3N1YgDyAQdmdG1fbmVnAPMBCGZ0bV9zaWduAPoBDWZ0bV9jb25qdWdhdGUA9AESZnRtX2Zyb21Nb250Z29tZXJ5APYBEGZ0bV90b01vbnRnb21lcnkA9QEGZnRtX2VxAPcBC2Z0bV9pbnZlcnNlAPgBB2Z0bV9leHAA/QEPZnRtX3RpbWVzU2NhbGFyAPkBEGZ0bV9iYXRjaEludmVyc2UA/AEIZnRtX3NxcnQA/gEMZnRtX2lzU3F1YXJlAP8BDmZ0bV9pc05lZ2F0aXZlAPsBFGJuMTI4X19mcm9iZW5pdXNNYXAwAIcCFGJuMTI4X19mcm9iZW5pdXNNYXAxAIgCFGJuMTI4X19mcm9iZW5pdXNNYXAyAIkCFGJuMTI4X19mcm9iZW5pdXNNYXAzAIoCFGJuMTI4X19mcm9iZW5pdXNNYXA0AIsCFGJuMTI4X19mcm9iZW5pdXNNYXA1AIwCFGJuMTI4X19mcm9iZW5pdXNNYXA2AI0CFGJuMTI4X19mcm9iZW5pdXNNYXA3AI4CFGJuMTI4X19mcm9iZW5pdXNNYXA4AI8CFGJuMTI4X19mcm9iZW5pdXNNYXA5AJACEGJuMTI4X3BhaXJpbmdFcTEAlQIQYm4xMjhfcGFpcmluZ0VxMgCWAhBibjEyOF9wYWlyaW5nRXEzAJcCEGJuMTI4X3BhaXJpbmdFcTQAmAIQYm4xMjhfcGFpcmluZ0VxNQCZAg1ibjEyOF9wYWlyaW5nAJoCD2JuMTI4X3ByZXBhcmVHMQCBAg9ibjEyOF9wcmVwYXJlRzIAgwIQYm4xMjhfbWlsbGVyTG9vcACGAhlibjEyOF9maW5hbEV4cG9uZW50aWF0aW9uAJQCHGJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAkQIPYm4xMjhfX211bEJ5MDI0AIQCEmJuMTI4X19tdWxCeTAyNE9sZACFAhdibjEyOF9fY3ljbG90b21pY1NxdWFyZQCSAhdibjEyOF9fY3ljbG90b21pY0V4cF93MACTAgrerAObAioAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGAseACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxgLLAAgACkDGFAEfiAAKQMQUAR+IAApAwhQBH4gACkDAAVCAQsFQgELBUIBC1ALHgAgAEIBNwMAIABCADcDCCAAQgA3AxAgAEIANwMYC0AAIAApAxggASkDGFEEfyAAKQMQIAEpAxBRBH8gACkDCCABKQMIUQR/IAApAwAgASkDAFEFQQALBUEACwVBAAsLcwAgACkDGCABKQMYVAR/QQAFIAApAxggASkDGFYEf0EBBSAAKQMQIAEpAxBUBH9BAAUgACkDECABKQMQVgR/QQEFIAApAwggASkDCFQEf0EABSAAKQMIIAEpAwhWBH9BAQUgACkDACABKQMAWgsLCwsLCwvEAQEBfiACIAA1AgAgATUCAHwiAz4CACACIAA1AgQgATUCBHwgA0IgiHwiAz4CBCACIAA1AgggATUCCHwgA0IgiHwiAz4CCCACIAA1AgwgATUCDHwgA0IgiHwiAz4CDCACIAA1AhAgATUCEHwgA0IgiHwiAz4CECACIAA1AhQgATUCFHwgA0IgiHwiAz4CFCACIAA1AhggATUCGHwgA0IgiHwiAz4CGCACIAA1AhwgATUCHHwgA0IgiHwiAz4CHCADQiCIpwv8AQEBfiACIAA1AgAgATUCAH0iA0L/////D4M+AgAgAiAANQIEIAE1AgR9IANCIId8IgNC/////w+DPgIEIAIgADUCCCABNQIIfSADQiCHfCIDQv////8Pgz4CCCACIAA1AgwgATUCDH0gA0Igh3wiA0L/////D4M+AgwgAiAANQIQIAE1AhB9IANCIId8IgNC/////w+DPgIQIAIgADUCFCABNQIUfSADQiCHfCIDQv////8Pgz4CFCACIAA1AhggATUCGH0gA0Igh3wiA0L/////D4M+AhggAiAANQIcIAE1Ahx9IANCIId8IgNC/////w+DPgIcIANCIIenC+YOARF+IAQgADUCACIFIAE1AgAiBn4gA0L/////D4N8IgNCIIh8IQQgAiADPgIAIARCIIghAyADIAUgATUCBCIHfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AgQiCCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AgQgA0IgiCEEIAQgBSABNQIIIgl+IANC/////w+DfCIDQiCIfCEEIAQgByAIfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AggiCiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AgggBEIgiCEDIAMgBSABNQIMIgt+IARC/////w+DfCIEQiCIfCEDIAMgCCAJfiAEQv////8Pg3wiBEIgiHwhAyADIAcgCn4gBEL/////D4N8IgRCIIh8IQMgAyAANQIMIgwgBn4gBEL/////D4N8IgRCIIh8IQMgAiAEPgIMIANCIIghBCAEIAUgATUCECINfiADQv////8Pg3wiA0IgiHwhBCAEIAggC34gA0L/////D4N8IgNCIIh8IQQgBCAJIAp+IANC/////w+DfCIDQiCIfCEEIAQgByAMfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AhAiDiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AhAgBEIgiCEDIAMgBSABNQIUIg9+IARC/////w+DfCIEQiCIfCEDIAMgCCANfiAEQv////8Pg3wiBEIgiHwhAyADIAogC34gBEL/////D4N8IgRCIIh8IQMgAyAJIAx+IARC/////w+DfCIEQiCIfCEDIAMgByAOfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AhQiECAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AhQgA0IgiCEEIAQgBSABNQIYIhF+IANC/////w+DfCIDQiCIfCEEIAQgCCAPfiADQv////8Pg3wiA0IgiHwhBCAEIAogDX4gA0L/////D4N8IgNCIIh8IQQgBCALIAx+IANC/////w+DfCIDQiCIfCEEIAQgCSAOfiADQv////8Pg3wiA0IgiHwhBCAEIAcgEH4gA0L/////D4N8IgNCIIh8IQQgBCAANQIYIhIgBn4gA0L/////D4N8IgNCIIh8IQQgAiADPgIYIARCIIghAyADIAUgATUCHCITfiAEQv////8Pg3wiBEIgiHwhAyADIAggEX4gBEL/////D4N8IgRCIIh8IQMgAyAKIA9+IARC/////w+DfCIEQiCIfCEDIAMgDCANfiAEQv////8Pg3wiBEIgiHwhAyADIAsgDn4gBEL/////D4N8IgRCIIh8IQMgAyAJIBB+IARC/////w+DfCIEQiCIfCEDIAMgByASfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AhwiBSAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AhwgA0IgiCEEIAQgCCATfiADQv////8Pg3wiA0IgiHwhBCAEIAogEX4gA0L/////D4N8IgNCIIh8IQQgBCAMIA9+IANC/////w+DfCIDQiCIfCEEIAQgDSAOfiADQv////8Pg3wiA0IgiHwhBCAEIAsgEH4gA0L/////D4N8IgNCIIh8IQQgBCAJIBJ+IANC/////w+DfCIDQiCIfCEEIAQgBSAHfiADQv////8Pg3wiA0IgiHwhBCACIAM+AiAgBEIgiCEDIAMgCiATfiAEQv////8Pg3wiBEIgiHwhAyADIAwgEX4gBEL/////D4N8IgRCIIh8IQMgAyAOIA9+IARC/////w+DfCIEQiCIfCEDIAMgDSAQfiAEQv////8Pg3wiBEIgiHwhAyADIAsgEn4gBEL/////D4N8IgRCIIh8IQMgAyAFIAl+IARC/////w+DfCIEQiCIfCEDIAIgBD4CJCADQiCIIQQgBCAMIBN+IANC/////w+DfCIDQiCIfCEEIAQgDiARfiADQv////8Pg3wiA0IgiHwhBCAEIA8gEH4gA0L/////D4N8IgNCIIh8IQQgBCANIBJ+IANC/////w+DfCIDQiCIfCEEIAQgBSALfiADQv////8Pg3wiA0IgiHwhBCACIAM+AiggBEIgiCEDIAMgDiATfiAEQv////8Pg3wiBEIgiHwhAyADIBAgEX4gBEL/////D4N8IgRCIIh8IQMgAyAPIBJ+IARC/////w+DfCIEQiCIfCEDIAMgBSANfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AiwgA0IgiCEEIAQgECATfiADQv////8Pg3wiA0IgiHwhBCAEIBEgEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIA9+IANC/////w+DfCIDQiCIfCEEIAIgAz4CMCAEQiCIIQMgAyASIBN+IARC/////w+DfCIEQiCIfCEDIAMgBSARfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AjQgA0IgiCEEIAQgBSATfiADQv////8Pg3wiA0IgiHwhBCACIAM+AjggAiAEPgI8C84NAQx+IAMgADUCACIGIAZ+IAJC/////w+DfCICQiCIfCEDIAEgAj4CACADIgRCIIghBSAANQIEIgcgBn4iAkIgiEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIEIAMiBEIgiCEFIAA1AggiCCAGfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAHIAd+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIIIAMiBEIgiCEFIAA1AgwiCSAGfiICQiCIIQMgAyAHIAh+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIMIAMiBEIgiCEFIAA1AhAiCiAGfiICQiCIIQMgAyAHIAl+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCCAIfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CECADIgRCIIghBSAANQIUIgsgBn4iAkIgiCEDIAMgByAKfiACQv////8Pg3wiAkIgiHwhAyADIAggCX4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhQgAyIEQiCIIQUgADUCGCIMIAZ+IgJCIIghAyADIAcgC34gAkL/////D4N8IgJCIIh8IQMgAyAIIAp+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCSAJfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CGCADIgRCIIghBSAANQIcIg0gBn4iAkIgiCEDIAMgByAMfiACQv////8Pg3wiAkIgiHwhAyADIAggC34gAkL/////D4N8IgJCIIh8IQMgAyAJIAp+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIcIAMiBEIgiCEFIAcgDX4iAkIgiCEDIAMgCCAMfiACQv////8Pg3wiAkIgiHwhAyADIAkgC34gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAKIAp+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIgIAMiBEIgiCEFIAggDX4iAkIgiCEDIAMgCSAMfiACQv////8Pg3wiAkIgiHwhAyADIAogC34gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiQgAyIEQiCIIQUgCSANfiICQiCIIQMgAyAKIAx+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCyALfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CKCADIgRCIIghBSAKIA1+IgJCIIghAyADIAsgDH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiwgAyIEQiCIIQUgCyANfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAMIAx+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIwIAMiBEIgiCEFIAwgDX4iAkIgiEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgI0IAMiBEIgiCEFQgAhAkIAIQMgAyANIA1+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgI4IAEgAz4CPAsKACAAIAAgARAIC+QDAgN+AX8gACADQegAIAMbIgMQACABQSgQACACQcgAIAIbIgcQAUGIARABQR8hAEEfIQEDQCABQShqLQAAIAFBA0ZyRQRAIAFBAWshAQwBCwsgAUElajUAAEIBfCIGQgFRBEBCAEIAgBoLA0ACQANAIAAgA2otAAAgAEEHRnJFBEAgAEEBayEADAELCyAAIANqQQdrKQAAIAaAIQQgACABa0EEayECA0AgBEKAgICAcINQIAJBAE5xRQRAIARCCIghBCACQQFqIQIMAQsLIARQBEAgA0EoEAVFDQFCASEEQQAhAgtBqAFBKDUAACAEfiIFPgAAQawBQSw1AAAgBH4gBUIgiHwiBT4AAEGwAUEwNQAAIAR+IAVCIIh8IgU+AABBtAFBNDUAACAEfiAFQiCIfCIFPgAAQbgBQTg1AAAgBH4gBUIgiHwiBT4AAEG8AUE8NQAAIAR+IAVCIIh8IgU+AABBwAFBwAA1AAAgBH4gBUIgiHwiBT4AAEHEAUHEADUAACAEfiAFQiCIfD4AACADQagBIAJrIAMQBxogAiAHaiICIAI1AAAgBHwiBD4AACAEQiCIIQQDQCAEQgBSBEAgAkEEaiICNQAAIAR8IQQgAiAEPgAAIARCIIghBAwBCwsMAQsLC44CAQp/QcgBIQNByAEQAUHoASEIIAFB6AEQAEGIAiEJQYgCEANBqAIhBiAAQagCEABByAIhC0HoAiEKQcgDIQQDQCAGEAJFBEAgCCAGIAsgChALIAsgCUGIAxAIIAcEfyAFBH9BiAMgAxAFBH9BiAMgAyAEEAcaQQAFIANBiAMgBBAHGkEBCwVBiAMgAyAEEAYaQQELBSAFBH9BiAMgAyAEEAYaQQAFIANBiAMQBQR/IANBiAMgBBAHGkEABUGIAyADIAQQBxpBAQsLCyEMIAMhACAJIQMgBCEJIAAhBCAFIQcgDCEFIAghACAGIQggCiEGIAAhCgwBCwsgBwRAIAEgAyACEAcaBSADIAIQAAsLCQAgAEGoBBAECywAIAAgASACEAYEQCACQegDIAIQBxoFIAJB6AMQBQRAIAJB6AMgAhAHGgsLCxcAIAAgASACEAcEQCACQegDIAIQBhoLCwsAQcgEIAAgARAPC7YPAQN+IAAgADUCAEKJx5mkDiIEIAA1AgB+Qv////8PgyIDQegDNQIAfnwiAj4CACAAIAA1AgQgAkIgiHxB7AM1AgAgA358IgI+AgQgACAANQIIIAJCIIh8QfADNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEH0AzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB+AM1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfwDNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGABDUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBhAQ1AgAgA358IgI+AhxBiAYgAkIgiD4CACAAIAA1AgQgADUCBCAEfkL/////D4MiA0HoAzUCAH58IgI+AgQgACAANQIIIAJCIIh8QewDNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEHwAzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB9AM1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfgDNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH8AzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBgAQ1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYQENQIAIAN+fCICPgIgQYwGIAJCIIg+AgAgACAANQIIIAA1AgggBH5C/////w+DIgNB6AM1AgB+fCICPgIIIAAgADUCDCACQiCIfEHsAzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB8AM1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfQDNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH4AzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB/AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QYAENQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGEBDUCACADfnwiAj4CJEGQBiACQiCIPgIAIAAgADUCDCAANQIMIAR+Qv////8PgyIDQegDNQIAfnwiAj4CDCAAIAA1AhAgAkIgiHxB7AM1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QfADNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEH0AzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB+AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfwDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGABDUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBhAQ1AgAgA358IgI+AihBlAYgAkIgiD4CACAAIAA1AhAgADUCECAEfkL/////D4MiA0HoAzUCAH58IgI+AhAgACAANQIUIAJCIIh8QewDNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHwAzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB9AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfgDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH8AzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBgAQ1AgAgA358IgI+AiggACAANQIsIAJCIIh8QYQENQIAIAN+fCICPgIsQZgGIAJCIIg+AgAgACAANQIUIAA1AhQgBH5C/////w+DIgNB6AM1AgB+fCICPgIUIAAgADUCGCACQiCIfEHsAzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB8AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfQDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH4AzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB/AM1AgAgA358IgI+AiggACAANQIsIAJCIIh8QYAENQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGEBDUCACADfnwiAj4CMEGcBiACQiCIPgIAIAAgADUCGCAANQIYIAR+Qv////8PgyIDQegDNQIAfnwiAj4CGCAAIAA1AhwgAkIgiHxB7AM1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QfADNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEH0AzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB+AM1AgAgA358IgI+AiggACAANQIsIAJCIIh8QfwDNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGABDUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBhAQ1AgAgA358IgI+AjRBoAYgAkIgiD4CACAAIAA1AhwgADUCHCAEfkL/////D4MiA0HoAzUCAH58IgI+AhwgACAANQIgIAJCIIh8QewDNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHwAzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB9AM1AgAgA358IgI+AiggACAANQIsIAJCIIh8QfgDNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEH8AzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBgAQ1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QYQENQIAIAN+fCICPgI4QaQGIAJCIIg+AgBBiAYgAEEgaiABEA4LwBwBE34gBSABNQIAIgQgADUCACIOfnwiA0L/////D4MhBSAGIAA1AgQiDyAEfnwgA0IgiHwiA0L/////D4MhBiAHIAA1AggiECAEfnwgA0IgiHwiA0L/////D4MhByAIIAA1AgwiESAEfnwgA0IgiHwiA0L/////D4MhCCAJIAA1AhAiEiAEfnwgA0IgiHwiA0L/////D4MhCSAKIAA1AhQiEyAEfnwgA0IgiHwiA0L/////D4MhCiALIAA1AhgiFCAEfnwgA0IgiHwiA0L/////D4MhCyAMIAA1AhwiFSAEfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwhDCAFIA4gATUCBCIEfnwiA0L/////D4MhBSAGIAQgD358IANCIIh8IgNC/////w+DIQYgByAEIBB+fCADQiCIfCIDQv////8PgyEHIAggBCARfnwgA0IgiHwiA0L/////D4MhCCAJIAQgEn58IANCIIh8IgNC/////w+DIQkgCiAEIBN+fCADQiCIfCIDQv////8PgyEKIAsgBCAUfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFX58IANCIIh8IgNC/////w+DIQwgA0IgiCENIAUgBUKJx5mkDn5C/////w+DIgRCx/rzww1+fEIgiCAGIARClpiC4QN+fHwiA0L/////D4MhBSAHIARCjZXHwwZ+fCADQiCIfCIDQv////8PgyEGIAggBEKR1YW8CX58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IQwgBSAOIAE1AggiBH58IgNC/////w+DIQUgBiAEIA9+fCADQiCIfCIDQv////8PgyEGIAcgBCAQfnwgA0IgiHwiA0L/////D4MhByAIIAQgEX58IANCIIh8IgNC/////w+DIQggCSAEIBJ+fCADQiCIfCIDQv////8PgyEJIAogBCATfnwgA0IgiHwiA0L/////D4MhCiALIAQgFH58IANCIIh8IgNC/////w+DIQsgDCAEIBV+fCADQiCIfCIDQv////8PgyEMIANCIIghDSAFIAVCiceZpA5+Qv////8PgyIEQsf688MNfnxCIIggBiAEQpaYguEDfnx8IgNC/////w+DIQUgByAEQo2Vx8MGfnwgA0IgiHwiA0L/////D4MhBiAIIARCkdWFvAl+fCADQiCIfCIDQv////8PgyEHIAkgBELdsIWMCH58IANCIIh8IgNC/////w+DIQggCiAEQraLwcILfnwgA0IgiHwiA0L/////D4MhCSALIARCqcDGiQ5+fCADQiCIfCIDQv////8PgyEKIAwgBELynJGDA358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIMIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwhDCAFIA4gATUCECIEfnwiA0L/////D4MhBSAGIAQgD358IANCIIh8IgNC/////w+DIQYgByAEIBB+fCADQiCIfCIDQv////8PgyEHIAggBCARfnwgA0IgiHwiA0L/////D4MhCCAJIAQgEn58IANCIIh8IgNC/////w+DIQkgCiAEIBN+fCADQiCIfCIDQv////8PgyEKIAsgBCAUfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFX58IANCIIh8IgNC/////w+DIQwgA0IgiCENIAUgBUKJx5mkDn5C/////w+DIgRCx/rzww1+fEIgiCAGIARClpiC4QN+fHwiA0L/////D4MhBSAHIARCjZXHwwZ+fCADQiCIfCIDQv////8PgyEGIAggBEKR1YW8CX58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IQwgBSAOIAE1AhQiBH58IgNC/////w+DIQUgBiAEIA9+fCADQiCIfCIDQv////8PgyEGIAcgBCAQfnwgA0IgiHwiA0L/////D4MhByAIIAQgEX58IANCIIh8IgNC/////w+DIQggCSAEIBJ+fCADQiCIfCIDQv////8PgyEJIAogBCATfnwgA0IgiHwiA0L/////D4MhCiALIAQgFH58IANCIIh8IgNC/////w+DIQsgDCAEIBV+fCADQiCIfCIDQv////8PgyEMIANCIIghDSAFIAVCiceZpA5+Qv////8PgyIEQsf688MNfnxCIIggBiAEQpaYguEDfnx8IgNC/////w+DIQUgByAEQo2Vx8MGfnwgA0IgiHwiA0L/////D4MhBiAIIARCkdWFvAl+fCADQiCIfCIDQv////8PgyEHIAkgBELdsIWMCH58IANCIIh8IgNC/////w+DIQggCiAEQraLwcILfnwgA0IgiHwiA0L/////D4MhCSALIARCqcDGiQ5+fCADQiCIfCIDQv////8PgyEKIAwgBELynJGDA358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIYIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8PgyEFIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DIQYgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwhDCAFIA4gATUCHCIEfnwiA0L/////D4MhBSAGIAQgD358IANCIIh8IgNC/////w+DIQYgByAEIBB+fCADQiCIfCIDQv////8PgyEHIAggBCARfnwgA0IgiHwiA0L/////D4MhCCAJIAQgEn58IANCIIh8IgNC/////w+DIQkgCiAEIBN+fCADQiCIfCIDQv////8PgyEKIAsgBCAUfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFX58IANCIIh8IgNC/////w+DIQwgA0IgiCENIAIgBSAFQonHmaQOfkL/////D4MiBELH+vPDDX58QiCIIAYgBEKWmILhA358fCIDQv////8Pgz4CACACIAcgBEKNlcfDBn58IANCIIh8IgNC/////w+DPgIEIAIgCCAEQpHVhbwJfnwgA0IgiHwiA0L/////D4M+AgggAiAJIARC3bCFjAh+fCADQiCIfCIDQv////8Pgz4CDCACIAogBEK2i8HCC358IANCIIh8IgNC/////w+DPgIQIAIgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4M+AhQgAiAMIARC8pyRgwN+fCADQiCIfCIDQv////8Pgz4CGCACIA0gA0IgiHw+AhwgAkHoAxAFBEAgAkHoAyACEAcaCwvoHQETfiAIIAA1AgAiDSANfnwiAkL/////D4MhCCAMIAA1AgQiDyANfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhDCADQiCIQgGGIAJCIIh8IAsgADUCCCIQIA1+IgNC/////w+DQgGGfHwiAkL/////D4MhCyADQiCIQgGGIAJCIIh8IAogADUCDCIRIA1+IgNC/////w+DQgGGfHwiAkL/////D4MhCiADQiCIQgGGIAJCIIh8IAkgADUCECISIA1+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAcgADUCFCITIA1+IgNC/////w+DQgGGfHwiAkL/////D4MhByADQiCIQgGGIAJCIIh8IAYgADUCGCIUIA1+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSAANQIcIg1+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgDiACQiCIfCEOIAggCEKJx5mkDn5C/////w+DIgNCx/rzww1+fEIgiCAMIANClpiC4QN+fHwiAkL/////D4MhCCALIANCjZXHwwZ+fCACQiCIfCICQv////8PgyEMIAogA0KR1YW8CX58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAwgDyAPfnwiAkL/////D4MhDCALIA8gEH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAKIA8gEX4iA0L/////D4NCAYZ8fCICQv////8PgyEKIANCIIhCAYYgAkIgiHwgCSAPIBJ+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAcgDyATfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIA8gFH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIA9+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEKJx5mkDn5C/////w+DIgNCx/rzww1+fEIgiCAMIANClpiC4QN+fHwiAkL/////D4MhCCALIANCjZXHwwZ+fCACQiCIfCICQv////8PgyEMIAogA0KR1YW8CX58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAsgECAQfnwiAkL/////D4MhCyAKIBAgEX4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQogA0IgiEIBhiACQiCIfCAJIBAgEn4iA0L/////D4NCAYZ8fCICQv////8PgyEJIANCIIhCAYYgAkIgiHwgByAQIBN+IgNC/////w+DQgGGfHwiAkL/////D4MhByADQiCIQgGGIAJCIIh8IAYgECAUfiIDQv////8Pg0IBhnx8IgJC/////w+DIQYgA0IgiEIBhiACQiCIfCAEIA0gEH4iA0L/////D4NCAYZ8fCICQv////8PgyEEIAUgA0IgiEIBhiACQiCIfHwiAkL/////D4MhBSACQiCIIQ4gCCAIQonHmaQOfkL/////D4MiA0LH+vPDDX58QiCIIAwgA0KWmILhA358fCICQv////8PgyEIIAsgA0KNlcfDBn58IAJCIIh8IgJC/////w+DIQwgCiADQpHVhbwJfnwgAkIgiHwiAkL/////D4MhCyAJIANC3bCFjAh+fCACQiCIfCICQv////8PgyEKIAcgA0K2i8HCC358IAJCIIh8IgJC/////w+DIQkgBiADQqnAxokOfnwgAkIgiHwiAkL/////D4MhByAEIANC8pyRgwN+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCAOIAJCIIh8IQUgCiARIBF+fCICQv////8PgyEKIAkgESASfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAcgESATfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBEgFH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIBF+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEKJx5mkDn5C/////w+DIgNCx/rzww1+fEIgiCAMIANClpiC4QN+fHwiAkL/////D4MhCCALIANCjZXHwwZ+fCACQiCIfCICQv////8PgyEMIAogA0KR1YW8CX58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAkgEiASfnwiAkL/////D4MhCSAHIBIgE34iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBIgFH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIBJ+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEKJx5mkDn5C/////w+DIgNCx/rzww1+fEIgiCAMIANClpiC4QN+fHwiAkL/////D4MhCCALIANCjZXHwwZ+fCACQiCIfCICQv////8PgyEMIAogA0KR1YW8CX58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAcgEyATfnwiAkL/////D4MhByAGIBMgFH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQYgA0IgiEIBhiACQiCIfCAEIA0gE34iA0L/////D4NCAYZ8fCICQv////8PgyEEIAUgA0IgiEIBhiACQiCIfHwiAkL/////D4MhBSACQiCIIQ4gCCAIQonHmaQOfkL/////D4MiA0LH+vPDDX58QiCIIAwgA0KWmILhA358fCICQv////8PgyEIIAsgA0KNlcfDBn58IAJCIIh8IgJC/////w+DIQwgCiADQpHVhbwJfnwgAkIgiHwiAkL/////D4MhCyAJIANC3bCFjAh+fCACQiCIfCICQv////8PgyEKIAcgA0K2i8HCC358IAJCIIh8IgJC/////w+DIQkgBiADQqnAxokOfnwgAkIgiHwiAkL/////D4MhByAEIANC8pyRgwN+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCAOIAJCIIh8IQUgBiAUIBR+fCICQv////8PgyEGIAQgDSAUfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEKJx5mkDn5C/////w+DIgNCx/rzww1+fEIgiCAMIANClpiC4QN+fHwiAkL/////D4MhCCALIANCjZXHwwZ+fCACQiCIfCICQv////8PgyEMIAogA0KR1YW8CX58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAQgDSANfnwiAkL/////D4MhBCAFIAJCIIh8IgJC/////w+DIQUgAkIgiCEOIAEgCCAIQonHmaQOfkL/////D4MiA0LH+vPDDX58QiCIIAwgA0KWmILhA358fCICQv////8Pgz4CACABIAsgA0KNlcfDBn58IAJCIIh8IgJC/////w+DPgIEIAEgCiADQpHVhbwJfnwgAkIgiHwiAkL/////D4M+AgggASAJIANC3bCFjAh+fCACQiCIfCICQv////8Pgz4CDCABIAcgA0K2i8HCC358IAJCIIh8IgJC/////w+DPgIQIAEgBiADQqnAxokOfnwgAkIgiHwiAkL/////D4M+AhQgASAEIANC8pyRgwN+fCACQiCIfCICQv////8Pgz4CGCABIAUgAkIgiHwiAkL/////D4M+AhwgDiACQiCIfKcEQCABQegDIAEQBxoFIAFB6AMQBQRAIAFB6AMgARAHGgsLCwoAIAAgACABEBILCwAgAEGIBCABEBILFQAgAEGIChAAQagKEAFBiAogARARCxEAIABByAoQFkHICkGIBRAFCyMAIAAQAgRAQQAPCyAAQegKEBZB6ApBiAUQBQRAQX8PC0EBCxcAIAAgARAWIAFB6AMgARAMIAEgARAVCwkAQagEIAAQAAu8AQECfyACEAFBICEDA0AgASADTwRAIANBIEYEQEGICxAaBUGIC0GIBEGICxASCyAAQYgLQagLEBIgAkGoCyACEA4gAEEgaiEAIANBIGohAwwBCwsgAUEfcSIERQRADwtBqAsQAUEAIQEDQCABIARGRQRAIAEgAC0AADoAqAsgAEEBaiEAIAFBAWohAQwBCwsgA0EgRgRAQYgLEBoFQYgLQYgEQYgLEBILQagLQYgLQagLEBIgAkGoCyACEA4LHAAgASACQcgLEBtByAtByAsQFSAAQcgLIAMQEgvhAQECf0EAQQAoAgAiBSACQQFqQQV0ajYCACAFEBogBUEgaiEFA0AgAiAGRwRAIAAQAgRAIAVBIGsgBRAABSAAIAVBIGsgBRASCyAAIAFqIQAgBUEgaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQSBrIgUgBRAZA0AgBgRAIAAQAgRAIAUgBUEgaxAAIAIQAQUgBUEga0HoCxAAIAUgACAFQSBrEBIgBUHoCyACEBILIAAgAWshACACIARrIQIgBUEgayEFIAZBAWshBgwBCwtBACAFNgIACy0BAX8DQCABIANGRQRAIAAgAhAVIABBIGohACACQSBqIQIgA0EBaiEDDAELCwstAQF/A0AgASADRkUEQCAAIAIQFiAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLlwIAIAJFBEAgAxAaDwsgAEGIDBAAIAMQGgNAIAJBAWsiAiABai0AACEAIAMgAxATIABBgAFPBEAgA0GIDCADEBIgAEGAAWshAAsgAyADEBMgAEHAAE8EQCADQYgMIAMQEiAAQUBqIQALIAMgAxATIABBIE8EQCADQYgMIAMQEiAAQSBrIQALIAMgAxATIABBEE8EQCADQYgMIAMQEiAAQRBrIQALIAMgAxATIABBCE8EQCADQYgMIAMQEiAAQQhrIQALIAMgAxATIABBBE8EQCADQYgMIAMQEiAAQQRrIQALIAMgAxATIABBAk8EQCADQYgMIAMQEiAAQQJrIQALIAMgAxATIAAEQCADQYgMIAMQEgsgAg0ACwvVAQEBfyAAEAIEQCABEAEPC0EBIQJByAVBqAwQACAAQagFQSBByAwQICAAQegFQSBB6AwQIANAQcgMQagEEARFBEBByAxBiA0QE0EBIQADQEGIDUGoBBAERQRAQYgNQYgNEBMgAEEBaiEADAELC0GoDEGoDRAAIAIgAGtBAWshAgNAIAIEQEGoDUGoDRATIAJBAWshAgwBCwsgACECQagNQagMEBNByAxBqAxByAwQEkHoDEGoDUHoDBASDAELC0HoDBAXBEBB6AwgARAQBUHoDCABEAALCyAAIAAQAgRAQQEPCyAAQegEQSBByA0QIEHIDUGoBBAECwkAIABBqA4QBAssACAAIAEgAhAGBEAgAkHoDSACEAcaBSACQegNEAUEQCACQegNIAIQBxoLCwsXACAAIAEgAhAHBEAgAkHoDSACEAYaCwsLAEHIDiAAIAEQJQu2DwEDfiAAIAA1AgBC/////w4iBCAANQIAfkL/////D4MiA0HoDTUCAH58IgI+AgAgACAANQIEIAJCIIh8QewNNQIAIAN+fCICPgIEIAAgADUCCCACQiCIfEHwDTUCACADfnwiAj4CCCAAIAA1AgwgAkIgiHxB9A01AgAgA358IgI+AgwgACAANQIQIAJCIIh8QfgNNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEH8DTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxBgA41AgAgA358IgI+AhggACAANQIcIAJCIIh8QYQONQIAIAN+fCICPgIcQYgQIAJCIIg+AgAgACAANQIEIAA1AgQgBH5C/////w+DIgNB6A01AgB+fCICPgIEIAAgADUCCCACQiCIfEHsDTUCACADfnwiAj4CCCAAIAA1AgwgAkIgiHxB8A01AgAgA358IgI+AgwgACAANQIQIAJCIIh8QfQNNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEH4DTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB/A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QYAONQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGEDjUCACADfnwiAj4CIEGMECACQiCIPgIAIAAgADUCCCAANQIIIAR+Qv////8PgyIDQegNNQIAfnwiAj4CCCAAIAA1AgwgAkIgiHxB7A01AgAgA358IgI+AgwgACAANQIQIAJCIIh8QfANNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEH0DTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB+A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfwNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEGADjUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBhA41AgAgA358IgI+AiRBkBAgAkIgiD4CACAAIAA1AgwgADUCDCAEfkL/////D4MiA0HoDTUCAH58IgI+AgwgACAANQIQIAJCIIh8QewNNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEHwDTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB9A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfgNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH8DTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxBgA41AgAgA358IgI+AiQgACAANQIoIAJCIIh8QYQONQIAIAN+fCICPgIoQZQQIAJCIIg+AgAgACAANQIQIAA1AhAgBH5C/////w+DIgNB6A01AgB+fCICPgIQIAAgADUCFCACQiCIfEHsDTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB8A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfQNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH4DTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB/A01AgAgA358IgI+AiQgACAANQIoIAJCIIh8QYAONQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGEDjUCACADfnwiAj4CLEGYECACQiCIPgIAIAAgADUCFCAANQIUIAR+Qv////8PgyIDQegNNQIAfnwiAj4CFCAAIAA1AhggAkIgiHxB7A01AgAgA358IgI+AhggACAANQIcIAJCIIh8QfANNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEH0DTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB+A01AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfwNNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEGADjUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBhA41AgAgA358IgI+AjBBnBAgAkIgiD4CACAAIAA1AhggADUCGCAEfkL/////D4MiA0HoDTUCAH58IgI+AhggACAANQIcIAJCIIh8QewNNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEHwDTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB9A01AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfgNNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEH8DTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxBgA41AgAgA358IgI+AjAgACAANQI0IAJCIIh8QYQONQIAIAN+fCICPgI0QaAQIAJCIIg+AgAgACAANQIcIAA1AhwgBH5C/////w+DIgNB6A01AgB+fCICPgIcIAAgADUCICACQiCIfEHsDTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB8A01AgAgA358IgI+AiQgACAANQIoIAJCIIh8QfQNNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEH4DTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB/A01AgAgA358IgI+AjAgACAANQI0IAJCIIh8QYAONQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEGEDjUCACADfnwiAj4COEGkECACQiCIPgIAQYgQIABBIGogARAkC8AcARN+IAUgATUCACIEIAA1AgAiDn58IgNC/////w+DIQUgBiAANQIEIg8gBH58IANCIIh8IgNC/////w+DIQYgByAANQIIIhAgBH58IANCIIh8IgNC/////w+DIQcgCCAANQIMIhEgBH58IANCIIh8IgNC/////w+DIQggCSAANQIQIhIgBH58IANCIIh8IgNC/////w+DIQkgCiAANQIUIhMgBH58IANCIIh8IgNC/////w+DIQogCyAANQIYIhQgBH58IANCIIh8IgNC/////w+DIQsgDCAANQIcIhUgBH58IANCIIh8IgNC/////w+DIQwgA0IgiCENIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IQwgBSAOIAE1AgQiBH58IgNC/////w+DIQUgBiAEIA9+fCADQiCIfCIDQv////8PgyEGIAcgBCAQfnwgA0IgiHwiA0L/////D4MhByAIIAQgEX58IANCIIh8IgNC/////w+DIQggCSAEIBJ+fCADQiCIfCIDQv////8PgyEJIAogBCATfnwgA0IgiHwiA0L/////D4MhCiALIAQgFH58IANCIIh8IgNC/////w+DIQsgDCAEIBV+fCADQiCIfCIDQv////8PgyEMIANCIIghDSAFIAVC/////w5+Qv////8PgyIEQoGAgIAPfnxCIIggBiAEQpPrh58Efnx8IgNC/////w+DIQUgByAEQpHh5c0HfnwgA0IgiHwiA0L/////D4MhBiAIIARCyNDPwQJ+fCADQiCIfCIDQv////8PgyEHIAkgBELdsIWMCH58IANCIIh8IgNC/////w+DIQggCiAEQraLwcILfnwgA0IgiHwiA0L/////D4MhCSALIARCqcDGiQ5+fCADQiCIfCIDQv////8PgyEKIAwgBELynJGDA358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIIIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8OfkL/////D4MiBEKBgICAD358QiCIIAYgBEKT64efBH58fCIDQv////8PgyEFIAcgBEKR4eXNB358IANCIIh8IgNC/////w+DIQYgCCAEQsjQz8ECfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwhDCAFIA4gATUCDCIEfnwiA0L/////D4MhBSAGIAQgD358IANCIIh8IgNC/////w+DIQYgByAEIBB+fCADQiCIfCIDQv////8PgyEHIAggBCARfnwgA0IgiHwiA0L/////D4MhCCAJIAQgEn58IANCIIh8IgNC/////w+DIQkgCiAEIBN+fCADQiCIfCIDQv////8PgyEKIAsgBCAUfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFX58IANCIIh8IgNC/////w+DIQwgA0IgiCENIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IQwgBSAOIAE1AhAiBH58IgNC/////w+DIQUgBiAEIA9+fCADQiCIfCIDQv////8PgyEGIAcgBCAQfnwgA0IgiHwiA0L/////D4MhByAIIAQgEX58IANCIIh8IgNC/////w+DIQggCSAEIBJ+fCADQiCIfCIDQv////8PgyEJIAogBCATfnwgA0IgiHwiA0L/////D4MhCiALIAQgFH58IANCIIh8IgNC/////w+DIQsgDCAEIBV+fCADQiCIfCIDQv////8PgyEMIANCIIghDSAFIAVC/////w5+Qv////8PgyIEQoGAgIAPfnxCIIggBiAEQpPrh58Efnx8IgNC/////w+DIQUgByAEQpHh5c0HfnwgA0IgiHwiA0L/////D4MhBiAIIARCyNDPwQJ+fCADQiCIfCIDQv////8PgyEHIAkgBELdsIWMCH58IANCIIh8IgNC/////w+DIQggCiAEQraLwcILfnwgA0IgiHwiA0L/////D4MhCSALIARCqcDGiQ5+fCADQiCIfCIDQv////8PgyEKIAwgBELynJGDA358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIUIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8OfkL/////D4MiBEKBgICAD358QiCIIAYgBEKT64efBH58fCIDQv////8PgyEFIAcgBEKR4eXNB358IANCIIh8IgNC/////w+DIQYgCCAEQsjQz8ECfnwgA0IgiHwiA0L/////D4MhByAJIARC3bCFjAh+fCADQiCIfCIDQv////8PgyEIIAogBEK2i8HCC358IANCIIh8IgNC/////w+DIQkgCyAEQqnAxokOfnwgA0IgiHwiA0L/////D4MhCiAMIARC8pyRgwN+fCADQiCIfCIDQv////8PgyELIA0gA0IgiHwhDCAFIA4gATUCGCIEfnwiA0L/////D4MhBSAGIAQgD358IANCIIh8IgNC/////w+DIQYgByAEIBB+fCADQiCIfCIDQv////8PgyEHIAggBCARfnwgA0IgiHwiA0L/////D4MhCCAJIAQgEn58IANCIIh8IgNC/////w+DIQkgCiAEIBN+fCADQiCIfCIDQv////8PgyEKIAsgBCAUfnwgA0IgiHwiA0L/////D4MhCyAMIAQgFX58IANCIIh8IgNC/////w+DIQwgA0IgiCENIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4MhBSAHIARCkeHlzQd+fCADQiCIfCIDQv////8PgyEGIAggBELI0M/BAn58IANCIIh8IgNC/////w+DIQcgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4MhCCAKIARCtovBwgt+fCADQiCIfCIDQv////8PgyEJIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DIQogDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4MhCyANIANCIIh8IQwgBSAOIAE1AhwiBH58IgNC/////w+DIQUgBiAEIA9+fCADQiCIfCIDQv////8PgyEGIAcgBCAQfnwgA0IgiHwiA0L/////D4MhByAIIAQgEX58IANCIIh8IgNC/////w+DIQggCSAEIBJ+fCADQiCIfCIDQv////8PgyEJIAogBCATfnwgA0IgiHwiA0L/////D4MhCiALIAQgFH58IANCIIh8IgNC/////w+DIQsgDCAEIBV+fCADQiCIfCIDQv////8PgyEMIANCIIghDSACIAUgBUL/////Dn5C/////w+DIgRCgYCAgA9+fEIgiCAGIARCk+uHnwR+fHwiA0L/////D4M+AgAgAiAHIARCkeHlzQd+fCADQiCIfCIDQv////8Pgz4CBCACIAggBELI0M/BAn58IANCIIh8IgNC/////w+DPgIIIAIgCSAEQt2whYwIfnwgA0IgiHwiA0L/////D4M+AgwgAiAKIARCtovBwgt+fCADQiCIfCIDQv////8Pgz4CECACIAsgBEKpwMaJDn58IANCIIh8IgNC/////w+DPgIUIAIgDCAEQvKckYMDfnwgA0IgiHwiA0L/////D4M+AhggAiANIANCIIh8PgIcIAJB6A0QBQRAIAJB6A0gAhAHGgsL6B0BE34gCCAANQIAIg0gDX58IgJC/////w+DIQggDCAANQIEIg8gDX4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQwgA0IgiEIBhiACQiCIfCALIAA1AggiECANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAKIAA1AgwiESANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQogA0IgiEIBhiACQiCIfCAJIAA1AhAiEiANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAHIAA1AhQiEyANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIAA1AhgiFCANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQYgA0IgiEIBhiACQiCIfCAEIA0gADUCHCINfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIA4gAkIgiHwhDiAIIAhC/////w5+Qv////8PgyIDQoGAgIAPfnxCIIggDCADQpPrh58Efnx8IgJC/////w+DIQggCyADQpHh5c0HfnwgAkIgiHwiAkL/////D4MhDCAKIANCyNDPwQJ+fCACQiCIfCICQv////8PgyELIAkgA0LdsIWMCH58IAJCIIh8IgJC/////w+DIQogByADQraLwcILfnwgAkIgiHwiAkL/////D4MhCSAGIANCqcDGiQ5+fCACQiCIfCICQv////8PgyEHIAQgA0LynJGDA358IAJCIIh8IgJC/////w+DIQYgBSACQiCIfCICQv////8PgyEEIA4gAkIgiHwhBSAMIA8gD358IgJC/////w+DIQwgCyAPIBB+IgNC/////w+DQgGGfCACQiCIfCICQv////8PgyELIANCIIhCAYYgAkIgiHwgCiAPIBF+IgNC/////w+DQgGGfHwiAkL/////D4MhCiADQiCIQgGGIAJCIIh8IAkgDyASfiIDQv////8Pg0IBhnx8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAHIA8gE34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiAPIBR+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSAPfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w5+Qv////8PgyIDQoGAgIAPfnxCIIggDCADQpPrh58Efnx8IgJC/////w+DIQggCyADQpHh5c0HfnwgAkIgiHwiAkL/////D4MhDCAKIANCyNDPwQJ+fCACQiCIfCICQv////8PgyELIAkgA0LdsIWMCH58IAJCIIh8IgJC/////w+DIQogByADQraLwcILfnwgAkIgiHwiAkL/////D4MhCSAGIANCqcDGiQ5+fCACQiCIfCICQv////8PgyEHIAQgA0LynJGDA358IAJCIIh8IgJC/////w+DIQYgBSACQiCIfCICQv////8PgyEEIA4gAkIgiHwhBSALIBAgEH58IgJC/////w+DIQsgCiAQIBF+IgNC/////w+DQgGGfCACQiCIfCICQv////8PgyEKIANCIIhCAYYgAkIgiHwgCSAQIBJ+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAcgECATfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBAgFH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIBB+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEL/////Dn5C/////w+DIgNCgYCAgA9+fEIgiCAMIANCk+uHnwR+fHwiAkL/////D4MhCCALIANCkeHlzQd+fCACQiCIfCICQv////8PgyEMIAogA0LI0M/BAn58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAogESARfnwiAkL/////D4MhCiAJIBEgEn4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAHIBEgE34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiARIBR+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w5+Qv////8PgyIDQoGAgIAPfnxCIIggDCADQpPrh58Efnx8IgJC/////w+DIQggCyADQpHh5c0HfnwgAkIgiHwiAkL/////D4MhDCAKIANCyNDPwQJ+fCACQiCIfCICQv////8PgyELIAkgA0LdsIWMCH58IAJCIIh8IgJC/////w+DIQogByADQraLwcILfnwgAkIgiHwiAkL/////D4MhCSAGIANCqcDGiQ5+fCACQiCIfCICQv////8PgyEHIAQgA0LynJGDA358IAJCIIh8IgJC/////w+DIQYgBSACQiCIfCICQv////8PgyEEIA4gAkIgiHwhBSAJIBIgEn58IgJC/////w+DIQkgByASIBN+IgNC/////w+DQgGGfCACQiCIfCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiASIBR+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSASfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w5+Qv////8PgyIDQoGAgIAPfnxCIIggDCADQpPrh58Efnx8IgJC/////w+DIQggCyADQpHh5c0HfnwgAkIgiHwiAkL/////D4MhDCAKIANCyNDPwQJ+fCACQiCIfCICQv////8PgyELIAkgA0LdsIWMCH58IAJCIIh8IgJC/////w+DIQogByADQraLwcILfnwgAkIgiHwiAkL/////D4MhCSAGIANCqcDGiQ5+fCACQiCIfCICQv////8PgyEHIAQgA0LynJGDA358IAJCIIh8IgJC/////w+DIQYgBSACQiCIfCICQv////8PgyEEIA4gAkIgiHwhBSAHIBMgE358IgJC/////w+DIQcgBiATIBR+IgNC/////w+DQgGGfCACQiCIfCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIBN+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEL/////Dn5C/////w+DIgNCgYCAgA9+fEIgiCAMIANCk+uHnwR+fHwiAkL/////D4MhCCALIANCkeHlzQd+fCACQiCIfCICQv////8PgyEMIAogA0LI0M/BAn58IAJCIIh8IgJC/////w+DIQsgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4MhCiAHIANCtovBwgt+fCACQiCIfCICQv////8PgyEJIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DIQcgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAYgFCAUfnwiAkL/////D4MhBiAEIA0gFH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w5+Qv////8PgyIDQoGAgIAPfnxCIIggDCADQpPrh58Efnx8IgJC/////w+DIQggCyADQpHh5c0HfnwgAkIgiHwiAkL/////D4MhDCAKIANCyNDPwQJ+fCACQiCIfCICQv////8PgyELIAkgA0LdsIWMCH58IAJCIIh8IgJC/////w+DIQogByADQraLwcILfnwgAkIgiHwiAkL/////D4MhCSAGIANCqcDGiQ5+fCACQiCIfCICQv////8PgyEHIAQgA0LynJGDA358IAJCIIh8IgJC/////w+DIQYgBSACQiCIfCICQv////8PgyEEIA4gAkIgiHwhBSAEIA0gDX58IgJC/////w+DIQQgBSACQiCIfCICQv////8PgyEFIAJCIIghDiABIAggCEL/////Dn5C/////w+DIgNCgYCAgA9+fEIgiCAMIANCk+uHnwR+fHwiAkL/////D4M+AgAgASALIANCkeHlzQd+fCACQiCIfCICQv////8Pgz4CBCABIAogA0LI0M/BAn58IAJCIIh8IgJC/////w+DPgIIIAEgCSADQt2whYwIfnwgAkIgiHwiAkL/////D4M+AgwgASAHIANCtovBwgt+fCACQiCIfCICQv////8Pgz4CECABIAYgA0KpwMaJDn58IAJCIIh8IgJC/////w+DPgIUIAEgBCADQvKckYMDfnwgAkIgiHwiAkL/////D4M+AhggASAFIAJCIIh8IgJC/////w+DPgIcIA4gAkIgiHynBEAgAUHoDSABEAcaBSABQegNEAUEQCABQegNIAEQBxoLCwsKACAAIAAgARAoCwsAIABBiA4gARAoCxUAIABBiBQQAEGoFBABQYgUIAEQJwsRACAAQcgUECxByBRBiA8QBQsjACAAEAIEQEEADwsgAEHoFBAsQegUQYgPEAUEQEF/DwtBAQsXACAAIAEQLCABQegNIAEQDCABIAEQKwsJAEGoDiAAEAALvAEBAn8gAhABQSAhAwNAIAEgA08EQCADQSBGBEBBiBUQMAVBiBVBiA5BiBUQKAsgAEGIFUGoFRAoIAJBqBUgAhAkIABBIGohACADQSBqIQMMAQsLIAFBH3EiBEUEQA8LQagVEAFBACEBA0AgASAERkUEQCABIAAtAAA6AKgVIABBAWohACABQQFqIQEMAQsLIANBIEYEQEGIFRAwBUGIFUGIDkGIFRAoC0GoFUGIFUGoFRAoIAJBqBUgAhAkCxwAIAEgAkHIFRAxQcgVQcgVECsgAEHIFSADECgL4QEBAn9BAEEAKAIAIgUgAkEBakEFdGo2AgAgBRAwIAVBIGohBQNAIAIgBkcEQCAAEAIEQCAFQSBrIAUQAAUgACAFQSBrIAUQKAsgACABaiEAIAVBIGohBSAGQQFqIQYMAQsLIAAgAWshACADIAJBAWsgBGxqIQIgBUEgayIFIAUQLwNAIAYEQCAAEAIEQCAFIAVBIGsQACACEAEFIAVBIGtB6BUQACAFIAAgBUEgaxAoIAVB6BUgAhAoCyAAIAFrIQAgAiAEayECIAVBIGshBSAGQQFrIQYMAQsLQQAgBTYCAAstAQF/A0AgASADRkUEQCAAIAIQKyAAQSBqIQAgAkEgaiECIANBAWohAwwBCwsLLQEBfwNAIAEgA0ZFBEAgACACECwgAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLC5cCACACRQRAIAMQMA8LIABBiBYQACADEDADQCACQQFrIgIgAWotAAAhACADIAMQKSAAQYABTwRAIANBiBYgAxAoIABBgAFrIQALIAMgAxApIABBwABPBEAgA0GIFiADECggAEFAaiEACyADIAMQKSAAQSBPBEAgA0GIFiADECggAEEgayEACyADIAMQKSAAQRBPBEAgA0GIFiADECggAEEQayEACyADIAMQKSAAQQhPBEAgA0GIFiADECggAEEIayEACyADIAMQKSAAQQRPBEAgA0GIFiADECggAEEEayEACyADIAMQKSAAQQJPBEAgA0GIFiADECggAEECayEACyADIAMQKSAABEAgA0GIFiADECgLIAINAAsL1QEBAX8gABACBEAgARABDwtBHCECQcgPQagWEAAgAEGoD0EgQcgWEDYgAEHoD0EgQegWEDYDQEHIFkGoDhAERQRAQcgWQYgXEClBASEAA0BBiBdBqA4QBEUEQEGIF0GIFxApIABBAWohAAwBCwtBqBZBqBcQACACIABrQQFrIQIDQCACBEBBqBdBqBcQKSACQQFrIQIMAQsLIAAhAkGoF0GoFhApQcgWQagWQcgWEChB6BZBqBdB6BYQKAwBCwtB6BYQLQRAQegWIAEQJgVB6BYgARAACwsgACAAEAIEQEEBDwsgAEHoDkEgQcgXEDZByBdBqA4QBAsVACAAIAFB6BcQKEHoF0GIDiACECgLCgAgACAAIAEQOQsLACAAQegNIAEQDAsJACAAQYgPEAULDgAgABACIABBIGoQAnELCQAgAEFAaxACCw0AIAAQASAAQSBqEAELFAAgABABIABBIGoQGiAAQUBrEAELUgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOAt6ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWAsnACAAED0EQCABEEAFIAFBQGsQGiAAQSBqIAFBIGoQACAAIAEQAAsLFQAgACABEAQgAEEgaiABQSBqEARxC3EBAX8gABA+BEAgARA9DwsgARA9BEBBAA8LIABBQGsiAhANBEAgACABEEQPCyACQagYEBMgAUGoGEHIGBASIAJBqBhB6BgQEiABQSBqQegYQYgZEBIgAEHIGBAEBEAgAEEgakGIGRAEBEBBAQ8LC0EAC6sBAQJ/IAAQPgRAIAEQPg8LIAEQPgRAQQAPCyAAQUBrIgIQDQRAIAEgABBFDwsgAUFAayIDEA0EQCAAIAEQRQ8LIAJBqBkQEyADQcgZEBMgAEHIGUHoGRASIAFBqBlBiBoQEiACQagZQagaEBIgA0HIGUHIGhASIABBIGpByBpB6BoQEiABQSBqQagaQYgbEBJB6BlBiBoQBARAQegaQYgbEAQEQEEBDwsLQQAL5wEAIAAQPQRAIAAgARBDDwsgAEGoGxATIABBIGpByBsQE0HIG0HoGxATIABByBtBiBwQDkGIHEGIHBATQYgcQagbQYgcEA9BiBxB6BtBiBwQD0GIHEGIHEGIHBAOQagbQagbQagcEA5BqBxBqBtBqBwQDiAAQSBqIABBIGogAUFAaxAOQagcIAEQEyABQYgcIAEQDyABQYgcIAEQD0HoG0HoG0HIHBAOQcgcQcgcQcgcEA5ByBxByBxByBwQDkGIHCABIAFBIGoQDyABQSBqQagcIAFBIGoQEiABQSBqQcgcIAFBIGoQDwuFAgAgABA+BEAgACABEEIPCyAAQUBrEA0EQCAAIAEQRw8LIABB6BwQEyAAQSBqQYgdEBNBiB1BqB0QEyAAQYgdQcgdEA5ByB1ByB0QE0HIHUHoHEHIHRAPQcgdQagdQcgdEA9ByB1ByB1ByB0QDkHoHEHoHEHoHRAOQegdQegcQegdEA5B6B1BiB4QEyAAQSBqIABBQGtBqB4QEkHIHUHIHSABEA5BiB4gASABEA9BqB1BqB1ByB4QDkHIHkHIHkHIHhAOQcgeQcgeQcgeEA5ByB0gASABQSBqEA8gAUEgakHoHSABQSBqEBIgAUEgakHIHiABQSBqEA9BqB5BqB4gAUFAaxAOC5YCACAAED0EQCABIAIQQSACQUBrEBoPCyABED0EQCAAIAIQQSACQUBrEBoPCyAAIAEQBARAIABBIGogAUEgahAEBEAgASACEEcPCwsgASAAQegeEA8gAUEgaiAAQSBqQagfEA9B6B5BiB8QE0GIH0GIH0HIHxAOQcgfQcgfQcgfEA5B6B5ByB9B6B8QEkGoH0GoH0GIIBAOIABByB9ByCAQEkGIIEGoIBATQcggQcggQeggEA5BqCBB6B8gAhAPIAJB6CAgAhAPIABBIGpB6B9BiCEQEkGIIUGIIUGIIRAOQcggIAIgAkEgahAPIAJBIGpBiCAgAkEgahASIAJBIGpBiCEgAkEgahAPQegeQegeIAJBQGsQDgv1AgEBfyAAED4EQCABIAIQQSACQUBrEBoPCyABED0EQCAAIAIQQg8LIABBQGsiAxANBEAgACABIAIQSQ8LIANBqCEQEyABQaghQcghEBIgA0GoIUHoIRASIAFBIGpB6CFBiCIQEiAAQcghEAQEQCAAQSBqQYgiEAQEQCABIAIQRw8LC0HIISAAQagiEA9BiCIgAEEgakHoIhAPQagiQcgiEBNByCJByCJBiCMQDkGII0GII0GIIxAOQagiQYgjQagjEBJB6CJB6CJByCMQDiAAQYgjQYgkEBJByCNB6CMQE0GIJEGIJEGoJBAOQegjQagjIAIQDyACQagkIAIQDyAAQSBqQagjQcgkEBJByCRByCRByCQQDkGIJCACIAJBIGoQDyACQSBqQcgjIAJBIGoQEiACQSBqQcgkIAJBIGoQDyADQagiIAJBQGsQDiACQUBrIAJBQGsQEyACQUBrQaghIAJBQGsQDyACQUBrQcgiIAJBQGsQDwurAwECfyAAED4EQCABIAIQQg8LIAEQPgRAIAAgAhBCDwsgAEFAayIDEA0EQCABIAAgAhBKDwsgAUFAayIEEA0EQCAAIAEgAhBKDwsgA0HoJBATIARBiCUQEyAAQYglQaglEBIgAUHoJEHIJRASIANB6CRB6CUQEiAEQYglQYgmEBIgAEEgakGIJkGoJhASIAFBIGpB6CVByCYQEkGoJUHIJRAEBEBBqCZByCYQBARAIAAgAhBIDwsLQcglQaglQegmEA9ByCZBqCZBiCcQD0HoJkHoJkGoJxAOQagnQagnEBNB6CZBqCdByCcQEkGIJ0GIJ0HoJxAOQaglQagnQagoEBJB6CdBiCgQE0GoKEGoKEHIKBAOQYgoQcgnIAIQDyACQcgoIAIQD0GoJkHIJ0HoKBASQegoQegoQegoEA5BqCggAiACQSBqEA8gAkEgakHoJyACQSBqEBIgAkEgakHoKCACQSBqEA8gAyAEIAJBQGsQDiACQUBrIAJBQGsQEyACQUBrQegkIAJBQGsQDyACQUBrQYglIAJBQGsQDyACQUBrQegmIAJBQGsQEgsUACAAIAEQACAAQSBqIAFBIGoQEAsgACAAIAEQACAAQSBqIAFBIGoQECAAQUBrIAFBQGsQAAsSACABQYgpEEwgAEGIKSACEEkLEgAgAUHoKRBMIABB6CkgAhBKCxIAIAFByCoQTSAAQcgqIAIQSwsUACAAIAEQFiAAQSBqIAFBIGoQFgsgACAAIAEQFiAAQSBqIAFBIGoQFiAAQUBrIAFBQGsQFgsUACAAIAEQFSAAQSBqIAFBIGoQFQsgACAAIAEQFSAAQSBqIAFBIGoQFSAAQUBrIAFBQGsQFQtKACAAED4EQCABEAEgAUEgahABBSAAQUBrQagrEBlBqCtByCsQE0GoK0HIK0HoKxASIABByCsgARASIABBIGpB6CsgAUEgahASCwswACAAQSBqQYgsEBMgAEGoLBATIABBqCxBqCwQEkGoLEGIGEGoLBAOQYgsQagsEAQLDgAgAEHILBBVQcgsEFYLlAEBA39BAEEAKAIAIgQgAUEFdGo2AgAgAEFAa0HgACABIARBIBAdIAQhAwNAIAEgBUcEQCADEAIEQCACEAEgAkEgahABBSADIABBIGpBiC0QEiADIAMQEyADIAAgAhASIANBiC0gAkEgahASCyAAQeAAaiEAIAJBQGshAiADQSBqIQMgBUEBaiEFDAELC0EAIAQ2AgALSgAgABA+BEAgARBABSAAQUBrQagtEBlBqC1ByC0QE0GoLUHILUHoLRASIABByC0gARASIABBIGpB6C0gAUEgahASIAFBQGsQGgsLMgAgASACakEBayEBA0AgASACSEUEQCABIAAtAAA6AAAgAUEBayEBIABBAWohAAwBCwsLKgAgABA9BEAgARA/DwsgAEGILhBRQYguQSAgARBaQaguQSAgAUEgahBaC0EAIAAQPQRAIAEQASABQcAAOgAADwsgAEHILhAWQcguQSAgARBaIABBIGoQGEF/RgRAIAEgAS0AAEGAAXI6AAALCy8AIAAtAABBwABxBEAgARA/DwsgAEEgQeguEFogAEEgakEgQYgvEFpB6C4gARBTC64BAQJ/IAAtAAAiAkHAAHEEQCABED8PCyACQYABcSEDIABByC8QAEHILyACQT9xOgAAQcgvQSBBqC8QWkGoLyABEBUgAUHILxATIAFByC9ByC8QEkHIL0GIGEHILxAOQcgvQcgvECFByC9BqC8QEEHILxAYQX9GBEAgAwRAQcgvIAFBIGoQAAVByC8gAUEgahAQCwUg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fyAAQYABayEACyADIAMQgQEgAEHAAE8EQCADQcjcACADEH8gAEFAaiEACyADIAMQgQEgAEEgTwRAIANByNwAIAMQfyAAQSBrIQALIAMgAxCBASAAQRBPBEAgA0HI3AAgAxB/IABBEGshAAsgAyADEIEBIABBCE8EQCADQcjcACADEH8gAEEIayEACyADIAMQgQEgAEEETwRAIANByNwAIAMQfyAAQQRrIQALIAMgAxCBASAAQQJPBEAgA0HI3AAgAxB/IABBAmshAAsgAyADEIEBIAAEQCADQcjcACADEH8LIAINAAsLwwEAQYjfABB9QYjfAEGI3wAQhAEgAEGI3QBBIEHI3QAQigFByN0AQYjeABCBASAAQYjeAEGI3gAQf0GI3gBByN4AEExByN4AQYjeAEHI3gAQf0HI3gBBiN8AEEQEQAALQcjdACAAQcjfABB/QYjeAEGI3wAQRARAQYjfABABQajfABAaQYjfAEHI3wAgARB/BUGI4AAQfUGI4ABBiN4AQYjgABCCAUGI4ABBqN0AQSBBiOAAEIoBQYjgAEHI3wAgARB/CwtjAEGo4gAQfUGo4gBBqOIAEIQBIABByOAAQSBB6OAAEIoBQejgAEGo4QAQgQEgAEGo4QBBqOEAEH9BqOEAQejhABBMQejhAEGo4QBB6OEAEH9B6OEAQajiABBEBEBBAA8LQQELDgAgABA9IABBQGsQPXELCgAgAEGAAWoQPQsNACAAED8gAEFAaxA/CxUAIAAQPyAAQUBrEH0gAEGAAWoQPwuiAQAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4C4ICACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEg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gAFqIAFBgAFqEIMBQYiLAiABQYABaiABQYABahCCAUHIigIgAUGAAWogAUGAAWoQggELMgAgACABIAIQggEgAEFAayABQUBrIAJBQGsQggEgAEGAAWogAUGAAWogAkGAAWoQggELMgAgACABIAIQgwEgAEFAayABQUBrIAJBQGsQgwEgAEGAAWogAUGAAWogAkGAAWoQgwELJQAgACABEIQBIABBQGsgAUFAaxCEASAAQYABaiABQYABahCEAQsqAQF/IABBgAFqEIcBIgEEQCABDwsgAEFAaxCHASIBBEAgAQ8LIAAQhwELJAAgACABEEQgAEFAayABQUBrEERxIABBgAFqIAFBgAFqEERxC50CACAAQYiNAhCBASAAQUBrQciNAhCBASAAQYABakGIjgIQgQEgACAAQUBrQciOAhB/IAAgAEGAAWpBiI8CEH8gAEFAayAAQYABakHIjwIQf0HIjwJBiJACENYBQYiNAkGIkAJBiJACEIMBQYiOAkHIkAIQ1gFByJACQciOAkHIkAIQgwFByI0CQYiPAkGIkQIQgwEgAEGAAWpByJACQciRAhB/IABBQGtBiJECQYiSAhB/QciRAkGIkgJByJECEIIBQciRAkHIkQIQ1gEgAEGIkAJBiJICEH9BiJICQciRAkHIkQIQggFByJECQciRAhCFAUHIkQJBiJACIAEQf0HIkQJByJACIAFBQGsQf0HIkQJBiJECIAFBgAFqEH8LMQAgACABIAIgAxCGASAAQUBrIAEgAiADQUBrEIYBIABBgAFqIAEgAiADQYABahCGAQspACAAQYABahA9BEAgACAAQUBrIABBQGsQPRsQiAEPCyAAQYABahCIAQv4AQECf0EAQQAoAgAiBSACQQFqQcABbGo2AgAgBRDaASAFQcABaiEFA0AgAiAGRwRAIAAQ1wEEQCAFQcABayAFENsBBSAAIAVBwAFrIAUQ3AELIAAgAWohACAFQcABaiEFIAZBAWohBgwBCwsgACABayEAIAMgAkEBayAEbGohAiAFQcABayIFIAUQ4wEDQCAGBEAgABDXAQRAIAUgBUHAAWsQ2wEgAhDZAQUgBUHAAWtByJICENsBIAUgACAFQcABaxDcASAFQciSAiACENwBCyAAIAFrIQAgAiAEayECIAVBwAFrIQUgBkEBayEGDAELC0EAIAU2AgALswIAIAJFBEAgAxDaAQ8LIABBiJQCENsBIAMQ2gEDQCACQQFrIgIgAWotAAAhACADIAMQ3QEgAEGAAU8EQCADQYiUAiADENwBIABBgAFrIQALIAMgAxDdASAAQcAATwRAIANBiJQCIAMQ3AEgAEFAaiEACyADIAMQ3QEgAEEgTwRAIANBiJQCIAMQ3AEgAEEgayEACyADIAMQ3QEgAEEQTwRAIANBiJQCIAMQ3AEgAEEQayEACyADIAMQ3QEgAEEITwRAIANBiJQCIAMQ3AEgAEEIayEACyADIAMQ3QEgAEEETwRAIANBiJQCIAMQ3AEgAEEEayEACyADIAMQ3QEgAEECTwRAIANBiJQCIAMQ3AEgAEECayEACyADIAMQ3QEgAARAIANBiJQCIAMQ3AELIAINAAsLJgBByIECIABBgAFqIAEQfyAAIAFBQGsQfiAAQUBrIAFBgAFqEH4LEQAgABDXASAAQcABahDXAXELEQAgABDYASAAQcABahDXAXELEAAgABDZASAAQcABahDZAQsQACAAENoBIABBwAFqENkBCxgAIAAgARDbASAAQcABaiABQcABahDbAQuFAQAgACABQciVAhDcASAAQcABaiABQcABakGIlwIQ3AEgACAAQcABakHImAIQ3gEgASABQcABakGImgIQ3gFByJgCQYiaAkHImAIQ3AFBiJcCIAIQ6AFByJUCIAIgAhDeAUHIlQJBiJcCIAJBwAFqEN4BQciYAiACQcABaiACQcABahDfAQscACAAIAEgAhDcASAAQcABaiABIAJBwAFqENwBC30AIAAgAEHAAWpByJsCENwBIAAgAEHAAWpBiJ0CEN4BIABBwAFqQcieAhDoASAAQcieAkHIngIQ3gFByJsCQYigAhDoAUGIoAJByJsCQYigAhDeAUGInQJByJ4CIAEQ3AEgAUGIoAIgARDfAUHImwJByJsCIAFBwAFqEN4BCyAAIAAgASACEN4BIABBwAFqIAFBwAFqIAJBwAFqEN4BCyAAIAAgASACEN8BIABBwAFqIAFBwAFqIAJBwAFqEN8BCxgAIAAgARDgASAAQcABaiABQcABahDgAQsYACAAIAEQ2wEgAEHAAWogAUHAAWoQ4AELGAAgACABEKQBIABBwAFqIAFBwAFqEKQBCxgAIAAgARCiASAAQcABaiABQcABahCiAQsZACAAIAEQ4gEgAEHAAWogAUHAAWoQ4gFxC2oAIABByKECEN0BIABBwAFqQYijAhDdAUGIowJByKQCEOgBQcihAkHIpAJByKQCEN8BQcikAkGIpgIQ4wEgAEGIpgIgARDcASAAQcABakGIpgIgAUHAAWoQ3AEgAUHAAWogAUHAAWoQ4AELIAAgACABIAIgAxDkASAAQcABaiABIAIgA0HAAWoQ5AELGgEBfyAAQcABahDhASIBBEAgAQ8LIAAQ4QELHQAgAEHAAWoQ1wEEQCAAEOUBDwsgAEHAAWoQ5QEL+AEBAn9BAEEAKAIAIgUgAkEBakGAA2xqNgIAIAUQ7AEgBUGAA2ohBQNAIAIgBkcEQCAAEOkBBEAgBUGAA2sgBRDtAQUgACAFQYADayAFEO4BCyAAIAFqIQAgBUGAA2ohBSAGQQFqIQYMAQsLIAAgAWshACADIAJBAWsgBGxqIQIgBUGAA2siBSAFEPgBA0AgBgRAIAAQ6QEEQCAFIAVBgANrEO0BIAIQ6wEFIAVBgANrQcinAhDtASAFIAAgBUGAA2sQ7gEgBUHIpwIgAhDuAQsgACABayEAIAIgBGshAiAFQYADayEFIAZBAWshBgwBCwtBACAFNgIAC7MCACACRQRAIAMQ7AEPCyAAQciqAhDtASADEOwBA0AgAkEBayICIAFqLQAAIQAgAyADEPABIABBgAFPBEAgA0HIqgIgAxDuASAAQYABayEACyADIAMQ8AEgAEHAAE8EQCADQciqAiADEO4BIABBQGohAAsgAyADEPABIABBIE8EQCADQciqAiADEO4BIABBIGshAAsgAyADEPABIABBEE8EQCADQciqAiADEO4BIABBEGshAAsgAyADEPABIABBCE8EQCADQciqAiADEO4BIABBCGshAAsgAyADEPABIABBBE8EQCADQciqAiADEO4BIABBBGshAAsgAyADEPABIABBAk8EQCADQciqAiADEO4BIABBAmshAAsgAyADEPABIAAEQCADQciqAiADEO4BCyACDQALC9EBAEHIuQIQ7AFByLkCQci5AhDzASAAQcitAkHAAUHIsAIQ/QFByLACQcizAhDwASAAQcizAkHIswIQ7gFByLMCQci2AhD0AUHItgJByLMCQci2AhDuAUHItgJByLkCEPcBBEAAC0HIsAIgAEHIvAIQ7gFByLMC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ECABQYABakGQjwQgAUGAAWoQfyAAQcABaiABQcABahAAIABB4AFqIAFB4AFqEBAgAUHAAWpB0I8EIAFBwAFqEH8gAEGAAmogAUGAAmoQACAAQaACaiABQaACahAQIAFBgAJqQZCQBCABQYACahB/IABBwAJqIAFBwAJqEAAgAEHgAmogAUHgAmoQECABQcACakHQkAQgAUHAAmoQfwtkACAAQZCRBCABEH8gAEFAa0HQkQQgAUFAaxB/IABBgAFqQZCSBCABQYABahB/IABBwAFqQdCSBCABQcABahB/IABBgAJqQZCTBCABQYACahB/IABBwAJqQdCTBCABQcACahB/C4ACACAAIAEQACAAQSBqIAFBIGoQECABQZCUBCABEH8gAEFAayABQUBrEAAgAEHgAGogAUHgAGoQECABQUBrQdCUBCABQUBrEH8gAEGAAWogAUGAAWoQACAAQaABaiABQaABahAQIAFBgAFqQZCVBCABQYABahB/IABBwAFqIAFBwAFqEAAgAEHgAWogAUHgAWoQECABQcABakHQlQQgAUHAAWoQfyAAQYACaiABQYACahAAIABBoAJqIAFBoAJqEBAgAUGAAmpBkJYEIAFBgAJqEH8gAEHAAmogAUHAAmoQACAAQeACaiABQeACahAQIAFBwAJqQdCWBCABQcACahB/C2QAIABBkJcEIAEQfyAAQUBrQdCXBCABQUBrEH8gAEGAAWpBkJgEIAFBgAFqEH8gAEHAAWpB0JgEIAFBwAFqEH8gAEGAAmpBkJkEIAFBgAJqEH8gAEHAAmpB0JkEIAFBwAJqEH8LgAIAIAAgARAAIABBIGogAUEgahAQIAFBkJoEIAEQfyAAQUBrIAFBQGsQACAAQeAAaiABQeAAahAQIAFBQGtB0JoEIAFBQGsQfyAAQYABaiABQYABahAAIABBoAFqIAFBoAFqEBAgAUGAAWpBkJsEIAFBgAFqEH8gAEHAAWogAUHAAWoQACAAQeABaiABQeABahAQIAFBwAFqQdCbBCABQcABahB/IABBgAJqIAFBgAJqEAAgAEGgAmogAUGgAmoQECABQYACakGQnAQgAUGAAmoQfyAAQcACaiABQcACahAAIABB4AJqIAFB4AJqEBAgAUHAAmpB0JwEIAFBwAJqEH8LZAAgAEGQnQQgARB/IABBQGtB0J0EIAFB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";
var pG1b$1 = 3080;
var pG1gen$1 = 32008;
var pG1zero$1 = 32104;
var pG2b$1 = 12648;
var pG2gen$1 = 32200;
var pG2zero$1 = 32392;
var pOneT$1 = 32584;
var preQSize$1 = 19776;
var q$1 = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
var r$1 = "21888242871839275222246405745257275088548364400416034343698204186575808495617";
//#endregion
//#region src/wasm/msm_batch_wasm.js
var code$1 = "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";
//#endregion
//#region src/wasm/base64.js
var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var LOOKUP;
function decodePureJs(b64) {
	if (!LOOKUP) {
		LOOKUP = /* @__PURE__ */ new Uint8Array(256);
		for (let i = 0; i < 64; i++) LOOKUP[CHARS.charCodeAt(i)] = i;
	}
	const len = b64.length;
	let pad = 0;
	if (len > 0 && b64[len - 1] === "=") pad++;
	if (len > 1 && b64[len - 2] === "=") pad++;
	const outLen = (len * 3 >> 2) - pad;
	const out = new Uint8Array(outLen);
	let o = 0;
	for (let i = 0; i < len; i += 4) {
		const a = LOOKUP[b64.charCodeAt(i)];
		const b = LOOKUP[b64.charCodeAt(i + 1)];
		const c = LOOKUP[b64.charCodeAt(i + 2)];
		const d = LOOKUP[b64.charCodeAt(i + 3)];
		if (o < outLen) out[o++] = a << 2 | b >> 4;
		if (o < outLen) out[o++] = (b & 15) << 4 | c >> 2;
		if (o < outLen) out[o++] = (c & 3) << 6 | d;
	}
	return out;
}
function base64ToUint8Array(b64) {
	if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") return new Uint8Array(Buffer.from(b64, "base64"));
	if (typeof atob === "function") {
		const bin = atob(b64);
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
		return out;
	}
	return decodePureJs(b64);
}
//#endregion
//#region src/bn128.js
var curve_bn128 = null;
async function buildBn128(singleThread, plugins) {
	if (!singleThread && curve_bn128) return curve_bn128;
	let bn128wasm = {};
	if (!plugins) {
		bn128wasm.code = base64ToUint8Array(code$2);
		bn128wasm.pq = 488;
		bn128wasm.pr = 488;
		bn128wasm.pG1gen = pG1gen$1;
		bn128wasm.pG1zero = pG1zero$1;
		bn128wasm.pG1b = pG1b$1;
		bn128wasm.pG2gen = pG2gen$1;
		bn128wasm.pG2zero = pG2zero$1;
		bn128wasm.pG2b = pG2b$1;
		bn128wasm.pOneT = pOneT$1;
		bn128wasm.prePSize = 192;
		bn128wasm.preQSize = preQSize$1;
		bn128wasm.n8q = 32;
		bn128wasm.n8r = 32;
		bn128wasm.q = q$1;
		bn128wasm.r = r$1;
	} else {
		const { ModuleBuilder } = await import("wasmbuilder");
		const { buildBn128: buildBn128wasm } = await import("wasmcurves");
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
	bn128wasm.batchCode = base64ToUint8Array(code$1);
	bn128wasm.glv = true;
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
	curve.terminate = async function() {
		if (!params.singleThread) {
			curve_bn128 = null;
			await this.tm.terminate();
		}
	};
	if (!singleThread) curve_bn128 = curve;
	return curve;
}
//#endregion
//#region src/wasm/bls12381_wasm.js
var code = "AGFzbQEAAAABjwERYAJ/fwBgA39/fwBgAX8Bf2AEf39/fwBgBX9/f39/AGABfwBgAn9/AX9gBn9/f39/fwBgA39/fwF/YAh/f39/f39/fwBgAn9+AGAEf39/fwF/YAp/f39/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIPAQNlbnYGbWVtb3J5AgAZA68CrQIABQIFBgYICAEAAAoDAQIBAQAAAQAAAAACAgAFAQMEAQEDAAIABQIFBgYICAEAAAMBAgEBAAABAAAAAAICAAUBAwQBAQMAAgEAAAICAgUFAAAABgYGAAABAQEAAAEBAQAAAAAAAgIBAAEAAAAAAQEBAQELBwkECQQDAwADAgAABAcHAQEHAAMMBAMCBQABAQABAQAAAwICBAMAAgICBQUAAAAGBgYAAAEBAQAAAQEBAAAAAAACAgEAAAAAAAEBAQEBCQQJBAMDAQADAAAEBwcBAQcBAAMAAAQHBwEBBwEBBAQEBAQAAgIFBQABAAEBAAIGAAMCBAMAAgIFBQABAQABAQAAAAAGAAMCAgQDAAIBAwQBAAAAAAAAAAAAAAICAgIAAAEAAAAACA0ODxABB74nvQIJaW50cV9jb3B5AAAJaW50cV96ZXJvAAEIaW50cV9vbmUAAwtpbnRxX2lzWmVybwACB2ludHFfZXEABAhpbnRxX2d0ZQAFCGludHFfYWRkAAYIaW50cV9zdWIABwhpbnRxX211bAAIC2ludHFfc3F1YXJlAAkOaW50cV9zcXVhcmVPbGQACghpbnRxX2RpdgAMD2ludHFfaW52ZXJzZU1vZAANCGYxbV9jb3B5AAAIZjFtX3plcm8AAQpmMW1faXNaZXJvAAIGZjFtX2VxAAQHZjFtX2FkZAAPB2YxbV9zdWIAEAdmMW1fbmVnABEOZjFtX2lzTmVnYXRpdmUAGAlmMW1faXNPbmUADghmMW1fc2lnbgAZC2YxbV9tUmVkdWN0ABIHZjFtX211bAATCmYxbV9zcXVhcmUAFA1mMW1fc3F1YXJlT2xkABUSZjFtX2Zyb21Nb250Z29tZXJ5ABcQZjFtX3RvTW9udGdvbWVyeQAWC2YxbV9pbnZlcnNlABoHZjFtX29uZQAbCGYxbV9sb2FkABwPZjFtX3RpbWVzU2NhbGFyAB0HZjFtX2V4cAAhEGYxbV9iYXRjaEludmVyc2UAHghmMW1fc3FydAAiDGYxbV9pc1NxdWFyZQAjFWYxbV9iYXRjaFRvTW9udGdvbWVyeQAfF2YxbV9iYXRjaEZyb21Nb250Z29tZXJ5ACAJaW50cl9jb3B5ACQJaW50cl96ZXJvACUIaW50cl9vbmUAJwtpbnRyX2lzWmVybwAmB2ludHJfZXEAKAhpbnRyX2d0ZQApCGludHJfYWRkACoIaW50cl9zdWIAKwhpbnRyX211bAAsC2ludHJfc3F1YXJlAC0OaW50cl9zcXVhcmVPbGQALghpbnRyX2RpdgAvD2ludHJfaW52ZXJzZU1vZAAwCGZybV9jb3B5ACQIZnJtX3plcm8AJQpmcm1faXNaZXJvACYGZnJtX2VxACgHZnJtX2FkZAAyB2ZybV9zdWIAMwdmcm1fbmVnADQOZnJtX2lzTmVnYXRpdmUAOwlmcm1faXNPbmUAMQhmcm1fc2lnbgA8C2ZybV9tUmVkdWN0ADUHZnJtX211bAA2CmZybV9zcXVhcmUANw1mcm1fc3F1YXJlT2xkADgSZnJtX2Zyb21Nb250Z29tZXJ5ADoQZnJtX3RvTW9udGdvbWVyeQA5C2ZybV9pbnZlcnNlAD0HZnJtX29uZQA+CGZybV9sb2FkAD8PZnJtX3RpbWVzU2NhbGFyAEAHZnJtX2V4cABEEGZybV9iYXRjaEludmVyc2UAQQhmcm1fc3FydABFDGZybV9pc1NxdWFyZQBGFWZybV9iYXRjaFRvTW9udGdvbWVyeQBCF2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5AEMGZnJfYWRkADIGZnJfc3ViADMGZnJfbmVnADQGZnJfbXVsAEcJZnJfc3F1YXJlAEgKZnJfaW52ZXJzZQBJDWZyX2lzTmVnYXRpdmUASgdmcl9jb3B5ACQHZnJfemVybwAlBmZyX29uZQA+CWZyX2lzWmVybwAmBWZyX2VxACgMZzFtX211bHRpZXhwAHUSZzFtX211bHRpZXhwX2NodW5rAHQSZzFtX211bHRpZXhwQWZmaW5lAHcYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAHYKZzFtX2lzWmVybwBMEGcxbV9pc1plcm9BZmZpbmUASwZnMW1fZXEAVAtnMW1fZXFNaXhlZABTDGcxbV9lcUFmZmluZQBSCGcxbV9jb3B5AFAOZzFtX2NvcHlBZmZpbmUATwhnMW1femVybwBODmcxbV96ZXJvQWZmaW5lAE0KZzFtX2RvdWJsZQBWEGcxbV9kb3VibGVBZmZpbmUAVQdnMW1fYWRkAFkMZzFtX2FkZE1peGVkAFgNZzFtX2FkZEFmZmluZQBXB2cxbV9uZWcAWw1nMW1fbmVnQWZmaW5lAFoHZzFtX3N1YgBeDGcxbV9zdWJNaXhlZABdDWcxbV9zdWJBZmZpbmUAXBJnMW1fZnJvbU1vbnRnb21lcnkAYBhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUAXxBnMW1fdG9Nb250Z29tZXJ5AGIWZzFtX3RvTW9udGdvbWVyeUFmZmluZQBhD2cxbV90aW1lc1NjYWxhcgB4FWcxbV90aW1lc1NjYWxhckFmZmluZQB5DWcxbV9ub3JtYWxpemUAZwpnMW1fTEVNdG9VAGkKZzFtX0xFTXRvQwBqCmcxbV9VdG9MRU0AawpnMW1fQ3RvTEVNAGwPZzFtX2JhdGNoTEVNdG9VAG0PZzFtX2JhdGNoTEVNdG9DAG4PZzFtX2JhdGNoVXRvTEVNAG8PZzFtX2JhdGNoQ3RvTEVNAHAMZzFtX3RvQWZmaW5lAGMOZzFtX3RvSmFjb2JpYW4AURFnMW1fYmF0Y2hUb0FmZmluZQBmE2cxbV9iYXRjaFRvSmFjb2JpYW4AcQtnMW1faW5DdXJ2ZQBlEWcxbV9pbkN1cnZlQWZmaW5lAGQXZnJtX19yZXZlcnNlUGVybXV0YXRpb24Aegdmcm1fZmZ0AH0IZnJtX2lmZnQAfgpmcm1fcmF3ZmZ0AHsLZnJtX2ZmdEpvaW4Afw5mcm1fZmZ0Sm9pbkV4dACAARFmcm1fZmZ0Sm9pbkV4dEludgCBAQpmcm1fZmZ0TWl4AIIBDGZybV9mZnRGaW5hbACDAR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgCEAQhwb2xfemVybwCFAQ9wb2xfY29uc3RydWN0TEMAhgEMcWFwX2J1aWxkQUJDAIcBC3FhcF9qb2luQUJDAIgBDHFhcF9iYXRjaEFkZACJAQpmMm1faXNaZXJvAEsJZjJtX2lzT25lAIoBCGYybV96ZXJvAE0HZjJtX29uZQCLAQhmMm1fY29weQCMAQdmMm1fbXVsAI0BCGYybV9tdWwxAI4BCmYybV9zcXVhcmUAjwEHZjJtX2FkZACQAQdmMm1fc3ViAJEBB2YybV9uZWcAkgEIZjJtX3NpZ24AlQENZjJtX2Nvbmp1Z2F0ZQBaEmYybV9mcm9tTW9udGdvbWVyeQBfEGYybV90b01vbnRnb21lcnkAYQZmMm1fZXEAUgtmMm1faW52ZXJzZQCTAQdmMm1fZXhwAJgBD2YybV90aW1lc1NjYWxhcgCUARBmMm1fYmF0Y2hJbnZlcnNlAJcBCGYybV9zcXJ0AJkBDGYybV9pc1NxdWFyZQCaAQ5mMm1faXNOZWdhdGl2ZQCWAQxnMm1fbXVsdGlleHAAwgESZzJtX211bHRpZXhwX2NodW5rAMEBEmcybV9tdWx0aWV4cEFmZmluZQDEARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsAwwEKZzJtX2lzWmVybwCcARBnMm1faXNaZXJvQWZmaW5lAJsBBmcybV9lcQCkAQtnMm1fZXFNaXhlZACjAQxnMm1fZXFBZmZpbmUAogEIZzJtX2NvcHkAoAEOZzJtX2NvcHlBZmZpbmUAnwEIZzJtX3plcm8AngEOZzJtX3plcm9BZmZpbmUAnQEKZzJtX2RvdWJsZQCmARBnMm1fZG91YmxlQWZmaW5lAKUBB2cybV9hZGQAqQEMZzJtX2FkZE1peGVkAKgBDWcybV9hZGRBZmZpbmUApwEHZzJtX25lZwCrAQ1nMm1fbmVnQWZmaW5lAKoBB2cybV9zdWIArgEMZzJtX3N1Yk1peGVkAK0BDWcybV9zdWJBZmZpbmUArAESZzJtX2Zyb21Nb250Z29tZXJ5ALABGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQCvARBnMm1fdG9Nb250Z29tZXJ5ALIBFmcybV90b01vbnRnb21lcnlBZmZpbmUAsQEPZzJtX3RpbWVzU2NhbGFyAMUBFWcybV90aW1lc1NjYWxhckFmZmluZQDGAQ1nMm1fbm9ybWFsaXplALcBCmcybV9MRU10b1UAuAEKZzJtX0xFTXRvQwC5AQpnMm1fVXRvTEVNALoBCmcybV9DdG9MRU0AuwEPZzJtX2JhdGNoTEVNdG9VALwBD2cybV9iYXRjaExFTXRvQwC9AQ9nMm1fYmF0Y2hVdG9MRU0AvgEPZzJtX2JhdGNoQ3RvTEVNAL8BDGcybV90b0FmZmluZQCzAQ5nMm1fdG9KYWNvYmlhbgChARFnMm1fYmF0Y2hUb0FmZmluZQC2ARNnMm1fYmF0Y2hUb0phY29iaWFuAMABC2cybV9pbkN1cnZlALUBEWcybV9pbkN1cnZlQWZmaW5lALQBC2cxbV90aW1lc0ZyAMcBF2cxbV9fcmV2ZXJzZVBlcm11dGF0aW9uAMgBB2cxbV9mZnQAygEIZzFtX2lmZnQAywEKZzFtX3Jhd2ZmdADJAQtnMW1fZmZ0Sm9pbgDMAQ5nMW1fZmZ0Sm9pbkV4dADNARFnMW1fZmZ0Sm9pbkV4dEludgDOAQpnMW1fZmZ0TWl4AM8BDGcxbV9mZnRGaW5hbADQAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDRAQtnMm1fdGltZXNGcgDSARdnMm1fX3JldmVyc2VQZXJtdXRhdGlvbgDTAQdnMm1fZmZ0ANUBCGcybV9pZmZ0ANYBCmcybV9yYXdmZnQA1AELZzJtX2ZmdEpvaW4A1wEOZzJtX2ZmdEpvaW5FeHQA2AERZzJtX2ZmdEpvaW5FeHRJbnYA2QEKZzJtX2ZmdE1peADaAQxnMm1fZmZ0RmluYWwA2wEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A3AERZzFtX3RpbWVzRnJBZmZpbmUA3QERZzJtX3RpbWVzRnJBZmZpbmUA3gERZnJtX2JhdGNoQXBwbHlLZXkA3wERZzFtX2JhdGNoQXBwbHlLZXkA4AEWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZADhARFnMm1fYmF0Y2hBcHBseUtleQDiARZnMm1fYmF0Y2hBcHBseUtleU1peGVkAOMBCmY2bV9pc1plcm8A5QEJZjZtX2lzT25lAOYBCGY2bV96ZXJvAOcBB2Y2bV9vbmUA6AEIZjZtX2NvcHkA6QEHZjZtX211bADqAQpmNm1fc3F1YXJlAOsBB2Y2bV9hZGQA7AEHZjZtX3N1YgDtAQdmNm1fbmVnAO4BCGY2bV9zaWduAO8BEmY2bV9mcm9tTW9udGdvbWVyeQCwARBmNm1fdG9Nb250Z29tZXJ5ALIBBmY2bV9lcQDwAQtmNm1faW52ZXJzZQDxAQdmNm1fZXhwAPUBD2Y2bV90aW1lc1NjYWxhcgDyARBmNm1fYmF0Y2hJbnZlcnNlAPQBDmY2bV9pc05lZ2F0aXZlAPMBCmZ0bV9pc1plcm8A9wEJZnRtX2lzT25lAPgBCGZ0bV96ZXJvAPkBB2Z0bV9vbmUA+gEIZnRtX2NvcHkA+wEHZnRtX211bAD8AQhmdG1fbXVsMQD9AQpmdG1fc3F1YXJlAP4BB2Z0bV9hZGQA/wEHZnRtX3N1YgCAAgdmdG1fbmVnAIECCGZ0bV9zaWduAIgCDWZ0bV9jb25qdWdhdGUAggISZnRtX2Zyb21Nb250Z29tZXJ5AIQCEGZ0bV90b01vbnRnb21lcnkAgwIGZnRtX2VxAIUCC2Z0bV9pbnZlcnNlAIYCB2Z0bV9leHAAiwIPZnRtX3RpbWVzU2NhbGFyAIcCEGZ0bV9iYXRjaEludmVyc2UAigIIZnRtX3NxcnQAjAIMZnRtX2lzU3F1YXJlAI0CDmZ0bV9pc05lZ2F0aXZlAIkCEWZ0bV9mcm9iZW5pdXNNYXAwAJICEWZ0bV9mcm9iZW5pdXNNYXAxAJMCEWZ0bV9mcm9iZW5pdXNNYXAyAJQCEWZ0bV9mcm9iZW5pdXNNYXAzAJUCEWZ0bV9mcm9iZW5pdXNNYXA0AJYCEWZ0bV9mcm9iZW5pdXNNYXA1AJcCEWZ0bV9mcm9iZW5pdXNNYXA2AJgCEWZ0bV9mcm9iZW5pdXNNYXA3AJkCEWZ0bV9mcm9iZW5pdXNNYXA4AJoCEWZ0bV9mcm9iZW5pdXNNYXA5AJsCE2JsczEyMzgxX3BhaXJpbmdFcTEApwITYmxzMTIzODFfcGFpcmluZ0VxMgCoAhNibHMxMjM4MV9wYWlyaW5nRXEzAKkCE2JsczEyMzgxX3BhaXJpbmdFcTQAqgITYmxzMTIzODFfcGFpcmluZ0VxNQCrAhBibHMxMjM4MV9wYWlyaW5nAKwCEmJsczEyMzgxX3ByZXBhcmVHMQCgAhJibHMxMjM4MV9wcmVwYXJlRzIAoQITYmxzMTIzODFfbWlsbGVyTG9vcACiAhxibHMxMjM4MV9maW5hbEV4cG9uZW50aWF0aW9uAKYCH2JsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAowIaYmxzMTIzODFfX2N5Y2xvdG9taWNTcXVhcmUApAIaYmxzMTIzODFfX2N5Y2xvdG9taWNFeHBfdzAApQIIZjZtX211bDEAjgIJZjZtX211bDAxAI8CCmZ0bV9tdWwwMTQAkAIRZzFtX2luR3JvdXBBZmZpbmUAnAILZzFtX2luR3JvdXAAnQIRZzJtX2luR3JvdXBBZmZpbmUAngILZzJtX2luR3JvdXAAnwIK7dgErQI+ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKAssACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxggAEIANwMgIABCADcDKAtEACAAKQMoUAR+IAApAyBQBH4gACkDGFAEfiAAKQMQUAR+IAApAwhQBH4gACkDAAVCAQsFQgELBUIBCwVCAQsFQgELUAssACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxggAEIANwMgIABCADcDKAtiACAAKQMoIAEpAyhRBH8gACkDICABKQMgUQR/IAApAxggASkDGFEEfyAAKQMQIAEpAxBRBH8gACkDCCABKQMIUQR/IAApAwAgASkDAFEFQQALBUEACwVBAAsFQQALBUEACwu3AQAgACkDKCABKQMoVAR/QQAFIAApAyggASkDKFYEf0EBBSAAKQMgIAEpAyBUBH9BAAUgACkDICABKQMgVgR/QQEFIAApAxggASkDGFQEf0EABSAAKQMYIAEpAxhWBH9BAQUgACkDECABKQMQVAR/QQAFIAApAxAgASkDEFYEf0EBBSAAKQMIIAEpAwhUBH9BAAUgACkDCCABKQMIVgR/QQEFIAApAwAgASkDAFoLCwsLCwsLCwsLC6QCAQF+IAIgADUCACABNQIAfCIDPgIAIAIgADUCBCABNQIEfCADQiCIfCIDPgIEIAIgADUCCCABNQIIfCADQiCIfCIDPgIIIAIgADUCDCABNQIMfCADQiCIfCIDPgIMIAIgADUCECABNQIQfCADQiCIfCIDPgIQIAIgADUCFCABNQIUfCADQiCIfCIDPgIUIAIgADUCGCABNQIYfCADQiCIfCIDPgIYIAIgADUCHCABNQIcfCADQiCIfCIDPgIcIAIgADUCICABNQIgfCADQiCIfCIDPgIgIAIgADUCJCABNQIkfCADQiCIfCIDPgIkIAIgADUCKCABNQIofCADQiCIfCIDPgIoIAIgADUCLCABNQIsfCADQiCIfCIDPgIsIANCIIinC/gCAQF+IAIgADUCACABNQIAfSIDQv////8Pgz4CACACIAA1AgQgATUCBH0gA0Igh3wiA0L/////D4M+AgQgAiAANQIIIAE1Agh9IANCIId8IgNC/////w+DPgIIIAIgADUCDCABNQIMfSADQiCHfCIDQv////8Pgz4CDCACIAA1AhAgATUCEH0gA0Igh3wiA0L/////D4M+AhAgAiAANQIUIAE1AhR9IANCIId8IgNC/////w+DPgIUIAIgADUCGCABNQIYfSADQiCHfCIDQv////8Pgz4CGCACIAA1AhwgATUCHH0gA0Igh3wiA0L/////D4M+AhwgAiAANQIgIAE1AiB9IANCIId8IgNC/////w+DPgIgIAIgADUCJCABNQIkfSADQiCHfCIDQv////8Pgz4CJCACIAA1AiggATUCKH0gA0Igh3wiA0L/////D4M+AiggAiAANQIsIAE1Aix9IANCIId8IgNC/////w+DPgIsIANCIIenC84fARl+IAQgADUCACIFIAE1AgAiBn4gA0L/////D4N8IgNCIIh8IQQgAiADPgIAIARCIIghAyADIAUgATUCBCIHfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AgQiCCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AgQgA0IgiCEEIAQgBSABNQIIIgl+IANC/////w+DfCIDQiCIfCEEIAQgByAIfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AggiCiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AgggBEIgiCEDIAMgBSABNQIMIgt+IARC/////w+DfCIEQiCIfCEDIAMgCCAJfiAEQv////8Pg3wiBEIgiHwhAyADIAcgCn4gBEL/////D4N8IgRCIIh8IQMgAyAANQIMIgwgBn4gBEL/////D4N8IgRCIIh8IQMgAiAEPgIMIANCIIghBCAEIAUgATUCECINfiADQv////8Pg3wiA0IgiHwhBCAEIAggC34gA0L/////D4N8IgNCIIh8IQQgBCAJIAp+IANC/////w+DfCIDQiCIfCEEIAQgByAMfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AhAiDiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AhAgBEIgiCEDIAMgBSABNQIUIg9+IARC/////w+DfCIEQiCIfCEDIAMgCCANfiAEQv////8Pg3wiBEIgiHwhAyADIAogC34gBEL/////D4N8IgRCIIh8IQMgAyAJIAx+IARC/////w+DfCIEQiCIfCEDIAMgByAOfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AhQiECAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AhQgA0IgiCEEIAQgBSABNQIYIhF+IANC/////w+DfCIDQiCIfCEEIAQgCCAPfiADQv////8Pg3wiA0IgiHwhBCAEIAogDX4gA0L/////D4N8IgNCIIh8IQQgBCALIAx+IANC/////w+DfCIDQiCIfCEEIAQgCSAOfiADQv////8Pg3wiA0IgiHwhBCAEIAcgEH4gA0L/////D4N8IgNCIIh8IQQgBCAANQIYIhIgBn4gA0L/////D4N8IgNCIIh8IQQgAiADPgIYIARCIIghAyADIAUgATUCHCITfiAEQv////8Pg3wiBEIgiHwhAyADIAggEX4gBEL/////D4N8IgRCIIh8IQMgAyAKIA9+IARC/////w+DfCIEQiCIfCEDIAMgDCANfiAEQv////8Pg3wiBEIgiHwhAyADIAsgDn4gBEL/////D4N8IgRCIIh8IQMgAyAJIBB+IARC/////w+DfCIEQiCIfCEDIAMgByASfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AhwiFCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AhwgA0IgiCEEIAQgBSABNQIgIhV+IANC/////w+DfCIDQiCIfCEEIAQgCCATfiADQv////8Pg3wiA0IgiHwhBCAEIAogEX4gA0L/////D4N8IgNCIIh8IQQgBCAMIA9+IANC/////w+DfCIDQiCIfCEEIAQgDSAOfiADQv////8Pg3wiA0IgiHwhBCAEIAsgEH4gA0L/////D4N8IgNCIIh8IQQgBCAJIBJ+IANC/////w+DfCIDQiCIfCEEIAQgByAUfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AiAiFiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AiAgBEIgiCEDIAMgBSABNQIkIhd+IARC/////w+DfCIEQiCIfCEDIAMgCCAVfiAEQv////8Pg3wiBEIgiHwhAyADIAogE34gBEL/////D4N8IgRCIIh8IQMgAyAMIBF+IARC/////w+DfCIEQiCIfCEDIAMgDiAPfiAEQv////8Pg3wiBEIgiHwhAyADIA0gEH4gBEL/////D4N8IgRCIIh8IQMgAyALIBJ+IARC/////w+DfCIEQiCIfCEDIAMgCSAUfiAEQv////8Pg3wiBEIgiHwhAyADIAcgFn4gBEL/////D4N8IgRCIIh8IQMgAyAANQIkIhggBn4gBEL/////D4N8IgRCIIh8IQMgAiAEPgIkIANCIIghBCAEIAUgATUCKCIZfiADQv////8Pg3wiA0IgiHwhBCAEIAggF34gA0L/////D4N8IgNCIIh8IQQgBCAKIBV+IANC/////w+DfCIDQiCIfCEEIAQgDCATfiADQv////8Pg3wiA0IgiHwhBCAEIA4gEX4gA0L/////D4N8IgNCIIh8IQQgBCAPIBB+IANC/////w+DfCIDQiCIfCEEIAQgDSASfiADQv////8Pg3wiA0IgiHwhBCAEIAsgFH4gA0L/////D4N8IgNCIIh8IQQgBCAJIBZ+IANC/////w+DfCIDQiCIfCEEIAQgByAYfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AigiGiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AiggBEIgiCEDIAMgBSABNQIsIht+IARC/////w+DfCIEQiCIfCEDIAMgCCAZfiAEQv////8Pg3wiBEIgiHwhAyADIAogF34gBEL/////D4N8IgRCIIh8IQMgAyAMIBV+IARC/////w+DfCIEQiCIfCEDIAMgDiATfiAEQv////8Pg3wiBEIgiHwhAyADIBAgEX4gBEL/////D4N8IgRCIIh8IQMgAyAPIBJ+IARC/////w+DfCIEQiCIfCEDIAMgDSAUfiAEQv////8Pg3wiBEIgiHwhAyADIAsgFn4gBEL/////D4N8IgRCIIh8IQMgAyAJIBh+IARC/////w+DfCIEQiCIfCEDIAMgByAafiAEQv////8Pg3wiBEIgiHwhAyADIAA1AiwiBSAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AiwgA0IgiCEEIAQgCCAbfiADQv////8Pg3wiA0IgiHwhBCAEIAogGX4gA0L/////D4N8IgNCIIh8IQQgBCAMIBd+IANC/////w+DfCIDQiCIfCEEIAQgDiAVfiADQv////8Pg3wiA0IgiHwhBCAEIBAgE34gA0L/////D4N8IgNCIIh8IQQgBCARIBJ+IANC/////w+DfCIDQiCIfCEEIAQgDyAUfiADQv////8Pg3wiA0IgiHwhBCAEIA0gFn4gA0L/////D4N8IgNCIIh8IQQgBCALIBh+IANC/////w+DfCIDQiCIfCEEIAQgCSAafiADQv////8Pg3wiA0IgiHwhBCAEIAUgB34gA0L/////D4N8IgNCIIh8IQQgAiADPgIwIARCIIghAyADIAogG34gBEL/////D4N8IgRCIIh8IQMgAyAMIBl+IARC/////w+DfCIEQiCIfCEDIAMgDiAXfiAEQv////8Pg3wiBEIgiHwhAyADIBAgFX4gBEL/////D4N8IgRCIIh8IQMgAyASIBN+IARC/////w+DfCIEQiCIfCEDIAMgESAUfiAEQv////8Pg3wiBEIgiHwhAyADIA8gFn4gBEL/////D4N8IgRCIIh8IQMgAyANIBh+IARC/////w+DfCIEQiCIfCEDIAMgCyAafiAEQv////8Pg3wiBEIgiHwhAyADIAUgCX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgI0IANCIIghBCAEIAwgG34gA0L/////D4N8IgNCIIh8IQQgBCAOIBl+IANC/////w+DfCIDQiCIfCEEIAQgECAXfiADQv////8Pg3wiA0IgiHwhBCAEIBIgFX4gA0L/////D4N8IgNCIIh8IQQgBCATIBR+IANC/////w+DfCIDQiCIfCEEIAQgESAWfiADQv////8Pg3wiA0IgiHwhBCAEIA8gGH4gA0L/////D4N8IgNCIIh8IQQgBCANIBp+IANC/////w+DfCIDQiCIfCEEIAQgBSALfiADQv////8Pg3wiA0IgiHwhBCACIAM+AjggBEIgiCEDIAMgDiAbfiAEQv////8Pg3wiBEIgiHwhAyADIBAgGX4gBEL/////D4N8IgRCIIh8IQMgAyASIBd+IARC/////w+DfCIEQiCIfCEDIAMgFCAVfiAEQv////8Pg3wiBEIgiHwhAyADIBMgFn4gBEL/////D4N8IgRCIIh8IQMgAyARIBh+IARC/////w+DfCIEQiCIfCEDIAMgDyAafiAEQv////8Pg3wiBEIgiHwhAyADIAUgDX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgI8IANCIIghBCAEIBAgG34gA0L/////D4N8IgNCIIh8IQQgBCASIBl+IANC/////w+DfCIDQiCIfCEEIAQgFCAXfiADQv////8Pg3wiA0IgiHwhBCAEIBUgFn4gA0L/////D4N8IgNCIIh8IQQgBCATIBh+IANC/////w+DfCIDQiCIfCEEIAQgESAafiADQv////8Pg3wiA0IgiHwhBCAEIAUgD34gA0L/////D4N8IgNCIIh8IQQgAiADPgJAIARCIIghAyADIBIgG34gBEL/////D4N8IgRCIIh8IQMgAyAUIBl+IARC/////w+DfCIEQiCIfCEDIAMgFiAXfiAEQv////8Pg3wiBEIgiHwhAyADIBUgGH4gBEL/////D4N8IgRCIIh8IQMgAyATIBp+IARC/////w+DfCIEQiCIfCEDIAMgBSARfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AkQgA0IgiCEEIAQgFCAbfiADQv////8Pg3wiA0IgiHwhBCAEIBYgGX4gA0L/////D4N8IgNCIIh8IQQgBCAXIBh+IANC/////w+DfCIDQiCIfCEEIAQgFSAafiADQv////8Pg3wiA0IgiHwhBCAEIAUgE34gA0L/////D4N8IgNCIIh8IQQgAiADPgJIIARCIIghAyADIBYgG34gBEL/////D4N8IgRCIIh8IQMgAyAYIBl+IARC/////w+DfCIEQiCIfCEDIAMgFyAafiAEQv////8Pg3wiBEIgiHwhAyADIAUgFX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgJMIANCIIghBCAEIBggG34gA0L/////D4N8IgNCIIh8IQQgBCAZIBp+IANC/////w+DfCIDQiCIfCEEIAQgBSAXfiADQv////8Pg3wiA0IgiHwhBCACIAM+AlAgBEIgiCEDIAMgGiAbfiAEQv////8Pg3wiBEIgiHwhAyADIAUgGX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgJUIANCIIghBCAEIAUgG34gA0L/////D4N8IgNCIIh8IQQgAiADPgJYIAIgBD4CXAu8GQEQfiADIAA1AgAiBiAGfiACQv////8Pg3wiAkIgiHwhAyABIAI+AgAgAyIEQiCIIQUgADUCBCIHIAZ+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CBCADIgRCIIghBSAANQIIIgggBn4iAkIgiEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgByAHfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CCCADIgRCIIghBSAANQIMIgkgBn4iAkIgiCEDIAMgByAIfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CDCADIgRCIIghBSAANQIQIgogBn4iAkIgiCEDIAMgByAJfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAggCH4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhAgAyIEQiCIIQUgADUCFCILIAZ+IgJCIIghAyADIAcgCn4gAkL/////D4N8IgJCIIh8IQMgAyAIIAl+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIUIAMiBEIgiCEFIAA1AhgiDCAGfiICQiCIIQMgAyAHIAt+IAJC/////w+DfCICQiCIfCEDIAMgCCAKfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAkgCX4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhggAyIEQiCIIQUgADUCHCINIAZ+IgJCIIghAyADIAcgDH4gAkL/////D4N8IgJCIIh8IQMgAyAIIAt+IAJC/////w+DfCICQiCIfCEDIAMgCSAKfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CHCADIgRCIIghBSAANQIgIg4gBn4iAkIgiCEDIAMgByANfiACQv////8Pg3wiAkIgiHwhAyADIAggDH4gAkL/////D4N8IgJCIIh8IQMgAyAJIAt+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgCiAKfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CICADIgRCIIghBSAANQIkIg8gBn4iAkIgiCEDIAMgByAOfiACQv////8Pg3wiAkIgiHwhAyADIAggDX4gAkL/////D4N8IgJCIIh8IQMgAyAJIAx+IAJC/////w+DfCICQiCIfCEDIAMgCiALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CJCADIgRCIIghBSAANQIoIhAgBn4iAkIgiCEDIAMgByAPfiACQv////8Pg3wiAkIgiHwhAyADIAggDn4gAkL/////D4N8IgJCIIh8IQMgAyAJIA1+IAJC/////w+DfCICQiCIfCEDIAMgCiAMfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAsgC34gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiggAyIEQiCIIQUgADUCLCIRIAZ+IgJCIIghAyADIAcgEH4gAkL/////D4N8IgJCIIh8IQMgAyAIIA9+IAJC/////w+DfCICQiCIfCEDIAMgCSAOfiACQv////8Pg3wiAkIgiHwhAyADIAogDX4gAkL/////D4N8IgJCIIh8IQMgAyALIAx+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIsIAMiBEIgiCEFIAcgEX4iAkIgiCEDIAMgCCAQfiACQv////8Pg3wiAkIgiHwhAyADIAkgD34gAkL/////D4N8IgJCIIh8IQMgAyAKIA5+IAJC/////w+DfCICQiCIfCEDIAMgCyANfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAwgDH4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjAgAyIEQiCIIQUgCCARfiICQiCIIQMgAyAJIBB+IAJC/////w+DfCICQiCIfCEDIAMgCiAPfiACQv////8Pg3wiAkIgiHwhAyADIAsgDn4gAkL/////D4N8IgJCIIh8IQMgAyAMIA1+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgI0IAMiBEIgiCEFIAkgEX4iAkIgiCEDIAMgCiAQfiACQv////8Pg3wiAkIgiHwhAyADIAsgD34gAkL/////D4N8IgJCIIh8IQMgAyAMIA5+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgDSANfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4COCADIgRCIIghBSAKIBF+IgJCIIghAyADIAsgEH4gAkL/////D4N8IgJCIIh8IQMgAyAMIA9+IAJC/////w+DfCICQiCIfCEDIAMgDSAOfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CPCADIgRCIIghBSALIBF+IgJCIIghAyADIAwgEH4gAkL/////D4N8IgJCIIh8IQMgAyANIA9+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgDiAOfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CQCADIgRCIIghBSAMIBF+IgJCIIghAyADIA0gEH4gAkL/////D4N8IgJCIIh8IQMgAyAOIA9+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgJEIAMiBEIgiCEFIA0gEX4iAkIgiCEDIAMgDiAQfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIA8gD34gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AkggAyIEQiCIIQUgDiARfiICQiCIIQMgAyAPIBB+IAJC/////w+DfCICQiCIfEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgJMIAMiBEIgiCEFIA8gEX4iAkIgiEIBhiACQv////8Pg0IBhiICQiCIfCEDIAMgECAQfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CUCADIgRCIIghBSAQIBF+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CVCADIgRCIIghBUIAIQJCACEDIAMgESARfiACQv////8Pg3wiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CWCABIAM+AlwLCgAgACAAIAEQCAtBACAAIAA1AAAgAXwiAT4AACABQiCIIQEDQCABUEUEQCAAQQRqIgA1AAAgAXwhASAAIAE+AAAgAUIgiCEBDAELCwuEBAIDfgF/IAAgA0GIASADGyIDEAAgAUEoEAAgAkHYACACGyIHEAFBuAEQAUEvIQBBLyEBA0AgAUEoai0AACABQQNGckUEQCABQQFrIQEMAQsLIAFBJWo1AABCAXwiBkIBUQRAQgBCAIAaCwNAAkADQCAAIANqLQAAIABBB0ZyRQRAIABBAWshAAwBCwsgACADakEHaykAACAGgCEFIAAgAWtBBGshAgNAIAVCgICAgHCDUCACQQBOcUUEQCAFQgiIIQUgAkEBaiECDAELCyAFUARAIANBKBAFRQ0BQgEhBUEAIQILQegBQSg1AAAgBX4iBD4AAEHsAUEsNQAAIAV+IARCIIh8IgQ+AABB8AFBMDUAACAFfiAEQiCIfCIEPgAAQfQBQTQ1AAAgBX4gBEIgiHwiBD4AAEH4AUE4NQAAIAV+IARCIIh8IgQ+AABB/AFBPDUAACAFfiAEQiCIfCIEPgAAQYACQcAANQAAIAV+IARCIIh8IgQ+AABBhAJBxAA1AAAgBX4gBEIgiHwiBD4AAEGIAkHIADUAACAFfiAEQiCIfCIEPgAAQYwCQcwANQAAIAV+IARCIIh8IgQ+AABBkAJB0AA1AAAgBX4gBEIgiHwiBD4AAEGUAkHUADUAACAFfiAEQiCIfD4AACADQegBIAJrIAMQBxogAiAHaiAFEAsMAQsLC44CAQp/QZgCIQNBmAIQAUHIAiEIIAFByAIQAEH4AiEJQfgCEANBqAMhBiAAQagDEABB2AMhC0GIBCEKQZgFIQQDQCAGEAJFBEAgCCAGIAsgChAMIAsgCUG4BBAIIAcEfyAFBH9BuAQgAxAFBH9BuAQgAyAEEAcaQQAFIANBuAQgBBAHGkEBCwVBuAQgAyAEEAYaQQELBSAFBH9BuAQgAyAEEAYaQQAFIANBuAQQBQR/IANBuAQgBBAHGkEABUG4BCADIAQQBxpBAQsLCyEMIAMhACAJIQMgBCEJIAAhBCAFIQcgDCEFIAghACAGIQggCiEGIAAhCgwBCwsgBwRAIAEgAyACEAcaBSADIAIQAAsLCQAgAEGoBhAECywAIAAgASACEAYEQCACQcgFIAIQBxoFIAJByAUQBQRAIAJByAUgAhAHGgsLCxcAIAAgASACEAcEQCACQcgFIAIQBhoLCwsAQdgGIAAgARAQC8YhAQN+IAAgADUCAEL9//P/DyIEIAA1AgB+Qv////8PgyIDQcgFNQIAfnwiAj4CACAAIAA1AgQgAkIgiHxBzAU1AgAgA358IgI+AgQgACAANQIIIAJCIIh8QdAFNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEHUBTUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxB2AU1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QdwFNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHgBTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB5AU1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QegFNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHsBTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB8AU1AgAgA358IgI+AiggACAANQIsIAJCIIh8QfQFNQIAIAN+fCICPgIsQfgIIAJCIIg+AgAgACAANQIEIAA1AgQgBH5C/////w+DIgNByAU1AgB+fCICPgIEIAAgADUCCCACQiCIfEHMBTUCACADfnwiAj4CCCAAIAA1AgwgAkIgiHxB0AU1AgAgA358IgI+AgwgACAANQIQIAJCIIh8QdQFNQIAIAN+fCICPgIQIAAgADUCFCACQiCIfEHYBTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB3AU1AgAgA358IgI+AhggACAANQIcIAJCIIh8QeAFNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEHkBTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB6AU1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QewFNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEHwBTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB9AU1AgAgA358IgI+AjBB/AggAkIgiD4CACAAIAA1AgggADUCCCAEfkL/////D4MiA0HIBTUCAH58IgI+AgggACAANQIMIAJCIIh8QcwFNQIAIAN+fCICPgIMIAAgADUCECACQiCIfEHQBTUCACADfnwiAj4CECAAIAA1AhQgAkIgiHxB1AU1AgAgA358IgI+AhQgACAANQIYIAJCIIh8QdgFNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEHcBTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB4AU1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QeQFNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEHoBTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB7AU1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QfAFNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEH0BTUCACADfnwiAj4CNEGACSACQiCIPgIAIAAgADUCDCAANQIMIAR+Qv////8PgyIDQcgFNQIAfnwiAj4CDCAAIAA1AhAgAkIgiHxBzAU1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QdAFNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEHUBTUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxB2AU1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QdwFNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEHgBTUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxB5AU1AgAgA358IgI+AiggACAANQIsIAJCIIh8QegFNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEHsBTUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxB8AU1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QfQFNQIAIAN+fCICPgI4QYQJIAJCIIg+AgAgACAANQIQIAA1AhAgBH5C/////w+DIgNByAU1AgB+fCICPgIQIAAgADUCFCACQiCIfEHMBTUCACADfnwiAj4CFCAAIAA1AhggAkIgiHxB0AU1AgAgA358IgI+AhggACAANQIcIAJCIIh8QdQFNQIAIAN+fCICPgIcIAAgADUCICACQiCIfEHYBTUCACADfnwiAj4CICAAIAA1AiQgAkIgiHxB3AU1AgAgA358IgI+AiQgACAANQIoIAJCIIh8QeAFNQIAIAN+fCICPgIoIAAgADUCLCACQiCIfEHkBTUCACADfnwiAj4CLCAAIAA1AjAgAkIgiHxB6AU1AgAgA358IgI+AjAgACAANQI0IAJCIIh8QewFNQIAIAN+fCICPgI0IAAgADUCOCACQiCIfEHwBTUCACADfnwiAj4COCAAIAA1AjwgAkIgiHxB9AU1AgAgA358IgI+AjxBiAkgAkIgiD4CACAAIAA1AhQgADUCFCAEfkL/////D4MiA0HIBTUCAH58IgI+AhQgACAANQIYIAJCIIh8QcwFNQIAIAN+fCICPgIYIAAgADUCHCACQiCIfEHQBTUCACADfnwiAj4CHCAAIAA1AiAgAkIgiHxB1AU1AgAgA358IgI+AiAgACAANQIkIAJCIIh8QdgFNQIAIAN+fCICPgIkIAAgADUCKCACQiCIfEHcBTUCACADfnwiAj4CKCAAIAA1AiwgAkIgiHxB4AU1AgAgA358IgI+AiwgACAANQIwIAJCIIh8QeQFNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEHoBTUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxB7AU1AgAgA358IgI+AjggACAANQI8IAJCIIh8QfAFNQIAIAN+fCICPgI8IAAgADUC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AlRBoAkgAkIgiD4CACAAIAA1AiwgADUCLCAEfkL/////D4MiA0HIBTUCAH58IgI+AiwgACAANQIwIAJCIIh8QcwFNQIAIAN+fCICPgIwIAAgADUCNCACQiCIfEHQBTUCACADfnwiAj4CNCAAIAA1AjggAkIgiHxB1AU1AgAgA358IgI+AjggACAANQI8IAJCIIh8QdgFNQIAIAN+fCICPgI8IAAgADUCQCACQiCIfEHcBTUCACADfnwiAj4CQCAAIAA1AkQgAkIgiHxB4AU1AgAgA358IgI+AkQgACAANQJIIAJCIIh8QeQFNQIAIAN+fCICPgJIIAAgADUCTCACQiCIfEHoBTUCACADfnwiAj4CTCAAIAA1AlAgAkIgiHxB7AU1AgAgA358IgI+AlAgACAANQJUIAJCIIh8QfAFNQIAIAN+fCICPgJUIAAgADUCWCACQiCIfEH0BTUCACADfnwiAj4CWEGkCSACQiCIPgIAQfgIIABBMGogARAPC/Q+ARt+IAUgATUCACIEIAA1AgAiEn58IgNC/////w+DIQUgBiAANQIEIhMgBH58IANCIIh8IgNC/////w+DIQYgByAANQIIIhQgBH58IANCIIh8IgNC/////w+DIQcgCCAANQIMIhUgBH58IANCIIh8IgNC/////w+DIQggCSAANQIQIhYgBH58IANCIIh8IgNC/////w+DIQkgCiAANQIUIhcgBH58IANCIIh8IgNC/////w+DIQogCyAANQIYIhggBH58IANCIIh8IgNC/////w+DIQsgDCAANQIcIhkgBH58IANCIIh8IgNC/////w+DIQwgDSAANQIgIhogBH58IANCIIh8IgNC/////w+DIQ0gDiAANQIkIhsgBH58IANCIIh8IgNC/////w+DIQ4gDyAANQIoIhwgBH58IANCIIh8IgNC/////w+DIQ8gECAANQIsIh0gBH58IANCIIh8IgNC/////w+DIRAgA0IgiCERIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwhECAFIBIgATUCBCIEfnwiA0L/////D4MhBSAGIAQgE358IANCIIh8IgNC/////w+DIQYgByAEIBR+fCADQiCIfCIDQv////8PgyEHIAggBCAVfnwgA0IgiHwiA0L/////D4MhCCAJIAQgFn58IANCIIh8IgNC/////w+DIQkgCiAEIBd+fCADQiCIfCIDQv////8PgyEKIAsgBCAYfnwgA0IgiHwiA0L/////D4MhCyAMIAQgGX58IANCIIh8IgNC/////w+DIQwgDSAEIBp+fCADQiCIfCIDQv////8PgyENIA4gBCAbfnwgA0IgiHwiA0L/////D4MhDiAPIAQgHH58IANCIIh8IgNC/////w+DIQ8gECAEIB1+fCADQiCIfCIDQv////8PgyEQIANCIIghESAFIAVC/f/z/w9+Qv////8PgyIEQqvV/v8PfnxCIIggBiAEQv//+88Lfnx8IgNC/////w+DIQUgByAEQv//z4oLfnwgA0IgiHwiA0L/////D4MhBiAIIARC/v+v9QF+fCADQiCIfCIDQv////8PgyEHIAkgBEKk7MO1D358IANCIIh8IgNC/////w+DIQggCiAEQqClw7kGfnwgA0IgiHwiA0L/////D4MhCSALIARCv6WUnA9+fCADQiCIfCIDQv////8PgyEKIAwgBEKEl92jBn58IANCIIh8IgNC/////w+DIQsgDSAEQtfZrpoEfnwgA0IgiHwiA0L/////D4MhDCAOIARCts/u2AR+fCADQiCIfCIDQv////8PgyENIA8gBEKazf/LA358IANCIIh8IgNC/////w+DIQ4gECAEQuqjhNABfnwgA0IgiHwiA0L/////D4MhDyARIANCIIh8IRAgBSASIAE1AggiBH58IgNC/////w+DIQUgBiAEIBN+fCADQiCIfCIDQv////8PgyEGIAcgBCAUfnwgA0IgiHwiA0L/////D4MhByAIIAQgFX58IANCIIh8IgNC/////w+DIQggCSAEIBZ+fCADQiCIfCIDQv////8PgyEJIAogBCAXfnwgA0IgiHwiA0L/////D4MhCiALIAQgGH58IANCIIh8IgNC/////w+DIQsgDCAEIBl+fCADQiCIfCIDQv////8PgyEMIA0gBCAafnwgA0IgiHwiA0L/////D4MhDSAOIAQgG358IANCIIh8IgNC/////w+DIQ4gDyAEIBx+fCADQiCIfCIDQv////8PgyEPIBAgBCAdfnwgA0IgiHwiA0L/////D4MhECADQiCIIREgBSAFQv3/8/8PfkL/////D4MiBEKr1f7/D358QiCIIAYgBEL///vPC358fCIDQv////8PgyEFIAcgBEL//8+KC358IANCIIh8IgNC/////w+DIQYgCCAEQv7/r/UBfnwgA0IgiHwiA0L/////D4MhByAJIARCpOzDtQ9+fCADQiCIfCIDQv////8PgyEIIAogBEKgpcO5Bn58IANCIIh8IgNC/////w+DIQkgCyAEQr+llJwPfnwgA0IgiHwiA0L/////D4MhCiAMIARChJfdowZ+fCADQiCIfCIDQv////8PgyELIA0gBELX2a6aBH58IANCIIh8IgNC/////w+DIQwgDiAEQrbP7tgEfnwgA0IgiHwiA0L/////D4MhDSAPIARCms3/ywN+fCADQiCIfCIDQv////8PgyEOIBAgBELqo4TQAX58IANCIIh8IgNC/////w+DIQ8gESADQiCIfCEQIAUgEiABNQIMIgR+fCIDQv////8PgyEFIAYgBCATfnwgA0IgiHwiA0L/////D4MhBiAHIAQgFH58IANCIIh8IgNC/////w+DIQcgCCAEIBV+fCADQiCIfCIDQv////8PgyEIIAkgBCAWfnwgA0IgiHwiA0L/////D4MhCSAKIAQgF358IANCIIh8IgNC/////w+DIQogCyAEIBh+fCADQiCIfCIDQv////8PgyELIAwgBCAZfnwgA0IgiHwiA0L/////D4MhDCANIAQgGn58IANCIIh8IgNC/////w+DIQ0gDiAEIBt+fCADQiCIfCIDQv////8PgyEOIA8gBCAcfnwgA0IgiHwiA0L/////D4MhDyAQIAQgHX58IANCIIh8IgNC/////w+DIRAgA0IgiCERIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwhECAFIBIgATUCECIEfnwiA0L/////D4MhBSAGIAQgE358IANCIIh8IgNC/////w+DIQYgByAEIBR+fCADQiCIfCIDQv////8PgyEHIAggBCAVfnwgA0IgiHwiA0L/////D4MhCCAJIAQgFn58IANCIIh8IgNC/////w+DIQkgCiAEIBd+fCADQiCIfCIDQv////8PgyEKIAsgBCAYfnwgA0IgiHwiA0L/////D4MhCyAMIAQgGX58IANCIIh8IgNC/////w+DIQwgDSAEIBp+fCADQiCIfCIDQv////8PgyENIA4gBCAbfnwgA0IgiHwiA0L/////D4MhDiAPIAQgHH58IANCIIh8IgNC/////w+DIQ8gECAEIB1+fCADQiCIfCIDQv////8PgyEQIANCIIghESAFIAVC/f/z/w9+Qv////8PgyIEQqvV/v8PfnxCIIggBiAEQv//+88Lfnx8IgNC/////w+DIQUgByAEQv//z4oLfnwgA0IgiHwiA0L/////D4MhBiAIIARC/v+v9QF+fCADQiCIfCIDQv////8PgyEHIAkgBEKk7MO1D358IANCIIh8IgNC/////w+DIQggCiAEQqClw7kGfnwgA0IgiHwiA0L/////D4MhCSALIARCv6WUnA9+fCADQiCIfCIDQv////8PgyEKIAwgBEKEl92jBn58IANCIIh8IgNC/////w+DIQsgDSAEQtfZrpoEfnwgA0IgiHwiA0L/////D4MhDCAOIARCts/u2AR+fCADQiCIfCIDQv////8PgyENIA8gBEKazf/LA358IANCIIh8IgNC/////w+DIQ4gECAEQuqjhNABfnwgA0IgiHwiA0L/////D4MhDyARIANCIIh8IRAgBSASIAE1AhQiBH58IgNC/////w+DIQUgBiAEIBN+fCADQiCIfCIDQv////8PgyEGIAcgBCAUfnwgA0IgiHwiA0L/////D4MhByAIIAQgFX58IANCIIh8IgNC/////w+DIQggCSAEIBZ+fCADQiCIfCIDQv////8PgyEJIAogBCAXfnwgA0IgiHwiA0L/////D4MhCiALIAQgGH58IANCIIh8IgNC/////w+DIQsgDCAEIBl+fCADQiCIfCIDQv////8PgyEMIA0gBCAafnwgA0IgiHwiA0L/////D4MhDSAOIAQgG358IANCIIh8IgNC/////w+DIQ4gDyAEIBx+fCADQiCIfCIDQv////8PgyEPIBAgBCAdfnwgA0IgiHwiA0L/////D4MhECADQiCIIREgBSAFQv3/8/8PfkL/////D4MiBEKr1f7/D358QiCIIAYgBEL///vPC358fCIDQv////8PgyEFIAcgBEL//8+KC358IANCIIh8IgNC/////w+DIQYgCCAEQv7/r/UBfnwgA0IgiHwiA0L/////D4MhByAJIARCpOzDtQ9+fCADQiCIfCIDQv////8PgyEIIAogBEKgpcO5Bn58IANCIIh8IgNC/////w+DIQkgCyAEQr+llJwPfnwgA0IgiHwiA0L/////D4MhCiAMIARChJfdowZ+fCADQiCIfCIDQv////8PgyELIA0gBELX2a6aBH58IANCIIh8IgNC/////w+DIQwgDiAEQrbP7tgEfnwgA0IgiHwiA0L/////D4MhDSAPIARCms3/ywN+fCADQiCIfCIDQv////8PgyEOIBAgBELqo4TQAX58IANCIIh8IgNC/////w+DIQ8gESADQiCIfCEQIAUgEiABNQIYIgR+fCIDQv////8PgyEFIAYgBCATfnwgA0IgiHwiA0L/////D4MhBiAHIAQgFH58IANCIIh8IgNC/////w+DIQcgCCAEIBV+fCADQiCIfCIDQv////8PgyEIIAkgBCAWfnwgA0IgiHwiA0L/////D4MhCSAKIAQgF358IANCIIh8IgNC/////w+DIQogCyAEIBh+fCADQiCIfCIDQv////8PgyELIAwgBCAZfnwgA0IgiHwiA0L/////D4MhDCANIAQgGn58IANCIIh8IgNC/////w+DIQ0gDiAEIBt+fCADQiCIfCIDQv////8PgyEOIA8gBCAcfnwgA0IgiHwiA0L/////D4MhDyAQIAQgHX58IANCIIh8IgNC/////w+DIRAgA0IgiCERIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwhECAFIBIgATUCHCIEfnwiA0L/////D4MhBSAGIAQgE358IANCIIh8IgNC/////w+DIQYgByAEIBR+fCADQiCIfCIDQv////8PgyEHIAggBCAVfnwgA0IgiHwiA0L/////D4MhCCAJIAQgFn58IANCIIh8IgNC/////w+DIQkgCiAEIBd+fCADQiCIfCIDQv////8PgyEKIAsgBCAYfnwgA0IgiHwiA0L/////D4MhCyAMIAQgGX58IANCIIh8IgNC/////w+DIQwgDSAEIBp+fCADQiCIfCIDQv////8PgyENIA4gBCAbfnwgA0IgiHwiA0L/////D4MhDiAPIAQgHH58IANCIIh8IgNC/////w+DIQ8gECAEIB1+fCADQiCIfCIDQv////8PgyEQIANCIIghESAFIAVC/f/z/w9+Qv////8PgyIEQqvV/v8PfnxCIIggBiAEQv//+88Lfnx8IgNC/////w+DIQUgByAEQv//z4oLfnwgA0IgiHwiA0L/////D4MhBiAIIARC/v+v9QF+fCADQiCIfCIDQv////8PgyEHIAkgBEKk7MO1D358IANCIIh8IgNC/////w+DIQggCiAEQqClw7kGfnwgA0IgiHwiA0L/////D4MhCSALIARCv6WUnA9+fCADQiCIfCIDQv////8PgyEKIAwgBEKEl92jBn58IANCIIh8IgNC/////w+DIQsgDSAEQtfZrpoEfnwgA0IgiHwiA0L/////D4MhDCAOIARCts/u2AR+fCADQiCIfCIDQv////8PgyENIA8gBEKazf/LA358IANCIIh8IgNC/////w+DIQ4gECAEQuqjhNABfnwgA0IgiHwiA0L/////D4MhDyARIANCIIh8IRAgBSASIAE1AiAiBH58IgNC/////w+DIQUgBiAEIBN+fCADQiCIfCIDQv////8PgyEGIAcgBCAUfnwgA0IgiHwiA0L/////D4MhByAIIAQgFX58IANCIIh8IgNC/////w+DIQggCSAEIBZ+fCADQiCIfCIDQv////8PgyEJIAogBCAXfnwgA0IgiHwiA0L/////D4MhCiALIAQgGH58IANCIIh8IgNC/////w+DIQsgDCAEIBl+fCADQiCIfCIDQv////8PgyEMIA0gBCAafnwgA0IgiHwiA0L/////D4MhDSAOIAQgG358IANCIIh8IgNC/////w+DIQ4gDyAEIBx+fCADQiCIfCIDQv////8PgyEPIBAgBCAdfnwgA0IgiHwiA0L/////D4MhECADQiCIIREgBSAFQv3/8/8PfkL/////D4MiBEKr1f7/D358QiCIIAYgBEL///vPC358fCIDQv////8PgyEFIAcgBEL//8+KC358IANCIIh8IgNC/////w+DIQYgCCAEQv7/r/UBfnwgA0IgiHwiA0L/////D4MhByAJIARCpOzDtQ9+fCADQiCIfCIDQv////8PgyEIIAogBEKgpcO5Bn58IANCIIh8IgNC/////w+DIQkgCyAEQr+llJwPfnwgA0IgiHwiA0L/////D4MhCiAMIARChJfdowZ+fCADQiCIfCIDQv////8PgyELIA0gBELX2a6aBH58IANCIIh8IgNC/////w+DIQwgDiAEQrbP7tgEfnwgA0IgiHwiA0L/////D4MhDSAPIARCms3/ywN+fCADQiCIfCIDQv////8PgyEOIBAgBELqo4TQAX58IANCIIh8IgNC/////w+DIQ8gESADQiCIfCEQIAUgEiABNQIkIgR+fCIDQv////8PgyEFIAYgBCATfnwgA0IgiHwiA0L/////D4MhBiAHIAQgFH58IANCIIh8IgNC/////w+DIQcgCCAEIBV+fCADQiCIfCIDQv////8PgyEIIAkgBCAWfnwgA0IgiHwiA0L/////D4MhCSAKIAQgF358IANCIIh8IgNC/////w+DIQogCyAEIBh+fCADQiCIfCIDQv////8PgyELIAwgBCAZfnwgA0IgiHwiA0L/////D4MhDCANIAQgGn58IANCIIh8IgNC/////w+DIQ0gDiAEIBt+fCADQiCIfCIDQv////8PgyEOIA8gBCAcfnwgA0IgiHwiA0L/////D4MhDyAQIAQgHX58IANCIIh8IgNC/////w+DIRAgA0IgiCERIAUgBUL9//P/D35C/////w+DIgRCq9X+/w9+fEIgiCAGIARC///7zwt+fHwiA0L/////D4MhBSAHIARC///Pigt+fCADQiCIfCIDQv////8PgyEGIAggBEL+/6/1AX58IANCIIh8IgNC/////w+DIQcgCSAEQqTsw7UPfnwgA0IgiHwiA0L/////D4MhCCAKIARCoKXDuQZ+fCADQiCIfCIDQv////8PgyEJIAsgBEK/pZScD358IANCIIh8IgNC/////w+DIQogDCAEQoSX3aMGfnwgA0IgiHwiA0L/////D4MhCyANIARC19mumgR+fCADQiCIfCIDQv////8PgyEMIA4gBEK2z+7YBH58IANCIIh8IgNC/////w+DIQ0gDyAEQprN/8sDfnwgA0IgiHwiA0L/////D4MhDiAQIARC6qOE0AF+fCADQiCIfCIDQv////8PgyEPIBEgA0IgiHwhECAFIBIgATUCKCIEfnwiA0L/////D4MhBSAGIAQgE358IANCIIh8IgNC/////w+DIQYgByAEIBR+fCADQiCIfCIDQv////8PgyEHIAggBCAVfnwgA0IgiHwiA0L/////D4MhCCAJIAQgFn58IANCIIh8IgNC/////w+DIQkgCiAEIBd+fCADQiCIfCIDQv////8PgyEKIAsgBCAYfnwgA0IgiHwiA0L/////D4MhCyAMIAQgGX58IANCIIh8IgNC/////w+DIQwgDSAEIBp+fCADQiCIfCIDQv////8PgyENIA4gBCAbfnwgA0IgiHwiA0L/////D4MhDiAPIAQgHH58IANCIIh8IgNC/////w+DIQ8gECAEIB1+fCADQiCIfCIDQv////8PgyEQIANCIIghESAFIAVC/f/z/w9+Qv////8PgyIEQqvV/v8PfnxCIIggBiAEQv//+88Lfnx8IgNC/////w+DIQUgByAEQv//z4oLfnwgA0IgiHwiA0L/////D4MhBiAIIARC/v+v9QF+fCADQiCIfCIDQv////8PgyEHIAkgBEKk7MO1D358IANCIIh8IgNC/////w+DIQggCiAEQqClw7kGfnwgA0IgiHwiA0L/////D4MhCSALIARCv6WUnA9+fCADQiCIfCIDQv////8PgyEKIAwgBEKEl92jBn58IANCIIh8IgNC/////w+DIQsgDSAEQtfZrpoEfnwgA0IgiHwiA0L/////D4MhDCAOIARCts/u2AR+fCADQiCIfCIDQv////8PgyENIA8gBEKazf/LA358IANCIIh8IgNC/////w+DIQ4gECAEQuqjhNABfnwgA0IgiHwiA0L/////D4MhDyARIANCIIh8IRAgBSASIAE1AiwiBH58IgNC/////w+DIQUgBiAEIBN+fCADQiCIfCIDQv////8PgyEGIAcgBCAUfnwgA0IgiHwiA0L/////D4MhByAIIAQgFX58IANCIIh8IgNC/////w+DIQggCSAEIBZ+fCADQiCIfCIDQv////8PgyEJIAogBCAXfnwgA0IgiHwiA0L/////D4MhCiALIAQgGH58IANCIIh8IgNC/////w+DIQsgDCAEIBl+fCADQiCIfCIDQv////8PgyEMIA0gBCAafnwgA0IgiHwiA0L/////D4MhDSAOIAQgG358IANCIIh8IgNC/////w+DIQ4gDyAEIBx+fCADQiCIfCIDQv////8PgyEPIBAgBCAdfnwgA0IgiHwiA0L/////D4MhECADQiCIIREgAiAFIAVC/f/z/w9+Qv////8PgyIEQqvV/v8PfnxCIIggBiAEQv//+88Lfnx8IgNC/////w+DPgIAIAIgByAEQv//z4oLfnwgA0IgiHwiA0L/////D4M+AgQgAiAIIARC/v+v9QF+fCADQiCIfCIDQv////8Pgz4CCCACIAkgBEKk7MO1D358IANCIIh8IgNC/////w+DPgIMIAIgCiAEQqClw7kGfnwgA0IgiHwiA0L/////D4M+AhAgAiALIARCv6WUnA9+fCADQiCIfCIDQv////8Pgz4CFCACIAwgBEKEl92jBn58IANCIIh8IgNC/////w+DPgIYIAIgDSAEQtfZrpoEfnwgA0IgiHwiA0L/////D4M+AhwgAiAOIARCts/u2AR+fCADQiCIfCIDQv////8Pgz4CICACIA8gBEKazf/LA358IANCIIh8IgNC/////w+DPgIkIAIgECAEQuqjhNABfnwgA0IgiHwiA0L/////D4M+AiggAiARIANCIIh8PgIsIAJByAUQBQRAIAJByAUgAhAHGgsLiEABG34gCiAANQIAIhEgEX58IgJC/////w+DIQogECAANQIEIhMgEX4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIRAgA0IgiEIBhiACQiCIfCAPIAA1AggiFCARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQ8gA0IgiEIBhiACQiCIfCAOIAA1AgwiFSARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQ4gA0IgiEIBhiACQiCIfCANIAA1AhAiFiARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQ0gA0IgiEIBhiACQiCIfCAMIAA1AhQiFyARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQwgA0IgiEIBhiACQiCIfCALIAA1AhgiGCARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAJIAA1AhwiGSARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAIIAA1AiAiGiARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQggA0IgiEIBhiACQiCIfCAHIAA1AiQiGyARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIAA1AigiHCARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQYgA0IgiEIBhiACQiCIfCAEIBEgADUCLCIRfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIBIgAkIgiHwhEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIBAgEyATfnwiAkL/////D4MhECAPIBMgFH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQ8gA0IgiEIBhiACQiCIfCAOIBMgFX4iA0L/////D4NCAYZ8fCICQv////8PgyEOIANCIIhCAYYgAkIgiHwgDSATIBZ+IgNC/////w+DQgGGfHwiAkL/////D4MhDSADQiCIQgGGIAJCIIh8IAwgEyAXfiIDQv////8Pg0IBhnx8IgJC/////w+DIQwgA0IgiEIBhiACQiCIfCALIBMgGH4iA0L/////D4NCAYZ8fCICQv////8PgyELIANCIIhCAYYgAkIgiHwgCSATIBl+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAggEyAafiIDQv////8Pg0IBhnx8IgJC/////w+DIQggA0IgiEIBhiACQiCIfCAHIBMgG34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiATIBx+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgESATfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIA8gFCAUfnwiAkL/////D4MhDyAOIBQgFX4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQ4gA0IgiEIBhiACQiCIfCANIBQgFn4iA0L/////D4NCAYZ8fCICQv////8PgyENIANCIIhCAYYgAkIgiHwgDCAUIBd+IgNC/////w+DQgGGfHwiAkL/////D4MhDCADQiCIQgGGIAJCIIh8IAsgFCAYfiIDQv////8Pg0IBhnx8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAJIBQgGX4iA0L/////D4NCAYZ8fCICQv////8PgyEJIANCIIhCAYYgAkIgiHwgCCAUIBp+IgNC/////w+DQgGGfHwiAkL/////D4MhCCADQiCIQgGGIAJCIIh8IAcgFCAbfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBQgHH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCARIBR+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCESIAogCkL9//P/D35C/////w+DIgNCq9X+/w9+fEIgiCAQIANC///7zwt+fHwiAkL/////D4MhCiAPIANC///Pigt+fCACQiCIfCICQv////8PgyEQIA4gA0L+/6/1AX58IAJCIIh8IgJC/////w+DIQ8gDSADQqTsw7UPfnwgAkIgiHwiAkL/////D4MhDiAMIANCoKXDuQZ+fCACQiCIfCICQv////8PgyENIAsgA0K/pZScD358IAJCIIh8IgJC/////w+DIQwgCSADQoSX3aMGfnwgAkIgiHwiAkL/////D4MhCyAIIANC19mumgR+fCACQiCIfCICQv////8PgyEJIAcgA0K2z+7YBH58IAJCIIh8IgJC/////w+DIQggBiADQprN/8sDfnwgAkIgiHwiAkL/////D4MhByAEIANC6qOE0AF+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCASIAJCIIh8IQUgDiAVIBV+fCICQv////8PgyEOIA0gFSAWfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhDSADQiCIQgGGIAJCIIh8IAwgFSAXfiIDQv////8Pg0IBhnx8IgJC/////w+DIQwgA0IgiEIBhiACQiCIfCALIBUgGH4iA0L/////D4NCAYZ8fCICQv////8PgyELIANCIIhCAYYgAkIgiHwgCSAVIBl+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAggFSAafiIDQv////8Pg0IBhnx8IgJC/////w+DIQggA0IgiEIBhiACQiCIfCAHIBUgG34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiAVIBx+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgESAVfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIA0gFiAWfnwiAkL/////D4MhDSAMIBYgF34iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQwgA0IgiEIBhiACQiCIfCALIBYgGH4iA0L/////D4NCAYZ8fCICQv////8PgyELIANCIIhCAYYgAkIgiHwgCSAWIBl+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAggFiAafiIDQv////8Pg0IBhnx8IgJC/////w+DIQggA0IgiEIBhiACQiCIfCAHIBYgG34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiAWIBx+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgESAWfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIAwgFyAXfnwiAkL/////D4MhDCALIBcgGH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAJIBcgGX4iA0L/////D4NCAYZ8fCICQv////8PgyEJIANCIIhCAYYgAkIgiHwgCCAXIBp+IgNC/////w+DQgGGfHwiAkL/////D4MhCCADQiCIQgGGIAJCIIh8IAcgFyAbfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBcgHH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCARIBd+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCESIAogCkL9//P/D35C/////w+DIgNCq9X+/w9+fEIgiCAQIANC///7zwt+fHwiAkL/////D4MhCiAPIANC///Pigt+fCACQiCIfCICQv////8PgyEQIA4gA0L+/6/1AX58IAJCIIh8IgJC/////w+DIQ8gDSADQqTsw7UPfnwgAkIgiHwiAkL/////D4MhDiAMIANCoKXDuQZ+fCACQiCIfCICQv////8PgyENIAsgA0K/pZScD358IAJCIIh8IgJC/////w+DIQwgCSADQoSX3aMGfnwgAkIgiHwiAkL/////D4MhCyAIIANC19mumgR+fCACQiCIfCICQv////8PgyEJIAcgA0K2z+7YBH58IAJCIIh8IgJC/////w+DIQggBiADQprN/8sDfnwgAkIgiHwiAkL/////D4MhByAEIANC6qOE0AF+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCASIAJCIIh8IQUgCyAYIBh+fCICQv////8PgyELIAkgGCAZfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAggGCAafiIDQv////8Pg0IBhnx8IgJC/////w+DIQggA0IgiEIBhiACQiCIfCAHIBggG34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiAYIBx+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgESAYfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIAkgGSAZfnwiAkL/////D4MhCSAIIBkgGn4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQggA0IgiEIBhiACQiCIfCAHIBkgG34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiAZIBx+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgESAZfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIAggGiAafnwiAkL/////D4MhCCAHIBogG34iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBogHH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCARIBp+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCESIAogCkL9//P/D35C/////w+DIgNCq9X+/w9+fEIgiCAQIANC///7zwt+fHwiAkL/////D4MhCiAPIANC///Pigt+fCACQiCIfCICQv////8PgyEQIA4gA0L+/6/1AX58IAJCIIh8IgJC/////w+DIQ8gDSADQqTsw7UPfnwgAkIgiHwiAkL/////D4MhDiAMIANCoKXDuQZ+fCACQiCIfCICQv////8PgyENIAsgA0K/pZScD358IAJCIIh8IgJC/////w+DIQwgCSADQoSX3aMGfnwgAkIgiHwiAkL/////D4MhCyAIIANC19mumgR+fCACQiCIfCICQv////8PgyEJIAcgA0K2z+7YBH58IAJCIIh8IgJC/////w+DIQggBiADQprN/8sDfnwgAkIgiHwiAkL/////D4MhByAEIANC6qOE0AF+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCASIAJCIIh8IQUgByAbIBt+fCICQv////8PgyEHIAYgGyAcfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgESAbfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIAYgHCAcfnwiAkL/////D4MhBiAEIBEgHH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghEiAKIApC/f/z/w9+Qv////8PgyIDQqvV/v8PfnxCIIggECADQv//+88Lfnx8IgJC/////w+DIQogDyADQv//z4oLfnwgAkIgiHwiAkL/////D4MhECAOIANC/v+v9QF+fCACQiCIfCICQv////8PgyEPIA0gA0Kk7MO1D358IAJCIIh8IgJC/////w+DIQ4gDCADQqClw7kGfnwgAkIgiHwiAkL/////D4MhDSALIANCv6WUnA9+fCACQiCIfCICQv////8PgyEMIAkgA0KEl92jBn58IAJCIIh8IgJC/////w+DIQsgCCADQtfZrpoEfnwgAkIgiHwiAkL/////D4MhCSAHIANCts/u2AR+fCACQiCIfCICQv////8PgyEIIAYgA0Kazf/LA358IAJCIIh8IgJC/////w+DIQcgBCADQuqjhNABfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgEiACQiCIfCEFIAQgESARfnwiAkL/////D4MhBCAFIAJCIIh8IgJC/////w+DIQUgAkIgiCESIAEgCiAKQv3/8/8PfkL/////D4MiA0Kr1f7/D358QiCIIBAgA0L///vPC358fCICQv////8Pgz4CACABIA8gA0L//8+KC358IAJCIIh8IgJC/////w+DPgIEIAEgDiADQv7/r/UBfnwgAkIgiHwiAkL/////D4M+AgggASANIANCpOzDtQ9+fCACQiCIfCICQv////8Pgz4CDCABIAwgA0KgpcO5Bn58IAJCIIh8IgJC/////w+DPgIQIAEgCyADQr+llJwPfnwgAkIgiHwiAkL/////D4M+AhQgASAJIANChJfdowZ+fCACQiCIfCICQv////8Pgz4CGCABIAggA0LX2a6aBH58IAJCIIh8IgJC/////w+DPgIcIAEgByADQrbP7tgEfnwgAkIgiHwiAkL/////D4M+AiAgASAGIANCms3/ywN+fCACQiCIfCICQv////8Pgz4CJCABIAQgA0Lqo4TQAX58IAJCIIh8IgJC/////w+DPgIoIAEgBSACQiCIfCICQv////8Pgz4CLCASIAJCIIh8pwRAIAFByAUgARAHGgUgAUHIBRAFBEAgAUHIBSABEAcaCwsLCgAgACAAIAEQEwsLACAAQfgFIAEQEwsVACAAQfgREABBqBIQAUH4ESABEBILEQAgAEHYEhAXQdgSQbgHEAULIwAgABACBEBBAA8LIABBiBMQF0GIE0G4BxAFBEBBfw8LQQELFwAgACABEBcgAUHIBSABEA0gASABEBYLCQBBqAYgABAAC7wBAQJ/IAIQAUEwIQMDQCABIANPBEAgA0EwRgRAQbgTEBsFQbgTQfgFQbgTEBMLIABBuBNB6BMQEyACQegTIAIQDyAAQTBqIQAgA0EwaiEDDAELCyABQTBwIgRFBEAPC0HoExABQQAhAQNAIAEgBEZFBEAgASAALQAAOgDoEyAAQQFqIQAgAUEBaiEBDAELCyADQTBGBEBBuBMQGwVBuBNB+AVBuBMQEwtB6BNBuBNB6BMQEyACQegTIAIQDwscACABIAJBmBQQHEGYFEGYFBAWIABBmBQgAxATC+EBAQJ/QQBBACgCACIFIAJBAWpBMGxqNgIAIAUQGyAFQTBqIQUDQCACIAZHBEAgABACBEAgBUEwayAFEAAFIAAgBUEwayAFEBMLIAAgAWohACAFQTBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBMGsiBSAFEBoDQCAGBEAgABACBEAgBSAFQTBrEAAgAhABBSAFQTBrQcgUEAAgBSAAIAVBMGsQEyAFQcgUIAIQEwsgACABayEAIAIgBGshAiAFQTBrIQUgBkEBayEGDAELC0EAIAU2AgALLQEBfwNAIAEgA0ZFBEAgACACEBYgAEEwaiEAIAJBMGohAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhAXIABBMGohACACQTBqIQIgA0EBaiEDDAELCwuXAgAgAkUEQCADEBsPCyAAQfgUEAAgAxAbA0AgAkEBayICIAFqLQAAIQAgAyADEBQgAEGAAU8EQCADQfgUIAMQEyAAQYABayEACyADIAMQFCAAQcAATwRAIANB+BQgAxATIABBQGohAAsgAyADEBQgAEEgTwRAIANB+BQgAxATIABBIGshAAsgAyADEBQgAEEQTwRAIANB+BQgAxATIABBEGshAAsgAyADEBQgAEEITwRAIANB+BQgAxATIABBCGshAAsgAyADEBQgAEEETwRAIANB+BQgAxATIABBBGshAAsgAyADEBQgAEECTwRAIANB+BQgAxATIABBAmshAAsgAyADEBQgAARAIANB+BQgAxATCyACDQALC9UBAQF/IAAQAgRAIAEQAQ8LQQEhAkGYCEGoFRAAIABB6AdBMEHYFRAhIABByAhBMEGIFhAhA0BB2BVBqAYQBEUEQEHYFUG4FhAUQQEhAANAQbgWQagGEARFBEBBuBZBuBYQFCAAQQFqIQAMAQsLQagVQegWEAAgAiAAa0EBayECA0AgAgRAQegWQegWEBQgAkEBayECDAELCyAAIQJB6BZBqBUQFEHYFUGoFUHYFRATQYgWQegWQYgWEBMMAQsLQYgWEBgEQEGIFiABEBEFQYgWIAEQAAsLIAAgABACBEBBAQ8LIABBiAdBMEGYFxAhQZgXQagGEAQLKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAssACAAKQMYUAR+IAApAxBQBH4gACkDCFAEfiAAKQMABUIBCwVCAQsFQgELUAseACAAQgE3AwAgAEIANwMIIABCADcDECAAQgA3AxgLQAAgACkDGCABKQMYUQR/IAApAxAgASkDEFEEfyAAKQMIIAEpAwhRBH8gACkDACABKQMAUQVBAAsFQQALBUEACwtzACAAKQMYIAEpAxhUBH9BAAUgACkDGCABKQMYVgR/QQEFIAApAxAgASkDEFQEf0EABSAAKQMQIAEpAxBWBH9BAQUgACkDCCABKQMIVAR/QQAFIAApAwggASkDCFYEf0EBBSAAKQMAIAEpAwBaCwsLCwsLC8QBAQF+IAIgADUCACABNQIAfCIDPgIAIAIgADUCBCABNQIEfCADQiCIfCIDPgIEIAIgADUCCCABNQIIfCADQiCIfCIDPgIIIAIgADUCDCABNQIMfCADQiCIfCIDPgIMIAIgADUCECABNQIQfCADQiCIfCIDPgIQIAIgADUCFCABNQIUfCADQiCIfCIDPgIUIAIgADUCGCABNQIYfCADQiCIfCIDPgIYIAIgADUCHCABNQIcfCADQiCIfCIDPgIcIANCIIinC/wBAQF+IAIgADUCACABNQIAfSIDQv////8Pgz4CACACIAA1AgQgATUCBH0gA0Igh3wiA0L/////D4M+AgQgAiAANQIIIAE1Agh9IANCIId8IgNC/////w+DPgIIIAIgADUCDCABNQIMfSADQiCHfCIDQv////8Pgz4CDCACIAA1AhAgATUCEH0gA0Igh3wiA0L/////D4M+AhAgAiAANQIUIAE1AhR9IANCIId8IgNC/////w+DPgIUIAIgADUCGCABNQIYfSADQiCHfCIDQv////8Pgz4CGCACIAA1AhwgATUCHH0gA0Igh3wiA0L/////D4M+AhwgA0Igh6cL5g4BEX4gBCAANQIAIgUgATUCACIGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AgAgBEIgiCEDIAMgBSABNQIEIgd+IARC/////w+DfCIEQiCIfCEDIAMgADUCBCIIIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CBCADQiCIIQQgBCAFIAE1AggiCX4gA0L/////D4N8IgNCIIh8IQQgBCAHIAh+IANC/////w+DfCIDQiCIfCEEIAQgADUCCCIKIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CCCAEQiCIIQMgAyAFIAE1AgwiC34gBEL/////D4N8IgRCIIh8IQMgAyAIIAl+IARC/////w+DfCIEQiCIfCEDIAMgByAKfiAEQv////8Pg3wiBEIgiHwhAyADIAA1AgwiDCAGfiAEQv////8Pg3wiBEIgiHwhAyACIAQ+AgwgA0IgiCEEIAQgBSABNQIQIg1+IANC/////w+DfCIDQiCIfCEEIAQgCCALfiADQv////8Pg3wiA0IgiHwhBCAEIAkgCn4gA0L/////D4N8IgNCIIh8IQQgBCAHIAx+IANC/////w+DfCIDQiCIfCEEIAQgADUCECIOIAZ+IANC/////w+DfCIDQiCIfCEEIAIgAz4CECAEQiCIIQMgAyAFIAE1AhQiD34gBEL/////D4N8IgRCIIh8IQMgAyAIIA1+IARC/////w+DfCIEQiCIfCEDIAMgCiALfiAEQv////8Pg3wiBEIgiHwhAyADIAkgDH4gBEL/////D4N8IgRCIIh8IQMgAyAHIA5+IARC/////w+DfCIEQiCIfCEDIAMgADUCFCIQIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CFCADQiCIIQQgBCAFIAE1AhgiEX4gA0L/////D4N8IgNCIIh8IQQgBCAIIA9+IANC/////w+DfCIDQiCIfCEEIAQgCiANfiADQv////8Pg3wiA0IgiHwhBCAEIAsgDH4gA0L/////D4N8IgNCIIh8IQQgBCAJIA5+IANC/////w+DfCIDQiCIfCEEIAQgByAQfiADQv////8Pg3wiA0IgiHwhBCAEIAA1AhgiEiAGfiADQv////8Pg3wiA0IgiHwhBCACIAM+AhggBEIgiCEDIAMgBSABNQIcIhN+IARC/////w+DfCIEQiCIfCEDIAMgCCARfiAEQv////8Pg3wiBEIgiHwhAyADIAogD34gBEL/////D4N8IgRCIIh8IQMgAyAMIA1+IARC/////w+DfCIEQiCIfCEDIAMgCyAOfiAEQv////8Pg3wiBEIgiHwhAyADIAkgEH4gBEL/////D4N8IgRCIIh8IQMgAyAHIBJ+IARC/////w+DfCIEQiCIfCEDIAMgADUCHCIFIAZ+IARC/////w+DfCIEQiCIfCEDIAIgBD4CHCADQiCIIQQgBCAIIBN+IANC/////w+DfCIDQiCIfCEEIAQgCiARfiADQv////8Pg3wiA0IgiHwhBCAEIAwgD34gA0L/////D4N8IgNCIIh8IQQgBCANIA5+IANC/////w+DfCIDQiCIfCEEIAQgCyAQfiADQv////8Pg3wiA0IgiHwhBCAEIAkgEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAd+IANC/////w+DfCIDQiCIfCEEIAIgAz4CICAEQiCIIQMgAyAKIBN+IARC/////w+DfCIEQiCIfCEDIAMgDCARfiAEQv////8Pg3wiBEIgiHwhAyADIA4gD34gBEL/////D4N8IgRCIIh8IQMgAyANIBB+IARC/////w+DfCIEQiCIfCEDIAMgCyASfiAEQv////8Pg3wiBEIgiHwhAyADIAUgCX4gBEL/////D4N8IgRCIIh8IQMgAiAEPgIkIANCIIghBCAEIAwgE34gA0L/////D4N8IgNCIIh8IQQgBCAOIBF+IANC/////w+DfCIDQiCIfCEEIAQgDyAQfiADQv////8Pg3wiA0IgiHwhBCAEIA0gEn4gA0L/////D4N8IgNCIIh8IQQgBCAFIAt+IANC/////w+DfCIDQiCIfCEEIAIgAz4CKCAEQiCIIQMgAyAOIBN+IARC/////w+DfCIEQiCIfCEDIAMgECARfiAEQv////8Pg3wiBEIgiHwhAyADIA8gEn4gBEL/////D4N8IgRCIIh8IQMgAyAFIA1+IARC/////w+DfCIEQiCIfCEDIAIgBD4CLCADQiCIIQQgBCAQIBN+IANC/////w+DfCIDQiCIfCEEIAQgESASfiADQv////8Pg3wiA0IgiHwhBCAEIAUgD34gA0L/////D4N8IgNCIIh8IQQgAiADPgIwIARCIIghAyADIBIgE34gBEL/////D4N8IgRCIIh8IQMgAyAFIBF+IARC/////w+DfCIEQiCIfCEDIAIgBD4CNCADQiCIIQQgBCAFIBN+IANC/////w+DfCIDQiCIfCEEIAIgAz4COCACIAQ+AjwLzg0BDH4gAyAANQIAIgYgBn4gAkL/////D4N8IgJCIIh8IQMgASACPgIAIAMiBEIgiCEFIAA1AgQiByAGfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgQgAyIEQiCIIQUgADUCCCIIIAZ+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAcgB34gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgggAyIEQiCIIQUgADUCDCIJIAZ+IgJCIIghAyADIAcgCH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AgwgAyIEQiCIIQUgADUCECIKIAZ+IgJCIIghAyADIAcgCX4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAIIAh+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIQIAMiBEIgiCEFIAA1AhQiCyAGfiICQiCIIQMgAyAHIAp+IAJC/////w+DfCICQiCIfCEDIAMgCCAJfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CFCADIgRCIIghBSAANQIYIgwgBn4iAkIgiCEDIAMgByALfiACQv////8Pg3wiAkIgiHwhAyADIAggCn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyAJIAl+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIYIAMiBEIgiCEFIAA1AhwiDSAGfiICQiCIIQMgAyAHIAx+IAJC/////w+DfCICQiCIfCEDIAMgCCALfiACQv////8Pg3wiAkIgiHwhAyADIAkgCn4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AhwgAyIEQiCIIQUgByANfiICQiCIIQMgAyAIIAx+IAJC/////w+DfCICQiCIfCEDIAMgCSALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAogCn4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AiAgAyIEQiCIIQUgCCANfiICQiCIIQMgAyAJIAx+IAJC/////w+DfCICQiCIfCEDIAMgCiALfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CJCADIgRCIIghBSAJIA1+IgJCIIghAyADIAogDH4gAkL/////D4N8IgJCIIh8QgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyALIAt+IAJC/////w+DfCICQiCIfCEDIAMgAkL/////D4MgBEL/////D4N8IgJCIIh8IAV8IQMgASACPgIoIAMiBEIgiCEFIAogDX4iAkIgiCEDIAMgCyAMfiACQv////8Pg3wiAkIgiHxCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAJC/////w+DIARC/////w+DfCICQiCIfCAFfCEDIAEgAj4CLCADIgRCIIghBSALIA1+IgJCIIhCAYYgAkL/////D4NCAYYiAkIgiHwhAyADIAwgDH4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjAgAyIEQiCIIQUgDCANfiICQiCIQgGGIAJC/////w+DQgGGIgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjQgAyIEQiCIIQVCACECQgAhAyADIA0gDX4gAkL/////D4N8IgJCIIh8IQMgAyACQv////8PgyAEQv////8Pg3wiAkIgiHwgBXwhAyABIAI+AjggASADPgI8CwoAIAAgACABECwLsgMCA34BfyAAIANBiBggAxsiAxAkIAFByBcQJCACQegXIAIbIgcQJUGoGBAlQR8hAEEfIQEDQCABQcgXai0AACABQQNGckUEQCABQQFrIQEMAQsLIAFBxRdqNQAAQgF8IgZCAVEEQEIAQgCAGgsDQAJAA0AgACADai0AACAAQQdGckUEQCAAQQFrIQAMAQsLIAAgA2pBB2spAAAgBoAhBCAAIAFrQQRrIQIDQCAEQoCAgIBwg1AgAkEATnFFBEAgBEIIiCEEIAJBAWohAgwBCwsgBFAEQCADQcgXEClFDQFCASEEQQAhAgtByBhByBc1AAAgBH4iBT4AAEHMGEHMFzUAACAEfiAFQiCIfCIFPgAAQdAYQdAXNQAAIAR+IAVCIIh8IgU+AABB1BhB1Bc1AAAgBH4gBUIgiHwiBT4AAEHYGEHYFzUAACAEfiAFQiCIfCIFPgAAQdwYQdwXNQAAIAR+IAVCIIh8IgU+AABB4BhB4Bc1AAAgBH4gBUIgiHwiBT4AAEHkGEHkFzUAACAEfiAFQiCIfD4AACADQcgYIAJrIAMQKxogAiAHaiAEEAsMAQsLC44CAQp/QegYIQNB6BgQJUGIGSEIIAFBiBkQJEGoGSEJQagZECdByBkhBiAAQcgZECRB6BkhC0GIGiEKQegaIQQDQCAGECZFBEAgCCAGIAsgChAvIAsgCUGoGhAsIAcEfyAFBH9BqBogAxApBH9BqBogAyAEECsaQQAFIANBqBogBBArGkEBCwVBqBogAyAEECoaQQELBSAFBH9BqBogAyAEECoaQQAFIANBqBoQKQR/IANBqBogBBArGkEABUGoGiADIAQQKxpBAQsLCyEMIAMhACAJIQMgBCEJIAAhBCAFIQcgDCEFIAghACAGIQggCiEGIAAhCgwBCwsgBwRAIAEgAyACECsaBSADIAIQJAsLCQAgAEHIGxAoCywAIAAgASACECoEQCACQYgbIAIQKxoFIAJBiBsQKQRAIAJBiBsgAhArGgsLCxcAIAAgASACECsEQCACQYgbIAIQKhoLCwsAQegbIAAgARAzC7YPAQN+IAAgADUCAEL/////DyIEIAA1AgB+Qv////8PgyIDQYgbNQIAfnwiAj4CACAAIAA1AgQgAkIgiHxBjBs1AgAgA358IgI+AgQgACAANQIIIAJCIIh8QZAbNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEGUGzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxBmBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZwbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGgGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBpBs1AgAgA358IgI+AhxBqB0gAkIgiD4CACAAIAA1AgQgADUCBCAEfkL/////D4MiA0GIGzUCAH58IgI+AgQgACAANQIIIAJCIIh8QYwbNQIAIAN+fCICPgIIIAAgADUCDCACQiCIfEGQGzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxBlBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZgbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGcGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBoBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QaQbNQIAIAN+fCICPgIgQawdIAJCIIg+AgAgACAANQIIIAA1AgggBH5C/////w+DIgNBiBs1AgB+fCICPgIIIAAgADUCDCACQiCIfEGMGzUCACADfnwiAj4CDCAAIAA1AhAgAkIgiHxBkBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZQbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGYGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBnBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QaAbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGkGzUCACADfnwiAj4CJEGwHSACQiCIPgIAIAAgADUCDCAANQIMIAR+Qv////8PgyIDQYgbNQIAfnwiAj4CDCAAIAA1AhAgAkIgiHxBjBs1AgAgA358IgI+AhAgACAANQIUIAJCIIh8QZAbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGUGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBmBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZwbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGgGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBpBs1AgAgA358IgI+AihBtB0gAkIgiD4CACAAIAA1AhAgADUCECAEfkL/////D4MiA0GIGzUCAH58IgI+AhAgACAANQIUIAJCIIh8QYwbNQIAIAN+fCICPgIUIAAgADUCGCACQiCIfEGQGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBlBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZgbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGcGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBoBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QaQbNQIAIAN+fCICPgIsQbgdIAJCIIg+AgAgACAANQIUIAA1AhQgBH5C/////w+DIgNBiBs1AgB+fCICPgIUIAAgADUCGCACQiCIfEGMGzUCACADfnwiAj4CGCAAIAA1AhwgAkIgiHxBkBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZQbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGYGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBnBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QaAbNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGkGzUCACADfnwiAj4CMEG8HSACQiCIPgIAIAAgADUCGCAANQIYIAR+Qv////8PgyIDQYgbNQIAfnwiAj4CGCAAIAA1AhwgAkIgiHxBjBs1AgAgA358IgI+AhwgACAANQIgIAJCIIh8QZAbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGUGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBmBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QZwbNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGgGzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBpBs1AgAgA358IgI+AjRBwB0gAkIgiD4CACAAIAA1AhwgADUCHCAEfkL/////D4MiA0GIGzUCAH58IgI+AhwgACAANQIgIAJCIIh8QYwbNQIAIAN+fCICPgIgIAAgADUCJCACQiCIfEGQGzUCACADfnwiAj4CJCAAIAA1AiggAkIgiHxBlBs1AgAgA358IgI+AiggACAANQIsIAJCIIh8QZgbNQIAIAN+fCICPgIsIAAgADUCMCACQiCIfEGcGzUCACADfnwiAj4CMCAAIAA1AjQgAkIgiHxBoBs1AgAgA358IgI+AjQgACAANQI4IAJCIIh8QaQbNQIAIAN+fCICPgI4QcQdIAJCIIg+AgBBqB0gAEEgaiABEDILiBwBE34gBSABNQIAIgQgADUCACIOfnwiA0L/////D4MhBSAGIAA1AgQiDyAEfnwgA0IgiHwiA0L/////D4MhBiAHIAA1AggiECAEfnwgA0IgiHwiA0L/////D4MhByAIIAA1AgwiESAEfnwgA0IgiHwiA0L/////D4MhCCAJIAA1AhAiEiAEfnwgA0IgiHwiA0L/////D4MhCSAKIAA1AhQiEyAEfnwgA0IgiHwiA0L/////D4MhCiALIAA1AhgiFCAEfnwgA0IgiHwiA0L/////D4MhCyAMIAA1AhwiFSAEfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIEIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIIIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIMIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIQIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIUIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIYIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gBSAFQv////8PfkL/////D4MiBHxCIIggBiAEQv////8Pfnx8IgNC/////w+DIQUgByAEQv63+f8PfnwgA0IgiHwiA0L/////D4MhBiAIIARCgsj2nQV+fCADQiCIfCIDQv////8PgyEHIAkgBEKFsIfNAH58IANCIIh8IgNC/////w+DIQggCiAEQoiw55kDfnwgA0IgiHwiA0L/////D4MhCSALIARCyPr1zAJ+fCADQiCIfCIDQv////8PgyEKIAwgBELTzrafB358IANCIIh8IgNC/////w+DIQsgDSADQiCIfCEMIAUgDiABNQIcIgR+fCIDQv////8PgyEFIAYgBCAPfnwgA0IgiHwiA0L/////D4MhBiAHIAQgEH58IANCIIh8IgNC/////w+DIQcgCCAEIBF+fCADQiCIfCIDQv////8PgyEIIAkgBCASfnwgA0IgiHwiA0L/////D4MhCSAKIAQgE358IANCIIh8IgNC/////w+DIQogCyAEIBR+fCADQiCIfCIDQv////8PgyELIAwgBCAVfnwgA0IgiHwiA0L/////D4MhDCADQiCIIQ0gAiAFIAVC/////w9+Qv////8PgyIEfEIgiCAGIARC/////w9+fHwiA0L/////D4M+AgAgAiAHIARC/rf5/w9+fCADQiCIfCIDQv////8Pgz4CBCACIAggBEKCyPadBX58IANCIIh8IgNC/////w+DPgIIIAIgCSAEQoWwh80AfnwgA0IgiHwiA0L/////D4M+AgwgAiAKIARCiLDnmQN+fCADQiCIfCIDQv////8Pgz4CECACIAsgBELI+vXMAn58IANCIIh8IgNC/////w+DPgIUIAIgDCAEQtPOtp8HfnwgA0IgiHwiA0L/////D4M+AhggAiANIANCIIh8PgIcIAJBiBsQKQRAIAJBiBsgAhArGgsLsB0BE34gCCAANQIAIg0gDX58IgJC/////w+DIQggDCAANQIEIg8gDX4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQwgA0IgiEIBhiACQiCIfCALIAA1AggiECANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAKIAA1AgwiESANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQogA0IgiEIBhiACQiCIfCAJIAA1AhAiEiANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAHIAA1AhQiEyANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIAA1AhgiFCANfiIDQv////8Pg0IBhnx8IgJC/////w+DIQYgA0IgiEIBhiACQiCIfCAEIA0gADUCHCINfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIA4gAkIgiHwhDiAIIAhC/////w9+Qv////8PgyIDfEIgiCAMIANC/////w9+fHwiAkL/////D4MhCCALIANC/rf5/w9+fCACQiCIfCICQv////8PgyEMIAogA0KCyPadBX58IAJCIIh8IgJC/////w+DIQsgCSADQoWwh80AfnwgAkIgiHwiAkL/////D4MhCiAHIANCiLDnmQN+fCACQiCIfCICQv////8PgyEJIAYgA0LI+vXMAn58IAJCIIh8IgJC/////w+DIQcgBCADQtPOtp8HfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAwgDyAPfnwiAkL/////D4MhDCALIA8gEH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQsgA0IgiEIBhiACQiCIfCAKIA8gEX4iA0L/////D4NCAYZ8fCICQv////8PgyEKIANCIIhCAYYgAkIgiHwgCSAPIBJ+IgNC/////w+DQgGGfHwiAkL/////D4MhCSADQiCIQgGGIAJCIIh8IAcgDyATfiIDQv////8Pg0IBhnx8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIA8gFH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIA9+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEL/////D35C/////w+DIgN8QiCIIAwgA0L/////D358fCICQv////8PgyEIIAsgA0L+t/n/D358IAJCIIh8IgJC/////w+DIQwgCiADQoLI9p0FfnwgAkIgiHwiAkL/////D4MhCyAJIANChbCHzQB+fCACQiCIfCICQv////8PgyEKIAcgA0KIsOeZA358IAJCIIh8IgJC/////w+DIQkgBiADQsj69cwCfnwgAkIgiHwiAkL/////D4MhByAEIANC0862nwd+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCAOIAJCIIh8IQUgCyAQIBB+fCICQv////8PgyELIAogECARfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhCiADQiCIQgGGIAJCIIh8IAkgECASfiIDQv////8Pg0IBhnx8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAHIBAgE34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiAQIBR+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSAQfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w9+Qv////8PgyIDfEIgiCAMIANC/////w9+fHwiAkL/////D4MhCCALIANC/rf5/w9+fCACQiCIfCICQv////8PgyEMIAogA0KCyPadBX58IAJCIIh8IgJC/////w+DIQsgCSADQoWwh80AfnwgAkIgiHwiAkL/////D4MhCiAHIANCiLDnmQN+fCACQiCIfCICQv////8PgyEJIAYgA0LI+vXMAn58IAJCIIh8IgJC/////w+DIQcgBCADQtPOtp8HfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAogESARfnwiAkL/////D4MhCiAJIBEgEn4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQkgA0IgiEIBhiACQiCIfCAHIBEgE34iA0L/////D4NCAYZ8fCICQv////8PgyEHIANCIIhCAYYgAkIgiHwgBiARIBR+IgNC/////w+DQgGGfHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSARfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w9+Qv////8PgyIDfEIgiCAMIANC/////w9+fHwiAkL/////D4MhCCALIANC/rf5/w9+fCACQiCIfCICQv////8PgyEMIAogA0KCyPadBX58IAJCIIh8IgJC/////w+DIQsgCSADQoWwh80AfnwgAkIgiHwiAkL/////D4MhCiAHIANCiLDnmQN+fCACQiCIfCICQv////8PgyEJIAYgA0LI+vXMAn58IAJCIIh8IgJC/////w+DIQcgBCADQtPOtp8HfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAkgEiASfnwiAkL/////D4MhCSAHIBIgE34iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQcgA0IgiEIBhiACQiCIfCAGIBIgFH4iA0L/////D4NCAYZ8fCICQv////8PgyEGIANCIIhCAYYgAkIgiHwgBCANIBJ+IgNC/////w+DQgGGfHwiAkL/////D4MhBCAFIANCIIhCAYYgAkIgiHx8IgJC/////w+DIQUgAkIgiCEOIAggCEL/////D35C/////w+DIgN8QiCIIAwgA0L/////D358fCICQv////8PgyEIIAsgA0L+t/n/D358IAJCIIh8IgJC/////w+DIQwgCiADQoLI9p0FfnwgAkIgiHwiAkL/////D4MhCyAJIANChbCHzQB+fCACQiCIfCICQv////8PgyEKIAcgA0KIsOeZA358IAJCIIh8IgJC/////w+DIQkgBiADQsj69cwCfnwgAkIgiHwiAkL/////D4MhByAEIANC0862nwd+fCACQiCIfCICQv////8PgyEGIAUgAkIgiHwiAkL/////D4MhBCAOIAJCIIh8IQUgByATIBN+fCICQv////8PgyEHIAYgEyAUfiIDQv////8Pg0IBhnwgAkIgiHwiAkL/////D4MhBiADQiCIQgGGIAJCIIh8IAQgDSATfiIDQv////8Pg0IBhnx8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w9+Qv////8PgyIDfEIgiCAMIANC/////w9+fHwiAkL/////D4MhCCALIANC/rf5/w9+fCACQiCIfCICQv////8PgyEMIAogA0KCyPadBX58IAJCIIh8IgJC/////w+DIQsgCSADQoWwh80AfnwgAkIgiHwiAkL/////D4MhCiAHIANCiLDnmQN+fCACQiCIfCICQv////8PgyEJIAYgA0LI+vXMAn58IAJCIIh8IgJC/////w+DIQcgBCADQtPOtp8HfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAYgFCAUfnwiAkL/////D4MhBiAEIA0gFH4iA0L/////D4NCAYZ8IAJCIIh8IgJC/////w+DIQQgBSADQiCIQgGGIAJCIIh8fCICQv////8PgyEFIAJCIIghDiAIIAhC/////w9+Qv////8PgyIDfEIgiCAMIANC/////w9+fHwiAkL/////D4MhCCALIANC/rf5/w9+fCACQiCIfCICQv////8PgyEMIAogA0KCyPadBX58IAJCIIh8IgJC/////w+DIQsgCSADQoWwh80AfnwgAkIgiHwiAkL/////D4MhCiAHIANCiLDnmQN+fCACQiCIfCICQv////8PgyEJIAYgA0LI+vXMAn58IAJCIIh8IgJC/////w+DIQcgBCADQtPOtp8HfnwgAkIgiHwiAkL/////D4MhBiAFIAJCIIh8IgJC/////w+DIQQgDiACQiCIfCEFIAQgDSANfnwiAkL/////D4MhBCAFIAJCIIh8IgJC/////w+DIQUgAkIgiCEOIAEgCCAIQv////8PfkL/////D4MiA3xCIIggDCADQv////8Pfnx8IgJC/////w+DPgIAIAEgCyADQv63+f8PfnwgAkIgiHwiAkL/////D4M+AgQgASAKIANCgsj2nQV+fCACQiCIfCICQv////8Pgz4CCCABIAkgA0KFsIfNAH58IAJCIIh8IgJC/////w+DPgIMIAEgByADQoiw55kDfnwgAkIgiHwiAkL/////D4M+AhAgASAGIANCyPr1zAJ+fCACQiCIfCICQv////8Pgz4CFCABIAQgA0LTzrafB358IAJCIIh8IgJC/////w+DPgIYIAEgBSACQiCIfCICQv////8Pgz4CHCAOIAJCIIh8pwRAIAFBiBsgARArGgUgAUGIGxApBEAgAUGIGyABECsaCwsLCgAgACAAIAEQNgsLACAAQagbIAEQNgsVACAAQaghECRByCEQJUGoISABEDULEQAgAEHoIRA6QeghQagcECkLIwAgABAmBEBBAA8LIABBiCIQOkGIIkGoHBApBEBBfw8LQQELFwAgACABEDogAUGIGyABEDAgASABEDkLCQBByBsgABAkC7wBAQJ/IAIQJUEgIQMDQCABIANPBEAgA0EgRgRAQagiED4FQagiQagbQagiEDYLIABBqCJByCIQNiACQcgiIAIQMiAAQSBqIQAgA0EgaiEDDAELCyABQR9xIgRFBEAPC0HIIhAlQQAhAQNAIAEgBEZFBEAgASAALQAAOgDIIiAAQQFqIQAgAUEBaiEBDAELCyADQSBGBEBBqCIQPgVBqCJBqBtBqCIQNgtByCJBqCJByCIQNiACQcgiIAIQMgscACABIAJB6CIQP0HoIkHoIhA5IABB6CIgAxA2C+EBAQJ/QQBBACgCACIFIAJBAWpBBXRqNgIAIAUQPiAFQSBqIQUDQCACIAZHBEAgABAmBEAgBUEgayAFECQFIAAgBUEgayAFEDYLIAAgAWohACAFQSBqIQUgBkEBaiEGDAELCyAAIAFrIQAgAyACQQFrIARsaiECIAVBIGsiBSAFED0DQCAGBEAgABAmBEAgBSAFQSBrECQgAhAlBSAFQSBrQYgjECQgBSAAIAVBIGsQNiAFQYgjIAIQNgsgACABayEAIAIgBGshAiAFQSBrIQUgBkEBayEGDAELC0EAIAU2AgALLQEBfwNAIAEgA0ZFBEAgACACEDkgAEEgaiEAIAJBIGohAiADQQFqIQMMAQsLCy0BAX8DQCABIANGRQRAIAAgAhA6IABBIGohACACQSBqIQIgA0EBaiEDDAELCwuXAgAgAkUEQCADED4PCyAAQagjECQgAxA+A0AgAkEBayICIAFqLQAAIQAgAyADEDcgAEGAAU8EQCADQagjIAMQNiAAQYABayEACyADIAMQNyAAQcAATwRAIANBqCMgAxA2IABBQGohAAsgAyADEDcgAEEgTwRAIANBqCMgAxA2IABBIGshAAsgAyADEDcgAEEQTwRAIANBqCMgAxA2IABBEGshAAsgAyADEDcgAEEITwRAIANBqCMgAxA2IABBCGshAAsgAyADEDcgAEEETwRAIANBqCMgAxA2IABBBGshAAsgAyADEDcgAEECTwRAIANBqCMgAxA2IABBAmshAAsgAyADEDcgAARAIANBqCMgAxA2CyACDQALC9UBAQF/IAAQJgRAIAEQJQ8LQSAhAkHoHEHIIxAkIABByBxBIEHoIxBEIABBiB1BIEGIJBBEA0BB6CNByBsQKEUEQEHoI0GoJBA3QQEhAANAQagkQcgbEChFBEBBqCRBqCQQNyAAQQFqIQAMAQsLQcgjQcgkECQgAiAAa0EBayECA0AgAgRAQcgkQcgkEDcgAkEBayECDAELCyAAIQJByCRByCMQN0HoI0HII0HoIxA2QYgkQcgkQYgkEDYMAQsLQYgkEDsEQEGIJCABEDQFQYgkIAEQJAsLIAAgABAmBEBBAQ8LIABBiBxBIEHoJBBEQegkQcgbECgLFQAgACABQYglEDZBiCVBqBsgAhA2CwoAIAAgACABEEcLCwAgAEGIGyABEDALCQAgAEGoHBApCw4AIAAQAiAAQTBqEAJxCwoAIABB4ABqEAILDQAgABABIABBMGoQAQsVACAAEAEgAEEwahAbIABB4ABqEAELegAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1gLugEAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYIAEgACkDYDcDYCABIAApA2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeCABIAApA4ABNwOAASABIAApA4gBNwOIAQsoACAAEEsEQCABEE4FIAFB4ABqEBsgAEEwaiABQTBqEAAgACABEAALCxUAIAAgARAEIABBMGogAUEwahAEcQtyAQF/IAAQTARAIAEQSw8LIAEQSwRAQQAPCyAAQeAAaiICEA4EQCAAIAEQUg8LIAJB2CUQFCABQdglQYgmEBMgAkHYJUG4JhATIAFBMGpBuCZB6CYQEyAAQYgmEAQEQCAAQTBqQegmEAQE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AEEwaiABQTBqEBELIgAgACABEAAgAEEwaiABQTBqEBEgAEHgAGogAUHgAGoQAAsSACABQeg+EFogAEHoPiACEFcLEgAgAUH4PxBaIABB+D8gAhBYCxQAIAFBiMEAEFsgAEGIwQAgAhBZCxQAIAAgARAXIABBMGogAUEwahAXCyIAIAAgARAXIABBMGogAUEwahAXIABB4ABqIAFB4ABqEBcLFAAgACABEBYgAEEwaiABQTBqEBYLIgAgACABEBYgAEEwaiABQTBqEBYgAEHgAGogAUHgAGoQFgtTACAAEEwEQCABEAEgAUEwahABBSAAQeAAakGYwgAQGkGYwgBByMIAEBRBmMIAQcjCAEH4wgAQEyAAQcjCACABEBMgAEEwakH4wgAgAUEwahATCws4ACAAQTBqQajDABAUIABB2MMAEBQgAEHYwwBB2MMAEBNB2MMAQaglQdjDABAPQajDAEHYwwAQBAsQACAAQYjEABBjQYjEABBkC5gBAQN/QQBBACgCACIEIAFBMGxqNgIAIABB4ABqQZABIAEgBEEwEB4gBCEDA0AgASAFRwRAIAMQAgRAIAIQASACQTBqEAEFIAMgAEEwakHoxAAQEyADIAMQFCADIAAgAhATIANB6MQAIAJBMGoQEwsgAEGQAWohACACQeAAaiECIANBMGohAyAFQQFqIQUMAQsLQQAgBDYCAAtUACAAEEwEQCABEE4FIABB4ABqQZjFABAaQZjFAEHIxQAQFEGYxQBByMUAQfjFABATIABByMUAIAEQEyAAQTBqQfjFACABQTBqEBMgAUHgAGoQGwsLMgAgASACakEBayEBA0AgASACSEUEQCABIAAtAAA6AAAgAUEBayEBIABBAWohAAwBCwsLLQAgABBLBEAgARBNDwsgAEGoxgAQX0GoxgBBMCABEGhB2MYAQTAgAUEwahBoC0MAIAAQSwRAIAEQASABQcAAOgAADwsgAEGIxwAQF0GIxwBBMCABEGggAEEwahAZQX9GBEAgASABLQAAQYABcjoAAAsLMgAgAC0AAEHAAHEEQCABEE0PCyAAQTBBuMcAEGggAEEwakEwQejHABBoQbjHACABEGELwQEBAn8gAC0AACICQcAAcQRAIAEQTQ8LIAJBgAFxIQMgAEHIyAAQAEHIyAAgAkE/cToAAEHIyABBMEGYyAAQaEGYyAAg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A2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeCABIAApA4ABNwOAASABIAApA4gBNwOIASABIAApA5ABNwOQASABIAApA5gBNwOYASABIAApA6ABNwOgASABIAApA6gBNwOoASABIAApA7ABNwOwASABIAApA7gBNwO4AQuSAwAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBIAEgACkDkAE3A5ABIAEgACkDmAE3A5gBIAEgACkDoAE3A6ABIAEgACkDqAE3A6gBIAEgACkDsAE3A7ABIAEgACkDuAE3A7gBIAEgACkDwAE3A8ABIAEgACkDyAE3A8gBIAEgACkD0AE3A9ABIAEgACkD2AE3A9gBIAEgACkD4AE3A+ABIAEgACkD6AE3A+gBIAEgACkD8AE3A/ABIAEgACkD+AE3A/gBIAEgACkDgAI3A4ACIAEgACkDiAI3A4gCIAEgACkDkAI3A5ACIAEgACkDmAI3A5gCCy8AIAAQmwEEQCABEJ4BBSABQcABahCLASAAQeAAaiABQeAAahCMASAAIAEQjAELCxcAIAAgARBSIABB4ABqIAFB4ABqEFJxC4YBAQF/IAAQnAEEQCABEJsBDwsgARCbAQRAQQAPCyAAQcABaiICEIoBBEAgACABEKIBDwsgAkHYhwEQjwEgAUHYhwFBuIgBEI0BIAJB2IcBQZiJARCNASABQeAAakGYiQFB+IkBEI0BIABBuIgBEFIEQCAAQeAAakH4iQEQUgRAQQEPCwtBAAvQAQECfyAAEJwBBEAgARCcAQ8LIAEQnAEEQEEADwsgAEHAAWoiAhCKAQRAIAEgABCjAQ8LIAFBwAFqIgMQigEEQCAAIAEQowEPCyACQdiKARCPASADQbiLARCPASAAQbiLAUGYjAEQjQEgAUHYigFB+IwBEI0BIAJB2IoBQdiNARCNASADQbiLAUG4jgEQjQEgAEHgAGpBuI4BQZiPARCNASABQeAA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AEHgAGoQTSAAQcABahBNCycAIAAgARCMASAAQeAAaiABQeAAahCMASAAQcABaiABQcABahCMAQvlAgAgACABQYjcAhCNASAAQeAAaiABQeAAakHo3AIQjQEgAEHAAWogAUHAAWpByN0CEI0BIAAgAEHgAGpBqN4CEJABIAEgAUHgAGpBiN8CEJABIAAgAEHAAWpB6N8CEJABIAEgAUHAAWpByOACEJABIABB4ABqIABBwAFqQajhAhCQASABQeAAaiABQcABakGI4gIQkAFBiNwCQejcAkHo4gIQkAFBiNwCQcjdAkHI4wIQkAFB6NwCQcjdAkGo5AIQkAFBqOECQYjiAiACEI0BIAJBqOQCIAIQkQEgAiACEOQBQYjcAiACIAIQkAFBqN4CQYjfAiACQeAAahCNASACQeAAakHo4gIgAkHgAGoQkQFByN0CQYjlAhDkASACQeAAakGI5QIgAkHgAGoQkAFB6N8CQcjgAiACQcABahCNASACQcABakHI4wIgAkHAAWoQkQEgAkHAAWpB6NwCIAJBwAFqEJABC4ECACAAQejlAhCPASAAIABB4ABqQcjmAhCNAUHI5gJByOYCQajnAhCQASAAIABB4ABqQYjoAhCRAUGI6AIgAEHAAWpBiOgCEJABQYjoAkGI6AIQjwEgAEHgAGogAEHAAWpB6OgCEI0BQejoAkHo6AJByOkCEJABIABBwAFqQajqAhCPAUHI6QIgARDkAUHo5QIgASABEJABQajqAiABQeAAahDkAUGo5wIgAUHgAGogAUHgAGoQkAFB6OUCQajqAiABQcABahCQAUHI6QIgAUHAAWogAUHAAWoQkQFBiOgCIAFBwAFqIAFBwAFqEJABQajnAiABQcABaiABQcABahCQAQs1ACAAIAEgAhCQASAAQeAAaiABQeAAaiACQeAAahCQASAAQcABaiABQcABaiACQcABahCQAQs1ACAAIAEgAhCRASAAQeAAaiABQeAAaiACQeAAahCRASAAQcABaiABQcABaiACQcABahCRAQsnACAAIAEQkgEgAEHgAGogAUHgAGoQkgEgAEHAAWogAUHAAWoQkgELKwEBfyAAQcABahCVASIBBEAgAQ8LIABB4ABqEJUBIgEEQCABDwsgABCVAQsmACAAIAEQUiAAQeAAaiABQeAAahBScSAAQcABaiABQcAB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QeAAaiABIAJBwAFqEI0BQcjRAyABIAIQjQEgAiACQcABaiACEJEBIAIgAhDkAUHo0AMgASACQeAAahCNASACQeAAaiACQcABaiACQeAAahCRAQvsAQAgACABQajSAxCNASAAQeAAaiACQYjTAxCNASAAIABB4ABqQejTAxCQASAAIABBwAFqQcjUAxCQASAAQeAAaiAAQcABaiADEJABIAMgAiADEI0BIANBiNMDIAMQkQEgAyADEOQBIANBqNIDIAMQkAEgASACIANB4ABqEJABIANB4ABqQejTAyADQeAAahCNASADQeAAakGo0gMgA0HgAGoQkQEgA0HgAGpBiNMDIANB4ABqEJEBQcjUAyABIANBwAFqEI0BIANBwAFqQajSAyADQcABahCRASADQcABakGI0wMgA0HAAWoQkAELkAEAIAAgASACQajVAxCPAiAAQaACaiADQcjXAxCOAiACIANB6NkDEJABIABBoAJqIAAgBEGgAmoQ7AEgBEGgAmogAUHo2QMgBEGgAmoQjwIgBEGgAmpBqNUDIARBoAJqEO0BIARBoAJqQcjXAyAEQaACahDtAUHI1wMgBBDpASAEIAQQ9gEgBEGo1QMgBBDsAQtQACABIABBMGpByNoDEBMgAUEwaiAAQTBqQfjaAxATIAFB4ABqIABBqNsDEBMgAUGQAWogAEHY2wMQEyACIAFBwAFqQajbA0HI2gMgAhCQAgtsACAAQYj+BCABEI0BIABB4ABqQej+BCABQeAAahCNASAAQcABakHI/wQgAUHAAWoQjQEgAEGgAmpBqIAFIAFBoAJqEI0BIABBgANqQYiBBSABQYADahCNASAAQeADakHogQUgAUHgA2oQjQELigIAIAAgARAAIABBMGogAUEwahARIAFByIIFIAEQjQEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahARIAFB4ABqQaiDBSABQeAAahCNASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBEgAUHAAWpBiIQFIAFBwAFqEI0BIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQESABQaACakHohAUgAUGgAmoQjQEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahARIAFBgANqQciFBSABQYADahCNASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBEgAUHgA2pBqIYFIAFB4ANqEI0BC2wAIABBiIcFIAEQjQEgAEHgAGpB6IcFIAFB4ABqEI0BIABBwAFqQciIBSABQcABahCNASAAQaACakGoiQUgAUGgAmoQjQEgAEGAA2pBiIoFIAFBgANqEI0BIABB4ANqQeiKBSABQeADahCNAQuKAgAgACABEAAgAEEwaiABQTBqEBEgAUHIiwUgARCNASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBEgAUHgAGpBqIwFIAFB4ABqEI0BIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQESABQcABakGIjQUgAUHAAWoQjQEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahARIAFBoAJqQeiNBSABQaACahCNASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBEgAUGAA2pByI4FIAFBgANqEI0BIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQESABQeADakGojwUgAUHgA2oQjQELbAAgAEGIkAUgARCNASAAQeAAakHokAUgAUHgAGoQjQEgAEHAAWpByJEFIAFBwAFqEI0BIABBoAJqQaiSBSABQaACahCNASAAQYADakGIkwUgAUGAA2oQjQEgAEHgA2pB6JMFIAFB4ANqEI0BC4oCACAAIAEQACAAQTBqIAFBMGoQESABQciUBSABEI0BIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQESABQeAAakGolQUgAUHgAGoQjQEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahARIAFBwAFqQYiWBSABQcABahCNASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBEgAUGgAmpB6JYFIAFBoAJqEI0BIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQESABQYADakHIlwUgAUGAA2oQjQEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahARIAFB4ANqQaiYBSABQeADahCNAQtsACAAQYiZBSABEI0BIABB4ABqQeiZBSABQeAAahCNASAAQcABakHImgUgAUHAAWoQjQEgAEGgAmpBqJsFIAFBoAJqEI0BIABBgANqQYicBSABQYADahCNASAAQeADakHonAUgAUHgA2oQjQELigIAIAAgARAAIABBMGogAUEwahARIAFByJ0FIAEQjQEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahARIAFB4ABqQaieBSABQeAAahCNASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBEgAUHAAWpBiJ8FIAFBwAFqEI0BIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQESABQaACakHonwUgAUGgAmoQjQEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahARIAFBgANqQcigBSABQYADahCNASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBEgAUHgA2pBqKEFIAFB4ANqEI0BC2wAIABBiKIFIAEQjQEgAEHgAGpB6KIFIAFB4ABqEI0BIABBwAFqQcijBSABQcABahCNASAAQaACakGopAUgAUGgAmoQjQEgAEGAA2pBiKUFIAFBgANqEI0BIABB4ANqQeilBSABQeADahCNAQuKAgAgACABEAAgAEEwaiABQTBqEBEgAUHIpgUgARCNASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBEgAUHgAGpBqKcFIAFB4ABqEI0BIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQESABQcABakGIqAUgAUHAAWoQjQEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahARIAFBoAJqQeioBSABQaACahCNASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBEgAUGAA2pByKkFIAFBgANqEI0BIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQESABQeADakGoqgUgAUHgA2oQjQELgwEAIAAQSwRAQQEPCyAAEGRFBEBBAA8LIABBiKsFQfirBRATIABBMGpBqKwFEAAgAEG4qwVBiK0FEBMgAEEwakG4rQUQAEH4qwVB+KsFEFVB+KsFIABB+KsFEF1B+KsFQYitBUH4qwUQXUH4qwVB6KsFQRBB+KsFEHhB+KsFQYitBRBTCxEAIABB6K0FEGNB6K0FEJwCC7MCACAAEJsBBEBBAQ8LIAAQtAFFBEBBAA8LIABByK4FQfCwBRCNASAAQeAAakHIrgVB0LEFEI0BQfCwBUGorwVBsLIFEI4BQdCxBUGQswUQkgFB8LAFQfCzBRCSAUHQsQVB2K8FQdC0BRCNAUGwsgVB4LIF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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHongMLoAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQYi8AwugAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBqNADC0AAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAB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";
var pG1b = 4776;
var pG1gen = 42968;
var pG1zero = 43112;
var pG2b = 17272;
var pG2gen = 43256;
var pG2zero = 43544;
var pOneT = 43832;
var pr = 3464;
var preQSize = 20448;
var q = "4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559787";
var r = "52435875175126190479447740508185965837690552500527637822603658699938581184513";
//#endregion
//#region src/bls12381.js
var curve_bls12381 = null;
async function buildBls12381(singleThread, plugins) {
	if (!singleThread && curve_bls12381) return curve_bls12381;
	const bls12381wasm = {};
	if (!plugins) {
		bls12381wasm.code = base64ToUint8Array(code);
		bls12381wasm.pq = 712;
		bls12381wasm.pr = pr;
		bls12381wasm.pG1gen = pG1gen;
		bls12381wasm.pG1zero = pG1zero;
		bls12381wasm.pG1b = pG1b;
		bls12381wasm.pG2gen = pG2gen;
		bls12381wasm.pG2zero = pG2zero;
		bls12381wasm.pG2b = pG2b;
		bls12381wasm.pOneT = pOneT;
		bls12381wasm.prePSize = 288;
		bls12381wasm.preQSize = preQSize;
		bls12381wasm.n8q = 48;
		bls12381wasm.n8r = 32;
		bls12381wasm.q = q;
		bls12381wasm.r = r;
	} else {
		const { ModuleBuilder } = await import("wasmbuilder");
		const { buildBls12381: buildBls12381wasm } = await import("wasmcurves");
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
	bls12381wasm.batchCode = base64ToUint8Array(code$1);
	bls12381wasm.glv = true;
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
	curve.terminate = async function() {
		if (!params.singleThread) {
			curve_bls12381 = null;
			await this.tm.terminate();
		}
	};
	if (!singleThread) curve_bls12381 = curve;
	return curve;
}
//#endregion
//#region src/curves.js
var bls12381r = e("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
var bn128r = e("21888242871839275222246405745257275088548364400416034343698204186575808495617");
var bls12381q = e("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16);
var bn128q = e("21888242871839275222246405745257275088696311157297823662689037894645226208583");
async function getCurveFromR(r, singleThread, plugins) {
	let curve;
	if (eq(r, bn128r)) curve = await buildBn128(singleThread, plugins);
	else if (eq(r, bls12381r)) curve = await buildBls12381(singleThread, plugins);
	else throw new Error(`Curve not supported: ${toString(r)}`);
	return curve;
}
async function getCurveFromQ(q, singleThread, plugins) {
	let curve;
	if (eq(q, bn128q)) curve = await buildBn128(singleThread, plugins);
	else if (eq(q, bls12381q)) curve = await buildBls12381(singleThread, plugins);
	else throw new Error(`Curve not supported: ${toString(q, 16)}`);
	return curve;
}
async function getCurveFromName(name, singleThread, plugins) {
	let curve;
	const normName = normalizeName(name);
	if ([
		"BN128",
		"BN254",
		"ALTBN128"
	].indexOf(normName) >= 0) curve = await buildBn128(singleThread, plugins);
	else if (["BLS12381"].indexOf(normName) >= 0) curve = await buildBls12381(singleThread, plugins);
	else throw new Error(`Curve not supported: ${name}`);
	return curve;
	function normalizeName(n) {
		return n.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
	}
}
//#endregion
//#region main.js
var Scalar = scalar_exports;
var utils = utils_exports;
//#endregion
export { BigBuffer, ChaCha, EC, ZqField as F1Field, ZqField, F2Field, F3Field, PolField, Scalar, buildBls12381, buildBn128, getCurveFromName, getCurveFromQ, getCurveFromR, utils };
