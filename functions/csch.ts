import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function sech<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zCsch = -2 * Math.sinh(zReal) / (1 - Math.cosh(2 * zReal));

    return new Complex(
      zCsch,
      0,
      Math.abs(zCsch),
      zCsch < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCsch = 2 * Math.sin(zImag) / (Math.cos(2 * zImag) - 1);

    return new Complex(
      0,
      zCsch,
      Math.abs(zCsch),
      (zCsch < 0 ? -0.5 : 0.5) * Math.PI,
      Mask.HAS_ALL
    );
  }

  const zCschDenom = Math.cos(2 * zImag) - Math.cosh(2 * zReal);

  return new Complex(
    -2 * Math.sinh(zReal) * Math.cos(zImag) / zCschDenom,
    2 * Math.cosh(zReal) * Math.sin(zImag) / zCschDenom,
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
