(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

var _Utils = require("./components/Utils");

var _Screen = require("./components/Screen");

// import { Hello, World } from './components/HelloWorld';
// console.log(`${Hello()} ${World} NAS Application`);
function start() {
  (0, _Screen.Sticky)();
}

(0, _Utils.Ready)(start);

},{"./components/Screen":1,"./components/Utils":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVXRpbHMuanMiLCJzcmMvc2NyaXB0cy9wcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDQUE7QUFFQSxTQUFTLFlBQVQsQ0FBc0IsY0FBdEIsRUFBc0M7QUFDcEMsTUFBSSxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBUixJQUFtQixjQUFjLEdBQUcsRUFBcEMsQ0FBakI7QUFBQSxNQUNFLGNBQWMsR0FBRyxXQUFXLENBQUMsWUFBVztBQUN0QyxRQUFJLE1BQU0sQ0FBQyxPQUFQLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLE1BQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsVUFBbkI7QUFDRCxLQUZELE1BRU8sYUFBYSxDQUFDLGNBQUQsQ0FBYjtBQUNSLEdBSjJCLEVBSXpCLEVBSnlCLENBRDlCO0FBTUQ7O0FBRUQsU0FBUyx5QkFBVCxDQUFtQyxjQUFuQyxFQUFtRDtBQUNqRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBUCxHQUFpQixDQUF0QztBQUNBLE1BQUksV0FBVyxHQUFHLENBQWxCO0FBQUEsTUFDRSxZQUFZLEdBQUcsV0FBVyxDQUFDLEdBQVosRUFEakI7O0FBR0EsV0FBUyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUMxQixJQUFBLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBTCxJQUFXLGNBQWMsSUFBSSxZQUFZLEdBQUcsWUFBbkIsQ0FBekIsQ0FBZjtBQUNBLFFBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxFQUF4QixFQUE0QixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQUFtQixDQUFuQjtBQUM1QixRQUFJLE1BQU0sQ0FBQyxPQUFQLEtBQW1CLENBQXZCLEVBQTBCO0FBQzFCLElBQUEsTUFB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UUFBUSxDQUFDLFdBQVQsR0FDSSxRQUFRLENBQUMsVUFBVCxLQUF3QixVQUQ1QixHQUVJLFFBQVEsQ0FBQyxVQUFULEtBQXdCLFNBSDlCLEVBSUU7QUFDQSxJQUFBLEVBQUU7QUFDSCxHQU5ELE1BTU87QUFDTCxJQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOzs7OztBQ1REOztBQUNBOztBQUZBO0FBSUE7QUFFQSxTQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNEOztBQUVELGtCQUFNLEtBQU4iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wKHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXHJcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAod2luZG93LnNjcm9sbFkgIT0gMCkge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcclxuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xyXG4gICAgfSwgMTUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xyXG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXHJcbiAgICBvbGRUaW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcclxuICAgIHNjcm9sbENvdW50ICs9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyAobmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wKSk7XHJcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oXHJcbiAgICAgIDAsXHJcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxyXG4gICAgKTtcclxuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG59XHJcbi8qXHJcbiAgRXhwbGFuYXRpb25zOlxyXG4gIC0gcGkgaXMgdGhlIGxlbmd0aC9lbmQgcG9pbnQgb2YgdGhlIGNvc2ludXMgaW50ZXJ2YWxsIChzZWUgYWJvdmUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxyXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAtIG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCBlcXVhbHMgdGhlIGR1cmF0aW9uXHJcblxyXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcclxuICA9IGEgKiBjb3MgKGJ4KSArIGQgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZCB0cmFuc2xhdGVzIGFsb25nIHRoZSB5IGF4aXMgPSAxIC0+IG9ubHkgcG9zaXRpdmUgeSB2YWx1ZXNcclxuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXHJcbiAgPSBjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiAoY29zIHNjcm9sbENvdW50ICogeClcclxuKi9cclxuXHJcbmZ1bmN0aW9uIFNjcm9sbFRvVG9wKCkge1xyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xyXG5cclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xyXG4gICAgYmFja1RvVG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYmFja1RvVG9wQnRuSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XHJcblxyXG4gICAgLy8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMzAwKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGNvbnN0IGFjY29yZGlvbkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xyXG4gICk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCB3ID1cclxuICAgICAgd2luZG93LmlubmVyV2lkdGggfHxcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgICBpZiAodyA+IDEyMDApIHtcclxuICAgICAgbGV0IGk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodyA8PSAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFN0aWNreSgpe1xyXG4gIGNvbnNvbGUubG9nKCdTdGlja3knKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGV2dCkge1xyXG5cclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9yZS1pbmZvcm1hdGlvbi5hY3RpdmUnKSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcnKTtcclxuXHJcbiAgICAgIGNvbnN0IG1vcmVJbmZvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vcmUtaW5mb3JtYXRpb24uYWN0aXZlJyk7XHJcbiAgICAgIGNvbnN0IHN0aWNreSA9IG1vcmVJbmZvQnRuLm9mZnNldFRvcDtcclxuICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IHN0aWNreSkge1xyXG4gICAgICAgIG1vcmVJbmZvQnRuLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwibmF2YmFyLWZpeGVkLXRvcFwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtb3JlSW5mb0J0bi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZShcIm5hdmJhci1maXhlZC10b3BcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCwgU3RpY2t5IH07XHJcbiIsImZ1bmN0aW9uIFJlYWR5KGZuKSB7XHJcbiAgaWYgKFxyXG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnRcclxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXHJcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXHJcbiAgKSB7XHJcbiAgICBmbigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgUmVhZHkgfTtcclxuIiwiLy8gaW1wb3J0IHsgSGVsbG8sIFdvcmxkIH0gZnJvbSAnLi9jb21wb25lbnRzL0hlbGxvV29ybGQnO1xyXG5pbXBvcnQgeyBSZWFkeSB9IGZyb20gJy4vY29tcG9uZW50cy9VdGlscyc7XHJcbmltcG9ydCB7IFN0aWNreSB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xyXG5cclxuLy8gY29uc29sZS5sb2coYCR7SGVsbG8oKX0gJHtXb3JsZH0gTkFTIEFwcGxpY2F0aW9uYCk7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICBTdGlja3koKTtcclxufVxyXG5cclxuUmVhZHkoc3RhcnQpOyJdfQ==
