import { Complex } from '../internal/complex';
import getReal from './real';
import getImag from './imag';
import getAbs from './abs';
import getArg from './arg';

/** @internal */
type Coordinates = 'c' | 'p';
/** @internal */
type Radix = 'X' | 'x' | 'o' | 'b' | '';
/** @internal */
type Specifier = 'r' | 'i' | 'm' | 'a';
/** @internal */
interface Format {
  pound: boolean;
  zero: boolean;
  plus: boolean;
  minus: boolean;
  width: number;
  precision: number;
  radix: Radix;
  specifier: Specifier;
}

const fmtCoord = /%([cp])/g;
const fmtParts = /%([#0+-]{,4})(\d{,2})((?:\.\d{,2})?)([Xxob]?)([rima])/g;

export default function toString (z: Complex, format = '%c'): string {
  return format
    .replace(fmtCoord, replaceCoord)
    .replace(fmtParts, replaceParts(z));
}

function replaceCoord (_: string, coord: Coordinates): string {
  switch (coord) {
    case 'c': return '%r%+ii';
    case 'p': return '%m*e**(%ai)';
  }
}

function replaceParts (z: Complex): (...args: string[]) => string {
  return (_, flag, width, precision, radix, specifier) => {
    return stringify(z, {
      pound: flag.includes('#'),
      zero: flag.includes('0'),
      plus: flag.includes('+'),
      minus: flag.includes('-'),
      width: +width,
      precision: +precision.slice(1),
      radix: radix as Radix,
      specifier: specifier as Specifier
    });
  };
}

function stringify (z: Complex, format: Format): string {
  return width(precision(radix(specifier())));

  function specifier (): number {
    switch (format.specifier) {
      case 'r': return getReal(z);
      case 'i': return getImag(z);
      case 'm': return getAbs(z);
      case 'a': return getArg(z);
    }
  }

  function radix (num: number): string {
    switch (format.radix) {
      case 'X': return num.toString(16).toUpperCase();
      case 'x': return num.toString(16).toLowerCase();
      case 'o': return num.toString(8);
      case 'b': return num.toString(2);
      case '': return num.toString(10);
    }
  }

  function precision (str: string): string {
    const target = format.precision;
    const index = str.indexOf('.') + 1;

    if (index === 0) {
      if (target === 0) return str;

      return str + '.' + '0'.repeat(target);
    }

    const digits = str.length - index;
    const remove = Math.max(digits - target, 0);
    const insert = Math.max(target - digits, 0);

    return str.slice(0, str.length - remove) + '0'.repeat(insert);
  }

  function width (str: string): string {
    if (format.minus) {
      return padRight(plus(pound(str)), format.width, ' ');
    }

    if (!format.zero) {
      return padLeft(plus(pound(str)), format.width, ' ');
    }

    if (!startsWith(str, '-')) {
      return plus(pound(padLeft(str, format.width, '0')));
    }

    return plus(pound('-' + padLeft(str.slice(1), format.width - 1, '0')));
  }

  function plus (str: string) {
    if (!format.plus || startsWith(str, '-')) return str;
    return '+' + str;
  }

  function pound (str: string): string {
    if (!format.pound || !format.radix) return str;

    const base = '0' + format.radix;

    if (!startsWith(str, '-')) return base + str;
    return '-' + base + str.slice(1);
  }
}

function padLeft (target: string, targetLength: number, padString: string): string {
  targetLength >>= 0;
  targetLength -= target.length;

  if (targetLength <= 0) return target;

  return padded(targetLength, padString) + target;
}

function padRight (target: string, targetLength: number, padString: string): string {
  targetLength >>= 0;
  targetLength -= target.length;

  if (targetLength <= 0) return target;

  return target + padded(targetLength, padString);
}

function padded (targetLength: number, padString: string): string {
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }

  return padString.slice(0, targetLength);
}

function startsWith (sourceString: string, searchString: string): boolean {
  return sourceString.slice(0, searchString.length) === searchString;
}
