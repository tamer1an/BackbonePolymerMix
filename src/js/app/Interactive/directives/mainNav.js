'use strict';

angular.module('Interactive')
       .directive('mainNav', function() {
            return {
                restrict: 'C',
                replace: true,
                templateUrl: 'html/directives/mainNav.html',
                controller: 'MenuController'
            };
        });
