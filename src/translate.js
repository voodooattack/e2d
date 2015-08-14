//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function translate(x, y, children) {
  
  var result = [new Instruction('translate', { x: x, y: y })];
  var val;
  for (var i = 2; i < arguments.length; i++) {
    val = arguments[i];
    if (Array.isArray(val)) {
      result = result.concat(val);
      continue;
    }
    result.push(arguments[i]);
  }
  
  result.push(new Instruction('restore'));
  return result;
}

module.exports = translate;