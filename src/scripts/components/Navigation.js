function ToggleNavigation() {
  // cache DOM
  const currency = $('.currency');
  const mainNav = document.getElementById('js-menu');
  const navBarToggle = document.getElementById('js-navbar-toggle');
  const currencyNav = document.getElementById('js-currency-toggle');
  const currencyMenuToggle = document.getElementById('js-navbar-toggle');

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

  $(window).resize(function() {
    if ($(window).width() > '1199') {
      currency.show();
    } else {
      currency.hide();
    }
  });
}

function DropdownMenu() {
  // cache DOM
  let carBtn = document.querySelector('.btn-car');
  let dropDownMenu = document.querySelector('.dropdown--car .dropdown-menu');

  if (carBtn != null && dropDownMenu != null) {
    let dropDown = carBtn.parentElement;
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
}

function FixedNavigation() {
  // make navbar sticky
  // When the user scrolls the page, execute myFunction
  window.onscroll = function() {
    myFunction();
  };

  // Get the header
  let navBar = document.querySelector('.navbar');

  // Get the offset position of the navbar
  let sticky = navBar.offsetTop;

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
    let sticky = navBar.offsetTop;
    if (window.pageYOffset > sticky) {
      navBar.classList.add('navbar-fixed-top');
    } else {
      navBar.classList.remove('navbar-fixed-top');
    }
  }
}

function SelectTrip() {
  // select vehicle
  $('.tab-car .btn').click(function(evt) {
    evt.preventDefault();
    return false;
  });

  $('.tab-car .icon-radio input[type="radio"]').click(function(evt) {
    $('.tab-car .btn').removeClass('btn-cta--disabled');
    $('.tab-car .btn').addClass('btn-cta');
    $('.tab-car .btn').unbind();
  });
}

// show mobile currency
function RevealCurrency() {
  $('.currency-mobile').on('click', function() {
    console.log('Currency');

    $('.currency').slideToggle();
  });
}

export {
  ToggleNavigation,
  DropdownMenu,
  FixedNavigation,
  SelectTrip,
  RevealCurrency
};
