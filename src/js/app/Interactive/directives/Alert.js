'use strict';

angular.module('Interactive')
       .directive('alert', function() {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'html/directives/alert.html',
                controller: 'AlertController',
                scope:{
                    alert: "="
                }
            };
        });
