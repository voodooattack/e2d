let Instruction = require('./Instruction');

function rect (x, y, width, height) {
  return new Instruction('rect',
    arguments.length > 2 ?
      { x, y, width, height } :
      { x: 0, y: 0, width: x, height: y }
  );
}

module.exports = rect;
