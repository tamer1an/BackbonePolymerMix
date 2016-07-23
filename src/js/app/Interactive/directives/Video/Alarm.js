'use strict';

angular.module('Interactive')
    .directive('videoAlarm', function () {
        return {
            restrict: 'AC',
            replace: true,
            templateUrl: 'html/directives/video/alarm.html',
            controller: 'VideoAlarmController',
            scope: {
                alarm: "=ngAlarm"
            }
        };
    });
