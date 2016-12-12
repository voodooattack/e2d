let Instruction = require('./Instruction');

let addColorStop = (offset, color) => new Instruction('addColorStop', { offset, color });  

module.exports = addColorStop;
