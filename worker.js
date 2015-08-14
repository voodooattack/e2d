//jshint node: true
'use strict';

var e2d = require('./index');
var r = new e2d.Renderer(800, 600);
var grd = e2d.createLinearGradient(0, 0, 100, 0, [
  e2d.addColorStop(0, 'green'),
  e2d.addColorStop(1, 'blue')
]);

grd.cache();
var strokeStyle = e2d.strokeStyle(grd, e2d.lineStyle({ lineWidth: 5 }, e2d.stroke()));
r.on('frame', function() {
  return r.render(
    e2d.clearRect(800, 600),
    e2d.translate(100, 100,
      e2d.scale(100,
        e2d.rotate(Math.PI,
          e2d.beginPath(),
          e2d.moveTo(0, 0),
          e2d.lineTo(1, 1),
          e2d.lineTo(0, 1),
          e2d.closePath()
        )
      ),
      strokeStyle
      
   )
  );
});

r.ready();