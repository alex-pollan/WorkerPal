/// <binding BeforeBuild='test, uglifyJs' />
var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var karma = require('gulp-karma');
var jasminen = require('gulp-jasmine-node');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var gmocha = require('gulp-mocha');

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

gulp.task('uglifyJs', ['updateLibs'], function () {
    return gulp.src('public/app/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('public/dist/app-all.min.js'))
            .pipe(uglify())   
        .pipe(sourcemaps.write('.'))             
        .pipe(gulp.dest('.'));
});

gulp.task('minifyCss', function () {
    return gulp.src('public/styles/**/*.css')
        .pipe(minifyCss())        
        .pipe(gulp.dest('public/dist'));
});

gulp.task('test', function () {
    return gulp.src(['spec/**/*spec.js']).pipe(jasminen({
        timeout: 10000
    }));
});

// gulp.task('test2', function () {
//     return gulp.src(['spec/**/*spec.js']).pipe(gmocha({
//         timeout: 10000
//     }));
// });


gulp.task('clean-deploy', function (cb) {
    del(['deploy/**', '!deploy']).then(function () {
        cb();
    });
});

gulp.task('deploy', ['clean-deploy', 'minifyCss', 'uglifyJs'], function () {
    gulp.src(['public/**/*.html','public/**/*.css', 'public/dist/**/*.min.js', 'public/dist/**/*.js.map'], {base: 'public'})
        .pipe(gulp.dest('deploy/public'));
    gulp.src(['server/**/*.js'], { base: 'server' })
        .pipe(gulp.dest('deploy/server'));
    gulp.src(['node_modules/**/*.*'], { base: 'node_modules' })
        .pipe(gulp.dest('deploy/node_modules'));
    gulp.src(['server.js', 'web.config'])
        .pipe(gulp.dest('deploy'));
});
