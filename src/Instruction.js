//jshint node: true
'use strict';
function Instruction(type, props) {
  this.type = type;
  this.props = props;
  Object.seal(this);
}


module.exports = Instruction;