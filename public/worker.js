//jshint worker: true, browser: true, undef: true, unused: true
/* global e2d, onmessage */
importScripts('standalone.js');

var r = e2d.Renderer.create(800, 600);
var img = new e2d.Img();
img.src = 'ship-sprite.png';

onmessage = function loop(e) {
  if (e.data.type !== 'frame') {
    return;
  }
  
  r.render(
    e2d.clearRect(800, 600),
    e2d.drawImage(img),
    e2d.translate(100, 0, [
      e2d.path([
        e2d.moveTo(0, 0),
        e2d.lineTo(100, 100),
        e2d.lineTo(0, 100)
      ]),
      e2d.stroke()
    ]),
    e2d.translate(200, 0, [
      e2d.fillStyle('red', [
        e2d.path([
          e2d.moveTo(0, 0),
          e2d.lineTo(100, 100),
          e2d.lineTo(0, 100)
        ]),
        e2d.fill()
      ])
    ]),
    e2d.translate(300, 20, [
      e2d.text('hello world!')
    ]),
    e2d.translate(400, 20, [
      e2d.text('other world!', 0, 0, false, true) //stroke
    ])
  );
};
img.onload = function() {
  postMessage({ type: 'ready' });
};