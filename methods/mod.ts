import Complex, { ComplexConstructor } from '../internal/complex';
import truncImpl from '../functions/trunc';
import divImpl from './div';
import mulImpl from './mul';
import subImpl from './sub';

export default function mod<T extends Complex> (Complex: ComplexConstructor<T>, dividend: Complex, divisor: Complex | number, imag: number = 0): T {
  // dividend % divisor = dividend - (trunc(dividend / divisor) * divisor)
  const q = divImpl(Complex, dividend, divisor, imag);
  const p = mulImpl(Complex, truncImpl(Complex, q), divisor, imag);

  return subImpl(Complex, dividend, p);
}
