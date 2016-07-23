'use strict';

angular.module('Interactive')
    .controller('ArmStateButtonDisarmController',[ '$scope', 'Subscription', '$controller', function( $scope, Subscription, $controller ){
        $scope.selfStates = [ "disarm" ];
        $scope.isBlocked = true;
        $scope.state = null;

        $controller('ArmStateButtonMixin', { $scope: $scope });

        Subscription
            .subscribe( "status" )
            .then( null, null, function( data ){
                $scope.isBlocked = data.content.is_connected !== 1;
                if( data.content.state === "Disarm" ){
                    $scope.setActive();
                }
                else{
                    $scope.setInactive();
                }
            });

        $scope.disarm = function(){
            $scope.command( 'disarm' );
        };
    }]);
