const assert = require("assert");

describe("bn128 tester", async function () {
    this.timeout(100000);


    it("It shoud do an inverse FFT in G1", async () => {
        const bn128 = require("../index").bn128;
        const Fr = bn128.Fr;
        const G1 = bn128.G1;

        const a = [];
        for (let i=0; i<8; i++) a[i] = Fr.e(i+1);

        const aG_expected = [];
        for (let i=0; i<8; i++) aG_expected[i] = G1.mulScalar(G1.g, a[i]);

        const A = await bn128.PFr.fft(a);


        const AG = [];
        for (let i=0; i<8; i++) AG[i] = G1.mulScalar(G1.g, A[i]);

        const aG_calculated = await G1.ifft(AG);

        for (let i=0; i<8; i++) {
            assert(G1.eq(aG_calculated[i], aG_expected[i]));
        }

        bn128.engine.terminate();
    });
});

