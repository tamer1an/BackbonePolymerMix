(function() {
    'use strict';

    angular.module('app.core', [])
        .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log, $location) {

            $scope.menu = {
                items: [/*{
                    icon: 'account-box',
                    href: '/#',
                    title:'Profile',
                    desc: "Profile settings page"
                },{
                    icon: 'message-text-outline',
                    href: '/#',
                    title:'Messages',
                    desc: "Messages log"
                },*/{
                    icon: 'contact-mail',
                    href: '/addressBook',
                    title:'Contacts',
                    desc: "Company address book"
                },{
                    icon: 'call-split',
                    href: '/chr',
                    title:'Call Handling',
                    desc: "Call handling rules settings"
                },{
                    icon: 'voicemail',
                    href: '/vmnr',
                    title:'Voice Notifications',
                    desc: "Voice notification rules settings"
                }/*,{
                    icon: 'settings',
                    href: '/#',
                    title:'Settings',
                    desc: "Application settings"
                },{
                    icon: 'fax',
                    href: '/#',
                    title:'Send a Fax',
                    desc: "Fax settings"
                }*/],
                prefix: '#',
                icon_prefix:'mdi'
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
