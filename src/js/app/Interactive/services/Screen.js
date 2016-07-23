'use strict';

angular.module("Interactive")
    .service( "Screen", [ '$mdMedia', function( $mdMedia ){
        return {
            watch: function( $scope, screenSizes, callback ){
                var self = this;

                angular.forEach( screenSizes, function( observedScreen ){
                    $scope.$watch(
                        function(){
                            return $mdMedia( observedScreen );
                        },
                        function( isSize ){
                            self[observedScreen] = isSize;
                            if( isSize ){
                                self.currentScreen = observedScreen;
                                callback();
                            }
                        }
                    );
                });
            }
        };
    }]);