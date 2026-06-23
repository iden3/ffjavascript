// Dev-only: regenerate the vendored prebuilt wasm modules from wasmcurves.
// Run: npm run gen-wasm   (wasmcurves is a devDependency)
//
// We vendor the UNCOMPRESSED prebuilt (base64 of the raw wasm)
// `code` is base64; the rest are pointer offsets / moduli.
import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "src", "wasm");
mkdirSync(outDir, { recursive: true });

for (const name of ["bn128", "bls12381"]) {
    const m = require(`wasmcurves/build/${name}_wasm.js`); // uncompressed prebuilt (CJS)
    const keys = Object.keys(m);
    const body = keys.map((k) => `export const ${k} = ${JSON.stringify(m[k])};`).join("\n");
    const header =
        `// AUTO-GENERATED from wasmcurves/build/${name}_wasm.js — do not edit.\n` +
        `// Regenerate with: npm run gen-wasm\n` +
        `// 'code' is base64 of the raw (uncompressed) wasm; the rest are pointer\n` +
        `// offsets / field moduli.\n`;
    writeFileSync(join(outDir, `${name}_wasm.js`), header + body + "\n");
    console.log(`wrote src/wasm/${name}_wasm.js (${keys.length} exports, code ${m.code.length} b64 chars)`);
}
