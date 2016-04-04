var path = require('path'),
    pkg = require('./package.json');

module.exports = {
  context: __dirname,
  entry: './index',
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'e2d.js',
    library: 'e2d',
    libraryTarget: 'umd'
  }
};
