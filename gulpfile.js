"use strict";

var gulp = require('gulp'),
 sass = require('gulp-sass'),
 inject = require('gulp-inject'),
 wiredep = require('wiredep').stream,
 del = require('del'),
 mainBowerFiles = require('main-bower-files'),
 filter = require('gulp-filter'),
 concat = require('gulp-concat'),
 maps = require('gulp-sourcemaps');
//@TODO break this task down and write down what each line does or delete it as it is outdated
// gulp.task('clean', function(cb){
//   del(['dist'], cb);
// });
//@TODO break this task down and write down what each line does
gulp.task('concatSass', function(){
  var injectSharedFiles = gulp.src('app/shared/**/*.scss', {read: false});  //scss files for the shared partials of the app
  var injectAppFiles = gulp.src('app/assets/styles/*.scss', {read: false}); //custom scss files for the entire app
  var injectGlobalFiles = gulp.src('app/assets/global/*.scss', {read: false});//scss files for overwriting framworks i.e. bootstrap
  
  
  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('src/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(maps.init()) //this maps the css file for browser debugging
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(maps.write('./')) //this maps the css file for browser debugging
    .pipe(gulp.dest('app/assets/styles'));
});
//@TODO break this task down and write down what each line does
gulp.task('concatVendors', function(){
  return gulp.src(mainBowerFiles())
    .pipe(filter('*.css'))
    .pipe(maps.init()) //this maps the css file for browser debugging
    .pipe(sass())
    .pipe(concat('vendors.css'))
    .pipe(maps.write('./')) //this maps the css file for browser debugging
    .pipe(gulp.dest('app/assets/styles'));
});
//@TODO break this task down and write down what each line does
gulp.task('concatScripts', function() {
//  var jsSources = (['assets/js', 'bower_components/jquery/dist/jquery.js'])
  return gulp.src(['bower_components/jquery/dist/jquery.min.js', 'bower_components/bootstrap-sass/assets/javascripts/*.js', 'bower_components/angular/*.js', 'bower_components/angular-ui-router/release/*.js', 'app/assets/js/*.js'])          
          //.pipe(filter('*.js'))
          .pipe(maps.init()) //this maps the css file for browser debugging
          .pipe(concat('app.js'))
          .pipe(maps.write('./')) //this maps the css file for browser debugging
          .pipe(gulp.dest('app/assets/js'));
});
gulp.task('watch', function() {
  gulp.watch('assets/**/*.scss', ['concatSass']);
  gulp.watch('assets/**/*.js', ['concatScripts']);
})
//@TODO break this task down and write down what each line does
gulp.task('build', [/*'clean',*/ 'concatVendors', 'concatSass', 'concatScripts'], function(){
  var injectFiles = gulp.src(['app/assets/styles/main.css', 'app/assets/styles/vendors.css', 'app/assets/js/app.js']);

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'app'] //replacing dist with app on this line may cause issues
  };

  return gulp.src('src/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(gulp.dest('app'));
});

gulp.task("default", ["build"]);