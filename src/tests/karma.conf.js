// Karma configuration
// Generated on Thu Sep 17 2015 14:39:00 GMT+0300 (FLE Daylight Time)
//var webpackConfig = require('../../webpack.config');

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../..',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'jasmine' ],
        plugins: [ 'karma-phantomjs-launcher', 'karma-jasmine', 'karma-junit-reporter', 'karma-coverage', 'karma-webpack' ],
        junitReporter: {
            outputFile: 'results/TEST-units.xml',
            suite: ''
        },
        /*webpackConfig*/
        webpack: {
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
                    { test: /\.scss$/, exclude: /node_modules/, loader: 'style-loader!css-loader!sass-loader' },
                    { test: /\.jade$/, exclude: /node_modules/, loader: 'jade-loader' }
                ]
            },
            watch: true
        },
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'results/',
            subdir: '.'
        },
        // list of files / patterns to load in the browser
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-mocks/angular-mocks.js',
            './src/tests/**/*.spec.js'
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './**/*.js': [ 'coverage' ],
            './src/tests/**/*.spec.js': [ 'webpack' ]
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // reporters = ['dots', 'junit'];
        reporters: [ 'progress' ],
        // singleRun = true;
        // junitReporter: {
        //   outputFile: 'test-results.xml',
        //  suite: 'tests'
        // },
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUGo
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'PhantomJS' ],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
