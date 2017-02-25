const expect = require('chai').expect;

describe('Cartesian', function () {
  const Complex = require('../src/complex');
  const Long = require('../src/long');
  const Cartesian = require('../src/cartesian');

  let z;

  before(function () {
    z = new Cartesian(3, 4);
  });

  describe('#constructor', function () {

    it('should work as a constructor or a static function', function () {
      var b = Cartesian(3, 4);

      expect(z).to.have.a.property('real', b.real);
      expect(z).to.have.a.property('imag', b.imag);
    });
  });

  describe('#abs', function () {

    it('should be lazily evaluated', function () {
      expect(z.hasOwnProperty('abs')).to.equal(false);

      z.abs;

      expect(z.hasOwnProperty('abs')).to.equal(true);
    });

    it('should calculate the correct value', function () {
      expect(z).to.have.a.property('abs', 5);
    });
  });

  describe('#arg', function () {

    it('should be lazily evaluated', function () {
      expect(z.hasOwnProperty('arg')).to.equal(false);

      z.arg;

      expect(z.hasOwnProperty('arg')).to.equal(true);
    });

    it('should calculate the correct value', function () {
      expect(z).to.have.a.property('arg', 0.9272952180016123);
      expect(new Cartesian(1, -0)).to.have.a.property('arg', 0);
    });
  });

  describe('#multiply()', function () {
    let p;

    before(function () {
      p = z.multiply(new Cartesian(5, 6));
    });

    it('should return an instance of Cartesian', function () {
      expect(p).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(p).to.have.a.property('real', -9);
      expect(p).to.have.a.property('imag', 38);
    });

    it('should have aliases', function () {
      expect(Cartesian.prototype).to.have.a.property('times', Cartesian.prototype.multiply);
      expect(Cartesian.prototype).to.have.a.property('mul', Cartesian.prototype.multiply);
      expect(Cartesian.prototype).to.have.a.property('*', Cartesian.prototype.multiply);
    });
  });

  describe('#divide()', function () {
    let q;

    before(function () {
      q = new Cartesian(6, 9).divide(z);
    });

    it('should return an instance of Cartesian', function () {
      expect(q).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(q).to.have.a.property('real', 2.16);
      expect(q).to.have.a.property('imag', 0.12);
    });

    it('should have aliases', function () {
      expect(Cartesian.prototype).to.have.a.property('div', Cartesian.prototype.divide);
      expect(Cartesian.prototype).to.have.a.property('/', Cartesian.prototype.divide);
    });
  });

  describe('#isFinite()', function () {

    it('should return a boolean', function () {
      expect(z.isFinite()).to.be.a('boolean');
    });

    it('should return true for finite numbers', function () {
      expect(new Cartesian(0, 0).isFinite()).to.equal(true);
      expect(new Cartesian(1e300, 1e300).isFinite()).to.equal(true);
      expect(new Cartesian(-1e300, -1e300).isFinite()).to.equal(true);
      expect(new Cartesian(1e-300, 1e-300).isFinite()).to.equal(true);
    });

    it('should return false for infinite numbers', function () {
      expect(new Cartesian(Infinity, 0).isFinite()).to.equal(false);
      expect(new Cartesian(0, Infinity).isFinite()).to.equal(false);
      expect(new Cartesian(-Infinity, 0).isFinite()).to.equal(false);
      expect(new Cartesian(0, -Infinity).isFinite()).to.equal(false);
      expect(new Cartesian(Infinity, Infinity).isFinite()).to.equal(false);
      expect(new Cartesian(Infinity, -Infinity).isFinite()).to.equal(false);
      expect(new Cartesian(-Infinity, Infinity).isFinite()).to.equal(false);
      expect(new Cartesian(-Infinity, -Infinity).isFinite()).to.equal(false);
    });

    it('should be invoked by Complex.isFinite()', function (done) {
      var error = new Error();
      var isFinite = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'isFinite');

      Object.defineProperty(Cartesian.prototype, 'isFinite', {
        configurable: true,
        enumerable: false,
        value: function isFinite() {
          error = null;
        },
        writable: true,
      });

      Complex.isFinite(z);

      Object.defineProperty(Cartesian.prototype, 'isFinite', isFinite);

      done(error);
    });
  });

  describe('#isNaN()', function () {

    it('should return a boolean', function () {
      expect(z.isNaN()).to.be.a('boolean');
    });

    it('should return false for valid numbers', function () {
      expect(new Cartesian(0, 0).isNaN()).to.equal(false);
      expect(new Cartesian(1e300, 1e300).isNaN()).to.equal(false);
      expect(new Cartesian(-1e300, -1e300).isNaN()).to.equal(false);
      expect(new Cartesian(1e-300, 1e-300).isNaN()).to.equal(false);
      expect(new Cartesian(Infinity, 0).isNaN()).to.equal(false);
      expect(new Cartesian(0, Infinity).isNaN()).to.equal(false);
      expect(new Cartesian(-Infinity, 0).isNaN()).to.equal(false);
      expect(new Cartesian(0, -Infinity).isNaN()).to.equal(false);
      expect(new Cartesian(Infinity, Infinity).isNaN()).to.equal(false);
      expect(new Cartesian(Infinity, -Infinity).isNaN()).to.equal(false);
      expect(new Cartesian(-Infinity, Infinity).isNaN()).to.equal(false);
      expect(new Cartesian(-Infinity, -Infinity).isNaN()).to.equal(false);
    });

    it('should return true for NaN', function () {
      expect(new Cartesian(NaN, 0).isNaN()).to.equal(true);
      expect(new Cartesian(0, NaN).isNaN()).to.equal(true);
      expect(new Cartesian(NaN, NaN).isNaN()).to.equal(true);
    });

    it('should be invoked by Complex.isNaN()', function (done) {
      var error = new Error();
      var isNaN = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'isNaN');

      Object.defineProperty(Cartesian.prototype, 'isNaN', {
        configurable: true,
        enumerable: false,
        value: function isNaN() {
          error = null;
        },
        writable: true,
      });

      Complex.isNaN(z);

      Object.defineProperty(Cartesian.prototype, 'isNaN', isNaN);

      done(error);
    });
  });

  describe('#negate()', function () {
    let neg;

    before(function () {
      neg = z.negate();
    });

    it('should return a Cartesian', function () {
      expect(neg).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(neg).to.have.a.property('real', -3);
      expect(neg).to.have.a.property('imag', -4);
    });

    it('should be invoked by Complex.negate()', function (done) {
      var error = new Error();
      var negate = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'negate');

      Object.defineProperty(Cartesian.prototype, 'negate', {
        configurable: true,
        enumerable: false,
        value: function negate() {
          error = null;
        },
        writable: true,
      });

      Complex.negate(z);

      Object.defineProperty(Cartesian.prototype, 'negate', negate);

      done(error);
    });
  });

  describe('#conjugate()', function () {
    let con;

    before(function () {
      con = z.conjugate();
    });

    it('should return a Cartesian', function () {
      expect(con).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(con).to.have.a.property('real', 3);
      expect(con).to.have.a.property('imag', -4);
    });

    it('should be invoked by Complex.conjugate()', function (done) {
      var error = new Error();
      var conjugate = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'conjugate');

      Object.defineProperty(Cartesian.prototype, 'conjugate', {
        configurable: true,
        enumerable: false,
        value: function conjugate() {
          error = null;
        },
        writable: true,
      });

      Complex.conjugate(z);

      Object.defineProperty(Cartesian.prototype, 'conjugate', conjugate);

      done(error);
    });
  });

  describe('#normalize()', function () {
    let nor;

    before(function () {
      nor = z.normalize();
    });

    it('should return a Cartesian', function () {
      expect(nor).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(nor).to.have.a.property('real', 0.6);
      expect(nor).to.have.a.property('imag', 0.8);
    });

    it('should calculate NaN for input of 0+0i', function () {
      var nan = new Cartesian(0, 0).normalize();

      expect(nan.real).to.be.NaN;
      expect(nan.imag).to.be.NaN;
    });

    it('should be invoked by Complex.normalize()', function (done) {
      var error = new Error();
      var normalize = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'normalize');

      Object.defineProperty(Cartesian.prototype, 'normalize', {
        configurable: true,
        enumerable: false,
        value: function normalize() {
          error = null;
        },
        writable: true,
      });

      Complex.normalize(z);

      Object.defineProperty(Cartesian.prototype, 'normalize', normalize);

      done(error);
    });
  });

  describe('#square()', function () {
    let squ;

    before(function () {
      squ = z.square();
    });

    it('should return a Cartesian', function () {
      expect(squ).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(squ).to.have.a.property('real', -7);
      expect(squ).to.have.a.property('imag', 24);
    });

    it('should be invoked by Complex.square()', function (done) {
      var error = new Error();
      var square = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'square');

      Object.defineProperty(Cartesian.prototype, 'square', {
        configurable: true,
        enumerable: false,
        value: function square() {
          error = null;
        },
        writable: true,
      });

      Complex.square(z);

      Object.defineProperty(Cartesian.prototype, 'square', square);

      done(error);
    });
  });

  describe('#cube()', function () {
    let cub;

    before(function () {
      cub = z.cube();
    });

    it('should return a Cartesian', function () {
      expect(cub).to.be.instanceof(Cartesian);
    });

    it('should calculate the correct value', function () {
      expect(cub).to.have.a.property('real', -117);
      expect(cub).to.have.a.property('imag', 44);
    });

    it('should be invoked by Complex.cube()', function (done) {
      var error = new Error();
      var cube = Object.getOwnPropertyDescriptor(Cartesian.prototype, 'cube');

      Object.defineProperty(Cartesian.prototype, 'cube', {
        configurable: true,
        enumerable: false,
        value: function cube() {
          error = null;
        },
        writable: true,
      });

      Complex.cube(z);

      Object.defineProperty(Cartesian.prototype, 'cube', cube);

      done(error);
    });
  });
});
