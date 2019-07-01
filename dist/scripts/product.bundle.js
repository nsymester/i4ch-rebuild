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
  console.log('running Sticky()');
  window.addEventListener('scroll', function () {
    console.log('checking');

    if (document.querySelector('.more-information.active')) {
      var moreInfoBtn = document.querySelector('.more-information.active');
      var sticky = moreInfoBtn.offsetTop;

      if (window.pageYOffset > sticky) {
        moreInfoBtn.parentNode.parentNode.classList.add("sticky");
      } else {
        moreInfoBtn.parentNode.parentNode.classList.remove("sticky");
      }
    }
  });
}

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

var _HelloWorld = require("./components/HelloWorld");

var _Utils = require("./components/Utils");

var _Screen = require("./components/Screen");

console.log("".concat((0, _HelloWorld.Hello)(), " ").concat(_HelloWorld.World, " NAS Application"));

function start() {
  (0, _Screen.Sticky)();
}

(0, _Utils.Ready)(start);

},{"./components/HelloWorld":1,"./components/Screen":2,"./components/Utils":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0hlbGxvV29ybGQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVXRpbHMuanMiLCJzcmMvc2NyaXB0cy9wcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtBQUVBLFNBQVMsS0FBVCxHQUFpQjtBQUNmLFNBQU8sT0FBUDtBQUNEOztBQUVELElBQU0sS0FBSyxHQUFHLE9BQWQ7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUVBLFNBQVMsWUFBVCxDQUFzQixjQUF0QixFQUFzQztBQUNwQyxNQUFJLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFSLElBQW1CLGNBQWMsR0FBRyxFQUFwQyxDQUFqQjtBQUFBLE1BQ0UsY0FBYyxHQUFHLFdBQVcsQ0FBQyxZQUFXO0FBQ3RDLFFBQUksTUFBTSxDQUFDLE9BQVAsSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsTUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQUFtQixVQUFuQjtBQUNELEtBRkQsTUFFTyxhQUFhLENBQUMsY0FBRCxDQUFiO0FBQ1IsR0FKMkIsRUFJekIsRUFKeUIsQ0FEOUI7QUFNRDs7QUFFRCxTQUFTLHlCQUFULENBQW1DLGNBQW5DLEVBQW1EO0FBQ2pELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQXRDO0FBQ0EsTUFBSSxXQUFXLEdBQUcsQ0FBbEI7QUFBQSxNQUNFLFlBQVksR0FBRyxXQUFXLENBQUMsR0FBWixFQURqQjs7QUFHQSxXQUFTLElBQVQsQ0FBYyxZQUFkLEVBQTRCO0FBQzFCLElBQUEsV0FBVyxJQUFJLElBQUksQ0FBQyxFQUFMLElBQVcsY0FBYyxJQUFJLFlBQVksR0FBRyxZQUFuQixDQUF6QixDQUFmO0FBQ0EsUUFBSSxXQUFXLElB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LFFBQW5EO0FBQ0Q7QUFDRjtBQUVGLEdBWkQ7QUFhRDs7Ozs7Ozs7OztBQzNHRCxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQ0UsUUFBUSxDQUFDLFdBQVQsR0FDSSxRQUFRLENBQUMsVUFBVCxLQUF3QixVQUQ1QixHQUVJLFFBQVEsQ0FBQyxVQUFULEtBQXdCLFNBSDlCLEVBSUU7QUFDQSxJQUFBLEVBQUU7QUFDSCxHQU5ELE1BTU87QUFDTCxJQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOzs7OztBQ1ZEOztBQUNBOztBQUNBOztBQUVBLE9BQU8sQ0FBQyxHQUFSLFdBQWUsd0JBQWYsY0FBMEIsaUJBQTFCOztBQUVBLFNBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0Q7O0FBR0Qsa0JBQU0sS0FBTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIG1vZHVsZSBcIkhlbGxvV29ybGQuanNcIlxyXG5cclxuZnVuY3Rpb24gSGVsbG8oKSB7XHJcbiAgcmV0dXJuICdIZWxsbyc7XHJcbn1cclxuXHJcbmNvbnN0IFdvcmxkID0gJ1dvcmxkJztcclxuXHJcbmV4cG9ydCB7IEhlbGxvLCBXb3JsZCB9O1xyXG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wKHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXHJcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAod2luZG93LnNjcm9sbFkgIT0gMCkge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcclxuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xyXG4gICAgfSwgMTUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xyXG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXHJcbiAgICBvbGRUaW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcclxuICAgIHNjcm9sbENvdW50ICs9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyAobmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wKSk7XHJcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oXHJcbiAgICAgIDAsXHJcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxyXG4gICAgKTtcclxuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG59XHJcbi8qXHJcbiAgRXhwbGFuYXRpb25zOlxyXG4gIC0gcGkgaXMgdGhlIGxlbmd0aC9lbmQgcG9pbnQgb2YgdGhlIGNvc2ludXMgaW50ZXJ2YWxsIChzZWUgYWJvdmUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxyXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAtIG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCBlcXVhbHMgdGhlIGR1cmF0aW9uXHJcblxyXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcclxuICA9IGEgKiBjb3MgKGJ4KSArIGQgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZCB0cmFuc2xhdGVzIGFsb25nIHRoZSB5IGF4aXMgPSAxIC0+IG9ubHkgcG9zaXRpdmUgeSB2YWx1ZXNcclxuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXHJcbiAgPSBjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiAoY29zIHNjcm9sbENvdW50ICogeClcclxuKi9cclxuXHJcbmZ1bmN0aW9uIFNjcm9sbFRvVG9wKCkge1xyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xyXG5cclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xyXG4gICAgYmFja1RvVG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYmFja1RvVG9wQnRuSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XHJcblxyXG4gICAgLy8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMzAwKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGFjY29yZGlvbkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xyXG4gICk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCB3ID1cclxuICAgICAgd2luZG93LmlubmVyV2lkdGggfHxcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgICBpZiAodyA+IDEyMDApIHtcclxuICAgICAgbGV0IGk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodyA8PSAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFN0aWNreSgpe1xyXG5cclxuICBjb25zb2xlLmxvZygncnVubmluZyBTdGlja3koKScpO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcnKTtcclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9yZS1pbmZvcm1hdGlvbi5hY3RpdmUnKSkge1xyXG4gICAgICBjb25zdCBtb3JlSW5mb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb3JlLWluZm9ybWF0aW9uLmFjdGl2ZScpO1xyXG4gICAgICBjb25zdCBzdGlja3kgPSBtb3JlSW5mb0J0bi5vZmZzZXRUb3A7XHJcbiAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcclxuICAgICAgICBtb3JlSW5mb0J0bi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInN0aWNreVwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtb3JlSW5mb0J0bi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZShcInN0aWNreVwiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoLCBTdGlja3kgfTtcclxuIiwiZnVuY3Rpb24gUmVhZHkoZm4pIHtcclxuICBpZiAoXHJcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxyXG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcclxuICAgICAgOiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZydcclxuICApIHtcclxuICAgIGZuKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBSZWFkeSB9O1xyXG4iLCJpbXBvcnQgeyBIZWxsbywgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvSGVsbG9Xb3JsZCc7XHJcbmltcG9ydCB7IFJlYWR5IH0gZnJvbSAnLi9jb21wb25lbnRzL1V0aWxzJztcclxuaW1wb3J0IHsgU3RpY2t5IH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XHJcblxyXG5jb25zb2xlLmxvZyhgJHtIZWxsbygpfSAke1dvcmxkfSBOQVMgQXBwbGljYXRpb25gKTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gIFN0aWNreSgpO1xyXG59XHJcblxyXG5cclxuUmVhZHkoc3RhcnQpOyJdfQ==
