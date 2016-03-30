import gulp from 'gulp';
import babel from 'gulp-babel';
import shell from 'gulp-shell';

gulp.task('babel', () => {
  return gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('lib'));
});

gulp.task('refresh', shell.task([
  'rm -rf ./node_modules',
  'echo The \"node_modules\" folder has been deleted. Running \"npm install\" now.',
  'npm install'
]));
