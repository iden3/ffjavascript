import ChaCha from "./chacha.js";
import crypto from "crypto";

export function getRandomBytes(n) {
    let array = new Uint8Array(n);
    // Feature-detect rather than rely on `process.browser` (undefined under
    // Vite/esbuild/SES -> ReferenceError). Prefer Node crypto (no per-call size
    // limit); fall back to Web Crypto chunked to its 65536-byte cap.
    if (crypto && crypto.randomFillSync) { // Node
        crypto.randomFillSync(array);
    } else if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
        for (let i = 0; i < n; i += 65536) {
            globalThis.crypto.getRandomValues(array.subarray(i, Math.min(i + 65536, n)));
        }
    } else { // insecure last resort
        for (let i=0; i<n; i++) {
            array[i] = (Math.random()*4294967296)>>>0;
        }
    }
    return array;
}

export function getRandomSeed() {
    const arr = getRandomBytes(32);
    const arrV = new Uint32Array(arr.buffer);
    const seed = [];
    for (let i=0; i<8; i++) {
        seed.push(arrV[i]);
    }
    return seed;
}

let threadRng = null;

export function getThreadRng() {
    if (threadRng) return threadRng;
    threadRng = new ChaCha(getRandomSeed());
    return threadRng;
}
