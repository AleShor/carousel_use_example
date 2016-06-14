"use strict";

// Load plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    del = require('del');

// source files paths
var srcdir = 'assets';
var src = {
  html: [srcdir+'/*.html'],
  css: [srcdir+'/css/*.css'],
  js: [srcdir+'/js/*.js'],
  images: [srcdir+'/img/**'],
  fonts: [srcdir+'/fonts/**']
}

// distribution files paths
var distdir = 'dist';
var dist = {
  css: distdir + '/css/',
  js: distdir + '/js/',
  images: distdir + '/img/',
  fonts: distdir+'/fonts/',
  all: distdir + '/**'
}

// minify app files
gulp.task('assets', function(){
  return gulp.src(src.html)
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest(distdir))
});

// Images
gulp.task('images', function() {
  return gulp.src(src.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist.images))
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(dist.fonts))
});

// lint scripts code
gulp.task('lint', function() {
    return gulp.src(src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// run server
 gulp.task('browserSync', function() {
  browserSync({
    ui: {
       port: 3002
    },
    server: {
      baseDir: distdir
    }
  })
})

// Clean
gulp.task('clean', function() {
  return del(distdir);
});

// Watch
gulp.task('watch', ['browserSync'], function() {
  // Watch app source files
  gulp.watch([src.html, src.css, src.js], ['assets', 'lint']);
  gulp.watch(src.js, ['lint']);
  // Watch image files
  gulp.watch(src.images, [src.images]);

  // Watch any files in dist/, reload on change
  gulp.watch(dist.all).on('change', browserSync.reload);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('assets', 'images', 'fonts', 'lint', 'watch');
  notify({ message: 'Default task complete' });
});

// Build task
gulp.task('build', ['clean', 'assets', 'images', 'fonts', 'lint'], function() {
  notify({ message: 'Build task complete' })
});
