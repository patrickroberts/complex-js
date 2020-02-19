import Mask from './internal/mask';
import realImpl from './methods/real';
import imagImpl from './methods/imag';
import absImpl from './methods/abs';
import argImpl from './methods/arg';
import fromImpl from './functions/from';
import polarImpl from './functions/polar';
import negImpl from './functions/neg';
import conjImpl from './functions/conj';
import signImpl from './functions/sign';
import ceilImpl from './functions/ceil';
import floorImpl from './functions/floor';
import roundImpl from './functions/round';
import truncImpl from './functions/trunc';
import notImpl from './functions/not';
import randomImpl from './functions/random';
import squareImpl from './functions/square';
import cubeImpl from './functions/cube';
import expImpl from './functions/exp';
import logImpl from './functions/log';
import cosImpl from './functions/cos';
import sinImpl from './functions/sin';
import tanImpl from './functions/tan';
import secImpl from './functions/sec';
import cscImpl from './functions/csc';
import cotImpl from './functions/cot';
import toStringImpl from './methods/toString';
import addImpl from './methods/add';
import subImpl from './methods/sub';
import mulImpl from './methods/mul';
import divImpl from './methods/div';
import modImpl from './methods/mod';
import powImpl from './methods/pow';
import andImpl from './methods/and';
import orImpl from './methods/or';
import xorImpl from './methods/xor';
import salImpl from './methods/sal';
import sarImpl from './methods/sar';
import shrImpl from './methods/shr';

export default class Complex {
  /** @internal */
  public constructor (real: number, imag: number, abs: number, arg: number, mask: Mask) {
    // coerce -0 to +0
    if (mask & Mask.HAS_REAL) real += 0;
    if (mask & Mask.HAS_IMAG) imag += 0;
    if (mask & Mask.HAS_ABS) abs += 0;
    // choose branch cut as the interval (-pi, pi]
    if (mask & Mask.HAS_ARG) arg = Math.PI - ((Math.PI - arg) % (Math.PI * 2));

    this._real = real;
    this._imag = imag;
    this._abs = abs;
    this._arg = arg;
    this._mask = mask;
  }

  /** @internal */
  public _real: number;
  /** @internal */
  public _imag: number;
  /** @internal */
  public _abs: number;
  /** @internal */
  public _arg: number;
  /** @internal */
  public _mask: Mask;

  public get real (): number {
    return realImpl(this);
  }

  public get imag (): number {
    return imagImpl(this);
  }

  public get abs (): number {
    return absImpl(this);
  }

  public get arg (): number {
    return argImpl(this);
  }

  public static readonly '0' = Complex.from(0);
  public static readonly '1' = Complex.from(1);
  public static readonly 'I' = Complex.from(0, 1);
  public static readonly 'E' = Complex.from(Math.E);
  public static readonly 'PI' = Complex.from(Math.PI);

  public static from (real: number, imag?: number): Complex;
  public static from (z: Complex | number): Complex;
  public static from (z: Complex | number, imag?: number): Complex {
    return fromImpl(Complex, z, imag);
  }

  public static cartesian (real: number, imag: number = 0): Complex {
    return new Complex(real, imag, NaN, NaN, Mask.HAS_CARTESIAN);
  }

  public static polar (abs: number, arg?: number): Complex {
    return polarImpl(Complex, abs, arg);
  }

  public static neg (z: Complex | number): Complex;
  public static neg (real: number, imag?: number): Complex;
  public static neg (z: Complex | number, imag?: number): Complex {
    return negImpl(Complex, z, imag);
  }
  public static '-' (z: Complex | number): Complex;
  public static '-' (real: number, imag?: number): Complex;
  public static '-' (z: Complex | number, imag?: number): Complex {
    return negImpl(Complex, z, imag);
  }

  public static conj (z: Complex | number): Complex;
  public static conj (real: number, imag?: number): Complex;
  public static conj (z: Complex | number, imag?: number): Complex {
    return conjImpl(Complex, z, imag);
  }

  public static floor (z: Complex | number): Complex;
  public static floor (real: number, imag?: number): Complex;
  public static floor (z: Complex | number, imag?: number): Complex {
    return floorImpl(Complex, z, imag);
  }

  public static ceil (z: Complex | number): Complex;
  public static ceil (real: number, imag?: number): Complex;
  public static ceil (z: Complex | number, imag?: number): Complex {
    return ceilImpl(Complex, z, imag);
  }

  public static round (z: Complex | number): Complex;
  public static round (real: number, imag?: number): Complex;
  public static round (z: Complex | number, imag?: number): Complex {
    return roundImpl(Complex, z, imag);
  }

  public static sign (z: Complex | number): Complex;
  public static sign (real: number, imag?: number): Complex;
  public static sign (z: Complex | number, imag?: number): Complex {
    return signImpl(Complex, z, imag);
  }

  public static trunc (z: Complex | number): Complex;
  public static trunc (real: number, imag?: number): Complex;
  public static trunc (z: Complex | number, imag?: number): Complex {
    return truncImpl(Complex, z, imag);
  }

  public static not (z: Complex | number): Complex;
  public static not (real: number, imag?: number): Complex;
  public static not (z: Complex | number, imag?: number): Complex {
    return notImpl(Complex, z, imag);
  }
  public static '~' (z: Complex | number): Complex;
  public static '~' (real: number, imag?: number): Complex;
  public static '~' (z: Complex | number, imag?: number): Complex {
    return notImpl(Complex, z, imag);
  }

  public static random (): Complex {
    return randomImpl(Complex);
  }

  public static square (z: Complex | number): Complex;
  public static square (real: number, imag?: number): Complex;
  public static square (z: Complex | number, imag?: number): Complex {
    return squareImpl(Complex, z, imag);
  }

  public static cube (z: Complex | number): Complex;
  public static cube (real: number, imag?: number): Complex;
  public static cube (z: Complex | number, imag?: number): Complex {
    return cubeImpl(Complex, z, imag);
  }

  public static exp (z: Complex | number): Complex;
  public static exp (real: number, imag?: number): Complex;
  public static exp (z: Complex | number, imag?: number): Complex {
    return expImpl(Complex, z, imag);
  }

  public static log (z: Complex | number): Complex;
  public static log (real: number, imag?: number): Complex;
  public static log (z: Complex | number, imag?: number): Complex {
    return logImpl(Complex, z, imag);
  }

  public static cos (z: Complex | number): Complex;
  public static cos (real: number, imag?: number): Complex;
  public static cos (z: Complex | number, imag?: number): Complex {
    return cosImpl(Complex, z, imag);
  }

  public static sin (z: Complex | number): Complex;
  public static sin (real: number, imag?: number): Complex;
  public static sin (z: Complex | number, imag?: number): Complex {
    return sinImpl(Complex, z, imag);
  }

  public static tan (z: Complex | number): Complex;
  public static tan (real: number, imag?: number): Complex;
  public static tan (z: Complex | number, imag?: number): Complex {
    return tanImpl(Complex, z, imag);
  }

  public static sec (z: Complex | number): Complex;
  public static sec (real: number, imag?: number): Complex;
  public static sec (z: Complex | number, imag?: number): Complex {
    return secImpl(Complex, z, imag);
  }

  public static csc (z: Complex | number): Complex;
  public static csc (real: number, imag?: number): Complex;
  public static csc (z: Complex | number, imag?: number): Complex {
    return cscImpl(Complex, z, imag);
  }

  public static cot (z: Complex | number): Complex;
  public static cot (real: number, imag?: number): Complex;
  public static cot (z: Complex | number, imag?: number): Complex {
    return cotImpl(Complex, z, imag);
  }

  public toString (format?: string): string {
    return toStringImpl(this, format);
  }

  public add (rhs: Complex | number): Complex;
  public add (real: number, imag?: number): Complex;
  public add (rhs: Complex | number, imag?: number): Complex {
    return addImpl(Complex, this, rhs, imag);
  }
  public '+' (rhs: Complex | number): Complex;
  public '+' (real: number, imag?: number): Complex;
  public '+' (rhs: Complex | number, imag?: number): Complex {
    return addImpl(Complex, this, rhs, imag);
  }

  public sub (rhs: Complex | number): Complex;
  public sub (real: number, imag?: number): Complex;
  public sub (rhs: Complex | number, imag?: number): Complex {
    return subImpl(Complex, this, rhs, imag);
  }
  public '-' (rhs: Complex | number): Complex;
  public '-' (real: number, imag?: number): Complex;
  public '-' (rhs: Complex | number, imag?: number): Complex {
    return subImpl(Complex, this, rhs, imag);
  }

  public mul (rhs: Complex | number): Complex;
  public mul (real: number, imag?: number): Complex;
  public mul (rhs: Complex | number, imag?: number): Complex {
    return mulImpl(Complex, this, rhs, imag);
  }
  public '*' (rhs: Complex | number): Complex;
  public '*' (real: number, imag?: number): Complex;
  public '*' (rhs: Complex | number, imag?: number): Complex {
    return mulImpl(Complex, this, rhs, imag);
  }

  public div (divisor: Complex | number): Complex;
  public div (real: number, imag?: number): Complex;
  public div (divisor: Complex | number, imag?: number): Complex {
    return divImpl(Complex, this, divisor, imag);
  }
  public '/' (rhs: Complex | number): Complex;
  public '/' (real: number, imag?: number): Complex;
  public '/' (rhs: Complex | number, imag?: number): Complex {
    return divImpl(Complex, this, rhs, imag);
  }

  public mod (rhs: Complex | number): Complex;
  public mod (real: number, imag?: number): Complex;
  public mod (rhs: Complex | number, imag?: number): Complex {
    return modImpl(Complex, this, rhs, imag);
  }
  public '%' (rhs: Complex | number): Complex;
  public '%' (real: number, imag?: number): Complex;
  public '%' (rhs: Complex | number, imag?: number): Complex {
    return modImpl(Complex, this, rhs, imag);
  }

  public pow (rhs: Complex | number): Complex;
  public pow (real: number, imag?: number): Complex;
  public pow (rhs: Complex | number, imag?: number): Complex {
    return powImpl(Complex, this, rhs, imag);
  }
  public '**' (rhs: Complex | number): Complex;
  public '**' (real: number, imag?: number): Complex;
  public '**' (rhs: Complex | number, imag?: number): Complex {
    return powImpl(Complex, this, rhs, imag);
  }

  public and (rhs: Complex | number): Complex;
  public and (real: number, imag?: number): Complex;
  public and (rhs: Complex | number, imag?: number): Complex {
    return andImpl(Complex, this, rhs, imag);
  }
  public '&' (rhs: Complex | number): Complex;
  public '&' (real: number, imag?: number): Complex;
  public '&' (rhs: Complex | number, imag?: number): Complex {
    return andImpl(Complex, this, rhs, imag);
  }

  public or (rhs: Complex | number): Complex;
  public or (real: number, imag?: number): Complex;
  public or (rhs: Complex | number, imag?: number): Complex {
    return orImpl(Complex, this, rhs, imag);
  }
  public '|' (rhs: Complex | number): Complex;
  public '|' (real: number, imag?: number): Complex;
  public '|' (rhs: Complex | number, imag?: number): Complex {
    return orImpl(Complex, this, rhs, imag);
  }

  public xor (rhs: Complex | number): Complex;
  public xor (real: number, imag?: number): Complex;
  public xor (rhs: Complex | number, imag?: number): Complex {
    return xorImpl(Complex, this, rhs, imag);
  }
  public '^' (rhs: Complex | number): Complex;
  public '^' (real: number, imag?: number): Complex;
  public '^' (rhs: Complex | number, imag?: number): Complex {
    return xorImpl(Complex, this, rhs, imag);
  }

  public sal (rhs: Complex | number): Complex;
  public sal (real: number, imag?: number): Complex;
  public sal (rhs: Complex | number, imag?: number): Complex {
    return salImpl(Complex, this, rhs, imag);
  }
  public shl (rhs: Complex | number): Complex;
  public shl (real: number, imag?: number): Complex;
  public shl (rhs: Complex | number, imag?: number): Complex {
    return salImpl(Complex, this, rhs, imag);
  }
  public '<<' (rhs: Complex | number): Complex;
  public '<<' (real: number, imag?: number): Complex;
  public '<<' (rhs: Complex | number, imag?: number): Complex {
    return salImpl(Complex, this, rhs, imag);
  }

  public sar (rhs: Complex | number): Complex;
  public sar (real: number, imag?: number): Complex;
  public sar (rhs: Complex | number, imag?: number): Complex {
    return sarImpl(Complex, this, rhs, imag);
  }
  public '>>' (rhs: Complex | number): Complex;
  public '>>' (real: number, imag?: number): Complex;
  public '>>' (rhs: Complex | number, imag?: number): Complex {
    return sarImpl(Complex, this, rhs, imag);
  }

  public shr (rhs: Complex | number): Complex;
  public shr (real: number, imag?: number): Complex;
  public shr (rhs: Complex | number, imag?: number): Complex {
    return shrImpl(Complex, this, rhs, imag);
  }
  public '>>>' (rhs: Complex | number): Complex;
  public '>>>' (real: number, imag?: number): Complex;
  public '>>>' (rhs: Complex | number, imag?: number): Complex {
    return shrImpl(Complex, this, rhs, imag);
  }
}
