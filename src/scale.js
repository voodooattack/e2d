let Instruction = require('./Instruction');
let end = new Instruction('restore');

let scale = (x, y, ...children) => {
  var i = 2;
  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [
    new Instruction('scale', { x, y }),
    children,
    end
  ];
};

module.exports = scale;
