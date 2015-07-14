//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function beginPath() {
  return new Instruction('beginPath');
}
module.exports = beginPath;