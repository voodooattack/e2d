//jshint node: true, browser: true, worker: true
'use strict';

var path = require('path'),
    isWorker = require('./isWorker'),
    isDataUrl = require('./isDataUrl'),
    events = require('events'),
    util = require('util'),
    newid = require('./id');

util.inherits(Img, events.EventEmitter);

function Img(id) {
  events.EventEmitter.call(this);
  this._src = "";
  this.isDataUrl = false;
  this.id = id || newid();
  this.buffer = new ArrayBuffer();
  this.onload = function() {};
  this.texture = null;
  this.type = 'image';
  this.blobOptions = {};
  this.imageElement = null;
  this.imagePattern = null;
  this.imagePatternRepeat = null;
  if (isWorker) {
    postMessage({ type: 'image', value: { id: this.id, src: '' } });
  }
  Object.seal(this);
}
Img.cache = {};
Img.cachable = [];
Object.defineProperty(Img.prototype, 'src', {
  set: function(val) {
    this.isDataUrl = isDataUrl(val);
    if (isWorker) {
      Img.cache[this.id] = this;
      postMessage({ type: 'image-source', value: { id: this.id, src: val } });
      return;
    }
    var element = new window.Image();
    this.imageElement = element;
    element.src = val;
    element.onload = this.imageLoad.bind(this);
  },
  get: function() {
    return this._src;
  }
});

Img.prototype.imageLoad = function imageLoad() {
  if (!isWorker) {
    var ctx = window.document.createElement('canvas').getContext('2d');
    this.imagePattern = ctx.createPattern(this.imageElement, 'no-repeat');
    this.imagePatternRepeat = ctx.createPattern(this.imageElement, 'repeat');
  }
  Img.cache[this.id] = this;
  return this.emit('load', this);
};

Img.prototype.cache = function dispose() {
  if (isWorker) {
    postMessage({ type: 'image-cache', value: { id: this.id }});
  } else {
    Img.cachable.push(this.id);
  }
  return this;
};

Img.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'image-dispose', value: { id: this.id }});
  } else {
    Img.cache[this.id] = null;
    var index = Img.cachable.indexOf(this.id);
    if (index !== -1) {
      Img.cachable.splice(index, 1);
    }
  }
};

Object.defineProperty(Img.prototype, 'width', {
  enumerable: true,
  get: function() {
    return this.texture.width;
  },
  set: function(value) {
    this.texture.width = value;
  }
});


Object.defineProperty(Img.prototype, 'height', {
  enumerable: true,
  get: function() {
    return this.texture.height;
  },
  set: function(value) {
    this.texture.height = value;
  }
});

Img.cleanUp = function cleanUp() {
  var index = {},
      key;
  for(var i = 0; i < Img.cachable.length; i++) {
    key = Img.cachable[i];
    index[key] = Img.cache[key];
  }
  
  Img.cache = index;
};



Object.seal(Img);
Object.seal(Img.prototype);

module.exports = Img;