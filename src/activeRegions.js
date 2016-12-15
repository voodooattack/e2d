let pointInPolygon = require('point-in-polygon');

module.exports = (ctx) => {
  let regions = ctx.canvas[Symbol.for('regions')];
  let mousePoints = ctx.canvas[Symbol.for('mousePoints')];
  let mouseData = ctx.canvas[Symbol.for('mouseData')];
  let results = [];
  let found = false;

  //the mouse might have held still, add the current mouse position
  regions.push([mouseData.x, mouseData.y]);

  for(let region of regions) {
    for(let mousePoint of mousePoints) {

      if (pointInPolygon(mousePoint, region.points)) {
        region.hover = true;
        region.clicked = !!mouseData.clicked;
        results.push(region);
        found = true;
      }

      if (found) {
        break;
      }
    }
  }
  return results;
};