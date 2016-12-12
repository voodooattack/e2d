let Instruction = require('./Instruction');
let end = new Instruction('endImageSmoothingEnabled');

let imageSmoothingEnabled = (value, ...children) => [
  new Instruction('imageSmoothingEnabled', { value }),
  children,
  end
];
module.exports = imageSmoothingEnabled;
