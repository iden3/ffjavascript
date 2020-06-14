/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

const Scalar = require("./scalar");
const F1Field = require("./f1field");
const F2Field = require("./f2field");
const F3Field = require("./f3field");
const PolField = require("./polfield");
const EC = require("./ec.js");
const buildEngine = require("./engine");
const bn128_wasm = require("wasmsnark").bn128_wasm;


let engine = null;


class BN128 {

    constructor() {

        this.name = "bn128";
        this.q = Scalar.fromString("21888242871839275222246405745257275088696311157297823662689037894645226208583");
        this.r = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");


        this.F1 = new F1Field(this.q);
        this.nonResidueF2 = this.F1.e("21888242871839275222246405745257275088696311157297823662689037894645226208582");

        this.F2 = new F2Field(this.F1, this.nonResidueF2);
        this.g1 = [ this.F1.e(1), this.F1.e(2), this.F1.e(1)];
        this.g2 = [
            [
                this.F1.e("10857046999023057135944570762232829481370756359578518086990519993285655852781"),
                this.F1.e("11559732032986387107991004021392285783925812861821192530917403151452391805634")
            ],
            [
                this.F1.e("8495653923123431417604973247489272438418190587263600148770280649306958101930"),
                this.F1.e("4082367875863433681332203403145435568316851327593401208105741076214120093531")
            ],
            [
                this.F1.e("1"),
                this.F1.e("0")
            ]
        ];
        this.G1 = new EC(this.F1, this.g1);
        this.G2 = new EC(this.F2, this.g2);

        this.G1.b = this.F1.e(3);
        this.G2.b = this.F2.div([this.F1.e(3),this.F1.e(0)], [this.F1.e(9), this.F1.e(1)]);
        this.G2.cofactor = Scalar.e("0x30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d");

        this.nonResidueF6 = [ this.F1.e("9"), this.F1.e("1") ];

        this.F6 = new F3Field(this.F2, this.nonResidueF6);
        this.F12 = new F2Field(this.F6, this.nonResidueF6);
        this.Fr = new F1Field(this.r);
        this.PFr = new PolField(this.Fr);
        this.Gt = new F2Field(this.F6, this.nonResidueF6);
        this.Gt.neg = this.F12.conjugate.bind(this.Gt);


        const self = this;
        this.F12._mulByNonResidue = function(a) {
            return [self.F2.mul(this.nonResidue, a[2]), a[0], a[1]];
        };


        this.PrePSize= 192;
        this.PreQSize= 19776;

        this._preparePairing();

        this.G1.batchApplyKey = this.batchApplyKeyG1.bind(this);
        this.G2.batchApplyKey = this.batchApplyKeyG2.bind(this);
        this.Fr.batchApplyKey = this.batchApplyKeyFr.bind(this);
        this.G1.batchLEMtoU = this.batchLEMtoUG1.bind(this);
        this.G2.batchLEMtoU = this.batchLEMtoUG2.bind(this);
        this.G1.batchLEMtoC = this.batchLEMtoCG1.bind(this);
        this.G2.batchLEMtoC = this.batchLEMtoCG2.bind(this);
        this.G1.batchUtoLEM = this.batchUtoLEMG1.bind(this);
        this.G2.batchUtoLEM = this.batchUtoLEMG2.bind(this);
        this.G1.batchCtoLEM = this.batchCtoLEMG1.bind(this);
        this.G2.batchCtoLEM = this.batchCtoLEMG2.bind(this);
        this.G1.batchToJacobian = this.batchToJacobianG1.bind(this);
        this.G2.batchToJacobian = this.batchToJacobianG2.bind(this);
        this.G1.batchToAffine = this.batchToAffineG1.bind(this);
        this.G2.batchToAffine = this.batchToAffineG2.bind(this);
        this.G1.ifft = this.ifftG1.bind(this);
        this.G1.fft = this.fftG1.bind(this);
        this.G2.ifft = this.ifftG2.bind(this);
        this.G2.fft = this.fftG2.bind(this);
        this.G1.fftMix = this.fftMixG1.bind(this);
        this.G1.fftJoin = this.fftJoinG1.bind(this);
        this.G1.fftFinal = this.fftFinalG1.bind(this);
        this.G2.fftMix = this.fftMixG2.bind(this);
        this.G2.fftJoin = this.fftJoinG2.bind(this);
        this.G2.fftFinal = this.fftFinalG2.bind(this);

        this.Fr.batchToMontgomery = this.batchToMontgomeryFr.bind(this);
        this.Fr.batchFromMontgomery = this.batchFromMontgomeryFr.bind(this);
        this.Fr.fft = this.fftFr.bind(this);
        this.Fr.ifft = this.ifftFr.bind(this);

        this.G1.multiExpAffine = this.multiExpAffineG1.bind(this);
        this.G2.multiExpAffine = this.multiExpAffineG2.bind(this);
    }

    async loadEngine() {
        const self = this;
        if (!engine) {
            engine = await buildEngine(this, bn128_wasm  , true  ); // Set single Trherad tot true to debug
        }
        self.engine = engine;
    }

    async batchApplyKeyG1(buff, first, inc, inType, outType) {
        await this.loadEngine();
        const res = await engine.batchApplyKey("G1", buff, first, inc, inType, outType);
        return res;
    }

    async batchApplyKeyG2(buff, first, inc, inType, outType) {
        await this.loadEngine();
        const res = await engine.batchApplyKey("G2", buff, first, inc, inType, outType);
        return res;
    }

    async batchApplyKeyFr(buff, first, inc) {
        await this.loadEngine();
        const res = await engine.batchApplyKey("Fr", buff, first, inc);
        return res;
    }

    async batchLEMtoUG1(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G1", "LEM", "U", buff );
        const res = await engine.batchConvert("g1m_batchLEMtoU", buff, this.F1.n8*2, this.F1.n8*2);
        return res;
    }

    async batchLEMtoUG2(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G2", "LEM", "U",buff);
        const res = await engine.batchConvert("g2m_batchLEMtoU", buff, this.F2.n8*2, this.F2.n8*2);
        return res;
    }

    async batchLEMtoCG1(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G1", "LEM", "C", buff);
        const res = await engine.batchConvert("g1m_batchLEMtoC", buff, this.F1.n8*2, this.F1.n8);
        return res;
    }

    async batchLEMtoCG2(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G2", "LEM", "C", buff);
        const res = await engine.batchConvert("g2m_batchLEMtoC", buff, this.F2.n8*2, this.F2.n8);
        return res;
    }
/////

    async batchUtoLEMG1(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G1", "LEM", "U", buff );
        const res = await engine.batchConvert("g1m_batchUtoLEM", buff, this.F1.n8*2, this.F1.n8*2);
        return res;
    }

    async batchUtoLEMG2(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G2", "LEM", "U",buff);
        const res = await engine.batchConvert("g2m_batchUtoLEM", buff, this.F2.n8*2, this.F2.n8*2);
        return res;
    }

    async batchCtoLEMG1(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G1", "LEM", "C", buff);
        const res = await engine.batchConvert("g1m_batchCtoLEM", buff, this.F1.n8, this.F1.n8*2);
        return res;
    }

    async batchCtoLEMG2(buff) {
        await this.loadEngine();
        // const res = await engine.batchConvert("G2", "LEM", "C", buff);
        const res = await engine.batchConvert("g2m_batchCtoLEM", buff, this.F2.n8, this.F2.n8*2);
        return res;
    }

    async batchToMontgomeryFr(buff) {
        await this.loadEngine();
        const res = await engine.batchConvert("frm_batchToMontgomery", buff, this.Fr.n8, this.Fr.n8);
        return res;
    }

    async batchFromMontgomeryFr(buff) {
        await this.loadEngine();
        const res = await engine.batchConvert("frm_batchFromMontgomery", buff, this.Fr.n8, this.Fr.n8);
        return res;
    }

    async batchToAffineG1(buff) {
        await this.loadEngine();
        const res = await engine.batchConvert("g1m_batchToAffine", buff, this.G1.F.n8*3, this.G1.F.n8*2);
        return res;
    }

    async batchToAffineG2(buff) {
        await this.loadEngine();
        const res = await engine.batchConvert("g2m_batchToAffine", buff, this.G2.F.n8*3, this.G2.F.n8*2);
        return res;
    }

    async batchToJacobianG1(buff) {
        await this.loadEngine();
        const res = await engine.batchConvert("g1m_batchToJacobian", buff, this.G1.F.n8*2, this.G1.F.n8*3);
        return res;
    }

    async batchToJacobianG2(buff) {
        await this.loadEngine();
        const res = await engine.batchConvert("g2m_batchToJacobian", buff, this.G2.F.n8*2, this.G2.F.n8*3);
        return res;
    }

    async fftG1(buff, inType, outType, log) {
        await this.loadEngine();
        const res = await engine.fft("G1", buff, false, inType, outType, log);
        return res;
    }

    async ifftG1(buff, inType, outType, log) {
        await this.loadEngine();
        const res = await engine.fft("G1", buff, true, inType, outType, log);
        return res;
    }

    async fftG2(buff, inType, outType, log) {
        await this.loadEngine();
        const res = await engine.fft("G2", buff, false, inType, outType, log);
        return res;
    }

    async ifftG2(buff, inType, outType,  log) {
        await this.loadEngine();
        const res = await engine.fft("G2", buff, true, inType, outType, log);
        return res;
    }

    async fftFr(buff, log) {
        await this.loadEngine();
        const res = await engine.fft("Fr", buff, false, undefined, undefined, log);
        return res;
    }

    async ifftFr(buff, log) {
        await this.loadEngine();
        const res = await engine.fft("Fr", buff, true, undefined, undefined, log);
        return res;
    }

    async fftMixG1(buff, log) {
        await this.loadEngine();
        const res = await engine.fftMix("G1", buff, log);
        return res;
    }

    async fftJoinG1(buff1, buff2, first, inc, log) {
        await this.loadEngine();
        const res = await engine.fftJoin("G1", buff1, buff2, first, inc, log);
        return res;
    }

    async fftFinalG1(buff1, factor, log) {
        await this.loadEngine();
        const res = await engine.fftFinal("G1", buff1, factor, log);
        return res;
    }

    async fftMixG2(buff, log) {
        await this.loadEngine();
        const res = await engine.fftMix("G2", buff, log);
        return res;
    }

    async fftJoinG2(buff1, buff2, first, inc, log) {
        await this.loadEngine();
        const res = await engine.fftJoin("G2", buff1, buff2, first, inc, log);
        return res;
    }

    async fftFinalG2(buff1, factor, log) {
        await this.loadEngine();
        const res = await engine.fftFinal("G2", buff1, factor, log);
        return res;
    }

    async multiExpAffineG1(buffBases, buffScalars) {
        await this.loadEngine();
        const res = await engine.multiExpAffine("G1", buffBases, buffScalars);
        return res;
    }

    async multiExpAffineG2(buffBases, buffScalars) {
        await this.loadEngine();
        const res = await engine.multiExpAffine("G2", buffBases, buffScalars);
        return res;
    }

    async pairingEq() {
        const self = this;
        await self.loadEngine();
        const res = await engine.pairingEq(...arguments);
        return res;
    }


    _preparePairing() {
        this.loopCount = Scalar.fromString("29793968203157093288");// CONSTANT

        // Set loopCountNeg
        if (Scalar.isNegative(this.loopCount)) {
            this.loopCount = this.loopCount.neg();
            this.loopCountNeg = true;
        } else {
            this.loopCountNeg = false;
        }

        // Set loop_count_bits
        let lc = this.loopCount;
        this.loop_count_bits = []; // Constant
        while (!Scalar.isZero(lc)) {
            this.loop_count_bits.push( Scalar.isOdd(lc) );
            lc = Scalar.shiftRight(lc, 1);
        }

        this.two_inv = this.F1.inv(this.F1.e(2));

        this.coef_b = this.F1.e(3);
        this.twist = [this.F1.e(9) , this.F1.e(1)];
        this.twist_coeff_b = this.F2.mulScalar(  this.F2.inv(this.twist), this.coef_b  );

        this.frobenius_coeffs_c1_1 = this.F1.e("21888242871839275222246405745257275088696311157297823662689037894645226208582");
        this.twist_mul_by_q_X =
            [
                this.F1.e("21575463638280843010398324269430826099269044274347216827212613867836435027261"),
                this.F1.e("10307601595873709700152284273816112264069230130616436755625194854815875713954")
            ];
        this.twist_mul_by_q_Y =
            [
                this.F1.e("2821565182194536844548159561693502659359617185244120367078079554186484126554"),
                this.F1.e("3505843767911556378687030309984248845540243509899259641013678093033130930403")
            ];

        this.final_exponent = Scalar.fromString("552484233613224096312617126783173147097382103762957654188882734314196910839907541213974502761540629817009608548654680343627701153829446747810907373256841551006201639677726139946029199968412598804882391702273019083653272047566316584365559776493027495458238373902875937659943504873220554161550525926302303331747463515644711876653177129578303191095900909191624817826566688241804408081892785725967931714097716709526092261278071952560171111444072049229123565057483750161460024353346284167282452756217662335528813519139808291170539072125381230815729071544861602750936964829313608137325426383735122175229541155376346436093930287402089517426973178917569713384748081827255472576937471496195752727188261435633271238710131736096299798168852925540549342330775279877006784354801422249722573783561685179618816480037695005515426162362431072245638324744480");

    }


    pairing(p1, p2) {

        const pre1 = this.precomputeG1(p1);
        const pre2 = this.precomputeG2(p2);

        const r1 = this.millerLoop(pre1, pre2);

        const res = this.finalExponentiation(r1);

        return res;
    }


    precomputeG1(p) {
        const Pcopy = this.G1.affine(p);

        const res = {};
        res.PX = Pcopy[0];
        res.PY = Pcopy[1];

        return res;
    }

    precomputeG2(p) {

        const Qcopy = this.G2.affine(p);

        const res = {
            QX: Qcopy[0],
            QY: Qcopy[1],
            coeffs: []
        };

        const R = {
            X: Qcopy[0],
            Y: Qcopy[1],
            Z: this.F2.one
        };

        let c;

        for (let i = this.loop_count_bits.length-2; i >= 0; --i)
        {
            const bit = this.loop_count_bits[i];

            c = this._doubleStep(R);
            res.coeffs.push(c);

            if (bit)
            {
                c = this._addStep(Qcopy, R);
                res.coeffs.push(c);
            }
        }

        const Q1 = this.G2.affine(this._g2MulByQ(Qcopy));
        if (!this.F2.eq(Q1[2], this.F2.one))
        {
            throw new Error("Expected values are not equal");
        }
        const Q2 = this.G2.affine(this._g2MulByQ(Q1));
        if (!this.F2.eq(Q2[2], this.F2.one))
        {
            throw new Error("Expected values are not equal");
        }

        if (this.loopCountNeg)
        {
            R.Y = this.F2.neg(R.Y);
        }
        Q2[1] = this.F2.neg(Q2[1]);

        c = this._addStep(Q1, R);
        res.coeffs.push(c);

        c = this._addStep(Q2, R);
        res.coeffs.push(c);

        return res;
    }

    millerLoop(pre1, pre2) {
        let f = this.F12.one;

        let idx = 0;

        let c;

        for (let i = this.loop_count_bits.length-2; i >= 0; --i)
        {
            const bit = this.loop_count_bits[i];

            /* code below gets executed for all bits (EXCEPT the MSB itself) of
               alt_bn128_param_p (skipping leading zeros) in MSB to LSB
               order */

            c = pre2.coeffs[idx++];
            f = this.F12.square(f);
            f = this._mul_by_024(
                f,
                c.ell_0,
                this.F2.mulScalar(c.ell_VW , pre1.PY),
                this.F2.mulScalar(c.ell_VV , pre1.PX));

            if (bit)
            {
                c = pre2.coeffs[idx++];
                f = this._mul_by_024(
                    f,
                    c.ell_0,
                    this.F2.mulScalar(c.ell_VW, pre1.PY),
                    this.F2.mulScalar(c.ell_VV, pre1.PX));
            }

        }

        if (this.loopCountNeg)
        {
            f = this.F12.inverse(f);
        }

        c = pre2.coeffs[idx++];
        f = this._mul_by_024(
            f,
            c.ell_0,
            this.F2.mulScalar(c.ell_VW, pre1.PY),
            this.F2.mulScalar(c.ell_VV, pre1.PX));

        c = pre2.coeffs[idx++];
        f = this._mul_by_024(
            f,
            c.ell_0,
            this.F2.mulScalar(c.ell_VW, pre1.PY),
            this.F2.mulScalar(c.ell_VV, pre1.PX));

        return f;
    }

    finalExponentiation(elt) {
        // TODO: There is an optimization in FF

        const res = this.F12.pow(elt,this.final_exponent);

        return res;
    }

    _doubleStep(current) {
        const X = current.X;
        const Y = current.Y;
        const Z = current.Z;

        const A = this.F2.mulScalar(this.F2.mul(X,Y), this.two_inv);                     // A = X1 * Y1 / 2
        const B = this.F2.square(Y);                           // B = Y1^2
        const C = this.F2.square(Z);                           // C = Z1^2
        const D = this.F2.add(C, this.F2.add(C,C));            // D = 3 * C
        const E = this.F2.mul(this.twist_coeff_b, D);     // E = twist_b * D
        const F = this.F2.add(E, this.F2.add(E,E));            // F = 3 * E
        const G =
            this.F2.mulScalar(
                this.F2.add( B , F ),
                this.two_inv);                            // G = (B+F)/2
        const H =
            this.F2.sub(
                this.F2.square( this.F2.add(Y,Z) ),
                this.F2.add( B , C));                          // H = (Y1+Z1)^2-(B+C)
        const I = this.F2.sub(E, B);                           // I = E-B
        const J = this.F2.square(X);                           // J = X1^2
        const E_squared = this.F2.square(E);                   // E_squared = E^2

        current.X = this.F2.mul( A, this.F2.sub(B,F) );        // X3 = A * (B-F)
        current.Y =
            this.F2.sub(
                this.F2.sub( this.F2.square(G) , E_squared ),
                this.F2.add( E_squared , E_squared ));         // Y3 = G^2 - 3*E^2
        current.Z = this.F2.mul( B, H );                       // Z3 = B * H

        const c = {
            ell_0 : this.F2.mul( I, this.twist),          // ell_0 = xi * I
            ell_VW: this.F2.neg( H ),                          // ell_VW = - H (later: * yP)
            ell_VV: this.F2.add( J , this.F2.add(J,J) )        // ell_VV = 3*J (later: * xP)
        };

        return c;
    }

    _addStep(base, current) {

        const X1 = current.X;
        const Y1 = current.Y;
        const Z1 = current.Z;
        const x2 = base[0];
        const y2 = base[1];

        const D = this.F2.sub( X1, this.F2.mul(x2,Z1) );  // D = X1 - X2*Z1

        // console.log("Y: "+ A[0].affine(this.q).toString(16));

        const E = this.F2.sub( Y1, this.F2.mul(y2,Z1) );  // E = Y1 - Y2*Z1
        const F = this.F2.square(D);                      // F = D^2
        const G = this.F2.square(E);                      // G = E^2
        const H = this.F2.mul(D,F);                       // H = D*F
        const I = this.F2.mul(X1,F);                      // I = X1 * F
        const J =
            this.F2.sub(
                this.F2.add( H, this.F2.mul(Z1,G) ),
                this.F2.add( I, I ));                     // J = H + Z1*G - (I+I)

        current.X = this.F2.mul( D , J );                 // X3 = D*J
        current.Y =
            this.F2.sub(
                this.F2.mul( E , this.F2.sub(I,J) ),
                this.F2.mul( H , Y1));                    // Y3 = E*(I-J)-(H*Y1)
        current.Z = this.F2.mul(Z1,H);
        const c = {
            ell_0 :
                this.F2.mul(
                    this.twist,
                    this.F2.sub(
                        this.F2.mul(E , x2),
                        this.F2.mul(D , y2))),            // ell_0 = xi * (E * X2 - D * Y2)
            ell_VV : this.F2.neg(E),                      // ell_VV = - E (later: * xP)
            ell_VW : D                                    // ell_VW = D (later: * yP )
        };

        return c;
    }

    _mul_by_024(a, ell_0, ell_VW, ell_VV) {

        //  Old implementation
        /*
        const b = [
            [ell_0, this.F2.zero, ell_VV],
            [this.F2.zero, ell_VW, this.F2.zero]
        ];

        return this.F12.mul(a,b);
        */

        // This is a new implementation,
        //  But it does not look worthy
        //  at least in javascript.

        let z0 = a[0][0];
        let z1 = a[0][1];
        let z2 = a[0][2];
        let z3 = a[1][0];
        let z4 = a[1][1];
        let z5 = a[1][2];

        const x0 = ell_0;
        const x2 = ell_VV;
        const x4 = ell_VW;

        const D0 = this.F2.mul(z0, x0);
        const D2 = this.F2.mul(z2, x2);
        const D4 = this.F2.mul(z4, x4);
        const t2 = this.F2.add(z0, z4);
        let t1 = this.F2.add(z0, z2);
        const s0 = this.F2.add(this.F2.add(z1,z3),z5);

        // For z.a_.a_ = z0.
        let S1 = this.F2.mul(z1, x2);
        let T3 = this.F2.add(S1, D4);
        let T4 = this.F2.add( this.F2.mul(this.nonResidueF6, T3),D0);
        z0 = T4;

        // For z.a_.b_ = z1
        T3 = this.F2.mul(z5, x4);
        S1 = this.F2.add(S1, T3);
        T3 = this.F2.add(T3, D2);
        T4 = this.F2.mul(this.nonResidueF6, T3);
        T3 = this.F2.mul(z1, x0);
        S1 = this.F2.add(S1, T3);
        T4 = this.F2.add(T4, T3);
        z1 = T4;

        // For z.a_.c_ = z2
        let t0 = this.F2.add(x0, x2);
        T3 = this.F2.sub(
            this.F2.mul(t1, t0),
            this.F2.add(D0, D2));
        T4 = this.F2.mul(z3, x4);
        S1 = this.F2.add(S1, T4);

        // For z.b_.a_ = z3 (z3 needs z2)
        t0 = this.F2.add(z2, z4);
        z2 = this.F2.add(T3, T4);
        t1 = this.F2.add(x2, x4);
        T3 = this.F2.sub(
            this.F2.mul(t0,t1),
            this.F2.add(D2, D4));

        T4 = this.F2.mul(this.nonResidueF6,  T3);
        T3 = this.F2.mul(z3, x0);
        S1 = this.F2.add(S1, T3);
        T4 = this.F2.add(T4, T3);
        z3 = T4;

        // For z.b_.b_ = z4
        T3 = this.F2.mul(z5, x2);
        S1 = this.F2.add(S1, T3);
        T4 = this.F2.mul(this.nonResidueF6, T3);
        t0 = this.F2.add(x0, x4);
        T3 = this.F2.sub(
            this.F2.mul(t2,t0),
            this.F2.add(D0, D4));
        T4 = this.F2.add(T4, T3);
        z4 = T4;

        // For z.b_.c_ = z5.
        t0 = this.F2.add(this.F2.add(x0, x2), x4);
        T3 = this.F2.sub(this.F2.mul(s0, t0), S1);
        z5 = T3;

        return [
            [z0, z1, z2],
            [z3, z4, z5]
        ];


    }

    _g2MulByQ(p) {
        const fmx = [p[0][0], this.F1.mul(p[0][1], this.frobenius_coeffs_c1_1 )];
        const fmy = [p[1][0], this.F1.mul(p[1][1], this.frobenius_coeffs_c1_1 )];
        const fmz = [p[2][0], this.F1.mul(p[2][1], this.frobenius_coeffs_c1_1 )];
        return [
            this.F2.mul(this.twist_mul_by_q_X , fmx),
            this.F2.mul(this.twist_mul_by_q_Y , fmy),
            fmz
        ];
    }
}

module.exports = new BN128();
