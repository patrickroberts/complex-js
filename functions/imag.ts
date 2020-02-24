import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import imagImpl from '../internal/imag';
import getImag from '../methods/imag';

export default function imag<T extends Complex>(Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zImag: number;

  if (typeof z === 'number') {
    zImag = imagImpl(z, imag);
  } else {
    zImag = getImag(z);
  }

  return new Complex(
    zImag,
    0,
    Math.abs(zImag),
    zImag < 0 ? Math.PI : 0,
    Mask.HAS_ALL
  );
}
