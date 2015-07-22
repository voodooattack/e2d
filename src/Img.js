//jshint node: true, browser: true, worker: true
'use strict';

var path = require('path'),
    isWorker = require('./isWorker'),
    isDataUrl = require('./isDataUrl'),
    newid = require('./id');

function Img(id) {
  this._src = "";
  this.isDataUrl = false;
  this.id = id || newid();
  this.buffer = new ArrayBuffer();
  this.onload = function() {};
  this.texture = null;
  this.type = 'image';
  this.blobOptions = {};
  Object.seal(this);
}
Img.cache = {};
Img.cachable = [];
Object.defineProperty(Img.prototype, 'src', {
  set: function(val) {
    if (typeof window !== 'undefined') {
      return;
    }
    var self = this;
    this._src = val;
    this.isDataUrl = isDataUrl(val);
    if (this.isDataUrl) {
      this.id = Date.now().toString();
      this.makeDataUrl();
    } else {
      this.id = val;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', val, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        self.buffer = this.response;
        self.blobOptions = { type: 'image/' + path.extname(self._src).slice(1) };
        self.generateTexture(this.response, self.blobOptions);
      };
      xhr.send();
    }
  },
  get: function() {
    return this._src;
  }
});
Img.prototype.generateTexture = function generateTexture(buffer, options) {
  var msg = {
      type: 'image',
      value: {
        buffer: buffer,
        opts: options,
        id: this.id
      }
    }, 
    img;
  if (isWorker) {
    postMessage(msg, [buffer]);
  } else {
    img = new Image();
    img.src = (window.URL || window.webkitURL).createObjectURL(new Blob([buffer], options));
  }
  this.onload();
};

Img.prototype.cache = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'image-cache', value: { id: this.id }});
  } else {
    Image.cachable.push(this.id);
  }
  return this;
};

Img.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'image-dispose', value: { id: this.id }});
  } else {
    Image.cache[this.id] = null;
    var index = Image.cachable.indexOf(this.id);
    if (index !== -1) {
      Image.cachable.splice(index, 1);
    }
  }
};

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