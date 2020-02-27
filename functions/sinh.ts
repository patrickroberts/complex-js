import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function sinh<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number;
  let zImag: number;

  if (typeof z === 'number') {
    zReal = z;
    zImag = i;
  } else {
    zReal = getReal(z);
    zImag = getImag(z);
  }

  if (zImag === 0) {
    const zSinh = Math.sinh(zReal);

    return new Complex(
      zSinh,
      0,
      Math.abs(zSinh),
      zSinh < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zSinh = Math.sin(zImag);

    return new Complex(
      0,
      zSinh,
      Math.abs(zSinh),
      (zSinh < 0 ? -0.5 : 0.5) * Math.PI,
      mask.HAS_ALL
    );
  }

  return new Complex(
    Math.sinh(zReal) * Math.cos(zImag),
    Math.cosh(zReal) * Math.sin(zImag),
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
