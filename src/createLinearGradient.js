//jshint node: true, browser: true
'use strict';
var isWorker = require('./isWorker'),
    Gradient = require('./Gradient');

createLinearGradient.cache = {};

function createLinearGradient(x0, y0, x1, y1, children, id) {
  id = id || Date.now();
  
  if (isWorker) {
    postMessage({ type: 'linear-gradient', value: { id: id, x0: x0, y0: y0, x1: x1, y1: y1, children: children } });
    return new Gradient(id, null);
  } else {
    var ctx = document.createElement('canvas').getContext('2d'),
      grd = ctx.createLinearGradient(x0, y0, x1, y1),
      colorStop,
      result = new Gradient(id, grd);
    for(var i = 0; i < children.length; i++) {
      colorStop = children[i];
      grd.addColorStop(colorStop.props.offset, colorStop.props.color);
    }
    Gradient.cache[id] = result;
    return result; 
  }
}


module.exports = createLinearGradient;