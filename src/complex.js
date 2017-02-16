/* Copyright (c) 2017 Patrick Roberts */

'use strict';

const parser = require('../parser');
const utils = require('./utils');

if (Math.sinh === undefined) {
  Math.sinh = function sinh(number = NaN) {
    const exp = Math.exp(number);

    return (exp - 1) / exp / 2;
  };
}

if (Math.cosh === undefined) {
  Math.cosh = function cosh(number = NaN) {
    const exp = Math.exp(number);

    return (exp + 1) / exp / 2;
  };
}

if (Number.EPSILON === undefined) {
  Number.EPSILON = 2.220446049250313e-16;
}

const Complex = module.exports = class Complex {
  // polymorphic static calls to inherited member methods
  static isFinite(complex) {
    return complex.isFinite();
  }

  static isNaN(complex) {
    return complex.isNaN();
  }

  static isReal(complex) {
    return complex.isReal();
  }

  static isImag(complex) {
    return complex.isImag();
  }

  static negate(complex) {
    return complex.negate();
  }

  static conjugate(complex) {
    return complex.conjugate();
  }

  static normalize(complex) {
    return complex.normalize();
  }

  static square(complex) {
    return complex.square();
  }

  static cube(complex) {
    return complex.cube();
  }

  // static methods
  static sign(complex) {
    return new Cartesian(utils.sign(complex.real), utils.sign(complex.imag));
  }

  static floor(complex) {
    return new Cartesian(utils.floor(complex.real), utils.floor(complex.imag));
  }

  static ceil(complex) {
    return new Cartesian(utils.ceil(complex.real), utils.ceil(complex.imag));
  }

  static round(complex) {
    return new Cartesian(utils.round(complex.real), utils.round(complex.imag));
  }

  static truncate(complex) {
    return new Cartesian(utils.truncate(complex.real), utils.truncate(complex.imag));
  }

  static fraction(complex) {
    return new Cartesian(complex.real % 1, complex.imag % 1);
  }

  static sqrt(complex) {
    return new Polar(
      complex.abs ** 0.5,
      complex.arg * 0.5
    );
  }

  static cbrt(complex) {
    return new Polar(
      complex.abs ** (1/3),
      complex.arg / 3
    );
  }

  static exp(complex) {
    return new Polar(
      Math.exp(complex.real),
      complex.imag
    );
  }

  static log(complex) {
    return new Cartesian(
      Math.log(complex.abs),
      complex.arg
    );
  }

  static cos(complex) {
    return new Cartesian(
      Math.cos(complex.real) * Math.cosh(complex.imag),
      -Math.sin(complex.real) * Math.sinh(complex.imag)
    );
  }

  static sin(complex) {
    return new Cartesian(
      Math.sin(complex.real) * Math.cosh(complex.imag),
      Math.cos(complex.real) * Math.sinh(complex.imag)
    );
  }

  static tan(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cos(real2) + Math.cosh(imag2);

    return new Cartesian(
      Math.sin(real2) / denom,
      Math.sinh(imag2) / denom
    );
  }

  static sec(complex) {
    const denom = Math.cos(complex.real * 2) + Math.cosh(complex.imag * 2);

    return new Cartesian(
      Math.cos(complex.real) * Math.cosh(complex.imag) * 2 / denom,
      Math.sin(complex.real) * Math.sinh(complex.real) * 2 / denom
    );
  }

  static csc(complex) {
    const denom = Math.cos(complex.real * 2) - Math.cosh(complex.imag * 2);

    return new Cartesian(
      -Math.sin(complex.real) * Math.cosh(complex.imag) * 2 / denom,
      Math.cos(complex.real) * Math.sinh(complex.imag) * 2 / denom
    );
  }

  static cot(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cos(real2) - Math.cosh(imag2);

    return new Cartesian(
      -Math.sin(real2) / denom,
      Math.sinh(imag2) / denom
    );
  }

  static cosh(complex) {
    return new Cartesian(
      Math.cosh(complex.real) * Math.cos(complex.imag),
      Math.sinh(complex.real) * Math.sin(complex.imag)
    );
  }

  static sinh(complex) {
    return new Cartesian(
      Math.sinh(complex.real) * Math.cos(complex.imag),
      Math.cosh(complex.real) * Math.sin(complex.imag)
    );
  }

  static tanh(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cosh(real2) + Math.cos(imag2);

    return new Cartesian(
      Math.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }

  static sech(complex) {
    const denom = Math.cosh(complex.real * 2) + Math.cos(complex.imag * 2);

    return new Cartesian(
      Math.cosh(complex.real) * Math.cos(complex.imag) * 2 / denom,
      -Math.sinh(complex.real) * Math.sin(complex.real) * 2 / denom
    );
  }

  static csch(complex) {
    const denom = Math.cos(complex.imag * 2) - Math.cosh(complex.real * 2);

    return new Cartesian(
      -Math.sinh(complex.real) * Math.cos(complex.imag) * 2 / denom,
      Math.cosh(complex.real) * Math.sin(complex.imag) * 2 / denom
    );
  }

  static coth(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cos(imag2) - Math.cosh(real2);

    return new Cartesian(
      -Math.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }

  static acos(complex) {
    // -i log(z+sqrt(z^2-1))
    return Complex.NEG_I.multiply(Complex.log(Complex.sqrt(Complex.square(complex).sub(Complex.ONE)).add(complex)));
  }

  static asin(complex) {
    // -i log(iz+sqrt(1-z^2))
    return Complex.NEG_I.multiply(Complex.log(Complex.sqrt(Complex.ONE.sub(Complex.square(complex))).add(complex.multiply(Complex.I))));
  }

  static atan(complex) {
    const iz = Complex.I.multiply(complex);
    // i/2 (log(1-iz)-log(1+iz))
    return iz.negate().add(Complex.ONE).log().sub(iz.add(Complex.ONE).log()).divide(Complex.TWO_I);
  }

  static asec(complex) {
    return Complex.ONE.divide(complex).acos();
  }

  static acsc(complex) {
    return Complex.ONE.divide(complex).asin();
  }

  static acot(complex) {
    const idz = Complex.I.divide(complex);
    // i/2 (log(1-i/z)-log(1+i/z))
    return idz.negate().add(Complex.ONE).log().sub(idz.add(Complex.ONE).log()).divide(Complex.TWO_I);
  }

  static acosh(complex) {
    // log(z+sqrt(z^2-1))
    return complex.square().sub(Complex.ONE).sqrt().add(complex).log();
  }

  static asinh(complex) {
    // log(z+sqrt(z^2+1))
    return complex.square().add(Complex.ONE).sqrt().add(complex).log();
  }

  static atanh(complex) {
    // log((1+z)/(1-z))/2
    return complex.add(Complex.ONE).divide(complex.negate().add(Complex.ONE)).log().divide(Complex.TWO);
  }

  static asech(complex) {
    return Complex.ONE.divide(complex).acosh();
  }

  static acsch(complex) {
    return Complex.ONE.divide(complex).asinh();
  }

  static acoth(complex) {
    // log((z+1)/(z-1))/2
    return complex.add(Complex.ONE).divide(complex.sub(Complex.ONE)).log().divide(Complex.TWO);
  }

  static min() {
    var minimum = new Complex(Infinity, 0, Infinity, 0);

    for (var index = 0; index < arguments.length; index++) {
      if (arguments[index].abs < minimum.abs) {
        minimum = arguments[index];
      }
    }

    return minimum;
  }

  static max() {
    var maximum = Complex.ZERO;

    for (var index = 0; index < arguments.length; index++) {
      if (arguments[index].abs > maximum.abs) {
        maximum = arguments[index];
      }
    }

    return maximum;
  }

  static compile(string, parameters = []) {
    const cached = [];
    const result = parser.parse(string, {parameters, cached});

    parameters.unshift('Complex');

    return new Function(parameters.join(), 'return ' + result).bind(cached, Complex);
  }

  constructor(real = 0, imag = 0, abs = utils.hypot(real, imag), arg = Math.atan2(imag, real)) {
    if (!(this instanceof Complex)) {
      return new Complex(real, imag, abs, arg);
    }

    this.real = real;
    this.imag = imag;
    this.abs  = abs >= 0 ? abs : -abs;
    this.arg  = arg !== 0 ? -((-arg + (abs >= 0 ? Math.PI : 0)) % (Math.PI * 2) - Math.PI) : abs < 0 ? Math.PI : 0;
  }

  // member methods
  toString(polar) {
    let string = '';

    if (!polar) {
      const real = this.real.toPrecision();
      const imag = this.imag.toPrecision();

      if (this.real !== 0 || this.imag === 0) {
        string += real;
      }

      if (this.imag !== 0) {
        if (this.real !== 0 && this.imag > 0) {
          string += '+';
        }

        string += this.imag === 1 ? 'i' : this.imag === -1 ? '-i' : imag + '*i';
      }
    } else {
      const abs = this.abs.toPrecision();
      const arg = this.arg.toPrecision();

      string = abs;

      if (this.abs !== 0 && this.arg !== 0) {
        string += `*e^(${arg}*i)`;
      }
    }

    return string;
  }

  equals(that, maxUlps = 4) {
    return (
      Long.withinMaxUlps(this.real, that.real, maxUlps) && Long.withinMaxUlps(this.imag, that.imag, maxUlps) ||
      Long.withinMaxUlps(this.abs, that.abs, maxUlps) && Long.withinMaxUlps(this.arg, that.arg, maxUlps)
    );
  }

  add(that) {
    return new Cartesian(this.real + that.real, this.imag + that.imag);
  }

  subtract(that) {
    return new Cartesian(this.real - that.real, this.imag - that.imag);
  }

  multiply(that) {
    return new Complex(
      this.real * that.real - this.imag * that.imag,
      this.imag * that.real + this.real * that.imag,
      this.abs * that.abs, this.arg + that.arg
    );
  }

  divide(that) {
    return new Complex(
      this.real / that.real + this.imag / that.imag,
      this.imag / that.real - this.real / that.imag,
      this.abs / that.abs, this.arg - that.arg
    );
  }

  modulo(that) {
    return new Cartesian(this.real % that.real, this.imag % that.imag);
  }

  power(that) {
    return new Polar(
      (this.abs ** that.real) * Math.exp(-that.imag * this.arg),
      that.imag * Math.log(this.abs) + that.real * this.arg
    );
  }

  // member methods for static functions
  isFinite() {
    return utils.isFinite(this.abs);
  }

  isNaN() {
    return utils.isNaN(this.abs) || utils.isNaN(this.arg);
  }

  isReal() {
    return (
      this.imag <= Number.EPSILON && -this.imag <= Number.EPSILON ||
      this.arg <= Number.EPSILON && -this.arg <= Number.EPSILON ||
      Long.withinMaxUlps(this.arg, Math.PI)
    );
  }

  isImag() {
    return (
      this.real <= Number.EPSILON && -this.real <= Number.EPSILON ||
      Long.withinMaxUlps(this.arg < 0 ? -this.arg : this.arg, Math.PI / 2)
    );
  }

  negate() {
    return new Complex(-this.real, -this.imag, -this.abs, this.arg);
  }

  conjugate() {
    return new Complex(this.real, -this.imag, this.abs, -this.arg);
  }

  normalize() {
    return new Complex(
      this.real / this.abs,
      this.imag / this.abs,
      this.abs / this.abs,
      this.arg
    );
  }

  square() {
    return new Complex(
      this.real * this.real - this.imag * this.imag,
      this.real * this.imag * 2,
      this.abs * this.abs,
      this.arg * 2
    );
  }

  cube() {
    return new Complex(
      this.real * (this.real * this.real - this.imag * this.imag * 3),
      this.imag * (this.real * this.real * 3 - this.imag * this.imag),
      this.abs * this.abs * this.abs, this.arg * 3
    );
  }

  sign() {
    return new Cartesian(utils.sign(this.real), utils.sign(this.imag));
  }

  floor() {
    return new Cartesian(utils.floor(this.real), utils.floor(this.imag));
  }

  ceil() {
    return new Cartesian(utils.ceil(this.real), utils.ceil(this.imag));
  }

  round() {
    return new Cartesian(utils.round(this.real), utils.round(this.imag));
  }

  truncate() {
    return new Cartesian(utils.truncate(this.real), utils.truncate(this.imag));
  }

  fraction() {
    return new Cartesian(this.real % 1, this.imag % 1);
  }

  sqrt() {
    return new Polar(
      this.abs ** 0.5,
      this.arg * 0.5
    );
  }

  cbrt() {
    return new Polar(
      this.abs ** (1/3),
      this.arg / 3
    );
  }

  exp() {
    return new Polar(
      Math.exp(this.real),
      this.imag
    );
  }

  log() {
    return new Cartesian(
      Math.log(this.abs),
      this.arg
    );
  }

  cos() {
    return new Cartesian(
      Math.cos(this.real) * Math.cosh(this.imag),
      -Math.sin(this.real) * Math.sinh(this.imag)
    );
  }

  sin() {
    return new Cartesian(
      Math.sin(this.real) * Math.cosh(this.imag),
      Math.cos(this.real) * Math.sinh(this.imag)
    );
  }

  tan() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cos(real2) + Math.cosh(imag2);

    return new Cartesian(
      Math.sin(real2) / denom,
      Math.sinh(imag2) / denom
    );
  }

  sec() {
    const denom = Math.cos(this.real * 2) + Math.cosh(this.imag * 2);

    return new Cartesian(
      Math.cos(this.real) * Math.cosh(this.imag) * 2 / denom,
      Math.sin(this.real) * Math.sinh(this.real) * 2 / denom
    );
  }

  csc() {
    const denom = Math.cos(this.real * 2) - Math.cosh(this.imag * 2);

    return new Cartesian(
      -Math.sin(this.real) * Math.cosh(this.imag) * 2 / denom,
      Math.cos(this.real) * Math.sinh(this.imag) * 2 / denom
    );
  }

  cot() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cos(real2) - Math.cosh(imag2);

    return new Cartesian(
      -Math.sin(real2) / denom,
      Math.sinh(imag2) / denom
    );
  }

  cosh() {
    return new Cartesian(
      Math.cosh(this.real) * Math.cos(this.imag),
      Math.sinh(this.real) * Math.sin(this.imag)
    );
  }

  sinh() {
    return new Cartesian(
      Math.sinh(this.real) * Math.cos(this.imag),
      Math.cosh(this.real) * Math.sin(this.imag)
    );
  }

  tanh() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cosh(real2) + Math.cos(imag2);

    return new Cartesian(
      Math.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }

  sech() {
    const denom = Math.cosh(this.real * 2) + Math.cos(this.imag * 2);

    return new Cartesian(
      Math.cosh(this.real) * Math.cos(this.imag) * 2 / denom,
      -Math.sinh(this.real) * Math.sin(this.real) * 2 / denom
    );
  }

  csch() {
    const denom = Math.cos(this.imag * 2) - Math.cosh(this.real * 2);

    return new Cartesian(
      -Math.sinh(this.real) * Math.cos(this.imag) * 2 / denom,
      Math.cosh(this.real) * Math.sin(this.imag) * 2 / denom
    );
  }

  coth() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cos(imag2) - Math.cosh(real2);

    return new Cartesian(
      -Math.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }

  acos() {
    // -i log(z+sqrt(z^2-1))
    return this.square().sub(Complex.ONE).sqrt().add(this).log().multiply(Complex.NEG_I);
  }

  asin() {
    // -i log(iz+sqrt(1-z^2))
    return Complex.ONE.sub(this.square()).sqrt().add(this.multiply(Complex.I)).log().multiply(Complex.NEG_I);
  }

  atan() {
    const iz = this.multiply(Complex.I);
    // i/2 (log(1-iz)-log(1+iz))
    return iz.negate().add(Complex.ONE).log().sub(iz.add(Complex.ONE).log()).divide(Complex.TWO_I);
  }

  asec() {
    return Complex.ONE.divide(this).acos();
  }

  acsc() {
    return Complex.ONE.divide(this).asin();
  }

  acot() {
    const idz = Complex.I.divide(this);
    // i/2 (log(1-i/z)-log(1+i/z))
    return idz.negate().add(Complex.ONE).log().sub(idz.add(Complex.ONE).log()).divide(Complex.TWO_I);
  }

  acosh() {
    // log(z+sqrt(z^2-1))
    return this.square().sub(Complex.ONE).sqrt().add(this).log();
  }

  asinh() {
    // log(z+sqrt(z^2+1))
    return this.square().add(Complex.ONE).sqrt().add(this).log();
  }

  atanh() {
    // log((1+z)/(1-z))/2
    return this.add(Complex.ONE).divide(this.negate().add(Complex.ONE)).log().divide(Complex.TWO);
  }

  asech() {
    return Complex.ONE.divide(this).acosh();
  }

  acsch() {
    return Complex.ONE.divide(this).asinh();
  }

  acoth() {
    // log((z+1)/(z-1))/2
    return this.add(Complex.ONE).divide(this.sub(Complex.ONE)).log().divide(Complex.TWO);
  }
}

const Cartesian = require('./cartesian');
const Polar = require('./polar');
const Long = require('./long');

Object.defineProperties(Complex, {
  Cartesian: utils.nonEnumerable(Cartesian),
  Polar:     utils.nonEnumerable(Polar),
  ZERO:      utils.nonEnumerable(new Complex(0, 0, 0, 0)),
  ONE:       utils.nonEnumerable(new Complex(1, 0, 1, 0)),
  NEG_ONE:   utils.nonEnumerable(new Complex(-1, 0, 1, Math.PI)),
  I:         utils.nonEnumerable(new Complex(0, 1, 1, Math.PI / 2)),
  NEG_I:     utils.nonEnumerable(new Complex(0, -1, 1, -Math.PI / 2)),
  TWO:       utils.nonEnumerable(new Complex(2, 0, 2, 0)),
  TWO_I:     utils.nonEnumerable(new Complex(0, 2, 2, Math.PI / 2)),
  PI:        utils.nonEnumerable(new Complex(Math.PI, 0, Math.PI, 0)),
  E:         utils.nonEnumerable(new Complex(Math.E, 0, Math.E, 0)),
});

const equDescriptor = utils.nonEnumerable(Complex.prototype.equals);
const addDescriptor = utils.nonEnumerable(Complex.prototype.add);
const subDescriptor = utils.nonEnumerable(Complex.prototype.subtract);
const mulDescriptor = utils.nonEnumerable(Complex.prototype.multiply);
const divDescriptor = utils.nonEnumerable(Complex.prototype.divide);
const modDescriptor = utils.nonEnumerable(Complex.prototype.modulo);
const powDescriptor = utils.nonEnumerable(Complex.prototype.power);

Object.defineProperties(Complex.prototype, {
  equ:   equDescriptor,
  '=':   equDescriptor,
  plus:  addDescriptor,
  '+':   addDescriptor,
  minus: subDescriptor,
  sub:   subDescriptor,
  '-':   subDescriptor,
  times: mulDescriptor,
  mul:   mulDescriptor,
  '*':   mulDescriptor,
  div:   divDescriptor,
  '/':   divDescriptor,
  mod:   modDescriptor,
  '%':   modDescriptor,
  pow:   powDescriptor,
  '^':   powDescriptor,
  '**':  powDescriptor,
});
