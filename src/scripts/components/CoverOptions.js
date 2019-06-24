// module CoverOptions.js

function CoverOptions() {
  // cache DOM
  const costPrefixText = $('.js-cost-prefix');
  const warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
  const warningText60 = $('.card-cover-option:nth-of-type(1) .warning-text-60');
  const coverOptionPrice = $('.card-cover-option:nth-of-type(1) .card-price');
  // Get single trip price
  const initialCoverPrice = $('.card-cover-option:nth-of-type(1) .amount');
  const d_initialCoverPrice = parseFloat(
    initialCoverPrice.text().replace(/\D*/, '')
  ).toFixed(2);

  const initialSingleTripPrice = $('.initial-single-trip-price');
  const d_initialSingleTripPrice = parseFloat(
    initialSingleTripPrice.text().replace(/\D*/, '')
  ).toFixed(2);

  const currencySymbol = initialCoverPrice.text().substring(0, 1);
  let inputValue = '';
  let priceLimit;
  let totalInitialPrice = 0;
  let totalSinglePrice = 0;
  let finalPrice = 0;

  if (currencySymbol == '\u00A3') {
    priceLimit = 119;
  } else {
    priceLimit = 142;
  }

  //console.clear();
  //console.log(`cover price: ${d_initialCoverPrice}`);
  //console.log(`Single Trip price: ${d_initialSingleTripPrice}`);
  //console.log(`currencySymbol: ${currencySymbol}`);

  $('.product-options-days-cover').change(function(evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value);

    // hide "from" text
    if (inputValue > 3) {
      costPrefixText.hide();
    } else {
      costPrefixText.show();
    }

    if (inputValue > 0 && Number.isInteger(inputValue)) {
      // calculate with intital cover price
      // d_initialCoverPrice = 11.99
      if (inputValue > 0 && inputValue <= 3) {
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

    finalPrice = parseFloat(totalSinglePrice).toFixed(2);

    if (inputValue > 11 && inputValue <= 60) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      // change color of price
      coverOptionPrice.addClass('warning');
      // show warning text
      warningText.show();
      warningText60.hide();
      coverOptionPrice.show();
    } else if (inputValue > 3 && inputValue <= 60) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      warningText.hide();
      warningText60.hide();
      coverOptionPrice.removeClass('warning');
      coverOptionPrice.show();
    } else if (inputValue <= 3) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      warningText.hide();
      warningText60.hide();
      coverOptionPrice.removeClass('warning');
      coverOptionPrice.show();
    } else if (inputValue > 60) {
      initialCoverPrice.text(currencySymbol + finalPrice);
      coverOptionPrice.addClass('warning');
      warningText60.show();
      warningText.hide();
      coverOptionPrice.hide();
    } else {
      initialCoverPrice.text(currencySymbol + totalSinglePrice);
      warningText60.hide();
      warningText.hide();
      coverOptionPrice.show();
    }

    //console.log(`${inputValue} = ${finalPrice}`);
  });
}

export { CoverOptions };
