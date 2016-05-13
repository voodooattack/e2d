'use strict';

var Instruction = require('./Instruction'),
    hitRegion = require('./hitRegion');

function hitRect(id, x, y, width, height) {
  if (arguments.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }

  var points = [
    [x, y],
    [x, y + height],
    [x + width, y + height],
    [x + width, y]
  ];

  return hitRegion(id, points);
}

module.exports = hitRect;
