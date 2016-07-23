'use strict';

angular
    .module('Interactive')
    .controller('CamerasController', ["$scope", "Subscription", "FilterSimple", "NormalizerFactory", "CollectionCameras", function ($scope, Subscription, Filter, NormalizerFactory, CollectionCameras ) {
        $scope.cameras = CollectionCameras;
        $scope.key = null;

        $scope.filters = Filter;
        $scope.filters.setTargetField('location');

        $scope.normalizer = NormalizerFactory.simple();

        Subscription
            .subscribe('cameras')
            .then(null, null, function ( data ){
                if (angular.isDefined(data.content)) {
                    $scope.cameras.merge( $scope.normalizer.normalize(data.content) );
                    $scope.filters.update( $scope.cameras );
                }
            });
    }]);