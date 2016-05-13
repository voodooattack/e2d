'use strict';

var Instruction = require('./Instruction');

function strokeText(text, x, y, maxWidth) {
  if (arguments.length < 4) {
    maxWidth = null;
  }
  if (arguments.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('strokeText', {
    text: text,
    x: x,
    y: y,
    maxWidth: maxWidth
  });
};

module.exports = strokeText;
