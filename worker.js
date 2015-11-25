var e2d = require('./index');
var r = e2d.Renderer.create(400, 400);
var img = new e2d.Img();
img.src = 'feelsgoodman.png';
img.on('load',function() {
		r.ready();
});
r.ready();
var i = 0;
r.on('frame', function() {
	i += 0.01;
	if (i > Math.PI * 2) {
		i -= Math.PI * 2;
	}
	r.render(
		e2d.clearRect(400, 400),
  	e2d.translate(200, 200,
			e2d.rotate(i,
				e2d.fillImage(img, -img.width * 0.5, -img.height * 0.5)
			)
		)
  );
});
