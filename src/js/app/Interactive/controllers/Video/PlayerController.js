'use strict';

angular.module('Interactive')
    .controller('VideoPlayerController', [ '$scope', function( $scope ){
        $scope.mode = "frame";

        $scope.isVideo = function(){
            return $scope.mode === "video";
        };

        $scope.isFrame = function(){
            return $scope.mode === "frame";
        };
    }]);