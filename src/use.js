module.exports = (ctx) => {
  let { canvas } = ctx;

  //mouseData
  canvas[Symbol.for('mouseData')] = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    previousX: 0,
    previousY: 0,
    state: 'up',
    clicked: 0
  };

  //mouse regions
  canvas[Symbol.for('regions')] = [];
  canvas[Symbol.for('mousePoints')] = [];

  //make the canvas receive touch and mouse events
  canvas.tabIndex = 1;

  let mouseMove = (evt) => {
    let { clientX, clientY } = evt;
    //get left and top coordinates
    let { left, top } = canvas.getBoundingClientRect();

    let point = [clientX - left, clientY - top];

    let mouseData = canvas[Symbol.for('mouseData')];
    mouseData.x = point[0];
    mouseData.y = point[1];

    //store the mouse position for hover detection
    canvas[Symbol.for('mousePoints')].push(point);
    evt.preventDefault();
    return false;
  };

  canvas.addEventListener('mousemove', (evt) => mouseMove(evt));
  canvas.addEventListener('mousedown', (evt) => {
    let { target } = evt;
    if (target === canvas) {
      let mouseData = canvas[Symbol.for('mouseData')];

      if (mouseData.state === 'up') {
        mouseData.clicked += 1;
      }

      mouseData.state = 'down';
      return mouseMove(evt);
    }
  });
  canvas.addEventListener('mouseup', (evt) => {
    let mouseData = canvas[Symbol.for('mouseData')];
    mouseData.state = 'up';
    return mouseMove(evt);
  });
};