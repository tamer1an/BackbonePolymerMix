// import "babel-polyfill";

(function() {
    'use strict';

    angular.module('app', [
        'ngMaterial',
        'ui.router',
        'app.core',
        'app.chr',
        'app.vmnr',
        'app.addressBook'
    ]).config(['$mdThemingProvider', function($mdThemingProvider){

        $mdThemingProvider.definePalette('zultys-dark', $mdThemingProvider.extendPalette('blue-grey', {
            '500': '28394C'
        }));

        $mdThemingProvider.definePalette('zultys', $mdThemingProvider.extendPalette('green', {

        }));

        $mdThemingProvider.theme('zultys')
             .primaryPalette('zultys')
             .accentPalette('green');

        $mdThemingProvider.theme('zultys-dark')
             .dark()
             .primaryPalette('zultys-dark')
             .accentPalette('red');

        $mdThemingProvider.setDefaultTheme('zultys');
    }]);
})();


// Config example
// $mdThemingProvider.theme('default')
//     .primaryPalette('pink', {

            //'50': 'd11818',
            //'100': 'd11818',
            //'200': 'd11818',
            //'300': 'd11818',
            //'400': 'd11818',
            //'500': '334663',
            //'600': 'd11818',
            //'700': 'd11818',
            //'800': 'd11818', // base color
            //'900': 'd11818',
            // 'A100': '28394c',
            // 'A200': 'd11818',
            // 'A400': 'd11818',
            // 'A700': '334663'

            // 'default': '400', // by default use shade 400 from the pink palette for primary intentions
            // 'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            // 'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
            // 'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class

            // 'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
            //// on this palette should be dark or light
            // 'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            // '200', '300', '400', 'A100'],
            // 'contrastLightColors': undefined    // could also specify this if default was 'dark'
            //     })

//     // If you specify less than all of the keys, it will inherit from the
//     // default shades
//     .accentPalette('purple', {
//         'default': '200' // use shade 200 for default, and keep all other shades the same
//     });

// Default
//$mdThemingProvider.theme('default')
//    .backgroundPalette('red')
//    .primaryPalette('green')
//    .warnPalette('grey')
//    .accentPalette('red');