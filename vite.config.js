import { defineConfig } from "vite";
import { builtinModules } from "module";
import { readFileSync } from "fs";
import { resolve } from "path";
import replace from "@rollup/plugin-replace";
import thread from "./src/threadman_thread.js";

const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf-8"));

// Node build: all declared deps + builtins stay external (required at runtime).
const nodeExternal = [
    ...builtinModules,
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {}),
];
const isNodeExternal = (id) =>
    nodeExternal.includes(id) || nodeExternal.some((e) => id.startsWith(e + "/"));

// Browser build transform (ports the old rollup.browser.esm.config replace):
//  - process.browser -> true
//  - strip the node-only `web-worker` import (browsers have native Worker)
//  - bake the worker thread function in as a string literal so bundlers and
//    monkey-patching UI frameworks (Angular/Ember/jQuery...) can't mangle it
const browserReplace = replace({
    preventAssignment: true,
    delimiters: ["", ""],
    "process.browser": true,
    "import Worker from \"./nodeworker.js\"": "",
    "thread.toString()": JSON.stringify(thread.toString()),
});

export default defineConfig(({ mode }) => {
    if (mode === "browser") {
        return {
            plugins: [browserReplace],
            build: {
                lib: {
                    entry: "./main.js",
                    formats: ["es"],
                    fileName: () => "browser.esm.js",
                },
                outDir: "build",
                emptyOutDir: false,
                minify: false,
                rollupOptions: {
                    // Runtime wasm codegen toolchain: only reachable via the
                    // custom-`plugins` curve-build path, kept external so the
                    // lazy import() survives instead of inlining it.
                    external: ["wasmbuilder", "wasmcurves"],
                    output: { inlineDynamicImports: true },
                },
            },
            resolve: { conditions: ["browser"] },
        };
    }

    // Node (default)
    return {
        build: {
            lib: {
                entry: "./main.js",
                formats: ["cjs"],
                fileName: () => "main.cjs",
            },
            outDir: "build",
            emptyOutDir: false,
            minify: false,
            rollupOptions: {
                external: isNodeExternal,
                output: { inlineDynamicImports: true },
            },
        },
        test: {
            projects: [
                {
                    test: {
                        name: "node-esm",
                        include: ["test/**/*.js"],
                        environment: "node",
                        globals: true,
                        testTimeout: 600_000,
                        hookTimeout: 600_000,
                        // Every suite builds curves with a full worker pool;
                        // concurrent test files oversubscribe CI runners badly
                        // enough that large multiexp tests starve past 600s.
                        // Sequential files, like mocha ran them.
                        fileParallelism: false,
                    },
                },
            ],
        },
    };
});
