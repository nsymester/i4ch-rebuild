(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module "HelloWorld.js"

function Hello() {
  return 'Hello';
}

var World = 'World';

exports.Hello = Hello;
exports.World = World;

},{}],2:[function(require,module,exports){
"use strict";

var _HelloWorld = require("./components/HelloWorld");

console.log((0, _HelloWorld.Hello)() + " " + _HelloWorld.World + " NAS Application");

},{"./components/HelloWorld":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0hlbGxvV29ybGQuanMiLCJzcmMvc2NyaXB0cy9wcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7QUFFQSxTQUFTLEtBQVQsR0FBaUI7QUFDZixTQUFPLE9BQVA7QUFDRDs7QUFFRCxJQUFNLFFBQVEsT0FBZDs7UUFFUyxLLEdBQUEsSztRQUFPLEssR0FBQSxLOzs7OztBQ1JoQjs7QUFFQSxRQUFRLEdBQVIsQ0FBZSx3QkFBZixTQUEwQixpQkFBMUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgXCJIZWxsb1dvcmxkLmpzXCJcclxuXHJcbmZ1bmN0aW9uIEhlbGxvKCkge1xyXG4gIHJldHVybiAnSGVsbG8nO1xyXG59XHJcblxyXG5jb25zdCBXb3JsZCA9ICdXb3JsZCc7XHJcblxyXG5leHBvcnQgeyBIZWxsbywgV29ybGQgfTtcclxuIiwiaW1wb3J0IHsgSGVsbG8sIFdvcmxkIH0gZnJvbSBcIi4vY29tcG9uZW50cy9IZWxsb1dvcmxkXCI7XHJcblxyXG5jb25zb2xlLmxvZyhgJHtIZWxsbygpfSAke1dvcmxkfSBOQVMgQXBwbGljYXRpb25gKTtcclxuIl19
