// Pure-JS base64 -> Uint8Array. Uses neither atob nor Buffer, so it resolves the
// same in Node, browsers, extensions, and SES/Snap realms. Used once at curve
// load to decode the vendored (uncompressed) wasm bytes.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const LOOKUP = new Uint8Array(256);
for (let i = 0; i < CHARS.length; i++) LOOKUP[CHARS.charCodeAt(i)] = i;

export function base64ToUint8Array(b64) {
    const len = b64.length;
    let pad = 0;
    if (len > 0 && b64[len - 1] === "=") pad++;
    if (len > 1 && b64[len - 2] === "=") pad++;
    const outLen = ((len * 3) >> 2) - pad;
    const out = new Uint8Array(outLen);
    let o = 0;
    for (let i = 0; i < len; i += 4) {
        const a = LOOKUP[b64.charCodeAt(i)];
        const b = LOOKUP[b64.charCodeAt(i + 1)];
        const c = LOOKUP[b64.charCodeAt(i + 2)];
        const d = LOOKUP[b64.charCodeAt(i + 3)];
        if (o < outLen) out[o++] = (a << 2) | (b >> 4);
        if (o < outLen) out[o++] = ((b & 15) << 4) | (c >> 2);
        if (o < outLen) out[o++] = ((c & 3) << 6) | d;
    }
    return out;
}
