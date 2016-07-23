'use strict';

angular.module( "Interactive")
    .directive( "videoPlayerFrame", function(){
        return {
            restrict: 'AEC',
            replace: true,
            templateUrl: 'html/directives/video/player/frame.html',
            controller: 'VideoPlayerFrameController',
            scope: {
                source: "=source"
            }
        };
    });