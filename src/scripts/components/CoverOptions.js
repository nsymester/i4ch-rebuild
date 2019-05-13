// module CoverOptions.js

function CoverOptions() {
  // cache DOM
  // Get single trip price
  const initialCoverPrice = parseFloat(
    $('.card-cover-option:nth-of-type(1) .amount').text()
  ).toFixed(2);
  let initialSingleTripPrice = parseFloat(
    $('.initial-single-trip-price')
      .text()
      .replace(/\D*/, '')
  ).toFixed(2);
  let inputValue = '';
  const priceLimit = 119;
  let totalInitialPrice = 0;
  let totalSinglePrice = 0;
  let finalPrice = 0;

  console.clear();
  console.log(`cover price ${initialCoverPrice}`);
  console.log(`cover price ${initialSingleTripPrice}`);

  $('.product-options-days-cover').change(function(evt) {
    // get value
    inputValue = parseInt(evt.currentTarget.value);

    if (inputValue > 0) {
      for (let i = 0; i <= inputValue; i = i + 1) {
        // calculate with intital cover price
        if (i > 0 && i <= 3) {
          totalInitialPrice = i * initialCoverPrice;
          totalSinglePrice = 0;
        }

        if (i > 3 && finalPrice < priceLimit) {
          totalSinglePrice = (i - 3) * initialSingleTripPrice;
        }
      }
    }
    finalPrice = totalInitialPrice + totalSinglePrice;

    console.log(`${inputValue} = ${finalPrice}`);
  });

  console.log(initialCoverPrice);
}

export { CoverOptions };
