// module CoverOptions.js

// what does this feature need to do

/**
 * 1. cache DOM elements
 * 2. bind events
 * 3. initialise ui
 * 4. wait for user input
 * 5. update the DOM
 */

'use strict';

const $ = require('jquery');

// placeholder for chached DOM elements
let DOM = {};

// initialised values
let inputValue = '';
let priceLimit;
let d_initialCoverPrice;
let d_initialSingleTripPrice;

/* ===================== private methods ========================= */

// cache DOM elements
function cacheDOM() {
  DOM.$costPrefixText = $('.js-cost-prefix').first();
  DOM.$warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
  DOM.$warningText60 = $('.card-cover-option:nth-of-type(1) .warning-text-60');
  DOM.$coverOptionPrice = $('.card-cover-option:nth-of-type(1) .card-price');
  // Get single trip price
  DOM.$initialCoverPrice = $('.card-cover-option:nth-of-type(1) .amount');
  DOM.$initialSingleTripPrice = $('.initial-single-trip-price');
  DOM.$productOptionsDayCover = $('.product-options-days-cover');
}

// bind events
function bindEvents() {
  DOM.$productOptionsDayCover.change(handleDayCoverChange);
}

// get items when user first lands on the screen
function init() {
  d_initialCoverPrice = parseFloat(
    DOM.$initialCoverPrice.text().replace(/\D*/, '')
  ).toFixed(2);

  d_initialSingleTripPrice = parseFloat(
    DOM.$initialSingleTripPrice.text().replace(/\D*/, '')
  ).toFixed(2);
}

// events handlers
function handleDayCoverChange(evt) {
  let totalInitialPrice = 0;
  let totalSinglePrice = 0;

  // $ OR €
  const currencySymbol = DOM.$initialCoverPrice.text().substring(0, 1);

  if (currencySymbol === '\u00A3') {
    priceLimit = 119;
  } else {
    priceLimit = 142;
  }

  // get value
  let inputValue = parseInt(evt.currentTarget.value);

  if (inputValue >= 0 && Number.isInteger(inputValue)) {
    // calculate with intital cover price
    // d_initialCoverPrice = 11.99
    if (inputValue >= 0 && inputValue <= 3) {
      totalInitialPrice = d_initialCoverPrice;
      totalSinglePrice = totalInitialPrice;
    }

    // if ((inputValue > 3 && inputValue <= 60) || priceLimit < finalPrice) {
    if (inputValue > 3) {
      totalInitialPrice = d_initialCoverPrice;
      // double up on the string values to use a unary plus to convert and have it added to the previous value
      totalSinglePrice =
        +totalInitialPrice + (+inputValue - 3) * +d_initialSingleTripPrice;
    }
  }

  render(inputValue, currencySymbol, totalSinglePrice);
}

// render DOM
function render(inputValue, currencySymbol, totalSinglePrice) {
  let finalPrice = parseFloat(totalSinglePrice).toFixed(2);

  if (inputValue === 0) {
    DOM.$costPrefixText.show();
  } else {
    DOM.$costPrefixText.hide();
  }

  if (inputValue > 60) {
    DOM.$initialCoverPrice.text(currencySymbol + finalPrice);
    DOM.$coverOptionPrice.addClass('warning');
    DOM.$warningText60.show();
    DOM.$warningText.hide();
    DOM.$coverOptionPrice.hide();
  } else if (inputValue > 11 && inputValue <= 60) {
    DOM.$initialCoverPrice.text(currencySymbol + finalPrice);
    // change color of price
    DOM.$coverOptionPrice.addClass('warning');
    // show warning text
    DOM.$warningText.show();
    DOM.$warningText60.hide();
    DOM.$coverOptionPrice.show();
  } else if (inputValue > 3 && inputValue <= 60) {
    DOM.$initialCoverPrice.text(currencySymbol + finalPrice);
    DOM.$warningText.hide();
    DOM.$warningText60.hide();
    DOM.$coverOptionPrice.removeClass('warning');
    DOM.$coverOptionPrice.show();
  } else if (inputValue <= 3) {
    DOM.$initialCoverPrice.text(currencySymbol + finalPrice);
    DOM.$warningText.hide();
    DOM.$warningText60.hide();
    DOM.$coverOptionPrice.removeClass('warning');
    DOM.$coverOptionPrice.show();
  } else {
    DOM.$initialCoverPrice.text(currencySymbol + totalSinglePrice);
    DOM.$warningText60.hide();
    DOM.$warningText.hide();
    DOM.$coverOptionPrice.show();
  }
}

/* ===================== public methods ========================= */

// main init method
function CoverOptions() {
  cacheDOM();
  init();
  bindEvents();
}

/* ================== export public methods ===================== */

export { CoverOptions };
