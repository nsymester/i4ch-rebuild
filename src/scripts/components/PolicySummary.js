function PolicySummary() {
  // policy summary
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

export { PolicySummary };
