

let Instruction = require('./Instruction');
let end = new Instruction('endGlobalAlpha');

let globalAlpha = (value, ...children) => [
  new Instruction('globalAlpha', { value }),
  children,
  end
];
module.exports = globalAlpha;
