'use strict';

var Instruction = require('./Instruction');

function addColorStop(offset, color) {
  return new Instruction('addColorStop', { offset: offset, color: color });
}

module.exports = addColorStop;
