import argImpl from '../internal/argImpl';
import { IComplex } from '../internal/complex';
import mask from '../internal/mask';

export default function getArg (z: IComplex): number {
  if (!(z._mask & mask.HAS_ARG)) {
    z._arg = argImpl(z._real, z._imag);
    z._mask |= mask.HAS_ARG;
  }

  return z._arg;
}
