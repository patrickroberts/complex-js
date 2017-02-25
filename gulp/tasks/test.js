const config = require('../config');

const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

gulp.task('test', ['browserify', 'cover'], function () {
  return gulp.src(config.paths.test.entry)
    .pipe(mocha())
    .pipe(istanbul.writeReports())
});
