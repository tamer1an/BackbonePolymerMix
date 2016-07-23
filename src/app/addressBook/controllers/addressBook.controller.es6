(function() {
    'use strict';

    angular
        .module('app.addressBook')
        .controller('addressBookController', addressBookController);

    addressBookController.$inject = ['$scope','$mdMedia','requestServiceFactory','User'];

    function addressBookController($scope, $mdMedia, requestServiceFactory, User) {
        $scope.users = [];
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    }
})();