'use strict';

var gulp = require("gulp"),
    $ = require("gulp-load-plugins")(),
    source = require("vinyl-source-stream"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    babelify = require("babelify"),
    path = require('path'),
    fs = require('fs'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch');

gulp.task("scripts:server", (element)=>{
    return gulp.src("./src-server/**/*.es6")
        .pipe($.babel())
        .pipe(gulp.dest(function(file){
            file.base ='.';
            return file.base;
        }));
});

gulp.task("watch:scripts:server", ()=>{
    return gulp.watch(
        "src-server/**/*.es6",
        gulp.series("scripts:server")
    );
});


gulp.task("w:scripts:client", ()=>{
    gulp.watch('./src-client/**/*.es6', ['scripts:client']);
});

gulp.task("watch:scripts:client", ()=>{
    const files = fs.readdirSync('./src-client');
    for (let i = 0; i < files.length; i++){
        const file = files[i];
        if (path.extname(file)!=='.es6')
            continue;
        initBundlerWatch(path.join('src-client',file));
    }

    return gulp.watch('./src-client/**/*.es6').
                on('change',initBundlerWatch);
});

gulp.task("watch:scripts",gulp.parallel(
    "watch:scripts:client",
    "watch:scripts:server"
));


let bundlers = {};
function initBundlerWatch(file) {
    // if (bundlers.hasOwnProperty(file))
    //     return;

    const bundler  = createBundler(file);
    bundlers[file] = bundler;
    const watcher  = watchify(bundler);
    const filename = path.basename(file);

    function bundle() {
        return bundler
            .bundle()
            .on("error",error => console.error(error))
            .pipe(source(filename))
            .pipe(gulp.dest("./build"));
    }

    watcher.on("update",bundle);
    watcher.on("time",(time)=>console.log(`the time is ${time}`));

    bundle();
}

function createBundler(file) {
    const bundler = browserify(file);
    bundler.transform(babelify);
    return bundler;
}

gulp.task('move:es6to5', function () {
    return gulp.src("./src-server/**/*.es6").pipe(rename({
        extname: ".js"
    })).pipe(babel({
            presets: ['es2015'] // plugins:['transform-es2015-for-of']
        }))
        .pipe(gulp.dest(function(file){
            file.base ='.';
            return './build';
        }));
});