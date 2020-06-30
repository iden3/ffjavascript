const bn128_wasm = require("wasmsnark").bn128_wasm;
const buildEngine = require("./engine");
const Scalar = require("./scalar");

let curve;

module.exports = async function buildBn128() {

    if (curve) return curve;
    const params = {
        name: "bn128",
        wasm: bn128_wasm,
        q: Scalar.e("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
        r: Scalar.e("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
        n8q: 32,
        n8r: 32,
        cofactorG2: Scalar.e("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
        singleThread: false
    };

    curve = await buildEngine(params);
    return curve;
};

