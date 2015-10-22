/// <binding BeforeBuild='test' AfterBuild='default' />
var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var karma = require('gulp-karma');
var jasminen = require('gulp-jasmine-node');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('bower', function () {
    return bower('./bower_components');
});

gulp.task('updateLibs', ['bower'], function () {
    gulp.src(['bower_components/angular/angular*.js'])
        .pipe(gulp.dest('public/dist/angular'));
    gulp.src(['bower_components/angular-resource/angular*.js'])
        .pipe(gulp.dest('public/dist/angular'));    
    gulp.src(['bower_components/angular-route/angular*.js'])
        .pipe(gulp.dest('public/dist/angular'));
    gulp.src(['bower_components/angular-ui-router/release/angular*.js'])
        .pipe(gulp.dest('public/dist/angular'));
});

gulp.task('uglifyJs', function () {
    return gulp.src('public/app/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('public/dist/app-all.min.js'))
            .pipe(uglify())   
        .pipe(sourcemaps.write('.'))             
        .pipe(gulp.dest('.'));
});

gulp.task('minifyCss', function () {
    return gulp.src('public/styles/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss())        
        .pipe(gulp.dest('public/dist'));
});

gulp.task('default', ['minifyCss', 'uglifyJs']);

gulp.task('test', function () {
    return gulp.src(['spec/**/*spec.js']).pipe(jasminen({
        timeout: 10000
    }));
});
