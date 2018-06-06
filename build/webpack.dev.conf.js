'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devWebpackConfig = merge(baseWebpackConfig, {
  devtool: '#cheap-module-source-map',
  module: {
    rules: utils.styleLoaders({ sourceMap: true, usePostCSS: false })
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name]-[id].bundle.js',
    publicPath: '/',
    path: path.join(__dirname, '/server/public/dist/')
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    contentBase: '/server/public/dist',
    compress: true,
    host: '172.28.3.95',
    port: '3001',
    publicPath: '/',
    watchContentBase: true,
    proxy: {
      '/v1': {
        // target: 'http://platform.api.loongcent.com.cn:8000',
        target: 'http://172.28.3.9:8001',
        changeOrigin: true
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true
    })
  ]
});

module.exports = devWebpackConfig;
