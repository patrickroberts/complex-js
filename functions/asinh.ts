import { Complex, ComplexConstructor } from '../internal/complex';
import from from './from';
import log from './log';
import sqrt from './sqrt';
import square from './square';
import add from '../methods/add';

export default function asinh<T extends Complex> (Complex: ComplexConstructor<T>, z: Complex | number, imag: number = 0): T {
  const ONE = from(Complex, 1);

  const square1 = square(Complex, z, imag);
  const add1 = add(Complex, ONE, square1);
  const sqrt1 = sqrt(Complex, add1);
  const add2 = add(Complex, sqrt1, z, imag);
  const log1 = log(Complex, add2);

  return log1;
}
