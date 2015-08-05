//jshint node: true
'use strict';

var e2d = require('./index');
var r = new e2d.Renderer(800, 600);
var img = new e2d.Img().cache();

img.src = 'service6.png';
img.once('load', function() {
  r.ready();
});
r.on('frame', function() {
  return r.render(
    e2d.fillRect(800, 600),
    e2d.fillImagePattern(img, 200, 200, 800, 600)
    
  );
});