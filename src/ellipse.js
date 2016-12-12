

let Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

let ellipse = (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) => {
  let props = { x: 0, y: 0, radiusX: x, radiusY: y, startAngle: 0, endAngle: pi2, anticlockwise: false };

  if (arguments.length > 4) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.anticlockwise = !!anticlockwise;
  }

  if (arguments.length > 2){
    props.x = x;
    props.y = y;
    props.radiusX = radiusX;
    props.radiusY = radiusY;
  }

  return new Instruction("ellipse",  props);
};

module.exports = ellipse;
