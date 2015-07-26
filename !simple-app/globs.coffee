globs = {}

globs.coffee = 'src/**/*.coffee'
globs.es6to5 = 'src/app/**/*.es6'
globs.jade = 'src/**/*.jade'
globs.src = 'src/**/*'
globs.build = 'build/**/*'
globs.html = 'build/**/*.html'
globs.app_js = 'build/app/**/*.js'
globs.app_sass = 'src/style/app.scss'
globs.app_css = 'build/style/main.css'
globs.vendor_js = 'build/vendor/**/*.js'
globs.vendor_css = 'build/vendor/**/*.css'
globs.vendor = 'vendor/**/*'

# choose the angular material themes you want to use
# globs.themes = [ 'cyan', 'deep-purple', 'pink' ]

globs.theme = 'vendor/angular-material-source/src/core/style/variables.scss'

globs.sass = [
  # application style
  'src/style/*.scss'
]

globs.themeSass = [

]


globs.app = [
  # you need to reference bower modules here
  'vendor/jquery/dist/jquery.js',
  'vendor/underscore/underscore.js',
  'vendor/backbone/backbone.js',
  'vendor/backbone.localStorage/backbone.localStorage.js',
  'vendor/backbone-fetch-cache/backbone.fetch-cache.js',
 
  'vendor/webcomponentsjs/webcomponents.js',

  globs.app_js
  "!build/app/**/*.spec.js"
  globs.app_css
]

module.exports = globs
