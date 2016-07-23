'use strict';

angular.module('Interactive')
       .directive('user', function() {
            return {
                restrict: 'A',
                replace: false,
                templateUrl: 'html/directives/user.html',
                controller: 'UserController'
            };
        });
