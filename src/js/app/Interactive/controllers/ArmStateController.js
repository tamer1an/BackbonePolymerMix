'use strict';

angular.module('Interactive')
       .controller('ArmStateController',[ '$scope', 'Subscription', 'Dispatcher', function( $scope, Subscription, Dispatcher){
            //@translate:'Connected'
            //@translate:'Not connected'
            //@translate:'No network'

            //@translate:'Ready'
            //@translate:'Not ready'
            //@translate:'N/A'

            var bulletColors = {
                connected:'#49fe50',
                offline:'red',

                ready:'#49fe50',
                notReady:'red',

                noNetwork:'lightgray'
            };

            $scope.isConnected      = false;
            $scope.isNetworkOffline = false;
            $scope.readyStatus      = "Unknown";

            $scope.getConnectionState = function(){
                if($scope.isNetworkOffline){
                    return "noNetwork";
                }else if($scope.isConnected){
                    return "connected";
                } else {
                    return "offline";
                }
            };
            $scope.getReadyState = function(){
               if($scope.isNetworkOffline) {
                    return "noNetwork";
               }else if($scope.readyStatus.toLowerCase()==='ready'){
                    return "ready";
               } else {
                    return "notReady";
               }
            };

            $scope.getBulletColor = function(getter){
                return bulletColors[$scope[getter]()];
            };

            Subscription
                .subscribe( "status" )
                .then( null, null, function( data ){
                    $scope.isConnected = data.content.is_connected;
                    $scope.readyStatus = data.content.ready_status;
                    $scope.connectedStatus = data.content.is_connected? "Connected" : "Not connected";
                });

            Dispatcher.observe("network.*", function(name){
                if (($scope.isNetworkOffline = name.search("offline") !== -1)){
                    $scope.readyStatus = "N/A";
                    $scope.connectedStatus = "No network"
                }
            });
       }]);