import Complex from '../internal/complex';
import Mask from '../internal/mask';
import imagImpl from '../internal/imag';

export default function imag (z: Complex): number {
  if (!(z._mask & Mask.HAS_IMAG)) {
    z._imag = imagImpl(z._abs, z._arg);
    z._mask |= Mask.HAS_IMAG;
  }

  return z._imag;
}
