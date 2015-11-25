//jshint node: true, browser: true, worker: true
'use strict';

function createRadialGradient(x0, y0, r0, x1, y1, r1, children) {
  var ctx = window.document.createElement('canvas').getContext('2d'),
    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  for(var i = 4; i < arguments.length; i++) {
    var colorStop = children[i];
    grd.addColorStop(colorStop.props.offset, colorStop.props.color);
  }
  return grd;
}

module.exports = createRadialGradient;
