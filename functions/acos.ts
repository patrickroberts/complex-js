import { Complex, ComplexConstructor } from '../internal/complex';
import from from './from';
import log from './log';
import sqrt from './sqrt';
import square from './square';
import add from '../methods/add';
import sub from '../methods/sub';
import mul from '../methods/mul';

export default function acos<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  const ONE = from(Complex, 1);
  const I = from(Complex, 0, 1);
  const PI_2 = from(Complex, 0.5 * Math.PI);

  const mul1 = mul(Complex, I, z, imag);
  const square1 = square(Complex, z, imag);
  const sub1 = sub(Complex, ONE, square1);
  const sqrt1 = sqrt(Complex, sub1);
  const add1 = add(Complex, mul1, sqrt1);
  const log1 = log(Complex, add1);
  const mul2 = mul(Complex, I, log1);
  const add2 = add(Complex, PI_2, mul2);

  return add2;
}
