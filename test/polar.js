const expect = require('chai').expect;

describe('Polar', function () {
  const Complex = require('../src/complex');
  const Long = require('../src/long');
  const Polar = require('../src/polar');

  let z;

  before(function () {
    z = new Polar(2, Math.PI / 4);
  });

  describe('#constructor', function () {

    it('should work as a constructor or a static function', function () {
      var b = Polar(2, Math.PI / 4);

      expect(z).to.have.a.property('abs', b.abs);
      expect(z).to.have.a.property('arg', b.arg);
    });
  });

  describe('#real', function () {

    it('should be lazily evaluated', function () {
      expect(z.hasOwnProperty('real')).to.equal(false);

      z.real;

      expect(z.hasOwnProperty('real')).to.equal(true);
    });

    it('should calculate the correct value', function () {
      expect(Long.withinMaxUlps(z.real, 1.4142135623730951)).to.equal(true);
    });
  });

  describe('#imag', function () {

    it('should be lazily evaluated', function () {
      expect(z.hasOwnProperty('imag')).to.equal(false);

      z.imag;

      expect(z.hasOwnProperty('imag')).to.equal(true);
    });

    it('should calculate the correct value', function () {
      expect(Long.withinMaxUlps(z.imag, 1.4142135623730951)).to.equal(true);
    });
  });

  describe('#equals()', function () {

    it('should return a boolean', function () {
      expect(z.equals(z)).to.be.a('boolean');
    });

    it('should return true for equal values', function () {
      var b = new Polar(-2, Math.PI * 5 / 4);

      expect(z.equals(b)).to.equal(true);
    });

    it('should return false for unequal values', function () {
      var b = new Polar(2, -Math.PI / 4);

      expect(z.equals(b)).to.equal(false);
    });
  });

  describe('#multiply()', function () {
    let p;

    before(function () {
      p = z.multiply(new Polar(2, -Math.PI / 3));
    });

    it('should return an instance of Polar', function () {
      expect(p).to.be.instanceof(Polar);
    });

    it('should calculate the correct value', function () {
      expect(p).to.have.a.property('abs', 4);
      expect(p).to.have.a.property('arg', -0.26179938779914913);
    });

    it('should have aliases', function () {
      expect(Polar.prototype).to.have.a.property('times', Polar.prototype.multiply);
      expect(Polar.prototype).to.have.a.property('mul', Polar.prototype.multiply);
      expect(Polar.prototype).to.have.a.property('*', Polar.prototype.multiply);
    });
  });

  describe('#divide()', function () {
    let q;

    before(function () {
      q = z.divide(new Polar(-2, 0));
    });

    it('should return an instance of Polar', function () {
      expect(q).to.be.instanceof(Polar);
    });

    it('should calculate the correct value', function () {
      expect(q).to.have.a.property('abs', 1);
      expect(q).to.have.a.property('arg', -2.356194490192345);
    });

    it('should have aliases', function () {
      expect(Polar.prototype).to.have.a.property('div', Polar.prototype.divide);
      expect(Polar.prototype).to.have.a.property('/', Polar.prototype.divide);
    });
  });
});
