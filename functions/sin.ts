import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from '../methods/real';
import getImag from '../methods/imag';

export default function sin<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag;
  } else {
    zReal = getReal(z); zImag = getImag(z);
  }

  if (zImag === 0) {
    const zSin = Math.sin(zReal);

    return new Complex(
      zSin,
      0,
      Math.abs(zSin),
      zSin < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zSin = Math.sinh(zImag);

    return new Complex(
      0,
      zSin,
      Math.abs(zSin),
      (zSin < 0 ? -0.5 : 0.5) * Math.PI,
      Mask.HAS_ALL
    );
  }

  return new Complex(
    Math.sin(zReal) * Math.cosh(zImag),
    Math.cos(zReal) * Math.sinh(zImag),
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
