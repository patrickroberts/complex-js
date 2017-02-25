const expect = require('chai').expect;

describe('Long', function () {
  const Long = require('../src/long');

  describe('fromFloat64()', function () {

    it('should generate correct bit vector for 0.0', function () {
      var zero = Long.fromFloat64(0);

      expect(zero).to.have.a.property('u48', 0);
      expect(zero).to.have.a.property('u32', 0);
      expect(zero).to.have.a.property('u16', 0);
      expect(zero).to.have.a.property('u00', 0);
    });

    it('should generate correct bit vector for 1.0', function () {
      var one = Long.fromFloat64(1);

      expect(one).to.have.a.property('u48', 0x3FF0);
      expect(one).to.have.a.property('u32', 0);
      expect(one).to.have.a.property('u16', 0);
      expect(one).to.have.a.property('u00', 0);
    });

    it('should generate correct bit vector for EPSILON', function () {
      var eps = Long.fromFloat64(2.220446049250313e-16);

      expect(eps).to.have.a.property('u48', 0x3CB0);
      expect(eps).to.have.a.property('u32', 0);
      expect(eps).to.have.a.property('u16', 0);
      expect(eps).to.have.a.property('u00', 0);
    });

    it('should generate correct bit vectors for +-Infinity', function () {
      var inf = Long.fromFloat64(Infinity);

      expect(inf).to.have.a.property('u48', 0x7FF0);
      expect(inf).to.have.a.property('u32', 0);
      expect(inf).to.have.a.property('u16', 0);
      expect(inf).to.have.a.property('u00', 0);

      var neg_inf = Long.fromFloat64(-Infinity);

      expect(neg_inf).to.have.a.property('u48', 0xFFF0);
      expect(neg_inf).to.have.a.property('u32', 0);
      expect(neg_inf).to.have.a.property('u16', 0);
      expect(neg_inf).to.have.a.property('u00', 0);
    });

    it('should generate correct bit vector for NaN', function () {
      var nan = Long.fromFloat64(NaN);

      expect(nan).to.have.a.property('u48', 0x7FF8);
      expect(nan).to.have.a.property('u32', 0);
      expect(nan).to.have.a.property('u16', 0);
      expect(nan).to.have.a.property('u00', 0);
    });
  });

  describe('withinMaxUlps()', function () {

    it('should return a boolean', function () {
      expect(Long.withinMaxUlps()).to.be.a('boolean');
    });

    it('should allow up to 4 units in the last place', function () {
      var a = 1;
      var b, c;

      expect(Long.withinMaxUlps(a, a)).to.equal(true);

      for (var i = 0; i <= 4; i++) {
        b = 1 + i * 2.220446049250313e-16;
        c = 1 - i * 1.1102230246251565e-16;

        expect(Long.withinMaxUlps(a, b)).to.equal(true);
        expect(Long.withinMaxUlps(a, c)).to.equal(true);
      }

      b = 1 + 5 * 2.220446049250313e-16;
      c = 1 - 5 * 1.1102230246251565e-16;

      expect(Long.withinMaxUlps(a, b)).to.equal(false);
      expect(Long.withinMaxUlps(a, c)).to.equal(false);
    });

    it('should allow max units in the last place to be changed', function () {
      var a = 1
      var b = 1 + 5 * 2.220446049250313e-16;
      var c = 1 - 5 * 1.1102230246251565e-16;

      expect(Long.withinMaxUlps(a, b, 5)).to.equal(true);
      expect(Long.withinMaxUlps(a, c, 5)).to.equal(true);
    });

    it('should prevent Infinity from being equal to finite numbers', function () {
      expect(Long.withinMaxUlps(Infinity, 1.7415152243978685e+308)).to.equal(false);
    });

    it('should prevent NaN from being equal to itself', function () {
      expect(Long.withinMaxUlps(NaN, NaN)).to.equal(false);
    });
  });

  describe('#hi', function () {
    let u48, u32, u16, u00;
    let o48, o32;
    let lng;

    before(function () {
      u48 = 1; u32 = 2; u16 = 3; u00 = 4;
      o48 = 5; o32 = 6;
      lng = new Long(u48, u32, u16, u00);
    });

    it('should get correct Int32', function () {
      expect(lng).to.have.a.property('hi', (u48 << 16) | u32);
    });

    it('should set correct Int32', function () {
      lng.hi = (o48 << 16) | o32;

      expect(lng).to.have.a.property('hi', (o48 << 16) | o32);
      expect(lng).to.have.a.property('u48', o48);
      expect(lng).to.have.a.property('u32', o32);
    });
  });

  describe('#lo', function () {
    let u48, u32, u16, u00;
    let o16, o00;
    let lng;

    before(function () {
      u48 = 1; u32 = 2; u16 = 3; u00 = 4;
      o16 = 5; o00 = 6;
      lng = new Long(u48, u32, u16, u00);
    });

    it('should get correct Int32', function () {
      expect(lng).to.have.a.property('lo', (u16 << 16) | u00);
    });

    it('should set correct Int32', function () {
      lng.lo = (o16 << 16) | o00;

      expect(lng).to.have.a.property('lo', (o16 << 16) | o00);
      expect(lng).to.have.a.property('u16', o16);
      expect(lng).to.have.a.property('u00', o00);
    });
  });

  describe('#negate()', function () {
    let u48, u32, u16, u00;
    let lng, neg;

    before(function () {
      u48 = 1; u32 = 2; u16 = 3; u00 = 4;
      lng = new Long(u48, u32, u16, u00);
      neg = lng.negate();
    })

    it('should set the long to its one\'s complement', function () {
      expect(neg).to.have.a.property('u48', ~u48 & 0xFFFF);
      expect(neg).to.have.a.property('u32', ~u32 & 0xFFFF);
      expect(neg).to.have.a.property('u16', ~u16 & 0xFFFF);
      expect(neg).to.have.a.property('u00', ~u00 & 0xFFFF);
    });

    it('should run in-place', function () {
      expect(neg).to.equal(lng);
    });
  });

  describe('#add()', function () {

    it('should calculate correct sum', function () {
      var a = new Long(1, 2, 3, 4);
      var b = new Long(5, 6, 7, 8);
      var c = a.add(b);

      expect(c).to.have.a.property('u48', 6);
      expect(c).to.have.a.property('u32', 8);
      expect(c).to.have.a.property('u16', 10);
      expect(c).to.have.a.property('u00', 12);
    });

    it('should handle overflow', function () {
      var a = new Long(0xFFF0, 0xFFF0, 0xFFF0, 0xFFF0);
      var b = new Long(0x000F, 0x000F, 0x000F, 0x0011);
      var c = a.add(b);

      expect(c).to.have.a.property('u48', 0);
      expect(c).to.have.a.property('u32', 0);
      expect(c).to.have.a.property('u16', 0);
      expect(c).to.have.a.property('u00', 1);
    });

    it('should run in-place', function () {
      var a = new Long(0xFFF0, 0xFFF0, 0xFFF0, 0xFFF0);
      var b = new Long(0x000F, 0x000F, 0x000F, 0x0011);
      var c = a.add(b);

      expect(c).to.equal(a);
    });
  });

  describe('#sub()', function () {

    it('should calculate correct difference', function () {
      var a = new Long(8, 7, 6, 5);
      var b = new Long(1, 2, 3, 4);
      var c = a.sub(b);

      expect(c).to.have.a.property('u48', 7);
      expect(c).to.have.a.property('u32', 5);
      expect(c).to.have.a.property('u16', 3);
      expect(c).to.have.a.property('u00', 1);
    });

    it('should handle underflow', function () {
      var a = new Long(0, 0, 0, 1);
      var b = new Long(0, 0, 0, 2);
      var c = a.sub(b);

      expect(c).to.have.a.property('u48', 0xFFFF);
      expect(c).to.have.a.property('u32', 0xFFFF);
      expect(c).to.have.a.property('u16', 0xFFFF);
      expect(c).to.have.a.property('u00', 0xFFFF);
    });

    it('should run in-place', function () {
      var a = new Long(0, 0, 0, 1);
      var b = new Long(0, 0, 0, 2);
      var c = a.sub(b);

      expect(c).to.equal(a);
    });
  });

  describe('ONE', function () {

    it('should be equal to long value of 1', function () {
      expect(Long.ONE).to.have.a.property('u48', 0);
      expect(Long.ONE).to.have.a.property('u32', 0);
      expect(Long.ONE).to.have.a.property('u16', 0);
      expect(Long.ONE).to.have.a.property('u00', 1);
    });
  });
});
