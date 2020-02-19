import Complex, { ComplexConstructor } from '../internal/complex';
import Mask from '../internal/mask';
import getReal from './real';
import getImag from './imag';

export default function and<T extends Complex> (Complex: ComplexConstructor<T>, lhs: Complex, rhs: Complex | number, imag: number = 0): T {
  let rhsReal: number; let rhsImag: number;

  if (typeof rhs === 'number') {
    rhsReal = rhs; rhsImag = imag;
  } else {
    rhsReal = getReal(rhs); rhsImag = getImag(rhs);
  }

  const lhsReal = getReal(lhs);
  const lhsImag = getImag(lhs);
  
  return new Complex(lhsReal & rhsReal, lhsImag & rhsImag, NaN, NaN, Mask.HAS_CARTESIAN);
}
