//jshint node: true
'use strict';
function Instruction(type, props) {
  this.type = type;
  this.props = props;
  Object.seal(this);
}

Object.seal(Instruction);
Object.seal(Instruction.prototype);

module.exports = Instruction;