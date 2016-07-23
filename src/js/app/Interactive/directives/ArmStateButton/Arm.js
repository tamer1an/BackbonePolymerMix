'use strict';

angular.module('Interactive')
    .directive('armStateButtonArm', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/armStateButton/Arm.html',
            controller: 'ArmStateButtonArmController',
            scope: {}
        };
    });
