var path = require('path'),
    pkg = require('./package.json'),
    webpack = require('webpack'),
    Babili = require('babili-webpack-plugin');

let buildConfig = (useBabel, useUglify, name) => ({
  context: __dirname,
  entry: {
    [name]: './index.js'
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    library: 'e2d',
    libraryTarget: 'umd'
  },
  module: {
    rules: useBabel ? [
      {
        test: /\.js$/i,
        use: ['babel-loader']
      }
    ] : []
  },
  plugins: useUglify && useBabel ? [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ] :
  useUglify && !useBabel ? [
    new Babili()
  ] : []
});
module.exports = [
  buildConfig(false, false, 'e2d'),
  buildConfig(true, false, 'e2d.compat'),
  buildConfig(false, true, 'e2d.min'),
  buildConfig(true, true, 'e2d.compat.min')
];
