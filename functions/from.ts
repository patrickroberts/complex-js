import { IComplex, IComplexConstructor } from '../internal/complex';
import mask from '../internal/mask';

export default function from<T extends IComplex> (Complex: IComplexConstructor<T>, z: IComplex | number, i = 0): T {
  let zReal: number;
  let zImag: number;
  let zAbs: number;
  let zArg: number;
  let zMask: mask;

  if (typeof z === 'number') {
    zReal = z;
    zImag = i;
    zAbs = NaN;
    zArg = NaN;
    zMask = mask.HAS_CARTESIAN;
  } else {
    // to prevent null values from entering into arithmetic operations
    // e.g. Complex.from(JSON.parse(text))
    zReal = z._real ?? NaN;
    zImag = z._imag ?? NaN;
    zAbs = z._abs ?? NaN;
    zArg = z._arg ?? NaN;
    zMask = z._mask;
  }

  return new Complex(zReal, zImag, zAbs, zArg, zMask);
}
