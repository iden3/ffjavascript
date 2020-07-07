import resolve from "rollup-plugin-node-resolve";
import commonJS from "rollup-plugin-commonjs";

export default {
    input: "main.js",
    output: {
        file: "build/main.js",
        format: "cjs",
    },
    external: ["crypto", "os", "worker_threads"],
    plugins: [
        resolve({ preferBuiltins: true }),
        commonJS({
            preserveSymlinks: true
        }),
    ]
};

