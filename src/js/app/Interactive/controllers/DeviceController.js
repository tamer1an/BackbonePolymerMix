'use strict';

angular.module('Interactive')
    .controller('DeviceController', [ '$scope', "Dispatcher", "$translate", function( $scope, Dispatcher, $translate ){
        $scope.bypass = function(){
            if( $scope.device.bypass_availability ){
                $scope.bypassProccess = true;

                Dispatcher.dispatch( "command.bypass", {
                    zone: $scope.device.zone,
                    state: ! $scope.device.bypass
                });
            }
        };

        $scope.$watch( "device.bypass", function( bypass ){
            $scope.bypassProccess = false;

            (bypass ? $translate("BYPASSED") : $translate("BYPASS")).then(function( text ){
                $scope.bypassLabel = text;
            });
        } );
    }] );