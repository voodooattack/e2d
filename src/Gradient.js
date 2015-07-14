//jshint node: true
'use strict';
var isWorker = require('./isWorker');

function Gradient(id, grd) {
  this.id = id;
  this.grd = grd;
  this.disposable = true;
  Object.seal(this);
}

Gradient.cache = {};

Gradient.prototype.cache = function() {
  this.disposable = false;
  
  if (isWorker) {
    postMessage({ type: 'gradient-cache', value: { id: this.id }});
  }
  
  return this;
};

Gradient.prototype.dispose = function() {
  if(isWorker) {
    return postMessage({ type: 'gradient-dispose', value: { id: this.id } });
  } else {
    Gradient.cache[this.id] = null;
    return;
  }
};

Object.seal(Gradient);
Object.seal(Gradient.prototype);

module.exports = Gradient;