var path = require('path'),
  pkg = require('./package');

module.exports = {
  entry: {
    app: './app',
    test: './test'
  },
  output: {
      path: __dirname + "/dist",
      filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.json$/i, loader: "json" },
      { test: /(\.png|\.jpeg|\.jpg|\.bmp)/i, loader: 'url' }
    ]
  }
};
