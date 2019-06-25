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
    // console.log(evt.currentTarget);

    /* hide the other options */
    evt.currentTarget.classList.remove('active'); // more information button has been clicked

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvTmF2aWdhdGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUHViU3ViLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDeExBOztBQUVBO0FBRUEsU0FBUyxTQUFULEdBQXFCO0FBQ25CO0FBQ0EsTUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGdCQUFULENBQTBCLGdCQUExQixDQUFWLENBRm1CLENBSW5COztBQUNBLE1BQUksQ0FBSjs7QUFDQSxPQUFLLENBQUMsR0FBRyxDQUFULEVBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFwQixFQUE0QixDQUFDLEVBQTdCLEVBQWlDO0FBQy9CLElBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLGdCQUFqQztBQUNELEdBUmtCLENBVW5COzs7QUFDQSxXQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCOztBQUVBLElBQUEsR0FBRyxDQUFDLGFBQUosQ0FBa0IsU0FBbEIsQ0FBNEIsTUFBNUIsQ0FBbUMsUUFBbkM7QUFFQTs7QUFDQSxRQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsYUFBSixDQUFrQixrQkFBOUI7O0FBRUEsUUFBSSxLQUFLLENBQUMsS0FBTixDQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLE1BQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLElBQXhCO0FBQ0EsTUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFNBQVosR0FBd0IsR0FBeEI7QUFDQSxNQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksWUFBWixHQUEyQixHQUEzQjtBQUNELEtBSkQsTUFJTztBQUNMLE1BQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLEtBQUssQ0FBQyxZQUFOLEdBQXFCLElBQTdDO0FBQ0EsTUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxNQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksWUFBWixHQUEyQixNQUEzQjtBQUNELEtBaEI0QixDQWtCN0I7OztBQUNBLG1CQUFPLElBQVAsQ0FBWSxlQUFaLEVBQTZCLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBekM7QUFDRDtBQUNGOzs7Ozs7Ozs7O0FDcENEOztBQUVBOzs7Ozs7OztBQVFBLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQztBQUM5QixNQUFJLFlBQUo7QUFDQTs7QUFDQSxFQUFBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixPQUFyQixFQUE4QixVQUFTLENBQVQsRUFBWTtBQUN4QyxRQUFJLENBQUo7QUFBQSxRQUNFLENBREY7QUFBQSxRQUVFLENBRkY7QUFBQSxRQUdFLEdBQUcsR0FBRyxLQUFLLEtBSGI7QUFJQTs7QUFDQSxJQUFBLGFBQWE7O0FBQ2IsUUFBSSxDQUFDLEdBQUwsRUFBVTtBQUNSLGFBQU8sS0FBUDtBQUNEOztBQUNELElBQUEsWUFBWSxHQUFHLENBQUMsQ0FBaEI7QUFDQTs7QUFDQSxJQUFBLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFKO0FBQ0EsSUFBQSxDQUFDLENBQUMsWUFBRixDQUFlLElBQWYsRUFBcUIsS0FBSyxFQUFMLEdBQVUsbUJBQS9CO0FBQ0EsSUFBQSxDQUFDLENBQUMsWUFBRixDQUFlLE9BQWYsRUFBd0Isb0JBQXhCO0FBQ0E7O0FBQ0EsU0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLENBQTVCO0FBQ0E7O0FBQ0EsU0FBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBcEIsRUFBNEIsQ0FBQyxFQUE3QixFQUFpQztBQUMvQjtBQUNBLFVBQUksR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLEdBQUcsQ0FBQyxNQUFyQixFQUE2QixXQUE3QixNQUE4QyxHQUFHLENBQUMsV0FBSixFQUFsRCxFQUFxRTtBQUNuRTtBQUNBLFFBQUEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQUo7QUFDQTs7QUFDQSxRQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsYUFBYSxHQUFHLENBQUMsQ0FBRCxDQUFILENBQU8sTUFBUCxDQUFjLENBQWQsRUFBaUIsR0FBRyxDQUFDLE1BQXJCLENBQWIsR0FBNEMsV0FBMUQ7QUFDQSxRQUFBLENBQUMsQ0FBQyxTQUFGLElBQWUsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FBZjtBQUNBOztBQUNBLFFBQUEsQ0FBQyxDQUFDLFNBQUYsSUFBZSxpQ0FBaUMsR0FBRyxDQUFDLENBQUQsQ0FBcEMsR0FBMEMsSUFBekQ7QUFDQTs7QUFDQSxRQUFBLENBQUMsQ0FBQyxnQkFBRixDQUFtQixPQUFuQixFQUE0QixVQUFTLENBQVQsRUFBWTtBQUN0QztBQUNBLFVBQUEsR0FBRyxDQUFDLEtBQUosR0FBWSxLQUFLLG9CQUFMLENBQTBCLE9BQTFCLEVBQW1DLENBQW5DLEVBQXNDLEtBQWxEO0FBQ0E7OztBQUVBLFVBQUEsYUFBYTtBQUNkLFNBTkQ7QUFPQSxRQUFBLENBQUMsQ0FBQyxXQUFGLENBQWMsQ0FBZDtBQUNEO0FBQ0Y7QUFDRixHQXZDRDtBQXdDQTs7QUFDQSxFQUFBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixTQUFyQixFQUFnQyxVQUFTLENBQVQsRUFBWTtBQUMxQyxRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixLQUFLLEVBQUwsR0FBVSxtQkFBbEMsQ0FBUjtBQUNBLFFBQUksQ0FBSixFQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQUYsQ0FBdUIsS0FBdkIsQ0FBSjs7QUFDUCxRQUFJLENBQUMsQ0FBQyxPQUFGLElBQWEsRUFBakIsRUFBcUI7QUFDbkI7O0FBRUEsTUFBQSxZQUFZO0FBQ1o7O0FBQ0EsTUFBQSxTQUFTLENBQUMsQ0FBRCxDQUFUO0FBQ0QsS0FORCxNQU1PLElBQUksQ0FBQyxDQUFDLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUMxQjs7QUFDQTs7QUFFQSxNQUFBLFlBQVk7QUFDWjs7QUFDQSxNQUFBLFNBQVMsQ0FBQyxDQUFELENBQVQ7QUFDRCxLQVBNLE1BT0EsSUFBSSxDQUFDLENBQUMsT0FBRixJQUFhLEVBQWpCLEVBQXFCO0FBQzFCO0FBQ0EsTUFBQSxDQUFDLENBQUMsY0FBRjs7QUFDQSxVQUFJLFlBQVksR0FBRyxDQUFDLENBQXBCLEVBQXVCO0FBQ3JCO0FBQ0EsWUFBSSxDQUFKLEVBQU8sQ0FBQyxDQUFDLFlBQUQsQ0FBRCxDQUFnQixLQUFoQjtBQUNSO0FBQ0Y7QUFDRixHQXhCRDs7QUF5QkEsV0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCO0FBQ3BCO0FBQ0EsUUFBSSxDQUFDLENBQUwsRUFBUSxPQUFPLEtBQVA7QUFDUjs7QUFDQSxJQUFBLFlBQVksQ0FBQyxDQUFELENBQVo7QUFDQSxRQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsTUFBdEIsRUFBOEIsWUFBWSxHQUFHLENBQWY7QUFDOUIsUUFBSSxZQUFZLEdBQUcsQ0FBbkIsRUFBc0IsWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBMUI7QUFDdEI7O0FBQ0EsSUFBQSxDQUFDLENBQUMsWUFBRCxDQUFELENBQWdCLFNBQWhCLENBQTBCLEdBQTFCLENBQThCLHFCQUE5QjtBQUNEOztBQUNELFdBQVMsWUFBVCxDQUFzQixDQUF0QixFQUF5QjtBQUN2QjtBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXRCLEVBQThCLENBQUMsRUFBL0IsRUFBbUM7QUFDakMsTUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IscUJBQXRCO0FBQ0Q7QUFDRjs7QUFDRCxXQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDNUI7O0FBRUEsUUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLHNCQUFULENBQWdDLG9CQUFoQyxDQUFSOztBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXRCLEVBQThCLENBQUMsRUFBL0IsRUFBbUM7QUFDakMsVUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUQsQ0FBVixJQUFpQixLQUFLLElBQUksR0FBOUIsRUFBbUM7QUFDakMsUUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssVUFBTCxDQUFnQixXQUFoQixDQUE0QixDQUFDLENBQUMsQ0FBRCxDQUE3QjtBQUNEO0FBQ0Y7QUFDRjtBQUNEOzs7QUFDQSxFQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFTLENBQVQsRUFBWTtBQUM3QyxJQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBSCxDQUFiO0FBQ0QsR0FGRDtBQUdEOzs7Ozs7Ozs7O0FDN0dELFNBQVMsZUFBVCxHQUEyQjtBQUN6QjtBQUNBLE1BQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLHVCQUF2QixDQUFUO0FBQ0EsTUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIseUJBQXZCLENBQVg7QUFDQSxNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QiwwQkFBdkIsQ0FBWjtBQUNBLE1BQUksVUFBVSxHQUNaLEtBQUssSUFBSSxJQUFULEdBQWdCLEtBQUssQ0FBQyxVQUFOLENBQWlCLFdBQWpCLENBQTZCLFlBQTdDLEdBQTRELENBRDlELENBTHlCLENBUXpCOztBQUNBLE1BQUksRUFBRSxJQUFJLElBQVYsRUFBZ0I7QUFJZDtBQUpjLFFBS0wsUUFMSyxHQUtkLFNBQVMsUUFBVCxHQUFvQjtBQUNsQjtBQUNBLE1BQUEsS0FBSyxDQUFDLFNBQU4sSUFBbUIsVUFBbkI7QUFDRCxLQVJhOztBQUFBLFFBVUwsVUFWSyxHQVVkLFNBQVMsVUFBVCxHQUFzQjtBQUNwQjtBQUNBLE1BQUEsS0FBSyxDQUFDLFNBQU4sSUFBbUIsVUFBbkI7QUFDRCxLQWJhOztBQUNkLElBQUEsRUFBRSxDQUFDLGdCQUFILENBQW9CLE9BQXBCLEVBQTZCLFFBQTdCO0FBQ0EsSUFBQSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBL0I7QUFZRDtBQUNGOzs7Ozs7Ozs7O0FDeEJEO0FBRUEsU0FBUyxZQUFULEdBQXdCO0FBQ3RCO0FBQ0EsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLGlCQUFELENBQXhCO0FBQ0EsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLGlEQUFELENBQXJCO0FBQ0EsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLG9EQUFELENBQXZCO0FBQ0EsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsK0NBQUQsQ0FBMUIsQ0FMc0IsQ0FNdEI7O0FBQ0EsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsMkNBQUQsQ0FBM0I7QUFDQSxNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FDcEMsaUJBQWlCLENBQUMsSUFBbEIsR0FBeUIsT0FBekIsQ0FBaUMsS0FBakMsRUFBd0MsRUFBeEMsQ0FEb0MsQ0FBVixDQUUxQixPQUYwQixDQUVsQixDQUZrQixDQUE1QjtBQUlBLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLDRCQUFELENBQWhDO0FBQ0EsTUFBTSx3QkFBd0IsR0FBRyxVQUFVLENBQ3pDLHNCQUFzQixDQUFDLElBQXZCLEdBQThCLE9BQTlCLENBQXNDLEtBQXRDLEVBQTZDLEVBQTdDLENBRHlDLENBQVYsQ0FFL0IsT0FGK0IsQ0FFdkIsQ0FGdUIsQ0FBakM7QUFJQSxNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFsQixHQUF5QixTQUF6QixDQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxDQUF2QjtBQUNBLE1BQUksVUFBVSxHQUFHLEVBQWpCO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsTUFBSSxpQkFBaUIsR0FBRyxDQUF4QjtBQUNBLE1BQUksZ0JBQWdCLEdBQUcsQ0FBdkI7QUFDQSxNQUFJLFVBQVUsR0FBRyxDQUFqQjs7QUFFQSxNQUFJLGNBQWMsSUFBSSxNQUF0QixFQUFnQztBQUM5QixJQUFBLFVBQVUsR0FBRyxHQUFiO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsSUFBQSxVQUFVLEdBQUcsR0FBYjtBQUNELEdBNUJxQixDQThCdEI7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLEVBQUEsQ0FBQyxDQUFDLDZCQUFELENBQUQsQ0FBaUMsTUFBakMsQ0FBd0MsVUFBUyxHQUFULEVBQWM7QUFDcEQ7QUFDQSxJQUFBLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQUosQ0FBa0IsS0FBbkIsQ0FBckIsQ0FGb0QsQ0FJcEQ7O0FBQ0EsUUFBSSxVQUFVLEdBQUcsQ0FBakIsRUFBb0I7QUFDbEIsTUFBQSxjQUFjLENBQUMsSUFBZjtBQUNELEtBRkQsTUFFTztBQUNMLE1BQUEsY0FBYyxDQUFDLElBQWY7QUFDRDs7QUFFRCxRQUFJLFVBQVUsR0FBRyxDQUFiLElBQWtCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQWpCLENBQXRCLEVBQW9EO0FBQ2xEO0FBQ0E7QUFDQSxVQUFJLFVBQVUsR0FBRyxDQUFiLElBQWtCLFVBQVUsSUFBSSxDQUFwQyxFQUF1QztBQUNyQyxRQUFBLGlCQUFpQixHQUFHLG1CQUFwQjtBQUNBLFFBQUEsZ0JBQWdCLEdBQUcsaUJBQW5CO0FBQ0QsT0FOaUQsQ0FRbEQ7OztBQUNBLFVBQUksVUFBVSxHQUFHLENBQWpCLEVBQW9CO0FBQ2xCLFFBQUEsaUJBQWlCLEdBQUcsbUJBQXBCLENBRGtCLENBRWxCOztBQUNBLFFBQUEsZ0JBQWdCLEdBQ2QsQ0FBQyxpQkFBRCxHQUFxQixDQUFDLENBQUMsVUFBRCxHQUFjLENBQWYsSUFBb0IsQ0FBQyx3QkFENUM7QUFFRDtBQUNGOztBQUVELElBQUEsVUFBVSxHQUFHLFVBQVUsQ0FBQyxnQkFBRCxDQUFWLENBQTZCLE9BQTdCLENBQXFDLENBQXJDLENBQWI7O0FBRUEsUUFBSSxVQUFVLEdBQUcsRUFBYixJQUFtQixVQUFVLElBQUksRUFBckMsRUFBeUM7QUFDdkMsTUFBQSxpQkFBaUIsQ0FBQyxJQUFsQixDQUF1QixjQUFjLEdBQUcsVUFBeEMsRUFEdUMsQ0FFdkM7O0FBQ0EsTUFBQSxnQkFBZ0IsQ0FBQyxRQUFqQixDQUEwQixTQUExQixFQUh1QyxDQUl2Qzs7QUFDQSxNQUFBLFdBQVcsQ0FBQyxJQUFaO0FBQ0EsTUFBQSxhQUFhLENBQUMsSUFBZDtBQUNBLE1BQUEsZ0JBQWdCLENBQUMsSUFBakI7QUFDRCxLQVJELE1BUU8sSUFBSSxVQUFVLEdBQUcsQ0FBYixJQUFrQixVQUFVLElBQUksRUFBcEMsRUFBd0M7QUFDN0MsTUFBQSxpQkFBaUIsQ0FBQyxJQUFsQixDQUF1QixjQUFjLEdBQUcsVUFBeEM7QUFDQSxNQUFBLFdBQVcsQ0FBQyxJQUFaO0FBQ0EsTUFBQSxhQUFhLENBQUMsSUFBZDtBQUNBLE1BQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsU0FBN0I7QUFDQSxNQUFBLGdCQUFnQixDQUFDLElBQWpCO0FBQ0QsS0FOTSxNQU1BLElBQUksVUFBVSxJQUFJLENBQWxCLEVBQXFCO0FBQzFCLE1BQUEsaUJBQWlCLENBQUMsSUFBbEIsQ0FBdUIsY0FBYyxHQUFHLFVBQXhDO0FBQ0EsTUFBQSxXQUFXLENBQUMsSUFBWjtBQUNBLE1BQUEsYUFBYSxDQUFDLElBQWQ7QUFDQSxNQUFBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLFNBQTdCO0FBQ0EsTUFBQSxnQkFBZ0IsQ0FBQyxJQUFqQjtBQUNELEtBTk0sTUFNQSxJQUFJLFVBQVUsR0FBRyxFQUFqQixFQUFxQjtBQUMxQixNQUFBLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLGNBQWMsR0FBRyxVQUF4QztBQUNBLE1BQUEsZ0JBQWdCLENBQUMsUUFBakIsQ0FBMEIsU0FBMUI7QUFDQSxNQUFBLGFBQWEsQ0FBQyxJQUFkO0FBQ0EsTUFBQSxXQUFXLENBQUMsSUFBWjtBQUNBLE1BQUEsZ0JBQWdCLENBQUMsSUFBakI7QUFDRCxLQU5NLE1BTUE7QUFDTCxNQUFBLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLGNBQWMsR0FBRyxnQkFBeEM7QUFDQSxNQUFBLGFBQWEsQ0FBQyxJQUFkO0FBQ0EsTUFBQSxXQUFXLENBQUMsSUFBWjtBQUNBLE1BQUEsZ0JBQWdCLENBQUMsSUFBakI7QUFDRCxLQTdEbUQsQ0ErRHBEOztBQUNELEdBaEVEO0FBaUVEOzs7Ozs7Ozs7Ozs7OztBQ3RHRCxTQUFTLGdCQUFULEdBQTRCO0FBQzFCO0FBQ0EsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFdBQUQsQ0FBbEI7QUFDQSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixTQUF4QixDQUFoQjtBQUNBLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGtCQUF4QixDQUFyQjtBQUNBLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLG9CQUF4QixDQUFwQjtBQUNBLE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0Isa0JBQXhCLENBQTNCLENBTjBCLENBUTFCOztBQUNBLEVBQUEsWUFBWSxDQUFDLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFVBQXZDO0FBQ0EsRUFBQSxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsT0FBcEMsRUFBNkMsa0JBQTdDLEVBVjBCLENBWTFCOztBQUNBLFdBQVMsVUFBVCxHQUFzQjtBQUNwQixJQUFBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBQXlCLFFBQXpCO0FBQ0Q7O0FBRUQsV0FBUyxrQkFBVCxHQUE4QjtBQUM1QixJQUFBLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFFBQTdCO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUsS0FBVixLQUFvQixNQUF4QixFQUFnQztBQUM5QixJQUFBLFFBQVEsQ0FBQyxJQUFUO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsSUFBQSxRQUFRLENBQUMsSUFBVDtBQUNEOztBQUVELEVBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVLE1BQVYsQ0FBaUIsWUFBVztBQUMxQixRQUFJLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVSxLQUFWLEtBQW9CLE1BQXhCLEVBQWdDO0FBQzlCLE1BQUEsUUFBUSxDQUFDLElBQVQ7QUFDRCxLQUZELE1BRU87QUFDTCxNQUFBLFFBQVEsQ0FBQyxJQUFUO0FBQ0Q7QUFDRixHQU5EO0FBT0Q7O0FBRUQsU0FBUyxZQUFULEdBQXdCO0FBQ3RCO0FBQ0EsTUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBYjtBQUNBLE1BQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLCtCQUF2QixDQUFuQjs7QUFFQSxNQUFJLE1BQU0sSUFBSSxJQUFWLElBQWtCLFlBQVksSUFBSSxJQUF0QyxFQUE0QztBQUsxQztBQUwwQyxRQU1qQyxhQU5pQyxHQU0xQyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsRUFBNEI7QUFDMUIsTUFBQSxHQUFHLENBQUMsY0FBSjtBQUNBLE1BQUEsR0FBRyxDQUFDLGVBQUosR0FGMEIsQ0FJMUI7O0FBQ0EsVUFDRSxZQUFZLENBQUMsS0FBYixDQUFtQixPQUFuQixLQUErQixNQUEvQixJQUNBLFlBQVksQ0FBQyxLQUFiLENBQW1CLE9BQW5CLEtBQStCLEVBRmpDLEVBR0U7QUFDQSxRQUFBLFlBQVksQ0FBQyxLQUFiLENBQW1CLE9BQW5CLEdBQTZCLE9BQTdCO0FBQ0EsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLE1BQWYsR0FDRSxRQUFRLENBQUMsWUFBVCxHQUF3QixZQUFZLENBQUMsWUFBckMsR0FBb0QsSUFEdEQ7QUFFRCxPQVBELE1BT087QUFDTCxRQUFBLFlBQVksQ0FBQyxLQUFiLENBQW1CLE9BQW5CLEdBQTZCLE1BQTdCO0FBQ0EsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLE1BQWYsR0FBd0IsTUFBeEI7QUFDRDtBQUNGLEtBdEJ5Qzs7QUFDMUMsUUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQXRCLENBRDBDLENBRTFDOztBQUNBLElBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLGFBQWpDO0FBb0JEO0FBQ0Y7O0FBRUQsU0FBUyxlQUFULEdBQTJCO0FBQ3pCO0FBQ0E7QUFDQSxFQUFBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFlBQVc7QUFDM0IsSUFBQSxVQUFVO0FBQ1gsR0FGRCxDQUh5QixDQU96Qjs7O0FBQ0EsTUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBYixDQVJ5QixDQVV6Qjs7QUFDQSxNQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBcEIsQ0FYeUIsQ0FhekI7O0FBQ0EsV0FBUyxVQUFULEdBQXNCO0FBQ3BCLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFwQjs7QUFDQSxRQUFJLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLE1BQXpCLEVBQWlDO0FBQy9CLE1BQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsR0FBakIsQ0FBcUIsa0JBQXJCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsTUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixNQUFqQixDQUF3QixrQkFBeEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsU0FBUyxVQUFULEdBQXNCO0FBQ3BCO0FBQ0EsRUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLEtBQW5CLENBQXlCLFVBQVMsR0FBVCxFQUFjO0FBQ3JDLElBQUEsR0FBRyxDQUFDLGNBQUo7QUFDQSxXQUFPLEtBQVA7QUFDRCxHQUhEO0FBS0EsRUFBQSxDQUFDLENBQUMsMENBQUQsQ0FBRCxDQUE4QyxLQUE5QyxDQUFvRCxVQUFTLEdBQVQsRUFBYztBQUNoRSxJQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsV0FBbkIsQ0FBK0IsbUJBQS9CO0FBQ0EsSUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLFFBQW5CLENBQTRCLFNBQTVCO0FBQ0EsSUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLE1BQW5CO0FBQ0QsR0FKRDtBQUtELEMsQ0FFRDs7O0FBQ0EsU0FBUyxjQUFULEdBQTBCO0FBQ3hCLEVBQUEsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0IsRUFBdEIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBVztBQUMzQyxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBWjtBQUVBLElBQUEsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlLFdBQWY7QUFDRCxHQUpEO0FBS0Q7Ozs7Ozs7Ozs7OztBQ2hIRDs7QUFFQSxLQUFLLENBQUMsU0FBTixDQUFnQixPQUFoQixHQUEwQixVQUFTLFFBQVQsRUFBbUIsT0FBbkIsRUFBNEI7QUFDcEQsRUFBQSxPQUFPLEdBQUcsT0FBTyxJQUFJLE1BQXJCOztBQUNBLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsS0FBSyxNQUF6QixFQUFpQyxDQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLElBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLEVBQXVCLEtBQUssQ0FBTCxDQUF2QixFQUFnQyxDQUFoQyxFQUFtQyxJQUFuQztBQUNEO0FBQ0YsQ0FMRDs7QUFPQSxJQUFJLE1BQU0sQ0FBQyxRQUFQLElBQW1CLENBQUMsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsT0FBM0MsRUFBb0Q7QUFDbEQsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixPQUFuQixHQUE2QixLQUFLLENBQUMsU0FBTixDQUFnQixPQUE3QztBQUNELEMsQ0FFRDtBQUNBOzs7QUFFQSxTQUFTLGtCQUFULEdBQThCO0FBQzVCLEVBQUEsQ0FBQyxDQUFDLDJCQUFELENBQUQsQ0FBK0IsSUFBL0IsQ0FBb0MsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQzNELFFBQUksS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFDZixhQUFPLElBQVA7QUFDRDs7QUFDRCxJQUFBLENBQUMsQ0FBQyxPQUFELENBQUQsQ0FBVyxHQUFYLENBQWUsU0FBZixFQUEwQixNQUExQjtBQUNELEdBTEQsRUFENEIsQ0FRNUI7O0FBQ0EsRUFBQSxDQUFDLENBQUMsb0JBQUQsQ0FBRCxDQUF3QixJQUF4QixDQUE2QixVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDcEQsSUFBQSxDQUFDLENBQUMsT0FBRCxDQUFELENBQVcsV0FBWCxDQUF1QixRQUF2QjtBQUNELEdBRkQ7QUFHQSxFQUFBLENBQUMsQ0FBQyxpQ0FBRCxDQUFELENBQXFDLFFBQXJDLENBQThDLFFBQTlDLEVBWjRCLENBYzVCOztBQUNBLEVBQUEsQ0FBQyxDQUFDLGlDQUFELENBQUQsQ0FBcUMsSUFBckMsQ0FBMEMsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQ2pFLElBQUEsQ0FBQyxDQUFDLE9BQUQsQ0FBRCxDQUFXLEdBQVgsQ0FBZSxTQUFmLEVBQTBCLE9BQTFCO0FBQ0QsR0FGRCxFQWY0QixDQW1CNUI7O0FBQ0EsRUFBQSxDQUFDLENBQUMsc0JBQUQsQ0FBRCxDQUEwQixJQUExQixDQUErQixVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDdEQsSUFBQSxDQUFDLENBQUMsT0FBRCxDQUFELENBQVcsR0FBWCxDQUFlLFNBQWYsRUFBMEIsTUFBMUI7QUFDRCxHQUZEO0FBR0EsRUFBQSxDQUFDLENBQUMsa0NBQUQsQ0FBRCxDQUFzQyxHQUF0QyxDQUEwQyxTQUExQyxFQUFxRCxPQUFyRCxFQXZCNEIsQ0F5QjVCOztBQUNBLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUNWLHdDQURVLENBQVo7O0FBR0EsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBeEIsRUFBZ0MsQ0FBQyxFQUFqQyxFQUFxQztBQUNuQyxRQUFJLEdBQUcsQ0FBQyxDQUFELENBQUgsQ0FBTyxhQUFYLEVBQTBCO0FBQ3hCLE1BQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPLG1CQUFQLENBQTJCLE9BQTNCO0FBQ0Q7QUFDRjs7QUFFRCxFQUFBLG9CQUFvQjtBQUNyQjs7QUFFRCxTQUFTLGlCQUFULEdBQTZCO0FBQzNCLEVBQUEsQ0FBQyxDQUFDLG9CQUFELENBQUQsQ0FBd0IsSUFBeEIsQ0FBNkIsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3BELElBQUEsQ0FBQyxDQUFDLE9BQUQsQ0FBRCxDQUNHLFdBREgsQ0FDZSxRQURmLEVBRUcsR0FGSCxDQUVPLFNBRlAsRUFFa0IsT0FGbEI7QUFHRCxHQUpEO0FBTUEsRUFBQSxDQUFDLENBQUMsaUNBQUQsQ0FBRCxDQUFxQyxJQUFyQyxDQUEwQyxVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDakUsSUFBQSxDQUFDLENBQUMsT0FBRCxDQUFELENBQVcsR0FBWCxDQUFlLFNBQWYsRUFBMEIsTUFBMUI7QUFDRCxHQUZELEVBUDJCLENBVzNCOztBQUNBLEVBQUEsQ0FBQyxDQUFDLHNCQUFELENBQUQsQ0FBMEIsSUFBMUIsQ0FBK0IsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3RELElBQUEsQ0FBQyxDQUFDLE9BQUQsQ0FBRCxDQUFXLEdBQVgsQ0FBZSxTQUFmLEVBQTBCLE1BQTFCO0FBQ0QsR0FGRCxFQVoyQixDQWdCM0I7O0FBQ0EsRUFBQSxDQUFDLENBQUMsb0JBQUQsQ0FBRCxDQUF3QixNQUF4QixHQWpCMkIsQ0FtQjNCOztBQUNBLEVBQUEsbUJBQW1CO0FBQ3BCLEMsQ0FFRDs7O0FBQ0EsU0FBUyx5QkFBVCxHQUFxQztBQUNuQztBQUVBLE1BQUksTUFBTSxDQUFDLFVBQVAsR0FBb0IsSUFBeEIsRUFBOEI7QUFDNUI7OztBQUdBLElBQUEsa0JBQWtCO0FBQ25CLEdBTEQsTUFLTztBQUNMOzs7QUFHQSxJQUFBLGlCQUFpQjtBQUNsQixHQWJrQyxDQWVuQzs7O0FBRUEsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBUyxHQUFULEVBQWM7QUFDOUM7QUFFQSxRQUFJLEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBWCxHQUF3QixJQUE1QixFQUFrQztBQUNoQzs7O0FBR0EsTUFBQSxrQkFBa0I7QUFDbkIsS0FMRCxNQUtPO0FBQ0w7OztBQUdBLE1BQUEsaUJBQWlCO0FBQ2xCO0FBQ0YsR0FkRDtBQWVEO0FBRUQ7Ozs7Ozs7QUFLQSxTQUFTLG1CQUFULEdBQStCO0FBQzdCO0FBQ0EsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGdCQUFULENBQ1Ysd0NBRFUsQ0FBWjtBQUdBLE1BQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUIsQ0FBdEI7QUFDQSxNQUFJLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixzQkFBMUIsQ0FBeEI7QUFDQSxNQUFJLGVBQWUsR0FBRyxFQUF0QjtBQUVBLE1BQUksZ0JBQWdCLEdBQUcsRUFBdkIsQ0FUNkIsQ0FXN0I7O0FBQ0EsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBeEIsRUFBZ0MsQ0FBQyxFQUFqQyxFQUFxQztBQUNuQyxJQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsQ0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxnQkFBakM7QUFDRCxHQWQ0QixDQWdCN0I7OztBQUNBLFdBQVMsZ0JBQVQsQ0FBMEIsR0FBMUIsRUFBK0I7QUFDN0I7O0FBQ0E7QUFDQSxJQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFNBQWxCLENBQTRCLE1BQTVCLENBQW1DLFFBQW5DLEVBSDZCLENBSzdCOztBQUNBLFFBQUksZ0JBQWdCLEtBQUssVUFBekIsRUFBcUM7QUFDbkM7QUFFQSxNQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFNBQWxCLEdBQThCLGtCQUE5QixDQUhtQyxDQUtuQzs7QUFDQSxXQUFLLElBQUksRUFBQyxHQUFHLENBQWIsRUFBZ0IsRUFBQyxHQUFHLGVBQWUsQ0FBQyxNQUFwQyxFQUE0QyxFQUFDLEVBQTdDLEVBQWlEO0FBQy9DLFFBQUEsZUFBZSxDQUFDLEVBQUQsQ0FBZixDQUFtQixTQUFuQixDQUE2QixNQUE3QixDQUFvQyxRQUFwQzs7QUFDQSxRQUFBLGVBQWUsQ0FBQyxFQUFELENBQWYsQ0FBbUIsS0FBbkIsQ0FBeUIsT0FBekIsR0FBbUMsT0FBbkM7QUFDRCxPQVRrQyxDQVduQzs7O0FBQ0EsTUFBQSxRQUFRLENBQ0wsZ0JBREgsQ0FFSSxpRUFGSixFQUlHLE9BSkgsQ0FJVyxVQUFTLE9BQVQsRUFBa0I7QUFDekIsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLE9BQWQsR0FBd0IsTUFBeEI7QUFDRCxPQU5ILEVBWm1DLENBb0JuQzs7QUFDQSxNQUFBLGlCQUFpQixDQUFDLE9BQWxCLENBQTBCLFVBQVMsT0FBVCxFQUFrQjtBQUMxQztBQUNBLFFBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxPQUFkLEdBQXdCLE1BQXhCO0FBQ0QsT0FIRDtBQUtBLE1BQUEsZ0JBQWdCLEdBQUcsRUFBbkI7QUFDRCxLQTNCRCxNQTJCTztBQUNMO0FBRUEsTUFBQSxHQUFHLENBQUMsYUFBSixDQUFrQixTQUFsQixHQUE4QixvQkFBOUIsQ0FISyxDQUtMOztBQUNBLE1BQUEsR0FBRyxDQUFDLGFBQUosQ0FBa0IsU0FBbEIsQ0FBNEIsR0FBNUIsQ0FBZ0MsUUFBaEM7QUFFQTs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFVBQWxCLENBQTZCLFVBQTdCLENBQXdDLFVBQXhDLENBQW1ELFVBQW5ELENBQThELFNBQTlELENBQXdFLEdBQXhFLENBQ0UsUUFERixFQVRLLENBYUw7O0FBQ0EsTUFBQSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsMkJBQXZCLEVBQ2YsT0FEZSxDQUNQLE1BRFgsQ0FkSyxDQWlCTDs7QUFDQSxXQUFLLElBQUksR0FBQyxHQUFHLENBQWIsRUFBZ0IsR0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFwQyxFQUE0QyxHQUFDLEVBQTdDLEVBQWlEO0FBQy9DLFlBQUksZUFBZSxDQUFDLEdBQUQsQ0FBZixDQUFtQixZQUFuQixDQUFnQyxPQUFoQyxFQUF5QyxPQUF6QyxDQUFpRCxRQUFqRCxJQUE2RCxDQUFqRSxFQUFvRTtBQUNsRSxVQUFBLGVBQWUsQ0FBQyxHQUFELENBQWYsQ0FBbUIsS0FBbkIsQ0FBeUIsT0FBekIsR0FBbUMsTUFBbkM7QUFDRCxTQUZELE1BRU87QUFDTCxVQUFBLGVBQWUsQ0FBQyxHQUFELENBQWYsQ0FBbUIsS0FBbkIsQ0FBeUIsT0FBekIsR0FBbUMsT0FBbkM7QUFDRDtBQUNGLE9BeEJJLENBMEJMOzs7QUFDQSxNQUFBLFFBQVEsQ0FBQyxhQUFULENBQ0UscUNBQXFDLGVBQXJDLEdBQXVELGlCQUR6RCxFQUVFLEtBRkYsQ0FFUSxPQUZSLEdBRWtCLE9BRmxCO0FBSUEsTUFBQSxnQkFBZ0IsR0FBRyxVQUFuQixDQS9CSyxDQWlDTDs7QUFDQSxNQUFBLGlCQUFpQixDQUFDLE9BQWxCLENBQTBCLFVBQVMsT0FBVCxFQUFrQjtBQUMxQyxRQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsT0FBZCxHQUF3QixNQUF4QjtBQUNELE9BRkQsRUFsQ0ssQ0FzQ0w7O0FBQ0EsVUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FDViwwQkFBMEIsZUFEaEIsQ0FBWjtBQUdBLE1BQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxPQUFaLEdBQXNCLE9BQXRCOztBQUVBLFVBQUksS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixRQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBWixHQUF3QixJQUF4QjtBQUNBLFFBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLEdBQXhCO0FBQ0EsUUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxPQUpELE1BSU87QUFDTCxRQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBWixHQUF3QixLQUFLLENBQUMsWUFBTixHQUFxQixJQUE3QztBQUNBLFFBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE9BQXhCO0FBQ0EsUUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFlBQVosR0FBMkIsTUFBM0I7QUFDRDs7QUFFRCxxQkFBTyxFQUFQLENBQVUsZUFBVixFQUEyQixVQUFBLFNBQVMsRUFBSTtBQUN0QyxZQUFJLFFBQVEsR0FDVixRQUFRLENBQ04sS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLENBQXNCLFNBQXRCLENBQWdDLENBQWhDLEVBQW1DLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBWixDQUFzQixNQUF0QixHQUErQixDQUFsRSxDQURNLENBQVIsR0FHQSxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUIsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBMUMsQ0FBRCxDQUhSLEdBSUEsSUFMRjtBQU9BLFFBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLFFBQXhCO0FBQ0QsT0FURDtBQVVEO0FBQ0YsR0FuSDRCLENBbUgzQjs7QUFDSCxDLENBQUM7O0FBRUY7Ozs7Ozs7QUFLQSxTQUFTLG9CQUFULEdBQWdDO0FBQzlCO0FBQ0E7QUFDQSxFQUFBLENBQUMsQ0FBQyxvQkFBRCxDQUFELENBQXdCLEtBQXhCLENBQThCLFVBQVMsR0FBVCxFQUFjO0FBQzFDLElBQUEsQ0FBQyxDQUFDLG9CQUFELENBQUQsQ0FBd0IsSUFBeEIsQ0FBNkIsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3BELE1BQUEsQ0FBQyxDQUFDLE9BQUQsQ0FBRCxDQUFXLFdBQVgsQ0FBdUIsUUFBdkI7QUFDRCxLQUZEO0FBR0EsSUFBQSxHQUFHLENBQUMsYUFBSixDQUFrQixTQUFsQixDQUE0QixHQUE1QixDQUFnQyxRQUFoQyxFQUowQyxDQUsxQzs7QUFDQSxJQUFBLENBQUMsQ0FBQywyQkFBRCxDQUFELENBQStCLElBQS9CLENBQW9DLFVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QjtBQUMzRCxNQUFBLENBQUMsQ0FBQyxPQUFELENBQUQsQ0FBVyxHQUFYLENBQWUsU0FBZixFQUEwQixNQUExQjtBQUNELEtBRkQ7QUFHQSxRQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEsSUFBUixDQUFhLFFBQWIsQ0FBcEI7QUFDQSxJQUFBLENBQUMsQ0FBQyxNQUFNLGFBQVAsQ0FBRCxDQUF1QixHQUF2QixDQUEyQixTQUEzQixFQUFzQyxPQUF0QztBQUNELEdBWEQ7QUFZRCxDLENBQUM7Ozs7Ozs7OztBQy9QRjtBQUNBO0FBQ0E7QUFFQSxJQUFJLE1BQU0sR0FBRztBQUNYO0FBQ0EsRUFBQSxNQUFNLEVBQUUsRUFGRztBQUlYLEVBQUEsRUFBRSxFQUFFLFlBQVMsU0FBVCxFQUFvQixFQUFwQixFQUF3QjtBQUMxQixTQUFLLE1BQUwsQ0FBWSxTQUFaLElBQXlCLEtBQUssTUFBTCxDQUFZLFNBQVosS0FBMEIsRUFBbkQ7QUFDQSxTQUFLLE1BQUwsQ0FBWSxTQUFaLEVBQXVCLElBQXZCLENBQTRCLEVBQTVCO0FBQ0QsR0FQVTtBQVNYLEVBQUEsR0FBRyxFQUFFLGFBQVMsU0FBVCxFQUFvQixFQUFwQixFQUF3QjtBQUMzQixRQUFJLEtBQUssTUFBTCxDQUFZLFNBQVosQ0FBSixFQUE0QjtBQUMxQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLEtBQUssTUFBTCxDQUFZLFNBQVosRUFBdUIsTUFBM0MsRUFBbUQsQ0FBQyxFQUFwRCxFQUF3RDtBQUN0RCxZQUFJLEtBQUssTUFBTCxDQUFZLFNBQVosRUFBdUIsQ0FBdkIsTUFBOEIsRUFBbEMsRUFBc0M7QUFDcEMsZUFBSyxNQUFMLENBQVksU0FBWixFQUF1QixNQUF2QixDQUE4QixDQUE5QixFQUFpQyxDQUFqQztBQUNBO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsR0FsQlU7QUFvQlgsRUFBQSxJQUFJLEVBQUUsY0FBUyxTQUFULEVBQW9CLElBQXBCLEVBQTBCO0FBQzlCLFFBQUksS0FBSyxNQUFMLENBQVksU0FBWixDQUFKLEVBQTRCO0FBQzFCLFdBQUssTUFBTCxDQUFZLFNBQVosRUFBdUIsT0FBdkIsQ0FBK0IsVUFBUyxFQUFULEVBQWE7QUFDMUMsUUFBQSxFQUFFLENBQUMsSUFBRCxDQUFGO0FBQ0QsT0FGRDtBQUdEO0FBQ0Y7QUExQlUsQ0FBYjs7Ozs7Ozs7Ozs7QUNKQTtBQUVBLFNBQVMsVUFBVCxHQUFzQjtBQUNwQjtBQUNBLEVBQUEsQ0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQixLQUFqQixDQUF1QixVQUFTLENBQVQsRUFBWTtBQUNqQyxJQUFBLENBQUMsQ0FBQyxjQUFGO0FBQ0EsUUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQUQsQ0FBRCxDQUFXLEVBQVgsQ0FBYyxVQUFkLENBQVQ7QUFDQSxJQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUSxJQUFSLENBQ0UsRUFBRSxHQUFHLDJCQUFILEdBQWlDLDJCQURyQztBQUdBLElBQUEsQ0FBQyxDQUFDLE9BQUQsQ0FBRCxDQUFXLFdBQVg7QUFDRCxHQVBEO0FBUUQ7Ozs7Ozs7Ozs7O0FDWkQ7QUFFQSxTQUFTLFlBQVQsQ0FBc0IsY0FBdEIsRUFBc0M7QUFDcEMsTUFBSSxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBUixJQUFtQixjQUFjLEdBQUcsRUFBcEMsQ0FBakI7QUFBQSxNQUNFLGNBQWMsR0FBRyxXQUFXLENBQUMsWUFBVztBQUN0QyxRQUFJLE1BQU0sQ0FBQyxPQUFQLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLE1BQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsVUFBbkI7QUFDRCxLQUZELE1BRU8sYUFBYSxDQUFDLGNBQUQsQ0FBYjtBQUNSLEdBSjJCLEVBSXpCLEVBSnlCLENBRDlCO0FBTUQ7O0FBRUQsU0FBUyx5QkFBVCxDQUFtQyxjQUFuQyxFQUFtRDtBQUNqRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBUCxHQUFpQixDQUF0QztBQUNBLE1BQUksV0FBVyxHQUFHLENBQWxCO0FBQUEsTUFDRSxZQUFZLEdBQUcsV0FBVyxDQUFDLEdBQVosRUFEakI7O0FBR0EsV0FBUyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUMxQixJQUFBLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBTCxJQUFXLGNBQWMsSUFBSSxZQUFZLEdBQUcsWUFBbkIsQ0FBekIsQ0FBZjtBQUNBLFFBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxFQUF4QixFQUE0QixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQUFtQixDQUFuQjtBQUM1QixRQUFJLE1BQU0sQ0FBQyxPQUFQLEtBQW1CLENBQXZCLEVBQTBCO0FBQzFCLElBQUEsTUFBTSxDQUFDLFFBQVAsQ0FDRSxDQURGLEVBRUUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFZLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsV0FBVCxDQUF6QyxDQUZGO0FBSUEsSUFBQSxZQUFZLEdBQUcsWUFBZjtBQUNBLElBQUEsTUFBTSxDQUFDLHFCQUFQLENBQTZCLElBQTdCO0FBQ0Q7O0FBRUQsRUFBQSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsSUFBN0I7QUFDRDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7QUFjQSxTQUFTLFdBQVQsR0FBdUI7QUFDckI7QUFDQSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixpQkFBdkIsQ0FBckIsQ0FGcUIsQ0FJckI7O0FBQ0EsTUFBSSxZQUFZLElBQUksSUFBcEIsRUFBMEI7QUFDeEIsSUFBQSxZQUFZLENBQUMsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsbUJBQXZDO0FBQ0QsR0FQb0IsQ0FTckI7OztBQUNBLFdBQVMsbUJBQVQsQ0FBNkIsR0FBN0IsRUFBa0M7QUFDaEM7QUFDQSxJQUFBLEdBQUcsQ0FBQyxjQUFKOztBQUNBLElBQUEseUJBQXlCLENBQUMsSUFBRCxDQUF6QixDQUhnQyxDQUtoQzs7QUFDRDtBQUNGOztBQUVELFNBQVMsV0FBVCxHQUF1QjtBQUNyQjtBQUNBLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxnQkFBVCxDQUNwQiwrQkFEb0IsQ0FBdEI7QUFJQSxFQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFXO0FBQzNDLFFBQUksQ0FBQyxHQUNILE1BQU0sQ0FBQyxVQUFQLElBQ0EsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsV0FEekIsSUFFQSxRQUFRLENBQUMsSUFBVCxDQUFjLFdBSGhCOztBQUlBLFFBQUksQ0FBQyxHQUFHLElBQVIsRUFBYztBQUNaLFVBQUksQ0FBSjs7QUFDQSxXQUFLLENBQUMsR0FBRyxDQUFULEVBQVksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUE5QixFQUFzQyxDQUFDLEVBQXZDLEVBQTJDO0FBQ3pDLFFBQUEsYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQixZQUFqQixDQUE4QixVQUE5QixFQUEwQyxJQUExQztBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxDQUFDLElBQUksSUFBVCxFQUFlO0FBQ2IsVUFBSSxFQUFKOztBQUNBLFdBQUssRUFBQyxHQUFHLENBQVQsRUFBWSxFQUFDLEdBQUcsYUFBYSxDQUFDLE1BQTlCLEVBQXNDLEVBQUMsRUFBdkMsRUFBMkM7QUFDekMsUUFBQSxhQUFhLENBQUMsRUFBRCxDQUFiLENBQWlCLGVBQWpCLENBQWlDLFVBQWpDO0FBQ0Q7QUFDRjtBQUNGLEdBbEJEO0FBbUJEOzs7Ozs7Ozs7O0FDeEZEO0FBRUEsU0FBUyxRQUFULEdBQW9CO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLE1BQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxjQUFELENBQUQsQ0FDWCxHQURXLENBQ1AsWUFETyxFQUVYLEdBRlcsQ0FFUCxhQUZPLENBQWQ7QUFJQSxNQUFJLGtCQUFrQixHQUFHLEVBQXpCLENBUmtCLENBU2xCOztBQUNBLEVBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxjQUFkLEVBVmtCLENBWWxCOztBQUNBLFdBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjtBQUM3QjtBQUNBLFFBQ0UsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsT0FBbEIsQ0FBMEIsS0FBMUIsRUFBaUMsRUFBakMsS0FDRSxLQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLENBREYsSUFFQSxRQUFRLENBQUMsUUFBVCxJQUFxQixLQUFLLFFBSDVCLEVBSUU7QUFDQTtBQUNBLFVBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQU4sQ0FBZDtBQUNBLE1BQUEsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE1BQWhCLEdBQXlCLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBWCxHQUFnQyxHQUFqQyxDQUFuQyxDQUhBLENBSUE7O0FBQ0EsVUFBSSxNQUFNLENBQUMsTUFBWCxFQUFtQjtBQUNqQjtBQUNBLFFBQUEsS0FBSyxDQUFDLGNBQU47QUFDQSxRQUFBLENBQUMsQ0FBQyxZQUFELENBQUQsQ0FBZ0IsT0FBaEIsQ0FDRTtBQUNFLFVBQUEsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLEdBQWhCLEdBQXNCO0FBRG5DLFNBREYsRUFJRSxJQUpGLEVBS0UsWUFBVztBQUNUO0FBQ0E7QUFDQSxjQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBRCxDQUFmO0FBQ0EsVUFBQSxPQUFPLENBQUMsS0FBUjs7QUFDQSxjQUFJLE9BQU8sQ0FBQyxFQUFSLENBQVcsUUFBWCxDQUFKLEVBQTBCO0FBQ3hCO0FBQ0EsbUJBQU8sS0FBUDtBQUNELFdBSEQsTUFHTztBQUNMLFlBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxVQUFiLEVBQXlCLElBQXpCLEVBREssQ0FDMkI7O0FBQ2hDLFlBQUEsT0FBTyxDQUFDLEtBQVIsR0FGSyxDQUVZO0FBQ2xCO0FBQ0YsU0FqQkg7QUFtQkQ7QUFDRjtBQUNGO0FBQ0YsQyxDQUVEOzs7QUFDQSxJQUFJLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsTUFBbkIsR0FBNEIsQ0FBaEMsRUFBbUM7QUFDakMsTUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixNQUFuQixHQUE0QixHQUE1QixHQUFrQyxHQUEvQztBQUNBLEVBQUEsQ0FBQyxDQUFDLFFBQUQsQ0FBRCxDQUFZLE1BQVosQ0FBbUIsWUFBVztBQUM1QixRQUFJLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVSxTQUFWLE1BQXlCLE1BQTdCLEVBQXFDO0FBQ25DLE1BQUEsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0IsSUFBcEI7QUFDRCxLQUZELE1BRU87QUFDTCxNQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CLElBQXBCO0FBQ0Q7QUFDRixHQU5EO0FBT0Q7Ozs7Ozs7Ozs7QUMvREQsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUNFLFFBQVEsQ0FBQyxXQUFULEdBQ0ksUUFBUSxDQUFDLFVBQVQsS0FBd0IsVUFENUIsR0FFSSxRQUFRLENBQUMsVUFBVCxLQUF3QixTQUg5QixFQUlFO0FBQ0EsSUFBQSxFQUFFO0FBQ0gsR0FORCxNQU1PO0FBQ0wsSUFBQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7Ozs7Ozs7OztBQ1ZELFNBQVMsZUFBVCxHQUEyQjtBQUN6QjtBQUNBLE1BQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixDQUFiO0FBQ0EsTUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQWIsQ0FIeUIsQ0FLekI7O0FBQ0EsTUFBSSxNQUFNLElBQUksSUFBVixJQUFrQixNQUFNLElBQUksSUFBaEMsRUFBc0M7QUFDcEMsSUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsV0FBakM7QUFDQSxJQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxXQUFqQztBQUNELEdBVHdCLENBV3pCOzs7QUFDQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFDeEIsUUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLFVBQVY7QUFFQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWixFQUh3QixDQUt4Qjs7QUFDQSxJQUFBLENBQUMsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIscUJBQTFCLENBQUo7O0FBQ0EsU0FBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBbEIsRUFBMEIsQ0FBQyxFQUEzQixFQUErQjtBQUM3QixNQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixNQUFyQjtBQUNELEtBVHVCLENBV3hCOzs7QUFDQSxJQUFBLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIscUJBQTFCLENBQWI7O0FBQ0EsU0FBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBbEIsRUFBMEIsQ0FBQyxFQUEzQixFQUErQjtBQUM3QixNQUFBLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBYyxTQUFkLEdBQTBCLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBYyxTQUFkLENBQXdCLE9BQXhCLENBQWdDLFNBQWhDLEVBQTJDLEVBQTNDLENBQTFCO0FBQ0QsS0FmdUIsQ0FpQnhCO0FBQ0E7OztBQUNBLFFBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFlBQWxCLENBQStCLGNBQS9CLENBQWQ7QUFDQSxJQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQVUsT0FBakMsRUFBMEMsS0FBMUMsQ0FBZ0QsT0FBaEQsR0FBMEQsT0FBMUQ7QUFDQSxJQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFNBQWxCLElBQStCLFNBQS9CO0FBQ0Q7QUFDRjs7Ozs7Ozs7OztBQ25DRDs7QUFFQTtBQUVBLFNBQVMsUUFBVCxHQUFvQjtBQUNsQjtBQUNBLEVBQUEsQ0FBQyxDQUFDLFlBQUQsQ0FBRCxDQUFnQixLQUFoQixDQUFzQixVQUFTLENBQVQsRUFBWTtBQUNoQyxJQUFBLENBQUMsQ0FBQyxjQUFGO0FBQ0EsSUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEsR0FBUixDQUFZLE1BQVo7QUFDRCxHQUhELEVBRmtCLENBT2xCO0FBQ0E7O0FBQ0EsTUFBSSxDQUFDLENBQUMsT0FBRCxDQUFELENBQVcsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN6QixJQUFBLENBQUMsQ0FBQyxJQUFGLENBQU87QUFDTCxNQUFBLElBQUksRUFBRSxLQUREO0FBRUwsTUFBQSxHQUFHLEVBQUUsZ0JBRkE7QUFHTCxNQUFBLE9BQU8sRUFBRSxpQkFBUyxJQUFULEVBQWU7QUFDdEI7QUFDQSxRQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBUCxFQUFhLFVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQjtBQUNoQztBQUNBLFVBQUEsQ0FBQyxvQkFBYSxHQUFHLENBQUMsRUFBakIsUUFBRCxDQUNHLElBREgsQ0FDUSxNQURSLEVBRUcsSUFGSCxDQUVRLEdBQUcsQ0FBQyxLQUZaLEVBRmdDLENBTWhDOztBQUNBLFVBQUEsQ0FBQyxZQUFLLEdBQUcsQ0FBQyxFQUFULEVBQUQsQ0FDRyxJQURILENBQ1EsSUFEUixFQUVHLElBRkgsQ0FFUSxHQUFHLENBQUMsVUFGWixFQVBnQyxDQVdoQzs7QUFDQSxVQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBRyxDQUFDLEdBQVgsRUFBZ0IsVUFBUyxNQUFULEVBQWlCLEVBQWpCLEVBQXFCO0FBQ25DLFlBQUEsQ0FBQyxDQUFDLG1CQUFELGFBQTBCLEdBQUcsQ0FBQyxFQUE5QixFQUFELENBQXFDLE1BQXJDLDhDQUNzQyxFQUFFLENBQUMsUUFEekMsaUlBSU8sRUFBRSxDQUFDLE1BSlY7QUFTRCxXQVZEO0FBV0QsU0F2QkQ7QUF3QkQsT0E3Qkk7QUE4QkwsTUFBQSxLQUFLLEVBQUUsZUFBUyxHQUFULEVBQWMsTUFBZCxFQUFzQixNQUF0QixFQUE2QixDQUNsQztBQUNEO0FBaENJLEtBQVAsRUFEeUIsQ0FrQ3JCOztBQUVKLElBQUEsQ0FBQyxDQUFDLGdDQUFELENBQUQsQ0FBb0MsUUFBcEMsQ0FDRSxnQkFERixFQUVFLE9BRkYsRUFHRSxXQUhGO0FBS0Q7O0FBRUQsRUFBQSxtQkFBbUI7QUFDcEI7O0FBR0QsU0FBUyxtQkFBVCxHQUErQjtBQUM3QjtBQUNBLE1BQUksQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixNQUFuQixHQUE0QixDQUFoQyxFQUFtQztBQUNqQyxRQUFJLElBQUksR0FBRyxDQUFDLENBQUMsZUFBRCxDQUFELENBQ1IsSUFEUSxDQUNILE1BREcsRUFFUixPQUZRLENBRUEsSUFGQSxFQUVNLEVBRk4sQ0FBWCxDQURpQyxDQUtqQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBQSxLQUFLLGdCQUFTLElBQVQsZ0JBQUwsQ0FBZ0MsSUFBaEMsQ0FBcUMsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZEO0FBQ0EsYUFBUSxRQUFRLENBQUMsSUFBVCxFQUFSO0FBQ0QsS0FIRCxFQUdHLElBSEgsQ0FHUSxVQUFVLFFBQVYsRUFBb0I7QUFDMUIsTUFBQSxlQUFlLENBQUMsUUFBRCxDQUFmO0FBQ0QsS0FMRCxXQUtTLFVBQVUsS0FBVixFQUFpQjtBQUN4QixNQUFBLGVBQWUsQ0FBQyxLQUFELENBQWY7QUFDRCxLQVBEO0FBU0EsSUFBQSxDQUFDLENBQUMsZ0NBQUQsQ0FBRCxDQUFvQyxRQUFwQyxDQUNFLGdCQURGLEVBRUUsT0FGRixFQUdFLFdBSEY7QUFLRDtBQUNGOztBQUdELFNBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQjtBQUM3QjtBQUNBLEVBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFQLEVBQWEsVUFBVSxNQUFWLEVBQWtCLEdBQWxCLEVBQXVCO0FBQ2xDO0FBQ0EsSUFBQSxDQUFDLENBQUMsbUJBQUQsQ0FBRCxDQUF1QixNQUF2Qiw4Q0FDc0MsR0FBRyxDQUFDLFFBRDFDLHdIQUlZLEdBQUcsQ0FBQyxNQUpoQjtBQVNELEdBWEQsRUFGNkIsQ0FlN0I7O0FBQ0EsRUFBQSxDQUFDLENBQUMsc0JBQUQsQ0FBRCxDQUEwQixJQUExQjtBQUNEOztBQUVELFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQztBQUM5QixFQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsU0FBZCxFQUF5QixLQUF6QjtBQUNEOztBQUVELFNBQVMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN4Qjs7QUFFQSxFQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLFNBQWxCLENBQTRCLE1BQTVCLENBQW1DLFFBQW5DO0FBRUE7O0FBQ0EsTUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLGFBQUosQ0FBa0Isa0JBQTlCOztBQUNBLE1BQUksS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixJQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBWixHQUF3QixJQUF4QjtBQUNBLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLEdBQXhCO0FBQ0EsSUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxHQUpELE1BSU87QUFDTCxJQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBWixHQUF3QixLQUFLLENBQUMsWUFBTixHQUFxQixJQUE3QztBQUNBLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE9BQXhCO0FBQ0EsSUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFlBQVosR0FBMkIsTUFBM0I7QUFDRDtBQUNGOzs7OztBQ3ZJRDs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFPQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFLQTs7QUFFQSxJQUFJLGdCQUFnQixHQUFHLElBQXZCOztBQUVBLFNBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFUZSxDQVdmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FsQmUsQ0FtQmY7QUFDQTs7QUFDQTtBQUNBO0FBQ0Esb0NBdkJlLENBd0JmO0FBQ0Q7O0FBRUQsa0JBQU0sS0FBTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpbXBvcnQgeyBldmVudHMgfSBmcm9tICcuL1B1YlN1Yic7XHJcblxyXG4vLyBtb2R1bGUgXCJBY2NvcmRpb24uanNcIlxyXG5cclxuZnVuY3Rpb24gQWNjb3JkaW9uKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBhY2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJ0bicpO1xyXG5cclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGxldCBpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcclxuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBhY2NvcmRpb25IYW5kbGVyKGV2dCkge1xyXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcclxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuXHJcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xyXG4gICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGVsbCB0aGUgcGFyZW50IGFjY29yZGlvbiB0byBhZGp1c3QgaXRzIGhlaWdodFxyXG4gICAgZXZlbnRzLmVtaXQoJ2hlaWdodENoYW5nZWQnLCBwYW5lbC5zdHlsZS5tYXhIZWlnaHQpO1xyXG4gIH1cclxufVxyXG5leHBvcnQgeyBBY2NvcmRpb24gfTtcclxuIiwiLy8gbW9kdWxlIFwiQXV0b0NvbXBsZXRlLmpzXCJcclxuXHJcbi8qKlxyXG4gKiBbQXV0b0NvbXBsZXRlIGRlc2NyaXB0aW9uXVxyXG4gKlxyXG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgdXNlcklucHV0ICB1c2VyIGlucHV0XHJcbiAqIEBwYXJhbSAgIHthcnJheX0gIHNlYXJjaExpc3QgIHNlYXJjaCBsaXN0XHJcbiAqXHJcbiAqIEByZXR1cm4gIHtbdHlwZV19ICAgICAgIFtyZXR1cm4gZGVzY3JpcHRpb25dXHJcbiAqL1xyXG5mdW5jdGlvbiBBdXRvQ29tcGxldGUoaW5wLCBhcnIpIHtcclxuICB2YXIgY3VycmVudEZvY3VzO1xyXG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSB3cml0ZXMgaW4gdGhlIHRleHQgZmllbGQ6Ki9cclxuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgYSxcclxuICAgICAgYixcclxuICAgICAgaSxcclxuICAgICAgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgIC8qY2xvc2UgYW55IGFscmVhZHkgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyovXHJcbiAgICBjbG9zZUFsbExpc3RzKCk7XHJcbiAgICBpZiAoIXZhbCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50Rm9jdXMgPSAtMTtcclxuICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGl0ZW1zICh2YWx1ZXMpOiovXHJcbiAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBhLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XHJcbiAgICBhLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XHJcbiAgICAvKmFwcGVuZCB0aGUgRElWIGVsZW1lbnQgYXMgYSBjaGlsZCBvZiB0aGUgYXV0b2NvbXBsZXRlIGNvbnRhaW5lcjoqL1xyXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgLypmb3IgZWFjaCBpdGVtIGluIHRoZSBhcnJheS4uLiovXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8qY2hlY2sgaWYgdGhlIGl0ZW0gc3RhcnRzIHdpdGggdGhlIHNhbWUgbGV0dGVycyBhcyB0aGUgdGV4dCBmaWVsZCB2YWx1ZToqL1xyXG4gICAgICBpZiAoYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgLypjcmVhdGUgYSBESVYgZWxlbWVudCBmb3IgZWFjaCBtYXRjaGluZyBlbGVtZW50OiovXHJcbiAgICAgICAgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgICAgIC8qbWFrZSB0aGUgbWF0Y2hpbmcgbGV0dGVycyBib2xkOiovXHJcbiAgICAgICAgYi5pbm5lckhUTUwgPSAnPHN0cm9uZz4nICsgYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKSArICc8L3N0cm9uZz4nO1xyXG4gICAgICAgIGIuaW5uZXJIVE1MICs9IGFycltpXS5zdWJzdHIodmFsLmxlbmd0aCk7XHJcbiAgICAgICAgLyppbnNlcnQgYSBpbnB1dCBmaWVsZCB0aGF0IHdpbGwgaG9sZCB0aGUgY3VycmVudCBhcnJheSBpdGVtJ3MgdmFsdWU6Ki9cclxuICAgICAgICBiLmlubmVySFRNTCArPSBcIjxpbnB1dCB0eXBlPSdoaWRkZW4nIHZhbHVlPSdcIiArIGFycltpXSArIFwiJz5cIjtcclxuICAgICAgICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIG9uIHRoZSBpdGVtIHZhbHVlIChESVYgZWxlbWVudCk6Ki9cclxuICAgICAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgLyppbnNlcnQgdGhlIHZhbHVlIGZvciB0aGUgYXV0b2NvbXBsZXRlIHRleHQgZmllbGQ6Ki9cclxuICAgICAgICAgIGlucC52YWx1ZSA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF0udmFsdWU7XHJcbiAgICAgICAgICAvKmNsb3NlIHRoZSBsaXN0IG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzLFxyXG4gICAgICAgICAgICAob3IgYW55IG90aGVyIG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXM6Ki9cclxuICAgICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhLmFwcGVuZENoaWxkKGIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gcHJlc3NlcyBhIGtleSBvbiB0aGUga2V5Ym9hcmQ6Ki9cclxuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCArICdhdXRvY29tcGxldGUtbGlzdCcpO1xyXG4gICAgaWYgKHgpIHggPSB4LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICAgIGlmIChlLmtleUNvZGUgPT0gNDApIHtcclxuICAgICAgLypJZiB0aGUgYXJyb3cgRE9XTiBrZXkgaXMgcHJlc3NlZCxcclxuICAgICAgaW5jcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xyXG4gICAgICBjdXJyZW50Rm9jdXMrKztcclxuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cclxuICAgICAgYWRkQWN0aXZlKHgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzgpIHtcclxuICAgICAgLy91cFxyXG4gICAgICAvKklmIHRoZSBhcnJvdyBVUCBrZXkgaXMgcHJlc3NlZCxcclxuICAgICAgZGVjcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xyXG4gICAgICBjdXJyZW50Rm9jdXMtLTtcclxuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cclxuICAgICAgYWRkQWN0aXZlKHgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgLypJZiB0aGUgRU5URVIga2V5IGlzIHByZXNzZWQsIHByZXZlbnQgdGhlIGZvcm0gZnJvbSBiZWluZyBzdWJtaXR0ZWQsKi9cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoY3VycmVudEZvY3VzID4gLTEpIHtcclxuICAgICAgICAvKmFuZCBzaW11bGF0ZSBhIGNsaWNrIG9uIHRoZSBcImFjdGl2ZVwiIGl0ZW06Ki9cclxuICAgICAgICBpZiAoeCkgeFtjdXJyZW50Rm9jdXNdLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBmdW5jdGlvbiBhZGRBY3RpdmUoeCkge1xyXG4gICAgLyphIGZ1bmN0aW9uIHRvIGNsYXNzaWZ5IGFuIGl0ZW0gYXMgXCJhY3RpdmVcIjoqL1xyXG4gICAgaWYgKCF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAvKnN0YXJ0IGJ5IHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzIG9uIGFsbCBpdGVtczoqL1xyXG4gICAgcmVtb3ZlQWN0aXZlKHgpO1xyXG4gICAgaWYgKGN1cnJlbnRGb2N1cyA+PSB4Lmxlbmd0aCkgY3VycmVudEZvY3VzID0gMDtcclxuICAgIGlmIChjdXJyZW50Rm9jdXMgPCAwKSBjdXJyZW50Rm9jdXMgPSB4Lmxlbmd0aCAtIDE7XHJcbiAgICAvKmFkZCBjbGFzcyBcImF1dG9jb21wbGV0ZS1hY3RpdmVcIjoqL1xyXG4gICAgeFtjdXJyZW50Rm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlKHgpIHtcclxuICAgIC8qYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIFwiYWN0aXZlXCIgY2xhc3MgZnJvbSBhbGwgYXV0b2NvbXBsZXRlIGl0ZW1zOiovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgeFtpXS5jbGFzc0xpc3QucmVtb3ZlKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoZWxtbnQpIHtcclxuICAgIC8qY2xvc2UgYWxsIGF1dG9jb21wbGV0ZSBsaXN0cyBpbiB0aGUgZG9jdW1lbnQsXHJcbiAgZXhjZXB0IHRoZSBvbmUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50OiovXHJcbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChlbG1udCAhPSB4W2ldICYmIGVsbW50ICE9IGlucCkge1xyXG4gICAgICAgIHhbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh4W2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIGluIHRoZSBkb2N1bWVudDoqL1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY2xvc2VBbGxMaXN0cyhlLnRhcmdldCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1dG9Db21wbGV0ZSB9O1xyXG4iLCJmdW5jdGlvbiBDb3VudHJ5U2VsZWN0b3IoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX3VwJyk7XHJcbiAgbGV0IGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9fZG93bicpO1xyXG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xyXG4gIGxldCBpdGVtSGVpZ2h0ID1cclxuICAgIGl0ZW1zICE9IG51bGwgPyBpdGVtcy5maXJzdENoaWxkLm5leHRTaWJsaW5nLm9mZnNldEhlaWdodCA6IDA7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgaWYgKHVwICE9IG51bGwpIHtcclxuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xyXG4gICAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbERvd24pO1xyXG5cclxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxVcCgpIHtcclxuICAgICAgLy8gbW92ZSBpdGVtcyBsaXN0IHVwIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XHJcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XHJcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCBkb3duIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XHJcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCAtPSBpdGVtSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgQ291bnRyeVNlbGVjdG9yIH07XHJcbiIsIi8vIG1vZHVsZSBDb3Zlck9wdGlvbnMuanNcclxuXHJcbmZ1bmN0aW9uIENvdmVyT3B0aW9ucygpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBjb3N0UHJlZml4VGV4dCA9ICQoJy5qcy1jb3N0LXByZWZpeCcpO1xyXG4gIGNvbnN0IHdhcm5pbmdUZXh0ID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC53YXJuaW5nLXRleHQnKTtcclxuICBjb25zdCB3YXJuaW5nVGV4dDYwID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC53YXJuaW5nLXRleHQtNjAnKTtcclxuICBjb25zdCBjb3Zlck9wdGlvblByaWNlID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC5jYXJkLXByaWNlJyk7XHJcbiAgLy8gR2V0IHNpbmdsZSB0cmlwIHByaWNlXHJcbiAgY29uc3QgaW5pdGlhbENvdmVyUHJpY2UgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLmFtb3VudCcpO1xyXG4gIGNvbnN0IGRfaW5pdGlhbENvdmVyUHJpY2UgPSBwYXJzZUZsb2F0KFxyXG4gICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dCgpLnJlcGxhY2UoL1xcRCovLCAnJylcclxuICApLnRvRml4ZWQoMik7XHJcblxyXG4gIGNvbnN0IGluaXRpYWxTaW5nbGVUcmlwUHJpY2UgPSAkKCcuaW5pdGlhbC1zaW5nbGUtdHJpcC1wcmljZScpO1xyXG4gIGNvbnN0IGRfaW5pdGlhbFNpbmdsZVRyaXBQcmljZSA9IHBhcnNlRmxvYXQoXHJcbiAgICBpbml0aWFsU2luZ2xlVHJpcFByaWNlLnRleHQoKS5yZXBsYWNlKC9cXEQqLywgJycpXHJcbiAgKS50b0ZpeGVkKDIpO1xyXG5cclxuICBjb25zdCBjdXJyZW5jeVN5bWJvbCA9IGluaXRpYWxDb3ZlclByaWNlLnRleHQoKS5zdWJzdHJpbmcoMCwgMSk7XHJcbiAgbGV0IGlucHV0VmFsdWUgPSAnJztcclxuICBsZXQgcHJpY2VMaW1pdDtcclxuICBsZXQgdG90YWxJbml0aWFsUHJpY2UgPSAwO1xyXG4gIGxldCB0b3RhbFNpbmdsZVByaWNlID0gMDtcclxuICBsZXQgZmluYWxQcmljZSA9IDA7XHJcblxyXG4gIGlmIChjdXJyZW5jeVN5bWJvbCA9PSAnXFx1MDBBMycpIHtcclxuICAgIHByaWNlTGltaXQgPSAxMTk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHByaWNlTGltaXQgPSAxNDI7XHJcbiAgfVxyXG5cclxuICAvL2NvbnNvbGUuY2xlYXIoKTtcclxuICAvL2NvbnNvbGUubG9nKGBjb3ZlciBwcmljZTogJHtkX2luaXRpYWxDb3ZlclByaWNlfWApO1xyXG4gIC8vY29uc29sZS5sb2coYFNpbmdsZSBUcmlwIHByaWNlOiAke2RfaW5pdGlhbFNpbmdsZVRyaXBQcmljZX1gKTtcclxuICAvL2NvbnNvbGUubG9nKGBjdXJyZW5jeVN5bWJvbDogJHtjdXJyZW5jeVN5bWJvbH1gKTtcclxuXHJcbiAgJCgnLnByb2R1Y3Qtb3B0aW9ucy1kYXlzLWNvdmVyJykuY2hhbmdlKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgLy8gZ2V0IHZhbHVlXHJcbiAgICBpbnB1dFZhbHVlID0gcGFyc2VJbnQoZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xyXG5cclxuICAgIC8vIGhpZGUgXCJmcm9tXCIgdGV4dFxyXG4gICAgaWYgKGlucHV0VmFsdWUgPiAzKSB7XHJcbiAgICAgIGNvc3RQcmVmaXhUZXh0LmhpZGUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvc3RQcmVmaXhUZXh0LnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5wdXRWYWx1ZSA+IDAgJiYgTnVtYmVyLmlzSW50ZWdlcihpbnB1dFZhbHVlKSkge1xyXG4gICAgICAvLyBjYWxjdWxhdGUgd2l0aCBpbnRpdGFsIGNvdmVyIHByaWNlXHJcbiAgICAgIC8vIGRfaW5pdGlhbENvdmVyUHJpY2UgPSAxMS45OVxyXG4gICAgICBpZiAoaW5wdXRWYWx1ZSA+IDAgJiYgaW5wdXRWYWx1ZSA8PSAzKSB7XHJcbiAgICAgICAgdG90YWxJbml0aWFsUHJpY2UgPSBkX2luaXRpYWxDb3ZlclByaWNlO1xyXG4gICAgICAgIHRvdGFsU2luZ2xlUHJpY2UgPSB0b3RhbEluaXRpYWxQcmljZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgKChpbnB1dFZhbHVlID4gMyAmJiBpbnB1dFZhbHVlIDw9IDYwKSB8fCBwcmljZUxpbWl0IDwgZmluYWxQcmljZSkge1xyXG4gICAgICBpZiAoaW5wdXRWYWx1ZSA+IDMpIHtcclxuICAgICAgICB0b3RhbEluaXRpYWxQcmljZSA9IGRfaW5pdGlhbENvdmVyUHJpY2U7XHJcbiAgICAgICAgLy8gZG91YmxlIHVwIG9uIHRoZSBzdHJpbmcgdmFsdWVzIHRvIHVzZSBhIHVuYXJ5IHBsdXMgdG8gY29udmVydCBhbmQgaGF2ZSBpdCBhZGRlZCB0byB0aGUgcHJldmlvdXMgdmFsdWVcclxuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID1cclxuICAgICAgICAgICt0b3RhbEluaXRpYWxQcmljZSArICgraW5wdXRWYWx1ZSAtIDMpICogK2RfaW5pdGlhbFNpbmdsZVRyaXBQcmljZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmFsUHJpY2UgPSBwYXJzZUZsb2F0KHRvdGFsU2luZ2xlUHJpY2UpLnRvRml4ZWQoMik7XHJcblxyXG4gICAgaWYgKGlucHV0VmFsdWUgPiAxMSAmJiBpbnB1dFZhbHVlIDw9IDYwKSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgLy8gY2hhbmdlIGNvbG9yIG9mIHByaWNlXHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcclxuICAgICAgLy8gc2hvdyB3YXJuaW5nIHRleHRcclxuICAgICAgd2FybmluZ1RleHQuc2hvdygpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5zaG93KCk7XHJcbiAgICB9IGVsc2UgaWYgKGlucHV0VmFsdWUgPiAzICYmIGlucHV0VmFsdWUgPD0gNjApIHtcclxuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xyXG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XHJcbiAgICAgIHdhcm5pbmdUZXh0NjAuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2Uuc2hvdygpO1xyXG4gICAgfSBlbHNlIGlmIChpbnB1dFZhbHVlIDw9IDMpIHtcclxuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xyXG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XHJcbiAgICAgIHdhcm5pbmdUZXh0NjAuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2Uuc2hvdygpO1xyXG4gICAgfSBlbHNlIGlmIChpbnB1dFZhbHVlID4gNjApIHtcclxuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLmFkZENsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICAgIHdhcm5pbmdUZXh0NjAuc2hvdygpO1xyXG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UuaGlkZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIHRvdGFsU2luZ2xlUHJpY2UpO1xyXG4gICAgICB3YXJuaW5nVGV4dDYwLmhpZGUoKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKGAke2lucHV0VmFsdWV9ID0gJHtmaW5hbFByaWNlfWApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBDb3Zlck9wdGlvbnMgfTtcclxuIiwiZnVuY3Rpb24gVG9nZ2xlTmF2aWdhdGlvbigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBjdXJyZW5jeSA9ICQoJy5jdXJyZW5jeScpO1xyXG4gIGNvbnN0IG1haW5OYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbWVudScpO1xyXG4gIGNvbnN0IG5hdkJhclRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XHJcbiAgY29uc3QgY3VycmVuY3lOYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtY3VycmVuY3ktdG9nZ2xlJyk7XHJcbiAgY29uc3QgY3VycmVuY3lNZW51VG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcclxuXHJcbiAgLy8gYmluZCBldmVudHNcclxuICBuYXZCYXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNZW51KTtcclxuICBjdXJyZW5jeU1lbnVUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVDdXJyZW5jeU1lbnUpO1xyXG5cclxuICAvLyBldmVudCBoYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XHJcbiAgICBtYWluTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdG9nZ2xlQ3VycmVuY3lNZW51KCkge1xyXG4gICAgY3VycmVuY3lOYXYuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAnMTE5OScpIHtcclxuICAgIGN1cnJlbmN5LnNob3coKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY3VycmVuY3kuaGlkZSgpO1xyXG4gIH1cclxuXHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+ICcxMTk5Jykge1xyXG4gICAgICBjdXJyZW5jeS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW5jeS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIERyb3Bkb3duTWVudSgpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgY2FyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1jYXInKTtcclxuICBsZXQgZHJvcERvd25NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLS1jYXIgLmRyb3Bkb3duLW1lbnUnKTtcclxuXHJcbiAgaWYgKGNhckJ0biAhPSBudWxsICYmIGRyb3BEb3duTWVudSAhPSBudWxsKSB7XHJcbiAgICBsZXQgZHJvcERvd24gPSBjYXJCdG4ucGFyZW50RWxlbWVudDtcclxuICAgIC8vIEJpbmQgZXZlbnRzXHJcbiAgICBjYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJCdG5IYW5kbGVyKTtcclxuXHJcbiAgICAvLyBFdmVudCBoYW5kbGVyc1xyXG4gICAgZnVuY3Rpb24gY2FyQnRuSGFuZGxlcihldnQpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIC8vIHRvZ2dsZSBkaXNwbGF5XHJcbiAgICAgIGlmIChcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnIHx8XHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICcnXHJcbiAgICAgICkge1xyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPVxyXG4gICAgICAgICAgZHJvcERvd24ub2Zmc2V0SGVpZ2h0ICsgZHJvcERvd25NZW51Lm9mZnNldEhlaWdodCArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBGaXhlZE5hdmlnYXRpb24oKSB7XHJcbiAgLy8gbWFrZSBuYXZiYXIgc3RpY2t5XHJcbiAgLy8gV2hlbiB0aGUgdXNlciBzY3JvbGxzIHRoZSBwYWdlLCBleGVjdXRlIG15RnVuY3Rpb25cclxuICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIG15RnVuY3Rpb24oKTtcclxuICB9O1xyXG5cclxuICAvLyBHZXQgdGhlIGhlYWRlclxyXG4gIGxldCBuYXZCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2YmFyJyk7XHJcblxyXG4gIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcclxuICBsZXQgc3RpY2t5ID0gbmF2QmFyLm9mZnNldFRvcDtcclxuXHJcbiAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgZnVuY3Rpb24gbXlGdW5jdGlvbigpIHtcclxuICAgIGxldCBzdGlja3kgPSBuYXZCYXIub2Zmc2V0VG9wO1xyXG4gICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IHN0aWNreSkge1xyXG4gICAgICBuYXZCYXIuY2xhc3NMaXN0LmFkZCgnbmF2YmFyLWZpeGVkLXRvcCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5yZW1vdmUoJ25hdmJhci1maXhlZC10b3AnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFNlbGVjdFRyaXAoKSB7XHJcbiAgLy8gc2VsZWN0IHZlaGljbGVcclxuICAkKCcudGFiLWNhciAuYnRuJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9KTtcclxuXHJcbiAgJCgnLnRhYi1jYXIgLmljb24tcmFkaW8gaW5wdXRbdHlwZT1cInJhZGlvXCJdJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAkKCcudGFiLWNhciAuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1jdGEtLWRpc2FibGVkJyk7XHJcbiAgICAkKCcudGFiLWNhciAuYnRuJykuYWRkQ2xhc3MoJ2J0bi1jdGEnKTtcclxuICAgICQoJy50YWItY2FyIC5idG4nKS51bmJpbmQoKTtcclxuICB9KTtcclxufVxyXG5cclxuLy8gc2hvdyBtb2JpbGUgY3VycmVuY3lcclxuZnVuY3Rpb24gUmV2ZWFsQ3VycmVuY3koKSB7XHJcbiAgJCgnLmN1cnJlbmN5LW1vYmlsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ0N1cnJlbmN5Jyk7XHJcblxyXG4gICAgJCgnLmN1cnJlbmN5Jykuc2xpZGVUb2dnbGUoKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBUb2dnbGVOYXZpZ2F0aW9uLFxyXG4gIERyb3Bkb3duTWVudSxcclxuICBGaXhlZE5hdmlnYXRpb24sXHJcbiAgU2VsZWN0VHJpcCxcclxuICBSZXZlYWxDdXJyZW5jeVxyXG59O1xyXG4iLCJpbXBvcnQgeyBldmVudHMgfSBmcm9tICcuL1B1YlN1Yic7XHJcblxyXG5BcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgdGhpc0FyZyA9IHRoaXNBcmcgfHwgd2luZG93O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzW2ldLCBpLCB0aGlzKTtcclxuICB9XHJcbn07XHJcblxyXG5pZiAod2luZG93Lk5vZGVMaXN0ICYmICFOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCkge1xyXG4gIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbi8vIG1vZHVsZSBcIlBvbGljeVN1bW1hcnkuanNcIlxyXG4vLyBtb2R1bGUgXCJQb2xpY3lTdW1tYXJ5QWNjb3JkaW9uLmpzXCJcclxuXHJcbmZ1bmN0aW9uIERlc2t0b3BEZXZpY2VTZXR1cCgpIHtcclxuICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyByZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyBmcm9tIGFsbFxyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH0pO1xyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtY2hpbGQoMiknKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gIC8vIHNob3cgcG9saWN5IGluZm9cclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24gLnBvbGljeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9KTtcclxuXHJcbiAgLy8gcmVzZXQgcG9saWN5IHN1bW1hcnlcclxuICAkKCcucG9saWN5LXN1bW1hcnktaW5mbycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9KTtcclxuICAkKCcucG9saWN5LXN1bW1hcnktaW5mbzpmaXJzdC1jaGlsZCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAvLyByZW1vdmUgbW9iaWxlIGV2ZW50IGxpc3RlbmVyXHJcbiAgY29uc3QgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcuYWNjb3JkaW9uLWJhciBidXR0b24ubW9yZS1pbmZvcm1hdGlvbidcclxuICApO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYWNjW2ldLmV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgYWNjW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBQb2xpY3lTdW1tYXJ5RGVza3RvcCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBNb2JpbGVEZXZpY2VTZXR1cCgpIHtcclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAkKGVsZW1lbnQpXHJcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24gLnBvbGljeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyByZXNldCBwb2xpY3kgc3VtbWFyeVxyXG4gICQoJy5wb2xpY3ktc3VtbWFyeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyByZW1vdmUgZGVza3RvcCBldmVudCBsaXN0ZW5lclxyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLnVuYmluZCgpO1xyXG5cclxuICAvLyBzZXR1cCBNb2JpbGVcclxuICBQb2xpY3lTdW1tYXJ5TW9iaWxlKCk7XHJcbn1cclxuXHJcbi8vIGRldmljZSByZXNldCBPTiBicm93c2VyIHdpZHRoXHJcbmZ1bmN0aW9uIFBvbGljeVN1bW1hcnlEZXZpY2VSZXNpemUoKSB7XHJcbiAgLy8gY29uc29sZS5sb2cod2luZG93Lm91dGVyV2lkdGgpO1xyXG5cclxuICBpZiAod2luZG93Lm91dGVyV2lkdGggPiAxMTk5KSB7XHJcbiAgICAvKipcclxuICAgICAqIERFVklDRTogRGVza3RvcFxyXG4gICAgICovXHJcbiAgICBEZXNrdG9wRGV2aWNlU2V0dXAoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBERVZJQ0U6IE1vYmlsZVxyXG4gICAgICovXHJcbiAgICBNb2JpbGVEZXZpY2VTZXR1cCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FjaGUgRE9NXHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbihldnQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGV2dC50YXJnZXQub3V0ZXJXaWR0aCk7XHJcblxyXG4gICAgaWYgKGV2dC50YXJnZXQub3V0ZXJXaWR0aCA+IDExOTkpIHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIERFVklDRTogRGVza3RvcFxyXG4gICAgICAgKi9cclxuICAgICAgRGVza3RvcERldmljZVNldHVwKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKipcclxuICAgICAgICogREVWSUNFOiBNb2JpbGVcclxuICAgICAgICovXHJcbiAgICAgIE1vYmlsZURldmljZVNldHVwKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb2xpY3kgU3VtbWFyeSBIYW5kbGVyIGZvciBtb2JpbGVcclxuICpcclxuICogQHJldHVybiAge25vbmV9XHJcbiAqL1xyXG5mdW5jdGlvbiBQb2xpY3lTdW1tYXJ5TW9iaWxlKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAnLmFjY29yZGlvbi1iYXIgYnV0dG9uLm1vcmUtaW5mb3JtYXRpb24nXHJcbiAgKTtcclxuICBsZXQgY2FyZENvdmVyT3B0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQtY292ZXItb3B0aW9uJyk7XHJcbiAgbGV0IHBvbGljeVN1bW1hcnlJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvbGljeS1zdW1tYXJ5LWluZm8nKTtcclxuICBsZXQgcG9saWN5UmVmZXJlbmNlID0gJyc7XHJcblxyXG4gIGxldCBhY3RpdmVDYXJkT3B0aW9uID0gJyc7XHJcblxyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcclxuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBhY2NvcmRpb25IYW5kbGVyKGV2dCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgLyogaGlkZSB0aGUgb3RoZXIgb3B0aW9ucyAqL1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gbW9yZSBpbmZvcm1hdGlvbiBidXR0b24gaGFzIGJlZW4gY2xpY2tlZFxyXG4gICAgaWYgKGFjdGl2ZUNhcmRPcHRpb24gPT09ICdzZWxlY3RlZCcpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ0Nsb3NlJyk7XHJcblxyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5pbm5lclRleHQgPSAnTW9yZSBpbmZvcm1hdGlvbic7XHJcblxyXG4gICAgICAvLyByZW1vdmUgYWN0aXZlIGJvcmRlclxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRDb3Zlck9wdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNhcmRDb3Zlck9wdGlvbltpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBjYXJkQ292ZXJPcHRpb25baV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGhpZGUgcG9saWN5LWluZm9cclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICcuY2FyZC1jb3Zlci1vcHRpb25bZGF0YS1wb2xpY3lePVwicG9saWN5LXN1bW1hcnktXCJdIC5wb2xpY3ktaW5mbydcclxuICAgICAgICApXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gaGlkZSBhbGwgcG9saWN5LXN1bW1hcnktaW5mbyBibG9ja3NcclxuICAgICAgcG9saWN5U3VtbWFyeUluZm8uZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFjdGl2ZUNhcmRPcHRpb24gPSAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdPcGVuJyk7XHJcblxyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5pbm5lclRleHQgPSAnVmlldyBvdGhlciBvcHRpb25zJztcclxuXHJcbiAgICAgIC8vIG1vdmUgbW9yZSBpbmZvcm1hdGlvbiBhcnJvd1xyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgIC8qIGhpZ2hsaWdodCB0aGUgY2FyZCB0aGF0J3MgYmVlbiBzZWxlY3RlZCAqL1xyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgJ2FjdGl2ZSdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIGdldCBwb2xpY3kgcmVmZXJlbmNlXHJcbiAgICAgIHBvbGljeVJlZmVyZW5jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLWNvdmVyLW9wdGlvbi5hY3RpdmUnKVxyXG4gICAgICAgIC5kYXRhc2V0LnBvbGljeTtcclxuXHJcbiAgICAgIC8vIHNob3cgb25seSB0aGUgcHJvZHVjdCBzdW1tYXJ5IGluZm8gdGhhdCBoYXMgYW4gYWN0aXZlIHByb2R1Y3QgY292ZXIgb3B0aW9uXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZENvdmVyT3B0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGNhcmRDb3Zlck9wdGlvbltpXS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuaW5kZXhPZignYWN0aXZlJykgPCAwKSB7XHJcbiAgICAgICAgICBjYXJkQ292ZXJPcHRpb25baV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FyZENvdmVyT3B0aW9uW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2hvdyB0aGUgY292ZXIgb3B0aW9uIGluZm8gdGV4dFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICcuY2FyZC1jb3Zlci1vcHRpb25bZGF0YS1wb2xpY3k9XCInICsgcG9saWN5UmVmZXJlbmNlICsgJ1wiXSAucG9saWN5LWluZm8nXHJcbiAgICAgICkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblxyXG4gICAgICBhY3RpdmVDYXJkT3B0aW9uID0gJ3NlbGVjdGVkJztcclxuXHJcbiAgICAgIC8vIGhpZGUgYWxsIHBvbGljeS1zdW1tYXJ5LWluZm8gYmxvY2tzXHJcbiAgICAgIHBvbGljeVN1bW1hcnlJbmZvLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBnZXQgdGhlIHBvbGljeSBzdW1tYXJ5IGluZm8gcGFuZWwgYXNzb2NpY2F0ZWQgd2l0aCB0aGlzIHByb2R1Y3QgdXNpbmcgdGhlIHBvbGljeVJlZmVyZW5jZVxyXG4gICAgICBsZXQgcGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICcucG9saWN5LXN1bW1hcnktaW5mby4nICsgcG9saWN5UmVmZXJlbmNlXHJcbiAgICAgICk7XHJcbiAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cclxuICAgICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XHJcbiAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudHMub24oJ2hlaWdodENoYW5nZWQnLCBuZXdIZWlnaHQgPT4ge1xyXG4gICAgICAgIGxldCBuZXdUb3RhbCA9XHJcbiAgICAgICAgICBwYXJzZUludChcclxuICAgICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0LnN1YnN0cmluZygwLCBwYW5lbC5zdHlsZS5tYXhIZWlnaHQubGVuZ3RoIC0gMilcclxuICAgICAgICAgICkgK1xyXG4gICAgICAgICAgcGFyc2VJbnQobmV3SGVpZ2h0LnN1YnN0cmluZygwLCBuZXdIZWlnaHQubGVuZ3RoIC0gMikpICtcclxuICAgICAgICAgICdweCc7XHJcblxyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG5ld1RvdGFsO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IC8vIGFjY29yZGlvbkhhbmRsZXJcclxufSAvLyBQb2xpY3lTdW1tYXJ5TW9iaWxlXHJcblxyXG4vKipcclxuICogUG9saWN5IFN1bW1hcnkgaGFuZGxlciBmb3IgZGVza3RvcFxyXG4gKlxyXG4gKiBAcmV0dXJuICB7bm9uZX1cclxuICovXHJcbmZ1bmN0aW9uIFBvbGljeVN1bW1hcnlEZXNrdG9wKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIC8vIHBvbGljeSBzdW1tYXJ5XHJcbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIC8vIHNob3cgcG9saWN5IHN1bW1hcnlcclxuICAgICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHBvbGljeVN1bW1hcnkgPSAkKHRoaXMpLmRhdGEoJ3BvbGljeScpO1xyXG4gICAgJCgnLicgKyBwb2xpY3lTdW1tYXJ5KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9KTtcclxufSAvLyBQb2xpY3lTdW1tYXJ5RGVza3RvcFxyXG5cclxuZXhwb3J0IHsgUG9saWN5U3VtbWFyeURldmljZVJlc2l6ZSwgUG9saWN5U3VtbWFyeU1vYmlsZSwgUG9saWN5U3VtbWFyeURlc2t0b3AgfTtcclxuIiwiLy8gVGhlIG1vZHVsZSB3aWxsIHNlbmQgYSBjaGFuZ2VkIGV2ZW50IHRvIFB1YlN1YiBhbmRcclxuLy8gYW55b25lIGxpc3RlbmluZyB3aWxsIHJlY2VpdmUgdGhhdCBjaGFuZ2VkIGV2ZW50IGFuZFxyXG4vLyB0aGVuIHVwZGF0ZSBhY2NvcmRpbmdseVxyXG5cclxubGV0IGV2ZW50cyA9IHtcclxuICAvLyBsaXN0IG9mIGV2ZW50c1xyXG4gIGV2ZW50czoge30sXHJcblxyXG4gIG9uOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XHJcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcclxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XHJcbiAgfSxcclxuXHJcbiAgb2ZmOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XHJcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcclxuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZW1pdDogZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICBmbihkYXRhKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHsgZXZlbnRzIH07XHJcbiIsIi8vIG1vZHVsZSBSZXZlYWxEb2NzLmpzXHJcblxyXG5mdW5jdGlvbiBSZXZlYWxEb2NzKCkge1xyXG4gIC8vRG9jc1xyXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IG9uID0gJCgnLmRvY3MnKS5pcygnOnZpc2libGUnKTtcclxuICAgICQodGhpcykuaHRtbChcclxuICAgICAgb24gPyAnVmlldyBwb2xpY3kgZG9jdW1lbnRhdGlvbicgOiAnSGlkZSBwb2xpY3kgZG9jdW1lbnRhdGlvbidcclxuICAgICk7XHJcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJldmVhbERvY3MgfTtcclxuIiwiLy8gbW9kdWxlIFwiU2NyZWVuLmpzXCJcclxuXHJcbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xyXG4gIHZhciBzY3JvbGxTdGVwID0gLXdpbmRvdy5zY3JvbGxZIC8gKHNjcm9sbER1cmF0aW9uIC8gMTUpLFxyXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgc2Nyb2xsU3RlcCk7XHJcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcclxuICAgIH0sIDE1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xyXG4gIGNvbnN0IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMjtcclxuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxyXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XHJcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xyXG4gICAgaWYgKHNjcm9sbENvdW50ID49IE1hdGguUEkpIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcclxuICAgICk7XHJcbiAgICBvbGRUaW1lc3RhbXAgPSBuZXdUaW1lc3RhbXA7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxufVxyXG4vKlxyXG4gIEV4cGxhbmF0aW9uczpcclxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxyXG4gIC0gbmV3VGltZXN0YW1wIGluZGljYXRlcyB0aGUgY3VycmVudCB0aW1lIHdoZW4gY2FsbGJhY2tzIHF1ZXVlZCBieSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmVnaW4gdG8gZmlyZS5cclxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxyXG5cclxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXHJcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXHJcbiAgPSBhICogY29zIChieCkgKyAxICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEgc3RyZXRjaGVzIGFsb25nIHRoZSB5IGF4aXMgPSBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDJcclxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXHJcbiovXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcclxuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBiYWNrVG9Ub3BCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KDEwMDApO1xyXG5cclxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXaW5kb3dXaWR0aCgpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBhY2NvcmRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcuY2FyZC1wcm9kdWN0cyAuYWNjb3JkaW9uLWJ0bidcclxuICApO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgdyA9XHJcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgaWYgKHcgPiAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHcgPD0gMTIwMCkge1xyXG4gICAgICBsZXQgaTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfTtcclxuIiwiLy8gbW9kdWxlIFwiU2Nyb2xsVG8uanNcIlxyXG5cclxuZnVuY3Rpb24gU2Nyb2xsVG8oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgLy8gU2VsZWN0IGFsbCBsaW5rcyB3aXRoIGhhc2hlc1xyXG4gIC8vIFJlbW92ZSBsaW5rcyB0aGF0IGRvbid0IGFjdHVhbGx5IGxpbmsgdG8gYW55dGhpbmdcclxuICBsZXQgYW5jaG9ycyA9ICQoJ2FbaHJlZio9XCIjXCJdJylcclxuICAgIC5ub3QoJ1tocmVmPVwiI1wiXScpXHJcbiAgICAubm90KCdbaHJlZj1cIiMwXCJdJyk7XHJcblxyXG4gIGxldCBoZWlnaHRDb21wZW5zYXRpb24gPSA2MDtcclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGFuY2hvcnMuY2xpY2soYW5jaG9yc0hhbmRsZXIpO1xyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGFuY2hvcnNIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAvLyBPbi1wYWdlIGxpbmtzXHJcbiAgICBpZiAoXHJcbiAgICAgIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgPT1cclxuICAgICAgICB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgJiZcclxuICAgICAgbG9jYXRpb24uaG9zdG5hbWUgPT0gdGhpcy5ob3N0bmFtZVxyXG4gICAgKSB7XHJcbiAgICAgIC8vIEZpZ3VyZSBvdXQgZWxlbWVudCB0byBzY3JvbGwgdG9cclxuICAgICAgbGV0IHRhcmdldCA9ICQodGhpcy5oYXNoKTtcclxuICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xyXG4gICAgICAvLyBEb2VzIGEgc2Nyb2xsIHRhcmdldCBleGlzdD9cclxuICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAvLyBPbmx5IHByZXZlbnQgZGVmYXVsdCBpZiBhbmltYXRpb24gaXMgYWN0dWFsbHkgZ29ubmEgaGFwcGVuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZShcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gaGVpZ2h0Q29tcGVuc2F0aW9uXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgMTAwMCxcclxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBDYWxsYmFjayBhZnRlciBhbmltYXRpb25cclxuICAgICAgICAgICAgLy8gTXVzdCBjaGFuZ2UgZm9jdXMhXHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCc6Zm9jdXMnKSkge1xyXG4gICAgICAgICAgICAgIC8vIENoZWNraW5nIGlmIHRoZSB0YXJnZXQgd2FzIGZvY3VzZWRcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpOyAvLyBBZGRpbmcgdGFiaW5kZXggZm9yIGVsZW1lbnRzIG5vdCBmb2N1c2FibGVcclxuICAgICAgICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7IC8vIFNldCBmb2N1cyBhZ2FpblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gb24gc2Nyb2xsXHJcbmlmICgkKCcuYXJ0aWNsZS1tYWluJykubGVuZ3RoID4gMCkge1xyXG4gIGxldCB0YXJnZXQgPSAkKCcuYXJ0aWNsZS1tYWluJykub2Zmc2V0KCkudG9wIC0gMTgwO1xyXG4gICQoZG9jdW1lbnQpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XHJcbiAgICAgICQoJy5zaGFyZS1idXR0b25zJykuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFNjcm9sbFRvIH07XHJcbiIsImZ1bmN0aW9uIFJlYWR5KGZuKSB7XHJcbiAgaWYgKFxyXG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnRcclxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXHJcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXHJcbiAgKSB7XHJcbiAgICBmbigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgUmVhZHkgfTtcclxuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBjYXJUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX2NhcicpO1xyXG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xyXG4gICAgY2FyVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xyXG4gICAgdmFuVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcclxuICAgIHZhciBpLCB4LCB0YWJCdXR0b25zO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGV2dCk7XHJcblxyXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXHJcbiAgICB4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1jb250YWluZXIgLnRhYicpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXHJcbiAgICB0YWJCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi10YWJzIC5uYXYtbGluaycpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxyXG4gICAgLy8gc2hvdyB0aGUgc2VsZWN0ZWQgdGFiIGNvbnRlbnRcclxuICAgIGxldCB2ZWhpY2xlID0gZXZ0LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZlaGljbGUnKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItJyArIHZlaGljbGUpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFZlaGljbGVTZWxlY3RvciB9O1xyXG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tIFwidXRpbFwiO1xyXG5cclxuLy8gbW9kdWxlIFwiTG9hZEZBUXMuanNcIlxyXG5cclxuZnVuY3Rpb24gTG9hZEZBUXMoKSB7XHJcbiAgLy8gbG9hZCBmYXFzXHJcbiAgJCgnI2ZhcVRhYnMgYScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQodGhpcykudGFiKCdzaG93Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGxvYWQgZmFxc1xyXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBmYXFzIHBhZ2VcclxuICBpZiAoJCgnI2ZhcXMnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgdXJsOiAnL2FwaS9mYXFzLmpzb24nLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihmYXFzKSB7XHJcbiAgICAgICAgLy8gZ2V0IHRoZSBoZWFkc1xyXG4gICAgICAgICQuZWFjaChmYXFzLCBmdW5jdGlvbihpbmRleCwgZmFxKSB7XHJcbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIGRlc2t0b3BcclxuICAgICAgICAgICQoYGFbaHJlZj0nIyR7ZmFxLmlkfSddYClcclxuICAgICAgICAgICAgLmZpbmQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAudGV4dChmYXEudGl0bGUpO1xyXG5cclxuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgbW9iaWxlXHJcbiAgICAgICAgICAkKGAjJHtmYXEuaWR9YClcclxuICAgICAgICAgICAgLmZpbmQoJ2gzJylcclxuICAgICAgICAgICAgLnRleHQoZmFxLnNob3J0VGl0bGUpO1xyXG5cclxuICAgICAgICAgIC8vIGdldCB0aGUgYm9keVxyXG4gICAgICAgICAgJC5lYWNoKGZhcS5xYXMsIGZ1bmN0aW9uKGZJbmRleCwgcWEpIHtcclxuICAgICAgICAgICAgJCgnLmlubmVyIC5hY2NvcmRpb24nLCBgIyR7ZmFxLmlkfWApLmFwcGVuZChcclxuICAgICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke3FhLnF1ZXN0aW9ufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgJHtxYS5hbnN3ZXJ9XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7IC8vICRhamF4XHJcblxyXG4gICAgJCgnLmZhcS1hbnN3ZXJzIC5pbm5lciAuYWNjb3JkaW9uJykuZGVsZWdhdGUoXHJcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXHJcbiAgICAgICdjbGljaycsXHJcbiAgICAgIGZhcXNIYW5kbGVyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgbG9hZFByb2R1Y3RQYWdlRkFRcygpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZFByb2R1Y3RQYWdlRkFRcygpIHtcclxuICAvLyBvbmx5IGxvYWQgaWYgb24gcHJvZHVjdCBwYWdlXHJcbiAgaWYgKCQoJy5wcm9kdWN0LWZhcXMnKS5sZW5ndGggPiAwKSB7XHJcbiAgICBsZXQgZmlsZSA9ICQoJy5wcm9kdWN0LWZhcXMnKVxyXG4gICAgICAuZGF0YSgnZmFxcycpXHJcbiAgICAgIC5yZXBsYWNlKCcmLScsICcnKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCk7XHJcblxyXG4gICAgLy8kLmFqYXgoe1xyXG4gICAgLy8gIHR5cGU6ICdHRVQnLFxyXG4gICAgLy8gIHVybDogYC9hcGkvJHtmaWxlfS1mYXFzLmpzb25gLFxyXG4gICAgLy8gIHN1Y2Nlc3M6IHVwZGF0ZVVJU3VjY2VzcyxcclxuICAgIC8vICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnJvcikge1xyXG4gICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XHJcbiAgICAvLyAgfVxyXG4gICAgLy99KTsgLy8gJGFqYXhcclxuXHJcbiAgICBmZXRjaChgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICByZXR1cm4gKHJlc3BvbnNlLmpzb24oKSk7XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICB1cGRhdGVVSVN1Y2Nlc3MocmVzcG9uc2UpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgIHVwZGF0ZVVJRmFpbHVyZShlcnJvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcclxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcclxuICAgICAgJ2NsaWNrJyxcclxuICAgICAgZmFxc0hhbmRsZXJcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVUlTdWNjZXNzKGZhcXMpIHtcclxuICAvLyBnZXQgdGhlIGJvZHlcclxuICAkLmVhY2goZmFxcywgZnVuY3Rpb24gKGZJbmRleCwgZmFxKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKGAjJHtmYXEuaWR9YCk7XHJcbiAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicpLmFwcGVuZChcclxuICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtmYXEucXVlc3Rpb259PC9idXR0b24+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAke2ZhcS5hbnN3ZXJ9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgYFxyXG4gICAgKTtcclxuICB9KTtcclxuXHJcbiAgLy8gc2hvdyBjb250ZW50XHJcbiAgJCgnLmZhcS1hbnN3ZXJzLXByb2R1Y3QnKS5zaG93KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVVJRmFpbHVyZShlcnJvcikge1xyXG4gIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIsIGVycm9yKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmFxc0hhbmRsZXIoZXZ0KSB7XHJcbiAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcclxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXHJcbiAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXHJcbiAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gIH1cclxufVxyXG5leHBvcnQgeyBMb2FkRkFRcyB9O1xyXG4iLCJpbXBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfSBmcm9tICcuL2NvbXBvbmVudHMvU2NyZWVuJztcclxuaW1wb3J0IHsgQWNjb3JkaW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbic7XHJcbmltcG9ydCB7IENvdW50cnlTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3InO1xyXG5pbXBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yJztcclxuaW1wb3J0IHtcclxuICBUb2dnbGVOYXZpZ2F0aW9uLFxyXG4gIERyb3Bkb3duTWVudSxcclxuICBGaXhlZE5hdmlnYXRpb24sXHJcbiAgU2VsZWN0VHJpcCxcclxuICBSZXZlYWxDdXJyZW5jeVxyXG59IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgU2Nyb2xsVG8gfSBmcm9tICcuL2NvbXBvbmVudHMvU2Nyb2xsVG8nO1xyXG5pbXBvcnQgeyBBdXRvQ29tcGxldGUgfSBmcm9tICcuL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlJztcclxuaW1wb3J0IHsgTG9hZEZBUXMgfSBmcm9tICcuL2NvbXBvbmVudHMvZmFxcyc7XHJcbmltcG9ydCB7IFJldmVhbERvY3MgfSBmcm9tICcuL2NvbXBvbmVudHMvUmV2ZWFsRG9jcyc7XHJcbmltcG9ydCB7IENvdmVyT3B0aW9ucyB9IGZyb20gJy4vY29tcG9uZW50cy9Db3Zlck9wdGlvbnMnO1xyXG5pbXBvcnQgeyBSZWFkeSB9IGZyb20gJy4vY29tcG9uZW50cy9VdGlscyc7XHJcbmltcG9ydCB7XHJcbiAgUG9saWN5U3VtbWFyeURldmljZVJlc2l6ZSxcclxuICBQb2xpY3lTdW1tYXJ5TW9iaWxlLFxyXG4gIFBvbGljeVN1bW1hcnlEZXNrdG9wXHJcbn0gZnJvbSAnLi9jb21wb25lbnRzL1BvbGljeVN1bW1hcnknO1xyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICd1dGlsJztcclxuXHJcbmxldCBjb3VudHJpZXNDb3ZlcmVkID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gIC8vIENvdW50cnlTZWxlY3RvcigpO1xyXG4gIFZlaGljbGVTZWxlY3RvcigpO1xyXG4gIFRvZ2dsZU5hdmlnYXRpb24oKTtcclxuICBEcm9wZG93bk1lbnUoKTtcclxuICBTY3JvbGxUb1RvcCgpO1xyXG4gIEZpeGVkTmF2aWdhdGlvbigpO1xyXG4gIEFjY29yZGlvbigpO1xyXG4gIFdpbmRvd1dpZHRoKCk7XHJcbiAgU2Nyb2xsVG8oKTtcclxuXHJcbiAgLy8gY29uc29sZS5sb2coYGNvdW50cmllc0NvdmVyZWQ6ICR7Y291bnRyaWVzQ292ZXJlZH1gKTtcclxuICAvLyBpZiAoY291bnRyaWVzQ292ZXJlZCAhPSBudWxsKSB7XHJcbiAgLy8gICBBdXRvQ29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215SW5wdXQnKSwgY291bnRyaWVzQ292ZXJlZCk7XHJcbiAgLy8gfVxyXG5cclxuICBMb2FkRkFRcygpO1xyXG4gIFJldmVhbERvY3MoKTtcclxuICBDb3Zlck9wdGlvbnMoKTtcclxuICAvLyBQb2xpY3lTdW1tYXJ5TW9iaWxlKCk7XHJcbiAgLy8gUG9saWN5U3VtbWFyeURlc2t0b3AoKTtcclxuICBQb2xpY3lTdW1tYXJ5RGV2aWNlUmVzaXplKCk7XHJcbiAgU2VsZWN0VHJpcCgpO1xyXG4gIFJldmVhbEN1cnJlbmN5KCk7XHJcbiAgLy8gTGF6eUxvYWQoKTtcclxufVxyXG5cclxuUmVhZHkoc3RhcnQpO1xyXG4iXX0=
