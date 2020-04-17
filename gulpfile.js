const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

function cssBuild() {
    return gulp
      .src('./public/docsuikit/assets/css/*.css')
      .pipe(postcss([cssnano()]))
      .pipe(gulp.dest('./public/docsuikit/assets/css/'));
}

function javascriptBuild() {
  return (
      browserify({
        entries: [[
          './public/docsuikit/assets/js/main.js',
          './public/docsuikit/assets/js/custom-scrollbar.js'
        ]],
        transform: [babelify.configure({ presets: ['@babel/preset-env'] })]
      })
      .bundle()
      .pipe(source('bundle.js'))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest('./public/docsuikit/assets/js/'))
  );
}

function javascriptBuildWidgets() {
  return (
      browserify({
        entries: [[
          './public/docsuikit/assets/vendor/jquery-ui/ui/widgets/autocomplete.js',
          './public/docsuikit/assets/vendor/jquery-ui/ui/widgets/menu.js',
          './public/docsuikit/assets/vendor/jquery-ui/ui/widgets/mouse.js',
        ]],
        transform: [babelify.configure({ presets: ['@babel/preset-env'] })]
      })
      .bundle()
      .pipe(source('bundle.widgets.js'))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest('./public/docsuikit/assets/js/'))
  );
}

function javascriptMinifyAsciiplayer() {
  return gulp
    .src('./public/scripts/asciinema-player.js')
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'))
}


exports.dist = gulp.parallel(cssBuild, javascriptBuild, javascriptBuildWidgets, javascriptMinifyAsciiplayer);
