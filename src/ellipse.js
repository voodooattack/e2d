let Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

let ellipse = (...args) => {
  let [x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise] = args;

  let props = { x: 0, y: 0, radiusX: x, radiusY: y, rotation: 0, startAngle: 0, endAngle: pi2, anticlockwise: false };

  if (args.length > 5) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.anticlockwise = !!anticlockwise;
  }

  if (args.length > 4) {
    props.rotation = rotation;
  }

  if (args.length > 2){
    props.x = x;
    props.y = y;
    props.radiusX = radiusX;
    props.radiusY = radiusY;
  }

  return new Instruction("ellipse",  props);
};

module.exports = ellipse;
