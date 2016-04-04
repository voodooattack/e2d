//jshint node: true
'use strict';

var src = require.context('./src', true, /\.js$/i),
  path = require('path');

module.exports = src.keys().reduce(function(index, key) {
  index[path.basename(key, path.extname(key))] = src(key);
  return index;
}, {});
