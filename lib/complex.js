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

(function () {

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

    // localize global scope, Math and Number
    var root = this,
        Math = root.Math,
        Number = root.Number,

        // localize these commonly used constants
        PI = Math.PI,
        SQRT2PI = new Complex(Math.sqrt(2 * PI), 0, Math.sqrt(2 * PI), 0),

        // localize constants for gamma function
        g = 7,
        index = [],
        p = [
            0.99999999999980993, 676.5203681218851, -1259.1392167224028,
            771.32342877765313, -176.61502916214059, 12.507343278686905,
            -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
        ].map(function (coef, i) {
            index.push(new Complex(i, 0, i, 0));
            return new Complex(coef, 0, Math.abs(coef), coef < 0 ? PI : 0);
        });

    // Math object helper functions for more advanced formulas
    Math.sinh = function (x) {
        return (-Math.exp(-x) + Math.exp(x)) / 2;
    };

    Math.cosh = function (x) {
        return (Math.exp(-x) + Math.exp(x)) / 2;
    };

    // infinitesimal constant for comparing components
    Number.EPSILON = Number.EPSILON || 2.220446049250313e-16;

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
        var invoked = this instanceof Complex,
            self = invoked ? this : new Complex(r, i, m, t);
        if (!invoked) {
            return self;
        }
        self.m = (typeof m === "number" ? Math.abs(m) : Math.sqrt(r * r + i * i));
        if (typeof t === "number") {
            self.t = (m >= 0 ? t : t + PI);
        } else {
            self.t = Math.atan2(i, r);
        }
        // limit argument between (-pi,pi]
        self.t = PI - (PI * 3 - (PI - (PI * 3 - self.t) % (PI * 2))) % (PI * 2);
        self.r = r;
        self.i = i;
    }

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

    Complex.prototype.toString = function (type) {
        if (!Complex.isFinite(this)) {
            return "Infinity";
        }
        if (Complex.isNaN(this)) {
            return "NaN";
        }
        if (type) {
            var r = this.r.toPrecision().toUpperCase(),
                i = this.i.toPrecision().toUpperCase();
            if (this.i === 0) {
                return r;
            }
            if (this.r === 0) {
                return Math.abs(this.i) === 1 ? (this.i > 0 ? "i" : "-i") : i + " i";
            }
            return r + (this.i > 0 ? "+" : "") + (Math.abs(this.i) === 1 ? (this.i > 0 ? "i" : "-i") : i + " i");
        }
        var m = this.m.toPrecision().toUpperCase(),
            t = this.t.toPrecision().toUpperCase();
        if (this.m === 0 || this.t === 0) {
            return m;
        }
        return m + " e^(" + t + " i)";
    };

    /**
     * Complex equals method
     *
     * @param {Object} complex number
     * @return {Boolean} is equal
     */

    Complex.prototype.equals = function (c) {
        var r1 = this.r,
            i1 = this.i,
            m1 = this.m,
            t1 = this.t,
            r2 = c.r,
            i2 = c.i,
            m2 = c.m,
            t2 = c.t;
        return (Math.abs(r1 - r2) <= Math.max(Math.abs(r1), Math.abs(r2)) * Number.EPSILON && Math.abs(i1 - i2) <= Math.max(Math.abs(i1), Math.abs(i2)) * Number.EPSILON) || (Math.abs(m1 - m2) <= Math.max(Math.abs(m1), Math.abs(m2)) * Number.EPSILON && Math.abs(t1 - t2) <= Math.max(Math.abs(t1), Math.abs(t2)) * Number.EPSILON);
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

    /**
     * Addition operator
     * `this` is augend
     *
     * @param {Object} complex addend
     * @return {Object} complex sum
     */

    Complex.prototype.add = function (c) {
        return new Complex(this.r + c.r, this.i + c.i);
    };

    /**
     * Subtraction operator
     * `this` is minuend
     *
     * @param {Object} complex subtrahend
     * @return {Object} complex difference
     */

    Complex.prototype.sub = function (c) {
        return new Complex(this.r - c.r, this.i - c.i);
    };

    /**
     * Multiplication operator
     * `this` is multiplicand
     *
     * @param {Object} complex multiplier
     * @return {Object} complex product
     */

    Complex.prototype.mult = function (c) {
        // formula: r1 e^(t1i) * r2 e^(t2i) = r1r2 e^((t1+t2)i)
        return Complex.Polar(this.m * c.m, this.t + c.t);
    };

    /**
     * Division operator
     * `this` is dividend
     *
     * @param {Object} complex divisor
     * @return {Object} complex quotient
     */

    Complex.prototype.divBy = function (c) {
        // formula: r1 e^(t1i) / (r2 e^(t2i)) = r1/r2 e^((t1-t2)i)
        return Complex.Polar(this.m / c.m, this.t - c.t);
    };

    /**
     * Modulation operator
     * `this` is dividend
     *
     * @param {Object} complex divisor
     * @return {Object} complex remainder
     */

    Complex.prototype.mod = function (c) {
        return new Complex(c.r === 0 ? 0 : this.r % c.r, c.i === 0 ? 0 : this.i % c.i);
    };

    /**
     * Real Power operator
     * `this` is base
     *
     * @param {Number} real exponent
     * @return {Object} complex power
     */

    Complex.prototype.pow = function (z) {
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

    Complex.prototype.cPow = function (c) {
        // formula: (r e^(ti))^(a+bi) = (r^a e^(-bt)) e^((ln(r)b+at)i)
        return c.i === 0 ? this.pow(c.r) : Complex.Polar(Math.pow(this.m, c.r) * Math.exp(-c.i * this.t), c.i * Math.log(this.m) + c.r * this.t);
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
        return c.pow(0.5);
    };

    /**
     * Cube Root function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cbrt = function (c) {
        return c.pow(1 / 3);
    };

    /**
     * Exponential function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.exp = function (c) {
        // formula: e^(a+bi) = e^a e^(bi)
        return c.i === 0 ? Complex.E.pow(c.r) : Complex.Polar(Math.exp(c.r), c.i);
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
        if (c.r < 0.5) {
            return Complex.PI.divBy(Complex.sin(Complex.PI.mult(c)).mult(Complex.gamma(Complex["1"].sub(c))));
        }
        var z = c.sub(Complex["1"]),
            x = p[0],
            i,
            t;
        for (i = 1; i < g + 2; i++) {
            x = x.add(p[i].divBy(z.add(index[i])));
        }
        t = z.add(new Complex(g + 0.5, 0, g + 0.5, 0));
        return SQRT2PI.mult(t.cPow(z.add(new Complex(0.5, 0, 0.5, 0)))).mult(Complex.exp(Complex.neg(t))).mult(x);
    };

    /**
     * Factorial function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.fact = function (c) {
        return Complex.gamma(c.add(Complex["1"]));
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
        return Complex.exp(ci).add(Complex.exp(Complex.neg(ci))).divBy(Complex["2"]);
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
        return Complex.exp(ci).sub(Complex.exp(Complex.neg(ci))).divBy(Complex["2I"]);
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
        return pex.sub(nex).divBy(pex.add(nex).mult(Complex.I));
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
        return Complex["2"].divBy(Complex.exp(ci).add(Complex.exp(Complex.neg(ci))));
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
        return Complex["2I"].divBy(Complex.exp(ci).sub(Complex.exp(Complex.neg(ci))));
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
        return pex.add(nex).mult(Complex.I).divBy(pex.sub(nex));
    };

    /**
     * Inverse Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccos = function (c) {
        // formula: arccos(c) = i*log(c-i*sqrt(1-c^2))
        return Complex.I.mult(Complex.log(c.add(Complex["-I"].mult(Complex.sqrt(Complex["1"].sub(c.pow(2)))))));
    };

    /**
     * Inverse Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsin = function (c) {
        // formula: arcsin(c) = -i*log(ic+sqrt(1-c^2))
        return Complex["-I"].mult(Complex.log(Complex.I.mult(c).add(Complex.sqrt(Complex["1"].sub(c.pow(2))))));
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
        return i.mult(Complex.log(i.add(c).divBy(i.sub(c)))).divBy(Complex["2"]);
    };

    /**
     * Inverse Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsec = function (c) {
        // formula: arcsec(c) = -i*log(1/c+sqrt(1-i/c^2))
        return Complex["-I"].mult(Complex.log(c.pow(-1).add(Complex.sqrt(Complex["1"].sub(Complex.I.divBy(c.pow(2)))))));
    };

    /**
     * Inverse Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccsc = function (c) {
        // formula: arccsc(c) = -i*log(i/c+sqrt(1-1/c^2))
        return Complex["-I"].mult(Complex.log(Complex.I.divBy(c).add(Complex.sqrt(Complex["1"].sub(c.pow(-2))))));
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
        return i.mult(Complex.log(c.sub(i).divBy(c.add(i)))).divBy(Complex["2"]);
    };

    /**
     * Hyperbolic Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.cosh = function (c) {
        // formula: cosh(c) = (e^c+e^-c)/2
        return Complex.exp(c).add(Complex.exp(Complex.neg(c))).divBy(Complex["2"]);
    };

    /**
     * Hyperbolic Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sinh = function (c) {
        // formula: sinh(c) = (e^c-e^-c)/2
        return Complex.exp(c).sub(Complex.exp(Complex.neg(c))).divBy(Complex["2"]);
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
        return pex.sub(nex).divBy(pex.add(nex));
    };

    /**
     * Hyperbolic Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.sech = function (c) {
        // formula: sech(c) = 2/(e^c+e^-c)
        return Complex["2"].divBy(Complex.exp(c).add(Complex.exp(Complex.neg(c))));
    };

    /**
     * Hyperbolic Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.csch = function (c) {
        // formula: csch(c) = 2/(e^c-e^-c)
        return Complex["2"].divBy(Complex.exp(c).sub(Complex.exp(Complex.neg(c))));
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
        return pex.add(nex).divBy(pex.sub(nex));
    };

    /**
     * Inverse Hyperbolic Cosine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccosh = function (c) {
        // formula: arccosh(c) = log(c+sqrt(c^2-1))
        return Complex.log(c.add(Complex.sqrt(c.pow(2).sub(Complex["1"]))));
    };

    /**
     * Inverse Hyperbolic Sine function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsinh = function (c) {
        // formula: arcsinh(c) = log(c+sqrt(c^2+1))
        return Complex.log(c.add(Complex.sqrt(c.pow(2).add(Complex["1"]))));
    };

    /**
     * Inverse Hyperbolic Tangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arctanh = function (c) {
        // formula: arctanh(c) = 1/2 log((1+c)/(1-c))
        return Complex.log(Complex["1"].add(c).divBy(Complex["1"].sub(c))).divBy(Complex["2"]);
    };

    /**
     * Inverse Hyperbolic Secant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arcsech = function (c) {
        // formula: arcsech(c) = log((1+sqrt(1-c^2))/c)
        return Complex.log(Complex["1"].add(Complex.sqrt(Complex["1"].sub(c.pow(2)))).divBy(c));
    };

    /**
     * Inverse Hyperbolic Cosecant function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccsch = function (c) {
        // formula: arccsch(c) = log((1+sqrt(1+c^2))/c)
        return Complex.log(Complex["1"].add(Complex.sqrt(Complex["1"].add(c.pow(2)))).divBy(c));
    };

    /**
     * Inverse Hyperbolic Cotangent function
     *
     * @param {Object} complex number
     * @return {Object} complex number
     */

    Complex.arccoth = function (c) {
        // formula: arccoth(c) = 1/2 log((c+1)/(c-1))
        return Complex.log(c.add(Complex["1"]).divBy(c.sub(Complex["1"]))).divBy(Complex["2"]);
    };

    /**
     * Minimum function (by absolute value)
     *
     * @params {Object} complex numbers
     * @return {Object} complex number
     */

    Complex.min = function () {
        var args = [].slice.call(
                arguments
            ).map(function (c) {
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
        var args = [].slice.call(
                arguments
            ).map(function (c) {
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
        var self = this,
            // generate map of compiled variable names
            vars = self.generate(args = args || []),
            namespace = new self.Namespace();
        // make everything lowercase because it's easier
        str = str.toLowerCase();
        // default is to format the human-readable string
        if (!skipFormat) {
            str = self.formatFunction(str);
        }
        // the constructed function being returned
        return new Function(
            // arguments being mapped to compiled names
            args.map(function (arg) {
                return vars[arg];
            }).join(","),
            // function body being compiled
            "return " + (function compile(exp) {
                var str = "",
                    i = 0,
                    lastObj = 0, // 0:function||unary operator, 1:binary operator, 2:variable||constant
                    match,
                    name,
                    func,
                    oper,
                    nums,
                    num,
                    j;
                while (i < exp.length) {
                    // although e is a constant, the exponent function is much more efficient than the complex power function
                    if (lastObj !== 2 && exp.substr(i, 2) !== "e^" && exp.substr(i).search(self.varsExp) === 0) { // attempts to parse a variable
                        match = exp.substr(i).match(self.varsExp)[0];
                        name = self.varsObj[match] || vars[match];
                        if (!name) {
                            throw '"' + match + '" is not a valid variable.';
                        }
                        str += name;
                        i += match.length;
                        lastObj = 2;
                    } else if (lastObj !== 2 && exp.substr(i).search(self.funcExp) === 0) { // attempts to parse a function
                        match = exp.substr(i).match(self.funcExp)[0];
                        func = self.funcObj[match];
                        // determines functional group to which to apply function
                        // the exceptions - and e^ do not simply look for ) to end functional group
                        j = match === "-" ? self.nextAddSub(exp, i + match.length) : match === "e^" ? self.nextMultDiv(exp, i + match.length) : self.endNest(exp, i + match.length);
                        if (!func) { // instead of throwing exception, attempt to resolve by assuming implied multiplication first
                            match = match.substr(0, match.length - 1); // strips off "(";
                            // if this fails it's hopeless
                            if (!(self.varsObj[match] || vars[match])) {
                                throw '"' + match + '(" is not a valid function.';
                            }
                            // since the format function omits checking this, this is a valid exception
                            exp = exp.substr(0, i) + match + "*(" + exp.substr(i + match.length + 1);
                        } else {
                            str += func === "(" ? "" : func; // ignores extraneous grouping
                            i += match.length;
                            str += compile(exp.substring(i, j)) + (func === "(" ? "" : ")");
                            i = exp[j] === ")" ? j + 1 : j;
                            lastObj = 2;
                        }
                    } else if (lastObj === 2 && exp.substr(i).search(self.operExp) === 0) { // attempts to parse an operator
                        match = exp.substr(i).match(self.operExp)[0];
                        oper = self.operObj[match];
                        // ensures that nextOperator skips the implicit operator of a float, e.g. the minus in "2e-1"
                        num = exp.substr(i + 1).search(self.numsExp) === 0 && exp.substr(i + 1).match(self.numsExp)[0];
                        j = self.nextOperator(match, exp, i + match.length + (num ? num.length : 0));
                        if (!oper) {
                            throw '"' + match + '" is not a valid operator.';
                        }
                        str += oper;
                        i += match.length;
                        str += compile(exp.substring(i, j)) + ")";
                        i = exp[j] === ")" ? j + 1 : j;
                        lastObj = 2;
                    } else if (lastObj !== 2 && exp.substr(i).search(self.numsExp) === 0) { // attempts to parse a number
                        match = exp.substr(i).match(self.numsExp)[0];
                        nums = parseFloat(match);
                        if (isNaN(nums)) {
                            throw '"' + match + '" is not a valid number.';
                        }
                        // adding constant to bound namespace
                        str += "this.array[" + namespace.addComplex(new Complex(nums, 0, nums, 0)) + "]";
                        i += match.length;
                        lastObj = 2;
                    } else {
                        throw 'Unexpected character "' + exp.charAt(i) + '".';
                    }
                }
                return str;
            }(str)) + ";"
        // binds namespace for pre-compiled numeric constants from expression
        ).bind(namespace);
    };

    // Create scope of Complex.parseFunction
    Complex.parseFunction = Complex.parseFunction.bind(function () {
        var formExp = /(?:\d[a-z\{\[\(]|[\}\]\)][a-z\d])|(?:[\{\}\[\]]| *[\+\-\*\/\^ %] *)/gi, // matches commonly used unsupported formatting in human-readable expressions
            funcExp = /[a-z]*\(|(?:-|e\^)(?:\(|)/, // matches either as few as zero continuous a-z followed by ( OR -,e^ optionally followed by (
            varsExp = /[a-z]+(?![a-z]*\()/, // matches continuous a-z NOT followed by (
            operExp = /[\+\-\*\/\^ %]/, // matches +,-,*,/,^, ,%
            numsExp = /(?:(?:\d*\.\d+|\d+\.\d*)|\d+)(?:e(?:[\-+]|)\d+(?!\d*\.)|)/, // matches any positive float
            funcObj = { // maps functions and unary operators to compiled code
                "(": "(",
                "sqrt(": "this.Complex.sqrt(",
                "cbrt(": "this.Complex.cbrt(",
                "exp(": "this.Complex.exp(",
                "e^(": "this.Complex.exp(",
                "e^": "this.Complex.exp(",
                "log(": "this.Complex.log(",
                "ln(": "this.Complex.log(",
                "gamma(": "this.Complex.gamma(",
                "fact(": "this.Complex.fact(",
                "factorial(": "this.Complex.fact(",
                "sin(": "this.Complex.sin(",
                "cos(": "this.Complex.cos(",
                "tan(": "this.Complex.tan(",
                "sec(": "this.Complex.sec(",
                "csc(": "this.Complex.csc(",
                "cot(": "this.Complex.cot(",
                "arcsin(": "this.Complex.arcsin(",
                "arccos(": "this.Complex.arccos(",
                "arctan(": "this.Complex.arctan(",
                "arcsec(": "this.Complex.arcsec(",
                "arccsc(": "this.Complex.arccsc(",
                "arccot(": "this.Complex.arccot(",
                "arsin(": "this.Complex.arcsin(",
                "arcos(": "this.Complex.arccos(",
                "artan(": "this.Complex.arctan(",
                "arsec(": "this.Complex.arcsec(",
                "arcsc(": "this.Complex.arccsc(",
                "arcot(": "this.Complex.arccot(",
                "asin(": "this.Complex.arcsin(",
                "acos(": "this.Complex.arccos(",
                "atan(": "this.Complex.arctan(",
                "asec(": "this.Complex.arcsec(",
                "acsc(": "this.Complex.arccsc(",
                "acot(": "this.Complex.arccot(",
                "sinh(": "this.Complex.sinh(",
                "cosh(": "this.Complex.cosh(",
                "tanh(": "this.Complex.tanh(",
                "sech(": "this.Complex.sech(",
                "csch(": "this.Complex.csch(",
                "coth(": "this.Complex.coth(",
                "arcsinh(": "this.Complex.arcsinh(",
                "arccosh(": "this.Complex.arccosh(",
                "arctanh(": "this.Complex.arctanh(",
                "arcsech(": "this.Complex.arcsech(",
                "arccsch(": "this.Complex.arccsch(",
                "arccoth(": "this.Complex.arccoth(",
                "arsinh(": "this.Complex.arcsinh(",
                "arcosh(": "this.Complex.arccosh(",
                "artanh(": "this.Complex.arctanh(",
                "arsech(": "this.Complex.arcsech(",
                "arcsch(": "this.Complex.arccsch(",
                "arcoth(": "this.Complex.arccoth(",
                "asinh(": "this.Complex.arcsinh(",
                "acosh(": "this.Complex.arccosh(",
                "atanh(": "this.Complex.arctanh(",
                "asech(": "this.Complex.arcsech(",
                "acsch(": "this.Complex.arccsch(",
                "acoth(": "this.Complex.arccoth(",
                "-": "this.Complex.neg(",
                "-(": "this.Complex.neg(",
                "re(": "this.Complex.re(",
                "real(": "this.Complex.re(",
                "im(": "this.Complex.im(",
                "imag(": "this.Complex.im(",
                "abs(": "this.Complex.abs(",
                "mag(": "this.Complex.abs(",
                "arg(": "this.Complex.arg(",
                "conj(": "this.Complex.conj(",
                "norm(": "this.Complex.norm(",
                "normal(": "this.Complex.norm(",
                "floor(": "this.Complex.floor(",
                "ceil(": "this.Complex.ceil(",
                "ceiling(": "this.Complex.ceil(",
                "round(": "this.Complex.round(",
                "fpart(": "this.Complex.fPart(",
                "frac(": "this.Complex.fPart(",
                "ipart(": "this.Complex.iPart(",
                "int(": "this.Complex.iPart("
            },
            operObj = { // maps binary operators to compiled code
                "+": ".add(",
                "-": ".sub(",
                "*": ".mult(",
                " ": ".mult(",
                "/": ".divBy(",
                "%": ".mod(",
                "^": ".cPow("
            },
            varsObj = { // maps default variables to compiled code
                "e": "this.Complex.E",
                "i": "this.Complex.I",
                "pi": "this.Complex.PI"
            },
            formatFunction = function (str) { // optionally called before compilation in order to repair unsupported formatting
                var open = /\{|\[/,
                    close = /\}|\]/,
                    // catches implied multiplication like "3i" or ")x"
                    // does NOT edit format "x(" where x is a-z
                    // because that form implies a function, not a multiplication
                    mult = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]/i,
                    expo = /^\de(?:[\-+]|)\d+(?!\d*\.)/i,
                    trim = /[\+\-\*\/\^%]/;
                return str.replace(formExp, function parse(match, offset) {
                    if (mult.test(match)) {
                        // catches exponentially represented floats and omits formatting these
                        if (expo.test(str.slice(offset))) {
                            return match;
                        }
                        // recursively calls parser in case of {,[,},]
                        return match.charAt(0).replace(formExp, parse) + "*" + match.charAt(1).replace(formExp, parse);
                    }
                    if (open.test(match)) {
                        return "(";
                    }
                    if (close.test(match)) {
                        return ")";
                    }
                    var i = match.search(trim);
                    return match.charAt(i !== -1 ? i : "*");
                });
            },
            generate = function (args) { // maps the arguments to arbitrarily generated names
                var rmChars = /[^a-z]+/i; // characters to be removed from variable names supplied
                // fix and validate them first
                args = args.map(function (arg) {
                    var name = arg.replace(rmChars, "");
                    if (!name) {
                        throw '"' + arg + '" is an invalid variable name. Only "a" through "z" are accepted within names. "e", "i" and "pi", will be calculated as the constants.';
                    }
                    return name.toLowerCase();
                });
                var abc = "abcdefghijklmnopqrstuvwxyz", // used to generate compiled variable names
                    mod = abc.length,
                    map = {},
                    str = "",
                    i,
                    j,
                    k;
                for (i = 0; i < args.length; i++) {
                    j = i;
                    while (j >= 0) {
                        k = j % mod; // "digit" index
                        j = j - k;
                        str = abc.charAt(k) + str;
                        j = j / mod - 1; // leftover
                    }
                    map[args[i]] = str;
                    str = "";
                }
                return map;
            },
            endNest = function (str, i) { // returns last index of grouped expression located at i
                var nest = 1;
                while (str[i] === "(" ? nest++ : (str[i] === ")" ? --nest : i < str.length)) {
                    i++;
                }
                return i;
            },
            nextAddSub = function (str, i) { // returns last index of expression to add or subtract located at i based on order of operations
                var nest = 0,
                    c;
                for (c = i; c < str.length; c++) {
                    if (str[c] === "(") {
                        nest++;
                    } else if (str[c] === ")") {
                        nest--;
                    }
                    if (nest < 0) {
                        return c;
                    }
                    if (nest === 0) {
                        if (str[c] === "+" || (str[c] === "-" && !operObj[str[c - 1]])) {
                            return c;
                        }
                    }
                }
                return str.length;
            },
            nextMultDiv = function (str, i) { // returns last index of expression to multiply or divide located at i based on order of operations
                var nest = 0,
                    c;
                for (c = i; c < str.length; c++) {
                    if (str[c] === "(") {
                        nest++;
                    } else if (str[c] === ")") {
                        nest--;
                    }
                    if (nest < 0) {
                        return c;
                    }
                    if (nest === 0) {
                        if (str[c] === "+" || (str[c] === "-" && !operObj[str[c - 1]])) {
                            return c;
                        }
                        if (str[c] === "*" || str[c] === "/" || str[c] === " " || str[c] === "%") {
                            return c;
                        }
                    }
                }
                return str.length;
            },
            nextOperator = function (oper, str, i) { // switches operator to determine which order of operations to apply
                switch (oper) {
                case "+":
                case "-":
                    return nextAddSub(str, i);
                case "*":
                case " ":
                case "/":
                case "%":
                case "^":
                    return nextMultDiv(str, i);
                default:
                    throw '"' + oper + '" is not a valid operator.';
                }
            },
            Namespace = function () { // instances of this will be bound to each compiled function returned to cache parsed numerical constants
                var self = this;
                self.array = [];
                self.Complex = Complex;
                self.addComplex = function (complex) {
                    self.array.push(complex);
                    return self.array.length - 1; // returns index of cached constant to compiler
                };
            };
        Complex.formatFunction = formatFunction; // may need to be called separately for asynchronous user-confirmation
        return { // the actual object being bound to the context of Complex.parseFunction
            funcExp: funcExp,
            varsExp: varsExp,
            operExp: operExp,
            numsExp: numsExp,
            funcObj: funcObj,
            varsObj: varsObj,
            operObj: operObj,
            generate: generate,
            formatFunction: formatFunction,
            endNest: endNest,
            nextAddSub: nextAddSub,
            nextMultDiv: nextMultDiv,
            nextOperator: nextOperator,
            Namespace: Namespace
        };
    }());

    // Constants
    Complex["0"] = new Complex(0, 0, 0, 0);
    Complex["1"] = new Complex(1, 0, 1, 0);
    Complex.I = new Complex(0, 1, 1, PI / 2);
    Complex["-I"] = new Complex(0, -1, 1, 3 * PI / 2);
    Complex.PI = new Complex(PI, 0, PI, 0);
    Complex.E = new Complex(Math.E, 0, Math.E, 0);
    Complex["2"] = new Complex(2, 0, 2, 0);
    Complex["2I"] = new Complex(0, 2, 2, PI / 2);

    // Expose the Complex class
    if (typeof module !== "undefined" && module.exports) {
        // Node.js
        module.exports = Complex;
    } else {
        // Browser
        root.Complex = Complex;
    }

}());
