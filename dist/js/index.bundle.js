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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ToggleNavigation() {
  // cache DOM
  var mainNav = document.getElementById('js-menu');
  var navBarToggle = document.getElementById('js-navbar-toggle');

  // bind events
  navBarToggle.addEventListener('click', toggleMenu);

  // event handlers
  function toggleMenu() {
    mainNav.classList.toggle('active');
  }
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

exports.ToggleNavigation = ToggleNavigation;
exports.DropdownMenu = DropdownMenu;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
    vehicle = this.getAttribute('data-vehicle');
    document.querySelector('.tab-' + vehicle).style.display = 'block';
    evt.currentTarget.className += ' active';
  }
}

exports.VehicleSelector = VehicleSelector;

},{}],7:[function(require,module,exports){
'use strict';

var _GoodbyeWorld = require('./components/GoodbyeWorld');

var _Screen = require('./components/Screen');

var _Accordion = require('./components/Accordion');

var _CountrySelector = require('./components/CountrySelector');

var _VehicleSelector = require('./components/VehicleSelector');

var _Navigation = require('./components/Navigation');

console.log((0, _GoodbyeWorld.Goodbye)() + ' ' + _GoodbyeWorld.World + ' Index file');

function start() {
  (0, _CountrySelector.CountrySelector)();
  (0, _VehicleSelector.VehicleSelector)();
  (0, _Navigation.ToggleNavigation)();
  (0, _Navigation.DropdownMenu)();
  (0, _Screen.ScrollToTop)();
  (0, _Accordion.Accordion)();
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(start);

},{"./components/Accordion":1,"./components/CountrySelector":2,"./components/GoodbyeWorld":3,"./components/Navigation":4,"./components/Screen":5,"./components/VehicleSelector":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Hb29kYnllV29ybGQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL05hdmlnYXRpb24uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULEdBQTRCO0FBQzFCOztBQUVBLFNBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsUUFBdEI7O0FBRUE7QUFDQSxRQUFJLFFBQVEsS0FBSyxrQkFBakI7QUFDQSxRQUFJLE1BQU0sS0FBTixDQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsSUFBeEI7QUFDQSxZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLEdBQXhCO0FBQ0EsWUFBTSxLQUFOLENBQVksWUFBWixHQUEyQixHQUEzQjtBQUNELEtBSkQsTUFJTztBQUNMLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsTUFBTSxZQUFOLEdBQXFCLElBQTdDO0FB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OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBLFFBQVEsR0FBUixDQUFlLDRCQUFmLFNBQTRCLG1CQUE1Qjs7QUFFQSxTQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQ0UsU0FBUyxXQUFULEdBQ0ksU0FBUyxVQUFULEtBQXdCLFVBRDVCLEdBRUksU0FBUyxVQUFULEtBQXdCLFNBSDlCLEVBSUU7QUFDQTtBQUNELEdBTkQsTUFNTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNLEtBQU4iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgXCJBY2NvcmRpb24uanNcIlxuXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBsZXQgaTtcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcigpIHtcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXG4gICAgbGV0IHBhbmVsID0gdGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgfVxuICB9XG59XG5leHBvcnQgeyBBY2NvcmRpb24gfTtcbiIsImZ1bmN0aW9uIENvdW50cnlTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCB1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX191cCcpO1xuICBsZXQgZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19kb3duJyk7XG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xuICBsZXQgaXRlbUhlaWdodCA9XG4gICAgaXRlbXMgIT0gbnVsbCA/IGl0ZW1zLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcub2Zmc2V0SGVpZ2h0IDogMDtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAodXAgIT0gbnVsbCkge1xuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xuICAgIGRvd24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxEb3duKTtcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXG4gICAgZnVuY3Rpb24gc2Nyb2xsVXAoKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgdXAgYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgZG93biBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wIC09IGl0ZW1IZWlnaHQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IENvdW50cnlTZWxlY3RvciB9O1xuIiwiLy8gbW9kdWxlIFwiR29vZGJ5ZVdvcmxkLmpzXCJcblxuZnVuY3Rpb24gR29vZGJ5ZSgpIHtcbiAgcmV0dXJuICdHb29kYnllJztcbn1cblxuY29uc3QgV29ybGQgPSAnV29ybGQgISEnO1xuXG5leHBvcnQgeyBHb29kYnllLCBXb3JsZCB9O1xuIiwiZnVuY3Rpb24gVG9nZ2xlTmF2aWdhdGlvbigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcbiAgbGV0IG5hdkJhclRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XG5cbiAgLy8gYmluZCBldmVudHNcbiAgbmF2QmFyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XG5cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgICBtYWluTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIERyb3Bkb3duTWVudSgpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBjYXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLWNhcicpO1xuICBsZXQgZHJvcERvd25NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLS1jYXIgLmRyb3Bkb3duLW1lbnUnKTtcblxuICBpZiAoY2FyQnRuICE9IG51bGwgJiYgZHJvcERvd25NZW51ICE9IG51bGwpIHtcbiAgICBsZXQgZHJvcERvd24gPSBjYXJCdG4ucGFyZW50RWxlbWVudDtcbiAgICAvLyBCaW5kIGV2ZW50c1xuICAgIGNhckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhckJ0bkhhbmRsZXIpO1xuXG4gICAgLy8gRXZlbnQgaGFuZGxlcnNcbiAgICBmdW5jdGlvbiBjYXJCdG5IYW5kbGVyKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIC8vIHRvZ2dsZSBkaXNwbGF5XG4gICAgICBpZiAoXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHxcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICcnXG4gICAgICApIHtcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPVxuICAgICAgICAgIGRyb3BEb3duLm9mZnNldEhlaWdodCArIGRyb3BEb3duTWVudS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgVG9nZ2xlTmF2aWdhdGlvbiwgRHJvcGRvd25NZW51IH07XG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3Aoc2Nyb2xsRHVyYXRpb24pIHtcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSAhPSAwKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9LCAxNSk7XG59XG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoc2Nyb2xsRHVyYXRpb24pIHtcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxuICAgIG9sZFRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XG4gICAgc2Nyb2xsQ291bnQgKz0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKTtcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xuICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgIDAsXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcbiAgICApO1xuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICB9XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cbi8qXG4gIEV4cGxhbmF0aW9uczpcbiAgLSBwaSBpcyB0aGUgbGVuZ3RoL2VuZCBwb2ludCBvZiB0aGUgY29zaW51cyBpbnRlcnZhbGwgKHNlZSBhYm92ZSlcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gIC0gbmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wIGVxdWFscyB0aGUgZHVyYXRpb25cblxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXG4gID0gYSAqIGNvcyAoYngpICsgZCAgICAgICAgICAgICAgICAgICAgICAgICAgfCBkIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHkgYXhpcyA9IDEgLT4gb25seSBwb3NpdGl2ZSB5IHZhbHVlc1xuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3Mgc2Nyb2xsQ291bnQgKiB4KVxuKi9cblxuZnVuY3Rpb24gU2Nyb2xsVG9Ub3AoKSB7XG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcbiAgICBiYWNrVG9Ub3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiYWNrVG9Ub3BCdG5IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XG5cbiAgICAvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAzMDApO1xuICB9XG59XG5cbmV4cG9ydCB7IFNjcm9sbFRvVG9wIH07XG4iLCJmdW5jdGlvbiBWZWhpY2xlU2VsZWN0b3IoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgY2FyVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX19jYXInKTtcbiAgbGV0IHZhblRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fdmFuJyk7XG5cbiAgLy8gYmluZCBldmVudHNcbiAgaWYgKGNhclRhYiAhPSBudWxsICYmIHZhblRhYiAhPSBudWxsKSB7XG4gICAgY2FyVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xuICAgIHZhblRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcbiAgfVxuXG4gIC8vIGV2ZW50IGhhbmRsZXJzXG4gIGZ1bmN0aW9uIG9wZW5WZWhpY2xlKGV2dCkge1xuICAgIHZhciBpLCB4LCB0YWJCdXR0b25zO1xuXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXG4gICAgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItY29udGFpbmVyIC50YWInKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXG4gICAgdGFiQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtdGFicyAubmF2LWxpbmsnKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xuICAgIH1cblxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxuICAgIC8vIHNob3cgdGhlIHNlbGVjdGVkIHRhYiBjb250ZW50XG4gICAgdmVoaWNsZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXZlaGljbGUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFiLScgKyB2ZWhpY2xlKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc05hbWUgKz0gJyBhY3RpdmUnO1xuICB9XG59XG5cbmV4cG9ydCB7IFZlaGljbGVTZWxlY3RvciB9O1xuIiwiaW1wb3J0IHsgR29vZGJ5ZSwgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkJztcbmltcG9ydCB7IFNjcmVlbiwgU2Nyb2xsVG9Ub3AgfSBmcm9tICcuL2NvbXBvbmVudHMvU2NyZWVuJztcbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvcmRpb24nO1xuaW1wb3J0IHsgQ291bnRyeVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdW50cnlTZWxlY3Rvcic7XG5pbXBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yJztcbmltcG9ydCB7IFRvZ2dsZU5hdmlnYXRpb24sIERyb3Bkb3duTWVudSB9IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcblxuY29uc29sZS5sb2coYCR7R29vZGJ5ZSgpfSAke1dvcmxkfSBJbmRleCBmaWxlYCk7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBDb3VudHJ5U2VsZWN0b3IoKTtcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XG4gIFRvZ2dsZU5hdmlnYXRpb24oKTtcbiAgRHJvcGRvd25NZW51KCk7XG4gIFNjcm9sbFRvVG9wKCk7XG4gIEFjY29yZGlvbigpO1xufVxuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoXG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnRcbiAgICAgID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuICAgICAgOiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZydcbiAgKSB7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cbnJlYWR5KHN0YXJ0KTtcbiJdfQ==
