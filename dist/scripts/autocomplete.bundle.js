(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _AutoComplete = require("./components/AutoComplete");

var _Utils = require("./components/Utils");

function start() {
  if (countriesCovered != null) {
    (0, _AutoComplete.AutoComplete)(document.getElementById('allowedCountries'), countriesCovered);
  }
}

(0, _Utils.Ready)(start);

},{"./components/AutoComplete":2,"./components/Utils":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoComplete = AutoComplete;

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hdXRvY29tcGxldGUuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL0F1dG9Db21wbGV0ZS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBOztBQUNBOztBQUdBLFNBQVMsS0FBVCxHQUFpQjtBQUNmLE1BQUksZ0JBQWdCLElBQUksSUFBeEIsRUFBOEI7QUFDNUIsb0NBQWEsUUFBUSxDQUFDLGNBQVQsQ0FBd0Isa0JBQXhCLENBQWIsRUFBMEQsZ0JBQTFEO0FBQ0Q7QUFDRjs7QUFFRCxrQkFBTSxLQUFOOzs7Ozs7Ozs7O0FDWEE7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBUyxZQUFULENBQXNCLEdBQXRCLEVBQTJCLEdBQTNCLEVBQWdDO0FBQzlCLE1BQUksWUFBSjtBQUNBOztBQUNBLEVBQUEsR0FBRyxDQUFDLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFVBQVMsQ0FBVCxFQUFZO0FBQ3hDLFFBQUksQ0FBSjtBQUFBLFFBQ0UsQ0FERjtBQUFBLFFBRUUsQ0FGRjtBQUFBLFFBR0UsR0FBRyxHQUFHLEtBQUssS0FIYjtBQUlBOztBQUNBLElBQUEsYUFBYTs7QUFDYixRQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1IsYUFBTyxLQUFQO0FBQ0Q7O0FBQ0QsSUFBQSxZQUFZLEdBQUcsQ0FBQyxDQUFoQjtBQUNBOztBQUNBLElBQUEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQUo7QUFDQSxJQUFBLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBZixFQUFxQixLQUFLLEVBQUwsR0FBVSxtQkFBL0I7QUFDQSxJQUFBLENBQUMsQ0FBQyxZQUFGLENBQWUsT0FBZixFQUF3QixvQkFBeEI7QUFDQTs7QUFDQSxTQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FBNEIsQ0FBNUI7QUFDQTs7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LENBQUMsTUFBdEIsRUFBOEIsQ0FBQyxFQUEvQixFQUFtQztBQUNqQyxNQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixxQkFBdEI7QUFDRDtBQUNGOztBQUNELFdBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QjtBQUM1Qjs7QUFFQSxRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsc0JBQVQsQ0FBZ0Msb0JBQWhDLENBQVI7O0FBQ0EsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBdEIsRUFBOEIsQ0FBQyxFQUEvQixFQUFtQztBQUNqQyxVQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBRCxDQUFWLElBQWlCLEtBQUssSUFBSSxHQUE5QixFQUFtQztBQUNqQyxRQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLENBQUMsQ0FBQyxDQUFELENBQTdCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Q7OztBQUNBLEVBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFVBQVMsQ0FBVCxFQUFZO0FBQzdDLElBQUEsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFILENBQWI7QUFDRCxHQUZEO0FBR0Q7Ozs7Ozs7Ozs7QUM3R0QsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUNFLFFBQVEsQ0FBQyxXQUFULEdBQ0ksUUFBUSxDQUFDLFVBQVQsS0FBd0IsVUFENUIsR0FFSSxRQUFRLENBQUMsVUFBVCxLQUF3QixTQUg5QixFQUlFO0FBQ0EsSUFBQSxFQUFFO0FBQ0gsR0FORCxNQU1PO0FBQ0wsSUFBQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5pbXBvcnQgeyBBdXRvQ29tcGxldGUgfSBmcm9tICcuL2NvbXBvbmVudHMvQXV0b0NvbXBsZXRlJztcclxuaW1wb3J0IHsgUmVhZHkgfSBmcm9tICcuL2NvbXBvbmVudHMvVXRpbHMnO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gIGlmIChjb3VudHJpZXNDb3ZlcmVkICE9IG51bGwpIHtcclxuICAgIEF1dG9Db21wbGV0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxsb3dlZENvdW50cmllcycpLCBjb3VudHJpZXNDb3ZlcmVkKTtcclxuICB9XHJcbn1cclxuXHJcblJlYWR5KHN0YXJ0KTtcclxuIiwiLy8gbW9kdWxlIFwiQXV0b0NvbXBsZXRlLmpzXCJcclxuXHJcbi8qKlxyXG4gKiBbQXV0b0NvbXBsZXRlIGRlc2NyaXB0aW9uXVxyXG4gKlxyXG4gKiBAcGFyYW0gICB7c3RyaW5nfSAgdXNlcklucHV0ICB1c2VyIGlucHV0XHJcbiAqIEBwYXJhbSAgIHthcnJheX0gIHNlYXJjaExpc3QgIHNlYXJjaCBsaXN0XHJcbiAqXHJcbiAqIEByZXR1cm4gIHtbdHlwZV19ICAgICAgIFtyZXR1cm4gZGVzY3JpcHRpb25dXHJcbiAqL1xyXG5mdW5jdGlvbiBBdXRvQ29tcGxldGUoaW5wLCBhcnIpIHtcclxuICB2YXIgY3VycmVudEZvY3VzO1xyXG4gIC8qZXhlY3V0ZSBhIGZ1bmN0aW9uIHdoZW4gc29tZW9uZSB3cml0ZXMgaW4gdGhlIHRleHQgZmllbGQ6Ki9cclxuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgYSxcclxuICAgICAgYixcclxuICAgICAgaSxcclxuICAgICAgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgIC8qY2xvc2UgYW55IGFscmVhZHkgb3BlbiBsaXN0cyBvZiBhdXRvY29tcGxldGVkIHZhbHVlcyovXHJcbiAgICBjbG9zZUFsbExpc3RzKCk7XHJcbiAgICBpZiAoIXZhbCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50Rm9jdXMgPSAtMTtcclxuICAgIC8qY3JlYXRlIGEgRElWIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGl0ZW1zICh2YWx1ZXMpOiovXHJcbiAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XHJcbiAgICBhLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkICsgJ2F1dG9jb21wbGV0ZS1saXN0Jyk7XHJcbiAgICBhLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXV0b2NvbXBsZXRlLWl0ZW1zJyk7XHJcbiAgICAvKmFwcGVuZCB0aGUgRElWIGVsZW1lbnQgYXMgYSBjaGlsZCBvZiB0aGUgYXV0b2NvbXBsZXRlIGNvbnRhaW5lcjoqL1xyXG4gICAgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgLypmb3IgZWFjaCBpdGVtIGluIHRoZSBhcnJheS4uLiovXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8qY2hlY2sgaWYgdGhlIGl0ZW0gc3RhcnRzIHdpdGggdGhlIHNhbWUgbGV0dGVycyBhcyB0aGUgdGV4dCBmaWVsZCB2YWx1ZToqL1xyXG4gICAgICBpZiAoYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgLypjcmVhdGUgYSBESVYgZWxlbWVudCBmb3IgZWFjaCBtYXRjaGluZyBlbGVtZW50OiovXHJcbiAgICAgICAgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgICAgIC8qbWFrZSB0aGUgbWF0Y2hpbmcgbGV0dGVycyBib2xkOiovXHJcbiAgICAgICAgYi5pbm5lckhUTUwgPSAnPHN0cm9uZz4nICsgYXJyW2ldLnN1YnN0cigwLCB2YWwubGVuZ3RoKSArICc8L3N0cm9uZz4nO1xyXG4gICAgICAgIGIuaW5uZXJIVE1MICs9IGFycltpXS5zdWJzdHIodmFsLmxlbmd0aCk7XHJcbiAgICAgICAgLyppbnNlcnQgYSBpbnB1dCBmaWVsZCB0aGF0IHdpbGwgaG9sZCB0aGUgY3VycmVudCBhcnJheSBpdGVtJ3MgdmFsdWU6Ki9cclxuICAgICAgICBiLmlubmVySFRNTCArPSBcIjxpbnB1dCB0eXBlPSdoaWRkZW4nIHZhbHVlPSdcIiArIGFycltpXSArIFwiJz5cIjtcclxuICAgICAgICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIG9uIHRoZSBpdGVtIHZhbHVlIChESVYgZWxlbWVudCk6Ki9cclxuICAgICAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgLyppbnNlcnQgdGhlIHZhbHVlIGZvciB0aGUgYXV0b2NvbXBsZXRlIHRleHQgZmllbGQ6Ki9cclxuICAgICAgICAgIGlucC52YWx1ZSA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF0udmFsdWU7XHJcbiAgICAgICAgICAvKmNsb3NlIHRoZSBsaXN0IG9mIGF1dG9jb21wbGV0ZWQgdmFsdWVzLFxyXG4gICAgICAgICAgICAob3IgYW55IG90aGVyIG9wZW4gbGlzdHMgb2YgYXV0b2NvbXBsZXRlZCB2YWx1ZXM6Ki9cclxuICAgICAgICAgIGNsb3NlQWxsTGlzdHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhLmFwcGVuZENoaWxkKGIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLypleGVjdXRlIGEgZnVuY3Rpb24gcHJlc3NlcyBhIGtleSBvbiB0aGUga2V5Ym9hcmQ6Ki9cclxuICBpbnAuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCArICdhdXRvY29tcGxldGUtbGlzdCcpO1xyXG4gICAgaWYgKHgpIHggPSB4LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICAgIGlmIChlLmtleUNvZGUgPT0gNDApIHtcclxuICAgICAgLypJZiB0aGUgYXJyb3cgRE9XTiBrZXkgaXMgcHJlc3NlZCxcclxuICAgICAgaW5jcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xyXG4gICAgICBjdXJyZW50Rm9jdXMrKztcclxuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cclxuICAgICAgYWRkQWN0aXZlKHgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzgpIHtcclxuICAgICAgLy91cFxyXG4gICAgICAvKklmIHRoZSBhcnJvdyBVUCBrZXkgaXMgcHJlc3NlZCxcclxuICAgICAgZGVjcmVhc2UgdGhlIGN1cnJlbnRGb2N1cyB2YXJpYWJsZToqL1xyXG4gICAgICBjdXJyZW50Rm9jdXMtLTtcclxuICAgICAgLyphbmQgYW5kIG1ha2UgdGhlIGN1cnJlbnQgaXRlbSBtb3JlIHZpc2libGU6Ki9cclxuICAgICAgYWRkQWN0aXZlKHgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgLypJZiB0aGUgRU5URVIga2V5IGlzIHByZXNzZWQsIHByZXZlbnQgdGhlIGZvcm0gZnJvbSBiZWluZyBzdWJtaXR0ZWQsKi9cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoY3VycmVudEZvY3VzID4gLTEpIHtcclxuICAgICAgICAvKmFuZCBzaW11bGF0ZSBhIGNsaWNrIG9uIHRoZSBcImFjdGl2ZVwiIGl0ZW06Ki9cclxuICAgICAgICBpZiAoeCkgeFtjdXJyZW50Rm9jdXNdLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBmdW5jdGlvbiBhZGRBY3RpdmUoeCkge1xyXG4gICAgLyphIGZ1bmN0aW9uIHRvIGNsYXNzaWZ5IGFuIGl0ZW0gYXMgXCJhY3RpdmVcIjoqL1xyXG4gICAgaWYgKCF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAvKnN0YXJ0IGJ5IHJlbW92aW5nIHRoZSBcImFjdGl2ZVwiIGNsYXNzIG9uIGFsbCBpdGVtczoqL1xyXG4gICAgcmVtb3ZlQWN0aXZlKHgpO1xyXG4gICAgaWYgKGN1cnJlbnRGb2N1cyA+PSB4Lmxlbmd0aCkgY3VycmVudEZvY3VzID0gMDtcclxuICAgIGlmIChjdXJyZW50Rm9jdXMgPCAwKSBjdXJyZW50Rm9jdXMgPSB4Lmxlbmd0aCAtIDE7XHJcbiAgICAvKmFkZCBjbGFzcyBcImF1dG9jb21wbGV0ZS1hY3RpdmVcIjoqL1xyXG4gICAgeFtjdXJyZW50Rm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2F1dG9jb21wbGV0ZS1hY3RpdmUnKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlKHgpIHtcclxuICAgIC8qYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIFwiYWN0aXZlXCIgY2xhc3MgZnJvbSBhbGwgYXV0b2NvbXBsZXRlIGl0ZW1zOiovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgeFtpXS5jbGFzc0xpc3QucmVtb3ZlKCdhdXRvY29tcGxldGUtYWN0aXZlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsb3NlQWxsTGlzdHMoZWxtbnQpIHtcclxuICAgIC8qY2xvc2UgYWxsIGF1dG9jb21wbGV0ZSBsaXN0cyBpbiB0aGUgZG9jdW1lbnQsXHJcbiAgZXhjZXB0IHRoZSBvbmUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50OiovXHJcbiAgICB2YXIgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9jb21wbGV0ZS1pdGVtcycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChlbG1udCAhPSB4W2ldICYmIGVsbW50ICE9IGlucCkge1xyXG4gICAgICAgIHhbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh4W2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICAvKmV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgY2xpY2tzIGluIHRoZSBkb2N1bWVudDoqL1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgY2xvc2VBbGxMaXN0cyhlLnRhcmdldCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IEF1dG9Db21wbGV0ZSB9O1xyXG4iLCJmdW5jdGlvbiBSZWFkeShmbikge1xyXG4gIGlmIChcclxuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50XHJcbiAgICAgID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xyXG4gICAgICA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJ1xyXG4gICkge1xyXG4gICAgZm4oKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJlYWR5IH07XHJcbiJdfQ==
