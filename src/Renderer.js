//jshint node: true
//jshint browser: true
//jshint worker: true

'use strict';
var flatten = require('lodash/array/flatten'),
    Canvas = null,
    Gradient = null,
    isWorker = require('./isWorker'),
    createLinearGradient = require('./createLinearGradient'),
    createRadialGradient = require('./createRadialGradient'),
    self = typeof window !== 'undefined' ? window : this,
    Img = require('./Img'),
    pi2 = Math.PI * 2;

function Renderer(width, height, parent, worker) {
  this.tree = null;
  this.ready = false;
  this.frame = null;
  
  if (isWorker) {
    this.worker = null;
    this.canvas =  null;
    this.ctx = null;
    this.parent = null;
    Object.seal(this);
    return;
  }
  
  var workerObj;
  
  
  if (worker) {
    workerObj = this.worker = new Worker(worker);
    workerObj.onmessage = this.workerCommand.bind(this);
  } else {
    this.worker = null;
  }
  
  //set parent
  if (arguments.length < 3) {
    parent = this.parent = document.createElement('div');
    parent.style.margin = '0 auto';
    parent.style.width = width + 'px';
    parent.style.height = height + 'px';
    document.body.appendChild(parent);
  } else {
    this.parent = parent;
  }
  
  //set width and height automatically
  if (arguments.length < 2) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  
  
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  parent.appendChild(canvas);
  this.canvas = canvas;
  this.ctx = ctx;
  Object.seal(this);
}

Renderer.prototype.render = function render(args) {
  var i,
      len,
      child,
      props,
      type,
      cache,
      fillStyleStack = [],
      lineStyleStack = [],
      textStyleStack = [],
      shadowStyleStack = [],
      globalAlphaStack = [],
      globalCompositeOperationStack = [],
      ctx = this.ctx,
      children = [];
  if (!Canvas) {
    Canvas = require('./Canvas');
  }
  if (!Gradient) {
    Gradient = require('./Gradient');
  }
  
  for (i = 0, len = arguments.length; i < len; i++) {
    children.push(arguments[i]);
  }
  children = flatten(children, true);
  
  if (isWorker) {
    return this.sendBrowser('render', children);
  }
  
  
  for(i = 0, len = children.length; i < len; i++) {
    child = children[i];
    props = child.props;
    
    type = child.type;
    if (type === 'transform') {
      ctx.save();
      ctx.transform(props.a, props.b, props.c, props.d, props.e, props.f);
      continue;
    }
    
    if (type === 'scale') {
      ctx.save();
      ctx.scale(props.x, props.y);
      continue;
    }
    
    if (type === 'translate') {
      ctx.save();
      ctx.translate(child.props.x, child.props.y);
      continue;
    }
    
    if (type === 'rotate') {
      ctx.save();
      ctx.rotate(child.props.r);
      continue;
    }
    
    if (type === 'restore') {
      ctx.restore();
      continue;
    }
    
    if (child.type === 'fillRect') {
      ctx.fillRect(props.x, props.y, props.width, props.height);
      continue;
    }
    
    if (child.type === 'strokeRect') {
      ctx.strokeRect(props.x, props.y, props.width, props.height);
      continue;
    }
    
    if (type === 'clearRect') {
      ctx.clearRect(props.x, props.y, props.width, props.height);
      continue;
    }
    
    if (type === 'fillStyle') {
      fillStyleStack.push(ctx.fillStyle);
      ctx.fillStyle = props.value;
      continue;
    }
    
    if (type == 'fillGradient') {
      cache = Gradient.cache[props.value.id];
      fillStyleStack.push(ctx.fillStyle);
      ctx.fillStyle = cache.grd;
      if (cache.disposable) {
        setTimeout(cache.dispose.bind(cache), 0);
      }
      continue;
    }
    
    if (type === 'endFillStyle') {
      ctx.fillStyle = fillStyleStack.pop();
      continue;
    }
    
    if (type === 'lineStyle') {
      lineStyleStack.push({
        strokeStyle: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
        lineCap: ctx.lineCap,
        lineJoin: ctx.lineJoin,
        miterLimit: ctx.miterLimit,
        lineDash: ctx.getLineDash(),
        lineDashOffset: ctx.lineDashOffset
      });
      if (props.strokeStyle !== null) {
        ctx.strokeStyle = props.strokeStyle;
      }
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
      ctx.strokeStyle = cache.strokeStyle;
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
      ctx.drawImage(Img.cache[props.img], props.dx, props.dy);
      continue;
    }

    if (type === 'drawImageSize') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Img.cache[props.img], props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'drawImageSource') {
      if (!Img.cache.hasOwnProperty(props.img)) {
        continue;
      }
      ctx.drawImage(Img.cache[props.img], props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
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
    }
  }
  
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
    this.ready = true;
    this.sendWorker('frame', {});
    return this.hookRender();
  }
  
  if (data.type === 'image') {
    img = new Img(data.value.id);
    return img.generateTexture(data.value.buffer, data.value.opts);
  }
  
  if (data.type === 'image-dispose') {
    if (Img.cache.hasOwnProperty(data.value.id)) {
      Img.cache[data.value.id] = null;
    }
    return;
  }
  
  if (data.type === 'render') {  

    if (this.tree) {
      this.tree = this.tree.concat(data.value);
    } else {
      this.tree = data.value;
    }
    
    if (!this.frame) {
      this.frame = requestAnimationFrame(this.hookRender.bind(this));
    }
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
  
  if (data.type === 'canvas-dispose') {
    if (Canvas.cache.hasOwnProperty(data.value.id) && Canvas.cache[data.value.id]) {
      Canvas.cache[data.value.id].dispose();
    }
    return;
  }
  
  if (data.type === 'linear-gradient') {
    Gradient.cache[data.value.id] = createLinearGradient(data.value.x0, data.value.y0, data.value.x1, data.value.y1, data.value.children, data.value.id);
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
      Gradient.cache[data.value.id].dispose();
    }
    return;
  }
  if (data.type === 'gradient-cache') {
    if (Gradient.cache.hasOwnProperty(data.value.id)) {
      Gradient.cache[data.value.id].cache();
    }
    return;
  }
};

Renderer.prototype.resize = function(width, height) {
  if (isWorker) {
    return this.sendBrowser('renderer-resize', { width: width, height: height });
  }
  if (this.canvas.width.toString() !== width.toString()) {
    this.canvas.width = width;
  }
  if (this.canvas.height.toString() !== height.toString()) {
    this.canvas.height = height;
  }
};

Renderer.prototype.hookRender = function hookRender() {
  //If the client has sent a 'ready' command
  if (this.ready) {
    
    //check if the tree exists
    if (this.tree !== null) {
      //even if the worker sends a message back before the frame finishes rendering,
      //javascript will queue it up after rendering is done. So send the message ASAP.
      
      this.sendWorker('frame', {});
      this.render(this.tree);
      this.tree = null;
      this.frame = null;
    } else {
      return requestAnimationFrame(this.hookRender.bind(this));
    }
  }
};

Renderer.prototype.sendWorker = function sendWorker(type, value) {
  return this.worker.postMessage({ type: type, value: value });
};

Renderer.prototype.sendBrowser = function sendBrowser(type, value) {
  return postMessage({ type: type, value: value });
};

Object.seal(Renderer);
Object.seal(Renderer.prototype);
module.exports = Renderer;
