'use strict';

angular.module('Interactive')
    .controller('ArmStateButtonArmController',[ '$scope', '$controller', 'Subscription', function( $scope, $controller, Subscription ){
        $scope.selfStates = [ "away", "away.instant", "away.latchkey" ];
        $scope.isBlocked = true;
        $scope.state = null;
        $scope.selectedOpt = 'Arm Away';

        $controller('ArmStateButtonMixin', { $scope: $scope });

        Subscription
            .subscribe( "status" )
            .then( null, null, function( data ){
                $scope.isBlocked = data.content.is_connected !== 1;
                switch( data.content.state ){
                    case "Away":
                        $scope.setActive();
                        break;
                    case "ExitDelayAway":
                        $scope.setActivating();
                        break;
                    default:
                        $scope.setInactive();
                        break;
                }
            });
    }]);
