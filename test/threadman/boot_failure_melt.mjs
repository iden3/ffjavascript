// Regression: deterministic worker BOOT failure must reject queued work
// quickly, not melt the CPU in an endless spawn/fail loop.
//
// Real-world trigger reproduced here: launching Node with
// `--input-type=module -e "<script>"`. Worker threads inherit the parent's
// execArgv, and the web-worker shim boots each worker from its own FILE
// entry -- for which the inherited `--input-type` flag is illegal ("can only
// be used with string input"). Every worker therefore dies on boot, firing
// the native 'error' event (NOT the in-worker {error} message that scenario 1
// of worker_error_hangs.mjs covers).
//
// Pre-fix, the 'error' handler released the slot and processWorks respawned
// a replacement immediately; with all slots churning, `pool.some(s => s)`
// never went false, so the give-up in the INIT-rejection handler never fired:
// observed as ~26,000 workers spawned in 65s, ~18 cores at 100%, and the
// multiexp caller hanging forever. The fix counts consecutive boot failures
// and latches the pool broken (rejecting queued + future work) at the cap.
//
// This file runs the wedge-prone code in a CHILD `node -e` process (this
// harness itself is launched normally, so its own workers are fine) and
// asserts the child exits promptly with the expected rejection.
import { execFile } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const script = `
import { getCurveFromName } from "./main.js";
const curve = await getCurveFromName("bn128");
const n = 256;
const scalars = new Uint8Array(n * 32); scalars[0] = 1;
const bases = new Uint8Array(n * 64);
try {
    await curve.G1.multiExpAffine(bases, scalars);
    console.log("UNEXPECTED-SUCCESS");
} catch (e) {
    console.log("REJECTED: " + e.message);
}
await curve.terminate();
process.exit(0);
`;

const child = execFile(
    process.execPath,
    ["--input-type=module", "-e", script],
    { cwd: root, timeout: 30000, killSignal: "SIGKILL" },
    (err, stdout) => {
        // In an environment where workers happen to boot fine under -e, the
        // multiexp of all-zero points just succeeds -- also a non-melt pass.
        if (stdout.includes("REJECTED: Worker initialization failed")
            || stdout.includes("UNEXPECTED-SUCCESS")) {
            console.log("ok   boot-failure melt: child settled promptly (" + stdout.trim().split("\n").pop() + ")");
            process.exit(0);
        }
        console.error("FAIL boot-failure melt: child " +
            (err && err.killed ? "HUNG (killed by 30s watchdog) -- spawn/fail loop is back"
                : "exited without the expected rejection") +
            "\nstdout: " + stdout);
        process.exit(1);
    }
);
child.on("error", (e) => {
    console.error("FAIL boot-failure melt: could not spawn child: " + e.message);
    process.exit(1);
});
