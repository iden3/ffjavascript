import { typescriptLintPreset } from "@toruslabs/oxlint-config-typescript";
import { formatPreset } from "@toruslabs/torus-scripts/fmt";
import { libraryPreset } from "@toruslabs/torus-scripts/library";
import { defineConfig } from "vite-plus";

const library = libraryPreset({ entry: "src/index.ts", format: ["esm", "cjs"] });
const lint = typescriptLintPreset();

export default defineConfig({
  pack: {
    ...library.pack,
    dts: true,
    format: {
      esm: { outDir: "dist/lib.esm" },
      cjs: { outDir: "dist/lib.cjs" },
    },
    outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
    sourcemap: false,
  },
  fmt: formatPreset(),
  lint: {
    ...lint,
    rules: {
      ...lint.rules,
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  },
});
