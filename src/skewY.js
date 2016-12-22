let Instruction = require('./Instruction');
let end = new Instruction('restore');

let skewY = (x, ...children) => [
  new Instruction('skewY', { y: Math.tan(y) }),
  children,
  end
];

module.exports = skewY;
