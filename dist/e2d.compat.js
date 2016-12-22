(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["e2d"] = factory();
	else
		root["e2d"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 58);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Instruction = function Instruction(type, props) {
  _classCallCheck(this, Instruction);

  this.type = type;
  this.props = props;
  return Object.seal(this);
};

Object.seal(Instruction);
Object.seal(Instruction.prototype);

module.exports = Instruction;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var transformPoints = function transformPoints(points, matrix) {
  var result = [],
      x = void 0,
      y = void 0;

  for (var i = 0; i < points.length; i++) {
    var _points$i = points[i];
    x = _points$i[0];
    y = _points$i[1];

    result.push([matrix[0] * x + matrix[2] * y + matrix[4], matrix[1] * x + matrix[3] * y + matrix[5]]);
  }
  return result;
};

module.exports = transformPoints;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0),
    cache = new Instruction('beginPath');

var beginPath = function beginPath() {
  return cache;
};

module.exports = beginPath;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var cache = new Instruction('closePath');

var closePath = function closePath() {
  return cache;
};

module.exports = closePath;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var cycleMouseData = function cycleMouseData(ctx) {
  var mouseData = ctx.canvas[Symbol.for('mouseData')];
  if (mouseData) {
    mouseData.dx = mouseData.x - mouseData.previousX;
    mouseData.dy = mouseData.y - mouseData.previousY;

    mouseData.previousX = mouseData.x;
    mouseData.previousY = mouseData.y;

    mouseData.clicked = 0;
  }
};

module.exports = cycleMouseData;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var det = 0;
var invertMatrix = function invertMatrix(_ref) {
  var a = _ref[0],
      b = _ref[1],
      c = _ref[2],
      d = _ref[3],
      e = _ref[4],
      f = _ref[5];
  return det = 1 / (a * d - c * b), [d * det, -c * det, -b * det, a * det, (b * f - e * d) * det, (e * b - a * f) * det];
};
module.exports = invertMatrix;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var lineTo = function lineTo(x, y) {
  return new Instruction('lineTo', { x: x, y: y });
};

module.exports = lineTo;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var moveTo = function moveTo(x, y) {
  return new Instruction('moveTo', { x: x, y: y });
};

module.exports = moveTo;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var pointInRect = function pointInRect(_ref, _ref2) {
  var px = _ref[0],
      py = _ref[1];
  var _ref2$ = _ref2[0],
      x = _ref2$[0],
      y = _ref2$[1],
      _ref2$2 = _ref2[1],
      width = _ref2$2[0],
      height = _ref2$2[1];
  return px > x && py > y && px < width && py < height;
};

module.exports = pointInRect;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var setTransform = function setTransform(matrix) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('setTransform', [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]]), children, end];
};

module.exports = setTransform;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var pointInPolygon = __webpack_require__(57);
var transformPoints = __webpack_require__(1);
var invertMatrix = __webpack_require__(5);
var pointInRect = __webpack_require__(8);

var matrix = new Float64Array(6);

module.exports = function (ctx) {
  var regions = ctx.canvas[Symbol.for('regions')],
      mousePoints = ctx.canvas[Symbol.for('mousePoints')],
      mouseData = ctx.canvas[Symbol.for('mouseData')],
      results = {};

  //the mouse might have held still, add the current mouse position
  if (mousePoints.length === 0) {
    mousePoints.push([mouseData.x, mouseData.y, mouseData.state]);
  }

  for (var _iterator = regions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var region = _ref;


    //invert the region matrix and transform the mouse points
    var transformedMousePoints = transformPoints(mousePoints, invertMatrix(region.matrix));
    //the mouse points are now relative to the mouse region

    if (!region.polygon) {
      for (var _iterator2 = transformedMousePoints, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var mousePoint = _ref2;

        if (pointInRect(mousePoint, region.points)) {
          region.hover = true;
          region.clicked = !!mouseData.clicked;
          results[region.id] = region;
          break;
        }
      }
      continue;
    }

    //loop over each point until one is matched
    for (var _iterator3 = transformedMousePoints, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var _mousePoint = _ref3;

      if (pointInPolygon(_mousePoint, region.points)) {
        region.hover = true;
        region.clicked = !!mouseData.clicked;
        results[region.id] = region;
        break;
      }
    }
  }
  return results;
};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

var arc = function arc() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var x = args[0],
      y = args[1],
      r = args[2],
      startAngle = args[3],
      endAngle = args[4],
      counterclockwise = args[5];

  var props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };

  if (args.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (args.length > 1) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("arc", props);
};

module.exports = arc;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var arcTo = function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('arcTo', { x1: x1, y1: y1, x2: x2, y2: y2, r: r });
};

module.exports = arcTo;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var bezierCurveTo = function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
  return new Instruction('bezierCurveTo', {
    cp1x: cp1x,
    cp1y: cp1y,
    cp2x: cp2x,
    cp2y: cp2y,
    x: x,
    y: y
  });
};

module.exports = bezierCurveTo;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var clearRect = function clearRect() {
  return new Instruction('clearRect', arguments.length > 2 ? { x: arguments.length <= 0 ? undefined : arguments[0], y: arguments.length <= 1 ? undefined : arguments[1], width: arguments.length <= 2 ? undefined : arguments[2], height: arguments.length <= 3 ? undefined : arguments[3] } : { x: 0, y: 0, width: arguments.length <= 0 ? undefined : arguments[0], height: arguments.length <= 1 ? undefined : arguments[1] });
};

module.exports = clearRect;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var begin = new Instruction('beginClip'),
    performClip = new Instruction('clip'),
    end = new Instruction('endClip');

var clip = function clip(path) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [begin, path, performClip, children, end];
};

module.exports = clip;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var cache = new Instruction('clipPath');

var clipPath = function clipPath() {
  return cache;
};

module.exports = clipPath;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var createRegularPolygon = function createRegularPolygon() {
  var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var sides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

  var polygon = [];
  for (var i = 0; i < sides; i++) {
    polygon.push([position[0] + radius * Math.cos(Math.PI * 2 * i / sides), position[1] + radius * Math.sin(Math.PI * 2 * i / sides)]);
  }
  return polygon;
};

module.exports = createRegularPolygon;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var concat = [].concat;

var createWrapper = function createWrapper() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  function _ref() {
    // i is set to the placeholder index now

    //now grab all the elements to the left of the placeHolder
    var left = args.splice(0, i);

    //remove the placeHolder from the array
    args.shift();

    return {
      v: function v() {
        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          children[_key2] = arguments[_key2];
        }

        return [left, children, args];
      }
    };
  }

  for (var i = 0; i < args.length; i++) {
    //parse and flatten the arguments
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args).filter(Boolean);
    }

    if (!args[i]) {
      continue;
    }

    var type = args[i].type;

    if (type === 'placeholder') {
      var _ret = _ref();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  }

  throw new Error('Could not find placeholder, did you forget the e2d.placeHolder() call?');
};

module.exports = concat;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var drawImage = function drawImage() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var img = args[0],
      sx = args[1],
      sy = args[2],
      sWidth = args[3],
      sHeight = args[4],
      dx = args[5],
      dy = args[6],
      dWidth = args[7],
      dHeight = args[8];


  if (args.length === 9) {
    return new Instruction('drawImageSource', {
      img: img,
      sx: sx,
      sy: sy,
      sWidth: sWidth,
      sHeight: sHeight,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (args.length >= 5) {
    return new Instruction('drawImageSize', {
      img: img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (args.length >= 3) {
    return new Instruction('drawImage', {
      img: img,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('drawImage', {
    img: img,
    dx: 0,
    dy: 0
  });
};

module.exports = drawImage;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

var ellipse = function ellipse() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var x = args[0],
      y = args[1],
      radiusX = args[2],
      radiusY = args[3],
      rotation = args[4],
      startAngle = args[5],
      endAngle = args[6],
      anticlockwise = args[7];


  var props = { x: 0, y: 0, radiusX: x, radiusY: y, rotation: 0, startAngle: 0, endAngle: pi2, anticlockwise: false };

  if (args.length > 5) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.anticlockwise = !!anticlockwise;
  }

  if (args.length > 4) {
    props.rotation = rotation;
  }

  if (args.length > 2) {
    props.x = x;
    props.y = y;
    props.radiusX = radiusX;
    props.radiusY = radiusY;
  }

  return new Instruction("ellipse", props);
};

module.exports = ellipse;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var cache = new Instruction('fill');

var fill = function fill() {
  return cache;
};

module.exports = fill;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

var fillArc = function fillArc() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var x = args[0],
      y = args[1],
      r = args[2],
      startAngle = args[3],
      endAngle = args[4],
      counterclockwise = args[5];

  var props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };

  if (args.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (args.length >= 2) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("fillArc", props);
};

module.exports = fillArc;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var fillRect = function fillRect() {
  return new Instruction('fillRect', arguments.length > 2 ? { x: arguments.length <= 0 ? undefined : arguments[0], y: arguments.length <= 1 ? undefined : arguments[1], width: arguments.length <= 2 ? undefined : arguments[2], height: arguments.length <= 3 ? undefined : arguments[3] } : { x: 0, y: 0, width: arguments.length <= 0 ? undefined : arguments[0], height: arguments.length <= 1 ? undefined : arguments[1] });
};

module.exports = fillRect;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endFillStyle');

var fillStyle = function fillStyle(value) {
    for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        children[_key - 1] = arguments[_key];
    }

    return [new Instruction('fillStyle', { value: value }), children, end];
};

module.exports = fillStyle;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var fillText = function fillText() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var text = args[0],
      x = args[1],
      y = args[2],
      maxWidth = args[3];

  if (args.length < 4) {
    maxWidth = null;
  }
  if (args.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('fillText', { text: text, x: x, y: y, maxWidth: maxWidth });
};

module.exports = fillText;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endGlobalAlpha');

var globalAlpha = function globalAlpha(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('globalAlpha', { value: value }), children, end];
};
module.exports = globalAlpha;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var end = new Instruction('endGlobalCompositeOperation');

var globalCompositeOperation = function globalCompositeOperation(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('globalCompositeOperation', { value: value }), children, end];
};

module.exports = globalCompositeOperation;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var hitRect = function hitRect(id) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var x = args[0],
      y = args[1],
      width = args[2],
      height = args[3];

  if (args.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return new Instruction('hitRect', {
    id: id,
    points: [[x, y], [x + width, y + height]]
  });
};

module.exports = hitRect;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var hitRegion = function hitRegion(id, points) {
  return new Instruction('hitRegion', { id: id, points: points });
};

module.exports = hitRegion;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endImageSmoothingEnabled');

var imageSmoothingEnabled = function imageSmoothingEnabled(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('imageSmoothingEnabled', { value: value }), children, end];
};
module.exports = imageSmoothingEnabled;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var keycode = __webpack_require__(56);

module.exports = function (ctx) {
  var canvas = ctx.canvas;

  //mouseData

  canvas[Symbol.for('mouseData')] = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    previousX: 0,
    previousY: 0,
    state: false,
    clicked: 0
  };

  var keys = canvas[Symbol.for('keyData')] = {};

  for (var name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      keys[name] = false;
    }
  }

  //mouse regions
  canvas[Symbol.for('regions')] = [];
  canvas[Symbol.for('mousePoints')] = [];

  //make the canvas receive touch and mouse events
  canvas.tabIndex = 1;

  var mouseMove = function mouseMove(evt) {
    var clientX = evt.clientX,
        clientY = evt.clientY;
    //get left and top coordinates

    var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
        left = _canvas$getBoundingCl.left,
        top = _canvas$getBoundingCl.top;

    var mouseData = canvas[Symbol.for('mouseData')];

    var point = [clientX - left, clientY - top, mouseData.state];

    mouseData.x = point[0];
    mouseData.y = point[1];

    var points = canvas[Symbol.for('mousePoints')];

    points.push(point);

    //store the last 100 stored positions for hover detection
    if (points.length > 100) {
      points.splice(0, points.length - 100);
    }

    evt.preventDefault();
    return false;
  };

  canvas.addEventListener('mousemove', function (evt) {
    return mouseMove(evt);
  });
  canvas.addEventListener('mousedown', function (evt) {
    var target = evt.target;

    if (target === canvas) {
      var mouseData = canvas[Symbol.for('mouseData')];

      if (!mouseData.state) {
        mouseData.clicked += 1;
      }

      mouseData.state = true;
      return mouseMove(evt);
    }
  });
  canvas.addEventListener('mouseup', function (evt) {
    var mouseData = canvas[Symbol.for('mouseData')];
    mouseData.state = false;
    return mouseMove(evt);
  });
  canvas.addEventListener('keydown', function (evt) {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = true;
    evt.preventDefault();
    return false;
  });
  canvas.addEventListener('keyup', function (evt) {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = false;
    evt.preventDefault();
    return false;
  });
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (ctx) {
  return ctx.canvas[Symbol.for('keyData')];
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endLineStyle');

var lineStyle = function lineStyle(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  value = value || {};
  var result = {
    lineWidth: null,
    lineCap: null,
    lineJoin: null,
    miterLimit: null,
    lineDash: null,
    lineDashOffset: null
  };

  if (typeof value.lineWidth !== 'undefined') {
    result.lineWidth = value.lineWidth;
  }
  if (typeof value.lineCap !== 'undefined') {
    result.lineCap = value.lineCap;
  }
  if (typeof value.lineJoin !== 'undefined') {
    result.lineJoin = value.lineJoin;
  }
  if (typeof value.miterLimit !== 'undefined') {
    result.miterLimit = value.miterLimit;
  }
  if (typeof value.lineDash !== 'undefined') {
    result.lineDash = value.lineDash || [];
  }
  if (typeof value.lineDashOffset !== 'undefined') {
    result.lineDashOffset = value.lineDashOffset;
  }
  return [new Instruction('lineStyle', result), children, end];
};

module.exports = lineStyle;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (ctx) {
  return ctx.canvas[Symbol.for('mouseData')];
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var moveTo = __webpack_require__(7),
    lineTo = __webpack_require__(6);

var moveToLineTo = function moveToLineTo(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
};

module.exports = moveToLineTo;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var beginPath = __webpack_require__(2)(),
    closePath = __webpack_require__(3)();

var path = function path() {
  for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
    children[_key] = arguments[_key];
  }

  return [beginPath, children, closePath];
};

module.exports = path;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var cache = new Instruction('placeholder');
var placeHolder = function placeHolder() {
  return cache;
};

module.exports = placeHolder;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var quadraticCurveTo = function quadraticCurveTo(cpx, cpy, x, y) {
  return new Instruction('quadraticCurveTo', {
    cpx: cpx,
    cpy: cpy,
    x: x,
    y: y
  });
};

module.exports = quadraticCurveTo;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var raf = function raf(func) {
  requestAnimationFrame(function () {
    return raf(func);
  });
  return func();
};

module.exports = raf;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var rect = function rect() {
  return new Instruction('rect', arguments.length > 2 ? { x: arguments.length <= 0 ? undefined : arguments[0], y: arguments.length <= 1 ? undefined : arguments[1], width: arguments.length <= 2 ? undefined : arguments[2], height: arguments.length <= 3 ? undefined : arguments[3] } : { x: 0, y: 0, width: arguments.length <= 0 ? undefined : arguments[0], height: arguments.length <= 1 ? undefined : arguments[1] });
};

module.exports = rect;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


//initialize all the properties

var identity = [1, 0, 0, 1, 0, 0],
    matrix = new Float64Array(identity),
    fillStyleStack = [],
    strokeStyleStack = [],
    lineStyleStack = [],
    textStyleStack = [],
    shadowStyleStack = [],
    globalCompositeOperationStack = [],
    globalAlphaStack = [],
    imageSmoothingEnabledStack = [],
    transformStack = new Float64Array(501 * 6),
    transformStackIndex = 6,
    concat = [].concat,
    supportsEllipse = false;

if (typeof CanvasRenderingContext2D !== 'undefined') {
  supportsEllipse = CanvasRenderingContext2D.prototype.hasOwnProperty('ellipse');
}

//transform points function
var transformPoints = __webpack_require__(1);
var cycleMouseData = __webpack_require__(4);

var increaseTransformStackSize = function increaseTransformStackSize() {
  var cache = transformStack;
  transformStack = new Float64Array(transformStack.length + 600); //add 100 more
  transformStack.set(cache);
  return undefined;
};

transformStack.set(identity);

var PI2 = Math.PI * 2;

var empty = function empty(target) {
  return target && target.splice(0, target.length);
};

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var children = args.slice(0, -1),
      ctx = args[args.length - 1];

  var regions = ctx.canvas[Symbol.for('regions')],
      mousePoints = ctx.canvas[Symbol.for('mousePoints')],
      extensions = ctx.canvas[Symbol.for('extensions')];

  var cache = void 0;

  cycleMouseData(ctx);

  empty(regions);
  empty(mousePoints);

  var len = children.length;

  //flatten children during the loop process to save cpu
  for (var i = 0; i < len; i++) {
    var child = children[i];

    //flattening algorithm
    if (child && child.constructor === Array) {
      children = concat.apply([], children);
      child = children[i];

      //repeat as necessary
      while (child && child.constructor === Array) {
        children = concat.apply([], children);
        child = children[i];
      }

      len = children.length;
    }

    //child must be truthy
    if (!child) {
      continue;
    }

    var _child = child,
        props = _child.props,
        type = _child.type;


    if (type === 'transform') {

      //copy transformStack values to matrix
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      //increase the index
      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      //perform the transform math
      transformStack[transformStackIndex - 6] = //d
      matrix[0] * props[0] + matrix[2] * props[1];
      transformStack[transformStackIndex - 5] = //b
      matrix[1] * props[0] + matrix[3] * props[1];
      transformStack[transformStackIndex - 4] = //c
      matrix[0] * props[2] + matrix[2] * props[3];
      transformStack[transformStackIndex - 3] = //d
      matrix[1] * props[2] + matrix[3] * props[3];
      transformStack[transformStackIndex - 2] = //e
      matrix[0] * props[4] + matrix[2] * props[5] + matrix[4];
      transformStack[transformStackIndex - 1] = //f
      matrix[1] * props[4] + matrix[3] * props[5] + matrix[5];

      //modify the ctx
      ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);
      continue;
    }

    if (type === 'setTransform') {
      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = props[0]; //a
      transformStack[transformStackIndex - 5] = props[1]; //b
      transformStack[transformStackIndex - 4] = props[2]; //c
      transformStack[transformStackIndex - 3] = props[3]; //d
      transformStack[transformStackIndex - 2] = props[4]; //e
      transformStack[transformStackIndex - 1] = props[5]; //f
      ctx.setTransform(props[0], props[1], props[2], props[3], props[4], props[5]);

      continue;
    }

    if (type === 'scale') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0] * props.x; //a
      transformStack[transformStackIndex - 5] = matrix[1] * props.x; //b
      transformStack[transformStackIndex - 4] = matrix[2] * props.y; //c
      transformStack[transformStackIndex - 3] = matrix[3] * props.y; //d
      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f

      ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);

      continue;
    }

    if (type === 'translate') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0]; //a
      transformStack[transformStackIndex - 5] = matrix[1]; //b
      transformStack[transformStackIndex - 4] = matrix[2]; //c
      transformStack[transformStackIndex - 3] = matrix[3]; //d
      transformStack[transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y; //e
      transformStack[transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y; //f

      ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);
      continue;
    }

    if (type === 'rotate') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0] * props.cos + matrix[2] * props.sin; //a
      transformStack[transformStackIndex - 5] = matrix[1] * props.cos + matrix[3] * props.sin; //b
      transformStack[transformStackIndex - 4] = matrix[0] * -props.sin + matrix[2] * props.cos; //c
      transformStack[transformStackIndex - 3] = matrix[1] * -props.sin + matrix[3] * props.cos; //d
      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f

      ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);
      continue;
    }

    if (type === 'skewX') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0]; //a
      transformStack[transformStackIndex - 5] = matrix[1]; //b
      transformStack[transformStackIndex - 4] = //c
      matrix[0] * props.x + matrix[2];
      transformStack[transformStackIndex - 3] = //d
      matrix[1] * props.x + matrix[3];
      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f


      ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);
      continue;
    }

    if (type === 'skewY') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0] * 1 + matrix[2] * props.y; //a
      transformStack[transformStackIndex - 5] = matrix[1] * 1 + matrix[3] * props.y; //b
      transformStack[transformStackIndex - 4] = matrix[2]; //c
      transformStack[transformStackIndex - 3] = matrix[3]; //d

      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f

      ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);
      continue;
    }

    if (type === 'restore') {
      transformStackIndex -= 6;
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
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
      continue;
    }

    if (type === 'fillStyle') {
      fillStyleStack.push(ctx.fillStyle);
      ctx.fillStyle = props.value;
      continue;
    }

    if (type === 'strokeStyle') {
      strokeStyleStack.push(ctx.strokeStyle);
      ctx.strokeStyle = props.value;
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
      if (props.lineDash !== null) {
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
      if (props.direction !== null) {
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

    if (type === 'strokeText') {
      if (props.maxWidth) {
        ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
        continue;
      }
      ctx.strokeText(props.text, props.x, props.y);
      continue;
    }

    if (type === 'fillText') {
      if (props.maxWidth) {
        ctx.fillText(props.text, props.x, props.y, props.maxWidth);
        continue;
      }
      ctx.fillText(props.text, props.x, props.y);
      continue;
    }

    if (type === 'drawImage') {
      ctx.drawImage(props.img, props.dx, props.dy);
      continue;
    }

    if (type === 'drawImageSize') {
      ctx.drawImage(props.img, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'drawImageSource') {
      ctx.drawImage(props.img, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'strokeArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
      ctx.closePath();
      ctx.stroke();
      continue;
    }

    if (type === 'fillArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
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

    if (type === 'arc') {
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
      continue;
    }

    if (type === 'arcTo') {
      ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);
      continue;
    }

    if (type === 'ellipse') {
      //if the method is provided by the browser
      if (supportsEllipse) {
        ctx.ellipse(props.x, props.y, props.radiusX, props.radiusY, props.rotation, props.startAngle, props.endAngle, props.anticlockwise);
        continue;
      }
      ctx.save();
      ctx.translate(props.x, props.y);
      ctx.rotate(props.rotation);
      ctx.scale(props.radiusX, props.radiusY);
      ctx.arc(0, 0, 1, props.startAngle, props.endAngle, props.anticlockwise);
      ctx.restore();
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

    if (type === 'beginClip') {
      ctx.save();
      ctx.beginPath();
      continue;
    }

    if (type === 'clip') {
      ctx.clip();
      continue;
    }

    if (type === 'endClip') {
      ctx.restore();
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

    if (type === 'hitRect' && regions) {
      cache = [transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]];

      regions.push({
        id: props.id,
        points: props.points,
        matrix: cache,
        //rectangle!
        polygon: false,
        hover: false,
        touched: false,
        clicked: false
      });
    }

    if (type === 'hitRegion' && regions) {
      cache = [transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]];

      regions.push({
        id: props.id,
        points: props.points,
        matrix: cache,
        polygon: true,
        hover: false,
        touched: false,
        clicked: false
      });

      continue;
    }

    if (type === 'imageSmoothingEnabled') {
      imageSmoothingEnabledStack.push(ctx.imageSmoothingEnabled);
      ctx.imageSmoothingEnabled = props.value;

      continue;
    }

    if (type === 'endImageSmoothingEnabled') {
      ctx.imageSmoothingEnabled = imageSmoothingEnabledStack.pop();
      continue;
    }

    if (extensions && extensions[type]) {
      extensions[type](props, ctx);
      continue;
    }
  }
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var setTransform = __webpack_require__(9);

var resetTransform = function resetTransform() {
  for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
    children[_key] = arguments[_key];
  }

  return setTransform([1, 0, 0, 1, 0, 0], children);
};

module.exports = resetTransform;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var rotate = function rotate(r) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }), children, end];
};

module.exports = rotate;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var scale = function scale(x, y) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [new Instruction('scale', { x: x, y: y }), children, end];
};

module.exports = scale;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endShadowStyle');

var shadowStyle = function shadowStyle(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  value = value || {};
  var result = {
    shadowBlur: null,
    shadowColor: null,
    shadowOffsetX: null,
    shadowOffsetY: null
  };

  if (typeof value.shadowBlur !== 'undefined') {
    result.shadowBlur = value.shadowBlur;
  }
  if (typeof value.shadowColor !== 'undefined') {
    result.shadowColor = value.shadowColor;
  }
  if (typeof value.shadowOffsetX !== 'undefined') {
    result.shadowOffsetX = value.shadowOffsetX;
  }
  if (typeof value.direction !== 'undefined') {
    result.shadowOffsetY = value.shadowOffsetY;
  }

  return [new Instruction('shadowStyle', value), children, end];
};

module.exports = shadowStyle;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var skewX = function skewX(x) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('skewX', { x: Math.tan(x) }), children, end];
};

module.exports = skewX;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var skewY = function skewY(x) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('skewY', { y: Math.tan(y) }), children, end];
};

module.exports = skewY;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var cache = new Instruction('stroke');

var stroke = function stroke() {
  return cache;
};
module.exports = stroke;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

var strokeArc = function strokeArc() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var x = args[0],
      y = args[1],
      r = args[2],
      startAngle = args[3],
      endAngle = args[4],
      counterclockwise = args[5];

  var props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };

  if (args.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (args.length > 1) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("strokeArc", props);
};

module.exports = strokeArc;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var strokeRect = function strokeRect() {
  return new Instruction('strokeRect', arguments.length > 2 ? { x: arguments.length <= 0 ? undefined : arguments[0], y: arguments.length <= 1 ? undefined : arguments[1], width: arguments.length <= 2 ? undefined : arguments[2], height: arguments.length <= 3 ? undefined : arguments[3] } : { x: 0, y: 0, width: arguments.length <= 0 ? undefined : arguments[0], height: arguments.length <= 1 ? undefined : arguments[1] });
};

module.exports = strokeRect;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endStrokeStyle');

var strokeStyle = function strokeStyle(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('strokeStyle', { value: value }), children, end];
};

module.exports = strokeStyle;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);

var strokeText = function strokeText() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var text = args[0],
      x = args[1],
      y = args[2],
      maxWidth = args[3];


  if (args.length < 4) {
    maxWidth = null;
  }
  if (args.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('strokeText', {
    text: text,
    x: x,
    y: y,
    maxWidth: maxWidth
  });
};

module.exports = strokeText;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('endTextStyle');

var textStyle = function textStyle(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  value = value || {};
  var result = {
    font: null,
    textAlign: null,
    textBaseline: null,
    direction: null
  };

  if (typeof value.font !== 'undefined') {
    result.font = value.font;
  }
  if (typeof value.textAlign !== 'undefined') {
    result.textAlign = value.textAlign;
  }
  if (typeof value.textBaseline !== 'undefined') {
    result.textBaseline = value.textBaseline;
  }
  if (typeof value.direction !== 'undefined') {
    result.direction = value.direction;
  }

  return [new Instruction('textStyle', result), children, end];
};

module.exports = textStyle;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var transform = function transform(values) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('transform', [values[0], values[1], values[2], values[3], values[4], values[5]]), children, end];
};

module.exports = transform;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var translate = function translate(x, y) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return [new Instruction('translate', { x: x, y: y }), children, end];
};

module.exports = translate;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function (searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === (typeof searchInput === 'undefined' ? 'undefined' : _typeof(searchInput))) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
    if (hasKeyCode) searchInput = hasKeyCode;
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput];

  // Everything else (cast to string)
  var search = String(searchInput);

  // check codes
  var foundNamedKey = codes[search.toLowerCase()];
  if (foundNamedKey) return foundNamedKey;

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()];
  if (foundNamedKey) return foundNamedKey;

  // weird character?
  if (search.length === 1) return search.charCodeAt(0);

  return undefined;
};

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'left command': 91,
  'right command': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
};

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 34,
  'ins': 45,
  'del': 46,
  'cmd': 91
};

/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) {
  codes[String.fromCharCode(i)] = i - 32;
} // numbers
for (var i = 48; i < 58; i++) {
  codes[i - 48] = i;
} // function keys
for (i = 1; i < 13; i++) {
  codes['f' + i] = i + 111;
} // numpad keys
for (i = 0; i < 10; i++) {
  codes['numpad ' + i] = i + 96;
} /**
   * Get by code
   *
   *   exports.name[13] // => 'Enter'
   */

var names = exports.names = exports.title = {}; // title for backward compat

// Create reverse mapping
for (i in codes) {
  names[codes[i]] = i;
} // Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias];
}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0],
        y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0],
            yi = vs[i][1];
        var xj = vs[j][0],
            yj = vs[j][1];

        var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  'activeRegions': __webpack_require__(10),
  'arc': __webpack_require__(11),
  'arcTo': __webpack_require__(12),
  'beginPath': __webpack_require__(2),
  'bezierCurveTo': __webpack_require__(13),
  'clearRect': __webpack_require__(14),
  'clip': __webpack_require__(15),
  'clipPath': __webpack_require__(16),
  'closePath': __webpack_require__(3),
  'createRegularPolygon': __webpack_require__(17),
  'createWrapper': __webpack_require__(18),
  'cycleMouseData': __webpack_require__(4),
  'drawImage': __webpack_require__(19),
  'ellipse': __webpack_require__(20),
  'fill': __webpack_require__(21),
  'fillArc': __webpack_require__(22),
  'fillRect': __webpack_require__(23),
  'fillStyle': __webpack_require__(24),
  'fillText': __webpack_require__(25),
  'globalAlpha': __webpack_require__(26),
  'globalCompositeOperation': __webpack_require__(27),
  'hitRect': __webpack_require__(28),
  'hitRegion': __webpack_require__(29),
  'imageSmoothingEnabled': __webpack_require__(30),
  'initialize': __webpack_require__(31),
  'Instruction': __webpack_require__(0),
  'invertMatrix': __webpack_require__(5),
  'keyData': __webpack_require__(32),
  'lineStyle': __webpack_require__(33),
  'lineTo': __webpack_require__(6),
  'mouseData': __webpack_require__(34),
  'moveTo': __webpack_require__(7),
  'moveToLineTo': __webpack_require__(35),
  'path': __webpack_require__(36),
  'placeHolder': __webpack_require__(37),
  'pointInRect': __webpack_require__(8),
  'quadraticCurveTo': __webpack_require__(38),
  'raf': __webpack_require__(39),
  'rect': __webpack_require__(40),
  'render': __webpack_require__(41),
  'resetTransform': __webpack_require__(42),
  'rotate': __webpack_require__(43),
  'scale': __webpack_require__(44),
  'setTransform': __webpack_require__(9),
  'shadowStyle': __webpack_require__(45),
  'skewX': __webpack_require__(46),
  'skewY': __webpack_require__(47),
  'stroke': __webpack_require__(48),
  'strokeArc': __webpack_require__(49),
  'strokeRect': __webpack_require__(50),
  'strokeStyle': __webpack_require__(51),
  'strokeText': __webpack_require__(52),
  'textStyle': __webpack_require__(53),
  'transform': __webpack_require__(54),
  'transformPoints': __webpack_require__(1),
  'translate': __webpack_require__(55)
};

/***/ }
/******/ ]);
});