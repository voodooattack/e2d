'use strict';

var Instruction = require('./Instruction');

function fillRect(x, y, width, height) {
  if (arguments.length >= 4) {
    return new Instruction("fillRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("fillRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = fillRect;
