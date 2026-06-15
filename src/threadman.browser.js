// The complete worker script is computed at build time by workerScriptPlugin
// in vite.config.js and inlined here as a string constant.  Nothing in this
// module depends on runtime function serialisation (thread.toString()) or on
// workerpool's generated embeddedWorker import — both of those happen once
// during the build, immune to any monkey-patching by zone.js or other libs.
import workerScript from "virtual:worker-script";

export function getConcurrency() {
    return (typeof navigator === "object" && navigator.hardwareConcurrency) || 2;
}

export function getWorkerType() {
    return "web";
}

// Workers are not available in headless/SSR browser contexts.
export function supportsWorkers() {
    return typeof Worker !== "undefined";
}

// Lazily created so Blob/URL are only accessed when a pool is first needed.
let _workerSource = null;

export function getWorkerSource() {
    if (_workerSource) return _workerSource;

    const blob = new Blob([workerScript], { type: "application/javascript" });
    _workerSource = (globalThis.URL ? globalThis.URL : globalThis.webkitURL).createObjectURL(blob);
    return _workerSource;
}
