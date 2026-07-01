// Dev-only: regenerate the vendored prebuilt wasm modules from wasmcurves.
// Run: npm run gen-wasm   (wasmcurves + binaryen are devDependencies)
//
// We vendor the UNCOMPRESSED prebuilt (base64 of the raw wasm). wasmcurves emits
// an unoptimized, hand-assembled module; we run `wasm-opt -Oz` over it before
// vendoring -- this shrinks the binary ~15-21% (dead-local removal, inlining,
// internal DCE) with no behaviour change. `code` is base64 of the OPTIMIZED
// wasm; the rest are pointer offsets / moduli (unchanged -- wasm-opt preserves
// the data layout those pointers reference).
import { createRequire } from "module";
import { writeFileSync, mkdirSync, readFileSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execFileSync } from "child_process";
import { tmpdir } from "os";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "src", "wasm");
mkdirSync(outDir, { recursive: true });

// Resolve the wasm-opt binary shipped by the `binaryen` devDependency.
const wasmOpt = join(dirname(require.resolve("binaryen/package.json")), "bin", "wasm-opt");

// base64 wasm -> `wasm-opt -Oz` -> base64 wasm. Uses temp files so we invoke the
// exact CLI optimizer (deterministic, matches the -Oz pipeline 1:1).
function optimize(b64, name) {
    const raw = Buffer.from(b64, "base64");
    const inFile = join(tmpdir(), `ffjs-genwasm-${name}-in.wasm`);
    const outFile = join(tmpdir(), `ffjs-genwasm-${name}-out.wasm`);
    try {
        writeFileSync(inFile, raw);
        execFileSync(wasmOpt, ["-Oz", inFile, "-o", outFile], { stdio: ["ignore", "ignore", "inherit"] });
        const opt = readFileSync(outFile);
        return { b64: opt.toString("base64"), before: raw.length, after: opt.length };
    } finally {
        rmSync(inFile, { force: true });
        rmSync(outFile, { force: true });
    }
}

// Batch-affine MSM helper module (AssemblyScript). Curve-independent: it
// imports the field/group ops and shares the main module's memory, so one
// binary serves bn128 and bls12381.
{
    const raw = readFileSync(require.resolve("wasmcurves/build/msm_batch.wasm"));
    const { b64, before, after } = optimize(raw.toString("base64"), "msm_batch");
    const header =
        "// AUTO-GENERATED from wasmcurves/build/msm_batch.wasm — do not edit.\n" +
        "// Regenerate with: npm run gen-wasm\n" +
        "// Batch-affine MSM module; links against the main curve module at runtime.\n";
    writeFileSync(join(outDir, "msm_batch_wasm.js"), header + `export const code = ${JSON.stringify(b64)};\n`);
    console.log(`wrote src/wasm/msm_batch_wasm.js (wasm ${before} -> ${after} bytes)`);
}

for (const name of ["bn128", "bls12381"]) {
    const m = require(`wasmcurves/build/${name}_wasm.js`); // uncompressed prebuilt (CJS)
    const { b64, before, after } = optimize(m.code, name);
    const out = { ...m, code: b64 };
    const keys = Object.keys(out);
    const body = keys.map((k) => `export const ${k} = ${JSON.stringify(out[k])};`).join("\n");
    const header =
        `// AUTO-GENERATED from wasmcurves/build/${name}_wasm.js — do not edit.\n` +
        `// Regenerate with: npm run gen-wasm\n` +
        `// 'code' is base64 of the wasm-opt -Oz optimized wasm; the rest are\n` +
        `// pointer offsets / field moduli.\n`;
    writeFileSync(join(outDir, `${name}_wasm.js`), header + body + "\n");
    const pct = Math.round((1 - after / before) * 100);
    console.log(
        `wrote src/wasm/${name}_wasm.js (${keys.length} exports, wasm ${before} -> ${after} bytes, -${pct}%)`
    );
}
