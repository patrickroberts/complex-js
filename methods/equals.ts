import Complex from '../internal/complex';
import getReal from './real';
import getImag from './imag';

export default function equals (lhs: Complex, rhs: Complex | number, imag: number = 0): boolean {
  let rhsReal: number; let rhsImag: number;
  
  if (typeof rhs === 'number') {
    rhsReal = rhs; rhsImag = imag;
  } else {
    rhsReal = getReal(rhs); rhsImag = getImag(rhs);
  }

  const lhsReal = getReal(lhs);
  const lhsImag = getImag(lhs);

  return lhsReal === rhsReal && lhsImag === rhsImag;
}
