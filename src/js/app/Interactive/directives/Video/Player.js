'use strict';

angular.module( "Interactive")
    .directive( "videoPlayer", function(){
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/video/player.html',
            controller: 'VideoPlayerController',
            scope:{
                source: "=source"
            }
        };
    });
