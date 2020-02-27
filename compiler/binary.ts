import add from '../methods/add';
import and from '../methods/and';
import div from '../methods/div';
import mod from '../methods/mod';
import mul from '../methods/mul';
import or from '../methods/or';
import pow from '../methods/pow';
import sal from '../methods/sal';
import sar from '../methods/sar';
import shr from '../methods/shr';
import sub from '../methods/sub';
import xor from '../methods/xor';

export const binaryLookup = {
  '%': mod,
  '&': and,
  '*': mul,
  '**': pow,
  '+': add,
  '-': sub,
  '/': div,
  '<<': sal,
  '>>': sar,
  '>>>': shr,
  '^': xor,
  '|': or
};

export type Binary = typeof binaryLookup;
