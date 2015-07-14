//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    flatten = require('lodash/array/flatten');

function rotate(r, children) {
  r = +r;
  children = children || [];
  
  var result = [new Instruction('rotate', { r: r })],
      child;
  
  result = result.concat(flatten(children));
  result.push(new Instruction('restore'));
  return result;
}

module.exports = rotate;