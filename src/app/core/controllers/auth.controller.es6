(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AuthController', authController);

    authController.$inject = ['$scope','$state','$mdMedia','requestServiceFactory','User', '$timeout', '$mdSidenav', '$log'];

    function authController($scope, $state, $mdMedia, requestServiceFactory, User,  $timeout, $mdSidenav, $log) {
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.textSize = {'font-size':(($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen)?'90%':'100%'};
        $scope.toggleLeft = buildDelayedToggler('left');

        $scope.login = function(){
            User.getSession().is_logged = true;

            if (User.getSession().is_logged){
                $state.go('chr');
            } else {

            }
        };
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                let context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }
    }
})();