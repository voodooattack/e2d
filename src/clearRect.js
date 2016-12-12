let Instruction = require('./Instruction');

let clearRect = (x, y, width, height) => new Instruction('clearRect',
  arguments.length > 2 ? { x, y, width, height } : { x: 0, y: 0, width: x, height: y }
);

module.exports = clearRect;
