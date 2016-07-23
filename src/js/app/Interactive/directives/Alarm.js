'use strict';

/* ========== Base menu panel ==========*/
angular.module('Interactive').directive('alarm', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'html/directives/alarm.html',
        controller: 'AlarmController',
        scope: {
            alarm: "="
        }
    };
});
