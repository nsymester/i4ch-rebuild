/**
 * @desc this task runner will concatenate and minifiy the application scripts and styles
 * @author Neil Symester neil.symester@towergate.co.uk
 */

// set environment variable
// Powershell => $env:NODE_ENV='production'
// bash => NODE_ENV=production
// MSDOS => SET NODE_ENV=production

// process.argv[0] = node.exe
// process.argv[1] = gulp.js

// Gulp.js configuration
const { series, parallel, src, dest, task, watch } = require('gulp');
const fs = require('fs');
// const path = require('path');
const _browserSync = require('browser-sync').create();
// const reload = browserSync.reload;

// load all plugins in 'devDependencies' into the variable $
// pattern: include '*' for non gulp files
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '*'],
  replaceString: /\bgulp[-.]/,
  rename: {
    'gulp-strip-debug': 'stripdebug',
    'gulp-nunjucks': 'gulpnunjucks',
    'nunjucks-markdown': 'markdown',
    'fancy-log': 'log',
    'lodash.assign': 'assign',
    'vinyl-source-stream': 'source',
    'event-stream': 'es'
  },
  scope: ['devDependencies']
});
const pkg = require('./package.json');

// is this a development build?
const devBuild = process.env.NODE_ENV !== 'production';
const isWin = process.platform === 'win32';

// folders
var folder = {
  src: 'src/',
  build: ''
};

var sassOptions = {
  style: 'nested',
  comments: false
};

var isWatching = true;

var onError = function(err) {
  $.log.error(err);
};

// fetch command line arguments
// const arg = (argList => {
//   let arg = {},
//     a,
//     opt,
//     thisOpt,
//     curOpt;
//   for (a = 0; a < argList.length; a++) {
//     thisOpt = argList[a].trim();
//     opt = thisOpt.replace(/^\-+/, '');

//     if (opt === thisOpt) {
//       // argument value
//       if (curOpt) arg[curOpt] = opt;
//       curOpt = null;
//     } else {
//       // argument name
//       curOpt = opt;
//       arg[curOpt] = null;
//     }
//   }

//   return arg;
// })(process.argv);

// =======================================================================
// ENV Vars
// =======================================================================
var dist = 'dist'; //Set this as your target you be compiling into
var source = 'src'; //Set this as the location of your source files
var templates = source + '/templates'; //Set this as the folder that contains your nunjuck files

// Create an new nunjuck envroment. This seemed to be the problem for me. Didn't work for me until I specified the FileSystemLoader.
// The templates folder tells the nunjuck renderer where to find any *.njk files you source in your *.html files.
// let fileList = [];

// =======================================================================
// Index Task (Generate pages from template *.html files.)
// =======================================================================
function pages(cb) {
  // Gets .html files. see file layout at bottom
  var env = new $.nunjucks.Environment(
    new $.nunjucks.FileSystemLoader(templates)
  );
  // all fo the follwing is optional and this will all work just find if you don't include any of it. included it here just in case you need to configure it.
  $.marked.setOptions({
    renderer: new $.marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

  // This takes the freshley created nunjucks envroment object (env) and passes it to nunjucks-markdown to have the custom tag regestered to the env object.
  // The second is the marked library. anything that can be called to render markdown can be passed here.
  $.markdown.register(env, $.marked);

  //  let data = JSON.parse({ files: getData('markup') });
  let data = { files: getData('markup') };
  let cData = { cFiles: getData('markup-c') };

  // get styles data
  src([templates + '/*.html'])
    // Renders template with nunjucks and marked
    .pipe($.data(data))
    .pipe($.gulpnunjucks.compile('', { env: env }))
    // Uncomment the following if your source pages are something other than *.html.
    // .pipe(rename(function (path) { path.extname=".html" }))
    // output files in dist folder
    .pipe(dest(dist));

  // get components data
  src([templates + '/*.html'])
    // Renders template with nunjucks and marked
    .pipe($.data(cData))
    .pipe($.gulpnunjucks.compile('', { env: env }))
    .pipe(dest(dist));

  cb();
}
exports.pages = pages;

/**
 * @desc browserSync, start the server
 */
function browserSync() {
  // check for operating system
  // - for WINDOWS 10 use "Chrome"
  // - for MAC OS X use 'Google Chrome'
  var browser = isWin ? 'Chrome' : 'Google Chrome';
  _browserSync.init({
    // injectChanges: true,
    server: {
      baseDir: './dist'
    },
    port: 5000,
    browser: browser,
    directory: false
  });
}
exports.browserSync = browserSync;

/**
 * @desc reload the browser
 * @param {func} cb  - error-first callback to signal completion.
 */
function reload(cb) {
  _browserSync.reload();
  cb();
}
exports.reload = reload;

/**
 * @desc css task - compile sass to css, compress and add prefixes
 * @param {func} cb  - error-first callback to signal completion.
 */
function css(cb) {
  var postCssOpts = [$.autoprefixer()];

  if (!devBuild) {
    $.log.info('css build ', devBuild);
    sassOptions.style = 'compressed';
    sassOptions.comments = false;
  }

  src(`${folder.src}/stylesheets/**/*.scss`)
    .pipe(
      $.plumber({
        errorHandler: onError
      })
    )
    .pipe($.if(devBuild, $.sourcemaps.init()))
    .pipe(
      $.sass({
        outputStyle: sassOptions.style,
        sourceComments: false,
        imagePath: 'images/',
        errLogToConsole: true
      }).on('error', $.log)
    )
    .pipe($.postcss(postCssOpts))
    .pipe(
      $.if(
        devBuild,
        $.sourcemaps.write('maps', {
          includeContent: false
        })
      )
    )
    .pipe(dest(pkg.paths.stylesheets.dist))
    .pipe($.size());
  cb();
}
//exports.css = css;

/**
 * @desc bundles js into multiple files and watches for changes
 * @param {func} cb  - error-first callback to signal completion.
 */
function js(cb) {
  let files = ['./src/scripts/index.js', './src/scripts/product.js'];

  // start fresh
  $.del.sync([
    './dist/scripts/product.bundle.js',
    './dist/scripts/index.bundle.js'
  ]);

  var tasks = files.map(function(entry) {
    var bundler = $.browserify({
      entries: [entry], // Entry point
      debug: true // Output source maps
    }).transform($.babelify, {
      presets: ['@babel/preset-env']
    });

    const bundle = function() {
      return (
        bundler
          .bundle() // Start bundle
          .on('error', function(err) {
            // print the error (can replace with gulp-util)
            $.log.error(err.message);
            // end this stream
            this.emit('end');
          })
          .pipe($.source(entry))
          // rename them to have "bundle as postfix"
          .pipe(
            $.rename({
              dirname: '', // don't include full path
              extname: '.bundle.js' // Output file
            })
          )
          .pipe(dest('dist/scripts')) // Output path
      );
    };

    if (isWatching) {
      bundler = $.watchify(bundler);
      bundler.on('update', bundle);
    }

    return bundle();
  });

  //create a merged stream
  $.es.merge(tasks).on('end', cb);
}
exports.js = js;

/**
 * @desc bootlint task -  A gulp wrapper for Bootlint, the HTML linter for Bootstrap projects
 * @param {func} cb  - error-first callback to signal completion.
 */
exports.bootlint = function(cb) {
  src('./build/*.html').pipe($.bootlint());
  cb;
};

/**
 * @desc set watching JavaScript to false
 * @param {func} cb  - error-first callback to signal completion.
 */
function watchingJS(cb){
  isWatching = true;
  cb()
}

/**
 * @desc set watching JavaScript to false
 * @param {func} cb  - error-first callback to signal completion.
 */
function notWatchingJS(cb){
  isWatching = false;
  cb()
}


/**
 * @desc watch for changes, add browserSync.reload to the tasks array to make
 *       all browsers reload after tasks are complete.
 */
function watchTasks(cb) {

 // nunjuck changes
  watch(folder.src + '+(templates)/**/*.njk', series(pages, reload));
  watch(folder.src + '+(templates)/**/*.md', series(pages, reload));
  watch(folder.src + '+(templates)/**/*.html', series(pages, reload));

  // css changes
  watch(folder.src + 'stylesheets/**/*.scss', series(css, reload));

  // js changes
  watch(folder.src + 'scripts/**/*.js', series(js, reload));

  cb();
}

/**
 * @desc create a list of files and directories
 * @param {string} folderPath - path to the folder
 * @param {array} fileList - list of files
 * @return {object} - a json file with list of folders and directories
 */
function getData(folderPath, fileList) {
  let files = fs.readdirSync(`src/templates/${folderPath}`);

  fileList = fileList || [];

  files.forEach(file => {
    let tPath = `${folderPath}/${file}`;
    if (fs.statSync(`src/templates/${tPath}`).isDirectory()) {
      let obj = {
        name: `${file}`,
        type: 'd'
      };
      fileList.push(obj);
      fileList = getData(tPath + '/', fileList);
    } else {
      let obj = {
        name: `${file}`,
        type: 'f'
      };
      fileList.push(obj);
    }
  });

  return fileList;
}

/**
 This gist assumes a file layout similar to:


 Project-Root/
            src/
                templates/
                    index.html
                    about.html
                    otherpage.html
                    nav.njk
                    header.njk
                    footer.njk
                    basehtml.njk
                    subfolder/
                        index.html
            gulpfile.js


 The *.html files will compile into .html files in your dist folder.
 The .njk files define source and block components for the html files.
 The Markdown tag can be included in any of these files.
 {% markdown %}
 # Hello Markdown
 {% endmarkdown %}
**/

// build for production
exports.build = series(css, notWatchingJS, js);

 // process pages, css and js; then watch files; then launch Browsersync
exports.default = series(pages, css, watchingJS, js, watchTasks, browserSync);