(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
  function accordionHandler() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle('active');

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

exports.ScrollToTop = ScrollToTop;

},{}],4:[function(require,module,exports){
'use strict';

var _GoodbyeWorld = require('./components/GoodbyeWorld');

var _Screen = require('./components/Screen');

var _Accordion = require('./components/Accordion');

console.log((0, _GoodbyeWorld.Goodbye)() + ' ' + _GoodbyeWorld.World + ' Index file');

(0, _Screen.ScrollToTop)();
(0, _Accordion.Accordion)();

},{"./components/Accordion":1,"./components/GoodbyeWorld":2,"./components/Screen":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUE7O0FBRUEsU0FBUyxTQUFULEdBQXFCO0FBQ25CO0FBQ0EsTUFBSSxNQUFNLFNBQVMsZ0JBQVQsQ0FBMEIsZ0JBQTFCLENBQVY7O0FBRUE7QUFDQSxNQUFJLFVBQUo7QUFDQSxPQUFLLElBQUksQ0FBVCxFQUFZLElBQUksSUFBSSxNQUFwQixFQUE0QixHQUE1QixFQUFpQztBQUMvQixRQUFJLENBQUosRUFBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxnQkFBakM7QUFDRDs7QUFFRDtBQUNBLFdBQVMsZ0JBQVQsR0FBNEI7QUFDMUI7O0FBRUEsU0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixRQUF0Qjs7QUFFQTtBQUNBLFFBQUksUUFBUSxLQUFLLGtCQUFqQjtBQUNBLFFBQUksTUFBTSxLQUFOLENBQVksU0FBaEIsRUFBMkI7QUFDekIsWUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixJQUF4QjtBQUNBLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsR0FBeEI7QUFDQSxZQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLEdBQTNCO0FBQ0QsS0FKRCxNQUlPO0FBQ0wsWUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixNQUFNLFlBQU4sR0FBcUIsSUFBN0M7QUFDQSxZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE9BQXhCO0FBQ0EsWUFBTSxLQUFOLENBQVksWUFBWixHQUEyQixNQUEzQjtBQUNEO0FBQ0Y7QUFDRjtRQUNRLFMsR0FBQSxTOzs7Ozs7OztBQy9CVDs7QUFFQSxTQUFTLE9BQVQsR0FBbUI7QUFDakIsU0FBTyxTQUFQO0FBQ0Q7O0FBRUQsSUFBTSxRQUFRLFVBQWQ7O1FBRVMsTyxHQUFBLE87UUFBUyxLLEdBQUEsSzs7Ozs7Ozs7QUNSbEI7O0FBRUEsU0FBUyxZQUFULENBQXNCLGNBQXRCLEVBQXNDO0FBQ3BDLE1BQUksYUFBYSxDQUFDLE9BQU8sT0FBUixJQUFtQixpQkFBaUIsRUFBcEMsQ0FBakI7QUFBQSxNQUNFLGlCQUFpQixZQUFZLFlBQVc7QUFDdEMsUUFBSSxPQUFPLE9BQVAsSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsYUFBTyxRQUFQLENBQWdCLENBQWhCLEVBQW1CLFVBQW5CO0FBQ0QsS0FGRCxNQUVPLGNBQWMsY0FBZDtBQUNSLEdBSmdCLEVBSWQsRUFKYyxDQURuQjtBQU1EOztBQUVELFNBQVMseUJBQVQsQ0FBbUMsY0FBbkMsRUFBbUQ7QUFDakQsTUFBTSxlQUFlLE9BQU8sT0FBUCxHQUFpQixDQUF0QztBQUNBLE1BQUksY0FBYyxDQUFsQjtBQUFBLE1BQ0UsZUFBZSxZQUFZLEdBQVosRUFEakI7O0FBR0EsV0FBUyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUMxQixtQkFBZSxLQUFLLEVBQUwsSUFBVyxrQkFBa0IsZUFBZSxZQUFqQyxDQUFYLENBQWY7QUFDQSxRQUFJLGVBQWUsS0FBSyxFQUF4QixFQUE0QixPQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7QUFDNUIsUUFBSSxPQUFPLE9BQVAsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDMUIsV0FBTyxRQUFQLENBQ0UsQ0FERixFQUVFLEtBQUssS0FBTCxDQUFXLGVBQWUsZUFBZSxLQUFLLEdBQUwsQ0FBUyxXQUFULENBQXpDLENBRkY7QUFJQSxtQkFBZSxZQUFmO0FBQ0EsV0FBTyxxQkFBUCxDQUE2QixJQUE3QjtBQUNEOztBQUVELFNBQU8scUJBQVAsQ0FBNkIsSUFBN0I7QUFDRDtBQUNEOzs7Ozs7Ozs7Ozs7OztBQWNBLFNBQVMsV0FBVCxHQUF1QjtBQUNyQjtBQUNBLE1BQU0sZUFBZSxTQUFTLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXJCOztBQUVBO0FBQ0EsTUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDeEIsaUJBQWEsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsbUJBQXZDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLG1CQUFULENBQTZCLEdBQTdCLEVBQWtDO0FBQ2hDO0FBQ0EsUUFBSSxjQUFKO0FBQ0EsOEJBQTBCLElBQTFCOztBQUVBO0FBQ0Q7QUFDRjs7UUFFUSxXLEdBQUEsVzs7Ozs7QUMvRFQ7O0FBQ0E7O0FBQ0E7O0FBRUEsUUFBUSxHQUFSLENBQWUsNEJBQWYsU0FBNEIsbUJBQTVCOztBQUVBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgXCJBY2NvcmRpb24uanNcIlxuXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBsZXQgaTtcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcigpIHtcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXG4gICAgbGV0IHBhbmVsID0gdGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgfVxuICB9XG59XG5leHBvcnQgeyBBY2NvcmRpb24gfTtcbiIsIi8vIG1vZHVsZSBcIkdvb2RieWVXb3JsZC5qc1wiXG5cbmZ1bmN0aW9uIEdvb2RieWUoKSB7XG4gIHJldHVybiAnR29vZGJ5ZSc7XG59XG5cbmNvbnN0IFdvcmxkID0gJ1dvcmxkICEhJztcblxuZXhwb3J0IHsgR29vZGJ5ZSwgV29ybGQgfTtcbiIsIi8vIG1vZHVsZSBcIlNjcmVlbi5qc1wiXG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xuICB2YXIgc2Nyb2xsU3RlcCA9IC13aW5kb3cuc2Nyb2xsWSAvIChzY3JvbGxEdXJhdGlvbiAvIDE1KSxcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcbiAgICAgICAgd2luZG93LnNjcm9sbEJ5KDAsIHNjcm9sbFN0ZXApO1xuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xuICAgIH0sIDE1KTtcbn1cblxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xuICBjb25zdCBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDI7XG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xuICAgIGlmIChzY3JvbGxDb3VudCA+PSBNYXRoLlBJKSB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XG4gICAgd2luZG93LnNjcm9sbFRvKFxuICAgICAgMCxcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxuICAgICk7XG4gICAgb2xkVGltZXN0YW1wID0gbmV3VGltZXN0YW1wO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xufVxuLypcbiAgRXhwbGFuYXRpb25zOlxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxuICAtIG5ld1RpbWVzdGFtcCBpbmRpY2F0ZXMgdGhlIGN1cnJlbnQgdGltZSB3aGVuIGNhbGxiYWNrcyBxdWV1ZWQgYnkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJlZ2luIHRvIGZpcmUuXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxuXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXG4gID0gYSAqIGNvcyAoYngpICsgMSAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeSBheGlzID0gY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXG4qL1xuXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcbiAgLy8gQ2FjaGUgRE9NXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xuXG4gIC8vIEJpbmQgRXZlbnRzXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYmFja1RvVG9wQnRuSGFuZGxlcihldnQpIHtcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dCgxMDAwKTtcblxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgU2Nyb2xsVG9Ub3AgfTtcbiIsImltcG9ydCB7IEdvb2RieWUsIFdvcmxkIH0gZnJvbSAnLi9jb21wb25lbnRzL0dvb2RieWVXb3JsZCc7XG5pbXBvcnQgeyBTY3JlZW4sIFNjcm9sbFRvVG9wIH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uJztcblxuY29uc29sZS5sb2coYCR7R29vZGJ5ZSgpfSAke1dvcmxkfSBJbmRleCBmaWxlYCk7XG5cblNjcm9sbFRvVG9wKCk7XG5BY2NvcmRpb24oKTtcbiJdfQ==
