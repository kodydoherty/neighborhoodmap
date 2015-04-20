var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css/'))
        .pipe(livereload());
    gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(livereload());
    gulp.src('index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('.'))
        .pipe(livereload());
});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch('src/css/*.css');
})
