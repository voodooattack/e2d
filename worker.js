//jshint node: true
'use strict';

var e2d = require('./index');
var r = new e2d.Renderer(800, 600);
var c = new e2d.Canvas(100, 100);
c.cache();
c.render(
  e2d.translate(50, 50,
    e2d.text("hello world")
  )
);

r.on('frame', function() {
  return r.render(
    e2d.clearRect(800, 600),
    
    e2d.fillCanvas(c, Math.random() * 10, Math.random() * 10, c.width, c.height)
  );
});

r.ready();