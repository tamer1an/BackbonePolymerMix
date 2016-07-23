var babel, build_dir, build_vendor_dir, changed, concat, filter, gulp, gulpif, gutil, index_path, inject, jade, minifyCss, minifyHTML, path, plumber, projectPath, rename, sass, series, sourcemaps, src_dir, watch, build_assets_dir, karmaServer;

projectPath = require('./projectPath');

path = require('path');
series = require('stream-series');

gulp = require('gulp');
gulpif = require('gulp-if');
gutil = require('gulp-util');

changed = require('gulp-changed');
watch = require('gulp-watch');

plumber = require('gulp-plumber');
filter = require('gulp-filter');
concat = require('gulp-concat');
rename = require('gulp-rename');

jade = require('gulp-jade');
inject = require('gulp-inject');

babel = require('gulp-babel');
sass = require('gulp-sass');

sourcemaps = require('gulp-sourcemaps');

minifyCss = require('gulp-cssnano');
minifyHTML = require('gulp-htmlmin');

index_path = 'build/index.html';
src_dir = 'src/';
build_dir = 'build/';
build_vendor_dir = 'build/vendor/';
build_assets_dir = 'build/assets/';

karmaServer  =  require('karma').Server;

gulp.task('run:karma', function () {
    karmaServer.start({
        configFile: __dirname + '/karma.conf.js',
        // singleRun: true,
        reporters: ['progress'],
        jasmineSpecRunnerReporter: {
            jasmineCoreDir: 'jasmine-core'
        }
    });
});

gulp.task('move:es6to5', function () {
    return gulp.src(projectPath.es6to5).pipe(rename({
        extname: ".js"
    })).pipe(babel({
            presets: ['es2015'] // plugins:['transform-es2015-for-of']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/app'));
});

gulp.task('move:es6to5Min', function () {
    return gulp.src(projectPath.es6to5).pipe(rename({
        extname: ".js"
    })).pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/app'));
});

gulp.task('move:jade', function() {
    return gulp.src(projectPath.jade).pipe(plumber()).pipe(jade({
        pretty: true
    })).pipe(inject(gulp.src(projectPath.app, {
        read: false
    }), {
        ignorePath: ['build'],
        addRootSlash: false
    })).pipe(gulp.dest(build_dir));
});

gulp.task('move:jadeMin', function() {
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

gulp.task('move:sass', function() {
    return gulp.src(projectPath.sass)
        .pipe(plumber())
        .pipe(concat('main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(rename(function(path) {
            path.dirname = '/style';
            return path;
        }))
        .pipe(gulp.dest(build_dir));
});

gulp.task('move:sassMin', function() {
    return gulp.src(projectPath.sass)
        .pipe(plumber())
        .pipe(concat('main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(rename(function(path) {
            path.dirname = '/style';
            return path;
        }))
        .pipe(gulp.dest(build_dir));
});

gulp.task('move:vendor', function() {
    return gulp.src(projectPath.vendor).pipe(plumber()).pipe(gulp.dest(build_vendor_dir));
});

gulp.task('move:assets', function() {
    return gulp.src(projectPath.assets).pipe(plumber()).pipe(gulp.dest(build_assets_dir));
});


gulp.task('watch',function()  {
    gulp.watch(projectPath.vendor,      ['move:vendor']);
    gulp.watch(projectPath.es6to5,      ['move:es6to5']);
    gulp.watch(projectPath.jade,        ['move:jade']);
    gulp.watch(projectPath.sassWatch,   ['move:sass']);
    // gulp.watch(projectPath.sassWatch,   ['run:karma']);
});


gulp.task('move:files', ['move:vendor', 'move:sass', 'move:es6to5', 'move:assets'],function() {
    return gulp.start('move:jade');
});

gulp.task('move:prod', ['move:vendor', 'move:sassMin', 'move:es6to5', 'move:assets'], function() {
    return gulp.start('move:jadeMin');
});

gulp.task('build', ['move:prod']);

gulp.task('default', ['move:files', 'watch']);
