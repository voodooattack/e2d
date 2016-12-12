let Instruction = require('./Instruction');

function lineTo (x, y) {
  if (arguments.length === 0) {
    return new Instruction('lineTo', { x: 0, y: 0 });
  }
  return new Instruction('lineTo', { x, y });
}

module.exports = lineTo;
