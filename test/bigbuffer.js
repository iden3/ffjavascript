import { assert } from "vitest";
import BigBuffer from "../src/bigbuffer.js";


// PAGE_SIZE is a private constant in src/bigbuffer.js (1 << 30, i.e. 1 GiB).
// Every test elsewhere in this suite uses KB-sized buffers, so firstPage ===
// lastPage always holds and the cross-page copy loops in slice()/set() --
// the entire reason BigBuffer exists, for multi-GiB circuits -- never run.
// These tests deliberately allocate just over 1 GiB to force that boundary.
const PAGE_SIZE = 1 << 30;

describe("BigBuffer page-boundary correctness", function () {

    it("allocates exactly 1 page at size == PAGE_SIZE, 2 pages just above it", () => {
        const atThreshold = new BigBuffer(PAGE_SIZE);
        assert.equal(atThreshold.buffers.length, 1);

        const overThreshold = new BigBuffer(PAGE_SIZE + 1);
        assert.equal(overThreshold.buffers.length, 2);
        assert.equal(overThreshold.buffers[0].length, PAGE_SIZE);
        assert.equal(overThreshold.buffers[1].length, 1);
    });

    it("set()/slice() round-trip a plain Uint8Array across a page boundary", () => {
        const size = PAGE_SIZE + 1024;
        const bb = new BigBuffer(size);

        const chunk = new Uint8Array(2048);
        for (let i = 0; i < chunk.length; i++) chunk[i] = i & 0xFF;
        // Starts 1024 bytes before the page boundary, ends 1024 after it.
        const offset = PAGE_SIZE - 1024;
        bb.set(chunk, offset);

        const readBack = bb.slice(offset, offset + chunk.length);
        assert.equal(readBack.length, chunk.length);
        for (let i = 0; i < chunk.length; i++) {
            assert.equal(readBack[i], chunk[i], `byte mismatch at offset ${i}`);
        }
    });

    it("slice() spanning a page boundary returns a plain Uint8Array (not BigBuffer) when the result fits in one page", () => {
        const bb = new BigBuffer(PAGE_SIZE + 1024);
        const chunk = new Uint8Array(2048);
        for (let i = 0; i < chunk.length; i++) chunk[i] = i & 0xFF;
        bb.set(chunk, PAGE_SIZE - 1024);

        const readBack = bb.slice(PAGE_SIZE - 1024, PAGE_SIZE + 1024);
        assert.instanceOf(readBack, Uint8Array);
        assert.isFalse(readBack instanceof BigBuffer);
    });

    it("slice() spanning multiple pages, with a result too large for one page, returns a BigBuffer", () => {
        const size = 2 * PAGE_SIZE + 4096;
        const bb = new BigBuffer(size);

        // Fill deterministically without materializing the whole thing at once.
        const chunk = new Uint8Array(4096);
        for (let i = 0; i < chunk.length; i++) chunk[i] = (i * 3) & 0xFF;
        const offset = PAGE_SIZE - 2048;
        bb.set(chunk, offset);

        // Slice a range that spans all 3 pages and exceeds PAGE_SIZE itself
        // (from just before the chunk to the very end of the buffer).
        const from = offset - 1000;
        const sliceLen = size - from;
        const result = bb.slice(from, from + sliceLen);
        assert.instanceOf(result, BigBuffer);
        assert.equal(result.byteLength, sliceLen);

        // Spot-check the embedded chunk survived the multi-page slice.
        const relOffset = 1000; // where `chunk` starts inside `result`
        for (let i = 0; i < chunk.length; i += 137) {
            const b = result.slice(relOffset + i, relOffset + i + 1)[0];
            assert.equal(b, chunk[i], `byte mismatch at chunk offset ${i}`);
        }
    });

    it("set() with a multi-page BigBuffer source writes correctly into a multi-page destination across both boundaries", () => {
        const srcSize = PAGE_SIZE + 2048;
        const src = new BigBuffer(srcSize);
        const pattern = new Uint8Array(srcSize);
        for (let i = 0; i < srcSize; i++) pattern[i] = (i * 7) & 0xFF;
        src.set(pattern, 0);
        assert.equal(src.buffers.length, 2);

        const dstSize = 2 * PAGE_SIZE + 4096;
        const dst = new BigBuffer(dstSize);
        assert.equal(dst.buffers.length, 3);

        // destOffset chosen so the multi-page src write itself straddles the
        // destination's first internal page boundary.
        const destOffset = PAGE_SIZE - 512;
        dst.set(src, destOffset);

        // Sample across the whole written range plus exhaustively around
        // both destination page boundaries (offset+512 and offset+PAGE_SIZE+512
        // relative to destOffset).
        function checkByte(i) {
            const b = dst.slice(destOffset + i, destOffset + i + 1)[0];
            assert.equal(b, pattern[i], `byte mismatch at src offset ${i}`);
        }
        for (let i = 0; i < srcSize; i += 100003) checkByte(i); // coarse sample
        for (let i = 0; i < 1100; i++) checkByte(i); // first boundary region
        for (let i = PAGE_SIZE + 512 - 600; i < PAGE_SIZE + 512 + 600 && i < srcSize; i++) checkByte(i); // second boundary region
    });

    it("set() with a zero-length buffer is a no-op and does not throw at a page boundary", () => {
        const bb = new BigBuffer(PAGE_SIZE + 1024);
        assert.doesNotThrow(() => bb.set(new Uint8Array(0), PAGE_SIZE - 10));
    });

    it("slice() with length 0 at a page boundary returns an empty buffer without throwing", () => {
        const bb = new BigBuffer(PAGE_SIZE + 1024);
        const result = bb.slice(PAGE_SIZE, PAGE_SIZE);
        assert.equal(result.length, 0);
    });
});
