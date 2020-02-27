import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getAbs from './getAbs';
import getArg from './getArg';
import getImag from './getImag';
import getReal from './getReal';

export default function div<T extends IComplex> (Complex: IComplexConstructor<T>, lhs: IComplex, r: IComplex | number, i = 0): T {
  const rhs: IComplex = typeof r === 'number'
    ? new Complex(r, i, NaN, NaN, mask.HAS_CARTESIAN)
    : r;

  const _mask = lhs._mask & rhs._mask;
  let rhsAbs2: number;

  switch (_mask) {
    case mask.HAS_ALL:
    case mask.HAS_CARTESIAN | mask.HAS_ABS:
      rhsAbs2 = rhs._abs * rhs._abs;
      return new Complex(
        (lhs._real * rhs._real + lhs._imag * rhs._imag) / rhsAbs2,
        (lhs._imag * rhs._real - lhs._real * rhs._imag) / rhsAbs2,
        lhs._abs / rhs._abs,
        lhs._arg - rhs._arg,
        _mask
      );
    case mask.HAS_CARTESIAN | mask.HAS_ARG:
      rhsAbs2 = rhs._real * rhs._real + rhs._imag * rhs._imag;
      return new Complex(
        (lhs._real * rhs._real + lhs._imag * rhs._imag) / rhsAbs2,
        (lhs._imag * rhs._real - lhs._real * rhs._imag) / rhsAbs2,
        NaN,
        lhs._arg - rhs._arg,
        _mask
      );
    case mask.HAS_CARTESIAN:
    case mask.HAS_REAL:
    case mask.HAS_IMAG:
      rhsAbs2 = getReal(rhs) * rhs._real + getImag(rhs) * rhs._imag;
      return new Complex(
        (getReal(lhs) * rhs._real + getImag(lhs) * rhs._imag) / rhsAbs2,
        (lhs._imag * rhs._real - lhs._real * rhs._imag) / rhsAbs2,
        NaN,
        NaN,
        mask.HAS_CARTESIAN
      );
    default:
      return new Complex(
        NaN,
        NaN,
        getAbs(lhs) / getAbs(rhs),
        getArg(lhs) - getArg(rhs),
        mask.HAS_POLAR
      );
  }
}
