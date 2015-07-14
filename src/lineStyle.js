//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function lineStyle(value, children) {
  value = value || {};
  var result = {
    strokeStyle: null,
    lineWidth: null,
    lineCap: null,
    lineJoin: null,
    miterLimit: null,
    lineDash: [],
    lineDashOffset: null
  };
  
  if (typeof value.strokeStyle !== 'undefined') {
    result.strokeStyle = value.strokeStyle; 
  }
  if (typeof value.lineWidth !== 'undefined') {
    result.lineWidth = value.lineWidth;
  }
  if (typeof value.lineCap !== 'undefined') {
    result.lineCap = value.lineCap;
  }
  if (typeof value.lineJoin !== 'undefined') {
    result.lineJoin = value.lineJoin;
  }
  if (typeof value.miterLimit !== 'undefined') {
    result.miterLimit = value.miterLimit;
  }
  if (typeof value.lineDash !== 'undefined') {
    result.lineDash = value.lineDash;
  }
  if (typeof value.lineDashOffset !== 'undefined') {
    result.lineDashOffset = value.lineDashOffset;
  }
  
  return [new Instruction('lineStyle', result)].concat(children).concat([new Instruction('endLineStyle')]);
}

module.exports = lineStyle;