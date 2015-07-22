//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    flatten = require('lodash/array/flatten');

function scale(x, y, children) {
  var i = 2;
  if (typeof y !== 'number') {
    y = x;
    i = 1;
  }
  children = children || [];
  
  var result = [new Instruction('scale', { x: x, y: y })],
      child;
  for (; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
}

module.exports = scale;