import { IComplex } from '../internal/complex';
import imagImpl from '../internal/imagImpl';
import mask from '../internal/mask';

export default function getImag (z: IComplex): number {
  if (!(z._mask & mask.HAS_IMAG)) {
    z._imag = imagImpl(z._abs, z._arg);
    z._mask |= mask.HAS_IMAG;
  }

  return z._imag;
}
