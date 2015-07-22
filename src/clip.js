//jshint node: true
'use strict';

var beginPath = require('./beginPath'),
    clipPath = require('./clipPath');

function clip(children) {
  var result = [beginPath()];
  for(var i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(clipPath());
  return result;
}

module.exports = clip;