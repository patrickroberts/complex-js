import Mask from './mask';

const symbolIsImplemented = typeof Symbol === 'function';

export const _real: '_real' = symbolIsImplemented ? Symbol('_real') as any : '_real';
export const _imag: '_imag' = symbolIsImplemented ? Symbol('_imag') as any : '_imag';
export const _abs: '_abs' = symbolIsImplemented ? Symbol('_abs') as any : '_abs';
export const _arg: '_arg' = symbolIsImplemented ? Symbol('_arg') as any : '_arg';
export const _mask: '_mask' = symbolIsImplemented ? Symbol('_mask') as any : '_mask';

/** @internal */
export interface Complex {
  [_real]: number;
  [_imag]: number;
  [_arg]: number;
  [_abs]: number;
  [_mask]: Mask;
}

/** @internal */
export interface ComplexConstructor<T extends Complex> {
  new (real: number, imag: number, abs: number, arg: number, mask: Mask): T;
}
