import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function cos<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zCos = Math.cos(zReal);

    return new Complex(
      zCos,
      0,
      Math.abs(zCos),
      zCos < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCos = Math.cosh(zImag);

    return new Complex(
      zCos,
      0,
      Math.abs(zCos),
      zCos < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  return new Complex(
    Math.cos(zReal) * Math.cosh(zImag),
    Math.sin(zReal) * Math.sinh(zImag),
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
