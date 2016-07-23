(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AuthController', [
            '$scope',
            '$state',
            'Appearance',
            'User',
            'Settings',
            authController
        ])
        .service('Appearance', Appearance);

    Appearance.$inject = [
        '$mdSidenav',
        '$timeout',
        '$mdMedia'
    ];

    function authController($scope, $state, Appearance, User, settings){
        $scope.Settings = settings;
        $scope.User = User;

        Appearance.init($scope);

        $scope.login = function(login,pass){
            $scope.User.userEntity.login = login;
            if (User.getSession().is_logged){
                 $state.go('chr');
            } else {
                 $state.go('post',{pass:pass});
            }
        };

        $scope.logout = function(){
            User.getSession().is_logged = false;
            $state.go('login');
        };
    }

    function Appearance($mdSidenav, $timeout, $mdMedia) {
        let s;

        this.init = function(s){
            s.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            s.toggleLeft = buildDelayedToggler('left');
            // s.textSize = {'font-size':(($mdMedia('sm') || $mdMedia('xs'))  && s.customFullscreen)?'90%':'100%'};
        };

        function debounce(func, wait) {
            var timer;
            return function debounced() {
                let context = s,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        function buildDelayedToggler(navID) {
            return debounce(function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        //$log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }
    }
})();