import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';

export default function cube<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number;
  let zImag: number;
  let zAbs: number;
  let zArg: number;
  let zMask: mask;

  if (typeof z === 'number') {
    zReal = z;
    zImag = i;
    zAbs = NaN;
    zArg = NaN;
    zMask = mask.HAS_CARTESIAN;
  } else {
    zReal = z._real;
    zImag = z._imag;
    zAbs = z._abs;
    zArg = z._arg;
    zMask = z._mask;
  }

  const abs3 = zAbs * zAbs * zAbs;
  const arg3 = zArg * 3;

  if ((zMask & mask.HAS_CARTESIAN) !== mask.HAS_CARTESIAN) {
    return new Complex(NaN, NaN, abs3, arg3, mask.HAS_POLAR);
  }

  const real2 = zReal * zReal;
  const imag2 = zImag * zImag;
  const real3 = (real2 - imag2 * 3) * zReal;
  const imag3 = (real2 * 3 - imag2) * zImag;

  return new Complex(real3, imag3, arg3, abs3, zMask);
}
