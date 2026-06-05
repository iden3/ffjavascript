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
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
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
		else if (1 << nbits !== n) throw new Error(`Internal errlr: ${n} should equal ${1 << nbits}`);
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
			for (let i = 0; i < m; i++) if (this.F.eq(this.roots[bits][0], t)) {
				u[i] = this.F.one;
				return u;
			}
		}
		const z = this.F.sub(tm, this.F.one);
		let l = this.F.mul(z, this.F.inv(this.F.e(m)));
		for (let i = 0; i < m; i++) {
			u[i] = this.F.mul(l, this.F.inv(this.F.sub(t, this.roots[bits][i])));
			l = this.F.mul(l, omega);
		}
		return u;
	}
	log2(V) {
		return log2$2(V);
	}
};
function log2$2(V) {
	return ((V & 4294901760) !== 0 ? (V &= 4294901760, 16) : 0) | ((V & 4278255360) !== 0 ? (V &= 4278255360, 8) : 0) | ((V & 4042322160) !== 0 ? (V &= 4042322160, 4) : 0) | ((V & 3435973836) !== 0 ? (V &= 3435973836, 2) : 0) | (V & 2863311530) !== 0;
}
function __fft$1(PF, pall, bits, offset, step) {
	const n = 1 << bits;
	if (n == 1) return [pall[offset]];
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
	else if (n[n.length - 1] == -1) res = F.neg(base);
	else throw new Error("invlaud NAF");
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
		else throw new Error("Field withot sqrt");
		else if (eq(mod(F.p, 8), 5)) alg3_atkin(F);
		else throw new Error("Field withot sqrt");
		else if (eq(mod(F.p, 4), 3)) alg2_shanks(F);
	} else {
		const pm2mod4 = mod(pow(F.p, F.m / 2), 4);
		if (pm2mod4 == 1) alg10_adj(F);
		else if (pm2mod4 == 3) alg9_adj(F);
		else alg8_complex(F);
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
		if (n % 2 == 1) return F.conjugate(x);
		else return x;
	};
	F.sqrt = function(a) {
		const F = this;
		const a1 = F.pow(a, F.sqrt_e34);
		const alfa = F.mul(F.square(a1), a);
		const a0 = F.mul(F.frobenius(1, alfa), alfa);
		if (F.eq(a0, F.negone)) return null;
		const x0 = F.mul(a1, a);
		let x;
		if (F.eq(alfa, F.negone)) x = F.mul(x0, [F.F.zero, F.F.one]);
		else {
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
		this.state[13] = this.state[13] + 1 >>> 0;
		if (this.state[13] != 0) return;
		this.state[14] = this.state[14] + 1 >>> 0;
		if (this.state[14] != 0) return;
		this.state[15] = this.state[15] + 1 >>> 0;
	}
};
//#endregion
//#region __vite-browser-external
var require___vite_browser_external = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
}));
//#endregion
//#region src/random.js
function getRandomBytes(n) {
	let array = new Uint8Array(n);
	if (typeof globalThis.crypto !== "undefined") globalThis.crypto.getRandomValues(array);
	else if (typeof __require === "function") require___vite_browser_external().randomFillSync(array);
	else throw new Error("No cryptographically secure random source available.");
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
		if (p.length != m) throw new Error("Size must be multiple of 2");
		return __fft(this, p, bits, 0, 1);
	}
	ifft(p) {
		if (p.length <= 1) return p;
		const bits = log2$1(p.length - 1) + 1;
		this._setRoots(bits);
		const m = 1 << bits;
		if (p.length != m) throw new Error("Size must be multiple of 2");
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
	if (n == 1) return [pall[offset]];
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
			this.F.fromRprLE(buff, o + this.n8),
			this.F.fromRprLE(buff, o + this.n8 * 2)
		];
	}
	fromRprBE(buff, o) {
		o = o || 0;
		const c2 = this.F.fromRprBE(buff, o);
		const c1 = this.F.fromRprBE(buff, o + this.n8);
		return [
			this.F.fromRprBE(buff, o + this.n8 * 2),
			c1,
			c2
		];
	}
	fromRprLEM(buff, o) {
		o = o || 0;
		return [
			this.F.fromRprLEM(buff, o),
			this.F.fromRprLEM(buff, o + this.n8),
			this.F.fromRprLEM(buff, o + this.n8 * 2)
		];
	}
	fromRprBEM(buff, o) {
		o = o || 0;
		const c2 = this.F.fromRprBEM(buff, o);
		const c1 = this.F.fromRprBEM(buff, o + this.n8);
		return [
			this.F.fromRprBEM(buff, o + this.n8 * 2),
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
		if (this.cofactor) P = this.mulScalar(P, this.cofactor);
		P = this.affine(P);
		return P;
	}
	toRprLE(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff, o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprLE(buff, o, p[0]);
		this.F.toRprLE(buff, o + this.F.n8, p[1]);
	}
	toRprBE(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff, o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprBE(buff, o, p[0]);
		this.F.toRprBE(buff, o + this.F.n8, p[1]);
	}
	toRprLEM(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff, o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprLEM(buff, o, p[0]);
		this.F.toRprLEM(buff, o + this.F.n8, p[1]);
	}
	toRprLEJM(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff, o, this.F.n8 * 2).fill(0);
			return;
		}
		this.F.toRprLEM(buff, o, p[0]);
		this.F.toRprLEM(buff, o + this.F.n8, p[1]);
		this.F.toRprLEM(buff, o + 2 * this.F.n8, p[2]);
	}
	toRprBEM(buff, o, p) {
		p = this.affine(p);
		if (this.isZero(p)) {
			new Uint8Array(buff, o, this.F.n8 * 2).fill(0);
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
		const v = new Uint8Array(buff.buffer, o, F.n8);
		if (v[0] & 64) return this.zero;
		const P = new Array(3);
		const greatest = (v[0] & 128) != 0;
		v[0] = v[0] & 127;
		P[0] = F.fromRprBE(buff, o);
		if (greatest) v[0] = v[0] | 128;
		const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
		P[1] = F.sqrt(x3b);
		if (P[1] === null) throw new Error("Invalid Point!");
		if (greatest ^ isGreatest(F, P[1])) P[1] = F.neg(P[1]);
		P[2] = F.one;
		return P;
	}
	toRprCompressed(buff, o, p) {
		p = this.affine(p);
		const v = new Uint8Array(buff.buffer, o, this.F.n8);
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
	if (n != 1 << bits) throw new Error("Invalid number of pointers");
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
var PAGE_SIZE = typeof Buffer !== "undefined" && Buffer.constants && Buffer.constants.MAX_LENGTH ? Buffer.constants.MAX_LENGTH : 1 << 30;
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
		if (firstPage == Math.floor((offset + len - 1) / PAGE_SIZE)) if (buff instanceof BigBuffer && buff.buffers.length == 1) return this.buffers[firstPage].set(buff.buffers[0], offset % PAGE_SIZE);
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
		if (this.n64 * 8 != this.n8) throw new Error("n8 must be a multiple of 8");
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
		if (!this.eq(this.w[0], this.one)) throw new Error("Error calculating roots of unity");
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
		if (nPoints * sIn !== buffIn.byteLength) throw new Error("Invalid buffer size");
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
		if (buffIn instanceof BigBuffer) fullBuffOut = new BigBuffer(nPoints * sOut);
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
			res.set(c2, this.F.n8 * 2);
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
		return this.getBuff(this.pOp3, this.n8);
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
		else if (a.byteLength == this.F.n8 * 2) if (b.byteLength == this.F.n8 * 3) return this.op2("_subMixed", b, a);
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
		if (a.byteLength == this.F.n8 * 3) return a.slice();
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
/**
* Worker task logic used by workerpool.
*
* This module exports a plain function that encapsulates all wasm helper
* utilities (alloc, runTask, init).  The function can be:
*   1. Called directly in single-thread mode (returns the runTask function).
*   2. Stringified and embedded into a workerpool worker script for
*      multi-thread mode (browser or Node.js).
*
* The exported function accepts no arguments when used as factory and returns
* the runTask function, which can then be registered with workerpool.worker().
*/
function thread() {
	const MAXMEM = 32767;
	let instance;
	let memory;
	let _u32 = null;
	let _u8 = null;
	function getU32() {
		if (_u32 === null || _u32.buffer !== memory.buffer) _u32 = new Uint32Array(memory.buffer, 0, 1);
		return _u32;
	}
	function getU8() {
		if (_u8 === null || _u8.buffer !== memory.buffer) _u8 = new Uint8Array(memory.buffer);
		return _u8;
	}
	async function init(data) {
		let wasmModule;
		if (data.code instanceof WebAssembly.Module) wasmModule = data.code;
		else wasmModule = await WebAssembly.compile(new Uint8Array(data.code));
		memory = new WebAssembly.Memory({
			initial: data.init,
			maximum: MAXMEM
		});
		_u32 = null;
		_u8 = null;
		instance = await WebAssembly.instantiate(wasmModule, { env: { memory } });
	}
	function alloc(length) {
		const u32 = getU32();
		u32[0] = u32[0] + 3 & -4;
		const res = u32[0];
		u32[0] += length;
		if (u32[0] + length > memory.buffer.byteLength) {
			const currentPages = memory.buffer.byteLength / 65536;
			let requiredPages = Math.floor((u32[0] + length) / 65536) + 1;
			if (requiredPages > MAXMEM) requiredPages = MAXMEM;
			memory.grow(requiredPages - currentPages);
		}
		return res;
	}
	function allocBuffer(buffer) {
		const src = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
		const p = alloc(src.byteLength);
		getU8().set(src, p);
		return p;
	}
	function getBuffer(pointer, length) {
		return new Uint8Array(memory.buffer, pointer, length);
	}
	function setBuffer(pointer, buffer) {
		getU8().set(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer), pointer);
	}
	function runTask(task) {
		if (task[0].cmd === "INIT") return init(task[0]);
		const vars = [];
		const out = [];
		const oldAlloc = getU32()[0];
		for (let i = 0; i < task.length; i++) {
			const step = task[i];
			switch (step.cmd) {
				case "ALLOCSET":
					vars[step.var] = allocBuffer(step.buff);
					break;
				case "ALLOC":
					vars[step.var] = alloc(step.len);
					break;
				case "SET":
					setBuffer(vars[step.var], step.buff);
					break;
				case "CALL": {
					const paramDefs = step.params;
					const params = new Array(paramDefs.length);
					for (let j = 0; j < paramDefs.length; j++) {
						const p = paramDefs[j];
						params[j] = p.var !== void 0 ? vars[p.var] + (p.offset || 0) : p.val;
					}
					instance.exports[step.fnName](...params);
					break;
				}
				case "GET":
					out[step.out] = getBuffer(vars[step.var], step.len).slice();
					break;
				default: throw new Error("Invalid cmd: " + step.cmd);
			}
		}
		getU32()[0] = oldAlloc;
		return out;
	}
	return runTask;
}
/**
* workerpool.js
* https://github.com/josdejong/workerpool
*
* Offload tasks to a pool of workers on node.js and in the browser.
*
* @version 10.0.1
* @date    2025-11-19
*
* @license
* Copyright (C) 2014-2022 Jos de Jong <wjosdejong@gmail.com>
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License. You may obtain a copy
* of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/
//#endregion
//#region \0virtual:worker-script
var import_workerpool = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.workerpool = {}));
	})(exports, (function(exports$2) {
		"use strict";
		var src = {};
		var environment$1 = { exports: {} };
		(function(module$1) {
			var isNode = function isNode(nodeProcess) {
				return typeof nodeProcess !== "undefined" && nodeProcess.versions != null && nodeProcess.versions.node != null && nodeProcess + "" === "[object process]";
			};
			module$1.exports.isNode = isNode;
			module$1.exports.platform = typeof process !== "undefined" && isNode(process) ? "node" : "browser";
			var worker_threads = module$1.exports.platform === "node" && require___vite_browser_external();
			module$1.exports.isMainThread = module$1.exports.platform === "node" ? (!worker_threads || worker_threads.isMainThread) && !process.connected : typeof Window !== "undefined";
			module$1.exports.cpus = module$1.exports.platform === "browser" ? self.navigator.hardwareConcurrency : require___vite_browser_external().cpus().length;
		})(environment$1);
		var environmentExports = environment$1.exports;
		function _arrayLikeToArray(r, a) {
			(null == a || a > r.length) && (a = r.length);
			for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
			return n;
		}
		function _assertThisInitialized(e) {
			if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return e;
		}
		function _callSuper(t, o, e) {
			return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
		}
		function _classCallCheck(a, n) {
			if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
		}
		function _construct(t, e, r) {
			if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
			var o = [null];
			o.push.apply(o, e);
			var p = new (t.bind.apply(t, o))();
			return r && _setPrototypeOf(p, r.prototype), p;
		}
		function _createClass(e, r, t) {
			return Object.defineProperty(e, "prototype", { writable: false }), e;
		}
		function _createForOfIteratorHelper(r, e) {
			var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
			if (!t) {
				if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
					t && (r = t);
					var n = 0, F = function() {};
					return {
						s: F,
						n: function() {
							return n >= r.length ? { done: true } : {
								done: false,
								value: r[n++]
							};
						},
						e: function(r) {
							throw r;
						},
						f: F
					};
				}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			var o, a = true, u = false;
			return {
				s: function() {
					t = t.call(r);
				},
				n: function() {
					var r = t.next();
					return a = r.done, r;
				},
				e: function(r) {
					u = true, o = r;
				},
				f: function() {
					try {
						a || null == t.return || t.return();
					} finally {
						if (u) throw o;
					}
				}
			};
		}
		function _defineProperty(e, r, t) {
			return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
				value: t,
				enumerable: true,
				configurable: true,
				writable: true
			}) : e[r] = t, e;
		}
		function _getPrototypeOf(t) {
			return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
				return t.__proto__ || Object.getPrototypeOf(t);
			}, _getPrototypeOf(t);
		}
		function _inherits(t, e) {
			if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
			t.prototype = Object.create(e && e.prototype, { constructor: {
				value: t,
				writable: true,
				configurable: true
			} }), Object.defineProperty(t, "prototype", { writable: false }), e && _setPrototypeOf(t, e);
		}
		function _isNativeFunction(t) {
			try {
				return -1 !== Function.toString.call(t).indexOf("[native code]");
			} catch (n) {
				return "function" == typeof t;
			}
		}
		function _isNativeReflectConstruct() {
			try {
				var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
			} catch (t) {}
			return (_isNativeReflectConstruct = function() {
				return !!t;
			})();
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r && (o = o.filter(function(r) {
					return Object.getOwnPropertyDescriptor(e, r).enumerable;
				})), t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread2(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2 ? ownKeys(Object(t), true).forEach(function(r) {
					_defineProperty(e, r, t[r]);
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
					Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
				});
			}
			return e;
		}
		function _possibleConstructorReturn(t, e) {
			if (e && ("object" == typeof e || "function" == typeof e)) return e;
			if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
			return _assertThisInitialized(t);
		}
		function _setPrototypeOf(t, e) {
			return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
				return t.__proto__ = e, t;
			}, _setPrototypeOf(t, e);
		}
		function _toPrimitive(t, r) {
			if ("object" != typeof t || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r);
				if ("object" != typeof i) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == typeof i ? i : i + "";
		}
		function _typeof(o) {
			"@babel/helpers - typeof";
			return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
				return typeof o;
			} : function(o) {
				return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
			}, _typeof(o);
		}
		function _unsupportedIterableToArray(r, a) {
			if (r) {
				if ("string" == typeof r) return _arrayLikeToArray(r, a);
				var t = {}.toString.call(r).slice(8, -1);
				return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
			}
		}
		function _wrapNativeSuper(t) {
			var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
			return _wrapNativeSuper = function(t) {
				if (null === t || !_isNativeFunction(t)) return t;
				if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
				if (void 0 !== r) {
					if (r.has(t)) return r.get(t);
					r.set(t, Wrapper);
				}
				function Wrapper() {
					return _construct(t, arguments, _getPrototypeOf(this).constructor);
				}
				return Wrapper.prototype = Object.create(t.prototype, { constructor: {
					value: Wrapper,
					enumerable: false,
					writable: true,
					configurable: true
				} }), _setPrototypeOf(Wrapper, t);
			}, _wrapNativeSuper(t);
		}
		var WorkerHandler$1 = { exports: {} };
		var _Promise$1 = {};
		var hasRequired_Promise;
		function require_Promise() {
			if (hasRequired_Promise) return _Promise$1;
			hasRequired_Promise = 1;
			/**
			* Promise
			*
			* Inspired by https://gist.github.com/RubaXa/8501359 from RubaXa <trash@rubaxa.org>
			* @template T
			* @template [E=Error]
			* @param {Function} handler   Called as handler(resolve: Function, reject: Function)
			* @param {Promise} [parent]   Parent promise for propagation of cancel and timeout
			*/
			function Promise(handler, parent) {
				var me = this;
				if (!(this instanceof Promise)) throw new SyntaxError("Constructor must be called with the new operator");
				if (typeof handler !== "function") throw new SyntaxError("Function parameter handler(resolve, reject) missing");
				var _onSuccess = [];
				var _onFail = [];
				/**
				* @readonly
				*/
				this.resolved = false;
				/**
				* @readonly
				*/
				this.rejected = false;
				/**
				* @readonly
				*/
				this.pending = true;
				/**
				* @readonly
				*/
				this[Symbol.toStringTag] = "Promise";
				/**
				* Process onSuccess and onFail callbacks: add them to the queue.
				* Once the promise is resolved, the function _promise is replace.
				* @param {Function} onSuccess
				* @param {Function} onFail
				* @private
				*/
				var _process = function _process(onSuccess, onFail) {
					_onSuccess.push(onSuccess);
					_onFail.push(onFail);
				};
				/**
				* Add an onSuccess callback and optionally an onFail callback to the Promise
				* @template TT
				* @template [TE=never]
				* @param {(r: T) => TT | PromiseLike<TT>} onSuccess
				* @param {(r: E) => TE | PromiseLike<TE>} [onFail]
				* @returns {Promise<TT | TE, any>} promise
				*/
				this.then = function(onSuccess, onFail) {
					return new Promise(function(resolve, reject) {
						var s = onSuccess ? _then(onSuccess, resolve, reject) : resolve;
						var f = onFail ? _then(onFail, resolve, reject) : reject;
						_process(s, f);
					}, me);
				};
				/**
				* Resolve the promise
				* @param {*} result
				* @type {Function}
				*/
				var _resolve2 = function _resolve(result) {
					me.resolved = true;
					me.rejected = false;
					me.pending = false;
					_onSuccess.forEach(function(fn) {
						fn(result);
					});
					_process = function _process(onSuccess, onFail) {
						onSuccess(result);
					};
					_resolve2 = _reject2 = function _reject() {};
					return me;
				};
				/**
				* Reject the promise
				* @param {Error} error
				* @type {Function}
				*/
				var _reject2 = function _reject(error) {
					me.resolved = false;
					me.rejected = true;
					me.pending = false;
					_onFail.forEach(function(fn) {
						fn(error);
					});
					_process = function _process(onSuccess, onFail) {
						onFail(error);
					};
					_resolve2 = _reject2 = function _reject() {};
					return me;
				};
				/**
				* Cancel the promise. This will reject the promise with a CancellationError
				* @returns {this} self
				*/
				this.cancel = function() {
					if (parent) parent.cancel();
					else _reject2(new CancellationError());
					return me;
				};
				/**
				* Set a timeout for the promise. If the promise is not resolved within
				* the time, the promise will be cancelled and a TimeoutError is thrown.
				* If the promise is resolved in time, the timeout is removed.
				* @param {number} delay     Delay in milliseconds
				* @returns {this} self
				*/
				this.timeout = function(delay) {
					if (parent) parent.timeout(delay);
					else {
						var timer = setTimeout(function() {
							_reject2(new TimeoutError("Promise timed out after " + delay + " ms"));
						}, delay);
						me.always(function() {
							clearTimeout(timer);
						});
					}
					return me;
				};
				handler(function(result) {
					_resolve2(result);
				}, function(error) {
					_reject2(error);
				});
			}
			/**
			* Execute given callback, then call resolve/reject based on the returned result
			* @param {Function} callback
			* @param {Function} resolve
			* @param {Function} reject
			* @returns {Function}
			* @private
			*/
			function _then(callback, resolve, reject) {
				return function(result) {
					try {
						var res = callback(result);
						if (res && typeof res.then === "function" && typeof res["catch"] === "function") res.then(resolve, reject);
						else resolve(res);
					} catch (error) {
						reject(error);
					}
				};
			}
			/**
			* Add an onFail callback to the Promise
			* @template TT
			* @param {(error: E) => TT | PromiseLike<TT>} onFail
			* @returns {Promise<T | TT>} promise
			*/
			Promise.prototype["catch"] = function(onFail) {
				return this.then(null, onFail);
			};
			/**
			* Execute given callback when the promise either resolves or rejects.
			* @template TT
			* @param {() => Promise<TT>} fn
			* @returns {Promise<TT>} promise
			*/
			Promise.prototype.always = function(fn) {
				return this.then(fn, fn);
			};
			/**
			* Execute given callback when the promise either resolves or rejects.
			* Same semantics as Node's Promise.finally()
			* @param {Function | null | undefined} [fn]
			* @returns {Promise} promise
			*/
			Promise.prototype.finally = function(fn) {
				var me = this;
				var final = function final() {
					return new Promise(function(resolve) {
						return resolve();
					}).then(fn).then(function() {
						return me;
					});
				};
				return this.then(final, final);
			};
			/**
			* Create a promise which resolves when all provided promises are resolved,
			* and fails when any of the promises resolves.
			* @param {Promise[]} promises
			* @returns {Promise<any[], any>} promise
			*/
			Promise.all = function(promises) {
				return new Promise(function(resolve, reject) {
					var remaining = promises.length, results = [];
					if (remaining) promises.forEach(function(p, i) {
						p.then(function(result) {
							results[i] = result;
							remaining--;
							if (remaining == 0) resolve(results);
						}, function(error) {
							remaining = 0;
							reject(error);
						});
					});
					else resolve(results);
				});
			};
			/**
			* Create a promise resolver
			* @returns {import('./types.js').Resolver} resolver
			*/
			Promise.defer = function() {
				var resolver = {};
				resolver.promise = new Promise(function(resolve, reject) {
					resolver.resolve = resolve;
					resolver.reject = reject;
				});
				return resolver;
			};
			/**
			* Create a cancellation error
			* @param {String} [message]
			* @extends Error
			*/
			function CancellationError(message) {
				this.message = message || "promise cancelled";
				this.stack = (/* @__PURE__ */ new Error()).stack;
			}
			CancellationError.prototype = /* @__PURE__ */ new Error();
			CancellationError.prototype.constructor = Error;
			CancellationError.prototype.name = "CancellationError";
			Promise.CancellationError = CancellationError;
			/**
			* Create a timeout error
			* @param {String} [message]
			* @extends Error
			*/
			function TimeoutError(message) {
				this.message = message || "timeout exceeded";
				this.stack = (/* @__PURE__ */ new Error()).stack;
			}
			TimeoutError.prototype = /* @__PURE__ */ new Error();
			TimeoutError.prototype.constructor = Error;
			TimeoutError.prototype.name = "TimeoutError";
			Promise.TimeoutError = TimeoutError;
			_Promise$1.Promise = Promise;
			return _Promise$1;
		}
		var validateOptions$1 = {};
		/**
		* Validate that the object only contains known option names
		* - Throws an error when unknown options are detected
		* - Throws an error when some of the allowed options are attached
		* @param {Object | undefined} options
		* @param {string[]} allowedOptionNames
		* @param {string} objectName
		* @retrun {Object} Returns the original options
		*/
		validateOptions$1.validateOptions = function validateOptions(options, allowedOptionNames, objectName) {
			if (!options) return;
			var optionNames = options ? Object.keys(options) : [];
			var unknownOptionName = optionNames.find(function(optionName) {
				return !allowedOptionNames.includes(optionName);
			});
			if (unknownOptionName) throw new Error("Object \"" + objectName + "\" contains an unknown option \"" + unknownOptionName + "\"");
			var illegalOptionName = allowedOptionNames.find(function(allowedOptionName) {
				return Object.prototype[allowedOptionName] && !optionNames.includes(allowedOptionName);
			});
			if (illegalOptionName) throw new Error("Object \"" + objectName + "\" contains an inherited option \"" + illegalOptionName + "\" which is not defined in the object itself but in its prototype. Only plain objects are allowed. Please remove the option from the prototype or override it with a value \"undefined\".");
			return options;
		};
		validateOptions$1.workerOptsNames = [
			"credentials",
			"name",
			"type"
		];
		validateOptions$1.forkOptsNames = [
			"cwd",
			"detached",
			"env",
			"execPath",
			"execArgv",
			"gid",
			"serialization",
			"signal",
			"killSignal",
			"silent",
			"stdio",
			"uid",
			"windowsVerbatimArguments",
			"timeout"
		];
		validateOptions$1.workerThreadOptsNames = [
			"argv",
			"env",
			"eval",
			"execArgv",
			"stdin",
			"stdout",
			"stderr",
			"workerData",
			"trackUnmanagedFds",
			"transferList",
			"resourceLimits",
			"name"
		];
		/**
		* embeddedWorker.js contains an embedded version of worker.js.
		* This file is automatically generated,
		* changes made in this file will be overwritten.
		*/
		var embeddedWorker;
		var hasRequiredEmbeddedWorker;
		function requireEmbeddedWorker() {
			if (hasRequiredEmbeddedWorker) return embeddedWorker;
			hasRequiredEmbeddedWorker = 1;
			embeddedWorker = "!function(e,n){\"object\"==typeof exports&&\"undefined\"!=typeof module?module.exports=n():\"function\"==typeof define&&define.amd?define(n):(e=\"undefined\"!=typeof globalThis?globalThis:e||self).worker=n()}(this,(function(){\"use strict\";function e(n){return e=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},e(n)}function n(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,\"default\")?e.default:e}var t={};var r=function(e,n){this.message=e,this.transfer=n},o={};function i(e,n){var t=this;if(!(this instanceof i))throw new SyntaxError(\"Constructor must be called with the new operator\");if(\"function\"!=typeof e)throw new SyntaxError(\"Function parameter handler(resolve, reject) missing\");var r=[],o=[];this.resolved=!1,this.rejected=!1,this.pending=!0,this[Symbol.toStringTag]=\"Promise\";var a=function(e,n){r.push(e),o.push(n)};this.then=function(e,n){return new i((function(t,r){var o=e?s(e,t,r):t,i=n?s(n,t,r):r;a(o,i)}),t)};var f=function(e){return t.resolved=!0,t.rejected=!1,t.pending=!1,r.forEach((function(n){n(e)})),a=function(n,t){n(e)},f=d=function(){},t},d=function(e){return t.resolved=!1,t.rejected=!0,t.pending=!1,o.forEach((function(n){n(e)})),a=function(n,t){t(e)},f=d=function(){},t};this.cancel=function(){return n?n.cancel():d(new u),t},this.timeout=function(e){if(n)n.timeout(e);else{var r=setTimeout((function(){d(new c(\"Promise timed out after \"+e+\" ms\"))}),e);t.always((function(){clearTimeout(r)}))}return t},e((function(e){f(e)}),(function(e){d(e)}))}function s(e,n,t){return function(r){try{var o=e(r);o&&\"function\"==typeof o.then&&\"function\"==typeof o.catch?o.then(n,t):n(o)}catch(e){t(e)}}}function u(e){this.message=e||\"promise cancelled\",this.stack=(new Error).stack}function c(e){this.message=e||\"timeout exceeded\",this.stack=(new Error).stack}return i.prototype.catch=function(e){return this.then(null,e)},i.prototype.always=function(e){return this.then(e,e)},i.prototype.finally=function(e){var n=this,t=function(){return new i((function(e){return e()})).then(e).then((function(){return n}))};return this.then(t,t)},i.all=function(e){return new i((function(n,t){var r=e.length,o=[];r?e.forEach((function(e,i){e.then((function(e){o[i]=e,0==--r&&n(o)}),(function(e){r=0,t(e)}))})):n(o)}))},i.defer=function(){var e={};return e.promise=new i((function(n,t){e.resolve=n,e.reject=t})),e},u.prototype=new Error,u.prototype.constructor=Error,u.prototype.name=\"CancellationError\",i.CancellationError=u,c.prototype=new Error,c.prototype.constructor=Error,c.prototype.name=\"TimeoutError\",i.TimeoutError=c,o.Promise=i,function(n){var t=r,i=o.Promise,s=\"__workerpool-cleanup__\",u={exit:function(){}},c={addAbortListener:function(e){u.abortListeners.push(e)},emit:u.emit};if(\"undefined\"!=typeof self&&\"function\"==typeof postMessage&&\"function\"==typeof addEventListener)u.on=function(e,n){addEventListener(e,(function(e){n(e.data)}))},u.send=function(e,n){n?postMessage(e,n):postMessage(e)};else{if(\"undefined\"==typeof process)throw new Error(\"Script must be executed as a worker\");var a;try{a=require(\"worker_threads\")}catch(n){if(\"object\"!==e(n)||null===n||\"MODULE_NOT_FOUND\"!==n.code)throw n}if(a&&null!==a.parentPort){var f=a.parentPort;u.send=f.postMessage.bind(f),u.on=f.on.bind(f),u.exit=process.exit.bind(process)}else u.on=process.on.bind(process),u.send=function(e){process.send(e)},u.on(\"disconnect\",(function(){process.exit(1)})),u.exit=process.exit.bind(process)}function d(e){return e&&e.toJSON?JSON.parse(JSON.stringify(e)):JSON.parse(JSON.stringify(e,Object.getOwnPropertyNames(e)))}function l(e){return e&&\"function\"==typeof e.then&&\"function\"==typeof e.catch}u.methods={},u.methods.run=function(e,n){var t=new Function(\"return (\"+e+\").apply(this, arguments);\");return t.worker=c,t.apply(t,n)},u.methods.methods=function(){return Object.keys(u.methods)},u.terminationHandler=void 0,u.abortListenerTimeout=1e3,u.abortListeners=[],u.terminateAndExit=function(e){var n=function(){u.exit(e)};if(!u.terminationHandler)return n();var t=u.terminationHandler(e);return l(t)?(t.then(n,n),t):(n(),new i((function(e,n){n(new Error(\"Worker terminating\"))})))},u.cleanup=function(e){if(!u.abortListeners.length)return u.send({id:e,method:s,error:d(new Error(\"Worker terminating\"))}),new i((function(e){e()}));var n,t=u.abortListeners.map((function(e){return e()})),r=new i((function(e,t){n=setTimeout((function(){t(new Error(\"Timeout occured waiting for abort handler, killing worker\"))}),u.abortListenerTimeout)})),o=i.all(t).then((function(){clearTimeout(n),u.abortListeners.length||(u.abortListeners=[])}),(function(){clearTimeout(n),u.exit()}));return new i((function(e,n){o.then(e,n),r.then(e,n)})).then((function(){u.send({id:e,method:s,error:null})}),(function(n){u.send({id:e,method:s,error:n?d(n):null})}))};var p=null;u.on(\"message\",(function(e){if(\"__workerpool-terminate__\"===e)return u.terminateAndExit(0);if(e.method===s)return u.cleanup(e.id);try{var n=u.methods[e.method];if(!n)throw new Error('Unknown method \"'+e.method+'\"');p=e.id;var r=n.apply(n,e.params);l(r)?r.then((function(n){n instanceof t?u.send({id:e.id,result:n.message,error:null},n.transfer):u.send({id:e.id,result:n,error:null}),p=null})).catch((function(n){u.send({id:e.id,result:null,error:d(n)}),p=null})):(r instanceof t?u.send({id:e.id,result:r.message,error:null},r.transfer):u.send({id:e.id,result:r,error:null}),p=null)}catch(n){u.send({id:e.id,result:null,error:d(n)})}})),u.register=function(e,n){if(e)for(var t in e)e.hasOwnProperty(t)&&(u.methods[t]=e[t],u.methods[t].worker=c);n&&(u.terminationHandler=n.onTerminate,u.abortListenerTimeout=n.abortListenerTimeout||1e3),u.send(\"ready\")},u.emit=function(e){if(p){if(e instanceof t)return void u.send({id:p,isEvent:!0,payload:e.message},e.transfer);u.send({id:p,isEvent:!0,payload:e})}},n.add=u.register,n.emit=u.emit}(t),n(t)}));\n\n";
			return embeddedWorker;
		}
		var Promise$2 = require_Promise().Promise;
		var environment = environmentExports;
		var validateOptions = validateOptions$1.validateOptions, forkOptsNames = validateOptions$1.forkOptsNames, workerThreadOptsNames = validateOptions$1.workerThreadOptsNames, workerOptsNames = validateOptions$1.workerOptsNames;
		/**
		* Special message sent by parent which causes a child process worker to terminate itself.
		* Not a "message object"; this string is the entire message.
		*/
		var TERMINATE_METHOD_ID = "__workerpool-terminate__";
		/**
		* Special message by parent which causes a child process worker to perform cleaup
		* steps before determining if the child process worker should be terminated.
		*/
		var CLEANUP_METHOD_ID = "__workerpool-cleanup__";
		function ensureWorkerThreads() {
			var WorkerThreads = tryRequireWorkerThreads();
			if (!WorkerThreads) throw new Error("WorkerPool: workerType = 'thread' is not supported, Node >= 11.7.0 required");
			return WorkerThreads;
		}
		function ensureWebWorker() {
			if (typeof Worker !== "function" && ((typeof Worker === "undefined" ? "undefined" : _typeof(Worker)) !== "object" || typeof Worker.prototype.constructor !== "function")) throw new Error("WorkerPool: Web Workers not supported");
		}
		function tryRequireWorkerThreads() {
			try {
				return require___vite_browser_external();
			} catch (error) {
				if (_typeof(error) === "object" && error !== null && error.code === "MODULE_NOT_FOUND") return null;
				else throw error;
			}
		}
		function getDefaultWorker() {
			if (environment.platform === "browser") {
				if (typeof Blob === "undefined") throw new Error("Blob not supported by the browser");
				if (!window.URL || typeof window.URL.createObjectURL !== "function") throw new Error("URL.createObjectURL not supported by the browser");
				var blob = new Blob([requireEmbeddedWorker()], { type: "text/javascript" });
				return window.URL.createObjectURL(blob);
			} else return __dirname + "/worker.js";
		}
		function setupWorker(script, options) {
			if (options.workerType === "web") {
				ensureWebWorker();
				return setupBrowserWorker(script, options.workerOpts, Worker);
			} else if (options.workerType === "thread") {
				WorkerThreads = ensureWorkerThreads();
				return setupWorkerThreadWorker(script, WorkerThreads, options);
			} else if (options.workerType === "process" || !options.workerType) return setupProcessWorker(script, resolveForkOptions(options), require___vite_browser_external());
			else if (environment.platform === "browser") {
				ensureWebWorker();
				return setupBrowserWorker(script, options.workerOpts, Worker);
			} else {
				var WorkerThreads = tryRequireWorkerThreads();
				if (WorkerThreads) return setupWorkerThreadWorker(script, WorkerThreads, options);
				else return setupProcessWorker(script, resolveForkOptions(options), require___vite_browser_external());
			}
		}
		function setupBrowserWorker(script, workerOpts, Worker) {
			validateOptions(workerOpts, workerOptsNames, "workerOpts");
			var worker = new Worker(script, workerOpts);
			worker.isBrowserWorker = true;
			worker.on = function(event, callback) {
				this.addEventListener(event, function(message) {
					callback(message.data);
				});
			};
			worker.send = function(message, transfer) {
				this.postMessage(message, transfer);
			};
			return worker;
		}
		function setupWorkerThreadWorker(script, WorkerThreads, options) {
			var _options$emitStdStrea, _options$emitStdStrea2;
			validateOptions(options === null || options === void 0 ? void 0 : options.workerThreadOpts, workerThreadOptsNames, "workerThreadOpts");
			var worker = new WorkerThreads.Worker(script, _objectSpread2({
				stdout: (_options$emitStdStrea = options === null || options === void 0 ? void 0 : options.emitStdStreams) !== null && _options$emitStdStrea !== void 0 ? _options$emitStdStrea : false,
				stderr: (_options$emitStdStrea2 = options === null || options === void 0 ? void 0 : options.emitStdStreams) !== null && _options$emitStdStrea2 !== void 0 ? _options$emitStdStrea2 : false
			}, options === null || options === void 0 ? void 0 : options.workerThreadOpts));
			worker.isWorkerThread = true;
			worker.send = function(message, transfer) {
				this.postMessage(message, transfer);
			};
			worker.kill = function() {
				this.terminate();
				return true;
			};
			worker.disconnect = function() {
				this.terminate();
			};
			if (options !== null && options !== void 0 && options.emitStdStreams) {
				worker.stdout.on("data", function(data) {
					return worker.emit("stdout", data);
				});
				worker.stderr.on("data", function(data) {
					return worker.emit("stderr", data);
				});
			}
			return worker;
		}
		function setupProcessWorker(script, options, child_process) {
			validateOptions(options.forkOpts, forkOptsNames, "forkOpts");
			var worker = child_process.fork(script, options.forkArgs, options.forkOpts);
			var send = worker.send;
			worker.send = function(message) {
				return send.call(worker, message);
			};
			if (options.emitStdStreams) {
				worker.stdout.on("data", function(data) {
					return worker.emit("stdout", data);
				});
				worker.stderr.on("data", function(data) {
					return worker.emit("stderr", data);
				});
			}
			worker.isChildProcess = true;
			return worker;
		}
		function resolveForkOptions(opts) {
			opts = opts || {};
			var processExecArgv = process.execArgv.join(" ");
			var inspectorActive = processExecArgv.indexOf("--inspect") !== -1;
			var debugBrk = processExecArgv.indexOf("--debug-brk") !== -1;
			var execArgv = [];
			if (inspectorActive) {
				execArgv.push("--inspect=" + opts.debugPort);
				if (debugBrk) execArgv.push("--debug-brk");
			}
			process.execArgv.forEach(function(arg) {
				if (arg.indexOf("--max-old-space-size") > -1) execArgv.push(arg);
			});
			return Object.assign({}, opts, {
				forkArgs: opts.forkArgs,
				forkOpts: Object.assign({}, opts.forkOpts, {
					execArgv: (opts.forkOpts && opts.forkOpts.execArgv || []).concat(execArgv),
					stdio: opts.emitStdStreams ? "pipe" : void 0
				})
			});
		}
		/**
		* Converts a serialized error to Error
		* @param {Object} obj Error that has been serialized and parsed to object
		* @return {Error} The equivalent Error.
		*/
		function objectToError(obj) {
			var temp = /* @__PURE__ */ new Error("");
			var props = Object.keys(obj);
			for (var i = 0; i < props.length; i++) temp[props[i]] = obj[props[i]];
			return temp;
		}
		function handleEmittedStdPayload(handler, payload) {
			Object.values(handler.processing).forEach(function(task) {
				var _task$options;
				return task === null || task === void 0 || (_task$options = task.options) === null || _task$options === void 0 ? void 0 : _task$options.on(payload);
			});
			Object.values(handler.tracking).forEach(function(task) {
				var _task$options2;
				return task === null || task === void 0 || (_task$options2 = task.options) === null || _task$options2 === void 0 ? void 0 : _task$options2.on(payload);
			});
		}
		/**
		* A WorkerHandler controls a single worker. This worker can be a child process
		* on node.js or a WebWorker in a browser environment.
		* @param {String} [script] If no script is provided, a default worker with a
		*                          function run will be created.
		* @param {import('./types.js').WorkerPoolOptions} [_options] See docs
		* @constructor
		*/
		function WorkerHandler(script, _options) {
			var me = this;
			var options = _options || {};
			this.script = script || getDefaultWorker();
			this.worker = setupWorker(this.script, options);
			this.debugPort = options.debugPort;
			this.forkOpts = options.forkOpts;
			this.forkArgs = options.forkArgs;
			this.workerOpts = options.workerOpts;
			this.workerThreadOpts = options.workerThreadOpts;
			this.workerTerminateTimeout = options.workerTerminateTimeout;
			if (!script) this.worker.ready = true;
			this.requestQueue = [];
			this.worker.on("stdout", function(data) {
				handleEmittedStdPayload(me, { "stdout": data.toString() });
			});
			this.worker.on("stderr", function(data) {
				handleEmittedStdPayload(me, { "stderr": data.toString() });
			});
			this.worker.on("message", function(response) {
				if (me.terminated) return;
				if (typeof response === "string" && response === "ready") {
					me.worker.ready = true;
					dispatchQueuedRequests();
				} else {
					var id = response.id;
					var task = me.processing[id];
					if (task !== void 0) if (response.isEvent) {
						if (task.options && typeof task.options.on === "function") task.options.on(response.payload);
					} else {
						delete me.processing[id];
						if (me.terminating === true) me.terminate();
						if (response.error) task.resolver.reject(objectToError(response.error));
						else task.resolver.resolve(response.result);
					}
					else {
						var task = me.tracking[id];
						if (task !== void 0) {
							if (response.isEvent) {
								if (task.options && typeof task.options.on === "function") task.options.on(response.payload);
							}
						}
					}
					if (response.method === CLEANUP_METHOD_ID) {
						var trackedTask = me.tracking[response.id];
						if (trackedTask !== void 0) if (response.error) {
							clearTimeout(trackedTask.timeoutId);
							trackedTask.resolver.reject(objectToError(response.error));
						} else {
							me.tracking && clearTimeout(trackedTask.timeoutId);
							trackedTask.resolver.reject(new WrappedTimeoutError(trackedTask.error));
						}
						delete me.tracking[id];
					}
				}
			});
			function onError(error) {
				me.terminated = true;
				for (var id in me.processing) if (me.processing[id] !== void 0) me.processing[id].resolver.reject(error);
				me.processing = Object.create(null);
			}
			function dispatchQueuedRequests() {
				var _iterator = _createForOfIteratorHelper(me.requestQueue.splice(0)), _step;
				try {
					for (_iterator.s(); !(_step = _iterator.n()).done;) {
						var request = _step.value;
						me.worker.send(request.message, request.transfer);
					}
				} catch (err) {
					_iterator.e(err);
				} finally {
					_iterator.f();
				}
			}
			var worker = this.worker;
			this.worker.on("error", function(error) {
				onError(new TerminateError$1("Workerpool Worker error: " + (error && error.message ? error.message : String(error || "Unknown worker error")), error));
			});
			this.worker.on("exit", function(exitCode, signalCode) {
				var message = "Workerpool Worker terminated Unexpectedly\n";
				message += "    exitCode: `" + exitCode + "`\n";
				message += "    signalCode: `" + signalCode + "`\n";
				message += "    workerpool.script: `" + me.script + "`\n";
				message += "    spawnArgs: `" + worker.spawnargs + "`\n";
				message += "    spawnfile: `" + worker.spawnfile + "`\n";
				message += "    stdout: `" + worker.stdout + "`\n";
				message += "    stderr: `" + worker.stderr + "`\n";
				onError(new TerminateError$1(message));
			});
			this.processing = Object.create(null);
			this.tracking = Object.create(null);
			this.terminating = false;
			this.terminated = false;
			this.cleaning = false;
			this.terminationHandler = null;
			this.lastId = 0;
		}
		/**
		* Get a list with methods available on the worker.
		* @return {Promise.<String[], Error>} methods
		*/
		WorkerHandler.prototype.methods = function() {
			return this.exec("methods");
		};
		/**
		* Execute a method with given parameters on the worker
		* @param {String} method
		* @param {Array} [params]
		* @param {{resolve: Function, reject: Function}} [resolver]
		* @param {import('./types.js').ExecOptions}  [options]
		* @return {Promise.<*, Error>} result
		*/
		WorkerHandler.prototype.exec = function(method, params, resolver, options) {
			if (!resolver) resolver = Promise$2.defer();
			var id = ++this.lastId;
			this.processing[id] = {
				id,
				resolver,
				options
			};
			var request = {
				message: {
					id,
					method,
					params
				},
				transfer: options && options.transfer
			};
			if (this.terminated) resolver.reject(new TerminateError$1("Worker is terminated"));
			else if (this.worker.ready) this.worker.send(request.message, request.transfer);
			else this.requestQueue.push(request);
			var me = this;
			return resolver.promise.catch(function(error) {
				if (error instanceof Promise$2.CancellationError || error instanceof Promise$2.TimeoutError) {
					me.tracking[id] = {
						id,
						resolver: Promise$2.defer(),
						options,
						error
					};
					delete me.processing[id];
					me.tracking[id].resolver.promise = me.tracking[id].resolver.promise.catch(function(err) {
						delete me.tracking[id];
						if (err instanceof WrappedTimeoutError) throw err.error;
						return me.terminateAndNotify(true).then(function() {
							throw err;
						}, function(err) {
							throw err;
						});
					});
					me.worker.send({
						id,
						method: CLEANUP_METHOD_ID
					});
					/**
					* Sets a timeout to reject the cleanup operation if the message sent to the worker
					* does not receive a response. see worker.tryCleanup for worker cleanup operations.
					* Here we use the workerTerminateTimeout as the worker will be terminated if the timeout does invoke.
					* 
					* We need this timeout in either case of a Timeout or Cancellation Error as if
					* the worker does not send a message we still need to give a window of time for a response.
					* 
					* The workerTermniateTimeout is used here if this promise is rejected the worker cleanup
					* operations will occure.
					*/
					me.tracking[id].timeoutId = setTimeout(function() {
						me.tracking[id].resolver.reject(error);
					}, me.workerTerminateTimeout);
					return me.tracking[id].resolver.promise;
				} else throw error;
			});
		};
		/**
		* Test whether the worker is processing any tasks or cleaning up before termination.
		* @return {boolean} Returns true if the worker is busy
		*/
		WorkerHandler.prototype.busy = function() {
			return this.cleaning || Object.keys(this.processing).length > 0;
		};
		/**
		* Terminate the worker.
		* @param {boolean} [force=false]   If false (default), the worker is terminated
		*                                  after finishing all tasks currently in
		*                                  progress. If true, the worker will be
		*                                  terminated immediately.
		* @param {function} [callback=null] If provided, will be called when process terminates.
		*/
		WorkerHandler.prototype.terminate = function(force, callback) {
			var me = this;
			if (force) {
				for (var id in this.processing) if (this.processing[id] !== void 0) this.processing[id].resolver.reject(/* @__PURE__ */ new Error("Worker terminated"));
				this.processing = Object.create(null);
			}
			for (var _i = 0, _Object$values = Object.values(me.tracking); _i < _Object$values.length; _i++) {
				var task = _Object$values[_i];
				clearTimeout(task.timeoutId);
				task.resolver.reject(/* @__PURE__ */ new Error("Worker Terminating"));
			}
			me.tracking = Object.create(null);
			if (typeof callback === "function") this.terminationHandler = callback;
			if (!this.busy()) {
				var cleanup = function cleanup(err) {
					me.terminated = true;
					me.cleaning = false;
					if (me.worker != null && me.worker.removeAllListeners) me.worker.removeAllListeners("message");
					me.worker = null;
					me.terminating = false;
					if (me.terminationHandler) me.terminationHandler(err, me);
					else if (err) throw err;
				};
				if (this.worker) if (typeof this.worker.kill === "function") {
					if (this.worker.killed) {
						cleanup(/* @__PURE__ */ new Error("worker already killed!"));
						return;
					}
					var cleanExitTimeout = setTimeout(function() {
						if (me.worker) me.worker.kill();
					}, this.workerTerminateTimeout);
					this.worker.once("exit", function() {
						clearTimeout(cleanExitTimeout);
						if (me.worker) me.worker.killed = true;
						cleanup();
					});
					if (this.worker.ready) this.worker.send(TERMINATE_METHOD_ID);
					else this.requestQueue.push({ message: TERMINATE_METHOD_ID });
					this.cleaning = true;
					return;
				} else if (typeof this.worker.terminate === "function") {
					this.worker.terminate();
					this.worker.killed = true;
				} else throw new Error("Failed to terminate worker");
				cleanup();
			} else this.terminating = true;
		};
		/**
		* Terminate the worker, returning a Promise that resolves when the termination has been done.
		* @param {boolean} [force=false]   If false (default), the worker is terminated
		*                                  after finishing all tasks currently in
		*                                  progress. If true, the worker will be
		*                                  terminated immediately.
		* @param {number} [timeout]        If provided and non-zero, worker termination promise will be rejected
		*                                  after timeout if worker process has not been terminated.
		* @return {Promise.<WorkerHandler, Error>}
		*/
		WorkerHandler.prototype.terminateAndNotify = function(force, timeout) {
			var resolver = Promise$2.defer();
			if (timeout) resolver.promise.timeout(timeout);
			this.terminate(force, function(err, worker) {
				if (err) resolver.reject(err);
				else resolver.resolve(worker);
			});
			return resolver.promise;
		};
		/**
		* Wrapper error type to denote that a TimeoutError has already been proceesed
		* and we should skip cleanup operations
		* @param {Promise.TimeoutError} timeoutError
		*/
		function WrappedTimeoutError(timeoutError) {
			this.error = timeoutError;
			this.stack = (/* @__PURE__ */ new Error()).stack;
		}
		var TerminateError$1 = /*#__PURE__*/ function(_Error) {
			/**
			* Create a timeout error
			* @param {String} [message]
			* @param {Error=} [cause]
			*/
			function TerminateError(message, cause) {
				var _this;
				_classCallCheck(this, TerminateError);
				_this = _callSuper(this, TerminateError, [message || "worker terminated"]);
				_this.cause = cause;
				return _this;
			}
			_inherits(TerminateError, _Error);
			return _createClass(TerminateError);
		}(/*#__PURE__*/ _wrapNativeSuper(Error));
		WorkerHandler$1.exports = WorkerHandler;
		WorkerHandler$1.exports._tryRequireWorkerThreads = tryRequireWorkerThreads;
		WorkerHandler$1.exports._setupProcessWorker = setupProcessWorker;
		WorkerHandler$1.exports._setupBrowserWorker = setupBrowserWorker;
		WorkerHandler$1.exports._setupWorkerThreadWorker = setupWorkerThreadWorker;
		WorkerHandler$1.exports.ensureWorkerThreads = ensureWorkerThreads;
		WorkerHandler$1.exports.TerminateError = TerminateError$1;
		var WorkerHandlerExports = WorkerHandler$1.exports;
		/**
		* FIFO Queue implementation
		* @template [T=any]
		* @constructor
		* @implements {import('./types').TaskQueue<T>}
		*/
		var queues;
		var hasRequiredQueues;
		function requireQueues() {
			if (hasRequiredQueues) return queues;
			hasRequiredQueues = 1;
			function FIFOQueue() {
				/** @type {import('./types').Task<T>[]} */
				this.tasks = [];
			}
			/**
			* @param {import('./types').Task<T>} task
			* @returns {void}
			*/
			FIFOQueue.prototype.push = function(task) {
				this.tasks.push(task);
			};
			/**
			* @returns {import('./types').Task<T> | undefined}
			*/
			FIFOQueue.prototype.pop = function() {
				return this.tasks.shift();
			};
			/**
			* @returns {number}
			*/
			FIFOQueue.prototype.size = function() {
				return this.tasks.length;
			};
			/**
			* @param {import('./types').Task<T>} task
			* @returns {boolean}
			*/
			FIFOQueue.prototype.contains = function(task) {
				return this.tasks.includes(task);
			};
			/**
			* @returns {void}
			*/
			FIFOQueue.prototype.clear = function() {
				this.tasks.length = 0;
			};
			/**
			* LIFO Queue implementation
			* @template [T=any]
			* @constructor
			* @implements {import('./types').TaskQueue<T>}
			*/
			function LIFOQueue() {
				/** @type {import('./types').Task<T>[]} */
				this.tasks = [];
			}
			/**
			* @param {import('./types').Task<T>} task
			* @returns {void}
			*/
			LIFOQueue.prototype.push = function(task) {
				this.tasks.push(task);
			};
			/**
			* @returns {import('./types').Task<T> | undefined}
			*/
			LIFOQueue.prototype.pop = function() {
				return this.tasks.pop();
			};
			/**
			* @returns {number}
			*/
			LIFOQueue.prototype.size = function() {
				return this.tasks.length;
			};
			/**
			* @param {import('./types').Task<T>} task
			* @returns {boolean}
			*/
			LIFOQueue.prototype.contains = function(task) {
				return this.tasks.includes(task);
			};
			/**
			* @returns {void}
			*/
			LIFOQueue.prototype.clear = function() {
				this.tasks.length = 0;
			};
			queues = {
				FIFOQueue,
				LIFOQueue
			};
			return queues;
		}
		var debugPortAllocator;
		var hasRequiredDebugPortAllocator;
		function requireDebugPortAllocator() {
			if (hasRequiredDebugPortAllocator) return debugPortAllocator;
			hasRequiredDebugPortAllocator = 1;
			var MAX_PORTS = 65535;
			debugPortAllocator = DebugPortAllocator;
			function DebugPortAllocator() {
				this.ports = Object.create(null);
				this.length = 0;
			}
			DebugPortAllocator.prototype.nextAvailableStartingAt = function(starting) {
				while (this.ports[starting] === true) starting++;
				if (starting >= MAX_PORTS) throw new Error("WorkerPool debug port limit reached: " + starting + ">= " + MAX_PORTS);
				this.ports[starting] = true;
				this.length++;
				return starting;
			};
			DebugPortAllocator.prototype.releasePort = function(port) {
				delete this.ports[port];
				this.length--;
			};
			return debugPortAllocator;
		}
		var Pool_1;
		var hasRequiredPool;
		function requirePool() {
			if (hasRequiredPool) return Pool_1;
			hasRequiredPool = 1;
			var Promise = require_Promise().Promise;
			var WorkerHandler = WorkerHandlerExports;
			var environment = environmentExports;
			var _require$$2 = requireQueues(), FIFOQueue = _require$$2.FIFOQueue, LIFOQueue = _require$$2.LIFOQueue;
			var DEBUG_PORT_ALLOCATOR = new (requireDebugPortAllocator())();
			/**
			* A pool to manage workers, which can be created using the function workerpool.pool.
			*
			* @param {String} [script]   Optional worker script
			* @param {import('./types.js').WorkerPoolOptions} [options]  See docs
			* @constructor
			*/
			function Pool(script, options) {
				if (typeof script === "string")
 /** @readonly */
				this.script = script || null;
				else {
					this.script = null;
					options = script;
				}
				/** @private */
				this.workers = [];
				/** @private */
				this.taskQueue = this._createQueue(options && options.queueStrategy || "fifo");
				options = options || {};
				/** @readonly */
				this.forkArgs = Object.freeze(options.forkArgs || []);
				/** @readonly */
				this.forkOpts = Object.freeze(options.forkOpts || {});
				/** @readonly */
				this.workerOpts = Object.freeze(options.workerOpts || {});
				/** @readonly */
				this.workerThreadOpts = Object.freeze(options.workerThreadOpts || {});
				/** @private */
				this.debugPortStart = options.debugPortStart || 43210;
				/** @readonly @deprecated */
				this.nodeWorker = options.nodeWorker;
				/** @readonly
				* @type {'auto' | 'web' | 'process' | 'thread'}
				*/
				this.workerType = options.workerType || options.nodeWorker || "auto";
				/** @readonly */
				this.maxQueueSize = options.maxQueueSize || Infinity;
				/** @readonly */
				this.workerTerminateTimeout = options.workerTerminateTimeout || 1e3;
				/** @readonly */
				this.onCreateWorker = options.onCreateWorker || function() {
					return null;
				};
				/** @readonly */
				this.onTerminateWorker = options.onTerminateWorker || function() {
					return null;
				};
				/** @readonly */
				this.emitStdStreams = options.emitStdStreams || false;
				if (options && "maxWorkers" in options) {
					validateMaxWorkers(options.maxWorkers);
					/** @readonly */
					this.maxWorkers = options.maxWorkers;
				} else this.maxWorkers = Math.max((environment.cpus || 4) - 1, 1);
				if (options && "minWorkers" in options) {
					if (options.minWorkers === "max")
 /** @readonly */
					this.minWorkers = this.maxWorkers;
					else {
						validateMinWorkers(options.minWorkers);
						this.minWorkers = options.minWorkers;
						this.maxWorkers = Math.max(this.minWorkers, this.maxWorkers);
					}
					this._ensureMinWorkers();
				}
				/** @private */
				this._boundNext = this._next.bind(this);
				if (this.workerType === "thread") WorkerHandler.ensureWorkerThreads();
			}
			/**
			* Execute a function on a worker.
			*
			* Example usage:
			*
			*   var pool = new Pool()
			*
			*   // call a function available on the worker
			*   pool.exec('fibonacci', [6])
			*
			*   // offload a function
			*   function add(a, b) {
			*     return a + b
			*   };
			*   pool.exec(add, [2, 4])
			*       .then(function (result) {
			*         console.log(result); // outputs 6
			*       })
			*       .catch(function(error) {
			*         console.log(error);
			*       });
			* @template { (...args: any[]) => any } T
			* @param {String | T} method  Function name or function.
			*                                    If `method` is a string, the corresponding
			*                                    method on the worker will be executed
			*                                    If `method` is a Function, the function
			*                                    will be stringified and executed via the
			*                                    workers built-in function `run(fn, args)`.
			* @param {Parameters<T> | null} [params]  Function arguments applied when calling the function
			* @param {import('./types.js').ExecOptions} [options]  Options
			* @return {Promise<ReturnType<T>>}
			*/
			Pool.prototype.exec = function(method, params, options) {
				if (params && !Array.isArray(params)) throw new TypeError("Array expected as argument \"params\"");
				if (typeof method === "string") {
					var resolver = Promise.defer();
					if (this.taskQueue.size() >= this.maxQueueSize) throw new Error("Max queue size of " + this.maxQueueSize + " reached");
					var task = {
						method,
						params,
						resolver,
						timeout: null,
						options
					};
					this.taskQueue.push(task);
					var originalTimeout = resolver.promise.timeout;
					var taskQueue = this.taskQueue;
					resolver.promise.timeout = function timeout(delay) {
						if (taskQueue.contains(task)) {
							task.timeout = delay;
							return resolver.promise;
						} else return originalTimeout.call(resolver.promise, delay);
					};
					this._next();
					return resolver.promise;
				} else if (typeof method === "function") return this.exec("run", [String(method), params], options);
				else throw new TypeError("Function or string expected as argument \"method\"");
			};
			/**
			* Create a proxy for current worker. Returns an object containing all
			* methods available on the worker. All methods return promises resolving the methods result.
			* @template { { [k: string]: (...args: any[]) => any } } T
			* @return {Promise<import('./types.js').Proxy<T>, Error>} Returns a promise which resolves with a proxy object
			*/
			Pool.prototype.proxy = function() {
				if (arguments.length > 0) throw new Error("No arguments expected");
				var pool = this;
				return this.exec("methods").then(function(methods) {
					var proxy = {};
					methods.forEach(function(method) {
						proxy[method] = function() {
							return pool.exec(method, Array.prototype.slice.call(arguments));
						};
					});
					return proxy;
				});
			};
			/**
			* Creates new array with the results of calling a provided callback function
			* on every element in this array.
			* @param {Array} array
			* @param {function} callback  Function taking two arguments:
			*                             `callback(currentValue, index)`
			* @return {Promise.<Array>} Returns a promise which resolves  with an Array
			*                           containing the results of the callback function
			*                           executed for each of the array elements.
			*/
			/**
			* Grab the first task from the queue, find a free worker, and assign the
			* worker to the task.
			* @private
			*/
			Pool.prototype._next = function() {
				if (this.taskQueue.size() > 0) {
					var worker = this._getWorker();
					if (worker) {
						var me = this;
						var task = this.taskQueue.pop();
						if (task.resolver.promise.pending) {
							var promise = worker.exec(task.method, task.params, task.resolver, task.options).then(me._boundNext).catch(function() {
								if (worker.terminated) return me._removeWorker(worker);
							}).then(function() {
								me._next();
							});
							if (typeof task.timeout === "number") promise.timeout(task.timeout);
						} else me._next();
					}
				}
			};
			/**
			* Get an available worker. If no worker is available and the maximum number
			* of workers isn't yet reached, a new worker will be created and returned.
			* If no worker is available and the maximum number of workers is reached,
			* null will be returned.
			*
			* @return {WorkerHandler | null} worker
			* @private
			*/
			Pool.prototype._getWorker = function() {
				var workers = this.workers;
				for (var i = 0; i < workers.length; i++) {
					var worker = workers[i];
					if (worker.busy() === false) return worker;
				}
				if (workers.length < this.maxWorkers) {
					worker = this._createWorkerHandler();
					workers.push(worker);
					return worker;
				}
				return null;
			};
			/**
			* Remove a worker from the pool.
			* Attempts to terminate worker if not already terminated, and ensures the minimum
			* pool size is met.
			* @param {WorkerHandler} worker
			* @return {Promise<WorkerHandler>}
			* @private
			*/
			Pool.prototype._removeWorker = function(worker) {
				var me = this;
				DEBUG_PORT_ALLOCATOR.releasePort(worker.debugPort);
				this._removeWorkerFromList(worker);
				this._ensureMinWorkers();
				return new Promise(function(resolve, reject) {
					worker.terminate(false, function(err) {
						me.onTerminateWorker({
							forkArgs: worker.forkArgs,
							forkOpts: worker.forkOpts,
							workerThreadOpts: worker.workerThreadOpts,
							script: worker.script
						});
						if (err) reject(err);
						else resolve(worker);
					});
				});
			};
			/**
			* Remove a worker from the pool list.
			* @param {WorkerHandler} worker
			* @private
			*/
			Pool.prototype._removeWorkerFromList = function(worker) {
				var index = this.workers.indexOf(worker);
				if (index !== -1) this.workers.splice(index, 1);
			};
			/**
			* Close all active workers. Tasks currently being executed will be finished first.
			* @param {boolean} [force=false]   If false (default), the workers are terminated
			*                                  after finishing all tasks currently in
			*                                  progress. If true, the workers will be
			*                                  terminated immediately.
			* @param {number} [timeout]        If provided and non-zero, worker termination promise will be rejected
			*                                  after timeout if worker process has not been terminated.
			* @return {Promise.<void, Error>}
			*/
			Pool.prototype.terminate = function(force, timeout) {
				var me = this;
				var taskQueue = this.taskQueue;
				while (taskQueue.size() > 0) {
					var task = taskQueue.pop();
					if (task) task.resolver.reject(/* @__PURE__ */ new Error("Pool terminated"));
					else break;
				}
				taskQueue.clear();
				var removeWorker = function f(worker) {
					DEBUG_PORT_ALLOCATOR.releasePort(worker.debugPort);
					this._removeWorkerFromList(worker);
				}.bind(this);
				var promises = [];
				this.workers.slice().forEach(function(worker) {
					var termPromise = worker.terminateAndNotify(force, timeout).then(removeWorker).always(function() {
						me.onTerminateWorker({
							forkArgs: worker.forkArgs,
							forkOpts: worker.forkOpts,
							workerThreadOpts: worker.workerThreadOpts,
							script: worker.script
						});
					});
					promises.push(termPromise);
				});
				return Promise.all(promises);
			};
			/**
			* Retrieve statistics on tasks and workers.
			* @return {{totalWorkers: number, busyWorkers: number, idleWorkers: number, pendingTasks: number, activeTasks: number}} Returns an object with statistics
			*/
			Pool.prototype.stats = function() {
				var totalWorkers = this.workers.length;
				var busyWorkers = this.workers.filter(function(worker) {
					return worker.busy();
				}).length;
				return {
					totalWorkers,
					busyWorkers,
					idleWorkers: totalWorkers - busyWorkers,
					pendingTasks: this.taskQueue.size(),
					activeTasks: busyWorkers
				};
			};
			/**
			* Ensures that a minimum of minWorkers is up and running
			* @private
			*/
			Pool.prototype._ensureMinWorkers = function() {
				if (this.minWorkers) for (var i = this.workers.length; i < this.minWorkers; i++) this.workers.push(this._createWorkerHandler());
			};
			/**
			* Helper function to create a new WorkerHandler and pass all options.
			* @return {WorkerHandler}
			* @private
			*/
			Pool.prototype._createWorkerHandler = function() {
				var overriddenParams = this.onCreateWorker({
					forkArgs: this.forkArgs,
					forkOpts: this.forkOpts,
					workerOpts: this.workerOpts,
					workerThreadOpts: this.workerThreadOpts,
					script: this.script
				}) || {};
				return new WorkerHandler(overriddenParams.script || this.script, {
					forkArgs: overriddenParams.forkArgs || this.forkArgs,
					forkOpts: overriddenParams.forkOpts || this.forkOpts,
					workerOpts: overriddenParams.workerOpts || this.workerOpts,
					workerThreadOpts: overriddenParams.workerThreadOpts || this.workerThreadOpts,
					debugPort: DEBUG_PORT_ALLOCATOR.nextAvailableStartingAt(this.debugPortStart),
					workerType: this.workerType,
					workerTerminateTimeout: this.workerTerminateTimeout,
					emitStdStreams: this.emitStdStreams
				});
			};
			/**
			* Create queue instance based on strategy
			* @param {'fifo' | 'lifo' | import('./types').TaskQueue} strategy
			* @returns {import('./types').TaskQueue} Queue instance
			* @private
			*/
			Pool.prototype._createQueue = function(strategy) {
				if (typeof strategy === "string") switch (strategy) {
					case "fifo": return new FIFOQueue();
					case "lifo": return new LIFOQueue();
					default: throw new Error("Unknown queue strategy: " + strategy);
				}
				if (!strategy) throw new Error("Queue strategy cannot be null or undefined");
				var requiredMethods = [
					"push",
					"pop",
					"size",
					"contains",
					"clear"
				];
				for (var i = 0; i < requiredMethods.length; i++) {
					var method = requiredMethods[i];
					if (typeof strategy[method] !== "function") throw new Error("Queue strategy must implement method: " + method);
				}
				return strategy;
			};
			/**
			* Ensure that the maxWorkers option is an integer >= 1
			* @param {*} maxWorkers
			* @returns {boolean} returns true maxWorkers has a valid value
			*/
			function validateMaxWorkers(maxWorkers) {
				if (!isNumber(maxWorkers) || !isInteger(maxWorkers) || maxWorkers < 1) throw new TypeError("Option maxWorkers must be an integer number >= 1");
			}
			/**
			* Ensure that the minWorkers option is an integer >= 0
			* @param {*} minWorkers
			* @returns {boolean} returns true when minWorkers has a valid value
			*/
			function validateMinWorkers(minWorkers) {
				if (!isNumber(minWorkers) || !isInteger(minWorkers) || minWorkers < 0) throw new TypeError("Option minWorkers must be an integer number >= 0");
			}
			/**
			* Test whether a variable is a number
			* @param {*} value
			* @returns {boolean} returns true when value is a number
			*/
			function isNumber(value) {
				return typeof value === "number";
			}
			/**
			* Test whether a number is an integer
			* @param {number} value
			* @returns {boolean} Returns true if value is an integer
			*/
			function isInteger(value) {
				return Math.round(value) == value;
			}
			Pool_1 = Pool;
			return Pool_1;
		}
		var worker$1 = {};
		/**
		* The helper class for transferring data from the worker to the main thread.
		*
		* @param {Object} message The object to deliver to the main thread.
		* @param {Object[]} transfer An array of transferable Objects to transfer ownership of.
		*/
		var transfer;
		var hasRequiredTransfer;
		function requireTransfer() {
			if (hasRequiredTransfer) return transfer;
			hasRequiredTransfer = 1;
			function Transfer(message, transfer) {
				this.message = message;
				this.transfer = transfer;
			}
			transfer = Transfer;
			return transfer;
		}
		var hasRequiredWorker;
		function requireWorker() {
			if (hasRequiredWorker) return worker$1;
			hasRequiredWorker = 1;
			(function(exports$1) {
				var Transfer = requireTransfer();
				/**
				* worker must handle async cleanup handlers. Use custom Promise implementation. 
				*/
				var Promise = require_Promise().Promise;
				/**
				* Special message sent by parent which causes the worker to terminate itself.
				* Not a "message object"; this string is the entire message.
				*/
				var TERMINATE_METHOD_ID = "__workerpool-terminate__";
				/**
				* Special message by parent which causes a child process worker to perform cleaup
				* steps before determining if the child process worker should be terminated.
				*/
				var CLEANUP_METHOD_ID = "__workerpool-cleanup__";
				var TIMEOUT_DEFAULT = 1e3;
				var worker = { exit: function exit() {} };
				var publicWorker = {
					/**
					* Registers listeners which will trigger when a task is timed out or cancled. If all listeners resolve, the worker executing the given task will not be terminated.
					* *Note*: If there is a blocking operation within a listener, the worker will be terminated.
					* @param {() => Promise<void>} listener
					*/
					addAbortListener: function addAbortListener(listener) {
						worker.abortListeners.push(listener);
					},
					/**
					* Emit an event from the worker thread to the main thread.
					* @param {any} payload
					*/
					emit: worker.emit
				};
				if (typeof self !== "undefined" && typeof postMessage === "function" && typeof addEventListener === "function") {
					worker.on = function(event, callback) {
						addEventListener(event, function(message) {
							callback(message.data);
						});
					};
					worker.send = function(message, transfer) {
						transfer ? postMessage(message, transfer) : postMessage(message);
					};
				} else if (typeof process !== "undefined") {
					var WorkerThreads;
					try {
						WorkerThreads = require___vite_browser_external();
					} catch (error) {
						if (_typeof(error) === "object" && error !== null && error.code === "MODULE_NOT_FOUND");
						else throw error;
					}
					if (WorkerThreads && WorkerThreads.parentPort !== null) {
						var parentPort = WorkerThreads.parentPort;
						worker.send = parentPort.postMessage.bind(parentPort);
						worker.on = parentPort.on.bind(parentPort);
						worker.exit = process.exit.bind(process);
					} else {
						worker.on = process.on.bind(process);
						worker.send = function(message) {
							process.send(message);
						};
						worker.on("disconnect", function() {
							process.exit(1);
						});
						worker.exit = process.exit.bind(process);
					}
				} else throw new Error("Script must be executed as a worker");
				function convertError(error) {
					if (error && error.toJSON) return JSON.parse(JSON.stringify(error));
					return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
				}
				/**
				* Test whether a value is a Promise via duck typing.
				* @param {*} value
				* @returns {boolean} Returns true when given value is an object
				*                    having functions `then` and `catch`.
				*/
				function isPromise(value) {
					return value && typeof value.then === "function" && typeof value.catch === "function";
				}
				worker.methods = {};
				/**
				* Execute a function with provided arguments
				* @param {String} fn     Stringified function
				* @param {Array} [args]  Function arguments
				* @returns {*}
				*/
				worker.methods.run = function run(fn, args) {
					var f = new Function("return (" + fn + ").apply(this, arguments);");
					f.worker = publicWorker;
					return f.apply(f, args);
				};
				/**
				* Get a list with methods available on this worker
				* @return {String[]} methods
				*/
				worker.methods.methods = function methods() {
					return Object.keys(worker.methods);
				};
				/**
				* Custom handler for when the worker is terminated.
				*/
				worker.terminationHandler = void 0;
				worker.abortListenerTimeout = TIMEOUT_DEFAULT;
				/**
				* Abort handlers for resolving errors which may cause a timeout or cancellation
				* to occur from a worker context
				*/
				worker.abortListeners = [];
				/**
				* Cleanup and exit the worker.
				* @param {Number} code 
				* @returns {Promise<void>}
				*/
				worker.terminateAndExit = function(code) {
					var _exit = function _exit() {
						worker.exit(code);
					};
					if (!worker.terminationHandler) return _exit();
					var result = worker.terminationHandler(code);
					if (isPromise(result)) {
						result.then(_exit, _exit);
						return result;
					} else {
						_exit();
						return new Promise(function(_resolve, reject) {
							reject(/* @__PURE__ */ new Error("Worker terminating"));
						});
					}
				};
				/**
				* Called within the worker message handler to run abort handlers if registered to perform cleanup operations.
				* @param {Integer} [requestId] id of task which is currently executing in the worker
				* @return {Promise<void>}
				*/
				worker.cleanup = function(requestId) {
					if (!worker.abortListeners.length) {
						worker.send({
							id: requestId,
							method: CLEANUP_METHOD_ID,
							error: convertError(/* @__PURE__ */ new Error("Worker terminating"))
						});
						return new Promise(function(resolve) {
							resolve();
						});
					}
					var _exit = function _exit() {
						worker.exit();
					};
					var _abort = function _abort() {
						if (!worker.abortListeners.length) worker.abortListeners = [];
					};
					var promises = worker.abortListeners.map(function(listener) {
						return listener();
					});
					var timerId;
					var timeoutPromise = new Promise(function(_resolve, reject) {
						timerId = setTimeout(function() {
							reject(/* @__PURE__ */ new Error("Timeout occured waiting for abort handler, killing worker"));
						}, worker.abortListenerTimeout);
					});
					var settlePromise = Promise.all(promises).then(function() {
						clearTimeout(timerId);
						_abort();
					}, function() {
						clearTimeout(timerId);
						_exit();
					});
					return new Promise(function(resolve, reject) {
						settlePromise.then(resolve, reject);
						timeoutPromise.then(resolve, reject);
					}).then(function() {
						worker.send({
							id: requestId,
							method: CLEANUP_METHOD_ID,
							error: null
						});
					}, function(err) {
						worker.send({
							id: requestId,
							method: CLEANUP_METHOD_ID,
							error: err ? convertError(err) : null
						});
					});
				};
				var currentRequestId = null;
				worker.on("message", function(request) {
					if (request === TERMINATE_METHOD_ID) return worker.terminateAndExit(0);
					if (request.method === CLEANUP_METHOD_ID) return worker.cleanup(request.id);
					try {
						var method = worker.methods[request.method];
						if (method) {
							currentRequestId = request.id;
							var result = method.apply(method, request.params);
							if (isPromise(result)) result.then(function(result) {
								if (result instanceof Transfer) worker.send({
									id: request.id,
									result: result.message,
									error: null
								}, result.transfer);
								else worker.send({
									id: request.id,
									result,
									error: null
								});
								currentRequestId = null;
							}).catch(function(err) {
								worker.send({
									id: request.id,
									result: null,
									error: convertError(err)
								});
								currentRequestId = null;
							});
							else {
								if (result instanceof Transfer) worker.send({
									id: request.id,
									result: result.message,
									error: null
								}, result.transfer);
								else worker.send({
									id: request.id,
									result,
									error: null
								});
								currentRequestId = null;
							}
						} else throw new Error("Unknown method \"" + request.method + "\"");
					} catch (err) {
						worker.send({
							id: request.id,
							result: null,
							error: convertError(err)
						});
					}
				});
				/**
				* Register methods to the worker
				* @param {Object} [methods]
				* @param {import('./types.js').WorkerRegisterOptions} [options]
				*/
				worker.register = function(methods, options) {
					if (methods) {
						for (var name in methods) if (methods.hasOwnProperty(name)) {
							worker.methods[name] = methods[name];
							worker.methods[name].worker = publicWorker;
						}
					}
					if (options) {
						worker.terminationHandler = options.onTerminate;
						worker.abortListenerTimeout = options.abortListenerTimeout || TIMEOUT_DEFAULT;
					}
					worker.send("ready");
				};
				worker.emit = function(payload) {
					if (currentRequestId) {
						if (payload instanceof Transfer) {
							worker.send({
								id: currentRequestId,
								isEvent: true,
								payload: payload.message
							}, payload.transfer);
							return;
						}
						worker.send({
							id: currentRequestId,
							isEvent: true,
							payload
						});
					}
				};
				exports$1.add = worker.register;
				exports$1.emit = worker.emit;
			})(worker$1);
			return worker$1;
		}
		var platform = environmentExports.platform, isMainThread = environmentExports.isMainThread, cpus = environmentExports.cpus;
		var TerminateError = WorkerHandlerExports.TerminateError;
		/** @typedef {import("./Pool")} Pool */
		/** @typedef {import("./types.js").WorkerPoolOptions} WorkerPoolOptions */
		/** @typedef {import("./types.js").WorkerRegisterOptions} WorkerRegisterOptions */
		/**
		* @template { { [k: string]: (...args: any[]) => any } } T
		* @typedef {import('./types.js').Proxy<T>} Proxy<T>
		*/
		/**
		* @overload
		* Create a new worker pool
		* @param {WorkerPoolOptions} [script]
		* @returns {Pool} pool
		*/
		/**
		* @overload
		* Create a new worker pool
		* @param {string} [script]
		* @param {WorkerPoolOptions} [options]
		* @returns {Pool} pool
		*/
		function pool(script, options) {
			return new (requirePool())(script, options);
		}
		var pool_1 = src.pool = pool;
		/**
		* Create a worker and optionally register a set of methods to the worker.
		* @param {{ [k: string]: (...args: any[]) => any }} [methods]
		* @param {WorkerRegisterOptions} [options]
		*/
		function worker(methods, options) {
			requireWorker().add(methods, options);
		}
		var worker_1 = src.worker = worker;
		/**
		* Sends an event to the parent worker pool.
		* @param {any} payload 
		*/
		function workerEmit(payload) {
			requireWorker().emit(payload);
		}
		var workerEmit_1 = src.workerEmit = workerEmit;
		var _Promise = src.Promise = require_Promise().Promise;
		var Transfer = src.Transfer = requireTransfer();
		var platform_1 = src.platform = platform;
		var isMainThread_1 = src.isMainThread = isMainThread;
		var cpus_1 = src.cpus = cpus;
		var TerminateError_1 = src.TerminateError = TerminateError;
		exports$2.Promise = _Promise;
		exports$2.TerminateError = TerminateError_1;
		exports$2.Transfer = Transfer;
		exports$2.cpus = cpus_1;
		exports$2.default = src;
		exports$2.isMainThread = isMainThread_1;
		exports$2.platform = platform_1;
		exports$2.pool = pool_1;
		exports$2.worker = worker_1;
		exports$2.workerEmit = workerEmit_1;
		Object.defineProperty(exports$2, "__esModule", { value: true });
	}));
})))(), 1);
var _virtual_worker_script_default = "!function(e,n){\"object\"==typeof exports&&\"undefined\"!=typeof module?module.exports=n():\"function\"==typeof define&&define.amd?define(n):(e=\"undefined\"!=typeof globalThis?globalThis:e||self).worker=n()}(this,(function(){\"use strict\";function e(n){return e=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},e(n)}function n(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,\"default\")?e.default:e}var t={};var r=function(e,n){this.message=e,this.transfer=n},o={};function i(e,n){var t=this;if(!(this instanceof i))throw new SyntaxError(\"Constructor must be called with the new operator\");if(\"function\"!=typeof e)throw new SyntaxError(\"Function parameter handler(resolve, reject) missing\");var r=[],o=[];this.resolved=!1,this.rejected=!1,this.pending=!0,this[Symbol.toStringTag]=\"Promise\";var a=function(e,n){r.push(e),o.push(n)};this.then=function(e,n){return new i((function(t,r){var o=e?s(e,t,r):t,i=n?s(n,t,r):r;a(o,i)}),t)};var f=function(e){return t.resolved=!0,t.rejected=!1,t.pending=!1,r.forEach((function(n){n(e)})),a=function(n,t){n(e)},f=d=function(){},t},d=function(e){return t.resolved=!1,t.rejected=!0,t.pending=!1,o.forEach((function(n){n(e)})),a=function(n,t){t(e)},f=d=function(){},t};this.cancel=function(){return n?n.cancel():d(new u),t},this.timeout=function(e){if(n)n.timeout(e);else{var r=setTimeout((function(){d(new c(\"Promise timed out after \"+e+\" ms\"))}),e);t.always((function(){clearTimeout(r)}))}return t},e((function(e){f(e)}),(function(e){d(e)}))}function s(e,n,t){return function(r){try{var o=e(r);o&&\"function\"==typeof o.then&&\"function\"==typeof o.catch?o.then(n,t):n(o)}catch(e){t(e)}}}function u(e){this.message=e||\"promise cancelled\",this.stack=(new Error).stack}function c(e){this.message=e||\"timeout exceeded\",this.stack=(new Error).stack}return i.prototype.catch=function(e){return this.then(null,e)},i.prototype.always=function(e){return this.then(e,e)},i.prototype.finally=function(e){var n=this,t=function(){return new i((function(e){return e()})).then(e).then((function(){return n}))};return this.then(t,t)},i.all=function(e){return new i((function(n,t){var r=e.length,o=[];r?e.forEach((function(e,i){e.then((function(e){o[i]=e,0==--r&&n(o)}),(function(e){r=0,t(e)}))})):n(o)}))},i.defer=function(){var e={};return e.promise=new i((function(n,t){e.resolve=n,e.reject=t})),e},u.prototype=new Error,u.prototype.constructor=Error,u.prototype.name=\"CancellationError\",i.CancellationError=u,c.prototype=new Error,c.prototype.constructor=Error,c.prototype.name=\"TimeoutError\",i.TimeoutError=c,o.Promise=i,function(n){var t=r,i=o.Promise,s=\"__workerpool-cleanup__\",u={exit:function(){}},c={addAbortListener:function(e){u.abortListeners.push(e)},emit:u.emit};if(\"undefined\"!=typeof self&&\"function\"==typeof postMessage&&\"function\"==typeof addEventListener)u.on=function(e,n){addEventListener(e,(function(e){n(e.data)}))},u.send=function(e,n){n?postMessage(e,n):postMessage(e)};else{if(\"undefined\"==typeof process)throw new Error(\"Script must be executed as a worker\");var a;try{a=require(\"worker_threads\")}catch(n){if(\"object\"!==e(n)||null===n||\"MODULE_NOT_FOUND\"!==n.code)throw n}if(a&&null!==a.parentPort){var f=a.parentPort;u.send=f.postMessage.bind(f),u.on=f.on.bind(f),u.exit=process.exit.bind(process)}else u.on=process.on.bind(process),u.send=function(e){process.send(e)},u.on(\"disconnect\",(function(){process.exit(1)})),u.exit=process.exit.bind(process)}function d(e){return e&&e.toJSON?JSON.parse(JSON.stringify(e)):JSON.parse(JSON.stringify(e,Object.getOwnPropertyNames(e)))}function l(e){return e&&\"function\"==typeof e.then&&\"function\"==typeof e.catch}u.methods={},u.methods.run=function(e,n){var t=new Function(\"return (\"+e+\").apply(this, arguments);\");return t.worker=c,t.apply(t,n)},u.methods.methods=function(){return Object.keys(u.methods)},u.terminationHandler=void 0,u.abortListenerTimeout=1e3,u.abortListeners=[],u.terminateAndExit=function(e){var n=function(){u.exit(e)};if(!u.terminationHandler)return n();var t=u.terminationHandler(e);return l(t)?(t.then(n,n),t):(n(),new i((function(e,n){n(new Error(\"Worker terminating\"))})))},u.cleanup=function(e){if(!u.abortListeners.length)return u.send({id:e,method:s,error:d(new Error(\"Worker terminating\"))}),new i((function(e){e()}));var n,t=u.abortListeners.map((function(e){return e()})),r=new i((function(e,t){n=setTimeout((function(){t(new Error(\"Timeout occured waiting for abort handler, killing worker\"))}),u.abortListenerTimeout)})),o=i.all(t).then((function(){clearTimeout(n),u.abortListeners.length||(u.abortListeners=[])}),(function(){clearTimeout(n),u.exit()}));return new i((function(e,n){o.then(e,n),r.then(e,n)})).then((function(){u.send({id:e,method:s,error:null})}),(function(n){u.send({id:e,method:s,error:n?d(n):null})}))};var p=null;u.on(\"message\",(function(e){if(\"__workerpool-terminate__\"===e)return u.terminateAndExit(0);if(e.method===s)return u.cleanup(e.id);try{var n=u.methods[e.method];if(!n)throw new Error('Unknown method \"'+e.method+'\"');p=e.id;var r=n.apply(n,e.params);l(r)?r.then((function(n){n instanceof t?u.send({id:e.id,result:n.message,error:null},n.transfer):u.send({id:e.id,result:n,error:null}),p=null})).catch((function(n){u.send({id:e.id,result:null,error:d(n)}),p=null})):(r instanceof t?u.send({id:e.id,result:r.message,error:null},r.transfer):u.send({id:e.id,result:r,error:null}),p=null)}catch(n){u.send({id:e.id,result:null,error:d(n)})}})),u.register=function(e,n){if(e)for(var t in e)e.hasOwnProperty(t)&&(u.methods[t]=e[t],u.methods[t].worker=c);n&&(u.terminationHandler=n.onTerminate,u.abortListenerTimeout=n.abortListenerTimeout||1e3),u.send(\"ready\")},u.emit=function(e){if(p){if(e instanceof t)return void u.send({id:p,isEvent:!0,payload:e.message},e.transfer);u.send({id:p,isEvent:!0,payload:e})}},n.add=u.register,n.emit=u.emit}(t),n(t)}));\n\n;(function(){\nvar runTask=(function thread() {\n    const MAXMEM = 32767;\n    let instance;\n    let memory;\n\n    // Lazily cached typed-array views over wasm memory.\n    // Invalidated automatically when memory.grow() replaces memory.buffer.\n    let _u32 = null;\n    let _u8  = null;\n\n    function getU32() {\n        if (_u32 === null || _u32.buffer !== memory.buffer) {\n            _u32 = new Uint32Array(memory.buffer, 0, 1);\n        }\n        return _u32;\n    }\n\n    function getU8() {\n        if (_u8 === null || _u8.buffer !== memory.buffer) {\n            _u8 = new Uint8Array(memory.buffer);\n        }\n        return _u8;\n    }\n\n    async function init(data) {\n        let wasmModule;\n        if (data.code instanceof WebAssembly.Module) {\n            wasmModule = data.code;\n        } else {\n            wasmModule = await WebAssembly.compile(new Uint8Array(data.code));\n        }\n        memory = new WebAssembly.Memory({initial: data.init, maximum: MAXMEM});\n        // Reset cached views — new memory means new backing buffer.\n        _u32 = null;\n        _u8  = null;\n        instance = await WebAssembly.instantiate(wasmModule, {env: {memory}});\n    }\n\n    function alloc(length) {\n        const u32 = getU32();\n        // Align to 4 bytes with a branchless bitmask instead of a loop.\n        u32[0] = (u32[0] + 3) & ~3;\n        const res = u32[0];\n        u32[0] += length;\n        if (u32[0] + length > memory.buffer.byteLength) {\n            const currentPages = memory.buffer.byteLength / 0x10000;\n            let requiredPages = Math.floor((u32[0] + length) / 0x10000) + 1;\n            if (requiredPages > MAXMEM) requiredPages = MAXMEM;\n            memory.grow(requiredPages - currentPages);\n            // memory.buffer changed — cached views are now stale.\n        }\n        return res;\n    }\n\n    function allocBuffer(buffer) {\n        const src = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);\n        const p = alloc(src.byteLength);\n        // getU8() handles re-creation if alloc() triggered a grow.\n        getU8().set(src, p);\n        return p;\n    }\n\n    function getBuffer(pointer, length) {\n        return new Uint8Array(memory.buffer, pointer, length);\n    }\n\n    function setBuffer(pointer, buffer) {\n        getU8().set(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer), pointer);\n    }\n\n    function runTask(task) {\n        if (task[0].cmd === \"INIT\") {\n            // INIT is the only async path — return a Promise so workerpool\n            // can await it; all other tasks execute synchronously to prevent\n            // concurrent execution of tasks within the same worker.\n            return init(task[0]);\n        }\n        const vars = [];\n        const out  = [];\n        const oldAlloc = getU32()[0];\n        for (let i = 0; i < task.length; i++) {\n            const step = task[i];\n            switch (step.cmd) {\n            case \"ALLOCSET\":\n                vars[step.var] = allocBuffer(step.buff);\n                break;\n            case \"ALLOC\":\n                vars[step.var] = alloc(step.len);\n                break;\n            case \"SET\":\n                setBuffer(vars[step.var], step.buff);\n                break;\n            case \"CALL\": {\n                const paramDefs = step.params;\n                const params = new Array(paramDefs.length);\n                for (let j = 0; j < paramDefs.length; j++) {\n                    const p = paramDefs[j];\n                    params[j] = p.var !== undefined\n                        ? vars[p.var] + (p.offset || 0)\n                        : p.val;\n                }\n                instance.exports[step.fnName](...params);\n                break;\n            }\n            case \"GET\":\n                out[step.out] = getBuffer(vars[step.var], step.len).slice();\n                break;\n            default:\n                throw new Error(\"Invalid cmd: \" + step.cmd);\n            }\n        }\n        // Reclaim task-local allocations. getU32() handles a post-grow buffer.\n        getU32()[0] = oldAlloc;\n        return out;\n    }\n\n    return runTask;\n})();\nworker.add({runTask:runTask});\n})();";
//#endregion
//#region src/threadman.browser.js
function getConcurrency() {
	return typeof navigator === "object" && navigator.hardwareConcurrency || 2;
}
function getWorkerType() {
	return "web";
}
function supportsWorkers() {
	return typeof Worker !== "undefined";
}
var _workerSource = null;
function getWorkerSource() {
	if (_workerSource) return _workerSource;
	const blob = new Blob([_virtual_worker_script_default], { type: "application/javascript" });
	_workerSource = (globalThis.URL ? globalThis.URL : globalThis.webkitURL).createObjectURL(blob);
	return _workerSource;
}
//#endregion
//#region src/threadman.js
var MEM_SIZE = 25;
async function buildThreadManager(wasm, singleThread) {
	const tm = new ThreadManager();
	tm.memory = new WebAssembly.Memory({ initial: MEM_SIZE });
	tm.u8 = new Uint8Array(tm.memory.buffer);
	tm.u32 = new Uint32Array(tm.memory.buffer);
	const wasmModule = await WebAssembly.compile(wasm.code);
	tm.instance = await WebAssembly.instantiate(wasmModule, { env: { "memory": tm.memory } });
	if (!supportsWorkers()) singleThread = true;
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
	if (singleThread) {
		tm.taskManager = thread();
		await tm.taskManager([{
			cmd: "INIT",
			init: MEM_SIZE,
			code: tm.code.slice()
		}]);
		tm.concurrency = 1;
	} else {
		const rawConcurrency = getConcurrency();
		const concurrency = Math.min(Math.max(rawConcurrency, 2), 64);
		tm.concurrency = concurrency;
		tm.pool = import_workerpool.default.pool(getWorkerSource(), {
			maxWorkers: concurrency,
			workerType: getWorkerType()
		});
		const initPromises = [];
		for (let i = 0; i < concurrency; i++) initPromises.push(tm.pool.exec("runTask", [[{
			cmd: "INIT",
			init: MEM_SIZE,
			code: tm.wasmModule
		}]]));
		await Promise.all(initPromises);
	}
	return tm;
}
var ThreadManager = class {
	constructor() {
		this.oldPFree = 0;
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
	async queueAction(actionData, transfers) {
		if (this.singleThread) return this.taskManager(actionData);
		return this.pool.exec("runTask", [actionData], { transfer: transfers });
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
		this.u32[0] = this.u32[0] + 3 & -4;
		const res = this.u32[0];
		this.u32[0] += length;
		return res;
	}
	async terminate() {
		if (this.pool) await this.pool.terminate(true);
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
		} else throw new Error("Invalid group: " + groupName);
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
		if (buff instanceof BigBuffer) outBuff = new BigBuffer(nPoints * sGout);
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
		const pA = tm.allocBuff(curve.G1.toJacobian(a));
		const pB = tm.allocBuff(curve.G2.toJacobian(b));
		const pRes = tm.alloc(curve.Gt.n8);
		tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);
		const res = tm.getBuff(pRes, curve.Gt.n8);
		tm.endSyncOp();
		return res;
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
			opPromises.push(tm.queueAction(task, [g1Buff.buffer, g2Buff.buffer]));
		}
		const result = await Promise.all(opPromises);
		tm.startSyncOp();
		const pRes = tm.alloc(curve.Gt.n8);
		tm.instance.exports.ftm_one(pRes);
		for (let i = 0; i < result.length; i++) {
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
	async function _multiExpChunk(buffBases, buffScalars, inType, logger, logText) {
		if (!(buffBases instanceof Uint8Array)) {
			if (logger) logger.error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
			throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
		}
		if (!(buffScalars instanceof Uint8Array)) {
			if (logger) logger.error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
			throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
		}
		inType = inType || "affine";
		let sGIn;
		let fnName;
		if (groupName === "G1") if (inType === "affine") {
			fnName = "g1m_multiexpAffine";
			sGIn = G.F.n8 * 2;
		} else {
			fnName = "g1m_multiexp";
			sGIn = G.F.n8 * 3;
		}
		else if (groupName === "G2") if (inType === "affine") {
			fnName = "g2m_multiexpAffine";
			sGIn = G.F.n8 * 2;
		} else {
			fnName = "g2m_multiexp";
			sGIn = G.F.n8 * 3;
		}
		else throw new Error("Invalid group");
		const nPoints = Math.floor(buffBases.byteLength / sGIn);
		if (nPoints === 0) return G.zero;
		const sScalar = Math.floor(buffScalars.byteLength / nPoints);
		if (sScalar * nPoints !== buffScalars.byteLength) throw new Error("Scalar size does not match");
		const bitChunkSize = pTSizes[log2(nPoints)];
		const opPromises = [];
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
				fnName,
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
		opPromises.push(G.tm.queueAction(task, [buffBases.buffer, buffScalars.buffer]));
		const result = await Promise.all(opPromises);
		let res = G.zero;
		for (let i = result.length - 1; i >= 0; i--) {
			if (!G.isZero(res)) for (let j = 0; j < bitChunkSize; j++) res = G.double(res);
			res = G.add(res, result[i][0]);
		}
		return res;
	}
	async function _multiExp(buffBases, buffScalars, inType, logger, logText) {
		const MAX_CHUNK_SIZE = 1 << 22;
		const MIN_CHUNK_SIZE = 4096;
		let sGIn;
		if (groupName === "G1") if (inType === "affine") sGIn = G.F.n8 * 2;
		else sGIn = G.F.n8 * 3;
		else if (groupName === "G2") if (inType === "affine") sGIn = G.F.n8 * 2;
		else sGIn = G.F.n8 * 3;
		else throw new Error("Invalid group");
		const nPoints = Math.floor(buffBases.byteLength / sGIn);
		if (nPoints === 0) return G.zero;
		const sScalar = Math.floor(buffScalars.byteLength / nPoints);
		if (sScalar * nPoints !== buffScalars.byteLength) throw new Error("Scalar size does not match");
		const opPromises = [];
		const bitChunkSize = pTSizes[log2(nPoints)];
		let nChunks = Math.floor((sScalar * 8 - 1) / bitChunkSize) + 1;
		if (groupName === "G2") nChunks *= 2;
		let chunkSize;
		console.log("nChunks_0", nChunks);
		nChunks = (Math.floor((nChunks - 1) / tm.concurrency) + 1) * tm.concurrency;
		chunkSize = Math.floor(nPoints / nChunks) + 1;
		if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
		if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
		console.log("nChunks", nChunks);
		console.log("effective nChunks", nPoints / chunkSize);
		for (let i = 0; i < nPoints; i += chunkSize) {
			if (logger) logger.debug(`Multiexp start: ${logText}: ${i}/${nPoints}`);
			const n = Math.min(nPoints - i, chunkSize);
			const buffBasesChunk = buffBases.slice(i * sGIn, (i + n) * sGIn);
			const buffScalarsChunk = buffScalars.slice(i * sScalar, (i + n) * sScalar);
			opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType, logger, logText).then((r) => {
				if (logger) logger.debug(`Multiexp end: ${logText}: ${i}/${nPoints}`);
				return r;
			}));
		}
		const result = await Promise.all(opPromises);
		let res = G.zero;
		for (let i = result.length - 1; i >= 0; i--) res = G.add(res, result[i]);
		return res;
	}
	G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
		return _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
	};
	G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
		return _multiExp(buffBases, buffScalars, "affine", logger, logText);
	};
}
//#endregion
//#region src/engine_fft.js
function buildFFT(curve, groupName) {
	const G = curve[groupName];
	const Fr = curve.Fr;
	const tm = G.tm;
	async function _fft(buff, inverse, inType, outType, logger, loggerTxt) {
		inType = inType || "affine";
		outType = outType || "affine";
		const MAX_BITS_THREAD = 14;
		let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnFFTMix, fnFFTJoin, fnFFTFinal, fnReversePermutation;
		if (groupName == "G1") {
			if (inType == "affine") {
				sIn = G.F.n8 * 2;
				fnIn2Mid = "g1m_batchToJacobian";
			} else sIn = G.F.n8 * 3;
			sMid = G.F.n8 * 3;
			if (inverse) fnFFTFinal = "g1m_fftFinal";
			fnFFTJoin = "g1m_fftJoin";
			fnFFTMix = "g1m_fftMix";
			fnReversePermutation = "g1m__reversePermutation";
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
			fnReversePermutation = "g2m__reversePermutation";
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
			fnReversePermutation = "frm__reversePermutation";
		}
		let returnArray = false;
		if (Array.isArray(buff)) {
			buff = array2buffer(buff, sIn);
			returnArray = true;
		} else buff = buff.slice(0, buff.byteLength);
		const nPoints = buff.byteLength / sIn;
		const bits = log2(nPoints);
		if (1 << bits != nPoints) throw new Error("fft must be multiple of 2");
		if (bits == Fr.s + 1) {
			let buffOut;
			if (inverse) buffOut = await _fftExtInv(buff, inType, outType, logger, loggerTxt);
			else buffOut = await _fftExt(buff, inType, outType, logger, loggerTxt);
			if (returnArray) return buffer2array(buffOut, sOut);
			else return buffOut;
		}
		let inv;
		if (inverse) inv = Fr.inv(Fr.e(nPoints));
		let buffOut;
		if (sIn === sMid) {
			const task = [];
			task.push({
				cmd: "ALLOCSET",
				var: 0,
				buff
			});
			task.push({
				cmd: "CALL",
				fnName: fnReversePermutation,
				params: [{ var: 0 }, { val: bits }]
			});
			task.push({
				cmd: "GET",
				out: 0,
				var: 0,
				len: nPoints * sIn
			});
			buff = (await tm.queueAction(task, [buff.buffer]))[0];
		} else buffReverseBits(buff, sIn);
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
		if (buff instanceof BigBuffer) buffOut = new BigBuffer(nPoints * sOut);
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
	G.fft = async function(buff, inType, outType, logger, loggerTxt) {
		return await _fft(buff, false, inType, outType, logger, loggerTxt);
	};
	G.ifft = async function(buff, inType, outType, logger, loggerTxt) {
		return await _fft(buff, true, inType, outType, logger, loggerTxt);
	};
	G.lagrangeEvaluations = async function(buff, inType, outType, logger, loggerTxt) {
		inType = inType || "affine";
		outType = outType || "affine";
		let sIn;
		if (groupName == "G1") if (inType == "affine") sIn = G.F.n8 * 2;
		else sIn = G.F.n8 * 3;
		else if (groupName == "G2") if (inType == "affine") sIn = G.F.n8 * 2;
		else sIn = G.F.n8 * 3;
		else if (groupName == "Fr") sIn = Fr.n8;
		else throw new Error("Invalid group");
		const nPoints = buff.byteLength / sIn;
		const bits = log2(nPoints);
		if (2 ** bits * sIn != buff.byteLength) {
			if (logger) logger.error("lagrangeEvaluations iinvalid input size");
			throw new Error("lagrangeEvaluations invalid Input size");
		}
		if (bits <= Fr.s) return await G.ifft(buff, inType, outType, logger, loggerTxt);
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
		if (buff instanceof BigBuffer) fullBuffOut = new BigBuffer(nPoints * sG);
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
		if (buff instanceof BigBuffer) fullBuffOut = new BigBuffer(nPoints * sGout);
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
//#region src/bn128.js
globalThis.curve_bn128 = null;
async function buildBn128(singleThread, plugins) {
	if (!singleThread && globalThis.curve_bn128) return globalThis.curve_bn128;
	let bn128wasm = {};
	if (!plugins) {
		console.log("Using prebuilt bn128 wasm");
		const bn128wasmPrebuilt = await import("wasmcurves/build/bn128_wasm_gzip.js");
		bn128wasm.pq = bn128wasmPrebuilt.pq;
		bn128wasm.pr = bn128wasmPrebuilt.pr;
		bn128wasm.pG1gen = bn128wasmPrebuilt.pG1gen;
		bn128wasm.pG1zero = bn128wasmPrebuilt.pG1zero;
		bn128wasm.pG1b = bn128wasmPrebuilt.pG1b;
		bn128wasm.pG2gen = bn128wasmPrebuilt.pG2gen;
		bn128wasm.pG2zero = bn128wasmPrebuilt.pG2zero;
		bn128wasm.pG2b = bn128wasmPrebuilt.pG2b;
		bn128wasm.pOneT = bn128wasmPrebuilt.pOneT;
		bn128wasm.prePSize = bn128wasmPrebuilt.prePSize;
		bn128wasm.preQSize = bn128wasmPrebuilt.preQSize;
		bn128wasm.n8q = 32;
		bn128wasm.n8r = 32;
		bn128wasm.q = bn128wasmPrebuilt.q;
		bn128wasm.r = bn128wasmPrebuilt.r;
		const compressedCode = Uint8Array.from(atob(bn128wasmPrebuilt.gzipCode), (c) => c.charCodeAt(0));
		const blob = new Blob([compressedCode]);
		const ds = new DecompressionStream("gzip");
		const decompressedStream = blob.stream().pipeThrough(ds);
		bn128wasm.code = new Uint8Array(await new Response(decompressedStream).arrayBuffer());
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
			globalThis.curve_bn128 = null;
			await this.tm.terminate();
		}
	};
	if (!singleThread) globalThis.curve_bn128 = curve;
	return curve;
}
//#endregion
//#region src/bls12381.js
globalThis.curve_bls12381 = null;
async function buildBls12381(singleThread, plugins) {
	if (!singleThread && globalThis.curve_bls12381) return globalThis.curve_bls12381;
	const { ModuleBuilder } = await import("wasmbuilder");
	const { buildBls12381: buildBls12381wasm } = await import("wasmcurves");
	const moduleBuilder = new ModuleBuilder();
	moduleBuilder.setMemory(25);
	buildBls12381wasm(moduleBuilder);
	if (plugins) plugins(moduleBuilder);
	const bls12381wasm = {};
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
			globalThis.curve_bls12381 = null;
			await this.tm.terminate();
		}
	};
	if (!singleThread) globalThis.curve_bls12381 = curve;
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
