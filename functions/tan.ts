import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function tan<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
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
    const zTan = Math.sin(2 * zReal) / (Math.cos(2 * zReal) + 1);

    return new Complex(
      zTan,
      0,
      Math.abs(zTan),
      zTan < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zTan = Math.sinh(2 * zImag) / (1 + Math.cosh(2 * zImag));

    return new Complex(
      0,
      zTan,
      Math.abs(zTan),
      (zTan < 0 ? -0.5 : 0.5) * Math.PI,
      mask.HAS_ALL
    );
  }

  const zTanDenom = Math.cos(2 * zReal) + Math.cosh(2 * zImag);

  return new Complex(
    Math.sin(2 * zReal) / zTanDenom,
    Math.sinh(2 * zImag) / zTanDenom,
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
