'use strict';

var setTransform = require('./setTransform');

module.exports = function resetTransform() {
  var args = [];
  for(var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return setTransform([1, 0, 0, 1, 0, 0], args);
};
