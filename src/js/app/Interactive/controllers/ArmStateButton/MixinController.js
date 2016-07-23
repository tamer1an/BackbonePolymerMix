'use strict';

angular.module('Interactive')
    .controller('ArmStateButtonMixin', [ '$scope', '$timeout', 'Dispatcher', function( $scope, $timeout, dispatcher ){
        $scope.previousClass = "";
        $scope.class = "";

        $scope.setActive = function(){
            $scope.setClass( "active" );
        };

        $scope.setActivating = function(){
            $scope.setClass( "activating" );
        };

        $scope.setInactive = function(){
            $scope.setClass("");
        };

        $scope.setClass = function( className ){
            $scope.previousClass = $scope.class;
            $scope.class = className;
        };

        $scope.setPreviousClass = function(){
            $scope.setClass( $scope.previousClass );
        };

        $scope.isSelfState = function( state ){
            return ( $scope.selfStates.indexOf( state ) > -1 );
        };

        $scope.$watch( 'state', function( state ){
            if( state !== null ){
                $scope.command( state );
            }
        });

        $scope.command = function( state ){
            dispatcher.dispatch( "command.state.change", state );
        };

        dispatcher.observe( "command.state.changing", function( event, state ){
            if( $scope.isSelfState( state ) ){
                $scope.setActivating();
            }
            else{
                $scope.setInactive();
            }
        });
    }]);
