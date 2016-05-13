'use strict';

var Instruction = require('./Instruction');

function fillStyle(value, children) {
  var result = [new Instruction('fillStyle', { value: value })];

  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endFillStyle'));
  return result;
}

module.exports = fillStyle;
