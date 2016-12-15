let Instruction = require('./Instruction');

let strokeText = (...args) => {
  let [text, x, y, maxWidth] = args;

  if (args.length < 4) {
    maxWidth = null;
  }
  if (args.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('strokeText', {
    text,
    x,
    y,
    maxWidth
  });
};

module.exports = strokeText;