function ToggleNavigation() {
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

function DropdownMenu() {
  // cache DOM
  let carBtn = document.querySelector('.btn-car');
  let dropDownMenu = document.querySelector('.dropdown--car .dropdown-menu');

  if (carBtn != null && dropDownMenu != null) {
    let dropDown = carBtn.parentElement;
    // Bind events
    carBtn.addEventListener('click', carBtnHandler);
  }

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

export { ToggleNavigation, DropdownMenu };
