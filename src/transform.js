'use strict';

var Instruction = require('./Instruction');

function transform(values, children) {
  var transformResult = [
    new Instruction('transform',[
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5]
    ])
  ];
  for(var i = 1; i < arguments.length; i++) {
    transformResult.push(arguments[i]);
  }
  transformResult.push(new Instruction('restore'));

  return transformResult;
}


module.exports = transform;
