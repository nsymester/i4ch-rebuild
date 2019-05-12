// module "ScrollTo.js"

function ScrollTo() {
  // cache DOM
  // Select all links with hashes
  // Remove links that don't actually link to anything
  let anchors = $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]');

  let heightCompensation = 60;
  // Bind Events
  anchors.click(anchorsHandler);

  // Event Handlers
  function anchorsHandler(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') ==
        this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      let target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate(
          {
            scrollTop: target.offset().top - heightCompensation
          },
          1000,
          function() {
            // Callback after animation
            // Must change focus!
            let $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
               return false;
            } else {
               $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
               $target.focus(); // Set focus again
            };
          }
        );
      }
    }
  }
}

export { ScrollTo };
