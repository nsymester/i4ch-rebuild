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
  }
}
exports.Accordion = Accordion;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.AutoComplete = AutoComplete;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function CountrySelector() {
  // cache DOM
  var up = document.querySelector('.country-scroller__up');
  var down = document.querySelector('.country-scroller__down');
  var items = document.querySelector('.country-scroller__items');
  var itemHeight = items != null ? items.firstChild.nextSibling.offsetHeight : 0;

  // bind events
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

exports.CountrySelector = CountrySelector;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module CoverOptions.js

function CoverOptions() {
  // cache DOM
  var warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
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

    if (inputValue > 0) {
      // calculate with intital cover price
      if (inputValue > 0 && inputValue <= 3) {
        totalInitialPrice = inputValue * d_initialCoverPrice;
        totalSinglePrice = 0;
      }

      if (inputValue > 3 && finalPrice < priceLimit || priceLimit < finalPrice) {
        totalSinglePrice = (inputValue - 3) * d_initialSingleTripPrice;
      }
    }
    finalPrice = parseFloat(totalInitialPrice + totalSinglePrice).toFixed(2);

    if (finalPrice > priceLimit) {
      initialCoverPrice.text(currencySymbol + parseFloat(priceLimit).toFixed(2));
      // change color of price
      coverOptionPrice.addClass('warning');
      // show warning text
      warningText.show();
    } else {
      initialCoverPrice.text(currencySymbol + finalPrice);
      warningText.hide();
      coverOptionPrice.removeClass('warning');
    }

    //console.log(`${inputValue} = ${finalPrice}`);
  });
}

exports.CoverOptions = CoverOptions;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module "GoodbyeWorld.js"

function Goodbye() {
  return 'Goodbye';
}

var World = 'World !!';

exports.Goodbye = Goodbye;
exports.World = World;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function PolicySummary() {
  // policy summary
  $('.policy-summary .info-box').each(function (index, element) {
    if (index === 0) {
      return true;
    }
    $(element).css('display', 'none');
  });

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
}

exports.PolicySummary = PolicySummary;

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
  console.log('WindowWidth');

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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
        console.log('error: ', _error);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', function (evt) {
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
    });
  }

  // only load if on product faqs page
  if ($('.product-faqs').length > 0) {
    var file = $('.product-faqs').data('faqs').replace('&-', '');

    console.log('/api/' + file + '-faqs.json');

    $.ajax({
      type: 'GET',
      url: '/api/' + file + '-faqs.json',
      success: function success(faqs) {
        // get the body
        $.each(faqs, function (fIndex, faq) {
          console.log('#' + faq.id);
          $('.inner .accordion').append('<button class="accordion-btn h4">' + faq.question + '</button>\n              <div class="accordion-panel">\n                <div class="inner">\n                ' + faq.answer + '\n                </div>\n              </div>\n            ');
        });

        // show content
        $('.faq-answers-product').show();
      },
      error: function error(xhr, status, _error2) {
        console.log('error: ', _error2);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', function (evt) {
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
    });
  }
}

exports.LoadFAQs = LoadFAQs;

},{}],18:[function(require,module,exports){
'use strict';

var _GoodbyeWorld = require('./components/GoodbyeWorld');

var _Screen = require('./components/Screen');

var _Accordion = require('./components/Accordion');

var _CountrySelector = require('./components/CountrySelector');

var _VehicleSelector = require('./components/VehicleSelector');

var _Navigation = require('./components/Navigation');

var _ScrollTo = require('./components/ScrollTo');

var _AutoComplete = require('./components/AutoComplete');

var _faqs = require('./components/faqs');

var _RevealDocs = require('./components/RevealDocs');

var _CoverOptions = require('./components/CoverOptions');

var _Utils = require('./components/Utils');

var _PolicySummary = require('./components/PolicySummary');

var _util = require('util');

console.log((0, _GoodbyeWorld.Goodbye)() + ' ' + _GoodbyeWorld.World + ' Index file');

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
  (0, _ScrollTo.ScrollTo)();

  //console.log(`countriesCovered: ${countriesCovered}`);
  //if (countriesCovered != null) {
  //  AutoComplete(document.getElementById('myInput'), countriesCovered);
  //}
  (0, _faqs.LoadFAQs)();
  // RevealDocs();
  (0, _CoverOptions.CoverOptions)();
  (0, _PolicySummary.PolicySummary)();
  (0, _Navigation.SelectTrip)();
  (0, _Navigation.RevealCurrency)();
}

(0, _Utils.Ready)(start);

},{"./components/Accordion":5,"./components/AutoComplete":6,"./components/CountrySelector":7,"./components/CoverOptions":8,"./components/GoodbyeWorld":9,"./components/Navigation":10,"./components/PolicySummary":11,"./components/RevealDocs":12,"./components/Screen":13,"./components/ScrollTo":14,"./components/Utils":15,"./components/VehicleSelector":16,"./components/faqs":17,"util":2}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Qb2xpY3lTdW1tYXJ5LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0ErQjdCOztBQUVKLE1BQUUsZ0NBQUYsRUFBb0MsUUFBcEMsQ0FDRSxnQkFERixFQUVFLE9BRkYsRUFHRSxVQUFTLEdBQVQsRUFBYztBQUNaOztBQUVBLFVBQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxRQUFuQzs7QUFFQTtBQUNBLFVBQUksUUFBUSxJQUFJLGFBQUosQ0FBa0Isa0JBQTlCO0FBQ0EsVUFBSSxNQUFNLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixjQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLElBQXhCO0FBQ0EsY0FBTSxLQUFOLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLGNBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxPQUpELE1BSU87QUFDTCxjQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE1BQU0sWUFBTixHQUFxQixJQUE3QztBQUNBLGNBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxjQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLE1BQTNCO0FBQ0Q7QUFDRixLQW5CSDtBQXFCRDtBQUNGOztRQUVRLFEsR0FBQSxROzs7OztBQ2hJVDs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFPQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxRQUFRLEdBQVIsQ0FBZSw0QkFBZixTQUE0QixtQkFBNUI7O0FBRUEsSUFBSSxtQkFBbUIsSUFBdkI7O0FBRUEsU0FBUyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsa0JBQU0sS0FBTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyBtb2R1bGUgXCJBY2NvcmRpb24uanNcIlxuXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBsZXQgaTtcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgICB9XG4gIH1cbn1cbmV4cG9ydCB7IEFjY29yZGlvbiB9O1xuIiwiLy8gbW9kdWxlIFwiQXV0b0NvbXBsZXRlLmpzXCJcblxuLyoqXG4gKiBbQXV0b0NvbXBsZXRlIGRlc2NyaXB0aW9uXVxuICpcbiAqIEBwYXJhbSAgIHtzdHJpbmd9ICB1c2VySW5wdXQgIHVzZXIgaW5wdXRcbiAqIEBwYXJhbSAgIHthcnJheX0gIHNlYXJjaExpc3QgIHNlYXJjaCBsaXN0XG4gKlxuICogQHJldHVybiAge1t0eXBlXX0gICAgICAgW3JldHVybiBkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gQXV0b0NvbXBsZXRlKGlucCwgYXJyKSB7XG4gIHZhciBjdXJyZW50Rm9jdXM7XG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSB3cml0ZXMgaW4gdGhlIHRleHQgZmllbGQ6Ki9cbiAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZSkge1xuICAgIHZhciBhLFxuICAgICAgYixcbiAgICAgIGksXG4gICAgICB2YWwgPSB0aGlzLnZhbHVlO1xuICAgIC8qY2xvc2UgYW55IGFscmVhZHkgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyovXG4gICAgY2xvc2VBbGxMaXN0cygpO1xuICAgIGlmICghdmFsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGN1cnJlbnRGb2N1cyA9IC0xO1xuICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGl0ZW1zICh2YWx1ZXMpOiovXG4gICAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGEuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQgKyAnYXV0b2NvbXBsZXRlLWxpc3QnKTtcbiAgICBhLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgLyphcHBlbmQgdGhlIERJViBlbGVtZW50IGFzIGEgY2hpbGQgb2YgdGhlIGF1dG9jb21wbGV0ZSBjb250YWluZXI6Ki9cbiAgICB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoYSk7XG4gICAgLypmb3IgZWFjaCBpdGVtIGluIHRoZSBhcnJheS4uLiovXG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgLypjaGVjayBpZiB0aGUgaXRlbSBzdGFydHMgd2l0aCB0aGUgc2FtZSBsZXR0ZXJzIGFzIHRoZSB0ZXh0IGZpZWxkIHZhbHVlOiovXG4gICAgICBpZiAoYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgZm9yIGVhY2ggbWF0Y2hpbmcgZWxlbWVudDoqL1xuICAgICAgICBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgICAgIC8qbWFrZSB0aGUgbWF0Y2hpbmcgbGV0dGVycyBib2xkOiovXG4gICAgICAgIGIuaW5uZXJIVE1MID0gJzxzdHJvbmc+JyArIGFycltpXS5zdWJzdHIoMCwgdmFsLmxlbmd0aCkgKyAnPC9zdHJvbmc+JztcbiAgICAgICAgYi5pbm5lckhUTUwgKz0gYXJyW2ldLnN1YnN0cih2YWwubGVuZ3RoKTtcbiAgICAgICAgLyppbnNlcnQgYSBpbnB1dCBmaWVsZCB0aGF0IHdpbGwgaG9sZCB0aGUgY3VycmVudCBhcnJheSBpdGVtJ3MgdmFsdWU6Ki9cbiAgICAgICAgYi5pbm5lckhUTUwgKz0gXCI8aW5wdXQgdHlwZT0naGlkZGVuJyB2YWx1ZT0nXCIgKyBhcnJbaV0gKyBcIic+XCI7XG4gICAgICAgIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSBjbGlja3Mgb24gdGhlIGl0ZW0gdmFsdWUgKERJViBlbGVtZW50KToqL1xuICAgICAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8qaW5zZXJ0IHRoZSB2YWx1ZSBmb3IgdGhlIGF1dG9jb21wbGV0ZSB0ZXh0IGZpZWxkOiovXG4gICAgICAgICAgaW5wLnZhbHVlID0gdGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKVswXS52YWx1ZTtcbiAgICAgICAgICAvKmNsb3NlIHRoZSBsaXN0IG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzLFxuICAgICAgICAgICAgKG9yIGFueSBvdGhlciBvcGVuIGxpc3RzIG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzOiovXG4gICAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYS5hcHBlbmRDaGlsZChiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiBwcmVzc2VzIGEga2V5IG9uIHRoZSBrZXlib2FyZDoqL1xuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQgKyAnYXV0b2NvbXBsZXRlLWxpc3QnKTtcbiAgICBpZiAoeCkgeCA9IHguZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xuICAgIGlmIChlLmtleUNvZGUgPT0gNDApIHtcbiAgICAgIC8qSWYgdGhlIGFycm93IERPV04ga2V5IGlzIHByZXNzZWQsXG4gICAgICBpbmNyZWFzZSB0aGUgY3VycmVudEZvY3VzIHZhcmlhYmxlOiovXG4gICAgICBjdXJyZW50Rm9jdXMrKztcbiAgICAgIC8qYW5kIGFuZCBtYWtlIHRoZSBjdXJyZW50IGl0ZW0gbW9yZSB2aXNpYmxlOiovXG4gICAgICBhZGRBY3RpdmUoeCk7XG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzgpIHtcbiAgICAgIC8vdXBcbiAgICAgIC8qSWYgdGhlIGFycm93IFVQIGtleSBpcyBwcmVzc2VkLFxuICAgICAgZGVjcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xuICAgICAgY3VycmVudEZvY3VzLS07XG4gICAgICAvKmFuZCBhbmQgbWFrZSB0aGUgY3VycmVudCBpdGVtIG1vcmUgdmlzaWJsZToqL1xuICAgICAgYWRkQWN0aXZlKHgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAvKklmIHRoZSBFTlRFUiBrZXkgaXMgcHJlc3NlZCwgcHJldmVudCB0aGUgZm9ybSBmcm9tIGJlaW5nIHN1Ym1pdHRlZCwqL1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGN1cnJlbnRGb2N1cyA+IC0xKSB7XG4gICAgICAgIC8qYW5kIHNpbXVsYXRlIGEgY2xpY2sgb24gdGhlIFwiYWN0aXZlXCIgaXRlbToqL1xuICAgICAgICBpZiAoeCkgeFtjdXJyZW50Rm9jdXNdLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gYWRkQWN0aXZlKHgpIHtcbiAgICAvKmEgZnVuY3Rpb24gdG8gY2xhc3NpZnkgYW4gaXRlbSBhcyBcImFjdGl2ZVwiOiovXG4gICAgaWYgKCF4KSByZXR1cm4gZmFsc2U7XG4gICAgLypzdGFydCBieSByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyBvbiBhbGwgaXRlbXM6Ki9cbiAgICByZW1vdmVBY3RpdmUoeCk7XG4gICAgaWYgKGN1cnJlbnRGb2N1cyA+PSB4Lmxlbmd0aCkgY3VycmVudEZvY3VzID0gMDtcbiAgICBpZiAoY3VycmVudEZvY3VzIDwgMCkgY3VycmVudEZvY3VzID0geC5sZW5ndGggLSAxO1xuICAgIC8qYWRkIGNsYXNzIFwiYXV0b2NvbXBsZXRlLWFjdGl2ZVwiOiovXG4gICAgeFtjdXJyZW50Rm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVBY3RpdmUoeCkge1xuICAgIC8qYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIFwiYWN0aXZlXCIgY2xhc3MgZnJvbSBhbGwgYXV0b2NvbXBsZXRlIGl0ZW1zOiovXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB4W2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBbGxMaXN0cyhlbG1udCkge1xuICAgIC8qY2xvc2UgYWxsIGF1dG9jb21wbGV0ZSBsaXN0cyBpbiB0aGUgZG9jdW1lbnQsXG4gIGV4Y2VwdCB0aGUgb25lIHBhc3NlZCBhcyBhbiBhcmd1bWVudDoqL1xuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZWxtbnQgIT0geFtpXSAmJiBlbG1udCAhPSBpbnApIHtcbiAgICAgICAgeFtpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHhbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIGluIHRoZSBkb2N1bWVudDoqL1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBjbG9zZUFsbExpc3RzKGUudGFyZ2V0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEF1dG9Db21wbGV0ZSB9O1xuIiwiZnVuY3Rpb24gQ291bnRyeVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX3VwJyk7XG4gIGxldCBkb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2Rvd24nKTtcbiAgbGV0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2l0ZW1zJyk7XG4gIGxldCBpdGVtSGVpZ2h0ID1cbiAgICBpdGVtcyAhPSBudWxsID8gaXRlbXMuZmlyc3RDaGlsZC5uZXh0U2libGluZy5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmICh1cCAhPSBudWxsKSB7XG4gICAgdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxVcCk7XG4gICAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbERvd24pO1xuXG4gICAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgICBmdW5jdGlvbiBzY3JvbGxVcCgpIHtcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCB1cCBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wICs9IGl0ZW1IZWlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2Nyb2xsRG93bigpIHtcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCBkb3duIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XG4gICAgICBpdGVtcy5zY3JvbGxUb3AgLT0gaXRlbUhlaWdodDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgQ291bnRyeVNlbGVjdG9yIH07XG4iLCIvLyBtb2R1bGUgQ292ZXJPcHRpb25zLmpzXG5cbmZ1bmN0aW9uIENvdmVyT3B0aW9ucygpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGNvbnN0IHdhcm5pbmdUZXh0ID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC53YXJuaW5nLXRleHQnKTtcbiAgY29uc3QgY292ZXJPcHRpb25QcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuY2FyZC1wcmljZScpO1xuICAvLyBHZXQgc2luZ2xlIHRyaXAgcHJpY2VcbiAgY29uc3QgaW5pdGlhbENvdmVyUHJpY2UgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLmFtb3VudCcpO1xuICBjb25zdCBkX2luaXRpYWxDb3ZlclByaWNlID0gcGFyc2VGbG9hdChcbiAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxuICApLnRvRml4ZWQoMik7XG5cbiAgY29uc3QgaW5pdGlhbFNpbmdsZVRyaXBQcmljZSA9ICQoJy5pbml0aWFsLXNpbmdsZS10cmlwLXByaWNlJyk7XG4gIGNvbnN0IGRfaW5pdGlhbFNpbmdsZVRyaXBQcmljZSA9IHBhcnNlRmxvYXQoXG4gICAgaW5pdGlhbFNpbmdsZVRyaXBQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxuICApLnRvRml4ZWQoMik7XG5cbiAgY29uc3QgY3VycmVuY3lTeW1ib2wgPSBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkuc3Vic3RyaW5nKDAsIDEpO1xuICBsZXQgaW5wdXRWYWx1ZSA9ICcnO1xuICBsZXQgcHJpY2VMaW1pdDtcbiAgbGV0IHRvdGFsSW5pdGlhbFByaWNlID0gMDtcbiAgbGV0IHRvdGFsU2luZ2xlUHJpY2UgPSAwO1xuICBsZXQgZmluYWxQcmljZSA9IDA7XG5cbiAgaWYgKGN1cnJlbmN5U3ltYm9sID09ICdcXHUwMEEzJykge1xuICAgIHByaWNlTGltaXQgPSAxMTk7XG4gIH0gZWxzZSB7XG4gICAgcHJpY2VMaW1pdCA9IDE0MjtcbiAgfVxuXG4gIC8vY29uc29sZS5jbGVhcigpO1xuICAvL2NvbnNvbGUubG9nKGBjb3ZlciBwcmljZTogJHtkX2luaXRpYWxDb3ZlclByaWNlfWApO1xuICAvL2NvbnNvbGUubG9nKGBTaW5nbGUgVHJpcCBwcmljZTogJHtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2V9YCk7XG4gIC8vY29uc29sZS5sb2coYGN1cnJlbmN5U3ltYm9sOiAke2N1cnJlbmN5U3ltYm9sfWApO1xuXG4gICQoJy5wcm9kdWN0LW9wdGlvbnMtZGF5cy1jb3ZlcicpLmNoYW5nZShmdW5jdGlvbihldnQpIHtcbiAgICAvLyBnZXQgdmFsdWVcbiAgICBpbnB1dFZhbHVlID0gcGFyc2VJbnQoZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuXG4gICAgaWYgKGlucHV0VmFsdWUgPiAwKSB7XG4gICAgICAvLyBjYWxjdWxhdGUgd2l0aCBpbnRpdGFsIGNvdmVyIHByaWNlXG4gICAgICBpZiAoaW5wdXRWYWx1ZSA+IDAgJiYgaW5wdXRWYWx1ZSA8PSAzKSB7XG4gICAgICAgIHRvdGFsSW5pdGlhbFByaWNlID0gaW5wdXRWYWx1ZSAqIGRfaW5pdGlhbENvdmVyUHJpY2U7XG4gICAgICAgIHRvdGFsU2luZ2xlUHJpY2UgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIChpbnB1dFZhbHVlID4gMyAmJiBmaW5hbFByaWNlIDwgcHJpY2VMaW1pdCkgfHxcbiAgICAgICAgcHJpY2VMaW1pdCA8IGZpbmFsUHJpY2VcbiAgICAgICkge1xuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gKGlucHV0VmFsdWUgLSAzKSAqIGRfaW5pdGlhbFNpbmdsZVRyaXBQcmljZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmluYWxQcmljZSA9IHBhcnNlRmxvYXQodG90YWxJbml0aWFsUHJpY2UgKyB0b3RhbFNpbmdsZVByaWNlKS50b0ZpeGVkKDIpO1xuXG4gICAgaWYgKGZpbmFsUHJpY2UgPiBwcmljZUxpbWl0KSB7XG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KFxuICAgICAgICBjdXJyZW5jeVN5bWJvbCArIHBhcnNlRmxvYXQocHJpY2VMaW1pdCkudG9GaXhlZCgyKVxuICAgICAgKTtcbiAgICAgIC8vIGNoYW5nZSBjb2xvciBvZiBwcmljZVxuICAgICAgY292ZXJPcHRpb25QcmljZS5hZGRDbGFzcygnd2FybmluZycpO1xuICAgICAgLy8gc2hvdyB3YXJuaW5nIHRleHRcbiAgICAgIHdhcm5pbmdUZXh0LnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChjdXJyZW5jeVN5bWJvbCArIGZpbmFsUHJpY2UpO1xuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xuICAgICAgY292ZXJPcHRpb25QcmljZS5yZW1vdmVDbGFzcygnd2FybmluZycpO1xuICAgIH1cblxuICAgIC8vY29uc29sZS5sb2coYCR7aW5wdXRWYWx1ZX0gPSAke2ZpbmFsUHJpY2V9YCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBDb3Zlck9wdGlvbnMgfTtcbiIsIi8vIG1vZHVsZSBcIkdvb2RieWVXb3JsZC5qc1wiXG5cbmZ1bmN0aW9uIEdvb2RieWUoKSB7XG4gIHJldHVybiAnR29vZGJ5ZSc7XG59XG5cbmNvbnN0IFdvcmxkID0gJ1dvcmxkICEhJztcblxuZXhwb3J0IHsgR29vZGJ5ZSwgV29ybGQgfTtcbiIsImZ1bmN0aW9uIFRvZ2dsZU5hdmlnYXRpb24oKSB7XG4gIC8vIGNhY2hlIERPTVxuICBjb25zdCBjdXJyZW5jeSA9ICQoJy5jdXJyZW5jeScpO1xuICBjb25zdCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcbiAgY29uc3QgbmF2QmFyVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcbiAgY29uc3QgY3VycmVuY3lOYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtY3VycmVuY3ktdG9nZ2xlJyk7XG4gIGNvbnN0IGN1cnJlbmN5TWVudVRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XG5cbiAgLy8gYmluZCBldmVudHNcbiAgbmF2QmFyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XG4gIGN1cnJlbmN5TWVudVRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUN1cnJlbmN5TWVudSk7XG5cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgICBtYWluTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQ3VycmVuY3lNZW51KCkge1xuICAgIGN1cnJlbmN5TmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICB9XG5cbiAgaWYgKCQod2luZG93KS53aWR0aCgpID4gJzExOTknKSB7XG4gICAgY3VycmVuY3kuc2hvdygpO1xuICB9IGVsc2Uge1xuICAgIGN1cnJlbmN5LmhpZGUoKTtcbiAgfVxuXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gJzExOTknKSB7XG4gICAgICBjdXJyZW5jeS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbmN5LmhpZGUoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBEcm9wZG93bk1lbnUoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgY2FyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1jYXInKTtcbiAgbGV0IGRyb3BEb3duTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi0tY2FyIC5kcm9wZG93bi1tZW51Jyk7XG5cbiAgaWYgKGNhckJ0biAhPSBudWxsICYmIGRyb3BEb3duTWVudSAhPSBudWxsKSB7XG4gICAgbGV0IGRyb3BEb3duID0gY2FyQnRuLnBhcmVudEVsZW1lbnQ7XG4gICAgLy8gQmluZCBldmVudHNcbiAgICBjYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJCdG5IYW5kbGVyKTtcblxuICAgIC8vIEV2ZW50IGhhbmRsZXJzXG4gICAgZnVuY3Rpb24gY2FyQnRuSGFuZGxlcihldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAvLyB0b2dnbGUgZGlzcGxheVxuICAgICAgaWYgKFxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnIHx8XG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnJ1xuICAgICAgKSB7XG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID1cbiAgICAgICAgICBkcm9wRG93bi5vZmZzZXRIZWlnaHQgKyBkcm9wRG93bk1lbnUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIEZpeGVkTmF2aWdhdGlvbigpIHtcbiAgLy8gbWFrZSBuYXZiYXIgc3RpY2t5XG4gIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXG4gIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIG15RnVuY3Rpb24oKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGhlYWRlclxuICBsZXQgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhcicpO1xuXG4gIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcbiAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XG5cbiAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXG4gIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XG4gICAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XG4gICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IHN0aWNreSkge1xuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5hZGQoJ25hdmJhci1maXhlZC10b3AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5yZW1vdmUoJ25hdmJhci1maXhlZC10b3AnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gU2VsZWN0VHJpcCgpIHtcbiAgLy8gc2VsZWN0IHZlaGljbGVcbiAgJCgnLnRhYi1jYXIgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgJCgnLnRhYi1jYXIgLmljb24tcmFkaW8gaW5wdXRbdHlwZT1cInJhZGlvXCJdJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tY3RhLS1kaXNhYmxlZCcpO1xuICAgICQoJy50YWItY2FyIC5idG4nKS5hZGRDbGFzcygnYnRuLWN0YScpO1xuICAgICQoJy50YWItY2FyIC5idG4nKS51bmJpbmQoKTtcbiAgfSk7XG59XG5cbi8vIHNob3cgbW9iaWxlIGN1cnJlbmN5XG5mdW5jdGlvbiBSZXZlYWxDdXJyZW5jeSgpIHtcbiAgJCgnLmN1cnJlbmN5LW1vYmlsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdDdXJyZW5jeScpO1xuXG4gICAgJCgnLmN1cnJlbmN5Jykuc2xpZGVUb2dnbGUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIFRvZ2dsZU5hdmlnYXRpb24sXG4gIERyb3Bkb3duTWVudSxcbiAgRml4ZWROYXZpZ2F0aW9uLFxuICBTZWxlY3RUcmlwLFxuICBSZXZlYWxDdXJyZW5jeVxufTtcbiIsImZ1bmN0aW9uIFBvbGljeVN1bW1hcnkoKSB7XG4gIC8vIHBvbGljeSBzdW1tYXJ5XG4gICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICB9KTtcblxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5jbGljayhmdW5jdGlvbihldnQpIHtcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICAgIC8vIHNob3cgcG9saWN5IHN1bW1hcnlcbiAgICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH0pO1xuICAgIGxldCBwb2xpY3lTdW1tYXJ5ID0gJCh0aGlzKS5kYXRhKCdwb2xpY3knKTtcbiAgICAkKCcuJyArIHBvbGljeVN1bW1hcnkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgUG9saWN5U3VtbWFyeSB9O1xuIiwiLy8gbW9kdWxlIFJldmVhbERvY3MuanNcblxuZnVuY3Rpb24gUmV2ZWFsRG9jcygpIHtcbiAgLy9Eb2NzXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgb24gPSAkKCcuZG9jcycpLmlzKCc6dmlzaWJsZScpO1xuICAgICQodGhpcykuaHRtbChcbiAgICAgIG9uID8gJ1ZpZXcgcG9saWN5IGRvY3VtZW50YXRpb24nIDogJ0hpZGUgcG9saWN5IGRvY3VtZW50YXRpb24nXG4gICAgKTtcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBSZXZlYWxEb2NzIH07XG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3Aoc2Nyb2xsRHVyYXRpb24pIHtcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSAhPSAwKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9LCAxNSk7XG59XG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoc2Nyb2xsRHVyYXRpb24pIHtcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxuICAgIG9sZFRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XG4gICAgc2Nyb2xsQ291bnQgKz0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKTtcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xuICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgIDAsXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcbiAgICApO1xuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICB9XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cbi8qXG4gIEV4cGxhbmF0aW9uczpcbiAgLSBwaSBpcyB0aGUgbGVuZ3RoL2VuZCBwb2ludCBvZiB0aGUgY29zaW51cyBpbnRlcnZhbGwgKHNlZSBhYm92ZSlcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gIC0gbmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wIGVxdWFscyB0aGUgZHVyYXRpb25cblxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXG4gID0gYSAqIGNvcyAoYngpICsgZCAgICAgICAgICAgICAgICAgICAgICAgICAgfCBkIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHkgYXhpcyA9IDEgLT4gb25seSBwb3NpdGl2ZSB5IHZhbHVlc1xuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3Mgc2Nyb2xsQ291bnQgKiB4KVxuKi9cblxuZnVuY3Rpb24gU2Nyb2xsVG9Ub3AoKSB7XG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcbiAgICBiYWNrVG9Ub3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiYWNrVG9Ub3BCdG5IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XG5cbiAgICAvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAzMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xuICBjb25zb2xlLmxvZygnV2luZG93V2lkdGgnKTtcblxuICAvLyBjYWNoZSBET01cbiAgY29uc3QgYWNjb3JkaW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xuICApO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdyA9XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgIGlmICh3ID4gMTIwMCkge1xuICAgICAgbGV0IGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodyA8PSAxMjAwKSB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9O1xuIiwiLy8gbW9kdWxlIFwiU2Nyb2xsVG8uanNcIlxuXG5mdW5jdGlvbiBTY3JvbGxUbygpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIC8vIFNlbGVjdCBhbGwgbGlua3Mgd2l0aCBoYXNoZXNcbiAgLy8gUmVtb3ZlIGxpbmtzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgbGluayB0byBhbnl0aGluZ1xuICBsZXQgYW5jaG9ycyA9ICQoJ2FbaHJlZio9XCIjXCJdJylcbiAgICAubm90KCdbaHJlZj1cIiNcIl0nKVxuICAgIC5ub3QoJ1tocmVmPVwiIzBcIl0nKTtcblxuICBsZXQgaGVpZ2h0Q29tcGVuc2F0aW9uID0gNjA7XG4gIC8vIEJpbmQgRXZlbnRzXG4gIGFuY2hvcnMuY2xpY2soYW5jaG9yc0hhbmRsZXIpO1xuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGFuY2hvcnNIYW5kbGVyKGV2ZW50KSB7XG4gICAgLy8gT24tcGFnZSBsaW5rc1xuICAgIGlmIChcbiAgICAgIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgPT1cbiAgICAgICAgdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpICYmXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lXG4gICAgKSB7XG4gICAgICAvLyBGaWd1cmUgb3V0IGVsZW1lbnQgdG8gc2Nyb2xsIHRvXG4gICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xuICAgICAgLy8gRG9lcyBhIHNjcm9sbCB0YXJnZXQgZXhpc3Q/XG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICAvLyBPbmx5IHByZXZlbnQgZGVmYXVsdCBpZiBhbmltYXRpb24gaXMgYWN0dWFsbHkgZ29ubmEgaGFwcGVuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIGhlaWdodENvbXBlbnNhdGlvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgMTAwMCxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gTXVzdCBjaGFuZ2UgZm9jdXMhXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQodGFyZ2V0KTtcbiAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCc6Zm9jdXMnKSkge1xuICAgICAgICAgICAgICAvLyBDaGVja2luZyBpZiB0aGUgdGFyZ2V0IHdhcyBmb2N1c2VkXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICR0YXJnZXQuYXR0cigndGFiaW5kZXgnLCAnLTEnKTsgLy8gQWRkaW5nIHRhYmluZGV4IGZvciBlbGVtZW50cyBub3QgZm9jdXNhYmxlXG4gICAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTsgLy8gU2V0IGZvY3VzIGFnYWluXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBvbiBzY3JvbGxcbmlmICgkKCcuYXJ0aWNsZS1tYWluJykubGVuZ3RoID4gMCkge1xuICBsZXQgdGFyZ2V0ID0gJCgnLmFydGljbGUtbWFpbicpLm9mZnNldCgpLnRvcCAtIDE4MDtcbiAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgU2Nyb2xsVG8gfTtcbiIsImZ1bmN0aW9uIFJlYWR5KGZuKSB7XG4gIGlmIChcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXG4gICAgICA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJ1xuICApIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxuZXhwb3J0IHsgUmVhZHkgfTtcbiIsImZ1bmN0aW9uIFZlaGljbGVTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBjYXJUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX2NhcicpO1xuICBsZXQgdmFuVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX192YW4nKTtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAoY2FyVGFiICE9IG51bGwgJiYgdmFuVGFiICE9IG51bGwpIHtcbiAgICBjYXJUYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gICAgdmFuVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xuICB9XG5cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gb3BlblZlaGljbGUoZXZ0KSB7XG4gICAgdmFyIGksIHgsIHRhYkJ1dHRvbnM7XG5cbiAgICBjb25zb2xlLmxvZyhldnQpO1xuXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXG4gICAgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItY29udGFpbmVyIC50YWInKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXG4gICAgdGFiQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtdGFicyAubmF2LWxpbmsnKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xuICAgIH1cblxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxuICAgIC8vIHNob3cgdGhlIHNlbGVjdGVkIHRhYiBjb250ZW50XG4gICAgbGV0IHZlaGljbGUgPSBldnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmVoaWNsZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItJyArIHZlaGljbGUpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZSArPSAnIGFjdGl2ZSc7XG4gIH1cbn1cblxuZXhwb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH07XG4iLCIvLyBtb2R1bGUgXCJMb2FkRkFRcy5qc1wiXG5cbmZ1bmN0aW9uIExvYWRGQVFzKCkge1xuICAvLyBsb2FkIGZhcXNcbiAgJCgnI2ZhcVRhYnMgYScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCh0aGlzKS50YWIoJ3Nob3cnKTtcbiAgfSk7XG5cbiAgLy8gbG9hZCBmYXFzXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBmYXFzIHBhZ2VcbiAgaWYgKCQoJyNmYXFzJykubGVuZ3RoID4gMCkge1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnR0VUJyxcbiAgICAgIHVybDogJy9hcGkvZmFxcy5qc29uJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSBoZWFkc1xuICAgICAgICAkLmVhY2goZmFxcywgZnVuY3Rpb24oaW5kZXgsIGZhcSkge1xuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgZGVza3RvcFxuICAgICAgICAgICQoYGFbaHJlZj0nIyR7ZmFxLmlkfSddYClcbiAgICAgICAgICAgIC5maW5kKCdzcGFuJylcbiAgICAgICAgICAgIC50ZXh0KGZhcS50aXRsZSk7XG5cbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIG1vYmlsZVxuICAgICAgICAgICQoYCMke2ZhcS5pZH1gKVxuICAgICAgICAgICAgLmZpbmQoJ2gzJylcbiAgICAgICAgICAgIC50ZXh0KGZhcS5zaG9ydFRpdGxlKTtcblxuICAgICAgICAgIC8vIGdldCB0aGUgYm9keVxuICAgICAgICAgICQuZWFjaChmYXEucWFzLCBmdW5jdGlvbihmSW5kZXgsIHFhKSB7XG4gICAgICAgICAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicsIGAjJHtmYXEuaWR9YCkuYXBwZW5kKFxuICAgICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke3FhLnF1ZXN0aW9ufTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgJHtxYS5hbnN3ZXJ9XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7IC8vICRhamF4XG5cbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXG4gICAgICAnY2xpY2snLFxuICAgICAgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG4gICAgICAgICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICAgICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgLy8gb25seSBsb2FkIGlmIG9uIHByb2R1Y3QgZmFxcyBwYWdlXG4gIGlmICgkKCcucHJvZHVjdC1mYXFzJykubGVuZ3RoID4gMCkge1xuICAgIGxldCBmaWxlID0gJCgnLnByb2R1Y3QtZmFxcycpXG4gICAgICAuZGF0YSgnZmFxcycpXG4gICAgICAucmVwbGFjZSgnJi0nLCAnJyk7XG5cbiAgICBjb25zb2xlLmxvZyhgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgdXJsOiBgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmAsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihmYXFzKSB7XG4gICAgICAgIC8vIGdldCB0aGUgYm9keVxuICAgICAgICAkLmVhY2goZmFxcywgZnVuY3Rpb24oZkluZGV4LCBmYXEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgIyR7ZmFxLmlkfWApO1xuICAgICAgICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJykuYXBwZW5kKFxuICAgICAgICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtmYXEucXVlc3Rpb259PC9idXR0b24+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAke2ZhcS5hbnN3ZXJ9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNob3cgY29udGVudFxuICAgICAgICAkKCcuZmFxLWFuc3dlcnMtcHJvZHVjdCcpLnNob3coKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0pOyAvLyAkYWpheFxuXG4gICAgJCgnLmZhcS1hbnN3ZXJzIC5pbm5lciAuYWNjb3JkaW9uJykuZGVsZWdhdGUoXG4gICAgICAnLmFjY29yZGlvbi1idG4nLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgICAgICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXG4gICAgICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgeyBMb2FkRkFRcyB9O1xuIiwiaW1wb3J0IHsgR29vZGJ5ZSwgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkJztcbmltcG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xuaW1wb3J0IHsgQWNjb3JkaW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbic7XG5pbXBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yJztcbmltcG9ydCB7IFZlaGljbGVTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9WZWhpY2xlU2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgVG9nZ2xlTmF2aWdhdGlvbixcbiAgRHJvcGRvd25NZW51LFxuICBGaXhlZE5hdmlnYXRpb24sXG4gIFNlbGVjdFRyaXAsXG4gIFJldmVhbEN1cnJlbmN5XG59IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcbmltcG9ydCB7IFNjcm9sbFRvIH0gZnJvbSAnLi9jb21wb25lbnRzL1Njcm9sbFRvJztcbmltcG9ydCB7IEF1dG9Db21wbGV0ZSB9IGZyb20gJy4vY29tcG9uZW50cy9BdXRvQ29tcGxldGUnO1xuaW1wb3J0IHsgTG9hZEZBUXMgfSBmcm9tICcuL2NvbXBvbmVudHMvZmFxcyc7XG5pbXBvcnQgeyBSZXZlYWxEb2NzIH0gZnJvbSAnLi9jb21wb25lbnRzL1JldmVhbERvY3MnO1xuaW1wb3J0IHsgQ292ZXJPcHRpb25zIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdmVyT3B0aW9ucyc7XG5pbXBvcnQgeyBSZWFkeSB9IGZyb20gJy4vY29tcG9uZW50cy9VdGlscyc7XG5pbXBvcnQgeyBQb2xpY3lTdW1tYXJ5IH0gZnJvbSAnLi9jb21wb25lbnRzL1BvbGljeVN1bW1hcnknO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAndXRpbCc7XG5cbmNvbnNvbGUubG9nKGAke0dvb2RieWUoKX0gJHtXb3JsZH0gSW5kZXggZmlsZWApO1xuXG5sZXQgY291bnRyaWVzQ292ZXJlZCA9IG51bGw7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICAvLyBDb3VudHJ5U2VsZWN0b3IoKTtcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XG4gIFRvZ2dsZU5hdmlnYXRpb24oKTtcbiAgRHJvcGRvd25NZW51KCk7XG4gIFNjcm9sbFRvVG9wKCk7XG4gIEZpeGVkTmF2aWdhdGlvbigpO1xuICBBY2NvcmRpb24oKTtcbiAgV2luZG93V2lkdGgoKTtcbiAgU2Nyb2xsVG8oKTtcblxuICAvL2NvbnNvbGUubG9nKGBjb3VudHJpZXNDb3ZlcmVkOiAke2NvdW50cmllc0NvdmVyZWR9YCk7XG4gIC8vaWYgKGNvdW50cmllc0NvdmVyZWQgIT0gbnVsbCkge1xuICAvLyAgQXV0b0NvbXBsZXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteUlucHV0JyksIGNvdW50cmllc0NvdmVyZWQpO1xuICAvL31cbiAgTG9hZEZBUXMoKTtcbiAgLy8gUmV2ZWFsRG9jcygpO1xuICBDb3Zlck9wdGlvbnMoKTtcbiAgUG9saWN5U3VtbWFyeSgpO1xuICBTZWxlY3RUcmlwKCk7XG4gIFJldmVhbEN1cnJlbmN5KCk7XG59XG5cblJlYWR5KHN0YXJ0KTtcbiJdfQ==
