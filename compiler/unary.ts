import from from '../functions/from';
import neg from '../functions/neg';
import not from '../functions/not';

export type Unary = typeof unaryLookup;

export const unaryLookup = {
  '+': from,
  '-': neg,
  '~': not
};
