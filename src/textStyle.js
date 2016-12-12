

var Instruction = require('./Instruction');

function textStyle(value, children) {
  value = value || {};
  var result = {
    font: null,
    textAlign: null,
    textBaseline: null,
    direction: null
  };

  if (typeof value.font !== 'undefined') {
    result.font = value.font;
  }
  if (typeof value.textAlign !== 'undefined') {
    result.textAlign = value.textAlign;
  }
  if (typeof value.textBaseline !== 'undefined') {
    result.textBaseline = value.textBaseline;
  }
  if (typeof value.direction !== 'undefined') {
    result.direction = value.direction;
  }
  var tree = [new Instruction('textStyle', value)];
  for(var i = 1; i < arguments.length; i++) {
    tree.push(arguments[i]);
  }
  tree.push(new Instruction('endTextStyle'));
  return tree;
}

module.exports = textStyle;
