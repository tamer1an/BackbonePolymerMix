var projectPath = {};

projectPath.coffee = 'src/**/*.coffee';

projectPath.es6to5 = 'src/app/**/*.es6';

projectPath.jade = 'src/**/*.jade';

projectPath.src = 'src/**/*';

projectPath.build = 'build/**/*';

projectPath.html = 'build/**/*.html';

projectPath.app_sass = 'src/style/app.scss';

projectPath.app_css = 'build/style/main.css';

projectPath.vendor_js = 'build/vendor/**/*.js';

projectPath.vendor_css = 'build/vendor/**/*.css';

projectPath.vendor = 'vendor/**/*';

projectPath.app = [
    'vendor/lodash/lodash.min.js',
    'vendor/angular/angular.min.js',
    'vendor/angular-animate/angular-animate.min.js',
    'vendor/angular-aria/angular-aria.min.js',
    'vendor/angular-material/angular-material.min.js',
    'vendor/angular-ui-router/release/angular-ui-router.min.js',

    "build/app/app.module.js", "build/app/core/core.module.js",

    "build/app/core/values/settings.value.js",
    "build/app/core/values/user.value.js",
    "build/app/core/route-service.js",
    "build/app/core/controllers/auth.controller.js",
    "build/app/core/factories/requestService.factory.js",

    "build/app/chr/chr.module.js",
    "build/app/chr/config.route.js",
    "build/app/chr/controllers/chr.controller.js",

    "build/app/addressBook/addressBook.module.js",
    "build/app/addressBook/config.route.js",
    "build/app/addressBook/controllers/addressBook.controller.js",

    "build/app/vmnr/vmnr.module.js", "build/app/vmnr/config.route.js",
    "build/app/vmnr/controllers/vmnr.controller.js",
    "!build/app/**/*.spec.js",

    projectPath.app_css
];

projectPath.app_dev = ['vendor/lodash/lodash.js', 'vendor/angular/angular.js', 'vendor/angular-animate/angular-animate.js', 'vendor/angular-aria/angular-aria.js', 'vendor/angular-material/angular-material.js', 'vendor/angular-ui-router/release/angular-ui-router.js', "build/app/app.module.js", "build/app/core/core.module.js", "build/app/core/values/settings.value.js", "build/app/core/values/user.value.js", "build/app/core/route-service.js", "build/app/core/controllers/auth.controller.js", "build/app/core/factories/requestService.factory.js", "build/app/chr/chr.module.js", "build/app/chr/config.route.js", "build/app/chr/controllers/chr.controller.js", "build/app/addressBook/addressBook.module.js", "build/app/addressBook/config.route.js", "build/app/addressBook/controllers/addressBook.controller.js", "build/app/vmnr/vmnr.module.js", "build/app/vmnr/config.route.js", "build/app/vmnr/controllers/vmnr.controller.js", "!build/app/**/*.spec.js", projectPath.app_css];

projectPath.theme = 'style/theme/variables.scss';

projectPath.sass = ['vendor/angular-material/angular-material.scss', 'src/style/*.scss'];

projectPath.themeSass = [];

projectPath.karma = ['build/vendor/angular/angular.js', 'build/vendor/angular-mocks/angular-mocks.js', 'build/app/ng-app.js', 'build/app/ng-app.spec.js'];

module.exports = projectPath;