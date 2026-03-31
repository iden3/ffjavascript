import os from "os";
import { fileURLToPath } from "url";

/* global __BUILD_WORKER_PATH__ */

export function getConcurrency() {
    return os.cpus().length || 2;
}

export function getWorkerType() {
    return "thread";
}

// Worker threads are always available in supported Node.js versions.
export function supportsWorkers() {
    return true;
}

export function getWorkerSource() {
    // __BUILD_WORKER_PATH__ is a string literal injected only during `vite build`
    // (via the inject-worker-path plugin with apply:"build").  It is never set by
    // vitest, which also injects a __dirname shim that would otherwise confuse the
    // old __dirname-based detection.
    if (typeof __BUILD_WORKER_PATH__ !== "undefined") {
        return __BUILD_WORKER_PATH__;
    }
    // Node ESM (main.js / vitest): use the ESM source worker directly.
    // Node.js loads it as ESM because the package declares "type": "module".
    // This avoids any dependency on the compiled build/ artifacts.
    return fileURLToPath(new URL("./threadman_worker.js", import.meta.url));
}
