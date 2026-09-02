
export default function buildPairing(curve) {
    const tm = curve.tm;
    curve.pairing = function pairing(a, b) {

        // try/finally on every sync-op region: startSyncOp() throws if one
        // is already open, so a mid-region throw (bad point encoding, wasm
        // trap) that skips endSyncOp() would otherwise wedge the
        // ThreadManager -- every later pairing/prepare/millerLoop call fails
        // with "Sync operation in progress" for the life of the curve.
        tm.startSyncOp();
        try {
            const pA = tm.allocBuff(curve.G1.toJacobian(a));
            const pB = tm.allocBuff(curve.G2.toJacobian(b));
            const pRes = tm.alloc(curve.Gt.n8);
            tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);

            return tm.getBuff(pRes, curve.Gt.n8);
        } finally {
            tm.endSyncOp();
        }
    };

    curve.pairingEq = async function pairingEq() {
        let  buffCt;
        let nEqs;
        if ((arguments.length % 2) == 1) {
            buffCt = arguments[arguments.length-1];
            nEqs = (arguments.length -1) /2;
        } else {
            buffCt = curve.Gt.one;
            nEqs = arguments.length /2;
        }

        const opPromises = [];
        for (let i=0; i<nEqs; i++) {

            const task = [];

            const g1Buff = curve.G1.toJacobian(arguments[i*2]);
            task.push({cmd: "ALLOCSET", var: 0, buff: g1Buff});
            task.push({cmd: "ALLOC", var: 1, len: curve.prePSize});

            const g2Buff = curve.G2.toJacobian(arguments[i*2 +1]);
            task.push({cmd: "ALLOCSET", var: 2, buff: g2Buff});
            task.push({cmd: "ALLOC", var: 3, len: curve.preQSize});

            task.push({cmd: "ALLOC", var: 4, len: curve.Gt.n8});

            task.push({cmd: "CALL", fnName: curve.name + "_prepareG1", params: [
                {var: 0},
                {var: 1}
            ]});

            task.push({cmd: "CALL", fnName: curve.name + "_prepareG2", params: [
                {var: 2},
                {var: 3}
            ]});

            task.push({cmd: "CALL", fnName: curve.name + "_millerLoop", params: [
                {var: 1},
                {var: 3},
                {var: 4}
            ]});

            task.push({cmd: "GET", out: 0, var: 4, len: curve.Gt.n8});

            // Do NOT transfer g1Buff/g2Buff: toJacobian() returns its argument
            // unchanged when the point is already in jacobian form, so these may
            // alias caller-owned buffers (e.g. curve.G1.g / curve.G2.g).
            // Transferring would detach them on the main thread. They are single
            // points, so the structured-clone copy is negligible.
            opPromises.push(
                tm.queueAction(task)
            );
        }


        const result = await Promise.all(opPromises);

        tm.startSyncOp();
        try {
            const pRes = tm.alloc(curve.Gt.n8);
            tm.instance.exports.ftm_one(pRes);

            for (let i=0; i<result.length; i++) {
                const pMR = tm.allocBuff(result[i][0]);
                tm.instance.exports.ftm_mul(pRes, pMR, pRes);
            }
            tm.instance.exports[curve.name + "_finalExponentiation"](pRes, pRes);

            const pCt = tm.allocBuff(buffCt);

            return !!tm.instance.exports.ftm_eq(pRes, pCt);
        } finally {
            tm.endSyncOp();
        }
    };

    curve.prepareG1 = function(p) {
        this.tm.startSyncOp();
        try {
            const pP = this.tm.allocBuff(p);
            const pPrepP = this.tm.alloc(this.prePSize);
            this.tm.instance.exports[this.name + "_prepareG1"](pP, pPrepP);
            return this.tm.getBuff(pPrepP, this.prePSize);
        } finally {
            this.tm.endSyncOp();
        }
    };

    curve.prepareG2 = function(q) {
        this.tm.startSyncOp();
        try {
            const pQ = this.tm.allocBuff(q);
            const pPrepQ = this.tm.alloc(this.preQSize);
            this.tm.instance.exports[this.name + "_prepareG2"](pQ, pPrepQ);
            return this.tm.getBuff(pPrepQ, this.preQSize);
        } finally {
            this.tm.endSyncOp();
        }
    };

    curve.millerLoop = function(preP, preQ) {
        this.tm.startSyncOp();
        try {
            const pPreP = this.tm.allocBuff(preP);
            const pPreQ = this.tm.allocBuff(preQ);
            const pRes = this.tm.alloc(this.Gt.n8);
            this.tm.instance.exports[this.name + "_millerLoop"](pPreP, pPreQ, pRes);
            return this.tm.getBuff(pRes, this.Gt.n8);
        } finally {
            this.tm.endSyncOp();
        }
    };

    curve.finalExponentiation = function(a) {
        this.tm.startSyncOp();
        try {
            const pA = this.tm.allocBuff(a);
            const pRes = this.tm.alloc(this.Gt.n8);
            this.tm.instance.exports[this.name + "_finalExponentiation"](pA, pRes);
            return this.tm.getBuff(pRes, this.Gt.n8);
        } finally {
            this.tm.endSyncOp();
        }
    };

}
