'use strict';

angular.module('Interactive')
    .directive('armStateButtonDisarm', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/armStateButton/Disarm.html',
            controller: 'ArmStateButtonDisarmController',
            scope: {}
        };
    });
