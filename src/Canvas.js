//jshint node: true
//jshint browser: true
'use strict';

var isWorker = require('./isWorker'),
    Img = require('./Img'),
    flatten = require('lodash/array/flatten');

function Canvas(width, height, id) {
  this.id = id || Date.now();
  var Renderer = require('./Renderer');
  if (!isWorker) {
    this.renderer = new Renderer(width, height, document.createElement('div'));
  } else {
    this.renderer = null;
  }
  this.width = width;
  this.height = height;
  Object.seal(this);
}

Canvas.prototype.render = function render(children) {
  var result = [];
  for (var i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result = flatten(result);
  if (isWorker) {
    postMessage({ type: 'canvas', value: { id: this.id, width: this.width, height: this.height, children: result } });
  } else {
    this.renderer.render(children);
  }
};

Canvas.prototype.toImage = function toImage(imageID) {
  imageID = imageID || Date.now();
  var img;
  if (isWorker) {
    postMessage({ type: 'canvas-image', value: { id: this.id, imageID: imageID } });
    img = new Img();
    img.id = imageID;
    return img;
  } else {
    img = new Image();
    img.src = this.renderer.canvas.toDataURL('image/png');
    Img.cache[imageID] = img;
    return;
  }
};

Canvas.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'canvas-dispose', value: { id: this.id }});
  } else {
    Canvas.cache[this.id] = null;
  }
};

Canvas.prototype.resize = function (width, height) {
  return this.renderer.resize(width, height);
};

Canvas.cache = {};

Canvas.create = function (width, height, id) {
  return new Canvas(width, height, id);
};

Object.seal(Canvas);
Object.seal(Canvas.prototype);
module.exports = Canvas;
