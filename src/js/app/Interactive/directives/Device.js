'use strict';

angular
    .module('Interactive')
    .directive('device', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/device.html',
            controller: 'DeviceController',
            scope: {
                device: "="
            }
        };
    });
