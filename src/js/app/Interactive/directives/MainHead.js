'use strict';

angular.module('Interactive')
       .directive('mainHead', function() {
            return {
                restrict: 'C',
                replace: true,
                templateUrl: 'html/directives/mainHead.html',
                controller: 'StatusController'
            };
        });
