import assert from "assert";
import buildBn128 from "../src/bn128.js";
import {log2} from "../src/utils.js";
import BigBuffer from "../src/bigbuffer.js";

describe("FFT", async function () {
    this.timeout(10000000);

    let bn128;
    before( async() => {
        bn128 = await buildBn128();
    });
    after( async() => {
        bn128.terminate();
    });
/*

    it("It shoud do an inverse FFT in G1", async () => {
        const Fr = bn128.Fr;
        const G1 = bn128.G1;

        const a = [];
        for (let i=0; i<8; i++) a[i] = Fr.e(i+1);

        const aG_expected = [];
        for (let i=0; i<8; i++) aG_expected[i] = G1.timesFr(G1.g, a[i]);

        const A = await bn128.Fr.fft(a);


        const AG = [];
        for (let i=0; i<8; i++) AG[i] = G1.timesFr(G1.g, A[i]);

        const aG_calculated = await G1.ifft(AG, "jacobian", "jacobian");

        for (let i=0; i<8; i++) {
            assert(G1.eq(aG_calculated[i], aG_expected[i]));
        }
    });
*/

    it("It shoud do a big FFT/IFFT in Fr", async () => {
        const Fr = bn128.Fr;

        const N = 1<<28;

        const logger = {
            error: (msg) => { console.log("ERROR: "+msg); },
            warning: (msg) => { console.log("WARNING: "+msg); },
            info: (msg) => { console.log("INFO: "+msg); },
            debug: (msg) => { console.log("DEBUG: "+msg); },
        };

        const a = new BigBuffer(N*bn128.Fr.n8);
        for (let i=0; i<N; i++) {
            if (i%100000 == 0) logger.debug(`setup ${i}/${N}`);
            const num = Fr.e(i+1);
            a.set(num, i*bn128.Fr.n8);
        }

        const A = await bn128.Fr.fft(a, "", "", logger, "fft");
        const Ainv = await bn128.Fr.ifft(A, "", "", logger, "ifft");

        for (let i=0; i<N; i++) {
            if (i%100000 == 0) logger.debug(`checking ${i}/${N}`);
//            console.log(Fr.toString(Ainv[i]));
            const num1 = Ainv.slice(i*Fr.n8, i*Fr.n8+Fr.n8);
            const num2 = a.slice(i*Fr.n8, i*Fr.n8+Fr.n8);

            assert(num1, num2);
        }
    });

/*
    it("It shoud do a big FFT/IFFT in Fr", async () => {
        const Fr = bn128.Fr;
        const N = 8192*16;

        const a = [];
        for (let i=0; i<N; i++) a[i] = Fr.e(i+1);

        const A = await bn128.Fr.fft(a);
        const Ainv = await bn128.Fr.ifft(A);

        for (let i=0; i<N; i++) {
//            console.log(Fr.toString(Ainv[i]));
            assert(Fr.eq(a[i], Ainv[i]));
        }
    });


    it("It shoud do a big FFTExt/IFFTExt in Fr", async () => {
        const Fr = bn128.Fr;
        const N = 16;

        const oldS = Fr.s;
        Fr.s = log2(N)-1;   // Force ext

        const a = [];
        for (let i=0; i<N; i++) a[i] = Fr.e(i+1);

        const A = await bn128.Fr.fft(a);
        const Ainv = await bn128.Fr.ifft(A);

        for (let i=0; i<N; i++) {
//            console.log(Fr.toString(Ainv[i]));
            assert(Fr.eq(a[i], Ainv[i]));
        }

        Fr.s = oldS;
    });


    it("It shoud do a big FFT/IFFT in G1", async () => {
        const Fr = bn128.Fr;
        const G1 = bn128.G1;
        const N = 512;

        const a = [];
        for (let i=0; i<N; i++) a[i] = Fr.e(i+1);

        const aG = [];
        for (let i=0; i<N; i++) aG[i] = G1.timesFr(G1.g, a[i]);

        const AG = await G1.fft(aG, "jacobian", "jacobian");
        const AGInv = await G1.ifft(AG, "jacobian", "affine");

        for (let i=0; i<N; i++) {
            assert(G1.eq(aG[i], AGInv[i]));
        }
    });

    it("It shoud do a big FFT/IFFT in G1 ext", async () => {
        const Fr = bn128.Fr;
        const G1 = bn128.G1;
        const N = 1<<13;

        const oldS = Fr.s;
        Fr.s = log2(N)-1;

        const a = [];
        for (let i=0; i<N; i++) a[i] = Fr.e(i+1);

        const aG = [];
        for (let i=0; i<N; i++) aG[i] = G1.timesFr(G1.g, a[i]);

        const AG = await G1.fft(aG, "jacobian", "jacobian");
        const AGInv = await G1.ifft(AG, "jacobian", "affine");

        for (let i=0; i<N; i++) {
            assert(G1.eq(aG[i], AGInv[i]));
        }

        Fr.s = oldS;
    });
*/
});

