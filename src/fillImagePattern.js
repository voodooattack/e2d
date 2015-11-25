//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillImagePattern(img, dx, dy, dWidth, dHeight) {
  if (arguments.length >= 5) {
    return new Instruction('fillImagePattern', {
      img: img,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('fillImagePattern', {
      img: img,
      dx: 0,
      dy: 0,
      dWidth: dx,
      dHeight: dy
    });
  }

  return new Instruction('fillImagePattern', {
    img: img,
    dx: 0,
    dy: 0,
    dWidth: 0,
    dHeight: 0
  });
}

module.exports = fillImagePattern;
