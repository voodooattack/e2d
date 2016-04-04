var e2d = require('./index');


var r = e2d.Renderer.create(400, 400);

var i = 0;
r.ready();
r.on('frame', function() {
  i += 1;
  if (i > 360) {
    i -= 360;
  }
  return r.render(
    e2d.clearRect(400, 400),
    e2d.translate(100, 100,
      e2d.skewX(Math.PI * 2 * i / 360,
        e2d.fillArc(10)
      )
    )
  );
});
