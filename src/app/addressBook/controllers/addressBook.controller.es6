(function() {
    'use strict';

    angular
        .module('app.addressBook')
        .controller('AddressBookController', [
            '$scope',
            '$mdMedia',
            '$state',
            'RequestServiceFactory',
            'User',
            'settings', AddressBookController]);

    /** addressBook list Controller in addressBook module
     *  name   {AddressBookController}
     *  params {$scope, $mdDialog, $state, RequestServiceFactory, User, settings}
     *  init   {User, settings} params resoled by config.route.es6
     * */
    function AddressBookController($scope, $mdMedia, $state, RequestServiceFactory, User, settings) {
        settings.checkSession(User.getSession(),$state);

        $scope.user = User;
        $scope.users = User.addressBook;
        // $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        // if(User.userSession.is_logged){
        //
        // }
    }
})();