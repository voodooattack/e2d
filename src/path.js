'use strict';

var beginPath = require('./beginPath'),
    closePath = require('./closePath');

function path(children) {
  var result = [beginPath()];
  for(var i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(closePath());
  return result;
}

module.exports = path;
