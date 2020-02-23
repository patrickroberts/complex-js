import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function tanh<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zTanh = Math.sinh(2 * zReal) / (Math.cosh(2 * zReal) + 1);

    return new Complex(
      zTanh,
      0,
      Math.abs(zTanh),
      zTanh < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zTanh = Math.sin(2 * zImag) / (1 + Math.cos(2 * zImag));

    return new Complex(
      0,
      zTanh,
      Math.abs(zTanh),
      (zTanh < 0 ? -0.5 : 0.5) * Math.PI,
      Mask.HAS_ALL
    );
  }

  const zTanhDenom = Math.cosh(2 * zReal) + Math.cos(2 * zImag);

  return new Complex(
    Math.sinh(2 * zReal) / zTanhDenom,
    Math.sin(2 * zImag) / zTanhDenom,
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
