let setTransform = require('./setTransform');

let resetTransform = (...children) => setTransform([1, 0, 0, 1, 0, 0], children);

module.exports = resetTransform;