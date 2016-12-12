let Instruction = require('./Instruction');
let cache = new Instruction('stroke');

let stroke = () => cache;
module.exports = stroke;
