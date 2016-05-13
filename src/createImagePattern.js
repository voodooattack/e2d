'use strict';

var ctx = document.createElement('canvas').getContext('2d'),
  Img = require('./Img');

function createImagePattern(img, type) {
  if (img) {
    return ctx.createImagePattern(
      //if the type is Img, use the imageElement property
      img.constructor === Img ? img.imageElement : img,
      type //'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
    );
  }
  return null;
}

module.exports = createImagePattern;
