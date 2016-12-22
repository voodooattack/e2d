let Instruction = require('./Instruction');

let fillRect = (...args) => new Instruction('fillRect',
  args.length > 2 ?
    { x: args[0], y: args[1], width: args[2], height: args[3] } :
    { x: 0, y: 0, width: args[0], height: args[1] }
);

module.exports = fillRect;
