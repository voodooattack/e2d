

let beginPath = require('./beginPath')(),
    closePath = require('./closePath')();

let path = (...children) => [
  beginPath,
  children,
  closePath
];

module.exports = path;
