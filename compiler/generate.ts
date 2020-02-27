import { Grammar, Parser } from 'nearley';
import { IComplex, IComplexConstructor } from '../internal/complex';
import { Expression, Variable } from './expressions';
import grammar from './grammar';

const rules = Grammar.fromCompiled(grammar);

export default function generate<T extends IComplex>(Complex: IComplexConstructor<T>, text: string): Variable<T> {
  const parser = new Parser(rules);
  const { results } = parser.feed(text);

  switch (results.length) {
    case 0:
      throw new Error('Unexpected end of input');
    case 1:
      const [expression]: Expression[] = results;
      return expression(Complex);
    default:
      throw new Error('Ambiguous grammar');
  }
}
