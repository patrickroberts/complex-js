import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from './real';
import getImag from './imag';
import getAbs from './abs';
import getArg from './arg';

export default function mul<T extends Complex> (Complex: ComplexConstructor<T>, lhs: Complex, rhs: Complex | number, imag: number = 0): T {
  if (typeof rhs === 'number') {
    rhs = new Complex(rhs, imag, NaN, NaN, Mask.HAS_CARTESIAN);
  }

  const mask = lhs._mask & rhs._mask;

  switch (mask) {
    case Mask.HAS_ALL:
    case Mask.HAS_CARTESIAN | Mask.HAS_ABS:
    case Mask.HAS_CARTESIAN | Mask.HAS_ARG:
    case Mask.HAS_CARTESIAN:
      return new Complex(
        lhs._real * rhs._real - lhs._imag * rhs._imag,
        lhs._imag * rhs._real + lhs._real * rhs._imag,
        lhs._abs * rhs._abs,
        lhs._arg + rhs._arg,
        mask
      );
    case Mask.HAS_REAL:
    case Mask.HAS_IMAG:
      return new Complex(
        getReal(lhs) * getReal(rhs) - getImag(lhs) * getImag(rhs),
        lhs._imag * rhs._real + lhs._real * rhs._imag,
        NaN,
        NaN,
        Mask.HAS_CARTESIAN
      );
    default:
      return new Complex(
        NaN,
        NaN,
        getAbs(lhs) * getAbs(rhs),
        getArg(lhs) + getArg(rhs),
        Mask.HAS_POLAR
      );
  }
}
