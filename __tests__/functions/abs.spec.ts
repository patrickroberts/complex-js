import abs from '../../functions/abs';
import { IComplex } from '../../internal/complex';
import mask from '../../internal/mask';

const Complex = jest.fn<IComplex, [number, number, number, number, mask]>();

describe('abs(x)', () => {
  it('computes abs(a)', () => {
    abs(Complex, -4);
  
    expect(Complex).toBeCalledWith(4, 0, 4, 0, mask.HAS_ALL);
  });

  it('computes abs(a, b)', () => {
    abs(Complex, 0, 2);
  
    expect(Complex).toBeCalledWith(2, 0, 2, 0, mask.HAS_ALL);
  });

  it('computes abs(a+b*i)', () => {
    const cartesian = { _real: -5, _imag: 12, _abs: NaN, _arg: NaN, _mask: mask.HAS_CARTESIAN };
  
    abs(Complex, cartesian);
  
    expect(Complex).toBeCalledWith(13, 0, 13, 0, mask.HAS_ALL);
    expect(cartesian).toMatchObject({ _abs: 13, _arg: NaN, _mask: mask.HAS_CARTESIAN | mask.HAS_ABS });
  });

  it('computes abs(a*e**(b*i))', () => {
    const polar = { _real: NaN, _imag: NaN, _abs: 3, _arg: 1, _mask: mask.HAS_POLAR };
  
    abs(Complex, polar);
  
    expect(Complex).toBeCalledWith(3, 0, 3, 0, mask.HAS_ALL);
    expect(polar).toMatchObject({ _real: NaN, _imag: NaN, _mask: mask.HAS_POLAR });
  });
});
