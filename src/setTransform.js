

var Instruction = require('./Instruction');

module.exports = function(matrix, children) {

  var result = [new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ])];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
};
