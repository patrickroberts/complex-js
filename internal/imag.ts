export default function imag (abs: number, arg: number): number {
  const value =
    // if z is real, imag = 0
    arg === 0 || arg === Math.PI ? 0
    // else imag = abs * sin(arg)
    : abs * Math.sin(arg);

  return value;
}
