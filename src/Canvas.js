//jshint worker: true, browser: true, node: true
'use strict';

function Canvas(width, height) {

  var Renderer = require('./Renderer');
  this.renderer = new Renderer(width, height, window.document.createElement('div'));
  this.fillPattern = null;
  this.skipPatternCreation = false;

  return Object.seal(this);
}

Canvas.prototype.render = function render(children) {
  var result = [],
      i;
  for (i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }

  this.renderer.render(result);
  if (!this.skipPatternCreation) {
    this.fillPattern = this.renderer.ctx.createPattern(this.renderer.canvas, 'no-repeat');
  }
  return this;
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
  return this.renderer.toImage();
};

Canvas.prototype.resize = function resize(width, height) {
  this.renderer.resize(+width, +height);
  return this;
};

Object.defineProperty(Canvas.prototype, 'height', {
  get: function() {
    return this.renderer.canvas.width;
  },
  enumerable: true,
  configurable: false
});

Object.defineProperty(Canvas.prototype, 'width', {
  get: function() {
    return this.renderer.canvas.width;
  },
  enumerable: true,
  configurable: false
});


Canvas.create = function create(width, height, id) {
  return new Canvas(width, height, id);
};


Object.seal(Canvas);
Object.seal(Canvas.prototype);
module.exports = Canvas;
