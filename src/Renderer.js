//jshint node: true, browser: true, worker: true

'use strict';
var flatten = require('lodash/array/flatten'),
    isElement = require('lodash/lang/isElement'),
    Canvas = null,
    Gradient = null,
    isWorker = require('./isWorker'),
    createLinearGradient = require('./createLinearGradient'),
    createRadialGradient = require('./createRadialGradient'),
    events = require('events'),
    util = require('util'),
    Img = require('./Img'),
    keycode = require('keycode'),
    smm = require('square-matrix-multiply'),
    transformPoints = require('./transformPoints'),
    pointInPolygon = require('point-in-polygon'),
    pi2 = Math.PI * 2,
    identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

util.inherits(Renderer, events.EventEmitter);

function Renderer(width, height, parent, worker) {
  //this needs to be done later because of cyclical dependencies
  events.EventEmitter.call(this);
  
  if (!Canvas) {
    Canvas = require('./Canvas');
  }
  if (!Gradient) {
    Gradient = require('./Gradient');
  }
  if (!Img) {
    Gradient = require('./Gradient');
  }

  
  this.tree = null;
  this.isReady = false;
  this.mouseState = 'up';
  this.mouseData = {
    x: 0,
    y: 0,
    state: this.mouseState,
    activeRegions: []
  };
  this.lastMouseEvent = null;
  this.ranMouseEvent = false;
  this.mouseRegions = [];
  this.activeRegions = [];
  this.styleQueue = [];
  
  //this is the basic structure of the data sent to the web worker
  this.keyData = {};
  
  if (isWorker) {
    this.worker = null;
    this.canvas =  null;
    this.ctx = null;
    this.parent = null;
    addEventListener('message', this.browserCommand.bind(this));
    Object.seal(this);
    //nothing else to do
    return;
  }
  

  //create the web worker and hook the workerCommand function
  if (worker) {
    this.worker = worker instanceof Worker ? worker : new Worker(worker);
    this.worker.onmessage = this.workerCommand.bind(this);
  } else {
    this.worker = null;
  }
  
  //set parent
  if (!parent || !isElement(parent)) {
    this.parent = document.createElement('div');
    this.parent.style.margin = '0 auto';
    this.parent.style.width = width + 'px';
    this.parent.style.height = height + 'px';
    document.body.appendChild(this.parent);
  } else {
    this.parent = parent;
  }
  
  //set width and height automatically
  if (!width || width <= 0) {
    width = window.innerWidth;
  }
  
  if (!height || height <= 0) {
    height = window.innerHeight;
  }
  
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  
  this.canvas.width = width;
  this.canvas.height = height;
  this.parent.appendChild(this.canvas);
  
  //hook mouse and keyboard events right away
  this.hookMouseEvents();
  this.hookKeyboardEvents();
  
  Object.seal(this);
}

Renderer.prototype.render = function render(args) {
  var i,
      len,
      child,
      props,
      type,
      cache,
      matrix,
      sinr,
      cosr,
      fillStyleStack = [],
      strokeStyleStack = [],
      lineStyleStack = [],
      textStyleStack = [],
      shadowStyleStack = [],
      globalAlphaStack = [],
      transformStack = [identity],
      globalCompositeOperationStack = [],
      ctx = this.ctx,
      children = [];
  
  for (i = 0, len = arguments.length; i < len; i++) {
    children.push(arguments[i]);
  }
  children = flatten(children, true);
  
  if (isWorker) {
    return this.sendBrowser('render', children);
  }
  
  this.mouseRegions = [];
  this.activeRegions = [];
  
  for(i = 0, len = children.length; i < len; i++) {
    child = children[i];
    if (!child) {
      continue;
    }
    props = child.props;
    type = child.type;
    
    if (type === 'transform') {
      matrix = smm(transformStack[transformStack.length - 1], [
        [props.a, props.c, props.e],
        [props.b, props.d, props.f],
        [0,       0,       1      ]
      ]);
      transformStack.push(matrix);
      //ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.setTransform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], matrix[0][2], matrix[1][2]);
      continue;
    }
    
    if (type === 'scale') {
      matrix = smm(transformStack[transformStack.length - 1], [
        [props.x, 0,       0],
        [0,       props.y, 0],
        [0,       0,       1]
      ]);
      transformStack.push(matrix);
      ctx.setTransform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], matrix[0][2], matrix[1][2]);
      continue;
    }
    
    if (type === 'translate') {
      matrix = smm(transformStack[transformStack.length - 1], [
        [1, 0, props.x],
        [0, 1, props.y],
        [0, 0, 1      ]
      ]);
      transformStack.push(matrix);
      ctx.setTransform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], matrix[0][2], matrix[1][2]);
      continue;
    }
    
    if (type === 'rotate') {
      cosr = Math.cos(props.r);
      sinr = Math.sin(props.r);
      
      matrix = smm(transformStack[transformStack.length - 1], [
        [cosr, -sinr, 0],
        [sinr, cosr,  0],
        [0,    0,     1]
      ]);
      transformStack.push(matrix);
      ctx.setTransform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], matrix[0][2], matrix[1][2]);
      continue;
    }
    
    if (type === 'restore') {
      matrix = transformStack.pop();
      ctx.setTransform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], matrix[0][2], matrix[1][2]);
      continue;
    }
    
    if (type === 'fillRect') {
      ctx.fillRect(props.x, props.y, props.width, props.height);
      continue;
    }
    
    if (type === 'strokeRect') {
      ctx.strokeRect(props.x, props.y, props.width, props.height);
      continue;
    }
    
    if (type === 'clearRect') {
      ctx.clearRect(props.x, props.y, props.width, props.height);
      continue;
    }
    
    if (type === 'rect') {
      ctx.rect(props.x, props.y, props.width, props.height);
    }
    
    if (type === 'fillStyle') {
      fillStyleStack.push(ctx.fillStyle);
      ctx.fillStyle = props.value;
      continue;
    }
    
    if (type == 'fillGradient') {
      fillStyleStack.push(ctx.fillStyle);
      if (Gradient.cache.hasOwnProperty(props.value.id)) {
        ctx.fillStyle = Gradient.cache[props.value.id].grd;
      }
      continue;
    }
    
    if (type === 'strokeStyle') {
      strokeStyleStack.push(ctx.strokeStyle);
      ctx.strokeStyle = props.value;
      continue;
    }
    
    if (type == 'strokeGradient') {
      strokeStyleStack.push(ctx.strokeStyle);
      if (Gradient.cache.hasOwnProperty(props.value.id)) {
        ctx.strokeStyle = Gradient.cache[props.value.id].grd;
      }
      continue;
    }
    
    if (type === 'endFillStyle') {
      ctx.fillStyle = fillStyleStack.pop();
      continue;
    }
    
    if (type === 'endStrokeStyle') {
      ctx.strokeStyle = strokeStyleStack.pop();
      continue;
    }
    if (type === 'lineStyle') {
      lineStyleStack.push({
        lineWidth: ctx.lineWidth,
        lineCap: ctx.lineCap,
        lineJoin: ctx.lineJoin,
        miterLimit: ctx.miterLimit,
        lineDash: ctx.getLineDash(),
        lineDashOffset: ctx.lineDashOffset
      });

      if (props.lineWidth !== null) {
        ctx.lineWidth = props.lineWidth;
      }
      if (props.lineCap !== null) {
        ctx.lineCap = props.lineCap;
      }
      if (props.lineJoin !== null) {
        ctx.lineJoin = props.lineJoin;
      }
      if (props.miterLimit !== null) {
        ctx.miterLimit = props.miterLimit;
      }
      if (props.lineDash.length > 0) {
        ctx.setLineDash(props.lineDash);
      }
      if (props.lineDashOffset !== null) {
        ctx.lineDashOffset = props.lineDashOffset;
      }
      continue;
    }
    
    if (type === 'endLineStyle') {
      cache = lineStyleStack.pop();
      ctx.lineWidth = cache.lineWidth;
      ctx.lineCap = cache.lineCap;
      ctx.lineJoin = cache.lineJoin;
      ctx.miterLimit = cache.miterLimit;
      ctx.setLineDash(cache.lineDash);
      ctx.lineDashOffset = cache.lineDashOffset;
      continue;
    }

    if (type === 'textStyle') {
      textStyleStack.push({
        font: ctx.font,
        textAlign: ctx.textAlign,
        textBaseline: ctx.textBaseline,
        direction: ctx.direction
      });
      if (props.font !== null) {
        ctx.font = props.font;
      }
      if (props.textAlign !== null) {
        ctx.textAlign = props.textAlign;
      }
      if (props.textBaseline !== null) {
        ctx.textBaseline = props.textBaseline;
      }
      if (props.lineJoin !== null) {
        ctx.direction = props.direction;
      }
      continue;
    }
    
    if (type === 'endTextStyle') {
      cache = textStyleStack.pop();
      ctx.font = cache.font;
      ctx.textAlign = cache.textAlign;
      ctx.textBaseline = cache.textBaseline;
      ctx.direction = cache.direction;
      continue;
    }
    
    if (type === 'shadowStyle') {
      shadowStyleStack.push({
        shadowBlur: ctx.shadowBlur,
        shadowColor: ctx.shadowColor,
        shadowOffsetX: ctx.shadowOffsetX,
        shadowOffsetY: ctx.shadowOffsetY
      });
      if (props.shadowBlur !== null) {
        ctx.shadowBlur = props.shadowBlur;
      }
      if (props.shadowColor !== null) {
        ctx.shadowColor = props.shadowColor;
      }
      if (props.shadowOffsetX !== null) {
        ctx.shadowOffsetX = props.shadowOffsetX;
      }
      if (props.shadowOffsetY !== null) {
        ctx.shadowOffsetY = props.shadowOffsetY;
      }
      continue;
    }
    
    if (type === 'endShadowStyle') {
      cache = shadowStyleStack.pop();
      ctx.shadowBlur = cache.shadowBlur;
      ctx.shadowColor = cache.shadowColor;
      ctx.shadowOffsetX = cache.shadowOffsetX;
      ctx.shadowOffsetY = cache.shadowOffsetY;
      continue;
    }
    
    if (type === 'text') {
      if (props.maxWidth !== 0) {
        if (props.fill) {
          ctx.fillText(props.text, props.x, props.y, props.maxWidth);
        }
        if (props.stroke) {
          ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
        }
        continue;
      }
      if (props.fill) {
        ctx.fillText(props.text, props.x, props.y);
      }
      if (props.stroke) {
        ctx.strokeText(props.text, props.x, props.y);
      }
      continue;
    }
    
    if (type === 'drawImage') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Img.cache[props.img].imageElement || new Image(), props.dx, props.dy);
      continue;
    }

    if (type === 'drawImageSize') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Img.cache[props.img].imageElement || new Image(), props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'drawImageSource') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Img.cache[props.img].imageElement || new Image(), props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }
    
    if (type === 'fillImagePattern') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      
      ctx.fillStyle = Img.cache[props.img].imagePatternRepeat;
      ctx.translate(props.dx, props.dy);
      ctx.fillRect(0, 0, props.dWidth, props.dHeight);
      ctx.restore();
    }
    
    if (type === 'fillImage') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }

      cache = Img.cache[props.img].imageElement;
      ctx.save();
      ctx.fillStyle = Img.cache[props.img].imagePattern;
      ctx.translate(props.dx, props.dy);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();
      
      continue;
    }

    if (type === 'fillImageSize') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      
      cache = Img.cache[props.img].imageElement;
      ctx.save();
      ctx.fillStyle = Img.cache[props.img].imagePattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(props.dWidth / cache.width, props.dHeight / cache.height);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();
      
      continue;
    }

    if (type === 'fillImageSource') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      
      cache = Img.cache[props.img].imageElement;
      ctx.save();
      ctx.fillStyle = Img.cache[props.img].imagePattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(cache.dWidth / props.sWidth, cache.dHeight / props.sHeight);
      ctx.translate(-props.sx, -props.sy);
      ctx.fillRect(props.sx, props.sy, props.sWidth, props.sHeight);
      ctx.restore();
      
      continue;
    }
    
    
    if (type === 'fillCanvas') {
      if (!Canvas.cache.hasOwnProperty(props.img)) {
        continue;
      }

      cache = Canvas.cache[props.img];
      ctx.save();
      ctx.fillStyle = cache.fillPattern;
      ctx.translate(props.dx, props.dy);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();
      
      continue;
    }

    if (type === 'fillCanvasSize') {
      if (!Canvas.cache.hasOwnProperty(props.img)) {
        continue;
      }
      
      cache = Canvas.cache[props.img];
      ctx.save();
      ctx.fillStyle = cache.fillPattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(props.dWidth / cache.width, props.dHeight / cache.height);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();
      
      continue;
    }

    if (type === 'fillCanvasSource') {
      if (!Canvas.cache.hasOwnProperty(props.img)) {
        continue;
      }
      
      cache = Canvas.cache[props.img];
      ctx.save();
      ctx.fillStyle = cache.fillPattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(cache.width / props.sWidth, cache.height / props.sHeight);
      ctx.translate(-props.sx, -props.sy);
      ctx.fillRect(props.sx, props.sy, props.sWidth, props.sHeight);
      ctx.restore();
      
      continue;
    }
    
    if (type === 'drawCanvas') {
      if (!Canvas.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Canvas.cache[props.img].renderer.canvas, props.dx, props.dy);
      continue;
    }

    if (type === 'drawCanvasSize') {
      if (!Canvas.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Canvas.cache[props.img].renderer.canvas, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'drawCanvasSource') {
      if (!Canvas.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Canvas.cache[props.img].renderer.canvas, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }
    
    if (type === 'strokeArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      ctx.closePath();
      ctx.stroke();
      continue;
    }
    
    if (type === 'strokeArc-counterclockwise') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);
      ctx.closePath();
      ctx.stroke();
      continue;
    }
    
    
    if (type === 'fillArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      ctx.closePath();
      ctx.fill();
      continue;
    }
    
    if (type === 'fillArc-counterclockwise') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      ctx.closePath();
      ctx.fill();
      continue;
    }
    
    if (type === 'moveTo') {
      ctx.moveTo(props.x, props.y);
      continue;
    }
    
    if (type === 'lineTo') {
      ctx.lineTo(props.x, props.y);
      continue;
    }
    
    if (type === 'bezierCurveTo') {
      ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y);
      continue;
    }
    
    if (type === 'quadraticCurveTo') {
      ctx.quadraticCurveTo(props.cpx, props.cpy, props.x, props.y);
      continue;
    }
    
    if (type === 'anticlockwise-arc') {
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);
      continue;
    }
    
    if (type === 'arc') {
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      continue;
    }
    
    if (type === 'full-arc') {
      ctx.arc(props.x, props.y, props.r, 0, pi2);
      continue;
    }
    
    if (type === 'quick-arc') {
      ctx.arc(0, 0, props.r, 0, pi2);
      continue;
    }
    
    if (type === 'arcTo') {
      ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);
      continue;
    }
    
    if (type === 'anticlockwise-ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.rotate(props.rotation);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, props.startAngle, props.endAngle, true);
      this.restore();
      continue;
    }

    if (type === 'ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.rotate(props.rotation);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, props.startAngle, props.endAngle);
      this.restore();
      continue;
    }
    
    if (type === 'full-ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.rotate(props.rotation);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, 0, pi2);
      this.restore();
      continue;
    }
    
    if (type === 'quick-ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, 0, pi2);
      this.restore();
      continue;
    }
    
    if (type === 'globalCompositeOperation') {
      globalCompositeOperationStack.push(ctx.globalCompositeOperation);
      ctx.globalCompositeOperation = props.value;
      continue;
    }
    
    if (type === 'endGlobalCompositeOperation') {
      ctx.globalCompositeOperation = globalCompositeOperationStack.pop();
      continue;
    }
    
    if (type === 'fill') {
      ctx.fill();
      continue;
    }
    
    if (type === 'stroke') {
      ctx.stroke();
      continue;
    }
    if (type === 'clipPath') {
      ctx.clip();
      continue;
    }
    
    if (type === 'beginPath') {
      ctx.beginPath();
      continue;
    }
    
    if (type === 'closePath') {
      ctx.closePath();
      continue;
    }
    
    if (type === 'globalAlpha') {
      globalAlphaStack.push(ctx.globalAlpha);
      ctx.globalAlpha *= props.value;
      continue;
    }
    
    if (type === 'endGlobalAlpha') {
      ctx.globalAlpha = globalAlphaStack.pop();
      continue;
    }
    
    if (type === 'hitRegion') {
      this.mouseRegions.push({
        id: props.id,
        points: transformPoints(props.points, transformStack[transformStack.length - 1])
      });
      continue;
    }
  }
  
  return this.applyStyles();
};

Renderer.create = function create(width, height, parent, worker) {
  if (arguments.length > 2) {
    return new Renderer(width, height, parent, worker);
  }
  if (arguments.length === 2) {
    return new Renderer(width, height);
  }
  return new Renderer();
};

Renderer.prototype.workerCommand = function workerCommand(e) {
  var tree,
      img,
      data = e.data;
  //import the canvas object when we need it because Canvas depends on Renderer
  if (!Canvas) {
    Canvas = require('./Canvas');
  }
  if (!Gradient) {
    Gradient = require('./Gradient');
  }
  
  if (data.type === 'ready') {
    return this.ready();
  }
  
  if (data.type === 'image') {
    img = new Img(data.value.id);
    Img.cache[data.value.id] = img;
    return;
  }
  if (data.type === 'image-source') {
    if (Img.cache.hasOwnProperty(data.value.id)) {
      img = Img.cache[data.value.id];
      img.src = data.value.src;
      img.once('load', function() {
        this.sendWorker('image-load', data.value);
      }.bind(this));
    }
    return;
  }
  
  if (data.type === 'image-cache') {
    if (Img.cache.hasOwnProperty(data.value.id)) {
      Img.cache[data.value.id].cache();
    }
    return;
  }
  
  if (data.type === 'image-dispose') {
    if (Img.cache.hasOwnProperty(data.value.id)) {
      Img.cache[data.value.id].dispose();
    }
    return;
  }
  
  if (data.type === 'render') {  
    //set the tree
    this.tree = data.value;
    return;
  }
  
  if (data.type === 'renderer-resize') {
    return this.resize(data.value.width, data.value.height);
  }
  
  if (data.type === 'canvas') {
    if (!Canvas.cache.hasOwnProperty(data.value.id)) {
      Canvas.cache[data.value.id] = new Canvas(data.value.width, data.value.height, data.value.id);
    }
    img = Canvas.cache[data.value.id];
    img.resize(data.value.width, data.value.height);
    return Canvas.cache[data.value.id].render(data.value.children);
  }
  
  if (data.type === 'canvas-image') {
    if (Canvas.cache.hasOwnProperty(data.value.id)) {
      Canvas.cache[data.value.id].toImage(data.value.imageID);
      return;
    }
  }
  
  if (data.type === 'canvas-cache') {
    if (Canvas.cache.hasOwnProperty(data.value.id) && Canvas.cache[data.value.id]) {
      Canvas.cache[data.value.id].cache();
    }
    return;
  }
  
  if (data.type === 'canvas-dispose' && Canvas.cache.hasOwnProperty(data.value.id) && Canvas.cache[data.value.id]) {
      return Canvas.cache[data.value.id].dispose();
  }
  
  if (data.type === 'linear-gradient') {
    Gradient.cache[data.value.id] = createLinearGradient(data.value.x0, data.value.y0, 
                                                         data.value.x1, data.value.y1, 
                                                         data.value.children, data.value.id);
    return;
  }
  
  if (data.type === 'radial-gradient') {
    Gradient.cache[data.value.id] = createRadialGradient(
      data.value.x0, data.value.y0, data.value.r0,
      data.value.x1, data.value.y1, data.value.r1,
      data.value.children, data.value.id
    );
    return;
  }
  
  if (data.type === 'gradient-dispose') {
    if (Gradient.cache.hasOwnProperty(data.value.id)) {
      return Gradient.cache[data.value.id].dispose();
    }
    return;
  }
  
  if (data.type === 'gradient-cache') {
    if (Gradient.cache.hasOwnProperty(data.value.id)) {
      return Gradient.cachable.push(data.value.id);
    }
    return;
  }
  
  if (data.type === 'style') {
    return this.style(data.value);
  }
  
  return this.emit(data.type, data.value);
};

Renderer.prototype.resize = function(width, height) {
  
  //resize event can be called from browser or worker, so we need to tell the browser to resize itself
  if (isWorker) {
    return this.sendBrowser('renderer-resize', { width: width, height: height });
  }
  
  //only resize if the sizes are different, because it clears the canvas
  if (this.canvas.width.toString() !== width.toString()) {
    this.canvas.width = width;
  }
  if (this.canvas.height.toString() !== height.toString()) {
    this.canvas.height = height;
  }
};

Renderer.prototype.hookRender = function hookRender() {
  //This function is never called worker side, so we can't check isWorker to determine where this code is run.
  var didRender = true;
  
  //If the client has sent a 'ready' command and a tree exists
  if (this.isReady) {
    
      //if the worker exists, we should check to see if the worker has sent back anything yet
      if (this.worker) {
        if (this.tree !== null) {
          
          //fire the mouse event again if it wasn't run
          if (this.lastMouseEvent && !this.ranMouseEvent) {
            this.mouseMove(this.lastMouseEvent);
          }
          
          //fire the frame right away
          this.fireFrame();
          
          //render the current frame from the worker
          this.render(this.tree);
          
          //reset the tree/frame
          this.tree = null;
        } else {
          //the worker isn't finished yet and we missed the window
          didRender = false;
        }
      } else {
        //fire the mouse event again if it wasn't run
        if (this.lastMouseEvent && !this.ranMouseEvent) {
          this.mouseMove(this.lastMouseEvent);
        }
        //we are browser side, so this should fire the frame synchronously
        this.fireFrame();
      }
    
      //clean up the cache, but only after the frame is rendered and when the browser has time to
      if (didRender) {
        this.ranMouseEvent = false;
        setTimeout(this.cleanUpCache.bind(this), 0);
      }
  }
  
  return requestAnimationFrame(this.hookRender.bind(this));
};

Renderer.prototype.cleanUpCache = function cleanUpCache() {
  Img.cleanUp();
  Canvas.cleanUp();
  return Gradient.cleanUp();
};

Renderer.prototype.sendWorker = function sendWorker(type, value) {
  //if there is no worker, the event needs to happen browser side
  if (!this.worker) {
    //fire the event anyway
    return this.emit(type, value);
  }
  //otherwise, post the message
  return this.worker.postMessage({ type: type, value: value });
};

Renderer.prototype.sendBrowser = function sendBrowser(type, value) {
  //there is definitely a browser on the other end
  return postMessage({ type: type, value: value });
};


Renderer.prototype.sendAll = function sendAll(type, value) {
  if (!isWorker) {
    this.sendWorker(type, value);
  } else {
    this.sendBrowser(type, value);
  }
  return this.emit(type, value);
};
/*
 * Mouse move events simply increment the down and up values every time the event is fired.
 * This allows games that are lagging record the click counts. It gets reset to 0 every time
 * it is sent.
 */

Renderer.prototype.hookMouseEvents = function hookMouseEvents() {
  //whenever the mouse moves, report the position
  document.addEventListener('mousemove', this.mouseMove.bind(this));
  
  //only report mousedown on canvas
  this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
  
  //mouse up can happen anywhere
  return document.addEventListener('mouseup', this.mouseUp.bind(this));
};

Renderer.prototype.mouseMove = function mouseMove(evt) {
  //get bounding rectangle
  var rect = this.canvas.getBoundingClientRect(),
      mousePoint = [0,0],
      region;
  this.lastMouseEvent = evt;
  this.ranMouseEvent = true;
  
  mousePoint[0] = evt.clientX - rect.left;
  mousePoint[1] = evt.clientY - rect.top;
  
  for(var i = 0; i < this.mouseRegions.length; i++) {
    region = this.mouseRegions[i];
    if (pointInPolygon(mousePoint, region.points)) {
      this.activeRegions.push(region.id);
      this.mouseRegions.splice(this.mouseRegions.indexOf(region), 1);
      i -= 1;
    }
  }
  
  this.mouseData.x = mousePoint[0];
  this.mouseData.y = mousePoint[1];
  this.mouseData.state = this.mouseState;
  this.mouseData.activeRegions = this.activeRegions;

  //send the mouse event to the worker
  this.sendWorker('mouse', this.mouseData);
  
  //default event stuff
  evt.preventDefault();
  return false;
};

Renderer.prototype.mouseDown = function mouseMove(evt) {
  //set the mouseState down
  this.mouseState = 'down';
  
  //defer to mouseMove
  return this.mouseMove(evt);
};

Renderer.prototype.mouseUp = function mouseMove(evt) {
  //set the mouse state
  this.mouseState = 'up';
  //defer to mouse move
  return this.mouseMove(evt);
};

Renderer.prototype.hookKeyboardEvents = function hookMouseEvents() {
  
  //every code in keycode.code needs to be on keyData
  for (var name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      this.keyData[name] = "up";
    }
  }
  
  //keydown should only happen ON the canvas
  this.canvas.addEventListener('keydown', this.keyDown.bind(this));
  
  //but keyup should be captured everywhere
  return document.addEventListener('keyUp', this.keyUp.bind(this));
};

Renderer.prototype.keyChange = function keyChange(evt) {
  this.sendWorker('key', this.keyData);
  evt.preventDefault();
  return false;
};

Renderer.prototype.keyDown = function keyDown(evt) {
  this.keyData[keycode.code[evt.keyCode]] = "down";
  return this.keyChange(evt);
};

Renderer.prototype.keyUp = function keyUp(evt) {
  this.keyData[keycode.code[evt.keyCode]] = "up";
  return this.keyChange(evt);
};

Renderer.prototype.browserCommand = function(e) {
  if (e.data.type === 'image-load') {
    Img.cache[e.data.value.id].emit('load');
  }
  
  return this.emit(e.data.type, e.data.value);
};

Renderer.prototype.fireFrame = function() {
  return this.sendWorker('frame', {});
};

Renderer.prototype.style = function style() {
  var styles = [],
      name;
  for (var i = 0; i < arguments.length; i++) {
    styles.push(arguments[i]);
  }
  styles = flatten(styles);
  if (isWorker) {
    this.sendBrowser('style', styles);
  } else {
    for (i = 0; i < styles.length; i++) {
      this.styleQueue.push(styles[i]);
    }
    
  }
};

Renderer.prototype.applyStyles = function applyStyles() {
  var styleVal, value;
  for(var i = 0; i < this.styleQueue.length; i++) {
    styleVal = this.styleQueue[i];
    for(var name in styleVal) {
      if (styleVal.hasOwnProperty(name)) {
        this.canvas.style[name] = styleVal[name];
      }
    }
  }
  this.styleQueue.splice(0, this.styleQueue.length); 
};

Renderer.prototype.ready = function ready() {
  if (isWorker) {
    this.sendBrowser('ready');
  } else {
    this.isReady = true;
    this.fireFrame();
    return requestAnimationFrame(this.hookRender.bind(this));
  }
};
Object.seal(Renderer);
Object.seal(Renderer.prototype);
module.exports = Renderer;
