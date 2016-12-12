let Instruction = require('./Instruction');

let moveTo = (x, y) => {
  if (arguments.length === 0) {
    return new Instruction('moveTo', { x: 0, y: 0 });
  }
  return new Instruction('moveTo', { x, y });
};

module.exports = moveTo;
