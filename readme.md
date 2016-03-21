# e2d.js

An es5 declarative canvas renderer.

# Introduction

Most canvas libraries abstract away different aspect of canvas to make you faster.  When using this library, there isn't much abstraction. In fact, the API mirrors the canvas2d API in a way makes coding canvas actually fun!

Some of the functions fill in parts of the language that aren't implemented yet, like `CanvasRenderingContext2D.prototype.ellipse` and `CanvasRenderingContext2D.prototype.addHitRegion`.


### Instruction trees

The goal of `e2d` is to create a tree of instructions instead of imperatively calling `ctx.translate`, or `ctx.drawImage`. It allows the developer to make one way data structures that represent the state of their application data.

For instance, sprite sheets can be created by making an array of `drawImage` instructions:

```javascript
//create a drawImage array to store the frame commands
var spriteSheet = arrayOfImages.map(function(imageElement) {
  return e2d.drawImage(imageElement);
});
```

Creating an array of draw commands yields an index of frames to render from.


## Performance

The goal of e2d is to be fast.  In fact, e2d can greatly reduce user-defined function calls depending on how often instructions are stored as variables.

The `CanvasRenderingContext2D.prototype` is sometimes slow, and much of that cannot be optimized, so `e2d` aims to decrease user-defined memory and function calls.

Creating a render tree every frame has a relatively minimal performance impact. `e2d` truly shines when instructions are repeated and stored as variables.

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
    particles.map(particleMap) //don't use a map in production
  );
});
```

Code can now be self documenting.

```javascript
var strokeRed = e2d.strokeStyle('red', e2d.stroke());

var hexagonPath = e2d.path( //beginPath()
  //hexagon drawing instructions
  e2d.createRegularPolygon(50, [0, 0], 10).map(e2d.moveToLineTo) 
); //closePath()

var redHexagon = [hexagonPath, strokeRed]; //combine drawing operations with arrays

var clearScreen = e2d.clearRect(screenWidth, screenHeight);

function gameLoop() {
  return r.render(clearScreen, redHexagon);
}
```

# Getting started

I highly recommend using `browserify` or `webpack` in `node.js` to modularize your code, but the fastest way to get started is to use the `e2d.min.js` file in the `/dist/` folder.

### Import using script method

```html
<script src="e2d.min.js" type="text/javascript"></script>
```

That's it.

### Browserify method

`npm init`

and then...

`npm install --save-dev browserify-middleware express e2d`

Inside a `server.js` file:

```javascript
var express = require('express'),
    browserify = require('browserify-middleware'),
    app = express();

app.use(express.static('public'));
app.get('/bundle.js', browserify('./app.js'));

app.listen(8080);
```

In your `public/index.html` file:
```html
<script src="bundle.js" type="text/javascript"></script>
```

Finally, run `node server.js` and open your browser to `http://localhost:8080/`.

### webpack-dev-server

Please see [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) for all your web development server needs.

# API

## Renderer.js

This object is the main renderer of the application.

```javascript
var r = new Renderer(width, height, parent); //parent is a document node

```

Use `r.ready()` to active the requestAnimationFrame loop.  All render commands are ignored until `.ready()` is called.

### Events

__frame__

This fires once per frame after calling `r.ready()`.  Use this event to call `r.render(...)` to keep in sync with the animation loop.

```javascript
r.on('frame', function() {
  //render stuff here
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

Listening to the event is optional, use `r.mouseData` to get the mouse position.

__key__

This fires once per key event. This includes `keydown` and `keyup`.

```javascript
r.on('key', function(keyEventData) {
  //keyEventData looks like this
  /*{
    'a': 'down', // or 'up'
    'b': 'down', // or 'up'
    'c': 'down', // or 'up'
    ...
  }*/
});
```

Listening to the event is optional, use `r.keyData[key]` to find out the current key state.

### Prototype

To render a set of commands, use the following syntax:

__Renderer.prototype.render__

```javascript
r.render(
  //comma seperated list of commands
  //or use an array
);
```

__Renderer.prototype.resize__

To resize the renderer.

```javascript
r.resize(width, height);
```

__Renderer.prototype.ready__

This function sets up the requestAnimationFrame loop and allows the developer to hook into the `frame` event.

```javascript
r.ready();
```

__Renderer.prototype.style__

This function applies styles to the canvas directly.

```javascript
r.style({
  margin: '0 auto',
  cursor: 'pointer'
});
```

Also supports:

1. Unlimited arguments, it will apply every style manually to the canvas
2. `null` values will remove style attributes `(value === null)`
3. Arrays of style objects

ex.

```javascript
  r.style({
    //if there are any active mouse regions, change the cursor to pointer
    cursor: r.mouseData.activeRegions.length > 0 ? 'pointer' : null
  });
```

__Renderer.prototype.measureText__

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) for information on what a `TextMetrics` object looks like.

```javascript
var textMetricsResult = r.measureText(font, text);
//font is size + font
```

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

This provides a clipping region for child instructions.

The following example draws an image centered inside a hexagonal shape.

```javascript

var region = e2d.createRegularPolygon(200, [0, 0], 6).map(e2d.moveToLineTo);

//this results in a polygonal cliped drawImage command
var result = e2d.clip(
  region, //must be the first argument
  translate(-img.width * 0.5, -img.height * 0.5,
    e2d.drawImage(img)
  )
);

```


__Img.js__

The custom `Img` object wraps some functionality that speeds up image drawing in Chrome/Webkit browsers.

```javascript
var texture = new e2d.Img(); //this signals the browser to cache the image
texture.src = 'url'; //data urls are accepted
texture.once('load', function() {
  //the texture is loaded
});
```

__imageSmoothingEnabled.js__

This function set imageSmoothingEnabled. _(default is true)_

```javascript
r.render(
  e2d.imageSmoothingEnabled(false,
    ...children
  )
);
```

__drawImage.js__, __fillImage.js__

`drawImage(img)` or `fillImage(img)` have the same parameters, and can be useful in different situations. It has four forms.

`drawImage` accepts standard browser `Image` objects and `Img` textures too.

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) for more information on how to use drawImage
```javascript
var drawImage = e2d.drawImage; //replace that with e2d.fillImage in chrome because of canvas performance issues

var img = new e2d.Img();
img.cache(); //cache all images unless you use them for a single render

img.src = 'url';
img.once('load', callback);

//one paramenter means draw the image at 0, 0 with img.width and img.height as the width/height parameters
var imgCommand = drawImage(img);

var imgCommandPosition = drawImage(img, x, y); //draw image at x, y, img.width, img.height

var imgCommandSize = drawImage(img, x, y, width, height); //specify the size of the image

//or draw the image from a source within the image (this is hard to optimize for the browser and may be slow)
var imgSourceSize = drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
```

`fillImage` uses a fill pattern and `ctx.fillStyle` to fill a rectangle and requires an `Img` texture. In chrome, it is more performant to fill a rectangle with a pattern when dealing with large images.  If `drawImage` is too slow in chrome, try `fillImage` as a drop in replacement to see if it speeds up the frame times as a quick optimization.


__fillImagePattern.js__

This function will fill the specified area with a repeated image pattern.

```javascript
var fillImagePattern = e2d.fillImagePattern;

var img = new e2d.Img();

img.src = 'url';
img.once('load', callback);

var fillImagePatternCommand = fillImagePattern(img, width, height); //it accepts an image
var fillImagePatternCommand2 = fillImagePattern(img, x, y, width, height);

```

__Canvas.js__

This wraps the `Renderer.js` API and creates an off-screen canvas buffer for custom image storage.

```javascript
  var temp = Canvas.create(100, 100); //Canvas instances must be stored in the same way images are
  var temp = new Canvas(100, 100);
  temp.render(
    //draw commands
  );

  //can be drawn with drawCanvas(temp);
```

This allows the developer to create images using a canvas as well.

```javascript
var img = temp.toImage(); //uses 'image/png'
//it returns an Img object and assumes it isn't cached()
//can be used to call drawImage(img)
```

__drawCanvas.js__

`drawCanvas(canvasObject)` accepts both real canvas elements and `Canvas` objects.

```javascript
var temp = e2d.Canvas.create(100, 100);

temp.render(
  e2d.fillRect(100, 100)
);
//one paramenter means draw the image at 0, 0 with canvas.width and canvas.height as the width/height parameters
var drawCanvasCommand = e2d.drawCanvas(temp);

var drawCanvasCommandPosition = e2d.drawCanvas(temp, x, y); //draw canvas at x, y

var drawCanvasCommandSize = e2d.drawCanvas(temp, x, y, width, height); //specify the size of the canvas too

//or draw the canvas from a source within the canvas (this is hard to optimize for the browser and may be slow)
var drawCanvasCommandSize = e2d.drawCanvas(temp, sx, sy, sWidth, sHeight, x, y, width, height);
```

The `drawCanvas` operation stored the canvas in memory, so creating the draw command is only required once.  Further changes to the canvas will still reference the current canvas.

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

This was added to the API for convenience.  It works like `fillRect`, only for `arc`'s.

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
  path(
    arc(100)
  ),
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
  strokeStyle('blue',
    //fillStyle is blue here
  )
  //now it's red again
);
```

__globalCompositeOperation.js__

For change global composite operations, use `globalCompositeOperation()`.

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
    //children are now drawn at 0.25 alpha because 0.5 * 0.5 is 0.25  (floating point math applies)
  )
)

```

__hitRegion.js__ and __hitRect.js__

This function is used to name mouse regions with a polygon.

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

To make a square use `hitRect(id, x, y, width, height)` or `hitRect(id, width, height)`.

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
`lineDashOffset` and `lineDash` are abstracted to make them easier to animate.

```javascript
var lineStyle = e2d.lineStyle;

var example = lineStyle(style,
  //do some line stroke() operations here
);
```

__path.js__, __lineTo.js__ and __moveTo.js__

The `path(pathInstructions)` call wraps `pathInstructions` in `beginPath()` and `endPath()` operations.

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

```javascript
  //parent defaults to document.body when not provided

  var r = new Renderer(width, height, parent);

  //alternatively use node.js style create syntax
  var r = Renderer.create(width, height, parent);
```

Using `Canvas` is similar.

Examples:

```javascript

var r = e2d.Renderer.create(800, 600);

//create an offscreen canvas and cache it for later use
var cvs = new e2d.Canvas(100, 100);

cvs.render(
  e2d.fillRect(25, 25, 50, 50) //draw a square
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
//every transform operation accepts unlimited children

//scaling operations are like this:
var scaleChildren = e2d.scale(size, children); //if sizeY is not provided, it will assume the scale is in both directions
var scaleChildren = e2d.scale(sizeX, sizeY, children);

//translate like this:
var translateChildren = e2d.translate(x, y, children);

//rotate like this:
var rotateChildren = e2d.rotate(radians, children);

function drawSprite(img, x, y, rotation, scaleX, scaleY, centerX, centerY) {
  return translate(x, y, //position
    scale(scaleX, scaleY, //scaling operation
      rotate(rotation, //rotate the sprite
        translate(-centerX, -centerY, //centering operation
          drawImage(img) //draw the image
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

`transform([a,b,c,d,e,f], children...)` is a convenience function for advanced developers to add a transform to the current stack.

```javascript
var transformOperation = e2d.transform(
  [A, B, C, D, E, F], //{ a: d11, b: d12, c: d21, d: d22, e: d31, f: d32 } for reference
  children
);
```

__resetTransform.js__ and __setTransform__

These functions give direct access to the `transformStack` values.

```javascript
r.render(
  clearRect(width, height),
  translate(x, y,
    resetTransform(
      fillRect(100, 100, 100, 100),
      text('I\'m at [0,0]!')
    )
  )
);
```

__shadowStyle.js__

Much like __lineStyle.js__ this is a compound property that can be nested.

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Shadows) for more details.

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

__textStyle.js__, __fillText.js__, and __strokeText__

These functions help you draw text to the screen using Canvas's really poorly implemented text API.  Please see mdn for more information about the font properties.

Note: the `text` function is deprecated.

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
  fillText('hello world!'), //at 0, 0
  strokeText('other text', x, y), //at x, y

  //text, x, y, fill, stroke
  fillText('some other text too', x, y, maxWidth),

  //and maxWidth
  strokeText('the final example', x, y, maxWidth)
);
```

__text.js__

This method is deprecated. It was poorly implemented was unclear.

```javascript
var textCommand = e2d.text('hello world', x, y, fill, stroke, maxWidth); //fill and stroke are booleans
```

__createLinearGradient.js__ and __createRadialGradient.js__

This creates and returns a canvas gradient object.

```javascript
var grd = createLinearGradient(x0, y0, x1, y1, [ //this must be an array!
  e2d.addColorStop(0, 'color'),
  e2d.addColorStop(1, 'color')
]);
```

For example:

```javascript
r.render(
  e2d.fillStyle(grd, children...)
);
```

See [createLinearGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) and  [createRadialGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient) on mdn for more information on how to use these functions.

__transformPoints.js__

This utility function transforms a set of points givent the specified transform matrix. It is used internally by `e2d` to calculate mouse regions.

```javascript
var matrix = new Float64Array([a, b, c, d, e, f]);
//or...
var matrix = new Float64Array([d11, d12, d21, d22, d31, d32]);
//lookup map
//[d11, d21, d31]  ---- [a, c, e]
//[d12, d22, d32]  ---- [b, d, f]
//[  0,   0,   1]  ---- [0, 0, 1]

var points = [
  [x0, y0],
  [x1, y1],
  [x2, y2],
  ...
  [xN, yN]
];

var newPoints = transformPoints(points, matrix);
```

It returns a new array of `[x, y]` points with the coordinates transformed.

__createRegularPolygon.js__

Creates a regular polygon shape: an array of arrays.

```javascript
var radius = 10;
var position = [x, y];
var sides = 6;
var hexagon = e2d.createRegularPolygon(radius, position, sides);

console.log(hexagon);
[
  [10, 0],
  [5.000000000000001, 8.660254037844386],
  [-4.999999999999998, 8.660254037844387],
  [-10, 1.2246467991473533e-15],
  [-5.000000000000004, -8.660254037844384],
  [5.000000000000001, -8.660254037844386]
]
```

__moveToLineTo.js__

This is a convenience function used with `Array.prototype.map` that maps shapes to drawable polygons.

```javascript
var hexagonShape = e2d.createRegularPolygon(10, [0, 0], 6);
var hexagonPath = e2d.path( //automatically close the path
  hexagonShape.map(e2d.moveToLineTo) //map each point to an instruction
);

r.render(
  hexagonPath
);

```

# Examples

```javascript

var app = {

  r: e2d.Renderer.create(800, 600),
  polygonShape: e2d.createRegularPolygon(30, [0, 0], 10),
  polygonPath: null,
  polygonHitRegion: null,
  fillRed: e2d.fillStyle('red', e2d.fill()), //store the fillStyle
  rectPath: e2d.path(e2d.rect(100, 100, 100, 100)), //storing the path
  init: function() {
    this.polygonPath = e2d.path(this.polygonShape.map(e2d.moveToLineTo));
    this.polygonHitRegion = e2d.hitRegion('polygon-region', this.polygonShape);
  },
  tick: function() {
    //if the cursor is over the polygon region, change the pointer
    this.r.style({ cursor: this.r.mouseData.activeRegions.length > 0 ? 'pointer' : null });

    return this.r.render(
      this.rectPath, this.fillRed, //red rectangle
      e2d.translate(100, 100, //move to 100, 100,
        this.polygonPath, this.fillRed, this.polygonHitRegion //draw a polygon and apply a mouse region to it
      )
    );
  }
};
app.init();

app.r.ready();
app.r.on('frame', function() {
  app.tick();
});
```

This project is released under the MIT license (c) Joshua Tenner 2015.
