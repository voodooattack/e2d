'use strict';

var Instruction = require('./Instruction');

function globalAlpha(alpha, children) {
  var result = [new Instruction('globalAlpha', { value: alpha })];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endGlobalAlpha'));
  return result;
}

module.exports = globalAlpha;
