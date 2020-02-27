export default function argImpl (real: number, imag: number): number {
  return (
    // if z is real, if z is negative, arg = pi, else arg = 0
    imag === 0 ? (real < 0 ? Math.PI : 0)
    // if z is imag, arg = sign(imag) * pi / 2
    : real === 0 ? (imag < 0 ? -0.5 : 0.5) * Math.PI
    // else arg = atan(imag / real)
    : Math.atan2(imag, real)
  );
}
