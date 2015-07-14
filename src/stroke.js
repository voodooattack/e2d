//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function stroke() {
  return new Instruction('stroke');
}

module.exports = stroke;