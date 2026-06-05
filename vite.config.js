import { defineConfig } from "vite";
import { builtinModules, createRequire } from "module";
import { fileURLToPath } from "url";
import { resolve } from "path";
import { readFileSync, rmSync } from "fs";
import { playwright } from "@vitest/browser-playwright";


const __dirname = fileURLToPath(new URL(".", import.meta.url));
const abs = (...p) => resolve(__dirname, ...p);
const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

/**
 * Removes stale CJS node-build artifacts before each build so that
 * main.cjs and threadman_thread.cjs are ALWAYS produced together in the
 * same Vite/rolldown run and therefore always have consistent exports.
 *
 * We cannot use emptyOutDir:true because build/ also contains build/browser/
 * which is produced by the separate build:browser step.
 *
 * apply:"build" restricts this to `vite build` so it does NOT fire during
 * vitest, which would otherwise delete the committed build/*.cjs artifacts.
 */
const cleanNodeBuildPlugin = {
    name: "clean-node-build",
    apply: "build",
    buildStart() {
        for (const f of ["main.cjs", "threadman_thread.cjs", "threadman_worker.cjs"]) {
            rmSync(abs("build", f), { force: true });
        }
    },
};

/**
 * Swap the Node.js platform adapter for the browser one in production builds.
 *
 * For tests and dev, #imports in package.json handles this via resolve.conditions.
 * This plugin is a build-time fallback for environments that don't resolve
 * subpath imports natively.
 */
const browserPlatformPlugin = {
    name: "browser-platform-adapter",
    resolveId(source) {
        if (source.endsWith("threadman.node.js")) {
            return abs("src/threadman.browser.js");
        }
    },
};

/**
 * Build-time worker script inliner.
 *
 * Resolves the virtual import `virtual:worker-script` to a string constant
 * containing the complete, self-contained browser worker script.
 *
 * The script is assembled once in `buildStart` by:
 *   1. Reading threadman_thread.js synchronously with readFileSync and
 *      slicing out the function declaration (everything after "export default ").
 *   2. Requiring workerpool's pre-built embeddedWorker string (the workerpool
 *      runtime that runs inside the worker).
 *   3. Wrapping them into a self-invoking IIFE and baking the result into the
 *      bundle as a JSON string literal.
 *
 * Because the entire script is a compile-time constant there is nothing left
 * for zone.js or any other monkey-patching library to intercept at runtime.
 */
let _workerScript = null;

const workerScriptPlugin = {
    name: "worker-script-inline",

    buildStart() {
        if (_workerScript) return;

        const raw = readFileSync(abs("src/threadman_thread.js"), "utf-8");
        const marker = "export default ";
        const markerIdx = raw.indexOf(marker);
        if (markerIdx === -1) {
            throw new Error(
                `worker-script-inline: could not find "${marker}" in src/threadman_thread.js; ` +
                "cannot assemble the worker script.",
            );
        }
        const fnSrc = raw.slice(markerIdx + marker.length).trim();

        // workerpool's pre-built, minified worker runtime (CJS string export).
        // NOTE: this is an internal workerpool path, not part of its public API,
        // so it may move between versions — fail loudly with a clear message.
        const require = createRequire(import.meta.url);
        let embeddedWorker;
        try {
            embeddedWorker = require("workerpool/src/generated/embeddedWorker");
        } catch (err) {
            throw new Error(
                "worker-script-inline: failed to load workerpool's embeddedWorker " +
                "(workerpool/src/generated/embeddedWorker). This internal path may have " +
                "moved in the installed workerpool version.",
                { cause: err },
            );
        }

        // Strip the trailing sourceMappingURL comment that workerpool bakes
        // into its minified worker string.  The comment is harmless in the
        // original file but inside a Blob worker it triggers a stray 404 for
        // a .map file that has no meaningful URL relative to blob:.
        const runtime = embeddedWorker.replace(/\/\/# sourceMappingURL=\S+\s*$/, "");

        _workerScript = runtime + `\n;(function(){\nvar runTask=(${fnSrc})();\nworker.add({runTask:runTask});\n})();`;
    },

    resolveId(id) {
        if (id === "virtual:worker-script") return "\0virtual:worker-script";
    },

    load(id) {
        if (id === "\0virtual:worker-script") {
            return `export default ${JSON.stringify(_workerScript)};`;
        }
    },

    // workerpool bundles two sourceMappingURL references into its dist files:
    //   • "//# sourceMappingURL=worker.min.js.map"  — inside the embeddedWorker
    //     string literal; ends up as raw text in the output bundle.
    //   • "//# sourceMappingURL=workerpool.js.map"  — end-of-file comment on
    //     the workerpool bundle itself.
    // Neither map file exists in our output directory, so any consumer dev
    // server (Vite, webpack-dev-server…) that scans the bundle for source map
    // hints produces a stray 404 for each.  Strip only these two specific
    // references so the IIFE build's own "//# sourceMappingURL=browser.iife.js.map"
    // is left intact.
    renderChunk(code) {
        const cleaned = code
            .replace(/\/\/# sourceMappingURL=worker\.min\.js\.map/g, "")
            .replace(/\/\/# sourceMappingURL=workerpool\.js\.map/g, "");
        if (cleaned !== code) return { code: cleaned, map: null };
    },
};

/**
 * Suppress the expected Vite warnings about Node.js built-ins being
 * externalized in the browser build.  These come from workerpool's browser
 * bundle (dist/workerpool.js) which has conditional Node.js requires that
 * are never reached when running in a browser.
 */

function suppressNodeExternalWarnings(warning, defaultHandler) {
    if (
        (warning.plugin === "vite:resolve" || warning.plugin === "rolldown:vite-resolve") &&
        warning.message.includes("has been externalized for browser compatibility")
    ) return;
    defaultHandler(warning);
}

export default defineConfig(({ mode }) => {
    const isBrowser = mode === "browser" || mode === "browser-iife";

    const isIife = mode === "browser-iife";

    if (isBrowser || isIife) {
        if (isIife) {
            // Self-contained IIFE for direct <script> tag use.
            // All dependencies are inlined so no external loader is needed.
            return {
                build: {
                    lib: {
                        entry: "./main.js",
                        name: "ffjavascript",
                        formats: ["iife"],
                        fileName: () => "browser.iife.js",
                    },
                    outDir: "build/browser",
                    emptyOutDir: false,
                    sourcemap: true,
                    codeSplitting: false,
                    rollupOptions: {
                        onwarn: suppressNodeExternalWarnings,
                    },
                },
                define: { "process.browser": "true" },
                resolve: { conditions: ["browser"] },
                plugins: [browserPlatformPlugin, workerScriptPlugin],
            };
        }

        // ESM browser build — most dependencies are kept as live `import`
        // statements so the consumer's bundler can deduplicate and tree-shake.
        //
        // workerpool is intentionally bundled (NOT kept external) because:
        //   • workerpool's "main" entry (src/index.js) imports Node.js-only
        //     modules (child_process, os, worker_threads).
        //   • Only workerpool's "browser" field entry (dist/workerpool.js) is
        //     safe for browsers, but many bundlers (Angular/webpack 5, Vite
        //     consumers that skip legacy browser-field resolution) will not
        //     automatically pick that file when resolving a bare "workerpool"
        //     specifier and will fail with "Can't resolve 'child_process'".
        //   • By inlining workerpool here (Vite resolves it via the browser
        //     field to dist/workerpool.js), the output is a self-contained
        //     browser module with zero Node.js leakage.
        const depNames = Object.keys(pkg.dependencies || {}).filter(
            (n) => n !== "workerpool",
        );
        const isExternal = (id) =>
            depNames.includes(id) || depNames.some((e) => id.startsWith(e + "/"));

        return {
            build: {
                lib: {
                    entry: "./main.js",
                    name: "ffjavascript",
                    formats: ["es"],
                    fileName: () => "browser.esm.js",
                },
                outDir: "build/browser",
                emptyOutDir: true,
                codeSplitting: true,
                minify: false,
                rollupOptions: {
                    external: isExternal,
                    onwarn: suppressNodeExternalWarnings,
                },
            },
            define: { "process.browser": "true" },
            resolve: { conditions: ["browser"] },
            plugins: [browserPlatformPlugin, workerScriptPlugin],
        };
    }

    // -----------------------------------------------------------------------
    // Node build (default mode)
    //
    // Output goes to the flat build/ folder so that the worker path
    // resolves correctly from both:
    //   • src/threadman.node.js (ESM dev / vitest)   → build/threadman_worker.cjs
    //   • build/main.cjs        (compiled CJS bundle) → build/threadman_worker.cjs
    // -----------------------------------------------------------------------
    const external = [
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {}),
    ];
    const isExternal = (id) =>
        external.includes(id) || external.some((e) => id.startsWith(e + "/"));

    return {
        // Force Node.js condition so #threadman-platform resolves to
        // threadman.node.js (Vite defaults include "browser" which would
        // incorrectly bundle the browser adapter into the CJS output).
        resolve: {
            conditions: ["node"],
        },
        build: {
            lib: {
                entry: {
                    main: "./main.js",
                    threadman_worker: "./src/threadman_worker.js",
                },
                formats: ["cjs"],
                fileName: (_format, alias) => `${alias}.cjs`,
            },
            minify: false,
            outDir: "build",
            // Only wipe the node build outputs (main.cjs, threadman_*.cjs),\n            // not build/browser/ which is produced by the separate build:browser step.
            emptyOutDir: false,
            rollupOptions: {
                external: isExternal,
                output: {
                    // Stable chunk names so the require() path never changes
                    // between rebuilds.
                    chunkFileNames: "[name].cjs",
                },
            },
        },
        plugins: [
            cleanNodeBuildPlugin,
            // Inject __dirname only during `vite build` (not vitest).
            // Without `apply: 'build'`, Vite would also define __dirname during
            // vitest runs, causing getWorkerSource() to return the wrong .cjs
            // path instead of the ESM source worker.
            {
                name: "inject-worker-path",
                apply: "build",
                config: () => ({
                    define: {
                        // Injected only during `vite build` (apply:"build" excludes vitest).
                        // Points to the compiled worker that lands next to main.cjs in build/.
                        __BUILD_WORKER_PATH__: "require('path').join(__dirname, 'threadman_worker.cjs')",
                    },
                }),
            },
        ],
        test: {
            projects: [
                // ------------------------------------------------------------
                // node-esm — test the ESM source files directly in Node.js.
                // ------------------------------------------------------------
                {
                    test: {
                        name: "node-esm",
                        include: ["test/**/*.js"],
                        environment: "node",
                        globals: true,
                        testTimeout: 300_000,
                    },
                },
                // ------------------------------------------------------------
                // browser — same tests inside a real Chromium via Playwright.
                // The browserPlatformPlugin wires in threadman.browser.js so
                // the code path mirrors the browser bundle exactly.
                //
                // Run with: npm run test:browser
                // ------------------------------------------------------------
                {
                    plugins: [browserPlatformPlugin, workerScriptPlugin],
                    resolve: {
                        conditions: ["browser"],
                    },
                    test: {
                        name: "browser",
                        include: ["test/**/*.js"],
                        globals: true,
                        testTimeout: 300_000,
                        browser: {
                            provider: playwright(),
                            headless: true,
                            enabled: true,
                            instances: [{ browser: "chromium" }],
                        },
                    },
                },
            ],
        },
    };
});
