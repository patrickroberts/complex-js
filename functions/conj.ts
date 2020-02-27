import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';

export default function conj<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number
  let zImag: number
  let zAbs: number
  let zArg: number
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

  return new Complex(zReal, -zImag, zAbs, -zArg, zMask);
}
