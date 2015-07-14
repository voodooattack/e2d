//jshint worker: true, browser: true, undef: true, unused: true
/* global e2d, onmessage */
importScripts('standalone.js');

var r = e2d.Renderer.create(800, 600);


var grd = e2d.createRadialGradient(0, 0, 0, 200, 0, 200, [
  e2d.addColorStop(0, 'green'),
  e2d.addColorStop(1, 'white')
]).cache();

onmessage = function loop(e) {
  if (e.data.type !== 'frame') {
    return;
  }
  
  r.render(
    e2d.clearRect(800, 600),
    e2d.fillStyle(grd, [
      e2d.fillRect(200, 200)
    ])
  );
};

postMessage({ type: 'ready' });
