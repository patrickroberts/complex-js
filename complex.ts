import compile from './compiler/compile';
import parse from './compiler/parse';
import abs from './functions/abs';
import acos from './functions/acos';
import acosh from './functions/acosh';
import arg from './functions/arg';
import asin from './functions/asin';
import asinh from './functions/asinh';
import atan from './functions/atan';
import atanh from './functions/atanh';
import cbrt from './functions/cbrt';
import ceil from './functions/ceil';
import conj from './functions/conj';
import cos from './functions/cos';
import cosh from './functions/cosh';
import cube from './functions/cube';
import exp from './functions/exp';
import floor from './functions/floor';
import from from './functions/from';
import imag from './functions/imag';
import log from './functions/log';
import neg from './functions/neg';
import not from './functions/not';
import polar from './functions/polar';
import random from './functions/random';
import real from './functions/real';
import round from './functions/round';
import sign from './functions/sign';
import sin from './functions/sin';
import sinh from './functions/sinh';
import sqrt from './functions/sqrt';
import square from './functions/square';
import tan from './functions/tan';
import tanh from './functions/tanh';
import trunc from './functions/trunc';
import mask from './internal/mask';
import add from './methods/add';
import and from './methods/and';
import div from './methods/div';
import equals from './methods/equals';
import getAbs from './methods/getAbs';
import getArg from './methods/getArg';
import getImag from './methods/getImag';
import getReal from './methods/getReal';
import mod from './methods/mod';
import mul from './methods/mul';
import or from './methods/or';
import pow from './methods/pow';
import sal from './methods/sal';
import sar from './methods/sar';
import shr from './methods/shr';
import sub from './methods/sub';
import toString from './methods/toString';
import xor from './methods/xor';

export interface IContext {
  [identifierName: string]: Complex;
}

export type IReviver<T extends any[]> = (...args: T) => IContext;

export default class Complex {
  public static readonly '0' = Complex.from(0);
  public static readonly '1' = Complex.from(1);
  public static readonly 'I' = Complex.from(0, 1);
  public static readonly 'E' = Complex.from(Math.E);
  public static readonly 'LN2' = Complex.from(Math.LN2);
  public static readonly 'LN10' = Complex.from(Math.LN10);
  public static readonly 'LOG2E' = Complex.from(Math.LOG2E);
  public static readonly 'LOG10E' = Complex.from(Math.LOG10E);
  public static readonly 'PI' = Complex.from(Math.PI);
  public static readonly 'SQRT1_2' = Complex.from(Math.SQRT1_2);
  public static readonly 'SQRT2' = Complex.from(Math.SQRT2);

  public static from (r: number, i?: number): Complex;
  public static from (z: Complex | number): Complex;
  public static from (z: Complex | number, i?: number): Complex {
    return from(Complex, z, i);
  }

  public static cartesian (r: number, i = 0): Complex {
    return new Complex(r, i, NaN, NaN, mask.HAS_CARTESIAN);
  }

  public static polar (abs: number, arg?: number): Complex {
    return polar(Complex, abs, arg);
  }

  public static real (z: Complex | number): Complex;
  public static real (r: number, i?: number): Complex;
  public static real (z: Complex | number, i?: number): Complex {
    return real(Complex, z, i);
  }

  public static imag (z: Complex | number): Complex;
  public static imag (r: number, i?: number): Complex;
  public static imag (z: Complex | number, i?: number): Complex {
    return imag(Complex, z, i);
  }

  public static abs (z: Complex | number): Complex;
  public static abs (r: number, i?: number): Complex;
  public static abs (z: Complex | number, i?: number): Complex {
    return abs(Complex, z, i);
  }

  public static arg (z: Complex | number): Complex;
  public static arg (r: number, i?: number): Complex;
  public static arg (z: Complex | number, i?: number): Complex {
    return arg(Complex, z, i);
  }

  public static neg (z: Complex | number): Complex;
  public static neg (r: number, i?: number): Complex;
  public static neg (z: Complex | number, i?: number): Complex {
    return neg(Complex, z, i);
  }

  public static conj (z: Complex | number): Complex;
  public static conj (r: number, i?: number): Complex;
  public static conj (z: Complex | number, i?: number): Complex {
    return conj(Complex, z, i);
  }

  public static floor (z: Complex | number): Complex;
  public static floor (r: number, i?: number): Complex;
  public static floor (z: Complex | number, i?: number): Complex {
    return floor(Complex, z, i);
  }

  public static ceil (z: Complex | number): Complex;
  public static ceil (r: number, i?: number): Complex;
  public static ceil (z: Complex | number, i?: number): Complex {
    return ceil(Complex, z, i);
  }

  public static round (z: Complex | number): Complex;
  public static round (r: number, i?: number): Complex;
  public static round (z: Complex | number, i?: number): Complex {
    return round(Complex, z, i);
  }

  public static sign (z: Complex | number): Complex;
  public static sign (r: number, i?: number): Complex;
  public static sign (z: Complex | number, i?: number): Complex {
    return sign(Complex, z, i);
  }

  public static trunc (z: Complex | number): Complex;
  public static trunc (r: number, i?: number): Complex;
  public static trunc (z: Complex | number, i?: number): Complex {
    return trunc(Complex, z, i);
  }

  public static not (z: Complex | number): Complex;
  public static not (r: number, i?: number): Complex;
  public static not (z: Complex | number, i?: number): Complex {
    return not(Complex, z, i);
  }

  public static random (): Complex {
    return random(Complex);
  }

  public static sqrt (z: Complex | number): Complex;
  public static sqrt (r: number, i?: number): Complex;
  public static sqrt (z: Complex | number, i?: number): Complex {
    return sqrt(Complex, z, i);
  }

  public static cbrt (z: Complex | number): Complex;
  public static cbrt (r: number, i?: number): Complex;
  public static cbrt (z: Complex | number, i?: number): Complex {
    return cbrt(Complex, z, i);
  }

  public static square (z: Complex | number): Complex;
  public static square (r: number, i?: number): Complex;
  public static square (z: Complex | number, i?: number): Complex {
    return square(Complex, z, i);
  }

  public static cube (z: Complex | number): Complex;
  public static cube (r: number, i?: number): Complex;
  public static cube (z: Complex | number, i?: number): Complex {
    return cube(Complex, z, i);
  }

  public static exp (z: Complex | number): Complex;
  public static exp (r: number, i?: number): Complex;
  public static exp (z: Complex | number, i?: number): Complex {
    return exp(Complex, z, i);
  }

  public static log (z: Complex | number): Complex;
  public static log (r: number, i?: number): Complex;
  public static log (z: Complex | number, i?: number): Complex {
    return log(Complex, z, i);
  }

  public static cos (z: Complex | number): Complex;
  public static cos (r: number, i?: number): Complex;
  public static cos (z: Complex | number, i?: number): Complex {
    return cos(Complex, z, i);
  }

  public static sin (z: Complex | number): Complex;
  public static sin (r: number, i?: number): Complex;
  public static sin (z: Complex | number, i?: number): Complex {
    return sin(Complex, z, i);
  }

  public static tan (z: Complex | number): Complex;
  public static tan (r: number, i?: number): Complex;
  public static tan (z: Complex | number, i?: number): Complex {
    return tan(Complex, z, i);
  }

  public static acos (z: Complex | number): Complex;
  public static acos (r: number, i?: number): Complex;
  public static acos (z: Complex | number, i?: number): Complex {
    return acos(Complex, z, i);
  }

  public static asin (z: Complex | number): Complex;
  public static asin (r: number, i?: number): Complex;
  public static asin (z: Complex | number, i?: number): Complex {
    return asin(Complex, z, i);
  }

  public static atan (z: Complex | number): Complex;
  public static atan (r: number, i?: number): Complex;
  public static atan (z: Complex | number, i?: number): Complex {
    return atan(Complex, z, i);
  }

  public static cosh (z: Complex | number): Complex;
  public static cosh (r: number, i?: number): Complex;
  public static cosh (z: Complex | number, i?: number): Complex {
    return cosh(Complex, z, i);
  }

  public static sinh (z: Complex | number): Complex;
  public static sinh (r: number, i?: number): Complex;
  public static sinh (z: Complex | number, i?: number): Complex {
    return sinh(Complex, z, i);
  }

  public static tanh (z: Complex | number): Complex;
  public static tanh (r: number, i?: number): Complex;
  public static tanh (z: Complex | number, i?: number): Complex {
    return tanh(Complex, z, i);
  }

  public static acosh (z: Complex | number): Complex;
  public static acosh (r: number, i?: number): Complex;
  public static acosh (z: Complex | number, i?: number): Complex {
    return acosh(Complex, z, i);
  }

  public static asinh (z: Complex | number): Complex;
  public static asinh (r: number, i?: number): Complex;
  public static asinh (z: Complex | number, i?: number): Complex {
    return asinh(Complex, z, i);
  }

  public static atanh (z: Complex | number): Complex;
  public static atanh (r: number, i?: number): Complex;
  public static atanh (z: Complex | number, i?: number): Complex {
    return atanh(Complex, z, i);
  }

  public static parse (text: string, context?: IContext): Complex {
    return parse(Complex, text, context);
  }

  public static compile (text: string): () => Complex;
  public static compile<T extends any[]> (text: string, reviver: IReviver<T>): (...args: T) => Complex;
  public static compile<T extends any[]> (text: string, reviver?: IReviver<T>): (...args: T) => Complex {
    return compile(Complex, text, reviver);
  }

  /**
   * @internal
   */
  public _real: number;
  /**
   * @internal
   */
  public _imag: number;
  /**
   * @internal
   */
  public _abs: number;
  /**
   * @internal
   */
  public _arg: number;
  /**
   * @internal
   */
  public _mask: mask;

  /**
   * @internal
   */
  public constructor (_real: number, _imag: number, _abs: number, _arg: number, _mask: mask) {
    // coerce -0 to +0
    this._real = _real + 0;
    this._imag = _imag + 0;
    this._abs = _abs + 0;
    // choose branch cut as the interval (-pi, pi]
    const d = 2 * Math.PI;
    this._arg = Math.PI - (3 * Math.PI - _arg % d) % d;
    this._mask = _mask;
  }

  public get real (): number {
    return getReal(this);
  }

  public get imag (): number {
    return getImag(this);
  }

  public get abs (): number {
    return getAbs(this);
  }

  public get arg (): number {
    return getArg(this);
  }

  public toString (format?: string): string {
    return toString(this, format);
  }

  public equals (rhs: Complex | number): boolean;
  public equals (r: number, i?: number): boolean;
  public equals (r: Complex | number, i?: number): boolean {
    return equals(this, r, i);
  }

  public add (rhs: Complex | number): Complex;
  public add (r: number, i?: number): Complex;
  public add (r: Complex | number, i?: number): Complex {
    return add(Complex, this, r, i);
  }

  public sub (rhs: Complex | number): Complex;
  public sub (r: number, i?: number): Complex;
  public sub (r: Complex | number, i?: number): Complex {
    return sub(Complex, this, r, i);
  }

  public mul (rhs: Complex | number): Complex;
  public mul (r: number, i?: number): Complex;
  public mul (r: Complex | number, i?: number): Complex {
    return mul(Complex, this, r, i);
  }

  public div (rhs: Complex | number): Complex;
  public div (r: number, i?: number): Complex;
  public div (r: Complex | number, i?: number): Complex {
    return div(Complex, this, r, i);
  }

  public mod (rhs: Complex | number): Complex;
  public mod (r: number, i?: number): Complex;
  public mod (r: Complex | number, i?: number): Complex {
    return mod(Complex, this, r, i);
  }

  public pow (rhs: Complex | number): Complex;
  public pow (r: number, i?: number): Complex;
  public pow (r: Complex | number, i?: number): Complex {
    return pow(Complex, this, r, i);
  }

  public and (rhs: Complex | number): Complex;
  public and (r: number, i?: number): Complex;
  public and (r: Complex | number, i?: number): Complex {
    return and(Complex, this, r, i);
  }

  public or (rhs: Complex | number): Complex;
  public or (r: number, i?: number): Complex;
  public or (r: Complex | number, i?: number): Complex {
    return or(Complex, this, r, i);
  }

  public xor (rhs: Complex | number): Complex;
  public xor (r: number, i?: number): Complex;
  public xor (r: Complex | number, i?: number): Complex {
    return xor(Complex, this, r, i);
  }

  public sal (rhs: Complex | number): Complex;
  public sal (r: number, i?: number): Complex;
  public sal (r: Complex | number, i?: number): Complex {
    return sal(Complex, this, r, i);
  }
  public shl (rhs: Complex | number): Complex;
  public shl (r: number, i?: number): Complex;
  public shl (r: Complex | number, i?: number): Complex {
    return sal(Complex, this, r, i);
  }

  public sar (rhs: Complex | number): Complex;
  public sar (r: number, i?: number): Complex;
  public sar (r: Complex | number, i?: number): Complex {
    return sar(Complex, this, r, i);
  }

  public shr (rhs: Complex | number): Complex;
  public shr (r: number, i?: number): Complex;
  public shr (r: Complex | number, i?: number): Complex {
    return shr(Complex, this, r, i);
  }
}
