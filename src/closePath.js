//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function closePath() {
  return new Instruction('closePath');
}
module.exports = closePath;