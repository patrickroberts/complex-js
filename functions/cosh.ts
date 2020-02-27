import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function cosh<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
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
    const zCosh = Math.cosh(zReal);

    return new Complex(
      zCosh,
      0,
      Math.abs(zCosh),
      zCosh < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCosh = Math.cos(zImag);

    return new Complex(
      zCosh,
      0,
      Math.abs(zCosh),
      zCosh < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  return new Complex(
    Math.cosh(zReal) * Math.cos(zImag),
    Math.sinh(zReal) * Math.sin(zImag),
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
