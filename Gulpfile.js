var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var del = require('del')
var runSequence = require('run-sequence')
var browserify = require('gulp-browserify')

var browserifyOptions = {

}

// Static Server + watching scss/html files
gulp.task('serve', ['clean:build', 'html', 'sass', 'js', 'assets'], function () {
  browserSync.init({
    server: './build'
  })

  gulp.watch('./app/scss/**/*', ['sass'])
  gulp.watch('./app/js/**/*', ['js'])
  gulp.watch('./app/*.html', ['html'])
  gulp.watch('./app/assets/**/*', ['assets'])
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', function () {
  return gulp.src('./app/js/*.js')
    .pipe(browserify(browserifyOptions))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
})

gulp.task('html', function () {
  return gulp.src('./app/*.html')
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream())
})

gulp.task('assets', function () {
  return gulp.src('./app/assets/**/*')
    .pipe(gulp.dest('./build/assets'))
    .pipe(browserSync.stream())
})

gulp.task('clean:build', function () {
  return del.sync('./build')
})

gulp.task('clean:dist', function () {
  return del.sync('./dist')
})

gulp.task('build:html', function () {
  return gulp.src('./app/*.html')
    .pipe(gulp.dest('./dist'))
})

gulp.task('build:assets', function () {
  return gulp.src('./app/assets/**/*')
    .pipe(gulp.dest('./dist/assets'))
})

gulp.task('build:js', function () {
  return gulp.src('./app/js/*.js')
    .pipe(browserify(browserifyOptions))
    .pipe(gulp.dest('./dist/js'))
})

// Compile sass into CSS
gulp.task('build:sass', function () {
  return gulp.src('./app/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('default', ['serve'])

gulp.task('clean', ['clean:build', 'clean:dist'])

gulp.task('build', function (callback) {
  runSequence('clean:dist', ['build:html', 'build:assets', 'build:js', 'build:sass'], callback)
})
