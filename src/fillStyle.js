//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    Gradient = require('./Gradient');

function fillStyle(value, children) {
  var instruction;
  if (value instanceof Gradient) {
    instruction = new Instruction('fillGradient', { value: { id: value.id } });
  }
  
  if (!instruction) {
    instruction = new Instruction('fillStyle', { value: value });
  }
  var result = [instruction];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endFillStyle'));
  return result;
}

module.exports = fillStyle;