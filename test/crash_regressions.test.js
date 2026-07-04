import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// These regressions are process-crash bugs (unhandled promise rejections),
// so each harness runs as its OWN process -- like test/ses/lockdown.mjs --
// and this file just asserts a clean exit / expected output.
describe("multiexp crash regressions", function () {

    it("multiExpAffineChunked + terminate() survives a mid-stream basesReader failure", () => {
        const dir = path.dirname(fileURLToPath(import.meta.url));
        const harness = path.join(dir, "multiexp", "mid_stream_reader_failure.mjs");
        // throws (failing the test) if the harness exits non-zero; inherit stdio
        // so the harness's OK/FAIL line appears in the mocha output.
        execFileSync(process.execPath, [harness], { stdio: "inherit" });
    });
});

describe("threadman crash regressions", function () {

    it("survives a worker-side task error without crashing the process", () => {
        const dir = path.dirname(fileURLToPath(import.meta.url));
        const harness = path.join(dir, "threadman", "worker_task_error.mjs");
        execFileSync(process.execPath, [harness], { stdio: "inherit" });
    });

    it("propagates worker errors instead of hanging (INIT failure, dispatch failure, queue stall)", () => {
        const dir = path.dirname(fileURLToPath(import.meta.url));
        const harness = path.join(dir, "threadman", "worker_error_hangs.mjs");
        execFileSync(process.execPath, [harness], { stdio: "inherit" });
    });

    it("gives up after repeated worker boot failures instead of respawning forever", () => {
        const dir = path.dirname(fileURLToPath(import.meta.url));
        const harness = path.join(dir, "threadman", "boot_failure_melt.mjs");
        execFileSync(process.execPath, [harness], { stdio: "inherit" });
    });
});
