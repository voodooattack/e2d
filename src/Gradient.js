//jshint node: true, browser: true, worker: true
'use strict';
var isWorker = require('./isWorker');

function Gradient(id, grd) {
  this.id = id;
  this.grd = grd;
  Gradient.cache[id] = this;
  Object.seal(this);
}

Gradient.cache = {};
Gradient.cachable = [];
Gradient.prototype.cache = function cache() {
  if (isWorker) {
    postMessage({ type: 'gradient-cache', value: { id: this.id }});
  } else {
    Gradient.cachable.push(this.id);
  }
  return this;
};

Gradient.prototype.dispose = function dispose() {
  if(isWorker) {
    return postMessage({ type: 'gradient-dispose', value: { id: this.id } });
  } else {
    Gradient.cache[this.id] = null;
    var index = Gradient.cachable.indexOf(this.id);
    if (index !== -1) {
      Gradient.cachable.splice(index, 1);
    }
  }
};

Gradient.cleanUp = function cleanUp() {
  var index = {},
      key;
  for(var i = 0; i < Gradient.cachable.length; i++) {
    key = Gradient.cachable[i];
    index[key] = Gradient.cache[key];
  }
  
  Gradient.cache = index;
};

Object.seal(Gradient);
Object.seal(Gradient.prototype);

module.exports = Gradient;