'use strict';

angular
    .module('Interactive')
    .directive('event', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/event.html',
            controller: 'EventController',
            scope:{
                event: "=ngEvent"
            }
        };
    });
