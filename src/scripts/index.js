import { Goodbye, World } from './components/GoodbyeWorld';
import { ScrollToTop, WindowWidth } from './components/Screen';
import { Accordion } from './components/Accordion';
import { CountrySelector } from './components/CountrySelector';
import { VehicleSelector } from './components/VehicleSelector';
import { ToggleNavigation, DropdownMenu } from './components/Navigation';

console.log(`${Goodbye()} ${World} Index file`);

function start() {
  CountrySelector();
  VehicleSelector();
  ToggleNavigation();
  DropdownMenu();
  ScrollToTop();
  Accordion();
  WindowWidth();

  //Docs
  $('.revealdocs').click(function(e) {
    e.preventDefault();
    var on = $('.docs').is(':visible');
    $(this).html(
      on ? 'View policy documentation' : 'Hide policy documentation'
    );
    $('.docs').slideToggle();
  });

  $('.policy-summary .info-box').each(function(index, element) {
    if (index === 0) {
      return true;
    }
    $(element).css('display', 'none');
  });

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
