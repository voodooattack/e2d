# e2d.js

[![Gitter](https://badges.gitter.im/e2d/e2d.svg)](https://gitter.im/e2d/e2d?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An es2015/es5 declarative canvas renderer.

# Introduction

Most canvas libraries abstract away different aspect of canvas to make you faster.  When using this library, there isn't much abstraction. In fact, the API mirrors the canvas2d API in a way makes coding canvas fun!  Much like react uses a render function to make changes to the DOM in an abstract way, so does e2d to the canvas context.

## Getting Started

With react.js, the developer calls React.render once to start up the application.  Since e2d does not work with the DOM, there are no bindings internally to have a meaningful event lifecycle.  This means that `e2d.render` must be called every frame. Take the following "Hello World" example:

```javascript
let canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;

//get the canvas context
let ctx = canvas.getContext('2d');

//add the canvas to the dom
document.body.appendChild(canvas);

//for commonjs, browserify, webpack
let e2d = require('e2d');

//use this if the application requires user input on the canvas
e2d.initialize(ctx);

//requestAnimationFrame loop will call this function once per frame
//it is not necessary to use this convenience function provided by e2d
e2d.raf(() => {

  //e2d.render accepts an unlimited number of arguments and the last one must be the canvas context
  return e2d.render(
    e2d.clearRect(canvas.width, canvas.height),
    e2d.fillText("Hello World!", 100, 100),
    ctx
  );
});
```

There is also a babel plugin for `e2dx` elements so that developing on canvas can be more like using SVG in javascript.  It's located [here](https://github.com/e2d/babel-plugin-e2dx) and looks like this:

```javascript

//always call this ONCE to obtain mouse, activeRegion, and keyboard support
e2d.initialize(ctx);

//raf will call the provided function every frame
e2d.raf(() => {
  //get the mouse position
  let { x, y } = e2d.mouseData(ctx);

  //use the translate element to move the point of origin
  return <render ctx={ctx}>
    <clearRect width={canvas.width} height={canvas.height} />
    <translate x={x} y={y}>
      <fillText text="Hello World!" />
    </translate>
  </render>;
  );
});
```

### Instruction variables

`e2d` introduces "Instruction variables" that represent more complex canvas instructions.  They are similar to virtual dom elements in react.

For example, all canvas instructions can be variables and stored for later use.  This speeds up execution time and reduces memory usage.

```javascript
//create a fill command that always fills red
let fillRed = e2d.fillStyle('red', e2d.fill());

//create a 6 sided polygon with radius 10 at [0,0]
let hexagonShape = e2d.createRegularPolygon(10, [0,0], 6);

//e2d.path will wrap the instructions passed to it with beginPath and closePath
let hexagonPath = e2d.path(
    //convenience function to map coordinates to ctx.moveTo, and ctx.lineTo
    hexagonShape.map(e2d.moveToLineTo)
);

//combine the path and fill instructions in an array
let redHexagon = [ hexagonPath, fillRed ];
```

Mix and match different canvas commands to make code more expressive and easier to read.  For example, using the `redHexagon` variable in the above example to get started:

```javascript
//create a canvas first...
e2d.raf(() => {
  return e2d.render(
    //clear the canvas every frame
    e2d.clearRect(canvas.width, canvas.height), //e2d knows that x=0 and y=0 are default parameters

    //move the hexagon center point to the center of the canvas
    e2d.translate(0.5 * canvas.width, 0.5 * canvas.height,
      redHexagon
    ),

    //render it to the canvas context
    ctx
  );
})

```

## Performance

The goal of e2d is to be fast. It has gone under numerous refactors to increase the speed of each canvas property.  On top of engine performance, there is an additional benefit to using `instruction variables`. Using these will result in less user-defined function calls.  With instruction storage, and less user defined function calls, the majority of the application view layer will sit around in memory waiting to be parsed every frame.

Most importantly, creating an entire render tree every frame has a relatively minimal performance impact.

## Drawing Collections

Collections are harder to optimize, so try to make data flow into `instruction variables`.  See the following example:

```javascript
import e2d from 'e2d';
let particles = [];
for(let i = 0; i < 100; i++) {
  particles.push({ //create some particles
    x: Math.random() * config.width,
    y: Math.random() * config.height,
    r: 1
  });
}

//fillArc has default function parameters [x=0, y=0, beginRadians=0, endRadians=Math.PI*2]
let particleShape = e2dfillArc(1); //only the radius is provided

//later
e2d.raf(() => {
  let particleMap = [], particle;

  //loop over each particle using a for loop
  for(let i = 0; i < particles.length; i++) {
    particle = particles[i];

    //move them 1 pixel per frame
    particle.y += 1;

    //loop the particle
    if (particle.y > config.height) {
      particle.y = 0;
    }

    particleMap.push(
      e2d.translate(particle.x, particle.y, //move to the particle position
        e2d.scale(particle.r, particleShape) //scale the particle
      )
    );
  }

  return e2d.render(
    e2d.clearRect(config.width, config.height),
    e2d.fillStyle('blue', particleMap), // every particle is blue in this case
    ctx
  );
});
```

# Getting started

I highly recommend using `webpack` or `browserify` in `node.js` to modularize your code, but the fastest way to get started is to use the `e2d.compat.min.js` file in the `/dist/` folder, or `e2d.min.js` for native `es2015` support.

### Import using script method

```html
<script src="e2d.compat.min.js" type="text/javascript"></script>
```

### webpack-dev-server

Please see [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) for all your web development server needs.

# API

### __e2d.render__

This is the command that actually draws to the canvas.  Create some drawing instructions and pass them to this function.

```javascript
import e2d from 'e2d';

//create a draw command
let helloWorld = e2d.translate(200, 200,
  e2d.fillText("Hello World!")
);

//create a canvas
let canvas = doucment.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

let ctx = canvas.getContext('2d');

e2d.raf(
  //draw something every frame
  () => e2d.render(
    e2d.clearRect(400, 400),
    helloWorld,
    ctx //ctx must be the last parameter
  )
);
```

# Render Commands

The following render commands are provided to you in this library.

### __arc.js__

Arcs have 5 forms, and correspond to the documentation here at [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc):

```javascript
import e2d from 'e2d';

let fastestArc = e2d.arc(); //radius 1 and x, y is 0, 0
let justRadius = e2d.arc(radius); //radius is set, x, y is 0
let radiusWithXY = e2d.arc(x, y, radius); //radius is set, x, y is [x], [y]

//to specify the start and end angle, use the startAngle and endAngle parameters
let radiusWithXYandAngles = e2d.arc(x, y, radius, startAngle, endAngle);

//to specify anticlockwise motion, use the anticlockwise parameter like this
let arcAntiClockwise = e2d.arc(x, y, radius, startAngle, endAngle, anticlockwise);
```

### __arcTo.js__

For information on how the `arcTo` function works, see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arcTo).

```javascript
let arcToInstruction = e2d.arcTo(x1, y1, x2, y2, r);

//don't forget to wrap the arcTo function in the path function
let pathInstruction = e2d.path(
  e2d.arcTo(x1, y1, x2, y2, r)
);
```

### __beginPath.js__

It's possible to control when a path begins manually by using the `beginPath` function.

```javascript
let beginPathOperation = e2d.beginPath();
```

### __bezierCurveTo.js__

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) for information on how to use Bezier curves.

```javascript
//cp1 and cp2 are control points  and the curve ends at [x, y]
let myCurve = e2d.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
```

### __clearRect.js__

To see how clearRect works, see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect).  The `clearRect` function has two forms.

```javascript

//to specify a rectangle at [0,0] use the clearRect shorthand
let widthAndHeight = e2d.clearRect(width, height);

//otherwise, specify x and y
let sizeAndPosition = e2d.clearRect(x, y, width, height);

```

### __clip.js__

This provides a clipping region for child instructions.

In order to draw a clipped image, for instance, use the `clip` function with a path.  For more information on clipping, please visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip).

_Please note that the path cannot be wrapped in the `e2d.path()` function because `clip` will automatically close the path provided._

```javascript

//create a hexigon with radius 200 and map it to a set of moveTo and lineTo instructions
let region = e2d.createRegularPolygon(200, [0, 0], 6).map(e2d.moveToLineTo);

//this results in a polygonal cliped drawImage command
let clippedImage = e2d.clip(
  region, //must be the first argument

  //center the image at [0,0] to see it
  e2d.translate(-img.width * 0.5, -img.height * 0.5,
    e2d.drawImage(img)
  )
);

```

### __imageSmoothingEnabled.js__

This function is wrapper function that sets imageSmoothingEnabled for it's children. _(default is true)_

For more information on how `imageSmoothingEnabled` works, please visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled).

```javascript
let noSmooth = e2d.imageSmoothingEnabled(false,
  ...children
);
```

### __drawImage.js__

This function draws an image to the canvas when rendered.

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) for more information on how to use drawImage.

Note to chrome developers, it's faster to use a image pattern and fill a rectangle using a `fillStyle` or `imagePattern`.

```javascript

//one paramenter means draw the image at 0, 0 with img.width and img.height as the width/height parameters
let imgCommand = e2d.drawImage(img);

let imgCommandPosition = e2d.drawImage(img, x, y); //draw image at x, y, img.width, img.height

let imgCommandSize = e2d.drawImage(img, x, y, width, height); //specify the size of the image

//or draw the image from a source within the image (this is hard to optimize for the browser and may be slow)
let imgSourceSize = e2d.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
```


### __ellipse.js__

This will add an ellipse to the current path.  This method is "pseudo-polyfilled" and supported for all browsers.  For more information on this method please visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse). There are three forms for the ellipse function.

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse) for more information on this experimental technology.

```javascript

let example = e2d.ellipse(radiusX, radiusY); //from 0, 0
let example2 = e2d.ellipse(x, y, radiusX, radiusY); // from x, y
let example3 = e2d.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
```

### __fillArc.js__

This method was added for convenience. It makes the API a bit more consistent and takes the same parameters as the `arc` function and works exactly like `fillRect`.

```javascript
import e2d from 'e2d';

let fastestArc = e2d.fillArc(); //radius 1 and x, y is 0, 0
let justRadius = e2d.fillArc(radius); //radius is set, x, y is 0
let radiusWithXY = e2d.fillArc(x, y, radius); //radius is set, x, y is [x], [y]

//to specify the start and end angle, use the startAngle and endAngle parameters
let radiusWithXYandAngles = e2d.fillArc(x, y, radius, startAngle, endAngle);

//to specify anticlockwise motion, use the anticlockwise parameter like this
let arcAntiClockwise = e2d.fillArc(x, y, radius, startAngle, endAngle, anticlockwise);
```

### __fillRect.js__

To see how fillRect works, see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect).  The `fillRect` function has two forms.

```javascript

//to specify a rectangle at [0,0] use the fillRect shorthand
let widthAndHeight = e2d.fillRect(width, height);

//otherwise, specify x and y
let sizeAndPosition = e2d.fillRect(x, y, width, height);

```

### __fillStyle.js__

This function will "set" the `fillStyle` property using the first argument as the value for the property.  To see how `fillStyle` works visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle).

```javascript

//fill a red circle
let redCircle = e2d.fillStyle('red',
  e2d.fillArc(200)
);
```

Nested fill styles can occur (and stack as a result):

```javascript
let example = e2d.fillStyle('red',
  //fillStyle is red here
  e2d.fillStyle('blue',
    //fillStyle is blue here
  )
  //now it's red again
);
```

### __strokeStyle.js__

This function will "set" the `strokeStyle` property using the first argument as the value for the property.  To see how `strokeStyle` works visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle).

```javascript

//fill a red circle
let redCircle = e2d.strokeStyle('red',
  e2d.strokeArc(200)
);
```

Nested stroke styles can occur (and stack as a result):

```javascript
let example = e2d.strokeStyle('red',
  //strokeStyle is red here
  e2d.strokeStyle('blue',
    //strokeStyle is blue here
  )
  //now it's red again
);
```

### __globalCompositeOperation.js__

For change global composite operations, use `globalCompositeOperation()`.

See [mdn: globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) to learn how to use them.

```javascript
let operation = e2d.globalCompositeOperation('multiply',
  //do some fill operations
);
```

### __globalAlpha.js__

The `globalAlpha` function will apply and set the `globalAlpha` relative to the parent `globalAlpha` value.

```javascript

let alphaCommands = e2d.globalAlpha(0.5,
  //children are now drawn at 0.5 alpha

  e2d.globalAlpha(0.5,
    //children are now drawn at 0.25 alpha because 0.5 * 0.5 is 0.25  (floating point math applies)
  )
)

```

### __hitRegion.js__ and __hitRect.js__

The `hitRect` and `hitRegion` functions will apply a `hitRegion` to the canvas.

Hit regions are complicated, because they are relative to the current state of the canvas context.

```javascript
let hexagon = e2d.createRegularPolygon(100, [0, 0], 6);

let hexagonPath = e2d.path(
  hexagon.map(e2d.moveToLineTo)
);

e2d.initialize(ctx);
e2d.raf(() => {
  let regions = e2d.regions(ctx);

  return e2d.render(
    e2d.translate(100, 100,

      //if there is a hovered region, turn the fillStyle red
      e2d.fillStyle(regions.length > 0 ? 'red' : 'black',

        //fill a hexagon
        hexagonPath, e2d.fill(),

        //set the hexagon region on the canvas
        e2d.hitRegion('hexagon-region', hexagon)
      )
    ),
    ctx
  );
});

```

To make a square use `hitRect(id, x, y, width, height)` or `hitRect(id, width, height)`.

### __invertMatrix.js__

This function will return an inverse matrix relative to the canvas matrix provided by calculating a determinant and returning a new `Array`.

This function is used internally to transform mouse points inversely to determine point in polygon detection relative to the provided shape.

```javascript
let [a, b, c, d, e, f] = e2d.invertMatrix([a, b, c, d, e, f]);
```

### __lineStyle.js__

This is a composite property abstraction that contains `lineWidth` and other useful properties. See [mdn: lineCap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap), [mdn: lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth), [mdn: lineJoin](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [mdn: miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit), and [mdn: setLineDash](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)

```javascript
let style = {
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
let example = e2d.lineStyle(style,
  //do some line stroke() operations here
);
```

### __path.js__, __lineTo.js__ and __moveTo.js__

The `path(pathInstructions)` call wraps `pathInstructions` in `beginPath()` and `endPath()` operations.

To see how these functions work, visit mdn for [moveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo), and [lineTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo).

```javascript
//wrap paths in e2d.path()
let example = e2d.path(
  e2d.moveTo(0, 0),
  e2d.lineTo(10, 10),
  e2d.lineTo(10, 0)
);

```

### __quadraticCurveTo.js__

Use this to make a quadratic curve to another point.  All 4 parameters are required. To see how this function works, please visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo). 

```javascript

let curveCommand = e2d.quadraticCurveTo(cpx, cpy, x, y);
```

### __rotate.js__, __translate.js__, and __scale.js__

Use these functions to translate/rotate/and scale the provided context.

These are the most important functions abstracted by the e2d render engine. Internally e2d uses `setTransform` on the canvas and keeps track of transforms manually.  This allows the developer to use `transforms` like `rotate` and `scale` without worrying about permanently displacing a canvas context.

The `rotate` function uses radians like this.

```javascript
let rotatedSquare = e2d.rotate(Math.PI / 4, //90 degrees
  e2d.path(e2d.rect), e2d.stroke()
);
```

To translate a draw command, use the `translate` function with the `x` and `y` parameters.

```javascript
//fill a circle at [x, y] with radius 100
let movedCircle = e2d.translate(x, y, e2d.fillArc(100));
```
To scale a draw command, use the `scale function.  It has two forms.

```javascript
//scale a rectangle to double it's size
let doubleSized = e2d.scale(2, e2d.fillRect(10, 10));

//scale the rectangle by [x, y]
let doubleSizedXOnly = e2d.scale(x, y, e2d.fillRect(10, 10));
```

As a final example, a default drawSprite function is provided here.

```javascript
//standard sprite function
let drawSprite = (sprite, { position, size, rotation, center }) => e2d.translate(position[0], position[1],
  //rotate before scaling to prevent side effects
  e2d.rotate(rotation,
    e2d.scale(size,
      //center the sprite
      e2d.translate(-center[0], -center[1],
        sprite
      )
    )
  )
);

//this is how it's used
e2d.render(
  drawSprite(e2d.drawImage(img), {
    position: [100, 100],
    size: 1.1,
    rotation: Math.PI / 4,
    center: [img.width * 0.5, img.height * 0.5]
  }),
  ctx
);

```

### __transform.js__

`transform([a,b,c,d,e,f], children...)` is a convenience function for advanced developers to add a transform to the current stack.  For more information on how the `transform` operation works, please visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform).

```javascript
let transformOperation = e2d.transform(
  [A, B, C, D, E, F], //{ a: d11, b: d12, c: d21, d: d22, e: d31, f: d32 } for reference
  ...children
);
```

### __resetTransform.js__ and __setTransform__

These functions give direct access to the `transformStack` values.  To see how these functions work, please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform).

```javascript
let changeCurrentTransform = e2d.setTransform(
  [A, B, C, D, E, F], //{ a: d11, b: d12, c: d21, d: d22, e: d31, f: d32 } for reference
  ...children
);

//this is a shortcut for setTransform([1, 0, 0, 1, 0, 0]);
let returnToIdentity = e2d.resetTransform(...children);
```

### __shadowStyle.js__

Much like __lineStyle.js__ this is a compound property that can be nested.

See [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Shadows) for more details.

```javascript
let shadowStyleDefinition = {
  shadowBlur: 0,
  shadowColor: 'black',
  shadowOffsetX: 0,
  shadowOffsetY: 0
};
```

Example:

```javascript
let shadowCommand = e2d.shadowStyle(shadowStyleDefinition,
  //stuff with a shadow
);
```

### __stokeArc.js__

This function doesn't exist on the Canvas prototype, but was added for completeness.  It draws a circular arc.

This command has four forms.

```javascript

let strokeRadius = e2d.strokeArc(radius); //at 0, 0
let strokePosition = e2d.strokeArc(x, y, radius); //full angle
let strokePortion = e2d.strokeArc(x, y, radius, startAngle, endAngle); //specify the angles
let strokeCounterClockwise = e2d.strokeArc(x, y, radius, startAngle, endAngle, true); //counterclockwise
```

### __strokeRect.js__

This will outline a rectangle.  Please visit [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect) to see how strokeRect works. It has two forms.

```javascript
let rect = e2d.strokeRect(width, height); //at 0, 0
let rect2 = e2d.strokeRect(x, y, width, height);
```

### __textStyle.js__, __fillText.js__, and __strokeText__

These functions help you draw text to the screen using Canvas's really poorly implemented text API.  Please see mdn for more information about the font properties.

Note: the `text` function is deprecated.

```javascript
let style = {
    font: 'Comic Sans MS', //probably pick another font... please?
    textAlign: 'center', // text alignment
    textBaseline: 'top', // base alignment
    direction: 'ltr' // ltr: left to right, rtl: right to left, and inherit
  };

let textCommand = e2d.textStyle(style,
  e2d.fillText('hello world!'), //at 0, 0
  e2d.strokeText('other text', x, y), //at x, y

  //text, x, y, fill, stroke
  e2d.fillText('some other text too', x, y, maxWidth),

  //and maxWidth
  e2d.strokeText('the final example', x, y, maxWidth)
);
```

### __transformPoints.js__

This utility function transforms a set of points relative to the specified transform matrix. It is used internally by `e2d` to calculate and apply mouse regions to the canvas.

```javascript
let matrix = new Float64Array([a, b, c, d, e, f]);
//or...
let matrix = new Float64Array([d11, d12, d21, d22, d31, d32]);
//lookup map
//[d11, d21, d31]  ---- [a, c, e]
//[d12, d22, d32]  ---- [b, d, f]
//[  0,   0,   1]  ---- [0, 0, 1]

let points = [
  [x0, y0],
  [x1, y1],
  [x2, y2],
  ...
  [xN, yN]
];

let newPoints = transformPoints(points, matrix);
```

It returns a new array of `[x, y]` points with the coordinates transformed.

### __createRegularPolygon.js__

Creates a regular polygon shape: an array of arrays.

```javascript
let radius = 10;
let position = [x, y];
let sides = 6;
let hexagon = e2d.createRegularPolygon(radius, position, sides);

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

### __moveToLineTo.js__

This is a convenience function used with the `Array.prototype.map` function that maps shapes to drawable polygons.

```javascript
let hexagonShape = e2d.createRegularPolygon(10, [0, 0], 6);
let hexagonPath = e2d.path( //always wrap drawn paths with e2d.path
  hexagonShape.map(e2d.moveToLineTo) //map each point to an instruction
);

e2d.render(
  hexagonPath,
  e2d.stroke(),
  ctx
);

```

# License

The MIT License (MIT)

Copyright (c) 2015 Joshua Tenner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
