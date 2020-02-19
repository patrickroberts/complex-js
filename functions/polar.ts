import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';

export default function polar<T extends Complex> (Complex: ComplexConstructor<T>, abs: number, arg: number = 0): T {
  let zAbs: number, zArg: number;

  if (abs < 0) {
    zAbs = -abs; zArg = arg + Math.PI;
  } else {
    zAbs = abs; zArg = arg;
  }

  return new Complex(NaN, NaN, zAbs, zArg, Mask.HAS_POLAR);
}
