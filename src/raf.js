let raf = (func) => {
  requestAnimationFrame(func);
  return func();
};

module.exports = raf;