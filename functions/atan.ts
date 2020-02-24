import { Complex, ComplexConstructor } from '../internal/complex';
import from from './from';
import log from './log';
import add from '../methods/add';
import sub from '../methods/sub';
import mul from '../methods/mul';

export default function atan<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  const ONE = from(Complex, 1);
  const I = from(Complex, 0, 1);
  const I_2 = from(Complex, 0, 0.5);

  const mul1 = mul(Complex, I, z, imag);
  const sub1 = sub(Complex, ONE, mul1);
  const log1 = log(Complex, sub1);
  const add1 = add(Complex, ONE, mul1);
  const log2 = log(Complex, add1);
  const sub2 = sub(Complex, log1, log2);
  const mul2 = mul(Complex, I_2, sub2);

  return mul2;
}
