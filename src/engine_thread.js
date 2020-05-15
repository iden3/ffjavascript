/* global WebAssembly */

module.exports = function thread(self) {
    let instance;
    let memory;
    let u32;
    let u8;

    if (self) {
        self.onmessage = function(e) {
            let data;
            if (e.data) {
                data = e.data;
            } else {
                data = e;
            }

            if (data.command == "INIT") {
                init(data).then(function() {
                    self.postMessage(data.result);
                });
            } else if (data.command == "TERMINATE") {
                process.exit();
            } else {
                const res = taskManager(data);
                self.postMessage(res[0], [res[1]]);
            }
        };
    }

    async function init(data) {
        const code = new Uint8Array(data.code);
        const wasmModule = await WebAssembly.compile(code);
        memory = new WebAssembly.Memory({initial:data.init});
        u32 = new Uint32Array(memory.buffer);
        u8 = new Uint8Array(memory.buffer);

        instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            }
        });
    }



    function alloc(length) {
        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers
        const res = u32[0];
        u32[0] += length;
        while (u32[0] > memory.buffer.byteLength) {
            memory.grow(100);
        }
        return res;
    }

    function allocBuffer(buffer) {
        const p = alloc(buffer.byteLength);
        setBuffer(p, buffer);
        return p;
    }

    function getBuffer(pointer, length) {
        return new Uint8Array(u8.buffer, u8.byteOffset + pointer, length);
    }

    function setBuffer(pointer, buffer) {
        u8.set(new Uint8Array(buffer), pointer);
    }

    function batchApplyKey(task) {
        const outBuffLen = task.buff.byteLength;
        const oldAlloc = u32[0];
        const pBufIn = allocBuffer(task.buff);
        const pFirst = allocBuffer(task.first);
        const pInc = allocBuffer(task.inc);
        const pBuffOut = alloc(outBuffLen);
        if (task.Gs == "G1") {
            instance.exports.g1m_batchApplyKey(pBufIn, task.n, pFirst, pInc, pBuffOut);
        } else {
            instance.exports.g2m_batchApplyKey(pBufIn, task.n, pFirst, pInc, pBuffOut);
        }

        const outBuff = getBuffer(pBuffOut, outBuffLen).slice();
        u32[0] = oldAlloc;
        return [ outBuff, outBuff];
    }

    function batchConvert(task) {
        const oldAlloc = u32[0];

        const outBuffLen = task.n*task.sGin;
        const pBufIn = allocBuffer(task.buff);
        const pBuffOut = alloc(outBuffLen);
        if (task.Gs == "G1") {
            if (task.fr=="LEM") {
                if (task.to=="U") {
                    instance.exports.g1m_batchLEMtoU(pBufIn, task.n, pBuffOut);
                } else if (task.to=="C") {
                    instance.exports.g1m_batchLEMtoC(pBufIn, task.n, pBuffOut);
                } else {
                    throw new Error("Invalid to: "+task.to);
                }
            } else {
                throw new Error("Invalid fr: "+task.fr);
            }
        } else if (task.Gs == "G2") {
            if (task.fr=="LEM") {
                if (task.to=="U") {
                    instance.exports.g2m_batchLEMtoU(pBufIn, task.n, pBuffOut);
                } else if (task.to=="C") {
                    instance.exports.g2m_batchLEMtoC(pBufIn, task.n, pBuffOut);
                } else {
                    throw new Error("Invalid to: "+task.to);
                }
            } else {
                throw new Error("Invalid fr: "+task.fr);
            }
        } else {
            throw new Error("Invalid group: "+task.gs);
        }

        const outBuff = getBuffer(pBuffOut, outBuffLen).slice();
        u32[0] = oldAlloc;
        return [ outBuff, outBuff];
    }

    function taskManager(task) {
        if (task.command == "INIT") {
            return init(task);
        } else if (task.command == "BATCH_APPLY_KEY") {
            return batchApplyKey(task);
        } else if (task.command == "BATCH_CONVERT") {
            return batchConvert(task);
        } else {
            console.log("Invalid task", task);
            throw new Error("Invalid task");
        }
    }

    return taskManager;
};
