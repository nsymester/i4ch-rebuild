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
// module "ScrollTo.js"

function ScrollTo() {
  // cache DOM
  // Select all links with hashes
  // Remove links that don't actually link to anything
  var anchors = $('a[href*="#"]').not('[href="#"]').not('[href="#0"]');

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
          scrollTop: target.offset().top - 20
        }, 1000, function () {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          //$target.focus();
          // if ($target.is(":focus")) { // Checking if the target was focused
          //   return false;
          // } else {
          //   $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
          //   $target.focus(); // Set focus again
          //};
        });
      }
    }
  }
}

exports.ScrollTo = ScrollTo;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var _GoodbyeWorld = require('./components/GoodbyeWorld');

var _Screen = require('./components/Screen');

var _Accordion = require('./components/Accordion');

var _CountrySelector = require('./components/CountrySelector');

var _VehicleSelector = require('./components/VehicleSelector');

var _Navigation = require('./components/Navigation');

var _ScrollTo = require('./components/ScrollTo');

console.log((0, _GoodbyeWorld.Goodbye)() + ' ' + _GoodbyeWorld.World + ' Index file');

function start() {
  (0, _CountrySelector.CountrySelector)();
  (0, _VehicleSelector.VehicleSelector)();
  (0, _Navigation.ToggleNavigation)();
  (0, _Navigation.DropdownMenu)();
  (0, _Screen.ScrollToTop)();
  (0, _Accordion.Accordion)();
  (0, _Screen.WindowWidth)();
  (0, _ScrollTo.ScrollTo)();

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

  $('.tab-car .btn').click(function (evt) {
    evt.preventDefault();
    return false;
  });

  $('.tab-car .icon-radio input[type="radio"]').click(function (evt) {
    $('.tab-car .btn').removeClass('btn-cta--disabled');
    $('.tab-car .btn').addClass('btn-cta');
    $('.tab-car .btn').unbind();
  });

  var coverOptions = [];
  // get price
  if ($('.card-cover-option')) {
    $('.card-cover-option').each(function (index, element) {
      coverOptions.push({
        name: $('.inner .card-title ', element).text(),
        cost: $('.inner .card-price .amount', element).text()
      });
    });
  }

  $('.product-options-days-cover').change(function (evt) {
    var parentClass = $(this).parent().parent().parent().attr('class').split(' ');

    var coverOptionPrice = coverOptions.filter(function (coverOption) {
      return coverOption.name == $('.' + parentClass[2] + ' .inner .card-title').text();
    });

    $('.' + parentClass[2] + ' .inner .card-price .amount').text(parseFloat(coverOptionPrice[0].cost * evt.currentTarget.value) <= 0 ? coverOptionPrice[0].cost : parseFloat(coverOptionPrice[0].cost * evt.currentTarget.value).toFixed(2));
  });

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
        console.log('error: ', _error);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate('.accordion-btn', 'click', function (evt) {
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
    });
  }

  // on scroll
  var target = $('.article-main').offset().top - 180;
  $(document).scroll(function () {
    if ($(window).scrollTop() >= target) {
      $('.share-buttons').show();
    } else {
      $('.share-buttons').hide();
    }
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

},{"./components/Accordion":1,"./components/CountrySelector":2,"./components/GoodbyeWorld":3,"./components/Navigation":4,"./components/Screen":5,"./components/ScrollTo":6,"./components/VehicleSelector":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Hb29kYnllV29ybGQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL05hdmlnYXRpb24uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvU2Nyb2xsVG8uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1ZlaGljbGVTZWxlY3Rvci5qcyIsInNyYy9zY3JpcHRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7QUFFQSxTQUFTLFNBQVQsR0FBcUI7QUFDbkI7QUFDQSxNQUFJLE1BQU0sU0FBUyxnQkFBVCxDQUEwQixnQkFBMUIsQ0FBVjs7QUFFQTtBQUNBLE1BQUksVUFBSjtBQUNBLE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxJQUFJLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLFFBQUksQ0FBSixFQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLGdCQUFqQztBQUNEOztBQUVEO0FBQ0EsV0FBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQjtBQUM3Qjs7QUFFQSxRQUFJLGFBQUosQ0FBa0IsU0FBbEIsQ0FBNEIsTUFBNUIsQ0FBbUMsUUFBbkM7O0FBRUE7QUFDQSxRQUFJLFFBQVEsSUFBSSxhQUFKLENBQWtCLGtCQUE5QjtBQUNBLFFBQUksTUFBTSxLQUFOLENBQVksU0FBaEIsRUFBMkI7QUFDekIsWUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixJQUF4QjtBQUNBLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsR0FBeEI7QUFDQSxZQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLEdB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QUFOLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLGNBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxPQUpELE1BSU87QUFDTCxjQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE1BQU0sWUFBTixHQUFxQixJQUE3QztBQUNBLGNBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxjQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLE1BQTNCO0FBQ0Q7QUFDRixLQW5CSDtBQXFCRDs7QUFFRDtBQUNBLE1BQUksU0FBUyxFQUFFLGVBQUYsRUFBbUIsTUFBbkIsR0FBNEIsR0FBNUIsR0FBa0MsR0FBL0M7QUFDQSxJQUFFLFFBQUYsRUFBWSxNQUFaLENBQW1CLFlBQVc7QUFDNUIsUUFBSSxFQUFFLE1BQUYsRUFBVSxTQUFWLE1BQXlCLE1BQTdCLEVBQXFDO0FBQ25DLFFBQUUsZ0JBQUYsRUFBb0IsSUFBcEI7QUFDRCxLQUZELE1BRU87QUFDTCxRQUFFLGdCQUFGLEVBQW9CLElBQXBCO0FBQ0Q7QUFDRixHQU5EO0FBT0Q7O0FBRUQsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUNFLFNBQVMsV0FBVCxHQUNJLFNBQVMsVUFBVCxLQUF3QixVQUQ1QixHQUVJLFNBQVMsVUFBVCxLQUF3QixTQUg5QixFQUlFO0FBQ0E7QUFDRCxHQU5ELE1BTU87QUFDTCxhQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxFQUE5QztBQUNEO0FBQ0Y7O0FBRUQsTUFBTSxLQUFOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbW9kdWxlIFwiQWNjb3JkaW9uLmpzXCJcblxuZnVuY3Rpb24gQWNjb3JkaW9uKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYnRuJyk7XG5cbiAgLy8gQmluZCBFdmVudHNcbiAgbGV0IGk7XG4gIGZvciAoaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGFjY29yZGlvbkhhbmRsZXIoZXZ0KSB7XG4gICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgfVxuICB9XG59XG5leHBvcnQgeyBBY2NvcmRpb24gfTtcbiIsImZ1bmN0aW9uIENvdW50cnlTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCB1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX191cCcpO1xuICBsZXQgZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19kb3duJyk7XG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xuICBsZXQgaXRlbUhlaWdodCA9XG4gICAgaXRlbXMgIT0gbnVsbCA/IGl0ZW1zLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcub2Zmc2V0SGVpZ2h0IDogMDtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAodXAgIT0gbnVsbCkge1xuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xuICAgIGRvd24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxEb3duKTtcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXG4gICAgZnVuY3Rpb24gc2Nyb2xsVXAoKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgdXAgYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgZG93biBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wIC09IGl0ZW1IZWlnaHQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IENvdW50cnlTZWxlY3RvciB9O1xuIiwiLy8gbW9kdWxlIFwiR29vZGJ5ZVdvcmxkLmpzXCJcblxuZnVuY3Rpb24gR29vZGJ5ZSgpIHtcbiAgcmV0dXJuICdHb29kYnllJztcbn1cblxuY29uc3QgV29ybGQgPSAnV29ybGQgISEnO1xuXG5leHBvcnQgeyBHb29kYnllLCBXb3JsZCB9O1xuIiwiZnVuY3Rpb24gVG9nZ2xlTmF2aWdhdGlvbigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcbiAgbGV0IG5hdkJhclRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1uYXZiYXItdG9nZ2xlJyk7XG5cbiAgLy8gYmluZCBldmVudHNcbiAgbmF2QmFyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XG5cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgICBtYWluTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIERyb3Bkb3duTWVudSgpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBjYXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLWNhcicpO1xuICBsZXQgZHJvcERvd25NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLS1jYXIgLmRyb3Bkb3duLW1lbnUnKTtcblxuICBpZiAoY2FyQnRuICE9IG51bGwgJiYgZHJvcERvd25NZW51ICE9IG51bGwpIHtcbiAgICBsZXQgZHJvcERvd24gPSBjYXJCdG4ucGFyZW50RWxlbWVudDtcbiAgICAvLyBCaW5kIGV2ZW50c1xuICAgIGNhckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhckJ0bkhhbmRsZXIpO1xuXG4gICAgLy8gRXZlbnQgaGFuZGxlcnNcbiAgICBmdW5jdGlvbiBjYXJCdG5IYW5kbGVyKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIC8vIHRvZ2dsZSBkaXNwbGF5XG4gICAgICBpZiAoXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHxcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICcnXG4gICAgICApIHtcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPVxuICAgICAgICAgIGRyb3BEb3duLm9mZnNldEhlaWdodCArIGRyb3BEb3duTWVudS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgVG9nZ2xlTmF2aWdhdGlvbiwgRHJvcGRvd25NZW51IH07XG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3Aoc2Nyb2xsRHVyYXRpb24pIHtcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSAhPSAwKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9LCAxNSk7XG59XG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoc2Nyb2xsRHVyYXRpb24pIHtcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxuICAgIG9sZFRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XG4gICAgc2Nyb2xsQ291bnQgKz0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKTtcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xuICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgIDAsXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcbiAgICApO1xuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICB9XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cbi8qXG4gIEV4cGxhbmF0aW9uczpcbiAgLSBwaSBpcyB0aGUgbGVuZ3RoL2VuZCBwb2ludCBvZiB0aGUgY29zaW51cyBpbnRlcnZhbGwgKHNlZSBhYm92ZSlcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gIC0gbmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wIGVxdWFscyB0aGUgZHVyYXRpb25cblxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXG4gID0gYSAqIGNvcyAoYngpICsgZCAgICAgICAgICAgICAgICAgICAgICAgICAgfCBkIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHkgYXhpcyA9IDEgLT4gb25seSBwb3NpdGl2ZSB5IHZhbHVlc1xuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3Mgc2Nyb2xsQ291bnQgKiB4KVxuKi9cblxuZnVuY3Rpb24gU2Nyb2xsVG9Ub3AoKSB7XG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcbiAgICBiYWNrVG9Ub3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiYWNrVG9Ub3BCdG5IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XG5cbiAgICAvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAzMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xuICBjb25zb2xlLmxvZygnV2luZG93V2lkdGgnKTtcblxuICAvLyBjYWNoZSBET01cbiAgY29uc3QgYWNjb3JkaW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xuICApO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdyA9XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgIGlmICh3ID4gMTIwMCkge1xuICAgICAgbGV0IGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodyA8PSAxMjAwKSB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9O1xuIiwiLy8gbW9kdWxlIFwiU2Nyb2xsVG8uanNcIlxuXG5mdW5jdGlvbiBTY3JvbGxUbygpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIC8vIFNlbGVjdCBhbGwgbGlua3Mgd2l0aCBoYXNoZXNcbiAgLy8gUmVtb3ZlIGxpbmtzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgbGluayB0byBhbnl0aGluZ1xuICBsZXQgYW5jaG9ycyA9ICQoJ2FbaHJlZio9XCIjXCJdJylcbiAgICAubm90KCdbaHJlZj1cIiNcIl0nKVxuICAgIC5ub3QoJ1tocmVmPVwiIzBcIl0nKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBhbmNob3JzLmNsaWNrKGFuY2hvcnNIYW5kbGVyKTtcblxuICAvLyBFdmVudCBIYW5kbGVyc1xuICBmdW5jdGlvbiBhbmNob3JzSGFuZGxlcihldmVudCkge1xuICAgIC8vIE9uLXBhZ2UgbGlua3NcbiAgICBpZiAoXG4gICAgICBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpID09XG4gICAgICAgIHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSAmJlxuICAgICAgbG9jYXRpb24uaG9zdG5hbWUgPT0gdGhpcy5ob3N0bmFtZVxuICAgICkge1xuICAgICAgLy8gRmlndXJlIG91dCBlbGVtZW50IHRvIHNjcm9sbCB0b1xuICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5oYXNoKTtcbiAgICAgIHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsgJ10nKTtcbiAgICAgIC8vIERvZXMgYSBzY3JvbGwgdGFyZ2V0IGV4aXN0P1xuICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcbiAgICAgICAgLy8gT25seSBwcmV2ZW50IGRlZmF1bHQgaWYgYW5pbWF0aW9uIGlzIGFjdHVhbGx5IGdvbm5hIGhhcHBlblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZShcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3AgLSAyMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgMTAwMCxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gTXVzdCBjaGFuZ2UgZm9jdXMhXG4gICAgICAgICAgICB2YXIgJHRhcmdldCA9ICQodGFyZ2V0KTtcbiAgICAgICAgICAgIC8vJHRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgLy8gaWYgKCR0YXJnZXQuaXMoXCI6Zm9jdXNcIikpIHsgLy8gQ2hlY2tpbmcgaWYgdGhlIHRhcmdldCB3YXMgZm9jdXNlZFxuICAgICAgICAgICAgLy8gICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAkdGFyZ2V0LmF0dHIoJ3RhYmluZGV4JywnLTEnKTsgLy8gQWRkaW5nIHRhYmluZGV4IGZvciBlbGVtZW50cyBub3QgZm9jdXNhYmxlXG4gICAgICAgICAgICAvLyAgICR0YXJnZXQuZm9jdXMoKTsgLy8gU2V0IGZvY3VzIGFnYWluXG4gICAgICAgICAgICAvL307XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBTY3JvbGxUbyB9O1xuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhclRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fY2FyJyk7XG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xuICAgIGNhclRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcbiAgICB2YW5UYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gIH1cblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcbiAgICB2YXIgaSwgeCwgdGFiQnV0dG9ucztcblxuICAgIGNvbnNvbGUubG9nKGV2dCk7XG5cbiAgICAvLyBoaWRlIGFsbCB0YWIgY29udGVudHNcbiAgICB4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1jb250YWluZXIgLnRhYicpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB4W2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHRoZSBoaWdobGlnaHQgb24gdGhlIHRhYiBidXR0b25cbiAgICB0YWJCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi10YWJzIC5uYXYtbGluaycpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZSA9IHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lLnJlcGxhY2UoJyBhY3RpdmUnLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gaGlnaGxpZ2h0IHRhYiBidXR0b24gYW5kXG4gICAgLy8gc2hvdyB0aGUgc2VsZWN0ZWQgdGFiIGNvbnRlbnRcbiAgICBsZXQgdmVoaWNsZSA9IGV2dC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12ZWhpY2xlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi0nICsgdmVoaWNsZSkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcbiAgfVxufVxuXG5leHBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfTtcbiIsImltcG9ydCB7IEdvb2RieWUsIFdvcmxkIH0gZnJvbSAnLi9jb21wb25lbnRzL0dvb2RieWVXb3JsZCc7XG5pbXBvcnQgeyBTY3JvbGxUb1RvcCwgV2luZG93V2lkdGggfSBmcm9tICcuL2NvbXBvbmVudHMvU2NyZWVuJztcbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvcmRpb24nO1xuaW1wb3J0IHsgQ291bnRyeVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdW50cnlTZWxlY3Rvcic7XG5pbXBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yJztcbmltcG9ydCB7IFRvZ2dsZU5hdmlnYXRpb24sIERyb3Bkb3duTWVudSB9IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcbmltcG9ydCB7IFNjcm9sbFRvIH0gZnJvbSAnLi9jb21wb25lbnRzL1Njcm9sbFRvJztcblxuY29uc29sZS5sb2coYCR7R29vZGJ5ZSgpfSAke1dvcmxkfSBJbmRleCBmaWxlYCk7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBDb3VudHJ5U2VsZWN0b3IoKTtcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XG4gIFRvZ2dsZU5hdmlnYXRpb24oKTtcbiAgRHJvcGRvd25NZW51KCk7XG4gIFNjcm9sbFRvVG9wKCk7XG4gIEFjY29yZGlvbigpO1xuICBXaW5kb3dXaWR0aCgpO1xuICBTY3JvbGxUbygpO1xuXG4gIC8vRG9jc1xuICAkKCcucmV2ZWFsZG9jcycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIG9uID0gJCgnLmRvY3MnKS5pcygnOnZpc2libGUnKTtcbiAgICAkKHRoaXMpLmh0bWwoXG4gICAgICBvbiA/ICdWaWV3IHBvbGljeSBkb2N1bWVudGF0aW9uJyA6ICdIaWRlIHBvbGljeSBkb2N1bWVudGF0aW9uJ1xuICAgICk7XG4gICAgJCgnLmRvY3MnKS5zbGlkZVRvZ2dsZSgpO1xuICB9KTtcblxuICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfSk7XG5cbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgJChlbGVtZW50KS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICAvLyBzaG93IHBvbGljeSBzdW1tYXJ5XG4gICAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICB9KTtcbiAgICBsZXQgcG9saWN5U3VtbWFyeSA9ICQodGhpcykuZGF0YSgncG9saWN5Jyk7XG4gICAgJCgnLicgKyBwb2xpY3lTdW1tYXJ5KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgfSk7XG5cbiAgJCgnLnRhYi1jYXIgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgJCgnLnRhYi1jYXIgLmljb24tcmFkaW8gaW5wdXRbdHlwZT1cInJhZGlvXCJdJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tY3RhLS1kaXNhYmxlZCcpO1xuICAgICQoJy50YWItY2FyIC5idG4nKS5hZGRDbGFzcygnYnRuLWN0YScpO1xuICAgICQoJy50YWItY2FyIC5idG4nKS51bmJpbmQoKTtcbiAgfSk7XG5cbiAgbGV0IGNvdmVyT3B0aW9ucyA9IFtdO1xuICAvLyBnZXQgcHJpY2VcbiAgaWYgKCQoJy5jYXJkLWNvdmVyLW9wdGlvbicpKSB7XG4gICAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgY292ZXJPcHRpb25zLnB1c2goe1xuICAgICAgICBuYW1lOiAkKCcuaW5uZXIgLmNhcmQtdGl0bGUgJywgZWxlbWVudCkudGV4dCgpLFxuICAgICAgICBjb3N0OiAkKCcuaW5uZXIgLmNhcmQtcHJpY2UgLmFtb3VudCcsIGVsZW1lbnQpLnRleHQoKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAkKCcucHJvZHVjdC1vcHRpb25zLWRheXMtY292ZXInKS5jaGFuZ2UoZnVuY3Rpb24oZXZ0KSB7XG4gICAgbGV0IHBhcmVudENsYXNzID0gJCh0aGlzKVxuICAgICAgLnBhcmVudCgpXG4gICAgICAucGFyZW50KClcbiAgICAgIC5wYXJlbnQoKVxuICAgICAgLmF0dHIoJ2NsYXNzJylcbiAgICAgIC5zcGxpdCgnICcpO1xuXG4gICAgbGV0IGNvdmVyT3B0aW9uUHJpY2UgPSBjb3Zlck9wdGlvbnMuZmlsdGVyKGNvdmVyT3B0aW9uID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGNvdmVyT3B0aW9uLm5hbWUgPT1cbiAgICAgICAgJCgnLicgKyBwYXJlbnRDbGFzc1syXSArICcgLmlubmVyIC5jYXJkLXRpdGxlJykudGV4dCgpXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgJCgnLicgKyBwYXJlbnRDbGFzc1syXSArICcgLmlubmVyIC5jYXJkLXByaWNlIC5hbW91bnQnKS50ZXh0KFxuICAgICAgcGFyc2VGbG9hdChjb3Zlck9wdGlvblByaWNlWzBdLmNvc3QgKiBldnQuY3VycmVudFRhcmdldC52YWx1ZSkgPD0gMFxuICAgICAgICA/IGNvdmVyT3B0aW9uUHJpY2VbMF0uY29zdFxuICAgICAgICA6IHBhcnNlRmxvYXQoXG4gICAgICAgICAgICBjb3Zlck9wdGlvblByaWNlWzBdLmNvc3QgKiBldnQuY3VycmVudFRhcmdldC52YWx1ZVxuICAgICAgICAgICkudG9GaXhlZCgyKVxuICAgICk7XG4gIH0pO1xuXG4gICQoJyNmYXFUYWJzIGEnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcykudGFiKCdzaG93Jyk7XG4gIH0pO1xuXG4gIC8vIGxvYWQgZmFxc1xuICAvLyBvbmx5IGxvYWQgaWYgb24gZmFxcyBwYWdlXG4gIGlmICgkKCcjZmFxcycpLmxlbmd0aCA+IDApIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICB1cmw6ICcvYXBpL2ZhcXMuanNvbicsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihmYXFzKSB7XG4gICAgICAgIC8vIGdldCB0aGUgaGVhZHNcbiAgICAgICAgJC5lYWNoKGZhcXMsIGZ1bmN0aW9uKGluZGV4LCBmYXEpIHtcbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIGRlc2t0b3BcbiAgICAgICAgICAkKGBhW2hyZWY9JyMke2ZhcS5pZH0nXWApXG4gICAgICAgICAgICAuZmluZCgnc3BhbicpXG4gICAgICAgICAgICAudGV4dChmYXEudGl0bGUpO1xuXG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBtb2JpbGVcbiAgICAgICAgICAkKGAjJHtmYXEuaWR9YClcbiAgICAgICAgICAgIC5maW5kKCdoMycpXG4gICAgICAgICAgICAudGV4dChmYXEuc2hvcnRUaXRsZSk7XG5cbiAgICAgICAgICAvLyBnZXQgdGhlIGJvZHlcbiAgICAgICAgICAkLmVhY2goZmFxLnFhcywgZnVuY3Rpb24oZkluZGV4LCBxYSkge1xuICAgICAgICAgICAgJCgnLmlubmVyIC5hY2NvcmRpb24nLCBgIyR7ZmFxLmlkfWApLmFwcGVuZChcbiAgICAgICAgICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtxYS5xdWVzdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cbiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubmVyXCI+XG4gICAgICAgICAgICAgICAgICR7cWEuYW5zd2VyfVxuICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0pOyAvLyAkYWpheFxuXG4gICAgJCgnLmZhcS1hbnN3ZXJzIC5pbm5lciAuYWNjb3JkaW9uJykuZGVsZWdhdGUoXG4gICAgICAnLmFjY29yZGlvbi1idG4nLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgICAgICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXG4gICAgICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIC8vIG9uIHNjcm9sbFxuICB2YXIgdGFyZ2V0ID0gJCgnLmFydGljbGUtbWFpbicpLm9mZnNldCgpLnRvcCAtIDE4MDtcbiAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKFxuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXG4gICkge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5yZWFkeShzdGFydCk7XG4iXX0=
