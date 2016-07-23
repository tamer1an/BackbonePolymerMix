'use strict';

angular.module('Interactive')
    .controller('AlarmController', ['$scope', 'Dispatcher', 'CamerasPreviewsSubscription', '$mdDialog', 'PrettifyAlarm', function ($scope, Dispatcher, CamerasPreviewsSubscription, $mdDialog, prettifyAlarm) {
        $scope.isSelected = false;
        $scope.videosCount = 0;

        $scope.$watch('alarm', function (alarm) {
            if (alarm === null) {
                return;
            }

            prettifyAlarm(alarm).then(function( data ){
                $scope.title = data.title;
                $scope.icon = data.icon;
            });

            CamerasPreviewsSubscription
                .subscribeByEventId( alarm.evt_id )
                .then( function (videoPreviews) {
                    $scope.videosCount = videoPreviews.length;
                });
        });

        $scope.showAdvanced = function (event) {
            $mdDialog
                .show({
                    controller: 'VideoAlarmController',
                    templateUrl: 'html/directives/video/alarm.html',
                    scope: angular.extend($scope.$new(), {alarm: $scope.alarm}),
                    disableParentScroll: false,
                    targetEvent: event
                });
        };
    }]);
