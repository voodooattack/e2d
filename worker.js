var e2d = require('./index');
var r = e2d.Renderer.create(400, 400);
var result = [e2d.beginPath()];
for(var x = 0; x <= 10; x ++) {
	result.push(
  	e2d.moveTo(x * 5, 0),
    e2d.lineTo(x * 5, 10 * 5)
  );
}

for(var y = 0; y <= 10; y ++) {
  result.push(
  	e2d.moveTo(0, y * 5),
    e2d.lineTo(10 * 5, y * 5)
  );
}

r.ready();
var position = {
  x: 100,
  y: 100,
  r: 1,
  width: 10 * 5,
  height: 10 * 5,
  scale: {
    x: 2,
    y: 1
  },
  center: {
    x: 0,
    y: 0
  }
};
r.on('frame', function() {
	r.render(
  	e2d.translate(position.x, position.y,
      //e2d.rotate(position.r,
        e2d.scale(position.scale.x, position.scale.y,
          e2d.translate(-position.center.x * position.width, -position.center.y * position.height,
          	result
          )
        )
      //)
    ), e2d.lineStyle({ lineWidth: 5 }, e2d.stroke())
  );
});
