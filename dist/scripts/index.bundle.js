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
  (0, _Screen.WindowWidth)();

  //Docs
  $('.revealdocs').click(function (e) {
    e.preventDefault();
    var on = $('.docs').is(':visible');
    $(this).html(on ? 'View policy documentation' : 'Hide policy documentation');
    $('.docs').slideToggle();
  });

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

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(start);

},{"./components/Accordion":1,"./components/CountrySelector":2,"./components/GoodbyeWorld":3,"./components/Navigation":4,"./components/Screen":5,"./components/VehicleSelector":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Hb29kYnllV29ybGQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL05hdmlnYXRpb24uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCOztBQUVBLFFBQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxRQUFuQzs7QUFFQTtBQUNBLFFBQUksUUFBUSxJQUFJLGFBQUosQ0FBa0Isa0JBQTlCO0FBQ0EsUUFBSSxNQUFNLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLElBQXhCO0FBQ0EsWUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLFlBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxLQUpELE1BSU87QUFDTCxZQUFNLEtBQU4sQ0FB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QUFOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbW9kdWxlIFwiQWNjb3JkaW9uLmpzXCJcclxuXHJcbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBsZXQgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIC8vIEV2ZW50IEhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcclxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXHJcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cclxuICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcclxuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCB7IEFjY29yZGlvbiB9O1xyXG4iLCJmdW5jdGlvbiBDb3VudHJ5U2VsZWN0b3IoKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX3VwJyk7XHJcbiAgbGV0IGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9fZG93bicpO1xyXG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xyXG4gIGxldCBpdGVtSGVpZ2h0ID1cclxuICAgIGl0ZW1zICE9IG51bGwgPyBpdGVtcy5maXJzdENoaWxkLm5leHRTaWJsaW5nLm9mZnNldEhlaWdodCA6IDA7XHJcblxyXG4gIC8vIGJpbmQgZXZlbnRzXHJcbiAgaWYgKHVwICE9IG51bGwpIHtcclxuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xyXG4gICAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbERvd24pO1xyXG5cclxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxVcCgpIHtcclxuICAgICAgLy8gbW92ZSBpdGVtcyBsaXN0IHVwIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XHJcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XHJcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCBkb3duIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XHJcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCAtPSBpdGVtSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgQ291bnRyeVNlbGVjdG9yIH07XHJcbiIsIi8vIG1vZHVsZSBcIkdvb2RieWVXb3JsZC5qc1wiXHJcblxyXG5mdW5jdGlvbiBHb29kYnllKCkge1xyXG4gIHJldHVybiAnR29vZGJ5ZSc7XHJcbn1cclxuXHJcbmNvbnN0IFdvcmxkID0gJ1dvcmxkICEhJztcclxuXHJcbmV4cG9ydCB7IEdvb2RieWUsIFdvcmxkIH07XHJcbiIsImZ1bmN0aW9uIFRvZ2dsZU5hdmlnYXRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IG1haW5OYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbWVudScpO1xyXG4gIGxldCBuYXZCYXJUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIG5hdkJhclRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU1lbnUpO1xyXG5cclxuICAvLyBldmVudCBoYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XHJcbiAgICBtYWluTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gRHJvcGRvd25NZW51KCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBjYXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLWNhcicpO1xyXG4gIGxldCBkcm9wRG93bk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tLWNhciAuZHJvcGRvd24tbWVudScpO1xyXG5cclxuICBpZiAoY2FyQnRuICE9IG51bGwgJiYgZHJvcERvd25NZW51ICE9IG51bGwpIHtcclxuICAgIGxldCBkcm9wRG93biA9IGNhckJ0bi5wYXJlbnRFbGVtZW50O1xyXG4gICAgLy8gQmluZCBldmVudHNcclxuICAgIGNhckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhckJ0bkhhbmRsZXIpO1xyXG5cclxuICAgIC8vIEV2ZW50IGhhbmRsZXJzXHJcbiAgICBmdW5jdGlvbiBjYXJCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgLy8gdG9nZ2xlIGRpc3BsYXlcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHxcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJydcclxuICAgICAgKSB7XHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9XHJcbiAgICAgICAgICBkcm9wRG93bi5vZmZzZXRIZWlnaHQgKyBkcm9wRG93bk1lbnUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFRvZ2dsZU5hdmlnYXRpb24sIERyb3Bkb3duTWVudSB9O1xyXG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wKHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXHJcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAod2luZG93LnNjcm9sbFkgIT0gMCkge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcclxuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xyXG4gICAgfSwgMTUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KHNjcm9sbER1cmF0aW9uKSB7XHJcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xyXG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXHJcbiAgICBvbGRUaW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcclxuICAgIHNjcm9sbENvdW50ICs9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyAobmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wKSk7XHJcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oXHJcbiAgICAgIDAsXHJcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxyXG4gICAgKTtcclxuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG59XHJcbi8qXHJcbiAgRXhwbGFuYXRpb25zOlxyXG4gIC0gcGkgaXMgdGhlIGxlbmd0aC9lbmQgcG9pbnQgb2YgdGhlIGNvc2ludXMgaW50ZXJ2YWxsIChzZWUgYWJvdmUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxyXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcclxuICAtIG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCBlcXVhbHMgdGhlIGR1cmF0aW9uXHJcblxyXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcclxuICA9IGEgKiBjb3MgKGJ4KSArIGQgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZCB0cmFuc2xhdGVzIGFsb25nIHRoZSB5IGF4aXMgPSAxIC0+IG9ubHkgcG9zaXRpdmUgeSB2YWx1ZXNcclxuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXHJcbiAgPSBjb3NQYXJhbWV0ZXIgKyBjb3NQYXJhbWV0ZXIgKiAoY29zIHNjcm9sbENvdW50ICogeClcclxuKi9cclxuXHJcbmZ1bmN0aW9uIFNjcm9sbFRvVG9wKCkge1xyXG4gIC8vIENhY2hlIERPTVxyXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xyXG5cclxuICAvLyBCaW5kIEV2ZW50c1xyXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xyXG4gICAgYmFja1RvVG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYmFja1RvVG9wQnRuSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XHJcblxyXG4gICAgLy8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMzAwKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xyXG4gIGNvbnNvbGUubG9nKCdXaW5kb3dXaWR0aCcpO1xyXG5cclxuICAvLyBjYWNoZSBET01cclxuICBjb25zdCBhY2NvcmRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcuY2FyZC1wcm9kdWN0cyAuYWNjb3JkaW9uLWJ0bidcclxuICApO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgdyA9XHJcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgaWYgKHcgPiAxMjAwKSB7XHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHcgPD0gMTIwMCkge1xyXG4gICAgICBsZXQgaTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfTtcclxuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBjYXJUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX2NhcicpO1xyXG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xyXG4gICAgY2FyVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xyXG4gICAgdmFuVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcclxuICAgIHZhciBpLCB4LCB0YWJCdXR0b25zO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGV2dCk7XHJcblxyXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXHJcbiAgICB4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1jb250YWluZXIgLnRhYicpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXHJcbiAgICB0YWJCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi10YWJzIC5uYXYtbGluaycpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxyXG4gICAgLy8gc2hvdyB0aGUgc2VsZWN0ZWQgdGFiIGNvbnRlbnRcclxuICAgIGxldCB2ZWhpY2xlID0gZXZ0LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZlaGljbGUnKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItJyArIHZlaGljbGUpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFZlaGljbGVTZWxlY3RvciB9O1xyXG4iLCJpbXBvcnQgeyBHb29kYnllLCBXb3JsZCB9IGZyb20gJy4vY29tcG9uZW50cy9Hb29kYnllV29ybGQnO1xyXG5pbXBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfSBmcm9tICcuL2NvbXBvbmVudHMvU2NyZWVuJztcclxuaW1wb3J0IHsgQWNjb3JkaW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbic7XHJcbmltcG9ydCB7IENvdW50cnlTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3InO1xyXG5pbXBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yJztcclxuaW1wb3J0IHsgVG9nZ2xlTmF2aWdhdGlvbiwgRHJvcGRvd25NZW51IH0gZnJvbSAnLi9jb21wb25lbnRzL05hdmlnYXRpb24nO1xyXG5cclxuY29uc29sZS5sb2coYCR7R29vZGJ5ZSgpfSAke1dvcmxkfSBJbmRleCBmaWxlYCk7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICBDb3VudHJ5U2VsZWN0b3IoKTtcclxuICBWZWhpY2xlU2VsZWN0b3IoKTtcclxuICBUb2dnbGVOYXZpZ2F0aW9uKCk7XHJcbiAgRHJvcGRvd25NZW51KCk7XHJcbiAgU2Nyb2xsVG9Ub3AoKTtcclxuICBBY2NvcmRpb24oKTtcclxuICBXaW5kb3dXaWR0aCgpO1xyXG5cclxuICAvL0RvY3NcclxuICAkKCcucmV2ZWFsZG9jcycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBvbiA9ICQoJy5kb2NzJykuaXMoJzp2aXNpYmxlJyk7XHJcbiAgICAkKHRoaXMpLmh0bWwoXHJcbiAgICAgIG9uID8gJ1ZpZXcgcG9saWN5IGRvY3VtZW50YXRpb24nIDogJ0hpZGUgcG9saWN5IGRvY3VtZW50YXRpb24nXHJcbiAgICApO1xyXG4gICAgJCgnLmRvY3MnKS5zbGlkZVRvZ2dsZSgpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5jbGljayhmdW5jdGlvbihldnQpIHtcclxuICAgICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgJChlbGVtZW50KS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cclxuICAgIC8vIHNob3cgcG9saWN5IHN1bW1hcnlcclxuICAgICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHBvbGljeVN1bW1hcnkgPSAkKHRoaXMpLmRhdGEoJ3BvbGljeScpO1xyXG4gICAgJCgnLicgKyBwb2xpY3lTdW1tYXJ5KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcclxuICBpZiAoXHJcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxyXG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcclxuICAgICAgOiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZydcclxuICApIHtcclxuICAgIGZuKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XHJcbiAgfVxyXG59XHJcblxyXG5yZWFkeShzdGFydCk7XHJcbiJdfQ==
