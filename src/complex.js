/* Copyright (c) 2017 Patrick Roberts */

'use strict';

const parser = require('../parser');
const utils = require('./utils');

const Complex = module.exports = function Complex(real = 0, imag = 0, abs = utils.hypot(real, imag), arg = Math.atan2(imag, real)) {
  if (!(this instanceof Complex)) {
    return new Complex(real, imag, abs, arg);
  }

  this.real = real;
  this.imag = imag;
  this.abs  = abs >= 0 ? abs : -abs;
  this.arg  = arg !== 0 ? -((-arg + (abs >= 0 ? Math.PI : 0)) % (Math.PI * 2) - Math.PI) : abs < 0 ? Math.PI : 0;
};

const Cartesian = require('./cartesian');
const Polar = require('./polar');
const Long = require('./long');

Object.defineProperties(Complex, {
  // polymorphic static calls to inherited member methods
  isFinite: utils.nonEnumerable(function isFinite(complex) {
    return complex.isFinite();
  }),
  isNaN: utils.nonEnumerable(function isNaN(complex) {
    return complex.isNaN();
  }),
  isReal: utils.nonEnumerable(function isReal(complex) {
    return complex.isReal();
  }),
  isImag: utils.nonEnumerable(function isImag(complex) {
    return complex.isImag();
  }),
  negate: utils.nonEnumerable(function negate(complex) {
    return complex.negate();
  }),
  conjugate: utils.nonEnumerable(function conjugate(complex) {
    return complex.conjugate();
  }),
  normalize: utils.nonEnumerable(function normalize(complex) {
    return complex.normalize();
  }),
  square: utils.nonEnumerable(function square(complex) {
    return complex.square();
  }),
  cube: utils.nonEnumerable(function cube(complex) {
    return complex.cube();
  }),
  // static methods
  sign: utils.nonEnumerable(function sign(complex) {
    return new Cartesian(utils.sign(complex.real), utils.sign(complex.imag));
  }),
  floor: utils.nonEnumerable(function floor(complex) {
    return new Cartesian(utils.floor(complex.real), utils.floor(complex.imag));
  }),
  ceil: utils.nonEnumerable(function ceil(complex) {
    return new Cartesian(utils.ceil(complex.real), utils.ceil(complex.imag));
  }),
  round: utils.nonEnumerable(function round(complex) {
    return new Cartesian(utils.round(complex.real), utils.round(complex.imag));
  }),
  truncate: utils.nonEnumerable(function truncate(complex) {
    return new Cartesian(utils.truncate(complex.real), utils.truncate(complex.imag));
  }),
  fraction: utils.nonEnumerable(function fraction(complex) {
    return new Cartesian(complex.real % 1, complex.imag % 1);
  }),
  sqrt: utils.nonEnumerable(function sqrt(complex) {
    return new Polar(
      Math.sqrt(complex.abs),
      complex.arg * 0.5
    );
  }),
  cbrt: utils.nonEnumerable(function cbrt(complex) {
    return new Polar(
      Math.pow(complex.abs, 1 / 3),
      complex.arg / 3
    );
  }),
  exp: utils.nonEnumerable(function exp(complex) {
    return new Polar(
      Math.exp(complex.real),
      complex.imag
    );
  }),
  log: utils.nonEnumerable(function log(complex) {
    return new Cartesian(
      Math.log(complex.abs),
      complex.arg
    );
  }),
  cos: utils.nonEnumerable(function cos(complex) {
    return new Cartesian(
      Math.cos(complex.real) * utils.cosh(complex.imag),
      -Math.sin(complex.real) * utils.sinh(complex.imag)
    );
  }),
  sin: utils.nonEnumerable(function sin(complex) {
    return new Cartesian(
      Math.sin(complex.real) * utils.cosh(complex.imag),
      Math.cos(complex.real) * utils.sinh(complex.imag)
    );
  }),
  tan: utils.nonEnumerable(function tan(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cos(real2) + utils.cosh(imag2);

    return new Cartesian(
      Math.sin(real2) / denom,
      utils.sinh(imag2) / denom
    );
  }),
  sec: utils.nonEnumerable(function sec(complex) {
    const denom = Math.cos(complex.real * 2) + utils.cosh(complex.imag * 2);

    return new Cartesian(
      Math.cos(complex.real) * utils.cosh(complex.imag) * 2 / denom,
      Math.sin(complex.real) * utils.sinh(complex.real) * 2 / denom
    );
  }),
  csc: utils.nonEnumerable(function csc(complex) {
    const denom = Math.cos(complex.real * 2) - utils.cosh(complex.imag * 2);

    return new Cartesian(
      -Math.sin(complex.real) * utils.cosh(complex.imag) * 2 / denom,
      Math.cos(complex.real) * utils.sinh(complex.imag) * 2 / denom
    );
  }),
  cot: utils.nonEnumerable(function cot(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cos(real2) - utils.cosh(imag2);

    return new Cartesian(
      -Math.sin(real2) / denom,
      utils.sinh(imag2) / denom
    );
  }),
  cosh: utils.nonEnumerable(function cosh(complex) {
    return new Cartesian(
      utils.cosh(complex.real) * Math.cos(complex.imag),
      utils.sinh(complex.real) * Math.sin(complex.imag)
    );
  }),
  sinh: utils.nonEnumerable(function sinh(complex) {
    return new Cartesian(
      utils.sinh(complex.real) * Math.cos(complex.imag),
      utils.cosh(complex.real) * Math.sin(complex.imag)
    );
  }),
  tanh: utils.nonEnumerable(function tanh(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = utils.cosh(real2) + Math.cos(imag2);

    return new Cartesian(
      utils.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }),
  sech: utils.nonEnumerable(function sech(complex) {
    const denom = utils.cosh(complex.real * 2) + Math.cos(complex.imag * 2);

    return new Cartesian(
      utils.cosh(complex.real) * Math.cos(complex.imag) * 2 / denom,
      -utils.sinh(complex.real) * Math.sin(complex.real) * 2 / denom
    );
  }),
  csch: utils.nonEnumerable(function csch(complex) {
    const denom = Math.cos(complex.imag * 2) - utils.cosh(complex.real * 2);

    return new Cartesian(
      -utils.sinh(complex.real) * Math.cos(complex.imag) * 2 / denom,
      utils.cosh(complex.real) * Math.sin(complex.imag) * 2 / denom
    );
  }),
  coth: utils.nonEnumerable(function coth(complex) {
    const real2 = complex.real * 2;
    const imag2 = complex.imag * 2;
    const denom = Math.cos(imag2) - utils.cosh(real2);

    return new Cartesian(
      -utils.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }),
  acos: utils.nonEnumerable(function acos(complex) {
    // -i log(z+sqrt(z^2-1))
    return complex.square().sub(Complex.ONE).sqrt().add(complex).log().mul(Complex.NEG_I);
  }),
  asin: utils.nonEnumerable(function asin(complex) {
    // -i log(iz+sqrt(1-z^2))
    return Complex.ONE.sub(complex.square()).sqrt().add(complex.mul(Complex.I)).log().mul(Complex.NEG_I);
  }),
  atan: utils.nonEnumerable(function atan(complex) {
    const iz = Cartesian.I.mul(complex);
    // i/2 (log(1-iz)-log(1+iz))
    return Complex.ONE.sub(iz).log().sub(iz.add(Complex.ONE).log()).div(Complex.TWO_I);
  }),
  asec: utils.nonEnumerable(function asec(complex) {
    return Cartesian.ONE.div(complex).acos();
  }),
  acsc: utils.nonEnumerable(function acsc(complex) {
    return Cartesian.ONE.div(complex).asin();
  }),
  acot: utils.nonEnumerable(function acot(complex) {
    const idz = Cartesian.I.div(complex);
    // i/2 (log(1-i/z)-log(1+i/z))
    return Complex.ONE.sub(idz).log().sub(idz.add(Complex.ONE).log()).div(Complex.TWO_I);
  }),
  acosh: utils.nonEnumerable(function acosh(complex) {
    // log(z+sqrt(z^2-1))
    return complex.square().sub(Complex.ONE).sqrt().add(complex).log();
  }),
  asinh: utils.nonEnumerable(function asinh(complex) {
    // log(z+sqrt(z^2+1))
    return complex.square().add(Complex.ONE).sqrt().add(complex).log();
  }),
  atanh: utils.nonEnumerable(function atanh(complex) {
    // log((1+z)/(1-z))/2
    return complex.add(Complex.ONE).div(Complex.ONE.sub(complex)).log().div(Complex.TWO);
  }),
  asech: utils.nonEnumerable(function asech(complex) {
    return Cartesian.ONE.div(complex).acosh();
  }),
  acsch: utils.nonEnumerable(function acsch(complex) {
    return Cartesian.ONE.div(complex).asinh();
  }),
  acoth: utils.nonEnumerable(function acoth(complex) {
    // log((z+1)/(z-1))/2
    return complex.add(Complex.ONE).div(complex.sub(Complex.ONE)).log().div(Complex.TWO);
  }),
  min: utils.nonEnumerable(function min() {
    var minimum = new Complex(Infinity, 0, Infinity, 0);

    for (var index = 0; index < arguments.length; index++) {
      if (arguments[index].abs < minimum.abs) {
        minimum = arguments[index];
      }
    }

    return minimum;
  }),
  max: utils.nonEnumerable(function max() {
    var maximum = Complex.ZERO;

    for (var index = 0; index < arguments.length; index++) {
      if (arguments[index].abs > maximum.abs) {
        maximum = arguments[index];
      }
    }

    return maximum;
  }),
  compile: utils.nonEnumerable(function compile(string, parameters = []) {
    const cached = [];
    const result = parser.parse(string, {parameters, cached});

    parameters.unshift('Complex');

    return new Function(parameters.join(), 'return ' + result).bind(cached, Complex);
  }),
});

const equDescriptor = utils.nonEnumerable(function equals(that, maxUlps = 4) {
  return (
    Long.withinMaxUlps(this.real, that.real, maxUlps) && Long.withinMaxUlps(this.imag, that.imag, maxUlps) ||
    Long.withinMaxUlps(this.abs, that.abs, maxUlps) && Long.withinMaxUlps(this.arg, that.arg, maxUlps)
  );
});
const addDescriptor = utils.nonEnumerable(function add(that) {
  return new Cartesian(this.real + that.real, this.imag + that.imag);
});
const subDescriptor = utils.nonEnumerable(function subtract(that) {
  return new Cartesian(this.real - that.real, this.imag - that.imag);
});
const mulDescriptor = utils.nonEnumerable(function multiply(that) {
  return new Complex(
    this.real * that.real - this.imag * that.imag,
    this.imag * that.real + this.real * that.imag,
    this.abs * that.abs, this.arg + that.arg
  );
});
const divDescriptor = utils.nonEnumerable(function divide(that) {
  const denom = that.real * that.real + that.imag * that.imag;

  return new Complex(
    (this.real * that.real + this.imag * that.imag) / denom,
    (this.imag * that.real - this.real * that.imag) / denom,
    this.abs / that.abs, this.arg - that.arg
  );
});
const modDescriptor = utils.nonEnumerable(function modulo(that) {
  return new Cartesian(this.real % that.real, this.imag % that.imag);
});
const powDescriptor = utils.nonEnumerable(function power(that) {
  return new Polar(
    Math.pow(this.abs, that.real) * Math.exp(-that.imag * this.arg),
    that.imag * Math.log(this.abs) + that.real * this.arg
  );
});

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

Object.defineProperties(Complex.prototype, {
  // member methods
  toString: utils.nonEnumerable(function toString(polar) {
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

        string += this.imag === 1 ? 'i' : this.imag === -1 ? '-i' : imag + 'i';
      }
    } else {
      const abs = this.abs.toPrecision();
      const arg = this.arg.toPrecision();

      string = abs;

      if (this.abs !== 0 && this.arg !== 0) {
        string += `*e^(${arg}i)`;
      }
    }

    return string;
  }),
  equals:   equDescriptor,
  equ:      equDescriptor,
  '=':      equDescriptor,
  add:      addDescriptor,
  plus:     addDescriptor,
  '+':      addDescriptor,
  subtract: subDescriptor,
  minus:    subDescriptor,
  sub:      subDescriptor,
  '-':      subDescriptor,
  multiply: mulDescriptor,
  times:    mulDescriptor,
  mul:      mulDescriptor,
  '*':      mulDescriptor,
  divide:   divDescriptor,
  div:      divDescriptor,
  '/':      divDescriptor,
  modulo:   modDescriptor,
  mod:      modDescriptor,
  '%':      modDescriptor,
  power:    powDescriptor,
  pow:      powDescriptor,
  '^':      powDescriptor,
  '**':     powDescriptor,
  // member methods for static functions
  isFinite: utils.nonEnumerable(function isFinite() {
    return utils.isFinite(this.abs);
  }),
  isNaN: utils.nonEnumerable(function isNaN() {
    return utils.isNaN(this.abs) || utils.isNaN(this.arg);
  }),
  isReal: utils.nonEnumerable(function isReal() {
    return (
      this.imag <= utils.EPSILON && -this.imag <= utils.EPSILON ||
      this.arg <= utils.EPSILON && -this.arg <= utils.EPSILON ||
      Long.withinMaxUlps(this.arg, Math.PI)
    );
  }),
  isImag: utils.nonEnumerable(function isImag() {
    return (
      this.real <= utils.EPSILON && -this.real <= utils.EPSILON ||
      Long.withinMaxUlps(this.arg < 0 ? -this.arg : this.arg, Math.PI / 2)
    );
  }),
  negate: utils.nonEnumerable(function negate() {
    return new Complex(-this.real, -this.imag, -this.abs, this.arg);
  }),
  conjugate: utils.nonEnumerable(function conjugate() {
    return new Complex(this.real, -this.imag, this.abs, -this.arg);
  }),
  normalize: utils.nonEnumerable(function normalize() {
    return new Complex(
      this.real / this.abs,
      this.imag / this.abs,
      this.abs / this.abs,
      this.arg
    );
  }),
  square: utils.nonEnumerable(function square() {
    return new Complex(
      this.real * this.real - this.imag * this.imag,
      this.real * this.imag * 2,
      this.abs * this.abs,
      this.arg * 2
    );
  }),
  cube: utils.nonEnumerable(function cube() {
    return new Complex(
      this.real * (this.real * this.real - this.imag * this.imag * 3),
      this.imag * (this.real * this.real * 3 - this.imag * this.imag),
      this.abs * this.abs * this.abs, this.arg * 3
    );
  }),
  sign: utils.nonEnumerable(function sign() {
    return new Cartesian(utils.sign(this.real), utils.sign(this.imag));
  }),
  floor: utils.nonEnumerable(function floor() {
    return new Cartesian(utils.floor(this.real), utils.floor(this.imag));
  }),
  ceil: utils.nonEnumerable(function ceil() {
    return new Cartesian(utils.ceil(this.real), utils.ceil(this.imag));
  }),
  round: utils.nonEnumerable(function round() {
    return new Cartesian(utils.round(this.real), utils.round(this.imag));
  }),
  truncate: utils.nonEnumerable(function truncate() {
    return new Cartesian(utils.truncate(this.real), utils.truncate(this.imag));
  }),
  fraction: utils.nonEnumerable(function fraction() {
    return new Cartesian(this.real % 1, this.imag % 1);
  }),
  sqrt: utils.nonEnumerable(function sqrt() {
    return new Polar(
      Math.sqrt(this.abs),
      this.arg * 0.5
    );
  }),
  cbrt: utils.nonEnumerable(function cbrt() {
    return new Polar(
      Math.pow(this.abs, 1 / 3),
      this.arg / 3
    );
  }),
  exp: utils.nonEnumerable(function exp() {
    return new Polar(
      Math.exp(this.real),
      this.imag
    );
  }),
  log: utils.nonEnumerable(function log() {
    return new Cartesian(
      Math.log(this.abs),
      this.arg
    );
  }),
  cos: utils.nonEnumerable(function cos() {
    return new Cartesian(
      Math.cos(this.real) * utils.cosh(this.imag),
      -Math.sin(this.real) * utils.sinh(this.imag)
    );
  }),
  sin: utils.nonEnumerable(function sin() {
    return new Cartesian(
      Math.sin(this.real) * utils.cosh(this.imag),
      Math.cos(this.real) * utils.sinh(this.imag)
    );
  }),
  tan: utils.nonEnumerable(function tan() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cos(real2) + utils.cosh(imag2);

    return new Cartesian(
      Math.sin(real2) / denom,
      utils.sinh(imag2) / denom
    );
  }),
  sec: utils.nonEnumerable(function sec() {
    const denom = Math.cos(this.real * 2) + utils.cosh(this.imag * 2);

    return new Cartesian(
      Math.cos(this.real) * utils.cosh(this.imag) * 2 / denom,
      Math.sin(this.real) * utils.sinh(this.real) * 2 / denom
    );
  }),
  csc: utils.nonEnumerable(function csc() {
    const denom = Math.cos(this.real * 2) - utils.cosh(this.imag * 2);

    return new Cartesian(
      -Math.sin(this.real) * utils.cosh(this.imag) * 2 / denom,
      Math.cos(this.real) * utils.sinh(this.imag) * 2 / denom
    );
  }),
  cot: utils.nonEnumerable(function cot() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cos(real2) - utils.cosh(imag2);

    return new Cartesian(
      -Math.sin(real2) / denom,
      utils.sinh(imag2) / denom
    );
  }),
  cosh: utils.nonEnumerable(function cosh() {
    return new Cartesian(
      utils.cosh(this.real) * Math.cos(this.imag),
      utils.sinh(this.real) * Math.sin(this.imag)
    );
  }),
  sinh: utils.nonEnumerable(function sinh() {
    return new Cartesian(
      utils.sinh(this.real) * Math.cos(this.imag),
      utils.cosh(this.real) * Math.sin(this.imag)
    );
  }),
  tanh: utils.nonEnumerable(function tanh() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = utils.cosh(real2) + Math.cos(imag2);

    return new Cartesian(
      utils.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }),
  sech: utils.nonEnumerable(function sech() {
    const denom = utils.cosh(this.real * 2) + Math.cos(this.imag * 2);

    return new Cartesian(
      utils.cosh(this.real) * Math.cos(this.imag) * 2 / denom,
      -utils.sinh(this.real) * Math.sin(this.real) * 2 / denom
    );
  }),
  csch: utils.nonEnumerable(function csch() {
    const denom = Math.cos(this.imag * 2) - utils.cosh(this.real * 2);

    return new Cartesian(
      -utils.sinh(this.real) * Math.cos(this.imag) * 2 / denom,
      utils.cosh(this.real) * Math.sin(this.imag) * 2 / denom
    );
  }),
  coth: utils.nonEnumerable(function coth() {
    const real2 = this.real * 2;
    const imag2 = this.imag * 2;
    const denom = Math.cos(imag2) - utils.cosh(real2);

    return new Cartesian(
      -utils.sinh(real2) / denom,
      Math.sin(imag2) / denom
    );
  }),
  acos: utils.nonEnumerable(function acos() {
    // -i log(z+sqrt(z^2-1))
    return this.square().sub(Complex.ONE).sqrt().add(this).log().mul(Complex.NEG_I);
  }),
  asin: utils.nonEnumerable(function asin() {
    // -i log(iz+sqrt(1-z^2))
    return Complex.ONE.sub(this.square()).sqrt().add(this.mul(Complex.I)).log().mul(Complex.NEG_I);
  }),
  atan: utils.nonEnumerable(function atan() {
    const iz = this.mul(Complex.I);
    // i/2 (log(1-iz)-log(1+iz))
    return Complex.ONE.sub(iz).log().sub(iz.add(Complex.ONE).log()).div(Complex.TWO_I);
  }),
  asec: utils.nonEnumerable(function asec() {
    return Cartesian.ONE.div(this).acos();
  }),
  acsc: utils.nonEnumerable(function acsc() {
    return Cartesian.ONE.div(this).asin();
  }),
  acot: utils.nonEnumerable(function acot() {
    const idz = Complex.I.div(this);
    // i/2 (log(1-i/z)-log(1+i/z))
    return Complex.ONE.sub(idz).log().sub(idz.add(Complex.ONE).log()).div(Complex.TWO_I);
  }),
  acosh: utils.nonEnumerable(function acosh() {
    // log(z+sqrt(z^2-1))
    return this.square().sub(Complex.ONE).sqrt().add(this).log();
  }),
  asinh: utils.nonEnumerable(function asinh() {
    // log(z+sqrt(z^2+1))
    return this.square().add(Complex.ONE).sqrt().add(this).log();
  }),
  atanh: utils.nonEnumerable(function atanh() {
    // log((1+z)/(1-z))/2
    return this.add(Complex.ONE).div(Complex.ONE.sub(this)).log().div(Complex.TWO);
  }),
  asech: utils.nonEnumerable(function asech() {
    return Cartesian.ONE.div(this).acosh();
  }),
  acsch: utils.nonEnumerable(function acsch() {
    return Cartesian.ONE.div(this).asinh();
  }),
  acoth: utils.nonEnumerable(function acoth() {
    // log((z+1)/(z-1))/2
    return this.add(Complex.ONE).div(this.sub(Complex.ONE)).log().div(Complex.TWO);
  }),
});
