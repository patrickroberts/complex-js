import { IComplex, IComplexConstructor } from '../internal/complex';
import add from '../methods/add';
import mul from '../methods/mul';
import sub from '../methods/sub';
import from from './from';
import log from './log';

export default function atanh<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  const ONE = from(Complex, 1);
  const ONE_2 = from(Complex, 0.5);

  const add1 = add(Complex, ONE, z, i);
  const log1 = log(Complex, add1);
  const sub1 = sub(Complex, ONE, z, i);
  const log2 = log(Complex, sub1);
  const sub2 = sub(Complex, log1, log2);
  
  return mul(Complex, ONE_2, sub2);
}
