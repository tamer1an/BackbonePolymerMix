'use strict';

angular.module('Interactive')
    .controller('AlertController', [ '$scope', 'PrettifyAlert', function( $scope, prettifyAlert ){

        $scope.$watch('alert', function (alert) {
            if (alert === null) {
                return;
            }

            prettifyAlert(alert).then(function( data ){
                $scope.title = data.title;
                $scope.icon = data.icon;
            });
        });

    }] );