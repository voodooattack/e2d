let Instruction = require('./Instruction');
let end = new Instruction('restore');

let rotate = (r, ...children) => [
  new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }),
  children,
  end
];

module.exports = rotate;
