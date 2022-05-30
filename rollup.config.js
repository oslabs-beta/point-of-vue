import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import ts from 'rollup-plugin-typescript2';
import pkg from './package.json'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

// export default {
// 	input: 'src/main.js',
// 	output: {
// 		file: 'public/bundle.js',
// 		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
// 		sourcemap: true
// 	},
// 	plugins: [
// 		resolve(), // tells Rollup how to find date-fns in node_modules
// 		commonjs(), // converts date-fns to ES modules
// 		production && terser(), // minify, but only in production
//     // css({output: 'bundle.css'})
// 	]
// };

let hasTSChecked = false


const outputConfigs = {
  // each file name has the format: `dist/${name}.${format}.js`
  // format being a key of this object
  mjs: {
    file: pkg.module,
    format: `es`,
  },
  cjs: {
    file: pkg.module.replace('mjs', 'cjs'),
    format: `cjs`,
  },
  global: {
    file: pkg.unpkg,
    format: `iife`,
  },
  browser: {
    file: 'dist/point-of-vue.esm-browser.js',
    format: `es`,
  },
}

const packageBuilds = Object.keys(outputConfigs)
const packageConfigs = packageBuilds.map((format) =>
  createConfig(format, outputConfigs[format])
)

// only add the production ready if we are bundling the options
packageBuilds.forEach((buildName) => {
  if (buildName === 'cjs') {
    packageConfigs.push(createProductionConfig(buildName))
  } else if (buildName === 'global') {
    packageConfigs.push(createMinifiedConfig(buildName))
  }
})

export default packageConfigs;

function createConfig(buildName, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${buildName}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false
  output.globals = {
    'vue-demi': 'VueDemi',
    vue: 'Vue',
    '@vue/composition-api': 'vueCompositionApi',
  }

  const isProductionBuild = /\.prod\.[cm]?js$/.test(output.file)
  const isGlobalBuild = buildName === 'global'
  const isRawESMBuild = buildName === 'browser'
  const isNodeBuild = buildName === 'cjs'
  const isBundlerESMBuild = buildName === 'browser' || buildName === 'mjs'

  if (isGlobalBuild) output.name = pascalcase(pkg.name)

  const shouldEmitDeclarations = !hasTSChecked

  const tsPlugin = ts({
    check: !hasTSChecked,
    tsconfig: path.resolve(__dirname, './tsconfig.json'),
    cacheRoot: path.resolve(__dirname, './node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      exclude: ['packages/*/__tests__', 'packages/*/test-dts'],
    },
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const external = ['vue-demi', 'vue', '@vue/composition-api']
  if (!isGlobalBuild) {
    external.push('@vue/devtools-api')
  }

  const nodePlugins = [resolve(), commonjs()]

  return {
    input: `src/index.ts`,
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        // isBrowserBuild?
        isGlobalBuild || isRawESMBuild || isBundlerESMBuild,
        isGlobalBuild,
        isNodeBuild
      ),
      ...nodePlugins,
      ...plugins,
    ],
    output,
    // onwarn: (msg, warn) => {
    //   if (!/Circular/.test(msg)) {
    //     warn(msg)
    //   }
    // },
  }
}

function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isBrowserBuild,
  isGlobalBuild,
  isNodeBuild
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${pkg.version}"`,
    __DEV__:
      isBundlerESMBuild || (isNodeBuild && !isProduction)
        ? // preserve to be handled by bundlers
          `(process.env.NODE_ENV !== 'production')`
        : // hard coded dev/prod builds
          JSON.stringify(!isProduction),
    // this is only used during tests
    __TEST__:
      isBundlerESMBuild || isNodeBuild
        ? `(process.env.NODE_ENV === 'test')`
        : 'false',
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: JSON.stringify(isBrowserBuild),
    // is targeting bundlers?
    __BUNDLER__: JSON.stringify(isBundlerESMBuild),
    __GLOBAL__: JSON.stringify(isGlobalBuild),
    // is targeting Node (SSR)?
    __NODE_JS__: JSON.stringify(isNodeBuild),
  }
  // allow inline overrides like
  //__RUNTIME_COMPILE__=true yarn build
  Object.keys(replacements).forEach((key) => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace({
    preventAssignment: true,
    values: replacements,
  })
}
