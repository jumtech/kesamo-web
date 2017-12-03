const webpack = require('webpack');
const path = require('path');

module.exports = {
  watch: true,
  entry: './kesamo/public/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'kesamo/public/dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        },
      }],
    },{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: false
      },
    }),
  ],
};