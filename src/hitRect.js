let Instruction = require('./Instruction');

let hitRect = (id, ...args) => {
  let [x, y, width, height] = args;
  if (args.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return new Instruction('hitRect', {
    id,
    points: [
      [x, y],
      [x + width, y + height]
    ]
  });
};

module.exports = hitRect;