var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');

// Paths and directories
var paths = {
	styles: {
		src: './src/assets/sass/**/*.scss',
		dest: './dist/assets/css'
	},

	html: {
		src: './src/*.pug',
		dest: './dist'
	},
	
	js: {
		src: './src/assets/js/*.js',
		dest: './dist/assets/js'
	},

	watch: {
		pug: ['./src/*.pug', './src/**/*.pug']
	}
};

// Compiles Sass into CSS
gulp.task('sass', function () {
	return gulp
		.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
});

// Watches files for change and reloads the browser
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});

// Compiles pug file into HTML
gulp.task('compileHTML', function(){
	return gulp
		.src(paths.html.src)
		.pipe(pug({
			beautify: true
		}))
		.pipe(gulp.dest(paths.html.dest))
		.pipe(browserSync.reload());
});

// Watches file for changes and runs the task
gulp.task('watch', function () {
	gulp.watch(paths.styles.src, gulp.series('sass'));
	gulp.watch(paths.watch.pug, gulp.series('compileHTML'));
});
// Starts the development server
gulp.task('serve', gulp.parallel('browser-sync', 'watch'));
