

var Instruction = require('./Instruction');

function translate(x, y, children) {
  var result = [new Instruction('translate', { x: x, y: y })];

  for (var i = 2; i < arguments.length; i++) {
    result.push(arguments[i]);
  }

  result.push(new Instruction('restore'));
  return result;
}

module.exports = translate;
