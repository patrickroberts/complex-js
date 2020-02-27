import { IComplex } from '../internal/complex';
import getImag from './getImag';
import getReal from './getReal';

export default function equals (lhs: IComplex, r: IComplex | number, i = 0): boolean {
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

  return lhsReal === rhsReal && lhsImag === rhsImag;
}
