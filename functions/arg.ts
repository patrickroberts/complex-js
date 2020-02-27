import argImpl from '../internal/argImpl';
import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getArg from '../methods/getArg';

export default function arg<T extends IComplex>(Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const zArg = typeof z === 'number'
    ? argImpl(z, i)
    : getArg(z);

  return new Complex(
    zArg,
    0,
    Math.abs(zArg),
    zArg < 0 ? Math.PI : 0,
    mask.HAS_ALL
  );
}
