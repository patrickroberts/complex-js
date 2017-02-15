/* Copyright (c) 2017 Patrick Roberts */

'use strict';

const nonEnumerable = require('./utils').nonEnumerable;
const Long = require('./long');

const Polar = module.exports = function Polar(abs = 0, arg = 0) {
  if (!(this instanceof Polar)) {
    return new Polar(abs, arg);
  }

  this.abs = abs >= 0 ? abs : -abs;
  this.arg = arg !== 0 ? -((-arg + (abs >= 0 ? Math.PI : 0)) % (Math.PI * 2) - Math.PI) : abs < 0 ? Math.PI : 0;
};

const equDescriptor = nonEnumerable(function equals(that, maxUlps = 4) {
  return (
    Long.withinMaxUlps(this.abs, that.abs, maxUlps) && Long.withinMaxUlps(this.arg, that.arg, maxUlps) ||
    Long.withinMaxUlps(this.real, that.real, maxUlps) && Long.withinMaxUlps(this.imag, that.imag, maxUlps)
  );
});
const mulDescriptor = nonEnumerable(function multiply(that) {
  return new Polar(this.abs * that.abs, this.arg + that.arg);
});
const divDescriptor = nonEnumerable(function divide(that) {
  return new Polar(this.abs / that.abs, this.arg - that.arg);
});

Polar.prototype = Object.create(require('./complex').prototype, {
  constructor: nonEnumerable(Polar),
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
  isReal: nonEnumerable(function isReal() {
    return (
      this.arg <= Number.EPSILON && -this.arg <= Number.EPSILON ||
      Long.withinMaxUlps(this.arg, Math.PI) ||
      this.imag <= Number.EPSILON && -this.imag <= Number.EPSILON
    );
  }),
  isImag: nonEnumerable(function isImag() {
    return (
      Long.withinMaxUlps(this.arg < 0 ? -this.arg : this.arg, Math.PI / 2) ||
      this.real <= Number.EPSILON && -this.real <= Number.EPSILON
    );
  }),
  negate: nonEnumerable(function negate() {
    return new Polar(-this.abs, this.arg);
  }),
  conjugate: nonEnumerable(function conjugate() {
    return new Polar(this.abs, -this.arg);
  }),
  normalize: nonEnumerable(function normalize() {
    return new Polar(this.abs / this.abs, this.arg);
  }),
  square: nonEnumerable(function square() {
    return new Polar(this.abs * this.abs, this.arg * 2);
  }),
  cube: nonEnumerable(function cube() {
    return new Polar(this.abs * this.abs * this.abs, this.arg * 3);
  }),
});
