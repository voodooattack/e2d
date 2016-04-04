//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function skewY(y, children){
    var i = 1;
    var result = [new Instruction('skewY', {y: Math.tan(y)})]
    for (; i < arguments.length; i++){
        result.push(arguments[i]);
    }
    result.push(new Instruction('restore'));
    return result;
}

module.exports = skewY;
