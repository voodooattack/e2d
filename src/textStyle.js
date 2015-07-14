//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function textStyle(value, children) {
  value = value || {};
  var result = {
    font: null,
    textAlign: null,
    textBaseline: null,
    direction: null
  };
  
  if (typeof value.font !== 'undefined') {
    result.font = value.font; 
  }
  if (typeof value.textAlign !== 'undefined') {
    result.textAlign = value.textAlign; 
  }
  if (typeof value.textBaseline !== 'undefined') {
    result.textBaseline = value.textBaseline; 
  }
  if (typeof value.direction !== 'undefined') {
    result.direction = value.direction; 
  }
  return [new Instruction('textStyle', value)].concat(children).concat([new Instruction('endTextStyle')]);
}

module.exports = textStyle;