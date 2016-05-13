'use strict';

var Instruction = require('./Instruction');

function arc(x, y, r, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 5) {
    return new Instruction(anticlockwise ? 'anticlockwise-arc' : 'arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length === 5) {
    return new Instruction('arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length >= 3) {
    return new Instruction('full-arc', { x: x, y: y, r: r});
  }
  if (arguments.length >= 1) {
    return new Instruction('quick-arc', { r: x });
  }

  return new Instruction('quick-arc', { r: 1 });
}

module.exports = arc;
