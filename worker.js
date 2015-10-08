var e2d = require('./index');

var r = new e2d.Renderer(800, 600);
var img = new e2d.Img();
img.src = 'feelsgoodman.png';
img.cache();
img.on('load', function() {
  r.ready();
});

r.on('frame', function() {
  r.render(
    e2d.fillImage(img, 100, 100, 100, 100, 100, 200, 100, 200)
  );
});
