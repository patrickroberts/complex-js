import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from '../methods/getImag';
import getReal from '../methods/getReal';

export default function not<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number;
  let zImag: number;

  if (typeof z === 'number') {
    zReal = z;
    zImag = i;
  } else {
    zReal = getReal(z);
    zImag = getImag(z);
  }

  return new Complex(~zReal, ~zImag, NaN, NaN, mask.HAS_CARTESIAN);
}
