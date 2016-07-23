'use strict';

angular.module( "Interactive")
    .directive( "videoPreview", function(){
        return {
            restrict: 'AEC',
            replace: true,
            templateUrl: 'html/directives/video/preview.html',
            controller: 'VideoPreviewController',
            scope:{
                preview:  "=ngPreview",
                selected: "="
            }
        };
    });