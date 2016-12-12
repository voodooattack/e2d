let concat = [].concat;

let createWrapper = (...args) => {
  let found = false;
  for(let i = 0; i < args.length; i++) {
    //parse and flatten the arguments
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args).filter(Boolean);
    }
    let { type } = args[i];
    if (type === 'placeholder') {
      found = true;

      // i is set to the placeholder index now
      break;
    }
  }

  if (!found) throw new Error('Could not find placeholder, did you forget the e2d.placeHolder() call?');
  return (...children) =>  args.splice(i, 1, children);
};

module.exports = concat;
