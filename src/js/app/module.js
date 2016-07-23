'use strict';

angular.module('InteractiveApplication', [
    'ngCookies',
    'ngRoute',
    'Interactive',
    'Events',
    'Data',
    'ngMaterial',
    'pascalprecht.translate'
]);

angular
    .module('InteractiveApplication')

    .config(['$routeProvider', '$translateProvider', '$mdThemingProvider', function( $routeProvider, $translateProvider, $mdThemingProvider ){
        $routeProvider
            .when('/alarms', {
                templateUrl: "html/controllers/alarms.html",
                controller: 'AlarmsController',
                reloadOnSearch: true
            })
            .when('/alerts', {
                templateUrl: "html/controllers/alerts.html",
                controller: 'AlertsController',
                reloadOnSearch: false
            })
            .when('/cameras', {
                templateUrl: 'html/controllers/cameras.html',
                controller: 'CamerasController',
                reloadOnSearch: false
            })
            .when('/settings', {
                templateUrl: 'html/controllers/settings.html',
                controller: 'SettingsController',
                reloadOnSearch: false
            })
            .when('/events', {
                templateUrl: 'html/controllers/events.html',
                controller: 'EventsController',
                reloadOnSearch: false
            })
            .when('/devices', {
                templateUrl: 'html/controllers/devices.html',
                controller: 'DevicesController',
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/alarms'
            });

        $translateProvider.useMessageFormatInterpolation();
        $translateProvider.preferredLanguage( 'en' );
        $translateProvider.useLoader( 'InteractiveLoader', [
            {
                prefix: 'languages/',
                suffix: '.json',
                language: true
            },
            {
                prefix: 'js/vendor/messageformat/locale/',
                suffix: '.js',
                locale: true
            }
        ]);

        $mdThemingProvider.definePalette('visonic', $mdThemingProvider.extendPalette( 'blue', {
            '50': 'e1f0fc',
            '100': 'b9daf7',
            '200': '8fc4f2',
            '300': '61abed',
            '400': '3f99e9',
            '500': '1e88e5',
            '600': '1b7bd0',
            '700': '186eba',
            '800': '1560a2',
            '900': '0f4777',

            'A100': '80c4ff',
            'A200': '40a6ff',
            'A400': '0088ff',
            'A700': '006deb'
        }));

        $mdThemingProvider.theme('default')
            .primaryPalette('visonic')
            .accentPalette('red')
            .warnPalette('red');

        $mdThemingProvider.theme('dark')
            .primaryPalette('visonic')
            .dark();
    }])

    .run([ "Storage", "$translate", "ErrorHandler", function( storage, $translate, ErrorHandler ){
        var storedLanguage = storage.get( 'language' );
        if( storedLanguage ){
            $translate.use( storedLanguage );
        }
    }]);


