'use strict';

var Instruction = require('./Instruction');

function rect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("rect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("rect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = rect;
