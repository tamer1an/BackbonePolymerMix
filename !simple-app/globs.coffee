globs = {}

globs.coffee = 'src/**/*.coffee'
globs.es6to5 = 'src/app/**/*.js'
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
  # angular material core
  'vendor/angular-material-source/src/core/style/variables.scss'
  'vendor/angular-material-source/src/core/style/mixins.scss'
  'vendor/angular-material-source/src/core/style/structure.scss'
  'vendor/angular-material-source/src/core/style/layout.scss'

  # angular material components
  'vendor/angular-material-source/src/components/**/*.scss'
  '!vendor/angular-material-source/src/components/**/*-theme.scss'

  # application style
  'src/**/*.scss'
]

globs.themeSass = [
  'vendor/angular-material-source/src/components/**/*-theme.scss'
  'src/core/style/variables.scss'
  'src/core/style/mixins.scss'
]


globs.app = [
  # you need to reference bower modules here
  'vendor/jquery/jquery.js',
  'vendor/underscore/underscore.js',
  'vendor/backbone/backbone.js',


  globs.app_js
  "!build/app/**/*.spec.js"
  globs.app_css
]

module.exports = globs
