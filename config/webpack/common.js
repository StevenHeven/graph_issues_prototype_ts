const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils');

const threadLoader = {
  loader: 'thread-loader',
  options: {
    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
    workers: require('os').cpus().length - 1
  }
};

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  }
};

module.exports = options => ({
  cache: options.env !== 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          { loader: 'cache-loader' },
          threadLoader,
          babelLoader
        ]
      }
    ]
  },
  stats: {
    children: false
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      tslint: true,
      watch: ['./src'] // optional but improves performance (less stat calls)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${options.env}'`,
        DEBUG_INFO_ENABLED: options.env === 'development'
      }
    }),
    new CopyWebpackPlugin([
      { from: './public/', to: 'static' }
    ]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      chunksSortMode: 'dependency',
      inject: 'body'
    })
  ]
});
