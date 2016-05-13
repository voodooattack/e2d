'use strict';

var Instruction = require('./Instruction');

function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
  return new Instruction('bezierCurveTo', {
    cp1x: cp1x,
    cp1y: cp1y,
    cp2x: cp2x,
    cp2y: cp2y,
    x: x,
    y: y
  });
}

module.exports = bezierCurveTo;
