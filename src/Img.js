//jshint node: true
//jshint browser: true
'use strict';

var path = require('path'),
    isWorker = require('./isWorker'),
    isDataUrl = require('./isDataUrl');

function Img(id) {
  this._src = "";
  this.isDataUrl = false;
  this.id = id || Date.now();
  this.buffer = new ArrayBuffer();
  this.onload = function() {};
  this.texture = null;
  this.type = 'image';
  this.blobOptions = {};
  Object.seal(this);
}
Img.cache = {};

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
    Img.cache[this.id] = img;
  }
  this.onload();
};

Img.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'image-dispose', value: { id: this.id }});
  } else {
    Image.cache[this.id] = null;
  }
};

Object.seal(Img);
Object.seal(Img.prototype);

module.exports = Img;