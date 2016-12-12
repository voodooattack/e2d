let createRegularPolygon = (radius, position, sides) => {
  radius = +radius || 1;
  position[0] = +position[0] || 0;
  position[1] = +position[1] || 0;
  sides = +sides || 3;
  let polygon = [];
  for(let i = 0; i < sides; i++) {
    polygon.push([
      position[0] + radius * Math.cos(Math.PI * 2 * i / sides),
      position[1] + radius * Math.sin(Math.PI * 2 * i / sides)
    ]);
  }
  return polygon;
};

module.exports = createRegularPolygon;
