
var Instruction = require('./Instruction');

function fillStyle(value, children) {
  var result = [new Instruction('strokeStyle', { value: value })];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endStrokeStyle'));
  return result;
}

module.exports = fillStyle;
