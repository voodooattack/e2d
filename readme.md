# e2d.js

A canvas rendering engine HEAVILY inspired by `react.js` to help enforce one way data flow patterns.

# Introduction

Most canvas libraries abstract away different aspect of canvas to make you faster.  When using this library, there isn't much abstraction. In fact, the api mirrors the canvas2d api in a way makes coding canvas actually fun!

The coolest part of this library is the ability to do your application logic _inside a web worker_.

That's right. In a web worker.

When using this library, you'll probably want to do something like this:

```javascript
var e2d = require('e2d'),
  width = 800,
  height = 600,
  r = e2d.Renderer.create(width, height);

var translate = e2d.translate,
  fillText = e2d.fillText;

function gameLoop() {
  requestAnimationFrame(gameLoop);
  
  r.render(
    //tree structure goes here
    translate(100, 100, [
      fillText("Hello World!")
    ])
  );
}

gameLoop();
```

Or if you are working inside a web worker...

```javascript
//in your app browser side
var r = e2d.Renderer.create(800, 600, document.body, 'worker.js');
//seriously, that's it
```

```javascript
//inside the web worker
importScripts('e2d.min.js');

var r = e2d.Renderer.create(800, 600);

onmessage = function loop(e) {
  if (e.data.type !== 'frame') {
    return;
  }
  
  r.render(
    //tree structure goes here
    translate(100, 100, [
      fillText("Hello World!")
    ])
  );
};

```

Using a drawing tree allows you to create (pseudo)immutable data structures that can be saved.  It allows you to reason better about your code. For instance:

```javascript
//create a drawImage array to store the frame commands
var spriteSheet = arrayOfImages.map(function(imageElement) {
  return drawImage(imageElement);
});

//store some data about how your game loop works
var imageData = {
  x: 0,
  y: 0,
  frameCount: 0
};
var frame = 0;

function gameLoop() {
  requestAnimationFrame(gameLoop);
  
  //do something every frame
  frame += 1;
  if (frame > 60) {
    frame -=60;
  }
  imageData.x = 100 + Math.cos(Math.PI * 2 / 60 * frame) * 100;
  imageData.y = 100 + Math.sin(Math.PI * 2 / 60 * frame) * 100;
  imageData.frameCount += 1;
  while (imageData.frameCount >= spriteSheet.length) {
    imageData.frameCount -= spriteSheet.length;
  }
  
  //render your tree
  r.render(
    translate(imageData.x, imageData.y, [
      //draw command is already made! 
      spriteSheet[imageData.frameCount]
    ])
  );
}

gameLoop();

```

Also building classes is as easy as making a single function.

```javascript
function container(x, y, width, height, children) {
  return translate(x, y, [
    strokeRect(0, 0, width, height),
    translate(3, 3, //padding
      children
    )
  ]);
}
```

The thing about rendering inside a web worker, is that there isn't any rendering at all inside the web worker.  It simply sends the canvas commands over using structured cloning.

# Getting started

I highly recommend using `browserify` or `webpack` in `node.js` to modularize your code.

```javascript
//browserify
var e2d = require('e2d');

//require.js
require(['e2d'], function(e2d) {
  
});

//I will support this at some point to make your builds smaller
var scale = require('e2d/src/scale');
```

Browserified bundles already exist in the `/dist` folder of this project if you just want to host it on a cdn or use it in your project manually.  Minified the library is about < `23kb` using uglifyjs.

```html
<script src="e2d.min.js" type="text/javascript"></script>
```

Setting up a development environment for testing, place your code in the `app.js` file of your project folder. Then you can use the following command:

`npm install --save-dev express browserify-middleware`

and finally in `server.js`

```javascript
var express = require('express'),
    browserify = require('browserify-middleware'),
    app = express();

app.use(express.static('public'));
app.get('/bundle.js', browserify('./app.js'));

//for use inside webworker 
app.get('/e2d.js', browserify(['e2d'], { standalone: 'e2d' }));
//importScripts('e2d.js');

app.listen(8080);
```

Files in the public folder will now be served for you.

In your `public/index.html` file:
```html
<script src="bundle.js" type="text/javascript"></script>
```

Finally, run `node server.js` and open your browser to `http://localhost:8080/`.

Voila!

# API

__Renderer.js__

This object is the main renderer of the application

```javascript
var r = new Renderer(width, height, parent[document.body], workerUrl);
```

You must provide the workerUrl if you are running a renderer using a web worker.

To render a set of commands, use the following syntax:

```javascript
r.render(
  //comma seperated list of commands
  //or use an array
);
```

To send a message to the worker:

```javascript
//this uses structured cloning or whatever is supported in the browser.
r.sendWorker(type, value);

//the worker receives an object { type: type, value: value }
```

To resize the renderer (supported from both worker and browser side).

```javascript
r.resize(width, height);
```

Note: running this command browser side doesn't update your web worker.



The following commands are provided to you in this library.

__arc.js__

Arcs have 5 forms:
```javascript
var arc = e2d.arc;

var fastestArc = arc(); //radius 1 and x, y is 0, 0
var justRadius = arc(radius); //radius is set, x, y is 0
var radiusWithXY = arc(x, y, radius); //radius is set, x, y is [x], [y]

//radius is set, x, y is [x], [y] and it will start and end at the specified angles
var radiusWithXYandAngles = arc(x, y, radius, startAngle, endAngle);

//see previous arc with anticlockwise direction
var arcAntiClockwise = arc(x, y, radius, startAngle, endAngle, anticlockwise); 
```

__arcTo.js__

Every argument must be given for this function to work, unlike the `arc` function. This is for use in path descriptions.

```javascript
var arcTo = e2d.arcTo;

var arcToInstruction = arcTo(x1, y1, x2, y2, r); //see mdn for how to use arcTo

var pathInstruction = path([
  arcTo(....),
  arcTo(....)
]);
```

__beginPath.js__

Sometimes you want to have direct control over your paths and don't want to close them.

```javascript
var beginPath = e2d.beginPath;
//this function takes NO arguments
var beginPathOperation = beginPath();
```

__bezierCurveTo.js__

This will make a bezier curve with the following parameters. See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) for information on how to use Bezier curves.

```javascript
var bezierCurveTo = e2d.bezierCurveTo;
//cp1 and cp2 are control points  and the curve ends at [x, y]
var myCurve = bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
```

__clearRect.js__

This will clear a rectangle of specified size and has two forms:

```javascript
var clearRect = e2d.clearRect;

//first form accepts width and height
var widthAndHeight = clearRect(width, height);

//second form takes 4 parameters. Starting at x, y it clears a rectangle of [width, height]
var sizeAndPosition = clearRect(x, y, width, height);

```

__clip.js__

This will clip a path for filling/stroking.  See mdn for more information on how to use clips.

```javascript
var clip = e2d.clip;

//the only argument it takes MUST BE AN ARRAY of items
var myClipPath = clip([//ctx.beginPath() implied
  moveTo(0, 0),
  lineTo(100, 100),
  lineTo(0, 100)
]); //ctx.clip() implied
```

If you want to call `ctx.clip()` manually, use `e2d.clipPath()` which will let you control when clip gets called exactly.

__closePath.js__

Sometimes you want to close a path manually.

```javascript
var closePath = e2d.closePath;

var pathEnder = closePath();//no parameters
```

__Img.js__

In order to work with web workers, the concept of drawing an image must be abstracted to the web worker.  Therefore, create an image like this:

```javascript
var texture = new e2d.Img();
texture.src = 'url'; //data urls are accepted
texture.onload = function() {
  console.log('The image is loaded!');
};
```

__drawImage.js__

Drawing an image is as easy as `drawImage(img)`. It has four forms.

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) for more information on how to use drawImage
```javascript
//img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
var drawImage = e2d.drawImage;

var img = new e2d.Image();
img.src = 'url';
//one paramenter means draw the image at 0, 0 with img.width and img.height as the width/height parameters
var imgCommand = drawImage(img);

var imgCommandPosition = drawImage(img, x, y); //draw image at x, y, img.width, img.height

var imgCommandSize = drawImage(img, x, y, width, height); //specify the size of the image

//or draw the image from a source within the image (this is hard to optimize for the browser and may be slow)
var imgSourceSize = drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
```

__Canvas.js__

This is a renderer that allows the developer to render to a temporary canvas.  It works worker side.

```javascript
  var temp = Canvas.create(100, 100);
  temp.render(
    //draw commands
  );
  
  //can be drawn with drawCanvas(temp);
```

This allows the developer to create images using a canvas as well.

```javascript
var img = temp.toImage(); //uses 'image/png'

//can be used to call drawImage(img)
```

__drawCanvas.js__

Drawing an canvas is as easy as `drawCanvas(canvasObject)`. It has four forms.

```javascript
//img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
var drawCanvas = e2d.drawCanvas;

var temp = e2d.Canvas.create(100, 100);
temp.render(
  e2d.fillRect(100, 100)
);
//one paramenter means draw the image at 0, 0 with img.width and img.height as the width/height parameters
var drawCanvasCommand = drawCanvas(temp);

var drawCanvasCommandPosition = drawCanvas(temp, x, y); //draw canvas at x, y

var drawCanvasCommandSize = drawCanvas(temp, x, y, width, height); //specify the size of the canvas too

//or draw the canvas from a source within the canvas (this is hard to optimize for the browser and may be slow)
var drawCanvasCommandSize = drawCanvas(temp, sx, sy, sWidth, sHeight, x, y, width, height);
```

__ellipse.js__

This will add an ellipse to the current path.

```javascript
var ellipse = e2d.ellipse;

var example = ellipse(radiusX, radiusY); //from 0, 0
var example2 = ellipse(x, y, radiusX, radiusY); // from x, y
//this function depends on argument length, so don't forget rotation!
var example3 = ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
```

__fillArc.js__

There is no function for canvas to do this natively, so it was added to the core of e2d for convenience.

```javascript
var fillArc = e2d.fillArc;

var example = fillArc(radius); //radius must always be specified
var example2 = fillArc(x, y, radius); //at x, y
var example3 = fillArc(x, y, radius, startAngle, endAngle); //with start and end angles
var exampler = fillArc(x, y, radius, startAngle, endAngle, true); // counterclockwise
```

__fillRect.js__

This is a direct wrapper to `ctx.fillRect` and will fill a rectangle.

```javascript
var fillRect = e2d.fillRect;

var example = fillRect(width, height);
var example2 = fillRect(x, y, width, height);
```

__fillStyle.js__

This function is used when a change to the fillStyle is needed. Gradients and alternate fillStyles are currently unsupported by webworkers, but are planned for the beta release.

If you want access to the context to generate your own gradients, use the `CanvasRenderingContext2D` object located at `r.ctx`

```javascript
var fillStyle = e2d.fillStyle;

var example = fillStyle('color', [ //change fillStyle to 'color'
  beginPath(),
  arc(100),
  closePath(),
  fill()
]); // draw a circle and revert the fillStyle
```

Make sure the fill command is nested as a child of the fillStyle command, because the fillStyle reverts back to the old style after the child commands are run.

Nested fill styles can occur:

```javascript
var example = fillStyle('red', [
  //fillStyle is red here
  fillStyle('blue', [
    //fillStyle is blue here
  ])
  //now it's red again
]);
```

__globalCompositeOperation.js__

In order to change global composite operations, use `globalCompositeOperation()`.

See [mdn: globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) to learn how to use them.

```javascript
var globalCompositeOperation = e2d.globalCompositeOperation;

var operation = globalCompositeOperation('multiply', [
  //do some fill operations
]);
```

__lineStyle.js__

This is a composite property abstraction that contains `lineWidth` and other useful properties. See [mdn: lineCap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap), [mdn: lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth), [mdn: strokeStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle), [mdn: lineJoin](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [mdn: miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit), and [mdn: setLineDash](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash) 

```javascript
var style = {
  strokeStyle: 'strokeStyle',
  lineWidth: 1,
  
  //see mdn for more information on how to use lineCap
  lineCap: 'round',
  
  //see mdn for more information on how to use lineJoin
  lineJoin: 'bevel',
  
  //see mdn for more information on how to use miterLimit
  miterLimit: 10,
  
  lineDashOffset: []
};
```

This is saved while the child operations are rendering and then reverted back to it's original state.

```javascript
var lineStyle = e2d.lineStyle;

var example = lineStyle(style, [
  //do some line stroke() operations here
]);
```

__path.js__, __lineTo.js__ and __moveTo.js__

Use this to call `ctx.beginPath()`, `ctx.closePath()`, `ctx.lineTo()` and `ctx.moveTo()`.

```javascript
var lineTo = e2d.lineTo,
  moveTo = e2d.moveTo,
  path = e2d.path;

var example = path([ //beginPath()
  moveTo(0, 0),
  lineTo(10, 10),
  lineTo(10, 0)
]); //closePath()

```

__quadraticCurveTo.js__

Use this to make a quadratic curve to another point.  All 4 parameters are required.

```javascript
var quadraticCurveTo = e2d.quadraticCurveTo;

var curveCommand = quadraticCurveTo(cpx, cpy, x, y);
```

__Renderer.js__ and __Canvas.js__

The `Renderer` class is used to display things attached to the DOM and `Canvas` is used for off screen rendering.

The `Renderer` class takes 4 parameters.

Browser side:
```javascript
  //domParent defaults to document.body
  //workerUrl is the path to the worker that will control this particular renderer
  var r = new Renderer(width, height, [domParent, workerUrl]);
  
  //alternatively use node.js style class syntax
  var r = Renderer.create(width, height, [domParent, workerUrl]);
```

WebWorker side:
```javascript
var r = e2d.Renderer.create(width, height);

function render() {
  r.render(
    //send command here
  );
}

onmessage = function (e) {
  if (e.data.type === 'frame') {
    render();
  }
};

//this is required by the engine to start the requestAnimationFrame loop
postMessage({ type: 'ready' });
//the browser side renderer will ignore calls to r.render unless this line of javascript is called.
```

Use multiple calls to `r.render` inside the web worker to concatenate draw commands. This is supported, but can be slow if `r.render` is called multiple times per frame.  Use with caution.

Using `Canvas` is similar.

Examples:

```javascript

var r = e2d.Renderer.create(800, 600);

//create an offscreen canvas
var cvs = new e2d.Canvas(100, 100);

cvs.render(
  e2d.fillRect(25, 25, 50, 50)
);

var img = cvs.toImage();

r.render(
  e2d.drawImage(img)
);
  
//or use

r.render(
  e2d.drawCanvas(cvs)
);
```

__rotate.js__, __translate.js__, and __scale.js__

Use these primitive functions to translate/rotate/and scale your contexts/paths.

```javascript
var translate = e2d.translate,
  scale = e2d.scale,
  rotate = e2d.rotate,
  drawImage = e2d.drawImage;


function drawSprite(img, x, y, rotation, scaleX, scaleY, centerX, centerY) {
  return translate(x, y, [
    scale(scaleX, scaleY, [
      rotate(rotation, [
        translate(-centerX, -centerY, [
          drawImage(img)
        ])
      ])
    ])
  ]);
}

//draw sprite from it's center and control it's width/height
r.render(
  drawSprite(img, x, y, 0, width / image.width, height / image.height, image.width * 0.5, image.height * 0.5)
);
```

__transform.js__

This is a transform function that will actually calculate out a transform matrix for you.

```javascript
var transform = e2d.transform,
  drawImage = e2d.drawImage;
  
//same example from above
function drawSprite(img, x, y, rotation, scaleX, scaleY, centerX, centerY) {
  return transform([ //this must be an array!
    // Apply one layer of transforms
    { translate: { x: x, y: y }, scale: { x: scaleX, y: scaleY }, rotate: rotation },
    // center the sprite
    { translate: { x: -centerX, y: -centerY } }
  ], [drawImage(img)]);
}
```

If you know the matrix values already, you can use the following syntax:

```javascript
transform([
  { transform: { a: d11, b: d12, c: d21, d: d22, e: d31, f: d32 }}
  //[d11, d21, d31]  ---- [a, c, e]
  //[d12, d22, d32]  ---- [b, d, f]
  //[  0,   0,   1]  ---- [0, 0, 1]
], children);
```

__shadowStyle.js__

Much like __lineStyle.js__ this is a compound property that can be nested.

```javascript
var shadowStyleDefinition = {
  shadowBlur: 0,
  shadowColor: 'black',
  shadowOffsetX: 0,
  shadowOffsetY: 0
};
```

See mdn for more information on how to use shadows.

Example:

```javascript
var shadowStyle = e2d.shadowStyle;

var shadowCommand = shadowStyle(shadowStyleDefinition, [
  //stuff with a shadow
]);
```

__stokeArc.js__

This function doesn't exist on the Canvas prototype, but was added for completeness.  It draws a circular arc around the center.

This command has four forms.

```javascript
var strokeArc = e2d.strokeArc;

var strokeRadius = strokeArc(radius); //at 0, 0
var strokePosition = strokeArc(x, y, radius); //full angle
var strokePortion = strokeArc(x, y, radius, startAngle, endAngle); //strokes clockwise
var strokeCounterClockwise = strokeArc(x, y, radius, startAngle, endAngle, true); //strokes counterclockwise
```

__strokeRect.js__

This will outline a rectangle.  It has two forms.

```javascript
var strokeRect = e2d.strokeRect;

var rect = strokeRect(width, height); //at 0, 0
var rect2 = strokeRect(x, y, width, height);
```

__text.js__ and __textStyle.js__

These functions help you draw text to the screen using Canvas's really poorly implemented API.  Please see mdn for more information about the font properties.

```javascript
var textStyle = e2d.textStyle,
  text = e2d.text,
  style = {
    font: 'Comic Sans MS', //probably pick another font... please?
    textAlign: 'center', // text alignment
    textBaseline: 'top', // base alignment
    direction: 'ltr' // ltr: left to right, rtl: right to left, and inherit
  };
  
var textCommand = textStyle(style, [
  text('hello world!'), //at 0, 0
  text('other text', x, y) //at x, y
  
  //text, x, y, fill, stroke
  text('some other text too', x, y, true, true) //fill first, then stroke
  
  //and maxWidth
  text('the final example', x, y, true, true, maxWidth) //fill first, then stroke
]);
```



This project is released under the MIT license.