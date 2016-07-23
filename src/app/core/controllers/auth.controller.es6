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

        $scope.login = function(name,pass){
            if (User.getSession().is_logged){
                 $state.go('chr');
            } else {
                 $state.go('post');
            }
        };

        $scope.logout = function(){
            User.getSession().is_logged = false;
            $state.go('login');
        };
    }

    function Appearance($mdSidenav, $timeout, $mdMedia) {
        let s;

        this.init = function(scope){
            s = scope;

            s.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            s.textSize = {'font-size':(($mdMedia('sm') || $mdMedia('xs'))  && s.customFullscreen)?'90%':'100%'};
            s.toggleLeft = buildDelayedToggler('left');
        };

        function debounce(func, wait, context) {
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