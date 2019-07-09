var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');

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
		.src(paths.styles.src)
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

gulp.task('minifyImg', function(){
	return gulp
		.src(paths.img.src)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.img.dest))
});

// reload browser
gulp.task('reloadBrowser', function(done){
	browserSync.reload();
	done();
});

gulp.task('streamBrowser', function(done){
	browserSync.stream();
	done();
});

// Watches file for changes and runs the task
gulp.task('watch', function () {
	gulp.watch(paths.styles.src, gulp.series('sass', 'streamBrowser'));
	gulp.watch(paths.watch.pug, gulp.series('compileHTML', 'reloadBrowser'));
	gulp.watch(paths.img.src, gulp.series('minifyImg', 'reloadBrowser'));
});

// Starts the development server
gulp.task('serve', gulp.parallel('browser-sync', 'watch'));
