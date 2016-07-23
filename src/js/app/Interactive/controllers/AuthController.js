'use strict';

angular.module('Interactive')
    .controller( 'AuthController', [ '$scope', 'Dispatcher', function( $scope, Dispatcher ){
        $scope.isLoggedIn = false;
        $scope.isFirstLogin = true;
        $scope.signInError = false;

        $scope.form = {
            pristine: false
        };

        Dispatcher.observe( "auth.failed", function( event, data ){
            $scope.signInError = data.message;
        });

        Dispatcher.observe( "auth.signedIn", function(){
            $scope.isLoggedIn = true;
            $scope.isFirstLogin = false;
        });

        Dispatcher.observe( "auth.expired", function(){
            $scope.isLoggedIn = false;
        });
        Dispatcher.observe( "auth.signedOut", function(){
            $scope.isLoggedIn = false;
        });
    }]);
