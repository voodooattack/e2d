//jshint node: true
'use strict';
var bulk = require('bulk-require');

module.exports = bulk('./src', ['*.js']);