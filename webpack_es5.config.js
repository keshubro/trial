const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { resolve } = require('path');
const BabelPlugin = require('@babel/plugin-proposal-optional-chaining');

const modeConfig = env => require(`./webpack/webpack.${env.mode}.js`)(env);

const webcomponents = './node_modules/@webcomponents/webcomponentsjs';
const polyfils = [
  {
    from: resolve(`${webcomponents}/webcomponents-loader.js`),
    to: 'vendor',
    flatten: true
  },
  {
    from: resolve(`${webcomponents}/custom-elements-es5-adapter.js`),
    to: 'vendor',
    flatten: true
  }
];

const plugins = [
  new webpack.ProgressPlugin(),
  new CopyWebpackPlugin([...polyfils], {
    ignore: ['.DS_Store']
  })
];

module.exports = ({ mode }) => {
  return webpackMerge({
    mode,
    resolve: {
      extensions: ['.js']
    },
    entry: {
      'demo-element': ['babel-polyfill', './src/routes.js']
    },
    output: {
      path: resolve(__dirname, 'dist/legacy'),
      filename: '[name]_es5.bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'ie 11'
                }
              ]
            ],
            plugins: [["@babel/plugin-proposal-optional-chaining"]],
            
          }
        },
        {
          test: /\.css|\.s(c|a)ss$/,
          use: [{
            loader: 'lit-scss-loader',
            options: {
              minify: true
            },
          }, 'extract-loader', 'css-loader', 'sass-loader'],
        }
      ]
    },
    plugins
  },
  modeConfig({mode}))
}

