var e2d = require('../index');
var x = 100, y = 100,
  r = 10, startAngle = 0, endAngle = Math.PI;
module.exports = [
  {
    name: "fillArc(x, y, r, startAngle, endAngle, anticlockwise)",
    width: 200, height: 200,
    commands: e2d.fillArc(x, y, r, startAngle, endAngle, true),
    cb: function(ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, startAngle, endAngle, true);
      ctx.fill();
    }
  },
  {
    name: "fillArc(x, y, r, startAngle, endAngle)",
    width: 200, height: 200,
    commands: e2d.fillArc(x, y, r, startAngle, endAngle),
    cb: function(ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, startAngle, endAngle);
      ctx.fill();
    }
  },
  {
    name: "fillArc(x, y, r)",
    width: 200, height: 200,
    commands: e2d.fillArc(x, y, r),
    cb: function(ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    name: "fillArc(r)",
    width: 200, height: 200,
    commands: e2d.translate(x, y,
      e2d.fillArc(r)
    ),
    cb: function(ctx) {

      ctx.beginPath();
      ctx.translate(x, y);
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
];
