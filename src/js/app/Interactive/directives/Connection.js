'use strict';

angular.module('Interactive')
       .directive('connection', function() {
            return {
                restrict: 'A',
                replace: false,
                templateUrl: 'html/directives/connection.html',
                controller: 'ConnectionController'
            };
        });
