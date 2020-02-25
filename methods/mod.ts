import { Complex, ComplexConstructor } from '../internal/complex';
import trunc from '../functions/trunc';
import div from './div';
import mul from './mul';
import sub from './sub';

export default function mod<T extends Complex> (Complex: ComplexConstructor<T>, lhs: Complex, rhs: Complex | number, imag: number = 0): T {
  // lhs % rhs = lhs - (trunc(lhs / rhs) * rhs)
  const q = div(Complex, lhs, rhs, imag);
  const p = mul(Complex, trunc(Complex, q), rhs, imag);

  return sub(Complex, lhs, p);
}
