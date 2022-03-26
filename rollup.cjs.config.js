import fs from "fs";
import { builtinModules as builtin } from "module";
import jscc from 'rollup-plugin-jscc'

const pkg = JSON.parse(fs.readFileSync("./package.json"));

export default {
    input: "main.js",
    output: {
        file: "build/main.cjs",
        format: "cjs",
    },
    external: [
        ...Object.keys(pkg.dependencies),
        ...builtin,
    ],
    plugins: [
      jscc({
          values: { _SES: process.env.SES },
      })
    ],
};
