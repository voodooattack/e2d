var path = require('path'),
    pkg = require('./package.json');

module.exports = [{
  context: __dirname,
  entry: {
    "e2d.compat": 'babel-loader!./index.js'
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    library: 'e2d',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { test: /\.js$/i, use: ['babel-loader'] }
    ]
  }
},
{
  context: __dirname,
  entry: {
    "e2d": './index.js'
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    library: 'e2d',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      //{ test: /\.js$/i, use: ['babel-loader'] }
    ]
  }
}

];
