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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accordion = Accordion;

var _PubSub = require("./PubSub");

// module "Accordion.js"
function Accordion() {
  // cache DOM
  var acc = document.querySelectorAll('.accordion-btn'); // Bind Events

  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordionHandler);
  } // Event Handlers


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
    } // tell the parent accordion to adjust its height


    _PubSub.events.emit('heightChanged', panel.style.maxHeight);
  }
}

},{"./PubSub":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoComplete = AutoComplete;

// module "AutoComplete.js"

/**
 * [AutoComplete description]
 *
 * @param   {string}  userInput  user input
 * @param   {array}  searchList  search list
 *
 * @return  {[type]}       [return description]
 */
function AutoComplete(inp, arr) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/

  inp.addEventListener('input', function (e) {
    var a,
        b,
        i,
        val = this.value;
    /*close any already open lists of autocompleted values*/

    closeAllLists();

    if (!val) {
      return false;
    }

    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/

    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    /*append the DIV element as a child of the autocomplete container:*/

    this.parentNode.appendChild(a);
    /*for each item in the array...*/

    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement('DIV');
        /*make the matching letters bold:*/

        b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/

        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/

        b.addEventListener('click', function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName('input')[0].value;
          /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/

          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/

  inp.addEventListener('keydown', function (e) {
    var x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');

    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/

      addActive(x);
    } else if (e.keyCode == 38) {
      //up

      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/

      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();

      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/

    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/

    x[currentFocus].classList.add('autocomplete-active');
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName('autocomplete-items');

    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/


  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
  });
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CountrySelector = CountrySelector;

function CountrySelector() {
  // cache DOM
  var up = document.querySelector('.country-scroller__up');
  var down = document.querySelector('.country-scroller__down');
  var items = document.querySelector('.country-scroller__items');
  var itemHeight = items != null ? items.firstChild.nextSibling.offsetHeight : 0; // bind events

  if (up != null) {
    // event handlers
    var scrollUp = function scrollUp() {
      // move items list up by height of li element
      items.scrollTop += itemHeight;
    };

    var scrollDown = function scrollDown() {
      // move items list down by height of li element
      items.scrollTop -= itemHeight;
    };

    up.addEventListener('click', scrollUp);
    down.addEventListener('click', scrollDown);
  }
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoverOptions = CoverOptions;

// module CoverOptions.js
function CoverOptions() {
  // cache DOM
  var costPrefixText = $('.js-cost-prefix');
  var warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
  var warningText60 = $('.card-cover-option:nth-of-type(1) .warning-text-60');
  var coverOptionPrice = $('.card-cover-option:nth-of-type(1) .card-price'); // Get single trip price

  var initialCoverPrice = $('.card-cover-option:nth-of-type(1) .amount');
  var d_initialCoverPrice = parseFloat(initialCoverPrice.text().replace(/\D*/, '')).toFixed(2);
  var initialSingleTripPrice = $('.initial-single-trip-price');
  var d_initialSingleTripPrice = parseFloat(initialSingleTripPrice.text().replace(/\D*/, '')).toFixed(2);
  var currencySymbol = initialCoverPrice.text().substring(0, 1);
  var inputValue = '';
  var priceLimit;
  var totalInitialPrice = 0;
  var totalSinglePrice = 0;
  var finalPrice = 0;

  if (currencySymbol == "\xA3") {
    priceLimit = 119;
  } else {
    priceLimit = 142;
  } //console.clear();
  //console.log(`cover price: ${d_initialCoverPrice}`);
  //console.log(`Single Trip price: ${d_initialSingleTripPrice}`);
  //console.log(`currencySymbol: ${currencySymbol}`);


  $('.product-options-days-cover').change(function (evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value); // hide "from" text

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
      } // if ((inputValue > 3 && inputValue <= 60) || priceLimit < finalPrice) {


      if (inputValue > 3) {
        totalInitialPrice = d_initialCoverPrice; // double up on the string values to use a unary plus to convert and have it added to the previous value

        totalSinglePrice = +totalInitialPrice + (+inputValue - 3) * +d_initialSingleTripPrice;
      }
    }

    finalPrice = parseFloat(totalSinglePrice).toFixed(2);

    if (inputValue > 11 && inputValue <= 60) {
      initialCoverPrice.text(currencySymbol + finalPrice); // change color of price

      coverOptionPrice.addClass('warning'); // show warning text

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
    } //console.log(`${inputValue} = ${finalPrice}`);

  });
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleNavigation = ToggleNavigation;
exports.DropdownMenu = DropdownMenu;
exports.FixedNavigation = FixedNavigation;
exports.SelectTrip = SelectTrip;
exports.RevealCurrency = RevealCurrency;

function ToggleNavigation() {
  // cache DOM
  var currency = $('.currency');
  var mainNav = document.getElementById('js-menu');
  var navBarToggle = document.getElementById('js-navbar-toggle');
  var currencyNav = document.getElementById('js-currency-toggle');
  var currencyMenuToggle = document.getElementById('js-navbar-toggle'); // bind events

  navBarToggle.addEventListener('click', toggleMenu);
  currencyMenuToggle.addEventListener('click', toggleCurrencyMenu); // event handlers

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
      evt.stopPropagation(); // toggle display

      if (dropDownMenu.style.display === 'none' || dropDownMenu.style.display === '') {
        dropDownMenu.style.display = 'block';
        dropDown.style.height = dropDown.offsetHeight + dropDownMenu.offsetHeight + 'px';
      } else {
        dropDownMenu.style.display = 'none';
        dropDown.style.height = 'auto';
      }
    };

    var dropDown = carBtn.parentElement; // Bind events

    carBtn.addEventListener('click', carBtnHandler);
  }
}

function FixedNavigation() {
  // make navbar sticky
  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    myFunction();
  }; // Get the header


  var navBar = document.querySelector('.navbar'); // Get the offset position of the navbar

  var sticky = navBar.offsetTop; // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position

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
} // show mobile currency


function RevealCurrency() {
  $('.currency-mobile').on('click', function () {
    console.log('Currency');
    $('.currency').slideToggle();
  });
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolicySummaryDeviceResize = PolicySummaryDeviceResize;
exports.PolicySummaryMobile = PolicySummaryMobile;
exports.PolicySummaryDesktop = PolicySummaryDesktop;

var _PubSub = require("./PubSub");

Array.prototype.forEach = function (callback, thisArg) {
  thisArg = thisArg || window;

  for (var i = 0; i < this.length; i++) {
    callback.call(thisArg, this[i], i, this);
  }
};

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
} // module "PolicySummary.js"
// module "PolicySummaryAccordion.js"


function DesktopDeviceSetup() {
  $('.policy-summary .info-box').each(function (index, element) {
    if (index === 0) {
      return true;
    }

    $(element).css('display', 'none');
  }); // remove the active class from all

  $('.card-cover-option').each(function (index, element) {
    $(element).removeClass('active');
  });
  $('.card-cover-option:nth-child(2)').addClass('active'); // show policy info

  $('.card-cover-option .policy-info').each(function (index, element) {
    $(element).css('display', 'block');
  }); // reset policy summary

  $('.policy-summary-info').each(function (index, element) {
    $(element).css('display', 'none');
  });
  $('.policy-summary-info:first-child').css('display', 'block'); // remove mobile event listener

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
  }); // reset policy summary

  $('.policy-summary-info').each(function (index, element) {
    $(element).css('display', 'none');
  }); // remove desktop event listener

  $('.card-cover-option').unbind(); // setup Mobile

  PolicySummaryMobile();
} // device reset ON browser width


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
  } // Cache DOM


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
  var activeCardOption = ''; // Bind Events

  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordionHandler);
  } // Event Handlers


  function accordionHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation(); // console.log(evt.currentTarget);
    // hide the other options

    evt.currentTarget.classList.remove('active'); // remove navbar-fixed-top

    evt.currentTarget.parentNode.parentNode.classList.remove('navbar-fixed-top'); // more information button has been clicked

    if (activeCardOption === 'selected') {
      // console.log('Close');
      evt.currentTarget.innerText = 'More information'; // remove active border

      for (var _i = 0; _i < cardCoverOption.length; _i++) {
        cardCoverOption[_i].classList.remove('active');

        cardCoverOption[_i].style.display = 'block';
      } // hide policy-info


      document.querySelectorAll('.card-cover-option[data-policy^="policy-summary-"] .policy-info').forEach(function (element) {
        element.style.display = 'none';
      }); // hide all policy-summary-info blocks

      policySummaryInfo.forEach(function (element) {
        // console.log(element);
        element.style.display = 'none';
      });
      activeCardOption = '';
    } else {
      // console.log('Open');
      evt.currentTarget.innerText = 'View other options'; // move more information arrow

      evt.currentTarget.classList.add('active');
      /* highlight the card that's been selected */

      evt.currentTarget.parentNode.parentNode.parentNode.parentNode.classList.add('active'); // get policy reference

      policyReference = document.querySelector('.card-cover-option.active').dataset.policy; // show only the product summary info that has an active product cover option

      for (var _i2 = 0; _i2 < cardCoverOption.length; _i2++) {
        if (cardCoverOption[_i2].getAttribute('class').indexOf('active') < 0) {
          cardCoverOption[_i2].style.display = 'none';
        } else {
          cardCoverOption[_i2].style.display = 'block';
        }
      } // show the cover option info text


      document.querySelector('.card-cover-option[data-policy="' + policyReference + '"] .policy-info').style.display = 'block';
      activeCardOption = 'selected'; // hide all policy-summary-info blocks

      policySummaryInfo.forEach(function (element) {
        element.style.display = 'none';
      }); // get the policy summary info panel associcated with this product using the policyReference

      var panel = document.querySelector('.policy-summary-info.' + policyReference);
      panel.style.display = 'block';

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.style.marginTop = '0';
        panel.style.marginBottom = '0';
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.marginTop = '-11px';
        panel.style.marginBottom = '18px';
      }

      _PubSub.events.on('heightChanged', function (newHeight) {
        var newTotal = parseInt(panel.style.maxHeight.substring(0, panel.style.maxHeight.length - 2)) + parseInt(newHeight.substring(0, newHeight.length - 2)) + 'px';
        panel.style.maxHeight = newTotal;
      });
    }
  } // accordionHandler


  window.addEventListener("touchstart", handleStart, false);

  function handleStart(evt) {
    evt.preventDefault();
    console.log('touch event');
    evt.stopPropagation();
  }

  window.addEventListener("touchend", handleEnd, false);

  function handleEnd(evt) {
    evt.preventDefault();
    console.log('touch event');
    evt.stopPropagation();
  }

  window.addEventListener("touchcancel", handleCancel, false);

  function handleCancel(evt) {
    evt.preventDefault();
    console.log('touch event');
    evt.stopPropagation();
  }

  window.addEventListener("touchmove", handleMove, false);

  function handleMove(evt) {
    evt.preventDefault();
    console.log('touch event');
    evt.stopPropagation();
  }
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
    evt.currentTarget.classList.add('active'); // show policy summary

    $('.policy-summary .info-box').each(function (index, element) {
      $(element).css('display', 'none');
    });
    var policySummary = $(this).data('policy');
    $('.' + policySummary).css('display', 'block');
  });
} // PolicySummaryDesktop

},{"./PubSub":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = void 0;
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

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RevealDocs = RevealDocs;

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

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollToTop = ScrollToTop;
exports.WindowWidth = WindowWidth;
exports.Sticky = Sticky;

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
  var backToTopBtn = document.querySelector('.js-back-to-top'); // Bind Events

  if (backToTopBtn != null) {
    backToTopBtn.addEventListener('click', backToTopBtnHandler);
  } // Event Handlers


  function backToTopBtnHandler(evt) {
    // Animate the scroll to top
    evt.preventDefault();

    _scrollToTopEaseInEaseOut(1000); // $('html, body').animate({ scrollTop: 0 }, 300);

  }
}

function WindowWidth() {
  // cache DOM
  var accordionBtns = document.querySelectorAll('.card-products .accordion-btn');
  window.addEventListener('resize', function () {
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (w > 1200) {
      var i;

      for (i = 0; i < accordionBtns.length; i++) {
        accordionBtns[i].setAttribute('disabled', true);
      }
    }

    if (w <= 1200) {
      var _i;

      for (_i = 0; _i < accordionBtns.length; _i++) {
        accordionBtns[_i].removeAttribute('disabled');
      }
    }
  });
}

function Sticky() {
  console.log('Sticky');
  window.addEventListener('scroll', function (evt) {
    evt.preventDefault();

    if (document.querySelector('.more-information.active')) {
      console.log('checking');
      var moreInfoBtn = document.querySelector('.more-information.active');
      var sticky = moreInfoBtn.offsetTop;

      if (window.pageYOffset > sticky) {
        moreInfoBtn.parentNode.parentNode.classList.add("navbar-fixed-top");
      } else {
        moreInfoBtn.parentNode.parentNode.classList.remove("navbar-fixed-top");
      }
    }
  });
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollTo = ScrollTo;

// module "ScrollTo.js"
function ScrollTo() {
  // cache DOM
  // Select all links with hashes
  // Remove links that don't actually link to anything
  var anchors = $('a[href*="#"]').not('[href="#"]').not('[href="#0"]');
  var heightCompensation = 60; // Bind Events

  anchors.click(anchorsHandler); // Event Handlers

  function anchorsHandler(event) {
    // On-page links
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']'); // Does a scroll target exist?

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
} // on scroll


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

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ready = Ready;

function Ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VehicleSelector = VehicleSelector;

function VehicleSelector() {
  // cache DOM
  var carTab = document.querySelector('.nav-link__car');
  var vanTab = document.querySelector('.nav-link__van'); // bind events

  if (carTab != null && vanTab != null) {
    carTab.addEventListener('click', openVehicle);
    vanTab.addEventListener('click', openVehicle);
  } // event handlers


  function openVehicle(evt) {
    var i, x, tabButtons;
    console.log(evt); // hide all tab contents

    x = document.querySelectorAll('.tab-container .tab');

    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    } // remove the highlight on the tab button


    tabButtons = document.querySelectorAll('.nav-tabs .nav-link');

    for (i = 0; i < x.length; i++) {
      tabButtons[i].className = tabButtons[i].className.replace(' active', '');
    } // highlight tab button and
    // show the selected tab content


    var vehicle = evt.currentTarget.getAttribute('data-vehicle');
    document.querySelector('.tab-' + vehicle).style.display = 'block';
    evt.currentTarget.className += ' active';
  }
}

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadFAQs = LoadFAQs;

var _util = require("util");

// module "LoadFAQs.js"
function LoadFAQs() {
  // load faqs
  $('#faqTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  }); // load faqs
  // only load if on faqs page

  if ($('#faqs').length > 0) {
    $.ajax({
      type: 'GET',
      url: '/api/faqs.json',
      success: function success(faqs) {
        // get the heads
        $.each(faqs, function (index, faq) {
          // add title for desktop
          $("a[href='#".concat(faq.id, "']")).find('span').text(faq.title); // add title for mobile

          $("#".concat(faq.id)).find('h3').text(faq.shortTitle); // get the body

          $.each(faq.qas, function (fIndex, qa) {
            $('.inner .accordion', "#".concat(faq.id)).append("<button class=\"accordion-btn h4\">".concat(qa.question, "</button>\n               <div class=\"accordion-panel\">\n                 <div class=\"inner\">\n                 ").concat(qa.answer, "\n                 </div>\n               </div>\n              "));
          });
        });
      },
      error: function error(xhr, status, _error) {//console.log('error: ', error);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', faqsHandler);
  }

  loadProductPageFAQs();
}

function loadProductPageFAQs() {
  // only load if on product page
  if ($('.product-faqs').length > 0) {
    var file = $('.product-faqs').data('faqs').replace('&-', ''); //console.log(`/api/${file}-faqs.json`);
    //$.ajax({
    //  type: 'GET',
    //  url: `/api/${file}-faqs.json`,
    //  success: updateUISuccess,
    //  error: function (xhr, status, error) {
    //    console.log('error: ', error);
    //  }
    //}); // $ajax

    fetch("/api/".concat(file, "-faqs.json")).then(function (response) {
      //console.log(response);
      return response.json();
    }).then(function (response) {
      updateUISuccess(response);
    })["catch"](function (error) {
      updateUIFailure(error);
    });
    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', faqsHandler);
  }
}

function updateUISuccess(faqs) {
  // get the body
  $.each(faqs, function (fIndex, faq) {
    //console.log(`#${faq.id}`);
    $('.inner .accordion').append("<button class=\"accordion-btn h4\">".concat(faq.question, "</button>\n            <div class=\"accordion-panel\">\n              <div class=\"inner\">\n              ").concat(faq.answer, "\n              </div>\n            </div>\n          "));
  }); // show content

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

},{"util":2}],18:[function(require,module,exports){
"use strict";

var _Screen = require("./components/Screen");

var _Accordion = require("./components/Accordion");

var _CountrySelector = require("./components/CountrySelector");

var _VehicleSelector = require("./components/VehicleSelector");

var _Navigation = require("./components/Navigation");

var _ScrollTo = require("./components/ScrollTo");

var _AutoComplete = require("./components/AutoComplete");

var _faqs = require("./components/faqs");

var _RevealDocs = require("./components/RevealDocs");

var _CoverOptions = require("./components/CoverOptions");

var _Utils = require("./components/Utils");

var _PolicySummary = require("./components/PolicySummary");

var _util = require("util");

var countriesCovered = null;

function start() {
  // CountrySelector();
  (0, _VehicleSelector.VehicleSelector)();
  (0, _Navigation.ToggleNavigation)();
  (0, _Navigation.DropdownMenu)();
  (0, _Screen.ScrollToTop)();
  (0, _Navigation.FixedNavigation)();
  (0, _Accordion.Accordion)();
  (0, _Screen.WindowWidth)();
  (0, _ScrollTo.ScrollTo)(); // console.log(`countriesCovered: ${countriesCovered}`);
  // if (countriesCovered != null) {
  //   AutoComplete(document.getElementById('myInput'), countriesCovered);
  // }

  (0, _faqs.LoadFAQs)();
  (0, _RevealDocs.RevealDocs)();
  (0, _CoverOptions.CoverOptions)(); // PolicySummaryMobile();
  // PolicySummaryDesktop();

  (0, _PolicySummary.PolicySummaryDeviceResize)();
  (0, _Navigation.SelectTrip)();
  (0, _Navigation.RevealCurrency)(); // LazyLoad();
}

(0, _Utils.Ready)(start);

},{"./components/Accordion":5,"./components/AutoComplete":6,"./components/CountrySelector":7,"./components/CoverOptions":8,"./components/Navigation":9,"./components/PolicySummary":10,"./components/RevealDocs":12,"./components/Screen":13,"./components/ScrollTo":14,"./components/Utils":15,"./components/VehicleSelector":16,"./components/faqs":17,"util":2}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvTmF2aWdhdGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUHViU3ViLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUMsS0FBTixDQUFZLFNBQVosR0FBd0IsS0FBSyxDQUFDLFlBQU4sR0FBcUIsSUFBN0M7QUFDQSxJQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBWixHQUF3QixPQUF4QjtBQUNBLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLE1BQTNCO0FBQ0Q7QUFDRjs7Ozs7QUN2SUQ7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBRUEsSUFBSSxnQkFBZ0IsR0FBRyxJQUF2Qjs7QUFFQSxTQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBVGUsQ0FXZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBbEJlLENBbUJmO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBLG9DQXZCZSxDQXdCZjtBQUNEOztBQUVELGtCQUFNLEtBQU4iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9QdWJTdWInO1xyXG5cclxuLy8gbW9kdWxlIFwiQWNjb3JkaW9uLmpzXCJcclxuXHJcbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBsZXQgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIC8vIEV2ZW50IEhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcclxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXHJcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cclxuICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRlbGwgdGhlIHBhcmVudCBhY2NvcmRpb24gdG8gYWRqdXN0IGl0cyBoZWlnaHRcclxuICAgIGV2ZW50cy5lbWl0KCdoZWlnaHRDaGFuZ2VkJywgcGFuZWwuc3R5bGUubWF4SGVpZ2h0KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IHsgQWNjb3JkaW9uIH07XHJcbiIsIi8vIG1vZHVsZSBcIkF1dG9Db21wbGV0ZS5qc1wiXHJcblxyXG4vKipcclxuICogW0F1dG9Db21wbGV0ZSBkZXNjcmlwdGlvbl1cclxuICpcclxuICogQHBhcmFtICAge3N0cmluZ30gIHVzZXJJbnB1dCAgdXNlciBpbnB1dFxyXG4gKiBAcGFyYW0gICB7YXJyYXl9ICBzZWFyY2hMaXN0ICBzZWFyY2ggbGlzdFxyXG4gKlxyXG4gKiBAcmV0dXJuICB7W3R5cGVdfSAgICAgICBbcmV0dXJuIGRlc2NyaXB0aW9uXVxyXG4gKi9cclxuZnVuY3Rpb24gQXV0b0NvbXBsZXRlKGlucCwgYXJyKSB7XHJcbiAgdmFyIGN1cnJlbnRGb2N1cztcclxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgd3JpdGVzIGluIHRoZSB0ZXh0IGZpZWxkOiovXHJcbiAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGEsXHJcbiAgICAgIGIsXHJcbiAgICAgIGksXHJcbiAgICAgIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAvKmNsb3NlIGFueSBhbHJlYWR5IG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXMqL1xyXG4gICAgY2xvc2VBbGxMaXN0cygpO1xyXG4gICAgaWYgKCF2YWwpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY3VycmVudEZvY3VzID0gLTE7XHJcbiAgICAvKmNyZWF0ZSBhIERJViBlbGVtZW50IHRoYXQgd2lsbCBjb250YWluIHRoZSBpdGVtcyAodmFsdWVzKToqL1xyXG4gICAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgYS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCArICdhdXRvY29tcGxldGUtbGlzdCcpO1xyXG4gICAgYS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xyXG4gICAgLyphcHBlbmQgdGhlIERJViBlbGVtZW50IGFzIGEgY2hpbGQgb2YgdGhlIGF1dG9jb21wbGV0ZSBjb250YWluZXI6Ki9cclxuICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChhKTtcclxuICAgIC8qZm9yIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkuLi4qL1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvKmNoZWNrIGlmIHRoZSBpdGVtIHN0YXJ0cyB3aXRoIHRoZSBzYW1lIGxldHRlcnMgYXMgdGhlIHRleHQgZmllbGQgdmFsdWU6Ki9cclxuICAgICAgaWYgKGFycltpXS5zdWJzdHIoMCwgdmFsLmxlbmd0aCkudG9VcHBlckNhc2UoKSA9PSB2YWwudG9VcHBlckNhc2UoKSkge1xyXG4gICAgICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgZm9yIGVhY2ggbWF0Y2hpbmcgZWxlbWVudDoqL1xyXG4gICAgICAgIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgICAgICAvKm1ha2UgdGhlIG1hdGNoaW5nIGxldHRlcnMgYm9sZDoqL1xyXG4gICAgICAgIGIuaW5uZXJIVE1MID0gJzxzdHJvbmc+JyArIGFycltpXS5zdWJzdHIoMCwgdmFsLmxlbmd0aCkgKyAnPC9zdHJvbmc+JztcclxuICAgICAgICBiLmlubmVySFRNTCArPSBhcnJbaV0uc3Vic3RyKHZhbC5sZW5ndGgpO1xyXG4gICAgICAgIC8qaW5zZXJ0IGEgaW5wdXQgZmllbGQgdGhhdCB3aWxsIGhvbGQgdGhlIGN1cnJlbnQgYXJyYXkgaXRlbSdzIHZhbHVlOiovXHJcbiAgICAgICAgYi5pbm5lckhUTUwgKz0gXCI8aW5wdXQgdHlwZT0naGlkZGVuJyB2YWx1ZT0nXCIgKyBhcnJbaV0gKyBcIic+XCI7XHJcbiAgICAgICAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIGNsaWNrcyBvbiB0aGUgaXRlbSB2YWx1ZSAoRElWIGVsZW1lbnQpOiovXHJcbiAgICAgICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgIC8qaW5zZXJ0IHRoZSB2YWx1ZSBmb3IgdGhlIGF1dG9jb21wbGV0ZSB0ZXh0IGZpZWxkOiovXHJcbiAgICAgICAgICBpbnAudmFsdWUgPSB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpWzBdLnZhbHVlO1xyXG4gICAgICAgICAgLypjbG9zZSB0aGUgbGlzdCBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyxcclxuICAgICAgICAgICAgKG9yIGFueSBvdGhlciBvcGVuIGxpc3RzIG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzOiovXHJcbiAgICAgICAgICBjbG9zZUFsbExpc3RzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYS5hcHBlbmRDaGlsZChiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHByZXNzZXMgYSBrZXkgb24gdGhlIGtleWJvYXJkOiovXHJcbiAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQgKyAnYXV0b2NvbXBsZXRlLWxpc3QnKTtcclxuICAgIGlmICh4KSB4ID0geC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2Jyk7XHJcbiAgICBpZiAoZS5rZXlDb2RlID09IDQwKSB7XHJcbiAgICAgIC8qSWYgdGhlIGFycm93IERPV04ga2V5IGlzIHByZXNzZWQsXHJcbiAgICAgIGluY3JlYXNlIHRoZSBjdXJyZW50Rm9jdXMgdmFyaWFibGU6Ki9cclxuICAgICAgY3VycmVudEZvY3VzKys7XHJcbiAgICAgIC8qYW5kIGFuZCBtYWtlIHRoZSBjdXJyZW50IGl0ZW0gbW9yZSB2aXNpYmxlOiovXHJcbiAgICAgIGFkZEFjdGl2ZSh4KTtcclxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDM4KSB7XHJcbiAgICAgIC8vdXBcclxuICAgICAgLypJZiB0aGUgYXJyb3cgVVAga2V5IGlzIHByZXNzZWQsXHJcbiAgICAgIGRlY3JlYXNlIHRoZSBjdXJyZW50Rm9jdXMgdmFyaWFibGU6Ki9cclxuICAgICAgY3VycmVudEZvY3VzLS07XHJcbiAgICAgIC8qYW5kIGFuZCBtYWtlIHRoZSBjdXJyZW50IGl0ZW0gbW9yZSB2aXNpYmxlOiovXHJcbiAgICAgIGFkZEFjdGl2ZSh4KTtcclxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgIC8qSWYgdGhlIEVOVEVSIGtleSBpcyBwcmVzc2VkLCBwcmV2ZW50IHRoZSBmb3JtIGZyb20gYmVpbmcgc3VibWl0dGVkLCovXHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKGN1cnJlbnRGb2N1cyA+IC0xKSB7XHJcbiAgICAgICAgLyphbmQgc2ltdWxhdGUgYSBjbGljayBvbiB0aGUgXCJhY3RpdmVcIiBpdGVtOiovXHJcbiAgICAgICAgaWYgKHgpIHhbY3VycmVudEZvY3VzXS5jbGljaygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgZnVuY3Rpb24gYWRkQWN0aXZlKHgpIHtcclxuICAgIC8qYSBmdW5jdGlvbiB0byBjbGFzc2lmeSBhbiBpdGVtIGFzIFwiYWN0aXZlXCI6Ki9cclxuICAgIGlmICgheCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgLypzdGFydCBieSByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyBvbiBhbGwgaXRlbXM6Ki9cclxuICAgIHJlbW92ZUFjdGl2ZSh4KTtcclxuICAgIGlmIChjdXJyZW50Rm9jdXMgPj0geC5sZW5ndGgpIGN1cnJlbnRGb2N1cyA9IDA7XHJcbiAgICBpZiAoY3VycmVudEZvY3VzIDwgMCkgY3VycmVudEZvY3VzID0geC5sZW5ndGggLSAxO1xyXG4gICAgLyphZGQgY2xhc3MgXCJhdXRvY29tcGxldGUtYWN0aXZlXCI6Ki9cclxuICAgIHhbY3VycmVudEZvY3VzXS5jbGFzc0xpc3QuYWRkKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJlbW92ZUFjdGl2ZSh4KSB7XHJcbiAgICAvKmEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBcImFjdGl2ZVwiIGNsYXNzIGZyb20gYWxsIGF1dG9jb21wbGV0ZSBpdGVtczoqL1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHhbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYXV0b2NvbXBsZXRlLWFjdGl2ZScpO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBjbG9zZUFsbExpc3RzKGVsbW50KSB7XHJcbiAgICAvKmNsb3NlIGFsbCBhdXRvY29tcGxldGUgbGlzdHMgaW4gdGhlIGRvY3VtZW50LFxyXG4gIGV4Y2VwdCB0aGUgb25lIHBhc3NlZCBhcyBhbiBhcmd1bWVudDoqL1xyXG4gICAgdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRvY29tcGxldGUtaXRlbXMnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZWxtbnQgIT0geFtpXSAmJiBlbG1udCAhPSBpbnApIHtcclxuICAgICAgICB4W2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoeFtpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIGNsaWNrcyBpbiB0aGUgZG9jdW1lbnQ6Ki9cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGNsb3NlQWxsTGlzdHMoZS50YXJnZXQpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBBdXRvQ29tcGxldGUgfTtcclxuIiwiZnVuY3Rpb24gQ291bnRyeVNlbGVjdG9yKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCB1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX191cCcpO1xyXG4gIGxldCBkb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2Rvd24nKTtcclxuICBsZXQgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9faXRlbXMnKTtcclxuICBsZXQgaXRlbUhlaWdodCA9XHJcbiAgICBpdGVtcyAhPSBudWxsID8gaXRlbXMuZmlyc3RDaGlsZC5uZXh0U2libGluZy5vZmZzZXRIZWlnaHQgOiAwO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIGlmICh1cCAhPSBudWxsKSB7XHJcbiAgICB1cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbFVwKTtcclxuICAgIGRvd24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxEb3duKTtcclxuXHJcbiAgICAvLyBldmVudCBoYW5kbGVyc1xyXG4gICAgZnVuY3Rpb24gc2Nyb2xsVXAoKSB7XHJcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCB1cCBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxyXG4gICAgICBpdGVtcy5zY3JvbGxUb3AgKz0gaXRlbUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxEb3duKCkge1xyXG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgZG93biBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxyXG4gICAgICBpdGVtcy5zY3JvbGxUb3AgLT0gaXRlbUhlaWdodDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IENvdW50cnlTZWxlY3RvciB9O1xyXG4iLCIvLyBtb2R1bGUgQ292ZXJPcHRpb25zLmpzXHJcblxyXG5mdW5jdGlvbiBDb3Zlck9wdGlvbnMoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgY29zdFByZWZpeFRleHQgPSAkKCcuanMtY29zdC1wcmVmaXgnKTtcclxuICBjb25zdCB3YXJuaW5nVGV4dCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0Jyk7XHJcbiAgY29uc3Qgd2FybmluZ1RleHQ2MCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0LTYwJyk7XHJcbiAgY29uc3QgY292ZXJPcHRpb25QcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuY2FyZC1wcmljZScpO1xyXG4gIC8vIEdldCBzaW5nbGUgdHJpcCBwcmljZVxyXG4gIGNvbnN0IGluaXRpYWxDb3ZlclByaWNlID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC5hbW91bnQnKTtcclxuICBjb25zdCBkX2luaXRpYWxDb3ZlclByaWNlID0gcGFyc2VGbG9hdChcclxuICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoKS5yZXBsYWNlKC9cXEQqLywgJycpXHJcbiAgKS50b0ZpeGVkKDIpO1xyXG5cclxuICBjb25zdCBpbml0aWFsU2luZ2xlVHJpcFByaWNlID0gJCgnLmluaXRpYWwtc2luZ2xlLXRyaXAtcHJpY2UnKTtcclxuICBjb25zdCBkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2UgPSBwYXJzZUZsb2F0KFxyXG4gICAgaW5pdGlhbFNpbmdsZVRyaXBQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxyXG4gICkudG9GaXhlZCgyKTtcclxuXHJcbiAgY29uc3QgY3VycmVuY3lTeW1ib2wgPSBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkuc3Vic3RyaW5nKDAsIDEpO1xyXG4gIGxldCBpbnB1dFZhbHVlID0gJyc7XHJcbiAgbGV0IHByaWNlTGltaXQ7XHJcbiAgbGV0IHRvdGFsSW5pdGlhbFByaWNlID0gMDtcclxuICBsZXQgdG90YWxTaW5nbGVQcmljZSA9IDA7XHJcbiAgbGV0IGZpbmFsUHJpY2UgPSAwO1xyXG5cclxuICBpZiAoY3VycmVuY3lTeW1ib2wgPT0gJ1xcdTAwQTMnKSB7XHJcbiAgICBwcmljZUxpbWl0ID0gMTE5O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwcmljZUxpbWl0ID0gMTQyO1xyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmNsZWFyKCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgY292ZXIgcHJpY2U6ICR7ZF9pbml0aWFsQ292ZXJQcmljZX1gKTtcclxuICAvL2NvbnNvbGUubG9nKGBTaW5nbGUgVHJpcCBwcmljZTogJHtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2V9YCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgY3VycmVuY3lTeW1ib2w6ICR7Y3VycmVuY3lTeW1ib2x9YCk7XHJcblxyXG4gICQoJy5wcm9kdWN0LW9wdGlvbnMtZGF5cy1jb3ZlcicpLmNoYW5nZShmdW5jdGlvbihldnQpIHtcclxuICAgIC8vIGdldCB2YWx1ZVxyXG4gICAgaW5wdXRWYWx1ZSA9IHBhcnNlSW50KGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcclxuXHJcbiAgICAvLyBoaWRlIFwiZnJvbVwiIHRleHRcclxuICAgIGlmIChpbnB1dFZhbHVlID4gMykge1xyXG4gICAgICBjb3N0UHJlZml4VGV4dC5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb3N0UHJlZml4VGV4dC5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlucHV0VmFsdWUgPiAwICYmIE51bWJlci5pc0ludGVnZXIoaW5wdXRWYWx1ZSkpIHtcclxuICAgICAgLy8gY2FsY3VsYXRlIHdpdGggaW50aXRhbCBjb3ZlciBwcmljZVxyXG4gICAgICAvLyBkX2luaXRpYWxDb3ZlclByaWNlID0gMTEuOTlcclxuICAgICAgaWYgKGlucHV0VmFsdWUgPiAwICYmIGlucHV0VmFsdWUgPD0gMykge1xyXG4gICAgICAgIHRvdGFsSW5pdGlhbFByaWNlID0gZF9pbml0aWFsQ292ZXJQcmljZTtcclxuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gdG90YWxJbml0aWFsUHJpY2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmICgoaW5wdXRWYWx1ZSA+IDMgJiYgaW5wdXRWYWx1ZSA8PSA2MCkgfHwgcHJpY2VMaW1pdCA8IGZpbmFsUHJpY2UpIHtcclxuICAgICAgaWYgKGlucHV0VmFsdWUgPiAzKSB7XHJcbiAgICAgICAgdG90YWxJbml0aWFsUHJpY2UgPSBkX2luaXRpYWxDb3ZlclByaWNlO1xyXG4gICAgICAgIC8vIGRvdWJsZSB1cCBvbiB0aGUgc3RyaW5nIHZhbHVlcyB0byB1c2UgYSB1bmFyeSBwbHVzIHRvIGNvbnZlcnQgYW5kIGhhdmUgaXQgYWRkZWQgdG8gdGhlIHByZXZpb3VzIHZhbHVlXHJcbiAgICAgICAgdG90YWxTaW5nbGVQcmljZSA9XHJcbiAgICAgICAgICArdG90YWxJbml0aWFsUHJpY2UgKyAoK2lucHV0VmFsdWUgLSAzKSAqICtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5hbFByaWNlID0gcGFyc2VGbG9hdCh0b3RhbFNpbmdsZVByaWNlKS50b0ZpeGVkKDIpO1xyXG5cclxuICAgIGlmIChpbnB1dFZhbHVlID4gMTEgJiYgaW5wdXRWYWx1ZSA8PSA2MCkge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgZmluYWxQcmljZSk7XHJcbiAgICAgIC8vIGNoYW5nZSBjb2xvciBvZiBwcmljZVxyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLmFkZENsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICAgIC8vIHNob3cgd2FybmluZyB0ZXh0XHJcbiAgICAgIHdhcm5pbmdUZXh0LnNob3coKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2Uuc2hvdygpO1xyXG4gICAgfSBlbHNlIGlmIChpbnB1dFZhbHVlID4gMyAmJiBpbnB1dFZhbHVlIDw9IDYwKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5yZW1vdmVDbGFzcygnd2FybmluZycpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcclxuICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA8PSAzKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5yZW1vdmVDbGFzcygnd2FybmluZycpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcclxuICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA+IDYwKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5hZGRDbGFzcygnd2FybmluZycpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLnNob3coKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLmhpZGUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyB0b3RhbFNpbmdsZVByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XHJcbiAgICAgIHdhcm5pbmdUZXh0LmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhgJHtpbnB1dFZhbHVlfSA9ICR7ZmluYWxQcmljZX1gKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgQ292ZXJPcHRpb25zIH07XHJcbiIsImZ1bmN0aW9uIFRvZ2dsZU5hdmlnYXRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgY3VycmVuY3kgPSAkKCcuY3VycmVuY3knKTtcclxuICBjb25zdCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcclxuICBjb25zdCBuYXZCYXJUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xyXG4gIGNvbnN0IGN1cnJlbmN5TmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWN1cnJlbmN5LXRvZ2dsZScpO1xyXG4gIGNvbnN0IGN1cnJlbmN5TWVudVRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgbmF2QmFyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XHJcbiAgY3VycmVuY3lNZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQ3VycmVuY3lNZW51KTtcclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xyXG4gICAgbWFpbk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbmN5TWVudSgpIHtcclxuICAgIGN1cnJlbmN5TmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCQod2luZG93KS53aWR0aCgpID4gJzExOTknKSB7XHJcbiAgICBjdXJyZW5jeS5zaG93KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGN1cnJlbmN5LmhpZGUoKTtcclxuICB9XHJcblxyXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAnMTE5OScpIHtcclxuICAgICAgY3VycmVuY3kuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVuY3kuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBEcm9wZG93bk1lbnUoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGNhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY2FyJyk7XHJcbiAgbGV0IGRyb3BEb3duTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi0tY2FyIC5kcm9wZG93bi1tZW51Jyk7XHJcblxyXG4gIGlmIChjYXJCdG4gIT0gbnVsbCAmJiBkcm9wRG93bk1lbnUgIT0gbnVsbCkge1xyXG4gICAgbGV0IGRyb3BEb3duID0gY2FyQnRuLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAvLyBCaW5kIGV2ZW50c1xyXG4gICAgY2FyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyQnRuSGFuZGxlcik7XHJcblxyXG4gICAgLy8gRXZlbnQgaGFuZGxlcnNcclxuICAgIGZ1bmN0aW9uIGNhckJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyB0b2dnbGUgZGlzcGxheVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnJ1xyXG4gICAgICApIHtcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID1cclxuICAgICAgICAgIGRyb3BEb3duLm9mZnNldEhlaWdodCArIGRyb3BEb3duTWVudS5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gRml4ZWROYXZpZ2F0aW9uKCkge1xyXG4gIC8vIG1ha2UgbmF2YmFyIHN0aWNreVxyXG4gIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXHJcbiAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICBteUZ1bmN0aW9uKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICBsZXQgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhcicpO1xyXG5cclxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXHJcbiAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XHJcblxyXG4gIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxyXG4gIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc3RpY2t5ID0gbmF2QmFyLm9mZnNldFRvcDtcclxuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcclxuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5hZGQoJ25hdmJhci1maXhlZC10b3AnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QucmVtb3ZlKCduYXZiYXItZml4ZWQtdG9wJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBTZWxlY3RUcmlwKCkge1xyXG4gIC8vIHNlbGVjdCB2ZWhpY2xlXHJcbiAgJCgnLnRhYi1jYXIgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gICQoJy50YWItY2FyIC5pY29uLXJhZGlvIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tY3RhLS1kaXNhYmxlZCcpO1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLmFkZENsYXNzKCdidG4tY3RhJyk7XHJcbiAgICAkKCcudGFiLWNhciAuYnRuJykudW5iaW5kKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIHNob3cgbW9iaWxlIGN1cnJlbmN5XHJcbmZ1bmN0aW9uIFJldmVhbEN1cnJlbmN5KCkge1xyXG4gICQoJy5jdXJyZW5jeS1tb2JpbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDdXJyZW5jeScpO1xyXG5cclxuICAgICQoJy5jdXJyZW5jeScpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbixcclxuICBEcm9wZG93bk1lbnUsXHJcbiAgRml4ZWROYXZpZ2F0aW9uLFxyXG4gIFNlbGVjdFRyaXAsXHJcbiAgUmV2ZWFsQ3VycmVuY3lcclxufTtcclxuIiwiaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9QdWJTdWInO1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gIHRoaXNBcmcgPSB0aGlzQXJnIHx8IHdpbmRvdztcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpc1tpXSwgaSwgdGhpcyk7XHJcbiAgfVxyXG59O1xyXG5cclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xyXG59XHJcblxyXG4vLyBtb2R1bGUgXCJQb2xpY3lTdW1tYXJ5LmpzXCJcclxuLy8gbW9kdWxlIFwiUG9saWN5U3VtbWFyeUFjY29yZGlvbi5qc1wiXHJcblxyXG5mdW5jdGlvbiBEZXNrdG9wRGV2aWNlU2V0dXAoKSB7XHJcbiAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9KTtcclxuXHJcbiAgLy8gcmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgZnJvbSBhbGxcclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9KTtcclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLWNoaWxkKDIpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAvLyBzaG93IHBvbGljeSBpbmZvXHJcbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uIC5wb2xpY3ktaW5mbycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIHJlc2V0IHBvbGljeSBzdW1tYXJ5XHJcbiAgJCgnLnBvbGljeS1zdW1tYXJ5LWluZm8nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgfSk7XHJcbiAgJCgnLnBvbGljeS1zdW1tYXJ5LWluZm86Zmlyc3QtY2hpbGQnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHJcbiAgLy8gcmVtb3ZlIG1vYmlsZSBldmVudCBsaXN0ZW5lclxyXG4gIGNvbnN0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAnLmFjY29yZGlvbi1iYXIgYnV0dG9uLm1vcmUtaW5mb3JtYXRpb24nXHJcbiAgKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGFjY1tpXS5ldmVudExpc3RlbmVyKSB7XHJcbiAgICAgIGFjY1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgUG9saWN5U3VtbWFyeURlc2t0b3AoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gTW9iaWxlRGV2aWNlU2V0dXAoKSB7XHJcbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KVxyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgIC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uIC5wb2xpY3ktaW5mbycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9KTtcclxuXHJcbiAgLy8gcmVzZXQgcG9saWN5IHN1bW1hcnlcclxuICAkKCcucG9saWN5LXN1bW1hcnktaW5mbycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9KTtcclxuXHJcbiAgLy8gcmVtb3ZlIGRlc2t0b3AgZXZlbnQgbGlzdGVuZXJcclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS51bmJpbmQoKTtcclxuXHJcbiAgLy8gc2V0dXAgTW9iaWxlXHJcbiAgUG9saWN5U3VtbWFyeU1vYmlsZSgpO1xyXG59XHJcblxyXG4vLyBkZXZpY2UgcmVzZXQgT04gYnJvd3NlciB3aWR0aFxyXG5mdW5jdGlvbiBQb2xpY3lTdW1tYXJ5RGV2aWNlUmVzaXplKCkge1xyXG4gIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5vdXRlcldpZHRoKTtcclxuXHJcbiAgaWYgKHdpbmRvdy5vdXRlcldpZHRoID4gMTE5OSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBERVZJQ0U6IERlc2t0b3BcclxuICAgICAqL1xyXG4gICAgRGVza3RvcERldmljZVNldHVwKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8qKlxyXG4gICAgICogREVWSUNFOiBNb2JpbGVcclxuICAgICAqL1xyXG4gICAgTW9iaWxlRGV2aWNlU2V0dXAoKTtcclxuICB9XHJcblxyXG4gIC8vIENhY2hlIERPTVxyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhldnQudGFyZ2V0Lm91dGVyV2lkdGgpO1xyXG5cclxuICAgIGlmIChldnQudGFyZ2V0Lm91dGVyV2lkdGggPiAxMTk5KSB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBERVZJQ0U6IERlc2t0b3BcclxuICAgICAgICovXHJcbiAgICAgIERlc2t0b3BEZXZpY2VTZXR1cCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIERFVklDRTogTW9iaWxlXHJcbiAgICAgICAqL1xyXG4gICAgICBNb2JpbGVEZXZpY2VTZXR1cCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogUG9saWN5IFN1bW1hcnkgSGFuZGxlciBmb3IgbW9iaWxlXHJcbiAqXHJcbiAqIEByZXR1cm4gIHtub25lfVxyXG4gKi9cclxuZnVuY3Rpb24gUG9saWN5U3VtbWFyeU1vYmlsZSgpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBhY2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJy5hY2NvcmRpb24tYmFyIGJ1dHRvbi5tb3JlLWluZm9ybWF0aW9uJ1xyXG4gICk7XHJcbiAgbGV0IGNhcmRDb3Zlck9wdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkLWNvdmVyLW9wdGlvbicpO1xyXG4gIGxldCBwb2xpY3lTdW1tYXJ5SW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb2xpY3ktc3VtbWFyeS1pbmZvJyk7XHJcbiAgbGV0IHBvbGljeVJlZmVyZW5jZSA9ICcnO1xyXG5cclxuICBsZXQgYWN0aXZlQ2FyZE9wdGlvbiA9ICcnO1xyXG5cclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIC8vIEV2ZW50IEhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcclxuXHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGV2dC5jdXJyZW50VGFyZ2V0KTtcclxuICAgIC8vIGhpZGUgdGhlIG90aGVyIG9wdGlvbnNcclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cclxuICAgIC8vIHJlbW92ZSBuYXZiYXItZml4ZWQtdG9wXHJcbiAgICBldnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnbmF2YmFyLWZpeGVkLXRvcCcpO1xyXG4gICAgLy8gbW9yZSBpbmZvcm1hdGlvbiBidXR0b24gaGFzIGJlZW4gY2xpY2tlZFxyXG4gICAgaWYgKGFjdGl2ZUNhcmRPcHRpb24gPT09ICdzZWxlY3RlZCcpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ0Nsb3NlJyk7XHJcblxyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5pbm5lclRleHQgPSAnTW9yZSBpbmZvcm1hdGlvbic7XHJcblxyXG4gICAgICAvLyByZW1vdmUgYWN0aXZlIGJvcmRlclxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRDb3Zlck9wdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNhcmRDb3Zlck9wdGlvbltpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBjYXJkQ292ZXJPcHRpb25baV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGhpZGUgcG9saWN5LWluZm9cclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICcuY2FyZC1jb3Zlci1vcHRpb25bZGF0YS1wb2xpY3lePVwicG9saWN5LXN1bW1hcnktXCJdIC5wb2xpY3ktaW5mbydcclxuICAgICAgICApXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gaGlkZSBhbGwgcG9saWN5LXN1bW1hcnktaW5mbyBibG9ja3NcclxuICAgICAgcG9saWN5U3VtbWFyeUluZm8uZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFjdGl2ZUNhcmRPcHRpb24gPSAnJztcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnT3BlbicpO1xyXG5cclxuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuaW5uZXJUZXh0ID0gJ1ZpZXcgb3RoZXIgb3B0aW9ucyc7XHJcblxyXG4gICAgICAvLyBtb3ZlIG1vcmUgaW5mb3JtYXRpb24gYXJyb3dcclxuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblxyXG4gICAgICAvKiBoaWdobGlnaHQgdGhlIGNhcmQgdGhhdCdzIGJlZW4gc2VsZWN0ZWQgKi9cclxuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFxyXG4gICAgICAgICdhY3RpdmUnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICAvLyBnZXQgcG9saWN5IHJlZmVyZW5jZVxyXG4gICAgICBwb2xpY3lSZWZlcmVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1jb3Zlci1vcHRpb24uYWN0aXZlJylcclxuICAgICAgICAuZGF0YXNldC5wb2xpY3k7XHJcblxyXG4gICAgICAvLyBzaG93IG9ubHkgdGhlIHByb2R1Y3Qgc3VtbWFyeSBpbmZvIHRoYXQgaGFzIGFuIGFjdGl2ZSBwcm9kdWN0IGNvdmVyIG9wdGlvblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRDb3Zlck9wdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChjYXJkQ292ZXJPcHRpb25baV0uZ2V0QXR0cmlidXRlKCdjbGFzcycpLmluZGV4T2YoJ2FjdGl2ZScpIDwgMCkge1xyXG4gICAgICAgICAgY2FyZENvdmVyT3B0aW9uW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhcmRDb3Zlck9wdGlvbltpXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHNob3cgdGhlIGNvdmVyIG9wdGlvbiBpbmZvIHRleHRcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAnLmNhcmQtY292ZXItb3B0aW9uW2RhdGEtcG9saWN5PVwiJyArIHBvbGljeVJlZmVyZW5jZSArICdcIl0gLnBvbGljeS1pbmZvJ1xyXG4gICAgICApLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cclxuICAgICAgYWN0aXZlQ2FyZE9wdGlvbiA9ICdzZWxlY3RlZCc7XHJcblxyXG4gICAgICAvLyBoaWRlIGFsbCBwb2xpY3ktc3VtbWFyeS1pbmZvIGJsb2Nrc1xyXG4gICAgICBwb2xpY3lTdW1tYXJ5SW5mby5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gZ2V0IHRoZSBwb2xpY3kgc3VtbWFyeSBpbmZvIHBhbmVsIGFzc29jaWNhdGVkIHdpdGggdGhpcyBwcm9kdWN0IHVzaW5nIHRoZSBwb2xpY3lSZWZlcmVuY2VcclxuICAgICAgbGV0IHBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAnLnBvbGljeS1zdW1tYXJ5LWluZm8uJyArIHBvbGljeVJlZmVyZW5jZVxyXG4gICAgICApO1xyXG4gICAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnRzLm9uKCdoZWlnaHRDaGFuZ2VkJywgbmV3SGVpZ2h0ID0+IHtcclxuICAgICAgICBsZXQgbmV3VG90YWwgPVxyXG4gICAgICAgICAgcGFyc2VJbnQoXHJcbiAgICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodC5zdWJzdHJpbmcoMCwgcGFuZWwuc3R5bGUubWF4SGVpZ2h0Lmxlbmd0aCAtIDIpXHJcbiAgICAgICAgICApICtcclxuICAgICAgICAgIHBhcnNlSW50KG5ld0hlaWdodC5zdWJzdHJpbmcoMCwgbmV3SGVpZ2h0Lmxlbmd0aCAtIDIpKSArXHJcbiAgICAgICAgICAncHgnO1xyXG5cclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBuZXdUb3RhbDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSAvLyBhY2NvcmRpb25IYW5kbGVyXHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVTdGFydCwgZmFsc2UpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTdGFydChldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc29sZS5sb2coJ3RvdWNoIGV2ZW50Jyk7XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZUVuZCwgZmFsc2UpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVFbmQoZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnNvbGUubG9nKCd0b3VjaCBldmVudCcpO1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBoYW5kbGVDYW5jZWwsIGZhbHNlKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2FuY2VsKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zb2xlLmxvZygndG91Y2ggZXZlbnQnKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGhhbmRsZU1vdmUsIGZhbHNlKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlTW92ZShldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc29sZS5sb2coJ3RvdWNoIGV2ZW50Jyk7XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxufSAvLyBQb2xpY3lTdW1tYXJ5TW9iaWxlXHJcblxyXG4vKipcclxuICogUG9saWN5IFN1bW1hcnkgaGFuZGxlciBmb3IgZGVza3RvcFxyXG4gKlxyXG4gKiBAcmV0dXJuICB7bm9uZX1cclxuICovXHJcbmZ1bmN0aW9uIFBvbGljeVN1bW1hcnlEZXNrdG9wKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIC8vIHBvbGljeSBzdW1tYXJ5XHJcbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIC8vIHNob3cgcG9saWN5IHN1bW1hcnlcclxuICAgICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHBvbGljeVN1bW1hcnkgPSAkKHRoaXMpLmRhdGEoJ3BvbGljeScpO1xyXG4gICAgJCgnLicgKyBwb2xpY3lTdW1tYXJ5KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9KTtcclxufSAvLyBQb2xpY3lTdW1tYXJ5RGVza3RvcFxyXG5cclxuZXhwb3J0IHsgUG9saWN5U3VtbWFyeURldmljZVJlc2l6ZSwgUG9saWN5U3VtbWFyeU1vYmlsZSwgUG9saWN5U3VtbWFyeURlc2t0b3AgfTtcclxuIiwiLy8gVGhlIG1vZHVsZSB3aWxsIHNlbmQgYSBjaGFuZ2VkIGV2ZW50IHRvIFB1YlN1YiBhbmRcclxuLy8gYW55b25lIGxpc3RlbmluZyB3aWxsIHJlY2VpdmUgdGhhdCBjaGFuZ2VkIGV2ZW50IGFuZFxyXG4vLyB0aGVuIHVwZGF0ZSBhY2NvcmRpbmdseVxyXG5cclxubGV0IGV2ZW50cyA9IHtcclxuICAvLyBsaXN0IG9mIGV2ZW50c1xyXG4gIGV2ZW50czoge30sXHJcblxyXG4gIG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XHJcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcclxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XHJcbiAgfSxcclxuXHJcbiAgb2ZmOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XHJcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcclxuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZW1pdDogZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICBmbihkYXRhKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHsgZXZlbnRzIH07XHJcbiIsIi8vIG1vZHVsZSBSZXZlYWxEb2NzLmpzXHJcblxyXG5mdW5jdGlvbiBSZXZlYWxEb2NzKCkge1xyXG4gIC8vRG9jc1xyXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IG9uID0gJCgnLmRvY3MnKS5pcygnOnZpc2libGUnKTtcclxuICAgICQodGhpcykuaHRtbChcclxuICAgICAgb24gPyAnVmlldyBwb2xpY3kgZG9jdW1lbnRhdGlvbicgOiAnSGlkZSBwb2xpY3kgZG9jdW1lbnRhdGlvbidcclxuICAgICk7XHJcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJldmVhbERvY3MgfTtcclxuIiwiLy8gbW9kdWxlIFwiU2NyZWVuLmpzXCJcclxuXHJcbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xyXG4gIHZhciBzY3JvbGxTdGVwID0gLXdpbmRvdy5zY3JvbGxZIC8gKHNjcm9sbER1cmF0aW9uIC8gMTUpLFxyXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgc2Nyb2xsU3RlcCk7XHJcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcclxuICAgIH0sIDE1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xyXG4gIGNvbnN0IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMjtcclxuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxyXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XHJcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xyXG4gICAgaWYgKHNjcm9sbENvdW50ID49IE1hdGguUEkpIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcclxuICAgICk7XHJcbiAgICBvbGRUaW1lc3RhbXAgPSBuZXdUaW1lc3RhbXA7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxufVxyXG4vKlxyXG4gIEV4cGxhbmF0aW9uczpcclxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxyXG4gIC0gbmV3VGltZXN0YW1wIGluZGljYXRlcyB0aGUgY3VycmVudCB0aW1lIHdoZW4gY2FsbGJhY2tzIHF1ZXVlZCBieSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmVnaW4gdG8gZmlyZS5cclxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxyXG5cclxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXHJcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXHJcbiAgPSBhICogY29zIChieCkgKyAxICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEgc3RyZXRjaGVzIGFsb25nIHRoZSB5IGF4aXMgPSBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDJcclxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXHJcbiovXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcclxuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBiYWNrVG9Ub3BCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KDEwMDApO1xyXG5cclxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXaW5kb3dXaWR0aCgpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBhY2NvcmRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcuY2FyZC1wcm9kdWN0cyAuYWNjb3JkaW9uLWJ0bidcclxuICApO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgdyA9XHJcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgaWYgKHcgPiAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHcgPD0gMTIwMCkge1xyXG4gICAgICBsZXQgaTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTdGlja3koKXtcclxuICBjb25zb2xlLmxvZygnU3RpY2t5Jyk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihldnQpIHtcclxuXHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vcmUtaW5mb3JtYXRpb24uYWN0aXZlJykpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NoZWNraW5nJyk7XHJcblxyXG4gICAgICBjb25zdCBtb3JlSW5mb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb3JlLWluZm9ybWF0aW9uLmFjdGl2ZScpO1xyXG4gICAgICBjb25zdCBzdGlja3kgPSBtb3JlSW5mb0J0bi5vZmZzZXRUb3A7XHJcbiAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcclxuICAgICAgICBtb3JlSW5mb0J0bi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcIm5hdmJhci1maXhlZC10b3BcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbW9yZUluZm9CdG4ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJuYXZiYXItZml4ZWQtdG9wXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGgsIFN0aWNreSB9O1xyXG4iLCIvLyBtb2R1bGUgXCJTY3JvbGxUby5qc1wiXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUbygpIHtcclxuICAvLyBjYWNoZSBET01cclxuICAvLyBTZWxlY3QgYWxsIGxpbmtzIHdpdGggaGFzaGVzXHJcbiAgLy8gUmVtb3ZlIGxpbmtzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgbGluayB0byBhbnl0aGluZ1xyXG4gIGxldCBhbmNob3JzID0gJCgnYVtocmVmKj1cIiNcIl0nKVxyXG4gICAgLm5vdCgnW2hyZWY9XCIjXCJdJylcclxuICAgIC5ub3QoJ1tocmVmPVwiIzBcIl0nKTtcclxuXHJcbiAgbGV0IGhlaWdodENvbXBlbnNhdGlvbiA9IDYwO1xyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgYW5jaG9ycy5jbGljayhhbmNob3JzSGFuZGxlcik7XHJcblxyXG4gIC8vIEV2ZW50IEhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gYW5jaG9yc0hhbmRsZXIoZXZlbnQpIHtcclxuICAgIC8vIE9uLXBhZ2UgbGlua3NcclxuICAgIGlmIChcclxuICAgICAgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSA9PVxyXG4gICAgICAgIHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSAmJlxyXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lXHJcbiAgICApIHtcclxuICAgICAgLy8gRmlndXJlIG91dCBlbGVtZW50IHRvIHNjcm9sbCB0b1xyXG4gICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgICB0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcbiAgICAgIC8vIERvZXMgYSBzY3JvbGwgdGFyZ2V0IGV4aXN0P1xyXG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgIC8vIE9ubHkgcHJldmVudCBkZWZhdWx0IGlmIGFuaW1hdGlvbiBpcyBhY3R1YWxseSBnb25uYSBoYXBwZW5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3AgLSBoZWlnaHRDb21wZW5zYXRpb25cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAxMDAwLFxyXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxyXG4gICAgICAgICAgICAvLyBNdXN0IGNoYW5nZSBmb2N1cyFcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKHRhcmdldCk7XHJcbiAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKCR0YXJnZXQuaXMoJzpmb2N1cycpKSB7XHJcbiAgICAgICAgICAgICAgLy8gQ2hlY2tpbmcgaWYgdGhlIHRhcmdldCB3YXMgZm9jdXNlZFxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkdGFyZ2V0LmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7IC8vIEFkZGluZyB0YWJpbmRleCBmb3IgZWxlbWVudHMgbm90IGZvY3VzYWJsZVxyXG4gICAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTsgLy8gU2V0IGZvY3VzIGFnYWluXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvbiBzY3JvbGxcclxuaWYgKCQoJy5hcnRpY2xlLW1haW4nKS5sZW5ndGggPiAwKSB7XHJcbiAgbGV0IHRhcmdldCA9ICQoJy5hcnRpY2xlLW1haW4nKS5vZmZzZXQoKS50b3AgLSAxODA7XHJcbiAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+PSB0YXJnZXQpIHtcclxuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLmhpZGUoKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgU2Nyb2xsVG8gfTtcclxuIiwiZnVuY3Rpb24gUmVhZHkoZm4pIHtcclxuICBpZiAoXHJcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxyXG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcclxuICAgICAgOiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZydcclxuICApIHtcclxuICAgIGZuKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBSZWFkeSB9O1xyXG4iLCJmdW5jdGlvbiBWZWhpY2xlU2VsZWN0b3IoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGNhclRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fY2FyJyk7XHJcbiAgbGV0IHZhblRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fdmFuJyk7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgaWYgKGNhclRhYiAhPSBudWxsICYmIHZhblRhYiAhPSBudWxsKSB7XHJcbiAgICBjYXJUYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XHJcbiAgICB2YW5UYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XHJcbiAgfVxyXG5cclxuICAvLyBldmVudCBoYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIG9wZW5WZWhpY2xlKGV2dCkge1xyXG4gICAgdmFyIGksIHgsIHRhYkJ1dHRvbnM7XHJcblxyXG4gICAgY29uc29sZS5sb2coZXZ0KTtcclxuXHJcbiAgICAvLyBoaWRlIGFsbCB0YWIgY29udGVudHNcclxuICAgIHggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLWNvbnRhaW5lciAudGFiJyk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB4W2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIHRoZSBoaWdobGlnaHQgb24gdGhlIHRhYiBidXR0b25cclxuICAgIHRhYkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LXRhYnMgLm5hdi1saW5rJyk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZSA9IHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lLnJlcGxhY2UoJyBhY3RpdmUnLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGlnaGxpZ2h0IHRhYiBidXR0b24gYW5kXHJcbiAgICAvLyBzaG93IHRoZSBzZWxlY3RlZCB0YWIgY29udGVudFxyXG4gICAgbGV0IHZlaGljbGUgPSBldnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmVoaWNsZScpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi0nICsgdmVoaWNsZSkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc05hbWUgKz0gJyBhY3RpdmUnO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH07XHJcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCJ1dGlsXCI7XHJcblxyXG4vLyBtb2R1bGUgXCJMb2FkRkFRcy5qc1wiXHJcblxyXG5mdW5jdGlvbiBMb2FkRkFRcygpIHtcclxuICAvLyBsb2FkIGZhcXNcclxuICAkKCcjZmFxVGFicyBhJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzKS50YWIoJ3Nob3cnKTtcclxuICB9KTtcclxuXHJcbiAgLy8gbG9hZCBmYXFzXHJcbiAgLy8gb25seSBsb2FkIGlmIG9uIGZhcXMgcGFnZVxyXG4gIGlmICgkKCcjZmFxcycpLmxlbmd0aCA+IDApIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICB1cmw6ICcvYXBpL2ZhcXMuanNvbicsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcclxuICAgICAgICAvLyBnZXQgdGhlIGhlYWRzXHJcbiAgICAgICAgJC5lYWNoKGZhcXMsIGZ1bmN0aW9uKGluZGV4LCBmYXEpIHtcclxuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgZGVza3RvcFxyXG4gICAgICAgICAgJChgYVtocmVmPScjJHtmYXEuaWR9J11gKVxyXG4gICAgICAgICAgICAuZmluZCgnc3BhbicpXHJcbiAgICAgICAgICAgIC50ZXh0KGZhcS50aXRsZSk7XHJcblxyXG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBtb2JpbGVcclxuICAgICAgICAgICQoYCMke2ZhcS5pZH1gKVxyXG4gICAgICAgICAgICAuZmluZCgnaDMnKVxyXG4gICAgICAgICAgICAudGV4dChmYXEuc2hvcnRUaXRsZSk7XHJcblxyXG4gICAgICAgICAgLy8gZ2V0IHRoZSBib2R5XHJcbiAgICAgICAgICAkLmVhY2goZmFxLnFhcywgZnVuY3Rpb24oZkluZGV4LCBxYSkge1xyXG4gICAgICAgICAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicsIGAjJHtmYXEuaWR9YCkuYXBwZW5kKFxyXG4gICAgICAgICAgICAgIGA8YnV0dG9uIGNsYXNzPVwiYWNjb3JkaW9uLWJ0biBoNFwiPiR7cWEucXVlc3Rpb259PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAke3FhLmFuc3dlcn1cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTsgLy8gJGFqYXhcclxuXHJcbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcclxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcclxuICAgICAgJ2NsaWNrJyxcclxuICAgICAgZmFxc0hhbmRsZXJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBsb2FkUHJvZHVjdFBhZ2VGQVFzKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkUHJvZHVjdFBhZ2VGQVFzKCkge1xyXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBwcm9kdWN0IHBhZ2VcclxuICBpZiAoJCgnLnByb2R1Y3QtZmFxcycpLmxlbmd0aCA+IDApIHtcclxuICAgIGxldCBmaWxlID0gJCgnLnByb2R1Y3QtZmFxcycpXHJcbiAgICAgIC5kYXRhKCdmYXFzJylcclxuICAgICAgLnJlcGxhY2UoJyYtJywgJycpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coYC9hcGkvJHtmaWxlfS1mYXFzLmpzb25gKTtcclxuXHJcbiAgICAvLyQuYWpheCh7XHJcbiAgICAvLyAgdHlwZTogJ0dFVCcsXHJcbiAgICAvLyAgdXJsOiBgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmAsXHJcbiAgICAvLyAgc3VjY2VzczogdXBkYXRlVUlTdWNjZXNzLFxyXG4gICAgLy8gIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycm9yKSB7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcclxuICAgIC8vICB9XHJcbiAgICAvL30pOyAvLyAkYWpheFxyXG5cclxuICAgIGZldGNoKGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHJldHVybiAocmVzcG9uc2UuanNvbigpKTtcclxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIHVwZGF0ZVVJU3VjY2VzcyhyZXNwb25zZSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgdXBkYXRlVUlGYWlsdXJlKGVycm9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5mYXEtYW5zd2VycyAuaW5uZXIgLmFjY29yZGlvbicpLmRlbGVnYXRlKFxyXG4gICAgICAnLmFjY29yZGlvbi1idG4nLFxyXG4gICAgICAnY2xpY2snLFxyXG4gICAgICBmYXFzSGFuZGxlclxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVVSVN1Y2Nlc3MoZmFxcykge1xyXG4gIC8vIGdldCB0aGUgYm9keVxyXG4gICQuZWFjaChmYXFzLCBmdW5jdGlvbiAoZkluZGV4LCBmYXEpIHtcclxuICAgIC8vY29uc29sZS5sb2coYCMke2ZhcS5pZH1gKTtcclxuICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJykuYXBwZW5kKFxyXG4gICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke2ZhcS5xdWVzdGlvbn08L2J1dHRvbj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxyXG4gICAgICAgICAgICAgICR7ZmFxLmFuc3dlcn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBgXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICAvLyBzaG93IGNvbnRlbnRcclxuICAkKCcuZmFxLWFuc3dlcnMtcHJvZHVjdCcpLnNob3coKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVUlGYWlsdXJlKGVycm9yKSB7XHJcbiAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiwgZXJyb3IpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmYXFzSGFuZGxlcihldnQpIHtcclxuICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxyXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cclxuICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuXHJcbiAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cclxuICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xyXG4gICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcclxuICB9IGVsc2Uge1xyXG4gICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCB7IExvYWRGQVFzIH07XHJcbiIsImltcG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xyXG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uJztcclxuaW1wb3J0IHsgQ291bnRyeVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdW50cnlTZWxlY3Rvcic7XHJcbmltcG9ydCB7IFZlaGljbGVTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9WZWhpY2xlU2VsZWN0b3InO1xyXG5pbXBvcnQge1xyXG4gIFRvZ2dsZU5hdmlnYXRpb24sXHJcbiAgRHJvcGRvd25NZW51LFxyXG4gIEZpeGVkTmF2aWdhdGlvbixcclxuICBTZWxlY3RUcmlwLFxyXG4gIFJldmVhbEN1cnJlbmN5XHJcbn0gZnJvbSAnLi9jb21wb25lbnRzL05hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBTY3JvbGxUbyB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JvbGxUbyc7XHJcbmltcG9ydCB7IEF1dG9Db21wbGV0ZSB9IGZyb20gJy4vY29tcG9uZW50cy9BdXRvQ29tcGxldGUnO1xyXG5pbXBvcnQgeyBMb2FkRkFRcyB9IGZyb20gJy4vY29tcG9uZW50cy9mYXFzJztcclxuaW1wb3J0IHsgUmV2ZWFsRG9jcyB9IGZyb20gJy4vY29tcG9uZW50cy9SZXZlYWxEb2NzJztcclxuaW1wb3J0IHsgQ292ZXJPcHRpb25zIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdmVyT3B0aW9ucyc7XHJcbmltcG9ydCB7IFJlYWR5IH0gZnJvbSAnLi9jb21wb25lbnRzL1V0aWxzJztcclxuaW1wb3J0IHtcclxuICBQb2xpY3lTdW1tYXJ5RGV2aWNlUmVzaXplLFxyXG4gIFBvbGljeVN1bW1hcnlNb2JpbGUsXHJcbiAgUG9saWN5U3VtbWFyeURlc2t0b3BcclxufSBmcm9tICcuL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeSc7XHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJ3V0aWwnO1xyXG5cclxubGV0IGNvdW50cmllc0NvdmVyZWQgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgLy8gQ291bnRyeVNlbGVjdG9yKCk7XHJcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbigpO1xyXG4gIERyb3Bkb3duTWVudSgpO1xyXG4gIFNjcm9sbFRvVG9wKCk7XHJcbiAgRml4ZWROYXZpZ2F0aW9uKCk7XHJcbiAgQWNjb3JkaW9uKCk7XHJcbiAgV2luZG93V2lkdGgoKTtcclxuICBTY3JvbGxUbygpO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhgY291bnRyaWVzQ292ZXJlZDogJHtjb3VudHJpZXNDb3ZlcmVkfWApO1xyXG4gIC8vIGlmIChjb3VudHJpZXNDb3ZlcmVkICE9IG51bGwpIHtcclxuICAvLyAgIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbnB1dCcpLCBjb3VudHJpZXNDb3ZlcmVkKTtcclxuICAvLyB9XHJcblxyXG4gIExvYWRGQVFzKCk7XHJcbiAgUmV2ZWFsRG9jcygpO1xyXG4gIENvdmVyT3B0aW9ucygpO1xyXG4gIC8vIFBvbGljeVN1bW1hcnlNb2JpbGUoKTtcclxuICAvLyBQb2xpY3lTdW1tYXJ5RGVza3RvcCgpO1xyXG4gIFBvbGljeVN1bW1hcnlEZXZpY2VSZXNpemUoKTtcclxuICBTZWxlY3RUcmlwKCk7XHJcbiAgUmV2ZWFsQ3VycmVuY3koKTtcclxuICAvLyBMYXp5TG9hZCgpO1xyXG59XHJcblxyXG5SZWFkeShzdGFydCk7XHJcbiJdfQ==
