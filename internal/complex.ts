import mask from './mask';

export interface IComplex {
  _real: number;
  _imag: number;
  _arg: number;
  _abs: number;
  _mask: mask;
}

export type IComplexConstructor<T extends IComplex> = new (real: number, imag: number, abs: number, arg: number, mask: mask) => T;
