import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';

export default function random<T extends Complex> (Complex: ComplexConstructor<T>): T {
  return new Complex(Math.random(), Math.random(), NaN, NaN, Mask.HAS_CARTESIAN);
}
