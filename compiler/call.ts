import abs from '../functions/abs';
import acos from '../functions/acos';
import acosh from '../functions/acosh';
import arg from '../functions/arg';
import asin from '../functions/asin';
import asinh from '../functions/asinh';
import atan from '../functions/atan';
import atanh from '../functions/atanh';
import cbrt from '../functions/cbrt';
import ceil from '../functions/ceil';
import conj from '../functions/conj';
import cos from '../functions/cos';
import cosh from '../functions/cosh';
import cube from '../functions/cube';
import exp from '../functions/exp';
import floor from '../functions/floor';
import imag from '../functions/imag';
import log from '../functions/log';
import random from '../functions/random';
import real from '../functions/real';
import round from '../functions/round';
import sign from '../functions/sign';
import sin from '../functions/sin';
import sinh from '../functions/sinh';
import sqrt from '../functions/sqrt';
import square from '../functions/square';
import tan from '../functions/tan';
import tanh from '../functions/tanh';
import trunc from '../functions/trunc';

export const callLookup = {
  abs,
  acos,
  acosh,
  arg,
  asin,
  asinh,
  atan,
  atanh,
  cbrt,
  ceil,
  conj,
  cos,
  cosh,
  cube,
  exp,
  floor,
  imag,
  log,
  random,
  real,
  round,
  sign,
  sin,
  sinh,
  sqrt,
  square,
  tan,
  tanh,
  trunc
};

export type Call = typeof callLookup;
