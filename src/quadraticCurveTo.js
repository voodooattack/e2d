//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function quadraticCurveTo(cpx, cpy, x, y) {
  return new Instruction('quadraticCurveTo', {
    cpx: cpx, 
    cpy: cpy, 
    x: x, 
    y: y
  });
}

module.exports = quadraticCurveTo;