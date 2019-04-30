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
        console.log('success:', faqs);

        // get the heads
        $.each(faqs, function (index, faq) {
          console.log('faq: ', faq.id);

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

},{"./components/Accordion":1,"./components/CountrySelector":2,"./components/GoodbyeWorld":3,"./components/Navigation":4,"./components/Screen":5,"./components/VehicleSelector":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Hb29kYnllV29ybGQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL05hdmlnYXRpb24uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1NjcmVlbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCOztBQUVBLFFBQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxRQUFuQzs7QUFFQTtBQUNBLFFBQUksUUFBUSxJQUFJLGFBQUosQ0FBa0Isa0JBQTlCO0FBQ0EsUUFBSSxNQUFNLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLElBQXhCO0FBQ0EsWUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLFlBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxLQUpELE1BSU87QUFDTCxZQUFNLEtBQU4sQ0FB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KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIG1vZHVsZSBcIkFjY29yZGlvbi5qc1wiXHJcblxyXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgbGV0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYnRuJyk7XHJcblxyXG4gIC8vIEJpbmQgRXZlbnRzXHJcbiAgbGV0IGk7XHJcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xyXG4gICAgYWNjW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjb3JkaW9uSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudCBIYW5kbGVyc1xyXG4gIGZ1bmN0aW9uIGFjY29yZGlvbkhhbmRsZXIoZXZ0KSB7XHJcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxyXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG5cclxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXHJcbiAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcclxuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5leHBvcnQgeyBBY2NvcmRpb24gfTtcclxuIiwiZnVuY3Rpb24gQ291bnRyeVNlbGVjdG9yKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCB1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX191cCcpO1xyXG4gIGxldCBkb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2Rvd24nKTtcclxuICBsZXQgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9faXRlbXMnKTtcclxuICBsZXQgaXRlbUhlaWdodCA9XHJcbiAgICBpdGVtcyAhPSBudWxsID8gaXRlbXMuZmlyc3RDaGlsZC5uZXh0U2libGluZy5vZmZzZXRIZWlnaHQgOiAwO1xyXG5cclxuICAvLyBiaW5kIGV2ZW50c1xyXG4gIGlmICh1cCAhPSBudWxsKSB7XHJcbiAgICB1cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbFVwKTtcclxuICAgIGRvd24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxEb3duKTtcclxuXHJcbiAgICAvLyBldmVudCBoYW5kbGVyc1xyXG4gICAgZnVuY3Rpb24gc2Nyb2xsVXAoKSB7XHJcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCB1cCBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxyXG4gICAgICBpdGVtcy5zY3JvbGxUb3AgKz0gaXRlbUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxEb3duKCkge1xyXG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgZG93biBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxyXG4gICAgICBpdGVtcy5zY3JvbGxUb3AgLT0gaXRlbUhlaWdodDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IENvdW50cnlTZWxlY3RvciB9O1xyXG4iLCIvLyBtb2R1bGUgXCJHb29kYnllV29ybGQuanNcIlxyXG5cclxuZnVuY3Rpb24gR29vZGJ5ZSgpIHtcclxuICByZXR1cm4gJ0dvb2RieWUnO1xyXG59XHJcblxyXG5jb25zdCBXb3JsZCA9ICdXb3JsZCAhISc7XHJcblxyXG5leHBvcnQgeyBHb29kYnllLCBXb3JsZCB9O1xyXG4iLCJmdW5jdGlvbiBUb2dnbGVOYXZpZ2F0aW9uKCkge1xyXG4gIC8vIGNhY2hlIERPTVxyXG4gIGxldCBtYWluTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW1lbnUnKTtcclxuICBsZXQgbmF2QmFyVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcclxuXHJcbiAgLy8gYmluZCBldmVudHNcclxuICBuYXZCYXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNZW51KTtcclxuXHJcbiAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xyXG4gICAgbWFpbk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIERyb3Bkb3duTWVudSgpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgY2FyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1jYXInKTtcclxuICBsZXQgZHJvcERvd25NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLS1jYXIgLmRyb3Bkb3duLW1lbnUnKTtcclxuXHJcbiAgaWYgKGNhckJ0biAhPSBudWxsICYmIGRyb3BEb3duTWVudSAhPSBudWxsKSB7XHJcbiAgICBsZXQgZHJvcERvd24gPSBjYXJCdG4ucGFyZW50RWxlbWVudDtcclxuICAgIC8vIEJpbmQgZXZlbnRzXHJcbiAgICBjYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJCdG5IYW5kbGVyKTtcclxuXHJcbiAgICAvLyBFdmVudCBoYW5kbGVyc1xyXG4gICAgZnVuY3Rpb24gY2FyQnRuSGFuZGxlcihldnQpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIC8vIHRvZ2dsZSBkaXNwbGF5XHJcbiAgICAgIGlmIChcclxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnIHx8XHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICcnXHJcbiAgICAgICkge1xyXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPVxyXG4gICAgICAgICAgZHJvcERvd24ub2Zmc2V0SGVpZ2h0ICsgZHJvcERvd25NZW51Lm9mZnNldEhlaWdodCArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBUb2dnbGVOYXZpZ2F0aW9uLCBEcm9wZG93bk1lbnUgfTtcclxuIiwiLy8gbW9kdWxlIFwiU2NyZWVuLmpzXCJcclxuXHJcbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xyXG4gIHZhciBzY3JvbGxTdGVwID0gLXdpbmRvdy5zY3JvbGxZIC8gKHNjcm9sbER1cmF0aW9uIC8gMTUpLFxyXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgc2Nyb2xsU3RlcCk7XHJcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcclxuICAgIH0sIDE1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xyXG4gIGNvbnN0IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMjtcclxuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxyXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XHJcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xyXG4gICAgaWYgKHNjcm9sbENvdW50ID49IE1hdGguUEkpIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcclxuICAgICk7XHJcbiAgICBvbGRUaW1lc3RhbXAgPSBuZXdUaW1lc3RhbXA7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxufVxyXG4vKlxyXG4gIEV4cGxhbmF0aW9uczpcclxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxyXG4gIC0gbmV3VGltZXN0YW1wIGluZGljYXRlcyB0aGUgY3VycmVudCB0aW1lIHdoZW4gY2FsbGJhY2tzIHF1ZXVlZCBieSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmVnaW4gdG8gZmlyZS5cclxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxyXG5cclxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXHJcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXHJcbiAgPSBhICogY29zIChieCkgKyAxICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEgc3RyZXRjaGVzIGFsb25nIHRoZSB5IGF4aXMgPSBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDJcclxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXHJcbiovXHJcblxyXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcclxuICAvLyBDYWNoZSBET01cclxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcclxuXHJcbiAgLy8gQmluZCBFdmVudHNcclxuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcclxuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnQgSGFuZGxlcnNcclxuICBmdW5jdGlvbiBiYWNrVG9Ub3BCdG5IYW5kbGVyKGV2dCkge1xyXG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBfc2Nyb2xsVG9Ub3BFYXNlSW5FYXNlT3V0KDEwMDApO1xyXG5cclxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXaW5kb3dXaWR0aCgpIHtcclxuICBjb25zb2xlLmxvZygnV2luZG93V2lkdGgnKTtcclxuXHJcbiAgLy8gY2FjaGUgRE9NXHJcbiAgY29uc3QgYWNjb3JkaW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAnLmNhcmQtcHJvZHVjdHMgLmFjY29yZGlvbi1idG4nXHJcbiAgKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHcgPVxyXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHxcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuICAgIGlmICh3ID4gMTIwMCkge1xyXG4gICAgICBsZXQgaTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh3IDw9IDEyMDApIHtcclxuICAgICAgbGV0IGk7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH07XHJcbiIsImZ1bmN0aW9uIFZlaGljbGVTZWxlY3RvcigpIHtcclxuICAvLyBjYWNoZSBET01cclxuICBsZXQgY2FyVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX19jYXInKTtcclxuICBsZXQgdmFuVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX192YW4nKTtcclxuXHJcbiAgLy8gYmluZCBldmVudHNcclxuICBpZiAoY2FyVGFiICE9IG51bGwgJiYgdmFuVGFiICE9IG51bGwpIHtcclxuICAgIGNhclRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcclxuICAgIHZhblRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcclxuICB9XHJcblxyXG4gIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgZnVuY3Rpb24gb3BlblZlaGljbGUoZXZ0KSB7XHJcbiAgICB2YXIgaSwgeCwgdGFiQnV0dG9ucztcclxuXHJcbiAgICBjb25zb2xlLmxvZyhldnQpO1xyXG5cclxuICAgIC8vIGhpZGUgYWxsIHRhYiBjb250ZW50c1xyXG4gICAgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItY29udGFpbmVyIC50YWInKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHhbaV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxuXHJcbiAgICAvLyByZW1vdmUgdGhlIGhpZ2hsaWdodCBvbiB0aGUgdGFiIGJ1dHRvblxyXG4gICAgdGFiQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtdGFicyAubmF2LWxpbmsnKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lID0gdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUucmVwbGFjZSgnIGFjdGl2ZScsICcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBoaWdobGlnaHQgdGFiIGJ1dHRvbiBhbmRcclxuICAgIC8vIHNob3cgdGhlIHNlbGVjdGVkIHRhYiBjb250ZW50XHJcbiAgICBsZXQgdmVoaWNsZSA9IGV2dC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12ZWhpY2xlJyk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFiLScgKyB2ZWhpY2xlKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZSArPSAnIGFjdGl2ZSc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfTtcclxuIiwiaW1wb3J0IHsgR29vZGJ5ZSwgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkJztcclxuaW1wb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XHJcbmltcG9ydCB7IEFjY29yZGlvbiB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvcmRpb24nO1xyXG5pbXBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yJztcclxuaW1wb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL1ZlaGljbGVTZWxlY3Rvcic7XHJcbmltcG9ydCB7IFRvZ2dsZU5hdmlnYXRpb24sIERyb3Bkb3duTWVudSB9IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcclxuXHJcbmNvbnNvbGUubG9nKGAke0dvb2RieWUoKX0gJHtXb3JsZH0gSW5kZXggZmlsZWApO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgQ291bnRyeVNlbGVjdG9yKCk7XHJcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XHJcbiAgVG9nZ2xlTmF2aWdhdGlvbigpO1xyXG4gIERyb3Bkb3duTWVudSgpO1xyXG4gIFNjcm9sbFRvVG9wKCk7XHJcbiAgQWNjb3JkaW9uKCk7XHJcbiAgV2luZG93V2lkdGgoKTtcclxuXHJcbiAgLy9Eb2NzXHJcbiAgJCgnLnJldmVhbGRvY3MnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgb24gPSAkKCcuZG9jcycpLmlzKCc6dmlzaWJsZScpO1xyXG4gICAgJCh0aGlzKS5odG1sKFxyXG4gICAgICBvbiA/ICdWaWV3IHBvbGljeSBkb2N1bWVudGF0aW9uJyA6ICdIaWRlIHBvbGljeSBkb2N1bWVudGF0aW9uJ1xyXG4gICAgKTtcclxuICAgICQoJy5kb2NzJykuc2xpZGVUb2dnbGUoKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgICQoZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLmNhcmQtY292ZXItb3B0aW9uJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHJcbiAgICAvLyBzaG93IHBvbGljeSBzdW1tYXJ5XHJcbiAgICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICB9KTtcclxuICAgIGxldCBwb2xpY3lTdW1tYXJ5ID0gJCh0aGlzKS5kYXRhKCdwb2xpY3knKTtcclxuICAgICQoJy4nICsgcG9saWN5U3VtbWFyeSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy50YWItY2FyIC5idG4nKS5jbGljayhmdW5jdGlvbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pO1xyXG5cclxuICAkKCcudGFiLWNhciAuaWNvbi1yYWRpbyBpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5jbGljayhmdW5jdGlvbihldnQpIHtcclxuICAgICQoJy50YWItY2FyIC5idG4nKS5yZW1vdmVDbGFzcygnYnRuLWN0YS0tZGlzYWJsZWQnKTtcclxuICAgICQoJy50YWItY2FyIC5idG4nKS5hZGRDbGFzcygnYnRuLWN0YScpO1xyXG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnVuYmluZCgpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgY292ZXJPcHRpb25zID0gW107XHJcbiAgLy8gZ2V0IHByaWNlXHJcbiAgaWYgKCQoJy5jYXJkLWNvdmVyLW9wdGlvbicpKSB7XHJcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgIGNvdmVyT3B0aW9ucy5wdXNoKHtcclxuICAgICAgICBuYW1lOiAkKCcuaW5uZXIgLmNhcmQtdGl0bGUgJywgZWxlbWVudCkudGV4dCgpLFxyXG4gICAgICAgIGNvc3Q6ICQoJy5pbm5lciAuY2FyZC1wcmljZSAuYW1vdW50JywgZWxlbWVudCkudGV4dCgpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkKCcucHJvZHVjdC1vcHRpb25zLWRheXMtY292ZXInKS5jaGFuZ2UoZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICBsZXQgcGFyZW50Q2xhc3MgPSAkKHRoaXMpXHJcbiAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAucGFyZW50KClcclxuICAgICAgLnBhcmVudCgpXHJcbiAgICAgIC5hdHRyKCdjbGFzcycpXHJcbiAgICAgIC5zcGxpdCgnICcpO1xyXG5cclxuICAgIGxldCBjb3Zlck9wdGlvblByaWNlID0gY292ZXJPcHRpb25zLmZpbHRlcihjb3Zlck9wdGlvbiA9PiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgY292ZXJPcHRpb24ubmFtZSA9PVxyXG4gICAgICAgICQoJy4nICsgcGFyZW50Q2xhc3NbMl0gKyAnIC5pbm5lciAuY2FyZC10aXRsZScpLnRleHQoKVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLicgKyBwYXJlbnRDbGFzc1syXSArICcgLmlubmVyIC5jYXJkLXByaWNlIC5hbW91bnQnKS50ZXh0KFxyXG4gICAgICBwYXJzZUZsb2F0KGNvdmVyT3B0aW9uUHJpY2VbMF0uY29zdCAqIGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKSA8PSAwXHJcbiAgICAgICAgPyBjb3Zlck9wdGlvblByaWNlWzBdLmNvc3RcclxuICAgICAgICA6IHBhcnNlRmxvYXQoXHJcbiAgICAgICAgICAgIGNvdmVyT3B0aW9uUHJpY2VbMF0uY29zdCAqIGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgICApLnRvRml4ZWQoMilcclxuICAgICk7XHJcbiAgfSk7XHJcblxyXG4gICQoJyNmYXFUYWJzIGEnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKHRoaXMpLnRhYignc2hvdycpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBsb2FkIGZhcXNcclxuICAvLyBvbmx5IGxvYWQgaWYgb24gZmFxcyBwYWdlXHJcbiAgaWYgKCQoJyNmYXFzJykubGVuZ3RoID4gMCkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgIHVybDogJy9hcGkvZmFxcy5qc29uJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZmFxcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzOicsIGZhcXMpO1xyXG5cclxuICAgICAgICAvLyBnZXQgdGhlIGhlYWRzXHJcbiAgICAgICAgJC5lYWNoKGZhcXMsIGZ1bmN0aW9uKGluZGV4LCBmYXEpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdmYXE6ICcsIGZhcS5pZCk7XHJcblxyXG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBkZXNrdG9wXHJcbiAgICAgICAgICAkKGBhW2hyZWY9JyMke2ZhcS5pZH0nXWApXHJcbiAgICAgICAgICAgIC5maW5kKCdzcGFuJylcclxuICAgICAgICAgICAgLnRleHQoZmFxLnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIG1vYmlsZVxyXG4gICAgICAgICAgJChgIyR7ZmFxLmlkfWApXHJcbiAgICAgICAgICAgIC5maW5kKCdoMycpXHJcbiAgICAgICAgICAgIC50ZXh0KGZhcS5zaG9ydFRpdGxlKTtcclxuXHJcbiAgICAgICAgICAvLyBnZXQgdGhlIGJvZHlcclxuICAgICAgICAgICQuZWFjaChmYXEucWFzLCBmdW5jdGlvbihmSW5kZXgsIHFhKSB7XHJcbiAgICAgICAgICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJywgYCMke2ZhcS5pZH1gKS5hcHBlbmQoXHJcbiAgICAgICAgICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtxYS5xdWVzdGlvbn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxyXG4gICAgICAgICAgICAgICAgICR7cWEuYW5zd2VyfVxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTsgLy8gJGFqYXhcclxuXHJcbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcclxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcclxuICAgICAgJ2NsaWNrJyxcclxuICAgICAgZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcclxuICAgICAgICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXHJcbiAgICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXHJcbiAgICAgICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XHJcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xyXG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIG9uIHNjcm9sbFxyXG4gIHZhciB0YXJnZXQgPSAkKCcuYXJ0aWNsZS1tYWluJykub2Zmc2V0KCkudG9wIC0gMTgwO1xyXG4gICQoZG9jdW1lbnQpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XHJcbiAgICAgICQoJy5zaGFyZS1idXR0b25zJykuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XHJcbiAgaWYgKFxyXG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnRcclxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXHJcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXHJcbiAgKSB7XHJcbiAgICBmbigpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xyXG4gIH1cclxufVxyXG5cclxucmVhZHkoc3RhcnQpO1xyXG4iXX0=
