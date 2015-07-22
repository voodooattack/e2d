//jshint node: true
'use strict';

function transformPoints(points, matrix) {
  var result = [],
      len = points.length,
      point;

  for(var i = 0; i < len; i++) {
    point = points[i];
    result.push([
      matrix[0][0] * point[0] + matrix[0][1] * point[1] + matrix[0][2],
      matrix[1][0] * point[0] + matrix[1][1] * point[1] + matrix[1][2]
    ]);
  }
  return result;
}

module.exports = transformPoints;