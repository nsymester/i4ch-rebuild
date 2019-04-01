function CountrySelector() {
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

export { CountrySelector };
