'use strict';

let fs = require('fs'),
    path = require('path');

const FOLDER_PREFIX = 'v';

let getLatestFolderName = (paths) => {
    let apiSpecsDir = fs.readdirSync(paths.local_api_specs_dir),
        version = 0;

    for (let spec of apiSpecsDir) {
        let dirPath = path.join(paths.local_api_specs_dir, spec),
            stat = fs.statSync(dirPath);

        if (stat.isDirectory()) {
            let currentVersion = +spec.split(FOLDER_PREFIX).pop();
            version = currentVersion > version ? currentVersion : version;
        }
    }
    return FOLDER_PREFIX + version;
};

let getSpecFolderPath = (paths) => {
    return path.join(paths.local_api_specs_dir, getLatestFolderName(paths));
};

let getRamlFileName = (paths) => {
    let specPath = getSpecFolderPath(paths),
        specDir = fs.readdirSync(specPath);

    for (let file of specDir) {
        if (file.endsWith('.raml')) {
            return file;
        }
    }
};

let getHtmlFileName = (paths) => {
    let ramlFileName = getRamlFileName(paths);

    if (ramlFileName) {
        return ramlFileName.split('.raml').shift().concat('.html')
    }
};

module.exports = (gulp, plugins, paths) => {
    // create .html file in the same directory where .raml file
    gulp.task('raml-create-html', () => {
        gulp.src(path.join(getSpecFolderPath(paths), getRamlFileName(paths)))
            .pipe(plugins.raml2html())
            .pipe(gulp.dest(getSpecFolderPath(paths)));
    });
    // copy .html to the build directory and rename it to "documentation.html"
    gulp.task('raml-generate-docs', [ 'raml-create-html' ], () => {
        gulp.src(path.join(getSpecFolderPath(paths), getHtmlFileName(paths)))
            .pipe(plugins.rename('documentation.html'))
            .pipe(gulp.dest(paths.build_dir));
    });
};
