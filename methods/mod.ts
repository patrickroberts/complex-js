import trunc from '../functions/trunc';
import { IComplex, IComplexConstructor } from '../internal/complex';
import div from './div';
import mul from './mul';
import sub from './sub';

export default function mod<T extends IComplex> (Complex: IComplexConstructor<T>, lhs: IComplex, r: IComplex | number, i = 0): T {
  // lhs % rhs = lhs - (trunc(lhs / rhs) * rhs)
  const q = div(Complex, lhs, r, i);
  const p = mul(Complex, trunc(Complex, q), r, i);

  return sub(Complex, lhs, p);
}
