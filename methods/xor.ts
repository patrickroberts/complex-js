import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';
import getImag from './getImag';
import getReal from './getReal';

export default function xor<T extends IComplex> (Complex: IComplexConstructor<T>, lhs: IComplex, r: IComplex | number, i = 0): T {
  let rhsReal: number;
  let rhsImag: number;

  if (typeof r === 'number') {
    rhsReal = r;
    rhsImag = i;
  } else {
    rhsReal = getReal(r);
    rhsImag = getImag(r);
  }

  const lhsReal = getReal(lhs);
  const lhsImag = getImag(lhs);

  return new Complex(
    lhsReal ^ rhsReal,
    lhsImag ^ rhsImag,
    NaN,
    NaN,
    mask.HAS_CARTESIAN
  );
}
