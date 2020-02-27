import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';

export default function random<T extends IComplex> (Complex: IComplexConstructor<T>): T {
  return new Complex(Math.random(), Math.random(), NaN, NaN, mask.HAS_CARTESIAN);
}
