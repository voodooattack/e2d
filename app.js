var e2d = require('./index');

var r = e2d.Renderer.create(400, 400);

r.ready();

var anchor = {x:0,y:0}, lastMousePosition = {x:0, y:0}, dragging = false;

r.on('frame', function() {
  var hovering = r.mouseData.activeRegions.indexOf('rect') !== -1;
  if (!dragging && hovering && r.mouseData.clicked) {
  	dragging = true;
  }
  if (dragging) {
    if (r.mouseData.state === 'up') {
    	dragging = false;
    } else {
      anchor.x += r.mouseData.x - lastMousePosition.x;
      anchor.y += r.mouseData.y - lastMousePosition.y;
    }
  }

  //set the cursor
  r.style({ cursor: hovering ? 'pointer' : null });
	lastMousePosition.x = r.mouseData.x;
  lastMousePosition.y = r.mouseData.y;
  return r.render(
    e2d.clearRect(400, 400),
    e2d.translate(anchor.x, anchor.y,
      e2d.fillRect(100, 100),
      e2d.hitRect('rect', 100, 100)
    )
  );
});
