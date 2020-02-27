import { IComplex, IComplexConstructor } from '../internal/complex';
import add from '../methods/add';
import mul from '../methods/mul';
import sub from '../methods/sub';
import from from './from';
import log from './log';

export default function atan<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const ONE = from(Complex, 1);
  const I = from(Complex, 0, 1);
  const I_2 = from(Complex, 0, 0.5);

  const mul1 = mul(Complex, I, z, i);
  const sub1 = sub(Complex, ONE, mul1);
  const log1 = log(Complex, sub1);
  const add1 = add(Complex, ONE, mul1);
  const log2 = log(Complex, add1);
  const sub2 = sub(Complex, log1, log2);
  
  return mul(Complex, I_2, sub2);
}
