//jshint node: true
'use strict';

//This is an example that will run in your browser on port 8080.
//Feel free to try it out

var express = require('express'),
    browserify = require('browserify-middleware'),
    app = express();

app.use(express.static('public'));

app.get('/bundle.js', browserify('./app.js', { cache: false }));
app.get('/standalone.js', browserify('./index.js', { cache: false, standalone: 'e2d' }));

app.listen(8080);
