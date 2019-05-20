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

},{"util":2}],18:[function(require,module,exports){
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
  (0, _RevealDocs.RevealDocs)();
  (0, _CoverOptions.CoverOptions)();
  (0, _PolicySummary.PolicySummary)();
  (0, _Navigation.SelectTrip)();
  (0, _Navigation.RevealCurrency)();
}

(0, _Utils.Ready)(start);

},{"./components/Accordion":5,"./components/AutoComplete":6,"./components/CountrySelector":7,"./components/CoverOptions":8,"./components/GoodbyeWorld":9,"./components/Navigation":10,"./components/PolicySummary":11,"./components/RevealDocs":12,"./components/Screen":13,"./components/ScrollTo":14,"./components/Utils":15,"./components/VehicleSelector":16,"./components/faqs":17,"util":2}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Qb2xpY3lTdW1tYXJ5LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QU4sQ0FBWSxTQUFaLEdBQXdCLEdBQXhCO0FBQ0EsVUFBTSxLQUFOLENBQVksWUFBWixHQUEyQixHQUEzQjtBQUNELEdBSkQsTUFJTztBQUNMLFVBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsTUFBTSxZQUFOLEdBQXFCLElBQTdDO0FBQ0EsVUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixPQUF4QjtBQUNBLFVBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsTUFBM0I7QUFDRDtBQUNGO1FBQ1EsUSxHQUFBLFE7Ozs7O0FDeElUOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQU9BOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBLFFBQVEsR0FBUixDQUFlLDRCQUFmLFNBQTRCLG1CQUE1Qjs7QUFFQSxJQUFJLG1CQUFtQixJQUF2Qjs7QUFFQSxTQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxrQkFBTSxLQUFOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vIG1vZHVsZSBcIkFjY29yZGlvbi5qc1wiXHJcblxyXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYnRuJyk7XHJcblxyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgbGV0IGk7XHJcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xyXG4gICAgYWNjW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjb3JkaW9uSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGFjY29yZGlvbkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxyXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG5cclxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXHJcbiAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5leHBvcnQgeyBBY2NvcmRpb24gfTtcclxuIiwiLy8gbW9kdWxlIFwiQXV0b0NvbXBsZXRlLmpzXCJcclxuXHJcbi8qKlxyXG4gKiBbQXV0b0NvbXBsZXRlIGRlc2NyaXB0aW9uXVxyXG4gKlxyXG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgdXNlcklucHV0ICB1c2VyIGlucHV0XHJcbiAqIEBwYXJhbSAgIHthcnJheX0gIHNlYXJjaExpc3QgIHNlYXJjaCBsaXN0XHJcbiAqXHJcbiAqIEByZXR1cm4gIHtbdHlwZV19ICAgICAgIFtyZXR1cm4gZGVzY3JpcHRpb25dXHJcbiAqL1xyXG5mdW5jdGlvbiBBdXRvQ29tcGxldGUoaW5wLCBhcnIpIHtcclxuICB2YXIgY3VycmVudEZvY3VzO1xyXG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSB3cml0ZXMgaW4gdGhlIHRleHQgZmllbGQ6Ki9cclxuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgYSxcclxuICAgICAgYixcclxuICAgICAgaSxcclxuICAgICAgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgIC8qY2xvc2UgYW55IGFscmVhZHkgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyovXHJcbiAgICBjbG9zZUFsbExpc3RzKCk7XHJcbiAgICBpZiAoIXZhbCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50Rm9jdXMgPSAtMTtcclxuICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGl0ZW1zICh2YWx1ZXMpOiovXHJcbiAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBhLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XHJcbiAgICBhLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XHJcbiAgICAvKmFwcGVuZCB0aGUgRElWIGVsZW1lbnQgYXMgYSBjaGlsZCBvZiB0aGUgYXV0b2NvbXBsZXRlIGNvbnRhaW5lcjoqL1xyXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgLypmb3IgZWFjaCBpdGVtIGluIHRoZSBhcnJheS4uLiovXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8qY2hlY2sgaWYgdGhlIGl0ZW0gc3RhcnRzIHdpdGggdGhlIHNhbWUgbGV0dGVycyBhcyB0aGUgdGV4dCBmaWVsZCB2YWx1ZToqL1xyXG4gICAgICBpZiAoYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgLypjcmVhdGUgYSBESVYgZWxlbWVudCBmb3IgZWFjaCBtYXRjaGluZyBlbGVtZW50OiovXHJcbiAgICAgICAgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgICAgIC8qbWFrZSB0aGUgbWF0Y2hpbmcgbGV0dGVycyBib2xkOiovXHJcbiAgICAgICAgYi5pbm5lckhUTUwgPSAnPHN0cm9uZz4nICsgYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKSArICc8L3N0cm9uZz4nO1xyXG4gICAgICAgIGIuaW5uZXJIVE1MICs9IGFycltpXS5zdWJzdHIodmFsLmxlbmd0aCk7XHJcbiAgICAgICAgLyppbnNlcnQgYSBpbnB1dCBmaWVsZCB0aGF0IHdpbGwgaG9sZCB0aGUgY3VycmVudCBhcnJheSBpdGVtJ3MgdmFsdWU6Ki9cclxuICAgICAgICBiLmlubmVySFRNTCArPSBcIjxpbnB1dCB0eXBlPSdoaWRkZW4nIHZhbHVlPSdcIiArIGFycltpXSArIFwiJz5cIjtcclxuICAgICAgICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIG9uIHRoZSBpdGVtIHZhbHVlIChESVYgZWxlbWVudCk6Ki9cclxuICAgICAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgLyppbnNlcnQgdGhlIHZhbHVlIGZvciB0aGUgYXV0b2NvbXBsZXRlIHRleHQgZmllbGQ6Ki9cclxuICAgICAgICAgIGlucC52YWx1ZSA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF0udmFsdWU7XHJcbiAgICAgICAgICAvKmNsb3NlIHRoZSBsaXN0IG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzLFxyXG4gICAgICAgICAgICAob3IgYW55IG90aGVyIG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXM6Ki9cclxuICAgICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhLmFwcGVuZENoaWxkKGIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gcHJlc3NlcyBhIGtleSBvbiB0aGUga2V5Ym9hcmQ6Ki9cclxuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCArICdhdXRvY29tcGxldGUtbGlzdCcpO1xyXG4gICAgaWYgKHgpIHggPSB4LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICAgIGlmIChlLmtleUNvZGUgPT0gNDApIHtcclxuICAgICAgLypJZiB0aGUgYXJyb3cgRE9XTiBrZXkgaXMgcHJlc3NlZCxcclxuICAgICAgaW5jcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xyXG4gICAgICBjdXJyZW50Rm9jdXMrKztcclxuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cclxuICAgICAgYWRkQWN0aXZlKHgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzgpIHtcclxuICAgICAgLy91cFxyXG4gICAgICAvKklmIHRoZSBhcnJvdyBVUCBrZXkgaXMgcHJlc3NlZCxcclxuICAgICAgZGVjcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xyXG4gICAgICBjdXJyZW50Rm9jdXMtLTtcclxuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cclxuICAgICAgYWRkQWN0aXZlKHgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgLypJZiB0aGUgRU5URVIga2V5IGlzIHByZXNzZWQsIHByZXZlbnQgdGhlIGZvcm0gZnJvbSBiZWluZyBzdWJtaXR0ZWQsKi9cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoY3VycmVudEZvY3VzID4gLTEpIHtcclxuICAgICAgICAvKmFuZCBzaW11bGF0ZSBhIGNsaWNrIG9uIHRoZSBcImFjdGl2ZVwiIGl0ZW06Ki9cclxuICAgICAgICBpZiAoeCkgeFtjdXJyZW50Rm9jdXNdLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBmdW5jdGlvbiBhZGRBY3RpdmUoeCkge1xyXG4gICAgLyphIGZ1bmN0aW9uIHRvIGNsYXNzaWZ5IGFuIGl0ZW0gYXMgXCJhY3RpdmVcIjoqL1xyXG4gICAgaWYgKCF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAvKnN0YXJ0IGJ5IHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzIG9uIGFsbCBpdGVtczoqL1xyXG4gICAgcmVtb3ZlQWN0aXZlKHgpO1xyXG4gICAgaWYgKGN1cnJlbnRGb2N1cyA+PSB4Lmxlbmd0aCkgY3VycmVudEZvY3VzID0gMDtcclxuICAgIGlmIChjdXJyZW50Rm9jdXMgPCAwKSBjdXJyZW50Rm9jdXMgPSB4Lmxlbmd0aCAtIDE7XHJcbiAgICAvKmFkZCBjbGFzcyBcImF1dG9jb21wbGV0ZS1hY3RpdmVcIjoqL1xyXG4gICAgeFtjdXJyZW50Rm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlKHgpIHtcclxuICAgIC8qYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIFwiYWN0aXZlXCIgY2xhc3MgZnJvbSBhbGwgYXV0b2NvbXBsZXRlIGl0ZW1zOiovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgeFtpXS5jbGFzc0xpc3QucmVtb3ZlKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoZWxtbnQpIHtcclxuICAgIC8qY2xvc2UgYWxsIGF1dG9jb21wbGV0ZSBsaXN0cyBpbiB0aGUgZG9jdW1lbnQsXHJcbiAgZXhjZXB0IHRoZSBvbmUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50OiovXHJcbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChlbG1udCAhPSB4W2ldICYmIGVsbW50ICE9IGlucCkge1xyXG4gICAgICAgIHhbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh4W2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIGluIHRoZSBkb2N1bWVudDoqL1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY2xvc2VBbGxMaXN0cyhlLnRhcmdldCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1dG9Db21wbGV0ZSB9O1xyXG4iLCJmdW5jdGlvbiBDb3VudHJ5U2VsZWN0b3IoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX3VwJyk7XHJcbiAgbGV0IGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9fZG93bicpO1xyXG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xyXG4gIGxldCBpdGVtSGVpZ2h0ID1cclxuICAgIGl0ZW1zICE9IG51bGwgPyBpdGVtcy5maXJzdENoaWxkLm5leHRTaWJsaW5nLm9mZnNldEhlaWdodCA6IDA7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgaWYgKHVwICE9IG51bGwpIHtcclxuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xyXG4gICAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbERvd24pO1xyXG5cclxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxVcCgpIHtcclxuICAgICAgLy8gbW92ZSBpdGVtcyBsaXN0IHVwIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XHJcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XHJcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCBkb3duIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XHJcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCAtPSBpdGVtSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgQ291bnRyeVNlbGVjdG9yIH07XHJcbiIsIi8vIG1vZHVsZSBDb3Zlck9wdGlvbnMuanNcclxuXHJcbmZ1bmN0aW9uIENvdmVyT3B0aW9ucygpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCB3YXJuaW5nVGV4dCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0Jyk7XHJcbiAgY29uc3QgY292ZXJPcHRpb25QcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuY2FyZC1wcmljZScpO1xyXG4gIC8vIEdldCBzaW5nbGUgdHJpcCBwcmljZVxyXG4gIGNvbnN0IGluaXRpYWxDb3ZlclByaWNlID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC5hbW91bnQnKTtcclxuICBjb25zdCBkX2luaXRpYWxDb3ZlclByaWNlID0gcGFyc2VGbG9hdChcclxuICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoKS5yZXBsYWNlKC9cXEQqLywgJycpXHJcbiAgKS50b0ZpeGVkKDIpO1xyXG5cclxuICBjb25zdCBpbml0aWFsU2luZ2xlVHJpcFByaWNlID0gJCgnLmluaXRpYWwtc2luZ2xlLXRyaXAtcHJpY2UnKTtcclxuICBjb25zdCBkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2UgPSBwYXJzZUZsb2F0KFxyXG4gICAgaW5pdGlhbFNpbmdsZVRyaXBQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxyXG4gICkudG9GaXhlZCgyKTtcclxuXHJcbiAgY29uc3QgY3VycmVuY3lTeW1ib2wgPSBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkuc3Vic3RyaW5nKDAsIDEpO1xyXG4gIGxldCBpbnB1dFZhbHVlID0gJyc7XHJcbiAgbGV0IHByaWNlTGltaXQ7XHJcbiAgbGV0IHRvdGFsSW5pdGlhbFByaWNlID0gMDtcclxuICBsZXQgdG90YWxTaW5nbGVQcmljZSA9IDA7XHJcbiAgbGV0IGZpbmFsUHJpY2UgPSAwO1xyXG5cclxuICBpZiAoY3VycmVuY3lTeW1ib2wgPT0gJ1xcdTAwQTMnKSB7XHJcbiAgICBwcmljZUxpbWl0ID0gMTE5O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwcmljZUxpbWl0ID0gMTQyO1xyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmNsZWFyKCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgY292ZXIgcHJpY2U6ICR7ZF9pbml0aWFsQ292ZXJQcmljZX1gKTtcclxuICAvL2NvbnNvbGUubG9nKGBTaW5nbGUgVHJpcCBwcmljZTogJHtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2V9YCk7XHJcbiAgLy9jb25zb2xlLmxvZyhgY3VycmVuY3lTeW1ib2w6ICR7Y3VycmVuY3lTeW1ib2x9YCk7XHJcblxyXG4gICQoJy5wcm9kdWN0LW9wdGlvbnMtZGF5cy1jb3ZlcicpLmNoYW5nZShmdW5jdGlvbihldnQpIHtcclxuICAgIC8vIGdldCB2YWx1ZVxyXG4gICAgaW5wdXRWYWx1ZSA9IHBhcnNlSW50KGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcclxuXHJcbiAgICBpZiAoaW5wdXRWYWx1ZSA+IDApIHtcclxuICAgICAgLy8gY2FsY3VsYXRlIHdpdGggaW50aXRhbCBjb3ZlciBwcmljZVxyXG4gICAgICBpZiAoaW5wdXRWYWx1ZSA+IDAgJiYgaW5wdXRWYWx1ZSA8PSAzKSB7XHJcbiAgICAgICAgdG90YWxJbml0aWFsUHJpY2UgPSBpbnB1dFZhbHVlICogZF9pbml0aWFsQ292ZXJQcmljZTtcclxuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIChpbnB1dFZhbHVlID4gMyAmJiBmaW5hbFByaWNlIDwgcHJpY2VMaW1pdCkgfHxcclxuICAgICAgICBwcmljZUxpbWl0IDwgZmluYWxQcmljZVxyXG4gICAgICApIHtcclxuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gKGlucHV0VmFsdWUgLSAzKSAqIGRfaW5pdGlhbFNpbmdsZVRyaXBQcmljZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZmluYWxQcmljZSA9IHBhcnNlRmxvYXQodG90YWxJbml0aWFsUHJpY2UgKyB0b3RhbFNpbmdsZVByaWNlKS50b0ZpeGVkKDIpO1xyXG5cclxuICAgIGlmIChmaW5hbFByaWNlID4gcHJpY2VMaW1pdCkge1xyXG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KFxyXG4gICAgICAgIGN1cnJlbmN5U3ltYm9sICsgcGFyc2VGbG9hdChwcmljZUxpbWl0KS50b0ZpeGVkKDIpXHJcbiAgICAgICk7XHJcbiAgICAgIC8vIGNoYW5nZSBjb2xvciBvZiBwcmljZVxyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLmFkZENsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICAgIC8vIHNob3cgd2FybmluZyB0ZXh0XHJcbiAgICAgIHdhcm5pbmdUZXh0LnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcclxuICAgICAgd2FybmluZ1RleHQuaGlkZSgpO1xyXG4gICAgICBjb3Zlck9wdGlvblByaWNlLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhgJHtpbnB1dFZhbHVlfSA9ICR7ZmluYWxQcmljZX1gKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgQ292ZXJPcHRpb25zIH07XHJcbiIsIi8vIG1vZHVsZSBcIkdvb2RieWVXb3JsZC5qc1wiXHJcblxyXG5mdW5jdGlvbiBHb29kYnllKCkge1xyXG4gIHJldHVybiAnR29vZGJ5ZSc7XHJcbn1cclxuXHJcbmNvbnN0IFdvcmxkID0gJ1dvcmxkICEhJztcclxuXHJcbmV4cG9ydCB7IEdvb2RieWUsIFdvcmxkIH07XHJcbiIsImZ1bmN0aW9uIFRvZ2dsZU5hdmlnYXRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgY3VycmVuY3kgPSAkKCcuY3VycmVuY3knKTtcclxuICBjb25zdCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcclxuICBjb25zdCBuYXZCYXJUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xyXG4gIGNvbnN0IGN1cnJlbmN5TmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWN1cnJlbmN5LXRvZ2dsZScpO1xyXG4gIGNvbnN0IGN1cnJlbmN5TWVudVRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgbmF2QmFyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XHJcbiAgY3VycmVuY3lNZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQ3VycmVuY3lNZW51KTtcclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xyXG4gICAgbWFpbk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbmN5TWVudSgpIHtcclxuICAgIGN1cnJlbmN5TmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCQod2luZG93KS53aWR0aCgpID4gJzExOTknKSB7XHJcbiAgICBjdXJyZW5jeS5zaG93KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGN1cnJlbmN5LmhpZGUoKTtcclxuICB9XHJcblxyXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAnMTE5OScpIHtcclxuICAgICAgY3VycmVuY3kuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVuY3kuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBEcm9wZG93bk1lbnUoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGNhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY2FyJyk7XHJcbiAgbGV0IGRyb3BEb3duTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi0tY2FyIC5kcm9wZG93bi1tZW51Jyk7XHJcblxyXG4gIGlmIChjYXJCdG4gIT0gbnVsbCAmJiBkcm9wRG93bk1lbnUgIT0gbnVsbCkge1xyXG4gICAgbGV0IGRyb3BEb3duID0gY2FyQnRuLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAvLyBCaW5kIGV2ZW50c1xyXG4gICAgY2FyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyQnRuSGFuZGxlcik7XHJcblxyXG4gICAgLy8gRXZlbnQgaGFuZGxlcnNcclxuICAgIGZ1bmN0aW9uIGNhckJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyB0b2dnbGUgZGlzcGxheVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnJ1xyXG4gICAgICApIHtcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID1cclxuICAgICAgICAgIGRyb3BEb3duLm9mZnNldEhlaWdodCArIGRyb3BEb3duTWVudS5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gRml4ZWROYXZpZ2F0aW9uKCkge1xyXG4gIC8vIG1ha2UgbmF2YmFyIHN0aWNreVxyXG4gIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXHJcbiAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICBteUZ1bmN0aW9uKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICBsZXQgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhcicpO1xyXG5cclxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXHJcbiAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XHJcblxyXG4gIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxyXG4gIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc3RpY2t5ID0gbmF2QmFyLm9mZnNldFRvcDtcclxuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcclxuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5hZGQoJ25hdmJhci1maXhlZC10b3AnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QucmVtb3ZlKCduYXZiYXItZml4ZWQtdG9wJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBTZWxlY3RUcmlwKCkge1xyXG4gIC8vIHNlbGVjdCB2ZWhpY2xlXHJcbiAgJCgnLnRhYi1jYXIgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSk7XHJcblxyXG4gICQoJy50YWItY2FyIC5pY29uLXJhZGlvIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tY3RhLS1kaXNhYmxlZCcpO1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLmFkZENsYXNzKCdidG4tY3RhJyk7XHJcbiAgICAkKCcudGFiLWNhciAuYnRuJykudW5iaW5kKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIHNob3cgbW9iaWxlIGN1cnJlbmN5XHJcbmZ1bmN0aW9uIFJldmVhbEN1cnJlbmN5KCkge1xyXG4gICQoJy5jdXJyZW5jeS1tb2JpbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDdXJyZW5jeScpO1xyXG5cclxuICAgICQoJy5jdXJyZW5jeScpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbixcclxuICBEcm9wZG93bk1lbnUsXHJcbiAgRml4ZWROYXZpZ2F0aW9uLFxyXG4gIFNlbGVjdFRyaXAsXHJcbiAgUmV2ZWFsQ3VycmVuY3lcclxufTtcclxuIiwiZnVuY3Rpb24gUG9saWN5U3VtbWFyeSgpIHtcclxuICAvLyBwb2xpY3kgc3VtbWFyeVxyXG4gICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gc2hvdyBwb2xpY3kgc3VtbWFyeVxyXG4gICAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgcG9saWN5U3VtbWFyeSA9ICQodGhpcykuZGF0YSgncG9saWN5Jyk7XHJcbiAgICAkKCcuJyArIHBvbGljeVN1bW1hcnkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBQb2xpY3lTdW1tYXJ5IH07XHJcbiIsIi8vIG1vZHVsZSBSZXZlYWxEb2NzLmpzXHJcblxyXG5mdW5jdGlvbiBSZXZlYWxEb2NzKCkge1xyXG4gIC8vRG9jc1xyXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IG9uID0gJCgnLmRvY3MnKS5pcygnOnZpc2libGUnKTtcclxuICAgICQodGhpcykuaHRtbChcclxuICAgICAgb24gPyAnVmlldyBwb2xpY3kgZG9jdW1lbnRhdGlvbicgOiAnSGlkZSBwb2xpY3kgZG9jdW1lbnRhdGlvbidcclxuICAgICk7XHJcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJldmVhbERvY3MgfTtcclxuIiwiLy8gbW9kdWxlIFwiU2NyZWVuLmpzXCJcclxuXHJcbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xyXG4gIHZhciBzY3JvbGxTdGVwID0gLXdpbmRvdy5zY3JvbGxZIC8gKHNjcm9sbER1cmF0aW9uIC8gMTUpLFxyXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgc2Nyb2xsU3RlcCk7XHJcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcclxuICAgIH0sIDE1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xyXG4gIGNvbnN0IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMjtcclxuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxyXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XHJcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xyXG4gICAgaWYgKHNjcm9sbENvdW50ID49IE1hdGguUEkpIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcclxuICAgICk7XHJcbiAgICBvbGRUaW1lc3RhbXAgPSBuZXdUaW1lc3RhbXA7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxufVxyXG4vKlxyXG4gIEV4cGxhbmF0aW9uczpcclxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxyXG4gIC0gbmV3VGltZXN0YW1wIGluZGljYXRlcyB0aGUgY3VycmVudCB0aW1lIHdoZW4gY2FsbGJhY2tzIHF1ZXVlZCBieSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmVnaW4gdG8gZmlyZS5cclxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxyXG5cclxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXHJcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXHJcbiAgPSBhICogY29zIChieCkgKyAxICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEgc3RyZXRjaGVzIGFsb25nIHRoZSB5IGF4aXMgPSBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDJcclxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXHJcbiovXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcclxuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBiYWNrVG9Ub3BCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KDEwMDApO1xyXG5cclxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXaW5kb3dXaWR0aCgpIHtcclxuICBjb25zb2xlLmxvZygnV2luZG93V2lkdGgnKTtcclxuXHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgYWNjb3JkaW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAnLmNhcmQtcHJvZHVjdHMgLmFjY29yZGlvbi1idG4nXHJcbiAgKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHcgPVxyXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHxcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuICAgIGlmICh3ID4gMTIwMCkge1xyXG4gICAgICBsZXQgaTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh3IDw9IDEyMDApIHtcclxuICAgICAgbGV0IGk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH07XHJcbiIsIi8vIG1vZHVsZSBcIlNjcm9sbFRvLmpzXCJcclxuXHJcbmZ1bmN0aW9uIFNjcm9sbFRvKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIC8vIFNlbGVjdCBhbGwgbGlua3Mgd2l0aCBoYXNoZXNcclxuICAvLyBSZW1vdmUgbGlua3MgdGhhdCBkb24ndCBhY3R1YWxseSBsaW5rIHRvIGFueXRoaW5nXHJcbiAgbGV0IGFuY2hvcnMgPSAkKCdhW2hyZWYqPVwiI1wiXScpXHJcbiAgICAubm90KCdbaHJlZj1cIiNcIl0nKVxyXG4gICAgLm5vdCgnW2hyZWY9XCIjMFwiXScpO1xyXG5cclxuICBsZXQgaGVpZ2h0Q29tcGVuc2F0aW9uID0gNjA7XHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBhbmNob3JzLmNsaWNrKGFuY2hvcnNIYW5kbGVyKTtcclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBhbmNob3JzSGFuZGxlcihldmVudCkge1xyXG4gICAgLy8gT24tcGFnZSBsaW5rc1xyXG4gICAgaWYgKFxyXG4gICAgICBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpID09XHJcbiAgICAgICAgdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpICYmXHJcbiAgICAgIGxvY2F0aW9uLmhvc3RuYW1lID09IHRoaXMuaG9zdG5hbWVcclxuICAgICkge1xyXG4gICAgICAvLyBGaWd1cmUgb3V0IGVsZW1lbnQgdG8gc2Nyb2xsIHRvXHJcbiAgICAgIGxldCB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XHJcbiAgICAgIHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsgJ10nKTtcclxuICAgICAgLy8gRG9lcyBhIHNjcm9sbCB0YXJnZXQgZXhpc3Q/XHJcbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gT25seSBwcmV2ZW50IGRlZmF1bHQgaWYgYW5pbWF0aW9uIGlzIGFjdHVhbGx5IGdvbm5hIGhhcHBlblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIGhlaWdodENvbXBlbnNhdGlvblxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDEwMDAsXHJcbiAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgYWZ0ZXIgYW5pbWF0aW9uXHJcbiAgICAgICAgICAgIC8vIE11c3QgY2hhbmdlIGZvY3VzIVxyXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQodGFyZ2V0KTtcclxuICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoJHRhcmdldC5pcygnOmZvY3VzJykpIHtcclxuICAgICAgICAgICAgICAvLyBDaGVja2luZyBpZiB0aGUgdGFyZ2V0IHdhcyBmb2N1c2VkXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICR0YXJnZXQuYXR0cigndGFiaW5kZXgnLCAnLTEnKTsgLy8gQWRkaW5nIHRhYmluZGV4IGZvciBlbGVtZW50cyBub3QgZm9jdXNhYmxlXHJcbiAgICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpOyAvLyBTZXQgZm9jdXMgYWdhaW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIG9uIHNjcm9sbFxyXG5pZiAoJCgnLmFydGljbGUtbWFpbicpLmxlbmd0aCA+IDApIHtcclxuICBsZXQgdGFyZ2V0ID0gJCgnLmFydGljbGUtbWFpbicpLm9mZnNldCgpLnRvcCAtIDE4MDtcclxuICAkKGRvY3VtZW50KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID49IHRhcmdldCkge1xyXG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy5zaGFyZS1idXR0b25zJykuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBTY3JvbGxUbyB9O1xyXG4iLCJmdW5jdGlvbiBSZWFkeShmbikge1xyXG4gIGlmIChcclxuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50XHJcbiAgICAgID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xyXG4gICAgICA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJ1xyXG4gICkge1xyXG4gICAgZm4oKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJlYWR5IH07XHJcbiIsImZ1bmN0aW9uIFZlaGljbGVTZWxlY3RvcigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgY2FyVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX19jYXInKTtcclxuICBsZXQgdmFuVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX192YW4nKTtcclxuXHJcbiAgLy8gYmluZCBldmVudHNcclxuICBpZiAoY2FyVGFiICE9IG51bGwgJiYgdmFuVGFiICE9IG51bGwpIHtcclxuICAgIGNhclRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcclxuICAgIHZhblRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcclxuICB9XHJcblxyXG4gIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gb3BlblZlaGljbGUoZXZ0KSB7XHJcbiAgICB2YXIgaSwgeCwgdGFiQnV0dG9ucztcclxuXHJcbiAgICBjb25zb2xlLmxvZyhldnQpO1xyXG5cclxuICAgIC8vIGhpZGUgYWxsIHRhYiBjb250ZW50c1xyXG4gICAgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItY29udGFpbmVyIC50YWInKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHhbaV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxuXHJcbiAgICAvLyByZW1vdmUgdGhlIGhpZ2hsaWdodCBvbiB0aGUgdGFiIGJ1dHRvblxyXG4gICAgdGFiQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtdGFicyAubmF2LWxpbmsnKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lID0gdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUucmVwbGFjZSgnIGFjdGl2ZScsICcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBoaWdobGlnaHQgdGFiIGJ1dHRvbiBhbmRcclxuICAgIC8vIHNob3cgdGhlIHNlbGVjdGVkIHRhYiBjb250ZW50XHJcbiAgICBsZXQgdmVoaWNsZSA9IGV2dC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12ZWhpY2xlJyk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFiLScgKyB2ZWhpY2xlKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZSArPSAnIGFjdGl2ZSc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfTtcclxuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcInV0aWxcIjtcclxuXHJcbi8vIG1vZHVsZSBcIkxvYWRGQVFzLmpzXCJcclxuXHJcbmZ1bmN0aW9uIExvYWRGQVFzKCkge1xyXG4gIC8vIGxvYWQgZmFxc1xyXG4gICQoJyNmYXFUYWJzIGEnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKHRoaXMpLnRhYignc2hvdycpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBsb2FkIGZhcXNcclxuICAvLyBvbmx5IGxvYWQgaWYgb24gZmFxcyBwYWdlXHJcbiAgaWYgKCQoJyNmYXFzJykubGVuZ3RoID4gMCkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgIHVybDogJy9hcGkvZmFxcy5qc29uJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZmFxcykge1xyXG4gICAgICAgIC8vIGdldCB0aGUgaGVhZHNcclxuICAgICAgICAkLmVhY2goZmFxcywgZnVuY3Rpb24oaW5kZXgsIGZhcSkge1xyXG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBkZXNrdG9wXHJcbiAgICAgICAgICAkKGBhW2hyZWY9JyMke2ZhcS5pZH0nXWApXHJcbiAgICAgICAgICAgIC5maW5kKCdzcGFuJylcclxuICAgICAgICAgICAgLnRleHQoZmFxLnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIG1vYmlsZVxyXG4gICAgICAgICAgJChgIyR7ZmFxLmlkfWApXHJcbiAgICAgICAgICAgIC5maW5kKCdoMycpXHJcbiAgICAgICAgICAgIC50ZXh0KGZhcS5zaG9ydFRpdGxlKTtcclxuXHJcbiAgICAgICAgICAvLyBnZXQgdGhlIGJvZHlcclxuICAgICAgICAgICQuZWFjaChmYXEucWFzLCBmdW5jdGlvbihmSW5kZXgsIHFhKSB7XHJcbiAgICAgICAgICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJywgYCMke2ZhcS5pZH1gKS5hcHBlbmQoXHJcbiAgICAgICAgICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtxYS5xdWVzdGlvbn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxyXG4gICAgICAgICAgICAgICAgICR7cWEuYW5zd2VyfVxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pOyAvLyAkYWpheFxyXG5cclxuICAgICQoJy5mYXEtYW5zd2VycyAuaW5uZXIgLmFjY29yZGlvbicpLmRlbGVnYXRlKFxyXG4gICAgICAnLmFjY29yZGlvbi1idG4nLFxyXG4gICAgICAnY2xpY2snLFxyXG4gICAgICBmYXFzSGFuZGxlclxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGxvYWRQcm9kdWN0UGFnZUZBUXMoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGxvYWRQcm9kdWN0UGFnZUZBUXMoKSB7XHJcbiAgLy8gb25seSBsb2FkIGlmIG9uIHByb2R1Y3QgcGFnZVxyXG4gIGlmICgkKCcucHJvZHVjdC1mYXFzJykubGVuZ3RoID4gMCkge1xyXG4gICAgbGV0IGZpbGUgPSAkKCcucHJvZHVjdC1mYXFzJylcclxuICAgICAgLmRhdGEoJ2ZhcXMnKVxyXG4gICAgICAucmVwbGFjZSgnJi0nLCAnJyk7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApO1xyXG5cclxuICAgIC8vJC5hamF4KHtcclxuICAgIC8vICB0eXBlOiAnR0VUJyxcclxuICAgIC8vICB1cmw6IGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCxcclxuICAgIC8vICBzdWNjZXNzOiB1cGRhdGVVSVN1Y2Nlc3MsXHJcbiAgICAvLyAgZXJyb3I6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cywgZXJyb3IpIHtcclxuICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xyXG4gICAgLy8gIH1cclxuICAgIC8vfSk7IC8vICRhamF4XHJcblxyXG4gICAgZmV0Y2goYC9hcGkvJHtmaWxlfS1mYXFzLmpzb25gKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgcmV0dXJuIChyZXNwb25zZS5qc29uKCkpO1xyXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgdXBkYXRlVUlTdWNjZXNzKHJlc3BvbnNlKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICB1cGRhdGVVSUZhaWx1cmUoZXJyb3IpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLmZhcS1hbnN3ZXJzIC5pbm5lciAuYWNjb3JkaW9uJykuZGVsZWdhdGUoXHJcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXHJcbiAgICAgICdjbGljaycsXHJcbiAgICAgIGZhcXNIYW5kbGVyXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVVJU3VjY2VzcyhmYXFzKSB7XHJcbiAgLy8gZ2V0IHRoZSBib2R5XHJcbiAgJC5lYWNoKGZhcXMsIGZ1bmN0aW9uIChmSW5kZXgsIGZhcSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhgIyR7ZmFxLmlkfWApO1xyXG4gICAgJCgnLmlubmVyIC5hY2NvcmRpb24nKS5hcHBlbmQoXHJcbiAgICAgIGA8YnV0dG9uIGNsYXNzPVwiYWNjb3JkaW9uLWJ0biBoNFwiPiR7ZmFxLnF1ZXN0aW9ufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVsXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubmVyXCI+XHJcbiAgICAgICAgICAgICAgJHtmYXEuYW5zd2VyfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIGBcclxuICAgICk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIHNob3cgY29udGVudFxyXG4gICQoJy5mYXEtYW5zd2Vycy1wcm9kdWN0Jykuc2hvdygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVVSUZhaWx1cmUoZXJyb3IpIHtcclxuICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZhcXNIYW5kbGVyKGV2dCkge1xyXG4gIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXHJcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xyXG4gIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG5cclxuICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xyXG4gIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcclxuICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xyXG4gICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xyXG4gICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcclxuICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcclxuICB9XHJcbn1cclxuZXhwb3J0IHsgTG9hZEZBUXMgfTtcclxuIiwiaW1wb3J0IHsgR29vZGJ5ZSwgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkJztcclxuaW1wb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XHJcbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvcmRpb24nO1xyXG5pbXBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yJztcclxuaW1wb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL1ZlaGljbGVTZWxlY3Rvcic7XHJcbmltcG9ydCB7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbixcclxuICBEcm9wZG93bk1lbnUsXHJcbiAgRml4ZWROYXZpZ2F0aW9uLFxyXG4gIFNlbGVjdFRyaXAsXHJcbiAgUmV2ZWFsQ3VycmVuY3lcclxufSBmcm9tICcuL2NvbXBvbmVudHMvTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IFNjcm9sbFRvIH0gZnJvbSAnLi9jb21wb25lbnRzL1Njcm9sbFRvJztcclxuaW1wb3J0IHsgQXV0b0NvbXBsZXRlIH0gZnJvbSAnLi9jb21wb25lbnRzL0F1dG9Db21wbGV0ZSc7XHJcbmltcG9ydCB7IExvYWRGQVFzIH0gZnJvbSAnLi9jb21wb25lbnRzL2ZhcXMnO1xyXG5pbXBvcnQgeyBSZXZlYWxEb2NzIH0gZnJvbSAnLi9jb21wb25lbnRzL1JldmVhbERvY3MnO1xyXG5pbXBvcnQgeyBDb3Zlck9wdGlvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvQ292ZXJPcHRpb25zJztcclxuaW1wb3J0IHsgUmVhZHkgfSBmcm9tICcuL2NvbXBvbmVudHMvVXRpbHMnO1xyXG5pbXBvcnQgeyBQb2xpY3lTdW1tYXJ5IH0gZnJvbSAnLi9jb21wb25lbnRzL1BvbGljeVN1bW1hcnknO1xyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICd1dGlsJztcclxuXHJcbmNvbnNvbGUubG9nKGAke0dvb2RieWUoKX0gJHtXb3JsZH0gSW5kZXggZmlsZWApO1xyXG5cclxubGV0IGNvdW50cmllc0NvdmVyZWQgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgLy8gQ291bnRyeVNlbGVjdG9yKCk7XHJcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbigpO1xyXG4gIERyb3Bkb3duTWVudSgpO1xyXG4gIFNjcm9sbFRvVG9wKCk7XHJcbiAgRml4ZWROYXZpZ2F0aW9uKCk7XHJcbiAgQWNjb3JkaW9uKCk7XHJcbiAgV2luZG93V2lkdGgoKTtcclxuICBTY3JvbGxUbygpO1xyXG5cclxuICAvL2NvbnNvbGUubG9nKGBjb3VudHJpZXNDb3ZlcmVkOiAke2NvdW50cmllc0NvdmVyZWR9YCk7XHJcbiAgLy9pZiAoY291bnRyaWVzQ292ZXJlZCAhPSBudWxsKSB7XHJcbiAgLy8gIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbnB1dCcpLCBjb3VudHJpZXNDb3ZlcmVkKTtcclxuICAvL31cclxuICBMb2FkRkFRcygpO1xyXG4gIFJldmVhbERvY3MoKTtcclxuICBDb3Zlck9wdGlvbnMoKTtcclxuICBQb2xpY3lTdW1tYXJ5KCk7XHJcbiAgU2VsZWN0VHJpcCgpO1xyXG4gIFJldmVhbEN1cnJlbmN5KCk7XHJcbn1cclxuXHJcblJlYWR5KHN0YXJ0KTtcclxuIl19
