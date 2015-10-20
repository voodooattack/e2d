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
    e2d.clip(
      e2d.rect(100, 100, 100, 100),
      e2d.fillRect(200, 200)
    ),
    e2d.fillStyle('red',
      e2d.transform([1, 0.1, 0.1, 1, 150, 150],
        e2d.fillRect(100, 100),
        e2d.resetTransform(
          e2d.fillRect(100, 100)
        )
      )
    )
  );
});
