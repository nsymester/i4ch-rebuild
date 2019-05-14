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
  var warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
  var coverOptionPrice = $('.card-cover-option:nth-of-type(1) .card-price');
  // Get single trip price
  var initialCoverPrice = $('.card-cover-option:nth-of-type(1) .amount');
  var d_initialCoverPrice = parseFloat(initialCoverPrice.text().replace(/\D*/, '')).toFixed(2);

  var initialSingleTripPrice = $('.initial-single-trip-price');
  var d_initialSingleTripPrice = parseFloat(initialSingleTripPrice.text().replace(/\D*/, '')).toFixed(2);

  var currencySymbol = initialCoverPrice.text().substring(0, 1);
  var inputValue = '';
  var priceLimit = void 0;
  var totalInitialPrice = 0;
  var totalSinglePrice = 0;
  var finalPrice = 0;

  if (currencySymbol == '\xA3') {
    priceLimit = 119;
  } else {
    priceLimit = 142;
  }

  // console.clear();
  // console.log(`cover price: ${d_initialCoverPrice}`);
  // console.log(`Single Trip price: ${d_initialSingleTripPrice}`);
  // console.log(`currencySymbol: ${currencySymbol}`);

  $('.product-options-days-cover').change(function (evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value);

    if (inputValue > 0) {
      // calculate with intital cover price
      if (inputValue > 0 && inputValue <= 3) {
        totalInitialPrice = inputValue * d_initialCoverPrice;
        totalSinglePrice = 0;
      }

      if (inputValue > 3 && finalPrice < priceLimit || priceLimit < finalPrice) {
        totalSinglePrice = (inputValue - 3) * d_initialSingleTripPrice;
      }
    }
    finalPrice = parseFloat(totalInitialPrice + totalSinglePrice).toFixed(2);

    if (finalPrice > priceLimit) {
      initialCoverPrice.text(currencySymbol + parseFloat(priceLimit).toFixed(2));
      // change color of price
      coverOptionPrice.addClass('warning');
      // show warning text
      warningText.show();
    } else {
      initialCoverPrice.text(currencySymbol + finalPrice);
      warningText.hide();
      coverOptionPrice.removeClass('warning');
    }

    // console.log(`${inputValue} = ${finalPrice}`);
  });
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
  var currency = $('.currency');
  var mainNav = document.getElementById('js-menu');
  var navBarToggle = document.getElementById('js-navbar-toggle');
  var currencyNav = document.getElementById('js-currency-toggle');
  var currencyMenuToggle = document.getElementById('js-navbar-toggle');

  // bind events
  navBarToggle.addEventListener('click', toggleMenu);
  currencyMenuToggle.addEventListener('click', toggleCurrencyMenu);

  // event handlers
  function toggleMenu() {
    mainNav.classList.toggle('active');
  }

  function toggleCurrencyMenu() {
    currencyNav.classList.toggle('active');
  }

  if ($(window).width() > '1199') {
    currency.show();
  } else {
    currency.hide();
  }

  $(window).resize(function () {
    if ($(window).width() > '1199') {
      currency.show();
    } else {
      currency.hide();
    }
  });
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
  $('.currency-mobile').on('click', function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Qb2xpY3lTdW1tYXJ5LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCOztBQUVBLFFBQUks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QTRCLG1CQUE1Qjs7QUFFQSxJQUFJLG1CQUFtQixJQUF2Qjs7QUFFQSxTQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJLG9CQUFvQixJQUF4QixFQUE4QjtBQUM1QixvQ0FBYSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBYixFQUFpRCxnQkFBakQ7QUFDRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUVELGtCQUFNLEtBQU4iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBtb2R1bGUgXCJBY2NvcmRpb24uanNcIlxuXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1idG4nKTtcblxuICAvLyBCaW5kIEV2ZW50c1xuICBsZXQgaTtcbiAgZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xuICAgIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFjY29yZGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYWNjb3JkaW9uSGFuZGxlcihldnQpIHtcbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzLFxuICAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuICAgIGxldCBwYW5lbCA9IGV2dC5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJzAnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgICB9XG4gIH1cbn1cbmV4cG9ydCB7IEFjY29yZGlvbiB9O1xuIiwiLy8gbW9kdWxlIFwiQXV0b0NvbXBsZXRlLmpzXCJcblxuLyoqXG4gKiBbQXV0b0NvbXBsZXRlIGRlc2NyaXB0aW9uXVxuICpcbiAqIEBwYXJhbSAgIHtzdHJpbmd9ICB1c2VySW5wdXQgIHVzZXIgaW5wdXRcbiAqIEBwYXJhbSAgIHthcnJheX0gIHNlYXJjaExpc3QgIHNlYXJjaCBsaXN0XG4gKlxuICogQHJldHVybiAge1t0eXBlXX0gICAgICAgW3JldHVybiBkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gQXV0b0NvbXBsZXRlKGlucCwgYXJyKSB7XG4gIHZhciBjdXJyZW50Rm9jdXM7XG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSB3cml0ZXMgaW4gdGhlIHRleHQgZmllbGQ6Ki9cbiAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZSkge1xuICAgIHZhciBhLFxuICAgICAgYixcbiAgICAgIGksXG4gICAgICB2YWwgPSB0aGlzLnZhbHVlO1xuICAgIC8qY2xvc2UgYW55IGFscmVhZHkgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyovXG4gICAgY2xvc2VBbGxMaXN0cygpO1xuICAgIGlmICghdmFsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGN1cnJlbnRGb2N1cyA9IC0xO1xuICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGl0ZW1zICh2YWx1ZXMpOiovXG4gICAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGEuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQgKyAnYXV0b2NvbXBsZXRlLWxpc3QnKTtcbiAgICBhLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgLyphcHBlbmQgdGhlIERJViBlbGVtZW50IGFzIGEgY2hpbGQgb2YgdGhlIGF1dG9jb21wbGV0ZSBjb250YWluZXI6Ki9cbiAgICB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoYSk7XG4gICAgLypmb3IgZWFjaCBpdGVtIGluIHRoZSBhcnJheS4uLiovXG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgLypjaGVjayBpZiB0aGUgaXRlbSBzdGFydHMgd2l0aCB0aGUgc2FtZSBsZXR0ZXJzIGFzIHRoZSB0ZXh0IGZpZWxkIHZhbHVlOiovXG4gICAgICBpZiAoYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgZm9yIGVhY2ggbWF0Y2hpbmcgZWxlbWVudDoqL1xuICAgICAgICBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgICAgIC8qbWFrZSB0aGUgbWF0Y2hpbmcgbGV0dGVycyBib2xkOiovXG4gICAgICAgIGIuaW5uZXJIVE1MID0gJzxzdHJvbmc+JyArIGFycltpXS5zdWJzdHIoMCwgdmFsLmxlbmd0aCkgKyAnPC9zdHJvbmc+JztcbiAgICAgICAgYi5pbm5lckhUTUwgKz0gYXJyW2ldLnN1YnN0cih2YWwubGVuZ3RoKTtcbiAgICAgICAgLyppbnNlcnQgYSBpbnB1dCBmaWVsZCB0aGF0IHdpbGwgaG9sZCB0aGUgY3VycmVudCBhcnJheSBpdGVtJ3MgdmFsdWU6Ki9cbiAgICAgICAgYi5pbm5lckhUTUwgKz0gXCI8aW5wdXQgdHlwZT0naGlkZGVuJyB2YWx1ZT0nXCIgKyBhcnJbaV0gKyBcIic+XCI7XG4gICAgICAgIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSBjbGlja3Mgb24gdGhlIGl0ZW0gdmFsdWUgKERJViBlbGVtZW50KToqL1xuICAgICAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8qaW5zZXJ0IHRoZSB2YWx1ZSBmb3IgdGhlIGF1dG9jb21wbGV0ZSB0ZXh0IGZpZWxkOiovXG4gICAgICAgICAgaW5wLnZhbHVlID0gdGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKVswXS52YWx1ZTtcbiAgICAgICAgICAvKmNsb3NlIHRoZSBsaXN0IG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzLFxuICAgICAgICAgICAgKG9yIGFueSBvdGhlciBvcGVuIGxpc3RzIG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzOiovXG4gICAgICAgICAgY2xvc2VBbGxMaXN0cygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYS5hcHBlbmRDaGlsZChiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiBwcmVzc2VzIGEga2V5IG9uIHRoZSBrZXlib2FyZDoqL1xuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQgKyAnYXV0b2NvbXBsZXRlLWxpc3QnKTtcbiAgICBpZiAoeCkgeCA9IHguZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xuICAgIGlmIChlLmtleUNvZGUgPT0gNDApIHtcbiAgICAgIC8qSWYgdGhlIGFycm93IERPV04ga2V5IGlzIHByZXNzZWQsXG4gICAgICBpbmNyZWFzZSB0aGUgY3VycmVudEZvY3VzIHZhcmlhYmxlOiovXG4gICAgICBjdXJyZW50Rm9jdXMrKztcbiAgICAgIC8qYW5kIGFuZCBtYWtlIHRoZSBjdXJyZW50IGl0ZW0gbW9yZSB2aXNpYmxlOiovXG4gICAgICBhZGRBY3RpdmUoeCk7XG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzgpIHtcbiAgICAgIC8vdXBcbiAgICAgIC8qSWYgdGhlIGFycm93IFVQIGtleSBpcyBwcmVzc2VkLFxuICAgICAgZGVjcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xuICAgICAgY3VycmVudEZvY3VzLS07XG4gICAgICAvKmFuZCBhbmQgbWFrZSB0aGUgY3VycmVudCBpdGVtIG1vcmUgdmlzaWJsZToqL1xuICAgICAgYWRkQWN0aXZlKHgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAvKklmIHRoZSBFTlRFUiBrZXkgaXMgcHJlc3NlZCwgcHJldmVudCB0aGUgZm9ybSBmcm9tIGJlaW5nIHN1Ym1pdHRlZCwqL1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGN1cnJlbnRGb2N1cyA+IC0xKSB7XG4gICAgICAgIC8qYW5kIHNpbXVsYXRlIGEgY2xpY2sgb24gdGhlIFwiYWN0aXZlXCIgaXRlbToqL1xuICAgICAgICBpZiAoeCkgeFtjdXJyZW50Rm9jdXNdLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gYWRkQWN0aXZlKHgpIHtcbiAgICAvKmEgZnVuY3Rpb24gdG8gY2xhc3NpZnkgYW4gaXRlbSBhcyBcImFjdGl2ZVwiOiovXG4gICAgaWYgKCF4KSByZXR1cm4gZmFsc2U7XG4gICAgLypzdGFydCBieSByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyBvbiBhbGwgaXRlbXM6Ki9cbiAgICByZW1vdmVBY3RpdmUoeCk7XG4gICAgaWYgKGN1cnJlbnRGb2N1cyA+PSB4Lmxlbmd0aCkgY3VycmVudEZvY3VzID0gMDtcbiAgICBpZiAoY3VycmVudEZvY3VzIDwgMCkgY3VycmVudEZvY3VzID0geC5sZW5ndGggLSAxO1xuICAgIC8qYWRkIGNsYXNzIFwiYXV0b2NvbXBsZXRlLWFjdGl2ZVwiOiovXG4gICAgeFtjdXJyZW50Rm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVBY3RpdmUoeCkge1xuICAgIC8qYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIFwiYWN0aXZlXCIgY2xhc3MgZnJvbSBhbGwgYXV0b2NvbXBsZXRlIGl0ZW1zOiovXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB4W2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2VBbGxMaXN0cyhlbG1udCkge1xuICAgIC8qY2xvc2UgYWxsIGF1dG9jb21wbGV0ZSBsaXN0cyBpbiB0aGUgZG9jdW1lbnQsXG4gIGV4Y2VwdCB0aGUgb25lIHBhc3NlZCBhcyBhbiBhcmd1bWVudDoqL1xuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZWxtbnQgIT0geFtpXSAmJiBlbG1udCAhPSBpbnApIHtcbiAgICAgICAgeFtpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHhbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIGluIHRoZSBkb2N1bWVudDoqL1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBjbG9zZUFsbExpc3RzKGUudGFyZ2V0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IEF1dG9Db21wbGV0ZSB9O1xuIiwiZnVuY3Rpb24gQ291bnRyeVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX3VwJyk7XG4gIGxldCBkb3duID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2Rvd24nKTtcbiAgbGV0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50cnktc2Nyb2xsZXJfX2l0ZW1zJyk7XG4gIGxldCBpdGVtSGVpZ2h0ID1cbiAgICBpdGVtcyAhPSBudWxsID8gaXRlbXMuZmlyc3RDaGlsZC5uZXh0U2libGluZy5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmICh1cCAhPSBudWxsKSB7XG4gICAgdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxVcCk7XG4gICAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbERvd24pO1xuXG4gICAgLy8gZXZlbnQgaGFuZGxlcnNcbiAgICBmdW5jdGlvbiBzY3JvbGxVcCgpIHtcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCB1cCBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wICs9IGl0ZW1IZWlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2Nyb2xsRG93bigpIHtcbiAgICAgIC8vIG1vdmUgaXRlbXMgbGlzdCBkb3duIGJ5IGhlaWdodCBvZiBsaSBlbGVtZW50XG4gICAgICBpdGVtcy5zY3JvbGxUb3AgLT0gaXRlbUhlaWdodDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgQ291bnRyeVNlbGVjdG9yIH07XG4iLCIvLyBtb2R1bGUgQ292ZXJPcHRpb25zLmpzXG5cbmZ1bmN0aW9uIENvdmVyT3B0aW9ucygpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGNvbnN0IHdhcm5pbmdUZXh0ID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC53YXJuaW5nLXRleHQnKTtcbiAgY29uc3QgY292ZXJPcHRpb25QcmljZSA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAuY2FyZC1wcmljZScpO1xuICAvLyBHZXQgc2luZ2xlIHRyaXAgcHJpY2VcbiAgY29uc3QgaW5pdGlhbENvdmVyUHJpY2UgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLmFtb3VudCcpO1xuICBjb25zdCBkX2luaXRpYWxDb3ZlclByaWNlID0gcGFyc2VGbG9hdChcbiAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxuICApLnRvRml4ZWQoMik7XG5cbiAgY29uc3QgaW5pdGlhbFNpbmdsZVRyaXBQcmljZSA9ICQoJy5pbml0aWFsLXNpbmdsZS10cmlwLXByaWNlJyk7XG4gIGNvbnN0IGRfaW5pdGlhbFNpbmdsZVRyaXBQcmljZSA9IHBhcnNlRmxvYXQoXG4gICAgaW5pdGlhbFNpbmdsZVRyaXBQcmljZS50ZXh0KCkucmVwbGFjZSgvXFxEKi8sICcnKVxuICApLnRvRml4ZWQoMik7XG5cbiAgY29uc3QgY3VycmVuY3lTeW1ib2wgPSBpbml0aWFsQ292ZXJQcmljZS50ZXh0KCkuc3Vic3RyaW5nKDAsIDEpO1xuICBsZXQgaW5wdXRWYWx1ZSA9ICcnO1xuICBsZXQgcHJpY2VMaW1pdDtcbiAgbGV0IHRvdGFsSW5pdGlhbFByaWNlID0gMDtcbiAgbGV0IHRvdGFsU2luZ2xlUHJpY2UgPSAwO1xuICBsZXQgZmluYWxQcmljZSA9IDA7XG5cbiAgaWYgKGN1cnJlbmN5U3ltYm9sID09ICdcXHUwMEEzJykge1xuICAgIHByaWNlTGltaXQgPSAxMTk7XG4gIH0gZWxzZSB7XG4gICAgcHJpY2VMaW1pdCA9IDE0MjtcbiAgfVxuXG4gIC8vIGNvbnNvbGUuY2xlYXIoKTtcbiAgLy8gY29uc29sZS5sb2coYGNvdmVyIHByaWNlOiAke2RfaW5pdGlhbENvdmVyUHJpY2V9YCk7XG4gIC8vIGNvbnNvbGUubG9nKGBTaW5nbGUgVHJpcCBwcmljZTogJHtkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2V9YCk7XG4gIC8vIGNvbnNvbGUubG9nKGBjdXJyZW5jeVN5bWJvbDogJHtjdXJyZW5jeVN5bWJvbH1gKTtcblxuICAkKCcucHJvZHVjdC1vcHRpb25zLWRheXMtY292ZXInKS5jaGFuZ2UoZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gZ2V0IHZhbHVlXG4gICAgaW5wdXRWYWx1ZSA9IHBhcnNlSW50KGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcblxuICAgIGlmIChpbnB1dFZhbHVlID4gMCkge1xuICAgICAgLy8gY2FsY3VsYXRlIHdpdGggaW50aXRhbCBjb3ZlciBwcmljZVxuICAgICAgaWYgKGlucHV0VmFsdWUgPiAwICYmIGlucHV0VmFsdWUgPD0gMykge1xuICAgICAgICB0b3RhbEluaXRpYWxQcmljZSA9IGlucHV0VmFsdWUgKiBkX2luaXRpYWxDb3ZlclByaWNlO1xuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAoaW5wdXRWYWx1ZSA+IDMgJiYgZmluYWxQcmljZSA8IHByaWNlTGltaXQpIHx8XG4gICAgICAgIHByaWNlTGltaXQgPCBmaW5hbFByaWNlXG4gICAgICApIHtcbiAgICAgICAgdG90YWxTaW5nbGVQcmljZSA9IChpbnB1dFZhbHVlIC0gMykgKiBkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2U7XG4gICAgICB9XG4gICAgfVxuICAgIGZpbmFsUHJpY2UgPSBwYXJzZUZsb2F0KHRvdGFsSW5pdGlhbFByaWNlICsgdG90YWxTaW5nbGVQcmljZSkudG9GaXhlZCgyKTtcblxuICAgIGlmIChmaW5hbFByaWNlID4gcHJpY2VMaW1pdCkge1xuICAgICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dChcbiAgICAgICAgY3VycmVuY3lTeW1ib2wgKyBwYXJzZUZsb2F0KHByaWNlTGltaXQpLnRvRml4ZWQoMilcbiAgICAgICk7XG4gICAgICAvLyBjaGFuZ2UgY29sb3Igb2YgcHJpY2VcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgIC8vIHNob3cgd2FybmluZyB0ZXh0XG4gICAgICB3YXJuaW5nVGV4dC5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoY3VycmVuY3lTeW1ib2wgKyBmaW5hbFByaWNlKTtcbiAgICAgIHdhcm5pbmdUZXh0LmhpZGUoKTtcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UucmVtb3ZlQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgJHtpbnB1dFZhbHVlfSA9ICR7ZmluYWxQcmljZX1gKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IENvdmVyT3B0aW9ucyB9O1xuIiwiLy8gbW9kdWxlIFwiR29vZGJ5ZVdvcmxkLmpzXCJcblxuZnVuY3Rpb24gR29vZGJ5ZSgpIHtcbiAgcmV0dXJuICdHb29kYnllJztcbn1cblxuY29uc3QgV29ybGQgPSAnV29ybGQgISEnO1xuXG5leHBvcnQgeyBHb29kYnllLCBXb3JsZCB9O1xuIiwiZnVuY3Rpb24gVG9nZ2xlTmF2aWdhdGlvbigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGNvbnN0IGN1cnJlbmN5ID0gJCgnLmN1cnJlbmN5Jyk7XG4gIGNvbnN0IG1haW5OYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbWVudScpO1xuICBjb25zdCBuYXZCYXJUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xuICBjb25zdCBjdXJyZW5jeU5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jdXJyZW5jeS10b2dnbGUnKTtcbiAgY29uc3QgY3VycmVuY3lNZW51VG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLW5hdmJhci10b2dnbGUnKTtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBuYXZCYXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNZW51KTtcbiAgY3VycmVuY3lNZW51VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQ3VycmVuY3lNZW51KTtcblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgIG1haW5OYXYuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVDdXJyZW5jeU1lbnUoKSB7XG4gICAgY3VycmVuY3lOYXYuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gIH1cblxuICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAnMTE5OScpIHtcbiAgICBjdXJyZW5jeS5zaG93KCk7XG4gIH0gZWxzZSB7XG4gICAgY3VycmVuY3kuaGlkZSgpO1xuICB9XG5cbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAnMTE5OScpIHtcbiAgICAgIGN1cnJlbmN5LnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVuY3kuaGlkZSgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIERyb3Bkb3duTWVudSgpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCBjYXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLWNhcicpO1xuICBsZXQgZHJvcERvd25NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLS1jYXIgLmRyb3Bkb3duLW1lbnUnKTtcblxuICBpZiAoY2FyQnRuICE9IG51bGwgJiYgZHJvcERvd25NZW51ICE9IG51bGwpIHtcbiAgICBsZXQgZHJvcERvd24gPSBjYXJCdG4ucGFyZW50RWxlbWVudDtcbiAgICAvLyBCaW5kIGV2ZW50c1xuICAgIGNhckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhckJ0bkhhbmRsZXIpO1xuXG4gICAgLy8gRXZlbnQgaGFuZGxlcnNcbiAgICBmdW5jdGlvbiBjYXJCdG5IYW5kbGVyKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIC8vIHRvZ2dsZSBkaXNwbGF5XG4gICAgICBpZiAoXG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHxcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPT09ICcnXG4gICAgICApIHtcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPVxuICAgICAgICAgIGRyb3BEb3duLm9mZnNldEhlaWdodCArIGRyb3BEb3duTWVudS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJvcERvd25NZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRyb3BEb3duLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gRml4ZWROYXZpZ2F0aW9uKCkge1xuICAvLyBtYWtlIG5hdmJhciBzdGlja3lcbiAgLy8gV2hlbiB0aGUgdXNlciBzY3JvbGxzIHRoZSBwYWdlLCBleGVjdXRlIG15RnVuY3Rpb25cbiAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgbXlGdW5jdGlvbigpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgaGVhZGVyXG4gIGxldCBuYXZCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2YmFyJyk7XG5cbiAgLy8gR2V0IHRoZSBvZmZzZXQgcG9zaXRpb24gb2YgdGhlIG5hdmJhclxuICBsZXQgc3RpY2t5ID0gbmF2QmFyLm9mZnNldFRvcDtcblxuICAvLyBBZGQgdGhlIHN0aWNreSBjbGFzcyB0byB0aGUgaGVhZGVyIHdoZW4geW91IHJlYWNoIGl0cyBzY3JvbGwgcG9zaXRpb24uIFJlbW92ZSBcInN0aWNreVwiIHdoZW4geW91IGxlYXZlIHRoZSBzY3JvbGwgcG9zaXRpb25cbiAgZnVuY3Rpb24gbXlGdW5jdGlvbigpIHtcbiAgICBsZXQgc3RpY2t5ID0gbmF2QmFyLm9mZnNldFRvcDtcbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gc3RpY2t5KSB7XG4gICAgICBuYXZCYXIuY2xhc3NMaXN0LmFkZCgnbmF2YmFyLWZpeGVkLXRvcCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYXZCYXIuY2xhc3NMaXN0LnJlbW92ZSgnbmF2YmFyLWZpeGVkLXRvcCcpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBTZWxlY3RUcmlwKCkge1xuICAvLyBzZWxlY3QgdmVoaWNsZVxuICAkKCcudGFiLWNhciAuYnRuJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAkKCcudGFiLWNhciAuaWNvbi1yYWRpbyBpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5jbGljayhmdW5jdGlvbihldnQpIHtcbiAgICAkKCcudGFiLWNhciAuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1jdGEtLWRpc2FibGVkJyk7XG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLmFkZENsYXNzKCdidG4tY3RhJyk7XG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnVuYmluZCgpO1xuICB9KTtcbn1cblxuLy8gc2hvdyBtb2JpbGUgY3VycmVuY3lcbmZ1bmN0aW9uIFJldmVhbEN1cnJlbmN5KCkge1xuICAkKCcuY3VycmVuY3ktbW9iaWxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ0N1cnJlbmN5Jyk7XG5cbiAgICAkKCcuY3VycmVuY3knKS5zbGlkZVRvZ2dsZSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgVG9nZ2xlTmF2aWdhdGlvbixcbiAgRHJvcGRvd25NZW51LFxuICBGaXhlZE5hdmlnYXRpb24sXG4gIFNlbGVjdFRyaXAsXG4gIFJldmVhbEN1cnJlbmN5XG59O1xuIiwiZnVuY3Rpb24gUG9saWN5U3VtbWFyeSgpIHtcbiAgLy8gcG9saWN5IHN1bW1hcnlcbiAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gIH0pO1xuXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgLy8gc2hvdyBwb2xpY3kgc3VtbWFyeVxuICAgICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfSk7XG4gICAgbGV0IHBvbGljeVN1bW1hcnkgPSAkKHRoaXMpLmRhdGEoJ3BvbGljeScpO1xuICAgICQoJy4nICsgcG9saWN5U3VtbWFyeSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBQb2xpY3lTdW1tYXJ5IH07XG4iLCIvLyBtb2R1bGUgUmV2ZWFsRG9jcy5qc1xuXG5mdW5jdGlvbiBSZXZlYWxEb2NzKCkge1xuICAvL0RvY3NcbiAgJCgnLnJldmVhbGRvY3MnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBvbiA9ICQoJy5kb2NzJykuaXMoJzp2aXNpYmxlJyk7XG4gICAgJCh0aGlzKS5odG1sKFxuICAgICAgb24gPyAnVmlldyBwb2xpY3kgZG9jdW1lbnRhdGlvbicgOiAnSGlkZSBwb2xpY3kgZG9jdW1lbnRhdGlvbidcbiAgICApO1xuICAgICQoJy5kb2NzJykuc2xpZGVUb2dnbGUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFJldmVhbERvY3MgfTtcbiIsIi8vIG1vZHVsZSBcIlNjcmVlbi5qc1wiXG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xuICB2YXIgc2Nyb2xsU3RlcCA9IC13aW5kb3cuc2Nyb2xsWSAvIChzY3JvbGxEdXJhdGlvbiAvIDE1KSxcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcbiAgICAgICAgd2luZG93LnNjcm9sbEJ5KDAsIHNjcm9sbFN0ZXApO1xuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xuICAgIH0sIDE1KTtcbn1cblxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xuICBjb25zdCBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDI7XG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xuICAgIGlmIChzY3JvbGxDb3VudCA+PSBNYXRoLlBJKSB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XG4gICAgd2luZG93LnNjcm9sbFRvKFxuICAgICAgMCxcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxuICAgICk7XG4gICAgb2xkVGltZXN0YW1wID0gbmV3VGltZXN0YW1wO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xufVxuLypcbiAgRXhwbGFuYXRpb25zOlxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxuICAtIG5ld1RpbWVzdGFtcCBpbmRpY2F0ZXMgdGhlIGN1cnJlbnQgdGltZSB3aGVuIGNhbGxiYWNrcyBxdWV1ZWQgYnkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJlZ2luIHRvIGZpcmUuXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxuXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXG4gID0gYSAqIGNvcyAoYngpICsgMSAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeSBheGlzID0gY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXG4qL1xuXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcbiAgLy8gQ2FjaGUgRE9NXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xuXG4gIC8vIEJpbmQgRXZlbnRzXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYmFja1RvVG9wQnRuSGFuZGxlcihldnQpIHtcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dCgxMDAwKTtcblxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gV2luZG93V2lkdGgoKSB7XG4gIGNvbnNvbGUubG9nKCdXaW5kb3dXaWR0aCcpO1xuXG4gIC8vIGNhY2hlIERPTVxuICBjb25zdCBhY2NvcmRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnLmNhcmQtcHJvZHVjdHMgLmFjY29yZGlvbi1idG4nXG4gICk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgIGxldCB3ID1cbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG4gICAgaWYgKHcgPiAxMjAwKSB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3IDw9IDEyMDApIHtcbiAgICAgIGxldCBpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH07XG4iLCIvLyBtb2R1bGUgXCJTY3JvbGxUby5qc1wiXG5cbmZ1bmN0aW9uIFNjcm9sbFRvKCkge1xuICAvLyBjYWNoZSBET01cbiAgLy8gU2VsZWN0IGFsbCBsaW5rcyB3aXRoIGhhc2hlc1xuICAvLyBSZW1vdmUgbGlua3MgdGhhdCBkb24ndCBhY3R1YWxseSBsaW5rIHRvIGFueXRoaW5nXG4gIGxldCBhbmNob3JzID0gJCgnYVtocmVmKj1cIiNcIl0nKVxuICAgIC5ub3QoJ1tocmVmPVwiI1wiXScpXG4gICAgLm5vdCgnW2hyZWY9XCIjMFwiXScpO1xuXG4gIGxldCBoZWlnaHRDb21wZW5zYXRpb24gPSA2MDtcbiAgLy8gQmluZCBFdmVudHNcbiAgYW5jaG9ycy5jbGljayhhbmNob3JzSGFuZGxlcik7XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYW5jaG9yc0hhbmRsZXIoZXZlbnQpIHtcbiAgICAvLyBPbi1wYWdlIGxpbmtzXG4gICAgaWYgKFxuICAgICAgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSA9PVxuICAgICAgICB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgJiZcbiAgICAgIGxvY2F0aW9uLmhvc3RuYW1lID09IHRoaXMuaG9zdG5hbWVcbiAgICApIHtcbiAgICAgIC8vIEZpZ3VyZSBvdXQgZWxlbWVudCB0byBzY3JvbGwgdG9cbiAgICAgIGxldCB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XG4gICAgICAvLyBEb2VzIGEgc2Nyb2xsIHRhcmdldCBleGlzdD9cbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgIC8vIE9ubHkgcHJldmVudCBkZWZhdWx0IGlmIGFuaW1hdGlvbiBpcyBhY3R1YWxseSBnb25uYSBoYXBwZW5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gaGVpZ2h0Q29tcGVuc2F0aW9uXG4gICAgICAgICAgfSxcbiAgICAgICAgICAxMDAwLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgYWZ0ZXIgYW5pbWF0aW9uXG4gICAgICAgICAgICAvLyBNdXN0IGNoYW5nZSBmb2N1cyFcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJCh0YXJnZXQpO1xuICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgaWYgKCR0YXJnZXQuaXMoJzpmb2N1cycpKSB7XG4gICAgICAgICAgICAgIC8vIENoZWNraW5nIGlmIHRoZSB0YXJnZXQgd2FzIGZvY3VzZWRcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpOyAvLyBBZGRpbmcgdGFiaW5kZXggZm9yIGVsZW1lbnRzIG5vdCBmb2N1c2FibGVcbiAgICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpOyAvLyBTZXQgZm9jdXMgYWdhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIG9uIHNjcm9sbFxuaWYgKCQoJy5hcnRpY2xlLW1haW4nKS5sZW5ndGggPiAwKSB7XG4gIGxldCB0YXJnZXQgPSAkKCcuYXJ0aWNsZS1tYWluJykub2Zmc2V0KCkudG9wIC0gMTgwO1xuICAkKGRvY3VtZW50KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+PSB0YXJnZXQpIHtcbiAgICAgICQoJy5zaGFyZS1idXR0b25zJykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLmhpZGUoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyBTY3JvbGxUbyB9O1xuIiwiZnVuY3Rpb24gUmVhZHkoZm4pIHtcbiAgaWYgKFxuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXG4gICkge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5leHBvcnQgeyBSZWFkeSB9O1xuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhclRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fY2FyJyk7XG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xuICAgIGNhclRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcbiAgICB2YW5UYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gIH1cblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcbiAgICB2YXIgaSwgeCwgdGFiQnV0dG9ucztcblxuICAgIGNvbnNvbGUubG9nKGV2dCk7XG5cbiAgICAvLyBoaWRlIGFsbCB0YWIgY29udGVudHNcbiAgICB4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1jb250YWluZXIgLnRhYicpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB4W2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHRoZSBoaWdobGlnaHQgb24gdGhlIHRhYiBidXR0b25cbiAgICB0YWJCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi10YWJzIC5uYXYtbGluaycpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZSA9IHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lLnJlcGxhY2UoJyBhY3RpdmUnLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gaGlnaGxpZ2h0IHRhYiBidXR0b24gYW5kXG4gICAgLy8gc2hvdyB0aGUgc2VsZWN0ZWQgdGFiIGNvbnRlbnRcbiAgICBsZXQgdmVoaWNsZSA9IGV2dC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12ZWhpY2xlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi0nICsgdmVoaWNsZSkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcbiAgfVxufVxuXG5leHBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfTtcbiIsIi8vIG1vZHVsZSBcIkxvYWRGQVFzLmpzXCJcblxuZnVuY3Rpb24gTG9hZEZBUXMoKSB7XG4gIC8vIGxvYWQgZmFxc1xuICAkKCcjZmFxVGFicyBhJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKHRoaXMpLnRhYignc2hvdycpO1xuICB9KTtcblxuICAvLyBsb2FkIGZhcXNcbiAgLy8gb25seSBsb2FkIGlmIG9uIGZhcXMgcGFnZVxuICBpZiAoJCgnI2ZhcXMnKS5sZW5ndGggPiAwKSB7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgdXJsOiAnL2FwaS9mYXFzLmpzb24nLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZmFxcykge1xuICAgICAgICAvLyBnZXQgdGhlIGhlYWRzXG4gICAgICAgICQuZWFjaChmYXFzLCBmdW5jdGlvbihpbmRleCwgZmFxKSB7XG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBkZXNrdG9wXG4gICAgICAgICAgJChgYVtocmVmPScjJHtmYXEuaWR9J11gKVxuICAgICAgICAgICAgLmZpbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLnRleHQoZmFxLnRpdGxlKTtcblxuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgbW9iaWxlXG4gICAgICAgICAgJChgIyR7ZmFxLmlkfWApXG4gICAgICAgICAgICAuZmluZCgnaDMnKVxuICAgICAgICAgICAgLnRleHQoZmFxLnNob3J0VGl0bGUpO1xuXG4gICAgICAgICAgLy8gZ2V0IHRoZSBib2R5XG4gICAgICAgICAgJC5lYWNoKGZhcS5xYXMsIGZ1bmN0aW9uKGZJbmRleCwgcWEpIHtcbiAgICAgICAgICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJywgYCMke2ZhcS5pZH1gKS5hcHBlbmQoXG4gICAgICAgICAgICAgIGA8YnV0dG9uIGNsYXNzPVwiYWNjb3JkaW9uLWJ0biBoNFwiPiR7cWEucXVlc3Rpb259PC9idXR0b24+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVsXCI+XG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxuICAgICAgICAgICAgICAgICAke3FhLmFuc3dlcn1cbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gJGFqYXhcblxuICAgICQoJy5mYXEtYW5zd2VycyAuaW5uZXIgLmFjY29yZGlvbicpLmRlbGVnYXRlKFxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcbiAgICAgICdjbGljaycsXG4gICAgICBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcbiAgICAgICAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xuICAgICAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblxuICAgICAgICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuICAgICAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvLyBvbmx5IGxvYWQgaWYgb24gcHJvZHVjdCBmYXFzIHBhZ2VcbiAgaWYgKCQoJy5wcm9kdWN0LWZhcXMnKS5sZW5ndGggPiAwKSB7XG4gICAgbGV0IGZpbGUgPSAkKCcucHJvZHVjdC1mYXFzJylcbiAgICAgIC5kYXRhKCdmYXFzJylcbiAgICAgIC5yZXBsYWNlKCcmLScsICcnKTtcblxuICAgIGNvbnNvbGUubG9nKGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICB1cmw6IGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSBib2R5XG4gICAgICAgICQuZWFjaChmYXFzLCBmdW5jdGlvbihmSW5kZXgsIGZhcSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAjJHtmYXEuaWR9YCk7XG4gICAgICAgICAgJCgnLmlubmVyIC5hY2NvcmRpb24nKS5hcHBlbmQoXG4gICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke2ZhcS5xdWVzdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxuICAgICAgICAgICAgICAgICR7ZmFxLmFuc3dlcn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2hvdyBjb250ZW50XG4gICAgICAgICQoJy5mYXEtYW5zd2Vycy1wcm9kdWN0Jykuc2hvdygpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7IC8vICRhamF4XG5cbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXG4gICAgICAnY2xpY2snLFxuICAgICAgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG4gICAgICAgICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICAgICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IExvYWRGQVFzIH07XG4iLCJpbXBvcnQgeyBHb29kYnllLCBXb3JsZCB9IGZyb20gJy4vY29tcG9uZW50cy9Hb29kYnllV29ybGQnO1xuaW1wb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uJztcbmltcG9ydCB7IENvdW50cnlTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3InO1xuaW1wb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL1ZlaGljbGVTZWxlY3Rvcic7XG5pbXBvcnQge1xuICBUb2dnbGVOYXZpZ2F0aW9uLFxuICBEcm9wZG93bk1lbnUsXG4gIEZpeGVkTmF2aWdhdGlvbixcbiAgU2VsZWN0VHJpcCxcbiAgUmV2ZWFsQ3VycmVuY3lcbn0gZnJvbSAnLi9jb21wb25lbnRzL05hdmlnYXRpb24nO1xuaW1wb3J0IHsgU2Nyb2xsVG8gfSBmcm9tICcuL2NvbXBvbmVudHMvU2Nyb2xsVG8nO1xuaW1wb3J0IHsgQXV0b0NvbXBsZXRlIH0gZnJvbSAnLi9jb21wb25lbnRzL0F1dG9Db21wbGV0ZSc7XG5pbXBvcnQgeyBMb2FkRkFRcyB9IGZyb20gJy4vY29tcG9uZW50cy9mYXFzJztcbmltcG9ydCB7IFJldmVhbERvY3MgfSBmcm9tICcuL2NvbXBvbmVudHMvUmV2ZWFsRG9jcyc7XG5pbXBvcnQgeyBDb3Zlck9wdGlvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvQ292ZXJPcHRpb25zJztcbmltcG9ydCB7IFJlYWR5IH0gZnJvbSAnLi9jb21wb25lbnRzL1V0aWxzJztcbmltcG9ydCB7IFBvbGljeVN1bW1hcnkgfSBmcm9tICcuL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeSc7XG5cbmNvbnNvbGUubG9nKGAke0dvb2RieWUoKX0gJHtXb3JsZH0gSW5kZXggZmlsZWApO1xuXG5sZXQgY291bnRyaWVzQ292ZXJlZCA9IG51bGw7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBDb3VudHJ5U2VsZWN0b3IoKTtcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XG4gIFRvZ2dsZU5hdmlnYXRpb24oKTtcbiAgRHJvcGRvd25NZW51KCk7XG4gIFNjcm9sbFRvVG9wKCk7XG4gIEZpeGVkTmF2aWdhdGlvbigpO1xuICBBY2NvcmRpb24oKTtcbiAgV2luZG93V2lkdGgoKTtcbiAgU2Nyb2xsVG8oKTtcbiAgaWYgKGNvdW50cmllc0NvdmVyZWQgIT0gbnVsbCkge1xuICAgIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbnB1dCcpLCBjb3VudHJpZXNDb3ZlcmVkKTtcbiAgfVxuICBMb2FkRkFRcygpO1xuICAvLyBSZXZlYWxEb2NzKCk7XG4gIENvdmVyT3B0aW9ucygpO1xuICBQb2xpY3lTdW1tYXJ5KCk7XG4gIFNlbGVjdFRyaXAoKTtcbiAgUmV2ZWFsQ3VycmVuY3koKTtcbn1cblxuUmVhZHkoc3RhcnQpO1xuIl19
