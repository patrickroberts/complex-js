import { Complex, ComplexConstructor, _real, _imag, _abs, _arg, _mask } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from './real';
import getImag from './imag';
import getAbs from './abs';
import getArg from './arg';

export default function div<T extends Complex> (Complex: ComplexConstructor<T>, lhs: Complex, rhs: Complex | number, imag: number = 0): T {
  if (typeof rhs === 'number') {
    rhs = new Complex(rhs, imag, NaN, NaN, Mask.HAS_CARTESIAN);
  }

  const mask = lhs[_mask] & rhs[_mask];
  let rhsAbs2: number;

  switch (mask) {
    case Mask.HAS_ALL:
    case Mask.HAS_CARTESIAN | Mask.HAS_ABS:
      rhsAbs2 = rhs[_abs] * rhs[_abs];
      return new Complex(
        (lhs[_real] * rhs[_real] + lhs[_imag] * rhs[_imag]) / rhsAbs2,
        (lhs[_imag] * rhs[_real] - lhs[_real] * rhs[_imag]) / rhsAbs2,
        lhs[_abs] / rhs[_abs],
        lhs[_arg] - rhs[_arg],
        mask
      );
    case Mask.HAS_CARTESIAN | Mask.HAS_ARG:
      rhsAbs2 = rhs[_real] * rhs[_real] + rhs[_imag] * rhs[_imag];
      return new Complex(
        (lhs[_real] * rhs[_real] + lhs[_imag] * rhs[_imag]) / rhsAbs2,
        (lhs[_imag] * rhs[_real] - lhs[_real] * rhs[_imag]) / rhsAbs2,
        NaN,
        lhs[_arg] - rhs[_arg],
        mask
      );
    case Mask.HAS_CARTESIAN:
    case Mask.HAS_REAL:
    case Mask.HAS_IMAG:
      rhsAbs2 = getReal(rhs) * rhs[_real] + getImag(rhs) * rhs[_imag];
      return new Complex(
        (getReal(lhs) * rhs[_real] + getImag(lhs) * rhs[_imag]) / rhsAbs2,
        (lhs[_imag] * rhs[_real] - lhs[_real] * rhs[_imag]) / rhsAbs2,
        NaN,
        NaN,
        Mask.HAS_CARTESIAN
      );
    default:
      return new Complex(
        NaN,
        NaN,
        getAbs(lhs) / getAbs(rhs),
        getArg(lhs) - getArg(rhs),
        Mask.HAS_POLAR
      );
  }
}
