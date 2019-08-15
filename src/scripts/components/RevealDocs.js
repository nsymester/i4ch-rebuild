// module RevealDocs.js

function RevealDocs() {
  //Docs

  const $revealDocs = $('.revealdocs');
  const startText = $revealDocs.text();
  let endText = 'Hide policy documentation';
  try {
    if (policyDownloadButtonAlt !== null) {
      endText = policyDownloadButtonAlt;
    }
  } catch {
    // do nothing
  }
  $revealDocs.click(function(e) {
    e.preventDefault();
    let on = $('.docs').is(':visible');
    $(this).html(on ? startText : endText);
    $('.docs').slideToggle();
  });
}

export { RevealDocs };
