//jshint node: true
'use strict';

function id() {
  return Date.now() + '-' + Math.random();
}

module.exports = id;