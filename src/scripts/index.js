import { Goodbye, World } from './components/GoodbyeWorld';
import { ScrollToTop, WindowWidth } from './components/Screen';
import { Accordion } from './components/Accordion';
import { CountrySelector } from './components/CountrySelector';
import { VehicleSelector } from './components/VehicleSelector';
import { ToggleNavigation, DropdownMenu } from './components/Navigation';
import { ScrollTo } from './components/ScrollTo';

console.log(`${Goodbye()} ${World} Index file`);

function start() {
  CountrySelector();
  VehicleSelector();
  ToggleNavigation();
  DropdownMenu();
  ScrollToTop();
  Accordion();
  WindowWidth();
  ScrollTo();

  //Docs
  $('.revealdocs').click(function(e) {
    e.preventDefault();
    let on = $('.docs').is(':visible');
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

  let coverOptionCount = 0;
  let currentPrice = 0;

  $('.product-options-days-cover').change(function (evt) {
    coverOptionCount++;

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

    if (coverOptionPrice.length > 0) {

      $("." + parentClass[2] + " .inner .card-price .amount").text(
        parseFloat(coverOptionPrice[0].cost * evt.currentTarget.value) <= 0
          ? coverOptionPrice[0].cost
          : parseFloat(
            coverOptionPrice[0].cost * evt.currentTarget.value
          ).toFixed(2)
      );
    } else {
      // reset number to 1
      $('.product-options-days-cover').val('1');
    }
  });

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
  if ($(".product-faqs").length > 0) {

    let file = $(".product-faqs").data("faqs").replace("&-","");

    console.log(`/api/${file}-faqs.json`);

    $.ajax({
      type: "GET",
      url: `/api/${file}-faqs.json`,
      success: function (faqs) {
        // get the body
        $.each(faqs, function (fIndex, faq) {
          console.log(`#${faq.id}`);
          $(".inner .accordion").append(
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
      error: function (xhr, status, error) {
        console.log("error: ", error);
      }
    }); // $ajax

    $(".faq-answers .inner .accordion").delegate(
      ".accordion-btn",
      "click",
      function (evt) {
        /* Toggle between adding and removing the "active" class,
          to highlight the button that controls the panel */
        evt.currentTarget.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        let panel = evt.currentTarget.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
          panel.style.marginTop = "0";
          panel.style.marginBottom = "0";
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.style.marginTop = "-11px";
          panel.style.marginBottom = "18px";
        }
      }
    );
  }

  // on scroll
  if ($(".article-main").length > 0) {
    let target = $(".article-main").offset().top - 180;
    $(document).scroll(function() {
      if ($(window).scrollTop() >= target) {
        $(".share-buttons").show();
      } else {
        $(".share-buttons").hide();
      }
    });
  }

  // When the user scrolls the page, execute myFunction
  window.onscroll = function() {
    myFunction();
  };

  // Get the header
  let navBar = document.querySelector(".navbar");

  // Get the offset position of the navbar
  let sticky = navBar.offsetTop;

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
    let sticky = navBar.offsetTop;
    if (window.pageYOffset > sticky) {
      navBar.classList.add("navbar-fixed-top");
    } else {
      navBar.classList.remove("navbar-fixed-top");
    }
  }
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
