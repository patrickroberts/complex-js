import absImpl from '../internal/absImpl';
import { IComplex } from '../internal/complex';
import mask from '../internal/mask';

export default function getAbs (z: IComplex): number {
  if (!(z._mask & mask.HAS_ABS)) {
    z._abs = absImpl(z._real, z._imag);
    z._mask |= mask.HAS_ABS;
  }

  return z._abs;
}
