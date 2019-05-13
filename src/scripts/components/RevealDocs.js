// module RevealDocs.js

function RevealDocs() {
  //Docs
  $('.revealdocs').click(function(e) {
    e.preventDefault();
    let on = $('.docs').is(':visible');
    $(this).html(
      on ? 'View policy documentation' : 'Hide policy documentation'
    );
    $('.docs').slideToggle();
  });
}

export { RevealDocs };
