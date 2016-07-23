"use strict";

angular
    .module( "Interactive" )
    .controller( "SettingsController", [ "$scope", "$translate", "$mdToast", "Dispatcher", function( $scope, $translate, $mdToast, Dispatcher ){
        $scope.$on( "timer.saved", function( e ){
            $translate( "Timer saved" ).then( $scope.showToast );
            Dispatcher.dispatch( "timer.changed" );
            e.stopPropagation();
        });

        $scope.$on( "language.saved", function( e ){
            $translate( "Language saved" ).then( $scope.showToast );
            e.stopPropagation();
        });


        $scope.showToast = function( message ){
            $mdToast.show(
                $mdToast
                    .simple()
                    .content( message )
                    .hideDelay( 3000 )
            );

        };
    }]);