import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import realImpl from '../internal/realImpl';
import getReal from '../methods/getReal';

export default function real<T extends IComplex>(Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const zReal = typeof z === 'number'
    ? realImpl(z, i)
    : getReal(z);

  return new Complex(
    zReal,
    0,
    Math.abs(zReal),
    zReal < 0 ? Math.PI : 0,
    mask.HAS_ALL
  );
}
