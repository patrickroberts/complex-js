import absImpl from '../internal/absImpl';
import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getAbs from '../methods/getAbs';

export default function abs<T extends IComplex>(Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const zAbs: number = typeof z === 'number'
    ? absImpl(z, i)
    : getAbs(z);

  return new Complex(zAbs, 0, zAbs, 0, mask.HAS_ALL);
}
