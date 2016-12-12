let Instruction = require('./Instruction');

let rect = (x, y, width, height) => new Instruction('rect',
  arguments.length > 2 ?
    { x, y, width, height } :
    { x: 0, y: 0, width: x, height: y }
);

module.exports = rect;
