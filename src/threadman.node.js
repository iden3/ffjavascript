import os from "os";
import { fileURLToPath } from "url";
import { resolve } from "path";

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
    if (typeof __dirname !== "undefined") {
        // CJS bundle (build/main.cjs): __dirname is inlined at build time to the
        // build/ directory, so the compiled worker lives right alongside it.
        return resolve(__dirname, "threadman_worker.cjs");
    }
    // Node ESM (main.js / vitest): use the ESM source worker directly.
    // Node.js loads it as ESM because the package declares "type": "module".
    // This avoids any dependency on the compiled build/ artifacts.
    return fileURLToPath(new URL("./threadman_worker.js", import.meta.url));
}
