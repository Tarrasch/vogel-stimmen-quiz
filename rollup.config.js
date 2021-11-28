import { terser } from "rollup-plugin-terser";

export default {
    input: 'gen.js/quiz.js',
    output: {
      file: 'out/quiz.js',
      format: 'iife',
      plugins: [terser()],
    }
  };