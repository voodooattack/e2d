//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
  flatten = require('lodash/array/flatten');

function translate(x, y, children) {
  x = +x;
  y = +y;
  children = children || [];
  
  var result = [new Instruction('translate', { x: x, y: y })],
      child;
  
  result = result.concat(flatten(children));
  result.push(new Instruction('restore'));
  return result;
}

module.exports = translate;