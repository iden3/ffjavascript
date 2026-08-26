// SES lockdown harness — run with `npm run test:ses` (or via test/ses.test.js).
//
// Validates that ffjavascript builds a curve and runs under a SES hardened
// profile: frozen intrinsics + frozen globalThis, no Worker (single-thread).
// This catches regressions plain unit tests can't --
// e.g. mutating globalThis at module load (the module-local curve cache fix), or
// touching Blob/btoa at import.
//
// Lives in a subdirectory and is run as its own process so lockdown() (global
// and irreversible) never affects the main mocha suite. The modules under test
// are imported AFTER lockdown so their evaluation happens inside the realm.
import "ses";

// errorTaming:'unsafe' keeps readable stack traces on failure; the rest are
// defaults (shared intrinsics hardened/frozen).
lockdown({ errorTaming: "unsafe" });

let failed = false;
function check(cond, msg) {
    if (cond) {
        console.log("ok   " + msg);
    } else {
        failed = true;
        console.error("FAIL " + msg);
    }
}

// Core SES guarantee: shared intrinsics are frozen. Confirms lockdown is active.
check(Object.isFrozen(Object.prototype), "lockdown active (Object.prototype frozen)");

// Simulate the strictest realm (a hardened profile that freezes the global object):
// freeze globalThis so any module-load-time globalThis mutation -- the kind the
// module-local curve cache fix removed -- throws on the import below.
Object.freeze(globalThis);
let frozen = false;
try { globalThis.__ses_probe__ = 1; } catch { frozen = true; }
check(frozen, "globalThis frozen (assigning a global throws)");

let buildBn128, buildBls12381;
try {
    ({ default: buildBn128 } = await import("../../src/bn128.js"));
    ({ default: buildBls12381 } = await import("../../src/bls12381.js"));
    check(true, "curve modules import under frozen globalThis (no global mutation at load)");
} catch (e) {
    check(false, "curve modules import under frozen globalThis -- threw: " + (e && e.stack ? e.stack : e));
}

if (buildBn128 && buildBls12381) {
    for (const [name, build] of [["bn128", buildBn128], ["bls12381", buildBls12381]]) {
        try {
            const c = await build(true); // single-thread: SES realms have no Worker
            check(c.G1.isValid(c.G1.g), `${name}: builds under lockdown, G1 generator valid`);
            // pairing bilinearity: e(2P, Q) == e(P, 2Q)
            const two = c.Fr.e(2);
            const lhs = await c.pairing(c.G1.timesFr(c.G1.g, two), c.G2.g);
            const rhs = await c.pairing(c.G1.g, c.G2.timesFr(c.G2.g, two));
            check(c.Gt.eq(lhs, rhs), `${name}: pairing bilinearity holds under lockdown`);

            // Multiexp through the batch module (the single-thread task manager
            // instantiates the batch-affine MSM module next to the main one --
            // a second WebAssembly.instantiate inside the hardened realm) and
            // through the GLV/GLS endomorphism paths, checked against the
            // plain path for agreement.
            for (const [gName, G] of [["G1", c.G1], ["G2", c.G2]]) {
                const N = 256;
                const sG = G.F.n8 * 2;
                const scalars = new Uint8Array(N * c.Fr.n8);
                const bases = new Uint8Array(N * sG);
                for (let i = 0; i < N; i++) {
                    const num = c.Fr.e(i * 17 + 3);
                    scalars.set(c.Fr.fromMontgomery(num), i * c.Fr.n8);
                    bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
                }
                const rBatch = await G.multiExpAffine(bases, scalars, null, "b", { batch: "enabled" });
                const rNoEndo = await G.multiExpAffine(bases, scalars, null, "n", { batch: "enabled", glv: "disabled", gls: "disabled" });
                const rPlain = await G.multiExpAffine(bases, scalars, null, "p", { batch: "disabled" });
                check(G.eq(rBatch, rPlain) && G.eq(rNoEndo, rPlain),
                    `${name}: ${gName} multiexp (batch/endo/plain agree) under lockdown`);
            }

            // Fr FFT roundtrip in the hardened realm
            const nF = 1 << 10;
            const fbuf = new Uint8Array(nF * c.Fr.n8);
            for (let i = 0; i < nF; i++) fbuf.set(c.Fr.e(i * 31 + 7), i * c.Fr.n8);
            const rt = await c.Fr.ifft(await c.Fr.fft(fbuf));
            check(Buffer.from(rt).equals(Buffer.from(fbuf)), `${name}: Fr fft/ifft roundtrip under lockdown`);
            await c.terminate();
        } catch (e) {
            check(false, `${name}: threw under lockdown -- ${e && e.stack ? e.stack : e}`);
        }
    }
}

if (failed) {
    console.error("SES LOCKDOWN HARNESS FAILED");
    process.exit(1);
}
console.log("SES LOCKDOWN HARNESS PASSED");
// Exit explicitly: success must not depend on the event loop draining. A
// single surviving worker handle would otherwise keep this child alive
// forever, and the parent test's execFileSync would hang with it.
process.exit(0);
