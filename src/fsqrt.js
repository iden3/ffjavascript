const Scalar = require("./scalar");
const assert = require("assert");
// Check here: https://eprint.iacr.org/2012/685.pdf

module.exports = function buildSqrt (F) {
    if ((F.m % 2) == 1) {
        if (Scalar.eq(Scalar.mod(F.p, 4), 1 )) {
            if (Scalar.eq(Scalar.mod(F.p, 8), 1 )) {
                if (Scalar.eq(Scalar.mod(F.p, 16), 1 )) {
                    // alg7_muller(F);
                    alg5_tonelliShanks(F);
                } else if (Scalar.eq(Scalar.mod(F.p, 16), 1 )) {
                    alg4_kong(F);
                } else {
                    assert(false);
                }
            } else if (Scalar.eq(Scalar.mod(F.p, 8), 5 )) {
                alg3_atkin(F);
            } else {
                assert(false);
            }
        } else if (Scalar.eq(Scalar.mod(F.p, 4), 3 )) {
            alg2_shanks(F);
        } else {
            assert(false);
        }
    } else {
        const pm2mod4 = Scalar.mod(Scalar.pow(F.p, F.m/2), 4);
        if (pm2mod4 == 1) {
            alg10_adj(F);
        } else if (pm2mod4 == 3) {
            alg9_adj(F);
        } else {
            alg8_complex(F);
        }

    }
};


function alg7_muller(F) {
    F.sqrt_q = Scalar.pow(F.p, F.m);
    F.sqrt_2 = F.add(F.one, F.one);
    F.sqrt_4 = F.add(F.sqrt_2, F.sqrt_2);
    F.sqrt_e = Scalar.div( Scalar.sub(F.sqrt_q, 1) , 2);

    F.sqrt_bits = Scalar.bits(Scalar.div( Scalar.sub(F.sqrt_q, 1) , 4));

    F.sqrt_v = function(alfa) {
        const d = [];
        d[0] = alfa;
        d[1] = this.sub(this.square(alfa), this.sqrt_2);
        for (let j=F.sqrt_bits.length-2; j>0; j--) {
            const d0 =
                this.sub(
                    this.mul(d[0], d[1]),
                    alfa
                );
            const d1 =
                this.sub(
                    this.square( d[ 1 - F.sqrt_bits[j] ]),
                    this.sqrt_2
                );
            d[ 1 - F.sqrt_bits[j] ] = d0;
            d[ F.sqrt_bits[j] ] = d1;
/*
            d[ 1 - F.sqrt_bits[j] ] =
                this.sub(
                    this.mul(d[0], d[1]),
                    alfa
                );
            d[ F.sqrt_bits[j] ] =
                this.sub(
                    this.square( d[ 1 - F.sqrt_bits[j] ]),
                    this.sqrt_2
                );
*/
        }
        if (F.sqrt_bits[0] == 1) {
            return this.sub(
                this.mul(d[0], d[1]),
                alfa
            );
        } else {
            return this.sub(
                this.square(d[0]),
                this.sqrt_2
            );
        }
    };

    F.sqrt = function(a) {
        if (this.isZero(a)) return this.zero;
        if (this.eq(a, this.sqrt_4)) return this.sqrt_2;


        let t = this.one;
        let a1 = this.pow( this.sub(a, F.sqrt_4), F.sqrt_e);

        while (this.eq(a1, this.one)) {
            t = this.random();
            while (this.isZero(t) || this.eq(t, this.one)) {
                t = this.random();
            }

            const b = this.sub(this.mul(a, this.square(t)), this.sqrt_4);
            if (this.isZero(b)) {
                return this.mul(this.sqrt_2, this.inv(t));
            }

            a1 = this.pow(b, F.sqrt_e);
        }

        const alfa = this.sub(this.mul(a, this.square(t)), this.sqrt_2);

        const x = this.div( this.sqrt_v(alfa), t);

        const a0 = this.sub(this.square(x), a);

        if (!this.isZero(a0)) return null;

        return x;


    };
}

function alg5_tonelliShanks(F) {
    F.sqrt_q = Scalar.pow(F.p, F.m);

    F.sqrt_s = 0;
    F.sqrt_t = Scalar.sub(F.sqrt_q, 1);

    while (!Scalar.isOdd(F.sqrt_t)) {
        F.sqrt_s = F.sqrt_s + 1;
        F.sqrt_t = Scalar.div(F.sqrt_t, 2);
    }

    let c0 = F.one;

    while (F.eq(c0, F.one)) {
        const c = F.random();
        F.sqrt_z = F.pow(c, F.sqrt_t);
        c0 = F.pow(F.sqrt_z, 1 << (F.sqrt_s-1) );
    }

    F.sqrt_tm1d2 = Scalar.div(Scalar.sub(F.sqrt_t, 1),2);

    F.sqrt = function(a) {
        const F=this;
        if (F.isZero(a)) return F.zero;
        let w = F.pow(a, F.sqrt_tm1d2);
        const a0 = F.pow( F.mul(F.square(w), a), 1 << (F.sqrt_s-1) );
        if (F.eq(a0, F.negone)) return null;

        let v = F.sqrt_s;
        let x = F.mul(a, w);
        let b = F.mul(x, w);
        let z = F.sqrt_z;
        while (!F.eq(b, F.one)) {
            let b2k = F.square(b);
            let k=1;
            while (!F.eq(b2k, F.one)) {
                b2k = F.square(b2k);
                k++;
            }

            w = z;
            for (let i=0; i<v-k-1; i++) {
                w = F.square(w);
            }
            z = F.square(w);
            b = F.mul(b, z);
            x = F.mul(x, w);
            v = k;
        }
        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}

function alg4_kong(F) {
    F.sqrt = function() {
        assert(false, "Not implemented");
    };
}

function alg3_atkin(F) {
    F.sqrt = function() {
        assert(false, "Not implemented");
    };
}

function alg2_shanks(F) {

    F.sqrt_q = Scalar.pow(F.p, F.m);
    F.sqrt_e1 = Scalar.div( Scalar.sub(F.sqrt_q, 3) , 4);

    F.sqrt = function(a) {
        if (this.isZero(a)) return this.zero;

        // Test that have solution
        const a1 = this.pow(a, this.sqrt_e1);

        const a0 = this.mul(this.square(a1), a);

        if ( this.eq(a0, this.negone) ) return null;

        const x = this.mul(a1, a);

        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}

function alg10_adj(F) {
    F.sqrt = function() {
        assert(false, "Not implemented");
    };
}

function alg9_adj(F) {
    F.sqrt_q = Scalar.pow(F.p, F.m/2);
    F.sqrt_e34 = Scalar.div( Scalar.sub(F.sqrt_q, 3) , 4);
    F.sqrt_e12 = Scalar.div( Scalar.sub(F.sqrt_q, 1) , 2);

    F.frobenius = function(n, x) {
        if ((n%2) == 1) {
            return F.conjugate(x);
        } else {
            return x;
        }
    };

    F.sqrt = function(a) {
        const F = this;
        const a1 = F.pow(a, F.sqrt_e34);
        const alfa = F.mul(F.square(a1), a);
        const a0 = F.mul(F.frobenius(1, alfa), alfa);
        if (F.eq(a0, F.negone)) return null;
        const x0 = F.mul(a1, a);
        let x;
        if (F.eq(alfa, F.negone)) {
            x = F.mul(x0, [F.F.zero, F.F.one]);
        } else {
            const b = F.pow(F.add(F.one, alfa), F.sqrt_e12);
            x = F.mul(b, x0);
        }
        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}


function alg8_complex(F) {
    F.sqrt = function() {
        assert(false, "Not implemented");
    };
}
