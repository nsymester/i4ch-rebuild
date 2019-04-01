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
    var _dropDown = carBtn.parentElement;
    // Bind events
    carBtn.addEventListener('click', carBtnHandler);
  }

  // Event handlers
  function carBtnHandler(evt) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Hb29kYnllV29ybGQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL05hdmlnYXRpb24uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULEdBQTRCO0FBQzFCOztBQUVBLFNBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsUUFBdEI7O0FBRUE7QUFDQSxRQUFJLFFBQVEsS0FBSyxrQkFBakI7QUFDQSxRQUFJLE1BQU0sS0FBTixDQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsSUFBeEI7QUFDQSxZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLEdBQXhCO0FBQ0EsWUFBTSxLQUFOLENBQVksWUFBWixHQUEyQixHQUEzQjtBQUNELEtBSkQsTUFJTztBQUNMLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsTUFBTSxZQUFOLEdBQXFCLElBQTdDO0FB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UUFBUSxHQUFSLENBQWUsNEJBQWYsU0FBNEIsbUJBQTVCOztBQUVBLFNBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUVELFNBQVMsS0FBVCxDQUFlLEVBQWYsRUFBbUI7QUFDakIsTUFDRSxTQUFTLFdBQVQsR0FDSSxTQUFTLFVBQVQsS0FBd0IsVUFENUIsR0FFSSxTQUFTLFVBQVQsS0FBd0IsU0FIOUIsRUFJRTtBQUNBO0FBQ0QsR0FORCxNQU1PO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sS0FBTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIG1vZHVsZSBcIkFjY29yZGlvbi5qc1wiXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBhY2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJ0bicpO1xuXG4gIC8vIEJpbmQgRXZlbnRzXG4gIGxldCBpO1xuICBmb3IgKGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XG4gICAgYWNjW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjb3JkaW9uSGFuZGxlcik7XG4gIH1cblxuICAvLyBFdmVudCBIYW5kbGVyc1xuICBmdW5jdGlvbiBhY2NvcmRpb25IYW5kbGVyKCkge1xuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICBsZXQgcGFuZWwgPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgICB9XG4gIH1cbn1cbmV4cG9ydCB7IEFjY29yZGlvbiB9O1xuIiwiZnVuY3Rpb24gQ291bnRyeVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX3VwJyk7XG4gIGxldCBkb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2Rvd24nKTtcbiAgbGV0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2l0ZW1zJyk7XG4gIGxldCBpdGVtSGVpZ2h0ID1cbiAgICBpdGVtcyAhPSBudWxsID8gaXRlbXMuZmlyc3RDaGlsZC5uZXh0U2libGluZy5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmICh1cCAhPSBudWxsKSB7XG4gICAgdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxVcCk7XG4gICAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbERvd24pO1xuXG4gICAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgICBmdW5jdGlvbiBzY3JvbGxVcCgpIHtcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCB1cCBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wICs9IGl0ZW1IZWlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2Nyb2xsRG93bigpIHtcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCBkb3duIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XG4gICAgICBpdGVtcy5zY3JvbGxUb3AgLT0gaXRlbUhlaWdodDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgQ291bnRyeVNlbGVjdG9yIH07XG4iLCIvLyBtb2R1bGUgXCJHb29kYnllV29ybGQuanNcIlxuXG5mdW5jdGlvbiBHb29kYnllKCkge1xuICByZXR1cm4gJ0dvb2RieWUnO1xufVxuXG5jb25zdCBXb3JsZCA9ICdXb3JsZCAhISc7XG5cbmV4cG9ydCB7IEdvb2RieWUsIFdvcmxkIH07XG4iLCJmdW5jdGlvbiBUb2dnbGVOYXZpZ2F0aW9uKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IG1haW5OYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbWVudScpO1xuICBsZXQgbmF2QmFyVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBuYXZCYXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNZW51KTtcblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgIG1haW5OYXYuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gRHJvcGRvd25NZW51KCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY2FyJyk7XG4gIGxldCBkcm9wRG93bk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tLWNhciAuZHJvcGRvd24tbWVudScpO1xuXG4gIGlmIChjYXJCdG4gIT0gbnVsbCAmJiBkcm9wRG93bk1lbnUgIT0gbnVsbCkge1xuICAgIGxldCBkcm9wRG93biA9IGNhckJ0bi5wYXJlbnRFbGVtZW50O1xuICAgIC8vIEJpbmQgZXZlbnRzXG4gICAgY2FyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyQnRuSGFuZGxlcik7XG4gIH1cblxuICAvLyBFdmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiBjYXJCdG5IYW5kbGVyKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIC8vIHRvZ2dsZSBkaXNwbGF5XG4gICAgaWYgKFxuICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxuICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICcnXG4gICAgKSB7XG4gICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPVxuICAgICAgICBkcm9wRG93bi5vZmZzZXRIZWlnaHQgKyBkcm9wRG93bk1lbnUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IFRvZ2dsZU5hdmlnYXRpb24sIERyb3Bkb3duTWVudSB9O1xuIiwiLy8gbW9kdWxlIFwiU2NyZWVuLmpzXCJcblxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wKHNjcm9sbER1cmF0aW9uKSB7XG4gIHZhciBzY3JvbGxTdGVwID0gLXdpbmRvdy5zY3JvbGxZIC8gKHNjcm9sbER1cmF0aW9uIC8gMTUpLFxuICAgIHNjcm9sbEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAod2luZG93LnNjcm9sbFkgIT0gMCkge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgc2Nyb2xsU3RlcCk7XG4gICAgICB9IGVsc2UgY2xlYXJJbnRlcnZhbChzY3JvbGxJbnRlcnZhbCk7XG4gICAgfSwgMTUpO1xufVxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KHNjcm9sbER1cmF0aW9uKSB7XG4gIGNvbnN0IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMjtcbiAgbGV0IHNjcm9sbENvdW50ID0gMCxcbiAgICBvbGRUaW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICBmdW5jdGlvbiBzdGVwKG5ld1RpbWVzdGFtcCkge1xuICAgIHNjcm9sbENvdW50ICs9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyAobmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wKSk7XG4gICAgaWYgKHNjcm9sbENvdW50ID49IE1hdGguUEkpIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICBpZiAod2luZG93LnNjcm9sbFkgPT09IDApIHJldHVybjtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oXG4gICAgICAwLFxuICAgICAgTWF0aC5yb3VuZChjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiBNYXRoLmNvcyhzY3JvbGxDb3VudCkpXG4gICAgKTtcbiAgICBvbGRUaW1lc3RhbXAgPSBuZXdUaW1lc3RhbXA7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbiAgfVxuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG59XG4vKlxuICBFeHBsYW5hdGlvbnM6XG4gIC0gcGkgaXMgdGhlIGxlbmd0aC9lbmQgcG9pbnQgb2YgdGhlIGNvc2ludXMgaW50ZXJ2YWxsIChzZWUgYWJvdmUpXG4gIC0gbmV3VGltZXN0YW1wIGluZGljYXRlcyB0aGUgY3VycmVudCB0aW1lIHdoZW4gY2FsbGJhY2tzIHF1ZXVlZCBieSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmVnaW4gdG8gZmlyZS5cbiAgICAoZm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cvcmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAtIG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCBlcXVhbHMgdGhlIGR1cmF0aW9uXG5cbiAgICBhICogY29zIChieCArIGMpICsgZCAgICAgICAgICAgICAgICAgICAgICB8IGMgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeCBheGlzID0gMFxuICA9IGEgKiBjb3MgKGJ4KSArIGQgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZCB0cmFuc2xhdGVzIGFsb25nIHRoZSB5IGF4aXMgPSAxIC0+IG9ubHkgcG9zaXRpdmUgeSB2YWx1ZXNcbiAgPSBhICogY29zIChieCkgKyAxICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEgc3RyZXRjaGVzIGFsb25nIHRoZSB5IGF4aXMgPSBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDJcbiAgPSBjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiAoY29zIGJ4KSAgICB8IGIgc3RyZXRjaGVzIGFsb25nIHRoZSB4IGF4aXMgPSBzY3JvbGxDb3VudCA9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyAobmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wKSlcbiAgPSBjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiAoY29zIHNjcm9sbENvdW50ICogeClcbiovXG5cbmZ1bmN0aW9uIFNjcm9sbFRvVG9wKCkge1xuICAvLyBDYWNoZSBET01cbiAgY29uc3QgYmFja1RvVG9wQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWJhY2stdG8tdG9wJyk7XG5cbiAgLy8gQmluZCBFdmVudHNcbiAgaWYgKGJhY2tUb1RvcEJ0biAhPSBudWxsKSB7XG4gICAgYmFja1RvVG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYmFja1RvVG9wQnRuSGFuZGxlcik7XG4gIH1cblxuICAvLyBFdmVudCBIYW5kbGVyc1xuICBmdW5jdGlvbiBiYWNrVG9Ub3BCdG5IYW5kbGVyKGV2dCkge1xuICAgIC8vIEFuaW1hdGUgdGhlIHNjcm9sbCB0byB0b3BcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KDEwMDApO1xuXG4gICAgLy8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMzAwKTtcbiAgfVxufVxuXG5leHBvcnQgeyBTY3JvbGxUb1RvcCB9O1xuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhclRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fY2FyJyk7XG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xuICAgIGNhclRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcbiAgICB2YW5UYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gIH1cblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcbiAgICB2YXIgaSwgeCwgdGFiQnV0dG9ucztcblxuICAgIC8vIGhpZGUgYWxsIHRhYiBjb250ZW50c1xuICAgIHggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLWNvbnRhaW5lciAudGFiJyk7XG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIHhbaV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgdGhlIGhpZ2hsaWdodCBvbiB0aGUgdGFiIGJ1dHRvblxuICAgIHRhYkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LXRhYnMgLm5hdi1saW5rJyk7XG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lID0gdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUucmVwbGFjZSgnIGFjdGl2ZScsICcnKTtcbiAgICB9XG5cbiAgICAvLyBoaWdobGlnaHQgdGFiIGJ1dHRvbiBhbmRcbiAgICAvLyBzaG93IHRoZSBzZWxlY3RlZCB0YWIgY29udGVudFxuICAgIHZlaGljbGUgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS12ZWhpY2xlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi0nICsgdmVoaWNsZSkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcbiAgfVxufVxuXG5leHBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfTtcbiIsImltcG9ydCB7IEdvb2RieWUsIFdvcmxkIH0gZnJvbSAnLi9jb21wb25lbnRzL0dvb2RieWVXb3JsZCc7XG5pbXBvcnQgeyBTY3JlZW4sIFNjcm9sbFRvVG9wIH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uJztcbmltcG9ydCB7IENvdW50cnlTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3InO1xuaW1wb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL1ZlaGljbGVTZWxlY3Rvcic7XG5pbXBvcnQgeyBUb2dnbGVOYXZpZ2F0aW9uLCBEcm9wZG93bk1lbnUgfSBmcm9tICcuL2NvbXBvbmVudHMvTmF2aWdhdGlvbic7XG5cbmNvbnNvbGUubG9nKGAke0dvb2RieWUoKX0gJHtXb3JsZH0gSW5kZXggZmlsZWApO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgQ291bnRyeVNlbGVjdG9yKCk7XG4gIFZlaGljbGVTZWxlY3RvcigpO1xuICBUb2dnbGVOYXZpZ2F0aW9uKCk7XG4gIERyb3Bkb3duTWVudSgpO1xuICBTY3JvbGxUb1RvcCgpO1xuICBBY2NvcmRpb24oKTtcbn1cblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKFxuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXG4gICkge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5yZWFkeShzdGFydCk7XG4iXX0=
