export default function abs (real: number, imag: number): number {
  const value =
    // if z is real, abs = |real|
    imag === 0 ? Math.abs(real)
    // if z is imag, abs = |imag|
    : real === 0 ? Math.abs(imag)
    // else abs = |z|
    : Math.hypot(real, imag);

  return value;
}
