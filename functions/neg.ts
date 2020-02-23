import { Complex, ComplexConstructor, _real, _imag, _abs, _arg, _mask } from '../internal/complex';
import Mask from '../internal/mask';

export default function neg<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zReal: number, zImag: number, zAbs: number, zArg: number, zMask: Mask;

  if (typeof z === 'number') {
    zReal = z; zImag = imag; zAbs = NaN; zArg = NaN; zMask = Mask.HAS_CARTESIAN;
  } else {
    zReal = z[_real]; zImag = z[_imag]; zAbs = z[_abs]; zArg = z[_arg]; zMask = z[_mask];
  }

  return new Complex(-zReal, -zImag, zAbs, zArg + Math.PI, zMask);
}
