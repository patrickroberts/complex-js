import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function cos<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number
  let zImag: number;

  if (typeof z === 'number') {
    zReal = z;
    zImag = i;
  } else {
    zReal = getReal(z);
    zImag = getImag(z);
  }

  if (zImag === 0) {
    const zCos = Math.cos(zReal);

    return new Complex(
      zCos,
      0,
      Math.abs(zCos),
      zCos < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zCos = Math.cosh(zImag);

    return new Complex(
      zCos,
      0,
      Math.abs(zCos),
      zCos < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  return new Complex(
    Math.cos(zReal) * Math.cosh(zImag),
    Math.sin(zReal) * Math.sinh(zImag),
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
