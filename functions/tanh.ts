import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function tanh<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
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
    const zTanh = Math.sinh(2 * zReal) / (Math.cosh(2 * zReal) + 1);

    return new Complex(
      zTanh,
      0,
      Math.abs(zTanh),
      zTanh < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zTanh = Math.sin(2 * zImag) / (1 + Math.cos(2 * zImag));

    return new Complex(
      0,
      zTanh,
      Math.abs(zTanh),
      (zTanh < 0 ? -0.5 : 0.5) * Math.PI,
      mask.HAS_ALL
    );
  }

  const zTanhDenom = Math.cosh(2 * zReal) + Math.cos(2 * zImag);

  return new Complex(
    Math.sinh(2 * zReal) / zTanhDenom,
    Math.sin(2 * zImag) / zTanhDenom,
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
