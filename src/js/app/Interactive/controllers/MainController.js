'use strict';

angular.module('Interactive')
    .controller('MainController', ['$scope', '$timeout', '$mdSidenav', '$log', 'Dispatcher', "$mdToast", "IdleTimer", function($scope, $timeout, $mdSidenav, $log, Dispatcher, $mdToast, IdleTimer ) {
        $scope.showContent = false;

        Dispatcher.observe( "auth.signedIn", function(){
            $scope.showContent = true;
            IdleTimer.run();
        });

        Dispatcher.observe( "auth.signedOut", function(){
            $scope.showContent = false;
            IdleTimer.stop();
        });

        Dispatcher.observe( "command.badRequest", function( event, data ){
            Dispatcher.dispatch( "error.show", data );
        });
        
        $scope.click = function(){
            Dispatcher.dispatch( "timer.refresh" );
        };

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left is done");
                });
        };
    }]);
