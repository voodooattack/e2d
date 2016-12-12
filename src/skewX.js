

var Instruction = require('./Instruction');

function skewX(x, children){
  var result = [new Instruction('skewX', { x: Math.tan(x) })];
  for (var i = 1; i < arguments.length; i++){
      result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
}

module.exports = skewX;
