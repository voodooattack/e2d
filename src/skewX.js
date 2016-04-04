//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function skewX(x, children){
    var i = 1;
    var result = [new Instruction('skewX', {x: Math.tan(x)})]
    for (; i < arguments.length; i++){
        result.push(arguments[i]);
    }
    result.push(new Instruction('restore'));
    return result;
}

module.exports = skewX;
