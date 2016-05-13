'use strict';

var concat = [].concat;

function createClass() {
  var args = [], i;

  //copy the arguments to an array
  for(i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  for(i = 0; i < args.length; i++) {
    //parse and flatten the arguments
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args);
    }
    if (args[i] && args[i].type === 'placeholder') {
       // i is set to the placeholder index now
      break;
    }
  }
  return (function() {
    //store these variables at the top of the heap internally
    var start = args, end = start.splice(i + 1, args.length);

    //remove the placeholder
    start.pop();

    //return a function that wraps the arguments in the class instructions
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
