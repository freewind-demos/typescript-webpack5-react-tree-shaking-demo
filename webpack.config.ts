import {Configuration} from 'webpack';
import path from 'path';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

function babelCoreJsPreset() {
  return [
    '@babel/preset-env',
    {
      // when specify 'usage', we don't need to import 'corejs' manually in code
      useBuiltIns: 'usage',
      // NOTE: https://github.com/babel/babel/issues/7457
      // modules: 'commonjs',
      // NOTE: if we want to keep the esm modules, should set it false
      modules: false,
      corejs: {
        // works for "useBuiltIns: usage", just specify a.b, not a.b.c
        // should upgrade to current latest version
        version: '3.8',
        proposals: true,
      },
      targets: {
        browsers: [
          // support most of mainstream browsers
          'last 2 versions',
          // have to support IE 11, since admin page runs silverlight which requires IE 11
          'IE 11',
        ],
      }
    },
  ];
}


const config: Configuration = {
  mode: "production",
  entry: './src/entry.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve('src'), 'node_modules']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'babel-loader',
      options: {
        presets: [
          // NOTE: add polyfills, convert syntaxes
          babelCoreJsPreset(),
          '@babel/preset-react',
          // NOTE: preset-typescript ignore tsconfig.json and just remove type annotations
          //  so we can still
          //  1. set `module:commonjs` rather than 'ES2020' in tsconfig.json
          //  2. not need to set `type:module` in package.json
          // to make it easy to work with ts-node or webpack cli
          '@babel/preset-typescript'
        ],
        plugins: [
          // NOTE to support @annotation in class fields
          ['@babel/plugin-proposal-decorators', {legacy: true}]
        ],
      },
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundleContentReport.html'
    }),
    // NOTE The following plugin doesn't take effect?
    // new SideEffectsFreePlugin({
    //   includes: [/src\/(.*)/]
    // })
  ],
  optimization: {
    minimize: true,
    // NOTE: concatenateModules is very important to be true(default) to tree shake
    // concatenateModules:true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            defaults: false, // set all recommended configs to false since we want to demo only some configs
            dead_code: true, // remove dead_code in functions
            unused: true, // remove unused functions
            keep_fnames: true,
            keep_classnames: true,
            keep_fargs: true
          },
          mangle: false, // don't minify variable names
          format: {
            beautify: true,
            comments: false,
          },
        },
      })
    ]
  }

}

export default config;
