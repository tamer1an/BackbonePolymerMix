(function() {
    'use strict';

    angular
        .module('app.vmnr')
        .controller('vmnrController', vmnrController);

    vmnrController.$inject = ['$scope', '$mdDialog','$mdMedia','requestServiceFactory','User'];

    function vmnrController($scope, $mdDialog, $mdMedia, requestServiceFactory, User) {
        $scope.user = User;
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    }
})();