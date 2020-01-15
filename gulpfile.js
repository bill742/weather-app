const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const merge = require('merge-stream');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

const sassSources = ['assets/sass/*.sass'];
const cssSources = ['assets/css/*.css'];
const jsSources = ['assets/js/*.js'];

function css() {
  var sassStream = gulp.src(sassSources)
    .pipe(sass())
    .pipe(concat('sass-files.sass'));

  // Concat and minify all .css files
  var cssStream = gulp.src(cssSources)
    .pipe(concat('css-files.css'));

  var mergedStream = merge(sassStream, cssStream)
    .pipe(autoprefixer({
      // browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./css'));
  return mergedStream;
}
exports.css = css;

function js() {
  return gulp.src(jsSources)
    .pipe(babel(
      {presets: ['@babel/env']}
    ))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(
      gulp.dest('./js'))
}
exports.js = js;

// gulp.task('watch', () =>
//   gulp.watch(sassSources, ['css'])
//   gulp.watch(cssSources, ['css'])
//   gulp.watch('*.html', ['html'])
//   gulp.watch(jsSources, ['js'])
// );

exports.default = gulp.series(
  exports.css,
  exports.js,
);
