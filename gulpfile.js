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
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// load all plugins in 'devDependencies' into the variable $
// pattern: include '*' for non gulp files
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '*'],
  replaceString: /\bgulp[-.]/,
  rename: {
    'gulp-strip-debug': 'stripdebug',
    'gulp-nunjucks-render': 'nunjucksRender',
    'run-sequence': 'runSequence',
    'vinyl-source-stream': 'source',
    'vinyl-buffer': 'buffer',
    'event-stream': 'es',
    gulplog: 'log',
    'lodash.assign': 'assign'
  },
  scope: ['devDependencies']
});

// is this a development build?
var devBuild = process.env.NODE_ENV !== 'production';

var isWin = process.platform === 'win32';

// folders
var folder = {
  src: 'src/',
  build: ''
};

var sass = {
  style: 'nested',
  comments: false
};

var isWatching = true;

var onError = function(err) {
  // $.gutil.beep();
  console.log(err);
};

/* ===================== START ===================== */

/**
 * @desc browserSync, start the server
 */ gulp.task('browserSync', function() {
  // check for operating system
  // - for WINDOWS 10 use "Chrome"
  // - for MAC OS X use 'Google Chrome'
  var browser = isWin ? 'Chrome' : 'Google Chrome';
  browserSync.init({
    server: {
      baseDir: './build'
    },
    browser: browser,
    directory: false
  });
});

/**
 * @desc nunjucks task
 */
gulp.task('nunjucks', function() {
  console.log('watching nunjucks');
  // Gets .html and .nunjucks files in pages
  return (
    gulp
      .src('src/pages/**/*.+(html|njk)')
      .pipe(
        $.plumber({
          errorHandler: onError
        })
      )
      // Renders template with nunjucks
      .pipe(
        $.nunjucksRender({
          path: ['src/templates/']
        })
      )
      // output files in app folder
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream())
  );
});

/**
 * @desc css task - compile sass to css, compress and add prefixes
 */
gulp.task('css', function() {
  var postCssOpts = [$.autoprefixer({ browsers: ['last 2 versions', '> 2%'] })];

  if (!devBuild) {
    console.log('css build ', devBuild);
    sass.style = 'compressed';
    sass.comments = false;
  }

  return gulp
    .src(`${folder.src}/stylesheets/*.scss`)
    .pipe(
      $.plumber({
        errorHandler: onError
      })
    )
    .pipe($.if(devBuild, $.sourcemaps.init()))
    .pipe(
      $.sass({
        outputStyle: sass.style,
        sourceComments: false,
        imagePath: 'images/',
        errLogToConsole: true
      }).on('error', $.util.log)
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
    .pipe(gulp.dest('build/css'))
    .pipe($.size())
    .pipe(browserSync.stream());
});

/**
 * @desc bundles js into multiple files and watches for changes
 */
gulp.task('js', function() {
  let files = ['./src/scripts/index.js', './src/scripts/application.js'];

  // start fresh
  $.del.sync(['/build/js/application.bundle.js', 'index.bundle.js']);

  var tasks = files.map(function(entry) {
    var bundler = $.browserify({
      entries: [entry], // Entry point
      debug: true // Output source maps
    }).transform($.babelify, {
      presets: ['env']
    });

    var bundle = function() {
      return (
        bundler
          .bundle() // Start bundle
          .on('error', function(err) {
            // print the error (can replace with gulp-util)
            console.log(err.message);
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
          .pipe(gulp.dest('build/js')) // Output path
          .pipe(
            reload({
              stream: true,
              once: true
            })
          )
      );
    };

    if (isWatching) {
      bundler = $.watchify(bundler);
      bundler.on('update', bundle);
    }

    return bundle();
  });

  //create a merged stream
  return $.es.merge.apply(null, tasks);
});

/**
 * @desc bootlint task -  A gulp wrapper for Bootlint, the HTML linter for Bootstrap projects
 */
gulp.task('bootlint', function() {
  return gulp.src('./build/*.html').pipe($.bootlint());
});

/**
 * @desc build - run all tasks
 */
gulp.task('build', function(callback) {
  isWatching = false;
  $.runSequence(['nunjucks', 'css', 'js'], callback);
});

/**
 * @desc watch - watch for changes
 */
gulp.task('watch', ['js'], function() {
  // html changes
  gulp.watch('*.html', browserSync.stream());
  // nunjuck changes
  gulp.watch(folder.src + '+(pages|templates)/**/*.njk', ['nunjucks']);
  // css changes
  gulp.watch(folder.src + 'stylesheets/sass/**/*', ['css']);
});

/**
 * @desc default task
 */
gulp.task('default', function(callback) {
  $.runSequence(['nunjucks', 'css', 'browserSync', 'watch'], callback);
});
