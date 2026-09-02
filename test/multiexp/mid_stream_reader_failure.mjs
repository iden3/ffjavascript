// Regression harness for a crash in multiExpAffineChunked's error path.
//
// Runs as its OWN process (like test/ses/lockdown.mjs) because the bug is an
// unhandled promise rejection that crashes the Node process -- that failure
// mode can only be observed from outside the process, not caught by a mocha
// assertion running inside it.
//
// Bug: when a basesReader chunk read fails partway through a chunked
// multiexp, _multiExpDispatch (src/engine_multiexp.js) let the rejection
// propagate immediately without waiting for chunks dispatched earlier that
// were still running against workers. A caller that reacts to the error by
// tearing down workers (ThreadManager.terminate(), the natural thing to do)
// could then abort a still-in-flight chunk; its worker-error safety-net
// rejection (threadman.js's "terminated unexpectedly while processing task")
// had no attached handler and crashed the process. Fixed by draining all
// in-flight chunks with Promise.allSettled before rethrowing.
import buildBn128 from "../../src/bn128.js";

const bn128 = await buildBn128();
const G = bn128.G1, Fr = bn128.Fr;

// Large enough that several chunks are dispatched and still running when
// the 2nd chunk's read fails -- this is what makes the leaked in-flight
// promise's later rejection land after terminate() instead of before it.
const N = 1 << 17;
const sG = G.F.n8 * 2;
const scalars = new Uint8Array(N * Fr.n8);
const bases = new Uint8Array(N * sG);
for (let i = 0; i < N; i++) {
    const num = Fr.e(i + 1);
    scalars.set(Fr.fromMontgomery(num), i * Fr.n8);
    bases.set(G.toAffine(G.timesFr(G.g, num)), i * sG);
}

let calls = 0;
const reader = async (off, len) => {
    calls++;
    if (calls === 2) throw new Error("simulated read failure");
    return bases.slice(off, off + len);
};

let threw = false;
try {
    await G.multiExpAffineChunked(reader, bases.byteLength, scalars, null, "fail-mid-stream");
} catch {
    threw = true;
}
if (!threw) {
    console.error("FAIL: multiExpAffineChunked did not reject on a mid-stream reader failure");
    process.exit(1);
}

// The natural thing for a caller to do after catching a multiexp failure:
// tear down the worker pool. Before the fix, any chunk still in flight at
// this point would reject later with no handler and crash the process.
await bn128.terminate();

// Give straggler in-flight chunks time to settle (and, pre-fix, to crash
// the process via unhandled rejection) before declaring success.
await new Promise((resolve) => setTimeout(resolve, 1000));

console.log("OK: survived a mid-stream reader failure followed by terminate()");
process.exit(0);
