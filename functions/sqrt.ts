import absImpl from '../internal/absImpl';
import argImpl from '../internal/argImpl';
import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getAbs from '../methods/getAbs';
import getArg from '../methods/getArg';

export default function sqrt<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zAbs: number;
  let zArg: number;

  if (typeof z === 'number') {
    zAbs = absImpl(z, i);
    zArg = argImpl(z, i);
  } else {
    zAbs = getAbs(z);
    zArg = getArg(z);
  }

  return new Complex(
    NaN,
    NaN,
    Math.sqrt(zAbs),
    0.5 * zArg,
    mask.HAS_POLAR
  );
}
