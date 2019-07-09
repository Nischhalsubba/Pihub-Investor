var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean-css');

// Paths and directories
var paths = {
	sass: {
		src: './src/assets/sass/**/*.scss',
		dest: './dist/assets/css'
	},

	css: {
		src: './src/assets/css/*.css',
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

	img: {
		src: './src/assets/img/**',
		dest: './dist/assets/img'
	},

	watch: {
		pug: ['./src/*.pug', './src/**/*.pug']
	}
};

// Compiles Sass into CSS
gulp.task('sass', function () {
	return gulp
		.src(paths.sass.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(paths.styles.dest));
});

// Watches files for change and reloads the browser
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "./dist"
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
		.pipe(gulp.dest(paths.html.dest));
});

// Optimizes images
gulp.task('minifyImg', function(){
	return gulp
		.src(paths.img.src)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.img.dest))
});

// Minifies the javascript
gulp.task('minifyJs', function() {
	return gulp
		.src(paths.js.src)
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.dest));
});

// Minifies the css
gulp.task('minifyCss', function() {
	return gulp
		.src(paths.css.src)
		.pipe(clean())
		.pipe(gulp.dest(paths.css.dest));
});

// reload browser
gulp.task('reloadBrowser', function(done){
	browserSync.reload();
	done();
});

// injects css changes to the browser
gulp.task('streamBrowser', function(done){
	browserSync.stream();
	done();
});

// Watches file for changes and runs the task
gulp.task('watch', function () {
	gulp.watch(paths.sass.src, gulp.series('sass', 'streamBrowser'));
	gulp.watch(paths.watch.pug, gulp.series('compileHTML', 'reloadBrowser'));
	gulp.watch(paths.img.src, gulp.series('minifyImg', 'reloadBrowser'));
	gulp.watch(paths.css.src, gulp.series('minifyCss', 'reloadBrowser'));
	gulp.watch(paths.js.src, gulp.series('minifyJs', 'reloadBrowser'));
});

// Starts the development server
gulp.task('serve', gulp.parallel('browser-sync', 'watch'));
