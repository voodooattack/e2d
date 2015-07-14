//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

function strokeArc(x, y, r, startAngle, endAngle, counterclockwise) {
  if (arguments.length >= 6 && counterclockwise) {
    return new Instruction("strokeArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length > 3) {
    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  } 
  if (arguments.length > 1){
    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
  }
  return new Instruction("strokeArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
}

module.exports = strokeArc;