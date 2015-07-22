//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function shadowStyle(value, children) {
  value = value || {};
  var result = {
    shadowBlur: null,
    shadowColor: null,
    shadowOffsetX: null,
    shadowOffsetY: null
  };
  
  if (typeof value.shadowBlur !== 'undefined') {
    result.shadowBlur = value.shadowBlur; 
  }
  if (typeof value.shadowColor !== 'undefined') {
    result.shadowColor = value.shadowColor; 
  }
  if (typeof value.shadowOffsetX !== 'undefined') {
    result.shadowOffsetX = value.shadowOffsetX; 
  }
  if (typeof value.direction !== 'undefined') {
    result.shadowOffsetY = value.shadowOffsetY; 
  }
  
  var tree = [new Instruction('shadowStyle', value)];
  for (var i = 1; i < arguments.length; i++) {
    tree.push(arguments[i]);
  }
  tree.push(new Instruction('endShadowStyle'));
  
  return tree;
}

module.exports = shadowStyle;