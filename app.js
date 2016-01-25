var e2d = require('./index');


var r = e2d.Renderer.create(400, 400);

var drawCommand = e2d.fillArc(10);

for (var i = 0; i < 100; i++) {
  drawCommand = e2d.translate(1,1, drawCommand);
}

r.ready();
r.on('frame', function() {

  return r.render(
    e2d.clearRect(400, 400),
    drawCommand,
    drawCommand
  );
});
