/* Copyright (c) 2017 Patrick Roberts */

'use strict';

const utils = require('./utils');

const Long = module.exports = class Long {
  // bound float64Array and uint16Array
  // access same arrayBuffer
  static fromFloat64(float64Array, uint16Array, value) {
    // protects against -0
    float64Array[0] = value === 0 ? 0 : value;

    // little endian encoding assumed
    return new Long(uint16Array[3], uint16Array[2], uint16Array[1], uint16Array[0]);
  }

  static withinMaxUlps(a, b, maxUlps = 4) {
    // covers +-Infinity and NaN
    if (!utils.isFinite(a) || !utils.isFinite(b)) {
      return +a === +b;
    }

    const {hi, lo} = Long.fromFloat64(+a).sub(Long.fromFloat64(+b));

    return hi === 0 && lo <= maxUlps || ~hi === 0 && ~lo <= maxUlps;
  }

  constructor(u48, u32, u16, u00) {
    this.u48 = u48;
    this.u32 = u32;
    this.u16 = u16;
    this.u00 = u00;
  }

  get hi() {
    return (this.u48 << 16) | this.u32;
  }

  get lo() {
    return (this.u16 << 16) | this.u00;
  }

  set hi(int32) {
    this.u48 = int32 >> 16;
    this.u32 = int32 & 0xFFFF;

    return this.hi;
  }

  set lo(int32) {
    this.u16 = int32 >> 16;
    this.u00 = int32 & 0xFFFF;

    return this.lo;
  }

  negate() {
    this.hi = ~this.hi;
    this.lo = ~this.lo;

    return this;
  }

  add(that) {
    let u48, u32, u16, u00;

    u00 = this.u00 + that.u00;
    u16 = u00 >>> 16;
    u00 &= 0xFFFF;
    u16 += this.u16 + that.u16;
    u32 = u16 >>> 16;
    u16 &= 0xFFFF;
    u32 += this.u32 + that.u32;
    u48 = u32 >>> 16;
    u32 &= 0xFFFF;
    u48 += this.u48 + that.u48;
    u48 &= 0xFFFF;

    this.u48 = u48;
    this.u32 = u32;
    this.u16 = u16;
    this.u00 = u00;

    return this;
  }

  sub(that) {
    return this.add(that.negate().add(Long.ONE));
  }
}

Long.ONE = new Long(0x0000, 0x0000, 0x0000, 0x0001);

const arrayBuffer = new ArrayBuffer(8);

Object.defineProperty(Long, 'fromFloat64', utils.nonEnumerable(
    Long.fromFloat64.bind(Long, new Float64Array(arrayBuffer), new Uint16Array(arrayBuffer))
  )
);
