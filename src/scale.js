//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    flatten = require('lodash/array/flatten');

function scale(x, y, children) {
  x = +x;
  y = +y;
  children = children || [];
  
  var result = [new Instruction('scale', { x: x, y: y })],
      child;
  
  result = result.concat(flatten(children));
  result.push(new Instruction('restore'));
  return result;
}

module.exports = scale;