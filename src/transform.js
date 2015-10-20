//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function transform(values, children) {

  var transformResult = [new Instruction('transform', new Float64Array(values))];
  for(var i = 1, len = arguments.length; i < len; i++) {
    transformResult.push(arguments[i]);
  }
  transformResult.push(new Instruction('restore'));

  return transformResult;
}


module.exports = transform;
