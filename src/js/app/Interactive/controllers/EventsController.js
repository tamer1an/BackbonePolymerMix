"use strict";

angular
    .module( "Interactive" )
    .controller( "EventsController", [ "$scope", "Subscription", "FilterDate", "NormalizerFactory", function( $scope, Subscription, FilterDate, NormalizerFactory ){
        $scope.events = [];
        $scope.filters = FilterDate;
        $scope.normalizer = NormalizerFactory.simple();

        Subscription
            .subscribe( "events" )
            .then( null, null, function( data ){
                $scope.events = $scope.normalizer.normalize( data.content );
                $scope.filters.update( $scope.events );
            });

    }]);