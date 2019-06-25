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

// module "PolicySummary.js"
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
    console.log(evt.currentTarget);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvTmF2aWdhdGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvUHViU3ViLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0FBQyxZQUFOLEdBQXFCLElBQTdDO0FBQ0EsSUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxJQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksWUFBWixHQUEyQixNQUEzQjtBQUNEO0FBQ0Y7Ozs7O0FDdklEOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQU9BOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUtBOztBQUVBLElBQUksZ0JBQWdCLEdBQUcsSUFBdkI7O0FBRUEsU0FBUyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQVRlLENBV2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQWxCZSxDQW1CZjtBQUNBOztBQUNBO0FBQ0E7QUFDQSxvQ0F2QmUsQ0F3QmY7QUFDRDs7QUFFRCxrQkFBTSxLQUFOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vUHViU3ViJztcclxuXHJcbi8vIG1vZHVsZSBcIkFjY29yZGlvbi5qc1wiXHJcblxyXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYnRuJyk7XHJcblxyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgbGV0IGk7XHJcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xyXG4gICAgYWNjW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjb3JkaW9uSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGFjY29yZGlvbkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxyXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG5cclxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXHJcbiAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcclxuICAgIH1cclxuXHJcbiAgICAvLyB0ZWxsIHRoZSBwYXJlbnQgYWNjb3JkaW9uIHRvIGFkanVzdCBpdHMgaGVpZ2h0XHJcbiAgICBldmVudHMuZW1pdCgnaGVpZ2h0Q2hhbmdlZCcsIHBhbmVsLnN0eWxlLm1heEhlaWdodCk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCB7IEFjY29yZGlvbiB9O1xyXG4iLCIvLyBtb2R1bGUgXCJBdXRvQ29tcGxldGUuanNcIlxyXG5cclxuLyoqXHJcbiAqIFtBdXRvQ29tcGxldGUgZGVzY3JpcHRpb25dXHJcbiAqXHJcbiAqIEBwYXJhbSAgIHtzdHJpbmd9ICB1c2VySW5wdXQgIHVzZXIgaW5wdXRcclxuICogQHBhcmFtICAge2FycmF5fSAgc2VhcmNoTGlzdCAgc2VhcmNoIGxpc3RcclxuICpcclxuICogQHJldHVybiAge1t0eXBlXX0gICAgICAgW3JldHVybiBkZXNjcmlwdGlvbl1cclxuICovXHJcbmZ1bmN0aW9uIEF1dG9Db21wbGV0ZShpbnAsIGFycikge1xyXG4gIHZhciBjdXJyZW50Rm9jdXM7XHJcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIHdyaXRlcyBpbiB0aGUgdGV4dCBmaWVsZDoqL1xyXG4gIGlucC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBhLFxyXG4gICAgICBiLFxyXG4gICAgICBpLFxyXG4gICAgICB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgLypjbG9zZSBhbnkgYWxyZWFkeSBvcGVuIGxpc3RzIG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzKi9cclxuICAgIGNsb3NlQWxsTGlzdHMoKTtcclxuICAgIGlmICghdmFsKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGN1cnJlbnRGb2N1cyA9IC0xO1xyXG4gICAgLypjcmVhdGUgYSBESVYgZWxlbWVudCB0aGF0IHdpbGwgY29udGFpbiB0aGUgaXRlbXMgKHZhbHVlcyk6Ki9cclxuICAgIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgIGEuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQgKyAnYXV0b2NvbXBsZXRlLWxpc3QnKTtcclxuICAgIGEuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhdXRvY29tcGxldGUtaXRlbXMnKTtcclxuICAgIC8qYXBwZW5kIHRoZSBESVYgZWxlbWVudCBhcyBhIGNoaWxkIG9mIHRoZSBhdXRvY29tcGxldGUgY29udGFpbmVyOiovXHJcbiAgICB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAvKmZvciBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5Li4uKi9cclxuICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLypjaGVjayBpZiB0aGUgaXRlbSBzdGFydHMgd2l0aCB0aGUgc2FtZSBsZXR0ZXJzIGFzIHRoZSB0ZXh0IGZpZWxkIHZhbHVlOiovXHJcbiAgICAgIGlmIChhcnJbaV0uc3Vic3RyKDAsIHZhbC5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT0gdmFsLnRvVXBwZXJDYXNlKCkpIHtcclxuICAgICAgICAvKmNyZWF0ZSBhIERJViBlbGVtZW50IGZvciBlYWNoIG1hdGNoaW5nIGVsZW1lbnQ6Ki9cclxuICAgICAgICBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICAgICAgLyptYWtlIHRoZSBtYXRjaGluZyBsZXR0ZXJzIGJvbGQ6Ki9cclxuICAgICAgICBiLmlubmVySFRNTCA9ICc8c3Ryb25nPicgKyBhcnJbaV0uc3Vic3RyKDAsIHZhbC5sZW5ndGgpICsgJzwvc3Ryb25nPic7XHJcbiAgICAgICAgYi5pbm5lckhUTUwgKz0gYXJyW2ldLnN1YnN0cih2YWwubGVuZ3RoKTtcclxuICAgICAgICAvKmluc2VydCBhIGlucHV0IGZpZWxkIHRoYXQgd2lsbCBob2xkIHRoZSBjdXJyZW50IGFycmF5IGl0ZW0ncyB2YWx1ZToqL1xyXG4gICAgICAgIGIuaW5uZXJIVE1MICs9IFwiPGlucHV0IHR5cGU9J2hpZGRlbicgdmFsdWU9J1wiICsgYXJyW2ldICsgXCInPlwiO1xyXG4gICAgICAgIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSBjbGlja3Mgb24gdGhlIGl0ZW0gdmFsdWUgKERJViBlbGVtZW50KToqL1xyXG4gICAgICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAvKmluc2VydCB0aGUgdmFsdWUgZm9yIHRoZSBhdXRvY29tcGxldGUgdGV4dCBmaWVsZDoqL1xyXG4gICAgICAgICAgaW5wLnZhbHVlID0gdGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKVswXS52YWx1ZTtcclxuICAgICAgICAgIC8qY2xvc2UgdGhlIGxpc3Qgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXMsXHJcbiAgICAgICAgICAgIChvciBhbnkgb3RoZXIgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlczoqL1xyXG4gICAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGEuYXBwZW5kQ2hpbGQoYik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiBwcmVzc2VzIGEga2V5IG9uIHRoZSBrZXlib2FyZDoqL1xyXG4gIGlucC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XHJcbiAgICBpZiAoeCkgeCA9IHguZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xyXG4gICAgaWYgKGUua2V5Q29kZSA9PSA0MCkge1xyXG4gICAgICAvKklmIHRoZSBhcnJvdyBET1dOIGtleSBpcyBwcmVzc2VkLFxyXG4gICAgICBpbmNyZWFzZSB0aGUgY3VycmVudEZvY3VzIHZhcmlhYmxlOiovXHJcbiAgICAgIGN1cnJlbnRGb2N1cysrO1xyXG4gICAgICAvKmFuZCBhbmQgbWFrZSB0aGUgY3VycmVudCBpdGVtIG1vcmUgdmlzaWJsZToqL1xyXG4gICAgICBhZGRBY3RpdmUoeCk7XHJcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAzOCkge1xyXG4gICAgICAvL3VwXHJcbiAgICAgIC8qSWYgdGhlIGFycm93IFVQIGtleSBpcyBwcmVzc2VkLFxyXG4gICAgICBkZWNyZWFzZSB0aGUgY3VycmVudEZvY3VzIHZhcmlhYmxlOiovXHJcbiAgICAgIGN1cnJlbnRGb2N1cy0tO1xyXG4gICAgICAvKmFuZCBhbmQgbWFrZSB0aGUgY3VycmVudCBpdGVtIG1vcmUgdmlzaWJsZToqL1xyXG4gICAgICBhZGRBY3RpdmUoeCk7XHJcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAxMykge1xyXG4gICAgICAvKklmIHRoZSBFTlRFUiBrZXkgaXMgcHJlc3NlZCwgcHJldmVudCB0aGUgZm9ybSBmcm9tIGJlaW5nIHN1Ym1pdHRlZCwqL1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmIChjdXJyZW50Rm9jdXMgPiAtMSkge1xyXG4gICAgICAgIC8qYW5kIHNpbXVsYXRlIGEgY2xpY2sgb24gdGhlIFwiYWN0aXZlXCIgaXRlbToqL1xyXG4gICAgICAgIGlmICh4KSB4W2N1cnJlbnRGb2N1c10uY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGZ1bmN0aW9uIGFkZEFjdGl2ZSh4KSB7XHJcbiAgICAvKmEgZnVuY3Rpb24gdG8gY2xhc3NpZnkgYW4gaXRlbSBhcyBcImFjdGl2ZVwiOiovXHJcbiAgICBpZiAoIXgpIHJldHVybiBmYWxzZTtcclxuICAgIC8qc3RhcnQgYnkgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3Mgb24gYWxsIGl0ZW1zOiovXHJcbiAgICByZW1vdmVBY3RpdmUoeCk7XHJcbiAgICBpZiAoY3VycmVudEZvY3VzID49IHgubGVuZ3RoKSBjdXJyZW50Rm9jdXMgPSAwO1xyXG4gICAgaWYgKGN1cnJlbnRGb2N1cyA8IDApIGN1cnJlbnRGb2N1cyA9IHgubGVuZ3RoIC0gMTtcclxuICAgIC8qYWRkIGNsYXNzIFwiYXV0b2NvbXBsZXRlLWFjdGl2ZVwiOiovXHJcbiAgICB4W2N1cnJlbnRGb2N1c10uY2xhc3NMaXN0LmFkZCgnYXV0b2NvbXBsZXRlLWFjdGl2ZScpO1xyXG4gIH1cclxuICBmdW5jdGlvbiByZW1vdmVBY3RpdmUoeCkge1xyXG4gICAgLyphIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgXCJhY3RpdmVcIiBjbGFzcyBmcm9tIGFsbCBhdXRvY29tcGxldGUgaXRlbXM6Ki9cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB4W2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gY2xvc2VBbGxMaXN0cyhlbG1udCkge1xyXG4gICAgLypjbG9zZSBhbGwgYXV0b2NvbXBsZXRlIGxpc3RzIGluIHRoZSBkb2N1bWVudCxcclxuICBleGNlcHQgdGhlIG9uZSBwYXNzZWQgYXMgYW4gYXJndW1lbnQ6Ki9cclxuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGVsbW50ICE9IHhbaV0gJiYgZWxtbnQgIT0gaW5wKSB7XHJcbiAgICAgICAgeFtpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHhbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSBjbGlja3MgaW4gdGhlIGRvY3VtZW50OiovXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICBjbG9zZUFsbExpc3RzKGUudGFyZ2V0KTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgQXV0b0NvbXBsZXRlIH07XHJcbiIsImZ1bmN0aW9uIENvdW50cnlTZWxlY3RvcigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9fdXAnKTtcclxuICBsZXQgZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19kb3duJyk7XHJcbiAgbGV0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2l0ZW1zJyk7XHJcbiAgbGV0IGl0ZW1IZWlnaHQgPVxyXG4gICAgaXRlbXMgIT0gbnVsbCA/IGl0ZW1zLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcub2Zmc2V0SGVpZ2h0IDogMDtcclxuXHJcbiAgLy8gYmluZCBldmVudHNcclxuICBpZiAodXAgIT0gbnVsbCkge1xyXG4gICAgdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxVcCk7XHJcbiAgICBkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsRG93bik7XHJcblxyXG4gICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgIGZ1bmN0aW9uIHNjcm9sbFVwKCkge1xyXG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgdXAgYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcclxuICAgICAgaXRlbXMuc2Nyb2xsVG9wICs9IGl0ZW1IZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2Nyb2xsRG93bigpIHtcclxuICAgICAgLy8gbW92ZSBpdGVtcyBsaXN0IGRvd24gYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcclxuICAgICAgaXRlbXMuc2Nyb2xsVG9wIC09IGl0ZW1IZWlnaHQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfTtcclxuIiwiLy8gbW9kdWxlIENvdmVyT3B0aW9ucy5qc1xyXG5cclxuZnVuY3Rpb24gQ292ZXJPcHRpb25zKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGNvc3RQcmVmaXhUZXh0ID0gJCgnLmpzLWNvc3QtcHJlZml4Jyk7XHJcbiAgY29uc3Qgd2FybmluZ1RleHQgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLndhcm5pbmctdGV4dCcpO1xyXG4gIGNvbnN0IHdhcm5pbmdUZXh0NjAgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLndhcm5pbmctdGV4dC02MCcpO1xyXG4gIGNvbnN0IGNvdmVyT3B0aW9uUHJpY2UgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLmNhcmQtcHJpY2UnKTtcclxuICAvLyBHZXQgc2luZ2xlIHRyaXAgcHJpY2VcclxuICBjb25zdCBpbml0aWFsQ292ZXJQcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuYW1vdW50Jyk7XHJcbiAgY29uc3QgZF9pbml0aWFsQ292ZXJQcmljZSA9IHBhcnNlRmxvYXQoXHJcbiAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxyXG4gICkudG9GaXhlZCgyKTtcclxuXHJcbiAgY29uc3QgaW5pdGlhbFNpbmdsZVRyaXBQcmljZSA9ICQoJy5pbml0aWFsLXNpbmdsZS10cmlwLXByaWNlJyk7XHJcbiAgY29uc3QgZF9pbml0aWFsU2luZ2xlVHJpcFByaWNlID0gcGFyc2VGbG9hdChcclxuICAgIGluaXRpYWxTaW5nbGVUcmlwUHJpY2UudGV4dCgpLnJlcGxhY2UoL1xcRCovLCAnJylcclxuICApLnRvRml4ZWQoMik7XHJcblxyXG4gIGNvbnN0IGN1cnJlbmN5U3ltYm9sID0gaW5pdGlhbENvdmVyUHJpY2UudGV4dCgpLnN1YnN0cmluZygwLCAxKTtcclxuICBsZXQgaW5wdXRWYWx1ZSA9ICcnO1xyXG4gIGxldCBwcmljZUxpbWl0O1xyXG4gIGxldCB0b3RhbEluaXRpYWxQcmljZSA9IDA7XHJcbiAgbGV0IHRvdGFsU2luZ2xlUHJpY2UgPSAwO1xyXG4gIGxldCBmaW5hbFByaWNlID0gMDtcclxuXHJcbiAgaWYgKGN1cnJlbmN5U3ltYm9sID09ICdcXHUwMEEzJykge1xyXG4gICAgcHJpY2VMaW1pdCA9IDExOTtcclxuICB9IGVsc2Uge1xyXG4gICAgcHJpY2VMaW1pdCA9IDE0MjtcclxuICB9XHJcblxyXG4gIC8vY29uc29sZS5jbGVhcigpO1xyXG4gIC8vY29uc29sZS5sb2coYGNvdmVyIHByaWNlOiAke2RfaW5pdGlhbENvdmVyUHJpY2V9YCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgU2luZ2xlIFRyaXAgcHJpY2U6ICR7ZF9pbml0aWFsU2luZ2xlVHJpcFByaWNlfWApO1xyXG4gIC8vY29uc29sZS5sb2coYGN1cnJlbmN5U3ltYm9sOiAke2N1cnJlbmN5U3ltYm9sfWApO1xyXG5cclxuICAkKCcucHJvZHVjdC1vcHRpb25zLWRheXMtY292ZXInKS5jaGFuZ2UoZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAvLyBnZXQgdmFsdWVcclxuICAgIGlucHV0VmFsdWUgPSBwYXJzZUludChldnQuY3VycmVudFRhcmdldC52YWx1ZSk7XHJcblxyXG4gICAgLy8gaGlkZSBcImZyb21cIiB0ZXh0XHJcbiAgICBpZiAoaW5wdXRWYWx1ZSA+IDMpIHtcclxuICAgICAgY29zdFByZWZpeFRleHQuaGlkZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29zdFByZWZpeFRleHQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnB1dFZhbHVlID4gMCAmJiBOdW1iZXIuaXNJbnRlZ2VyKGlucHV0VmFsdWUpKSB7XHJcbiAgICAgIC8vIGNhbGN1bGF0ZSB3aXRoIGludGl0YWwgY292ZXIgcHJpY2VcclxuICAgICAgLy8gZF9pbml0aWFsQ292ZXJQcmljZSA9IDExLjk5XHJcbiAgICAgIGlmIChpbnB1dFZhbHVlID4gMCAmJiBpbnB1dFZhbHVlIDw9IDMpIHtcclxuICAgICAgICB0b3RhbEluaXRpYWxQcmljZSA9IGRfaW5pdGlhbENvdmVyUHJpY2U7XHJcbiAgICAgICAgdG90YWxTaW5nbGVQcmljZSA9IHRvdGFsSW5pdGlhbFByaWNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpZiAoKGlucHV0VmFsdWUgPiAzICYmIGlucHV0VmFsdWUgPD0gNjApIHx8IHByaWNlTGltaXQgPCBmaW5hbFByaWNlKSB7XHJcbiAgICAgIGlmIChpbnB1dFZhbHVlID4gMykge1xyXG4gICAgICAgIHRvdGFsSW5pdGlhbFByaWNlID0gZF9pbml0aWFsQ292ZXJQcmljZTtcclxuICAgICAgICAvLyBkb3VibGUgdXAgb24gdGhlIHN0cmluZyB2YWx1ZXMgdG8gdXNlIGEgdW5hcnkgcGx1cyB0byBjb252ZXJ0IGFuZCBoYXZlIGl0IGFkZGVkIHRvIHRoZSBwcmV2aW91cyB2YWx1ZVxyXG4gICAgICAgIHRvdGFsU2luZ2xlUHJpY2UgPVxyXG4gICAgICAgICAgK3RvdGFsSW5pdGlhbFByaWNlICsgKCtpbnB1dFZhbHVlIC0gMykgKiArZF9pbml0aWFsU2luZ2xlVHJpcFByaWNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmluYWxQcmljZSA9IHBhcnNlRmxvYXQodG90YWxTaW5nbGVQcmljZSkudG9GaXhlZCgyKTtcclxuXHJcbiAgICBpZiAoaW5wdXRWYWx1ZSA+IDExICYmIGlucHV0VmFsdWUgPD0gNjApIHtcclxuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xyXG4gICAgICAvLyBjaGFuZ2UgY29sb3Igb2YgcHJpY2VcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5hZGRDbGFzcygnd2FybmluZycpO1xyXG4gICAgICAvLyBzaG93IHdhcm5pbmcgdGV4dFxyXG4gICAgICB3YXJuaW5nVGV4dC5zaG93KCk7XHJcbiAgICAgIHdhcm5pbmdUZXh0NjAuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnNob3coKTtcclxuICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA+IDMgJiYgaW5wdXRWYWx1ZSA8PSA2MCkge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgZmluYWxQcmljZSk7XHJcbiAgICAgIHdhcm5pbmdUZXh0LmhpZGUoKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UucmVtb3ZlQ2xhc3MoJ3dhcm5pbmcnKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5zaG93KCk7XHJcbiAgICB9IGVsc2UgaWYgKGlucHV0VmFsdWUgPD0gMykge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgZmluYWxQcmljZSk7XHJcbiAgICAgIHdhcm5pbmdUZXh0LmhpZGUoKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5oaWRlKCk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UucmVtb3ZlQ2xhc3MoJ3dhcm5pbmcnKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5zaG93KCk7XHJcbiAgICB9IGVsc2UgaWYgKGlucHV0VmFsdWUgPiA2MCkge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgZmluYWxQcmljZSk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcclxuICAgICAgd2FybmluZ1RleHQ2MC5zaG93KCk7XHJcbiAgICAgIHdhcm5pbmdUZXh0LmhpZGUoKTtcclxuICAgICAgY292ZXJPcHRpb25QcmljZS5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KGN1cnJlbmN5U3ltYm9sICsgdG90YWxTaW5nbGVQcmljZSk7XHJcbiAgICAgIHdhcm5pbmdUZXh0NjAuaGlkZSgpO1xyXG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XHJcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2Uuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY29uc29sZS5sb2coYCR7aW5wdXRWYWx1ZX0gPSAke2ZpbmFsUHJpY2V9YCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IENvdmVyT3B0aW9ucyB9O1xyXG4iLCJmdW5jdGlvbiBUb2dnbGVOYXZpZ2F0aW9uKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGN1cnJlbmN5ID0gJCgnLmN1cnJlbmN5Jyk7XHJcbiAgY29uc3QgbWFpbk5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1tZW51Jyk7XHJcbiAgY29uc3QgbmF2QmFyVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcclxuICBjb25zdCBjdXJyZW5jeU5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jdXJyZW5jeS10b2dnbGUnKTtcclxuICBjb25zdCBjdXJyZW5jeU1lbnVUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIG5hdkJhclRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU1lbnUpO1xyXG4gIGN1cnJlbmN5TWVudVRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUN1cnJlbmN5TWVudSk7XHJcblxyXG4gIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcclxuICAgIG1haW5OYXYuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVDdXJyZW5jeU1lbnUoKSB7XHJcbiAgICBjdXJyZW5jeU5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGlmICgkKHdpbmRvdykud2lkdGgoKSA+ICcxMTk5Jykge1xyXG4gICAgY3VycmVuY3kuc2hvdygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjdXJyZW5jeS5oaWRlKCk7XHJcbiAgfVxyXG5cclxuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gJzExOTknKSB7XHJcbiAgICAgIGN1cnJlbmN5LnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN1cnJlbmN5LmhpZGUoKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gRHJvcGRvd25NZW51KCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBjYXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLWNhcicpO1xyXG4gIGxldCBkcm9wRG93bk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tLWNhciAuZHJvcGRvd24tbWVudScpO1xyXG5cclxuICBpZiAoY2FyQnRuICE9IG51bGwgJiYgZHJvcERvd25NZW51ICE9IG51bGwpIHtcclxuICAgIGxldCBkcm9wRG93biA9IGNhckJ0bi5wYXJlbnRFbGVtZW50O1xyXG4gICAgLy8gQmluZCBldmVudHNcclxuICAgIGNhckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhckJ0bkhhbmRsZXIpO1xyXG5cclxuICAgIC8vIEV2ZW50IGhhbmRsZXJzXHJcbiAgICBmdW5jdGlvbiBjYXJCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgLy8gdG9nZ2xlIGRpc3BsYXlcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHxcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJydcclxuICAgICAgKSB7XHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9XHJcbiAgICAgICAgICBkcm9wRG93bi5vZmZzZXRIZWlnaHQgKyBkcm9wRG93bk1lbnUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEZpeGVkTmF2aWdhdGlvbigpIHtcclxuICAvLyBtYWtlIG5hdmJhciBzdGlja3lcclxuICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxyXG4gIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbXlGdW5jdGlvbigpO1xyXG4gIH07XHJcblxyXG4gIC8vIEdldCB0aGUgaGVhZGVyXHJcbiAgbGV0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZiYXInKTtcclxuXHJcbiAgLy8gR2V0IHRoZSBvZmZzZXQgcG9zaXRpb24gb2YgdGhlIG5hdmJhclxyXG4gIGxldCBzdGlja3kgPSBuYXZCYXIub2Zmc2V0VG9wO1xyXG5cclxuICAvLyBBZGQgdGhlIHN0aWNreSBjbGFzcyB0byB0aGUgaGVhZGVyIHdoZW4geW91IHJlYWNoIGl0cyBzY3JvbGwgcG9zaXRpb24uIFJlbW92ZSBcInN0aWNreVwiIHdoZW4geW91IGxlYXZlIHRoZSBzY3JvbGwgcG9zaXRpb25cclxuICBmdW5jdGlvbiBteUZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XHJcbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gc3RpY2t5KSB7XHJcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QuYWRkKCduYXZiYXItZml4ZWQtdG9wJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuYXZCYXIuY2xhc3NMaXN0LnJlbW92ZSgnbmF2YmFyLWZpeGVkLXRvcCcpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gU2VsZWN0VHJpcCgpIHtcclxuICAvLyBzZWxlY3QgdmVoaWNsZVxyXG4gICQoJy50YWItY2FyIC5idG4nKS5jbGljayhmdW5jdGlvbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pO1xyXG5cclxuICAkKCcudGFiLWNhciAuaWNvbi1yYWRpbyBpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5jbGljayhmdW5jdGlvbihldnQpIHtcclxuICAgICQoJy50YWItY2FyIC5idG4nKS5yZW1vdmVDbGFzcygnYnRuLWN0YS0tZGlzYWJsZWQnKTtcclxuICAgICQoJy50YWItY2FyIC5idG4nKS5hZGRDbGFzcygnYnRuLWN0YScpO1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnVuYmluZCgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBzaG93IG1vYmlsZSBjdXJyZW5jeVxyXG5mdW5jdGlvbiBSZXZlYWxDdXJyZW5jeSgpIHtcclxuICAkKCcuY3VycmVuY3ktbW9iaWxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ3VycmVuY3knKTtcclxuXHJcbiAgICAkKCcuY3VycmVuY3knKS5zbGlkZVRvZ2dsZSgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gIFRvZ2dsZU5hdmlnYXRpb24sXHJcbiAgRHJvcGRvd25NZW51LFxyXG4gIEZpeGVkTmF2aWdhdGlvbixcclxuICBTZWxlY3RUcmlwLFxyXG4gIFJldmVhbEN1cnJlbmN5XHJcbn07XHJcbiIsImltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vUHViU3ViJztcclxuXHJcbi8vIG1vZHVsZSBcIlBvbGljeVN1bW1hcnkuanNcIlxyXG4vLyBtb2R1bGUgXCJQb2xpY3lTdW1tYXJ5QWNjb3JkaW9uLmpzXCJcclxuXHJcbmZ1bmN0aW9uIERlc2t0b3BEZXZpY2VTZXR1cCgpIHtcclxuICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyByZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyBmcm9tIGFsbFxyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH0pO1xyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtY2hpbGQoMiknKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gIC8vIHNob3cgcG9saWN5IGluZm9cclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24gLnBvbGljeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9KTtcclxuXHJcbiAgLy8gcmVzZXQgcG9saWN5IHN1bW1hcnlcclxuICAkKCcucG9saWN5LXN1bW1hcnktaW5mbycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9KTtcclxuICAkKCcucG9saWN5LXN1bW1hcnktaW5mbzpmaXJzdC1jaGlsZCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAvLyByZW1vdmUgbW9iaWxlIGV2ZW50IGxpc3RlbmVyXHJcbiAgY29uc3QgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcuYWNjb3JkaW9uLWJhciBidXR0b24ubW9yZS1pbmZvcm1hdGlvbidcclxuICApO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYWNjW2ldLmV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgYWNjW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBQb2xpY3lTdW1tYXJ5RGVza3RvcCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBNb2JpbGVEZXZpY2VTZXR1cCgpIHtcclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAkKGVsZW1lbnQpXHJcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24gLnBvbGljeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyByZXNldCBwb2xpY3kgc3VtbWFyeVxyXG4gICQoJy5wb2xpY3ktc3VtbWFyeS1pbmZvJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyByZW1vdmUgZGVza3RvcCBldmVudCBsaXN0ZW5lclxyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLnVuYmluZCgpO1xyXG5cclxuICAvLyBzZXR1cCBNb2JpbGVcclxuICBQb2xpY3lTdW1tYXJ5TW9iaWxlKCk7XHJcbn1cclxuXHJcbi8vIGRldmljZSByZXNldCBPTiBicm93c2VyIHdpZHRoXHJcbmZ1bmN0aW9uIFBvbGljeVN1bW1hcnlEZXZpY2VSZXNpemUoKSB7XHJcbiAgLy8gY29uc29sZS5sb2cod2luZG93Lm91dGVyV2lkdGgpO1xyXG5cclxuICBpZiAod2luZG93Lm91dGVyV2lkdGggPiAxMTk5KSB7XHJcbiAgICAvKipcclxuICAgICAqIERFVklDRTogRGVza3RvcFxyXG4gICAgICovXHJcbiAgICBEZXNrdG9wRGV2aWNlU2V0dXAoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBERVZJQ0U6IE1vYmlsZVxyXG4gICAgICovXHJcbiAgICBNb2JpbGVEZXZpY2VTZXR1cCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FjaGUgRE9NXHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbihldnQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGV2dC50YXJnZXQub3V0ZXJXaWR0aCk7XHJcblxyXG4gICAgaWYgKGV2dC50YXJnZXQub3V0ZXJXaWR0aCA+IDExOTkpIHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIERFVklDRTogRGVza3RvcFxyXG4gICAgICAgKi9cclxuICAgICAgRGVza3RvcERldmljZVNldHVwKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKipcclxuICAgICAgICogREVWSUNFOiBNb2JpbGVcclxuICAgICAgICovXHJcbiAgICAgIE1vYmlsZURldmljZVNldHVwKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb2xpY3kgU3VtbWFyeSBIYW5kbGVyIGZvciBtb2JpbGVcclxuICpcclxuICogQHJldHVybiAge25vbmV9XHJcbiAqL1xyXG5mdW5jdGlvbiBQb2xpY3lTdW1tYXJ5TW9iaWxlKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAnLmFjY29yZGlvbi1iYXIgYnV0dG9uLm1vcmUtaW5mb3JtYXRpb24nXHJcbiAgKTtcclxuICBsZXQgY2FyZENvdmVyT3B0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQtY292ZXItb3B0aW9uJyk7XHJcbiAgbGV0IHBvbGljeVN1bW1hcnlJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvbGljeS1zdW1tYXJ5LWluZm8nKTtcclxuICBsZXQgcG9saWN5UmVmZXJlbmNlID0gJyc7XHJcblxyXG4gIGxldCBhY3RpdmVDYXJkT3B0aW9uID0gJyc7XHJcblxyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcclxuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBhY2NvcmRpb25IYW5kbGVyKGV2dCkge1xyXG4gICAgY29uc29sZS5sb2coZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgLyogaGlkZSB0aGUgb3RoZXIgb3B0aW9ucyAqL1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gbW9yZSBpbmZvcm1hdGlvbiBidXR0b24gaGFzIGJlZW4gY2xpY2tlZFxyXG4gICAgaWYgKGFjdGl2ZUNhcmRPcHRpb24gPT09ICdzZWxlY3RlZCcpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ0Nsb3NlJyk7XHJcblxyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5pbm5lclRleHQgPSAnTW9yZSBpbmZvcm1hdGlvbic7XHJcblxyXG4gICAgICAvLyByZW1vdmUgYWN0aXZlIGJvcmRlclxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRDb3Zlck9wdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNhcmRDb3Zlck9wdGlvbltpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICBjYXJkQ292ZXJPcHRpb25baV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGhpZGUgcG9saWN5LWluZm9cclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICcuY2FyZC1jb3Zlci1vcHRpb25bZGF0YS1wb2xpY3lePVwicG9saWN5LXN1bW1hcnktXCJdIC5wb2xpY3ktaW5mbydcclxuICAgICAgICApXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gaGlkZSBhbGwgcG9saWN5LXN1bW1hcnktaW5mbyBibG9ja3NcclxuICAgICAgcG9saWN5U3VtbWFyeUluZm8uZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFjdGl2ZUNhcmRPcHRpb24gPSAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdPcGVuJyk7XHJcblxyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5pbm5lclRleHQgPSAnVmlldyBvdGhlciBvcHRpb25zJztcclxuXHJcbiAgICAgIC8vIG1vdmUgbW9yZSBpbmZvcm1hdGlvbiBhcnJvd1xyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgIC8qIGhpZ2hsaWdodCB0aGUgY2FyZCB0aGF0J3MgYmVlbiBzZWxlY3RlZCAqL1xyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgJ2FjdGl2ZSdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIGdldCBwb2xpY3kgcmVmZXJlbmNlXHJcbiAgICAgIHBvbGljeVJlZmVyZW5jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLWNvdmVyLW9wdGlvbi5hY3RpdmUnKVxyXG4gICAgICAgIC5kYXRhc2V0LnBvbGljeTtcclxuXHJcbiAgICAgIC8vIHNob3cgb25seSB0aGUgcHJvZHVjdCBzdW1tYXJ5IGluZm8gdGhhdCBoYXMgYW4gYWN0aXZlIHByb2R1Y3QgY292ZXIgb3B0aW9uXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZENvdmVyT3B0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGNhcmRDb3Zlck9wdGlvbltpXS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuaW5kZXhPZignYWN0aXZlJykgPCAwKSB7XHJcbiAgICAgICAgICBjYXJkQ292ZXJPcHRpb25baV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FyZENvdmVyT3B0aW9uW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2hvdyB0aGUgY292ZXIgb3B0aW9uIGluZm8gdGV4dFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICcuY2FyZC1jb3Zlci1vcHRpb25bZGF0YS1wb2xpY3k9XCInICsgcG9saWN5UmVmZXJlbmNlICsgJ1wiXSAucG9saWN5LWluZm8nXHJcbiAgICAgICkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblxyXG4gICAgICBhY3RpdmVDYXJkT3B0aW9uID0gJ3NlbGVjdGVkJztcclxuXHJcbiAgICAgIC8vIGhpZGUgYWxsIHBvbGljeS1zdW1tYXJ5LWluZm8gYmxvY2tzXHJcbiAgICAgIHBvbGljeVN1bW1hcnlJbmZvLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBnZXQgdGhlIHBvbGljeSBzdW1tYXJ5IGluZm8gcGFuZWwgYXNzb2NpY2F0ZWQgd2l0aCB0aGlzIHByb2R1Y3QgdXNpbmcgdGhlIHBvbGljeVJlZmVyZW5jZVxyXG4gICAgICBsZXQgcGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICcucG9saWN5LXN1bW1hcnktaW5mby4nICsgcG9saWN5UmVmZXJlbmNlXHJcbiAgICAgICk7XHJcbiAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cclxuICAgICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XHJcbiAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudHMub24oJ2hlaWdodENoYW5nZWQnLCBhZGp1c3RQYW5lbEhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRqdXN0UGFuZWxIZWlnaHQobmV3SGVpZ2h0KSB7XHJcbiAgICAgIGxldCBuZXdUb3RhbCA9XHJcbiAgICAgICAgcGFyc2VJbnQoXHJcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQuc3Vic3RyaW5nKDAsIHBhbmVsLnN0eWxlLm1heEhlaWdodC5sZW5ndGggLSAyKVxyXG4gICAgICAgICkgK1xyXG4gICAgICAgIHBhcnNlSW50KG5ld0hlaWdodC5zdWJzdHJpbmcoMCwgbmV3SGVpZ2h0Lmxlbmd0aCAtIDIpKSArXHJcbiAgICAgICAgJ3B4JztcclxuXHJcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG5ld1RvdGFsO1xyXG4gICAgfVxyXG4gIH0gLy8gYWNjb3JkaW9uSGFuZGxlclxyXG59IC8vIFBvbGljeVN1bW1hcnlNb2JpbGVcclxuXHJcbi8qKlxyXG4gKiBQb2xpY3kgU3VtbWFyeSBoYW5kbGVyIGZvciBkZXNrdG9wXHJcbiAqXHJcbiAqIEByZXR1cm4gIHtub25lfVxyXG4gKi9cclxuZnVuY3Rpb24gUG9saWN5U3VtbWFyeURlc2t0b3AoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgLy8gcG9saWN5IHN1bW1hcnlcclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5jbGljayhmdW5jdGlvbihldnQpIHtcclxuICAgICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgJChlbGVtZW50KS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgLy8gc2hvdyBwb2xpY3kgc3VtbWFyeVxyXG4gICAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgcG9saWN5U3VtbWFyeSA9ICQodGhpcykuZGF0YSgncG9saWN5Jyk7XHJcbiAgICAkKCcuJyArIHBvbGljeVN1bW1hcnkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gIH0pO1xyXG59IC8vIFBvbGljeVN1bW1hcnlEZXNrdG9wXHJcblxyXG5leHBvcnQgeyBQb2xpY3lTdW1tYXJ5RGV2aWNlUmVzaXplLCBQb2xpY3lTdW1tYXJ5TW9iaWxlLCBQb2xpY3lTdW1tYXJ5RGVza3RvcCB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIHdpbGwgc2VuZCBhIGNoYW5nZWQgZXZlbnQgdG8gUHViU3ViIGFuZFxyXG4vLyBhbnlvbmUgbGlzdGVuaW5nIHdpbGwgcmVjZWl2ZSB0aGF0IGNoYW5nZWQgZXZlbnQgYW5kXHJcbi8vIHRoZW4gdXBkYXRlIGFjY29yZGluZ2x5XHJcblxyXG5sZXQgZXZlbnRzID0ge1xyXG4gIC8vIGxpc3Qgb2YgZXZlbnRzXHJcbiAgZXZlbnRzOiB7fSxcclxuXHJcbiAgb246IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xyXG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcclxuICB9LFxyXG5cclxuICBvZmY6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xyXG4gICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBlbWl0OiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xyXG4gICAgICAgIGZuKGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgeyBldmVudHMgfTtcclxuIiwiLy8gbW9kdWxlIFJldmVhbERvY3MuanNcclxuXHJcbmZ1bmN0aW9uIFJldmVhbERvY3MoKSB7XHJcbiAgLy9Eb2NzXHJcbiAgJCgnLnJldmVhbGRvY3MnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgb24gPSAkKCcuZG9jcycpLmlzKCc6dmlzaWJsZScpO1xyXG4gICAgJCh0aGlzKS5odG1sKFxyXG4gICAgICBvbiA/ICdWaWV3IHBvbGljeSBkb2N1bWVudGF0aW9uJyA6ICdIaWRlIHBvbGljeSBkb2N1bWVudGF0aW9uJ1xyXG4gICAgKTtcclxuICAgICQoJy5kb2NzJykuc2xpZGVUb2dnbGUoKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgUmV2ZWFsRG9jcyB9O1xyXG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wKHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXHJcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAod2luZG93LnNjcm9sbFkgIT0gMCkge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcclxuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xyXG4gICAgfSwgMTUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xyXG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXHJcbiAgICBvbGRUaW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcclxuICAgIHNjcm9sbENvdW50ICs9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyAobmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wKSk7XHJcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oXHJcbiAgICAgIDAsXHJcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxyXG4gICAgKTtcclxuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG59XHJcbi8qXHJcbiAgRXhwbGFuYXRpb25zOlxyXG4gIC0gcGkgaXMgdGhlIGxlbmd0aC9lbmQgcG9pbnQgb2YgdGhlIGNvc2ludXMgaW50ZXJ2YWxsIChzZWUgYWJvdmUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxyXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAtIG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCBlcXVhbHMgdGhlIGR1cmF0aW9uXHJcblxyXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcclxuICA9IGEgKiBjb3MgKGJ4KSArIGQgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZCB0cmFuc2xhdGVzIGFsb25nIHRoZSB5IGF4aXMgPSAxIC0+IG9ubHkgcG9zaXRpdmUgeSB2YWx1ZXNcclxuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXHJcbiAgPSBjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiAoY29zIHNjcm9sbENvdW50ICogeClcclxuKi9cclxuXHJcbmZ1bmN0aW9uIFNjcm9sbFRvVG9wKCkge1xyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xyXG5cclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xyXG4gICAgYmFja1RvVG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYmFja1RvVG9wQnRuSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XHJcblxyXG4gICAgLy8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMzAwKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGFjY29yZGlvbkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xyXG4gICk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCB3ID1cclxuICAgICAgd2luZG93LmlubmVyV2lkdGggfHxcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgICBpZiAodyA+IDEyMDApIHtcclxuICAgICAgbGV0IGk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodyA8PSAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9O1xyXG4iLCIvLyBtb2R1bGUgXCJTY3JvbGxUby5qc1wiXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUbygpIHtcclxuICAvLyBjYWNoZSBET01cclxuICAvLyBTZWxlY3QgYWxsIGxpbmtzIHdpdGggaGFzaGVzXHJcbiAgLy8gUmVtb3ZlIGxpbmtzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgbGluayB0byBhbnl0aGluZ1xyXG4gIGxldCBhbmNob3JzID0gJCgnYVtocmVmKj1cIiNcIl0nKVxyXG4gICAgLm5vdCgnW2hyZWY9XCIjXCJdJylcclxuICAgIC5ub3QoJ1tocmVmPVwiIzBcIl0nKTtcclxuXHJcbiAgbGV0IGhlaWdodENvbXBlbnNhdGlvbiA9IDYwO1xyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgYW5jaG9ycy5jbGljayhhbmNob3JzSGFuZGxlcik7XHJcblxyXG4gIC8vIEV2ZW50IEhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gYW5jaG9yc0hhbmRsZXIoZXZlbnQpIHtcclxuICAgIC8vIE9uLXBhZ2UgbGlua3NcclxuICAgIGlmIChcclxuICAgICAgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSA9PVxyXG4gICAgICAgIHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSAmJlxyXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lXHJcbiAgICApIHtcclxuICAgICAgLy8gRmlndXJlIG91dCBlbGVtZW50IHRvIHNjcm9sbCB0b1xyXG4gICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgICB0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcbiAgICAgIC8vIERvZXMgYSBzY3JvbGwgdGFyZ2V0IGV4aXN0P1xyXG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgIC8vIE9ubHkgcHJldmVudCBkZWZhdWx0IGlmIGFuaW1hdGlvbiBpcyBhY3R1YWxseSBnb25uYSBoYXBwZW5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3AgLSBoZWlnaHRDb21wZW5zYXRpb25cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAxMDAwLFxyXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxyXG4gICAgICAgICAgICAvLyBNdXN0IGNoYW5nZSBmb2N1cyFcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKHRhcmdldCk7XHJcbiAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKCR0YXJnZXQuaXMoJzpmb2N1cycpKSB7XHJcbiAgICAgICAgICAgICAgLy8gQ2hlY2tpbmcgaWYgdGhlIHRhcmdldCB3YXMgZm9jdXNlZFxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkdGFyZ2V0LmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7IC8vIEFkZGluZyB0YWJpbmRleCBmb3IgZWxlbWVudHMgbm90IGZvY3VzYWJsZVxyXG4gICAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTsgLy8gU2V0IGZvY3VzIGFnYWluXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvbiBzY3JvbGxcclxuaWYgKCQoJy5hcnRpY2xlLW1haW4nKS5sZW5ndGggPiAwKSB7XHJcbiAgbGV0IHRhcmdldCA9ICQoJy5hcnRpY2xlLW1haW4nKS5vZmZzZXQoKS50b3AgLSAxODA7XHJcbiAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+PSB0YXJnZXQpIHtcclxuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLmhpZGUoKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgU2Nyb2xsVG8gfTtcclxuIiwiZnVuY3Rpb24gUmVhZHkoZm4pIHtcclxuICBpZiAoXHJcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxyXG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcclxuICAgICAgOiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZydcclxuICApIHtcclxuICAgIGZuKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBSZWFkeSB9O1xyXG4iLCJmdW5jdGlvbiBWZWhpY2xlU2VsZWN0b3IoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGNhclRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fY2FyJyk7XHJcbiAgbGV0IHZhblRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fdmFuJyk7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgaWYgKGNhclRhYiAhPSBudWxsICYmIHZhblRhYiAhPSBudWxsKSB7XHJcbiAgICBjYXJUYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XHJcbiAgICB2YW5UYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XHJcbiAgfVxyXG5cclxuICAvLyBldmVudCBoYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIG9wZW5WZWhpY2xlKGV2dCkge1xyXG4gICAgdmFyIGksIHgsIHRhYkJ1dHRvbnM7XHJcblxyXG4gICAgY29uc29sZS5sb2coZXZ0KTtcclxuXHJcbiAgICAvLyBoaWRlIGFsbCB0YWIgY29udGVudHNcclxuICAgIHggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLWNvbnRhaW5lciAudGFiJyk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB4W2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIHRoZSBoaWdobGlnaHQgb24gdGhlIHRhYiBidXR0b25cclxuICAgIHRhYkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LXRhYnMgLm5hdi1saW5rJyk7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZSA9IHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lLnJlcGxhY2UoJyBhY3RpdmUnLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGlnaGxpZ2h0IHRhYiBidXR0b24gYW5kXHJcbiAgICAvLyBzaG93IHRoZSBzZWxlY3RlZCB0YWIgY29udGVudFxyXG4gICAgbGV0IHZlaGljbGUgPSBldnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmVoaWNsZScpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi0nICsgdmVoaWNsZSkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc05hbWUgKz0gJyBhY3RpdmUnO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH07XHJcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCJ1dGlsXCI7XHJcblxyXG4vLyBtb2R1bGUgXCJMb2FkRkFRcy5qc1wiXHJcblxyXG5mdW5jdGlvbiBMb2FkRkFRcygpIHtcclxuICAvLyBsb2FkIGZhcXNcclxuICAkKCcjZmFxVGFicyBhJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzKS50YWIoJ3Nob3cnKTtcclxuICB9KTtcclxuXHJcbiAgLy8gbG9hZCBmYXFzXHJcbiAgLy8gb25seSBsb2FkIGlmIG9uIGZhcXMgcGFnZVxyXG4gIGlmICgkKCcjZmFxcycpLmxlbmd0aCA+IDApIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICB1cmw6ICcvYXBpL2ZhcXMuanNvbicsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcclxuICAgICAgICAvLyBnZXQgdGhlIGhlYWRzXHJcbiAgICAgICAgJC5lYWNoKGZhcXMsIGZ1bmN0aW9uKGluZGV4LCBmYXEpIHtcclxuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgZGVza3RvcFxyXG4gICAgICAgICAgJChgYVtocmVmPScjJHtmYXEuaWR9J11gKVxyXG4gICAgICAgICAgICAuZmluZCgnc3BhbicpXHJcbiAgICAgICAgICAgIC50ZXh0KGZhcS50aXRsZSk7XHJcblxyXG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBtb2JpbGVcclxuICAgICAgICAgICQoYCMke2ZhcS5pZH1gKVxyXG4gICAgICAgICAgICAuZmluZCgnaDMnKVxyXG4gICAgICAgICAgICAudGV4dChmYXEuc2hvcnRUaXRsZSk7XHJcblxyXG4gICAgICAgICAgLy8gZ2V0IHRoZSBib2R5XHJcbiAgICAgICAgICAkLmVhY2goZmFxLnFhcywgZnVuY3Rpb24oZkluZGV4LCBxYSkge1xyXG4gICAgICAgICAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicsIGAjJHtmYXEuaWR9YCkuYXBwZW5kKFxyXG4gICAgICAgICAgICAgIGA8YnV0dG9uIGNsYXNzPVwiYWNjb3JkaW9uLWJ0biBoNFwiPiR7cWEucXVlc3Rpb259PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAke3FhLmFuc3dlcn1cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTsgLy8gJGFqYXhcclxuXHJcbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcclxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcclxuICAgICAgJ2NsaWNrJyxcclxuICAgICAgZmFxc0hhbmRsZXJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBsb2FkUHJvZHVjdFBhZ2VGQVFzKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkUHJvZHVjdFBhZ2VGQVFzKCkge1xyXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBwcm9kdWN0IHBhZ2VcclxuICBpZiAoJCgnLnByb2R1Y3QtZmFxcycpLmxlbmd0aCA+IDApIHtcclxuICAgIGxldCBmaWxlID0gJCgnLnByb2R1Y3QtZmFxcycpXHJcbiAgICAgIC5kYXRhKCdmYXFzJylcclxuICAgICAgLnJlcGxhY2UoJyYtJywgJycpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coYC9hcGkvJHtmaWxlfS1mYXFzLmpzb25gKTtcclxuXHJcbiAgICAvLyQuYWpheCh7XHJcbiAgICAvLyAgdHlwZTogJ0dFVCcsXHJcbiAgICAvLyAgdXJsOiBgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmAsXHJcbiAgICAvLyAgc3VjY2VzczogdXBkYXRlVUlTdWNjZXNzLFxyXG4gICAgLy8gIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycm9yKSB7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcclxuICAgIC8vICB9XHJcbiAgICAvL30pOyAvLyAkYWpheFxyXG5cclxuICAgIGZldGNoKGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHJldHVybiAocmVzcG9uc2UuanNvbigpKTtcclxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIHVwZGF0ZVVJU3VjY2VzcyhyZXNwb25zZSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgdXBkYXRlVUlGYWlsdXJlKGVycm9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5mYXEtYW5zd2VycyAuaW5uZXIgLmFjY29yZGlvbicpLmRlbGVnYXRlKFxyXG4gICAgICAnLmFjY29yZGlvbi1idG4nLFxyXG4gICAgICAnY2xpY2snLFxyXG4gICAgICBmYXFzSGFuZGxlclxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVVSVN1Y2Nlc3MoZmFxcykge1xyXG4gIC8vIGdldCB0aGUgYm9keVxyXG4gICQuZWFjaChmYXFzLCBmdW5jdGlvbiAoZkluZGV4LCBmYXEpIHtcclxuICAgIC8vY29uc29sZS5sb2coYCMke2ZhcS5pZH1gKTtcclxuICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJykuYXBwZW5kKFxyXG4gICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke2ZhcS5xdWVzdGlvbn08L2J1dHRvbj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxyXG4gICAgICAgICAgICAgICR7ZmFxLmFuc3dlcn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBgXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICAvLyBzaG93IGNvbnRlbnRcclxuICAkKCcuZmFxLWFuc3dlcnMtcHJvZHVjdCcpLnNob3coKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVUlGYWlsdXJlKGVycm9yKSB7XHJcbiAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiwgZXJyb3IpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmYXFzSGFuZGxlcihldnQpIHtcclxuICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxyXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cclxuICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuXHJcbiAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cclxuICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xyXG4gICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcclxuICB9IGVsc2Uge1xyXG4gICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCB7IExvYWRGQVFzIH07XHJcbiIsImltcG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xyXG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uJztcclxuaW1wb3J0IHsgQ291bnRyeVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdW50cnlTZWxlY3Rvcic7XHJcbmltcG9ydCB7IFZlaGljbGVTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9WZWhpY2xlU2VsZWN0b3InO1xyXG5pbXBvcnQge1xyXG4gIFRvZ2dsZU5hdmlnYXRpb24sXHJcbiAgRHJvcGRvd25NZW51LFxyXG4gIEZpeGVkTmF2aWdhdGlvbixcclxuICBTZWxlY3RUcmlwLFxyXG4gIFJldmVhbEN1cnJlbmN5XHJcbn0gZnJvbSAnLi9jb21wb25lbnRzL05hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBTY3JvbGxUbyB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JvbGxUbyc7XHJcbmltcG9ydCB7IEF1dG9Db21wbGV0ZSB9IGZyb20gJy4vY29tcG9uZW50cy9BdXRvQ29tcGxldGUnO1xyXG5pbXBvcnQgeyBMb2FkRkFRcyB9IGZyb20gJy4vY29tcG9uZW50cy9mYXFzJztcclxuaW1wb3J0IHsgUmV2ZWFsRG9jcyB9IGZyb20gJy4vY29tcG9uZW50cy9SZXZlYWxEb2NzJztcclxuaW1wb3J0IHsgQ292ZXJPcHRpb25zIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdmVyT3B0aW9ucyc7XHJcbmltcG9ydCB7IFJlYWR5IH0gZnJvbSAnLi9jb21wb25lbnRzL1V0aWxzJztcclxuaW1wb3J0IHtcclxuICBQb2xpY3lTdW1tYXJ5RGV2aWNlUmVzaXplLFxyXG4gIFBvbGljeVN1bW1hcnlNb2JpbGUsXHJcbiAgUG9saWN5U3VtbWFyeURlc2t0b3BcclxufSBmcm9tICcuL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeSc7XHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJ3V0aWwnO1xyXG5cclxubGV0IGNvdW50cmllc0NvdmVyZWQgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgLy8gQ291bnRyeVNlbGVjdG9yKCk7XHJcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbigpO1xyXG4gIERyb3Bkb3duTWVudSgpO1xyXG4gIFNjcm9sbFRvVG9wKCk7XHJcbiAgRml4ZWROYXZpZ2F0aW9uKCk7XHJcbiAgQWNjb3JkaW9uKCk7XHJcbiAgV2luZG93V2lkdGgoKTtcclxuICBTY3JvbGxUbygpO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhgY291bnRyaWVzQ292ZXJlZDogJHtjb3VudHJpZXNDb3ZlcmVkfWApO1xyXG4gIC8vIGlmIChjb3VudHJpZXNDb3ZlcmVkICE9IG51bGwpIHtcclxuICAvLyAgIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbnB1dCcpLCBjb3VudHJpZXNDb3ZlcmVkKTtcclxuICAvLyB9XHJcblxyXG4gIExvYWRGQVFzKCk7XHJcbiAgUmV2ZWFsRG9jcygpO1xyXG4gIENvdmVyT3B0aW9ucygpO1xyXG4gIC8vIFBvbGljeVN1bW1hcnlNb2JpbGUoKTtcclxuICAvLyBQb2xpY3lTdW1tYXJ5RGVza3RvcCgpO1xyXG4gIFBvbGljeVN1bW1hcnlEZXZpY2VSZXNpemUoKTtcclxuICBTZWxlY3RUcmlwKCk7XHJcbiAgUmV2ZWFsQ3VycmVuY3koKTtcclxuICAvLyBMYXp5TG9hZCgpO1xyXG59XHJcblxyXG5SZWFkeShzdGFydCk7XHJcbiJdfQ==
