var e2d = require('../index');

module.exports = [
  {
    name: "fillRect(x,y,width,height)",
    width: 200, height: 200,
    commands: e2d.fillRect(100, 100, 100, 100),
    cb: function(ctx) {
      ctx.fillRect(100, 100, 100, 100);
    }
  },
  {
    name: "fillRect(width,height)",
    width: 200, height: 200,
    commands: e2d.fillRect(100, 100),
    cb: function(ctx) {
      ctx.fillRect(0, 0, 100, 100);
    }
  },
];
