let Instruction = require('./Instruction');

let lineTo = (x, y) => new Instruction('lineTo', { x, y });

module.exports = lineTo;
