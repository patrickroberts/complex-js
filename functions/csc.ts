import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function sec<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zCsc = -2 * Math.sin(zReal) / (Math.cos(2 * zReal) - 1);

    return new Complex(
      zCsc,
      0,
      Math.abs(zCsc),
      zCsc < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCsc = 2 * Math.sinh(zImag) / (1 - Math.cosh(2 * zImag));

    return new Complex(
      0,
      zCsc,
      Math.abs(zCsc),
      (zCsc < 0 ? -0.5 : 0.5) * Math.PI,
      Mask.HAS_ALL
    );
  }

  const zCscDenom = Math.cos(2 * zReal) - Math.cosh(2 * zImag);

  return new Complex(
    -2 * Math.sin(zReal) * Math.cosh(zImag) / zCscDenom,
    2 * Math.cos(zReal) * Math.sinh(zImag) / zCscDenom,
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
