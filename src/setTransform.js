let Instruction = require('./Instruction');
let end = new Instruction('restore');

let setTransform = (matrix, ...children) => [
  new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ]),
  children,
  end
];

module.exports = setTransform;