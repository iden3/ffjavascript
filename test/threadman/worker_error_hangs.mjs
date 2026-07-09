// Regression harness for worker errors that used to hang the main thread
// forever instead of propagating.
//
// Runs as its OWN process (like test/ses/lockdown.mjs): each scenario is
// guarded by a watchdog timer, because pre-fix the failure mode was a
// queueAction promise that never settles -- invisible to any in-process
// assertion that awaits it.
//
// Scenarios:
//
// 1. Worker INIT failure. init() is async, so the worker's try/catch around
//    onmessage could not see its rejection: the error died as an unhandled
//    rejection inside the worker, no {error} message was ever posted, the
//    slot stayed "initializing" forever, and every queued task waited on a
//    worker that would never come up. Additionally, naively re-running
//    processWorks after an INIT error respawns a worker that fails the same
//    way -- an infinite spawn/fail loop. Fixed by posting {error} from the
//    worker's init rejection handler, and by startWorker's INIT-rejection
//    handler releasing the slot and rejecting queued tasks when no other
//    worker is alive.
//
// 2. postMessage dispatch failure (e.g. a transfer-list buffer already
//    detached). The worker never saw the task, so no reply would ever come;
//    postAction left the slot wedged as "working" and the caller's deferred
//    pending forever. Fixed by settling the deferred and freeing the slot
//    when postMessage itself throws.
//
// 3. Queue stall after a worker-side task error. The data.error branch
//    rejected the failing task's deferred but never re-ran processWorks, so
//    tasks already queued behind it stalled until the worker's 1.5s idle
//    timer happened to rescue them (or forever in an environment without
//    timers). Fixed by dispatching the queue right after a task error on a
//    healthy worker.
import buildBn128 from "../../src/bn128.js";

// Swallow unhandled rejections: pre-fix, some scenarios ALSO leaked one, and
// (in Node) it would crash the process before the watchdog could classify
// the failure as a hang. The harness asserts clean *propagation*, which is
// stricter than not-crashing.
process.on("unhandledRejection", () => {});

let failed = false;
function check(cond, msg) {
    if (cond) console.log("ok   " + msg);
    else { failed = true; console.error("FAIL " + msg); }
}

function withWatchdog(ms, label) {
    return new Promise((resolve) => {
        const t = setTimeout(() => resolve({ hang: true, label }), ms);
        withWatchdog.cancel = () => clearTimeout(t);
        withWatchdog.resolve = (v) => { clearTimeout(t); resolve(v); };
    });
}

// wasm that compiles but cannot instantiate in the worker: imports
// env.missing, which the worker's import object does not provide.
const badWasm = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,             // magic + version
    0x01, 0x04, 0x01, 0x60, 0x00, 0x00,                          // type () -> ()
    0x02, 0x0f, 0x01, 0x03, 0x65, 0x6e, 0x76, 0x07,              // import "env"
    0x6d, 0x69, 0x73, 0x73, 0x69, 0x6e, 0x67, 0x00, 0x00,        // ."missing" func
]);

// --- Scenario 1: INIT failure must reject the queued task, not hang -------
{
    const bn128 = await buildBn128();
    const tm = bn128.Fr.tm;
    const goodWasm = tm.wasmModule;
    tm.wasmModule = await WebAssembly.compile(badWasm);

    const guard = withWatchdog(10000, "init-failure");
    tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }], [])
        .then(() => withWatchdog.resolve({ resolved: true }),
            (e) => withWatchdog.resolve({ rejected: e.message }));
    const r = await guard;
    check(!!r.rejected, `INIT failure rejects the queued task (got: ${r.hang ? "HANG" : JSON.stringify(r)})`);
    check(String(r.rejected).includes("initialization failed"),
        "rejection names worker initialization as the cause");

    // Un-poison and terminate: buildBn128 caches the curve module-wide, so
    // later scenarios would otherwise receive this same broken tm.
    tm.wasmModule = goodWasm;
    await bn128.terminate();
}

// --- Scenario 2: postMessage failure (detached transfer buffer) -----------
{
    const bn128 = await buildBn128();
    const tm = bn128.Fr.tm;

    // Warm one worker so dispatch goes through the queue path.
    await tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }, { cmd: "GET", out: 0, var: 0, len: 32 }], []);

    const buff = new Uint8Array(64);
    const mc = new MessageChannel();
    mc.port1.postMessage(buff.buffer, [buff.buffer]); // detaches buff.buffer
    mc.port1.close(); mc.port2.close();

    const guard = withWatchdog(10000, "detached-transfer");
    tm.queueAction(
        [{ cmd: "ALLOCSET", var: 0, buff }, { cmd: "GET", out: 0, var: 0, len: 64 }],
        [buff.buffer]
    ).then(() => withWatchdog.resolve({ resolved: true }),
        (e) => withWatchdog.resolve({ rejected: e.message }));
    const r = await guard;
    check(!!r.rejected, `detached transfer buffer rejects the task (got: ${r.hang ? "HANG" : JSON.stringify(r)})`);

    // The pool must still be usable afterwards.
    const after = await tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }, { cmd: "GET", out: 0, var: 0, len: 32 }], []);
    check(after[0] instanceof Uint8Array, "pool serves tasks normally after a dispatch failure");
    await bn128.terminate();
}

// --- Scenario 3: queued task must run promptly after a task error ---------
{
    const bn128 = await buildBn128();
    const tm = bn128.Fr.tm;
    tm.concurrency = 1; // single slot: queued work is observable

    await tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }, { cmd: "GET", out: 0, var: 0, len: 32 }], []);

    const p1 = tm.queueAction([{ cmd: "CALL", fnName: "no_such_fn", params: [] }], []);
    const t0 = Date.now();
    const p2 = tm.queueAction([{ cmd: "ALLOC", var: 0, len: 32 }, { cmd: "GET", out: 0, var: 0, len: 32 }], []);

    const r1 = await p1.then(() => "resolved", () => "rejected");
    check(r1 === "rejected", "erroring task rejects");
    await p2;
    const latency = Date.now() - t0;
    // Pre-fix this was ~1.5s (rescued only by the worker idle timer); the
    // fix dispatches immediately. 1s of slack for slow CI machines.
    check(latency < 1000, `queued task ran promptly after the error (${latency}ms)`);
    await bn128.terminate();
}

if (failed) {
    console.error("WORKER ERROR HANG HARNESS FAILED");
    process.exit(1);
}
console.log("WORKER ERROR HANG HARNESS PASSED");
process.exit(0);
