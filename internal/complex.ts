import Mask from './mask';

/** @internal */
export interface Complex {
  _real: number;
  _imag: number;
  _arg: number;
  _abs: number;
  _mask: Mask;
}

/** @internal */
export interface ComplexConstructor<T extends Complex> {
  new (real: number, imag: number, abs: number, arg: number, mask: Mask): T;
}
