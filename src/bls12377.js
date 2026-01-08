import { buildBls12377 as buildBls12377wasm } from "wasmcurves";
import buildEngine from "./engine.js";
import * as Scalar from "./scalar.js";
import { ModuleBuilder } from "wasmbuilder";

globalThis.curve_bls12377 = null;

export default async function buildBls12377(singleThread, plugins) {
    if ((!singleThread) && (globalThis.curve_bls12377)) return globalThis.curve_bls12377;

    const moduleBuilder = new ModuleBuilder();
    moduleBuilder.setMemory(25);
    buildBls12377wasm(moduleBuilder);

    if (plugins) plugins(moduleBuilder);

    const bls12377wasm = {};

    bls12377wasm.code = moduleBuilder.build();
    bls12377wasm.pq = moduleBuilder.modules.f1m.pq;
    bls12377wasm.pr = moduleBuilder.modules.frm.pq;
    bls12377wasm.pG1gen = moduleBuilder.modules.bls12377.pG1gen;
    bls12377wasm.pG1zero = moduleBuilder.modules.bls12377.pG1zero;
    bls12377wasm.pG1b = moduleBuilder.modules.bls12377.pG1b;
    bls12377wasm.pG2gen = moduleBuilder.modules.bls12377.pG2gen;
    bls12377wasm.pG2zero = moduleBuilder.modules.bls12377.pG2zero;
    bls12377wasm.pG2b = moduleBuilder.modules.bls12377.pG2b;
    bls12377wasm.pOneT = moduleBuilder.modules.bls12377.pOneT;
    bls12377wasm.prePSize = moduleBuilder.modules.bls12377.prePSize;
    bls12377wasm.preQSize = moduleBuilder.modules.bls12377.preQSize;
    bls12377wasm.n8q = 48;
    bls12377wasm.n8r = 32;
    bls12377wasm.q = moduleBuilder.modules.bls12377.q;
    bls12377wasm.r = moduleBuilder.modules.bls12377.r;

    const params = {
        name: "bls12377",
        wasm: bls12377wasm,
        q: Scalar.e("01ae3a4617c510eac63b05c06ca1493b1a22d9f300f5138f1ef3622fba094800170b5d44300000008508c00000000001", 16),
        r: Scalar.e("12ab655e9a2ca55660b44d1e5c37b00159aa76fed00000010a11800000000001", 16),
        n8q: 48,
        n8r: 32,
        cofactorG1: Scalar.e("0x170b5d44300000000000000000000000", 16),
        cofactorG2: Scalar.e("0x26ba558ae9562addd88d99a6f6a829fbb36b00e1dcc40c8c505634fae2e189d693e8c36676bd09a0f3622fba094800452217cc900000000000000000000001", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function () {
        if (!params.singleThread) {
            globalThis.curve_bls12377 = null;
            await this.tm.terminate();
        }
    };

    if (!singleThread) {
        globalThis.curve_bls12377 = curve;
    }

    return curve;
}

