'use strict';

function transformPoints(points, matrix) {
  var result = [],
      len = points.length,
      point;

  for(var i = 0; i < len; i++) {
    point = points[i];
    result.push([
      matrix[0] * point[0] + matrix[2] * point[1] + matrix[4],
      matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]
    ]);
  }
  return result;
}

module.exports = transformPoints;
