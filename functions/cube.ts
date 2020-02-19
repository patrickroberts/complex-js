import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';

export default function cube<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number, zAbs: number, zArg: number, zMask: Mask;

  if (typeof z === 'number') {
    zReal = z; zImag = imag; zAbs = NaN; zArg = NaN; zMask = Mask.HAS_CARTESIAN;
  } else {
    zReal = z._real; zImag = z._imag; zAbs = z._abs; zArg = z._arg; zMask = z._mask;
  }

  const abs3 = zAbs * zAbs * zAbs;
  const arg3 = zArg * 3;

  if ((zMask & Mask.HAS_CARTESIAN) !== Mask.HAS_CARTESIAN) {
    return new Complex(NaN, NaN, abs3, arg3, Mask.HAS_POLAR);
  }

  const real2 = zReal * zReal;
  const imag2 = zImag * zImag;
  const real3 = (real2 - imag2 * 3) * zReal;
  const imag3 = (real2 * 3 - imag2) * zImag;

  return new Complex(real3, imag3, arg3, abs3, zMask);
}
