let Instruction = require('./Instruction');

let arcTo = (x1, y1, x2, y2, r) => new Instruction('arcTo', { x1, y1, x2, y2, r });

module.exports = arcTo;
