const config = require('../config');

const gulp = require('gulp');
const istanbul = require('gulp-istanbul');

gulp.task('cover', function () {
  return gulp.src(config.paths.cover.entry)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});
