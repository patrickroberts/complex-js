import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';

export default function square<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
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

  const real2 = zReal * zReal;
  const imag2 = zImag * zImag;
  const abs2 = zMask & mask.HAS_ABS
    ? zAbs * zAbs
    : real2 + imag2;

  return new Complex(real2, imag2, abs2, zArg * 2, zMask | mask.HAS_ABS);
}
