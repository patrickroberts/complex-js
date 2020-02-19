import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = 'Complex';
const input = 'complex.ts';

export default [
  {
    input,
    output: { file: pkg.module, format: 'es' },
    plugins: [typescript()]
  },
  {
    input,
    output: { file: pkg.main, format: 'commonjs', name },
    plugins: [typescript({ target: 'es5' })]
  },
  {
    input,
    output: { file: pkg.browser, format: 'umd', name, sourcemap: true },
    plugins: [typescript({ target: 'es5' }), terser()]
  },
  {
    input,
    output: { file: pkg.types, format: 'es' },
    plugins: [dts()]
  }
];
