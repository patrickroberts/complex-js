import absImpl from '../internal/absImpl';
import argImpl from '../internal/argImpl';
import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getAbs from '../methods/getAbs';
import getArg from '../methods/getArg';

export default function sign<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number;
  let zImag: number
  let zAbs: number;
  let zArg: number;
  let zMask: mask;

  if (typeof z === 'number') {
    zReal = z;
    zImag = i;
    zAbs = absImpl(z, i);
    zArg = NaN;
    zMask = mask.HAS_CARTESIAN | mask.HAS_ABS;
  } else {
    zReal = z._real;
    zImag = z._imag;
    zAbs = getAbs(z);
    zArg = z._arg;
    zMask = z._mask;
  }

  if (zAbs === 0) {
    return new Complex(0, 0, 0, 0, mask.HAS_ALL);
  }

  if (zAbs !== Infinity) {
    return new Complex(zReal / zAbs, zImag / zAbs, 1, zArg, zMask | mask.HAS_ABS);
  }

  const zSignArg = typeof z === 'number'
    ? argImpl(zReal, zImag)
    : getArg(z);

  return new Complex(NaN, NaN, 1, zSignArg, mask.HAS_POLAR);
}
