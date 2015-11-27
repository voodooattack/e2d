//jshint node: true, browser: true, worker: true
'use strict';

function createLinearGradient(x0, y0, x1, y1, children) {
  var ctx = window.document.createElement('canvas').getContext('2d'),
    grd = ctx.createLinearGradient(x0, y0, x1, y1);
  for(var i = 0; i < children.length; i++) {
    var colorStop = children[i];
    grd.addColorStop(colorStop.props.offset, colorStop.props.color);
  }
  return grd;
}


module.exports = createLinearGradient;
