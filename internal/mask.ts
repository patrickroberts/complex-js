// @internal
const enum mask {
  HAS_NONE = 0,
  HAS_REAL = 1,
  HAS_IMAG = HAS_REAL << 1,
  HAS_ABS  = HAS_IMAG << 1,
  HAS_ARG  = HAS_ABS << 1,
  HAS_CARTESIAN = HAS_REAL | HAS_IMAG,
  HAS_POLAR = HAS_ABS | HAS_ARG,
  HAS_ALL = HAS_CARTESIAN | HAS_POLAR
}

export default mask;
