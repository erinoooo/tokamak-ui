/**
 * tokamak-ui · build.js
 * Bundles src/index.js → tokamak.min.js using esbuild.
 *
 * Usage:
 *   node build.js          — production build
 *   node build.js --watch  — watch mode (dev)
 */

const esbuild = require('esbuild');
const watch   = process.argv.includes('--watch');

const config = {
  entryPoints: ['src/index.js'],
  bundle:      true,
  minify:      !watch,
  sourcemap:   watch ? 'inline' : false,
  outfile:     'tokamak.min.js',
  format:      'iife',        // works as a <script> tag with no module system
  globalName:  'Tokamak',     // window.Tokamak.TokButton etc.
  target:      ['es2018'],    // broad browser support; custom elements are ES2015+
  logLevel:    'info',
  banner: {
    js: `/* tokamak-ui v0.1.1 — https://tokamak-ui.ereneksi.com — MIT */`
  },
};

if (watch) {
  esbuild.context(config).then(ctx => {
    ctx.watch();
    console.log('Watching for changes…');
  });
} else {
  esbuild.build(config).then(() => {
    console.log('Built tokamak.min.js');
  }).catch(() => process.exit(1));
}
