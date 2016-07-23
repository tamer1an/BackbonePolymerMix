'use strict';

angular.module('Interactive')
       .controller('StatusController',['$scope','Dispatcher', function( $scope, dispatcher ){
            $scope.login = function(){
                dispatcher.dispatch('auth.signIn',{});
            };

            $scope.logout = function(){
                dispatcher.dispatch('auth.signOut');
            };
    }]);
