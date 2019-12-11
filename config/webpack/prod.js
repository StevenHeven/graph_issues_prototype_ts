const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const utils = require('./utils');
const commonConfig = require('./common');

const ENV = 'production';

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  mode: 'production',
  entry: [
    './src/index'
  ],
  output: {
    path: utils.root('build/www'),
    filename: 'app/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: [/\.scss$/, /\.css$/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      }
    ]
  },
        /*
        {
          enforce: 'pre',
          test: /\.s?css$/,
          loader: 'stripcomment-loader'
        }
        */
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })/*,
    const WorkboxPlugin = require('workbox-webpack-plugin');
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })*/
  ]
});
