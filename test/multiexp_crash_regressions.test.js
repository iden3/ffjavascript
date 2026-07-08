import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// These regressions are process-crash bugs (unhandled promise rejections),
// so each harness runs as its OWN process -- like test/ses/lockdown.mjs --
// and this file just asserts a clean exit / expected output.
describe("multiexp crash regressions", function () {
    this.timeout(60000);

    it("multiExpAffineChunked + terminate() survives a mid-stream basesReader failure", () => {
        const dir = path.dirname(fileURLToPath(import.meta.url));
        const harness = path.join(dir, "multiexp", "mid_stream_reader_failure.mjs");
        // throws (failing the test) if the harness exits non-zero; inherit stdio
        // so the harness's OK/FAIL line appears in the mocha output.
        execFileSync(process.execPath, [harness], { stdio: "inherit" });
    });
});
