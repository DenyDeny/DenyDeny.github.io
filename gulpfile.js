var gulp       = require('gulp'),
  	less         = require('gulp-less'),
	LessAutoprefix = require('less-plugin-autoprefix'),
	autoprefix = new LessAutoprefix({ browsers: ['last 15 versions'] }),
	gutil 		 = require('gulp-util'), 
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano');

gulp.task('less', function() {
  return gulp.src('app/less/**/*.less')
  .pipe(less())
  .on('error', function (err) { 
	browserSync.notify(err.message, 3000); 
	this.emit('end') 
	})
  .pipe(less({
    plugins: [autoprefix]
  }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
  browserSync({
  	server: {
  		baseDir: 'app'
  	},
  	notify: false
  });
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/css/**/*.css', browserSync.reload);
});
