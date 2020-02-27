import from from '../functions/from';
import { IComplex, IComplexConstructor } from '../internal/complex';
import { Binary, binaryLookup } from './binary';
import { callLookup } from './call';
import { Unary, unaryLookup } from './unary';

export interface IContext<T extends IComplex> {
  [identifierName: string]: T;
}

export type Variable<T extends IComplex> = (context: IContext<T>) => T;

type Constant<T extends IComplex> = () => T;

export type Reviver<T extends IComplex, U extends any[]> = (...args: U) => IContext<T>;

function isConstant<T extends IComplex>(param: Variable<T>): param is Constant<T> {
  return param.length === 0;
}

function areConstant<T extends IComplex>(params: Variable<T>[]): params is Constant<T>[] {
  return params.every(isConstant);
}

export type Expression = <T extends IComplex>(Complex: IComplexConstructor<T>) => Variable<T>;

export const literal = (data: unknown[]): Expression => {
  const [numericLiteral] = data;
  const { text } = numericLiteral as { text: string };

  return <T extends IComplex>(Complex: IComplexConstructor<T>): Constant<T> => {
    const z = from(Complex, Number(text));
    return (): T => z;
  };
};

function isIndex<T>(key: string | number | symbol, lookup: T): key is keyof T {
  const o = Object(lookup);
  return key in o && o[key] !== undefined;
}

function throwInvalidIdentifierName(name: string): never {
  throw new ReferenceError(`${name} is not defined`);
}

export const identifier = (data: unknown[]): Expression => {
  const [identifierName] = data;
  const { text } = identifierName as { text: string };

  return <T extends IComplex>() => (context: IContext<T>): T => {
    if (!isIndex(text, context)) {
      throwInvalidIdentifierName(text);
    }

    return context[text];
  };
};

function throwInvalidCallExpression(name: string): never {
  throw new ReferenceError(`${name} is not a function`);
}

function concat<T, U>(t: T, u: U[]): [T, ...U[]] {
  return [t as T | U].concat(u) as [T, ...U[]];
}

export const call = (data: unknown[]): Expression => {
  const [identifierName, , expressions] = data;
  const { text } = identifierName as { text: string };

  if (!isIndex(text, callLookup)) {
    throwInvalidCallExpression(text);
  }

  return <T extends IComplex>(Complex: IComplexConstructor<T>): Variable<T> => {
    const fn = callLookup[text] as (Complex: IComplexConstructor<T>, ...args: T[]) => T;
    const variables = (expressions as Expression[]).map(expression => expression(Complex));

    if (areConstant(variables)) {
      const args = concat(
        Complex,
        variables.map(
          constant => constant()
        )
      );
      const z = fn(...args);

      return (): T => z;
    }

    return (context: IContext<T>): T => {
      const args = concat(
        Complex,
        variables.map(
          variable => variable(context)
        )
      );

      return fn(...args);
    };
  };
};

export const unary = (data: unknown[]): Expression => {
  const [punctuator, , expression] = data;

  return <T extends IComplex>(Complex: IComplexConstructor<T>): Variable<T> => {
    const fn = unaryLookup[punctuator as keyof Unary];
    const variable: Variable<T> = (expression as Expression)(Complex);

    if (isConstant(variable)) {
      const z = fn(Complex, variable());

      return (): T => z;
    }

    return (context: IContext<T>): T => fn(Complex, variable(context));
  };
};

export const binary = (data: unknown[]): Expression => {
  const [lhsExpression, , punctuator, , rhsExpression] = data;

  return <T extends IComplex>(Complex: IComplexConstructor<T>): Variable<T> => {
    const fn = binaryLookup[punctuator as keyof Binary];
    const lhs: Variable<T> = (lhsExpression as Expression)(Complex);
    const rhs: Variable<T> = (rhsExpression as Expression)(Complex);

    if (isConstant(lhs) && isConstant(rhs)) {
      const z = fn(Complex, lhs(), rhs());

      return (): T => z;
    }

    return (context: IContext<T>): T => fn(Complex, lhs(context), rhs(context));
  };
};
