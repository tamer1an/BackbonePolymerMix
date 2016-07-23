(function() {
    'use strict';

    angular
        .module('app.addressBook')
        .controller('addressBookController', [
            '$scope',
            '$mdMedia',
            '$state',
            'requestServiceFactory',
            'User',
            'settings', addressBookController]);

    function addressBookController($scope, $mdMedia, $state, requestServiceFactory, User, settings) {
        settings.checkSession(User.getSession(),$state);

        $scope.users = [];
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        requestServiceFactory.users.getList()
            .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }

                    response.json().then((function(data) {
                        this.users = data.users;
                        this.$apply();
                    }).bind(this));

                }).bind($scope))
            .catch(err => console.log('Fetch Error :-S', err));
    }
})();