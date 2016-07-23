'use strict';

angular
    .module( 'Data' ,[
        'ngCookies',
        'restangular',
        'emguo.poller',
        'Events',
        'angular-md5',
        'pascalprecht.translate'
    ])

    .constant( "accessTokenHeaderName", "Session-Token" )

    .config( [ 'RestangularProvider', "StorageProvider", function( RestangularProvider, StorageProvider ){
        RestangularProvider.setBaseUrl( '/rest_api/2.0/' );

        RestangularProvider.setDefaultHeaders({
            "Content-Type": "application/json"
        });

        StorageProvider.setDriver( "cookie" );
    }])

    .run([ 'Init', function( init ){
        init();
    }]);


