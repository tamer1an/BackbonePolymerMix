var projectPath = {}; //,  path = require('path');

projectPath.src = 'src/**/*';
projectPath.build = 'build/**/*';

projectPath.es6to5 = 'src/app/**/*.es6';
projectPath.jade = 'src/**/*.jade';
projectPath.html = 'build/**/*.html';

projectPath.app_css = 'build/style/main.css';

projectPath.vendor_js = 'build/vendor/**/*.js';
projectPath.vendor_css = 'build/vendor/**/*.css';
projectPath.vendor = 'vendor/**/*';

projectPath.assets = 'src/assets/**/*';

projectPath.app = [
    'vendor/lodash/dist/lodash.min.js',
    'vendor/angular/angular.min.js',
    'vendor/angular-animate/angular-animate.min.js',
    'vendor/angular-aria/angular-aria.min.js',
    'vendor/angular-material/angular-material.min.js',
    'vendor/angular-ui-router/release/angular-ui-router.min.js',

    'build/app/app.module.js',
    'build/app/core/core.module.js',

    'build/app/core/values/settings.value.js',
    'build/app/core/values/user.value.js',
    'build/app/core/route-service.js',
    'build/app/core/controllers/auth.controller.js',
    'build/app/core/factories/requestService.factory.js',

    'build/app/chr/chr.module.js',
    'build/app/chr/config.route.js',
    'build/app/chr/service/chr.request.service.js',
    'build/app/chr/controllers/chr.controller.js',

    'build/app/addressBook/addressBook.module.js',
    'build/app/addressBook/config.route.js',
    'build/app/addressBook/controllers/addressBook.controller.js',

    'build/app/vmnr/vmnr.module.js',
    'build/app/vmnr/config.route.js',
    'build/app/vmnr/service/vmnr.request.service.js',
    'build/app/vmnr/controllers/vmnr.controller.js',
    '!build/app/**/*.spec.js',

    projectPath.app_css
];

projectPath.app_min = [
    'vendor/lodash/dist/lodash.min.js',
    'vendor/angular/angular.min.js',
    'vendor/angular-animate/angular-animate.min.js',
    'vendor/angular-aria/angular-aria.min.js',
    'vendor/angular-material/angular-material.min.js',
    'vendor/angular-ui-router/release/angular-ui-router.min.js',

    'build/app/all.js'
];

projectPath.app_dev = [
    'vendor/lodash/lodash.js',
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-aria/angular-aria.js',
    'vendor/angular-material/angular-material.js',
    'vendor/angular-ui-router/release/angular-ui-router.js',

    'build/app/app.module.js',
    'build/app/core/core.module.js',

    'build/app/core/values/settings.value.js',
    'build/app/core/values/user.value.js',
    'build/app/core/route-service.js',
    'build/app/core/controllers/auth.controller.js',
    'build/app/core/factories/requestService.factory.js',

    'build/app/chr/chr.module.js',
    'build/app/chr/config.route.js',
    'build/app/chr/service/chr.request.service.js',
    'build/app/chr/controllers/chr.controller.js',

    'build/app/addressBook/addressBook.module.js',
    'build/app/addressBook/config.route.js',
    'build/app/addressBook/controllers/addressBook.controller.js',

    'build/app/vmnr/vmnr.module.js',
    'build/app/vmnr/config.route.js',
    'build/app/vmnr/service/vmnr.request.service.js',
    'build/app/vmnr/controllers/vmnr.controller.js',
    '!build/app/**/*.spec.js',

    projectPath.app_css
];

//projectPath.theme = [
//    'vendor/angular-material/angular-material.scss'
//];

projectPath.sass = [
    //...projectPath.theme,
    // 'vendor/angular-material/angular-material.scss',
    'src/style/*.scss'
];

projectPath.sassWatch = [
    'src/style/**/*.scss'
];

projectPath.karma = [
      'build/vendor/angular/angular.js',
      'build/vendor/angular-mocks/angular-mocks.js',
      'src/test/ng-app.spec.es6'
];

module.exports = projectPath;