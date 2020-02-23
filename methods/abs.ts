import { Complex, _real, _imag, _abs, _mask } from '../internal/complex';
import Mask from '../internal/mask';
import absImpl from '../internal/abs';

export default function abs (z: Complex): number {
  if (!(z[_mask] & Mask.HAS_ABS)) {
    z[_abs] = absImpl(z[_real], z[_imag]);
    z[_mask] |= Mask.HAS_ABS;
  }

  return z[_abs];
}
