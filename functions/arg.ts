import { Complex, ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import argImpl from '../internal/arg';
import getArg from '../methods/arg';

export default function arg<T extends Complex>(Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  let zArg: number;

  if (typeof z === 'number') {
    zArg = argImpl(z, imag);
  } else {
    zArg = getArg(z);
  }

  return new Complex(
    zArg,
    0,
    Math.abs(zArg),
    zArg < 0 ? Math.PI : 0,
    Mask.HAS_ALL
  );
}
