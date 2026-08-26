import * as chai from "chai";
import buildBn128 from "../src/bn128.js";

const assert = chai.assert;

// Regression for the runtime-portability of teardown: tm.terminate() used to
// only postMessage TERMINATE and rely on the worker's self.close() -- which
// does not end the thread on every runtime (under Bun the workers stayed
// alive and the process could never exit). terminate() now also hard-kills
// via worker.terminate() and releases every pool slot.
describe("thread manager teardown", function () {
    this.timeout(60000);

    it("terminate() releases every pool slot after real work, and is idempotent", async () => {
        const curve = await buildBn128();
        const Fr = curve.Fr;

        const n = 64;
        const buff = new Uint8Array(n * Fr.n8);
        for (let i = 0; i < n; i++) buff.set(Fr.e(i + 1), i * Fr.n8);
        await Fr.batchApplyKey(buff, Fr.e(1), Fr.e(2)); // make workers run tasks

        assert(curve.tm.pool.filter(Boolean).length > 0, "workers alive before terminate");
        await curve.terminate();
        assert.strictEqual(curve.tm.pool.filter(Boolean).length, 0, "all slots released");

        // second terminate is a harmless no-op
        await curve.terminate();
    });
});
