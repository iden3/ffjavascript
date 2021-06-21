import fs from "fs";
import { builtinModules as builtin } from "module";
//import webWorkerLoader from 'rollup-plugin-web-worker-loader';

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
    // plugins: [
    //     webWorkerLoader({ 
    //         "sourceMap": true,            
    //         "inline": true,
    //     }),
    // ]
};
