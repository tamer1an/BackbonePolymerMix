'use strict';

angular.module('Interactive')
    .controller('VideoPlayerFrameController', function( $scope, $log ){
        $scope.frames = [];

        $scope.activateFrame = function(key){
            $scope.active = key;
        };

        $scope.$watch( 'source', function( source ){
            if( angular.isUndefined( source ) ){
                return false;
            }

            source().then( function( data ){
                $scope.active = 0;
                $scope.noCache = '?' + Math.random().toExponential();
                $scope.frames = window._.uniq( data.frames );
            });
        });
    });
