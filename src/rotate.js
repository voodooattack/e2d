//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function rotate(r, children) {
  r = +r;
  var result = [new Instruction('rotate', { r: r })];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
}

module.exports = rotate;