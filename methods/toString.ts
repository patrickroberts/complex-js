import { IComplex } from '../internal/complex';
import getAbs from './getAbs';
import getArg from './getArg';
import getImag from './getImag';
import getReal from './getReal';

type Coordinates = 'c' | 'p';
type Radix = 'X' | 'x' | 'o' | 'b' | '';
type Specifier = 'r' | 'i' | 'm' | 'a';
interface IFormat {
  minus: boolean;
  plus: boolean;
  pound: boolean;
  precision: number | '';
  radix: Radix;
  specifier: Specifier;
  width: number;
  zero: boolean;
}

const fmtCoord = /%([cp])/g;
const fmtParts = /%([#0+-]{0,4})(\d{0,2})((?:\.\d{0,2})?)([Xxob]?)([rima])/g;

export default function toString (z: IComplex, format = '%c'): string {
  return format
    .replace(fmtCoord, replaceCoord)
    .replace(fmtParts, replaceParts(z));
}

function replaceCoord (_: string, coord: Coordinates): string {
  switch (coord) {
    case 'c': return '%r%+i*i';
    case 'p': return '%m*e**(%a*i)';
  }
}

function replaceParts (z: IComplex): (...args: string[]) => string {
  return (_, flag, width, precision, radix, specifier) => {
    return stringify(z, {
      minus: flag.includes('-'),
      plus: flag.includes('+'),
      pound: flag.includes('#'),
      precision: precision && +precision.slice(1),
      radix: radix as Radix,
      specifier: specifier as Specifier,
      width: +width,
      zero: flag.includes('0')
    });
  };
}

function stringify (z: IComplex, format: IFormat): string {
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

    if (target === '') return str;

    if (index === 0) {
      if (target === 0) return str;

      return `${str}.${'0'.repeat(target)}`;
    }

    const digits = str.length - index;
    const remove = Math.max(digits - target, 0);
    const insert = Math.max(target - digits, 0);

    return str.slice(0, str.length - remove) + '0'.repeat(insert);
  }

  function width (str: string): string {
    if (format.minus) {
      return plus(pound(str)).padEnd(format.width, ' ');
    }

    if (!format.zero) {
      return plus(pound(str)).padStart(format.width, ' ');
    }

    if (!str.startsWith('-')) {
      return plus(pound(str.padStart(format.width, '0')));
    }

    return plus(pound(`-${str.slice(1).padStart(format.width - 1, '0')}`));
  }

  function plus (str: string) {
    if (!format.plus || str.startsWith('-')) {
      return str;
    }

    return `+${str}`;
  }

  function pound (str: string): string {
    if (!format.pound || !format.radix) {
      return str;
    }

    const base = `0${format.radix}`;

    if (!str.startsWith('-')) {
      return base + str;
    }

    return `-${base + str.slice(1)}`;
  }
}
