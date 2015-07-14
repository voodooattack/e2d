//jshint node: true
'use strict';
var smm = require('square-matrix-multiply'),
    Instruction = require('./Instruction');

function transform(stack, children) {
  var t,
      i,
      val,
      cosVal,
      sinVal,
      sx,
      sy,
      result = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      props,
      transformResult = [],
      len = stack.length;
  for(i = 0; i < len; i++) {
    t = stack[i];
    
    if (t.hasOwnProperty('transform')) {
      result = smm(result, [
        [t.transform.a,t.transform.c,t.transform.e],
        [t.transform.b,t.transform.d,t.transform.f],
        [0,0,1]
      ]);
      continue;
    }
    
    if (t.hasOwnProperty('translate')) {
      sx = t.translate.x;
      sy = t.translate.y;
      
      result = smm(result, [
        [1, 0, sx],
        [0, 1, sy],
        [0, 0, 1]
      ]);
    }
    
    if (t.hasOwnProperty('scale')) {
      sx = t.scale.x;
      sy = t.scale.y;
      
      result = smm(result, [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
      ]);
    }
    
    if (t.hasOwnProperty('rotate')) {
      sinVal = Math.sin(t.rotate);
      cosVal = Math.cos(t.rotate);
      result = smm(result, [
        [cosVal, -sinVal, 0],
        [sinVal, cosVal, 0],
        [0, 0, 1]
      ]);
    }
  }
  props = {
    a: result[0][0],
    b: result[1][0],
    c: result[0][1],
    d: result[1][1],
    e: result[0][2],
    f: result[1][2]
  };
  return transformResult.concat(new Instruction('transform', props)).concat(children).concat([new Instruction('restore')]);
}
function copy(target, children) {
  var t = target[0];
  return [new Instruction('transform', {
    a: t.props.a,
    b: t.props.b,
    c: t.props.c,
    d: t.props.d,
    e: t.props.e,
    f: t.props.f
  })].concat(children).concat([new Instruction('restore')]);
}

transform.copy = copy;


module.exports = transform;