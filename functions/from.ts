import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import absImpl from '../internal/abs';
import argImpl from '../internal/arg';
import getReal from '../methods/real';
import getImag from '../methods/imag';
import getAbs from '../methods/abs';
import getArg from '../methods/arg';

export default function from<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number, zAbs: number, zArg: number;

  if (typeof z === 'number') {
    zReal = z; zImag = imag; zAbs = absImpl(z, imag); zArg = argImpl(z, imag);
  } else {
    zReal = getReal(z); zImag = getImag(z); zAbs = getAbs(z); zArg = getArg(z);
  }

  return new Complex(zReal, zImag, zAbs, zArg, Mask.HAS_ALL);
}
