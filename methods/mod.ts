import { Complex, ComplexConstructor } from '../internal/complex';
import trunc from '../functions/trunc';
import div from './div';
import mul from './mul';
import sub from './sub';

export default function mod<T extends Complex> (Complex: ComplexConstructor<T>, dividend: Complex, divisor: Complex | number, imag: number = 0): T {
  // dividend % divisor = dividend - (trunc(dividend / divisor) * divisor)
  const q = div(Complex, dividend, divisor, imag);
  const p = mul(Complex, trunc(Complex, q), divisor, imag);

  return sub(Complex, dividend, p);
}
