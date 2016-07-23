'use strict';

angular.module('Interactive')
       .directive('armState', function() {
            return {
                restrict: 'C',
                replace: true,
                templateUrl: 'html/directives/armState.html',
                controller: 'ArmStateController'
            };
        });
