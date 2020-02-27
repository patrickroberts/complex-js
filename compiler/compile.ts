import { IComplex, IComplexConstructor } from '../internal/complex';
import { Reviver } from './expressions';
import generate from './generate';

export default function compile<T extends IComplex, U extends any[]>(
  Complex: IComplexConstructor<T>,
  text: string,
  reviver?: Reviver<T, U>
): (...args: U) => T {
  const variable = generate(Complex, text);

  if (reviver) {
    return (...args): T => variable(reviver(...args));
  }

  const z = variable({});

  return () => z;
}
