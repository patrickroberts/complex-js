import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function cosh<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zCosh = Math.cosh(zReal);

    return new Complex(
      zCosh,
      0,
      Math.abs(zCosh),
      zCosh < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCosh = Math.cos(zImag);

    return new Complex(
      zCosh,
      0,
      Math.abs(zCosh),
      zCosh < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  return new Complex(
    Math.cosh(zReal) * Math.cos(zImag),
    Math.sinh(zReal) * Math.sin(zImag),
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
