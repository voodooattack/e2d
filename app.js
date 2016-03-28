var e2d = require('./index');


var r = e2d.Renderer.create(400, 400);


r.ready();
r.on('frame', function() {

  return r.render(
    e2d.clearRect(400, 400),
    e2d.translate(100, 100,
      e2d.rotate(Math.PI / 3,
        e2d.scale(2, 1,
          e2d.fillArc(20)
        )
      )
    )
  );
});
