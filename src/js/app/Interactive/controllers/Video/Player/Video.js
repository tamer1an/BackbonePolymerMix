'use strict';

angular.module('Interactive')
    .controller('VideoPlayerVideoController', ['$scope', '$filter', function ($scope, $filter) {
        $scope.path = "";

        $scope.$watch('source', function (source) {

            if (angular.isUndefined(source)) {
                return false;
            }

            source('mp4').then(function (data) {
                $scope.path = data.path + '?' + Math.random().toExponential();
            });
        });
    }]);
