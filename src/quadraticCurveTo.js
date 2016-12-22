let Instruction = require('./Instruction');

let quadraticCurveTo = (cpx, cpy, x, y) => new Instruction('quadraticCurveTo', {
  cpx,
  cpy,
  x,
  y
});

module.exports = quadraticCurveTo;
