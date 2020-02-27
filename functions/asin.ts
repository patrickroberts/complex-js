import { IComplex, IComplexConstructor } from '../internal/complex';
import add from '../methods/add';
import mul from '../methods/mul';
import sub from '../methods/sub';
import from from './from';
import log from './log';
import sqrt from './sqrt';
import square from './square';

export default function asin<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const ONE = from(Complex, 1);
  const I = from(Complex, 0, 1);
  const NEG_I = from(Complex, 0, -1);

  const mul1 = mul(Complex, I, z, i);
  const square1 = square(Complex, z, i);
  const sub1 = sub(Complex, ONE, square1);
  const sqrt1 = sqrt(Complex, sub1);
  const add1 = add(Complex, mul1, sqrt1);
  const log1 = log(Complex, add1);
  
  return mul(Complex, NEG_I, log1);
}
