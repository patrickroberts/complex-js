const expect = require('chai').expect;

describe('utils', function () {
  const Long = require('../src/long');
  let utils;

  before(function () {
    // save builtins
    const isFinite = Object.getOwnPropertyDescriptor(global, 'isFinite');
    const isNaN = Object.getOwnPropertyDescriptor(global, 'isNaN');
    const Math = Object.getOwnPropertyDescriptor(global, 'Math');
    const Number = Object.getOwnPropertyDescriptor(global, 'Number');

    // force fallbacks to be used instead of builtins
    Object.defineProperties(global, {
      isFinite: {value: undefined}, isNaN: {value: undefined}, Math: {value: {}}, Number: {value: function Number() {}}
    });

    // force require() to hotload utils with fallbacks
    delete require.cache[require.resolve('../src/utils')];
    // hotload utils
    utils = require('../src/utils');

    // untamper globals after hotloading
    Object.defineProperties(global, {
      isFinite, isNaN, Math, Number
    });
  });

  after(function () {
    // force next require() to reload utils with builtins
    delete require.cache[require.resolve('../src/utils')];
  });

  describe('nonEnumerable()', function () {
    let value, descriptor;

    before(function () {
      value = {};
      descriptor = utils.nonEnumerable(value);
    });

    it('should create a data descriptor for a non-enumerable value', function () {
      expect(descriptor).to.have.a.property('configurable', true);
      expect(descriptor).to.have.a.property('enumerable', false);
      expect(descriptor).to.have.a.property('value');
      expect(descriptor).to.have.a.property('writable', true);
    });

    it('should reference the original value', function () {
      expect(descriptor).to.have.a.property('value', value);
    });
  });

  describe('sign()', function () {

    it('should return 1 for positive values', function () {
      expect(utils.sign(5)).to.equal(1);
      expect(utils.sign(2.220446049250313e-16)).to.equal(1);
      expect(utils.sign(Infinity)).to.equal(1);
    });

    it('should return -1 for negative values', function () {
      expect(utils.sign(-5)).to.equal(-1);
      expect(utils.sign(-2.220446049250313e-16)).to.equal(-1);
      expect(utils.sign(-Infinity)).to.equal(-1);
    });

    it('should return 0 for 0', function () {
      expect(utils.sign(0)).to.equal(0);
      expect(utils.sign(-0)).to.equal(0);
    });

    it('should return NaN for NaN', function () {
      expect(utils.sign(NaN)).to.be.NaN;
    });
  });

  describe('truncate()', function () {

    it('should return the integer part of a number', function () {
      expect(utils.truncate(5.9)).to.equal(5);
      expect(utils.truncate(5.1)).to.equal(5);
      expect(utils.truncate(-0.1)).to.equal(0);
      expect(utils.truncate(-0.9)).to.equal(0);
    });

    it('should return NaN for NaN', function () {
      expect(utils.truncate(NaN)).to.be.NaN;
    });
  });

  describe('hypot()', function () {

    it('should return the sqrt of the sum of squares of the two input numbers', function () {
      expect(utils.hypot(3, 4)).to.equal(5);
      expect(utils.hypot(1, 1)).to.equal(1.4142135623730951);
    });

    it('should return Infinity for inputs that exceed double precision', function () {
      expect(utils.hypot(Infinity, -Infinity)).to.equal(Infinity);
      expect(utils.hypot(-Infinity, Infinity)).to.equal(Infinity);
      expect(utils.hypot(-Infinity, -Infinity)).to.equal(Infinity);
    });

    it('should return NaN if either input number is NaN', function () {
      expect(utils.hypot(0, NaN)).to.be.NaN;
      expect(utils.hypot(NaN, 0)).to.be.NaN;
      expect(utils.hypot(NaN, NaN)).to.be.NaN;
    });
  });

  describe('cosh()', function () {

    it('should return cosh of input number', function () {
      const pos_pi = utils.cosh(Math.PI);
      const neg_pi = utils.cosh(-Math.PI);
      const pos_5 = utils.cosh(5);
      const neg_5 = utils.cosh(-5);

      expect(utils.cosh(0)).to.equal(1);
      expect(Long.withinMaxUlps(pos_pi, 11.591953275521519, 1)).to.equal(true);
      expect(Long.withinMaxUlps(neg_pi, 11.591953275521519, 1)).to.equal(true);
      expect(Long.withinMaxUlps(pos_5, 74.20994852478785, 1)).to.equal(true);
      expect(Long.withinMaxUlps(neg_5, 74.20994852478785, 1)).to.equal(true);
    });

    it('should return NaN for NaN', function () {
      expect(utils.cosh(NaN)).to.be.NaN;
    });
  });

  describe('sinh()', function () {

    it('should return sinh of input number', function () {
      const pos_pi = utils.sinh(Math.PI);
      const neg_pi = utils.sinh(-Math.PI);
      const pos_5 = utils.sinh(5);
      const neg_5 = utils.sinh(-5);

      expect(utils.sinh(0)).to.equal(0);
      expect(Long.withinMaxUlps(pos_pi, 11.548739357257748, 1)).to.equal(true);
      expect(Long.withinMaxUlps(neg_pi, -11.548739357257748, 1)).to.equal(true);
      expect(Long.withinMaxUlps(pos_5, 74.20321057778875, 1)).to.equal(true);
      expect(Long.withinMaxUlps(neg_5, -74.20321057778875, 1)).to.equal(true);
    });

    it('should return NaN for NaN', function () {
      expect(utils.sinh(NaN)).to.be.NaN;
    });
  });

  describe('EPSILON', function () {

    it('should equal standard Number.EPSILON', function () {
      expect(utils.EPSILON).to.equal(2.220446049250313e-16);
    });
  });
});
