//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function strokeRect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("strokeRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("strokeRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = strokeRect;