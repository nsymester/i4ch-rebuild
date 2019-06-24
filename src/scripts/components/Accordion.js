import { events } from './PubSub';

// module "Accordion.js"

function Accordion() {
  // cache DOM
  let acc = document.querySelectorAll('.accordion-btn');

  // Bind Events
  let i;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordionHandler);
  }

  // Event Handlers
  function accordionHandler(evt) {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    evt.currentTarget.classList.toggle('active');

    /* Toggle between hiding and showing the active panel */
    let panel = evt.currentTarget.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.style.marginTop = '0';
      panel.style.marginBottom = '0';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.style.marginTop = '-11px';
      panel.style.marginBottom = '18px';
    }

    // tell the parent accordion to adjust its height
    events.emit('heightChanged', panel.style.maxHeight);
  }
}
export { Accordion };
