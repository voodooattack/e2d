'use strict';
var moveTo = require('./moveTo'), lineTo = require('./lineTo');
function moveToLineTo(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
}

module.exports = moveToLineTo;
