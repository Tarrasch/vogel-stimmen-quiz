import terser from '@rollup/plugin-terser';

export default [{
  input: 'gen.js/quiz.js',
  output: {
    file: 'out/quiz.js',
    format: 'iife',
    name: "Quiz",
    plugins: [terser()],
  }
}, {
  input: 'gen.js/quiz_starter.js',
  output: {
    file: 'out/quiz_starter.js',
    format: 'iife',
    name: "QuizStarter",
    plugins: [terser()],
  }
}];