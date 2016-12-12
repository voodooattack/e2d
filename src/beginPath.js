//jshint node: true

let Instruction = require('./Instruction');
let cache = new Instruction('beginPath');
let beginPath = () => cache;

module.exports = beginPath;