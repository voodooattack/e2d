//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function moveTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('moveTo', { x: 0, y: 0});
  }
  return new Instruction('moveTo', { x: x, y: y });
}

module.exports = moveTo;