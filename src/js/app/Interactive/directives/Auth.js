'use strict';

angular.module('Interactive')
    .directive('auth', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'html/directives/auth.html',
            controller: 'AuthController'
        };
    });
