import { Complex } from '../internal/complex';
import Mask from '../internal/mask';
import realImpl from '../internal/real';

export default function getReal (z: Complex): number {
  if (!(z._mask & Mask.HAS_REAL)) {
    z._real = realImpl(z._abs, z._arg);
    z._mask |= Mask.HAS_REAL;
  }

  return z._real;
}
