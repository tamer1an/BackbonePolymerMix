'use strict';

angular
    .module('Interactive')
    .controller('AlarmsController', ['$scope', 'FilterSimple', 'Subscription', 'Dispatcher', 'NormalizerFactory', 'CollectionAlarms', function ($scope, Filter, Subscription, Dispatcher, NormalizerFactory, CollectionAlarms ) {
        $scope.alarms = CollectionAlarms;
        $scope.key = null;
        $scope.filters = Filter.setTargetField('alarm_type');
        $scope.normalizer = NormalizerFactory.dateTime();

        Subscription
            .subscribe( "alarms" )
            .then( null, null, function( data ){
                if (angular.isDefined(data.content)) {
                    $scope.alarms.merge( $scope.normalizer.normalize(data.content) );
                    $scope.filters.update($scope.alarms);
                }
            });
    }]);

