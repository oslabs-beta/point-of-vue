const esbuild = require('esbuild');
const vue = require('esbuild-plugin-vue').default;

const pkgName = 'my-plugin';

/** @type {import('esbuild').BuildOptions} */
const commonOptions = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  sourcemap: true,
  external: [
    'vue',
    // Add libraries to exclude from bundling for browser builds
  ],
  target: 'es6', // Change to the targets you want
  plugins: [vue()],
};

// ESM Bundler
esbuild.build({
  ...commonOptions,
  outfile: `dist/${pkgName}.esm-bundler.js`,
  format: 'esm',
  platform: 'node',
  external: [
    // Mark all dependencies as external
    ...Object.keys(require('./package.json').dependencies),
    ...Object.keys(require('./package.json').peerDependencies),
  ],
});

// Browser dev
esbuild.build({
  ...commonOptions,
  outfile: `dist/${pkgName}.browser.js`,
  format: 'iife',
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(
      process.env.__VUE_PROD_DEVTOOLS__ || false
    ),
  },
});

// Browser prod
esbuild.build({
  ...commonOptions,
  outfile: `dist/${pkgName}.browser.min.js`,
  format: 'iife',
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(
      process.env.__VUE_PROD_DEVTOOLS__ || false
    ),
  },
  minify: true,
});
