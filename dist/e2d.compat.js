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

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
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
/******/ 	return __webpack_require__(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
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
/***/ function(module, exports) {

"use strict";
'use strict';

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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

//jshint node: true

var Instruction = __webpack_require__(0);
var cache = new Instruction('beginPath');
var beginPath = function beginPath() {
  return cache;
};

module.exports = beginPath;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
'use strict';

var Instruction = __webpack_require__(0);

var hitRegion = function hitRegion(id, points) {
  return new Instruction('hitRegion', { id: id, points: points });
};

module.exports = hitRegion;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function lineTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('lineTo', { x: 0, y: 0 });
  }
  return new Instruction('lineTo', { x: x, y: y });
}

module.exports = lineTo;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function moveTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('moveTo', { x: 0, y: 0 });
  }
  return new Instruction('moveTo', { x: x, y: y });
}

module.exports = moveTo;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 8 */
/***/ function(module, exports) {

"use strict";
"use strict";

var transformPoints = function transformPoints(points, matrix) {
  var result = [],
      len = points.length,
      point;

  for (var i = 0; i < len; i++) {
    point = points[i];
    result.push([matrix[0] * point[0] + matrix[2] * point[1] + matrix[4], matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]]);
  }
  return result;
};

module.exports = transformPoints;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {'use strict';

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function splitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function () {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function (path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function (path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};

// path.relative(from, to)
// posix version
exports.relative = function (from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};

exports.basename = function (path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  return splitPath(path)[3];
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./Instruction.js": 0,
	"./activeRegions.js": 13,
	"./addColorStop.js": 14,
	"./arc.js": 15,
	"./arcTo.js": 16,
	"./beginPath.js": 2,
	"./bezierCurveTo.js": 17,
	"./clearRect.js": 18,
	"./clip.js": 19,
	"./clipPath.js": 20,
	"./closePath.js": 3,
	"./createRegularPolygon.js": 21,
	"./createWrapper.js": 22,
	"./drawImage.js": 23,
	"./ellipse.js": 24,
	"./fill.js": 25,
	"./fillArc.js": 26,
	"./fillRect.js": 27,
	"./fillStyle.js": 28,
	"./fillText.js": 29,
	"./globalAlpha.js": 30,
	"./globalCompositeOperation.js": 31,
	"./hitRect.js": 32,
	"./hitRegion.js": 4,
	"./imageSmoothingEnabled.js": 33,
	"./keyData.js": 34,
	"./lineStyle.js": 35,
	"./lineTo.js": 5,
	"./mouseData.js": 36,
	"./moveTo.js": 6,
	"./moveToLineTo.js": 37,
	"./path.js": 38,
	"./placeHolder.js": 39,
	"./quadraticCurveTo.js": 40,
	"./raf.js": 41,
	"./rect.js": 42,
	"./render.js": 43,
	"./resetTransform.js": 44,
	"./rotate.js": 45,
	"./scale.js": 46,
	"./setTransform.js": 7,
	"./shadowStyle.js": 47,
	"./skewX.js": 48,
	"./skewY.js": 49,
	"./stroke.js": 50,
	"./strokeArc.js": 51,
	"./strokeRect.js": 52,
	"./strokeStyle.js": 53,
	"./strokeText.js": 54,
	"./textStyle.js": 55,
	"./transform.js": 56,
	"./transformPoints.js": 8,
	"./translate.js": 57,
	"./use.js": 58
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 10;


/***/ },
/* 11 */
/***/ function(module, exports) {

"use strict";
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
/* 12 */
/***/ function(module, exports) {

"use strict";
'use strict';

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var pointInPolygon = __webpack_require__(11);

module.exports = function (ctx) {
  var regions = ctx.canvas[Symbol.for('regions')];
  var mousePoints = ctx.canvas[Symbol.for('mousePoints')];
  var mouseData = ctx.canvas[Symbol.for('mouseData')];
  var results = [];
  var found = false;

  for (var i = 0; i < regions.length; i++) {
    var region = regions[i];

    for (var j = 0; j < mousePoints.length; j++) {
      var mousePoint = mousePoints[j];

      if (pointInPolygon(mousePoint, region.points)) {
        region.hover = true;
        region.clicked = !!mouseData.clicked;
        results.push(region);
        found = true;
      }
      if (found) {
        break;
      }
    }
  }
  return results;
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

var addColorStop = function addColorStop(offset, color) {
  return new Instruction('addColorStop', { offset: offset, color: color });
};

module.exports = addColorStop;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

function arc(x, y, r, startAngle, endAngle, counterclockwise) {
  var props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };

  if (arguments.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (arguments.length > 1) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("arc", props);
}

module.exports = arc;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

var arcTo = function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('arcTo', { x1: x1, y1: y1, x2: x2, y2: y2, r: r });
};

module.exports = arcTo;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function clearRect(x, y, width, height) {
  return new Instruction('clearRect', arguments.length > 2 ? { x: x, y: y, width: width, height: height } : { x: 0, y: 0, width: x, height: y });
}

module.exports = clearRect;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var cache = new Instruction('clipPath');

var clipPath = function clipPath() {
  return cache;
};

module.exports = clipPath;

/***/ },
/* 21 */
/***/ function(module, exports) {

"use strict";
"use strict";

var createRegularPolygon = function createRegularPolygon(radius, position, sides) {
  radius = +radius || 1;
  position[0] = +position[0] || 0;
  position[1] = +position[1] || 0;
  sides = +sides || 3;
  var polygon = [];
  for (var i = 0; i < sides; i++) {
    polygon.push([position[0] + radius * Math.cos(Math.PI * 2 * i / sides), position[1] + radius * Math.sin(Math.PI * 2 * i / sides)]);
  }
  return polygon;
};

module.exports = createRegularPolygon;

/***/ },
/* 22 */
/***/ function(module, exports) {

"use strict";
'use strict';

var concat = [].concat;

var createWrapper = function createWrapper() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var found = false;
  for (var _i = 0; _i < args.length; _i++) {
    //parse and flatten the arguments
    while (args[_i] && args[_i].constructor === Array) {
      args = concat.apply([], args).filter(Boolean);
    }
    var type = args[_i].type;

    if (type === 'placeholder') {
      found = true;

      // i is set to the placeholder index now
      break;
    }
  }

  if (!found) throw new Error('Could not find placeholder, did you forget the e2d.placeHolder() call?');
  return function () {
    for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      children[_key2] = arguments[_key2];
    }

    return args.splice(i, 1, children);
  };
};

module.exports = concat;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
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

  if (arguments.length >= 5) {
    return new Instruction('drawImageSize', {
      img: img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (arguments.length >= 3) {
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
}

module.exports = drawImage;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  var props = { x: 0, y: 0, radiusX: x, radiusY: y, startAngle: 0, endAngle: pi2, anticlockwise: false };

  if (arguments.length > 4) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.anticlockwise = !!anticlockwise;
  }

  if (arguments.length > 2) {
    props.x = x;
    props.y = y;
    props.radiusX = radiusX;
    props.radiusY = radiusY;
  }

  return new Instruction("ellipse", props);
}

module.exports = ellipse;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var cache = new Instruction('fill');

var fill = function fill() {
  return cache;
};

module.exports = fill;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

function fillArc(x, y, r, startAngle, endAngle, counterclockwise) {
  var props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };

  if (arguments.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (arguments.length >= 2) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("fillArc", props);
}

module.exports = fillArc;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function fillRect(x, y, width, height) {
  return new Instruction('fillRect', arguments.length > 2 ? { x: x, y: y, width: width, height: height } : { x: 0, y: 0, width: x, height: y });
}

module.exports = fillRect;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function fillText(text, x, y, maxWidth) {
  if (arguments.length < 4) {
    maxWidth = null;
  }
  if (arguments.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('fillText', { text: text, x: x, y: y, maxWidth: maxWidth });
}

module.exports = fillText;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var end = new Instruction('endGlobalAlpha');

var globalAlpha = function globalAlpha(value, children) {
  return [new Instruction('globalAlpha', { value: value }), children, end];
};
module.exports = globalAlpha;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0),
    hitRegion = __webpack_require__(4);

function hitRect(id, x, y, width, height) {
  if (arguments.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return hitRegion(id, [[x, y], [x, y + height], [x + width, y + height], [x + width, y]]);
}

module.exports = hitRect;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 34 */
/***/ function(module, exports) {

"use strict";
'use strict';

module.exports = function (ctx) {
  return ctx.canvas[Symbol.for('keyData')];
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
    lineDash: [],
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
    result.lineDash = value.lineDash;
  }
  if (typeof value.lineDashOffset !== 'undefined') {
    result.lineDashOffset = value.lineDashOffset;
  }
  return [new Instruction('lineStyle', result), children, end];
};

module.exports = lineStyle;

/***/ },
/* 36 */
/***/ function(module, exports) {

"use strict";
'use strict';

module.exports = function (ctx) {
  return ctx.canvas[Symbol.for('mouseData')];
};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var moveTo = __webpack_require__(6),
    lineTo = __webpack_require__(5);

var moveToLineTo = function moveToLineTo(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
};

module.exports = moveToLineTo;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

var cache = new Instruction('placeholder');
var placeHolder = function placeHolder() {
  return cache;
};

module.exports = placeHolder;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 41 */
/***/ function(module, exports) {

"use strict";
"use strict";

var raf = function raf(func) {
  requestAnimationFrame(func);
  return func();
};

module.exports = raf;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function rect(x, y, width, height) {
  return new Instruction('rect', arguments.length > 2 ? { x: x, y: y, width: width, height: height } : { x: 0, y: 0, width: x, height: y });
}

module.exports = rect;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
    concat = [].concat;

var transformPoints = __webpack_require__(8);
var keycode = __webpack_require__(1);

var increaseTransformStackSize = function increaseTransformStackSize() {
  var cache = transformStack;
  transformStack = new Float64Array(transformStack.length + 600); //add 100 more
  transformStack.set(cache);
  return undefined;
};

transformStack.set(identity);

var PI2 = Math.PI * 2;

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var children = args.slice(0, -1);
  var ctx = args[args.length - 1];
  var mouseData = ctx.canvas[Symbol.for('mouseData')];
  var regions = ctx.canvas[Symbol.for('regions')];

  if (mouseData) {
    mouseData.dx = mouseData.x - mouseData.previousX;
    mouseData.dy = mouseData.y - mouseData.previousY;

    mouseData.previousX = mouseData.x;
    mouseData.previousY = mouseData.y;

    mouseData.clicked = 0;
  }

  if (regions) {
    regions.splice(0, regions.length);
  }
  //wrap children in case
  children = [children];

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

      transformStack[transformStackIndex - 6] = //d
      matrix[0];
      transformStack[transformStackIndex - 5] = //b
      matrix[1];
      transformStack[transformStackIndex - 4] = //c
      matrix[0] * props.x + matrix[2];
      transformStack[transformStackIndex - 3] = //d
      matrix[1] * props.x + matrix[3];
      transformStack[transformStackIndex - 2] = //e
      matrix[4];
      transformStack[transformStackIndex - 1] = //f
      matrix[5];

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

      transformStack[transformStackIndex - 6] = //d
      matrix[0] * 1 + matrix[2] * props.y;
      transformStack[transformStackIndex - 5] = //b
      matrix[1] * 1 + matrix[3] * props.y;
      transformStack[transformStackIndex - 4] = //c
      matrix[2];
      transformStack[transformStackIndex - 3] = //d
      matrix[3];
      transformStack[transformStackIndex - 2] = //e
      matrix[4];
      transformStack[transformStackIndex - 1] = //f
      matrix[5];

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
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.anticlockwise);
      continue;
    }

    if (type === 'arcTo') {
      ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);

      continue;
    }

    if (type === 'ellipse') {
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

    if (type === 'hitRegion' && regions) {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      regions.push({
        id: props.id,
        points: transformPoints(props.points, matrix),
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
  }
};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var setTransform = __webpack_require__(7);

var resetTransform = function resetTransform() {
  for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
    children[_key] = arguments[_key];
  }

  return setTransform([1, 0, 0, 1, 0, 0], children);
};

module.exports = resetTransform;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 46 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var end = new Instruction('restore');

var scale = function scale(x, y) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var i = 2;
  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [new Instruction('scale', { x: x, y: y }), children, end];
};

module.exports = scale;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 49 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 50 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var cache = new Instruction('stroke');

var stroke = function stroke() {
  return cache;
};
module.exports = stroke;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

function strokeArc(x, y, r, startAngle, endAngle, counterclockwise) {
  var props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };

  if (arguments.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (arguments.length > 1) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("strokeArc", props);
}

module.exports = strokeArc;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function strokeRect(x, y, width, height) {
  return new Instruction('strokeRect', arguments.length > 2 ? { x: x, y: y, width: width, height: height } : { x: 0, y: 0, width: x, height: y });
}

module.exports = strokeRect;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var end = new Instruction('endStrokeStyle');

var fillStyle = function fillStyle(value) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return [new Instruction('strokeStyle', { value: value }), children, end];
};

module.exports = fillStyle;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);

function strokeText(text, x, y, maxWidth) {
  if (arguments.length < 4) {
    maxWidth = null;
  }
  if (arguments.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('strokeText', {
    text: text,
    x: x,
    y: y,
    maxWidth: maxWidth
  });
}

module.exports = strokeText;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Instruction = __webpack_require__(0);
var end = new Instruction('endTextStyle');

var textStyle = function textStyle(value, children) {
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

  return [new Instruction('textStyle', value), children, end];
};

module.exports = textStyle;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

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
/* 58 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var keycode = __webpack_require__(1);

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

    var point = [clientX - left, clientY - top];

    var mouseData = canvas[Symbol.for('mouseData')];
    mouseData.x = point[0];
    mouseData.y = point[1];

    //store the mouse position for hover detection
    canvas[Symbol.for('mousePoints')].push(point);
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
/* 59 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var src = __webpack_require__(10),
    path = __webpack_require__(9);

module.exports = src.keys().reduce(function (index, key) {
  index[path.basename(key, path.extname(key))] = src(key);
  return index;
}, {});

/***/ }
/******/ ]);
});
