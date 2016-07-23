'use strict';

let KarmaServer = require('karma').Server;

module.exports = (gulp, options) => {
    return gulp.task('run:karma', (done) => {
        new KarmaServer({
            configFile: options.path,
            singleRun: options.production
        }, done).start()
    });
};
