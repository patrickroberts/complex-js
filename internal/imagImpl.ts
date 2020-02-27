export default function imagImpl (abs: number, arg: number): number {
  return (
    // if z is real, imag = 0
    arg === 0 || arg === Math.PI ? 0
    // else imag = abs * sin(arg)
    : abs * Math.sin(arg)
  );
}
