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
      result = new Float64Array([1, 0, 0, 1, 0, 0]),
      props,
      transformResult,
      len = stack.length;
  for(i = 0; i < len; i++) {
    t = stack[i];
    
    if (t.hasOwnProperty('transform')) {
      /*result = smm(result, [
        [t.transform.a,t.transform.c,t.transform.e],
        [t.transform.b,t.transform.d,t.transform.f],
        [0,0,1]
      ]);*/
      result[0] = result[0] * t.transform.a + result[2] * t.transform.b;
      result[1] = result[1] * t.transform.a + result[3] * t.transform.b;
      result[2] = result[0] * t.transform.c + result[2] * t.transform.d;
      result[3] = result[1] * t.transform.c + result[3] * t.transform.d;
      result[4] = result[0] * t.transform.e + result[2] * t.transform.f + result[4];
      result[5] = result[1] * t.transform.e + result[3] * t.transform.f + result[5];
      continue;
    }
    
    if (t.hasOwnProperty('translate')) {
      sx = t.translate.x;
      sy = t.translate.y;
      
      result[4] += result[0] * sx + result[2] * sy;
      result[5] += result[1] * sx + result[3] * sy;
    }
    
    if (t.hasOwnProperty('scale')) {
      sx = t.scale.x;
      sy = t.scale.y;
      result[0] *= sx;
      result[1] *= sx;
      result[2] *= sy;
      result[3] *= sy;
    }
    
    if (t.hasOwnProperty('rotate')) {
      sinVal = Math.sin(t.rotate);
      cosVal = Math.cos(t.rotate);
      
      result[0] = result[0] * cosVal + result[2] * -sinVal;
      result[1] = result[1] * cosVal + result[3] * -sinVal;
      result[2] = result[0] * sinVal + result[2] * cosVal;
      result[3] = result[1] * sinVal + result[3] * cosVal;
    }
  }
  props = {
    a: result[0],
    b: result[1],
    c: result[2],
    d: result[3],
    e: result[4],
    f: result[5]
  };
  
  transformResult = [new Instruction('transform', props)];
  for(i = 1; i < arguments.length; i++) {
    transformResult.push(arguments[i]);
  }
  transformResult.push(new Instruction('restore'));
  
  return transformResult;
}


module.exports = transform;