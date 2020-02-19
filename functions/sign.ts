import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import absImpl from '../internal/abs';
import argImpl from '../internal/arg';
import getAbs from '../methods/abs';
import getArg from '../methods/arg';

export default function sign<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number, zAbs: number, zArg: number, zMask: Mask;

  if (typeof z === 'number') {
    zReal = z; zImag = imag; zAbs = absImpl(z, imag); zArg = NaN; zMask = Mask.HAS_CARTESIAN;
  } else {
    zReal = z._real; zImag = z._imag; zAbs = getAbs(z); zArg = z._arg; zMask = z._mask;
  }

  if (zAbs === 0) {
    return new Complex(0, 0, 0, 0, Mask.HAS_ALL);
  }

  if (zAbs !== Infinity) {
    return new Complex(zReal / zAbs, zImag / zAbs, 1, zArg, zMask | Mask.HAS_ABS);
  }

  const arg = typeof z === 'number'
    ? argImpl(zReal, zImag)
    : getArg(z);

  return new Complex(NaN, NaN, 1, arg, Mask.HAS_POLAR);
}
