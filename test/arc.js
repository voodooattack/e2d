var e2d = require('../index');
var x = 100, y = 100,
  r = 10, startAngle = 0, endAngle = Math.PI;
module.exports = [
  {
    name: "arc(x, y, r, startAngle, endAngle, anticlockwise)",
    width: 200, height: 200,
    commands: [
      e2d.path(e2d.arc(x, y, r, startAngle, endAngle, true)),
      e2d.stroke()
    ],
    cb: function(ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, startAngle, endAngle, true);
      ctx.closePath();
      ctx.stroke();
    }
  },
  {
    name: "arc(x, y, r, startAngle, endAngle)",
    width: 200, height: 200,
    commands: [
      e2d.path(e2d.arc(x, y, r, startAngle, endAngle)),
      e2d.stroke()
    ],
    cb: function(ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, startAngle, endAngle);
      ctx.closePath();
      ctx.stroke();
    }
  },
  {
    name: "arc(x, y, r)",
    width: 200, height: 200,
    commands: [
      e2d.path(e2d.arc(x, y, r)),
      e2d.stroke()
    ],
    cb: function(ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
    }
  },
  {
    name: "arc(r)",
    width: 200, height: 200,
    commands: e2d.translate(x, y,
      e2d.path(e2d.arc(r)),
      e2d.stroke()
    ),
    cb: function(ctx) {
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
    }
  }
];
