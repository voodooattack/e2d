//jshint node: true, browser: true
'use strict';
var isWorker = require('./isWorker'),
    Gradient = require('./Gradient');

function createRadialGradient(x0, y0, r0, x1, y1, r1, children, id) {
  id = id || Date.now();
  
  if (isWorker) {
    postMessage({ 
      type: 'radial-gradient', 
      value: { id: id, x0: x0, r0: r0, y0: y0, x1: x1, y1: y1, r1: r1, children: children } 
    });
    return new Gradient(id, null);
  } else {
    var ctx = document.createElement('canvas').getContext('2d'),
      grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1),
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


module.exports = createRadialGradient;