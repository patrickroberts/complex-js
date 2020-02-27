import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getAbs from './getAbs';
import getArg from './getArg';
import getImag from './getImag';
import getReal from './getReal';

export default function mul<T extends IComplex> (Complex: IComplexConstructor<T>, lhs: IComplex, r: IComplex | number, i = 0): T {
  const rhs: IComplex = typeof r === 'number'
    ?  new Complex(r, i, NaN, NaN, mask.HAS_CARTESIAN)
    : r;

  const _mask = lhs._mask & rhs._mask;

  switch (_mask) {
    case mask.HAS_ALL:
    case mask.HAS_CARTESIAN | mask.HAS_ABS:
    case mask.HAS_CARTESIAN | mask.HAS_ARG:
    case mask.HAS_CARTESIAN:
      return new Complex(
        lhs._real * rhs._real - lhs._imag * rhs._imag,
        lhs._imag * rhs._real + lhs._real * rhs._imag,
        lhs._abs * rhs._abs,
        lhs._arg + rhs._arg,
        _mask
      );
    case mask.HAS_REAL:
    case mask.HAS_IMAG:
      return new Complex(
        getReal(lhs) * getReal(rhs) - getImag(lhs) * getImag(rhs),
        lhs._imag * rhs._real + lhs._real * rhs._imag,
        NaN,
        NaN,
        mask.HAS_CARTESIAN
      );
    default:
      return new Complex(
        NaN,
        NaN,
        getAbs(lhs) * getAbs(rhs),
        getArg(lhs) + getArg(rhs),
        mask.HAS_POLAR
      );
  }
}
