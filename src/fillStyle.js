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
  
  return [instruction].concat(children).concat([new Instruction('endFillStyle')]);
}

module.exports = fillStyle;