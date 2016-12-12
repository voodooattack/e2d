let Instruction = require('./Instruction'),
    hitRegion = require('./hitRegion');

let hitRect = (id, x, y, width, height) => {
  if (arguments.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return hitRegion(id, [
    [x, y],
    [x, y + height],
    [x + width, y + height],
    [x + width, y]
  ]);
};

module.exports = hitRect;