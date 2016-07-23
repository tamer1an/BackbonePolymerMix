const gulp = require('gulp'),
      gutil = require('gulp-util'),
      plugins = require('gulp-load-plugins')({ pattern: [ 'gulp-*' ] }),
      join = require('path').join,
      paths = require('./deployment-configs/paths');

const isProduction = Boolean(gutil.env.production),
      karmaConfigFile = join(__dirname, paths.karma_config);

require('./deployment-configs/gulp-tasks/raml')(gulp, plugins, paths);
require('./deployment-configs/gulp-tasks/pre-commit')(gulp, plugins, paths);
require('./deployment-configs/gulp-tasks/run.karma')(gulp, { path: karmaConfigFile, production: isProduction });
