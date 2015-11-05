var e2d = require('../index');
var crel = require('crel');
var successfulList = crel('ul');
var failList = crel('ul');

crel(document.body,
  crel('div',
    crel('h1', 'Failed Tests'),
    failList,
    crel('h1', 'Successful Tests'),
    successfulList
  )
);

var framework = {
  r: e2d.Canvas.create(400, 400),
  ctx: null,
  cvs: null,
  test: function(name, width, height, commands, testcb) {
    this.r.resize(width, height);
    this.cvs = document.createElement('canvas');
    this.cvs.width = width;
    this.cvs.height = height;
    this.ctx = this.cvs.getContext('2d');
    this.r.render(e2d.clearRect(width, height));
    this.r.render(commands);
    testcb(this.ctx);
    var e2dImage = this.r.toImage().imageElement;

    var imgSrc1 = e2dImage.src;
    var imgSrc2 = this.cvs.toDataURL('image/png');

    var canvasImage = new Image();
    canvasImage.src = imgSrc2;

    var canvas1Data = this.r.renderer.ctx.getImageData(0, 0, width, height);
    var canvas2Data = this.ctx.getImageData(0, 0, width, height);

    var equals = true;
    var diff = 0;
    for(var i = 0; i < canvas1Data.data.length; i++) {
      if (canvas2Data.data[i] !== canvas1Data.data[i]) {
        equals = false;
        diff += Math.abs(canvas2Data.data[i] - canvas1Data.data[i]);
      }
    }
    diff /= canvas1Data.data.length;

    crel(document.body,
      crel('div',
        crel('h1', name),
        crel(e2dImage),
        crel(canvasImage),
        equals ? crel('b', 'Success!') : crel('b', 'Failed! Off by average: ', diff.toString())
      )
    );
    if (equals) {
      crel(successfulList,
        crel('li', crel('b', name), ' - Success!')
      );
    } else {
      crel(failList,
        crel('li', crel('b', name), ' - Failed! Off by average: ', diff.toString())
      );
    }
    return ;
  }
};

module.exports = framework;
