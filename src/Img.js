'use strict';

var path = require('path'),
    events = require('events');

function Img() {
  events.EventEmitter.call(this);
  this.imageElement = null;
  this.imagePattern = null;
  this.imagePatternRepeat = null;

  return Object.seal(this);
}

Img.prototype = Object.create(events.EventEmitter.prototype);

Object.defineProperty(Img.prototype, 'src', {
  set: function(val) {

    var element = new Image();
    this.imageElement = element;
    element.src = val;

    if (element.complete) { //firefox compatibility code
      setTimeout(this.imageLoad.bind(this), 0);
    } else {
      element.onload = this.imageLoad.bind(this);
    }
  },
  get: function() {
    return this.imageElement.src;
  }
});

Img.prototype.imageLoad = function imageLoad() {

  var ctx = window.document.createElement('canvas').getContext('2d');
  this.imagePattern = ctx.createPattern(this.imageElement, 'no-repeat');
  this.imagePatternRepeat = ctx.createPattern(this.imageElement, 'repeat');

  return this.emit('load', this);
};

Object.defineProperty(Img.prototype, 'width', {
  enumerable: true,
  get: function() {
    return this.imageElement.width;
  },
  set: function(value) {
    this.imageElement.width = value;
  }
});

Object.defineProperty(Img.prototype, 'height', {
  enumerable: true,
  get: function() {
    return this.imageElement.height;
  },
  set: function(value) {
    this.imageElement.height = value;
  }
});

Object.seal(Img);
Object.seal(Img.prototype);

module.exports = Img;
