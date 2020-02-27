import cube from '../functions/cube';
import from from '../functions/from';
import square from '../functions/square';
import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import div from './div';
import getAbs from './getAbs';
import getArg from './getArg';
import getImag from './getImag';
import getReal from './getReal';

export default function pow<T extends IComplex> (Complex: IComplexConstructor<T>, lhs: IComplex, r: IComplex | number, i = 0): T {
  // rhs = c + di
  let c: number;
  let d: number;

  if (typeof r === 'number') {
    c = r;
    d = i;
  } else {
    c = getReal(r);
    d = getImag(r);
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

  // lhs = m e ** ia
  const m = getAbs(lhs);
  const a = getArg(lhs);

  // lhs ** rhs === (m ** c * e ** -ad) e ** i(d ln(m) + ac)
  // from https://en.wikipedia.org/wiki/Exponentiation#Computing_complex_powers
  const abs = Math.pow(m, c) * Math.exp(-a * d);
  const arg = d * Math.log(m) + a * c;

  return new Complex(NaN, NaN, abs, arg, mask.HAS_POLAR);
}
