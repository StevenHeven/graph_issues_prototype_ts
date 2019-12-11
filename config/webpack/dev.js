const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const utils = require('./utils');
const commonConfig = require('./common');

const ENV = 'development';

module.exports = webpackMerge(commonConfig({ env: ENV }), {

  devtool: 'cheap-module-source-map', // https://reactjs.org/docs/cross-origin-errors.html
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    path: utils.root('build/www'),
    filename: 'app/[name].bundle.js',
    chunkFilename: 'app/[id].chunk.js'
  },
  module: {
    rules: [
      {
        test: [/\.scss$/, /\.css$/],
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  serve: {
    hot: true,
    open: {
      app: 'chrome'
    },
    port: 9000
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
});
