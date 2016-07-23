var babel, build_dir, build_vendor_dir, changed, concat, filter, gulp, gulpif, gutil, index_path, inject, jade, minifyCss, minifyHTML, path, plumber, projectPath, rename, sass, series, sourcemaps, src_dir, watch;

projectPath = require('./projectPath');

path = require('path');

gulp = require('gulp');

gulpif = require('gulp-if');

gutil = require('gulp-util');

changed = require('gulp-changed');

watch = require('gulp-watch');

plumber = require('gulp-plumber');

series = require('stream-series');

filter = require('gulp-filter');

concat = require('gulp-concat');

rename = require('gulp-rename');

inject = require('gulp-inject');

babel = require('gulp-babel');

jade = require('gulp-jade');

sass = require('gulp-sass');

minifyCss = require('gulp-cssnano');

minifyHTML = require('gulp-htmlmin');

sourcemaps = require('gulp-sourcemaps');

index_path = 'build/index.html';

src_dir = 'src/';

build_dir = 'build/';

build_vendor_dir = 'build/vendor/';

gulp.task('move:es6to5', function () {
    return gulp.src(projectPath.es6to5).pipe(rename({
        extname: ".js"
    })).pipe(babel({
        presets: ['es2015']
    })).pipe(gulp.dest('build/app'));
});

gulp.task('move:jade', function () {
    return gulp.src(projectPath.jade).pipe(plumber()).pipe(jade({
        pretty: true
    })).pipe(inject(gulp.src(projectPath.app, {
        read: false
    }), {
        ignorePath: ['build'],
        addRootSlash: false
    })).pipe(gulp.dest(build_dir));
});

gulp.task('move:jadeMin', function () {
    return gulp.src(projectPath.jade).pipe(plumber()).pipe(jade({
        pretty: true
    })).pipe(inject(gulp.src(projectPath.app, {
        read: false
    }), {
        ignorePath: ['build'],
        addRootSlash: false
    })).pipe(minifyHTML({
        collapseWhitespace: true
        // ,empty:true
    })).pipe(gulp.dest(build_dir));
});

gulp.task('move:sass', function () {
    return gulp.src(projectPath.sass).pipe(plumber()).pipe(concat('main.scss')).pipe(sourcemaps.init()).pipe(sass()).pipe(sourcemaps.write()).pipe(rename(function (path) {
        path.dirname = '/style';
        return path;
    })).pipe(gulp.dest(build_dir));
});

gulp.task('move:sassMin', function () {
    return gulp.src(projectPath.sass).pipe(plumber()).pipe(concat('main.scss')).pipe(sourcemaps.init()).pipe(sass()).pipe(minifyCss()).pipe(sourcemaps.write()).pipe(rename(function (path) {
        path.dirname = '/style';
        return path;
    })).pipe(gulp.dest(build_dir));
});

gulp.task('move:vendor', function () {
    return gulp.src(projectPath.vendor).pipe(plumber()).pipe(gulp.dest(build_vendor_dir));
});


gulp.task('watch', function () {
    gulp.watch(projectPath.vendor, ['move:vendor']);
    gulp.watch(projectPath.es6to5, ['move:es6to5']);
    gulp.watch(projectPath.jade, ['move:jade']);
    gulp.watch(projectPath.sass, ['move:sass']);
});


gulp.task('move:files', ['move:vendor', 'move:sass', 'move:es6to5'], function () {
    return gulp.start('move:jade');
});

gulp.task('move:prod', ['move:vendor', 'move:sassMin', 'move:es6to5'], function () {
    return gulp.start('move:jadeMin');
});

gulp.task('build', ['move:prod']);

gulp.task('default', ['move:files', 'watch']);
