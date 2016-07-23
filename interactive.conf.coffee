# Karma configuration
# Generated on Thu Jan 29 2015 17:48:29 GMT+0200 (EET)

module.exports = (config) ->
  config.set

    # base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: ''


    # frameworks to use
    # available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine']


    # list of files / patterns to load in the browser
    files: [
      #vendors libs
      'static/js/vendor/underscore/underscore-min.js',
      'static/js/vendor/angular/angular.min.js',
      'static/js/vendor/angular-cookies/angular-cookies.js',
      'static/js/vendor/angular-translate/angular-translate.min.js',
      'static/js/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'static/js/vendor/messageformat/messageformat.js',
      'static/js/vendor/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js',
      'static/js/vendor/angular-mocks/angular-mocks.js',
      'static/js/vendor/restangular/dist/restangular.min.js',
      'static/js/vendor/angular-route/angular-route.min.js',
      'static/js/vendor/angular-poller/angular-poller.min.js',
      'static/js/vendor/lodash/lodash.js',
      'static/js/vendor/angular-md5/angular-md5.js',

      #application code
      'src/js/app/**/module.js',
      'src/js/app/module.js',
      'src/js/app/**/*.js',

      #test cases
      'test/unit/**/*.test.coffee'
      'test/unit/**/*.test.js',

      #mocks
      'test/unit/**/*.mock.coffee'
      'test/unit/**/*.mock.js'

      #stubs
      'test/unit/**/*.stub.coffee'
      'test/unit/**/*.stub.js'

    ]


    # list of files to exclude
    exclude: [
    ]


    # preprocess matching files before serving them to the browser
    # available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.coffee': ['coffee']
    }

    coffeePreprocessor: {
      options:
        bare: true
        sourceMap: false
      transformPath: (path) ->
        path.replace(/\.coffee$/, '.js');
    }

    # test results reporter to use
    # possible values: 'dots', 'progress'
    # available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress']


    # web server port
    port: 9876


    # enable / disable colors in the output (reporters and logs)
    colors: true


    # level of logging
    # possible values:
    # - config.LOG_DISABLE
    # - config.LOG_ERROR
    # - config.LOG_WARN
    # - config.LOG_INFO
    # - config.LOG_DEBUG
    logLevel: config.LOG_INFO


    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true


    # start these browsers
    # available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS']


    # Continuous Integration mode
    # if true, Karma captures browsers, runs the tests and exits
    singleRun: false
