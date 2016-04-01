var path = require('path'),
    pkg = require('./package.json');

module.exports = [
  {
    context: __dirname,
    entry: './index',
    output: {
      path: path.join(__dirname, '/dist/'),
      filename: 'e2d.js',
      library: 'e2d',
      libraryTarget: 'umd'
    }
  },
  {
      context: __dirname,
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
      },
      devServer: {
        contentBase: 'public'
      }
  }
];
