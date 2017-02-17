const config = require('../config');

const gulp  = require('gulp');
const pegjs = require('gulp-pegjs');

gulp.task('peg', function() {
  return gulp.src(config.paths.peg.entry)
    .pipe(pegjs({format: 'commonjs', cache: true}))
    .pipe(gulp.dest(config.paths.peg.dest));
});
