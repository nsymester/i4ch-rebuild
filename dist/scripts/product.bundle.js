(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hello = Hello;
exports.World = void 0;

// module "HelloWorld.js"
function Hello() {
  return 'Hello';
}

var World = 'World';
exports.World = World;

},{}],2:[function(require,module,exports){
"use strict";

var _HelloWorld = require("./components/HelloWorld");

console.log("".concat((0, _HelloWorld.Hello)(), " ").concat(_HelloWorld.World, " NAS Application"));

},{"./components/HelloWorld":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0hlbGxvV29ybGQuanMiLCJzcmMvc2NyaXB0cy9wcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtBQUVBLFNBQVMsS0FBVCxHQUFpQjtBQUNmLFNBQU8sT0FBUDtBQUNEOztBQUVELElBQU0sS0FBSyxHQUFHLE9BQWQ7Ozs7OztBQ05BOztBQUVBLE9BQU8sQ0FBQyxHQUFSLFdBQWUsd0JBQWYsY0FBMEIsaUJBQTFCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbW9kdWxlIFwiSGVsbG9Xb3JsZC5qc1wiXHJcblxyXG5mdW5jdGlvbiBIZWxsbygpIHtcclxuICByZXR1cm4gJ0hlbGxvJztcclxufVxyXG5cclxuY29uc3QgV29ybGQgPSAnV29ybGQnO1xyXG5cclxuZXhwb3J0IHsgSGVsbG8sIFdvcmxkIH07XHJcbiIsImltcG9ydCB7IEhlbGxvLCBXb3JsZCB9IGZyb20gJy4vY29tcG9uZW50cy9IZWxsb1dvcmxkJztcclxuXHJcbmNvbnNvbGUubG9nKGAke0hlbGxvKCl9ICR7V29ybGR9IE5BUyBBcHBsaWNhdGlvbmApO1xyXG4iXX0=
