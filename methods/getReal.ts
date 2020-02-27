import { IComplex } from '../internal/complex';
import mask from '../internal/mask';
import realImpl from '../internal/realImpl';

export default function getReal (z: IComplex): number {
  if (!(z._mask & mask.HAS_REAL)) {
    z._real = realImpl(z._abs, z._arg);
    z._mask |= mask.HAS_REAL;
  }

  return z._real;
}
