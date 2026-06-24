import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// Runs the SES lockdown harness (test/ses/lockdown.mjs) as its OWN process.
// lockdown() is global and irreversible, so it must never run in the mocha
// process itself -- doing so would freeze intrinsics out from under every other
// test. Spawning a child keeps the realm hardening fully isolated; here we just
// assert the harness exits 0.
describe("SES lockdown", function () {
    this.timeout(120000); // building both curves single-threaded is slow

    it("builds curves and runs pairings inside a hardened SES realm", () => {
        const dir = path.dirname(fileURLToPath(import.meta.url));
        const harness = path.join(dir, "ses", "lockdown.mjs");
        // throws (failing the test) if the harness exits non-zero; inherit stdio
        // so the harness's ok/FAIL lines appear in the mocha output.
        execFileSync(process.execPath, [harness], { stdio: "inherit" });
    });
});
