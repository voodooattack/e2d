let Instruction = require('./Instruction');
let end = new Instruction('endFillStyle');

let fillStyle = (value, ...children) => [
    new Instruction('fillStyle', { value }),
    children,
    end
];

module.exports = fillStyle;
