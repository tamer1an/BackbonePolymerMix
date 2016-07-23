'use strict';

angular
    .module("Interactive")
    .service( "ErrorHandler", [ "Dispatcher", "$mdToast", "$rootScope", function( Dispatcher, $mdToast, $rootScope ){
        Dispatcher.observe( "error.show", function( e, data ){
            $mdToast.show({
                templateUrl: "html/controllers/error-toast.html",
                controller: "ErrorController",
                scope: angular.extend( $rootScope.$new(), data ),
                hideDelay: false
            });
        });
    }]);
