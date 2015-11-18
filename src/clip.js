//jshint node: true
'use strict';

var Instruction = require('./Instruction');

function clip(path, children) {
  var result = [new Instruction('beginClip'), path, new Instruction('clip')];

  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }

  result.push(new Instruction('endClip'));
  return result;
}

module.exports = clip;
