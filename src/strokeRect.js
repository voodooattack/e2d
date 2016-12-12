let Instruction = require('./Instruction');

function strokeRect(x, y, width, height) {
  return new Instruction('strokeRect',
    arguments.length > 2 ?
      { x, y, width, height } :
      { x: 0, y: 0, width: x, height: y }
  );
}

module.exports = strokeRect;
