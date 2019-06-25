(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],2:[function(require,module,exports){
(function (process,global){
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":1,"_process":4,"inherits":3}],3:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],4:[function(require,module,exports){
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
function defaultClearTimeout () {
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
} ())
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
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
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
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accordion = undefined;

var _PubSub = require('./PubSub');

// module "Accordion.js"

function Accordion() {
  // cache DOM
  var acc = document.querySelectorAll('.accordion-btn');

  // Bind Events
  var i = void 0;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordionHandler);
  }

  // Event Handlers
  function accordionHandler(evt) {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    evt.currentTarget.classList.toggle('active');

    /* Toggle between hiding and showing the active panel */
    var panel = evt.currentTarget.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.style.marginTop = '0';
      panel.style.marginBottom = '0';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.style.marginTop = '-11px';
      panel.style.marginBottom = '18px';
    }

    // tell the parent accordion to adjust its height
    _PubSub.events.emit('heightChanged', panel.style.maxHeight);
  }
}
exports.Accordion = Accordion;

},{"./PubSub":11}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module CoverOptions.js

function CoverOptions() {
  // cache DOM
  var costPrefixText = $('.js-cost-prefix');
  var warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
  var warningText60 = $('.card-cover-option:nth-of-type(1) .warning-text-60');
  var coverOptionPrice = $('.card-cover-option:nth-of-type(1) .card-price');
  // Get single trip price
  var initialCoverPrice = $('.card-cover-option:nth-of-type(1) .amount');
  var d_initialCoverPrice = parseFloat(initialCoverPrice.text().replace(/\D*/, '')).toFixed(2);

  var initialSingleTripPrice = $('.initial-single-trip-price');
  var d_initialSingleTripPrice = parseFloat(initialSingleTripPrice.text().replace(/\D*/, '')).toFixed(2);

  var currencySymbol = initialCoverPrice.text().substring(0, 1);
  var inputValue = '';
  var priceLimit = void 0;
  var totalInitialPrice = 0;
  var totalSinglePrice = 0;
  var finalPrice = 0;

  if (currencySymbol == '\xA3') {
    priceLimit = 119;
  } else {
    priceLimit = 142;
  }

  //console.clear();
  //console.log(`cover price: ${d_initialCoverPrice}`);
  //console.log(`Single Trip price: ${d_initialSingleTripPrice}`);
  //console.log(`currencySymbol: ${currencySymbol}`);

  $('.product-options-days-cover').change(function (evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value);

    // hide "from" text
    if (inputValue > 3) {
      costPrefixText.hide();
    } else {
      costPrefixText.show();
    }

    if (inputValue > 0 && Number.isInteger(inputValue)) {
      // calculate with intital cover price
      // d_initialCoverPrice = 11.99
      if (inputValue > 0 && inputValue <= 3) {
        totalInitialPrice = d_initialCoverPrice;
        totalSinglePrice = totalInitialPrice;
      }

      // if ((inputValue > 3 && inputValue <= 60) || priceLimit < finalPrice) {
      if (inputValue > 3) {
        totalInitialPrice = d_initialCoverPrice;
        // double up on the string values to use a unary plus to convert and have it added to the previous value
        totalSinglePrice = +totalInitialPrice + (+inputValue - 3) * +d_initialSingleTripPrice;
      }
    }

    finalPrice = parseFloat(totalSinglePrice).toFixed(2);

    if (inputValue > 11 && inputValue <= 60) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      // change color of price
      coverOptionPrice.addClass('warning');
      // show warning text
      warningText.show();
      warningText60.hide();
      coverOptionPrice.show();
    } else if (inputValue > 3 && inputValue <= 60) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      warningText.hide();
      warningText60.hide();
      coverOptionPrice.removeClass('warning');
      coverOptionPrice.show();
    } else if (inputValue <= 3) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      warningText.hide();
      warningText60.hide();
      coverOptionPrice.removeClass('warning');
      coverOptionPrice.show();
    } else if (inputValue > 60) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      coverOptionPrice.addClass('warning');
      warningText60.show();
      warningText.hide();
      coverOptionPrice.hide();
    } else {
      initialCoverPrice.text(currencySymbol + totalSinglePrice);
      warningText60.hide();
      warningText.hide();
      coverOptionPrice.show();
    }

    //console.log(`${inputValue} = ${finalPrice}`);
  });
}

exports.CoverOptions = CoverOptions;

<<<<<<< HEAD
},{}],9:[function(require,module,exports){
=======
},{}],7:[function(require,module,exports){
>>>>>>> chore: update files
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ToggleNavigation() {
  // cache DOM
  var currency = $('.currency');
  var mainNav = document.getElementById('js-menu');
  var navBarToggle = document.getElementById('js-navbar-toggle');
  var currencyNav = document.getElementById('js-currency-toggle');
  var currencyMenuToggle = document.getElementById('js-navbar-toggle');

  // bind events
  navBarToggle.addEventListener('click', toggleMenu);
  currencyMenuToggle.addEventListener('click', toggleCurrencyMenu);

  // event handlers
  function toggleMenu() {
    mainNav.classList.toggle('active');
  }

  function toggleCurrencyMenu() {
    currencyNav.classList.toggle('active');
  }

  if ($(window).width() > '1199') {
    currency.show();
  } else {
    currency.hide();
  }

  $(window).resize(function () {
    if ($(window).width() > '1199') {
      currency.show();
    } else {
      currency.hide();
    }
  });
}

function DropdownMenu() {
  // cache DOM
  var carBtn = document.querySelector('.btn-car');
  var dropDownMenu = document.querySelector('.dropdown--car .dropdown-menu');

  if (carBtn != null && dropDownMenu != null) {

    // Event handlers
    var carBtnHandler = function carBtnHandler(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      // toggle display
      if (dropDownMenu.style.display === 'none' || dropDownMenu.style.display === '') {
        dropDownMenu.style.display = 'block';
        dropDown.style.height = dropDown.offsetHeight + dropDownMenu.offsetHeight + 'px';
      } else {
        dropDownMenu.style.display = 'none';
        dropDown.style.height = 'auto';
      }
    };

    var dropDown = carBtn.parentElement;
    // Bind events
    carBtn.addEventListener('click', carBtnHandler);
  }
}

function FixedNavigation() {
  // make navbar sticky
  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    myFunction();
  };

  // Get the header
  var navBar = document.querySelector('.navbar');

  // Get the offset position of the navbar
  var sticky = navBar.offsetTop;

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
    var sticky = navBar.offsetTop;
    if (window.pageYOffset > sticky) {
      navBar.classList.add('navbar-fixed-top');
    } else {
      navBar.classList.remove('navbar-fixed-top');
    }
  }
}

function SelectTrip() {
  // select vehicle
  $('.tab-car .btn').click(function (evt) {
    evt.preventDefault();
    return false;
  });

  $('.tab-car .icon-radio input[type="radio"]').click(function (evt) {
    $('.tab-car .btn').removeClass('btn-cta--disabled');
    $('.tab-car .btn').addClass('btn-cta');
    $('.tab-car .btn').unbind();
  });
}

// show mobile currency
function RevealCurrency() {
  $('.currency-mobile').on('click', function () {
    console.log('Currency');

    $('.currency').slideToggle();
  });
}

exports.ToggleNavigation = ToggleNavigation;
exports.DropdownMenu = DropdownMenu;
exports.FixedNavigation = FixedNavigation;
exports.SelectTrip = SelectTrip;
exports.RevealCurrency = RevealCurrency;

<<<<<<< HEAD
},{}],10:[function(require,module,exports){
=======
},{}],8:[function(require,module,exports){
>>>>>>> chore: update files
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolicySummaryDesktop = exports.PolicySummaryMobile = exports.PolicySummaryDeviceResize = undefined;

var _PubSub = require('./PubSub');

// module "PolicySummary.js"
// module "PolicySummaryAccordion.js"

function DesktopDeviceSetup() {
  $('.policy-summary .info-box').each(function (index, element) {
    if (index === 0) {
      return true;
    }
    $(element).css('display', 'none');
  });

  // remove the active class from all
  $('.card-cover-option').each(function (index, element) {
    $(element).removeClass('active');
  });
  $('.card-cover-option:nth-child(2)').addClass('active');

  // show policy info
  $('.card-cover-option .policy-info').each(function (index, element) {
    $(element).css('display', 'block');
  });

  // reset policy summary
  $('.policy-summary-info').each(function (index, element) {
    $(element).css('display', 'none');
  });
  $('.policy-summary-info:first-child').css('display', 'block');

  // remove mobile event listener
  var acc = document.querySelectorAll('.accordion-bar button.more-information');
  for (var i = 0; i < acc.length; i++) {
    if (acc[i].eventListener) {
      acc[i].removeEventListener('click');
    }
  }

  PolicySummaryDesktop();
}

function MobileDeviceSetup() {
  $('.card-cover-option').each(function (index, element) {
    $(element).removeClass('active').css('display', 'block');
  });

  $('.card-cover-option .policy-info').each(function (index, element) {
    $(element).css('display', 'none');
  });

  // reset policy summary
  $('.policy-summary-info').each(function (index, element) {
    $(element).css('display', 'none');
  });

  // remove desktop event listener
  $('.card-cover-option').unbind();

  // setup Mobile
  PolicySummaryMobile();
}

// device reset ON browser width
function PolicySummaryDeviceResize() {
  // console.log(window.outerWidth);

  if (window.outerWidth > 1199) {
    /**
     * DEVICE: Desktop
     */
    DesktopDeviceSetup();
  } else {
    /**
     * DEVICE: Mobile
     */
    MobileDeviceSetup();
  }

  // Cache DOM

  window.addEventListener('resize', function (evt) {
    // console.log(evt.target.outerWidth);

    if (evt.target.outerWidth > 1199) {
      /**
       * DEVICE: Desktop
       */
      DesktopDeviceSetup();
    } else {
      /**
       * DEVICE: Mobile
       */
      MobileDeviceSetup();
    }
  });
}

/**
 * Policy Summary Handler for mobile
 *
 * @return  {none}
 */
function PolicySummaryMobile() {
  // cache DOM
  var acc = document.querySelectorAll('.accordion-bar button.more-information');
  var cardCoverOption = document.querySelectorAll('.card-cover-option');
  var policySummaryInfo = document.querySelectorAll('.policy-summary-info');
  var policyReference = '';

  var activeCardOption = '';

  // Bind Events
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordionHandler);
  }

  // Event Handlers
  function accordionHandler(evt) {
    // console.log(evt.currentTarget);
    /* hide the other options */
    evt.currentTarget.classList.remove('active');

    // more information button has been clicked
    if (activeCardOption === 'selected') {
      // console.log('Close');

      // remove active border
      for (var _i = 0; _i < cardCoverOption.length; _i++) {
        cardCoverOption[_i].classList.remove('active');
        cardCoverOption[_i].style.display = 'block';
      }

      // hide policy-info
      document.querySelectorAll('.card-cover-option[data-policy^="policy-summary-"] .policy-info').forEach(function (element, index) {
        element.style.display = 'none';
      });

      // hide all policy-summary-info blocks
      policySummaryInfo.forEach(function (element) {
        // console.log(element);
        element.style.display = 'none';
      });

      activeCardOption = '';
    } else {
      // console.log('Open');

      // move more information arrow
      evt.currentTarget.classList.add('active');

      /* highlight the card that's been selected */
      evt.currentTarget.parentNode.parentNode.parentNode.parentNode.classList.add('active');

      // get policy reference
      policyReference = document.querySelector('.card-cover-option.active').dataset.policy;

      // show only the product summary info that has an active product cover option
      for (var _i2 = 0; _i2 < cardCoverOption.length; _i2++) {
        if (cardCoverOption[_i2].getAttribute('class').indexOf('active') < 0) {
          cardCoverOption[_i2].style.display = 'none';
        } else {
          cardCoverOption[_i2].style.display = 'block';
        }
      }

      // show the cover option info text
      document.querySelector('.card-cover-option[data-policy="' + policyReference + '"] .policy-info').style.display = 'block';

      activeCardOption = 'selected';

      // hide all policy-summary-info blocks
      policySummaryInfo.forEach(function (element) {
        element.style.display = 'none';
      });

      // get the policy summary info panel associcated with this product using the policyReference
      var _panel = document.querySelector('.policy-summary-info.' + policyReference);
      _panel.style.display = 'block';

      if (_panel.style.maxHeight) {
        _panel.style.maxHeight = null;
        _panel.style.marginTop = '0';
        _panel.style.marginBottom = '0';
      } else {
        _panel.style.maxHeight = _panel.scrollHeight + 'px';
        _panel.style.marginTop = '-11px';
        _panel.style.marginBottom = '18px';
      }

      _PubSub.events.on('heightChanged', adjustPanelHeight);
    }

    function adjustPanelHeight(newHeight) {
      var newTotal = parseInt(panel.style.maxHeight.substring(0, panel.style.maxHeight.length - 2)) + parseInt(newHeight.substring(0, newHeight.length - 2)) + 'px';

      panel.style.maxHeight = newTotal;
    }
  } // accordionHandler
} // PolicySummaryMobile

/**
 * Policy Summary handler for desktop
 *
 * @return  {none}
 */
function PolicySummaryDesktop() {
  // cache DOM
  // policy summary
  $('.card-cover-option').click(function (evt) {
    $('.card-cover-option').each(function (index, element) {
      $(element).removeClass('active');
    });
    evt.currentTarget.classList.add('active');
    // show policy summary
    $('.policy-summary .info-box').each(function (index, element) {
      $(element).css('display', 'none');
    });
    var policySummary = $(this).data('policy');
    $('.' + policySummary).css('display', 'block');
  });
} // PolicySummaryDesktop

exports.PolicySummaryDeviceResize = PolicySummaryDeviceResize;
exports.PolicySummaryMobile = PolicySummaryMobile;
exports.PolicySummaryDesktop = PolicySummaryDesktop;

},{"./PubSub":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// The module will send a changed event to PubSub and
// anyone listening will receive that changed event and
// then update accordingly

var events = {
  // list of events
  events: {},

  on: function on(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },

  off: function off(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },

  emit: function emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  }
};

exports.events = events;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module RevealDocs.js

function RevealDocs() {
  //Docs
  $('.revealdocs').click(function (e) {
    e.preventDefault();
    var on = $('.docs').is(':visible');
    $(this).html(on ? 'View policy documentation' : 'Hide policy documentation');
    $('.docs').slideToggle();
  });
}

exports.RevealDocs = RevealDocs;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module "Screen.js"

function _scrollToTop(scrollDuration) {
  var scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(function () {
    if (window.scrollY != 0) {
      window.scrollBy(0, scrollStep);
    } else clearInterval(scrollInterval);
  }, 15);
}

function _scrollToTopEaseInEaseOut(scrollDuration) {
  var cosParameter = window.scrollY / 2;
  var scrollCount = 0,
      oldTimestamp = performance.now();

  function step(newTimestamp) {
    scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
    if (scrollCount >= Math.PI) window.scrollTo(0, 0);
    if (window.scrollY === 0) return;
    window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}
/*
  Explanations:
  - pi is the length/end point of the cosinus intervall (see above)
  - newTimestamp indicates the current time when callbacks queued by requestAnimationFrame begin to fire.
    (for more information see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
  - newTimestamp - oldTimestamp equals the duration

    a * cos (bx + c) + d                      | c translates along the x axis = 0
  = a * cos (bx) + d                          | d translates along the y axis = 1 -> only positive y values
  = a * cos (bx) + 1                          | a stretches along the y axis = cosParameter = window.scrollY / 2
  = cosParameter + cosParameter * (cos bx)    | b stretches along the x axis = scrollCount = Math.PI / (scrollDuration / (newTimestamp - oldTimestamp))
  = cosParameter + cosParameter * (cos scrollCount * x)
*/

function ScrollToTop() {
  // Cache DOM
  var backToTopBtn = document.querySelector('.js-back-to-top');

  // Bind Events
  if (backToTopBtn != null) {
    backToTopBtn.addEventListener('click', backToTopBtnHandler);
  }

  // Event Handlers
  function backToTopBtnHandler(evt) {
    // Animate the scroll to top
    evt.preventDefault();
    _scrollToTopEaseInEaseOut(1000);

    // $('html, body').animate({ scrollTop: 0 }, 300);
  }
}

function WindowWidth() {
  // cache DOM
  var accordionBtns = document.querySelectorAll('.card-products .accordion-btn');

  window.addEventListener('resize', function () {
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (w > 1200) {
      var i = void 0;
      for (i = 0; i < accordionBtns.length; i++) {
        accordionBtns[i].setAttribute('disabled', true);
      }
    }

    if (w <= 1200) {
      var _i = void 0;
      for (_i = 0; _i < accordionBtns.length; _i++) {
        accordionBtns[_i].removeAttribute('disabled');
      }
    }
  });
}

exports.ScrollToTop = ScrollToTop;
exports.WindowWidth = WindowWidth;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module "ScrollTo.js"

function ScrollTo() {
  // cache DOM
  // Select all links with hashes
  // Remove links that don't actually link to anything
  var anchors = $('a[href*="#"]').not('[href="#"]').not('[href="#0"]');

  var heightCompensation = 60;
  // Bind Events
  anchors.click(anchorsHandler);

  // Event Handlers
  function anchorsHandler(event) {
    // On-page links
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - heightCompensation
        }, 1000, function () {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(':focus')) {
            // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        });
      }
    }
  }
}

// on scroll
if ($('.article-main').length > 0) {
  var target = $('.article-main').offset().top - 180;
  $(document).scroll(function () {
    if ($(window).scrollTop() >= target) {
      $('.share-buttons').show();
    } else {
      $('.share-buttons').hide();
    }
  });
}

exports.ScrollTo = ScrollTo;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

exports.Ready = Ready;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function VehicleSelector() {
  // cache DOM
  var carTab = document.querySelector('.nav-link__car');
  var vanTab = document.querySelector('.nav-link__van');

  // bind events
  if (carTab != null && vanTab != null) {
    carTab.addEventListener('click', openVehicle);
    vanTab.addEventListener('click', openVehicle);
  }

  // event handlers
  function openVehicle(evt) {
    var i, x, tabButtons;

    console.log(evt);

    // hide all tab contents
    x = document.querySelectorAll('.tab-container .tab');
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }

    // remove the highlight on the tab button
    tabButtons = document.querySelectorAll('.nav-tabs .nav-link');
    for (i = 0; i < x.length; i++) {
      tabButtons[i].className = tabButtons[i].className.replace(' active', '');
    }

    // highlight tab button and
    // show the selected tab content
    var vehicle = evt.currentTarget.getAttribute('data-vehicle');
    document.querySelector('.tab-' + vehicle).style.display = 'block';
    evt.currentTarget.className += ' active';
  }
}

exports.VehicleSelector = VehicleSelector;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadFAQs = undefined;

var _util = require('util');

// module "LoadFAQs.js"

function LoadFAQs() {
  // load faqs
  $('#faqTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  // load faqs
  // only load if on faqs page
  if ($('#faqs').length > 0) {
    $.ajax({
      type: 'GET',
      url: '/api/faqs.json',
      success: function success(faqs) {
        // get the heads
        $.each(faqs, function (index, faq) {
          // add title for desktop
          $('a[href=\'#' + faq.id + '\']').find('span').text(faq.title);

          // add title for mobile
          $('#' + faq.id).find('h3').text(faq.shortTitle);

          // get the body
          $.each(faq.qas, function (fIndex, qa) {
            $('.inner .accordion', '#' + faq.id).append('<button class="accordion-btn h4">' + qa.question + '</button>\n               <div class="accordion-panel">\n                 <div class="inner">\n                 ' + qa.answer + '\n                 </div>\n               </div>\n              ');
          });
        });
      },
      error: function error(xhr, status, _error) {
        //console.log('error: ', error);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', faqsHandler);
  }

  loadProductPageFAQs();
}

function loadProductPageFAQs() {
  // only load if on product page
  if ($('.product-faqs').length > 0) {
    var file = $('.product-faqs').data('faqs').replace('&-', '');

    //console.log(`/api/${file}-faqs.json`);

    //$.ajax({
    //  type: 'GET',
    //  url: `/api/${file}-faqs.json`,
    //  success: updateUISuccess,
    //  error: function (xhr, status, error) {
    //    console.log('error: ', error);
    //  }
    //}); // $ajax

    fetch('/api/' + file + '-faqs.json').then(function (response) {
      //console.log(response);
      return response.json();
    }).then(function (response) {
      updateUISuccess(response);
    }).catch(function (error) {
      updateUIFailure(error);
    });

    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', faqsHandler);
  }
}

function updateUISuccess(faqs) {
  // get the body
  $.each(faqs, function (fIndex, faq) {
    //console.log(`#${faq.id}`);
    $('.inner .accordion').append('<button class="accordion-btn h4">' + faq.question + '</button>\n            <div class="accordion-panel">\n              <div class="inner">\n              ' + faq.answer + '\n              </div>\n            </div>\n          ');
  });

  // show content
  $('.faq-answers-product').show();
}

function updateUIFailure(error) {
  console.error("Error: ", error);
}

function faqsHandler(evt) {
  /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
  evt.currentTarget.classList.toggle('active');

  /* Toggle between hiding and showing the active panel */
  var panel = evt.currentTarget.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
    panel.style.marginTop = '0';
    panel.style.marginBottom = '0';
  } else {
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.style.marginTop = '-11px';
    panel.style.marginBottom = '18px';
  }
}
exports.LoadFAQs = LoadFAQs;

},{"util":2}],15:[function(require,module,exports){
'use strict';

var _Screen = require('./components/Screen');

var _Accordion = require('./components/Accordion');

var _VehicleSelector = require('./components/VehicleSelector');

var _Navigation = require('./components/Navigation');

var _ScrollTo = require('./components/ScrollTo');

var _faqs = require('./components/faqs');

var _RevealDocs = require('./components/RevealDocs');

var _CoverOptions = require('./components/CoverOptions');

var _Utils = require('./components/Utils');

var _PolicySummary = require('./components/PolicySummary');

<<<<<<< HEAD
var _util = require('util');

=======
// import { log } from 'util';
// import { LazyLoad } from './components/LazyLoad';

// import { CountrySelector } from './components/CountrySelector';
>>>>>>> chore: update files
var countriesCovered = null;
// import { AutoComplete } from './components/AutoComplete';


function start() {
  // CountrySelector();
  (0, _VehicleSelector.VehicleSelector)();
  (0, _Navigation.ToggleNavigation)();
  (0, _Navigation.DropdownMenu)();
  (0, _Screen.ScrollToTop)();
  (0, _Navigation.FixedNavigation)();
  (0, _Accordion.Accordion)();
  (0, _Screen.WindowWidth)();
  (0, _ScrollTo.ScrollTo)();

  // console.log(`countriesCovered: ${countriesCovered}`);
  // if (countriesCovered != null) {
  //   AutoComplete(document.getElementById('myInput'), countriesCovered);
  // }

  (0, _faqs.LoadFAQs)();
  (0, _RevealDocs.RevealDocs)();
  (0, _CoverOptions.CoverOptions)();
  // PolicySummaryMobile();
  // PolicySummaryDesktop();
  (0, _PolicySummary.PolicySummaryDeviceResize)();
  (0, _Navigation.SelectTrip)();
  (0, _Navigation.RevealCurrency)();
  // LazyLoad();
}

(0, _Utils.Ready)(start);

<<<<<<< HEAD
},{"./components/Accordion":5,"./components/AutoComplete":6,"./components/CountrySelector":7,"./components/CoverOptions":8,"./components/Navigation":9,"./components/PolicySummary":10,"./components/RevealDocs":12,"./components/Screen":13,"./components/ScrollTo":14,"./components/Utils":15,"./components/VehicleSelector":16,"./components/faqs":17,"util":2}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvTmF2aWdhdGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUHViU3ViLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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TSxLQUFOLENBQVksU0FBWixHQUF3QixNQUFNLFlBQU4sR0FBcUIsSUFBN0M7QUFDQSxVQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE9BQXhCO0FBQ0EsVUFBTSxLQUFOLENBQVksWUFBWixHQUEyQixNQUEzQjtBQUNEO0FBQ0Y7UUFDUSxRLEdBQUEsUTs7Ozs7QUN4SVQ7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBRUEsSUFBSSxtQkFBbUIsSUFBdkI7O0FBRUEsU0FBUyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxrQkFBTSxLQUFOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vUHViU3ViJztcblxuLy8gbW9kdWxlIFwiQWNjb3JkaW9uLmpzXCJcblxuZnVuY3Rpb24gQWNjb3JkaW9uKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYnRuJyk7XG5cbiAgLy8gQmluZCBFdmVudHNcbiAgbGV0IGk7XG4gIGZvciAoaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGFjY29yZGlvbkhhbmRsZXIoZXZ0KSB7XG4gICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgICB9XG5cbiAgICAvLyB0ZWxsIHRoZSBwYXJlbnQgYWNjb3JkaW9uIHRvIGFkanVzdCBpdHMgaGVpZ2h0XG4gICAgZXZlbnRzLmVtaXQoJ2hlaWdodENoYW5nZWQnLCBwYW5lbC5zdHlsZS5tYXhIZWlnaHQpO1xuICB9XG59XG5leHBvcnQgeyBBY2NvcmRpb24gfTtcbiIsIi8vIG1vZHVsZSBcIkF1dG9Db21wbGV0ZS5qc1wiXG5cbi8qKlxuICogW0F1dG9Db21wbGV0ZSBkZXNjcmlwdGlvbl1cbiAqXG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgdXNlcklucHV0ICB1c2VyIGlucHV0XG4gKiBAcGFyYW0gICB7YXJyYXl9ICBzZWFyY2hMaXN0ICBzZWFyY2ggbGlzdFxuICpcbiAqIEByZXR1cm4gIHtbdHlwZV19ICAgICAgIFtyZXR1cm4gZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIEF1dG9Db21wbGV0ZShpbnAsIGFycikge1xuICB2YXIgY3VycmVudEZvY3VzO1xuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgd3JpdGVzIGluIHRoZSB0ZXh0IGZpZWxkOiovXG4gIGlucC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgYSxcbiAgICAgIGIsXG4gICAgICBpLFxuICAgICAgdmFsID0gdGhpcy52YWx1ZTtcbiAgICAvKmNsb3NlIGFueSBhbHJlYWR5IG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXMqL1xuICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjdXJyZW50Rm9jdXMgPSAtMTtcbiAgICAvKmNyZWF0ZSBhIERJViBlbGVtZW50IHRoYXQgd2lsbCBjb250YWluIHRoZSBpdGVtcyAodmFsdWVzKToqL1xuICAgIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICBhLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XG4gICAgYS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xuICAgIC8qYXBwZW5kIHRoZSBESVYgZWxlbWVudCBhcyBhIGNoaWxkIG9mIHRoZSBhdXRvY29tcGxldGUgY29udGFpbmVyOiovXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGEpO1xuICAgIC8qZm9yIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkuLi4qL1xuICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8qY2hlY2sgaWYgdGhlIGl0ZW0gc3RhcnRzIHdpdGggdGhlIHNhbWUgbGV0dGVycyBhcyB0aGUgdGV4dCBmaWVsZCB2YWx1ZToqL1xuICAgICAgaWYgKGFycltpXS5zdWJzdHIoMCwgdmFsLmxlbmd0aCkudG9VcHBlckNhc2UoKSA9PSB2YWwudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAvKmNyZWF0ZSBhIERJViBlbGVtZW50IGZvciBlYWNoIG1hdGNoaW5nIGVsZW1lbnQ6Ki9cbiAgICAgICAgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgICAgICAvKm1ha2UgdGhlIG1hdGNoaW5nIGxldHRlcnMgYm9sZDoqL1xuICAgICAgICBiLmlubmVySFRNTCA9ICc8c3Ryb25nPicgKyBhcnJbaV0uc3Vic3RyKDAsIHZhbC5sZW5ndGgpICsgJzwvc3Ryb25nPic7XG4gICAgICAgIGIuaW5uZXJIVE1MICs9IGFycltpXS5zdWJzdHIodmFsLmxlbmd0aCk7XG4gICAgICAgIC8qaW5zZXJ0IGEgaW5wdXQgZmllbGQgdGhhdCB3aWxsIGhvbGQgdGhlIGN1cnJlbnQgYXJyYXkgaXRlbSdzIHZhbHVlOiovXG4gICAgICAgIGIuaW5uZXJIVE1MICs9IFwiPGlucHV0IHR5cGU9J2hpZGRlbicgdmFsdWU9J1wiICsgYXJyW2ldICsgXCInPlwiO1xuICAgICAgICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIG9uIHRoZSBpdGVtIHZhbHVlIChESVYgZWxlbWVudCk6Ki9cbiAgICAgICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvKmluc2VydCB0aGUgdmFsdWUgZm9yIHRoZSBhdXRvY29tcGxldGUgdGV4dCBmaWVsZDoqL1xuICAgICAgICAgIGlucC52YWx1ZSA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF0udmFsdWU7XG4gICAgICAgICAgLypjbG9zZSB0aGUgbGlzdCBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyxcbiAgICAgICAgICAgIChvciBhbnkgb3RoZXIgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlczoqL1xuICAgICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGEuYXBwZW5kQ2hpbGQoYik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gcHJlc3NlcyBhIGtleSBvbiB0aGUga2V5Ym9hcmQ6Ki9cbiAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XG4gICAgaWYgKHgpIHggPSB4LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcbiAgICBpZiAoZS5rZXlDb2RlID09IDQwKSB7XG4gICAgICAvKklmIHRoZSBhcnJvdyBET1dOIGtleSBpcyBwcmVzc2VkLFxuICAgICAgaW5jcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xuICAgICAgY3VycmVudEZvY3VzKys7XG4gICAgICAvKmFuZCBhbmQgbWFrZSB0aGUgY3VycmVudCBpdGVtIG1vcmUgdmlzaWJsZToqL1xuICAgICAgYWRkQWN0aXZlKHgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDM4KSB7XG4gICAgICAvL3VwXG4gICAgICAvKklmIHRoZSBhcnJvdyBVUCBrZXkgaXMgcHJlc3NlZCxcbiAgICAgIGRlY3JlYXNlIHRoZSBjdXJyZW50Rm9jdXMgdmFyaWFibGU6Ki9cbiAgICAgIGN1cnJlbnRGb2N1cy0tO1xuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cbiAgICAgIGFkZEFjdGl2ZSh4KTtcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgLypJZiB0aGUgRU5URVIga2V5IGlzIHByZXNzZWQsIHByZXZlbnQgdGhlIGZvcm0gZnJvbSBiZWluZyBzdWJtaXR0ZWQsKi9cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChjdXJyZW50Rm9jdXMgPiAtMSkge1xuICAgICAgICAvKmFuZCBzaW11bGF0ZSBhIGNsaWNrIG9uIHRoZSBcImFjdGl2ZVwiIGl0ZW06Ki9cbiAgICAgICAgaWYgKHgpIHhbY3VycmVudEZvY3VzXS5jbGljaygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIGFkZEFjdGl2ZSh4KSB7XG4gICAgLyphIGZ1bmN0aW9uIHRvIGNsYXNzaWZ5IGFuIGl0ZW0gYXMgXCJhY3RpdmVcIjoqL1xuICAgIGlmICgheCkgcmV0dXJuIGZhbHNlO1xuICAgIC8qc3RhcnQgYnkgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3Mgb24gYWxsIGl0ZW1zOiovXG4gICAgcmVtb3ZlQWN0aXZlKHgpO1xuICAgIGlmIChjdXJyZW50Rm9jdXMgPj0geC5sZW5ndGgpIGN1cnJlbnRGb2N1cyA9IDA7XG4gICAgaWYgKGN1cnJlbnRGb2N1cyA8IDApIGN1cnJlbnRGb2N1cyA9IHgubGVuZ3RoIC0gMTtcbiAgICAvKmFkZCBjbGFzcyBcImF1dG9jb21wbGV0ZS1hY3RpdmVcIjoqL1xuICAgIHhbY3VycmVudEZvY3VzXS5jbGFzc0xpc3QuYWRkKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlKHgpIHtcbiAgICAvKmEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBcImFjdGl2ZVwiIGNsYXNzIGZyb20gYWxsIGF1dG9jb21wbGV0ZSBpdGVtczoqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgeFtpXS5jbGFzc0xpc3QucmVtb3ZlKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoZWxtbnQpIHtcbiAgICAvKmNsb3NlIGFsbCBhdXRvY29tcGxldGUgbGlzdHMgaW4gdGhlIGRvY3VtZW50LFxuICBleGNlcHQgdGhlIG9uZSBwYXNzZWQgYXMgYW4gYXJndW1lbnQ6Ki9cbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsbW50ICE9IHhbaV0gJiYgZWxtbnQgIT0gaW5wKSB7XG4gICAgICAgIHhbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh4W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIGNsaWNrcyBpbiB0aGUgZG9jdW1lbnQ6Ki9cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgY2xvc2VBbGxMaXN0cyhlLnRhcmdldCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBBdXRvQ29tcGxldGUgfTtcbiIsImZ1bmN0aW9uIENvdW50cnlTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCB1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX191cCcpO1xuICBsZXQgZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19kb3duJyk7XG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xuICBsZXQgaXRlbUhlaWdodCA9XG4gICAgaXRlbXMgIT0gbnVsbCA/IGl0ZW1zLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcub2Zmc2V0SGVpZ2h0IDogMDtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAodXAgIT0gbnVsbCkge1xuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xuICAgIGRvd24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxEb3duKTtcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXG4gICAgZnVuY3Rpb24gc2Nyb2xsVXAoKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgdXAgYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgZG93biBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wIC09IGl0ZW1IZWlnaHQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IENvdW50cnlTZWxlY3RvciB9O1xuIiwiLy8gbW9kdWxlIENvdmVyT3B0aW9ucy5qc1xuXG5mdW5jdGlvbiBDb3Zlck9wdGlvbnMoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBjb25zdCBjb3N0UHJlZml4VGV4dCA9ICQoJy5qcy1jb3N0LXByZWZpeCcpO1xuICBjb25zdCB3YXJuaW5nVGV4dCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0Jyk7XG4gIGNvbnN0IHdhcm5pbmdUZXh0NjAgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLndhcm5pbmctdGV4dC02MCcpO1xuICBjb25zdCBjb3Zlck9wdGlvblByaWNlID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC5jYXJkLXByaWNlJyk7XG4gIC8vIEdldCBzaW5nbGUgdHJpcCBwcmljZVxuICBjb25zdCBpbml0aWFsQ292ZXJQcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuYW1vdW50Jyk7XG4gIGNvbnN0IGRfaW5pdGlhbENvdmVyUHJpY2UgPSBwYXJzZUZsb2F0KFxuICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoKS5yZXBsYWNlKC9cXEQqLywgJycpXG4gICkudG9GaXhlZCgyKTtcblxuICBjb25zdCBpbml0aWFsU2luZ2xlVHJpcFByaWNlID0gJCgnLmluaXRpYWwtc2luZ2xlLXRyaXAtcHJpY2UnKTtcbiAgY29uc3QgZF9pbml0aWFsU2luZ2xlVHJpcFByaWNlID0gcGFyc2VGbG9hdChcbiAgICBpbml0aWFsU2luZ2xlVHJpcFByaWNlLnRleHQoKS5yZXBsYWNlKC9cXEQqLywgJycpXG4gICkudG9GaXhlZCgyKTtcblxuICBjb25zdCBjdXJyZW5jeVN5bWJvbCA9IGluaXRpYWxDb3ZlclByaWNlLnRleHQoKS5zdWJzdHJpbmcoMCwgMSk7XG4gIGxldCBpbnB1dFZhbHVlID0gJyc7XG4gIGxldCBwcmljZUxpbWl0O1xuICBsZXQgdG90YWxJbml0aWFsUHJpY2UgPSAwO1xuICBsZXQgdG90YWxTaW5nbGVQcmljZSA9IDA7XG4gIGxldCBmaW5hbFByaWNlID0gMDtcblxuICBpZiAoY3VycmVuY3lTeW1ib2wgPT0gJ1xcdTAwQTMnKSB7XG4gICAgcHJpY2VMaW1pdCA9IDExOTtcbiAgfSBlbHNlIHtcbiAgICBwcmljZUxpbWl0ID0gMTQyO1xuICB9XG5cbiAgLy9jb25zb2xlLmNsZWFyKCk7XG4gIC8vY29uc29sZS5sb2coYGNvdmVyIHByaWNlOiAke2RfaW5pdGlhbENvdmVyUHJpY2V9YCk7XG4gIC8vY29uc29sZS5sb2coYFNpbmdsZSBUcmlwIHByaWNlOiAke2RfaW5pdGlhbFNpbmdsZVRyaXBQcmljZX1gKTtcbiAgLy9jb25zb2xlLmxvZyhgY3VycmVuY3lTeW1ib2w6ICR7Y3VycmVuY3lTeW1ib2x9YCk7XG5cbiAgJCgnLnByb2R1Y3Qtb3B0aW9ucy1kYXlzLWNvdmVyJykuY2hhbmdlKGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIGdldCB2YWx1ZVxuICAgIGlucHV0VmFsdWUgPSBwYXJzZUludChldnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG5cbiAgICAvLyBoaWRlIFwiZnJvbVwiIHRleHRcbiAgICBpZiAoaW5wdXRWYWx1ZSA+IDMpIHtcbiAgICAgIGNvc3RQcmVmaXhUZXh0LmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29zdFByZWZpeFRleHQuc2hvdygpO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFZhbHVlID4gMCAmJiBOdW1iZXIuaXNJbnRlZ2VyKGlucHV0VmFsdWUpKSB7XG4gICAgICAvLyBjYWxjdWxhdGUgd2l0aCBpbnRpdGFsIGNvdmVyIHByaWNlXG4gICAgICAvLyBkX2luaXRpYWxDb3ZlclByaWNlID0gMTEuOTlcbiAgICAgIGlmIChpbnB1dFZhbHVlID4gMCAmJiBpbnB1dFZhbHVlIDw9IDMpIHtcbiAgICAgICAgdG90YWxJbml0aWFsUHJpY2UgPSBkX2luaXRpYWxDb3ZlclByaWNlO1xuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gdG90YWxJbml0aWFsUHJpY2U7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmICgoaW5wdXRWYWx1ZSA+IDMgJiYgaW5wdXRWYWx1ZSA8PSA2MCkgfHwgcHJpY2VMaW1pdCA8IGZpbmFsUHJpY2UpIHtcbiAgICAgIGlmIChpbnB1dFZhbHVlID4gMykge1xuICAgICAgICB0b3RhbEluaXRpYWxQcmljZSA9IGRfaW5pdGlhbENvdmVyUHJpY2U7XG4gICAgICAgIC8vIGRvdWJsZSB1cCBvbiB0aGUgc3RyaW5nIHZhbHVlcyB0byB1c2UgYSB1bmFyeSBwbHVzIHRvIGNvbnZlcnQgYW5kIGhhdmUgaXQgYWRkZWQgdG8gdGhlIHByZXZpb3VzIHZhbHVlXG4gICAgICAgIHRvdGFsU2luZ2xlUHJpY2UgPVxuICAgICAgICAgICt0b3RhbEluaXRpYWxQcmljZSArICgraW5wdXRWYWx1ZSAtIDMpICogK2RfaW5pdGlhbFNpbmdsZVRyaXBQcmljZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5hbFByaWNlID0gcGFyc2VGbG9hdCh0b3RhbFNpbmdsZVByaWNlKS50b0ZpeGVkKDIpO1xuXG4gICAgaWYgKGlucHV0VmFsdWUgPiAxMSAmJiBpbnB1dFZhbHVlIDw9IDYwKSB7XG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgZmluYWxQcmljZSk7XG4gICAgICAvLyBjaGFuZ2UgY29sb3Igb2YgcHJpY2VcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgIC8vIHNob3cgd2FybmluZyB0ZXh0XG4gICAgICB3YXJuaW5nVGV4dC5zaG93KCk7XG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2Uuc2hvdygpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA+IDMgJiYgaW5wdXRWYWx1ZSA8PSA2MCkge1xuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcbiAgICB9IGVsc2UgaWYgKGlucHV0VmFsdWUgPD0gMykge1xuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcbiAgICB9IGVsc2UgaWYgKGlucHV0VmFsdWUgPiA2MCkge1xuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xuICAgICAgY292ZXJPcHRpb25QcmljZS5hZGRDbGFzcygnd2FybmluZycpO1xuICAgICAgd2FybmluZ1RleHQ2MC5zaG93KCk7XG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIHRvdGFsU2luZ2xlUHJpY2UpO1xuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcbiAgICB9XG5cbiAgICAvL2NvbnNvbGUubG9nKGAke2lucHV0VmFsdWV9ID0gJHtmaW5hbFByaWNlfWApO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgQ292ZXJPcHRpb25zIH07XG4iLCJmdW5jdGlvbiBUb2dnbGVOYXZpZ2F0aW9uKCkge1xuICAvLyBjYWNoZSBET01cbiAgY29uc3QgY3VycmVuY3kgPSAkKCcuY3VycmVuY3knKTtcbiAgY29uc3QgbWFpbk5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1tZW51Jyk7XG4gIGNvbnN0IG5hdkJhclRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XG4gIGNvbnN0IGN1cnJlbmN5TmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWN1cnJlbmN5LXRvZ2dsZScpO1xuICBjb25zdCBjdXJyZW5jeU1lbnVUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIG5hdkJhclRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU1lbnUpO1xuICBjdXJyZW5jeU1lbnVUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVDdXJyZW5jeU1lbnUpO1xuXG4gIC8vIGV2ZW50IGhhbmRsZXJzXG4gIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG4gICAgbWFpbk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbmN5TWVudSgpIHtcbiAgICBjdXJyZW5jeU5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGlmICgkKHdpbmRvdykud2lkdGgoKSA+ICcxMTk5Jykge1xuICAgIGN1cnJlbmN5LnNob3coKTtcbiAgfSBlbHNlIHtcbiAgICBjdXJyZW5jeS5oaWRlKCk7XG4gIH1cblxuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+ICcxMTk5Jykge1xuICAgICAgY3VycmVuY3kuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW5jeS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gRHJvcGRvd25NZW51KCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY2FyJyk7XG4gIGxldCBkcm9wRG93bk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tLWNhciAuZHJvcGRvd24tbWVudScpO1xuXG4gIGlmIChjYXJCdG4gIT0gbnVsbCAmJiBkcm9wRG93bk1lbnUgIT0gbnVsbCkge1xuICAgIGxldCBkcm9wRG93biA9IGNhckJ0bi5wYXJlbnRFbGVtZW50O1xuICAgIC8vIEJpbmQgZXZlbnRzXG4gICAgY2FyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyQnRuSGFuZGxlcik7XG5cbiAgICAvLyBFdmVudCBoYW5kbGVyc1xuICAgIGZ1bmN0aW9uIGNhckJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgLy8gdG9nZ2xlIGRpc3BsYXlcbiAgICAgIGlmIChcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJydcbiAgICAgICkge1xuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9XG4gICAgICAgICAgZHJvcERvd24ub2Zmc2V0SGVpZ2h0ICsgZHJvcERvd25NZW51Lm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBGaXhlZE5hdmlnYXRpb24oKSB7XG4gIC8vIG1ha2UgbmF2YmFyIHN0aWNreVxuICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxuICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICBteUZ1bmN0aW9uKCk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBoZWFkZXJcbiAgbGV0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZiYXInKTtcblxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXG4gIGxldCBzdGlja3kgPSBuYXZCYXIub2Zmc2V0VG9wO1xuXG4gIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxuICBmdW5jdGlvbiBteUZ1bmN0aW9uKCkge1xuICAgIGxldCBzdGlja3kgPSBuYXZCYXIub2Zmc2V0VG9wO1xuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QuYWRkKCduYXZiYXItZml4ZWQtdG9wJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QucmVtb3ZlKCduYXZiYXItZml4ZWQtdG9wJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIFNlbGVjdFRyaXAoKSB7XG4gIC8vIHNlbGVjdCB2ZWhpY2xlXG4gICQoJy50YWItY2FyIC5idG4nKS5jbGljayhmdW5jdGlvbihldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gICQoJy50YWItY2FyIC5pY29uLXJhZGlvIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgICQoJy50YWItY2FyIC5idG4nKS5yZW1vdmVDbGFzcygnYnRuLWN0YS0tZGlzYWJsZWQnKTtcbiAgICAkKCcudGFiLWNhciAuYnRuJykuYWRkQ2xhc3MoJ2J0bi1jdGEnKTtcbiAgICAkKCcudGFiLWNhciAuYnRuJykudW5iaW5kKCk7XG4gIH0pO1xufVxuXG4vLyBzaG93IG1vYmlsZSBjdXJyZW5jeVxuZnVuY3Rpb24gUmV2ZWFsQ3VycmVuY3koKSB7XG4gICQoJy5jdXJyZW5jeS1tb2JpbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnQ3VycmVuY3knKTtcblxuICAgICQoJy5jdXJyZW5jeScpLnNsaWRlVG9nZ2xlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBUb2dnbGVOYXZpZ2F0aW9uLFxuICBEcm9wZG93bk1lbnUsXG4gIEZpeGVkTmF2aWdhdGlvbixcbiAgU2VsZWN0VHJpcCxcbiAgUmV2ZWFsQ3VycmVuY3lcbn07XG4iLCJpbXBvcnQgeyBldmVudHMgfSBmcm9tICcuL1B1YlN1Yic7XG5cbi8vIG1vZHVsZSBcIlBvbGljeVN1bW1hcnkuanNcIlxuLy8gbW9kdWxlIFwiUG9saWN5U3VtbWFyeUFjY29yZGlvbi5qc1wiXG5cbmZ1bmN0aW9uIERlc2t0b3BEZXZpY2VTZXR1cCgpIHtcbiAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gIH0pO1xuXG4gIC8vIHJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIGZyb20gYWxsXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfSk7XG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtY2hpbGQoMiknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgLy8gc2hvdyBwb2xpY3kgaW5mb1xuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24gLnBvbGljeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gIH0pO1xuXG4gIC8vIHJlc2V0IHBvbGljeSBzdW1tYXJ5XG4gICQoJy5wb2xpY3ktc3VtbWFyeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfSk7XG4gICQoJy5wb2xpY3ktc3VtbWFyeS1pbmZvOmZpcnN0LWNoaWxkJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgLy8gcmVtb3ZlIG1vYmlsZSBldmVudCBsaXN0ZW5lclxuICBjb25zdCBhY2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICcuYWNjb3JkaW9uLWJhciBidXR0b24ubW9yZS1pbmZvcm1hdGlvbidcbiAgKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYWNjW2ldLmV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIGFjY1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycpO1xuICAgIH1cbiAgfVxuXG4gIFBvbGljeVN1bW1hcnlEZXNrdG9wKCk7XG59XG5cbmZ1bmN0aW9uIE1vYmlsZURldmljZVNldHVwKCkge1xuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KVxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICB9KTtcblxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24gLnBvbGljeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfSk7XG5cbiAgLy8gcmVzZXQgcG9saWN5IHN1bW1hcnlcbiAgJCgnLnBvbGljeS1zdW1tYXJ5LWluZm8nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICB9KTtcblxuICAvLyByZW1vdmUgZGVza3RvcCBldmVudCBsaXN0ZW5lclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS51bmJpbmQoKTtcblxuICAvLyBzZXR1cCBNb2JpbGVcbiAgUG9saWN5U3VtbWFyeU1vYmlsZSgpO1xufVxuXG4vLyBkZXZpY2UgcmVzZXQgT04gYnJvd3NlciB3aWR0aFxuZnVuY3Rpb24gUG9saWN5U3VtbWFyeURldmljZVJlc2l6ZSgpIHtcbiAgLy8gY29uc29sZS5sb2cod2luZG93Lm91dGVyV2lkdGgpO1xuXG4gIGlmICh3aW5kb3cub3V0ZXJXaWR0aCA+IDExOTkpIHtcbiAgICAvKipcbiAgICAgKiBERVZJQ0U6IERlc2t0b3BcbiAgICAgKi9cbiAgICBEZXNrdG9wRGV2aWNlU2V0dXAoKTtcbiAgfSBlbHNlIHtcbiAgICAvKipcbiAgICAgKiBERVZJQ0U6IE1vYmlsZVxuICAgICAqL1xuICAgIE1vYmlsZURldmljZVNldHVwKCk7XG4gIH1cblxuICAvLyBDYWNoZSBET01cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gY29uc29sZS5sb2coZXZ0LnRhcmdldC5vdXRlcldpZHRoKTtcblxuICAgIGlmIChldnQudGFyZ2V0Lm91dGVyV2lkdGggPiAxMTk5KSB7XG4gICAgICAvKipcbiAgICAgICAqIERFVklDRTogRGVza3RvcFxuICAgICAgICovXG4gICAgICBEZXNrdG9wRGV2aWNlU2V0dXAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLyoqXG4gICAgICAgKiBERVZJQ0U6IE1vYmlsZVxuICAgICAgICovXG4gICAgICBNb2JpbGVEZXZpY2VTZXR1cCgpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogUG9saWN5IFN1bW1hcnkgSGFuZGxlciBmb3IgbW9iaWxlXG4gKlxuICogQHJldHVybiAge25vbmV9XG4gKi9cbmZ1bmN0aW9uIFBvbGljeVN1bW1hcnlNb2JpbGUoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBjb25zdCBhY2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICcuYWNjb3JkaW9uLWJhciBidXR0b24ubW9yZS1pbmZvcm1hdGlvbidcbiAgKTtcbiAgbGV0IGNhcmRDb3Zlck9wdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkLWNvdmVyLW9wdGlvbicpO1xuICBsZXQgcG9saWN5U3VtbWFyeUluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9saWN5LXN1bW1hcnktaW5mbycpO1xuICBsZXQgcG9saWN5UmVmZXJlbmNlID0gJyc7XG5cbiAgbGV0IGFjdGl2ZUNhcmRPcHRpb24gPSAnJztcblxuICAvLyBCaW5kIEV2ZW50c1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhldnQuY3VycmVudFRhcmdldCk7XG4gICAgLyogaGlkZSB0aGUgb3RoZXIgb3B0aW9ucyAqL1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gICAgLy8gbW9yZSBpbmZvcm1hdGlvbiBidXR0b24gaGFzIGJlZW4gY2xpY2tlZFxuICAgIGlmIChhY3RpdmVDYXJkT3B0aW9uID09PSAnc2VsZWN0ZWQnKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnQ2xvc2UnKTtcblxuICAgICAgLy8gcmVtb3ZlIGFjdGl2ZSBib3JkZXJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZENvdmVyT3B0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhcmRDb3Zlck9wdGlvbltpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgY2FyZENvdmVyT3B0aW9uW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHBvbGljeS1pbmZvXG4gICAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAnLmNhcmQtY292ZXItb3B0aW9uW2RhdGEtcG9saWN5Xj1cInBvbGljeS1zdW1tYXJ5LVwiXSAucG9saWN5LWluZm8nXG4gICAgICAgIClcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuXG4gICAgICAvLyBoaWRlIGFsbCBwb2xpY3ktc3VtbWFyeS1pbmZvIGJsb2Nrc1xuICAgICAgcG9saWN5U3VtbWFyeUluZm8uZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9KTtcblxuICAgICAgYWN0aXZlQ2FyZE9wdGlvbiA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnT3BlbicpO1xuXG4gICAgICAvLyBtb3ZlIG1vcmUgaW5mb3JtYXRpb24gYXJyb3dcbiAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgICAvKiBoaWdobGlnaHQgdGhlIGNhcmQgdGhhdCdzIGJlZW4gc2VsZWN0ZWQgKi9cbiAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgJ2FjdGl2ZSdcbiAgICAgICk7XG5cbiAgICAgIC8vIGdldCBwb2xpY3kgcmVmZXJlbmNlXG4gICAgICBwb2xpY3lSZWZlcmVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1jb3Zlci1vcHRpb24uYWN0aXZlJylcbiAgICAgICAgLmRhdGFzZXQucG9saWN5O1xuXG4gICAgICAvLyBzaG93IG9ubHkgdGhlIHByb2R1Y3Qgc3VtbWFyeSBpbmZvIHRoYXQgaGFzIGFuIGFjdGl2ZSBwcm9kdWN0IGNvdmVyIG9wdGlvblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXJkQ292ZXJPcHRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhcmRDb3Zlck9wdGlvbltpXS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuaW5kZXhPZignYWN0aXZlJykgPCAwKSB7XG4gICAgICAgICAgY2FyZENvdmVyT3B0aW9uW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FyZENvdmVyT3B0aW9uW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgdGhlIGNvdmVyIG9wdGlvbiBpbmZvIHRleHRcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICcuY2FyZC1jb3Zlci1vcHRpb25bZGF0YS1wb2xpY3k9XCInICsgcG9saWN5UmVmZXJlbmNlICsgJ1wiXSAucG9saWN5LWluZm8nXG4gICAgICApLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICBhY3RpdmVDYXJkT3B0aW9uID0gJ3NlbGVjdGVkJztcblxuICAgICAgLy8gaGlkZSBhbGwgcG9saWN5LXN1bW1hcnktaW5mbyBibG9ja3NcbiAgICAgIHBvbGljeVN1bW1hcnlJbmZvLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2V0IHRoZSBwb2xpY3kgc3VtbWFyeSBpbmZvIHBhbmVsIGFzc29jaWNhdGVkIHdpdGggdGhpcyBwcm9kdWN0IHVzaW5nIHRoZSBwb2xpY3lSZWZlcmVuY2VcbiAgICAgIGxldCBwYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICcucG9saWN5LXN1bW1hcnktaW5mby4nICsgcG9saWN5UmVmZXJlbmNlXG4gICAgICApO1xuICAgICAgcGFuZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcbiAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xuICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50cy5vbignaGVpZ2h0Q2hhbmdlZCcsIGFkanVzdFBhbmVsSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGp1c3RQYW5lbEhlaWdodChuZXdIZWlnaHQpIHtcbiAgICAgIGxldCBuZXdUb3RhbCA9XG4gICAgICAgIHBhcnNlSW50KFxuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodC5zdWJzdHJpbmcoMCwgcGFuZWwuc3R5bGUubWF4SGVpZ2h0Lmxlbmd0aCAtIDIpXG4gICAgICAgICkgK1xuICAgICAgICBwYXJzZUludChuZXdIZWlnaHQuc3Vic3RyaW5nKDAsIG5ld0hlaWdodC5sZW5ndGggLSAyKSkgK1xuICAgICAgICAncHgnO1xuXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBuZXdUb3RhbDtcbiAgICB9XG4gIH0gLy8gYWNjb3JkaW9uSGFuZGxlclxufSAvLyBQb2xpY3lTdW1tYXJ5TW9iaWxlXG5cbi8qKlxuICogUG9saWN5IFN1bW1hcnkgaGFuZGxlciBmb3IgZGVza3RvcFxuICpcbiAqIEByZXR1cm4gIHtub25lfVxuICovXG5mdW5jdGlvbiBQb2xpY3lTdW1tYXJ5RGVza3RvcCgpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIC8vIHBvbGljeSBzdW1tYXJ5XG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIHNob3cgcG9saWN5IHN1bW1hcnlcbiAgICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH0pO1xuICAgIGxldCBwb2xpY3lTdW1tYXJ5ID0gJCh0aGlzKS5kYXRhKCdwb2xpY3knKTtcbiAgICAkKCcuJyArIHBvbGljeVN1bW1hcnkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICB9KTtcbn0gLy8gUG9saWN5U3VtbWFyeURlc2t0b3BcblxuZXhwb3J0IHsgUG9saWN5U3VtbWFyeURldmljZVJlc2l6ZSwgUG9saWN5U3VtbWFyeU1vYmlsZSwgUG9saWN5U3VtbWFyeURlc2t0b3AgfTtcbiIsIi8vIFRoZSBtb2R1bGUgd2lsbCBzZW5kIGEgY2hhbmdlZCBldmVudCB0byBQdWJTdWIgYW5kXG4vLyBhbnlvbmUgbGlzdGVuaW5nIHdpbGwgcmVjZWl2ZSB0aGF0IGNoYW5nZWQgZXZlbnQgYW5kXG4vLyB0aGVuIHVwZGF0ZSBhY2NvcmRpbmdseVxuXG5sZXQgZXZlbnRzID0ge1xuICAvLyBsaXN0IG9mIGV2ZW50c1xuICBldmVudHM6IHt9LFxuXG4gIG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7IGV2ZW50cyB9O1xuIiwiLy8gbW9kdWxlIFJldmVhbERvY3MuanNcblxuZnVuY3Rpb24gUmV2ZWFsRG9jcygpIHtcbiAgLy9Eb2NzXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgb24gPSAkKCcuZG9jcycpLmlzKCc6dmlzaWJsZScpO1xuICAgICQodGhpcykuaHRtbChcbiAgICAgIG9uID8gJ1ZpZXcgcG9saWN5IGRvY3VtZW50YXRpb24nIDogJ0hpZGUgcG9saWN5IGRvY3VtZW50YXRpb24nXG4gICAgKTtcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBSZXZlYWxEb2NzIH07XG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3Aoc2Nyb2xsRHVyYXRpb24pIHtcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSAhPSAwKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9LCAxNSk7XG59XG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoc2Nyb2xsRHVyYXRpb24pIHtcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxuICAgIG9sZFRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XG4gICAgc2Nyb2xsQ291bnQgKz0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKTtcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xuICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgIDAsXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcbiAgICApO1xuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICB9XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cbi8qXG4gIEV4cGxhbmF0aW9uczpcbiAgLSBwaSBpcyB0aGUgbGVuZ3RoL2VuZCBwb2ludCBvZiB0aGUgY29zaW51cyBpbnRlcnZhbGwgKHNlZSBhYm92ZSlcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gIC0gbmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wIGVxdWFscyB0aGUgZHVyYXRpb25cblxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXG4gID0gYSAqIGNvcyAoYngpICsgZCAgICAgICAgICAgICAgICAgICAgICAgICAgfCBkIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHkgYXhpcyA9IDEgLT4gb25seSBwb3NpdGl2ZSB5IHZhbHVlc1xuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3Mgc2Nyb2xsQ291bnQgKiB4KVxuKi9cblxuZnVuY3Rpb24gU2Nyb2xsVG9Ub3AoKSB7XG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcbiAgICBiYWNrVG9Ub3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiYWNrVG9Ub3BCdG5IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XG5cbiAgICAvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAzMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xuICAvLyBjYWNoZSBET01cbiAgY29uc3QgYWNjb3JkaW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xuICApO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdyA9XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgIGlmICh3ID4gMTIwMCkge1xuICAgICAgbGV0IGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodyA8PSAxMjAwKSB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9O1xuIiwiLy8gbW9kdWxlIFwiU2Nyb2xsVG8uanNcIlxuXG5mdW5jdGlvbiBTY3JvbGxUbygpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIC8vIFNlbGVjdCBhbGwgbGlua3Mgd2l0aCBoYXNoZXNcbiAgLy8gUmVtb3ZlIGxpbmtzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgbGluayB0byBhbnl0aGluZ1xuICBsZXQgYW5jaG9ycyA9ICQoJ2FbaHJlZio9XCIjXCJdJylcbiAgICAubm90KCdbaHJlZj1cIiNcIl0nKVxuICAgIC5ub3QoJ1tocmVmPVwiIzBcIl0nKTtcblxuICBsZXQgaGVpZ2h0Q29tcGVuc2F0aW9uID0gNjA7XG4gIC8vIEJpbmQgRXZlbnRzXG4gIGFuY2hvcnMuY2xpY2soYW5jaG9yc0hhbmRsZXIpO1xuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGFuY2hvcnNIYW5kbGVyKGV2ZW50KSB7XG4gICAgLy8gT24tcGFnZSBsaW5rc1xuICAgIGlmIChcbiAgICAgIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgPT1cbiAgICAgICAgdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpICYmXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lXG4gICAgKSB7XG4gICAgICAvLyBGaWd1cmUgb3V0IGVsZW1lbnQgdG8gc2Nyb2xsIHRvXG4gICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xuICAgICAgLy8gRG9lcyBhIHNjcm9sbCB0YXJnZXQgZXhpc3Q/XG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICAvLyBPbmx5IHByZXZlbnQgZGVmYXVsdCBpZiBhbmltYXRpb24gaXMgYWN0dWFsbHkgZ29ubmEgaGFwcGVuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIGhlaWdodENvbXBlbnNhdGlvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgMTAwMCxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gTXVzdCBjaGFuZ2UgZm9jdXMhXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQodGFyZ2V0KTtcbiAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCc6Zm9jdXMnKSkge1xuICAgICAgICAgICAgICAvLyBDaGVja2luZyBpZiB0aGUgdGFyZ2V0IHdhcyBmb2N1c2VkXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICR0YXJnZXQuYXR0cigndGFiaW5kZXgnLCAnLTEnKTsgLy8gQWRkaW5nIHRhYmluZGV4IGZvciBlbGVtZW50cyBub3QgZm9jdXNhYmxlXG4gICAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTsgLy8gU2V0IGZvY3VzIGFnYWluXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBvbiBzY3JvbGxcbmlmICgkKCcuYXJ0aWNsZS1tYWluJykubGVuZ3RoID4gMCkge1xuICBsZXQgdGFyZ2V0ID0gJCgnLmFydGljbGUtbWFpbicpLm9mZnNldCgpLnRvcCAtIDE4MDtcbiAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgU2Nyb2xsVG8gfTtcbiIsImZ1bmN0aW9uIFJlYWR5KGZuKSB7XG4gIGlmIChcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXG4gICAgICA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJ1xuICApIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxuZXhwb3J0IHsgUmVhZHkgfTtcbiIsImZ1bmN0aW9uIFZlaGljbGVTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBjYXJUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX2NhcicpO1xuICBsZXQgdmFuVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX192YW4nKTtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAoY2FyVGFiICE9IG51bGwgJiYgdmFuVGFiICE9IG51bGwpIHtcbiAgICBjYXJUYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gICAgdmFuVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xuICB9XG5cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gb3BlblZlaGljbGUoZXZ0KSB7XG4gICAgdmFyIGksIHgsIHRhYkJ1dHRvbnM7XG5cbiAgICBjb25zb2xlLmxvZyhldnQpO1xuXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXG4gICAgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItY29udGFpbmVyIC50YWInKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXG4gICAgdGFiQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtdGFicyAubmF2LWxpbmsnKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xuICAgIH1cblxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxuICAgIC8vIHNob3cgdGhlIHNlbGVjdGVkIHRhYiBjb250ZW50XG4gICAgbGV0IHZlaGljbGUgPSBldnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmVoaWNsZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItJyArIHZlaGljbGUpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZSArPSAnIGFjdGl2ZSc7XG4gIH1cbn1cblxuZXhwb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH07XG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tIFwidXRpbFwiO1xuXG4vLyBtb2R1bGUgXCJMb2FkRkFRcy5qc1wiXG5cbmZ1bmN0aW9uIExvYWRGQVFzKCkge1xuICAvLyBsb2FkIGZhcXNcbiAgJCgnI2ZhcVRhYnMgYScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCh0aGlzKS50YWIoJ3Nob3cnKTtcbiAgfSk7XG5cbiAgLy8gbG9hZCBmYXFzXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBmYXFzIHBhZ2VcbiAgaWYgKCQoJyNmYXFzJykubGVuZ3RoID4gMCkge1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnR0VUJyxcbiAgICAgIHVybDogJy9hcGkvZmFxcy5qc29uJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSBoZWFkc1xuICAgICAgICAkLmVhY2goZmFxcywgZnVuY3Rpb24oaW5kZXgsIGZhcSkge1xuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgZGVza3RvcFxuICAgICAgICAgICQoYGFbaHJlZj0nIyR7ZmFxLmlkfSddYClcbiAgICAgICAgICAgIC5maW5kKCdzcGFuJylcbiAgICAgICAgICAgIC50ZXh0KGZhcS50aXRsZSk7XG5cbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIG1vYmlsZVxuICAgICAgICAgICQoYCMke2ZhcS5pZH1gKVxuICAgICAgICAgICAgLmZpbmQoJ2gzJylcbiAgICAgICAgICAgIC50ZXh0KGZhcS5zaG9ydFRpdGxlKTtcblxuICAgICAgICAgIC8vIGdldCB0aGUgYm9keVxuICAgICAgICAgICQuZWFjaChmYXEucWFzLCBmdW5jdGlvbihmSW5kZXgsIHFhKSB7XG4gICAgICAgICAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicsIGAjJHtmYXEuaWR9YCkuYXBwZW5kKFxuICAgICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke3FhLnF1ZXN0aW9ufTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgJHtxYS5hbnN3ZXJ9XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gJGFqYXhcblxuICAgICQoJy5mYXEtYW5zd2VycyAuaW5uZXIgLmFjY29yZGlvbicpLmRlbGVnYXRlKFxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcbiAgICAgICdjbGljaycsXG4gICAgICBmYXFzSGFuZGxlclxuICAgICk7XG4gIH1cblxuICBsb2FkUHJvZHVjdFBhZ2VGQVFzKCk7XG59XG5cblxuZnVuY3Rpb24gbG9hZFByb2R1Y3RQYWdlRkFRcygpIHtcbiAgLy8gb25seSBsb2FkIGlmIG9uIHByb2R1Y3QgcGFnZVxuICBpZiAoJCgnLnByb2R1Y3QtZmFxcycpLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgZmlsZSA9ICQoJy5wcm9kdWN0LWZhcXMnKVxuICAgICAgLmRhdGEoJ2ZhcXMnKVxuICAgICAgLnJlcGxhY2UoJyYtJywgJycpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApO1xuXG4gICAgLy8kLmFqYXgoe1xuICAgIC8vICB0eXBlOiAnR0VUJyxcbiAgICAvLyAgdXJsOiBgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmAsXG4gICAgLy8gIHN1Y2Nlc3M6IHVwZGF0ZVVJU3VjY2VzcyxcbiAgICAvLyAgZXJyb3I6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyb3IpIHtcbiAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcbiAgICAvLyAgfVxuICAgIC8vfSk7IC8vICRhamF4XG5cbiAgICBmZXRjaChgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiAocmVzcG9uc2UuanNvbigpKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgdXBkYXRlVUlTdWNjZXNzKHJlc3BvbnNlKTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHVwZGF0ZVVJRmFpbHVyZShlcnJvcik7XG4gICAgfSk7XG5cbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXG4gICAgICAnY2xpY2snLFxuICAgICAgZmFxc0hhbmRsZXJcbiAgICApO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdXBkYXRlVUlTdWNjZXNzKGZhcXMpIHtcbiAgLy8gZ2V0IHRoZSBib2R5XG4gICQuZWFjaChmYXFzLCBmdW5jdGlvbiAoZkluZGV4LCBmYXEpIHtcbiAgICAvL2NvbnNvbGUubG9nKGAjJHtmYXEuaWR9YCk7XG4gICAgJCgnLmlubmVyIC5hY2NvcmRpb24nKS5hcHBlbmQoXG4gICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke2ZhcS5xdWVzdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubmVyXCI+XG4gICAgICAgICAgICAgICR7ZmFxLmFuc3dlcn1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgXG4gICAgKTtcbiAgfSk7XG5cbiAgLy8gc2hvdyBjb250ZW50XG4gICQoJy5mYXEtYW5zd2Vycy1wcm9kdWN0Jykuc2hvdygpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVVSUZhaWx1cmUoZXJyb3IpIHtcbiAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiwgZXJyb3IpO1xufVxuXG5mdW5jdGlvbiBmYXFzSGFuZGxlcihldnQpIHtcbiAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xuICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblxuICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcbiAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XG4gIH0gZWxzZSB7XG4gICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xuICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgfVxufVxuZXhwb3J0IHsgTG9hZEZBUXMgfTtcbiIsImltcG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xuaW1wb3J0IHsgQWNjb3JkaW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbic7XG5pbXBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yJztcbmltcG9ydCB7IFZlaGljbGVTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9WZWhpY2xlU2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgVG9nZ2xlTmF2aWdhdGlvbixcbiAgRHJvcGRvd25NZW51LFxuICBGaXhlZE5hdmlnYXRpb24sXG4gIFNlbGVjdFRyaXAsXG4gIFJldmVhbEN1cnJlbmN5XG59IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcbmltcG9ydCB7IFNjcm9sbFRvIH0gZnJvbSAnLi9jb21wb25lbnRzL1Njcm9sbFRvJztcbmltcG9ydCB7IEF1dG9Db21wbGV0ZSB9IGZyb20gJy4vY29tcG9uZW50cy9BdXRvQ29tcGxldGUnO1xuaW1wb3J0IHsgTG9hZEZBUXMgfSBmcm9tICcuL2NvbXBvbmVudHMvZmFxcyc7XG5pbXBvcnQgeyBSZXZlYWxEb2NzIH0gZnJvbSAnLi9jb21wb25lbnRzL1JldmVhbERvY3MnO1xuaW1wb3J0IHsgQ292ZXJPcHRpb25zIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdmVyT3B0aW9ucyc7XG5pbXBvcnQgeyBSZWFkeSB9IGZyb20gJy4vY29tcG9uZW50cy9VdGlscyc7XG5pbXBvcnQge1xuICBQb2xpY3lTdW1tYXJ5RGV2aWNlUmVzaXplLFxuICBQb2xpY3lTdW1tYXJ5TW9iaWxlLFxuICBQb2xpY3lTdW1tYXJ5RGVza3RvcFxufSBmcm9tICcuL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeSc7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICd1dGlsJztcblxubGV0IGNvdW50cmllc0NvdmVyZWQgPSBudWxsO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgLy8gQ291bnRyeVNlbGVjdG9yKCk7XG4gIFZlaGljbGVTZWxlY3RvcigpO1xuICBUb2dnbGVOYXZpZ2F0aW9uKCk7XG4gIERyb3Bkb3duTWVudSgpO1xuICBTY3JvbGxUb1RvcCgpO1xuICBGaXhlZE5hdmlnYXRpb24oKTtcbiAgQWNjb3JkaW9uKCk7XG4gIFdpbmRvd1dpZHRoKCk7XG4gIFNjcm9sbFRvKCk7XG5cbiAgLy8gY29uc29sZS5sb2coYGNvdW50cmllc0NvdmVyZWQ6ICR7Y291bnRyaWVzQ292ZXJlZH1gKTtcbiAgLy8gaWYgKGNvdW50cmllc0NvdmVyZWQgIT0gbnVsbCkge1xuICAvLyAgIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbnB1dCcpLCBjb3VudHJpZXNDb3ZlcmVkKTtcbiAgLy8gfVxuXG4gIExvYWRGQVFzKCk7XG4gIFJldmVhbERvY3MoKTtcbiAgQ292ZXJPcHRpb25zKCk7XG4gIC8vIFBvbGljeVN1bW1hcnlNb2JpbGUoKTtcbiAgLy8gUG9saWN5U3VtbWFyeURlc2t0b3AoKTtcbiAgUG9saWN5U3VtbWFyeURldmljZVJlc2l6ZSgpO1xuICBTZWxlY3RUcmlwKCk7XG4gIFJldmVhbEN1cnJlbmN5KCk7XG59XG5cblJlYWR5KHN0YXJ0KTtcbiJdfQ==
=======
},{"./components/Accordion":5,"./components/CoverOptions":6,"./components/Navigation":7,"./components/PolicySummary":8,"./components/RevealDocs":9,"./components/Screen":10,"./components/ScrollTo":11,"./components/Utils":12,"./components/VehicleSelector":13,"./components/faqs":14}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ292ZXJPcHRpb25zLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Qb2xpY3lTdW1tYXJ5LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QXpCO0FBQ0Q7O0FBRUQsU0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCOztBQUVBLE1BQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxRQUFuQzs7QUFFQTtBQUNBLE1BQUksUUFBUSxJQUFJLGFBQUosQ0FBa0Isa0JBQTlCO0FBQ0EsTUFBSSxNQUFNLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixVQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLElBQXhCO0FBQ0EsVUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLFVBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxHQUpELE1BSU87QUFDTCxVQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE1BQU0sWUFBTixHQUFxQixJQUE3QztBQUNBLFVBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxVQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLE1BQTNCO0FBQ0Q7QUFDRjtRQUNRLFEsR0FBQSxROzs7OztBQ3hJVDs7QUFDQTs7QUFFQTs7QUFDQTs7QUFPQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTtBQUNBOztBQWpCQTtBQW1CQSxJQUFJLG1CQUFtQixJQUF2QjtBQVRBOzs7QUFXQSxTQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUVELGtCQUFNLEtBQU4iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8gbW9kdWxlIFwiQWNjb3JkaW9uLmpzXCJcclxuXHJcbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBsZXQgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIC8vIEV2ZW50IEhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcclxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXHJcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cclxuICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcclxuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCB7IEFjY29yZGlvbiB9O1xyXG4iLCIvLyBtb2R1bGUgQ292ZXJPcHRpb25zLmpzXHJcblxyXG5mdW5jdGlvbiBDb3Zlck9wdGlvbnMoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgY29zdFByZWZpeFRleHQgPSAkKCcuanMtY29zdC1wcmVmaXgnKTtcclxuICBjb25zdCB3YXJuaW5nVGV4dCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0Jyk7XHJcbiAgY29uc3Qgd2FybmluZ1RleHQ2MCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0LTYwJyk7XHJcbiAgY29uc3QgY292ZXJPcHRpb25QcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuY2FyZC1wcmljZScpO1xyXG4gIC8vIEdldCBzaW5nbGUgdHJpcCBwcmljZVxyXG4gIGNvbnN0IGluaXRpYWxDb3ZlclByaWNlID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC5hbW91bnQnKTtcclxuICBjb25zdCBkX2luaXRpYWxDb3ZlclByaWNlID0gcGFyc2VGbG9hdChcclxuICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoKS5yZXBsYWNlKC9cXEQqLywgJycpXHJcbiAgKS50b0ZpeGVkKDIpO1xyXG5cclxuICBjb25zdCBpbml0aWFsU2luZ2xlVHJpcFByaWNlID0gJCgnLmluaXRpYWwtc2luZ2xlLXRyaXAtcHJpY2UnKTtcclxuICBjb25zdCBkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2UgPSBwYXJzZUZsb2F0KFxyXG4gICAgaW5pdGlhbFNpbmdsZVRyaXBQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxyXG4gICkudG9GaXhlZCgyKTtcclxuXHJcbiAgY29uc3QgY3VycmVuY3lTeW1ib2wgPSBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkuc3Vic3RyaW5nKDAsIDEpO1xyXG4gIGxldCBpbnB1dFZhbHVlID0gJyc7XHJcbiAgbGV0IHByaWNlTGltaXQ7XHJcbiAgbGV0IHRvdGFsSW5pdGlhbFByaWNlID0gMDtcclxuICBsZXQgdG90YWxTaW5nbGVQcmljZSA9IDA7XHJcbiAgbGV0IGZpbmFsUHJpY2UgPSAwO1xyXG5cclxuICBpZiAoY3VycmVuY3lTeW1ib2wgPT0gJ1xcdTAwQTMnKSB7XHJcbiAgICBwcmljZUxpbWl0ID0gMTE5O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwcmljZUxpbWl0ID0gMTQyO1xyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmNsZWFyKCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgY292ZXIgcHJpY2U6ICR7ZF9pbml0aWFsQ292ZXJQcmljZX1gKTtcclxuICAvL2NvbnNvbGUubG9nKGBTaW5nbGUgVHJpcCBwcmljZTogJHtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2V9YCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgY3VycmVuY3lTeW1ib2w6ICR7Y3VycmVuY3lTeW1ib2x9YCk7XHJcblxyXG4gICQoJy5wcm9kdWN0LW9wdGlvbnMtZGF5cy1jb3ZlcicpLmNoYW5nZShmdW5jdGlvbihldnQpIHtcclxuICAgIC8vIGdldCB2YWx1ZVxyXG4gICAgaW5wdXRWYWx1ZSA9IHBhcnNlSW50KGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcclxuXHJcbiAgICAvLyBoaWRlIFwiZnJvbVwiIHRleHRcclxuICAgIGlmIChpbnB1dFZhbHVlID4gMykge1xyXG4gICAgICBjb3N0UHJlZml4VGV4dC5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb3N0UHJlZml4VGV4dC5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlucHV0VmFsdWUgPiAwICYmIE51bWJlci5pc0ludGVnZXIoaW5wdXRWYWx1ZSkpIHtcclxuICAgICAgLy8gY2FsY3VsYXRlIHdpdGggaW50aXRhbCBjb3ZlciBwcmljZVxyXG4gICAgICAvLyBkX2luaXRpYWxDb3ZlclByaWNlID0gMTEuOTlcclxuICAgICAgaWYgKGlucHV0VmFsdWUgPiAwICYmIGlucHV0VmFsdWUgPD0gMykge1xyXG4gICAgICAgIHRvdGFsSW5pdGlhbFByaWNlID0gZF9pbml0aWFsQ292ZXJQcmljZTtcclxuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gdG90YWxJbml0aWFsUHJpY2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmICgoaW5wdXRWYWx1ZSA+IDMgJiYgaW5wdXRWYWx1ZSA8PSA2MCkgfHwgcHJpY2VMaW1pdCA8IGZpbmFsUHJpY2UpIHtcclxuICAgICAgaWYgKGlucHV0VmFsdWUgPiAzKSB7XHJcbiAgICAgICAgdG90YWxJbml0aWFsUHJpY2UgPSBkX2luaXRpYWxDb3ZlclByaWNlO1xyXG4gICAgICAgIC8vIGRvdWJsZSB1cCBvbiB0aGUgc3RyaW5nIHZhbHVlcyB0byB1c2UgYSB1bmFyeSBwbHVzIHRvIGNvbnZlcnQgYW5kIGhhdmUgaXQgYWRkZWQgdG8gdGhlIHByZXZpb3VzIHZhbHVlXHJcbiAgICAgICAgdG90YWxTaW5nbGVQcmljZSA9XHJcbiAgICAgICAgICArdG90YWxJbml0aWFsUHJpY2UgKyAoK2lucHV0VmFsdWUgLSAzKSAqICtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5hbFByaWNlID0gcGFyc2VGbG9hdCh0b3RhbFNpbmdsZVByaWNlKS50b0ZpeGVkKDIpO1xyXG5cclxuICAgIGlmIChpbnB1dFZhbHVlID4gMTEgJiYgaW5wdXRWYWx1ZSA8PSA2MCkge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgZmluYWxQcmljZSk7XHJcbiAgICAgIC8vIGNoYW5nZSBjb2xvciBvZiBwcmljZVxyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLmFkZENsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICAgIC8vIHNob3cgd2FybmluZyB0ZXh0XHJcbiAgICAgIHdhcm5pbmdUZXh0LnNob3coKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2Uuc2hvdygpO1xyXG4gICAgfSBlbHNlIGlmIChpbnB1dFZhbHVlID4gMyAmJiBpbnB1dFZhbHVlIDw9IDYwKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5yZW1vdmVDbGFzcygnd2FybmluZycpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcclxuICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA8PSAzKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5yZW1vdmVDbGFzcygnd2FybmluZycpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcclxuICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA+IDYwKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5hZGRDbGFzcygnd2FybmluZycpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLnNob3coKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLmhpZGUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyB0b3RhbFNpbmdsZVByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XHJcbiAgICAgIHdhcm5pbmdUZXh0LmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhgJHtpbnB1dFZhbHVlfSA9ICR7ZmluYWxQcmljZX1gKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgQ292ZXJPcHRpb25zIH07XHJcbiIsImZ1bmN0aW9uIFRvZ2dsZU5hdmlnYXRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgY3VycmVuY3kgPSAkKCcuY3VycmVuY3knKTtcclxuICBjb25zdCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcclxuICBjb25zdCBuYXZCYXJUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xyXG4gIGNvbnN0IGN1cnJlbmN5TmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWN1cnJlbmN5LXRvZ2dsZScpO1xyXG4gIGNvbnN0IGN1cnJlbmN5TWVudVRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgbmF2QmFyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XHJcbiAgY3VycmVuY3lNZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQ3VycmVuY3lNZW51KTtcclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xyXG4gICAgbWFpbk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbmN5TWVudSgpIHtcclxuICAgIGN1cnJlbmN5TmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCQod2luZG93KS53aWR0aCgpID4gJzExOTknKSB7XHJcbiAgICBjdXJyZW5jeS5zaG93KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGN1cnJlbmN5LmhpZGUoKTtcclxuICB9XHJcblxyXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAnMTE5OScpIHtcclxuICAgICAgY3VycmVuY3kuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVuY3kuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBEcm9wZG93bk1lbnUoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGNhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY2FyJyk7XHJcbiAgbGV0IGRyb3BEb3duTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi0tY2FyIC5kcm9wZG93bi1tZW51Jyk7XHJcblxyXG4gIGlmIChjYXJCdG4gIT0gbnVsbCAmJiBkcm9wRG93bk1lbnUgIT0gbnVsbCkge1xyXG4gICAgbGV0IGRyb3BEb3duID0gY2FyQnRuLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAvLyBCaW5kIGV2ZW50c1xyXG4gICAgY2FyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyQnRuSGFuZGxlcik7XHJcblxyXG4gICAgLy8gRXZlbnQgaGFuZGxlcnNcclxuICAgIGZ1bmN0aW9uIGNhckJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyB0b2dnbGUgZGlzcGxheVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnJ1xyXG4gICAgICApIHtcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID1cclxuICAgICAgICAgIGRyb3BEb3duLm9mZnNldEhlaWdodCArIGRyb3BEb3duTWVudS5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gRml4ZWROYXZpZ2F0aW9uKCkge1xyXG4gIC8vIG1ha2UgbmF2YmFyIHN0aWNreVxyXG4gIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXHJcbiAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICBteUZ1bmN0aW9uKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICBsZXQgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhcicpO1xyXG5cclxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXHJcbiAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XHJcblxyXG4gIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxyXG4gIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc3RpY2t5ID0gbmF2QmFyLm9mZnNldFRvcDtcclxuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcclxuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5hZGQoJ25hdmJhci1maXhlZC10b3AnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QucmVtb3ZlKCduYXZiYXItZml4ZWQtdG9wJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBTZWxlY3RUcmlwKCkge1xyXG4gIC8vIHNlbGVjdCB2ZWhpY2xlXHJcbiAgJCgnLnRhYi1jYXIgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gICQoJy50YWItY2FyIC5pY29uLXJhZGlvIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tY3RhLS1kaXNhYmxlZCcpO1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLmFkZENsYXNzKCdidG4tY3RhJyk7XHJcbiAgICAkKCcudGFiLWNhciAuYnRuJykudW5iaW5kKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIHNob3cgbW9iaWxlIGN1cnJlbmN5XHJcbmZ1bmN0aW9uIFJldmVhbEN1cnJlbmN5KCkge1xyXG4gICQoJy5jdXJyZW5jeS1tb2JpbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDdXJyZW5jeScpO1xyXG5cclxuICAgICQoJy5jdXJyZW5jeScpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbixcclxuICBEcm9wZG93bk1lbnUsXHJcbiAgRml4ZWROYXZpZ2F0aW9uLFxyXG4gIFNlbGVjdFRyaXAsXHJcbiAgUmV2ZWFsQ3VycmVuY3lcclxufTtcclxuIiwiZnVuY3Rpb24gUG9saWN5U3VtbWFyeSgpIHtcclxuICAvLyBwb2xpY3kgc3VtbWFyeVxyXG4gICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gc2hvdyBwb2xpY3kgc3VtbWFyeVxyXG4gICAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgcG9saWN5U3VtbWFyeSA9ICQodGhpcykuZGF0YSgncG9saWN5Jyk7XHJcbiAgICAkKCcuJyArIHBvbGljeVN1bW1hcnkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBQb2xpY3lTdW1tYXJ5IH07XHJcbiIsIi8vIG1vZHVsZSBSZXZlYWxEb2NzLmpzXHJcblxyXG5mdW5jdGlvbiBSZXZlYWxEb2NzKCkge1xyXG4gIC8vRG9jc1xyXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IG9uID0gJCgnLmRvY3MnKS5pcygnOnZpc2libGUnKTtcclxuICAgICQodGhpcykuaHRtbChcclxuICAgICAgb24gPyAnVmlldyBwb2xpY3kgZG9jdW1lbnRhdGlvbicgOiAnSGlkZSBwb2xpY3kgZG9jdW1lbnRhdGlvbidcclxuICAgICk7XHJcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJldmVhbERvY3MgfTtcclxuIiwiLy8gbW9kdWxlIFwiU2NyZWVuLmpzXCJcclxuXHJcbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xyXG4gIHZhciBzY3JvbGxTdGVwID0gLXdpbmRvdy5zY3JvbGxZIC8gKHNjcm9sbER1cmF0aW9uIC8gMTUpLFxyXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgc2Nyb2xsU3RlcCk7XHJcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcclxuICAgIH0sIDE1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xyXG4gIGNvbnN0IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMjtcclxuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxyXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XHJcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xyXG4gICAgaWYgKHNjcm9sbENvdW50ID49IE1hdGguUEkpIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcclxuICAgICk7XHJcbiAgICBvbGRUaW1lc3RhbXAgPSBuZXdUaW1lc3RhbXA7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxufVxyXG4vKlxyXG4gIEV4cGxhbmF0aW9uczpcclxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxyXG4gIC0gbmV3VGltZXN0YW1wIGluZGljYXRlcyB0aGUgY3VycmVudCB0aW1lIHdoZW4gY2FsbGJhY2tzIHF1ZXVlZCBieSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmVnaW4gdG8gZmlyZS5cclxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxyXG5cclxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXHJcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXHJcbiAgPSBhICogY29zIChieCkgKyAxICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEgc3RyZXRjaGVzIGFsb25nIHRoZSB5IGF4aXMgPSBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDJcclxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXHJcbiovXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcclxuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBiYWNrVG9Ub3BCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KDEwMDApO1xyXG5cclxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXaW5kb3dXaWR0aCgpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBhY2NvcmRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcuY2FyZC1wcm9kdWN0cyAuYWNjb3JkaW9uLWJ0bidcclxuICApO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgdyA9XHJcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgaWYgKHcgPiAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHcgPD0gMTIwMCkge1xyXG4gICAgICBsZXQgaTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfTtcclxuIiwiLy8gbW9kdWxlIFwiU2Nyb2xsVG8uanNcIlxyXG5cclxuZnVuY3Rpb24gU2Nyb2xsVG8oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgLy8gU2VsZWN0IGFsbCBsaW5rcyB3aXRoIGhhc2hlc1xyXG4gIC8vIFJlbW92ZSBsaW5rcyB0aGF0IGRvbid0IGFjdHVhbGx5IGxpbmsgdG8gYW55dGhpbmdcclxuICBsZXQgYW5jaG9ycyA9ICQoJ2FbaHJlZio9XCIjXCJdJylcclxuICAgIC5ub3QoJ1tocmVmPVwiI1wiXScpXHJcbiAgICAubm90KCdbaHJlZj1cIiMwXCJdJyk7XHJcblxyXG4gIGxldCBoZWlnaHRDb21wZW5zYXRpb24gPSA2MDtcclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGFuY2hvcnMuY2xpY2soYW5jaG9yc0hhbmRsZXIpO1xyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGFuY2hvcnNIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAvLyBPbi1wYWdlIGxpbmtzXHJcbiAgICBpZiAoXHJcbiAgICAgIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgPT1cclxuICAgICAgICB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgJiZcclxuICAgICAgbG9jYXRpb24uaG9zdG5hbWUgPT0gdGhpcy5ob3N0bmFtZVxyXG4gICAgKSB7XHJcbiAgICAgIC8vIEZpZ3VyZSBvdXQgZWxlbWVudCB0byBzY3JvbGwgdG9cclxuICAgICAgbGV0IHRhcmdldCA9ICQodGhpcy5oYXNoKTtcclxuICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xyXG4gICAgICAvLyBEb2VzIGEgc2Nyb2xsIHRhcmdldCBleGlzdD9cclxuICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAvLyBPbmx5IHByZXZlbnQgZGVmYXVsdCBpZiBhbmltYXRpb24gaXMgYWN0dWFsbHkgZ29ubmEgaGFwcGVuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZShcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gaGVpZ2h0Q29tcGVuc2F0aW9uXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgMTAwMCxcclxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBDYWxsYmFjayBhZnRlciBhbmltYXRpb25cclxuICAgICAgICAgICAgLy8gTXVzdCBjaGFuZ2UgZm9jdXMhXHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCc6Zm9jdXMnKSkge1xyXG4gICAgICAgICAgICAgIC8vIENoZWNraW5nIGlmIHRoZSB0YXJnZXQgd2FzIGZvY3VzZWRcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpOyAvLyBBZGRpbmcgdGFiaW5kZXggZm9yIGVsZW1lbnRzIG5vdCBmb2N1c2FibGVcclxuICAgICAgICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7IC8vIFNldCBmb2N1cyBhZ2FpblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gb24gc2Nyb2xsXHJcbmlmICgkKCcuYXJ0aWNsZS1tYWluJykubGVuZ3RoID4gMCkge1xyXG4gIGxldCB0YXJnZXQgPSAkKCcuYXJ0aWNsZS1tYWluJykub2Zmc2V0KCkudG9wIC0gMTgwO1xyXG4gICQoZG9jdW1lbnQpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XHJcbiAgICAgICQoJy5zaGFyZS1idXR0b25zJykuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFNjcm9sbFRvIH07XHJcbiIsImZ1bmN0aW9uIFJlYWR5KGZuKSB7XHJcbiAgaWYgKFxyXG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnRcclxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXHJcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXHJcbiAgKSB7XHJcbiAgICBmbigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgUmVhZHkgfTtcclxuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBjYXJUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX2NhcicpO1xyXG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xyXG4gICAgY2FyVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xyXG4gICAgdmFuVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcclxuICAgIHZhciBpLCB4LCB0YWJCdXR0b25zO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGV2dCk7XHJcblxyXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXHJcbiAgICB4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1jb250YWluZXIgLnRhYicpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXHJcbiAgICB0YWJCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi10YWJzIC5uYXYtbGluaycpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxyXG4gICAgLy8gc2hvdyB0aGUgc2VsZWN0ZWQgdGFiIGNvbnRlbnRcclxuICAgIGxldCB2ZWhpY2xlID0gZXZ0LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZlaGljbGUnKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItJyArIHZlaGljbGUpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFZlaGljbGVTZWxlY3RvciB9O1xyXG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tIFwidXRpbFwiO1xyXG5cclxuLy8gbW9kdWxlIFwiTG9hZEZBUXMuanNcIlxyXG5cclxuZnVuY3Rpb24gTG9hZEZBUXMoKSB7XHJcbiAgLy8gbG9hZCBmYXFzXHJcbiAgJCgnI2ZhcVRhYnMgYScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQodGhpcykudGFiKCdzaG93Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGxvYWQgZmFxc1xyXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBmYXFzIHBhZ2VcclxuICBpZiAoJCgnI2ZhcXMnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgdXJsOiAnL2FwaS9mYXFzLmpzb24nLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihmYXFzKSB7XHJcbiAgICAgICAgLy8gZ2V0IHRoZSBoZWFkc1xyXG4gICAgICAgICQuZWFjaChmYXFzLCBmdW5jdGlvbihpbmRleCwgZmFxKSB7XHJcbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIGRlc2t0b3BcclxuICAgICAgICAgICQoYGFbaHJlZj0nIyR7ZmFxLmlkfSddYClcclxuICAgICAgICAgICAgLmZpbmQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAudGV4dChmYXEudGl0bGUpO1xyXG5cclxuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgbW9iaWxlXHJcbiAgICAgICAgICAkKGAjJHtmYXEuaWR9YClcclxuICAgICAgICAgICAgLmZpbmQoJ2gzJylcclxuICAgICAgICAgICAgLnRleHQoZmFxLnNob3J0VGl0bGUpO1xyXG5cclxuICAgICAgICAgIC8vIGdldCB0aGUgYm9keVxyXG4gICAgICAgICAgJC5lYWNoKGZhcS5xYXMsIGZ1bmN0aW9uKGZJbmRleCwgcWEpIHtcclxuICAgICAgICAgICAgJCgnLmlubmVyIC5hY2NvcmRpb24nLCBgIyR7ZmFxLmlkfWApLmFwcGVuZChcclxuICAgICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke3FhLnF1ZXN0aW9ufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgJHtxYS5hbnN3ZXJ9XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7IC8vICRhamF4XHJcblxyXG4gICAgJCgnLmZhcS1hbnN3ZXJzIC5pbm5lciAuYWNjb3JkaW9uJykuZGVsZWdhdGUoXHJcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXHJcbiAgICAgICdjbGljaycsXHJcbiAgICAgIGZhcXNIYW5kbGVyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgbG9hZFByb2R1Y3RQYWdlRkFRcygpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZFByb2R1Y3RQYWdlRkFRcygpIHtcclxuICAvLyBvbmx5IGxvYWQgaWYgb24gcHJvZHVjdCBwYWdlXHJcbiAgaWYgKCQoJy5wcm9kdWN0LWZhcXMnKS5sZW5ndGggPiAwKSB7XHJcbiAgICBsZXQgZmlsZSA9ICQoJy5wcm9kdWN0LWZhcXMnKVxyXG4gICAgICAuZGF0YSgnZmFxcycpXHJcbiAgICAgIC5yZXBsYWNlKCcmLScsICcnKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCk7XHJcblxyXG4gICAgLy8kLmFqYXgoe1xyXG4gICAgLy8gIHR5cGU6ICdHRVQnLFxyXG4gICAgLy8gIHVybDogYC9hcGkvJHtmaWxlfS1mYXFzLmpzb25gLFxyXG4gICAgLy8gIHN1Y2Nlc3M6IHVwZGF0ZVVJU3VjY2VzcyxcclxuICAgIC8vICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnJvcikge1xyXG4gICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XHJcbiAgICAvLyAgfVxyXG4gICAgLy99KTsgLy8gJGFqYXhcclxuXHJcbiAgICBmZXRjaChgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICByZXR1cm4gKHJlc3BvbnNlLmpzb24oKSk7XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICB1cGRhdGVVSVN1Y2Nlc3MocmVzcG9uc2UpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgIHVwZGF0ZVVJRmFpbHVyZShlcnJvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcclxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcclxuICAgICAgJ2NsaWNrJyxcclxuICAgICAgZmFxc0hhbmRsZXJcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVUlTdWNjZXNzKGZhcXMpIHtcclxuICAvLyBnZXQgdGhlIGJvZHlcclxuICAkLmVhY2goZmFxcywgZnVuY3Rpb24gKGZJbmRleCwgZmFxKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKGAjJHtmYXEuaWR9YCk7XHJcbiAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicpLmFwcGVuZChcclxuICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtmYXEucXVlc3Rpb259PC9idXR0b24+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAke2ZhcS5hbnN3ZXJ9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgYFxyXG4gICAgKTtcclxuICB9KTtcclxuXHJcbiAgLy8gc2hvdyBjb250ZW50XHJcbiAgJCgnLmZhcS1hbnN3ZXJzLXByb2R1Y3QnKS5zaG93KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVVJRmFpbHVyZShlcnJvcikge1xyXG4gIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIsIGVycm9yKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmFxc0hhbmRsZXIoZXZ0KSB7XHJcbiAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcclxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXHJcbiAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXHJcbiAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gIH1cclxufVxyXG5leHBvcnQgeyBMb2FkRkFRcyB9O1xyXG4iLCJpbXBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfSBmcm9tICcuL2NvbXBvbmVudHMvU2NyZWVuJztcclxuaW1wb3J0IHsgQWNjb3JkaW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbic7XHJcbi8vIGltcG9ydCB7IENvdW50cnlTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3InO1xyXG5pbXBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yJztcclxuaW1wb3J0IHtcclxuICBUb2dnbGVOYXZpZ2F0aW9uLFxyXG4gIERyb3Bkb3duTWVudSxcclxuICBGaXhlZE5hdmlnYXRpb24sXHJcbiAgU2VsZWN0VHJpcCxcclxuICBSZXZlYWxDdXJyZW5jeVxyXG59IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgU2Nyb2xsVG8gfSBmcm9tICcuL2NvbXBvbmVudHMvU2Nyb2xsVG8nO1xyXG4vLyBpbXBvcnQgeyBBdXRvQ29tcGxldGUgfSBmcm9tICcuL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlJztcclxuaW1wb3J0IHsgTG9hZEZBUXMgfSBmcm9tICcuL2NvbXBvbmVudHMvZmFxcyc7XHJcbmltcG9ydCB7IFJldmVhbERvY3MgfSBmcm9tICcuL2NvbXBvbmVudHMvUmV2ZWFsRG9jcyc7XHJcbmltcG9ydCB7IENvdmVyT3B0aW9ucyB9IGZyb20gJy4vY29tcG9uZW50cy9Db3Zlck9wdGlvbnMnO1xyXG5pbXBvcnQgeyBSZWFkeSB9IGZyb20gJy4vY29tcG9uZW50cy9VdGlscyc7XHJcbmltcG9ydCB7IFBvbGljeVN1bW1hcnkgfSBmcm9tICcuL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeSc7XHJcbi8vIGltcG9ydCB7IGxvZyB9IGZyb20gJ3V0aWwnO1xyXG4vLyBpbXBvcnQgeyBMYXp5TG9hZCB9IGZyb20gJy4vY29tcG9uZW50cy9MYXp5TG9hZCc7XHJcblxyXG5sZXQgY291bnRyaWVzQ292ZXJlZCA9IG51bGw7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICAvLyBDb3VudHJ5U2VsZWN0b3IoKTtcclxuICBWZWhpY2xlU2VsZWN0b3IoKTtcclxuICBUb2dnbGVOYXZpZ2F0aW9uKCk7XHJcbiAgRHJvcGRvd25NZW51KCk7XHJcbiAgU2Nyb2xsVG9Ub3AoKTtcclxuICBGaXhlZE5hdmlnYXRpb24oKTtcclxuICBBY2NvcmRpb24oKTtcclxuICBXaW5kb3dXaWR0aCgpO1xyXG4gIFNjcm9sbFRvKCk7XHJcblxyXG4gIC8vY29uc29sZS5sb2coYGNvdW50cmllc0NvdmVyZWQ6ICR7Y291bnRyaWVzQ292ZXJlZH1gKTtcclxuICAvL2lmIChjb3VudHJpZXNDb3ZlcmVkICE9IG51bGwpIHtcclxuICAvLyAgQXV0b0NvbXBsZXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteUlucHV0JyksIGNvdW50cmllc0NvdmVyZWQpO1xyXG4gIC8vfVxyXG4gIExvYWRGQVFzKCk7XHJcbiAgUmV2ZWFsRG9jcygpO1xyXG4gIENvdmVyT3B0aW9ucygpO1xyXG4gIFBvbGljeVN1bW1hcnkoKTtcclxuICBTZWxlY3RUcmlwKCk7XHJcbiAgUmV2ZWFsQ3VycmVuY3koKTtcclxuICAvLyBMYXp5TG9hZCgpO1xyXG59XHJcblxyXG5SZWFkeShzdGFydCk7XHJcbiJdfQ==
>>>>>>> chore: update files
