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

  var inputValue = '';
  var priceLimit = 119;
  var totalInitialPrice = 0;
  var totalSinglePrice = 0;
  var finalPrice = 0;

  console.clear();
  console.log('cover price ' + d_initialCoverPrice);
  console.log('cover price ' + d_initialSingleTripPrice);

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
      initialCoverPrice.text(parseFloat(priceLimit).toFixed(2));
      // change color of price
      coverOptionPrice.addClass('warning');
      // show warning text
      warningText.show();
    } else {
      initialCoverPrice.text(finalPrice);
      warningText.hide();
      coverOptionPrice.removeClass('warning');
    }

    console.log(inputValue + ' = ' + finalPrice);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0FjY29yZGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0NvdmVyT3B0aW9ucy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvR29vZGJ5ZVdvcmxkLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9Qb2xpY3lTdW1tYXJ5LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9SZXZlYWxEb2NzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9TY3JlZW4uanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL1Njcm9sbFRvLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9VdGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVmVoaWNsZVNlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mYXFzLmpzIiwic3JjL3NjcmlwdHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQjtBQUNBLE1BQUksTUFBTSxTQUFTLGdCQUFULENBQTBCLGdCQUExQixDQUFWOztBQUVBO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBSSxDQUFKLEVBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCOztBQUVBLFFBQUks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QixHQUF4QjtBQUNBLGNBQU0sS0FBTixDQUFZLFlBQVosR0FBMkIsR0FBM0I7QUFDRCxPQUpELE1BSU87QUFDTCxjQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLE1BQU0sWUFBTixHQUFxQixJQUE3QztBQUNBLGNBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxjQUFNLEtBQU4sQ0FBWSxZQUFaLEdBQTJCLE1BQTNCO0FBQ0Q7QUFDRixLQW5CSDtBQXFCRDtBQUNGOztRQUVRLFEsR0FBQSxROzs7OztBQ2hJVDs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFPQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxRQUFRLEdBQVIsQ0FBZSw0QkFBZixTQUE0QixtQkFBNUI7O0FBRUEsSUFBSSxtQkFBbUIsSUFBdkI7O0FBRUEsU0FBUyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSSxvQkFBb0IsSUFBeEIsRUFBOEI7QUFDNUIsb0NBQWEsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQWIsRUFBaUQsZ0JBQWpEO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxrQkFBTSxLQUFOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbW9kdWxlIFwiQWNjb3JkaW9uLmpzXCJcblxuZnVuY3Rpb24gQWNjb3JkaW9uKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYnRuJyk7XG5cbiAgLy8gQmluZCBFdmVudHNcbiAgbGV0IGk7XG4gIGZvciAoaSA9IDA7IGkgPCBhY2MubGVuZ3RoOyBpKyspIHtcbiAgICBhY2NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhY2NvcmRpb25IYW5kbGVyKTtcbiAgfVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzXG4gIGZ1bmN0aW9uIGFjY29yZGlvbkhhbmRsZXIoZXZ0KSB7XG4gICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcbiAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXG4gICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcwJztcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICctMTFweCc7XG4gICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgfVxuICB9XG59XG5leHBvcnQgeyBBY2NvcmRpb24gfTtcbiIsIi8vIG1vZHVsZSBcIkF1dG9Db21wbGV0ZS5qc1wiXG5cbi8qKlxuICogW0F1dG9Db21wbGV0ZSBkZXNjcmlwdGlvbl1cbiAqXG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgdXNlcklucHV0ICB1c2VyIGlucHV0XG4gKiBAcGFyYW0gICB7YXJyYXl9ICBzZWFyY2hMaXN0ICBzZWFyY2ggbGlzdFxuICpcbiAqIEByZXR1cm4gIHtbdHlwZV19ICAgICAgIFtyZXR1cm4gZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIEF1dG9Db21wbGV0ZShpbnAsIGFycikge1xuICB2YXIgY3VycmVudEZvY3VzO1xuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgd3JpdGVzIGluIHRoZSB0ZXh0IGZpZWxkOiovXG4gIGlucC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgYSxcbiAgICAgIGIsXG4gICAgICBpLFxuICAgICAgdmFsID0gdGhpcy52YWx1ZTtcbiAgICAvKmNsb3NlIGFueSBhbHJlYWR5IG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXMqL1xuICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjdXJyZW50Rm9jdXMgPSAtMTtcbiAgICAvKmNyZWF0ZSBhIERJViBlbGVtZW50IHRoYXQgd2lsbCBjb250YWluIHRoZSBpdGVtcyAodmFsdWVzKToqL1xuICAgIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICBhLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XG4gICAgYS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xuICAgIC8qYXBwZW5kIHRoZSBESVYgZWxlbWVudCBhcyBhIGNoaWxkIG9mIHRoZSBhdXRvY29tcGxldGUgY29udGFpbmVyOiovXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGEpO1xuICAgIC8qZm9yIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkuLi4qL1xuICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8qY2hlY2sgaWYgdGhlIGl0ZW0gc3RhcnRzIHdpdGggdGhlIHNhbWUgbGV0dGVycyBhcyB0aGUgdGV4dCBmaWVsZCB2YWx1ZToqL1xuICAgICAgaWYgKGFycltpXS5zdWJzdHIoMCwgdmFsLmxlbmd0aCkudG9VcHBlckNhc2UoKSA9PSB2YWwudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAvKmNyZWF0ZSBhIERJViBlbGVtZW50IGZvciBlYWNoIG1hdGNoaW5nIGVsZW1lbnQ6Ki9cbiAgICAgICAgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgICAgICAvKm1ha2UgdGhlIG1hdGNoaW5nIGxldHRlcnMgYm9sZDoqL1xuICAgICAgICBiLmlubmVySFRNTCA9ICc8c3Ryb25nPicgKyBhcnJbaV0uc3Vic3RyKDAsIHZhbC5sZW5ndGgpICsgJzwvc3Ryb25nPic7XG4gICAgICAgIGIuaW5uZXJIVE1MICs9IGFycltpXS5zdWJzdHIodmFsLmxlbmd0aCk7XG4gICAgICAgIC8qaW5zZXJ0IGEgaW5wdXQgZmllbGQgdGhhdCB3aWxsIGhvbGQgdGhlIGN1cnJlbnQgYXJyYXkgaXRlbSdzIHZhbHVlOiovXG4gICAgICAgIGIuaW5uZXJIVE1MICs9IFwiPGlucHV0IHR5cGU9J2hpZGRlbicgdmFsdWU9J1wiICsgYXJyW2ldICsgXCInPlwiO1xuICAgICAgICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIG9uIHRoZSBpdGVtIHZhbHVlIChESVYgZWxlbWVudCk6Ki9cbiAgICAgICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvKmluc2VydCB0aGUgdmFsdWUgZm9yIHRoZSBhdXRvY29tcGxldGUgdGV4dCBmaWVsZDoqL1xuICAgICAgICAgIGlucC52YWx1ZSA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF0udmFsdWU7XG4gICAgICAgICAgLypjbG9zZSB0aGUgbGlzdCBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyxcbiAgICAgICAgICAgIChvciBhbnkgb3RoZXIgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlczoqL1xuICAgICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGEuYXBwZW5kQ2hpbGQoYik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gcHJlc3NlcyBhIGtleSBvbiB0aGUga2V5Ym9hcmQ6Ki9cbiAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XG4gICAgaWYgKHgpIHggPSB4LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcbiAgICBpZiAoZS5rZXlDb2RlID09IDQwKSB7XG4gICAgICAvKklmIHRoZSBhcnJvdyBET1dOIGtleSBpcyBwcmVzc2VkLFxuICAgICAgaW5jcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xuICAgICAgY3VycmVudEZvY3VzKys7XG4gICAgICAvKmFuZCBhbmQgbWFrZSB0aGUgY3VycmVudCBpdGVtIG1vcmUgdmlzaWJsZToqL1xuICAgICAgYWRkQWN0aXZlKHgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDM4KSB7XG4gICAgICAvL3VwXG4gICAgICAvKklmIHRoZSBhcnJvdyBVUCBrZXkgaXMgcHJlc3NlZCxcbiAgICAgIGRlY3JlYXNlIHRoZSBjdXJyZW50Rm9jdXMgdmFyaWFibGU6Ki9cbiAgICAgIGN1cnJlbnRGb2N1cy0tO1xuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cbiAgICAgIGFkZEFjdGl2ZSh4KTtcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgLypJZiB0aGUgRU5URVIga2V5IGlzIHByZXNzZWQsIHByZXZlbnQgdGhlIGZvcm0gZnJvbSBiZWluZyBzdWJtaXR0ZWQsKi9cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChjdXJyZW50Rm9jdXMgPiAtMSkge1xuICAgICAgICAvKmFuZCBzaW11bGF0ZSBhIGNsaWNrIG9uIHRoZSBcImFjdGl2ZVwiIGl0ZW06Ki9cbiAgICAgICAgaWYgKHgpIHhbY3VycmVudEZvY3VzXS5jbGljaygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIGFkZEFjdGl2ZSh4KSB7XG4gICAgLyphIGZ1bmN0aW9uIHRvIGNsYXNzaWZ5IGFuIGl0ZW0gYXMgXCJhY3RpdmVcIjoqL1xuICAgIGlmICgheCkgcmV0dXJuIGZhbHNlO1xuICAgIC8qc3RhcnQgYnkgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3Mgb24gYWxsIGl0ZW1zOiovXG4gICAgcmVtb3ZlQWN0aXZlKHgpO1xuICAgIGlmIChjdXJyZW50Rm9jdXMgPj0geC5sZW5ndGgpIGN1cnJlbnRGb2N1cyA9IDA7XG4gICAgaWYgKGN1cnJlbnRGb2N1cyA8IDApIGN1cnJlbnRGb2N1cyA9IHgubGVuZ3RoIC0gMTtcbiAgICAvKmFkZCBjbGFzcyBcImF1dG9jb21wbGV0ZS1hY3RpdmVcIjoqL1xuICAgIHhbY3VycmVudEZvY3VzXS5jbGFzc0xpc3QuYWRkKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlKHgpIHtcbiAgICAvKmEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBcImFjdGl2ZVwiIGNsYXNzIGZyb20gYWxsIGF1dG9jb21wbGV0ZSBpdGVtczoqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgeFtpXS5jbGFzc0xpc3QucmVtb3ZlKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoZWxtbnQpIHtcbiAgICAvKmNsb3NlIGFsbCBhdXRvY29tcGxldGUgbGlzdHMgaW4gdGhlIGRvY3VtZW50LFxuICBleGNlcHQgdGhlIG9uZSBwYXNzZWQgYXMgYW4gYXJndW1lbnQ6Ki9cbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsbW50ICE9IHhbaV0gJiYgZWxtbnQgIT0gaW5wKSB7XG4gICAgICAgIHhbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh4W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gd2hlbiBzb21lb25lIGNsaWNrcyBpbiB0aGUgZG9jdW1lbnQ6Ki9cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgY2xvc2VBbGxMaXN0cyhlLnRhcmdldCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBBdXRvQ29tcGxldGUgfTtcbiIsImZ1bmN0aW9uIENvdW50cnlTZWxlY3RvcigpIHtcbiAgLy8gY2FjaGUgRE9NXG4gIGxldCB1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX191cCcpO1xuICBsZXQgZG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19kb3duJyk7XG4gIGxldCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3VudHJ5LXNjcm9sbGVyX19pdGVtcycpO1xuICBsZXQgaXRlbUhlaWdodCA9XG4gICAgaXRlbXMgIT0gbnVsbCA/IGl0ZW1zLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcub2Zmc2V0SGVpZ2h0IDogMDtcblxuICAvLyBiaW5kIGV2ZW50c1xuICBpZiAodXAgIT0gbnVsbCkge1xuICAgIHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2Nyb2xsVXApO1xuICAgIGRvd24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxEb3duKTtcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJzXG4gICAgZnVuY3Rpb24gc2Nyb2xsVXAoKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgdXAgYnkgaGVpZ2h0IG9mIGxpIGVsZW1lbnRcbiAgICAgIGl0ZW1zLnNjcm9sbFRvcCArPSBpdGVtSGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjcm9sbERvd24oKSB7XG4gICAgICAvLyBtb3ZlIGl0ZW1zIGxpc3QgZG93biBieSBoZWlnaHQgb2YgbGkgZWxlbWVudFxuICAgICAgaXRlbXMuc2Nyb2xsVG9wIC09IGl0ZW1IZWlnaHQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IENvdW50cnlTZWxlY3RvciB9O1xuIiwiLy8gbW9kdWxlIENvdmVyT3B0aW9ucy5qc1xuXG5mdW5jdGlvbiBDb3Zlck9wdGlvbnMoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBjb25zdCB3YXJuaW5nVGV4dCA9ICQoJy5jYXJkLWNvdmVyLW9wdGlvbjpudGgtb2YtdHlwZSgxKSAud2FybmluZy10ZXh0Jyk7XG4gIGNvbnN0IGNvdmVyT3B0aW9uUHJpY2UgPSAkKCcuY2FyZC1jb3Zlci1vcHRpb246bnRoLW9mLXR5cGUoMSkgLmNhcmQtcHJpY2UnKTtcbiAgLy8gR2V0IHNpbmdsZSB0cmlwIHByaWNlXG4gIGNvbnN0IGluaXRpYWxDb3ZlclByaWNlID0gJCgnLmNhcmQtY292ZXItb3B0aW9uOm50aC1vZi10eXBlKDEpIC5hbW91bnQnKTtcbiAgY29uc3QgZF9pbml0aWFsQ292ZXJQcmljZSA9IHBhcnNlRmxvYXQoXG4gICAgaW5pdGlhbENvdmVyUHJpY2UudGV4dCgpLnJlcGxhY2UoL1xcRCovLCAnJylcbiAgKS50b0ZpeGVkKDIpO1xuXG4gIGNvbnN0IGluaXRpYWxTaW5nbGVUcmlwUHJpY2UgPSAkKCcuaW5pdGlhbC1zaW5nbGUtdHJpcC1wcmljZScpO1xuICBjb25zdCBkX2luaXRpYWxTaW5nbGVUcmlwUHJpY2UgPSBwYXJzZUZsb2F0KFxuICAgIGluaXRpYWxTaW5nbGVUcmlwUHJpY2UudGV4dCgpLnJlcGxhY2UoL1xcRCovLCAnJylcbiAgKS50b0ZpeGVkKDIpO1xuXG4gIGxldCBpbnB1dFZhbHVlID0gJyc7XG4gIGNvbnN0IHByaWNlTGltaXQgPSAxMTk7XG4gIGxldCB0b3RhbEluaXRpYWxQcmljZSA9IDA7XG4gIGxldCB0b3RhbFNpbmdsZVByaWNlID0gMDtcbiAgbGV0IGZpbmFsUHJpY2UgPSAwO1xuXG4gIGNvbnNvbGUuY2xlYXIoKTtcbiAgY29uc29sZS5sb2coYGNvdmVyIHByaWNlICR7ZF9pbml0aWFsQ292ZXJQcmljZX1gKTtcbiAgY29uc29sZS5sb2coYGNvdmVyIHByaWNlICR7ZF9pbml0aWFsU2luZ2xlVHJpcFByaWNlfWApO1xuXG4gICQoJy5wcm9kdWN0LW9wdGlvbnMtZGF5cy1jb3ZlcicpLmNoYW5nZShmdW5jdGlvbihldnQpIHtcbiAgICAvLyBnZXQgdmFsdWVcbiAgICBpbnB1dFZhbHVlID0gcGFyc2VJbnQoZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuXG4gICAgaWYgKGlucHV0VmFsdWUgPiAwKSB7XG4gICAgICAvLyBjYWxjdWxhdGUgd2l0aCBpbnRpdGFsIGNvdmVyIHByaWNlXG4gICAgICBpZiAoaW5wdXRWYWx1ZSA+IDAgJiYgaW5wdXRWYWx1ZSA8PSAzKSB7XG4gICAgICAgIHRvdGFsSW5pdGlhbFByaWNlID0gaW5wdXRWYWx1ZSAqIGRfaW5pdGlhbENvdmVyUHJpY2U7XG4gICAgICAgIHRvdGFsU2luZ2xlUHJpY2UgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIChpbnB1dFZhbHVlID4gMyAmJiBmaW5hbFByaWNlIDwgcHJpY2VMaW1pdCkgfHxcbiAgICAgICAgcHJpY2VMaW1pdCA8IGZpbmFsUHJpY2VcbiAgICAgICkge1xuICAgICAgICB0b3RhbFNpbmdsZVByaWNlID0gKGlucHV0VmFsdWUgLSAzKSAqIGRfaW5pdGlhbFNpbmdsZVRyaXBQcmljZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmluYWxQcmljZSA9IHBhcnNlRmxvYXQodG90YWxJbml0aWFsUHJpY2UgKyB0b3RhbFNpbmdsZVByaWNlKS50b0ZpeGVkKDIpO1xuXG4gICAgaWYgKGZpbmFsUHJpY2UgPiBwcmljZUxpbWl0KSB7XG4gICAgICBpbml0aWFsQ292ZXJQcmljZS50ZXh0KHBhcnNlRmxvYXQocHJpY2VMaW1pdCkudG9GaXhlZCgyKSk7XG4gICAgICAvLyBjaGFuZ2UgY29sb3Igb2YgcHJpY2VcbiAgICAgIGNvdmVyT3B0aW9uUHJpY2UuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgIC8vIHNob3cgd2FybmluZyB0ZXh0XG4gICAgICB3YXJuaW5nVGV4dC5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRpYWxDb3ZlclByaWNlLnRleHQoZmluYWxQcmljZSk7XG4gICAgICB3YXJuaW5nVGV4dC5oaWRlKCk7XG4gICAgICBjb3Zlck9wdGlvblByaWNlLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYCR7aW5wdXRWYWx1ZX0gPSAke2ZpbmFsUHJpY2V9YCk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBDb3Zlck9wdGlvbnMgfTtcbiIsIi8vIG1vZHVsZSBcIkdvb2RieWVXb3JsZC5qc1wiXG5cbmZ1bmN0aW9uIEdvb2RieWUoKSB7XG4gIHJldHVybiAnR29vZGJ5ZSc7XG59XG5cbmNvbnN0IFdvcmxkID0gJ1dvcmxkICEhJztcblxuZXhwb3J0IHsgR29vZGJ5ZSwgV29ybGQgfTtcbiIsImZ1bmN0aW9uIFRvZ2dsZU5hdmlnYXRpb24oKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgbWFpbk5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1tZW51Jyk7XG4gIGxldCBuYXZCYXJUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtbmF2YmFyLXRvZ2dsZScpO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIG5hdkJhclRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU1lbnUpO1xuXG4gIC8vIGV2ZW50IGhhbmRsZXJzXG4gIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG4gICAgbWFpbk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBEcm9wZG93bk1lbnUoKSB7XG4gIC8vIGNhY2hlIERPTVxuICBsZXQgY2FyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1jYXInKTtcbiAgbGV0IGRyb3BEb3duTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi0tY2FyIC5kcm9wZG93bi1tZW51Jyk7XG5cbiAgaWYgKGNhckJ0biAhPSBudWxsICYmIGRyb3BEb3duTWVudSAhPSBudWxsKSB7XG4gICAgbGV0IGRyb3BEb3duID0gY2FyQnRuLnBhcmVudEVsZW1lbnQ7XG4gICAgLy8gQmluZCBldmVudHNcbiAgICBjYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJCdG5IYW5kbGVyKTtcblxuICAgIC8vIEV2ZW50IGhhbmRsZXJzXG4gICAgZnVuY3Rpb24gY2FyQnRuSGFuZGxlcihldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAvLyB0b2dnbGUgZGlzcGxheVxuICAgICAgaWYgKFxuICAgICAgICBkcm9wRG93bk1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnIHx8XG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID09PSAnJ1xuICAgICAgKSB7XG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZHJvcERvd24uc3R5bGUuaGVpZ2h0ID1cbiAgICAgICAgICBkcm9wRG93bi5vZmZzZXRIZWlnaHQgKyBkcm9wRG93bk1lbnUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRyb3BEb3duTWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkcm9wRG93bi5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIEZpeGVkTmF2aWdhdGlvbigpIHtcbiAgLy8gbWFrZSBuYXZiYXIgc3RpY2t5XG4gIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXG4gIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIG15RnVuY3Rpb24oKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGhlYWRlclxuICBsZXQgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdmJhcicpO1xuXG4gIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcbiAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XG5cbiAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXG4gIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XG4gICAgbGV0IHN0aWNreSA9IG5hdkJhci5vZmZzZXRUb3A7XG4gICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IHN0aWNreSkge1xuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5hZGQoJ25hdmJhci1maXhlZC10b3AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmF2QmFyLmNsYXNzTGlzdC5yZW1vdmUoJ25hdmJhci1maXhlZC10b3AnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gU2VsZWN0VHJpcCgpIHtcbiAgLy8gc2VsZWN0IHZlaGljbGVcbiAgJCgnLnRhYi1jYXIgLmJ0bicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgJCgnLnRhYi1jYXIgLmljb24tcmFkaW8gaW5wdXRbdHlwZT1cInJhZGlvXCJdJykuY2xpY2soZnVuY3Rpb24oZXZ0KSB7XG4gICAgJCgnLnRhYi1jYXIgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tY3RhLS1kaXNhYmxlZCcpO1xuICAgICQoJy50YWItY2FyIC5idG4nKS5hZGRDbGFzcygnYnRuLWN0YScpO1xuICAgICQoJy50YWItY2FyIC5idG4nKS51bmJpbmQoKTtcbiAgfSk7XG59XG5cbi8vIHNob3cgbW9iaWxlIGN1cnJlbmN5XG5mdW5jdGlvbiBSZXZlYWxDdXJyZW5jeSgpIHtcbiAgJCgnLmN1cnJlbmN5TW9iaWxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ0N1cnJlbmN5Jyk7XG5cbiAgICAkKCcuY3VycmVuY3knKS5zbGlkZVRvZ2dsZSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgVG9nZ2xlTmF2aWdhdGlvbixcbiAgRHJvcGRvd25NZW51LFxuICBGaXhlZE5hdmlnYXRpb24sXG4gIFNlbGVjdFRyaXAsXG4gIFJldmVhbEN1cnJlbmN5XG59O1xuIiwiZnVuY3Rpb24gUG9saWN5U3VtbWFyeSgpIHtcbiAgLy8gcG9saWN5IHN1bW1hcnlcbiAgJCgnLnBvbGljeS1zdW1tYXJ5IC5pbmZvLWJveCcpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gIH0pO1xuXG4gICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmNsaWNrKGZ1bmN0aW9uKGV2dCkge1xuICAgICQoJy5jYXJkLWNvdmVyLW9wdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAgIGV2dC5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgLy8gc2hvdyBwb2xpY3kgc3VtbWFyeVxuICAgICQoJy5wb2xpY3ktc3VtbWFyeSAuaW5mby1ib3gnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAkKGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfSk7XG4gICAgbGV0IHBvbGljeVN1bW1hcnkgPSAkKHRoaXMpLmRhdGEoJ3BvbGljeScpO1xuICAgICQoJy4nICsgcG9saWN5U3VtbWFyeSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgeyBQb2xpY3lTdW1tYXJ5IH07XG4iLCIvLyBtb2R1bGUgUmV2ZWFsRG9jcy5qc1xuXG5mdW5jdGlvbiBSZXZlYWxEb2NzKCkge1xuICAvL0RvY3NcbiAgJCgnLnJldmVhbGRvY3MnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBvbiA9ICQoJy5kb2NzJykuaXMoJzp2aXNpYmxlJyk7XG4gICAgJCh0aGlzKS5odG1sKFxuICAgICAgb24gPyAnVmlldyBwb2xpY3kgZG9jdW1lbnRhdGlvbicgOiAnSGlkZSBwb2xpY3kgZG9jdW1lbnRhdGlvbidcbiAgICApO1xuICAgICQoJy5kb2NzJykuc2xpZGVUb2dnbGUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7IFJldmVhbERvY3MgfTtcbiIsIi8vIG1vZHVsZSBcIlNjcmVlbi5qc1wiXG5cbmZ1bmN0aW9uIF9zY3JvbGxUb1RvcChzY3JvbGxEdXJhdGlvbikge1xuICB2YXIgc2Nyb2xsU3RlcCA9IC13aW5kb3cuc2Nyb2xsWSAvIChzY3JvbGxEdXJhdGlvbiAvIDE1KSxcbiAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcbiAgICAgICAgd2luZG93LnNjcm9sbEJ5KDAsIHNjcm9sbFN0ZXApO1xuICAgICAgfSBlbHNlIGNsZWFySW50ZXJ2YWwoc2Nyb2xsSW50ZXJ2YWwpO1xuICAgIH0sIDE1KTtcbn1cblxuZnVuY3Rpb24gX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dChzY3JvbGxEdXJhdGlvbikge1xuICBjb25zdCBjb3NQYXJhbWV0ZXIgPSB3aW5kb3cuc2Nyb2xsWSAvIDI7XG4gIGxldCBzY3JvbGxDb3VudCA9IDAsXG4gICAgb2xkVGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXApIHtcbiAgICBzY3JvbGxDb3VudCArPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpO1xuICAgIGlmIChzY3JvbGxDb3VudCA+PSBNYXRoLlBJKSB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID09PSAwKSByZXR1cm47XG4gICAgd2luZG93LnNjcm9sbFRvKFxuICAgICAgMCxcbiAgICAgIE1hdGgucm91bmQoY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogTWF0aC5jb3Moc2Nyb2xsQ291bnQpKVxuICAgICk7XG4gICAgb2xkVGltZXN0YW1wID0gbmV3VGltZXN0YW1wO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xufVxuLypcbiAgRXhwbGFuYXRpb25zOlxuICAtIHBpIGlzIHRoZSBsZW5ndGgvZW5kIHBvaW50IG9mIHRoZSBjb3NpbnVzIGludGVydmFsbCAoc2VlIGFib3ZlKVxuICAtIG5ld1RpbWVzdGFtcCBpbmRpY2F0ZXMgdGhlIGN1cnJlbnQgdGltZSB3aGVuIGNhbGxiYWNrcyBxdWV1ZWQgYnkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJlZ2luIHRvIGZpcmUuXG4gICAgKGZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3JlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgLSBuZXdUaW1lc3RhbXAgLSBvbGRUaW1lc3RhbXAgZXF1YWxzIHRoZSBkdXJhdGlvblxuXG4gICAgYSAqIGNvcyAoYnggKyBjKSArIGQgICAgICAgICAgICAgICAgICAgICAgfCBjIHRyYW5zbGF0ZXMgYWxvbmcgdGhlIHggYXhpcyA9IDBcbiAgPSBhICogY29zIChieCkgKyBkICAgICAgICAgICAgICAgICAgICAgICAgICB8IGQgdHJhbnNsYXRlcyBhbG9uZyB0aGUgeSBheGlzID0gMSAtPiBvbmx5IHBvc2l0aXZlIHkgdmFsdWVzXG4gID0gYSAqIGNvcyAoYngpICsgMSAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeSBheGlzID0gY29zUGFyYW1ldGVyID0gd2luZG93LnNjcm9sbFkgLyAyXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBieCkgICAgfCBiIHN0cmV0Y2hlcyBhbG9uZyB0aGUgeCBheGlzID0gc2Nyb2xsQ291bnQgPSBNYXRoLlBJIC8gKHNjcm9sbER1cmF0aW9uIC8gKG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcCkpXG4gID0gY29zUGFyYW1ldGVyICsgY29zUGFyYW1ldGVyICogKGNvcyBzY3JvbGxDb3VudCAqIHgpXG4qL1xuXG5mdW5jdGlvbiBTY3JvbGxUb1RvcCgpIHtcbiAgLy8gQ2FjaGUgRE9NXG4gIGNvbnN0IGJhY2tUb1RvcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1iYWNrLXRvLXRvcCcpO1xuXG4gIC8vIEJpbmQgRXZlbnRzXG4gIGlmIChiYWNrVG9Ub3BCdG4gIT0gbnVsbCkge1xuICAgIGJhY2tUb1RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb1RvcEJ0bkhhbmRsZXIpO1xuICB9XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYmFja1RvVG9wQnRuSGFuZGxlcihldnQpIHtcbiAgICAvLyBBbmltYXRlIHRoZSBzY3JvbGwgdG8gdG9wXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3Njcm9sbFRvVG9wRWFzZUluRWFzZU91dCgxMDAwKTtcblxuICAgIC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDMwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gV2luZG93V2lkdGgoKSB7XG4gIGNvbnNvbGUubG9nKCdXaW5kb3dXaWR0aCcpO1xuXG4gIC8vIGNhY2hlIERPTVxuICBjb25zdCBhY2NvcmRpb25CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnLmNhcmQtcHJvZHVjdHMgLmFjY29yZGlvbi1idG4nXG4gICk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgIGxldCB3ID1cbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG4gICAgaWYgKHcgPiAxMjAwKSB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhY2NvcmRpb25CdG5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjY29yZGlvbkJ0bnNbaV0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3IDw9IDEyMDApIHtcbiAgICAgIGxldCBpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGFjY29yZGlvbkJ0bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWNjb3JkaW9uQnRuc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH07XG4iLCIvLyBtb2R1bGUgXCJTY3JvbGxUby5qc1wiXG5cbmZ1bmN0aW9uIFNjcm9sbFRvKCkge1xuICAvLyBjYWNoZSBET01cbiAgLy8gU2VsZWN0IGFsbCBsaW5rcyB3aXRoIGhhc2hlc1xuICAvLyBSZW1vdmUgbGlua3MgdGhhdCBkb24ndCBhY3R1YWxseSBsaW5rIHRvIGFueXRoaW5nXG4gIGxldCBhbmNob3JzID0gJCgnYVtocmVmKj1cIiNcIl0nKVxuICAgIC5ub3QoJ1tocmVmPVwiI1wiXScpXG4gICAgLm5vdCgnW2hyZWY9XCIjMFwiXScpO1xuXG4gIGxldCBoZWlnaHRDb21wZW5zYXRpb24gPSA2MDtcbiAgLy8gQmluZCBFdmVudHNcbiAgYW5jaG9ycy5jbGljayhhbmNob3JzSGFuZGxlcik7XG5cbiAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgZnVuY3Rpb24gYW5jaG9yc0hhbmRsZXIoZXZlbnQpIHtcbiAgICAvLyBPbi1wYWdlIGxpbmtzXG4gICAgaWYgKFxuICAgICAgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSA9PVxuICAgICAgICB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgJiZcbiAgICAgIGxvY2F0aW9uLmhvc3RuYW1lID09IHRoaXMuaG9zdG5hbWVcbiAgICApIHtcbiAgICAgIC8vIEZpZ3VyZSBvdXQgZWxlbWVudCB0byBzY3JvbGwgdG9cbiAgICAgIGxldCB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XG4gICAgICAvLyBEb2VzIGEgc2Nyb2xsIHRhcmdldCBleGlzdD9cbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgIC8vIE9ubHkgcHJldmVudCBkZWZhdWx0IGlmIGFuaW1hdGlvbiBpcyBhY3R1YWxseSBnb25uYSBoYXBwZW5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gaGVpZ2h0Q29tcGVuc2F0aW9uXG4gICAgICAgICAgfSxcbiAgICAgICAgICAxMDAwLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgYWZ0ZXIgYW5pbWF0aW9uXG4gICAgICAgICAgICAvLyBNdXN0IGNoYW5nZSBmb2N1cyFcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJCh0YXJnZXQpO1xuICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgaWYgKCR0YXJnZXQuaXMoJzpmb2N1cycpKSB7XG4gICAgICAgICAgICAgIC8vIENoZWNraW5nIGlmIHRoZSB0YXJnZXQgd2FzIGZvY3VzZWRcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpOyAvLyBBZGRpbmcgdGFiaW5kZXggZm9yIGVsZW1lbnRzIG5vdCBmb2N1c2FibGVcbiAgICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpOyAvLyBTZXQgZm9jdXMgYWdhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIG9uIHNjcm9sbFxuaWYgKCQoJy5hcnRpY2xlLW1haW4nKS5sZW5ndGggPiAwKSB7XG4gIGxldCB0YXJnZXQgPSAkKCcuYXJ0aWNsZS1tYWluJykub2Zmc2V0KCkudG9wIC0gMTgwO1xuICAkKGRvY3VtZW50KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+PSB0YXJnZXQpIHtcbiAgICAgICQoJy5zaGFyZS1idXR0b25zJykuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuc2hhcmUtYnV0dG9ucycpLmhpZGUoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyBTY3JvbGxUbyB9O1xuIiwiZnVuY3Rpb24gUmVhZHkoZm4pIHtcbiAgaWYgKFxuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gICAgICA/IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcbiAgICAgIDogZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnXG4gICkge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5leHBvcnQgeyBSZWFkeSB9O1xuIiwiZnVuY3Rpb24gVmVoaWNsZVNlbGVjdG9yKCkge1xuICAvLyBjYWNoZSBET01cbiAgbGV0IGNhclRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlua19fY2FyJyk7XG4gIGxldCB2YW5UYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpbmtfX3ZhbicpO1xuXG4gIC8vIGJpbmQgZXZlbnRzXG4gIGlmIChjYXJUYWIgIT0gbnVsbCAmJiB2YW5UYWIgIT0gbnVsbCkge1xuICAgIGNhclRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5WZWhpY2xlKTtcbiAgICB2YW5UYWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuVmVoaWNsZSk7XG4gIH1cblxuICAvLyBldmVudCBoYW5kbGVyc1xuICBmdW5jdGlvbiBvcGVuVmVoaWNsZShldnQpIHtcbiAgICB2YXIgaSwgeCwgdGFiQnV0dG9ucztcblxuICAgIGNvbnNvbGUubG9nKGV2dCk7XG5cbiAgICAvLyBoaWRlIGFsbCB0YWIgY29udGVudHNcbiAgICB4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1jb250YWluZXIgLnRhYicpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB4W2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHRoZSBoaWdobGlnaHQgb24gdGhlIHRhYiBidXR0b25cbiAgICB0YWJCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi10YWJzIC5uYXYtbGluaycpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0YWJCdXR0b25zW2ldLmNsYXNzTmFtZSA9IHRhYkJ1dHRvbnNbaV0uY2xhc3NOYW1lLnJlcGxhY2UoJyBhY3RpdmUnLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gaGlnaGxpZ2h0IHRhYiBidXR0b24gYW5kXG4gICAgLy8gc2hvdyB0aGUgc2VsZWN0ZWQgdGFiIGNvbnRlbnRcbiAgICBsZXQgdmVoaWNsZSA9IGV2dC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12ZWhpY2xlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi0nICsgdmVoaWNsZSkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lICs9ICcgYWN0aXZlJztcbiAgfVxufVxuXG5leHBvcnQgeyBWZWhpY2xlU2VsZWN0b3IgfTtcbiIsIi8vIG1vZHVsZSBcIkxvYWRGQVFzLmpzXCJcblxuZnVuY3Rpb24gTG9hZEZBUXMoKSB7XG4gIC8vIGxvYWQgZmFxc1xuICAkKCcjZmFxVGFicyBhJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKHRoaXMpLnRhYignc2hvdycpO1xuICB9KTtcblxuICAvLyBsb2FkIGZhcXNcbiAgLy8gb25seSBsb2FkIGlmIG9uIGZhcXMgcGFnZVxuICBpZiAoJCgnI2ZhcXMnKS5sZW5ndGggPiAwKSB7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgdXJsOiAnL2FwaS9mYXFzLmpzb24nLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZmFxcykge1xuICAgICAgICAvLyBnZXQgdGhlIGhlYWRzXG4gICAgICAgICQuZWFjaChmYXFzLCBmdW5jdGlvbihpbmRleCwgZmFxKSB7XG4gICAgICAgICAgLy8gYWRkIHRpdGxlIGZvciBkZXNrdG9wXG4gICAgICAgICAgJChgYVtocmVmPScjJHtmYXEuaWR9J11gKVxuICAgICAgICAgICAgLmZpbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLnRleHQoZmFxLnRpdGxlKTtcblxuICAgICAgICAgIC8vIGFkZCB0aXRsZSBmb3IgbW9iaWxlXG4gICAgICAgICAgJChgIyR7ZmFxLmlkfWApXG4gICAgICAgICAgICAuZmluZCgnaDMnKVxuICAgICAgICAgICAgLnRleHQoZmFxLnNob3J0VGl0bGUpO1xuXG4gICAgICAgICAgLy8gZ2V0IHRoZSBib2R5XG4gICAgICAgICAgJC5lYWNoKGZhcS5xYXMsIGZ1bmN0aW9uKGZJbmRleCwgcWEpIHtcbiAgICAgICAgICAgICQoJy5pbm5lciAuYWNjb3JkaW9uJywgYCMke2ZhcS5pZH1gKS5hcHBlbmQoXG4gICAgICAgICAgICAgIGA8YnV0dG9uIGNsYXNzPVwiYWNjb3JkaW9uLWJ0biBoNFwiPiR7cWEucXVlc3Rpb259PC9idXR0b24+XG4gICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVsXCI+XG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxuICAgICAgICAgICAgICAgICAke3FhLmFuc3dlcn1cbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gJGFqYXhcblxuICAgICQoJy5mYXEtYW5zd2VycyAuaW5uZXIgLmFjY29yZGlvbicpLmRlbGVnYXRlKFxuICAgICAgJy5hY2NvcmRpb24tYnRuJyxcbiAgICAgICdjbGljaycsXG4gICAgICBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcbiAgICAgICAgICB0byBoaWdobGlnaHQgdGhlIGJ1dHRvbiB0aGF0IGNvbnRyb2xzIHRoZSBwYW5lbCAqL1xuICAgICAgICBldnQuY3VycmVudFRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblxuICAgICAgICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuICAgICAgICBsZXQgcGFuZWwgPSBldnQuY3VycmVudFRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpblRvcCA9ICcwJztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnLTExcHgnO1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxOHB4JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvLyBvbmx5IGxvYWQgaWYgb24gcHJvZHVjdCBmYXFzIHBhZ2VcbiAgaWYgKCQoJy5wcm9kdWN0LWZhcXMnKS5sZW5ndGggPiAwKSB7XG4gICAgbGV0IGZpbGUgPSAkKCcucHJvZHVjdC1mYXFzJylcbiAgICAgIC5kYXRhKCdmYXFzJylcbiAgICAgIC5yZXBsYWNlKCcmLScsICcnKTtcblxuICAgIGNvbnNvbGUubG9nKGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICB1cmw6IGAvYXBpLyR7ZmlsZX0tZmFxcy5qc29uYCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGZhcXMpIHtcbiAgICAgICAgLy8gZ2V0IHRoZSBib2R5XG4gICAgICAgICQuZWFjaChmYXFzLCBmdW5jdGlvbihmSW5kZXgsIGZhcSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAjJHtmYXEuaWR9YCk7XG4gICAgICAgICAgJCgnLmlubmVyIC5hY2NvcmRpb24nKS5hcHBlbmQoXG4gICAgICAgICAgICBgPGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idG4gaDRcIj4ke2ZhcS5xdWVzdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lclwiPlxuICAgICAgICAgICAgICAgICR7ZmFxLmFuc3dlcn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2hvdyBjb250ZW50XG4gICAgICAgICQoJy5mYXEtYW5zd2Vycy1wcm9kdWN0Jykuc2hvdygpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7IC8vICRhamF4XG5cbiAgICAkKCcuZmFxLWFuc3dlcnMgLmlubmVyIC5hY2NvcmRpb24nKS5kZWxlZ2F0ZShcbiAgICAgICcuYWNjb3JkaW9uLWJ0bicsXG4gICAgICAnY2xpY2snLFxuICAgICAgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG4gICAgICAgICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICAgICAgbGV0IHBhbmVsID0gZXZ0LmN1cnJlbnRUYXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luQm90dG9tID0gJzAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICAgICAgcGFuZWwuc3R5bGUubWFyZ2luVG9wID0gJy0xMXB4JztcbiAgICAgICAgICBwYW5lbC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMThweCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IExvYWRGQVFzIH07XG4iLCJpbXBvcnQgeyBHb29kYnllLCBXb3JsZCB9IGZyb20gJy4vY29tcG9uZW50cy9Hb29kYnllV29ybGQnO1xuaW1wb3J0IHsgU2Nyb2xsVG9Ub3AsIFdpbmRvd1dpZHRoIH0gZnJvbSAnLi9jb21wb25lbnRzL1NjcmVlbic7XG5pbXBvcnQgeyBBY2NvcmRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uJztcbmltcG9ydCB7IENvdW50cnlTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9Db3VudHJ5U2VsZWN0b3InO1xuaW1wb3J0IHsgVmVoaWNsZVNlbGVjdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL1ZlaGljbGVTZWxlY3Rvcic7XG5pbXBvcnQge1xuICBUb2dnbGVOYXZpZ2F0aW9uLFxuICBEcm9wZG93bk1lbnUsXG4gIEZpeGVkTmF2aWdhdGlvbixcbiAgU2VsZWN0VHJpcCxcbiAgUmV2ZWFsQ3VycmVuY3lcbn0gZnJvbSAnLi9jb21wb25lbnRzL05hdmlnYXRpb24nO1xuaW1wb3J0IHsgU2Nyb2xsVG8gfSBmcm9tICcuL2NvbXBvbmVudHMvU2Nyb2xsVG8nO1xuaW1wb3J0IHsgQXV0b0NvbXBsZXRlIH0gZnJvbSAnLi9jb21wb25lbnRzL0F1dG9Db21wbGV0ZSc7XG5pbXBvcnQgeyBMb2FkRkFRcyB9IGZyb20gJy4vY29tcG9uZW50cy9mYXFzJztcbmltcG9ydCB7IFJldmVhbERvY3MgfSBmcm9tICcuL2NvbXBvbmVudHMvUmV2ZWFsRG9jcyc7XG5pbXBvcnQgeyBDb3Zlck9wdGlvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvQ292ZXJPcHRpb25zJztcbmltcG9ydCB7IFJlYWR5IH0gZnJvbSAnLi9jb21wb25lbnRzL1V0aWxzJztcbmltcG9ydCB7IFBvbGljeVN1bW1hcnkgfSBmcm9tICcuL2NvbXBvbmVudHMvUG9saWN5U3VtbWFyeSc7XG5cbmNvbnNvbGUubG9nKGAke0dvb2RieWUoKX0gJHtXb3JsZH0gSW5kZXggZmlsZWApO1xuXG5sZXQgY291bnRyaWVzQ292ZXJlZCA9IG51bGw7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBDb3VudHJ5U2VsZWN0b3IoKTtcbiAgVmVoaWNsZVNlbGVjdG9yKCk7XG4gIFRvZ2dsZU5hdmlnYXRpb24oKTtcbiAgRHJvcGRvd25NZW51KCk7XG4gIFNjcm9sbFRvVG9wKCk7XG4gIEZpeGVkTmF2aWdhdGlvbigpO1xuICBBY2NvcmRpb24oKTtcbiAgV2luZG93V2lkdGgoKTtcbiAgU2Nyb2xsVG8oKTtcbiAgaWYgKGNvdW50cmllc0NvdmVyZWQgIT0gbnVsbCkge1xuICAgIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbnB1dCcpLCBjb3VudHJpZXNDb3ZlcmVkKTtcbiAgfVxuICBMb2FkRkFRcygpO1xuICAvLyBSZXZlYWxEb2NzKCk7XG4gIENvdmVyT3B0aW9ucygpO1xuICBQb2xpY3lTdW1tYXJ5KCk7XG4gIFNlbGVjdFRyaXAoKTtcbiAgUmV2ZWFsQ3VycmVuY3koKTtcbn1cblxuUmVhZHkoc3RhcnQpO1xuIl19
