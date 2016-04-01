'use strict';
var ctx = require.context('./test/', true, /.js$/);

ctx.keys().forEach(function(key) {
  ctx(key);
});
