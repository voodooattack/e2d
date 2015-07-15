//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function globalAlpha(alpha, children) {
    return [new Instruction('globalAlpha', { value: alpha })].concat(children).concat([new Instruction('endGlobalAlpha')]);
}

module.exports = globalAlpha;