'use strict';

var Instruction = require('./Instruction');

module.exports = function placeHolder() {
  return new Instruction('placeholder');
};
