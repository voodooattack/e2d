let Instruction = require('./Instruction'),
  cache = new Instruction('beginPath');

let beginPath = () => cache;

module.exports = beginPath;