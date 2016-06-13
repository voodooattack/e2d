'use strict';
if (typeof window !== 'undefined') {
  var ctx = document.createElement('canvas').getContext('2d');
}

function measureText(text, font) {
  ctx.font = font;
  return ctx.measureText(text);
}

module.exports = measureText;
