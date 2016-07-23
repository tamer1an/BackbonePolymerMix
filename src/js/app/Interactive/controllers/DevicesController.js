"use strict";

angular
    .module("Interactive")
    .controller("DevicesController", ["$scope", "Subscription", "FilterDevice", "CollectionDevices", function ($scope, Subscription, filter, CollectionDevices ){
        $scope.devices = CollectionDevices;
        $scope.filters = filter;

        Subscription
            .subscribe( "devices" )
            .then( null, null, function( data ){
                if ( angular.isDefined( data.content ) ) {
                    $scope.devices.merge( data.content );
                    $scope.filters.update( $scope.devices );
                }
            });
    }]);