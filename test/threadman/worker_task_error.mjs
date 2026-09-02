// Regression harness for two crash bugs in ThreadManager's worker-error path.
//
// Runs as its OWN process (like test/ses/lockdown.mjs) because both bugs are
// unhandled-exception crashes -- only observable from outside the process.
//
// Bug 1: _makeOnMsg's `data.error` branch and _makeOnError both rejected the
// task's pendingDeferred (correctly) and then unconditionally re-threw the
// same error. Since these run as a native `message`/`error` event listener
// with nothing catching their return, the re-throw was pure dead weight that
// crashed the process on every worker-side task error -- even though the
// caller who issued the task already received and handled the rejection.
//
// Bug 2: processWorks()'s dispatch loop awaited postAction()'s returned
// promise, which tracks the task's own completion (not just "message sent").
// When processWorks() runs from a fire-and-forget context (invoked from
// _makeOnMsg after a worker finishes/initializes, not from queueAction's own
// call stack), a task failure propagated through that internal await with no
// consumer of its own -- also an unhandled-rejection crash, independent of
// bug 1 and only reachable via a specific ordering (a task's failure racing
// processWorks() being invoked from the message handler rather than
// queueAction()).
//
// Both are fixed: the dead re-throws were removed, and processWorks()
// swallows the task-completion promise's rejection (the caller who actually
// issued the task holds their own independent reference to the same
// promise and still receives it there).
import buildBn128 from "../../src/bn128.js";

const bn128 = await buildBn128();
const tm = bn128.Fr.tm;

// Trigger a genuine worker-side task error: instance.exports[fname] is
// undefined for a bogus fnName, so `fn(...params)` throws inside the
// worker's try/catch, which posts {error: ...} back to the main thread.
let threw = false;
try {
    await tm.queueAction([{ cmd: "CALL", fnName: "this_function_does_not_exist", params: [] }], []);
} catch {
    threw = true;
}
if (!threw) {
    console.error("FAIL: queueAction did not reject on a worker-side task error");
    process.exit(1);
}

// Confirm the pool recovered and is still usable (the bug's blast radius,
// were it just a stray unhandled rejection warning, wouldn't need this --
// but it's worth locking in that a task error doesn't wedge the pool).
const Fr = bn128.Fr;
const N = 8;
const buf = new Uint8Array(N * Fr.n8);
for (let i = 0; i < N; i++) buf.set(Fr.e(i + 1), i * Fr.n8);
const fft = await Fr.fft(buf);
const back = await Fr.ifft(fft);
for (let i = 0; i < N; i++) {
    if (!Fr.eq(Fr.e(i + 1), back.slice(i * Fr.n8, (i + 1) * Fr.n8))) {
        console.error(`FAIL: pool did not recover correctly after a worker-side task error (index ${i})`);
        process.exit(1);
    }
}

await bn128.terminate();

// Give any straggler rejections time to surface (and, pre-fix, to crash the
// process) before declaring success.
await new Promise((resolve) => setTimeout(resolve, 500));

console.log("OK: survived a worker-side task error and the pool remained usable");
process.exit(0);
