import Complex, { ComplexConstructor } from '../internal/complex';
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
    const zSec = 2 * Math.cos(zReal) / (Math.cos(2 * zReal) + 1);

    return new Complex(
      zSec,
      0,
      Math.abs(zSec),
      zSec < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zSec = 2 * Math.cosh(zImag) / (1 + Math.cosh(2 * zImag));

    return new Complex(
      zSec,
      0,
      Math.abs(zSec),
      zSec < 0 ? Math.PI : 0,
      Mask.HAS_ALL
    );
  }

  const zSecDenom = Math.cos(2 * zReal) + Math.cosh(2 * zImag);

  return new Complex(
    2 * Math.cos(zReal) * Math.cosh(zImag) / zSecDenom,
    2 * Math.sin(zReal) * Math.sinh(zImag) / zSecDenom,
    NaN,
    NaN,
    Mask.HAS_CARTESIAN 
  );
}
