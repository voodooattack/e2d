let Instruction = require('./Instruction'),
    hitRegion = require('./hitRegion');

let hitRect = (id, ...args) => {
  let [x, y, width, height] = args;
  if (args.length <= 3) {
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