//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('arcTo', { x1: x1, y1: y1, x2: x2, y2: y2, r: r });
}

module.exports = arcTo;
