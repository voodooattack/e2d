'use strict';
var Instruction = require('./Instruction');

module.exports = function(matrix, children) {
  var result = [new Instruction('setTransform', matrix)];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
};
