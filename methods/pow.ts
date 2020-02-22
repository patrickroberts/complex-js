import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from './real';
import getImag from './imag';
import getAbs from './abs';
import getArg from './arg';
import divImpl from './div';
import fromImpl from '../functions/from';
import squareImpl from '../functions/square';
import cubeImpl from '../functions/cube';

export default function pow<T extends Complex> (Complex: ComplexConstructor<T>, w: Complex, z: Complex | number, imag: number = 0): T {
  // z = c + di
  let c: number; let d: number;
  
  if (typeof z === 'number') {
    c = z; d = imag;
  } else {
    c = getReal(z); d = getImag(z);
  }

  if (d === 0) {
    switch (c) {
      case -1: return divImpl(Complex, fromImpl(Complex, 1), w);
      case 0: return fromImpl(Complex, 1);
      case 1: return new Complex(w._real, w._imag, w._abs, w._arg, w._mask);
      case 2: return squareImpl(Complex, w);
      case 3: return cubeImpl(Complex, w);
    }
  }

  // w = r e ** ia
  const r = getAbs(w);
  const a = getArg(w);

  // w ** z === (r ** c * e ** -ad) e ** i(d ln(r) + ac)
  // from https://en.wikipedia.org/wiki/Exponentiation#Computing_complex_powers
  const abs = Math.pow(r, c) * Math.exp(-a * d);
  const arg = d * Math.log(r) + a * c;

  return new Complex(NaN, NaN, abs, arg, Mask.HAS_POLAR);
}
