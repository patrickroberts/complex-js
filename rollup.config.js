import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = 'Complex';
const input = 'complex.ts';
const moo = 'moo';
const nearley = 'nearley';
const globals = { moo, nearley };

export default [
  {
    input,
    output: { file: pkg.module, format: 'es' },
    plugins: [external(), typescript()]
  },
  {
    input,
    output: { file: pkg.main, format: 'commonjs', name },
    plugins: [external(), typescript({ target: 'es5' })]
  },
  {
    input,
    output: { file: pkg.browser, format: 'umd', name, globals, sourcemap: true },
    plugins: [external(), typescript({ target: 'es5' }), terser()]
  },
  {
    input,
    output: { file: pkg.types, format: 'es' },
    plugins: [dts()]
  }
];
