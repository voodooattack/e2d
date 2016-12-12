let Instruction = require('./Instruction');

let hitRegion = (id, points) => new Instruction('hitRegion', { id, points });

module.exports = hitRegion;
