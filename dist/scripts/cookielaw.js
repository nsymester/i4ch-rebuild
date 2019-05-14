checkCookie();

function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}

function setCookie() {
  var exdays = 365;
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  document.cookie =
    "tgckelw=" +
    escape("allow") +
    ";expires=" +
    exdate.toGMTString() +
    ";path=/;";
  removeElement();
}

function checkCookie() {
  var gtcke = null;
  gtcke = getCookie("tgckelw");
  if (gtcke == null) {
    var fragment = create(
      '<div id="ckelw" style="padding:1em;background:#efefef"><p style="text-align:center;margin:0 auto">We use cookies to improve your experience when using our website. Some cookies have already been set. To find out more about the cookies we use, view our <a href="http://towergate.biz/cookie-policy.aspx" target="_blank" title="Cookie and Privacy policy (opens new window)">cookie policy</a> <button class="privacy-thank-you" style="border-radius: 4px; border: 0;font-size: 1em;cursor: pointer;">ACCEPT</button></p></div>'
    );
    document.body.insertBefore(fragment, document.body.childNodes[0]);
    // window.setTimeout(function(){setCookie();},15000);
    document
      .querySelector(".privacy-thank-you")
      .addEventListener("click", function(evt) {
        evt.preventDefault();
        setCookie();
      });
  } else {
  }
}

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement("div");
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

function removeElement() {
  var d = document.body;
  var olddiv = document.getElementById("ckelw");
  document.body.removeChild(olddiv);
}
