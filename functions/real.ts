import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import realImpl from '../internal/real';
import getReal from '../methods/real';

export default function real<T extends Complex>(Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number;

  if (typeof z === 'number') {
    zReal = realImpl(z, imag);
  } else {
    zReal = getReal(z);
  }

  return new Complex(
    zReal,
    0,
    Math.abs(zReal),
    zReal < 0 ? Math.PI : 0,
    Mask.HAS_ALL
  );
}
