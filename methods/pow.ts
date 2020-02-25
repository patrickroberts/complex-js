import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from './real';
import getImag from './imag';
import getAbs from './abs';
import getArg from './arg';
import div from './div';
import from from '../functions/from';
import square from '../functions/square';
import cube from '../functions/cube';

export default function pow<T extends Complex> (Complex: ComplexConstructor<T>, lhs: Complex, rhs: Complex | number, imag: number = 0): T {
  // rhs = c + di
  let c: number; let d: number;

  if (typeof rhs === 'number') {
    c = rhs; d = imag;
  } else {
    c = getReal(rhs); d = getImag(rhs);
  }

  if (d === 0) {
    switch (c) {
      case -1: return div(Complex, from(Complex, 1), lhs);
      case 0: return from(Complex, 1);
      case 1: return from(Complex, lhs);
      case 2: return square(Complex, lhs);
      case 3: return cube(Complex, lhs);
    }
  }

  // lhs = r e ** ia
  const r = getAbs(lhs);
  const a = getArg(lhs);

  // lhs ** rhs === (r ** c * e ** -ad) e ** i(d ln(r) + ac)
  // from https://en.wikipedia.org/wiki/Exponentiation#Computing_complex_powers
  const abs = Math.pow(r, c) * Math.exp(-a * d);
  const arg = d * Math.log(r) + a * c;

  return new Complex(NaN, NaN, abs, arg, Mask.HAS_POLAR);
}
