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

            if (data[0].cmd == "INIT") {
                init(data[0]).then(function() {
                    self.postMessage(data.result);
                });
            } else if (data[0].cmd == "TERMINATE") {
                process.exit();
            } else {
                const res = runTask(data);
                self.postMessage(res);
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

    function runTask(task) {
        const self=this;
        if (task[0].cmd == "INIT") {
            return init(task[0]);
        }
        const ctx = {
            vars: [],
            out: []
        };
        const oldAlloc = u32[0];
        for (let i=0; i<task.length; i++) {
            switch (task[i].cmd) {
            case "ALLOCSET":
                ctx.vars[task[i].var] = allocBuffer(task[i].buff);
                break;
            case "ALLOC":
                ctx.vars[task[i].var] = alloc(task[i].len);
                break;
            case "SET":
                setBuffer(ctx.vars[task[i].var], task[i].buff);
                break;
            case "CALL": {
                const params = [];
                for (let j=0; j<task[i].params.length; j++) {
                    const p = task[i].params[j];
                    if (typeof p.var !== "undefined") {
                        params.push(ctx.vars[p.var] + (p.offset || 0));
                    } else if (typeof p.val != "undefined") {
                        params.push(p.val);
                    }
                }
                instance.exports[task[i].fnName](...params);
                break;
            }
            case "GET":
                ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
                break;
            default:
                throw new Error("Invalid cmd");
            }
        }
        u32[0] = oldAlloc;
        return ctx.out;
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
        return [ outBuff, outBuff.buffer];
    }

    function batchConvert(task) {
        const oldAlloc = u32[0];

        const outBuffLen = task.n*task.sOut;
        const pBufIn = allocBuffer(task.buff);
        const pBuffOut = alloc(outBuffLen);

        instance.exports[task.fnName](pBufIn, task.n, pBuffOut);
        const outBuff = getBuffer(pBuffOut, outBuffLen).slice();
        u32[0] = oldAlloc;
        return [ outBuff, outBuff.buffer];
    }

    function batchConvertOld(task) {
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
        return [ outBuff, outBuff.buffer];
    }


    function fft(task) {
        const oldAlloc = u32[0];

        const maxBuffLen = task.n*task.sGin*3/2;
        const pBuff = alloc(maxBuffLen);
        setBuffer(pBuff, task.buff);
        if (task.Gs == "G1") {
            instance.exports.g1m_batchToJacobian(pBuff, task.n, pBuff);
            if (task.inverse) {
                instance.exports.g1m_ifft(pBuff, task.n);
            } else {
                instance.exports.g1m_fft(pBuff, task.n);
            }
            instance.exports.g1m_batchToAffine(pBuff, task.n, pBuff);
        } else if (task.Gs == "G2") {
            instance.exports.g2m_batchToJacobian(pBuff, task.n, pBuff);
            if (task.inverse) {
                instance.exports.g2m_ifft(pBuff, task.n);
            } else {
                instance.exports.g2m_fft(pBuff, task.n);
            }
            instance.exports.g2m_batchToAffine(pBuff, task.n, pBuff);
        } else if (task.Gs == "Fr") {
            if (task.inverse) {
                instance.exports.frm_ifft(pBuff, task.n);
            } else {
                instance.exports.frm_fft(pBuff, task.n);
            }
        } else {
            throw new Error("Invalid group: "+task.gs);
        }

        const outBuff = getBuffer(pBuff, task.n*task.sGin).slice();
        u32[0] = oldAlloc;
        return [ outBuff, outBuff.buffer];
    }


    function multiexp(task) {
        const oldAlloc = u32[0];

        const pBuffBases = allocBuffer(task.buffBases);
        const pBuffScalars = allocBuffer(task.buffScalars);
        const pOut = alloc(task.sOut);
        instance.exports[task.fnName](pBuffBases, pBuffScalars, task.sScalar, task.n, pOut);

        const outBuff = getBuffer(pOut, task.sOut).slice();
        u32[0] = oldAlloc;
        return [ outBuff, outBuff.buffer];
    }


    function taskManager(task) {
        if (task.command == "INIT") {
            return init(task);
        } else if (task.command == "BATCH_APPLY_KEY") {
            return batchApplyKey(task);
        } else if (task.command == "BATCH_CONVERT") {
            return batchConvert(task);
        } else if (task.command == "FFT") {
            return fft(task);
        } else if (task.command == "MULTIEXP") {
            return multiexp(task);
        } else {
            console.log("Invalid task", task);
            throw new Error("Invalid task");
        }
    }

    return runTask;
};
