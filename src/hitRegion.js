'use strict';

var Instruction = require('./Instruction');

function hitRegion(id, points) {
  return new Instruction('hitRegion', {
    id: id,
    points: points
  });
}

module.exports = hitRegion;
