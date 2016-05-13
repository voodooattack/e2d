'use strict';

var Instruction = require('./Instruction');

function globalCompositeOperation(operationType, children) {
  var result = [new Instruction('globalCompositeOperation', { value: operationType })];
  if (arguments.length === 0) {
    return [];
  }

  for (var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endGlobalCompositeOperation'));
  return result;
}

module.exports = globalCompositeOperation;
