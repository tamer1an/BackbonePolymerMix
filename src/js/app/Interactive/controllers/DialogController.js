'use strict';

angular.module( "Interactive" )
    .controller( "DialogController", [ '$scope', '$mdDialog', 'Dispatcher', function( $scope, $mdDialog, Dispatcher ){

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.click = function() {
            Dispatcher.dispatch( "timer.refresh" );
        };

    }]);