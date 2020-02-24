import { Complex, ComplexConstructor } from '../internal/complex';
import from from './from';
import log from './log';
import add from '../methods/add';
import sub from '../methods/sub';
import mul from '../methods/mul';

export default function atanh<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  const ONE = from(Complex, 1);
  const ONE_2 = from(Complex, 0.5);

  const add1 = add(Complex, ONE, z, imag);
  const log1 = log(Complex, add1);
  const sub1 = sub(Complex, ONE, z, imag);
  const log2 = log(Complex, sub1);
  const sub2 = sub(Complex, log1, log2);
  const mul1 = mul(Complex, ONE_2, sub2);

  return mul1;
}
