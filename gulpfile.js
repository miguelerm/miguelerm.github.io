var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var watch = require('gulp-watch')
var del = require('del');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var pkg = require('./package.json');

gulp.task('uglify', ['clean-js'], function () {
    return gulp.src('./js/' + pkg.name + '.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./js'))
});

gulp.task('sass', ['clean-css'], function () {
    return gulp.src('./_sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('mincss', ['sass'], function () {
    return gulp.src('./css/main.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css'));
});

gulp.task('clean-css', function () {
    return del([
        './css/' + pkg.name + '.css',
        './css/' + pkg.name + '.min.css'
    ]);
});

gulp.task('clean-js', function () {
    return del([
        './js/' + pkg.name + '.min.js'
    ]);
});

gulp.task('default', ['uglify', 'sass', 'mincss'], function() {
  // place code for your default task here
});

gulp.task('watch', ['default'], function () {
    watch('./_sass/*.scss', function () {
        gulp.start('mincss');
    });
    watch(['./js/*.js', '!./js/*.min.js'], function () {
        gulp.start('uglify');
    });
});