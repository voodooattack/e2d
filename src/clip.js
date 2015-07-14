//jshint node: true
'use strict';

var beginPath = require('./beginPath'),
    clipPath = require('./clipPath');

function clip(children) {
  return [beginPath()].concat(children).concat([clipPath()]);
}

module.exports = clip;