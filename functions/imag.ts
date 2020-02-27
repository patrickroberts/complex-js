import { IComplex, IComplexConstructor } from '../internal/complex';
import imagImpl from '../internal/imagImpl';
import mask from '../internal/mask';
import getImag from '../methods/getImag';

export default function imag<T extends IComplex>(Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const zImag: number = typeof z === 'number'
    ? imagImpl(z, i)
    : getImag(z);

  return new Complex(
    zImag,
    0,
    Math.abs(zImag),
    zImag < 0 ? Math.PI : 0,
    mask.HAS_ALL
  );
}
