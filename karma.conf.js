// Karma configuration
// Generated on Sun Jun 15 2014 20:10:28 GMT-0600 (MDT)

var path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    // files: [
    //   'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
    //    path.dirname(require.resolve('jasmine-core')) + '/jasmine-core/jasmine.js',
    //   'build/vendor/angular/angular.js',
    //   'build/vendor/angular-mocks/angular-mocks.js',
    //   'src/test/ng-app.spec.es6'
    // ],

    files: [
      // #vendors libs
      'vendor/lodash/lodash.js',
      'vendor/angular/angular.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-aria/angular-aria.js',
      'vendor/angular-material/angular-material.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-mocks/angular-mocks.js',

      // #application code
      'src/app/**/*.module.es6',
      'src/app/*.module.es6',
      'src/app/**/*.es6',

       // #test cases
       'src/test/ng-app.spec.es6'
    ],

    // list of files to exclude
    exclude: [
      
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ['dots'],
    // reporters: ['progress', 'jasmine-runner'],
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};

