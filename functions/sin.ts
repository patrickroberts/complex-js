import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function sin<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
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
    const zSin = Math.sin(zReal);

    return new Complex(
      zSin,
      0,
      Math.abs(zSin),
      zSin < 0 ? Math.PI : 0,
      mask.HAS_ALL
    );
  }

  if (zReal === 0) {
    const zSin = Math.sinh(zImag);

    return new Complex(
      0,
      zSin,
      Math.abs(zSin),
      (zSin < 0 ? -0.5 : 0.5) * Math.PI,
      mask.HAS_ALL
    );
  }

  return new Complex(
    Math.sin(zReal) * Math.cosh(zImag),
    Math.cos(zReal) * Math.sinh(zImag),
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
