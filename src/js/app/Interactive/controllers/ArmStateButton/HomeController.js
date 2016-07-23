'use strict';

angular.module('Interactive')
    .controller('ArmStateButtonHomeController',[ '$scope', 'Subscription', '$controller', function( $scope, Subscription, $controller ){
        $scope.selfStates = [ "home", "home.instant" ];
        $scope.isBlocked = true;
        $scope.state = null;
        $scope.selectedOpt = 'Home';

        $controller('ArmStateButtonMixin', { $scope: $scope });

        Subscription
            .subscribe( "status" )
            .then( null, null, function( data ){
                $scope.isBlocked = data.content.is_connected !== 1;
                switch( data.content.state ){
                    case "Home":
                        $scope.setActive();
                        break;
                    case "ExitDelayHome":
                        $scope.setActivating();
                        break;
                    default:
                        $scope.setInactive();
                        break;
                }
            });
    }]);
