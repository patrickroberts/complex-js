import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function cot<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zCot = -Math.sin(2 * zReal) / (Math.cos(2 * zReal) - 1);

    return new Complex(
      zCot,
      0,
      Math.abs(zCot),
      zCot < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCot = Math.sinh(2 * zImag) / (1 - Math.cosh(2 * zImag));

    return new Complex(
      0,
      zCot,
      Math.abs(zCot),
      (zCot < 0 ? -0.5 : 0.5) * Math.PI,
      Mask.HAS_ALL
    );
  }

  const zCotDenom = Math.cos(2 * zReal) - Math.cosh(2 * zImag);

  return new Complex(
    -Math.sin(2 * zReal) / zCotDenom,
    Math.sinh(2 * zImag) / zCotDenom,
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
