'use strict';

var Instruction = require('./Instruction');

function clipPath() {
  return new Instruction('clipPath');
}
module.exports = clipPath;
