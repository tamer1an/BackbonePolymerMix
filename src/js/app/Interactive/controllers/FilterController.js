'use strict';

angular.module( "Interactive" )
       .controller( "FilterController", [ '$scope', 'Dispatcher', function( $scope, Dispatcher ){
            $scope.activate = function( filter ){
                $scope.filters.activate( filter );
                Dispatcher.dispatch( 'filter.activated', filter );
            };
       }]);