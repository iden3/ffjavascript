import ChaCha from "./chacha.js";

export function getRandomBytes(n) {
    let array = new Uint8Array(n);
    if (typeof globalThis.crypto !== "undefined") {
        globalThis.crypto.getRandomValues(array);
    } else if (typeof require === "function") {
        // Node.js <18: globalThis.crypto not available; use the built-in module.
        require("crypto").randomFillSync(array);
    } else {
        throw new Error("No cryptographically secure random source available.");
    }
    return array;
}

export function getRandomSeed() {
    const arr = getRandomBytes(32);
    const arrV = new Uint32Array(arr.buffer);
    const seed = [];
    for (let i = 0; i < 8; i++) {
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
