// Rollup plugins
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/app.js',
  dest: 'dist/app.js',
  format: 'es',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
