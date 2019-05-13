// module "LoadFAQs.js"

function LoadFAQs() {
  // load faqs
  $('#faqTabs a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
  });

  // load faqs
  // only load if on faqs page
  if ($('#faqs').length > 0) {
    $.ajax({
      type: 'GET',
      url: '/api/faqs.json',
      success: function(faqs) {
        // get the heads
        $.each(faqs, function(index, faq) {
          // add title for desktop
          $(`a[href='#${faq.id}']`)
            .find('span')
            .text(faq.title);

          // add title for mobile
          $(`#${faq.id}`)
            .find('h3')
            .text(faq.shortTitle);

          // get the body
          $.each(faq.qas, function(fIndex, qa) {
            $('.inner .accordion', `#${faq.id}`).append(
              `<button class="accordion-btn h4">${qa.question}</button>
               <div class="accordion-panel">
                 <div class="inner">
                 ${qa.answer}
                 </div>
               </div>
              `
            );
          });
        });
      },
      error: function(xhr, status, error) {
        console.log('error: ', error);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate(
      '.accordion-btn',
      'click',
      function(evt) {
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
      }
    );
  }

  // only load if on product faqs page
  if ($('.product-faqs').length > 0) {
    let file = $('.product-faqs')
      .data('faqs')
      .replace('&-', '');

    console.log(`/api/${file}-faqs.json`);

    $.ajax({
      type: 'GET',
      url: `/api/${file}-faqs.json`,
      success: function(faqs) {
        // get the body
        $.each(faqs, function(fIndex, faq) {
          console.log(`#${faq.id}`);
          $('.inner .accordion').append(
            `<button class="accordion-btn h4">${faq.question}</button>
              <div class="accordion-panel">
                <div class="inner">
                ${faq.answer}
                </div>
              </div>
            `
          );
        });

        // show content
        $('.faq-answers-product').show();
      },
      error: function(xhr, status, error) {
        console.log('error: ', error);
      }
    }); // $ajax

    $('.faq-answers .inner .accordion').delegate(
      '.accordion-btn',
      'click',
      function(evt) {
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
      }
    );
  }
}

export { LoadFAQs };
