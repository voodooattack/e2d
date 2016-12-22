let Instruction = require('./Instruction');
let end = new Instruction('endStrokeStyle');

let strokeStyle = (value, ...children) => [
  new Instruction('strokeStyle', { value }),
  children,
  end
];

module.exports = strokeStyle;
