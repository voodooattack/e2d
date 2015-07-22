//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
  flatten = require('lodash/array/flatten');

function translate(x, y, children) {
  
  var result = [new Instruction('translate', { x: x, y: y })];
  
  for (var i = 2; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  
  result.push(new Instruction('restore'));
  return result;
}

module.exports = translate;