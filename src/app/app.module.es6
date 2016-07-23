(function() {
    'use strict';

    angular.module('app', [
        'ngMaterial',
        'ui.router',
        'app.core',
        'app.chr',
        'app.vmnr',
        'app.addressBook'

    ]).config(['$mdThemingProvider', function( $mdThemingProvider ){
        //$mdThemingProvider.definePalette('zultys-dark', $mdThemingProvider.extendPalette( 'black', {
        //    '50': 'd11818',
        //    '100': 'd11818',
        //    '200': 'd11818',
        //    '300': 'd11818',
        //    '400': 'd11818',
        //    '500': 'ffffff',
        //    '600': 'd11818',
        //    '700': 'd11818',
        //    '800': 'd11818', // base color
        //    '900': 'd11818',
        //    'A100': 'd11818',
        //    'A200': 'd11818',
        //    'A400': 'd11818',
        //    'A700': 'd11818'
        //}));
        // $mdThemingProvider.theme('zultys')
        //     .warnPalette('red')
        //     .primaryPalette('grey')
        //     .light();
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .warnPalette('grey')
            .accentPalette('red');
    }]);
})();