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

  $('.tab-car .btn').click(function(evt) {
    evt.preventDefault();
    return false;
  });

  $('.tab-car .icon-radio input[type="radio"]').click(function(evt) {
    $('.tab-car .btn').removeClass('btn-cta--disabled');
    $('.tab-car .btn').addClass('btn-cta');
    $('.tab-car .btn').unbind();
  });

  let coverOptions = [];
  // get price
  if ($('.card-cover-option')) {
    $('.card-cover-option').each(function(index, element) {
      coverOptions.push({
        name: $('.inner .card-title ', element).text(),
        cost: $('.inner .card-price .amount', element).text()
      });
    });
  }

  $('.product-options-days-cover').change(function(evt) {
    let parentClass = $(this)
      .parent()
      .parent()
      .parent()
      .attr('class')
      .split(' ');

    let coverOptionPrice = coverOptions.filter(coverOption => {
      return (
        coverOption.name ==
        $('.' + parentClass[2] + ' .inner .card-title').text()
      );
    });

    $('.' + parentClass[2] + ' .inner .card-price .amount').text(
      parseFloat(coverOptionPrice[0].cost * evt.currentTarget.value) <= 0
        ? coverOptionPrice[0].cost
        : parseFloat(
            coverOptionPrice[0].cost * evt.currentTarget.value
          ).toFixed(2)
    );
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
