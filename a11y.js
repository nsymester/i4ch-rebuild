// An example of running Pa11y on multiple URLS
'use strict';

const pa11y = require('pa11y');

// fetch command line arguments
const arg = (argList => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = null;
    }
  }

  return arg;
})(process.argv);

const urls = arg.files.split(' ');

testUrls();

// Async function required for us to use await
async function testUrls() {
  try {
    // Put together some options to use in each test
    const options = {
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    };

    const modifiedUrls = urls.map(url => {
      return pa11y(url, options);
    });

    // Run tests against multiple URLs
    const results = await Promise.all(modifiedUrls);

    // Output the raw result objects
    results.map(result => {
      console.log(result);
    });
  } catch (error) {
    // Output an error if it occurred
    console.error(error.message);
  }
}
