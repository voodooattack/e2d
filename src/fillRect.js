let Instruction = require('./Instruction');

let fillRect = (x, y, width, height) => new Instruction('fillRect',
  arguments.length > 2 ? { x, y, width, height } : { x: 0, y: 0, width: x, height: y }
);

module.exports = fillRect;
