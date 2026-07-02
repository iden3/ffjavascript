import buildEngine from "./engine.js";
import * as Scalar from "./scalar.js";
import * as bn128wasmPrebuilt from "./wasm/bn128_wasm.js";
import * as msmBatchPrebuilt from "./wasm/msm_batch_wasm.js";
import { base64ToUint8Array } from "./wasm/base64.js";

// Module-local singleton cache. Must NOT be on globalThis: assigning to a frozen
// globalThis (e.g. a SES hardened-profile realm) throws at module load.
let curve_bn128 = null;

export default async function buildBn128(singleThread, plugins) {
    if ((!singleThread) && (curve_bn128)) return curve_bn128;

    let bn128wasm = {};

    if (!plugins) {
        // Vendored, uncompressed prebuilt wasm: statically imported (no runtime
        // wasmcurves dependency, no dynamic import) and base64-decoded without
        // atob/DecompressionStream, so it loads in Node, browsers and SES
        // hardened realms alike. Regenerate the vendored module with `npm run gen-wasm`.
        bn128wasm.code = base64ToUint8Array(bn128wasmPrebuilt.code);
        bn128wasm.pq = bn128wasmPrebuilt.pq;
        bn128wasm.pr = bn128wasmPrebuilt.pq;
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
    } else {
        // Custom-plugin build path: builds the wasm at runtime, so it needs the
        // wasm toolchain. Kept as a dynamic import so wasmbuilder/wasmcurves stay
        // OPTIONAL dependencies (only required when a caller passes `plugins`).
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

    // Batch-affine MSM helper module (curve-independent; links against the
    // main module's exports + memory at runtime in each worker).
    bn128wasm.batchCode = base64ToUint8Array(msmBatchPrebuilt.code);
    // The batch module's GLV path hardcodes the bn254 endomorphism constants.
    bn128wasm.glv = true;

    const params = {
        name: "bn128",
        wasm: bn128wasm,
        q: Scalar.e("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
        r: Scalar.e("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
        n8q: 32,
        n8r: 32,
        cofactorG2: Scalar.e("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
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

