import { Complex, _real, _imag, _arg, _mask } from '../internal/complex';
import Mask from '../internal/mask';
import argImpl from '../internal/arg';

export default function arg (z: Complex): number {
  if (!(z[_mask] & Mask.HAS_ARG)) {
    z[_arg] = argImpl(z[_real], z[_imag]);
    z[_mask] |= Mask.HAS_ARG;
  }

  return z[_arg];
}
