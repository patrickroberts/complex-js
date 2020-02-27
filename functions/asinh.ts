import { IComplex, IComplexConstructor } from '../internal/complex';
import add from '../methods/add';
import from from './from';
import log from './log';
import sqrt from './sqrt';
import square from './square';

export default function asinh<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const ONE = from(Complex, 1);

  const square1 = square(Complex, z, i);
  const add1 = add(Complex, ONE, square1);
  const sqrt1 = sqrt(Complex, add1);
  const add2 = add(Complex, sqrt1, z, i);
  
  return log(Complex, add2);
}
