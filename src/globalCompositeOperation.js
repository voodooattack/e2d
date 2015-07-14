//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function globalCompositeOperation(operationType, children) {
  return [new Instruction('globalCompositeOperation', { value: operationType })].concat(children).concat([new Instruction('endGlobalCompositeOperation')]);
}