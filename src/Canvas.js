//jshint worker: true, browser: true, node: true
'use strict';

var isWorker = require('./isWorker'),
    Img = require('./Img'),
    newid = require('./id');

function Canvas(width, height, id) {
  this.id = id || newid();
  var Renderer = require('./Renderer');
  if (!isWorker) {
    this.renderer = new Renderer(width, height, window.document.createElement('div'));
  } else {
    postMessage({ type: 'canvas', value: { id: this.id, width: this.width, height: this.height, children: [] } });
    this.renderer = null;
  }
  this.fillPattern = null;
  this._skipPatternCreation = false;
  Canvas.cache[this.id] = this;
  Object.seal(this);
}

Canvas.prototype.render = function render(children) {
  var result = [],
      i,
      len,
      child,
      concat = result.concat;
  for (i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  for(i = 0, len = result.length; i < len; i++) {
    child = result[i];
    if (child && child.constructor === Array) {
      result = concat.apply([], result);
      child = result[i];
      while(child && child.constructor === Array) {
        result = concat.apply([], result);
        child = result[i];
      }
      len = result.length;
    }
  }
  if (isWorker) {
    postMessage({ type: 'canvas', value: { id: this.id, width: this.width, height: this.height, children: result } });
  } else {
    this.renderer.render(result);
    if (!this._skipPatternCreation) {
      this.fillPattern = this.renderer.ctx.createPattern(this.renderer.canvas, 'no-repeat');
    }
  }
};

Canvas.prototype.style = function style() {
  var defs = [];
  for (var i = 0; i < arguments.length; i++) {
    defs.push(arguments[i]);
  }
  this.renderer.style.apply(this.renderer, defs);
  return this;
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
    postMessage({ type: 'canvas-cache', value: { id: this.id }});
  } else if (Canvas.cachable.indexOf(this.id) === -1) {
    Canvas.cachable.push(this.id);
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

Canvas.prototype.resize = function resize(width, height) {

  if (isWorker) {
    postMessage({ type: 'canvas-resize', value: { id: this.id, width: +this.width, height: +this.height }});
  } else {
    this.renderer.resize(+width, +height);
  }

  return this;
};

Object.defineProperty(Canvas.prototype, 'height', {
  get: function() {
    return this.renderer.canvas.width;
  },
  enumerable: true,
  configurable: false
});

Object.defineProperty(Canvas.prototype, 'skipPatternCreation', {
  get: function() {
    return this._skipPatternCreation;
  },
  set: function(value) {
    this._skipPatternCreation = value;
    if (isWorker) {
      return postMessage({ type: 'canvas-skipPatternCreation', value: { id: this.id, value: value } });
    }
  }
});

Object.defineProperty(Canvas.prototype, 'width', {
  get: function() {
    return this.renderer.canvas.width;
  },
  enumerable: true,
  configurable: false
});

Canvas.cache = {};
Canvas.cachable = [];

Canvas.create = function create(width, height, id) {
  return new Canvas(width, height, id);
};


Object.seal(Canvas);
Object.seal(Canvas.prototype);
module.exports = Canvas;
