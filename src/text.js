'use strict';

var Instruction = require('./Instruction');

function text(str, x, y, fill, stroke, maxWidth) {
  if (arguments.length === 6) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: stroke,
      text: str,
      maxWidth: maxWidth
    });
  }
  if (arguments.length === 5) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: stroke,
      text: str,
      maxWidth: 0
    });
  }

  if (arguments.length === 4) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: false,
      text: str,
      maxWidth: 0
    });
  }

  if (arguments.length === 3) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: true,
      stroke: false,
      text: str,
      maxWidth: 0
    });
  }

  return new Instruction('text', {
    x: 0,
    y: 0,
    fill: true,
    stroke: false,
    text: str,
    maxWidth: 0
  });
}

module.exports = text;
