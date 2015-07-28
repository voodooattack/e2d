//jshint worker: true, browser: true, node: true
'use strict';

var isWorker = require('./isWorker'),
    Img = require('./Img'),
    flatten = require('lodash/array/flatten'),
    newid = require('./id');

function Canvas(width, height, id) {
  this.id = id || newid();
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
    this.renderer.render(result);
  }
};

Canvas.prototype.toImage = function toImage(imageID) {
  
  var img;
  img = new Img(imageID || newid());
  
  if (isWorker) {
    postMessage({ type: 'canvas-image', value: { id: this.id, imageID: imageID } });
    return img;
  } else {
    img.src = this.renderer.canvas.toDataURL('image/png');
    return img;
  }
};

Canvas.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'canvas-dispose', value: { id: this.id }});
  } else {
    Canvas.cache[this.id] = null;
    var index = Canvas.cachable.indexOf(this.id);
    if (index > -1) {
      Canvas.cachable.splice(index, 1);
    }
  }
};

Canvas.prototype.cache = function cache() {
  if (isWorker) {
    return postMessage({ type: 'canvas-cache', value: { id: this.id }});
  } else {
    var index = Canvas.cachable.indexOf(this.id);
    if (index === -1) {
      Canvas.cachable.push(this.id);
    }
  }
  return this;
};

Canvas.cleanUp = function cleanUp() {
  var index = {},
      key;
  for(var i = 0; i < Canvas.cachable.length; i++) {
    key = Canvas.cachable[i];
    index[key] = Canvas.cache[key];
  }
  
  Canvas.cache = index;
};

Canvas.prototype.resize = function (width, height) {
  return this.renderer.resize(width, height);
};

Canvas.cache = {};
Canvas.cachable = [];

Canvas.create = function (width, height, id) {
  return new Canvas(width, height, id);
};

Object.seal(Canvas);
Object.seal(Canvas.prototype);
module.exports = Canvas;
