var gulp = require('gulp');

var less = require('gulp-less');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');

var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var templateCache = require('gulp-angular-templatecache');

var rev = require('gulp-rev');
var replace = require('gulp-replace');
// https://github.com/jamesknelson/gulp-rev-replace - Todo

// Add Gulp remove console.log

var del = require('del');

var ngAnnotate = require('gulp-ng-annotate');

var paths = {
    scripts: ['app/scripts/**/*.js', 'vendors/**/*.js'],
    images: 'app/images/**/*',
    styles: ['app/styles/**/*.css', 'vendors/**/*.css']
};

gulp.task('watch', function() {
    watch('app/less/**/*.less', function(files, cb) {
        gulp.start('less', cb);
    });
});

gulp.task('less', function() {
    gulp.src('app/less/main.less').pipe(less()).pipe(autoprefixer()).pipe(gulp.dest('app/styles'));
});

gulp.task('ngtemplate', function() {
    gulp.src('app/templates/**/*.html')
        .pipe(templateCache({
            module: 'phoneApp',
            root: 'templates'
        }))
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('usemin', ['ngtemplate'], function() {
    gulp.src('app/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({
                empty: true
            })],
            js: [ngAnnotate(), uglify()]
        }))
        .pipe(gulp.dest('dist/'));
    gulp.src('app/release_index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({
                empty: true
            })],
            js: [ngAnnotate(), uglify()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['dist'], cb);
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('movestatic', function() {

});

gulp.task('version', function() {
    return gulp.src('dist/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist'));
});

gulp.task('buildCdn', ['build'], function() {
    // do ssomething
    // gulp.src('dist/scripts/*.js')
    // https://www.npmjs.org/package/gulp-replace
    gulp.src('dist/**/*')
        .pipe(replace('http://wx-api-test.secret-cn.com', 'http://secret-ajax.hortor.net'))
        .pipe(gulp.dest('release'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('build', ['clean', 'usemin', 'images', 'movestatic']);
gulp.task('noimg', ['clean', 'usemin', 'movestatic']);
// gulp.task('default', ['build']);