'use strict';

angular.module( "Interactive")
    .directive( "videoPlayerVideo", function(){
        return {
            restrict: 'AEC',
            replace: true,
            templateUrl: 'html/directives/video/player/video.html',
            controller: 'VideoPlayerVideoController',
            scope: {
                source: "=source"
            }
        };
    });