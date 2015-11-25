import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-minify-css';
import htmlmin from 'gulp-minify-html';
import jade from 'gulp-jade';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import browsersync from 'browser-sync';
import watch from 'gulp-watch';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import sassBulkImport from 'gulp-sass-bulk-import';

function onError(err) {
	console.log(err);
	this.emit('end');
}

gulp.task('sass', () => {
	return gulp.src('./sass/main.scss')
		.pipe(sassBulkImport())
		.pipe(sass()).on('error', onError)
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./_bin'))
		.pipe(browsersync.stream());
});

gulp.task('jade', () => {
	return gulp.src('./jade/index.jade')
		.pipe(jade()).on('error', onError)
		.pipe(htmlmin())
		.pipe(gulp.dest('./_bin'))
		.pipe(browsersync.stream());
});

gulp.task('js', () => {
	return browserify('./js/app.js')
			.transform('babelify', {presets: ['es2015']})
			.bundle()
			.on('error', onError)
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./_bin'))
		.pipe(browsersync.stream());
});

gulp.task('img', () => {
	return gulp.src('./img/**/*')
		.pipe(gulp.dest('./_bin/img'))
		.pipe(browsersync.stream())
		.on('error', onError);
});

gulp.task('icons', () => {
	return gulp.src('./icons/**/*')
		.pipe(watch('./icons/**/*'))
		.pipe(gulp.dest('./_bin/icons'))
		.pipe(browsersync.stream());
});

gulp.task('build', ['sass', 'jade', 'js', 'img']);

gulp.task('default', () => {
	browsersync.init({
		server: './_bin',
		notify: false,
	});
	gulp.watch('sass/**/*', ['sass']);
	gulp.watch('jade/**/*', ['jade']);
	gulp.watch('js/**/*', ['js']);
	gulp.watch('img/**/*', ['img']);
	gulp.watch('icons/**/*', ['icons']);
});
