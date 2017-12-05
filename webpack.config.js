const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  watch: true,
  entry: './kesamo/public/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'kesamo/public/dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            },
          }
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules|vendor/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  externals: {
    firebase: 'firebase'
  },
};