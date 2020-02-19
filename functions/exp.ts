import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function exp<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  return new Complex(
    NaN,
    NaN,
    Math.exp(zReal),
    zImag,
    Mask.HAS_POLAR 
  );
}
