/**
 * Copyright (c) 2012 Patrick Roberts
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * included in all copies or substantial portions of the Software.
 *
 * The above copyright notice and this permission notice shall be
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function (root) {
    'use strict';

    // localize Math and Number
    var Math = root.Math,
        Number = root.Number,
        // localize these commonly used constants
        PI = Math.PI,
        SQRT2PI,
        // localize constants for gamma function
        index = [],
        p,
        // matches commonly used unsupported formatting in human-readable expressions
        formExp = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]|(?:[\{\}\[\]]| *[\+\-\*\/\^ %] *)/gi,
        // matches either as few as zero continuous a-z followed by ( OR -,e^ optionally followed by (
        funcExp = /[a-z]*\(|(?:-|e\^)\(?/i,
        // matches continuous a-z NOT followed by (
        varsExp = /[a-z]+(?![a-z\(])/i,
        // matches +,-,*,/,^, ,%
        operExp = /[\+\-\*\/\^ %]/,
        // matches any positive float
        numsExp = /(?:\d*\.\d+|\d+\.\d*|\d+)(?:e[\-+]?\d+(?![\d\.]))?/i,
        // matches unsupported grouping
        openParen = /\{|\[/,
        closeParen = /\}|\]/,
        // catches implied multiplication like "3i" or ")x"
        // does NOT edit format "x(" where x is a-z
        // because that form implies a function, not a multiplication
        // (the compile method checks for implied multiplication in this case when needed)
        mult = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]/i,
        // matches exponentially formatted float
        expo = /(?:\d*\.\d+|\d+\.\d*|\d+)e[\-+]?\d+(?![\d\.])/i,
        // matches non-whitespace operators to trim
        trim = /[\+\-\*\/\^%]/,
        // maps functions and unary operators to compiled code
        funcObj = {
            '(': '(',
            'sqrt(': 'C.sqrt(',
            'cbrt(': 'C.cbrt(',
            'exp(': 'C.exp(',
            'e^(': 'C.exp(',
            'e^': 'C.exp(',
            'log(': 'C.log(',
            'ln(': 'C.log(',
            'gamma(': 'C.gamma(',
            'fact(': 'C.fact(',
            'factorial(': 'C.fact(',
            'sin(': 'C.sin(',
            'cos(': 'C.cos(',
            'tan(': 'C.tan(',
            'sec(': 'C.sec(',
            'csc(': 'C.csc(',
            'cot(': 'C.cot(',
            'arcsin(': 'C.arcsin(',
            'arccos(': 'C.arccos(',
            'arctan(': 'C.arctan(',
            'arcsec(': 'C.arcsec(',
            'arccsc(': 'C.arccsc(',
            'arccot(': 'C.arccot(',
            'arsin(': 'C.arcsin(',
            'arcos(': 'C.arccos(',
            'artan(': 'C.arctan(',
            'arsec(': 'C.arcsec(',
            'arcsc(': 'C.arccsc(',
            'arcot(': 'C.arccot(',
            'asin(': 'C.arcsin(',
            'acos(': 'C.arccos(',
            'atan(': 'C.arctan(',
            'asec(': 'C.arcsec(',
            'acsc(': 'C.arccsc(',
            'acot(': 'C.arccot(',
            'sinh(': 'C.sinh(',
            'cosh(': 'C.cosh(',
            'tanh(': 'C.tanh(',
            'sech(': 'C.sech(',
            'csch(': 'C.csch(',
            'coth(': 'C.coth(',
            'arcsinh(': 'C.arcsinh(',
            'arccosh(': 'C.arccosh(',
            'arctanh(': 'C.arctanh(',
            'arcsech(': 'C.arcsech(',
            'arccsch(': 'C.arccsch(',
            'arccoth(': 'C.arccoth(',
            'arsinh(': 'C.arcsinh(',
            'arcosh(': 'C.arccosh(',
            'artanh(': 'C.arctanh(',
            'arsech(': 'C.arcsech(',
            'arcsch(': 'C.arccsch(',
            'arcoth(': 'C.arccoth(',
            'asinh(': 'C.arcsinh(',
            'acosh(': 'C.arccosh(',
            'atanh(': 'C.arctanh(',
            'asech(': 'C.arcsech(',
            'acsch(': 'C.arccsch(',
            'acoth(': 'C.arccoth(',
            '-': 'C.neg(',
            '-(': 'C.neg(',
            're(': 'C.re(',
            'real(': 'C.re(',
            'im(': 'C.im(',
            'imag(': 'C.im(',
            'abs(': 'C.abs(',
            'mag(': 'C.abs(',
            'arg(': 'C.arg(',
            'conj(': 'C.conj(',
            'norm(': 'C.norm(',
            'normal(': 'C.norm(',
            'floor(': 'C.floor(',
            'ceil(': 'C.ceil(',
            'ceiling(': 'C.ceil(',
            'round(': 'C.round(',
            'fpart(': 'C.fPart(',
            'frac(': 'C.fPart(',
            'ipart(': 'C.iPart(',
            'int(': 'C.iPart('
        },
        // maps binary operators to compiled code
        operObj = {
            '+': '.add(',
            '-': '.sub(',
            '*': '.mult(',
            ' ': '.mult(',
            '/': '.div(',
            '%': '.mod(',
            '^': '.pow('
        },
        // maps default variables to compiled code
        varsObj = {
            'e': 'C.E',
            'i': 'C.I',
            'pi': 'C.PI'
        };

    function floor(x) {
        return (x >= 0 ? x - x % 1 : x - (1 + x % 1) % 1);
    }

    function ceil(x) {
        return (x >= 0 ? x + (1 - x % 1) % 1 : x - x % 1);
    }

    function round(x) {
        return floor(x + 0.5);
    }

    function ipart(x) {
        return x - x % 1;
    }

    function fpart(x) {
        return x % 1;
    }

    // Math object helper functions for more advanced formulas

    if (Math.sinh === undefined) {
        Math.sinh = function (x) {
            return (-Math.exp(-x) + Math.exp(x)) / 2;
        };
    }

    if (Math.cosh === undefined) {
        Math.cosh = function (x) {
            return (Math.exp(-x) + Math.exp(x)) / 2;
        };
    }

    // infinitesimal constant for comparing components
    if (Number.EPSILON === undefined) {
        Number.EPSILON = 2.220446049250313e-16;
    }

    /**
     * Complex constructor
     * optionally instantiate with `new`
     *
     * @param {Number} real part
     * @param {Number} imaginary part
     * @param {Number} optional, magnitude
     * @param {Number} optional, argument
     * @return {Object} complex number
     */

    function Complex(r, i, m, t) {
        if (!(this instanceof Complex)) {
            return new Complex(r, i, m, t);
        }

        if (typeof m === 'number') {
            this.m = Math.abs(m);
        } else {
            this.m = Math.sqrt(r * r + i * i);
        }

        if (typeof t === 'number') {
            this.t = (m >= 0 ? t : t + PI);
        } else {
            this.t = Math.atan2(i, r);
        }

        // limit argument between (-pi,pi]
        this.t = PI - (PI * 3 - (PI - (PI * 3 - this.t) % (PI * 2))) % (PI * 2);
        this.r = r;
        this.i = i;
    }

    // Initialize local variables dependent on Complex constructor
    SQRT2PI = new Complex(Math.sqrt(2 * PI), 0, Math.sqrt(2 * PI), 0);
    p = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ].map(function (coef, i) {
        index.push(new Complex(i, 0, i, 0));
        return new Complex(coef, 0, Math.abs(coef), coef < 0 ? PI : 0);
    });

    // Constants
    Complex.ZERO = new Complex(0, 0, 0, 0);
    Complex.ONE = new Complex(1, 0, 1, 0);
    Complex.I = new Complex(0, 1, 1, PI / 2);
    Complex.NEG_I = new Complex(0, -1, 1, 3 * PI / 2);
    Complex.PI = new Complex(PI, 0, PI, 0);
    Complex.E = new Complex(Math.E, 0, Math.E, 0);
    Complex.TWO = new Complex(2, 0, 2, 0);
    Complex.TWO_I = new Complex(0, 2, 2, PI / 2);

    /**
     * Polar Complex constructor
     * Do NOT instantiate with `new`
     *
     * @param {Number} magnitude
     * @param {Number} argument
     * @return {Object} complex number
     */

    Complex.Polar = function (r, t) {
        return new Complex(r * Math.cos(t), r * Math.sin(t), r, t);
    };

    /**
     * toString method
     * outputs complex number as string
     *
     * @param {Boolean} optional, output as cartesian, default is exponential
     * @return {String}
     */

    Complex.prototype.toString = function (cartesian) {
        var r,
            i,
            m,
            t;

        if (!Complex.isFinite(this)) {
            return 'Infinity';
        }

        if (Complex.isNaN(this)) {
            return 'NaN';
        }

        if (cartesian) {
            r = this.r.toPrecision().toUpperCase();
            i = this.i.toPrecision().toUpperCase();

            if (this.i === 0) {
                return r;
            }

            if (this.r === 0) {
                return Math.abs(this.i) === 1 ? (this.i > 0 ? 'i' : '-i') : i + ' i';
            }

            return r + (this.i > 0 ? '+' : '') + (Math.abs(this.i) === 1 ? (this.i > 0 ? 'i' : '-i') : i + ' i');
        }

        m = this.m.toPrecision().toUpperCase();
        t = this.t.toPrecision().toUpperCase();

        if (this.m === 0 || this.t === 0) {
            return m;
        }

        return m + ' e^(' + t + ' i)';
    };

    /**
     * Complex equals method
     *
     * @param {Object} complex number
     * @return {Boolean} is equal
     */

    Complex.prototype.equals = Complex.prototype['='] = function (c) {
        var r1 = this.r,
            i1 = this.i,
            m1 = this.m,
            t1 = this.t,
            r2 = c.r,
            i2 = c.i,
            m2 = c.m,
            t2 = c.t,
            realWithinBounds = Math.abs(r1 - r2) <= Math.max(Math.abs(r1), Math.abs(r2)) * Number.EPSILON,
            imagWithinBounds = Math.abs(i1 - i2) <= Math.max(Math.abs(i1), Math.abs(i2)) * Number.EPSILON,
            magWithinBounds = Math.abs(m1 - m2) <= Math.max(Math.abs(m1), Math.abs(m2)) * Number.EPSILON,
            argWithinBounds = Math.abs(t1 - t2) <= Math.max(Math.abs(t1), Math.abs(t2)) * Number.EPSILON;

        return (realWithinBounds && imagWithinBounds) || (magWithinBounds && argWithinBounds);
    };

    // convenience methods

    /**
     * Real method
     *
     * @return {Number} real part
     */

    Complex.prototype.re = Complex.prototype.real = function () {
        return this.r;
    };

    /**
     * Imaginary method
     *
     * @return {Number} imaginary part
     */

    Complex.prototype.im = Complex.prototype.imag = function () {
        return this.i;
    };

    /**
     * Magnitude method
     *
     * @return {Number} magnitude
     */

    Complex.prototype.abs = Complex.prototype.mag = function () {
        return this.m;
    };

    /**
     * Argument method
     *
     * @return {Number} argument
     */

    Complex.prototype.arg = Complex.prototype.angle = function () {
        return this.t;
    };

    // end convenience methods

    /**
     * Real Addition operator
     * `this` is augend
     *
     * @param {Number} real addend
     * @return {Object} complex sum
     */

    Complex.prototype.rAdd = function (r) {
        return new Complex(this.r + r, this.i);
    };

    /**
     * Addition operator
     * `this` is augend
     *
     * @param {Object} complex addend
     * @return {Object} complex sum
     */

    Complex.prototype.add = Complex.prototype['+'] = function (c) {
        return new Complex(this.r + c.r, this.i + c.i);
    };

    /**
     * Real Subtraction operator
     * `this` is minuend
     *
     * @param {Number} real subtrahend
     * @return {Object} complex difference
     */

    Complex.prototype.rSub = function (r) {
        return new Complex(this.r - r, this.i);
    };

    /**
     * Subtraction operator
     * `this` is minuend
     *
     * @param {Object} complex subtrahend
     * @return {Object} complex difference
     */

    Complex.prototype.sub = Complex.prototype['-'] = function (c) {
        return new Complex(this.r - c.r, this.i - c.i);
    };

    /**
     * Real Multiplication operator
     * `this` is multiplicand
     *
     * @param {Number} real multiplier
     * @return {Object} complex product
     */

    Complex.prototype.rMult = function (r) {
        // formula: r1 e^(t1i) * r2 = r1r2 e^(t1i)
        return Complex.Polar(this.m * r, this.t);
    };

    /**
     * Multiplication operator
     * `this` is multiplicand
     *
     * @param {Object} complex multiplier
     * @return {Object} complex product
     */

    Complex.prototype.mult = Complex.prototype['*'] = function (c) {
        // formula: r1 e^(t1i) * r2 e^(t2i) = r1r2 e^((t1+t2)i)
        return Complex.Polar(this.m * c.m, this.t + c.t);
    };

    /**
     * Real Division operator
     * `this` is dividend
     *
     * @param {Number} real divisor
     * @return {Object} complex quotient
     */

    Complex.prototype.rDiv = function (r) {
        // formula: r1 e^(t1i) / r2 = r1/r2 e^(t1i)
        return Complex.Polar(this.m / r, this.t);
    };

    /**
     * Division operator
     * `this` is dividend
     *
     * @param {Object} complex divisor
     * @return {Object} complex quotient
     */

    Complex.prototype.div = Complex.prototype['/'] = function (c) {
        // formula: r1 e^(t1i) / (r2 e^(t2i)) = r1/r2 e^((t1-t2)i)
        return Complex.Polar(this.m / c.m, this.t - c.t);
    };

    /**
     * Real Modulation operator
     * `this` is dividend
     *
     * @param {Number} real divisor
     * @return {Object} complex remainder
     */

    Complex.prototype.rMod = function (r) {
        return new Complex(r === 0 ? 0 : this.r % r, this.i);
    };

    /**
     * Modulation operator
     * `this` is dividend
     *
     * @param {Object} complex divisor
     * @return {Object} complex remainder
     */

    Complex.prototype.mod = Complex.prototype['%'] = function (c) {
        return new Complex(c.r === 0 ? 0 : this.r % c.r, c.i === 0 ? 0 : this.i % c.i);
    };

    /**
     * Real Power operator
     * `this` is base
     *
     * @param {Number} real exponent
     * @return {Object} complex power
     */

    Complex.prototype.rPow = function (z) {
        if (z === 2) {
            return Complex.square(this);
        }

        if (z === 3) {
            return Complex.cube(this);
        }

        // formula: (r e^(ti))^(z) = r^z e^(tzi)
        return Complex.Polar(Math.pow(this.m, z), this.t * z);
    };

    /**
     * Complex Power operator
     * `this` is base
     *
     * @param {Complex} complex exponent
     * @return {Object} complex power
     */

    Complex.prototype.pow = Complex.prototype['^'] = function (c) {
        // formula: (r e^(ti))^(a+bi) = (r^a e^(-bt)) e^((ln(r)b+at)i)
        if (c.i === 0) {
            return this.rPow(c.r);
        }

        return Complex.Polar(Math.pow(this.m, c.r) * Math.exp(-c.i * this.t), c.i * Math.log(this.m) + c.r * this.t);
    };

    /**
     * Negative function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.neg = function (c) {
        return new Complex(-c.r, -c.i, c.m, c.t + PI);
    };

    /**
     * Real Part function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.re = function (c) {
        return new Complex(c.r, 0, Math.abs(c.r), c.r < 0 ? PI : 0);
    };

    /**
     * Imaginary Part function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.im = function (c) {
        return new Complex(c.i, 0, Math.abs(c.i), c.i < 0 ? PI : 0);
    };

    /**
     * Absolute Value function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.abs = function (c) {
        return new Complex(c.m, 0, c.m, 0);
    };

    /**
     * Argument function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arg = function (c) {
        return new Complex(c.t, 0, Math.abs(c.t), c.t < 0 ? PI : 0);
    };

    /**
     * Complex Conjugate function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.conj = function (c) {
        return new Complex(c.r, -c.i, c.m, (PI * 2 - c.t) % PI * 2);
    };

    /**
     * Complex Normal function
     * determines unit normal of complex number
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.norm = function (c) {
        return Complex.Polar(c.m / c.m, c.m === 0 ? 0 : c.t);
    };

    /**
     * Floor function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.floor = function (c) {
        return new Complex(floor(c.r), floor(c.i));
    };

    /**
     * Ceiling function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.ceil = function (c) {
        return new Complex(ceil(c.r), ceil(c.i));
    };

    /**
     * Rounding function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.round = function (c) {
        return new Complex(round(c.r), round(c.i));
    };

    /**
     * Integer Part function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.iPart = function (c) {
        return new Complex(ipart(c.r), ipart(c.i));
    };

    /**
     * Fractional Part function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.fPart = function (c) {
        return new Complex(fpart(c.r), fpart(c.i));
    };

    /**
     * Square function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.square = function (c) {
        // formula: (a+bi)^2 = (a^2-b^2) + (2ab)i
        return new Complex(c.r * c.r - c.i * c.i, 2 * c.r * c.i, c.m * c.m, c.t * 2);
    };

    /**
     * Cube function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cube = function (c) {
        // formula: (a+bi)^3 = (a^3-3ab^2) + (3a^2b-b^3)i
        return new Complex(c.r * c.r * c.r - 3 * c.r * c.i * c.i, 3 * c.r * c.r * c.i - c.i * c.i * c.i, c.m * c.m * c.m, c.t * 3);
    };

    /**
     * Square Root function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sqrt = function (c) {
        return c.rPow(0.5);
    };

    /**
     * Cube Root function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cbrt = function (c) {
        return c.rPow(1 / 3);
    };

    /**
     * Exponential function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.exp = function (c) {
        // formula: e^(a+bi) = e^a e^(bi)
        return c.i === 0 ? Complex.E.rPow(c.r) : Complex.Polar(Math.exp(c.r), c.i);
    };

    /**
     * Natural Logarithm function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.log = function (c) {
        // formula: log(r e^(ti)) = log(r)+ti
        return new Complex(Math.log(c.m), c.t);
    };

    /**
     * Gamma function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.gamma = function (c) {
        var z,
            x,
            i,
            t;

        if (c.r < 0.5) {
            return Complex.PI.div(Complex.sin(Complex.PI.mult(c)).mult(Complex.gamma(Complex.ONE.sub(c))));
        }

        z = c.sub(Complex.ONE);
        x = p[0];

        for (i = 1; i < 9; i++) {
            x = x.add(p[i].div(z.add(index[i])));
        }

        t = z.add(new Complex(7.5, 0, 7.5, 0));
        return SQRT2PI.mult(t.pow(z.add(new Complex(0.5, 0, 0.5, 0)))).mult(Complex.exp(Complex.neg(t))).mult(x);
    };

    /**
     * Factorial function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.fact = function (c) {
        return Complex.gamma(c.add(Complex.ONE));
    };

    /**
     * Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cos = function (c) {
        // formula: cos(c) = (e^(ci)+e^(-ci))/2
        var ci = c.mult(Complex.I);

        return Complex.exp(ci).add(Complex.exp(Complex.neg(ci))).div(Complex.TWO);
    };

    /**
     * Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sin = function (c) {
        // formula: sin(c) = (e^(ci)-e^(-ci))/(2i)
        var ci = c.mult(Complex.I);

        return Complex.exp(ci).sub(Complex.exp(Complex.neg(ci))).div(Complex.TWO_I);
    };

    /**
     * Tangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.tan = function (c) {
        // formula: tan(c) = (e^(ci)-e^(-ci))/(i(e^(ci)+e^(-ci)))
        var ci = c.mult(Complex.I),
            pex = Complex.exp(ci),
            nex = Complex.exp(Complex.neg(ci));

        return pex.sub(nex).div(pex.add(nex).mult(Complex.I));
    };

    /**
     * Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sec = function (c) {
        // formula: sec(c) = 2/(e^(ci)+e^(-ci))
        var ci = c.mult(Complex.I);

        return Complex.TWO.div(Complex.exp(ci).add(Complex.exp(Complex.neg(ci))));
    };

    /**
     * Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.csc = function (c) {
        // formula: csc(c) = 2i/(e^(ci)-e^(-ci))
        var ci = c.mult(Complex.I);

        return Complex.TWO_I.div(Complex.exp(ci).sub(Complex.exp(Complex.neg(ci))));
    };

    /**
     * Cotangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cot = function (c) {
        // formula: cot(c) = i(e^(ci)+e^(-ci))/(e^(ci)-e^(-ci))
        var ci = c.mult(Complex.I),
            pex = Complex.exp(ci),
            nex = Complex.exp(Complex.neg(ci));

        return pex.add(nex).mult(Complex.I).div(pex.sub(nex));
    };

    /**
     * Inverse Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccos = function (c) {
        // formula: arccos(c) = i*log(c-i*sqrt(1-c^2))
        return Complex.I.mult(Complex.log(c.add(Complex.NEG_I.mult(Complex.sqrt(Complex.ONE.sub(c.rPow(2)))))));
    };

    /**
     * Inverse Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsin = function (c) {
        // formula: arcsin(c) = -i*log(ci+sqrt(1-c^2))
        return Complex.NEG_I.mult(Complex.log(c.mult(Complex.I).add(Complex.sqrt(Complex.ONE.sub(c.rPow(2))))));
    };

    /**
     * Inverse Tangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arctan = function (c) {
        // formula: arctan(c) = i/2 log((i+x)/(i-x))
        var i = Complex.I;

        return i.mult(Complex.log(i.add(c).div(i.sub(c)))).div(Complex.TWO);
    };

    /**
     * Inverse Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsec = function (c) {
        // formula: arcsec(c) = -i*log(1/c+sqrt(1-i/c^2))
        return Complex.NEG_I.mult(Complex.log(c.rPow(-1).add(Complex.sqrt(Complex.ONE.sub(Complex.I.div(c.rPow(2)))))));
    };

    /**
     * Inverse Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccsc = function (c) {
        // formula: arccsc(c) = -i*log(i/c+sqrt(1-1/c^2))
        return Complex.NEG_I.mult(Complex.log(Complex.I.div(c).add(Complex.sqrt(Complex.ONE.sub(c.rPow(-2))))));
    };

    /**
     * Inverse Cotangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccot = function (c) {
        // formula: arccot(c) = i/2 log((c-i)/(c+i))
        var i = Complex.I;

        return i.mult(Complex.log(c.sub(i).div(c.add(i)))).div(Complex.TWO);
    };

    /**
     * Hyperbolic Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cosh = function (c) {
        // formula: cosh(c) = (e^c+e^-c)/2
        return Complex.exp(c).add(Complex.exp(Complex.neg(c))).div(Complex.TWO);
    };

    /**
     * Hyperbolic Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sinh = function (c) {
        // formula: sinh(c) = (e^c-e^-c)/2
        return Complex.exp(c).sub(Complex.exp(Complex.neg(c))).div(Complex.TWO);
    };

    /**
     * Hyperbolic Tangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.tanh = function (c) {
        // formula: tanh(c) = (e^c-e^-c)/(e^c+e^-c)
        var pex = Complex.exp(c),
            nex = Complex.exp(Complex.neg(c));

        return pex.sub(nex).div(pex.add(nex));
    };

    /**
     * Hyperbolic Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sech = function (c) {
        // formula: sech(c) = 2/(e^c+e^-c)
        return Complex.TWO.div(Complex.exp(c).add(Complex.exp(Complex.neg(c))));
    };

    /**
     * Hyperbolic Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.csch = function (c) {
        // formula: csch(c) = 2/(e^c-e^-c)
        return Complex.TWO.div(Complex.exp(c).sub(Complex.exp(Complex.neg(c))));
    };

    /**
     * Hyperbolic Cotangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.coth = function (c) {
        // formula: coth(c) = (e^c+e^-c)/(e^c-e^-c)
        var pex = Complex.exp(c),
            nex = Complex.exp(Complex.neg(c));

        return pex.add(nex).div(pex.sub(nex));
    };

    /**
     * Inverse Hyperbolic Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccosh = function (c) {
        // formula: arccosh(c) = log(c+sqrt(c^2-1))
        return Complex.log(c.add(Complex.sqrt(c.rPow(2).sub(Complex.ONE))));
    };

    /**
     * Inverse Hyperbolic Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsinh = function (c) {
        // formula: arcsinh(c) = log(c+sqrt(c^2+1))
        return Complex.log(c.add(Complex.sqrt(c.rPow(2).add(Complex.ONE))));
    };

    /**
     * Inverse Hyperbolic Tangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arctanh = function (c) {
        // formula: arctanh(c) = log((1+c)/(1-c))/2
        return Complex.log(Complex.ONE.add(c).div(Complex.ONE.sub(c))).div(Complex.TWO);
    };

    /**
     * Inverse Hyperbolic Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsech = function (c) {
        // formula: arcsech(c) = log((1+sqrt(1-c^2))/c)
        return Complex.log(Complex.ONE.add(Complex.sqrt(Complex.ONE.sub(c.rPow(2)))).div(c));
    };

    /**
     * Inverse Hyperbolic Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccsch = function (c) {
        // formula: arccsch(c) = log((1+sqrt(1+c^2))/c)
        return Complex.log(Complex.ONE.add(Complex.sqrt(Complex.ONE.add(c.rPow(2)))).div(c));
    };

    /**
     * Inverse Hyperbolic Cotangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccoth = function (c) {
        // formula: arccoth(c) = log((c+1)/(c-1))/2
        return Complex.log(c.add(Complex.ONE).div(c.sub(Complex.ONE))).div(Complex.TWO);
    };

    /**
     * Minimum function (by absolute value)
     *
     * @params {Object} complex numbers
     * @return {Object} complex number
     */

    Complex.min = function () {
        var args = Array.prototype.slice.call(arguments).map(function (c) {
                return c.m;
            }),
            min = Math.min.apply(Math, args);

        return arguments[args.indexOf(min)];
    };

    /**
     * Maximum function (by absolute value)
     *
     * @params {Object} complex numbers
     * @return {Object} complex number
     */

    Complex.max = function () {
        var args = Array.prototype.slice.call(arguments).map(function (c) {
                return c.m;
            }),
            max = Math.max.apply(Math, args);

        return arguments[args.indexOf(max)];
    };

    /**
     * isNaN method
     * determines if complex number has any malformed components
     *
     * @param {Object} complex number
     * @return {Boolean} isNaN
     */

    Complex.isNaN = function (c) {
        return isNaN(c.r) || isNaN(c.i) || isNaN(c.m) || isNaN(c.t);
    };

    /**
     * isFinite function
     * determines if complex number has a finite magnitude
     *
     * @param {Object} complex number
     * @return {Boolean} isFinite
     */

    Complex.isFinite = function (c) {
        return isFinite(c.m);
    };

    // replaces human-readable expression formats unsupported by Complex.parseFunction
    function format(match, offset, str) {
        var i;

        if (mult.test(match)) {
            // catches exponentially represented floats and omits formatting these
            if (expo.test(str.slice(offset))) {
                return match;
            }
            // recursively calls formatter in case of {,[,},]
            return match.charAt(0).replace(formExp, format) + '*' + match.charAt(1).replace(formExp, format);
        }

        if (openParen.test(match)) {
            return '(';
        }

        if (closeParen.test(match)) {
            return ')';
        }

        i = match.search(trim);
        return match.charAt(i !== -1 ? i : '*');
    }

    /**
     * formatFunction method
     * repairs unsupported formatting in a human-readable math expression
     * can be called separately for asynchronous user-confirmation
     *
     * @param {String} human-readable math expression
     * @return {String} properly-formatted human-readable math expression
     */

    Complex.formatFunction = function (str) {
        return str.replace(formExp, format);
    };

    // maps the arguments to arbitrarily generated names
    function generate(args) {
        // characters to be removed from variable names supplied
        var rmChars = /[^a-z]+/gi,
        // used to generate compiled variable names
            abc = 'abcdefghijklmnopqrstuvwxyz',
            mod = abc.length,
            map = {},
            str = '',
            i,
            j,
            k;
        // fix and validate them first
        args = args.map(function (arg) {
            var name = arg.replace(rmChars, '');

            if (arg !== name) {
                throw new SyntaxError('"' + arg + '" is an invalid variable name.');
            }

            return name.toLowerCase();
        });

        for (i = 0; i < args.length; i++) {
            if (map[args[i]]) {
                throw new ReferenceError('May not have duplicate parameter names.');
            }

            j = i;

            while (j >= 0) {
                // "digit" index
                k = j % mod;
                j = j - k;
                str = abc.charAt(k) + str;
                // leftover
                j = j / mod - 1;
            }

            map[args[i]] = str;
            str = '';
        }

        return map;
    }

    // returns last index of grouped expression located at i
    function endGroup(str, i) {
        var nest = 1;

        while (nest > 0 && i < str.length) {
            if (str[i] === '(') {
                nest++;
            }

            if (str[i] === ')') {
                nest--;
            }

            i++;
        }

        if (nest > 0) {
            throw new SyntaxError('Expected ")".');
        }

        return i - 1;
    }

    // returns last index of expression to add or subtract located at i based on order of operations
    function nextShift(str, i) {
        var nest = 0,
            c,
            s;

        for (c = i; c < str.length; c++) {
            if (str[c] === '(') {
                nest++;
            } else if (str[c] === ')') {
                nest--;
            }

            if (nest < 0) {
                throw new SyntaxError('Unexpected token ")".');
            }

            if (nest === 0) {
                if (str[c] === '+' || (str[c] === '-' && !operObj[str[c - 1]])) {
                    // ensures that nextOper skips the implicit operator of a float, e.g. the minus in "2e-1"
                    s = str.substr(Math.max(0, c - 3)).search(expo);

                    if (s === -1 || s > 1) {
                        return c;
                    }
                }
            }
        }

        return str.length;
    }

    // returns last index of expression to multiply or divide located at i based on order of operations
    function nextScale(str, i) {
        var nest = 0,
            c,
            s;

        for (c = i; c < str.length; c++) {
            if (str[c] === '(') {
                nest++;
            } else if (str[c] === ')') {
                nest--;
            }

            if (nest < 0) {
                throw new SyntaxError('Unexpected token ")".');
            }

            if (nest === 0) {
                if (str[c] === '+' || (str[c] === '-' && !operObj[str[c - 1]])) {
                    // ensures that nextOper skips the implicit operator of a float, e.g. the minus in "2e-1"
                    s = str.substr(Math.max(0, c - 3)).search(expo);

                    if (s === -1 || s > 1) {
                        return c;
                    }
                }

                if (str[c] === '*' || str[c] === '/' || str[c] === ' ' || str[c] === '%') {
                    return c;
                }
            }
        }

        return str.length;
    }

    // switches operator to determine which order of operations to apply
    function nextOper(oper, str, i) {
        switch (oper) {
        case '+':
        case '-':
            return nextShift(str, i);
        case '*':
        case ' ':
        case '/':
        case '%':
        case '^':
            return nextScale(str, i);
        default:
            throw new SyntaxError('"' + oper + '" is not a valid operator.');
        }
    }

    // instances of this will be bound to each compiled function returned to cache parsed numerical constants
    function Namespace() {
        Array.apply(this, arguments);
    }

    Namespace.prototype = [];

    Namespace.prototype.push = function () {
        return Array.prototype.push.apply(this, arguments) - 1;
    };

    Namespace.prototype.Complex = Complex;

    // recursively compiles human-readable expression with given variable map and namespace for constants
    function compile(exp, vars, namespace) {
        var str = '',
            i = 0,
            // parse functions, variables, or constants before searching for operators
            findOper = false,
            match,
            name,
            func,
            oper,
            nums,
            j;

        if (exp.length === 0) {
            throw new SyntaxError('"" is not a valid argument.');
        }

        while (i < exp.length) {
            // attempts to parse a function
            if (!findOper && exp.substr(i).search(funcExp) === 0) {
                match = exp.substr(i).match(funcExp)[0];
                func = funcObj[match];
                // determines functional group to which to apply function
                // the exceptions "-" and "e^" do not simply look for ")" to end functional group
                switch (match) {
                case '-':
                    j = nextShift(exp, i + match.length);
                    break;
                case 'e^':
                    j = nextScale(exp, i + match.length);
                    break;
                default:
                    j = endGroup(exp, i + match.length);
                    break;
                }
                // instead of throwing error, attempt to resolve by assuming implied multiplication first
                if (!func) {
                    // strips off "(";
                    match = match.substr(0, match.length - 1);
                    // if this fails it's hopeless
                    if (!(varsObj[match] || vars[match])) {
                        throw new ReferenceError('"' + match + '(" is not a valid function.');
                    }
                    // since the format function omits checking this, this is a valid exception
                    // and this edits the whole expression and allows the loop to parse a variable
                    exp = exp.substr(0, i) + match + '*(' + exp.substr(i + match.length + 1);
                } else {
                    // ignores extraneous grouping
                    str += (func === '(' ? '' : func);
                    i += match.length;
                    str += compile(exp.substring(i, j), vars, namespace) + (func === '(' ? '' : ')');
                    i = (exp[j] === ')' ? j + 1 : j);
                    findOper = true;
                }
            // attempts to parse a variable
            } else if (!findOper && exp.substr(i).search(varsExp) === 0) {
                match = exp.substr(i).match(varsExp)[0];
                name = varsObj[match] || vars[match];

                if (!name) {
                    throw new ReferenceError('"' + match + '" is not a valid variable.');
                }

                str += name;
                i += match.length;
                findOper = true;
            // attempts to parse a number
            } else if (!findOper && exp.substr(i).search(numsExp) === 0) {
                match = exp.substr(i).match(numsExp)[0];
                nums = parseFloat(match);

                if (isNaN(nums)) {
                    throw new TypeError('"' + match + '" is not a valid number.');
                }

                // adding constant to bound namespace
                str += 'this[' + namespace.push(new Complex(nums, 0, nums, 0)) + ']';
                i += match.length;
                findOper = true;
            // attempts to parse an operator
            } else if (findOper && exp.substr(i).search(operExp) === 0) {
                match = exp.substr(i).match(operExp)[0];
                oper = operObj[match];
                j = nextOper(match, exp, i + match.length);

                if (!oper) {
                    throw new SyntaxError('"' + match + '" is not a valid operator.');
                }

                str += oper;
                i += match.length;
                str += compile(exp.substring(i, j), vars, namespace) + ')';
                i = (exp[j] === ')' ? j + 1 : j);
                findOper = true;
            // no identifiable expressions left to parse
            } else {
                throw new SyntaxError('Unexpected token "' + exp.charAt(i) + '".');
            }
        }

        return str;
    }

    /**
     * parseFunction method
     * compiles a human-readable math expression into callable function
     *
     * @param {String} human-readable math expression
     * @param {Array} optional, ordered array of human-readable variables
     * @param {Boolean} optional, skip pre-formatting, defaults to false
     * @return {Function} complex math function
     */

    Complex.parseFunction = function (str, args, skipFormat) {
        // manage optional arguments
        if (typeof args === 'boolean') {
            skipFormat = args;
            args = [];
        } else if (!(typeof args === 'object' && args !== null && args.constructor === Array)) {
            args = [];
        }
        // make everything lowercase because it's easier
        str = str.toLowerCase();
        // default is to format the human-readable string
        if (!skipFormat) {
            str = Complex.formatFunction(str);
        }

        // generate map of compiled variable names
        var vars = generate(args),
            // create namespace to bind to function
            namespace = new Namespace(),
            // compile function body from string given valid arguments and namespace to cache parsed numerical constants
            body = compile(str, vars, namespace),
            // convert compiled variable names map to array for function arguments
            params = args.map(function (arg) {
                return vars[arg];
            }).join(',');
        // the constructed function being returned
        return (new Function(params, 'var C=this.Complex;return ' + body + ';')).bind(namespace);
    };

    // Expose the Complex class
    if (typeof module !== 'undefined' && module !== null && module.exports) {
        // Node.js
        module.exports = Complex;
    } else {
        // Browser
        root.Complex = Complex;
    }

}(typeof global === 'undefined' ? this : global));
