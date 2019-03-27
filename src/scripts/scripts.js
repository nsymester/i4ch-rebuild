function countrySelector() {
  // cache DOM
  let up = document.querySelector('.country-scroller__up');
  let down = document.querySelector('.country-scroller__down');
  let items = document.querySelector('.country-scroller__items');
  let itemHeight =
    items != null ? items.firstChild.nextSibling.offsetHeight : 0;

  // bind events
  if (up != null) {
    up.addEventListener('click', scrollUp);
    down.addEventListener('click', scrollDown);

    // event handlers
    function scrollUp() {
      // move items list up by height of li element
      items.scrollTop += itemHeight;
    }

    function scrollDown() {
      // move items list down by height of li element
      items.scrollTop -= itemHeight;
    }
  }
}

function vehicleSelector() {
  // cache DOM
  let carTab = document.querySelector('.nav-link__car');
  let vanTab = document.querySelector('.nav-link__van');

  // bind events
  carTab.addEventListener('click', openVehicle);
  vanTab.addEventListener('click', openVehicle);

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

function toggleNavigation() {
  // cache DOM
  let mainNav = document.getElementById('js-menu');
  let navBarToggle = document.getElementById('js-navbar-toggle');

  // bind events
  navBarToggle.addEventListener('click', toggleMenu);

  // event handlers
  function toggleMenu() {
    mainNav.classList.toggle('active');
  }
}

function dropdownMenu() {
  // cache DOM
  let carBtn = document.querySelector('.btn-car');
  let dropDown = carBtn.parentElement;
  let dropDownMenu = document.querySelector('.dropdown--car .dropdown-menu');

  // Bind events
  carBtn.addEventListener('click', carBtnHandler);

  // Event handlers
  function carBtnHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    // toggle display
    if (
      dropDownMenu.style.display === 'none' ||
      dropDownMenu.style.display === ''
    ) {
      dropDownMenu.style.display = 'block';
      dropDown.style.height =
        dropDown.offsetHeight + dropDownMenu.offsetHeight + 'px';
    } else {
      dropDownMenu.style.display = 'none';
      dropDown.style.height = 'auto';
    }
  }
}

function start() {
  countrySelector();
  vehicleSelector();
  toggleNavigation();
  dropdownMenu();
}

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(start);
