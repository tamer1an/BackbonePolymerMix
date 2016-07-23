(function() {
    'use strict';

    angular.module('app.core', [])
        .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log, $location) {

            $scope.menu = {
                items: [/*{
                        href: '/addressBook',
                        title:'Address Book'
                    },*/ {
                        href: '/chr',
                        title:'Calculator'
                    }/*, {
                        href: '/vmnr',
                        title:'Voice notification'
                    }*/],
                prefix: '#'
            };

            $scope.selected = $location.url();
            $scope.loc = $location;

            $scope.close = function () {
                $mdSidenav('left').close()
                    .then(function () {
                        $log.debug("close LEFT is done");
                    });
            };
        });
})();