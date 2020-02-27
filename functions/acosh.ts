import { IComplex, IComplexConstructor } from '../internal/complex';
import add from '../methods/add';
import mul from '../methods/mul';
import from from './from';
import log from './log';
import sqrt from './sqrt';

export default function acosh<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const ONE = from(Complex, 1);
  const NEG_ONE = from(Complex, -1);

  const add1 = add(Complex, NEG_ONE, z, i);
  const sqrt1 = sqrt(Complex, add1);
  const add2 = add(Complex, ONE, z, i);
  const sqrt2 = sqrt(Complex, add2);
  const mul1 = mul(Complex, sqrt1, sqrt2);
  const add3 = add(Complex, mul1, z, i);
  
  return log(Complex, add3);
}
