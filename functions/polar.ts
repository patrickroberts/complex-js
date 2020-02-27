import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';

export default function polar<T extends IComplex> (Complex: IComplexConstructor<T>, abs: number, arg = 0): T {
  let zAbs: number;
  let zArg: number;

  if (abs < 0) {
    zAbs = -abs;
    zArg = arg + Math.PI;
  } else {
    zAbs = abs;
    zArg = arg;
  }

  return new Complex(NaN, NaN, zAbs, zArg, mask.HAS_POLAR);
}
