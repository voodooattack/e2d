let pointInPolygon = require('point-in-polygon');

module.exports = (ctx) => {
  let regions = ctx.canvas[Symbol.for('regions')];
  let mousePoints = ctx.canvas[Symbol.for('mousePoints')];
  let mouseData = ctx.canvas[Symbol.for('mouseData')];
  let results = [];
  let found = false;

  for (let i = 0; i < regions.length; i++) {
    let region = regions[i];

    for(let j = 0; j < mousePoints.length; j++) {
      let mousePoint = mousePoints[j];

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