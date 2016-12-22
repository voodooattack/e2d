let concat = [].concat;

let createWrapper = (...args) => {
  for(let i = 0; i < args.length; i++) {
    //parse and flatten the arguments
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args).filter(Boolean);
    }

    if (!args[i]) {
      continue;
    }

    let { type } = args[i];
    if (type === 'placeholder') {
      // i is set to the placeholder index now

      //now grab all the elements to the left of the placeHolder
      let left = args.splice(0, i);

      //remove the placeHolder from the array
      args.shift();

      return (...children) => [left, children, args];
    }
  }

  throw new Error('Could not find placeholder, did you forget the e2d.placeHolder() call?');
};

module.exports = concat;
