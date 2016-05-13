'use strict';
var Instruction = require('./Instruction');

function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 7) {
    return new Instruction(anticlockwise ? 'anticlockwise-ellipse' : 'ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, startAngle: startAngle, endAngle: endAngle });
  }

  if (arguments.length === 7) {
    return new Instruction('ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length >= 5) {
    return new Instruction('full-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation });
  }
  if (arguments.length === 4) {
    return new Instruction('quick-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY });
  }
  return new Instruction('quick-ellipse', { x: 0, y: 0, radiusX: x, radiusY: y });
}

module.exports = ellipse;
