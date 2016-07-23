'use strict';

let nugetVersionsMgr = require('../nuget-deps/nuget-version-mngr'),
    nugetPack = require('gulp-nuget-pack');

module.exports = function (gulp, plugins, paths, production) {
    const vendors_options = {
            info: (version) => {
                if (!version) {
                    version = production ? nugetVersionsMgr.generateNew('vendors') : nugetVersionsMgr.get('vendors');
                }
                return {
                    id: 'CSC.SPA.Vendors',
                    version: version,
                    authors: 'FED',
                    description: 'The package that contains the third party sources.',
                    outputDir: paths.nuget_packages
                };
            },
            paths: [ paths.vendors_bundles ]
        },
        app_options = {
            info: (version) => {
                var vendorsVersion = version || nugetVersionsMgr.get('vendors');
                if (!version) {
                    version = production ? nugetVersionsMgr.generateNew('app') : nugetVersionsMgr.get('app');
                }
                return {
                    id: 'CSC.SPA.App',
                    version: version,
                    authors: 'FED',
                    description: 'The package that contains the main application sources.',
                    outputDir: paths.nuget_packages,
                    dependencies: [
                        {
                            id: 'CSC.SPA.Vendors',
                            version: '[' + vendorsVersion + ']'
                        }
                    ]
                };
            },
            paths: [ paths.app_bundles, paths.index_file, paths.static ]
        };

    gulp.task('nuget-vendor', (cb) => {
        let version = process.argv[3] === '-v' ? process.argv[4] : null;
        return nugetPack(vendors_options.info(version), vendors_options.paths, cb);
    });

    gulp.task('nuget-app', (cb) => {
        let version = process.argv[3] === '-v' ? process.argv[4] : null;
        return nugetPack(app_options.info(version), app_options.paths, cb);
    });

    return gulp.task('build:nuget', [ 'nuget-vendor', 'nuget-app' ]);
};
