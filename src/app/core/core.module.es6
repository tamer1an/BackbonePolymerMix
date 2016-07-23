(function() {
    'use strict';

    angular.module('app.core', [])
        .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log, $location) {
            $scope.loc = $location;
            $scope.selected = $location.url();

            $scope.menu = {
                items: [{
                    icon: 'contact-mail',
                    href: '/addressBook',
                    title:'Address Book',
                    desc: 'Company address book'
                },{
                    icon: 'call-split',
                    href: '/chr',
                    title:'Call Handling',
                    desc: 'Call handling rules settings'
                },{
                    icon: 'voicemail',
                    href: '/vmnr',
                    title:'Notifications',
                    desc: 'Voice notification rules settings'
                }],
                prefix: '#',
                icon_prefix:'mdi'
            };

            $scope.close = function () {
                $mdSidenav('left').close()
                    .then(function () {
                        $log.debug('close LEFT is done');
                    });
            };
        });
})();
