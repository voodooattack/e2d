//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillStyle(value, children) {
  return [new Instruction('fillStyle', { value: value })].concat(children).concat([new Instruction('endFillStyle')]);
}

module.exports = fillStyle;