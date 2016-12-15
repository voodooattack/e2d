let Instruction = require('./Instruction');

let moveTo = (x, y) => new Instruction('moveTo', { x, y });

module.exports = moveTo;
