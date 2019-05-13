// module CoverOptions.js

function CoverOptions() {
  // cache DOM
  const warningText = $('.card-cover-option:nth-of-type(1) .warning-text');
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

  let inputValue = '';
  const priceLimit = 119;
  let totalInitialPrice = 0;
  let totalSinglePrice = 0;
  let finalPrice = 0;

  console.clear();
  console.log(`cover price ${d_initialCoverPrice}`);
  console.log(`cover price ${d_initialSingleTripPrice}`);

  $('.product-options-days-cover').change(function(evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value);

    if (inputValue > 0) {
      // calculate with intital cover price
      if (inputValue > 0 && inputValue <= 3) {
        totalInitialPrice = inputValue * d_initialCoverPrice;
        totalSinglePrice = 0;
      }

      if (
        (inputValue > 3 && finalPrice < priceLimit) ||
        priceLimit < finalPrice
      ) {
        totalSinglePrice = (inputValue - 3) * d_initialSingleTripPrice;
      }
    }
    finalPrice = parseFloat(totalInitialPrice + totalSinglePrice).toFixed(2);

    if (finalPrice > priceLimit) {
      initialCoverPrice.text(parseFloat(priceLimit).toFixed(2));
      // change color of price
      coverOptionPrice.addClass('warning');
      // show warning text
      warningText.show();
    } else {
      initialCoverPrice.text(finalPrice);
      warningText.hide();
      coverOptionPrice.removeClass('warning');
    }

    console.log(`${inputValue} = ${finalPrice}`);
  });
}

export { CoverOptions };
