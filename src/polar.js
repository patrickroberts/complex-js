/* Copyright (c) 2017 Patrick Roberts */

'use strict';

const utils = require('./utils');
const Long = require('./long');

const Polar = module.exports = function Polar(abs = 0, arg = 0) {
  if (!(this instanceof Polar)) {
    return new Polar(abs, arg);
  }

  this.abs = abs >= 0 ? abs : -abs;
  this.arg = arg !== 0 ? -((-arg + (abs >= 0 ? Math.PI : 0)) % (Math.PI * 2) - Math.PI) : abs < 0 ? Math.PI : 0;
};

const equDescriptor = utils.nonEnumerable(function equals(that, maxUlps = 4) {
  return (
    Long.withinMaxUlps(this.abs, that.abs, maxUlps) && Long.withinMaxUlps(this.arg, that.arg, maxUlps) ||
    Long.withinMaxUlps(this.real, that.real, maxUlps) && Long.withinMaxUlps(this.imag, that.imag, maxUlps)
  );
});
const mulDescriptor = utils.nonEnumerable(function multiply(that) {
  return new Polar(this.abs * that.abs, this.arg + that.arg);
});
const divDescriptor = utils.nonEnumerable(function divide(that) {
  return new Polar(this.abs / that.abs, this.arg - that.arg);
});

Object.defineProperties(Polar, {
  ZERO:    utils.nonEnumerable(new Polar(0, 0)),
  ONE:     utils.nonEnumerable(new Polar(1, 0)),
  NEG_ONE: utils.nonEnumerable(new Polar(1, Math.PI)),
  I:       utils.nonEnumerable(new Polar(1, Math.PI / 2)),
  NEG_I:   utils.nonEnumerable(new Polar(1, -Math.PI / 2)),
  TWO:     utils.nonEnumerable(new Polar(2, 0)),
  TWO_I:   utils.nonEnumerable(new Polar(2, Math.PI / 2)),
  PI:      utils.nonEnumerable(new Polar(Math.PI, 0)),
  E:       utils.nonEnumerable(new Polar(Math.E, 0)),
});

Polar.prototype = Object.create(require('./complex').prototype, {
  constructor: utils.nonEnumerable(Polar),
  real: {
    configurable: true,
    enumerable: true,
    get() {
      return this.real = this.abs * Math.cos(this.arg);
    },
    set(value) {
      Object.defineProperty(this, 'real', {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });

      return value;
    },
  },
  imag: {
    configurable: true,
    enumerable: true,
    get() {
      return this.imag = this.abs * Math.sin(this.arg);
    },
    set(value) {
      Object.defineProperty(this, 'imag', {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });

      return value;
    },
  },
  equals:   equDescriptor,
  equ:      equDescriptor,
  '=':      equDescriptor,
  multiply: mulDescriptor,
  times:    mulDescriptor,
  mul:      mulDescriptor,
  '*':      mulDescriptor,
  divide:   divDescriptor,
  div:      divDescriptor,
  '/':      divDescriptor,
  isReal: utils.nonEnumerable(function isReal() {
    return (
      this.arg <= utils.EPSILON && -this.arg <= utils.EPSILON ||
      Long.withinMaxUlps(this.arg, Math.PI) ||
      this.imag <= utils.EPSILON && -this.imag <= utils.EPSILON
    );
  }),
  isImag: utils.nonEnumerable(function isImag() {
    return (
      Long.withinMaxUlps(this.arg < 0 ? -this.arg : this.arg, Math.PI / 2) ||
      this.real <= utils.EPSILON && -this.real <= utils.EPSILON
    );
  }),
  negate: utils.nonEnumerable(function negate() {
    return new Polar(-this.abs, this.arg);
  }),
  conjugate: utils.nonEnumerable(function conjugate() {
    return new Polar(this.abs, -this.arg);
  }),
  normalize: utils.nonEnumerable(function normalize() {
    return new Polar(this.abs / this.abs, this.arg);
  }),
  square: utils.nonEnumerable(function square() {
    return new Polar(this.abs * this.abs, this.arg * 2);
  }),
  cube: utils.nonEnumerable(function cube() {
    return new Polar(this.abs * this.abs * this.abs, this.arg * 3);
  }),
});
