/* Copyright (c) 2017 Patrick Roberts */

'use strict';

const utils = require('./utils');

const Cartesian = module.exports = function Cartesian(real = 0, imag = 0) {
  if (!(this instanceof Cartesian)) {
    return new Cartesian(real, imag);
  }

  this.real = real;
  this.imag = imag;
};

const mulDescriptor = utils.nonEnumerable(function multiply(that) {
  return new Cartesian(
    this.real * that.real - this.imag * that.imag,
    this.imag * that.real + this.real * that.imag
  );
});
const divDescriptor = utils.nonEnumerable(function divide(that) {
  const denom = that.real * that.real + that.imag * that.imag;

  return new Cartesian(
    (this.real * that.real + this.imag * that.imag) / denom,
    (this.imag * that.real - this.real * that.imag) / denom
  );
});

Cartesian.prototype = Object.create(require('./complex').prototype, {
  constructor: utils.nonEnumerable(Cartesian),
  abs: {
    configurable: true,
    enumerable: true,
    get() {
      return this.abs = utils.hypot(this.real, this.imag);
    },
    set(value) {
      Object.defineProperty(this, 'abs', {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });

      return value;
    },
  },
  arg: {
    configurable: true,
    enumerable: true,
    get() {
      const arg = Math.atan2(this.imag, this.real);

      return this.arg = arg !== 0 ? -((-arg + Math.PI) % (Math.PI * 2) - Math.PI) : 0;
    },
    set(value) {
      Object.defineProperty(this, 'arg', {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });

      return value;
    },
  },
  multiply: mulDescriptor,
  times:    mulDescriptor,
  mul:      mulDescriptor,
  '*':      mulDescriptor,
  divide:   divDescriptor,
  div:      divDescriptor,
  '/':      divDescriptor,
  isFinite: utils.nonEnumerable(function isFinite() {
    return utils.isFinite(this.real) && utils.isFinite(this.imag);
  }),
  isNaN: utils.nonEnumerable(function isNaN() {
    return utils.isNaN(this.real) || utils.isNaN(this.imag);
  }),
  negate: utils.nonEnumerable(function negate() {
    return new Cartesian(-this.real, -this.imag);
  }),
  conjugate: utils.nonEnumerable(function conjugate() {
    return new Cartesian(this.real, -this.imag);
  }),
  normalize: utils.nonEnumerable(function normalize() {
    return new Cartesian(this.real / this.abs, this.imag / this.abs);
  }),
  square: utils.nonEnumerable(function square() {
    return new Cartesian(
      this.real * this.real - this.imag * this.imag,
      this.real * this.imag * 2
    );
  }),
  cube: utils.nonEnumerable(function cube() {
    return new Cartesian(
      this.real * (this.real * this.real - this.imag * this.imag * 3),
      this.imag * (this.real * this.real * 3 - this.imag * this.imag)
    );
  }),
});
