'use strict';

angular.module('Interactive')
    .directive('videoCamera', function () {
        return {
            restrict: 'AC',
            replace: true,
            templateUrl: 'html/directives/video/camera.html',
            controller: 'VideoCameraController',
            scope: {
                camera: "=ngVideoCamera"
            }
        };
    });
