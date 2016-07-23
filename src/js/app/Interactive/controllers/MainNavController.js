'use strict';

angular.module('Interactive')
    .controller('MainNavController', function($scope, $timeout, $mdSidenav, $log, $location) {

        $scope.menuList = ['Alarms', 'Cameras', 'Alerts', 'Devices', 'Events', 'Settings'];
        $scope.location = $location;

        $scope.close = function() {
            $mdSidenav('left').close();
        };
    });