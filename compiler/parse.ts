import { IComplex, IComplexConstructor } from '../internal/complex';
import { IContext } from './expressions';
import generate from './generate';

export default function parse<T extends IComplex>(Complex: IComplexConstructor<T>, text: string, context?: IContext<T>): T {
  const variable = generate(Complex, text);

  return variable(context!);
}
