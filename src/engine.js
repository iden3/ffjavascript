const WasmField1 =require("./wasm_field1");
const WasmField2 =require("./wasm_field2");
const WasmField3 =require("./wasm_field3");
const WasmCurve = require("./wasm_curve");
const buildThreadManager = require("./threadman");
const Scalar = require("./scalar");
const buildBatchApplyKey = require("./engine_applykey");
const buildPairing = require("./engine_pairing");
const buildMultiExp = require("./engine_multiexp");
const buildFFT = require("./engine_fft");

module.exports = buildEngine;

async function buildEngine(params) {

    const tm = await buildThreadManager(params.wasm, params.singleThread);

    const curve = {};

    curve.q = Scalar.e(params.wasm.q);
    curve.r = Scalar.e(params.wasm.r);
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

    buildMultiExp(curve, "G1");
    buildMultiExp(curve, "G2");

    buildFFT(curve, "G1");
    buildFFT(curve, "G2");
    buildFFT(curve, "Fr");

    buildPairing(curve);

    return curve;
}


