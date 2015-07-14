(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.e2d = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
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
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

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
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
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
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
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

exports.dirname = function(path) {
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


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
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
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
//jshint node: true
'use strict';


module.exports = ({"Canvas":require("./src\\Canvas.js"),"Gradient":require("./src\\Gradient.js"),"Img":require("./src\\Img.js"),"Instruction":require("./src\\Instruction.js"),"Renderer":require("./src\\Renderer.js"),"addColorStop":require("./src\\addColorStop.js"),"arc":require("./src\\arc.js"),"arcTo":require("./src\\arcTo.js"),"beginPath":require("./src\\beginPath.js"),"bezierCurveTo":require("./src\\bezierCurveTo.js"),"clearRect":require("./src\\clearRect.js"),"clip":require("./src\\clip.js"),"clipPath":require("./src\\clipPath.js"),"closePath":require("./src\\closePath.js"),"createLinearGradient":require("./src\\createLinearGradient.js"),"createRadialGradient":require("./src\\createRadialGradient.js"),"drawCanvas":require("./src\\drawCanvas.js"),"drawImage":require("./src\\drawImage.js"),"ellipse":require("./src\\ellipse.js"),"fill":require("./src\\fill.js"),"fillArc":require("./src\\fillArc.js"),"fillRect":require("./src\\fillRect.js"),"fillStyle":require("./src\\fillStyle.js"),"globalCompositeOperation":require("./src\\globalCompositeOperation.js"),"isDataUrl":require("./src\\isDataUrl.js"),"isWorker":require("./src\\isWorker.js"),"lineStyle":require("./src\\lineStyle.js"),"lineTo":require("./src\\lineTo.js"),"moveTo":require("./src\\moveTo.js"),"path":require("./src\\path.js"),"quadraticCurveTo":require("./src\\quadraticCurveTo.js"),"rotate":require("./src\\rotate.js"),"scale":require("./src\\scale.js"),"shadowStyle":require("./src\\shadowStyle.js"),"stroke":require("./src\\stroke.js"),"strokeArc":require("./src\\strokeArc.js"),"strokeRect":require("./src\\strokeRect.js"),"text":require("./src\\text.js"),"textStyle":require("./src\\textStyle.js"),"transform":require("./src\\transform.js"),"translate":require("./src\\translate.js")});
},{"./src\\Canvas.js":21,"./src\\Gradient.js":22,"./src\\Img.js":23,"./src\\Instruction.js":24,"./src\\Renderer.js":25,"./src\\addColorStop.js":26,"./src\\arc.js":27,"./src\\arcTo.js":28,"./src\\beginPath.js":29,"./src\\bezierCurveTo.js":30,"./src\\clearRect.js":31,"./src\\clip.js":32,"./src\\clipPath.js":33,"./src\\closePath.js":34,"./src\\createLinearGradient.js":35,"./src\\createRadialGradient.js":36,"./src\\drawCanvas.js":37,"./src\\drawImage.js":38,"./src\\ellipse.js":39,"./src\\fill.js":40,"./src\\fillArc.js":41,"./src\\fillRect.js":42,"./src\\fillStyle.js":43,"./src\\globalCompositeOperation.js":44,"./src\\isDataUrl.js":45,"./src\\isWorker.js":46,"./src\\lineStyle.js":47,"./src\\lineTo.js":48,"./src\\moveTo.js":49,"./src\\path.js":50,"./src\\quadraticCurveTo.js":51,"./src\\rotate.js":52,"./src\\scale.js":53,"./src\\shadowStyle.js":54,"./src\\stroke.js":55,"./src\\strokeArc.js":56,"./src\\strokeRect.js":57,"./src\\text.js":58,"./src\\textStyle.js":59,"./src\\transform.js":60,"./src\\translate.js":61}],4:[function(require,module,exports){
var baseFlatten = require('../internal/baseFlatten'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Flattens a nested array. If `isDeep` is `true` the array is recursively
 * flattened, otherwise it is only flattened a single level.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, 3, [4]]]);
 * // => [1, 2, 3, [4]]
 *
 * // using `isDeep`
 * _.flatten([1, [2, 3, [4]]], true);
 * // => [1, 2, 3, 4]
 */
function flatten(array, isDeep, guard) {
  var length = array ? array.length : 0;
  if (guard && isIterateeCall(array, isDeep, guard)) {
    isDeep = false;
  }
  return length ? baseFlatten(array, isDeep) : [];
}

module.exports = flatten;

},{"../internal/baseFlatten":6,"../internal/isIterateeCall":12}],5:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],6:[function(require,module,exports){
var arrayPush = require('./arrayPush'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../lang/isArguments":15,"../lang/isArray":16,"./arrayPush":5,"./isArrayLike":10,"./isObjectLike":14}],7:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],8:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":7}],9:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":18}],10:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":8,"./isLength":13}],11:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],12:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":19,"./isArrayLike":10,"./isIndex":11}],13:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],14:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],15:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":10,"../internal/isObjectLike":14}],16:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":9,"../internal/isLength":13,"../internal/isObjectLike":14}],17:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":19}],18:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":14,"./isFunction":17}],19:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],20:[function(require,module,exports){
/*

index.js - square matrix multiply

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var squareMatrixMultiply = module.exports = function squareMatrixMultiply (A, B, algorithm) {
    switch (algorithm && algorithm.toLowerCase()) {
        case 'strassen': 
            return strassen(A, B);
        case 'naive':
        default:
            return naive(A, B);
    }
};

var naive = function naive (A, B) {
    var n = A.length;
    var C = [];
    for (var e = 0; e < n; e++) {
        C.push([]);
    }
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            C[i][j] = 0;
            for (var k = 0; k < n; k++) {
                C[i][j] = C[i][j] + (A[i][k] * B[k][j]);
            }
        }
    }
    return C;
};

var strassen = function strassen (A, B) {
    var n = A.length;
    var C = [];
    for (var e = 0; e < n; e++) {
        C.push([]);
    }
    if (n == 1) {
        C[0][0] = A[0][0] * B[0][0];
    } else {
        var halfOfN = n / 2;

        // matrix partitions initialization
        var A11 = [], A12 = [], A21 = [], A22 = [];
        var B11 = [], B12 = [], B21 = [], B22 = [];
        for (e = 0; e < halfOfN; e++) {
            A11.push([]);
            A12.push([]);
            A21.push([]);
            A22.push([]);
            B11.push([]);
            B12.push([]);
            B21.push([]);
            B22.push([]);
        }
        var row, column;
        for (row = 0; row < halfOfN; row++) {
            for (column = 0; column < halfOfN; column++) {
                A11[row][column] = A[row][column];
                B11[row][column] = B[row][column];
            }
            for (column = halfOfN; column < n; column++) {
                A12[row][column - halfOfN] = A[row][column];
                B12[row][column - halfOfN] = B[row][column];
            }
        }
        for (row = halfOfN; row < n; row++) {
            for (column = 0; column < halfOfN; column++) {
                A21[row - halfOfN][column] = A[row][column];
                B21[row - halfOfN][column] = B[row][column];
            }
            for (column = halfOfN; column < n; column++) {
                A22[row - halfOfN][column - halfOfN] = A[row][column];
                B22[row - halfOfN][column - halfOfN] = B[row][column];
            }
        }

        // strassen matrices
        var S1 = [], S2 = [], S3 = [], S4 = [], S5 = [], S6 = [], S7 = [],
            S8 = [], S9 = [], S10 = [];
        for (e = 0; e < halfOfN; e++) {
            S1.push([]);
            S2.push([]);
            S3.push([]);
            S4.push([]);
            S5.push([]);
            S6.push([]);
            S7.push([]);
            S8.push([]);
            S9.push([]);
            S10.push([]);
        }

        for (row = 0; row < halfOfN; row++) {
            for (column = 0; column < halfOfN; column++) {
                S1[row][column] = B12[row][column] - B22[row][column];
                S2[row][column] = A11[row][column] + A12[row][column];
                S3[row][column] = A21[row][column] + A22[row][column];
                S4[row][column] = B21[row][column] - B11[row][column];
                S5[row][column] = A11[row][column] + A22[row][column];
                S6[row][column] = B11[row][column] + B22[row][column];
                S7[row][column] = A12[row][column] - A22[row][column];
                S8[row][column] = B21[row][column] + B22[row][column];
                S9[row][column] = A11[row][column] - A21[row][column];
                S10[row][column] = B11[row][column] + B12[row][column];
            }
        }

        // actual computations
        var P1 = strassen(A11, S1);
        var P2 = strassen(S2, B22);
        var P3 = strassen(S3, B11);
        var P4 = strassen(A22, S4);
        var P5 = strassen(S5, S6);
        var P6 = strassen(S7, S8);
        var P7 = strassen(S9, S10);

        // assemble computations in original matrix
        for (row = 0; row < halfOfN; row++) {
            for (column = 0; column < halfOfN; column++) {
                C[row][column]                     = P5[row][column] + P4[row][column] - P2[row][column] + P6[row][column];
                C[row][column + halfOfN]           = P1[row][column] + P2[row][column];
                C[row + halfOfN][column]           = P3[row][column] + P4[row][column];
                C[row + halfOfN][column + halfOfN] = P5[row][column] + P1[row][column] - P3[row][column] - P7[row][column];
            }
        }
    }
    return C;
};
},{}],21:[function(require,module,exports){
//jshint node: true
//jshint browser: true
'use strict';

var isWorker = require('./isWorker'),
    Img = require('./Img'),
    flatten = require('lodash/array/flatten');

function Canvas(width, height, id) {
  this.id = id || Date.now();
  var Renderer = require('./Renderer');
  if (!isWorker) {
    this.renderer = new Renderer(width, height, document.createElement('div'));
  } else {
    this.renderer = null;
  }
  this.width = width;
  this.height = height;
  Object.seal(this);
}

Canvas.prototype.render = function render(children) {
  var result = [];
  for (var i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result = flatten(result);
  if (isWorker) {
    postMessage({ type: 'canvas', value: { id: this.id, width: this.width, height: this.height, children: result } });
  } else {
    this.renderer.render(children);
  }
};

Canvas.prototype.toImage = function toImage(imageID) {
  imageID = imageID || Date.now();
  var img;
  if (isWorker) {
    postMessage({ type: 'canvas-image', value: { id: this.id, imageID: imageID } });
    img = new Img();
    img.id = imageID;
    return img;
  } else {
    img = new Image();
    img.src = this.renderer.canvas.toDataURL('image/png');
    Img.cache[imageID] = img;
    return;
  }
};

Canvas.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'canvas-dispose', value: { id: this.id }});
  } else {
    Canvas.cache[this.id] = null;
  }
};

Canvas.prototype.resize = function (width, height) {
  return this.renderer.resize(width, height);
};

Canvas.cache = {};

Canvas.create = function (width, height, id) {
  return new Canvas(width, height, id);
};

Object.seal(Canvas);
Object.seal(Canvas.prototype);
module.exports = Canvas;

},{"./Img":23,"./Renderer":25,"./isWorker":46,"lodash/array/flatten":4}],22:[function(require,module,exports){
//jshint node: true
'use strict';
var isWorker = require('./isWorker');

function Gradient(id, grd) {
  this.id = id;
  this.grd = grd;
  this.disposable = true;
  Object.seal(this);
}

Gradient.cache = {};

Gradient.prototype.cache = function() {
  this.disposable = false;
  
  if (isWorker) {
    postMessage({ type: 'gradient-cache', value: { id: this.id }});
  }
  
  return this;
};

Gradient.prototype.dispose = function() {
  if(isWorker) {
    return postMessage({ type: 'gradient-dispose', value: { id: this.id } });
  } else {
    Gradient.cache[this.id] = null;
    return;
  }
};

Object.seal(Gradient);
Object.seal(Gradient.prototype);

module.exports = Gradient;
},{"./isWorker":46}],23:[function(require,module,exports){
//jshint node: true
//jshint browser: true
'use strict';

var path = require('path'),
    isWorker = require('./isWorker'),
    isDataUrl = require('./isDataUrl');

function Img(id) {
  this._src = "";
  this.isDataUrl = false;
  this.id = id || Date.now();
  this.buffer = new ArrayBuffer();
  this.onload = function() {};
  this.texture = null;
  this.type = 'image';
  this.blobOptions = {};
  Object.seal(this);
}
Img.cache = {};

Object.defineProperty(Img.prototype, 'src', {
  set: function(val) {
    if (typeof window !== 'undefined') {
      return;
    }
    var self = this;
    this._src = val;
    this.isDataUrl = isDataUrl(val);
    if (this.isDataUrl) {
      this.id = Date.now().toString();
    } else {
      this.id = val;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', val, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        self.buffer = this.response;
        self.blobOptions = { type: 'image/' + path.extname(self._src).slice(1) };
        self.generateTexture(this.response, self.blobOptions);
      };
      xhr.send();
    }
  },
  get: function() {
    return this._src;
  }
});
Img.prototype.generateTexture = function generateTexture(buffer, options) {
  var msg = {
      type: 'image',
      value: {
        buffer: buffer,
        opts: options,
        id: this.id
      }
    }, 
    img;
  if (isWorker) {
    postMessage(msg, [buffer]);
  } else {
    img = new Image();
    img.src = (window.URL || window.webkitURL).createObjectURL(new Blob([buffer], options));
    Img.cache[this.id] = img;
  }
  this.onload();
};

Img.prototype.dispose = function dispose() {
  if (isWorker) {
    return postMessage({ type: 'image-dispose', value: { id: this.id }});
  } else {
    Image.cache[this.id] = null;
  }
};

Object.seal(Img);
Object.seal(Img.prototype);

module.exports = Img;
},{"./isDataUrl":45,"./isWorker":46,"path":1}],24:[function(require,module,exports){
//jshint node: true
'use strict';
function Instruction(type, props) {
  this.type = type;
  this.props = props;
  Object.seal(this);
}

Object.seal(Instruction);
Object.seal(Instruction.prototype);

module.exports = Instruction;
},{}],25:[function(require,module,exports){
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

},{"./Canvas":21,"./Gradient":22,"./Img":23,"./createLinearGradient":35,"./createRadialGradient":36,"./isWorker":46,"lodash/array/flatten":4}],26:[function(require,module,exports){
//jshint node: true

'use strict';
var Instruction = require('./Instruction');

function addColorStop(offset, color) {
  return new Instruction('addColorStop', { offset: offset, color: color });
}

module.exports = addColorStop;
},{"./Instruction":24}],27:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function arc(x, y, r, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 5) {
    return new Instruction(anticlockwise ? 'anticlockwise-arc' : 'arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length === 5) {
    return new Instruction('arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle })
  }
  if (arguments.length >= 3) {
    return new Instruction('full-arc', { x: x, y: y, r: r});
  }
  if (arguments.length >= 1) {
    return new Instruction('quick-arc', { r: x });
  }
  
  return new Instruction('quick-arc', { r: 1 });
}

module.exports = arc;
},{"./Instruction":24}],28:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('arcTo', { x1: x1, y1: y1, x2: x2, y2: y2, r: r });
}

module.exports = arcTo;

},{"./Instruction":24}],29:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function beginPath() {
  return new Instruction('beginPath');
}
module.exports = beginPath;
},{"./Instruction":24}],30:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
  return new Instruction('bezierCurveTo', {
    cp1x: cp1x, 
    cp1y: cp1y, 
    cp2x: cp2x, 
    cp2y: cp2y, 
    x: x, 
    y: y
  });
}

module.exports = bezierCurveTo;
},{"./Instruction":24}],31:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillRect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("clearRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("clearRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = fillRect;
},{"./Instruction":24}],32:[function(require,module,exports){
//jshint node: true
'use strict';

var beginPath = require('./beginPath'),
    clipPath = require('./clipPath');

function clip(children) {
  return [beginPath()].concat(children).concat([clipPath()]);
}

module.exports = clip;
},{"./beginPath":29,"./clipPath":33}],33:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function clipPath() {
  return new Instruction('clipPath');
}
module.exports = clipPath;
},{"./Instruction":24}],34:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function closePath() {
  return new Instruction('closePath');
}
module.exports = closePath;
},{"./Instruction":24}],35:[function(require,module,exports){
//jshint node: true, browser: true
'use strict';
var isWorker = require('./isWorker'),
    Gradient = require('./Gradient');

createLinearGradient.cache = {};

function createLinearGradient(x0, y0, x1, y1, children, id) {
  id = id || Date.now();
  
  if (isWorker) {
    postMessage({ type: 'linear-gradient', value: { id: id, x0: x0, y0: y0, x1: x1, y1: y1, children: children } });
    return new Gradient(id, null);
  } else {
    var ctx = document.createElement('canvas').getContext('2d'),
      grd = ctx.createLinearGradient(x0, y0, x1, y1),
      colorStop,
      result = new Gradient(id, grd);
    for(var i = 0; i < children.length; i++) {
      colorStop = children[i];
      grd.addColorStop(colorStop.props.offset, colorStop.props.color);
    }
    Gradient.cache[id] = result;
    return result; 
  }
}


module.exports = createLinearGradient;
},{"./Gradient":22,"./isWorker":46}],36:[function(require,module,exports){
//jshint node: true, browser: true
'use strict';
var isWorker = require('./isWorker'),
    Gradient = require('./Gradient');

function createRadialGradient(x0, y0, r0, x1, y1, r1, children, id) {
  id = id || Date.now();
  
  if (isWorker) {
    postMessage({ 
      type: 'radial-gradient', 
      value: { id: id, x0: x0, r0: r0, y0: y0, x1: x1, y1: y1, r1: r1, children: children } 
    });
    return new Gradient(id, null);
  } else {
    var ctx = document.createElement('canvas').getContext('2d'),
      grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1),
      colorStop,
      result = new Gradient(id, grd);
    for(var i = 0; i < children.length; i++) {
      colorStop = children[i];
      grd.addColorStop(colorStop.props.offset, colorStop.props.color);
    }
    Gradient.cache[id] = result;
    return result;
  }
}


module.exports = createRadialGradient;
},{"./Gradient":22,"./isWorker":46}],37:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function drawCanvas(canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('drawCanvasSource', {
      img: canvas.id,
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
    return new Instruction('drawCanvasSize', {
      img: canvas.id,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }
  
  if (arguments.length >= 3) {
    return new Instruction('drawCanvas', {
      img: canvas.id,
      dx: sx,
      dy: sy
    });
  }  

  return new Instruction('drawCanvas', {
    img: canvas.id,
    dx: 0,
    dy: 0
  });
}

module.exports = drawCanvas;
},{"./Instruction":24}],38:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('drawImageSource', {
      img: img.id,
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
      img: img.id,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }
  
  if (arguments.length >= 3) {
    return new Instruction('drawImage', {
      img: img.id,
      dx: sx,
      dy: sy
    });
  }  

  return new Instruction('drawImage', {
    img: img.id,
    dx: 0,
    dy: 0
  });
}

module.exports = drawImage;
},{"./Instruction":24}],39:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 7) {
    return new Instruction(anticlockwise ? 'anticlockwise-ellipse' : 'ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, startAngle: startAngle, endAngle: endAngle });
  }
  
  if (arguments.length === 7) {
    return new Instruction('ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length >= 5) {
    return new Instruction('full-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation });
  }
  if (arguments.length === 4) {
    return new Instruction('quick-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY });
  }
  return new Instruction('quick-ellipse', { x: 0, y: 0, radiusX: x, radiusY: y });
}

module.exports = ellipse;
},{"./Instruction":24}],40:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fill() {
  return new Instruction('fill');
}

module.exports = fill;
},{"./Instruction":24}],41:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

function fillArc(x, y, r, startAngle, endAngle, counterclockwise) {
  if (arguments.length >= 6 && counterclockwise) {
    return new Instruction("fillArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
    
  }
  if (arguments.length > 3) {
    return new Instruction("fillArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  } 
  if (arguments.length > 1){
    return new Instruction("fillArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
  }
  return new Instruction("fillArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
}

module.exports = fillArc;
},{"./Instruction":24}],42:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillRect(x, y, width, height) {
  if (arguments.length >= 4) {
    return new Instruction("fillRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("fillRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = fillRect;
},{"./Instruction":24}],43:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    Gradient = require('./Gradient');

function fillStyle(value, children) {
  var instruction;
  if (value instanceof Gradient) {
    instruction = new Instruction('fillGradient', { value: { id: value.id } });
  }
  
  if (!instruction) {
    instruction = new Instruction('fillStyle', { value: value });
  }
  
  return [instruction].concat(children).concat([new Instruction('endFillStyle')]);
}

module.exports = fillStyle;
},{"./Gradient":22,"./Instruction":24}],44:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function globalCompositeOperation(operationType, children) {
  return [new Instruction('globalCompositeOperation', { value: operationType })].concat(children).concat([new Instruction('endGlobalCompositeOperation')]);
}
},{"./Instruction":24}],45:[function(require,module,exports){
//jshint node: true
function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
Object.seal(isDataURL);
module.exports = isDataURL;

},{}],46:[function(require,module,exports){
//jshint
'use strict';

module.exports = typeof document === 'undefined';
},{}],47:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function lineStyle(value, children) {
  value = value || {};
  var result = {
    strokeStyle: null,
    lineWidth: null,
    lineCap: null,
    lineJoin: null,
    miterLimit: null,
    lineDash: [],
    lineDashOffset: null
  };
  
  if (typeof value.strokeStyle !== 'undefined') {
    result.strokeStyle = value.strokeStyle; 
  }
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
  
  return [new Instruction('lineStyle', result)].concat(children).concat([new Instruction('endLineStyle')]);
}

module.exports = lineStyle;
},{"./Instruction":24}],48:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function lineTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('lineTo', { x: 0, y: 0});
  }
  return new Instruction('lineTo', { x: x, y: y });
}

module.exports = lineTo;
},{"./Instruction":24}],49:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function moveTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('moveTo', { x: 0, y: 0});
  }
  return new Instruction('moveTo', { x: x, y: y });
}

module.exports = moveTo;
},{"./Instruction":24}],50:[function(require,module,exports){
//jshint node: true
'use strict';

var beginPath = require('./beginPath'),
    closePath = require('./closePath');

function path(children) {
  return [beginPath()].concat(children).concat([closePath()]);
}

module.exports = path;
},{"./beginPath":29,"./closePath":34}],51:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function quadraticCurveTo(cpx, cpy, x, y) {
  return new Instruction('quadraticCurveTo', {
    cpx: cpx, 
    cpy: cpy, 
    x: x, 
    y: y
  });
}

module.exports = quadraticCurveTo;
},{"./Instruction":24}],52:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    flatten = require('lodash/array/flatten');

function rotate(r, children) {
  r = +r;
  children = children || [];
  
  var result = [new Instruction('rotate', { r: r })],
      child;
  
  result = result.concat(flatten(children));
  result.push(new Instruction('restore'));
  return result;
}

module.exports = rotate;
},{"./Instruction":24,"lodash/array/flatten":4}],53:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    flatten = require('lodash/array/flatten');

function scale(x, y, children) {
  x = +x;
  y = +y;
  children = children || [];
  
  var result = [new Instruction('scale', { x: x, y: y })],
      child;
  
  result = result.concat(flatten(children));
  result.push(new Instruction('restore'));
  return result;
}

module.exports = scale;
},{"./Instruction":24,"lodash/array/flatten":4}],54:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function shadowStyle(value, children) {
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
  return [new Instruction('shadowStyle', value)].concat(children).concat([new Instruction('endShadowStyle')]);
}

module.exports = shadowStyle;
},{"./Instruction":24}],55:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function stroke() {
  return new Instruction('stroke');
}

module.exports = stroke;
},{"./Instruction":24}],56:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

function strokeArc(x, y, r, startAngle, endAngle, counterclockwise) {
  if (arguments.length >= 6 && counterclockwise) {
    return new Instruction("strokeArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length > 3) {
    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  } 
  if (arguments.length > 1){
    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
  }
  return new Instruction("strokeArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
}

module.exports = strokeArc;
},{"./Instruction":24}],57:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function strokeRect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("strokeRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("strokeRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = strokeRect;
},{"./Instruction":24}],58:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');
function text(str, x, y, fill, stroke, maxWidth) {
  if (arguments.length === 6) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: stroke,
      text: str,
      maxWidth: maxWidth
    });
  }
  if (arguments.length === 5) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: stroke,
      text: str,
      maxWidth: 0
    });
  }
  
  if (arguments.length === 4) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: false,
      text: str,
      maxWidth: 0
    });
  }
  
  if (arguments.length === 3) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: true,
      stroke: false,
      text: str,
      maxWidth: 0
    });
  }
  
  return new Instruction('text', {
    x: 0,
    y: 0,
    fill: true,
    stroke: false,
    text: str,
    maxWidth: 0
  });
}

module.exports = text;
},{"./Instruction":24}],59:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function textStyle(value, children) {
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
  return [new Instruction('textStyle', value)].concat(children).concat([new Instruction('endTextStyle')]);
}

module.exports = textStyle;
},{"./Instruction":24}],60:[function(require,module,exports){
//jshint node: true
'use strict';
var smm = require('square-matrix-multiply'),
    Instruction = require('./Instruction');

function transform(stack, children) {
  var t,
      i,
      val,
      cosVal,
      sinVal,
      sx,
      sy,
      result = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      props,
      transformResult = [],
      len = stack.length;
  for(i = 0; i < len; i++) {
    t = stack[i];
    
    if (t.hasOwnProperty('transform')) {
      result = smm(result, [
        [t.transform.a,t.transform.c,t.transform.e],
        [t.transform.b,t.transform.d,t.transform.f],
        [0,0,1]
      ]);
      continue;
    }
    
    if (t.hasOwnProperty('translate')) {
      sx = t.translate.x;
      sy = t.translate.y;
      
      result = smm(result, [
        [1, 0, sx],
        [0, 1, sy],
        [0, 0, 1]
      ]);
    }
    
    if (t.hasOwnProperty('scale')) {
      sx = t.scale.x;
      sy = t.scale.y;
      
      result = smm(result, [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
      ]);
    }
    
    if (t.hasOwnProperty('rotate')) {
      sinVal = Math.sin(t.rotate);
      cosVal = Math.cos(t.rotate);
      result = smm(result, [
        [cosVal, -sinVal, 0],
        [sinVal, cosVal, 0],
        [0, 0, 1]
      ]);
    }
  }
  props = {
    a: result[0][0],
    b: result[1][0],
    c: result[0][1],
    d: result[1][1],
    e: result[0][2],
    f: result[1][2]
  };
  return transformResult.concat(new Instruction('transform', props)).concat(children).concat([new Instruction('restore')]);
}
function copy(target, children) {
  var t = target[0];
  return [new Instruction('transform', {
    a: t.props.a,
    b: t.props.b,
    c: t.props.c,
    d: t.props.d,
    e: t.props.e,
    f: t.props.f
  })].concat(children).concat([new Instruction('restore')]);
}

transform.copy = copy;


module.exports = transform;
},{"./Instruction":24,"square-matrix-multiply":20}],61:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
  flatten = require('lodash/array/flatten');

function translate(x, y, children) {
  x = +x;
  y = +y;
  children = children || [];
  
  var result = [new Instruction('translate', { x: x, y: y })],
      child;
  
  result = result.concat(flatten(children));
  result.push(new Instruction('restore'));
  return result;
}

module.exports = translate;
},{"./Instruction":24,"lodash/array/flatten":4}]},{},[3])(3)
});