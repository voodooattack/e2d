'use strict';
var concat = [].concat;

function createClass() {
  var args = [], i;
  for(i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  for(i = 0; i < args.length; i++) {
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args);
    }
    if (args[i] && args[i].type === 'placeholder') {
       // remove the placeholder
      break;
    }
  }
  return (function() {
    var start = args, end = start.splice(i + 1, args.length);
    start.pop();
    return function createdClass() {
      var children = [], i;
      for(i = 0; i < arguments.length; i++) {
        children.push(arguments[i]);
      }
      return [
        start, children, end
      ];
    };
  }());
}

module.exports = createClass;
