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
// module "AutoComplete.js"

/**
 * [AutoComplete description]
 *
 * @param   {string}  userInput  user input
 * @param   {array}  searchList  search list
 *
 * @return  {[type]}       [return description]
 */
function AutoComplete(inp, arr) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener('input', function (e) {
    var a,
        b,
        i,
        val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement('DIV');
        /*make the matching letters bold:*/
        b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener('click', function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName('input')[0].value;
          /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener('keydown', function (e) {
    var x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add('autocomplete-active');
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
  });
}

exports.AutoComplete = AutoComplete;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module CoverOptions.js

function CoverOptions() {
  // cache DOM
  // Get single trip price
  var initialCoverPrice = parseFloat($('.card-cover-option:nth-of-type(1) .amount').text()).toFixed(2);
  var initialSingleTripPrice = parseFloat($('.initial-single-trip-price').text().replace(/\D*/, '')).toFixed(2);
  var inputValue = '';
  var priceLimit = 119;
  var totalInitialPrice = 0;
  var totalSinglePrice = 0;
  var finalPrice = 0;

  console.clear();
  console.log('cover price ' + initialCoverPrice);
  console.log('cover price ' + initialSingleTripPrice);

  $('.product-options-days-cover').change(function (evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value);

    if (inputValue > 0) {
      for (var i = 0; i <= inputValue; i = i + 1) {
        // calculate with intital cover price
        if (i > 0 && i <= 3) {
          totalInitialPrice = i * initialCoverPrice;
          totalSinglePrice = 0;
        }

        if (i > 3 && finalPrice < priceLimit) {
          totalSinglePrice = (i - 3) * initialSingleTripPrice;
        }
      }
    }
    finalPrice = totalInitialPrice + totalSinglePrice;

    console.log(inputValue + ' = ' + finalPrice);
  });

  console.log(initialCoverPrice);
}

exports.CoverOptions = CoverOptions;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

function FixedNavigation() {
  // make navbar sticky
  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    myFunction();
  };

  // Get the header
  var navBar = document.querySelector('.navbar');

  // Get the offset position of the navbar
  var sticky = navBar.offsetTop;

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
    var sticky = navBar.offsetTop;
    if (window.pageYOffset > sticky) {
      navBar.classList.add('navbar-fixed-top');
    } else {
      navBar.classList.remove('navbar-fixed-top');
    }
  }
}

function SelectTrip() {
  // select vehicle
  $('.tab-car .btn').click(function (evt) {
    evt.preventDefault();
    return false;
  });

  $('.tab-car .icon-radio input[type="radio"]').click(function (evt) {
    $('.tab-car .btn').removeClass('btn-cta--disabled');
    $('.tab-car .btn').addClass('btn-cta');
    $('.tab-car .btn').unbind();
  });
}

// show mobile currency
function RevealCurrency() {
  $('.currencyMobile').on('click', function () {
    console.log('Currency');

    $('.currency').slideToggle();
  });
}

exports.ToggleNavigation = ToggleNavigation;
exports.DropdownMenu = DropdownMenu;
exports.FixedNavigation = FixedNavigation;
exports.SelectTrip = SelectTrip;
exports.RevealCurrency = RevealCurrency;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function PolicySummary() {
  // policy summary
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

exports.PolicySummary = PolicySummary;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module RevealDocs.js

function RevealDocs() {
  //Docs
  $('.revealdocs').click(function (e) {
    e.preventDefault();
    var on = $('.docs').is(':visible');
    $(this).html(on ? 'View policy documentation' : 'Hide policy documentation');
    $('.docs').slideToggle();
  });
}

exports.RevealDocs = RevealDocs;

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

  var heightCompensation = 60;
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
          scrollTop: target.offset().top - heightCompensation
        }, 1000, function () {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(':focus')) {
            // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        });
      }
    }
  }
}

// on scroll
if ($('.article-main').length > 0) {
  var target = $('.article-main').offset().top - 180;
  $(document).scroll(function () {
    if ($(window).scrollTop() >= target) {
      $('.share-buttons').show();
    } else {
      $('.share-buttons').hide();
    }
  });
}

exports.ScrollTo = ScrollTo;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

exports.Ready = Ready;

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// module "LoadFAQs.js"

function LoadFAQs() {
  // load faqs
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

  // only load if on product faqs page
  if ($('.product-faqs').length > 0) {
    var file = $('.product-faqs').data('faqs').replace('&-', '');

    console.log('/api/' + file + '-faqs.json');

    $.ajax({
      type: 'GET',
      url: '/api/' + file + '-faqs.json',
      success: function success(faqs) {
        // get the body
        $.each(faqs, function (fIndex, faq) {
          console.log('#' + faq.id);
          $('.inner .accordion').append('<button class="accordion-btn h4">' + faq.question + '</button>\n              <div class="accordion-panel">\n                <div class="inner">\n                ' + faq.answer + '\n                </div>\n              </div>\n            ');
        });

        // show content
        $('.faq-answers-product').show();
      },
      error: function error(xhr, status, _error2) {
        console.log('error: ', _error2);
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
}

exports.LoadFAQs = LoadFAQs;

},{}],14:[function(require,module,exports){
'use strict';

var _GoodbyeWorld = require('./components/GoodbyeWorld');

var _Screen = require('./components/Screen');

var _Accordion = require('./components/Accordion');

var _CountrySelector = require('./components/CountrySelector');

var _VehicleSelector = require('./components/VehicleSelector');

var _Navigation = require('./components/Navigation');

var _ScrollTo = require('./components/ScrollTo');

var _AutoComplete = require('./components/AutoComplete');

var _faqs = require('./components/faqs');

var _RevealDocs = require('./components/RevealDocs');

var _CoverOptions = require('./components/CoverOptions');

var _Utils = require('./components/Utils');

var _PolicySummary = require('./components/PolicySummary');

console.log((0, _GoodbyeWorld.Goodbye)() + ' ' + _GoodbyeWorld.World + ' Index file');

var countriesCovered = null;

function start() {
  (0, _CountrySelector.CountrySelector)();
  (0, _VehicleSelector.VehicleSelector)();
  (0, _Navigation.ToggleNavigation)();
  (0, _Navigation.DropdownMenu)();
  (0, _Screen.ScrollToTop)();
  (0, _Navigation.FixedNavigation)();
  (0, _Accordion.Accordion)();
  (0, _Screen.WindowWidth)();
  (0, _ScrollTo.ScrollTo)();
  if (countriesCovered != null) {
    (0, _AutoComplete.AutoComplete)(document.getElementById('myInput'), countriesCovered);
  }
  (0, _faqs.LoadFAQs)();
  // RevealDocs();
  (0, _CoverOptions.CoverOptions)();
  (0, _PolicySummary.PolicySummary)();
  (0, _Navigation.SelectTrip)();
  (0, _Navigation.RevealCurrency)();
}

(0, _Utils.Ready)(start);

},{"./components/Accordion":1,"./components/AutoComplete":2,"./components/CountrySelector":3,"./components/CoverOptions":4,"./components/GoodbyeWorld":5,"./components/Navigation":6,"./components/PolicySummary":7,"./components/RevealDocs":8,"./components/Screen":9,"./components/ScrollTo":10,"./components/Utils":11,"./components/VehicleSelector":12,"./components/faqs":13}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Qb2xpY3lTdW1tYXJ5LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCOztBQUVBLFFBQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxRQUFuQzs7QUFFQTtBQUNBLFFBQUksUUFBUSxJQUFJLGFBQUosQ0FBa0Isa0JBQTlCO0FBQ0EsUUFBSSxNQUFNLEtBQU4sQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLElBQXhCO0FBQ0EsWUFBTSxLQUFOLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLFlBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxLQUpELE1BSU87QUFDTCxZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE1BQU0sWUFBTixHQUFxQixJQUE3QztBQUNBLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxZQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLE1BQTNCO0FBQ0Q7QUFDRjtBQUNGO1FBQ1EsUyxHQUFBLFM7Ozs7Ozs7O0FDL0JUOztBQUVBOzs7Ozs7OztBQVFBLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQztBQUM5QixNQUFJLFlBQUo7QUFDQTtBQUNBLE1BQUksZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsVUFBUyxDQUFULEVBQVk7QUFDeEMsUUFBSSxDQUFKO0FBQUEsUUFDRSxDQURGO0FBQUEsUUFFRSxDQUZGO0FBQUEsUUFHRSxNQUFNLEtBQUssS0FIYjtBQUlBO0FBQ0E7QUFDQSxRQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1IsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxtQkFBZSxDQUFDLENBQWhCO0FBQ0E7QUFDQSxRQUFJLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFKO0FBQ0EsTUFBRSxZQUFGLENBQWUsSUFBZixFQUFxQixLQUFLLEVBQUwsR0FBVSxtQkFBL0I7QUFDQSxNQUFFLFlBQUYsQ0FBZSxPQUFmLEVBQXdCLG9CQUF4QjtBQUNBO0FBQ0EsU0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLENBQTVCO0FBQ0E7QUFDQSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksSUFBSSxNQUFwQixFQUE0QixHQUE1QixFQUFpQztBQUMvQjtBQUNBLFVBQUksSUFBSSxDQUFKLEVBQU8sTUFBUCxDQUFjLENBQWQsRUFBaUIsSUFBSSxNQUFyQixFQUE2QixXQUE3QixNQUE4QyxJQUFJLFdBQUosRUFBbEQsRUFBcUU7QUFDbkU7QUFDQSxZQUFJLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFKO0FBQ0E7QUFDQSxVQUFFLFNBQUYsR0FBYyxhQUFhLElBQUksQ0FBSixFQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLElBQUksTUFBckIsQ0FBYixHQUE0QyxXQUExRDtBQUNBLFVBQUUsU0FBRixJQUFlLElBQUksQ0FBSixFQUFPLE1BQVAsQ0FBYyxJQUFJLE1BQWxCLENBQWY7QUFDQTtBQUNBLFVBQUUsU0FBRixJQUFlLGlDQUFpQyxJQUFJLENBQUosQ0FBakMsR0FBMEMsSUFBekQ7QUFDQTtBQUNBLFVBQUUsZ0JBQUYsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBUyxDQUFULEVBQVk7QUFDdEM7QUFDQSxjQUFJLEtBQUosR0FBWSxLQUFLLG9CQUFMLENBQTBCLE9BQTFCLEVBQW1DLENBQW5DLEVBQXNDLEtBQWxEO0FBQ0E7O0FBRUE7QUFDRCxTQU5EO0FBT0EsVUFBRSxXQUFGLENBQWMsQ0FBZDtBQUNEO0FBQ0Y7QUFDRixHQXZDRDtBQXdDQTtBQUNBLE1BQUksZ0JBQUosQ0FBcUIsU0FBckIsRUFBZ0MsVUFBUyxDQUFULEVBQVk7QUFDMUMsUUFBSSxJQUFJLFNBQVMsY0FBVCxDQUF3QixLQUFLLEVBQUwsR0FBVSxtQkFBbEMsQ0FBUjtBQUNBLFFBQUksQ0FBSixFQUFPLElBQUksRUFBRSxvQkFBRixDQUF1QixLQUF2QixDQUFKO0FBQ1AsUUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQVUsQ0FBVjtBQUNELEtBTkQsTUFNTyxJQUFJLEVBQUUsT0FBRixJQUFhLEVBQWpCLEVBQXFCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFVLENBQVY7QUFDRCxLQVBNLE1BT0EsSUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUMxQjtBQUNBLFFBQUUsY0FBRjtBQUNBLFVBQUksZUFBZSxDQUFDLENBQXBCLEVBQXVCO0FBQ3JCO0FBQ0EsWUFBSSxDQUFKLEVBQU8sRUFBRSxZQUFGLEVBQWdCLEtBQWhCO0FBQ1I7QUFDRjtBQUNGLEdBeEJEO0FBeUJBLFdBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQjtBQUNwQjtBQUNBLFFBQUksQ0FBQyxDQUFMLEVBQVEsT0FBTyxLQUFQO0FBQ1I7QUFDQSxpQkFBYSxDQUFiO0FBQ0EsUUFBSSxnQkFBZ0IsRUFBRSxNQUF0QixFQUE4QixlQUFlLENBQWY7QUFDOUIsUUFBSSxlQUFlLENBQW5CLEVBQXNCLGVBQWUsRUFBRSxNQUFGLEdBQVcsQ0FBMUI7QUFDdEI7QUFDQSxNQUFFLFlBQUYsRUFBZ0IsU0FBaEIsQ0FBMEIsR0FBMUIsQ0FBOEIscUJBQTlCO0FBQ0Q7QUFDRCxXQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBeUI7QUFDdkI7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksRUFBRSxNQUF0QixFQUE4QixHQUE5QixFQUFtQztBQUNqQyxRQUFFLENBQUYsRUFBSyxTQUFMLENBQWUsTUFBZixDQUFzQixxQkFBdEI7QUFDRDtBQUNGO0FBQ0QsV0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCO0FBQzVCOztBQUVBLFFBQUksSUFBSSxTQUFTLHNCQUFULENBQWdDLG9CQUFoQyxDQUFSO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQUUsTUFBdEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDakMsVUFBSSxTQUFTLEVBQUUsQ0FBRixDQUFULElBQWlCLFNBQVMsR0FBOUIsRUFBbUM7QUFDakMsVUFBRSxDQUFGLEVBQUssVUFBTCxDQUFnQixXQUFoQixDQUE0QixFQUFFLENBQUYsQ0FBNUI7QUFDRDtBQUNGO0FBQ0Y7QUFDRDtBQUNBLFdBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBUyxDQUFULEVBQVk7QUFDN0Msa0JBQWMsRUFBRSxNQUFoQjtBQUNELEdBRkQ7QUFHRDs7UUFFUSxZLEdBQUEsWTs7Ozs7Ozs7QUMvR1QsU0FBUyxlQUFULEdBQTJCO0FBQ3pCO0FBQ0EsTUFBSSxLQUFLLFNBQVMsYUFBVCxDQUF1Qix1QkFBdkIsQ0FBVDtBQUNBLE1BQUksT0FBTyxTQUFTLGFBQVQsQ0FBdUIseUJBQXZCLENBQVg7QUFDQSxNQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLDBCQUF2QixDQUFaO0FBQ0EsTUFBSSxhQUNGLFNBQVMsSUFBVCxHQUFnQixNQUFNLFVBQU4sQ0FBaUIsV0FBakIsQ0FBNkIsWUFBN0MsR0FBNEQsQ0FEOUQ7O0FBR0E7QUFDQSxNQUFJLE1BQU0sSUFBVixFQUFnQjs7QUFJZDtBQUpjLFFBS0wsUUFMSyxHQUtkLFNBQVMsUUFBVCxHQUFvQjtBQUNsQjtBQUNBLFlBQU0sU0FBTixJQUFtQixVQUFuQjtBQUNELEtBUmE7O0FBQUEsUUFVTCxVQVZLLEdBVWQsU0FBUyxVQUFULEdBQXNCO0FBQ3BCO0FBQ0EsWUFBTSxTQUFOLElBQW1CLFVBQW5CO0FBQ0QsS0FiYTs7QUFDZCxPQUFHLGdCQUFILENBQW9CLE9BQXBCLEVBQTZCLFFBQTdCO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUEvQjtBQVlEO0FBQ0Y7O1FBRVEsZSxHQUFBLGU7Ozs7Ozs7O0FDMUJUOztBQUVBLFNBQVMsWUFBVCxHQUF3QjtBQUN0QjtBQUNBO0FBQ0EsTUFBTSxvQkFBb0IsV0FDeEIsRUFBRSwyQ0FBRixFQUErQyxJQUEvQyxFQUR3QixFQUV4QixPQUZ3QixDQUVoQixDQUZnQixDQUExQjtBQUdBLE1BQUkseUJBQXlCLFdBQzNCLEVBQUUsNEJBQUYsRUFDRyxJQURILEdBRUcsT0FGSCxDQUVXLEtBRlgsRUFFa0IsRUFGbEIsQ0FEMkIsRUFJM0IsT0FKMkIsQ0FJbkIsQ0FKbUIsQ0FBN0I7QUFLQSxNQUFJLGFBQWEsRUFBakI7QUFDQSxNQUFNLGFBQWEsR0FBbkI7QUFDQSxNQUFJLG9CQUFvQixDQUF4QjtBQUNBLE1BQUksbUJBQW1CLENBQXZCO0FBQ0EsTUFBSSxhQUFhLENBQWpCOztBQUVBLFVBQVEsS0FBUjtBQUNBLFVBQVEsR0FBUixrQkFBMkIsaUJBQTNCO0FBQ0EsVUFBUSxHQUFSLGtCQUEyQixzQkFBM0I7O0FBRUEsSUFBRSw2QkFBRixFQUFpQyxNQUFqQyxDQUF3QyxVQUFTLEdBQVQsRUFBYztBQUNwRDtBQUNBLGlCQUFhLFNBQVMsSUFBSSxhQUFKLENBQWtCLEtBQTNCLENBQWI7O0FBRUEsUUFBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsS0FBSyxVQUFyQixFQUFpQyxJQUFJLElBQUksQ0FBekMsRUFBNEM7QUFDMUM7QUFDQSxZQUFJLElBQUksQ0FBSixJQUFTLEtBQUssQ0FBbEIsRUFBcUI7QUFDbkIsOEJBQW9CLElBQUksaUJBQXhCO0FBQ0EsNkJBQW1CLENBQW5CO0FBQ0Q7O0FBRUQsWUFBSSxJQUFJLENBQUosSUFBUyxhQUFhLFVBQTFCLEVBQXNDO0FBQ3BDLDZCQUFtQixDQUFDLElBQUksQ0FBTCxJQUFVLHNCQUE3QjtBQUNEO0FBQ0Y7QUFDRjtBQUNELGlCQUFhLG9CQUFvQixnQkFBakM7O0FBRUEsWUFBUSxHQUFSLENBQWUsVUFBZixXQUErQixVQUEvQjtBQUNELEdBcEJEOztBQXNCQSxVQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNEOztRQUVRLFksR0FBQSxZOzs7Ozs7OztBQ2hEVDs7QUFFQSxTQUFTLE9BQVQsR0FBbUI7QUFDakIsU0FBTyxTQUFQO0FBQ0Q7O0FBRUQsSUFBTSxRQUFRLFVBQWQ7O1FBRVMsTyxHQUFBLE87UUFBUyxLLEdBQUEsSzs7Ozs7Ozs7QUNSbEIsU0FBUyxnQkFBVCxHQUE0QjtBQUMxQjtBQUNBLE1BQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBZDtBQUNBLE1BQUksZUFBZSxTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQW5COztBQUVBO0FBQ0EsZUFBYSxnQkFBYixDQUE4QixPQUE5QixFQUF1QyxVQUF2Qzs7QUFFQTtBQUNBLFdBQVMsVUFBVCxHQUFzQjtBQUNwQixZQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsUUFBekI7QUFDRDtBQUNGOztBQUVELFNBQVMsWUFBVCxHQUF3QjtBQUN0QjtBQUNBLE1BQUksU0FBUyxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBYjtBQUNBLE1BQUksZUFBZSxTQUFTLGFBQVQsQ0FBdUIsK0JBQXZCLENBQW5COztBQUVBLE1BQUksVUFBVSxJQUFWLElBQWtCLGdCQUFnQixJQUF0QyxFQUE0Qzs7QUFLMUM7QUFMMEMsUUFNakMsYUFOaUMsR0FNMUMsU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLFVBQUksY0FBSjtBQUNBLFVBQUksZUFBSjs7QUFFQTtBQUNBLFVBQ0UsYUFBYSxLQUFiLENBQW1CLE9BQW5CLEtBQStCLE1BQS9CLElBQ0EsYUFBYSxLQUFiLENBQW1CLE9BQW5CLEtBQStCLEVBRmpDLEVBR0U7QUFDQSxxQkFBYSxLQUFiLENBQW1CLE9BQW5CLEdBQTZCLE9BQTdCO0FBQ0EsaUJBQVMsS0FBVCxDQUFlLE1BQWYsR0FDRSxTQUFTLFlBQVQsR0FBd0IsYUFBYSxZQUFyQyxHQUFvRCxJQUR0RDtBQUVELE9BUEQsTUFPTztBQUNMLHFCQUFhLEtBQWIsQ0FBbUIsT0FBbkIsR0FBNkIsTUFBN0I7QUFDQSxpQkFBUyxLQUFULENBQWUsTUFBZixHQUF3QixNQUF4QjtBQUNEO0FBQ0YsS0F0QnlDOztBQUMxQyxRQUFJLFdBQVcsT0FBTyxhQUF0QjtBQUNBO0FBQ0EsV0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxhQUFqQztBQW9CRDtBQUNGOztBQUVELFNBQVMsZUFBVCxHQUEyQjtBQUN6QjtBQUNBO0FBQ0EsU0FBTyxRQUFQLEdBQWtCLFlBQVc7QUFDM0I7QUFDRCxHQUZEOztBQUlBO0FBQ0EsTUFBSSxTQUFTLFNBQVMsYUFBVCxDQUF1QixTQUF2QixDQUFiOztBQUVBO0FBQ0EsTUFBSSxTQUFTLE9BQU8sU0FBcEI7O0FBRUE7QUFDQSxXQUFTLFVBQVQsR0FBc0I7QUFDcEIsUUFBSSxTQUFTLE9BQU8sU0FBcEI7QUFDQSxRQUFJLE9BQU8sV0FBUCxHQUFxQixNQUF6QixFQUFpQztBQUMvQixhQUFPLFNBQVAsQ0FBaUIsR0FBakIsQ0FBcUIsa0JBQXJCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLGtCQUF4QjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFTLFVBQVQsR0FBc0I7QUFDcEI7QUFDQSxJQUFFLGVBQUYsRUFBbUIsS0FBbkIsQ0FBeUIsVUFBUyxHQUFULEVBQWM7QUFDckMsUUFBSSxjQUFKO0FBQ0EsV0FBTyxLQUFQO0FBQ0QsR0FIRDs7QUFLQSxJQUFFLDBDQUFGLEVBQThDLEtBQTlDLENBQW9ELFVBQVMsR0FBVCxFQUFjO0FBQ2hFLE1BQUUsZUFBRixFQUFtQixXQUFuQixDQUErQixtQkFBL0I7QUFDQSxNQUFFLGVBQUYsRUFBbUIsUUFBbkIsQ0FBNEIsU0FBNUI7QUFDQSxNQUFFLGVBQUYsRUFBbUIsTUFBbkI7QUFDRCxHQUpEO0FBS0Q7O0FBRUQ7QUFDQSxTQUFTLGNBQVQsR0FBMEI7QUFDeEIsSUFBRSxpQkFBRixFQUFxQixFQUFyQixDQUF3QixPQUF4QixFQUFpQyxZQUFXO0FBQzFDLFlBQVEsR0FBUixDQUFZLFVBQVo7O0FBRUEsTUFBRSxXQUFGLEVBQWUsV0FBZjtBQUNELEdBSkQ7QUFLRDs7UUFHQyxnQixHQUFBLGdCO1FBQ0EsWSxHQUFBLFk7UUFDQSxlLEdBQUEsZTtRQUNBLFUsR0FBQSxVO1FBQ0EsYyxHQUFBLGM7Ozs7Ozs7O0FDakdGLFNBQVMsYUFBVCxHQUF5QjtBQUN2QjtBQUNBLElBQUUsMkJBQUYsRUFBK0IsSUFBL0IsQ0FBb0MsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQzNELFFBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ2YsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxNQUFFLE9BQUYsRUFBVyxHQUFYLENBQWUsU0FBZixFQUEwQixNQUExQjtBQUNELEdBTEQ7O0FBT0EsSUFBRSxvQkFBRixFQUF3QixLQUF4QixDQUE4QixVQUFTLEdBQVQsRUFBYztBQUMxQyxNQUFFLG9CQUFGLEVBQXdCLElBQXhCLENBQTZCLFVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QjtBQUNwRCxRQUFFLE9BQUYsRUFBVyxXQUFYLENBQXVCLFFBQXZCO0FBQ0QsS0FGRDtBQUdBLFFBQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixHQUE1QixDQUFnQyxRQUFoQzs7QUFFQTtBQUNBLE1BQUUsMkJBQUYsRUFBK0IsSUFBL0IsQ0FBb0MsVUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCO0FBQzNELFFBQUUsT0FBRixFQUFXLEdBQVgsQ0FBZSxTQUFmLEVBQTBCLE1BQTFCO0FBQ0QsS0FGRDtBQUdBLFFBQUksZ0JBQWdCLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxRQUFiLENBQXBCO0FBQ0EsTUFBRSxNQUFNLGFBQVIsRUFBdUIsR0FBdkIsQ0FBMkIsU0FBM0IsRUFBc0MsT0FBdEM7QUFDRCxHQVpEO0FBYUQ7O1FBRVEsYSxHQUFBLGE7Ozs7Ozs7O0FDeEJUOztBQUVBLFNBQVMsVUFBVCxHQUFzQjtBQUNwQjtBQUNBLElBQUUsYUFBRixFQUFpQixLQUFqQixDQUF1QixVQUFTLENBQVQsRUFBWTtBQUNqQyxNQUFFLGNBQUY7QUFDQSxRQUFJLEtBQUssRUFBRSxPQUFGLEVBQVcsRUFBWCxDQUFjLFVBQWQsQ0FBVDtBQUNBLE1BQUUsSUFBRixFQUFRLElBQVIsQ0FDRSxLQUFLLDJCQUFMLEdBQW1DLDJCQURyQztBQUdBLE1BQUUsT0FBRixFQUFXLFdBQVg7QUFDRCxHQVBEO0FBUUQ7O1FBRVEsVSxHQUFBLFU7Ozs7Ozs7O0FDZFQ7O0FBRUEsU0FBUyxZQUFULENBQXNCLGNBQXRCLEVBQXNDO0FBQ3BDLE1BQUksYUFBYSxDQUFDLE9BQU8sT0FBUixJQUFtQixpQkFBaUIsRUFBcEMsQ0FBakI7QUFBQSxNQUNFLGlCQUFpQixZQUFZLFlBQVc7QUFDdEMsUUFBSSxPQUFPLE9BQVAsSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsYUFBTyxRQUFQLENBQWdCLENBQWhCLEVBQW1CLFVBQW5CO0FBQ0QsS0FGRCxNQUVPLGNBQWMsY0FBZDtBQUNSLEdBSmdCLEVBSWQsRUFKYyxDQURuQjtBQU1EOztBQUVELFNBQVMseUJBQVQsQ0FBbUMsY0FBbkMsRUFBbUQ7QUFDakQsTUFBTSxlQUFlLE9BQU8sT0FBUCxHQUFpQixDQUF0QztBQUNBLE1BQUksY0FBYyxDQUFsQjtBQUFBLE1BQ0UsZUFBZSxZQUFZLEdBQVosRUFEakI7O0FBR0EsV0FBUyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUMxQixtQkFBZSxLQUFLLEVBQUwsSUFBVyxrQkFBa0IsZUFBZSxZQUFqQyxDQUFYLENBQWY7QUFDQSxRQUFJLGVBQWUsS0FBSyxFQUF4QixFQUE0QixPQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7QUFDNUIsUUFBSSxPQUFPLE9BQVAsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDMUIsV0FBTyxRQUFQLENBQ0UsQ0FERixFQUVFLEtBQUssS0FBTCxDQUFXLGVBQWUsZUFBZSxLQUFLLEdBQUwsQ0FBUyxXQUFULENBQXpDLENBRkY7QUFJQSxtQkFBZSxZQUFmO0FBQ0EsV0FBTyxxQkFBUCxDQUE2QixJQUE3QjtBQUNEOztBQUVELFNBQU8scUJBQVAsQ0FBNkIsSUFBN0I7QUFDRDtBQUNEOzs7Ozs7Ozs7Ozs7OztBQWNBLFNBQVMsV0FBVCxHQUF1QjtBQUNyQjtBQUNBLE1BQU0sZUFBZSxTQUFTLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXJCOztBQUVBO0FBQ0EsTUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDeEIsaUJBQWEsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsbUJBQXZDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLG1CQUFULENBQTZCLEdBQTdCLEVBQWtDO0FBQ2hDO0FBQ0EsUUFBSSxjQUFKO0FBQ0EsOEJBQTBCLElBQTFCOztBQUVBO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTLFdBQVQsR0FBdUI7QUFDckIsVUFBUSxHQUFSLENBQVksYUFBWjs7QUFFQTtBQUNBLE1BQU0sZ0JBQWdCLFNBQVMsZ0JBQVQsQ0FDcEIsK0JBRG9CLENBQXRCOztBQUlBLFNBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBVztBQUMzQyxRQUFJLElBQ0YsT0FBTyxVQUFQLElBQ0EsU0FBUyxlQUFULENBQXlCLFdBRHpCLElBRUEsU0FBUyxJQUFULENBQWMsV0FIaEI7QUFJQSxRQUFJLElBQUksSUFBUixFQUFjO0FBQ1osVUFBSSxVQUFKO0FBQ0EsV0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLGNBQWMsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsc0JBQWMsQ0FBZCxFQUFpQixZQUFqQixDQUE4QixVQUE5QixFQUEwQyxJQUExQztBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxLQUFLLElBQVQsRUFBZTtBQUNiLFVBQUksV0FBSjtBQUNBLFdBQUssS0FBSSxDQUFULEVBQVksS0FBSSxjQUFjLE1BQTlCLEVBQXNDLElBQXRDLEVBQTJDO0FBQ3pDLHNCQUFjLEVBQWQsRUFBaUIsZUFBakIsQ0FBaUMsVUFBakM7QUFDRDtBQUNGO0FBQ0YsR0FsQkQ7QUFtQkQ7O1FBRVEsVyxHQUFBLFc7UUFBYSxXLEdBQUEsVzs7Ozs7Ozs7QUM1RnRCOztBQUVBLFNBQVMsUUFBVCxHQUFvQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxNQUFJLFVBQVUsRUFBRSxjQUFGLEVBQ1gsR0FEVyxDQUNQLFlBRE8sRUFFWCxHQUZXLENBRVAsYUFGTyxDQUFkOztBQUlBLE1BQUkscUJBQXFCLEVBQXpCO0FBQ0E7QUFDQSxVQUFRLEtBQVIsQ0FBYyxjQUFkOztBQUVBO0FBQ0EsV0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQStCO0FBQzdCO0FBQ0EsUUFDRSxTQUFTLFFBQVQsQ0FBa0IsT0FBbEIsQ0FBMEIsS0FBMUIsRUFBaUMsRUFBakMsS0FDRSxLQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLENBREYsSUFFQSxTQUFTLFFBQVQsSUFBcUIsS0FBSyxRQUg1QixFQUlFO0FBQ0E7QUFDQSxVQUFJLFNBQVMsRUFBRSxLQUFLLElBQVAsQ0FBYjtBQUNBLGVBQVMsT0FBTyxNQUFQLEdBQWdCLE1BQWhCLEdBQXlCLEVBQUUsV0FBVyxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLENBQWhCLENBQVgsR0FBZ0MsR0FBbEMsQ0FBbEM7QUFDQTtBQUNBLFVBQUksT0FBTyxNQUFYLEVBQW1CO0FBQ2pCO0FBQ0EsY0FBTSxjQUFOO0FBQ0EsVUFBRSxZQUFGLEVBQWdCLE9BQWhCLENBQ0U7QUFDRSxxQkFBVyxPQUFPLE1BQVAsR0FBZ0IsR0FBaEIsR0FBc0I7QUFEbkMsU0FERixFQUlFLElBSkYsRUFLRSxZQUFXO0FBQ1Q7QUFDQTtBQUNBLGNBQUksVUFBVSxFQUFFLE1BQUYsQ0FBZDtBQUNBLGtCQUFRLEtBQVI7QUFDQSxjQUFJLFFBQVEsRUFBUixDQUFXLFFBQVgsQ0FBSixFQUEwQjtBQUN4QjtBQUNBLG1CQUFPLEtBQVA7QUFDRCxXQUhELE1BR087QUFDTCxvQkFBUSxJQUFSLENBQWEsVUFBYixFQUF5QixJQUF6QixFQURLLENBQzJCO0FBQ2hDLG9CQUFRLEtBQVIsR0FGSyxDQUVZO0FBQ2xCO0FBQ0YsU0FqQkg7QUFtQkQ7QUFDRjtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxJQUFJLEVBQUUsZUFBRixFQUFtQixNQUFuQixHQUE0QixDQUFoQyxFQUFtQztBQUNqQyxNQUFJLFNBQVMsRUFBRSxlQUFGLEVBQW1CLE1BQW5CLEdBQTRCLEdBQTVCLEdBQWtDLEdBQS9DO0FBQ0EsSUFBRSxRQUFGLEVBQVksTUFBWixDQUFtQixZQUFXO0FBQzVCLFFBQUksRUFBRSxNQUFGLEVBQVUsU0FBVixNQUF5QixNQUE3QixFQUFxQztBQUNuQyxRQUFFLGdCQUFGLEVBQW9CLElBQXBCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsUUFBRSxnQkFBRixFQUFvQixJQUFwQjtBQUNEO0FBQ0YsR0FORDtBQU9EOztRQUVRLFEsR0FBQSxROzs7Ozs7OztBQ2pFVCxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQ0UsU0FBUyxXQUFULEdBQ0ksU0FBUyxVQUFULEtBQXdCLFVBRDVCLEdBRUksU0FBUyxVQUFULEtBQXdCLFNBSDlCLEVBSUU7QUFDQTtBQUNELEdBTkQsTUFNTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7UUFFUSxLLEdBQUEsSzs7Ozs7Ozs7QUNaVCxTQUFTLGVBQVQsR0FBMkI7QUFDekI7QUFDQSxNQUFJLFNBQVMsU0FBUyxhQUFULENBQXVCLGdCQUF2QixDQUFiO0FBQ0EsTUFBSSxTQUFTLFNBQVMsYUFBVCxDQUF1QixnQkFBdkIsQ0FBYjs7QUFFQTtBQUNBLE1BQUksVUFBVSxJQUFWLElBQWtCLFVBQVUsSUFBaEMsRUFBc0M7QUFDcEMsV0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxXQUFqQztBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsV0FBakM7QUFDRDs7QUFFRDtBQUNBLFdBQVMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN4QixRQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsVUFBVjs7QUFFQSxZQUFRLEdBQVIsQ0FBWSxHQUFaOztBQUVBO0FBQ0EsUUFBSSxTQUFTLGdCQUFULENBQTBCLHFCQUExQixDQUFKO0FBQ0EsU0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEVBQUUsTUFBbEIsRUFBMEIsR0FBMUIsRUFBK0I7QUFDN0IsUUFBRSxDQUFGLEVBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsTUFBckI7QUFDRDs7QUFFRDtBQUNBLGlCQUFhLFNBQVMsZ0JBQVQsQ0FBMEIscUJBQTFCLENBQWI7QUFDQSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksRUFBRSxNQUFsQixFQUEwQixHQUExQixFQUErQjtBQUM3QixpQkFBVyxDQUFYLEVBQWMsU0FBZCxHQUEwQixXQUFXLENBQVgsRUFBYyxTQUFkLENBQXdCLE9BQXhCLENBQWdDLFNBQWhDLEVBQTJDLEVBQTNDLENBQTFCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFFBQUksVUFBVSxJQUFJLGFBQUosQ0FBa0IsWUFBbEIsQ0FBK0IsY0FBL0IsQ0FBZDtBQUNBLGFBQVMsYUFBVCxDQUF1QixVQUFVLE9BQWpDLEVBQTBDLEtBQTFDLENBQWdELE9BQWhELEdBQTBELE9BQTFEO0FBQ0EsUUFBSSxhQUFKLENBQWtCLFNBQWxCLElBQStCLFNBQS9CO0FBQ0Q7QUFDRjs7UUFFUSxlLEdBQUEsZTs7Ozs7Ozs7QUNyQ1Q7O0FBRUEsU0FBUyxRQUFULEdBQW9CO0FBQ2xCO0FBQ0EsSUFBRSxZQUFGLEVBQWdCLEtBQWhCLENBQXNCLFVBQVMsQ0FBVCxFQUFZO0FBQ2hDLE1BQUUsY0FBRjtBQUNBLE1BQUUsSUFBRixFQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0QsR0FIRDs7QUFLQTtBQUNBO0FBQ0EsTUFBSSxFQUFFLE9BQUYsRUFBVyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLE1BQUUsSUFBRixDQUFPO0FBQ0wsWUFBTSxLQUREO0FBRUwsV0FBSyxnQkFGQTtBQUdMLGVBQVMsaUJBQVMsSUFBVCxFQUFlO0FBQ3RCO0FBQ0EsVUFBRSxJQUFGLENBQU8sSUFBUCxFQUFhLFVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQjtBQUNoQztBQUNBLDJCQUFjLElBQUksRUFBbEIsVUFDRyxJQURILENBQ1EsTUFEUixFQUVHLElBRkgsQ0FFUSxJQUFJLEtBRlo7O0FBSUE7QUFDQSxrQkFBTSxJQUFJLEVBQVYsRUFDRyxJQURILENBQ1EsSUFEUixFQUVHLElBRkgsQ0FFUSxJQUFJLFVBRlo7O0FBSUE7QUFDQSxZQUFFLElBQUYsQ0FBTyxJQUFJLEdBQVgsRUFBZ0IsVUFBUyxNQUFULEVBQWlCLEVBQWpCLEVBQXFCO0FBQ25DLGNBQUUsbUJBQUYsUUFBMkIsSUFBSSxFQUEvQixFQUFxQyxNQUFyQyx1Q0FDc0MsR0FBRyxRQUR6Qyx3SEFJTyxHQUFHLE1BSlY7QUFTRCxXQVZEO0FBV0QsU0F2QkQ7QUF3QkQsT0E3Qkk7QUE4QkwsYUFBTyxlQUFTLEdBQVQsRUFBYyxNQUFkLEVBQXNCLE1BQXRCLEVBQTZCO0FBQ2xDLGdCQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLE1BQXZCO0FBQ0Q7QUFoQ0ksS0FBUCxFQUR5QixDQWtDckI7O0FBRUosTUFBRSxnQ0FBRixFQUFvQyxRQUFwQyxDQUNFLGdCQURGLEVBRUUsT0FGRixFQUdFLFVBQVMsR0FBVCxFQUFjO0FBQ1o7O0FBRUEsVUFBSSxhQUFKLENBQWtCLFNBQWxCLENBQTRCLE1BQTVCLENBQW1DLFFBQW5DOztBQUVBO0FBQ0EsVUFBSSxRQUFRLElBQUksYUFBSixDQUFrQixrQkFBOUI7QUFDQSxVQUFJLE1BQU0sS0FBTixDQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGNBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsSUFBeEI7QUFDQSxjQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLEdBQXhCO0FBQ0EsY0FBTSxLQUFOLENBQVksWUFBWixHQUEyQixHQUEzQjtBQUNELE9BSkQsTUFJTztBQUNMLGNBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsTUFBTSxZQUFOLEdBQXFCLElBQTdDO0FBQ0EsY0FBTSxLQUFOLENBQVksU0FBWixHQUF3QixPQUF4QjtBQUNBLGNBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsTUFBM0I7QUFDRDtBQUNGLEtBbkJIO0FBcUJEOztBQUVEO0FBQ0EsTUFBSSxFQUFFLGVBQUYsRUFBbUIsTUFBbkIsR0FBNEIsQ0FBaEMsRUFBbUM7QUFDakMsUUFBSSxPQUFPLEVBQUUsZUFBRixFQUNSLElBRFEsQ0FDSCxNQURHLEVBRVIsT0FGUSxDQUVBLElBRkEsRUFFTSxFQUZOLENBQVg7O0FBSUEsWUFBUSxHQUFSLFdBQW9CLElBQXBCOztBQUVBLE1BQUUsSUFBRixDQUFPO0FBQ0wsWUFBTSxLQUREO0FBRUwscUJBQWEsSUFBYixlQUZLO0FBR0wsZUFBUyxpQkFBUyxJQUFULEVBQWU7QUFDdEI7QUFDQSxVQUFFLElBQUYsQ0FBTyxJQUFQLEVBQWEsVUFBUyxNQUFULEVBQWlCLEdBQWpCLEVBQXNCO0FBQ2pDLGtCQUFRLEdBQVIsT0FBZ0IsSUFBSSxFQUFwQjtBQUNBLFlBQUUsbUJBQUYsRUFBdUIsTUFBdkIsdUNBQ3NDLElBQUksUUFEMUMscUhBSVEsSUFBSSxNQUpaO0FBU0QsU0FYRDs7QUFhQTtBQUNBLFVBQUUsc0JBQUYsRUFBMEIsSUFBMUI7QUFDRCxPQXBCSTtBQXFCTCxhQUFPLGVBQVMsR0FBVCxFQUFjLE1BQWQsRUFBc0IsT0FBdEIsRUFBNkI7QUFDbEMsZ0JBQVEsR0FBUixDQUFZLFNBQVosRUFBdUIsT0FBdkI7QUFDRDtBQXZCSSxLQUFQLEVBUGlDLENBK0I3Qjs7QUFFSixNQUFFLGdDQUFGLEVBQW9DLFFBQXBDLENBQ0UsZ0JBREYsRUFFRSxPQUZGLEVBR0UsVUFBUyxHQUFULEVBQWM7QUFDWjs7QUFFQSxVQUFJLGFBQUosQ0FBa0IsU0FBbEIsQ0FBNEIsTUFBNUIsQ0FBbUMsUUFBbkM7O0FBRUE7QUFDQSxVQUFJLFFBQVEsSUFBSSxhQUFKLENBQWtCLGtCQUE5QjtBQUNBLFVBQUksTUFBTSxLQUFOLENBQVksU0FBaEIsRUFBMkI7QUFDekIsY0FBTSxLQUFOLENBQVksU0FBWixHQUF3QixJQUF4QjtBQUNBLGNBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsR0FBeEI7QUFDQSxjQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLEdBQTNCO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsY0FBTSxLQUFOLENBQVksU0FBWixHQUF3QixNQUFNLFlBQU4sR0FBcUIsSUFBN0M7QUFDQSxjQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE9BQXhCO0FBQ0EsY0FBTSxLQUFOLENBQVksWUFBWixHQUEyQixNQUEzQjtBQUNEO0FBQ0YsS0FuQkg7QUFxQkQ7QUFDRjs7UUFFUSxRLEdBQUEsUTs7Ozs7QUNoSVQ7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsUUFBUSxHQUFSLENBQWUsNEJBQWYsU0FBNEIsbUJBQTVCOztBQUVBLElBQUksbUJBQW1CLElBQXZCOztBQUVBLFNBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUksb0JBQW9CLElBQXhCLEVBQThCO0FBQzVCLG9DQUFhLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFiLEVBQWlELGdCQUFqRDtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsa0JBQU0sS0FBTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIG1vZHVsZSBcIkFjY29yZGlvbi5qc1wiXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBhY2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJ0bicpO1xuXG4gIC8vIEJpbmQgRXZlbnRzXG4gIGxldCBpO1xuICBmb3IgKGkgPSAwOyBpIDwgYWNjLmxlbmd0aDsgaSsrKSB7XG4gICAgYWNjW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjb3JkaW9uSGFuZGxlcik7XG4gIH1cblxuICAvLyBFdmVudCBIYW5kbGVyc1xuICBmdW5jdGlvbiBhY2NvcmRpb25IYW5kbGVyKGV2dCkge1xuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG4gICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblxuICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXG4gICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xuICAgIH1cbiAgfVxufVxuZXhwb3J0IHsgQWNjb3JkaW9uIH07XG4iLCIvLyBtb2R1bGUgXCJBdXRvQ29tcGxldGUuanNcIlxuXG4vKipcbiAqIFtBdXRvQ29tcGxldGUgZGVzY3JpcHRpb25dXG4gKlxuICogQHBhcmFtICAge3N0cmluZ30gIHVzZXJJbnB1dCAgdXNlciBpbnB1dFxuICogQHBhcmFtICAge2FycmF5fSAgc2VhcmNoTGlzdCAgc2VhcmNoIGxpc3RcbiAqXG4gKiBAcmV0dXJuICB7W3R5cGVdfSAgICAgICBbcmV0dXJuIGRlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBBdXRvQ29tcGxldGUoaW5wLCBhcnIpIHtcbiAgdmFyIGN1cnJlbnRGb2N1cztcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIHdyaXRlcyBpbiB0aGUgdGV4dCBmaWVsZDoqL1xuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGEsXG4gICAgICBiLFxuICAgICAgaSxcbiAgICAgIHZhbCA9IHRoaXMudmFsdWU7XG4gICAgLypjbG9zZSBhbnkgYWxyZWFkeSBvcGVuIGxpc3RzIG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzKi9cbiAgICBjbG9zZUFsbExpc3RzKCk7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY3VycmVudEZvY3VzID0gLTE7XG4gICAgLypjcmVhdGUgYSBESVYgZWxlbWVudCB0aGF0IHdpbGwgY29udGFpbiB0aGUgaXRlbXMgKHZhbHVlcyk6Ki9cbiAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgYS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCArICdhdXRvY29tcGxldGUtbGlzdCcpO1xuICAgIGEuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhdXRvY29tcGxldGUtaXRlbXMnKTtcbiAgICAvKmFwcGVuZCB0aGUgRElWIGVsZW1lbnQgYXMgYSBjaGlsZCBvZiB0aGUgYXV0b2NvbXBsZXRlIGNvbnRhaW5lcjoqL1xuICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChhKTtcbiAgICAvKmZvciBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5Li4uKi9cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvKmNoZWNrIGlmIHRoZSBpdGVtIHN0YXJ0cyB3aXRoIHRoZSBzYW1lIGxldHRlcnMgYXMgdGhlIHRleHQgZmllbGQgdmFsdWU6Ki9cbiAgICAgIGlmIChhcnJbaV0uc3Vic3RyKDAsIHZhbC5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT0gdmFsLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgLypjcmVhdGUgYSBESVYgZWxlbWVudCBmb3IgZWFjaCBtYXRjaGluZyBlbGVtZW50OiovXG4gICAgICAgIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICAgICAgLyptYWtlIHRoZSBtYXRjaGluZyBsZXR0ZXJzIGJvbGQ6Ki9cbiAgICAgICAgYi5pbm5lckhUTUwgPSAnPHN0cm9uZz4nICsgYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKSArICc8L3N0cm9uZz4nO1xuICAgICAgICBiLmlubmVySFRNTCArPSBhcnJbaV0uc3Vic3RyKHZhbC5sZW5ndGgpO1xuICAgICAgICAvKmluc2VydCBhIGlucHV0IGZpZWxkIHRoYXQgd2lsbCBob2xkIHRoZSBjdXJyZW50IGFycmF5IGl0ZW0ncyB2YWx1ZToqL1xuICAgICAgICBiLmlubmVySFRNTCArPSBcIjxpbnB1dCB0eXBlPSdoaWRkZW4nIHZhbHVlPSdcIiArIGFycltpXSArIFwiJz5cIjtcbiAgICAgICAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIGNsaWNrcyBvbiB0aGUgaXRlbSB2YWx1ZSAoRElWIGVsZW1lbnQpOiovXG4gICAgICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLyppbnNlcnQgdGhlIHZhbHVlIGZvciB0aGUgYXV0b2NvbXBsZXRlIHRleHQgZmllbGQ6Ki9cbiAgICAgICAgICBpbnAudmFsdWUgPSB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpWzBdLnZhbHVlO1xuICAgICAgICAgIC8qY2xvc2UgdGhlIGxpc3Qgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXMsXG4gICAgICAgICAgICAob3IgYW55IG90aGVyIG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXM6Ki9cbiAgICAgICAgICBjbG9zZUFsbExpc3RzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhLmFwcGVuZENoaWxkKGIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHByZXNzZXMgYSBrZXkgb24gdGhlIGtleWJvYXJkOiovXG4gIGlucC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCArICdhdXRvY29tcGxldGUtbGlzdCcpO1xuICAgIGlmICh4KSB4ID0geC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2Jyk7XG4gICAgaWYgKGUua2V5Q29kZSA9PSA0MCkge1xuICAgICAgLypJZiB0aGUgYXJyb3cgRE9XTiBrZXkgaXMgcHJlc3NlZCxcbiAgICAgIGluY3JlYXNlIHRoZSBjdXJyZW50Rm9jdXMgdmFyaWFibGU6Ki9cbiAgICAgIGN1cnJlbnRGb2N1cysrO1xuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cbiAgICAgIGFkZEFjdGl2ZSh4KTtcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAzOCkge1xuICAgICAgLy91cFxuICAgICAgLypJZiB0aGUgYXJyb3cgVVAga2V5IGlzIHByZXNzZWQsXG4gICAgICBkZWNyZWFzZSB0aGUgY3VycmVudEZvY3VzIHZhcmlhYmxlOiovXG4gICAgICBjdXJyZW50Rm9jdXMtLTtcbiAgICAgIC8qYW5kIGFuZCBtYWtlIHRoZSBjdXJyZW50IGl0ZW0gbW9yZSB2aXNpYmxlOiovXG4gICAgICBhZGRBY3RpdmUoeCk7XG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgIC8qSWYgdGhlIEVOVEVSIGtleSBpcyBwcmVzc2VkLCBwcmV2ZW50IHRoZSBmb3JtIGZyb20gYmVpbmcgc3VibWl0dGVkLCovXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoY3VycmVudEZvY3VzID4gLTEpIHtcbiAgICAgICAgLyphbmQgc2ltdWxhdGUgYSBjbGljayBvbiB0aGUgXCJhY3RpdmVcIiBpdGVtOiovXG4gICAgICAgIGlmICh4KSB4W2N1cnJlbnRGb2N1c10uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBhZGRBY3RpdmUoeCkge1xuICAgIC8qYSBmdW5jdGlvbiB0byBjbGFzc2lmeSBhbiBpdGVtIGFzIFwiYWN0aXZlXCI6Ki9cbiAgICBpZiAoIXgpIHJldHVybiBmYWxzZTtcbiAgICAvKnN0YXJ0IGJ5IHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzIG9uIGFsbCBpdGVtczoqL1xuICAgIHJlbW92ZUFjdGl2ZSh4KTtcbiAgICBpZiAoY3VycmVudEZvY3VzID49IHgubGVuZ3RoKSBjdXJyZW50Rm9jdXMgPSAwO1xuICAgIGlmIChjdXJyZW50Rm9jdXMgPCAwKSBjdXJyZW50Rm9jdXMgPSB4Lmxlbmd0aCAtIDE7XG4gICAgLyphZGQgY2xhc3MgXCJhdXRvY29tcGxldGUtYWN0aXZlXCI6Ki9cbiAgICB4W2N1cnJlbnRGb2N1c10uY2xhc3NMaXN0LmFkZCgnYXV0b2NvbXBsZXRlLWFjdGl2ZScpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZUFjdGl2ZSh4KSB7XG4gICAgLyphIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgXCJhY3RpdmVcIiBjbGFzcyBmcm9tIGFsbCBhdXRvY29tcGxldGUgaXRlbXM6Ki9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIHhbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYXV0b2NvbXBsZXRlLWFjdGl2ZScpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjbG9zZUFsbExpc3RzKGVsbW50KSB7XG4gICAgLypjbG9zZSBhbGwgYXV0b2NvbXBsZXRlIGxpc3RzIGluIHRoZSBkb2N1bWVudCxcbiAgZXhjZXB0IHRoZSBvbmUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50OiovXG4gICAgdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRvY29tcGxldGUtaXRlbXMnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChlbG1udCAhPSB4W2ldICYmIGVsbW50ICE9IGlucCkge1xuICAgICAgICB4W2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoeFtpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSBjbGlja3MgaW4gdGhlIGRvY3VtZW50OiovXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGNsb3NlQWxsTGlzdHMoZS50YXJnZXQpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgQXV0b0NvbXBsZXRlIH07XG4iLCJmdW5jdGlvbiBDb3VudHJ5U2VsZWN0b3IoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9fdXAnKTtcbiAgbGV0IGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9fZG93bicpO1xuICBsZXQgaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRyeS1zY3JvbGxlcl9faXRlbXMnKTtcbiAgbGV0IGl0ZW1IZWlnaHQgPVxuICAgIGl0ZW1zICE9IG51bGwgPyBpdGVtcy5maXJzdENoaWxkLm5leHRTaWJsaW5nLm9mZnNldEhlaWdodCA6IDA7XG5cbiAgLy8gYmluZCBldmVudHNcbiAgaWYgKHVwICE9IG51bGwpIHtcbiAgICB1cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbFVwKTtcbiAgICBkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsRG93bik7XG5cbiAgICAvLyBldmVudCBoYW5kbGVyc1xuICAgIGZ1bmN0aW9uIHNjcm9sbFVwKCkge1xuICAgICAgLy8gbW92ZSBpdGVtcyBsaXN0IHVwIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XG4gICAgICBpdGVtcy5zY3JvbGxUb3AgKz0gaXRlbUhlaWdodDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY3JvbGxEb3duKCkge1xuICAgICAgLy8gbW92ZSBpdGVtcyBsaXN0IGRvd24gYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCAtPSBpdGVtSGVpZ2h0O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfTtcbiIsIi8vIG1vZHVsZSBDb3Zlck9wdGlvbnMuanNcblxuZnVuY3Rpb24gQ292ZXJPcHRpb25zKCkge1xuICAvLyBjYWNoZSBET01cbiAgLy8gR2V0IHNpbmdsZSB0cmlwIHByaWNlXG4gIGNvbnN0IGluaXRpYWxDb3ZlclByaWNlID0gcGFyc2VGbG9hdChcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLmFtb3VudCcpLnRleHQoKVxuICApLnRvRml4ZWQoMik7XG4gIGxldCBpbml0aWFsU2luZ2xlVHJpcFByaWNlID0gcGFyc2VGbG9hdChcbiAgICAkKCcuaW5pdGlhbC1zaW5nbGUtdHJpcC1wcmljZScpXG4gICAgICAudGV4dCgpXG4gICAgICAucmVwbGFjZSgvXFxEKi8sICcnKVxuICApLnRvRml4ZWQoMik7XG4gIGxldCBpbnB1dFZhbHVlID0gJyc7XG4gIGNvbnN0IHByaWNlTGltaXQgPSAxMTk7XG4gIGxldCB0b3RhbEluaXRpYWxQcmljZSA9IDA7XG4gIGxldCB0b3RhbFNpbmdsZVByaWNlID0gMDtcbiAgbGV0IGZpbmFsUHJpY2UgPSAwO1xuXG4gIGNvbnNvbGUuY2xlYXIoKTtcbiAgY29uc29sZS5sb2coYGNvdmVyIHByaWNlICR7aW5pdGlhbENvdmVyUHJpY2V9YCk7XG4gIGNvbnNvbGUubG9nKGBjb3ZlciBwcmljZSAke2luaXRpYWxTaW5nbGVUcmlwUHJpY2V9YCk7XG5cbiAgJCgnLnByb2R1Y3Qtb3B0aW9ucy1kYXlzLWNvdmVyJykuY2hhbmdlKGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIGdldCB2YWx1ZVxuICAgIGlucHV0VmFsdWUgPSBwYXJzZUludChldnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG5cbiAgICBpZiAoaW5wdXRWYWx1ZSA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGlucHV0VmFsdWU7IGkgPSBpICsgMSkge1xuICAgICAgICAvLyBjYWxjdWxhdGUgd2l0aCBpbnRpdGFsIGNvdmVyIHByaWNlXG4gICAgICAgIGlmIChpID4gMCAmJiBpIDw9IDMpIHtcbiAgICAgICAgICB0b3RhbEluaXRpYWxQcmljZSA9IGkgKiBpbml0aWFsQ292ZXJQcmljZTtcbiAgICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpID4gMyAmJiBmaW5hbFByaWNlIDwgcHJpY2VMaW1pdCkge1xuICAgICAgICAgIHRvdGFsU2luZ2xlUHJpY2UgPSAoaSAtIDMpICogaW5pdGlhbFNpbmdsZVRyaXBQcmljZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmaW5hbFByaWNlID0gdG90YWxJbml0aWFsUHJpY2UgKyB0b3RhbFNpbmdsZVByaWNlO1xuXG4gICAgY29uc29sZS5sb2coYCR7aW5wdXRWYWx1ZX0gPSAke2ZpbmFsUHJpY2V9YCk7XG4gIH0pO1xuXG4gIGNvbnNvbGUubG9nKGluaXRpYWxDb3ZlclByaWNlKTtcbn1cblxuZXhwb3J0IHsgQ292ZXJPcHRpb25zIH07XG4iLCIvLyBtb2R1bGUgXCJHb29kYnllV29ybGQuanNcIlxuXG5mdW5jdGlvbiBHb29kYnllKCkge1xuICByZXR1cm4gJ0dvb2RieWUnO1xufVxuXG5jb25zdCBXb3JsZCA9ICdXb3JsZCAhISc7XG5cbmV4cG9ydCB7IEdvb2RieWUsIFdvcmxkIH07XG4iLCJmdW5jdGlvbiBUb2dnbGVOYXZpZ2F0aW9uKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IG1haW5OYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbWVudScpO1xuICBsZXQgbmF2QmFyVG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBuYXZCYXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNZW51KTtcblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgIG1haW5OYXYuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gRHJvcGRvd25NZW51KCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY2FyJyk7XG4gIGxldCBkcm9wRG93bk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tLWNhciAuZHJvcGRvd24tbWVudScpO1xuXG4gIGlmIChjYXJCdG4gIT0gbnVsbCAmJiBkcm9wRG93bk1lbnUgIT0gbnVsbCkge1xuICAgIGxldCBkcm9wRG93biA9IGNhckJ0bi5wYXJlbnRFbGVtZW50O1xuICAgIC8vIEJpbmQgZXZlbnRzXG4gICAgY2FyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyQnRuSGFuZGxlcik7XG5cbiAgICAvLyBFdmVudCBoYW5kbGVyc1xuICAgIGZ1bmN0aW9uIGNhckJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgLy8gdG9nZ2xlIGRpc3BsYXlcbiAgICAgIGlmIChcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJydcbiAgICAgICkge1xuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9XG4gICAgICAgICAgZHJvcERvd24ub2Zmc2V0SGVpZ2h0ICsgZHJvcERvd25NZW51Lm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBGaXhlZE5hdmlnYXRpb24oKSB7XG4gIC8vIG1ha2UgbmF2YmFyIHN0aWNreVxuICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxuICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICBteUZ1bmN0aW9uKCk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBoZWFkZXJcbiAgbGV0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZiYXInKTtcblxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXG4gIGxldCBzdGlja3kgPSBuYXZCYXIub2Zmc2V0VG9wO1xuXG4gIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxuICBmdW5jdGlvbiBteUZ1bmN0aW9uKCkge1xuICAgIGxldCBzdGlja3kgPSBuYXZCYXIub2Zmc2V0VG9wO1xuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiBzdGlja3kpIHtcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QuYWRkKCduYXZiYXItZml4ZWQtdG9wJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hdkJhci5jbGFzc0xpc3QucmVtb3ZlKCduYXZiYXItZml4ZWQtdG9wJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIFNlbGVjdFRyaXAoKSB7XG4gIC8vIHNlbGVjdCB2ZWhpY2xlXG4gICQoJy50YWItY2FyIC5idG4nKS5jbGljayhmdW5jdGlvbihldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gICQoJy50YWItY2FyIC5pY29uLXJhZGlvIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgICQoJy50YWItY2FyIC5idG4nKS5yZW1vdmVDbGFzcygnYnRuLWN0YS0tZGlzYWJsZWQnKTtcbiAgICAkKCcudGFiLWNhciAuYnRuJykuYWRkQ2xhc3MoJ2J0bi1jdGEnKTtcbiAgICAkKCcudGFiLWNhciAuYnRuJykudW5iaW5kKCk7XG4gIH0pO1xufVxuXG4vLyBzaG93IG1vYmlsZSBjdXJyZW5jeVxuZnVuY3Rpb24gUmV2ZWFsQ3VycmVuY3koKSB7XG4gICQoJy5jdXJyZW5jeU1vYmlsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdDdXJyZW5jeScpO1xuXG4gICAgJCgnLmN1cnJlbmN5Jykuc2xpZGVUb2dnbGUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIFRvZ2dsZU5hdmlnYXRpb24sXG4gIERyb3Bkb3duTWVudSxcbiAgRml4ZWROYXZpZ2F0aW9uLFxuICBTZWxlY3RUcmlwLFxuICBSZXZlYWxDdXJyZW5jeVxufTtcbiIsImZ1bmN0aW9uIFBvbGljeVN1bW1hcnkoKSB7XG4gIC8vIHBvbGljeSBzdW1tYXJ5XG4gICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICB9KTtcblxuICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5jbGljayhmdW5jdGlvbihldnQpIHtcbiAgICAkKCcuY2FyZC1jb3Zlci1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICAgIC8vIHNob3cgcG9saWN5IHN1bW1hcnlcbiAgICAkKCcucG9saWN5LXN1bW1hcnkgLmluZm8tYm94JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgJChlbGVtZW50KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH0pO1xuICAgIGxldCBwb2xpY3lTdW1tYXJ5ID0gJCh0aGlzKS5kYXRhKCdwb2xpY3knKTtcbiAgICAkKCcuJyArIHBvbGljeVN1bW1hcnkpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgUG9saWN5U3VtbWFyeSB9O1xuIiwiLy8gbW9kdWxlIFJldmVhbERvY3MuanNcblxuZnVuY3Rpb24gUmV2ZWFsRG9jcygpIHtcbiAgLy9Eb2NzXG4gICQoJy5yZXZlYWxkb2NzJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgb24gPSAkKCcuZG9jcycpLmlzKCc6dmlzaWJsZScpO1xuICAgICQodGhpcykuaHRtbChcbiAgICAgIG9uID8gJ1ZpZXcgcG9saWN5IGRvY3VtZW50YXRpb24nIDogJ0hpZGUgcG9saWN5IGRvY3VtZW50YXRpb24nXG4gICAgKTtcbiAgICAkKCcuZG9jcycpLnNsaWRlVG9nZ2xlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBSZXZlYWxEb2NzIH07XG4iLCIvLyBtb2R1bGUgXCJTY3JlZW4uanNcIlxuXG5mdW5jdGlvbiBfc2Nyb2xsVG9Ub3Aoc2Nyb2xsRHVyYXRpb24pIHtcbiAgdmFyIHNjcm9sbFN0ZXAgPSAtd2luZG93LnNjcm9sbFkgLyAoc2Nyb2xsRHVyYXRpb24gLyAxNSksXG4gICAgc2Nyb2xsSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSAhPSAwKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBzY3JvbGxTdGVwKTtcbiAgICAgIH0gZWxzZSBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9LCAxNSk7XG59XG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoc2Nyb2xsRHVyYXRpb24pIHtcbiAgY29uc3QgY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyO1xuICBsZXQgc2Nyb2xsQ291bnQgPSAwLFxuICAgIG9sZFRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIGZ1bmN0aW9uIHN0ZXAobmV3VGltZXN0YW1wKSB7XG4gICAgc2Nyb2xsQ291bnQgKz0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKTtcbiAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSkgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA9PT0gMCkgcmV0dXJuO1xuICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgIDAsXG4gICAgICBNYXRoLnJvdW5kKGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSlcbiAgICApO1xuICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICB9XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbn1cbi8qXG4gIEV4cGxhbmF0aW9uczpcbiAgLSBwaSBpcyB0aGUgbGVuZ3RoL2VuZCBwb2ludCBvZiB0aGUgY29zaW51cyBpbnRlcnZhbGwgKHNlZSBhYm92ZSlcbiAgLSBuZXdUaW1lc3RhbXAgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHRpbWUgd2hlbiBjYWxsYmFja3MgcXVldWVkIGJ5IHJlcXVlc3RBbmltYXRpb25GcmFtZSBiZWdpbiB0byBmaXJlLlxuICAgIChmb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gIC0gbmV3VGltZXN0YW1wIC0gb2xkVGltZXN0YW1wIGVxdWFscyB0aGUgZHVyYXRpb25cblxuICAgIGEgKiBjb3MgKGJ4ICsgYykgKyBkICAgICAgICAgICAgICAgICAgICAgIHwgYyB0cmFuc2xhdGVzIGFsb25nIHRoZSB4IGF4aXMgPSAwXG4gID0gYSAqIGNvcyAoYngpICsgZCAgICAgICAgICAgICAgICAgICAgICAgICAgfCBkIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHkgYXhpcyA9IDEgLT4gb25seSBwb3NpdGl2ZSB5IHZhbHVlc1xuICA9IGEgKiBjb3MgKGJ4KSArIDEgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYSBzdHJldGNoZXMgYWxvbmcgdGhlIHkgYXhpcyA9IGNvc1BhcmFtZXRlciA9IHdpbmRvdy5zY3JvbGxZIC8gMlxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3MgYngpICAgIHwgYiBzdHJldGNoZXMgYWxvbmcgdGhlIHggYXhpcyA9IHNjcm9sbENvdW50ID0gTWF0aC5QSSAvIChzY3JvbGxEdXJhdGlvbiAvIChuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXApKVxuICA9IGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIChjb3Mgc2Nyb2xsQ291bnQgKiB4KVxuKi9cblxuZnVuY3Rpb24gU2Nyb2xsVG9Ub3AoKSB7XG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBiYWNrVG9Ub3BCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYmFjay10by10b3AnKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBpZiAoYmFja1RvVG9wQnRuICE9IG51bGwpIHtcbiAgICBiYWNrVG9Ub3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBiYWNrVG9Ub3BCdG5IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGJhY2tUb1RvcEJ0bkhhbmRsZXIoZXZ0KSB7XG4gICAgLy8gQW5pbWF0ZSB0aGUgc2Nyb2xsIHRvIHRvcFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9zY3JvbGxUb1RvcEVhc2VJbkVhc2VPdXQoMTAwMCk7XG5cbiAgICAvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAzMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdpbmRvd1dpZHRoKCkge1xuICBjb25zb2xlLmxvZygnV2luZG93V2lkdGgnKTtcblxuICAvLyBjYWNoZSBET01cbiAgY29uc3QgYWNjb3JkaW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgJy5jYXJkLXByb2R1Y3RzIC5hY2NvcmRpb24tYnRuJ1xuICApO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdyA9XG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCB8fFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgIGlmICh3ID4gMTIwMCkge1xuICAgICAgbGV0IGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYWNjb3JkaW9uQnRucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhY2NvcmRpb25CdG5zW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodyA8PSAxMjAwKSB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9O1xuIiwiLy8gbW9kdWxlIFwiU2Nyb2xsVG8uanNcIlxuXG5mdW5jdGlvbiBTY3JvbGxUbygpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIC8vIFNlbGVjdCBhbGwgbGlua3Mgd2l0aCBoYXNoZXNcbiAgLy8gUmVtb3ZlIGxpbmtzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgbGluayB0byBhbnl0aGluZ1xuICBsZXQgYW5jaG9ycyA9ICQoJ2FbaHJlZio9XCIjXCJdJylcbiAgICAubm90KCdbaHJlZj1cIiNcIl0nKVxuICAgIC5ub3QoJ1tocmVmPVwiIzBcIl0nKTtcblxuICBsZXQgaGVpZ2h0Q29tcGVuc2F0aW9uID0gNjA7XG4gIC8vIEJpbmQgRXZlbnRzXG4gIGFuY2hvcnMuY2xpY2soYW5jaG9yc0hhbmRsZXIpO1xuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGFuY2hvcnNIYW5kbGVyKGV2ZW50KSB7XG4gICAgLy8gT24tcGFnZSBsaW5rc1xuICAgIGlmIChcbiAgICAgIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgPT1cbiAgICAgICAgdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywgJycpICYmXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lXG4gICAgKSB7XG4gICAgICAvLyBGaWd1cmUgb3V0IGVsZW1lbnQgdG8gc2Nyb2xsIHRvXG4gICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xuICAgICAgLy8gRG9lcyBhIHNjcm9sbCB0YXJnZXQgZXhpc3Q/XG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICAvLyBPbmx5IHByZXZlbnQgZGVmYXVsdCBpZiBhbmltYXRpb24gaXMgYWN0dWFsbHkgZ29ubmEgaGFwcGVuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIGhlaWdodENvbXBlbnNhdGlvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgMTAwMCxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gTXVzdCBjaGFuZ2UgZm9jdXMhXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQodGFyZ2V0KTtcbiAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCc6Zm9jdXMnKSkge1xuICAgICAgICAgICAgICAvLyBDaGVja2luZyBpZiB0aGUgdGFyZ2V0IHdhcyBmb2N1c2VkXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICR0YXJnZXQuYXR0cigndGFiaW5kZXgnLCAnLTEnKTsgLy8gQWRkaW5nIHRhYmluZGV4IGZvciBlbGVtZW50cyBub3QgZm9jdXNhYmxlXG4gICAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTsgLy8gU2V0IGZvY3VzIGFnYWluXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBvbiBzY3JvbGxcbmlmICgkKCcuYXJ0aWNsZS1tYWluJykubGVuZ3RoID4gMCkge1xuICBsZXQgdGFyZ2V0ID0gJCgnLmFydGljbGUtbWFpbicpLm9mZnNldCgpLnRvcCAtIDE4MDtcbiAgJChkb2N1bWVudCkuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gdGFyZ2V0KSB7XG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnNoYXJlLWJ1dHRvbnMnKS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgU2Nyb2xsVG8gfTtcbiIsImZ1bmN0aW9uIFJlYWR5KGZuKSB7XG4gIGlmIChcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudFxuICAgICAgPyBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXG4gICAgICA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJ1xuICApIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxuZXhwb3J0IHsgUmVhZHkgfTtcbiIsImZ1bmN0aW9uIFZlaGljbGVTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBjYXJUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX2NhcicpO1xuICBsZXQgdmFuVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rX192YW4nKTtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAoY2FyVGFiICE9IG51bGwgJiYgdmFuVGFiICE9IG51bGwpIHtcbiAgICBjYXJUYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gICAgdmFuVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlblZlaGljbGUpO1xuICB9XG5cbiAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gb3BlblZlaGljbGUoZXZ0KSB7XG4gICAgdmFyIGksIHgsIHRhYkJ1dHRvbnM7XG5cbiAgICBjb25zb2xlLmxvZyhldnQpO1xuXG4gICAgLy8gaGlkZSBhbGwgdGFiIGNvbnRlbnRzXG4gICAgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItY29udGFpbmVyIC50YWInKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgeFtpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGUgaGlnaGxpZ2h0IG9uIHRoZSB0YWIgYnV0dG9uXG4gICAgdGFiQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtdGFicyAubmF2LWxpbmsnKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgdGFiQnV0dG9uc1tpXS5jbGFzc05hbWUgPSB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKCcgYWN0aXZlJywgJycpO1xuICAgIH1cblxuICAgIC8vIGhpZ2hsaWdodCB0YWIgYnV0dG9uIGFuZFxuICAgIC8vIHNob3cgdGhlIHNlbGVjdGVkIHRhYiBjb250ZW50XG4gICAgbGV0IHZlaGljbGUgPSBldnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmVoaWNsZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItJyArIHZlaGljbGUpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZSArPSAnIGFjdGl2ZSc7XG4gIH1cbn1cblxuZXhwb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH07XG4iLCIvLyBtb2R1bGUgXCJMb2FkRkFRcy5qc1wiXG5cbmZ1bmN0aW9uIExvYWRGQVFzKCkge1xuICAvLyBsb2FkIGZhcXNcbiAgJCgnI2ZhcVRhYnMgYScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCh0aGlzKS50YWIoJ3Nob3cnKTtcbiAgfSk7XG5cbiAgLy8gbG9hZCBmYXFzXG4gIC8vIG9ubHkgbG9hZCBpZiBvbiBmYXFzIHBhZ2VcbiAgaWYgKCQoJyNmYXFzJykubGVuZ3RoID4gMCkge1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnR0VUJyxcbiAgICAgIHVybDogJy9hcGkvZmFxcy5qc29uJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSBoZWFkc1xuICAgICAgICAkLmVhY2goZmFxcywgZnVuY3Rpb24oaW5kZXgsIGZhcSkge1xuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgZGVza3RvcFxuICAgICAgICAgICQoYGFbaHJlZj0nIyR7ZmFxLmlkfSddYClcbiAgICAgICAgICAgIC5maW5kKCdzcGFuJylcbiAgICAgICAgICAgIC50ZXh0KGZhcS50aXRsZSk7XG5cbiAgICAgICAgICAvLyBhZGQgdGl0bGUgZm9yIG1vYmlsZVxuICAgICAgICAgICQoYCMke2ZhcS5pZH1gKVxuICAgICAgICAgICAgLmZpbmQoJ2gzJylcbiAgICAgICAgICAgIC50ZXh0KGZhcS5zaG9ydFRpdGxlKTtcblxuICAgICAgICAgIC8vIGdldCB0aGUgYm9keVxuICAgICAgICAgICQuZWFjaChmYXEucWFzLCBmdW5jdGlvbihmSW5kZXgsIHFhKSB7XG4gICAgICAgICAgICAkKCcuaW5uZXIgLmFjY29yZGlvbicsIGAjJHtmYXEuaWR9YCkuYXBwZW5kKFxuICAgICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke3FhLnF1ZXN0aW9ufTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgJHtxYS5hbnN3ZXJ9XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7IC8vICRhamF4XG5cbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXG4gICAgICAnY2xpY2snLFxuICAgICAgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG4gICAgICAgICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICAgICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgLy8gb25seSBsb2FkIGlmIG9uIHByb2R1Y3QgZmFxcyBwYWdlXG4gIGlmICgkKCcucHJvZHVjdC1mYXFzJykubGVuZ3RoID4gMCkge1xuICAgIGxldCBmaWxlID0gJCgnLnByb2R1Y3QtZmFxcycpXG4gICAgICAuZGF0YSgnZmFxcycpXG4gICAgICAucmVwbGFjZSgnJi0nLCAnJyk7XG5cbiAgICBjb25zb2xlLmxvZyhgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmApO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgdXJsOiBgL2FwaS8ke2ZpbGV9LWZhcXMuanNvbmAsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihmYXFzKSB7XG4gICAgICAgIC8vIGdldCB0aGUgYm9keVxuICAgICAgICAkLmVhY2goZmFxcywgZnVuY3Rpb24oZkluZGV4LCBmYXEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgIyR7ZmFxLmlkfWApO1xuICAgICAgICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJykuYXBwZW5kKFxuICAgICAgICAgICAgYDxidXR0b24gY2xhc3M9XCJhY2NvcmRpb24tYnRuIGg0XCI+JHtmYXEucXVlc3Rpb259PC9idXR0b24+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAke2ZhcS5hbnN3ZXJ9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNob3cgY29udGVudFxuICAgICAgICAkKCcuZmFxLWFuc3dlcnMtcHJvZHVjdCcpLnNob3coKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0pOyAvLyAkYWpheFxuXG4gICAgJCgnLmZhcS1hbnN3ZXJzIC5pbm5lciAuYWNjb3JkaW9uJykuZGVsZWdhdGUoXG4gICAgICAnLmFjY29yZGlvbi1idG4nLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgICAgICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGhpZGluZyBhbmQgc2hvd2luZyB0aGUgYWN0aXZlIHBhbmVsICovXG4gICAgICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzE4cHgnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgeyBMb2FkRkFRcyB9O1xuIiwiaW1wb3J0IHsgR29vZGJ5ZSwgV29ybGQgfSBmcm9tICcuL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkJztcbmltcG9ydCB7IFNjcm9sbFRvVG9wLCBXaW5kb3dXaWR0aCB9IGZyb20gJy4vY29tcG9uZW50cy9TY3JlZW4nO1xuaW1wb3J0IHsgQWNjb3JkaW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbic7XG5pbXBvcnQgeyBDb3VudHJ5U2VsZWN0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvQ291bnRyeVNlbGVjdG9yJztcbmltcG9ydCB7IFZlaGljbGVTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9WZWhpY2xlU2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgVG9nZ2xlTmF2aWdhdGlvbixcbiAgRHJvcGRvd25NZW51LFxuICBGaXhlZE5hdmlnYXRpb24sXG4gIFNlbGVjdFRyaXAsXG4gIFJldmVhbEN1cnJlbmN5XG59IGZyb20gJy4vY29tcG9uZW50cy9OYXZpZ2F0aW9uJztcbmltcG9ydCB7IFNjcm9sbFRvIH0gZnJvbSAnLi9jb21wb25lbnRzL1Njcm9sbFRvJztcbmltcG9ydCB7IEF1dG9Db21wbGV0ZSB9IGZyb20gJy4vY29tcG9uZW50cy9BdXRvQ29tcGxldGUnO1xuaW1wb3J0IHsgTG9hZEZBUXMgfSBmcm9tICcuL2NvbXBvbmVudHMvZmFxcyc7XG5pbXBvcnQgeyBSZXZlYWxEb2NzIH0gZnJvbSAnLi9jb21wb25lbnRzL1JldmVhbERvY3MnO1xuaW1wb3J0IHsgQ292ZXJPcHRpb25zIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvdmVyT3B0aW9ucyc7XG5pbXBvcnQgeyBSZWFkeSB9IGZyb20gJy4vY29tcG9uZW50cy9VdGlscyc7XG5pbXBvcnQgeyBQb2xpY3lTdW1tYXJ5IH0gZnJvbSAnLi9jb21wb25lbnRzL1BvbGljeVN1bW1hcnknO1xuXG5jb25zb2xlLmxvZyhgJHtHb29kYnllKCl9ICR7V29ybGR9IEluZGV4IGZpbGVgKTtcblxubGV0IGNvdW50cmllc0NvdmVyZWQgPSBudWxsO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgQ291bnRyeVNlbGVjdG9yKCk7XG4gIFZlaGljbGVTZWxlY3RvcigpO1xuICBUb2dnbGVOYXZpZ2F0aW9uKCk7XG4gIERyb3Bkb3duTWVudSgpO1xuICBTY3JvbGxUb1RvcCgpO1xuICBGaXhlZE5hdmlnYXRpb24oKTtcbiAgQWNjb3JkaW9uKCk7XG4gIFdpbmRvd1dpZHRoKCk7XG4gIFNjcm9sbFRvKCk7XG4gIGlmIChjb3VudHJpZXNDb3ZlcmVkICE9IG51bGwpIHtcbiAgICBBdXRvQ29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215SW5wdXQnKSwgY291bnRyaWVzQ292ZXJlZCk7XG4gIH1cbiAgTG9hZEZBUXMoKTtcbiAgLy8gUmV2ZWFsRG9jcygpO1xuICBDb3Zlck9wdGlvbnMoKTtcbiAgUG9saWN5U3VtbWFyeSgpO1xuICBTZWxlY3RUcmlwKCk7XG4gIFJldmVhbEN1cnJlbmN5KCk7XG59XG5cblJlYWR5KHN0YXJ0KTtcbiJdfQ==
