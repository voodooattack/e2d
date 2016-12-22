let raf = (func) => {
  requestAnimationFrame(() => raf(func));
  return func();
};

module.exports = raf;