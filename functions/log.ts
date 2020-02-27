import absImpl from '../internal/absImpl';
import argImpl from '../internal/argImpl';
import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getAbs from '../methods/getAbs';
import getArg from '../methods/getArg';

export default function log<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
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
    Math.log(zAbs),
    zArg,
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
