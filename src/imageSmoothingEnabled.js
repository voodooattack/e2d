'use strict';
var Instruction = require('./Instruction');

module.exports = function imageSmoothingEnabled(val, children) {
  children = [];
  for(var i = i; i < arguments.length; i++) {
    children.push(arguments[i]);
  }
  return [new Instruction('imageSmoothingEnabled', { value: Boolean(val) })].concat(children).concat(new Instruction('endImageSmoothingEnabled'));
};
