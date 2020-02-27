import { IComplex, IComplexConstructor } from '../internal/complex';
import { Reviver } from './expressions';
import generate from './generate';

export default function compile<T extends IComplex, U extends any[]>(
  Complex: IComplexConstructor<T>,
  text: string,
  reviver?: Reviver<T, U>
): (...args: U) => T {
  const variable = generate(Complex, text);

  return (...args): T => variable(reviver?.(...args) ?? {});
}
