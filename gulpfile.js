var gulp = require('gulp'),
    gutil = require('gulp-util')
    concat = require('gulp-concat'),
    fileInclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    ngAnnotate = require('gulp-ng-annotate'),
    prefix = require('gulp-autoprefixer'),
    react = require('gulp-react'),
    shell = require('gulp-shell'),
    sourcemaps = require('gulp-sourcemaps'),
    to5 = require('gulp-6to5'),
    webserver = require('gulp-webserver');

function onError(err) {
  gutil.beep();
  gutil.log(err);
};

gulp.task('server', function(){
  gulp.src('')
  .pipe(webserver())
  // gulp.src('')
  // .pipe(shell([
  //   'ws'
  // ]))
});


gulp.task('html', function(){
  gulp.src(['views/*.html'])
  .pipe(fileInclude({
    prefix: '@@',
    basepath: './'
  }))
  .pipe(gulp.dest(''))
});



gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(['views/*.html','partials/*.html', 'css/app.css', '*.js']).on('change', livereload.changed);
  gulp.watch(['views/*.html', 'partials/*.html'], ['html']);
});



gulp.task('default', ['server', 'watch']);