import buildEngine from "./engine.js";
import * as Scalar from "./scalar.js";
import * as bls12381wasmPrebuilt from "./wasm/bls12381_wasm.js";
import * as msmBatchPrebuilt from "./wasm/msm_batch_wasm.js";
import { base64ToUint8Array } from "./wasm/base64.js";

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a SES hardened-profile realm) throws at module load.
let curve_bls12381 = null;

export default async function buildBls12381(singleThread, plugins) {
    if ((!singleThread) && (curve_bls12381)) return curve_bls12381;
    // Concurrent first builds must share one curve (and one worker
    // pool): cache the in-flight build promise, not just the result.
    if (!singleThread) {
        if (!building_curve_bls12381) building_curve_bls12381 = _build(singleThread, plugins).finally(() => { building_curve_bls12381 = null; });
        return building_curve_bls12381;
    }
    return _build(singleThread, plugins);
}

let building_curve_bls12381 = null;

async function _build(singleThread, plugins) {

    const bls12381wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: static import (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES
        // hardened realms alike. Also avoids recompiling the wasm on every load.
        // Regenerate the vendored module with `npm run gen-wasm`.
        bls12381wasm.code = base64ToUint8Array(bls12381wasmPrebuilt.code);
        bls12381wasm.pq = bls12381wasmPrebuilt.pq;
        bls12381wasm.pr = bls12381wasmPrebuilt.pr;
        bls12381wasm.pG1gen = bls12381wasmPrebuilt.pG1gen;
        bls12381wasm.pG1zero = bls12381wasmPrebuilt.pG1zero;
        bls12381wasm.pG1b = bls12381wasmPrebuilt.pG1b;
        bls12381wasm.pG2gen = bls12381wasmPrebuilt.pG2gen;
        bls12381wasm.pG2zero = bls12381wasmPrebuilt.pG2zero;
        bls12381wasm.pG2b = bls12381wasmPrebuilt.pG2b;
        bls12381wasm.pOneT = bls12381wasmPrebuilt.pOneT;
        bls12381wasm.prePSize = bls12381wasmPrebuilt.prePSize;
        bls12381wasm.preQSize = bls12381wasmPrebuilt.preQSize;
        bls12381wasm.n8q = 48;
        bls12381wasm.n8r = 32;
        bls12381wasm.q = bls12381wasmPrebuilt.q;
        bls12381wasm.r = bls12381wasmPrebuilt.r;
    } else {
        // Custom-plugin build path: builds the wasm at runtime, so it needs the
        // wasm toolchain. Kept as a dynamic import so wasmbuilder/wasmcurves stay
        // OPTIONAL dependencies (only required when a caller passes `plugins`).
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


    // Batch-affine MSM helper module (curve-independent; links against the
    // main module's exports + memory at runtime in each worker).
    bls12381wasm.batchCode = base64ToUint8Array(msmBatchPrebuilt.code);
    // The batch module's GLV path carries bls12-381 G1 constants too (G2 GLS
    // is bn254-only; the wasm falls through internally for bls G2 sizes).
    bls12381wasm.glv = true;

    const params = {
        name: "bls12381",
        wasm: bls12381wasm,
        q: Scalar.e("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16),
        r: Scalar.e("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16),
        n8q: 48,
        n8r: 32,
        cofactorG1: Scalar.e("0x396c8c005555e1568c00aaab0000aaab", 16),
        cofactorG2: Scalar.e("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5", 16),
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

