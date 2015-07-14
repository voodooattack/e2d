//jshint node: true
'use strict';

var beginPath = require('./beginPath'),
    closePath = require('./closePath');

function path(children) {
  return [beginPath()].concat(children).concat([closePath()]);
}

module.exports = path;