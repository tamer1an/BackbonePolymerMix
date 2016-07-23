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

        $mdThemingProvider.definePalette('zultys-dark', $mdThemingProvider.extendPalette('blue-grey', {
            //'50': 'd11818',
            //'100': 'd11818',
            //'200': 'd11818',
            //'300': 'd11818',
            //'400': 'd11818',
            '500': '334663',
            //'600': 'd11818',
            //'700': 'd11818',
            //'800': 'd11818', // base color
            //'900': 'd11818',
            'A100': '28394c',
            'A200': 'd11818',
            //'A400': 'd11818',
            //'A700': '334663'

        }));


        $mdThemingProvider.definePalette('zultys', $mdThemingProvider.extendPalette('green', {
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
            //'A100': '28394c',
            //'A200': 'd11818',
            //'A400': 'd11818',
            //'A700': '334663'

        }));

         $mdThemingProvider.theme('zultys-dark')
             .dark()
             .primaryPalette('zultys-dark')
             //.warnPalette('grey')
             .accentPalette('red');

        $mdThemingProvider.theme('zultys')
             //.dark()
             .primaryPalette('zultys')
             //.warnPalette('grey')
             .accentPalette('red');

        //$mdThemingProvider.theme('default')
        //    .primaryPalette('green')
        //    .warnPalette('grey')
        //    .accentPalette('red');

        $mdThemingProvider.setDefaultTheme('zultys');
    }]);
})();