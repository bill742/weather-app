var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  concatCss = require('gulp-concat-css'),
  minify = require('gulp-minify-css'),
  merge = require('merge-stream');

var sassSources,
  cssSources,
  jsSources;

sassSources = ['assets/sass/*.sass'];
cssSources = ['assets/css/*.css'];
jsSources = ['assets/js/*.js'];

gulp.task('css', function(){
  // Prefix and concat SASS files
  var sassStream = gulp.src(sassSources)
    .pipe(sass())
    .pipe(concat('sass-files.sass'));

  // Concat and minify all .css files
  var cssStream = gulp.src(cssSources)
    .pipe(concat('css-files.css'));

  var mergedStream = merge(sassStream, cssStream)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(minify())
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
  return mergedStream;
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('html', function(){
  gulp.src('*.html')
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync', 'js', 'css'], function(){
  gulp.watch(sassSources, ['css']);
  gulp.watch(cssSources, ['css']);
  gulp.watch('*.html', ['html']);
  gulp.watch(jsSources, ['js']);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
  });
});

gulp.task('default', ['css', 'js', 'html', 'watch']);
