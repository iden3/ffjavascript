console.log("node cjs");
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
//#endregion
Object.defineProperty(exports, "__exportAll", {
	enumerable: true,
	get: function() {
		return __exportAll;
	}
});
Object.defineProperty(exports, "__toESM", {
	enumerable: true,
	get: function() {
		return __toESM;
	}
});
Object.defineProperty(exports, "thread", {
	enumerable: true,
	get: function() {
		return thread;
	}
});
