import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import absImpl from '../internal/abs';
import getAbs from '../methods/abs';

export default function abs<T extends Complex>(Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zAbs: number;

  if (typeof z === 'number') {
    zAbs = absImpl(z, imag);
  } else {
    zAbs = getAbs(z);
  }

  return new Complex(zAbs, 0, zAbs, 0, Mask.HAS_ALL);
}
