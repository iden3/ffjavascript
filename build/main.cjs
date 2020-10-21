'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));
var os = _interopDefault(require('os'));
var NodeWorker_mod = _interopDefault(require('worker_threads'));

/* global BigInt */
const hexLen = [ 0, 1, 2, 2, 3, 3, 3, 3, 4 ,4 ,4 ,4 ,4 ,4 ,4 ,4];

function fromString(s, radix) {
    if ((!radix)||(radix==10)) {
        return BigInt(s);
    } else if (radix==16) {
        if (s.slice(0,2) == "0x") {
            return BigInt(s);
        } else {
            return BigInt("0x"+s);
        }
    }
}

const e = fromString;

function fromArray(a, radix) {
    let acc =0n;
    radix = BigInt(radix);
    for (let i=0; i<a.length; i++) {
        acc = acc*radix + BigInt(a[i]);
    }
    return acc;
}

function bitLength(a) {
    const aS =a.toString(16);
    return (aS.length-1)*4 +hexLen[parseInt(aS[0], 16)];
}

function isNegative(a) {
    return BigInt(a) < 0n;
}

function isZero(a) {
    return !a;
}

function shiftLeft(a, n) {
    return BigInt(a) << BigInt(n);
}

function shiftRight(a, n) {
    return BigInt(a) >> BigInt(n);
}

const shl = shiftLeft;
const shr = shiftRight;

function isOdd(a) {
    return (BigInt(a) & 1n) == 1n;
}


function naf(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & 1n) {
            const z = 2 - Number(E % 4n);
            res.push( z );
            E = E - BigInt(z);
        } else {
            res.push( 0 );
        }
        E = E >> 1n;
    }
    return res;
}


function bits(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & 1n) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E >> 1n;
    }
    return res;
}

function toNumber(s) {
    if (s>BigInt(Number.MAX_SAFE_INTEGER )) {
        throw new Error("Number too big");
    }
    return Number(s);
}

function toArray(s, radix) {
    const res = [];
    let rem = BigInt(s);
    radix = BigInt(radix);
    while (rem) {
        res.unshift( Number(rem % radix));
        rem = rem / radix;
    }
    return res;
}


function add(a, b) {
    return BigInt(a) + BigInt(b);
}

function sub(a, b) {
    return BigInt(a) - BigInt(b);
}

function neg(a) {
    return -BigInt(a);
}

function mul(a, b) {
    return BigInt(a) * BigInt(b);
}

function square(a) {
    return BigInt(a) * BigInt(a);
}

function pow(a, b) {
    return BigInt(a) ** BigInt(b);
}

function exp(a, b) {
    return BigInt(a) ** BigInt(b);
}

function abs(a) {
    return BigInt(a) >= 0 ? BigInt(a) : -BigInt(a);
}

function div(a, b) {
    return BigInt(a) / BigInt(b);
}

function mod(a, b) {
    return BigInt(a) % BigInt(b);
}

function eq(a, b) {
    return BigInt(a) == BigInt(b);
}

function neq(a, b) {
    return BigInt(a) != BigInt(b);
}

function lt(a, b) {
    return BigInt(a) < BigInt(b);
}

function gt(a, b) {
    return BigInt(a) > BigInt(b);
}

function leq(a, b) {
    return BigInt(a) <= BigInt(b);
}

function geq(a, b) {
    return BigInt(a) >= BigInt(b);
}

function band(a, b) {
    return BigInt(a) & BigInt(b);
}

function bor(a, b) {
    return BigInt(a) | BigInt(b);
}

function bxor(a, b) {
    return BigInt(a) ^ BigInt(b);
}

function land(a, b) {
    return BigInt(a) && BigInt(b);
}

function lor(a, b) {
    return BigInt(a) || BigInt(b);
}

function lnot(a) {
    return !BigInt(a);
}

var Scalar_native = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromString: fromString,
    e: e,
    fromArray: fromArray,
    bitLength: bitLength,
    isNegative: isNegative,
    isZero: isZero,
    shiftLeft: shiftLeft,
    shiftRight: shiftRight,
    shl: shl,
    shr: shr,
    isOdd: isOdd,
    naf: naf,
    bits: bits,
    toNumber: toNumber,
    toArray: toArray,
    add: add,
    sub: sub,
    neg: neg,
    mul: mul,
    square: square,
    pow: pow,
    exp: exp,
    abs: abs,
    div: div,
    mod: mod,
    eq: eq,
    neq: neq,
    lt: lt,
    gt: gt,
    leq: leq,
    geq: geq,
    band: band,
    bor: bor,
    bxor: bxor,
    land: land,
    lor: lor,
    lnot: lnot
});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var BigInteger = createCommonjsModule(function (module) {
var bigInt = (function (undefined$1) {

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    };
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    };
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    };

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    };


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    };
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    };

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    };

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    };

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    };
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    };

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    };

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    };

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    };

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var t = iterations === undefined$1 ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    };

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    };

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    };
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < top) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    };

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if ( module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}
});

function fromString$1(s, radix) {
    if (typeof s == "string") {
        if (s.slice(0,2) == "0x") {
            return BigInteger(s.slice(2), 16);
        } else {
            return BigInteger(s,radix);
        }
    } else {
        return BigInteger(s, radix);
    }
}

const e$1 = fromString$1;

function fromArray$1(a, radix) {
    return BigInteger.fromArray(a, radix);
}

function bitLength$1(a) {
    return BigInteger(a).bitLength();
}

function isNegative$1(a) {
    return BigInteger(a).isNegative();
}

function isZero$1(a) {
    return BigInteger(a).isZero();
}

function shiftLeft$1(a, n) {
    return BigInteger(a).shiftLeft(n);
}

function shiftRight$1(a, n) {
    return BigInteger(a).shiftRight(n);
}

const shl$1 = shiftLeft$1;
const shr$1 = shiftRight$1;

function isOdd$1(a) {
    return BigInteger(a).isOdd();
}


function naf$1(n) {
    let E = BigInteger(n);
    const res = [];
    while (E.gt(BigInteger.zero)) {
        if (E.isOdd()) {
            const z = 2 - E.mod(4).toJSNumber();
            res.push( z );
            E = E.minus(z);
        } else {
            res.push( 0 );
        }
        E = E.shiftRight(1);
    }
    return res;
}

function bits$1(n) {
    let E = BigInteger(n);
    const res = [];
    while (E.gt(BigInteger.zero)) {
        if (E.isOdd()) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E.shiftRight(1);
    }
    return res;
}

function toNumber$1(s) {
    if (!s.lt(BigInteger("9007199254740992", 10))) {
        throw new Error("Number too big");
    }
    return s.toJSNumber();
}

function toArray$1(s, radix) {
    return BigInteger(s).toArray(radix);
}

function add$1(a, b) {
    return BigInteger(a).add(BigInteger(b));
}

function sub$1(a, b) {
    return BigInteger(a).minus(BigInteger(b));
}

function neg$1(a) {
    return BigInteger.zero.minus(BigInteger(a));
}

function mul$1(a, b) {
    return BigInteger(a).times(BigInteger(b));
}

function square$1(a) {
    return BigInteger(a).square();
}

function pow$1(a, b) {
    return BigInteger(a).pow(BigInteger(b));
}

function exp$1(a, b) {
    return BigInteger(a).pow(BigInteger(b));
}

function abs$1(a) {
    return BigInteger(a).abs();
}

function div$1(a, b) {
    return BigInteger(a).divide(BigInteger(b));
}

function mod$1(a, b) {
    return BigInteger(a).mod(BigInteger(b));
}

function eq$1(a, b) {
    return BigInteger(a).eq(BigInteger(b));
}

function neq$1(a, b) {
    return BigInteger(a).neq(BigInteger(b));
}

function lt$1(a, b) {
    return BigInteger(a).lt(BigInteger(b));
}

function gt$1(a, b) {
    return BigInteger(a).gt(BigInteger(b));
}

function leq$1(a, b) {
    return BigInteger(a).leq(BigInteger(b));
}

function geq$1(a, b) {
    return BigInteger(a).geq(BigInteger(b));
}

function band$1(a, b) {
    return BigInteger(a).and(BigInteger(b));
}

function bor$1(a, b) {
    return BigInteger(a).or(BigInteger(b));
}

function bxor$1(a, b) {
    return BigInteger(a).xor(BigInteger(b));
}

function land$1(a, b) {
    return (!BigInteger(a).isZero()) && (!BigInteger(b).isZero());
}

function lor$1(a, b) {
    return (!BigInteger(a).isZero()) || (!BigInteger(b).isZero());
}

function lnot$1(a) {
    return BigInteger(a).isZero();
}

var Scalar_bigint = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromString: fromString$1,
    e: e$1,
    fromArray: fromArray$1,
    bitLength: bitLength$1,
    isNegative: isNegative$1,
    isZero: isZero$1,
    shiftLeft: shiftLeft$1,
    shiftRight: shiftRight$1,
    shl: shl$1,
    shr: shr$1,
    isOdd: isOdd$1,
    naf: naf$1,
    bits: bits$1,
    toNumber: toNumber$1,
    toArray: toArray$1,
    add: add$1,
    sub: sub$1,
    neg: neg$1,
    mul: mul$1,
    square: square$1,
    pow: pow$1,
    exp: exp$1,
    abs: abs$1,
    div: div$1,
    mod: mod$1,
    eq: eq$1,
    neq: neq$1,
    lt: lt$1,
    gt: gt$1,
    leq: leq$1,
    geq: geq$1,
    band: band$1,
    bor: bor$1,
    bxor: bxor$1,
    land: land$1,
    lor: lor$1,
    lnot: lnot$1
});

const supportsNativeBigInt = typeof BigInt === "function";

let Scalar = {};
if (supportsNativeBigInt) {
    Object.assign(Scalar, Scalar_native);
} else {
    Object.assign(Scalar, Scalar_bigint);
}


// Returns a buffer with Little Endian Representation
Scalar.toRprLE = function rprBE(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new Uint32Array(buff.buffer, o, n8/4);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v[i] = parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16);
    for (let i=l; i<v.length; i++) v[i] = 0;
    for (let i=v.length*4; i<n8; i++) buff[i] = Scalar.toNumber(Scalar.band(Scalar.shiftRight(e, i*8), 0xFF));
};

// Returns a buffer with Big Endian Representation
Scalar.toRprBE = function rprLEM(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v.setUint32(n8-i*4 -4, parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16), false);
    for (let i=0; i<n8/4-l; i++) v[i] = 0;
};

// Pases a buffer with Little Endian Representation
Scalar.fromRprLE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    const v = new Uint32Array(buff.buffer, o, n8/4);
    const a = new Array(n8/4);
    v.forEach( (ch,i) => a[a.length-i-1] = ch.toString(16).padStart(8,"0") );
    return Scalar.fromString(a.join(""), 16);
};

// Pases a buffer with Big Endian Representation
Scalar.fromRprBE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const a = new Array(n8/4);
    for (let i=0; i<n8/4; i++) {
        a[i] = v.getUint32(i*4, false).toString(16).padStart(8, "0");
    }
    return Scalar.fromString(a.join(""), 16);
};

Scalar.toString = function toString(a, radix) {
    return a.toString(radix);
};

Scalar.toLEBuff = function toLEBuff(a) {
    const buff = new Uint8Array(Math.floor((Scalar.bitLength(a) - 1) / 8) +1);
    Scalar.toRprLE(buff, 0, a, buff.byteLength);
    return buff;
};


Scalar.zero = Scalar.e(0);
Scalar.one = Scalar.e(1);

let {
    toRprLE,
    toRprBE,
    fromRprLE,
    fromRprBE,
    toString,
    toLEBuff,
    zero,
    one,
    fromString: fromString$2,
    e: e$2,
    fromArray: fromArray$2,
    bitLength: bitLength$2,
    isNegative: isNegative$2,
    isZero: isZero$2,
    shiftLeft: shiftLeft$2,
    shiftRight: shiftRight$2,
    shl: shl$2,
    shr: shr$2,
    isOdd: isOdd$2,
    naf: naf$2,
    bits: bits$2,
    toNumber: toNumber$2,
    toArray: toArray$2,
    add: add$2,
    sub: sub$2,
    neg: neg$2,
    mul: mul$2,
    square: square$2,
    pow: pow$2,
    exp: exp$2,
    abs: abs$2,
    div: div$2,
    mod: mod$2,
    eq: eq$2,
    neq: neq$2,
    lt: lt$2,
    gt: gt$2,
    leq: leq$2,
    geq: geq$2,
    band: band$2,
    bor: bor$2,
    bxor: bxor$2,
    land: land$2,
    lor: lor$2,
    lnot: lnot$2,
} = Scalar;

var _Scalar = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toRprLE: toRprLE,
    toRprBE: toRprBE,
    fromRprLE: fromRprLE,
    fromRprBE: fromRprBE,
    toString: toString,
    toLEBuff: toLEBuff,
    zero: zero,
    one: one,
    fromString: fromString$2,
    e: e$2,
    fromArray: fromArray$2,
    bitLength: bitLength$2,
    isNegative: isNegative$2,
    isZero: isZero$2,
    shiftLeft: shiftLeft$2,
    shiftRight: shiftRight$2,
    shl: shl$2,
    shr: shr$2,
    isOdd: isOdd$2,
    naf: naf$2,
    bits: bits$2,
    toNumber: toNumber$2,
    toArray: toArray$2,
    add: add$2,
    sub: sub$2,
    neg: neg$2,
    mul: mul$2,
    square: square$2,
    pow: pow$2,
    exp: exp$2,
    abs: abs$2,
    div: div$2,
    mod: mod$2,
    eq: eq$2,
    neq: neq$2,
    lt: lt$2,
    gt: gt$2,
    leq: leq$2,
    geq: geq$2,
    band: band$2,
    bor: bor$2,
    bxor: bxor$2,
    land: land$2,
    lor: lor$2,
    lnot: lnot$2
});

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

/*
    This library does operations on polynomials with coefficients in a field F.

    A polynomial P(x) = p0 + p1 * x + p2 * x^2 + ... + pn * x^n  is represented
    by the array [ p0, p1, p2, ... , pn ].
 */

class PolField {
    constructor (F) {
        this.F = F;

        let rem = F.sqrt_t;
        let s = F.sqrt_s;

        const five = this.F.add(this.F.add(this.F.two, this.F.two), this.F.one);

        this.w = new Array(s+1);
        this.wi = new Array(s+1);
        this.w[s] = this.F.pow(five, rem);
        this.wi[s] = this.F.inv(this.w[s]);

        let n=s-1;
        while (n>=0) {
            this.w[n] = this.F.square(this.w[n+1]);
            this.wi[n] = this.F.square(this.wi[n+1]);
            n--;
        }


        this.roots = [];
/*        for (let i=0; i<16; i++) {
            let r = this.F.one;
            n = 1 << i;
            const rootsi = new Array(n);
            for (let j=0; j<n; j++) {
                rootsi[j] = r;
                r = this.F.mul(r, this.w[i]);
            }

            this.roots.push(rootsi);
        }
    */
        this._setRoots(15);
    }

    _setRoots(n) {
        if (n > this.F.sqrt_s) n = this.s;
        for (let i=n; (i>=0) && (!this.roots[i]); i--) {
            let r = this.F.one;
            const nroots = 1 << i;
            const rootsi = new Array(nroots);
            for (let j=0; j<nroots; j++) {
                rootsi[j] = r;
                r = this.F.mul(r, this.w[i]);
            }
            this.roots[i] = rootsi;
        }
    }

    add(a, b) {
        const m = Math.max(a.length, b.length);
        const res = new Array(m);
        for (let i=0; i<m; i++) {
            res[i] = this.F.add(a[i] || this.F.zero, b[i] || this.F.zero);
        }
        return this.reduce(res);
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        const m = Math.max(a.length, b.length);
        const res = new Array(m);
        for (let i=0; i<m; i++) {
            res[i] = this.F.sub(a[i] || this.F.zero, b[i] || this.F.zero);
        }
        return this.reduce(res);
    }

    mulScalar(p, b) {
        if (this.F.eq(b, this.F.zero)) return [];
        if (this.F.eq(b, this.F.one)) return p;
        const res = new Array(p.length);
        for (let i=0; i<p.length; i++) {
            res[i] = this.F.mul(p[i], b);
        }
        return res;
    }



    mul(a, b) {
        if (a.length == 0) return [];
        if (b.length == 0) return [];
        if (a.length == 1) return this.mulScalar(b, a[0]);
        if (b.length == 1) return this.mulScalar(a, b[0]);

        if (b.length > a.length) {
            [b, a] = [a, b];
        }

        if ((b.length <= 2) || (b.length < log2(a.length))) {
            return this.mulNormal(a,b);
        } else {
            return this.mulFFT(a,b);
        }
    }

    mulNormal(a, b) {
        let res = [];
        for (let i=0; i<b.length; i++) {
            res = this.add(res, this.scaleX(this.mulScalar(a, b[i]), i) );
        }
        return res;
    }

    mulFFT(a,b) {
        const longestN = Math.max(a.length, b.length);
        const bitsResult = log2(longestN-1)+2;
        this._setRoots(bitsResult);

        const m = 1 << bitsResult;
        const ea = this.extend(a,m);
        const eb = this.extend(b,m);

        const ta = __fft(this, ea, bitsResult, 0, 1);
        const tb = __fft(this, eb, bitsResult, 0, 1);

        const tres = new Array(m);

        for (let i=0; i<m; i++) {
            tres[i] = this.F.mul(ta[i], tb[i]);
        }

        const res = __fft(this, tres, bitsResult, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return this.reduce(resn);
    }



    square(a) {
        return this.mul(a,a);
    }

    scaleX(p, n) {
        if (n==0) {
            return p;
        } else if (n>0) {
            const z = new Array(n).fill(this.F.zero);
            return z.concat(p);
        } else {
            if (-n >= p.length) return [];
            return p.slice(-n);
        }
    }

    eval2(p, x) {
        let v = this.F.zero;
        let ix = this.F.one;
        for (let i=0; i<p.length; i++) {
            v = this.F.add(v, this.F.mul(p[i], ix));
            ix = this.F.mul(ix, x);
        }
        return v;
    }

    eval(p,x) {
        const F = this.F;
        if (p.length == 0) return F.zero;
        const m = this._next2Power(p.length);
        const ep = this.extend(p, m);

        return _eval(ep, x, 0, 1, m);

        function _eval(p, x, offset, step, n) {
            if (n==1) return p[offset];
            const newX = F.square(x);
            const res= F.add(
                _eval(p, newX, offset, step << 1, n >> 1),
                F.mul(
                    x,
                    _eval(p, newX, offset+step , step << 1, n >> 1)));
            return res;
        }
    }

    lagrange(points) {
        let roots = [this.F.one];
        for (let i=0; i<points.length; i++) {
            roots = this.mul(roots, [this.F.neg(points[i][0]), this.F.one]);
        }

        let sum = [];
        for (let i=0; i<points.length; i++) {
            let mpol = this.ruffini(roots, points[i][0]);
            const factor =
                this.F.mul(
                    this.F.inv(this.eval(mpol, points[i][0])),
                    points[i][1]);
            mpol = this.mulScalar(mpol, factor);
            sum = this.add(sum, mpol);
        }
        return sum;
    }


    fft(p) {
        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res = __fft(this, ep, bits, 0, 1);
        return res;
    }

    fft2(p) {
        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res = __fft2(this, ep, bits);
        return res;
    }


    ifft(p) {

        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res =  __fft(this, ep, bits, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }


    ifft2(p) {

        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res =  __fft2(this, ep, bits);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }

    _fft(pall, bits, offset, step) {

        const n = 1 << bits;
        if (n==1) {
            return [ pall[offset] ];
        }

        const ndiv2 = n >> 1;
        const p1 = this._fft(pall, bits-1, offset, step*2);
        const p2 = this._fft(pall, bits-1, offset+step, step*2);

        const out = new Array(n);

        let m= this.F.one;
        for (let i=0; i<ndiv2; i++) {
            out[i] = this.F.add(p1[i], this.F.mul(m, p2[i]));
            out[i+ndiv2] = this.F.sub(p1[i], this.F.mul(m, p2[i]));
            m = this.F.mul(m, this.w[bits]);
        }

        return out;
    }

    extend(p, e) {
        if (e == p.length) return p;
        const z = new Array(e-p.length).fill(this.F.zero);

        return p.concat(z);
    }

    reduce(p) {
        if (p.length == 0) return p;
        if (! this.F.eq(p[p.length-1], this.F.zero) ) return p;
        let i=p.length-1;
        while( i>0 && this.F.eq(p[i], this.F.zero) ) i--;
        return p.slice(0, i+1);
    }

    eq(a, b) {
        const pa = this.reduce(a);
        const pb = this.reduce(b);

        if (pa.length != pb.length) return false;
        for (let i=0; i<pb.length; i++) {
            if (!this.F.eq(pa[i], pb[i])) return false;
        }

        return true;
    }

    ruffini(p, r) {
        const res = new Array(p.length-1);
        res[res.length-1] = p[p.length-1];
        for (let i = res.length-2; i>=0; i--) {
            res[i] = this.F.add(this.F.mul(res[i+1], r), p[i+1]);
        }
        return res;
    }

    _next2Power(v) {
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        v++;
        return v;
    }

    toString(p) {
        const ap = this.normalize(p);
        let S = "";
        for (let i=ap.length-1; i>=0; i--) {
            if (!this.F.eq(p[i], this.F.zero)) {
                if (S!="") S += " + ";
                S = S + p[i].toString(10);
                if (i>0) {
                    S = S + "x";
                    if (i>1) {
                        S = S + "^" +i;
                    }
                }
            }
        }
        return S;
    }

    normalize(p) {
        const res  = new Array(p.length);
        for (let i=0; i<p.length; i++) {
            res[i] = this.F.normalize(p[i]);
        }
        return res;
    }


    _reciprocal(p, bits) {
        const k = 1 << bits;
        if (k==1) {
            return [ this.F.inv(p[0]) ];
        }
        const np = this.scaleX(p, -k/2);
        const q = this._reciprocal(np, bits-1);
        const a = this.scaleX(this.double(q), 3*k/2-2);
        const b = this.mul( this.square(q), p);

        return this.scaleX(this.sub(a,b),   -(k-2));
    }

    // divides x^m / v
    _div2(m, v) {
        const kbits = log2(v.length-1)+1;
        const k = 1 << kbits;

        const scaleV = k - v.length;

        // rec = x^(k - 2) / v* x^scaleV =>
        // rec = x^(k-2-scaleV)/ v
        //
        // res = x^m/v = x^(m + (2*k-2 - scaleV) - (2*k-2 - scaleV)) /v =>
        // res = rec * x^(m - (2*k-2 - scaleV)) =>
        // res = rec * x^(m - 2*k + 2 + scaleV)

        const rec = this._reciprocal(this.scaleX(v, scaleV), kbits);
        const res = this.scaleX(rec, m - 2*k + 2 + scaleV);

        return res;
    }

    div(_u, _v) {
        if (_u.length < _v.length) return [];
        const kbits = log2(_v.length-1)+1;
        const k = 1 << kbits;

        const u = this.scaleX(_u, k-_v.length);
        const v = this.scaleX(_v, k-_v.length);

        const n = v.length-1;
        let m = u.length-1;

        const s = this._reciprocal(v, kbits);
        let t;
        if (m>2*n) {
            t = this.sub(this.scaleX([this.F.one], 2*n), this.mul(s, v));
        }

        let q = [];
        let rem = u;
        let us, ut;
        let finish = false;

        while (!finish) {
            us = this.mul(rem, s);
            q = this.add(q, this.scaleX(us, -2*n));

            if ( m > 2*n ) {
                ut = this.mul(rem, t);
                rem = this.scaleX(ut, -2*n);
                m = rem.length-1;
            } else {
                finish = true;
            }
        }

        return q;
    }


    // returns the ith nth-root of one
    oneRoot(n, i) {
        let nbits = log2(n-1)+1;
        let res = this.F.one;
        let r = i;

        if(i>=n) {
            throw new Error("Given 'i' should be lower than 'n'");
        }
        else if (1<<nbits !== n) {
            throw new Error(`Internal errlr: ${n} should equal ${1<<nbits}`);
        }

        while (r>0) {
            if (r & 1 == 1) {
                res = this.F.mul(res, this.w[nbits]);
            }
            r = r >> 1;
            nbits --;
        }
        return res;
    }

    computeVanishingPolinomial(bits, t) {
        const m = 1 << bits;
        return this.F.sub(this.F.pow(t, m), this.F.one);
    }

    evaluateLagrangePolynomials(bits, t) {
        const m= 1 << bits;
        const tm = this.F.pow(t, m);
        const u= new Array(m).fill(this.F.zero);
        this._setRoots(bits);
        const omega = this.w[bits];

        if (this.F.eq(tm, this.F.one)) {
            for (let i = 0; i < m; i++) {
                if (this.F.eq(this.roots[bits][0],t)) { // i.e., t equals omega^i
                    u[i] = this.F.one;
                    return u;
                }
            }
        }

        const z = this.F.sub(tm, this.F.one);
        //        let l = this.F.mul(z,  this.F.pow(this.F.twoinv, m));
        let l = this.F.mul(z,  this.F.inv(this.F.e(m)));
        for (let i = 0; i < m; i++) {
            u[i] = this.F.mul(l, this.F.inv(this.F.sub(t,this.roots[bits][i])));
            l = this.F.mul(l, omega);
        }

        return u;
    }

    log2(V) {
        return log2(V);
    }
}

function log2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
}


function __fft(PF, pall, bits, offset, step) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[offset] ];
    } else if (n==2) {
        return [
            PF.F.add(pall[offset], pall[offset + step]),
            PF.F.sub(pall[offset], pall[offset + step])];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft(PF, pall, bits-1, offset, step*2);
    const p2 = __fft(PF, pall, bits-1, offset+step, step*2);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
        out[i+ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
    }

    return out;
}


function __fft2(PF, pall, bits) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[0] ];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft2(PF, pall.slice(0, ndiv2), bits-1);
    const p2 = __fft2(PF, pall.slice(ndiv2), bits-1);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
        out[i+ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
    }

    return out;
}

const _revTable = [];
for (let i=0; i<256; i++) {
    _revTable[i] = _revSlow(i, 8);
}

function _revSlow(idx, bits) {
    let res =0;
    let a = idx;
    for (let i=0; i<bits; i++) {
        res <<= 1;
        res = res | (a &1);
        a >>=1;
    }
    return res;
}

function rev(idx, bits) {
    return (
        _revTable[idx >>> 24] |
        (_revTable[(idx >>> 16) & 0xFF] << 8) |
        (_revTable[(idx >>> 8) & 0xFF] << 16) |
        (_revTable[idx & 0xFF] << 24)
    ) >>> (32-bits);
}

function __bitReverse(p, bits) {
    for (let k=0; k<p.length; k++) {
        const r = rev(k, bits);
        if (r>k) {
            const tmp= p[k];
            p[k] = p[r];
            p[r] = tmp;
        }
    }

}

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


function mulScalar(F, base, e) {
    let res;

    if (isZero$2(e)) return F.zero;

    const n = naf$2(e);

    if (n[n.length-1] == 1) {
        res = base;
    } else if (n[n.length-1] == -1) {
        res = F.neg(base);
    } else {
        throw new Error("invlaud NAF");
    }

    for (let i=n.length-2; i>=0; i--) {

        res = F.double(res);

        if (n[i] == 1) {
            res = F.add(res, base);
        } else if (n[i] == -1) {
            res = F.sub(res, base);
        }
    }

    return res;
}


/*
exports.mulScalar = (F, base, e) =>{
    let res = F.zero;
    let rem = bigInt(e);
    let exp = base;

    while (! rem.eq(bigInt.zero)) {
        if (rem.and(bigInt.one).eq(bigInt.one)) {
            res = F.add(res, exp);
        }
        exp = F.double(exp);
        rem = rem.shiftRight(1);
    }

    return res;
};
*/


function exp$3(F, base, e) {

    if (isZero$2(e)) return F.one;

    const n = bits$2(e);

    if (n.legth==0) return F.one;

    let res = base;

    for (let i=n.length-2; i>=0; i--) {

        res = F.square(res);

        if (n[i]) {
            res = F.mul(res, base);
        }
    }

    return res;
}

// Check here: https://eprint.iacr.org/2012/685.pdf

function buildSqrt (F) {
    if ((F.m % 2) == 1) {
        if (eq$2(mod$2(F.p, 4), 1 )) {
            if (eq$2(mod$2(F.p, 8), 1 )) {
                if (eq$2(mod$2(F.p, 16), 1 )) {
                    // alg7_muller(F);
                    alg5_tonelliShanks(F);
                } else if (eq$2(mod$2(F.p, 16), 9 )) {
                    alg4_kong(F);
                } else {
                    throw new Error("Field withot sqrt");
                }
            } else if (eq$2(mod$2(F.p, 8), 5 )) {
                alg3_atkin(F);
            } else {
                throw new Error("Field withot sqrt");
            }
        } else if (eq$2(mod$2(F.p, 4), 3 )) {
            alg2_shanks(F);
        }
    } else {
        const pm2mod4 = mod$2(pow$2(F.p, F.m/2), 4);
        if (pm2mod4 == 1) {
            alg10_adj(F);
        } else if (pm2mod4 == 3) {
            alg9_adj(F);
        } else {
            alg8_complex(F);
        }

    }
}


function alg5_tonelliShanks(F) {
    F.sqrt_q = pow$2(F.p, F.m);

    F.sqrt_s = 0;
    F.sqrt_t = sub$2(F.sqrt_q, 1);

    while (!isOdd$2(F.sqrt_t)) {
        F.sqrt_s = F.sqrt_s + 1;
        F.sqrt_t = div$2(F.sqrt_t, 2);
    }

    let c0 = F.one;

    while (F.eq(c0, F.one)) {
        const c = F.random();
        F.sqrt_z = F.pow(c, F.sqrt_t);
        c0 = F.pow(F.sqrt_z, 2 ** (F.sqrt_s-1) );
    }

    F.sqrt_tm1d2 = div$2(sub$2(F.sqrt_t, 1),2);

    F.sqrt = function(a) {
        const F=this;
        if (F.isZero(a)) return F.zero;
        let w = F.pow(a, F.sqrt_tm1d2);
        const a0 = F.pow( F.mul(F.square(w), a), 2 ** (F.sqrt_s-1) );
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
        throw new Error("Sqrt alg 4 not implemented");
    };
}

function alg3_atkin(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 3 not implemented");
    };
}

function alg2_shanks(F) {

    F.sqrt_q = pow$2(F.p, F.m);
    F.sqrt_e1 = div$2( sub$2(F.sqrt_q, 3) , 4);

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
        throw new Error("Sqrt alg 10 not implemented");
    };
}

function alg9_adj(F) {
    F.sqrt_q = pow$2(F.p, F.m/2);
    F.sqrt_e34 = div$2( sub$2(F.sqrt_q, 3) , 4);
    F.sqrt_e12 = div$2( sub$2(F.sqrt_q, 1) , 2);

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
        throw new Error("Sqrt alg 8 not implemented");
    };
}

function quarterRound(st, a, b, c, d) {

    st[a] = (st[a] + st[b]) >>> 0;
    st[d] = (st[d] ^ st[a]) >>> 0;
    st[d] = ((st[d] << 16) | ((st[d]>>>16) & 0xFFFF)) >>> 0;

    st[c] = (st[c] + st[d]) >>> 0;
    st[b] = (st[b] ^ st[c]) >>> 0;
    st[b] = ((st[b] << 12) | ((st[b]>>>20) & 0xFFF)) >>> 0;

    st[a] = (st[a] + st[b]) >>> 0;
    st[d] = (st[d] ^ st[a]) >>> 0;
    st[d] = ((st[d] << 8) | ((st[d]>>>24) & 0xFF)) >>> 0;

    st[c] = (st[c] + st[d]) >>> 0;
    st[b] = (st[b] ^ st[c]) >>> 0;
    st[b] = ((st[b] << 7) | ((st[b]>>>25) & 0x7F)) >>> 0;
}

function doubleRound(st) {
    quarterRound(st, 0, 4, 8,12);
    quarterRound(st, 1, 5, 9,13);
    quarterRound(st, 2, 6,10,14);
    quarterRound(st, 3, 7,11,15);

    quarterRound(st, 0, 5,10,15);
    quarterRound(st, 1, 6,11,12);
    quarterRound(st, 2, 7, 8,13);
    quarterRound(st, 3, 4, 9,14);
}

class ChaCha {

    constructor(seed) {
        seed = seed || [0,0,0,0,0,0,0,0];
        this.state = [
            0x61707865,
            0x3320646E,
            0x79622D32,
            0x6B206574,
            seed[0],
            seed[1],
            seed[2],
            seed[3],
            seed[4],
            seed[5],
            seed[6],
            seed[7],
            0,
            0,
            0,
            0
        ];
        this.idx = 16;
        this.buff = new Array(16);
    }

    nextU32() {
        if (this.idx == 16) this.update();
        return this.buff[this.idx++];
    }

    nextU64() {
        return add$2(mul$2(this.nextU32(), 0x100000000), this.nextU32());
    }

    nextBool() {
        return (this.nextU32() & 1) == 1;
    }

    update() {
        // Copy the state
        for (let i=0; i<16; i++) this.buff[i] = this.state[i];

        // Apply the rounds
        for (let i=0; i<10; i++) doubleRound(this.buff);

        // Add to the initial
        for (let i=0; i<16; i++) this.buff[i] = (this.buff[i] + this.state[i]) >>> 0;

        this.idx = 0;

        this.state[12] = (this.state[12] + 1) >>> 0;
        if (this.state[12] != 0) return;
        this.state[13] = (this.state[13] + 1) >>> 0;
        if (this.state[13] != 0) return;
        this.state[14] = (this.state[14] + 1) >>> 0;
        if (this.state[14] != 0) return;
        this.state[15] = (this.state[15] + 1) >>> 0;
    }
}

/* global window */

function getRandomBytes(n) {
    let array = new Uint8Array(n);
    if (typeof window !== "undefined") { // Browser
        if (typeof window.crypto !== "undefined") { // Supported
            window.crypto.getRandomValues(array);
        } else { // fallback
            for (let i=0; i<n; i++) {
                array[i] = (Math.random()*4294967296)>>>0;
            }
        }
    }
    else { // NodeJS
        crypto.randomFillSync(array);
    }
    return array;
}

function getRandomSeed() {
    const arr = getRandomBytes(32);
    const arrV = new Uint32Array(arr.buffer);
    const seed = [];
    for (let i=0; i<8; i++) {
        seed.push(arrV[i]);
    }
    return seed;
}

let threadRng = null;

function getThreadRng() {
    if (threadRng) return threadRng;
    threadRng = new ChaCha(getRandomSeed());
    return threadRng;
}

/* global BigInt */

class ZqField {
    constructor(p) {
        this.type="F1";
        this.one = 1n;
        this.zero = 0n;
        this.p = BigInt(p);
        this.m = 1;
        this.negone = this.p-1n;
        this.two = 2n;
        this.half = this.p >> 1n;
        this.bitLength = bitLength$2(this.p);
        this.mask = (1n << BigInt(this.bitLength)) - 1n;

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = this.e(1n << BigInt(this.n64*64));
        this.Ri = this.inv(this.R);

        const e = this.negone >> 1n;
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.nqr + 1n;
            r = this.pow(this.nqr, e);
        }


        this.s = 0;
        this.t = this.negone;

        while ((this.t & 1n) == 0n) {
            this.s = this.s + 1;
            this.t = this.t >> 1n;
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);
    }

    e(a,b) {
        let res;
        if (!b) {
            res = BigInt(a);
        } else if (b==16) {
            res = BigInt("0x"+a);
        }
        if (res < 0) {
            let nres = -res;
            if (nres >= this.p) nres = nres % this.p;
            return this.p - nres;
        } else {
            return (res>= this.p) ? res%this.p : res;
        }

    }

    add(a, b) {
        const res = a + b;
        return res >= this.p ? res-this.p : res;
    }

    sub(a, b) {
        return (a >= b) ? a-b : this.p-b+a;
    }

    neg(a) {
        return a ? this.p-a : a;
    }

    mul(a, b) {
        return (a*b)%this.p;
    }

    mulScalar(base, s) {
        return (base * this.e(s)) % this.p;
    }

    square(a) {
        return (a*a) % this.p;
    }

    eq(a, b) {
        return a==b;
    }

    neq(a, b) {
        return a!=b;
    }

    lt(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa < bb;
    }

    gt(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa > bb;
    }

    leq(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa <= bb;
    }

    geq(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa >= bb;
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    idiv(a, b) {
        if (!b) throw new Error("Division by zero");
        return a / b;
    }

    inv(a) {
        if (!a) throw new Error("Division by zero");

        let t = 0n;
        let r = this.p;
        let newt = 1n;
        let newr = a % this.p;
        while (newr) {
            let q = r/newr;
            [t, newt] = [newt, t-q*newt];
            [r, newr] = [newr, r-q*newr];
        }
        if (t<0n) t += this.p;
        return t;
    }

    mod(a, b) {
        return a % b;
    }

    pow(b, e) {
        return exp$3(this, b, e);
    }

    exp(b, e) {
        return exp$3(this, b, e);
    }

    band(a, b) {
        const res =  ((a & b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bor(a, b) {
        const res =  ((a | b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bxor(a, b) {
        const res =  ((a ^ b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bnot(a) {
        const res = a ^ this.mask;
        return res >= this.p ? res-this.p : res;
    }

    shl(a, b) {
        if (Number(b) < this.bitLength) {
            const res = (a << b) & this.mask;
            return res >= this.p ? res-this.p : res;
        } else {
            const nb = this.p - b;
            if (Number(nb) < this.bitLength) {
                return a >> nb;
            } else {
                return 0n;
            }
        }
    }

    shr(a, b) {
        if (Number(b) < this.bitLength) {
            return a >> b;
        } else {
            const nb = this.p - b;
            if (Number(nb) < this.bitLength) {
                const res = (a << nb) & this.mask;
                return res >= this.p ? res-this.p : res;
            } else {
                return 0;
            }
        }
    }

    land(a, b) {
        return (a && b) ? 1n : 0n;
    }

    lor(a, b) {
        return (a || b) ? 1n : 0n;
    }

    lnot(a) {
        return (a) ? 0n : 1n;
    }

    sqrt_old(n) {

        if (n == 0n) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone >> this.one);
        if ( res != 1n ) return null;

        let m = this.s;
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one) >> 1n );

        while ( t != 1n ) {
            let sq = this.square(t);
            let i = 1;
            while (sq != 1n ) {
                i++;
                sq = this.square(sq);
            }

            // b = c ^ m-i-1
            let b = c;
            for (let j=0; j< m-i-1; j ++) b = this.square(b);

            m = i;
            c = this.square(b);
            t = this.mul(t, c);
            r = this.mul(r, b);
        }

        if (r > (this.p >> 1n)) {
            r = this.neg(r);
        }

        return r;
    }

    normalize(a, b) {
        a = BigInt(a,b);
        if (a < 0) {
            let na = -a;
            if (na >= this.p) na = na % this.p;
            return this.p - na;
        } else {
            return (a>= this.p) ? a%this.p : a;
        }
    }

    random() {
        const nBytes = (this.bitLength*2 / 8);
        let res =0n;
        for (let i=0; i<nBytes; i++) {
            res = (res << 8n) + BigInt(getRandomBytes(1)[0]);
        }
        return res % this.p;
    }

    toString(a, base) {
        let vs;
        if (a > this.half) {
            const v = this.p-a;
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }
        return vs;
    }

    isZero(a) {
        return a == 0n;
    }

    fromRng(rng) {
        let v;
        do {
            v=0n;
            for (let i=0; i<this.n64; i++) {
                v += rng.nextU64() << BigInt(64 *i);
            }
            v &= this.mask;
        } while (v >= this.p);
        v = (v * this.Ri) % this.p;   // Convert from montgomery
        return v;
    }

}

class ZqField$1 {
    constructor(p) {
        this.type="F1";
        this.one = BigInteger.one;
        this.zero = BigInteger.zero;
        this.p = BigInteger(p);
        this.m = 1;
        this.negone = this.p.minus(BigInteger.one);
        this.two = BigInteger(2);
        this.half = this.p.shiftRight(1);
        this.bitLength = this.p.bitLength();
        this.mask = BigInteger.one.shiftLeft(this.bitLength).minus(BigInteger.one);

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = BigInteger.one.shiftLeft(this.n64*64);
        this.Ri = this.inv(this.R);

        const e = this.negone.shiftRight(this.one);
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!r.equals(this.negone)) {
            this.nqr = this.nqr.add(this.one);
            r = this.pow(this.nqr, e);
        }

        this.s = this.zero;
        this.t = this.negone;

        while (!this.t.isOdd()) {
            this.s = this.s.add(this.one);
            this.t = this.t.shiftRight(this.one);
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);
    }

    e(a,b) {

        const res = BigInteger(a,b);

        return this.normalize(res);

    }

    add(a, b) {
        let res = a.add(b);
        if (res.geq(this.p)) {
            res = res.minus(this.p);
        }
        return res;
    }

    sub(a, b) {
        if (a.geq(b)) {
            return a.minus(b);
        } else {
            return this.p.minus(b.minus(a));
        }
    }

    neg(a) {
        if (a.isZero()) return a;
        return this.p.minus(a);
    }

    mul(a, b) {
        return a.times(b).mod(this.p);
    }

    mulScalar(base, s) {
        return base.times(BigInteger(s)).mod(this.p);
    }

    square(a) {
        return a.square().mod(this.p);
    }

    eq(a, b) {
        return a.eq(b);
    }

    neq(a, b) {
        return a.neq(b);
    }

    lt(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.lt(bb);
    }

    gt(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.gt(bb);
    }

    leq(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.leq(bb);
    }

    geq(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.geq(bb);
    }

    div(a, b) {
        if (b.isZero()) throw new Error("Division by zero");
        return a.times(b.modInv(this.p)).mod(this.p);
    }

    idiv(a, b) {
        if (b.isZero()) throw new Error("Division by zero");
        return a.divide(b);
    }

    inv(a) {
        if (a.isZero()) throw new Error("Division by zero");
        return a.modInv(this.p);
    }

    mod(a, b) {
        return a.mod(b);
    }

    pow(a, b) {
        return a.modPow(b, this.p);
    }

    exp(a, b) {
        return a.modPow(b, this.p);
    }

    band(a, b) {
        return a.and(b).and(this.mask).mod(this.p);
    }

    bor(a, b) {
        return a.or(b).and(this.mask).mod(this.p);
    }

    bxor(a, b) {
        return a.xor(b).and(this.mask).mod(this.p);
    }

    bnot(a) {
        return a.xor(this.mask).mod(this.p);
    }

    shl(a, b) {
        if (b.lt(this.bitLength)) {
            return a.shiftLeft(b).and(this.mask).mod(this.p);
        } else {
            const nb = this.p.minus(b);
            if (nb.lt(this.bitLength)) {
                return this.shr(a, nb);
            } else {
                return BigInteger.zero;
            }
        }
    }

    shr(a, b) {
        if (b.lt(this.bitLength)) {
            return a.shiftRight(b);
        } else {
            const nb = this.p.minus(b);
            if (nb.lt(this.bitLength)) {
                return this.shl(a, nb);
            } else {
                return BigInteger.zero;
            }
        }
    }

    land(a, b) {
        return (a.isZero() || b.isZero()) ? BigInteger.zero : BigInteger.one;
    }

    lor(a, b) {
        return (a.isZero() && b.isZero()) ? BigInteger.zero : BigInteger.one;
    }

    lnot(a) {
        return a.isZero() ? BigInteger.one : BigInteger.zero;
    }

    sqrt_old(n) {

        if (n.equals(this.zero)) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone.shiftRight(this.one));
        if (!res.equals(this.one)) return null;

        let m = parseInt(this.s);
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one).shiftRight(this.one) );

        while (!t.equals(this.one)) {
            let sq = this.square(t);
            let i = 1;
            while (!sq.equals(this.one)) {
                i++;
                sq = this.square(sq);
            }

            // b = c ^ m-i-1
            let b = c;
            for (let j=0; j< m-i-1; j ++) b = this.square(b);

            m = i;
            c = this.square(b);
            t = this.mul(t, c);
            r = this.mul(r, b);
        }

        if (r.greater(this.p.shiftRight(this.one))) {
            r = this.neg(r);
        }

        return r;
    }

    normalize(a) {
        a = BigInteger(a);
        if (a.isNegative()) {
            return this.p.minus(a.abs().mod(this.p));
        } else {
            return a.mod(this.p);
        }
    }

    random() {
        let res = BigInteger(0);
        let n = BigInteger(this.p.square());
        while (!n.isZero()) {
            res = res.shiftLeft(8).add(BigInteger(getRandomBytes(1)[0]));
            n = n.shiftRight(8);
        }
        return res.mod(this.p);
    }

    toString(a, base) {
        let vs;
        if (!a.lesserOrEquals(this.p.shiftRight(BigInteger(1)))) {
            const v = this.p.minus(a);
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }

        return vs;
    }

    isZero(a) {
        return a.isZero();
    }

    fromRng(rng) {
        let v;
        do {
            v = BigInteger(0);
            for (let i=0; i<this.n64; i++) {
                v = v.add(v, rng.nextU64().shiftLeft(64*i));
            }
            v = v.and(this.mask);
        } while (v.geq(this.p));
        v = v.times(this.Ri).mod(this.q);
        return v;
    }


}

const supportsNativeBigInt$1 = typeof BigInt === "function";
let _F1Field;
if (supportsNativeBigInt$1) {
    _F1Field = ZqField;
} else {
    _F1Field = ZqField$1;
}

class F1Field extends _F1Field {

    // Returns a buffer with Little Endian Representation
    toRprLE(buff, o, e) {
        toRprLE(buff, o, e, this.n64*8);
    }

    // Returns a buffer with Big Endian Representation
    toRprBE(buff, o, e) {
        toRprBE(buff, o, e, this.n64*8);
    }

    // Returns a buffer with Big Endian Montgomery Representation
    toRprBEM(buff, o, e) {
        return this.toRprBE(buff, o, this.mul(this.R, e));
    }

    toRprLEM(buff, o, e) {
        return this.toRprLE(buff, o, this.mul(this.R, e));
    }


    // Pases a buffer with Little Endian Representation
    fromRprLE(buff, o) {
        return fromRprLE(buff, o, this.n8);
    }

    // Pases a buffer with Big Endian Representation
    fromRprBE(buff, o) {
        return fromRprBE(buff, o, this.n8);
    }

    fromRprLEM(buff, o) {
        return this.mul(this.fromRprLE(buff, o), this.Ri);
    }

    fromRprBEM(buff, o) {
        return this.mul(this.fromRprBE(buff, o), this.Ri);
    }

}

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

class F2Field {
    constructor(F, nonResidue) {
        this.type="F2";
        this.F = F;
        this.zero = [this.F.zero, this.F.zero];
        this.one = [this.F.one, this.F.zero];
        this.negone = this.neg(this.one);
        this.nonResidue = nonResidue;
        this.m = F.m*2;
        this.p = F.p;
        this.n64 = F.n64*2;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;

        buildSqrt(this);
    }

    _mulByNonResidue(a) {
        return this.F.mul(this.nonResidue, a);
    }

    copy(a) {
        return [this.F.copy(a[0]), this.F.copy(a[1])];
    }

    add(a, b) {
        return [
            this.F.add(a[0], b[0]),
            this.F.add(a[1], b[1])
        ];
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        return [
            this.F.sub(a[0], b[0]),
            this.F.sub(a[1], b[1])
        ];
    }

    neg(a) {
        return this.sub(this.zero, a);
    }

    conjugate(a) {
        return [
            a[0],
            this.F.neg(a[1])
        ];
    }

    mul(a, b) {
        const aA = this.F.mul(a[0] , b[0]);
        const bB = this.F.mul(a[1] , b[1]);

        return [
            this.F.add( aA , this._mulByNonResidue(bB)),
            this.F.sub(
                this.F.mul(
                    this.F.add(a[0], a[1]),
                    this.F.add(b[0], b[1])),
                this.F.add(aA, bB))];
    }

    inv(a) {
        const t0 = this.F.square(a[0]);
        const t1 = this.F.square(a[1]);
        const t2 = this.F.sub(t0, this._mulByNonResidue(t1));
        const t3 = this.F.inv(t2);
        return [
            this.F.mul(a[0], t3),
            this.F.neg(this.F.mul( a[1], t3)) ];
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    square(a) {
        const ab = this.F.mul(a[0] , a[1]);

        /*
        [
            (a + b) * (a + non_residue * b) - ab - non_residue * ab,
            ab + ab
        ];
        */

        return [
            this.F.sub(
                this.F.mul(
                    this.F.add(a[0], a[1]) ,
                    this.F.add(
                        a[0] ,
                        this._mulByNonResidue(a[1]))),
                this.F.add(
                    ab,
                    this._mulByNonResidue(ab))),
            this.F.add(ab, ab)
        ];
    }

    isZero(a) {
        return this.F.isZero(a[0]) && this.F.isZero(a[1]);
    }

    eq(a, b) {
        return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]);
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    pow(base, e) {
        return exp$3(this, base, e);
    }

    exp(base, e) {
        return exp$3(this, base, e);
    }

    toString(a) {
        return `[ ${this.F.toString(a[0])} , ${this.F.toString(a[1])} ]`;
    }

    fromRng(rng) {
        const c0 = this.F.fromRng(rng);
        const c1 = this.F.fromRng(rng);
        return [c0, c1];
    }

    gt(a, b) {
        if (this.F.gt(a[0], b[0])) return true;
        if (this.F.gt(b[0], a[0])) return false;
        if (this.F.gt(a[1], b[1])) return true;
        return false;
    }

    geq(a, b) {
        return this.gt(a, b) || this.eq(a, b);
    }

    lt(a, b) {
        return !this.geq(a,b);
    }

    leq(a, b) {
        return !this.gt(a,b);
    }

    neq(a, b) {
        return !this.eq(a,b);
    }

    random() {
        return [this.F.random(), this.F.random()];
    }


    toRprLE(buff, o, e) {
        this.F.toRprLE(buff, o, e[0]);
        this.F.toRprLE(buff, o+this.F.n8, e[1]);
    }

    toRprBE(buff, o, e) {
        this.F.toRprBE(buff, o, e[1]);
        this.F.toRprBE(buff, o+this.F.n8, e[0]);
    }

    toRprLEM(buff, o, e) {
        this.F.toRprLEM(buff, o, e[0]);
        this.F.toRprLEM(buff, o+this.F.n8, e[1]);
    }


    toRprBEM(buff, o, e) {
        this.F.toRprBEM(buff, o, e[1]);
        this.F.toRprBEM(buff, o+this.F.n8, e[0]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLE(buff, o);
        const c1 = this.F.fromRprLE(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const c1 = this.F.fromRprBE(buff, o);
        const c0 = this.F.fromRprBE(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLEM(buff, o);
        const c1 = this.F.fromRprLEM(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const c1 = this.F.fromRprBEM(buff, o);
        const c0 = this.F.fromRprBEM(buff, o+this.F.n8);
        return [c0, c1];
    }

}

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

class F3Field {
    constructor(F, nonResidue) {
        this.type="F3";
        this.F = F;
        this.zero = [this.F.zero, this.F.zero, this.F.zero];
        this.one = [this.F.one, this.F.zero, this.F.zero];
        this.negone = this.neg(this.one);
        this.nonResidue = nonResidue;
        this.m = F.m*3;
        this.p = F.p;
        this.n64 = F.n64*3;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
    }

    _mulByNonResidue(a) {
        return this.F.mul(this.nonResidue, a);
    }

    copy(a) {
        return [this.F.copy(a[0]), this.F.copy(a[1]), this.F.copy(a[2])];
    }

    add(a, b) {
        return [
            this.F.add(a[0], b[0]),
            this.F.add(a[1], b[1]),
            this.F.add(a[2], b[2])
        ];
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        return [
            this.F.sub(a[0], b[0]),
            this.F.sub(a[1], b[1]),
            this.F.sub(a[2], b[2])
        ];
    }

    neg(a) {
        return this.sub(this.zero, a);
    }

    mul(a, b) {

        const aA = this.F.mul(a[0] , b[0]);
        const bB = this.F.mul(a[1] , b[1]);
        const cC = this.F.mul(a[2] , b[2]);

        return [
            this.F.add(
                aA,
                this._mulByNonResidue(
                    this.F.sub(
                        this.F.mul(
                            this.F.add(a[1], a[2]),
                            this.F.add(b[1], b[2])),
                        this.F.add(bB, cC)))),    // aA + non_residue*((b+c)*(B+C)-bB-cC),

            this.F.add(
                this.F.sub(
                    this.F.mul(
                        this.F.add(a[0], a[1]),
                        this.F.add(b[0], b[1])),
                    this.F.add(aA, bB)),
                this._mulByNonResidue( cC)),   // (a+b)*(A+B)-aA-bB+non_residue*cC

            this.F.add(
                this.F.sub(
                    this.F.mul(
                        this.F.add(a[0], a[2]),
                        this.F.add(b[0], b[2])),
                    this.F.add(aA, cC)),
                bB)];                           // (a+c)*(A+C)-aA+bB-cC)
    }

    inv(a) {
        const t0 = this.F.square(a[0]);             // t0 = a^2 ;
        const t1 = this.F.square(a[1]);             // t1 = b^2 ;
        const t2 = this.F.square(a[2]);             // t2 = c^2;
        const t3 = this.F.mul(a[0],a[1]);           // t3 = ab
        const t4 = this.F.mul(a[0],a[2]);           // t4 = ac
        const t5 = this.F.mul(a[1],a[2]);           // t5 = bc;
        // c0 = t0 - non_residue * t5;
        const c0 = this.F.sub(t0, this._mulByNonResidue(t5));
        // c1 = non_residue * t2 - t3;
        const c1 = this.F.sub(this._mulByNonResidue(t2), t3);
        const c2 = this.F.sub(t1, t4);              // c2 = t1-t4

        // t6 = (a * c0 + non_residue * (c * c1 + b * c2)).inv();
        const t6 =
            this.F.inv(
                this.F.add(
                    this.F.mul(a[0], c0),
                    this._mulByNonResidue(
                        this.F.add(
                            this.F.mul(a[2], c1),
                            this.F.mul(a[1], c2)))));

        return [
            this.F.mul(t6, c0),         // t6*c0
            this.F.mul(t6, c1),         // t6*c1
            this.F.mul(t6, c2)];        // t6*c2
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    square(a) {
        const s0 = this.F.square(a[0]);                   // s0 = a^2
        const ab = this.F.mul(a[0], a[1]);                // ab = a*b
        const s1 = this.F.add(ab, ab);                    // s1 = 2ab;
        const s2 = this.F.square(
            this.F.add(this.F.sub(a[0],a[1]), a[2]));     // s2 = (a - b + c)^2;
        const bc = this.F.mul(a[1],a[2]);                 // bc = b*c
        const s3 = this.F.add(bc, bc);                    // s3 = 2*bc
        const s4 = this.F.square(a[2]);                   // s4 = c^2


        return [
            this.F.add(
                s0,
                this._mulByNonResidue(s3)),           // s0 + non_residue * s3,
            this.F.add(
                s1,
                this._mulByNonResidue(s4)),           // s1 + non_residue * s4,
            this.F.sub(
                this.F.add( this.F.add(s1, s2) , s3 ),
                this.F.add(s0, s4))];                      // s1 + s2 + s3 - s0 - s4
    }

    isZero(a) {
        return this.F.isZero(a[0]) && this.F.isZero(a[1]) && this.F.isZero(a[2]);
    }

    eq(a, b) {
        return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]) && this.F.eq(a[2], b[2]);
    }

    affine(a) {
        return [this.F.affine(a[0]), this.F.affine(a[1]), this.F.affine(a[2])];
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    pow(base, e) {
        return exp$3(this, base, e);
    }

    exp(base, e) {
        return exp$3(this, base, e);
    }

    toString(a) {
        return `[ ${this.F.toString(a[0])} , ${this.F.toString(a[1])}, ${this.F.toString(a[2])} ]`;
    }

    fromRng(rng) {
        const c0 = this.F.fromRng(rng);
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        return [c0, c1, c2];
    }

    gt(a, b) {
        if (this.F.gt(a[0], b[0])) return true;
        if (this.F.gt(b[0], a[0])) return false;
        if (this.F.gt(a[1], b[1])) return true;
        if (this.F.gt(b[1], a[1])) return false;
        if (this.F.gt(a[2], b[2])) return true;
        return false;
    }


    geq(a, b) {
        return this.gt(a, b) || this.eq(a, b);
    }

    lt(a, b) {
        return !this.geq(a,b);
    }

    leq(a, b) {
        return !this.gt(a,b);
    }

    neq(a, b) {
        return !this.eq(a,b);
    }

    random() {
        return [this.F.random(), this.F.random(), this.F.random()];
    }


    toRprLE(buff, o, e) {
        this.F.toRprLE(buff, o, e[0]);
        this.F.toRprLE(buff, o+this.F.n8, e[1]);
        this.F.toRprLE(buff, o+this.F.n8*2, e[2]);
    }

    toRprBE(buff, o, e) {
        this.F.toRprBE(buff, o, e[2]);
        this.F.toRprBE(buff, o+this.F.n8, e[1]);
        this.F.toRprBE(buff, o+this.F.n8*2, e[0]);
    }

    toRprLEM(buff, o, e) {
        this.F.toRprLEM(buff, o, e[0]);
        this.F.toRprLEM(buff, o+this.F.n8, e[1]);
        this.F.toRprLEM(buff, o+this.F.n8*2, e[2]);
    }


    toRprBEM(buff, o, e) {
        this.F.toRprBEM(buff, o, e[2]);
        this.F.toRprBEM(buff, o+this.F.n8, e[1]);
        this.F.toRprBEM(buff, o+this.F.n8*2, e[0]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLE(buff, o);
        const c1 = this.F.fromRprLE(buff, o+this.n8);
        const c2 = this.F.fromRprLE(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const c2 = this.F.fromRprBE(buff, o);
        const c1 = this.F.fromRprBE(buff, o+this.n8);
        const c0 = this.F.fromRprBE(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLEM(buff, o);
        const c1 = this.F.fromRprLEM(buff, o+this.n8);
        const c2 = this.F.fromRprLEM(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const c2 = this.F.fromRprBEM(buff, o);
        const c1 = this.F.fromRprBEM(buff, o+this.n8);
        const c0 = this.F.fromRprBEM(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

}

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


function isGreatest(F, a) {
    if (Array.isArray(a)) {
        for (let i=a.length-1; i>=0; i--) {
            if (!F.F.isZero(a[i])) {
                return isGreatest(F.F, a[i]);
            }
        }
        return 0;
    } else {
        const na = F.neg(a);
        return gt$2(a, na);
    }
}


class EC {

    constructor(F, g) {
        this.F = F;
        this.g = g;
        if (this.g.length == 2) this.g[2] = this.F.one;
        this.zero = [this.F.zero, this.F.one, this.F.zero];
    }

    add(p1, p2) {

        const F = this.F;

        if (this.eq(p1, this.zero)) return p2;
        if (this.eq(p2, this.zero)) return p1;

        const res = new Array(3);

        const Z1Z1 = F.square( p1[2] );
        const Z2Z2 = F.square( p2[2] );

        const U1 = F.mul( p1[0] , Z2Z2 );     // U1 = X1  * Z2Z2
        const U2 = F.mul( p2[0] , Z1Z1 );     // U2 = X2  * Z1Z1

        const Z1_cubed = F.mul( p1[2] , Z1Z1);
        const Z2_cubed = F.mul( p2[2] , Z2Z2);

        const S1 = F.mul( p1[1] , Z2_cubed);  // S1 = Y1 * Z2 * Z2Z2
        const S2 = F.mul( p2[1] , Z1_cubed);  // S2 = Y2 * Z1 * Z1Z1

        if (F.eq(U1,U2) && F.eq(S1,S2)) {
            return this.double(p1);
        }

        const H = F.sub( U2 , U1 );                    // H = U2-U1

        const S2_minus_S1 = F.sub( S2 , S1 );

        const I = F.square( F.add(H,H) );         // I = (2 * H)^2
        const J = F.mul( H , I );                      // J = H * I

        const r = F.add( S2_minus_S1 , S2_minus_S1 );  // r = 2 * (S2-S1)
        const V = F.mul( U1 , I );                     // V = U1 * I

        res[0] =
            F.sub(
                F.sub( F.square(r) , J ),
                F.add( V , V ));                       // X3 = r^2 - J - 2 * V

        const S1_J = F.mul( S1 , J );

        res[1] =
            F.sub(
                F.mul( r , F.sub(V,res[0])),
                F.add( S1_J,S1_J ));                   // Y3 = r * (V-X3)-2 S1 J

        res[2] =
            F.mul(
                H,
                F.sub(
                    F.square( F.add(p1[2],p2[2]) ),
                    F.add( Z1Z1 , Z2Z2 )));            // Z3 = ((Z1+Z2)^2-Z1Z1-Z2Z2) * H

        return res;
    }

    neg(p) {
        return [p[0], this.F.neg(p[1]), p[2]];
    }

    sub(a, b) {
        return this.add(a, this.neg(b));
    }

    double(p) {
        const F = this.F;

        const res = new Array(3);

        if (this.eq(p, this.zero)) return p;

        const A = F.square( p[0] );                    // A = X1^2
        const B = F.square( p[1] );                    // B = Y1^2
        const C = F.square( B );                       // C = B^2

        let D =
            F.sub(
                F.square( F.add(p[0] , B )),
                F.add( A , C));
        D = F.add(D,D);                    // D = 2 * ((X1 + B)^2 - A - C)

        const E = F.add( F.add(A,A), A);          // E = 3 * A
        const FF =F.square( E );                       // F = E^2

        res[0] = F.sub( FF , F.add(D,D) );         // X3 = F - 2 D

        let eightC = F.add( C , C );
        eightC = F.add( eightC , eightC );
        eightC = F.add( eightC , eightC );

        res[1] =
            F.sub(
                F.mul(
                    E,
                    F.sub( D, res[0] )),
                eightC);                                    // Y3 = E * (D - X3) - 8 * C

        const Y1Z1 = F.mul( p[1] , p[2] );
        res[2] = F.add( Y1Z1 , Y1Z1 );                 // Z3 = 2 * Y1 * Z1

        return res;
    }

    timesScalar(base, e) {
        return mulScalar(this, base, e);
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    affine(p) {
        const F = this.F;
        if (this.isZero(p)) {
            return this.zero;
        } else if (F.eq(p[2], F.one)) {
            return p;
        } else {
            const Z_inv = F.inv(p[2]);
            const Z2_inv = F.square(Z_inv);
            const Z3_inv = F.mul(Z2_inv, Z_inv);

            const res = new Array(3);
            res[0] = F.mul(p[0],Z2_inv);
            res[1] = F.mul(p[1],Z3_inv);
            res[2] = F.one;

            return res;
        }
    }

    multiAffine(arr) {
        const keys = Object.keys(arr);
        const F = this.F;
        const accMul = new Array(keys.length+1);
        accMul[0] = F.one;
        for (let i = 0; i< keys.length; i++) {
            if (F.eq(arr[keys[i]][2], F.zero)) {
                accMul[i+1] = accMul[i];
            } else {
                accMul[i+1] = F.mul(accMul[i], arr[keys[i]][2]);
            }
        }

        accMul[keys.length] = F.inv(accMul[keys.length]);

        for (let i = keys.length-1; i>=0; i--) {
            if (F.eq(arr[keys[i]][2], F.zero)) {
                accMul[i] = accMul[i+1];
                arr[keys[i]] = this.zero;
            } else {
                const Z_inv = F.mul(accMul[i], accMul[i+1]);
                accMul[i] = F.mul(arr[keys[i]][2], accMul[i+1]);

                const Z2_inv = F.square(Z_inv);
                const Z3_inv = F.mul(Z2_inv, Z_inv);

                arr[keys[i]][0] = F.mul(arr[keys[i]][0],Z2_inv);
                arr[keys[i]][1] = F.mul(arr[keys[i]][1],Z3_inv);
                arr[keys[i]][2] = F.one;
            }
        }

    }

    eq(p1, p2) {
        const F = this.F;

        if (this.F.eq(p1[2], this.F.zero)) return this.F.eq(p2[2], this.F.zero);
        if (this.F.eq(p2[2], this.F.zero)) return false;

        const Z1Z1 = F.square( p1[2] );
        const Z2Z2 = F.square( p2[2] );

        const U1 = F.mul( p1[0] , Z2Z2 );
        const U2 = F.mul( p2[0] , Z1Z1 );

        const Z1_cubed = F.mul( p1[2] , Z1Z1);
        const Z2_cubed = F.mul( p2[2] , Z2Z2);

        const S1 = F.mul( p1[1] , Z2_cubed);
        const S2 = F.mul( p2[1] , Z1_cubed);

        return (F.eq(U1,U2) && F.eq(S1,S2));
    }

    isZero(p) {
        return this.F.isZero(p[2]);
    }

    toString(p) {
        const cp = this.affine(p);
        return `[ ${this.F.toString(cp[0])} , ${this.F.toString(cp[1])} ]`;
    }

    fromRng(rng) {
        const F = this.F;
        let P = [];
        let greatest;
        do {
            P[0] = F.fromRng(rng);
            greatest = rng.nextBool();
            const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
            P[1] = F.sqrt(x3b);
        } while ((P[1] == null)||(F.isZero[P]));

        const s = isGreatest(F, P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);
        P[2] = F.one;

        if (this.cofactor) {
            P = this.mulScalar(P, this.cofactor);
        }

        P = this.affine(P);

        return P;

    }

    toRprLE(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLE(buff, o, p[0]);
        this.F.toRprLE(buff, o+this.F.n8, p[1]);
    }

    toRprBE(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprBE(buff, o, p[0]);
        this.F.toRprBE(buff, o+this.F.n8, p[1]);
    }

    toRprLEM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLEM(buff, o, p[0]);
        this.F.toRprLEM(buff, o+this.F.n8, p[1]);
    }

    toRprLEJM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLEM(buff, o, p[0]);
        this.F.toRprLEM(buff, o+this.F.n8, p[1]);
        this.F.toRprLEM(buff, o+2*this.F.n8, p[2]);
    }


    toRprBEM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprBEM(buff, o, p[0]);
        this.F.toRprBEM(buff, o+this.F.n8, p[1]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLE(buff, o);
        const y = this.F.fromRprLE(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const x = this.F.fromRprBE(buff, o);
        const y = this.F.fromRprBE(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLEM(buff, o);
        const y = this.F.fromRprLEM(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprLEJM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLEM(buff, o);
        const y = this.F.fromRprLEM(buff, o+this.F.n8);
        const z = this.F.fromRprLEM(buff, o+this.F.n8*2);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, z];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprBEM(buff, o);
        const y = this.F.fromRprBEM(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprCompressed(buff, o) {
        const F = this.F;
        const v = new Uint8Array(buff.buffer, o, F.n8);
        if (v[0] & 0x40) return this.zero;
        const P = new Array(3);

        const greatest = ((v[0] & 0x80) != 0);
        v[0] = v[0] & 0x7F;
        P[0] = F.fromRprBE(buff, o);
        if (greatest) v[0] = v[0] | 0x80;  // set back again the old value

        const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
        P[1] = F.sqrt(x3b);

        if (P[1] === null) {
            throw new Error("Invalid Point!");
        }

        const s = isGreatest(F, P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);
        P[2] = F.one;

        return P;
    }

    toRprCompressed(buff, o, p) {
        p = this.affine(p);
        const v = new Uint8Array(buff.buffer, o, this.F.n8);
        if (this.isZero(p)) {
            v.fill(0);
            v[0] = 0x40;
            return;
        }
        this.F.toRprBE(buff, o, p[0]);

        if (isGreatest(this.F, p[1])) {
            v[0] = v[0] | 0x80;
        }
    }


    fromRprUncompressed(buff, o) {
        if (buff[0] & 0x40) return this.zero;

        return this.fromRprBE(buff, o);
    }

    toRprUncompressed(buff, o, p) {
        this.toRprBE(buff, o, p);

        if (this.isZero(p)) {
            buff[o] = buff[o] | 0x40;
        }
    }


}

var code = "AGFzbQEAAAABkgESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCH9/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIPAQNlbnYGbWVtb3J5AgAZA7gCtgIAAQIBAwMEBAUAAAYHCAUCBQUAAAUAAAAAAgIAAQUICQUFCAACAgUFAAAFAAAAAAICAAEFCAkFBQgAAgUAAAICAgEBAAAAAwMDAAAFBQUAAAUFBQAAAAAAAgIFAAUAAAAABQUFBQUKAAsJCgALCQgIAwAICAIAAAkMDAUFDAAIDQkCAgEBAAUFAAUFAAAAAAMACAICCQgAAgICAQEAAAADAwMAAAUFBQAABQUFAAAAAAACAgUABQAAAAAFBQUFBQoACwkKAAsJCAgFAwAICAIAAAkMDAUFDAUDAAgIAgAACQwMBQUMBQUJCQkJCQACAgEBAAUABQUAAgAAAwAIAgkIAAICAQEABQUABQUAAAAAAwAIAgIJCAACBQAAAAAICAUAAAAAAAAAAAAAAAAAAAAABA4PEBEFB90kpwIIaW50X2NvcHkAAAhpbnRfemVybwABB2ludF9vbmUAAwppbnRfaXNaZXJvAAIGaW50X2VxAAQHaW50X2d0ZQAFB2ludF9hZGQABgdpbnRfc3ViAAcHaW50X211bAAICmludF9zcXVhcmUACQ1pbnRfc3F1YXJlT2xkAAoHaW50X2RpdgANDmludF9pbnZlcnNlTW9kAA4IZjFtX2NvcHkAAAhmMW1femVybwABCmYxbV9pc1plcm8AAgZmMW1fZXEABAdmMW1fYWRkABAHZjFtX3N1YgARB2YxbV9uZWcAEg5mMW1faXNOZWdhdGl2ZQAZCWYxbV9pc09uZQAPCGYxbV9zaWduABoLZjFtX21SZWR1Y3QAEwdmMW1fbXVsABQKZjFtX3NxdWFyZQAVDWYxbV9zcXVhcmVPbGQAFhJmMW1fZnJvbU1vbnRnb21lcnkAGBBmMW1fdG9Nb250Z29tZXJ5ABcLZjFtX2ludmVyc2UAGwdmMW1fb25lABwIZjFtX2xvYWQAHQ9mMW1fdGltZXNTY2FsYXIAHgdmMW1fZXhwACIQZjFtX2JhdGNoSW52ZXJzZQAfCGYxbV9zcXJ0ACMMZjFtX2lzU3F1YXJlACQVZjFtX2JhdGNoVG9Nb250Z29tZXJ5ACAXZjFtX2JhdGNoRnJvbU1vbnRnb21lcnkAIQhmcm1fY29weQAACGZybV96ZXJvAAEKZnJtX2lzWmVybwACBmZybV9lcQAEB2ZybV9hZGQAJgdmcm1fc3ViACcHZnJtX25lZwAoDmZybV9pc05lZ2F0aXZlAC8JZnJtX2lzT25lACUIZnJtX3NpZ24AMAtmcm1fbVJlZHVjdAApB2ZybV9tdWwAKgpmcm1fc3F1YXJlACsNZnJtX3NxdWFyZU9sZAAsEmZybV9mcm9tTW9udGdvbWVyeQAuEGZybV90b01vbnRnb21lcnkALQtmcm1faW52ZXJzZQAxB2ZybV9vbmUAMghmcm1fbG9hZAAzD2ZybV90aW1lc1NjYWxhcgA0B2ZybV9leHAAOBBmcm1fYmF0Y2hJbnZlcnNlADUIZnJtX3NxcnQAOQxmcm1faXNTcXVhcmUAOhVmcm1fYmF0Y2hUb01vbnRnb21lcnkANhdmcm1fYmF0Y2hGcm9tTW9udGdvbWVyeQA3BmZyX2FkZAAmBmZyX3N1YgAnBmZyX25lZwAoBmZyX211bAA7CWZyX3NxdWFyZQA8CmZyX2ludmVyc2UAPQ1mcl9pc05lZ2F0aXZlAD4HZnJfY29weQAAB2ZyX3plcm8AAQZmcl9vbmUAMglmcl9pc1plcm8AAgVmcl9lcQAEDGcxbV9tdWx0aWV4cABpEmcxbV9tdWx0aWV4cF9jaHVuawBoEmcxbV9tdWx0aWV4cEFmZmluZQBtGGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawBsCmcxbV9pc1plcm8AQBBnMW1faXNaZXJvQWZmaW5lAD8GZzFtX2VxAEgLZzFtX2VxTWl4ZWQARwxnMW1fZXFBZmZpbmUARghnMW1fY29weQBEDmcxbV9jb3B5QWZmaW5lAEMIZzFtX3plcm8AQg5nMW1femVyb0FmZmluZQBBCmcxbV9kb3VibGUAShBnMW1fZG91YmxlQWZmaW5lAEkHZzFtX2FkZABNDGcxbV9hZGRNaXhlZABMDWcxbV9hZGRBZmZpbmUASwdnMW1fbmVnAE8NZzFtX25lZ0FmZmluZQBOB2cxbV9zdWIAUgxnMW1fc3ViTWl4ZWQAUQ1nMW1fc3ViQWZmaW5lAFASZzFtX2Zyb21Nb250Z29tZXJ5AFQYZzFtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAFMQZzFtX3RvTW9udGdvbWVyeQBWFmcxbV90b01vbnRnb21lcnlBZmZpbmUAVQ9nMW1fdGltZXNTY2FsYXIAbhVnMW1fdGltZXNTY2FsYXJBZmZpbmUAbw1nMW1fbm9ybWFsaXplAFsKZzFtX0xFTXRvVQBdCmcxbV9MRU10b0MAXgpnMW1fVXRvTEVNAF8KZzFtX0N0b0xFTQBgD2cxbV9iYXRjaExFTXRvVQBhD2cxbV9iYXRjaExFTXRvQwBiD2cxbV9iYXRjaFV0b0xFTQBjD2cxbV9iYXRjaEN0b0xFTQBkDGcxbV90b0FmZmluZQBXDmcxbV90b0phY29iaWFuAEURZzFtX2JhdGNoVG9BZmZpbmUAWhNnMW1fYmF0Y2hUb0phY29iaWFuAGULZzFtX2luQ3VydmUAWRFnMW1faW5DdXJ2ZUFmZmluZQBYB2ZybV9mZnQAdQhmcm1faWZmdAB2CmZybV9yYXdmZnQAcwtmcm1fZmZ0Sm9pbgB3DmZybV9mZnRKb2luRXh0AHgRZnJtX2ZmdEpvaW5FeHRJbnYAeQpmcm1fZmZ0TWl4AHoMZnJtX2ZmdEZpbmFsAHsdZnJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24AfAhwb2xfemVybwB9D3BvbF9jb25zdHJ1Y3RMQwB+DHFhcF9idWlsZEFCQwB/C3FhcF9qb2luQUJDAIABCmYybV9pc1plcm8AgQEJZjJtX2lzT25lAIIBCGYybV96ZXJvAIMBB2YybV9vbmUAhAEIZjJtX2NvcHkAhQEHZjJtX211bACGAQhmMm1fbXVsMQCHAQpmMm1fc3F1YXJlAIgBB2YybV9hZGQAiQEHZjJtX3N1YgCKAQdmMm1fbmVnAIsBCGYybV9zaWduAJIBDWYybV9jb25qdWdhdGUAjAESZjJtX2Zyb21Nb250Z29tZXJ5AI4BEGYybV90b01vbnRnb21lcnkAjQEGZjJtX2VxAI8BC2YybV9pbnZlcnNlAJABB2YybV9leHAAlQEPZjJtX3RpbWVzU2NhbGFyAJEBEGYybV9iYXRjaEludmVyc2UAlAEIZjJtX3NxcnQAlgEMZjJtX2lzU3F1YXJlAJcBDmYybV9pc05lZ2F0aXZlAJMBDGcybV9tdWx0aWV4cADCARJnMm1fbXVsdGlleHBfY2h1bmsAwQESZzJtX211bHRpZXhwQWZmaW5lAMYBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawDFAQpnMm1faXNaZXJvAJkBEGcybV9pc1plcm9BZmZpbmUAmAEGZzJtX2VxAKEBC2cybV9lcU1peGVkAKABDGcybV9lcUFmZmluZQCfAQhnMm1fY29weQCdAQ5nMm1fY29weUFmZmluZQCcAQhnMm1femVybwCbAQ5nMm1femVyb0FmZmluZQCaAQpnMm1fZG91YmxlAKMBEGcybV9kb3VibGVBZmZpbmUAogEHZzJtX2FkZACmAQxnMm1fYWRkTWl4ZWQApQENZzJtX2FkZEFmZmluZQCkAQdnMm1fbmVnAKgBDWcybV9uZWdBZmZpbmUApwEHZzJtX3N1YgCrAQxnMm1fc3ViTWl4ZWQAqgENZzJtX3N1YkFmZmluZQCpARJnMm1fZnJvbU1vbnRnb21lcnkArQEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAKwBEGcybV90b01vbnRnb21lcnkArwEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQCuAQ9nMm1fdGltZXNTY2FsYXIAxwEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lAMgBDWcybV9ub3JtYWxpemUAtAEKZzJtX0xFTXRvVQC2AQpnMm1fTEVNdG9DALcBCmcybV9VdG9MRU0AuAEKZzJtX0N0b0xFTQC5AQ9nMm1fYmF0Y2hMRU10b1UAugEPZzJtX2JhdGNoTEVNdG9DALsBD2cybV9iYXRjaFV0b0xFTQC8AQ9nMm1fYmF0Y2hDdG9MRU0AvQEMZzJtX3RvQWZmaW5lALABDmcybV90b0phY29iaWFuAJ4BEWcybV9iYXRjaFRvQWZmaW5lALMBE2cybV9iYXRjaFRvSmFjb2JpYW4AvgELZzJtX2luQ3VydmUAsgERZzJtX2luQ3VydmVBZmZpbmUAsQELZzFtX3RpbWVzRnIAyQEHZzFtX2ZmdADPAQhnMW1faWZmdADQAQpnMW1fcmF3ZmZ0AM0BC2cxbV9mZnRKb2luANEBDmcxbV9mZnRKb2luRXh0ANIBEWcxbV9mZnRKb2luRXh0SW52ANMBCmcxbV9mZnRNaXgA1AEMZzFtX2ZmdEZpbmFsANUBHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uANYBC2cybV90aW1lc0ZyANcBB2cybV9mZnQA3QEIZzJtX2lmZnQA3gEKZzJtX3Jhd2ZmdADbAQtnMm1fZmZ0Sm9pbgDfAQ5nMm1fZmZ0Sm9pbkV4dADgARFnMm1fZmZ0Sm9pbkV4dEludgDhAQpnMm1fZmZ0TWl4AOIBDGcybV9mZnRGaW5hbADjAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDkARFnMW1fdGltZXNGckFmZmluZQDlARFnMm1fdGltZXNGckFmZmluZQDmARFmcm1fYmF0Y2hBcHBseUtleQDnARFnMW1fYmF0Y2hBcHBseUtleQDoARZnMW1fYmF0Y2hBcHBseUtleU1peGVkAOkBEWcybV9iYXRjaEFwcGx5S2V5AOoBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA6wEKZjZtX2lzWmVybwDtAQlmNm1faXNPbmUA7gEIZjZtX3plcm8A7wEHZjZtX29uZQDwAQhmNm1fY29weQDxAQdmNm1fbXVsAPIBCmY2bV9zcXVhcmUA8wEHZjZtX2FkZAD0AQdmNm1fc3ViAPUBB2Y2bV9uZWcA9gEIZjZtX3NpZ24A9wESZjZtX2Zyb21Nb250Z29tZXJ5APkBEGY2bV90b01vbnRnb21lcnkA+AEGZjZtX2VxAPoBC2Y2bV9pbnZlcnNlAPsBB2Y2bV9leHAA/wEPZjZtX3RpbWVzU2NhbGFyAPwBEGY2bV9iYXRjaEludmVyc2UA/gEOZjZtX2lzTmVnYXRpdmUA/QEKZnRtX2lzWmVybwCBAglmdG1faXNPbmUAggIIZnRtX3plcm8AgwIHZnRtX29uZQCEAghmdG1fY29weQCFAgdmdG1fbXVsAIYCCGZ0bV9tdWwxAIcCCmZ0bV9zcXVhcmUAiAIHZnRtX2FkZACJAgdmdG1fc3ViAIoCB2Z0bV9uZWcAiwIIZnRtX3NpZ24AkgINZnRtX2Nvbmp1Z2F0ZQCMAhJmdG1fZnJvbU1vbnRnb21lcnkAjgIQZnRtX3RvTW9udGdvbWVyeQCNAgZmdG1fZXEAjwILZnRtX2ludmVyc2UAkAIHZnRtX2V4cACVAg9mdG1fdGltZXNTY2FsYXIAkQIQZnRtX2JhdGNoSW52ZXJzZQCUAghmdG1fc3FydACWAgxmdG1faXNTcXVhcmUAlwIOZnRtX2lzTmVnYXRpdmUAkwIUYm4xMjhfX2Zyb2Jlbml1c01hcDAAoAIUYm4xMjhfX2Zyb2Jlbml1c01hcDEAoQIUYm4xMjhfX2Zyb2Jlbml1c01hcDIAogIUYm4xMjhfX2Zyb2Jlbml1c01hcDMAowIUYm4xMjhfX2Zyb2Jlbml1c01hcDQApAIUYm4xMjhfX2Zyb2Jlbml1c01hcDUApQIUYm4xMjhfX2Zyb2Jlbml1c01hcDYApgIUYm4xMjhfX2Zyb2Jlbml1c01hcDcApwIUYm4xMjhfX2Zyb2Jlbml1c01hcDgAqAIUYm4xMjhfX2Zyb2Jlbml1c01hcDkAqQIQYm4xMjhfcGFpcmluZ0VxMQCwAhBibjEyOF9wYWlyaW5nRXEyALECEGJuMTI4X3BhaXJpbmdFcTMAsgIQYm4xMjhfcGFpcmluZ0VxNACzAhBibjEyOF9wYWlyaW5nRXE1ALQCDWJuMTI4X3BhaXJpbmcAtQIPYm4xMjhfcHJlcGFyZUcxAJoCD2JuMTI4X3ByZXBhcmVHMgCcAhBibjEyOF9taWxsZXJMb29wAJ8CGWJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb24ArwIcYm4xMjhfZmluYWxFeHBvbmVudGlhdGlvbk9sZACqAg9ibjEyOF9fbXVsQnkwMjQAnQISYm4xMjhfX211bEJ5MDI0T2xkAJ4CF2JuMTI4X19jeWNsb3RvbWljU3F1YXJlAKwCF2JuMTI4X19jeWNsb3RvbWljRXhwX3cwAK0CCtDaA7YCKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAszACAAKQMYUARAIAApAxBQBEAgACkDCFAEQCAAKQMAUA8FQQAPCwVBAA8LBUEADwtBAA8LHgAgAEIBNwMAIABCADcDCCAAQgA3AxAgAEIANwMYC0cAIAApAxggASkDGFEEQCAAKQMQIAEpAxBRBEAgACkDCCABKQMIUQRAIAApAwAgASkDAFEPBUEADwsFQQAPCwVBAA8LQQAPC30AIAApAxggASkDGFQEQEEADwUgACkDGCABKQMYVgRAQQEPBSAAKQMQIAEpAxBUBEBBAA8FIAApAxAgASkDEFYEQEEBDwUgACkDCCABKQMIVARAQQAPBSAAKQMIIAEpAwhWBEBBAQ8FIAApAwAgASkDAFoPCwsLCwsLQQAPC9QBAQF+IAA1AgAgATUCAHwhAyACIAM+AgAgADUCBCABNQIEfCADQiCIfCEDIAIgAz4CBCAANQIIIAE1Agh8IANCIIh8IQMgAiADPgIIIAA1AgwgATUCDHwgA0IgiHwhAyACIAM+AgwgADUCECABNQIQfCADQiCIfCEDIAIgAz4CECAANQIUIAE1AhR8IANCIIh8IQMgAiADPgIUIAA1AhggATUCGHwgA0IgiHwhAyACIAM+AhggADUCHCABNQIcfCADQiCIfCEDIAIgAz4CHCADQiCIpwuMAgEBfiAANQIAIAE1AgB9IQMgAiADQv////8Pgz4CACAANQIEIAE1AgR9IANCIId8IQMgAiADQv////8Pgz4CBCAANQIIIAE1Agh9IANCIId8IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCADQiCHpwuPEBIBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4gA0L/////D4MgADUCACIFIAE1AgAiBn58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgBSABNQIEIgh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgcgBn58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgBSABNQIIIgp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIgkgBn58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgBSABNQIMIgx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIgsgBn58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgBSABNQIQIg5+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIg0gBn58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgBSABNQIUIhB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIg8gBn58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgBSABNQIYIhJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIhEgBn58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgBSABNQIcIhR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIhMgBn58IQQgAyAEQiCIfCEDIAIgBD4CHCADQiCIIQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIAp+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIAIgAz4CKCAEQiCIIQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyACIAQ+AjwLjBIMAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CLCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCyANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CMCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDCANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CNCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4COCADIQQgBEIgiCEFIAEgBD4CPAsKACAAIAAgARAIC7YBAQF+IAA1AAAgAX4hAyACIAM+AAAgADUABCABfiADQiCIfCEDIAIgAz4ABCAANQAIIAF+IANCIIh8IQMgAiADPgAIIAA1AAwgAX4gA0IgiHwhAyACIAM+AAwgADUAECABfiADQiCIfCEDIAIgAz4AECAANQAUIAF+IANCIIh8IQMgAiADPgAUIAA1ABggAX4gA0IgiHwhAyACIAM+ABggADUAHCABfiADQiCIfCEDIAIgAz4AHAtOAgF+AX8gACEDIAM1AAAgAXwhAiADIAI+AAAgAkIgiCECAkADQCACUA0BIANBBGohAyADNQAAIAJ8IQIgAyACPgAAIAJCIIghAgwACwsLsAIHAX8BfwF/AX8BfgF+AX8gAgRAIAIhBQVB6AAhBQsgAwRAIAMhBAVBiAEhBAsgACAEEAAgAUHIABAAIAUQAUGoARABQR8hBkEfIQcCQANAQcgAIAdqLQAAIAdBA0ZyDQEgB0EBayEH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MCADQiCIfEGIBDUCFCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEGIBDUCGCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEGIBDUCHCAEfnwhAyAAIAM+AjhB6AYgA0IgiD4CHEHoBiAAQSBqIAEQEAu+HyMBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QonHmaQOIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AogEIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCjAQiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKQBCIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApQEIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCmAQiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKcBCIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AqAEIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCpAQiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gJH58IQMgBCADQiCIfCEEIANC/////w+DIBEgIH58IQMgBCADQiCIfCEEIANC/////w+DIBUgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGH58IQMgBCADQiCIfCEEIANC/////w+DIB0gFH58IQMgBCADQiCIfCEEIANC/////w+DICEgEH58IQMgBCADQiCIfCEEIANC/////w+DICUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESAkfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgISAUfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gIH58IQQgAyAEQiCIfCEDIARC/////w+DICEgHH58IQQgAyAEQiCIfCEDIARC/////w+DICUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgAiAEPgIcIAOnBEAgAkGIBCACEAcaBSACQYgEEAUEQCACQYgEIAIQBxoLCwu7IR0BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QonHmaQOIQZCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgcgB358IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEIIAJC/////w+DQQA1AogEIgkgCH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgQiCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8Pg0EANQKMBCIMIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIIIg1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCkAQiDyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQ4gAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCDCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApQEIhIgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyERIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhAiE358IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIA5+fCECIAMgAkIgiHwhAyACQv////8PgyASIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKYBCIVIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFCACQv////8PgyAJIBR+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIUIhZ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBN+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCnAQiGCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRcgAkL/////D4MgCSAXfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCGCIZfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgF358IQIgAyACQiCIfCEDIAJC/////w+DIA8gFH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBggC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqAEIhsgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEaIAJC/////w+DIAkgGn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhwiHH58IQIgAyACQiCIfCEDIAJC/////w+DIAogGX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gFn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBd+fCECIAMgAkIgiHwhAyACQv////8PgyASIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAYIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAbIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKkBCIeIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhHSACQv////8PgyAJIB1+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gHX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgF358IQIgAyACQiCIfCEDIAJC/////w+DIBggFH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAcfnwhAiAD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BCADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AgQgADUCCCADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AgggADUCDCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AgwgADUCECADQiCIfEHIDjUCECAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AhxBqBEgA0IgiD4CAEIAIQMgADUCBCACfkL/////D4MhBCAANQIEIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CBCAANQIIIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgONQIYIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIcIAR+fCEDIAAgAz4CIEGoESADQiCIPgIEQgAhAyAANQIIIAJ+Qv////8PgyEEIAA1AgggA0IgiHxByA41AgAgBH58IQMgACADPgIIIAA1AgwgA0IgiHxByA41AgQgBH58IQMgACADPgIMIAA1AhAgA0IgiHxByA41AgggBH58IQMgACADPgIQIAA1AhQgA0IgiHxByA41AgwgBH58IQMgACADPgIUIAA1AhggA0IgiHxByA41AhAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AhQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxByA41AhggBH58IQMgACADPgIgIAA1AiQgA0IgiHxByA41AhwgBH58IQMgACADPgIkQagRIANCIIg+AghCACEDIAA1AgwgAn5C/////w+DIQQgADUCDCADQiCIfEHIDjUCACAEfnwhAyAAIAM+AgwgADUCECADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCECAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AihBqBEgA0IgiD4CDEIAIQMgADUCECACfkL/////D4MhBCAANQIQIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgONQIYIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgONQIcIAR+fCEDIAAgAz4CLEGoESADQiCIPgIQQgAhAyAANQIUIAJ+Qv////8PgyEEIAA1AhQgA0IgiHxByA41AgAgBH58IQMgACADPgIUIAA1AhggA0IgiHxByA41AgQgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AgggBH58IQMgACADPgIcIAA1AiAgA0IgiHxByA41AgwgBH58IQMgACADPgIgIAA1AiQgA0IgiHxByA41AhAgBH58IQMgACADPgIkIAA1AiggA0IgiHxByA41AhQgBH58IQMgACADPgIoIAA1AiwgA0IgiHxByA41AhggBH58IQMgACADPgIsIAA1AjAgA0IgiHxByA41AhwgBH58IQMgACADPgIwQagRIANCIIg+AhRCACEDIAA1AhggAn5C/////w+DIQQgADUCGCADQiCIfEHIDjUCACAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIDjUCECAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AjRBqBEgA0IgiD4CGEIAIQMgADUCHCACfkL/////D4MhBCAANQIcIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QcgONQIYIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QcgONQIcIAR+fCEDIAAgAz4COEGoESADQiCIPgIcQagRIABBIGogARAmC74fIwF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5C/////w4hBSADQv////8PgyAANQIAIgYgATUCACIHfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIQggA0L/////D4NBADUCyA4iCSAIfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCBCILfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIKIAd+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLMDiINIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhDCAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIIIg9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIg4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AtAOIhEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEQIANC/////w+DIAkgEH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgwiE358IQQgAyAEQiCIfCEDIARC/////w+DIAogD358IQQgAyAEQiCIfCEDIARC/////w+DIA4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgwiEiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC1A4iFSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRQgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCECIXfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECIWIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLYDiIZIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhGCADQv////8PgyAJIBh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIUIht+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIhogB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gGH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtwOIh0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEcIARC/////w+DIAkgHH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhgiH358IQMgBCADQiCIfCEEIANC/////w+DIAogG358IQMgBCADQiCIfCEEIANC/////w+DIA4gF358IQMgBCADQiCIfCEEIANC/////w+DIBIgE358IQMgBCADQiCIfCEEIANC/////w+DIBYgD358IQMgBCADQiCIfCEEIANC/////w+DIBogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhgiHiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC4A4iISAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DISAgA0L/////D4MgCSAgfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCHCIjfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAffnwhBCADIARCIIh8IQMgBEL/////D4MgDiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgFiATfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgHiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCIiIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLkDiIlIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhJCAEQv////8PgyAJICR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgCiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgEiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAMfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAOICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBB+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIBIgI358IQMgBCADQiCIfCEEIANC/////w+DIBYgH358IQMgBCADQiCIfCEEIANC/////w+DIBogG358IQMgBCADQiCIfCEEIANC/////w+DIB4gF358IQMgBCADQiCIfCEEIANC/////w+DICIgE358IQMgBCADQiCIfCEEIANC/////w+DIBUgJH58IQMgBCADQiCIfCEEIANC/////w+DIBkgIH58IQMgBCADQiCIfCEEIANC/////w+DIB0gHH58IQMgBCADQiCIfCEEIANC/////w+DICEgGH58IQMgBCADQiCIfCEEIANC/////w+DICUgFH58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgFiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAffnwhBCADIARCIIh8IQMgBEL/////D4MgHiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgISAcfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAYfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAaICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAdICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBx+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIB4gI358IQQgAyAEQiCIfCEDIARC/////w+DICIgH358IQQgAyAEQiCIfCEDIARC/////w+DICEgJH58IQQgAyAEQiCIfCEDIARC/////w+DICUgIH58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgIiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAkfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyACIAQ+AhwgA6cEQCACQcgOIAIQBxoFIAJByA4QBQRAIAJByA4gAhAHGgsLC7shHQF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5C/////w4hBkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQggAkL/////D4NBADUCyA4iCSAIfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCBCIKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DQQA1AswOIgwgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyELIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AggiDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLQDiIPIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhDiACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIMIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC1A4iEiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIREgAkL/////D4MgCSARfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCECITfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gDn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtgOIhUgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEUIAJC/////w+DIAkgFH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhQiFn58IQIgAyACQiCIfCEDIAJC/////w+DIAogE358IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8PgyASIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAVIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLcDiIYIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFyACQv////8PgyAJIBd+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIYIhl+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyANIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC4A4iGyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRogAkL/////D4MgCSAafnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCHCIcfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgECATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgGn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gF358IQIgAyACQiCIfCEDIAJC/////w+DIBIgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBggDn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AuQOIh4gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEdIAJC/////w+DIAkgHX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKIBx+fCECIAMgAkIgiHwhAyACQv////8PgyANIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyATIBN+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiALfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBl+fCECIAMgAkIgiHwhAyACQv////8PgyATIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAOfnwhAiADIAJCIIh8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQIBx+fCECIAMgAkIgiHwhAyACQv////8PgyATIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAWIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgEiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiARfnwhAiADIAJCIIh8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyATIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAWIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgFSAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAUfnwhAiADIAJCIIh8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAWIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAZIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAXfnwhAiADIAJCIIh8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAZIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAafnwhAiADIAJCIIh8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAcIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgHiAdfnwhAiADIAJCIIh8IQMgASACPgIYIAMhBCAEQiCIIQUgASAEPgIcIAWnBEAgAUHIDiABEAcaBSABQcgOEAUEQCABQcgOIAEQBxoLCwsKACAAIAAgARAqCwsAIABBiA8gARAqCxUAIABBqBUQAEHIFRABQagVIAEQKQsRACAAQegVEC5B6BVBiBAQBQskACAAEAIEQEEADwsgAEGIFhAuQYgWQYgQEAUEQEF/DwtBAQ8LFwAgACABEC4gAUHIDiABEA4gASABEC0LCQBBqA8gABAAC8sBBAF/AX8BfwF/IAIQAUEgIQUgACEDAkADQCAFIAFLDQEgBUEgRgRAQagWEDIFQagWQYgPQagWECoLIANBqBZByBYQKiACQcgWIAIQJiADQSBqIQMgBUEgaiEFDAALCyABQSBwIQQgBEUEQA8LQcgWEAFBACEGAkADQCAGIARGDQEgBiADLQAAOgDIFiADQQFqIQMgBkEBaiEGDAALCyAFQSBGBEBBqBYQMgVBqBZBiA9BqBYQKgtByBZBqBZByBYQKiACQcgWIAIQJgscACABIAJB6BYQM0HoFkHoFhAtIABB6BYgAxAqC/gBBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakEgbGo2AgAgBRAyIAAhBiAFQSBqIQVBACEIAkADQCAIIAJGDQEgBhACBEAgBUEgayAFEAAFIAYgBUEgayAFECoLIAYgAWohBiAFQSBqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUEgayEFIAMgAkEBayAEbGohByAFIAUQMQJAA0AgCEUNASAGEAIEQCAFIAVBIGsQACAHEAEFIAVBIGtBiBcQACAFIAYgBUEgaxAqIAVBiBcgBxAqCyAGIAFrIQYgByAEayEHIAVBIGshBSAIQQFrIQgMAAsLQQAgBTYCAAs+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAtIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCws+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAuIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCwuyAgIBfwF/IAJFBEAgAxAyDwsgAEGoFxAAIAMQMiACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADECsgBUGAAU8EQCAFQYABayEFIANBqBcgAxAqCyADIAMQKyAFQcAATwRAIAVBwABrIQUgA0GoFyADECoLIAMgAxArIAVBIE8EQCAFQSBrIQUgA0GoFyADECoLIAMgAxArIAVBEE8EQCAFQRBrIQUgA0GoFyADECoLIAMgAxArIAVBCE8EQCAFQQhrIQUgA0GoFyADECoLIAMgAxArIAVBBE8EQCAFQQRrIQUgA0GoFyADECoLIAMgAxArIAVBAk8EQCAFQQJrIQUgA0GoFyADECoLIAMgAxArIAVBAU8EQCAFQQFrIQUgA0GoFyADECoLIARFDQEMAAsLC94BAwF/AX8BfyAAEAIEQCABEAEPC0EcIQJB6BBByBcQACAAQcgQQSBB6BcQOCAAQYgRQSBBiBgQOAJAA0BB6BdBqA8QBA0BQegXQagYECtBASEDAkADQEGoGEGoDxAEDQFBqBhBqBgQKyADQQFqIQMMAAsLQcgXQcgYEAAgAiADa0EBayEEAkADQCAERQ0BQcgYQcgYECsgBEEBayEEDAALCyADIQJByBhByBcQK0HoF0HIF0HoFxAqQYgYQcgYQYgYECoMAAsLQYgYEC8EQEGIGCABECgFQYgYIAEQAAsLIAAgABACBEBBAQ8LIABB6A9BIEHoGBA4QegYQagPEAQLFQAgACABQYgZECpBiBlBiA8gAhAqCwoAIAAgACABEDsLCwAgAEHIDiABEA4LCQAgAEGIEBAFCw4AIAAQAiAAQSBqEAJxCwoAIABBwABqEAILDQAgABABIABBIGoQAQsVACAAEAEgAEEgahAcIABBwABqEAELUgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOAt6ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWAsoACAAED8EQCABEEIFIAFBwABqEBwgAEEgaiABQSBqEAAgACABEAALCxgBAX8gACABEAQgAEEgaiABQSBqEARxDwt1AQF/IABBwABqIQIgABBABEAgARA/DwsgARA/BEBBAA8LIAIQDwRAIAAgARBGDwsgAkHIGRAVIAFByBlB6BkQFCACQcgZQYgaEBQgAUEgakGIGkGoGhAUIABB6BkQBARAIABBIGpBqBoQBARAQQEPCwtBAA8LtAECAX8BfyAAQcAAaiECIAFBwABqIQMgABBABEAgARBADwsgARBABEBBAA8LIAIQDwRAIAEgABBHDwsgAxAPBEAgACABEEcPCyACQcgaEBUgA0HoGhAVIABB6BpBiBsQFCABQcgaQagbEBQgAkHIGkHIGxAUIANB6BpB6BsQFCAAQSBqQegbQYgcEBQgAUEgakHIG0GoHBAUQYgbQagbEAQEQEGIHEGoHBAEBEBBAQ8LC0EADwvoAQAgABA/BEAgACABEEUPCyAAQcgcEBUgAEEgakHoHBAVQegcQYgdEBUgAEHoHEGoHRAQQagdQagdEBVBqB1ByBxBqB0QEUGoHUGIHUGoHRARQagdQagdQagdEBBByBxByBxByB0QEEHIHUHIHEHIHRAQIABBIGogAEEgaiABQcAAahAQQcgdIAEQFSABQagdIAEQESAB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EIEBCxAAIAAQgwEgAEHAAGoQgwELGQAgABCDASAAQcAAahCEASAAQYABahCDAQuiAQAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4C4ICACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAELLwAgABCYAQRAIAEQmwEFIAFBgAFqEIQBIABBwABqIAFBwABqEIUBIAAgARCFAQsLHAEBfyAAIAEQjwEgAEHAAGogAUHAAGoQjwFxDwuLAQEBfyAAQYABaiECIAAQmQEEQCABEJgBDwsgARCYAQRAQQAPCyACEIIBBEAgACABEJ8BDwsgAkGI4wAQiAEgAUGI4wBByOMAEIYBIAJBiOMAQYjkABCGASABQcAAakGI5ABByOQAEIYBIABByOMAEI8BBEAgAEHAAGpByOQAEI8BBEBBAQ8LC0EADwvZAQIBfwF/IABBgAFqIQIgAUGAAWohAyAAEJkBBEAgARCZAQ8LIAEQmQEEQEEADwsgAhCCAQRAIAEgABCgAQ8LIAMQggEEQCAAIAEQoAEPCyACQYjlABCIASADQcjlABCIASAAQcjlAEGI5gAQhgEgAUGI5QBByOYAEIYBIAJBiOUAQYjnABCGASADQcjlAEHI5wAQhgEgAEHAAGpByOcAQYjoABCGASABQcAAakGI5wBByOgAEIYBQYjmAEHI5gAQjwEEQEGI6ABByOgAEI8BBEBB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gAFByIABQYiCARCJAUGI/QBBiIEBQYiDARCGAUGIggFByIIBEIgBQYiDAUGIgwFByIMBEIkBQciCAUHIgQEgAhCKASACQciDASACEIoBQYj/AEHIgQFBiIQBEIYBQYiEAUGIhAFBiIQBEIkBQYiDASACIAJBwABqEIoBIAJBwABqQYiCASACQcAAahCGASACQcAAakGIhAEgAkHAAGoQigEgAyAEIAJBgAFqEIkBIAJBgAFqIAJBgAFqEIgBIAJBgAFqQYj8ACACQYABahCKASACQYABakHI/AAgAkGAAWoQigEgAkGAAWpBiIABIAJBgAFqEIYBCxgAIAAgARCFASAAQcAAaiABQcAAahCLAQsnACAAIAEQhQEgAEHAAGogAUHAAGoQiwEgAEGAAWogAUGAAWoQhQELFgAgAUHIhAEQpwEgAEHIhAEgAhCkAQsWACABQYiGARCnASAAQYiGASACEKUBCxYAIAFByIcBEKgBIABByIcBIAIQpgELGAAgACABEI4BIABBwABqIAFBwABqEI4BCycAIAAgARCOASAAQcAAaiABQcAAahCOASAAQYABaiABQYABahCOAQsYACAAIAEQjQEgAEHAAGogAUHAAGoQjQELJwAgACABEI0BIABBwABqIAFBwABqEI0BIABBgAFqIAFBgAFqEI0BC14AIAAQmQEEQCABEIMBIAFBwABqEIMBBSAAQYABakGIiQEQkAFBiIkBQciJARCIAUGIiQFByIkBQYiKARCGASAAQciJASABEIYBIABBwABqQYiKASABQcAAahCGAQsLQAAgAEHAAGpByIoBEIgBIABBiIsBEIgBIABBiIsBQYiLARCGAUGIiwFByOIAQYiLARCJAUHIigFBiIsBEI8BDwsTACAAQciLARCwAUHIiwEQsQEPC74BBQF/AX8BfwF/AX9BACgCACEDQQAgAyABQcAAbGo2AgAgAEGAAWpBwAEgASADQcAAEJQBIAAhBCADIQUgAiEGQQAhBwJAA0AgByABRg0BIAUQgQEEQCAGEIMBIAZBwABqEIMBBSAFIARBwABqQciMARCGASAFIAUQiAEgBSAEIAYQhgEgBUHIjAEgBkHAAGoQhgELIARBwAFqIQQgBkGAAWohBiAFQcAAaiEFIAdBAWohBwwACwtBACADNgIAC14AIAAQmQEEQCABEJsBBSAAQYABakGIjQEQkAFBiI0BQciNARCIAUGIjQFByI0BQYiOARCGASAAQciNASABEIYBIABBwABqQYiOASABQcAAahCGASABQYABahCEAQsLOwIBfwF/IAIgAWpBAWshAyAAIQQCQANAIAMgAkgNASADIAQtAAA6AAAgA0EBayEDIARBAWohBAwACwsLPQAgABCYAQRAIAEQmgEgAUHAADoAAA8LIABByI4BEKwBQciOAUHAACABELUBQYiPAUHAACABQcAAahC1AQtKACAAEJkBBEAgARCDASABQcAAOgAADwsgAEHIjwEQjgFByI8BQcAAIAEQtQEgAEHAAGoQkgFBf0YEQCABIAEtAABBgAFyOgAACws5ACAALQAAQcAAcQRAIAEQmgEPCyAAQcAAQYiQARC1ASAAQcAAakHAAEHIkAEQtQFBiJABIAEQrgEL2QECAX8BfyAALQAAIQIgAkHAAHEEQCABEJoBDwsgAkGAAXEhAyAAQciRARCFAUHIkQEgAkE/cToAAEHIkQFBwABBiJEBELUBQYiRASABEI0BIAFByJEBEIgBIAFByJEBQciRARCGAUHIkQFByOIAQciRARCJAUHIkQFByJEBEJYBQciRAUGIkQEQiwFByJEBEJIBQX9GBEAgAwRAQciRASABQcAAahCFAQVByJEBIAFBwABqEIsBCwUgAwRAQciRASABQcAAahCLAQVByJEBIAFBwABqEIUBCwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQtgEgBEGAAWohBCAFQYABaiEFIANBAWohAwwACwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQtwEgBEGAAWohBCAFQcAAaiEFIANBAWohAwwACwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQuAEgBEGAAWohBCAFQYABaiEFIANBAWohAwwACwsLVQMBfwF/AX8gACABQQFrQcAAbGohBCACIAFBAWtBgAFsaiEFQQAhAwJAA0AgAyABRg0BIAQgBRC5ASAEQcAAayEEIAVBgAFrIQUgA0EBaiEDDAALCwtVAwF/AX8BfyAAIAFBAWtBgAFsaiEEIAIgAUEBa0HAAWxqIQVBACEDAkADQCADIAFGDQEgBCAFEJ4BIARBgAFr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B0GAAWohByAIQcABaiEIQcj2ASADQcj2ARAqIAZBAWohBgwACwsLDQBBqP4BIAAgARCGAQsbACAAEIEBIABBwABqEIEBcSAAQYABahCBAXELHAAgABCCASAAQcAAahCBAXEgAEGAAWoQgQFxDwsZACAAEIMBIABBwABqEIMBIABBgAFqEIMBCxkAIAAQhAEgAEHAAGoQgwEgAEGAAWoQgwELJwAgACABEIUBIABBwABqIAFBwABqEIUBIABBgAFqIAFBgAFqEIUBC+UCACAAIAFB6P8BEIYBIABBwABqIAFBwABqQaiAAhCGASAAQYABaiABQYABakHogAIQhgEgACAAQcAAakGogQIQiQEgASABQcAAakHogQIQiQEgACAAQYABakGoggIQiQEgASABQYABakHoggIQiQEgAEHAAGogAEGAAWpBqIMCEIkBIAFBwABqIAFBgAFqQeiDAhCJAUHo/wFBqIACQaiEAhCJAUHo/wFB6IACQeiEAhCJAUGogAJB6IACQaiFAhCJAUGogwJB6IMCIAIQhgEgAkGohQIgAhCKASACIAIQ7AFB6P8BIAIgAhCJAUGogQJB6IECIAJBwABqEIYBIAJBwABqQaiEAiACQcAAahCKAUHogAJB6IUCEOwBIAJBwABqQeiFAiACQcAAahCJAUGoggJB6IICIAJBgAFqEIYBIAJBgAFqQeiEAiACQYABahCKASACQYABakGogAIgAkGAAWoQiQELgQIAIABBqIYCEIgBIAAgAEHAAGpB6IYCEIYBQeiGAkHohgJBqIcCEIkBIAAgAEHAAGpB6IcCEIoBQeiHAiAAQYABakHohwIQiQFB6IcCQeiHAhCIASAAQcAAaiAAQYABakGoiAIQhgFBqIgCQaiIAkHoiAIQiQEgAEGAAWpBqIkCEIgBQeiIAiABEOwBQaiGAiABIAEQiQFBqIkCIAFBwABqEOwBQaiHAiABQcAAaiABQcAAahCJAUGohgJBqIkCIAFBgAFqEIkBQeiIAiABQYABaiABQYABahCKAUHohwIgAUGAAWogAUGAAWoQiQFBqIcCIAFBgAFqIAFBgAFqEIkBCzUAIAAgASACEIkBIABBwABqIAFBwABqIAJBwABqEIkBIABBgAFqIAFBgAFqIAJBgAFqEIkBCzUAIAAgASACEIoBIABBwABqIAFBwABqIAJBwABqEIoBIABBgAFqIAFBgAFqIAJBgAFqEIoBCycAIAAgARCLASAAQcAAaiABQcAAahCLASAAQYABaiABQYABahCLAQswAQF/IABBgAFqEJIBIQEgAQRAIAEPCyAAQcAAahCSASEBIAEEQCABDwsgABCSAQ8LJwAgACABEI0BIABBwABqIAFBwABqEI0BIABBgAFqIAFBgAFqEI0BCycAIAAgARCOASAAQcAAaiABQcAAahCOASAAQYABaiABQYABahCOAQspACAAIAEQjwEgAEHAAGogAUHAAGoQjwFxIABBgAFqIAFBgAFqEI8BcQurAgAgAEHoiQIQiAEgAEHAAGpBqIoCEIgBIABBgAFqQeiKAhCIASAAIABBwABqQaiLAhCGASAAIABBgAFqQeiLAhCGASAAQcAAaiAAQYABakGojAIQhgFBqIwCQeiMAhDsAUHoiQJB6IwCQeiMAhCKAUHoigJBqI0CEOwBQaiNAkGoiwJBqI0CEIoBQaiKAkHoiwJB6I0CEIoBIABBgAFqQaiNAkGojgIQhgEgAEHAAGpB6I0CQeiOAhCGAUGojgJB6I4CQaiOAhCJAUGojgJBqI4CEOwBIABB6IwCQeiOAhCGAUHojgJBqI4CQaiOAhCJAUGojgJBqI4CEJABQaiOAkHojAIgARCGAUGojgJBqI0CIAFBwABqEIYBQaiOAkHojQIgAUGAAWoQhgELMwAgACABIAIgAxCRASAAQcAAaiABIAIgA0HAAGoQkQEgAEGAAWogASACIANBgAFqEJEBCzUAIABBgAFqEIEBBEAgAEHAAGoQgQEEQCAAEJMBDwUgAEHAAGoQkwEPCwsgAEGAAWoQkwEPC48CBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakHAAWxqNgIAIAUQ8AEgACEGIAVBwAFqIQVBACEIAkADQCAIIAJGDQEgBhDtAQRAIAVBwAFrIAUQ8QEFIAYgBUHAAWsgBRDyAQsgBiABaiEGIAVBwAFqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUHAAWshBSADIAJBAWsgBGxqIQcgBSAFEPsBAkADQCAIRQ0BIAYQ7QEEQCAFIAVBwAFrEPEBIAcQ7wEFIAVBwAFrQaiPAhDxASAFIAYgBUHAAWsQ8gEgBUGojwIgBxDyAQsgBiABayEGIAcgBGshByAFQcABayEFIAhBAWshCAwACwtBACAFNgIAC84CAgF/AX8gAkUEQCADEPABDwsgAEHokAIQ8QEgAxDwASACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADEPMBIAVBgAFPBEAgBUGAAWshBSADQeiQAiADEPIBCyADIAMQ8wEgBUHAAE8EQCAFQcAAayEFIANB6JACIAMQ8gELIAMgAxDzASAFQSBPBEAgBUEgayEFIANB6JACIAMQ8gELIAMgAxDzASAFQRBPBEAgBUEQayEFIANB6JACIAMQ8gELIAMgAxDzASAFQQhPBEAgBUEIayEFIANB6JACIAMQ8gELIAMgAxDzASAFQQRPBEAgBUEEayEFIANB6JACIAMQ8gELIAMgAxDzASAFQQJPBEAgBUECayEFIANB6JACIAMQ8gELIAMgAxDzASAFQQFPBEAgBUEBayEFIANB6JACIAMQ8gELIARFDQEMAAsLCysAQaj+ASAAQYABaiABEIYBIAAgAUHAAGoQhQEgAEHAAGogAUGAAWoQhQELEQAgABDtASAAQcABahDtAXELEgAgABDuASAAQcABahDtAXEPCxAAIAAQ7wEgAEHAAWoQ7wELEAAgABDwASAAQcABahDvAQsYACAAIAEQ8QEgAEHAAWogAUHAAWoQ8QELhQEAIAAgAUGokgIQ8gEgAEHAAWogAUHAAWpB6JMCEPIBIAAgAEHAAWpBqJUCEPQBIAEgAUHAAWpB6JYCEPQBQaiVAkHolgJBqJUCEPIBQeiTAiACEIACQaiSAiACIAIQ9AFBqJICQeiTAiACQcABahD0AUGolQIgAkHAAWogAkHAAWoQ9QELHAAgACABIAIQ8gEgAEHAAWogASACQcABahDyAQt9ACAAIABBwAFqQaiYAhDyASAAIABBwAFqQeiZAhD0ASAAQcABakGomwIQgAIgAEGomwJBqJsCEPQBQaiYAkHonAIQgAJB6JwCQaiYAkHonAIQ9AFB6JkCQaibAiABEPIBIAFB6JwCIAEQ9QFBqJgCQaiYAiABQcABahD0AQsgACAAIAEgAhD0ASAAQcABaiABQcABaiACQcABahD0AQsgACAAIAEgAhD1ASAAQcABaiABQcABaiACQcABahD1AQsYACAAIAEQ9gEgAEHAAWogAUHAAWoQ9gELGAAgACABEPEBIABBwAFqIAFBwAFqEPYBCxgAIAAgARD4ASAAQcABaiABQcABahD4AQsYACAAIAEQ+QEgAEHAAWogAUHAAWoQ+QELGQAgACABEPoBIABBwAFqIAFBwAFqEPoBcQtqACAAQaieAhDzASAAQcABakHonwIQ8wFB6J8CQaihAhCAAkGongJBqKECQaihAhD1AUGooQJB6KICEPsBIABB6KICIAEQ8gEgAEHAAWpB6KICIAFBwAFqEPIBIAFBwAFqIAFBwAFqEPYBCyAAIAAgASACIAMQ/AEgAEHAAWogASACIANBwAFqEPwBCx0BAX8gAEHAAWoQ9wEhASABBEAgAQ8LIAAQ9wEPCx4AIABBwAFqEO0BBEAgABD9AQ8LIABBwAFqEP0BDwuPAgQBfwF/AX8Bf0EAKAIAIQVBACAFIAJBAWpBgANsajYCACAFEIQCIAAhBiAFQYADaiEFQQAhCAJAA0AgCCACRg0BIAYQgQIEQCAFQYADayAFEIUCBSAGIAVBgANrIAUQhgILIAYgAWohBiAFQYADaiEFIAhBAWohCAwACwsgBiABayEGIAVBgANrIQUgAyACQQFrIARsaiEHIAUgBRCQAgJAA0AgCEUNASAGEIECBEAgBSAFQYADaxCFAiAHEIMCBSAFQYADa0GopAIQhQIgBSAGIAVBgANrEIYCIAVBqKQCIAcQhgILIAYgAWshBiAHIARrIQcgBUGAA2shBSAIQQFrIQgMAAsLQQAgBTYCAAvOAgIBfwF/IAJFBEAgAxCEAg8LIABBqKcCEIUCIAMQhAIgAiEEAkADQCAEQQFrIQQgASAEai0AACEFIAMgAxCIAiAFQYABTwRAIAVBgAFrIQUgA0GopwIgAxCGAgsgAyADEIgCIAVBwABPBEAgBUHAAGshBSADQainAiADEIYCCyADIAMQiAIgBUEgTwRAIAVBIGshBSADQainAiADEIYCCyADIAMQiAIgBUEQTwRAIAVBEGshBSADQainAiADEIYCCyADIAMQiAIgBUEITwRAIAVBCGshBSADQainAiADEIYCCyADIAMQiAIgBUEETwRAIAVBBGshBSADQainAiADEIYCCyADIAMQiAIgBUECTwRAIAVBAmshBSADQainAiADEIYCCyADIAMQiAIgBUEBTwRAIAVBAWshBSADQainAiADEIYCCyAERQ0BDAALCwvRAQBBqLYCEIQCQai2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gAJqIAFBgAJqEAAgAEGgAmogAUGgAmoQEiABQYACakHwhgQgAUGAAmoQhgEgAEHAAmogAUHAAmoQACAAQeACaiABQeACahASIAFBwAJqQbCHBCABQcACahCGAQtsACAAQfCHBCABEIYBIABBwABqQbCIBCABQcAAahCGASAAQYABakHwiAQgAUGAAWoQhgEgAEHAAWpBsIkEIAFBwAFqEIYBIABBgAJqQfCJBCABQYACahCGASAAQcACakGwigQgAUHAAmoQhgELigIAIAAgARAAIABBIGogAUEgahASIAFB8IoEIAEQhgEgAEHAAGogAUHAAGoQACAAQeAAaiABQeAAahASIAFBwABqQbCLBCABQcAAahCGASAAQYABaiABQYABahAAIABBoAFqIAFBoAFqEBIgAUGAAWpB8IsEIAFBgAFqEIYBIABBwAFqIAFBwAFqEAAgAEHgAWogAUHgAWoQEiABQcABakGwjAQgAUHAAWoQhgEgAEGAAmogAUGAAmoQACAAQaACaiABQaACahASIAFBgAJqQfCMBCABQYACahCGASAAQcACaiABQcACahAAIABB4AJqIAFB4AJqEBIgAUHAAmpBsI0EIAFBwAJqEIYBC2wAIABB8I0EIAEQhgEgAEHAAGpBsI4EIAFBwABqEIYBIABBgAFqQfCOBCABQYABahCGASAAQcABakGwjwQgAUHAAWoQhgEgAEGAAmpB8I8EIAFBgAJqEIYBIABBwAJqQbCQBCABQcACahCGAQuKAgAgACABEAAgAEEgaiABQSBqEBIgAUHwkAQgARCGASAAQcAAaiABQcAAahAAIABB4ABqIAFB4ABqEBIgAUHAAGpBsJEEIAFBwABqEIYBIABBgAFqIAFBgAFqEAAgAEGgAWogAUGgAWoQEiABQYABakHwkQQgAUGAAWoQhgEgAEHAAWogAUHAAWoQACAAQeABaiABQeABahASIAFBwAFqQbCSBCABQcABahCGASAAQYACaiABQYACahAAIABBoAJqIAFBoAJqEBIgAUGAAmpB8JIEIAFBgAJqEIYBIABBwAJqIAFBwAJqEAAgAEHgAmogAUHgAmoQEiABQcACakGwkwQgAUHAAmoQhgELbAAgAEHwkwQgARCGASAAQcAAakGwlAQgAUHAAGoQhgEgAEGAAWpB8JQEIAFBgAFqEIYBIABBwAFqQbCVBCABQcABahCGASAAQYACakHwlQQgAUGAAmoQhgEgAEHAAmpBsJYEIAFBwAJqEIYBC4oCACAAIAEQACAAQSBqIAFBIGoQEiABQfCWBCABEIYBIABBwABqIAFBwABqEAAgAEHgAGogAUHgAGoQEiABQcAAakGwlwQgAUHAAGoQhgEgAEGAAWogAUGAAWoQACAAQaABaiABQaABahASIAFBgAFqQfCXBCABQYABahCGASAAQcABaiABQcABahAAIABB4AFqIAFB4AFqEBIgAUHAAWpBsJgEIAFBwAFqEIYBIABBgAJqIAFBgAJqEAAgAEGgAmogAUGgAmoQEiABQYACakHwmAQgAUGAAmoQhgEgAEHAAmogAUHAAmoQACAAQeACaiABQeACahASIAFBwAJqQbCZBCABQcACahCGAQtsACAAQfCZBCABEIYBIABBwABqQbCaBCABQcAAahCGASAAQYABakHwmgQgAUGAAWoQhgEgAEHAAWpBsJsEIAFBwAFqEIYBIABBgAJqQfCbBCABQYACahCGASAAQcACakGwnAQgAUHAAmoQhgELigIAIAAgARAAIABBIGogAUEgahASIAFB8JwEIAEQhgEgAEHAAGogAUHAAGoQACAAQeAAaiABQeAAahASIAFBwABqQbCdBCABQcAAahCGASAAQYABaiABQYABahAAIABBoAFqIAFBoAFqEBIgAUGAAWpB8J0EIAFBgAFqEIYBIABBwAFqIAFBwAFqEAAgAEHgAWogAUHgAWoQEiABQcABakGwngQgAUHAAWoQhgEgAEGAAmogAUGAAmoQACAAQaACaiABQaACahASIAFBgAJqQfCeBCABQYACahCGASAAQcACaiABQcACahAAIABB4AJqIAFB4AJqEBIgAUHAAmpBsJ8EIAFBwAJqEIYBCxAAIABB8J8EQeACIAEQlQILSAAgAEHQogQQ8QEgAEHAAWpBkKQEEPYBIABB0KUEEJACQdCiBEHQpQRB0KgEEIYCQdCoBEHQqwQQogJB0KgEQdCrBCABEIYCC4QGACAAIABBgAJqQdCxBBCGASAAQYACakGo/gFB0K4EEIYBIABB0K4EQdCuBBCJASAAIABBgAJqQZCyBBCJAUGQsgRB0K4EQdCuBBCGAUGo/gFB0LEEQZCyBBCGAUHQsQRBkLIEQZCyBBCJAUHQ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";
            var pq = 520;
            var pr = 1864;
            var pG1gen = 31592;
            var pG1zero = 31688;
            var pG1b = 3240;
            var pG2gen = 31784;
            var pG2zero = 31976;
            var pG2b = 12616;
            var pOneT = 32168;
            var prePSize = 192;
            var preQSize = 19776;
            var n8q = 32;
            var n8r = 32;
            var q = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
            var r = "21888242871839275222246405745257275088548364400416034343698204186575808495617";

var bn128_wasm = {
	code: code,
	pq: pq,
	pr: pr,
	pG1gen: pG1gen,
	pG1zero: pG1zero,
	pG1b: pG1b,
	pG2gen: pG2gen,
	pG2zero: pG2zero,
	pG2b: pG2b,
	pOneT: pOneT,
	prePSize: prePSize,
	preQSize: preQSize,
	n8q: n8q,
	n8r: n8r,
	q: q,
	r: r
};

var code$1 = "AGFzbQEAAAABkgESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCH9/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIPAQNlbnYGbWVtb3J5AgAZA8oCyAIAAQIBAwMEBAUAAAYHCAUCBQUAAAUAAAAAAgIAAQUICQUFCAACAAECAQMDBAQFAAAGBwgFAgUFAAAFAAAAAAICAAEFCAkFBQgAAgUAAAICAgEBAAAAAwMDAAAFBQUAAAUFBQAAAAAAAgIFAAUAAAAABQUFBQUKAAsJCgALCQgIAwAICAIAAAkMDAUFDAAIDQkCAgEBAAUFAAUFAAAAAAMACAICCQgAAgICAQEAAAADAwMAAAUFBQAABQUFAAAAAAACAgUABQAAAAAFBQUFBQoACwkKAAsJCAgFAwAICAIAAAkMDAUFDAUDAAgIAgAACQwMBQUMBQUJCQkJCQACAgEBAAUABQUAAgAAAwAIAgkIAAICAQEABQUABQUAAAAAAwAIAgIJCAACBQgJBQAAAAAAAAAAAAACAgICBQAAAAUAAAAABA4PEBEFB+gmuQIJaW50cV9jb3B5AAAJaW50cV96ZXJvAAEIaW50cV9vbmUAAwtpbnRxX2lzWmVybwACB2ludHFfZXEABAhpbnRxX2d0ZQAFCGludHFfYWRkAAYIaW50cV9zdWIABwhpbnRxX211bAAIC2ludHFfc3F1YXJlAAkOaW50cV9zcXVhcmVPbGQACghpbnRxX2RpdgAND2ludHFfaW52ZXJzZU1vZAAOCGYxbV9jb3B5AAAIZjFtX3plcm8AAQpmMW1faXNaZXJvAAIGZjFtX2VxAAQHZjFtX2FkZAAQB2YxbV9zdWIAEQdmMW1fbmVnABIOZjFtX2lzTmVnYXRpdmUAGQlmMW1faXNPbmUADwhmMW1fc2lnbgAaC2YxbV9tUmVkdWN0ABMHZjFtX211bAAUCmYxbV9zcXVhcmUAFQ1mMW1fc3F1YXJlT2xkABYSZjFtX2Zyb21Nb250Z29tZXJ5ABgQZjFtX3RvTW9udGdvbWVyeQAXC2YxbV9pbnZlcnNlABsHZjFtX29uZQAcCGYxbV9sb2FkAB0PZjFtX3RpbWVzU2NhbGFyAB4HZjFtX2V4cAAiEGYxbV9iYXRjaEludmVyc2UAHwhmMW1fc3FydAAjDGYxbV9pc1NxdWFyZQAkFWYxbV9iYXRjaFRvTW9udGdvbWVyeQAgF2YxbV9iYXRjaEZyb21Nb250Z29tZXJ5ACEJaW50cl9jb3B5ACUJaW50cl96ZXJvACYIaW50cl9vbmUAKAtpbnRyX2lzWmVybwAnB2ludHJfZXEAKQhpbnRyX2d0ZQAqCGludHJfYWRkACsIaW50cl9zdWIALAhpbnRyX211bAAtC2ludHJfc3F1YXJlAC4OaW50cl9zcXVhcmVPbGQALwhpbnRyX2RpdgAyD2ludHJfaW52ZXJzZU1vZAAzCGZybV9jb3B5ACUIZnJtX3plcm8AJgpmcm1faXNaZXJvACcGZnJtX2VxACkHZnJtX2FkZAA1B2ZybV9zdWIANgdmcm1fbmVnADcOZnJtX2lzTmVnYXRpdmUAPglmcm1faXNPbmUANAhmcm1fc2lnbgA/C2ZybV9tUmVkdWN0ADgHZnJtX211bAA5CmZybV9zcXVhcmUAOg1mcm1fc3F1YXJlT2xkADsSZnJtX2Zyb21Nb250Z29tZXJ5AD0QZnJtX3RvTW9udGdvbWVyeQA8C2ZybV9pbnZlcnNlAEAHZnJtX29uZQBBCGZybV9sb2FkAEIPZnJtX3RpbWVzU2NhbGFyAEMHZnJtX2V4cABHEGZybV9iYXRjaEludmVyc2UARAhmcm1fc3FydABIDGZybV9pc1NxdWFyZQBJFWZybV9iYXRjaFRvTW9udGdvbWVyeQBFF2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5AEYGZnJfYWRkADUGZnJfc3ViADYGZnJfbmVnADcGZnJfbXVsAEoJZnJfc3F1YXJlAEsKZnJfaW52ZXJzZQBMDWZyX2lzTmVnYXRpdmUATQdmcl9jb3B5ACUHZnJfemVybwAmBmZyX29uZQBBCWZyX2lzWmVybwAnBWZyX2VxACkMZzFtX211bHRpZXhwAHgSZzFtX211bHRpZXhwX2NodW5rAHcSZzFtX211bHRpZXhwQWZmaW5lAHwYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAHsKZzFtX2lzWmVybwBPEGcxbV9pc1plcm9BZmZpbmUATgZnMW1fZXEAVwtnMW1fZXFNaXhlZABWDGcxbV9lcUFmZmluZQBVCGcxbV9jb3B5AFMOZzFtX2NvcHlBZmZpbmUAUghnMW1femVybwBRDmcxbV96ZXJvQWZmaW5lAFAKZzFtX2RvdWJsZQBZEGcxbV9kb3VibGVBZmZpbmUAWAdnMW1fYWRkAFwMZzFtX2FkZE1peGVkAFsNZzFtX2FkZEFmZmluZQBaB2cxbV9uZWcAXg1nMW1fbmVnQWZmaW5lAF0HZzFtX3N1YgBhDGcxbV9zdWJNaXhlZABgDWcxbV9zdWJBZmZpbmUAXxJnMW1fZnJvbU1vbnRnb21lcnkAYxhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUAYhBnMW1fdG9Nb250Z29tZXJ5AGUWZzFtX3RvTW9udGdvbWVyeUFmZmluZQBkD2cxbV90aW1lc1NjYWxhcgB9FWcxbV90aW1lc1NjYWxhckFmZmluZQB+DWcxbV9ub3JtYWxpemUAagpnMW1fTEVNdG9VAGwKZzFtX0xFTXRvQwBtCmcxbV9VdG9MRU0AbgpnMW1fQ3RvTEVNAG8PZzFtX2JhdGNoTEVNdG9VAHAPZzFtX2JhdGNoTEVNdG9DAHEPZzFtX2JhdGNoVXRvTEVNAHIPZzFtX2JhdGNoQ3RvTEVNAHMMZzFtX3RvQWZmaW5lAGYOZzFtX3RvSmFjb2JpYW4AVBFnMW1fYmF0Y2hUb0FmZmluZQBpE2cxbV9iYXRjaFRvSmFjb2JpYW4AdAtnMW1faW5DdXJ2ZQBoEWcxbV9pbkN1cnZlQWZmaW5lAGcHZnJtX2ZmdACEAQhmcm1faWZmdACFAQpmcm1fcmF3ZmZ0AIIBC2ZybV9mZnRKb2luAIYBDmZybV9mZnRKb2luRXh0AIcBEWZybV9mZnRKb2luRXh0SW52AIgBCmZybV9mZnRNaXgAiQEMZnJtX2ZmdEZpbmFsAIoBHWZybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAIsBCHBvbF96ZXJvAIwBD3BvbF9jb25zdHJ1Y3RMQwCNAQxxYXBfYnVpbGRBQkMAjgELcWFwX2pvaW5BQkMAjwEKZjJtX2lzWmVybwCQAQlmMm1faXNPbmUAkQEIZjJtX3plcm8AkgEHZjJtX29uZQCTAQhmMm1fY29weQCUAQdmMm1fbXVsAJUBCGYybV9tdWwxAJYBCmYybV9zcXVhcmUAlwEHZjJtX2FkZACYAQdmMm1fc3ViAJkBB2YybV9uZWcAmgEIZjJtX3NpZ24AoQENZjJtX2Nvbmp1Z2F0ZQCbARJmMm1fZnJvbU1vbnRnb21lcnkAnQEQZjJtX3RvTW9udGdvbWVyeQCcAQZmMm1fZXEAngELZjJtX2ludmVyc2UAnwEHZjJtX2V4cACkAQ9mMm1fdGltZXNTY2FsYXIAoAEQZjJtX2JhdGNoSW52ZXJzZQCjAQhmMm1fc3FydAClAQxmMm1faXNTcXVhcmUApgEOZjJtX2lzTmVnYXRpdmUAogEMZzJtX211bHRpZXhwANEBEmcybV9tdWx0aWV4cF9jaHVuawDQARJnMm1fbXVsdGlleHBBZmZpbmUA1QEYZzJtX211bHRpZXhwQWZmaW5lX2NodW5rANQBCmcybV9pc1plcm8AqAEQZzJtX2lzWmVyb0FmZmluZQCnAQZnMm1fZXEAsAELZzJtX2VxTWl4ZWQArwEMZzJtX2VxQWZmaW5lAK4BCGcybV9jb3B5AKwBDmcybV9jb3B5QWZmaW5lAKsBCGcybV96ZXJvAKoBDmcybV96ZXJvQWZmaW5lAKkBCmcybV9kb3VibGUAsgEQZzJtX2RvdWJsZUFmZmluZQCxAQdnMm1fYWRkALUBDGcybV9hZGRNaXhlZAC0AQ1nMm1fYWRkQWZmaW5lALMBB2cybV9uZWcAtwENZzJtX25lZ0FmZmluZQC2AQdnMm1fc3ViALoBDGcybV9zdWJNaXhlZAC5AQ1nMm1fc3ViQWZmaW5lALgBEmcybV9mcm9tTW9udGdvbWVyeQC8ARhnMm1fZnJvbU1vbnRnb21lcnlBZmZpbmUAuwEQZzJtX3RvTW9udGdvbWVyeQC+ARZnMm1fdG9Nb250Z29tZXJ5QWZmaW5lAL0BD2cybV90aW1lc1NjYWxhcgDWARVnMm1fdGltZXNTY2FsYXJBZmZpbmUA1wENZzJtX25vcm1hbGl6ZQDDAQpnMm1fTEVNdG9VAMUBCmcybV9MRU10b0MAxgEKZzJtX1V0b0xFTQDHAQpnMm1fQ3RvTEVNAMgBD2cybV9iYXRjaExFTXRvVQDJAQ9nMm1fYmF0Y2hMRU10b0MAygEPZzJtX2JhdGNoVXRvTEVNAMsBD2cybV9iYXRjaEN0b0xFTQDMAQxnMm1fdG9BZmZpbmUAvwEOZzJtX3RvSmFjb2JpYW4ArQERZzJtX2JhdGNoVG9BZmZpbmUAwgETZzJtX2JhdGNoVG9KYWNvYmlhbgDNAQtnMm1faW5DdXJ2ZQDBARFnMm1faW5DdXJ2ZUFmZmluZQDAAQtnMW1fdGltZXNGcgDYAQdnMW1fZmZ0AN4BCGcxbV9pZmZ0AN8BCmcxbV9yYXdmZnQA3AELZzFtX2ZmdEpvaW4A4AEOZzFtX2ZmdEpvaW5FeHQA4QERZzFtX2ZmdEpvaW5FeHRJbnYA4gEKZzFtX2ZmdE1peADjAQxnMW1fZmZ0RmluYWwA5AEdZzFtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A5QELZzJtX3RpbWVzRnIA5gEHZzJtX2ZmdADsAQhnMm1faWZmdADtAQpnMm1fcmF3ZmZ0AOoBC2cybV9mZnRKb2luAO4BDmcybV9mZnRKb2luRXh0AO8BEWcybV9mZnRKb2luRXh0SW52APABCmcybV9mZnRNaXgA8QEMZzJtX2ZmdEZpbmFsAPIBHWcybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAPMBEWcxbV90aW1lc0ZyQWZmaW5lAPQBEWcybV90aW1lc0ZyQWZmaW5lAPUBEWZybV9iYXRjaEFwcGx5S2V5APYBEWcxbV9iYXRjaEFwcGx5S2V5APcBFmcxbV9iYXRjaEFwcGx5S2V5TWl4ZWQA+AERZzJtX2JhdGNoQXBwbHlLZXkA+QEWZzJtX2JhdGNoQXBwbHlLZXlNaXhlZAD6AQpmNm1faXNaZXJvAPwBCWY2bV9pc09uZQD9AQhmNm1femVybwD+AQdmNm1fb25lAP8BCGY2bV9jb3B5AIACB2Y2bV9tdWwAgQIKZjZtX3NxdWFyZQCCAgdmNm1fYWRkAIMCB2Y2bV9zdWIAhAIHZjZtX25lZwCFAghmNm1fc2lnbgCGAhJmNm1fZnJvbU1vbnRnb21lcnkAiAIQZjZtX3RvTW9udGdvbWVyeQCHAgZmNm1fZXEAiQILZjZtX2ludmVyc2UAigIHZjZtX2V4cACOAg9mNm1fdGltZXNTY2FsYXIAiwIQZjZtX2JhdGNoSW52ZXJzZQCNAg5mNm1faXNOZWdhdGl2ZQCMAgpmdG1faXNaZXJvAJACCWZ0bV9pc09uZQCRAghmdG1femVybwCSAgdmdG1fb25lAJMCCGZ0bV9jb3B5AJQCB2Z0bV9tdWwAlQIIZnRtX211bDEAlgIKZnRtX3NxdWFyZQCXAgdmdG1fYWRkAJgCB2Z0bV9zdWIAmQIHZnRtX25lZwCaAghmdG1fc2lnbgChAg1mdG1fY29uanVnYXRlAJsCEmZ0bV9mcm9tTW9udGdvbWVyeQCdAhBmdG1fdG9Nb250Z29tZXJ5AJwCBmZ0bV9lcQCeAgtmdG1faW52ZXJzZQCfAgdmdG1fZXhwAKQCD2Z0bV90aW1lc1NjYWxhcgCgAhBmdG1fYmF0Y2hJbnZlcnNlAKMCCGZ0bV9zcXJ0AKUCDGZ0bV9pc1NxdWFyZQCmAg5mdG1faXNOZWdhdGl2ZQCiAhFmdG1fZnJvYmVuaXVzTWFwMACrAhFmdG1fZnJvYmVuaXVzTWFwMQCsAhFmdG1fZnJvYmVuaXVzTWFwMgCtAhFmdG1fZnJvYmVuaXVzTWFwMwCuAhFmdG1fZnJvYmVuaXVzTWFwNACvAhFmdG1fZnJvYmVuaXVzTWFwNQCwAhFmdG1fZnJvYmVuaXVzTWFwNgCxAhFmdG1fZnJvYmVuaXVzTWFwNwCyAhFmdG1fZnJvYmVuaXVzTWFwOACzAhFmdG1fZnJvYmVuaXVzTWFwOQC0AhNibHMxMjM4MV9wYWlyaW5nRXExAMICE2JsczEyMzgxX3BhaXJpbmdFcTIAwwITYmxzMTIzODFfcGFpcmluZ0VxMwDEAhNibHMxMjM4MV9wYWlyaW5nRXE0AMUCE2JsczEyMzgxX3BhaXJpbmdFcTUAxgIQYmxzMTIzODFfcGFpcmluZwDHAhJibHMxMjM4MV9wcmVwYXJlRzEAuwISYmxzMTIzODFfcHJlcGFyZUcyALwCE2JsczEyMzgxX21pbGxlckxvb3AAvQIcYmxzMTIzODFfZmluYWxFeHBvbmVudGlhdGlvbgDBAh9ibHMxMjM4MV9maW5hbEV4cG9uZW50aWF0aW9uT2xkAL4CGmJsczEyMzgxX19jeWNsb3RvbWljU3F1YXJlAL8CGmJsczEyMzgxX19jeWNsb3RvbWljRXhwX3cwAMACCGY2bV9tdWwxAKcCCWY2bV9tdWwwMQCoAgpmdG1fbXVsMDE0AKkCEWcxbV9pbkdyb3VwQWZmaW5lALUCC2cxbV9pbkdyb3VwALYCEWcybV9pbkdyb3VwQWZmaW5lALcCC2cybV9pbkdyb3VwALgCCpSQBcgCPgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AygLLAAgAEIANwMAIABCADcDCCAAQgA3AxAgAEIANwMYIABCADcDICAAQgA3AygLTQAgACkDKFAEQCAAKQMgUARAIAApAxhQBEAgACkDEFAEQCAAKQMIUARAIAApAwBQDwVBAA8LBUEADwsFQQAPCwVBAA8LBUEADwtBAA8LLAAgAEIBNwMAIABCADcDCCAAQgA3AxAgAEIANwMYIABCADcDICAAQgA3AygLawAgACkDKCABKQMoUQRAIAApAyAgASkDIFEEQCAAKQMYIAEpAxhRBEAgACkDECABKQMQUQRAIAApAwggASkDCFEEQCAAKQMAIAEpAwBRDwVBAA8LBUEADwsFQQAPCwVBAA8LBUEADwtBAA8LxQEAIAApAyggASkDKFQEQEEADwUgACkDKCABKQMoVgRAQQEPBSAAKQMgIAEpAyBUBEBBAA8FIAApAyAgASkDIFYEQEEBDwUgACkDGCABKQMYVARAQQAPBSAAKQMYIAEpAxhWBEBBAQ8FIAApAxAgASkDEFQEQEEADwUgACkDECABKQMQVgRAQQEPBSAAKQMIIAEpAwhUBEBBAA8FIAApAwggASkDCFYEQEEBDwUgACkDACABKQMAWg8LCwsLCwsLCwsLQQAPC7wCAQF+IAA1AgAgATUCAHwhAyACIAM+AgAgADUCBCABNQIEfCADQiCIfCEDIAIgAz4CBCAANQIIIAE1Agh8IANCIIh8IQMgAiADPgIIIAA1AgwgATUCDHwgA0IgiHwhAyACIAM+AgwgADUCECABNQIQfCADQiCIfCEDIAIgAz4CECAANQIUIAE1AhR8IANCIIh8IQMgAiADPgIUIAA1AhggATUCGHwgA0IgiHwhAyACIAM+AhggADUCHCABNQIcfCADQiCIfCEDIAIgAz4CHCAANQIgIAE1AiB8IANCIIh8IQMgAiADPgIgIAA1AiQgATUCJHwgA0IgiHwhAyACIAM+AiQgADUCKCABNQIofCADQiCIfCEDIAIgAz4CKCAANQIsIAE1Aix8IANCIIh8IQMgAiADPgIsIANCIIinC5ADAQF+IAA1AgAgATUCAH0hAyACIANC/////w+DPgIAIAA1AgQgATUCBH0gA0Igh3whAyACIANC/////w+DPgIEIAA1AgggATUCCH0gA0Igh3whAyACIANC/////w+DPgIIIAA1AgwgATUCDH0gA0Igh3whAyACIANC/////w+DPgIMIAA1AhAgATUCEH0gA0Igh3whAyACIANC/////w+DPgIQIAA1AhQgATUCFH0gA0Igh3whAyACIANC/////w+DPgIUIAA1AhggATUCGH0gA0Igh3whAyACIANC/////w+DPgIYIAA1AhwgATUCHH0gA0Igh3whAyACIANC/////w+DPgIcIAA1AiAgATUCIH0gA0Igh3whAyACIANC/////w+DPgIgIAA1AiQgATUCJH0gA0Igh3whAyACIANC/////w+DPgIkIAA1AiggATUCKH0gA0Igh3whAyACIANC/////w+DPgIoIAA1AiwgATUCLH0gA0Igh3whAyACIANC/////w+DPgIsIANCIIenC6ciGgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4gA0L/////D4MgADUCACIFIAE1AgAiBn58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgBSABNQIEIgh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgcgBn58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgBSABNQIIIgp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIgkgBn58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgBSABNQIMIgx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIgsgBn58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgBSABNQIQIg5+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIg0gBn58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgBSABNQIUIhB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIg8gBn58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgBSABNQIYIhJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIhEgBn58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgBSABNQIcIhR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIhMgBn58IQQgAyAEQiCIfCEDIAIgBD4CHCADQiCIIQQgA0L/////D4MgBSABNQIgIhZ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyALIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyANIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyATIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIgIhUgBn58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgBSABNQIkIhh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIkIhcgBn58IQQgAyAEQiCIfCEDIAIgBD4CJCADQiCIIQQgA0L/////D4MgBSABNQIoIhp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyALIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyARIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyATIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIoIhkgBn58IQMgBCADQiCIfCEEIAIgAz4CKCAEQiCIIQMgBEL/////D4MgBSABNQIsIhx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIsIhsgBn58IQQgAyAEQiCIfCEDIAIgBD4CLCADQiCIIQQgA0L/////D4MgByAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAafnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESASfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAIfnwhAyAEIANCIIh8IQQgAiADPgIwIARCIIghAyAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIAp+fCEEIAMgBEIgiHwhAyACIAQ+AjQgA0IgiCEEIANC/////w+DIAsgHH58IQMgBCADQiCIfCEEIANC/////w+DIA0gGn58IQMgBCADQiCIfCEEIANC/////w+DIA8gGH58IQMgBCADQiCIfCEEIANC/////w+DIBEgFn58IQMgBCADQiCIfCEEIANC/////w+DIBMgFH58IQMgBCADQiCIfCEEIANC/////w+DIBUgEn58IQMgBCADQiCIfCEEIANC/////w+DIBcgEH58IQMgBCADQiCIfCEEIANC/////w+DIBkgDn58IQMgBCADQiCIfCEEIANC/////w+DIBsgDH58IQMgBCADQiCIfCEEIAIgAz4COCAEQiCIIQMgBEL/////D4MgDSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAafnwhBCADIARCIIh8IQMgBEL/////D4MgESAYfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFyASfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGyAOfnwhBCADIARCIIh8IQMgAiAEPgI8IANCIIghBCADQv////8PgyAPIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIBB+fCEDIAQgA0IgiHwhBCACIAM+AkAgBEIgiCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgGn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgFn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgEn58IQQgAyAEQiCIfCEDIAIgBD4CRCADQiCIIQQgA0L/////D4MgEyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAafnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAUfnwhAyAEIANCIIh8IQQgAiADPgJIIARCIIghAyAEQv////8PgyAVIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIBZ+fCEEIAMgBEIgiHwhAyACIAQ+AkwgA0IgiCEEIANC/////w+DIBcgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGn58IQMgBCADQiCIfCEEIANC/////w+DIBsgGH58IQMgBCADQiCIfCEEIAIgAz4CUCAEQiCIIQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgGyAafnwhBCADIARCIIh8IQMgAiAEPgJUIANCIIghBCADQv////8PgyAbIBx+fCEDIAQgA0IgiHwhBCACIAM+AlggBEIgiCEDIAIgBD4CXAvOIBABfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiBiAGfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgQiB358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCCCIIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIMIgl+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhAiCn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAggCH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCFCILfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIYIgx+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAJIAl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhwiDX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAggC358IQIgAyACQiCIfCEDIAJC/////w+DIAkgCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCICIOfnwhAiADIAJCIIh8IQMgAkL/////D4MgByANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIkIg9+fCECIAMgAkIgiHwhAyACQv////8PgyAHIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAIIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAJIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIkIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AigiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgD358IQIgAyACQiCIfCEDIAJC/////w+DIAggDn58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAogDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAsgC358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCLCIRfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CLCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByARfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CMCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgDCANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CNCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgDCAOfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4COCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgDCAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAOfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CPCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDCAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAPfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CQCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgDiAPfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CRCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDiAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDyAPfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CSCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CTCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CUCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECARfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CVCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgESARfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CWCADIQQgBEIgiCEFIAEgBD4CXAsKACAAIAAgARAIC5ICAQF+IAA1AAAgAX4hAyACIAM+AAAgADUABCABfiADQiCIfCEDIAIgAz4ABCAANQAIIAF+IANCIIh8IQMgAiADPgAIIAA1AAwgAX4gA0IgiHwhAyACIAM+AAwgADUAECABfiADQiCIfCEDIAIgAz4AECAANQAUIAF+IANCIIh8IQMgAiADPgAUIAA1ABggAX4gA0IgiHwhAyACIAM+ABggADUAHCABfiADQiCIfCEDIAIgAz4AHCAANQAgIAF+IANCIIh8IQMgAiADPgAgIAA1ACQgAX4gA0IgiHwhAyACIAM+ACQgADUAKCABfiADQiCIfCEDIAIgAz4AKCAANQAsIAF+IANCIIh8IQMgAiADPgAsC04CAX4BfyAAIQMgAzUAACABfCECIAMgAj4AACACQiCIIQICQANAIAJQDQEgA0EEaiEDIAM1AAAgAnwhAiADIAI+AAAgAkIgiCECDAALCwuwAgcBfwF/AX8BfwF+AX4BfyACBEAgAiEFBUGIASEFCyADBEAgAyEEBUG4ASEECyAAIAQQACABQdgAEAAgBRABQegBEAFBLyEGQS8hBwJAA0BB2AAgB2otAAAgB0EDRnINASAHQQFrIQcMAAsLQdgAIAdqQQNrNQAAQgF8IQggCEIBUQRAQgBCAIAaCwJAA0ACQANAIAQgBmotAAAgBkEHRnINASAGQQFrIQYMAAsLIAQgBmpBB2spAAAhCSAJIAiAIQkgBiAHa0EEayEKAkADQCAJQoCAgIBwg1AgCkEATnENASAJQgiIIQkgCkEBaiEKDAALCyAJUARAIARB2AAQBUUNAkIBIQlBACEKC0HYACAJQZgCEAsgBEGYAiAKayAEEAcaIAUgCmogCRAMDAALCwu1AgsBfwF/AX8BfwF/AX8BfwF/AX8BfwF/QcgCIQNByAIQAUEAIQtB+AIhBSABQfgCEABBqAMhBEGoAxADQQAhDEHYAyEIIABB2AMQAEGIBCEGQbgEIQdByAUhCgJAA0AgCBACDQEgBSAIIAYgBxANIAYgBEHoBBAIIAsEQCAMBEBB6AQgAxAFBEBB6AQgAyAKEAcaQQAhDQUgA0HoBCAKEAcaQQEhDQsFQegEIAMgChAGGkEBIQ0LBSAMBEBB6AQgAyAKEAYaQQAhDQUgA0HoBBAFBEAgA0HoBCAKEAcaQQAhDQVB6AQgAyAKEAcaQQEhDQsLCyADIQkgBCEDIAohBCAJIQogDCELIA0hDCAFIQkgCCEFIAchCCAJIQcMAAsLIAsEQCABIAMgAhAHGgUgAyACEAALCwoAIABBiAcQBA8LLAAgACABIAIQBgRAIAJB+AUgAhAHGgUgAkH4BRAFBEAgAkH4BSACEAcaCwsLFwAgACABIAIQBwRAIAJB+AUgAhAGGgsLCwBBuAcgACABEBEL/CQDAX4BfgF+Qv3/8/8PIQJCACEDIAA1AgAgAn5C/////w+DIQQgADUCACADQiCIfEH4BTUCACAEfnwhAyAAIAM+AgAgADUCBCADQiCIfEH4BTUCBCAEfnwhAyAAIAM+AgQgADUCCCADQiCIfEH4BTUCCCAEfnwhAyAAIAM+AgggADUCDCADQiCIfEH4BTUCDCAEfnwhAyAAIAM+AgwgADUCECADQiCIfEH4BTUCECAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEH4BTUCFCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEH4BTUCGCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEH4BTUCHCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEH4BTUCICAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEH4BTUCJCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEH4BTUCKCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEH4BTUCLCAEfnwhAyAAIAM+AixBiAogA0IgiD4CAEIAIQMgADUCBCACfkL/////D4MhBCAANQIEIANCIIh8QfgFNQIAIAR+fCEDIAAgAz4CBCAANQIIIANCIIh8QfgFNQIEIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QfgFNQIIIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QfgFNQIMIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QfgFNQIQIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QfgFNQIUIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QfgFNQIYIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QfgFNQIcIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QfgFNQIgIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QfgFNQIkIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QfgFNQIoIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QfgFNQIsIAR+fCEDIAAgAz4CMEGICiADQiCIPgIEQgAhAyAANQIIIAJ+Qv////8PgyEEIAA1AgggA0IgiHxB+AU1AgAgBH58IQMgACADPgIIIAA1AgwgA0IgiHxB+AU1AgQgBH58IQMgACADPgIMIAA1AhAgA0IgiHxB+AU1AgggBH58IQMgACADPgIQIAA1AhQgA0IgiHxB+AU1AgwgBH58IQMgACADPgIUIAA1AhggA0IgiHxB+AU1AhAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxB+AU1AhQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxB+AU1AhggBH58IQMgACADPgIgIAA1AiQgA0IgiHxB+AU1AhwgBH58IQMgACADPgIkIAA1AiggA0IgiHxB+AU1AiAgBH58IQMgACADPgIoIAA1AiwgA0IgiHxB+AU1AiQgBH58IQMgACADPgIsIAA1AjAgA0IgiHxB+AU1AiggBH58IQMgACADPgIwIAA1AjQgA0IgiHxB+AU1AiwgBH58IQMgACADPgI0QYgKIANCIIg+AghCACEDIAA1AgwgAn5C/////w+DIQQgADUCDCADQiCIfEH4BTUCACAEfnwhAyAAIAM+AgwgADUCECADQiCIfEH4BTUCBCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEH4BTUCCCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEH4BTUCDCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEH4BTUCECAEfnwhAyAAIAM+AhwgADUCICADQiCIfEH4BTUCFCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEH4BTUCGCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEH4BTUCHCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEH4BTUCICAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEH4BTUCJCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEH4BTUCKCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEH4BTUCLCAEfnwhAyAAIAM+AjhBiAogA0IgiD4CDEIAIQMgADUCECACfkL/////D4MhBCAANQIQIANCIIh8QfgFNQIAIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QfgFNQIEIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QfgFNQIIIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QfgFNQIMIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QfgFNQIQIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QfgFNQIUIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QfgFNQIYIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QfgFNQIcIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QfgFNQIgIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QfgFNQIkIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QfgFNQIoIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QfgFNQIsIAR+fCEDIAAgAz4CPEGICiADQiCIPgIQQgAhAyAANQIUIAJ+Qv////8PgyEEIAA1AhQgA0IgiHxB+AU1AgAgBH58IQMgACADPgIUIAA1AhggA0IgiHxB+AU1AgQgBH58IQMgACADPgIYIAA1AhwgA0IgiHxB+AU1AgggBH58IQMgACADPgIcIAA1AiAgA0IgiHxB+AU1AgwgBH58IQMgACADPgIgIAA1AiQgA0IgiHxB+AU1AhAgBH58IQMgACADPgIkIAA1AiggA0IgiHxB+AU1AhQgBH58IQMgACADPgIoIAA1AiwgA0IgiHxB+AU1AhggBH58IQMgACADPgIsIAA1AjAgA0IgiHxB+AU1AhwgBH58IQMgACADPgIwIAA1AjQgA0IgiHxB+AU1AiAgBH58IQMgACADPgI0IAA1AjggA0IgiHxB+AU1AiQgBH58IQMgACADPgI4IAA1AjwgA0IgiHxB+AU1AiggBH58IQMgACADPgI8IAA1AkAgA0IgiHxB+AU1AiwgBH58IQMgACADPgJAQYgKIANCIIg+AhRCACEDIAA1AhggAn5C/////w+DIQQgADUCGCADQiCIfEH4BTUCACAEfnwhAyAAIAM+AhggADUCHCADQiCIfEH4BTUCBCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEH4BTUCCCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEH4BTUCDCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEH4BTUCECAEfnwhAyAAIAM+AiggADUCLCADQiCIfEH4BTUCFCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEH4BTUCGCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEH4BTUCHCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEH4BTUCICAEfnwhAyAAIAM+AjggADUCPCADQiCIfEH4BTUCJCAEfnwhAyAAIAM+AjwgADUCQCADQiCIfEH4BTUCKCAEfnwhAyAAIAM+AkAgADUCRCADQiCIfEH4BTUCLCAEfnwhAyAAIAM+AkRBiAogA0IgiD4CGEIAIQMgADUCHCACfkL/////D4MhBCAANQIcIANCIIh8QfgFNQIAIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QfgFNQIEIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QfgFNQIIIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QfgFNQIMIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QfgFNQIQIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QfgFNQIUIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QfgFNQIYIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QfgFNQIcIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QfgFNQIgIAR+fCEDIAAgAz4CPCAANQJAIANCIIh8QfgFNQIkIAR+fCEDIAAgAz4CQCAANQJEIANCIIh8QfgFNQIoIAR+fCEDIAAgAz4CRCAANQJIIANCIIh8QfgFNQIsIAR+fCEDIAAgAz4CSEGICiADQiCIPgIcQgAhAyAANQIgIAJ+Qv////8PgyEEIAA1AiAgA0IgiHxB+AU1AgAgBH58IQMgACADPgIgIAA1AiQgA0IgiHxB+AU1AgQgBH58IQMgACADPgIkIAA1AiggA0IgiHxB+AU1AgggBH58IQMgACADPgIoIAA1AiwgA0IgiHxB+AU1AgwgBH58IQMgACADPgIsIAA1AjAgA0IgiHxB+AU1AhAgBH58IQMgACADPgIwIAA1AjQgA0IgiHxB+AU1AhQgBH58IQMgACADPgI0IAA1AjggA0IgiHxB+AU1AhggBH58IQMgACADPgI4IAA1AjwgA0IgiHxB+AU1AhwgBH58IQMgACADPgI8IAA1AkAgA0IgiHxB+AU1AiAgBH58IQMgACADPgJAIAA1AkQgA0IgiHxB+AU1AiQgBH58IQMgACADPgJEIAA1AkggA0IgiHxB+AU1AiggBH58IQMgACADPgJIIAA1AkwgA0IgiHxB+AU1AiwgBH58IQMgACADPgJMQYgKIANCIIg+AiBCACEDIAA1AiQgAn5C/////w+DIQQgADUCJCADQiCIfEH4BTUCACAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEH4BTUCBCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEH4BTUCCCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEH4BTUCDCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEH4BTUCECAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEH4BTUCFCAEfnwhAyAAIAM+AjggADUCPCADQiCIfEH4BTUCGCAEfnwhAyAAIAM+AjwgADUCQCADQiCIfEH4BTUCHCAEfnwhAyAAIAM+AkAgADUCRCADQiCIfEH4BTUCICAEfnwhAyAAIAM+AkQgADUCSCADQiCIfEH4BTUCJCAEfnwhAyAAIAM+AkggADUCTCADQiCIfEH4BTUCKCAEfnwhAyAAIAM+AkwgADUCUCADQiCIfEH4BTUCLCAEfnwhAyAAIAM+AlBBiAogA0IgiD4CJEIAIQMgADUCKCACfkL/////D4MhBCAANQIoIANCIIh8QfgFNQIAIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QfgFNQIEIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QfgFNQIIIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QfgFNQIMIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QfgFNQIQIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QfgFNQIUIAR+fCEDIAAgAz4CPCAANQJAIANCIIh8QfgFNQIYIAR+fCEDIAAgAz4CQCAANQJEIANCIIh8QfgFNQIcIAR+fCEDIAAgAz4CRCAANQJIIANCIIh8QfgFNQIgIAR+fCEDIAAgAz4CSCAANQJMIANCIIh8QfgFNQIkIAR+fCEDIAAgAz4CTCAANQJQIANCIIh8QfgFNQIoIAR+fCEDIAAgAz4CUCAANQJUIANCIIh8QfgFNQIsIAR+fCEDIAAgAz4CVEGICiADQiCIPgIoQgAhAyAANQIsIAJ+Qv////8PgyEEIAA1AiwgA0IgiHxB+AU1AgAgBH58IQMgACADPgIsIAA1AjAgA0IgiHxB+AU1AgQgBH58IQMgACADPgIwIAA1AjQgA0IgiHxB+AU1AgggBH58IQMgACADPgI0IAA1AjggA0IgiHxB+AU1AgwgBH58IQMgACADPgI4IAA1AjwgA0IgiHxB+AU1AhAgBH58IQMgACADPgI8IAA1AkAgA0IgiHxB+AU1AhQgBH58IQMgACADPgJAIAA1AkQgA0IgiHxB+AU1AhggBH58IQMgACADPgJEIAA1AkggA0IgiHxB+AU1AhwgBH58IQMgACADPgJIIAA1AkwgA0IgiHxB+AU1AiAgBH58IQMgACADPgJMIAA1AlAgA0IgiHxB+AU1AiQgBH58IQMgACADPgJQIAA1AlQgA0IgiHxB+AU1AiggBH58IQMgACADPgJUIAA1AlggA0IgiHxB+AU1AiwgBH58IQMgACADPgJYQYgKIANCIIg+AixBiAogAEEwaiABEBALpkMzAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv3/8/8PIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AvgFIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC/AUiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKABiIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AoQGIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCiAYiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKMBiIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1ApAGIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUClAYiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCICInfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgEiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCICImIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKYBiIpIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhKCADQv////8PgyAJICh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIkIit+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIkIiogB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gKH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIARC/////w+DICkgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApwGIi0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEsIARC/////w+DIAkgLH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AigiL358IQMgBCADQiCIfCEEIANC/////w+DIAogK358IQMgBCADQiCIfCEEIANC/////w+DIA4gJ358IQMgBCADQiCIfCEEIANC/////w+DIBIgI358IQMgBCADQiCIfCEEIANC/////w+DIBYgH358IQMgBCADQiCIfCEEIANC/////w+DIBogG358IQMgBCADQiCIfCEEIANC/////w+DIB4gF358IQMgBCADQiCIfCEEIANC/////w+DICIgE358IQMgBCADQiCIfCEEIANC/////w+DICYgD358IQMgBCADQiCIfCEEIANC/////w+DICogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AigiLiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAofnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCoAYiMSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DITAgA0L/////D4MgCSAwfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCLCIzfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgDiArfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgFiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAffnwhBCADIARCIIh8IQMgBEL/////D4MgHiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgJiATfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgLiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCLCIyIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKkBiI1IAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhNCAEQv////8PgyAJIDR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgCiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgMiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgESAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAMfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAOIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1IBB+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIBIgM358IQMgBCADQiCIfCEEIANC/////w+DIBYgL358IQMgBCADQiCIfCEEIANC/////w+DIBogK358IQMgBCADQiCIfCEEIANC/////w+DIB4gJ358IQMgBCADQiCIfCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICYgH358IQMgBCADQiCIfCEEIANC/////w+DICogG358IQMgBCADQiCIfCEEIANC/////w+DIC4gF358IQMgBCADQiCIfCEEIANC/////w+DIDIgE358IQMgBCADQiCIfCEEIANC/////w+DIBUgNH58IQMgBCADQiCIfCEEIANC/////w+DIBkgMH58IQMgBCADQiCIfCEEIANC/////w+DIB0gLH58IQMgBCADQiCIfCEEIANC/////w+DICEgKH58IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIANC/////w+DICkgIH58IQMgBCADQiCIfCEEIANC/////w+DIC0gHH58IQMgBCADQiCIfCEEIANC/////w+DIDEgGH58IQMgBCADQiCIfCEEIANC/////w+DIDUgFH58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgFiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgHiArfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgJiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAffnwhBCADIARCIIh8IQMgBEL/////D4MgLiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgGSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgHSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgISAsfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAofnwhBCADIARCIIh8IQMgBEL/////D4MgKSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAYfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAaIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAmICd+fCEDIAQgA0IgiHwhBCADQv////8PgyAqICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAyIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICx+fCEDIAQgA0IgiHwhBCADQv////8PgyApICh+fCEDIAQgA0IgiHwhBCADQv////8PgyAtICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAxICB+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IBx+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIB4gM358IQQgAyAEQiCIfCEDIARC/////w+DICIgL358IQQgAyAEQiCIfCEDIARC/////w+DICYgK358IQQgAyAEQiCIfCEDIARC/////w+DICogJ358IQQgAyAEQiCIfCEDIARC/////w+DIC4gI358IQQgAyAEQiCIfCEDIARC/////w+DIDIgH358IQQgAyAEQiCIfCEDIARC/////w+DICEgNH58IQQgAyAEQiCIfCEDIARC/////w+DICUgMH58IQQgAyAEQiCIfCEDIARC/////w+DICkgLH58IQQgAyAEQiCIfCEDIARC/////w+DIC0gKH58IQQgAyAEQiCIfCEDIARC/////w+DIDEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgIH58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgIiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgMiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAkfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyAEQv////8PgyAmIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1ICh+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DICogM358IQMgBCADQiCIfCEEIANC/////w+DIC4gL358IQMgBCADQiCIfCEEIANC/////w+DIDIgK358IQMgBCADQiCIfCEEIANC/////w+DIC0gNH58IQMgBCADQiCIfCEEIANC/////w+DIDEgMH58IQMgBCADQiCIfCEEIANC/////w+DIDUgLH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgLiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgMSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgNSAwfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyAyIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IDR+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIAIgBD4CLCADpwRAIAJB+AUgAhAHGgUgAkH4BRAFBEAgAkH4BSACEAcaCwsLzUEpAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL9//P/DyEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQL4BSIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUC/AUiDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AoAGIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKEBiISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCiAYiFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AowGIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKQBiIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUClAYiHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCICIffnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApgGIiEgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEgIAJC/////w+DIAkgIH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiQiIn58IQIgAyACQiCIfCEDIAJC/////w+DIAogH358IQIgAyACQiCIfCEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMICB+fCECIAMgAkIgiHwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAhIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKcBiIkIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhIyACQv////8PgyAJICN+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIoIiV+fCECIAMgAkIgiHwhAyACQv////8PgyAKICJ+fCECIAMgAkIgiHwhAyACQv////8PgyANIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBx+fCECIAMgAkIgiHwhAyACQv////8PgyATIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAWIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCoAYiJyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DISYgAkL/////D4MgCSAmfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCLCIofnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAifnwhAiADIAJCIIh8IQMgAkL/////D4MgECAffnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgJn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gI358IQIgAyACQiCIfCEDIAJC/////w+DIBIgIH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAJC/////w+DICEgEX58IQIgAyACQiCIfCEDIAJC/////w+DICQgDn58IQIgAyACQiCIfCEDIAJC/////w+DICcgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqQGIiogCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEpIAJC/////w+DIAkgKX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKICh+fCECIAMgAkIgiHwhAyACQv////8PgyANICV+fCECIAMgAkIgiHwhAyACQv////8PgyAQICJ+fCECIAMgAkIgiHwhAyACQv////8PgyATIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAWIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAZIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiALfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANICh+fCECIAMgAkIgiHwhAyACQv////8PgyAQICV+fCECIAMgAkIgiHwhAyACQv////8PgyATICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAWIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAZIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgISAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAOfnwhAiADIAJCIIh8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQICh+fCECIAMgAkIgiHwhAyACQv////8PgyATICV+fCECIAMgAkIgiHwhAyACQv////8PgyAWICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAZIB9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAcIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgEiApfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAafnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiARfnwhAiADIAJCIIh8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyATICh+fCECIAMgAkIgiHwhAyACQv////8PgyAWICV+fCECIAMgAkIgiHwhAyACQv////8PgyAZICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAcIB9+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgFSApfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAUfnwhAiADIAJCIIh8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAWICh+fCECIAMgAkIgiHwhAyACQv////8PgyAZICV+fCECIAMgAkIgiHwhAyACQv////8PgyAcICJ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAfIB9+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAXfnwhAiADIAJCIIh8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAZICh+fCECIAMgAkIgiHwhAyACQv////8PgyAcICV+fCECIAMgAkIgiHwhAyACQv////8PgyAfICJ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAafnwhAiADIAJCIIh8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAcICh+fCECIAMgAkIgiHwhAyACQv////8PgyAfICV+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAiICJ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgHiApfnwhAiADIAJCIIh8IQMgAkL/////D4MgISAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAdfnwhAiADIAJCIIh8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAfICh+fCECIAMgAkIgiHwhAyACQv////8PgyAiICV+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgISApfnwhAiADIAJCIIh8IQMgAkL/////D4MgJCAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAjfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAgfnwhAiADIAJCIIh8IQMgASACPgIcIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAiICh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAlICV+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgJCApfnwhAiADIAJCIIh8IQMgAkL/////D4MgJyAmfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAjfnwhAiADIAJCIIh8IQMgASACPgIgIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAlICh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgJyApfnwhAiADIAJCIIh8IQMgAkL/////D4MgKiAmfnwhAiADIAJCIIh8IQMgASACPgIkIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAoICh+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgKiApfnwhAiADIAJCIIh8IQMgASACPgIoIAMhBCAEQiCIIQUgASAEPgIsIAWnBEAgAUH4BSABEAcaBSABQfgFEAUEQCABQfgFIAEQBxoLCwsKACAAIAAgARAUCwsAIABB2AYgARAUCxUAIABBiBMQAEG4ExABQYgTIAEQEwsRACAAQegTEBhB6BNBmAgQBQskACAAEAIEQEEADwsgAEGYFBAYQZgUQZgIEAUEQEF/DwtBAQ8LFwAgACABEBggAUH4BSABEA4gASABEBcLCQBBiAcgABAAC8sBBAF/AX8BfwF/IAIQAUEwIQUgACEDAkADQCAFIAFLDQEgBUEwRgRAQcgUEBwFQcgUQdgGQcgUEBQLIANByBRB+BQQFCACQfgUIAIQECADQTBqIQMgBUEwaiEFDAALCyABQTBwIQQgBEUEQA8LQfgUEAFBACEGAkADQCAGIARGDQEgBiADLQAAOgD4FCADQQFqIQMgBkEBaiEGDAALCyAFQTBGBEBByBQQHAVByBRB2AZByBQQFAtB+BRByBRB+BQQFCACQfgUIAIQEAscACABIAJBqBUQHUGoFUGoFRAXIABBqBUgAxAUC/gBBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakEwbGo2AgAgBRAcIAAhBiAFQTBqIQVBACEIAkADQCAIIAJGDQEgBhACBEAgBUEwayAFEAAFIAYgBUEwayAFEBQLIAYgAWohBiAFQTBqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUEwayEFIAMgAkEBayAEbGohByAFIAUQGwJAA0AgCEUNASAGEAIEQCAFIAVBMGsQACAHEAEFIAVBMGtB2BUQACAFIAYgBUEwaxAUIAVB2BUgBxAUCyAGIAFrIQYgByAEayEHIAVBMGshBSAIQQFrIQgMAAsLQQAgBTYCAAs+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAXIARBMGohBCAFQTBqIQUgA0EBaiEDDAALCws+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAYIARBMGohBCAFQTBqIQUgA0EBaiEDDAALCwuyAgIBfwF/IAJFBEAgAxAcDwsgAEGIFhAAIAMQHCACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADEBUgBUGAAU8EQCAFQYABayEFIANBiBYgAxAUCyADIAMQFSAFQcAATwRAIAVBwABrIQUgA0GIFiADEBQLIAMgAxAVIAVBIE8EQCAFQSBrIQUgA0GIFiADEBQLIAMgAxAVIAVBEE8EQCAFQRBrIQUgA0GIFiADEBQLIAMgAxAVIAVBCE8EQCAFQQhrIQUgA0GIFiADEBQLIAMgAxAVIAVBBE8EQCAFQQRrIQUgA0GIFiADEBQLIAMgAxAVIAVBAk8EQCAFQQJrIQUgA0GIFiADEBQLIAMgAxAVIAVBAU8EQCAFQQFrIQUgA0GIFiADEBQLIARFDQEMAAsLC94BAwF/AX8BfyAAEAIEQCABEAEPC0EBIQJBqAlBuBYQACAAQfgIQTBB6BYQIiAAQdgJQTBBmBcQIgJAA0BB6BZBiAcQBA0BQegWQcgXEBVBASEDAkADQEHIF0GIBxAEDQFByBdByBcQFSADQQFqIQMMAAsLQbgWQfgXEAAgAiADa0EBayEEAkADQCAERQ0BQfgXQfgXEBUgBEEBayEEDAALCyADIQJB+BdBuBYQFUHoFkG4FkHoFhAUQZgXQfgXQZgXEBQMAAsLQZgXEBkEQEGYFyABEBIFQZgXIAEQAAsLIAAgABACBEBBAQ8LIABB6AdBMEGoGBAiQagYQYgHEAQLKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAszACAAKQMYUARAIAApAxBQBEAgACkDCFAEQCAAKQMAUA8FQQAPCwVBAA8LBUEADwtBAA8LHgAgAEIBNwMAIABCADcDCCAAQgA3AxAgAEIANwMYC0cAIAApAxggASkDGFEEQCAAKQMQIAEpAxBRBEAgACkDCCABKQMIUQRAIAApAwAgASkDAFEPBUEADwsFQQAPCwVBAA8LQQAPC30AIAApAxggASkDGFQEQEEADwUgACkDGCABKQMYVgRAQQEPBSAAKQMQIAEpAxBUBEBBAA8FIAApAxAgASkDEFYEQEEBDwUgACkDCCABKQMIVARAQQAPBSAAKQMIIAEpAwhWBEBBAQ8FIAApAwAgASkDAFoPCwsLCwsLQQAPC9QBAQF+IAA1AgAgATUCAHwhAyACIAM+AgAgADUCBCABNQIEfCADQiCIfCEDIAIgAz4CBCAANQIIIAE1Agh8IANCIIh8IQMgAiADPgIIIAA1AgwgATUCDHwgA0IgiHwhAyACIAM+AgwgADUCECABNQIQfCADQiCIfCEDIAIgAz4CECAANQIUIAE1AhR8IANCIIh8IQMgAiADPgIUIAA1AhggATUCGHwgA0IgiHwhAyACIAM+AhggADUCHCABNQIcfCADQiCIfCEDIAIgAz4CHCADQiCIpwuMAgEBfiAANQIAIAE1AgB9IQMgAiADQv////8Pgz4CACAANQIEIAE1AgR9IANCIId8IQMgAiADQv////8Pgz4CBCAANQIIIAE1Agh9IANCIId8IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCADQiCHpwuPEBIBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4gA0L/////D4MgADUCACIFIAE1AgAiBn58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgBSABNQIEIgh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgcgBn58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgBSABNQIIIgp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIgkgBn58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgBSABNQIMIgx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIgsgBn58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgBSABNQIQIg5+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIg0gBn58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgBSABNQIUIhB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIg8gBn58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgBSABNQIYIhJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIhEgBn58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgBSABNQIcIhR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIhMgBn58IQQgAyAEQiCIfCEDIAIgBD4CHCADQiCIIQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIAp+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIAIgAz4CKCAEQiCIIQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyACIAQ+AjwLjBIMAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CLCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCyANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CMCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDCANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CNCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4COCADIQQgBEIgiCEFIAEgBD4CPAsKACAAIAAgARAtC7YBAQF+IAA1AAAgAX4hAyACIAM+AAAgADUABCABfiADQiCIfCEDIAIgAz4ABCAANQAIIAF+IANCIIh8IQMgAiADPgAIIAA1AAwgAX4gA0IgiHwhAyACIAM+AAwgADUAECABfiADQiCIfCEDIAIgAz4AECAANQAUIAF+IANCIIh8IQMgAiADPgAUIAA1ABggAX4gA0IgiHwhAyACIAM+ABggADUAHCABfiADQiCIfCEDIAIgAz4AHAtOAgF+AX8gACEDIAM1AAAgAXwhAiADIAI+AAAgAkIgiCECAkADQCACUA0BIANBBGohAyADNQAAIAJ8IQIgAyACPgAAIAJCIIghAgwACwsLsAIHAX8BfwF/AX8BfgF+AX8gAgRAIAIhBQVBmBkhBQsgAwRAIAMhBAVBuBkhBAsgACAEECUgAUH4GBAlIAUQJkHYGRAmQR8hBkEfIQcCQANAQfgYIAdqLQAAIAdBA0ZyDQEgB0EBayEHDAALC0H4GCAHakEDazUAAEIBfCEIIAhCAVEEQEIAQgCAGgsCQANAAkADQCAEIAZqLQAAIAZBB0ZyDQEgBkEBayEGDAALCyAEIAZqQQdrKQAAIQkgCSAIgCEJIAYgB2tBBGshCgJAA0AgCUKAgICAcINQIApBAE5xDQEgCUIIiCEJIApBAWohCgwACwsgCVAEQCAEQfgYECpFDQJCASEJQQAhCgtB+BggCUH4GRAwIARB+BkgCmsgBBAsGiAFIApqIAkQMQwACwsLtQILAX8BfwF/AX8BfwF/AX8BfwF/AX8Bf0GYGiEDQZgaECZBACELQbgaIQUgAUG4GhAlQdgaIQRB2BoQKEEAIQxB+BohCCAAQfgaECVBmBshBkG4GyEHQZgcIQoCQANAIAgQJw0BIAUgCCAGIAcQMiAGIARB2BsQLSALBEAgDARAQdgbIAMQKgRAQdgbIAMgChAsGkEAIQ0FIANB2BsgChAsGkEBIQ0LBUHYGyADIAoQKxpBASENCwUgDARAQdgbIAMgChArGkEAIQ0FIANB2BsQKgRAIANB2BsgChAsGkEAIQ0FQdgbIAMgChAsGkEBIQ0LCwsgAyEJIAQhAyAKIQQgCSEKIAwhCyANIQwgBSEJIAghBSAHIQggCSEHDAALCyALBEAgASADIAIQLBoFIAMgAhAlCwsKACAAQZgdECkPCywAIAAgASACECsEQCACQbgcIAIQLBoFIAJBuBwQKgRAIAJBuBwgAhAsGgsLCxcAIAAgASACECwEQCACQbgcIAIQKxoLCwsAQbgdIAAgARA2C5wRAwF+AX4BfkL/////DyECQgAhAyAANQIAIAJ+Qv////8PgyEEIAA1AgAgA0IgiHxBuBw1AgAgBH58IQMgACADPgIAIAA1AgQgA0IgiHxBuBw1AgQgBH58IQMgACADPgIEIAA1AgggA0IgiHxBuBw1AgggBH58IQMgACADPgIIIAA1AgwgA0IgiHxBuBw1AgwgBH58IQMgACADPgIMIAA1AhAgA0IgiHxBuBw1AhAgBH58IQMgACADPgIQIAA1AhQgA0IgiHxBuBw1AhQgBH58IQMgACADPgIUIAA1AhggA0IgiHxBuBw1AhggBH58IQMgACADPgIYIAA1AhwgA0IgiHxBuBw1AhwgBH58IQMgACADPgIcQZgfIANCIIg+AgBCACEDIAA1AgQgAn5C/////w+DIQQgADUCBCADQiCIfEG4HDUCACAEfnwhAyAAIAM+AgQgADUCCCADQiCIfEG4HDUCBCAEfnwhAyAAIAM+AgggADUCDCADQiCIfEG4HDUCCCAEfnwhAyAAIAM+AgwgADUCECADQiCIfEG4HDUCDCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEG4HDUCECAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEG4HDUCFCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEG4HDUCGCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEG4HDUCHCAEfnwhAyAAIAM+AiBBmB8gA0IgiD4CBEIAIQMgADUCCCACfkL/////D4MhBCAANQIIIANCIIh8QbgcNQIAIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QbgcNQIEIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QbgcNQIIIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QbgcNQIMIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QbgcNQIQIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QbgcNQIUIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QbgcNQIYIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QbgcNQIcIAR+fCEDIAAgAz4CJEGYHyADQiCIPgIIQgAhAyAANQIMIAJ+Qv////8PgyEEIAA1AgwgA0IgiHxBuBw1AgAgBH58IQMgACADPgIMIAA1AhAgA0IgiHxBuBw1AgQgBH58IQMgACADPgIQIAA1AhQgA0IgiHxBuBw1AgggBH58IQMgACADPgIUIAA1AhggA0IgiHxBuBw1AgwgBH58IQMgACADPgIYIAA1AhwgA0IgiHxBuBw1AhAgBH58IQMgACADPgIcIAA1AiAgA0IgiHxBuBw1AhQgBH58IQMgACADPgIgIAA1AiQgA0IgiHxBuBw1AhggBH58IQMgACADPgIkIAA1AiggA0IgiHxBuBw1AhwgBH58IQMgACADPgIoQZgfIANCIIg+AgxCACEDIAA1AhAgAn5C/////w+DIQQgADUCECADQiCIfEG4HDUCACAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEG4HDUCBCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEG4HDUCCCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEG4HDUCDCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEG4HDUCECAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEG4HDUCFCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEG4HDUCGCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEG4HDUCHCAEfnwhAyAAIAM+AixBmB8gA0IgiD4CEEIAIQMgADUCFCACfkL/////D4MhBCAANQIUIANCIIh8QbgcNQIAIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QbgcNQIEIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QbgcNQIIIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QbgcNQIMIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QbgcNQIQIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QbgcNQIUIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QbgcNQIYIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QbgcNQIcIAR+fCEDIAAgAz4CMEGYHyADQiCIPgIUQgAhAyAANQIYIAJ+Qv////8PgyEEIAA1AhggA0IgiHxBuBw1AgAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxBuBw1AgQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxBuBw1AgggBH58IQMgACADPgIgIAA1AiQgA0IgiHxBuBw1AgwgBH58IQMgACADPgIkIAA1AiggA0IgiHxBuBw1AhAgBH58IQMgACADPgIoIAA1AiwgA0IgiHxBuBw1AhQgBH58IQMgACADPgIsIAA1AjAgA0IgiHxBuBw1AhggBH58IQMgACADPgIwIAA1AjQgA0IgiHxBuBw1AhwgBH58IQMgACADPgI0QZgfIANCIIg+AhhCACEDIAA1AhwgAn5C/////w+DIQQgADUCHCADQiCIfEG4HDUCACAEfnwhAyAAIAM+AhwgADUCICADQiCIfEG4HDUCBCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEG4HDUCCCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEG4HDUCDCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEG4HDUCECAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEG4HDUCFCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEG4HDUCGCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEG4HDUCHCAEfnwhAyAAIAM+AjhBmB8gA0IgiD4CHEGYHyAAQSBqIAEQNQu+HyMBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8PIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1ArgcIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCvBwiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLAHCIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AsQcIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCyBwiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLMHCIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AtAcIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC1BwiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gJH58IQMgBCADQiCIfCEEIANC/////w+DIBEgIH58IQMgBCADQiCIfCEEIANC/////w+DIBUgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGH58IQMgBCADQiCIfCEEIANC/////w+DIB0gFH58IQMgBCADQiCIfCEEIANC/////w+DICEgEH58IQMgBCADQiCIfCEEIANC/////w+DICUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESAkfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgISAUfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gIH58IQQgAyAEQiCIfCEDIARC/////w+DICEgHH58IQQgAyAEQiCIfCEDIARC/////w+DICUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgAiAEPgIcIAOnBEAgAkG4HCACECwaBSACQbgcECoEQCACQbgcIAIQLBoLCwu7IR0BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8PIQZCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgcgB358IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEIIAJC/////w+DQQA1ArgcIgkgCH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgQiCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8Pg0EANQK8HCIMIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIIIg1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCwBwiDyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQ4gAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCDCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AsQcIhIgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyERIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhAiE358IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIA5+fCECIAMgAkIgiHwhAyACQv////8PgyASIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLIHCIVIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFCACQv////8PgyAJIBR+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIUIhZ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBN+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCzBwiGCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRcgAkL/////D4MgCSAXfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCGCIZfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgF358IQIgAyACQiCIfCEDIAJC/////w+DIA8gFH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBggC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtAcIhsgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEaIAJC/////w+DIAkgGn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhwiHH58IQIgAyACQiCIfCEDIAJC/////w+DIAogGX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gFn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBd+fCECIAMgAkIgiHwhAyACQv////8PgyASIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAYIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAbIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLUHCIeIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhHSACQv////8PgyAJIB1+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gHX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgF358IQIgAyACQiCIfCEDIAJC/////w+DIBggFH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCED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AXELCwAgAEHAAWoQkAELEAAgABCSASAAQeAAahCSAQsZACAAEJIBIABB4ABqEJMBIABBwAFqEJIBC4ICACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3ggASAAKQOAATcDgAEgASAAKQOIATcDiAEgASAAKQOQATcDkAEgASAAKQOYATcDmAEgASAAKQOgATcDoAEgASAAKQOoATcDqAEgASAAKQOwATcDsAEgASAAKQO4ATcDuAELkgMAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYIAEgACkDYDcDYCABIAApA2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeCABIAApA4ABNwOAASABIAApA4gBNwOIASABIAApA5ABNwOQASABIAApA5gBNwOYASABIAApA6ABNwOgASABIAApA6gBNwOoASABIAApA7ABNwOwASABIAApA7gBNwO4ASABIAApA8ABNwPAASABIAApA8gBNwPIASABIAApA9ABNwPQASABIAApA9gBNwPYASABIAApA+ABNwPgASABIAApA+gBNwPoASABIAApA/ABNwPwASABIAApA/gBNwP4ASABIAApA4ACNwOAAiABIAApA4gCNwOIAiABIAApA5ACNwOQAiABIAApA5gCNwOYAgsvACAAEKcBBEAgARCqAQUgAUHAAWoQkwEgAEHgAGogAUHgAGoQlAEgACABEJQBCwscAQF/IAAgARCeASAAQeAAaiABQeAAahCeAXEPC4sBAQF/IABBwAFqIQIgABCoAQRAIAEQpwEPCyABEKcBBEBBAA8LIAIQkQEEQCAAIAEQrgEPCyACQaiHARCXASABQaiHAUGIiAEQlQEgAkGohwFB6IgBEJUBIAFB4ABqQeiIAUHIiQEQlQEgAEGIiAEQngEEQCAAQeAAakHIiQEQngEEQEEBDwsLQQAPC9kBAgF/AX8gAEHAAWohAiABQcABaiEDIAAQqAEEQCABEKgBDwsgARCoAQRAQQAPCyACEJEBBEAgASAAEK8BDwsgAxCRAQRAIAAgARCvAQ8LIAJBqIoBEJcBIANBiIsBEJcBIABBiIsBQeiLARCVASABQaiKAUHIjAEQlQEgAkGoigFBqI0BEJUBIANBiIsBQYiOARCVASAAQeAAakGIjgFB6I4BEJUBIAFB4ABqQaiNAUHIjwEQlQFB6IsBQciMARCeAQRAQeiOAUHIjwEQngEEQEEBDwsLQQAPC6wCACAAEKcBBEAgACABEK0BDwsgAEGokAEQlwEgAEHgAGpBiJEBEJcBQYiRAUHokQEQlwEgAEGIkQFByJIBEJgBQciSAUHIkgEQlwFByJIBQaiQAUHIkgEQmQFByJIBQeiRAUHIkgEQmQFByJIBQciSAUHIkgEQmAFBqJABQaiQAUGokwEQmAFBqJMBQaiQAUGokwEQmAEgAEHgAGogAEHgAGogAUHAAWoQmAFBqJMBIAEQlwEgAUHIkgEgARCZASABQciSASABEJkBQeiRAUHokQFBiJQBEJgBQYiUAUGIlAFBiJQBEJgBQYiUAUGIlAFBiJQBEJgBQciSASABIAFB4ABqEJkBIAFB4ABqQaiTASABQeAAahCVASABQeAAakGIlAEgAUHgAGoQmQEL1AIAIAAQqAEEQCAAIAEQrAEPCyAAQcABahCRAQRAIAAgARCxAQ8PCyAAQeiUARCXASAAQeAAakHIlQEQlwFByJUBQaiWARCXASAAQciVAUGIlwEQmAFBiJcBQYiXARCXAUGIlwFB6JQBQYiXARCZAUGIlwFBqJYBQYiXARCZAUGIlwFBiJcBQYiXARCYAUHolAFB6JQBQeiXARCYAUHolwFB6JQBQeiXARCYAUHolwFByJgBEJcBIABB4ABqIABBwAFqQaiZARCVAUGIlwFBiJcBIAEQmAFByJgBIAEgARCZAUGolgFBqJYBQYiaARCYAUGImgFBiJoBQYiaARCYAUGImgFBiJoBQYiaARCYAUGIlwEgASABQeAAahCZASABQeAAakHolwEgAUHgAGoQlQEgAUHgAGpBiJoBIAFB4ABqEJkBQaiZAUGomQEgAUHAAWoQmAEL7AIBAX8gAEHAAWohAyAAEKcBBEAgASACEKsBIAJBwAFqEJMBDwsgARCnAQRAIAAgAhCrASACQcABahCTAQ8LIAAgARCeAQRAIABB4ABqIAFB4ABqEJ4BBEAgASACELEBDwsLIAEgAEHomgEQmQEgAUHgAGogAEHgAGpBqJwBEJkBQeiaAUHImwEQlwFByJsBQcibAUGInQEQmAFBiJ0BQYidAUGInQEQmAFB6JoBQYidAUHonQEQlQFBqJwBQaicAUHIngEQmAEgAEGInQFBiKABEJUBQcieAUGonwEQlwFBiKABQYigAUHooAEQmAFBqJ8BQeidASACEJkBIAJB6KABIAIQmQEgAEHgAGpB6J0BQcihARCVAUHIoQFByKEBQcihARCYAUGIoAEgAiACQeAAahCZASACQeAAakHIngEgAkHgAGoQlQEgAkHgAGpByKEBIAJB4ABqEJkBQeiaAUHomgEgAkHAAWoQmAEL3AMBAX8gAEHAAWohAyAAEKgBBEAgASACEKsBIAJBwAFqEJMBDwsgARCnAQRAIAAgAhCsAQ8LIAMQkQEEQCAAIAEgAhCzAQ8LIANBqKIBEJcBIAFBqKIBQYijARCVASADQaiiAUHoowEQlQEgAUHgAGpB6KMBQcikARCVASAAQYijARCeAQRAIABB4ABqQcikARCeAQRAIAEgAhCxAQ8LC0GIowEgAEGopQEQmQFByKQBIABB4ABqQeimARCZAUGopQFBiKYBEJcBQYimAUGIpgFByKcBEJgBQcinAUHIpwFByKcBEJgBQailAUHIpwFBqKgBEJUBQeimAUHopgFBiKkBEJgBIABByKcBQciqARCVAUGIqQFB6KkBEJcBQciqAUHIqgFBqKsBEJgBQeipAUGoqAEgAhCZASACQairASACEJkBIABB4ABqQaioAUGIrAEQlQFBiKwBQYisAUGIrAEQmAFByKoBIAIgAkHgAGoQmQEgAkHgAGpBiKkBIAJB4ABqEJUBIAJB4ABqQYisASACQeAAahCZASADQailASACQcABahCYASACQcABaiACQcABahCXASACQcABakGoogEgAkHAAWoQmQEgAkHAAWpBiKYBIAJBwAFqEJkBC6UEAgF/AX8gAEHAAWohAyABQcABaiEEIAAQqAEEQCABIAIQrAEPCyABEKgBBEAgACACEKwB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QcABahCVASADQcABakH4zgMgA0HAAWoQmQEgA0HAAWpB2M8DIANBwAFqEJgBC5ABACAAIAEgAkH40QMQqAIgAEGgAmogA0GY1AMQpwIgAiADQbjWAxCYASAAQaACaiAAIARBoAJqEIMCIARBoAJqIAFBuNYDIARBoAJqEKgCIARBoAJqQfjRAyAEQaACahCEAiAEQaACakGY1AMgBEGgAmoQhAJBmNQDIAQQgAIgBCAEEI8CIARB+NEDIAQQgwILUAAgASAAQTBqQZjXAxAUIAFBMGogAEEwakHI1wMQFCABQeAAaiAAQfjXAxAUIAFBkAFqIABBqNgDEBQgAiABQcABakH41wNBmNcDIAIQqQILbAAgAEHY+gQgARCVASAAQeAAakG4+wQgAUHgAGoQlQEgAEHAAWpBmPwEIAFBwAFqEJUBIABBoAJqQfj8BCABQaACahCVASAAQYADakHY/QQgAUGAA2oQlQEgAEHgA2pBuP4EIAFB4ANqEJUBC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQZj/BCABEJUBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakH4/wQgAUHgAGoQlQEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQdiABSABQcABahCVASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpBuIEFIAFBoAJqEJUBIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakGYggUgAUGAA2oQlQEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQfiCBSABQeADahCVAQtsACAAQdiDBSABEJUBIABB4ABqQbiEBSABQeAAahCVASAAQcABakGYhQUgAUHAAWoQlQEgAEGgAmpB+IUFIAFBoAJqEJUBIABBgANqQdiGBSABQYADahCVASAAQeADakG4hwUgAUHgA2oQlQELigIAIAAgARAAIABBMGogAUEwahASIAFBmIgFIAEQlQEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahASIAFB4ABqQfiIBSABQeAAahCVASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBIgAUHAAWpB2IkFIAFBwAFqEJUBIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQEiABQaACakG4igUgAUGgAmoQlQEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahASIAFBgANqQZiLBSABQYADahCVASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBIgAUHgA2pB+IsFIAFB4ANqEJUBC2wAIABB2IwFIAEQlQEgAEHgAGpBuI0FIAFB4ABqEJUBIABBwAFqQZiOBSABQcABahCVASAAQaACakH4jgUgAUGgAmoQlQEgAEGAA2pB2I8FIAFBgANqEJUBIABB4ANqQbiQBSABQeADahCVAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUGYkQUgARCVASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpB+JEFIAFB4ABqEJUBIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakHYkgUgAUHAAWoQlQEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQbiTBSABQaACahCVASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pBmJQFIAFBgANqEJUBIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakH4lAUgAUHgA2oQlQELbAAgAEHYlQUgARCVASAAQeAAakG4lgUgAUHgAGoQlQEgAEHAAWpBmJcFIAFBwAFqEJUBIABBoAJqQfiXBSABQaACahCVASAAQYADakHYmAUgAUGAA2oQlQEgAEHgA2pBuJkFIAFB4ANqEJUBC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQZiaBSABEJUBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakH4mgUgAUHgAGoQlQEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQdibBSABQcABahCVASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpBuJwFIAFBoAJqEJUBIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakGYnQUgAUGAA2oQlQEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQfidBSABQeADahCVAQtsACAAQdieBSABEJUBIABB4ABq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";
            var pq$1 = 760;
            var pr$1 = 3640;
            var pG1gen$1 = 42344;
            var pG1zero$1 = 42488;
            var pG1b$1 = 5016;
            var pG2gen$1 = 42632;
            var pG2zero$1 = 42920;
            var pG2b$1 = 17224;
            var pOneT$1 = 43208;
            var prePSize$1 = 288;
            var preQSize$1 = 20448;
            var n8q$1 = 48;
            var n8r$1 = 32;
            var q$1 = "4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559787";
            var r$1 = "52435875175126190479447740508185965837690552500527637822603658699938581184513";

var bls12381_wasm = {
	code: code$1,
	pq: pq$1,
	pr: pr$1,
	pG1gen: pG1gen$1,
	pG1zero: pG1zero$1,
	pG1b: pG1b$1,
	pG2gen: pG2gen$1,
	pG2zero: pG2zero$1,
	pG2b: pG2b$1,
	pOneT: pOneT$1,
	prePSize: prePSize$1,
	preQSize: preQSize$1,
	n8q: n8q$1,
	n8r: n8r$1,
	q: q$1,
	r: r$1
};

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmsnark (Web Assembly zkSnark Prover).

    wasmsnark is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmsnark is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
*/

// module.exports.buildF1 = require("./src/f1.js");
// module.exports.buildBn128 = require("./src/bn128.js");
// module.exports.buildMnt6753 = require("./src/mnt6753.js");

var bn128_wasm$1 = bn128_wasm;
var bls12381_wasm$1 = bls12381_wasm;
// module.exports.mnt6753_wasm = require("./build/mnt6753_wasm.js");

var wasmcurves = {
	bn128_wasm: bn128_wasm$1,
	bls12381_wasm: bls12381_wasm$1
};

/* global BigInt */

function stringifyBigInts(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (o instanceof Uint8Array) {
        return fromRprLE(o, 0);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = stringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int(buff) {
    let res = 0n;
    let i = buff.length;
    let offset = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i>0) {
        if (i >= 4) {
            i -= 4;
            res += BigInt(buffV.getUint32(i)) << BigInt(offset*8);
            offset += 4;
        } else if (i >= 2) {
            i -= 2;
            res += BigInt(buffV.getUint16(i)) << BigInt(offset*8);
            offset += 2;
        } else {
            i -= 1;
            res += BigInt(buffV.getUint8(i)) << BigInt(offset*8);
            offset += 1;
        }
    }
    return res;
}

function beInt2Buff(n, len) {
    let r = n;
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = len;
    while (o > 0) {
        if (o-4 >= 0) {
            o -= 4;
            buffV.setUint32(o, Number(r & 0xFFFFFFFFn));
            r = r >> 32n;
        } else if (o-2 >= 0) {
            o -= 2;
            buffV.setUint16(o, Number(r & 0xFFFFn));
            r = r >> 16n;
        } else {
            o -= 1;
            buffV.setUint8(o, Number(r & 0xFFn));
            r = r >> 8n;
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}


function leBuff2int(buff) {
    let res = 0n;
    let i = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i<buff.length) {
        if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint32(i, true)) << BigInt( i*8);
            i += 4;
        } else if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint16(i, true)) << BigInt( i*8);
            i += 2;
        } else {
            res += BigInt(buffV.getUint8(i, true)) << BigInt( i*8);
            i += 1;
        }
    }
    return res;
}

function leInt2Buff(n, len) {
    let r = n;
    if (typeof len === "undefined") {
        len = Math.floor((bitLength$2(n) - 1) / 8) +1;
        if (len==0) len = 1;
    }
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = 0;
    while (o < len) {
        if (o+4 <= len) {
            buffV.setUint32(o, Number(r & 0xFFFFFFFFn), true );
            o += 4;
            r = r >> 32n;
        } else if (o+2 <= len) {
            buffV.setUint16(Number(o, r & 0xFFFFn), true );
            o += 2;
            r = r >> 16n;
        } else {
            buffV.setUint8(Number(o, r & 0xFFn), true );
            o += 1;
            r = r >> 8n;
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

var utils_native = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringifyBigInts: stringifyBigInts,
    unstringifyBigInts: unstringifyBigInts,
    beBuff2int: beBuff2int,
    beInt2Buff: beInt2Buff,
    leBuff2int: leBuff2int,
    leInt2Buff: leInt2Buff
});

function stringifyBigInts$1(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts$1);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = stringifyBigInts$1(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts$1(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInteger(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts$1);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts$1(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int$1(buff) {
    let res = BigInteger.zero;
    for (let i=0; i<buff.length; i++) {
        const n = BigInteger(buff[buff.length - i - 1]);
        res = res.add(n.shiftLeft(i*8));
    }
    return res;
}

function beInt2Buff$1(n, len) {
    let r = n;
    let o =len-1;
    const buff = new Uint8Array(len);
    while ((r.gt(BigInteger.zero))&&(o>=0)) {
        let c = Number(r.and(BigInteger("255")));
        buff[o] = c;
        o--;
        r = r.shiftRight(8);
    }
    if (!r.eq(BigInteger.zero)) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}


function leBuff2int$1 (buff) {
    let res = BigInteger.zero;
    for (let i=0; i<buff.length; i++) {
        const n = BigInteger(buff[i]);
        res = res.add(n.shiftLeft(i*8));
    }
    return res;
}

function leInt2Buff$1(n, len) {
    let r = n;
    let o =0;
    const buff = new Uint8Array(len);
    while ((r.gt(BigInteger.zero))&&(o<buff.length)) {
        let c = Number(r.and(BigInteger(255)));
        buff[o] = c;
        o++;
        r = r.shiftRight(8);
    }
    if (!r.eq(BigInteger.zero)) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

var utils_bigint = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringifyBigInts: stringifyBigInts$1,
    unstringifyBigInts: unstringifyBigInts$1,
    beBuff2int: beBuff2int$1,
    beInt2Buff: beInt2Buff$1,
    leBuff2int: leBuff2int$1,
    leInt2Buff: leInt2Buff$1
});

let utils = {};

const supportsNativeBigInt$2 = typeof BigInt === "function";
if (supportsNativeBigInt$2) {
    Object.assign(utils, utils_native);
} else {
    Object.assign(utils, utils_bigint);
}


const _revTable$1 = [];
for (let i=0; i<256; i++) {
    _revTable$1[i] = _revSlow$1(i, 8);
}

function _revSlow$1(idx, bits) {
    let res =0;
    let a = idx;
    for (let i=0; i<bits; i++) {
        res <<= 1;
        res = res | (a &1);
        a >>=1;
    }
    return res;
}

utils.bitReverse = function bitReverse(idx, bits) {
    return (
        _revTable$1[idx >>> 24] |
        (_revTable$1[(idx >>> 16) & 0xFF] << 8) |
        (_revTable$1[(idx >>> 8) & 0xFF] << 16) |
        (_revTable$1[idx & 0xFF] << 24)
    ) >>> (32-bits);
};


utils.log2 = function log2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
};

utils.buffReverseBits = function buffReverseBits(buff, eSize) {
    const n = buff.byteLength /eSize;
    const bits = utils.log2(n);
    if (n != (1 << bits)) {
        throw new Error("Invalid number of pointers");
    }
    for (let i=0; i<n; i++) {
        const r = utils.bitReverse(i,bits);
        if (i>r) {
            const tmp = buff.slice(i*eSize, (i+1)*eSize);
            buff.set( buff.slice(r*eSize, (r+1)*eSize), i*eSize);
            buff.set(tmp, r*eSize);
        }
    }
};

let {
    bitReverse,
    log2: log2$1,
    buffReverseBits,
    stringifyBigInts: stringifyBigInts$2,
    unstringifyBigInts: unstringifyBigInts$2,
    beBuff2int: beBuff2int$2,
    beInt2Buff: beInt2Buff$2,
    leBuff2int: leBuff2int$2,
    leInt2Buff: leInt2Buff$2,
} = utils;

var _utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bitReverse: bitReverse,
    log2: log2$1,
    buffReverseBits: buffReverseBits,
    stringifyBigInts: stringifyBigInts$2,
    unstringifyBigInts: unstringifyBigInts$2,
    beBuff2int: beBuff2int$2,
    beInt2Buff: beInt2Buff$2,
    leBuff2int: leBuff2int$2,
    leInt2Buff: leInt2Buff$2
});

const PAGE_SIZE = 1<<30;

class BigBuffer {

    constructor(size) {
        this.buffers = [];
        this.byteLength = size;
        for (let i=0; i<size; i+= PAGE_SIZE) {
            const n = Math.min(size-i, PAGE_SIZE);
            this.buffers.push(new Uint8Array(n));
        }

    }

    slice(fr, to) {
        if ( to === undefined ) to = this.byteLength;
        if ( fr === undefined ) fr = 0;
        const len = to-fr;

        const firstPage = Math.floor(fr / PAGE_SIZE);
        const lastPage = Math.floor((fr+len-1) / PAGE_SIZE);

        if ((firstPage == lastPage)||(len==0))
            return this.buffers[firstPage].slice(fr%PAGE_SIZE, fr%PAGE_SIZE + len);

        let buff;

        let p = firstPage;
        let o = fr % PAGE_SIZE;
        // Remaining bytes to read
        let r = len;
        while (r>0) {
            // bytes to copy from this page
            const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
            const srcView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset+o, l);
            if (l == len) return srcView.slice();
            if (!buff) {
                if (len <= PAGE_SIZE) {
                    buff = new Uint8Array(len);
                } else {
                    buff = new BigBuffer(len);
                }
            }
            buff.set(srcView, len-r);
            r = r-l;
            p ++;
            o = 0;
        }

        return buff;
    }

    set(buff, offset) {
        if (offset === undefined) offset = 0;

        const len = buff.byteLength;

        if (len==0) return;

        const firstPage = Math.floor(offset / PAGE_SIZE);
        const lastPage = Math.floor((offset+len-1) / PAGE_SIZE);

        if (firstPage == lastPage)
            return this.buffers[firstPage].set(buff, offset % PAGE_SIZE);


        let p = firstPage;
        let o = offset % PAGE_SIZE;
        let r = len;
        while (r>0) {
            const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
            const srcView = buff.slice( len -r, len -r+l);
            const dstView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset + o, l);
            dstView.set(srcView);
            r = r-l;
            p ++;
            o = 0;
        }

    }
}

function buildBatchConvert(tm, fnName, sIn, sOut) {
    return async function batchConvert(buffIn) {
        const nPoints = Math.floor(buffIn.byteLength / sIn);
        if ( nPoints * sIn !== buffIn.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const buffChunk = buffIn.slice(i*pointsPerChunk*sIn, i*pointsPerChunk*sIn + n*sIn);
            const task = [
                {cmd: "ALLOCSET", var: 0, buff:buffChunk},
                {cmd: "ALLOC", var: 1, len:sOut * n},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: n},
                    {var: 1}
                ]},
                {cmd: "GET", out: 0, var: 1, len:sOut * n},
            ];
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buffIn instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };
}

class WasmField1 {

    constructor(tm, prefix, n8, p) {
        this.tm = tm;
        this.prefix = prefix;

        this.p = p;
        this.n8 = n8;
        this.type = "F1";
        this.m = 1;

        this.half = shiftRight$2(p, one);
        this.bitLength = bitLength$2(p);
        this.mask = sub$2(shiftLeft$2(one, this.bitLength), one);

        this.pOp1 = tm.alloc(n8);
        this.pOp2 = tm.alloc(n8);
        this.pOp3 = tm.alloc(n8);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = this.tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = this.tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

        this.n64 = Math.floor(n8/8);
        this.n32 = Math.floor(n8/4);

        if(this.n64*8 != this.n8) {
            throw new Error("n8 must be a multiple of 8");
        }

        this.half = shiftRight$2(this.p, one);
        this.nqr = this.two;
        let r = this.exp(this.nqr, this.half);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.add(this.nqr, this.one);
            r = this.exp(this.nqr, this.half);
        }

        this.shift = this.mul(this.nqr, this.nqr);
        this.shiftInv = this.inv(this.shift);

        this.s = 0;
        let t = sub$2(this.p, one);

        while ( !isOdd$2(t) ) {
            this.s = this.s + 1;
            t = shiftRight$2(t, one);
        }

        this.w = [];
        this.w[this.s] = this.exp(this.nqr, t);

        for (let i= this.s-1; i>=0; i--) {
            this.w[i] = this.square(this.w[i+1]);
        }

        if (!this.eq(this.w[0], this.one)) {
            throw new Error("Error calculating roots of unity");
        }

        this.batchToMontgomery = buildBatchConvert(tm, prefix + "_batchToMontgomery", this.n8, this.n8);
        this.batchFromMontgomery = buildBatchConvert(tm, prefix + "_batchFromMontgomery", this.n8, this.n8);
    }


    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }


    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        let ra = e$2(a, b);
        if (isNegative$2(ra)) {
            ra = neg$2(ra);
            if (gt$2(ra, this.p)) {
                ra = mod$2(ra, this.p);
            }
            ra = sub$2(this.p, ra);
        } else {
            if (gt$2(ra, this.p)) {
                ra = mod$2(ra, this.p);
            }
        }
        const buff = leInt2Buff$2(ra, this.n8);
        return this.toMontgomery(buff);
    }

    toString(a, radix) {
        const an = this.fromMontgomery(a);
        const s = fromRprLE(an, 0);
        return toString(s, radix);
    }

    fromRng(rng) {
        let v;
        const buff = new Uint8Array(this.n8);
        do {
            v = zero;
            for (let i=0; i<this.n64; i++) {
                v = add$2(v,  shiftLeft$2(rng.nextU64(), 64*i));
            }
            v = band$2(v, this.mask);
        } while (geq$2(v, this.p));
        toRprLE(buff, 0, v, this.n8);
        return buff;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const an = this.fromMontgomery(a);
        return fromRprLE(an, 0);
    }

    fromObject(a) {
        const buff = new Uint8Array(this.n8);
        toRprLE(buff, 0, a, this.n8);
        return this.toMontgomery(buff);
    }

    toRprLE(buff, offset, a) {
        buff.set(this.fromMontgomery(a), offset);
    }

    fromRprLE(buff, offset) {
        offset = offset || 0;
        const res = buff.slice(offset, offset + this.n8);
        return this.toMontgomery(res);
    }


}

class WasmField2 {

    constructor(tm, prefix, F) {
        this.tm = tm;
        this.prefix = prefix;

        this.F = F;
        this.type = "F2";
        this.m = F.m * 2;
        this.n8 = this.F.n8*2;
        this.n32 = this.F.n32*2;
        this.n64 = this.F.n64*2;

        this.pOp1 = tm.alloc(F.n8*2);
        this.pOp2 = tm.alloc(F.n8*2);
        this.pOp3 = tm.alloc(F.n8*2);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }

    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    mul1(a,b) {
        return this.op2("_mul1", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        if ((Array.isArray(a)) && (a.length == 2)) {
            const c1 = this.F.e(a[0], b);
            const c2 = this.F.e(a[1], b);
            const res = new Uint8Array(this.F.n8*2);
            res.set(c1);
            res.set(c2, this.F.n8*2);
            return res;
        } else {
            throw new Error("invalid F2");
        }
    }

    toString(a, radix) {
        const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
        const s2 = this.F.toString(a.slice(this.F.n8), radix);
        return `[${s1}, ${s2}]`;
    }

    fromRng(rng) {
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        const res = new Uint8Array(this.F.n8*2);
        res.set(c1);
        res.set(c2, this.F.n8);
        return res;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const c1 = this.F.toObject(a.slice(0, this.F.n8));
        const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        return [c1, c2];
    }

    fromObject(a) {
        const buff = new Uint8Array(this.F.n8*2);
        const b1 = this.F.fromObject(a[0]);
        const b2 = this.F.fromObject(a[1]);
        buff.set(b1);
        buff.set(b2, this.F.n8);
        return buff;
    }

    c1(a) {
        return a.slice(0, this.F.n8);
    }

    c2(a) {
        return a.slice(this.F.n8);
    }

}

class WasmField3 {

    constructor(tm, prefix, F) {
        this.tm = tm;
        this.prefix = prefix;

        this.F = F;
        this.type = "F3";
        this.m = F.m * 3;
        this.n8 = this.F.n8*3;
        this.n32 = this.F.n32*3;
        this.n64 = this.F.n64*3;

        this.pOp1 = tm.alloc(F.n8*3);
        this.pOp2 = tm.alloc(F.n8*3);
        this.pOp3 = tm.alloc(F.n8*3);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }


    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.getBuff(this.pOp3, this.n8);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        if ((Array.isArray(a)) && (a.length == 3)) {
            const c1 = this.F.e(a[0], b);
            const c2 = this.F.e(a[1], b);
            const c3 = this.F.e(a[2], b);
            const res = new Uint8Array(this.F.n8*3);
            res.set(c1);
            res.set(c2, this.F.n8);
            res.set(c3, this.F.n8*2);
            return res;
        } else {
            throw new Error("invalid F3");
        }
    }

    toString(a, radix) {
        const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
        const s2 = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
        const s3 = this.F.toString(a.slice(this.F.n8*2), radix);
        return `[${s1}, ${s2}, ${s3}]`;
    }

    fromRng(rng) {
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        const c3 = this.F.fromRng(rng);
        const res = new Uint8Array(this.F.n8*3);
        res.set(c1);
        res.set(c2, this.F.n8);
        res.set(c3, this.F.n8*2);
        return res;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const c1 = this.F.toObject(a.slice(0, this.F.n8));
        const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        const c3 = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
        return [c1, c2, c3];
    }

    fromObject(a) {
        const buff = new Uint8Array(this.F.n8*3);
        const b1 = this.F.fromObject(a[0]);
        const b2 = this.F.fromObject(a[1]);
        const b3 = this.F.fromObject(a[2]);
        buff.set(b1);
        buff.set(b2, this.F.n8);
        buff.set(b3, this.F.n8*2);
        return buff;
    }

    c1(a) {
        return a.slice(0, this.F.n8);
    }

    c2(a) {
        return a.slice(this.F.n8, this.F.n8*2);
    }

    c3(a) {
        return a.slice(this.F.n8*2);
    }

}

class WasmCurve {

    constructor(tm, prefix, F, pGen, pGb, cofactor) {
        this.tm = tm;
        this.prefix = prefix;
        this.F = F;

        this.pOp1 = tm.alloc(F.n8*3);
        this.pOp2 = tm.alloc(F.n8*3);
        this.pOp3 = tm.alloc(F.n8*3);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = this.tm.getBuff(this.pOp1, F.n8*3);
        this.tm.instance.exports[prefix + "_zeroAffine"](this.pOp1);
        this.zeroAffine = this.tm.getBuff(this.pOp1, F.n8*2);
        this.one = this.tm.getBuff(pGen, F.n8*3);
        this.g = this.one;
        this.oneAffine = this.tm.getBuff(pGen, F.n8*2);
        this.gAffine = this.oneAffine;
        this.b = this.tm.getBuff(pGb, F.n8);

        if (cofactor) {
            this.cofactor = toLEBuff(cofactor);
        }

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

        this.batchLEMtoC = buildBatchConvert(tm, prefix + "_batchLEMtoC", F.n8*2, F.n8);
        this.batchLEMtoU = buildBatchConvert(tm, prefix + "_batchLEMtoU", F.n8*2, F.n8*2);
        this.batchCtoLEM = buildBatchConvert(tm, prefix + "_batchCtoLEM", F.n8, F.n8*2);
        this.batchUtoLEM = buildBatchConvert(tm, prefix + "_batchUtoLEM", F.n8*2, F.n8*2);
        this.batchToJacobian = buildBatchConvert(tm, prefix + "_batchToJacobian", F.n8*2, F.n8*3);
        this.batchToAffine = buildBatchConvert(tm, prefix + "_batchToAffine", F.n8*3, F.n8*2);
    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    op2bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    op1Affine(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*2);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_add", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_addMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_addMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_addAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    sub(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_sub", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_subMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_subMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_subAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    neg(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1("_neg", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1Affine("_negAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    double(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1("_double", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1("_doubleAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    isZero(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1Bool("_isZero", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1Bool("_isZeroAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    timesScalar(a, s) {
        if (!(s instanceof Uint8Array)) {
            s = toLEBuff(e$2(s));
        }
        let fnName;
        if (a.byteLength == this.F.n8*3) {
            fnName = this.prefix + "_timesScalar";
        } else if (a.byteLength == this.F.n8*2) {
            fnName = this.prefix + "_timesScalarAffine";
        } else {
            throw new Error("invalid point size");
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, s);
        this.tm.instance.exports[fnName](this.pOp1, this.pOp2, s.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    timesFr(a, s) {
        let fnName;
        if (a.byteLength == this.F.n8*3) {
            fnName = this.prefix + "_timesFr";
        } else if (a.byteLength == this.F.n8*2) {
            fnName = this.prefix + "_timesFrAffine";
        } else {
            throw new Error("invalid point size");
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, s);
        this.tm.instance.exports[fnName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    eq(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2bool("_eq", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2bool("_eqMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2bool("_eqMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2bool("_eqAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    toAffine(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1Affine("_toAffine", a);
        } else if (a.byteLength == this.F.n8*2) {
            return a;
        } else {
            throw new Error("invalid point size");
        }
    }

    toJacobian(a) {
        if (a.byteLength == this.F.n8*3) {
            return a;
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1("_toJacobian", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    toRprUncompressed(arr, offset, a) {
        this.tm.setBuff(this.pOp1, a);
        if (a.byteLength == this.F.n8*3) {
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
        } else if (a.byteLength != this.F.n8*2) {
            throw new Error("invalid point size");
        }
        this.tm.instance.exports[this.prefix + "_LEMtoU"](this.pOp1, this.pOp1);
        const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
        arr.set(res, offset);
    }

    fromRprUncompressed(arr, offset) {
        const buff = arr.slice(offset, offset + this.F.n8*2);
        this.tm.setBuff(this.pOp1, buff);
        this.tm.instance.exports[this.prefix + "_UtoLEM"](this.pOp1, this.pOp1);
        return this.tm.getBuff(this.pOp1, this.F.n8*2);
    }

    toRprCompressed(arr, offset, a) {
        this.tm.setBuff(this.pOp1, a);
        if (a.byteLength == this.F.n8*3) {
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
        } else if (a.byteLength != this.F.n8*2) {
            throw new Error("invalid point size");
        }
        this.tm.instance.exports[this.prefix + "_LEMtoC"](this.pOp1, this.pOp1);
        const res = this.tm.getBuff(this.pOp1, this.F.n8);
        arr.set(res, offset);
    }

    fromRprCompressed(arr, offset) {
        const buff = arr.slice(offset, offset + this.F.n8);
        this.tm.setBuff(this.pOp1, buff);
        this.tm.instance.exports[this.prefix + "_CtoLEM"](this.pOp1, this.pOp2);
        return this.tm.getBuff(this.pOp2, this.F.n8*2);
    }

    toUncompressed(a) {
        const buff = new Uint8Array(this.F.n8*2);
        this.toRprUncompressed(buff, 0, a);
        return buff;
    }

    toRprLEM(arr, offset, a) {
        if (a.byteLength == this.F.n8*2) {
            arr.set(a, offset);
            return;
        } else if (a.byteLength == this.F.n8*3) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
            const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
            arr.set(res, offset);
        } else {
            throw new Error("invalid point size");
        }
    }

    fromRprLEM(arr, offset) {
        offset = offset || 0;
        return arr.slice(offset, offset+this.F.n8*2);
    }

    toString(a, radix) {
        if (a.byteLength == this.F.n8*3) {
            const x = this.F.toString(a.slice(0, this.F.n8), radix);
            const y = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
            const z = this.F.toString(a.slice(this.F.n8*2), radix);
            return `[ ${x}, ${y}, ${z} ]`;
        } else if (a.byteLength == this.F.n8*2) {
            const x = this.F.toString(a.slice(0, this.F.n8), radix);
            const y = this.F.toString(a.slice(this.F.n8), radix);
            return `[ ${x}, ${y} ]`;
        } else {
            throw new Error("invalid point size");
        }
    }


    fromRng(rng) {
        const F = this.F;
        let P = [];
        let greatest;
        let x3b;
        do {
            P[0] = F.fromRng(rng);
            greatest = rng.nextBool();
            x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
        } while (!F.isSquare(x3b));

        P[1] = F.sqrt(x3b);

        const s = F.isNegative(P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);

        let Pbuff = new Uint8Array(this.F.n8*2);
        Pbuff.set(P[0]);
        Pbuff.set(P[1], this.F.n8);

        if (this.cofactor) {
            Pbuff = this.timesScalar(Pbuff, this.cofactor);
        }

        return Pbuff;
    }



    toObject(a) {
        if (this.isZero(a)) {
            return [
                this.F.toObject(this.F.zero),
                this.F.toObject(this.F.one),
                this.F.toObject(this.F.zero),
            ];
        }
        const x = this.F.toObject(a.slice(0, this.F.n8));
        const y = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        let z;
        if (a.byteLength == this.F.n8*3) {
            z = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
        } else {
            z = this.F.toObject(this.F.one);
        }
        return [x, y, z];
    }

    fromObject(a) {
        const x = this.F.fromObject(a[0]);
        const y = this.F.fromObject(a[1]);
        let z;
        if (a.length==3) {
            z = this.F.fromObject(a[2]);
        } else {
            z = this.F.one;
        }
        if (this.F.isZero(z, this.F.one)) {
            return this.zeroAffine;
        } else if (this.F.eq(z, this.F.one)) {
            const buff = new Uint8Array(this.F.n8*2);
            buff.set(x);
            buff.set(y, this.F.n8);
            return buff;
        } else {
            const buff = new Uint8Array(this.F.n8*3);
            buff.set(x);
            buff.set(y, this.F.n8);
            buff.set(z, this.F.n8*2);
            return buff;
        }
    }

    e(a) {
        if (a instanceof Uint8Array) return a;
        return this.fromObject(a);
    }

    x(a) {
        const tmp = this.toAffine(a);
        return tmp.slice(0, this.F.n8);
    }

    y(a) {
        const tmp = this.toAffine(a);
        return tmp.slice(this.F.n8);
    }

}

/* global WebAssembly */

function thread(self) {
    const MAXMEM = 32767;
    let instance;
    let memory;

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
        memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});

        instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            }
        });
    }



    function alloc(length) {
        const u32 = new Uint32Array(memory.buffer, 0, 1);
        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers
        const res = u32[0];
        u32[0] += length;
        if (u32[0] + length > memory.buffer.byteLength) {
            const currentPages = memory.buffer.byteLength / 0x10000;
            let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;
            if (requiredPages>MAXMEM) requiredPages=MAXMEM;
            memory.grow(requiredPages-currentPages);
        }
        return res;
    }

    function allocBuffer(buffer) {
        const p = alloc(buffer.byteLength);
        setBuffer(p, buffer);
        return p;
    }

    function getBuffer(pointer, length) {
        const u8 = new Uint8Array(memory.buffer);
        return new Uint8Array(u8.buffer, u8.byteOffset + pointer, length);
    }

    function setBuffer(pointer, buffer) {
        const u8 = new Uint8Array(memory.buffer);
        u8.set(new Uint8Array(buffer), pointer);
    }

    function runTask(task) {
        if (task[0].cmd == "INIT") {
            return init(task[0]);
        }
        const ctx = {
            vars: [],
            out: []
        };
        const u32a = new Uint32Array(memory.buffer, 0, 1);
        const oldAlloc = u32a[0];
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
        const u32b = new Uint32Array(memory.buffer, 0, 1);
        u32b[0] = oldAlloc;
        return ctx.out;
    }


    return runTask;
}

/* global window, navigator, Blob, Worker, WebAssembly */
/*
    Copyright 2019 0KIMS association.

    This file is part of wasmsnark (Web Assembly zkSnark Prover).

    wasmsnark is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmsnark is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
*/

// const MEM_SIZE = 1000;  // Memory size in 64K Pakes (512Mb)
const MEM_SIZE = 25;  // Memory size in 64K Pakes (1600Kb)
const inBrowser = (typeof window !== "undefined");
let NodeWorker;
if (!inBrowser) {
    NodeWorker = NodeWorker_mod.Worker;
}

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function base64ToArrayBuffer(base64) {
    if (process.browser) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    } else {
        return new Uint8Array(Buffer.from(base64, "base64"));
    }
}




async function buildThreadManager(wasm, singleThread) {
    const tm = new ThreadManager();

    tm.memory = new WebAssembly.Memory({initial:MEM_SIZE});
    tm.u8 = new Uint8Array(tm.memory.buffer);
    tm.u32 = new Uint32Array(tm.memory.buffer);

    const wasmModule = await WebAssembly.compile(base64ToArrayBuffer(wasm.code));

    tm.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": tm.memory
        }
    });

    tm.singleThread = singleThread;
    tm.initalPFree = tm.u32[0];   // Save the Pointer to free space.
    tm.pq = wasm.pq;
    tm.pr = wasm.pr;
    tm.pG1gen = wasm.pG1gen;
    tm.pG1zero = wasm.pG1zero;
    tm.pG2gen = wasm.pG2gen;
    tm.pG2zero = wasm.pG2zero;
    tm.pOneT = wasm.pOneT;

    //    tm.pTmp0 = tm.alloc(curve.G2.F.n8*3);
    //    tm.pTmp1 = tm.alloc(curve.G2.F.n8*3);


    if (singleThread) {
        tm.code = base64ToArrayBuffer(wasm.code);
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice()
        }]);
        tm.concurrency  = 1;
    } else {
        tm.workers = [];
        tm.pendingDeferreds = [];
        tm.working = [];

        let concurrency;

        if ((typeof(navigator) === "object") && navigator.hardwareConcurrency) {
            concurrency = navigator.hardwareConcurrency;
        } else {
            concurrency = os.cpus().length;
        }
        // Limit to 64 threads for memory reasons.
        if (concurrency>64) concurrency=64;
        tm.concurrency = concurrency;

        for (let i = 0; i<concurrency; i++) {

            if (inBrowser) {
                const blob = new Blob(["(", thread.toString(), ")(self);"], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);

                tm.workers[i] = new Worker(url);

                tm.workers[i].onmessage = getOnMsg(i);

            } else {
                tm.workers[i] = new NodeWorker("(" + thread.toString()+ ")(require('worker_threads').parentPort);", {eval: true});

                tm.workers[i].on("message", getOnMsg(i));
            }

            tm.working[i]=false;
        }

        const initPromises = [];
        for (let i=0; i<tm.workers.length;i++) {
            const copyCode = base64ToArrayBuffer(wasm.code).slice();
            initPromises.push(tm.postAction(i, [{
                cmd: "INIT",
                init: MEM_SIZE,
                code: copyCode
            }], [copyCode.buffer]));
        }

        await Promise.all(initPromises);

    }
    return tm;

    function getOnMsg(i) {
        return function(e) {
            let data;
            if ((e)&&(e.data)) {
                data = e.data;
            } else {
                data = e;
            }

            tm.working[i]=false;
            tm.pendingDeferreds[i].resolve(data);
            tm.processWorks();
        };
    }

}

class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
    }

    startSyncOp() {
        if (this.oldPFree != 0) throw new Error("Sync operation in progress");
        this.oldPFree = this.u32[0];
    }

    endSyncOp() {
        if (this.oldPFree == 0) throw new Error("No sync operation in progress");
        this.u32[0] = this.oldPFree;
        this.oldPFree = 0;
    }

    postAction(workerId, e, transfers, _deferred) {
        if (this.working[workerId]) {
            throw new Error("Posting a job t a working worker");
        }
        this.working[workerId] = true;

        this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
        this.workers[workerId].postMessage(e, transfers);

        return this.pendingDeferreds[workerId].promise;
    }

    processWorks() {
        for (let i=0; (i<this.workers.length)&&(this.actionQueue.length > 0); i++) {
            if (this.working[i] == false) {
                const work = this.actionQueue.shift();
                this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }
    }

    queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            this.actionQueue.push({
                data: actionData,
                transfers: transfers,
                deferred: d
            });
            this.processWorks();
        }
        return d.promise;
    }

    resetMemory() {
        this.u32[0] = this.initalPFree;
    }

    allocBuff(buff) {
        const pointer = this.alloc(buff.byteLength);
        this.setBuff(pointer, buff);
        return pointer;
    }

    getBuff(pointer, length) {
        return this.u8.slice(pointer, pointer+ length);
    }

    setBuff(pointer, buffer) {
        this.u8.set(new Uint8Array(buffer), pointer);
    }

    alloc(length) {
        while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    async terminate() {
        for (let i=0; i<this.workers.length; i++) {
            this.workers[i].postMessage([{cmd: "TERMINATE"}]);
        }
        await sleep(200);
    }

}

function buildBatchApplyKey(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = curve.tm;

    curve[groupName].batchApplyKey = async function(buff, first, inc, inType, outType) {
        inType = inType || "affine";
        outType = outType || "affine";
        let fnName, fnAffine;
        let sGin, sGmid, sGout;
        if (groupName == "G1") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g1m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g1m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g1m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "G2") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g2m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g2m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g2m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "Fr") {
            fnName = "frm_batchApplyKey";
            sGin = G.n8;
            sGmid = G.n8;
            sGout = G.n8;
        } else {
            throw new Error("Invalid group: " + groupName);
        }
        const nPoints = Math.floor(buff.byteLength / sGin);
        const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
        const opPromises = [];
        inc = Fr.e(inc);
        let t = Fr.e(first);
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const task = [];

            task.push({
                cmd: "ALLOCSET",
                var: 0,
                buff: buff.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin)
            });
            task.push({cmd: "ALLOCSET", var: 1, buff: t});
            task.push({cmd: "ALLOCSET", var: 2, buff: inc});
            task.push({cmd: "ALLOC", var: 3, len: n*Math.max(sGmid, sGout)});
            task.push({
                cmd: "CALL",
                fnName: fnName,
                params: [
                    {var: 0},
                    {val: n},
                    {var: 1},
                    {var: 2},
                    {var:3}
                ]
            });
            if (fnAffine) {
                task.push({
                    cmd: "CALL",
                    fnName: fnAffine,
                    params: [
                        {var: 3},
                        {val: n},
                        {var: 3},
                    ]
                });
            }
            task.push({cmd: "GET", out: 0, var: 3, len: n*sGout});

            opPromises.push(tm.queueAction(task));
            t = Fr.mul(t, Fr.exp(inc, n));
        }

        const result = await Promise.all(opPromises);

        const outBuff = new Uint8Array(nPoints*sGout);
        let p=0;
        for (let i=0; i<result.length; i++) {
            outBuff.set(result[i][0], p);
            p += result[i][0].byteLength;
        }

        return outBuff;
    };
}

function buildPairing(curve) {
    const tm = curve.tm;
    curve.pairing = function pairing(a, b) {

        tm.startSyncOp();
        const pA = tm.allocBuff(curve.G1.toJacobian(a));
        const pB = tm.allocBuff(curve.G2.toJacobian(b));
        const pRes = tm.alloc(curve.Gt.n8);
        tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);

        const res = tm.getBuff(pRes, curve.Gt.n8);

        tm.endSyncOp();
        return res;
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

            opPromises.push(
                tm.queueAction(task)
            );
        }


        const result = await Promise.all(opPromises);

        tm.startSyncOp();
        const pRes = tm.alloc(curve.Gt.n8);
        tm.instance.exports.ftm_one(pRes);

        for (let i=0; i<result.length; i++) {
            const pMR = tm.allocBuff(result[i][0]);
            tm.instance.exports.ftm_mul(pRes, pMR, pRes);
        }
        tm.instance.exports[curve.name + "_finalExponentiation"](pRes, pRes);

        const pCt = tm.allocBuff(buffCt);

        const r = !!tm.instance.exports.ftm_eq(pRes, pCt);

        tm.endSyncOp();

        return r;
    };

    curve.prepareG1 = function(p) {
        this.tm.startSyncOp();
        const pP = this.tm.allocBuff(p);
        const pPrepP = this.tm.alloc(this.prePSize);
        this.tm.instance.exports[this.name + "_prepareG1"](pP, pPrepP);
        const res = this.tm.getBuff(pPrepP, this.prePSize);
        this.tm.endSyncOp();
        return res;
    };

    curve.prepareG2 = function(q) {
        this.tm.startSyncOp();
        const pQ = this.tm.allocBuff(q);
        const pPrepQ = this.tm.alloc(this.preQSize);
        this.tm.instance.exports[this.name + "_prepareG2"](pQ, pPrepQ);
        const res = this.tm.getBuff(pPrepQ, this.preQSize);
        this.tm.endSyncOp();
        return res;
    };

    curve.millerLoop = function(preP, preQ) {
        this.tm.startSyncOp();
        const pPreP = this.tm.allocBuff(preP);
        const pPreQ = this.tm.allocBuff(preQ);
        const pRes = this.tm.alloc(this.Gt.n8);
        this.tm.instance.exports[this.name + "_millerLoop"](pPreP, pPreQ, pRes);
        const res = this.tm.getBuff(pRes, this.Gt.n8);
        this.tm.endSyncOp();
        return res;
    };

    curve.finalExponentiation = function(a) {
        this.tm.startSyncOp();
        const pA = this.tm.allocBuff(a);
        const pRes = this.tm.alloc(this.Gt.n8);
        this.tm.instance.exports[this.name + "_finalExponentiation"](pA, pRes);
        const res = this.tm.getBuff(pRes, this.Gt.n8);
        this.tm.endSyncOp();
        return res;
    };

}

const pTSizes = [
    1 ,  1,  1,  1,    2,  3,  4,  5,
    6 ,  7,  7,  8,    9, 10, 11, 12,
    13, 13, 14, 15,   16, 16, 17, 17,
    17, 17, 17, 17,   17, 17, 17, 17
];

function buildMultiexp(curve, groupName) {
    const G = curve[groupName];
    const tm = G.tm;
    async function _multiExpChunk(buffBases, buffScalars, inType, logger, logText) {
        if ( ! (buffBases instanceof Uint8Array) ) {
            if (logger) logger.error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
            throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
        }
        if ( ! (buffScalars instanceof Uint8Array) ) {
            if (logger) logger.error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
            throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
        }
        inType = inType || "affine";

        let sGIn;
        let fnName;
        if (groupName == "G1") {
            if (inType == "affine") {
                fnName = "g1m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g1m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                fnName = "g2m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g2m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }
        const nPoints = Math.floor(buffBases.byteLength / sGIn);

        if (nPoints == 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints != buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2$1(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [
                {cmd: "ALLOCSET", var: 0, buff: buffBases},
                {cmd: "ALLOCSET", var: 1, buff: buffScalars},
                {cmd: "ALLOC", var: 2, len: G.F.n8*3},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: sScalar},
                    {val: nPoints},
                    {val: i*bitChunkSize},
                    {val: Math.min(sScalar*8 - i*bitChunkSize, bitChunkSize)},
                    {var: 2}
                ]},
                {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
            ];
            opPromises.push(
                G.tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            if (!G.isZero(res)) {
                for (let j=0; j<bitChunkSize; j++) res = G.double(res);
            }
            res = G.add(res, result[i][0]);
        }

        return res;
    }

    async function _multiExp(buffBases, buffScalars, inType, logger, logText) {
        const MAX_CHUNK_SIZE = 1 << 22;
        const MIN_CHUNK_SIZE = 1 << 10;
        let sGIn;

        if (groupName == "G1") {
            if (inType == "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints != buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2$1(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        let chunkSize;
        chunkSize = Math.floor(nPoints / (tm.concurrency /nChunks));
        if (chunkSize>MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize<MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;

        const opPromises = [];
        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`Multiexp start: ${logText}: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, chunkSize);
            const buffBasesChunk = buffBases.slice(i*sGIn, (i+n)*sGIn);
            const buffScalarsChunk = buffScalars.slice(i*sScalar, (i+n)*sScalar);
            opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType, logger, logText).then( (r) => {
                if (logger) logger.debug(`Multiexp end: ${logText}: ${i}/${nPoints}`);
                return r;
            }));
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            res = G.add(res, result[i]);
        }

        return res;
    }

    G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return await _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
    };
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return await _multiExp(buffBases, buffScalars, "affine", logger, logText);
    };
}

function buildFFT(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = G.tm;
    async function _fft(buff, inverse, inType, outType, logger, loggerTxt) {

        inType = inType || "affine";
        outType = outType || "affine";
        const MAX_BITS_THREAD = 14;

        let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnFFTMix, fnFFTJoin, fnFFTFinal;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnFFTFinal = "g1m_fftFinal";
            }
            fnFFTJoin = "g1m_fftJoin";
            fnFFTMix = "g1m_fftMix";

            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g1m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }

        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnFFTFinal = "g2m_fftFinal";
            }
            fnFFTJoin = "g2m_fftJoin";
            fnFFTMix = "g2m_fftMix";
            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g2m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = G.n8;
            sMid = G.n8;
            sOut = G.n8;
            if (inverse) {
                fnFFTFinal = "frm_fftFinal";
            }
            fnFFTMix = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        }


        let returnArray = false;
        if (Array.isArray(buff)) {
            buff = curve.array2buffer(buff, sIn);
            returnArray = true;
        }

        const nPoints = buff.byteLength / sIn;
        const bits = log2$1(nPoints);

        if  ((1 << bits) != nPoints) {
            throw new Error("fft must be multiple of 2" );
        }

        if (bits == Fr.s +1) {
            let buffOut;

            if (inverse) {
                buffOut =  await _fftExtInv(buff, inType, outType, logger, loggerTxt);
            } else {
                buffOut =  await _fftExt(buff, inType, outType, logger, loggerTxt);
            }

            if (returnArray) {
                return curve.buffer2array(buffOut, sOut);
            } else {
                return buffOut;
            }
        }

        let inv;
        if (inverse) {
            inv = Fr.inv(Fr.e(nPoints));
        }

        let buffOut;

        buffReverseBits(buff, sIn);

        let chunks;
        let pointsInChunk = Math.min(1 << MAX_BITS_THREAD, nPoints);
        let nChunks = nPoints / pointsInChunk;

        while ((nChunks < tm.concurrency)&&(pointsInChunk>=16)) {
            nChunks *= 2;
            pointsInChunk /= 2;
        }

        const l2Chunk = log2$1(pointsInChunk);

        const promises = [];
        for (let i = 0; i< nChunks; i++) {
            if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix start: ${i}/${nChunks}`);
            const task = [];
            task.push({cmd: "ALLOC", var: 0, len: sMid*pointsInChunk});
            const buffChunk = buff.slice( (pointsInChunk * i)*sIn, (pointsInChunk * (i+1))*sIn);
            task.push({cmd: "SET", var: 0, buff: buffChunk});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
            }
            for (let j=1; j<=l2Chunk;j++) {
                task.push({cmd: "CALL", fnName:fnFFTMix, params: [{var:0}, {val: pointsInChunk}, {val: j}]});
            }

            if (l2Chunk==bits) {
                if (fnFFTFinal) {
                    task.push({cmd: "ALLOCSET", var: 1, buff: inv});
                    task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                        {var: 0},
                        {val: pointsInChunk},
                        {var: 1},
                    ]});
                }
                if (fnMid2Out) {
                    task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                }
                task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
            } else {
                task.push({cmd: "GET", out:0, var: 0, len: sMid*pointsInChunk});
            }
            promises.push(tm.queueAction(task).then( (r) => {
                if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix end: ${i}/${nChunks}`);
                return r;
            }));
        }

        chunks = await Promise.all(promises);
        for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

        for (let i = l2Chunk+1;   i<=bits; i++) {
            if (logger) logger.debug(`${loggerTxt}: fft  ${bits}  join: ${i}/${bits}`);
            const nGroups = 1 << (bits - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const first = Fr.exp( Fr.w[i], k*pointsInChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsInChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    if (i==bits) {
                        if (fnFFTFinal) {
                            task.push({cmd: "ALLOCSET", var: 4, buff: inv});
                            task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                {var: 0},
                                {val: pointsInChunk},
                                {var: 4},
                            ]});
                            task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                {var: 1},
                                {val: pointsInChunk},
                                {var: 4},
                            ]});
                        }
                        if (fnMid2Out) {
                            task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                            task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: pointsInChunk}, {var: 1}]});
                        }
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sOut});
                    } else {
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sMid});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sMid});
                    }
                    opPromises.push(tm.queueAction(task).then( (r) => {
                        if (logger) logger.debug(`${loggerTxt}: fft ${bits} join  ${i}/${bits}  ${j+1}/${nGroups} ${k}/${nChunksPerGroup/2}`);
                        return r;
                    }));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }

        if (buff instanceof BigBuffer) {
            buffOut = new BigBuffer(nPoints*sOut);
        } else {
            buffOut = new Uint8Array(nPoints*sOut);
        }
        if (inverse) {
            buffOut.set(chunks[0].slice((pointsInChunk-1)*sOut));
            let p= sOut;
            for (let i=nChunks-1; i>0; i--) {
                buffOut.set(chunks[i], p);
                p += pointsInChunk*sOut;
                delete chunks[i];  // Liberate mem
            }
            buffOut.set(chunks[0].slice(0, (pointsInChunk-1)*sOut), p);
            delete chunks[0];
        } else {
            for (let i=0; i<nChunks; i++) {
                buffOut.set(chunks[i], pointsInChunk*sOut*i);
                delete chunks[i];
            }
        }

        if (returnArray) {
            return curve.buffer2array(buffOut, sOut);
        } else {
            return buffOut;
        }
    }

    async function _fftExt(buff, inType, outType, logger, loggerTxt) {
        let b1, b2;
        b1 = buff.slice( 0 , buff.byteLength/2);
        b2 = buff.slice( buff.byteLength/2, buff.byteLength);

        const promises = [];

        [b1, b2] = await _fftJoinExt(b1, b2, "fftJoinExt", Fr.one, Fr.shift, inType, "jacobian", logger, loggerTxt);

        promises.push( _fft(b1, false, "jacobian", outType, logger, loggerTxt));
        promises.push( _fft(b2, false, "jacobian", outType, logger, loggerTxt));

        const res1 = await Promise.all(promises);

        let buffOut;
        if (res1[0].byteLength > (1<<28)) {
            buffOut = new BigBuffer(res1[0].byteLength*2);
        } else {
            buffOut = new Uint8Array(res1[0].byteLength*2);
        }

        buffOut.set(res1[0]);
        buffOut.set(res1[1], res1[0].byteLength);

        return buffOut;
    }

    async function _fftExtInv(buff, inType, outType, logger, loggerTxt) {
        let b1, b2;
        b1 = buff.slice( 0 , buff.byteLength/2);
        b2 = buff.slice( buff.byteLength/2, buff.byteLength);

        const promises = [];

        promises.push( _fft(b1, true, inType, "jacobian", logger, loggerTxt));
        promises.push( _fft(b2, true, inType, "jacobian", logger, loggerTxt));

        [b1, b2] = await Promise.all(promises);

        const res1 = await _fftJoinExt(b1, b2, "fftJoinExtInv", Fr.one, Fr.shiftInv, "jacobian", outType, logger, loggerTxt);

        let buffOut;
        if (res1[0].byteLength > (1<<28)) {
            buffOut = new BigBuffer(res1[0].byteLength*2);
        } else {
            buffOut = new Uint8Array(res1[0].byteLength*2);
        }

        buffOut.set(res1[0]);
        buffOut.set(res1[1], res1[0].byteLength);

        return buffOut;
    }


    async function _fftJoinExt(buff1, buff2, fn, first, inc, inType, outType, logger, loggerTxt) {
        const MAX_CHUNK_SIZE = 1<<16;
        const MIN_CHUNK_SIZE = 1<<4;

        let fnName;
        let fnIn2Mid, fnMid2Out;
        let sOut, sIn, sMid;

        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            fnName = "g1m_"+fn;
            if (outType == "affine") {
                fnMid2Out = "g1m_batchToAffine";
                sOut = G.F.n8*2;
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            fnName = "g2m_"+fn;
            sMid = G.F.n8*3;
            if (outType == "affine") {
                fnMid2Out = "g2m_batchToAffine";
                sOut = G.F.n8*2;
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = Fr.n8;
            sOut = Fr.n8;
            sMid = Fr.n8;
            fnName = "frm_" + fn;
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sIn);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let chunkSize = Math.floor(nPoints /tm.concurrency);
        if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
        if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;

        const opPromises = [];

        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`${loggerTxt}: fftJoinExt Start: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, chunkSize);

            const firstChunk = Fr.mul(first, Fr.exp( inc, i));
            const task = [];

            const b1 = buff1.slice(i*sIn, (i+n)*sIn);
            const b2 = buff2.slice(i*sIn, (i+n)*sIn);

            task.push({cmd: "ALLOC", var: 0, len: sMid*n});
            task.push({cmd: "SET", var: 0, buff: b1});
            task.push({cmd: "ALLOC", var: 1, len: sMid*n});
            task.push({cmd: "SET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: n}, {var: 0}]});
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:1}, {val: n}, {var: 1}]});
            }
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: n},
                {var: 2},
                {var: 3},
                {val: Fr.s},
            ]});
            if (fnMid2Out) {
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: n}, {var: 0}]});
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: n}, {var: 1}]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: n*sOut});
            task.push({cmd: "GET", out: 1, var: 1, len: n*sOut});
            opPromises.push(
                tm.queueAction(task).then( (r) => {
                    if (logger) logger.debug(`${loggerTxt}: fftJoinExt End: ${i}/${nPoints}`);
                    return r;
                })
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut1;
        let fullBuffOut2;
        if (nPoints * sOut > 1<<28) {
            fullBuffOut1 = new BigBuffer(nPoints*sOut);
            fullBuffOut2 = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut1 = new Uint8Array(nPoints*sOut);
            fullBuffOut2 = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    }


    G.fft = async function(buff, inType, outType, logger, loggerTxt) {
        return await _fft(buff, false, inType, outType, logger, loggerTxt);
    };

    G.ifft = async function(buff, inType, outType, logger, loggerTxt) {
        return await _fft(buff, true, inType, outType, logger, loggerTxt);
    };

    G.lagrangeEvaluations = async function (buff, inType, outType, logger, loggerTxt) {
        inType = inType || "affine";
        outType = outType || "affine";

        let sIn;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
            } else {
                sIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
            } else {
                sIn = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = Fr.n8;
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = buff.byteLength /sIn;
        const bits = log2$1(nPoints);

        if ((2 ** bits)*sIn != buff.byteLength) {
            if (logger) logger.error("lagrangeEvaluations iinvalid input size");
            throw new Error("lagrangeEvaluations invalid Input size");
        }

        if (bits <= Fr.s) {
            return await G.ifft(buff, inType, outType, logger, loggerTxt);
        }

        if (bits > Fr.s+1) {
            if (logger) logger.error("lagrangeEvaluations input too big");
            throw new Error("lagrangeEvaluations input too big");
        }

        let t0 = buff.slice(0, buff.byteLength/2);
        let t1 = buff.slice(buff.byteLength/2, buff.byteLength);


        const shiftToSmallM = Fr.exp(Fr.shift, nPoints/2);
        const sConst = Fr.inv( Fr.sub(Fr.one, shiftToSmallM));

        [t0, t1] = await _fftJoinExt(t0, t1, "prepareLagrangeEvaluation", sConst, Fr.shiftInv, inType, "jacobian", logger, loggerTxt + " prep");

        const promises = [];

        promises.push( _fft(t0, true, "jacobian", outType, logger, loggerTxt + " t0"));
        promises.push( _fft(t1, true, "jacobian", outType, logger, loggerTxt + " t1"));

        [t0, t1] = await Promise.all(promises);

        let buffOut;
        if (t0.byteLength > (1<<28)) {
            buffOut = new BigBuffer(t0.byteLength*2);
        } else {
            buffOut = new Uint8Array(t0.byteLength*2);
        }

        buffOut.set(t0);
        buffOut.set(t1, t0.byteLength);

        return buffOut;
    };

    G.fftMix = async function fftMix(buff) {
        const sG = G.F.n8*3;
        let fnName, fnFFTJoin;
        if (groupName == "G1") {
            fnName = "g1m_fftMix";
            fnFFTJoin = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftMix";
            fnFFTJoin = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        const power = log2$1(nPoints);

        let nChunks = 1 << log2$1(tm.concurrency);

        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;

        const powerChunk = log2$1(pointsPerChunk);

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            for (let j=1; j<=powerChunk; j++) {
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: pointsPerChunk},
                    {val: j}
                ]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        const chunks = [];
        for (let i=0; i<result.length; i++) chunks[i] = result[i][0];


        for (let i = powerChunk+1; i<=power; i++) {
            const nGroups = 1 << (power - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const first = Fr.exp( Fr.w[i], k*pointsPerChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsPerChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                    task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                    opPromises.push(tm.queueAction(task));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }

        let fullBuffOut;
        if (buff instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sG);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sG);
        }
        let p =0;
        for (let i=0; i<nChunks; i++) {
            fullBuffOut.set(chunks[i], p);
            p+=chunks[i].byteLength;
        }

        return fullBuffOut;
    };

    G.fftJoin = async function fftJoin(buff1, buff2, first, inc) {
        const sG = G.F.n8*3;
        let fnName;
        if (groupName == "G1") {
            fnName = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sG);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let nChunks = 1 << log2$1(tm.concurrency);
        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;


        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];

            const firstChunk = Fr.mul(first, Fr.exp(inc, i*pointsPerChunk));
            const b1 = buff1.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            const b2 = buff2.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b1});
            task.push({cmd: "ALLOCSET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: pointsPerChunk},
                {var: 2},
                {var: 3}
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
            opPromises.push(
                tm.queueAction(task)
            );

        }


        const result = await Promise.all(opPromises);

        let fullBuffOut1;
        let fullBuffOut2;
        if (buff1 instanceof BigBuffer) {
            fullBuffOut1 = new BigBuffer(nPoints*sG);
            fullBuffOut2 = new BigBuffer(nPoints*sG);
        } else {
            fullBuffOut1 = new Uint8Array(nPoints*sG);
            fullBuffOut2 = new Uint8Array(nPoints*sG);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    };



    G.fftFinal =  async function fftFinal(buff, factor) {
        const sG = G.F.n8*3;
        const sGout = G.F.n8*2;
        let fnName, fnToAffine;
        if (groupName == "G1") {
            fnName = "g1m_fftFinal";
            fnToAffine = "g1m_batchToAffine";
        } else if (groupName == "G2") {
            fnName = "g2m_fftFinal";
            fnToAffine = "g2m_batchToAffine";
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        const pointsPerChunk = Math.floor(nPoints / tm.concurrency);

        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, (i*pointsPerChunk+n)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            task.push({cmd: "ALLOCSET", var: 1, buff: factor});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {val: n},
                {var: 1},
            ]});
            task.push({cmd: "CALL", fnName: fnToAffine, params: [
                {var: 0},
                {val: n},
                {var: 0},
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: n*sGout});
            opPromises.push(
                tm.queueAction(task)
            );

        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buff instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sGout);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sGout);
        }

        let p =0;
        for (let i=result.length-1; i>=0; i--) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };
}

async function buildEngine(params) {

    const tm = await buildThreadManager(params.wasm, params.singleThread);


    const curve = {};

    curve.q = e$2(params.wasm.q);
    curve.r = e$2(params.wasm.r);
    curve.name = params.name;
    curve.tm = tm;
    curve.prePSize = params.wasm.prePSize;
    curve.preQSize = params.wasm.preQSize;
    curve.Fr = new WasmField1(tm, "frm", params.n8r, params.r);
    curve.F1 = new WasmField1(tm, "f1m", params.n8q, params.q);
    curve.F2 = new WasmField2(tm, "f2m", curve.F1);
    curve.G1 = new WasmCurve(tm, "g1m", curve.F1, params.wasm.pG1gen, params.wasm.pG1b, params.cofactorG1);
    curve.G2 = new WasmCurve(tm, "g2m", curve.F2, params.wasm.pG2gen, params.wasm.pG2b, params.cofactorG2);
    curve.F6 = new WasmField3(tm, "f6m", curve.F2);
    curve.F12 = new WasmField2(tm, "ftm", curve.F6);

    curve.Gt = curve.F12;

    buildBatchApplyKey(curve, "G1");
    buildBatchApplyKey(curve, "G2");
    buildBatchApplyKey(curve, "Fr");

    buildMultiexp(curve, "G1");
    buildMultiexp(curve, "G2");

    buildFFT(curve, "G1");
    buildFFT(curve, "G2");
    buildFFT(curve, "Fr");

    buildPairing(curve);

    curve.array2buffer = function(arr, sG) {
        const buff = new Uint8Array(sG*arr.length);

        for (let i=0; i<arr.length; i++) {
            buff.set(arr[i], i*sG);
        }

        return buff;
    };

    curve.buffer2array = function(buff , sG) {
        const n= buff.byteLength / sG;
        const arr = new Array(n);
        for (let i=0; i<n; i++) {
            arr[i] = buff.slice(i*sG, i*sG+sG);
        }
        return arr;
    };

    return curve;
}

global.curve_bn128 = null;

async function buildBn128(singleThread) {

    if ((!singleThread)&&(global.curve_bn128)) return global.curve_bn128;
    const params = {
        name: "bn128",
        wasm: wasmcurves.bn128_wasm,
        q: e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
        r: e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
        n8q: 32,
        n8r: 32,
        cofactorG2: e$2("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function() {
        if (!params.singleThread) {
            global.curve_bn128 = null;
            await this.tm.terminate();
        }
    };

    if (!singleThread) {
        global.curve_bn128 = curve;
    }

    return curve;
}

global.curve_bls12381 = null;

async function buildBls12381(singleThread) {

    if ((!singleThread)&&(global.curve_bls12381)) return global.curve_bls12381;
    const params = {
        name: "bls12381",
        wasm: wasmcurves.bls12381_wasm,
        q: e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16),
        r: e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16),
        n8q: 48,
        n8r: 32,
        cofactorG1: e$2("0x396c8c005555e1568c00aaab0000aaab", 16),
        cofactorG2: e$2("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5", 16),
        singleThread: singleThread ? true : false
    };

    const curve = await buildEngine(params);
    curve.terminate = async function() {
        if (!params.singleThread) {
            global.curve_bls12381 = null;
            await this.tm.terminate();
        }
    };

    return curve;
}

const bls12381r = e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
const bn128r = e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617");

const bls12381q = e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16);
const bn128q = e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583");

async function getCurveFromR(r, singleThread) {
    let curve;
    if (eq$2(r, bn128r)) {
        curve = await buildBn128(singleThread);
    } else if (eq$2(r, bls12381r)) {
        curve = await buildBn128(singleThread);
    } else {
        throw new Error(`Curve not supported: ${toString(r)}`);
    }
    return curve;
}

async function getCurveFromQ(q, singleThread) {
    let curve;
    if (eq$2(q, bn128q)) {
        curve = await buildBn128(singleThread);
    } else if (eq$2(q, bls12381q)) {
        curve = await buildBn128(singleThread);
    } else {
        throw new Error(`Curve not supported: ${toString(q)}`);
    }
    return curve;
}

async function getCurveFromName(name, singleThread) {
    let curve;
    const normName = normalizeName(name);
    if (["BN128", "BN254", "ALTBN128"].indexOf(normName) >= 0) {
        curve = await buildBn128(singleThread);
    } else if (["BLS12381"].indexOf(normName) >= 0) {
        curve = await buildBn128(singleThread);
    } else {
        throw new Error(`Curve not supported: ${name}`);
    }
    return curve;

    function normalizeName(n) {
        return n.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
    }

}

const Scalar$1=_Scalar;
const utils$1 = _utils;

exports.BigBuffer = BigBuffer;
exports.ChaCha = ChaCha;
exports.EC = EC;
exports.F1Field = F1Field;
exports.F2Field = F2Field;
exports.F3Field = F3Field;
exports.PolField = PolField;
exports.Scalar = Scalar$1;
exports.ZqField = F1Field;
exports.buildBls12381 = buildBls12381;
exports.buildBn128 = buildBn128;
exports.getCurveFromName = getCurveFromName;
exports.getCurveFromQ = getCurveFromQ;
exports.getCurveFromR = getCurveFromR;
exports.utils = utils$1;
