projectPath   = require './projectPath'

path    = require('path')

gulp    = require 'gulp'
gutil   = require 'gulp-util'
changed = require 'gulp-changed'
watch   = require 'gulp-watch'
plumber = require 'gulp-plumber'
series  = require 'stream-series'
filter  = require 'gulp-filter'
concat  = require 'gulp-concat'
rename  = require 'gulp-rename'
gulpif  = require 'gulp-if'

karma   = require 'gulp-karma'

jade    = require 'gulp-jade'
sass    = require 'gulp-sass'
coffee  = require 'gulp-coffee'

sourcemaps = require 'gulp-sourcemaps'

inject  = require 'gulp-inject'

babel   = require 'gulp-babel'

minifyCss = require 'gulp-minify-css'
uglify = require 'gulp-uglify'

minifyHTML = require 'gulp-minify-html'

# Paths
index_path = 'build/index.html'
src_dir    = 'src/'
build_dir  = 'build/'
build_vendor_dir = 'build/vendor/'

gulp.task 'move:es6to5', ->
  return gulp.src projectPath.es6to5
    .pipe(rename({
        extname: ".js"
      }))
    .pipe(babel())
    .pipe(gulp.dest('build/app'));

gulp.task 'move:es6Min', ->
  return gulp.src projectPath.es6to5
  .pipe(rename({
    extname: ".js"
  }))
  .pipe(uglify())
  .pipe(babel())
  .pipe(gulp.dest('build/app'));

gulp.task 'compress', ->
  return gulp.src('build/app/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('vendor'))

gulp.task 'move:jadeMin', ->
	gulp.src projectPath.jade
	.pipe plumber()
	.pipe jade({ pretty : true })
	.pipe inject(gulp.src(projectPath.app, { read : false }), { ignorePath : ['build'], addRootSlash : false })
  .pipe(minifyHTML({ empty: true }))
  .pipe gulp.dest(build_dir)

gulp.task 'move:jade', ->
	gulp.src projectPath.jade
	.pipe plumber()
	.pipe jade({ pretty : true })
	.pipe inject(gulp.src(projectPath.app, { read : false }), { ignorePath : ['build'], addRootSlash : false })
	.pipe gulp.dest(build_dir)

gulp.task 'move:sass', ->
  gulp.src projectPath.sass
    .pipe plumber()
    .pipe(concat('main.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(rename (path)->
      path.dirname = '/style'
      path
    )
    .pipe gulp.dest(build_dir)

gulp.task 'move:sassMin', ->
  gulp.src projectPath.sass
    .pipe plumber()
    .pipe(concat('main.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(rename (path)->
      path.dirname = '/style'
      path
    )
    .pipe gulp.dest(build_dir)

#gulp.task 'move:coffee', ->
#	gulp.src globs.coffee
#	.pipe plumber()
#	.pipe coffee({ bare : true })
#	.pipe gulp.dest(build_dir)


gulp.task 'move:vendor', ->
	gulp.src projectPath.vendor
	.pipe plumber()
	.pipe gulp.dest(build_vendor_dir)


gulp.task 'run:karma', ->
  gulp.src projectPath.karma
  .pipe karma
    configFile : 'karma.conf.js'
    action : 'watch'
  .on 'error', (err) ->
    throw err

gulp.task 'watch', ->
	gulp.watch projectPath.vendor, ['move:vendor']
	gulp.watch projectPath.es6to5, ['move:es6to5']
	gulp.watch projectPath.jade, ['move:jade']
	gulp.watch projectPath.sass, ['move:sass']
	gulp.watch projectPath.coffee, ['move:coffee']

gulp.task 'build-simple', ->
  gulp.watch projectPath.es6to5, ['move:vendor']
  gulp.watch projectPath.es6to5, ['move:es6to5']
  gulp.watch projectPath.sass, ['move:sassMIn']
  gulp.watch projectPath.jade, ['move:jadeMin']

gulp.task 'watch-simple', ->
  gulp.watch projectPath.es6to5, ['move:es6to5']
  gulp.watch projectPath.jade, ['move:jade']
  gulp.watch projectPath.sass, ['move:sass']
  gulp.watch projectPath.karma, ['run:karma']

gulp.task 'move:files', [
  'move:vendor',
  'move:sass',
  'move:es6to5'
], ->
	gulp.start 'move:jade'

gulp.task 'default', ['move:files', 'watch']

`
/** *****************************************
 *
 * Internal helper functions
 *
 ** ***************************************** */


function readModuleArg() {
  var module = argv.c ? 'material.components.' + argv.c : (argv.module || argv.m);
  if (!module) {
    gutil.log('1');
    gutil.log('2');
    process.exit(1);
  }
  return module;
}
`

