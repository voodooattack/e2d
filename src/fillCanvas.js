//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('fillCanvasSource', {
      img: img,
      sx: sx,
      sy: sy,
      sWidth: sWidth,
      sHeight: sHeight,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('fillCanvasSize', {
      img: img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('fillCanvas', {
      img: img,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('fillCanvas', {
    img: img,
    dx: 0,
    dy: 0
  });
}

module.exports = fillImage;
