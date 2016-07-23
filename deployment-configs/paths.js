'use strict';

let join = require('path').join;
const paths = {};

paths.src_dir = 'src/';
paths.app_dir = join(paths.src_dir, 'app/');
paths.build_dir = 'build/';
paths.vendors_dir = 'vendor/**/*';
paths.tests_dir = join(paths.src_dir, 'tests/');

//Entry files
paths.indexJade = join(paths.src_dir, 'index.jade');
paths.appJS = join(paths.app_dir, 'app.js');
//Project Files: .jade, .sass, .es6
paths.jade = join(paths.src_dir, '**/*.jade');
paths.sass = join(paths.src_dir, '**/*.scss');
paths.es6to5 = join(paths.src_dir, '**/*.js');

//Build Files Paths
paths.build_styles = join(paths.build_dir, 'styles/');

//Minified files Paths
paths.app_bundle_assets = join(paths.build_dir, 'assets/**/*.*');
paths.styles_min_dir = join(paths.build_dir, 'styles/**/*.*');
paths.app_min = join(paths.build_dir, 'app.min.js');
paths.index_file = join(paths.build_dir, 'index.html');

paths.static = join(paths.build_dir, 'assets/static/**/*.*');

//Vendors Paths in build folder
paths.app_bundles = join(paths.build_dir,'assets/**/app.bundle*.*');
paths.vendors_bundles = join(paths.build_dir,'assets/**/vendors.bundle*.*');

paths.build_vendor_dir = join(paths.build_dir, 'vendor/');
paths.build_vendor_all = join(paths.build_vendor_dir, '**/*.*');
paths.build_vendors_js = join(paths.build_vendor_dir, 'js/');
paths.build_vendors_css = join(paths.build_vendor_dir, 'css/');
paths.build_vendors_fonts = join(paths.build_vendor_dir, 'fonts/');
paths.build_vendors_images = join(paths.build_vendor_dir, 'images/');

//Nuget Packages Paths
paths.nuget_packages = './nuget_packages';

//Tests Paths
paths.karma_config = join(paths.tests_dir, 'karma.conf.js');

//Raml Paths
paths.mock_data_dir = 'mock-data/';
paths.local_api_server_dir = join(paths.mock_data_dir, 'api/local-api-server');
paths.local_api_specs_dir = join(paths.local_api_server_dir, 'api-specs');

module.exports = paths;
