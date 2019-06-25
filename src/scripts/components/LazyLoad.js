// module LazyLoad.js

function LazyLoad() {
  var allimages = document.querySelectorAll('.js-lazy-load');
  for (var i = 0; i < allimages.length; i++) {
    if (allimages[i].getAttribute('data-src')) {
      allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
    }
  }
}

export { LazyLoad };
