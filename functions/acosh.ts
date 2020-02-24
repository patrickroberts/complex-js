import { Complex, ComplexConstructor } from '../internal/complex';
import from from './from';
import log from './log';
import sqrt from './sqrt';
import add from '../methods/add';
import mul from '../methods/mul';

export default function acosh<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  const ONE = from(Complex, 1);
  const NEG_ONE = from(Complex, -1);

  const add1 = add(Complex, NEG_ONE, z, imag);
  const sqrt1 = sqrt(Complex, add1);
  const add2 = add(Complex, ONE, z, imag);
  const sqrt2 = sqrt(Complex, add2);
  const mul1 = mul(Complex, sqrt1, sqrt2);
  const add3 = add(Complex, mul1, z, imag);
  const log1 = log(Complex, add3);

  return log1;
}
