'use strict';

// todo Refactor and replace DataNormalizer
angular.module('Interactive')
       .controller('AlertsController', [ '$scope', 'Subscription', 'NormalizerFactory', 'CollectionAlerts', function( $scope, Subscription, NormalizerFactory, CollectionAlerts ){
            $scope.alerts = CollectionAlerts;
            $scope.normalizer = NormalizerFactory.dateTime();

            Subscription
                .subscribe( 'alerts' )
                .then( null, null, function( data ){
                    if( angular.isDefined( data.content ) ){
                        $scope.alerts.merge( $scope.normalizer.normalize( data.content ) );
                    }
                });
        }]);