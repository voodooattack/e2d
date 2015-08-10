# e2d.js

A canvas rendering engine HEAVILY inspired by `react.js` to enable `WebWorker` rendering.

# Introduction

Most canvas libraries abstract away different aspect of canvas to make you faster.  When using this library, there isn't much abstraction. In fact, the api mirrors the canvas2d api in a way makes coding canvas actually fun!

Some of the functions fill in parts of the language that aren't implemented yet, like `CanvasRenderingContext2D.prototype.ellipse` and `CanvasRenderingContext2D.prototype.addHitRegion`.

The coolest part of this library is the ability to do your application logic _inside a web worker_.

That's right. In a web worker. The cost for doing application logic this way is at worst about `32ms` of input lag, which is by design. It causes rendering _and_ drawing to happen at the same time in the most efficient way possible.

When using this library, you'll probably want to do something like this:


```javascript
//This works in both browser AND worker.
//  importScripts('e2d.min.js');
//or
//  var e2d = require('e2d');


var r = e2d.Renderer.create(800, 600);

var mouse = { x: 0, y: 0, state: 'up' };

r.on('mouse', function (data) {
  mouse = data;
});
function frame() {
  r.render(
    e2d.fillRect(800, 600), //black fillStyle is default
    
    //mouse debug stuff
    e2d.globalAlpha(0.5, 
      e2d.fillStyle(mouse.state === 'down' ? 'green' : 'red', 
        e2d.fillArc(mouse.x, mouse.y, 10)
      )
    )
  );
}
//browser side, this is called durring requestAnimationFrame
r.on('frame', frame);

//if you want the library to control when you render use this function
r.ready();
```

Use `r.ready()` to active the requestAnimationFrame loop.  All render commands are ignored until `.ready()` is called.

### Instruction trees

Creating a tree of instructions allows the developer to make one way data structures that represent the state of their application data.

In games, this is very useful, because the render engine shouldn't be a part of the game logic.

For instance, sprite sheets are really easy to make:

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
  
  //do something every frame
  frame += 1;
  if (frame > 60) {
    frame -= 0;
  }
  imageData.x = 100 + Math.cos(Math.PI * 2 / 60 * frame) * 100;
  imageData.y = 100 + Math.sin(Math.PI * 2 / 60 * frame) * 100;
  imageData.frameCount += 1;
  while (imageData.frameCount >= spriteSheet.length) {
    imageData.frameCount -= spriteSheet.length;
  }
  
  //render your tree
  r.render(
    translate(imageData.x, imageData.y, 
      //draw command is already made! 
      spriteSheet[imageData.frameCount]
    )
  );
}

r.on('frame', gameLoop);

```

Also building classes is as easy as making a single function.

```javascript
function customContainerItem(x, y, width, height, children) {
  return translate(x, y, 
    strokeRect(0, 0, width, height),
    translate(3, 3, //padding
      children
    )
  );
}
```

## Performance

The majority of my tesing involved a lot of frame timing. I came to the stunning conclusion that browsers can actually handle calling a very large amount of functions in a very short period of time.

The browser bottlenecks at "draw-time" because the `CanvasRenderingContext2D.prototype` is slow.

Creating a render tree every frame has a very minimal performance impact.

It is also possible to store tree structures for later use to speed up tree generation.

```javascript
var strokeRed = e2d.lineStyle({ strokeStyle: 'red' }, e2d.stroke());
```

Examples like the following are actually very performant.

```javascript
var particles = [];
for(var i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * config.width,
    y: Math.random() * config.height,
    r: Math.random() * sizeRange + smallestRadiusSize
  });
}

//later
function particleMap(particle) {
  return translate(particle.x, particle.y,
    fillArc(particle.r)
  );
}
r.on('frame', function() {
  return r.render(
    particles.map(particleMap);
  );
});
```

If the goal is to reduce execution time, don't do it pre-emptively.

*The browser bottlenecks more on the drawing operations, and garbage collection, than it does on the code you execute!*

Simply write your code in a declarative style, then cache static operations when you are done.  After static operations are cached, check your `.map`s, `filter`s, and `reduce`s performance. If they are truly bottlenecking your  rendering, they can easily be turned into `for` loops with a little bit of clever logic. 

# Getting started

I highly recommend using `browserify` or `webpack` in `node.js` to modularize your code, but the fastest way to get started is to use the `e2d.min.js` file in the `/dist/` folder.

### Import using script method

```html
<script src="e2d.min.js" type="text/javascript"></script>
```

Inside a worker, use:

```javascript
importScripts('e2d.min.js');
//your app code here
```

That's it.

### Browserify method

This is how I recommend getting started.

`npm init`

and then...

`npm install --save-dev browserify-middleware express e2d`

Inside `server.js`:

```javascript
var express = require('express'),
    browserify = require('browserify-middleware'),
    app = express();

app.use(express.static('public'));
app.get('/bundle.js', browserify('./app.js'));
//create the renderer here, or inside a webworker


//Uncomment the following line to add worker.js to your project
//app.get('/worker.js', browserify('./worker.js', { standalone: 'worker' }));
//browser side, use: var r = new Renderer(width, height, null, 'worker.js');

app.listen(8080);
```

In your `public/index.html` file:
```html
<script src="bundle.js" type="text/javascript"></script>
```

There is no active support for automatically importing `e2d` inside a web worker using the `browserify` method. For now, make a standalone build for your worker and use that.

Finally, run `node server.js` and open your browser to `http://localhost:8080/`.

### Webpack

WebWorker work is possible but I'm not sure how to set up a project that uses webpack using a web worker.  Please submit a pull request to help provide an example!

# API

## Renderer.js

This object is the main renderer of the application.

```javascript
var r = new Renderer(width, height, parent[document.body], workerUrl);
```

### Events

All events are supported browser and worker side.

__frame__

This fires once per frame after calling `r.ready()`.  Use this event to call `r.render(...)` to keep in sync with the animation loop.

```javascript
r.on('frame', function() {
  //browser side, this is during requestAnimationFrame
  
  //worker side, this is timed and sent before the requestAnimationFrame fires
});
```

__mouse__

This fires once per mouse event. This includes `mousedown`, `mouseup`, and `mousemove`.  Touch events are not supported yet and are targeted for the next release.


```javascript
r.on('mouse', function(mouseEventData) {
  //mouseEventData looks like this
  /*{
    x: relativeMouseX,
    y: relativeMouseY,
    state: 'down' // or 'up'
  }*/
});

```

__key__

This fires once per key event. This includes `keydown` and `keyup`.

r.on('key', function(keyEventData) {
  //keyEventData looks like this
  /*{
    'a': 'down', // or 'up'
    'b': 'down', // or 'up'
    'c': 'down', // or 'up'
    ...
  }*/
});

### Prototype

You must provide the workerUrl if you are running a renderer using a web worker.

To render a set of commands, use the following syntax:

__Renderer.prototype.render__

```javascript
r.render(
  //comma seperated list of commands
  //or use an array
);
```

To send an event to the worker or to the browser use the `r.sendBrowser`, `r.sendWorker`, or `r.sendAll` methods.

__Renderer.prototype.send*__

```javascript
//this uses structured cloning or whatever is supported in the browser.
r.sendWorker(type, value);

//this will send a command/event to the browser
r.sendBrowser(type, value);

//this will send a command/event to both sides
r.sendAll(type, value);
```

__Renderer.prototype.resize__

To resize the renderer (supported from both worker and browser side).

```javascript
r.resize(width, height);
```

__Renderer.prototype.ready__

This function sets up the requestAnimationFrame loop and allows the developer to hook into the `frame` event on both the worker AND the browser side.

```javascript
r.ready();
```

__Renderer.prototype.style__

This function applies styles to the browser window.

```javascript
r.style({
  margin: '0 auto',
  cursor: 'pointer'
});
```

Also supports:

1. Unlimited arguments, it will apply every style manually to the canvas
2. `null` values will remove style attributes
3. Arrays of style objects

# Render Commands

The following render commands are provided to you in this library.

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

var pathInstruction = path(
  arcTo(....),
  arcTo(....)
);
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
var myClipPath = clip(//ctx.beginPath() implied
  moveTo(0, 0),
  lineTo(100, 100),
  lineTo(0, 100)
); //ctx.clip() implied
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
var texture = new e2d.Img().cache();
texture.src = 'url'; //data urls are accepted
texture.once('load', function() {
  //the texture is loaded
});
```

Image references must be stored on the main thread because images must be created on the main thread regardless of where they are instantiated. Please remember to call `.cache()`.  It signals the browser to store the image reference to be drawn more than once.

Images are automatically disposed unless `.cache()`ed and will need to be `.disposed()` manually.

This helps prevent memory leaks inside the browser which needs memory to be free when it isn't being used.

__drawImage.js__, __fillImage.js__

Drawing an image is as easy as `drawImage(img)` or `fillImage(img)`. Both functions have the same parameters, and can be useful in different situations. It has four forms.

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) for more information on how to use drawImage
```javascript
var drawImage = e2d.drawImage;

var img = new e2d.Img().cache();

img.src = 'url';
img.once('load', callback);

//one paramenter means draw the image at 0, 0 with img.width and img.height as the width/height parameters
var imgCommand = drawImage(img);

var imgCommandPosition = drawImage(img, x, y); //draw image at x, y, img.width, img.height

var imgCommandSize = drawImage(img, x, y, width, height); //specify the size of the image

//or draw the image from a source within the image (this is hard to optimize for the browser and may be slow)
var imgSourceSize = drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
```

Using `fillImage` uses a fill pattern and `ctx.fillStyle` to fill a rectangle. In chrome, it is more performant to fill a rectangle with a pattern when dealing with large images.  If `drawImage` is too slow in chrome, try `fillImage` as a drop in replacement to see if it speeds up your app.


__fillImagePattern.js__

This function will fill the specified area with a repeated image pattern.

```javascript
var fillImagePattern = e2d.fillImagePattern;

var img = new e2d.Img();

img.src = 'url';
img.once('load', callback);

var fillImagePatternCommand = fillImagePattern(img, width, height);
var fillImagePatternCommand2 = fillImagePattern(img, x, y, width, height);

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

This function is used when a change to the fillStyle is needed.

```javascript
var fillStyle = e2d.fillStyle;

var example = fillStyle('color', //change fillStyle to 'color'
  beginPath(),
  arc(100),
  closePath(),
  fill()
); // draw a circle and revert the fillStyle
```

Make sure the fill command is nested as a child of the fillStyle command, because the fillStyle reverts back to the old style after the child commands are run.

Nested fill styles can occur:

```javascript
var example = fillStyle('red', 
  //fillStyle is red here
  fillStyle('blue', 
    //fillStyle is blue here
  )
  //now it's red again
);
```

__strokeStyle.js__

This function is used when a change to the strokeStyle is needed.

```javascript
var strokeStyle = e2d.strokeStyle;

var example = strokeStyle('color',  //change strokeStyle to 'color'
  beginPath(),
  arc(100),
  closePath(),
  stroke()
); // draw a circle and revert the fillStyle
```

Make sure the stroke command is nested as a child of the strokeStyle command, because the strokeStyle reverts back to the old style after the child commands are run.

Nested stroke styles can occur:

```javascript
var example = strokeStyle('red', 
  //strokeStyle is red here
  strokeStyle('blue', [
    //fillStyle is blue here
  ])
  //now it's red again
);
```

__globalCompositeOperation.js__

In order to change global composite operations, use `globalCompositeOperation()`.

See [mdn: globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) to learn how to use them.

```javascript
var globalCompositeOperation = e2d.globalCompositeOperation;

var operation = globalCompositeOperation('multiply', 
  //do some fill operations
);
```

__globalAlpha.js__

To control the global alpha, use the `globalAlpha(alpha, children)` function.

```javascript
var globalAlpha = e2d.globalAlpha;

globalAlpha(0.5, 
  //children are now drawn at 0.5 alpha
  
  globalAlpha(0.5, 
    //children are now drawn at 0.25 alpha because 0.5 * 0.5 is 0.25
    //float math applies
  )
)

```

__hitRegion.js__ and __hitRect.js__

This function is used to identify mouse regions using a polygon.

```javascript
var hitRegion = e2d.hitRegion,
  hitRect = e2d.hitRect;
```

Example polygon format:

```javascript
var polyPath = [
  [0, 0], //x, y pairs
  [0, 1],
  [1, 1],
  [1, 0]
];
```

They can be scaled, translated, rotated, and transformed at render time.

```javascript
function lineMap(point, index) {
  return index === 0 ? e2d.moveTo(point[0], point[1]) : e2d.lineTo(point[0], point[1]);
}

var polyDraw = translate(x, y,
  scale(size,
    polyPath.map(lineMap) //this makes the commands for you
    stroke(),
    hitRegion('poly-id', polyPath) //this path is translated and scaled for you!
  )
);

r.render(
  polyDraw
);
```

To capture if the 'poly-id' region was hovered during the current frame, use the mouse event.

```javascript
var mouseData;
r.on('mouse', function(data) {
  mouseData = data;
  //if 'poly-id' is in the array, it was hovered for the prior frame it was declared.
  var isHovering = data.activeRegions.indexOf('poly-id') > -1;
});
```

To make a square simply use `hitRect(id, x, y, width, height)` or `hitRect(id, width, height)`.

__lineStyle.js__

This is a composite property abstraction that contains `lineWidth` and other useful properties. See [mdn: lineCap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap), [mdn: lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth), [mdn: lineJoin](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [mdn: miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit), and [mdn: setLineDash](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash) 

```javascript
var style = {
  lineWidth: 1,
  lineCap: 'round',
  lineJoin: 'bevel',
  miterLimit: 10,
  lineDash: [],
  lineDashOffset: 0
};
```

This is saved while the child operations are rendering and then reverted back to it's original state.

```javascript
var lineStyle = e2d.lineStyle;

var example = lineStyle(style, 
  //do some line stroke() operations here
);
```

__path.js__, __lineTo.js__ and __moveTo.js__

Use this to call `ctx.beginPath()`, `ctx.closePath()`, `ctx.lineTo()` and `ctx.moveTo()`.

```javascript
var lineTo = e2d.lineTo,
  moveTo = e2d.moveTo,
  path = e2d.path;

var example = path( //beginPath()
  moveTo(0, 0),
  lineTo(10, 10),
  lineTo(10, 0)
); //closePath()

```

__quadraticCurveTo.js__

Use this to make a quadratic curve to another point.  All 4 parameters are required.

```javascript
var quadraticCurveTo = e2d.quadraticCurveTo;

var curveCommand = quadraticCurveTo(cpx, cpy, x, y);
```

__Renderer.js__ and __Canvas.js__

The `Renderer` class is used to display things attached to the DOM and `Canvas` is used for off screen rendering and takes 4 parameters.

Browser side:
```javascript
  //domParent defaults to document.body when not provided
  //workerUrl is the path to the worker that will control this particular renderer
  var r = new Renderer(width, height, [domParent, workerUrl]);
  
  //alternatively use node.js style create syntax
  var r = Renderer.create(width, height, [domParent, workerUrl]);
```

WebWorker side:
```javascript
var r = e2d.Renderer.create(width, height);

r.on('frame', function() {
  return r.render(
    //send command here
  );
});

//this is required by the engine to start the requestAnimationFrame loop and works both worker/browser side
r.ready();

//the browser side renderer will ignore calls to r.render unless this line of javascript is called.
```

Use multiple calls to `r.render` inside the web worker to concatenate draw commands. This is supported, but can be slow if `r.render` is called multiple times per frame.  Use with caution.

Using `Canvas` is similar.

Examples:

```javascript

var r = e2d.Renderer.create(800, 600);

//create an offscreen canvas and cache it for later use
var cvs = new e2d.Canvas(100, 100).cache();

cvs.render(
  e2d.fillRect(25, 25, 50, 50) //draw a square
);

var img = cvs.toImage().cache();

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
  return translate(x, y, 
    scale(scaleX, scaleY, 
      rotate(rotation, 
        translate(-centerX, -centerY, 
          drawImage(img)
        )
      )
    )
  );
}

//draw sprite from it's center and control it's width/height
r.render(
  drawSprite(img, x, y, rotation, scaleX, scaleY, centerX, centerY) //centerX and centerY are relative to img's size
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
    ], 
    drawImage(img)
  );
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

var shadowCommand = shadowStyle(shadowStyleDefinition, 
  //stuff with a shadow
);
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
  
var textCommand = textStyle(style, 
  text('hello world!'), //at 0, 0
  text('other text', x, y) //at x, y
  
  //text, x, y, fill, stroke
  text('some other text too', x, y, true, true) //fill first, then stroke
  
  //and maxWidth
  text('the final example', x, y, true, true, maxWidth) //fill first, then stroke
);
```

__createLinearGradient.js__ and __createRadialGradient.js__

*WARNING*: Every gradient that is created will be auto-disposed after creation.  Use the chain api to store the gradient for re-use.

```javascript
var grd = createLinearGradient(x0, y0, x1, y1, [ //this must be an array!
  addColorStop(0, 'color'),
  addColorStop(1, 'color')
]).cache(); // will cache the gradient for later reuse
```

This paradigm exists because the gradient needs to be stored for later use on the browser side regardless of where it is created.  However, using `createLinearGradient` and `createRadialGradient` for use in a single frame is supported without calling `gradient.cache()`.

```javascript
r.render(
  fillStyle(
    createLinearGradient(x0, y0, x1, y1, [ //this one will be auto-disposed
      addColorStop(...),
      addColorStop(...)
    ]),
    //children
  )
)
```

__transformPoints.js__

This utility function is used by the mouse event to capture if a mouse region is active by using the current transform stack to calculate exactly the region defined by the relative polygon specified.

```javascript
var matrix = [
  [a, c, e],
  [b, d, f],
  [0, 0, 1]
];

var points = [
  [x, y],
  [x, y],
  [x, y],
  ....
];

var newPoints = transformPoints(points, matrix);
//returns an array of [x, y] points with the coordinates transformed
```

See [createLinearGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) and  [createRadialGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient) on mdn for more information on how to use these functions.


This project is released under the MIT license (c) Joshua Tenner 2015.