(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

function ScrollToTop() {
  // Cache DOM
  var backToTopBtn = document.querySelector('.js-back-to-top');

  // Bind Events
  backToTopBtn.click(backToTopBtnHandler);

  // Event Handlers
  function backToTopBtnHandler(evt) {
    // Animate the scroll to top
    evt.preventDefault();
    _scrollToTop(300);

    // $('html, body').animate({ scrollTop: 0 }, 300);
  }
}

exports.ScrollToTop = ScrollToTop;

},{}],3:[function(require,module,exports){
'use strict';

var _GoodbyeWorld = require('./components/GoodbyeWorld');

var _Screen = require('./components/Screen');

console.log((0, _GoodbyeWorld.Goodbye)() + ' ' + _GoodbyeWorld.World + ' Index file');

(0, _Screen.Screen)();

},{"./components/GoodbyeWorld":1,"./components/Screen":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0dvb2RieWVXb3JsZC5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvU2NyZWVuLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsT0FBVCxHQUFtQjtBQUNqQixTQUFPLFNBQVA7QUFDRDs7QUFFRCxJQUFNLFFBQVEsVUFBZDs7UUFFUyxPLEdBQUEsTztRQUFTLEssR0FBQSxLOzs7Ozs7OztBQ1JsQjs7QUFFQSxTQUFTLFlBQVQsQ0FBc0IsY0FBdEIsRUFBc0M7QUFDcEMsTUFBSSxhQUFhLENBQUMsT0FBTyxPQUFSLElBQW1CLGlCQUFpQixFQUFwQyxDQUFqQjtBQUFBLE1BQ0UsaUJBQWlCLFlBQVksWUFBVztBQUN0QyxRQUFJLE9BQU8sT0FBUCxJQUFrQixDQUF0QixFQUF5QjtBQUN2QixhQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsVUFBbkI7QUFDRCxLQUZELE1BRU8sY0FBYyxjQUFkO0FBQ1IsR0FKZ0IsRUFJZCxFQUpjLENBRG5CO0FBTUQ7O0FBRUQsU0FBUyxXQUFULEdBQXVCO0FBQ3JCO0FBQ0EsTUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixpQkFBdkIsQ0FBckI7O0FBRUE7QUFDQSxlQUFhLEtBQWIsQ0FBbUIsbUJBQW5COztBQUVBO0FBQ0EsV0FBUyxtQkFBVCxDQUE2QixHQUE3QixFQUFrQztBQUNoQztBQUNBLFFBQUksY0FBSjtBQUNBLGlCQUFhLEdBQWI7O0FBRUE7QUFDRDtBQUNGOztRQUVRLFcsR0FBQSxXOzs7OztBQzVCVDs7QUFDQTs7QUFFQSxRQUFRLEdBQVIsQ0FBZSw0QkFBZixTQUE0QixtQkFBNUI7O0FBRUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgXCJHb29kYnllV29ybGQuanNcIlxuXG5mdW5jdGlvbiBHb29kYnllKCkge1xuICByZXR1cm4gJ0dvb2RieWUnO1xufVxuXG5jb25zdCBXb3JsZCA9ICdXb3JsZCAhISc7XG5cbmV4cG9ydCB7IEdvb2RieWUsIFdvcmxkIH07XG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3Aoc2Nyb2xsRHVyYXRpb24pIHtcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSAhPSAwKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9LCAxNSk7XG59XG5cbmZ1bmN0aW9uIFNjcm9sbFRvVG9wKCkge1xuICAvLyBDYWNoZSBET01cbiAgY29uc3QgYmFja1RvVG9wQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWJhY2stdG8tdG9wJyk7XG5cbiAgLy8gQmluZCBFdmVudHNcbiAgYmFja1RvVG9wQnRuLmNsaWNrKGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9zY3JvbGxUb1RvcCgzMDApO1xuXG4gICAgLy8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMzAwKTtcbiAgfVxufVxuXG5leHBvcnQgeyBTY3JvbGxUb1RvcCB9O1xuIiwiaW1wb3J0IHsgR29vZGJ5ZSwgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkJztcbmltcG9ydCB7IFNjcmVlbiB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xuXG5jb25zb2xlLmxvZyhgJHtHb29kYnllKCl9ICR7V29ybGR9IEluZGV4IGZpbGVgKTtcblxuU2NyZWVuKCk7XG4iXX0=
