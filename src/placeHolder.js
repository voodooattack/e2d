let Instruction = require('./Instruction');

let cache = new Instruction('placeholder');
let placeHolder = () => cache;

module.exports = placeHolder;
