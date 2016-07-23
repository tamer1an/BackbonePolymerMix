'use strict';

angular.module('Interactive')
    .directive('camera', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/camera.html',
            controller: 'CameraController',
            scope:{
                camera: "="
            }
        };
    });
