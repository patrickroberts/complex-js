/* Copyright (c) 2017 Patrick Roberts */

'use strict';

module.exports = {
  nonEnumerable(value) {
    return {
      configurable: true,
      enumerable: false,
      value,
      writable: true,
    };
  },
  isFinite: global.isFinite,
  isNaN: global.isNaN,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign || function sign(number) {
    return number > 0 ? 1 : number < 0 ? -1 : number == 0 ? 0 : NaN;
  },
  truncate: Math.trunc || function truncate(number) {
    return number - (number % 1);
  },
  hypot: Math.hypot || function hypot(a, b) {
    return Math.sqrt(a * a + b * b);
  },
  cosh: Math.cosh || function cosh(number) {
    const exp = Math.exp(number);

    return (exp + 1 / exp) / 2;
  },
  sinh: Math.sinh || function sinh(number) {
    const exp = Math.exp(number);

    return (exp - 1 / exp) / 2;
  },
  EPSILON: Number.EPSILON || 2.220446049250313e-16,
};
