import { events } from './PubSub';
import { Sticky } from './Screen';

Array.prototype.forEach = function(callback, thisArg) {
  thisArg = thisArg || window;
  for (var i = 0; i < this.length; i++) {
    callback.call(thisArg, this[i], i, this);
  }
};

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

Sticky();

// module "PolicySummary.js"
// module "PolicySummaryAccordion.js"

function DesktopDeviceSetup() {
  $('.policy-summary .info-box').each(function(index, element) {
    if (index === 0) {
      return true;
    }
    $(element).css('display', 'none');
  });

  // remove the active class from all
  $('.card-cover-option').each(function(index, element) {
    $(element).removeClass('active');
  });
  $('.card-cover-option:nth-child(2)').addClass('active');

  // show policy info
  $('.card-cover-option .policy-info').each(function(index, element) {
    $(element).css('display', 'block');
  });

  // reset policy summary
  $('.policy-summary-info').each(function(index, element) {
    $(element).css('display', 'none');
  });
  $('.policy-summary-info:first-child').css('display', 'block');

  // remove mobile event listener
  const acc = document.querySelectorAll(
    '.accordion-bar button.more-information'
  );
  for (let i = 0; i < acc.length; i++) {
    if (acc[i].eventListener) {
      acc[i].removeEventListener('click');
    }
  }

  PolicySummaryDesktop();
}

function MobileDeviceSetup() {
  $('.card-cover-option').each(function(index, element) {
    $(element)
      .removeClass('active')
      .css('display', 'block');
  });

  $('.card-cover-option .policy-info').each(function(index, element) {
    $(element).css('display', 'none');
  });

  // reset policy summary
  $('.policy-summary-info').each(function(index, element) {
    $(element).css('display', 'none');
  });

  // remove desktop event listener
  $('.card-cover-option').unbind();

  // setup Mobile
  PolicySummaryMobile();
}

// device reset ON browser width
function PolicySummaryDeviceResize() {
  // console.log(window.outerWidth);

  if (window.outerWidth > 1199) {
    /**
     * DEVICE: Desktop
     */
    DesktopDeviceSetup();
  } else {
    /**
     * DEVICE: Mobile
     */
    MobileDeviceSetup();
  }

  // Cache DOM

  window.addEventListener('resize', function(evt) {
    // console.log(evt.target.outerWidth);

    if (evt.target.outerWidth > 1199) {
      /**
       * DEVICE: Desktop
       */
      DesktopDeviceSetup();
    } else {
      /**
       * DEVICE: Mobile
       */
      MobileDeviceSetup();
    }
  });
}

/**
 * Policy Summary Handler for mobile
 *
 * @return  {none}
 */
function PolicySummaryMobile() {
  // cache DOM
  const acc = document.querySelectorAll(
    '.accordion-bar button.more-information'
  );
  let cardCoverOption = document.querySelectorAll('.card-cover-option');
  let policySummaryInfo = document.querySelectorAll('.policy-summary-info');
  let policyReference = '';

  let activeCardOption = '';

  // Bind Events
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordionHandler);
  }

  // Event Handlers
  function accordionHandler(evt) {
    // console.log(evt.currentTarget);
    /* hide the other options */
    evt.currentTarget.classList.remove('active');

    // more information button has been clicked
    if (activeCardOption === 'selected') {
      // console.log('Close');

      evt.currentTarget.innerText = 'More information';

      // remove active border
      for (let i = 0; i < cardCoverOption.length; i++) {
        cardCoverOption[i].classList.remove('active');
        cardCoverOption[i].style.display = 'block';
      }

      // hide policy-info
      document
        .querySelectorAll(
          '.card-cover-option[data-policy^="policy-summary-"] .policy-info'
        )
        .forEach(function(element) {
          element.style.display = 'none';
        });

      // hide all policy-summary-info blocks
      policySummaryInfo.forEach(function(element) {
        // console.log(element);
        element.style.display = 'none';
      });

      activeCardOption = '';

      if( window.removeEventListener ) {
        window.removeEventListener('scroll', function(evt) {
          console.log({evt});
          evt.currentTarget.classList.remove("sticky");
        });
      }
    } else {
      // console.log('Open');

      evt.currentTarget.innerText = 'View other options';

      // move more information arrow
      evt.currentTarget.classList.add('active');

      /* highlight the card that's been selected */
      evt.currentTarget.parentNode.parentNode.parentNode.parentNode.classList.add(
        'active'
      );

      // get policy reference
      policyReference = document.querySelector('.card-cover-option.active')
        .dataset.policy;

      // show only the product summary info that has an active product cover option
      for (let i = 0; i < cardCoverOption.length; i++) {
        if (cardCoverOption[i].getAttribute('class').indexOf('active') < 0) {
          cardCoverOption[i].style.display = 'none';
        } else {
          cardCoverOption[i].style.display = 'block';
        }
      }

      // show the cover option info text
      document.querySelector(
        '.card-cover-option[data-policy="' + policyReference + '"] .policy-info'
      ).style.display = 'block';

      activeCardOption = 'selected';

      // hide all policy-summary-info blocks
      policySummaryInfo.forEach(function(element) {
        element.style.display = 'none';
      });

      // get the policy summary info panel associcated with this product using the policyReference
      let panel = document.querySelector(
        '.policy-summary-info.' + policyReference
      );
      panel.style.display = 'block';

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.style.marginTop = '0';
        panel.style.marginBottom = '0';
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.marginTop = '-11px';
        panel.style.marginBottom = '18px';
      }

      events.on('heightChanged', newHeight => {
        let newTotal =
          parseInt(
            panel.style.maxHeight.substring(0, panel.style.maxHeight.length - 2)
          ) +
          parseInt(newHeight.substring(0, newHeight.length - 2)) +
          'px';

        panel.style.maxHeight = newTotal;
      });
    }
  } // accordionHandler
} // PolicySummaryMobile

/**
 * Policy Summary handler for desktop
 *
 * @return  {none}
 */
function PolicySummaryDesktop() {
  // cache DOM
  // policy summary
  $('.card-cover-option').click(function(evt) {
    $('.card-cover-option').each(function(index, element) {
      $(element).removeClass('active');
    });
    evt.currentTarget.classList.add('active');
    // show policy summary
    $('.policy-summary .info-box').each(function(index, element) {
      $(element).css('display', 'none');
    });
    let policySummary = $(this).data('policy');
    $('.' + policySummary).css('display', 'block');
  });
} // PolicySummaryDesktop

export { PolicySummaryDeviceResize, PolicySummaryMobile, PolicySummaryDesktop };
