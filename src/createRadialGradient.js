'use strict';
var ctx = window.document.createElement('canvas').getContext('2d'),
  concat = [].concat;

function createRadialGradient(x0, y0, r0, x1, y1, r1) {
  var grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1),
    children = [];
  for(var i = 0; i < arguments.length; i++) {
    children.push(arguments[i]);
  }
  for(i = 0; i < children.length; i++) {
    //parse and flatten the arguments
    while (children[i] && children[i].constructor === Array) {
      children = concat.apply([], children);
    }
    var colorStop = children[i];
    if (colorStop && colorStop.type === 'addColorStop') {
      grd.addColorStop(colorStop.props.offset, colorStop.props.color);
    }
  }

  return grd;
}


module.exports = createRadialGradient;
