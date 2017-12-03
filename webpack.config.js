const path = require('path');

module.exports = {
  watch: true,
  entry: './kesamo/public/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'kesamo/public/dist')
  }
}