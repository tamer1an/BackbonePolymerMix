'use strict';

angular.module('Interactive')
    .directive('armStateButtonHome', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/armStateButton/Home.html',
            controller: 'ArmStateButtonHomeController',
            scope: {}
        };
    });
