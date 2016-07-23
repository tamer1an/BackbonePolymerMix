(function() {
    'use strict';

    angular
        .module('app.chr')
        .controller('chrController', chrController);

    chrController.$inject = ['$scope','$mdDialog','$mdMedia','requestServiceFactory','User'];

    function chrController($scope, $mdDialog, $mdMedia, requestServiceFactory, User) {
        $scope.user = User;
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.navigateTo = () => { };

        //if (User.getSession().is_logged){

        //}
    }
})();