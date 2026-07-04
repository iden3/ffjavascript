import { assert } from "vitest";
import buildBn128 from "../src/bn128.js";
import {log2} from "../src/utils.js";
import BigBuffer from "../src/bigbuffer.js";
describe("bn128", async function () {

    const logger = {
        error: (msg) => { console.log("ERROR: "+msg); },
        warning: (msg) => { console.log("WARNING: "+msg); },
        info: (msg) => { console.log("INFO: "+msg); },
        debug: (msg) => { console.log("DEBUG: "+msg); },
    };

    let bn128;
    beforeAll( async() => {
        bn128 = await buildBn128();
        console.log(bn128.Fr.toString(bn128.Fr.w[28]));
    });
    afterAll( async() => {
        bn128.terminate();
    });

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


    it("It shoud do a big FFT/IFFT in Fr", async () => {
        const Fr = bn128.Fr;

        const N = 1<<10;

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
            // console.log(Fr.toString(Ainv[i]));
            const num1 = Ainv.slice(i*Fr.n8, i*Fr.n8+Fr.n8);
            const num2 = a.slice(i*Fr.n8, i*Fr.n8+Fr.n8);

            assert(num1, num2);
        }
    });

    it("Fr.fft consume matches non-consume and detaches the input", async () => {
        const Fr = bn128.Fr;
        const N = 1 << 10;
        const a = new Uint8Array(N * Fr.n8);
        for (let i = 0; i < N; i++) a.set(Fr.e(i + 1), i * Fr.n8);

        const ref = await Fr.fft(a.slice(), "", "", null, "ref");          // copy, non-consume
        const got = await Fr.fft(a, "", "", null, "consume", true);        // flat Uint8Array -> consumed

        assert.equal(got.byteLength, ref.byteLength);
        for (let i = 0; i < ref.byteLength; i++) assert.equal(got[i], ref[i]);
        assert.equal(a.byteLength, 0, "consumed input buffer should be detached");
    });



    it("It shoud do a big FFT/IFFT in Fr", async () => {
        const Fr = bn128.Fr;
        const N = 8192*16;

        const a = [];
        for (let i=0; i<N; i++) a[i] = Fr.e(i+1);

        const A = await bn128.Fr.fft(a);
        const Ainv = await bn128.Fr.ifft(A);

        for (let i=0; i<N; i++) {
            //console.log(Fr.toString(Ainv[i]));
            assert(Fr.eq(a[i], Ainv[i]));
        }
    });


    it("Fr.fft/ifft round-trip correctly at boundary sizes N=1 and N=2", async () => {
        const Fr = bn128.Fr;
        for (const N of [1, 2]) {
            const buf = new Uint8Array(N * Fr.n8);
            for (let i = 0; i < N; i++) buf.set(Fr.e(i + 1), i * Fr.n8);
            const fft = await Fr.fft(buf);
            const back = await Fr.ifft(fft);
            for (let i = 0; i < N; i++) {
                assert(Fr.eq(Fr.e(i + 1), back.slice(i * Fr.n8, (i + 1) * Fr.n8)));
            }
        }
    });

    it("Fr.fft rejects N=0 with a clear error instead of hanging or crashing", async () => {
        const Fr = bn128.Fr;
        let threw = false;
        try { await Fr.fft(new Uint8Array(0)); }
        catch { threw = true; }
        assert(threw, "fft on an empty buffer should throw, not hang or silently return garbage");
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
            //console.log(Fr.toString(Ainv[i]));
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

    it("It shoud do Multiexp", async () => {
        const Fr = bn128.Fr;
        const G1 = bn128.G1;
        const N = 1 << 10;

        const scalars = new BigBuffer(N*bn128.Fr.n8);
        const bases = new BigBuffer(N*G1.F.n8*2);
        let acc = Fr.zero;
        for (let i=0; i<N; i++) {
            if (i%100000 == 0) logger.debug(`setup ${i}/${N}`);
            const num = Fr.e(i+1);
            scalars.set(Fr.fromMontgomery(num), i*bn128.Fr.n8);
            bases.set(G1.toAffine(G1.timesFr(G1.g, num)), i*G1.F.n8*2);
            acc = Fr.add(acc, Fr.square(num));
        }

        const accG = G1.timesFr(G1.g, acc);
        const accG2 = await G1.multiExpAffine(bases, scalars, logger, "test");

        assert(G1.eq(accG, accG2 ));
    });

    // multiExpAffineChunked must produce the exact same point as multiExpAffine,
    // exercising the multi-chunk partition+sum and the backpressured reader path.
    async function checkChunkedMatches(G, Fr, N) {
        const sG = G.F.n8*2;
        const scalars = new Uint8Array(N*Fr.n8);
        const bases = new Uint8Array(N*sG);
        for (let i=0; i<N; i++) {
            const num = Fr.e(i+1);
            scalars.set(Fr.fromMontgomery(num), i*Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i*sG);
        }
        const expected = await G.multiExpAffine(bases, scalars, null, "ref");
        // reader returns each sub-range as a FRESH copy (.slice), mirroring a file
        // read — so the chunk is safely transferable to a worker without detaching
        // the source buffer.
        const reader = async (off, len) => bases.slice(off, off+len);
        const got = await G.multiExpAffineChunked(reader, bases.byteLength, scalars, null, "chunked");
        assert(G.eq(expected, got));
    }

    it("multiExpAffineChunked (G1) matches multiExpAffine", async () => {
        await checkChunkedMatches(bn128.G1, bn128.Fr, 1 << 14); // ~4 chunks
    });

    it("multiExpAffineChunked (G2) matches multiExpAffine", async () => {
        await checkChunkedMatches(bn128.G2, bn128.Fr, 1 << 13); // ~2 chunks
    });

    it("multiexp batching modes (auto/enabled/disabled) agree", async () => {
        const G = bn128.G1, Fr = bn128.Fr;
        const N = 1 << 12;
        const sG = G.F.n8*2;
        const scalars = new Uint8Array(N*Fr.n8);
        const bases = new Uint8Array(N*sG);
        for (let i=0; i<N; i++) {
            const num = Fr.e(i*7+3);
            scalars.set(Fr.fromMontgomery(num), i*Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i*sG);
        }
        const rAuto = await G.multiExpAffine(bases, scalars, null, "auto", {batch: "auto"});
        const rOn   = await G.multiExpAffine(bases, scalars, null, "on",   {batch: "enabled"});
        const rOff  = await G.multiExpAffine(bases, scalars, null, "off",  {batch: "disabled"});
        const rDef  = await G.multiExpAffine(bases, scalars, null, "def");
        assert(G.eq(rAuto, rOn));
        assert(G.eq(rAuto, rOff));
        assert(G.eq(rAuto, rDef));
    });

    it("G1 glv option (endomorphism auto/disabled) agrees", async () => {
        const G = bn128.G1, Fr = bn128.Fr;
        const N = 1 << 11;
        const sG = G.F.n8*2;
        const scalars = new Uint8Array(N*Fr.n8);
        const bases = new Uint8Array(N*sG);
        for (let i=0; i<N; i++) {
            const num = Fr.e(i*13+7);
            scalars.set(Fr.fromMontgomery(num), i*Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i*sG);
        }
        const rAuto = await G.multiExpAffine(bases, scalars, null, "glv",   {batch: "enabled"});
        const rNo   = await G.multiExpAffine(bases, scalars, null, "noglv", {batch: "enabled", glv: "disabled"});
        assert(G.eq(rAuto, rNo));
    });

    it("G2 gls option (endomorphism on/off) agrees", async () => {
        const G = bn128.G2, Fr = bn128.Fr;
        const N = 1 << 10;
        const sG = G.F.n8*2;
        const scalars = new Uint8Array(N*Fr.n8);
        const bases = new Uint8Array(N*sG);
        for (let i=0; i<N; i++) {
            const num = Fr.e(i*11+5);
            scalars.set(Fr.fromMontgomery(num), i*Fr.n8);
            bases.set(G.toAffine(G.timesFr(G.g, num)), i*sG);
        }
        const rGls  = await G.multiExpAffine(bases, scalars, null, "gls",   {batch: "enabled"});
        const rNo   = await G.multiExpAffine(bases, scalars, null, "nogls", {batch: "enabled", gls: "disabled"});
        const rOff  = await G.multiExpAffine(bases, scalars, null, "plain", {batch: "disabled", gls: "disabled"});
        assert(G.eq(rGls, rNo));
        assert(G.eq(rGls, rOff));
    });

    it("multiExpAffineChunked rejects a non-function reader", async () => {
        let threw = false;
        try { await bn128.G1.multiExpAffineChunked(null, 64, new Uint8Array(32), null, "bad"); }
        catch { threw = true; }
        assert(threw, "should throw when basesReader is not a function");
    });

    it("multiExpAffine rejects a scalar buffer whose length doesn't divide evenly across the bases", async () => {
        const G = bn128.G1, Fr = bn128.Fr;
        const N = 10;
        const bases = new Uint8Array(N * G.F.n8 * 2);
        // Not a multiple of N -- geometry() can't derive a consistent sScalar.
        const badScalars = new Uint8Array(N * Fr.n8 + 3);
        let threw = false;
        try { await G.multiExpAffine(bases, badScalars, null, "mismatch"); }
        catch { threw = true; }
        assert(threw, "should throw when scalar buffer size is inconsistent with the bases count");
    });

});

