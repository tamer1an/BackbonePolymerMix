const eslintPathFormatter = require('eslint-path-formatter');

module.exports = (gulp, plugins, paths) => {
    gulp.task('eslint', () => {
        gulp.src(paths.appJS)
            .pipe(plugins.eslint(
                { format: './node_modules/eslint-path-formatter' }
            ))
            .pipe(plugins.eslint.format(eslintPathFormatter))
            //.pipe(plugins.eslint.format())
            .pipe(plugins.eslint.failOnError())
            .on('error', () => {
                gulp.fail = true;
            });
    });

    return gulp.task('pre-commit', [ 'eslint' ]);
};

