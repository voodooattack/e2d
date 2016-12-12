let Instruction = require('./Instruction');
let end = new Instruction('endStrokeStyle');

let fillStyle = (value, ...children) => [
  new Instruction('strokeStyle', { value }),
  children,
  end
];

module.exports = fillStyle;
