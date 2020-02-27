export default function realImpl (abs: number, arg: number): number {
  return (
    // if z is positive, real = abs
    arg === 0 ? abs
    // if z is negative, real = -abs
    : arg === Math.PI ? -abs
    // else real = abs * cos(arg)
    : abs * Math.cos(arg)
  );
}
